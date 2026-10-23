-- Nahlášení nevhodného obsahu (menu Glitche → „Nahlásit nevhodný obsah").
-- Spusť v Supabase → SQL Editoru. Idempotentní.

-- Jedno nahlášení = jeden řádek. Nahlašovat může jen přihlášený uživatel.
create table if not exists content_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  glitch_id text not null,
  glitch_type text,
  topic text,
  reason text,
  status text not null default 'new',        -- new | reviewing | resolved | dismissed
  created_at timestamptz default now()
);

-- rychlé procházení nejnovějších nevyřízených
create index if not exists content_reports_status_idx on content_reports (status, created_at desc);

alter table content_reports enable row level security;

-- Uživatel smí jen VLOŽIT nahlášení pod svým user_id. Číst/měnit nahlášení
-- běžný uživatel nemůže — moderace se dělá v dashboardu (service role RLS obchází).
drop policy if exists "Reports insert own" on content_reports;
create policy "Reports insert own" on content_reports
  for insert with check (auth.uid() = user_id);
