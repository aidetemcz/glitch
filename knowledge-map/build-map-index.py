#!/usr/bin/env python3
"""Vytvoří kompaktní kostru mapy znalostí pro klienta (žákova knowledge map).

Zdroj pravdy je knowledge-map.yaml. Po jeho změně spusť:
    python3 knowledge-map/build-map-index.py

Výstup: knowledge-map/map-index.json — jen témata a v nich koncepty
(id + název). Bez cílů a kritérií, ať je soubor malý a dá se načíst
v profilu. Úrovně zvládnutí si klient dobarví sám z tg_mastery /
Supabase concept_mastery.
"""
import json
from pathlib import Path

import yaml

HERE = Path(__file__).parent
SRC = HERE / "app" / "data" / "Informatika" / "knowledge-map.yaml"
OUT = HERE / "map-index.json"


def build():
    data = yaml.safe_load(SRC.read_text(encoding="utf-8"))
    # pořadí témat podle knowledge-map.yaml (temata), aby mapa měla logickou osnovu
    temata = data.get("temata") or []
    poradi = [t["id"] for t in temata if t.get("id")]
    nazvy = {t["id"]: t.get("nazev") for t in temata if t.get("id")}

    koncepty = {}
    for c in data.get("concepts") or []:
        tid = c.get("tema")
        if not tid or not c.get("id"):
            continue
        koncepty.setdefault(tid, []).append({"id": c["id"], "nazev": c.get("nazev")})

    # témata v daném pořadí; nezařazená (kdyby přibyla) na konec
    for tid in koncepty:
        if tid not in poradi:
            poradi.append(tid)

    temata_out = []
    for tid in poradi:
        seznam = koncepty.get(tid)
        if not seznam:
            continue
        temata_out.append({
            "id": tid,
            "nazev": nazvy.get(tid, tid),
            "koncepty": seznam,
        })

    out = {"temata": temata_out}
    OUT.write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    total = sum(len(t["koncepty"]) for t in temata_out)
    print(f"Hotovo: {len(temata_out)} témat, {total} konceptů → {OUT.relative_to(HERE.parent)}")
    print(f"  velikost: {OUT.stat().st_size // 1024} kB")


if __name__ == "__main__":
    build()
