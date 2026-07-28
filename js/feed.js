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
    // Na žluté úvodní kartě je žlutá šipka neviditelná → bílý podklad s černou outline.
    const src = c && c.type === "welcome" ? "assets/ui/more-button-light.svg" : "assets/ui/more-button.svg";
    return `<button class="nav-chevron" data-nav="${act}" aria-label="${lbl}"><img src="${src}" alt="" width="38" height="59"></button>`;
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
        <span class="pixel-deco" style="top:82.5%;left:18.9%;width:12px;height:13px">${ICON.spark}</span>
        <img class="welcome-logo" src="${LOGO}" alt="Glitch">
        <h1 class="fx-block g-h1 welcome-h" style="top:60%">Vítej v Glitchi!</h1>
        <p class="fx-block g-p welcome-sub" style="top:70%">Chceš vědět, jak to tady chodí? Klikni na šipku vpravo dole, nebo swipni dolů pro další Glitch.</p>
        ${chevron(c)}`;
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
        : c.image
          ? `<div class="quest-bg" style="background-image:url('${c.image}');background-size:cover;background-position:center"></div>`
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
      // ── PEVNÁ PRAVIDLA ROZLOŽENÍ (dle Figmy, viz docs/karta-rychla-vyzva.md) ──
      // Pozice prvků jsou VŽDY stejné, mění se jen jejich obsah a (v editoru)
      // zvolený styl fontu u každého textu:
      //   NADPIS (nahoře, y≈216) → POPIS: scénář + otázka (hned pod nadpisem)
      //   → VIZUÁL: obrazec/obrázek/kód (vystředěný v prázdném prostoru, nepovinný)
      //   → ODPOVĚDI (ukotvené dole).
      // Když je vizuál, otázka (sub) se čte jako popisek těsně nad tlačítky.
      //
      // Styl fontu je u KAŽDÉHO textu volitelný (h1/h3/h4/p). Výchozí hodnoty
      // odpovídají návrhu; editor je později přepíše přes *Style pole v datech.
      const st = (v, def) => "g-" + (["h1", "h3", "h4", "p"].indexOf(v) >= 0 ? v : def);

      // Odpovědi: dlouhé věty → textová tlačítka přes celou šířku (text vlevo);
      // krátké → kompaktní tlačítka na střed (mřížka / řada / sloupec).
      const answers = c.answers || [];
      const longAns = answers.some((a) => String((a && a.label) || a).length > 20);
      const optStyle = st(c.answerStyle, longAns ? "p" : "h4");
      const optCls = "quiz-opt " + (longAns ? "quiz-opt--text " : "") + optStyle;
      const opts = answers.map((a, i) =>
        `<button class="${optCls}" data-quiz="${i}" data-correct="${!!a.correct}">${esc(a.label)}</button>`).join("");
      const cols = longAns ? "cols-1v" : (c.figure === "triangles" ? "cols-3" : ("cols-" + (c.cols || 2)));

      // NADPIS (velký text výzvy) — výchozí styl H3, krátké příklady „310×15=" H1.
      const qCls = st(c.questionStyle, "h3");

      // VIZUÁL (nepovinný prostřední prvek) — POUZE obrazec / obrázek / kód.
      // Textový úkol (taskText) je PROZA a patří do popisu nahoře, ne doprostřed.
      let visual = "";
      if (c.figure === "triangles") visual = `<div class="quiz-figure-wrap">${triangleFigure()}</div>`;
      else if (c.image) visual = `<div class="quiz-image"><img src="${esc(c.image.src || c.image)}" alt="${esc(c.image.alt || "")}"></div>`;
      else if (c.code) visual = `<pre class="quiz-code">${esc(c.code)}</pre>`;
      const hasVisual = !!visual;

      // POPIS: scénář (taskText) + otázka (sub).
      const desc = c.taskText ? `<p class="quiz-desc ${st(c.taskStyle, "p")}">${esc(c.taskText)}</p>` : "";
      const sub = c.sub ? `<p class="quiz-sub ${st(c.subStyle, "p")}">${esc(c.sub)}</p>` : "";

      // UMÍSTĚNÍ podle typu odpovědí:
      //  • krátké odpovědi → střed karty je volný: vizuál se vystředí (quiz-task),
      //    otázka se čte jako popisek nad tlačítky (quiz-caption);
      //  • dlouhé (textové) odpovědi → spodek patří tlačítkům, takže veškerý
      //    kontext (popis, vizuál i otázka) je kompaktně nahoře a prázdný prostor
      //    zůstává mezi ním a tlačítky.
      const topVisual = longAns && hasVisual ? `<div class="quiz-visual-top">${visual}</div>` : "";
      return `${badges(c)}
        <div class="quiz-frame">
          <div class="quiz-head">
            <div class="${qCls}">${esc(c.question)}</div>
            ${desc}
            ${topVisual}
            ${longAns || !hasVisual ? sub : ""}
          </div>
          <div class="quiz-task">${longAns ? "" : visual}</div>
          ${!longAns && hasVisual && sub ? `<div class="quiz-caption">${sub}</div>` : ""}
          <div class="quiz-answers"><div class="quiz-options ${cols}">${opts}</div></div>
        </div>`;
    },

    attention_game(c) {
      // data-driven: víc aktivit sdílí stejnou strukturu (nadpis, návod, počítadlo, koule)
      const help = c.help || "Tažením otáčíš kouli. Díry označíš ťuknutím. Ale pozor: označit lze jen díry, které jsou vpředu.";
      // Počítadlo: buď jednořádkové (countLabel/countInit + N/total), nebo víc
      // řádků přes pole `counters` [{label, init, field}] — field = které pole
      // zprávy z hry se do řádku propisuje (např. "correct" / "wrong").
      const counters = Array.isArray(c.counters) && c.counters.length
        ? c.counters
        : [{ label: c.countLabel || "Označených děr", init: c.countInit || "0/0" }];
      // víc řádků počítadla těsně pod sebou (jeden blok, přirozené řádkování)
      const countTop = counters.length > 1 ? 39 : 41;
      const countLines =
        `<div class="fx-block atten-count" style="top:${countTop}%;pointer-events:none">` +
        counters.map((ct) =>
          `<p class="g-p atten-count-line">${esc(ct.label)}: <span data-atten-count${ct.field ? ` data-count-field="${esc(ct.field)}"` : ""}>${esc(ct.init)}</span></p>`
        ).join("") +
        `</div>`;
      return `${badges(c)}
        <h3 class="fx-block g-h3" style="top:17.4%">${esc(c.title)}</h3>
        <p class="fx-block g-p atten-help" style="top:27%">${esc(help)}</p>
        ${countLines}
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
      const media = c.viz
        ? vizFrame(c.viz)
        : c.image
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
      // Rozvržení dle Figmy (92:229): ilustrace maskota vlevo nahoře (~42 %
      // šířky), hlavní tvrzení (H2) níž, instrukce pod ním, tlačítka volby dole.
      const media = c.viz
        ? vizFrame(c.viz)
        : c.image
          ? `<img src="${c.image}" alt="">`
          : `<div class="asset-missing">ilustrace<br>(doplnit)</div>`;
      return `${badges(c)}
        <div class="arg-illus" style="top:17%">${media}</div>
        <div class="fx-block arg-text" style="top:48%">
          <h2 class="arg-claim g-h2">${esc(c.claim)}</h2>
          <p class="arg-sub g-p">${esc(c.sub)}</p>
        </div>
        <div class="arg-actions">
          <button class="arg-opt" data-arg="agree">Souhlasím</button>
          <button class="arg-opt" data-arg="disagree">Nesouhlasím</button>
        </div>`;
    },

    asmr(c) {
      // Wellbeing hravá aktivita: nadpis + návod nahoře, interaktivní animace
      // (světelná stopa) přes celou plochu karty. Bez počítadla, bez dokončení
      // (jako dech/nálada — může se objevit klidně znovu).
      return `${badges(c)}
        <h1 class="fx-block g-h1 asmr-txt" style="top:13%">${esc(c.title)}</h1>
        <p class="fx-block g-p asmr-txt" style="top:20.5%">${esc(c.help || "")}</p>
        <div class="asmr-viz"><iframe class="viz-frame asmr-frame" data-viz-src="${c.viz}" title="${esc(c.title)}"></iframe></div>`;
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
    },

    inspirace(c) {
      // Wellbeing „Inspirace": nadpis + text nahoře, ukázková vizualizace přes
      // celou plochu a dole vstupní pole. Žák napíše nápady → otevře se detail
      // (chat s Glitchee o tom, co vizualizovat, a případné založení projektu).
      return `${badges(c)}
        <h2 class="fx-block g-h2 insp-txt" style="top:12.5%">${esc(c.title)}</h2>
        <p class="fx-block g-p insp-txt" style="top:19%">${esc(c.body || "")}</p>
        <div class="insp-viz">${c.viz
          ? `<iframe class="viz-frame insp-frame" data-viz-src="${c.viz}" title="${esc(c.title)}"></iframe>`
          : c.image
            ? `<img class="insp-img" src="${c.image}" alt="" style="width:100%;aspect-ratio:1/1;object-fit:cover;display:block">`
            : ""}</div>
        <form class="insp-form" data-insp-form>
          <input class="insp-input" type="text" placeholder="Začni psát…" aria-label="Napiš své nápady na vizualizaci" autocomplete="off">
          <button class="insp-send" type="submit" aria-label="Odeslat">${SEND_ICO}</button>
        </form>`;
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
      <g stroke="#1A1A1A" stroke-width="1">
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
    asmr: "black", inspirace: "black",
    quick_challenge: "pink", spot_the_mistake: "black", fun_fact: "black",
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
    _topicMode = null; hideTopicBanner();
    renderList(ordered);
  }

  // Vykreslení konkrétního (už seřazeného) seznamu karet do feedu.
  function renderList(ordered) {
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

  /* ---- Feed filtrovaný na jedno téma (z lupy v profilu) ----
     Základní Glitche (quest_intro) v pořadí kapitol, mezi ně se prokládají
     doplňkové Glitche stejného konceptu (max 2), zbytek se přidá za ně.
     Čistě wellbeing/systémové karty se sem neberou. */
  let _topicMode = null;
  const TOPIC_FEED_SKIP = new Set(["mood_selector", "breathing", "daily_summary", "welcome", "time_to_let_go"]);
  const isBasicCard = (c) => c && (c.type === "quest_intro" || c.chapterNo != null);
  function interleaveTopic(cards) {
    const basics = cards.filter(isBasicCard).sort((a, b) => Number(a.chapterNo || 0) - Number(b.chapterNo || 0));
    const supp = cards.filter((c) => !isBasicCard(c));
    if (!basics.length) return supp;
    const used = new Set();
    const out = [];
    basics.forEach((b) => {
      out.push(b);
      let cnt = 0;
      supp.forEach((s) => {
        if (used.has(s) || cnt >= 2) return;
        if (s.concept_id && b.concept_id && s.concept_id === b.concept_id) { out.push(s); used.add(s); cnt++; }
      });
    });
    supp.forEach((s) => { if (!used.has(s)) out.push(s); });   // zbytek doplňkových za páteř
    return out;
  }
  function openTopicFeed(topic) {
    if (!_catalog || !topic) return;
    const cards = _catalog.filter((c) => c && c.topic === topic && !TOPIC_FEED_SKIP.has(c.type));
    if (!cards.length) return;
    _topicMode = topic;
    renderList(interleaveTopic(cards));
    showTopicBanner(topic);
    if (typeof window.glitchCloseProfile === "function") window.glitchCloseProfile();
    try { feed.scrollTo({ top: 0 }); } catch (_) {}
  }
  function exitTopicFeed() {
    if (!_catalog) return;
    buildCards(_catalog);
    try { feed.scrollTo({ top: 0 }); } catch (_) {}
  }
  function showTopicBanner(topic) {
    let b = document.getElementById("topic-banner");
    if (!b) {
      b = document.createElement("div"); b.id = "topic-banner"; b.className = "topic-banner";
      document.body.appendChild(b);
      b.addEventListener("click", exitTopicFeed);
    }
    b.innerHTML = '<span class="topic-banner-label"><img src="assets/ui/search-icon.svg" alt="">' + esc(topic) +
      '</span><span class="topic-banner-back">Zpět na feed ✕</span>';
    b.hidden = false;
    document.body.classList.add("has-topic-banner");
  }
  function hideTopicBanner() {
    const b = document.getElementById("topic-banner"); if (b) b.hidden = true;
    document.body.classList.remove("has-topic-banner");
  }
  window.glitchOpenTopicFeed = openTopicFeed;

  // reakce na přihlášení (welcomeCard se doplní po sestavení)
  if (typeof sb !== "undefined" && sb && sb.auth && typeof sb.auth.onAuthStateChange === "function") {
    // Supabase přeposílá SIGNED_IN / TOKEN_REFRESHED při KAŽDÉM návratu do okna
    // (refokus, obnovení tokenu). Reagujeme jen na SKUTEČNOU změnu stavu
    // přihlášení — jinak by feed při každém přepnutí okna skočil na úvodní Glitch.
    let _prevLoggedIn = null;
    sb.auth.onAuthStateChange((_event, session) => {
      const loggedIn = !!(session && session.user);
      if (loggedIn === _prevLoggedIn) return;         // stav se nezměnil → nic nedělej
      const bylPrihlaseny = _prevLoggedIn;
      _prevLoggedIn = loggedIn;
      applyWelcomeVisibility(loggedIn);
      // scroll na začátek jen při skutečném přihlášení (odhlášen → přihlášen),
      // ne při prvním načtení stránky ani při refokusu
      if (loggedIn && bylPrihlaseny === false) { try { feed.scrollTo({ top: 0 }); } catch (_) {} }
    });
  }

  // Data-driven: katalog z glitches/feed.json (zdroj pravdy). Fallback = vestavěný CARDS.
  (async function loadAndBuild() {
    let catalog = CARDS;
    try {
      const res = await fetch("glitches/feed.json?v=46", { cache: "no-cache" });
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
    // menu Glitche (tři tečky) — otevři/zavři, případně proveď akci
    const mItem = e.target.closest(".card-menu-item");
    if (mItem) {
      const card = mItem.closest(".card");
      const c = card && _cardData[card.dataset.index];
      if (c) {
        if (mItem.dataset.menu === "save") {
          if (typeof window.saveGlitch === "function") window.saveGlitch({ id: c.id, topic: c.topic || "", title: (c.rozklik && c.rozklik.title) || c.title || c.question || "", type: c.type });
          toast("Uloženo do profilu 💾");
        } else if (mItem.dataset.menu === "report") {
          reportFlow({ id: c.id, type: c.type, topic: c.topic || "" });
        }
      }
      closeCardMenus();
      return;
    }
    const mBtn = e.target.closest(".card-menu-btn");
    if (mBtn) {
      const pop = mBtn.parentElement.querySelector(".card-menu-pop");
      const willOpen = pop && pop.hidden;
      closeCardMenus();
      if (pop) pop.hidden = !willOpen;
      return;
    }
    closeCardMenus();                                        // klik jinam → zavři menu

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

  /* ---- Udržení pozice ve feedu při návratu do okna ----
     scroll-snap (mandatory) občas při refokusu / přemalování okna resetuje
     scroll na začátek → feed „skočí na úvodní Glitch". Zapamatujeme si právě
     zobrazenou kartu a po návratu (focus / viditelnost / bfcache) ji vrátíme. */
  let _snapIndex = 0, _snapT = null;
  feed.addEventListener("scroll", () => {
    clearTimeout(_snapT);
    _snapT = setTimeout(() => { _snapIndex = currentIndex(); }, 120);
  }, { passive: true });

  function restoreSnap() {
    if (_snapIndex <= 0) return;
    const target = feed.children[_snapIndex];
    if (!target || !target.offsetParent) return;      // karta zmizela / skrytá
    if (Math.abs(feed.scrollTop - target.offsetTop) <= 4) return;   // pozice sedí
    const prev = feed.style.scrollBehavior;
    feed.style.scrollBehavior = "auto";
    feed.scrollTop = target.offsetTop;
    feed.style.scrollBehavior = prev;
  }
  // návrat do okna (přepnutí aplikace), přepnutí záložky i obnovení z bfcache;
  // dvakrát — hned a po dokreslení, kdyby se scroll resetoval až s reflow iframů
  function onRefocus() { restoreSnap(); requestAnimationFrame(restoreSnap); setTimeout(restoreSnap, 180); }
  window.addEventListener("focus", onRefocus);
  window.addEventListener("pageshow", onRefocus);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) onRefocus(); });

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
      if (tab === "feed") { if (_topicMode) exitTopicFeed(); else scrollToIndex(0); setActiveTab(item); return; }
      // Questy a Projekty otevřou profil na příslušném tabu
      if (tab === "questy" && typeof window.glitchOpenProfile === "function") { window.glitchOpenProfile("quests"); return; }
      if (tab === "projekty" && typeof window.glitchOpenProfile === "function") { window.glitchOpenProfile("board"); return; }
      if (tab === "create" && typeof window.glitchOpenCreate === "function") { window.glitchOpenCreate(); return; }
      toast("Připravujeme 🚧");
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
  window.glitchToast = toast;

  /* ---- Nahlášení nevhodného obsahu ----
     Tok: klik na „Nahlásit" → přihlášený uživatel dostane modál s důvodem,
     nepřihlášený nejdřív přihlašovací okno (a po přihlášení přes Google se mu
     modál otevře rovnou — záměr si držíme v sessionStorage, viz auth.js boot). */
  function reportFlow(info) {
    const loggedIn = (typeof sbCurrentUser !== "undefined" && sbCurrentUser);
    if (loggedIn) { openReportModal(info); return; }
    if (typeof window.glitchOpenLogin === "function") {
      window.glitchOpenLogin({
        sub: "Pokud chceš nahlásit nevhodný obsah, nejprve je třeba se přihlásit.",
        beforeGoogle: () => { try { sessionStorage.setItem("tg_pending_report", JSON.stringify(info)); } catch (_) {} }
      });
    } else {
      toast("Nahlašovat lze až po přihlášení.");
    }
  }

  function openReportModal(info) {
    closeReportModal();
    const ov = document.createElement("div");
    ov.id = "report-overlay";
    ov.className = "report-overlay";
    ov.innerHTML =
      '<div class="report-modal" role="dialog" aria-modal="true" aria-label="Nahlášení nevhodného obsahu">' +
        '<button class="report-close" data-report-close aria-label="Zavřít"><img src="assets/ui/Exit.svg" alt=""></button>' +
        '<h2 class="report-title g-h4">Nahlášení nevhodného obsahu</h2>' +
        '<p class="report-sub g-p">Prosím, napiš nám, proč ti obsah připadá nevhodný.</p>' +
        '<textarea class="report-input" placeholder="Začni psát sem…" rows="5" aria-label="Důvod nahlášení"></textarea>' +
        '<button class="report-send" type="button" data-report-send>Odeslat</button>' +
      '</div>';
    document.body.appendChild(ov);
    document.body.classList.add("rz-lock");
    const field = ov.querySelector(".report-input");
    const sendBtn = ov.querySelector("[data-report-send]");
    ov.addEventListener("mousedown", (e) => { if (e.target === ov) closeReportModal(); });
    ov.querySelector("[data-report-close]").addEventListener("click", closeReportModal);
    setTimeout(() => { if (field) field.focus(); }, 60);

    sendBtn.addEventListener("click", async () => {
      const reason = (field.value || "").trim();
      sendBtn.disabled = true;
      let res = { ok: false };
      try {
        if (typeof sbReportGlitch === "function") res = await sbReportGlitch(info, reason);
      } catch (_) {}
      closeReportModal();
      toast(res && res.ok
        ? "Díky, obsah jsme nahlásili k prověření."
        : "Nahlášení se teď nepovedlo uložit. Zkus to prosím znovu.");
    });
  }

  function closeReportModal() {
    const ov = document.getElementById("report-overlay");
    if (ov) ov.remove();
    // zámek scrollu drž jen když není otevřený jiný overlay (rozklik)
    if (!(_rzOverlay && _rzOverlay.classList.contains("is-open"))) document.body.classList.remove("rz-lock");
  }
  // volá auth.js po přihlášení přes Google (nedokončené nahlášení)
  window.glitchOpenReportModal = openReportModal;
  // obecné nahlášení (z ⋮ menu v profilu)
  window.glitchReportFlow = reportFlow;

  /* ==========================================================================
     Interakce jednotlivých karet
     ========================================================================== */
  // Menu Glitche (tři tečky vpravo nahoře) — na každém Glitchi.
  // Výjimka: úvodní „welcome" karta (má vlastní layout a smysl ji nedává).
  const MENU_SKIP = new Set(["welcome"]);
  function cardMenu() {
    return `<div class="card-menu" data-card-menu>
        <button class="card-menu-btn" aria-label="Menu Glitche" aria-haspopup="true"><span class="card-menu-ic"></span></button>
        <div class="card-menu-pop" hidden>
          <button class="card-menu-item" data-menu="save">Uložit Glitch</button>
          <button class="card-menu-item" data-menu="report">Nahlásit nevhodný obsah</button>
        </div>
      </div>`;
  }
  function closeCardMenus() {
    feed.querySelectorAll(".card-menu-pop:not([hidden])").forEach((p) => { p.hidden = true; });
  }

  // Statistika zobrazení: každou kartu zaloguj jednou za relaci, když je aspoň
  // z 60 % vidět. Jen přihlášený uživatel (sbLogEvent tiše degraduje).
  let _viewObserver = null;
  const _viewed = new Set();
  function initCardView(el, c) {
    if (!c || c._preview || !c.id || typeof sbLogEvent !== "function" || !("IntersectionObserver" in window)) return;
    if (!_viewObserver) {
      _viewObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.dataset.gid;
          if (id && !_viewed.has(id)) { _viewed.add(id); sbLogEvent("view", id); }
          _viewObserver.unobserve(e.target);
        });
      }, { root: feed, threshold: 0.6 });
    }
    el.dataset.gid = c.id;
    _viewObserver.observe(el);
  }

  function initCard(el, c) {
    initCardView(el, c);
    if (!MENU_SKIP.has(c.type)) el.insertAdjacentHTML("beforeend", cardMenu());
    if (c.type === "breathing") initBreathing(el, c);
    if (c.type === "mood_selector") initMood(el);
    if (c.type === "quick_challenge") initQuiz(el, c);
    if (c.type === "argument") { initArgument(el, c); initVizFrame(el); }
    if (c.type === "historicka_osobnost") initPersona(el);
    if (c.type === "attention_game") initAttention(el, c);
    if (c.type === "algorithm_demo") initVizFrame(el);
    if (c.type === "fun_fact") initVizFrame(el);            // fun fact může mít animaci (viz) místo obrázku
    if (c.type === "spot_the_mistake") initVizFrame(el);    // i „najdi chybu" může mít animaci místo fotky
    if (c.type === "asmr") initVizFrame(el);                // ASMR: interaktivní světelná stopa přes celou kartu
    if (c.type === "inspirace") { initVizFrame(el); initInspirace(el, c); }
    if (c.type === "quest_intro") initQuestVideo(el);
    // úvodní karta: šipka otevře detail (řeší globální handler data-nav),
    // swipe posune na další Glitch. Přihlášení je v profilu (spodní menu).
  }

  // Inspirace: vstupní pole na kartě → po odeslání otevři detail (chat) a pošli
  // zadaný text jako první zprávu žáka (viz seed v initRzChat).
  function initInspirace(el, c) {
    const form = el.querySelector("[data-insp-form]");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const field = form.querySelector(".insp-input");
      const text = ((field && field.value) || "").trim();
      if (!text) return;
      c._seed = text;                 // první zpráva žáka do chatu
      if (field) field.value = "";
      openRozklik(c);
    });
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
    const countEls = el.querySelectorAll("[data-atten-count]");
    const iframe = el.querySelector(".atten-frame");

    // aktualizace počítadel: řádek s data-count-field ukazuje dané pole zprávy
    // (např. correct/wrong jako prosté číslo), jinak jednořádkové N/total.
    const updateCounts = (d) => {
      const n = [d.hit, d.found, d.correct, d.answered].find((v) => v != null);
      countEls.forEach((elc) => {
        const f = elc.getAttribute("data-count-field");
        if (f) { if (d[f] != null) elc.textContent = String(d[f]); }
        else if (n != null && d.total != null) elc.textContent = n + "/" + d.total;
      });
    };

    lazyLoadIframe(iframe);            // spolehlivé načtení koule (jako u ostatních animací)

    const post = (type) => {
      try { iframe && iframe.contentWindow && iframe.contentWindow.postMessage({ ns: NS, type }, "*"); } catch (_) {}
    };

    // po načtení iframu si vyžádáme aktuální skóre (u koule s dírami celkový počet)
    if (iframe) iframe.addEventListener("load", () => post("sync"));

    // příjem skóre z aktivity. Různé hry posílají různá pole a různě signalizují
    // konec:
    //   • koule (díry / slova): posílá jen "score" průběžně (hit / found), hotovo
    //     = nasbíral vše (n >= total);
    //   • kolo slov: posílá "progress" (answered) během hry a "score" (correct)
    //     až po zodpovězení všech → samotná zpráva "score" znamená konec.
    let hotovo = false;
    let prubezna = false;               // viděli jsme "progress" → hra hlásí konec zvlášť
    window.addEventListener("message", (ev) => {
      if (iframe && ev.source !== iframe.contentWindow) return;
      const d = ev.data || {};
      if (d.ns !== NS) return;
      if (d.type !== "score" && d.type !== "progress") return;
      const n = [d.hit, d.found, d.correct, d.answered].find((v) => v != null);
      updateCounts(d);

      if (d.type === "progress") { prubezna = true; return; }

      // splněno: hra hlásící průběh (kolo) je hotová samotnou zprávou "score";
      // hra počítající průběžně (koule) až po dosažení total. Wellbeingové aktivity
      // (c.replayable) se ZÁMĚRNĚ nezaznamenávají — mají se občas objevovat znovu.
      const dokonceno = prubezna || (d.total > 0 && n != null && n >= d.total);
      if (!hotovo && !c.replayable && dokonceno && c && c.id) {
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
      try { if (c && c.id && typeof sbLogEvent === "function") sbLogEvent("interact", c.id, { kind: "kviz", correct: correct }); } catch (_) {}
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
  function initArgument(el, c) {
    const opts = el.querySelectorAll(".arg-opt");
    opts.forEach((btn) => btn.addEventListener("click", () => {
      opts.forEach((b) => b.classList.toggle("is-sel", b === btn));
      if (!c || !c.rozklik) return;
      // zapamatuj zvolený postoj → persona (argumentacni-partner) podle něj zahájí
      c._postoj = btn.dataset.arg === "agree" ? "souhlas" : "nesouhlas";
      openRozklik(c);
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

  // šipka sekce: žluté kolečko se šipkou (po rozbalení se otočí dolů)
  const SEC_ARROW = '<img src="assets/ui/open-icon.svg?v=1" alt="" width="18" height="18">';

  function renderExplainer(c, r) {
    const paras = (r.paragraphs || []).map((p) => `<p class="rz-para g-p">${esc(p)}</p>`).join("");
    const outro = r.outro ? `<p class="rz-para rz-outro g-p">${esc(r.outro)}</p>` : "";
    const sections = (r.sections || []).map((s) => {
      const content = (Array.isArray(s.content) ? s.content : [s.content || ""])
        .map((p) => `<p class="rz-para g-p">${esc(p)}</p>`).join("");
      return `<section class="rz-sec" data-rz-sec>
        <button class="rz-sec-head" data-rz-sec-toggle>
          <span class="rz-sec-ico">${SEC_ARROW}</span>
          <p class="rz-sec-title g-p">${esc(s.title)}</p>
        </button>
        ${s.summary ? `<p class="rz-sec-summary g-p">${esc(s.summary)}</p>` : ""}
        <div class="rz-sec-content">${content}</div>
      </section>`;
    }).join("");
    const secWrap = sections ? `<div class="rz-sections">${sections}</div>` : "";
    // štítek (např. „O Glitchi") sedí vlevo hned vedle šipky zpět
    const badge = r.badge ? `<span class="rz-badge">${esc(r.badge)}</span>` : "";
    // Přihlášení Google účtem — dole pod rozjížďítky (dřív bývalo na žluté welcome kartě)
    const login = r.login ? `
      <div class="rz-login">
        <button class="rz-login-btn" data-rz-login type="button">
          ${GOOGLE_ICON}<span>Přihlásit se Google účtem</span>
        </button>
      </div>` : "";
    return `
      <header class="rz-bar rz-bar--left">
        <button class="rz-close" data-rz-close aria-label="Zavřít"><img src="assets/ui/more-button.svg" alt=""></button>
        ${badge || rzBadges(c)}
      </header>
      <div class="rz-body rz-body--explainer">
        <h1 class="rz-title g-h3">${esc(r.title)}</h1>
        ${paras}
        ${outro}
        ${secWrap}
        ${login}
      </div>`;
  }
  const GOOGLE_ICON = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16 4 9.1 8.6 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34.9 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.1 39.3 16 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.4 36 44 30.5 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>';

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
    const ava = botAva(c);
    const thread = jenHlavicka ? "" : (r.messages || []).map((m) => {
      if (m.from === "bot") {
        return `<div class="rz-msg rz-msg--bot"><span class="rz-ava rz-ava--bot"><img src="${esc(ava)}" alt="Chatbot"></span>` +
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
        ${(r.title || c.title || c.claim) ? `<h1 class="rz-title g-h2">${esc(r.title || c.title || c.claim)}</h1>` : ""}
        ${(c.type !== "spot_the_mistake" && (r.intro || c.body)) ? `<p class="rz-intro g-p">${esc(r.intro || c.body)}</p>` : ""}
        ${(function () { const img = r.image || (c.type === "fun_fact" ? c.image : ""); return img ? `<div class="rz-photo"><img src="${esc(img)}" alt=""></div>` : ""; })()}
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
    try { if (c.id && typeof sbLogEvent === "function") sbLogEvent("interact", c.id, { kind: "rozklik" }); } catch (_) {}
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
    // rozbalování sekcí (harmonika) u úvodního vysvětlení
    panel.querySelectorAll("[data-rz-sec-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sec = btn.closest("[data-rz-sec]");
        if (sec) sec.classList.toggle("is-open");
      });
    });
    // Přihlášení Google účtem (dole v O Glitchi)
    const loginBtn = panel.querySelector("[data-rz-login]");
    if (loginBtn) loginBtn.addEventListener("click", async () => {
      try { if (typeof sbSignInWithGoogle === "function") await sbSignInWithGoogle(); }
      catch (_) { if (typeof toast === "function") toast("Přihlášení se nezdařilo."); }
    });
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

  /* ---- Volný chat (veřejný profil / seznamy sledování) ----
     Stejný overlay jako rozklik, ale bez pre-testu, kvízu a vyhodnocení — jen
     svobodná konverzace s personou (výchozí Glitchee). Kvíz je vypnutý (quiz:false),
     takže server nic nezkouší; nahoře je disclaimer, že jde o chatbota. */
  function openFreeChat(entity) {
    entity = entity || {};
    const name = entity.name || "Glitchee";
    const persona = entity.persona || "glitchee-chat";
    const ava = entity.avatar || DEFAULT_AVA;
    const disclaimer = entity.disclaimer || (name + " je chatbot, nemá emoce a může dělat chyby.");
    const ov = ensureRzOverlay();
    const panel = ov.querySelector(".rz-panel");
    panel.className = "rz-panel rz-panel--chat rz-panel--free";
    // disclaimer je POD polem pro psaní (dle návrhu)
    panel.innerHTML = `
      <header class="rz-bar">
        <button class="rz-close" data-rz-close aria-label="Zavřít"><img src="assets/ui/more-button.svg" alt=""></button>
        <div class="rz-badges"><span class="rz-badge">Chat</span><span class="rz-badge">${esc(name)}</span></div>
      </header>
      <div class="rz-body rz-body--chat">
        <div class="rz-thread" data-rz-thread></div>
      </div>
      <form class="rz-input" data-rz-form>
        <input class="rz-input-field" type="text" placeholder="Začni psát…" aria-label="Napiš zprávu" autocomplete="off">
        <button class="rz-send" type="submit" aria-label="Odeslat">${SEND_ICO}</button>
      </form>
      <p class="rz-disclaimer g-p-s">${esc(disclaimer)}</p>`;
    panel.scrollTop = 0;
    ov.classList.add("is-open");
    document.body.classList.add("rz-lock");
    panel.querySelector("[data-rz-close]").addEventListener("click", closeRozklik);
    initFreeChat(panel, { persona: persona, ava: ava, greeting: entity.greeting });
  }

  // Id session pro logy chatu (jedna konverzace = jeden řádek, průběžně přepisovaný).
  function newSessionId() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (_) {}
    return "s-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }
  function logChat(sessionId, info) {
    try { if (typeof sbLogChat === "function") sbLogChat(sessionId, info); } catch (_) {}
  }

  function initFreeChat(panel, o) {
    const form = panel.querySelector("[data-rz-form]");
    const thread = panel.querySelector("[data-rz-thread]");
    if (!form || !thread) return;
    const ava = o.ava || DEFAULT_AVA;
    const history = [];
    const sessionId = newSessionId();
    const field = form.querySelector(".rz-input-field");
    const sendBtn = form.querySelector(".rz-send");
    const scrollDown = () => panel.scrollTo({ top: panel.scrollHeight, behavior: "smooth" });

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
      const typing = rzAppendBot(thread, "…", ava);
      typing.classList.add("rz-typing");
      scrollDown();
      try {
        if (typeof window.gptChat !== "function") throw new Error("no-endpoint");
        const reply = await window.gptChat(history, {
          persona: o.persona, freechat: true, temperature: 0.5,
          zak: buildZakProfil()   // věk, rod, zvládnuté koncepty → Glitchee ví, s kým mluví
        });
        typing.remove();
        history.push({ role: "assistant", content: reply });
        if (reply) rzAppendBot(thread, reply, ava);
      } catch (err) {
        typing.remove();
        rzAppendBot(thread, "Teď se mi nepovedlo odpovědět. Zkus to prosím za chvilku.", ava);
      } finally {
        field.disabled = false; if (sendBtn) sendBtn.disabled = false;
        scrollDown();
        logChat(sessionId, { kind: "free", persona: o.persona, messages: history });   // log (jen pro testování)
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = (field.value || "").trim();
      if (!text) return;
      field.value = "";
      ask(text).then(() => field.focus());
    });

    // úvodní pozdrav (neviditelná pobídka → bot zahájí)
    ask(o.greeting ||
      "(Uživatel právě otevřel volný chat s tebou ze svého profilu. Není to konkrétní Glitch, " +
      "ale obecný chat. Krátce a přátelsky ho pozdrav, řekni, že se tě může zeptat na cokoliv " +
      "kolem informatiky, dat, AI nebo Glitche, a polož jednu otevřenou otázku, s čím může začít.)",
      { silent: true });
  }
  window.glitchChatWith = openFreeChat;

  // Otevře rozklik konkrétního Glitche podle id (volá profil — dráhy questů).
  // U splněného ukáže vyhodnocení, u nesplněného konverzaci. Overlay je nad profilem.
  window.glitchOpenGlitch = function (id) {
    if (!id) return;
    const c = _cardData.find((x) => x && x.id === id);
    if (c && c.rozklik) openRozklik(c);
  };

  // Náhled libovolné karty (mimo feed) — pro tvorbu Glitche i pro Glitchposty.
  // Vrátí plně inicializovaný element karty; kartu zaregistruje do _cardData,
  // aby fungoval proklik šipkou (rozklik). `card._preview` vypne logování zobrazení.
  window.glitchPreviewCard = function (card) {
    if (!card) return null;
    card._preview = true;
    const idx = _cardData.length;
    _cardData.push(card);
    const el = document.createElement("section");
    el.className = "card card--" + (BG[card.type] || "dark");
    el.dataset.index = idx;
    el.dataset.type = card.type;
    el.innerHTML = (RENDER[card.type] || ((c) => `<div class="card-body">${esc(c.type)}</div>`))(card);
    initCard(el, card);
    return el;
  };
  // Otevře rozklik konkrétní karty (objekt, ne id) — používá náhled tvorby.
  window.glitchOpenRozklik = function (card) { if (card && card.rozklik) openRozklik(card); };

  // Přejde na ÚVODNÍ kartu Glitche ve feedu (ne do rozkliku/detailu) — volá quest.
  // Když karta ve feedu je, odscrolluje na ni; když ne (dokončená → odfiltrovaná
  // doporučovačem), vloží ji nahoru a odscrolluje.
  window.glitchGoToCard = function (id) {
    if (!id) return;
    if (typeof window.glitchCloseProfile === "function") window.glitchCloseProfile();
    if (_topicMode) exitTopicFeed();
    for (let i = 0; i < feed.children.length; i++) {
      const el = feed.children[i];
      const d = _cardData[el.dataset.index];
      if (d && d.id === id) { el.classList.remove("is-hidden"); el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    }
    const c = (_catalog || []).find((x) => x && x.id === id);
    if (!c) return;
    const idx = _cardData.length; _cardData.push(c);
    const el = document.createElement("section");
    el.className = "card card--" + (BG[c.type] || "dark");
    el.dataset.index = idx; el.dataset.type = c.type;
    el.innerHTML = (RENDER[c.type] || (() => `<div class="card-body">${esc(c.type)}</div>`))(c);
    feed.insertBefore(el, feed.firstChild);
    initCard(el, c);
    el.scrollIntoView({ behavior: "auto", block: "start" });
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
    spot_the_mistake: "detektiv-chyb"
  };
  // Pořadí: co je v kartě → přednastavení dle typu → výchozí Glitchee.
  const personaOf = (c) =>
    (c && c.persona) || (c && c.rozklik && c.rozklik.persona) ||
    (c && PERSONA_BY_TYPE[c.type]) || DEFAULT_PERSONA;

  // Avatar bota v chatu: u Historické osobnosti fotka dané postavy, jinak
  // Glitchee (nebo explicitní rozklik.avatar).
  const DEFAULT_AVA = "assets/ui/avatar-icon.png";
  function botAva(c) {
    const r = (c && c.rozklik) || {};
    if (r.avatar) return r.avatar;
    if (c && c.type === "historicka_osobnost" && c.image) return c.image;
    return DEFAULT_AVA;
  }

  function buildGlitchContext(c) {
    const r = (c && c.rozklik) || {};
    const ctx = {
      // U Historické osobnosti je „téma" pro personu SAMA POSTAVA (koho má hrát),
      // ne kategorie — persona historicka-postava podle toho ví, koho hraje.
      tema: c.type === "historicka_osobnost" ? (r.title || c.title || "") : (c.topic || c.category || ""),
      nazev: r.title || c.title || c.claim || "",
      kapitola: r.chapter || (c.chapterNo != null ? String(c.chapterNo) : ""),
      cil: r.cil || "",
      zadani: r.zadani || "",
      // U „Najdi chybu" vidí žák tvrzení i doprovodný text — persona (Detektiv chyb)
      // musí mít celý text, ve kterém jsou schválně chyby, ne jen titulek.
      text: c.type === "spot_the_mistake"
        ? [c.claim, c.context].filter(Boolean).join("\n")
        : (r.intro || c.body || c.claim || "")
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

  function rzAppendBot(thread, text, avaSrc) {
    const el = document.createElement("div");
    el.className = "rz-msg rz-msg--bot";
    el.innerHTML = `<span class="rz-ava rz-ava--bot"><img src="${esc(avaSrc || DEFAULT_AVA)}" alt="Chatbot"></span><div class="rz-bubble"></div>`;
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

  /* ---- Projekt z chatu (Inspirace) ----
     Bot ukončí zprávu blokem ```projekt {"nazev":…,"popis":…}``` = pokyn aplikaci
     založit projekt. Blok z textu vyjmeme (žák ho nevidí) a předáme dál. */
  const PROJEKT_RE = /```projekt\s*([\s\S]*?)```/i;
  function extractProjekt(text) {
    const m = PROJEKT_RE.exec(text || "");
    if (!m) return { text: text, projekt: null };
    let projekt = {};
    try { projekt = JSON.parse(m[1].trim()) || {}; } catch (_) { projekt = {}; }
    return { text: (text.slice(0, m.index) + text.slice(m.index + m[0].length)).trim(), projekt: projekt };
  }

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
    const ava = botAva(card);

    // Historie pro AI: naváž na skriptované bubliny (bot→assistant, uživatel→user)
    const r = (card && card.rozklik) || {};
    const history = (r.messages || [])
      .filter((m) => m.from === "bot" || m.from === "user")
      .map((m) => ({ role: m.from === "bot" ? "assistant" : "user", content: m.text }));
    const scrollDown = () => panel.scrollTo({ top: panel.scrollHeight, behavior: "smooth" });
    const field = form.querySelector(".rz-input-field");
    const sendBtn = form.querySelector(".rz-send");
    const sessionId = newSessionId();   // log konverzace (jen pro testování)

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
      const typing = rzAppendBot(thread, "…", ava);
      typing.classList.add("rz-typing");
      scrollDown();

      try {
        if (typeof window.gptChat !== "function") throw new Error("no-endpoint");
        const reply = await window.gptChat(history, {
          persona: personaOf(card),
          context: buildGlitchContext(card),
          zak: buildZakProfil(),
          temperature: opts.temperature || 0.3,
          // Inspirace není o zkoušení — místo kvízu vzniká projekt.
          quiz: card.type === "inspirace" ? false : undefined
        });
        typing.remove();
        history.push({ role: "assistant", content: reply });

        // Inspirace: bot může ukončit zprávu blokem ```projekt {…}``` = pokyn
        // aplikaci založit projekt. Ten se do vlákna nevypisuje.
        const parsedP = extractProjekt(reply);
        const parsed = extractKviz(parsedP.text);
        if (parsed.text) rzAppendBot(thread, parsed.text, ava);
        if (parsedP.projekt && card.type === "inspirace") zalozProjekt(parsedP.projekt);
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
        rzAppendBot(thread, fb, ava);
      } finally {
        field.disabled = false; if (sendBtn) sendBtn.disabled = false;
        scrollDown();
        logChat(sessionId, { kind: "glitch", persona: personaOf(card), glitchId: card && card.id, messages: history });
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
      if (history.length === 0) {
        // Inspirace: žák napsal nápady na kartě → pošli je jako první zprávu.
        if (card.type === "inspirace" && card._seed) {
          const seed = card._seed; card._seed = null;
          ask(seed);
        } else {
          greet(argOpening(card) || mistakeOpening(card));
        }
      }
    }

    // Inspirace: založení projektu z pokynu bota (```projekt {nazev, popis}```).
    let projektHotovo = false;
    function zalozProjekt(p) {
      if (projektHotovo) return;
      projektHotovo = true;
      let created = null;
      try {
        if (typeof window.createProject === "function") {
          created = window.createProject({
            glitch_id: (card.id || "inspirace") + "-" + Date.now().toString(36),
            quest_topic: card.topic || "Data",
            title: (p && p.nazev) || card.title || "Vizualizace dat",
            brief: (p && p.popis) || ""
          });
        }
      } catch (_) {}
      const box = document.createElement("div");
      box.className = "rz-hotovo";
      box.innerHTML =
        `<p class="rz-hotovo-text g-p">Založil jsem ti projekt „${esc((p && p.nazev) || "Vizualizace dat")}“.</p>` +
        `<p class="rz-hotovo-sub g-p-s">Najdeš ho v profilu v sekci Tvé projekty, kde na něm můžeš dál pracovat.</p>` +
        `<div class="rz-hotovo-akce">` +
        `<button class="rz-hotovo-btn is-primary" data-insp-open>Otevřít Tvé projekty</button>` +
        `<button class="rz-hotovo-btn" data-rz-feed>Přejít na Glitchfeed</button></div>`;
      box.querySelector("[data-insp-open]").addEventListener("click", () => {
        closeRozklik();
        if (typeof window.glitchOpenProfile === "function") window.glitchOpenProfile("board");
      });
      box.querySelector("[data-rz-feed]").addEventListener("click", closeRozklik);
      thread.appendChild(box);
      form.classList.add("is-hidden");
      scrollDown();
    }

    // U Argumentuj persona zahájí podle zvoleného postoje (souhlas / nesouhlas).
    function argOpening(c) {
      if (!c || c.type !== "argument") return undefined;
      const postoj = c._postoj === "nesouhlas" ? "NESOUHLASÍ" : "SOUHLASÍ";
      return "Žák si u tohohle tvrzení zvolil, že s ním " + postoj + ". Nevysvětluj mu téma. " +
        "Krátce potvrď jeho volbu a vyzvi ho, ať ti svůj postoj obhájí — polož mu k tomu jednu otevřenou otázku.";
    }

    // U „Najdi chybu" persona nevysvětluje téma — pobídne žáka hledat chybu v textu karty.
    function mistakeOpening(c) {
      if (!c || c.type !== "spot_the_mistake") return undefined;
      return "Tohle je Glitch typu Najdi chybu. V textu karty (máš ho v ZADÁNÍ) jsou schválně chyby. " +
        "Nevysvětluj téma a neprozrazuj, kde chyby jsou ani kolik jich je. Krátce žáka pobídni, ať se na " +
        "text podívá kriticky, a polož mu jednu otázku, jestli v něm nějakou chybu vidí.";
    }
  }

})();
