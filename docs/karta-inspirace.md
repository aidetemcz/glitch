# Karta — Inspirace

_Šablona sekcí Glitche typu **Inspirace** na příkladu „Noční hory". Návrh k připomínkám. Vytvořeno: 2026-07-27._

**Jak číst tenhle soubor.** Inspirace je **wellbeing typ s chatbotem**. Na kartě běží ukázková vizualizace dat (vytvořená vibecodingem) a dole je vstupní pole. Dítě napíše nápady, co by chtělo vizualizovat → otevře se detail s konverzací, kde s ním **Glitchee** probere konkrétní nápad a nabídne založení **projektu**. Když dítě souhlasí, projekt vznikne a najde ho v profilu v sekci **Tvé projekty**. Není tu žádný kvíz ani hodnocení — cílem je tvůrčí nakopnutí, ne zkoušení.

**Interakce:** Rozklik ✅ · Chatbot ✅ (Glitchee) · Fork ❌ (místo forku vzniká projekt)
**Zařazení:** wellbeing (do feedu vstupuje jako wellbeing signál, ne znalostní obsah)
**Datový soubor:** [`../glitches/feed.json`](../glitches/feed.json) (karta `inspirace-nocni-hory`)
**Animace:** [`../assets/3Dvizualizations/nigth-mountains.html`](../assets/3Dvizualizations/nigth-mountains.html)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `inspirace-nocni-hory` |
| název | Noční hory |
| typ | `inspirace` |
| téma | Data |
| kategorie (štítek) | Inspirace |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-27 |
| stav důvěry | `core` (štítek „Glitch") |
| jazyk | cs |

---

## 0.1 Mapa konceptů

*Inspirace **nemá napojení na konkrétní koncept** — není to znalostní obsah, ale tvůrčí a wellbeing prvek (jako mood / dýchání). Do doporučování vstupuje jako wellbeing typ (viz [`doporucovaci-system.md`](./doporucovaci-system.md), `WELLBEING_TYPES`).*

---

## 1 Rozložení karty (pevná pravidla)

Pozice prvků jsou stejné, mění se jen obsah:

| prvek | umístění | pole v datech |
| ----- | ----- | ----- |
| štítky (téma · typ · autor) | vlevo nahoře | `topic`, `category`, `trust` |
| menu (tři tečky) | vpravo nahoře | — (automaticky) |
| nadpis (H2) | nahoře | `title` |
| popis (P) | pod nadpisem | `body` |
| ukázková vizualizace | přes celou plochu (pozadí) | `viz` (iframe) |
| vstupní pole + odeslat | dole | — (interakce) |

Podklad karty je černý (`card--black`), text bílý, tlačítko Odeslat žluté.

---

## 2 Chování a tok

1. Dítě napíše do pole na kartě svoje nápady a odešle.
2. Otevře se detail (chat). Napsaný text je **první zpráva žáka**.
3. **Glitchee** (persona `glitchee`) se s dítětem baví stručně (2–3 věty, jedna otázka) o tom, jaká **konkrétní** data a jakou formou chce zobrazit. Pomůže nápad zúžit.
4. Po 2–4 výměnách se zeptá, jestli má **založit projekt**.
5. Když dítě souhlasí, Glitch **založí projekt** (lokálně + do Supabase `projects`) a ukáže potvrzení s odkazem do sekce **Tvé projekty**.

Bez kvízu (`quiz: false`) a bez hodnocení konceptu — Glitch se „neplní", jen z něj vzniká projekt.

### 2.1 Založení projektu (interní signál)

Glitchee dostává v kontextu pokyn: až se dítě shodne na nápadu a odsouhlasí projekt, ukončí zprávu blokem, který se dítěti **nezobrazí**:

```projekt
{"nazev": "krátký výstižný název", "popis": "1–2 věty, co projekt bude vizualizovat a z jakých dat"}
```

Aplikace blok z textu vyjme (`extractProjekt`), založí projekt (`window.createProject`) a zobrazí potvrzení. Blok se posílá jen jednou a jen po jasném souhlasu.

---

## 3 Kontext pro Glitchee (metainfo, skryté)

- **cíl:** pomoct dítěti vymyslet konkrétní nápad na vizualizaci dat a založit mu k tomu projekt.
- **zadání:** vede tvůrčí, přátelský rozhovor o datech k vizualizaci; nezkoumá, nezkouší; po dohodě založí projekt (viz 2.1).
- **persona:** `glitchee` (Basic Glitch chatbot) — přizpůsobená kontextem karty.

Zdroj pravdy o toku je karta v `feed.json` (`rozklik.cil`, `rozklik.zadani`).

---

## 4 Poznámky k redakci

- Ukázková vizualizace má být **hotová a hezká** — slouží jako důkaz „i tohle jde jednoduše".
- Popis (`body`) musí dítě navést, že **může psát nápady** a že mu Glitchee pomůže.
- Sekce **Tvé projekty** (pracovna projektu) je zatím ve vývoji — Inspirace do ní projekt jen zakládá; detail projektu se navrhuje samostatně.
