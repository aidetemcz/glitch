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
     Data karet (Fáze 1 — reprezentativní vzorek všech vizuálních rodin)
     ========================================================================== */
  const CARDS = [
    { type: "welcome" },

    { type: "intro" },

    { type: "mood_selector", category: "Wellbeing",
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
      question: "310×15=",
      sub: "Zvládneš spočítat do časového limitu?",
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

    { type: "attention_game", category: "Hra na pozornost",
      title: "Kolik zvládneš označit děr v časovém limitu?",
      viz: "assets/3Dvizualizations/sphere-holes.html" },

    { type: "algorithm_demo", category: "Algoritmus", chapterNo: 5,
      title: "Hra života",
      body: "Hra života je ukázka algoritmu s pár jednoduchými pravidly. Ta určují, které buňky přežijí, které zaniknou a kde vznikne nová. Dokážeš pravidla popsat?",
      viz: "assets/3Dvizualizations/game-of-life.html" },

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

  const badges = (c) => c.category
    ? `<div class="badges"><span class="badge trust">${esc(c.trust || "Core")}</span><span class="badge cat">${esc(c.category)}</span></div>`
    : "";
  const chevron = () => `<button class="nav-chevron" data-nav="next" aria-label="Další Glitch"><img src="assets/ui/more-button.svg" alt="" width="40" height="62"></button>`;
  const mascot  = () => `<button class="nav-mascot" data-nav="next" aria-label="Pokračovat"><img src="assets/ui/scroll-down.svg" alt="" width="56" height="56"></button>`;
  const chapter = (n) => n != null ? `<span class="chapter-no">${esc(n)}</span>` : "";
  const deco = (cls, style) => `<span class="pixel-deco ${cls}" style="${style}">${ICON.plus}</span>`;

  const RENDER = {

    welcome(c) {
      return `
        <span class="pixel-deco" style="top:12%;right:16%;width:16px;height:16px">${ICON.spark}</span>
        ${deco("", "top:53%;left:19%;width:13px;height:13px")}
        ${deco("", "top:59%;left:53%;width:10px;height:10px")}
        <span class="pixel-deco" style="top:69%;left:34%;width:15px;height:15px">${ICON.spark}</span>
        <img class="welcome-logo" src="${LOGO}" alt="Glitch">
        <img class="welcome-tiny" src="assets/ui/tiny-logo-pixelized.svg" alt="Tiny">`;
    },

    intro(c) {
      return `
        <span class="pixel-deco" style="top:12%;right:16%;width:15px;height:15px">${ICON.spark}</span>
        ${deco("", "top:52%;left:22%;width:13px;height:13px")}
        ${deco("", "top:59%;left:55%;width:13px;height:13px")}
        <img class="intro-logo" src="${LOGO}" alt="Glitch">
        <div class="fx-block" style="top:71.6%">
          <h1 class="fx-title g-h1">Vítej v Glitchi!</h1>
          <p class="fx-text g-p">Chceš vědět, jak to tady chodí? Klikni na šipku vpravo dole nebo swipni dolů pro další Glitch.</p>
        </div>
        ${chevron()}`;
    },

    mood_selector(c) {
      return `${badges(c)}
        <h1 class="fx-block g-h1 text-center" style="top:14.4%">${esc(c.title)}</h1>
        <p class="fx-block g-p text-center" style="top:21.5%">${esc(c.body)}</p>
        <div class="mood-wrap">${moodDiagram()}</div>
        ${mascot()}`;
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
          <div class="breath-circle" data-breath="circle">${c.cycles}</div>
          <p class="breath-hint g-p-s">Pohodlně se usaď a stiskni tlačítko začít.</p>
          <button class="breath-cta" data-breath="start">Začít</button>
        </div>
        ${mascot()}`;
    },

    quest_intro(c) {
      const bg = c.video
        ? `<video class="quest-video" autoplay muted loop playsinline preload="auto"><source src="${c.video}" type="video/mp4"></video><div class="quest-scrim"></div>`
        : `<div class="quest-bg"></div>`;
      return `${bg}${badges(c)}
        <div class="fx-block quest-text" style="top:65%">
          ${chapter(c.chapterNo)}
          <h1 class="fx-title g-h1">${esc(c.title)}</h1>
          <p class="fx-text g-p">${esc(c.body)}</p>
        </div>
        ${chevron()}`;
    },

    quick_challenge(c) {
      const opts = c.answers.map((a, i) =>
        `<button class="quiz-opt" data-quiz="${i}" data-correct="${!!a.correct}">${esc(a.label)}</button>`).join("");
      if (c.figure === "triangles") {
        return `${badges(c)}
          <div class="fx-center" style="top:37.4%">${triangleFigure()}</div>
          <div class="fx-block g-h3" style="top:61.1%">${esc(c.question)}</div>
          <div class="quiz-options cols-3 fx-options" style="top:84.2%">${opts}</div>`;
      }
      return `${badges(c)}
        <div class="timer-row fx-block" style="top:15.5%">
          <button class="timer-toggle" data-timer aria-label="Zapnout časovač"></button>
          <p class="timer-note g-p-s">Pokud chceš, můžeš si zapnout časovač. Stačí kliknout na kolečko.</p>
        </div>
        <div class="fx-block" style="top:51%">
          <div class="g-h1">${esc(c.question)}</div>
          ${c.sub ? `<p class="quiz-sub g-p-s">${esc(c.sub)}</p>` : ""}
        </div>
        <div class="quiz-options cols-2 fx-options" style="top:70.5%">${opts}</div>`;
    },

    attention_game(c) {
      return `${badges(c)}
        <h3 class="fx-block g-h3" style="top:28.9%">${esc(c.title)}</h3>
        <div class="algo-viz fx-media" style="top:34.5%">${vizFrame(c.viz)}</div>
        ${mascot()}`;
    },

    algorithm_demo(c) {
      return `${badges(c)}
        <div class="algo-viz fx-media" style="top:11.7%">${vizFrame(c.viz)}</div>
        <div class="fx-block algo-text" style="top:65%">
          ${chapter(c.chapterNo)}
          <h1 class="fx-title g-h1">${esc(c.title)}</h1>
          <p class="fx-text g-p">${esc(c.body)}</p>
        </div>
        ${chevron()}`;
    },

    fun_fact(c) {
      return `${badges(c)}
        <div class="funfact-tile fx-media" style="top:11.6%"><div class="asset-missing">ilustrace<br>(doplnit)</div></div>
        <div class="fx-block" style="top:53.3%">
          <h3 class="fx-title g-h3">${esc(c.title)}</h3>
          <p class="fx-text g-p-s">${esc(c.body)}</p>
        </div>
        ${chevron()}`;
    },

    spot_the_mistake(c) {
      return `${badges(c)}
        <div class="mistake-photo fx-media" style="top:11.6%"><div class="asset-missing">fotografie<br>(doplnit)</div></div>
        <div class="fx-block" style="top:64.3%">
          <h3 class="fx-title mistake-claim g-h3">${esc(c.claim)}</h3>
          <p class="fx-text mistake-context g-p-s">${esc(c.context)}</p>
        </div>
        ${chevron()}`;
    },

    argument(c) {
      return `${badges(c)}
        <h2 class="arg-claim">${esc(c.claim)}</h2>
        <p class="arg-sub">${esc(c.sub)}</p>
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
        <p class="summary-outro fx-block g-p" style="top:76.3%">Každý den ti zobrazíme maximálně 20 Glitchů. Sociální sítě by neměly brát příliš tvé pozornosti.<br><br>Těšíme se na tebe třeba zítra!</p>
        ${chevron()}`;
    }
  };

  /* ---------- Dílčí komponenty ---------- */
  function vizFrame(src) {
    return `<iframe class="viz-frame" src="${src}" loading="lazy" title="Vizualizace"
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
    quest_intro: "image"
  };

  CARDS.forEach((c, i) => {
    const el = document.createElement("section");
    el.className = "card card--" + (BG[c.type] || "dark");
    el.dataset.index = i;
    el.dataset.type = c.type;
    el.innerHTML = (RENDER[c.type] || (() => `<div class="card-body">${esc(c.type)}</div>`))(c);
    feed.appendChild(el);
    initCard(el, c);
  });

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
    return Math.round(feed.scrollTop / feed.clientHeight);
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
    // úvodní splash: ťuknutí kamkoli posune na další Glitch (swipe funguje taky)
    if (c.type === "welcome") el.addEventListener("click", () => nextFrom(el));
    // opt-in časovač (vizuální přepínač; plná logika ve Fázi 3)
    el.querySelectorAll("[data-timer]").forEach((b) =>
      b.addEventListener("click", () => b.classList.toggle("is-on")));
  }

  /* ---- Dechové cvičení ---- */
  function initBreathing(el, c) {
    let target = c.cycles;
    let running = false;
    const valueEl  = el.querySelector("[data-breath='value']");
    const circleEl = el.querySelector("[data-breath='circle']");
    const draw = () => { valueEl.textContent = "0/" + target; if (!running) circleEl.textContent = target; };

    el.querySelector("[data-breath='dec']").addEventListener("click", () => { if (!running && target > 1) { target--; draw(); } });
    el.querySelector("[data-breath='inc']").addEventListener("click", () => { if (!running && target < 12) { target++; draw(); } });

    el.querySelector("[data-breath='start']").addEventListener("click", async () => {
      if (running) return;
      running = true;
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let n = 1; n <= target; n++) {
        valueEl.textContent = n + "/" + target;
        circleEl.textContent = "Nádech";
        circleEl.style.transform = "scale(1.34)";
        await wait(4000);
        circleEl.textContent = "Zadrž";
        await wait(1500);
        circleEl.textContent = "Výdech";
        circleEl.style.transform = "scale(1)";
        await wait(4000);
      }
      circleEl.textContent = "Hotovo";
      running = false;
    });
  }

  /* ---- Mood selector (tažení tečky) ---- */
  function initMood(el) {
    const svg = el.querySelector("[data-mood]");
    const dot = el.querySelector("[data-mood-dot]");
    const BOUND = { x0: 44, x1: 318, y0: 300, y1: 34 };
    let dragging = false;

    const toSvg = (evt) => {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };
    const move = (evt) => {
      if (!dragging) return;
      const p = toSvg(evt);
      const x = Math.max(BOUND.x0, Math.min(BOUND.x1, p.x));
      const y = Math.max(BOUND.y1, Math.min(BOUND.y0, p.y));
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      window.__glitchMood = {
        focus:  Math.round(((x - BOUND.x0) / (BOUND.x1 - BOUND.x0)) * 100),
        energy: Math.round(((BOUND.y0 - y) / (BOUND.y0 - BOUND.y1)) * 100)
      };
    };
    dot.addEventListener("pointerdown", (e) => { dragging = true; dot.setPointerCapture(e.pointerId); });
    svg.addEventListener("pointermove", move);
    window.addEventListener("pointerup", () => { dragging = false; });
    // umožni i tap kamkoli do diagramu
    svg.addEventListener("pointerdown", (e) => { dragging = true; move(e); });
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

  /* ---- Argumentuj ---- */
  function initArgument(el) {
    const opts = el.querySelectorAll(".arg-opt");
    opts.forEach((btn) => btn.addEventListener("click", () => {
      opts.forEach((b) => b.classList.toggle("is-sel", b === btn));
      // TODO: otevřít chat s Tinybotem (zatím není hotový)
      toast("Chat s Tinybotem — připravujeme 🚧");
    }));
  }

})();
