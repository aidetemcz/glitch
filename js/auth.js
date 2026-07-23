/* ==========================================================================
   Glitch — přihlášení (Supabase + Google)
   Lehká vrstva nad novým feedem. Využívá js/supabase.js (klient + auth).
   Stará komunita/profil z app.js se sem záměrně NEPŘENÁŠÍ — obsahovou
   důvěru řeší nový model (Core / Edited / Community / Generated).
   ========================================================================== */
(function () {
  "use strict";

  const escapeHtml = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const meta = (u) => (u && u.user_metadata) || {};
  const avatarUrl = (u) => meta(u).avatar_url || meta(u).picture || null;
  const displayName = (u) => meta(u).full_name || meta(u).name || (u && u.email) || "Přihlášen";
  const initials = (u) => {
    const n = (meta(u).full_name || meta(u).name || (u && u.email) || "?").trim();
    return (n[0] || "?").toUpperCase();
  };

  const personIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>';
  const googleIcon = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16 4 9.1 8.6 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34.9 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.1 39.3 16 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.4 36 44 30.5 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>';

  function mountButton() {
    const btn = document.getElementById("nav-profile");
    if (!btn) return;
    if (!btn.__wired) {
      btn.__wired = true;
      btn.addEventListener("click", () => (typeof sbCurrentUser !== "undefined" && sbCurrentUser ? openMenu() : openSheet()));
    }
    renderButton();
  }

  function renderButton() {
    const btn = document.getElementById("nav-profile");
    if (!btn) return;
    const u = (typeof sbCurrentUser !== "undefined") ? sbCurrentUser : null;
    // odhlášen → maskot (avatar-icon.png), přihlášen → Google avatar; vždy 2px bílá outline
    const src = (u && avatarUrl(u)) ? avatarUrl(u) : "assets/ui/avatar-icon.png";
    btn.innerHTML = '<span class="nav-ava"><img src="' + src + '" alt="" referrerpolicy="no-referrer"></span>';
    btn.setAttribute("aria-label", u ? "Účet" : "Přihlásit se");
  }

  function closeOverlay() { const o = document.getElementById("auth-overlay"); if (o) o.remove(); }

  function overlay(inner) {
    closeOverlay();
    const ov = document.createElement("div");
    ov.id = "auth-overlay"; ov.className = "auth-overlay";
    ov.innerHTML = '<div class="auth-modal" role="dialog" aria-modal="true">' +
      '<button class="auth-close" aria-label="Zavřít"><img src="assets/ui/Exit.svg" alt=""></button>' +
      inner + "</div>";
    document.body.appendChild(ov);
    ov.addEventListener("mousedown", (e) => { if (e.target === ov) closeOverlay(); });
    ov.querySelector(".auth-close").addEventListener("click", closeOverlay);
    return ov;
  }

  const modalAvatar = '<div class="auth-avatar"><img src="assets/ui/avatar-icon.png" alt=""></div>';

  function openSheet() {
    const ov = overlay(
      modalAvatar +
      '<h2 class="auth-title g-h4">Přihlášení do Glitch</h2>' +
      '<p class="auth-sub g-p">Pokud se přihlásíš, budeme moci ukládat tvůj pokrok.</p>' +
      '<button class="auth-cta" id="auth-google" type="button">Přihlásit se Google účtem</button>' +
      '<div class="auth-err" id="auth-err" role="alert"></div>'
    );
    ov.querySelector("#auth-google").addEventListener("click", async () => {
      const err = document.getElementById("auth-err");
      err.textContent = "";
      try { await sbSignInWithGoogle(); }
      catch (e) { err.textContent = (e && e.message) || "Přihlášení se nezdařilo."; }
    });
  }

  function openMenu() {
    const u = sbCurrentUser;
    const ov = overlay(
      modalAvatar +
      '<p class="auth-sub g-p">Přihlášen/a jako<br>' + escapeHtml(displayName(u)) + "</p>" +
      '<button class="auth-cta" id="auth-signout" type="button">Odhlásit se</button>'
    );
    ov.querySelector("#auth-signout").addEventListener("click", async () => {
      try { await sbSignOut(); } catch (_) {}
      closeOverlay(); renderButton();
    });
  }

  // zpřístupnit otevření přihlašovacího modálu i mimo tuto vrstvu (úvodní karta feedu)
  window.glitchOpenLogin = openSheet;

  async function boot() {
    // návrat z Google OAuth + obnova relace (obojí bezpečně degraduje, když Supabase není)
    try { if (typeof sbHandleOAuthCallback === "function") await sbHandleOAuthCallback(); } catch (_) {}
    try { if (typeof sbInit === "function") await sbInit(); } catch (_) {}
    mountButton();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
