/* ==========================================================================
   Glitch — tvorba nového Glitche (tlačítko + ve spodním menu)
   Pětikrokový tok: 1) typ, 2) popis, 3) zdroje, 4) chat se Stavitelem Glitche,
   5) náhled + Upravit / Schválit. Schválený Glitch se uloží jako Glitchpost
   (lokálně + Supabase) a objeví se v profilu autora.
   ========================================================================== */
(function () {
  "use strict";

  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const SEND_ICO =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">' +
    '<path d="M4 11.7 20.5 3.8l-7.3 16.7-2.4-6.6L4 11.7Z" stroke="#1a1a1a" stroke-width="1.7" stroke-linejoin="round"/>' +
    '<path d="M10.8 13.9 20.5 3.8" stroke="#1a1a1a" stroke-width="1.7" stroke-linejoin="round"/></svg>';

  const TYPES = [
    { typ: "inspirace", label: "Chci ostatní inspirovat." },
    { typ: "basic", label: "Chci ostatní naučit konkrétní věc." },
    { typ: "vyzva", label: "Chci dát výzvu nebo hádanku." }
  ];

  let st = null;   // stav právě otevřeného toku

  /* ---------- lokální úložiště Glitchpostů (rychlé zobrazení v profilu) ---------- */
  const GP_KEY = "tg_glitchposts";
  function readGp() { try { return JSON.parse(localStorage.getItem(GP_KEY) || "[]"); } catch (_) { return []; } }
  function writeGp(a) { try { localStorage.setItem(GP_KEY, JSON.stringify(a)); } catch (_) {} }
  function addGp(post) {
    const all = readGp().filter((p) => p.id !== post.id);
    all.unshift(post);
    writeGp(all.slice(0, 100));
  }
  window.listGlitchposts = () => readGp();

  /* ---------- obrázky ---------- */
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
      img.onerror = () => cb(null);
      img.src = reader.result;
    };
    reader.onerror = () => cb(null);
    reader.readAsDataURL(file);
  }

  /* ---------- karta z výstupu Stavitele ---------- */
  const GLITCH_RE = /```glitch\s*([\s\S]*?)```/i;
  function extractGlitch(text) {
    const m = GLITCH_RE.exec(text || "");
    if (!m) return { text: text, glitch: null };
    let g = null;
    try { g = JSON.parse(m[1].trim()); } catch (_) {}
    return { text: (text.slice(0, m.index) + text.slice(m.index + m[0].length)).trim(), glitch: g };
  }
  function mapCard(g, images) {
    const id = "up-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const topic = g.tema || "";
    const img = images && images[0] ? images[0] : undefined;
    if (g.typ === "vyzva") {
      const moz = Array.isArray(g.moznosti) ? g.moznosti : [];
      return {
        id: id, type: "quick_challenge", topic: topic, category: "Výzva", trust: "community",
        question: g.otazka || g.nadpis || "", taskText: g.text || "",
        answers: moz.map((m) => ({ label: String((m && m.text) || ""), correct: !!(m && m.spravne) })),
        image: img
      };
    }
    if (g.typ === "inspirace") {
      return { id: id, type: "inspirace", topic: topic, trust: "community",
        title: g.nadpis || "", body: g.text || "", image: img };
    }
    // basic
    return {
      id: id, type: "quest_intro", topic: topic, trust: "community",
      title: g.nadpis || "", body: g.text || "", image: img,
      rozklik: { kind: "chat", title: g.nadpis || "", intro: g.chat_uvod || g.text || "",
        persona: "glitchee", cil: g.cil || "" }
    };
  }

  /* ---------- overlay + kroky ---------- */
  function open() {
    close();
    st = { step: 1, typ: null, popis: "", images: [], urls: ["", ""], card: null, history: [], chatStarted: false };
    const ov = document.createElement("div");
    ov.className = "cr-overlay"; ov.id = "glitch-create";
    ov.innerHTML =
      '<div class="cr-panel">' +
        '<header class="cr-bar">' +
          '<button class="cr-logo" data-cr-close aria-label="Zavřít"><img src="assets/glitch-logo.svg" alt=""></button>' +
          '<span class="cr-step" data-cr-step>1/5</span>' +
          '<span class="cr-spacer"></span>' +
          '<span class="cr-tag">Nový Glitch</span>' +
        '</header>' +
        '<div class="cr-body" data-cr-body></div>' +
      '</div>';
    document.body.appendChild(ov);
    document.body.classList.add("rz-lock");
    ov.addEventListener("click", onClick);
    ov.addEventListener("input", onInput);
    render();
  }
  function close() {
    const e = document.getElementById("glitch-create"); if (e) e.remove();
    const p = document.getElementById("glitch-create-preview"); if (p) p.remove();
    document.body.classList.remove("rz-lock");
    st = null;
  }

  const ov = () => document.getElementById("glitch-create");
  const body = () => { const o = ov(); return o && o.querySelector("[data-cr-body]"); };

  function setStep(n) { st.step = n; render(); }

  function render() {
    const o = ov(); if (!o) return;
    o.querySelector("[data-cr-step]").textContent = st.step + "/5";
    const b = body();
    if (st.step === 1) b.innerHTML = step1();
    else if (st.step === 2) b.innerHTML = step2();
    else if (st.step === 3) b.innerHTML = step3();
    else if (st.step === 4) { b.innerHTML = step4(); startChatIfNeeded(); }
    b.scrollTop = 0;
  }

  const nextBtn = (label, dis) =>
    '<div class="cr-footer"><button class="cr-next" data-cr-next' + (dis ? " disabled" : "") + ' type="button">' + (label || "Další krok") + '</button></div>';

  function step1() {
    const opts = TYPES.map((t) =>
      '<button class="cr-opt' + (st.typ === t.typ ? " is-sel" : "") + '" data-cr-typ="' + t.typ + '" type="button">' + esc(t.label) + '</button>'
    ).join("");
    return '<div class="cr-scroll">' +
      '<h1 class="cr-h1 g-h2">Co chceš dnes ostatní naučit?</h1>' +
      '<p class="cr-lead g-p">Ahoj! To je skvělé, že máš něco zajímavého, o co se chceš podělit. Pojďme pěkně krok za krokem.</p>' +
      '<h2 class="cr-h2 g-h4">Co je tvým záměrem?</h2>' +
      '<p class="cr-sub g-p">Zvol jednu z následujích možností:</p>' +
      '<div class="cr-opts">' + opts + '</div>' +
      '</div>' + nextBtn("Další krok", !st.typ);
  }
  function step2() {
    return '<div class="cr-scroll">' +
      '<h1 class="cr-h1 g-h4">Popiš, o co jde</h1>' +
      '<p class="cr-sub g-p">Zkus svůj záměr co nejlépe vysvětlit:</p>' +
      '<textarea class="cr-textarea" data-cr-popis placeholder="Začni psát…">' + esc(st.popis) + '</textarea>' +
      '</div>' + nextBtn("Další krok", !st.popis.trim());
  }
  function step3() {
    let boxes = "";
    for (let i = 0; i < 2; i++) {
      if (st.images[i]) {
        boxes += '<div class="cr-imgbox has-img"><img src="' + st.images[i] + '" alt="">' +
          '<button class="cr-thumb-del" data-cr-img-del="' + i + '" type="button" aria-label="Odebrat">×</button></div>';
      } else {
        boxes += '<button class="cr-imgbox" data-cr-img-add type="button">' +
          '<span class="cr-imgbox-plus"><img src="assets/ui/Plus.svg" alt="Přidat obrázek"></span></button>';
      }
    }
    return '<div class="cr-scroll">' +
      '<h1 class="cr-h1 g-h4">Máš k tomu nějaké zdroje?</h1>' +
      '<p class="cr-sub g-p">Může to být odkaz na webovou stránku nebo obrázek. Obrázky jsou pro Glitch nejlepší čtvercové.</p>' +
      '<p class="cr-label g-p">Sem můžeš přidat obrázky (max. 2):</p>' +
      '<div class="cr-imgs">' + boxes + '</div>' +
      '<input type="file" accept="image/*" class="cr-file" data-cr-file hidden>' +
      '<p class="cr-label g-p">Sem můžeš vložit adresy webových stránek:</p>' +
      '<input class="cr-url" data-cr-url="0" value="' + esc(st.urls[0]) + '" placeholder="https://…" autocomplete="off">' +
      '<input class="cr-url" data-cr-url="1" value="' + esc(st.urls[1]) + '" placeholder="https://…" autocomplete="off">' +
      '</div>' + nextBtn("Další krok", false);
  }
  function step4() {
    return '<div class="cr-chat">' +
      '<div class="rz-thread cr-thread" data-cr-thread></div>' +
      '</div>' +
      '<form class="rz-input cr-input" data-cr-form>' +
        '<input class="rz-input-field" type="text" placeholder="Začni psát…" aria-label="Napiš zprávu" autocomplete="off">' +
        '<button class="rz-send" type="submit" aria-label="Odeslat">' + SEND_ICO + '</button>' +
      '</form>';
  }

  /* ---------- chat se Stavitelem ---------- */
  const AVA = "assets/ui/avatar-icon.png";
  function appendBot(text) {
    const t = body().querySelector("[data-cr-thread]");
    const el = document.createElement("div");
    el.className = "rz-msg rz-msg--bot";
    el.innerHTML = '<span class="rz-ava rz-ava--bot"><img src="' + AVA + '" alt="Chatbot"></span><div class="rz-bubble"></div>';
    el.querySelector(".rz-bubble").textContent = text;
    t.appendChild(el);
    scrollChat();
    return el;
  }
  function appendUser(text) {
    const t = body().querySelector("[data-cr-thread]");
    const el = document.createElement("div");
    el.className = "rz-msg rz-msg--user";
    el.innerHTML = '<div class="rz-bubble"></div><span class="rz-ava rz-ava--user"></span>';
    el.querySelector(".rz-bubble").textContent = text;
    t.appendChild(el);
    scrollChat();
  }
  function scrollChat() { const b = body(); if (b) b.scrollTop = b.scrollHeight; }

  function startChatIfNeeded() {
    if (st.chatStarted) {
      // překreslení kroku 4 (návrat z náhledu) — obnov vlákno z historie
      const t = body().querySelector("[data-cr-thread]");
      st.history.forEach((m) => {
        if (m.role === "assistant") appendBot(m.content);
        else if (m.role === "user" && !/^\(/.test(m.content)) appendUser(m.content);
      });
      wireChatForm();
      return;
    }
    st.chatStarted = true;
    wireChatForm();
    const parts = [];
    parts.push('Autor tvoří nový Glitch typu "' + st.typ + '".');
    if (st.popis) parts.push('Popis záměru: "' + st.popis + '".');
    const urls = st.urls.filter(Boolean);
    if (urls.length) parts.push("Odkazy: " + urls.join(", ") + ".");
    if (st.images.length) parts.push("Přiložil " + st.images.length + " obráz" + (st.images.length > 1 ? "ky" : "ek") + " — podívej se na ně a využij, co na nich je.");
    const kickoff = "(" + parts.join(" ") + " Pozdrav autora, shrň krátce, co chápeš, a doptej se na to, co ještě chybí pro tenhle typ Glitche. Glitch zatím nestav.)";
    ask(kickoff, { silent: true, images: st.images });
  }

  function wireChatForm() {
    const form = body().querySelector("[data-cr-form]");
    if (!form || form.__wired) return;
    form.__wired = true;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const field = form.querySelector(".rz-input-field");
      const text = (field.value || "").trim();
      if (!text) return;
      field.value = "";
      ask(text);
    });
  }

  async function ask(text, opts) {
    opts = opts || {};
    const form = body().querySelector("[data-cr-form]");
    const field = form && form.querySelector(".rz-input-field");
    const sendBtn = form && form.querySelector(".rz-send");
    if (text) {
      st.history.push({ role: "user", content: text });
      if (!opts.silent) appendUser(text);
    }
    if (field) field.disabled = true; if (sendBtn) sendBtn.disabled = true;
    const typing = appendBot("…"); typing.classList.add("rz-typing");
    try {
      if (typeof window.gptChat !== "function") throw new Error("no-endpoint");
      const reply = await window.gptChat(st.history, {
        persona: "stavitel-glitche", freechat: true, temperature: 0.4,
        images: opts.images && opts.images.length ? opts.images : undefined
      });
      typing.remove();
      st.history.push({ role: "assistant", content: reply });
      const parsed = extractGlitch(reply);
      if (parsed.text) appendBot(parsed.text);
      if (parsed.glitch) {
        st.card = mapCard(parsed.glitch, st.images);
        setTimeout(() => showPreview(st.card), 350);
      }
    } catch (err) {
      typing.remove();
      appendBot("Teď se mi nepovedlo odpovědět. Zkus to prosím za chvilku.");
    } finally {
      if (field) field.disabled = false; if (sendBtn) sendBtn.disabled = false;
      if (field) field.focus();
      scrollChat();
    }
  }

  /* ---------- náhled (samostatný overlay nad tvorbou) ---------- */
  function showPreview(card) {
    const old = document.getElementById("glitch-create-preview"); if (old) old.remove();
    const pv = document.createElement("div");
    pv.className = "cr-preview-overlay"; pv.id = "glitch-create-preview";
    pv.innerHTML =
      '<div class="cr-preview-panel">' +
        '<div class="cr-approve">' +
          '<span class="cr-approve-label g-p">Náhled Glitche</span>' +
          '<div class="cr-approve-btns">' +
            '<button class="cr-btn cr-btn--edit" data-cr-edit type="button">Upravit</button>' +
            '<button class="cr-btn cr-btn--ok" data-cr-approve type="button">Schválit</button>' +
          '</div>' +
        '</div>' +
        '<div class="cr-preview-stage" data-cr-stage></div>' +
      '</div>';
    document.body.appendChild(pv);
    const stage = pv.querySelector("[data-cr-stage]");
    if (typeof window.glitchPreviewCard === "function") {
      const el = window.glitchPreviewCard(card);
      if (el) stage.appendChild(el);
    } else {
      stage.innerHTML = '<div class="pf-empty">Náhled se nepodařilo vykreslit.</div>';
    }
    pv.addEventListener("click", (e) => {
      if (e.target.closest("[data-cr-edit]")) {
        pv.remove();
        const f = body() && body().querySelector(".rz-input-field");
        if (f) { f.focus(); }
        return;
      }
      if (e.target.closest("[data-cr-approve]")) { approve(card); return; }
    });
  }

  function approve(card) {
    const post = {
      id: card.id,
      title: card.title || card.question || card.claim || "Glitch",
      card: card,
      created_at: new Date().toISOString()
    };
    addGp(post);
    try { if (typeof sbSaveGlitchpost === "function") sbSaveGlitchpost(post); } catch (_) {}
    close();
    if (typeof window.glitchToast === "function") window.glitchToast("Glitch je hotový — najdeš ho v profilu.");
    if (typeof window.glitchOpenProfile === "function") window.glitchOpenProfile("saved");
  }

  /* ---------- otevření náhledu Glitchpostu odjinud (profil) ---------- */
  window.glitchOpenGlitchpost = function (card) {
    if (!card) return;
    const pv = document.createElement("div");
    pv.className = "cr-preview-overlay"; pv.id = "glitch-create-preview";
    pv.innerHTML =
      '<div class="cr-preview-panel">' +
        '<div class="cr-approve">' +
          '<button class="cr-approve-close" data-cr-pv-close aria-label="Zavřít"><img src="assets/ui/Exit.svg" alt=""></button>' +
          '<span class="cr-approve-label g-p">Glitchpost</span>' +
        '</div>' +
        '<div class="cr-preview-stage" data-cr-stage></div>' +
      '</div>';
    document.body.appendChild(pv);
    document.body.classList.add("rz-lock");
    const stage = pv.querySelector("[data-cr-stage]");
    if (typeof window.glitchPreviewCard === "function") {
      const el = window.glitchPreviewCard(card);
      if (el) stage.appendChild(el);
    }
    pv.addEventListener("click", (e) => {
      if (e.target === pv || e.target.closest("[data-cr-pv-close]")) { pv.remove(); document.body.classList.remove("rz-lock"); }
    });
  };

  /* ---------- delegace klik / input ---------- */
  function onClick(e) {
    if (e.target.closest("[data-cr-close]")) { close(); return; }
    const typ = e.target.closest("[data-cr-typ]");
    if (typ) {
      st.typ = typ.dataset.crTyp;
      body().querySelectorAll("[data-cr-typ]").forEach((b) => b.classList.toggle("is-sel", b === typ));
      const n = body().querySelector("[data-cr-next]"); if (n) n.disabled = false;
      return;
    }
    if (e.target.closest("[data-cr-img-add]")) { const f = ov().querySelector("[data-cr-file]"); if (f) f.click(); return; }
    const del = e.target.closest("[data-cr-img-del]");
    if (del) { st.images.splice(Number(del.dataset.crImgDel), 1); render(); return; }
    const next = e.target.closest("[data-cr-next]");
    if (next) {
      if (next.disabled) return;
      if (st.step < 4) setStep(st.step + 1);
      return;
    }
  }
  function onInput(e) {
    if (e.target.matches("[data-cr-popis]")) {
      st.popis = e.target.value;
      const n = body().querySelector("[data-cr-next]"); if (n) n.disabled = !st.popis.trim();
      return;
    }
    if (e.target.matches("[data-cr-url]")) { st.urls[Number(e.target.dataset.crUrl)] = e.target.value; return; }
    if (e.target.matches("[data-cr-file]")) {
      const f = e.target.files && e.target.files[0];
      if (f && st.images.length < 2) readImageScaled(f, (url) => { if (url) { st.images.push(url); render(); } });
      e.target.value = "";
      return;
    }
  }

  window.glitchOpenCreate = open;
  window.glitchCloseCreate = close;
})();
