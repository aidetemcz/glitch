# Basic Glitch — Co je algoritmus (Robot bere všechno doslova)

_Basic Glitch pro kapitolu Algoritmus, quest „Od návodu k emergenci". Vytvořeno: 2026-07-24._

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `algoritmus-co-je-algoritmus` |
| název | Robot bere všechno doslova |
| kapitola | Algoritmus |
| quest | Od návodu k emergenci |
| pořadí v questu | 1 (vstupní úloha questu) |
| verze | 1.0 |
| autor | redakce AI dětem |
| datum vytvoření | 2026-07-24 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 0.1 Mapa konceptů

*Z konceptu se dědí RVP, digitální kompetence, oblast i téma — zdroj pravdy je mapa, karta jen odkazuje.*

| pole | hodnota |
| ----- | ----- |
| koncept | `informaticke-mysleni-algoritmus` |
| oblast (RVP okruh) | Algoritmizace a programování (`INF-INF-002`) |
| téma | Informatické myšlení a algoritmizace |
| vrstva | core |
| RVP výstup | `INF-INF-002-ZV9-006` — *rozdělí problém na jednotlivě řešitelné části a navrhne postupy a algoritmy pro jeho řešení* |
| digitální kompetence | — *(koncept nemá přiřazenou KDI)* |
| prerekvizity (z mapy) | `informaticke-mysleni-dekompozice`, `informaticke-mysleni-rozpoznavani-vzoru` |

---

## 0.2 Fasety

| faseta | hodnota |
| ----- | ----- |
| svět příkladu | běžný život (návod pro „robota") |
| hloubka | intro |
| vizualita | visual-first *(animace/ilustrace robota, který plní návod doslova)* |
| formalismus | žádný |
| délka | standard |
| žánr | pozorování + výklad |
| jazyk | čeština |
| nosiče | animace/ilustrace, text |

---

## 1 Kontrakt

*Vlastní redakce. Každé podání se kontroluje proti němu. Beze změny kontraktu se nesmí změnit, co Glitch učí.*

### 1.1 Výukový cíl

Žák chápe, že algoritmus je **přesný, jednoznačný postup krok za krokem**, podle kterého dojde ke stejnému výsledku každý — člověk i stroj. Umí posoudit, jestli je návod dost jednoznačný, a doplnit chybějící přesnost.

### 1.2 Povinné body

Každé podání tohoto Glitche musí pokrýt:

1. Algoritmus je přesný návod krok za krokem, jak vyřešit úlohu.
2. Stroj (i „robot") dělá **přesně to, co v krocích stojí** — ani víc, ani míň; nic si nedomýšlí.
3. Algoritmus musí být **jednoznačný**: žádné „nějak" a „tak akorát", jinak ho každý provede jinak.
4. Na **pořadí kroků** záleží.
5. **Determinismus:** stejný přesný postup a stejný začátek → vždy stejný výsledek. *(Most k Hře života — úloha 5.)*
6. Algoritmus nemusí být v počítači: i recept nebo návod na cestu je algoritmus.

### 1.3 Kanonická otázka (s odpovědí)

**Otázka:** Dáš robotovi jediný pokyn „namaž chleba máslem" a on skončí s máslem v ruce nebo rozmačkaným rohlíkem. Proč? **Jádro správné odpovědi:** Robot dělá přesně to, co mu řekneš, a nic si nedomýšlí. „Namaž chleba máslem" není algoritmus — je to nejednoznačný cíl. Chybí rozepsané, jednoznačné kroky ve správném pořadí (vezmi nůž, otevři máslo, naber trochu, rozetři po horní straně krajíce…). Teprve takový přesný postup je algoritmus.

### 1.4 Zakázaná tvrzení a časté miskoncepce

Podání ani chatbot nesmí tvrdit; chatbot na miskoncepce aktivně reaguje:

* ❌ „Robot/počítač si domyslí, co jsem myslel." — Ne, provede přesně napsaný krok. (Dítě to přinese skoro vždy.)
* ❌ „Algoritmus musí být složitý nebo v počítači." — I pár jednoduchých kroků v receptu je algoritmus.
* ❌ „Na pořadí kroků nezáleží." — Záleží; jiné pořadí = jiný výsledek.
* ❌ „Když návod párkrát vyšel, je dobrý." — Rozhoduje jednoznačnost, ne štěstí; dobrý algoritmus dá stejný výsledek pokaždé.

---

## 2 Obsah — kanonické podání

*Fasety tohoto podání: hloubka intro, vizualita visual-first, žánr pozorování + výklad, délka standard.*

### 2.1 Karta ve feedu

**Štítek:** Algoritmus **Titulek:** Robot bere všechno doslova **Text:** Tenhle robot udělá přesně to, co mu napíšeš — a ani o chlup víc. Dáš mu návod „namaž chleba" a výsledek tě překvapí. Dokázal bys mu dát návod, který nejde splést? **Interakce:** krátká animace/ilustrace, kde robot plní nejednoznačný pokyn doslova; dítě nejdřív jen pozoruje.

### 2.2 Rozklik — vrstva 1: pozorování

Pusť si, jak robot provede pokyn „namaž chleba máslem". Kde přesně se to „rozbije"? Zkus slovy popsat aspoň dvě místa, kde robot udělal něco jiného, než jsi čekal — a proč to tak podle tebe udělal. Zatím nic neopravuj, jen si všímej.

### 2.3 Rozklik — vrstva 2: odhalení

Robot není hloupý ani zlomyslný — dělá **přesně to, co je v krocích napsané**, a nic si nedomýšlí. „Namaž chleba máslem" je jen cíl, ne postup. **Algoritmus** je přesný návod krok za krokem: *vezmi nůž → otevři máslo → naber trochu → rozetři po horní straně krajíce.* Dobrý algoritmus je **jednoznačný** (žádné „nějak") a **záleží v něm na pořadí**. A má ještě jednu vlastnost: je **deterministický** — když dáš robotovi stejný přesný postup a stejný začátek, dostaneš pokaždé stejný výsledek. Tuhle vlastnost si zapamatuj: z přesných kroků, které budeš skládat z podmínek (úloha 3) a opakování (úloha 4), nakonec v Hře života (úloha 5) vznikne něco překvapivého.

### 2.4 Kvíz (rychlá kontrola porozumění)

1. Co udělá robot s pokynem, kterému chybí detaily? *(a) domyslí si, co jsi chtěl, (b) provede ho doslova, jak je napsaný ✓, (c) počká, až mu to vysvětlíš)*
2. Čím se pozná dobrý algoritmus? *(a) je složitý, (b) je jednoznačný a záleží v něm na pořadí ✓, (c) běží v počítači)*
3. Dáš stejný přesný postup a stejný začátek dvakrát. Co dostaneš? *(a) pokaždé stejný výsledek ✓, (b) pokaždé něco jiného, (c) záleží na náladě robota)*

---

## 3 Úrovně vypracování a kritéria hodnocení

*Žák si úroveň volí sám při forku do svého boardu. Kritéria jsou formativní; posuzuje je LLM zkoušející — hodnotí podstatu, doptává se, nedává klíčoslovné skóre.*

### 🟢 Jednoduchá

**Zadání:** Projdi animaci a rozklik, vyplň kvíz a vlastními slovy (3–5 vět) vysvětli kamarádovi, který Glitch neviděl, co je algoritmus a proč robot udělal něco jiného, než člověk čekal. **Kritéria splnění:**

* Vysvětlení říká, že algoritmus je přesný postup krok za krokem.
* Zmiňuje jednoznačnost (žádné „nějak") nebo pořadí kroků.
* Pojmenuje, že robot dělá přesně napsané, nedomýšlí si. **Typický neúspěch a co s ním:** žák popíše „co se stalo" (rozmačkal to), ale ne „proč". Zkoušející se doptá: *„A proč to robot udělal zrovna takhle — co mu v návodu chybělo?"*

### 🟡 Střední

**Zadání:** Vezmi nejednoznačný návod „udělej si čaj" (nebo vlastní podobný) a **přepiš ho na jednoznačný algoritmus** — kroky tak přesné, aby je robot nemohl splést. Pak ho **otestuj**: dej kamarádovi, ať dělá „robota" a provede tvé kroky doslova. Zapiš, kde se to přesto zaseklo a jak jsi krok upřesnil. **Kritéria splnění:**

* Návod je rozepsaný na jednoznačné kroky ve správném pořadí.
* Test proběhl — je popsané aspoň jedno místo, kde „robot" krok provedl jinak, a jak se opravil.
* Žák poctivě přizná, kde byl původní krok vágní (nezamlčí to). **Poznámka pro zkoušejícího:** zaseknutí není chyba, je to materiál. Hodnotí se kvalita upřesnění, ne to, jestli návod vyšel na první pokus.

### 🔴 Master

**Zadání (dvě varianty, žák volí):** **A — záludná úloha:** Vymysli návod pro záludnější činnost (např. „nakresli podle diktátu obrázek", „proveď kamaráda se zavázanýma očima po místnosti") a odehraj ho s někým, kdo dělá „robota" doslova. **B — chytáky:** Napiš návod schválně tak, aby v něm zbyla jedna past na nejednoznačnost, a nech kamaráda past najít a opravit. **Kritéria splnění:**

* Existuje forknutelný artefakt (zapsaný návod + záznam, co se při provedení stalo) — jiný žák na něm může stavět.
* Žák formuluje vztah „nejednoznačný krok → co se pokazilo" na konkrétním místě.
* Žák správně použije pojem jednoznačnost (a klidně i determinismus) na vlastní případ. **Poznámka:** master výstup je přirozený kandidát na sdílení ve třídě — „robotí" scénky bývají zábavné.

---

## 4 Kontext pro chatbota

*Nezobrazuje se uživateli. Bot je omezen na téma tohoto Glitche.*

### 4.1 Fakta a pozadí

* Algoritmus = přesný, konečný postup krok za krokem k vyřešení úlohy; nemusí být v počítači.
* Klíčové vlastnosti: **jednoznačnost** (každý krok jasný), **záležící pořadí**, **determinismus** (stejný vstup + postup → stejný výsledek).
* Stroj/„robot" provádí kroky doslova a nic nedomýšlí — proto vágní pokyn selže.
* Tenhle Glitch vychází ze známé aktivity „přesné instrukce" (dítě diktuje, druhý provádí doslova) — odhaluje skryté předpoklady v návodu.
* Most dál v questu: přesné kroky se budou skládat z **podmínek** („když–tak", úloha 3) a **opakování** (cyklus, úloha 4); v **Hře života** (úloha 5) z nich vznikne emergence.

### 4.2 Hranice tématu

* Bot se drží pojmu algoritmus, jednoznačnosti, pořadí a determinismu.
* Když dítě odbočí k „a jak se to naprogramuje" → krátce a vrátit: „přesně tyhle kroky si za chvíli poskládáš z podmínek a cyklů v dalších úlohách questu."
* Mimo téma (osobní věci, jiné předměty) → vlídně vrátit k tématu.

### 4.3 Scaffolding — typické zádrhely a jak napovídat

*Zásada: nevysvětlovat líp, ale doptávat se tak, aby na to dítě přišlo samo. Tři stupně, začínej vždy prvním.*

**Zádrhel: dítě čeká, že si robot „domyslí" chybějící krok.**

1. „Kde je v návodu napsané, že má vzít nůž? Zkus najít ten řádek."
2. „Když tam ten krok není, odkud by to robot měl vědět?"
3. Vysvětlit přímo: robot dělá jen napsané kroky; co chybí, neudělá.

**Zádrhel: dítě dává vágní kroky („namaž to pořádně").**

1. „Co přesně znamená ‚pořádně'? Šlo by to změřit nebo ukázat?"
2. „Jak by ten krok provedli dva různí lidé — udělali by totéž?"
3. Ukázat na jednom kroku, jak ho přepsat na jednoznačný.

**Zádrhel: dítě nevidí, že na pořadí záleží.**

1. „Co se stane, když prohodíš ‚zavaž tkaničky' a ‚nazuj boty'?"
2. Nechat dítě ty dva kroky přehodit a popsat výsledek.
3. Shrnout: pořadí kroků mění výsledek — proto je součástí algoritmu.

**Zádrhel: „k čemu to je?"**

1. Otočit: „Napadá tě, kde v běžném životě dáváš někomu přesný návod — a co se stane, když je nejasný?"
2. Most: přesně tuhle přesnost potřebují počítače u každého programu.

### 4.4 Co bot nesmí

* Neprozrazovat řešení kvízu ani hotové znění opraveného návodu na střední/master úrovni; vždy jen navádět (max. stupeň 3, a to až po dvou pokusech dítěte).
* Nehodnotit dítě srovnáním s ostatními (zakázané v jakékoli podobě).
* Nepoužívat zakázaná tvrzení z 1.4 ani je nepotvrzovat, když je vysloví dítě — vlídně korigovat.
* Při frustraci nabídnout jednodušší krok, ne tlačit na dokončení.
* Časový tlak nikdy nevytvářet; tenhle Glitch žádný časovač nemá.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety kanonického podání | viz sekce 0.2 |
| **obtížnost** | `1` — lehká |
| **kognitivní náročnost** | porozumět *(revidovaná Bloomova taxonomie; na master úrovni „tvořit")* |
| **energetická náročnost** | nízká–střední |
| **typ zátěže** | pozorování + výklad |
| **vhodné při náladě** | kdykoli; vstupní úloha questu, dobrá i při nižší energii |
| prerekvizity | — *(vstupní úloha; z mapy volně navazuje na dekompozici a rozpoznávání vzorů)* |
| navazuje | úloha 2 questu (Pseudokód a vývojové diagramy) |
| signál dokončení | jednoduchá: kvíz + vysvětlení · střední: přepsaný a otestovaný návod · master: forknutelný artefakt |
| poctivá absence | pokud žák žádá podání, které neexistuje (např. jiný svět příkladu), loguje se jako poptávka; nesubstituovat tiše |

---

## 6 Bezpečnost a věková přiměřenost

* Téma je nekonfliktní a hravé; bot drží vlídný tón.
* Žádný časový limit, žádné srovnávání mezi žáky, úroveň vypracování není veřejný odznak.
* Emoční data (frustrace v konverzaci) se nikam nepropisují — bot na ně reaguje v konverzaci, neukládají se jako signál pro doporučování.
