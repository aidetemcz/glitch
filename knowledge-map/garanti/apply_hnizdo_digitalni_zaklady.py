#!/usr/bin/env python3
"""Zapracuje výstupy garanta k tématu Digitální základy a rozdělí téma do podoblastí.

Zdroj: Google Doc „Digitální základy" (garant, 2026-10). Garant neposlal karty
konceptů, ale 65 výstupů („Žák vysvětlí…") ve čtyřech kapitolách bez prerekvizit
a bez vazeb. Rozdělení výstupů do konceptů, názvy bublin, učivo a cíle jsou
proto NÁVRH REDAKCE ke schválení garantem — všechny koncepty mají stav „draft".
Výstupy garanta jsou v kritériích doslovně (VYSTUPY), každý právě jednou.

Co skript dělá:
  - téma dostane podoblasti (PODOBLASTI), každý koncept pole `podoblast`
  - stávajících 10 konceptů zůstává (některé přejmenované / doplněné), přibývá
    11 nových; nic se nemaže
  - 10 výstupů z kapitol Internet a Bezpečnost, které už mají bublinu
    v Kyberbezpečnosti, Digitálním občanství nebo AI, jde tam jako kritéria (JINAM)
  - staré kódy RVP z dokumentu (I-9-4-0x) → současné INF-INF-004-ZV9-0xx, kde
    existují; jinak jen poznámka se starým kódem
  - vygeneruje garanti/digitalni-zaklady-navrh.md — tabulku pro garanta

Spuštění (idempotentní):
    python3 knowledge-map/garanti/apply_hnizdo_digitalni_zaklady.py
    python3 knowledge-map/build-concepts.py
    python3 knowledge-map/build-map-index.py
"""
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
YAML_PATH = HERE.parent / "app" / "data" / "Informatika" / "knowledge-map.yaml"
NAVRH_PATH = HERE / "digitalni-zaklady-navrh.md"

TEMA = "digitalni-zaklady"
Z = TEMA + "-"
ZDROJ = "Garant: Digitální základy (2026-10) — výstupy; rozdělení do konceptů, učivo a cíle: návrh redakce ke schválení"
ZDROJ_JINAM = "Garant: Digitální základy (2026-10) — výstup přesunut z kapitoly Internet / Bezpečnost"

PODOBLASTI = [
    {"id": "soubory-a-ovladani", "nazev": "Soubory a ovládání počítače",
     "popis": "Jak poznat typ souboru, ovládat aplikace a udržet si v datech pořádek i zálohu."},
    {"id": "zarizeni-a-uloziste", "nazev": "Zařízení a úložiště",
     "popis": "Co je uvnitř počítače a mobilu, kam se ukládají data a proč se zařízení někdy zasekne."},
    {"id": "internet-a-site", "nazev": "Internet a sítě",
     "popis": "Jak putují data internetem, co je server, cloud a adresa a jak spolu zařízení mluví."},
    {"id": "zabezpeceni-zarizeni", "nazev": "Zabezpečení zařízení",
     "popis": "Jak chránit vlastní zařízení před malwarem a jak si na něm pohlídat soukromí."},
]

# Výstupy garanta doslovně. O = Ovládání počítače, Z = Principy zařízení, I = Principy internetu, B = Bezpečnost.
VYSTUPY = {
    "O1": "Rozpozná základní typy souborů (obrázek, text, video, hudba); vybere vhodný program/aplikaci pro jejich spuštění; uvede ukázky přípon souborů různého typu (např. jpg, pdf, mp4); vysvětlí, proč tyto přípony někdy počítač/mobil zobrazuje a jindy ne.",
    "O2": "Převede soubory různých typů do pdf; vysvětlí výhody pdf formátu z hlediska tisku a zobrazení.",
    "O3": "Rutinně používá základní mechanismy ovládání aplikací pro tvorbu statických dat (např. textu či obrazu) – mechanismus ukládání a načítání dat, kopírování části dat přes střižnu („clip board“), krok zpět („undo“) a vpřed (“redo”), změna velikosti zobrazení (lupa), náhled na jinou část dat („scrolování“) apod.",
    "O4": "V aplikacích pro tvorbu dynamických dat (např. animace v prezentaci, video, zvuk) pracuje s časovou osou.",
    "O5": "Ve strukturovaných dokumentech mění vlastnosti dokumentu s využitím této struktury – například u textových souborů mění styly odstavců, v prezentaci vektorové objekty přesouvá „před“ a „za“ v jednotlivých vrstvách apod.",
    "O6": "Vysvětlí vrstevníkovi pojem rozlišení obrazu v kontextu zobrazení na monitoru a displeji mobilu, focení a tvorby videa, tisku a ukládání souborů.",
    "O7": "Když dostane 100 souborů různých typů, navrhne jejich vhodnou organizaci pomocí složek, složky založí na počítači a soubory do složek rozmístí.",
    "O8": "Přenese desítky až stovky fotografií a videí z mobilního telefonu do počítače, navrhne jejich uspořádání pomocí několika složek a dle tohoto návrhu soubory uspořádá; klíčové fotografie přejmenuje tak, aby z názvu bylo patrné, o jakou fotku jde.",
    "O9": "Vysvětlí význam zálohování dat a popíše svá osobní pravidla, která používá pro zálohování svých dat.",
    "O10": "Vysvětlí, co to znamená, že se program „zasekne“ a jakým způsobem tuto situaci vyřešit.",
    "Z0": "Vysvětlí vrstevníkovi výhody a nevýhody různých typů trvalých úložišť dat (například USB flash disk, pevný disk, SD karta, interní paměť mobilu, DVD…).",
    "Z1": "Popíše rozdíl mezi uložením dat lokálně a na cloudu; diskutuje výhody a nevýhody.",
    "Z2": "Vysvětlí mechanismus „líného“ mazání dat uložených lokálně. Vysvětlí, jakým způsobem bezpečně odstranit taková data, pokud zařízení, kde jsou uložena, chceme vyhodit – tzn. jak lze (někdy) zařídit, aby se k datům nebo jejich částem nedostal nikdo, kdo vyhozené zařízení najde. Zejména vysvětlí, proč běžné smazání a zároveň vysypání koše není v této situaci dostačující a kdy je případně lepší zařízení nikdy nevyhazovat (neprodávat).",
    "Z3": "Vysvětlí vrstevníkovi, jaký základní význam pro počítač nebo mobil má operační systém; rozpozná základní operační systémy (např. Android, iOS, Windows) a asociuje je s typickými zařízeními (např. mobil vs. počítač).",
    "Z4": "Vysvětlí, jak komprese souvisí s velikostí dat, a proč není možné zkomprimovaný soubor zmenšovat opakovanou komprimací do nekonečna.",
    "Z5": "Popíše význam zkratek MB a GB (megabyte a gigabyte) a uvede řádové velikosti fotek a delších videí (např. filmů).",
    "Z6": "Propojí mobilní telefon a počítač bez pomocí internetu/wifi (například přes USB) a překopíruje z jednoho zařízení na druhé data (například fotky).",
    "Z7": "Připojí k počítači externí zařízení, například monitor, projektor nebo tiskárnu.",
    "Z8": "Nainstaluje a odinstaluje aplikaci.",
    "Z9": "Aktualizuje aplikaci; diskutuje o výhodách a nevýhodách aktualizací.",
    "Z10": "Popíše význam zavření aplikace resp. restartu počítače či mobilního zařízení pro „úklid“ operační paměti zařízení.",
    "Z11": "Na situaci nákupu nového mobilu či notebooku diskutuje o funkcích a parametrech základních komponent počítačového zařízení (zejména jde o procesor/jádra, trvalé úložiště, operační paměť, grafickou kartu), jakož i o možnostech, jak toto zařízení připojit k dalším zařízením (bezdrátová připojení, porty).",
    "Z12": "Vysvětlí, co může způsobovat, že se „počítač strašně zasekává“ (je pomalejší než obvykle).",
    "Z13": "Vysvětlí vztah mezi počtem spuštěných programů a operační pamětí počítače.",
    "Z14": "Vysvětlí, kde se v počítači nachází nově založený soubor (např. obrázek či textový dokument nově otevřený v příslušném editoru) předtím, než ho uložíme na lokální úložiště (např. na disk, interní paměť…).",
    "I1": "Vysvětlí vrstevníkovi význam serveru ve smyslu počítačového zařízení připojeného k internetu, které poskytuje nějaké služby.",
    "I2": "Vysvětlí rozdíl mezi internetem, webem, wifi sítí, wifi signálem, wifi routerem, mobilním signálem a mobilními daty; schematicky zakreslí vztah mezi nimi.",
    "I3": "Vysvětlí rozdíly mezi elektrickou rozvodnou sítí a internetovými kabely.",
    "I4": "Popíše, jak a proč vznikl internet a jaký to má dopad na architekturu internetu.",
    "I5": "Vysvětlí, co je to IP adresa, URL a DNS služba a jaké jsou mezi nimi vztahy.",
    "I6": "Vysvětlí svému vrstevníkovi, jak prohlížeč webových stránek „ví“, jak přesně má stránku zobrazit; popíše, proč se stránka zobrazuje jinak na telefonu a jinak na počítači a proč se může zobrazovat odlišně v různých prohlížečích.",
    "I7": "Do schematického modelu části internetu, který obsahuje počítač žáka, webový server a routery či switche, zakreslí, jakým způsobem komunikuje počítač žáka s webovým serverem, když poprvé načítá z tohoto serveru určitou webovou stránku.",
    "I8": "Pro situaci posílání zprávy přes sociální síť ve schematickém modelu části internetu, který obsahuje počítač adresáta, počítač příjemce, server sociální sítě, jiný server a routery či switche, označí a) zařízení, jejichž poškození způsobí, že zaslaná zpráva nedorazí k cíli, a b) zařízení, jejichž poškození toto nezpůsobí. Diskutuje robustnost internetové architektury.",
    "I9": "Pro situaci posílání emailu, kde adresát a příjemce mají jiného emailového poskytovatele, ve schematickém modelu části internetu, který obsahuje počítač adresáta, počítač příjemce, emailový server obou emailových poskytovatelů a routery či switche, označí a) cestu emailu, b) část cesty, kde email bude typicky nezašifrovaný.",
    "I10": "Na schematickém modelu internetu, který znázorňuje posílání nešifrované vs. šifrované zprávy, zhodnotí možností útočníka komunikaci „po cestě“ přečíst.",
    "I11": "Vysvětlí vrstevníkovi hlavní myšlenku toho, jakým způsobem si internetové vyhledávače „tvoří“ přehled o tom, kde lze co na webu najít.",
    "I12": "Popíše výhody a nevýhody cookies.",
    "I13": "Uvede alespoň tři příklady personalizovaného obsahu webu (např. reklamy, videa, novinové zprávy, výsledky vyhledávání) a vysvětlí, jak je možné, že je tento obsah přizpůsobován na míru uživateli. Diskutuje výhody a nevýhody této personalizace.",
    "I14": "Popíše rozdíl mezi digitální stopou a digitální identitou. Diskutuje, čím vším svou digitální stopu vytváří.",
    "I15": "Popíše princip financování sociálních sítí pomocí reklamy.",
    "I16": "Popíše, jaká osobní data uživatelů internetu mohou třetí osoby nebo instituce získat; a jakým způsobem a kdy a jak tomu může uživatel zabránit.",
    "I17": "Vysvětlí z perspektivy GDPR a práva „být zapomenut“, jestli lze smazat trvale osobní data z internetového serveru, který je v EU vs. mimo EU.",
    "I18": "Popíše rozdíly mezi připojením na veřejnou vs. domácí wifi síť; vysvětlí, jaké aktivity považuje za (ne)vhodné pro vykonávání na veřejné wifi a proč.",
    "I19": "Pro cloudovský dokument nastaví různým uživatelům různá přístupová práva.",
    "I20": "Vysvětlí, co se stane s cloudovským dokumentem, když tento žák edituje a a) spadne žákovo připojení k internetu, b) spadne připojení kolegy, který pracuje na jiné části dokumentu ve stejném čase, c) přestane dočasně fungovat cloud.",
    "I21": "Vysvětlí rozdíly mezi uživatelskými rolemi Čtenář, Komentátor, Přispěvatel a Správce obsahu a porovná jejich práva nad dokumenty.",
    "I22": "Vysvětlí rozdíl mezi streamováním, uploadováním a downloadováním.",
    "I23": "Vysvětlí, jestli je principiálně možné, aby počítačový virus napadl periferní zařízení počítačů (např. myš, USB disk, USB lampička apod.); vysvětlí pojem (mikro)procesor.",
    "I24": "Vysvětlí rozdíl mezi skrytým počítačem, který není připojený k internetu, a chytrým počítačem (smart technologies), který je připojený k internetu. Vysvětlí rizika chytrých počítačů.",
    "I25": "Vymyslí alespoň tři různé situace, kdy je pro majitele mobilního telefonu nevýhodné, když se třetí strana od operátora mobilní sítě dozví informace o poloze majitele.",
    "I26": "Vysvětlí, jaká bezpečnostní rizika obnáší pro občany EU používání softwaru či cloudových služeb zemí mimo EU (např. na příkladu antiviru či cloudu fotovoltaických elektráren); vysvětlí pojem Trojský kůň.",
    "B1": "Rozpozná více a méně bezpečná hesla; sám si vytvoří bezpečné heslo.",
    "B2": "Vysvětlí rozdíl mezi účtem, heslem, autentifikací, šifrováním a kódováním.",
    "B3": "Najde na internetu spolehlivý antivirus a nainstaluje ho na mobil či počítač.",
    "B4": "Rozliší alespoň tři druhy malware a vysvětlí jejich princip, popíše rozdíl mezi malwarem a hackerem.",
    "B5": "Vysvětlí vztah mezi chybami v programu, aktualizacemi a hackováním.",
    "B6": "Diskutuje o cílech a metodách hackerů.",
    "B7": "Popíše svá osobní bezpečnostní pravidla pro to, jak hledá na internetu aplikace či soubory ke stažení do svého zařízení (např. stahuje pouze z konkrétních prověřených stránek apod.).",
    "B8": "Diskutuje o různých módech bezpečného chování na internetu; sepíše pravidla pro bezpečné chování na internetu pro žáky z 5. třídy.",
    "B9": "Vytvoří myšlenkovou mapu prvků zabezpečení počítače a internetové komunikace (použije koncepty, jako např. firewall, antivirus, dvoufaktorová autentizace, end-to-end šifrování apod.).",
    "B10": "Vysvětlí význam metadat (např. u fotografií) pro možnost útočníka zjistit osobní informace o oběti (např. autorovi fotografie).",
    "B11": "Demonstruje, jak na mobilní zařízení vypnout funkci sledování polohy.",
    "B12": "Demonstruje, jak aplikacím v mobilním telefonu zakázat přístup k periferiím (např. ke kameře).",
    "B13": "Diskutuje o rizikách nových „chytrých technologií“ (např. smart grid, smart cars) v etické rovině a rovině bezpečnostní (možnost technologie „hacknout“).",
    "B14": "Uvede alespoň tři příklady použití umělé inteligence a popíše možná rizika těchto použití.",
}
KAPITOLY = {"O": "Ovládání počítače", "Z": "Principy jednoho počítačového zařízení", "I": "Principy internetu", "B": "Bezpečnost"}

# Staré kódy RVP (2021), kterými garant kapitoly uvozuje → současné výstupy (RVP 2024).
# I-9-4-02 a I-9-4-04 v RVP 2024 samostatný výstup nemají → jen poznámka.
RVP_2024 = {
    "INF-INF-004-ZV9-011": "vybírá pro své potřeby hardware, software a způsob připojení digitálních zařízení do sítě na základě porozumění jejich vlastnostem",
    "INF-INF-004-ZV9-012": "navrhne základní způsoby zabezpečení zařízení a systémů, se kterými pracuje, na základě posouzení rizik ztráty, poškození či zneužití dat",
    "INF-INF-001-ZV9-002": "navrhuje a porovnává různé způsoby kódování dat s cílem jejich uložení a přenosu",
}
RVP_2021 = {
    "I-9-4-01": ("INF-INF-004-ZV9-011", "popíše, jak funguje počítač po stránce hardwaru i operačního systému; diskutuje o fungování digitálních technologií určujících trendy ve světě"),
    "I-9-4-02": (None, "ukládá a spravuje svá data ve vhodném formátu s ohledem na jejich další zpracování či přenos"),
    "I-9-4-03": ("INF-INF-004-ZV9-011", "vybírá nejvhodnější způsob připojení digitálních zařízení do počítačové sítě; uvede příklady sítí a popíše jejich charakteristické znaky"),
    "I-9-4-04": (None, "poradí si s typickými závadami a chybovými stavy počítače"),
    "I-9-4-05": ("INF-INF-004-ZV9-012", "dokáže usměrnit svoji činnost tak, aby minimalizoval riziko ztráty či zneužití dat; popíše fungování a diskutuje omezení zabezpečovacích řešení"),
}


def rvp(*stare, navic=()):
    """RVP položky z kódů 2021 (garant) + případně přímých kódů 2024."""
    out, seen = [], set()
    for s in stare:
        novy, text = RVP_2021[s]
        if novy and novy not in seen:
            seen.add(novy)
            out.append({"kod": novy, "vystup": RVP_2024[novy], "poznamka": f"garant: {s} – {text}"})
        elif not novy:
            out.append({"kod": None, "vystup": "", "poznamka": f"RVP 2021: {s} – {text} (v RVP 2024 bez samostatného výstupu)"})
    for k in navic:
        if k not in seen:
            seen.add(k)
            out.insert(0, {"kod": k, "vystup": RVP_2024[k]})
    return out


def C(uroven, rocnik, text):
    return {"uroven": uroven, "text": text, "rocnik": rocnik}


# Koncepty tématu v pořadí podoblastí. `vystupy` = výstupy garanta → kritéria (doslovně).
# `zachovat` = pole stávajícího konceptu, která se nepřepisují.
KONCEPTY = [
    # --- bez podoblasti (garantův dokument téma Data a informace nepokrývá) ---
    {"id": Z + "data-a-informace", "podoblast": None, "zachovat": "vse"},

    # --- Soubory a ovládání počítače ---
    {"id": Z + "soubory-a-jejich-typy", "podoblast": "soubory-a-ovladani", "nazev": "Soubory a jejich typy",
     "vrstva": "core", "oblast": "digitalni-technologie", "kompetence": "kdi-dat", "tagy": ["praktická dovednost"],
     "popis": "Všechno, co v počítači vytvoříš nebo stáhneš, je soubor určitého typu: obrázek, text, video, hudba. Typ poznáš podle přípony (jpg, pdf, mp4) a podle něj se vybírá i program, který soubor otevře. Některé formáty se hodí na úpravy, jiné na sdílení a tisk — pdf vypadá všude stejně. U obrázků a videa navíc rozhoduje rozlišení: kolik bodů obraz má, jak ostře se zobrazí a jak velký soubor z něj bude.",
     "cile": [C("porozumeni", 6, "Žák vysvětlí, co je typ souboru, jak ho poznat podle přípony a proč k různým typům patří různé programy."),
              C("aplikace", 7, "Žák převede soubor do formátu vhodného pro zadaný účel (např. do pdf pro tisk) a volbu zdůvodní.")],
     "vystupy": ["O1", "O2", "O6"], "rvp": rvp("I-9-4-02"),
     "prerekvizity": [], "souvisi": ["data-databaze-kodovani-dat"]},
    {"id": Z + "ovladani-aplikaci", "podoblast": "soubory-a-ovladani", "nazev": "Ovládání aplikací",
     "vrstva": "core", "oblast": "digitalni-technologie", "kompetence": "kdi-tdo", "tagy": ["praktická dovednost"],
     "popis": "Většina aplikací se ovládá stejnými mechanismy, ať děláš text, obrázek nebo prezentaci: uložit a načíst, kopírovat přes schránku, krok zpět a vpřed, přiblížit lupou, posouvat se v dokumentu. Aplikace na video, zvuk nebo animaci k tomu přidávají časovou osu. Strukturované dokumenty (styly odstavců, vrstvy objektů) se dají měnit hromadně přes jejich strukturu, ne po jednom.",
     "cile": [C("aplikace", 6, "Žák rutinně používá základní mechanismy ovládání aplikací (uložení, schránka, zpět/vpřed, lupa, posun) napříč různými programy."),
              C("aplikace", 8, "Žák upraví dokument s využitím jeho struktury (styly, vrstvy) nebo časové osy místo ručních úprav po jednom.")],
     "vystupy": ["O3", "O4", "O5"], "rvp": rvp("I-9-4-02"),
     "prerekvizity": [Z + "soubory-a-jejich-typy"], "souvisi": []},
    {"id": Z + "organizace-a-zalohovani-dat", "podoblast": "soubory-a-ovladani", "nazev": "Organizace a zálohování dat",
     "vrstva": "core", "oblast": "digitalni-technologie", "kompetence": "kdi-dat", "tagy": ["praktická dovednost"],
     "popis": "Stovky souborů bez pořádku se nedají najít. Složky s jasnými názvy a soubory pojmenované tak, aby bylo z názvu poznat, co v nich je, jsou základ — ať jde o fotky z mobilu, nebo školní práce. Druhá část pořádku je záloha: kopie důležitých dat na jiném místě, protože disk, mobil i účet v cloudu můžeš ztratit.",
     "cile": [C("aplikace", 6, "Žák navrhne a vytvoří strukturu složek pro větší množství souborů a soubory do ní uspořádá a pojmenuje."),
              C("porozumeni", 7, "Žák vysvětlí, proč a jak zálohovat, a popíše vlastní pravidla zálohování.")],
     "vystupy": ["O7", "O8", "O9"], "rvp": rvp("I-9-4-02"),
     "prerekvizity": [Z + "soubory-a-jejich-typy"], "souvisi": ["kyberbezpecnost-zakladni-hygiena"]},

    # --- Zařízení a úložiště ---
    {"id": Z + "hardware-a-software", "podoblast": "zarizeni-a-uloziste",
     "zachovat": ["nazev", "vrstva", "oblast", "kompetence", "tagy", "cile", "kriteria", "prerekvizity", "souvisi"],
     "popis_pridat": "Při výběru nového mobilu nebo notebooku rozhodují parametry základních komponent — procesor a počet jader, operační paměť, trvalé úložiště, grafická karta — a to, jak se zařízení připojí k dalším (porty, bezdrátová připojení).",
     "vystupy": ["Z11"], "rvp": rvp("I-9-4-01")},
    {"id": Z + "uloziste-dat", "podoblast": "zarizeni-a-uloziste", "nazev": "Úložiště dat: lokálně a v cloudu",
     "vrstva": "core", "oblast": "digitalni-technologie", "kompetence": "kdi-bzk", "tagy": ["teoretický základ", "soukromí"],
     "popis": "Data se ukládají na trvalá úložiště: pevný disk nebo SSD v počítači, interní paměť mobilu, USB flash disk, SD kartu, DVD. Každé má jinou kapacitu, rychlost, odolnost a cenu. Druhá možnost je cloud — data leží na cizím serveru a dostaneš se k nim odkudkoli, ale jen s připojením a s důvěrou v poskytovatele.\n\nA pozor na mazání: smazaný soubor z disku hned nezmizí, systém si jen „přestane pamatovat“, kde ležel. Než zařízení vyhodíš nebo prodáš, musíš data odstranit bezpečně — nebo zařízení raději nevyhazovat.",
     "cile": [C("hodnoceni", 7, "Žák porovná typy trvalých úložišť a uložení lokálně vs. v cloudu a pro danou situaci vybere vhodné úložiště."),
              C("porozumeni", 8, "Žák vysvětlí, proč běžné smazání dat nestačí, a navrhne, jak data před vyhozením zařízení bezpečně odstranit.")],
     "vystupy": ["Z0", "Z1", "Z2"], "rvp": rvp("I-9-4-01"),
     "prerekvizity": [Z + "hardware-a-software"], "souvisi": [Z + "cloud-a-server", "kyberbezpecnost-soukromi-a-digitalni-stopa"]},
    {"id": Z + "reprezentace-dat", "podoblast": "zarizeni-a-uloziste", "nazev": "Reprezentace a velikost dat",
     "zachovat": ["vrstva", "oblast", "kompetence", "tagy", "cile", "kriteria", "prerekvizity"],
     "popis_pridat": "Velikost dat se měří v bytech — megabyty (MB) pro fotky, gigabyty (GB) pro filmy. Komprese data zmenší tím, že odstraní opakování nebo nepodstatné detaily; co je jednou zkomprimované, se další kompresí už skoro nezmenší.",
     "vystupy": ["Z4", "Z5"], "rvp": rvp("I-9-4-01", navic=["INF-INF-001-ZV9-002"]),
     "souvisi": ["umela-inteligence-ai-se-uci-z-dat", "programovani-promenne-a-datove-typy", "data-databaze-kodovani-dat"]},
    {"id": Z + "operacni-system-a-soubory", "podoblast": "zarizeni-a-uloziste", "nazev": "Operační systém a aplikace",
     "vrstva": "core", "oblast": "digitalni-technologie", "kompetence": None, "tagy": ["teoretický základ", "praktická dovednost"],
     "popis": "Operační systém (Windows, Android, iOS, macOS) je program, který řídí celé zařízení: spouští aplikace, dává jim přístup k hardwaru a stará se o soubory. Aplikace se do něj instalují a odinstalují a průběžně aktualizují — aktualizace přinášejí opravy chyb a bezpečnostní záplaty, občas ale i změny, které se nehodí.",
     "cile": [C("porozumeni", 6, "Žák vysvětlí, k čemu slouží operační systém, a přiřadí základní operační systémy k typickým zařízením."),
              C("aplikace", 7, "Žák nainstaluje, aktualizuje a odinstaluje aplikaci a posoudí výhody a nevýhody aktualizací.")],
     "vystupy": ["Z3", "Z8", "Z9"], "rvp": rvp("I-9-4-01"),
     "prerekvizity": [Z + "hardware-a-software"], "souvisi": [Z + "vrstvy-pocitace", "kyberbezpecnost-zakladni-hygiena"]},
    {"id": Z + "propojeni-zarizeni", "podoblast": "zarizeni-a-uloziste", "nazev": "Propojení zařízení a periferie",
     "vrstva": "navazujici", "oblast": "digitalni-technologie", "kompetence": None, "tagy": ["praktická dovednost"],
     "popis": "Počítač a mobil se dají propojit i bez internetu — kabelem přes USB nebo přes Bluetooth — a překopírovat mezi nimi fotky nebo dokumenty. K počítači se připojují i další zařízení (periferie): monitor, projektor, tiskárna, klávesnice. Každé potřebuje správný port nebo bezdrátové spojení a někdy i ovladač.",
     "cile": [C("aplikace", 6, "Žák propojí mobil s počítačem bez internetu a přenese mezi nimi data."),
              C("aplikace", 7, "Žák připojí k počítači externí zařízení (monitor, projektor, tiskárnu) a zprovozní ho.")],
     "vystupy": ["Z6", "Z7"], "rvp": rvp("I-9-4-01"),
     "prerekvizity": [Z + "hardware-a-software"], "souvisi": ["fyzicky-computing-komunikace-mezi-zarizenimi"]},
    {"id": Z + "zaseknuty-pocitac-a-operacni-pamet", "podoblast": "zarizeni-a-uloziste", "nazev": "Zaseknutý počítač a operační paměť",
     "vrstva": "navazujici", "oblast": "digitalni-technologie", "kompetence": None, "tagy": ["teoretický základ", "praktická dovednost"],
     "popis": "Rozpracovaný dokument, otevřená stránka i běžící hra žijí v operační paměti (RAM) — rychlé, ale dočasné paměti, která se po vypnutí vymaže. Proto se nový soubor musí uložit na disk, jinak zmizí. Když je spuštěných programů moc, paměť dojde a počítač se „zasekává“: zpomalí, nebo program přestane reagovat. Řešením bývá program zavřít (i násilně) nebo zařízení restartovat, čímž se paměť uklidí.",
     "cile": [C("porozumeni", 7, "Žák vysvětlí, co je operační paměť, kde je rozpracovaný soubor před uložením a proč restart „uklidí“ paměť."),
              C("aplikace", 7, "Žák vyřeší situaci, kdy program nereaguje nebo je počítač nezvykle pomalý, a vysvětlí pravděpodobnou příčinu.")],
     "vystupy": ["O10", "Z10", "Z12", "Z13", "Z14"], "rvp": rvp("I-9-4-04", "I-9-4-01"),
     "prerekvizity": [Z + "hardware-a-software"], "souvisi": []},
    {"id": Z + "vrstvy-pocitace", "podoblast": "zarizeni-a-uloziste", "zachovat": "vse"},

    # --- Internet a sítě ---
    {"id": Z + "internet-a-sit", "podoblast": "internet-a-site", "nazev": "Internet, web a wifi",
     "zachovat": ["vrstva", "oblast", "kompetence", "tagy", "cile", "kriteria", "prerekvizity", "souvisi"],
     "popis_pridat": "Internet není totéž co web: web je jen jedna ze služeb, které po internetu běží (vedle e-mailu, her, streamování). Domů se internet dostane kabelem k routeru, který vysílá wifi signál; mobil se připojuje přes mobilní síť a mobilní data. Veřejná wifi je pohodlná, ale cizí — kdo ji provozuje, může provoz sledovat.",
     "vystupy": ["I2", "I3", "I18"], "rvp": rvp("I-9-4-03")},
    {"id": Z + "cesta-dat-internetem", "podoblast": "internet-a-site", "nazev": "Cesta dat internetem",
     "vrstva": "core", "oblast": "digitalni-technologie", "kompetence": None, "tagy": ["teoretický základ"],
     "popis": "Internet vznikl jako síť, která má fungovat, i když část vypadne — proto nemá jeden střed, ale spoustu cest. Data se dělí na balíčky a putují od tvého počítače přes router a další routery a switche až k serveru a zpátky; e-mail jde přes servery obou poskytovatelů. Po cestě data může někdo číst, pokud nejsou šifrovaná — šifrování je udělá pro útočníka po cestě nečitelná.",
     "cile": [C("porozumeni", 8, "Žák na schematickém modelu internetu zakreslí cestu dat mezi svým počítačem a serverem a vysvětlí, proč je internet odolný proti výpadkům."),
              C("analyza", 9, "Žák ve schématu označí, kde může útočník nešifrovanou komunikaci číst a jak to mění šifrování.")],
     "vystupy": ["I4", "I7", "I8", "I9", "I10"], "rvp": rvp("I-9-4-03"),
     "prerekvizity": [Z + "internet-a-sit"], "souvisi": ["kyberbezpecnost-sifrovani-a-https"]},
    {"id": Z + "cloud-a-server", "podoblast": "internet-a-site",
     "zachovat": ["nazev", "vrstva", "oblast", "kompetence", "tagy", "cile", "kriteria", "prerekvizity", "souvisi"],
     "popis_pridat": "Server je obecně počítač připojený k internetu, který ostatním poskytuje služby — web, e-mail, hry, video. Podle toho, jak s ním pracuješ, mluvíme o stahování (download), nahrávání (upload) nebo streamování, kdy se data přehrávají průběžně bez uložení.",
     "vystupy": ["I1", "I22"], "rvp": rvp("I-9-4-03")},
    {"id": Z + "adresy-a-protokoly", "podoblast": "internet-a-site",
     "zachovat": ["nazev", "vrstva", "oblast", "kompetence", "tagy", "cile", "kriteria", "prerekvizity", "souvisi", "popis"],
     "vystupy": ["I5"], "rvp": rvp("I-9-4-03")},
    {"id": Z + "prohlizec-a-vyhledavac", "podoblast": "internet-a-site", "nazev": "Prohlížeč a vyhledávač",
     "vrstva": "navazujici", "oblast": "digitalni-technologie", "kompetence": None, "tagy": ["teoretický základ"],
     "popis": "Webová stránka je text s instrukcemi (HTML, CSS), které prohlížeč teprve převede na to, co vidíš — proto se stejná stránka zobrazí jinak na mobilu a na počítači a trochu jinak v různých prohlížečích. Vyhledávač zase stránky dopředu prochází roboty a staví si z nich rejstřík (index); když hledáš, neprohledává web, ale ten rejstřík.",
     "cile": [C("porozumeni", 8, "Žák vysvětlí, jak prohlížeč „ví“, jak stránku zobrazit, a proč se zobrazení liší podle zařízení a prohlížeče."),
              C("porozumeni", 8, "Žák vysvětlí hlavní myšlenku toho, jak si vyhledávač tvoří přehled o obsahu webu.")],
     "vystupy": ["I6", "I11"], "rvp": rvp("I-9-4-03"),
     "prerekvizity": [Z + "adresy-a-protokoly"], "souvisi": ["tvorba-webu-jak-funguje-web"]},
    {"id": Z + "cloudove-dokumenty-a-sdileni", "podoblast": "internet-a-site", "nazev": "Cloudové dokumenty a sdílení",
     "vrstva": "navazujici", "oblast": "informacni-systemy", "kompetence": "kdi-zap", "tagy": ["praktická dovednost"],
     "popis": "Dokument v cloudu neleží v tvém počítači, ale na serveru, a může ho upravovat víc lidí najednou. Komu co dovolíš, určují přístupová práva a role: čtenář jen čte, komentátor přidává poznámky, přispěvatel upravuje, správce rozhoduje o sdílení. Když ti vypadne připojení, píšeš do kopie, která se po obnovení spojení sloučí; když vypadne cloud, nemá kam ukládat nikdo.",
     "cile": [C("aplikace", 7, "Žák nastaví cloudovému dokumentu různým uživatelům různá práva a vysvětlí rozdíly mezi rolemi."),
              C("analyza", 8, "Žák předpoví, co se s cloudovým dokumentem stane při výpadku připojení nebo služby.")],
     "vystupy": ["I19", "I20", "I21"], "rvp": rvp("I-9-4-03"),
     "prerekvizity": [Z + "cloud-a-server"], "souvisi": ["data-databaze-ucel-informacnich-systemu"]},
    {"id": Z + "kde-jsou-data-fyzicky", "podoblast": "internet-a-site",
     "zachovat": ["nazev", "vrstva", "oblast", "kompetence", "tagy", "cile", "kriteria", "prerekvizity", "souvisi"],
     "popis_pridat": "Pro data na serveru v EU platí GDPR včetně práva „být zapomenut“; u služby mimo EU se trvalého smazání domoci nemusíš a software či cloud z některých zemí může být i bezpečnostní riziko.",
     "vystupy": ["I17", "I26"], "rvp": rvp("I-9-4-03", navic=["INF-INF-004-ZV9-012"])},
    {"id": Z + "api", "podoblast": "internet-a-site", "zachovat": "vse"},

    # --- Zabezpečení zařízení ---
    {"id": Z + "malware-a-antivirus", "podoblast": "zabezpeceni-zarizeni", "nazev": "Malware, antivirus a aktualizace",
     "vrstva": "core", "oblast": "digitalni-technologie", "kompetence": "kdi-bzk", "tagy": ["bezpečí a rizika", "praktická dovednost"],
     "popis": "Malware je škodlivý program — virus, trojský kůň, ransomware, spyware — který se do zařízení dostane obvykle s něčím, co si sám stáhneš nebo spustíš. Hacker je člověk, který hledá cesty dovnitř; často využívá chyby v programech, a právě ty opravují aktualizace. Antivirus hlídá známé hrozby, ale nenahradí opatrnost: stahovat jen z prověřených zdrojů a neodkládat aktualizace.",
     "cile": [C("porozumeni", 7, "Žák rozliší druhy malwaru, vysvětlí vztah mezi chybami v programu, aktualizacemi a hackováním a odliší malware od hackera."),
              C("aplikace", 8, "Žák zabezpečí vlastní zařízení: vybere a nainstaluje spolehlivý antivirus a popíše vlastní pravidla pro stahování.")],
     "vystupy": ["B3", "B4", "B5", "B6", "B7"], "rvp": rvp("I-9-4-05"),
     "prerekvizity": [Z + "operacni-system-a-soubory"], "souvisi": ["kyberbezpecnost-typy-utoku", "kyberbezpecnost-zakladni-hygiena"]},
    {"id": Z + "soukromi-na-zarizeni", "podoblast": "zabezpeceni-zarizeni", "nazev": "Soukromí na zařízení",
     "vrstva": "core", "oblast": "digitalni-technologie", "kompetence": "kdi-bzk", "tagy": ["soukromí", "praktická dovednost"],
     "popis": "Mobil o tobě ví víc, než si myslíš: kde jsi (poloha), co vidí kamera a slyší mikrofon, a každá fotka si nese metadata — čas, model telefonu, často i přesné místo pořízení. Aplikacím se dá přístup k poloze a periferiím zakázat a sledování polohy vypnout; u sdílených fotek stojí za to metadata odstranit.",
     "cile": [C("porozumeni", 7, "Žák vysvětlí, jaké osobní informace lze zjistit z metadat souboru a z přístupu aplikací k poloze či kameře."),
              C("aplikace", 7, "Žák na mobilu vypne sledování polohy a zakáže vybrané aplikaci přístup k periferiím.")],
     "vystupy": ["B10", "B11", "B12"], "rvp": rvp("I-9-4-05"),
     "prerekvizity": [Z + "operacni-system-a-soubory"], "souvisi": ["kyberbezpecnost-soukromi-a-digitalni-stopa"]},
    {"id": Z + "chytra-zarizeni-a-rizika", "podoblast": "zabezpeceni-zarizeni", "nazev": "Chytrá zařízení a jejich rizika",
     "vrstva": "navazujici", "oblast": "digitalni-technologie", "kompetence": "kdi-bzk", "tagy": ["bezpečí a rizika", "dopad na společnost"],
     "popis": "Počítač není jen notebook: malý (mikro)procesor je dnes i v myši, USB disku, lampičce nebo autě. Dokud takový „skrytý počítač“ není připojený k internetu, hrozí mu málo; jakmile je „chytrý“ a online, dá se zvenčí ovládnout nebo z něj číst — a mobil navíc operátorovi neustále hlásí svou polohu. Chytré sítě, auta a domácnosti proto přinášejí vedle pohodlí i bezpečnostní a etické otázky.",
     "cile": [C("porozumeni", 8, "Žák vysvětlí, co je mikroprocesor, a rozliší skrytý počítač bez připojení od chytrého zařízení online včetně jeho rizik."),
              C("hodnoceni", 9, "Žák posoudí rizika chytrých technologií a sledování polohy v bezpečnostní i etické rovině.")],
     "vystupy": ["I23", "I24", "I25", "B13"], "rvp": rvp("I-9-4-05", "I-9-4-03"),
     "prerekvizity": [Z + "internet-a-sit", Z + "hardware-a-software"], "souvisi": ["fyzicky-computing-iot"]},
]

# Výstupy, které mají bublinu v jiném tématu → tam jako kritérium.
JINAM = {
    "I12": "digitalni-obcanstvi-digitalni-stopa-a-soukromi",
    "I13": "digitalni-obcanstvi-jak-funguji-algoritmy-siti",
    "I14": "kyberbezpecnost-soukromi-a-digitalni-stopa",
    "I15": "digitalni-obcanstvi-obchodni-modely-platforem",
    "I16": "kyberbezpecnost-soukromi-a-digitalni-stopa",
    "B1": "kyberbezpecnost-hesla-a-2fa",
    "B2": "kyberbezpecnost-hesla-a-2fa",
    "B8": "kyberbezpecnost-bezpecne-chovani-na-sitich",
    "B9": "kyberbezpecnost-zakladni-hygiena",
    "B14": "umela-inteligence-ai-a-spolecnost",
}

TEMA_POPIS = (
    "Digitální základy jsou vstupní vrstva celé mapy — vysvětlují, jak vlastně funguje svět, ve kterém se "
    "všechno ostatní odehrává. Téma má čtyři části: Soubory a ovládání počítače (typy souborů, ovládání "
    "aplikací, pořádek a zálohy), Zařízení a úložiště (hardware a software, operační systém, kam se "
    "ukládají data a proč se počítač zasekne), Internet a sítě (jak putují data, co je server, cloud "
    "a adresa) a Zabezpečení zařízení (malware, aktualizace, soukromí na mobilu, chytrá zařízení). Nejde "
    "o to stát se technikem, ale o demystifikaci: když víš, že „cloud\" je jen cizí počítač a že appka "
    "volá službu přes API, přestává být digitální svět kouzelná černá skříňka. Na těchto základech pak "
    "stojí Tvorba webů, Tvorba aplikací, Data i Umělá inteligence — proto je téma v mapě úplně na začátku."
)

PORADI = ["id", "nazev", "tema", "podoblast", "oblast", "kompetence", "vrstva", "popis", "rvp", "cile",
          "kriteria", "duraz", "prerekvizity", "souvisi", "tagy", "zdroj", "pokryti_glitchem", "stav"]


class Dumper(yaml.SafeDumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)


Dumper.add_representer(str, lambda d, s: d.represent_scalar(
    "tag:yaml.org,2002:str", s, style="|" if "\n" in s else None))


def garant_krit(key):
    return {"text": VYSTUPY[key], "garant": key}


def sestav(spec, old):
    """Koncept podle specifikace; `old` = dosavadní koncept (nebo None)."""
    old = old or {}
    zach = spec.get("zachovat", [])
    if zach == "vse":
        c = dict(old)
        c["podoblast"] = spec["podoblast"]
        return {k: c[k] for k in PORADI if k in c}
    c = {"id": spec["id"], "tema": TEMA, "podoblast": spec["podoblast"]}
    for k in ("nazev", "vrstva", "oblast", "kompetence", "tagy", "cile", "prerekvizity", "souvisi", "popis"):
        c[k] = old[k] if k in zach else spec.get(k, old.get(k))
    if spec.get("popis_pridat"):
        base = old["popis"].split("\n\n" + spec["popis_pridat"])[0]
        c["popis"] = base + "\n\n" + spec["popis_pridat"]
    stara_krit = [k for k in old.get("kriteria", []) if "garant" not in k] if "kriteria" in zach else []
    c["kriteria"] = stara_krit + [garant_krit(k) for k in spec.get("vystupy", [])]
    c["rvp"] = spec.get("rvp", old.get("rvp", []))
    c["zdroj"] = [z for z in old.get("zdroj", []) if not z.startswith("Garant: Digitální základy")] + [ZDROJ]
    c["pokryti_glitchem"] = old.get("pokryti_glitchem", [])
    c["stav"] = "draft"
    for k in ("cile", "prerekvizity", "souvisi", "tagy"):
        c[k] = c.get(k) or []
    return {k: c[k] for k in PORADI if k in c}


def navrh_md(concepts, by_id):
    pod = {p["id"]: p["nazev"] for p in PODOBLASTI}
    out = ["# Digitální základy — návrh rozdělení výstupů garanta do konceptů", "",
           "Garantův dokument obsahuje 65 výstupů ve 4 kapitolách, bez konceptů, učiva a vazeb. "
           "Tahle tabulka je návrh redakce, jak výstupy rozdělit do bublin mapy — **ke schválení garantem**. "
           "Každý výstup je právě v jednom konceptu jako kritérium (doslovně). Názvy bublin, učivo, cíle i "
           "prerekvizity jsou návrh; v mapě mají stav *draft*.", "",
           "Číslování: O = Ovládání počítače, Z = Principy zařízení (Z0 = nečíslovaný výstup o úložištích), "
           "I = Principy internetu, B = Bezpečnost.", ""]
    for p in PODOBLASTI:
        out += [f"## {p['nazev']}", "", f"*{p['popis']}*", "",
                "| Koncept | Vrstva | Výstupy garanta | Prerekvizity (návrh) | Stávající bublina |", "|---|---|---|---|---|"]
        for c in concepts:
            if c.get("podoblast") != p["id"]:
                continue
            vys = ", ".join(k["garant"] for k in c["kriteria"] if "garant" in k) or "—"
            pre = ", ".join(by_id[x]["nazev"] for x in c["prerekvizity"]) or "—"
            puv = "ano" if c["id"] in PUVODNI else "nová"
            out.append(f"| **{c['nazev']}** | {c['vrstva']} | {vys} | {pre} | {puv} |")
        out.append("")
    out += ["## Bez podoblasti", "", "| Koncept | Poznámka |", "|---|---|",
            "| **Data a informace** | V garantově dokumentu není; zůstává, protože na něj navazuje téma Data. Garant rozhodne, kam patří. |", ""]
    out += ["## Výstupy zařazené do jiných témat", "",
            "Tyhle výstupy už mají bublinu v Kyberbezpečnosti, Digitálním občanství nebo Umělé inteligenci. "
            "Jsou tam doplněné jako kritéria, aby v mapě nevznikly dvě bubliny „hesla“ nebo „malware“.", "",
            "| Výstup | Text (zkráceně) | Bublina |", "|---|---|---|"]
    for k, cid in JINAM.items():
        t = VYSTUPY[k]
        out.append(f"| {k} | {t[:90]}{'…' if len(t) > 90 else ''} | {by_id[cid]['nazev']} ({by_id[cid]['tema']}) |")
    out += ["", "## Otázky pro garanta", "",
            "1. Sedí rozdělení výstupů do bublin a názvy bublin? Které bubliny sloučit / rozdělit?",
            "2. Prerekvizity a vazby „souvisí“ jsou návrh — dokument je neuvádí.",
            "3. Výstupy I12–I17 (cookies, personalizace, digitální stopa, reklama, GDPR) a B1, B2, B8, B9, B14 "
            "jsou v jiných tématech — souhlas?",
            "4. Kapitoly cituje RVP 2021 (I-9-4-01…05). V RVP 2024 odpovídají INF-INF-004-ZV9-011 a 012; "
            "I-9-4-02 (správa dat) a I-9-4-04 (závady) samostatný výstup nemají. Jaké je aktuální znění?",
            "5. Bubliny API, Vrstvy počítače a Data a informace v dokumentu nejsou — nechat?",
            "6. Které bubliny jsou jádrové (core)? Návrh: 12 core, 9 navazujících.", ""]
    return "\n".join(out)


PUVODNI = set()


def main():
    data = yaml.safe_load(YAML_PATH.read_text(encoding="utf-8"))
    concepts = data["concepts"]
    by_id = {c["id"]: c for c in concepts}
    PUVODNI.update(c["id"] for c in concepts if c["tema"] == TEMA and
                   not any(z.startswith("Garant: Digitální základy") for z in c.get("zdroj", [])))
    # při opakovaném běhu: původní = koncepty, které existovaly před prvním během
    PUVODNI.update({Z + s for s in ["hardware-a-software", "data-a-informace", "internet-a-sit", "cloud-a-server", "api",
                                    "reprezentace-dat", "adresy-a-protokoly", "vrstvy-pocitace",
                                    "operacni-system-a-soubory", "kde-jsou-data-fyzicky"]})

    # každý výstup právě jednou
    pouzite = [k for s in KONCEPTY for k in s.get("vystupy", [])] + list(JINAM)
    assert sorted(pouzite) == sorted(VYSTUPY), set(VYSTUPY) ^ set(pouzite) or "duplicitní výstup"

    nove = [sestav(s, by_id.get(s["id"])) for s in KONCEPTY]
    start = min(i for i, c in enumerate(concepts) if c["tema"] == TEMA)
    concepts[:] = ([c for c in concepts[:start] if c["tema"] != TEMA] + nove +
                   [c for c in concepts[start:] if c["tema"] != TEMA])
    by_id = {c["id"]: c for c in concepts}

    for k, cid in JINAM.items():
        c = by_id[cid]
        if not any(x.get("garant") == k for x in c["kriteria"]):
            c["kriteria"].append(garant_krit(k))
        if ZDROJ_JINAM not in c.setdefault("zdroj", []):
            c["zdroj"].append(ZDROJ_JINAM)

    for t in data["temata"]:
        if t["id"] == TEMA:
            t["podoblasti"] = PODOBLASTI
            t["popis"] = TEMA_POPIS

    # vazba uložená jen jednou
    for c in nove:
        for x in c["souvisi"]:
            by_id[x]["souvisi"] = [y for y in by_id[x].get("souvisi", []) if y != c["id"]]
    ids = set(by_id)
    bad = [(c["id"], x) for c in concepts for k in ("prerekvizity", "souvisi") for x in c.get(k, []) if x not in ids]
    assert not bad, bad

    YAML_PATH.write_text(yaml.dump(data, Dumper=Dumper, allow_unicode=True, sort_keys=False,
                                   width=1000, default_flow_style=False), encoding="utf-8")
    NAVRH_PATH.write_text(navrh_md(nove, by_id), encoding="utf-8")
    print(f"Hotovo: téma Digitální základy má {len(nove)} konceptů ve {len(PODOBLASTI)} podoblastech, "
          f"{len(JINAM)} výstupů v jiných tématech, celkem {len(concepts)} konceptů.")


if __name__ == "__main__":
    main()
