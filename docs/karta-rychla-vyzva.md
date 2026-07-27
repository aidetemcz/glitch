# Karta — Rychlá výzva

_Šablona sekcí Glitche typu **Rychlá výzva** na příkladu „Násobení 310×15". Návrh k připomínkám. Vytvořeno: 2026-07-23._

**Jak číst tenhle soubor.** Rychlá výzva je nejjednodušší typ Glitche: **nerozklikávací** kognitivní rozcvička. Dítě splní výzvu přímo na kartě, dostane okamžitou zpětnou vazbu a scrolluje dál. Proto tady odpadají sekce, které mají složitější typy (žádné úrovně vypracování, žádný kontext pro chatbota) — zůstává jen zadání, odpovědi a nutné minimum metadat.

**Interakce:** Rozklik ❌ · Chatbot ❌ · Fork ❌
**Datový soubor:** [`../glitches/rychla-vyzva/`](../glitches/rychla-vyzva)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `matematika-nasobeni-310x15` |
| název | Násobení 310×15 |
| typ | `rychla-vyzva` |
| předmět | Matematika |
| varianta | `vypocet` *(vypocet · slovni-uloha · obrazec · textove-odpovedi)* |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-23 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

*Provázání na [mapu konceptů](../knowledge-map/). Rychlá výzva je kognitivní **rozcvička**, ne výklad konceptu — proto obvykle **nemá napojení na koncept** (u matematických rozcviček je mimo informatickou mapu). Pokud výjimečně procvičuje konkrétní informatický koncept, uvede se `koncept` a zdědí RVP i digi kompetenci z mapy.*

| pole | hodnota |
| ----- | ----- |
| koncept | — *(bez napojení; matematická rozcvička)* |
| oblast (RVP okruh) | — |
| téma | rozcvička / procvičení |

---

## 0.2 Fasety

*Fasety tohoto podání (pro doporučování; hodnoty se volí u konkrétní výzvy).*

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | generický (čísla) |
| hloubka | intro |
| vizualita | text-first *(u varianty `obrazec` visual-first)* |
| formalismus | lehký (číselný zápis) |
| délka | tl;dr |
| žánr | kvíz |
| jazyk | čeština |
| nosiče | text *(u `obrazec` i diagram/SVG)* |

---

## 1 Zadání a řešení *(redakční, skryté)*

*U Rychlé výzvy nahrazuje „kontrakt" jen stručná redakční poznámka: co se procvičuje, jaká je správná odpověď a proč jsou špatné odpovědi lákavé (aby nesprávné možnosti nebyly náhodné, ale dávaly smysl jako typické chyby).*

- **Co procvičuje:** rychlé násobení dvojciferným číslem přes rozklad (`310×15 = 310×10 + 310×5`).
- **Správná odpověď:** `4 650`.
- **Proč špatné možnosti lákají:**
  - `4 350` — chyba v mezisoučtu (310×5 spočítáno jako 1 250 místo 1 550).
  - `4 750` — přehození číslice, typický překlep.
  - `3 950` — dítě sečte jen 310×10 a přičte 310×3.

---

## 2 Karta ve feedu *(viditelné)*

**Pevná struktura (platí pro KAŽDOU Rychlou výzvu — kvůli editoru i konzistenci).**
Pozice prvků jsou vždy stejné (dle Figmy, rámec 402×874); mění se jen jejich
**obsah** a v editoru **zvolený styl fontu** u každého textu. Rozvržení shora dolů:

1. **Nadpis** (nahoře, y≈216) — velký text výzvy (pole `question`). Styl fontu
   volitelný přes `questionStyle` = `h1` / `h3` / `h4` (výchozí `h3`; krátký
   číselný příklad jako „310×15=" má `h1`).
2. **Popis / scénář** — nepovinná próza hned pod nadpisem (pole `taskText` →
   `<p>`). Styl přes `taskStyle` (výchozí `p`). Např. „Kamarádka ti říká: …".
3. **Otázka / podotázka** — nepovinný odstavec `<p>` (pole `sub`). Styl přes
   `subStyle` (výchozí `p`). Např. „Který popis sedí nejlíp?".
   *Pozn.: když je přítomen vizuál (bod 4), otázka se čte jako popisek těsně nad
   tlačítky (aby vizuál zůstal vystředěný); jinak stojí hned pod nadpisem.*
4. **Vizuál** — nepovinný prostřední prvek, vystředěný v prázdném prostoru.
   Právě jeden z: obrazec (`figure`), obrázek (`image`) nebo kód (`code`).
   **Textový úkol NENÍ vizuál** — próza patří vždy do bodů 2–3 nahoře.
5. **Tlačítka odpovědí** (ukotvená DOLE) — právě **jedna správná**. Styl textu
   přes `answerStyle` (výchozí `h4` u krátkých, `p` u dlouhých). Rozvržení se
   řídí délkou popisků a počtem možností (viz tabulka typů níže).

**Font-styl je u každého textu volitelný, pozice se nemění.** Editor u nadpisu,
popisu, otázky i tlačítek nabídne výběr `h1 / h3 / h4 / p`; do dat se uloží jako
`questionStyle` / `taskStyle` / `subStyle` / `answerStyle`. Kód sází styly jako
třídy `g-h1 / g-h3 / g-h4 / g-p` (viz `js/feed.js` → `quick_challenge`).

- **Štítek:** `Rychlá výzva` (žlutý).
- **Časovač:** vždy **opt-in** — nikdy se nespustí automaticky. Dítě si ho zapne kliknutím na kolečko.
- **Zpětná vazba:** okamžitá — správná odpověď se zvýrazní (žlutá výplň), špatná se ztlumí. Bez skóre, bez srovnávání.
- **Druhá šance:** špatná odpověď Glitch **neuzavírá**. Zapíše se do `tg_retry`
  a doporučovač kartu za chvíli zařadí znovu (o kus dál), ať si to dítě může
  zkusit ještě jednou. Správná odpověď = hotovo (`tg_progress`).

### Typy rychlé výzvy *(všechny sdílejí pevnou kostru výše)*

Liší se jen blokem zadání a rozvržením odpovědí. Pokrývají všechny čtyři návrhy
z Figmy (Quick Challenge 1–4):

| typ | nadpis | prostřední prvek | odpovědi | Figma |
| ----- | ----- | ----- | ----- | ----- |
| **výpočet** (mřížka) | `h1`, krátký příklad („310 × 15 = ?") | — | 4× krátká, mřížka **2×2** (108×47), text na střed `h4` | QC1 `23:161` |
| **slovní úloha** (sloupec) | `h3`, delší zadání | — | 3× krátká, **svislý sloupec** (125×47), text na střed `h4` | QC2 `26:188` |
| **obrazec** (řada) | `h3`, krátká otázka | SVG/obrázek/kód (150×150) | 3× krátká, **vodorovná řada** (55×47), text na střed `h4` | QC3 `27:218` |
| **textové odpovědi** (věty) | `h3`, nadpis + scénář + otázka | — | 4× dlouhá, **svislý sloupec přes celou šířku**, proměnná výška, text **vlevo** `p` | QC4 `193:1769` |

**Volba rozvržení odpovědí je automatická podle obsahu:** obsahuje-li kterákoli
odpověď dlouhou větu (>20 znaků), použije se sloupec textových tlačítek přes
celou šířku; jinak kompaktní tlačítka na střed (mřížka/řada/sloupec dle `cols` a
`figure`). Tlačítka jsou vždy ukotvená u spodního okraje karty.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 (Fasety) |
| **obtížnost** | `1` — lehká *(volí se u konkrétní výzvy; příklad 310×15)* |
| **kognitivní náročnost** | aplikovat *(revidovaná Bloomova taxonomie)* |
| **energetická náročnost** | nízká |
| **typ zátěže** | rozcvička |
| **vhodné při náladě** | kdykoli; vhodné i při nižší energii/soustředění jako lehké „nabuzení" mezi delšími Glitchi |
| signál dokončení | správná odpověď = hotovo; špatná = **druhá šance** (karta se ve feedu vrátí později, nezavírá se) |
| fork | `false` |
| poznámka | Rychlá výzva je rozcvička, ne zkoušení — slouží k rozproudění pozornosti mezi delšími Glitchi. |

---

## 6 Bezpečnost a věková přiměřenost

- **Časovač je opt-in** — časový tlak se nikdy nevytváří sám. Dítě, kterému nevyhovuje, ho nezapne a nic se neděje.
- **Žádné srovnávání** — výsledek je jen osobní zpětná vazba, nikam se nepropisuje jako veřejný signál.
- Špatná odpověď nedostává žádný negativní feedback nad rámec věcného „tohle nebylo ono" — cílem je rozcvička, ne stres.
