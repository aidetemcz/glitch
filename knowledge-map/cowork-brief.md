# Předávačka: tvorba dat pro Mapu znalostí (Cowork)

Tenhle dokument je soběstačný brief pro práci v Cowork projektu **Glitch**. Cíl: z RVP a odborných zdrojů vytvořit obsah **Mapy znalostí** ve správném datovém formátu.

---

## 1. Kontext

- **Glitch** = vzdělávací „sociální síť" pro děti (2. stupeň ZŠ). Učí informatiku formou vertikálního feedu celoobrazovkových „Glitch" karet.
- **Mapa znalostí** = obsahový framework, na kterém stavíme obsah: **hierarchická, propojená mapa konceptů** informatiky. Interaktivní webová appka už běží (Kumu-like graf); teď potřebuje **naplnit daty**.
- **Cíl teď:** pokrýt informatiku pro **2. stupeň ZŠ** — vytěžit z RVP a zdrojů koncepty, uspořádat je do hierarchie a zapsat do datového formátu mapy.

## 2. Co je výstup

Záznamy **oblastí** a **konceptů** ve **YAML** dle schématu v sekci 5 — připravené k vložení do souboru `knowledge-map/app/data/knowledge-map.yaml` v repu.

Můžeš pracovat po oblastech (nejdřív jedna oblast kompletně, pak další) — ať to jde po částech.

## 3. Zdroje (main-sources/)

| Zdroj | K čemu |
|---|---|
| **RVP revidované 2024** | Hlavní zdroj: oblasti, koncepty a **očekávané výstupy** (kód + přesné znění). |
| **Marzano-Kendall — Nová taxonomie** + **Gradace na základě Nové taxonomie** | Gradace cílů/kritérií podle **kognitivní úrovně**. |
| **Everything You Need To Ace Computer Science** | Obsah a hloubka konceptů, srozumitelný výklad. |
| **Ability (kognitivní schopnosti)**, **Your Brain on ChatGPT** | Kontext k věkové přiměřenosti a opatrnosti s AI. |

## 4. Oblasti (4 okruhy RVP Informatika)

| id (slug) | Oblast |
|---|---|
| `data-modelovani` | Data, informace a modelování |
| `algoritmizace` | Algoritmizace a programování |
| `informacni-systemy` | Informační systémy |
| `digitalni-technologie` | Digitální technologie |

Průřezově **digitální kompetence** — řešíme přes tagy, ne jako samostatnou oblast.

## 5. Datové schéma

Zdroj pravdy je **jeden YAML soubor** se dvěma seznamy: `areas` a `concepts`.

### Oblast (`area`)
| pole | popis |
|---|---|
| `id` | slug oblasti (viz sekce 4) |
| `nazev` | název oblasti |
| `popis` | k čemu oblast je (1–2 věty) |
| `barva` | akcent — **jen `"#ffff00"` (žlutá) nebo `"#ffffff"` (bílá)**. Paleta je ČB + žlutá, žádné jiné barvy. |

### Koncept (`concept`)
| pole | popis |
|---|---|
| `id` | slug `{oblast}-{nazev}` bez diakritiky, např. `algoritmizace-cyklus` |
| `nazev` | název konceptu (krátký — jde do bubliny v grafu) |
| `oblast` | id oblasti |
| `vrstva` | `core` (základní stavební kámen) nebo `navazujici` |
| `popis` | co koncept je (1–2 věty) |
| `cile` | seznam cílů, gradovaných podle úrovně (viz níže) |
| `kriteria` | seznam kritérií hodnocení, stejná gradace |
| `rvp` | seznam `{ kod, vystup }` — kód **i přesné znění** očekávaného výstupu |
| `zdroj` | seznam: odkaz na zdroj + strana (dohledatelnost) |
| `tagy` | průřezová témata / podobnost (pro filtrování) |
| `prerekvizity` | seznam id konceptů, které musí předcházet |
| `souvisi` | seznam id příbuzných konceptů (i napříč oblastmi) |
| `pokryti_glitchem` | seznam id Glitchů, které koncept učí (zatím většinou prázdné) |
| `stav` | `draft` nebo `hotovo` |

### Gradace cílů a kritérií — podle kognitivní úrovně

Cíle i kritéria se **gradují primárně podle úrovně**, ne podle ročníku (RVP je obecné, školy se liší; ročník je jen orientační vodítko). Škála (Nová taxonomie Marzano-Kendall):

| `uroven` (slug) | Úroveň | Co žák dělá |
|---|---|---|
| `vybaveni` | Vybavení | pozná, pojmenuje, vybaví si |
| `porozumeni` | Porozumění | vlastními slovy vysvětlí, uvede příklad |
| `analyza` | Analýza | rozliší, porovná, najde vztahy a chyby |
| `vyuziti-znalosti` | Využití znalostí | použije na nový problém, navrhne, vytvoří |

Každý cíl/kritérium = `{ uroven, text, orientacne_rocnik? }` (ročník je volitelný).

## 6. Vzor záznamu (formát, který mám produkovat)

```yaml
areas:
  - id: algoritmizace
    nazev: Algoritmizace a programování
    popis: Postupy krok za krokem, řízení toku, dekompozice, tvorba a ladění programů.
    barva: "#ffff00"

concepts:
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
      - kod: "I-9-2-02"
        vystup: "PŘESNÉ znění očekávaného výstupu opsané z RVP — nevymýšlet"
    zdroj:
      - "RVP_revidované_2024-03-28.pdf, s. XX"
    tagy: [řízení-toku, opakování]
    prerekvizity: [algoritmizace-algoritmus]
    souvisi: [algoritmizace-podminka]
    pokryti_glitchem: []
    stav: draft
```

## 7. Postup

1. Z **RVP** vypiš pro danou oblast **očekávané výstupy** (kód + přesné znění).
2. Rozlož oblast na **koncepty**; urči `core` vs `navazujici`.
3. Sestav **prerekvizity** (co musí předcházet) a **souvisí** (příbuznost, i napříč oblastmi) — tím vzniká hierarchie a propojení mapy.
4. Ke každému konceptu doplň: `popis`, `cile` + `kriteria` **gradované podle úrovně**, `rvp` (kód + znění), `zdroj` (soubor + strana), `tagy`.
5. `id` = `{oblast}-{nazev}` kebab-case bez diakritiky.
6. Výstup dej jako **YAML blok** dle vzoru (klidně po oblastech).

## 8. Zásady (neporušovat)

- **RVP znění NEVYMÝŠLET** — opsat přesně z PDF (kód i text výstupu). Když něco není v RVP, `rvp` nech prázdné, nedomýšlej kód.
- **Gradace primárně podle úrovně** (`uroven`), ročník je jen orientační.
- **Paleta jen ČB + žlutá** — `barva` oblasti pouze `#ffff00` nebo `#ffffff`.
- **YAML úskalí:** text s **čárkou nebo dvojtečkou** dej do uvozovek, jinak se hodnota rozbije. Např. `text: "když–tak, tedy podmínka"`.
- Slugy a `id` bez diakritiky a mezer (kebab-case).

## 9. Až bude YAML hotový

Předej ho zpět (klidně po oblastech). Promítnu ho do `knowledge-map/app/data/knowledge-map.yaml`, ověřím parserem a nasadím — objeví se v mapě.
