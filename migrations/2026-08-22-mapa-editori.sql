-- ==========================================================================
-- Mapa konceptů — víc editorů (garanti, konzultanti)
-- ==========================================================================
-- Model: účet `aidetem` = admin (ověřuje se původním SHA-256 heslem). Admin
-- přidává další editory na e-mail a rovnou jim přiděluje heslo. Editoři se pak
-- přihlašují e-mailem + heslem. Hesla editorů jsou hashovaná bcryptem (pgcrypto
-- crypt + gen_salt('bf')) a nedají se zpětně přečíst. Vše jde přes SECURITY
-- DEFINER RPC — tabulka editorů není z klienta přímo čitelná ani zapisovatelná.
-- Navazuje na 2026-08-22-mapa-editor.sql (musí být spuštěná dřív).
-- ==========================================================================

create extension if not exists pgcrypto;

create table if not exists public.km_editors (
  email      text primary key,                       -- login (e-mail), malými písmeny
  pass_hash  text not null,                           -- bcrypt hash hesla
  name       text,
  role       text not null default 'editor',          -- 'admin' | 'editor'
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.km_editors enable row level security;
-- žádná policy → přímý přístup zakázán; vše výhradně přes RPC níže

-- ---- Ověření přihlášení ---------------------------------------------------
-- aidetem se ověří původním SHA-256 hashem; ostatní přes bcrypt v tabulce.
create or replace function public.km_authed(p_login text, p_secret text)
returns boolean language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if p_login is null or p_secret is null then return false; end if;
  if lower(p_login) = 'aidetem' then
    return encode(digest(p_secret, 'sha256'), 'hex')
         = 'f564b3dd35f4abb0b1dc0ea62362d5b8fab3439d0662b5ed557ebb5684bb2f6e';
  end if;
  return exists (select 1 from km_editors e
                 where e.email = lower(p_login) and e.active and e.pass_hash = crypt(p_secret, e.pass_hash));
end $$;

create or replace function public.km_is_admin(p_login text, p_secret text)
returns boolean language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not km_authed(p_login, p_secret) then return false; end if;
  if lower(p_login) = 'aidetem' then return true; end if;
  return exists (select 1 from km_editors e where e.email = lower(p_login) and e.active and e.role = 'admin');
end $$;

-- Přihlášení pro klienta: ok + role + jméno.
create or replace function public.km_login(p_login text, p_secret text)
returns jsonb language plpgsql stable security definer set search_path = public, extensions as $$
declare r record;
begin
  if not km_authed(p_login, p_secret) then return jsonb_build_object('ok', false); end if;
  if lower(p_login) = 'aidetem' then
    return jsonb_build_object('ok', true, 'role', 'admin', 'name', 'aidetem', 'login', 'aidetem');
  end if;
  select email, name, role into r from km_editors where email = lower(p_login);
  return jsonb_build_object('ok', true, 'role', r.role, 'name', coalesce(r.name, r.email), 'login', r.email);
end $$;

-- ---- Správa editorů (jen admin) -------------------------------------------
create or replace function public.km_add_editor(p_admin_login text, p_admin_secret text, p_email text, p_password text, p_name text, p_role text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_is_admin(p_admin_login, p_admin_secret) then raise exception 'Jen admin může přidávat uživatele.'; end if;
  if p_email is null or position('@' in p_email) = 0 then raise exception 'Zadej platný e-mail.'; end if;
  if p_password is null or length(p_password) < 6 then raise exception 'Heslo musí mít aspoň 6 znaků.'; end if;
  if lower(p_email) = 'aidetem' then raise exception 'Login aidetem je vyhrazený.'; end if;
  insert into km_editors (email, pass_hash, name, role, active)
  values (lower(p_email), crypt(p_password, gen_salt('bf')), nullif(p_name, ''), coalesce(nullif(p_role, ''), 'editor'), true)
  on conflict (email) do update set pass_hash = excluded.pass_hash, name = excluded.name, role = excluded.role, active = true;
end $$;

create or replace function public.km_remove_editor(p_admin_login text, p_admin_secret text, p_email text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_is_admin(p_admin_login, p_admin_secret) then raise exception 'Jen admin může mazat uživatele.'; end if;
  delete from km_editors where email = lower(p_email);
end $$;

create or replace function public.km_list_editors(p_admin_login text, p_admin_secret text)
returns table(email text, name text, role text, active boolean, created_at timestamptz)
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not km_is_admin(p_admin_login, p_admin_secret) then raise exception 'Jen admin může vidět uživatele.'; end if;
  return query select e.email, e.name, e.role, e.active, e.created_at from km_editors e order by e.created_at;
end $$;

-- ---- Zápisové RPC: přijímají i p_login (default 'aidetem' kvůli zpětné
--      kompatibilitě se starým klientem) a ověřují přes km_authed ----------
drop function if exists public.km_save_override(text, text, jsonb);
drop function if exists public.km_delete_override(text, text);
drop function if exists public.km_add_concept(text, text, jsonb);
drop function if exists public.km_delete_concept(text, text);
drop function if exists public.km_save_micro(text, text, text, jsonb, int);
drop function if exists public.km_delete_micro(text, text);

create or replace function public.km_save_override(p_secret text, p_id text, p_patch jsonb, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_authed(p_login, p_secret) then raise exception 'Neplatné přihlášení editoru.'; end if;
  insert into km_concept_overrides (concept_id, patch, updated_by, updated_at)
  values (p_id, coalesce(p_patch, '{}'::jsonb), lower(p_login), now())
  on conflict (concept_id) do update set patch = excluded.patch, updated_by = excluded.updated_by, updated_at = now();
end $$;

create or replace function public.km_delete_override(p_secret text, p_id text, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_authed(p_login, p_secret) then raise exception 'Neplatné přihlášení editoru.'; end if;
  delete from km_concept_overrides where concept_id = p_id;
end $$;

create or replace function public.km_add_concept(p_secret text, p_id text, p_data jsonb, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_authed(p_login, p_secret) then raise exception 'Neplatné přihlášení editoru.'; end if;
  insert into km_concepts_new (id, data, created_by, updated_at)
  values (p_id, p_data, lower(p_login), now())
  on conflict (id) do update set data = excluded.data, updated_at = now();
end $$;

create or replace function public.km_delete_concept(p_secret text, p_id text, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_authed(p_login, p_secret) then raise exception 'Neplatné přihlášení editoru.'; end if;
  delete from km_concepts_new where id = p_id;
end $$;

create or replace function public.km_save_micro(p_secret text, p_id text, p_parent text, p_data jsonb, p_ord int, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_authed(p_login, p_secret) then raise exception 'Neplatné přihlášení editoru.'; end if;
  insert into km_microkoncepty (id, parent_id, data, ord, created_by, updated_at)
  values (p_id, p_parent, p_data, coalesce(p_ord, 0), lower(p_login), now())
  on conflict (id) do update set parent_id = excluded.parent_id, data = excluded.data, ord = excluded.ord, updated_at = now();
end $$;

create or replace function public.km_delete_micro(p_secret text, p_id text, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_authed(p_login, p_secret) then raise exception 'Neplatné přihlášení editoru.'; end if;
  delete from km_microkoncepty where id = p_id;
end $$;

-- ---- Grants ---------------------------------------------------------------
grant execute on function
  public.km_login(text, text),
  public.km_add_editor(text, text, text, text, text, text),
  public.km_remove_editor(text, text, text),
  public.km_list_editors(text, text),
  public.km_save_override(text, text, jsonb, text),
  public.km_delete_override(text, text, text),
  public.km_add_concept(text, text, jsonb, text),
  public.km_delete_concept(text, text, text),
  public.km_save_micro(text, text, text, jsonb, int, text),
  public.km_delete_micro(text, text, text)
to anon, authenticated;
