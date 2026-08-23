# Old_Popis fungování Glitche

_ARCHIV — starší verze popisu, nahrazená aktuální. Ponecháno pro historii. Dřív Google Docs, teď zdroj pravdy tady. Poslední převod: 2026-07-15._

## Glitch: koncept vzdělávací sociální sítě
*Stavíme Glitch jako kombinaci učebnice a tvůrčí platformy. Inspirace přichází hlavně z Are.na, Scratche (MIT), GitHubu a Khan Academy — u každé mechaniky níže píšu, odkud je vzatá a proč.*

### Glitch jako dvě vrstvy: učebnice + portfolio
Základní myšlenka je rozdělit Glitch na dvě vrstvy, které spolu komunikují přes jednu mechaniku (fork).

**Vrstva 1 — kurátorovaný obsah (učebnice,obsahy vytváříme my).** Tady zůstává všechno, co máme teď: Glitch jako mikrotéma, sdružený do Questů a Kapitol, a GlitchFeed jako hlavní feed. Tahle vrstva je shora navržená, ověřená, strukturovaná. Je to zároveň inspirační proud pro samouky i nová forma učebnice do škol.

**Vrstva 2 — boardy (portfolio + pracovna).** Inspirováno Are.na. Každý žák si staví vlastní boardy — sbírky, do kterých si „forkne" Glitche, které ho zaujaly, a kolem nich staví vlastní práci. Board je tím pádem zároveň portfolio (co jsem se naučil a vytvořil), zápisník (kam si to organizuju po svém) a pracovna (kde na tom dělám). A klíčové: uvnitř boardu žije Tinytbot, který dítěti pomáhá studovat a radí mu s projekty.

Most mezi vrstvami je fork. Obsah teče z učebnice do osobních boardů a z boardu do boardu. Tím se z pasivní konzumace stává aktivní tvorba a kurátorství..

### Fork není jen jeden, jsou to dvě různé mechaniky
**Pro kurátorský obsah (Glitch z učebnice) → model „connect" z Are.na.** Tady nechceme kopii. Když si žák přidá Glitch „jak strukturovat prompt" do tří svých boardů, má to být pořád tentýž Glitch žijící na třech místech — ne tři zastaralé kopie. Výhoda: když obsah Glitche aktualizujeme, promítne se to všude. A navíc — Glitch si nese seznam všech boardů, kde je připojený, takže časem akumuluje kontext (kdo všechno ho použil a k čemu).

**Pro žákovskou práci (celý board) → model „fork" z GitHubu / „remix" ze Scratche.** Tady naopak kopii chceme. Když žák navazuje na board spolužáka, vezme si jeho práci jako výchozí bod a jde vlastním směrem — ale zůstane viditelná linie k originálu („postaveno na boardu X"). To je ten remix tree ze Scratche.

Prakticky řečeno: Glitch se „připojuje" (sdílí), board se „forkuje" (kopíruje s rodičovskou linií). Pro děti to ale můžeme schovat pod jedno tlačítko a jeden srozumitelný pojem.

### Fork na dvou úrovních
**Fork Glitche.** Žáka zaujme Glitch ve feedu nebo v učebnici a forkne si ho do svého boardu. Od té chvíle kolem něj staví vlastní věci. K dispozici má v boardu Tinybota, který je omezen jen na jedno téma.

**Fork celého boardu.** Jeden žák může forknout board jiného žáka a navázat na jeho práci — vzít, kam to ten první dotáhl, a pokračovat svým směrem. Vzniká tím něco jako „remix tree" ze Scratche: viditelná linie toho, kdo na čí práci stavěl.

Sdílení tady neznamená „lajkni mi to", ale „postav na tom dál" — což je přesně ta zdravá ekonomika, kterou u sítě pro děti chceme. (Na Scratchi je dnes zhruba čtvrtina sdílených projektů remixů cizí práce — ta mechanika reálně funguje a děti ji berou.)

### Nové: úrovně vypracování Glitche při forku
Když si žák forkne Glitch, volí si zároveň úroveň, jak hluboko ho chce zpracovat:

  - **Jednoduchý** — základ. Přečtu, vyplním kvíz, udělám jeden malý úkol.
  - **Střední** — jdu dál. Porovnám přístupy, vyzkouším variantu, něco malého vytvořím.
  - **Master / pro** — plné vypracování. Postavím vlastní projekt, kde téma použiju do hloubky.

Konkrétně na Glitchi „jak strukturovat prompt pro Claude Code": jednoduchý = napiš jeden funkční prompt; střední = porovnej dva přístupy a popiš rozdíl; master = vytvoř si vlastní malou knihovnu promptů a otestuj ji na reálném úkolu.

Trefuje to rovnou tři pedagogické principy najednou. **Autonomii** (žák si sám volí náročnost — teorie sebeurčení), **flow** (může si vybrat výzvu mírně nad svojí aktuální úrovní, což je přesně to pásmo, kde vzniká ponoření) a **diferenciaci ve třídě** (jeden Glitch obslouží slabšího i nadaného žáka, učitel nemusí chystat tři verze). Chatbot v boardu tu má jasnou roli: pomáhá žákovi posunout se z jednoduché úrovně na vyšší — to je scaffolding ve Vygotského zóně nejbližšího vývoje.

**Otázka:** Pokud se „master / pro" stane veřejnou nálepkou hodnoty žáka, vyrobíme si přesně tu statusovou soutěž, které se chceme vyhnout — „já mám pět masterů a ty jen jednoduché". Řešení: úroveň ať je **volba náročnosti vlastní cesty, ne odznak srovnání s ostatními.** Tj. úroveň je vidět hlavně samotnému žákovi a jeho učiteli jako informace o tom, jak hluboko šel, ne jako veřejný žebříček (sedí také k našemu formativnímu přístupu). A pozor na opačné riziko — že si všichni budou volit jen „jednoduchý". Tady pomáhá, když vyšší úroveň neodemyká *status*, ale *zajímavější tvorbu* (lepší věc do portfolia, něco, co se dá smysluplně forknout dál).

### Viditelnost a sdílení
Každý board (i jednotlivý Glitch) má tři úrovně viditelnosti:

  - **Soukromý** — jen pro autora.
  - **Veřejný ve třídě** — sdílení mezi spolužáky bez omezení, garantované učitelem.
  - **Veřejný úplně** — viditelný pro ostatní uživatele sítě.

Ve třídě tedy boardy fungují jako přirozená malá skupina (učitel = garant), a teprve mimo třídu se otevírají širší síti.

K té „veřejný úplně" rovině, u které máš oprávněný pocit, že je trochu nebezpečná — máš pravdu a rešerše to potvrzuje. Tady jsou tři konkrétní pojistky, jak ji udělat bezpečnou, místo abychom ji rušili:

**Default je soukromý, ne veřejný.** Tohle není detail, je to požadavek age-appropriate designu i GDPR — u nezletilých musí být nejvyšší soukromí výchozí stav, ne něco, co si musí dítě složitě zapínat. Veřejnost je vědomá akce.

**Plná veřejnost se neodemyká hned, ale postupně.** Tady přebíráme model „trust levels" z Discourse (diskusní platforma). Nový uživatel je v jakémsi bezpečném „pískovišti" — může pracovat, ale veřejné akce (komentovat cizí boardy, publikovat plně ven) má zamčené. Odemykají se mu postupně podle toho, jak dlouho a jak slušně se v systému chová. Důležité je, že se neodemykají za body ani za výkon, ale za bezpečné chování v čase. Zabudovaná ochrana a postupné zrání v jednom.

**Plná veřejnost projde garantem a moderací.** Než se board nezletilého dostane „úplně ven", měl by projít souhlasem učitele/zákonného zástupce a základní moderací (žádné osobní údaje, žádný nevhodný obsah). Tady se inspirujeme Scratchem, který kombinuje automatický filtr + lidskou moderaci + krátká, dětmi srozumitelná pravidla + možnost cokoli nahlásit.

Mimochodem — všechno tohle je pravý opak modelů typu Unsee nebo Yik Yak, které selhaly přesně proto, že stavěly na mizení obsahu a anonymitě. U nás je trvalá dohledatelnost a viditelná linie autorství (kdo co forknul, kdo na čem staví) sama o sobě bezpečnostní prvek, ne jen pěkná featura.

### Skupinové boardy
Kromě osobních boardů existují skupinové boardy pro spolupráci — několik dětí pracuje společně na jednom boardu a mají k dispozici skupinového chatbota, který jim s projektem pomáhá jako celku. To je nositel sounáležitosti a peer learningu, ne soutěže.

Z rešerše k tomu jeden praktický dodatek: u skupinové práce chceme, aby bylo vidět, kdo čím přispěl (jinak vzniká efekt „vezu se"), ale ne aby z toho byl žebříček. Dobrý vzor je „contribution graph" z GitHubu — ukazuje kontinuitu vlastní práce, takže se žák srovnává hlavně sám se sebou, ne s ostatními.

### Co je Are.na a vlastně funguje
Are.na je „síť na myšlení" — vizuálně minimalistická, pomalá, záměrně bez algoritmu. Používají ji hlavně designéři, výzkumníci a umělci ke sbírání a propojování nápadů. Tři pojmy stačí k pochopení celého modelu:

**Blok** je nejmenší jednotka obsahu. Může to být obrázek, kus textu, odkaz, video, soubor. Jeden konkrétní artefakt.

**Kanál** (channel) je sbírka bloků. V podstatě nástěnka nebo board — přesně to, čemu my říkáme „board". Vypadá to jako mřížka dlaždic. (To, co máš na screenshotu, který jsi mi posílala, je přesně kanál.)

**Connect** je ta klíčová a nejchytřejší mechanika. Jeden blok můžeš „připojit" (connect) do více kanálů zároveň — a není to kopie, je to pořád tentýž blok žijící na více místech. Každý blok si nese seznam všech kanálů, do kterých je připojený. Tím vzniká síť propojení: putuje-li jeden obrázek deseti kanály různých lidí, nabaluje na sebe deset různých kontextů. Hodnota nevzniká z popularity, ale z těchhle juxtapozic — z toho, vedle čeho všeho se daná věc octla. Tahle mechanika je přesně to, co navrhuju použít pro „fork Glitche" v naší první vrstvě.

A teď to, co je pro nás filozoficky nejdůležitější: **Are.na nemá lajky ani oblíbené.** Místo nich má jen „connections" (propojení). Nemá algoritmický feed, nemá reklamy, neživí ji venture kapitál — platí se předplatným (Premium platí necelých 19 tisíc lidí). Spoluzakladatel to shrnul tak, že reklama by nástroj na myšlení znehodnotila a že náš svět je bohatý na informace a chudý na pozornost. Komunita Are.na popisuje tohle jako „výzkum jako odpočinek" — chodí se tam přemýšlet, ne soutěžit o lajky.

Pro Glitch je tahle absence vanity metrik klíčové poučení. Engagement nestavíme na lajcích a sledujících, ale na pokroku v učení a na tom, co kdo postavil. Profil žáka pak není sbírka selfie, ale mapa toho, co zvládl a vytvořil (princip, který funguje třeba na Letterboxdu — „kdo jsi" se pozná z toho, co jsi prošel, ne jak vypadáš).

### Proč to celé dává smysl
Pedagogicky to sedí na konstrukcionismus (učím se tvorbou veřejně sdílených artefaktů, Papert) a na teorii sebeurčení: board dává **autonomii** (organizuju si to po svém, volím si úroveň vypracování), chatbot **kompetenci** (scaffolding přesně na mojí úrovni), skupinové boardy **sounáležitost**.

Pro doporučovací systém je to navíc boží v tom, že boardy jsou bohatý graf: co se forkuje, co se sdružuje na jednom boardu, na čí board kdo navazuje — to je silný signál o vzdělávacích cestách, ne o tom, co lidi udrží u scrollu. Studený start je mírnější, protože strukturovaná učebnice (Kapitola → Quest) dává content-based páteř ještě dřív, než máme jakákoli behaviorální data; collaborative vrstva se pak dostavuje s tím, jak boardy přibývají. A hlavně to umožní měřit úspěch jinak než časem v appce — „jaký Glitch dál pro tenhle board", „s kým tě propojit, protože řeší totéž" — měřeno dokončenými Questy a kvalitou výtvorů, ne počtem lajků.

Metriky pro hodnocení v Tiny mají měřit posun žáka, ne čas, který v aplikaci stráví. Tím se vymezujeme proti mainstreamovým sítím na úrovni samotného designu, ne jen marketingu.
