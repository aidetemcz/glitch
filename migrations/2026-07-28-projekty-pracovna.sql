-- Pracovna projektu: rozšíření tabulky `projects` o plán, zdroje, stav.
-- Spusť v Supabase → SQL Editoru. Idempotentní (add column if not exists).

alter table projects add column if not exists plan       jsonb   default '{}'::jsonb;
alter table projects add column if not exists resources  jsonb   default '{}'::jsonb;
alter table projects add column if not exists msg_count  integer default 0;
alter table projects add column if not exists done       boolean default false;
-- `shared` (soukromý/veřejný) už v tabulce je z dřívějška.
