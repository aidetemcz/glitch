"""Parse karet „Hnízdo Programování" z PDF (pdftotext -bbox-layout): blok = odstavec."""
import html, json, re, sys

LEVELS = {"POROZUMĚT": "porozumeni", "APLIKOVAT": "aplikace", "ANALYZOVAT": "analyza",
          "HODNOTIT": "hodnoceni", "TVOŘIT": "tvorba", "ZAPAMATOVAT": "zapamatovani"}
SECTIONS = {"UČIVO", "VZDĚLÁVACÍ CÍLE", "KRITÉRIA ZVLÁDNUTÍ", "DŮRAZ", "RVP ZV"}

src = open(sys.argv[1], encoding="utf-8").read()
blocks = []
for b in re.findall(r"<block[^>]*>(.*?)</block>", src, re.S):
    lines = [" ".join(html.unescape(w) for w in re.findall(r"<word[^>]*>(.*?)</word>", l))
             for l in re.findall(r"<line[^>]*>(.*?)</line>", b, re.S)]
    lines = [l.strip() for l in lines if l.strip()]
    if lines:
        blocks.append(lines)

def is_upper(s):
    letters = [c for c in s if c.isalpha()]
    return bool(letters) and all(c.isupper() for c in letters)

def split_items(lines, start):
    out, cur = [], []
    for s in lines:
        if s == "·":
            continue
        s = s.lstrip("·").strip()
        if re.match(start, s) and cur:
            out.append(" ".join(cur)); cur = []
        cur.append(s)
    if cur: out.append(" ".join(cur))
    return out

uc = [i for i, b in enumerate(blocks) if b == ["UČIVO"]]
cards = []
for n, i in enumerate(uc):
    t, title = i - 1, []
    while t >= 0 and len(blocks[t]) <= 2 and is_upper(" ".join(blocks[t])) and " ".join(blocks[t]) not in SECTIONS:
        title.insert(0, " ".join(blocks[t])); t -= 1
    end = len(blocks)
    if n + 1 < len(uc):
        e = uc[n + 1] - 1
        while e >= 0 and len(blocks[e]) <= 2 and is_upper(" ".join(blocks[e])) and " ".join(blocks[e]) not in SECTIONS:
            e -= 1
        end = e + 1
    sec, lvl = None, None
    data = {"ucivo": [], "cile": [], "krit": [], "duraz": [], "rvp": []}
    for b in blocks[i:end]:
        txt = " ".join(b)
        if txt in SECTIONS:
            sec, lvl = txt, None; continue
        if sec == "VZDĚLÁVACÍ CÍLE" and txt in LEVELS:
            lvl = LEVELS[txt]; continue
        if sec == "UČIVO": data["ucivo"].append(txt)
        elif sec == "DŮRAZ": data["duraz"].append(txt)
        elif sec == "VZDĚLÁVACÍ CÍLE" and lvl:
            data["cile"] += [{"uroven": lvl, "text": t} for t in split_items(b, r"^Žák\b")]
        elif sec == "KRITÉRIA ZVLÁDNUTÍ": data["krit"] += split_items(b, r"^Žák\b")
        elif sec == "RVP ZV": data["rvp"] += split_items(b, r"^INF-")
    rvp = []
    for t in data["rvp"]:
        m = re.match(r"^(INF-[A-Z0-9-]+)\s*[–-]\s*(.*)$", t)
        rvp.append({"kod": m.group(1), "poznamka": m.group(2)} if m else {"kod": "", "poznamka": t})
    cards.append({"title": " ".join(title), "ucivo": data["ucivo"], "cile": data["cile"],
                  "kriteria": [k for k in data["krit"] if k], "duraz": data["duraz"], "rvp": rvp})

json.dump(cards, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for c in cards:
    print(f'{c["title"]:40} učivo={len(c["ucivo"])} cíle={len(c["cile"])} krit={len(c["kriteria"])} důraz={len(c["duraz"])} rvp={[r["kod"] for r in c["rvp"]]}')
