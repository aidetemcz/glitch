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
| varianta | `vypocet` *(vypocet · slovni-uloha · obrazec)* |
| verze | 1.0 |
| stav důvěry | `core` |
| jazyk | cs |

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

- **Štítek:** `Rychlá výzva` (žlutý).
- **Velké zadání** (styl `glitch_H1`): `310×15=`
- **Podotázka** (volitelná): „Zvládneš spočítat do časového limitu?"
- **Odpovědi:** tlačítka, právě **jedna správná**. Rozvržení:
  - `2x2` — čtyři možnosti (jako v příkladu),
  - `1xN` — svislý sloupec,
  - `row` — vodorovná řada (např. u obrazců).
- **Časovač:** vždy **opt-in** — nikdy se nespustí automaticky. Dítě si ho zapne kliknutím na kolečko.
- **Zpětná vazba:** okamžitá — správná odpověď se zvýrazní (žlutá výplň), špatná se ztlumí. Bez skóre, bez srovnávání.

### Varianty zadání

| varianta | co obsahuje | příklad |
| ----- | ----- | ----- |
| `vypocet` | číselný příklad | „310×15=" |
| `slovni-uloha` | krátký text s otázkou | „V appce je 8 řad po 15 videích. Kolik videí je vidět?" |
| `obrazec` | SVG obrázek + otázka | „Který obrazec je na řadě?" (doplň vzor) |

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | předmět: matematika · varianta: vypocet · délka: mikro |
| signál dokončení | zodpovězení (správně/špatně obojí je dokončení — nejde o skóre) |
| fork | `false` |
| poznámka | Rychlá výzva je rozcvička, ne zkoušení — slouží k rozproudění pozornosti mezi delšími Glitchi. |

---

## 6 Bezpečnost a věková přiměřenost

- **Časovač je opt-in** — časový tlak se nikdy nevytváří sám. Dítě, kterému nevyhovuje, ho nezapne a nic se neděje.
- **Žádné srovnávání** — výsledek je jen osobní zpětná vazba, nikam se nepropisuje jako veřejný signál.
- Špatná odpověď nedostává žádný negativní feedback nad rámec věcného „tohle nebylo ono" — cílem je rozcvička, ne stres.
