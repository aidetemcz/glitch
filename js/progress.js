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
    clearGlitchRetry(id);              // hotové už nečeká na druhou šanci

    // do účtu (jen když je uživatel přihlášený; jinak zůstane lokálně)
    try {
      if (typeof sbSaveGlitchDone === "function") sbSaveGlitchDone(id, !!(info && info.correct));
    } catch (_) {}

    // ať na to může reagovat UI (např. přepočítat shrnutí)
    try { window.dispatchEvent(new CustomEvent("glitch:done", { detail: { id: id, zaznam: zaznam } })); } catch (_) {}
    return zaznam;
  }

  /* Druhá šance: Glitch, který žák neuhodl, se nezavírá — poznamená se
     a doporučovač ho v dalším feedu zařadí o kus dál (ne hned na začátek). */
  const RETRY_KEY = "tg_retry";
  function markGlitchRetry(id) {
    if (!id) return;
    let all = {};
    try { all = JSON.parse(localStorage.getItem(RETRY_KEY) || "{}"); } catch (_) {}
    all[id] = { kdy: new Date().toISOString(), pokusy: ((all[id] || {}).pokusy || 0) + 1 };
    try { localStorage.setItem(RETRY_KEY, JSON.stringify(all)); } catch (_) {}
  }
  function clearGlitchRetry(id) {
    let all = {};
    try { all = JSON.parse(localStorage.getItem(RETRY_KEY) || "{}"); } catch (_) {}
    if (all[id]) { delete all[id]; try { localStorage.setItem(RETRY_KEY, JSON.stringify(all)); } catch (_) {} }
  }

  const isGlitchDone = (id) => !!(readAll()[id] || {}).hotovo;
  const glitchProgress = () => readAll();
  const doneCount = () => Object.keys(readAll()).length;

  /* Vymaže postup (na testování a na tlačítko v profilu). */
  async function resetProgress() {
    writeAll({});
    try { localStorage.removeItem(RETRY_KEY); } catch (_) {}
    try { if (typeof sbResetProgress === "function") await sbResetProgress(); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("glitch:progress-reset")); } catch (_) {}
  }

  window.markGlitchDone = markGlitchDone;
  window.markGlitchRetry = markGlitchRetry;
  window.clearGlitchRetry = clearGlitchRetry;
  window.isGlitchDone = isGlitchDone;
  window.glitchProgress = glitchProgress;
  window.glitchDoneCount = doneCount;
  window.resetGlitchProgress = resetProgress;
})();
