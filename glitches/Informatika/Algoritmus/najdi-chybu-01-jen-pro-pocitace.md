# Najdi chybu — „Algoritmus je jen složitá věc pro počítače."

_Glitch typu **Najdi chybu** pro kapitolu Algoritmus. Vytvořeno: 2026-07-24._

**Interakce:** Rozklik ✅ · Chatbot ✅ · Fork ✅
**Datový soubor:** [`../glitches/najdi-chybu/`](../glitches/najdi-chybu)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-jen-pro-pocitace` |
| název | Je algoritmus jen pro počítače? |
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
| koncept | `informaticke-mysleni-algoritmus` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Informatické myšlení a algoritmizace |
| vrstva | core |
| RVP výstup | `INF-INF-002-ZV9-006` — *rozdělí problém na jednotlivě řešitelné části a navrhne postupy a algoritmy pro jeho řešení* |
| digitální kompetence | — *(koncept nemá přiřazenou KDI)* |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | běžný život / informatika |
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

Žák pozná, že algoritmus je **obecný pojem** — přesný postup krok za krokem, který nemusí být složitý ani „počítačový". Umí odlišit mýty (jen pro počítače, musí být složitý) od skutečných vlastností (jednoznačnost, pořadí kroků).

### 1.2 Tvrzení s chybami (co má dítě odhalit)

Karta ukáže čtyři tvrzení; některá jsou **chyba**, některá pravda:

1. „Algoritmus musí být uvnitř počítače nebo v programu." — **chyba** (i recept nebo návod na cestu je algoritmus).
2. „Aby to byl algoritmus, musí být složitý." — **chyba** (i pár jednoduchých kroků je algoritmus).
3. „Na pořadí kroků v algoritmu záleží." — pravda (jiné pořadí = jiný výsledek).
4. „Dobrý algoritmus je jednoznačný — dojde podle něj každý ke stejnému výsledku." — pravda.

### 1.3 Pravdivá verze (do vysvětlení)

Algoritmus je prostě **přesný návod krok za krokem, jak něco vyřešit** — jako recept, návod na složení nábytku nebo postup, jak se dostat do školy. Nemusí být v počítači ani složitý. Důležité je, aby byl **jednoznačný** (žádné „nějak" a „tak akorát") a aby **kroky byly ve správném pořadí**. Počítače algoritmy jen provádějí zvlášť rychle a přesně.

### 1.4 Zakázaná tvrzení

- ❌ „Algoritmus a program jsou to samé." — program je algoritmus zapsaný v jazyce, ale algoritmus může být i mimo počítač.
- ❌ „Algoritmy jsou těžké a nejsou pro každého." — cíl je opak: každý denně nějaký používá.
- ❌ Strašit složitostí.

---

## 2 Obsah — podání

### 2.1 Karta ve feedu *(viditelné)*

- **Štítek:** `Najdi chybu`.
- **Obrázek:** upoutávka — recept na palačinky vedle řádku kódu, mezi nimi „=?".
- **Chybné tvrzení (tučně):** „Algoritmus je složitá věc, která existuje jen uvnitř počítačů."
- **Kontext (menší text):** „Vážně jen tam? Rozklikni a najdi, co na tom nesedí."

### 2.2 Rozklik — multichoice kvíz

Seznam čtyř tvrzení z 1.2; dítě zaklikne ta, která považuje za chybu (více možností).

### 2.3 Vyhodnocení

Ukáže, co bylo správně/špatně označeno — věcně, bez skóre a srovnávání.

### 2.4 Vysvětlení

Pravdivá verze z 1.3 + proč je omyl lákavý (slovo „algoritmus" zní vědecky, tak si ho spojíme jen s počítači — přitom recept je taky algoritmus).

---

## 3 Fork *(volitelný artefakt)*

Dítě si může Najdi chybu forknout a rozvést — např. zapsat jako algoritmus nějakou svou každodenní činnost (ranní příprava, cesta do školy) krok za krokem. Hodnotí se jednoznačnost a jasnost, ne délka.

---

## 4 Kontext pro chatbota *(skryté)*

### 4.1 Fakta a pozadí

- Algoritmus = přesný postup krok za krokem; nemusí být v počítači.
- Klíčové vlastnosti: jednoznačnost a záležící pořadí kroků.
- Program = algoritmus zapsaný v programovacím jazyce (podmnožina, ne totéž).

### 4.2 Hranice tématu

- Bot se drží pojmu algoritmus a jeho vlastností.
- Když dítě chce hlouběji (cykly, podmínky) → krátce a odkaz na Quest.
- Mimo téma → vlídně vrátit.

### 4.3 Co bot nesmí

- Tvrdit, že algoritmus = program, nebo že je jen pro počítače.
- Strašit složitostí.
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
| vazby | koncept z mapy: `informaticke-mysleni-algoritmus` |

---

## 6 Bezpečnost a věková přiměřenost

- **Prebunking, ne strašení** — cílem je „algoritmy jsou všude a zvládnu je", ne pocit, že je to nad síly.
- Nepravdivé tvrzení je vždy jasně **označené a vyvrácené**.
- Žádný časovač, žádné srovnávání.
