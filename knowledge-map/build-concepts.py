#!/usr/bin/env python3
"""Vytáhne z mapy konceptů kompaktní JSON pro server (hodnocení Glitchů).

Zdroj pravdy je knowledge-map.yaml. Po jeho změně spusť:
    python3 knowledge-map/build-concepts.py

Výstup: knowledge-map/concepts.json — jen to, co potřebuje hodnotitel
(název, popis, výukové cíle a kritéria hodnocení). Celá mapa je pro
serverovou funkci zbytečně velká.
"""
import json
from pathlib import Path

import yaml

HERE = Path(__file__).parent
SRC = HERE / "app" / "data" / "Informatika" / "knowledge-map.yaml"
OUT = HERE / "concepts.json"


def walk(o):
    if isinstance(o, dict):
        if "id" in o and "nazev" in o:
            yield o
        for v in o.values():
            yield from walk(v)
    elif isinstance(o, list):
        for v in o:
            yield from walk(v)


def build():
    data = yaml.safe_load(SRC.read_text(encoding="utf-8"))
    out = {}
    for c in walk(data):
        cile = [{"uroven": x.get("uroven"), "text": x.get("text")}
                for x in (c.get("cile") or []) if x.get("text")]
        kriteria = [{"uroven": x.get("uroven"), "text": x.get("text")}
                    for x in (c.get("kriteria") or []) if x.get("text")]
        if not (cile or kriteria):
            continue                      # bez cílů i kritérií nemá pro hodnocení smysl
        out[c["id"]] = {
            "nazev": c.get("nazev"),
            "popis": c.get("popis"),
            "cile": cile,
            "kriteria": kriteria,
        }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Hotovo: {len(out)} konceptů → {OUT.relative_to(HERE.parent)}")
    print(f"  velikost: {OUT.stat().st_size // 1024} kB")


if __name__ == "__main__":
    build()
