/* ==========================================================================
   Glitch — Feed engine
   Vertikální swipe feed celoobrazovkových Glitch karet.
   Datový model viz glitches/glith-content-type.md
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Pixel ikony ---------- */
  const ICON = {
    // Chevron „další Glitch" (pixelová šipka vpravo)
    chevron:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="#000">' +
      '<rect x="6" y="3" width="4" height="4"/><rect x="10" y="7" width="4" height="4"/>' +
      '<rect x="14" y="11" width="4" height="4"/><rect x="10" y="15" width="4" height="4"/>' +
      '<rect x="6" y="19" width="4" height="4"/></g></svg>',
    // Maskot (pixelová tvář) — potvrzení / pokračování
    mascot:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="#000">' +
      '<rect x="5" y="8" width="3" height="4"/><rect x="16" y="8" width="3" height="4"/>' +
      '<rect x="8" y="14" width="2" height="2"/><rect x="10" y="16" width="2" height="2"/>' +
      '<rect x="12" y="16" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/>' +
      '</g></svg>',
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

    { type: "mood_selector", category: "Wellbeing",
      title: "Jak se teď cítíš?",
      body: "Umísti potažením černou tečku na správné místo v diagramu. My podle toho upravíme Glitche, které se ti dnes zobrazí." },

    { type: "breathing", category: "Wellbeing",
      title: "Dechové cvičení",
      body: "Rovnoměrné vědomé dýchání ti může pomoci zlepšit soustředění.",
      cycles: 7 },

    { type: "quest_intro", category: "Vibe Coding", chapterNo: 1,
      title: "Vibe Coding",
      body: "Vibe Coding je programování v přirozeném jazyce. Zjisti, jak vznikl a jak to celé funguje." },

    { type: "quick_challenge", category: "Rychlá výzva",
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

  const badge = (c) => c.category ? `<div class="badge">${esc(c.category)}</div>` : "";
  const bottombar = () => `<div class="card-bottombar"></div>`;
  const chevron = () => `<button class="nav-chevron" data-nav="next" aria-label="Další Glitch">${ICON.chevron}</button>`;
  const mascot  = () => `<button class="nav-mascot" data-nav="next" aria-label="Pokračovat">${ICON.mascot}</button>`;
  const chapter = (n) => n != null ? `<span class="chapter-no">${esc(n)}</span>` : "";
  const deco = (cls, style) => `<span class="pixel-deco ${cls}" style="${style}">${ICON.plus}</span>`;

  const RENDER = {

    welcome(c) {
      return `
        <span class="pixel-deco" style="top:11%;right:16%;width:15px;height:15px">${ICON.spark}</span>
        ${deco("", "top:52%;left:22%;width:13px;height:13px")}
        ${deco("", "top:59%;left:55%;width:13px;height:13px")}
        <div class="welcome-logo-wrap"><img class="welcome-logo" src="${LOGO}" alt="Glitch"></div>
        <div class="card-body welcome-body">
          <h1 class="card-title g-h1">Vítej v Glitchi!</h1>
          <p class="card-lead g-p">Chceš vědět, jak to tady chodí? Klikni na šipku vpravo dole nebo swipni dolů pro další Glitch.</p>
        </div>
        ${chevron()}${bottombar()}`;
    },

    mood_selector(c) {
      return `${badge(c)}
        <div class="card-body breath-body">
          <h1 class="card-title g-h1 text-center">${esc(c.title)}</h1>
          <p class="card-lead g-p text-center" style="max-width:32ch">${esc(c.body)}</p>
          ${moodDiagram()}
        </div>
        ${mascot()}${bottombar()}`;
    },

    breathing(c) {
      return `${badge(c)}
        <div class="card-body breath-body">
          <h1 class="card-title g-h1 text-center">${esc(c.title)}</h1>
          <p class="card-lead g-p text-center" style="max-width:30ch">${esc(c.body)}</p>
          <div class="breath-counter">
            <button class="breath-step" data-breath="dec" aria-label="Méně">−</button>
            <div class="breath-value" data-breath="value">0/${c.cycles}</div>
            <button class="breath-step" data-breath="inc" aria-label="Více">+</button>
          </div>
          <div class="breath-circle" data-breath="circle">${c.cycles}</div>
          <p class="breath-hint g-p-s">Pohodlně se usaď a stiskni tlačítko začít.</p>
          <button class="breath-cta" data-breath="start">Začít</button>
        </div>
        ${mascot()}${bottombar()}`;
    },

    quest_intro(c) {
      return `<div class="quest-bg"></div>${badge(c)}
        <div class="card-body quest-body">
          ${chapter(c.chapterNo)}
          <h1 class="card-title g-h1">${esc(c.title)}</h1>
          <p class="card-lead g-p">${esc(c.body)}</p>
        </div>
        ${chevron()}${bottombar()}`;
    },

    quick_challenge(c) {
      const q = c.questionStyle === "h3" ? "g-h3" : "g-h1";
      const fig = c.figure === "triangles" ? triangleFigure() : "";
      const opts = c.answers.map((a, i) =>
        `<button class="quiz-opt" data-quiz="${i}" data-correct="${!!a.correct}">${esc(a.label)}</button>`).join("");
      return `${badge(c)}
        <div class="card-body">
          ${timerRow()}
          ${fig}
          <div class="quiz-prompt">
            <div class="${q}">${esc(c.question)}</div>
            ${c.sub ? `<p class="quiz-sub g-p-s">${esc(c.sub)}</p>` : ""}
          </div>
          <div class="quiz-options cols-${c.cols || 2}">${opts}</div>
        </div>
        ${bottombar()}`;
    },

    attention_game(c) {
      return `${badge(c)}
        <div class="card-body">
          ${timerRow()}
          <h1 class="card-title g-h1" style="margin-top:8px">${esc(c.title)}</h1>
          <div class="algo-viz" style="flex:1;margin-top:18px">${vizFrame(c.viz)}</div>
        </div>
        ${mascot()}${bottombar()}`;
    },

    algorithm_demo(c) {
      return `${badge(c)}
        <div class="card-body algo-body">
          <div class="algo-viz">${vizFrame(c.viz)}</div>
          <div class="algo-text">
            ${chapter(c.chapterNo)}
            <h1 class="card-title g-h1">${esc(c.title)}</h1>
            <p class="card-lead g-p">${esc(c.body)}</p>
          </div>
        </div>
        ${chevron()}${bottombar()}`;
    },

    fun_fact(c) {
      return `${badge(c)}
        <div class="card-body funfact-body">
          <div class="funfact-tile"><div class="asset-missing">ilustrace<br>(doplnit)</div></div>
          <h3 class="card-title g-h3" style="font-weight:700">${esc(c.title)}</h3>
          <p class="card-lead g-p-s">${esc(c.body)}</p>
        </div>
        ${chevron()}${bottombar()}`;
    },

    spot_the_mistake(c) {
      return `${badge(c)}
        <div class="card-body mistake-body">
          <div class="mistake-photo"><div class="asset-missing">fotografie<br>(doplnit)</div></div>
          <h3 class="mistake-claim g-h3">${esc(c.claim)}</h3>
          <p class="mistake-context g-p-s">${esc(c.context)}</p>
        </div>
        ${chevron()}${bottombar()}`;
    },

    daily_summary(c) {
      const rows = c.stats.map((s) =>
        `<div class="summary-row"><span>${esc(s.label)}</span><span class="summary-row-val">${esc(s.value)}</span></div>`).join("");
      return `${badge(c)}
        <span class="pixel-deco" style="top:8%;left:26%;width:15px;height:15px">${ICON.spark}</span>
        ${deco("", "top:27%;left:14%;width:13px;height:13px")}
        ${deco("", "top:32%;left:64%;width:13px;height:13px")}
        <div class="summary-mascot-wrap">
          <div style="width:150px;height:106px;overflow:hidden">
            <img src="${LOGO}" alt="" style="width:150px;height:auto">
          </div>
        </div>
        <div class="card-body summary-body">
          <h3 class="summary-title g-h3" style="font-weight:700">Tvé shrnutí pro dnešek</h3>
          <div class="summary-stats">${rows}</div>
          <button class="summary-link">Zobrazit dlouhodobé statistiky</button>
          <p class="summary-outro g-p">Každý den ti zobrazíme maximálně 20 Glitchů. Sociální sítě by neměly brát příliš tvé pozornosti.<br><br>Těšíme se na tebe třeba zítra!</p>
        </div>
        ${chevron()}${bottombar()}`;
    }
  };

  /* ---------- Dílčí komponenty ---------- */
  function vizFrame(src) {
    return `<iframe class="viz-frame" src="${src}" loading="lazy" title="Vizualizace"
              style="width:100%;height:100%;aspect-ratio:1/1"></iframe>`;
  }

  function timerRow() {
    return `<div class="timer-row">
      <button class="timer-toggle" data-timer aria-label="Zapnout časovač"></button>
      <p class="timer-note g-p-s">Pokud chceš, můžeš si zapnout časovač. Stačí kliknout na kolečko.</p>
    </div>`;
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
    welcome: "white", mood_selector: "white", daily_summary: "white",
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

  /* ==========================================================================
     Interakce jednotlivých karet
     ========================================================================== */
  function initCard(el, c) {
    if (c.type === "breathing") initBreathing(el, c);
    if (c.type === "mood_selector") initMood(el);
    if (c.type === "quick_challenge") initQuiz(el);
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

})();
