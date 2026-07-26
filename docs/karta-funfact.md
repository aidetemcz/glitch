# Karta — Fun fact

_Šablona sekcí Glitche typu **Fun fact** na příkladu „První počítačový bug byla opravdová můra". Návrh k připomínkám. Vytvořeno: 2026-07-23._

**Jak číst tenhle soubor.** Fun fact je **rozklikávací zajímavost bez úkolu** — slouží ke zpestření feedu. Dítě nic neplní: přečte si jádro faktu, může rozkliknout hlubší kontext a popovídat si o tom s chatbotem. Proto tady odpadají úrovně vypracování a kvíz; klíčové je, aby fakt byl **pravdivý, poutavý a věku přiměřený**, a aby bot uměl navázat.

**Interakce:** Rozklik ✅ · Chatbot ✅ · Fork ✅
**Datový soubor:** [`../glitches/funfact/`](../glitches/funfact)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `bug-mura-harvard-mark-ii` |
| název | První „bug" byla opravdová můra |
| typ | `funfact` |
| téma | Historie počítačů |
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
| koncept | `programovani-ladeni-a-testovani` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Programování |
| vrstva | navazující |
| RVP výstup | dle konceptu (kód `INF-INF-002-ZV9-…`; doslovné znění v mapě) |
| digitální kompetence | ano — porozumění tomu, že chyby v programu jsou běžné a hledají se (ladění) |

---

## 0.2 Fasety

*Fasety tohoto podání (pro doporučování; hodnoty se volí u konkrétního Glitche).*

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | historie počítačů |
| hloubka | intro |
| vizualita | vyvážená (ilustrace + text) |
| formalismus | žádný |
| délka | krátká |
| žánr | zajímavost / výklad |
| jazyk | čeština |
| nosiče | obrázek, text |

---

## 1 Kontrakt *(vlastní redakce, skryté)*

### 1.1 Jádro faktu (co musí zůstat pravda)

V roce 1947 našli technici u počítače Harvard Mark II můru, která uvízla v relé a způsobila poruchu. Zalepili ji do provozního deníku s popiskem „first actual case of bug being found". Slovo *bug* pro chybu se používalo i předtím (např. Edison), ale tahle příhoda ho spojila s počítači a rozšířila výraz **debugging** = hledání chyb.

### 1.2 Zakázaná tvrzení a časté miskoncepce

- ❌ „Slovo *bug* vzniklo tou můrou." — Ne, výraz existoval dřív; můra ho jen proslavila v kontextu počítačů.
- ❌ „Byla to první chyba v historii počítačů." — Ne, byla to první **doslovná** můra zapsaná jako bug, ne první porucha.
- ❌ Připisovat objev výhradně Grace Hopper jako osobní zásluhu — byla u týmu kolem Mark II, ale zápis udělal někdo z techniků; uvádět opatrně.

---

## 2 Obsah — podání

### 2.1 Karta ve feedu *(viditelné)*

- **Štítek:** `Fun fact` (na kontrastní dlaždici — např. růžové).
- **Ilustrace:** stylizovaná můra / stránka deníku.
- **Jádro faktu (titulek, tučně):** „První počítačový *bug* byla opravdová můra."
- **Krátké rozvedení:** „Když dnes řekneme, že program má *bug*, mluvíme o chybě. Před 78 lety to jednou byla úplně doslova — noční motýl v počítači."

### 2.2 Rozklik — vysvětlení konceptu

Delší kontext (2–3 odstavce): rok 1947, Harvard Mark II, relé velká jako u telefonní ústředny, můra uvízlá mezi kontakty, zalepený deník, jak se z toho stalo *debugging*. Zakončení mostem: „Chybám v kódu se říká *bugs* dodnes — a hledání chyb je normální součást programování, ne selhání."

---

## 3 Fork *(volitelný artefakt)*

Fun fact **může** mít fork (na rozdíl od Rychlé výzvy): dítě si fakt „vezme" do svého boardu a rozvede ho — např. najde a popíše vlastní zajímavost z historie techniky. Úrovně jsou volnější než u Basic Glitche; hodnotí se, že artefakt existuje a je pravdivý, ne hloubka.

---

## 4 Kontext pro chatbota *(skryté)*

### 4.1 Fakta a pozadí

- Datum: 9. 9. 1947, Harvard Mark II (elektromechanický počítač).
- Deník s můrou je fyzicky zachovaný ve Smithsonian National Museum of American History.
- „Bug" ve smyslu technická závada: doloženo už v 19. století (Edison).
- „Debugging" jako termín se ustálil později; příhoda mu dala populární původ.

### 4.2 Hranice tématu

- Bot se drží historie výrazu *bug*, Mark II a toho, co je chyba v programu.
- Když dítě odbočí k programování obecně → krátce a vrátit: „chyby v kódu jsou normální, tady jsme u té úplně první doslovné."
- Mimo téma → vlídně vrátit.

### 4.3 Co bot nesmí

- Tvrdit zakázané body z 1.2.
- Vydávat populární historku za jediný původ slova.
- Srovnávat dítě s ostatními, vytvářet časový tlak.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | viz sekce 0.2 (Fasety) |
| **obtížnost** | `1` — lehká *(tento příklad; jiný Fun fact může nést i náročný obsah — volí se u konkrétního Glitche)* |
| **kognitivní náročnost** | porozumět *(revidovaná Bloomova taxonomie; u náročnějšího faktu klidně výš)* |
| **energetická náročnost** | nízká |
| **typ zátěže** | odlehčení (čtení pro radost) |
| **vhodné při náladě** | i při únavě/nižším soustředění — lehký oddechový Glitch mezi náročnějšími |
| signál dokončení | rozklik (přečtení) · volitelně konverzace |
| fork | `true` (volitelný) |
| vazby | koncept z mapy: `programovani-ladeni-a-testovani` |

---

## 6 Bezpečnost a věková přiměřenost

- Téma je nekonfliktní; bot drží vlídný, hravý tón.
- Žádný časovač, žádné srovnávání.
- Fakt musí být ověřený — Fun fact nesmí šířit „skoro pravdivé" historky (na to je typ Najdi chybu, kde je nepravda záměrná a označená).
