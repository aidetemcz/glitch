# Basic Glitch — Pseudokód a vývojové diagramy (Nakresli postup)

_Basic Glitch pro kapitolu Algoritmus, quest „Od návodu k emergenci". Vytvořeno: 2026-07-24._

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-pseudokod-a-diagramy` |
| název | Nakresli postup |
| kapitola | Algoritmus |
| quest | Od návodu k emergenci |
| pořadí v questu | 2 (navazuje na „Co je algoritmus") |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

| pole | hodnota |
| ----- | ----- |
| koncept | `informaticke-mysleni-pseudokod-a-vyvojove-diagramy` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Informatické myšlení a algoritmizace |
| vrstva | navazující |
| RVP výstup | `INF-INF-002-ZV9-005` — *po přečtení jednotlivých kroků algoritmu vysvětlí celý postup a určí problém, který je daným algoritmem řešen* |
| digitální kompetence | — *(koncept nemá přiřazenou KDI)* |
| prerekvizity (z mapy) | `informaticke-mysleni-algoritmus` |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | běžný život (ranní odchod, automat) |
| hloubka | intro |
| vizualita | visual-first *(vývojový diagram se šipkami)* |
| formalismus | lehký (pseudokód, diagram) |
| délka | standard |
| žánr | čtení schématu + výklad |
| jazyk | čeština |
| nosiče | diagram/SVG, text |

---

## 1 Kontrakt

### 1.1 Výukový cíl

Žák umí **přečíst a zapsat postup srozumitelně pro člověka** ještě předtím, než ho napíše v konkrétním jazyce — pseudokódem („kód napůl česky") a vývojovým diagramem (schéma se šipkami). Pozná v diagramu **rozhodnutí** (kosočtverec) a **návrat/opakování** (šipka zpět) jako náhled na to, co přijde dál.

### 1.2 Povinné body

Každé podání tohoto Glitche musí pokrýt:

1. Než něco naprogramuješ, vyplatí se postup **zapsat srozumitelně** — aby mu rozuměl člověk.
2. **Pseudokód** = postup napsaný jednoduchými větami/řádky, „napůl česky", bez pravidel konkrétního jazyka.
3. **Vývojový diagram** = tentýž postup nakreslený jako schéma: kroky v rámečcích, spojené **šipkami**, které ukazují pořadí.
4. V diagramu má **rozhodnutí** tvar kosočtverce se dvěma cestami (ano / ne).
5. **Šipka, která se vrací zpět**, znamená, že se něco **opakuje**.
6. Pseudokód i diagram popisují **tentýž** algoritmus — jsou to dva způsoby zápisu, ne dva různé postupy. *(Most: rozhodnutí = podmínka, úloha 3; návrat = cyklus, úloha 4.)*

### 1.3 Kanonická otázka (s odpovědí)

**Otázka:** Ve vývojovém diagramu je kosočtverec s otázkou „Prší?" a z něj vedou dvě šipky — „ano" a „ne". Co ten kosočtverec v postupu znamená? **Jádro správné odpovědi:** Je to **rozhodnutí (podmínka)**: postup se v tom místě rozdělí a pokračuje jinou cestou podle toho, jestli odpověď je ano, nebo ne (např. „ano → vezmi deštník", „ne → jdi bez deštníku"). Diagram tím ukazuje větvení postupu.

### 1.4 Zakázaná tvrzení a časté miskoncepce

* ❌ „Pseudokód musí být v nějakém programovacím jazyce." — Ne, je to schválně volný zápis pro člověka.
* ❌ „Vývojový diagram a pseudokód jsou dva různé postupy." — Je to jeden algoritmus, dva způsoby zápisu.
* ❌ „Na tvaru značek v diagramu nezáleží." — Rozhodnutí (kosočtverec) a krok (rámeček) se odlišují schválně; tvar nese význam.
* ❌ „Šipky můžou vést jakkoli." — Šipky ukazují pořadí a cesty; kdyby vedly zmateně, diagram nedává smysl.

---

## 2 Obsah — kanonické podání

### 2.1 Karta ve feedu

**Štítek:** Algoritmus **Titulek:** Nakresli postup **Text:** Než něco naprogramuješ, můžeš postup nejdřív nakreslit — jako mapku se šipkami, kterou pochopí každý. Zvládneš přečíst, kudy se postup vydá, když prší? **Interakce:** malý vývojový diagram (SVG) postupu „ráno před školou"; dítě si ho nejdřív jen prohlíží a sleduje šipky.

### 2.2 Rozklik — vrstva 1: pozorování

Projdi diagram prstem podle šipek od začátku (⬤ Start) k konci. Kudy tě vede, když je odpověď na otázku „Prší?" **ano**? A kudy, když **ne**? Zkus nahlas říct celou cestu jedním dechem. Zatím nic nezapisuj — jen sleduj, kam šipky vedou.

### 2.3 Rozklik — vrstva 2: odhalení

Tomuhle schématu se říká **vývojový diagram**. Kroky jsou v rámečcích, spojené **šipkami**, které ukazují pořadí. Kde se má postup **rozhodnout**, je **kosočtverec** s otázkou a dvěma cestami (ano / ne) — třeba „Prší? → ano: vezmi deštník / ne: jdi bez". Tentýž postup se dá napsat i **pseudokódem** — „kódem napůl česky":

```
Start
vstaň, obleč se
KDYŽ prší:
    vezmi deštník
jdi do školy
```

Pseudokód a diagram říkají **totéž**, jen jinak. A všimni si dvou věcí, které tě čekají dál v questu: **kosočtverec = rozhodnutí (podmínka)**, na kterou se podíváme v úloze 3, a kdyby některá **šipka vedla zpět nahoru**, znamenala by **opakování (cyklus)** — to je úloha 4.

### 2.4 Kvíz (rychlá kontrola porozumění)

1. K čemu je pseudokód? *(a) je to jazyk, kterým mluví počítač, (b) srozumitelný zápis postupu pro člověka ✓, (c) tajné písmo)*
2. Co znamená kosočtverec ve vývojovém diagramu? *(a) konec, (b) rozhodnutí se dvěma cestami ✓, (c) chybu)*
3. Pseudokód a vývojový diagram téhož postupu popisují… *(a) dva různé algoritmy, (b) tentýž algoritmus dvěma způsoby ✓, (c) to nejde srovnat)*

---

## 3 Úrovně vypracování a kritéria hodnocení

### 🟢 Jednoduchá

**Zadání:** Projdi diagram a rozklik, vyplň kvíz a vlastními slovy (3–5 vět) popiš, co diagram „ráno před školou" dělá — včetně toho, co se stane, když prší a když neprší. **Kritéria splnění:**

* Popis sleduje šipky ve správném pořadí od startu.
* Zmiňuje rozhodnutí (kosočtverec) a obě jeho cesty.
* Žák pojmenuje, že jde o zápis postupu (algoritmu), ne o hotový program. **Typický neúspěch a co s ním:** žák přečte jen jednu větev. Zkoušející se doptá: *„A co když prší — kudy tě diagram pošle pak?"*

### 🟡 Střední

**Zadání:** Vyber si jednoduchou činnost (přejít silnici na semaforu, ustlat postel, přihlásit se do appky) a zapiš ji **dvěma způsoby**: krátkým **pseudokódem** a malým **vývojovým diagramem** (klidně nakresleným na papír a vyfoceným). V obou musí být aspoň jedno **rozhodnutí**. Napiš, čím se oba zápisy liší a čím jsou stejné. **Kritéria splnění:**

* Oba zápisy popisují **tentýž** postup (dají se přiložit vedle sebe).
* Diagram používá správně kosočtverec pro rozhodnutí a šipky pro pořadí.
* Žák vystihne, že jde o dva zápisy jednoho algoritmu. **Poznámka pro zkoušejícího:** nekreslí se dokonalost značek, ale to, že tvar nese význam (krok vs. rozhodnutí).

### 🔴 Master

**Zadání (dvě varianty, žák volí):** **A — postup s návratem:** Zapiš (pseudokódem i diagramem) postup, ve kterém se něco **opakuje** — a šipka se proto vrací zpět (např. „dokud je na zemi hračka, ukliď jednu"). Popiš, kde přesně se postup zacyklí a kdy skončí. **B — přelož diagram do pseudokódu:** Vezmi cizí (složitější) vývojový diagram a přepiš ho do pseudokódu tak věrně, aby druhý žák poznal, že jde o tentýž postup. **Kritéria splnění:**

* Existuje forknutelný artefakt (diagram + pseudokód) — jiný žák na něm může stavět.
* U varianty A je jasně vidět **opakování** (návratová šipka) a **podmínka ukončení**.
* Žák správně ukáže, že diagram a pseudokód popisují **tentýž** postup. **Poznámka:** tahle úloha je přímý odrazový můstek do úloh 3 (podmínky) a 4 (cykly).

---

## 4 Kontext pro chatbota

### 4.1 Fakta a pozadí

* Pseudokód = postup zapsaný volně, srozumitelně pro člověka; nedrží se pravidel žádného konkrétního jazyka.
* Vývojový diagram = grafický zápis: **rámeček** = krok/akce, **kosočtverec** = rozhodnutí (2 cesty), **šipky** = pořadí a cesty, obvykle **ovál** = start/konec.
* Diagram i pseudokód jsou dvě reprezentace **téhož** algoritmu.
* Rozhodovací kosočtverec je vizuální podoba **podmínky** (úloha 3); návratová šipka je vizuální podoba **cyklu** (úloha 4).
* Dobrý zápis pomáhá **odhalit chybu v postupu dřív**, než se něco „naostro" naprogramuje.

### 4.2 Hranice tématu

* Bot zůstává u zápisu postupu (pseudokód, diagram, značky, šipky) a čtení cesty.
* Když dítě chce hlouběji k rozhodování nebo opakování → naznačit a odkázat: „na podmínky je úloha 3, na cykly úloha 4."
* Mimo téma → vlídně vrátit.

### 4.3 Scaffolding — typické zádrhely a jak napovídat

**Zádrhel: dítě čte jen jednu větev rozhodnutí.**

1. „Našel jsi cestu pro ‚ano'. A kudy vede ta druhá šipka?"
2. „Co udělá postup, když je odpověď ‚ne'? Ukaž prstem."
3. Projít obě cesty společně, každou jednou.

**Zádrhel: dítě míchá tvary značek (krok vs. rozhodnutí).**

1. „V kterém tvaru je otázka, na kterou se odpovídá ano/ne?"
2. „Kolik šipek vede z rámečku a kolik z kosočtverce? Proč asi?"
3. Shrnout: kosočtverec = rozhodnutí (2 cesty), rámeček = jeden krok (1 cesta dál).

**Zádrhel: dítě si myslí, že pseudokód a diagram jsou různé postupy.**

1. „Zkus přečíst pseudokód a projet diagram — dělají to samé?"
2. Nechat přiřadit řádek pseudokódu ke značce v diagramu.
3. Shrnout: jeden algoritmus, dva zápisy.

**Zádrhel: „proč to kreslit, když to můžu rovnou napsat?"**

1. „Když ti v postupu něco nesedí, kde se to hledá líp — v hotovém kódu, nebo v jednoduchém obrázku?"
2. Most: proto se postup často nejdřív nakreslí a teprve pak programuje.

### 4.4 Co bot nesmí

* Neprozrazovat řešení kvízu ani hotové diagramy/pseudokódy střední a master úrovně; jen navádět (max. stupeň 3 po dvou pokusech dítěte).
* Nehodnotit srovnáním s ostatními.
* Nepoužívat zakázaná tvrzení z 1.4 ani je nepotvrzovat.
* Při frustraci nabídnout jednodušší krok, ne tlačit na dokončení.
* Časový tlak nikdy nevytvářet; tenhle Glitch žádný časovač nemá.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety kanonického podání | viz sekce 0.2 |
| **obtížnost** | `2` — střední |
| **kognitivní náročnost** | porozumět *(na master úrovni „aplikovat"/„tvořit")* |
| **energetická náročnost** | střední |
| **typ zátěže** | čtení schématu + výklad |
| **vhodné při náladě** | spíš vyšší soustředění; při únavě servírovat kratší znalostní Glitch |
| prerekvizity | `informaticke-mysleni-algoritmus` (úloha 1 questu) |
| navazuje | úloha 3 questu (Podmínky: když–tak) |
| signál dokončení | jednoduchá: kvíz + popis · střední: pseudokód + diagram téhož postupu · master: forknutelný artefakt (vč. opakování) |
| poctivá absence | pokud žák žádá neexistující podání (jiný svět příkladu), loguje se jako poptávka; nesubstituovat tiše |

---

## 6 Bezpečnost a věková přiměřenost

* Téma je nekonfliktní; bot drží vlídný, věcný tón.
* Žádný časový limit, žádné srovnávání mezi žáky, úroveň vypracování není veřejný odznak.
* Emoční data z konverzace se nikam nepropisují.
