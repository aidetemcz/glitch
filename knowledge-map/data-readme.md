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

### `kompetence[]` — klíčová kompetence digitální / KDI (5)
Třetí, nezávislá osa členění. Pole: `id` (`kdi-dat`, `kdi-zap`, `kdi-tdo`, `kdi-bzk`, `kdi-vin`), `nazev`, `kod` (např. `KDI-DAT-000-ZV9-001`), `vystup` (doslovné znění očekávaného výstupu KDI), `barva`. Celková charakteristika kompetence je v `meta.kompetence_popis`.

### `concepts[]` — koncepty (uzly)
Klíčová je **dvojí příslušnost** — každý koncept má:
- `tema` → id z `temata` (vždy vyplněno)
- `oblast` → id z `areas`, **nebo `null`**. `null` = **průřezový** koncept, který nepatří do jednoho okruhu Informatiky, ale je to klíčová kompetence / průřezové téma RVP (postoje, etika, mediální gramotnost, wellbeing, digitální občanství, základy vizuálního designu). Pozn.: `oblast` vyjadřuje tematickou příslušnost k okruhu — koncept ji může mít i bez konkrétního očekávaného výstupu (`rvp` může být prázdné).
- `kompetence` → id z `kompetence` (klíčová kompetence digitální / KDI), **nebo `null`** (nezařazeno — ryzí informatická teorie: myšlení, primitiva programování, vnitřek infrastruktury, teorie AI). Je to **třetí, nezávislá osa** členění vedle `tema` a `oblast`.

Další pole:
- `id`, `nazev`, `vrstva` (`core` / `navazujici`), `popis`
- `rvp` → seznam `{ kod, vystup }`. **`vystup` je DOSLOVNÉ znění očekávaného výstupu z RVP** (opsané z `RVP_revidované_2024-03-28.pdf`, s. 54–55). Neupravovat. Prázdné, když koncept nemá odpovídající výstup v RVP.
- `prerekvizity` → seznam `id` konceptů (hrana „prerekvizita", čárkovaná — stejné jako dosud)
- `souvisi` → seznam `id` konceptů (hrana „souvisí", i napříč tématy/oblastmi)
- `tagy` → průřezová témata / filtr (viz níže)
- `zdroj` → dohledatelnost (u konceptů s RVP odkaz na PDF a stranu)
- `cile`, `kriteria`, `pokryti_glitchem` → **záměrně prázdné** (`[]`). Doplní se v další, detailní fázi. Parser je ber jako volitelné.
- `stav` → zatím vždy `draft`.

## Trojí zobrazení — o co jde (hlavní úkol)

Mapa má jít přepnout mezi **třemi** logikami seskupení týchž uzlů (přepínač vedle sebe):

1. **Podle témat** (doporučený default) — clustery = `temata` (12). Barva/label uzlu podle `tema`. Rozvržení podle `vrstva_mapy` a `temata[].navazuje_na`.
2. **Podle oblastí RVP** — clustery = `areas` (4). Uzly seskup podle `concepts[].oblast`. Koncepty s `oblast: null` dej do koše **„Průřezové (digitální kompetence a postoje)"** — jsou to klíčové kompetence / průřezová témata RVP, ne obsah jednoho okruhu.
3. **Podle klíčové kompetence digitální (KDI)** — clustery = `kompetence` (5). Uzly seskup podle `concepts[].kompetence`. Koncepty s `kompetence: null` dej do koše **„Nezařazeno (informatická teorie)"** (nebo je v tomto režimu ztlum/skryj). KDI je nezávislá osa: koncept může mít okruh RVP i kompetenci současně (např. „AI podvody" → oblast `digitalni-technologie`, kompetence `kdi-bzk`).

Hrany (`prerekvizity`, `souvisi`) a stav/vrstva/tagy fungují ve všech třech režimech stejně. Přepínač zobrazení = jen jiné seskupení a obarvení týchž uzlů.

### Detailní panel konceptu — přidat KDI
Vedle sekce **RVP — očekávaný výstup** (z `concept.rvp`) přidej sekci **Digitální kompetence**: pokud má koncept `kompetence` != null, dohledej ji v top-level `kompetence[]` podle id a zobraz `nazev`, `kod` a `vystup`. Když je `null`, sekci vynech (nebo „—").

## Tagy (na filtr)
Průřezové značky napříč tématy, hodí se pro filtr i pro „AI průřezovou vrstvu". Používané hodnoty mj.:
`ai`, `ai-prurez` (místa, kde se AI vplétá do jiného tématu jako reflexní krok), `etika`, `postoj`, `soukromi`, `bezpeci`, `deepfake`, `data`, `databaze`, `sit`, `cloud`, `api`, `rizeni-toku`, `opakovani`, `kdyz-tak`, `algoritmus`, `dekompozice`, `abstrakce`, `programovani`, `web`, `aplikace`, `hry`, `robotika`, `media`, `wellbeing`, `design`, `ladeni`, `verzovani`, `spoluprace`.

## Zásady, které jsem držel (ať víš, na čem stavíš)
- **RVP znění nevymýšlené** — opsané doslovně z PDF; kde v RVP výstup není, `rvp: []`.
- **Paleta jen ČB + žlutá.**
- **Slugy/id** bez diakritiky, kebab-case; `id` konceptu = `{tema}-{nazev}`.
- Všechny `prerekvizity`/`souvisi` odkazují na existující `id` (ověřeno, žádné visící odkazy).
- Pokrytí RVP: všech **12** očekávaných výstupů oboru Informatika pro 2. stupeň je namapováno na koncepty.

## Propojení (hrany) — verze 0.3

Dva typy hran:
- `prerekvizity` (směrové, „nauč se A, než začneš B") — i napříč tématy (35 mezitématických), takže témata nejsou izolované ostrovy: programování staví na informatickém myšlení, weby/aplikace na programování, AI na datech atd. Tvoří acyklický graf (DAG, ověřeno).
- `souvisi` (laterální příbuznost, převážně napříč tématy) — v 0.3 výrazně zhuštěno tak, aby vytáhlo **průřezová témata** na povrch.

**Jak `souvisi` v 0.3 vzniká (systematicky přes tag-vlákna):**
- Koncepty sdílející stejné průřezové **vlákno (tag)** se propojí napříč tématy: malá/střední vlákna (`soukromi`, `etika`, `deepfake`, `sit`, `cloud`, `rizeni-toku`, `design`, `udalosti`, `ml`, `postoj`…) jako plný klastr; velká vlákna (`data`, `bezpeci`, `programovani`) přes hub-and-spoke na kotvu, aby nevznikl chuchvalec.
- **AI průřezová vrstva:** každý koncept s tagem `ai-prurez` odkazuje na jádro AI (`Ověřování výstupů`, `Kdy AI (ne)použít a disclosure`, `Bias a férovost`).
- Tag `ai` (39 konceptů) se záměrně **neklastruje celý** — AI se protahuje jen přes `ai-prurez`, jinak by vzniklo ~560 hran.

Stav 0.3: **338 hran** (souvisí 190, prerekvizita 148), průměrný stupeň uzlu ~5,0, žádný izolovaný uzel, nejvíc propojené uzly ~14 hran (přirozené huby: Reprezentace dat, Bias a férovost, Doporučovací systémy…). `souvisi` nikdy neduplikuje `prerekvizitu` ani není symetricky dvakrát.

**Doporučení k UI (důležité kvůli čitelnosti):** při vyšší hustotě hran je klíčové, aby graf nebyl „chuchvalec". Přidej prosím:
1. **Zvýraznění sousedství** při najetí/kliknutí na uzel (zbytek grafu ztlum) — nejúčinnější nástroj proti přehlcení.
2. **Filtr typu hrany** (jen prerekvizity / jen souvisí / obojí).
3. Volitelně zvýraznění hran vedoucích na jádro AI (tag `ai-prurez`) jako „AI průřezovou vrstvu".

Tím zůstane mapa čitelná i při dalším zhušťování.

## Rozklikávací oblasti a témata (v0.5)

Kromě konceptů mají teď **bohatý `popis` i oblasti RVP a témata** — udělej prosím jejich názvy (nadpisy/clustery i položky v levém filtru) klikatelné a otevři jim detailní panel:
- **Téma** (`temata[]`): panel s `nazev`, `popis`, případně `navazuje_na` (na jaká témata navazuje) a `vrstva_mapy`.
- **Oblast RVP** (`areas[]`): panel s `nazev`, `kod` (např. `INF-INF-001`) a `popis`.

Popisy oblastí RVP jsou **víceodstavcové** — odstavce jsou oddělené prázdným řádkem (`\n\n`). Při vykreslení je prosím rozděl na odstavce (split podle `\n\n`), ať se nezobrazí jako jeden slepený blok. Popisy témat jsou jednoodstavcové.

## Směrovost hran a detailní panel (DŮLEŽITÉ)

Každá hrana je v datech uložena **jen jednou** — u jednoho z konceptů (efektivní, bez duplicit). Graf to tak i vykresluje: bere hrany z obou konců, takže je kreslí správně obousměrně. **Detailní panel konceptu ale musí číst hrany taky obousměrně**, jinak ukáže neúplný seznam (to je přesně chyba, kdy „Herní design" má na grafu 9 hran, ale v panelu jen 2).

Panel má proto pro vybraný koncept `X` sestavovat:

- **SOUVISÍ** (symetrické, undirected): sjednocení `X.souvisi` ∪ `{ C : X ∈ C.souvisi }`. Tedy i koncepty, které mají `X` ve svém `souvisi`.
- **PREREKVIZITY** (co musí předcházet): `X.prerekvizity` — jako dosud.
- Doporučeně přidat i reverzní sekci **„Je prerekvizitou pro"**: `{ C : X ∈ C.prerekvizity }` — aby bylo transparentní, proč na grafu vede z `X` víc šipek, než má `X` vlastních prerekvizit.

Graf: `souvisi` ber jako **neorientované** hrany a **deduplikuj** je (dvojici A–B kresli jednou, i kdyby ji náhodou nesly oba konce). `prerekvizity` jsou orientované (šipka rodič → dítě).

## Regenerace
Data vznikají z `build_map.py` (přiložen). Když bude potřeba hromadná úprava (přidat koncept, přemapovat RVP), uprav `build_map.py` a spusť `python3 build_map.py` — přepíše `knowledge-map.yaml` a vypíše kontrolu (počty, pokrytí RVP, visící odkazy).
