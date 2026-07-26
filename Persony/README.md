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

## Pravidla platformy (platí pro všech 12 person)

Persony jsou psané pro školní zadání, kde žák látku už probíral. V Glitchi je to
jinak — žák si jen rozklikl kartu ve feedu a nemusí o tématu vědět nic. Server
proto ke každé personě přidává blok `### JAK TO CHODÍ V GLITCHI`:

1. Nepředpokládej, že žák téma zná (neptej se „co ti utkvělo").
2. **Nejdřív krátce uveď do tématu**, pak se ptej.
3. Dál se **střídej**: když žák neví → vysvětli; když ví → naváž a posuň dál.
4. Nikdy neodpovídej jen otázkou na otázku.

## Kvíz (obsah generuje chatbot)

Bot může kdykoli poslat kvíz — pozná sám, kdy už žáka může vyzkoušet. Pošle ho
jako blok, který frontend vyjme z textu a vykreslí jako interaktivní kvíz:

````
```kviz
{"typ":"single","otazka":"…","moznosti":[{"text":"…","spravne":true}, …]}
```
````

- `single` → kolečka, vyhodnotí se **hned po ťuknutí** (bez tlačítka)
- `multi` → čtverečky + tlačítko **Odeslat odpověď**
- Výsledek se botovi pošle **neviditelně** zpět, takže na něj naváže.

### Kdy kvíz přijde (rozhodování)

Necháváme-li rozhodnutí jen na modelu uprostřed dlouhého promptu, kvíz většinou
nepošle. Proto se rozhoduje zvlášť, ve dvou krocích:

1. **Levná pravidla v kódu** (bez volání AI) — kvíz se neřeší dřív než po
   3 zprávách žáka, po kvízu je pauza 4 zprávy, a po 7 zprávách bez kvízu se
   kvíz vynutí (pojistka).
2. **Rozhodčí** — teprve když pravidla projdou, zeptá se server malého modelu
   (`gpt-4o-mini`, odpověď ANO/NE) nad přepisem konverzace: *rozumí už žák
   tématu natolik, aby šlo zkoušet?*

Hlavní model pak dostane **jednoznačný pokyn** („TEĎ POŠLI KVÍZ" / „kvíz teď
neposílej") místo vágního „můžeš, když uznáš za vhodné".
Když si žák o kvíz řekne sám, dostane ho vždy.

## Poznámky

- Persony jsou psané pro školní kontext se **„zadáním od učitele"** (téma / cíl /
  zadání). V Glitchi tuhle roli plní **karta Glitche** — mapuje se do bloku ZADÁNÍ.
- Glitchee počítá s bohatší strukturou karty (Kontrakt, kanonická otázka,
  scaffolding — viz `docs/karta-basic-glitch.md`). Dokud karty tahle pole nemají,
  dostává bot to, co v kartě je (téma, název, text, co už zaznělo).
- Odkazy na GPT asistenty v MD (`## AI asistenti`) jsou referenční — appka je
  nepoužívá, prompt se posílá přímo z katalogu.
