# Rychlá výzva — Který prompt povede k lepší appce?

_Glitch typu **Rychlá výzva** pro kapitolu Vibe Coding. Vytvořeno: 2026-07-24._

**Interakce:** Rozklik ❌ · Chatbot ❌ · Fork ❌
**Datový soubor:** [`../glitches/rychla-vyzva/`](../glitches/rychla-vyzva)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `vibecoding-nejlepsi-prompt` |
| název | Který prompt povede k lepší appce? |
| typ | `rychla-vyzva` |
| předmět | Informatika |
| varianta | `pojem` *(volba nejlepšího zadání)* |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

| pole | hodnota |
| ----- | ----- |
| koncept | `tvorba-aplikaci-vibecoding` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Tvorba aplikací a vibecoding |
| vrstva | core |
| RVP výstup | — *(bez OVÚ)* |
| digitální kompetence | Digitální vývoj a inovace (`kdi-vin`) |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | tvorba appek / AI nástroje |
| hloubka | intro |
| vizualita | text-first |
| formalismus | žádný |
| délka | tl;dr |
| žánr | kvíz |
| jazyk | čeština |
| nosiče | text |

---

## 1 Zadání a řešení *(redakční, skryté)*

- **Co procvičuje:** promptovou gramotnost v praxi tvorby — dobrý prompt má **cíl, kontext a požadovaný formát**, ne jen „udělej appku".
- **Správná odpověď:** konkrétní prompt s cílem (appka na kapesné), kontextem (zadám příjmy a výdaje) a formátem (zůstatek + graf, jednoduchý vzhled, čeština).
- **Proč špatné možnosti lákají:**
  - „Udělej appku." — zní jednoduše, ale AI nemá z čeho vyjít; výsledek bude náhodný.
  - „Něco s penězi, ať je to hezký." — vágní, chybí cíl i formát.
  - „Naprogramuj to nejlíp, jak umíš." — přehazuje rozhodování na AI; „nejlíp" nikdo nedefinoval.

---

## 2 Karta ve feedu *(viditelné)*

- **Štítek:** `Rychlá výzva` (žlutý).
- **Velké zadání** (styl `glitch_H1`): `Chceš appku na kapesné. Který prompt zafunguje nejlíp?`
- **Odpovědi:** tlačítka, právě **jedna správná**. Rozvržení `1xN`:
  1. „Udělej appku."
  2. **„Udělej appku na kapesné: zadám příjmy a výdaje, ukáž mi zůstatek a graf za měsíc. Jednoduchý vzhled, česky."** ✅
  3. „Něco s penězi, ať je to hezký."
  4. „Naprogramuj to nejlíp, jak umíš."
- **Časovač:** opt-in.
- **Zpětná vazba:** okamžitá; správná se zvýrazní. Bez skóre, bez srovnávání.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 |
| **obtížnost** | `2` — střední |
| **kognitivní náročnost** | hodnotit *(posoudit, který prompt je lepší)* |
| **energetická náročnost** | nízká |
| **typ zátěže** | rozcvička |
| **vhodné při náladě** | kdykoli |
| signál dokončení | zodpovězení |
| fork | `false` |
| vazby | koncept z mapy: `tvorba-aplikaci-vibecoding` |
| poznámka | Procvičuje princip „cíl + kontext + formát" u promptu pro tvorbu. |

---

## 6 Bezpečnost a věková přiměřenost

- **Časovač je opt-in.**
- **Žádné srovnávání.**
- Špatná odpověď bez negativního feedbacku nad rámec věcného „tohle nebylo ono".
