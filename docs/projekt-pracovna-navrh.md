# Projekt (pracovna) — co má obsahovat

_Podklad pro návrh ve Figmě. Žák se sem dostane **forknutím posledního
(aplikačního) Glitche questu** — z odemčeného projektového uzlu v dráze questu.
Otevírá se v profilu → **Tvé projekty**._

Cíl: žák si vezme aplikační zadání (např. „Vytvoř svůj algoritmus") a **rozpracuje
ho** — ukládá zdroje, fotí, píše poznámky a radí se s Glitcheem. Volitelně projekt
sdílí do feedu.

---

## 1. Hlavička projektu
- Štítek **Projekt** (žlutý) + téma questu (např. „Algoritmus").
- **Název** projektu — editovatelný (default = název zadání).
- Přepínač **Sdílet do Glitchfeedu** (soukromé ⇄ veřejné). Veřejný projekt se
  objeví ve feedu komunity se štítkem Projekt.
- (volitelně) autor + datum poslední úpravy.

## 2. Zadání (brief)
- Krátký text aplikačního úkolu (z `projectBrief`). **Jen ke čtení**, vizuálně
  odlišené (rámeček / žlutý pruh). Připomíná, co má žák vytvořit.

## 3. Zdroje
- Seznam přidaných zdrojů; každý je **URL** (ideálně s náhledem / faviconou a
  titulkem) nebo **krátký text**.
- Tlačítko **+ Přidat zdroj** → vloží odkaz nebo text.
- Mazání jednotlivého zdroje.

## 4. Fotky
- **Galerie** nahraných fotek (mřížka).
- Tlačítko **+ Nahrát fotku** (z galerie / foťáku).
- Klik na fotku = zvětšení; možnost smazat.
- _Technicky: ukládá se do Supabase Storage (bucket `project-photos`)._

## 5. Poznámky
- Volné **textové pole** pro žákovy poznámky. Průběžně se ukládá.

## 6. Chat s Glitcheem (rádce)
- Konverzace jako v Basic Glitchi, ale v roli **rádce k projektu** (ne zkoušející).
- Do kontextu jde **zadání projektu** a klidně i žákovy zdroje/poznámky, ať radí
  konkrétně k tomu, co žák dělá.
- **Bez kvízu a bez vyhodnocení** — projekt se „neuzavírá" hodnotitelem.

## 7. Stavy a chování
- **Prázdný projekt** (čerstvě forknutý): zadání + výzvy „přidej první zdroj /
  fotku / zeptej se Glitchee".
- **Autosave** — vše se ukládá průběžně (lokálně vždy, přihlášeným do Supabase).
- **Sdílení** — přepnutí soukromé/veřejné + krátké potvrzení.

---

## Co už je připravené v datech (nemusíš řešit)
Tabulka `projects` (migrace `migrations/2026-07-26-projekty.sql`):
`title, brief, quest_topic, resources[] (jsonb), notes, photos[] (jsonb), shared`.
Fotky → Storage bucket `project-photos`.

## Otázky, které se ti při návrhu budou hodit rozhodnout
1. **Layout**: vše na jedné rolovací obrazovce, nebo **taby** (Zdroje / Fotky /
   Chat)?
2. **Chat**: trvalé okno dole, nebo samostatná sekce/obrazovka?
3. **Karta projektu ve feedu** (když je sdílený): jak vypadá — co se ukáže
   ostatním (název, pár fotek, zdroje)?
4. **Odevzdání**: má projekt stav „rozpracováno / hotovo", nebo je to živá
   pracovna bez konce?
