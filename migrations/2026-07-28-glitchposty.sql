-- Glitchposty — Glitche vytvořené uživatelem (tok „Nový Glitch").
-- Spusť v Supabase → SQL Editoru. Idempotentní.
--
-- Celá karta Glitche se ukládá do `card` (jsonb) — aplikace ji rovnou vykreslí.
-- Zatím se NEpropisují do hlavního feedu ostatních (moderaci/publikaci vyřešíme
-- později) — jen do profilu autora a na jeho veřejný profil.

create table if not exists glitchposts (
  id          text primary key,                 -- id karty (např. "up-...")
  user_id     uuid references auth.users(id) on delete cascade,
  glitch_type text,                              -- quest_intro | quick_challenge | inspirace
  topic       text,
  title       text,
  card        jsonb not null default '{}'::jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists glitchposts_user_idx on glitchposts (user_id, created_at desc);

alter table glitchposts enable row level security;

-- Zápis/úprava/mazání jen vlastní; čtení veřejné pro přihlášené (veřejné profily).
drop policy if exists "Glitchposts readable" on glitchposts;
create policy "Glitchposts readable" on glitchposts
  for select using (auth.role() = 'authenticated');

drop policy if exists "Glitchposts insert own" on glitchposts;
create policy "Glitchposts insert own" on glitchposts
  for insert with check (auth.uid() = user_id);

drop policy if exists "Glitchposts update own" on glitchposts;
create policy "Glitchposts update own" on glitchposts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Glitchposts delete own" on glitchposts;
create policy "Glitchposts delete own" on glitchposts
  for delete using (auth.uid() = user_id);
