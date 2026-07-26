-- Projekty (fork posledního Glitche questu → pracovna žáka).
-- Spusť v Supabase → SQL Editoru. Idempotentní.
--
-- Fáze 1: tabulka projects + RLS. Fáze 2 využije storage bucket na fotky.

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  glitch_id text not null,                 -- z kterého (posledního) Glitche questu vznikl
  quest_topic text,                        -- téma questu (Vibe Coding, Algoritmus…)
  title text,
  brief text,                              -- zadání projektu (z aplikačního Glitche)
  resources jsonb default '[]'::jsonb,     -- [{typ:'url'|'text', hodnota, popis}]  (Fáze 2)
  notes text,                              -- volné poznámky (Fáze 2)
  photos jsonb default '[]'::jsonb,        -- cesty do storage bucketu (Fáze 2)
  shared boolean default false,            -- sdílet do feedu komunity? (Fáze 3)
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, glitch_id)              -- jeden projekt na (uživatel, Glitch)
);

alter table projects enable row level security;

drop policy if exists "Projects owner all" on projects;
create policy "Projects owner all" on projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- sdílené projekty smí číst kdokoli (pro feed komunity, Fáze 3)
drop policy if exists "Projects shared read" on projects;
create policy "Projects shared read" on projects
  for select using (shared = true);

-- ── Storage bucket na fotky projektů (Fáze 2) ──
insert into storage.buckets (id, name, public)
  values ('project-photos', 'project-photos', true)
  on conflict (id) do nothing;

drop policy if exists "project photos read" on storage.objects;
create policy "project photos read" on storage.objects
  for select using (bucket_id = 'project-photos');

-- upload jen do vlastní složky (name začíná uid uživatele: "<uid>/…")
drop policy if exists "project photos insert own" on storage.objects;
create policy "project photos insert own" on storage.objects
  for insert with check (
    bucket_id = 'project-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "project photos delete own" on storage.objects;
create policy "project photos delete own" on storage.objects
  for delete using (
    bucket_id = 'project-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );
