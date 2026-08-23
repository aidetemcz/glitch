/* ==========================================================================
   Mapa konceptů — úložiště editoru (Supabase přes REST/RPC, bez knihovny).
   Model: YAML = základ, Supabase = živá překryvová vrstva.
     - km_concept_overrides : úpravy stávajících konceptů (jen změněná pole)
     - km_concepts_new      : nové koncepty
     - km_microkoncepty      : hloubková vrstva (mikrokoncepty)
   Čtení je veřejné (RLS select). Zápis jde jen přes RPC funkce gated heslem
   editoru (server ověří SHA-256) — proto se do RPC posílá plaintext hesla.
   ========================================================================== */
(function () {
  "use strict";

  // Stejný Supabase projekt jako Glitch (anon/publishable klíč je veřejný záměrně).
  var URL = "https://pfpqwxqayuvihnqnuyvv.supabase.co";
  var ANON = "sb_publishable_xUSlFUWpapqMCW--b6LDsQ_P0HCKsg6";

  var HEAD = { "apikey": ANON, "Authorization": "Bearer " + ANON };

  function getJson(path) {
    return fetch(URL + "/rest/v1/" + path, { headers: HEAD })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }

  // RPC (zápis). Vrací Promise; při chybě odmítne s hláškou z Postgresu.
  function rpc(fn, body) {
    return fetch(URL + "/rest/v1/rpc/" + fn, {
      method: "POST",
      headers: { "apikey": ANON, "Authorization": "Bearer " + ANON, "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      if (r.ok) return true;
      return r.json().catch(function () { return {}; }).then(function (d) {
        throw new Error((d && (d.message || d.error || d.hint)) || ("HTTP " + r.status));
      });
    });
  }

  // RPC, které vrací data (JSON) — pro přihlášení a seznam editorů.
  function rpcJson(fn, body) {
    return fetch(URL + "/rest/v1/rpc/" + fn, {
      method: "POST",
      headers: { "apikey": ANON, "Authorization": "Bearer " + ANON, "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (d) {
        if (!r.ok) throw new Error((d && (d.message || d.error || d.hint)) || ("HTTP " + r.status));
        return d;
      });
    });
  }

  // Načte celou překryvovou vrstvu naráz. Když je Supabase nedostupné,
  // vrátí prázdno + offline:true (mapa pak jede jen ze základního YAML).
  function loadOverlay() {
    return Promise.all([
      getJson("km_concept_overrides?select=concept_id,patch"),
      getJson("km_concepts_new?select=id,data"),
      getJson("km_microkoncepty?select=id,parent_id,data,ord&order=ord.asc")
    ]).then(function (res) {
      var overrides = {};
      (res[0] || []).forEach(function (r) { overrides[r.concept_id] = r.patch || {}; });
      var news = (res[1] || []).map(function (r) { return r.data || {}; });
      var micros = (res[2] || []).map(function (r) {
        var d = r.data || {}; d.id = r.id; d.parent_id = r.parent_id; d.ord = r.ord; return d;
      });
      return { overrides: overrides, news: news, micros: micros, offline: false };
    }).catch(function (e) {
      return { overrides: {}, news: [], micros: [], offline: true, error: (e && e.message) || String(e) };
    });
  }

  window.KM = {
    online: true,
    loadOverlay: loadOverlay,
    // přihlášení (e-mail nebo aidetem) → { ok, role, name, login }
    login: function (login, secret) { return rpcJson("km_login", { p_login: login, p_secret: secret }); },
    // správa editorů (jen admin)
    listEditors: function (login, secret) { return rpcJson("km_list_editors", { p_admin_login: login, p_admin_secret: secret }); },
    addEditor: function (login, secret, email, password, name, role) { return rpc("km_add_editor", { p_admin_login: login, p_admin_secret: secret, p_email: email, p_password: password, p_name: name || "", p_role: role || "editor" }); },
    removeEditor: function (login, secret, email) { return rpc("km_remove_editor", { p_admin_login: login, p_admin_secret: secret, p_email: email }); },
    // zápisy — posílají i p_login (kdo edituje)
    saveOverride: function (login, secret, id, patch) { return rpc("km_save_override", { p_login: login, p_secret: secret, p_id: id, p_patch: patch }); },
    deleteOverride: function (login, secret, id) { return rpc("km_delete_override", { p_login: login, p_secret: secret, p_id: id }); },
    addConcept: function (login, secret, id, data) { return rpc("km_add_concept", { p_login: login, p_secret: secret, p_id: id, p_data: data }); },
    deleteConcept: function (login, secret, id) { return rpc("km_delete_concept", { p_login: login, p_secret: secret, p_id: id }); },
    saveMicro: function (login, secret, id, parent, data, ord) { return rpc("km_save_micro", { p_login: login, p_secret: secret, p_id: id, p_parent: parent, p_data: data, p_ord: ord || 0 }); },
    deleteMicro: function (login, secret, id) { return rpc("km_delete_micro", { p_login: login, p_secret: secret, p_id: id }); }
  };
})();
