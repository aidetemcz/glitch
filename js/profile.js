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
     Lokálně vždy; přezdívku a gender propíšeme i do Supabase (profiles). Věk a
     nahraný avatar zatím jen lokálně (Supabase sloupce doplníme později). */
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
        if (Object.keys(cols).length) sbSaveProfile(cols);   // jen existující sloupce profiles
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
  const handleOf = (u) => "@" + (getUser().nickname || slug(nameOf(u)) || "uzivatel");

  let currentUser = null;   // nastaví open(u); používá personalHtml() pro fallback přezdívky

  const TABS = [
    { id: "board", label: "Tvůj Glitchboard", empty: "Zatím tu nic není — až si nějaký Glitch forkneš, objeví se na tvém boardu." },
    { id: "quests", label: "Tvé questy", empty: "Zatím žádný quest. Otevři nějaký ve feedu a začni." },
    { id: "saved", label: "Tvé uložené Glitche", empty: "Nic uloženého. Glitche, které si uložíš, najdeš tady." }
  ];

  let state = { tab: "board" };

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

  /* Doplní mapu do boardu (kostru dotahujeme asynchronně). */
  function hydrateMap() {
    if (state.tab !== "quests" || mapIndex) return;
    loadMapIndex().then(() => {
      const cur = document.getElementById("glitch-profile");
      if (!cur || state.tab !== "quests") return;
      const box = cur.querySelector("[data-pf-map]");
      if (box) box.innerHTML = knowledgeMapHtml();
    });
  }

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
          '<img src="' + esc(avatarSrc(u)) + '" alt="" referrerpolicy="no-referrer">' +
          '<button class="pf-avatar-add" data-pf-avatar type="button" aria-label="Nahrát profilový obrázek"><img src="assets/ui/Plus.svg" alt=""></button>' +
          '<input type="file" accept="image/*" class="pf-avatar-file" data-pf-avatar-file hidden>' +
        '</div>' +
        '<div class="pf-name">' + esc(nameOf(u)) + '</div>' +
        '<div class="pf-handle" data-pf-handle>' + esc(handleOf(u)) + '</div>' +
        '<div class="pf-stats">' +
          '<div class="pf-stat"><b>0</b><span>sleduji</span></div>' +
          '<div class="pf-stat"><b>0</b><span>sledujících</span></div>' +
          '<div class="pf-stat"><b>0</b><span>forků</span></div>' +
        '</div>' +
        '<div class="pf-interests">' +
          '<button class="pf-interests-add" data-pf-interest-add type="button" aria-label="Přidat zájem"><img src="assets/ui/Plus.svg" alt=""></button>' +
          '<div class="pf-chips" data-pf-chips>' + chipsHtml() + '</div>' +
          '<input class="pf-interest-input" data-pf-interest-input placeholder="Napiš svůj zájem a dej Enter…">' +
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
            '<span class="pf-input-edit">' + PENCIL + '</span>' +
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
    if (state.tab === "settings") {
      return '<h2 class="pf-section-title">Tvá nastavení</h2>' + settingsHtml();
    }
    if (state.tab === "quests") {
      return '<h2 class="pf-section-title">Tvoje mapa znalostí</h2>' +
        '<div class="km" data-pf-map>' +
        (mapIndex ? knowledgeMapHtml() : '<div class="pf-empty">Načítám mapu…</div>') +
        '</div>';
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
    currentUser = u;
    close();
    state.tab = "board";
    const el = document.createElement("section");
    el.id = "glitch-profile";
    el.innerHTML = render(u);
    document.body.appendChild(el);
    wire(el);
    hydrateMap();                    // mapa znalostí je pod Questy — dotáhne se po přepnutí

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
    hydrateMap();                    // po přepnutí na board dotáhni mapu, pokud ještě není
  }

  function wire(el) {
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
  window.glitchSettings = getSettings;   // čte feed (gating obsahu dle nastavení)
})();
