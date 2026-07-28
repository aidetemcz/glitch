-- Sledování uživatelů (following / followers).
-- Spusť v Supabase → SQL Editoru. Idempotentní (dá se pustit víckrát).
--
-- Jeden řádek = „follower sleduje following". Glitchee (vestavěný průvodce) NENÍ
-- v DB — jeho vzájemné sledování řeší klient (uživatel vždy sleduje Glitcheeho
-- a Glitchee sleduje uživatele) bez zápisu do téhle tabulky.

create table if not exists follows (
  follower_id  uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)          -- sám sebe sledovat nelze
);
create index if not exists follows_following_idx on follows (following_id);

alter table follows enable row level security;

-- Kdokoli přihlášený vidí vazby sledování (potřeba pro seznamy sledujících /
-- sledovaných). Sledovat/odsledovat může uživatel jen sám za sebe.
drop policy if exists "Follows readable" on follows;
create policy "Follows readable" on follows
  for select using (auth.role() = 'authenticated');

drop policy if exists "Follows insert own" on follows;
create policy "Follows insert own" on follows
  for insert with check (auth.uid() = follower_id);

drop policy if exists "Follows delete own" on follows;
create policy "Follows delete own" on follows
  for delete using (auth.uid() = follower_id);

-- Aby šlo vyhledat kteréhokoli uživatele a zobrazit jeho veřejný profil, musí být
-- profily čitelné pro přihlášené (jméno, přezdívka, věk, avatar). Zápis zůstává
-- omezený na vlastní řádek (řeší stávající politiky profiles).
drop policy if exists "Profiles readable" on profiles;
create policy "Profiles readable" on profiles
  for select using (auth.role() = 'authenticated');
