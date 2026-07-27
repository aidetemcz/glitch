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
    casovace: false, mood_checkin: true, notifikace: true
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

  /* ---------- ikony tabů (stroke = currentColor) ---------- */
  const ICONS = {
    board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/></svg>',
    quests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.5 13.4l7 4M15.5 6.6l-7 4"/></svg>',
    saved: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.6l-8.9 8.9a5 5 0 0 1-7.1-7.1l8.9-8.9a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.65 1.65 0 0 1-2.3-2.3l8-8"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.5l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.5 14H4a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 5.6 7L5.5 7a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.5V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V10a1.6 1.6 0 0 0 1.5 1.5H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>'
  };

  /* ---------- uživatel ---------- */
  const meta = (u) => (u && u.user_metadata) || {};
  const nameOf = (u) => meta(u).full_name || meta(u).name || (u && u.email ? u.email.split("@")[0] : "Uživatel");
  function slug(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  const handleOf = (u) => "@" + (slug(nameOf(u)) || "uzivatel");

  const TABS = [
    { id: "board", label: "Tvůj Glitchboard", empty: "Zatím tu nic není — až si nějaký Glitch forkneš, objeví se na tvém boardu." },
    { id: "quests", label: "Tvé questy", empty: "Zatím žádný quest. Otevři nějaký ve feedu a začni." },
    { id: "saved", label: "Tvé uložené Glitche", empty: "Nic uloženého. Glitche, které si uložíš, najdeš tady." }
  ];

  let state = { tab: "board" };

  /* ---------- render ---------- */
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
          '<img src="assets/ui/avatar-icon.png" alt="">' +
          '<span class="pf-avatar-badge"><img src="assets/ui/Plus.svg" alt=""></span>' +
        '</div>' +
        '<div class="pf-name">' + esc(nameOf(u)) + '</div>' +
        '<div class="pf-handle">' + esc(handleOf(u)) + '</div>' +
        '<div class="pf-stats">' +
          '<div class="pf-stat"><b>0</b><span>sleduji</span></div>' +
          '<div class="pf-stat"><b>0</b><span>sledujících</span></div>' +
          '<div class="pf-stat"><b>0</b><span>forků</span></div>' +
        '</div>' +
        '<div class="pf-interests">' +
          '<span class="pf-interests-ic"><img src="assets/ui/Plus.svg" alt=""></span>' +
          '<div class="pf-chips" data-pf-chips>' + chipsHtml() + '</div>' +
          '<input class="pf-interest-input" data-pf-interest-input placeholder="Zatím neznáme tvé zájmy…">' +
        '</div>' +
      '</div>';
  }

  function tabsBar() {
    const all = TABS.concat([{ id: "settings" }]);
    const ic = { board: ICONS.board, quests: ICONS.quests, saved: ICONS.saved, settings: ICONS.settings };
    return '<div class="pf-tabs">' + all.map((t) =>
      '<button class="pf-tab' + (t.id === state.tab ? ' is-active' : '') + '" data-tab="' + t.id + '">' + ic[t.id] + '</button>'
    ).join("") + '</div>';
  }

  function toggleRow(key, label) {
    const on = getSettings()[key] ? " checked" : "";
    return '<label class="pf-row"><span class="pf-row-label">' + esc(label) + '</span>' +
      '<span class="pf-toggle"><input type="checkbox" data-setting="' + key + '"' + on + '><span class="pf-knob"></span></span></label>';
  }

  function settingsHtml() {
    return '' +
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
      '<div class="pf-set-group"><h3>Wellbeing a čas</h3>' +
        toggleRow("casovace", "Časovače") +
        toggleRow("mood_checkin", "Denní mood check-in") +
        toggleRow("notifikace", "Notifikace") +
      '</div>' +
      '<div class="pf-set-group"><h3>Účet</h3>' +
        '<button class="pf-signout" data-pf-signout type="button">Odhlásit se</button>' +
      '</div>';
  }

  function contentHtml() {
    if (state.tab === "settings") {
      return '<h2 class="pf-section-title">Tvá nastavení</h2>' + settingsHtml();
    }
    const t = TABS.find((x) => x.id === state.tab) || TABS[0];
    return '<h2 class="pf-section-title">' + esc(t.label) + '</h2>' +
      '<div class="pf-empty">' + esc(t.empty) + '</div>';
  }

  function render(u) {
    return '<div class="pf-wrap">' + header(u) + tabsBar() +
      '<div class="pf-content" data-pf-content>' + contentHtml() + '</div></div>';
  }

  /* ---------- otevření / zavření / wiring ---------- */
  function close() { const e = document.getElementById("glitch-profile"); if (e) e.remove(); }

  function open() {
    const u = (typeof sbCurrentUser !== "undefined") ? sbCurrentUser : null;
    close();
    state.tab = "board";
    const el = document.createElement("section");
    el.id = "glitch-profile";
    el.innerHTML = render(u);
    document.body.appendChild(el);
    wire(el);

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
  }

  function wire(el) {
    // taby
    el.querySelectorAll(".pf-tab").forEach((b) => b.addEventListener("click", () => {
      state.tab = b.dataset.tab; rerenderContent(el);
    }));

    // přepínače nastavení (delegace, protože se překreslují)
    el.addEventListener("change", (e) => {
      const t = e.target;
      if (t && t.matches("input[data-setting]")) setSetting(t.dataset.setting, t.checked);
    });

    // odhlášení
    el.addEventListener("click", async (e) => {
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
        const box = el.querySelector("[data-pf-chips]"); if (box) box.innerHTML = chipsHtml();
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
          const box = el.querySelector("[data-pf-chips]"); if (box) box.innerHTML = chipsHtml();
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
  window.glitchSettings = getSettings;   // čte feed (gating časovačů apod.)
})();
