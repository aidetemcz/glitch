#!/usr/bin/env python3
"""Přestaví téma Programování v mapě podle garantova „Hnízda Programování".

Zdroj: garanti/hnizdo-programovani.json — karty rozparsované z PDF exportu
dokumentu garanta (parse_hnizdo_pdf.py). Vazby jsou přepsané ze schémat
v dokumentech „Hnízdo Programování" a „Vazby mezi hnízdy Algoritmizace
a Programování".

Co skript dělá:
  - 15 konceptů hnízda (název, učivo → popis, cíle, kritéria, důraz, RVP)
  - koncepty, které odpovídají dřívějším, si nechávají původní id (Glitche ve
    feedu i Supabase na ně odkazují): proměnné, podmínky, cykly, funkce, ladění
  - vazby uvnitř hnízda = prerekvizity podle šipek ve schématu
  - vazby do Algoritmizace jsou podle garanta symetrické → `souvisi`
  - koncepty mimo garantovo hnízdo (události, OOP, …) zůstávají beze změny

Spuštění (idempotentní):
    python3 knowledge-map/garanti/apply_hnizdo_programovani.py
    python3 knowledge-map/build-concepts.py
"""
import json
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
YAML_PATH = HERE.parent / "app" / "data" / "Informatika" / "knowledge-map.yaml"
CARDS = HERE / "hnizdo-programovani.json"

ZDROJ = "Garant: Hnízdo Programování (2026-10)"
# Doslovné znění výstupů RVP (RVP_revidované_2024-03-28.pdf). ZV9-008 v této
# verzi RVP není — garant vychází z novější verze; znění doplnit.
RVP_ZNENI = {
    "INF-INF-002-ZV9-007": "v blokově orientovaném programovacím jazyce vytvoří přehledný program, používá opakování, větvení programu, proměnné",
}

# titul karty → (id, název, vrstva, tagy)
P = "programovani-"
KONCEPTY = {
    "PROGRAM":                             (P + "program", "Program", "core", ["teoretický základ"]),
    "ZÁPIS PROGRAMU":                      (P + "zapis-programu", "Zápis programu", "core", ["teoretický základ"]),
    "SEKVENCE PŘÍKAZŮ":                    (P + "sekvence-prikazu", "Sekvence příkazů", "core", ["teoretický základ"]),
    "PODPROGRAM (BEZ PARAMETRŮ)":          (P + "funkce-a-procedury", "Podprogram (bez parametrů)", "core", None),
    "OPAKOVÁNÍ S PEVNÝM POČTEM OPAKOVÁNÍ": (P + "cykly-v-kodu", "Opakování s pevným počtem opakování", "core", None),
    "PODMÍNĚNÝ PŘÍKAZ":                    (P + "podminky-v-kodu", "Podmíněný příkaz", "core", None),
    "CYKLUS S PODMÍNKOU":                  (P + "cyklus-s-podminkou", "Cyklus s podmínkou", "core", ["teoretický základ"]),
    "PROMĚNNÁ":                            (P + "promenne-a-datove-typy", "Proměnná", "core", None),
    "VSTUP A VÝSTUP":                      (P + "vstup-a-vystup", "Vstup a výstup", "navazujici", ["praktická dovednost"]),
    "UŽIVATELSKÉ ROZHRANÍ":                (P + "uzivatelske-rozhrani", "Uživatelské rozhraní", "navazujici", ["praktická dovednost"]),
    "OVĚŘOVÁNÍ":                           (P + "overovani", "Ověřování", "core", ["praktická dovednost"]),
    "TESTOVÁNÍ":                           (P + "testovani", "Testování", "core", ["praktická dovednost"]),
    "LADĚNÍ":                              (P + "ladeni-a-testovani", "Ladění", "core", None),
    "KOMENTÁŘE":                           (P + "komentare", "Komentáře", "navazujici", ["praktická dovednost"]),
    "EFEKTIVITA":                          (P + "efektivita", "Efektivita", "navazujici", ["praktická dovednost"]),
}
ID = {t: v[0] for t, v in KONCEPTY.items()}

# Šipky ve schématu hnízda (A → B): A předchází B.
SIPKY = [
    ("PROGRAM", "ZÁPIS PROGRAMU"), ("PROGRAM", "VSTUP A VÝSTUP"), ("PROGRAM", "OVĚŘOVÁNÍ"),
    ("ZÁPIS PROGRAMU", "SEKVENCE PŘÍKAZŮ"),
    ("SEKVENCE PŘÍKAZŮ", "PODPROGRAM (BEZ PARAMETRŮ)"),
    ("PODPROGRAM (BEZ PARAMETRŮ)", "OPAKOVÁNÍ S PEVNÝM POČTEM OPAKOVÁNÍ"),
    ("OPAKOVÁNÍ S PEVNÝM POČTEM OPAKOVÁNÍ", "PODMÍNĚNÝ PŘÍKAZ"),
    ("PODMÍNĚNÝ PŘÍKAZ", "CYKLUS S PODMÍNKOU"),
    ("CYKLUS S PODMÍNKOU", "PROMĚNNÁ"),
    ("VSTUP A VÝSTUP", "UŽIVATELSKÉ ROZHRANÍ"),
    ("UŽIVATELSKÉ ROZHRANÍ", "TESTOVÁNÍ"),
    ("OVĚŘOVÁNÍ", "TESTOVÁNÍ"), ("TESTOVÁNÍ", "LADĚNÍ"),
    ("OVĚŘOVÁNÍ", "EFEKTIVITA"), ("OVĚŘOVÁNÍ", "KOMENTÁŘE"),
]

# Vazby do jiných hnízd (symetrické → souvisi). Garantovo hnízdo Algoritmizace
# zatím v mapě není (chybí karty), proto míří na nejbližší stávající koncept;
# v komentáři je uzel z garantova schématu.
IM = "informaticke-mysleni-"
SOUVISI = {
    "PROGRAM": [IM + "algoritmus"],                                  # ↔ Algoritmus (fialová)
    "SEKVENCE PŘÍKAZŮ": [IM + "rizeni-toku"],                        # ↔ Posloupnost kroků (fialová)
    "PODMÍNĚNÝ PŘÍKAZ": [IM + "rizeni-toku", IM + "logika-a-booleovske-vyrazy"],  # ↔ Rozhodování (fialová)
    "OPAKOVÁNÍ S PEVNÝM POČTEM OPAKOVÁNÍ": [IM + "rizeni-toku"],     # ↔ Opakování (podobný název)
    "CYKLUS S PODMÍNKOU": [IM + "rizeni-toku"],                      # ↔ Opakování (podobný název)
    "PODPROGRAM (BEZ PARAMETRŮ)": [IM + "dekompozice"],              # ↔ Dekompozice problému
    "VSTUP A VÝSTUP": [IM + "algoritmus"],                           # ↔ Vstup a výstup (Alg.)
    "UŽIVATELSKÉ ROZHRANÍ": ["data-databaze-ucel-informacnich-systemu"],  # ↔ Informační systémy (fialová)
    "OVĚŘOVÁNÍ": [IM + "hodnoceni-a-analyza-chyb"],                  # ↔ Ověřování řešení
    "LADĚNÍ": [IM + "hodnoceni-a-analyza-chyb"],                     # ↔ Hledání a oprava chyb
    "EFEKTIVITA": [IM + "efektivita-reseni"],                        # ↔ Efektivita (Alg.)
}


class Dumper(yaml.SafeDumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, False)


Dumper.add_representer(str, lambda d, s: d.represent_scalar(
    "tag:yaml.org,2002:str", s, style="|" if "\n" in s else None))


def main():
    data = yaml.safe_load(YAML_PATH.read_text(encoding="utf-8"))
    cards = {c["title"]: c for c in json.loads(CARDS.read_text(encoding="utf-8"))}
    assert set(cards) == set(KONCEPTY), set(cards) ^ set(KONCEPTY)
    concepts = data["concepts"]
    by_id = {c["id"]: c for c in concepts}

    prereq = {t: [] for t in KONCEPTY}
    for a, b in SIPKY:
        prereq[b].append(ID[a])

    hnizdo_ids = set(ID.values())
    for title, (cid, nazev, vrstva, tagy) in KONCEPTY.items():
        card = cards[title]
        old = by_id.get(cid)
        # mimo-hnízdové vazby původního konceptu (jiná témata) zůstávají
        keep_souvisi = [x for x in (old or {}).get("souvisi", []) if x not in hnizdo_ids]
        old_prereq_ext = [x for x in (old or {}).get("prerekvizity", [])
                          if not x.startswith("programovani-")]
        souvisi = []
        for x in keep_souvisi + old_prereq_ext + SOUVISI.get(title, []):
            if x in by_id and x not in souvisi and x != cid:
                souvisi.append(x)
        rvp = [{"kod": r["kod"], "vystup": RVP_ZNENI.get(r["kod"], ""), "poznamka": r["poznamka"]}
               for r in card["rvp"]]
        zdroj = [z for z in (old or {}).get("zdroj", []) if z != ZDROJ] + [ZDROJ]
        concept = {
            "id": cid,
            "nazev": nazev,
            "tema": "programovani",
            "oblast": "algoritmizace",
            "kompetence": (old or {}).get("kompetence"),
            "vrstva": vrstva,
            "popis": "\n\n".join(card["ucivo"]),
            "rvp": rvp,
            "cile": card["cile"],
            "kriteria": [{"text": t} for t in card["kriteria"]],
            "duraz": "\n\n".join(card["duraz"]),
            "prerekvizity": prereq[title],
            "souvisi": souvisi,
            "tagy": tagy if tagy is not None else (old or {}).get("tagy", []),
            "zdroj": zdroj,
            "pokryti_glitchem": (old or {}).get("pokryti_glitchem", []),
            "stav": "hotovo",
        }
        if not concept["duraz"]:
            del concept["duraz"]
        if old:
            concepts[concepts.index(old)] = concept
        else:
            # nové koncepty hnízda za poslední koncept tématu Programování
            last = max(i for i, c in enumerate(concepts) if c["tema"] == "programovani")
            concepts.insert(last + 1, concept)
        by_id[cid] = concept

    # vazba je v datech uložená jen jednou: pokud ji už nese druhá strana, smaž duplicitu
    for cid in hnizdo_ids:
        c = by_id[cid]
        c["souvisi"] = [x for x in c["souvisi"] if cid not in by_id[x].get("souvisi", [])]

    # kontrola: žádné visící odkazy
    ids = {c["id"] for c in concepts}
    bad = [(c["id"], x) for c in concepts for k in ("prerekvizity", "souvisi") for x in c.get(k, []) if x not in ids]
    assert not bad, bad

    YAML_PATH.write_text(yaml.dump(data, Dumper=Dumper, allow_unicode=True, sort_keys=False,
                                   width=1000, default_flow_style=False), encoding="utf-8")
    prog = [c for c in concepts if c["tema"] == "programovani"]
    print(f"Hotovo: {len(KONCEPTY)} konceptů hnízda, téma Programování má {len(prog)} konceptů, celkem {len(concepts)}.")


if __name__ == "__main__":
    main()
