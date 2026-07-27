# Popis fungování Glitche

_Kanonický popis fungování Glitche pro tým a autory obsahu. Dřív Google Docs, teď zdroj pravdy tady. Poslední převod: 2026-07-15._
*Kanonický interní popis toho, jak Glitch funguje. Sjednocuje dřívější návrhový dokument, upřesnění typů obsahu a struktury Questu a teoretickou páteř z paperu p-book (Kordík & Nečasová, RecSys '26). Slouží týmu a autorům obsahu.*

Glitch: <https://glitch-livid-three.vercel.app/>Mapa informatických konceptů (framework pro obsah Glitche): <https://knowledge-map-glitch.vercel.app/>

## Co je Glitch
Glitch je vzdělávací sociální síť pro žáky a studenty (zhruba teenagery) i dospělé. Navenek vypadá a ovládá se jako sociální síť — vertikálně swipovaný feed celoobrazovkových karet — ale je postavená proti logice mainstreamových sítí. Core celého návrhu: Glitch má být **zároveň zábavný i prospěšný**. Smyčku zapojení napojujeme na pokrok v učení a zlepšování se, ne na sociální srovnávání a podobné negativní metriky. Kde mainstream udrží pozornost za cenu wellbeingu, my hledáme návyk, který je v souladu se skutečným učením.

## Základní jednotka: Glitch
Glitch = jedna celoobrazovková karta ve feedu. Technicky je to jeden Markdown soubor: frontmatter (YAML) nese strojová data (identifikace, kvíz, konfigurace, metadata), tělo nese delší text pro uživatele, redakci a chatbota. Karta se podle typu buď rovnou splní a scrolluje se dál, nebo se dá rozkliknout do hloubky a otevřít konverzaci s chatbotem.

## Obsahový model: kontrakt, podání, fasety
Glitch přebírá obsahový model p-book, který odděluje **co** se má naučit od **jak** se to podává:

  - **Kontrakt (concept).** Strojově čitelná jednotka porozumění: výukový cíl, povinné body, jedna kanonická otázka s odpovědí a zakázaná tvrzení / miskoncepce. Kontrakt vlastní a schvaluje redakce (člověk) a každé podání — lidské i generované — se proti němu kontroluje. Beze změny kontraktu se nesmí změnit, co Glitch učí.
  - **Podání (telling).** Jedna konkrétní realizace kontraktu, otagovaná na řízených **fasetách**: svět příkladu (lens), hloubka, vizualita, formalismus, délka, žánr, jazyk. Doporučovací systém vybírá vždy jen z podání, která splňují kontrakt. Jeden kontrakt může mít víc podání.
  - **Source of truth.** Ověřená fakta v metainfo, ze kterých chatbot čerpá.

U každé **fasety** je pevný krátký seznam povolených hodnot (tagů), ze kterého se vybírá — ne volné tagy, které si každý autor vymyslí po svém. U hloubky třeba jen úvod / standard / technická / výzkumná, nic mezi tím. Kdyby se tagovalo volně, rychle vznikne nepořádek (jeden napíše „vizuální", druhý „s obrázky", třetí „graficky", a je to totéž) a doporučovací systém se nemá čeho chytit. Pevný seznam naopak dělá tři věci naráz: systém přesně ví, s čím pracuje; je to hotová nabídka, ze které se dá zadat vygenerování nové verze („udělej to vizuálněji, na příkladu z e-shopu"); a je to mapa, kde je vidět, co už je pokryté a co chybí. Přidat do seznamu novou hodnotu proto smí jen redakce.

Jedno podání navíc nemusí sedět na jediný bod, ale na rozsah: vysvětlení „polehoučku" obslouží začátečníka i mírně pokročilého, jedna animace sedí na víc světů příkladů. Když tedy dítě řekne „chci to jednodušeji", systém hledá podání, které tuhle úroveň pokrývá — ne přesnou shodu, ale překryv.

Platí přitom dělba práce: za to, co je pravda a co Glitch učí, ručí a schvaluje redakce (člověk); popisné štítky (jak je to hluboké, vizuální, jaký žánr) může udržovat a doplňovat AI. Člověk hlídá pravdu, AI drží pořádek ve štítcích.

## Struktura obsahu: Glitch → Quest (Kapitola) → Téma
Glitche se sdružují do Questů (tematických celků = kapitol), ty do širších témat. Glitche v Questu jsou lineárně řazené a to řazení sleduje **Bloomovu taxonomii**: Quest začíná znalostními Glitchi (zapamatovat, porozumět), postupně přechází ke konsolidačním a aplikačním (aplikovat, analyzovat, hodnotit, tvořit). Jeden Quest tak vede dítě od „vím, co to je" k „umím to použít a postavit".

Aplikační polovina Questu není jeden krok, ale sekvence: nejdřív konsolidační / artikulační slot (typ Nauč Tinyho, kde dítě koncept vysvětlí botovi a ubrání ho proti miskoncepcím), pak tvůrčí slot (Basic Glitch „postav to", kde dítě vytvoří vlastní artefakt). Platí: učit ≠ aplikovat — vysvětlení nenahrazuje tvorbu, předchází jí. Bloomův oblouk je doporučený skeleton, ne povinné schéma; čistě dovednostní Questy konsolidační krok mít nemusí. Pozici Glitche v oblouku nese pole v metainfo, aby ji znalo řazení Questu i doporučovací systém.

## GlitchFeed
Hlavní feed, kde se Glitche zobrazují. Řídí se několika nepřekročitelnými zásadami, které ho odlišují od nekonečného scrollu:

  - **Denní limit 20 Glitchů.** Po kartě Shrnutí feed pro daný den končí. Žádný nekonečný scroll — dokončení dne je událost, ne díra bez dna. Po dokončení relace 20 Glitchů s uživatel může vátit k těm, které viděl a vybrat si zpětně, že některé splní.
  - **Časovače jsou vždy opt-in.** Dítě si je může zapnout, nikdy nenaskočí samy.
  - **Žádné srovnávání mezi uživateli.** Statistiky jsou pouze osobní; žádné lajky ani žebříčky.
  - **Wellbeing karty jsou součást feedu, ne přeskočitelný bonus.** Denní check-in nálady (mood selector) a krátká cvičení jsou přímo ve feedu; hodnota nálady navíc personalizuje výběr Glitchů pro daný den.

Poznámka k paradigmatu: p-book nechává čtenáře volit mezi čtyřmi způsoby konzumace (příběhové questy, karusely, doporučovaný feed, mapa) a přepínat mezi nimi. Glitch se u své primární plochy vědomě rozhodl pro **jeden ohraničený, klidný feed**. Ostatní paradigmata (mapa Questů, příběhová sekvence, hry) jsou možné rozšíření, ne výchozí stav.

## Typy obsahu
Obsah se dělí do typů (= složky v glitches/):

1.  **Basic Glitch** — jádro vzdělávacího obsahu; nejuniverzálnější typ, unese znalostní výklad i aplikační tvorbu („postav to"). Rozklik, chatbot, fork.
2.  **Rychlá výzva** — nerozklikávací kognitivní rozcvička; dítě splní výzvu přímo na kartě a scrolluje dál.
3.  **Wellbeing** — interaktivní karty (mood check-in, dýchání, aktivita); součást feedu.
4.  **Fun fact** — rozklikávací zajímavost bez úkolu, pro zpestření.
5.  **Najdi chybu** — rozklikávací Glitch pro kritické myšlení a prebunking; dítě odhalí chybné tvrzení.
6.  **Historická osobnost** — seznámení s osobností oboru + konverzace s AI personou.
7.  **Argumentuj** — rozklikávací Glitch, kde dítě obhajuje postoj v debatě s AI personou (argumentační partner).
8.  **Inspirace** — wellbeing typ s chatbotem: ukázková vizualizace dat + vstupní pole; z konverzace s Glitchee vzniká projekt (Tvé projekty).

Systémové karty (Welcome, Shrnutí) nejsou obsah — jsou součást aplikace a nemají složku.

## Dvě vrstvy: Glitche a Glitchboardy
Glitch stojí na dvou vrstvách, které spojuje jedna mechanika (fork).

**Vrstva 1 — kurátorovaný obsah (učebnice).** Glitche, Questy, Kapitoly a GlitchFeed. Shora navržená, ověřená, strukturovaná vrstva — inspirační proud pro samouky i nová forma učebnice do škol.

**Vrstva 2 — Glitchboardy (portfolio + pracovna).** Inspirováno Are.na. Každý žák si staví vlastní Glitchboardy — sbírky, do kterých si forkne Glitche, které ho zaujaly, a kolem nich staví vlastní práci. Board je zároveň portfolio (co jsem zvládl a vytvořil), zápisník (jak si to organizuju) i pracovna (kde na tom dělám). Uvnitř boardu žije chatbot, který dítěti pomáhá studovat a radí s projektem. Kromě osobních boardů existují skupinové boardy pro spolupráci se skupinovým chatbotem — nositel sounáležitosti a peer learningu, ne soutěže.

## Fork a úrovně vypracování
Most mezi vrstvami jsou dvě mechaniky pod jedním tlačítkem:

  - **Connect (pro kurátorský obsah).** Když si žák přidá Glitch do svých boardů, není to kopie — je to pořád tentýž Glitch žijící na více místech (model Are.na). Aktualizace obsahu se promítne všude a Glitch akumuluje kontext.
  - **Fork (pro žákovskou práci).** Když žák naváže na cizí board, vezme si jeho práci jako výchozí bod a jde vlastním směrem — se zachovanou viditelnou linií k originálu (remix tree ze Scratche / fork z GitHubu). Sdílení tu neznamená „lajkni mi to", ale „postav na tom dál".

Při forku si žák volí **úroveň vypracování** — jednoduchá / střední / master. Trefuje to tři pedagogické principy najednou: autonomii (žák si volí náročnost), flow (výzva mírně nad aktuální úrovní) a diferenciaci ve třídě (jeden Glitch obslouží slabšího i nadaného). Úroveň je informace pro žáka a učitele, jak hluboko dítě šlo — ne veřejný odznak. Vyšší úroveň neodemyká status, ale zajímavější tvorbu (lepší věc do portfolia).

## Chatbot
Chatbot vystupuje ve dvou režimech: v Glitchi (mluví s dítětem o tématu karty) a v Glitchboardu po forku (omezený na kontext forknutého Glitche). Čerpá z ověřených faktů (source of truth) a řídí se scaffoldingem z kontraktu — nevysvětluje líp, ale doptává se tak, aby na věc přišlo dítě samo (Vygotského zóna nejbližšího vývoje). Úrovně vypracování hodnotí formativně **LLM zkoušející**: posuzuje podstatu, doptává se, na vágní odpověď reaguje navazující otázkou místo klíčoslovného skóre a nikdy nesrovnává dítě s ostatními.

## Doporučovací systém a elastický katalog
Doporučovací systém (napojený na produkční recommender-as-a-service) přijde, až bude dost obsahu. Přebírá klíčové rozhodnutí z p-book: **tři věci, které platforma běžně rozhoduje za uživatele — jak se obsah servíruje, jak je každý kus vyprávěn a co vůbec v katalogu existuje — dává uživateli jako symetrické, logované, vratné volby.**

  - **Personalizace formy, ne jen pořadí.** Systém nepersonalizuje jen který Glitch přijde další, ale i jak je stejný koncept podán (fasety). Odmítáme přitom vyvrácenou teorii „učebních stylů" — fasetové afinity jsou preferenční priory pod kontrolou uživatele, ne diagnostické škatulky.
  - **Steering.** Dítě může u každé sekce po přečtení říct „jednodušeji / do hloubky / víc vizuálně / jiný svět příkladu / jiný jazyk". Systém odpoví z kurátorovaného katalogu.
  - **Retrieve before generate (serve-or-mint).** Kurátorovaný obsah má právo první volby; generování je až poslední možnost za explicitní akcí uživatele.
  - **Poctivá absence:** když si dítě řekne o něco, co v katalogu není, systém to rovnou přizná („to zatím nemáme") místo aby tiše podstrčil něco jiného. A protože se každé takové přiznání zapíše, vznikne z nich seznam „co si děti přály a nedostaly" — jasný podklad pro to, co dopsat příště. Je to jako „0 výsledků" ve vyhledávači: samo o sobě to říká, co lidem chybí.
  - **Elastický katalog, metadata-first cold start.** Katalog přestává být pevný inventář a stává se mřížkou možných položek (koncept × podprostor faset). Když se nové podání vygeneruje, rodí se s hustými metadaty a známým poptávajícím segmentem — studený start je vestavěný stav každé nové položky, ne výjimka.
  - **Řízená popularita.** Protože systém umí vyrábět nové verze Glitchů na přání, hrozí, že jich vznikne spousta skoro stejných (deset verzí emergence lišících se slovíčkem). To dělá nepořádek a hlavně rozmělní informaci o tom, co je dobré — když každé dítě vidí jinou verzi, žádná nenasbírá dost ohlasů. Proto systém drží počet verzí na uzdě: nová verze vznikne jen na přání (ne do zásoby); podobné děti dostanou jednu společnou verzi místo každé vlastní; na jednu kombinaci téma + styl smí být jen omezený počet verzí; nové neověřené verze se zkoušejí jen do určité míry; a verze, které nikoho nezaujmou, se po čase vyřadí.
  - **Board a fork jako graf vzdělávacích cest.** Co se forkuje, co se sdružuje, na čí board kdo navazuje — doporučení pak zní „jaký další krok pro tebe" a „s kým tě spojit, protože řeší totéž", ne „co tě udrží u scrollu". Strukturovaná učebnice (Kapitola a Quest, Bloomův oblouk) dává content-based páteř dřív, než máme behaviorální data.
  - **Opakování s rozestupy (spaced repetition).** Už probraná látka se uživateli znovu připomene po chytře zvolené době (nejdřív za pár dní, pak za delší dobu) — právě opakování s odstupem si mozek udrží nejlíp. Tyhle opakovací kartičky naskočí rovnou ve feedu mezi ostatními Glitchi, ne v odděleném procvičování, kam by dítě muselo zvlášť chodit.

## Kurátorství jako služba
Uživatelský obsah získává důvěru po stupních a každý stupeň je explicitní stav položky, na který může servírování podmiňovat. Stav důvěry Glitche: **Core** (redakce) → **Edited** (náš Glitch forknutý a dotvořený uživatelem) → **Community** (vytvořený uživatelem/skupinou) → **Generated** (plně generovaný; zatím otázka do budoucna). Výtvory startují soukromé; sdílení je akce se souhlasem; po žebříčku (community → edited → core) je posouvá jen lidská redakce. Případný tiered certifikát se počítá jen nad lidsky ověřeným Core obsahem, takže spolutvorba rozšiřuje katalog, aniž snižuje certifikovanou laťku.

Redakce je poptávkově řízená — kurátorství jako služba, ne jako rozvrh. Tentýž engine, který řadí obsah čtenářům, řadí práci redakci: komunitní podání se nominují, jakmile je zaujme dost různých čtenářů; logy poctivých absencí tvoří řazený seznam „chtěli, nedostali"; opakující se redakční opravy se destilují do correction ledger, který jede v každém dalším generačním promptu. Do budoucna lze otevřít i samotný inventář konceptů: čtenáři navrhují chybějící koncepty, systém těží nepokrytou poptávku a nechává o návrzích hlasovat dřív, než se napíšou — schválení a zařazení zůstává na člověku.

## Wellbeing, soukromí a bezpečí
Primární uživatelé jsou nezletilí, takže bezpečí má přednost před zapojením.

  - **Relace 24 hodin.** Citlivá data o chování (nálada, soustředění, pozornost) má Glitch uložená jen po dobu relace, pak je maže. Data s výsledky žáků citlivá nejsou — slouží formativnímu hodnocení posunu a jdou do profilu v Glitch i Tiny (pokud má uživatel účet také v Tiny).
  - **Editovatelný profil (open learner model).** Odvozený preferenční profil se ukazuje srozumitelně, dá se přímo upravit a explicitní volba vždy přebije odvozenou.
  - **Viditelnost boardů ve třech úrovních, default soukromý.** Soukromý / veřejný ve třídě (garantovaný učitelem) / veřejný úplně. Nejvyšší soukromí je výchozí stav (age-appropriate design, GDPR); veřejnost je vědomá akce.
  - **Postupné odemykání, ne za body.** Plná veřejnost se odemyká postupně podle bezpečného chování v čase (model trust levels z Discourse) a prochází garantem a moderací (automatický filtr + lidská moderace + krátká, dětmi srozumitelná pravidla + možnost nahlásit).
  - **Konzervativní gamifikace.** Pro mladé publikum záměrně bez streaků a žebříčků; viditelnost je přesunutá od osoby (vanity) k práci (artefakt). Trvalá dohledatelnost a viditelná linie autorství jsou samy o sobě bezpečnostní prvek.

## Vztah k p-book
Glitch je dětsky orientovaný sourozenec p-book: sdílí obsahový model (kontrakt / podání / fasety), stav důvěry, LLM zkoušejícího, poctivou absenci a serve-or-mint logiku i řízení metadat (fakta vlastní člověk, metadata udržuje AI). Kde p-book učí *o* doporučovacích systémech a nechává čtenáře sahat na všechny tři platformní páky, Glitch tytéž mechanismy používá jako motor vzdělávací sítě napříč obory a přidává vlastní vrstvy: sociální/portfoliovou vrstvu boardů (Are.na + Scratch + GitHub), wellbeing karty, typy obsahu a Bloomem řazené Questy, plus vědomé rozhodnutí pro jeden ohraničený feed místo volby paradigmatu.

Návrh sedí na teorii sebeurčení (autonomie z volby úrovně, formy a organizace; kompetence ze scaffoldingu na míru; sounáležitost ze skupinových boardů), na konstrukcionismus (učím se tvorbou veřejně sdílených artefaktů — Papert), na flow, na mastery learning a na spacing/retrieval literaturu. Proti mainstreamovým sítím se vymezujeme na úrovni samotného designu, ne jen marketingu: engagement napojený na učení místo na status, úspěch měřený pokrokem místo časem v aplikaci, a bezpečí nezletilých řešené jako výchozí stav, ne dodatek.
