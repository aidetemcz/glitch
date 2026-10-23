/* ==========================================================================
   Glitch — 1:1 zprávy mezi uživateli (realtime)
   window.glitchOpenDM({ id, name, handle, avatar }) otevře chat s uživatelem.
   Zprávy jdou do Supabase (messages) a živě se doručují přes realtime.
   ========================================================================== */
(function () {
  "use strict";

  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const SEND_ICO =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">' +
    '<path d="M4 11.7 20.5 3.8l-7.3 16.7-2.4-6.6L4 11.7Z" stroke="#1a1a1a" stroke-width="1.7" stroke-linejoin="round"/>' +
    '<path d="M10.8 13.9 20.5 3.8" stroke="#1a1a1a" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  const DEF_AVA = "assets/ui/avatar-icon.png";

  let other = null, unsub = null;

  function open(user) {
    if (!user || !user.id) return;
    close();
    other = user;
    const ov = document.createElement("div");
    ov.className = "dm-overlay"; ov.id = "glitch-dm";
    ov.innerHTML =
      '<div class="dm-panel">' +
        '<header class="pf-people-bar dm-bar">' +
          '<button class="pf-people-back" data-dm-close aria-label="Zpět"><img src="assets/ui/more-button.svg" alt=""></button>' +
          '<span class="dm-ava"><img src="' + esc(user.avatar || DEF_AVA) + '" alt="" referrerpolicy="no-referrer"></span>' +
          '<span class="dm-who"><span class="dm-name">' + esc(user.name || "Uživatel") + '</span>' +
            '<span class="dm-handle">' + esc(user.handle || "") + '</span></span>' +
        '</header>' +
        '<div class="rz-thread dm-thread" data-dm-thread><div class="pf-empty">Načítám…</div></div>' +
        '<form class="rz-input dm-input" data-dm-form>' +
          '<input class="rz-input-field" type="text" placeholder="Napiš zprávu…" aria-label="Napiš zprávu" autocomplete="off">' +
          '<button class="rz-send" type="submit" aria-label="Odeslat">' + SEND_ICO + '</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(ov);
    document.body.classList.add("rz-lock");

    ov.addEventListener("click", (e) => { if (e.target.closest("[data-dm-close]")) close(); });
    const form = ov.querySelector("[data-dm-form]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.querySelector(".rz-input-field");
      const txt = (f.value || "").trim(); if (!txt) return;
      f.value = ""; sendMsg(txt);
    });

    load();
    if (typeof sbSubscribeMessages === "function") {
      unsub = sbSubscribeMessages(user.id, (m) => { appendMsg(m); });
    }
  }

  function close() {
    if (typeof unsub === "function") { try { unsub(); } catch (_) {} unsub = null; }
    const e = document.getElementById("glitch-dm");
    if (e) { e.remove(); document.body.classList.remove("rz-lock"); }
    other = null;
  }

  const threadEl = () => { const o = document.getElementById("glitch-dm"); return o && o.querySelector("[data-dm-thread]"); };
  function scrollDown() { const t = threadEl(); if (t) t.scrollTop = t.scrollHeight; }

  function me() { return (typeof sbCurrentUser !== "undefined" && sbCurrentUser) ? sbCurrentUser.id : null; }

  function appendMsg(m) {
    const t = threadEl(); if (!t || !m) return;
    if (t.querySelector(".pf-empty")) t.innerHTML = "";
    const mine = m.sender_id === me();
    const el = document.createElement("div");
    if (mine) { el.className = "rz-msg rz-msg--user"; el.innerHTML = '<div class="rz-bubble"></div><span class="rz-ava rz-ava--user"></span>'; }
    else { el.className = "rz-msg rz-msg--bot"; el.innerHTML = '<span class="rz-ava rz-ava--bot"><img src="' + esc((other && other.avatar) || DEF_AVA) + '" alt=""></span><div class="rz-bubble"></div>'; }
    el.querySelector(".rz-bubble").textContent = m.body;
    t.appendChild(el); scrollDown();
  }

  function load() {
    const t = threadEl(); if (!t) return;
    if (typeof sbListMessages !== "function") { t.innerHTML = '<div class="pf-empty">Zprávy nejsou dostupné.</div>'; return; }
    sbListMessages(other.id).then((rows) => {
      const cur = threadEl(); if (!cur) return;
      if (!rows || !rows.length) { cur.innerHTML = '<div class="pf-empty">Zatím žádné zprávy. Napiš první!</div>'; return; }
      cur.innerHTML = "";
      rows.forEach(appendMsg);
    }).catch(() => { const cur = threadEl(); if (cur) cur.innerHTML = '<div class="pf-empty">Zprávy se nepodařilo načíst.</div>'; });
  }

  function sendMsg(txt) {
    // optimistické zobrazení
    appendMsg({ sender_id: me(), recipient_id: other.id, body: txt });
    if (typeof sbSendMessage === "function") sbSendMessage(other.id, txt);
  }

  window.glitchOpenDM = open;
  window.glitchCloseDM = close;
})();
