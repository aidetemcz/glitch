# Persony (prompty chatbota)

Katalog **person** — systémových promptů pro chatbota v Glitchi. Persona určuje,
**JAK** chatbot mluví (role, metoda, tón, bezpečnostní pravidla). **O ČEM** mluví
se bere zvlášť z konkrétní karty Glitche.

> **persona = jak · karta = o čem**

## Katalog (12 person)

| id | Persona | Co dělá |
|---|---|---|
| `glitchee` | **Basic Glitch — Glitchee** | sokratovský průvodce; **výchozí** |
| `planovani` | Chatbot pro plánování | pomáhá rozvrhnout práci na konkrétní kroky |
| `co-kdyby` | Co kdyby… | rozvíjí hypotetický scénář a jeho důsledky |
| `opakovaci-partak` | Opakovací parťák | ptá se a vysvětluje, když žák nerozumí |
| `chybujici-chatbot` | Chybující chatbot | záměrně chybuje a vyzývá k ověření |
| `brainstorming` | Parťák pro brainstorming | pomáhá vymýšlet nápady a řešení |
| `spolecne-objevovani` | Společné objevování | průvodce učením skrze otázky |
| `v-hlavni-roli` | V hlavní roli… | vtělí se do zadané role, odpovídá z její perspektivy |
| `testovaci-chatbot` | Testovací chatbot | ověřuje znalosti různou formou testů |
| `zvedavy-mimon` | Zvědavý mimoň | předstírá nevědomost a vyzývá k vysvětlení |
| `historicka-postava` | Historická postava | hraje postavu a přibližuje dobový kontext |
| `argumentacni-partner` | Argumentační partner | oponuje a upozorňuje na argumentační klamy |

## Jak se persona vybírá

1. **Pole `persona` v kartě** Glitche (např. `"persona": "zvedavy-mimon"`) — tohle
   bude v **editoru** rozbalovátko.
2. Není-li vyplněné → **přednastavení podle typu karty**
   (Argumentuj → `argumentacni-partner`, Historická osobnost → `historicka-postava`,
   Najdi chybu → `chybujici-chatbot`, Basic Glitch → `glitchee`).
3. Jinak → výchozí `glitchee`.

## Jak to běží technicky

- **Zdroj pravdy jsou MD soubory** v téhle složce. Ty se editují.
- `personas.json` je z nich **vygenerovaný** katalog (id, název, popis, prompt).
  Po úpravě MD spusť:

  ```bash
  python3 Persony/build-catalog.py
  ```

- **Systémový prompt skládá server** (`api/gpt.js`): vezme prompt persony podle id
  a připojí blok `### ZADÁNÍ (kontext tohoto Glitche)` s poli karty.
  Prohlížeč posílá jen id persony + kontext + konverzaci — **prompt ani bezpečnostní
  pravidla nejdou z klienta přepsat** (podvržená `system` zpráva se zahazuje).

## Poznámky

- Persony jsou psané pro školní kontext se **„zadáním od učitele"** (téma / cíl /
  zadání). V Glitchi tuhle roli plní **karta Glitche** — mapuje se do bloku ZADÁNÍ.
- Glitchee počítá s bohatší strukturou karty (Kontrakt, kanonická otázka,
  scaffolding — viz `docs/karta-basic-glitch.md`). Dokud karty tahle pole nemají,
  dostává bot to, co v kartě je (téma, název, text, co už zaznělo).
- Odkazy na GPT asistenty v MD (`## AI asistenti`) jsou referenční — appka je
  nepoužívá, prompt se posílá přímo z katalogu.
