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

    /* Uzly */
    const nodes = [];
    areas.forEach((a) => nodes.push({ data: {
      id: a.id, type: "area", label: a.nazev, popis: a.popis || "",
      color: a.barva, textcolor: textOn(a.barva || "#888888")
    }}));
    concepts.forEach((c) => {
      const color = areaColor[c.oblast] || "#888888";
      nodes.push({ data: {
        id: c.id, type: "concept", label: c.nazev, color,
        vrstva: c.vrstva, stav: c.stav || "draft", oblast: c.oblast,
        tagy: c.tagy || [], _c: c
      }});
    });

    /* Hrany */
    const edges = []; const seen = new Set();
    const addEdge = (id, s, t, etype) => {
      if (!ids.has(s) || !ids.has(t) || s === t) return;
      edges.push({ data: { id, source: s, target: t, etype } });
    };
    concepts.forEach((c) => {
      if (c.vrstva === "core") addEdge("m-" + c.id, c.oblast, c.id, "membership");
      (c.prerekvizity || []).forEach((p) => addEdge("p-" + p + "-" + c.id, p, c.id, "prereq"));
      (c.souvisi || []).forEach((s) => {
        const key = [c.id, s].sort().join("~");
        if (seen.has(key)) return; seen.add(key);
        addEdge("r-" + key, c.id, s, "related");
      });
    });

    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: { nodes, edges },
      wheelSensitivity: 0.25,
      minZoom: 0.25, maxZoom: 2.5,
      style: [
        { selector: "node[type='area']", style: {
          "shape": "ellipse", "background-color": "data(color)",
          "width": "label", "height": "label", "padding": "26px",
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "150px",
          "text-valign": "center", "text-halign": "center",
          "color": "data(textcolor)", "font-size": "15px", "font-weight": "600",
          "border-width": 3, "border-color": "rgba(0,0,0,0.25)"
        }},
        { selector: "node[type='concept']", style: {
          "shape": "ellipse", "background-color": "data(color)",
          "width": 42, "height": 42,
          "label": "data(label)", "text-wrap": "wrap", "text-max-width": "96px",
          "text-valign": "bottom", "text-halign": "center", "text-margin-y": 5,
          "color": "#ffffff", "font-size": "11px", "font-weight": "500"
        }},
        { selector: "node[vrstva='core']", style: {
          "width": 58, "height": 58, "border-width": 2, "border-color": "#ffffff"
        }},
        { selector: "edge[etype='membership']", style: {
          "line-color": "rgba(208,208,208,0.30)", "width": 2, "curve-style": "bezier"
        }},
        { selector: "edge[etype='prereq']", style: {
          "line-color": "rgba(208,208,208,0.6)", "width": 2, "curve-style": "bezier",
          "target-arrow-shape": "triangle", "target-arrow-color": "rgba(208,208,208,0.6)",
          "arrow-scale": 1.1
        }},
        { selector: "edge[etype='related']", style: {
          "line-color": "rgba(208,208,208,0.45)", "width": 1.5, "line-style": "dashed", "curve-style": "bezier"
        }},
        { selector: ".hl", style: { "border-width": 3, "border-color": "#ffff00" } },
        { selector: ".dim", style: { "opacity": 0.12 } },
        { selector: ".filtered", style: { "display": "none" } },
        { selector: "node:selected", style: { "border-width": 3, "border-color": "#ffff00" } }
      ],
      layout: {
        name: "cose", animate: true, animationDuration: 600, padding: 60,
        nodeRepulsion: 9000, idealEdgeLength: 95, edgeElasticity: 120,
        nestingFactor: 1.1, gravity: 0.3, componentSpacing: 120
      }
    });

    window.__cy = cy;
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
        cy.nodes().forEach((n) => {
          let vis;
          if (n.data("type") === "area") vis = ob.has(n.id());
          else {
            const c = n.data("_c");
            vis = ob.has(c.oblast) && vr.has(c.vrstva) && st.has(n.data("stav")) &&
              (tg.size === 0 || (c.tagy || []).some((t) => tg.has(t)));
          }
          n.toggleClass("filtered", !vis);
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
          `<span class="d-badge" style="background:${esc(node.data("color"))};color:${esc(node.data("textcolor"))}">Oblast</span>
           <h2 class="d-title">${esc(node.data("label"))}</h2>
           <p class="d-desc">${esc(node.data("popis"))}</p>
           <div class="d-section"><h3>Core koncepty</h3><div class="d-links">${cores.map((c) => link(c.id)).join("") || '<span class="d-empty">—</span>'}</div></div>`;
      } else {
        detailBody.innerHTML = conceptHtml(node.data("_c"), node.data("color"), areaColor);
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

    function conceptHtml(c, color) {
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

  /* ---------- Pomocné ---------- */
  function buildChips(containerId, items, filter, pressedDefault = true) {
    const el = document.getElementById(containerId);
    el.innerHTML = items.map((it) =>
      `<button class="chip" data-filter="${filter}" data-val="${esc(it.val)}" aria-pressed="${pressedDefault}">${
        it.color ? `<span class="swatch" style="background:${esc(it.color)}"></span>` : ""
      }${esc(it.label)}</button>`).join("");
  }

})();
