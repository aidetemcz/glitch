# Data pro Mapu znalostí — pokyny pro Claude Code

Tenhle balíček obsahuje **`knowledge-map.yaml`** — naplněná data pro appku Mapa znalostí. Sestaveno podle datového schématu z původního briefu, **rozšířeného o druhou logiku seskupení** (podle témat), aby šla mapa zobrazit dvojím způsobem.

## Kam soubor patří

Nahraď/naplň jím datový soubor mapy (dle briefu `knowledge-map/app/data/knowledge-map.yaml`). Je to jediný zdroj pravdy. Ověř parserem a nasaď.

## Co je v souboru (3 seznamy + meta)

```
meta          # verze, popis, paleta (ČB + žlutá), úroveň
areas         # 4 OBLASTI RVP Informatika (tematické okruhy) — pro zobrazení „podle RVP"
temata        # 12 TÉMAT (obsahová struktura) — pro zobrazení „podle témat"
concepts      # 134 konceptů (uzly grafu); každý nese OBĚ příslušnosti
```

### `areas[]` — oblasti RVP (4)
Pole: `id`, `nazev`, `kod` (např. `INF-INF-001`), `popis`, `barva` (jen `#ffff00` / `#ffffff`).
Id: `data-modelovani`, `algoritmizace`, `informacni-systemy`, `digitalni-technologie`.

### `temata[]` — obsahová témata (12)
Pole: `id`, `nazev`, `vrstva_mapy` (0–3, viz níže), `popis`, `barva`, `navazuje_na` (seznam id témat = prerekvizita na úrovni témat, pro rozvržení/šipky mezi clustery témat).
`vrstva_mapy`: **0** = základy a myšlení, **1** = tvorba a programování, **2** = AI, **3** = bezpečí a občanství. Použij ji na vertikální/koncentrické rozvržení clusterů.

### `concepts[]` — koncepty (uzly)
Klíčová je **dvojí příslušnost** — každý koncept má:
- `tema` → id z `temata` (vždy vyplněno)
- `oblast` → id z `areas`, **nebo `null`** (koncept je „nad rámec RVP / průřezový")

Další pole:
- `id`, `nazev`, `vrstva` (`core` / `navazujici`), `popis`
- `rvp` → seznam `{ kod, vystup }`. **`vystup` je DOSLOVNÉ znění očekávaného výstupu z RVP** (opsané z `RVP_revidované_2024-03-28.pdf`, s. 54–55). Neupravovat. Prázdné, když koncept nemá odpovídající výstup v RVP.
- `prerekvizity` → seznam `id` konceptů (hrana „prerekvizita", čárkovaná — stejné jako dosud)
- `souvisi` → seznam `id` konceptů (hrana „souvisí", i napříč tématy/oblastmi)
- `tagy` → průřezová témata / filtr (viz níže)
- `zdroj` → dohledatelnost (u konceptů s RVP odkaz na PDF a stranu)
- `cile`, `kriteria`, `pokryti_glitchem` → **záměrně prázdné** (`[]`). Doplní se v další, detailní fázi. Parser je ber jako volitelné.
- `stav` → zatím vždy `draft`.

## Dvojí zobrazení — o co jde (hlavní úkol)

Mapa má jít přepnout mezi dvěma logikami seskupení stejných uzlů:

1. **Podle témat** (doporučený default) — clustery = `temata` (12). Barva/label uzlu podle `tema`. Rozvržení podle `vrstva_mapy` a `temata[].navazuje_na`.
2. **Podle oblastí RVP** — clustery = `areas` (4). Uzly seskup podle `concepts[].oblast`. Koncepty s `oblast: null` dej do zvláštního koše **„Nad rámec RVP / průřezové"** (nebo je v RVP režimu skryj — dle tvého uvážení; doporučuji košík, ať je vidět přesah).

Hrany (`prerekvizity`, `souvisi`) a stav/vrstva/tagy fungují v obou režimech stejně. Přepínač zobrazení = jen jiné seskupení a obarvení týchž uzlů.

> Poznámka: uživatelka si dvojí zobrazení vyžádá zvlášť — data už jsou na obě logiky připravená (každý koncept nese `tema` i `oblast`), takže stačí přidat přepínač a druhé seskupení. Stávající RVP-oblastní pohled zůstává funkční (pole `oblast` + `areas` odpovídají původnímu schématu).

## Tagy (na filtr)
Průřezové značky napříč tématy, hodí se pro filtr i pro „AI průřezovou vrstvu". Používané hodnoty mj.:
`ai`, `ai-prurez` (místa, kde se AI vplétá do jiného tématu jako reflexní krok), `etika`, `postoj`, `soukromi`, `bezpeci`, `deepfake`, `data`, `databaze`, `sit`, `cloud`, `api`, `rizeni-toku`, `opakovani`, `kdyz-tak`, `algoritmus`, `dekompozice`, `abstrakce`, `programovani`, `web`, `aplikace`, `hry`, `robotika`, `media`, `wellbeing`, `design`, `ladeni`, `verzovani`, `spoluprace`.

## Zásady, které jsem držel (ať víš, na čem stavíš)
- **RVP znění nevymýšlené** — opsané doslovně z PDF; kde v RVP výstup není, `rvp: []`.
- **Paleta jen ČB + žlutá.**
- **Slugy/id** bez diakritiky, kebab-case; `id` konceptu = `{tema}-{nazev}`.
- Všechny `prerekvizity`/`souvisi` odkazují na existující `id` (ověřeno, žádné visící odkazy).
- Pokrytí RVP: všech **12** očekávaných výstupů oboru Informatika pro 2. stupeň je namapováno na koncepty.

## Propojení (hrany) — verze 0.2

Propojení bylo v 0.2 zhuštěno. Dva typy hran:
- `prerekvizity` (směrové, „nauč se A, než začneš B") — **nově i napříč tématy** (35 mezitématických), takže témata nejsou izolované ostrovy: programování staví na informatickém myšlení, weby/aplikace na programování, AI na datech atd.
- `souvisi` (laterální příbuznost, převážně napříč tématy) — včetně realizace **AI průřezové vrstvy** jako hran (koncepty s AI nástrojem odkazují na jádro AI: `Ověřování výstupů`, `Prompt`, `Bias`…) a překrývajících se konceptů bezpečí/etiky/soukromí.

Stav: 210 hran, průměrný stupeň uzlu ~3,1, žádný izolovaný uzel. Prerekvizity tvoří acyklický graf (DAG, ověřeno). `souvisi` nikdy neduplikuje `prerekvizitu`.

**Doporučení k UI (důležité kvůli čitelnosti):** při vyšší hustotě hran je klíčové, aby graf nebyl „chuchvalec". Přidej prosím:
1. **Zvýraznění sousedství** při najetí/kliknutí na uzel (zbytek grafu ztlum) — nejúčinnější nástroj proti přehlcení.
2. **Filtr typu hrany** (jen prerekvizity / jen souvisí / obojí).
3. Volitelně zvýraznění hran vedoucích na jádro AI (tag `ai-prurez`) jako „AI průřezovou vrstvu".

Tím zůstane mapa čitelná i při dalším zhušťování.

## Regenerace
Data vznikají z `build_map.py` (přiložen). Když bude potřeba hromadná úprava (přidat koncept, přemapovat RVP), uprav `build_map.py` a spusť `python3 build_map.py` — přepíše `knowledge-map.yaml` a vypíše kontrolu (počty, pokrytí RVP, visící odkazy).
