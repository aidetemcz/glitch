# Karta — Argumentuj

_Šablona sekcí Glitche typu **Argumentuj** na příkladu „Nemám co skrývat…". Návrh k připomínkám. Vytvořeno: 2026-07-23. Plné schéma a vztah k Tiny: [`../glitches/argument/README.md`](../glitches/argument/README.md)._

**Jak číst tenhle soubor.** Argumentuj je **rozklikávací Glitch pro argumentaci a hodnotové uvažování** (portace osvědčeného chatbota z tiny.school). Dítě dostane názorové tvrzení, zaujme postoj (Souhlasím / Nesouhlasím) a bot ho krátkými otázkami vede, aby postoj promyslelo, podepřelo a obhájilo — a zvážilo druhou stranu. **Nemá fork** — výstupem je samotná konverzace.

**Řídící princip:** Argumentuj **neučí „správný názor" — učí dobře argumentovat.** Bot je neutrální průvodce, ne oponent s agendou. Kvalita se posuzuje na kvalitě argumentace, ne na tom, jestli má dítě „pravdu".

**Interakce:** Rozklik ✅ · Chatbot ✅ · Fork ❌
**Datový soubor:** [`../glitches/argument/`](../glitches/argument)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `soukromi-nemam-co-skryvat` |
| název | Nemám co skrývat |
| typ | `argument` |
| téma | Soukromí a hodnota osobních dat |
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
| koncept | `digitalni-obcanstvi-digitalni-stopa-a-soukromi` |
| oblast (RVP okruh) | Digitální technologie (`INF-INF-004`) |
| téma | Digitální občanství |
| vrstva | navazující |
| RVP výstup | dle konceptu (kód `INF-INF-004-ZV9-…`; doslovné znění v mapě) |
| digitální kompetence | ano — bezpečné a uvážlivé chování v digitálním světě, hodnota osobních dat |

---

## 0.2 Fasety

*Fasety tohoto podání (pro doporučování; hodnoty se volí u konkrétního Glitche).*

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | běžné aplikace / soukromí |
| hloubka | standard |
| vizualita | text-first |
| formalismus | žádný |
| délka | standard |
| žánr | vedená argumentace (chat) |
| jazyk | čeština |
| nosiče | text (dialog) |

---

## 1 Kontrakt *(vlastní redakce, skryté)*

### 1.1 Výukový cíl (dvojí)

- **(a) dovednostní:** dítě formuluje jasný postoj, podepře ho důvodem a konkrétním příkladem a zváží aspoň jeden protiargument.
- **(b) tematický:** promýšlí, co je soukromí a jakou hodnotu mají osobní data.

### 1.2 Klíčové argumenty PRO i PROTI

*Obě strany zpracované férově (steelman, ne slaměný panák). Bot je zná a nabízí jako protiváhu, ať dítě zvolí cokoli.*

- Soukromí = **kontrola**, ne tajení (můžu nemít co skrývat a přesto chtít rozhodovat, kdo co ví).
- Data ≠ jen fakta, ale **moc a peníze** — dají se použít k ovlivnění a manipulaci.
- Pohodlí a **personalizace** mají reálnou cenu (lepší doporučení, služby zdarma).
- **Souhlas a možnost volby** — fér je, když se můžu rozhodnout.

### 1.3 Co má dítě na konci umět

Mít **jasný postoj + aspoň jeden vlastní důvod + reakci na jeden protiargument** (postoj nemusí změnit, stačí ho vzít vážně).

### 1.4 Zakázané

Bot ani karta nesmí: protlačovat jediný „správný" názor; zesměšňovat postoj dítěte; manipulovat emocemi; vydávat hodnotový soud za fakt (a naopak). Kde **existuje faktická opora**, bot fakta nezamlčuje, ale odděluje „co je doloženo" od „co je hodnocení".

---

## 2 Karta ve feedu *(viditelné)*

- **Štítek:** `Argumentuj` (žlutý). *(Vizuál: světle růžové pozadí.)*
- **Tvrzení (tučně, výrazné):** „Nemám co skrývat, tak je mi jedno, kolik dat o mně aplikace sbírají."
- **Tlačítka:** `Souhlasím` · `Nesouhlasím` — postoj je vstupní brána, bez volby se nescrolluje dál jako u pasivní karty.

---

## 3 Vedení konverzace + kritéria kvality

### 3.1 Fáze vedení

**postoj → důvod → důkaz/příklad → protiargument → shrnutí.** Bot drží krátké tahy, jednu otázku naráz, navazuje na to, co dítě řeklo.

- *Souhlasím:* „Co všechno by o tobě appka poznala jen z toho, co si pouštíš a kdy?" → „Vadilo by ti, kdyby to viděl někdo cizí?" → protiargument: „Někdo říká, že jde o moc, ne o skrývání — data se dají použít, aby tě někdo přesvědčil nebo zmanipuloval. Co ty na to?"
- *Nesouhlasím:* „Řekni jeden konkrétní důvod, proč ti na tom záleží." → „Kdy je naopak sdílení dat fér a užitečné?" → protiargument: „A co lidi, co říkají ‚mně je to jedno, nic neskrývám'? Co bys jim odpověděl?"

### 3.2 Formativní kritéria *(posuzuje LLM zkoušející, ne skóre)*

Dítě: *zaujalo jasný postoj* · *dalo aspoň jeden vlastní důvod* (ne „protože jo") · *uvedlo konkrétní příklad* · *zareagovalo na protiargument* · *na konci postoj srozumitelně shrnulo*.

---

## 4 Kontext pro chatbota *(skryté)*

- **4.1 Fakta a pozadí:** co je doloženo o sběru dat a personalizaci (a co je jen hodnocení). Soukromí jako kontrola nad informacemi o sobě.
- **4.2 Hranice tématu:** bot se drží tématu tvrzení; mimo téma vlídně vrací.
- **4.3 Scaffolding:** když dítě „nevím / protože jo" → nabídnout dvě konkrétní situace na výběr, otočit otázku, požádat o příklad ze života. **Nikdy nedodat argument za dítě dřív, než se samo pokusí.**
- **4.4 Co bot nesmí:** vnucovat názor; chválit „správnou" stranu; srovnávat s ostatními; ukládat emoční data jako signál; tlačit na „správný" závěr.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 (Fasety) |
| **obtížnost** | `3` — těžká *(tento příklad; volí se u konkrétního Glitche)* |
| **kognitivní náročnost** | hodnotit *(revidovaná Bloomova taxonomie — obhajoba a zvažování postoje)* |
| **energetická náročnost** | vysoká (aktivní obhajoba postoje) |
| **typ zátěže** | soustředění + kreativita (formulace argumentů) |
| **vhodné při náladě** | vyšší energie i soustředění; unavenému/roztěkanému neservírovat — odložit na „nabitý" stav |
| signál dokončení | absolvovaná argumentační smyčka (postoj → důvod → reakce na protiargument) |
| fork | `false` |
| vazby | koncept z mapy: `digitalni-obcanstvi-digitalni-stopa-a-soukromi` |

---

## 6 Bezpečnost, soukromí a co se posílá do Tiny

- **Citlivá témata:** názory nezletilých na hodnotová témata jsou citlivé. Bot zůstává neutrální, nediagnostikuje osobnost, nezaznamenává „jaký má dítě názor" jako hodnocení.
- **Do profilu / do Tiny jde důkaz o učení, ne názor dítěte:** signály o kvalitě argumentace (dal důvod ✓, uvedl příklad ✓, zvážil protiargument ✓, shrnul ✓) a dokončení. **Ne** samotný postoj na citlivé téma jako trvalý štítek.
- **Emoční data** z konverzace jsou efemérní (relace), nikam se nepropisují.
- Žádný časovač, žádné srovnávání, žádné veřejné sdílení postoje.
