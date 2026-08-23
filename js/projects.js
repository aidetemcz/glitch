/* ==========================================================================
   Glitch — projekty (fork posledního Glitche questu → pracovna žáka)
   Fáze 1: založení a výpis projektů. Ukládá se lokálně (localStorage) vždy;
   přihlášenému uživateli i do Supabase (tabulka `projects`).
   Pracovna (zdroje, poznámky, fotky, chat) a sdílení do feedu přijdou dál.
   ========================================================================== */
(function () {
  "use strict";

  const KEY = "tg_projects";
  const readAll = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (_) { return []; } };
  const writeAll = (a) => { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (_) {} };

  /* Založí projekt z (posledního) Glitche questu. Jeden projekt na glitch_id.
     info … { glitch_id, quest_topic, title, brief } */
  function createProject(info) {
    info = info || {};
    if (!info.glitch_id) return null;
    const all = readAll();
    const existing = all.find((p) => p.glitch_id === info.glitch_id);
    if (existing) return existing;                      // už forknuto — nezakládej znovu
    const p = {
      id: "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      glitch_id: info.glitch_id,
      quest_topic: info.quest_topic || "",
      title: info.title || "Projekt",
      brief: info.brief || "",
      // pracovna: plán, zdroje, počítadla, stav
      plan: { start: "", steps: [], deadline: "" },
      resources: { notes: [], links: [], images: [] },
      msgCount: 0, done: false, shared: false,
      kdy: new Date().toISOString()
    };
    all.unshift(p);
    writeAll(all);
    try { if (typeof sbCreateProject === "function") sbCreateProject(p); } catch (_) {}
    try { if (typeof sbLogEvent === "function") sbLogEvent("project", p.glitch_id, { quest_topic: p.quest_topic || null }); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("project:created", { detail: p })); } catch (_) {}
    return p;
  }

  // Sloučí opravu do projektu (lokálně + Supabase). Vrací aktualizovaný projekt.
  function updateProject(id, patch) {
    const all = readAll();
    const p = all.find((x) => x.id === id);
    if (!p) return null;
    Object.assign(p, patch || {});
    writeAll(all);
    try { if (typeof sbUpdateProject === "function") sbUpdateProject(p); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("project:changed", { detail: p })); } catch (_) {}
    return p;
  }

  // Počet zdrojů = neprázdné poznámky + odkazy + obrázky.
  function resourceCount(p) {
    const r = (p && p.resources) || {};
    const n = (r.notes || []).filter((x) => String(x || "").trim()).length;
    const l = (r.links || []).filter((x) => String(x || "").trim()).length;
    const i = (r.images || []).length;
    return n + l + i;
  }
  function stepsProgress(p) {
    const steps = (p && p.plan && p.plan.steps) || [];
    return { done: steps.filter((s) => s && s.done).length, total: steps.length };
  }

  const listProjects = () => readAll();
  const getProject = (id) => readAll().find((p) => p.id === id) || null;
  const projectForGlitch = (glitchId) => readAll().find((p) => p.glitch_id === glitchId) || null;
  const hasProject = (glitchId) => !!projectForGlitch(glitchId);

  function removeProject(id) {
    const all = readAll();
    const p = all.find((x) => x.id === id);
    writeAll(all.filter((x) => x.id !== id));
    try { if (p && typeof sbRemoveProject === "function") sbRemoveProject(p.glitch_id); } catch (_) {}
    try { window.dispatchEvent(new CustomEvent("project:changed")); } catch (_) {}
  }

  window.createProject = createProject;
  window.updateProject = updateProject;
  window.resourceCount = resourceCount;
  window.stepsProgress = stepsProgress;
  window.listProjects = listProjects;
  window.getProject = getProject;
  window.projectForGlitch = projectForGlitch;
  window.hasProject = hasProject;
  window.removeProject = removeProject;
})();
