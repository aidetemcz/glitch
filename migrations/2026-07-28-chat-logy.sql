-- Logy chatů (JEN pro testování). Spusť v Supabase → SQL Editoru. Idempotentní.
--
-- Ukládá se celá konverzace (freechat i chat v Glitchi) jako jeden řádek na
-- session, který se průběžně přepisuje. Slouží ti k náhledu při testování;
-- řádky se automaticky mažou po 7 dnech (viz cron níže).

create table if not exists chat_logs (
  session_id uuid primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  kind       text,                              -- 'free' (volný chat) | 'glitch' (chat v Glitchi)
  persona    text,
  glitch_id  text,
  messages   jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists chat_logs_created_idx on chat_logs (created_at);

alter table chat_logs enable row level security;

-- Zapisovat/číst může uživatel jen své vlastní logy (auth.uid() = user_id).
drop policy if exists "Chat logs insert own" on chat_logs;
create policy "Chat logs insert own" on chat_logs
  for insert with check (auth.uid() = user_id);

drop policy if exists "Chat logs update own" on chat_logs;
create policy "Chat logs update own" on chat_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Chat logs select own" on chat_logs;
create policy "Chat logs select own" on chat_logs
  for select using (auth.uid() = user_id);

-- Automatické mazání po týdnu (pg_cron). Kdyby tenhle blok spadl na tom, že
-- pg_cron není povolený, zapni ho v Dashboard → Database → Extensions (pg_cron)
-- a spusť jen tuhle část znovu. Bez cronu tabulka funguje, jen se nemaže sama.
create extension if not exists pg_cron;
select cron.schedule(
  'chat-logs-cleanup',
  '0 3 * * *',                                   -- každý den ve 3:00 UTC
  $$ delete from chat_logs where created_at < now() - interval '7 days' $$
);
