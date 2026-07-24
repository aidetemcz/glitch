/* ==========================================================================
   Glitch — doporučovací ranker v1 (klientský, transparentní)
   Viz docs/doporucovani-implementace.md
   serazFeed(cards, ctx) → seřazený seznam karet:
     • tvrdé filtry: „od koho vidím obsah", mood check-in, dokončené, denní strop
     • měkké řazení: shoda obtížnosti s náladou (jen když je nálada známá)
   Bez nálady zachovává původní pořadí (nedestruktivní).
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

  // cílová obtížnost dle nálady (energie × soustředění); null = neřadit dle obtížnosti
  function moodTargetDifficulty(mood) {
    if (!mood) return null;
    const e = mood.energy, f = mood.focus;
    if (e < 40 && f < 40) return 1;         // unavený + nepozorný → jednodušší
    if (e >= 60 && f >= 60) return 3;       // nabitý + soustředěný → složitější
    return 2;
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
    const targetDiff = moodTargetDifficulty(ctx.mood);

    // systémové karty drží pozici: welcome/intro nahoře, Shrnutí dole
    const head = [], rankable = [], tail = [];
    cards.forEach((c) => {
      if (c.type === "welcome" || c.type === "intro") head.push(c);
      else if (c.type === "daily_summary") tail.push(c);
      else rankable.push(c);
    });

    // 1) tvrdé filtry
    let pool = rankable.filter((c) => {
      if (c.type === "mood_selector" && s.mood_checkin === false) return false;
      const b = trustBucket(c);
      if (b === "glitch" && s.odkoho_glitch === false) return false;
      if (b === "komunita" && s.odkoho_komunita === false) return false;
      if (b === "generovany" && s.odkoho_generovany === false) return false;
      if (c.id && ctx.done && ctx.done[c.id]) return false;   // už dokončené pryč
      return true;
    });

    // 2) měkké řazení dle nálady — jen když je nálada známá.
    //    Questové karty (mají chapterNo) drží pořadí kapitol na svých místech;
    //    podle nálady se přeskládají jen OSTATNÍ karty (do jejich slotů).
    //    → návazné Glitche zůstanou seřazené (1→6), nic se negatuje.
    if (targetDiff != null) {
      const otherSlots = [], others = [];
      pool.forEach((c, i) => { if (c.chapterNo == null) { otherSlots.push(i); others.push(c); } });
      others
        .map((c, i) => ({
          c, i,
          sc: (3 - Math.abs(difficultyOf(c) - targetDiff)) + (WELLBEING_TYPES.has(c.type) ? 0.5 : 0)
        }))
        .sort((a, b) => (b.sc - a.sc) || (a.i - b.i))    // stabilní: při shodě původní pořadí
        .forEach((x, k) => { pool[otherSlots[k]] = x.c; });
    }

    // 3) denní strop
    pool = pool.slice(0, DAILY_CAP);

    return head.concat(pool, tail);
  }

  window.serazFeed = serazFeed;
  window.glitchFeedContext = feedContext;
})();
