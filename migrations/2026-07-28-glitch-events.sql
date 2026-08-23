-- Statistiky Glitchů — surové události (Fáze 1: sběr dat).
-- Spusť v Supabase → SQL Editoru. Idempotentní.

-- Jedna událost = jeden řádek. Typy: view | interact | complete | save | project.
-- Zapisuje jen přihlášený uživatel (RLS: insert jen vlastní user_id).
create table if not exists glitch_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  glitch_id text not null,
  event_type text not null,                 -- view | interact | complete | save | project
  meta jsonb not null default '{}'::jsonb,  -- např. {"correct":true} nebo {"uroven":"aplikace"}
  created_at timestamptz default now()
);
create index if not exists glitch_events_glitch_idx on glitch_events (glitch_id, event_type);
create index if not exists glitch_events_created_idx on glitch_events (created_at desc);

alter table glitch_events enable row level security;
drop policy if exists "Events insert own" on glitch_events;
create policy "Events insert own" on glitch_events
  for insert with check (auth.uid() = user_id);

-- Agregace pro budoucí /stats dashboard (uložení a projekty bereme z jejich tabulek).
-- Čtení řeší až Fáze 2 (admin gating) — teď slouží jen jako připravený pohled.
create or replace view glitch_stats as
select
  ids.glitch_id,
  coalesce(ev.views, 0)             as views,
  coalesce(ev.interactions, 0)      as interactions,
  coalesce(ev.completes, 0)         as completes,
  coalesce(ev.completes_correct, 0) as completes_correct,
  coalesce(sv.saves, 0)             as saves,
  coalesce(pr.projects, 0)          as projects
from (
  select distinct glitch_id from glitch_events
  union select distinct glitch_id from saved_glitches
  union select distinct glitch_id from projects
) ids
left join (
  select glitch_id,
    count(*) filter (where event_type = 'view')        as views,
    count(*) filter (where event_type = 'interact')    as interactions,
    count(*) filter (where event_type = 'complete')    as completes,
    count(*) filter (where event_type = 'complete' and meta->>'correct' = 'true') as completes_correct
  from glitch_events group by glitch_id
) ev on ev.glitch_id = ids.glitch_id
left join (select glitch_id, count(*) as saves    from saved_glitches group by glitch_id) sv on sv.glitch_id = ids.glitch_id
left join (select glitch_id, count(*) as projects from projects       group by glitch_id) pr on pr.glitch_id = ids.glitch_id;
