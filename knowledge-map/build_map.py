# -*- coding: utf-8 -*-
"""Generátor knowledge-map.yaml pro appku Mapa znalostí Glitch.
Sestavuje RVP oblasti, témata a koncepty (dvojí seskupení: tema + rvp_oblast).
RVP znění je doslovně opsané z RVP_revidované_2024-03-28.pdf, s. 54-55."""
import re, unicodedata, yaml

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
RVP_OBLASTI = [
 ('data-modelovani', 'Data, informace a modelování', 'INF-INF-001',
  'Práce s daty a informacemi, jejich kódování, modelování situací a základy strojového učení.', '#ffff00'),
 ('algoritmizace', 'Algoritmizace a programování', 'INF-INF-002',
  'Rozklad problému, návrh a čtení algoritmů a tvorba programů.', '#ffffff'),
 ('informacni-systemy', 'Informační systémy', 'INF-INF-003',
  'Účel a užitečnost informačních systémů, evidence a automatické zpracování dat.', '#ffff00'),
 ('digitalni-technologie', 'Digitální technologie', 'INF-INF-004',
  'Hardware, software, sítě a bezpečné zacházení se zařízeními a daty.', '#ffffff'),
]

# ---- Témata (vlastní obsahová struktura Glitch) ----
# (id, nazev, vrstva_mapy, popis, barva, navazuje_na[theme ids])
TEMATA = [
 ('digitalni-zaklady', 'Digitální základy', 0,
  'Jak funguje digitální svět — počítač, internet, cloud a kde „žijí" data a služby.', '#ffffff', []),
 ('informaticke-mysleni', 'Informatické myšlení a algoritmizace', 0,
  'Univerzální způsob, jak rozložit problém a popsat řešení krok za krokem — nezávisle na jazyce.', '#ffff00', []),
 ('programovani', 'Programování', 1,
  'Převod algoritmu do kódu — od bloků k textovému jazyku; v éře AI důraz na porozumění a ladění.', '#ffffff', ['informaticke-mysleni', 'digitalni-zaklady']),
 ('umela-inteligence', 'Umělá inteligence', 2,
  'Co AI je a není, jak se učí z dat, jak s ní pracovat a jak ji kriticky a eticky používat.', '#ffff00', ['digitalni-zaklady', 'data-databaze']),
 ('data-databaze', 'Data, databáze a datová gramotnost', 1,
  'Jak se data sbírají, strukturují, dotazují a kriticky čtou — a jak z nich čerpá AI.', '#ffff00', ['digitalni-zaklady']),
 ('tvorba-webu', 'Tvorba webů', 1,
  'Postav a publikuj vlastní web — od struktury a vzhledu po nasazení online.', '#ffffff', ['programovani']),
 ('tvorba-aplikaci', 'Tvorba aplikací a vibecoding', 1,
  'Od nápadu k funkční appce — s no-code nástroji i s AI jako programovacím parťákem.', '#ffffff', ['programovani', 'tvorba-webu', 'umela-inteligence']),
 ('tvorba-obsahu', 'Tvorba digitálního obsahu s AI', 1,
  'Grafika, video, hudba a hlas s generativními nástroji — a etika a autorství, co k tomu patří.', '#ffff00', ['umela-inteligence']),
 ('herni-vyvoj', 'Herní vývoj', 1,
  'Navrhni a postav vlastní hru — od bloků po engine, dnes i s AI generováním assetů.', '#ffffff', ['informaticke-mysleni', 'programovani']),
 ('fyzicky-computing', 'Fyzický computing, robotika a IoT', 1,
  'Kód, který hýbe fyzickým světem — a AI, kterou si sám natrénuješ na zařízení.', '#ffffff', ['informaticke-mysleni', 'programovani']),
 ('kyberbezpecnost', 'Kyberbezpečnost a digitální bezpečí', 3,
  'Jak chránit sebe, svá data a zařízení — ve světě, kde i podvody umí AI.', '#ffff00', ['digitalni-zaklady']),
 ('digitalni-obcanstvi', 'Digitální občanství, média a wellbeing', 3,
  'Rozumět tomu, jak fungují sítě a algoritmy, kriticky číst obsah a mít zdravý vztah k technologiím.', '#ffff00', []),
]

# ---- Koncepty ----
# Každý: (nazev, vrstva, popis, rvp_oblast|None, [rvp klíče], [tagy], [prereq (tema,nazev)], [souvisi (tema,nazev)])
C = {}  # tema -> list

C['digitalni-zaklady'] = [
 ('Hardware a software', 'core', 'Co je počítač: vstup–zpracování–výstup; rozdíl mezi fyzickým zařízením a programem.', 'digitalni-technologie', ['v011'], ['hardware','software'], [], []),
 ('Data a informace', 'core', 'Rozdíl mezi zaznamenanou hodnotou (data) a jejím významem pro nás (informace).', 'data-modelovani', ['v001'], ['data'], [], [('data-databaze','Datová gramotnost')]),
 ('Internet a síť', 'core', 'Jak spolu zařízení komunikují: klient–server, prohlížeč, přenos dat po síti.', 'digitalni-technologie', ['v011'], ['sit','internet'], [], []),
 ('Cloud a server', 'core', 'Demystifikace cloudu: cizí počítač v datovém centru, ke kterému přistupuji přes internet.', 'digitalni-technologie', [], ['cloud','sit'], [('digitalni-zaklady','Internet a síť')], []),
 ('API', 'core', 'Rozhraní, přes které spolu programy mluví — dnes i způsob, jak se volá AI.', 'digitalni-technologie', [], ['api','sit'], [('digitalni-zaklady','Cloud a server')], []),
 ('Reprezentace dat', 'navazujici', 'Jak počítač ukládá čísla, text a obraz jako bity; kódování dat pro uložení a přenos.', 'data-modelovani', ['v002'], ['data','kodovani'], [('digitalni-zaklady','Data a informace')], []),
 ('Adresy a protokoly', 'navazujici', 'HTTP/HTTPS, URL, doména, IP a DNS — jak se na internetu adresuje a komunikuje.', 'digitalni-technologie', [], ['sit','internet'], [('digitalni-zaklady','Internet a síť')], []),
 ('Vrstvy abstrakce', 'navazujici', 'Od hardwaru přes operační systém k aplikaci — proč nemusíme rozumět všemu naráz.', 'digitalni-technologie', [], ['abstrakce'], [('digitalni-zaklady','Hardware a software')], []),
 ('Operační systém a soubory', 'navazujici', 'K čemu je operační systém a jak se organizují soubory a složky.', 'digitalni-technologie', [], ['software'], [('digitalni-zaklady','Hardware a software')], []),
 ('Kde jsou data fyzicky', 'navazujici', 'Kde data reálně leží, latence a škálování — a proč na tom záleží kvůli soukromí a GDPR.', 'digitalni-technologie', [], ['cloud','soukromi'], [('digitalni-zaklady','Cloud a server')], [('kyberbezpecnost','Soukromí a digitální stopa')]),
]

C['informaticke-mysleni'] = [
 ('Dekompozice', 'core', 'Rozklad problému na menší, samostatně řešitelné části.', 'algoritmizace', ['v006'], ['dekompozice','mysleni'], [], []),
 ('Abstrakce', 'core', 'Odfiltrování nepodstatných detailů a zaměření na to podstatné.', 'algoritmizace', [], ['abstrakce','mysleni'], [], []),
 ('Rozpoznávání vzorů', 'core', 'Hledání opakování a pravidelností, které řešení zjednoduší.', 'algoritmizace', [], ['vzory','mysleni'], [], []),
 ('Algoritmus', 'core', 'Uspořádaná posloupnost kroků vedoucí k vyřešení problému.', 'algoritmizace', ['v005','v006'], ['algoritmus'], [('informaticke-mysleni','Dekompozice')], []),
 ('Řízení toku', 'core', 'Sekvence, větvení (podmínka „když–tak") a opakování (cyklus) jako stavební kameny postupu.', 'algoritmizace', ['v007'], ['rizeni-toku','opakovani','kdyz-tak'], [('informaticke-mysleni','Algoritmus')], []),
 ('Pseudokód a vývojové diagramy', 'navazujici', 'Zápis postupu srozumitelný člověku, ještě před programováním.', 'algoritmizace', [], ['postup','algoritmus'], [('informaticke-mysleni','Algoritmus')], []),
 ('Logika a booleovské výrazy', 'navazujici', 'Pravda/nepravda a spojky AND, OR, NOT jako základ rozhodování.', 'algoritmizace', [], ['logika','rizeni-toku'], [('informaticke-mysleni','Řízení toku')], []),
 ('Modelování a simulace', 'navazujici', 'Zjednodušený model situace (i graf či schéma) pro pochopení a predikci.', 'data-modelovani', ['v003'], ['model','simulace'], [('informaticke-mysleni','Abstrakce')], [('data-databaze','Vizualizace a volba grafu')]),
 ('Efektivita řešení', 'navazujici', 'Že různá řešení stojí různě — počet kroků, čas, paměť.', 'algoritmizace', [], ['efektivita','algoritmus'], [('informaticke-mysleni','Algoritmus')], []),
 ('Základní algoritmy', 'navazujici', 'Hledání a řazení jako klasické, opakovaně použitelné postupy.', 'algoritmizace', [], ['algoritmus'], [('informaticke-mysleni','Algoritmus')], []),
 ('Hodnocení a analýza chyb', 'navazujici', 'Posouzení řešení a hledání, proč selhalo (ladění myšlení).', 'algoritmizace', ['v005'], ['ladeni','hodnoceni'], [('informaticke-mysleni','Algoritmus')], []),
]

C['programovani'] = [
 ('Proměnné a datové typy', 'core', 'Pojmenovaná „krabička" na hodnotu; čísla, text, pravda/nepravda.', 'algoritmizace', ['v007'], ['promenne'], [], []),
 ('Podmínky v kódu', 'core', 'Větvení programu (if/else) podle toho, zda platí podmínka.', 'algoritmizace', ['v007'], ['kdyz-tak','rizeni-toku'], [('programovani','Proměnné a datové typy')], [('informaticke-mysleni','Řízení toku')]),
 ('Cykly v kódu', 'core', 'Opakování kroků (for, while), místo psaní téhož pořád dokola.', 'algoritmizace', ['v007'], ['opakovani','rizeni-toku'], [('programovani','Proměnné a datové typy')], [('informaticke-mysleni','Řízení toku')]),
 ('Funkce a procedury', 'core', 'Pojmenovaný, znovupoužitelný kus kódu s parametry a návratovou hodnotou.', 'algoritmizace', [], ['funkce','dekompozice'], [('programovani','Proměnné a datové typy')], []),
 ('Ladění a testování', 'core', 'Hledání a oprava chyb; ověření, že program dělá, co má.', 'algoritmizace', ['v005'], ['ladeni'], [('programovani','Podmínky v kódu')], [('informaticke-mysleni','Hodnocení a analýza chyb')]),
 ('Blokové vs. textové programování', 'navazujici', 'Přechod od skládání bloků (Scratch) k psaní textového kódu (Python).', 'algoritmizace', ['v007'], ['programovani'], [('programovani','Cykly v kódu')], []),
 ('Seznamy a kolekce', 'navazujici', 'Ukládání více hodnot najednou a práce s nimi.', 'algoritmizace', [], ['data','programovani'], [('programovani','Proměnné a datové typy')], []),
 ('Události', 'navazujici', 'Reakce programu na akce (klik, stisk) — event-driven přístup.', 'algoritmizace', [], ['udalosti','rizeni-toku'], [('programovani','Podmínky v kódu')], []),
 ('Knihovny a volání API v kódu', 'navazujici', 'Použití hotového cizího kódu a služeb (včetně AI) přes API.', 'algoritmizace', [], ['api','knihovny'], [('programovani','Funkce a procedury')], [('digitalni-zaklady','API')]),
 ('Verzování kódu', 'navazujici', 'Git a GitHub — sledování změn a spolupráce na kódu.', 'algoritmizace', [], ['verzovani','spoluprace'], [('programovani','Blokové vs. textové programování')], []),
 ('Čtení a hodnocení AI kódu', 'navazujici', 'Porozumět cizímu i AI vygenerovanému kódu, posoudit ho a upravit.', 'algoritmizace', ['v005'], ['ai-prurez','ladeni'], [('programovani','Ladění a testování')], [('umela-inteligence','Ověřování výstupů')]),
 ('Základy objektů (OOP)', 'navazujici', 'Objekty jako spojení dat a chování — úvod do objektového myšlení.', 'algoritmizace', [], ['programovani','abstrakce'], [('programovani','Funkce a procedury')], []),
]

C['umela-inteligence'] = [
 ('Co je a co není AI', 'core', 'Úzká vs. obecná AI; AI jako nástroj, ne bytost.', None, [], ['ai'], [], []),
 ('AI se učí z dat', 'core', 'Kvalita a zaujatost trénovacích dat určuje výstup modelu.', 'data-modelovani', ['v004'], ['ai','data'], [('umela-inteligence','Co je a co není AI')], [('data-databaze','Datová gramotnost')]),
 ('Jak funguje generativní model', 'core', 'Predikuje pravděpodobné pokračování — proto umí i „halucinovat".', None, [], ['ai'], [('umela-inteligence','AI se učí z dat')], []),
 ('Doporučovací systémy', 'core', 'Proč vidím právě tenhle obsah a jak mě systém profiluje.', 'data-modelovani', [], ['ai','data','soukromi'], [('umela-inteligence','AI se učí z dat')], [('digitalni-obcanstvi','Jak fungují algoritmy sítí')]),
 ('Prompt a promptová gramotnost', 'core', 'Jak napsat, iterovat a dát kontext, aby AI odvedla, co chci.', None, [], ['ai','prompt'], [('umela-inteligence','Jak funguje generativní model')], []),
 ('Ověřování výstupů', 'core', 'Rozpoznat halucinaci a ověřit výstup AI z druhého zdroje.', None, [], ['ai','ai-prurez'], [('umela-inteligence','Jak funguje generativní model')], []),
 ('Vlastní agency', 'core', 'Já rozhoduji, AI jen radí — člověk zůstává v řízení.', None, [], ['ai','postoj'], [], []),
 ('Kdy AI (ne)použít a disclosure', 'core', 'Rozlišit, kdy AI pomáhá učení a kdy ho obchází; přiznat její použití.', None, [], ['ai','postoj','etika'], [('umela-inteligence','Vlastní agency')], []),
 ('Bias a férovost', 'core', 'Odkud se v AI bere zaujatost a jak se projevuje.', None, [], ['ai','etika'], [('umela-inteligence','AI se učí z dat')], []),
 ('Soukromí při práci s AI', 'core', 'Co do promptu nevkládat a jak se má s daty zachází.', None, [], ['ai','soukromi'], [], [('kyberbezpecnost','Soukromí a digitální stopa')]),
 ('Pět velkých idejí AI', 'navazujici', 'Vnímání, reprezentace a usuzování, učení, přirozená interakce, společenský dopad.', None, [], ['ai'], [('umela-inteligence','Co je a co není AI')], []),
 ('Strojové učení prakticky', 'navazujici', 'Natrénuj si vlastní model (Teachable Machine, micro:bit CreateAI) — sběr dat, trénink, test.', 'data-modelovani', ['v004'], ['ai','ml'], [('umela-inteligence','AI se učí z dat')], [('fyzicky-computing','TinyML / edge AI')]),
 ('Typy AI úloh', 'navazujici', 'Klasifikace, predikce a generování jako různé druhy úloh.', 'data-modelovani', [], ['ai','ml'], [('umela-inteligence','Strojové učení prakticky')], []),
 ('Foundation modely, LLM a RAG', 'navazujici', 'Koncepčně: velké modely, jazykové modely a vyhledávání ve vlastních datech.', None, [], ['ai'], [('umela-inteligence','Jak funguje generativní model')], [('data-databaze','Vektorové databáze a embeddingy')]),
 ('Hlubší etika AI', 'navazujici', 'Proporcionalita, nediskriminace, transparentnost a environmentální stopa.', None, [], ['ai','etika'], [('umela-inteligence','Bias a férovost')], []),
 ('Deepfakes a syntetická média', 'navazujici', 'Rozpoznání a provenience (SynthID, C2PA); dopady na důvěru.', None, [], ['ai','deepfake','bezpeci'], [('umela-inteligence','Jak funguje generativní model')], [('kyberbezpecnost','AI podvody')]),
 ('AI a společnost', 'navazujici', 'Dopady na práci a dezinformace; spoluutváření AI („Shape AI").', None, [], ['ai','etika','postoj'], [('umela-inteligence','Hlubší etika AI')], []),
]

C['data-databaze'] = [
 ('Datová gramotnost', 'core', 'Číst, interpretovat a kriticky posoudit data — předstupeň AI gramotnosti.', 'data-modelovani', ['v001'], ['data'], [], []),
 ('Datový cyklus', 'core', 'Sběr → čištění → analýza → vizualizace → interpretace jako ucelený příběh.', 'data-modelovani', ['v001'], ['data'], [('data-databaze','Datová gramotnost')], []),
 ('Strukturovaná vs. nestrukturovaná data', 'core', 'Rozdíl mezi tabulkou a volným textem/obrazem.', 'data-modelovani', ['v002'], ['data'], [('data-databaze','Datová gramotnost')], []),
 ('Tabulky a relační model', 'core', 'Řádky, sloupce, klíče a vztahy; evidence dat v informačním systému.', 'informacni-systemy', ['v009'], ['data','databaze'], [('data-databaze','Strukturovaná vs. nestrukturovaná data')], []),
 ('Vizualizace a volba grafu', 'core', 'Kdy který graf, čtení os a měřítek; modelování dat grafem či schématem.', 'data-modelovani', ['v003','v010'], ['data','vizualizace'], [('data-databaze','Datový cyklus')], []),
 ('Dotazování (SQL)', 'navazujici', 'Základní dotazy nad daty (SELECT, WHERE, JOIN) a pravidla pro práci se záznamy.', 'informacni-systemy', ['v009','v010'], ['databaze','data'], [('data-databaze','Tabulky a relační model')], []),
 ('Účel informačních systémů', 'navazujici', 'Posoudit účel a užitečnost systémů, které používám.', 'informacni-systemy', ['v008'], ['data','databaze'], [('data-databaze','Tabulky a relační model')], [('digitalni-obcanstvi','Obchodní modely platforem')]),
 ('Statistická gramotnost', 'navazujici', 'Korelace vs. kauzalita, reprezentativnost a zavádějící grafy.', 'data-modelovani', ['v001'], ['data','hodnoceni'], [('data-databaze','Vizualizace a volba grafu')], []),
 ('Čištění reálných dat', 'navazujici', 'Chybějící hodnoty, duplicity a nekonzistence — nejdůležitější a nejnudnější část.', 'informacni-systemy', ['v010'], ['data'], [('data-databaze','Datový cyklus')], []),
 ('NoSQL a dokumentové databáze', 'navazujici', 'Jiný způsob ukládání dat než tabulky.', 'informacni-systemy', [], ['databaze','data'], [('data-databaze','Tabulky a relační model')], []),
 ('Vektorové databáze a embeddingy', 'navazujici', 'Ukládání významu jako čísel a vyhledávání podle podobnosti — páteř RAG a chatbotů.', None, [], ['databaze','ai'], [('data-databaze','NoSQL a dokumentové databáze')], [('umela-inteligence','Foundation modely, LLM a RAG')]),
 ('Programová analýza dat', 'navazujici', 'Zpracování dat kódem (Python + pandas) místo klikání.', 'data-modelovani', [], ['data','programovani'], [('data-databaze','Datový cyklus')], [('programovani','Seznamy a kolekce')]),
 ('Konverzační analytika (AI nad daty)', 'navazujici', 'Ptám se dat přirozeným jazykem (text-to-SQL); nutnost ověřit výsledek.', None, [], ['data','ai','ai-prurez'], [('data-databaze','Dotazování (SQL)')], [('umela-inteligence','Ověřování výstupů')]),
]

C['tvorba-webu'] = [
 ('Jak funguje web', 'core', 'Klient–server, prohlížeč a HTTP — co se děje, když otevřu stránku.', 'digitalni-technologie', [], ['web','sit'], [], [('digitalni-zaklady','Internet a síť')]),
 ('HTML', 'core', 'Struktura stránky a sémantické značky.', None, [], ['web','html'], [('tvorba-webu','Jak funguje web')], []),
 ('CSS', 'core', 'Vzhled a layout stránky (Flexbox/Grid, responzivita).', None, [], ['web','css','design'], [('tvorba-webu','HTML')], []),
 ('Doména a hosting', 'core', 'Jak dostat web z počítače online, aby ho viděl kdokoli.', 'digitalni-technologie', [], ['web','cloud'], [('tvorba-webu','Jak funguje web')], [('digitalni-zaklady','Cloud a server')]),
 ('Interaktivita (JavaScript, DOM)', 'core', 'Oživení stránky — reakce na akce uživatele.', None, [], ['web','javascript'], [('tvorba-webu','HTML')], [('programovani','Události')]),
 ('AI-asistovaná tvorba webu', 'navazujici', 'v0, Lovable, Bolt, Claude Artifacts — z popisu vznikne web; hodnota v úpravách a hodnocení.', None, [], ['web','ai','ai-prurez'], [('tvorba-webu','CSS')], [('tvorba-aplikaci','Vibecoding')]),
 ('Frameworky', 'navazujici', 'React ap. a CSS frameworky (Tailwind) pro větší projekty.', None, [], ['web','programovani'], [('tvorba-webu','Interaktivita (JavaScript, DOM)')], []),
 ('Nasazení webu', 'navazujici', 'Publikace přes Vercel, Netlify nebo GitHub Pages.', 'digitalni-technologie', [], ['web','cloud'], [('tvorba-webu','Doména a hosting')], []),
 ('Přístupnost a SEO', 'navazujici', 'Web dostupný všem a nalezitelný ve vyhledávačích.', None, [], ['web','design'], [('tvorba-webu','HTML')], []),
 ('UX/UI a design webu', 'navazujici', 'Návrh použitelného a srozumitelného rozhraní.', None, [], ['web','design'], [('tvorba-webu','CSS')], []),
]

C['tvorba-aplikaci'] = [
 ('Co je aplikace', 'core', 'Mobilní/webová/desktopová appka; rozdíl frontend vs. backend.', None, [], ['aplikace'], [], []),
 ('No-code / low-code', 'core', 'Tvorba aplikace bez psaní kódu jako vstupní brána.', None, [], ['aplikace','no-code'], [('tvorba-aplikaci','Co je aplikace')], []),
 ('Logika aplikace', 'core', 'Stavy, vstupy a akce — jak se appka chová.', 'algoritmizace', [], ['aplikace','rizeni-toku'], [('tvorba-aplikaci','Co je aplikace')], [('programovani','Podmínky v kódu')]),
 ('Vibecoding', 'core', 'Popíšu záměr přirozeným jazykem, AI generuje kód; já řídím a hodnotím.', None, [], ['aplikace','ai','ai-prurez'], [('tvorba-aplikaci','Logika aplikace')], [('programovani','Čtení a hodnocení AI kódu')]),
 ('AI nástroje pro tvorbu', 'core', 'Copilot, Cursor, Claude Code, Replit, Lovable jako programovací parťáci.', None, [], ['aplikace','ai'], [('tvorba-aplikaci','Vibecoding')], []),
 ('Práce s API a backendem', 'navazujici', 'Propojení appky se službami a serverovou logikou.', None, [], ['aplikace','api'], [('tvorba-aplikaci','Logika aplikace')], [('digitalni-zaklady','API')]),
 ('Databáze a autentizace', 'navazujici', 'Ukládání dat aplikace a přihlašování uživatelů.', 'informacni-systemy', [], ['aplikace','databaze','bezpeci'], [('tvorba-aplikaci','Práce s API a backendem')], [('data-databaze','Tabulky a relační model')]),
 ('Životní cyklus vývoje', 'navazujici', 'Verzování, testování a nasazení jako součást vývoje.', None, [], ['aplikace','verzovani'], [('tvorba-aplikaci','Logika aplikace')], [('programovani','Verzování kódu')]),
 ('Publikace do app storů', 'navazujici', 'Jak se appka dostane k uživatelům.', None, [], ['aplikace'], [('tvorba-aplikaci','Databáze a autentizace')], []),
 ('Iluze kompetence', 'navazujici', 'Proč rozumět základům — AI kód funguje, dokud se nerozbije.', None, [], ['aplikace','ai','postoj'], [('tvorba-aplikaci','Vibecoding')], [('programovani','Ladění a testování')]),
]

C['tvorba-obsahu'] = [
 ('Vizuální jazyk', 'core', 'Kompozice, barva, kontrast, typografie a formáty — základ, který AI nenahradí.', None, [], ['obsah','design'], [], []),
 ('Prompt pro média', 'core', 'Jak popsat obraz, video nebo hudbu, aby vznikl zamýšlený výstup.', None, [], ['obsah','ai','prompt'], [('tvorba-obsahu','Vizuální jazyk')], [('umela-inteligence','Prompt a promptová gramotnost')]),
 ('Generativní obraz', 'core', 'Tvorba obrázků z popisu (Midjourney, Nano Banana, DALL·E, Firefly).', None, [], ['obsah','ai'], [('tvorba-obsahu','Prompt pro média')], []),
 ('Etika, autorství a označování', 'core', 'Čí data model trénoval, komu patří výstup a jak označit AI obsah.', None, [], ['obsah','etika','ai'], [('tvorba-obsahu','Generativní obraz')], [('umela-inteligence','Hlubší etika AI')]),
 ('Generativní video', 'navazujici', 'Video z textu/obrázku (Sora, Veo, Runway) a jeho rizika.', None, [], ['obsah','ai','deepfake'], [('tvorba-obsahu','Generativní obraz')], [('umela-inteligence','Deepfakes a syntetická média')]),
 ('Generativní hudba a hlas', 'navazujici', 'Skladba a hlas z promptu (Suno, ElevenLabs); klonování hlasu a jeho rizika.', None, [], ['obsah','ai'], [('tvorba-obsahu','Prompt pro média')], []),
 ('Střih a postprodukce s AI', 'navazujici', 'Titulky, čištění zvuku a úprava videa přepisem (CapCut, Descript).', None, [], ['obsah'], [('tvorba-obsahu','Vizuální jazyk')], []),
 ('Konzistence a kontrola', 'navazujici', 'Udržení postavy/stylu, in/out-painting, editace přirozeným jazykem.', None, [], ['obsah','ai'], [('tvorba-obsahu','Generativní obraz')], []),
 ('Provenience a vodoznaky', 'navazujici', 'SynthID a C2PA Content Credentials — jak se ověřuje původ obsahu.', None, [], ['obsah','bezpeci','ai'], [('tvorba-obsahu','Etika, autorství a označování')], []),
 ('Vícemodální workflow', 'navazujici', 'Kombinace obraz → video → hudba → hlas v jednom projektu.', None, [], ['obsah','ai'], [('tvorba-obsahu','Konzistence a kontrola')], []),
]

C['herni-vyvoj'] = [
 ('Herní smyčka, scéna a objekty', 'core', 'Základní stavba hry: smyčka, scéna a sprity.', 'algoritmizace', [], ['hry','rizeni-toku'], [], []),
 ('Vstup hráče, stavy a skóre', 'core', 'Reakce na ovládání a udržování stavu hry.', 'algoritmizace', [], ['hry','udalosti'], [('herni-vyvoj','Herní smyčka, scéna a objekty')], [('programovani','Události')]),
 ('Kolize a jednoduchá fyzika', 'core', 'Detekce dotyku objektů a základní pohyb.', None, [], ['hry'], [('herni-vyvoj','Herní smyčka, scéna a objekty')], []),
 ('Herní design', 'core', 'Pravidla, obtížnost a zpětná vazba hráči.', None, [], ['hry','design'], [('herni-vyvoj','Vstup hráče, stavy a skóre')], []),
 ('Scratch jako vstup', 'core', 'Blokové prostředí pro první hru bez syntaxe.', 'algoritmizace', ['v007'], ['hry','programovani'], [], [('programovani','Blokové vs. textové programování')]),
 ('Lehké enginy', 'navazujici', 'GDevelop a Roblox Studio (Luau) — most ke skutečné hře.', None, [], ['hry'], [('herni-vyvoj','Herní design')], []),
 ('Skutečné enginy', 'navazujici', 'Godot (GDScript) a Unity (C#) s textovým kódem.', None, [], ['hry','programovani'], [('herni-vyvoj','Lehké enginy')], []),
 ('AI generování assetů', 'navazujici', 'Text-to-3D a textury (Roblox Cube, Meshy) — místo hodin modelování.', None, [], ['hry','ai'], [('herni-vyvoj','Herní design')], []),
 ('AI asistenti a kód', 'navazujici', 'Roblox Assistant, Unity Muse — generování a úprava kódu hry.', None, [], ['hry','ai','ai-prurez'], [('herni-vyvoj','Skutečné enginy')], [('programovani','Čtení a hodnocení AI kódu')]),
 ('Publikace hry', 'navazujici', 'Sdílení hry (např. itch.io) — „zahraj si moji hru".', None, [], ['hry','spoluprace'], [('herni-vyvoj','Herní design')], []),
]

C['fyzicky-computing'] = [
 ('Vstup–zpracování–výstup na zařízení', 'core', 'Jak fyzické zařízení čte vstup, zpracuje ho a řídí výstup.', 'digitalni-technologie', [], ['robotika','hardware'], [], []),
 ('Senzory a aktuátory', 'core', 'Zařízení „vnímá" prostředí a „koná" v něm.', None, [], ['robotika','senzory'], [('fyzicky-computing','Vstup–zpracování–výstup na zařízení')], []),
 ('micro:bit', 'core', 'Vstupní platforma: MakeCode a MicroPython, senzory na desce.', 'digitalni-technologie', ['v007'], ['robotika','programovani'], [('fyzicky-computing','Senzory a aktuátory')], [('programovani','Blokové vs. textové programování')]),
 ('Události a řízení výstupu', 'core', 'Reakce na stisk/zatřesení a ovládání LED, pinů, motorů.', 'algoritmizace', [], ['robotika','udalosti'], [('fyzicky-computing','micro:bit')], []),
 ('Arduino a Raspberry Pi', 'navazujici', 'Krok k reálné elektronice a plnému počítači.', None, [], ['robotika','hardware'], [('fyzicky-computing','micro:bit')], []),
 ('Roboti a vozítka', 'navazujici', 'micro:bit + Maqueen, Lego Spike — pohyblivá robotika.', None, [], ['robotika'], [('fyzicky-computing','Události a řízení výstupu')], []),
 ('IoT', 'navazujici', 'Senzory → cloud → dashboard; chytrá domácnost a měření prostředí.', 'digitalni-technologie', [], ['robotika','sit','cloud'], [('fyzicky-computing','Senzory a aktuátory')], [('data-databaze','Vizualizace a volba grafu')]),
 ('TinyML / edge AI', 'navazujici', 'micro:bit CreateAI — natrénuj klasifikační model přímo na zařízení.', 'data-modelovani', ['v004'], ['robotika','ai','ml'], [('fyzicky-computing','micro:bit')], [('umela-inteligence','Strojové učení prakticky')]),
 ('Komunikace mezi zařízeními', 'navazujici', 'Rádio a Bluetooth — zařízení si posílají data.', 'digitalni-technologie', [], ['robotika','sit'], [('fyzicky-computing','micro:bit')], []),
]

C['kyberbezpecnost'] = [
 ('Hesla a 2FA', 'core', 'Silná unikátní hesla, správci hesel a dvoufaktorové ověření.', 'digitalni-technologie', ['v012'], ['bezpeci'], [], []),
 ('Phishing a sociální inženýrství', 'core', 'Jak podvodníci lákají údaje a jak to poznat.', 'digitalni-technologie', ['v012'], ['bezpeci'], [], []),
 ('Soukromí a digitální stopa', 'core', 'Co po mně na internetu zůstává a jak to omezit.', 'digitalni-technologie', ['v012'], ['bezpeci','soukromi'], [], []),
 ('Bezpečné chování na sítích', 'core', 'Rozumné sdílení a nastavení soukromí v aplikacích.', 'digitalni-technologie', ['v012'], ['bezpeci','soukromi'], [('kyberbezpecnost','Soukromí a digitální stopa')], []),
 ('Základní hygiena', 'core', 'Aktualizace, ověřené zdroje aplikací a zálohy; zabezpečení zařízení podle rizik.', 'digitalni-technologie', ['v012'], ['bezpeci'], [], []),
 ('Šifrování a HTTPS', 'navazujici', 'Co znamená zabezpečené spojení a end-to-end šifrování.', 'digitalni-technologie', [], ['bezpeci','sit'], [('kyberbezpecnost','Základní hygiena')], [('digitalni-zaklady','Adresy a protokoly')]),
 ('Typy útoků', 'navazujici', 'Malware, ransomware a jak se šíří.', 'digitalni-technologie', ['v012'], ['bezpeci'], [('kyberbezpecnost','Základní hygiena')], []),
 ('AI podvody', 'navazujici', 'Deepfakes, klonování hlasu a dokonalý AI phishing — staré rady už neplatí.', 'digitalni-technologie', [], ['bezpeci','deepfake','ai'], [('kyberbezpecnost','Phishing a sociální inženýrství')], [('umela-inteligence','Deepfakes a syntetická média')]),
 ('Sextortion a citlivý obsah', 'navazujici', 'AI-upravené intimní fotky a vydírání — mimořádně citlivé riziko pro nezletilé.', 'digitalni-technologie', [], ['bezpeci','soukromi'], [('kyberbezpecnost','AI podvody')], []),
 ('Ověřování přes druhý kanál', 'navazujici', 'Zdravá skepse a prebunking — ověřit, i když to vypadá dokonale.', None, [], ['bezpeci','ai-prurez'], [('kyberbezpecnost','AI podvody')], [('digitalni-obcanstvi','Dezinformace a manipulace')]),
 ('Síťová bezpečnost a CTF', 'navazujici', 'Etické hackování a soutěže jako pokročilá motivace.', 'digitalni-technologie', [], ['bezpeci','sit'], [('kyberbezpecnost','Typy útoků')], []),
]

C['digitalni-obcanstvi'] = [
 ('Kritické myšlení online', 'core', 'Ověřování informací a zdrojů, než jim uvěřím nebo je sdílím.', None, [], ['media','hodnoceni'], [], []),
 ('Jak fungují algoritmy sítí', 'core', 'Filter bubble a ekonomika pozornosti — proč vidím právě tohle.', None, [], ['media','ai'], [], [('umela-inteligence','Doporučovací systémy')]),
 ('Dezinformace a manipulace', 'core', 'Rozpoznání manipulativního a nepravdivého obsahu.', None, [], ['media'], [('digitalni-obcanstvi','Kritické myšlení online')], []),
 ('Digitální stopa a soukromí', 'core', 'Jaká data o sobě zanechávám a komu slouží.', None, [], ['media','soukromi'], [], [('kyberbezpecnost','Soukromí a digitální stopa')]),
 ('Digitální wellbeing', 'core', 'Zdravý vztah k obrazovkám a rozpoznání závislostního designu.', None, [], ['media','wellbeing'], [], []),
 ('Jádro AI gramotnosti', 'navazujici', 'Jak fungují LLM, proč halucinují a co je bias — jako občanská dovednost.', None, [], ['media','ai'], [('digitalni-obcanstvi','Kritické myšlení online')], [('umela-inteligence','Jak funguje generativní model')]),
 ('Rozpoznání AI obsahu', 'navazujici', 'Poznat generovaná a syntetická média.', None, [], ['media','ai','deepfake'], [('digitalni-obcanstvi','Jádro AI gramotnosti')], [('umela-inteligence','Deepfakes a syntetická média')]),
 ('Etika AI ve škole', 'navazujici', 'Kde je hranice mezi pomocí a podváděním.', None, [], ['media','etika','ai'], [('digitalni-obcanstvi','Jádro AI gramotnosti')], [('umela-inteligence','Kdy AI (ne)použít a disclosure')]),
 ('Právo a etika', 'navazujici', 'Autorská práva a GDPR pro nezletilé.', None, [], ['media','etika','soukromi'], [('digitalni-obcanstvi','Digitální stopa a soukromí')], []),
 ('Obchodní modely platforem', 'navazujici', 'Jak se platí pozorností a daty.', None, [], ['media'], [('digitalni-obcanstvi','Jak fungují algoritmy sítí')], []),
 ('Aktivní digitální občanství', 'navazujici', 'Tvorba hodnotného obsahu, ne jen konzumace.', None, [], ['media','wellbeing'], [('digitalni-obcanstvi','Kritické myšlení online')], []),
]

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
for tema, lst in C.items():
    for (nazev, vrstva, popis, rvp_obl, rvpkeys, tagy, prereq, souvisi) in lst:
        cidv = cid(tema, nazev)
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
            'oblast': rvp_obl,      # seskupení podle oblastí RVP (null = nad rámec RVP)
            'vrstva': vrstva,
            'popis': popis,
            'rvp': rvp_list,
            'cile': [],             # doplní se v detailní fázi
            'kriteria': [],         # doplní se v detailní fázi
            'prerekvizity': prereq_ids,
            'souvisi': souvisi_ids,
            'tagy': tagy,
            'zdroj': ([ZDROJ_RVP] if rvp_list else []),
            'pokryti_glitchem': [],
            'stav': 'draft',
        }
        concepts.append(rec)

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
 (('tvorba-webu','Interaktivita (JavaScript, DOM)'), ('programovani','Události')),
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
 (('fyzicky-computing','TinyML / edge AI'), ('umela-inteligence','Strojové učení prakticky')),
 (('fyzicky-computing','IoT'), ('digitalni-zaklady','Cloud a server')),
 # bezpečnost a občanství staví na základech a AI
 (('kyberbezpecnost','Šifrování a HTTPS'), ('digitalni-zaklady','Adresy a protokoly')),
 (('kyberbezpecnost','AI podvody'), ('umela-inteligence','Deepfakes a syntetická média')),
 (('digitalni-obcanstvi','Jak fungují algoritmy sítí'), ('umela-inteligence','Doporučovací systémy')),
 (('digitalni-obcanstvi','Jádro AI gramotnosti'), ('umela-inteligence','Jak funguje generativní model')),
 (('digitalni-obcanstvi','Rozpoznání AI obsahu'), ('umela-inteligence','Deepfakes a syntetická média')),
]

# (A, B) — laterální "souvisí" (napříč tématy)
EXTRA_SOUVISI = [
 # AI průřezová vrstva (nástroj + reflexe)
 (('tvorba-aplikaci','AI nástroje pro tvorbu'), ('umela-inteligence','Prompt a promptová gramotnost')),
 (('tvorba-aplikaci','AI nástroje pro tvorbu'), ('programovani','Čtení a hodnocení AI kódu')),
 (('tvorba-aplikaci','Iluze kompetence'), ('umela-inteligence','Kdy AI (ne)použít a disclosure')),
 (('tvorba-webu','AI-asistovaná tvorba webu'), ('umela-inteligence','Ověřování výstupů')),
 (('herni-vyvoj','AI generování assetů'), ('tvorba-obsahu','Generativní obraz')),
 (('herni-vyvoj','AI asistenti a kód'), ('umela-inteligence','Ověřování výstupů')),
 (('umela-inteligence','Foundation modely, LLM a RAG'), ('tvorba-aplikaci','AI nástroje pro tvorbu')),
 # data <-> AI
 (('data-databaze','Statistická gramotnost'), ('umela-inteligence','Bias a férovost')),
 (('data-databaze','Čištění reálných dat'), ('umela-inteligence','AI se učí z dat')),
 (('umela-inteligence','Typy AI úloh'), ('informaticke-mysleni','Modelování a simulace')),
 (('umela-inteligence','Doporučovací systémy'), ('data-databaze','Vektorové databáze a embeddingy')),
 (('digitalni-zaklady','Reprezentace dat'), ('umela-inteligence','AI se učí z dat')),
 # bezpečnost / etika / soukromí (překrývající se koncepty)
 (('kyberbezpecnost','Soukromí a digitální stopa'), ('digitalni-obcanstvi','Digitální stopa a soukromí')),
 (('kyberbezpecnost','AI podvody'), ('digitalni-obcanstvi','Rozpoznání AI obsahu')),
 (('kyberbezpecnost','Sextortion a citlivý obsah'), ('tvorba-obsahu','Provenience a vodoznaky')),
 (('kyberbezpecnost','Ověřování přes druhý kanál'), ('umela-inteligence','Ověřování výstupů')),
 (('kyberbezpecnost','Phishing a sociální inženýrství'), ('digitalni-obcanstvi','Kritické myšlení online')),
 (('umela-inteligence','Soukromí při práci s AI'), ('digitalni-obcanstvi','Právo a etika')),
 (('umela-inteligence','Hlubší etika AI'), ('digitalni-obcanstvi','Právo a etika')),
 (('umela-inteligence','Bias a férovost'), ('digitalni-obcanstvi','Dezinformace a manipulace')),
 (('tvorba-obsahu','Provenience a vodoznaky'), ('digitalni-obcanstvi','Rozpoznání AI obsahu')),
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
 (('informaticke-mysleni','Abstrakce'), ('digitalni-zaklady','Vrstvy abstrakce')),
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
]

for child, parent in EXTRA_PREREQ:
    ci, pi = rid(child), rid(parent)
    if ci in byid and pi in byid and ci != pi and pi not in byid[ci]['prerekvizity']:
        byid[ci]['prerekvizity'].append(pi)

for a, b in EXTRA_SOUVISI:
    ai_, bi_ = rid(a), rid(b)
    if ai_ in byid and bi_ in byid and ai_ != bi_ and bi_ not in byid[ai_]['souvisi']:
        byid[ai_]['souvisi'].append(bi_)

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
temata = [{'id': i, 'nazev': n, 'vrstva_mapy': v, 'popis': p, 'barva': b, 'navazuje_na': nn}
          for (i, n, v, p, b, nn) in TEMATA]

data = {
    'meta': {
        'verze': '0.2-draft',
        'popis': 'Mapa znalostí Glitch. Dvojí seskupení konceptů: podle tema (obsahová témata) a podle oblast (okruhy RVP Informatika). RVP znění doslovně z RVP_revidované_2024-03-28.pdf.',
        'paleta': ['#ffff00', '#ffffff', '#000000'],
        'uroven': '2. stupeň ZŠ s přesahem výš',
    },
    'areas': areas,
    'temata': temata,
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
print('konceptů s RVP výstupem:', with_rvp)
print('pokryté RVP kódy:', len(covered), '/ 12')
missing = [RVP[k][0] for k in RVP if RVP[k][0] not in covered]
print('NEPOKRYTÉ RVP kódy:', missing)
print('PROBLÉMY (dangling):', problems if problems else 'žádné')