-- Profil žáka: doplnění osobních sloupců do `profiles`.
-- Spusť v Supabase → SQL Editoru. Vše je idempotentní (add column if not exists),
-- takže se dá pustit klidně víckrát.
--
-- Klient (js/supabase.js) tyhle sloupce zapisuje; bez nich se profil ukládal jen
-- lokálně. `vek` (věk) je hlavní přírůstek, ostatní jsou pro konzistenci.

alter table profiles add column if not exists vek smallint;
alter table profiles add column if not exists nickname text;
alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists gender text;
alter table profiles add column if not exists learning_style text;
alter table profiles add column if not exists avatar text;
alter table profiles add column if not exists settings jsonb;
