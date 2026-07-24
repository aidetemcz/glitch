/* ==========================================================================
   Glitch — Feed engine
   Vertikální swipe feed celoobrazovkových Glitch karet.
   Datový model viz glitches/glith-content-type.md
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Pixel ikony ---------- */
  const ICON = {
    // Malá pixelová dekorace „+"
    plus:
      '<svg viewBox="0 0 12 12" aria-hidden="true"><g fill="#000">' +
      '<rect x="4" y="0" width="4" height="12"/><rect x="0" y="4" width="12" height="4"/></g></svg>',
    // Pixelová „glitch" jiskra
    spark:
      '<svg viewBox="0 0 12 12" aria-hidden="true"><g fill="#000">' +
      '<rect x="0" y="0" width="4" height="4"/><rect x="8" y="0" width="4" height="4"/>' +
      '<rect x="4" y="4" width="4" height="4"/>' +
      '<rect x="0" y="8" width="4" height="4"/><rect x="8" y="8" width="4" height="4"/></g></svg>'
  };

  const LOGO = "assets/glitch-logo.svg";

  /* ==========================================================================
     Data karet — FALLBACK. Zdroj pravdy je glitches/feed.json (načítá se za běhu);
     tenhle vestavěný katalog se použije jen když se fetch nezdaří. Držet v souladu.
     ========================================================================== */
  const CARDS = [
    { type: "welcome" },

    { type: "intro" },

    { type: "mood_selector", category: "Wellbeing",
      title: "Jak se teď cítíš?",
      body: "Potažením zvol svůj vibe. My podle toho upravíme Glitche, které se ti dnes zobrazí." },

    { type: "breathing", category: "Wellbeing",
      title: "Dechové cvičení",
      body: "Rovnoměrné vědomé dýchání ti může pomoci zlepšit soustředění.",
      cycles: 7 },

    { type: "quest_intro", category: "Vibe Coding", chapterNo: 1,
      title: "Vibe Coding",
      body: "Vibe Coding je programování v přirozeném jazyce. Zjisti, jak vznikl a jak to celé funguje.",
      video: "assets/videos/vibe-coding_01.mp4" },

    { type: "quick_challenge", category: "Rychlá výzva", trust: "Generováno",
      question: "310×15=",
      sub: "Zvládneš to spočítat?",
      cols: 2,
      answers: [
        { label: "4 650", correct: true },
        { label: "4 350", correct: false },
        { label: "4 750", correct: false },
        { label: "3 950", correct: false }
      ] },

    { type: "quick_challenge", category: "Rychlá výzva",
      figure: "triangles",
      question: "Kolik trojúhelníků je celkem v obrazci?",
      questionStyle: "h3",
      cols: 3,
      answers: [
        { label: "9", correct: false },
        { label: "10", correct: false },
        { label: "11", correct: true }
      ] },

    { type: "attention_game", category: "Aktivita",
      title: "Kolik zvládneš označit děr?",
      viz: "assets/3Dvizualizations/sphere-holes.html?v=5" },

    { type: "algorithm_demo", category: "Algoritmus", chapterNo: 5,
      title: "Hra života",
      body: "Hra života je ukázka algoritmu s pár jednoduchými pravidly. Ta určují, které buňky přežijí, které zaniknou a kde vznikne nová. Dokážeš pravidla popsat?",
      viz: "assets/3Dvizualizations/game-of-life.html?v=3" },

    { type: "fun_fact", category: "Fun fact",
      title: "První počítačový bug byla můra.",
      body: "Slovem bug označovali technici drobné závady už za Edisona. Ale když v roce 1947 kvůli můře, která vlétla dovnitř, přestal fungovat počítač Harvard Mark II, termín se ujal i u počítačů. Chybám dodnes říkáme bugy a jejich opravování debugging (doslova odhmyzení)." },

    { type: "spot_the_mistake", category: "Najdi chybu",
      claim: "Šokující! Autorem první neuronové sítě byl český zpěvák Karel Gott!",
      context: "Síť se jmenovala Perceptron. Měla jediný neuron a sloužila k rozpoznávání jednoduchých obrazců." },

    { type: "argument", category: "Argumentuj", trust: "Core",
      claim: "Nemám co skrývat, tak je mi jedno, kolik dat o mně aplikace sbírají.",
      sub: "Vyber, jak to vnímáš a dokaž Tinybotovi, že máš pravdu." },

    { type: "daily_summary", category: "Shrnutí",
      stats: [
        { label: "Vyřešených Glitchů", value: 2 },
        { label: "Splněných Questů", value: 0 },
        { label: "Zvládnutých výzev", value: 3 }
      ] }
  ];

  /* ==========================================================================
     Renderery
     ========================================================================== */
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // zobrazované štítky důvěry: Core→Glitch, Community→Komunita, Generated→Generováno
  const TRUST_LABEL = { core: "Glitch", community: "Komunita", "komunita": "Komunita",
    generated: "Generováno", "generováno": "Generováno", generovany: "Generováno",
    edited: "Fork", fork: "Fork" };
  const trustLabel = (t) => TRUST_LABEL[String(t == null ? "core" : t).toLowerCase()] || String(t || "Glitch");
  // Štítky zleva: téma (topic) · typ Glitche (category) · autor (trust).
  // Basic Glitch (quest) nemá typ; historická osobnost nemá téma → render dle toho, co je.
  // Shrnutí (a jiné systémové karty) nemají štítek autora — jen typ.
  const NO_CREATOR = new Set(["daily_summary"]);
  const badges = (c) => {
    const parts = [];
    if (c.topic) parts.push(`<span class="badge topic">${esc(c.topic)}</span>`);
    if (c.category) parts.push(`<span class="badge type">${esc(c.category)}</span>`);
    if (!NO_CREATOR.has(c.type)) parts.push(`<span class="badge creator">${esc(trustLabel(c.trust))}</span>`);
    return `<div class="badges">${parts.join("")}</div>`;
  };
  // Žlutá šipka vpravo dole: rozklikne detail (má-li ho karta), jinak posune na další Glitch.
  const chevron = (c) => {
    const act = c && c.rozklik ? "rozklik" : "next";
    const lbl = act === "rozklik" ? "Rozkliknout Glitch" : "Další Glitch";
    return `<button class="nav-chevron" data-nav="${act}" aria-label="${lbl}"><img src="assets/ui/more-button.svg" alt="" width="40" height="62"></button>`;
  };
  const chapter = (n) => n != null ? `<span class="chapter-no">${esc(n)}</span>` : "";
  const deco = (cls, style) => `<span class="pixel-deco ${cls}" style="${style}">${ICON.plus}</span>`;

  const RENDER = {

    welcome(c) {
      return `
        <img class="welcome-tiny" src="assets/ui/tiny-logo-pixelized.svg" alt="Tiny">
        <span class="pixel-deco" style="top:12%;right:16%;width:16px;height:16px">${ICON.spark}</span>
        ${deco("", "top:30%;left:14%;width:13px;height:13px")}
        ${deco("", "top:52%;left:72%;width:11px;height:11px")}
        <span class="pixel-deco" style="top:72%;left:18%;width:15px;height:15px">${ICON.spark}</span>
        <img class="welcome-logo" src="${LOGO}" alt="Glitch">
        <div class="card-footer">
          <button class="welcome-login" data-welcome-login>Přihlášení Google účtem</button>
        </div>`;
    },

    intro(c) {
      return `
        <span class="pixel-deco" style="top:12%;right:16%;width:15px;height:15px">${ICON.spark}</span>
        ${deco("", "top:52%;left:22%;width:13px;height:13px")}
        ${deco("", "top:59%;left:55%;width:13px;height:13px")}
        <img class="intro-logo" src="${LOGO}" alt="Glitch">
        <div class="fx-block reserve-chevron" style="top:71.6%">
          <h1 class="fx-title g-h1">Vítej v Glitchi!</h1>
          <p class="fx-text g-p">Chceš vědět, jak to tady chodí? Klikni na šipku vpravo dole nebo swipni dolů pro další Glitch.</p>
        </div>
        ${chevron(c)}`;
    },

    mood_selector(c) {
      return `${badges(c)}
        <h1 class="fx-block g-h1 text-center" style="top:14.4%">${esc(c.title)}</h1>
        <p class="fx-block g-p text-center" style="top:21.5%">${esc(c.body)}</p>
        <div class="mood-wrap">${moodDiagram()}</div>
        <div class="card-footer">
          <button class="mood-cta g-h4" data-mood-confirm>Potvrdit</button>
        </div>`;
    },

    breathing(c) {
      return `${badges(c)}
        <h1 class="fx-block g-h1 text-center" style="top:16.3%">${esc(c.title)}</h1>
        <p class="fx-block g-p text-center" style="top:23.3%">${esc(c.body)}</p>
        <div class="breath-controls">
          <div class="breath-counter">
            <button class="breath-step" data-breath="dec" aria-label="Méně">−</button>
            <div class="breath-value" data-breath="value">0/${c.cycles}</div>
            <button class="breath-step" data-breath="inc" aria-label="Více">+</button>
          </div>
          <div class="breath-ring"><div class="breath-circle" data-breath="circle">${c.cycles}</div></div>
        </div>
        <div class="card-footer">
          <p class="breath-hint g-p-s" data-breath="hint">Pohodlně se usaď a stiskni tlačítko začít.</p>
          <button class="breath-cta" data-breath="start">Začít</button>
        </div>`;
    },

    quest_intro(c) {
      // Video se NEnačítá dopředu (preload=none, src až přes IntersectionObserver),
      // ať slabý internet netáhne všech 6 videí naráz — jen to zrovna viditelné.
      // Náhledový obrázek (poster) je malý (~30 kB) a naskočí dřív než video →
      // i na extra pomalém internetu je hned vidět náhled místo černé plochy.
      const poster = c.video ? c.video.replace(/\/([^/]+)\.mp4(\?.*)?$/, "/posters/$1.jpg") : "";
      const bg = c.video
        ? `<video class="quest-video" muted loop playsinline preload="none" data-poster="${poster}" data-video-src="${c.video}"></video><div class="quest-scrim"></div>`
        : `<div class="quest-bg"></div>`;
      return `${bg}${badges(c)}
        <div class="fx-block quest-text reserve-chevron anchor-bottom">
          ${chapter(c.chapterNo)}
          <h1 class="fx-title g-h1">${esc(c.title)}</h1>
          <p class="fx-text g-p">${esc(c.body)}</p>
        </div>
        ${chevron(c)}`;
    },

    quick_challenge(c) {
      // Jednotné rozvržení pro všechny výzvy: nadpis (otázka) nahoře, úkol
      // (kód / obrazec) vystředěný v prázdném prostoru, odpovědi dole.
      const textLayout = c.layout === "text";
      const optCls = textLayout ? "quiz-opt quiz-opt--text g-p" : "quiz-opt g-h4";
      const opts = c.answers.map((a, i) =>
        `<button class="${optCls}" data-quiz="${i}" data-correct="${!!a.correct}">${esc(a.label)}</button>`).join("");
      const cols = textLayout ? "cols-1v" : (c.figure === "triangles" ? "cols-3" : ("cols-" + (c.cols || 2)));
      let task = "";
      if (c.figure === "triangles") task = `<div class="quiz-figure-wrap">${triangleFigure()}</div>`;
      else if (c.code) task = `<pre class="quiz-code">${esc(c.code)}</pre>`;
      return `${badges(c)}
        <div class="quiz-frame">
          <div class="quiz-head">
            <div class="g-h3">${esc(c.question)}</div>
            ${c.sub ? `<p class="quiz-sub g-p-s">${esc(c.sub)}</p>` : ""}
          </div>
          <div class="quiz-task">${task}</div>
          <div class="quiz-answers"><div class="quiz-options ${cols}">${opts}</div></div>
        </div>`;
    },

    attention_game(c) {
      // data-driven: víc aktivit sdílí stejnou strukturu (nadpis, návod, počítadlo, koule)
      const help = c.help || "Tažením otáčíš kouli. Díry označíš ťuknutím. Ale pozor: označit lze jen díry, které jsou vpředu.";
      const countLabel = c.countLabel || "Označených děr";
      const countInit = c.countInit || "0/0";
      return `${badges(c)}
        <h3 class="fx-block g-h3" style="top:13%">${esc(c.title)}</h3>
        <p class="fx-block g-p atten-help" style="top:23%">${esc(help)}</p>
        <p class="fx-block g-p atten-count" style="top:41%">${esc(countLabel)}: <span data-atten-count>${esc(countInit)}</span></p>
        <div class="atten-viz"><iframe class="viz-frame atten-frame" data-viz-src="${c.viz}" title="${esc(c.title)}"></iframe></div>`;
    },

    algorithm_demo(c) {
      return `${badges(c)}
        <div class="stack">
          <div class="stack-media"><div class="algo-viz">${vizFrame(c.viz)}</div></div>
          <div class="stack-text">
            ${chapter(c.chapterNo)}
            <h1 class="fx-title g-h1">${esc(c.title)}</h1>
            <p class="fx-text g-p">${esc(c.body)}</p>
          </div>
        </div>
        ${chevron(c)}`;
    },

    fun_fact(c) {
      return `${badges(c)}
        <div class="stack">
          <div class="stack-media"><div class="funfact-tile"><div class="asset-missing">ilustrace<br>(doplnit)</div></div></div>
          <div class="stack-text">
            <h3 class="fx-title g-h3">${esc(c.title)}</h3>
            <p class="fx-text g-p-s">${esc(c.body)}</p>
          </div>
        </div>
        ${chevron(c)}`;
    },

    spot_the_mistake(c) {
      return `${badges(c)}
        <div class="stack">
          <div class="stack-media"><div class="mistake-photo"><div class="asset-missing">fotografie<br>(doplnit)</div></div></div>
          <div class="stack-text">
            <h3 class="fx-title mistake-claim g-h3">${esc(c.claim)}</h3>
            <p class="fx-text mistake-context g-p-s">${esc(c.context)}</p>
          </div>
        </div>
        ${chevron(c)}`;
    },

    historicka_osobnost(c) {
      return `${badges(c)}
        <div class="stack">
          <div class="stack-media"><div class="persona-photo"><div class="asset-missing">fotografie<br>(doplnit)</div></div></div>
          <div class="stack-text">
            <h3 class="fx-title g-h3">${esc(c.title)}</h3>
            <p class="fx-text g-p-s">${esc(c.body)}</p>
          </div>
        </div>
        ${chevron(c)}`;
    },

    argument(c) {
      return `${badges(c)}
        <div class="arg-flow">
          <h2 class="arg-claim">${esc(c.claim)}</h2>
          <p class="arg-sub">${esc(c.sub)}</p>
        </div>
        <div class="arg-actions">
          <button class="arg-opt" data-arg="agree">Souhlasím</button>
          <button class="arg-opt" data-arg="disagree">Nesouhlasím</button>
        </div>`;
    },

    daily_summary(c) {
      const rows = c.stats.map((s) =>
        `<div class="summary-row"><span>${esc(s.label)}</span><span class="summary-row-val">${esc(s.value)}</span></div>`).join("");
      return `${badges(c)}
        <span class="pixel-deco" style="top:8%;left:26%;width:15px;height:15px">${ICON.spark}</span>
        ${deco("", "top:27%;left:14%;width:13px;height:13px")}
        ${deco("", "top:32%;left:64%;width:13px;height:13px")}
        <div class="summary-mascot-wrap">
          <div style="width:150px;height:106px;overflow:hidden">
            <img src="${LOGO}" alt="" style="width:150px;height:auto">
          </div>
        </div>
        <h3 class="fx-block g-h3" style="top:44.4%">Tvé shrnutí pro dnešek</h3>
        <div class="summary-stats fx-block" style="top:50.7%">${rows}</div>
        <button class="summary-link fx-block" style="top:66.5%">Zobrazit dlouhodobé statistiky</button>
        <p class="summary-outro fx-block g-p reserve-chevron" style="top:76.3%">Každý den ti zobrazíme maximálně 20 Glitchů. Sociální sítě by neměly brát příliš tvé pozornosti.<br><br>Těšíme se na tebe třeba zítra!</p>
        ${chevron(c)}`;
    }
  };

  /* ---------- Dílčí komponenty ---------- */
  function vizFrame(src) {
    // src se nastaví až přes IntersectionObserver (viz initVizFrame) — spolehlivější
    // než prohlížečové loading=lazy uvnitř posuvného feedu (na mobilech vynechává).
    return `<iframe class="viz-frame" data-viz-src="${src}" title="Vizualizace"
              style="width:100%;height:100%;aspect-ratio:1/1"></iframe>`;
  }

  function triangleFigure() {
    return `<div class="quiz-figure"><svg width="150" height="150" viewBox="0 0 150 150" fill="none">
      <g stroke="#fff" stroke-width="1.4">
        <rect x="2" y="2" width="146" height="146"/>
        <line x1="2" y1="2" x2="148" y2="148"/>
        <line x1="148" y1="2" x2="2" y2="148"/>
        <line x1="2" y1="90" x2="100" y2="148"/>
      </g></svg></div>`;
  }

  function moodDiagram() {
    // osa X = SOUSTŘEDĚNÍ (0–100), osa Y = ENERGIE (0–100)
    return `<svg class="mood-diagram" viewBox="0 0 340 360" data-mood preserveAspectRatio="xMidYMid meet">
      <defs><marker id="ah" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#000"/></marker></defs>
      <line x1="44" y1="300" x2="44" y2="34"  stroke="#000" stroke-width="1.5" marker-end="url(#ah)"/>
      <line x1="44" y1="300" x2="318" y2="300" stroke="#000" stroke-width="1.5" marker-end="url(#ah)"/>
      <text class="mood-axis-label" x="14" y="42">100</text>
      <text class="mood-axis-label" x="20" y="322">O</text>
      <text class="mood-axis-label" x="286" y="322">100</text>
      <text class="mood-axis-label" x="132" y="338">SOUSTŘEDĚNÍ</text>
      <text class="mood-axis-label" x="30" y="180" transform="rotate(-90 30 180)">ENERGIE</text>
      <circle class="mood-dot" data-mood-dot cx="185" cy="165" r="22" fill="#000"/>
    </svg>`;
  }

  /* ==========================================================================
     Sestavení feedu
     ========================================================================== */
  const feed = document.getElementById("glitch-feed");

  const BG = {
    welcome: "yellow", intro: "white", argument: "pink", mood_selector: "white", daily_summary: "white",
    breathing: "black", attention_game: "black", algorithm_demo: "black",
    quick_challenge: "red", spot_the_mistake: "purple", fun_fact: "teal",
    historicka_osobnost: "blue", quest_intro: "image"
  };

  let welcomeCard = null;
  function applyWelcomeVisibility(loggedIn) {
    if (!welcomeCard) return;
    welcomeCard.classList.toggle("is-hidden", !!loggedIn);
  }

  // Sestavení karet z katalogu, seřazené doporučovačem (js/recommender.js)
  let _cardData = [];
  function buildCards(catalog) {
    const ordered = (typeof window.serazFeed === "function") ? window.serazFeed(catalog) : catalog;
    _cardData = ordered;
    feed.innerHTML = "";
    ordered.forEach((c, i) => {
      const el = document.createElement("section");
      el.className = "card card--" + (BG[c.type] || "dark");
      el.dataset.index = i;
      el.dataset.type = c.type;
      el.innerHTML = (RENDER[c.type] || (() => `<div class="card-body">${esc(c.type)}</div>`))(c);
      // gating karet dle nastavení: mood check-in vypnutý → mood karta se nezobrazí
      if (c.type === "mood_selector") {
        try { if (window.glitchSettings && window.glitchSettings().mood_checkin === false) el.classList.add("is-hidden"); } catch (_) {}
      }
      feed.appendChild(el);
      initCard(el, c);
    });
    // úvodní přihlašovací karta se přihlášenému uživateli skryje
    welcomeCard = feed.querySelector('[data-type="welcome"]');
    if (typeof sbCurrentUser !== "undefined" && sbCurrentUser) applyWelcomeVisibility(true);
  }

  // reakce na přihlášení (welcomeCard se doplní po sestavení)
  if (typeof sb !== "undefined" && sb && sb.auth && typeof sb.auth.onAuthStateChange === "function") {
    sb.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!(session && session.user);
      // scroll na začátek jen když PRÁVĚ skrýváme úvodní kartu (skutečné přihlášení),
      // ne při každém obnovení tokenu / návratu do okna → jinak by to skákalo na první Glitch
      const welcomeWasVisible = welcomeCard && !welcomeCard.classList.contains("is-hidden");
      applyWelcomeVisibility(loggedIn);
      if (loggedIn && welcomeWasVisible) { try { feed.scrollTo({ top: 0 }); } catch (_) {} }
    });
  }

  // Data-driven: katalog z glitches/feed.json (zdroj pravdy). Fallback = vestavěný CARDS.
  (async function loadAndBuild() {
    let catalog = CARDS;
    try {
      const res = await fetch("glitches/feed.json?v=15", { cache: "no-cache" });
      if (res.ok) catalog = await res.json();
    } catch (_) {}
    buildCards(catalog);
  })();

  /* ==========================================================================
     Navigace (chevron / maskot → další karta)
     ========================================================================== */
  function scrollToIndex(i) {
    const target = feed.children[i];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function nextFrom(el) {
    const i = Number(el.dataset.index);
    scrollToIndex(Math.min(i + 1, feed.children.length - 1));
  }

  feed.addEventListener("click", (e) => {
    const rz = e.target.closest("[data-nav='rozklik']");
    if (rz) { const card = rz.closest(".card"); openRozklik(_cardData[card.dataset.index]); return; }
    const nav = e.target.closest("[data-nav='next']");
    if (nav) { nextFrom(nav.closest(".card")); }
  });

  // Klávesnice (dev / desktop)
  window.addEventListener("keydown", (e) => {
    const cur = currentIndex();
    if (e.key === "ArrowDown") { e.preventDefault(); scrollToIndex(cur + 1); }
    if (e.key === "ArrowUp")   { e.preventDefault(); scrollToIndex(cur - 1); }
  });
  function currentIndex() {
    // karty mají pevnou výšku (ne výšku obrazovky) → najdi tu nejblíž hornímu okraji
    const top = feed.scrollTop;
    let best = 0, bestD = Infinity;
    for (let i = 0; i < feed.children.length; i++) {
      const d = Math.abs(feed.children[i].offsetTop - top);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  /* ---- Spodní menu ---- */
  const navEl = document.getElementById("glitch-nav");
  if (navEl) {
    navEl.addEventListener("click", (e) => {
      const item = e.target.closest(".nav-item");
      if (!item) return;
      const tab = item.dataset.tab;
      if (tab === "profile") return;                 // přihlášení řeší auth.js
      if (tab === "feed") { scrollToIndex(0); setActiveTab(item); return; }
      toast("Připravujeme 🚧");                        // boardy / tvořit / hledat zatím nejsou
    });
  }
  function setActiveTab(item) {
    document.querySelectorAll("#glitch-nav .nav-item").forEach((n) => n.classList.toggle("is-active", n === item));
  }
  let _toastTimer = null;
  function toast(msg) {
    let el = document.getElementById("glitch-toast");
    if (!el) { el = document.createElement("div"); el.id = "glitch-toast"; el.className = "glitch-toast"; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("show");
    clearTimeout(_toastTimer); _toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
  }

  /* ==========================================================================
     Interakce jednotlivých karet
     ========================================================================== */
  function initCard(el, c) {
    if (c.type === "breathing") initBreathing(el, c);
    if (c.type === "mood_selector") initMood(el);
    if (c.type === "quick_challenge") initQuiz(el);
    if (c.type === "argument") initArgument(el);
    if (c.type === "historicka_osobnost") initPersona(el);
    if (c.type === "attention_game") initAttention(el, c);
    if (c.type === "algorithm_demo") initVizFrame(el);
    if (c.type === "quest_intro") initQuestVideo(el);
    // úvodní splash: ťuknutí kamkoli posune na další Glitch (swipe funguje taky)
    if (c.type === "welcome") {
      el.addEventListener("click", () => nextFrom(el));
      const lg = el.querySelector("[data-welcome-login]");
      if (lg) lg.addEventListener("click", (e) => {
        e.stopPropagation();                     // klik na tlačítko neposune na další Glitch
        if (typeof window.glitchOpenLogin === "function") { window.glitchOpenLogin(); return; }
        // fallback: kdyby modál nebyl k dispozici, spusť přihlášení přímo
        if (typeof sbSignInWithGoogle === "function") sbSignInWithGoogle().catch(() => toast("Přihlášení se nezdařilo."));
      });
    }
  }

  /* ---- Spolehlivé načítání animací (iframe vizualizace) ----
     Řízeno vlastním IntersectionObserverem (root = feed) místo prohlížečového
     loading=lazy, které uvnitř posuvného feedu na mobilech vynechává. src se
     nastaví, jakmile se karta blíží; jednou načtené se nechává (bez blikání). */
  let _vizObserver = null;
  function lazyLoadIframe(f) {
    if (!f || !f.dataset.vizSrc) return;
    if (!("IntersectionObserver" in window)) { if (!f.getAttribute("src")) f.src = f.dataset.vizSrc; return; }
    if (!_vizObserver) {
      _vizObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { const fr = e.target; if (!fr.getAttribute("src")) fr.src = fr.dataset.vizSrc; }
        });
      }, { root: feed, rootMargin: "400px 0px", threshold: 0.01 });
    }
    _vizObserver.observe(f);
  }
  function initVizFrame(el) {
    lazyLoadIframe(el.querySelector(".viz-frame[data-viz-src]"));
  }

  /* ---- Líné načítání videí u Quest karet ----
     Video se stáhne a přehraje teprve, když je karta na řadě (viditelná). Šetří
     data na slabém internetu (školy) — nestahuje se všech 6 videí naráz. */
  let _videoObserver = null;
  function loadQuestMedia(v) {
    // poster jako první (malý, naskočí hned), pak teprve zdroj videa
    if (v.dataset.poster && !v.getAttribute("poster")) v.setAttribute("poster", v.dataset.poster);
    if (!v.src) v.src = v.dataset.videoSrc;
  }
  function initQuestVideo(el) {
    const v = el.querySelector(".quest-video");
    if (!v || !v.dataset.videoSrc) return;
    // bez IntersectionObserver (starý prohlížeč) → načti hned
    if (!("IntersectionObserver" in window)) { loadQuestMedia(v); v.play().catch(() => {}); return; }
    if (!_videoObserver) {
      _videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const vid = e.target;
          if (e.isIntersecting) { loadQuestMedia(vid); vid.play().catch(() => {}); }
          else vid.pause();
        });
      }, { root: feed, rootMargin: "150px 0px", threshold: 0.35 });
    }
    _videoObserver.observe(v);
  }

  /* ---- Aktivita (koule + počítadlo skóre z iframu) ----
     Podporuje víc her přes jmenný prostor zprávy (c.ns): "attention" (koule s
     dírami, počítá zásahy) i "wordsphere" (hledání slov, počítá potvrzená).
     Bez časovače — hraje se volně. */
  function initAttention(el, c) {
    const NS = (c && c.ns) || "attention";
    const countEl = el.querySelector("[data-atten-count]");
    const iframe = el.querySelector(".atten-frame");

    lazyLoadIframe(iframe);            // spolehlivé načtení koule (jako u ostatních animací)

    const post = (type) => {
      try { iframe && iframe.contentWindow && iframe.contentWindow.postMessage({ ns: NS, type }, "*"); } catch (_) {}
    };

    // po načtení iframu si vyžádáme aktuální skóre (u koule s dírami celkový počet)
    if (iframe) iframe.addEventListener("load", () => post("sync"));

    // příjem skóre z koule (hit = zásahy, found = potvrzená slova)
    window.addEventListener("message", (ev) => {
      if (iframe && ev.source !== iframe.contentWindow) return;
      const d = ev.data || {};
      if (d.ns !== NS || d.type !== "score") return;
      const n = (d.hit != null) ? d.hit : d.found;
      if (countEl) countEl.textContent = n + "/" + d.total;
    });
  }

  /* ---- Dechové cvičení (stavový automat: běh / pauza) ---- */
  function initBreathing(el, c) {
    const PHASE = 4000;                       // 4 s nádech, 4 s výdech (bez zádrže)
    let target = c.cycles;
    const valueEl  = el.querySelector("[data-breath='value']");
    const circleEl = el.querySelector("[data-breath='circle']");
    const hintEl   = el.querySelector("[data-breath='hint']");
    const btnEl    = el.querySelector("[data-breath='start']");
    const IDLE_HINT = hintEl ? hintEl.textContent : "";

    let state = "idle";                       // idle | running | paused | done
    let cycle = 0, phase = "in", phaseStart = 0, elapsedAtPause = 0, rafId = null;

    const easeInOut = (p) => 0.5 * (1 - Math.cos(Math.PI * p));
    const setCounter = () => { valueEl.textContent = (state === "idle" ? 0 : Math.min(cycle, target)) + "/" + target; };

    // odpočet + nafouknutí uvnitř kolečka, průvodní text (Nádech/Výdech) v patičce
    const render = (elapsed) => {
      const p = Math.min(elapsed / PHASE, 1);
      const e = easeInOut(p);
      const scale = phase === "in" ? (0.8 + 0.5 * e) : (1.3 - 0.5 * e);
      circleEl.style.transform = "scale(" + scale.toFixed(3) + ")";
      circleEl.textContent = Math.max(1, Math.ceil((PHASE - elapsed) / 1000));
      if (hintEl) hintEl.textContent = phase === "in" ? "Nádech" : "Výdech";
    };
    const startPhase = (ph) => { phase = ph; phaseStart = performance.now(); };

    const loop = (now) => {
      if (state !== "running") return;
      let elapsed = now - phaseStart;
      if (elapsed >= PHASE) {
        if (phase === "in") { startPhase("out"); elapsed = 0; }
        else {
          if (cycle >= target) { finish(); return; }
          cycle++; setCounter(); startPhase("in"); elapsed = 0;
        }
      }
      render(elapsed);
      rafId = requestAnimationFrame(loop);
    };

    function begin() {
      state = "running"; cycle = 1; setCounter();
      startPhase("in"); btnEl.textContent = "Pozastavit";
      rafId = requestAnimationFrame(loop);
    }
    function pause() {
      state = "paused";
      if (rafId) cancelAnimationFrame(rafId); rafId = null;
      elapsedAtPause = performance.now() - phaseStart;   // zamrzni fázi
      btnEl.textContent = "Pokračovat";
    }
    function resume() {
      state = "running";
      phaseStart = performance.now() - elapsedAtPause;    // pokračuj od zamrzlého času
      btnEl.textContent = "Pozastavit";
      rafId = requestAnimationFrame(loop);
    }
    function finish() {
      state = "done";
      if (rafId) cancelAnimationFrame(rafId); rafId = null;
      circleEl.style.transform = "scale(1)";
      circleEl.textContent = "";
      if (hintEl) hintEl.textContent = "Hotovo, skvělá práce!";
      btnEl.textContent = "Začít";
    }
    function toIdle() {
      state = "idle"; cycle = 0;
      circleEl.style.transform = ""; circleEl.textContent = target;
      if (hintEl) hintEl.textContent = IDLE_HINT;
      btnEl.textContent = "Začít"; setCounter();
    }

    el.querySelector("[data-breath='dec']").addEventListener("click", () => {
      if ((state === "idle" || state === "done") && target > 1) { target--; toIdle(); }
    });
    el.querySelector("[data-breath='inc']").addEventListener("click", () => {
      if ((state === "idle" || state === "done") && target < 12) { target++; toIdle(); }
    });
    btnEl.addEventListener("click", () => {
      if (state === "running") pause();
      else if (state === "paused") resume();
      else { if (state === "done") toIdle(); begin(); }
    });
  }

  /* ---- Mood selector (tažení tečky — comet tail s RGB rozkladem) ---- */
  function initMood(el) {
    const SVGNS = "http://www.w3.org/2000/svg";
    const svg = el.querySelector("[data-mood]");
    const dot = el.querySelector("[data-mood-dot]");
    const BOUND = { x0: 44, x1: 318, y0: 300, y1: 34 };
    const N = 9, R = 22, CHAIN = 0.42;      // délka a těsnost ohonu
    let dragging = false;
    let cx = 185, cy = 165, tx = 185, ty = 165;   // puntík: aktuální vs. cílová pozice

    // ohon = řetěz uzlů; každý má azurovou + purpurovou kopii, k dálce se rozkládají a mizí
    const nodes = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);                 // 0 = u puntíku, 1 = konec ohonu
      const mk = (color) => {
        const c = document.createElementNS(SVGNS, "circle");
        c.setAttribute("class", "mood-ghost");
        c.setAttribute("r", (R * (1 - 0.45 * t)).toFixed(1));
        c.setAttribute("fill", color);
        c.setAttribute("cx", 185); c.setAttribute("cy", 165);
        c.style.mixBlendMode = "multiply";
        return c;
      };
      const cyan = mk("#21E0F0"), mag = mk("#FF2E9A");
      svg.insertBefore(cyan, dot); svg.insertBefore(mag, dot);
      nodes.push({ x: 185, y: 165, t, cyan, mag });
    }

    const toSvg = (evt) => {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };
    const setTarget = (evt) => {
      const p = toSvg(evt);
      tx = Math.max(BOUND.x0, Math.min(BOUND.x1, p.x));
      ty = Math.max(BOUND.y1, Math.min(BOUND.y0, p.y));
      window.__glitchMood = {
        focus:  Math.round(((tx - BOUND.x0) / (BOUND.x1 - BOUND.x0)) * 100),
        energy: Math.round(((BOUND.y0 - ty) / (BOUND.y0 - BOUND.y1)) * 100)
      };
    };

    // puntík sleduje cíl; ohon (řetěz) se drží za ním po dráze a k dálce se rozkládá + mizí
    function tick() {
      cx += (tx - cx) * 0.45;
      cy += (ty - cy) * 0.45;
      dot.setAttribute("cx", cx.toFixed(1));
      dot.setAttribute("cy", cy.toFixed(1));

      let px = cx, py = cy;
      for (const n of nodes) {                 // každý uzel sleduje předchozí → ohon po dráze
        n.x += (px - n.x) * CHAIN;
        n.y += (py - n.y) * CHAIN;
        px = n.x; py = n.y;
      }
      const last = nodes[N - 1];
      const stretch = Math.hypot(cx - last.x, cy - last.y);   // jak je ohon roztažený (rychlost)
      for (const n of nodes) {
        const split = Math.min(9, stretch * 0.5) * n.t;       // dál = větší rozklad
        const jit = split > 1 ? (Math.random() - 0.5) * split * 0.3 : 0;
        const op = (0.55 * Math.pow(1 - n.t, 1.3)).toFixed(3); // dál = průhlednější (mizí)
        n.cyan.setAttribute("cx", (n.x - split).toFixed(1)); n.cyan.setAttribute("cy", (n.y + jit).toFixed(1)); n.cyan.setAttribute("opacity", op);
        n.mag.setAttribute("cx", (n.x + split).toFixed(1)); n.mag.setAttribute("cy", (n.y - jit).toFixed(1)); n.mag.setAttribute("opacity", op);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    dot.addEventListener("pointerdown", (e) => { dragging = true; try { dot.setPointerCapture(e.pointerId); } catch (_) {} });
    svg.addEventListener("pointermove", (e) => { if (dragging) setTarget(e); });
    window.addEventListener("pointerup", () => { dragging = false; });
    // tap kamkoli do diagramu → puntík tam doklouže
    svg.addEventListener("pointerdown", (e) => { dragging = true; setTarget(e); });

    // výchozí hodnota (střed), aby šlo potvrdit i bez tažení
    if (!window.__glitchMood) {
      window.__glitchMood = {
        focus:  Math.round(((cx - BOUND.x0) / (BOUND.x1 - BOUND.x0)) * 100),
        energy: Math.round(((BOUND.y0 - cy) / (BOUND.y0 - BOUND.y1)) * 100)
      };
    }

    // Potvrdit → ulož náladu (lokálně vždy; do DB při přihlášení)
    const confirmBtn = el.querySelector("[data-mood-confirm]");
    if (confirmBtn) confirmBtn.addEventListener("click", async () => {
      if (confirmBtn.disabled) return;
      const m = window.__glitchMood || { focus: 50, energy: 50 };
      let res = { ok: false, reason: "auth" };
      try { if (typeof sbSaveMood === "function") res = await sbSaveMood(m.focus, m.energy); } catch (_) {}
      if (res.ok) {                                  // uloženo i do účtu
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Uloženo ✓";
        toast("Nálada uložena");
      } else if (res.reason === "auth") {            // nepřihlášen → nabídni přihlášení
        toast("Přihlas se, ať se nálada uloží do účtu.");
        const p = document.getElementById("nav-profile");
        if (p) p.click();                            // otevře přihlašovací panel (auth.js)
      } else {                                       // přihlášen, ale DB nedostupná
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Uloženo ✓";
        toast("Uloženo");
      }
    });
  }

  /* ---- Rychlá výzva (kvíz) ---- */
  function initQuiz(el) {
    const opts = el.querySelectorAll(".quiz-opt");
    let answered = false;
    opts.forEach((opt) => opt.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const correct = opt.dataset.correct === "true";
      opts.forEach((o) => {
        if (o.dataset.correct === "true") o.classList.add("is-correct");
        else if (o === opt) o.classList.add("is-wrong");
        else o.classList.add("is-wrong");
      });
      setTimeout(() => nextFrom(el), correct ? 850 : 1400);
    }));
  }

  /* ---- Historická osobnost (persona chat — připravujeme) ---- */
  function initPersona(el) {
    const cta = el.querySelector("[data-persona]");
    if (cta) cta.addEventListener("click", () => toast("Chat s personou — připravujeme 🚧"));
  }

  /* ---- Argumentuj ---- */
  function initArgument(el) {
    const opts = el.querySelectorAll(".arg-opt");
    opts.forEach((btn) => btn.addEventListener("click", () => {
      opts.forEach((b) => b.classList.toggle("is-sel", b === btn));
      // TODO: otevřít chat s Tinybotem (zatím není hotový)
      toast("Chat s Tinybotem — připravujeme 🚧");
    }));
  }

  /* ==========================================================================
     Rozklik (detail Glitche) — celoobrazovkový světlý panel nad feedem.
     Dva druhy: „explainer" (vysvětlení, např. Co je Glitch) a „chat"
     (Basic Glitch — povídání s Tinybotem + kvíz). Chatbot se napojí později;
     zatím je konverzace skriptovaná a vstupní pole jen přidá bublinu uživatele.
     ========================================================================== */
  const SEND_ICO =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
    '<path d="M3 11.5 21 3l-8.5 18-2.7-7.3L3 11.5Z" fill="#1a1a1a"/></svg>';

  function rzBadges(c) {
    // v rozkliku vpravo nahoře: autor (Glitch) + téma — bílé pilulky s obrysem
    const parts = [];
    if (!NO_CREATOR.has(c.type)) parts.push(`<span class="rz-badge">${esc(trustLabel(c.trust))}</span>`);
    if (c.topic) parts.push(`<span class="rz-badge">${esc(c.topic)}</span>`);
    return `<div class="rz-badges">${parts.join("")}</div>`;
  }

  function renderExplainer(c, r) {
    const paras = (r.paragraphs || []).map((p) => `<p class="rz-para g-p">${esc(p)}</p>`).join("");
    const brand = r.brand === "tiny-glitch"
      ? `<img class="rz-brand" src="assets/ui/tiny-logo-pixelized.svg" alt="Tiny Glitch">`
      : "";
    return `
      <header class="rz-bar">
        <button class="rz-close" data-rz-close aria-label="Zavřít"><img src="assets/ui/more-button.svg" alt=""></button>
        ${rzBadges(c)}
      </header>
      <div class="rz-body rz-body--explainer">
        ${brand}
        <h1 class="rz-title g-h1">${esc(r.title)}</h1>
        ${paras}
      </div>`;
  }

  function renderChat(c, r) {
    const thread = (r.messages || []).map((m) => {
      if (m.from === "bot") {
        return `<div class="rz-msg rz-msg--bot"><span class="rz-ava rz-ava--bot"><img src="${LOGO}" alt="Tinybot"></span>` +
               `<div class="rz-bubble">${esc(m.text)}</div></div>`;
      }
      if (m.from === "user") {
        return `<div class="rz-msg rz-msg--user"><div class="rz-bubble">${esc(m.text)}</div>` +
               `<span class="rz-ava rz-ava--user"></span></div>`;
      }
      if (m.from === "quiz") {
        const type = m.multi ? "checkbox" : "radio";
        const opts = (m.options || []).map((o, i) =>
          `<button class="rz-opt" data-rz-opt="${i}" data-correct="${!!o.correct}" data-type="${type}">` +
          `<span class="rz-mark rz-mark--${type}"></span><span class="rz-opt-label">${esc(o.label)}</span></button>`).join("");
        return `<div class="rz-quiz" data-rz-quiz data-multi="${!!m.multi}">${opts}` +
               `<button class="rz-quiz-submit" data-rz-submit>Odeslat odpověď</button></div>`;
      }
      return "";
    }).join("");
    return `
      <header class="rz-bar">
        <button class="rz-close" data-rz-close aria-label="Zavřít"><img src="assets/ui/more-button.svg" alt=""></button>
        ${r.chapter ? `<span class="rz-chapter">${esc(r.chapter)}</span>` : ""}
        ${rzBadges(c)}
      </header>
      <div class="rz-body rz-body--chat">
        <h1 class="rz-title g-h1">${esc(r.title)}</h1>
        ${r.intro ? `<p class="rz-intro g-p">${esc(r.intro)}</p>` : ""}
        <div class="rz-thread" data-rz-thread>${thread}</div>
      </div>
      <form class="rz-input" data-rz-form>
        <input class="rz-input-field" type="text" placeholder="Začni psát…" aria-label="Napiš zprávu" autocomplete="off">
        <button class="rz-send" type="submit" aria-label="Odeslat">${SEND_ICO}</button>
      </form>`;
  }

  let _rzOverlay = null;
  function ensureRzOverlay() {
    if (_rzOverlay) return _rzOverlay;
    _rzOverlay = document.createElement("div");
    _rzOverlay.className = "rz-overlay";
    _rzOverlay.innerHTML = `<section class="rz-panel" role="dialog" aria-modal="true"></section>`;
    document.body.appendChild(_rzOverlay);
    // klik na tmavé pozadí (mimo panel) zavře
    _rzOverlay.addEventListener("click", (e) => { if (e.target === _rzOverlay) closeRozklik(); });
    return _rzOverlay;
  }

  function openRozklik(c) {
    if (!c || !c.rozklik) return;
    const r = c.rozklik;
    const ov = ensureRzOverlay();
    const panel = ov.querySelector(".rz-panel");
    panel.className = "rz-panel rz-panel--" + (r.kind || "explainer");
    panel.innerHTML = (r.kind === "chat") ? renderChat(c, r) : renderExplainer(c, r);
    panel.scrollTop = 0;
    ov.classList.add("is-open");
    document.body.classList.add("rz-lock");

    panel.querySelector("[data-rz-close]").addEventListener("click", closeRozklik);
    if (r.kind === "chat") initRzChat(panel);
  }

  function closeRozklik() {
    if (!_rzOverlay) return;
    _rzOverlay.classList.remove("is-open");
    document.body.classList.remove("rz-lock");
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && _rzOverlay && _rzOverlay.classList.contains("is-open")) closeRozklik();
  });

  function initRzChat(panel) {
    // Kvíz uvnitř chatu: výběr možností + vyhodnocení po odeslání
    panel.querySelectorAll("[data-rz-quiz]").forEach((quiz) => {
      const multi = quiz.dataset.multi === "true";
      const opts = quiz.querySelectorAll(".rz-opt");
      const submit = quiz.querySelector("[data-rz-submit]");
      let done = false;
      opts.forEach((opt) => opt.addEventListener("click", () => {
        if (done) return;
        if (multi) opt.classList.toggle("is-sel");
        else { opts.forEach((o) => o.classList.toggle("is-sel", o === opt)); }
      }));
      if (submit) submit.addEventListener("click", () => {
        if (done) return; done = true;
        opts.forEach((o) => {
          const correct = o.dataset.correct === "true";
          const sel = o.classList.contains("is-sel");
          if (correct) o.classList.add("is-correct");
          if (sel && !correct) o.classList.add("is-wrong");
          o.classList.add("is-locked");
        });
        submit.textContent = "Vyhodnoceno";
        submit.disabled = true;
      });
    });

    // Vstupní pole: přidá bublinu uživatele (napojení na Tinybota přijde později)
    const form = panel.querySelector("[data-rz-form]");
    const thread = panel.querySelector("[data-rz-thread]");
    if (form && thread) form.addEventListener("submit", (e) => {
      e.preventDefault();
      const field = form.querySelector(".rz-input-field");
      const text = (field.value || "").trim();
      if (!text) return;
      const msg = document.createElement("div");
      msg.className = "rz-msg rz-msg--user";
      msg.innerHTML = `<div class="rz-bubble"></div><span class="rz-ava rz-ava--user"></span>`;
      msg.querySelector(".rz-bubble").textContent = text;
      thread.appendChild(msg);
      field.value = "";
      thread.scrollIntoView({ block: "end" });
      panel.scrollTo({ top: panel.scrollHeight, behavior: "smooth" });
      toast("Tinybot se připojí brzy 🚧");
    });
  }

})();
