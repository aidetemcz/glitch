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

    { type: "mood_selector", category: "Wellbeing", trust: "Core",
      title: "Jak se teď cítíš?",
      body: "Umísti potažením černou tečku na správné místo v diagramu. My podle toho upravíme Glitche, které se ti dnes zobrazí." },

    { type: "breathing", category: "Wellbeing",
      title: "Dechové cvičení",
      body: "Rovnoměrné vědomé dýchání ti může pomoci zlepšit soustředění.",
      cycles: 7 },

    { type: "quest_intro", category: "Vibe Coding", chapterNo: 1,
      title: "Vibe Coding",
      body: "Vibe Coding je programování v přirozeném jazyce. Zjisti, jak vznikl a jak to celé funguje.",
      video: "assets/videos/vibe-coding_01.mp4" },

    { type: "quick_challenge", category: "Rychlá výzva", trust: "Generováno",
      question: "Rychlý počet z hlavy",
      questionStyle: "h3",
      taskText: "310 × 15 = ?",
      sub: "Vyber správný výsledek.",
      cols: 2,
      answers: [
        { label: "4 650", correct: true },
        { label: "4 350", correct: false },
        { label: "4 750", correct: false },
        { label: "3 950", correct: false }
      ] },

    { type: "quick_challenge", category: "Rychlá výzva",
      figure: "triangles",
      question: "Kolik trojúhelníků je v obrazci?",
      questionStyle: "h3",
      sub: "Počítej i ty, které vzniknou překrytím čar.",
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
      sub: "Vyber, jak to vnímáš a dokaž chatbotovi, že máš pravdu." },

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
    return `<button class="nav-chevron" data-nav="${act}" aria-label="${lbl}"><img src="assets/ui/more-button.svg" alt="" width="38" height="59"></button>`;
  };
  const chapter = (n) => n != null ? `<span class="chapter-no">${esc(n)}</span>` : "";
  const deco = (cls, style) => `<span class="pixel-deco ${cls}" style="${style}">${ICON.plus}</span>`;

  const RENDER = {

    welcome(c) {
      return `
        <img class="welcome-tiny" src="assets/ui/tiny-logo-pixelized.svg" alt="Tiny">
        <span class="pixel-deco" style="top:13.9%;right:16.4%;width:13px;height:16px">${ICON.spark}</span>
        ${deco("", "top:31.4%;left:17.4%;width:12px;height:15px")}
        ${deco("", "top:55.6%;left:74.9%;width:12px;height:12px")}
        <span class="pixel-deco" style="top:75.9%;left:18.9%;width:12px;height:13px">${ICON.spark}</span>
        <img class="welcome-logo" src="${LOGO}" alt="Glitch">
        <div class="card-footer">
          <button class="welcome-login" data-welcome-login>Přihlášení Google účtem</button>
        </div>`;
    },

    intro(c) {
      // About Glitch (Figma 147:439): loga vpravo nahoře, H2 + celý text na kartě, bez šipky
      return `
        <span class="pixel-deco" style="top:18.3%;left:39.3%;width:8px;height:9px">${ICON.spark}</span>
        ${deco("", "top:26.8%;left:84.8%;width:9px;height:12px")}
        <img class="intro-tiny" src="assets/ui/tiny-logo-pixelized.svg" alt="Tiny">
        <img class="intro-glitch" src="${LOGO}" alt="Glitch">
        <h2 class="fx-block g-h2" style="top:34%">Glitch je vzdělávací sociální síť</h2>
        <div class="fx-block intro-body g-p" style="top:47.1%">
          <p>Když se chceš ty něco nového naučit nebo pokud chceš naučit ty někoho jiného, tak tady je tvůj prostor.</p>
          <p>Ve feedu najdeš tzv. Glitche. Jsou to mikrotémata. Některé Glitche jsou jen malé výzvy, které můžeš plnit přímo ve feedu. Jiné můžeš rozkliknout a popovídat si o nich s chatbotem, ověřit si znalosti kvízem.</p>
          <p>Každý Glitch můžeš navíc remixovat. To znamená, že k němu přidáš to, co víš nebo vyzkoumáš a můžeš to sdílet s ostatními, kteří na tvou práci mohou dál navázat vlastním remixem.</p>
          <p>Můžeš také vytvořit Glitche pro kamarády, kterými se něco naučí.</p>
          <p>Glitche se řadí do tzv. questů. Když splníš všechny Glitche v questu, odemkne se ti speciální úkol.</p>
          <p>Tak pojďme na to!</p>
        </div>`;
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
          <div class="breath-ring">
            <div class="breath-circle" data-breath="circle"></div>
            <span class="breath-digit g-chapter-no" data-breath="digit">${c.cycles}</span>
          </div>
        </div>
        <div class="card-footer">
          <p class="breath-hint g-p" data-breath="hint">Pohodlně se usaď a stiskni tlačítko začít.</p>
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
        ? `<video class="quest-video" muted loop playsinline preload="none" data-poster="${poster}" data-video-src="${c.video}"></video>`
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
      // Jednotné rozvržení pro všechny výzvy: otázka nahoře (y≈216), úkol
      // (kód / obrazec) vystředěný v prázdném prostoru, odpovědi dole.
      const textLayout = c.layout === "text";
      const optCls = textLayout ? "quiz-opt quiz-opt--text g-p" : "quiz-opt g-h4";
      const opts = c.answers.map((a, i) =>
        `<button class="${optCls}" data-quiz="${i}" data-correct="${!!a.correct}">${esc(a.label)}</button>`).join("");
      const cols = textLayout ? "cols-1v" : (c.figure === "triangles" ? "cols-3" : ("cols-" + (c.cols || 2)));
      // krátká otázka (např. „310×15=") má styl H1 (40), věty H3 (25) — dle Figmy
      const qCls = c.questionStyle === "h1" ? "g-h1" : "g-h3";
      // ÚLOHA (prostřední prvek) — jeden z: obrázek / kód / text (<p>). Pevná struktura
      // rychlé výzvy: NADPIS → ÚLOHA → VYSVĚTLENÍ (<p>) → TLAČÍTKA (viz editor karet).
      let task = "";
      if (c.figure === "triangles") task = `<div class="quiz-figure-wrap">${triangleFigure()}</div>`;
      else if (c.image) task = `<div class="quiz-image"><img src="${esc(c.image.src || c.image)}" alt="${esc(c.image.alt || "")}"></div>`;
      else if (c.code) task = `<pre class="quiz-code">${esc(c.code)}</pre>`;
      else if (c.taskText) task = `<p class="quiz-tasktext g-p">${esc(c.taskText)}</p>`;
      // Vysvětlení (sub, <p>) se čte pod úlohou (nad tlačítky). Nemá-li výzva úlohu,
      // zůstává sub podnadpisem hned pod nadpisem (bezpečný fallback).
      const hasTask = !!task;
      const sub = c.sub ? `<p class="quiz-sub g-p">${esc(c.sub)}</p>` : "";
      return `${badges(c)}
        <div class="quiz-frame${textLayout ? " quiz-frame--flow" : ""}">
          <div class="quiz-head">
            <div class="${qCls}">${esc(c.question)}</div>
            ${hasTask ? "" : sub}
          </div>
          <div class="quiz-task">${task}</div>
          ${hasTask && sub ? `<div class="quiz-caption">${sub}</div>` : ""}
          <div class="quiz-answers"><div class="quiz-options ${cols}">${opts}</div></div>
        </div>`;
    },

    attention_game(c) {
      // data-driven: víc aktivit sdílí stejnou strukturu (nadpis, návod, počítadlo, koule)
      const help = c.help || "Tažením otáčíš kouli. Díry označíš ťuknutím. Ale pozor: označit lze jen díry, které jsou vpředu.";
      const countLabel = c.countLabel || "Označených děr";
      const countInit = c.countInit || "0/0";
      return `${badges(c)}
        <h3 class="fx-block g-h3" style="top:17.4%">${esc(c.title)}</h3>
        <p class="fx-block g-p atten-help" style="top:27%">${esc(help)}</p>
        <p class="fx-block g-p atten-count" style="top:41%;pointer-events:none">${esc(countLabel)}: <span data-atten-count>${esc(countInit)}</span></p>
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
      const media = c.viz
        ? vizFrame(c.viz)
        : c.image
          ? `<img src="${c.image}" alt="">`
          : `<div class="asset-missing">ilustrace<br>(doplnit)</div>`;
      return `${badges(c)}
        <div class="stack stack--pod">
          <div class="stack-media"><div class="funfact-tile">${media}</div></div>
          <div class="stack-text">
            <h3 class="fx-title g-h3">${esc(c.title)}</h3>
            <p class="fx-text g-p">${esc(c.body)}</p>
          </div>
        </div>
        ${chevron(c)}`;
    },

    spot_the_mistake(c) {
      const media = c.image
        ? `<img src="${c.image}" alt="">`
        : `<div class="asset-missing">fotografie<br>(doplnit)</div>`;
      return `${badges(c)}
        <div class="stack stack--pod">
          <div class="stack-media"><div class="mistake-photo">${media}</div></div>
          <div class="stack-text">
            <h3 class="fx-title mistake-claim g-h3">${esc(c.claim)}</h3>
            <p class="fx-text mistake-context g-p">${esc(c.context)}</p>
          </div>
        </div>
        ${chevron(c)}`;
    },

    historicka_osobnost(c) {
      const media = c.image
        ? `<img src="${c.image}" alt="">`
        : `<div class="asset-missing">fotografie<br>(doplnit)</div>`;
      return `${badges(c)}
        <div class="stack stack--pod">
          <div class="stack-media"><div class="persona-photo">${media}</div></div>
          <div class="stack-text">
            <h1 class="fx-title g-h1">${esc(c.title)}</h1>
            <p class="fx-text g-p">${esc(c.body)}</p>
          </div>
        </div>
        ${chevron(c)}`;
    },

    argument(c) {
      return `${badges(c)}
        <h2 class="fx-block arg-claim g-h2" style="top:26.4%">${esc(c.claim)}</h2>
        <p class="fx-block arg-sub g-p" style="top:42.8%">${esc(c.sub)}</p>
        <div class="arg-actions">
          <button class="arg-opt" data-arg="agree">Souhlasím</button>
          <button class="arg-opt" data-arg="disagree">Nesouhlasím</button>
        </div>`;
    },

    daily_summary(c) {
      const rows = c.stats.map((s) =>
        `<div class="summary-row"><span>${esc(s.label)}</span><span class="summary-row-val">${esc(s.value)}</span></div>`).join("");
      return `${badges(c)}
        <span class="pixel-deco" style="top:8.1%;left:26.6%;width:14px;height:17px">${ICON.spark}</span>
        ${deco("", "top:27.9%;left:14.2%;width:13px;height:15px")}
        ${deco("", "top:34.7%;left:66.2%;width:13px;height:13px")}
        <div class="summary-mascot-wrap">
          <img src="assets/img/summary-mascot.png" alt="">
        </div>
        <h3 class="fx-block g-h3" style="top:44.4%">Tvé shrnutí pro dnešek</h3>
        <div class="summary-stats fx-block" style="top:50.7%">${rows}</div>
        <button class="summary-link fx-block" style="top:66.5%">Zobrazit dlouhodobé statistiky</button>
        <p class="summary-outro fx-block g-p reserve-chevron" style="top:76.3%">Každý den ti zobrazíme maximálně 20 Glitchů. Sociální sítě by neměly brát příliš tvé pozornosti.<br><br>Těšíme se na tebe třeba zítra!</p>
        ${chevron(c)}`;
    },

    time_to_let_go(c) {
      // Závěrečná wellbeing karta (Figma 125:278): H2 + text nahoře, kočka full-bleed dole
      return `${badges(c)}
        <h2 class="fx-block g-h2" style="top:22.1%">${esc(c.title)}</h2>
        <p class="fx-block letgo-text g-p" style="top:29.1%">${esc(c.body)}</p>
        <img class="letgo-img" src="${c.image || "assets/img/time-to-let-go-cat.jpg"}" alt="">`;
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
    // geometrie přesně dle Figmy (27:218): čtverec 150, úhlopříčka TL→BR,
    // TR→levá hrana (0,103), TR→spodní hrana (90,150)
    return `<div class="quiz-figure"><svg width="150" height="150" viewBox="0 0 150 150" fill="none">
      <g stroke="#fff" stroke-width="1">
        <rect x="0.5" y="0.5" width="149" height="149"/>
        <line x1="0.5" y1="0.5" x2="149.5" y2="149.5"/>
        <line x1="149.5" y1="0.5" x2="0" y2="103"/>
        <line x1="149.5" y1="0.5" x2="90" y2="150"/>
      </g></svg></div>`;
  }

  function moodDiagram() {
    // osa X = SOUSTŘEDĚNÍ (0–100), osa Y = ENERGIE (0–100)
    // geometrie dle Figmy 16:67: počátek (36,324), osy přesahují počátek (33 dolů / 29 vlevo)
    return `<svg class="mood-diagram" viewBox="0 0 358 357" data-mood preserveAspectRatio="xMidYMid meet">
      <defs><marker id="ah" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#000"/></marker></defs>
      <line x1="36" y1="357" x2="36" y2="8"  stroke="#000" stroke-width="1.5" marker-end="url(#ah)"/>
      <line x1="7" y1="324" x2="350" y2="324" stroke="#000" stroke-width="1.5" marker-end="url(#ah)"/>
      <text class="mood-axis-label" x="0" y="12">100</text>
      <text class="mood-axis-label" x="9" y="346">O</text>
      <text class="mood-axis-label" x="331" y="346">100</text>
      <text class="mood-axis-label" x="248" y="346" text-anchor="end">SOUSTŘEDĚNÍ</text>
      <text class="mood-axis-label" x="14" y="160" transform="rotate(-90 14 160)" text-anchor="middle">ENERGIE</text>
      <circle class="mood-dot" data-mood-dot cx="182.5" cy="155.5" r="22.5" fill="#000"/>
    </svg>`;
  }

  /* ==========================================================================
     Sestavení feedu
     ========================================================================== */
  const feed = document.getElementById("glitch-feed");

  // Sjednocené černé pozadí u obsahových karet (dřív barevné). Žlutý welcome
  // a bílé systémové karty (intro/mood/shrnutí) zatím zůstávají.
  const BG = {
    welcome: "yellow", intro: "white", argument: "black", mood_selector: "white", daily_summary: "white",
    breathing: "black", attention_game: "black", algorithm_demo: "black", time_to_let_go: "black",
    quick_challenge: "black", spot_the_mistake: "black", fun_fact: "black",
    historicka_osobnost: "black", quest_intro: "image"
  };

  let welcomeCard = null;
  function applyWelcomeVisibility(loggedIn) {
    if (!welcomeCard) return;
    welcomeCard.classList.toggle("is-hidden", !!loggedIn);
  }

  // Sestavení karet z katalogu, seřazené doporučovačem (js/recommender.js)
  let _cardData = [];
  let _catalog = null;
  function buildCards(catalog) {
    const ordered = (typeof window.serazFeed === "function") ? window.serazFeed(catalog) : catalog;
    // Noční zámek = jediná karta „Je čas vypnout screen!" → celoobrazovkově,
    // bez štítků a bez spodního menu (viz .glitch-night v CSS).
    const nightlock = ordered.length === 1 && ordered[0] && ordered[0].type === "time_to_let_go";
    document.body.classList.toggle("glitch-night", nightlock);
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
      const res = await fetch("glitches/feed.json?v=25", { cache: "no-cache" });
      if (res.ok) catalog = await res.json();
    } catch (_) {}
    _catalog = catalog;
    buildCards(catalog);
  })();

  // Noční zámek se má aktivovat i bez reloadu — každou minutu zkontroluj, jestli
  // se překlopil den↔noc, a když ano, přestav feed.
  let _wasNight = (function () { const h = new Date().getHours(); return h >= 22 || h < 6; })();
  setInterval(function () {
    const h = new Date().getHours();
    const night = h >= 22 || h < 6;
    if (night !== _wasNight && _catalog) { _wasNight = night; buildCards(_catalog); }
  }, 60000);

  /* ==========================================================================
     Navigace (chevron / maskot → další karta)
     ========================================================================== */
  function scrollToIndex(i) {
    const target = feed.children[i];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  // pozice v DOM (ne dataset.index — ten je klíč do dat a karta se může přesunout
  // kvůli druhé šanci, viz posunNaDruhouSanci)
  function nextFrom(el) {
    const i = Array.prototype.indexOf.call(feed.children, el);
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
      // je-li otevřený rozklik, klik do menu ho nejdřív zavře (menu je vidět i v rozkliku)
      if (_rzOverlay && _rzOverlay.classList.contains("is-open")) closeRozklik();
      if (tab === "profile") return;                 // přihlášení řeší auth.js
      if (tab === "feed") { scrollToIndex(0); setActiveTab(item); return; }
      // Questy a Projekty otevřou profil na příslušném tabu
      if (tab === "questy" && typeof window.glitchOpenProfile === "function") { window.glitchOpenProfile("quests"); return; }
      if (tab === "projekty" && typeof window.glitchOpenProfile === "function") { window.glitchOpenProfile("board"); return; }
      toast("Připravujeme 🚧");                        // tvořit zatím není
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
    if (c.type === "quick_challenge") initQuiz(el, c);
    if (c.type === "argument") initArgument(el);
    if (c.type === "historicka_osobnost") initPersona(el);
    if (c.type === "attention_game") initAttention(el, c);
    if (c.type === "algorithm_demo") initVizFrame(el);
    if (c.type === "fun_fact") initVizFrame(el);            // fun fact může mít animaci (viz) místo obrázku
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
     loading=lazy, které uvnitř posuvného feedu na mobilech vynechává.
     DŮLEŽITÉ pro plynulost: animace se po odscrollování zase ODNAČTE
     (src → about:blank), aby se zastavila její requestAnimationFrame smyčka.
     Jinak by všechny už zobrazené animace běžely dál na pozadí a od půlky
     feedu dál by se jich nasčítalo tolik, že by scroll začal sekat.
     Hystereze: načíst do 500 px, odnačíst až za 900 px (žádné blikání na hraně). */
  let _vizLoad = null, _vizUnload = null;
  function lazyLoadIframe(f) {
    if (!f || !f.dataset.vizSrc) return;
    if (!("IntersectionObserver" in window)) { if (!f.getAttribute("src")) f.src = f.dataset.vizSrc; return; }
    if (!_vizLoad) {
      _vizLoad = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const fr = e.target;
          if (fr.dataset.loaded !== "1") { fr.src = fr.dataset.vizSrc; fr.dataset.loaded = "1"; }
        });
      }, { root: feed, rootMargin: "500px 0px", threshold: 0.01 });
      _vizUnload = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) return;                 // pořád v širším okně → nech běžet
          const fr = e.target;
          if (fr.dataset.loaded === "1") {              // odjelo daleko → zastav animaci
            fr.src = "about:blank"; fr.dataset.loaded = "0";
          }
        });
      }, { root: feed, rootMargin: "900px 0px", threshold: 0.01 });
    }
    _vizLoad.observe(f);
    _vizUnload.observe(f);
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
    let hotovo = false;
    window.addEventListener("message", (ev) => {
      if (iframe && ev.source !== iframe.contentWindow) return;
      const d = ev.data || {};
      if (d.ns !== NS || d.type !== "score") return;
      const n = (d.hit != null) ? d.hit : d.found;
      if (countEl) countEl.textContent = n + "/" + d.total;

      // splněno = nasbíral vše (všechna slova / všechny díry). Učební aktivita se
      // zaznamená stejně jako rychlá výzva (localStorage + Supabase progress) a
      // doporučovač ji pak z feedu vyfiltruje, takže se přestane objevovat.
      // Wellbeingové aktivity (c.replayable, např. koule) se ZÁMĚRNĚ nezaznamenávají
      // — mají se objevovat klidně občas znovu.
      if (!hotovo && !c.replayable && d.total > 0 && n >= d.total && c && c.id) {
        hotovo = true;
        if (typeof window.markGlitchDone === "function") {
          window.markGlitchDone(c.id, { typ: c.type, correct: true });
        }
      }
    });
  }

  /* ---- Dechové cvičení (stavový automat: běh / pauza) ---- */
  function initBreathing(el, c) {
    const PHASE = 4000;                       // 4 s nádech, 4 s výdech (bez zádrže)
    let target = c.cycles;
    const valueEl  = el.querySelector("[data-breath='value']");
    const circleEl = el.querySelector("[data-breath='circle']");
    const digitEl  = el.querySelector("[data-breath='digit']");
    const hintEl   = el.querySelector("[data-breath='hint']");
    const btnEl    = el.querySelector("[data-breath='start']");
    const IDLE_HINT = hintEl ? hintEl.textContent : "";

    let state = "idle";                       // idle | running | paused | done
    let cycle = 0, phase = "in", phaseStart = 0, elapsedAtPause = 0, rafId = null;

    const easeInOut = (p) => 0.5 * (1 - Math.cos(Math.PI * p));
    const setCounter = () => { valueEl.textContent = (state === "idle" ? 0 : Math.min(cycle, target)) + "/" + target; };

    // odpočet nad kolečkem; vnitřní kolečko (53) se nafukuje uvnitř šedého kruhu (178)
    const render = (elapsed) => {
      const p = Math.min(elapsed / PHASE, 1);
      const e = easeInOut(p);
      const scale = phase === "in" ? (1 + 2 * e) : (3 - 2 * e);
      circleEl.style.transform = "scale(" + scale.toFixed(3) + ")";
      if (digitEl) digitEl.textContent = Math.max(1, Math.ceil((PHASE - elapsed) / 1000));
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
      if (digitEl) digitEl.textContent = "";
      if (hintEl) hintEl.textContent = "Hotovo, skvělá práce!";
      btnEl.textContent = "Začít";
    }
    function toIdle() {
      state = "idle"; cycle = 0;
      circleEl.style.transform = "";
      if (digitEl) digitEl.textContent = target;
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
    const BOUND = { x0: 36, x1: 350, y0: 324, y1: 8 };
    const N = 9, R = 22.5, CHAIN = 0.42;    // délka a těsnost ohonu
    let dragging = false;
    let cx = 182.5, cy = 155.5, tx = 182.5, ty = 155.5;   // puntík: aktuální vs. cílová pozice

    // ohon = řetěz uzlů; každý má azurovou + purpurovou kopii, k dálce se rozkládají a mizí
    const nodes = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);                 // 0 = u puntíku, 1 = konec ohonu
      const mk = (color) => {
        const c = document.createElementNS(SVGNS, "circle");
        c.setAttribute("class", "mood-ghost");
        c.setAttribute("r", (R * (1 - 0.45 * t)).toFixed(1));
        c.setAttribute("fill", color);
        c.setAttribute("cx", cx); c.setAttribute("cy", cy);
        c.style.mixBlendMode = "multiply";
        return c;
      };
      const cyan = mk("#21E0F0"), mag = mk("#FF2E9A");
      svg.insertBefore(cyan, dot); svg.insertBefore(mag, dot);
      nodes.push({ x: cx, y: cy, t, cyan, mag });
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
  /* Druhá šance v běžící relaci: neuhodnutou kartu přesune o kus níž, aby se
     k ní žák za chvíli vrátil. Děje se až po odскrolování na další kartu a
     scrollTop se dorovná o výšku přesunuté karty, aby feed nepodskočil. */
  const RETRY_POSUN = 8;
  function posunNaDruhouSanci(el) {
    setTimeout(() => {
      const kolikDal = RETRY_POSUN;
      const deti = Array.prototype.slice.call(feed.children);
      const odkud = deti.indexOf(el);
      if (odkud < 0) return;
      const kam = Math.min(deti.length - 1, odkud + kolikDal);
      if (kam <= odkud) return;                       // není kam posunout
      const vyska = el.getBoundingClientRect().height +
        parseFloat(getComputedStyle(el).marginBottom || 0);
      const byloNad = el.getBoundingClientRect().bottom < 0;   // už je nad výřezem?
      feed.insertBefore(el, feed.children[kam].nextSibling);
      if (byloNad) feed.scrollTop -= vyska;           // dorovnat, ať nic nepodskočí
      // dataset.index se NEpřečísluje — je to klíč do dat karty (_cardData);
      // navigace pracuje s pořadím v DOM (viz nextFrom)
    }, 1600);                                          // až po automatickém posunu dál
  }

  function initQuiz(el, c) {
    const opts = el.querySelectorAll(".quiz-opt");
    let answered = false;
    opts.forEach((opt) => opt.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const correct = opt.dataset.correct === "true";
      // Rychlá výzva nemá konverzaci — hotová je správnou odpovědí.
      // Při špatné se nezavírá: dostane druhou šanci o kus dál ve feedu.
      if (c && c.id) {
        if (correct && typeof window.markGlitchDone === "function") {
          window.markGlitchDone(c.id, { typ: c.type, kviz: true, correct: true });
        } else if (!correct && typeof window.markGlitchRetry === "function") {
          window.markGlitchRetry(c.id);
          posunNaDruhouSanci(el);
        }
      }
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
      // TODO: otevřít chat s chatbotem (zatím není hotový)
      toast("Chat s chatbotem — připravujeme 🚧");
    }));
  }

  /* ==========================================================================
     Rozklik (detail Glitche) — celoobrazovkový světlý panel nad feedem.
     Dva druhy: „explainer" (vysvětlení, např. Co je Glitch) a „chat"
     (Basic Glitch — povídání s chatbotem + kvíz). Chatbot se napojí později;
     zatím je konverzace skriptovaná a vstupní pole jen přidá bublinu uživatele.
     ========================================================================== */
  const SEND_ICO =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">' +
    '<path d="M4 11.7 20.5 3.8l-7.3 16.7-2.4-6.6L4 11.7Z" stroke="#1a1a1a" stroke-width="1.7" stroke-linejoin="round"/>' +
    '<path d="M10.8 13.9 20.5 3.8" stroke="#1a1a1a" stroke-width="1.7" stroke-linejoin="round"/></svg>';

  function rzBadges(c) {
    // v rozkliku vpravo nahoře: autor (Glitch) + téma — bílé pilulky s obrysem
    const parts = [];
    if (!NO_CREATOR.has(c.type)) parts.push(`<span class="rz-badge">${esc(trustLabel(c.trust))}</span>`);
    if (c.topic) parts.push(`<span class="rz-badge">${esc(c.topic)}</span>`);
    return `<div class="rz-badges">${parts.join("")}</div>`;
  }

  function renderExplainer(c, r) {
    const paras = (r.paragraphs || []).map((p) => `<p class="rz-para g-p">${esc(p)}</p>`).join("");
    const brand = r.brand === "glitch"
      ? `<img class="rz-brand" src="assets/glitch-logo.svg" alt="Glitch">`
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

  /* ---- Pre-test: „Co už o tématu víš?" ----
     Po rozkliknutí Glitche si žák zvolí, na čem je — bot pak podle toho přizpůsobí
     výklad. Volby jdou přepsat v kartě (rozklik.pretest), jinak platí obecné
     (bez skloňování názvu tématu, aby seděly na jakýkoli Glitch). */
  // `opening` = jak má bot zahájit rozhovor podle toho, co žák o tématu ví.
  // Kdo téma zná, nechce úvod → rovnou dostane otevřenou ověřovací otázku.
  const PRETEST_DEFAULT = [
    { label: "Zatím o tom nevím vůbec nic.",
      opening: "Žák uvedl, že o tématu neví nic. Vysvětli mu podstatu od úplných základů, jednoduše a s příkladem (2–3 věty), a pak polož jednu otázku." },
    { label: "Už jsem o tom slyšel*a.",
      opening: "Žák uvedl, že o tématu už slyšel. Nevykládej zeširoka — jednou větou připomeň podstatu a rovnou polož otázku, kterou ověříš, co si pamatuje." },
    { label: "Už jsem to zkoušel*a.",
      opening: "Žák uvedl, že téma už zná. NEVYSVĚTLUJ úvod ani podstatu. Rovnou začni jednou otevřenou otázkou, kterou ověříš jeho skutečné porozumění — ať téma vysvětlí vlastními slovy nebo ukáže na příkladu." }
  ];
  const pretestOf = (r) => (r && r.pretest === false) ? null
    : (r && Array.isArray(r.pretest) && r.pretest.length ? r.pretest : PRETEST_DEFAULT);

  function pretestBlock(r) {
    const opts = pretestOf(r);
    if (!opts) return "";
    return `<div class="rz-pretest" data-rz-pretest>
      <h2 class="rz-pretest-title g-h4">Co už o tématu víš?</h2>
      <p class="rz-pretest-sub g-p-s">Zvol jednu z následujících možností:</p>
      ${opts.map((o, i) =>
        `<button class="rz-pretest-opt" data-rz-pre="${i}">${esc(o.label)}</button>`).join("")}
    </div>`;
  }

  function renderChat(c, r, opts) {
    // pouzeHlavicka = jen lišta + nadpis + úvod (bez pre-testu, chatu, psaní).
    // Používá se u už splněného Glitche, kam se pak vloží box s vyhodnocením.
    const jenHlavicka = opts && opts.pouzeHlavicka;
    const thread = jenHlavicka ? "" : (r.messages || []).map((m) => {
      if (m.from === "bot") {
        return `<div class="rz-msg rz-msg--bot"><span class="rz-ava rz-ava--bot"><img src="assets/ui/avatar-icon.png" alt="Glitchee"></span>` +
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
        // tlačítko „Odeslat" má jen vícevolbový kvíz; jedna volba se vyhodnotí rovnou (dle Figmy)
        const submit = m.multi ? `<button class="rz-quiz-submit" data-rz-submit>Odeslat odpověď</button>` : "";
        return `<div class="rz-quiz" data-rz-quiz data-multi="${!!m.multi}">${opts}${submit}</div>`;
      }
      return "";
    }).join("");
    // dle Figmy (153:703) nemá chat titulek ani intro — jen lištu a vlákno
    return `
      <header class="rz-bar">
        <button class="rz-close" data-rz-close aria-label="Zavřít"><img src="assets/ui/more-button.svg" alt=""></button>
        ${r.chapter ? `<span class="rz-chapter">${esc(r.chapter)}</span>` : ""}
        ${rzBadges(c)}
      </header>
      <div class="rz-body rz-body--chat">
        ${r.title ? `<h1 class="rz-title g-h2">${esc(r.title)}</h1>` : ""}
        ${r.intro ? `<p class="rz-intro g-p">${esc(r.intro)}</p>` : ""}
        ${jenHlavicka ? "" : pretestBlock(r)}
        <div class="rz-thread" data-rz-thread>${thread}</div>
      </div>
      ${jenHlavicka ? "" : `<form class="rz-input is-hidden" data-rz-form>
        <input class="rz-input-field" type="text" placeholder="Začni psát…" aria-label="Napiš zprávu" autocomplete="off">
        <button class="rz-send" type="submit" aria-label="Odeslat">${SEND_ICO}</button>
      </form>`}`;
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

  // Najde navazující kapitolu téhož questu (stejné téma, další číslo kapitoly).
  function dalsiVQuestu(card) {
    if (!card || card.chapterNo == null || !card.topic) return null;
    for (let i = 0; i < _cardData.length; i++) {
      const c = _cardData[i];
      if (c && c.topic === card.topic && Number(c.chapterNo) === Number(card.chapterNo) + 1) {
        return { index: i, card: c };
      }
    }
    return null;
  }

  // Žlutý box „splněno" + dvě volby (další kapitola / zpět do feedu). Používá se
  // po dokončení konverzace i při znovuotevření už splněného Glitche.
  function hotovoBox(card, shrnuti) {
    const tema = (card.rozklik && card.rozklik.title) || card.title || "tohle téma";
    const box = document.createElement("div");
    box.className = "rz-hotovo";

    // Poslední (aplikační) Glitch questu = projekt → místo „navazující" nabídneme fork.
    const isProject = !!card.project;
    const forked = isProject && typeof window.hasProject === "function" && window.hasProject(card.id);
    const primary = isProject
      ? `<button class="rz-hotovo-btn is-primary" data-rz-fork>${forked ? "Otevřít projekt" : "Forknout do projektu"}</button>`
      : `<button class="rz-hotovo-btn is-primary" data-rz-dalsi>Navazující Glitch</button>`;
    const sub = isProject
      ? "Tímhle Glitchem quest končí. Forkni si ho do projektu a rozpracuj ho v Tvé projekty."
      : "Chceš přejít na další Glitch v questu, nebo se vrátit na Glitchfeed pro další inspiraci?";

    box.innerHTML =
      `<p class="rz-hotovo-text g-p">${esc(shrnuti || ("Vypadá to, že už dobře víš, co je " + tema + "."))}</p>` +
      `<p class="rz-hotovo-sub g-p-s">${sub}</p>` +
      `<div class="rz-hotovo-akce">` + primary +
      `<button class="rz-hotovo-btn" data-rz-feed>Přejít na Glitchfeed</button></div>`;

    const fork = box.querySelector("[data-rz-fork]");
    if (fork) fork.addEventListener("click", () => {
      if (typeof window.createProject === "function") {
        window.createProject({
          glitch_id: card.id, quest_topic: card.topic || "",
          title: card.projectTitle || tema,
          brief: card.projectBrief || ""
        });
      }
      closeRozklik();
      if (typeof window.glitchOpenProfile === "function") window.glitchOpenProfile("board");
    });

    const dalsi = box.querySelector("[data-rz-dalsi]");
    if (dalsi) dalsi.addEventListener("click", () => {
      const n = dalsiVQuestu(card);
      if (n) {
        closeRozklik();
        scrollToIndex(n.index);
        if (n.card.rozklik) setTimeout(() => openRozklik(n.card), 400);
      } else {
        // žádná navazující kapitola → tímhle Glitchem quest končí
        const s = box.querySelector(".rz-hotovo-sub");
        if (s) s.textContent = "Tímhle Glitchem tenhle quest končí — skvělá práce! 🎉 Vrať se na Glitchfeed pro další inspiraci.";
        dalsi.disabled = true;
      }
    });
    box.querySelector("[data-rz-feed]").addEventListener("click", closeRozklik);
    return box;
  }

  let _openCardId = null;    // id právě rozkliknuté karty (kvůli skrytí po splnění)
  function openRozklik(c) {
    if (!c || !c.rozklik) return;
    _openCardId = c.id || null;
    const r = c.rozklik;
    const ov = ensureRzOverlay();
    const panel = ov.querySelector(".rz-panel");

    // Už splněný Glitch (chat) → místo konverzace ukaž jeho vyhodnocení.
    const done = c.id && typeof window.isGlitchDone === "function" && window.isGlitchDone(c.id);
    if (r.kind === "chat" && done) {
      panel.className = "rz-panel rz-panel--chat";
      panel.innerHTML = renderChat(c, r, { pouzeHlavicka: true });
      const zaznam = (window.glitchProgress && window.glitchProgress()[c.id]) || {};
      const body = panel.querySelector(".rz-body--chat");
      const hlaska = zaznam.uroven
        ? (zaznam.shrnuti || "") + " Tohle už máš splněné."
        : (zaznam.shrnuti || "Tohle už máš splněné.");
      body.appendChild(hotovoBox(c, hlaska));
      panel.scrollTop = 0;
      ov.classList.add("is-open");
      document.body.classList.add("rz-lock");
      panel.querySelector("[data-rz-close]").addEventListener("click", closeRozklik);
      return;
    }

    panel.className = "rz-panel rz-panel--" + (r.kind || "explainer");
    panel.innerHTML = (r.kind === "chat") ? renderChat(c, r) : renderExplainer(c, r);
    panel.scrollTop = 0;
    ov.classList.add("is-open");
    document.body.classList.add("rz-lock");

    panel.querySelector("[data-rz-close]").addEventListener("click", closeRozklik);
    if (r.kind === "chat") initRzChat(panel, c);
  }

  // Skryje kartu ve feedu (po splnění), ať se v téže relaci znovu neukazuje.
  // Při dalším načtení ji stejně vyfiltruje doporučovač (podle tg_progress).
  function hideFeedCard(id) {
    if (!id) return;
    Array.prototype.forEach.call(feed.children, (el) => {
      const d = _cardData[el.dataset.index];
      if (d && d.id === id) el.classList.add("is-hidden");
    });
  }

  function closeRozklik() {
    if (!_rzOverlay) return;
    _rzOverlay.classList.remove("is-open");
    document.body.classList.remove("rz-lock");
    // splněný Glitch schovej z feedu hned (ne až po reloadu)
    if (_openCardId && typeof window.isGlitchDone === "function" && window.isGlitchDone(_openCardId)) {
      hideFeedCard(_openCardId);
    }
    _openCardId = null;
  }

  // Otevře rozklik konkrétního Glitche podle id (volá profil — dráhy questů).
  // U splněného ukáže vyhodnocení, u nesplněného konverzaci. Overlay je nad profilem.
  window.glitchOpenGlitch = function (id) {
    if (!id) return;
    const c = _cardData.find((x) => x && x.id === id);
    if (c && c.rozklik) openRozklik(c);
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && _rzOverlay && _rzOverlay.classList.contains("is-open")) closeRozklik();
  });

  /* ---- Chatbot v Glitchi (persona + kontext konkrétní karty) ----
     Personu (systémový prompt vč. bezpečnostních pravidel) skládá SERVER podle
     jejího id — katalog je v Persony/personas.json. Odsud posíláme jen id persony
     a kontext karty, takže bot mluví jen o tomhle Glitchi a pravidla nejdou
     z prohlížeče přepsat. Personu si autor vybere v kartě (pole "persona"). */
  const DEFAULT_PERSONA = "glitchee";
  // Přednastavení podle typu karty (v editoru půjde přepsat polem "persona").
  const PERSONA_BY_TYPE = {
    quest_intro: "glitchee",
    algorithm_demo: "glitchee",
    argument: "argumentacni-partner",
    historicka_osobnost: "historicka-postava",
    spot_the_mistake: "chybujici-chatbot"
  };
  // Pořadí: co je v kartě → přednastavení dle typu → výchozí Glitchee.
  const personaOf = (c) =>
    (c && c.persona) || (c && c.rozklik && c.rozklik.persona) ||
    (c && PERSONA_BY_TYPE[c.type]) || DEFAULT_PERSONA;

  function buildGlitchContext(c) {
    const r = (c && c.rozklik) || {};
    const ctx = {
      tema: c.topic || c.category || "",
      nazev: r.title || c.title || "",
      kapitola: r.chapter || (c.chapterNo != null ? String(c.chapterNo) : ""),
      cil: r.cil || "",
      zadani: r.zadani || "",
      text: r.intro || c.body || ""
    };
    if (Array.isArray(r.messages)) {
      const said = r.messages.filter((m) => m.from === "bot").map((m) => m.text).join(" ");
      if (said) ctx.receno = said;
    }
    return ctx;
  }

  /* Profil žáka pro chatbota: co už v jiných Glitchích zvládl a na jaké úrovni.
     Bere se z žákovy mapy konceptů (tg_mastery). Posílá se jen concept_id + úroveň;
     názvy konceptů dohledá server (má mapu konceptů). Bot to má jen jako kontext,
     aby mohl navázat na známé — ne aby z toho zkoušel. Bez postupu vrací null. */
  function buildZakProfil() {
    const out = {};

    // zvládnuté koncepty (žákova mapa)
    let mastery = {};
    try { if (typeof window.glitchMastery === "function") mastery = window.glitchMastery() || {}; } catch (_) {}
    const ids = Object.keys(mastery);
    if (ids.length) {
      ids.sort((a, b) => new Date(mastery[b].kdy || 0) - new Date(mastery[a].kdy || 0));
      out.zvladnute = ids.slice(0, 15).map((id) => ({ concept_id: id, uroven: mastery[id].uroven }));
      out.pocet = ids.length;
    }

    // osobní údaje (věk, rod) — bot podle nich přizpůsobí jazyk a oslovení
    let user = {};
    try { user = JSON.parse(localStorage.getItem("tg_user") || "{}"); } catch (_) {}
    const osobni = {};
    if (user.age) osobni.vek = user.age;
    if (user.gender) osobni.gender = user.gender;
    if (Object.keys(osobni).length) out.osobni = osobni;

    return Object.keys(out).length ? out : null;
  }

  function rzAppendBot(thread, text) {
    const el = document.createElement("div");
    el.className = "rz-msg rz-msg--bot";
    el.innerHTML = `<span class="rz-ava rz-ava--bot"><img src="assets/ui/avatar-icon.png" alt="Glitchee"></span><div class="rz-bubble"></div>`;
    el.querySelector(".rz-bubble").textContent = text;
    thread.appendChild(el);
    return el;
  }

  /* Usekne z textu koncové otázky (necháme potvrzení/shrnutí). Používá se, když
     Glitch končí — bot často zakončí otázkou, ale konverzace se zavírá, tak ať
     tam nezůstane viset dotaz, na který už žák neodpoví. Vrátí "" = celé otázka. */
  function stripKoncovaOtazka(text) {
    const s = String(text || "").trim();
    if (!s.endsWith("?")) return s;
    const vety = s.match(/[^.!?]+[.!?]+(?:["""')\s]+|$)/g);
    if (!vety || vety.length < 2) return "";
    while (vety.length > 1 && vety[vety.length - 1].trim().endsWith("?")) vety.pop();
    const out = vety.join("").trim();
    return out.endsWith("?") ? "" : out;
  }

  /* ---- Kvíz v chatu (obsah generuje chatbot) ----
     Bot pošle v odpovědi blok ```kviz {"typ":"single|multi","otazka":…,"moznosti":[…]}```.
     Ten z textu vyjmeme a místo něj vykreslíme interaktivní kvíz (single = kolečka
     a vyhodnotí se hned, multi = čtverečky a tlačítko Odeslat odpověď). Výsledek
     pak pošleme botovi zpátky jako zprávu, aby na něj mohl navázat. */
  const KVIZ_RE = /```kviz\s*([\s\S]*?)```/i;

  function extractKviz(text) {
    const m = KVIZ_RE.exec(text || "");
    if (!m) return { text: text, kviz: null };
    let kviz = null;
    try {
      const d = JSON.parse(m[1].trim());
      const moznosti = (d.moznosti || d.options || []).filter((o) => o && (o.text || o.label));
      if (moznosti.length >= 2) {
        kviz = {
          multi: String(d.typ || d.type).toLowerCase() === "multi",
          otazka: d.otazka || d.question || "",
          moznosti: moznosti.map((o) => ({
            text: String(o.text || o.label),
            spravne: !!(o.spravne != null ? o.spravne : o.correct)
          }))
        };
        if (!kviz.moznosti.some((o) => o.spravne)) kviz = null;   // bez správné odpovědi nedává smysl
      }
    } catch (_) {}
    return { text: (text.slice(0, m.index) + text.slice(m.index + m[0].length)).trim(), kviz: kviz };
  }

  function rzAppendKviz(thread, kviz, onAnswer) {
    const type = kviz.multi ? "checkbox" : "radio";
    const wrap = document.createElement("div");
    wrap.className = "rz-quiz";
    wrap.innerHTML =
      (kviz.otazka ? `<p class="rz-quiz-q g-p">${esc(kviz.otazka)}</p>` : "") +
      kviz.moznosti.map((o, i) =>
        `<button class="rz-opt" data-rz-opt="${i}" data-correct="${!!o.spravne}">` +
        `<span class="rz-mark rz-mark--${type}"></span>` +
        `<span class="rz-opt-label">${esc(o.text)}</span></button>`).join("") +
      (kviz.multi ? `<button class="rz-quiz-submit" data-rz-submit>Odeslat odpověď</button>` : "");
    thread.appendChild(wrap);

    const opts = wrap.querySelectorAll(".rz-opt");
    const submit = wrap.querySelector("[data-rz-submit]");
    let done = false;
    const evaluate = () => {
      done = true;
      const zvolil = [], spravne = [];
      opts.forEach((o, i) => {
        const ok = o.dataset.correct === "true";
        const sel = o.classList.contains("is-sel");
        if (ok) { o.classList.add("is-correct"); spravne.push(kviz.moznosti[i].text); }
        if (sel && !ok) o.classList.add("is-wrong");
        if (sel) zvolil.push(kviz.moznosti[i].text);
        o.classList.add("is-locked");
      });
      if (submit) { submit.textContent = "Vyhodnoceno"; submit.disabled = true; }
      const vse = zvolil.length === spravne.length && spravne.every((s) => zvolil.includes(s));
      if (typeof onAnswer === "function") {
        onAnswer(`(Odpověděl jsem v kvízu: ${zvolil.join(", ") || "nic"}. Správně bylo: ` +
                 `${spravne.join(", ")}. ${vse ? "Měl jsem to celé správně." : "Neměl jsem to celé správně."})`, vse);
      }
    };
    opts.forEach((opt) => opt.addEventListener("click", () => {
      if (done) return;
      if (kviz.multi) { opt.classList.toggle("is-sel"); return; }
      opts.forEach((o) => o.classList.toggle("is-sel", o === opt));
      evaluate();                                    // jedna volba se vyhodnotí hned
    }));
    if (submit) submit.addEventListener("click", () => { if (!done) evaluate(); });
    return wrap;
  }

  function initRzChat(panel, card) {
    const form = panel.querySelector("[data-rz-form]");
    const thread = panel.querySelector("[data-rz-thread]");
    if (!form || !thread) return;

    // Historie pro AI: naváž na skriptované bubliny (bot→assistant, uživatel→user)
    const r = (card && card.rozklik) || {};
    const history = (r.messages || [])
      .filter((m) => m.from === "bot" || m.from === "user")
      .map((m) => ({ role: m.from === "bot" ? "assistant" : "user", content: m.text }));
    const scrollDown = () => panel.scrollTo({ top: panel.scrollHeight, behavior: "smooth" });
    const field = form.querySelector(".rz-input-field");
    const sendBtn = form.querySelector(".rz-send");

    // Jedno místo pro dotaz na bota: pošle historii, vykreslí odpověď a případný kvíz.
    // `silent` = zpráva se do vlákna nezobrazí (úvodní pobídka, výsledek kvízu).
    async function ask(text, opts) {
      opts = opts || {};
      if (text) {
        history.push({ role: "user", content: text });
        if (!opts.silent) {
          const um = document.createElement("div");
          um.className = "rz-msg rz-msg--user";
          um.innerHTML = `<div class="rz-bubble"></div><span class="rz-ava rz-ava--user"></span>`;
          um.querySelector(".rz-bubble").textContent = text;
          thread.appendChild(um);
        }
        scrollDown();
      }

      field.disabled = true; if (sendBtn) sendBtn.disabled = true;
      const typing = rzAppendBot(thread, "…");
      typing.classList.add("rz-typing");
      scrollDown();

      try {
        if (typeof window.gptChat !== "function") throw new Error("no-endpoint");
        const reply = await window.gptChat(history, {
          persona: personaOf(card),
          context: buildGlitchContext(card),
          zak: buildZakProfil(),
          temperature: opts.temperature || 0.3
        });
        typing.remove();
        history.push({ role: "assistant", content: reply });

        const parsed = extractKviz(reply);
        if (parsed.text) rzAppendBot(thread, parsed.text);
        if (parsed.kviz) {
          // odpověď z kvízu pošleme botovi zpět (neviditelně), ať na ni naváže
          // Kvíz sám o sobě Glitch NEuzavírá — po odpovědi se pošle hodnocení
          // (kritéria z mapy konceptů) a teprve když žák cíl splnil, Glitch končí.
          rzAppendKviz(thread, parsed.kviz, (vysledek, vse) => {
            kvizProslo = true; kvizSpravne = vse;
            ask(vysledek, { silent: true }).then(() => vyhodnot());
          });
        }
      } catch (err) {
        typing.remove();
        const fb = opts.fallback || "Teď se mi nepovedlo odpovědět. Zkus to prosím za chvilku.";
        rzAppendBot(thread, fb);
      } finally {
        field.disabled = false; if (sendBtn) sendBtn.disabled = false;
        scrollDown();
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = (field.value || "").trim();
      if (!text) return;
      field.value = "";
      // Po každé další zprávě (když už proběhl kvíz) zkusíme znovu vyhodnotit —
      // porozumění se často doloží až v konverzaci PO kvízu, ne hned u něj.
      ask(text).then(() => { field.focus(); vyhodnot(); });
    });

    /* Vyhodnocení Glitche. Glitch se uzavírá až tady — ne odpovědí na kvíz.
       Hodnotitel (api/evaluate) posoudí konverzaci proti kritériím konceptu;
       teprve když žák cíl splnil, Glitch se označí za hotový a nabídne se
       další krok (navazující Glitch v questu / zpět do feedu). */
    let hodnoceno = false;      // už splněno a zobrazena nabídka
    let hodnotiSe = false;      // právě běží jedno vyhodnocení (ať se nepřekrývají)
    let kvizProslo = false;     // proběhl aspoň jeden kvíz (jinak nevyhodnocujeme)
    let kvizSpravne = false;    // výsledek posledního kvízu
    async function vyhodnot() {
      if (hodnoceno || hodnotiSe || !kvizProslo || !card || !card.id) return;
      if (typeof window.gptEvaluate !== "function") return;
      hodnotiSe = true;
      let v;
      try {
        v = await window.gptEvaluate(history, {
          conceptId: card.concept_id,
          context: buildGlitchContext(card),
          kviz: { spravne: !!kvizSpravne }
        });
      } finally { hodnotiSe = false; }
      if (!v || !v.splneno || hodnoceno) return;
      hodnoceno = true;
      if (typeof window.markGlitchDone === "function") {
        window.markGlitchDone(card.id, {
          typ: card.type, concept_id: card.concept_id,
          uroven: v.uroven || null, shrnuti: v.shrnuti || ""
        });
      }
      zobrazHotovo(v);
    }

    // Nabídka po splnění: shrnutí + dvě volby, kam dál.
    function zobrazHotovo(v) {
      // bot možná zakončil otázkou, ale Glitch končí → z poslední bubliny ji sundáme
      const bubliny = thread.querySelectorAll(".rz-msg--bot .rz-bubble");
      const last = bubliny[bubliny.length - 1];
      if (last) {
        const orez = stripKoncovaOtazka(last.textContent);
        if (!orez) { const msg = last.closest(".rz-msg--bot"); if (msg) msg.remove(); }
        else last.textContent = orez;
      }
      const box = hotovoBox(card, v.shrnuti);
      thread.appendChild(box);
      form.classList.add("is-hidden");                 // konverzace uzavřená
      scrollDown();
    }

    // Úvod: bot sám zahájí. Jak přesně, řídí `opening` z pre-testu (viz PRETEST_DEFAULT).
    // Bez pre-testu se použije bezpečný výchozí (krátký úvod + otázka).
    function greet(opening) {
      return ask(
        "(Žák právě otevřel tenhle Glitch a zatím nic nenapsal. Viděl jen krátký úvodní text karty. " +
        (opening || "O tématu nemusí vědět nic — uveď ho krátce do tématu vlastními slovy a pak polož jednu otázku.") +
        ")",
        { silent: true, temperature: 0.5, fallback: r.intro || "Ahoj! Zeptej se mě na cokoli k tomuhle Glitchi." }
      );
    }

    // Pre-test: dokud si žák nezvolí úroveň, chat i psaní čekají.
    const pretest = panel.querySelector("[data-rz-pretest]");
    const pretestOpts = pretestOf(r);
    if (pretest && pretestOpts) {
      const btns = pretest.querySelectorAll("[data-rz-pre]");
      let picked = false;
      btns.forEach((btn) => btn.addEventListener("click", () => {
        if (picked) return;
        picked = true;
        btn.classList.add("is-sel");                       // zvolená se vysvítí žlutě
        btns.forEach((b) => { b.disabled = true; if (b !== btn) b.classList.add("is-dim"); });
        form.classList.remove("is-hidden");                // objeví se pole pro psaní
        const zvoleno = pretestOpts[Number(btn.dataset.rzPre)] || {};
        greet(zvoleno.opening || zvoleno.level);       // .level = zpětná kompatibilita
      }));
    } else {
      form.classList.remove("is-hidden");
      if (history.length === 0) greet();
    }
  }

})();
