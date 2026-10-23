#!/usr/bin/env python3
"""Přestaví téma Informatické myšlení a algoritmizace podle garantova hnízda.

Zdroj: garanti/hnizdo-algoritmizace.md — doslovný přepis karet z dokumentu
garanta „Informatické myšlení a algoritmizace". Vazby jsou přepsané ze schématu
hnízda v dokumentu „Vazby mezi hnízdy Algoritmizace a Programování".

Co skript dělá:
  - 18 konceptů hnízda (název, učivo → popis, cíle, kritéria, důraz, RVP)
  - koncepty, které odpovídají dřívějším, si nechávají původní id (Glitche ve
    feedu i Supabase na ně odkazují): algoritmus, abstrakce, dekompozice,
    efektivita, hledání a oprava chyb
  - jednosměrné šipky ve schématu = prerekvizity, obousměrné = `souvisi`
  - vazby do Programování (fialové šipky + uzly s podobným názvem) = `souvisi`
  - všechny bubliny hnízda jsou jádrové (core)
  - dřívější koncepty tématu mimo hnízdo se mažou; odkazy na ně z jiných témat
    se přesměrují (PRESMEROVANI) nebo zruší

Spuštění (idempotentní, pořadí skriptů nehraje roli):
    python3 knowledge-map/garanti/apply_hnizdo_algoritmizace.py
    python3 knowledge-map/garanti/apply_hnizdo_programovani.py
    python3 knowledge-map/build-concepts.py
    python3 knowledge-map/build-map-index.py
"""
import re
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
YAML_PATH = HERE.parent / "app" / "data" / "Informatika" / "knowledge-map.yaml"
CARDS = HERE / "hnizdo-algoritmizace.md"

TEMA = "informaticke-mysleni"
ZDROJ = "Garant: Hnízdo Informatické myšlení a algoritmizace (2026-10)"

# Doslovné znění výstupů RVP tak, jak je garant uvádí v kartách (novější verze
# RVP než RVP_revidované_2024-03-28.pdf v repu — ZV5-005 a ZV9-008 se liší).
RVP_ZNENI = {
    "INF-INF-002-ZV5-004": "Navrhne posloupnost kroků řešení jednoduchého problému.",
    "INF-INF-002-ZV5-005": "Sestaví v blokově orientovaném jazyce program, ve kterém používá opakování a podprogramy, opraví případné chyby.",
    "INF-INF-002-ZV9-005": "Po přečtení jednotlivých kroků algoritmu vysvětlí celý postup a určí problém, který je daným algoritmem řešen.",
    "INF-INF-002-ZV9-006": "Rozdělí problém na jednotlivě řešitelné části a navrhne postupy a algoritmy pro jeho řešení.",
    "INF-INF-002-ZV9-008": "Průběžně ověřuje správnost vytvářeného postupu, zkouší program, opravuje chyby, posoudí efektivitu postupu, programu.",
}

UROVNE = {"POROZUMĚT": "porozumeni", "APLIKOVAT": "aplikace", "ANALYZOVAT": "analyza",
          "HODNOTIT": "hodnoceni", "TVOŘIT": "tvorba"}

# titul karty → (id, název); garant: všechny bubliny hnízda jsou jádrové
I = TEMA + "-"
KONCEPTY = {
    "PROBLÉMOVÁ SITUACE":    (I + "problemova-situace", "Problémová situace"),
    "ANALÝZA PROBLÉMU":      (I + "analyza-problemu", "Analýza problému"),
    "ABSTRAKCE":             (I + "abstrakce", "Abstrakce"),
    "DEKOMPOZICE PROBLÉMU":  (I + "dekompozice", "Dekompozice problému"),
    "NÁVRH ŘEŠENÍ":          (I + "navrh-reseni", "Návrh řešení"),
    "EFEKTIVITA":            (I + "efektivita-reseni", "Efektivita"),
    "ALGORITMUS":            (I + "algoritmus", "Algoritmus"),
    "POSLOUPNOST KROKŮ":     (I + "posloupnost-kroku", "Posloupnost kroků"),
    "ROZHODOVÁNÍ":           (I + "rozhodovani", "Rozhodování"),
    "OPAKOVÁNÍ":             (I + "opakovani", "Opakování"),
    "ELEMENTÁRNOST KROKU":   (I + "elementarnost-kroku", "Elementárnost kroku"),
    "VLASTNOSTI ALGORITMU":  (I + "vlastnosti-algoritmu", "Vlastnosti algoritmu"),
    "JEDNOZNAČNOST":         (I + "jednoznacnost", "Jednoznačnost"),
    "KONEČNOST":             (I + "konecnost", "Konečnost"),
    "OBECNOST":              (I + "obecnost", "Obecnost"),
    "SPRÁVNOST":             (I + "spravnost", "Správnost"),
    "OVĚŘOVÁNÍ ŘEŠENÍ":      (I + "overovani-reseni", "Ověřování řešení"),
    "HLEDÁNÍ A OPRAVA CHYB": (I + "hodnoceni-a-analyza-chyb", "Hledání a oprava chyb"),
}
ID = {t: v[0] for t, v in KONCEPTY.items()}

# Jednosměrné šipky ve schématu hnízda (A → B): A předchází B.
SIPKY = [
    ("PROBLÉMOVÁ SITUACE", "ANALÝZA PROBLÉMU"),
    ("ANALÝZA PROBLÉMU", "ABSTRAKCE"), ("ANALÝZA PROBLÉMU", "DEKOMPOZICE PROBLÉMU"),
    ("ABSTRAKCE", "NÁVRH ŘEŠENÍ"), ("DEKOMPOZICE PROBLÉMU", "NÁVRH ŘEŠENÍ"),
    ("NÁVRH ŘEŠENÍ", "EFEKTIVITA"), ("NÁVRH ŘEŠENÍ", "ALGORITMUS"),
    ("ALGORITMUS", "EFEKTIVITA"), ("ALGORITMUS", "OVĚŘOVÁNÍ ŘEŠENÍ"),
    ("ALGORITMUS", "POSLOUPNOST KROKŮ"), ("ALGORITMUS", "VLASTNOSTI ALGORITMU"),
    ("POSLOUPNOST KROKŮ", "ROZHODOVÁNÍ"), ("POSLOUPNOST KROKŮ", "OPAKOVÁNÍ"),
    ("POSLOUPNOST KROKŮ", "ELEMENTÁRNOST KROKU"),
    ("VLASTNOSTI ALGORITMU", "JEDNOZNAČNOST"), ("VLASTNOSTI ALGORITMU", "KONEČNOST"),
    ("VLASTNOSTI ALGORITMU", "OBECNOST"), ("VLASTNOSTI ALGORITMU", "SPRÁVNOST"),
]
# Obousměrné šipky ve schématu → souvisi.
OBOUSMERNE = [
    ("OVĚŘOVÁNÍ ŘEŠENÍ", "HLEDÁNÍ A OPRAVA CHYB"), ("OVĚŘOVÁNÍ ŘEŠENÍ", "SPRÁVNOST"),
    ("ELEMENTÁRNOST KROKU", "JEDNOZNAČNOST"), ("OPAKOVÁNÍ", "KONEČNOST"),
]
# Vazby do Programování (garant: vazby mezi hnízdy jsou symetrické → souvisi).
# Fialové šipky + uzly s podobným názvem („vazba je zřejmá"). Uzel „Vstup a výstup"
# ve schématu Algoritmizace nemá vlastní kartu → vede na Vstup a výstup v Programování.
P = "programovani-"
DO_PROGRAMOVANI = {
    "ALGORITMUS": [P + "program", P + "vstup-a-vystup"],        # fialová; Algoritmus → Vstup a výstup
    "POSLOUPNOST KROKŮ": [P + "sekvence-prikazu"],              # fialová
    "ROZHODOVÁNÍ": [P + "podminky-v-kodu"],                     # fialová (Podmíněný příkaz)
    "OPAKOVÁNÍ": [P + "cykly-v-kodu"],                          # podobný název (Opakování s pevným počtem)
    "EFEKTIVITA": [P + "efektivita"],                           # stejný název
    "OVĚŘOVÁNÍ ŘEŠENÍ": [P + "overovani", P + "vstup-a-vystup"],  # podobný název; ↔ Vstup a výstup
    "OBECNOST": [P + "vstup-a-vystup"],                         # ↔ Vstup a výstup
}

# Dřívější koncepty tématu, které v garantově hnízdě nejsou → smazat.
# Odkazy z jiných témat míří na nejbližší koncept hnízda; None = vazba zaniká.
PRESMEROVANI = {
    I + "rizeni-toku": I + "opakovani",          # herní smyčka = opakování
    I + "rozpoznavani-vzoru": None,
    I + "pseudokod-a-vyvojove-diagramy": None,
    I + "logika-a-booleovske-vyrazy": None,
    I + "modelovani-a-simulace": None,
    I + "zakladni-algoritmy": None,
}

TEMA_POPIS = (
    "Informatické myšlení a algoritmizace učí, jak z problémové situace udělat řešitelnou úlohu "
    "a popsat její řešení jako algoritmus. Žák problém analyzuje, odlišuje podstatné od "
    "nepodstatného (abstrakce), rozkládá ho na dílčí úlohy (dekompozice), navrhuje řešení "
    "a porovnává jeho efektivitu. Poznává, z čeho se algoritmus skládá — posloupnost "
    "elementárních kroků, rozhodování a opakování — a jaké vlastnosti musí mít: "
    "jednoznačnost, konečnost, obecnost a správnost. Učí se řešení ověřovat a hledat a opravovat "
    "v něm chyby. Tyhle dovednosti nezávisí na programovacím jazyce; Programování na ně přímo "
    "navazuje."
)


def parse_cards(text):
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    cards = {}
    for blk in re.split(r"^# ", text, flags=re.M)[1:]:
        title, body = blk.split("\n", 1)
        c = {"ucivo": [], "cile": [], "kriteria": [], "duraz": [], "rvp": [], "kompetence": []}
        sec = lvl = None
        for line in body.split("\n"):
            line = line.strip()
            if not line:
                continue
            if line.startswith("### "):
                lvl = UROVNE[line[4:]]
                continue
            if line.startswith("## "):
                sec = line[3:]
                continue
            if sec == "UČIVO":
                c["ucivo"].append(line)
            elif sec == "VZDĚLÁVACÍ CÍLE":
                c["cile"].append({"uroven": lvl, "text": line})
            elif sec == "KRITÉRIA ZVLÁDNUTÍ":
                c["kriteria"].append(line[2:])
            elif sec == "DŮRAZ":
                c["duraz"].append(line)
            elif sec == "RVP":
                c["rvp"].append(rvp_item(line))
            elif sec == "DIGITÁLNÍ KOMPETENCE":
                c["kompetence"].append(line)
            else:
                raise ValueError(f"{title}: neznámá sekce {sec!r}")
        cards[title.strip()] = c
    return cards


def rvp_item(line):
    m = re.match(r"^(INF-[A-Z0-9-]+) :: (.+)$", line)
    if m:                                   # kód a pod ním znění výstupu
        return {"kod": m.group(1), "vystup": m.group(2), "poznamka": ""}
    m = re.match(r"^(INF-[A-Z0-9-]+) – (.+)$", line)
    if m:                                   # kód – znění, nebo kód – poznámka garanta
        kod, text = m.groups()
        if text.rstrip(".") == RVP_ZNENI.get(kod, "").rstrip("."):
            return {"kod": kod, "vystup": text, "poznamka": ""}
        return {"kod": kod, "vystup": RVP_ZNENI.get(kod, ""), "poznamka": text}
    return {"kod": None, "vystup": "", "poznamka": line}


class Dumper(yaml.SafeDumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)


Dumper.add_representer(str, lambda d, s: d.represent_scalar(
    "tag:yaml.org,2002:str", s, style="|" if "\n" in s else None))


def main():
    data = yaml.safe_load(YAML_PATH.read_text(encoding="utf-8"))
    cards = parse_cards(CARDS.read_text(encoding="utf-8"))
    assert set(cards) == set(KONCEPTY), set(cards) ^ set(KONCEPTY)
    concepts = data["concepts"]
    hnizdo_ids = set(ID.values())

    # staré koncepty mimo hnízdo pryč, odkazy na ně přesměrovat / zrušit
    concepts[:] = [c for c in concepts if c["id"] not in PRESMEROVANI]
    for c in concepts:
        for k in ("prerekvizity", "souvisi"):
            nove = []
            for x in c.get(k) or []:
                x = PRESMEROVANI.get(x, x)
                if x and x != c["id"] and x not in nove:
                    nove.append(x)
            c[k] = nove
    for t in data["temata"]:
        if t["id"] == TEMA:
            t["popis"] = TEMA_POPIS
    by_id = {c["id"]: c for c in concepts}

    prereq = {t: [] for t in KONCEPTY}
    for a, b in SIPKY:
        prereq[b].append(ID[a])
    souvisi_hn = {t: [] for t in KONCEPTY}
    for a, b in OBOUSMERNE:
        souvisi_hn[a].append(ID[b])          # uložené jen jednou, na straně a

    novy = []
    for title, (cid, nazev) in KONCEPTY.items():
        card, old = cards[title], by_id.get(cid) or {}
        # mimo-hnízdové vazby původního konceptu (jiná témata kromě Programování) zůstávají;
        # vazby do Programování určuje výhradně DO_PROGRAMOVANI
        keep = [x for x in old.get("souvisi", []) + old.get("prerekvizity", [])
                if x not in hnizdo_ids and not x.startswith(TEMA) and not x.startswith(P)]
        souvisi = []
        for x in souvisi_hn[title] + DO_PROGRAMOVANI.get(title, []) + keep:
            if (x in by_id or x in hnizdo_ids) and x not in souvisi and x != cid:
                souvisi.append(x)
        komp = old.get("kompetence")
        if any("bez přímé vazby" in k for k in card["kompetence"]):
            komp = None
        zdroj = [z for z in old.get("zdroj", []) if z != ZDROJ] + [ZDROJ]
        concept = {
            "id": cid,
            "nazev": nazev,
            "tema": TEMA,
            "oblast": "algoritmizace",
            "kompetence": komp,
            "vrstva": "core",
            "popis": "\n\n".join(card["ucivo"]),
            "rvp": card["rvp"],
            "cile": card["cile"],
            "kriteria": [{"text": t} for t in card["kriteria"]],
            "duraz": "\n\n".join(card["duraz"]),
            "prerekvizity": prereq[title],
            "souvisi": souvisi,
            "tagy": old.get("tagy", []),
            "zdroj": zdroj,
            "pokryti_glitchem": old.get("pokryti_glitchem", []),
            "stav": "hotovo",
        }
        if not concept["duraz"]:
            del concept["duraz"]
        novy.append(concept)

    # hnízdo vložit (v pořadí dokumentu) na místo dosavadních konceptů tématu
    start = min(i for i, c in enumerate(concepts) if c["tema"] == TEMA)
    concepts[:] = ([c for c in concepts[:start] if c["tema"] != TEMA] + novy +
                   [c for c in concepts[start:] if c["tema"] != TEMA])
    by_id = {c["id"]: c for c in concepts}
    # z ostatních témat zmizí odkazy na id, která v hnízdě nejsou
    ids = set(by_id)
    for c in concepts:
        for k in ("prerekvizity", "souvisi"):
            c[k] = [x for x in c.get(k, []) if x in ids]

    # vazba je v datech uložená jen jednou: pokud ji nese hnízdo, smaž ji na druhé straně
    for cid in hnizdo_ids:
        for x in by_id[cid]["souvisi"]:
            by_id[x]["souvisi"] = [y for y in by_id[x]["souvisi"] if y != cid]

    bad = [(c["id"], x) for c in concepts for k in ("prerekvizity", "souvisi") for x in c.get(k, []) if x not in ids]
    assert not bad, bad

    YAML_PATH.write_text(yaml.dump(data, Dumper=Dumper, allow_unicode=True, sort_keys=False,
                                   width=1000, default_flow_style=False), encoding="utf-8")
    tema = [c for c in concepts if c["tema"] == TEMA]
    print(f"Hotovo: {len(KONCEPTY)} konceptů hnízda, téma má {len(tema)} konceptů, celkem {len(concepts)}.")


if __name__ == "__main__":
    main()
