# Doporučovací systém Glitche

_Jak Glitch vybírá, co ti ukáže — a proč jinak než běžné sítě. Návrh k připomínkám. Vytvořeno: 2026-07-23._

Tenhle dokument popisuje **principy a mechaniku doporučování v Glitchi**. Staví na dvou zdrojích:

- **p-book** (Kordík & Nečasová, _How Would You Like Your Recommendations?_, RecSys '26) — výzkumný demo-systém, který uživateli předává tři rozhodnutí, jež platformy běžně skrývají. Glitch z něj přebírá klíčové koncepty (kontrakt konceptu, fasety podání, „serve-or-mint", žebřík důvěry, editovatelný model uživatele).
- **11 principů Glitche** (níže) — hodnotový rámec, který určuje, co je „dobré" doporučení pro dětskou vzdělávací síť.

Navazuje na: [`typy-obsahu.md`](./typy-obsahu.md), [`karta-basic-glitch.md`](./karta-basic-glitch.md), [mapu konceptů](../knowledge-map/).

---

## 11 principů (hodnotový rámec)

1. **Hybridní doporučování** — nejen parametry, ale i **AI moderace** s guardrails a **zdrojem pravdy**.
2. **Tvorba obsahu moderovaná chatbotem** — bot dává při psaní příspěvku/komentáře zpětnou vazbu (doplňující otázky, ozdrojovaná fakta).
3. **Transparentní systém** — uživatel si víc volí, jaký obsah a od koho vidí.
4. **Žádný nekonečný scroll** — denní strop počtu Glitchů ve feedu (20).
5. **Kvalita času ≠ délka** — měří se **pokrok** uživatele v tom, co ho zajímá.
6. **Kvalitní, viditelně označený AI obsah** — dodává názorovou a postojovou různorodost.
7. **Žádné veřejné lajky, sledující ani žebříčky.**
8. **Žádné streaky ani nátlakové notifikace.**
9. **Wellbeing jako přímý obsah feedu** — hry a aktivity pro pozornost, soustředění, učení, relaxaci.
10. **Sdílení přes rozvíjení tématu** — přesdílení moderované chatbotem.
11. **Bezpečí a soukromí jako výchozí stav** — uživatel volí, komu se jeho obsah zobrazuje.

---

## Co systém rozhoduje (tři roviny, dle p-book)

Běžná síť rozhoduje tři věci a uživateli je neukáže: **jak se obsah servíruje, jak je každá položka podána, a co vůbec v katalogu je.** Glitch je dělá **explicitní, zaznamenané a vratné**.

| rovina | běžná síť | Glitch |
| --- | --- | --- |
| **Servírování** | nekonečný feed, skrytý algoritmus | feed s denním stropem; uživatel vidí a ovlivňuje, proč to dostal (princip 3, 4) |
| **Podání** | jedna verze pro všechny | jeden **koncept** může mít víc **podání** (fasety: hloubka, vizualita, délka, svět, jazyk); vybírá se to, které sedí (princip 6) |
| **Katalog** | pevný, neprůhledný | **elastický** — chybějící podání se dá dogenerovat a projde žebříkem důvěry (princip 1, 2) |

---

## Jak to funguje u Glitche

### Koncept, kontrakt a podání

- **Koncept** = jednotka porozumění s **lidsky schváleným kontraktem** (výukový cíl, povinné body, kanonická otázka, zakázaná tvrzení). Zdroj pravdy: [mapa konceptů](../knowledge-map/). Kontrakt drží každé podání — i lidské, i generované.
- **Podání (telling)** = jedna realizace konceptu, otagovaná **fasetami** (hloubka, vizualita, formalismus, délka, žánr, svět příkladu, jazyk). Kontrakt fixuje _co_ se učí; fasety popisují _jak_. Doporučovač vybírá **jen mezi podáními, která splňují kontrakt**.
- V Glitchi je „koncept + kontrakt + podání" už zavedený jako struktura karty (viz [`karta-basic-glitch.md`](./karta-basic-glitch.md), sekce 1–2). Fasety jsou vlastnosti položky, ze kterých se doporučovač učí, co uživateli sedí.

### Retrieve before generate → honest miss → serve-or-mint

- **Nejdřív hledej, pak generuj.** Systém nejprve nabídne existující podání z kurátorovaného katalogu.
- **Honest miss** — když žádné podání nesedí, řekne to **poctivě** („takové podání zatím není"), nikdy tiše nepodstrčí náhradu. Každá poctivá absence je **zaznamenaná poptávka** po neexistující položce (silný signál pro redakci).
- **Serve-or-mint** — až u skutečné mezery, na explicitní akci, se podání dogeneruje z auditovatelného promptu (kontrakt + fasety + zdroj pravdy) a musí projít **deterministickou branou** (pokrytí povinných bodů, délka, shoda tagů) dřív, než se ukáže. Lidská kontrola přijde později na žebříku důvěry.

### Žebřík důvěry (trust state)

Obsah získává důvěru po stupních; každý stupeň je stav položky, který řídí servírování a označení:

`core` → `edited` → `community` → `generated`

Certifikace se počítá jen nad lidsky ověřeným `core` obsahem, takže spolutvorba katalog **rozšiřuje, ale nesnižuje** laťku (princip 6: AI obsah je kvalitní a **viditelně označený**).

### Hybridní řazení (princip 1)

Doporučení nestojí jen na parametrech (fasety, historie, prerekvizity z mapy), ale i na **AI moderaci s guardrails a zdrojem pravdy**:

- **parametry** — koncept, fasety, prerekvizity/navazující z mapy, obtížnost, trust state;
- **AI moderace** — kontrola proti kontraktu a zakázaným tvrzením (nic mimo zdroj pravdy);
- **zdroj pravdy** — ověřená fakta konceptu, ze kterých bot i generování čerpají.

### Transparentnost a kontrola uživatele (princip 3)

Uživatel vidí **editovatelný model svých preferencí** (které fasety mu sedí — hloubka, vizualita, jazyk) a **explicitní volba vždy přebije** naučenou preferenci. Steering: u sekce vidí, jaká podání existují, a může si vyžádat jiné (hlubší/jednodušší, textové/vizuální, jiný svět příkladu).

### Denní strop, kvalita ≠ délka (principy 4, 5)

- **Denní strop 20 Glitchů**, pak karta Shrnutí — žádný nekonečný scroll.
- **Signál kvality není dwell time**, ale **pokrok**: dokončená úroveň vypracování, zvládnutý koncept, absolvovaná argumentační smyčka. Čas na kartě se nepoužívá jako cíl.

### Co se _nepoužívá_ (principy 7, 8)

Žádné veřejné lajky, sledující, žebříčky, streaky ani nátlakové notifikace — a tedy ani jako signály pro doporučování.

---

## Focus signál → co se servíruje

**Tohle je jádro toho, čím se Glitch liší** (princip 9): wellbeing není jen obsah, ale i **vstup pro doporučování**. Systém ale **nerozpoznává emoce** (to zakazuje AI Act). Místo toho pracuje s **behaviorálním „focus" signálem** — odvozeným z toho, **co žák ve feedu udělal**, ne z odhadu, jak se cítí.

> ⚠️ **AI Act:** Karta „Jak se teď cítíš" (mood check-in, odhad energie/nálady) byla **odstraněna** — rozpoznávání/odhad emocí je zakázané. Nic v doporučování nevychází z emocí. `focus` je čistě behaviorální (splnil / nesplnil aktivitu).

### Zdroje focus signálu (behaviorální)

| zdroj | co značí (chování, ne emoce) | perioda |
| --- | --- | --- |
| **breathing** (dechové cvičení) | žák si dal zklidnění | při splnění |
| **attention_game** (hra na pozornost / kolo slov) | žák se „rozehřál" / usadil pozornost | při splnění |
| _(budoucí relaxační / pozornostní aktivity)_ | další zklidnění / soustředění | při splnění |

> Do rodiny wellbeing typů patří i **asmr** (zklidnění) a **inspirace** (tvůrčí nakopnutí + založení projektu). Ty samy o sobě **neměří signál**, ale řazení s nimi počítá jako s wellbeing prvky feedu (`WELLBEING_TYPES` v `js/recommender.js`).

> Focus je **efemérní** — platí jen pro dnešní feed (princip 11), nikdy netvoří trvalý štítek a **neagreguje se do profilu**. Je to zamýšlené hlavně **do budoucna**, až bude relaxačních a pozornostních aktivit víc; při testování uvidíme, jak se chytnou.

### Pravidlo přizpůsobení

Signál je binární/měkký podle **splněných** wellbeing aktivit, ne podle odhadu stavu:

| chování žáka | co systém servíruje |
| --- | --- |
| **splnil zklidnění / pozornostní aktivitu** (focus „ready") | může nabídnout náročnější, aplikační a **tvůrčí** Glitche (fork, „postav to"); delší podání |
| **bez wellbeing aktivity / hodně za sebou náročných Glitchů** | proloží kratší **znalostní** Glitche a nabídne **wellbeing/aktivitu** pro usazení; méně tvůrčích úkolů v řadě |

Tím se naplňuje princip 5: **kvalita času = pokrok přiměřený tempu**, ne co nejdelší setrvání. (V prototypu je focus zatím koncept — feed řadí `js/recommender.js`, mood se nikde nepočítá.)

---

## Co musí karta Glitche deklarovat pro doporučování

Aby doporučovač mohl párovat obsah se stavem uživatele, každá karta v sekci _Metadata pro doporučovací systém_ deklaruje:

| pole | hodnoty | k čemu |
| --- | --- | --- |
| **obtížnost** | `1` lehká · `2` střední · `3` těžká (pro cílovou skupinu) | párování s focus signálem; **volí se u každého Glitche zvlášť** |
| **kognitivní náročnost** | úroveň **revidované Bloomovy taxonomie**: zapamatovat · porozumět · aplikovat · analyzovat · hodnotit · vytvořit | jakou myšlenkovou operaci Glitch vyžaduje |
| **typ zátěže** | soustředění · kreativita · relaxace · rozcvička | vyváženost feedu |
| **délka** | mikro · krátká · standard · deep | čtenářský závazek |
| **fasety podání** | viz tabulka faset níže | preference uživatele (editovatelný model) |
| **trust state** | core · edited · community · generated | označení a režim servírování |
| **koncept** | id z mapy konceptů | prerekvizity, navazující, RVP, digi kompetence |

> **Obtížnost ani kognitivní náročnost nejsou dané typem Glitche** — i Fun fact může nést náročný obsah, i Basic Glitch může být jednoduchý. Volí se **při tvorbě konkrétního Glitche**. Kognitivní náročnost používá **revidovanou Bloomovu taxonomii** na úrovni jednotlivého Glitche; mapa konceptů gradovaně popisuje cíle konceptu v Marzano-Kendall škále — obojí je žebřík myšlenkových operací, jen na jiné úrovni (Glitch × koncept).

### Fasety podání (taxonomie)

Fasety popisují _jak_ je koncept podán. Jsou to zároveň vlastnosti položky (učí se z nich preference uživatele) i **rozhraní pro generování** (viz výhled níže). Vychází z taxonomie p-book (Table 1):

| faseta | co zachycuje | hodnoty |
| --- | --- | --- |
| **svět příkladu** | z jakého světa jsou příklady | generický · e-shop · média · sociální sítě · vzdělávání · hry · … |
| **hloubka** | předpokládané zázemí čtenáře | intro · standard · technická · výzkumná |
| **vizualita** | jak moc nesou sdělení vizuály | text-first · vyvážená · visual-first |
| **formalismus** | množství formálního/matematického zápisu | žádný · lehký · plný |
| **délka** | čtenářský závazek | tl;dr · standard · deep |
| **žánr** | strukturní forma | výklad · příběh · řešený příklad · komiks · animace · kvíz · … |
| **jazyk** | přirozený jazyk | čeština · angličtina · … |
| **nosiče** | stavební prvky (odvozené z obsahu) | text · tabulka · diagram · obrázek · animace · kód |

Každá karta Glitche má vlastní **tabulku faset** (sekce 0.2) s konkrétními hodnotami svého podání.

---

## Smyčka signálů (jak se profil učí)

```
uživatel  ──čte · steeruje · dech/pozornostní aktivita (focus) · kvíz · konverzace──►  signály
   ▲                                                                          │
   │                                                                          ▼
feed na míru  ◄──  doporučovač (parametry + AI moderace + zdroj pravdy)  ◄──  profil žáka
```

- **Implicitní signály:** dokončená úroveň, zvládnutý koncept, volba faset, honest miss.
- **Focus signál:** splněné wellbeing / pozornostní aktivity (dech, hra na pozornost) — behaviorální, jen v relaci; **žádné rozpoznávání emocí**.
- **Kvalita konverzace:** formativní vyhodnocení chatu (dal důvod ✓, uvedl příklad ✓, zvážil protiargument ✓…) — **posuzuje samostatný hodnoticí AI asistent** (viz níže), ne tutor sám.

### Proč samostatný hodnoticí asistent

Vyhodnocení konverzace, které jde do profilu žáka, má dělat **jiný AI asistent než ten, co s dítětem povídá**:

- **Oddělené role** — tutor/persona _pomáhá_ (vede, napovídá, drží téma); hodnotitel _posuzuje_ (čte celý přepis proti kontraktu a kritériím). Tutor nemá „známkovat sám sebe".
- **Jiný vstup a výstup** — hodnotitel dostane přepis + kontrakt + kritéria a vrací **strukturované signály** (splněno/nesplněno u každého kritéria), ne chatovou bublinu.
- **Jiné guardrails** — hodnotitel je formativní (podstata, ne klíčová slova), nikdy nedává skóre ani nesrovnává s ostatními.

→ Patří do checklistu jako samostatná položka v sekci **AI asistenti**.

---

## Fasety a generování v reálném čase (výhled)

_Semi-technicky, pro budoucí uvažování — ne pro současnou implementaci._

**Otázka:** Když je napojené GPT, dokážeme Glitche generovat naživo na úrovni faset — tzn. karta drží, jak mají fasety vypadat, a GPT vytvoří podání podle preferencí uživatele, než se mu zobrazí?

**Odpověď: koncepčně ano — je to přesně model p-book.** Karta odděluje _co_ se učí (koncept + **kontrakt** = neměnné) od _jak_ se to podá (**fasety** = generovací rozhraní). GPT umí vygenerovat podání pro zadaný **fasetový vektor** (např. `vizualita: visual-first`, `délka: tl;dr`, `svět: sociální sítě`). Ale aby to bylo bezpečné a udržitelné, neplatí „generuj všechno naživo pokaždé". Platí tři pravidla:

1. **Nejdřív hledej, pak generuj.** Systém nejdřív nabídne existující (už jednou prověřené) podání. Teprve u skutečné mezery generuje. Vygenerované podání se **zacacheuje podle fasetového vektoru** a slouží všem, kdo mají stejné preference — generuje se **pro segment, ne pro jednoho člověka pokaždé znovu**. Personalizace je pak ve **výběru** (které podání ukázat), ne v neustálém přegenerovávání.
2. **Brána před zobrazením.** U obsahu pro děti nesmí jít na obrazovku nic nezkontrolovaného. Každé vygenerované podání projde deterministickou branou: pokrytí povinných bodů kontraktu, žádné zakázané tvrzení, čerpání jen ze **zdroje pravdy** konceptu. Lidsky certifikovaný zůstává jen `core`.
3. **Latence a cena jsou reálné.** Volání GPT trvá sekundy a stojí tokeny; feed má být okamžitý. Proto se generuje **on-demand a cacheuje**, ne synchronně před každým zobrazením každému uživateli.

**Jak systém zjistí preference (tvůj příklad „obrázky vs. text, jak dlouho vydrží u čtení"):** dvěma cestami, které se sbíhají do jednoho **profilu fasetových afinit**:

- **explicitně** — uživatel si zvolí (editovatelný model preferencí). Tvůj nápad na Glitch, který se zeptá / vysleduje, jestli má radši obrázky nebo text, je přesně tahle explicitní cesta.
- **implicitně** — z chování: doba čtení, které podání dokončil, co přeskočil, výsledek aktivity, focus (splnil dech / hru na pozornost). (Pozor: chování ≠ trvalá pravda o dítěti — implicitní signály jsou slabé a přebíjí je explicitní volba. Emoce se **nesnímají**.)

Z profilu afinit pak plyne **cílový fasetový vektor**, a ten se buď **najde** v katalogu, nebo (u mezery) **dogeneruje** přes bránu.

**Co k tomu ještě chybí (proti dnešku):** napojené GPT (chat proxy) už máš — stačí na asistenty a na generování na vyžádání. Plné „fasety naživo" navíc potřebují: **fasetový model karet** (děláme teď — sekce 0.2 každé karty), **cache podle fasetového vektoru**, **kontrolní bránu** a **profil fasetových afinit**. To je cíl do budoucna, ne pro teď.

---

## Bezpečnost a soukromí signálů (princip 11)

- **Focus signál** (splněné wellbeing/pozornostní aktivity) žije jen v 24h relaci, pak se maže; nikdy netvoří trvalý štítek. **Emoce se nerozpoznávají** (AI Act).
- **Do profilu / do Tiny jde důkaz o učení** (zvládnuté koncepty, kvalita argumentace, dokončení), **ne** citlivé názory ani nálady.
- **Uživatel volí viditelnost** svého obsahu; sdílení vyžaduje souhlas (výchozí anonymně).
- Žádné veřejné metriky → žádný tlak.

---

## Další krok: struktura databáze

Až bude tenhle model odsouhlasený, navrhneme **strukturu databáze** — jak se signály (focus, dokončení, kvalita konverzace, honest miss) a metadata karet ukládají tak, aby si z nich doporučovač mohl brát informace. Návrh: [`databaze-navrh.md`](./databaze-navrh.md).
