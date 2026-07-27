# Rychlá výzva — Co udělá tenhle cyklus?

_Glitch typu **Rychlá výzva** pro kapitolu Algoritmus. Vytvořeno: 2026-07-24._

**Interakce:** Rozklik ❌ · Chatbot ❌ · Fork ❌
**Datový soubor:** [`../glitches/rychla-vyzva/`](../glitches/rychla-vyzva)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-co-udela-cyklus` |
| název | Co udělá tenhle cyklus? |
| typ | `rychla-vyzva` |
| předmět | Informatika |
| varianta | `pojem` *(trasování postupu)* |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

| pole | hodnota |
| ----- | ----- |
| koncept | `informaticke-mysleni-rizeni-toku` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Informatické myšlení a algoritmizace |
| vrstva | core |
| RVP výstup | `INF-INF-002-ZV9-007` — *v blokově orientovaném programovacím jazyce vytvoří přehledný program, používá opakování, větvení programu, proměnné* |
| digitální kompetence | — *(koncept nemá přiřazenou KDI)* |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | řídící struktury / opakování |
| hloubka | intro |
| vizualita | text-first *(krátký pseudokód)* |
| formalismus | lehký (pseudokód) |
| délka | tl;dr |
| žánr | kvíz |
| jazyk | čeština |
| nosiče | text |

---

## 1 Zadání a řešení *(redakční, skryté)*

- **Co procvičuje:** čtení **cyklu (opakování)** — sledovat, kolikrát se něco stane.
- **Zadaný postup:**
  ```
  počet = 0
  opakuj 3×:
      počet = počet + 2
  vypiš počet
  ```
- **Správná odpověď:** `6` (0 → 2 → 4 → 6).
- **Proč špatné možnosti lákají:**
  - `2` — dítě započítá jen jedno opakování.
  - `3` — splete si počet opakování s výsledkem.
  - `5` — přičítá 2, ale začne od 1, nebo se splete v mezikroku.

---

## 2 Karta ve feedu *(viditelné)*

- **Štítek:** `Rychlá výzva` (žlutý).
- **Velké zadání** (styl `glitch_H1`):
  ```
  počet = 0
  opakuj 3×:  počet = počet + 2
  vypiš počet
  ```
- **Podotázka:** „Co program vypíše?"
- **Odpovědi:** tlačítka `2x2`, právě **jedna správná**:
  - `2` · `3` · **`6`** ✅ · `5`
- **Časovač:** opt-in.
- **Zpětná vazba:** okamžitá; správná se zvýrazní. Bez skóre, bez srovnávání.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 |
| **obtížnost** | `2` — střední |
| **kognitivní náročnost** | aplikovat *(protrasuj cyklus)* |
| **energetická náročnost** | nízká |
| **typ zátěže** | rozcvička |
| **vhodné při náladě** | kdykoli; lehké „nabuzení" hlavy |
| signál dokončení | zodpovězení |
| fork | `false` |
| vazby | koncept z mapy: `informaticke-mysleni-rizeni-toku` |
| poznámka | Trasování opakování: 0 → 2 → 4 → 6. |

---

## 6 Bezpečnost a věková přiměřenost

- **Časovač je opt-in.**
- **Žádné srovnávání.**
- Špatná odpověď bez negativního feedbacku nad rámec věcného „tohle nebylo ono".
