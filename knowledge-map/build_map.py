# -*- coding: utf-8 -*-
"""Generátor knowledge-map.yaml pro appku Mapa znalostí Glitch.
Sestavuje RVP oblasti, témata a koncepty (dvojí seskupení: tema + rvp_oblast).
RVP znění je doslovně opsané z RVP_revidované_2024-03-28.pdf, s. 54-55."""
import re, unicodedata, yaml, json

# ---- Výukové cíle a kritéria hodnocení (Bloomova taxonomie, v0.11) ----
# Klíč = přesný název konceptu. Zdroj: cile_kriteria_merged.json (7 skupin).
with open('cile_kriteria_merged.json', encoding='utf-8') as _f:
    CILE_KRITERIA = json.load(_f)
_CK_USED = set()

def slug(s):
    s = s.lower()
    s = ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c))
    s = s.replace('&', ' a ')
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

# ---- RVP očekávané výstupy (2. stupeň, 9. ročník) — DOSLOVNÉ znění ----
RVP = {
 'v001': ('INF-INF-001-ZV9-001', 'získá z dat informace, interpretuje data získaná pro řešení konkrétního problému'),
 'v002': ('INF-INF-001-ZV9-002', 'navrhuje a porovnává různé způsoby kódování dat s cílem jejich uložení a přenosu'),
 'v003': ('INF-INF-001-ZV9-003', 'modeluje situace různými způsoby, včetně grafů nebo obdobných schémat'),
 'v004': ('INF-INF-001-ZV9-004', 'natrénuje model strojového učení'),
 'v005': ('INF-INF-002-ZV9-005', 'po přečtení jednotlivých kroků algoritmu vysvětlí celý postup a určí problém, který je daným algoritmem řešen'),
 'v006': ('INF-INF-002-ZV9-006', 'rozdělí problém na jednotlivě řešitelné části a navrhne postupy a algoritmy pro jeho řešení'),
 'v007': ('INF-INF-002-ZV9-007', 'v blokově orientovaném programovacím jazyce vytvoří přehledný program, používá opakování, větvení programu, proměnné'),
 'v008': ('INF-INF-003-ZV9-008', 'posoudí účel a užitečnost informačních systémů, které používá'),
 'v009': ('INF-INF-003-ZV9-009', 'pro řešení problému vytvoří tabulku evidence dat a stanoví pravidla pro práci se záznamy'),
 'v010': ('INF-INF-003-ZV9-010', 'v evidenci dat nastavuje zobrazení dat a používá funkce pro automatické zpracování dat s cílem řešit potřeby uživatelů'),
 'v011': ('INF-INF-004-ZV9-011', 'vybírá pro své potřeby hardware, software a způsob připojení digitálních zařízení do sítě na základě porozumění jejich vlastnostem'),
 'v012': ('INF-INF-004-ZV9-012', 'navrhne základní způsoby zabezpečení zařízení a systémů, se kterými pracuje, na základě posouzení rizik ztráty, poškození či zneužití dat'),
}
ZDROJ_RVP = 'RVP_revidované_2024-03-28.pdf, s. 54–55'

# ---- RVP oblasti (tematické okruhy oboru Informatika) ----
# Popisy okruhů – doslovné znění dodané zadavatelem (charakteristika okruhu + 1. a 2. stupeň).
POPIS_DATA = (
 "S daty pracují počítače i my, když přemýšlíme. Informace zpřesňují naše představy o světě a tím nám pomáhají správně se rozhodovat. Řadu podrobností přitom pomíjíme a pracujeme jen s tím, co je pro danou situaci důležité. Vznikají tak zjednodušující reprezentace, modely. Abychom je mohli ukládat a spolehlivě a levně přenášet a kopírovat, kódujeme je do posloupností znaků – písmen, nul a jedniček atp.\n\n"
 "V informatice se žák učí nejen využívat hotové modely, ale také vytvářet nové. Postupuje při tom cílevědomě, sleduje záměr vyřešit daný problém, hledá rovnováhu mezi rozsahem a složitostí modelu a jednoduchostí jeho použití. Hodnotí spolehlivost získávaných informací a míru jistoty, s jakou se podle nich může rozhodovat. Nalézání efektivních reprezentací složitých skutečností je předpokladem úspěšné komunikace, učení i řešení problémů.\n\n"
 "Na 1. stupni si žák začíná všímat dat kolem sebe a reflektuje, jak mu mohou být užitečná. Tvoří první schematické modely situací a využívá je k získání informací.\n\n"
 "Na 2. stupni už se žák seznamuje s pokročilejším kódováním a modely, které sám tvoří, včetně grafů a trénování modelů strojového učení. Zvyká si na to, že informace jsou správné jen s určitou pravděpodobností."
)
POPIS_ALGO = (
 "Žák se prováděním postupů učí získávat výsledky konkrétních úloh. V informatice pak zaměřuje pozornost na postupy jako takové. Zjišťuje, jak se postupy vedoucí ke stejným výsledkům mohou mezi sebou lišit, tvoří a popisuje postupy vlastní. Všímá si toho, že některé jsou spolehlivější než jiné a co tu spolehlivost určuje. Jejich kvalitní formulace může vyřešit celou skupinu podobných problémů.\n\n"
 "Postupy žák zapisuje i jako programy, čímž se učí pracovat s omezenou sadou instrukcí a doslovnou interpretací svých výstupů. Kromě toho získává povědomí o základech fungování běžně používaných aplikací. Cílevědomé plánování pracovních postupů je příležitost k rozvoji strukturovaného přístupu k řešení problémů. Jejich jednoznačný a úsporný popis vyžaduje komunikační dovednosti. Automatizovatelnost postupů je předpokladem uplatnitelnosti v práci a podnikání.\n\n"
 "Na 1. stupni žák zkoumá souvislosti vstupů, podmínek, postupů a výstupů, navrhuje jednoduché posloupnosti kroků a zažívá, jak může programováním určovat chování stroje.\n\n"
 "Na 2. stupni se žák setkává se složitějšími problémy, do programování přibývají další řídicí struktury. Všímá si výhod a důsledků automatizace svých postupů."
)
POPIS_IS = (
 "Řadu potřeb společnosti pomáhají plnit informační systémy. Lidé je nevyhnutelně využívají, vypořádávají se s jejich nedostatky, mají požadavky na jejich chování. Většina lidí také nějaké evidence sama tvoří, v osobním i pracovním životě (seznam k balení na výlet, evidence zakázek k vyřízení). Výhodu v tom mají ti, kteří mají na základě praktické zkušenosti představu o tom, jak takové systémy vnitřně fungují, jak se vyvíjejí, co mohou pomoci řešit a co už nikoli. Iterativní vývoj a testování řešení se zaměřením na potřeby klienta je znakem užitečných podniků. Uživatelské rozhraní informačních systémů je komunikačním kanálem. Důsledky fungování řady systémů ovlivňují celou občanskou společnost.\n\n"
 "Na 1. stupni žák začíná informační systémy zkoumat. Kromě práce s uživatelským rozhraním se učí orientovat i přímo v tabulkách a podobných strukturách.\n\n"
 "Na 2. stupni žák svůj průzkum prohlubuje a kromě významu pro uživatele precizněji popisuje, co přesně systémy dělají. Pro řešení konkrétních problémů tvoří také vlastní evidence dat."
)
POPIS_DT = (
 "Digitální technologie poskytují konkrétní příklady principů, které žák zkoumá v ostatních okruzích. Dohromady se tak žák učí rozumět tomu, jak technologie a svět kolem něj fungují a jaké to má praktické důsledky. Je to jedním z předpokladů pro to, aby je mohl bezpečně a efektivně využívat v běžném životě. Porozumění principům fungování technologií mimo jiné umožňuje hodnotit, jak ovlivňují společnost a jak jejich provoz dopadá na životní prostředí. Rozšiřuje možnosti žáků využívat je k rutinní i tvořivé práci.\n\n"
 "Na 1. stupni se žák zaměřuje na základní porozumění funkcím digitálních technologií, jejich vhodné využití pro řešení problémů a na pravidla bezpečného používání aplikací a sítí.\n\n"
 "Na 2. stupni se výuka prohlubuje o další technické znalosti a dovednosti, které umožní poučeně vybírat hardware, software a propojení do sítě a řešit pokročilejší problémy. Kromě bezpečnosti se žák v bohatých souvislostech věnuje také inovacím."
)
RVP_OBLASTI = [
 ('data-modelovani', 'Data, informace a modelování', 'INF-INF-001', POPIS_DATA, '#ffff00'),
 ('algoritmizace', 'Algoritmizace a programování', 'INF-INF-002', POPIS_ALGO, '#ffffff'),
 ('informacni-systemy', 'Informační systémy', 'INF-INF-003', POPIS_IS, '#ffff00'),
 ('digitalni-technologie', 'Digitální technologie', 'INF-INF-004', POPIS_DT, '#ffffff'),
]

# ---- Klíčová kompetence digitální (KDI) – TŘETÍ, průřezová logika členění ----
# Nezávislá osa vedle témat a okruhů RVP. Znění výstupů doslovné dle zadání.
KDI_POPIS = "Klíčová kompetence digitální představuje soubor znalostí, dovedností a postojů, které umožňují žákům účelně, bezpečně a efektivně využívat digitální technologie při práci, při učení, ve volném čase i při zapojování do společnosti a občanského života, aktivně a respektujícím způsobem se podílet na utváření digitálního světa a nacházet rovnováhu mezi světem digitálním a fyzickým."
KOMPETENCE = [
 ('kdi-dat', 'Digitální informace a data', 'KDI-DAT-000-ZV9-001',
  'Data získaná na základě vlastních kritérií a formulovaných dotazů z různých digitálních zdrojů posuzuje z hlediska souladu s již známými poznatky i nároku na spolehlivost zdroje.', '#ffff00'),
 ('kdi-zap', 'Zapojení do společnosti prostřednictvím digitálních technologií', 'KDI-ZAP-000-ZV9-001',
  'Účelně a uvážlivě sdílí data a informace v digitálním prostředí s cílem osobního růstu, podpory školní či zájmové komunity nebo za účelem týmové práce na školních projektech.', '#ffffff'),
 ('kdi-tdo', 'Tvorba digitálního obsahu', 'KDI-TDO-000-ZV9-001',
  'Generuje digitální obsah v různých formátech s cílem umocnit výstupy vlastní tvořivé činnosti.', '#ffff00'),
 ('kdi-bzk', 'Bezpečnost v digitálním prostředí', 'KDI-BZK-000-ZV9-001',
  'Předchází situacím ohrožujícím bezpečnost zařízení a dat nebo jeho tělesné či duševní zdraví.', '#ffffff'),
 ('kdi-vin', 'Digitální vývoj a inovace', 'KDI-VIN-000-ZV9-001',
  'Využívá digitální technologie, aby sobě či ostatním usnadnil či zjednodušil pracovní postupy a zkvalitnil výsledky práce.', '#ffff00'),
]

# ---- Témata (vlastní obsahová struktura Glitch) ----
# (id, nazev, vrstva_mapy, popis, barva, navazuje_na[theme ids])
TEMATA = [
 ('digitalni-zaklady', 'Digitální základy', 0,
  'Digitální základy jsou vstupní vrstva celé mapy — vysvětlují, jak vlastně funguje svět, ve kterém se všechno ostatní odehrává. Žák tu získá mentální model počítače (hardware a software), internetu a sítí (klient–server), cloudu a serverů i toho, jak spolu programy mluví přes API a jak se data kódují, aby šla uložit a přenášet. Nejde o to stát se technikem, ale o demystifikaci: když víš, že „cloud" je jen cizí počítač a že appka volá službu přes API, přestává být digitální svět kouzelná černá skříňka. Na těchto základech pak stojí Tvorba webů, Tvorba aplikací, Data i Umělá inteligence — proto je téma v mapě úplně na začátku.', '#ffffff', []),
 ('informaticke-mysleni', 'Informatické myšlení a algoritmizace', 0,
  'Tohle téma učí univerzální způsob přemýšlení, který je jádrem celé informatiky a nezávisí na žádném programovacím jazyce. Žák se učí rozložit velký problém na menší části (dekompozice), odfiltrovat nepodstatné detaily (abstrakce), všímat si opakujících se vzorů a popsat řešení jako jednoznačný postup krok za krokem (algoritmus) složený ze sekvence, větvení a opakování. Tyhle dovednosti se v mapě vracejí prakticky všude — v programování, práci s daty, robotice i při přemýšlení o AI — proto stojí hned vedle Digitálních základů jako druhý pilíř, na kterém teprve začíná skutečná tvorba.', '#ffff00', []),
 ('programovani', 'Programování', 1,
  'Programování je krok od myšlenky ke kódu, který počítač skutečně vykoná. Žák tu poznává stavební kameny každého programu — proměnné, podmínky, cykly a funkce — a hlavně dovednost ladit, tedy hledat a opravovat chyby. Postupuje od blokového prostředí (Scratch) k textovému jazyku (Python) a učí se pracovat s verzováním i s cizím, dnes často AI vygenerovaným kódem; v éře AI se totiž těžiště přesouvá od „napiš každý řádek ručně" k „rozuměj, uprav a odlaď". Programování navazuje na Informatické myšlení a je branou k tvůrčím tématům mapy — webům, aplikacím, hrám i robotice.', '#ffffff', ['informaticke-mysleni', 'digitalni-zaklady']),
 ('umela-inteligence', 'Umělá inteligence', 2,
  'Umělá inteligence je v mapě samostatné téma, protože prostupuje celou dnešní informatikou — a zároveň se jako průřezová vrstva vrací u mnoha dalších témat. Žák se tu učí, co AI je a co není, jak se učí z dat a proč generativní modely umí „halucinovat", jak s AI účelně pracovat (prompty, ověřování výstupů) a jak ji používat kriticky a eticky (bias, soukromí, kdy AI raději nepoužít). Řídící myšlenkou je „ověřuj, ale využívej" a vědomí, že rozhoduje pořád člověk, ne nástroj. Téma staví na Digitálních základech a úzce se prolíná s Daty, protože kvalita dat určuje, co z AI vypadne.', '#ffff00', ['digitalni-zaklady', 'data-databaze']),
 ('data-databaze', 'Data, databáze a datová gramotnost', 1,
  'Data jsou surovinou informací i palivem umělé inteligence, a tohle téma učí s nimi zacházet — od kritického čtení až po technické uložení. Žák pochopí datový cyklus (sběr → čištění → analýza → vizualizace → interpretace), naučí se volit správný graf, evidovat data v tabulkách a databázích a klást jim otázky (SQL). Velký důraz je na datové gramotnosti: poznat zavádějící graf, rozdíl mezi korelací a kauzalitou i to, odkud data pocházejí a co v nich chybí. Právě datová gramotnost je předstupněm gramotnosti v AI, takže tohle téma tvoří s Umělou inteligencí provázané jádro celé mapy.', '#ffff00', ['digitalni-zaklady']),
 ('tvorba-webu', 'Tvorba webů', 1,
  'Tvorba webů je jedno z nejvděčnějších témat, protože vede k hmatatelnému, sdílitelnému výsledku — vlastní stránce na internetu. Žák pozná, jak web funguje (klient–server), i tři základní vrstvy stránky: strukturu (HTML), vzhled (CSS) a interaktivitu (JavaScript), a naučí se web publikovat přes doménu a hosting. V éře AI k tomu přibývá dovednost pracovat s nástroji, které web vytvoří z popisu — a umět jejich výstup přečíst, upravit a posoudit. Téma staví na Programování a přirozeně vede k Tvorbě aplikací.', '#ffffff', ['programovani']),
 ('tvorba-aplikaci', 'Tvorba aplikací a vibecoding', 1,
  'Tvorba aplikací ukazuje, jak z nápadu vznikne funkční appka — a je to možná nejsilnější motivační téma éry AI. Žák pochopí rozdíl mezi tím, co vidí (frontend) a co běží na pozadí (backend), vyzkouší no-code nástroje i „vibecoding", kdy popíše záměr přirozenou řečí a AI napíše kód. Klíčové poselství tématu je, že AI je programovací parťák, ne náhrada porozumění: bez znalosti základů snadno vznikne „iluze, že to umím", dokud se něco nerozbije. Téma spojuje Programování, Tvorbu webů a Umělou inteligenci dohromady.', '#ffffff', ['programovani', 'tvorba-webu', 'umela-inteligence']),
 ('tvorba-obsahu', 'Tvorba digitálního obsahu s AI', 1,
  'Tohle téma je o tvorbě obrazu, videa, hudby a hlasu s generativními nástroji — o oblasti, kterou AI proměnila nejdramatičtěji. Žák se učí „mluvit" s nástroji přes prompt, ale i to, že vkus a základ vizuálního jazyka (kompozice, barva, typografie) AI nenahradí — pořád musíš umět posoudit, jestli je výsledek dobrý. Neoddělitelnou součástí je etika a autorství: na čích dílech se model učil, komu patří výstup a jak poctivě označit AI obsah, plus obezřetnost kvůli deepfakes. Téma staví na Umělé inteligenci a s ohledem na bezpečí nezletilých se dotýká i Kyberbezpečnosti.', '#ffff00', ['umela-inteligence']),
 ('herni-vyvoj', 'Herní vývoj', 1,
  'Herní vývoj je vnitřně motivující téma — žák tvoří to, co sám hraje, a výsledek jde hned sdílet. Od blokového Scratche se posouvá k lehkým i skutečným enginům (Godot, Unity) a poznává základní stavbu hry: herní smyčku, objekty, kolize, stavy a hlavně herní design (pravidla, obtížnost, zpětná vazba, „flow"). AI dnes umí generovat grafiku i kód, takže se těžiště přesouvá od ruční výroby k návrhu a kurátorství. Téma staví na Informatickém myšlení a Programování a je skvělým „hřištěm", kde se tyhle dovednosti spojí do konkrétního výtvoru.', '#ffffff', ['informaticke-mysleni', 'programovani']),
 ('fyzicky-computing', 'Fyzický computing, robotika a IoT', 1,
  'Fyzický computing je programování, které hýbe skutečným světem — kód tu má okamžitý hmatatelný efekt. Na destičce micro:bit se žák naučí číst senzory a ovládat výstupy (LED, motory), postoupí k robotům, Arduinu a Raspberry Pi a k internetu věcí (IoT), kde zařízení posílají data do cloudu. Zvlášť cenné je, že si tu AI osahá fyzicky: v micro:bit CreateAI si sám natrénuje model přímo na zařízení (TinyML). Téma staví na Programování a propojuje ho s Daty i Umělou inteligencí; jeho přirozeným omezením je hardware, takže doma se leccos nahradí simulátory.', '#ffffff', ['informaticke-mysleni', 'programovani']),
 ('kyberbezpecnost', 'Kyberbezpečnost a digitální bezpečí', 3,
  'Kyberbezpečnost učí, jak chránit sebe, svá data a zařízení — a v mapě má zvláštní váhu, protože bezpečí nezletilých je priorita. Žák si osvojí základní hygienu (silná hesla, 2FA, poznat phishing, chránit soukromí) a pochopí i to, jak AI posunula podvody na novou úroveň: deepfake, klonování hlasu a dokonalý phishing bez chyb, takže stará rada „poznáš to podle chyb v textu" už neplatí. Novou obranou je ověřovat informace jinou cestou a zdravá skepse. Téma se úzce prolíná s Digitálním občanstvím a s Umělou inteligencí.', '#ffff00', ['digitalni-zaklady']),
 ('digitalni-obcanstvi', 'Digitální občanství, média a wellbeing', 3,
  'Tohle téma je „severní směr" celého Glitche: učí rozumět tomu, jak fungují sítě a algoritmy, kriticky číst obsah a udržet si zdravý vztah k technologiím. Žák pozná, jak doporučovací algoritmy tvarují, co vidí (bublina, ekonomika pozornosti), jak rozpoznat dezinformace a manipulaci, jakou hodnotu mají jeho data a jak nepodlehnout návykovému designu. Patří sem i občanské minimum o AI (proč modely halucinují a mají bias) a etika jejího používání ve škole. Cílem není technologie zavrhnout, ale používat je vědomě a tak, aby sloužily člověku — což je hodnota, na které stojí celá mapa.', '#ffff00', []),
]

# ---- Koncepty ----
# Každý: (nazev, vrstva, popis, rvp_oblast|None, [rvp klíče], [tagy], [prereq (tema,nazev)], [souvisi (tema,nazev)])
C = {}  # tema -> list

C['digitalni-zaklady'] = [
 ('Hardware a software', 'core', 'Hardware jsou fyzické součástky, na které si můžeš sáhnout (procesor, paměť, displej); software jsou programy, které v nich běží. Každý počítač i telefon přitom pracuje ve smyčce vstup → zpracování → výstup: dostane data, něco s nimi udělá a vrátí výsledek.', 'digitalni-technologie', ['v011'], ['hardware','software'], [], []),
 ('Data a informace', 'core', 'Data jsou holé zaznamenané hodnoty (třeba číslo 21 nebo řada naměřených teplot), informace je jejich význam pro konkrétní situaci („dnes je tepleji než včera"). Stejná data můžou nést různé informace podle toho, na co se ptáš — a umět tyhle dvě věci rozlišit je základ veškeré práce s daty i s AI.', 'data-modelovani', ['v001'], ['data'], [], [('data-databaze','Datová gramotnost')]),
 ('Internet a síť', 'core', 'Internet je obrovská síť propojených počítačů, které si navzájem posílají data. Když otevřeš stránku, tvůj prohlížeč (klient) pošle požadavek počítači, kde stránka „bydlí" (server), a ten mu obsah pošle zpátky — tomuhle vztahu se říká klient–server.', 'digitalni-technologie', ['v011'], ['sit','internet'], [], []),
 ('Cloud a server', 'core', '„Cloud" zní tajemně, ale je to jen cizí výkonný počítač (server) v datovém centru, ke kterému se připojuješ přes internet. Když si ukládáš fotky „do cloudu" nebo píšeš ChatGPT, ve skutečnosti pracuje někde daleko něčí server, ne tvůj telefon.', 'digitalni-technologie', [], ['cloud','sit'], [('digitalni-zaklady','Internet a síť')], []),
 ('API', 'core', 'API je domluvené rozhraní, přes které spolu dva programy „mluví" — něco jako jídelní lístek: řekneš, co chceš, a dostaneš to, aniž bys musel vědět, jak se to v kuchyni připravuje. Přes API získávají appky data z jiných služeb (počasí, mapy) a stejně tak se volá i AI.', 'digitalni-technologie', [], ['api','sit'], [('digitalni-zaklady','Cloud a server')], []),
 ('Reprezentace dat', 'navazujici', 'Počítač uvnitř zná jen nuly a jedničky (bity), takže čísla, písmena, obrázky i zvuk se musí zakódovat do čísel. Různé způsoby kódování se hodí pro různé účely — jiné pro úsporné uložení, jiné pro rychlý a bezchybný přenos po síti.', 'data-modelovani', ['v002'], ['data','kodovani'], [('digitalni-zaklady','Data a informace')], []),
 ('Adresy a protokoly', 'navazujici', 'Aby se zařízení na internetu našla a rozuměla si, používají adresy a dohodnutá pravidla komunikace: doména (seznam.cz) se přes DNS přeloží na číselnou IP adresu a data putují podle protokolu HTTP(S). Je to jako poštovní adresa plus společný jazyk dopisu.', 'digitalni-technologie', [], ['sit','internet'], [('digitalni-zaklady','Internet a síť')], []),
 ('Vrstvy počítače', 'navazujici', 'Počítač je poskládaný z vrstev: úplně dole hardware, nad ním operační systém a nahoře aplikace, kterou používáš. Každá vrstva schová složitost té pod sebou — díky tomu můžeš napsat appku, aniž bys řešil, jak přesně pracuje procesor. Tomuhle skrývání detailů se říká abstrakce.', 'digitalni-technologie', [], ['abstrakce'], [('digitalni-zaklady','Hardware a software')], []),
 ('Operační systém a soubory', 'navazujici', 'Operační systém (Windows, Android, iOS) je program, který řídí celé zařízení a dává ostatním aplikacím přístup k hardwaru. Stará se i o soubory a složky — o to, kam se ukládají tvoje fotky a dokumenty a jak je zase najdeš.', 'digitalni-technologie', [], ['software'], [('digitalni-zaklady','Hardware a software')], []),
 ('Kde jsou data fyzicky', 'navazujici', 'Data z aplikací neleží „někde v internetu", ale na konkrétních serverech na konkrétním místě na světě. Kde přesně jsou, ovlivňuje rychlost (latenci) i to, jaké zákony na ně platí — třeba jestli je chrání evropské GDPR.', 'digitalni-technologie', [], ['cloud','soukromi'], [('digitalni-zaklady','Cloud a server')], [('kyberbezpecnost','Soukromí a digitální stopa')]),
]

C['informaticke-mysleni'] = [
 ('Dekompozice', 'core', 'Rozložení velkého, nepřehledného úkolu na menší kousky, které se dají řešit po jednom. Když plánuješ školní výlet, taky ho rozdělíš na dopravu, ubytování a program — v informatice se to samé dělá s problémy i s programy.', 'algoritmizace', ['v006'], ['dekompozice','mysleni'], [], []),
 ('Abstrakce', 'core', 'Schopnost odfiltrovat nepodstatné detaily a soustředit se jen na to, co je pro řešení důležité. Mapa metra je skvělá abstrakce: neukazuje skutečné vzdálenosti ani ulice, jen to, jak na sebe stanice navazují — přesně to, co potřebuješ.', 'algoritmizace', [], ['abstrakce','mysleni'], [], []),
 ('Rozpoznávání vzorů', 'core', 'Všímání si opakování a pravidelností, které řešení zjednoduší. Když zjistíš, že se v úloze pořád vrací stejný krok, můžeš ho vyřešit jednou a použít znovu — místo abys vymýšlel pokaždé znovu od začátku.', 'algoritmizace', [], ['vzory','mysleni'], [], []),
 ('Algoritmus', 'core', 'Přesný návod krok za krokem, jak něco vyřešit — jako recept nebo postup skládání nábytku. Dobrý algoritmus je jednoznačný: kdokoli (i počítač) podle něj dojde ke stejnému výsledku.', 'algoritmizace', ['v005','v006'], ['algoritmus'], [('informaticke-mysleni','Dekompozice')], []),
 ('Řízení toku', 'core', 'Tři způsoby, jak řídit pořadí kroků: sekvence (dělej popořadě), větvení („když platí tohle, udělej tamto") a opakování (dělej dokola, dokud něco platí). Z těchhle tří stavebních kamenů se dá poskládat každý program.', 'algoritmizace', ['v007'], ['rizeni-toku','opakovani','kdyz-tak'], [('informaticke-mysleni','Algoritmus')], []),
 ('Pseudokód a vývojové diagramy', 'navazujici', 'Způsoby, jak zapsat postup srozumitelně pro člověka ještě předtím, než ho napíšeš v konkrétním programovacím jazyce. Pseudokód je „kód napůl česky", vývojový diagram totéž nakreslené jako schéma se šipkami.', 'algoritmizace', [], ['postup','algoritmus'], [('informaticke-mysleni','Algoritmus')], []),
 ('Logika a booleovské výrazy', 'navazujici', 'Rozhodování v programech stojí na výrocích, které jsou buď pravda, nebo nepravda („má hráč míň než nula životů?"). Ty se spojují spojkami A ZÁROVEŇ (AND), NEBO (OR) a NE (NOT) do složitějších podmínek.', 'algoritmizace', [], ['logika','rizeni-toku'], [('informaticke-mysleni','Řízení toku')], []),
 ('Modelování a simulace', 'navazujici', 'Model je zjednodušený obraz skutečnosti — třeba graf, schéma nebo tabulka — který zachytí to podstatné a zbytek vynechá. Na modelu jde situaci pochopit nebo „přehrát" dopředu (simulovat), aniž bys ji musel zkoušet naostro.', 'data-modelovani', ['v003'], ['model','simulace'], [('informaticke-mysleni','Abstrakce')], [('data-databaze','Vizualizace a volba grafu')]),
 ('Efektivita řešení', 'navazujici', 'Stejný problém jde vyřešit mnoha způsoby, ale ne všechny stojí stejně — liší se počtem kroků, časem nebo pamětí. Rozpoznat, které řešení je „levnější", začne být důležité, jakmile přibude dat nebo uživatelů.', 'algoritmizace', [], ['efektivita','algoritmus'], [('informaticke-mysleni','Algoritmus')], []),
 ('Základní algoritmy', 'navazujici', 'Osvědčené postupy, které se používají pořád dokola, hlavně hledání (najdi prvek v seznamu) a řazení (seřaď podle velikosti). Jsou to takové „klasické recepty" informatiky, které stojí za to znát.', 'algoritmizace', [], ['algoritmus'], [('informaticke-mysleni','Algoritmus')], []),
 ('Hodnocení a analýza chyb', 'navazujici', 'Umět se na hotové řešení podívat kriticky: funguje? kde se láme? proč dělá zrovna tohle? Hledání příčiny chyby (ne jen jejího příznaku) je dovednost, kterou využiješ v programování i kdekoli jinde.', 'algoritmizace', ['v005'], ['ladeni','hodnoceni'], [('informaticke-mysleni','Algoritmus')], []),
]

C['programovani'] = [
 ('Proměnné a datové typy', 'core', 'Proměnná je pojmenovaná „krabička", do které si program ukládá hodnotu, aby s ní mohl dál pracovat (třeba skore = 0). Typ určuje, co je uvnitř — číslo, text, nebo pravda/nepravda — a co se s tím dá dělat.', 'algoritmizace', ['v007'], ['promenne'], [], []),
 ('Podmínky v kódu', 'core', 'Zápis větvení: „když platí podmínka, udělej tohle, jinak tamto" (if/else). Díky němu se program rozhoduje sám — třeba zobrazí „výhra", jen když skóre překročí cíl.', 'algoritmizace', ['v007'], ['kdyz-tak','rizeni-toku'], [('programovani','Proměnné a datové typy')], [('informaticke-mysleni','Řízení toku')]),
 ('Cykly v kódu', 'core', 'Způsob, jak nechat počítač opakovat kroky, místo abys je psal pořád dokola. Cyklus for opakuje danou-krát, cyklus while opakuje, dokud něco platí — třeba dokud hráč neprohraje.', 'algoritmizace', ['v007'], ['opakovani','rizeni-toku'], [('programovani','Proměnné a datové typy')], [('informaticke-mysleni','Řízení toku')]),
 ('Funkce a procedury', 'core', 'Pojmenovaný, znovupoužitelný kousek kódu, který napíšeš jednou a pak už jen „zavoláš", kdykoli ho potřebuješ. Můžeš mu předat vstupy (parametry) a dostat zpět výsledek — tím se kód zkrátí a zpřehlední.', 'algoritmizace', [], ['funkce','dekompozice'], [('programovani','Proměnné a datové typy')], []),
 ('Ladění a testování', 'core', 'Ladění (debugging) je hledání a oprava chyb; testování je ověřování, že program dělá to, co má, i v neobvyklých případech. Chyby k programování patří — dovednost je umět je systematicky najít, ne se jim vyhnout.', 'algoritmizace', ['v005'], ['ladeni'], [('programovani','Podmínky v kódu')], [('informaticke-mysleni','Hodnocení a analýza chyb')]),
 ('Blokové vs. textové programování', 'navazujici', 'Na začátku se programuje skládáním barevných bloků (Scratch), kde nejde udělat překlep. Postupně se přechází k psaní textového kódu (třeba v Pythonu), který je mocnější, ale vyžaduje přesnost.', 'algoritmizace', ['v007'], ['programovani'], [('programovani','Cykly v kódu')], []),
 ('Seznamy a kolekce', 'navazujici', 'Když nestačí jedna proměnná, uloží se víc hodnot najednou do seznamu (třeba jména všech hráčů). S kolekcí pak jde pracovat hromadně — projít ji, seřadit, něco v ní najít.', 'algoritmizace', [], ['data','programovani'], [('programovani','Proměnné a datové typy')], []),
 ('Události', 'navazujici', 'Programy často nečekají v jednom sledu, ale reagují na to, co udělá uživatel — klik, stisk klávesy, dotyk. Takovému stylu „když se stane tohle, spusť tamto" se říká událostmi řízené programování.', 'algoritmizace', [], ['udalosti','rizeni-toku'], [('programovani','Podmínky v kódu')], []),
 ('Knihovny a volání API v kódu', 'navazujici', 'Nemusíš psát všechno od nuly — knihovna je hotový cizí kód, který zavoláš a použiješ (třeba na práci s datem nebo grafy). Přes API se stejně tak volají i vzdálené služby, včetně AI modelů.', 'algoritmizace', [], ['api','knihovny'], [('programovani','Funkce a procedury')], [('digitalni-zaklady','API')]),
 ('Verzování kódu', 'navazujici', 'Git a GitHub ukládají historii změn kódu, takže se vždycky můžeš vrátit k funkční verzi a víc lidí může pracovat na jednom projektu, aniž by si přepsali práci. Je to jako „zpět" a sdílená složka pro programátory dohromady.', 'algoritmizace', [], ['verzovani','spoluprace'], [('programovani','Blokové vs. textové programování')], []),
 ('Čtení a hodnocení AI kódu', 'navazujici', 'Dnes velkou část kódu napíše AI — o to důležitější je umět cizí kód přečíst, pochopit, co dělá, a posoudit, jestli je správný a bezpečný. Bez toho jen slepě věříš něčemu, čemu nerozumíš.', 'algoritmizace', ['v005'], ['ai-prurez','ladeni'], [('programovani','Ladění a testování')], [('umela-inteligence','Ověřování výstupů')]),
 ('Základy objektů (OOP)', 'navazujici', 'Objekt spojuje data a to, co s nimi jde dělat, do jednoho celku (třeba „hráč" má životy i umí skočit). Objektové myšlení pomáhá zorganizovat větší programy tak, aby se v nich dalo vyznat.', 'algoritmizace', [], ['programovani','abstrakce'], [('programovani','Funkce a procedury')], []),
]

C['umela-inteligence'] = [
 ('Co je a co není AI', 'core', 'AI je software, který zvládá úlohy, jež dřív vyžadovaly člověka — rozpoznat obličej, přeložit větu, poradit. Dnešní AI je „úzká": umí skvěle jednu věc, ale nemá vědomí ani porozumění jako člověk; je to velmi šikovný nástroj, ne bytost.', None, [], ['ai'], [], []),
 ('AI se učí z dat', 'core', 'Většina dnešní AI se nenaprogramuje pravidly, ale „natrénuje" na obrovském množství příkladů, ze kterých si sama odvodí vzorce. Proto platí „co do ní vložíš, to z ní vypadne": když jsou trénovací data zkreslená nebo chybná, bude takový i výsledek.', 'data-modelovani', ['v004'], ['ai','data'], [('umela-inteligence','Co je a co není AI')], [('data-databaze','Datová gramotnost')]),
 ('Jak funguje generativní model', 'core', 'Modely jako ChatGPT nevytahují odpovědi z databáze — slovo po slovu předpovídají, co nejpravděpodobněji následuje. Umí proto znít sebejistě i tehdy, když si fakta „vymyslí" (halucinace), protože nesledují pravdu, ale pravděpodobnost.', None, [], ['ai'], [('umela-inteligence','AI se učí z dat')], []),
 ('Doporučovací systémy', 'core', 'Feed na TikToku, YouTube i na Glitchi řídí algoritmus, který ti podle tvého chování vybírá, co uvidíš dál. Pochopit, že tě systém profiluje a proč ti ukazuje zrovna tohle, je první krok k tomu ho ovládat, a ne být ovládán jím.', 'data-modelovani', [], ['ai','data','soukromi'], [('umela-inteligence','AI se učí z dat')], [('digitalni-obcanstvi','Jak fungují algoritmy sítí')]),
 ('Prompt a promptová gramotnost', 'core', 'Prompt je zadání, kterým AI úkoluješ. Není to kouzelné zaklínadlo, ale spíš dialog: čím jasněji popíšeš cíl, kontext a formát a čím víc zadání upřesňuješ, tím lepší výsledek dostaneš.', None, [], ['ai','prompt'], [('umela-inteligence','Jak funguje generativní model')], []),
 ('Ověřování výstupů', 'core', 'AI se plete sebejistě, takže její výstup je návrh, ne pravda. Poznat možnou halucinaci a ověřit tvrzení z druhého, důvěryhodného zdroje je základní dovednost každého, kdo AI používá.', None, [], ['ai','ai-prurez'], [('umela-inteligence','Jak funguje generativní model')], []),
 ('Vlastní agency', 'core', 'I když ti AI radí, rozhoduješ pořád ty. „Agency" znamená vědomí, že jsi to ty, kdo drží řízení a nese odpovědnost — AI je nástroj, který ti pomáhá, ne autorita, které se podřizuješ.', None, [], ['ai','postoj'], [], []),
 ('Kdy AI (ne)použít a disclosure', 'core', 'U každého úkolu se vyplatí zvážit, jestli ti AI pomůže se něco naučit, nebo tě o učení připraví (napíše za tebe úkol, který tě měl něco naučit). K poctivé práci patří i přiznat, kde jsi AI použil.', None, [], ['ai','postoj','etika'], [('umela-inteligence','Vlastní agency')], []),
 ('Bias a férovost', 'core', 'AI přebírá zkreslení (bias) z dat, na kterých se učila — může tak třeba nadržovat jedné skupině lidí. Vědět, odkud se bias bere a jak se projevuje, je nutné, aby AI nerozhodovala nespravedlivě.', None, [], ['ai','etika'], [('umela-inteligence','AI se učí z dat')], []),
 ('Soukromí při práci s AI', 'core', 'Co napíšeš do promptu, se může ukládat nebo použít k dalšímu trénování. Proto do AI nepatří hesla ani osobní či cizí citlivé údaje — vždycky mysli na to, komu vlastně data předáváš.', None, [], ['ai','soukromi'], [], [('kyberbezpecnost','Soukromí a digitální stopa')]),
 ('Pět velkých idejí AI', 'navazujici', 'Přehledný rámec, který shrnuje, co AI umí, do pěti oblastí: vnímání (senzory), reprezentace a usuzování, učení z dat, přirozená interakce s lidmi a společenský dopad. Dává dohromady mapu celého tématu.', None, [], ['ai'], [('umela-inteligence','Co je a co není AI')], []),
 ('Strojové učení prakticky', 'navazujici', 'AI nejlíp pochopíš, když si sám natrénuješ malý model — třeba v Teachable Machine nebo micro:bit CreateAI ho naučíš rozpoznat gesto či obrázek. Projdeš celý postup: nasbírat data, natrénovat, otestovat a vylepšit.', 'data-modelovani', ['v004'], ['ai','ml'], [('umela-inteligence','AI se učí z dat')], [('fyzicky-computing','AI přímo na zařízení (TinyML)')]),
 ('Typy AI úloh', 'navazujici', 'AI úlohy se dělí na pár základních druhů: klasifikace (zařaď do kategorie — spam/ne-spam), predikce (odhadni číslo — třeba cenu) a generování (vytvoř nový obsah — text, obraz). Poznat druh úlohy pomáhá vybrat správný nástroj.', 'data-modelovani', [], ['ai','ml'], [('umela-inteligence','Strojové učení prakticky')], []),
 ('Jak fungují chatboti (LLM, RAG)', 'navazujici', 'Dnešní chatboti stojí na velkých jazykových modelech (LLM) natrénovaných na obrovském množství textu. Aby uměli odpovídat i z konkrétních dokumentů (třeba školních), používají RAG: nejdřív si v datech vyhledají, co se k tématu hodí, a teprve pak odpoví.', None, [], ['ai'], [('umela-inteligence','Jak funguje generativní model')], [('data-databaze','Vektorové databáze')]),
 ('Hlubší etika AI', 'navazujici', 'Za používáním AI stojí etické otázky: neškodit, být spravedlivý ke všem skupinám, být průhledný v tom, jak AI rozhoduje, a myslet i na její energetickou náročnost. Etika není dodatek — patří už do návrhu.', None, [], ['ai','etika'], [('umela-inteligence','Bias a férovost')], []),
 ('Deepfakes a syntetická média', 'navazujici', 'AI umí vyrobit falešné, ale realisticky vypadající video, foto nebo hlas. Vědět, že „vidět neznamená věřit", a znát způsoby ověření původu (vodoznaky jako SynthID, C2PA) je dnes nutná obrana proti podvodům a dezinformacím.', None, [], ['ai','deepfake','bezpeci'], [('umela-inteligence','Jak funguje generativní model')], [('kyberbezpecnost','AI podvody')]),
 ('AI a společnost', 'navazujici', 'AI mění práci, vzdělávání i to, jak vzniká a šíří se informace — přináší příležitosti i rizika (dezinformace, závislost). Být aktivní znamená nejen se přizpůsobit, ale i spolurozhodovat, jak se AI má a nemá používat.', None, [], ['ai','etika','postoj'], [('umela-inteligence','Hlubší etika AI')], []),
]

C['data-databaze'] = [
 ('Datová gramotnost', 'core', 'Schopnost data přečíst, správně pochopit a kriticky posoudit — ne s nimi jen technicky pracovat. Ptáš se: odkud data jsou, kdo je sebral, co v nich chybí a jestli závěr opravdu plyne z čísel. Je to i předstupeň porozumění AI.', 'data-modelovani', ['v001'], ['data'], [], []),
 ('Datový cyklus', 'core', 'Práce s daty je příběh o pěti krocích: sběr → čištění → analýza → vizualizace → interpretace. Když některý přeskočíš (třeba čištění), zkreslíš i výsledek na konci.', 'data-modelovani', ['v001'], ['data'], [('data-databaze','Datová gramotnost')], []),
 ('Strukturovaná vs. nestrukturovaná data', 'core', 'Strukturovaná data mají jasný řád (tabulka s řádky a sloupci), nestrukturovaná ho nemají (volný text, fotky, videa). Každý druh se ukládá i zpracovává jinak — a nestrukturovaných dat je dnes většina.', 'data-modelovani', ['v002'], ['data'], [('data-databaze','Datová gramotnost')], []),
 ('Tabulky a relační model', 'core', 'Nejběžnější způsob, jak evidovat data: tabulky s řádky (záznamy) a sloupci (vlastnosti), propojené přes klíče. Tak fungují školní systémy, e-shopy i většina aplikací „na pozadí".', 'informacni-systemy', ['v009'], ['data','databaze'], [('data-databaze','Strukturovaná vs. nestrukturovaná data')], []),
 ('Vizualizace a volba grafu', 'core', 'Dobrý graf udělá z čísel srozumitelný příběh — ale jen když zvolíš správný typ (spojnicový na vývoj v čase, sloupcový na porovnání) a čteš osy a měřítka. Špatně zvolený nebo zmanipulovaný graf umí naopak klamat.', 'data-modelovani', ['v003','v010'], ['data','vizualizace'], [('data-databaze','Datový cyklus')], []),
 ('Dotazování (SQL)', 'navazujici', 'SQL je jazyk, kterým se databáze ptáš na to, co potřebuješ („vyber všechny žáky z 8.A"). Základní příkazy (SELECT, WHERE, JOIN) umí data filtrovat, propojovat a vybírat z tabulek.', 'informacni-systemy', ['v009','v010'], ['databaze','data'], [('data-databaze','Tabulky a relační model')], []),
 ('Účel informačních systémů', 'navazujici', 'Informační systém je software, který eviduje a zpracovává data pro nějakou potřebu — školní matrika, rezervace, e-shop. Umět posoudit, k čemu systém slouží a jestli je opravdu užitečný, patří k digitální gramotnosti.', 'informacni-systemy', ['v008'], ['data','databaze'], [('data-databaze','Tabulky a relační model')], [('digitalni-obcanstvi','Obchodní modely platforem')]),
 ('Statistická gramotnost', 'navazujici', 'Aby tě čísla nezmátla: korelace (dvě věci jdou spolu) neznamená kauzalitu (jedna způsobuje druhou), malý nebo nereprezentativní vzorek klame a graf jde snadno „natáhnout" k požadovanému závěru. Klíčová občanská dovednost.', 'data-modelovani', ['v001'], ['data','hodnoceni'], [('data-databaze','Vizualizace a volba grafu')], []),
 ('Čištění reálných dat', 'navazujici', 'Skutečná data jsou „špinavá" — chybí hodnoty, opakují se, jsou v různých formátech. Jejich úklid zabere většinu práce a je nudný, ale bez něj vyjde ze sebelepší analýzy nesmysl.', 'informacni-systemy', ['v010'], ['data'], [('data-databaze','Datový cyklus')], []),
 ('NoSQL a dokumentové databáze', 'navazujici', 'Ne všechno se hodí do tabulek — NoSQL databáze ukládají data volněji (třeba jako dokumenty), což se hodí pro obsah, který nemá pevný tvar. Jiný nástroj na jiný druh dat.', 'informacni-systemy', [], ['databaze','data'], [('data-databaze','Tabulky a relační model')], []),
 ('Vektorové databáze', 'navazujici', 'Text nebo obrázek se dá převést na řadu čísel (embedding), která zachycuje jeho význam. Vektorová databáze pak umí hledat podle podobnosti významu, ne podle přesné shody slov — díky tomu chatbot najde odpověď ve vlastních dokumentech (RAG).', None, [], ['databaze','ai'], [('data-databaze','NoSQL a dokumentové databáze')], [('umela-inteligence','Jak fungují chatboti (LLM, RAG)')]),
 ('Programová analýza dat', 'navazujici', 'Když je dat moc na ruční klikání, zpracují se kódem (typicky Python + knihovna pandas). Výhoda: je to rychlé, opakovatelné a doložitelné — kdokoli spustí stejný postup a dostane stejný výsledek.', 'data-modelovani', [], ['data','programovani'], [('data-databaze','Datový cyklus')], [('programovani','Seznamy a kolekce')]),
 ('Analýza dat pomocí AI', 'navazujici', 'Dnes stačí data nahrát a zeptat se běžnou řečí („ukaž trend prodejů po měsících") — AI vygeneruje graf i vysvětlení. O to důležitější je umět posoudit, jestli je výsledek správný, protože AI si i tady umí čísla vymýšlet.', None, [], ['data','ai','ai-prurez'], [('data-databaze','Dotazování (SQL)')], [('umela-inteligence','Ověřování výstupů')]),
]

C['tvorba-webu'] = [
 ('Jak funguje web', 'core', 'Když napíšeš adresu, prohlížeč (klient) požádá server, kde stránka „bydlí", a ten mu pošle její obsah přes protokol HTTP. Web je tahle nekonečná výměna požadavek–odpověď mezi prohlížeči a servery.', 'digitalni-technologie', [], ['web','sit'], [], [('digitalni-zaklady','Internet a síť')]),
 ('HTML', 'core', 'HTML je kostra stránky — určuje, co je nadpis, odstavec, obrázek nebo odkaz. Nejde o vzhled, ale o význam a strukturu obsahu (sémantiku), na kterou se pak „navěsí" všechno ostatní.', None, [], ['web','html'], [('tvorba-webu','Jak funguje web')], []),
 ('CSS', 'core', 'CSS dává stránce vzhled: barvy, písmo, rozvržení. Moderní nástroje (Flexbox, Grid) umí uspořádat prvky tak, aby se stránka hezky přizpůsobila mobilu i velké obrazovce (responzivita).', None, [], ['web','css','design'], [('tvorba-webu','HTML')], []),
 ('Doména a hosting', 'core', 'Aby tvůj web viděl kdokoli, potřebuje „bydlet" na serveru (hosting) a mít adresu, kterou si lidi zapamatují (doménu, třeba mujweb.cz). Dnes to jde i zdarma za pár minut — „publikuj svůj web" je reálný cíl i pro začátečníka.', 'digitalni-technologie', [], ['web','cloud'], [('tvorba-webu','Jak funguje web')], [('digitalni-zaklady','Cloud a server')]),
 ('Interaktivita (JavaScript)', 'core', 'JavaScript stránku oživí — reaguje na kliknutí, mění obsah, počítá. Dělá to tak, že za běhu upravuje strukturu stránky (té se říká DOM), takže se web chová jako aplikace, ne jen jako statický plakát.', None, [], ['web','javascript'], [('tvorba-webu','HTML')], [('programovani','Události')]),
 ('AI-asistovaná tvorba webu', 'navazujici', 'Nástroje jako v0, Lovable nebo Claude Artifacts vytvoří funkční stránku z pouhého popisu za pár vteřin. Těžiště se tím posouvá od „napiš každou značku ručně" k „rozuměj tomu, co vzniklo, uprav to a posuď kvalitu".', None, [], ['web','ai','ai-prurez'], [('tvorba-webu','CSS')], [('tvorba-aplikaci','Vibecoding')]),
 ('Frameworky', 'navazujici', 'U větších webů se nepíše všechno od nuly — frameworky (React a spol.) a knihovny stylů (Tailwind) dávají hotové stavební bloky a řád. Zrychlují práci, ale předpokládají, že rozumíš základům pod nimi.', None, [], ['web','programovani'], [('tvorba-webu','Interaktivita (JavaScript)')], []),
 ('Nasazení webu', 'navazujici', 'Nasazení (deployment) je krok, kdy se web z tvého počítače dostane na internet. Služby jako Vercel, Netlify nebo GitHub Pages to zvládnou pár kliknutími nebo automaticky po každém uložení kódu.', 'digitalni-technologie', [], ['web','cloud'], [('tvorba-webu','Doména a hosting')], []),
 ('Přístupnost a SEO', 'navazujici', 'Přístupnost (a11y) znamená udělat web použitelný i pro lidi s hendikepem (čtečky obrazovky, ovládání klávesnicí); SEO je péče o to, aby web našly vyhledávače. Obojí rozhoduje, kolik lidí se k obsahu vůbec dostane.', None, [], ['web','design'], [('tvorba-webu','HTML')], []),
 ('UX/UI a design webu', 'navazujici', 'UI je to, jak web vypadá, UX to, jak se používá. Dobrý návrh vede uživatele přirozeně k cíli — je srozumitelný, přehledný a nenutí přemýšlet, kam kliknout.', None, [], ['web','design'], [('tvorba-webu','CSS')], []),
]

C['tvorba-aplikaci'] = [
 ('Co je aplikace', 'core', 'Aplikace je program pro konkrétní účel — může běžet v telefonu, v prohlížeči nebo na počítači. Skládá se z části, kterou vidíš a ovládáš (frontend), a z části, která pracuje na pozadí s daty (backend).', None, [], ['aplikace'], [], []),
 ('No-code / low-code', 'core', 'Platformy, na kterých appku poskládáš vizuálně bez psaní kódu (nebo skoro). Jsou skvělou vstupní branou — rychle vytvoříš něco funkčního a pochopíš logiku, než se pustíš do skutečného programování.', None, [], ['aplikace','no-code'], [('tvorba-aplikaci','Co je aplikace')], []),
 ('Logika aplikace', 'core', 'Srdce každé appky: co se stane, když uživatel něco udělá. Řídí ji stavy (v jakém je appka režimu), vstupy (co uživatel zadá) a akce (co se má provést) — dohromady určují, jak se aplikace chová.', 'algoritmizace', [], ['aplikace','rizeni-toku'], [('tvorba-aplikaci','Co je aplikace')], [('programovani','Podmínky v kódu')]),
 ('Vibecoding', 'core', 'Nový styl tvorby: popíšeš přirozenou řečí, co chceš, AI napíše kód a ty ho spíš řídíš a hodnotíš, než píšeš řádek po řádku. Umožní postavit reálnou věc rychle — ale bez porozumění základům snadno uvízneš, jakmile se něco rozbije.', None, [], ['aplikace','ai','ai-prurez'], [('tvorba-aplikaci','Logika aplikace')], [('programovani','Čtení a hodnocení AI kódu')]),
 ('AI nástroje pro tvorbu', 'core', 'Copilot, Cursor, Claude Code, Replit nebo Lovable jsou „programovací parťáci", kteří napovídají, píší i opravují kód. Nejsou náhradou porozumění — jsou to nástroje, které tě zrychlí, když víš, co chceš.', None, [], ['aplikace','ai'], [('tvorba-aplikaci','Vibecoding')], []),
 ('Práce s API a backendem', 'navazujici', 'Aby appka uměla víc než jen zobrazovat, propojí se přes API s dalšími službami a se serverovou částí, která pracuje s daty. Právě tady se z „hračky" stává skutečná aplikace.', None, [], ['aplikace','api'], [('tvorba-aplikaci','Logika aplikace')], [('digitalni-zaklady','API')]),
 ('Databáze a autentizace', 'navazujici', 'Appky si pamatují data (databáze) a musí poznat, kdo je kdo (autentizace — přihlašování). S tím přichází i odpovědnost: chránit hesla a osobní údaje uživatelů.', 'informacni-systemy', [], ['aplikace','databaze','bezpeci'], [('tvorba-aplikaci','Práce s API a backendem')], [('data-databaze','Tabulky a relační model')]),
 ('Životní cyklus vývoje', 'navazujici', 'Aplikace nevznikne jedním skokem — má cyklus: navrhnout, naprogramovat, otestovat, nasadit a vylepšovat. Patří k němu verzování, testování i sbírání zpětné vazby od uživatelů.', None, [], ['aplikace','verzovani'], [('tvorba-aplikaci','Logika aplikace')], [('programovani','Verzování kódu')]),
 ('Publikace do app storů', 'navazujici', 'Aby se hotová appka dostala k lidem, projde publikací — na webu je to nasazení, u mobilů obchody (App Store, Google Play) s jejich pravidly a schvalováním.', None, [], ['aplikace'], [('tvorba-aplikaci','Databáze a autentizace')], []),
 ('Iluze, že to umím', 'navazujici', 'Když za tebe appku „poskládá" AI, snadno vznikne pocit, že to umíš — dokud se něco nerozbije a ty nevíš proč. Proto se vyplatí rozumět základům: ne abys všechno psal ručně, ale abys uměl poznat a opravit, když to selže.', None, [], ['aplikace','ai','postoj'], [('tvorba-aplikaci','Vibecoding')], [('programovani','Ladění a testování')]),
]

C['tvorba-obsahu'] = [
 ('Vizuální jazyk', 'core', 'Základní „gramatika" obrazu: kompozice, barva, kontrast, typografie a formáty. AI ti obrázek vygeneruje, ale rozhodnout, jestli je dobrý a proč, musíš ty — a k tomu potřebuješ vkus a tenhle základ.', None, [], ['obsah','design'], [], []),
 ('Prompt pro média', 'core', 'Kvalita generovaného obrazu, videa nebo hudby stojí a padá s tím, jak dobře je popíšeš — styl, náladu, světlo, tempo, žánr. Je to dovednost sama o sobě: naučit se „mluvit" s nástrojem tak, aby vytvořil, co máš v hlavě.', None, [], ['obsah','ai','prompt'], [('tvorba-obsahu','Vizuální jazyk')], [('umela-inteligence','Prompt a promptová gramotnost')]),
 ('Generativní obraz', 'core', 'Nástroje jako Midjourney, Nano Banana nebo DALL·E vytvoří obrázek z textového popisu za pár vteřin. Otevírá to tvorbu i lidem, kteří neumí kreslit — s tím ale přichází i otázky autorství a etiky.', None, [], ['obsah','ai'], [('tvorba-obsahu','Prompt pro média')], []),
 ('Etika, autorství a označování', 'core', 'U generovaného obsahu je potřeba řešit: na čích dílech se model učil, komu patří výsledek a jak dát najevo, že je obsah vytvořený AI. Poctivé označení AI obsahu se stává standardem i zákonnou povinností.', None, [], ['obsah','etika','ai'], [('tvorba-obsahu','Generativní obraz')], [('umela-inteligence','Hlubší etika AI')]),
 ('Generativní video', 'navazujici', 'AI dnes vytvoří realistické video z textu nebo obrázku (Sora, Veo, Runway) i se zvukem. Je to mocný tvůrčí nástroj — a zároveň zdroj rizik, protože stejná technologie umí i přesvědčivé dezinformace a deepfakes.', None, [], ['obsah','ai','deepfake'], [('tvorba-obsahu','Generativní obraz')], [('umela-inteligence','Deepfakes a syntetická média')]),
 ('Generativní hudba a hlas', 'navazujici', 'Nástroje jako Suno nebo ElevenLabs složí celou písničku nebo napodobí hlas z krátké ukázky. Vedle tvůrčích možností to přináší i vážná rizika — zneužití cizího hlasu a otázky autorských práv.', None, [], ['obsah','ai'], [('tvorba-obsahu','Prompt pro média')], []),
 ('Střih a postprodukce s AI', 'navazujici', 'AI dnes zvládne velkou část dokončovacích prací: automatické titulky, čištění zvuku, výběr nejlepších záběrů nebo úpravu videa přepisem textu (CapCut, Descript). Zrychluje to nejotravnější části tvorby.', None, [], ['obsah'], [('tvorba-obsahu','Vizuální jazyk')], []),
 ('Kontrola nad výsledkem', 'navazujici', 'Vygenerovat jeden hezký obrázek je snadné; těžší je udržet stejnou postavu nebo styl napříč více obrázky a mít nad výsledkem skutečnou kontrolu. K tomu slouží referenční obrázky, dokreslování (in/out-painting) a úpravy přirozeným jazykem.', None, [], ['obsah','ai'], [('tvorba-obsahu','Generativní obraz')], []),
 ('Původ obsahu a vodoznaky', 'navazujici', 'Jak poznat, jestli je obsah pravý, nebo vytvořený AI? Pomáhají vodoznaky (SynthID) a metadata o původu souboru (C2PA). Důležité je vědět, že žádný jediný test není stoprocentní — ověřování původu je vrstevnaté.', None, [], ['obsah','bezpeci','ai'], [('tvorba-obsahu','Etika, autorství a označování')], []),
 ('Propojení nástrojů (obraz, video, zvuk)', 'navazujici', 'Velké projekty vznikají spojením několika nástrojů: z obrázku uděláš video, k němu složíš hudbu a přidáš hlas. Umět nástroje řetězit dohromady je dnes samostatná tvůrčí dovednost.', None, [], ['obsah','ai'], [('tvorba-obsahu','Kontrola nad výsledkem')], []),
]

C['herni-vyvoj'] = [
 ('Herní smyčka, scéna a objekty', 'core', 'Každá hra běží v neustále se opakující smyčce: načti vstup → přepočítej svět → vykresli obraz, a to mnohokrát za vteřinu. V ní žijí objekty (sprity) rozmístěné ve scéně — postavy, překážky, sběratelné předměty.', 'algoritmizace', [], ['hry','rizeni-toku'], [], []),
 ('Vstup hráče, stavy a skóre', 'core', 'Hra reaguje na ovládání (klávesy, dotyk) a přitom si pamatuje svůj stav — kolik má hráč životů, jaké je skóre, jestli běží nebo skončila. Tenhle „paměťový" základ dělá ze scény skutečnou hru.', 'algoritmizace', [], ['hry','udalosti'], [('herni-vyvoj','Herní smyčka, scéna a objekty')], [('programovani','Události')]),
 ('Kolize a jednoduchá fyzika', 'core', 'Aby hra fungovala, musí poznat, když se dva objekty dotknou (kolize) — třeba hráč sebere minci nebo narazí do zdi. K tomu patří i základní pohyb: rychlost, gravitace, odraz.', None, [], ['hry'], [('herni-vyvoj','Herní smyčka, scéna a objekty')], []),
 ('Herní design', 'core', 'Návrh toho, co dělá hru zábavnou: pravidla, obtížnost a zpětná vazba hráči. Dobrý design drží hráče v „proudu" (flow) — ani nuda z přílišné lehkosti, ani frustrace z přetížení.', None, [], ['hry','design'], [('herni-vyvoj','Vstup hráče, stavy a skóre')], []),
 ('Scratch jako vstup', 'core', 'Blokové prostředí, kde první hru poskládáš z barevných bloků bez rizika překlepů. Skvěle na něm pochopíš smyčky, události, podmínky i proměnné, než přejdeš k textovému kódu.', 'algoritmizace', ['v007'], ['hry','programovani'], [], [('programovani','Blokové vs. textové programování')]),
 ('Lehké enginy', 'navazujici', 'Mezikrok mezi Scratchem a plnými nástroji: GDevelop (bez kódu, přes logiku událostí) nebo Roblox Studio dají skutečnou hru, kterou jde sdílet. Nižší práh, ale vážnější výsledek.', None, [], ['hry'], [('herni-vyvoj','Herní design')], []),
 ('Skutečné enginy', 'navazujici', 'Profesionální nástroje s textovým kódem: Godot (jazyk GDScript, blízký Pythonu, zdarma a odlehčený) nebo Unity (C#, silné na mobilech). Umí víc, ale mají strmější křivku učení.', None, [], ['hry','programovani'], [('herni-vyvoj','Lehké enginy')], []),
 ('AI generování assetů', 'navazujici', 'AI dnes vytvoří herní grafiku a 3D objekty z popisu (Roblox Cube, Meshy) — místo hodin modelování napíšeš, co chceš. Snižuje to bariéru, ale těžiště se přesouvá k designu a kurátorství.', None, [], ['hry','ai'], [('herni-vyvoj','Herní design')], []),
 ('AI asistenti a kód', 'navazujici', 'Vestavění pomocníci (Roblox Assistant, Unity Muse) i externí AI umí napsat a upravit kód hry. Práce se mění z „napiš každý řádek" na „popiš záměr a pochop či oprav, co AI vytvořila".', None, [], ['hry','ai','ai-prurez'], [('herni-vyvoj','Skutečné enginy')], [('programovani','Čtení a hodnocení AI kódu')]),
 ('Publikace hry', 'navazujici', 'Hotovou hru sdílíš s ostatními — třeba na itch.io nebo přímo v Robloxu. „Zahraj si moji hru" je silná motivace a zároveň zážitek spoluautorství a zpětné vazby od hráčů.', None, [], ['hry','spoluprace'], [('herni-vyvoj','Herní design')], []),
]

C['fyzicky-computing'] = [
 ('Vstup–zpracování–výstup na zařízení', 'core', 'Fyzické zařízení pracuje ve stejné smyčce jako počítač, ale „hmatatelně": senzorem něco změří (vstup), program to vyhodnotí (zpracování) a ovládne třeba LED nebo motor (výstup). Kód tu má okamžitý fyzický efekt.', 'digitalni-technologie', [], ['robotika','hardware'], [], []),
 ('Senzory a aktuátory', 'core', 'Senzory jsou „smysly" zařízení — měří teplo, světlo, pohyb, zvuk. Aktuátory jsou jeho „svaly" — rozsvítí, zapípají, roztočí motor. Dohromady umožňují zařízení vnímat prostředí a jednat v něm.', None, [], ['robotika','senzory'], [('fyzicky-computing','Vstup–zpracování–výstup na zařízení')], []),
 ('micro:bit', 'core', 'Malá školní destička se senzory přímo na desce, ideální pro první kroky ve fyzickém computingu. Programuje se blokově (MakeCode) i textově (MicroPython), takže roste s tebou od úplných začátků.', 'digitalni-technologie', ['v007'], ['robotika','programovani'], [('fyzicky-computing','Senzory a aktuátory')], [('programovani','Blokové vs. textové programování')]),
 ('Události a řízení výstupu', 'core', 'Zařízení reaguje na podněty — stisk tlačítka, zatřesení, změnu světla — a podle nich ovládá výstupy (LED matici, piny, motory). Je to událostmi řízené programování, ale s hmatatelným výsledkem.', 'algoritmizace', [], ['robotika','udalosti'], [('fyzicky-computing','micro:bit')], []),
 ('Arduino a Raspberry Pi', 'navazujici', 'Krok dál za micro:bit: Arduino tě přiblíží skutečné elektronice (nepájivé pole, víc senzorů), Raspberry Pi je plnohodnotný malý počítač s Linuxem pro náročnější projekty.', None, [], ['robotika','hardware'], [('fyzicky-computing','micro:bit')], []),
 ('Roboti a vozítka', 'navazujici', 'Když se k desce přidá podvozek a motory (micro:bit + Maqueen, Lego Spike), vznikne pohyblivý robot. Sleduje čáru, vyhýbá se překážkám — a spojuje programování s pohybem v reálném světě.', None, [], ['robotika'], [('fyzicky-computing','Události a řízení výstupu')], []),
 ('IoT', 'navazujici', 'Internet věcí (IoT): senzory posílají naměřená data po síti do cloudu, kde se zobrazí na přehledu (dashboardu). Tak funguje chytrá domácnost i měření prostředí — spojení hardwaru, sítě a dat dohromady.', 'digitalni-technologie', [], ['robotika','sit','cloud'], [('fyzicky-computing','Senzory a aktuátory')], [('data-databaze','Vizualizace a volba grafu')]),
 ('AI přímo na zařízení (TinyML)', 'navazujici', 'Strojové učení, které běží přímo na malém zařízení bez cloudu. V nástroji micro:bit CreateAI si sám nasbíráš data (třeba pohyby), natrénuješ model a nahraješ ho do desky — celý postup AI si osaháš fyzicky v ruce.', 'data-modelovani', ['v004'], ['robotika','ai','ml'], [('fyzicky-computing','micro:bit')], [('umela-inteligence','Strojové učení prakticky')]),
 ('Komunikace mezi zařízeními', 'navazujici', 'Zařízení si mohou posílat data bezdrátově — přes rádio nebo Bluetooth. Díky tomu spolu můžou „mluvit" (dva micro:bity, ovladač a robot) a tvořit propojené projekty.', 'digitalni-technologie', [], ['robotika','sit'], [('fyzicky-computing','micro:bit')], []),
]

C['kyberbezpecnost'] = [
 ('Hesla a 2FA', 'core', 'Silné a hlavně unikátní heslo ke každé službě je základ; zapamatuje ho za tebe správce hesel. Dvoufaktorové ověření (2FA) přidá druhý zámek (kód z aplikace), takže samotné uhádnuté heslo už útočníkovi nestačí.', 'digitalni-technologie', ['v012'], ['bezpeci'], [], []),
 ('Phishing a sociální inženýrství', 'core', 'Nejčastější útok necílí na počítač, ale na člověka: podvodná zpráva tě má přimět kliknout nebo vyzradit heslo. Poznat naléhavý tón, falešný odkaz nebo „výhru" je důležitější než jakýkoli antivir.', 'digitalni-technologie', ['v012'], ['bezpeci'], [], []),
 ('Soukromí a digitální stopa', 'core', 'Vším, co online děláš, za sebou necháváš stopu — příspěvky, lajky, polohu. Vědět, co po tobě zůstává a jak to omezit (nastavení soukromí, míň sdílet), je základ ochrany sebe sama.', 'digitalni-technologie', ['v012'], ['bezpeci','soukromi'], [], []),
 ('Bezpečné chování na sítích', 'core', 'Praktická pravidla každodenního bezpečí: rozmyslet, co sdílím a s kým, nastavit soukromí v aplikacích, nepřidávat neznámé. Většina problémů začíná chováním, ne technikou.', 'digitalni-technologie', ['v012'], ['bezpeci','soukromi'], [('kyberbezpecnost','Soukromí a digitální stopa')], []),
 ('Základní hygiena', 'core', 'Návyky, které tě ochrání před většinou hrozeb: aktualizovat systém i appky, instalovat jen z ověřených zdrojů, zálohovat a zabezpečit zařízení podle toho, co ti reálně hrozí.', 'digitalni-technologie', ['v012'], ['bezpeci'], [], []),
 ('Šifrování a HTTPS', 'navazujici', 'Šifrování promění data v nečitelnou změť pro každého, kdo nemá klíč. Zámeček a „https" v adrese znamená, že spojení k webu je šifrované; end-to-end šifrování (třeba v messengerech) zajistí, že zprávu přečte jen příjemce.', 'digitalni-technologie', [], ['bezpeci','sit'], [('kyberbezpecnost','Základní hygiena')], [('digitalni-zaklady','Adresy a protokoly')]),
 ('Typy útoků', 'navazujici', 'Přehled hrozeb, se kterými se lze setkat: malware (škodlivý program), ransomware (zašifruje data a žádá výkupné) a další. Vědět, jak se šíří, pomáhá se jim vyhnout.', 'digitalni-technologie', ['v012'], ['bezpeci'], [('kyberbezpecnost','Základní hygiena')], []),
 ('AI podvody', 'navazujici', 'AI posunula podvody na novou úroveň: deepfake video, naklonovaný hlas známého člověka nebo dokonalý phishing bez chyb. Stará rada „poznáš to podle špatné češtiny" už neplatí — nová obrana je ověřit si to jinou cestou.', 'digitalni-technologie', [], ['bezpeci','deepfake','ai'], [('kyberbezpecnost','Phishing a sociální inženýrství')], [('umela-inteligence','Deepfakes a syntetická média')]),
 ('Sextortion a citlivý obsah', 'navazujici', 'Vydírání intimními fotkami — dnes i falešnými, vytvořenými AI. Mimořádně citlivé a aktuální riziko pro nezletilé; klíčové je vědět, že v tom oběť není sama a komu se svěřit, ne mlčet ze studu.', 'digitalni-technologie', [], ['bezpeci','soukromi'], [('kyberbezpecnost','AI podvody')], []),
 ('Ověřování přes druhý kanál', 'navazujici', 'Když ti „kamarád" píše o peníze nebo „banka" chce heslo, ověř si to jinou cestou — zavolej, zeptej se napřímo. Zdravá skepse a zvyk ověřovat (prebunking) je nejlepší obrana proti podvodům, které vypadají dokonale.', None, [], ['bezpeci','ai-prurez'], [('kyberbezpecnost','AI podvody')], [('digitalni-obcanstvi','Dezinformace a manipulace')]),
 ('Síťová bezpečnost a CTF', 'navazujici', 'Pro zvídavé: jak se chrání sítě a jak přemýšlí útočník. Soutěže typu CTF (Capture the Flag) učí etické hackování hravou formou — bezpečnost zevnitř, na cvičných úlohách.', 'digitalni-technologie', [], ['bezpeci','sit'], [('kyberbezpecnost','Typy útoků')], []),
]

C['digitalni-obcanstvi'] = [
 ('Kritické myšlení online', 'core', 'Zvyk se u informace zastavit dřív, než jí uvěřím nebo ji pošlu dál: kdo to tvrdí, odkud to ví, co tím sleduje. Základní dovednost, bez které se v záplavě obsahu neobejdeš.', None, [], ['media','hodnoceni'], [], []),
 ('Jak fungují algoritmy sítí', 'core', 'Co vidíš na sociálních sítích, ti vybírá algoritmus, který chce udržet tvou pozornost co nejdéle. Vzniká tak „bublina" (vidíš jen podobné názory) a ekonomika pozornosti — a pochopit to je předpoklad, aby ses v tom uměl chovat.', None, [], ['media','ai'], [], [('umela-inteligence','Doporučovací systémy')]),
 ('Dezinformace a manipulace', 'core', 'Rozpoznat obsah, který má klamat nebo tebou manipulovat — falešné zprávy, vytržené citace, hrátky s emocemi. Nejde jen o „fakt/nefakt", ale i o to, jak s tebou obsah pracuje.', None, [], ['media'], [('digitalni-obcanstvi','Kritické myšlení online')], []),
 ('Digitální stopa a soukromí', 'core', 'Jaká data o sobě necháváš a komu vlastně slouží. Uvědomit si hodnotu svých dat je první krok k tomu s nimi zacházet vědomě, ne je rozdávat zadarmo výměnou za „bezplatné" služby.', None, [], ['media','soukromi'], [], [('kyberbezpecnost','Soukromí a digitální stopa')]),
 ('Digitální wellbeing', 'core', 'Zdravý vztah k technologiím: rozpoznat, kdy tě appky táhnou k nekonečnému scrollování (závislostní design), a umět si nastavit hranice. Cílem není technologie zavrhnout, ale používat je tak, aby sloužily tobě.', None, [], ['media','wellbeing'], [], []),
 ('Rozumět AI (halucinace, bias)', 'navazujici', 'Občanské minimum o AI: že jazykové modely předpovídají slova (a proto halucinují), že se učí z dat (a proto mají bias) a že jejich výstup je potřeba ověřovat. Netýká se jen programátorů — týká se každého, kdo AI potkává.', None, [], ['media','ai'], [('digitalni-obcanstvi','Kritické myšlení online')], [('umela-inteligence','Jak funguje generativní model')]),
 ('Rozpoznání AI obsahu', 'navazujici', 'Umět odhadnout, jestli je text, obraz nebo video vytvořené AI — a vědět, že spolehlivý univerzální detektor neexistuje. Proto se víc než na „test" spoléhej na kontext a ověření zdroje.', None, [], ['media','ai','deepfake'], [('digitalni-obcanstvi','Rozumět AI (halucinace, bias)')], [('umela-inteligence','Deepfakes a syntetická média')]),
 ('Etika AI ve škole', 'navazujici', 'Kde je hranice mezi tím, když ti AI pomůže se učit, a když za tebe úkol prostě udělá (a připraví tě o učení). Patří sem i poctivost — přiznat, kde jsi AI použil.', None, [], ['media','etika','ai'], [('digitalni-obcanstvi','Rozumět AI (halucinace, bias)')], [('umela-inteligence','Kdy AI (ne)použít a disclosure')]),
 ('Právo a etika', 'navazujici', 'Základní pravidla digitálního světa: autorská práva (čí je co) a ochrana osobních údajů (GDPR), zvlášť u nezletilých. Vědět, co smím sdílet a co se sebou nechat dělat, je součást bezpečí.', None, [], ['media','etika','soukromi'], [('digitalni-obcanstvi','Digitální stopa a soukromí')], []),
 ('Obchodní modely platforem', 'navazujici', 'Když je služba „bezplatná", obvykle platíš pozorností a daty. Pochopit, jak platformy vydělávají, vysvětlí spoustu jejich chování — proč tě chtějí udržet a proč vidíš reklamy zrovna na tohle.', None, [], ['media'], [('digitalni-obcanstvi','Jak fungují algoritmy sítí')], []),
 ('Aktivní digitální občanství', 'navazujici', 'Být online nejen konzument, ale i tvůrce hodnotného obsahu a slušný účastník diskuse. Digitální svět spoluutváříš — tím, co sdílíš, jak se chováš a čemu dáváš prostor.', None, [], ['media','wellbeing'], [('digitalni-obcanstvi','Kritické myšlení online')], []),
]

# ---- Doplňkové zařazení do oblastí RVP (v0.6) ----
# Cíl: co nejvíc konceptů přiřadit k jednomu ze 4 okruhů, aby si pedagog mohl odškrtnout
# pokrytí. Zařazeno jen tam, kde to sedí na charakteristiku okruhu (texty RVP). Pozn.: oblast
# = tematická příslušnost k okruhu; nemusí mít konkrétní očekávaný výstup (pole `rvp`).
# Co zůstává null = OPRAVDU průřezové: postoje, etika, mediální gramotnost, wellbeing,
# digitální občanství, základy vizuálního designu — tedy klíčové kompetence / průřezová
# témata RVP, ne obsah jednoho okruhu.
OBLAST_DOPLNENI = {
 # Umělá inteligence → data-modelovani (jak modely fungují, spolehlivost/pravděpodobnost, ML); prompt = užití nástroje
 ('umela-inteligence', 'Co je a co není AI'): 'data-modelovani',
 ('umela-inteligence', 'Jak funguje generativní model'): 'data-modelovani',
 ('umela-inteligence', 'Ověřování výstupů'): 'data-modelovani',
 ('umela-inteligence', 'Bias a férovost'): 'data-modelovani',
 ('umela-inteligence', 'Pět velkých idejí AI'): 'data-modelovani',
 ('umela-inteligence', 'Jak fungují chatboti (LLM, RAG)'): 'data-modelovani',
 ('umela-inteligence', 'Prompt a promptová gramotnost'): 'digitalni-technologie',
 # Data
 ('data-databaze', 'Vektorové databáze'): 'data-modelovani',
 ('data-databaze', 'Analýza dat pomocí AI'): 'data-modelovani',
 # Tvorba webů → DT (tvorba/užití nástrojů), JS = algoritmizace, rozhraní = informační systémy
 ('tvorba-webu', 'HTML'): 'digitalni-technologie',
 ('tvorba-webu', 'CSS'): 'digitalni-technologie',
 ('tvorba-webu', 'Interaktivita (JavaScript)'): 'algoritmizace',
 ('tvorba-webu', 'AI-asistovaná tvorba webu'): 'digitalni-technologie',
 ('tvorba-webu', 'Frameworky'): 'digitalni-technologie',
 ('tvorba-webu', 'Přístupnost a SEO'): 'digitalni-technologie',
 ('tvorba-webu', 'UX/UI a design webu'): 'informacni-systemy',
 # Tvorba aplikací → vývoj řešení pro potřeby uživatele = informační systémy; kód = algoritmizace; nástroje = DT
 ('tvorba-aplikaci', 'Co je aplikace'): 'digitalni-technologie',
 ('tvorba-aplikaci', 'No-code / low-code'): 'informacni-systemy',
 ('tvorba-aplikaci', 'Vibecoding'): 'algoritmizace',
 ('tvorba-aplikaci', 'AI nástroje pro tvorbu'): 'digitalni-technologie',
 ('tvorba-aplikaci', 'Práce s API a backendem'): 'informacni-systemy',
 ('tvorba-aplikaci', 'Životní cyklus vývoje'): 'informacni-systemy',
 ('tvorba-aplikaci', 'Publikace do app storů'): 'digitalni-technologie',
 # Tvorba obsahu → DT (tvořivé užití digitálních nástrojů)
 ('tvorba-obsahu', 'Prompt pro média'): 'digitalni-technologie',
 ('tvorba-obsahu', 'Generativní obraz'): 'digitalni-technologie',
 ('tvorba-obsahu', 'Generativní video'): 'digitalni-technologie',
 ('tvorba-obsahu', 'Generativní hudba a hlas'): 'digitalni-technologie',
 ('tvorba-obsahu', 'Střih a postprodukce s AI'): 'digitalni-technologie',
 ('tvorba-obsahu', 'Kontrola nad výsledkem'): 'digitalni-technologie',
 ('tvorba-obsahu', 'Propojení nástrojů (obraz, video, zvuk)'): 'digitalni-technologie',
 # Herní vývoj → programová logika = algoritmizace; enginy/nástroje/publikace = DT
 ('herni-vyvoj', 'Kolize a jednoduchá fyzika'): 'algoritmizace',
 ('herni-vyvoj', 'Lehké enginy'): 'digitalni-technologie',
 ('herni-vyvoj', 'Skutečné enginy'): 'digitalni-technologie',
 ('herni-vyvoj', 'AI generování assetů'): 'digitalni-technologie',
 ('herni-vyvoj', 'AI asistenti a kód'): 'digitalni-technologie',
 ('herni-vyvoj', 'Publikace hry'): 'digitalni-technologie',
 # Fyzický computing → DT (hardware, zařízení)
 ('fyzicky-computing', 'Senzory a aktuátory'): 'digitalni-technologie',
 ('fyzicky-computing', 'Arduino a Raspberry Pi'): 'digitalni-technologie',
 ('fyzicky-computing', 'Roboti a vozítka'): 'digitalni-technologie',
 # Kyberbezpečnost → DT (bezpečné používání)
 ('kyberbezpecnost', 'Ověřování přes druhý kanál'): 'digitalni-technologie',
 # Digitální občanství → jen ty o fungování techniky/AI (zbytek zůstává průřezový)
 ('digitalni-obcanstvi', 'Jak fungují algoritmy sítí'): 'digitalni-technologie',
 ('digitalni-obcanstvi', 'Rozumět AI (halucinace, bias)'): 'data-modelovani',
}

# ---- Přiřazení konceptů ke klíčové kompetenci digitální (KDI) ----
# Nezávisle na okruhu RVP. Přiřazeno tam, kde koncept ztělesňuje danou kompetenci
# (užívání/tvorba/sdílení/hodnocení informací/bezpečí). Ryzí informatická teorie
# (myšlení, primitiva programování, vnitřek infrastruktury, teorie AI) zůstává None.
KDI_MAP = {
 # DAT — hodnocení informací, dat a spolehlivosti zdrojů
 ('digitalni-zaklady', 'Data a informace'): 'kdi-dat',
 ('digitalni-zaklady', 'Reprezentace dat'): 'kdi-dat',
 ('data-databaze', 'Datová gramotnost'): 'kdi-dat',
 ('data-databaze', 'Datový cyklus'): 'kdi-dat',
 ('data-databaze', 'Strukturovaná vs. nestrukturovaná data'): 'kdi-dat',
 ('data-databaze', 'Vizualizace a volba grafu'): 'kdi-dat',
 ('data-databaze', 'Statistická gramotnost'): 'kdi-dat',
 ('data-databaze', 'Čištění reálných dat'): 'kdi-dat',
 ('data-databaze', 'Analýza dat pomocí AI'): 'kdi-dat',
 ('umela-inteligence', 'Ověřování výstupů'): 'kdi-dat',
 ('umela-inteligence', 'Bias a férovost'): 'kdi-dat',
 ('tvorba-obsahu', 'Původ obsahu a vodoznaky'): 'kdi-dat',
 ('digitalni-obcanstvi', 'Kritické myšlení online'): 'kdi-dat',
 ('digitalni-obcanstvi', 'Dezinformace a manipulace'): 'kdi-dat',
 ('digitalni-obcanstvi', 'Rozpoznání AI obsahu'): 'kdi-dat',
 ('digitalni-obcanstvi', 'Rozumět AI (halucinace, bias)'): 'kdi-dat',
 ('digitalni-obcanstvi', 'Jak fungují algoritmy sítí'): 'kdi-dat',
 # ZAP — sdílení, spolupráce, komunita, publikace
 ('programovani', 'Verzování kódu'): 'kdi-zap',
 ('tvorba-webu', 'Nasazení webu'): 'kdi-zap',
 ('tvorba-aplikaci', 'Publikace do app storů'): 'kdi-zap',
 ('herni-vyvoj', 'Publikace hry'): 'kdi-zap',
 ('digitalni-obcanstvi', 'Aktivní digitální občanství'): 'kdi-zap',
 # TDO — tvorba digitálního obsahu
 ('tvorba-obsahu', 'Vizuální jazyk'): 'kdi-tdo',
 ('tvorba-obsahu', 'Prompt pro média'): 'kdi-tdo',
 ('tvorba-obsahu', 'Generativní obraz'): 'kdi-tdo',
 ('tvorba-obsahu', 'Generativní video'): 'kdi-tdo',
 ('tvorba-obsahu', 'Generativní hudba a hlas'): 'kdi-tdo',
 ('tvorba-obsahu', 'Střih a postprodukce s AI'): 'kdi-tdo',
 ('tvorba-obsahu', 'Kontrola nad výsledkem'): 'kdi-tdo',
 ('tvorba-obsahu', 'Propojení nástrojů (obraz, video, zvuk)'): 'kdi-tdo',
 ('tvorba-obsahu', 'Etika, autorství a označování'): 'kdi-tdo',
 ('tvorba-webu', 'HTML'): 'kdi-tdo',
 ('tvorba-webu', 'CSS'): 'kdi-tdo',
 ('tvorba-webu', 'Interaktivita (JavaScript)'): 'kdi-tdo',
 ('tvorba-webu', 'AI-asistovaná tvorba webu'): 'kdi-tdo',
 ('tvorba-webu', 'Frameworky'): 'kdi-tdo',
 ('tvorba-webu', 'Přístupnost a SEO'): 'kdi-tdo',
 ('tvorba-webu', 'UX/UI a design webu'): 'kdi-tdo',
 ('herni-vyvoj', 'Herní smyčka, scéna a objekty'): 'kdi-tdo',
 ('herni-vyvoj', 'Vstup hráče, stavy a skóre'): 'kdi-tdo',
 ('herni-vyvoj', 'Kolize a jednoduchá fyzika'): 'kdi-tdo',
 ('herni-vyvoj', 'Herní design'): 'kdi-tdo',
 ('herni-vyvoj', 'Scratch jako vstup'): 'kdi-tdo',
 ('herni-vyvoj', 'Lehké enginy'): 'kdi-tdo',
 ('herni-vyvoj', 'Skutečné enginy'): 'kdi-tdo',
 ('herni-vyvoj', 'AI generování assetů'): 'kdi-tdo',
 ('herni-vyvoj', 'AI asistenti a kód'): 'kdi-tdo',
 # BZK — bezpečnost, soukromí, wellbeing, zdraví
 ('kyberbezpecnost', 'Hesla a 2FA'): 'kdi-bzk',
 ('kyberbezpecnost', 'Phishing a sociální inženýrství'): 'kdi-bzk',
 ('kyberbezpecnost', 'Soukromí a digitální stopa'): 'kdi-bzk',
 ('kyberbezpecnost', 'Bezpečné chování na sítích'): 'kdi-bzk',
 ('kyberbezpecnost', 'Základní hygiena'): 'kdi-bzk',
 ('kyberbezpecnost', 'Šifrování a HTTPS'): 'kdi-bzk',
 ('kyberbezpecnost', 'Typy útoků'): 'kdi-bzk',
 ('kyberbezpecnost', 'AI podvody'): 'kdi-bzk',
 ('kyberbezpecnost', 'Sextortion a citlivý obsah'): 'kdi-bzk',
 ('kyberbezpecnost', 'Ověřování přes druhý kanál'): 'kdi-bzk',
 ('kyberbezpecnost', 'Síťová bezpečnost a CTF'): 'kdi-bzk',
 ('digitalni-zaklady', 'Kde jsou data fyzicky'): 'kdi-bzk',
 ('umela-inteligence', 'Soukromí při práci s AI'): 'kdi-bzk',
 ('umela-inteligence', 'Deepfakes a syntetická média'): 'kdi-bzk',
 ('umela-inteligence', 'Vlastní agency'): 'kdi-bzk',
 ('umela-inteligence', 'Kdy AI (ne)použít a disclosure'): 'kdi-bzk',
 ('digitalni-obcanstvi', 'Digitální wellbeing'): 'kdi-bzk',
 ('digitalni-obcanstvi', 'Digitální stopa a soukromí'): 'kdi-bzk',
 ('digitalni-obcanstvi', 'Právo a etika'): 'kdi-bzk',
 # VIN — využití technologií, automatizace, inovace
 ('tvorba-aplikaci', 'Co je aplikace'): 'kdi-vin',
 ('tvorba-aplikaci', 'No-code / low-code'): 'kdi-vin',
 ('tvorba-aplikaci', 'Logika aplikace'): 'kdi-vin',
 ('tvorba-aplikaci', 'Vibecoding'): 'kdi-vin',
 ('tvorba-aplikaci', 'AI nástroje pro tvorbu'): 'kdi-vin',
 ('tvorba-aplikaci', 'Práce s API a backendem'): 'kdi-vin',
 ('tvorba-aplikaci', 'Databáze a autentizace'): 'kdi-vin',
 ('tvorba-aplikaci', 'Životní cyklus vývoje'): 'kdi-vin',
 ('tvorba-aplikaci', 'Iluze, že to umím'): 'kdi-vin',
 ('data-databaze', 'Tabulky a relační model'): 'kdi-vin',
 ('data-databaze', 'Dotazování (SQL)'): 'kdi-vin',
 ('data-databaze', 'Účel informačních systémů'): 'kdi-vin',
 ('data-databaze', 'NoSQL a dokumentové databáze'): 'kdi-vin',
 ('data-databaze', 'Vektorové databáze'): 'kdi-vin',
 ('data-databaze', 'Programová analýza dat'): 'kdi-vin',
 ('umela-inteligence', 'Prompt a promptová gramotnost'): 'kdi-vin',
 ('umela-inteligence', 'Strojové učení prakticky'): 'kdi-vin',
 ('umela-inteligence', 'Typy AI úloh'): 'kdi-vin',
 ('programovani', 'Knihovny a volání API v kódu'): 'kdi-vin',
 ('programovani', 'Čtení a hodnocení AI kódu'): 'kdi-vin',
 ('fyzicky-computing', 'Vstup–zpracování–výstup na zařízení'): 'kdi-vin',
 ('fyzicky-computing', 'Senzory a aktuátory'): 'kdi-vin',
 ('fyzicky-computing', 'micro:bit'): 'kdi-vin',
 ('fyzicky-computing', 'Události a řízení výstupu'): 'kdi-vin',
 ('fyzicky-computing', 'Arduino a Raspberry Pi'): 'kdi-vin',
 ('fyzicky-computing', 'Roboti a vozítka'): 'kdi-vin',
 ('fyzicky-computing', 'IoT'): 'kdi-vin',
 ('fyzicky-computing', 'AI přímo na zařízení (TinyML)'): 'kdi-vin',
 ('fyzicky-computing', 'Komunikace mezi zařízeními'): 'kdi-vin',
}

# ---- Přiřazení očekávaných výstupů RVP ke konceptům (v0.10) ----
# Autoritativní zdroj pro pole `rvp`. Jen 12 výstupů 2. stupně; ke konceptu ideálně
# jeden, max dva, a JEN tam, kde to sedí na znění i okruh (oblast). Co v RVP není
# (moderní témata, myšlenkové abstrakce, teorie AI), zůstává prázdné — NEVYMÝŠLET.
RVP_MAP = {
 # Data, informace a modelování (v001–v004)
 ('digitalni-zaklady', 'Data a informace'): ['v001'],
 ('digitalni-zaklady', 'Reprezentace dat'): ['v002'],
 ('data-databaze', 'Datová gramotnost'): ['v001'],
 ('data-databaze', 'Datový cyklus'): ['v001'],
 ('data-databaze', 'Strukturovaná vs. nestrukturovaná data'): ['v002'],
 ('data-databaze', 'Vizualizace a volba grafu'): ['v003'],
 ('data-databaze', 'Statistická gramotnost'): ['v001'],
 ('data-databaze', 'Programová analýza dat'): ['v001'],
 ('data-databaze', 'Analýza dat pomocí AI'): ['v001'],
 ('informaticke-mysleni', 'Modelování a simulace'): ['v003'],
 ('umela-inteligence', 'AI se učí z dat'): ['v004'],
 ('umela-inteligence', 'Strojové učení prakticky'): ['v004'],
 ('fyzicky-computing', 'AI přímo na zařízení (TinyML)'): ['v004'],
 # Algoritmizace a programování (v005–v007)
 ('informaticke-mysleni', 'Dekompozice'): ['v006'],
 ('informaticke-mysleni', 'Algoritmus'): ['v006'],
 ('informaticke-mysleni', 'Řízení toku'): ['v007'],
 ('informaticke-mysleni', 'Pseudokód a vývojové diagramy'): ['v005'],
 ('informaticke-mysleni', 'Základní algoritmy'): ['v005'],
 ('informaticke-mysleni', 'Hodnocení a analýza chyb'): ['v005'],
 ('programovani', 'Proměnné a datové typy'): ['v007'],
 ('programovani', 'Podmínky v kódu'): ['v007'],
 ('programovani', 'Cykly v kódu'): ['v007'],
 ('programovani', 'Funkce a procedury'): ['v006'],
 ('programovani', 'Ladění a testování'): ['v005'],
 ('programovani', 'Blokové vs. textové programování'): ['v007'],
 ('programovani', 'Čtení a hodnocení AI kódu'): ['v005'],
 ('herni-vyvoj', 'Herní smyčka, scéna a objekty'): ['v007'],
 ('herni-vyvoj', 'Vstup hráče, stavy a skóre'): ['v007'],
 ('herni-vyvoj', 'Scratch jako vstup'): ['v007'],
 ('fyzicky-computing', 'micro:bit'): ['v007'],
 ('fyzicky-computing', 'Události a řízení výstupu'): ['v007'],
 # Informační systémy (v008–v010)
 ('data-databaze', 'Tabulky a relační model'): ['v009'],
 ('data-databaze', 'Dotazování (SQL)'): ['v010'],
 ('data-databaze', 'Účel informačních systémů'): ['v008'],
 ('data-databaze', 'Čištění reálných dat'): ['v010'],
 ('tvorba-aplikaci', 'Databáze a autentizace'): ['v009', 'v012'],
 # Digitální technologie (v011–v012)
 ('digitalni-zaklady', 'Hardware a software'): ['v011'],
 ('digitalni-zaklady', 'Internet a síť'): ['v011'],
 ('digitalni-zaklady', 'Adresy a protokoly'): ['v011'],
 ('digitalni-zaklady', 'Operační systém a soubory'): ['v011'],
 ('digitalni-zaklady', 'Kde jsou data fyzicky'): ['v012'],
 ('fyzicky-computing', 'Arduino a Raspberry Pi'): ['v011'],
 ('fyzicky-computing', 'Roboti a vozítka'): ['v011'],
 ('fyzicky-computing', 'IoT'): ['v011'],
 ('fyzicky-computing', 'Komunikace mezi zařízeními'): ['v011'],
 ('kyberbezpecnost', 'Hesla a 2FA'): ['v012'],
 ('kyberbezpecnost', 'Phishing a sociální inženýrství'): ['v012'],
 ('kyberbezpecnost', 'Soukromí a digitální stopa'): ['v012'],
 ('kyberbezpecnost', 'Bezpečné chování na sítích'): ['v012'],
 ('kyberbezpecnost', 'Základní hygiena'): ['v012'],
 ('kyberbezpecnost', 'Šifrování a HTTPS'): ['v012'],
 ('kyberbezpecnost', 'Typy útoků'): ['v012'],
 ('kyberbezpecnost', 'AI podvody'): ['v012'],
 ('kyberbezpecnost', 'Sextortion a citlivý obsah'): ['v012'],
 ('kyberbezpecnost', 'Ověřování přes druhý kanál'): ['v012'],
 ('kyberbezpecnost', 'Síťová bezpečnost a CTF'): ['v012'],
}

# ---- Tagy: dvě průřezové facetové vrstvy (v0.9) ----
# Tagy jsou ORTOGONÁLNÍ k tématu, okruhu RVP i kompetenci. Dvě rodiny:
#  (A) OPTIKY / velká průřezová témata a hodnoty — „proč to je důležité" (10);
#  (B) POVAHA konceptu — „co je to za typ znalosti": teoretický základ vs. praktická
#      dovednost (postoje pokrývají optiky). Odpovídá dělení znalosti/dovednosti/postoje.
# Záměrně NEkopírují témata: každá optika sahá do mnoha témat najednou.

# (B) povaha — výchozí dle tématu + výjimky; None = řeší optiky (postojové koncepty)
NATURE_DEFAULT = {
 'informaticke-mysleni': 'teoretický základ',
 'digitalni-zaklady': 'teoretický základ',
 'programovani': 'teoretický základ',
 'data-databaze': 'praktická dovednost',
 'tvorba-webu': 'praktická dovednost',
 'tvorba-aplikaci': 'praktická dovednost',
 'tvorba-obsahu': 'praktická dovednost',
 'herni-vyvoj': 'praktická dovednost',
 'fyzicky-computing': 'praktická dovednost',
 'kyberbezpecnost': 'praktická dovednost',
 'umela-inteligence': None,
 'digitalni-obcanstvi': None,
}
NATURE_OVERRIDE = {
 ('programovani', 'Ladění a testování'): 'praktická dovednost',
 ('programovani', 'Verzování kódu'): 'praktická dovednost',
 ('programovani', 'Knihovny a volání API v kódu'): 'praktická dovednost',
 ('programovani', 'Čtení a hodnocení AI kódu'): 'praktická dovednost',
 ('programovani', 'Blokové vs. textové programování'): 'praktická dovednost',
 ('data-databaze', 'Datová gramotnost'): 'teoretický základ',
 ('data-databaze', 'Datový cyklus'): 'teoretický základ',
 ('data-databaze', 'Strukturovaná vs. nestrukturovaná data'): 'teoretický základ',
 ('data-databaze', 'Tabulky a relační model'): 'teoretický základ',
 ('data-databaze', 'Statistická gramotnost'): 'teoretický základ',
 ('data-databaze', 'Účel informačních systémů'): 'teoretický základ',
 ('tvorba-webu', 'Jak funguje web'): 'teoretický základ',
 ('tvorba-aplikaci', 'Co je aplikace'): 'teoretický základ',
 ('tvorba-obsahu', 'Vizuální jazyk'): 'teoretický základ',
 ('herni-vyvoj', 'Herní smyčka, scéna a objekty'): 'teoretický základ',
 ('herni-vyvoj', 'Vstup hráče, stavy a skóre'): 'teoretický základ',
 ('herni-vyvoj', 'Kolize a jednoduchá fyzika'): 'teoretický základ',
 ('herni-vyvoj', 'Herní design'): 'teoretický základ',
 ('fyzicky-computing', 'Vstup–zpracování–výstup na zařízení'): 'teoretický základ',
 ('fyzicky-computing', 'Senzory a aktuátory'): 'teoretický základ',
 ('kyberbezpecnost', 'Šifrování a HTTPS'): 'teoretický základ',
 ('kyberbezpecnost', 'Typy útoků'): 'teoretický základ',
 ('umela-inteligence', 'Co je a co není AI'): 'teoretický základ',
 ('umela-inteligence', 'Jak funguje generativní model'): 'teoretický základ',
 ('umela-inteligence', 'Pět velkých idejí AI'): 'teoretický základ',
 ('umela-inteligence', 'Jak fungují chatboti (LLM, RAG)'): 'teoretický základ',
 ('umela-inteligence', 'AI se učí z dat'): 'teoretický základ',
 ('umela-inteligence', 'Typy AI úloh'): 'teoretický základ',
 ('umela-inteligence', 'Doporučovací systémy'): 'teoretický základ',
 ('umela-inteligence', 'Prompt a promptová gramotnost'): 'praktická dovednost',
 ('umela-inteligence', 'Ověřování výstupů'): 'praktická dovednost',
 ('umela-inteligence', 'Strojové učení prakticky'): 'praktická dovednost',
 ('digitalni-obcanstvi', 'Jak fungují algoritmy sítí'): 'teoretický základ',
 ('digitalni-obcanstvi', 'Rozumět AI (halucinace, bias)'): 'teoretický základ',
 ('digitalni-obcanstvi', 'Kritické myšlení online'): 'praktická dovednost',
 ('digitalni-obcanstvi', 'Dezinformace a manipulace'): 'praktická dovednost',
 ('digitalni-obcanstvi', 'Rozpoznání AI obsahu'): 'praktická dovednost',
 ('digitalni-obcanstvi', 'Aktivní digitální občanství'): 'praktická dovednost',
}
# (A) optiky / průřezová velká témata a hodnoty
LENS = {
 'soukromí': [
  ('digitalni-zaklady', 'Kde jsou data fyzicky'),
  ('umela-inteligence', 'Soukromí při práci s AI'), ('umela-inteligence', 'Doporučovací systémy'),
  ('kyberbezpecnost', 'Soukromí a digitální stopa'), ('kyberbezpecnost', 'Bezpečné chování na sítích'), ('kyberbezpecnost', 'Sextortion a citlivý obsah'),
  ('tvorba-aplikaci', 'Databáze a autentizace'),
  ('digitalni-obcanstvi', 'Digitální stopa a soukromí'), ('digitalni-obcanstvi', 'Právo a etika'), ('digitalni-obcanstvi', 'Obchodní modely platforem'),
 ],
 'bezpečí a rizika': [
  ('kyberbezpecnost', 'Hesla a 2FA'), ('kyberbezpecnost', 'Phishing a sociální inženýrství'), ('kyberbezpecnost', 'Bezpečné chování na sítích'), ('kyberbezpecnost', 'Základní hygiena'), ('kyberbezpecnost', 'Šifrování a HTTPS'), ('kyberbezpecnost', 'Typy útoků'), ('kyberbezpecnost', 'AI podvody'), ('kyberbezpecnost', 'Sextortion a citlivý obsah'), ('kyberbezpecnost', 'Ověřování přes druhý kanál'), ('kyberbezpecnost', 'Síťová bezpečnost a CTF'),
  ('umela-inteligence', 'Deepfakes a syntetická média'), ('umela-inteligence', 'Soukromí při práci s AI'),
  ('digitalni-zaklady', 'Kde jsou data fyzicky'),
  ('tvorba-obsahu', 'Původ obsahu a vodoznaky'),
  ('tvorba-aplikaci', 'Databáze a autentizace'), ('tvorba-aplikaci', 'Iluze, že to umím'),
 ],
 'etika a odpovědnost': [
  ('umela-inteligence', 'Kdy AI (ne)použít a disclosure'), ('umela-inteligence', 'Hlubší etika AI'),
  ('tvorba-obsahu', 'Etika, autorství a označování'),
  ('tvorba-aplikaci', 'Iluze, že to umím'),
  ('digitalni-obcanstvi', 'Etika AI ve škole'), ('digitalni-obcanstvi', 'Právo a etika'), ('digitalni-obcanstvi', 'Aktivní digitální občanství'),
  ('kyberbezpecnost', 'Síťová bezpečnost a CTF'),
 ],
 'férovost a předpojatost': [
  ('umela-inteligence', 'Bias a férovost'), ('umela-inteligence', 'AI se učí z dat'),
  ('data-databaze', 'Statistická gramotnost'), ('data-databaze', 'Čištění reálných dat'),
  ('digitalni-obcanstvi', 'Dezinformace a manipulace'), ('digitalni-obcanstvi', 'Jak fungují algoritmy sítí'),
 ],
 'lidský dohled a agency': [
  ('umela-inteligence', 'Vlastní agency'), ('umela-inteligence', 'Kdy AI (ne)použít a disclosure'), ('umela-inteligence', 'Ověřování výstupů'),
  ('tvorba-aplikaci', 'Iluze, že to umím'), ('tvorba-aplikaci', 'Vibecoding'),
  ('programovani', 'Čtení a hodnocení AI kódu'),
  ('digitalni-obcanstvi', 'Rozumět AI (halucinace, bias)'),
 ],
 'důvěra a ověřování': [
  ('umela-inteligence', 'Ověřování výstupů'), ('umela-inteligence', 'Jak funguje generativní model'), ('umela-inteligence', 'Deepfakes a syntetická média'),
  ('data-databaze', 'Datová gramotnost'), ('data-databaze', 'Statistická gramotnost'), ('data-databaze', 'Analýza dat pomocí AI'), ('data-databaze', 'Vizualizace a volba grafu'),
  ('kyberbezpecnost', 'Phishing a sociální inženýrství'), ('kyberbezpecnost', 'Ověřování přes druhý kanál'), ('kyberbezpecnost', 'AI podvody'),
  ('tvorba-obsahu', 'Původ obsahu a vodoznaky'),
  ('digitalni-obcanstvi', 'Kritické myšlení online'), ('digitalni-obcanstvi', 'Dezinformace a manipulace'), ('digitalni-obcanstvi', 'Rozpoznání AI obsahu'), ('digitalni-obcanstvi', 'Rozumět AI (halucinace, bias)'),
  ('programovani', 'Čtení a hodnocení AI kódu'),
  ('informaticke-mysleni', 'Hodnocení a analýza chyb'),
 ],
 'dopad na společnost': [
  ('umela-inteligence', 'AI a společnost'), ('umela-inteligence', 'Doporučovací systémy'),
  ('data-databaze', 'Účel informačních systémů'),
  ('digitalni-obcanstvi', 'Jak fungují algoritmy sítí'), ('digitalni-obcanstvi', 'Obchodní modely platforem'), ('digitalni-obcanstvi', 'Aktivní digitální občanství'), ('digitalni-obcanstvi', 'Právo a etika'), ('digitalni-obcanstvi', 'Dezinformace a manipulace'),
 ],
 'pozornost a wellbeing': [
  ('digitalni-obcanstvi', 'Digitální wellbeing'), ('digitalni-obcanstvi', 'Jak fungují algoritmy sítí'), ('digitalni-obcanstvi', 'Obchodní modely platforem'),
  ('umela-inteligence', 'Doporučovací systémy'), ('umela-inteligence', 'Kdy AI (ne)použít a disclosure'), ('umela-inteligence', 'Vlastní agency'),
  ('kyberbezpecnost', 'Sextortion a citlivý obsah'),
 ],
 'udržitelnost': [
  ('umela-inteligence', 'Hlubší etika AI'), ('umela-inteligence', 'AI se učí z dat'),
  ('digitalni-zaklady', 'Kde jsou data fyzicky'), ('digitalni-zaklady', 'Cloud a server'),
 ],
 'moc a peníze': [
  ('digitalni-obcanstvi', 'Obchodní modely platforem'), ('digitalni-obcanstvi', 'Jak fungují algoritmy sítí'),
  ('umela-inteligence', 'AI a společnost'), ('umela-inteligence', 'Doporučovací systémy'),
  ('tvorba-obsahu', 'Etika, autorství a označování'), ('tvorba-obsahu', 'Generativní hudba a hlas'),
 ],
}
LENS_KEY = {}
for _tag, _members in LENS.items():
    for _m in _members:
        LENS_KEY.setdefault(_m, set()).add(_tag)

def tags_for(tema, nazev):
    tags = set(LENS_KEY.get((tema, nazev), set()))
    nat = NATURE_OVERRIDE.get((tema, nazev), NATURE_DEFAULT.get(tema))
    if nat:
        tags.add(nat)
    return sorted(tags)

# ---- Sestavení ----
def cid(tema, nazev):
    return slug(tema) + '-' + slug(nazev)

# ověř unikátnost + rejstřík
index = set()
for tema, lst in C.items():
    for row in lst:
        index.add(cid(tema, row[0]))

concepts = []
problems = []
_tagkeys = [m for members in LENS.values() for m in members] + list(NATURE_OVERRIDE)
for _k in list(OBLAST_DOPLNENI) + list(KDI_MAP) + list(RVP_MAP) + _tagkeys:
    if cid(*_k) not in index:
        problems.append('MAP klíč neexistuje: ' + str(_k))
for tema, lst in C.items():
    for (nazev, vrstva, popis, rvp_obl, rvpkeys, tagy, prereq, souvisi) in lst:
        cidv = cid(tema, nazev)
        rvp_obl = OBLAST_DOPLNENI.get((tema, nazev), rvp_obl)  # doplňkové zařazení do okruhu
        rvpkeys = RVP_MAP.get((tema, nazev), [])  # autoritativní přiřazení výstupů RVP (v0.10)
        rvp_list = []
        for k in rvpkeys:
            kod, vyst = RVP[k]
            rvp_list.append({'kod': kod, 'vystup': vyst})
        prereq_ids = []
        for (pt, pn) in prereq:
            rid = cid(pt, pn)
            if rid not in index: problems.append(f'PREREQ dangling: {cidv} -> {rid}')
            prereq_ids.append(rid)
        souvisi_ids = []
        for (st, sn) in souvisi:
            rid = cid(st, sn)
            if rid not in index: problems.append(f'SOUVISI dangling: {cidv} -> {rid}')
            souvisi_ids.append(rid)
        rec = {
            'id': cidv,
            'nazev': nazev,
            'tema': tema,           # seskupení podle obsahových témat (nové)
            'oblast': rvp_obl,      # seskupení podle oblastí RVP (null = průřezové)
            'kompetence': KDI_MAP.get((tema, nazev)),  # seskupení podle klíčové kompetence digitální (null = nezařazeno)
            'vrstva': vrstva,
            'popis': popis,
            'rvp': rvp_list,
            'cile': (CILE_KRITERIA.get(nazev) or {}).get('cile', []),        # výukové cíle (Bloom)
            'kriteria': (CILE_KRITERIA.get(nazev) or {}).get('kriteria', []), # kritéria hodnocení
            'prerekvizity': prereq_ids,
            'souvisi': souvisi_ids,
            'tagy': tags_for(tema, nazev),
            'zdroj': ([ZDROJ_RVP] if rvp_list else []),
            'pokryti_glitchem': [],
            'stav': 'draft',
        }
        if nazev in CILE_KRITERIA:
            _CK_USED.add(nazev)
        else:
            problems.append('CÍLE chybí pro koncept: ' + nazev)
        concepts.append(rec)

# klíče v cile_kriteria_merged.json, které neodpovídají žádnému konceptu
for _k in set(CILE_KRITERIA) - _CK_USED:
    problems.append('CÍLE nepřiřazený klíč (není koncept): ' + _k)
# ověření Bloom úrovní
_BLOOM = {"zapamatovani","porozumeni","aplikace","analyza","hodnoceni","tvorba"}
for _c in concepts:
    for _item in _c['cile'] + _c['kriteria']:
        if _item.get('uroven') not in _BLOOM:
            problems.append('CÍLE špatná úroveň u ' + _c['nazev'] + ': ' + str(_item.get('uroven')))

# ================= OBOHACENÍ PROPOJENÍ (v0.2) =================
# Cíl: témata nemají být ostrovy. Přidáváme (a) mezitématické prerekvizity
# (scaffolding "nauč se X, než začneš Y") a (b) širší "souvisí" síť napříč
# tématy, včetně realizace AI průřezové vrstvy jako hran.
byid = {c['id']: c for c in concepts}
edge_errors = []
def rid(spec):
    i = cid(spec[0], spec[1])
    if i not in byid:
        edge_errors.append('NEEXISTUJE: ' + str(spec) + ' -> ' + i)
    return i

# (dítě, rodič) — rodič PŘEDCHÁZÍ dítě (přidá se do dite.prerekvizity)
EXTRA_PREREQ = [
 # prohloubení uvnitř témat + napojení dosud izolovaných uzlů
 (('informaticke-mysleni','Algoritmus'), ('informaticke-mysleni','Rozpoznávání vzorů')),
 (('programovani','Ladění a testování'), ('programovani','Cykly v kódu')),
 (('data-databaze','Dotazování (SQL)'), ('data-databaze','Strukturovaná vs. nestrukturovaná data')),
 (('kyberbezpecnost','Bezpečné chování na sítích'), ('kyberbezpecnost','Hesla a 2FA')),
 # programování staví na informatickém myšlení a základech
 (('programovani','Cykly v kódu'), ('informaticke-mysleni','Řízení toku')),
 (('programovani','Podmínky v kódu'), ('informaticke-mysleni','Logika a booleovské výrazy')),
 (('programovani','Funkce a procedury'), ('informaticke-mysleni','Dekompozice')),
 (('programovani','Blokové vs. textové programování'), ('informaticke-mysleni','Algoritmus')),
 (('programovani','Knihovny a volání API v kódu'), ('digitalni-zaklady','API')),
 # data staví na základech
 (('data-databaze','Datová gramotnost'), ('digitalni-zaklady','Data a informace')),
 (('data-databaze','Strukturovaná vs. nestrukturovaná data'), ('digitalni-zaklady','Reprezentace dat')),
 # AI staví na datech
 (('umela-inteligence','AI se učí z dat'), ('data-databaze','Datová gramotnost')),
 (('umela-inteligence','Strojové učení prakticky'), ('data-databaze','Datový cyklus')),
 # weby staví na programování a základech
 (('tvorba-webu','Jak funguje web'), ('digitalni-zaklady','Internet a síť')),
 (('tvorba-webu','Doména a hosting'), ('digitalni-zaklady','Cloud a server')),
 (('tvorba-webu','Interaktivita (JavaScript)'), ('programovani','Události')),
 (('tvorba-webu','Frameworky'), ('programovani','Funkce a procedury')),
 # aplikace staví na programování, webu a AI
 (('tvorba-aplikaci','Logika aplikace'), ('programovani','Podmínky v kódu')),
 (('tvorba-aplikaci','Vibecoding'), ('umela-inteligence','Prompt a promptová gramotnost')),
 (('tvorba-aplikaci','Vibecoding'), ('programovani','Čtení a hodnocení AI kódu')),
 (('tvorba-aplikaci','Práce s API a backendem'), ('digitalni-zaklady','API')),
 (('tvorba-aplikaci','Databáze a autentizace'), ('data-databaze','Tabulky a relační model')),
 (('tvorba-aplikaci','Životní cyklus vývoje'), ('programovani','Verzování kódu')),
 # tvorba obsahu staví na AI
 (('tvorba-obsahu','Prompt pro média'), ('umela-inteligence','Prompt a promptová gramotnost')),
 (('tvorba-obsahu','Generativní obraz'), ('umela-inteligence','Jak funguje generativní model')),
 (('tvorba-obsahu','Generativní video'), ('umela-inteligence','Deepfakes a syntetická média')),
 # hry staví na myšlení a programování
 (('herni-vyvoj','Herní smyčka, scéna a objekty'), ('informaticke-mysleni','Řízení toku')),
 (('herni-vyvoj','Vstup hráče, stavy a skóre'), ('programovani','Události')),
 (('herni-vyvoj','Skutečné enginy'), ('programovani','Základy objektů (OOP)')),
 (('herni-vyvoj','AI asistenti a kód'), ('programovani','Čtení a hodnocení AI kódu')),
 # fyzický computing staví na programování a AI
 (('fyzicky-computing','micro:bit'), ('programovani','Blokové vs. textové programování')),
 (('fyzicky-computing','Události a řízení výstupu'), ('programovani','Události')),
 (('fyzicky-computing','AI přímo na zařízení (TinyML)'), ('umela-inteligence','Strojové učení prakticky')),
 (('fyzicky-computing','IoT'), ('digitalni-zaklady','Cloud a server')),
 # bezpečnost a občanství staví na základech a AI
 (('kyberbezpecnost','Šifrování a HTTPS'), ('digitalni-zaklady','Adresy a protokoly')),
 (('kyberbezpecnost','AI podvody'), ('umela-inteligence','Deepfakes a syntetická média')),
 (('digitalni-obcanstvi','Jak fungují algoritmy sítí'), ('umela-inteligence','Doporučovací systémy')),
 (('digitalni-obcanstvi','Rozumět AI (halucinace, bias)'), ('umela-inteligence','Jak funguje generativní model')),
 (('digitalni-obcanstvi','Rozpoznání AI obsahu'), ('umela-inteligence','Deepfakes a syntetická média')),
]

# (A, B) — laterální "souvisí" (napříč tématy)
EXTRA_SOUVISI = [
 # AI průřezová vrstva (nástroj + reflexe)
 (('tvorba-aplikaci','AI nástroje pro tvorbu'), ('umela-inteligence','Prompt a promptová gramotnost')),
 (('tvorba-aplikaci','AI nástroje pro tvorbu'), ('programovani','Čtení a hodnocení AI kódu')),
 (('tvorba-aplikaci','Iluze, že to umím'), ('umela-inteligence','Kdy AI (ne)použít a disclosure')),
 (('tvorba-webu','AI-asistovaná tvorba webu'), ('umela-inteligence','Ověřování výstupů')),
 (('herni-vyvoj','AI generování assetů'), ('tvorba-obsahu','Generativní obraz')),
 (('herni-vyvoj','AI asistenti a kód'), ('umela-inteligence','Ověřování výstupů')),
 (('umela-inteligence','Jak fungují chatboti (LLM, RAG)'), ('tvorba-aplikaci','AI nástroje pro tvorbu')),
 # data <-> AI
 (('data-databaze','Statistická gramotnost'), ('umela-inteligence','Bias a férovost')),
 (('data-databaze','Čištění reálných dat'), ('umela-inteligence','AI se učí z dat')),
 (('umela-inteligence','Typy AI úloh'), ('informaticke-mysleni','Modelování a simulace')),
 (('umela-inteligence','Doporučovací systémy'), ('data-databaze','Vektorové databáze')),
 (('digitalni-zaklady','Reprezentace dat'), ('umela-inteligence','AI se učí z dat')),
 # bezpečnost / etika / soukromí (překrývající se koncepty)
 (('kyberbezpecnost','Soukromí a digitální stopa'), ('digitalni-obcanstvi','Digitální stopa a soukromí')),
 (('kyberbezpecnost','AI podvody'), ('digitalni-obcanstvi','Rozpoznání AI obsahu')),
 (('kyberbezpecnost','Sextortion a citlivý obsah'), ('tvorba-obsahu','Původ obsahu a vodoznaky')),
 (('kyberbezpecnost','Ověřování přes druhý kanál'), ('umela-inteligence','Ověřování výstupů')),
 (('kyberbezpecnost','Phishing a sociální inženýrství'), ('digitalni-obcanstvi','Kritické myšlení online')),
 (('umela-inteligence','Soukromí při práci s AI'), ('digitalni-obcanstvi','Právo a etika')),
 (('umela-inteligence','Hlubší etika AI'), ('digitalni-obcanstvi','Právo a etika')),
 (('umela-inteligence','Bias a férovost'), ('digitalni-obcanstvi','Dezinformace a manipulace')),
 (('tvorba-obsahu','Původ obsahu a vodoznaky'), ('digitalni-obcanstvi','Rozpoznání AI obsahu')),
 (('tvorba-obsahu','Etika, autorství a označování'), ('digitalni-obcanstvi','Etika AI ve škole')),
 (('tvorba-obsahu','Generativní hudba a hlas'), ('kyberbezpecnost','AI podvody')),
 # ekonomika pozornosti / wellbeing
 (('digitalni-obcanstvi','Obchodní modely platforem'), ('digitalni-obcanstvi','Digitální wellbeing')),
 (('digitalni-obcanstvi','Digitální wellbeing'), ('umela-inteligence','Doporučovací systémy')),
 (('umela-inteligence','AI a společnost'), ('digitalni-obcanstvi','Dezinformace a manipulace')),
 (('herni-vyvoj','Herní design'), ('digitalni-obcanstvi','Digitální wellbeing')),
 # web / aplikace / cloud / design
 (('tvorba-webu','Nasazení webu'), ('digitalni-zaklady','Cloud a server')),
 (('tvorba-webu','Doména a hosting'), ('digitalni-zaklady','Adresy a protokoly')),
 (('tvorba-webu','UX/UI a design webu'), ('tvorba-obsahu','Vizuální jazyk')),
 (('tvorba-webu','Nasazení webu'), ('tvorba-aplikaci','Publikace do app storů')),
 (('tvorba-webu','Přístupnost a SEO'), ('digitalni-obcanstvi','Aktivní digitální občanství')),
 (('tvorba-aplikaci','Databáze a autentizace'), ('kyberbezpecnost','Hesla a 2FA')),
 (('data-databaze','Účel informačních systémů'), ('tvorba-aplikaci','Databáze a autentizace')),
 (('programovani','Verzování kódu'), ('herni-vyvoj','Publikace hry')),
 # informatické myšlení jako průřez
 (('informaticke-mysleni','Rozpoznávání vzorů'), ('umela-inteligence','AI se učí z dat')),
 (('informaticke-mysleni','Abstrakce'), ('digitalni-zaklady','Vrstvy počítače')),
 (('informaticke-mysleni','Dekompozice'), ('programovani','Funkce a procedury')),
 (('informaticke-mysleni','Efektivita řešení'), ('programovani','Ladění a testování')),
 (('informaticke-mysleni','Základní algoritmy'), ('programovani','Seznamy a kolekce')),
 # data <-> mediální gramotnost
 (('data-databaze','Datová gramotnost'), ('digitalni-obcanstvi','Kritické myšlení online')),
 (('data-databaze','Statistická gramotnost'), ('digitalni-obcanstvi','Kritické myšlení online')),
 # robotika / IoT
 (('fyzicky-computing','Senzory a aktuátory'), ('umela-inteligence','Pět velkých idejí AI')),
 (('fyzicky-computing','Komunikace mezi zařízeními'), ('digitalni-zaklady','Internet a síť')),
 (('fyzicky-computing','IoT'), ('digitalni-zaklady','Kde jsou data fyzicky')),
 # ostatní
 (('digitalni-zaklady','Data a informace'), ('digitalni-obcanstvi','Digitální stopa a soukromí')),

 # ===== v0.12: prohloubení „souvisí" — mezitématické mosty, konec izolovaných uzlů =====
 # Princip: souvisí = tentýž pojem v jiném kontextu / dva koncepty, které se navzájem osvětlují.
 # (Není to prerekvizita = pořadí, ani tag = široká kategorie. Prereq-kolize build odfiltruje.)

 # základy: HW/SW, API, OS, sítě, reprezentace jako opakující se motivy
 (('digitalni-zaklady','Hardware a software'), ('fyzicky-computing','Vstup–zpracování–výstup na zařízení')),
 (('digitalni-zaklady','Hardware a software'), ('tvorba-aplikaci','Co je aplikace')),
 (('digitalni-zaklady','Hardware a software'), ('fyzicky-computing','Arduino a Raspberry Pi')),
 (('digitalni-zaklady','API'), ('tvorba-webu','Jak funguje web')),
 (('digitalni-zaklady','API'), ('data-databaze','Účel informačních systémů')),
 (('digitalni-zaklady','Operační systém a soubory'), ('digitalni-zaklady','Kde jsou data fyzicky')),
 (('digitalni-zaklady','Operační systém a soubory'), ('digitalni-zaklady','Reprezentace dat')),
 (('digitalni-zaklady','Reprezentace dat'), ('programovani','Proměnné a datové typy')),
 (('digitalni-zaklady','Reprezentace dat'), ('data-databaze','Strukturovaná vs. nestrukturovaná data')),
 (('tvorba-webu','Jak funguje web'), ('digitalni-zaklady','Adresy a protokoly')),

 # informatické myšlení: algoritmus a schémata jako průřezový pojem (i ve společnosti)
 (('informaticke-mysleni','Algoritmus'), ('digitalni-obcanstvi','Jak fungují algoritmy sítí')),
 (('informaticke-mysleni','Pseudokód a vývojové diagramy'), ('programovani','Blokové vs. textové programování')),
 (('informaticke-mysleni','Pseudokód a vývojové diagramy'), ('informaticke-mysleni','Modelování a simulace')),
 (('informaticke-mysleni','Logika a booleovské výrazy'), ('data-databaze','Dotazování (SQL)')),
 (('informaticke-mysleni','Logika a booleovské výrazy'), ('herni-vyvoj','Kolize a jednoduchá fyzika')),
 (('informaticke-mysleni','Modelování a simulace'), ('herni-vyvoj','Kolize a jednoduchá fyzika')),
 (('informaticke-mysleni','Dekompozice'), ('tvorba-aplikaci','Logika aplikace')),
 (('informaticke-mysleni','Rozpoznávání vzorů'), ('umela-inteligence','Strojové učení prakticky')),
 (('informaticke-mysleni','Efektivita řešení'), ('informaticke-mysleni','Základní algoritmy')),
 (('informaticke-mysleni','Hodnocení a analýza chyb'), ('umela-inteligence','Ověřování výstupů')),

 # programování: smyčky, události, objekty, kolekce jako opakující se motivy
 (('programovani','Cykly v kódu'), ('herni-vyvoj','Herní smyčka, scéna a objekty')),
 (('programovani','Cykly v kódu'), ('informaticke-mysleni','Základní algoritmy')),
 (('programovani','Proměnné a datové typy'), ('herni-vyvoj','Vstup hráče, stavy a skóre')),
 (('programovani','Události'), ('fyzicky-computing','Senzory a aktuátory')),
 (('programovani','Události'), ('herni-vyvoj','Kolize a jednoduchá fyzika')),
 (('programovani','Knihovny a volání API v kódu'), ('tvorba-aplikaci','Práce s API a backendem')),
 (('programovani','Knihovny a volání API v kódu'), ('tvorba-webu','Frameworky')),
 (('programovani','Základy objektů (OOP)'), ('herni-vyvoj','Herní smyčka, scéna a objekty')),
 (('programovani','Seznamy a kolekce'), ('data-databaze','Tabulky a relační model')),
 (('programovani','Funkce a procedury'), ('informaticke-mysleni','Základní algoritmy')),

 # AI: pojmy provázané napříč tvorbou, daty a občanstvím
 (('umela-inteligence','Co je a co není AI'), ('digitalni-obcanstvi','Rozumět AI (halucinace, bias)')),
 (('umela-inteligence','Co je a co není AI'), ('umela-inteligence','AI a společnost')),
 (('umela-inteligence','Jak funguje generativní model'), ('tvorba-obsahu','Prompt pro média')),
 (('umela-inteligence','Jak funguje generativní model'), ('umela-inteligence','Typy AI úloh')),
 (('umela-inteligence','Vlastní agency'), ('tvorba-aplikaci','Iluze, že to umím')),
 (('umela-inteligence','Vlastní agency'), ('programovani','Čtení a hodnocení AI kódu')),
 (('umela-inteligence','Vlastní agency'), ('digitalni-obcanstvi','Digitální wellbeing')),
 (('umela-inteligence','Strojové učení prakticky'), ('data-databaze','Čištění reálných dat')),
 (('umela-inteligence','Deepfakes a syntetická média'), ('tvorba-obsahu','Původ obsahu a vodoznaky')),
 (('umela-inteligence','Deepfakes a syntetická média'), ('digitalni-obcanstvi','Dezinformace a manipulace')),
 (('umela-inteligence','Ověřování výstupů'), ('digitalni-obcanstvi','Kritické myšlení online')),
 (('umela-inteligence','Typy AI úloh'), ('fyzicky-computing','AI přímo na zařízení (TinyML)')),

 # data: cyklus, struktura, dotazy a AI-analýza provázané
 (('data-databaze','Datový cyklus'), ('data-databaze','Strukturovaná vs. nestrukturovaná data')),
 (('data-databaze','Datový cyklus'), ('data-databaze','Analýza dat pomocí AI')),
 (('data-databaze','Strukturovaná vs. nestrukturovaná data'), ('data-databaze','NoSQL a dokumentové databáze')),
 (('data-databaze','Dotazování (SQL)'), ('data-databaze','Programová analýza dat')),
 (('data-databaze','NoSQL a dokumentové databáze'), ('umela-inteligence','Jak fungují chatboti (LLM, RAG)')),
 (('data-databaze','Analýza dat pomocí AI'), ('data-databaze','Vizualizace a volba grafu')),

 # web/aplikace: HTML/CSS/JS a vazby na tvorbu obsahu a hry
 (('tvorba-webu','HTML'), ('tvorba-obsahu','Vizuální jazyk')),
 (('tvorba-webu','CSS'), ('tvorba-obsahu','Vizuální jazyk')),
 (('tvorba-webu','CSS'), ('tvorba-webu','Přístupnost a SEO')),
 (('tvorba-webu','Interaktivita (JavaScript)'), ('tvorba-aplikaci','Logika aplikace')),
 (('tvorba-webu','Interaktivita (JavaScript)'), ('herni-vyvoj','Vstup hráče, stavy a skóre')),
 (('tvorba-webu','Frameworky'), ('tvorba-aplikaci','No-code / low-code')),
 (('tvorba-aplikaci','Co je aplikace'), ('tvorba-webu','Jak funguje web')),
 (('tvorba-aplikaci','Co je aplikace'), ('data-databaze','Účel informačních systémů')),
 (('tvorba-aplikaci','No-code / low-code'), ('tvorba-aplikaci','Vibecoding')),
 (('tvorba-aplikaci','Práce s API a backendem'), ('digitalni-zaklady','Cloud a server')),
 (('tvorba-aplikaci','Životní cyklus vývoje'), ('programovani','Ladění a testování')),
 (('tvorba-aplikaci','Životní cyklus vývoje'), ('tvorba-aplikaci','Publikace do app storů')),

 # tvorba obsahu: řetězení médií a kontrola nad výsledkem
 (('tvorba-obsahu','Prompt pro média'), ('tvorba-obsahu','Kontrola nad výsledkem')),
 (('tvorba-obsahu','Generativní video'), ('tvorba-obsahu','Střih a postprodukce s AI')),
 (('tvorba-obsahu','Generativní video'), ('tvorba-obsahu','Propojení nástrojů (obraz, video, zvuk)')),
 (('tvorba-obsahu','Střih a postprodukce s AI'), ('tvorba-obsahu','Propojení nástrojů (obraz, video, zvuk)')),
 (('tvorba-obsahu','Kontrola nad výsledkem'), ('tvorba-aplikaci','Iluze, že to umím')),
 (('tvorba-obsahu','Kontrola nad výsledkem'), ('umela-inteligence','Ověřování výstupů')),
 (('tvorba-obsahu','Propojení nástrojů (obraz, video, zvuk)'), ('tvorba-aplikaci','Práce s API a backendem')),

 # herní vývoj: enginy a vstupní nástroje
 (('herni-vyvoj','Lehké enginy'), ('herni-vyvoj','Scratch jako vstup')),
 (('herni-vyvoj','Lehké enginy'), ('programovani','Blokové vs. textové programování')),
 (('herni-vyvoj','Skutečné enginy'), ('tvorba-webu','Frameworky')),

 # fyzický computing: zařízení, roboti, IoT, TinyML
 (('fyzicky-computing','Vstup–zpracování–výstup na zařízení'), ('fyzicky-computing','Roboti a vozítka')),
 (('fyzicky-computing','micro:bit'), ('herni-vyvoj','Scratch jako vstup')),
 (('fyzicky-computing','micro:bit'), ('programovani','Blokové vs. textové programování')),
 (('fyzicky-computing','Události a řízení výstupu'), ('fyzicky-computing','Senzory a aktuátory')),
 (('fyzicky-computing','Události a řízení výstupu'), ('tvorba-webu','Interaktivita (JavaScript)')),
 (('fyzicky-computing','Arduino a Raspberry Pi'), ('fyzicky-computing','Roboti a vozítka')),
 (('fyzicky-computing','Arduino a Raspberry Pi'), ('fyzicky-computing','IoT')),
 (('fyzicky-computing','Roboti a vozítka'), ('fyzicky-computing','Senzory a aktuátory')),
 (('fyzicky-computing','AI přímo na zařízení (TinyML)'), ('fyzicky-computing','Senzory a aktuátory')),
 (('fyzicky-computing','AI přímo na zařízení (TinyML)'), ('fyzicky-computing','IoT')),

 # kyberbezpečnost: hygiena, útoky, šifrování jako propojená síť
 (('kyberbezpecnost','Základní hygiena'), ('kyberbezpecnost','Hesla a 2FA')),
 (('kyberbezpecnost','Bezpečné chování na sítích'), ('kyberbezpecnost','Phishing a sociální inženýrství')),
 (('kyberbezpecnost','Bezpečné chování na sítích'), ('kyberbezpecnost','Základní hygiena')),
 (('kyberbezpecnost','Typy útoků'), ('kyberbezpecnost','Phishing a sociální inženýrství')),
 (('kyberbezpecnost','Typy útoků'), ('kyberbezpecnost','Bezpečné chování na sítích')),
 (('kyberbezpecnost','Šifrování a HTTPS'), ('tvorba-webu','Jak funguje web')),
 (('kyberbezpecnost','Šifrování a HTTPS'), ('kyberbezpecnost','Hesla a 2FA')),
 (('kyberbezpecnost','Síťová bezpečnost a CTF'), ('kyberbezpecnost','Šifrování a HTTPS')),
 (('kyberbezpecnost','Síťová bezpečnost a CTF'), ('digitalni-zaklady','Internet a síť')),
 (('kyberbezpecnost','Síťová bezpečnost a CTF'), ('digitalni-zaklady','Adresy a protokoly')),

 # digitální občanství: algoritmy a porozumění AI napříč
 (('digitalni-obcanstvi','Jak fungují algoritmy sítí'), ('digitalni-obcanstvi','Digitální wellbeing')),
 (('digitalni-obcanstvi','Jak fungují algoritmy sítí'), ('umela-inteligence','Bias a férovost')),
 (('digitalni-obcanstvi','Rozumět AI (halucinace, bias)'), ('umela-inteligence','Bias a férovost')),
 (('digitalni-obcanstvi','Rozumět AI (halucinace, bias)'), ('umela-inteligence','Ověřování výstupů')),
]

for child, parent in EXTRA_PREREQ:
    ci, pi = rid(child), rid(parent)
    if ci in byid and pi in byid and ci != pi and pi not in byid[ci]['prerekvizity']:
        byid[ci]['prerekvizity'].append(pi)

for a, b in EXTRA_SOUVISI:
    ai_, bi_ = rid(a), rid(b)
    if ai_ in byid and bi_ in byid and ai_ != bi_ and bi_ not in byid[ai_]['souvisi']:
        byid[ai_]['souvisi'].append(bi_)

# Pozn.: dřívější hromadné generování „souvisí" z tag-vláken (v0.3) je odebráno (v0.8).
# Široké asociace teď nesou TAGY; hrany „souvisí" zůstávají jen těsné a ručně kurátorské
# (inline u konceptů + EXTRA_SOUVISI) — v souladu s vrstvením „hrany = pár, tagy = šíře".

# --- dedup: souvisí nesmí duplikovat prerekvizitu (ani opačně) a nesmí být symetricky dvakrát ---
prereq_pairs = set()
for c in concepts:
    for p in c['prerekvizity']:
        prereq_pairs.add(frozenset((c['id'], p)))
seen_s = set()
for c in concepts:
    keep = []
    for s in c['souvisi']:
        key = frozenset((c['id'], s))
        if key in prereq_pairs or key in seen_s or s == c['id']:
            continue
        seen_s.add(key); keep.append(s)
    c['souvisi'] = keep

# --- kontrola: cyklus v prerekvizitách (má být DAG) ---
graph = {c['id']: list(c['prerekvizity']) for c in concepts}
WHITE, GRAY, BLACK = 0, 1, 2
color = {n: WHITE for n in graph}
cycles = []
def dfs(n, stack):
    color[n] = GRAY
    for m in graph.get(n, []):
        if color[m] == GRAY:
            cycles.append(stack + [m])
        elif color[m] == WHITE:
            dfs(m, stack + [m])
    color[n] = BLACK
for n in graph:
    if color[n] == WHITE:
        dfs(n, [n])
if edge_errors:
    print('CHYBY HRAN:', edge_errors)
if cycles:
    print('POZOR, cykly v prerekvizitách:', cycles[:5])

areas = [{'id': i, 'nazev': n, 'kod': k, 'popis': p, 'barva': b} for (i, n, k, p, b) in RVP_OBLASTI]
kompetence_list = [{'id': i, 'nazev': n, 'kod': k, 'vystup': v, 'barva': b} for (i, n, k, v, b) in KOMPETENCE]
from collections import Counter as _Counter
_tagcount = _Counter(t for c in concepts for t in c['tagy'])
tagy_list = [{'tag': t, 'pocet': n} for t, n in _tagcount.most_common()]
temata = [{'id': i, 'nazev': n, 'vrstva_mapy': v, 'popis': p, 'barva': b, 'navazuje_na': nn}
          for (i, n, v, p, b, nn) in TEMATA]

data = {
    'meta': {
        'verze': '0.12-draft',
        'popis': 'Mapa znalostí Glitch. Dvojí seskupení konceptů: podle tema (obsahová témata) a podle oblast (okruhy RVP Informatika). RVP znění doslovně z RVP_revidované_2024-03-28.pdf.',
        'paleta': ['#ffff00', '#ffffff', '#000000'],
        'uroven': '2. stupeň ZŠ s přesahem výš',
        'kompetence_popis': KDI_POPIS,
    },
    'areas': areas,
    'temata': temata,
    'kompetence': kompetence_list,
    'tagy': tagy_list,
    'concepts': concepts,
}

with open('knowledge-map.yaml', 'w', encoding='utf-8') as f:
    f.write('# Mapa znalostí Glitch — vygenerováno build_map.py\n')
    f.write('# RVP znění je doslovné z RVP_revidované_2024-03-28.pdf (nevymýšlet).\n')
    yaml.safe_dump(data, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=False)

# ---- statistiky + kontrola ----
from collections import Counter
per_tema = Counter(c['tema'] for c in concepts)
per_obl = Counter(c['oblast'] for c in concepts)
with_rvp = sum(1 for c in concepts if c['rvp'])
covered = set(r['kod'] for c in concepts for r in c['rvp'])
print('KONCEPTŮ celkem:', len(concepts))
print('podle tématu:', dict(per_tema))
print('podle rvp_oblast:', dict(per_obl))
print('podle kompetence (KDI):', dict(Counter(c['kompetence'] for c in concepts)))
print('konceptů s RVP výstupem:', with_rvp)
print('pokryté RVP kódy:', len(covered), '/ 12')
missing = [RVP[k][0] for k in RVP if RVP[k][0] not in covered]
print('NEPOKRYTÉ RVP kódy:', missing)
print('PROBLÉMY (dangling):', problems if problems else 'žádné')