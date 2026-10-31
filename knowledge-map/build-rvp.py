# -*- coding: utf-8 -*-
"""Výtah RVP pro pohled „RVP Informatika" v Mapě informatických konceptů.

Vstup:  main-sources/rvp_10-26.json   (export RVP ZV, verze 10/2026)
Výstup: app/data/Informatika/rvp.json

Do mapy jdou čtyři „oblasti" (velké bubliny):
  - OVU 1. stupeň ZŠ  … očekávané výsledky učení Informatiky, 5. ročník (po tematických okruzích)
  - OVU 2. stupeň ZŠ  … totéž pro 9. ročník
  - Klíčové kompetence … výsledky klíčových kompetencí, na které informatika přímo odkazuje
  - Gramotnosti        … výsledky základních gramotností, na které informatika přímo odkazuje

Texty se z HTML převádějí na prosté bloky (odstavce, odrážky) — appka je
vykresluje escapované, žádné HTML ze zdroje se do stránky nevkládá.

Spuštění (z adresáře knowledge-map/):  python3 build-rvp.py
"""
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "main-sources" / "rvp_10-26.json"
OUT = HERE / "app" / "data" / "Informatika" / "rvp.json"

URO_ORDER = ["Minimální doporučená úroveň", "Na začátku", "Na cestě", "Splněno"]
STUPEN = {"ZV3": "1. stupeň · 3. ročník", "ZV5": "1. stupeň · 5. ročník", "ZV9": "2. stupeň · 9. ročník"}


class Blocks(HTMLParser):
    """HTML → [{"t": "p"|"li"|"h", "x": text}] + odkazy [{"t": text, "h": href}]."""
    BLOCK = {"p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "td", "th", "figcaption", "div", "br"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks, self.links = [], []
        self.buf, self.kind, self.strong_only, self.in_a = [], "p", True, None

    def flush(self):
        x = re.sub(r"\s+", " ", "".join(self.buf)).strip()
        if x:
            kind = self.kind
            # odstavec, který je celý tučně (např. „Zadání pro žáky"), je mezititulek
            if kind == "p" and self.strong_only and len(x) < 80:
                kind = "h"
            self.blocks.append({"t": kind, "x": x})
        self.buf, self.kind, self.strong_only = [], "p", True

    def handle_starttag(self, tag, attrs):
        if tag in self.BLOCK:
            self.flush()
            self.kind = "li" if tag == "li" else ("h" if tag.startswith("h") and len(tag) == 2 else "p")
        if tag == "a":
            self.in_a = [dict(attrs).get("href") or "", []]

    def handle_endtag(self, tag):
        if tag in self.BLOCK:
            self.flush()
        if tag == "a" and self.in_a:
            href, txt = self.in_a[0], re.sub(r"\s+", " ", "".join(self.in_a[1])).strip()
            if href.startswith(("http://", "https://")) and not re.search(r'[\s"<>]', href):
                self.links.append({"t": txt or href, "h": href})
            self.in_a = None

    def handle_data(self, data):
        self.buf.append(data)
        if self.in_a:
            self.in_a[1].append(data)
        if data.strip() and self.lasttag not in ("strong", "b"):
            self.strong_only = False


def blocks(src):
    p = Blocks()
    p.feed(src or "")
    p.close()
    p.flush()
    return p.blocks, p.links


def text(src):
    """Celý text jako odstavce oddělené prázdným řádkem (pro popisy bublin)."""
    b, _ = blocks(src)
    return "\n\n".join(x["x"] for x in b if x["t"] != "h")


def main():
    if not SRC.exists():
        sys.exit(f"Chybí zdroj {SRC}")
    d = json.loads(SRC.read_text(encoding="utf-8"))

    # index všech výsledků učení v celém RVP (pro „souvisí" mimo mapu)
    every = {}

    def index(o, kde):
        if isinstance(o, dict):
            if "zneni" in o and "kod" in o:
                every[o["kod"]] = {"zneni": html.unescape(o["zneni"]).strip(), "kde": kde}
            for v in o.values():
                index(v, kde)
        elif isinstance(o, list):
            for v in o:
                index(v, kde)

    for o in d["vzdelavaciOblasti"]:
        for obor in o["vzdelavaciObory"]:
            index(obor, obor["nazev"])
    for t in d["prurezovaTemata"]:
        index(t, "Průřezové téma: " + t["nazev"])
    for k in d["klicoveKompetence"]:
        index(k, k["nazev"])
    for g in d["zakladniGramotnosti"]:
        index(g, "Gramotnost " + g["nazev"].lower())

    def ovu_rec(o, hub, sub, ub, slozka=None):
        popis, _ = blocks(o.get("popisAZduvodneni"))
        uro = []
        for u in sorted(o.get("urovneMetodickePodpory", []),
                        key=lambda u: URO_ORDER.index(u["nazev"]) if u["nazev"] in URO_ORDER else 9):
            ub_blocks, _ = blocks(u.get("charakteristika"))
            il = []
            for i in u.get("ilustrace", []):
                ib, il_links = blocks(i.get("charakteristika"))
                il.append({"nazev": html.unescape(i["nazev"]).strip(), "bloky": ib, "odkazy": il_links})
            uro.append({"nazev": u["nazev"], "bloky": ub_blocks, "ilustrace": il})
        rec = {
            "kod": o["kod"], "hub": hub, "sub": sub, "ub": ub, "stupen": STUPEN.get(ub, ub),
            "zneni": html.unescape(o["zneni"]).strip(), "popis": popis, "urovne": uro,
            "navaznost": sorted(set(o.get("predchazejiciOcekavaneVysledkyUceni", []) +
                                    o.get("nasledujiciOcekavaneVysledkyUceni", []))),
            "souvisi": list(dict.fromkeys(o.get("souvisejiciOcekavaneVysledkyUceni", []))),
        }
        if slozka:
            rec["slozka"] = slozka
        return rec

    inf_area = next(o for o in d["vzdelavaciOblasti"] if o["kod"] == "INF")
    inf = inf_area["vzdelavaciObory"][0]
    inf_char = text(inf_area["charakteristika"]).split("\n\n")
    par = lambda kw: "\n\n".join(p for p in inf_char if kw in p)

    hubs, ovu = [], []
    for hid, ub, nazev, kw in (("ovu1", "ZV5", "OVU 1. stupeň ZŠ", "prvním stupni"),
                               ("ovu2", "ZV9", "OVU 2. stupeň ZŠ", "druhém stupni")):
        subs = []
        for to in inf["tematickeOkruhy"]:
            sid = f"{hid}-{to['kod']}"
            subs.append({"id": sid, "nazev": to["nazev"], "kod": f"INF-INF-{int(to['kod']):03d}",
                         "popis": text(to["charakteristika"])})
            for u in to["uzloveBody"]:
                if u["kod"] in (ub, "ZV3" if ub == "ZV5" else None):
                    ovu += [ovu_rec(o, hid, sid, u["kod"]) for o in u["ocekavaneVysledkyUceni"]]
        hubs.append({"id": hid, "nazev": nazev,
                     "popis": "Očekávané výsledky učení vzdělávací oblasti Informatika. " + par(kw),
                     "subs": subs})

    inf_codes = {o["kod"] for o in ovu}
    linked = {k for o in ovu for k in o["souvisi"]}

    kap = {k["nazev"]: k for oc in d["obecneCasti"] for k in oc["kapitoly"]}

    def side(hid, nazev, items, sub_key, kapitola, short):
        subs, n0 = [], len(ovu)
        for it in items:
            sid = f"{hid}-{it['kod']}"
            kids = []
            for s in it[sub_key]:
                for u in s.get("uzloveBody", []):
                    for o in u.get("ocekavaneVysledkyUceni", []):
                        if o["kod"] in linked:
                            kids.append(ovu_rec(o, hid, sid, u["kod"], s["nazev"]))
            if kids:
                subs.append({"id": sid, "nazev": short(it["nazev"]), "plny": it["nazev"], "kod": it["kod"],
                             "popis": text(it["charakteristika"])})
                ovu.extend(kids)
        # úvod kapitoly bez výčtu (ten tvoří bubliny podoblastí) až po „Závazné pro ŠVP"
        bl, _ = blocks(kap[kapitola]["charakteristika"]) if kapitola in kap else ([], [])
        paras, seen_list = [], False
        for x in bl:
            if x["t"] == "h":
                break
            if x["t"] == "li":
                seen_list = True
            elif seen_list:
                paras.append(x["x"])
        hubs.append({"id": hid, "nazev": nazev, "popis": "\n\n".join(paras), "subs": subs,
                     "vyber": "Na mapě jsou jen ty očekávané výsledky učení, na které přímo odkazují "
                              "očekávané výsledky Informatiky (vazba „souvisí“ v RVP)."})
        return len(ovu) - n0

    kk_short = lambda s: re.sub(r"^Klíčová kompetence\s+", "", s).strip().capitalize()
    n_kk = side("kk", "Klíčové kompetence", d["klicoveKompetence"], "slozkyKlicoveKompetence",
                "4.1 Klíčové kompetence", kk_short)
    n_zg = side("zg", "Gramotnosti", d["zakladniGramotnosti"], "slozkyZakladniGramotnosti",
                "4.2 Základní gramotnosti", lambda s: s)

    on_map = {o["kod"] for o in ovu}
    ext = {k: every[k] for o in ovu for k in o["souvisi"] + o["navaznost"]
           if k not in on_map and k in every}

    vydani = text(kap["Poznámky"]["charakteristika"]).split("\n\n")
    out = {
        "meta": {
            "zdroj": "Rámcový vzdělávací program pro základní vzdělávání — export rvp_10-26.json",
            "vydani": next((p for p in vydani if p.startswith("Rámcový")), ""),
            "pocty": {"ovu1": sum(o["hub"] == "ovu1" for o in ovu), "ovu2": sum(o["hub"] == "ovu2" for o in ovu),
                      "kk": n_kk, "zg": n_zg},
        },
        "hubs": hubs,
        "ovu": ovu,
        "ext": ext,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{OUT.relative_to(HERE)}: {OUT.stat().st_size // 1024} kB · "
          f"INF {len(inf_codes)} · KK {n_kk} · gramotnosti {n_zg} · mimo mapu {len(ext)}")


if __name__ == "__main__":
    main()
