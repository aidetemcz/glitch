/* ==========================================================================
   Glitch — doporučovací ranker v1 (klientský, transparentní)
   Viz docs/doporucovani-implementace.md
   serazFeed(cards, ctx) → seřazený seznam karet:
     • tvrdé filtry: „od koho vidím obsah", dokončené, denní strop
     • míchání: obsah se prokládá a po každém reloadu randomizuje;
       questové karty (chapterNo) přitom drží pořadí kapitol (1→N), nic se negatuje
   ========================================================================== */
(function () {
  "use strict";

  const DAILY_CAP = 20;
  const WELLBEING_TYPES = new Set(["mood_selector", "breathing", "attention_game"]);

  // do které skupiny „od koho vidím obsah" karta patří
  function trustBucket(card) {
    const t = String(card.trust || "").toLowerCase();
    if (t.indexOf("komunit") >= 0) return "komunita";
    if (t.indexOf("generov") >= 0) return "generovany";
    return "glitch";                 // Core / Fork / naše
  }

  // obtížnost 1–3 (z pole, jinak odhad z typu)
  function difficultyOf(card) {
    if (typeof card.obtiznost === "number") return card.obtiznost;
    if (WELLBEING_TYPES.has(card.type)) return 1;
    if (card.type === "quick_challenge" || card.type === "fun_fact") return 1;
    if (card.type === "argument" || card.type === "spot_the_mistake") return 3;
    return 2;
  }

  // náhodné promíchání (Fisher–Yates) — randomizace po každém reloadu
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // v rámci každého questu (karty stejné kategorie, které mají chapterNo) srovnej
  // karty podle chapterNo, ale ponech jejich (náhodné) sloty v proudu → prokládané, ale v pořadí
  function keepQuestOrder(list) {
    const groups = {};
    list.forEach((c, i) => {
      if (c.chapterNo != null && c.category) (groups[c.category] = groups[c.category] || []).push(i);
    });
    Object.keys(groups).forEach((cat) => {
      const slots = groups[cat];
      if (slots.length < 2) return;
      const ordered = slots.map((i) => list[i]).sort((a, b) => (a.chapterNo || 0) - (b.chapterNo || 0));
      slots.forEach((slot, k) => { list[slot] = ordered[k]; });
    });
    return list;
  }

  // kontext ze zařízení (localStorage) — synchronně, bez DB
  function feedContext() {
    let settings = {};
    try { settings = (window.glitchSettings && window.glitchSettings()) || {}; } catch (_) {}

    let mood = null;
    try {
      const m = JSON.parse(localStorage.getItem("tg_mood_last") || "null");
      // emoční data jen 24 h (efemérní relace)
      if (m && typeof m.ts === "number" && (Date.now() - m.ts) < 24 * 3600 * 1000) {
        mood = { energy: Number(m.energy), focus: Number(m.focus) };
      }
    } catch (_) {}

    let done = {};
    try { done = JSON.parse(localStorage.getItem("tg_progress") || "{}"); } catch (_) {}

    return { settings, mood, done };
  }

  function serazFeed(cards, ctx) {
    ctx = ctx || feedContext();
    const s = ctx.settings || {};

    // systémové karty drží pozici: welcome/intro nahoře, Shrnutí dole
    const head = [], rankable = [], tail = [];
    cards.forEach((c) => {
      if (c.type === "welcome" || c.type === "intro") head.push(c);
      else if (c.type === "daily_summary") tail.push(c);
      else rankable.push(c);
    });

    // 1) tvrdé filtry
    let pool = rankable.filter((c) => {
      const b = trustBucket(c);
      if (b === "glitch" && s.odkoho_glitch === false) return false;
      if (b === "komunita" && s.odkoho_komunita === false) return false;
      if (b === "generovany" && s.odkoho_generovany === false) return false;
      if (c.id && ctx.done && ctx.done[c.id]) return false;   // už dokončené pryč
      return true;
    });

    // 2) míchání: náhodně promíchat (prokládá questy s ostatním obsahem, randomizace po reloadu),
    //    pak obnovit pořadí kapitol v rámci questů → questy prokládané, ale v pořadí 1→N
    shuffle(pool);
    keepQuestOrder(pool);

    // 3) denní strop
    pool = pool.slice(0, DAILY_CAP);

    return head.concat(pool, tail);
  }

  window.serazFeed = serazFeed;
  window.glitchFeedContext = feedContext;
})();
