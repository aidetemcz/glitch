# Najdi chybu — „Vibecoding? Už nemusíš ničemu rozumět."

_Glitch typu **Najdi chybu** pro kapitolu Vibe Coding. Vytvořeno: 2026-07-24._

**Interakce:** Rozklik ✅ · Chatbot ✅ · Fork ✅
**Datový soubor:** [`../glitches/najdi-chybu/`](../glitches/najdi-chybu)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `vibecoding-uz-nemusis-rozumet` |
| název | Už nemusíš ničemu rozumět? |
| typ | `najdi-chybu` |
| téma | Tvorba aplikací a vibecoding |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

| pole | hodnota |
| ----- | ----- |
| koncept | `tvorba-aplikaci-iluze-ze-to-umim` |
| oblast (RVP okruh) | — *(nad rámec RVP / průřezové)* |
| téma | Tvorba aplikací a vibecoding |
| vrstva | navazující |
| RVP výstup | — *(bez OVÚ)* |
| digitální kompetence | Digitální vývoj a inovace (`kdi-vin`) |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | tvorba appek s AI |
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

Žák pozná, že vibecoding tvorbu **zrychluje, ale nenahrazuje porozumění**. Umí odlišit falešný pocit kompetence („appka funguje, takže to umím") od skutečného porozumění, které se hodí ve chvíli, kdy se něco rozbije.

### 1.2 Tvrzení s chybami (co má dítě odhalit)

Karta ukáže čtyři tvrzení; některá jsou **chyba**, některá pravda:

1. „Když appku napíše AI, je zbytečné rozumět tomu, jak funguje." — **chyba** (bez porozumění uvízneš, jakmile se to rozbije).
2. „Když appka na první zkoušku funguje, je určitě hotová a bez chyb." — **chyba** (funguje ≠ bez chyb; neotestované případy zůstávají).
3. „Když se AI appka rozbije, hodí se aspoň zhruba rozumět, kde hledat." — pravda.
4. „Vibecoding je nejrychlejší, když víš, co chceš, a umíš výsledek zkontrolovat." — pravda.

### 1.3 Pravdivá verze (do vysvětlení)

Vibecoding je super v tom, že rychle postavíš reálnou věc — popíšeš, co chceš, a AI napíše kód. Ale AI za tebe nepřevezme *porozumění*. Dokud appka běží, může vzniknout pocit „umím to". Jenže ten se rozplyne ve chvíli, kdy něco přestane fungovat a ty nevíš proč. Proto se vyplatí rozumět základům — ne abys všechno psal ručně, ale abys uměl poznat a opravit, když to selže. Tomuhle falešnému pocitu se říká „iluze, že to umím".

### 1.4 Zakázaná tvrzení

- ❌ „AI je hloupá / vibecoding je k ničemu." — cíl je zdravá míra, ne odmítání nástroje.
- ❌ „Kdo si nepíše každý řádek sám, není opravdový programátor." — jde o porozumění, ne o ruční psaní.
- ❌ Strašit, že „tě AI připraví o mozek". — mluvíme o dovednosti kontrolovat výsledek, ne o hrozbě.

---

## 2 Obsah — podání

### 2.1 Karta ve feedu *(viditelné)*

- **Štítek:** `Najdi chybu`.
- **Obrázek:** upoutávka — appka s velkým zeleným „funguje!" a malinkým otazníkem v rohu.
- **Chybné tvrzení (tučně):** „Vibecoding znamená, že appku udělá AI za tebe — takže už nemusíš ničemu rozumět."
- **Kontext (menší text):** „Zní to lákavě. Rozklikni a najdi, co na tom nesedí."

### 2.2 Rozklik — multichoice kvíz

Seznam čtyř tvrzení z 1.2; dítě zaklikne ta, která považuje za chybu (více možností).

### 2.3 Vyhodnocení

Ukáže, co bylo správně/špatně označeno — věcně, bez skóre a srovnávání.

### 2.4 Vysvětlení

Pravdivá verze z 1.3 + proč je omyl lákavý („appka funguje" vypadá jako důkaz, že to umím — dokud se to nerozbije).

---

## 3 Fork *(volitelný artefakt)*

Dítě si může Najdi chybu forknout a rozvést — např. popsat vlastní zážitek, kdy „to fungovalo, dokud…", nebo vymyslet vlastní skoro-pravdivé tvrzení o AI tvorbě a označit v něm chybu. Hodnotí se pravdivost a jasnost, ne počet.

---

## 4 Kontext pro chatbota *(skryté)*

### 4.1 Fakta a pozadí

- Vibecoding = popíšeš přirozenou řečí, co chceš; AI píše kód, ty ho řídíš a hodnotíš.
- Zrychluje tvorbu, ale nenahrazuje porozumění — „iluze kompetence" vzniká, když appka běží, ale já nevím jak.
- Porozumění základům = umět poznat a opravit, když to selže; ne nutně psát vše ručně.

### 4.2 Hranice tématu

- Bot se drží rozdílu „funguje" × „rozumím tomu".
- Když dítě zabředne do konkrétního nástroje → obecný princip a odkaz na Quest.
- Mimo téma → vlídně vrátit.

### 4.3 Co bot nesmí

- Shazovat AI nástroje ani dělat z ručního psaní podmínku „opravdového" programování.
- Strašit z používání AI.
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
| vazby | koncept z mapy: `tvorba-aplikaci-iluze-ze-to-umim` |

---

## 6 Bezpečnost a věková přiměřenost

- **Prebunking, ne strašení** — cílem je zdravý vztah k AI nástrojům, ne technofobie ani elitismus.
- Nepravdivé tvrzení je vždy jasně **označené a vyvrácené**.
- Žádný časovač, žádné srovnávání.
