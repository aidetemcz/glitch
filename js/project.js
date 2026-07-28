/* ==========================================================================
   Glitch — pracovna projektu (otevírá se z profilu → Tvé projekty)
   4 taby: Projektový plán · Chat s Glitcheem · Zdroje · Sdílení a spolupráce.
   Data se ukládají do projektu (lokálně + Supabase). Spolupráce a zprávy mezi
   uživateli přijdou v dalším kole (zatím sólo pracovna).
   ========================================================================== */
(function () {
  "use strict";

  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const SEND_ICO =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">' +
    '<path d="M4 11.7 20.5 3.8l-7.3 16.7-2.4-6.6L4 11.7Z" stroke="#1a1a1a" stroke-width="1.7" stroke-linejoin="round"/>' +
    '<path d="M10.8 13.9 20.5 3.8" stroke="#1a1a1a" stroke-width="1.7" stroke-linejoin="round"/></svg>';

  const TABS = [
    { id: "plan", icon: "project_project-plan-icon.svg", label: "Projektový plán" },
    { id: "chat", icon: "project-message-icon.svg", label: "Chat s Glitcheem" },
    { id: "zdroje", icon: "project-resources-icon.svg", label: "Zdroje" },
    { id: "sdileni", icon: "project-cooperation-icon.svg", label: "Sdílení a spolupráce" }
  ];

  let pj = null;      // aktuální projekt
  let tab = "plan";
  let saveT = null;

  function normalize(p) {
    if (!p.plan || Array.isArray(p.plan) || typeof p.plan !== "object") p.plan = { start: "", steps: [], deadline: "" };
    if (!Array.isArray(p.plan.steps)) p.plan.steps = [];
    if (p.plan.start == null) p.plan.start = "";
    if (p.plan.deadline == null) p.plan.deadline = "";
    if (!p.resources || Array.isArray(p.resources) || typeof p.resources !== "object") p.resources = { notes: [], links: [], images: [] };
    ["notes", "links", "images"].forEach((k) => { if (!Array.isArray(p.resources[k])) p.resources[k] = []; });
    if (typeof p.msgCount !== "number") p.msgCount = 0;
    return p;
  }

  function save(patch) {
    if (patch) Object.assign(pj, patch);
    if (typeof window.updateProject === "function") window.updateProject(pj.id, pj);
  }
  function saveDebounced() { clearTimeout(saveT); saveT = setTimeout(() => save(), 450); }

  /* ---------- overlay ---------- */
  function open(id) {
    const p = (typeof window.getProject === "function") ? window.getProject(id) : null;
    if (!p) return;
    pj = normalize(p); tab = "plan";
    close();
    const ov = document.createElement("div");
    ov.className = "pj-overlay"; ov.id = "glitch-project";
    ov.innerHTML =
      '<div class="pj-panel">' +
        '<header class="pj-bar">' +
          '<button class="pj-logo" data-pj-close aria-label="Zavřít"><img src="assets/glitch-logo.svg" alt=""></button>' +
          '<span class="pj-spacer"></span>' +
          (pj.quest_topic ? '<span class="badge topic pj-badge">' + esc(pj.quest_topic) + '</span>' : '') +
          '<span class="badge pj-badge pj-badge--proj">Projekt</span>' +
        '</header>' +
        '<div class="pj-tabs">' + TABS.map((t) =>
          '<button class="pj-tab' + (t.id === tab ? ' is-active' : '') + '" data-pj-tab="' + t.id + '" aria-label="' + esc(t.label) + '">' +
          '<span class="pj-tab-ic" style="-webkit-mask-image:url(\'assets/ui/' + t.icon + '\');mask-image:url(\'assets/ui/' + t.icon + '\')"></span></button>'
        ).join("") + '</div>' +
        '<div class="pj-body" data-pj-body></div>' +
      '</div>';
    document.body.appendChild(ov);
    document.body.classList.add("rz-lock");
    ov.addEventListener("click", onClick);
    ov.addEventListener("input", onInput);
    ov.addEventListener("change", onChange);
    render();
  }
  function close() {
    const e = document.getElementById("glitch-project"); if (e) { e.remove(); document.body.classList.remove("rz-lock"); }
    if (typeof window.glitchRefreshProjects === "function") window.glitchRefreshProjects();
  }
  const bodyEl = () => { const o = document.getElementById("glitch-project"); return o && o.querySelector("[data-pj-body]"); };

  function render() {
    const o = document.getElementById("glitch-project"); if (!o) return;
    o.querySelectorAll(".pj-tab").forEach((b) => b.classList.toggle("is-active", b.dataset.pjTab === tab));
    const b = bodyEl();
    if (tab === "plan") b.innerHTML = planHtml();
    else if (tab === "zdroje") b.innerHTML = zdrojeHtml();
    else if (tab === "sdileni") b.innerHTML = sdileniHtml();
    else if (tab === "chat") { b.innerHTML = chatHtml(); startChat(); }
    b.scrollTop = 0;
  }

  /* ---------- tab: Projektový plán ---------- */
  function planHtml() {
    const steps = pj.plan.steps;
    const stepRows = steps.map((s, i) =>
      '<div class="pj-step">' +
        '<input class="pj-input pj-step-in" data-pj-step="' + i + '" value="' + esc(s.text || "") + '" placeholder="Krok…">' +
        '<button class="pj-check' + (s.done ? ' is-on' : '') + '" data-pj-step-done="' + i + '" type="button" aria-label="Hotovo"></button>' +
      '</div>').join("");
    return '<div class="pj-scroll">' +
      (pj.done ? '<div class="pj-done-banner">Projekt je dokončený 🎉</div>' : '') +
      '<h3 class="pj-h">Čím začnu</h3>' +
      '<input class="pj-input" data-pj-start value="' + esc(pj.plan.start) + '" placeholder="Napiš, čím začneš…">' +
      '<div class="pj-steps-head"><h3 class="pj-h">Další kroky</h3><span class="pj-steps-hint">Hotovo</span></div>' +
      '<div class="pj-steps" data-pj-steps>' + stepRows + '</div>' +
      '<button class="pj-add" data-pj-add-step type="button"><span class="pj-add-ic"><img src="assets/ui/Plus.svg" alt=""></span>Přidat další krok</button>' +
      '<h3 class="pj-h" style="margin-top:calc(24 * var(--u))">Termín dokončení</h3>' +
      '<input class="pj-input" data-pj-deadline value="' + esc(pj.plan.deadline) + '" placeholder="Např. do konce měsíce…">' +
      '<div class="pj-plan-cta">' +
        '<button class="pj-finish" data-pj-finish type="button">' + (pj.done ? "Označit jako nedokončený" : "Dokončit projekt") + '</button>' +
      '</div>' +
    '</div>';
  }

  /* ---------- tab: Zdroje ---------- */
  function zdrojeHtml() {
    const listInputs = (arr, kind, ph) => arr.map((v, i) =>
      '<input class="pj-input pj-res" data-pj-res="' + kind + '" data-pj-res-i="' + i + '" value="' + esc(v) + '" placeholder="' + ph + '">').join("");
    const imgs = pj.resources.images.map((src, i) =>
      '<div class="pj-img has-img"><img src="' + src + '" alt=""><button class="pj-img-del" data-pj-img-del="' + i + '" type="button" aria-label="Odebrat">×</button></div>').join("");
    return '<div class="pj-scroll">' +
      '<p class="pj-lead g-p">Sem si můžeš přidávat různé odkazy, obrázky, psát poznámky…</p>' +
      '<h3 class="pj-h">Poznámky</h3>' +
      '<div class="pj-reslist" data-pj-reslist="notes">' + listInputs(pj.resources.notes.length ? pj.resources.notes : [""], "notes", "Poznámka…") + '</div>' +
      '<button class="pj-add" data-pj-add-res="notes" type="button"><span class="pj-add-ic"><img src="assets/ui/Plus.svg" alt=""></span>Přidat další poznámku</button>' +
      '<h3 class="pj-h">Odkazy</h3>' +
      '<div class="pj-reslist" data-pj-reslist="links">' + listInputs(pj.resources.links.length ? pj.resources.links : [""], "links", "https://…") + '</div>' +
      '<button class="pj-add" data-pj-add-res="links" type="button"><span class="pj-add-ic"><img src="assets/ui/Plus.svg" alt=""></span>Přidat další odkaz</button>' +
      '<h3 class="pj-h">Obrázky</h3>' +
      '<div class="pj-imgs">' + imgs +
        '<button class="pj-img pj-img-add" data-pj-img-add type="button"><span class="pj-imgbox-plus"><img src="assets/ui/Plus.svg" alt=""></span></button>' +
      '</div>' +
      '<input type="file" accept="image/*" class="pj-file" data-pj-file hidden>' +
    '</div>';
  }

  /* ---------- tab: Sdílení a spolupráce (sólo verze) ---------- */
  function sdileniHtml() {
    return '<div class="pj-scroll">' +
      '<h2 class="pj-title g-h3">Spolupráce a sdílení</h2>' +
      '<p class="pj-lead g-p">Přizvi do projektu své kamarády*ky. Můžete spolupracovat! Nastav si také sdílení projektu.</p>' +
      '<h3 class="pj-h">S kým na projektu spolupracuješ</h3>' +
      '<div class="pf-empty" style="text-align:left;padding:calc(10 * var(--u)) 0">Zatím na projektu pracuješ sám*a.</div>' +
      '<h3 class="pj-h">Přizvat další</h3>' +
      '<button class="pj-soon" data-pj-soon type="button">Přizvat spolupracovníky — připravuje se</button>' +
      '<h3 class="pj-h" style="margin-top:calc(24 * var(--u))">Sdílení projektu</h3>' +
      '<label class="pj-row"><span class="pj-row-label">' + (pj.shared ? "Tento projekt je veřejný" : "Tento projekt je soukromý") + '</span>' +
        '<span class="pf-toggle"><input type="checkbox" data-pj-shared' + (pj.shared ? "" : " checked") + '><span class="pf-knob"></span></span></label>' +
      '<p class="pj-hint g-p-s">Soukromý projekt vidíš jen ty (a přizvaní spolupracovníci). Veřejný se objeví na tvém profilu.</p>' +
    '</div>';
  }

  /* ---------- tab: Chat s Glitcheem ---------- */
  const AVA = "assets/ui/avatar-icon.png";
  function chatHtml() {
    return '<div class="pj-chat-head">' +
        '<h2 class="pj-title g-h3">Poraď se Glitcheem</h2>' +
        '<p class="pj-lead g-p">Glitchee je tu od toho, aby ti pomohl s projektem. Neboj se na cokoliv zeptat.</p>' +
      '</div>' +
      '<div class="rz-thread pj-thread" data-pj-thread></div>' +
      '<form class="rz-input pj-input-bar" data-pj-form>' +
        '<input class="rz-input-field" type="text" placeholder="Začni psát…" aria-label="Napiš zprávu" autocomplete="off">' +
        '<button class="rz-send" type="submit" aria-label="Odeslat">' + SEND_ICO + '</button>' +
      '</form>' +
      '<p class="rz-disclaimer g-p-s">Glitchee je chatbot, nemá emoce a může dělat chyby.</p>';
  }
  function appendMsg(from, text) {
    const t = bodyEl().querySelector("[data-pj-thread]"); if (!t) return null;
    const el = document.createElement("div");
    if (from === "bot") { el.className = "rz-msg rz-msg--bot"; el.innerHTML = '<span class="rz-ava rz-ava--bot"><img src="' + AVA + '" alt="Chatbot"></span><div class="rz-bubble"></div>'; }
    else { el.className = "rz-msg rz-msg--user"; el.innerHTML = '<div class="rz-bubble"></div><span class="rz-ava rz-ava--user"></span>'; }
    el.querySelector(".rz-bubble").textContent = text;
    t.appendChild(el);
    const b = bodyEl(); if (b) b.scrollTop = b.scrollHeight;
    return el;
  }
  function projectContext() {
    return {
      nazev: pj.title, glitch: pj.quest_topic,
      start: pj.plan.start,
      kroky: pj.plan.steps.map((s) => ({ text: s.text, done: !!s.done })),
      termin: pj.plan.deadline,
      poznamky: pj.resources.notes.filter(Boolean),
      odkazy: pj.resources.links.filter(Boolean),
      obrazky: pj.resources.images.length
    };
  }
  function buildZak() {
    const out = {};
    let user = {}; try { user = JSON.parse(localStorage.getItem("tg_user") || "{}"); } catch (_) {}
    const o = {}; if (user.age) o.vek = user.age; if (user.gender) o.gender = user.gender;
    if (Object.keys(o).length) out.osobni = o;
    return Object.keys(out).length ? out : null;
  }
  let chatHistory = [];
  function startChat() {
    chatHistory = [];
    const form = bodyEl().querySelector("[data-pj-form]");
    if (form && !form.__wired) {
      form.__wired = true;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const f = form.querySelector(".rz-input-field");
        const txt = (f.value || "").trim(); if (!txt) return;
        f.value = ""; ask(txt);
      });
    }
    ask("(Uživatel právě otevřel chat v pracovně svého projektu. Pozdrav ho krátce jako Glitchee — mentor projektu, " +
        "dej najevo, že znáš jeho projekt (viz PROJEKT), a zeptej se, s čím mu s projektem pomůžeš.)", { silent: true });
  }
  async function ask(text, opts) {
    opts = opts || {};
    const form = bodyEl().querySelector("[data-pj-form]");
    const field = form && form.querySelector(".rz-input-field");
    const sendBtn = form && form.querySelector(".rz-send");
    if (text) {
      chatHistory.push({ role: "user", content: text });
      if (!opts.silent) {
        appendMsg("user", text);
        pj.msgCount = (pj.msgCount || 0) + 1; save();   // počítadlo konverzací
      }
    }
    if (field) field.disabled = true; if (sendBtn) sendBtn.disabled = true;
    const typing = appendMsg("bot", "…"); if (typing) typing.classList.add("rz-typing");
    try {
      if (typeof window.gptChat !== "function") throw new Error("no-endpoint");
      const reply = await window.gptChat(chatHistory, {
        persona: "glitchee-projekt", freechat: true, temperature: 0.5,
        project: projectContext(), zak: buildZak()
      });
      if (typing) typing.remove();
      chatHistory.push({ role: "assistant", content: reply });
      if (reply) appendMsg("bot", reply);
    } catch (err) {
      if (typing) typing.remove();
      appendMsg("bot", "Teď se mi nepovedlo odpovědět. Zkus to prosím za chvilku.");
    } finally {
      if (field) { field.disabled = false; field.focus(); }
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  /* ---------- interakce ---------- */
  function onClick(e) {
    if (e.target.closest("[data-pj-close]")) { close(); return; }
    const tb = e.target.closest("[data-pj-tab]");
    if (tb) { tab = tb.dataset.pjTab; render(); return; }

    // plán
    const sd = e.target.closest("[data-pj-step-done]");
    if (sd) { const i = +sd.dataset.pjStepDone; pj.plan.steps[i].done = !pj.plan.steps[i].done; sd.classList.toggle("is-on"); save(); return; }
    if (e.target.closest("[data-pj-add-step]")) { pj.plan.steps.push({ text: "", done: false }); save(); render(); return; }
    const fin = e.target.closest("[data-pj-finish]");
    if (fin) { save({ done: !pj.done }); if (typeof window.glitchToast === "function") window.glitchToast(pj.done ? "Projekt dokončen 🎉" : "Projekt otevřen"); render(); return; }

    // zdroje
    const addRes = e.target.closest("[data-pj-add-res]");
    if (addRes) { const k = addRes.dataset.pjAddRes; if (!pj.resources[k].length) pj.resources[k].push(""); pj.resources[k].push(""); save(); render(); return; }
    if (e.target.closest("[data-pj-img-add]")) { const f = document.querySelector("[data-pj-file]"); if (f) f.click(); return; }
    const imgDel = e.target.closest("[data-pj-img-del]");
    if (imgDel) { pj.resources.images.splice(+imgDel.dataset.pjImgDel, 1); save(); render(); return; }

    // sdílení
    if (e.target.closest("[data-pj-soon]")) { if (typeof window.glitchToast === "function") window.glitchToast("Přizvání spolupracovníků se připravuje."); return; }
  }
  function onInput(e) {
    const t = e.target;
    if (t.matches("[data-pj-start]")) { pj.plan.start = t.value; saveDebounced(); return; }
    if (t.matches("[data-pj-deadline]")) { pj.plan.deadline = t.value; saveDebounced(); return; }
    if (t.matches("[data-pj-step]")) { pj.plan.steps[+t.dataset.pjStep].text = t.value; saveDebounced(); return; }
    if (t.matches("[data-pj-res]")) {
      const k = t.dataset.pjRes, i = +t.dataset.pjResI;
      while (pj.resources[k].length <= i) pj.resources[k].push("");
      pj.resources[k][i] = t.value; saveDebounced(); return;
    }
  }
  function onChange(e) {
    const t = e.target;
    if (t.matches("[data-pj-shared]")) { save({ shared: !t.checked }); render(); return; }  // checked = soukromý
    if (t.matches("[data-pj-file]")) {
      const f = t.files && t.files[0];
      if (f) readImageScaled(f, (url) => { if (url) { pj.resources.images.push(url); save(); render(); } });
      t.value = "";
    }
  }

  function readImageScaled(file, cb) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1024, scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        try { cb(cv.toDataURL("image/jpeg", 0.85)); } catch (_) { cb(null); }
      };
      img.onerror = () => cb(null); img.src = reader.result;
    };
    reader.onerror = () => cb(null); reader.readAsDataURL(file);
  }

  window.glitchOpenProject = open;
  window.glitchCloseProject = close;
})();
