# Mapa znalostí — struktura a framework

Obsahový framework, na kterém stavíme vzdělávací obsah pro Glitch. Cíl: pokrýt **informatiku pro 2. stupeň ZŠ** (6.–9. ročník) jako hierarchizovanou, propojenou mapu konceptů.

Výsledkem je **interaktivní webová aplikace** (styl Kumu.io): oblasti jako velké bubliny, z nich vycházejí core koncepty, ty se dále větví a propojují i napříč oblastmi. Bubliny jsou rozklikávací, filtrovatelné podle tagů a vazeb, s vyhledáváním.

## Hierarchie

```
Oblast (RVP okruh)
  └── Core koncept        ← musí se zvládnout, aby se dalo stavět dál
        └── Navazující koncept
              └── … (větvení + křížové vazby mezi koncepty i napříč oblastmi)
```

- **Oblast** = tematický okruh (velká bublina).
- **Core koncept** = základní stavební kámen oblasti; prerekvizita pro navazující.
- **Navazující koncept** = staví na core konceptech (a případně na sobě).
- **Vazby:** `prerekvizita` (A musí předcházet B, kreslí hierarchii) a `souvisí` (příbuznost napříč mapou).

## Oblasti (okruhy RVP Informatika)

Dle revidovaného RVP ZV (`main-sources/RVP_revidované_2024-03-28.pdf`):

| id | Oblast | Stručně |
|---|---|---|
| `data-modelovani` | Data, informace a modelování | Kódování, struktura a interpretace dat; modely a jejich zjednodušení. |
| `algoritmizace` | Algoritmizace a programování | Postupy, řízení toku, dekompozice, tvorba a ladění programů. |
| `informacni-systemy` | Informační systémy | Data v systémech, jejich vztahy, správa, sdílení a role. |
| `digitalni-technologie` | Digitální technologie | Hardware, software, sítě, principy fungování a bezpečné užívání. |

> Průřezově: **Digitální kompetence** (klíčová kompetence RVP) — promítá se do konceptů napříč oblastmi, řešíme přes tagy.

## Datové schéma

Zdroj pravdy: **`app/data/Informatika/knowledge-map.yaml`**. Dva typy záznamů — `areas` (oblasti) a `concepts` (koncepty). Vazby jsou uvnitř konceptů (`prerekvizity`, `souvisi`), aplikace z nich odvodí hrany grafu.

### Oblast (`area`)

| pole | typ | popis |
|---|---|---|
| `id` | slug | identifikátor oblasti |
| `nazev` | text | název oblasti |
| `popis` | text | k čemu oblast je |
| `barva` | hex | barva bublin oblasti v grafu |

### Koncept (`concept`)

| pole | typ | popis |
|---|---|---|
| `id` | slug | `{oblast}-{nazev}` |
| `nazev` | text | název konceptu (titulek bubliny) |
| `oblast` | id oblasti | zařazení |
| `vrstva` | `core` \| `navazujici` | pozice v hierarchii |
| `popis` | text | co koncept je |
| `cile` | seznam | vzdělávací cíle gradované podle úrovně: `{ uroven, text, orientacne_rocnik? }` |
| `kriteria` | seznam | kritéria hodnocení, stejná gradace: `{ uroven, text, orientacne_rocnik? }` |
| `rvp` | seznam | napojení na RVP: `{ kod, vystup }` — kód i **znění** očekávaného výstupu |
| `zdroj` | seznam | grounding: odkaz na `main-sources` + strana (dohledatelnost) |
| `tagy` | seznam | průřezová témata / podobnost (filtrování) |
| `prerekvizity` | seznam id | koncepty, které musí předcházet |
| `souvisi` | seznam id | příbuzné koncepty (křížové vazby) |
| `pokryti_glitchem` | seznam id | Glitche, které koncept učí (propojení s obsahem) |
| `stav` | `draft` \| `hotovo` | stav zpracování |

> ⚠️ **YAML:** text s čárkou nebo dvojtečkou dávej do uvozovek.

### Taxonomická gradace (Marzano-Kendall)

Cíle i kritéria se **gradují primárně podle kognitivní úrovně**, ne podle ročníku — RVP je obecné a každá škola učí jinak a jindy, takže `orientacne_rocnik` je jen nezávazné vodítko. Osa zvládnutí konceptu (Nová taxonomie vzdělávacích cílů):

| `uroven` (slug) | Úroveň | Co žák dělá |
|---|---|---|
| `vybaveni` | Vybavení | pozná, pojmenuje, vybaví si |
| `porozumeni` | Porozumění | vlastními slovy vysvětlí, uvede příklad |
| `analyza` | Analýza | rozliší, porovná, najde vztahy a chyby |
| `vyuziti-znalosti` | Využití znalostí | použije na nový problém, navrhne, vytvoří |

> Vyšší úrovně Nové taxonomie (metakognice, sebe-systém) jsou průřezové dispozice — negradují se u jednotlivého konceptu, řešíme je jinde (chování chatbota, wellbeing). Přesné znění škály sladit se zdroji `Gradace na základě Nové taxonomie.pdf` a `Marzano Kendall — Nová taxonomie…pdf`.

## Ukázka dat (skeleton — obsah k doplnění z RVP a zdrojů)

```yaml
areas:
  - id: algoritmizace
    nazev: Algoritmizace a programování
    popis: Postupy krok za krokem, řízení toku, dekompozice, tvorba a ladění programů.
    barva: "#ffff00"

concepts:
  - id: algoritmizace-algoritmus
    nazev: Algoritmus
    oblast: algoritmizace
    vrstva: core
    popis: "Přesný postup, jak z počátečního stavu krok za krokem dojít k cíli."
    cile:
      - uroven: vybaveni
        text: "Žák pozná a pojmenuje algoritmus v běžné situaci (návod, recept)."
        orientacne_rocnik: 6
      - uroven: vyuziti-znalosti
        text: "Žák navrhne vlastní algoritmus pro nový problém a odladí ho."
        orientacne_rocnik: 8
    kriteria:
      - uroven: vybaveni
        text: "Z několika textů vybere ty, které jsou algoritmem, a zdůvodní proč."
      - uroven: vyuziti-znalosti
        text: "Sestaví funkční postup o 4–6 krocích a opraví záměrně vloženou chybu."
    rvp:
      - kod: "I-9-2-01"        # ověřit dle PDF
        vystup: "(doplnit přesné znění očekávaného výstupu z RVP)"
    zdroj:
      - "RVP_revidované_2024-03-28.pdf, s. XX"
    tagy: [postup, dekompozice, když-tak]
    prerekvizity: []
    souvisi: [algoritmizace-cyklus]
    pokryti_glitchem: []
    stav: draft

  - id: algoritmizace-cyklus
    nazev: Cyklus (opakování)
    oblast: algoritmizace
    vrstva: navazujici
    popis: "Opakování kroků, dokud platí podmínka — místo psaní téhož pořád dokola."
    cile:
      - uroven: porozumeni
        text: "Žák vysvětlí, proč se opakování hodí, a uvede příklad ze života."
        orientacne_rocnik: 6
      - uroven: analyza
        text: "Žák v hotovém programu najde opakování a nahradí ho cyklem."
        orientacne_rocnik: 7
    kriteria:
      - uroven: analyza
        text: "V blokovém prostředí nahradí opakované kroky cyklem se správným počtem opakování."
    rvp:
      - kod: "I-9-2-02"        # ověřit dle PDF
        vystup: "(doplnit přesné znění očekávaného výstupu z RVP)"
    zdroj: []
    tagy: [řízení-toku, opakování]
    prerekvizity: [algoritmizace-algoritmus]
    souvisi: [algoritmizace-podminka]
    pokryti_glitchem: [algoritmus-hra-zivota]
    stav: draft
```

## Interaktivní aplikace (`app/`)

- **Graf:** oblasti a koncepty jako bubliny; hrany = `prerekvizity` (směrové) a `souvisi` (nesměrové). Organické rozložení (force-directed).
- **Rozklik bubliny:** panel s názvem, popisem, cíli a kritérii po ročnících, RVP, tagy, prerekvizity/souvisí, pokrytí Glitchem, stav.
- **Filtry + hledání:** box s filtrem podle oblasti, tagů, úrovně (core/navazující), stavu; fulltext podle názvu.
- **Nasazení:** samostatný Vercel projekt, Root Directory = `knowledge-map/app/` (PDF zdroje se nedeployují).

## Zdroje

`main-sources/` — RVP (revidované 2024), Marzano-Kendall (Nová taxonomie vzdělávacích cílů) pro gradaci cílů/kritérií, CS učebnice, kognitivní studie. Slouží k tvorbě obsahu, **nedeployují se**.
