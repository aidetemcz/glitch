-- ==========================================================================
-- Mapa informatických konceptů — editor (Supabase živě + export do GitHubu)
-- ==========================================================================
-- Model: YAML na GitHubu zůstává „základ" (source of truth pro nasazení a
-- chatbota). Supabase drží ŽIVÉ úpravy jako překryvovou vrstvu nad YAML:
--   - km_concept_overrides : úpravy stávajících konceptů (jen změněná pole)
--   - km_concepts_new      : nově přidané koncepty
--   - km_microconcepty      : hloubková vrstva („3D") — mikrokoncepty pod konceptem
-- Editor čte YAML + tyhle tři tabulky → sloučí → vykreslí. Tlačítko „Export"
-- pak z výsledku vygeneruje knowledge-map.yaml + concepts.json k commitu.
--
-- BEZPEČNOST ZÁPISU: kurikulum nesmí být zapisovatelné kýmkoli, kdo zná URL.
-- Čtení je veřejné (obsah je stejně veřejný). Zápis jde JEN přes RPC funkce
-- gated heslem (stejné admin heslo jako klientská závora v mapě) — funkce
-- ověří SHA-256 hesla proti uloženému hashi. Tabulky samotné mají zápis
-- zakázaný. (Až budeme chtít, vyměníme heslo za Supabase Auth + allowlist.)
-- ==========================================================================

create extension if not exists pgcrypto;

-- ---- Tabulky --------------------------------------------------------------

create table if not exists public.km_concept_overrides (
  concept_id text primary key,
  patch      jsonb not null default '{}'::jsonb,   -- jen změněná pole konceptu
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.km_concepts_new (
  id         text primary key,                     -- {tema}-{slug}
  data       jsonb not null,                        -- celý objekt konceptu
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.km_microkoncepty (
  id         text primary key,                     -- {parent_id}--{slug}
  parent_id  text not null,                         -- id konceptu, pod který patří
  data       jsonb not null,                        -- { nazev, popis, cile?, kriteria?, tagy? }
  ord        int  not null default 0,               -- pořadí ve vrstvě
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists km_micro_parent_idx on public.km_microkoncepty (parent_id, ord);

-- ---- RLS: čtení veřejné, zápis jen přes RPC (níže) ------------------------

alter table public.km_concept_overrides enable row level security;
alter table public.km_concepts_new      enable row level security;
alter table public.km_microkoncepty     enable row level security;

drop policy if exists km_ovr_read on public.km_concept_overrides;
drop policy if exists km_new_read on public.km_concepts_new;
drop policy if exists km_mic_read on public.km_microkoncepty;

create policy km_ovr_read on public.km_concept_overrides for select to anon, authenticated using (true);
create policy km_new_read on public.km_concepts_new      for select to anon, authenticated using (true);
create policy km_mic_read on public.km_microkoncepty     for select to anon, authenticated using (true);
-- žádné insert/update/delete policy → přímý zápis z klienta je zakázaný

-- ---- Heslová závora zápisu ------------------------------------------------
-- SHA-256 admin hesla (stejné jako ADMIN_HASH v knowledge-map/app/js/map.js).
-- Ověření probíhá na serveru v SECURITY DEFINER funkcích.

create or replace function public.km_check_secret(p_secret text)
returns boolean language sql immutable as $$
  select encode(digest(coalesce(p_secret,''), 'sha256'), 'hex')
       = '72b092cfd13cf63679289efe7bf7ea5266dd3cd28e7ab49e439a1e885471b1d8'
$$;

-- ---- RPC zápisy (jediná cesta, jak něco změnit) ---------------------------

create or replace function public.km_save_override(p_secret text, p_id text, p_patch jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not km_check_secret(p_secret) then raise exception 'Neplatné heslo editoru.'; end if;
  insert into km_concept_overrides (concept_id, patch, updated_at)
  values (p_id, coalesce(p_patch, '{}'::jsonb), now())
  on conflict (concept_id) do update set patch = excluded.patch, updated_at = now();
end $$;

create or replace function public.km_delete_override(p_secret text, p_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not km_check_secret(p_secret) then raise exception 'Neplatné heslo editoru.'; end if;
  delete from km_concept_overrides where concept_id = p_id;
end $$;

create or replace function public.km_add_concept(p_secret text, p_id text, p_data jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not km_check_secret(p_secret) then raise exception 'Neplatné heslo editoru.'; end if;
  insert into km_concepts_new (id, data, updated_at)
  values (p_id, p_data, now())
  on conflict (id) do update set data = excluded.data, updated_at = now();
end $$;

create or replace function public.km_delete_concept(p_secret text, p_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not km_check_secret(p_secret) then raise exception 'Neplatné heslo editoru.'; end if;
  delete from km_concepts_new where id = p_id;
end $$;

create or replace function public.km_save_micro(p_secret text, p_id text, p_parent text, p_data jsonb, p_ord int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not km_check_secret(p_secret) then raise exception 'Neplatné heslo editoru.'; end if;
  insert into km_microkoncepty (id, parent_id, data, ord, updated_at)
  values (p_id, p_parent, p_data, coalesce(p_ord, 0), now())
  on conflict (id) do update set parent_id = excluded.parent_id, data = excluded.data, ord = excluded.ord, updated_at = now();
end $$;

create or replace function public.km_delete_micro(p_secret text, p_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not km_check_secret(p_secret) then raise exception 'Neplatné heslo editoru.'; end if;
  delete from km_microkoncepty where id = p_id;
end $$;

-- RPC funkce smí volat anon (uvnitř se ověří heslo); čtení tabulek je přes RLS.
grant execute on function
  public.km_save_override(text,text,jsonb),
  public.km_delete_override(text,text),
  public.km_add_concept(text,text,jsonb),
  public.km_delete_concept(text,text),
  public.km_save_micro(text,text,text,jsonb,int),
  public.km_delete_micro(text,text)
to anon, authenticated;
