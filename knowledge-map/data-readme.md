# Data pro Mapu znalostí — pokyny pro Claude Code

Tenhle balíček obsahuje **`knowledge-map.yaml`** — naplněná data pro appku Mapa znalostí. Sestaveno podle datového schématu z původního briefu, **rozšířeného o druhou logiku seskupení** (podle témat), aby šla mapa zobrazit dvojím způsobem.

## Kam soubor patří

Nahraď/naplň jím datový soubor mapy (dle briefu `knowledge-map/app/data/Informatika/knowledge-map.yaml`). Je to jediný zdroj pravdy. Ověř parserem a nasaď.

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
- `rvp` → seznam `{ kod, vystup }` (ideálně 1, max 2 na koncept). **`vystup` je DOSLOVNÉ znění očekávaného výstupu z RVP** (opsané z `RVP_revidované_2024-03-28.pdf`, s. 54–55). Neupravovat. Prázdné, když koncept nemá odpovídající výstup v RVP (56 ze 134 konceptů výstup má; zbytek je mimo RVP a nechává se prázdný — nevymýšlí se). Pozn.: `rvp` je „nejlépe sedící výstup", může výjimečně být z jiného okruhu než `oblast` (koncept přemosťující dva okruhy — např. micro:bit je hardware, ale plní programovací výstup).
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

## Tagy — dvě průřezové facetové vrstvy (v0.9)
Tagy jsou **ortogonální** k tématu, okruhu RVP i kompetenci — schválně **nekopírují témata** (každý tag sahá napříč tématy). Kanonický seznam je v top-level `tagy[]` (`{tag, pocet}`); každý koncept má 1–5 tagů. Dvě rodiny:

- **(A) Optiky / průřezová velká témata a hodnoty** (10) — „proč to je důležité", to, co se dá protáhnout celým kurikulem: `soukromí`, `bezpečí a rizika`, `etika a odpovědnost`, `férovost a předpojatost`, `lidský dohled a agency`, `důvěra a ověřování`, `dopad na společnost`, `pozornost a wellbeing`, `udržitelnost`, `moc a peníze`. Řídké a vysoce signální — označují „reflexivní momenty".
- **(B) Povaha konceptu** (2) — „co je to za typ znalosti": `teoretický základ` a `praktická dovednost`. Pokrývají všechny koncepty (dělení znalosti/dovednosti; postoje nese vrstva A).

**Tag ≠ hrana.** Tag je *příslušnost do kategorie* (vlastnost jednoho konceptu), ne vztah mezi dvojicí — pro UI badge/filtr, ne čára. Užitečné UI: **filtr optikou** („ukaž vše, kde jde o soukromí / bias / dopad na společnost") vytáhne věci, které tři osy rozhazují jinam; a **spolu-výskyt tagů** jako kompaktní přehled překryvů.

## Zásady, které jsem držel (ať víš, na čem stavíš)
- **RVP znění nevymýšlené** — opsané doslovně z PDF; kde v RVP výstup není, `rvp: []`.
- **Paleta jen ČB + žlutá.**
- **Slugy/id** bez diakritiky, kebab-case; `id` konceptu = `{tema}-{nazev}`.
- Všechny `prerekvizity`/`souvisi` odkazují na existující `id` (ověřeno, žádné visící odkazy).
- Pokrytí RVP: všech **12** očekávaných výstupů oboru Informatika pro 2. stupeň je namapováno na koncepty.

## Propojení (hrany) — verze 0.8

Tři vrstvy vztahu, každá v jiném „rozlišení" (od nejsilnějšího k nejvolnějšímu):
1. **`prerekvizity`** (směrové, „nauč se A, než začneš B") — pořadí učení, DAG. I napříč tématy (35 mezitématických). 148 hran.
2. **`souvisi`** (neorientované) — **jen těsné, ručně kurátorské** párové mosty, hlavně **napříč tématy/tagy** (např. „Doporučovací systémy" ↔ „Digitální wellbeing"). Nemá kreslit „to samé", co už říká tag — má ukazovat **nečekané mosty mezi vzdálenými částmi mapy**. 62 hran.
3. **`tagy`** — široká kategorie/příslušnost, bez čar (viz výše).

**Změna v 0.8:** dřívější husté generování `souvisi` z tag-vláken (v0.3, 190 hran) bylo **odebráno** — dělalo z hran totéž co tagy (chuchvalec, žádný nový signál). Šíře se přesunula do TAGŮ, `souvisi` se vrátilo k těsnému kurátorskému jádru. `souvisi` je i nadále neorientované a nikdy neduplikuje `prerekvizitu`.

**Doporučení k UI:**
1. **Zvýraznění sousedství** při najetí/kliknutí (zbytek ztlum).
2. **Filtr typu hrany** (prerekvizity / souvisí).
3. **„Bridge finder"** — zvýrazni `souvisi` hrany spojující různá témata/tagy: to jsou mezioborové „aha" spoje (ideální náměty na Glitche na pomezí).

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
