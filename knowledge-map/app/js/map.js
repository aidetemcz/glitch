/* ==========================================================================
   Mapa informatických konceptů — interaktivní graf (Cytoscape.js)
   Pohledy: koncepty podle oblastí (default) nebo digitální kompetence;
   pohled „RVP Informatika" ukazuje přímo očekávané výsledky učení z RVP.
   Data: data/Informatika/knowledge-map.yaml + rvp.json (build-rvp.py) · schéma: ../structure.md
   ========================================================================== */
(function () {
  "use strict";

  const LEVELS = {
    // Bloomova revidovaná taxonomie (data v0.12)
    "zapamatovani": "Zapamatování", "porozumeni": "Porozumění",
    "aplikace": "Aplikace", "analyza": "Analýza",
    "hodnoceni": "Hodnocení", "tvorba": "Tvorba",
    // Marzano-Kendall (starší data — zpětná kompatibilita)
    "vybaveni": "Vybavení", "vyuziti-znalosti": "Využití znalostí"
  };
  const VRSTVA = { core: "Koncept", navazujici: "Podkoncept" };
  const VRSTVA_MAPY = { 0: "Základy a myšlení", 1: "Tvorba a programování", 2: "Umělá inteligence", 3: "Bezpečí a občanství" };
  const NOKDI = "__nokdi__";
  const LINEH = 1.35;   // řádkování textu v bublinách (CSS i výpočet fit)
  /* Barvy pozadí bere graf z CSS proměnných (map.css :root) — barevnost Tiny se mění na jednom místě */
  const cssVar = (name, fb) => (getComputedStyle(document.documentElement).getPropertyValue(name) || "").trim() || fb;
  const BG = cssVar("--c-bg", "#0a0a0c"), BG_NODE = cssVar("--c-bg-node", "#141416");

  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* Česká typografie: jednoznakové předložky/spojky (k s v z o u a i) sváže
     pevnou mezerou s dalším slovem, aby nezůstaly na konci řádku. */
  const NBSP = String.fromCharCode(160);
  const bindOne = (t) => t.replace(/(^|[\s(\u201e"'\u201a\u2018\u00ab\u2013\u2014])([aAiIkKoOsSuUvVzZ]) /g, "$1$2" + NBSP);
  const typo = (s) => bindOne(bindOne(String(s == null ? "" : s)));

  /* Zalomení popisků v grafu (bubliny, nadpisy clusterů).
     Cytoscape láme řádky regexem, kam JS `\s` počítá i pevnou mezeru — proto
     pevná mezera sama o sobě zalomení nezabrání. Řešení: předzalomíme popisek
     sami do řádků, které se vejdou do text-max-width, a jednoznakové předložky
     přilepíme k dalšímu slovu. Cytoscape honoruje `\n` a řádek, který se už
     vejde, znovu neláme → jednoznakovky nezůstanou na konci řádku. */
  const SINGLE = /^[aikosuvzAIKOSUVZ]$/;
  const _mctx = document.createElement("canvas").getContext("2d");
  const measureW = (txt, font) => { _mctx.font = font; return _mctx.measureText(txt).width; };
  function unitize(text) {
    const words = String(text == null ? "" : text).trim().split(/\s+/).filter(Boolean);
    const units = [];
    for (let i = 0; i < words.length; i++) {
      if (SINGLE.test(words[i]) && i + 1 < words.length) { units.push(words[i] + NBSP + words[i + 1]); i++; }
      else units.push(words[i]);
    }
    return units;
  }
  function wrapLabel(text, font, maxW, upper) {
    const units = unitize(text);
    const meas = (s) => measureW(upper ? s.toUpperCase() : s, font);
    const lines = []; let cur = "";
    for (const u of units) {
      const cand = cur ? cur + " " + u : u;
      if (cur && meas(cand) > maxW) { lines.push(cur); cur = u; }
      else cur = cand;
    }
    if (cur) lines.push(cur);
    return lines.join("\n");
  }

  function textOn(hex) {
    const h = String(hex || "#ffffff").replace("#", "");
    const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#000000" : "#ffffff";
  }

  /* ---------- Text do kruhu ----------
     Každý řádek dostane šířku tětivy kruhu ve své výšce (minus vnitřní okraj),
     takže blok textu kopíruje tvar bubliny. Jednoznakové předložky drží u dalšího
     slova, složená slova se smí zlomit za spojovníkem (Logicko-|matematická).
     Šířky slov se měří jednou pro každý font (cache), skládání je pak jen sčítání. */
  const _wcache = new Map();
  const unitW = (t, font) => {
    const k = font + "|" + t; let w = _wcache.get(k);
    if (w == null) { w = measureW(t, font); _wcache.set(k, w); }
    return w;
  };
  function breakUnits(text) {
    const out = [];
    unitize(text).forEach((u) => {
      const parts = u.replace(/([^\s-]{2,}-)(?=[^\s-]{2,})/g, "$1\u0001").split("\u0001");
      parts.forEach((t, i) => out.push({ t, sp: i === parts.length - 1 }));   // sp = za jednotkou mezera
    });
    return out;
  }
  // šířky řádků výšky lh poskládaných od `top` dolů v kruhu o poloměru R (střed v 0)
  function chordSlots(top, n, lh, R) {
    const out = [];
    for (let i = 0, y = top; i < n; i++, y += lh) {
      const e = Math.max(Math.abs(y), Math.abs(y + lh));    // užší z hran řádku
      out.push(e >= R ? 0 : 2 * Math.sqrt(R * R - e * e));
    }
    return out;
  }
  // hladově plní řádky; ok = vše umístěno (když slova dojdou dřív, zbylé řádky odpadnou)
  function flow(units, font, slots) {
    const sp = unitW(" ", font), lines = [];
    let i = 0;
    for (const w of slots) {
      let line = "", lw = 0;
      while (i < units.length) {
        const gap = line && units[i - 1].sp ? sp : 0, uw = unitW(units[i].t, font);
        if (lw + gap + uw > w + 0.5) break;
        line += (line && units[i - 1].sp ? " " : "") + units[i].t; lw += gap + uw; i++;
      }
      if (!line) { if (i === units.length) break; return { lines, used: i, ok: false }; }
      lines.push(line);
    }
    return { lines, used: i, ok: i === units.length };
  }
  /* Krátký text (nadpis) přesně do n řádků: vyzkouší všechna rozdělení slov a vybere
     nejvyrovnanější vůči šířkám kruhu (nahoře užší řádek, dole širší). */
  function flowBalanced(units, font, slots) {
    const n = slots.length, sp = unitW(" ", font);
    if (units.length < n) return { lines: [], ok: false };
    if (units.length > 12) return flow(units, font, slots);
    const lineOf = (a, b) => {
      let t = "", w = 0;
      for (let i = a; i < b; i++) {
        if (i > a && units[i - 1].sp) { t += " "; w += sp; }
        t += units[i].t; w += unitW(units[i].t, font);
      }
      return { t, w };
    };
    let best = null;
    const rec = (start, k, acc, minFill) => {
      if (k === n - 1) {
        const l = lineOf(start, units.length);
        if (l.w > slots[k] + 0.5) return;
        const f = Math.min(minFill, l.w / slots[k]);
        if (!best || f > best.f) best = { f, lines: [...acc, l.t] };
        return;
      }
      for (let end = start + 1; end <= units.length - (n - 1 - k); end++) {
        const l = lineOf(start, end);
        if (l.w > slots[k] + 0.5) break;
        rec(end, k + 1, [...acc, l.t], Math.min(minFill, l.w / slots[k]));
      }
    };
    rec(0, 0, [], 1);
    return best ? { lines: best.lines, used: units.length, ok: true } : { lines: [], ok: false };
  }

  // celý text do kruhu: nejmenší počet řádků, při kterém se vejde (blok svisle na středu)
  function circleLines(units, font, lh, R) {
    for (let n = 1; n * lh <= 2 * R; n++) {
      const r = flow(units, font, chordSlots(-n * lh / 2, n, lh, R));
      if (r.ok) return r.lines;
    }
    return null;
  }
  // největší písmo z rozmezí <fmin, fmax>, při kterém se text celý vejde; null = nevejde se
  function fitCircle(text, fontOf, R, fmax, fmin, lhRatio) {
    const units = breakUnits(text);
    for (let f = fmax; f >= fmin - 1e-9; f -= 0.5) {
      const lines = circleLines(units, fontOf(f), f * lhRatio, R);
      if (lines) return { fs: f, label: lines.join("\n") };
    }
    return null;
  }
  const innerR = (size, k) => size / 2 - Math.max(5, size * k);   // poloměr bez vnitřního okraje
  const LEAF_FAMILY = '"Inter", "Segoe UI", sans-serif';
  const leafFont = (f) => "400 " + f + "px " + LEAF_FAMILY;
  const subFont = (f) => "600 " + f + 'px "Space Grotesk", "Inter", sans-serif';

  const statusEl = document.getElementById("status");
  const setStatus = (t) => { statusEl.textContent = t; statusEl.classList.toggle("hidden", !t); };

  let DATA = null, cy = null, viewMode = "tema", conceptById = {}, pinned = null;
  let revSouvisi = {}, revPrereq = {};   // reverzní indexy (obousměrné čtení hran v panelu)
  let drillId = null;                     // hloubkové ponoření: id konceptu, do kterého jsme „zanořeni"

  /* ---------- Admin editor (bez backendu) ----------
     Přihlášení je jen klientská závora (skrývá editační UI), ne bezpečnost:
     stránka je statická, neexistuje zápis na server, takže i kdyby někdo
     závoru obešel, může upravit jen svou vlastní lokální kopii — na
     nasazená data to nemá vliv. Uložení = localStorage (přežije refresh v
     tomto prohlížeči) + export YAML k commitu do repa. */
  const ADMIN_USER = "aidetem";
  const ADMIN_HASH = "f564b3dd35f4abb0b1dc0ea62362d5b8fab3439d0662b5ed557ebb5684bb2f6e";
  const EDITS_KEY = "km-edits-v1";
  const NEW_KEY = "km-new-v1";
  const EDITABLE = ["nazev", "popis", "vrstva", "podoblast", "cile", "kriteria", "duraz", "stav", "prerekvizity", "souvisi"];
  const STAV = { draft: "Draft", garant: "Rozpracováno garantem", hotovo: "Hotovo" };
  const stavSelect = (sel, val) => `<select id="${sel}">${Object.keys(STAV).map((k) =>
    `<option value="${k}"${(val || "draft") === k ? " selected" : ""}>${STAV[k]}</option>`).join("")}</select>`;

  const BLOOM = [["zapamatovani", "Zapamatování"], ["porozumeni", "Porozumění"], ["aplikace", "Aplikace"],
    ["analyza", "Analýza"], ["hodnoceni", "Hodnocení"], ["tvorba", "Tvorba"]];
  let authed = sessionStorage.getItem("km-auth") === "1";
  let adminSecret = sessionStorage.getItem("km-secret") || "";   // plaintext hesla pro RPC
  let adminLogin = sessionStorage.getItem("km-login") || "";     // e-mail nebo „aidetem"
  let adminRole = sessionStorage.getItem("km-role") || "";       // 'admin' | 'editor'
  let adminName = sessionStorage.getItem("km-name") || "";       // jméno garanta (do názvu zálohy)
  const ROLE = { admin: "Admin", editor: "Editor", viewer: "Čtenář (jen export)" };
  // čtenář se přihlásí a stahuje exporty, ale neupravuje (server zápis stejně odmítne)
  const canWrite = () => authed && adminRole !== "viewer";
  let editing = false;
  const loadEdits = () => { try { return JSON.parse(localStorage.getItem(EDITS_KEY) || "{}"); } catch (_) { return {}; } };
  const saveEdits = (o) => { try { localStorage.setItem(EDITS_KEY, JSON.stringify(o)); } catch (_) {} };
  async function sha256hex(s) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  /* ---------- Načtení dat ---------- */
  // Základ = YAML z repa. Nad něj se (když je dostupné) navrství živá vrstva
  // ze Supabase: úpravy stávajících konceptů, nové koncepty a mikrokoncepty.
  let supabaseOk = false;
  (async function boot() {
    try {
      const txt = await fetch("data/Informatika/knowledge-map.yaml?v=24")
        .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); });
      const data = jsyaml.load(txt);
      try {
        if (window.KM) {
          const ov = await window.KM.loadOverlay();
          if (!ov.offline) { supabaseOk = true; mergeOverlay(data, ov); }
        }
      } catch (_) { /* offline → jen základ */ }
      init(data);
    } catch (e) { setStatus("Chyba načítání dat: " + e.message); }
  })();

  /* RVP Informatika (výtah z RVP ZV, viz ../build-rvp.py) — načítá se na pozadí,
     pohled „RVP" a odkazy z detailu konceptu na něj počkají */
  let RVP = null, rvpByKod = {}, rvpRev = {}, rvpPromise = null;
  function loadRvp() {
    if (!rvpPromise) rvpPromise = fetch("data/Informatika/rvp.json?v=1")
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((d) => {
        RVP = d; rvpByKod = {}; rvpRev = {};
        d.ovu.forEach((o) => { rvpByKod[o.kod] = o; });
        // zpětné vazby: který výsledek informatiky odkazuje na kompetenci / gramotnost
        d.ovu.forEach((o) => o.souvisi.forEach((k) => { if (rvpByKod[k]) (rvpRev[k] = rvpRev[k] || []).push(o.kod); }));
        return d;
      })
      .catch((e) => { rvpPromise = null; throw e; });
    return rvpPromise;
  }

  const slug = (s) => String(s == null ? "" : s).toLowerCase().normalize("NFD")
    .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

  function buildRevIndexes() {
    revSouvisi = {}; revPrereq = {};
    (DATA ? DATA.concepts : []).forEach((c) => {
      (c.souvisi || []).forEach((s) => (revSouvisi[s] = revSouvisi[s] || []).push(c.id));
      (c.prerekvizity || []).forEach((p) => (revPrereq[p] = revPrereq[p] || []).push(c.id));
    });
  }

  function normalizeConcept(c) {
    c.vrstva = c.vrstva === "core" ? "core" : "navazujici";
    c.tagy = c.tagy || []; c.prerekvizity = c.prerekvizity || []; c.souvisi = c.souvisi || [];
    c.cile = c.cile || []; c.kriteria = c.kriteria || []; c.rvp = c.rvp || [];
    c.pokryti_glitchem = c.pokryti_glitchem || [];
    if (!("oblast" in c)) c.oblast = null;
    if (!("kompetence" in c)) c.kompetence = null;
    if (!STAV[c.stav]) c.stav = "draft";
    return c;
  }

  // Navrství Supabase překryv na základní data (in-place).
  function mergeOverlay(data, ov) {
    data.concepts.forEach((c) => { if (ov.overrides[c.id]) Object.assign(c, ov.overrides[c.id]); });
    const have = new Set(data.concepts.map((c) => c.id));
    const temata = new Set((data.temata || []).map((t) => t.id));   // koncepty ze starších verzí mapy (jiné oblasti) se nenačtou
    ov.news.forEach((n) => { if (n && n.id && !have.has(n.id) && temata.has(n.tema)) { data.concepts.push(normalizeConcept(n)); have.add(n.id); } });
    const byId = {}; data.concepts.forEach((c) => byId[c.id] = c);
    ov.micros.forEach((m) => { const p = byId[m.parent_id]; if (p) (p._micros = p._micros || []).push(m); });
    data._micros = ov.micros;
  }

  /* ---------- Seskupení ---------- */
  function groupDefs(mode) {
    if (mode === "tema") return DATA.temata.map((t) => ({ id: t.id, nazev: t.nazev, barva: t.barva, popis: t.popis }));
    if (mode === "kompetence") {
      const k = (DATA.kompetence || []).map((x) => ({ id: x.id, nazev: x.nazev, barva: x.barva }));
      k.push({ id: NOKDI, nazev: "Nezařazeno (informatická teorie)", barva: "#ffffff" });
      return k;
    }
    return ((RVP && RVP.hubs) || []).map((h) => ({ id: h.id, nazev: h.nazev, barva: "#ffff00", popis: h.popis }));   // mode === "rvp"
  }
  const groupOf = (c, mode) => mode === "tema" ? c.tema : mode === "kompetence" ? (c.kompetence || NOKDI) : null;
  const subId = (tema, pod) => "sub-" + tema + "-" + pod;
  const podoblastiOf = (temaId) => ((DATA.temata.find((t) => t.id === temaId) || {}).podoblasti) || [];
  const podoblastOf = (c) => c.podoblast ? podoblastiOf(c.tema).find((p) => p.id === c.podoblast) || null : null;
  const GROUP_LABEL = { tema: "Oblast", rvp: "RVP Informatika", kompetence: "Digitální kompetence" };
  const LEAF = "[type='concept'], [type='ovu']";   // listy stromu: koncepty, v pohledu RVP očekávané výsledky učení

  const HUB_FONT = '600 22px "Space Grotesk", "Inter", sans-serif';
  const DESC_FONT = '500 14px "Darker Grotesque", "Inter", sans-serif';
  const HUB_LH = 1.15, DESC_LH = 0.85;   // řádkování názvu a popisu tématu (popis o třetinu těsnější)
  const hubId = (gid) => "hub-" + gid, hubdId = (gid) => "hubd-" + gid, shubId = (tema, pid) => "shub-" + tema + "-" + pid;
  // velikost bubliny tématu podle počtu konceptů
  const hubSize = (n) => Math.min(340, Math.round(230 + 1.6 * n));

  /* Název a popis velké bubliny jako jeden blok do kruhu: název nahoře, popis pod ním,
     řádky podle tvaru kruhu. Popis, který se nevejde, se utne na konci věty (nebo „…"). */
  const HUB_FS = 22, DESC_FS = 14, HUB_GAP = 10;
  function hubLayout(nazev, popis, size) {
    const R = innerR(size, 0.075), lhT = HUB_FS * HUB_LH, lhD = DESC_FS * DESC_LH;
    const T = breakUnits(nazev);
    const place = (D, nt, nd) => {
      const H = nt * lhT + (nd ? HUB_GAP + nd * lhD : 0), top = -H / 2;
      if (H > 2 * R) return null;
      const t = flowBalanced(T, HUB_FONT, chordSlots(top, nt, lhT, R));
      if (!t.ok) return null;
      const dTop = top + nt * lhT + HUB_GAP;
      const d = nd ? flow(D, DESC_FONT, chordSlots(dTop, nd, lhD, R)) : { lines: [], used: 0, ok: !D.length };
      return { t, d, tm: top + nt * lhT / 2, dm: dTop + d.lines.length * lhD / 2 };
    };
    // vše se vejde: nejmenší počet řádků (blok co nejmenší, na středu)
    const fitAll = (D) => {
      for (let nt = 1; nt <= 4; nt++) for (let nd = D.length ? 1 : 0; nd <= 40; nd++) {
        const r = place(D, nt, nd);
        if (r && r.d.ok) return r;
      }
      return null;
    };
    const text = String(popis || "").replace(/\s+/g, " ").trim();
    let D = breakUnits(text), res = fitAll(D);
    if (!res && D.length) {
      // nevejde se celý: kolik slov se vejde při nejlépe zaplněném kruhu
      let best = 0;
      for (let nt = 1; nt <= 4; nt++) for (let nd = 1; nd <= 40; nd++) {
        const r = place(D, nt, nd);
        if (r && r.d.lines.length === nd) best = Math.max(best, r.d.used);
      }
      const joined = (k) => D.slice(0, k).reduce((a, u, i) => a + (i && D[i - 1].sp ? " " : "") + u.t, "");
      let cut = joined(best);
      const m = cut.match(/^[\s\S]*[.!?](?=\s|$)/);                  // raději konec věty
      const ell = (t) => {                                              // „…" bez neuzavřené závorky
        if ((t.match(/\(/g) || []).length > (t.match(/\)/g) || []).length) t = t.slice(0, t.lastIndexOf("("));
        return t.replace(/[,;:\s–-]+$/, "") + "…";
      };
      cut = m && m[0].length > cut.length * 0.55 ? m[0] : ell(cut);
      for (let k = best; k > 0 && !res; k--) {
        res = fitAll(breakUnits(cut));
        if (!res) cut = ell(joined(k - 1));
      }
    }
    if (!res) res = { t: { lines: [nazev] }, d: { lines: [] }, tm: 0, dm: 0 };
    return { title: res.t.lines.join("\n"), desc: res.d.lines.join("\n"), tm: Math.round(res.tm), dm: Math.round(res.dm), textw: Math.ceil(2 * R) + 4 };
  }

  /* Bublina oblasti (hub) + její popis; společné pro koncepty i RVP */
  function pushHub(nodes, g, n) {
    const size = hubSize(n), L = hubLayout(g.nazev, g.popis, size);
    nodes.push({ data: { id: "grp-" + g.id, type: "group", gid: g.id, popis: g.popis } });
    nodes.push({ data: { id: hubId(g.id), type: "hub", parent: "grp-" + g.id, gid: g.id, size,
      label: L.title, textw: L.textw, tm: L.tm } });
    nodes.push({ data: { id: hubdId(g.id), type: "hubdesc", parent: "grp-" + g.id, gid: g.id, hub: hubId(g.id),
      label: L.desc, textw: L.textw, tm: L.dm } });
  }
  /* Střední bublina: název do kruhu písmem 10–12,5 px; když se nevejde, bublina povyroste */
  function subFit(nazev) {
    for (let d = 96; d <= 140; d += 4) {
      const f = fitCircle(nazev, subFont, innerR(d, 0.1), 12.5, 10, 1.2);
      if (f) return Object.assign({ size: d, textw: Math.ceil(d) }, f);
    }
    return { size: 140, fs: 10, label: wrapLabel(nazev, subFont(10), 100, false), textw: 140 };
  }
  function pushSub(nodes, edges, gid, pid, nazev) {
    const f = subFit(nazev);
    nodes.push({ data: { id: subId(gid, pid), type: "sub", parent: "grp-" + gid, gid, pid } });
    nodes.push({ data: { id: shubId(gid, pid), type: "subhub", parent: subId(gid, pid), gid, pid, size: f.size,
      label: f.label, fontsize: f.fs, textw: f.textw, tp: hubId(gid) } });
    edges.push({ data: { id: "t-" + shubId(gid, pid), source: hubId(gid), target: shubId(gid, pid), etype: "tree" } });
  }

  /* Výsledek učení v bublině: celé doslovné znění. Bublina je nejmenší, do které se text
     vejde písmem 10,5 px; krátké výsledky pak dostanou písmo až 12 px. */
  function ovuFit(text) {
    for (let d = 84; d <= 240; d += 4) {
      const R = innerR(d, 0.1);
      if (fitCircle(text, leafFont, R, 10.5, 10.5, LINEH)) return Object.assign({ size: d }, fitCircle(text, leafFont, R, 12, 10.5, LINEH));
    }
    return Object.assign({ size: 240 }, fitCircle(text, leafFont, innerR(240, 0.1), 10, 7, LINEH) || { fs: 7, label: text });
  }
  const ovuNodeId = (kod) => "ovu-" + kod;

  /* Pohled „RVP Informatika": čtyři velké bubliny (OVU 1. a 2. stupně, klíčové kompetence,
     gramotnosti), střední bubliny = tematické okruhy / kompetence / gramotnosti, listy = OVU */
  function buildRvpElements() {
    const nodes = [], edges = [];
    RVP.hubs.forEach((h) => {
      const leaves = RVP.ovu.filter((o) => o.hub === h.id);
      pushHub(nodes, h, leaves.length);
      h.subs.forEach((s) => pushSub(nodes, edges, h.id, s.id, s.nazev));
      leaves.forEach((o) => {
        const f = ovuFit(o.zneni);
        nodes.push({ data: {
          id: ovuNodeId(o.kod), type: "ovu", parent: subId(h.id, o.sub), gid: h.id, pid: o.sub,
          strana: h.id === "kk" || h.id === "zg" ? "vazba" : "inf",
          label: f.label, size: f.size, textw: f.size, fontsize: f.fs,
          tp: shubId(h.id, o.sub), kod: o.kod, _o: o
        }});
        edges.push({ data: { id: "t-" + ovuNodeId(o.kod), source: shubId(h.id, o.sub), target: ovuNodeId(o.kod), etype: "tree" } });
      });
    });
    return [...nodes, ...edges];
  }

  function buildElements(mode) {
    if (mode === "rvp") return buildRvpElements();
    const groups = groupDefs(mode);
    const conceptIds = new Set(DATA.concepts.map((c) => c.id));
    const sameSub = (a, b) => mode !== "tema" || ((podoblastOf(a) || {}).id === (podoblastOf(b) || {}).id);

    const edges = [];
    const byIdAll = {}; DATA.concepts.forEach((c) => byIdAll[c.id] = c);
    // návaznost (prerekvizita) uvnitř tématu = prostá čára mezi bublinami; napříč tématy se zatím nekreslí
    DATA.concepts.forEach((c) => {
      (c.prerekvizity || []).forEach((p) => {
        if (conceptIds.has(p) && groupOf(byIdAll[p], mode) === groupOf(c, mode))
          edges.push({ data: { id: "p-" + p + "-" + c.id, source: p, target: c.id, etype: "tree" } });
      });
    });
    // velikost bubliny = kolik pod ní visí podkonceptů a navazujících konceptů (i nepřímo);
    // odmocnina, aby velké koncepty nepřerostly mapu
    const naslednici = {};
    DATA.concepts.forEach((c) => [...(c.prerekvizity || []), ...(c.nadrazeny ? [c.nadrazeny] : [])].forEach((p) => {
      if (conceptIds.has(p)) (naslednici[p] = naslednici[p] || []).push(c.id);
    }));
    const pocetNavaznych = (id) => {
      const seen = new Set([id]), stack = [id];
      while (stack.length) (naslednici[stack.pop()] || []).forEach((x) => { if (!seen.has(x)) { seen.add(x); stack.push(x); } });
      return seen.size - 1;
    };
    // koncept 84–124 px, podkoncept 64 px (víc místa pro název v kruhu)
    const sizeFor = (c) => c.vrstva === "core" ? Math.min(124, Math.round(84 + 10 * Math.sqrt(pocetNavaznych(c.id)))) : 64;

    const nodes = [];
    // téma / oblast = velká bublina (hub) s názvem a popisem; neviditelný rodič drží filtry
    groups.forEach((g) => pushHub(nodes, g, DATA.concepts.filter((c) => groupOf(c, mode) === g.id).length));
    // podoblasti tématu = střední bubliny navázané na téma (jen v pohledu Témata)
    if (mode === "tema") DATA.temata.forEach((t) => (t.podoblasti || []).forEach((p) => pushSub(nodes, edges, t.id, p.id, p.nazev)));
    const byId = byIdAll;
    DATA.concepts.forEach((c) => {
      // název do kruhu: největší písmo do 13 px; když by klesl pod 8,5 px (dlouhé slovo),
      // bublina povyroste (nejvýš o 32 px), teprve pak se písmo zmenší až na 6 px
      let sz = sizeFor(c), fit = null;
      for (let d = sz; d <= sz + 32 && !fit; d += 4) {
        fit = fitCircle(c.nazev, leafFont, innerR(d, 0.1), Math.max(10, Math.floor(d / 9)), 8.5, LINEH);
        if (fit) sz = d;
      }
      fit = fit || fitCircle(c.nazev, leafFont, innerR(sz, 0.1), 8, 6, LINEH)
        || { fs: 6, label: wrapLabel(c.nazev, leafFont(6), sz * 0.8, false) };
      const sub = mode === "tema" && podoblastOf(c);
      // rodič ve stromu: nadřazený koncept, jinak první prerekvizita ze stejné skupiny (a podoblasti),
      // jinak bublina podoblasti / tématu
      const gid = groupOf(c, mode);
      const parentConcept = [...(c.nadrazeny ? [c.nadrazeny] : []), ...(c.prerekvizity || [])]
        .find((p) => byId[p] && groupOf(byId[p], mode) === gid && sameSub(byId[p], c));
      const tp = parentConcept || (sub ? shubId(c.tema, sub.id) : hubId(gid));
      nodes.push({ data: {
        id: c.id, type: "concept", parent: sub ? subId(c.tema, sub.id) : "grp-" + gid, gid,
        label: fit.label, vrstva: c.vrstva,
        stav: c.stav || "draft", tagy: c.tagy || [],
        size: sz, textw: sz, fontsize: fit.fs, tp, _c: c
      }});
      // čára k rodiči ve stromu: k bublině skupiny / oblasti, nebo k nadřazenému konceptu
      // (prerekvizity mají vlastní hranu „p-…" z cyklu výše, tu nezdvojujeme)
      if (!parentConcept) edges.push({ data: { id: "t-" + c.id, source: tp, target: c.id, etype: "tree" } });
      else if (parentConcept === c.nadrazeny && !(c.prerekvizity || []).includes(parentConcept))
        edges.push({ data: { id: "n-" + parentConcept + "-" + c.id, source: parentConcept, target: c.id, etype: "tree" } });
    });
    return [...nodes, ...edges];
  }

  /* ==========================================================================
     Inicializace
     ========================================================================== */
  function init(data) {
    DATA = data; window.__data = data;
    data.concepts.forEach((c) => { normalizeConcept(c); conceptById[c.id] = c; });   // data V5 nemají všechna pole
    /* offline záloha: lokální úpravy i nové koncepty (localStorage) jen když Supabase není */
    if (!supabaseOk) {
      const overlay = loadEdits();
      data.concepts.forEach((c) => { if (overlay[c.id]) Object.assign(c, overlay[c.id]); });
      try {
        JSON.parse(localStorage.getItem(NEW_KEY) || "[]").forEach((n) => {
          if (n && n.id && !conceptById[n.id] && data.temata.some((t) => t.id === n.tema)) { normalizeConcept(n); data.concepts.push(n); conceptById[n.id] = n; }
        });
      } catch (_) {}
    }
    /* reverzní indexy hran (panel čte souvisí i „je prerekvizitou pro" obousměrně) */
    buildRevIndexes();

    cy = cytoscape({
      container: document.getElementById("cy"),
      elements: [], wheelSensitivity: 0.25, minZoom: 0.15, maxZoom: 2.5,
      style: [
        // neviditelné rodičovské uzly (téma, podoblast) — jen pro filtry a seskupení
        { selector: "node[type='group'], node[type='sub']", style: {
          "events": "no", "background-opacity": 0, "border-width": 0, "label": "", "padding": "0px"
        }},
        // téma / oblast = velká bílá bublina: název (Space Grotesk) nahoře, popis (Darker Grotesque) pod ním
        { selector: "node[type='hub']", style: {
          "shape": "ellipse", "width": "data(size)", "height": "data(size)",
          "background-color": "#ffff00", "color": "#0a0a0c", "border-width": 0,
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "data(textw)",
          "text-valign": "center", "text-halign": "center", "text-margin-y": "data(tm)",
          "font-family": "Space Grotesk, Inter, sans-serif", "font-size": "22px", "font-weight": "600", "line-height": HUB_LH,
          "z-index": 5
        }},
        { selector: "node[type='hubdesc']", style: {
          "events": "no", "shape": "ellipse", "width": 1, "height": 1, "background-opacity": 0, "border-width": 0,
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "data(textw)",
          "text-valign": "center", "text-halign": "center", "text-margin-y": "data(tm)",
          "color": "#2a2a00", "font-family": "Darker Grotesque, Inter, sans-serif", "font-size": "14px", "font-weight": "500", "line-height": DESC_LH,
          "z-index": 6
        }},
        // podoblast = střední bublina
        { selector: "node[type='subhub']", style: {
          "shape": "ellipse", "width": "data(size)", "height": "data(size)",
          "background-color": "#ffffff", "color": "#0a0a0c", "border-width": 0,
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "data(textw)",
          "text-valign": "center", "text-halign": "center",
          "font-family": "Space Grotesk, Inter, sans-serif", "font-size": "data(fontsize)", "font-weight": "600", "line-height": 1.2
        }},
        // vlákno od tématu / podoblasti ke kořenovým konceptům
        { selector: "edge[etype='tree']", style: {
          "line-color": "rgba(255,255,255,0.55)", "width": 1, "line-style": "solid", "curve-style": "straight"
        }},
        { selector: "node[type='concept']", style: {
          "shape": "ellipse", "width": "data(size)", "height": "data(size)",
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "data(textw)",
          "text-valign": "center", "text-halign": "center", "line-height": LINEH,
          "font-size": "data(fontsize)", "font-weight": "400", "border-width": 1.5, "font-family": LEAF_FAMILY
        }},
        { selector: "node[vrstva='core']", style: { "background-color": "#ffffff", "color": "#0a0a0c", "border-width": 0 } },
        { selector: "node[vrstva='navazujici']", style: { "background-color": BG, "color": "#ffffff", "border-color": "#ffffff", "border-width": 1.8 } },
        // očekávaný výsledek učení (pohled RVP): informatika = plná bílá, provázaná kompetence / gramotnost = obrys
        { selector: "node[type='ovu']", style: {
          "shape": "ellipse", "width": "data(size)", "height": "data(size)",
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "data(textw)",
          "text-valign": "center", "text-halign": "center", "line-height": LINEH,
          "font-size": "data(fontsize)", "font-weight": "400", "font-family": LEAF_FAMILY,
          "background-color": "#ffffff", "color": "#0a0a0c", "border-width": 0
        }},
        { selector: "node[type='ovu'][strana='vazba']", style: { "background-color": BG, "color": "#ffffff", "border-color": "#ffffff", "border-width": 1.8 } },
        { selector: "edge[etype='prereq']", style: {
          "line-color": "rgba(255,255,255,0.45)", "width": 1.2, "line-style": "dashed", "curve-style": "bezier",
          "target-arrow-shape": "triangle", "target-arrow-color": "rgba(255,255,255,0.6)", "arrow-scale": 0.9
        }},
        { selector: "edge[etype='related']", style: {
          "line-color": "rgba(255,255,255,0.22)", "width": 0.9, "line-style": "dotted", "curve-style": "bezier"
        }},
        { selector: "edge.nbedge", style: { "line-color": "#ffff00", "width": 2.4, "target-arrow-color": "#ffff00", "opacity": 1, "z-index": 50 } },
        { selector: "node.nbon", style: { "border-color": "#ffff00", "border-width": 2.6, "z-index": 50 } },
        { selector: ".hl", style: { "border-width": 4, "border-color": "#ffff00", "border-opacity": 1 } },
        { selector: "node[type='concept']:selected, node[type='ovu']:selected, node[type='hub']:selected, node[type='subhub']:selected", style: { "border-width": 4, "border-color": "#ffff00" } },
        { selector: "node[type='ovu'][strana='inf']:selected", style: { "background-color": "#ffff00", "border-width": 0 } },
        { selector: "node.nbon[vrstva='core'], node[type='concept']:selected[vrstva='core']", style: { "background-color": "#ffff00", "color": "#0a0a0c", "border-width": 0 } },
        { selector: ".dim", style: { "opacity": 0.08 } },
        { selector: ".filtered", style: { "display": "none" } },
        /* hloubkové ponoření — mikrokoncepty pod konceptem */
        { selector: "node[type='microparent']", style: {
          "shape": "ellipse", "background-color": "#ffff00", "color": "#0a0a0c",
          "width": 128, "height": 128, "label": "data(label)", "text-wrap": "wrap",
          "text-max-width": "104px", "text-valign": "center", "text-halign": "center",
          "line-height": LINEH, "font-size": "13px", "font-weight": "600", "border-width": 0
        }},
        { selector: "node[type='micro']", style: {
          "shape": "round-rectangle", "background-color": BG, "color": "#ffffff",
          "border-color": "#ffff00", "border-width": 1.5, "width": 108, "height": 60,
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "94px",
          "text-valign": "center", "text-halign": "center", "line-height": LINEH, "font-size": "11px"
        }},
        { selector: "node[type='micro']:selected", style: { "background-color": "#ffff00", "color": "#0a0a0c", "border-width": 0 } },
        { selector: "edge[etype='microedge']", style: {
          "line-color": "rgba(255,255,0,0.5)", "width": 1.6, "curve-style": "bezier",
          "target-arrow-shape": "triangle", "target-arrow-color": "rgba(255,255,0,0.65)", "arrow-scale": 0.85
        }}
      ]
    });
    window.__cy = cy;
    initHubDrag(cy);

    /* tagy = dvě ortogonální facetové rodiny (viz data-readme):
       „povaha konceptu" (teoretický základ / praktická dovednost) a „optiky"
       (soukromí, etika, dopad na společnost…). Kanonické pořadí bereme z
       top-level `tagy[]`; zbytek = optiky. */
    const POVAHA = new Set(["teoretický základ", "praktická dovednost"]);
    const canon = (data.tagy || []).map((t) => t.tag);
    const used = new Set(data.concepts.flatMap((c) => c.tagy || []));
    // fallback: kdyby data neměla top-level tagy[], vezmi tagy z konceptů
    const all = canon.length ? canon.filter((t) => used.has(t))
      : [...used].sort((a, b) => a.localeCompare(b, "cs"));
    const optiky = all.filter((t) => !POVAHA.has(t));
    const povaha = all.filter((t) => POVAHA.has(t));
    buildChips("filter-tagy-optika", optiky.map((t) => ({ val: t, label: t })), "tagy", false);
    buildChips("filter-tagy-povaha", povaha.map((t) => ({ val: t, label: t })), "tagy", false);
    const tagBlock = document.getElementById("filter-tagy-block");
    if (tagBlock) tagBlock.hidden = !all.length;

    /* delegované klikání na chipy */
    document.getElementById("controls").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") === "true" ? "false" : "true");
      applyFilters();
    });
    document.getElementById("reset").addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c.dataset.filter === "tagy" ? "false" : "true"));
      document.getElementById("search").value = "";
      applyFilters();
    });
    document.getElementById("search").addEventListener("input", applySearch);

    /* „O mapě" — info panel */
    document.getElementById("about-btn").addEventListener("click", openAbout);
    document.getElementById("account-btn").addEventListener("click", () => (authed ? openAccount() : openLogin()));
    document.getElementById("export-btn").addEventListener("click", () => (authed ? openExport() : openLogin()));
    refreshHeadBtns();

    /* delegované akce v pravém panelu (admin/editor) */
    detailBody.addEventListener("click", onPanelAction);

    /* přepínač zobrazení (+ 3D pohled) */
    document.querySelectorAll(".vt-btn").forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.view;
      document.querySelectorAll(".vt-btn").forEach((x) => x.classList.toggle("active", x === b));
      if (v === "3d") { enter3D(); return; }
      const was3d = view3d;
      if (was3d) exit3D();
      if (v === viewMode) return;
      if (v === "rvp" && !RVP) {
        setStatus("Načítám RVP…");
        loadRvp().then(() => { if (!view3d) render("rvp"); }, (e) => setStatus("RVP se nepodařilo načíst: " + e.message));
        return;
      }
      render(v);
    }));

    /* breadcrumb pro hloubkové ponoření (překryv nad grafem) */
    const drillbar = document.createElement("div");
    drillbar.id = "km-drillbar"; drillbar.className = "km-drillbar hidden";
    drillbar.innerHTML = '<button data-act="drill-out" type="button">‹ Zpět na mapu</button><span class="km-drill-title"></span>';
    document.getElementById("cy").appendChild(drillbar);
    drillbar.querySelector("[data-act='drill-out']").addEventListener("click", drillOut);

    /* interakce grafu */
    cy.on("tap", "node", (evt) => {
      const t = evt.target.data("type");
      if (t === "micro") { openMicroDetail(evt.target.data("_m")); return; }
      if (t === "concept" && !drillId) { enterIso(evt.target); return; }
      if (t === "ovu") { openOvuDetail(evt.target.data("_o")); return; }
      openDetail(evt.target);
    });
    initIso();
    cy.on("tap", (evt) => {
      if (evt.target !== cy && !evt.target.isEdge()) return;   // klik do prázdna (čára = prázdno)
      if (editing) return;                          // rozdělaná úprava se klikem do plochy neztratí
      closeDetail();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { if (isoBoxOpen()) closeIsoBox(); else if (isoNode) exitIso(); else closeDetail(); }
    });

    // fonty bublin témat (Space Grotesk / Darker Grotesque) ať jsou načtené, než se popisky vykreslí
    const go = () => render("tema");
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go, go); else go();
    setStatus(statusText("tema"));
    loadRvp().catch(() => {});   // na pozadí: detail konceptu pak ukáže aktuální znění RVP a odkaz do pohledu RVP
  }

  function statusText(mode) {
    if (mode === "rvp" && RVP) {
      const p = RVP.meta.pocty;
      return (p.ovu1 + p.ovu2) + " výsledků učení Informatiky · " + p.kk + " klíčových kompetencí · " + p.zg + " gramotností";
    }
    const k = DATA.concepts.filter((c) => c.vrstva === "core").length;
    return k + " konceptů · " + (DATA.concepts.length - k) + " podkonceptů · " + DATA.temata.length + " oblastí";
  }

  /* ---------- Vykreslení režimu ---------- */
  let firstRender = true;
  function render(mode, opts) {
    if (isoNode) exitIso(true);
    viewMode = mode;
    drillId = null;                       // přepnutí pohledu vynoří z hloubky
    const dbar = document.getElementById("km-drillbar"); if (dbar) dbar.classList.add("hidden");
    closeDetail();
    cy.elements().remove();
    cy.add(buildElements(mode));
    buildGroupFilter(mode);
    document.getElementById("group-label").textContent = GROUP_LABEL[mode] || "Skupina";
    document.getElementById("controls").dataset.view = mode;
    document.getElementById("search").placeholder = mode === "rvp" ? "Hledej výsledek učení…" : "Hledej koncept…";
    if (DATA) setStatus(statusText(mode));
    radialLayout();
    applyFilters();
    cy.fit(cy.nodes(":visible"), 40);
    const animate = !(opts && opts.noAnim) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animate) burstIn();
    firstRender = false;
  }

  /* Radiální rozmístění: každé téma = velká bublina uprostřed, kořenové koncepty
     (bez prerekvizity v tématu) kolem ní, navazující koncepty dál od středu kolem
     své prerekvizity. Témata se pak balí k sobě po spirále. */
  function radialLayout() {
    const GAP = 14, STEP = 12;
    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    const pack = (items) => {
      const placed = []; let radius = 0;
      items.sort((a, b) => b.r - a.r).forEach((it) => {
        for (let t = 0; ; t++) {
          const x = Math.cos(t * GOLDEN) * STEP * Math.sqrt(t), y = Math.sin(t * GOLDEN) * STEP * Math.sqrt(t);
          if (placed.every((q) => Math.hypot(q.x - x, q.y - y) >= q.r + it.r + GAP)) {
            placed.push(Object.assign({ x, y }, it)); radius = Math.max(radius, Math.hypot(x, y) + it.r); break;
          }
        }
      });
      return { placed, radius };
    };
    const sizeR = (n) => (n.data("size") || 1) / 2;

    // Radiální strom: root v (0,0); děti na prstencích podle hloubky, výseče podle počtu listů,
    // nakonec odtlačení překryvů. `members` = uzly stromu (bez rootu), `rOf` = poloměr uzlu.
    const layoutTree = (root, members, rOf) => {
      const kids = {}; members.forEach((n) => { (kids[n.data("tp")] = kids[n.data("tp")] || []).push(n); });
      const leaves = {};
      const weigh = (id) => { const ch = kids[id] || []; leaves[id] = ch.length ? ch.reduce((a, c) => a + weigh(c.id()), 0) : 1; return leaves[id]; };
      weigh(root.id());
      const depth = {}; const ring = [];
      const walk = (id, d) => { (kids[id] || []).forEach((c) => { depth[c.id()] = d; (ring[d] = ring[d] || []).push(c); walk(c.id(), d + 1); }); };
      walk(root.id(), 1);
      // prstenec s mnoha uzly se rozloží do několika soustředných pásů (jinak by byl obří kruh teček)
      const PER_RING = 18;
      const R = [0], lanes = [1], laneStep = [0]; let prevMax = rOf(root);
      for (let d = 1; d < ring.length; d++) {
        const maxR = Math.max(...ring[d].map(rOf));
        lanes[d] = Math.max(1, Math.ceil(ring[d].length / PER_RING));
        laneStep[d] = 2 * maxR + GAP;
        const perim = ring[d].reduce((a, n) => a + 2 * rOf(n) + GAP, 0) / lanes[d];
        R[d] = Math.max(R[d - 1] + prevMax + maxR + GAP * 2.5, perim / (2 * Math.PI));
        prevMax = maxR + (lanes[d] - 1) * laneStep[d];
      }
      const pos = {}; const laneIdx = {};
      const place = (id, a0, a1) => {
        const ch = (kids[id] || []).slice().sort((a, b) => rOf(b) - rOf(a));
        const total = ch.reduce((a, c) => a + leaves[c.id()], 0) || 1;
        let a = a0;
        ch.forEach((c) => {
          const span = (a1 - a0) * leaves[c.id()] / total, mid = a + span / 2, d = depth[c.id()];
          const lane = (laneIdx[d] = (laneIdx[d] || 0) + 1) % lanes[d];
          const r = R[d] + lane * laneStep[d];
          pos[c.id()] = { x: Math.cos(mid) * r, y: Math.sin(mid) * r };
          place(c.id(), a, a + span); a += span;
        });
      };
      place(root.id(), -Math.PI / 2, 1.5 * Math.PI);
      const arr = members.toArray();
      for (let it = 0; it < 40; it++) {
        let moved = false;
        for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
          const a = pos[arr[i].id()], b = pos[arr[j].id()], need = rOf(arr[i]) + rOf(arr[j]) + GAP * 0.6;
          const dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy) || 0.01;
          if (dist < need) { const push = (need - dist) / 2, ux = dx / dist, uy = dy / dist; a.x -= ux * push; a.y -= uy * push; b.x += ux * push; b.y += uy * push; moved = true; }
        }
        arr.forEach((n) => { const q = pos[n.id()], need = rOf(root) + rOf(n) + GAP, dist = Math.hypot(q.x, q.y) || 0.01;
          if (dist < need) { q.x *= need / dist; q.y *= need / dist; moved = true; } });
        if (!moved) break;
      }
      const radius = Math.max(rOf(root), ...arr.map((n) => Math.hypot(pos[n.id()].x, pos[n.id()].y) + rOf(n)));
      return { pos, radius };
    };

    const groups = cy.nodes("[type='group']");
    const laid = groups.map((g) => {
      const hub = cy.getElementById(hubId(g.data("gid")));
      const pos = {};
      // podoblasti: každá je vlastní malý strom (bublina podoblasti + její koncepty) → disk
      const discR = {}, subPos = {};
      g.children("[type='sub']").forEach((sub) => {
        const shub = sub.children("[type='subhub']");
        const t = layoutTree(shub, sub.descendants(LEAF), sizeR);
        discR[shub.id()] = t.radius; subPos[shub.id()] = t.pos;
      });
      // téma: děti = disky podoblastí + koncepty mimo podoblasti (a jejich řetězy)
      const members = g.children(LEAF).union(g.children("[type='sub']").children("[type='subhub']"));
      const rOf = (n) => discR[n.id()] != null ? discR[n.id()] : sizeR(n);
      const t = layoutTree(hub, members, rOf);
      Object.assign(pos, t.pos);
      Object.keys(subPos).forEach((sid) => {
        const c = t.pos[sid];
        Object.keys(subPos[sid]).forEach((id) => { pos[id] = { x: c.x + subPos[sid][id].x, y: c.y + subPos[sid][id].y }; });
      });
      pos[hub.id()] = { x: 0, y: 0 };
      return { g, hub, pos, radius: t.radius };
    });
    const outer = pack(laid.map((l, i) => ({ i, r: l.radius + 30 })));
    outer.placed.forEach((o) => {
      const l = laid[o.i];
      Object.keys(l.pos).forEach((id) => cy.getElementById(id).position({ x: o.x + l.pos[id].x, y: o.y + l.pos[id].y }));
      cy.getElementById(hubdId(l.g.data("gid"))).position({ x: o.x, y: o.y });
    });
  }

  /* Při načtení se bubliny „rozprsknou": témata ze středu mapy, koncepty ze své bubliny tématu,
     s přestřelením (bounce). Cílové pozice už jsou spočítané; animace jen k nim doletí. */
  function burstIn() {
    const bb = cy.nodes(":visible").boundingBox(), cx = (bb.x1 + bb.x2) / 2, cy0 = (bb.y1 + bb.y2) / 2;
    const target = {}; cy.nodes("[type='hub'], [type='subhub'], " + LEAF).forEach((n) => target[n.id()] = Object.assign({}, n.position()));
    const EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";   // přestřelení = bounce (ease-out-back)
    cy.batch(() => {
      cy.nodes("[type='hub']").forEach((h) => h.position({ x: cx, y: cy0 }));
      cy.nodes("[type='subhub'], " + LEAF).forEach((n) => {
        const h = target[hubId(n.data("gid"))]; n.position({ x: h.x, y: h.y });
      });
    });
    cy.nodes("[type='hub']").forEach((h) => h.animate({ position: target[h.id()] }, { duration: 650, easing: EASE }));
    cy.nodes("[type='subhub'], " + LEAF).forEach((n) => {
      // vzdálenější od bubliny tématu letí později
      const h = target[hubId(n.data("gid"))], t = target[n.id()];
      const delay = 300 + Math.min(600, Math.hypot(t.x - h.x, t.y - h.y) * 0.9);
      n.delay(delay).animate({ position: t }, { duration: 750, easing: EASE });
    });
  }

  /* Tažení za bublinu tématu / podoblasti přesune celou její skupinu; popis tématu drží střed bubliny. */
  function initHubDrag(cy) {
    let last = null;
    cy.on("position", "node[type='hub']", (e) => {
      const d = cy.getElementById(hubdId(e.target.data("gid"))); if (d.nonempty()) d.position(e.target.position());
    });
    cy.on("grab", "node[type='hub'], node[type='subhub']", (e) => { last = Object.assign({}, e.target.position()); });
    cy.on("drag", "node[type='hub'], node[type='subhub']", (e) => {
      const n = e.target, p = n.position(); if (!last) { last = Object.assign({}, p); return; }
      const dx = p.x - last.x, dy = p.y - last.y; last = Object.assign({}, p);
      const grp = n.data("type") === "hub" ? cy.getElementById("grp-" + n.data("gid")) : cy.getElementById(subId(n.data("gid"), n.data("pid")));
      grp.descendants(LEAF + ", [type='subhub']").not(n).shift({ x: dx, y: dy });
    });
    cy.on("free", "node[type='hub'], node[type='subhub']", () => { last = null; });
  }

  function buildGroupFilter(mode) {
    const groups = groupDefs(mode);
    buildChips("filter-group", groups.map((g) => ({ val: g.id, label: typo(g.nazev) })), "group", true);
  }

  /* ---------- Filtry ---------- */
  function pressed(filter) {
    const s = new Set();
    document.querySelectorAll(`.chip[data-filter='${filter}'][aria-pressed='true']`).forEach((c) => s.add(c.dataset.val));
    return s;
  }
  function applyFilters() {
    const gr = pressed("group"), vr = pressed("vrstva"), st = pressed("stav"), tg = pressed("tagy");
    cy.batch(() => {
      cy.nodes("[type='concept']").forEach((n) => {
        const c = n.data("_c");
        const vis = gr.has(groupOf(c, viewMode)) && vr.has(c.vrstva) && st.has(n.data("stav")) &&
          (tg.size === 0 || (c.tagy || []).some((t) => tg.has(t)));
        n.toggleClass("filtered", !vis);
      });
      cy.nodes("[type='ovu']").forEach((n) => n.toggleClass("filtered", !gr.has(n.data("gid"))));
      cy.nodes("[type='group']").forEach((g) => {
        const empty = g.descendants(LEAF).filter((k) => !k.hasClass("filtered")).length === 0;
        g.toggleClass("filtered", empty || !gr.has(g.data("gid")));
      });
      cy.nodes("[type='sub']").forEach((s) => {
        s.toggleClass("filtered", s.parent().hasClass("filtered") || s.children(LEAF).filter((k) => !k.hasClass("filtered")).length === 0);
      });
      cy.nodes("[type='hub'], [type='hubdesc'], [type='subhub']").forEach((h) => h.toggleClass("filtered", h.parent().hasClass("filtered")));
      cy.edges().forEach((e) => e.toggleClass("filtered", e.source().hasClass("filtered") || e.target().hasClass("filtered")));
    });
    applySearch();
  }

  /* Zvýraznění sousedství (proti „chuchvalci"): ztlum vše kromě uzlu a jeho vazeb */
  function focusNb(node) {
    const nb = node.closedNeighborhood();
    cy.batch(() => {
      cy.elements().removeClass("nbedge nbon");
      node.connectedEdges().addClass("nbedge");   // vazby zežloutnou
      nb.nodes().addClass("nbon");                // sousedé dostanou žlutý prstenec
    });
  }
  function clearNb() { if (cy) cy.batch(() => cy.elements().removeClass("nbedge nbon")); }
  function applySearch() {
    const q = document.getElementById("search").value.trim().toLowerCase();
    cy.batch(() => {
      cy.nodes(LEAF).forEach((n) => {
        if (n.hasClass("filtered")) { n.removeClass("dim hl"); return; }
        if (!q) { n.removeClass("dim hl"); return; }
        const c = n.data("_c"), o = n.data("_o");
        const hit = !!(n.data("label").toLowerCase().includes(q) || (c && (c.popis || "").toLowerCase().includes(q)) ||
          (o && (o.zneni + " " + o.kod).toLowerCase().includes(q)));   // boolean: toggleClass s undefined by třídu přepnul
        n.toggleClass("hl", hit); n.toggleClass("dim", !hit);
      });
      cy.edges().forEach((e) => {
        if (e.hasClass("filtered")) return;
        const both = e.source().hasClass("hl") && e.target().hasClass("hl");
        e.toggleClass("dim", !!q && !both);
      });
    });
  }

  /* ---------- Detail panel ---------- */
  const detail = document.getElementById("detail");
  const detailBody = document.getElementById("detail-body");
  document.getElementById("detail-close").addEventListener("click", closeDetail);
  function closeDetail() { detail.classList.add("hidden"); pinned = null; clearNb(); if (cy) cy.$(":selected").unselect(); }

  /* „O mapě" — text z data/o-mape.md vykreslený do pravého panelu */
  let aboutCache = null;
  const mdInline = (t) => typo(t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
  function renderAbout(md) {
    let html = '<span class="d-badge d-badge-acc">O mapě</span>';
    let para = [], list = [], inSec = false;
    const flushPara = () => { if (para.length) { html += `<p class="d-desc" style="margin-bottom:12px">${mdInline(para.join(" "))}</p>`; para = []; } };
    const flushList = () => { if (list.length) { html += `<ul class="d-list">${list.map((li) => `<li>${mdInline(li)}</li>`).join("")}</ul>`; list = []; } };
    const flush = () => { flushPara(); flushList(); };
    md.split(/\r?\n/).forEach((raw) => {
      const line = raw.trim();
      if (!line) { flush(); return; }
      if (line.startsWith("## ")) { flush(); if (inSec) html += "</div>"; html += `<div class="d-section"><h3>${esc(line.slice(3))}</h3>`; inSec = true; }
      else if (line.startsWith("# ")) { flush(); html += `<h2 class="d-title">${esc(line.slice(2))}</h2>`; }
      else if (line.startsWith("- ")) { flushPara(); list.push(line.slice(2)); }
      else { flushList(); para.push(line); }
    });
    flush(); if (inSec) html += "</div>";
    return html;
  }
  function openAbout() {
    editing = false;
    if (cy) cy.$(":selected").unselect();
    pinned = null; clearNb();
    const show = (h) => { detailBody.innerHTML = h; detail.classList.remove("hidden"); detail.scrollTop = 0; };
    if (aboutCache) { show(aboutCache); return; }
    fetch("data/Informatika/o-mape.md?v=7")
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then((md) => { aboutCache = renderAbout(md); show(aboutCache); })
      .catch((e) => show(`<h2 class="d-title">O mapě</h2><p class="d-desc">Nepodařilo se načíst text (${esc(e.message)}).</p>`));
  }

  /* ---------- Admin / editor ---------- */
  // ikonky vlevo nahoře: účet (plná = přihlášen) a export (jen po přihlášení)
  function refreshHeadBtns() {
    const a = document.getElementById("account-btn"), x = document.getElementById("export-btn");
    if (!a || !x) return;
    a.classList.toggle("on", authed);
    a.title = a.ariaLabel = authed ? `Účet: ${adminLogin} (${ROLE[adminRole] || adminRole})` : "Přihlásit se";
    x.classList.toggle("hidden", !authed);
  }
  function openPanel(html) {
    editing = false;
    if (cy) cy.$(":selected").unselect();
    pinned = null; clearNb();
    detailBody.innerHTML = html; detail.classList.remove("hidden"); detail.scrollTop = 0;
  }
  // panel účtu: kdo je přihlášen, úpravy, správa uživatelů, odhlášení
  function openAccount() {
    const status = supabaseOk
      ? `Změny se ukládají <strong>živě do Supabase</strong> (uvidí je všichni).`
      : `⚠️ <strong>Supabase je teď nedostupné</strong> — změny se uloží jen lokálně do tohoto prohlížeče.`;
    openPanel(`
      <span class="d-badge d-badge-acc">Účet</span>
      <h2 class="d-title">${esc(adminName || adminLogin || "?")}</h2>
      <div class="d-meta"><span class="d-pill">${esc(adminLogin || "?")}</span><span class="d-pill core">${esc(ROLE[adminRole] || adminRole)}</span></div>
      <p class="d-desc">${canWrite() ? "Klikni na koncept v mapě a uprav ho, nebo přidej nový. " + status : "Tenhle účet mapu neupravuje, může stahovat exporty — i jednotlivých oblastí (ikonka ⬇ vlevo nahoře)."}</p>
      ${canWrite() ? '<div class="d-links"><button class="km-primary" data-act="add-concept">➕ Přidat koncept</button></div>' : ""}
      ${adminRole === "admin" ? '<div class="d-links" style="margin-top:8px"><button class="km-primary" data-act="editors">👥 Uživatelé</button></div>' : ""}
      <div class="d-links" style="margin-top:8px"><button class="km-primary" data-act="open-export">⬇ Export</button><button class="d-link" data-act="logout">Odhlásit</button></div>`);
  }
  // panel exportu: výběr témat + YAML / concepts.json
  function openExport() {
    openPanel(`
      <span class="d-badge d-badge-acc">Export</span>
      <h2 class="d-title">Stáhnout YAML / JSON</h2>
      <div class="ed-field"><label>Které oblasti</label>
        <div class="ex-tools"><button class="d-link" data-act="export-all">všechna</button><button class="d-link" data-act="export-none">žádné</button></div>
        <div class="ex-list">${(DATA.temata || []).map((t) =>
          `<label class="ex-item"><input type="checkbox" class="ex-tema" value="${esc(t.id)}" checked> ${esc(t.nazev)} <span class="ex-n">${DATA.concepts.filter((c) => c.tema === t.id).length}</span></label>`).join("")}</div>
      </div>
      <div class="d-links">
        <button class="km-primary" data-act="export">⬇ YAML</button>
        <button class="km-primary" data-act="export-json">⬇ concepts.json</button>
      </div>
      <p class="d-empty" style="margin-top:10px">Se všemi oblastmi export vygeneruje celé soubory ke commitu na GitHub (YAML je základ mapy, <code>concepts.json</code> čte i chatbot Glitchee). S výběrem oblastí vznikne výřez; u jedné oblasti dostane soubor název zálohy podle klíče <code>datum_Oblast_Jméno_01</code> (pořadové číslo si upravte).</p>`);
  }

  /* ---------- Správa editorů (jen admin) ---------- */
  let editorsCache = [];
  // heslo pro nového uživatele: 12 znaků bez zaměnitelných (0/O, 1/l/I)
  function generatePassword() {
    const abc = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const a = new Uint32Array(12); crypto.getRandomValues(a);
    return Array.from(a, (x) => abc[x % abc.length]).join("");
  }
  async function openEditors(editEmail, note) {
    editing = false;
    const badge = '<span class="d-badge d-badge-acc">Uživatelé</span>';
    detailBody.innerHTML = badge + '<p class="d-desc">Načítám…</p>';
    detail.classList.remove("hidden"); detail.scrollTop = 0;
    let list = [];
    try { list = (await window.KM.listEditors(adminLogin, adminSecret)) || []; }
    catch (e) {
      detailBody.innerHTML = badge + '<p class="d-desc km-danger">' + esc((e && e.message) || "Nepodařilo se načíst.") + '</p>' +
        '<div class="ed-actions"><button class="reset-btn" data-act="editors-back">Zpět</button></div>';
      return;
    }
    editorsCache = list;
    const u0 = editEmail ? list.find((u) => u.email === editEmail) : null;   // upravovaný uživatel
    const rows = list.length
      ? '<div class="us-list">' + list.map((u) => '<div class="us-row' + (u0 && u0.email === u.email ? ' us-active' : '') + '">' +
          '<div class="us-who"><div class="us-name">' + esc(u.name || "—") + '</div><div class="us-mail">' + esc(u.email) + '</div></div>' +
          '<span class="d-pill us-role role-' + esc(u.role) + '">' + esc(ROLE[u.role] || u.role) + '</span>' +
          '<button class="d-link us-edit" data-act="editor-edit" data-email="' + esc(u.email) + '" title="Upravit">✎</button>' +
          '<button class="mc-del" data-act="editor-del" data-email="' + esc(u.email) + '" title="Smazat">✕</button></div>').join("") + '</div>'
      : '<span class="d-empty">zatím žádní další uživatelé</span>';
    const roleOpts = Object.keys(ROLE).map((r) => '<option value="' + r + '"' + ((u0 ? u0.role : "editor") === r ? ' selected' : '') + '>' + esc(ROLE[r]) + '</option>').join("");
    // po uložení ukázat heslo (nikde jinde už nejde přečíst)
    const noteHtml = note ? '<div class="us-note">' + esc(note.text) + (note.pass
      ? '<br>Heslo: <code id="us-pass">' + esc(note.pass) + '</code> <button class="d-link" data-act="copy-pass">Kopírovat</button><br><span class="d-empty">Pošli ho uživateli — po zavření panelu už ho nikde neuvidíš.</span>' : '') + '</div>' : "";
    detailBody.innerHTML = badge + noteHtml +
      '<p class="d-desc">Admin upravuje mapu i uživatele, editor (garant, konzultant) upravuje mapu, čtenář mapu neupravuje a jen stahuje exporty. Uživatel se přihlásí e-mailem a heslem.</p>' +
      '<div class="d-section"><h3>Uživatelé (' + list.length + ')</h3>' + rows + '</div>' +
      '<div class="d-section" id="us-form"><h3>' + (u0 ? 'Upravit: ' + esc(u0.name || u0.email) : 'Přidat uživatele') + '</h3>' +
      '<div class="ed-field"><label>E-mail *</label><input id="ed-email" type="email" placeholder="jmeno@domena.cz" autocomplete="off" value="' + esc(u0 ? u0.email : "") + '"' + (u0 ? ' readonly' : '') + '></div>' +
      '<div class="ed-field"><label>Jméno</label><input id="ed-name" placeholder="Jméno Příjmení" autocomplete="off" value="' + esc(u0 ? (u0.name || "") : "") + '"></div>' +
      '<div class="ed-field"><label>' + (u0 ? 'Nové heslo (nech prázdné, pokud se nemění)' : 'Heslo *') + '</label>' +
      '<div class="ed-pass"><input id="ed-pass" placeholder="min. 6 znaků" autocomplete="off" value="' + (u0 ? '' : esc(generatePassword())) + '"><button class="d-link" data-act="gen-pass" title="Vygenerovat nové heslo">🎲 Vygenerovat</button></div></div>' +
      '<div class="ed-field"><label>Role</label><select id="ed-role">' + roleOpts + '</select></div>' +
      '<div class="ed-actions"><button class="reset-btn" data-act="' + (u0 ? 'editors' : 'editors-back') + '">' + (u0 ? 'Zrušit' : 'Zpět') + '</button>' +
      '<button class="km-primary" data-act="editor-add" data-mode="' + (u0 ? 'update' : 'add') + '">' + (u0 ? 'Uložit změny' : 'Přidat uživatele') + '</button></div></div>';
    if (u0) document.getElementById("us-form").scrollIntoView({ block: "nearest" });
  }

  async function addEditorSubmit(mode) {
    const email = (document.getElementById("ed-email").value || "").trim();
    const name = (document.getElementById("ed-name").value || "").trim();
    const pass = document.getElementById("ed-pass").value || "";
    const role = document.getElementById("ed-role").value;
    if (!email || email.indexOf("@") < 0) { alert("Zadej platný e-mail."); return; }
    if (pass && pass.length < 6) { alert("Heslo musí mít aspoň 6 znaků."); return; }
    try {
      if (mode === "update") {
        await window.KM.updateEditor(adminLogin, adminSecret, email, name, role, pass || null);
        openEditors(null, { text: "Uloženo: " + (name || email) + (pass ? " — nové heslo:" : ""), pass: pass || "" });
      } else {
        if (!pass) { alert("Novému uživateli zadej heslo."); return; }
        await window.KM.addEditor(adminLogin, adminSecret, email, pass, name, role);
        openEditors(null, { text: "Uživatel " + (name || email) + " (" + email + ") přidán.", pass: pass });
      }
    } catch (e) {
      const m = (e && e.message) || String(e);
      alert(/could not find the function|km_update_editor|PGRST202|404/i.test(m)
        ? "Na serveru chybí funkce pro úpravu uživatele — je potřeba spustit migraci 2026-10-25-mapa-uprava-uzivatele.sql v Supabase."
        : "Uložení selhalo: " + m);
    }
  }

  function removeEditorAct(email) {
    if (!email || !confirm("Opravdu smazat uživatele " + email + "?")) return;
    window.KM.removeEditor(adminLogin, adminSecret, email).then(openEditors)
      .catch((e) => alert("Smazání selhalo: " + ((e && e.message) || e)));
  }

  function onPanelAction(e) {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const act = b.dataset.act, id = b.dataset.id;
    if (act === "login") openLogin();
    else if (act === "logout") { authed = false; adminSecret = ""; adminLogin = ""; adminRole = ""; adminName = ""; ["km-auth","km-secret","km-login","km-role","km-name"].forEach((k) => sessionStorage.removeItem(k)); refreshHeadBtns(); closeDetail(); }
    else if (act === "open-export") openExport();
    else if (act === "editors") openEditors();
    else if (act === "editor-add") addEditorSubmit(b.dataset.mode);
    else if (act === "editor-edit") openEditors(b.dataset.email);
    else if (act === "gen-pass") document.getElementById("ed-pass").value = generatePassword();
    else if (act === "copy-pass") { const t = document.getElementById("us-pass").textContent; navigator.clipboard.writeText(t).then(() => { b.textContent = "Zkopírováno"; }).catch(() => { alert("Heslo: " + t); }); }
    else if (act === "editor-del") removeEditorAct(b.dataset.email);
    else if (act === "editors-back") openAccount();
    else if (act === "export") exportYAML(exportTemata());
    else if (act === "export-json") exportConceptsJson(exportTemata());
    else if (act === "export-all" || act === "export-none") document.querySelectorAll(".ex-tema").forEach((x) => x.checked = act === "export-all");
    else if (act === "discard") discardEdits();
    else if (act === "edit") openEditor(id);
    else if (act === "edit-cancel") openDetail(cy.getElementById(id));
    else if (act === "edit-save") saveEditor(id);
    else if (act === "add-concept") openAddConcept();
    else if (act === "add-cancel") openAccount();
    else if (act === "add-save") saveNewConcept();
    else if (act === "add-prereq") addLinkChip("prereq");
    else if (act === "add-souvisi") addLinkChip("souvisi");
    else if (act === "del-chip") { const ch = b.closest(".ed-chip"); if (ch) ch.remove(); }
    else if (act === "dive") drillInto(id);
    else if (act === "drill-out") drillOut();
    else if (act === "micro-open") openMicroDetail(findMicro(b.dataset.micro));
    else if (act === "micro-add") openAddMicro(id);
    else if (act === "edit-then-micro") { saveEditor(id); openAddMicro(id); }   // ulož koncept, pak přidej mikrokoncept
    else if (act === "micro-cancel") openDetail(cy.getElementById(id));
    else if (act === "micro-save") saveNewMicro(id);
    else if (act === "micro-edit") openEditMicro(b.dataset.micro);
    else if (act === "micro-edit-save") saveEditMicro(b.dataset.micro);
    else if (act === "micro-edit-cancel") openMicroDetail(findMicro(b.dataset.micro));
    else if (act === "del-micro") deleteMicro(b.dataset.micro);
    else if (act === "add-cile") document.getElementById("ed-cile").insertAdjacentHTML("beforeend", cileRow({}));
    else if (act === "add-krit") document.getElementById("ed-kriteria").insertAdjacentHTML("beforeend", kritRow({}));
    else if (act === "del-row") { const r = b.closest(".ed-row"); if (r) r.remove(); }
  }

  /* přihlašovací modál (vytvoří se jednou) */
  function ensureLoginModal() {
    if (document.getElementById("km-login")) return;
    const d = document.createElement("div");
    d.id = "km-login"; d.className = "km-modal hidden";
    d.innerHTML = `<div class="km-card">
      <h3>Přihlášení do editoru</h3>
      <label>E-mail (nebo aidetem)</label><input id="km-user" autocomplete="username" spellcheck="false" placeholder="jmeno@domena.cz">
      <label>Heslo</label><input id="km-pass" type="password" autocomplete="current-password">
      <div class="km-err" id="km-err"></div>
      <div class="km-actions">
        <button class="reset-btn" id="km-cancel">Zrušit</button>
        <button class="km-primary" id="km-submit">Přihlásit</button>
      </div>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("mousedown", (e) => { if (e.target === d) closeLogin(); });
    d.querySelector("#km-cancel").addEventListener("click", closeLogin);
    d.querySelector("#km-submit").addEventListener("click", submitLogin);
    d.querySelector("#km-pass").addEventListener("keydown", (e) => { if (e.key === "Enter") submitLogin(); });
  }
  function openLogin() {
    ensureLoginModal();
    const m = document.getElementById("km-login");
    m.classList.remove("hidden");
    document.getElementById("km-err").textContent = "";
    document.getElementById("km-user").value = "";
    document.getElementById("km-pass").value = "";
    document.getElementById("km-user").focus();
  }
  function closeLogin() { const m = document.getElementById("km-login"); if (m) m.classList.add("hidden"); }
  async function submitLogin() {
    const u = document.getElementById("km-user").value.trim();
    const p = document.getElementById("km-pass").value;
    const err = document.getElementById("km-err");
    err.textContent = "Přihlašuji…";
    try {
      if (!window.KM) throw new Error("Server (Supabase) není dostupný.");
      const res = await window.KM.login(u, p);
      if (!res || !res.ok) { err.textContent = "Špatný login nebo heslo."; return; }
      authed = true; adminLogin = res.login || u; adminSecret = p; adminRole = res.role || "editor"; adminName = res.name || "";
      sessionStorage.setItem("km-auth", "1"); sessionStorage.setItem("km-secret", p);
      sessionStorage.setItem("km-login", adminLogin); sessionStorage.setItem("km-role", adminRole); sessionStorage.setItem("km-name", adminName);
      closeLogin(); refreshHeadBtns(); openAccount();
    } catch (e) {
      const m = (e && e.message) || "";
      err.textContent = /could not find the function|km_login|PGRST202|404/i.test(m)
        ? "Na serveru chybí přihlašovací funkce — je potřeba spustit migraci 2026-08-22-mapa-editori.sql v Supabase."
        : (m || "Přihlášení selhalo.");
    }
  }

  /* editační formulář */
  // allowEmpty: kritéria můžou být i bez úrovně (garanti je podle úrovní nedělí)
  const levelSelect = (sel, allowEmpty) => `<select class="ed-lvl">${
    (allowEmpty ? `<option value=""${sel ? "" : " selected"}>— bez úrovně —</option>` : "") +
    BLOOM.map(([v, l]) => `<option value="${v}"${v === sel ? " selected" : ""}>${l}</option>`).join("")}</select>`;
  // ročník je číslo, nebo rozsah od garanta („6–7")
  const rocnikVal = (v) => (/^\d+$/.test(v.trim()) ? Number(v) : v.trim());
  const cileRow = (it) => `<div class="ed-row"><div class="ed-row-head">${levelSelect(it.uroven)}<input class="ed-roc" type="text" inputmode="numeric" placeholder="roč." value="${it.rocnik != null ? esc(it.rocnik) : ""}"><button class="ed-x" data-act="del-row" title="Smazat">✕</button></div><textarea class="ed-text" rows="2" placeholder="Text cíle">${esc(it.text || "")}</textarea></div>`;
  const kritRow = (it) => `<div class="ed-row"><div class="ed-row-head">${levelSelect(it.uroven, true)}<button class="ed-x" data-act="del-row" title="Smazat">✕</button></div><textarea class="ed-text" rows="2" placeholder="Text kritéria">${esc(it.text || "")}</textarea></div>`;
  const readKriteria = () => [...document.querySelectorAll("#ed-kriteria .ed-row")].map((r) => {
    const o = { text: r.querySelector(".ed-text").value.trim() };
    const lvl = r.querySelector(".ed-lvl").value; if (lvl) o.uroven = lvl;
    return o;
  }).filter((o) => o.text);

  // chip pro vybraný koncept (prerekvizita / souvisí), datalist všech konceptů a picker
  const chipHtml = (id) => { const c = conceptById[id]; return '<span class="ed-chip" data-id="' + esc(id) + '">' + esc(c ? c.nazev : id) + '<button class="ed-chip-x" data-act="del-chip" aria-label="Odebrat">✕</button></span>'; };
  const dataListHtml = () => '<datalist id="km-concept-list">' + DATA.concepts.map((c) => '<option value="' + esc(c.nazev) + '">').join("") + '</datalist>';
  const linkPicker = (label, kind, ids) =>
    '<div class="ed-field"><label>' + label + '</label>' +
    '<div class="ed-pick"><input id="add-' + kind + '-input" list="km-concept-list" placeholder="hledej koncept…"><button class="d-link" data-act="add-' + kind + '">+ přidat</button></div>' +
    '<div id="add-' + kind + '" class="ed-chips">' + (ids || []).map(chipHtml).join("") + '</div></div>';
  const microEditList = (c) => {
    const micros = c._micros || [];
    return micros.length
      ? micros.map((m) => '<div class="mc-row"><span class="mc-name">' + esc(m.nazev || m.id) + '</span><button class="mc-del" data-act="del-micro" data-micro="' + esc(m.id) + '" title="Smazat">✕</button></div>').join("")
      : '<span class="d-empty">zatím žádné</span>';
  };

  function openEditor(id) {
    const c = conceptById[id];
    if (!c) return;
    editing = true; pinned = null; clearNb();
    detailBody.innerHTML = `
      <span class="d-badge d-badge-acc">Úprava konceptu</span>
      <div class="ed-field"><label>Název</label><input id="ed-nazev" value="${esc(c.nazev)}"></div>
      <div class="ed-field"><label>Popis</label><textarea id="ed-popis" rows="4">${esc(c.popis || "")}</textarea></div>
      <div class="ed-field"><label>Vrstva</label><select id="ed-vrstva">
        <option value="core"${c.vrstva === "core" ? " selected" : ""}>Koncept</option>
        <option value="navazujici"${c.vrstva === "navazujici" ? " selected" : ""}>Podkoncept</option>
      </select></div>
      ${podoblastiOf(c.tema).length ? `<div class="ed-field"><label>Podoblast</label><select id="ed-podoblast">
        <option value=""${!c.podoblast ? " selected" : ""}>— bez podoblasti —</option>
        ${podoblastiOf(c.tema).map((p) => `<option value="${esc(p.id)}"${c.podoblast === p.id ? " selected" : ""}>${esc(p.nazev)}</option>`).join("")}
      </select></div>` : ""}
      <div class="ed-field"><label>Vzdělávací cíle</label><div id="ed-cile">${(c.cile || []).map(cileRow).join("")}</div>
        <button class="d-link ed-add" data-act="add-cile">+ Přidat cíl</button></div>
      <div class="ed-field"><label>Kritéria hodnocení</label><div id="ed-kriteria">${(c.kriteria || []).map(kritRow).join("")}</div>
        <button class="d-link ed-add" data-act="add-krit">+ Přidat kritérium</button></div>
      <div class="ed-field"><label>Důraz (na co si dát pozor, časté omyly)</label><textarea id="ed-duraz" rows="4">${esc(c.duraz || "")}</textarea></div>
      ${linkPicker("Prerekvizity (co má předcházet)", "prereq", c.prerekvizity)}
      ${linkPicker("Souvisí s", "souvisi", c.souvisi)}
      <div class="ed-field"><label>Mikrokoncepty</label>${microEditList(c)}
        <button class="d-link ed-add" data-act="edit-then-micro" data-id="${esc(id)}">➕ Přidat mikrokoncept</button></div>
      ${dataListHtml()}
      <div class="ed-field"><label>Stav rozpracování</label>${stavSelect("ed-stav", c.stav)}</div>
      <div class="ed-actions">
        <button class="reset-btn" data-act="edit-cancel" data-id="${esc(id)}">Zrušit</button>
        <button class="km-primary" data-act="edit-save" data-id="${esc(id)}">Uložit</button>
      </div>`;
    detail.classList.remove("hidden"); detail.scrollTop = 0;
  }

  function saveEditor(id) {
    const c = conceptById[id];
    if (!c) return;
    c.nazev = (document.getElementById("ed-nazev").value.trim()) || c.nazev;
    c.popis = document.getElementById("ed-popis").value.trim();
    c.vrstva = document.getElementById("ed-vrstva").value;
    const edPod = document.getElementById("ed-podoblast");
    if (edPod) c.podoblast = edPod.value || null;
    c.cile = [...document.querySelectorAll("#ed-cile .ed-row")].map((r) => {
      const o = { uroven: r.querySelector(".ed-lvl").value, text: r.querySelector(".ed-text").value.trim() };
      const roc = r.querySelector(".ed-roc").value; if (roc) o.rocnik = rocnikVal(roc);
      return o;
    }).filter((o) => o.text);
    c.kriteria = readKriteria();
    c.duraz = document.getElementById("ed-duraz").value.trim();
    // vazby: jen na existující koncepty (bez visících odkazů a bez odkazu na sebe)
    const validIds = new Set(DATA.concepts.map((x) => x.id));
    const readLinks = (sel) => [...new Set([...document.querySelectorAll(sel + " .ed-chip")].map((ch) => ch.dataset.id))]
      .filter((x) => x && x !== id && validIds.has(x));
    c.prerekvizity = readLinks("#add-prereq");
    c.souvisi = readLinks("#add-souvisi");
    c.stav = document.getElementById("ed-stav").value;

    /* uložit — Supabase (živě pro všechny), jinak lokálně jako záloha */
    const patch = {}; EDITABLE.forEach((k) => patch[k] = c[k]);
    if (supabaseOk && window.KM) {
      window.KM.saveOverride(adminLogin, adminSecret, id, patch)
        .catch((e) => alert("Uložení do Supabase selhalo: " + ((e && e.message) || e)));
    } else {
      const ov = loadEdits(); ov[id] = patch; saveEdits(ov);
    }

    /* vazby se mohly změnit → přepočítej reverzní indexy a překresli graf (hrany) */
    buildRevIndexes();
    editing = false;
    render(viewMode);
    const n = cy.getElementById(id);
    if (n && n.nonempty()) openDetail(n);
  }

  function download(name, text, mime) {
    const blob = new Blob([text], { type: (mime || "text/plain") + ";charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // zaškrtnutá témata v bloku Export; null = všechna (celý soubor)
  function exportTemata() {
    const boxes = [...document.querySelectorAll(".ex-tema")];
    if (!boxes.length) return null;
    const sel = boxes.filter((b) => b.checked).map((b) => b.value);
    if (!sel.length) { alert("Vyber aspoň jednu oblast."); return undefined; }
    return sel.length === boxes.length ? null : sel;
  }
  // Název souboru: celá mapa = knowledge-map.yaml / concepts.json; výřez jednoho tématu = záloha
  // podle klíče garantů „2026-10-11_Název oblasti_Jméno garanta_01" (pořadové číslo si garant upraví);
  // víc témat = knowledge-map.programovani+data-databaze.yaml
  function exportName(base, ext, temata) {
    if (!temata) return base + ext;
    if (temata.length === 1) {
      const t = (DATA.temata || []).find((x) => x.id === temata[0]) || {};
      const jmeno = (adminName || (adminLogin || "").split("@")[0] || "garant").replace(/[\\/:*?"<>|]/g, "");
      return new Date().toISOString().slice(0, 10) + "_" + (t.nazev || temata[0]) + "_" + jmeno + "_01" + ext;
    }
    return base + "." + temata.join("+") + ext;
  }

  function exportYAML(temata) {
    if (temata === undefined) return;
    try {
      // vyhoď přechodná pole (začínají „_", např. _micros) — do YAML nepatří
      const clean = JSON.parse(JSON.stringify(DATA, (k, v) => (k.charAt(0) === "_" ? undefined : v)));
      if (temata) {
        // výřez: jen vybraná témata a jejich koncepty; vazby na koncepty mimo výřez zůstávají jako id
        clean.temata = (clean.temata || []).filter((t) => temata.includes(t.id));
        clean.concepts = (clean.concepts || []).filter((c) => temata.includes(c.tema));
        clean.meta = Object.assign({}, clean.meta, { vyrez: temata, poznamka_vyrez: "Výřez mapy — jen vybrané oblasti. Vazby (prerekvizity, souvisí) mohou mířit na koncepty mimo výřez." });
      }
      download(exportName("knowledge-map", ".yaml", temata), jsyaml.dump(clean, { lineWidth: 1000, noRefs: true, sortKeys: false }), "text/yaml");
    } catch (e) { alert("Export selhal: " + e.message); }
  }

  // concepts.json = mapa id → { nazev, popis, cile, kriteria } (čte ji i chatbot)
  function exportConceptsJson(temata) {
    if (temata === undefined) return;
    try {
      const out = {};
      DATA.concepts.filter((c) => !temata || temata.includes(c.tema))
        .forEach((c) => { out[c.id] = { nazev: c.nazev, popis: c.popis || "", cile: c.cile || [], kriteria: c.kriteria || [] }; });
      download(exportName("concepts", ".json", temata), JSON.stringify(out, null, 1), "application/json");
    } catch (e) { alert("Export selhal: " + e.message); }
  }

  /* ---------- Přidání nového konceptu ---------- */
  const nameToId = (name) => {
    const n = (name || "").trim().toLowerCase();
    const hit = DATA.concepts.find((c) => (c.nazev || "").trim().toLowerCase() === n);
    return hit ? hit.id : null;
  };
  function addLinkChip(kind) {
    const input = document.getElementById(kind === "prereq" ? "add-prereq-input" : "add-souvisi-input");
    const cont = document.getElementById(kind === "prereq" ? "add-prereq" : "add-souvisi");
    if (!input || !cont) return;
    const id = nameToId(input.value);
    if (!id) { input.focus(); input.select(); return; }
    if (cont.querySelector('[data-id="' + id + '"]')) { input.value = ""; return; }
    const c = conceptById[id];
    cont.insertAdjacentHTML("beforeend",
      '<span class="ed-chip" data-id="' + esc(id) + '">' + esc(c ? c.nazev : id) +
      '<button class="ed-chip-x" data-act="del-chip" aria-label="Odebrat">✕</button></span>');
    input.value = ""; input.focus();
  }

  function openAddConcept() {
    editing = true; pinned = null; if (typeof clearNb === "function") clearNb();
    const opt = (v, l, sel) => '<option value="' + esc(v) + '"' + (sel ? " selected" : "") + '>' + esc(l) + '</option>';
    const temaOpts = (DATA.temata || []).map((t) => opt(t.id, t.nazev)).join("");
    const dataList = '<datalist id="km-concept-list">' + DATA.concepts.map((c) => '<option value="' + esc(c.nazev) + '">').join("") + '</datalist>';
    detailBody.innerHTML = `
      <span class="d-badge d-badge-acc">Nový koncept</span>
      <div class="ed-field"><label>Název *</label><input id="add-nazev" placeholder="např. Rekurze"></div>
      <div class="ed-field"><label>Oblast *</label><select id="add-tema">${temaOpts}</select></div>
      <div class="ed-field"><label>Vrstva</label><select id="add-vrstva"><option value="core">Koncept</option><option value="navazujici" selected>Podkoncept</option></select></div>
      <div class="ed-field"><label>Stav rozpracování</label>${stavSelect("add-stav", "draft")}</div>
      <div class="ed-field"><label>Popis</label><textarea id="add-popis" rows="4" placeholder="Co koncept je…"></textarea></div>
      <div class="ed-field"><label>Vzdělávací cíle</label><div id="ed-cile"></div><button class="d-link ed-add" data-act="add-cile">+ Přidat cíl</button></div>
      <div class="ed-field"><label>Kritéria hodnocení</label><div id="ed-kriteria"></div><button class="d-link ed-add" data-act="add-krit">+ Přidat kritérium</button></div>
      <div class="ed-field"><label>Prerekvizity (co má předcházet)</label>
        <div class="ed-pick"><input id="add-prereq-input" list="km-concept-list" placeholder="hledej koncept…"><button class="d-link" data-act="add-prereq">+ přidat</button></div>
        <div id="add-prereq" class="ed-chips"></div></div>
      <div class="ed-field"><label>Souvisí s</label>
        <div class="ed-pick"><input id="add-souvisi-input" list="km-concept-list" placeholder="hledej koncept…"><button class="d-link" data-act="add-souvisi">+ přidat</button></div>
        <div id="add-souvisi" class="ed-chips"></div></div>
      ${dataList}
      <div class="ed-actions">
        <button class="reset-btn" data-act="add-cancel">Zrušit</button>
        <button class="km-primary" data-act="add-save">Vytvořit koncept</button>
      </div>`;
    detail.classList.remove("hidden"); detail.scrollTop = 0;
  }

  function saveNewConcept() {
    const nazev = (document.getElementById("add-nazev").value || "").trim();
    const tema = document.getElementById("add-tema").value;
    if (!nazev) { alert("Doplň název konceptu."); return; }
    if (!tema) { alert("Vyber téma."); return; }
    let id = tema + "-" + slug(nazev);
    if (!slug(nazev)) { alert("Název musí obsahovat písmena nebo číslice."); return; }
    if (conceptById[id]) { let i = 2; while (conceptById[id + "-" + i]) i++; id = id + "-" + i; }
    const rows = (sel) => [...document.querySelectorAll(sel + " .ed-row")];
    const cile = rows("#ed-cile").map((r) => {
      const o = { uroven: r.querySelector(".ed-lvl").value, text: r.querySelector(".ed-text").value.trim() };
      const roc = r.querySelector(".ed-roc") && r.querySelector(".ed-roc").value; if (roc) o.rocnik = rocnikVal(roc);
      return o;
    }).filter((o) => o.text);
    const kriteria = readKriteria();
    const chips = (sel) => [...document.querySelectorAll(sel + " .ed-chip")].map((ch) => ch.dataset.id);
    const c = normalizeConcept({
      id, nazev, tema,
      vrstva: document.getElementById("add-vrstva").value,
      popis: (document.getElementById("add-popis").value || "").trim(),
      cile, kriteria,
      prerekvizity: chips("#add-prereq"), souvisi: chips("#add-souvisi"),
      stav: document.getElementById("add-stav").value
    });
    if (supabaseOk && window.KM) {
      window.KM.addConcept(adminLogin, adminSecret, id, c).catch((e) => alert("Uložení do Supabase selhalo: " + ((e && e.message) || e)));
    } else {
      try { const nw = JSON.parse(localStorage.getItem(NEW_KEY) || "[]"); nw.push(c); localStorage.setItem(NEW_KEY, JSON.stringify(nw)); } catch (_) {}
    }
    DATA.concepts.push(c); conceptById[id] = c;
    (c.souvisi || []).forEach((s) => (revSouvisi[s] = revSouvisi[s] || []).push(id));
    (c.prerekvizity || []).forEach((p) => (revPrereq[p] = revPrereq[p] || []).push(id));
    editing = false;
    render(viewMode);
    focusNode(id);
  }

  /* zahodit lokální (localStorage) úpravy a načíst čistá data ze serveru */
  function discardEdits() {
    const n = Object.keys(loadEdits()).length;
    if (!n) return;
    if (!confirm(`Zahodit ${n} lokálních úprav a načíst původní data ze serveru? Neexportované změny se ztratí.`)) return;
    try { localStorage.removeItem(EDITS_KEY); } catch (_) {}
    location.reload();
  }

  function focusNode(id) {
    const n = cy.getElementById(id);
    if (!n || n.empty() || n.hasClass("filtered")) return;
    cy.animate({ center: { eles: n }, zoom: Math.max(cy.zoom(), 1) }, { duration: 300 });
    openDetail(n);
  }
  // všechny koncepty dosažitelné po hranách next(id), od nejbližších; bez startu
  function reach(start, next) {
    const seen = new Set([start]), out = [];
    let vlna = [start];
    while (vlna.length) {
      const dalsi = [];
      vlna.forEach((id) => (next(id) || []).forEach((x) => {
        if (!seen.has(x) && conceptById[x]) { seen.add(x); out.push(x); dalsi.push(x); }
      }));
      vlna = dalsi;
    }
    return out;
  }

  function link(id) {
    const c = conceptById[id];
    return `<button class="d-link" data-focus="${esc(id)}">${esc(typo(c ? c.nazev : id))}</button>`;
  }

  function openDetail(node) {
    editing = false;
    cy.$(":selected").unselect(); node.select();
    if (viewMode === "rvp" && /^(group|hub|sub|subhub)$/.test(node.data("type"))) {
      detailBody.innerHTML = rvpGroupHtml(node.data("gid"), /sub/.test(node.data("type")) ? node.data("pid") : null);
      pinned = null; clearNb();
    } else if (node.data("type") === "group" || node.data("type") === "hub") {
      detailBody.innerHTML = groupHtml(node.data("gid"), "#ffff00", node.data("label"));
      pinned = null; clearNb();
    } else if (node.data("type") === "sub" || node.data("type") === "subhub") {
      detailBody.innerHTML = subHtml(node.data("gid"), node.data("pid"));
      pinned = null; clearNb();
    } else {
      detailBody.innerHTML = conceptHtml(node.data("_c"));
      pinned = node; focusNb(node);
      cy.animate({ fit: { eles: node.closedNeighborhood(), padding: 80 }, duration: 350 });
    }
    bindPanelLinks();
    detail.classList.remove("hidden");
  }

  function goals(list) {
    if (!list || !list.length) return '<span class="d-empty">doplní se v detailní fázi</span>';
    return list.map((g) => {
      const lvl = LEVELS[g.uroven] || g.uroven || "";
      const rocnik = g.rocnik != null ? g.rocnik : g.orientacne_rocnik;
      const roc = rocnik ? `<span class="rocnik">~ ${esc(rocnik)}. ročník</span>` : "";
      return `<div class="d-goal"><div class="lvl">${esc(lvl)}${roc}</div><p>${esc(typo(g.text))}</p></div>`;
    }).join("");
  }

  const paras = (txt, fallback) => {
    const t = String(txt || "").trim();
    if (!t) return fallback ? `<p class="d-desc">${esc(fallback)}</p>` : '<span class="d-empty">—</span>';
    return t.split(/\n\n+/).filter(Boolean).map((p) => `<p class="d-desc" style="margin-top:0;margin-bottom:10px">${esc(typo(p))}</p>`).join("");
  };

  function groupHtml(gid, bg, label) {
    const cores = DATA.concepts.filter((c) => groupOf(c, viewMode) === gid && c.vrstva === "core");
    const count = DATA.concepts.filter((c) => groupOf(c, viewMode) === gid).length;
    let src = {}, meta = "", extra = "", fallback = "";
    if (viewMode === "tema") {
      src = DATA.temata.find((t) => t.id === gid) || {};
      if (src.nazev_en) meta = `<div class="d-meta"><span class="d-pill">${esc(src.nazev_en)}</span></div>`;
      if (src.vrstva_mapy != null) meta = `<div class="d-meta"><span class="d-pill">${esc(VRSTVA_MAPY[src.vrstva_mapy] || ("vrstva " + src.vrstva_mapy))}</span></div>`;
      const nav = (src.navazuje_na || []).map((id) => { const t = DATA.temata.find((x) => x.id === id); return `<span class="d-tag">${esc(t ? t.nazev : id)}</span>`; }).join("");
      if (nav) extra = `<div class="d-section"><h3>Navazuje na</h3><div class="d-tags">${nav}</div></div>`;
    } else if (viewMode === "kompetence") {
      src = (DATA.kompetence || []).find((k) => k.id === gid) || {};
      if (src.kod) meta = `<div class="d-meta"><span class="d-pill">${esc(src.kod)}</span></div>`;
      if (src.vystup) extra = `<div class="d-section"><h3>Očekávaný výstup KDI</h3><div class="d-rvp">${esc(typo(src.vystup))}</div></div>`;
      if (gid === NOKDI) fallback = "Ryzí informatická teorie — myšlení, primitiva programování, vnitřek infrastruktury, teorie AI.";
      else if (!src.popis) fallback = (DATA.meta && DATA.meta.kompetence_popis) || "";
    }
    return `
      <span class="d-badge" style="background:${bg};color:#000000">${esc(GROUP_LABEL[viewMode])}</span>
      <h2 class="d-title">${esc(src.nazev || label || gid)}</h2>
      ${meta}
      ${paras(src.popis, fallback)}
      ${extra}
      <div class="d-section"><h3>Konceptů a podkonceptů: ${count}</h3></div>
      <div class="d-section"><h3>Koncepty</h3><div class="d-links">${cores.map((c) => link(c.id)).join("") || '<span class="d-empty">—</span>'}</div></div>`;
  }

  function subHtml(temaId, pid) {
    const tema = DATA.temata.find((t) => t.id === temaId) || {};
    const p = podoblastiOf(temaId).find((x) => x.id === pid) || { nazev: pid };
    const kids = DATA.concepts.filter((c) => c.tema === temaId && c.podoblast === pid);
    const cores = kids.filter((c) => c.vrstva === "core"), nav = kids.filter((c) => c.vrstva !== "core");
    return `
      <span class="d-badge d-badge-tema">${esc(tema.nazev || temaId)}</span>
      <h2 class="d-title">${esc(p.nazev)}</h2>
      <div class="d-meta"><span class="d-pill">skupina</span></div>
      ${paras(p.popis || "")}
      <div class="d-section"><h3>Konceptů a podkonceptů: ${kids.length}</h3></div>
      <div class="d-section"><h3>Koncepty</h3><div class="d-links">${cores.map((c) => link(c.id)).join("") || '<span class="d-empty">—</span>'}</div></div>
      <div class="d-section"><h3>Podkoncepty</h3><div class="d-links">${nav.map((c) => link(c.id)).join("") || '<span class="d-empty">—</span>'}</div></div>`;
  }

  function conceptHtml(c, box) {
    const tema = (DATA.temata.find((t) => t.id === c.tema) || {});
    const pod = podoblastOf(c);
    const oblast = c.oblast ? ((DATA.areas || []).find((a) => a.id === c.oblast) || null) : null;
    const komp = c.kompetence ? ((DATA.kompetence || []).find((k) => k.id === c.kompetence) || null) : null;
    const rvp = (c.rvp || []).length
      ? c.rvp.map((r) => r.kod && rvpByKod[r.kod]
          ? `<div class="d-rvp"><button class="kod kod-link" data-ovu="${esc(r.kod)}" title="Otevřít v pohledu RVP Informatika">${esc(r.kod)}</button>${esc(typo(rvpByKod[r.kod].zneni))}` +
            (r.poznamka ? `<div class="d-rvp-note">${esc(typo(r.poznamka))}</div>` : "") + `</div>`
        : r.kod
          ? `<div class="d-rvp"><span class="kod">${esc(r.kod)}</span>${r.vystup ? esc(typo(r.vystup)) : '<span class="d-empty">znění výstupu doplnit</span>'}` +
            (r.poznamka ? `<div class="d-rvp-note">${esc(typo(r.poznamka))}</div>` : "") + `</div>`
          // poznámka garanta bez kódu výstupu (např. „Bez samostatné přímé vazby")
          : `<div class="d-rvp"><div class="d-rvp-note">${esc(typo(r.poznamka || ""))}</div></div>`).join("")
      : '<span class="d-empty">—</span>';
    const kdi = komp
      ? `<div class="d-rvp"><span class="kod">${esc(komp.kod)}</span><strong>${esc(komp.nazev)}</strong><br>${esc(typo(komp.vystup))}</div>`
      : '<span class="d-empty">—</span>';
    const tags = (c.tagy || []).length ? c.tagy.map((t) => `<span class="d-tag">${esc(t)}</span>`).join("") : '<span class="d-empty">—</span>';
    const links = (arr) => (arr && arr.length) ? [...new Set(arr)].map(link).join("") : '<span class="d-empty">—</span>';
    const zdroj = (c.zdroj || []).length ? c.zdroj.map((z) => `<div class="d-rvp">${esc(z)}</div>`).join("") : '<span class="d-empty">—</span>';
    // obousměrné hrany
    const souvisiIds = [...new Set([...(c.souvisi || []), ...(revSouvisi[c.id] || [])])];
    const jePrereqPro = revPrereq[c.id] || [];
    // prerekvizity jsou tranzitivní: co předchází prerekvizitě, předchází i konceptu
    const predchazi = reach(c.id, (id) => (conceptById[id] || {}).prerekvizity).filter((id) => !c.prerekvizity.includes(id));
    const navazuje = reach(c.id, (id) => revPrereq[id]).filter((id) => !jePrereqPro.includes(id));
    // nepřímé vazby jen v rámci tématu, z ostatních témat jen počet (jinak by se vypsala půlka mapy)
    const neprimo = (arr) => {
      const doma = arr.filter((id) => conceptById[id].tema === c.tema), jinde = arr.length - doma.length;
      if (!arr.length) return "";
      return `<div class="d-sub">Nepřímo (přes řetěz prerekvizit)</div>` +
        (doma.length ? `<div class="d-links d-links-indirect">${links(doma)}</div>` : "") +
        (jinde ? `<div class="d-sub">+ ${jinde} ${jinde === 1 ? "koncept" : jinde < 5 ? "koncepty" : "konceptů"} v jiných oblastech</div>` : "");
    };
    // V5: hierarchie koncept → podkoncept a výskyt ve výuce po stupních
    const nadrazeny = c.nadrazeny && conceptById[c.nadrazeny];
    const podkoncepty = DATA.concepts.filter((x) => x.nadrazeny === c.id).map((x) => x.id);
    const st = c.stupne || {};
    const stupen = (v, nazev) => `<div class="d-stupen ${v ? "on" : ""}"><span class="d-stupen-mark">${v ? "✓" : "—"}</span>${esc(nazev)}</div>`;
    const vyuka = (st.zs1 != null || st.zs2 != null || c.poznamka)
      ? `<div class="d-section"><h3>Ve výuce podle RVP</h3>${stupen(st.zs1, "1. stupeň ZŠ (výstupy ZV5)")}${stupen(st.zs2, "2. stupeň ZŠ (výstupy ZV9)")}` +
        (c.poznamka ? `<div class="d-rvp-note">${esc(typo(c.poznamka))}</div>` : "") + `</div>` : "";
    const sekce = (h, html, show) => show ? `<div class="d-section"><h3>${h}</h3>${html}</div>` : "";
    return `
      <span class="d-badge d-badge-tema">${esc(tema.nazev || c.tema)}</span>${pod ? ` <span class="d-badge d-badge-sub">${esc(pod.nazev)}</span>` : ""}
      <h2 class="d-title">${esc(c.nazev)}</h2>
      <div class="d-meta">
        <span class="d-pill ${c.vrstva === "core" ? "core" : ""}">${esc(VRSTVA[c.vrstva] || c.vrstva)}</span>
        <span class="d-pill stav-${esc(c.stav || "draft")}">${esc(STAV[c.stav] || c.stav || "Draft")}</span>
        ${oblast ? `<span class="d-pill">${esc(oblast.nazev)}</span>` : ""}
        ${komp ? `<span class="d-pill">${esc(komp.nazev)}</span>` : ""}
      </div>
      ${!box && canWrite() ? `<button class="km-primary km-editbtn" data-act="edit" data-id="${esc(c.id)}">✎ Upravit koncept</button>` : ""}
      ${paras(c.popis)}
      ${vyuka}
      ${sekce("Nadřazený koncept", `<div class="d-links">${nadrazeny ? link(c.nadrazeny) : ""}</div>`, !!nadrazeny)}
      ${sekce("Podkoncepty", `<div class="d-links">${links(podkoncepty)}</div>`, podkoncepty.length)}
      ${box ? "" : microSection(c) +
        `<div class="d-section"><h3>Vzdělávací cíle</h3>${goals(c.cile)}</div>
      <div class="d-section"><h3>Kritéria hodnocení</h3>${goals(c.kriteria)}</div>`}
      ${c.duraz ? `<div class="d-section d-duraz"><h3>Důraz</h3>${paras(c.duraz)}</div>` : ""}
      ${sekce("RVP — očekávaný výstup", rvp, (c.rvp || []).length)}
      ${sekce("Digitální kompetence", kdi, !!komp)}
      ${sekce("Prerekvizity", `<div class="d-links">${links(c.prerekvizity)}</div>${neprimo(predchazi)}`, c.prerekvizity.length || predchazi.length)}
      ${sekce("Je prerekvizitou pro", `<div class="d-links">${links(jePrereqPro)}</div>${neprimo(navazuje)}`, jePrereqPro.length || navazuje.length)}
      ${sekce("Souvisí", `<div class="d-links">${links(souvisiIds)}</div>`, souvisiIds.length)}
      ${sekce("Tagy", `<div class="d-tags">${tags}</div>`, (c.tagy || []).length)}
      ${sekce("Zdroj popisu", `<div class="d-rvp-note">${esc(c.zdroj_popisu || "")}</div>`, !!c.zdroj_popisu)}
      ${sekce("Zdroj", zdroj, (c.zdroj || []).length)}`;
  }

  /* ---------- Mikrokoncepty + hloubkové ponoření ---------- */
  const findMicro = (id) => {
    for (const c of DATA.concepts) { const m = (c._micros || []).find((x) => x.id === id); if (m) return m; }
    return null;
  };

  function microSection(c) {
    const micros = c._micros || [];
    const list = micros.length
      ? micros.map((m) =>
          '<div class="mc-row"><button class="d-link mc-open" data-act="micro-open" data-micro="' + esc(m.id) + '">' +
          esc(m.nazev || m.id) + '</button>' +
          (canWrite() ? '<button class="mc-del" data-act="del-micro" data-micro="' + esc(m.id) + '" title="Smazat">✕</button>' : "") +
          '</div>').join("")
      : '<span class="d-empty">zatím žádné mikrokoncepty</span>';
    const dive = micros.length ? '<button class="km-primary" data-act="dive" data-id="' + esc(c.id) + '">🔬 Ponořit se (' + micros.length + ')</button>' : "";
    const add = canWrite() ? '<button class="d-link" data-act="micro-add" data-id="' + esc(c.id) + '">➕ Přidat mikrokoncept</button>' : "";
    return '<div class="d-section"><h3>Mikrokoncepty</h3>' + list +
      ((dive || add) ? '<div class="d-links" style="margin-top:8px">' + dive + add + '</div>' : "") + '</div>';
  }

  // Mikrokoncept má stejný obsah jako koncept: název, vrstva, popis, cíle,
  // kritéria (gradované). Data se ukládají do km_microkoncepty.data (jsonb).
  const microFormHtml = (m) => {
    m = m || {};
    return '' +
      '<div class="ed-field"><label>Název *</label><input id="mc-nazev" value="' + esc(m.nazev || "") + '" placeholder="např. Nekonečný cyklus"></div>' +
      '<div class="ed-field"><label>Vrstva</label><select id="mc-vrstva">' +
        '<option value="core"' + (m.vrstva === "core" ? " selected" : "") + '>Core</option>' +
        '<option value="navazujici"' + (m.vrstva !== "core" ? " selected" : "") + '>Navazující</option></select></div>' +
      '<div class="ed-field"><label>Popis</label><textarea id="mc-popis" rows="4" placeholder="Co mikrokoncept je…">' + esc(m.popis || "") + '</textarea></div>' +
      '<div class="ed-field"><label>Vzdělávací cíle</label><div id="ed-cile">' + (m.cile || []).map(cileRow).join("") + '</div>' +
        '<button class="d-link ed-add" data-act="add-cile">+ Přidat cíl</button></div>' +
      '<div class="ed-field"><label>Kritéria hodnocení</label><div id="ed-kriteria">' + (m.kriteria || []).map(kritRow).join("") + '</div>' +
        '<button class="d-link ed-add" data-act="add-krit">+ Přidat kritérium</button></div>';
  };
  function readMicroForm() {
    const cile = [...document.querySelectorAll("#ed-cile .ed-row")].map((r) => {
      const o = { uroven: r.querySelector(".ed-lvl").value, text: r.querySelector(".ed-text").value.trim() };
      const roc = r.querySelector(".ed-roc") && r.querySelector(".ed-roc").value; if (roc) o.rocnik = rocnikVal(roc);
      return o;
    }).filter((o) => o.text);
    const kriteria = readKriteria();
    return {
      nazev: (document.getElementById("mc-nazev").value || "").trim(),
      vrstva: document.getElementById("mc-vrstva").value,
      popis: (document.getElementById("mc-popis").value || "").trim(),
      cile: cile, kriteria: kriteria
    };
  }

  function openMicroDetail(m) {
    if (!m) return;
    editing = false;
    const parent = conceptById[m.parent_id];
    const cil = (m.cile || []).length ? goals(m.cile) : '<span class="d-empty">—</span>';
    const krit = (m.kriteria || []).length ? goals(m.kriteria) : '<span class="d-empty">—</span>';
    detailBody.innerHTML =
      '<span class="d-badge d-badge-acc">Mikrokoncept</span>' +
      '<h2 class="d-title">' + esc(m.nazev || m.id) + '</h2>' +
      '<div class="d-meta">' +
        '<span class="d-pill ' + (m.vrstva === "core" ? "core" : "") + '">' + esc(VRSTVA[m.vrstva] || "Navazující") + '</span>' +
        (parent ? '<span class="d-pill">pod: ' + esc(parent.nazev) + '</span>' : "") + '</div>' +
      (canWrite() ? '<button class="km-primary km-editbtn" data-act="micro-edit" data-micro="' + esc(m.id) + '">✎ Upravit mikrokoncept</button>' : "") +
      '<p class="d-desc">' + esc(typo(m.popis || "")) + '</p>' +
      '<div class="d-section"><h3>Vzdělávací cíle</h3>' + cil + '</div>' +
      '<div class="d-section"><h3>Kritéria hodnocení</h3>' + krit + '</div>' +
      (canWrite() ? '<div class="d-links"><button class="d-link km-danger" data-act="del-micro" data-micro="' + esc(m.id) + '">Smazat mikrokoncept</button></div>' : "");
    detail.classList.remove("hidden"); detail.scrollTop = 0;
  }

  function openAddMicro(parentId) {
    const c = conceptById[parentId]; if (!c) return;
    editing = true; pinned = null; clearNb();
    detailBody.innerHTML =
      '<span class="d-badge d-badge-acc">Nový mikrokoncept</span>' +
      '<p class="d-desc">Pod koncept <strong>' + esc(c.nazev) + '</strong></p>' +
      microFormHtml({}) +
      '<div class="ed-actions">' +
      '<button class="reset-btn" data-act="micro-cancel" data-id="' + esc(parentId) + '">Zrušit</button>' +
      '<button class="km-primary" data-act="micro-save" data-id="' + esc(parentId) + '">Vytvořit mikrokoncept</button></div>';
    detail.classList.remove("hidden"); detail.scrollTop = 0;
  }

  function openEditMicro(microId) {
    const m = findMicro(microId); if (!m) return;
    const parent = conceptById[m.parent_id];
    editing = true; pinned = null; clearNb();
    detailBody.innerHTML =
      '<span class="d-badge d-badge-acc">Úprava mikrokonceptu</span>' +
      (parent ? '<p class="d-desc">Pod koncept <strong>' + esc(parent.nazev) + '</strong></p>' : "") +
      microFormHtml(m) +
      '<div class="ed-actions">' +
      '<button class="reset-btn" data-act="micro-edit-cancel" data-micro="' + esc(m.id) + '">Zrušit</button>' +
      '<button class="km-primary" data-act="micro-edit-save" data-micro="' + esc(m.id) + '">Uložit</button></div>';
    detail.classList.remove("hidden"); detail.scrollTop = 0;
  }

  function saveNewMicro(parentId) {
    const c = conceptById[parentId]; if (!c) return;
    const form = readMicroForm();
    if (!form.nazev) { alert("Doplň název mikrokonceptu."); return; }
    const s = slug(form.nazev); if (!s) { alert("Název musí obsahovat písmena nebo číslice."); return; }
    const existing = c._micros || [];
    let id = parentId + "--" + s;
    if (existing.some((m) => m.id === id)) { let i = 2; while (existing.some((m) => m.id === id + "-" + i)) i++; id = id + "-" + i; }
    const ord = existing.length;
    if (supabaseOk && window.KM) {
      window.KM.saveMicro(adminLogin, adminSecret, id, parentId, form, ord)
        .catch((e) => alert("Uložení do Supabase selhalo: " + ((e && e.message) || e)));
    }
    const m = Object.assign({ id: id, parent_id: parentId, ord: ord }, form);
    (c._micros = c._micros || []).push(m);
    editing = false;
    if (drillId === parentId) drillInto(parentId);
    else openDetail(cy.getElementById(parentId));
  }

  function saveEditMicro(microId) {
    const m = findMicro(microId); if (!m) return;
    const parent = conceptById[m.parent_id];
    const form = readMicroForm();
    if (!form.nazev) { alert("Doplň název mikrokonceptu."); return; }
    Object.assign(m, form);   // id / parent_id / ord zůstávají
    if (supabaseOk && window.KM) {
      window.KM.saveMicro(adminLogin, adminSecret, m.id, m.parent_id, form, m.ord || 0)
        .catch((e) => alert("Uložení do Supabase selhalo: " + ((e && e.message) || e)));
    }
    editing = false;
    if (parent && drillId === parent.id) drillInto(parent.id);
    openMicroDetail(m);
  }

  function deleteMicro(microId) {
    let parent = null;
    DATA.concepts.forEach((c) => { if ((c._micros || []).some((m) => m.id === microId)) parent = c; });
    if (!parent) return;
    if (!confirm("Opravdu smazat tenhle mikrokoncept?")) return;
    parent._micros = (parent._micros || []).filter((m) => m.id !== microId);
    if (supabaseOk && window.KM) {
      window.KM.deleteMicro(adminLogin, adminSecret, microId).catch((e) => alert("Smazání selhalo: " + ((e && e.message) || e)));
    }
    if (drillId === parent.id) drillInto(parent.id);
    else openDetail(cy.getElementById(parent.id));
  }

  // „Ponoření" do konceptu: graf ukáže rodičovský koncept + jeho mikrokoncepty.
  function drillInto(conceptId) {
    const c = conceptById[conceptId]; if (!c) return;
    drillId = conceptId; closeDetail();
    cy.elements().remove();
    const micros = c._micros || [];
    const els = [{ data: { id: "mp", type: "microparent", label: c.nazev, _c: c } }];
    micros.forEach((m) => {
      els.push({ data: { id: "m-" + m.id, type: "micro", label: m.nazev || m.id, _m: m } });
      els.push({ data: { id: "me-" + m.id, source: "mp", target: "m-" + m.id, etype: "microedge" } });
    });
    cy.add(els);
    cy.getElementById("mp").position({ x: 0, y: 0 });
    const R = Math.max(200, micros.length * 34);
    micros.forEach((m, i) => {
      const ang = (2 * Math.PI * i / Math.max(1, micros.length)) - Math.PI / 2;
      cy.getElementById("m-" + m.id).position({ x: Math.cos(ang) * R, y: Math.sin(ang) * R });
    });
    cy.fit(cy.nodes(), 70);
    const bar = document.getElementById("km-drillbar");
    if (bar) { bar.classList.remove("hidden"); bar.querySelector(".km-drill-title").textContent = "🔬 " + c.nazev; }
  }

  function drillOut() {
    drillId = null;
    const bar = document.getElementById("km-drillbar"); if (bar) bar.classList.add("hidden");
    render(viewMode, { noAnim: true });
  }

  // Detail konceptu bez manipulace s grafem (pro 3D pohled).
  /* ==========================================================================
     Pohled RVP Informatika — detail výsledku učení a bublin
     ========================================================================== */
  const escAttr = (x) => esc(x).replace(/"/g, "&quot;");
  const rvpHub = (id) => (RVP && RVP.hubs.find((h) => h.id === id)) || { subs: [] };
  // adresy v textu ilustrativních úloh (např. úložiště RVP) jako odkazy
  const linkify = (h) => h.replace(/https?:\/\/[^\s"“”<]*[^\s"“”<.,;:)]/g,
    (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);

  function blocksHtml(bl) {
    let out = "", ul = false;
    (bl || []).forEach((b) => {
      const x = linkify(esc(typo(b.x)));
      if (b.t === "li") { if (!ul) { out += '<ul class="r-ul">'; ul = true; } out += `<li>${x}</li>`; return; }
      if (ul) { out += "</ul>"; ul = false; }
      out += b.t === "h" ? `<div class="r-h">${x}</div>` : `<p class="r-p">${x}</p>`;
    });
    return out + (ul ? "</ul>" : "");
  }

  function ovuLink(k) {
    const o = rvpByKod[k];
    if (!o) return "";
    return `<button class="r-link" data-ovu="${escAttr(k)}"><span class="r-kod">${esc(k)} · ${esc(o.stupen)}</span>${esc(typo(o.zneni))}</button>`;
  }
  const ovuList = (arr) => arr.length ? `<div class="r-links">${arr.map(ovuLink).join("")}</div>` : '<span class="d-empty">—</span>';
  // výsledky na mapě, které s daným souvisejí (oběma směry) — dostanou žlutý prstenec
  const ovuRelated = (o) => [...new Set([...o.souvisi, ...o.navaznost, ...(rvpRev[o.kod] || [])])].filter((k) => rvpByKod[k] && k !== o.kod);

  function ovuHtml(o) {
    const hub = rvpHub(o.hub), sub = hub.subs.find((s) => s.id === o.sub) || {};
    const inf = o.hub === "ovu1" || o.hub === "ovu2";
    const onMap = (arr) => arr.filter((k) => rvpByKod[k] && k !== o.kod);
    const kk = onMap(o.souvisi).filter((k) => rvpByKod[k].hub === "kk");
    const zg = onMap(o.souvisi).filter((k) => rvpByKod[k].hub === "zg");
    const jinde = o.souvisi.filter((k) => !rvpByKod[k] && RVP.ext[k]);
    const extHtml = jinde.length
      ? jinde.map((k) => `<div class="d-rvp"><span class="kod">${esc(k)}</span>${esc(typo(RVP.ext[k].zneni))}<div class="d-rvp-note">${esc(RVP.ext[k].kde)}</div></div>`).join("")
      : '<span class="d-empty">—</span>';
    const koncepty = DATA.concepts.filter((c) => (c.rvp || []).some((r) => r.kod === o.kod));
    const kHtml = koncepty.length
      ? `<div class="d-links">${koncepty.map((c) => `<button class="d-link" data-concept="${escAttr(c.id)}">${esc(typo(c.nazev))}</button>`).join("")}</div>`
      : '<span class="d-empty">zatím žádný koncept mapy</span>';
    const uloh = (n) => n + " " + (n === 1 ? "úloha" : n < 5 ? "úlohy" : "úloh");
    const uro = o.urovne.map((u) => `
      <details class="r-uro"><summary>${esc(u.nazev)}${u.ilustrace.length ? `<span class="r-count">${uloh(u.ilustrace.length)}</span>` : ""}</summary>
        <div class="r-body">${blocksHtml(u.bloky)}
        ${u.ilustrace.map((il) => `<details class="r-il"><summary>${esc(typo(il.nazev))}</summary><div class="r-body">${blocksHtml(il.bloky)}` +
          il.odkazy.map((a) => `<a class="r-a" href="${escAttr(a.h)}" target="_blank" rel="noopener">${esc(a.t)}</a>`).join("") + `</div></details>`).join("")}
        </div>
      </details>`).join("");
    return `
      <span class="d-badge d-badge-acc">${esc(hub.nazev)}</span> <span class="d-badge d-badge-sub">${esc(sub.plny || sub.nazev || "")}</span>
      <h2 class="d-title r-title">${esc(typo(o.zneni))}</h2>
      <div class="d-meta"><span class="d-pill">${esc(o.kod)}</span><span class="d-pill">${esc(o.stupen)}</span>${o.slozka ? `<span class="d-pill">${esc(o.slozka)}</span>` : ""}</div>
      <div class="d-section"><h3>Popis a zdůvodnění</h3>${blocksHtml(o.popis) || '<span class="d-empty">—</span>'}</div>
      <div class="d-section"><h3>Úrovně a ilustrativní úlohy</h3>${uro || '<span class="d-empty">—</span>'}</div>
      ${inf ? `
      <div class="d-section"><h3>Koncepty mapy</h3>${kHtml}</div>
      <div class="d-section"><h3>Návaznost v informatice</h3>${ovuList(onMap(o.navaznost))}</div>
      <div class="d-section"><h3>Souvisí — klíčové kompetence</h3>${ovuList(kk)}</div>
      <div class="d-section"><h3>Souvisí — gramotnosti</h3>${ovuList(zg)}</div>
      <div class="d-section"><h3>Souvisí — jiné obory a průřezová témata</h3>${extHtml}</div>`
      : `<div class="d-section"><h3>Rozvíjí se v informatice</h3>${ovuList(rvpRev[o.kod] || [])}</div>`}`;
  }

  function rvpGroupHtml(gid, pid) {
    const hub = rvpHub(gid), sub = pid ? hub.subs.find((s) => s.id === pid) : null;
    const leaves = RVP.ovu.filter((o) => (sub ? o.sub === pid : o.hub === gid));
    return `
      <span class="d-badge d-badge-acc">${esc(sub ? hub.nazev : "RVP Informatika")}</span>
      <h2 class="d-title">${esc(sub ? (sub.plny || sub.nazev) : hub.nazev)}</h2>
      ${sub && sub.kod ? `<div class="d-meta"><span class="d-pill">${esc(sub.kod)}</span></div>` : ""}
      ${paras(sub ? sub.popis : hub.popis)}
      ${hub.vyber ? `<div class="d-rvp-note r-note">${esc(hub.vyber)}</div>` : ""}
      <div class="d-section"><h3>Očekávané výsledky učení: ${leaves.length}</h3>${ovuList(leaves.map((o) => o.kod))}</div>
      ${sub ? "" : `<div class="d-section"><h3>Zdroj</h3><div class="d-rvp-note">${esc(typo(RVP.meta.vydani))}</div></div>`}`;
  }

  function openOvuDetail(o) {
    if (!o) return;
    editing = false;
    const n = cy.getElementById(ovuNodeId(o.kod));
    cy.$(":selected").unselect();
    if (n.nonempty()) n.select();
    detailBody.innerHTML = ovuHtml(o);
    bindPanelLinks();
    const rel = ovuRelated(o);
    cy.batch(() => {
      cy.elements().removeClass("nbedge nbon");
      rel.forEach((k) => cy.getElementById(ovuNodeId(k)).addClass("nbon"));
    });
    pinned = n.nonempty() ? n : null;
    detail.classList.remove("hidden"); detail.scrollTop = 0;
  }

  /* odkazy v pravém panelu: koncept na mapě, výsledek RVP, koncept z pohledu RVP */
  function bindPanelLinks() {
    detailBody.querySelectorAll("[data-focus]").forEach((b) => b.addEventListener("click", () => focusNode(b.dataset.focus)));
    detailBody.querySelectorAll("[data-ovu]").forEach((b) => b.addEventListener("click", () => goOvu(b.dataset.ovu)));
    detailBody.querySelectorAll("[data-concept]").forEach((b) => b.addEventListener("click", () => goConcept(b.dataset.concept)));
  }
  function switchView(v) {
    document.querySelectorAll(".vt-btn").forEach((x) => x.classList.toggle("active", x.dataset.view === v));
    if (view3d) exit3D();
    if (v !== viewMode) render(v, { noAnim: true });
  }
  // zajistí, že skupina uzlu není vypnutá ve filtru (jinak by proklik nikam nevedl)
  function unfilterGroup(gid) {
    const chip = document.querySelector(`.chip[data-filter='group'][data-val='${gid}']`);
    if (chip && chip.getAttribute("aria-pressed") !== "true") { chip.setAttribute("aria-pressed", "true"); applyFilters(); }
  }
  function goOvu(kod) {
    loadRvp().then(() => {
      const o = rvpByKod[kod];
      if (!o) return;
      switchView("rvp");
      unfilterGroup(o.hub);
      const n = cy.getElementById(ovuNodeId(kod));
      if (n.nonempty()) cy.animate({ center: { eles: n }, zoom: Math.max(cy.zoom(), 0.9) }, { duration: 300 });
      openOvuDetail(o);
    }, (e) => setStatus("RVP se nepodařilo načíst: " + e.message));
  }
  function goConcept(id) {
    const c = conceptById[id];
    if (!c) return;
    switchView("tema");
    unfilterGroup(c.tema);
    focusNode(id);
  }

  function showConceptPanel(c) {
    editing = false;
    detailBody.innerHTML = conceptHtml(c);
    bindPanelLinks();
    detail.classList.remove("hidden"); detail.scrollTop = 0;
  }

  /* ---------- 3D pohled (vlastní projekce, bez knihovny) ----------
     Koncepty leží v rovině (z=0), mikrokoncepty na vrstvě pod rodičem (z<0).
     Táhnutím se scéna otáčí, kolečkem přibližuje; klik otevře detail. */
  let view3d = false, cvs3d = null, ctx3d = null, raf3d = null, drag3d = null;
  const CAM3D_DEFAULT = { rotX: -0.75, rotY: 0.5, zoom: 0.62, panX: 0, panY: 0 };
  let cam3d = Object.assign({}, CAM3D_DEFAULT);
  let nodes3d = [], edges3d = [];

  function build3D() {
    nodes3d = []; edges3d = [];
    const byId = {};
    DATA.concepts.forEach((c) => {
      const n = cy.getElementById(c.id);
      const pos = (n && n.nonempty()) ? n.position() : { x: 0, y: 0 };
      const deg = (n && n.nonempty()) ? (n.data("size") || 40) : 40;
      const node = { id: c.id, kind: "concept", x: pos.x, y: pos.y, z: 0, r: Math.max(9, deg * 0.2), label: c.nazev, core: c.vrstva === "core", _c: c };
      nodes3d.push(node); byId[c.id] = node;
    });
    const xs = nodes3d.map((n) => n.x), ys = nodes3d.map((n) => n.y);
    const cxm = (Math.min(...xs) + Math.max(...xs)) / 2, cym = (Math.min(...ys) + Math.max(...ys)) / 2;
    let maxR = 1;
    nodes3d.forEach((n) => { n.x -= cxm; n.y -= cym; maxR = Math.max(maxR, Math.hypot(n.x, n.y)); });
    // rozprostři koncepty dál od sebe (bubliny se nepřekrývají; malé popisky se pak vejdou)
    const sc = 560 / maxR;
    nodes3d.forEach((n) => { n.x *= sc; n.y *= sc; });
    const DEPTH = 260;
    DATA.concepts.forEach((c) => {
      const micros = c._micros || []; if (!micros.length) return;
      const parent = byId[c.id];
      micros.forEach((m, i) => {
        const ang = 2 * Math.PI * i / micros.length, rr = 24 + micros.length * 2;
        const node = { id: "m-" + m.id, kind: "micro", x: parent.x + Math.cos(ang) * rr, y: parent.y + Math.sin(ang) * rr, z: -DEPTH, r: 8, label: m.nazev || m.id, _m: m };
        nodes3d.push(node); edges3d.push({ a: parent, b: node, kind: "strut" });
      });
    });
    DATA.concepts.forEach((c) => {
      [...(c.nadrazeny ? [c.nadrazeny] : []), ...(c.prerekvizity || [])].forEach((p) => { if (byId[p] && byId[c.id]) edges3d.push({ a: byId[p], b: byId[c.id], kind: "prereq" }); });
    });
  }

  function project3D(n, w, h) {
    const cosY = Math.cos(cam3d.rotY), sinY = Math.sin(cam3d.rotY), cosX = Math.cos(cam3d.rotX), sinX = Math.sin(cam3d.rotX);
    const x1 = n.x * cosY + n.z * sinY, z1 = -n.x * sinY + n.z * cosY, y1 = n.y;
    const y2 = y1 * cosX - z1 * sinX, z2 = y1 * sinX + z1 * cosX, x2 = x1;
    const CAM = 900, f = CAM / (CAM - z2), s = Math.min(w, h) / 760 * cam3d.zoom;
    return { sx: w / 2 + cam3d.panX + x2 * s * f, sy: h / 2 + cam3d.panY + y2 * s * f, depth: z2, f: f * s };
  }

  // Zalomení popisku do max 2 řádků, které se vejdou do šířky maxW (font už nastaven).
  function wrap2(text, maxW) {
    const words = String(text).split(/\s+/); let l1 = "", l2 = "", i = 0;
    for (; i < words.length; i++) { const t = l1 ? l1 + " " + words[i] : words[i]; if (l1 && ctx3d.measureText(t).width > maxW) break; l1 = t; }
    for (; i < words.length; i++) { const t = l2 ? l2 + " " + words[i] : words[i]; if (l2 && ctx3d.measureText(t).width > maxW) { l2 += "…"; return [l1, l2]; } l2 = t; }
    return l2 ? [l1, l2] : [l1];
  }
  function labelInCircle(text, cx, cy, r, color) {
    const maxW = r * 1.7;
    let fs = Math.max(6, Math.min(12, r * 0.42));
    ctx3d.font = fs + "px Inter, sans-serif";
    // zmenši font tak, aby se i nejdelší slovo vešlo na šířku
    let longest = 0;
    String(text).split(/\s+/).forEach((w) => { longest = Math.max(longest, ctx3d.measureText(w).width); });
    if (longest > maxW) { fs = Math.max(5, fs * maxW / longest); ctx3d.font = fs + "px Inter, sans-serif"; }
    const lines = wrap2(text, maxW), lh = fs * 1.05, sy = cy - (lines.length - 1) * lh / 2;
    ctx3d.save();                                   // ořízni text na bublinu (nikdy nepřeleze)
    ctx3d.beginPath(); ctx3d.arc(cx, cy, r * 0.95, 0, 2 * Math.PI); ctx3d.clip();
    ctx3d.fillStyle = color; ctx3d.textAlign = "center"; ctx3d.textBaseline = "middle";
    lines.forEach((ln, i) => ctx3d.fillText(ln, cx, sy + i * lh));
    ctx3d.restore();
  }

  function roundRect3D(x, y, w, h, r) {
    ctx3d.beginPath();
    ctx3d.moveTo(x + r, y); ctx3d.arcTo(x + w, y, x + w, y + h, r); ctx3d.arcTo(x + w, y + h, x, y + h, r);
    ctx3d.arcTo(x, y + h, x, y, r); ctx3d.arcTo(x, y, x + w, y, r); ctx3d.closePath();
  }

  function draw3D() {
    if (!view3d || !ctx3d) return;
    const w = cvs3d.width, h = cvs3d.height;
    ctx3d.fillStyle = BG; ctx3d.fillRect(0, 0, w, h);
    nodes3d.forEach((n) => { n._p = project3D(n, w, h); });
    edges3d.forEach((e) => {
      const A = e.a._p, B = e.b._p;
      ctx3d.beginPath(); ctx3d.moveTo(A.sx, A.sy); ctx3d.lineTo(B.sx, B.sy);
      if (e.kind === "strut") { ctx3d.strokeStyle = "rgba(255,255,0,0.5)"; ctx3d.lineWidth = 1.3; }
      else { ctx3d.strokeStyle = "rgba(255,255,255,0.07)"; ctx3d.lineWidth = 0.8; }
      ctx3d.stroke();
    });
    nodes3d.slice().sort((a, b) => a._p.depth - b._p.depth).forEach((n) => {
      const p = n._p, r = Math.max(2, n.r * p.f);
      if (n.kind === "concept") {
        ctx3d.beginPath(); ctx3d.arc(p.sx, p.sy, r, 0, 2 * Math.PI);
        ctx3d.fillStyle = n.core ? "#ffffff" : BG_NODE; ctx3d.fill();
        if (!n.core) { ctx3d.strokeStyle = "#ffffff"; ctx3d.lineWidth = 1.1; ctx3d.stroke(); }
        if (r > 8) labelInCircle(n.label, p.sx, p.sy, r, n.core ? "#0a0a0c" : "#e8e8e8");
      } else {
        const s = r * 1.5; ctx3d.fillStyle = BG_NODE; ctx3d.strokeStyle = "#ffff00"; ctx3d.lineWidth = 1.1;
        roundRect3D(p.sx - s, p.sy - s * 0.6, s * 2, s * 1.2, 3); ctx3d.fill(); ctx3d.stroke();
        if (p.f > 0.5) {
          ctx3d.fillStyle = "#ffff00"; ctx3d.font = "9px Inter, sans-serif"; ctx3d.textAlign = "center"; ctx3d.textBaseline = "middle";
          ctx3d.fillText(n.label.length > 16 ? n.label.slice(0, 14) + "…" : n.label, p.sx, p.sy + r + 7);
        }
      }
    });
  }

  function loop3D() { if (!view3d) return; draw3D(); raf3d = requestAnimationFrame(loop3D); }

  function resize3D() {
    if (!cvs3d) return;
    const rect = document.getElementById("cy").getBoundingClientRect();
    cvs3d.style.position = "fixed";
    cvs3d.style.left = rect.left + "px"; cvs3d.style.top = rect.top + "px";
    cvs3d.width = Math.max(100, Math.round(rect.width)); cvs3d.height = Math.max(100, Math.round(rect.height));
    cvs3d.style.width = rect.width + "px"; cvs3d.style.height = rect.height + "px";
  }

  function pick3D(clientX, clientY) {
    const rect = cvs3d.getBoundingClientRect();
    const mx = clientX - rect.left, my = clientY - rect.top;
    let hit = null, hitDepth = -Infinity;
    nodes3d.forEach((n) => {
      const p = n._p; if (!p) return;
      const r = Math.max(6, n.r * p.f) + 4;
      if (Math.hypot(mx - p.sx, my - p.sy) <= r && p.depth > hitDepth) { hit = n; hitDepth = p.depth; }
    });
    if (!hit) return;
    if (hit.kind === "concept") showConceptPanel(hit._c); else openMicroDetail(hit._m);
  }

  function reset3D() { cam3d = Object.assign({}, CAM3D_DEFAULT); }
  // Zoom se středem v bodě (mx,my) — obsah pod kurzorem zůstává na místě.
  function zoomAt(mx, my, k) {
    const nz = Math.max(0.2, Math.min(6, cam3d.zoom * k)), kk = nz / cam3d.zoom;
    cam3d.panX = (1 - kk) * (mx - cvs3d.width / 2) + kk * cam3d.panX;
    cam3d.panY = (1 - kk) * (my - cvs3d.height / 2) + kk * cam3d.panY;
    cam3d.zoom = nz;
  }
  function attach3DEvents() {
    const localXY = (cx, cy) => { const r = cvs3d.getBoundingClientRect(); return [cx - r.left, cy - r.top]; };
    const down = (x, y, pan) => { drag3d = { x: x, y: y, ox: x, oy: y, moved: false, pan: pan }; };
    const move = (x, y) => {
      if (!drag3d) return;
      const dx = x - drag3d.x, dy = y - drag3d.y;
      if (Math.abs(x - drag3d.ox) + Math.abs(y - drag3d.oy) > 4) drag3d.moved = true;
      if (drag3d.pan) { cam3d.panX += dx; cam3d.panY += dy; }                 // posun (pravé tl. / Shift)
      else { cam3d.rotY += dx * 0.008; cam3d.rotX += dy * 0.008; cam3d.rotX = Math.max(-1.4, Math.min(1.4, cam3d.rotX)); }
      drag3d.x = x; drag3d.y = y;
    };
    cvs3d.addEventListener("contextmenu", (e) => e.preventDefault());
    cvs3d.addEventListener("mousedown", (e) => down(e.clientX, e.clientY, (e.button === 2 || e.button === 1 || e.shiftKey)));
    window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    window.addEventListener("mouseup", (e) => { if (view3d && drag3d && !drag3d.moved && !drag3d.pan) pick3D(e.clientX, e.clientY); drag3d = null; });
    cvs3d.addEventListener("dblclick", () => { if (view3d) reset3D(); });
    cvs3d.addEventListener("wheel", (e) => { e.preventDefault(); const p = localXY(e.clientX, e.clientY); zoomAt(p[0], p[1], e.deltaY < 0 ? 1.12 : 0.89); }, { passive: false });
    // dotyk: 1 prst = otáčení, 2 prsty = posun + pinch zoom
    let pinch = null;
    cvs3d.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        const a = e.touches[0], b = e.touches[1];
        pinch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), mx: (a.clientX + b.clientX) / 2, my: (a.clientY + b.clientY) / 2 };
        drag3d = null;
      } else { const t = e.touches[0]; down(t.clientX, t.clientY, false); pinch = null; }
    }, { passive: true });
    cvs3d.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && pinch) {
        const a = e.touches[0], b = e.touches[1];
        const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), mx = (a.clientX + b.clientX) / 2, my = (a.clientY + b.clientY) / 2;
        cam3d.panX += mx - pinch.mx; cam3d.panY += my - pinch.my;
        const p = localXY(mx, my); if (pinch.d > 0) zoomAt(p[0], p[1], d / pinch.d);
        pinch = { d: d, mx: mx, my: my };
      } else if (e.touches.length === 1) { const t = e.touches[0]; move(t.clientX, t.clientY); }
    }, { passive: true });
    cvs3d.addEventListener("touchend", (e) => {
      if (view3d && drag3d && !drag3d.moved && !drag3d.pan) { const t = (e.changedTouches && e.changedTouches[0]); if (t) pick3D(t.clientX, t.clientY); }
      drag3d = null; pinch = null;
    });
    window.addEventListener("resize", () => { if (view3d) resize3D(); });
  }

  function enter3D() {
    if (view3d) return;
    view3d = true; drillId = null;
    const dbar = document.getElementById("km-drillbar"); if (dbar) dbar.classList.add("hidden");
    closeDetail();
    document.getElementById("cy").style.visibility = "hidden";
    if (!cvs3d) {
      cvs3d = document.createElement("canvas"); cvs3d.id = "cy3d"; cvs3d.className = "cy3d";
      document.getElementById("app").appendChild(cvs3d);
      ctx3d = cvs3d.getContext("2d");
      attach3DEvents();
    }
    cvs3d.style.display = "block";
    reset3D(); resize3D(); build3D(); loop3D();
    window.__km3d = { nodes: () => nodes3d, pick: pick3D, cam: () => cam3d };   // testovací/ladicí hook
    setStatus("3D — táhni: otočit · pravé tl./Shift: posun · kolečko: zoom k místu · dvojklik: vyrovnat");
  }

  function exit3D() {
    view3d = false;
    if (raf3d) cancelAnimationFrame(raf3d);
    if (cvs3d) cvs3d.style.display = "none";
    document.getElementById("cy").style.visibility = "visible";
    setStatus(statusText(viewMode));
  }


  /* ==========================================================================
     Izometrický pohled na koncept
     Klik na bublinu: mapa se rozostří a ztmavne, bublina se s animací přesune
     do středu a sklopí do izometrie; nad ní se vysunou vrstvy školských stupňů.
     Klik na vrstvu nebo její popisek otevře box s cíli a kritérii té vrstvy.
     ========================================================================== */
  const ISO_LEVELS = [
    { id: "zs1", nazev: "1. stupeň ZŠ", ovu: "ZV5" },
    { id: "zs2", nazev: "2. stupeň ZŠ", ovu: "ZV9" },
    { id: "gym", nazev: "Gymnázia" },
    { id: "ss", nazev: "Střední školy" },
  ];
  // vrstva svítí, když má koncept na tom stupni obsah v RVP (sloupce 1. st. / 2. st. mapy V5)
  const isoAktivni = (c, lv) => !!(c && c.stupne && c.stupne[lv.id]);
  const SVG_NS = "http://www.w3.org/2000/svg";
  let isoNode = null, isoEl = null, isoRaf = 0;
  const easeOutBack = (t) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  function tween(dur, step, ease, done) {
    const t0 = performance.now();
    const f = (now) => { const t = Math.min(1, (now - t0) / dur); step((ease || easeOutCubic)(t), t); if (t < 1) isoRaf = requestAnimationFrame(f); else if (done) done(); };
    isoRaf = requestAnimationFrame(f);
  }
  const svgEl = (tag, attrs, parent) => { const e = document.createElementNS(SVG_NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); if (parent) parent.appendChild(e); return e; };
  const isoBoxOpen = () => { const b = document.getElementById("km-isobox"); return !!(b && b.classList.contains("open")); };

  function initIso() {
    const host = document.getElementById("cy");
    isoEl = document.createElement("div"); isoEl.id = "km-iso"; isoEl.className = "km-iso hidden";
    isoEl.innerHTML = '<svg class="km-iso-svg"></svg>' +
      '<div class="km-iso-tools"><button type="button" data-iso="detail">Detail konceptu</button><button type="button" data-iso="close" aria-label="Zavřít">✕</button></div>' +
      '<div id="km-isobox" class="km-isobox"><button type="button" class="km-isobox-x" data-iso="box-close" aria-label="Zavřít">✕</button><div class="km-isobox-body"></div></div>';
    host.appendChild(isoEl);
    isoEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-iso]");
      if (b) {
        const a = b.dataset.iso;
        if (a === "close") exitIso();
        else if (a === "detail") showConceptPanel(isoNode.data("_c"));
        else if (a === "box-close") closeIsoBox();
        else if (a === "level") openIsoBox(b.dataset.level);
        return;
      }
      const ov = e.target.closest("[data-ovu]");    // kód RVP v boxu → pohled RVP Informatika
      if (ov) { closeIsoBox(true); exitIso(true); goOvu(ov.dataset.ovu); return; }
      const f = e.target.closest("[data-focus]");   // odkaz na jiný koncept v boxu → přepnout izometrii na něj
      if (f) { const n = cy.getElementById(f.dataset.focus); if (n.nonempty() && n.data("type") === "concept") { closeIsoBox(true); enterIso(n); } return; }
      if (isoBoxOpen()) { closeIsoBox(); return; }
      if (e.target === isoEl || e.target.classList.contains("km-iso-svg")) exitIso();   // klik do pozadí = zpět
    });
  }

  function enterIso(node) {
    if (isoNode) exitIso(true);
    isoNode = node;
    const c = node.data("_c"), host = document.getElementById("cy"), W = host.clientWidth, H = host.clientHeight;
    const svg = isoEl.querySelector(".km-iso-svg");
    svg.innerHTML = ""; svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("width", W); svg.setAttribute("height", H);
    isoEl.classList.remove("hidden"); isoEl.classList.add("on");
    host.classList.add("iso-blur");
    closeDetail();

    const p = node.renderedPosition(), r0 = node.renderedWidth() / 2;
    const TR = Math.max(90, Math.min(W, H) * 0.17);          // cílový poloměr bubliny
    const tx = Math.min(W * 0.46, W - TR - 300), ty = H * 0.64;
    const SQ = 0.5, BASE = TR * SQ * 1.35, GAPY = TR * 0.42;   // sklopení, odstup první vrstvy od konceptu, rozestup vrstev
    const core = c.vrstva === "core";
    const lines = String(node.data("label") || c.nazev).split("\n");

    // bublina konceptu (letí z místa v mapě do středu a sklápí se)
    const g = svgEl("g", { class: "iso-concept", "data-iso": "level", "data-level": "concept" }, svg);
    const disc = svgEl("ellipse", { class: "iso-disc " + (core ? "core" : "nav"), cx: 0, cy: 0 }, g);
    const txt = svgEl("text", { class: "iso-label " + (core ? "core" : "nav"), "text-anchor": "middle" }, g);
    lines.forEach((l, i) => { const ts = svgEl("tspan", { x: 0, dy: i === 0 ? ((1 - lines.length) / 2 * 1.15 + 0.35) + "em" : "1.15em" }, txt); ts.textContent = l; });
    const setConcept = (x, y, r, sq, fs) => {
      g.setAttribute("transform", `translate(${x},${y})`);
      disc.setAttribute("rx", r); disc.setAttribute("ry", r * sq);
      txt.setAttribute("font-size", fs); txt.setAttribute("transform", `scale(1,${Math.max(0.55, sq + 0.2)})`);
    };
    setConcept(p.x, p.y, r0, 1, node.data("fontsize") * cy.zoom());

    // vrstvy školských stupňů (vysunou se nad koncept) + popisky s čarami
    const layers = ISO_LEVELS.map((lv, i) => {
      const lg = svgEl("g", { class: "iso-layer" + (isoAktivni(c, lv) ? " active" : ""), "data-iso": "level", "data-level": lv.id, opacity: 0 }, svg);
      svgEl("ellipse", { cx: 0, cy: 0, rx: TR, ry: TR * SQ }, lg);
      const bx = tx + TR + 70, by = () => ty - BASE - GAPY * i;
      const line = svgEl("line", { class: "iso-line", "data-iso": "level", "data-level": lv.id, opacity: 0 }, svg);
      const lab = svgEl("g", { class: "iso-tag" + (isoAktivni(c, lv) ? " active" : ""), "data-iso": "level", "data-level": lv.id, opacity: 0 }, svg);
      svgEl("rect", { x: 0, y: -18, width: 164, height: 36, rx: 9 }, lab);
      const t = svgEl("text", { x: 82, y: 0, "text-anchor": "middle", "dominant-baseline": "central" }, lab); t.textContent = lv.nazev;
      lab.setAttribute("transform", `translate(${bx},${by()})`);
      return { lg, line, lab, i, bx, y: by() };
    });
    const placeLayers = (k) => {            // k ∈ 0..1 = míra vysunutí
      layers.forEach(({ lg, line, lab, i, bx, y }) => {
        const kk = Math.max(0, Math.min(1, (k * (layers.length + 1) - i) ));    // postupně zespoda
        const yy = ty - (BASE + GAPY * i) * kk;
        lg.setAttribute("transform", `translate(${tx},${yy})`); lg.setAttribute("opacity", kk);
        line.setAttribute("x1", tx + TR * 0.8); line.setAttribute("y1", yy - TR * SQ * 0.35);
        line.setAttribute("x2", bx - 6); line.setAttribute("y2", y); line.setAttribute("opacity", kk);
        lab.setAttribute("opacity", kk);
      });
    };
    placeLayers(0);

    // animace: 1) bublina doletí a sklopí se (s přestřelením), 2) vrstvy se vysunou
    cancelAnimationFrame(isoRaf);
    tween(650, (e, t) => {
      const x = p.x + (tx - p.x) * e, y = p.y + (ty - p.y) * e, r = r0 + (TR - r0) * e;
      const sq = 1 + (SQ - 1) * easeOutCubic(t);
      setConcept(x, y, Math.max(4, r), sq, (node.data("fontsize") * cy.zoom()) + (TR * 0.13 - node.data("fontsize") * cy.zoom()) * e);
    }, easeOutBack, () => tween(700, (e) => placeLayers(e), easeOutBack));
  }

  function exitIso(silent) {
    if (!isoNode) return;
    cancelAnimationFrame(isoRaf);
    closeIsoBox(true);
    const host = document.getElementById("cy");
    host.classList.remove("iso-blur");
    isoEl.classList.remove("on");
    const svg = isoEl.querySelector(".km-iso-svg");
    if (silent) { isoEl.classList.add("hidden"); svg.innerHTML = ""; isoNode = null; return; }
    // bublina se vrátí na místo v mapě, vrstvy se zasunou
    const node = isoNode, p = node.renderedPosition(), r0 = node.renderedWidth() / 2;
    const g = svg.querySelector(".iso-concept"), disc = g && g.querySelector("ellipse");
    const m = g && /translate\(([-\d.]+),([-\d.]+)\)/.exec(g.getAttribute("transform"));
    const sx = m ? +m[1] : p.x, sy = m ? +m[2] : p.y, sr = disc ? +disc.getAttribute("rx") : r0;
    svg.querySelectorAll(".iso-layer, .iso-line, .iso-tag").forEach((el) => el.setAttribute("opacity", 0));
    isoNode = null;
    tween(380, (e) => {
      if (!g) return;
      g.setAttribute("transform", `translate(${sx + (p.x - sx) * e},${sy + (p.y - sy) * e})`);
      const r = sr + (r0 - sr) * e, sq = 0.5 + 0.5 * e;
      disc.setAttribute("rx", r); disc.setAttribute("ry", r * sq);
    }, easeOutCubic, () => { isoEl.classList.add("hidden"); svg.innerHTML = ""; });
  }

  // box s cíli a kritérii vrstvy (zatím stejný obsah pro všechny stupně — upřesní se)
  function openIsoBox(levelId) {
    const c = isoNode && isoNode.data("_c"); if (!c) return;
    const box = document.getElementById("km-isobox");
    if (levelId === "concept") {          // spodní kruh = koncept sám: popis, prerekvizity, RVP, kompetence…
      box.querySelector(".km-isobox-body").innerHTML = conceptHtml(c, true);
      box.classList.add("open");
      isoEl.querySelectorAll(".chosen").forEach((el) => el.classList.remove("chosen"));
      return;
    }
    const lv = ISO_LEVELS.find((l) => l.id === levelId) || ISO_LEVELS[1];
    box.querySelector(".km-isobox-body").innerHTML = `
      <span class="d-badge d-badge-acc">${esc(lv.nazev)}</span>
      <h2 class="d-title">${esc(c.nazev)}</h2>
      <div class="d-section"><h3>Ve výuce podle RVP</h3>${
        !lv.ovu ? '<p class="d-empty">Střední školy mapa zatím nezpracovává.</p>'
        : isoAktivni(c, lv) ? `<p class="d-desc">Koncept má obsah v Pojmech a obsazích Informatiky pro ${esc(lv.nazev)} (výstupy ${lv.ovu}).</p>`
        : `<p class="d-empty">Na ${lv.id === "zs1" ? "1." : "2."} stupni ZŠ RVP tento koncept neuvádí.</p>`}
        ${c.poznamka ? `<div class="d-rvp-note">${esc(typo(c.poznamka))}</div>` : ""}</div>
      <div class="d-section"><h3>Vzdělávací cíle</h3>${goals(c.cile)}</div>
      <div class="d-section"><h3>Kritéria hodnocení</h3>${goals(c.kriteria)}</div>`;
    box.classList.add("open");
    isoEl.querySelectorAll(".iso-layer, .iso-tag").forEach((el) => el.classList.toggle("chosen", el.dataset.level === lv.id));
  }
  function closeIsoBox(silent) {
    const box = document.getElementById("km-isobox"); if (!box) return;
    box.classList.remove("open");
    if (isoEl) isoEl.querySelectorAll(".chosen").forEach((el) => el.classList.remove("chosen"));
    if (silent) box.querySelector(".km-isobox-body").innerHTML = "";
  }

  /* ---------- Pomocné ---------- */
  function buildChips(containerId, items, filter, pressedDefault = true) {
    const el = document.getElementById(containerId);
    if (filter === "group") {      // oblasti: bílý text pod sebou se zaškrtávátkem
      el.className = "chk-list";
      el.innerHTML = items.map((it) =>
        `<button class="chip chk" data-filter="${filter}" data-val="${esc(it.val)}" aria-pressed="${pressedDefault}"><span class="chk-box" aria-hidden="true"></span>${esc(it.label)}</button>`).join("");
      return;
    }
    el.innerHTML = items.map((it) =>
      `<button class="chip" data-filter="${filter}" data-val="${esc(it.val)}" aria-pressed="${pressedDefault}">${
        it.color ? `<span class="swatch" style="background:${esc(it.color)}"></span>` : ""
      }${esc(it.label)}</button>`).join("");
  }

})();
