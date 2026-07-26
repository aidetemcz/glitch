# Najdi chybu — „Co napíše AI, je vždycky správné."

_Glitch typu **Najdi chybu** pro kapitolu Vibe Coding. Vytvořeno: 2026-07-24._

**Interakce:** Rozklik ✅ · Chatbot ✅ · Fork ✅
**Datový soubor:** [`../glitches/najdi-chybu/`](../glitches/najdi-chybu)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `vibecoding-ai-kod-je-vzdy-spravny` |
| název | Je AI kód vždycky správný? |
| typ | `najdi-chybu` |
| téma | Programování |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

| pole | hodnota |
| ----- | ----- |
| koncept | `programovani-cteni-a-hodnoceni-ai-kodu` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Programování |
| vrstva | navazující |
| RVP výstup | `INF-INF-002-ZV9-005` — *po přečtení jednotlivých kroků algoritmu vysvětlí celý postup a určí problém, který je daným algoritmem řešen* |
| digitální kompetence | Digitální vývoj a inovace (`kdi-vin`) |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | tvorba appek / AI kód |
| hloubka | standard |
| vizualita | vyvážená (upoutávka + text) |
| formalismus | žádný |
| délka | krátká |
| žánr | prebunking / kvíz |
| jazyk | čeština |
| nosiče | obrázek, text |

---

## 1 Kontrakt *(vlastní redakce, skryté)*

### 1.1 Výukový cíl

Žák pozná, že kód od AI **není automaticky správný ani bezpečný** — může obsahovat chyby, díry, nebo se odkazovat na něco, co neexistuje. Umí označit tenhle omyl a ví, že kód se má přečíst, pochopit a otestovat, než se použije.

### 1.2 Tvrzení s chybami (co má dítě odhalit)

Karta ukáže čtyři tvrzení; některá jsou **chyba**, některá pravda:

1. „Kód od AI je vždycky správný a bezpečný — stačí ho zkopírovat." — **chyba** (může být chybný i nebezpečný).
2. „AI si občas vymyslí knihovnu nebo funkci, která vůbec neexistuje." — pravda (i v kódu AI „halucinuje").
3. „Vygenerovaný kód není potřeba testovat." — **chyba** (testovat se musí vždy).
4. „Než kód použiju, měl bych zhruba rozumět, co dělá." — pravda.

### 1.3 Pravdivá verze (do vysvětlení)

AI je skvělý pomocník při psaní kódu, ale to, co napíše, **není záruka správnosti**. Může tam být chyba, bezpečnostní slabina, nebo si AI „vymyslí" název knihovny, který neexistuje (tomu se říká halucinace — děje se to i u kódu, ne jen u textu). Proto platí jednoduché pravidlo: **přečti → zhruba pochop, co kód dělá → otestuj → teprve pak použij.** Kdo kód jen slepě kopíruje, věří něčemu, čemu nerozumí.

### 1.4 Zakázaná tvrzení

- ❌ „AI kódu se nedá věřit vůbec." — přehnaný skepticismus; cíl je ověřování, ne odmítání.
- ❌ Konkrétní návody, jak zneužít bezpečnostní díru.
- ❌ Strašit, že „appky od AI jsou nebezpečné". — mluvíme o zdravé kontrole, ne o hrozbě.

---

## 2 Obsah — podání

### 2.1 Karta ve feedu *(viditelné)*

- **Štítek:** `Najdi chybu`.
- **Obrázek:** upoutávka — okno s kódem a velkým zeleným fajfkovým razítkem „100 % OK" (ironicky).
- **Chybné tvrzení (tučně):** „Co ti AI vygeneruje jako kód, je vždycky správné a bezpečné — stačí zkopírovat."
- **Kontext (menší text):** „Vážně vždycky? Rozklikni a najdi, co na tom nesedí."

### 2.2 Rozklik — multichoice kvíz

Seznam čtyř tvrzení z 1.2; dítě zaklikne ta, která považuje za chybu (více možností).

### 2.3 Vyhodnocení

Ukáže, co bylo správně/špatně označeno — věcně, bez skóre a srovnávání.

### 2.4 Vysvětlení

Pravdivá verze z 1.3 + proč je omyl lákavý (kód od AI vypadá sebejistě a „hotově", stejně jako sebejistě zní i její halucinace).

---

## 3 Fork *(volitelný artefakt)*

Dítě si může Najdi chybu forknout a rozvést — např. sepsat vlastní „kontrolní seznam", než použije AI kód (přečíst, pochopit, otestovat), nebo popsat případ, kdy mu AI poradila něco, co nefungovalo. Hodnotí se pravdivost a jasnost.

---

## 4 Kontext pro chatbota *(skryté)*

### 4.1 Fakta a pozadí

- AI generuje kód na základě pravděpodobnosti — může být správný, ale i chybný nebo nebezpečný.
- Halucinace v kódu: vymyšlené názvy knihoven/funkcí, které neexistují.
- Zdravý postup: přečíst → pochopit, co dělá → otestovat → použít.

### 4.2 Hranice tématu

- Bot se drží principu „AI kód se ověřuje, ne slepě kopíruje".
- Když dítě chce hlouběji do bezpečnosti → obecný princip a odkaz na Quest.
- Mimo téma → vlídně vrátit.

### 4.3 Co bot nesmí

- Dávat návody na zneužití zranitelností.
- Strašit z používání AI nebo tvrdit, že AI kódu nelze věřit vůbec.
- Prozrazovat řešení kvízu, dokud dítě neoznačí; jen navádět.
- Srovnávat s ostatními, vytvářet časový tlak.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 |
| **obtížnost** | `2` — střední |
| **kognitivní náročnost** | analyzovat *(rozliš pravdu od chyby)* |
| **energetická náročnost** | střední |
| **typ zátěže** | soustředění (kritické čtení) |
| **vhodné při náladě** | spíš vyšší soustředění; při únavě odložit |
| signál dokončení | označení v kvízu + přečtení vysvětlení |
| fork | `true` (volitelný) |
| vazby | koncept z mapy: `programovani-cteni-a-hodnoceni-ai-kodu` |

---

## 6 Bezpečnost a věková přiměřenost

- **Prebunking, ne strašení** — cílem je zdravá kontrola výstupů AI, ne technofobie.
- Nepravdivé tvrzení je vždy jasně **označené a vyvrácené**.
- Bez konkrétních návodů ke zneužití; žádný časovač, žádné srovnávání.
