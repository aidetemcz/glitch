# Rychlá výzva — Který postup je dobrý algoritmus?

_Glitch typu **Rychlá výzva** pro kapitolu Algoritmus. Vytvořeno: 2026-07-24._

**Interakce:** Rozklik ❌ · Chatbot ❌ · Fork ❌
**Datový soubor:** [`../glitches/rychla-vyzva/`](../glitches/rychla-vyzva)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-jednoznacnost` |
| název | Který postup je dobrý algoritmus? |
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
| svět příkladu | běžný život / návody |
| hloubka | intro |
| vizualita | text-first |
| formalismus | žádný |
| délka | tl;dr |
| žánr | kvíz |
| jazyk | čeština |
| nosiče | text |

---

## 1 Zadání a řešení *(redakční, skryté)*

- **Co procvičuje:** **jednoznačnost** — dobrý algoritmus je tak přesný, že podle něj dojde každý ke stejnému výsledku; nesmí obsahovat vágní kroky „jak uznáš za vhodné".
- **Správná odpověď:** postup s přesnými, jednoznačnými kroky (např. přesný návod, jak udělat čaj: dej sáček do hrnku, zalij 250 ml vroucí vody, nech 3 minuty, sáček vyndej).
- **Proč špatné možnosti lákají:**
  - „Uvař čaj nějak dobře." — zní jako návod, ale je vágní; každý ho provede jinak.
  - „Přidej vodu, dokud to nebude tak akorát." — „tak akorát" není jednoznačné.
  - „Zkoušej to, dokud ti to nevyjde." — to není přesný postup, ale náhodné zkoušení.

---

## 2 Karta ve feedu *(viditelné)*

- **Štítek:** `Rychlá výzva` (žlutý).
- **Velké zadání** (styl `glitch_H1`): `Který z postupů je opravdový algoritmus (dojde podle něj každý ke stejnému výsledku)?`
- **Odpovědi:** tlačítka, právě **jedna správná**. Rozvržení `1xN`:
  1. **„Dej sáček do hrnku, zalij 250 ml vroucí vody, počkej 3 minuty, sáček vyndej."** ✅
  2. „Uvař čaj nějak dobře."
  3. „Přidej vodu, dokud to nebude tak akorát."
  4. „Zkoušej to, dokud ti to nevyjde."
- **Časovač:** opt-in.
- **Zpětná vazba:** okamžitá; správná se zvýrazní. Bez skóre, bez srovnávání.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 |
| **obtížnost** | `2` — střední |
| **kognitivní náročnost** | analyzovat *(rozliš jednoznačný postup od vágního)* |
| **energetická náročnost** | nízká |
| **typ zátěže** | rozcvička |
| **vhodné při náladě** | kdykoli |
| signál dokončení | zodpovězení |
| fork | `false` |
| vazby | koncept z mapy: `informaticke-mysleni-algoritmus` |
| poznámka | Klíč je jednoznačnost — žádné „nějak" a „tak akorát". |

---

## 6 Bezpečnost a věková přiměřenost

- **Časovač je opt-in.**
- **Žádné srovnávání.**
- Špatná odpověď bez negativního feedbacku nad rámec věcného „tohle nebylo ono".
