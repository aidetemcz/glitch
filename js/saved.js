/* ==========================================================================
   Glitch — menu Glitche: „Uložit Glitch" a „Tohle mě nezajímá"
   Uloženo lokálně (localStorage) vždy; přihlášenému i do Supabase.
   - saved: tg_saved → profil → Uložené
   - nezajímá: tg_notinterested (témata) → doporučovač je down-rankuje,
     pokud si je uživatel nedá do zájmů (zájem má přednost)
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Uložené Glitche ---- */
  const SAVED = "tg_saved";
  const readSaved = () => { try { return JSON.parse(localStorage.getItem(SAVED) || "[]"); } catch (_) { return []; } };
  const writeSaved = (a) => { try { localStorage.setItem(SAVED, JSON.stringify(a)); } catch (_) {} };

  function saveGlitch(info) {
    info = info || {};
    if (!info.id) return null;
    const all = readSaved();
    if (all.some((s) => s.id === info.id)) return all;           // už uložené
    all.unshift({ id: info.id, topic: info.topic || "", title: info.title || "", type: info.type || "", kdy: new Date().toISOString() });
    writeSaved(all);
    try { if (typeof sbSaveSaved === "function") sbSaveSaved(info); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("saved:changed")); } catch (_) {}
    return all;
  }
  function unsaveGlitch(id) {
    writeSaved(readSaved().filter((s) => s.id !== id));
    try { if (typeof sbUnsaveSaved === "function") sbUnsaveSaved(id); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("saved:changed")); } catch (_) {}
  }
  const listSaved = () => readSaved();
  const isSaved = (id) => readSaved().some((s) => s.id === id);

  /* ---- „Tohle mě nezajímá" (negativní signál k tématu) ---- */
  const NI = "tg_notinterested";
  const norm = (s) => String(s || "").trim().toLowerCase();
  const readNI = () => { try { return JSON.parse(localStorage.getItem(NI) || "[]"); } catch (_) { return []; } };
  const writeNI = (a) => { try { localStorage.setItem(NI, JSON.stringify(a)); } catch (_) {} };

  function markNotInterested(topic) {
    if (!topic) return;
    const all = readNI();
    if (!all.some((t) => norm(t) === norm(topic))) { all.push(topic); writeNI(all); }
    try { if (typeof sbMarkNotInterested === "function") sbMarkNotInterested(topic); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("notinterested:changed", { detail: { topic: topic } })); } catch (_) {}
  }
  const notInterestedTopics = () => readNI();

  window.saveGlitch = saveGlitch;
  window.unsaveGlitch = unsaveGlitch;
  window.listSaved = listSaved;
  window.isSaved = isSaved;
  window.markNotInterested = markNotInterested;
  window.notInterestedTopics = notInterestedTopics;
})();
