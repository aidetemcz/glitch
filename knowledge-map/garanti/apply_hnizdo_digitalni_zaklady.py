#!/usr/bin/env python3
"""Zapracuje výstupy garanta k tématu Digitální základy: každý výstup = koncept.

Zdroj: Google Doc „Digitální základy" (garant, 2026-10) — 65 výstupů („Žák
vysvětlí…") ve čtyřech kapitolách, bez učiva, prerekvizit a vazeb. Podle
rozhodnutí redakce (2026-10-25) je každý výstup samostatná bublina mapy;
kapitoly dokumentu jsou podoblasti tématu.

Co skript dělá:
  - 65 konceptů: název, krátké učivo a cíl jsou NÁVRH REDAKCE (stav „draft"),
    výstup garanta je kritériem doslovně (VYSTUPY)
  - 6 stávajících bublin si nechává id (odkazují na ně jiná témata) a dostává
    obsah odpovídajícího výstupu (PUVODNI_ID); 4 bubliny mimo dokument
    (Data a informace, Reprezentace dat, API, Vrstvy počítače) se mažou (SMAZAT)
  - prerekvizity garant neuvádí → zatím žádné; vazby „souvisí" jen tam, kde má
    výstup protějšek v jiném tématu (SOUVISI)
  - staré kódy RVP (I-9-4-0x) → INF-INF-004-ZV9-011/012 s poznámkou
  - vygeneruje garanti/digitalni-zaklady-navrh.md — přehled pro garanta

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
ZDROJ = "Garant: Digitální základy (2026-10) — výstup; název, učivo a cíl: návrh redakce ke schválení"

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
KAPITOLA_PODOBLAST = {"O": "soubory-a-ovladani", "Z": "zarizeni-a-uloziste", "I": "internet-a-site", "B": "zabezpeceni-zarizeni"}
KAPITOLA_RVP = {"O": ["I-9-4-02"], "Z": ["I-9-4-01"], "I": ["I-9-4-03"], "B": ["I-9-4-05"]}

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
    for k in navic:
        seen.add(k)
        out.append({"kod": k, "vystup": RVP_2024[k]})
    for s in stare:
        novy, text = RVP_2021[s]
        if novy and novy not in seen:
            seen.add(novy)
            out.append({"kod": novy, "vystup": RVP_2024[novy], "poznamka": f"garant: {s} – {text}"})
        elif not novy:
            out.append({"kod": None, "vystup": "", "poznamka": f"RVP 2021: {s} – {text} (v RVP 2024 bez samostatného výstupu)"})
    return out


# klíč výstupu → (slug, název bubliny, úroveň cíle, cíl, učivo). Vše kromě výstupu = návrh redakce.
KONCEPTY = {
    "O1": ("typy-souboru-a-pripony", "Typy souborů a přípony", "porozumeni",
           "Žák rozpozná typ souboru podle přípony, vybere k němu program a vysvětlí, proč se přípony někdy nezobrazují.",
           "Obrázek, text, video, hudba — každý soubor má typ a ten poznáš podle přípony (jpg, pdf, mp4). Podle typu se vybírá program, který soubor otevře. Počítač i mobil přípony často skrývají, aby nepletly; zobrazit se dají v nastavení."),
    "O2": ("prevod-do-pdf", "Převod do PDF", "aplikace",
           "Žák převede soubor do pdf a vysvětlí, proč se pdf hodí na tisk a sdílení.",
           "PDF je formát, který vypadá všude stejně — na mobilu, v tiskárně i u někoho s jiným programem. Většina aplikací do něj umí uložit nebo „vytisknout“ dokument, obrázek i prezentaci."),
    "O3": ("zakladni-ovladani-aplikaci", "Základní ovládání aplikací", "aplikace",
           "Žák rutinně používá uložení a načtení, schránku, krok zpět a vpřed, lupu a posun v různých aplikacích.",
           "Ať tvoříš text, nebo obrázek, aplikace se ovládají stejnými mechanismy: uložit a načíst, kopírovat přes schránku, krok zpět a vpřed, přiblížit lupou, posouvat se v dokumentu. Kdo je ovládá, zvládne i program, který nikdy neviděl."),
    "O4": ("prace-s-casovou-osou", "Práce s časovou osou", "aplikace",
           "Žák v aplikaci pro video, zvuk nebo animaci pracuje s časovou osou.",
           "Video, zvuk a animace mají navíc čas: v časové ose vidíš, co se kdy stane, a přesouváš, stříháš a zarovnáváš úseky. Stejný princip má střih videa, hudební editor i animace v prezentaci."),
    "O5": ("struktura-dokumentu-styly-a-vrstvy", "Struktura dokumentu: styly a vrstvy", "aplikace",
           "Žák mění vlastnosti dokumentu přes jeho strukturu — styly odstavců v textu, vrstvy objektů v prezentaci.",
           "Dokument není jen hromada písmen: odstavce mají styly, objekty v prezentaci leží ve vrstvách nad sebou. Když změníš styl místo každého nadpisu zvlášť, změna se projeví všude naráz."),
    "O6": ("rozliseni-obrazu", "Rozlišení obrazu", "porozumeni",
           "Žák vysvětlí, co je rozlišení obrazu a jak se projevuje na displeji, při focení, v tisku i ve velikosti souboru.",
           "Rozlišení říká, z kolika bodů se obraz skládá. Víc bodů znamená ostřejší obraz na velkém displeji nebo v tisku, ale i větší soubor; na malém displeji mobilu rozdíl často nepoznáš."),
    "O7": ("organizace-souboru-do-slozek", "Organizace souborů do složek", "tvorba",
           "Žák navrhne pro větší množství souborů strukturu složek, založí ji a soubory do ní rozmístí.",
           "Sto souborů na ploše se nedá najít. Složky s jasnými názvy — podle předmětu, projektu nebo roku — jsou základní nástroj pořádku, který musíš navrhnout dřív, než začneš soubory přesouvat."),
    "O8": ("fotky-z-mobilu-do-pocitace", "Fotky z mobilu do počítače", "aplikace",
           "Žák přenese fotky a videa z mobilu do počítače, uspořádá je do složek a klíčové přejmenuje.",
           "Fotky z mobilu se hromadí po stovkách. Přenést je do počítače, roztřídit do několika složek a ty důležité přejmenovat tak, aby bylo z názvu poznat, co na nich je — bez téhle údržby je sbírka k ničemu."),
    "O9": ("zalohovani-dat", "Zálohování dat", "porozumeni",
           "Žák vysvětlí význam zálohování a popíše svá vlastní pravidla zálohování.",
           "Disk se rozbije, mobil ztratí, účet zablokuje. Záloha je kopie důležitých dat na jiném místě — na druhém disku, v cloudu. Důležitá jsou pravidla: co, kam a jak často."),
    "O10": ("zaseknuty-program", "Když se program zasekne", "porozumeni",
            "Žák vysvětlí, co znamená, že se program „zasekl“, a jak situaci vyřešit.",
            "Program přestane reagovat, když čeká na něco, co nepřijde, nebo mu došla paměť. Většinou pomůže chvíli počkat, pak program násilně ukončit a znovu spustit; rozdělaná práce bez uložení je pryč."),
    "Z0": ("typy-trvalych-ulozist", "Typy trvalých úložišť", "porozumeni",
           "Žák vysvětlí výhody a nevýhody různých typů trvalých úložišť dat.",
           "Pevný disk, SSD, USB flash disk, SD karta, interní paměť mobilu, DVD — každé úložiště má jinou kapacitu, rychlost, odolnost a cenu. Podle toho se hodí na jiný účel: velký archiv, přenos mezi počítači, fotky v mobilu."),
    "Z1": ("lokalne-nebo-v-cloudu", "Lokálně, nebo v cloudu", "hodnoceni",
           "Žák popíše rozdíl mezi uložením dat lokálně a v cloudu a posoudí výhody a nevýhody obou.",
           "Lokálně uložená data máš u sebe a fungují i bez internetu; v cloudu leží na cizím serveru, dostaneš se k nim odkudkoli a nepřijdeš o ně se ztraceným zařízením — ale potřebuješ připojení a musíš poskytovateli věřit."),
    "Z2": ("bezpecne-smazani-dat", "Bezpečné smazání dat", "porozumeni",
           "Žák vysvětlí „líné“ mazání dat a popíše, jak data před vyhozením zařízení odstranit bezpečně.",
           "Smazaný soubor z disku hned nezmizí — systém si jen přestane pamatovat, kde ležel, a data tam zůstávají, dokud je něco nepřepíše. Než zařízení vyhodíš nebo prodáš, musíš je přepsat nebo zašifrovat; někdy je lepší ho nevyhazovat vůbec."),
    "Z3": ("operacni-system", "Operační systém", "porozumeni",
           "Žák vysvětlí význam operačního systému a přiřadí základní operační systémy k typickým zařízením.",
           "Operační systém (Windows, Android, iOS, macOS) řídí celé zařízení: spouští aplikace, dává jim přístup k hardwaru a stará se o soubory. Mobil má jiný systém než počítač, ale oba dělají to samé."),
    "Z4": ("komprese-dat", "Komprese dat", "porozumeni",
           "Žák vysvětlí, jak komprese souvisí s velikostí dat a proč nejde komprimovat donekonečna.",
           "Komprese zmenší soubor tím, že odstraní opakování nebo nepodstatné detaily. Co je jednou zkomprimované, už se znovu skoro nezmenší — zbývající data jsou nahodilá a není v nich co ušetřit."),
    "Z5": ("velikost-dat-mb-a-gb", "Velikost dat: MB a GB", "porozumeni",
           "Žák vysvětlí zkratky MB a GB a odhadne řádové velikosti fotek a filmů.",
           "Velikost dat se měří v bytech: megabyte (MB) je milion, gigabyte (GB) miliarda bytů. Fotka má jednotky MB, film jednotky GB — podle toho poznáš, co se vejde na kartu nebo do mobilu."),
    "Z6": ("propojeni-mobilu-a-pocitace", "Propojení mobilu a počítače", "aplikace",
           "Žák propojí mobil s počítačem bez internetu (např. přes USB) a překopíruje mezi nimi data.",
           "Mobil a počítač se dají spojit i bez wifi a internetu — kabelem přes USB nebo přes Bluetooth. Pak se mezi nimi kopírují fotky a soubory jako mezi dvěma složkami."),
    "Z7": ("pripojeni-externich-zarizeni", "Připojení externích zařízení", "aplikace",
           "Žák připojí k počítači monitor, projektor nebo tiskárnu.",
           "Monitor, projektor, tiskárna, klávesnice — každé externí zařízení potřebuje správný port nebo bezdrátové spojení a někdy i ovladač. Zapojit, zvolit zdroj či zařízení v nastavení, hotovo."),
    "Z8": ("instalace-a-odinstalace-aplikaci", "Instalace a odinstalace aplikací", "aplikace",
           "Žák nainstaluje a odinstaluje aplikaci.",
           "Aplikace se instalují z obchodu nebo z instalačního souboru a odinstalují přes nastavení systému — nestačí smazat ikonu. Co nepoužíváš, odinstaluj: zabírá místo a může být bezpečnostní riziko."),
    "Z9": ("aktualizace-aplikaci", "Aktualizace aplikací", "hodnoceni",
           "Žák aktualizuje aplikaci a posoudí výhody a nevýhody aktualizací.",
           "Aktualizace přinášejí opravy chyb a bezpečnostní záplaty, občas i nové funkce — a občas změny, které se nehodí nebo nefungují na starém zařízení. Odkládat je ale znamená nechat otevřené známé díry."),
    "Z10": ("restart-a-uklid-operacni-pameti", "Restart a úklid operační paměti", "porozumeni",
            "Žák vysvětlí, proč zavření aplikace nebo restart „uklidí“ operační paměť zařízení.",
            "Každá spuštěná aplikace si drží kus operační paměti. Zavřením ji vrátí, restartem se vyprázdní celá — proto zpomalený mobil nebo počítač po restartu zase běží."),
    "Z11": ("vyber-zarizeni-komponenty-a-parametry", "Hardware a výběr zařízení", "hodnoceni",
            "Žák při výběru mobilu či notebooku diskutuje o parametrech základních komponent a možnostech připojení.",
            "Při nákupu rozhodují komponenty: procesor a počet jader, operační paměť, trvalé úložiště, grafická karta — a to, jak se zařízení připojí k dalším (porty, wifi, Bluetooth). Správná volba závisí na tom, k čemu zařízení chceš."),
    "Z12": ("proc-se-pocitac-zasekava", "Proč se počítač zasekává", "porozumeni",
            "Žák vysvětlí, co může způsobovat, že je počítač pomalejší než obvykle.",
            "Pomalý počítač má obvykle plnou operační paměť, plný disk, program běžící na pozadí, přehřátí nebo malware. Rozpoznat příčinu je první krok k nápravě."),
    "Z13": ("programy-a-operacni-pamet", "Programy a operační paměť", "porozumeni",
            "Žák vysvětlí vztah mezi počtem spuštěných programů a operační pamětí.",
            "Operační paměť (RAM) je rychlá, ale omezená. Každý spuštěný program z ní ukrajuje; když dojde, systém začne odkládat data na pomalý disk a všechno se zpomalí."),
    "Z14": ("kde-je-neulozeny-soubor", "Kde je neuložený soubor", "porozumeni",
            "Žák vysvětlí, kde se nachází nově založený soubor předtím, než ho uložíme na disk.",
            "Nový dokument nebo obrázek existuje nejdřív jen v operační paměti — rychlé, ale dočasné. Dokud ho neuložíš na disk nebo do cloudu, výpadek proudu nebo pád programu ho smaže."),
    "I1": ("server", "Server a cloud", "porozumeni",
           "Žák vysvětlí, co je server — počítač připojený k internetu, který poskytuje služby.",
           "Server je počítač připojený k internetu, který ostatním poskytuje služby: web, e-mail, hry, video. Není nijak kouzelný — je to výkonný počítač v datovém centru, který běží pořád. „Cloud“ je jen jiné slovo pro cizí server, na kterém máš data nebo ti počítá."),
    "I2": ("internet-web-a-wifi", "Internet, web a wifi", "porozumeni",
           "Žák vysvětlí rozdíl mezi internetem, webem, wifi, routerem, mobilním signálem a mobilními daty a zakreslí jejich vztah.",
           "Internet je síť sítí; web je jedna ze služeb, které po něm běží. Domů internet přivádí kabel do routeru, který vysílá wifi signál; mobil se připojuje přes mobilní síť a mobilní data. Jsou to různé věci, které se v řeči pletou."),
    "I3": ("elektricka-sit-vs-internetove-kabely", "Elektrická síť vs. internetové kabely", "porozumeni",
           "Žák vysvětlí rozdíly mezi elektrickou rozvodnou sítí a internetovými kabely.",
           "Obojí jsou „sítě“ s kabely, ale elektřina teče jako energie od elektrárny ke spotřebiči, zatímco po internetových kabelech putují data oběma směry, v balíčcích a po různých cestách."),
    "I4": ("vznik-a-architektura-internetu", "Vznik a architektura internetu", "porozumeni",
           "Žák popíše, jak a proč vznikl internet a jak to ovlivnilo jeho architekturu.",
           "Internet vznikl jako síť, která má fungovat, i když část vypadne. Proto nemá jeden střed: data se dělí na balíčky a hledají si cestu přes mnoho propojených uzlů."),
    "I5": ("ip-adresa-url-a-dns", "IP adresa, URL a DNS", "porozumeni",
           "Žák vysvětlí, co je IP adresa, URL a DNS a jaký je mezi nimi vztah.",
           "Každé zařízení na internetu má číselnou IP adresu; lidé si pamatují jména (URL jako seznam.cz). DNS je služba, která jméno přeloží na adresu — telefonní seznam internetu."),
    "I6": ("jak-prohlizec-zobrazi-stranku", "Jak prohlížeč zobrazí stránku", "porozumeni",
           "Žák vysvětlí, jak prohlížeč „ví“, jak stránku zobrazit, a proč se liší na mobilu, počítači a v různých prohlížečích.",
           "Stránka přichází jako text s instrukcemi (HTML, CSS) a prohlížeč ji teprve vykreslí. Proto vypadá jinak na úzkém mobilu než na monitoru a trochu jinak v každém prohlížeči."),
    "I7": ("cesta-pozadavku-k-webovemu-serveru", "Cesta požadavku k webovému serveru", "aplikace",
           "Žák ve schématu internetu zakreslí, jak jeho počítač komunikuje s webovým serverem při načtení stránky.",
           "Když načítáš stránku, požadavek jde z tvého počítače přes domácí router, dál přes routery a switche poskytovatelů až k serveru — a odpověď stejnou cestou zpátky."),
    "I8": ("robustnost-internetu", "Robustnost internetu", "analyza",
           "Žák ve schématu označí, která zařízení při poškození zprávu zastaví a která ne, a diskutuje robustnost internetu.",
           "Zpráva na sociální síti jde přes server sítě; vypadne-li router po cestě, data si najdou jinou. Zastaví je jen výpadek něčeho, co nemá náhradu — tvého připojení nebo serveru sítě."),
    "I9": ("cesta-e-mailu", "Cesta e-mailu", "analyza",
           "Žák ve schématu označí cestu e-mailu mezi dvěma poskytovateli a část, kde je typicky nešifrovaný.",
           "E-mail putuje z tvého zařízení na server tvého poskytovatele, odtud na server poskytovatele příjemce a k němu. Mezi servery bývá šifrovaný, ale na serverech leží čitelný — kdo k nim má přístup, čte."),
    "I10": ("sifrovana-a-nesifrovana-komunikace", "Šifrovaná a nešifrovaná komunikace", "hodnoceni",
            "Žák na modelu posílání zprávy zhodnotí, kdy může útočník komunikaci „po cestě“ přečíst.",
            "Nešifrovaná zpráva je po cestě jako pohlednice — každý uzel ji může číst. Šifrovaná je pro útočníka po cestě nečitelná; dá se přečíst jen u odesílatele a příjemce."),
    "I11": ("jak-funguje-vyhledavac", "Jak funguje vyhledávač", "porozumeni",
            "Žák vysvětlí hlavní myšlenku toho, jak si vyhledávač tvoří přehled o obsahu webu.",
            "Vyhledávač web neprohledává ve chvíli, kdy hledáš. Jeho roboti stránky procházejí dopředu a stavějí z nich rejstřík (index); ty pak prohledáváš rejstřík, ne web."),
    "I12": ("cookies", "Cookies", "porozumeni",
            "Žák popíše výhody a nevýhody cookies.",
            "Cookie je malý záznam, který si web uloží v tvém prohlížeči: díky němu zůstaneš přihlášený a nákupní košík se nevysype. Stejný mechanismus ale umožňuje sledovat tě napříč weby."),
    "I13": ("personalizovany-obsah", "Personalizovaný obsah", "hodnoceni",
            "Žák uvede příklady personalizovaného obsahu, vysvětlí, jak personalizace funguje, a posoudí její výhody a nevýhody.",
            "Reklamy, videa, zprávy i výsledky vyhledávání se přizpůsobují tomu, co o tobě služba ví. Je to pohodlné — a zároveň tě to zavírá do bubliny a prodává tvou pozornost."),
    "I14": ("digitalni-stopa-a-digitalni-identita", "Digitální stopa a digitální identita", "porozumeni",
            "Žák rozliší digitální stopu a digitální identitu a popíše, čím stopu vytváří.",
            "Digitální identita je to, kým na internetu jsi (účty, profily); digitální stopa je všechno, co po sobě necháváš — příspěvky, lajky, polohu, historii hledání. Stopa vzniká i bez tvého vědomí."),
    "I15": ("financovani-socialnich-siti-reklamou", "Financování sociálních sítí reklamou", "porozumeni",
            "Žák popíše princip financování sociálních sítí pomocí reklamy.",
            "Sociální síť je zdarma, protože platí inzerenti — za tvou pozornost a za možnost cílit reklamu podle toho, co o tobě síť ví. Čím déle tě udrží, tím víc vydělá."),
    "I16": ("osobni-data-a-treti-strany", "Osobní data a třetí strany", "hodnoceni",
            "Žák popíše, jaká osobní data mohou získat třetí osoby a instituce, a jak tomu může uživatel zabránit.",
            "Weby, aplikace, operátoři i úřady mohou získat tvou polohu, kontakty, zájmy, historii nákupů. Část toho dovoluješ sám v nastavení a souhlasech — a část se dá omezit, když víš kde."),
    "I17": ("gdpr-a-pravo-byt-zapomenut", "GDPR a právo být zapomenut", "porozumeni",
            "Žák vysvětlí, zda a jak lze podle GDPR trvale smazat osobní data ze serveru v EU a mimo EU.",
            "V EU máš podle GDPR právo žádat smazání svých dat a služba musí vyhovět. U serveru mimo EU se tohoto práva domoci nemusíš — data tam mohou zůstat napořád. Kde fyzicky data leží, proto není jedno."),
    "I18": ("verejna-vs-domaci-wifi", "Veřejná vs. domácí wifi", "hodnoceni",
            "Žák popíše rozdíl mezi veřejnou a domácí wifi a posoudí, co na veřejné wifi (ne)dělat.",
            "Domácí wifi provozuješ ty; veřejnou někdo cizí, kdo může provoz sledovat nebo podvrhnout. Přihlašování do banky nebo nákupy na veřejnou wifi nepatří — nebo jen přes šifrované spojení."),
    "I19": ("pristupova-prava-ke-cloudovemu-dokumentu", "Přístupová práva ke cloudovému dokumentu", "aplikace",
            "Žák nastaví cloudovému dokumentu různým uživatelům různá přístupová práva.",
            "Cloudový dokument sdílíš nastavením práv: kdo může číst, komentovat, upravovat. Odkaz „pro každého“ je nejpohodlnější a nejrizikovější."),
    "I20": ("cloudovy-dokument-pri-vypadku", "Cloudový dokument při výpadku", "analyza",
            "Žák vysvětlí, co se stane s cloudovým dokumentem při výpadku jeho připojení, připojení kolegy nebo cloudu.",
            "Když ti vypadne připojení, píšeš do místní kopie, která se po obnovení sloučí; výpadek kolegy tvou práci neovlivní; když vypadne cloud, nemá kam ukládat nikdo."),
    "I21": ("uzivatelske-role-v-dokumentech", "Uživatelské role v dokumentech", "porozumeni",
            "Žák vysvětlí rozdíly mezi rolemi Čtenář, Komentátor, Přispěvatel a Správce obsahu a porovná jejich práva.",
            "Čtenář jen čte, komentátor přidává poznámky, přispěvatel mění obsah, správce rozhoduje, kdo smí co. Role jsou odstupňovaná důvěra."),
    "I22": ("streamovani-upload-a-download", "Streamování, upload a download", "porozumeni",
            "Žák vysvětlí rozdíl mezi streamováním, uploadováním a downloadováním.",
            "Download stáhne soubor k tobě, upload ho pošle na server, streamování přehrává data průběžně, aniž by se celý soubor uložil — proto video jede hned, ale bez připojení zmizí."),
    "I23": ("mikroprocesor-a-virus-v-periferii", "Mikroprocesor a virus v periferii", "porozumeni",
            "Žák vysvětlí, zda může virus napadnout periferní zařízení, a vysvětlí pojem mikroprocesor.",
            "Mikroprocesor je malý „mozek“ — a je dnes i v myši, USB disku nebo lampičce. Kde je procesor a paměť, tam může běžet program, a tedy i škodlivý."),
    "I24": ("skryty-a-chytry-pocitac", "Skrytý a chytrý počítač", "porozumeni",
            "Žák rozliší skrytý počítač bez připojení od chytrého zařízení online a vysvětlí jeho rizika.",
            "Počítač v pračce nebo autě bez internetu je „skrytý“ a zvenčí nedosažitelný. Jakmile je zařízení „chytré“ a online, dá se zvenčí ovládnout, odposlouchávat nebo zneužít."),
    "I25": ("poloha-mobilu-a-operator", "Poloha mobilu a operátor", "tvorba",
            "Žák vymyslí situace, kdy je pro majitele mobilu nevýhodné, že se třetí strana dozví jeho polohu.",
            "Mobil se neustále hlásí vysílačům, takže operátor ví, kde jsi. Když se to dozví třetí strana — zaměstnavatel, bývalý partner, zloděj — může to být nepříjemné i nebezpečné."),
    "I26": ("software-a-cloud-mimo-eu", "Software a cloud mimo EU", "porozumeni",
            "Žák vysvětlí bezpečnostní rizika používání softwaru a cloudových služeb ze zemí mimo EU a pojem trojský kůň.",
            "Software a cloud z některých zemí mohou podléhat tamním zákonům a tajným službám — antivirus nebo cloud elektrárny tak může být trojský kůň: tváří se užitečně a zevnitř otevírá dveře."),
    "B1": ("bezpecne-heslo", "Bezpečné heslo", "aplikace",
           "Žák rozpozná více a méně bezpečná hesla a vytvoří si bezpečné heslo.",
           "Bezpečné heslo je dlouhé, jedinečné a neuhodnutelné — třeba fráze z několika slov. Krátké heslo, jméno nebo datum narození prolomí program za sekundy."),
    "B2": ("ucet-heslo-autentizace-sifrovani-kodovani", "Účet, heslo, autentizace, šifrování, kódování", "porozumeni",
           "Žák vysvětlí rozdíl mezi účtem, heslem, autentizací, šifrováním a kódováním.",
           "Účet je tvá identita ve službě, heslo klíč k němu, autentizace ověření, že jsi to ty. Kódování převádí data do jiné podoby, aby se daly uložit; šifrování je převádí tak, aby je bez klíče nikdo nepřečetl."),
    "B3": ("antivirus", "Antivirus", "aplikace",
           "Žák najde spolehlivý antivirus a nainstaluje ho na mobil či počítač.",
           "Antivirus hlídá známé hrozby — ale sám může být podvod. Spolehlivý je ten z ověřeného zdroje s dobrou pověstí, ne první výsledek s nápisem „váš počítač je napaden“."),
    "B4": ("druhy-malwaru", "Druhy malwaru", "porozumeni",
           "Žák rozliší alespoň tři druhy malwaru, vysvětlí jejich princip a odliší malware od hackera.",
           "Virus se šíří připojením k jiným souborům, trojský kůň se tváří jako užitečný program, ransomware zašifruje data a chce výkupné, spyware tě sleduje. Malware je program; hacker je člověk."),
    "B5": ("chyby-v-programu-aktualizace-a-hackovani", "Chyby v programu, aktualizace a hackování", "porozumeni",
           "Žák vysvětlí vztah mezi chybami v programu, aktualizacemi a hackováním.",
           "Každý program má chyby; některé jsou díra, kterou lze zneužít. Útočníci je hledají, výrobci je opravují aktualizacemi. Neaktualizované zařízení má známé a otevřené díry."),
    "B6": ("cile-a-metody-hackeru", "Cíle a metody hackerů", "hodnoceni",
           "Žák diskutuje o cílech a metodách hackerů.",
           "Hackeři chtějí peníze, data, přístup nebo pozornost. Metody sahají od zneužití chyb v programech přes podvodné zprávy až po hádání hesel — a často je nejslabší článek člověk."),
    "B7": ("bezpecne-stahovani", "Bezpečné stahování", "aplikace",
           "Žák popíše svá osobní pravidla pro bezpečné hledání a stahování aplikací a souborů.",
           "Stahuj jen z oficiálních obchodů a prověřených stránek, čti, co instalace chce povolit, a nevěř tlačítkům „Stáhnout“ v reklamách. Vlastní pravidla jsou lepší než spoléhání na antivirus."),
    "B8": ("pravidla-bezpecneho-chovani-na-internetu", "Pravidla bezpečného chování na internetu", "tvorba",
           "Žák diskutuje o bezpečném chování na internetu a sepíše pravidla pro žáky 5. třídy.",
           "Bezpečné chování má různé roviny: co sdílíš, komu věříš, na co klikáš, jak chráníš účty. Sepsat pravidla pro mladší spolužáky znamená vybrat to podstatné a vysvětlit proč."),
    "B9": ("prvky-zabezpeceni-pocitace-a-komunikace", "Prvky zabezpečení počítače a komunikace", "tvorba",
           "Žák vytvoří myšlenkovou mapu prvků zabezpečení — firewall, antivirus, dvoufaktorová autentizace, end-to-end šifrování.",
           "Zabezpečení je víc vrstev: firewall hlídá síťový provoz, antivirus soubory, dvoufaktorová autentizace účty, end-to-end šifrování zprávy. Myšlenková mapa ukáže, co chrání co."),
    "B10": ("metadata-fotografii", "Metadata fotografií", "porozumeni",
            "Žák vysvětlí, co útočník zjistí z metadat fotografie o jejím autorovi.",
            "Fotka v sobě nese metadata: čas, model telefonu, nastavení a často i přesnou polohu. Z fotky sdílené s metadaty se dá vyčíst, kde bydlíš nebo kdy nejsi doma."),
    "B11": ("vypnuti-sledovani-polohy", "Vypnutí sledování polohy", "aplikace",
            "Žák demonstruje, jak na mobilu vypnout sledování polohy.",
            "Poloha se dá vypnout celkově nebo jen pro vybrané aplikace — mapy ji potřebují, hra s baterkou ne. Najít nastavení a rozhodnout, komu polohu dáš, je základní hygiena."),
    "B12": ("pristup-aplikaci-ke-kamere-a-periferiim", "Přístup aplikací ke kameře a periferiím", "aplikace",
            "Žák demonstruje, jak aplikacím v mobilu zakázat přístup ke kameře a dalším periferiím.",
            "Každá aplikace si říká o oprávnění: kamera, mikrofon, kontakty. V nastavení mobilu se dají zkontrolovat a odebrat — aplikace na kalkulačku kameru nepotřebuje."),
    "B13": ("rizika-chytrych-technologii", "Rizika chytrých technologií", "hodnoceni",
            "Žák diskutuje o rizikách chytrých technologií (smart grid, chytrá auta) v etické i bezpečnostní rovině.",
            "Chytrá síť, chytré auto, chytrá domácnost: pohodlí a úspora, ale i možnost, že technologii někdo hackne nebo že sbírá víc dat, než je nutné. Rizika jsou technická i etická."),
    "B14": ("pouziti-ai-a-jeho-rizika", "Použití AI a jeho rizika", "hodnoceni",
            "Žák uvede příklady použití umělé inteligence a popíše jejich možná rizika.",
            "AI doporučuje videa, překládá, řídí auta, rozhoduje o půjčkách. Každé použití nese rizika — chyby, zkreslení, zneužití, ztrátu kontroly — a stojí za to je umět pojmenovat."),
}

# Stávající bubliny, které odpovídají výstupu → výstup si nechá jejich id (odkazy z jiných témat).
PUVODNI_ID = {
    "I1": Z + "cloud-a-server", "I2": Z + "internet-a-sit", "I5": Z + "adresy-a-protokoly",
    "Z3": Z + "operacni-system-a-soubory", "I17": Z + "kde-jsou-data-fyzicky", "Z11": Z + "hardware-a-software",
}
# Stávající bubliny mimo dokument garanta → smazat (odkazy z jiných témat zanikají).
SMAZAT = [Z + "data-a-informace", Z + "reprezentace-dat", Z + "api", Z + "vrstvy-pocitace"]
# Výstupy se stejným tématem v jiné části mapy → souvisí (duplicitu řeší garant).
SOUVISI = {
    "O9": ["kyberbezpecnost-zakladni-hygiena"], "Z4": ["data-databaze-kodovani-dat"],
    "I6": ["tvorba-webu-jak-funguje-web"], "I10": ["kyberbezpecnost-sifrovani-a-https"],
    "I12": ["digitalni-obcanstvi-digitalni-stopa-a-soukromi"], "I13": ["digitalni-obcanstvi-jak-funguji-algoritmy-siti"],
    "I14": ["kyberbezpecnost-soukromi-a-digitalni-stopa"], "I15": ["digitalni-obcanstvi-obchodni-modely-platforem"],
    "I16": ["kyberbezpecnost-soukromi-a-digitalni-stopa"], "I21": ["data-databaze-ucel-informacnich-systemu"],
    "I24": ["fyzicky-computing-iot"], "B1": ["kyberbezpecnost-hesla-a-2fa"],
    "B2": ["kyberbezpecnost-hesla-a-2fa", "data-databaze-sifrovani-dat"], "B4": ["kyberbezpecnost-typy-utoku"],
    "B5": ["kyberbezpecnost-zakladni-hygiena"], "B8": ["kyberbezpecnost-bezpecne-chovani-na-sitich"],
    "B9": ["kyberbezpecnost-zakladni-hygiena"], "B10": ["kyberbezpecnost-soukromi-a-digitalni-stopa"],
    "B14": ["umela-inteligence-ai-a-spolecnost"],
}
# Výstup I-9-4-04 (závady) garant „rozprostřel mezi témata" → k výstupům o zasekávání.
ZAVADY = {"O10", "Z10", "Z12", "Z13"}
KOMPETENCE = {"O": "kdi-dat", "Z": None, "I": None, "B": "kdi-bzk"}
TAGY = {"O": ["praktická dovednost"], "Z": ["teoretický základ"], "I": ["teoretický základ"], "B": ["bezpečí a rizika", "praktická dovednost"]}
OBLAST = {"O": "digitalni-technologie", "Z": "digitalni-technologie", "I": "digitalni-technologie", "B": "digitalni-technologie"}

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


def kapitola(key):
    return key[0]


def koncept(key, old):
    slug, nazev, uroven, cil, popis = KONCEPTY[key]
    k = kapitola(key)
    old = old or {}
    c = {
        "id": PUVODNI_ID.get(key, Z + slug),
        "nazev": nazev,
        "tema": TEMA,
        "podoblast": KAPITOLA_PODOBLAST[k],
        "oblast": OBLAST[k],
        "kompetence": old.get("kompetence") or KOMPETENCE[k],
        "vrstva": "core",
        "popis": popis,
        "rvp": rvp(*(KAPITOLA_RVP[k] + (["I-9-4-04"] if key in ZAVADY else []))),
        "cile": [{"uroven": uroven, "text": cil}],
        "kriteria": [{"text": VYSTUPY[key], "garant": key}],
        "prerekvizity": [],
        "souvisi": list(SOUVISI.get(key, [])),
        "tagy": old.get("tagy") or TAGY[k],
        "zdroj": [z for z in old.get("zdroj", []) if not z.startswith("Garant: Digitální základy")] + [ZDROJ],
        "pokryti_glitchem": old.get("pokryti_glitchem", []),
        "stav": "garant",     # rozpracováno garantem; „hotovo" až po schválení
    }
    return {k2: c[k2] for k2 in PORADI if k2 in c}


def navrh_md(nove, by_id):
    out = ["# Digitální základy — výstupy garanta jako koncepty", "",
           "Garantův dokument obsahuje 65 výstupů ve 4 kapitolách, bez učiva a vazeb. Podle rozhodnutí redakce "
           "je **každý výstup samostatná bublina** mapy; kapitoly dokumentu jsou podoblasti tématu. Výstup je "
           "v bublině doslovně jako kritérium; název bubliny, krátké učivo a cíl jsou návrh redakce — "
           "**ke schválení garantem** (v mapě stav *draft*).", "",
           "Číslování: O = Ovládání počítače, Z = Principy zařízení (Z0 = nečíslovaný výstup o úložištích), "
           "I = Principy internetu, B = Bezpečnost.", ""]
    for p in PODOBLASTI:
        out += [f"## {p['nazev']}", "", f"*{p['popis']}*", "",
                "| Výstup | Bublina | Úroveň cíle | Souvisí (jiné téma) | Pozn. |", "|---|---|---|---|---|"]
        for c in nove:
            if c.get("podoblast") != p["id"] or not any("garant" in k for k in c["kriteria"]):
                continue
            key = c["kriteria"][0]["garant"]
            sv = ", ".join(by_id[x]["nazev"] for x in c["souvisi"]) or "—"
            pozn = "stávající bublina, id zachováno" if key in PUVODNI_ID else ""
            out.append(f"| {key} | **{c['nazev']}** | {c['cile'][0]['uroven']} | {sv} | {pozn} |")
        out.append("")
    out += ["## Smazané bubliny", "",
            "Dřívější bubliny tématu, které v dokumentu garanta nejsou, byly odstraněny: "
            "Data a informace, Reprezentace dat, API, Vrstvy počítače (včetně vazeb z jiných témat).", ""]
    out += ["", "## Otázky pro garanta", "",
            "1. Sedí názvy bublin a krátké učivo? Je úroveň cíle (porozumění / aplikace / analýza / hodnocení / tvorba) u každého výstupu správně?",
            "2. Prerekvizity dokument neuvádí — zatím žádné nejsou. Které výstupy na sebe navazují?",
            "3. Překryvy s jinými tématy (hesla, malware, cookies, digitální stopa, reklama, bezpečné chování, rizika AI) "
            "jsou zatím jen jako vazba „souvisí“. Má zůstat obojí, nebo se bubliny sloučí?",
            "4. Kapitoly cituje RVP 2021 (I-9-4-01…05). V RVP 2024 odpovídají INF-INF-004-ZV9-011 a 012; "
            "I-9-4-02 (správa dat) a I-9-4-04 (závady) samostatný výstup nemají. Jaké je aktuální znění?",
            "5. Všechny bubliny jsou zatím jádrové (core). Které jsou navazující?",
            "5b. Dřívější bubliny Data a informace, Reprezentace dat, API a Vrstvy počítače jsou smazané — nechybí něco z nich?",
            "6. Garant naznačil, že každý výstup půjde rozpracovat do mikrokonceptů — kdy a kdo?", ""]
    return "\n".join(out)


def main():
    data = yaml.safe_load(YAML_PATH.read_text(encoding="utf-8"))
    concepts = data["concepts"]
    by_id = {c["id"]: c for c in concepts}
    assert set(KONCEPTY) == set(VYSTUPY), set(KONCEPTY) ^ set(VYSTUPY)
    slugs = [PUVODNI_ID.get(k, Z + v[0]) for k, v in KONCEPTY.items()]
    assert len(set(slugs)) == len(slugs), "duplicitní id"

    # dřívější verze skriptu přidávala výstupy jako kritéria do jiných témat → uklidit
    for c in concepts:
        if c["tema"] != TEMA:
            c["kriteria"] = [k for k in c.get("kriteria", []) if "garant" not in k]
            c["zdroj"] = [z for z in c.get("zdroj", []) if "Digitální základy" not in z]

    nove = []
    for key in KONCEPTY:
        nove.append(koncept(key, by_id.get(PUVODNI_ID.get(key))))

    start = min(i for i, c in enumerate(concepts) if c["tema"] == TEMA)
    concepts[:] = ([c for c in concepts[:start] if c["tema"] != TEMA] + nove +
                   [c for c in concepts[start:] if c["tema"] != TEMA and c["id"] not in SMAZAT])
    by_id = {c["id"]: c for c in concepts}
    ids = set(by_id)
    # odkazy na smazané bubliny tématu (z dřívější verze) pryč; vazba uložená jen jednou
    for c in concepts:
        for k in ("prerekvizity", "souvisi"):
            c[k] = [x for x in c.get(k, []) if x in ids]
    for c in nove:
        for x in c["souvisi"]:
            by_id[x]["souvisi"] = [y for y in by_id[x].get("souvisi", []) if y != c["id"]]

    # Souvislosti (souvisi) jsou v mapě dočasně zrušené (2026-10-30, rozhodnutí redakce) —
    # doplní se společně s garanty. Definice vazeb výše zůstávají jako podklad.
    for c in concepts:
        c["souvisi"] = []
    for t in data["temata"]:
        if t["id"] == TEMA:
            t["podoblasti"] = PODOBLASTI
            t["popis"] = TEMA_POPIS

    YAML_PATH.write_text(yaml.dump(data, Dumper=Dumper, allow_unicode=True, sort_keys=False,
                                   width=1000, default_flow_style=False), encoding="utf-8")
    NAVRH_PATH.write_text(navrh_md(nove, by_id), encoding="utf-8")
    print(f"Hotovo: téma Digitální základy má {len(nove)} konceptů ({len(KONCEPTY)} výstupů garanta) "
          f"ve {len(PODOBLASTI)} podoblastech, celkem {len(concepts)}.")


if __name__ == "__main__":
    main()
