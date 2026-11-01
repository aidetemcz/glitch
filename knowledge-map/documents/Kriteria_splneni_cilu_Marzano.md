# Kritéria splnění vzdělávacích cílů podle Nové taxonomie (Marzano & Kendall)

Podle čeho poznat, že žák splnil vzdělávací cíl na dané úrovni. Dokument slouží jako podklad pro mapu informatických konceptů a jako vzor pro chatbota a výukové aplikace.

**Zdroj:** Marzano, R. J. & Kendall, J. S. (2007). *The New Taxonomy of Educational Objectives* (2. vyd.). Thousand Oaks, CA: Corwin Press. Čísla stran odkazují na tuto knihu.

**Co je z knihy a co ne:** Kniha nemá samostatnou kapitolu s kritérii a slovo „kritéria" v tomto smyslu nepoužívá. Kritéria jsou poskládaná ze tří míst knihy:

- **kapitola 3:** „kritické znaky" jednotlivých procesů,
- **kapitola 4:** popis toho, čím žák proces prokazuje,
- **kapitola 6:** protokoly a doporučení k výuce myšlení.

Části označené jako naše kniha neobsahuje.

**Související dokumenty:**
- `claude/Formulace_vzdelavacich_cilu_Marzano.md`: jak cíle formulovat,
- `claude/Marzano_Kendall_Nova_taxonomie.md`: celkový výcuc o taxonomii.

---

## 1. Jak kritéria číst

**Tato kritéria říkají, co znamená daný proces splnit.** Neurčují výkonnostní laťku, tedy kolik toho žák má zvládnout a jak dobře. Tu podle Magera obsahuje výukový cíl a doplňuje se zvlášť pro konkrétní ročník a úlohu (s. 117).

**Charakter kritérií se mění s úrovní:**

| Úrovně | Co kritéria hodnotí |
|---|---|
| 1–2 Vyvolání z paměti, Porozumění | správnost a přesnost výsledku |
| 3–4 Analýza, Použití znalostí | kvalitu postupu; žák musí svou úvahu ukázat, takže skoro vždy něco vysvětluje nebo zdůvodňuje |
| 5–6 Metakognice, Já-systém | kvalitu sebereflexe; žák musí být konkrétní, opřít se o důkaz a posoudit vlastní úvahu |

Z toho plyne pravidlo pro chatbota: **od úrovně 3 výš nestačí kontrolovat jen správnost odpovědi.** Hodnotí se i viditelná úvaha.

---

## 2. Kritéria podle úrovní

### Úroveň 1: Vyvolání z paměti

| Proces | Podle čeho poznat, že žák cíl splnil | s. |
|---|---|---|
| Rozpoznání | Správně potvrdí nebo vyvrátí předložená tvrzení. Sám je vytvořit nemusí. | 67 |
| Vybavení | Sám uvede správné údaje, i když nemusí jít o ty nejpodstatnější. U zobecnění a principů uvede příklady, které se probíraly. | 69–70 |
| Provedení | Provede postup bez podstatné chyby. Nemusí vědět, jak a proč postup funguje. | 71 |

**Na co si dát pozor:**
- Když žák postup rozpozná nebo si ho vybaví, prokazuje jen znalost *o* postupu, ne jeho zvládnutí (s. 67–71).
- Úloha na vybavení má chtít příklady, které se probíraly. Když má žák vymyslet nové příklady, jde už o analýzu (s. 70).
- U informací provedení neexistuje (s. 71).

### Úroveň 2: Porozumění

| Proces | Podle čeho poznat, že žák cíl splnil | s. |
|---|---|---|
| Integrace | Vyjádří jádro znalosti (makrostrukturu) a odliší podstatné od nepodstatného. | 41, 72 |
| | *U detailů:* odliší události nebo údaje, které jsou pro výsledek klíčové, od ostatních. | 73 |
| | *U principu:* popíše proměnné a přesný vztah mezi nimi. | 73 |
| | *U zobecnění:* odliší určující znaky třídy od znaků, které s ní jen souvisejí. | 74 |
| | *U postupu:* popíše kroky, jejich pořadí a logiku tohoto pořadí. | 74 |
| Symbolizace | Znázornění je přesné a odlišuje podstatné od nepodstatného. | 75 |

**Na co si dát pozor:**
- Úloha na integraci musí po žákovi chtít probranou látku uspořádat a vyjádřit nově, ne ji jen zopakovat (s. 73–74).
- Integraci lze u detailů použít jen tehdy, když mají dost složitou strukturu (s. 73).
- Symbolizace předpokládá zvládnutou integraci (s. 75).
- U zobecnění a principů je výběr forem znázornění užší, principy se typicky znázorňují grafem. U postupů jde o diagram nebo vývojový diagram (s. 76).

### Úroveň 3: Analýza

| Proces | Podle čeho poznat, že žák cíl splnil | s. |
|---|---|---|
| Porovnávání | Určí znaky, podle kterých porovnává, a ty jsou pro věc důležité. Podobnosti i rozdíly popíše co nejpřesněji. | 45, 154 |
| Třídění | Určí určující znaky věci, zařadí ji do nadřazené kategorie a zdůvodní proč. Případně určí podkategorie a vysvětlí jejich vztah. | 46, 154 |
| Analýza chyb (informace) | Posoudí platnost tvrzení podle výslovných kritérií a pojmenuje chybu v úvaze (viz kap. 4). | 46–47 |
| Analýza chyb (postupy) | Najde chybu v provedení postupu a posoudí, co každý krok přispívá k celku. Postupuje z porozumění postupu, ne mechanicky. | 48 |
| Zobecňování | Vychází z konkrétních informací bez předpokladů, najde souvislosti nebo vzorec a formuluje obecné tvrzení, které je vysvětluje. Ověří, že tvrzení s informacemi sedí, a uvede výjimky. | 50, 157 |
| Specifikace | Najde pravidlo, které na situaci platí, ověří, že situace splňuje jeho podmínky, a vyvodí z něj závěr nebo předpověď. | 50, 157 |

**Na co si dát pozor:**
- Všechny tyto procesy lidé dělají i přirozeně. Jako analytický nástroj ale musí probíhat vědomě a důsledně (s. 44).
- U dovedností lze při třídění určit jen nadřazenou kategorii, podkategorie nemají (s. 83).
- Zobecňování je spíš induktivní, specifikace spíš deduktivní (s. 50).

### Úroveň 4: Použití znalostí

| Proces | Podle čeho poznat, že žák cíl splnil | s. |
|---|---|---|
| Rozhodování | Určí možnosti a kritéria dobrého rozhodnutí a vybere možnost, která kritéria splňuje nejlépe. | 51, 158 |
| Řešení problému | Pojmenuje cíl a překážky, najde jiné cesty k cíli, vyhodnotí je, vybere jednu a vyzkouší ji. Když nevyjde, zkusí jinou. | 52, 159 |
| Experimentování | Odvodí předpověď ze známého principu, navrhne pokus, který ji ověří, a podle výsledku posoudí, jestli princip platí. | 52, 160 |
| Zkoumání | Určí, co je známé nebo v čem panuje shoda, kde je nejasnost nebo spor, navrhne odpověď a podpoří ji logickým argumentem. | 53, 160 |

**Na co si dát pozor:**
- **U myšlenkových a psychomotorických postupů** platí dvě podmínky. Úkol musí být postavený tak, aby ho žák bez daného postupu nevyřešil. A žák musí vysvětlit, jak mu postup pomohl (s. 93, 95).
- **Experimentování a zkoumání mají jiná pravidla důkazu.** Experiment se ověřuje pozorováním a měřením, zkoumání argumentací podle kritérií z analýzy chyb (s. 53, 98).
- **Úloha na experimentování** má chtít popis postupu i použitých principů: proč hypotéza, jak ji pokus testuje, jak výsledek souvisí s hypotézou (s. 161).
- **Každý proces má dvě varianty.** Znalost se buď použije k řešení, nebo se řeší problém týkající se samotné znalosti (s. 119–120).

### Úroveň 5: Metakognice

| Proces | Podle čeho poznat, že žák cíl splnil | s. |
|---|---|---|
| Stanovení cílů | Cíl má konkrétní znak dokončení, plán, potřebné zdroje, přibližný časový rámec a milníky. | 102, 161 |
| Sledování průběhu | Před úkolem si stanoví cíl. Během práce popisuje, co funguje, co ne a co změní. | 102–103, 162 |
| Sledování jasnosti | Přesně pojmenuje, čemu nerozumí a co tu nejasnost způsobuje. | 104–105 |
| Sledování přesnosti | Svůj úsudek o tom, co má správně, doloží vnějším zdrojem. | 105–106 |

**Na co si dát pozor:**
- **Stanovení cíle bez plánu nestačí.** Odpověď „budu se víc snažit" kniha za stanovení cíle nepovažuje (s. 102).
- **U jasnosti platí, že čím konkrétněji žák pojmenuje, čemu nerozumí, tím hlubší je jeho metakognice.** Kniha srovnává:
  - mělčí: „nevím, jak vycentrovat text",
  - hlubší: „nechápu, jak vycentrovat řádek uprostřed dokumentu, aniž bych přišla o nastavené okraje" (s. 105).
- **U postupů je potřeba sledování průběhu navodit.** Žák si stanoví krátkodobý cíl a postup provádí (s. 103).
- **Změna cíle není selhání.** Cíle je často potřeba upravit podle okolností (s. 161).
- **Jasnost a přesnost jsou dvě různé věci.** Žák může mít v něčem jasno, a přesto se mýlit (s. 105).

### Úroveň 6: Já-systém

| Proces | Podle čeho poznat, že žák cíl splnil | s. |
|---|---|---|
| Důležitost | Určí, jak je pro něj znalost důležitá, vysvětlí proč a posoudí, jak logická je jeho úvaha. | 108 |
| Účinnost | Určí, nakolik věří, že se v dané znalosti zlepší, vysvětlí proč a posoudí, jak logická je jeho úvaha. | 108–109 |
| Emoční reakce | Pojmenuje emoci, kterou se znalostí spojuje, najde myšlenky nebo zkušenosti, ze kterých vychází, a posoudí, jestli jsou rozumné. | 110–111 |
| Motivace | Zohlední důležitost, účinnost i emoce a určí, který z těchto faktorů jeho motivaci ovlivňuje nejvíc. | 111–112 |

**Na co si dát pozor:**
- **Nestačí přesvědčení jen pojmenovat.** Žák má vysvětlit, na čem stojí, a posoudit, jak logické je. Kniha k otázkám proto přidává doplněk „jak logické je tvoje uvažování?" (s. 108).
- **U emoční reakce není cílem emoci změnit, jen jí porozumět** (s. 111).
- **Hodnotí se kvalita reflexe, ne to, jakou emoci nebo jak velkou motivaci žák má** (naše, vychází z s. 108–111).

---

## 3. Jak se kritéria liší podle druhu znalosti

| Úroveň | Informace | Myšlenkové a psychomotorické postupy |
|---|---|---|
| 1 | Jen rozpoznání a vybavení. | Rozpoznání a vybavení prokazují znalost *o* postupu. Zvládnutí prokáže až provedení bez podstatné chyby. |
| 2 | Integrace: podstatné vs. nepodstatné, u principů vztah proměnných. Symbolizace: organizér nebo graf. | Integrace: kroky, pořadí a jeho logika. Symbolizace: diagram toku činnosti. |
| 3 | Analýza chyb: podloženost tvrzení a chyby v úvaze. | Analýza chyb: chyby v provedení a přínos jednotlivých kroků. Třídění dovedností: jen nadřazená kategorie. Specifikace: jak se postup změní za jiných podmínek. |
| 4 | Znalost slouží jako podklad nebo kritérium řešení. | Postup slouží jako nástroj. Úkol ho musí nezbytně vyžadovat a žák vysvětlí, jak pomohl. U psychomotoriky jde u rozhodování většinou o volbu nejvhodnější dovednosti. |
| 5 | Sledování průběhu: jak se porozumění vyvíjí v čase. | Sledování průběhu: v reálném čase během provádění. |
| 6 | Prakticky stejné ve všech doménách. | Prakticky stejné ve všech doménách. |

---

## 4. Podklady pro analýzu chyb u informací

### Prvky dobře podloženého tvrzení (Toulmin, s. 46–47)

Žák nemusí znát odborné názvy. Má ale vědět, že platné tvrzení:
- **je podložené** (důvody),
- **uvádí, odkud podložení pochází,** a vysvětluje ho (oprávnění),
- **zdůvodňuje, proč je podložení důvěryhodné** (opora),
- **přiznává výjimky a míru jistoty** (výhrady).

### Čtyři skupiny chyb v úvaze (obr. 6.3, s. 155–156)

| Skupina | Typy chyb |
|---|---|
| **Chybná logika** | rozpor (tvrzení si odporují); zobecnění z výjimky; falešná příčina (časová následnost zaměněná za příčinu nebo zjednodušení příčin); kruhový argument; uhýbání od tématu; argument z neznalosti („nikdo nedokázal opak"); přenos vlastnosti části na celek nebo celku na část |
| **Útoky** | otrávení studny (všechno, co odporuje vlastnímu názoru, se předem odmítne); útok na osobu místo na argument; hrozba silou |
| **Slabé zdroje** | zdroje zatížené předsudky (přijímám jen to, co potvrzuje můj názor); nedůvěryhodné zdroje; odvolání na autoritu jako poslední slovo; odvolání na většinu („všichni to mají"); odvolání na emoce |
| **Dezinformace** | zkreslená fakta (vynechané podstatné údaje, přeházené pořadí událostí); chybně použitý pojem nebo zobecnění |

---

## 5. Jak kritéria použít v chatbotu a výukové aplikaci (naše doporučení)

- **Rozpoznání lze hodnotit automaticky** (test s výběrem odpovědi). Ostatní procesy úrovně 1 a 2 potřebují kontrolu správnosti a úplnosti vůči redakčnímu kontraktu konceptu: povinné body, kanonická odpověď, zakázaná tvrzení a časté miskoncepce.
- **Od úrovně 3 výš chatbot hodnotí i úvahu.** Má si vyžádat zdůvodnění, pokud chybí, a posoudit ho podle kritérií daného procesu.
- **U úrovní 5 a 6 hodnotí konkrétnost, doložení a promyšlenost reflexe.** Nehodnotí obsah žákových emocí ani výši motivace. Data z těchto úrovní se týkají nezletilých a jsou citlivá, proto by se neměla ukládat jako trvalý signál o žákovi.
- **Kritéria a protokoly mají jinou roli.** Kritéria říkají, jak výsledek hodnotit. Protokoly z kapitoly 6 (s. 151–165) říkají, jakou nápovědu dát žákovi, který se zasekl. Tinybot je může nabízet jako postupné nápovědy.
- **Výkonnostní laťku doplnit zvlášť.** Kolik a jak dobře má žák v daném ročníku zvládnout, patří do výukového cíle.
