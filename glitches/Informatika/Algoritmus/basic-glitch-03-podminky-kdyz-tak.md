# Basic Glitch — Podmínky: když–tak (Program se rozhoduje sám)

_Basic Glitch pro kapitolu Algoritmus, quest „Od návodu k emergenci". Vytvořeno: 2026-07-24._

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-podminky-kdyz-tak` |
| název | Program se rozhoduje sám |
| kapitola | Algoritmus |
| quest | Od návodu k emergenci |
| pořadí v questu | 3 (úloha o podmínkách — navazuje na ni Hra života) |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

| pole | hodnota |
| ----- | ----- |
| koncept | `programovani-podminky-v-kodu` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Programování |
| vrstva | core |
| RVP výstup | `INF-INF-002-ZV9-007` — *v blokově orientovaném programovacím jazyce vytvoří přehledný program, používá opakování, větvení programu, proměnné* |
| digitální kompetence | — *(koncept nemá přiřazenou KDI)* |
| prerekvizity (z mapy) | `programovani-promenne-a-datove-typy`, `informaticke-mysleni-logika-a-booleovske-vyrazy` |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | hra (skóre, výhra/prohra) |
| hloubka | intro |
| vizualita | vyvážená (blokový úryvek + text) |
| formalismus | lehký (blokový pseudokód if/else) |
| délka | standard |
| žánr | výklad + malá stavba |
| jazyk | čeština |
| nosiče | blokový úryvek, text |

---

## 1 Kontrakt

### 1.1 Výukový cíl

Žák chápe **větvení**: program se umí sám rozhodnout mezi dvěma cestami podle toho, jestli platí nějaká **podmínka** („když platí tohle, udělej tamto, jinak něco jiného"). Umí jednoduchou podmínku přečíst i sestavit tak, aby program reagoval různě podle situace.

### 1.2 Povinné body

Každé podání tohoto Glitche musí pokrýt:

1. **Podmínka** je otázka, na kterou je odpověď **ano / ne** (pravda / nepravda) — např. „skóre ≥ 100?".
2. **Větvení „když–tak (jinak)"** (if/else): *když* podmínka platí, provede se jedna větev; *jinak* druhá.
3. Program se tím **rozhoduje sám** — nemusíš mu pro každou situaci psát zvlášť.
4. Vždy se provede **právě jedna** větev, podle toho, jestli podmínka platí.
5. Podmínky se dají skládat spojkami **A ZÁROVEŇ (AND)**, **NEBO (OR)**, **NE (NOT)**. *(Navazuje na logiku a booleovské výrazy.)*
6. Most k Hře života (úloha 5): její pravidla jsou přesně taková „když–tak" — *„když má buňka 3 sousedy, tak ožije"*.

### 1.3 Kanonická otázka (s odpovědí)

**Otázka:** V programu je `když (skóre ≥ 100): zobraz "Výhra"  jinak: zobraz "Hraj dál"`. Skóre je 100. Co program udělá a proč? **Jádro správné odpovědi:** Zobrazí **„Výhra"**. Podmínka „skóre ≥ 100" při skóre 100 **platí** (100 je rovno 100, a znak ≥ znamená „větší nebo rovno"), takže se provede větev *když*. Větev *jinak* („Hraj dál") se neprovede — vždy se spustí právě jedna větev.

### 1.4 Zakázaná tvrzení a časté miskoncepce

* ❌ „Provedou se obě větve." — Ne, vždy právě **jedna** podle toho, jestli podmínka platí.
* ❌ „‚Větší nebo rovno' (≥) neplatí, když je to přesně rovno." — Platí; ≥ zahrnuje i rovnost.
* ❌ „‚A zároveň' a ‚nebo' je totéž." — Ne: AND vyžaduje, aby platily **obě** části; OR stačí **jedna**.
* ❌ „Program se rozhoduje, protože přemýšlí / chce." — Nepřemýšlí; jen vyhodnotí, jestli podmínka platí. *(Stejná past jako antropomorfizace buněk v Hře života.)*

---

## 2 Obsah — kanonické podání

### 2.1 Karta ve feedu

**Štítek:** Algoritmus **Titulek:** Program se rozhoduje sám **Text:** Jak appka pozná, kdy ukázat „Výhra" a kdy „Hraj dál"? Nemá to napsané pro každý případ zvlášť — použije **podmínku**. Zvládneš říct, co se stane při skóre přesně 100? **Interakce:** krátký blokový úryvek `když (skóre ≥ 100) … jinak …`; dítě si ho nejdřív jen přečte.

### 2.2 Rozklik — vrstva 1: pozorování

Přečti si tenhle kousek:

```
když (skóre ≥ 100):
    zobraz "Výhra"
jinak:
    zobraz "Hraj dál"
```

Zkus odpovědět (zatím jen tipni): co se zobrazí při skóre **150**? A při **40**? A při přesně **100**? U kterého sis nebyl jistý?

### 2.3 Rozklik — vrstva 2: odhalení

Tohle je **větvení** — program se rozhoduje pomocí **podmínky**. Podmínka `skóre ≥ 100` je otázka s odpovědí **ano/ne**: buď platí, nebo neplatí. **Když** platí, provede se první větev (`"Výhra"`); **jinak** ta druhá (`"Hraj dál"`). Vždycky se spustí **právě jedna** — nikdy obě. (Při skóre 100 podmínka platí, protože ≥ znamená „větší **nebo rovno".)

Podmínky se dají i skládat: *„když (má klíč) **A ZÁROVEŇ** (dveře jsou zamčené): odemkni"* — musí platit obě části. Se spojkou **NEBO** by stačila jedna.

A teď to hlavní pro tenhle quest: **pravidla Hry života (úloha 5) jsou přesně taková „když–tak"** — *„když má živá buňka méně než 2 sousedy, tak umře"*. V další úloze (4) k nim přidáš ještě **opakování** — a z těch dvou věcí pak vznikne něco překvapivého.

### 2.4 Kvíz (rychlá kontrola porozumění)

1. Kolik větví se u `když … jinak …` provede? *(a) obě, (b) právě jedna ✓, (c) žádná)*
2. Skóre je přesně 100. Podmínka `skóre ≥ 100`… *(a) platí ✓, (b) neplatí, (c) nedá se říct)*
3. „Když (mám lístek) A ZÁROVEŇ (vlak přijel): nastup." Kdy nastoupíš? *(a) když platí aspoň jedno, (b) jen když platí obě zároveň ✓, (c) vždycky)*

---

## 3 Úrovně vypracování a kritéria hodnocení

### 🟢 Jednoduchá

**Zadání:** Projdi rozklik, vyplň kvíz a vlastními slovy (3–5 vět) vysvětli, co je podmínka a co udělá „když–tak" — na vlastním příkladu z hry nebo z běžného života. **Kritéria splnění:**

* Vysvětlení obsahuje podmínku jako otázku ano/ne.
* Zmiňuje, že se provede právě jedna větev podle toho, jestli podmínka platí.
* Vlastní příklad dává smysl (podmínka + dvě různé reakce). **Typický neúspěch a co s ním:** žák řekne „program se rozhodne", ale neřekne podle čeho. Zkoušející se doptá: *„A co přesně program zkontroluje, než se rozhodne?"*

### 🟡 Střední

**Zadání:** Navrhni podmínku pro nějakou hru nebo appku (např. „kdy se hráči zobrazí odměna") a zapiš ji jako `když … jinak …`. Pak vymysli **tři různé situace** (tři hodnoty) a u každé urči, která větev se provede a proč. Aspoň jednu situaci zvol tak, aby padla přesně na **hranici** podmínky (např. přesně 100 u `≥ 100`). **Kritéria splnění:**

* Zápis `když … jinak …` je smysluplný a má jasnou podmínku.
* U všech tří situací je správně určená větev, včetně hraničního případu.
* Žák vysvětlí hraniční případ (proč ≥ zahrnuje rovnost). **Poznámka pro zkoušejícího:** hraniční případ je jádro — když ho žák zvládne, rozumí podmínce doopravdy.

### 🔴 Master

**Zadání (dvě varianty, žák volí):** **A — složená podmínka:** Vymysli pravidlo, které potřebuje **A ZÁROVEŇ** nebo **NEBO** (např. „vstup jen když má lístek A zároveň není vyprodáno"), zapiš ho a k němu **tabulku** aspoň čtyř situací s výsledkem (vstup / nevstup). **B — zásah do kódu/hry:** V nějaké jednoduché hře (Scratch apod.) změň jednu podmínku a předem popiš hypotézu, jak se hra začne chovat jinak; pak porovnej se skutečností. **Kritéria splnění:**

* Existuje forknutelný artefakt (tabulka situací / upravená hra) — jiný žák na něm může stavět.
* U varianty A tabulka správně rozlišuje AND vs. OR (že AND je přísnější).
* Žák formuluje vztah „podmínka → chování programu" na vlastním případu. **Poznámka:** složené podmínky jsou přímá příprava na čtení pravidel Hry života.

---

## 4 Kontext pro chatbota

### 4.1 Fakta a pozadí

* Podmínka = výraz, který je buď pravda, nebo nepravda (booleovský). Větvení if/else provede podle toho jednu ze dvou cest.
* Vždy se provede právě jedna větev; `jinak` (else) je nepovinné — bez něj se při neplatné podmínce prostě nic nestane.
* Porovnání: `=` rovno, `≥` větší nebo rovno, `>` větší, `<` menší, `≤` menší nebo rovno. Časté chyby jsou na hranici (rovnost).
* Skládání: **AND** (obě části), **OR** (aspoň jedna), **NOT** (obrácení). Navazuje na koncept logiky a booleovských výrazů.
* Most k Hře života: její čtyři pravidla jsou „když–tak" podmínky nad počtem sousedů; v úloze 4 se k nim přidá opakování (cyklus).

### 4.2 Hranice tématu

* Bot se drží podmínek, větvení if/else, porovnání a spojek AND/OR/NOT.
* Když dítě zabředne do opakování → naznačit a odkázat: „opakování je úloha 4 questu."
* Když chce hlouběji do konkrétního jazyka → obecný princip a zpět k blokovému zápisu.
* Mimo téma → vlídně vrátit.

### 4.3 Scaffolding — typické zádrhely a jak napovídat

**Zádrhel: dítě si myslí, že se provedou obě větve.**

1. „Může platit ‚skóre ≥ 100' a zároveň ‚skóre < 100' v jednu chvíli?"
2. „Když platí ta první, co se stane s tou druhou?"
3. Shrnout: podmínka buď platí, nebo ne → provede se právě jedna větev.

**Zádrhel: hraniční případ (skóre přesně 100 u ≥ 100).**

1. „Co přesně znamená ten znak ≥ — zkus ho přečíst celý."
2. „Je 100 ‚větší nebo rovno' než 100?"
3. Ukázat na číselné ose, že ≥ zahrnuje i rovnost.

**Zádrhel: záměna A ZÁROVEŇ a NEBO.**

1. „U ‚mám lístek A zároveň vlak přijel' — stačí jen lístek?"
2. Nechat dítě vyjmenovat situace, kdy nastoupí a kdy ne.
3. Shrnout: AND = obě, OR = aspoň jedna.

**Zádrhel: „program se rozhoduje, protože přemýšlí."**

1. „Přemýšlí program, nebo jen kouká, jestli podmínka platí?"
2. Most k Hře života: „stejně jako buňka nic nechce — jen se aplikuje pravidlo."

### 4.4 Co bot nesmí

* Neprozrazovat řešení kvízu ani hotové tabulky situací na střední/master úrovni; jen navádět (max. stupeň 3 po dvou pokusech dítěte).
* Nehodnotit srovnáním s ostatními.
* Nepoužívat zakázaná tvrzení z 1.4 ani je nepotvrzovat (zvlášť antropomorfizaci — připravuje past z Hry života).
* Při frustraci nabídnout jednodušší krok, ne tlačit na dokončení.
* Časový tlak nikdy nevytvářet; tenhle Glitch žádný časovač nemá.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety kanonického podání | viz sekce 0.2 |
| **obtížnost** | `2` — střední |
| **kognitivní náročnost** | aplikovat *(revidovaná Bloomova taxonomie; na master úrovni „analyzovat")* |
| **energetická náročnost** | střední |
| **typ zátěže** | výklad + malá stavba |
| **vhodné při náladě** | spíš vyšší soustředění; při únavě servírovat kratší znalostní Glitch |
| prerekvizity | `programovani-promenne-a-datove-typy`, `informaticke-mysleni-logika-a-booleovske-vyrazy` |
| navazuje | úloha 4 questu (Cykly: opakování) → Hra života |
| signál dokončení | jednoduchá: kvíz + vysvětlení · střední: podmínka + tři situace vč. hranice · master: forknutelný artefakt |
| poctivá absence | pokud žák žádá neexistující podání, loguje se jako poptávka; nesubstituovat tiše |

---

## 6 Bezpečnost a věková přiměřenost

* Slovník „výhra/prohra" je herní kontext, ničím citlivý; bot rámuje věcně.
* Žádný časový limit, žádné srovnávání mezi žáky, úroveň vypracování není veřejný odznak.
* Emoční data z konverzace se nikam nepropisují.
