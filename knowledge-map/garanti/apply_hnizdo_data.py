#!/usr/bin/env python3
"""Zapracuje připomínky garantky k tématu Data, databáze a datová gramotnost.

Zdroj: „Hnízdo Data – final.pdf" (Lenka Blehová, 2026-10). Garantka na rozdíl
od ostatních hnízd neposlala nové karty, ale upravila stávající obsah mapy:
šedý text nahradit žlutým, oranžový přidat, plus nové bubliny.

Každá náhrada nese i původní (šedý) text a skript ověří, že v mapě opravdu je
(nebo už je nahrazen) — kdyby se mezitím obsah změnil, skript spadne místo
tichého přepsání. Idempotentní.

Mikrokoncepty, které garantka u nových bublin vyjmenovala, žijí jen v Supabase
→ migrations/2026-10-23-data-mikrokoncepty.sql.

Spuštění:
    python3 knowledge-map/garanti/apply_hnizdo_data.py
    python3 knowledge-map/build-concepts.py
    python3 knowledge-map/build-map-index.py
"""
from difflib import SequenceMatcher
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
YAML_PATH = HERE.parent / "app" / "data" / "Informatika" / "knowledge-map.yaml"

TEMA = "data-databaze"
D = TEMA + "-"
ZDROJ = "Garant: Hnízdo Data, Lenka Blehová (2026-10)"

RVP = {  # doslovné znění (RVP_revidované_2024-03-28.pdf, resp. jak ho uvádí garantka)
    "INF-INF-001-ZV9-001": "získá z dat informace, interpretuje data získaná pro řešení konkrétního problému",
    "INF-INF-001-ZV9-002": "navrhuje a porovnává různé způsoby kódování dat s cílem jejich uložení a přenosu",
    "INF-INF-001-ZV9-003": "modeluje situace různými způsoby, včetně grafů nebo obdobných schémat",
    "INF-INF-001-ZV9-004": "natrénuje model strojového učení",
    "INF-INF-003-ZV9-008": "Posoudí účel a užitečnost informačních systémů, které používá.",
    "INF-INF-003-ZV9-009": "Pro řešení problému vytvoří tabulku evidence dat a stanoví pravidla pro práci se záznamy.",
    "INF-INF-004-ZV9-013": "navrhne základní způsoby zabezpečení zařízení a systémů, se kterými pracuje, na základě posouzení rizik ztráty, poškození či zneužití dat",
}


def rvp(kod, poznamka=""):
    r = {"kod": kod, "vystup": RVP[kod]}
    if poznamka:
        r["poznamka"] = poznamka
    return r


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio() > 0.85


def nahrad_text(c, pole, stary, novy):
    """Nahradí celý text pole (popis, nazev)."""
    if c[pole] == novy:
        return
    assert similar(c[pole], stary), (c["id"], pole, c[pole])
    c[pole] = novy


def nahrad_cast(c, pole, stary, novy):
    """Nahradí část textu pole."""
    if novy in c[pole] and stary not in c[pole]:
        return
    assert c[pole].count(stary) == 1, (c["id"], pole, stary)
    c[pole] = c[pole].replace(stary, novy)


def nahrad_polozku(c, pole, uroven, stary, novy):
    """Nahradí text cíle / kritéria dané úrovně (šedý → žlutý)."""
    for x in c[pole]:
        if x.get("uroven") == uroven and (x["text"] == novy or similar(x["text"], stary)):
            x["text"] = novy
            return
    raise AssertionError((c["id"], pole, uroven, stary))


def pridej_polozku(c, pole, polozka, na_zacatek=False):
    if any(x["text"] == polozka["text"] for x in c[pole]):
        return
    if na_zacatek:
        c[pole].insert(0, polozka)
    else:
        c[pole].append(polozka)


def novy_koncept(cid, **kw):
    c = {"id": cid, "tema": TEMA, "kompetence": None, "rvp": [], "cile": [], "kriteria": [],
         "prerekvizity": [], "souvisi": [], "tagy": [], "zdroj": [ZDROJ], "pokryti_glitchem": [],
         "stav": "hotovo"}
    c.update(kw)
    poradi = ["id", "nazev", "tema", "oblast", "kompetence", "vrstva", "popis", "rvp", "cile",
              "kriteria", "prerekvizity", "souvisi", "tagy", "zdroj", "pokryti_glitchem", "stav"]
    return {k: c[k] for k in poradi}


TEMA_POPIS = (
    "Data jsou surovinou informací i palivem umělé inteligence, a tohle téma učí s nimi zacházet — "
    "od kritického čtení až po technické uložení. Žák pochopí datový cyklus od formulace "
    "výzkumného úkolu přes sběr, čištění a analýzu až po vizualizaci a interpretaci, naučí se "
    "vytvořit vhodný graf, evidovat data v tabulkách, propojovat tabulky v relačním modelu a klást "
    "datům otázky (SQL). Poznává, jak se data kódují pro uložení a přenos a jak je chrání "
    "šifrování, k čemu slouží informační systémy a jak se v nich liší role a přístupová práva "
    "uživatelů. Velký důraz je na datové gramotnosti: poznat zavádějící graf, rozdíl mezi "
    "korelací a kauzalitou i to, odkud data pocházejí a co v nich chybí. Právě datová gramotnost "
    "je předstupněm gramotnosti v AI, takže tohle téma tvoří s Umělou inteligencí provázané jádro "
    "celé mapy."
)


def uprav(by):
    # --- Datová gramotnost ---
    c = by[D + "datova-gramotnost"]
    nahrad_cast(c, "popis", "plyne z čísel", "plyne ze sebraných dat")
    nahrad_polozku(c, "cile", "hodnoceni",
        "Žák posoudí u předloženého závěru opřeného o data, zda z čísel opravdu plyne, a přitom zohlední zdroj dat a to, co v nich chybí.",
        "Žák posoudí u předloženého závěru opřeného o data, zda z údajů opravdu plyne, a přitom zohlední relevantnost, dostatečnost dat a jejich zdroj.")
    nahrad_polozku(c, "cile", "porozumeni",
        "Žák vysvětlí rozdíl mezi daty a informací a na konkrétním příkladu popíše, jakou informaci z daných dat získá.",
        "Žák vysvětlí vztah mezi daty a informacemi: data nesou informace, které z nich můžeme získat. K daným datům formuluje různé otázky a popíše, jaké informace lze jejich zodpovězením získat.")
    nahrad_polozku(c, "kriteria", "hodnoceni",
        "Žák u tvrzení opřeného o data uvede alespoň dvě otázky (odkud data jsou, co v nich chybí), podle nichž jeho spolehlivost posoudí.",
        "Žák u tvrzení opřeného o data uvede alespoň dvě otázky týkající se původu a kvality dat, podle nichž posoudí jeho důvěryhodnost.")

    # --- Datový cyklus ---
    c = by[D + "datovy-cyklus"]
    pridat = ("Před začátkem příběhu zformulujeme výzkumný úkol = ujasníme si, jaký příběh chceme "
              "vyprávět (provedeme přípravu: co chceme zjistit, jaká jsou pravidla a možnosti).")
    if pridat not in c["popis"]:
        prvni = "sběr → čištění → analýza → vizualizace → interpretace."
        nahrad_cast(c, "popis", prvni, prvni + " " + pridat)
    nahrad_polozku(c, "kriteria", "zapamatovani",
        "Žák vyjmenuje všech pět kroků datového cyklu ve správném pořadí.",
        "Žák vyjmenuje kroky datového cyklu ve správném pořadí.")

    # --- Vizualizace a tvorba grafu ---
    c = by[D + "vizualizace-a-volba-grafu"]
    nahrad_text(c, "nazev", "Vizualizace a volba grafu", "Vizualizace a tvorba grafu")
    nahrad_text(c, "popis",
        "Dobrý graf udělá z čísel srozumitelný příběh — ale jen když zvolíš správný typ (spojnicový na vývoj v čase, sloupcový na porovnání) a čteš osy a měřítka. Špatně zvolený nebo zmanipulovaný graf umí naopak klamat.",
        "Cílem vizualizace dat je čitelnější a srozumitelnější náhled na data – lepší porozumění, odhalení souvislostí a případných chyb. Důležitá je přehlednost a čitelnost grafu. Dobrý graf udělá z dat srozumitelný příběh – je-li přehledný a dobře čitelný. Je třeba zvolit správný typ grafu (procesní a strukturální na postupy a hierarchie, relační a síťový na vztahy, spojnicový na vývoj v čase, sloupcový na porovnání) a popisky, vazby, osy, měřítka. Špatně zvolený nebo zmanipulovaný graf umí naopak klamat.")
    nahrad_polozku(c, "cile", "aplikace",
        "Žák pro daná data vytvoří vhodný typ grafu (spojnicový pro vývoj v čase, sloupcový pro porovnání) s popsanými osami.",
        "Žák pro daná data vytvoří graf vhodného typu a vysvětlí důvody volby.")
    nahrad_polozku(c, "cile", "analyza",
        "Žák u předloženého grafu najde zavádějící prvek (useknutá osa, špatné měřítko) a předpoví, k jakému mylnému závěru čtenáře svede.",
        "Žák u předloženého grafu najde zavádějící prvek (například špatná vazba, nelogické uspořádání, useknutá osa, špatné měřítko, …) a předpoví, k jakému mylnému závěru čtenáře svede.")
    nahrad_polozku(c, "kriteria", "aplikace",
        "Žák zvolí typ grafu odpovídající povaze dat a správně popíše obě osy včetně měřítka.",
        "Žák zvolí typ grafu odpovídající povaze dat a správně popíše prvky grafu (vazby, osy, měřítka, …)")
    pridej_polozku(c, "kriteria", {"uroven": "tvorba", "text":
        "Žák pro daná data zformuluje výzkumnou otázku, zkontroluje, že data poskytují potřebné informace a ty pak vizualizuje pomocí grafu. Svoje volby grafického znázornění zdůvodní."})

    # --- Strukturovaná vs. nestrukturovaná data ---
    c = by[D + "strukturovana-vs-nestrukturovana-data"]
    nahrad_polozku(c, "cile", "porozumeni",
        "Žák porovná strukturovaná a nestrukturovaná data a ke každému typu uvede příklad a způsob uložení.",
        "Žák porovná strukturovaná a nestrukturovaná data a ke každému typu uvede příklad a způsob uložení (místo, formát nebo datovou strukturu, ve které jsou data fyzicky či logicky uspořádána a uložena, aby se s nimi dalo dále pracovat).")
    pridej_polozku(c, "cile", {"uroven": "tvorba", "text":
        "Žák navrhne vhodnou strukturu, která umožní z nestrukturovaných dat udělat strukturovaná (například na základě textu zapsaného ve větách navrhne tabulku a tu naplní daty získanými z textu)"})
    # ZV9-002 (kódování) se přesouvá do nové bubliny Kódování dat
    c["rvp"] = [rvp("INF-INF-001-ZV9-001"), rvp("INF-INF-001-ZV9-003"), rvp("INF-INF-001-ZV9-004")]

    # --- Tabulková evidence dat (dřív Tabulky a relační model) ---
    c = by[D + "tabulky-a-relacni-model"]
    nahrad_text(c, "nazev", "Tabulky a relační model", "Tabulková evidence dat")
    nahrad_text(c, "popis",
        "Nejběžnější způsob, jak evidovat data: tabulky s řádky (záznamy) a sloupci (vlastnosti), propojené přes klíče. Tak fungují školní systémy, e-shopy i většina aplikací „na pozadí\".",
        "Nejběžnější způsob, jak evidovat data: tabulky s řádky (záznamy) a sloupci. Každý sloupec představuje atribut (= vlastnost, kterou sledujeme – například jméno, věk nebo datum narození). Konkrétní buňka v tabulce pak ukazuje hodnotu atributu. Abys mohl s daty správně pracovat (a později je třeba efektivně čistit), je nutné rozlišovat typy dat (např. text, celé číslo, desetinné číslo, datum nebo pravdivostní hodnotu ano/ne). Tak fungují školní systémy, e-shopy i většina aplikací „na pozadí“.")
    nahrad_polozku(c, "kriteria", "porozumeni",
        "Žák u ukázkové tabulky správně označí, co je záznam, co vlastnost a co klíč.",
        "Žák u ukázkové tabulky správně označí, co je záznam, atribut, jeho hodnota a u vybraných sloupců správně určí a odůvodní jejich datový typ.")
    nahrad_cast(c["kriteria"][[x["uroven"] for x in c["kriteria"]].index("aplikace")], "text",
                "Žák vytvořená tabulka", "Žákem vytvořená tabulka")

    # --- Čištění reálných dat ---
    c = by[D + "cisteni-realnych-dat"]
    pridej_polozku(c, "cile", {"uroven": "porozumeni", "text":
        "Žák dokáže vyjmenovat, jaké typy nečistot se v datech mohou vyskytovat a co je tedy vhodné kontrolovat."},
        na_zacatek=True)

    # --- Automatizovaná analýza dat (dřív Programová analýza dat) ---
    c = by[D + "programova-analyza-dat"]
    nahrad_text(c, "nazev", "Programová analýza dat", "Automatizovaná analýza dat")
    nevyhody = ("Nevýhody: Náročnost přípravy: vytvoření a odladění programu může zabrat více času než "
                "jednorázové ruční zpracování. Riziko systematických chyb: chyba v programu může ovlivnit "
                "všechny zpracovávané záznamy. Zpracování malé sady dat, může být robustním automatickým "
                "systémem dokonce pomalejší.")
    if nevyhody not in c["popis"]:
        c["popis"] = c["popis"] + "\n\n" + nevyhody
    nahrad_polozku(c, "cile", "porozumeni",
        "Žák vysvětlí výhody zpracování dat kódem (rychlost, opakovatelnost, doložitelnost) oproti ručnímu klikání.",
        "Žák porovná automatické a ruční zpracování dat, vysvětlí jejich výhody a omezení a uvede příklady situací, kdy je vhodné použít jednotlivé přístupy.")

    # --- Informační systémy (celá bublina Účel informačních systémů nahrazena; id zůstává) ---
    c = by[D + "ucel-informacnich-systemu"]
    c.update({
        "nazev": "Informační systémy",
        "oblast": "informacni-systemy",
        "kompetence": "kdi-vin",
        "vrstva": "core",
        "popis": "Informační systém je software, který eviduje a zpracovává data pro určitou potřebu — například školní matrika, rezervační systém nebo e-shop. K datům přistupují různí uživatelé v různých rolích (např. žák, učitel, rodič, zákazník, administrátor), přičemž každá role má nastavená jiná přístupová práva (co může vidět, vkládat nebo upravovat). Umět posoudit, k čemu systém slouží, kdo a jak v něm s daty pracuje a zda je systém pro svůj účel opravdu užitečný, patří k základní digitální gramotnosti.",
        "rvp": [rvp("INF-INF-003-ZV9-008")],
        "cile": [
            {"uroven": "porozumeni", "text": "Žák na příkladu konkrétního informačního systému (např. Bakaláři/Edookit, e-shop) vysvětlí jeho účel, popíše, jaké druhy dat eviduje, a rozliší různé uživatelské role a jejich práva k datům (co která role vidí a může měnit).", "rocnik": 8},
            {"uroven": "hodnoceni", "text": "Žák posoudí účel a užitečnost vybraného informačního systému i z pohledu jeho různých uživatelů (zda systém usnadňuje práci/přístup k informacím všem cílovým rolím).", "rocnik": 9},
        ],
        "kriteria": [
            {"uroven": "porozumeni", "text": "Žák u konkrétního informačního systému uvede jeho hlavní účel, typy uchovávaných dat, způsob jejich použití a správně pojmenuje alespoň dvě uživatelské role včetně rozdílu v jejich oprávněních (např. žák známky pouze vidí, učitel je může i zapisovat)."},
            {"uroven": "hodnoceni", "text": "Žák zformuluje alespoň jeden argument pro a jeden proti užitečnosti daného systému s ohledem na jeho uživatele a jejich potřeby."},
        ],
    })


def nove_bubliny():
    return [
        # vkládá se za Strukturovaná vs. nestrukturovaná data
        (D + "strukturovana-vs-nestrukturovana-data", novy_koncept(
            D + "kodovani-dat",
            nazev="Kódování dat, jejich účel a přenos",
            oblast="data-modelovani",
            vrstva="core",
            popis="Kódování je způsob, jak podle daných pravidel reprezentovat data, aby je počítač mohl ukládat, přenášet a zpracovávat. Například určuje, jak jsou pomocí bitů reprezentovány znaky, barvy nebo zvuk. Různé typy kódování volíme podle toho, zda potřebujeme ušetřit místo, zachovat kvalitu, nebo data zabezpečit. Speciálním případem je komprese dat, která může být bezeztrátová, kdy lze původní data přesně obnovit, nebo ztrátová, kdy se část informace vypouští.",
            rvp=[rvp("INF-INF-001-ZV9-002")],
            cile=[
                {"uroven": "porozumeni", "text": "Žák vysvětlí účel a princip kódování dat (pro uložení a přenos) a uvede příklady různých způsobů kódování (např. text, obrázky, zvuk, binární kód).", "rocnik": "6–7"},
                {"uroven": "analyza", "text": "Žák u předložené sady dat zdůvodní výhody a nevýhody použitých způsobů kódování pro jejich přenos či uložení.", "rocnik": "8–9"},
                {"uroven": "tvorba", "text": "Žák navrhne vhodný způsob kódování dat pro konkrétní situaci (např. úspora místa, bezpečnost přenosu, reprezentace informací).", "rocnik": 9},
            ],
            kriteria=[
                {"uroven": "porozumeni", "text": "Žák objasní, proč se data kódují, a popíše alespoň dva různé způsoby kódování dat pro uložení nebo přenos."},
                {"uroven": "analyza", "text": "Žák porovná různé způsoby kódování (např. textové formáty vs. binární, komprimované vs. nekomprimované) z hlediska efektivity uložení a přenosu a zdůvodní výběr nejvhodnějšího řešení."},
            ],
            prerekvizity=[D + "strukturovana-vs-nestrukturovana-data"],     # šipka ze Strukturovaná vs. nestrukturovaná
        )),
        (D + "kodovani-dat", novy_koncept(
            D + "sifrovani-dat",
            nazev="Šifrování dat",
            oblast="data-modelovani",
            vrstva="navazujici",
            popis="Šifrování je proces převodu čitelné informace (tzv. otevřeného textu) do podoby, která je nesrozumitelná pro nepovolané osoby (tzv. šifrovaného textu). Převod se provádí pomocí šifrovacího algoritmu a/nebo klíče. Zpětný převod do čitelné podoby (dešifrování) je možný s použitím inverzní procedury. Účelem šifrování je chránit obsah dat před neoprávněným přístupem.",
            rvp=[rvp("INF-INF-001-ZV9-002", "rozšířeno o bezpečnostní aspekt a šifrování"),
                 rvp("INF-INF-004-ZV9-013")],
            cile=[
                {"uroven": "porozumeni", "text": "Žák vysvětlí účel šifrování dat a popíše základní princip šifrování a dešifrování pomocí algoritmu se zadaným klíčem (převod otevřeného textu na šifrovaný).", "rocnik": "7–8"},
                {"uroven": "analyza", "text": "Žák posoudí situace, ve kterých je nutné data šifrovat (např. komunikace na internetu, ukládání citlivých údajů), a zhodnotí význam tajnosti klíče.", "rocnik": "8–9"},
                {"uroven": "tvorba", "text": "Žák navrhne a vyzkouší jednoduchý princip utajení zprávy (např. vlastní transpoziční nebo substituční šifru) a vysvětlí jeho slabiny.", "rocnik": 9},
            ],
            kriteria=[
                {"uroven": "porozumeni", "text": "Žák definuje, co je šifrovaný a nešifrovaný text, a popíše roli klíče v procesu šifrování a dešifrování."},
                {"uroven": "analyza", "text": "Žák zdůvodní, proč běžné kódování dat (např. binární zápis) nestačí k ochraně soukromí a kdy je bezpodmínečně nutné použít šifrování."},
                {"uroven": "tvorba", "text": "Žák zašifruje data podle zadaného algoritmu s daným klíčem. Žák navrhne inverzní proceduru pro dešifrování."},
            ],
            prerekvizity=[D + "kodovani-dat"],                              # šipka od Kódování dat
            souvisi=["kyberbezpecnost-sifrovani-a-https"],                  # propojit s tématem Kyberbezpečnost
        )),
        (D + "tabulky-a-relacni-model", novy_koncept(
            D + "provazanost-tabulek",
            nazev="Provázanost tabulek a relační model",
            oblast="informacni-systemy",
            kompetence="kdi-vin",
            vrstva="navazujici",
            popis="Reálné informační systémy zřídka vystačí s jedinou tabulkou. Abychom nemuseli data opakovat (redundance) a předešli chybám, rozvolňujeme data do více specializovaných tabulek. Tyto tabulky mezi sebou propojujeme pomocí klíčů (jedinečných identifikátorů záznamu, např. ID žáka, Číslo objednávky). Vzniká tak relační model, který tvoří základ složitějších databází školních systémů či e-shopů.",
            rvp=[rvp("INF-INF-003-ZV9-009", "případně navazující výstupy pro databáze/informační systémy")],
            cile=[
                {"uroven": "porozumeni", "text": "Žák vysvětlí, proč je výhodnější rozdělit rozsáhlá data do více tabulek, a popíše princip klíče jako nástroje pro propojování záznamů mezi tabulkami.", "rocnik": 8},
                {"uroven": "aplikace", "text": "Žák na jednoduchém příkladu z praxe (např. Žák – Třída nebo Zákazník – Objednávka) navrhne propojení dvou tabulek pomocí společného klíče.", "rocnik": 8},
            ],
            kriteria=[
                {"uroven": "porozumeni", "text": "Žák v modelu dvou propojených tabulek správně ukáže klíčové sloupce a vysvětlí, který záznam z jedné tabulky odpovídá záznamu v druhé tabulce."},
                {"uroven": "aplikace", "text": "Žák doplní do tabulek vhodný identifikační klíč tak, aby bylo možné jednoznačně propojit související data bez nutnosti opakovat celé textové informace."},
            ],
            prerekvizity=[D + "tabulky-a-relacni-model"],   # klíče a propojení se sem přesunuly z Tabulkové evidence
        )),
    ]


class Dumper(yaml.SafeDumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)


Dumper.add_representer(str, lambda d, s: d.represent_scalar(
    "tag:yaml.org,2002:str", s, style="|" if "\n" in s else None))


UPRAVENE = ["datova-gramotnost", "datovy-cyklus", "vizualizace-a-volba-grafu",
            "strukturovana-vs-nestrukturovana-data", "tabulky-a-relacni-model",
            "cisteni-realnych-dat", "programova-analyza-dat", "ucel-informacnich-systemu",
            "statisticka-gramotnost"]   # Statistická gramotnost: „OK“ (prošla bez změn)


def main():
    data = yaml.safe_load(YAML_PATH.read_text(encoding="utf-8"))
    concepts = data["concepts"]
    by = {c["id"]: c for c in concepts}

    uprav(by)
    for za, c in nove_bubliny():
        if c["id"] in by:
            concepts[concepts.index(by[c["id"]])] = c
        else:
            concepts.insert(concepts.index(by[za]) + 1, c)
        by[c["id"]] = c
    for slug in UPRAVENE + ["kodovani-dat", "sifrovani-dat", "provazanost-tabulek"]:
        z = by[D + slug].setdefault("zdroj", [])
        if ZDROJ not in z:
            z.append(ZDROJ)
    for t in data["temata"]:
        if t["id"] == TEMA:
            t["popis"] = TEMA_POPIS

    ids = set(by)
    bad = [(c["id"], x) for c in concepts for k in ("prerekvizity", "souvisi") for x in c.get(k, []) if x not in ids]
    assert not bad, bad
    YAML_PATH.write_text(yaml.dump(data, Dumper=Dumper, allow_unicode=True, sort_keys=False,
                                   width=1000, default_flow_style=False), encoding="utf-8")
    tema = [c for c in concepts if c["tema"] == TEMA]
    print(f"Hotovo: téma Data má {len(tema)} konceptů, celkem {len(concepts)}.")


if __name__ == "__main__":
    main()
