# Obsah Glitche — struktura

Každý **Glitch = jeden Markdown soubor**. Soubory jsou roztříděné do složek podle **typu obsahu**. Struktura sekcí uvnitr souboru vychází ze šablony [`glitch-card-general.md`](./glitch-card-general.md).

## Typy obsahu (složky)

| Složka | Typ | Rozklik | Chatbot | K čemu |
|---|---|:---:|:---:|---|
| [`basic-glitch/`](./basic-glitch/) | výukový Glitch | ✅ | ✅ | Vzdělávací obsah (Algoritmus, Vibe Coding…). Třídí se do **témat → kapitol**, každá kapitola je zároveň **Quest** (lineární posloupnost). |
| [`wellbeing/`](./wellbeing/) | selector / hra | ⚙️ | — | Interaktivní karty ve feedu: mood selector, dechové cvičení, hra na pozornost. |
| [`rychla-vyzva/`](./rychla-vyzva/) | rychlá výzva | ❌ | — | Nerozklikávací. Dítě splní výzvu na úvodní obrazovce a scrolluje dál. |
| [`historicka-osobnost/`](./historicka-osobnost/) | osobnost + persona | ✅ | ✅ | Po rozkliku chat s AI personou historické osobnosti. |
| [`najdi-chybu/`](./najdi-chybu/) | najdi chybu | ✅ | ✅ | Multichoice (které tvrzení je chyba) → vyhodnocení → vysvětlení → chat. |
| [`funfact/`](./funfact/) | fun fact | ✅ | ✅ | Po rozkliku vysvětlení konceptu + možnost si o tom popovídat s chatbotem. |

> **Systémové karty** (Welcome, Shrnutí) nejsou obsah — jsou součást aplikace, nemají složku.

## Basic Glitch — témata, kapitoly, questy

Ve `basic-glitch/` jsou **podsložky podle témat** (pokrytí informatiky pro 2. stupeň ZŠ). Každé téma tvoří kapitolu a zároveň Quest — Glitche v něm jsou **lineárně řazené** (pole `pořadí v questu`). Zatím založené: `algoritmus/`, `vibe-coding/`. Další témata přibývají jako nové podsložky.

## Pojmenování souborů

Kebab-case slug bez diakritiky: **`{tema}-{nazev}.md`**, např. `algoritmus-hra-zivota.md`. Slug se shoduje s polem `id` ve frontmatteru karty.

## Stav důvěry (trust state)

Každá karta má v identifikaci `stav důvěry`: `core → edited → community → generated`. Určuje označení karty a režim servírování.

## Referenční dokumenty

- [`glitch-card-general.md`](./glitch-card-general.md) — obecná šablona sekcí Glitche (kontrakt, kanonické podání, úrovně, kontext pro Tinybota, metadata, bezpečnost).
- [`glith-content-type.md`](./glith-content-type.md) — vizuální a interakční typy karet ve feedu.
- [`../assets/glitch-design-tokens.md`](../assets/glitch-design-tokens.md) — barvy a typografie.
