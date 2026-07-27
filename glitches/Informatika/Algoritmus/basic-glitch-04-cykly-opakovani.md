# Basic Glitch — Cykly: opakování (Nech to udělat počítač)

_Basic Glitch pro kapitolu Algoritmus, quest „Od návodu k emergenci". Vytvořeno: 2026-07-24._

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-cykly-opakovani` |
| název | Nech to udělat počítač |
| kapitola | Algoritmus |
| quest | Od návodu k emergenci |
| pořadí v questu | 4 (úloha o cyklech — přímo předchází Hře života) |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

| pole | hodnota |
| ----- | ----- |
| koncept | `programovani-cykly-v-kodu` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Programování |
| vrstva | core |
| RVP výstup | `INF-INF-002-ZV9-007` — *v blokově orientovaném programovacím jazyce vytvoří přehledný program, používá opakování, větvení programu, proměnné* |
| digitální kompetence | — *(koncept nemá přiřazenou KDI)* |
| prerekvizity (z mapy) | `programovani-promenne-a-datove-typy`, `informaticke-mysleni-rizeni-toku` |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | běžný život + hra |
| hloubka | intro |
| vizualita | vyvážená (blokový úryvek + text) |
| formalismus | lehký (blokový pseudokód for/while) |
| délka | standard |
| žánr | výklad + malá stavba |
| jazyk | čeština |
| nosiče | blokový úryvek, text |

---

## 1 Kontrakt

### 1.1 Výukový cíl

Žák chápe **opakování (cyklus)**: místo aby stejný krok psal pořád dokola, nechá ho počítač zopakovat. Umí rozlišit cyklus, který se opakuje **daný-krát** (for), od cyklu, který běží, **dokud něco platí** (while), a rozumí tomu, že cyklus musí mít **podmínku ukončení**.

### 1.2 Povinné body

Každé podání tohoto Glitche musí pokrýt:

1. **Cyklus (opakování)** = necháš počítač provést stejné kroky víckrát, místo abys je psal ručně.
2. **Cyklus „opakuj N×" (for)** — opakuje se předem daný počet opakování.
3. **Cyklus „dokud platí… (while)"** — opakuje se, dokud je splněná nějaká **podmínka**; jakmile přestane platit, cyklus skončí.
4. Cyklus musí mít **jak skončit** (podmínku ukončení / počet); jinak by běžel donekonečna (**nekonečný cyklus**).
5. Cyklus a podmínka spolu úzce souvisí — u „while" se **před každým opakováním** kontroluje podmínka. *(Navazuje na úlohu 3.)*
6. Most k Hře života (úloha 5): pravidla se **opakovaně aplikují na všechny buňky v krocích (generacích)** — to je cyklus. Právě opakování rozjede emergenci.

### 1.3 Kanonická otázka (s odpovědí)

**Otázka:** `počet = 0;  opakuj 4×: počet = počet + 3;  vypiš počet`. Co se vypíše — a proč to není potřeba psát ručně čtyřikrát? **Jádro správné odpovědi:** Vypíše **12** (0 → 3 → 6 → 9 → 12). Cyklus provede stejný krok „přičti 3" čtyřikrát za tebe; místo čtyř řádků napíšeš jeden a řekneš „opakuj 4×". Kdyby se to mělo opakovat tisíckrát, ušetří cyklus obrovsky práce.

### 1.4 Zakázaná tvrzení a časté miskoncepce

* ❌ „Cyklus se vždycky opakuje napořád." — Ne, dobrý cyklus má, jak skončit (počet nebo podmínku).
* ❌ „For a while jsou úplně to samé." — For běží daný-krát; while dokud platí podmínka (počet předem nemusíš znát).
* ❌ „Nekonečný cyklus je vždycky chyba." — Většinou nechtěný, ale někdy záměrný (třeba herní smyčka běží, dokud hru nevypneš). Rozhoduje, jestli má rozumné ukončení.
* ❌ „Počítač opakováním ‚přemýšlí'." — Jen mechanicky provádí tytéž kroky znovu; nic si u toho nemyslí. *(Stejná past jako u buněk v Hře života.)*

---

## 2 Obsah — kanonické podání

### 2.1 Karta ve feedu

**Štítek:** Algoritmus **Titulek:** Nech to udělat počítač **Text:** Musíš napsat „ahoj" stokrát pod sebe. Napíšeš to stokrát ručně? Nebo počítači řekneš „opakuj 100×"? Právě od toho je **cyklus**. Spočítáš, co vypíše ten dole? **Interakce:** krátký blokový úryvek s `opakuj …`; dítě si ho nejdřív jen přečte.

### 2.2 Rozklik — vrstva 1: pozorování

Přečti si:

```
počet = 0
opakuj 4×:
    počet = počet + 3
vypiš počet
```

Zkus (zatím jen tipni) protrasovat, jak se `počet` mění po každém opakování: 0 → ? → ? → ? → ? Co se nakonec vypíše?

### 2.3 Rozklik — vrstva 2: odhalení

Tohle je **cyklus** — **opakování**. Místo abys stejný krok psal pořád dokola, řekneš počítači *„opakuj 4×"* a on ho provede za tebe. `počet` roste 0 → 3 → 6 → 9 → **12**.

Cykly jsou dvojího druhu:

```
opakuj 4×:            (for — opakuje se přesně tolikrát)
    udělej krok

dokud (životy > 0):   (while — opakuje se, dokud platí podmínka)
    hraj dál
```

**For** použiješ, když víš počet opakování; **while**, když nevíš, kolikrát to bude, ale víš, **kdy má cyklus skončit**. A pozor: cyklus musí mít **jak skončit** — jinak by běžel donekonečna (tomu se říká **nekonečný cyklus**). Všimni si taky, že while v sobě má **podmínku** z minulé úlohy — před každým opakováním se kontroluje, jestli ještě platí.

A teď to spojení, kvůli kterému celý quest byl: v **Hře života (úloha 5)** se čtyři pravidla („když–tak" z úlohy 3) **opakovaně aplikují na všechny buňky v krocích — generacích**. To opakování je cyklus. Právě díky němu z jednoduchých pravidel vznikne pohyb, blikání a putující útvary — **emergence**.

### 2.4 Kvíz (rychlá kontrola porozumění)

1. K čemu je cyklus? *(a) aby počítač přemýšlel, (b) aby se stejný krok neopakoval ručně, ale automaticky ✓, (c) aby program běžel rychleji náhodou)*
2. Čím se liší for a while? *(a) ničím, (b) for běží daný-krát, while dokud platí podmínka ✓, (c) for je pro čísla, while pro text)*
3. Co musí mít každý „rozumný" cyklus? *(a) barvu, (b) jak skončit — počet nebo podmínku ✓, (c) aspoň sto opakování)*

---

## 3 Úrovně vypracování a kritéria hodnocení

### 🟢 Jednoduchá

**Zadání:** Projdi rozklik, vyplň kvíz a vlastními slovy (3–5 vět) vysvětli, co je cyklus a proč se hodí — na vlastním příkladu, kde by ses opakování rád zbavil. **Kritéria splnění:**

* Vysvětlení říká, že cyklus opakuje kroky za tebe místo ručního psaní.
* Zmiňuje, že cyklus má nějak skončit (počet nebo podmínku).
* Vlastní příklad dává smysl (něco, co se opakuje). **Typický neúspěch a co s ním:** žák řekne „opakuje se to", ale ne dokdy. Zkoušející se doptá: *„A kdy ten cyklus přestane — co ho zastaví?"*

### 🟡 Střední

**Zadání:** Vezmi cyklus `počet = 0; opakuj N×: počet = počet + 3` a **ručně dopočítej** výsledek pro N = 3 a N = 6. Pak napiš tentýž úkol jednou jako **for** a jednou jako **while** (se stejným výsledkem) a vysvětli, čím se ty dva zápisy liší. **Kritéria splnění:**

* Oba ruční dopočty jsou správné (aplikace kroku v každém opakování).
* For i while dají stejný výsledek a mají korektní **ukončení**.
* Žák vystihne rozdíl for (daný počet) vs. while (dokud platí podmínka). **Poznámka pro zkoušejícího:** když žák napíše while bez ukončení, není to chyba k zamlčení — doptej se, co by se stalo, a nech ho ukončení doplnit.

### 🔴 Master

**Zadání (dvě varianty, žák volí):** **A — cyklus + podmínka:** Napiš krátký postup (pseudokódem nebo blokově), kde je **cyklus a uvnitř podmínka** — např. „opakuj přes 10 čísel; když je číslo sudé, přičti ho". Ručně dopočítej výsledek a popiš, co dělá. **B — nekonečno pod kontrolou:** Ukaž na příkladu (třeba herní smyčka), kdy je opakování „donekonečna" **záměrné**, a jasně popiš, co ho nakonec ukončí. **Kritéria splnění:**

* Existuje forknutelný artefakt (postup + ruční dopočet / popis smyčky) — jiný žák na něm může stavět.
* U varianty A je vidět správné spojení cyklu a podmínky (aplikace pravidla v každém opakování).
* Žák správně mluví o ukončení cyklu (kdy a proč skončí). **Poznámka:** tahle úloha je poslední krok před Hrou života — spojení „opakování + pravidlo" je přesně to, co tam uvidí.

---

## 4 Kontext pro Tinybota

### 4.1 Fakta a pozadí

* Cyklus = opakování téhož kroku/bloku. **For**: pevný počet opakování. **While**: opakuje se, dokud platí podmínka (kontroluje se před každým průchodem).
* Každý „rozumný" cyklus má **ukončení** (počet nebo podmínku); bez něj vzniká **nekonečný cyklus** — obvykle nechtěný, ale někdy záměrný (herní smyčka).
* Cyklus a podmínka jsou provázané: while = opakování řízené podmínkou.
* Most k Hře života: pravidla se opakovaně aplikují na všechny buňky v krocích (generacích) = cyklus; opakování rozjede emergenci.
* Detail pro zvídavé: v Hře života se nová generace počítá **najednou** ze staré (ne buňka po buňce s průběžnou změnou) — souvislost s tím, že pořadí a „kdy se stav mění" má význam. Nerozvádět, leda by dítě chtělo.

### 4.2 Hranice tématu

* Bot se drží opakování: for vs. while, ukončení cyklu, protrasování jednoduchého cyklu.
* Když dítě zabředne do složitých vnořených cyklů → zjednodušit a vrátit k jednomu cyklu.
* Když chce rovnou k Hře života → naznačit a odkázat: „přesně tam se opakování potká s pravidly — úloha 5."
* Mimo téma → vlídně vrátit.

### 4.3 Scaffolding — typické zádrhely a jak napovídat

**Zádrhel: ruční dopočet cyklu nevychází.**

1. „Napiš si `počet` po každém opakování zvlášť: začátek je 0, po prvním?"
2. „Kolikrát se má krok provést? Udělal jsi ho tolikrát?"
3. Projít jedno opakování společně, zbytek nechat dítěti.

**Zádrhel: dítě nerozliší for a while.**

1. „Víš dopředu, kolikrát se to zopakuje? Nebo jen víš, kdy to má přestat?"
2. Dát dva příklady: „zaskákej 10×" (for) vs. „skákej, dokud nespadneš" (while).
3. Shrnout rozdíl jednou větou.

**Zádrhel: dítě zapomene na ukončení (nekonečný cyklus).**

1. „Co ten cyklus zastaví? Najdi to v zápisu."
2. „Kdyby tam ukončení nebylo, kdy by skončil?"
3. Ukázat, kam doplnit počet nebo podmínku.

**Zádrhel: „počítač u opakování přemýšlí."**

1. „Dělá u každého opakování něco chytrého navíc, nebo pořád ten stejný krok?"
2. Most k Hře života: „stejně jako buňka nic nechce — pravidlo se prostě aplikuje znovu a znovu."

### 4.4 Co bot nesmí

* Neprozrazovat řešení kvízu ani hotové dopočty na střední/master úrovni; jen navádět (max. stupeň 3 po dvou pokusech dítěte).
* Nehodnotit srovnáním s ostatními.
* Nepoužívat zakázaná tvrzení z 1.4 ani je nepotvrzovat (zvlášť antropomorfizaci — připravuje past z Hry života).
* Při frustraci nabídnout jednodušší krok, ne tlačit na dokončení.
* Časový tlak nikdy nevytvářet; tenhle Glitch žádný časovač nemá.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety kanonického podání | viz sekce 0.2 |
| **obtížnost** | `2` — střední |
| **kognitivní náročnost** | aplikovat *(revidovaná Bloomova taxonomie; na master úrovni „analyzovat")* |
| **energetická náročnost** | střední |
| **typ zátěže** | výklad + malá stavba (trasování) |
| **vhodné při náladě** | spíš vyšší soustředění; při únavě servírovat kratší znalostní Glitch |
| prerekvizity | `programovani-promenne-a-datove-typy`, `informaticke-mysleni-rizeni-toku`; v questu navazuje na úlohu 3 (Podmínky) |
| navazuje | `algoritmus-hra-zivota` (úloha 5 questu — emergence) |
| signál dokončení | jednoduchá: kvíz + vysvětlení · střední: ruční dopočet + for/while · master: forknutelný artefakt (cyklus + podmínka) |
| poctivá absence | pokud žák žádá neexistující podání, loguje se jako poptávka; nesubstituovat tiše |

---

## 6 Bezpečnost a věková přiměřenost

* Téma je nekonfliktní; bot drží vlídný, věcný tón.
* Žádný časový limit, žádné srovnávání mezi žáky, úroveň vypracování není veřejný odznak.
* Emoční data z konverzace se nikam nepropisují.
