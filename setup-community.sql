-- ============================================
-- Tiny Glitch — Community (Komunita) tables
-- ============================================

-- Community tips
create table if not exists community_tips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  author_name text not null,
  title text not null,
  content text not null,
  tag text default 'tipy',
  upvotes int default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table community_tips enable row level security;
create policy "Anyone can read tips" on community_tips for select using (true);
create policy "Authenticated users can insert tips" on community_tips for insert with check (auth.uid() = user_id);

-- Tip comments
create table if not exists tip_comments (
  id uuid default gen_random_uuid() primary key,
  tip_id uuid references community_tips(id) on delete cascade,
  user_id uuid references auth.users(id),
  author_name text not null,
  content text not null,
  created_at timestamptz default now()
);

alter table tip_comments enable row level security;
create policy "Anyone can read comments" on tip_comments for select using (true);
create policy "Authenticated users can insert comments" on tip_comments for insert with check (auth.uid() = user_id);

-- Teams
create table if not exists community_teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  project text,
  looking_for text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table community_teams enable row level security;
create policy "Anyone can read teams" on community_teams for select using (true);
create policy "Authenticated users can create teams" on community_teams for insert with check (auth.uid() = created_by);

-- Team members
create table if not exists team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references community_teams(id) on delete cascade,
  user_id uuid references auth.users(id),
  display_name text not null,
  role text default 'member',
  joined_at timestamptz default now(),
  unique(team_id, user_id)
);

alter table team_members enable row level security;
create policy "Anyone can read team members" on team_members for select using (true);
create policy "Authenticated users can join teams" on team_members for insert with check (auth.uid() = user_id);

-- Tip upvotes (one per user per tip)
create table if not exists tip_upvotes (
  id uuid default gen_random_uuid() primary key,
  tip_id uuid references community_tips(id) on delete cascade,
  user_id uuid references auth.users(id),
  created_at timestamptz default now(),
  unique(tip_id, user_id)
);

alter table tip_upvotes enable row level security;
create policy "Anyone can read upvotes" on tip_upvotes for select using (true);
create policy "Authenticated users can upvote" on tip_upvotes for insert with check (auth.uid() = user_id);
create policy "Users can remove own upvotes" on tip_upvotes for delete using (auth.uid() = user_id);

-- Progress
create table if not exists progress (
  user_id uuid references auth.users(id) on delete cascade,
  glitch_id text not null,
  completed boolean default true,
  quiz_answer text,
  completed_at timestamptz default now(),
  primary key (user_id, glitch_id)
);
alter table progress enable row level security;
create policy "Anyone can read progress" on progress for select using (true);
create policy "Users insert own progress" on progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress" on progress for update using (auth.uid() = user_id);
