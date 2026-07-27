# Najdi chybu — „Hlavně že to vyjde. Na rychlosti nezáleží."

_Glitch typu **Najdi chybu** pro kapitolu Algoritmus. Vytvořeno: 2026-07-24._

**Interakce:** Rozklik ✅ · Chatbot ✅ · Fork ✅
**Datový soubor:** [`../glitches/najdi-chybu/`](../glitches/najdi-chybu)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-na-rychlosti-nezalezi` |
| název | Na rychlosti algoritmu nezáleží? |
| typ | `najdi-chybu` |
| téma | Informatické myšlení a algoritmizace |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

| pole | hodnota |
| ----- | ----- |
| koncept | `informaticke-mysleni-efektivita-reseni` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Informatické myšlení a algoritmizace |
| vrstva | navazující |
| RVP výstup | — *(bez OVÚ)* |
| digitální kompetence | — *(koncept nemá přiřazenou KDI)* |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | efektivita / velká data |
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

Žák pozná, že u algoritmu **nezáleží jen na správnosti, ale i na tom, kolik to stojí kroků, času a paměti** — a že to začne být důležité, jakmile přibude dat nebo uživatelů.

### 1.2 Tvrzení s chybami (co má dítě odhalit)

Karta ukáže čtyři tvrzení; některá jsou **chyba**, některá pravda:

1. „Když algoritmus dá správný výsledek, je úplně jedno, kolik kroků k tomu potřebuje." — **chyba** (u velkých dat může být pomalé řešení nepoužitelné).
2. „Dva různé algoritmy na tentýž úkol můžou být hodně různě rychlé." — pravda.
3. „U milionu položek je jedno, jestli řešení hledá chytře, nebo prochází jednu po druhé." — **chyba** (chytré řešení ušetří obrovsky kroků).
4. „Když algoritmus nikdy neskončí (zacyklí se), je to problém." — pravda.

### 1.3 Pravdivá verze (do vysvětlení)

Správný výsledek je základ — ale ne všechno. Stejný problém jde vyřešit mnoha způsoby a ty se liší **počtem kroků, časem a pamětí**. U pár položek si toho nevšimneš. Jakmile ale přibude dat (tisíce, miliony), špatně zvolený postup může trvat tak dlouho, že je vlastně nepoužitelný. Proto se u algoritmů ptáme nejen „vyjde to?", ale i „kolik to stojí?".

### 1.4 Zakázaná tvrzení

- ❌ „Rychlost je vždycky důležitější než správnost." — ne, správnost je základ; efektivita je druhá otázka.
- ❌ „Pomalý algoritmus je vždycky špatně." — u malých dat je pomalý postup často úplně v pohodě.
- ❌ Zahlcovat vzorci a „velkým O" — na téhle úrovni stačí intuice „víc dat → záleží na počtu kroků".

---

## 2 Obsah — podání

### 2.1 Karta ve feedu *(viditelné)*

- **Štítek:** `Najdi chybu`.
- **Obrázek:** upoutávka — dvě cesty k cíli, jedna krátká, jedna klikatá.
- **Chybné tvrzení (tučně):** „Hlavně že algoritmus vyjde. Na tom, jak dlouho to trvá, vůbec nezáleží."
- **Kontext (menší text):** „Fakt vůbec? Rozklikni a najdi, co na tom nesedí."

### 2.2 Rozklik — multichoice kvíz

Seznam čtyř tvrzení z 1.2; dítě zaklikne ta, která považuje za chybu (více možností).

### 2.3 Vyhodnocení

Ukáže, co bylo správně/špatně označeno — věcně, bez skóre a srovnávání.

### 2.4 Vysvětlení

Pravdivá verze z 1.3 + proč je omyl lákavý (u domácích příkladů s pár čísly rozdíl neucítíš — problém se objeví až u velkých dat).

---

## 3 Fork *(volitelný artefakt)*

Dítě si může Najdi chybu forknout a rozvést — např. popsat dva způsoby, jak najít konkrétní kartu v roztřídeném a v neroztříděném balíčku, a odhadnout, který je rychlejší a proč. Hodnotí se jasnost úvahy, ne přesná čísla.

---

## 4 Kontext pro Tinybota *(skryté)*

### 4.1 Fakta a pozadí

- Efektivita = kolik stojí řešení kroků, času, paměti.
- Stejný problém má mnoho řešení různé „ceny".
- Rozdíl je nepatrný u malých dat, zásadní u velkých.

### 4.2 Hranice tématu

- Bot zůstává u intuice „víc dat → záleží na počtu kroků"; nezabíhá do složitostní teorie.
- Když dítě chce hlouběji (hledání, řazení) → krátce a odkaz na Quest.
- Mimo téma → vlídně vrátit.

### 4.3 Co bot nesmí

- Tvrdit, že rychlost je důležitější než správnost.
- Zahlcovat „velkým O" a vzorci.
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
| vazby | koncept z mapy: `informaticke-mysleni-efektivita-reseni` |

---

## 6 Bezpečnost a věková přiměřenost

- **Prebunking, ne strašení** — cílem je porozumění, ne pocit, že „všechno musí být super rychlé".
- Nepravdivé tvrzení je vždy jasně **označené a vyvrácené**.
- Žádný časovač, žádné srovnávání.
