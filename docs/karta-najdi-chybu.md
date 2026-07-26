# Karta — Najdi chybu

_Šablona sekcí Glitche typu **Najdi chybu** na příkladu „Doporučovací systém ti ukazuje videa náhodně". Návrh k připomínkám. Vytvořeno: 2026-07-23._

**Jak číst tenhle soubor.** Najdi chybu je **rozklikávací Glitch pro kritické myšlení a prebunking**. Dítě upoutá výrazné, **záměrně nepravdivé** tvrzení; po rozkliku v multichoice kvízu označí, co je chyba, dostane vyhodnocení, vysvětlení a může si o tom popovídat s botem. Klíčové je, aby nepravda byla **lákavá, ale rozpoznatelná**, a aby vysvětlení nabídlo pravdivou verzi.

**Interakce:** Rozklik ✅ · Chatbot ✅ · Fork ✅
**Datový soubor:** [`../glitches/najdi-chybu/`](../glitches/najdi-chybu)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `doporucovani-videa-nahodne` |
| název | Ukazuje ti to videa náhodně? |
| typ | `najdi-chybu` |
| téma | Doporučovací systémy |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-23 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

*Provázání na [mapu konceptů](../knowledge-map/). Z konceptu se dědí RVP, digitální kompetence, oblast i téma.*

| pole | hodnota |
| ----- | ----- |
| koncept | `umela-inteligence-doporucovaci-systemy` |
| oblast (RVP okruh) | Data, informace a modelování (`INF-INF-001`) |
| téma | Umělá inteligence |
| vrstva | navazující |
| RVP výstup | dle konceptu (kód `INF-INF-001-ZV9-…`; doslovné znění v mapě) |
| digitální kompetence | ano — kritické porozumění tomu, jak systémy vybírají obsah (mediální gramotnost) |

---

## 0.2 Fasety

*Fasety tohoto podání (pro doporučování; hodnoty se volí u konkrétního Glitche).*

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | sociální sítě / doporučování |
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

Žák pozná, že doporučovací systém **nevybírá náhodně**, ale podle nasbíraných dat o chování (co sleduješ, jak dlouho, co přeskakuješ), a umí označit konkrétní nepravdy v běžném zjednodušení.

### 1.2 Tvrzení s chybami (co má dítě odhalit)

Karta ukáže tvrzení složené z několika částí; některé jsou **chyba**, některé pravda:

1. „Videa ti appka ukazuje **náhodně**." — **chyba** (vybírá podle dat).
2. „Nezáleží na tom, jak dlouho se díváš." — **chyba** (čas sledování je silný signál).
3. „Appka si pamatuje, co jsi přeskočil." — pravda.
4. „Doporučení je pro každého úplně stejné." — **chyba** (personalizované).

### 1.3 Pravdivá verze (do vysvětlení)

Doporučovací systém sbírá signály (co pustíš, dokoukáš, přeskočíš, lajkuješ) a z nich odhaduje, co tě udrží u obrazovky. Není to náhoda ani kouzlo — je to statistika nad tvým chováním. Proto vidí každý něco jiného.

### 1.4 Zakázaná tvrzení

- ❌ „Algoritmus tě špehuje / je zlý." — vede k paranoie; cíl je porozumění, ne strach.
- ❌ „Appka čte tvoje myšlenky." — ne, pracuje jen s tím, co uděláš.
- ❌ Vydávat konkrétní firemní tajemství za fakt — držet se obecného principu.

---

## 2 Obsah — podání

### 2.1 Karta ve feedu *(viditelné)*

- **Štítek:** `Najdi chybu`.
- **Obrázek:** upoutávka (např. mřížka náhodných videí s otazníkem).
- **Chybné tvrzení (tučně):** „Videa ti appka ukazuje náhodně — pro všechny stejně."
- **Kontext (menší text):** „Fakt? Rozklikni a najdi, co na tom nesedí."

### 2.2 Rozklik — multichoice kvíz

Seznam čtyř tvrzení z 1.2; dítě zaklikne ta, která považuje za chybu (více možností).

### 2.3 Vyhodnocení

Ukáže, co bylo správně/špatně označeno — bez skóre a srovnávání, věcně.

### 2.4 Vysvětlení

Pravdivá verze z 1.3 + proč je omyl lákavý („náhoda" zní jednoduše, ale realita je personalizace podle dat).

---

## 3 Fork *(volitelný artefakt)*

Dítě si může Najdi chybu forknout a rozvést — např. najít vlastní „skoro pravdivé" tvrzení o appkách a označit v něm chybu (stává se z toho tvůrce prebunking obsahu). Hodnotí se pravdivost a jasnost, ne počet.

---

## 4 Kontext pro chatbota *(skryté)*

### 4.1 Fakta a pozadí

- Doporučování = odhad relevance z chování uživatele (implicitní signály: čas sledování, dokončení, přeskočení; explicitní: lajk, odběr).
- Personalizace: každý uživatel má jiný profil → jiný feed.
- Není to náhoda ani „čtení myšlenek"; je to statistika a strojové učení nad daty o chování.

### 4.2 Hranice tématu

- Bot se drží principu doporučování a rozdílu náhoda × personalizace.
- Když dítě zabředne do „jak přesně to dělá YouTube/TikTok" → obecný princip a odkaz na Quest.
- Mimo téma → vlídně vrátit.

### 4.3 Co bot nesmí

- Strašit („špehují tě"), přisuzovat systému úmysl nebo vědomí.
- Prozrazovat řešení kvízu, dokud dítě neoznačí; jen navádět.
- Srovnávat s ostatními, vytvářet časový tlak.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 (Fasety) |
| **obtížnost** | `2` — střední *(tento příklad; volí se u konkrétního Glitche)* |
| **kognitivní náročnost** | analyzovat *(revidovaná Bloomova taxonomie — rozliš pravdu od chyby)* |
| **energetická náročnost** | střední |
| **typ zátěže** | soustředění (kritické čtení) |
| **vhodné při náladě** | spíš vyšší soustředění; při únavě odložit na později |
| signál dokončení | označení v kvízu + přečtení vysvětlení |
| fork | `true` (volitelný) |
| vazby | koncept z mapy: `umela-inteligence-doporucovaci-systemy` |

---

## 6 Bezpečnost a věková přiměřenost

- **Prebunking, ne strašení** — cílem je porozumění a klid, ne technofobie.
- Nepravdivé tvrzení je vždy jasně **označené a vyvrácené** — dítě neodchází s omylem.
- Žádný časovač, žádné srovnávání.
