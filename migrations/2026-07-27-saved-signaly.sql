-- Menu Glitche: „Uložit Glitch" + „Tohle mě nezajímá".
-- Spusť v Supabase → SQL Editoru. Idempotentní.

-- Uložené Glitche (zobrazí se v profilu → Uložené).
create table if not exists saved_glitches (
  user_id uuid not null references auth.users(id) on delete cascade,
  glitch_id text not null,
  topic text,
  title text,
  glitch_type text,
  created_at timestamptz default now(),
  primary key (user_id, glitch_id)
);
alter table saved_glitches enable row level security;
drop policy if exists "Saved owner all" on saved_glitches;
create policy "Saved owner all" on saved_glitches
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Signály k tématům: „nezajímá mě" (negativní). Když si uživatel téma přidá
-- do zájmů, zájem má přednost (řeší doporučovač na klientovi).
create table if not exists topic_signals (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  signal text not null default 'not_interested',
  created_at timestamptz default now(),
  primary key (user_id, topic)
);
alter table topic_signals enable row level security;
drop policy if exists "Signals owner all" on topic_signals;
create policy "Signals owner all" on topic_signals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
