/* ==========================================================================
   Glitch — Uživatelský profil (celoobrazovkový panel)
   Otevírá se z profilu ve spodním menu (řídí auth.js). Taby: Glitchboard,
   Questy, Uložené, Nastavení. Nastavení se ukládají do localStorage
   (později propíšeme do Supabase: facet_affinities / profiles).
   ========================================================================== */
(function () {
  "use strict";

  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ---------- perzistence ---------- */
  const SETTINGS_KEY = "tg_settings";
  const INTERESTS_KEY = "tg_interests";
  const DEFAULTS = {
    soukromi_glitchfeed: true, soukromi_questy: true, soukromi_glitchboard: true,
    faseta_hloubka: false, faseta_obrazky: false, uceni_interakce: true,
    odkoho_glitch: true, odkoho_komunita: true, odkoho_generovany: true,
    mood_checkin: true, notifikace: true
  };
  function getSettings() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); } catch (_) {}
    return Object.assign({}, DEFAULTS, s);
  }
  function setSetting(key, val) {
    const s = getSettings(); s[key] = val;
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (_) {}
    // propsat do Supabase (profiles.settings) — tiše degraduje, když není přihlášení/sloupec
    try { if (typeof sbSaveSettings === "function") sbSaveSettings(s); } catch (_) {}
  }
  function getInterests() {
    try { return JSON.parse(localStorage.getItem(INTERESTS_KEY) || "[]"); } catch (_) { return []; }
  }
  function setInterests(arr) {
    try { localStorage.setItem(INTERESTS_KEY, JSON.stringify(arr)); } catch (_) {}
  }

  /* ---------- osobní údaje (tg_user): přezdívka, gender, věk, avatar ----------
     Lokálně vždy; přezdívku, gender i věk (→ profiles.vek) propíšeme i do Supabase.
     Nahraný avatar zatím jen lokálně (velký data URL — přesuneme do Storage později). */
  const USER_KEY = "tg_user";
  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "{}"); } catch (_) { return {}; }
  }
  function setUserFields(fields) {
    const u = Object.assign(getUser(), fields);
    try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch (_) {}
    try {
      if (typeof sbSaveProfile === "function") {
        const cols = {};
        if ("nickname" in fields) cols.nickname = fields.nickname;
        if ("gender" in fields) cols.gender = fields.gender;
        if ("age" in fields) cols.vek = fields.age;           // věk → profiles.vek
        if (Object.keys(cols).length) sbSaveProfile(cols);
      }
    } catch (_) {}
    return u;
  }

  /* Profilový obrázek: vlastní nahraný → Google avatar → maskot. */
  const metaAvatar = (u) => { const m = (u && u.user_metadata) || {}; return m.avatar_url || m.picture || null; };
  const avatarSrc = (u) => getUser().avatar || metaAvatar(u) || "assets/ui/avatar-icon.png";

  /* Nahraný obrázek zmenšíme na max 256 px (ať se vejde do localStorage). */
  function readImageScaled(file, cb) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 256, scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        try { cb(cv.toDataURL("image/jpeg", 0.85)); } catch (_) { cb(null); }
      };
      img.onerror = () => cb(null);
      img.src = reader.result;
    };
    reader.onerror = () => cb(null);
    reader.readAsDataURL(file);
  }

  const PENCIL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
  const GENDERS = [["holka", "Holka"], ["kluk", "Kluk"], ["jine", "Jiné"], ["neuvadet", "Nechci uvádět"]];

  /* ---------- ikony tabů (SVG z assets/ui, přebarvené přes CSS mask = currentColor) ---------- */
  const TAB_ICON = {
    search: "search-icon.svg",
    quests: "questy.icon.svg",
    board: "quests-boards-icon.svg",
    saved: "saved-icon.svg",
    settings: "settings-icon.svg"
  };
  function tabIcon(id) {
    const f = TAB_ICON[id];
    if (!f) return "";
    const url = "url('assets/ui/" + f + "')";
    return '<span class="pf-tab-ic" style="-webkit-mask-image:' + url + ';mask-image:' + url + '"></span>';
  }

  /* ---------- uživatel ---------- */
  const meta = (u) => (u && u.user_metadata) || {};
  const nameOf = (u) => meta(u).full_name || meta(u).name || (u && u.email ? u.email.split("@")[0] : "Uživatel");
  function slug(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  const handleOf = (u) => "@" + (getUser().nickname || slug(nameOf(u)) || "uzivatel");

  let currentUser = null;   // nastaví open(u); používá personalHtml() pro fallback přezdívky

  const TABS = [
    { id: "quests", label: "Tvé questy", empty: "Zatím žádný quest. Otevři nějaký ve feedu a začni." },
    { id: "board", label: "Tvé projekty", empty: "Zatím tu nic není — až si forkneš poslední Glitch questu, objeví se tu tvůj projekt." },
    { id: "saved", label: "Tvé uložené Glitche", empty: "Nic uloženého. Glitche, které si uložíš, najdeš tady." }
  ];

  let state = { tab: "quests", savedSub: "posts" };

  /* ---------- mapa znalostí (Glitchboard) ----------
     Kostra mapy (témata → koncepty) se načítá z knowledge-map/map-index.json;
     úrovně zvládnutí si dobarvíme z tg_mastery (js/progress.js). */
  const KM_ORDER = ["zapamatovani", "porozumeni", "aplikace", "analyza", "hodnoceni", "tvorba"];
  const KM_LABEL = {
    zapamatovani: "zapamatování", porozumeni: "porozumění", aplikace: "aplikace",
    analyza: "analýza", hodnoceni: "hodnocení", tvorba: "tvorba"
  };
  let mapIndex = null, mapPromise = null;
  function loadMapIndex() {
    if (mapIndex) return Promise.resolve(mapIndex);
    if (mapPromise) return mapPromise;
    mapPromise = fetch("knowledge-map/map-index.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { mapIndex = d; return d; })
      .catch(() => null);
    return mapPromise;
  }
  function masteryMap() {
    try { return (typeof window.glitchMastery === "function") ? (window.glitchMastery() || {}) : {}; }
    catch (_) { return {}; }
  }
  const lvIndex = (u) => { const i = KM_ORDER.indexOf(u); return i < 0 ? 0 : i + 1; };  // 1–6, 0 = nezačato

  function knowledgeMapHtml() {
    if (!mapIndex || !Array.isArray(mapIndex.temata)) return '<div class="pf-empty">Mapu se nepodařilo načíst.</div>';
    const m = masteryMap();
    let total = 0, done = 0;
    const temata = mapIndex.temata.map((t) => {
      let tdone = 0;
      const cells = (t.koncepty || []).map((k) => {
        total++;
        const rec = m[k.id];
        const lv = rec ? lvIndex(rec.uroven) : 0;
        if (lv > 0) { done++; tdone++; }
        const lvl = rec ? (KM_LABEL[rec.uroven] || rec.uroven) : "nezačato";
        return '<button type="button" class="km-cell km-lv-' + lv + '" ' +
          'data-km-name="' + esc(k.nazev) + '" data-km-lv="' + esc(lvl) + '" ' +
          'title="' + esc(k.nazev) + ' — ' + esc(lvl) + '"></button>';
      }).join("");
      return '<div class="km-theme">' +
        '<div class="km-theme-head"><span class="km-theme-name">' + esc(t.nazev) + '</span>' +
        '<span class="km-theme-count">' + tdone + ' / ' + (t.koncepty || []).length + '</span></div>' +
        '<div class="km-grid">' + cells + '</div></div>';
    }).join("");
    const legend = KM_ORDER.map((u, i) =>
      '<span class="km-leg"><span class="km-cell km-lv-' + (i + 1) + '"></span>' + esc(KM_LABEL[u]) + '</span>'
    ).join("");
    return '<div class="km-summary">Zvládnuto <b>' + done + '</b> z ' + total + ' konceptů</div>' +
      '<div class="km-cap" data-km-cap>Ťukni na dlaždici a ukáže se název konceptu.</div>' +
      '<div class="km-legend"><span class="km-leg"><span class="km-cell km-lv-0"></span>nezačato</span>' + legend + '</div>' +
      temata;
  }

  /* Doplní mapu (zatím pod Glitchboard, než ho navrhneme) — kostru dotahujeme async. */
  function hydrateMap() {
    if (state.tab !== "board" || mapIndex) return;
    loadMapIndex().then(() => {
      const cur = document.getElementById("glitch-profile");
      if (!cur || state.tab !== "board") return;
      const box = cur.querySelector("[data-pf-map]");
      if (box) box.innerHTML = knowledgeMapHtml();
    });
  }

  /* ---------- Tvé questy (dráhy postupu) ----------
     Questy odvodíme z glitches/feed.json: karty s chapterNo seskupené podle tématu,
     seřazené podle čísla kapitoly. Každá kapitola = uzel v dráze; splněné žlutě,
     první nesplněná je „aktuální" (s popiskem), zbytek černě. */
  let questsData = null, questsPromise = null;
  function buildQuests(cards) {
    const byTopic = {};
    (cards || []).forEach((c) => {
      if (c && c.chapterNo != null && c.topic) (byTopic[c.topic] = byTopic[c.topic] || []).push(c);
    });
    return Object.keys(byTopic).map((topic) => ({
      topic: topic,
      chapters: byTopic[topic].slice()
        .sort((a, b) => Number(a.chapterNo) - Number(b.chapterNo))
        .map((c) => ({ id: c.id, title: c.projectTitle || (c.rozklik && c.rozklik.title) || c.title || "", project: !!c.project, brief: c.projectBrief || "" }))
    })).filter((q) => q.chapters.length);
  }
  function loadQuests() {
    if (questsData) return Promise.resolve(questsData);
    if (questsPromise) return questsPromise;
    questsPromise = fetch("glitches/feed.json?v=46")
      .then((r) => (r.ok ? r.json() : null))
      .then((cards) => { questsData = buildQuests(cards); return questsData; })
      .catch(() => { questsData = []; return questsData; });
    return questsPromise;
  }
  const isDone = (id) => { try { return typeof window.isGlitchDone === "function" && window.isGlitchDone(id); } catch (_) { return false; } };

  function questsHtml() {
    if (!questsData) return '<div class="pf-empty">Načítám questy…</div>';
    if (!questsData.length) return '<div class="pf-empty">Zatím žádný quest. Otevři nějaký ve feedu a začni.</div>';
    return questsData.map((q) => {
      const chapters = q.chapters.slice(0, 10);      // dráha má vždy max 10 uzlů (fixní rozestup)
      const n = chapters.length;
      let currentSet = false;
      const nodes = chapters.map((ch, idx) => {
        const done = isDone(ch.id);
        const edge = idx === n - 1 ? " q-node--r" : "";   // tooltip u posledního zarovnat doprava
        // projektový uzel (poslední, aplikační) — zamčený, dokud nejsou hotové předchozí kapitoly
        if (ch.project) {
          const locked = !chapters.slice(0, idx).every((c) => isDone(c.id));
          const inner = locked ? '<img src="assets/ui/locked-icon.svg" alt="Zamčeno">' : '';
          return '<span class="q-node q-node--project' + (locked ? " is-locked" : "") + edge + '" ' +
            'data-gid="' + esc(ch.id) + '" data-proj-topic="' + esc(q.topic) + '" data-proj-title="' + esc(ch.title) +
            '" data-proj-brief="' + esc(ch.brief || "") + '" tabindex="0" role="button" aria-label="' + esc(ch.title) + '">' +
            inner + '<span class="q-tip">' + esc(ch.title) + '</span></span>';
        }
        let cls = "q-node";
        if (done) cls += " is-done";
        else if (!currentSet) { currentSet = true; cls += " is-current"; }
        return '<span class="' + cls + edge + '" data-gid="' + esc(ch.id) + '" tabindex="0" role="button" ' +
          'aria-label="' + esc(ch.title) + '"><span class="q-tip">' + esc(ch.title) + '</span></span>';
      }).join("");
      return '<div class="q-quest"><div class="q-name">' + esc(q.topic) + '</div>' +
        '<div class="q-track">' + nodes + '</div></div>';
    }).join("");
  }

  function hydrateQuests() {
    if (state.tab !== "quests" || questsData) return;
    loadQuests().then(() => {
      const cur = document.getElementById("glitch-profile");
      if (!cur || state.tab !== "quests") return;
      const box = cur.querySelector("[data-pf-quests]");
      if (box) box.innerHTML = questsHtml();
    });
  }

  /* ---------- Tvé projekty (fork posledního Glitche questu) ---------- */
  function projectsHtml() {
    const list = (typeof window.listProjects === "function") ? window.listProjects() : [];
    if (!list.length) {
      return '<div class="pf-empty">Zatím tu nic není — až dojdeš na konec questu, můžeš si poslední Glitch forknout do projektu a rozpracovat ho tady.</div>';
    }
    return '<div class="pf-projects">' + list.map((p) => {
      const res = (p.resources && p.resources.length) || 0;
      // „Konverzací" a „Splněno" zatím netrackujeme — doplní se s návrhem pracovny projektu.
      return '<button class="pf-proj" data-proj="' + esc(p.id) + '" type="button">' +
        '<span class="pf-proj-arrow"><img src="assets/ui/open-icon.svg" alt=""></span>' +
        '<div class="pf-proj-title g-h4">' + esc(p.title || "Projekt") + '</div>' +
        (p.brief ? '<div class="pf-proj-brief g-p">' + esc(p.brief) + '</div>' : '') +
        '<div class="pf-proj-pills"><span class="pf-pill">Zdrojů: ' + res + '</span></div>' +
      '</button>';
    }).join("") + '</div>';
  }
  /* ---------- Tvé uložené Glitche (plochý seznam) ---------- */
  const GLITCH_MARK = '<span class="pf-saved-ic"><img src="assets/glitch-logo.svg" alt=""></span>';
  function savedHtml() {
    const list = (typeof window.listSaved === "function") ? window.listSaved() : [];
    if (!list.length) return '<div class="pf-empty">Nic uloženého. Glitche, které si uložíš přes menu (tři tečky), najdeš tady.</div>';
    return '<div class="pf-saved-list">' + list.map((s) =>
      '<button class="pf-saved-card" data-saved="' + esc(s.id) + '" type="button">' +
        '<span class="pf-saved-title">' + esc(s.title || s.id) + '</span>' + GLITCH_MARK +
      '</button>'
    ).join("") + '</div>';
  }

  function hydrateProjects() {
    if (state.tab !== "board") return;
    const cur = document.getElementById("glitch-profile");
    if (!cur) return;
    const box = cur.querySelector("[data-pf-projects]");
    if (box) box.innerHTML = projectsHtml();
  }

  /* ---------- Lupa: výpis vzdělávacího obsahu po tématech ----------
     Počty se odvozují z feed.json: Základní = quest_intro (Basic Glitch),
     Doplňkové = ostatní učební typy (Výzvy, Argumentuj, Aktivity, Najdi chybu…),
     Questů = 1 na téma, které má základní Glitche. */
  let catalogData = null, catalogPromise = null;
  function loadCatalog() {
    if (catalogData) return Promise.resolve(catalogData);
    if (catalogPromise) return catalogPromise;
    catalogPromise = fetch("glitches/feed.json?v=46")
      .then((r) => (r.ok ? r.json() : []))
      .then((cards) => { catalogData = cards || []; return catalogData; })
      .catch(() => { catalogData = []; return catalogData; });
    return catalogPromise;
  }
  const isBasicType = (c) => c && (c.type === "quest_intro" || c.chapterNo != null);
  const SUPP_TYPES = new Set(["quick_challenge", "argument", "spot_the_mistake", "fun_fact",
    "attention_game", "asmr", "inspirace", "historicka_osobnost", "algorithm_demo"]);
  const TOPIC_DESC = {
    "Vibe Coding": "Programování pomocí přirozeného jazyka, které ti umožní tvorbu aplikací.",
    "Algoritmus": "Algoritmus je přesný postup, kterým můžeme dávat instrukce počítači.",
    "Data": "Jak se data sbírají, ukládají a čtou — a jak z nich udělat vizualizaci.",
    "Umělá inteligence": "Jak fungují systémy, které se učí z dat a rozhodují se.",
    "Strojové učení": "Jak se počítač učí ze zkušenosti místo pevných pravidel.",
    "Matematika": "Základy, které se ti hodí napříč informatikou.",
    "Digitální občanství": "Jak se v online světě pohybovat bezpečně a s rozmyslem."
  };
  const glitchTitle = (c) => c.title || (c.rozklik && c.rozklik.title) || c.claim || c.question || c.id;
  // Per téma: seznam základních (quest_intro, dle kapitol) a doplňkových Glitchů.
  function topicList(cards) {
    const by = {};
    (cards || []).forEach((c) => {
      if (!c || !c.topic) return;
      const o = by[c.topic] || (by[c.topic] = { basic: [], supp: [] });
      const item = { id: c.id, title: glitchTitle(c), ch: (c.chapterNo != null ? Number(c.chapterNo) : 999) };
      if (isBasicType(c)) o.basic.push(item);
      else if (SUPP_TYPES.has(c.type)) o.supp.push(item);
    });
    return Object.keys(by)
      .filter((t) => by[t].basic.length > 0)            // jen obsahově pokrytá témata
      .map((t) => ({ topic: t, basic: by[t].basic.sort((a, b) => a.ch - b.ch), supp: by[t].supp }))
      .sort((a, b) => (b.basic.length + b.supp.length) - (a.basic.length + a.supp.length));
  }
  const TOPIC_ARROW = '<span class="pf-topic-arrow"><img src="assets/ui/open-icon.svg" alt=""></span>';
  function searchHtml() {
    const bar = '<div class="pf-search-bar"><div class="pf-search-field">' +
      '<input class="pf-search-input" data-pf-search placeholder="Začni vyhledávat…" autocomplete="off">' +
      '<button class="pf-search-btn" type="button" aria-label="Hledat"><img src="assets/ui/search-icon-box.svg" alt=""></button>' +
      '</div></div>';
    if (!catalogData) return bar + '<div class="pf-empty">Načítám obsah…</div>';
    const topics = topicList(catalogData);
    if (!topics.length) return bar + '<div class="pf-empty">Zatím tu není žádný vzdělávací obsah.</div>';
    const glItem = (g, cls) => '<button class="' + cls + '" data-gid="' + esc(g.id) + '" type="button">' + esc(g.title) + '</button>';
    const rows = topics.map((t) => {
      const desc = TOPIC_DESC[t.topic] || "";
      const basics = t.basic.map((g) => glItem(g, "pf-glitch-card")).join("");
      const supps = t.supp.map((g) => glItem(g, "pf-glitch-item")).join("");
      return '<section class="pf-topic-sec" data-topic-sec data-topic="' + esc(t.topic) + '">' +
        '<button class="pf-topic-head" data-topic-toggle type="button">' + TOPIC_ARROW +
          '<span class="pf-topic-name g-h4">' + esc(t.topic) + '</span></button>' +
        '<div class="pf-topic-body">' +
          (desc ? '<p class="pf-topic-desc g-p">' + esc(desc) + '</p>' : '') +
          '<div class="pf-topic-pills">' +
            '<span class="pf-pill">Questů: ' + (t.basic.length ? 1 : 0) + '</span>' +
            '<span class="pf-pill">Základních Glitchů: ' + t.basic.length + '</span>' +
            '<span class="pf-pill">Doplňkových: ' + t.supp.length + '</span></div>' +
          (basics ? '<div class="pf-glitch-group"><div class="pf-glitch-h">Základní Glitche</div><div class="pf-glitch-basics">' + basics + '</div></div>' : '') +
          (supps ? '<div class="pf-glitch-group"><div class="pf-glitch-h">Doplňkové Glitche</div><div class="pf-glitch-supps">' + supps + '</div></div>' : '') +
        '</div>' +
      '</section>';
    }).join("");
    return bar + '<div class="pf-topics" data-pf-topics>' + rows + '</div>';
  }
  function hydrateSearch() {
    if (state.tab !== "search") return;
    loadCatalog().then(() => {
      const cur = document.getElementById("glitch-profile");
      if (!cur || state.tab !== "search") return;
      const box = cur.querySelector("[data-pf-search-body]");
      if (box) box.innerHTML = searchHtml();
    });
  }

  /* ---------- Saved: submenu Glitchposty / Uložené ---------- */
  function savedSubbar() {
    const item = (id, label) => '<button class="pf-subtab' + (state.savedSub === id ? " is-active" : "") +
      '" data-savedsub="' + id + '">' + label + '</button>';
    return '<div class="pf-subtabs">' + item("posts", "Tvé Glitchposty") + item("saved", "Uložené Glitche") + '</div>';
  }
  function glitchpostyHtml() {
    return '<div class="pf-empty">Zatím jsi nic nezveřejnil*a. Až vytvoříš Glitchpost přes tlačítko „+" dole, objeví se tady.</div>';
  }

  /* ---------- render ---------- */
  // placeholder mizí, jakmile je vyplněný aspoň jeden zájem (ať pole není přeplněné)
  const interestPlaceholder = () => getInterests().length ? "" : "Napiš svůj zájem a dej Enter…";
  function refreshInterests(el) {
    const box = el.querySelector("[data-pf-chips]"); if (box) box.innerHTML = chipsHtml();
    const inp = el.querySelector("[data-pf-interest-input]"); if (inp) inp.placeholder = interestPlaceholder();
  }

  function chipsHtml() {
    return getInterests().map((name, i) =>
      '<span class="pf-chip">' + esc(name) +
      '<button data-remove="' + i + '" aria-label="Odebrat"><img src="assets/ui/Exit.svg" alt=""></button></span>'
    ).join("");
  }

  function header(u) {
    return '' +
      '<div class="pf-header">' +
        '<div class="pf-avatar">' +
          '<img src="' + esc(avatarSrc(u)) + '" alt="" referrerpolicy="no-referrer">' +
          '<button class="pf-avatar-add" data-pf-avatar type="button" aria-label="Nahrát profilový obrázek"><img src="assets/ui/Plus.svg" alt=""></button>' +
          '<input type="file" accept="image/*" class="pf-avatar-file" data-pf-avatar-file hidden>' +
        '</div>' +
        '<div class="pf-name">' + esc(nameOf(u)) + '</div>' +
        '<div class="pf-handle" data-pf-handle>' + esc(handleOf(u)) + '</div>' +
        '<div class="pf-stats">' +
          '<div class="pf-stat"><b>0</b><span>sleduji</span></div>' +
          '<div class="pf-stat"><b>0</b><span>sledujících</span></div>' +
          '<div class="pf-stat"><b>' + ((typeof window.listProjects === "function" ? window.listProjects().length : 0)) + '</b><span>projektů</span></div>' +
        '</div>' +
        '<div class="pf-interests">' +
          '<button class="pf-interests-add" data-pf-interest-add type="button" aria-label="Přidat zájem"><img src="assets/ui/Plus.svg" alt=""></button>' +
          '<div class="pf-chips" data-pf-chips>' + chipsHtml() + '</div>' +
          '<input class="pf-interest-input" data-pf-interest-input placeholder="' + interestPlaceholder() + '">' +
        '</div>' +
      '</div>';
  }

  const TAB_ORDER = ["search", "quests", "board", "saved", "settings"];
  function tabsBar() {
    return '<div class="pf-tabs">' + TAB_ORDER.map((id) =>
      '<button class="pf-tab' + (id === state.tab ? ' is-active' : '') + '" data-tab="' + id + '">' + tabIcon(id) + '</button>'
    ).join("") + '</div>';
  }

  function toggleRow(key, label) {
    const on = getSettings()[key] ? " checked" : "";
    return '<label class="pf-row"><span class="pf-row-label">' + esc(label) + '</span>' +
      '<span class="pf-toggle"><input type="checkbox" data-setting="' + key + '"' + on + '><span class="pf-knob"></span></span></label>';
  }

  function personalHtml() {
    const u = getUser();
    const nick = u.nickname || slug(nameOf(currentUser)) || "";
    const g = u.gender || "";
    const radios = GENDERS.map(([val, lab]) =>
      '<label class="pf-radio"><input type="radio" name="pf-gender" value="' + val + '"' +
      (g === val ? " checked" : "") + '><span class="pf-radio-mark"></span>' + esc(lab) + '</label>'
    ).join("");
    return '' +
      '<div class="pf-set-group"><h3>Osobní údaje</h3>' +
        '<div class="pf-field">' +
          '<label class="pf-field-label">Uživatelské jméno</label>' +
          '<div class="pf-input-wrap">' +
            '<span class="pf-input-at">@</span>' +
            '<input class="pf-input" data-pf-nickname value="' + esc(nick) + '" maxlength="24" autocomplete="off" spellcheck="false">' +
          '</div>' +
        '</div>' +
        '<div class="pf-field">' +
          '<label class="pf-field-label">Tvůj gender</label>' +
          '<div class="pf-radios">' + radios + '</div>' +
        '</div>' +
        '<div class="pf-field">' +
          '<label class="pf-field-label">Tvůj věk</label>' +
          '<div class="pf-age">' +
            '<span class="pf-age-val" data-pf-age-val>' + (u.age ? esc(u.age + " let") : "—") + '</span>' +
            '<button class="pf-age-btn" data-pf-age="-1" type="button" aria-label="Ubrat rok">−</button>' +
            '<button class="pf-age-btn" data-pf-age="1" type="button" aria-label="Přidat rok">+</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function settingsHtml() {
    return '' +
      personalHtml() +
      '<div class="pf-set-group"><h3>Soukromí a data</h3>' +
        toggleRow("soukromi_glitchfeed", "Můj obsah vidí komunita v Glitchfeedu") +
        toggleRow("soukromi_questy", "Moje questy vidí komunita") +
        toggleRow("soukromi_glitchboard", "Můj Glitchboard vidí komunita") +
      '</div>' +
      '<div class="pf-set-group"><h3>Jak vidím obsah</h3>' +
        toggleRow("faseta_hloubka", "Mám raději delší texty, víc do hloubky") +
        toggleRow("faseta_obrazky", "Lépe se učím pomocí obrázků") +
        toggleRow("uceni_interakce", "Obsah se mi zobrazuje podle mých interakcí") +
      '</div>' +
      '<div class="pf-set-group"><h3>Od koho vidím obsah</h3>' +
        toggleRow("odkoho_glitch", "Glitch") +
        toggleRow("odkoho_komunita", "Komunita") +
        toggleRow("odkoho_generovany", "Generovaný AI") +
      '</div>' +
      '<div class="pf-set-group"><h3>Wellbeing</h3>' +
        toggleRow("mood_checkin", "Denní mood check-in") +
        toggleRow("notifikace", "Notifikace") +
      '</div>' +
      '<div class="pf-set-group"><h3>Postup</h3>' +
        '<div class="pf-row"><span class="pf-row-label">Hotových Glitchů: ' +
          (typeof window.glitchDoneCount === "function" ? window.glitchDoneCount() : 0) + '</span></div>' +
        '<button class="pf-signout" data-pf-reset-progress type="button">Začít feed znovu</button>' +
      '</div>' +
      '<div class="pf-set-group"><h3>Účet</h3>' +
        '<button class="pf-signout" data-pf-signout type="button">Odhlásit se</button>' +
      '</div>';
  }

  function contentHtml() {
    if (state.tab === "search") {
      return '<h2 class="pf-section-title pf-section-title--flush">Co všechno na Glitchi najdeš</h2>' +
        '<div class="pf-search-wrap" data-pf-search-body>' + searchHtml() + '</div>';
    }
    if (state.tab === "settings") {
      return '<h2 class="pf-section-title">Tvá nastavení</h2>' + settingsHtml();
    }
    if (state.tab === "quests") {
      return '<h2 class="pf-section-title">Tvé questy</h2>' +
        '<div class="q-wrap" data-pf-quests>' +
        (questsData ? questsHtml() : '<div class="pf-empty">Načítám questy…</div>') +
        '</div>';
    }
    if (state.tab === "board") {
      return '<h2 class="pf-section-title">Tvé projekty</h2>' +
        '<div class="pf-proj-wrap" data-pf-projects>' + projectsHtml() + '</div>';
    }
    if (state.tab === "saved") {
      return savedSubbar() +
        '<div class="pf-saved-wrap" data-pf-saved>' +
        (state.savedSub === "posts" ? glitchpostyHtml() : savedHtml()) + '</div>';
    }
    return '<div class="pf-empty">Zatím tu nic není.</div>';
  }

  function profileMenu() {
    const item = (act, label) => '<button class="pf-menu-item" data-pf-menu-act="' + act + '">' + label + '</button>';
    return '<div class="pf-menu" data-pf-menu>' +
      '<button class="pf-menu-btn" data-pf-menu-btn type="button" aria-label="Menu profilu"><span class="pf-menu-ic"></span></button>' +
      '<div class="pf-menu-pop" data-pf-menu-pop hidden>' +
        item("oglitchi", "O Glitchi") +
        item("stats", "Tvé statistiky") +
        item("report", "Nahlásit nevhodný obsah") +
        item("terms", "Podmínky užívání") +
        item("contact", "Kontaktuj tvůrce") +
      '</div></div>';
  }

  function render(u) {
    return '<div class="pf-wrap">' + profileMenu() + header(u) + tabsBar() +
      '<div class="pf-content" data-pf-content>' + contentHtml() + '</div></div>';
  }

  /* ---------- otevření / zavření / wiring ---------- */
  function close() {
    const e = document.getElementById("glitch-profile"); if (e) e.remove();
    document.body.classList.remove("has-profile");
  }

  const VALID_TABS = { search: 1, quests: 1, board: 1, saved: 1, settings: 1 };
  function open(tab) {
    const u = (typeof sbCurrentUser !== "undefined") ? sbCurrentUser : null;
    currentUser = u;
    close();
    state.tab = VALID_TABS[tab] ? tab : "search";   // výchozí zobrazení = lupa (Co všechno na Glitchi najdeš)
    const el = document.createElement("section");
    el.id = "glitch-profile";
    el.innerHTML = render(u);
    // vlož PŘED spodní menu, ať je profil flex-sourozenec navigace (stabilní menu)
    const nav = document.getElementById("glitch-nav");
    if (nav && nav.parentNode) nav.parentNode.insertBefore(el, nav);
    else document.body.appendChild(el);
    document.body.classList.add("has-profile");
    wire(el);
    hydrateQuests();                 // Tvé questy
    hydrateProjects();               // Tvé projekty
    hydrateSearch();                 // Lupa (výpis obsahu po tématech)
    // (mapa znalostí je zatím bez místa v UI — kód ponechán pro budoucí použití)

    // načíst nastavení z DB (mezi zařízeními) a sloučit; když není, zůstane localStorage
    if (typeof sbLoadSettings === "function") {
      sbLoadSettings().then((remote) => {
        if (remote && typeof remote === "object") {
          try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(Object.assign(getSettings(), remote))); } catch (_) {}
          const cur = document.getElementById("glitch-profile");
          if (cur && state.tab === "settings") rerenderContent(cur);
        }
      }).catch(() => {});
    }
  }

  function rerenderContent(el) {
    el.querySelectorAll(".pf-tab").forEach((b) => b.classList.toggle("is-active", b.dataset.tab === state.tab));
    const c = el.querySelector("[data-pf-content]");
    if (c) c.innerHTML = contentHtml();
    hydrateQuests();                 // po přepnutí dotáhni obsah tabu, pokud ještě není
    hydrateProjects();
    hydrateSearch();
  }

  function toastPf(msg) {
    let t = document.getElementById("glitch-toast");
    if (!t) { t = document.createElement("div"); t.id = "glitch-toast"; t.className = "glitch-toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastPf._t); toastPf._t = setTimeout(() => t.classList.remove("show"), 1600);
  }

  /* „Tvé statistiky" (z ⋮ menu) — overlay s mapou znalostí (heatmapa konceptů). */
  function openStats() {
    const ov = document.createElement("div");
    ov.className = "pf-stats-overlay"; ov.id = "pf-stats-overlay";
    ov.innerHTML = '<div class="pf-stats-modal">' +
      '<button class="pf-stats-close" data-pf-stats-close aria-label="Zavřít"><img src="assets/ui/Exit.svg" alt=""></button>' +
      '<h2 class="pf-stats-title g-h4">Tvé statistiky</h2>' +
      '<div class="pf-stats-body" data-pf-stats-body>' +
      (mapIndex ? knowledgeMapHtml() : '<div class="pf-empty">Načítám…</div>') + '</div></div>';
    document.body.appendChild(ov);
    ov.addEventListener("click", (e) => {
      if (e.target === ov || e.target.closest("[data-pf-stats-close]")) { ov.remove(); return; }
      const cell = e.target.closest(".km-cell[data-km-name]");
      if (cell) { const cap = ov.querySelector("[data-km-cap]"); if (cap) cap.textContent = cell.dataset.kmName + " — " + cell.dataset.kmLv; }
    });
    if (!mapIndex) loadMapIndex().then(() => { const b = ov.querySelector("[data-pf-stats-body]"); if (b) b.innerHTML = knowledgeMapHtml(); });
  }

  function wire(el) {
    // vyhledávání KONKRÉTNÍCH Glitchů: filtruje položky, rozbalí témata se shodou
    el.addEventListener("input", (e) => {
      if (!e.target || !e.target.matches("[data-pf-search]")) return;
      const q = e.target.value.trim().toLowerCase();
      el.querySelectorAll(".pf-topic-sec").forEach((sec) => {
        if (!q) {                                   // prázdné → vše zpět, sbaleno
          sec.style.display = ""; sec.classList.remove("is-open");
          sec.querySelectorAll(".pf-glitch-group, .pf-glitch-card, .pf-glitch-item").forEach((x) => { x.style.display = ""; });
          return;
        }
        const topicMatch = ((sec.querySelector(".pf-topic-name") || {}).textContent || "").toLowerCase().indexOf(q) >= 0;
        let any = false;
        sec.querySelectorAll(".pf-glitch-card, .pf-glitch-item").forEach((g) => {
          const show = topicMatch || g.textContent.toLowerCase().indexOf(q) >= 0;
          g.style.display = show ? "" : "none"; if (show) any = true;
        });
        sec.querySelectorAll(".pf-glitch-group").forEach((grp) => {
          const vis = [].some.call(grp.querySelectorAll(".pf-glitch-card, .pf-glitch-item"), (g) => g.style.display !== "none");
          grp.style.display = vis ? "" : "none";
        });
        const match = topicMatch || any;
        sec.style.display = match ? "" : "none";
        sec.classList.toggle("is-open", match);      // shodu rozbal
      });
    });

    // taby
    el.querySelectorAll(".pf-tab").forEach((b) => b.addEventListener("click", () => {
      state.tab = b.dataset.tab; rerenderContent(el);
    }));

    // přepínače a osobní údaje (delegace, protože se překreslují)
    el.addEventListener("change", (e) => {
      const t = e.target;
      if (t && t.matches("input[data-setting]")) { setSetting(t.dataset.setting, t.checked); return; }
      if (t && t.matches('input[name="pf-gender"]')) { setUserFields({ gender: t.value }); return; }
      if (t && t.matches("[data-pf-nickname]")) {
        const v = t.value.trim().replace(/^@+/, "");
        setUserFields({ nickname: v });
        const h = el.querySelector("[data-pf-handle]"); if (h) h.textContent = "@" + (v || "uzivatel");
        return;
      }
      if (t && t.matches("[data-pf-avatar-file]")) {
        const f = t.files && t.files[0];
        if (f) readImageScaled(f, (dataUrl) => {
          if (!dataUrl) return;
          setUserFields({ avatar: dataUrl });
          const img = el.querySelector(".pf-avatar img"); if (img) img.src = dataUrl;
          if (typeof window.glitchAuthRefresh === "function") window.glitchAuthRefresh();  // i v menu
        });
        return;
      }
    });

    // odhlášení
    el.addEventListener("click", async (e) => {
      // ⋮ menu profilu — otevři/zavři
      if (e.target.closest("[data-pf-menu-btn]")) {
        const pop = el.querySelector("[data-pf-menu-pop]"); if (pop) pop.hidden = !pop.hidden;
        return;
      }
      const mAct = e.target.closest("[data-pf-menu-act]");
      if (mAct) {
        const pop = el.querySelector("[data-pf-menu-pop]"); if (pop) pop.hidden = true;
        const act = mAct.dataset.pfMenuAct;
        if (act === "oglitchi") { if (typeof window.glitchOpenGlitch === "function") window.glitchOpenGlitch("welcome"); }
        else if (act === "stats") { openStats(); }
        else if (act === "report") { if (typeof window.glitchReportFlow === "function") window.glitchReportFlow({ id: "obecny-podnet", type: "obecne", topic: "" }); }
        else if (act === "terms") { toastPf("Podmínky užívání se připravují."); }
        else if (act === "contact") { location.href = "mailto:aplikace@aidetem.cz"; }
        return;
      }
      // klik jinam zavře otevřené ⋮ menu (a pokračuje dál)
      const pop = el.querySelector("[data-pf-menu-pop]");
      if (pop && !pop.hidden && !e.target.closest("[data-pf-menu]")) pop.hidden = true;

      // lupa: rozbalení / sbalení tématu (rozjíždítko)
      const tToggle = e.target.closest("[data-topic-toggle]");
      if (tToggle) { const sec = tToggle.closest("[data-topic-sec]"); if (sec) sec.classList.toggle("is-open"); return; }
      // lupa: klik na konkrétní Glitch → jeho úvodní karta ve feedu
      const lupaG = e.target.closest(".pf-glitch-card, .pf-glitch-item");
      if (lupaG) { if (typeof window.glitchGoToCard === "function") window.glitchGoToCard(lupaG.dataset.gid); return; }

      // saved: přepnutí podzáložky Glitchposty / Uložené
      const sub = e.target.closest("[data-savedsub]");
      if (sub) {
        state.savedSub = sub.dataset.savedsub;
        el.querySelectorAll("[data-savedsub]").forEach((b) => b.classList.toggle("is-active", b.dataset.savedsub === state.savedSub));
        const box = el.querySelector("[data-pf-saved]");
        if (box) box.innerHTML = (state.savedSub === "posts" ? glitchpostyHtml() : savedHtml());
        return;
      }
      // saved: klik na uloženou kartu → otevři Glitch
      const savedCard = e.target.closest("[data-saved]");
      if (savedCard) { if (typeof window.glitchOpenGlitch === "function") window.glitchOpenGlitch(savedCard.dataset.saved); return; }
      // projekt: pracovna se připravuje
      if (e.target.closest("[data-proj]")) { toastPf("Pracovna projektu se připravuje."); return; }

      // dráhy questů: klik na žlutý tooltip → otevři vyhodnocení / Glitch
      const tip = e.target.closest(".q-tip");
      if (tip) {
        const node = tip.closest(".q-node");
        if (!node) return;
        if (node.classList.contains("is-locked")) return;           // zamčený projekt neotvírej
        // projektový (aplikační) uzel: nefrkuje chat, ale založí projekt a otevře Tvé projekty
        if (node.classList.contains("q-node--project")) {
          const gid = node.dataset.gid;
          if (typeof window.hasProject === "function" && !window.hasProject(gid) && typeof window.createProject === "function") {
            window.createProject({ glitch_id: gid, quest_topic: node.dataset.projTopic || "",
              title: node.dataset.projTitle || "", brief: node.dataset.projBrief || "" });
          }
          if (typeof window.glitchOpenProfile === "function") window.glitchOpenProfile("board");
          return;
        }
        // proklik z questu jde na ÚVODNÍ kartu Glitche ve feedu, ne do detailu
        if (node.dataset.gid && typeof window.glitchGoToCard === "function") window.glitchGoToCard(node.dataset.gid);
        return;
      }
      // klik na tečku → ukaž její tooltip (a zavři ostatní); klik jinam → zavři všechny
      const qnode = e.target.closest(".q-node");
      el.querySelectorAll(".q-node.is-open").forEach((x) => { if (x !== qnode) x.classList.remove("is-open"); });
      if (qnode) { qnode.classList.toggle("is-open"); return; }
      // mapa znalostí: ťuknutí na dlaždici ukáže název konceptu a úroveň
      const cell = e.target.closest(".km-cell[data-km-name]");
      if (cell) {
        const cap = el.querySelector("[data-km-cap]");
        if (cap) cap.textContent = cell.dataset.kmName + " — " + cell.dataset.kmLv;
        return;
      }
      // nahrání profilového obrázku — otevři výběr souboru
      if (e.target.closest("[data-pf-avatar]")) {
        const fi = el.querySelector("[data-pf-avatar-file]"); if (fi) fi.click();
        return;
      }
      // plus u zájmů — jen fokusni pole (vyjede klávesnice)
      if (e.target.closest("[data-pf-interest-add]")) {
        const inp = el.querySelector("[data-pf-interest-input]"); if (inp) inp.focus();
        return;
      }
      // věk +/−
      const ageBtn = e.target.closest("[data-pf-age]");
      if (ageBtn) {
        let next = (Number(getUser().age) || 12) + Number(ageBtn.dataset.pfAge);
        next = Math.max(6, Math.min(120, next));
        setUserFields({ age: next });
        const val = el.querySelector("[data-pf-age-val]"); if (val) val.textContent = next + " let";
        return;
      }
      // vynulování postupu — hotové Glitche se zase začnou zobrazovat ve feedu
      if (e.target.closest("[data-pf-reset-progress]")) {
        if (typeof window.resetGlitchProgress === "function") await window.resetGlitchProgress();
        close();
        location.reload();
        return;
      }
      if (e.target.closest("[data-pf-signout]")) {
        try { if (typeof sbSignOut === "function") await sbSignOut(); } catch (_) {}
        close();
        if (typeof window.glitchAuthRefresh === "function") window.glitchAuthRefresh();
        return;
      }
      const rm = e.target.closest("[data-remove]");
      if (rm) {
        const i = Number(rm.dataset.remove);
        const arr = getInterests(); arr.splice(i, 1); setInterests(arr);
        refreshInterests(el);
      }
    });

    // přidání zájmu (Enter)
    const inp = el.querySelector("[data-pf-interest-input]");
    if (inp) inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const v = inp.value.trim();
        if (v) {
          const arr = getInterests();
          if (!arr.includes(v)) { arr.push(v); setInterests(arr); }
          inp.value = "";
          refreshInterests(el);
        }
      }
    });

    // ťuknutí na jinou položku menu zavře profil
    const nav = document.getElementById("glitch-nav");
    if (nav && !nav.__pfClose) {
      nav.__pfClose = true;
      nav.addEventListener("click", (e) => {
        const it = e.target.closest(".nav-item");
        if (it && it.dataset.tab !== "profile") close();
      });
    }
  }

  window.glitchOpenProfile = open;
  window.glitchCloseProfile = close;
  window.glitchSettings = getSettings;   // čte feed (gating obsahu dle nastavení)
})();
