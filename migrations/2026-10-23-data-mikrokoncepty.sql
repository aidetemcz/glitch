-- Mikrokoncepty, které garantka Lenka Blehová vyjmenovala u bublin
-- „Provázanost tabulek a relační model" a „Informační systémy" (Hnízdo Data, 2026-10).
-- Mikrokoncepty žijí jen v Supabase (km_microkoncepty), proto je přidává tahle migrace.
-- Zatím jen názvy; obsah (popis, cíle, kritéria) se doplní v editoru mapy.
-- Bezpečné spustit opakovaně: existující mikrokoncept se nepřepíše.

insert into public.km_microkoncepty (id, parent_id, data, ord, created_by) values
  ('data-databaze-provazanost-tabulek--relacni-model', 'data-databaze-provazanost-tabulek', '{"nazev": "Relační model", "vrstva": "core", "popis": "", "cile": [], "kriteria": []}'::jsonb, 0, 'aidetem'),
  ('data-databaze-provazanost-tabulek--klic-primarni-cizi', 'data-databaze-provazanost-tabulek', '{"nazev": "Klíč (primární / cizí)", "vrstva": "core", "popis": "", "cile": [], "kriteria": []}'::jsonb, 1, 'aidetem'),
  ('data-databaze-provazanost-tabulek--vazba-mezi-tabulkami', 'data-databaze-provazanost-tabulek', '{"nazev": "Vazba mezi tabulkami", "vrstva": "core", "popis": "", "cile": [], "kriteria": []}'::jsonb, 2, 'aidetem'),
  ('data-databaze-provazanost-tabulek--duplicita-redundance-dat', 'data-databaze-provazanost-tabulek', '{"nazev": "Duplicita/redundance dat", "vrstva": "core", "popis": "", "cile": [], "kriteria": []}'::jsonb, 3, 'aidetem'),
  ('data-databaze-ucel-informacnich-systemu--informacni-system', 'data-databaze-ucel-informacnich-systemu', '{"nazev": "Informační systém", "vrstva": "core", "popis": "", "cile": [], "kriteria": []}'::jsonb, 0, 'aidetem'),
  ('data-databaze-ucel-informacnich-systemu--uzivatel', 'data-databaze-ucel-informacnich-systemu', '{"nazev": "Uživatel", "vrstva": "core", "popis": "", "cile": [], "kriteria": []}'::jsonb, 1, 'aidetem'),
  ('data-databaze-ucel-informacnich-systemu--uzivatelska-role', 'data-databaze-ucel-informacnich-systemu', '{"nazev": "Uživatelská role", "vrstva": "core", "popis": "", "cile": [], "kriteria": []}'::jsonb, 2, 'aidetem'),
  ('data-databaze-ucel-informacnich-systemu--pristupova-prava-cteni-zapis-uprava', 'data-databaze-ucel-informacnich-systemu', '{"nazev": "Přístupová práva (čtení/zápis/úprava)", "vrstva": "core", "popis": "", "cile": [], "kriteria": []}'::jsonb, 3, 'aidetem')
on conflict (id) do nothing;
