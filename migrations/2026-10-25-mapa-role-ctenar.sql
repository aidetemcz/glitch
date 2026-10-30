-- Mapa informatických konceptů — role „čtenář" (viewer): může se přihlásit
-- a stahovat exporty (i dílčích témat), ale nemá práva k zápisu.
--
-- Role v km_editors: 'admin' | 'editor' | 'viewer'. Zápisové RPC funkce nově
-- ověřují km_can_write (přihlášen a role admin/editor) místo pouhého km_authed.
-- Spustit v Supabase SQL editoru po 2026-08-22-mapa-editori.sql. Bezpečné opakovat.

-- ---- Oprávnění k zápisu ----------------------------------------------------
create or replace function public.km_can_write(p_login text, p_secret text)
returns boolean language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not km_authed(p_login, p_secret) then return false; end if;
  if lower(p_login) = 'aidetem' then return true; end if;
  return exists (select 1 from km_editors e
                 where e.email = lower(p_login) and e.active and e.role in ('admin', 'editor'));
end $$;

-- ---- Správa uživatelů: povolené role ----------------------------------------
create or replace function public.km_add_editor(p_admin_login text, p_admin_secret text, p_email text, p_password text, p_name text, p_role text)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare v_role text := coalesce(nullif(p_role, ''), 'editor');
begin
  if not km_is_admin(p_admin_login, p_admin_secret) then raise exception 'Jen admin může přidávat uživatele.'; end if;
  if p_email is null or position('@' in p_email) = 0 then raise exception 'Zadej platný e-mail.'; end if;
  if p_password is null or length(p_password) < 6 then raise exception 'Heslo musí mít aspoň 6 znaků.'; end if;
  if lower(p_email) = 'aidetem' then raise exception 'Login aidetem je vyhrazený.'; end if;
  if v_role not in ('admin', 'editor', 'viewer') then raise exception 'Neznámá role: %', v_role; end if;
  insert into km_editors (email, pass_hash, name, role, active)
  values (lower(p_email), crypt(p_password, gen_salt('bf')), nullif(p_name, ''), v_role, true)
  on conflict (email) do update set pass_hash = excluded.pass_hash, name = excluded.name, role = excluded.role, active = true;
end $$;

-- ---- Zápisové RPC: jen admin / editor ---------------------------------------
create or replace function public.km_save_override(p_secret text, p_id text, p_patch jsonb, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_can_write(p_login, p_secret) then raise exception 'Tento účet nemá práva k zápisu.'; end if;
  insert into km_concept_overrides (concept_id, patch, updated_by, updated_at)
  values (p_id, coalesce(p_patch, '{}'::jsonb), lower(p_login), now())
  on conflict (concept_id) do update set patch = excluded.patch, updated_by = excluded.updated_by, updated_at = now();
end $$;

create or replace function public.km_delete_override(p_secret text, p_id text, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_can_write(p_login, p_secret) then raise exception 'Tento účet nemá práva k zápisu.'; end if;
  delete from km_concept_overrides where concept_id = p_id;
end $$;

create or replace function public.km_add_concept(p_secret text, p_id text, p_data jsonb, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_can_write(p_login, p_secret) then raise exception 'Tento účet nemá práva k zápisu.'; end if;
  insert into km_concepts_new (id, data, created_by, updated_at)
  values (p_id, p_data, lower(p_login), now())
  on conflict (id) do update set data = excluded.data, updated_at = now();
end $$;

create or replace function public.km_delete_concept(p_secret text, p_id text, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_can_write(p_login, p_secret) then raise exception 'Tento účet nemá práva k zápisu.'; end if;
  delete from km_concepts_new where id = p_id;
end $$;

create or replace function public.km_save_micro(p_secret text, p_id text, p_parent text, p_data jsonb, p_ord int, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_can_write(p_login, p_secret) then raise exception 'Tento účet nemá práva k zápisu.'; end if;
  insert into km_microkoncepty (id, parent_id, data, ord, created_by, updated_at)
  values (p_id, p_parent, p_data, coalesce(p_ord, 0), lower(p_login), now())
  on conflict (id) do update set parent_id = excluded.parent_id, data = excluded.data, ord = excluded.ord, updated_at = now();
end $$;

create or replace function public.km_delete_micro(p_secret text, p_id text, p_login text default 'aidetem')
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not km_can_write(p_login, p_secret) then raise exception 'Tento účet nemá práva k zápisu.'; end if;
  delete from km_microkoncepty where id = p_id;
end $$;

grant execute on function public.km_can_write(text, text) to anon, authenticated;
