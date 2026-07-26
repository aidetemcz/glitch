/* ==========================================================================
   Glitch — postup žáka (co už má hotové)
   Zapisuje se lokálně (localStorage) vždy; přihlášenému uživateli i do Supabase
   (tabulka `progress`), aby postup přešel mezi zařízeními.

   Doporučovač (js/recommender.js) hotové Glitche z feedu vyfiltruje.
   Kdy je Glitch hotový, řídí js/feed.js — viz markGlitchDone().
   ========================================================================== */
(function () {
  "use strict";

  const KEY = "tg_progress";

  function readAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (_) { return {}; }
  }
  function writeAll(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (_) {}
  }

  /* Označí Glitch jako hotový.
     id   … id karty
     info … volitelně { correct: bool, kviz: bool, typ: "quick_challenge" … } */
  function markGlitchDone(id, info) {
    if (!id) return null;
    const all = readAll();
    if (all[id] && all[id].hotovo) return all[id];      // už hotové — neduplikuj
    const zaznam = Object.assign({ hotovo: true, kdy: new Date().toISOString() }, info || {});
    all[id] = zaznam;
    writeAll(all);

    // do účtu (jen když je uživatel přihlášený; jinak zůstane lokálně)
    try {
      if (typeof sbSaveGlitchDone === "function") sbSaveGlitchDone(id, !!(info && info.correct));
    } catch (_) {}

    // ať na to může reagovat UI (např. přepočítat shrnutí)
    try { window.dispatchEvent(new CustomEvent("glitch:done", { detail: { id: id, zaznam: zaznam } })); } catch (_) {}
    return zaznam;
  }

  const isGlitchDone = (id) => !!(readAll()[id] || {}).hotovo;
  const glitchProgress = () => readAll();
  const doneCount = () => Object.keys(readAll()).length;

  /* Vymaže postup (na testování a na tlačítko v profilu). */
  async function resetProgress() {
    writeAll({});
    try { if (typeof sbResetProgress === "function") await sbResetProgress(); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("glitch:progress-reset")); } catch (_) {}
  }

  window.markGlitchDone = markGlitchDone;
  window.isGlitchDone = isGlitchDone;
  window.glitchProgress = glitchProgress;
  window.glitchDoneCount = doneCount;
  window.resetGlitchProgress = resetProgress;
})();
