# Fun fact — V milionu jmen najdeš to pravé za ~20 kroků

_Glitch typu **Fun fact** pro kapitolu Algoritmus. Vytvořeno: 2026-07-24._

**Interakce:** Rozklik ✅ · Chatbot ✅ · Fork ✅
**Datový soubor:** [`../glitches/funfact/`](../glitches/funfact)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-puleni-v-milionu` |
| název | Milion jmen, ~20 kroků |
| typ | `funfact` |
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
| koncept | `informaticke-mysleni-zakladni-algoritmy` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Informatické myšlení a algoritmizace |
| vrstva | navazující |
| RVP výstup | `INF-INF-002-ZV9-005` — *po přečtení jednotlivých kroků algoritmu vysvětlí celý postup a určí problém, který je daným algoritmem řešen* |
| digitální kompetence | — *(koncept nemá přiřazenou KDI)* |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | hledání / efektivita |
| hloubka | intro |
| vizualita | vyvážená (ilustrace + text) |
| formalismus | žádný |
| délka | krátká |
| žánr | zajímavost / výklad |
| jazyk | čeština |
| nosiče | obrázek, text |

---

## 1 Kontrakt *(vlastní redakce, skryté)*

### 1.1 Jádro faktu (co musí zůstat pravda)

Kdybys hledal jméno v **seřazeném** seznamu milionu jmen tak, že bys šel jedno po druhém, mohl bys udělat až milion kroků. Ale existuje chytřejší postup — **půlení** (binární vyhledávání): podíváš se doprostřed, zjistíš, jestli je hledané jméno před, nebo za ním, a **půlku seznamu rovnou zahodíš**. Když to opakuješ, z milionu ti po každém kroku zbyde polovina: milion → 500 tisíc → 250 tisíc… a **za nějakých 20 kroků** jsi u cíle. Podmínka je, že seznam musí být **seřazený**.

### 1.2 Zakázaná tvrzení a časté miskoncepce

- ❌ „Půlení funguje na jakémkoli seznamu." — Ne, musí být **seřazený**.
- ❌ „Je to přesně 20 kroků vždy." — Zhruba 20 (dvacet půlení dá přes milion možností); u jiného počtu položek je to jinak.
- ❌ „Počítač to zvládne, protože je rychlý." — Hlavní je **chytrý postup**, ne jen rychlost stroje; půlení šetří kroky i tobě na papíře.

---

## 2 Obsah — podání

### 2.1 Karta ve feedu *(viditelné)*

- **Štítek:** `Fun fact` (na kontrastní dlaždici — např. růžové).
- **Ilustrace:** seznam, který se s každým krokem zmenšuje na polovinu.
- **Jádro faktu (titulek, tučně):** „V milionu seřazených jmen najdeš to pravé za ~20 kroků."
- **Krátké rozvedení:** „Trik se jmenuje půlení — pokaždé zahodíš půlku, která tě nezajímá."

### 2.2 Rozklik — vysvětlení konceptu

Delší kontext (2–3 odstavce): jak funguje hledání jedno-po-druhém vs. půlení; ukázka na malém příkladu (najdi číslo od 1 do 100 „hádáním na půl" za ~7 pokusů); proč musí být seznam seřazený. Zakončení mostem: proto se u algoritmů ptáme nejen „vyjde to?", ale i „**kolik kroků to stojí?**" — chytrý postup ušetří obrovské množství práce.

---

## 3 Fork *(volitelný artefakt)*

Fun fact může mít fork: dítě si vyzkouší „hádání na půl" — kamarád si myslí číslo od 1 do 100 a ono ho hádá půlením; zapíše, na kolik pokusů to zvládlo. Nebo popíše, kde se půlení hodí v běžném životě (třeba hledání ve slovníku). Hodnotí se, že artefakt existuje a je pravdivý.

---

## 4 Kontext pro Tinybota *(skryté)*

### 4.1 Fakta a pozadí

- Binární vyhledávání (půlení) funguje na **seřazeném** seznamu; v každém kroku zahodí polovinu.
- Počet kroků roste velmi pomalu: milion položek ≈ 20 kroků, miliarda ≈ 30 kroků.
- Hledání jedno-po-druhém (lineární) může potřebovat až tolik kroků, kolik je položek.

### 4.2 Hranice tématu

- Bot zůstává u intuice půlení; nezabíhá do vzorců a „logaritmů" (leda by dítě chtělo a bylo starší).
- Když dítě chce hlouběji (řazení, další algoritmy) → krátce a odkaz na Quest.
- Mimo téma → vlídně vrátit.

### 4.3 Co bot nesmí

- Tvrdit, že půlení funguje na neseřazeném seznamu.
- Uvádět „přesně 20 kroků" jako pravidlo pro cokoli.
- Srovnávat dítě s ostatními, vytvářet časový tlak.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 |
| **obtížnost** | `1` — lehká *(pointa je jednoduchá; hlubší vysvětlení volitelné)* |
| **kognitivní náročnost** | porozumět |
| **energetická náročnost** | nízká |
| **typ zátěže** | odlehčení (čtení pro radost) s malým „aha" |
| **vhodné při náladě** | i při nižším soustředění — pointa je rychlá |
| signál dokončení | rozklik (přečtení) · volitelně konverzace |
| fork | `true` (volitelný) |
| vazby | koncept z mapy: `informaticke-mysleni-zakladni-algoritmy` |

---

## 6 Bezpečnost a věková přiměřenost

- Téma je nekonfliktní; bot drží vlídný, hravý tón.
- Žádný časovač, žádné srovnávání.
- Fakt musí zůstat přesný — vždy zdůraznit podmínku „seřazený seznam" a „zhruba 20 kroků".
