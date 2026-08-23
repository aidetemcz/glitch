# Karta — Wellbeing / Focus

_Šablona sekcí Glitchů typu **Wellbeing** (dýchání / pozornost / ASMR) na příkladu „Dechové cvičení". Návrh k připomínkám. Vytvořeno: 2026-07-23. Aktualizováno: 2026-07-29 (odstranění mood_selectoru kvůli AI Actu, přejmenování signálu na **focus**)._

> ⚠️ **AI Act — rozpoznávání emocí je zakázáno.** Původní podtyp **`mood_selector`** („Jak se teď cítíš?", diagram energie × soustředění) je **trvale odstraněn** — ve vzdělávacím kontextu spadá pod zákaz systémů odvozujících emoce (AI Act, čl. 5). Glitch **nezjišťuje ani neodhaduje náladu**. Signál pro doporučování je nově čistě **behaviorální** (viz níže) a jmenuje se **focus**.

**Jak číst tenhle soubor.** Wellbeing nejsou znalostní Glitche — jsou to **krátké interaktivní hry a relaxační aktivity**, které jsou pevnou součástí feedu (ne přeskočitelný bonus). Mají několik podtypů: **breathing**, **attention_game** a **asmr** — ty nemají chatbota ani fork; klíčové je, co se měří, kam se to ukládá a jak dlouho. Samostatně stojí typ **[Inspirace](./karta-inspirace.md)** — do feedu vstupuje také jako wellbeing, ale narozdíl od ostatních **má rozklik i chatbota** (a místo forku z něj vzniká projekt).

**Interakce:** Rozklik ⭘ někdy · Chatbot ❌ · Fork ❌
**Datový soubor:** [`../glitches/wellbeing/`](../glitches/wellbeing)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `dychani-01` |
| název | Dechové cvičení |
| typ | `wellbeing` |
| podtyp | `breathing` *(breathing · attention_game · asmr)* |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-23 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

*Wellbeing karty **nemají napojení na koncept** — nejsou znalostní obsah, ale péče o vnitřní nastavení (princip 9 doporučovacího systému). Do doporučování ale vstupují jako **zdroj focus signálu** — a to **jen behaviorálně** (splnil / nesplnil aktivitu), nikdy jako odhad emoce (viz sekce 5 a [`doporucovaci-system.md`](./doporucovaci-system.md)).*

| pole | hodnota |
| ----- | ----- |
| koncept | — *(bez napojení; wellbeing, ne znalostní obsah)* |
| role v doporučování | **zdroj focus signálu** (dokončení relaxační / pozornostní aktivity) pro jemnou úpravu tempa feedu |

---

## 0.2 Fasety

*Wellbeing má **pevnou formu** — není to podání konceptu, takže se fasety **negenerují** (nemá smysl žánr/hloubka/svět příkladu). Tabulka je jen pro úplnost.*

| faseta | hodnota |
| ----- | ----- |
| vizualita | visual-first (interaktivní prvek) |
| délka | mikro |
| jazyk | čeština |
| ostatní fasety | neaplikuje se (pevná forma, negeneruje se) |

---

## 1 Účel a zásady *(redakční)*

*Wellbeing karty pečují o vnitřní nastavení dítěte — ne o znalosti. Nemají „správný výsledek". Řídí se přísnějšími pravidly na data.*

- **Účel:** krátké zklidnění nebo protažení pozornosti mezi znalostními Glitchi.
- **Nepřekročitelné zásady:**
  - **Žádné rozpoznávání emocí** (AI Act). Karta nikdy nezjišťuje, jak se dítě cítí. Měří se jen **fakt, že aktivitu udělalo** (behaviorální signál), ne jeho emoční stav.
  - **Časovače vždy opt-in** (týká se attention_game) — nikdy automaticky.
  - **Žádné srovnávání** — hodnota je jen osobní, nikdy se nezobrazuje vůči ostatním.
  - **Data o dokončení jsou neutrální** — ukládá se jen „splněno / nesplněno" jako behaviorální focus signál, ne obsah prožitku.

---

## 2 Podtypy a jejich karta

### 2.1 `breathing` — dechové cvičení *(příklad)*

- **Štítek:** `Wellbeing`. **Titulek:** „Dechové cvičení."
- **Text:** krátké vysvětlení, proč vědomé dýchání pomáhá soustředění.
- **Interakce:** nastavitelný počet cyklů; animované fáze **nádech / výdech** (bez zádrže), počítadlo uvnitř kolečka, fáze pojmenovaná v patičce. Tlačítko Začít → Pozastavit.
- **Kam se ukládá:** nic citlivého; jen „dokončeno" jako neutrální **focus signál**.

### 2.2 `attention_game` — aktivita na pozornost

- **Štítek:** `Aktivita`. **Titulek + pokyn.**
- **Interakce:** interaktivní 3D objekt (drátěná koule s dírami); dítě otáčí tažením a ťuká na díry vpředu. **Opt-in časovač** jako „ukrajující" kolečko.
- **Kam se ukládá:** počet zásahů jen jako osobní zpětná vazba v relaci; „dokončeno" jako **focus signál**; žádné srovnávání.

### 2.3 `asmr` — zklidňující zvuk / vizuál

- **Štítek:** `Wellbeing`. **Titulek + krátký pokyn.**
- **Interakce:** přehrání krátké zklidňující smyčky (zvuk / vizuál) bez cíle a bez skóre.
- **Kam se ukládá:** nic citlivého; případně jen „přehráno / dokončeno" jako neutrální focus signál.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | podtyp: breathing · délka: mikro · umístění: kdekoli ve feedu |
| **obtížnost** | `1` — lehká (bez znalostní zátěže) |
| **kognitivní náročnost** | — *(neaplikuje se; wellbeing není znalostní obsah)* |
| **energetická náročnost** | nízká |
| **typ zátěže** | relaxace (breathing · asmr) · soustředění (attention_game) |
| **role ve stavu uživatele** | breathing / asmr / attention_game se **servírují jako oddech**; jejich **dokončení** je behaviorální **focus signál** (ne měření emoce) |
| signál dokončení | breathing: dokončení cyklů · attention: ukončení hry · asmr: přehrání |
| vliv na doporučování | **focus signál** (splněná relaxační / pozornostní aktivita) může jemně upravit tempo feedu — future-facing, až bude aktivit více; **žádný odhad nálady** |
| fork | `false` |

---

## 6 Bezpečnost, soukromí a relace

- **Žádné rozpoznávání emocí** (AI Act, čl. 5) — karta nikdy nezjišťuje ani neodvozuje náladu. Odstraněn podtyp `mood_selector`.
- **Ukládá se jen behaviorální fakt** („dokončeno") — ne obsah prožitku. I ten žije jen v relaci a nepropisuje se do trvalého profilu jako hodnocení.
- **Žádné srovnávání, žádné žebříčky, žádné veřejné sdílení** výsledku hry.
- **Časovač u aktivity je opt-in** — časový tlak se nikdy nevytváří sám.
- Wellbeing karta se **nedá „propadnout"** — neexistuje špatný výsledek, jen krátký oddech.
