-- Spolupráce na projektu + 1:1 zprávy mezi uživateli.
-- Spusť v Supabase → SQL Editoru. Idempotentní.

-- ── Spolupracovníci na projektu ────────────────────────────────────────────
-- Projekt je identifikován (owner_id, glitch_id) — stejně jako v tabulce projects.
create table if not exists project_collaborators (
  owner_id        uuid not null references auth.users(id) on delete cascade,
  glitch_id       text not null,
  collaborator_id uuid not null references auth.users(id) on delete cascade,
  created_at      timestamptz default now(),
  primary key (owner_id, glitch_id, collaborator_id),
  check (owner_id <> collaborator_id)
);
create index if not exists pc_collab_idx on project_collaborators (collaborator_id);

alter table project_collaborators enable row level security;
-- vlastník projektu členství spravuje; spolupracovník vidí, kde je přizvaný
drop policy if exists "PC owner manage" on project_collaborators;
create policy "PC owner manage" on project_collaborators
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "PC collaborator read" on project_collaborators;
create policy "PC collaborator read" on project_collaborators
  for select using (auth.uid() = collaborator_id);

-- ── 1:1 zprávy mezi uživateli ──────────────────────────────────────────────
create table if not exists messages (
  id           bigint generated always as identity primary key,
  sender_id    uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  body         text not null,
  created_at   timestamptz default now()
);
create index if not exists messages_pair_idx on messages (sender_id, recipient_id, created_at);
create index if not exists messages_recipient_idx on messages (recipient_id, created_at);

alter table messages enable row level security;
-- posílat můžeš jen sám za sebe; číst jen konverzace, kde figuruješ
drop policy if exists "Messages insert own" on messages;
create policy "Messages insert own" on messages
  for insert with check (auth.uid() = sender_id);
drop policy if exists "Messages read own" on messages;
create policy "Messages read own" on messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

-- realtime: přidej tabulku do publikace (živé doručování zpráv)
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'messages') then
    alter publication supabase_realtime add table messages;
  end if;
end $$;
