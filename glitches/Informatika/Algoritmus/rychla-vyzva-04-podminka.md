# Rychlá výzva — Kdy se hráči zobrazí „Konec hry"?

_Glitch typu **Rychlá výzva** pro kapitolu Algoritmus. Vytvořeno: 2026-07-24._

**Interakce:** Rozklik ❌ · Chatbot ❌ · Fork ❌
**Datový soubor:** [`../glitches/rychla-vyzva/`](../glitches/rychla-vyzva)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-podminka-konec-hry` |
| název | Kdy se zobrazí „Konec hry"? |
| typ | `rychla-vyzva` |
| předmět | Informatika |
| varianta | `pojem` |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

| pole | hodnota |
| ----- | ----- |
| koncept | `informaticke-mysleni-logika-a-booleovske-vyrazy` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Informatické myšlení a algoritmizace |
| vrstva | navazující |
| RVP výstup | — *(bez OVÚ)* |
| digitální kompetence | — *(koncept nemá přiřazenou KDI)* |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | hry / podmínky |
| hloubka | intro |
| vizualita | text-first *(krátká podmínka)* |
| formalismus | lehký (booleovská podmínka) |
| délka | tl;dr |
| žánr | kvíz |
| jazyk | čeština |
| nosiče | text |

---

## 1 Zadání a řešení *(redakční, skryté)*

- **Co procvičuje:** čtení **booleovské podmínky** se spojkou **A ZÁROVEŇ (AND)**.
- **Zadaná podmínka:** `když (životy = 0) A ZÁROVEŇ (čas > 0): zobraz "Konec hry"`
- **Správná odpověď:** „Když má hráč 0 životů a zároveň ještě zbývá čas."
- **Proč špatné možnosti lákají:**
  - „Když má hráč 0 životů **nebo** došel čas." — záměna AND za OR.
  - „Když hráči došel čas." — čte jen druhou část podmínky.
  - „Vždycky na konci hry." — ignoruje podmínku úplně.

---

## 2 Karta ve feedu *(viditelné)*

- **Štítek:** `Rychlá výzva` (žlutý).
- **Velké zadání** (styl `glitch_H1`): `když (životy = 0) A ZÁROVEŇ (čas > 0): zobraz "Konec hry"`
- **Podotázka:** „Kdy se ‚Konec hry' opravdu zobrazí?"
- **Odpovědi:** tlačítka `1xN`, právě **jedna správná**:
  1. **Když má hráč 0 životů a zároveň ještě zbývá čas.** ✅
  2. Když má hráč 0 životů nebo když došel čas.
  3. Když hráči došel čas.
  4. Vždycky na konci hry.
- **Časovač:** opt-in.
- **Zpětná vazba:** okamžitá; správná se zvýrazní. Bez skóre, bez srovnávání.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 |
| **obtížnost** | `2` — střední |
| **kognitivní náročnost** | analyzovat *(vyhodnoť podmínku s AND)* |
| **energetická náročnost** | nízká |
| **typ zátěže** | rozcvička |
| **vhodné při náladě** | kdykoli |
| signál dokončení | zodpovězení |
| fork | `false` |
| vazby | koncept z mapy: `informaticke-mysleni-logika-a-booleovske-vyrazy` |
| poznámka | AND = obě části musí platit zároveň; pozor na záměnu s OR. |

---

## 6 Bezpečnost a věková přiměřenost

- **Časovač je opt-in.**
- **Žádné srovnávání.**
- Špatná odpověď bez negativního feedbacku nad rámec věcného „tohle nebylo ono".
