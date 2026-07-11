/* ==========================================================================
   Mapa znalostí — interaktivní graf (Cytoscape.js)
   Dvojí seskupení konceptů: podle témat (default) nebo podle okruhů RVP.
   Data: data/knowledge-map.yaml · schéma: ../structure.md
   ========================================================================== */
(function () {
  "use strict";

  const LEVELS = {
    "vybaveni": "Vybavení", "porozumeni": "Porozumění",
    "analyza": "Analýza", "vyuziti-znalosti": "Využití znalostí"
  };
  const VRSTVA = { core: "Core koncept", navazujici: "Navazující" };
  const VRSTVA_MAPY = { 0: "Základy a myšlení", 1: "Tvorba a programování", 2: "Umělá inteligence", 3: "Bezpečí a občanství" };
  const NORVP = "__norvp__";
  const NOKDI = "__nokdi__";
  const LINEH = 1.35;   // řádkování textu v bublinách (CSS i výpočet fit)

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

  /* Největší velikost písma, při níž se zalomený popisek vejde do kruhu s okrajem.
     Konzervativní: širší odhad znaku + reálné řádkování + větší vnitřní okraj. */
  function fitFont(label, size) {
    const usableW = size * 0.72, usableH = size * 0.72;
    const words = String(label).split(/\s+/);
    const longest = words.reduce((m, w) => Math.max(m, w.length), 0);
    for (let f = 10; f >= 5; f -= 0.5) {
      const charW = f * 0.60, lineH = f * LINEH;
      if (longest * charW > usableW) continue;          // nejdelší slovo se musí vejít na šířku
      const maxChars = Math.max(3, Math.floor(usableW / charW));
      let lines = 1, cur = 0;
      for (const w of words) {
        if (cur === 0) cur = w.length;
        else if (cur + 1 + w.length <= maxChars) cur += 1 + w.length;
        else { lines++; cur = w.length; }
      }
      if (lines * lineH <= usableH) return f;
    }
    return 5;
  }

  const statusEl = document.getElementById("status");
  const setStatus = (t) => { statusEl.textContent = t; statusEl.classList.toggle("hidden", !t); };

  let DATA = null, cy = null, viewMode = "tema", conceptById = {}, pinned = null;
  let revSouvisi = {}, revPrereq = {};   // reverzní indexy (obousměrné čtení hran v panelu)

  /* ---------- Načtení dat ---------- */
  fetch("data/knowledge-map.yaml?v=07")
    .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
    .then((txt) => init(jsyaml.load(txt)))
    .catch((e) => setStatus("Chyba načítání dat: " + e.message));

  /* ---------- Seskupení ---------- */
  function groupDefs(mode) {
    if (mode === "tema") return DATA.temata.map((t) => ({ id: t.id, nazev: t.nazev, barva: t.barva, popis: t.popis }));
    if (mode === "kompetence") {
      const k = (DATA.kompetence || []).map((x) => ({ id: x.id, nazev: x.nazev, barva: x.barva }));
      k.push({ id: NOKDI, nazev: "Nezařazeno (informatická teorie)", barva: "#ffffff" });
      return k;
    }
    const a = DATA.areas.map((x) => ({ id: x.id, nazev: x.nazev, barva: x.barva, popis: x.popis, kod: x.kod }));
    a.push({ id: NORVP, nazev: "Průřezové (digitální kompetence a postoje)", barva: "#ffffff", popis: "Klíčové kompetence a průřezová témata RVP — koncepty mimo jeden okruh Informatiky." });
    return a;
  }
  const groupOf = (c, mode) => mode === "tema" ? c.tema : mode === "kompetence" ? (c.kompetence || NOKDI) : (c.oblast || NORVP);
  const GROUP_LABEL = { tema: "Téma", oblast: "Oblast RVP", kompetence: "Digitální kompetence" };

  function buildElements(mode) {
    const groups = groupDefs(mode);
    const conceptIds = new Set(DATA.concepts.map((c) => c.id));

    const edges = []; const seen = new Set();
    DATA.concepts.forEach((c) => {
      (c.prerekvizity || []).forEach((p) => { if (conceptIds.has(p)) edges.push({ data: { id: "p-" + p + "-" + c.id, source: p, target: c.id, etype: "prereq" } }); });
      (c.souvisi || []).forEach((s) => {
        const key = [c.id, s].sort().join("~");
        if (seen.has(key) || !conceptIds.has(s)) return; seen.add(key);
        edges.push({ data: { id: "r-" + key, source: c.id, target: s, etype: "related" } });
      });
    });
    const deg = {};
    edges.forEach((e) => { deg[e.data.source] = (deg[e.data.source] || 0) + 1; deg[e.data.target] = (deg[e.data.target] || 0) + 1; });
    const sizeFor = (c) => {
      let s = 32 + (deg[c.id] || 0) * 6;
      s = Math.max(s, c.vrstva === "core" ? 58 : 46);
      return Math.min(s, 84);
    };

    const labelcolor = "#ffff00";  // nadpisy clusterů žlutě ve všech režimech
    const GRP_FONT = '600 13px "Inter", "Segoe UI", sans-serif';
    const nodes = [];
    groups.forEach((g) => nodes.push({ data: { id: "grp-" + g.id, type: "group", gid: g.id,
      label: wrapLabel(g.nazev, GRP_FONT, 180 * 0.95, true), labelcolor, popis: g.popis } }));
    DATA.concepts.forEach((c) => {
      const sz = sizeFor(c);
      const fs = fitFont(c.nazev, sz), textw = Math.round(sz * 0.72);
      const font = '400 ' + fs + 'px "Inter", "Segoe UI", sans-serif';
      nodes.push({ data: {
        id: c.id, type: "concept", parent: "grp-" + groupOf(c, mode),
        label: wrapLabel(c.nazev, font, textw * 0.95, false), vrstva: c.vrstva,
        stav: c.stav || "draft", tagy: c.tagy || [],
        size: sz, textw: textw, fontsize: fs, _c: c
      }});
    });
    return [...nodes, ...edges];
  }

  /* ==========================================================================
     Inicializace
     ========================================================================== */
  function init(data) {
    DATA = data; window.__data = data;
    data.concepts.forEach((c) => conceptById[c.id] = c);
    /* reverzní indexy hran (panel čte souvisí i „je prerekvizitou pro" obousměrně) */
    revSouvisi = {}; revPrereq = {};
    data.concepts.forEach((c) => {
      (c.souvisi || []).forEach((s) => (revSouvisi[s] = revSouvisi[s] || []).push(c.id));
      (c.prerekvizity || []).forEach((p) => (revPrereq[p] = revPrereq[p] || []).push(c.id));
    });

    cy = cytoscape({
      container: document.getElementById("cy"),
      elements: [], wheelSensitivity: 0.25, minZoom: 0.15, maxZoom: 2.5,
      style: [
        { selector: "node[type='group']", style: {
          "background-opacity": 0, "border-width": 0,
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "180px",
          "text-valign": "top", "text-halign": "center", "text-margin-y": -12,
          "color": "data(labelcolor)", "font-size": "13px", "font-weight": "600",
          "text-transform": "uppercase", "line-height": 1.4, "padding": "26px"
        }},
        { selector: "node[type='concept']", style: {
          "shape": "ellipse", "width": "data(size)", "height": "data(size)",
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "data(textw)",
          "text-valign": "center", "text-halign": "center", "line-height": LINEH,
          "font-size": "data(fontsize)", "font-weight": "400", "border-width": 1.5
        }},
        { selector: "node[vrstva='core']", style: { "background-color": "#ffffff", "color": "#0a0a0c", "border-width": 0 } },
        { selector: "node[vrstva='navazujici']", style: { "background-color": "#0a0a0c", "color": "#ffffff", "border-color": "#ffffff", "border-width": 1.8 } },
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
        { selector: "node[type='concept']:selected", style: { "border-width": 4, "border-color": "#ffff00" } },
        { selector: "node.nbon[vrstva='core'], node[type='concept']:selected[vrstva='core']", style: { "background-color": "#ffff00", "color": "#0a0a0c", "border-width": 0 } },
        { selector: ".dim", style: { "opacity": 0.08 } },
        { selector: ".filtered", style: { "display": "none" } }
      ]
    });
    window.__cy = cy;
    initHulls(cy);

    /* tagy (filtr, jednou) */
    const allTags = [...new Set(data.concepts.flatMap((c) => c.tagy || []))].sort((a, b) => a.localeCompare(b, "cs"));
    buildChips("filter-tagy", allTags.map((t) => ({ val: t, label: t })), "tagy", false);

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

    /* přepínač zobrazení */
    document.querySelectorAll(".vt-btn").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.view === viewMode) return;
      document.querySelectorAll(".vt-btn").forEach((x) => x.classList.toggle("active", x === b));
      render(b.dataset.view);
    }));

    /* interakce grafu */
    cy.on("tap", "node", (evt) => openDetail(evt.target));
    cy.on("tap", (evt) => {
      if (evt.target !== cy) return;               // klik do prázdna
      const pt = evt.position; let best = null, bestD = Infinity;
      cy.nodes("[type='group']").forEach((g) => {
        if (g.hasClass("filtered")) return;
        const bb = g.boundingBox({ includeLabels: false });
        const d = Math.hypot(pt.x - (bb.x1 + bb.x2) / 2, pt.y - bb.y1);   // vzdálenost od názvu clusteru (nahoře)
        if (d < bestD) { bestD = d; best = g; }
      });
      if (best && bestD < 90 / cy.zoom()) openDetail(best);   // klik poblíž názvu → detail clusteru
      else closeDetail();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDetail();
    });

    render("tema");
    setStatus(data.concepts.length + " konceptů · " + data.temata.length + " témat · " + data.areas.length + " okruhů RVP");
  }

  /* ---------- Vykreslení režimu ---------- */
  function render(mode) {
    viewMode = mode;
    closeDetail();
    cy.elements().remove();
    cy.add(buildElements(mode));
    buildGroupFilter(mode);
    document.getElementById("group-label").textContent = GROUP_LABEL[mode] || "Skupina";
    clusterLayout();
    cy.fit(cy.nodes(), 40);
    if (window.__drawHulls) window.__drawHulls();
    applyFilters();
  }

  /* Deterministické klastrové rozmístění: každý cluster = packed disk (phyllotaxis),
     clustery v mřížce. Stabilní, rychlé, blob estetika. */
  function clusterLayout() {
    const groups = cy.nodes("[type='group']");
    const G = groups.length;
    const cols = Math.ceil(Math.sqrt(G));
    const spread = 50;
    const maxK = Math.max(1, ...groups.map((g) => g.children("[type='concept']").length));
    const cell = Math.max(560, spread * Math.sqrt(maxK) * 2 + 200);
    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    groups.forEach((g, i) => {
      const gx = (i % cols) * cell;
      const gy = Math.floor(i / cols) * cell;
      const kids = g.children("[type='concept']").sort((a, b) => b.data("size") - a.data("size"));
      kids.forEach((n, j) => {
        const ang = j * GOLDEN;
        const rad = spread * Math.sqrt(j + 0.5);
        n.position({ x: gx + Math.cos(ang) * rad, y: gy + Math.sin(ang) * rad });
      });
    });
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
    const gr = pressed("group"), vr = pressed("vrstva"), st = pressed("stav"), tg = pressed("tagy"), eg = pressed("edge");
    cy.batch(() => {
      cy.nodes("[type='concept']").forEach((n) => {
        const c = n.data("_c");
        const vis = gr.has(groupOf(c, viewMode)) && vr.has(c.vrstva) && st.has(n.data("stav")) &&
          (tg.size === 0 || (c.tagy || []).some((t) => tg.has(t)));
        n.toggleClass("filtered", !vis);
      });
      cy.nodes("[type='group']").forEach((g) => {
        const empty = g.children("[type='concept']").filter((k) => !k.hasClass("filtered")).length === 0;
        g.toggleClass("filtered", empty || !gr.has(g.data("gid")));
      });
      cy.edges().forEach((e) => e.toggleClass("filtered",
        e.source().hasClass("filtered") || e.target().hasClass("filtered") || !eg.has(e.data("etype"))));
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
      cy.nodes("[type='concept']").forEach((n) => {
        if (n.hasClass("filtered")) { n.removeClass("dim hl"); return; }
        if (!q) { n.removeClass("dim hl"); return; }
        const c = n.data("_c");
        const hit = n.data("label").toLowerCase().includes(q) || (c && (c.popis || "").toLowerCase().includes(q));
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

  function focusNode(id) {
    const n = cy.getElementById(id);
    if (!n || n.empty() || n.hasClass("filtered")) return;
    cy.animate({ center: { eles: n }, zoom: Math.max(cy.zoom(), 1) }, { duration: 300 });
    openDetail(n);
  }
  function link(id) {
    const c = conceptById[id];
    return `<button class="d-link" data-focus="${esc(id)}">${esc(typo(c ? c.nazev : id))}</button>`;
  }

  function openDetail(node) {
    cy.$(":selected").unselect(); node.select();
    if (node.data("type") === "group") {
      detailBody.innerHTML = groupHtml(node.data("gid"), "#ffff00", node.data("label"));
      pinned = null; clearNb();
    } else {
      detailBody.innerHTML = conceptHtml(node.data("_c"));
      pinned = node; focusNb(node);
      cy.animate({ fit: { eles: node.closedNeighborhood(), padding: 80 }, duration: 350 });
    }
    detailBody.querySelectorAll("[data-focus]").forEach((b) => b.addEventListener("click", () => focusNode(b.dataset.focus)));
    detail.classList.remove("hidden");
  }

  function goals(list) {
    if (!list || !list.length) return '<span class="d-empty">doplní se v detailní fázi</span>';
    return list.map((g) => {
      const lvl = LEVELS[g.uroven] || g.uroven || "";
      const roc = g.orientacne_rocnik ? `<span class="rocnik">~ ${esc(g.orientacne_rocnik)}. ročník</span>` : "";
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
      if (src.vrstva_mapy != null) meta = `<div class="d-meta"><span class="d-pill">${esc(VRSTVA_MAPY[src.vrstva_mapy] || ("vrstva " + src.vrstva_mapy))}</span></div>`;
      const nav = (src.navazuje_na || []).map((id) => { const t = DATA.temata.find((x) => x.id === id); return `<span class="d-tag">${esc(t ? t.nazev : id)}</span>`; }).join("");
      if (nav) extra = `<div class="d-section"><h3>Navazuje na</h3><div class="d-tags">${nav}</div></div>`;
    } else if (viewMode === "kompetence") {
      src = (DATA.kompetence || []).find((k) => k.id === gid) || {};
      if (src.kod) meta = `<div class="d-meta"><span class="d-pill">${esc(src.kod)}</span></div>`;
      if (src.vystup) extra = `<div class="d-section"><h3>Očekávaný výstup KDI</h3><div class="d-rvp">${esc(typo(src.vystup))}</div></div>`;
      if (gid === NOKDI) fallback = "Ryzí informatická teorie — myšlení, primitiva programování, vnitřek infrastruktury, teorie AI.";
      else if (!src.popis) fallback = (DATA.meta && DATA.meta.kompetence_popis) || "";
    } else {
      src = DATA.areas.find((a) => a.id === gid) || {};
      if (src.kod) meta = `<div class="d-meta"><span class="d-pill">${esc(src.kod)}</span></div>`;
      if (gid === NORVP) fallback = "Klíčové kompetence a průřezová témata RVP — koncepty mimo jeden okruh Informatiky.";
    }
    return `
      <span class="d-badge" style="background:${bg};color:#000000">${esc(GROUP_LABEL[viewMode])}</span>
      <h2 class="d-title">${esc(src.nazev || label || gid)}</h2>
      ${meta}
      ${paras(src.popis, fallback)}
      ${extra}
      <div class="d-section"><h3>Konceptů: ${count}</h3></div>
      <div class="d-section"><h3>Core koncepty</h3><div class="d-links">${cores.map((c) => link(c.id)).join("") || '<span class="d-empty">—</span>'}</div></div>`;
  }

  function conceptHtml(c) {
    const tema = (DATA.temata.find((t) => t.id === c.tema) || {});
    const oblast = c.oblast ? (DATA.areas.find((a) => a.id === c.oblast) || {}) : null;
    const komp = c.kompetence ? ((DATA.kompetence || []).find((k) => k.id === c.kompetence) || null) : null;
    const rvp = (c.rvp || []).length
      ? c.rvp.map((r) => `<div class="d-rvp"><span class="kod">${esc(r.kod)}</span>${esc(typo(r.vystup))}</div>`).join("")
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
    return `
      <span class="d-badge" style="background:#ffffff;color:#000000">${esc(tema.nazev || c.tema)}</span>
      <h2 class="d-title">${esc(c.nazev)}</h2>
      <div class="d-meta">
        <span class="d-pill ${c.vrstva === "core" ? "core" : ""}">${esc(VRSTVA[c.vrstva] || c.vrstva)}</span>
        <span class="d-pill">${esc(c.stav || "draft")}</span>
        <span class="d-pill">${oblast ? esc(oblast.nazev) : "průřezové"}</span>
        ${komp ? `<span class="d-pill">${esc(komp.nazev)}</span>` : ""}
      </div>
      <p class="d-desc">${esc(typo(c.popis))}</p>
      <div class="d-section"><h3>Vzdělávací cíle</h3>${goals(c.cile)}</div>
      <div class="d-section"><h3>Kritéria hodnocení</h3>${goals(c.kriteria)}</div>
      <div class="d-section"><h3>RVP — očekávaný výstup</h3>${rvp}</div>
      <div class="d-section"><h3>Digitální kompetence</h3>${kdi}</div>
      <div class="d-section"><h3>Prerekvizity</h3><div class="d-links">${links(c.prerekvizity)}</div></div>
      <div class="d-section"><h3>Je prerekvizitou pro</h3><div class="d-links">${links(jePrereqPro)}</div></div>
      <div class="d-section"><h3>Souvisí</h3><div class="d-links">${links(souvisiIds)}</div></div>
      <div class="d-section"><h3>Tagy</h3><div class="d-tags">${tags}</div></div>
      <div class="d-section"><h3>Zdroj</h3>${zdroj}</div>`;
  }

  /* ---------- Organické obrysy clusterů (canvas overlay) ---------- */
  function convexHull(points) {
    const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (pts.length < 3) return pts;
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [];
    for (const p of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
    const upper = [];
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
    lower.pop(); upper.pop(); return lower.concat(upper);
  }
  function strokeSmooth(ctx, pts) {
    const n = pts.length; if (n < 3) return;
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    ctx.beginPath();
    const m0 = mid(pts[n - 1], pts[0]); ctx.moveTo(m0[0], m0[1]);
    for (let i = 0; i < n; i++) { const cur = pts[i], nxt = pts[(i + 1) % n], m = mid(cur, nxt); ctx.quadraticCurveTo(cur[0], cur[1], m[0], m[1]); }
    ctx.closePath(); ctx.stroke();
  }
  function initHulls(cy) {
    const cyDiv = document.getElementById("cy");
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:0";
    cyDiv.insertBefore(canvas, cyDiv.firstChild);
    const ctx = canvas.getContext("2d");
    function resize() {
      const r = cyDiv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.restore();
      ctx.save(); ctx.setLineDash([6, 7]); ctx.lineWidth = 1.3;
      cy.nodes("[type='group']").forEach((group) => {
        if (group.hasClass("filtered")) return;
        const kids = group.children("[type='concept']").filter((n) => !n.hasClass("filtered"));
        if (kids.length === 0) return;
        ctx.strokeStyle = "rgba(255,255,255,0.32)";
        const pts = [];
        kids.forEach((n) => {
          const p = n.renderedPosition(), r = n.renderedWidth() / 2 + 16;
          for (let a = 0; a < 12; a++) { const ang = a / 12 * 2 * Math.PI; pts.push([p.x + Math.cos(ang) * r, p.y + Math.sin(ang) * r]); }
        });
        strokeSmooth(ctx, convexHull(pts));
      });
      ctx.restore();
    }
    resize();
    window.addEventListener("resize", () => { resize(); draw(); });
    cy.on("render", draw);
    window.__drawHulls = draw;
  }

  /* ---------- Pomocné ---------- */
  function buildChips(containerId, items, filter, pressedDefault = true) {
    const el = document.getElementById(containerId);
    el.innerHTML = items.map((it) =>
      `<button class="chip" data-filter="${filter}" data-val="${esc(it.val)}" aria-pressed="${pressedDefault}">${
        it.color ? `<span class="swatch" style="background:${esc(it.color)}"></span>` : ""
      }${esc(it.label)}</button>`).join("");
  }

})();
