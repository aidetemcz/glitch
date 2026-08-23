-- ============================================================
-- Glitch — DB migrace: skupiny A–E
-- Návrh: docs/databaze-navrh.md  ·  Slovníček: docs/slovnicek.md
-- Supabase / PostgreSQL. Bezpečné znovuspuštění (IF NOT EXISTS / drop policy if exists).
-- Spustit v Supabase → SQL Editor.
--
-- Poznámky k návrhu:
--  • „Enumy" řešíme jako text + CHECK (snazší pozdější rozšíření než pg enum).
--  • activity_log slouží jako log událostí (role „events" z návrhu) — rozšířeno,
--    ať se nerozbije to, co appka už zapisuje.
--  • wellbeing_signals je nový cíl pro mood/pozornost; staré mood_entries se
--    nemažou (bez ztráty dat), appka se přepne později.
-- ============================================================


-- ============================================================
-- A. UŽIVATELÉ A ROLE
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar text,
  created_at timestamptz default now()
);
alter table profiles add column if not exists role text
  check (role in ('zak','ucitel','editor','admin')) default 'zak';
alter table profiles add column if not exists vek smallint;

-- Osobní údaje z profilu (zapisuje je klient přes js/supabase.js). Idempotentní —
-- když sloupce už existují, nic se nestane.
alter table profiles add column if not exists nickname text;
alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists gender text;
alter table profiles add column if not exists learning_style text;
alter table profiles add column if not exists settings jsonb;

alter table profiles enable row level security;
drop policy if exists "Profiles select own" on profiles;
create policy "Profiles select own" on profiles for select using (auth.uid() = id);
drop policy if exists "Profiles insert own" on profiles;
create policy "Profiles insert own" on profiles for insert with check (auth.uid() = id);
drop policy if exists "Profiles update own" on profiles;
create policy "Profiles update own" on profiles for update using (auth.uid() = id);

-- Třídy / class management = odloženo, vyřeší Tiny (přihlášení přes Tiny).
-- Pro teď stačí profiles.vek.


-- ============================================================
-- B. OBSAH (KATALOG): koncepty, Glitche, fasety
-- ============================================================

-- Zrcadlo mapy konceptů (zdroj pravdy je knowledge-map.yaml; sem se sype sync skriptem)
create table if not exists concepts (
  id text primary key,
  oblast text,
  tema text,
  vrstva text check (vrstva in ('core','navazujici')),
  rvp jsonb default '[]'::jsonb,          -- [{kod, vystup}]
  digi_kompetence text,
  prerekvizity text[] default '{}',
  souvisi text[] default '{}',
  updated_at timestamptz default now()
);
alter table concepts enable row level security;
drop policy if exists "Concepts readable" on concepts;
create policy "Concepts readable" on concepts for select using (true);
drop policy if exists "Concepts editor write" on concepts;
create policy "Concepts editor write" on concepts for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('editor','admin')))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('editor','admin')));

-- Glitch = jedno podání konceptu (telling)
create table if not exists glitches (
  id text primary key,
  type text check (type in ('basic','rychla-vyzva','wellbeing','funfact','najdi-chybu','historicka-osobnost','argument')),
  concept_id text references concepts(id) on delete set null,       -- NULL u wellbeing/rozcvičky
  trust_state text check (trust_state in ('draft','komunita','fork','core','generovany','ghost')) default 'draft',
  visibility text check (visibility in ('soukrome','sdilene_anon','sdilene_jmeno')) default 'soukrome',
  author_id uuid references auth.users(id) on delete set null,
  author_name text,                                                 -- denormalizované jméno pro sdílený obsah
  title text,
  badge text,
  body jsonb,                                                        -- obsah (u DB obsahu); u core odkaz na git
  source text check (source in ('git','db')) default 'db',
  obtiznost smallint check (obtiznost between 1 and 3),
  kognitivni_narocnost text check (kognitivni_narocnost in
    ('zapamatovat','porozumet','aplikovat','analyzovat','hodnotit','tvorit')),  -- revidovaná Bloomova taxonomie
  typ_zateze text check (typ_zateze in ('soustredeni','kreativita','relaxace','rozcvicka')),
  delka text check (delka in ('mikro','kratka','standard','deep')),
  facets jsonb default '{}'::jsonb,                                  -- fasetový vektor
  fork_allowed boolean default false,
  created_at timestamptz default now()
);
create index if not exists glitches_facets_gin on glitches using gin (facets);
create index if not exists glitches_concept_idx on glitches (concept_id);
create index if not exists glitches_trust_idx on glitches (trust_state);

alter table glitches enable row level security;
-- čtení: sdílený obsah pro všechny, draft jen autor
drop policy if exists "Glitches read shared or own" on glitches;
create policy "Glitches read shared or own" on glitches for select using (
  trust_state in ('komunita','fork','core','generovany') or author_id = auth.uid()
);
drop policy if exists "Glitches insert own" on glitches;
create policy "Glitches insert own" on glitches for insert with check (author_id = auth.uid());
drop policy if exists "Glitches update own or editor" on glitches;
create policy "Glitches update own or editor" on glitches for update using (
  author_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('editor','admin'))
);
drop policy if exists "Glitches delete own or editor" on glitches;
create policy "Glitches delete own or editor" on glitches for delete using (
  author_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('editor','admin'))
);

-- Podání může sloužit více konceptům (M:N, volitelné)
create table if not exists glitch_concepts (
  glitch_id text references glitches(id) on delete cascade,
  concept_id text references concepts(id) on delete cascade,
  covers jsonb default '{}'::jsonb,
  primary key (glitch_id, concept_id)
);
alter table glitch_concepts enable row level security;
drop policy if exists "GlitchConcepts readable" on glitch_concepts;
create policy "GlitchConcepts readable" on glitch_concepts for select using (true);
drop policy if exists "GlitchConcepts editor write" on glitch_concepts;
create policy "GlitchConcepts editor write" on glitch_concepts for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('editor','admin')))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('editor','admin')));


-- ============================================================
-- C. SIGNÁLY A CHOVÁNÍ
-- ============================================================

-- Log událostí (role „events" z návrhu). Table může už existovat z setup-community.sql.
create table if not exists activity_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  event_data jsonb default '{}',
  created_at timestamptz default now()
);
alter table activity_log add column if not exists glitch_id text;
alter table activity_log add column if not exists session_id uuid;

alter table activity_log enable row level security;
drop policy if exists "Users insert own events" on activity_log;
create policy "Users insert own events" on activity_log for insert with check (auth.uid() = user_id);
-- ZPŘÍSNĚNÍ: dřív „Admins can read all (using true)" → nyní jen vlastní
drop policy if exists "Admins can read all" on activity_log;
drop policy if exists "Users read own events" on activity_log;
create policy "Users read own events" on activity_log for select using (auth.uid() = user_id);

-- Zvládnutí konkrétního Glitche. Table může už existovat z setup-community.sql.
create table if not exists progress (
  user_id uuid references auth.users(id) on delete cascade,
  glitch_id text not null,
  completed boolean default true,
  quiz_answer text,
  completed_at timestamptz default now(),
  primary key (user_id, glitch_id)
);
alter table progress add column if not exists uroven text
  check (uroven in ('jednoducha','stredni','master'));

alter table progress enable row level security;
drop policy if exists "Users insert own progress" on progress;
create policy "Users insert own progress" on progress for insert with check (auth.uid() = user_id);
drop policy if exists "Users update own progress" on progress;
create policy "Users update own progress" on progress for update using (auth.uid() = user_id);
-- ZPŘÍSNĚNÍ: dřív „Anyone can read progress (using true)" → nyní jen vlastní
drop policy if exists "Anyone can read progress" on progress;
drop policy if exists "Users read own progress" on progress;
create policy "Users read own progress" on progress for select using (auth.uid() = user_id);

-- Zvládnutí konceptu (agregace přes Glitche) = důkaz o učení
create table if not exists concept_mastery (
  user_id uuid references auth.users(id) on delete cascade,
  concept_id text not null,
  uroven text,                        -- dosažená úroveň (Bloom/Marzano)
  updated_at timestamptz default now(),
  posilano_do_tiny boolean default false,
  primary key (user_id, concept_id)
);
alter table concept_mastery enable row level security;
drop policy if exists "Mastery select own" on concept_mastery;
create policy "Mastery select own" on concept_mastery for select using (auth.uid() = user_id);
drop policy if exists "Mastery insert own" on concept_mastery;
create policy "Mastery insert own" on concept_mastery for insert with check (auth.uid() = user_id);
drop policy if exists "Mastery update own" on concept_mastery;
create policy "Mastery update own" on concept_mastery for update using (auth.uid() = user_id);

-- Formativní vyhodnocení konverzace (výstup hodnoticího AI asistenta) — jen kritéria, ne přepis
create table if not exists conversation_evaluations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  glitch_id text,
  session_id uuid,
  kriteria jsonb default '{}'::jsonb,   -- {dal_duvod:true, uvedl_priklad:true, ...}
  dokonceno boolean default false,
  created_at timestamptz default now()
);
alter table conversation_evaluations enable row level security;
drop policy if exists "ConvEval select own" on conversation_evaluations;
create policy "ConvEval select own" on conversation_evaluations for select using (auth.uid() = user_id);
drop policy if exists "ConvEval insert own" on conversation_evaluations;
create policy "ConvEval insert own" on conversation_evaluations for insert with check (auth.uid() = user_id);


-- ============================================================
-- D. WELLBEING SIGNÁLY (efemérní, 24 h)
-- ============================================================

create table if not exists wellbeing_signals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  kind text check (kind in ('mood','attention','breathing')),
  energy smallint,                       -- u mood (0–100)
  focus smallint,                        -- u mood (0–100)
  value jsonb default '{}'::jsonb,       -- u ostatních (skóre hry…)
  session_id uuid,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '24 hours')
);
create index if not exists wellbeing_expires_idx on wellbeing_signals (expires_at);

alter table wellbeing_signals enable row level security;
drop policy if exists "Wellbeing select own" on wellbeing_signals;
create policy "Wellbeing select own" on wellbeing_signals for select using (auth.uid() = user_id);
drop policy if exists "Wellbeing insert own" on wellbeing_signals;
create policy "Wellbeing insert own" on wellbeing_signals for insert with check (auth.uid() = user_id);

-- Automatické mazání po 24 h.
-- Vyžaduje rozšíření pg_cron (Supabase → Database → Extensions → zapnout „pg_cron").
-- Pak jednou spustit (mimo tento skript, ať se plán nezakládá opakovaně):
--   select cron.schedule('purge-wellbeing', '*/15 * * * *',
--     $$ delete from wellbeing_signals where expires_at < now() $$);
-- Než bude pg_cron zapnutý, jde mazat ručně:
--   delete from wellbeing_signals where expires_at < now();


-- ============================================================
-- E. MODEL PREFERENCÍ (open learner model) — fasetové afinity
-- ============================================================

create table if not exists facet_affinities (
  user_id uuid references auth.users(id) on delete cascade,
  facet_dimension text,                  -- 'vizualita','delka','tema'…
  facet_value text,                      -- 'visual-first'…
  weight real default 0,
  source text check (source in ('explicitni','implicitni')) default 'implicitni',
  updated_at timestamptz default now(),
  primary key (user_id, facet_dimension, facet_value)
);
alter table facet_affinities enable row level security;
drop policy if exists "Affinity select own" on facet_affinities;
create policy "Affinity select own" on facet_affinities for select using (auth.uid() = user_id);
drop policy if exists "Affinity insert own" on facet_affinities;
create policy "Affinity insert own" on facet_affinities for insert with check (auth.uid() = user_id);
drop policy if exists "Affinity update own" on facet_affinities;
create policy "Affinity update own" on facet_affinities for update using (auth.uid() = user_id);

-- ============================================================
-- Hotovo. Skupina F (generování/cache) a stará komunita se nepřenášejí.
-- ============================================================
