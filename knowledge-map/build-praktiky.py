# -*- coding: utf-8 -*-
"""Praktiky (nejčastější aktivní slovesa RVP Informatika) pro mapu.

Vstup:  documents/Praktiky_slovesa_RVP_Informatika.md
Výstup: app/data/Informatika/praktiky.json

Z tabulky „Seznam praktik“ bere sloveso, jeho tvary, výskyt, počet výstupů
a okruhů, popis, příklad z RVP a orientační zařazení v Nové taxonomii;
z tabulky „Příbuzná slovesa“ skupinu. Krátký popis = první věta popisu (bez výčtu za dvojtečkou).

Spuštění (z adresáře knowledge-map/):  python3 build-praktiky.py
"""
import json
import re
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "documents" / "Praktiky_slovesa_RVP_Informatika.md"
OUT = HERE / "app" / "data" / "Informatika" / "praktiky.json"
OKRUHY = {"001": "Data, informace a modelování", "002": "Algoritmizace a programování",
          "003": "Informační systémy", "004": "Digitální technologie"}


def slug(s):
    s = unicodedata.normalize("NFKD", s.lower())
    return re.sub(r"[^a-z0-9]+", "-", "".join(c for c in s if not unicodedata.combining(c))).strip("-")


def rows(lines, header_start):
    i = next(k for k, l in enumerate(lines) if l.startswith(header_start))
    out = []
    for l in lines[i + 2:]:
        if not l.startswith("|"):
            break
        out.append([c.strip() for c in l.strip().strip("|").split("|")])
    return out


def kratky(t):
    """První věta popisu; když obsahuje výčet příkladů za dvojtečkou, jen část před ní."""
    m = re.match(r"^(.+?[.!?])(\s|$)", t)
    v = m.group(1) if m else t
    if ":" in v:
        v = v.split(":")[0].rstrip(" ,") + "."
    return v


def main():
    lines = SRC.read_text(encoding="utf-8").split("\n")
    skupiny = {}
    for sk, slovesa, soucet in rows(lines, "| Skupina |"):
        for s in slovesa.split(","):
            skupiny[s.strip()] = sk
    praktiky = []
    for c in rows(lines, "| # | Praktika |"):
        num, praktika, vyskyt, vystupy, popis, priklad, tax = c[:7]
        m = re.match(r"\*\*(.+?)\*\*\s*\((.+)\)", praktika)
        sloveso, tvary = (m.group(1), m.group(2)) if m else (praktika.strip("*"), "")
        mv = re.match(r"(\d+)\s*\((\d+)\s*\+\s*(\d+)\)", vyskyt)
        mo = re.match(r"(\d+)\s*/\s*(\d+)\s*\(([^)]*)\)", vystupy)
        mp = re.match(r"^„(.+)“\s*\(([^)]+)\)\s*$", priklad)
        inf = sloveso.split(" ")[0].lower()           # „Rozhodnout (se)“ → rozhodnout
        praktiky.append({
            "id": "p-" + slug(inf), "poradi": int(num), "sloveso": sloveso, "tvary": tvary,
            "kratky": kratky(popis), "popis": popis,
            "vyskyt": {"celkem": int(mv.group(1)), "ovu": int(mv.group(2)), "cinnosti": int(mv.group(3))} if mv else None,
            "vystupu": int(mo.group(1)) if mo else None,
            "okruhy": [{"kod": k.strip(), "nazev": OKRUHY.get(k.strip(), k.strip())} for k in mo.group(3).split(",")] if mo else [],
            "priklad": {"text": mp.group(1), "ovu": mp.group(2)} if mp else {"text": priklad, "ovu": ""},
            "taxonomie": tax,
            "skupina": skupiny.get(inf, ""),
        })
    by_skupina = {}
    for p in praktiky:
        by_skupina.setdefault(p["skupina"], []).append(p["id"])
    for p in praktiky:
        p["pribuzne"] = [x for x in by_skupina.get(p["skupina"], []) if x != p["id"]] if p["skupina"] else []
    OUT.write_text(json.dumps({"zdroj": SRC.name, "praktiky": praktiky}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{OUT.relative_to(HERE)}: {len(praktiky)} praktik, bez skupiny: "
          f"{[p['sloveso'] for p in praktiky if not p['skupina']]}")


if __name__ == "__main__":
    main()
