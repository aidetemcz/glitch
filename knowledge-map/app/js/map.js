/* ==========================================================================
   Mapa znalostí — interaktivní graf (Cytoscape.js)
   Data: data/knowledge-map.yaml · schéma: ../structure.md
   ========================================================================== */
(function () {
  "use strict";

  const LEVELS = {
    "vybaveni": "Vybavení",
    "porozumeni": "Porozumění",
    "analyza": "Analýza",
    "vyuziti-znalosti": "Využití znalostí"
  };
  const VRSTVA = { core: "Core koncept", navazujici: "Navazující" };

  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* Největší velikost písma, při níž se zalomený popisek vejde do kruhu s okrajem */
  function fitFont(label, size) {
    const usableW = size * 0.78, usableH = size * 0.78;
    const words = String(label).split(/\s+/);
    const longest = words.reduce((m, w) => Math.max(m, w.length), 0);
    for (let f = 11; f >= 6; f -= 0.5) {
      const charW = f * 0.56, lineH = f * 1.4;
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
    return 6;
  }

  function textOn(hex) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#000000" : "#ffffff";
  }

  const statusEl = document.getElementById("status");
  const setStatus = (t) => { statusEl.textContent = t; statusEl.classList.toggle("hidden", !t); };

  /* ---------- Načtení dat ---------- */
  fetch("data/knowledge-map.yaml?v=1")
    .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
    .then((txt) => init(jsyaml.load(txt)))
    .catch((e) => setStatus("Chyba načítání dat: " + e.message));

  function init(data) {
    const areas = data.areas || [];
    const concepts = data.concepts || [];
    const areaColor = {}; areas.forEach((a) => areaColor[a.id] = a.barva || "#888888");
    const conceptById = {}; concepts.forEach((c) => conceptById[c.id] = c);
    const ids = new Set([...areas.map((a) => a.id), ...concepts.map((c) => c.id)]);

    /* Hrany (prerekvizity + souvisí; oblasti drží koncepty jako compound rodič) */
    const edges = []; const seen = new Set();
    const addEdge = (id, s, t, etype) => {
      if (!ids.has(s) || !ids.has(t) || s === t) return;
      edges.push({ data: { id, source: s, target: t, etype } });
    };
    concepts.forEach((c) => {
      (c.prerekvizity || []).forEach((p) => addEdge("p-" + p + "-" + c.id, p, c.id, "prereq"));
      (c.souvisi || []).forEach((s) => {
        const key = [c.id, s].sort().join("~");
        if (seen.has(key)) return; seen.add(key);
        addEdge("r-" + key, c.id, s, "related");
      });
    });

    /* Stupeň uzlu (počet vazeb) → velikost bubliny (organická variabilita) */
    const deg = {};
    edges.forEach((e) => { deg[e.data.source] = (deg[e.data.source] || 0) + 1; deg[e.data.target] = (deg[e.data.target] || 0) + 1; });
    const sizeFor = (c) => {
      let s = 40 + (deg[c.id] || 0) * 8;
      s = Math.max(s, c.vrstva === "core" ? 66 : 50);
      return Math.min(s, 92);
    };

    /* Uzly: oblasti = compound rodič (obrys clusteru), koncepty = bubliny s textem uvnitř */
    const nodes = [];
    areas.forEach((a) => nodes.push({ data: {
      id: a.id, type: "area", label: a.nazev, popis: a.popis || "", color: a.barva || "#ffffff"
    }}));
    concepts.forEach((c) => {
      const sz = sizeFor(c);
      nodes.push({ data: {
        id: c.id, type: "concept", parent: ids.has(c.oblast) ? c.oblast : undefined,
        label: c.nazev, vrstva: c.vrstva, stav: c.stav || "draft", oblast: c.oblast,
        tagy: c.tagy || [], size: sz, textw: Math.round(sz * 0.78),
        fontsize: fitFont(c.nazev, sz), _c: c
      }});
    });

    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: { nodes, edges },
      wheelSensitivity: 0.25,
      minZoom: 0.25, maxZoom: 2.5,
      style: [
        { selector: "node[type='area']", style: {
          "background-opacity": 0, "border-width": 0,
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "170px",
          "text-valign": "top", "text-halign": "center", "text-margin-y": -14,
          "color": "rgba(255,255,255,0.85)", "font-size": "13px", "font-weight": "600",
          "text-transform": "uppercase", "padding": "30px"
        }},
        { selector: "node[type='concept']", style: {
          "shape": "ellipse", "width": "data(size)", "height": "data(size)",
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "data(textw)",
          "text-valign": "center", "text-halign": "center", "text-line-height": 1.4,
          "font-size": "data(fontsize)", "font-weight": "400", "border-width": 1.5
        }},
        { selector: "node[vrstva='core']", style: {
          "background-color": "#ffffff", "color": "#0a0a0c", "border-width": 0
        }},
        { selector: "node[vrstva='navazujici']", style: {
          "background-color": "#0a0a0c", "color": "#ffffff",
          "border-color": "#ffffff", "border-width": 1.8
        }},
        { selector: "edge[etype='prereq']", style: {
          "line-color": "rgba(255,255,255,0.5)", "width": 1.4, "line-style": "dashed", "curve-style": "bezier",
          "target-arrow-shape": "triangle", "target-arrow-color": "rgba(255,255,255,0.7)", "arrow-scale": 1
        }},
        { selector: "edge[etype='related']", style: {
          "line-color": "rgba(255,255,255,0.3)", "width": 1, "line-style": "dotted", "curve-style": "bezier"
        }},
        { selector: ".hl", style: { "border-width": 4, "border-color": "#ffff00", "border-opacity": 1 } },
        { selector: "node[type='concept']:selected", style: { "border-width": 4, "border-color": "#ffff00" } },
        { selector: ".dim", style: { "opacity": 0.1 } },
        { selector: ".filtered", style: { "display": "none" } }
      ],
      layout: {
        name: "cose", animate: true, animationDuration: 650, padding: 40,
        nodeRepulsion: 4200, idealEdgeLength: 58, edgeElasticity: 90,
        nestingFactor: 1.2, gravity: 0.75, componentSpacing: 60, nodeOverlap: 8, randomize: true
      }
    });

    window.__cy = cy;
    initHulls(cy);
    setStatus(concepts.length + " konceptů · " + areas.length + " oblasti");

    /* ---------- Filtry (chip UI) ---------- */
    buildChips("filter-oblast", areas.map((a) => ({ val: a.id, label: a.nazev, color: a.barva })), "oblast");
    const allTags = [...new Set(concepts.flatMap((c) => c.tagy || []))].sort((a, b) => a.localeCompare(b, "cs"));
    buildChips("filter-tagy", allTags.map((t) => ({ val: t, label: t })), "tagy", false);

    document.querySelectorAll(".chip").forEach((chip) =>
      chip.addEventListener("click", () => {
        chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") === "true" ? "false" : "true");
        applyFilters();
      }));
    document.getElementById("reset").addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) =>
        c.setAttribute("aria-pressed", c.dataset.filter === "tagy" ? "false" : "true"));
      document.getElementById("search").value = "";
      applyFilters();
    });
    document.getElementById("search").addEventListener("input", applySearch);

    function pressed(filter) {
      const set = new Set();
      document.querySelectorAll(`.chip[data-filter='${filter}'][aria-pressed='true']`)
        .forEach((c) => set.add(c.dataset.val));
      return set;
    }

    function applyFilters() {
      const ob = pressed("oblast"), vr = pressed("vrstva"), st = pressed("stav"), tg = pressed("tagy");
      cy.batch(() => {
        cy.nodes("[type='concept']").forEach((n) => {
          const c = n.data("_c");
          const vis = ob.has(c.oblast) && vr.has(c.vrstva) && st.has(n.data("stav")) &&
            (tg.size === 0 || (c.tagy || []).some((t) => tg.has(t)));
          n.toggleClass("filtered", !vis);
        });
        cy.nodes("[type='area']").forEach((a) => {
          const empty = a.children("[type='concept']").filter((k) => !k.hasClass("filtered")).length === 0;
          a.toggleClass("filtered", !ob.has(a.id()) || empty);
        });
        cy.edges().forEach((e) =>
          e.toggleClass("filtered", e.source().hasClass("filtered") || e.target().hasClass("filtered")));
      });
      applySearch();
    }

    function applySearch() {
      const q = document.getElementById("search").value.trim().toLowerCase();
      cy.batch(() => {
        cy.nodes().forEach((n) => {
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

    cy.on("tap", "node", (evt) => openDetail(evt.target));
    cy.on("tap", (evt) => { if (evt.target === cy) closeDetail(); });

    function closeDetail() { detail.classList.add("hidden"); cy.$(":selected").unselect(); }

    function focusNode(id) {
      const n = cy.getElementById(id);
      if (!n || n.empty() || n.hasClass("filtered")) return;
      cy.animate({ center: { eles: n }, zoom: Math.max(cy.zoom(), 1) }, { duration: 300 });
      openDetail(n);
    }

    function link(id) {
      const c = conceptById[id]; const label = c ? c.nazev : id;
      return `<button class="d-link" data-focus="${esc(id)}">${esc(label)}</button>`;
    }

    function openDetail(node) {
      cy.$(":selected").unselect(); node.select();
      if (node.data("type") === "area") {
        const cores = concepts.filter((c) => c.oblast === node.id() && c.vrstva === "core");
        detailBody.innerHTML =
          `<span class="d-badge" style="background:${esc(node.data("color"))};color:${esc(textOn(node.data("color") || "#ffffff"))}">Oblast</span>
           <h2 class="d-title">${esc(node.data("label"))}</h2>
           <p class="d-desc">${esc(node.data("popis"))}</p>
           <div class="d-section"><h3>Core koncepty</h3><div class="d-links">${cores.map((c) => link(c.id)).join("") || '<span class="d-empty">—</span>'}</div></div>`;
      } else {
        detailBody.innerHTML = conceptHtml(node.data("_c"));
      }
      detailBody.querySelectorAll("[data-focus]").forEach((b) =>
        b.addEventListener("click", () => focusNode(b.dataset.focus)));
      detail.classList.remove("hidden");
    }

    function goals(list) {
      if (!list || !list.length) return '<span class="d-empty">—</span>';
      return list.map((g) => {
        const lvl = LEVELS[g.uroven] || g.uroven || "";
        const roc = g.orientacne_rocnik ? `<span class="rocnik">~ ${esc(g.orientacne_rocnik)}. ročník</span>` : "";
        return `<div class="d-goal"><div class="lvl">${esc(lvl)}${roc}</div><p>${esc(g.text)}</p></div>`;
      }).join("");
    }

    function conceptHtml(c) {
      const color = areaColor[c.oblast] || "#ffffff";
      const area = (areas.find((a) => a.id === c.oblast) || {}).nazev || c.oblast;
      const rvp = (c.rvp || []).length
        ? c.rvp.map((r) => `<div class="d-rvp"><span class="kod">${esc(r.kod)}</span>${esc(r.vystup)}</div>`).join("")
        : '<span class="d-empty">—</span>';
      const tags = (c.tagy || []).length
        ? c.tagy.map((t) => `<span class="d-tag">${esc(t)}</span>`).join("") : '<span class="d-empty">—</span>';
      const links = (arr) => (arr && arr.length) ? arr.map(link).join("") : '<span class="d-empty">—</span>';
      const glitches = (c.pokryti_glitchem || []).length
        ? c.pokryti_glitchem.map((g) => `<span class="d-glitch">${esc(g)}</span>`).join("") : '<span class="d-empty">zatím žádný</span>';
      const zdroj = (c.zdroj || []).length
        ? c.zdroj.map((z) => `<div class="d-rvp">${esc(z)}</div>`).join("") : '<span class="d-empty">—</span>';
      return `
        <span class="d-badge" style="background:${esc(color)};color:${esc(textOn(color))}">${esc(area)}</span>
        <h2 class="d-title">${esc(c.nazev)}</h2>
        <div class="d-meta">
          <span class="d-pill ${c.vrstva === "core" ? "core" : ""}">${esc(VRSTVA[c.vrstva] || c.vrstva)}</span>
          <span class="d-pill">${esc(c.stav || "draft")}</span>
        </div>
        <p class="d-desc">${esc(c.popis)}</p>
        <div class="d-section"><h3>Vzdělávací cíle</h3>${goals(c.cile)}</div>
        <div class="d-section"><h3>Kritéria hodnocení</h3>${goals(c.kriteria)}</div>
        <div class="d-section"><h3>RVP</h3>${rvp}</div>
        <div class="d-section"><h3>Prerekvizity</h3><div class="d-links">${links(c.prerekvizity)}</div></div>
        <div class="d-section"><h3>Souvisí</h3><div class="d-links">${links(c.souvisi)}</div></div>
        <div class="d-section"><h3>Tagy</h3><div class="d-tags">${tags}</div></div>
        <div class="d-section"><h3>Pokrytí Glitchem</h3><div class="d-links">${glitches}</div></div>
        <div class="d-section"><h3>Zdroj</h3>${zdroj}</div>`;
    }

    /* ---------- Mobil: přepínač panelu ---------- */
    const burger = document.createElement("button");
    burger.textContent = "☰ Filtry"; burger.id = "burger";
    burger.style.cssText = "position:fixed;top:14px;left:14px;z-index:40;background:#ffff00;color:#000;border-radius:8px;padding:8px 12px;font-weight:600;font-size:14px;display:none";
    burger.addEventListener("click", () => document.getElementById("controls").classList.toggle("open"));
    document.body.appendChild(burger);
    const mq = window.matchMedia("(max-width: 720px)");
    const syncBurger = () => { burger.style.display = mq.matches ? "block" : "none"; };
    mq.addEventListener("change", syncBurger); syncBurger();
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
      const w = canvas.width, h = canvas.height;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h); ctx.restore();
      ctx.save();
      ctx.setLineDash([6, 7]); ctx.lineWidth = 1.4; ctx.strokeStyle = "rgba(255,255,255,0.38)";
      cy.nodes("[type='area']").forEach((area) => {
        if (area.hasClass("filtered")) return;
        const kids = area.children("[type='concept']").filter((n) => !n.hasClass("filtered"));
        if (kids.length === 0) return;
        const pts = [];
        kids.forEach((n) => {
          const p = n.renderedPosition(), r = n.renderedWidth() / 2 + 18;
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
