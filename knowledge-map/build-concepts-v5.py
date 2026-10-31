# -*- coding: utf-8 -*-
"""Koncepty mapy z dokumentu „Mapa informatických konceptů – V5" (Markdown).

Vstup:  main-sources/Mapa_informatickych_konceptu_V5.md
Výstup: app/data/Informatika/knowledge-map.yaml   (nahrazuje celý soubor)

Struktura dokumentu → mapa:
  ## Oblast (CSTA)          → temata[]            (velká bublina)
  řádek se Skupinou         → temata[].podoblasti[] (střední bublina)
  řádek s Konceptem         → concepts[]  vrstva: core
  řádek s Podkonceptem      → concepts[]  vrstva: navazujici, nadrazeny: <koncept>
Sloupce 1. st. / 2. st. → stupne.zs1 / stupne.zs2, Pozn. → poznamka,
Zdroj popisu → zdroj_popisu. Přílohy A a B se nepřevádějí (nejsou to uzly mapy).

Id mají vlastní předpony (o- oblast, s- skupina, k- koncept), aby se nikdy
nepotkaly s id dřívějších konceptů (na ty dál odkazují úpravy v Supabase
a obsah Glitche).

Spuštění (z adresáře knowledge-map/):  python3 build-concepts-v5.py
"""
import re
import sys
import unicodedata
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
SRC = HERE / "main-sources" / "Mapa_informatickych_konceptu_V5.md"
OUT = HERE / "app" / "data" / "Informatika" / "knowledge-map.yaml"


def slug(s):
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:60]


def clean(s):
    s = s.strip()
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)          # tučné
    s = re.sub(r"(?<!\w)\*(\S.*?\S|\S)\*(?!\w)", r"\1", s)   # kurzíva
    s = s.replace("<br>", "\n").replace("\\|", "|")
    return s.strip()


def mark(s):
    s = s.strip()
    return True if s == "✓" else False if s in ("—", "-", "–") else None


def main():
    if not SRC.exists():
        sys.exit(f"Chybí zdroj {SRC}")
    lines = SRC.read_text(encoding="utf-8").split("\n")

    meta_text = [l.strip() for l in lines[1:12] if l.strip() and not l.startswith("#")]
    temata, concepts = [], []
    used_ids = set()
    tema = sub = parent = None

    def uid(base, extra):
        i = base
        if i in used_ids:
            i = f"{base}-{extra}"
        n = 2
        while i in used_ids:
            i = f"{base}-{extra}-{n}"
            n += 1
        used_ids.add(i)
        return i

    for l in lines:
        if l.startswith("## "):
            title = l[3:].strip()
            if title.startswith("Příloha"):
                tema = None
                continue
            m = re.match(r"(.+?)\s*\((.+)\)\s*$", title)
            nazev, en = (m.group(1), m.group(2)) if m else (title, "")
            tema = {"id": "o-" + slug(nazev), "nazev": nazev, "nazev_en": en, "popis": "",
                    "barva": "#ffff00", "podoblasti": []}
            temata.append(tema)
            sub = parent = None
            continue
        if tema is None:
            continue
        if not l.startswith("|"):
            if l.strip() and not tema["popis"]:
                tema["popis"] = clean(l)
            continue
        cells = [c.strip() for c in l.strip().strip("|").split("|")]
        if cells[0] == "Skupina" or set(l.strip()) <= set("|-: "):
            continue
        if len(cells) != 8:
            sys.exit(f"Neočekávaný počet sloupců ({len(cells)}): {l[:80]}")
        skupina, koncept, podkoncept, s1, s2, pozn, popis, zdroj = cells
        if skupina:
            nazev = clean(skupina)
            sub = {"id": "s-" + slug(nazev), "nazev": nazev, "popis": clean(popis)}
            if any(p["id"] == sub["id"] for p in tema["podoblasti"]):
                sys.exit(f"Duplicitní skupina {nazev}")
            tema["podoblasti"].append(sub)
            parent = None
            continue
        if sub is None:
            sys.exit(f"Koncept mimo skupinu: {l[:80]}")
        nazev = clean(koncept or podkoncept)
        c = {
            "id": uid("k-" + slug(nazev), sub["id"][2:]),
            "nazev": nazev,
            "tema": tema["id"],
            "podoblast": sub["id"],
            "vrstva": "core" if koncept else "navazujici",
        }
        if not koncept:
            if parent is None:
                sys.exit(f"Podkoncept bez konceptu: {nazev}")
            c["nadrazeny"] = parent["id"]
        c["stupne"] = {"zs1": mark(s1), "zs2": mark(s2)}
        if pozn:
            c["poznamka"] = clean(pozn)
        c["popis"] = clean(popis)
        c["zdroj_popisu"] = clean(zdroj)
        c["stav"] = "draft"
        concepts.append(c)
        if koncept:
            parent = c

    n_k = sum(c["vrstva"] == "core" for c in concepts)
    data = {
        "meta": {
            "verze": "5.0",
            "nazev": "Mapa informatických konceptů – znalostní koncepty s popisy (V5)",
            "popis": "\n\n".join(meta_text),
            "zdroj": SRC.name,
            "struktura": "temata = oblasti (CSTA 2026), podoblasti = skupiny, concepts = koncepty (vrstva core) "
                         "a podkoncepty (vrstva navazujici, pole nadrazeny). stupne.zs1/zs2 = obsah v Pojmech "
                         "a obsazích NPI pro 1. a 2. stupeň ZŠ.",
        },
        "temata": temata,
        "concepts": concepts,
    }
    yaml.SafeDumper.ignore_aliases = lambda *a: True
    OUT.write_text(yaml.safe_dump(data, allow_unicode=True, sort_keys=False, width=1000), encoding="utf-8")
    print(f"{OUT.relative_to(HERE)}: {len(temata)} oblastí · "
          f"{sum(len(t['podoblasti']) for t in temata)} skupin · {n_k} konceptů · {len(concepts) - n_k} podkonceptů")


if __name__ == "__main__":
    main()
