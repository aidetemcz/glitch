// Serverová proxy k OpenAI. Klíč zůstává na serveru (Vercel env: OPENAI_API_KEY)
// a do prohlížeče se nikdy nepošle. Frontend volá POST /api/chat (název pryč od „gpt" kvůli blokovačům reklam).
//
// Systémový prompt (persona) se skládá TADY na serveru — ne v prohlížeči.
// Důvod: persony obsahují bezpečnostní pravidla pro práci s dětmi a ta nesmí jít
// z klienta přepsat. Frontend posílá jen id persony + kontext Glitche.
//
// Tělo požadavku (JSON):
//   {
//     "persona": "glitchee",              // id z Persony/personas.json (volitelné)
//     "context": { "tema": "...", "nazev": "...", "cil": "...", "zadani": "..." },
//     "messages": [{ "role": "user", "content": "..." }],
//     "model": "gpt-4o-mini", "temperature": 0.3
//   }
// Odpověď:
//   { "text": "..." }  nebo  { "error": "..." }

const CATALOG = require("../Persony/personas.json");
const CONCEPTS = require("../knowledge-map/concepts.json");   // pro překlad concept_id → název

// Úrovně zvládnutí (Bloomova taxonomie) → čitelný český popisek do promptu.
const UROVEN_LABEL = {
  zapamatovani: "zapamatování",
  porozumeni: "porozumění",
  aplikace: "aplikace",
  analyza: "analýza",
  hodnoceni: "hodnocení",
  tvorba: "tvorba",
};

// Modely jdou přenastavit přes Vercel env proměnné BEZ zásahu do kódu — důležité,
// když OpenAI starší model ukončí (deprecated). Stačí ve Vercelu nastavit
// OPENAI_MODEL (např. na aktuální model účtu) a redeploynout.
const MODEL_MAIN = process.env.OPENAI_MODEL || "gpt-4o-mini";        // hlavní konverzace
const MODEL_VISION = process.env.OPENAI_MODEL_VISION || "gpt-4o";    // když jsou obrázky
const MODEL_HELPER = process.env.OPENAI_MODEL_HELPER || MODEL_MAIN;  // kvíz + rozhodčí (levný)
const ALLOWED_MODELS = new Set([MODEL_MAIN, MODEL_VISION, MODEL_HELPER, "gpt-4o-mini", "gpt-4o"]);
const MAX_TOKENS = 800;        // strop odpovědi, ať se nedá utéct s náklady
const MAX_MESSAGES = 40;       // strop délky konverzace
const MAX_CHARS = 4000;        // strop délky jedné zprávy

// Kdy může přijít kvíz (viz shouldQuiz):
const QUIZ_MIN_TURNS = 2;      // dřív než po 2 zprávách žáka se kvíz neřeší
const QUIZ_COOLDOWN = 4;       // po kvízu pauza — tolik zpráv bota bez dalšího
const QUIZ_FORCE_TURNS = 5;    // po tolika zprávách žáka se kvíz vynutí (pojistka)

const PERSONAS = new Map((CATALOG.personas || []).map((p) => [p.id, p]));

// Pravidla platformy — platí pro VŠECHNY persony. Persony jsou psané pro školní
// zadání od učitele, kde žák látku už probíral. V Glitchi je to jinak: žák si jen
// rozklikl kartu ve feedu a o tématu nemusí vědět vůbec nic. Proto se tu doplňuje,
// jak má bot postupovat (nejdřív vysvětlit, pak zjišťovat) a jak posílat kvíz.
const PLATFORM_RULES = `### JAK TO CHODÍ V GLITCHI (platí nad rámec tvé role)

Žák si právě rozklikl Glitch ve feedu. Viděl JEN krátký úvodní text (je níže
v ZADÁNÍ) — nic víc. Nemá výukové cíle, poznámky ani metadata karty; ty jsou určené
jen tobě. Nikdy nepředpokládej, že téma zná, že „si prošel kartu" nebo že něco viděl.
Neptej se ho, co mu z Glitche utkvělo.

Postupuj takto:

1. **Zahájení řídí pokyn.** Úplně první zprávu napíšeš podle pokynu v závorce,
   který dostaneš (odvíjí se od toho, co žák sám uvedl, že o tématu ví). Drž se ho:
   někdy máš téma krátce vysvětlit a pak se zeptat, jindy rovnou začít otevřenou
   ověřovací otázkou bez úvodu. Nevkládej úvod, když ti pokyn říká rovnou se ptát.
2. **Pak zjisti, co už ví.** Podle odpovědi přizpůsob obtížnost.
3. **Dál se střídej.** Když žák neví, tápe nebo odpoví „nevím" — **vysvětli mu to
   jednoduše a konkrétně** (klidně s příkladem) a teprve pak se ptej dál. Když ví,
   krátce naváž a posuň ho otázkou dál. Jsi učitel, který vysvětluje i ptá se —
   ne zkoušející.
4. **Nenech žáka viset.** Nikdy neodpovídej jen otázkou na otázku. Když se žák
   na něco zeptá, nejdřív mu odpověz, pak se případně doptej.
5. Piš krátce a lidsky. Nikdy nevypisuj text ve složených závorkách typu {{NECO}} —
   to jsou interní zástupné znaky, žákovi se nesmí zobrazit.

### KVÍZ

Kvíz do rozhovoru přidává systém — ty ho sám nevypisuješ a nevymýšlíš.
Na konci téhle zprávy se dozvíš, jestli teď kvíz přijde, nebo ne, a podle toho
zprávu ukonči. Až žák na kvíz odpoví, dostaneš jeho výsledek — krátce zareaguj
(co sedělo, co ne) a pokračujte v rozhovoru.`;

// Kontext Glitche → blok „zadání", na který jsou persony napsané
// (téma / cíl / zadání; u Basic Glitche navíc pole karty).
function contextBlock(ctx) {
  if (!ctx || typeof ctx !== "object") return "";
  const line = (label, val) => {
    if (val == null) return "";
    const s = String(val).trim().slice(0, MAX_CHARS);
    return s ? `${label}: ${s}\n` : "";
  };
  return (
    line("Téma", ctx.tema) +
    line("Název Glitche", ctx.nazev) +
    line("Kapitola", ctx.kapitola) +
    line("Cíl", ctx.cil) +
    line("Zadání / průběh aktivity", ctx.zadani) +
    line("Text karty, který žák viděl", ctx.text) +
    line("Co už v Glitchi zaznělo", ctx.receno)
  ).trim();
}

// Profil žáka → blok „profil žáka". Frontend posílá jen concept_id + úroveň;
// názvy konceptů dohledáme tady z mapy konceptů. Slouží botovi jako kontext,
// na co může navázat — ne jako látka ke zkoušení.
function zakBlock(zak) {
  if (!zak || typeof zak !== "object") return "";
  const zvladnute = Array.isArray(zak.zvladnute) ? zak.zvladnute : [];
  const radky = zvladnute
    .map((z) => {
      const c = z && z.concept_id && CONCEPTS[z.concept_id];
      if (!c || !c.nazev) return "";
      const uroven = UROVEN_LABEL[z.uroven] || "";
      return "- " + c.nazev + (uroven ? " (" + uroven + ")" : "");
    })
    .filter(Boolean)
    .slice(0, 15);
  return radky.join("\n");
}

// Osobní údaje žáka (věk, rod) → řádky do profilu. Bot podle nich přizpůsobí
// slovník, obtížnost a oslovení (v češtině záleží na rodě u sloves v minulém čase).
function osobniRadky(zak) {
  const o = (zak && typeof zak === "object" && zak.osobni) || {};
  const radky = [];
  const vek = parseInt(o.vek, 10);
  if (vek >= 5 && vek <= 120) {
    radky.push("Věk žáka: " + vek + " let — přizpůsob tomu slovník, příklady i obtížnost.");
  }
  if (o.gender === "holka") {
    radky.push("Rod žáka: holka — oslovuj ji a shoduj slovesa v ženském rodě (např. „zvládla jsi\", „napsala jsi\").");
  } else if (o.gender === "kluk") {
    radky.push("Rod žáka: kluk — oslovuj ho a shoduj slovesa v mužském rodě (např. „zvládl jsi\", „napsal jsi\").");
  } else if (o.gender === "jine" || o.gender === "neuvadet") {
    radky.push("Rod žáka: neuvedený — vol neutrální formulace a vyhýbej se rodově zabarveným tvarům (např. „povedlo se ti to\" místo „zvládl/zvládla jsi\").");
  }
  return radky;
}

// Kontext projektu (pracovna) → blok PROJEKT pro personu glitchee-projekt.
function projektBlock(pr) {
  if (!pr || typeof pr !== "object") return "";
  const L = (label, val) => {
    if (val == null) return "";
    const s = String(val).trim().slice(0, MAX_CHARS);
    return s ? label + ": " + s + "\n" : "";
  };
  const steps = Array.isArray(pr.kroky) ? pr.kroky : [];
  const stepLines = steps.map((s) => "  - [" + (s && s.done ? "hotovo" : "nehotovo") + "] " + String((s && s.text) || "").slice(0, 300)).filter((x) => x.trim().length > 12).join("\n");
  const notes = (Array.isArray(pr.poznamky) ? pr.poznamky : []).filter(Boolean).map((n) => "  - " + String(n).slice(0, 300)).join("\n");
  const links = (Array.isArray(pr.odkazy) ? pr.odkazy : []).filter(Boolean).map((n) => "  - " + String(n).slice(0, 300)).join("\n");
  const body =
    L("Název projektu", pr.nazev) +
    L("Vznikl z Glitche / tématu", pr.glitch) +
    L("Co chce vytvořit", pr.co) +
    L("Proč / k čemu to bude", pr.proc) +
    L("Komu to bude sloužit", pr.komu) +
    L("Čím žák začne", pr.start) +
    (stepLines ? "Kroky plánu:\n" + stepLines + "\n" : "") +
    L("Termín dokončení", pr.termin) +
    (notes ? "Poznámky:\n" + notes + "\n" : "") +
    (links ? "Odkazy:\n" + links + "\n" : "") +
    (pr.obrazky ? L("Přiložené obrázky", String(pr.obrazky) + " ks") : "");
  const s = body.trim();
  if (!s) return "";
  return "### PROJEKT (kontext pracovny — jen pro tebe, sám od sebe to nevypisuj)\n\n" + s +
    "\n\nNa tohle navazuj: pomáhej žákovi posunout tenhle projekt dál.";
}

function buildSystemPrompt(personaId, ctx, quizNow, zak, freechat, project) {
  const persona = PERSONAS.get(personaId) || PERSONAS.get(CATALOG.default);
  const parts = [];
  if (persona && persona.prompt) parts.push(persona.prompt);
  // Volný chat (z profilu / seznamu sledování): žádný konkrétní Glitch, tedy
  // žádná glitch-specifická pravidla, žádné ZADÁNÍ, žádný kvíz. Jen persona +
  // (volitelně) osobní údaje uživatele, ať přizpůsobí jazyk.
  if (freechat) {
    // volitelný kontext projektu (pracovna): plán, zdroje, z jakého Glitche vznikl
    const pb = projektBlock(project);
    if (pb) parts.push(pb);
    const osobni = osobniRadky(zak);
    const zb = zakBlock(zak);
    if (osobni.length || zb) {
      let s = "### O UŽIVATELI (jen pro tebe — sám od sebe to nevypisuj)\n\n";
      if (osobni.length) s += osobni.join("\n") + "\n\n";
      if (zb) s += "Koncepty, které už uživatel v Glitchi zvládl (a na jaké úrovni):\n\n" + zb +
        "\n\nNa tohle můžeš navázat („to už znáš z…\"), ale neber to jako jistotu a nezkoušej ho z toho.";
      parts.push(s.trim());
    }
    return parts.join("\n\n---\n\n");
  }
  parts.push(PLATFORM_RULES);
  const block = contextBlock(ctx);
  if (block) {
    parts.push(
      "### ZADÁNÍ (kontext tohoto Glitche)\n\n" + block +
      "\n\nDrž se výhradně tohoto zadání. Nepřidávej látku mimo něj. " +
      "Když žák odbočí jinam, vlídně ho vrať k tématu Glitche."
    );
  }
  // Profil žáka — osobní údaje (věk, rod) + co už zvládl jinde. Jen kontext.
  const osobni = osobniRadky(zak);
  const zb = zakBlock(zak);
  if (osobni.length || zb) {
    let s = "### PROFIL ŽÁKA (jen pro tebe — sám od sebe ho nezmiňuj)\n\n";
    if (osobni.length) s += osobni.join("\n") + "\n\n";
    if (zb) {
      s += "Koncepty, které už žák v jiných Glitchích zvládl (a na jaké úrovni):\n\n" + zb +
        "\n\nNa tohle můžeš navázat („to znáš z…\"), ale nevypisuj mu to jako seznam a nezkoušej " +
        "ho z toho — nepředpokládej, že si všechno přesně pamatuje.\n\n";
    }
    s += "Celý tenhle profil je jen kontext pro tebe. Tenhle Glitch má svoje vlastní téma " +
      "(viz ZADÁNÍ) — to je pořád to hlavní.";
    parts.push(s);
  }
  // Samotný kvíz negeneruje tenhle model (v proudu řeči to nespolehlivě vynechával) —
  // skládá ho zvlášť generateQuiz() a server ho připojí. Tady jen řekneme, jak zprávu
  // ukončit, aby na kvíz navazovala.
  parts.push(quizNow
    ? "### TEĎ PŘIJDE KVÍZ\n\nŽák už tématu rozumí natolik, že ho můžeme vyzkoušet. " +
      "Napiš jen krátce (jednou větou): potvrď nebo oceň jeho poslední odpověď a naznač, " +
      "že si to teď rychle ověříte (např. „Přesně tak — pojď si to rychle zkusit.\"). " +
      "NEPOKLÁDEJ v téhle zprávě žádnou novou otázku (žádné „jaké…?\", „proč…?\", „umíš…?\") " +
      "a sám kvíz nevypisuj — otázka s možnostmi se doplní automaticky hned za tvou větu."
    : "### KVÍZ TEĎ NEPOSÍLEJ\n\nV téhle zprávě kvíz neposílej — pokračuj v rozhovoru " +
      "(vysvětluj a ptej se).");
  return parts.join("\n\n---\n\n");
}

/* Pojistka: než připojíme kvíz, useknout z odpovědi koncové otázky.
   Bot má před kvízem jen potvrdit odpověď, ale persona ho tlačí končit otázkou —
   a dvě otázky těsně nad sebou (jeho + kvíz) matou. Necháme potvrzení, otázky
   na konci zahodíme. Když by nezbylo nic, dáme neutrální uvození. */
function stripKoncovaOtazka(text) {
  const s = String(text || "").trim();
  if (!s.endsWith("?")) return s;
  const vety = s.match(/[^.!?]+[.!?]+(?:["“”)\s]+|$)/g);
  if (!vety || vety.length < 2) return "Pojď si to rychle ověřit.";  // celé jedna otázka
  while (vety.length > 1 && vety[vety.length - 1].trim().endsWith("?")) vety.pop();
  const out = vety.join("").trim();
  return out && !out.endsWith("?") ? out : "Pojď si to rychle ověřit.";
}

// Novější modely (GPT-5+) odmítají některé parametry, které starší modely braly
// (např. vlastní `temperature` — povolují jen výchozí). Když na to API upozorní,
// parametr si zapamatujeme a příště ho rovnou vynecháme, ať se požadavek neopakuje
// pořád dvakrát. (Přejmenování max_tokens → max_completion_tokens řešíme u zdroje.)
const DROP_PARAMS = new Set();

async function callOpenAI(key, payload) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const body = Object.assign({}, payload);
    DROP_PARAMS.forEach((p) => { delete body[p]; });
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (r.ok) return { ok: true, status: r.status, data };
    // 400 kvůli nepodporovanému parametru → zjisti který, zapamatuj a zkus znovu bez něj
    const msg = (data && data.error && data.error.message) || "";
    const m = msg.match(/Unsupported parameter: '([^']+)'/i)
           || msg.match(/Unsupported value: '([^']+)'/i)
           || (/temperature/i.test(msg) ? [null, "temperature"] : null);
    const param = m && m[1];
    if (param && (param in payload) && !DROP_PARAMS.has(param)) {
      DROP_PARAMS.add(param);
      continue;
    }
    return { ok: false, status: r.status, data };
  }
  return { ok: false, status: 400, data: { error: { message: "Model odmítl parametry požadavku." } } };
}

/* Vygeneruje kvíz samostatným voláním v JSON režimu.
   Dřív si kvíz měl vymyslet sám konverzační model uprostřed odpovědi — jenže jeho
   persona ho zároveň vede k „2–3 krátkým větám a jedné otázce", takže blok často
   vůbec nenapsal. Tady dostane model jediný úkol a formát si nemůže vymyslet
   (response_format: json_object). Vrací hotový objekt kvízu, nebo null. */
async function generateQuiz(key, convo, ctx) {
  // celý rozhovor bez interních zpráv v závorkách; poslední výměny jsou nejdůležitější
  const relevantni = convo.filter((m) => !/^\(/.test(m.content)).slice(-14);
  const prepis = relevantni
    .map((m, i) => {
      const zbyva = relevantni.length - i;
      const mark = zbyva <= 4 ? " «poslední»" : "";
      return (m.role === "user" ? "ŽÁK" : "BOT") + mark + ": " + m.content.slice(0, 600);
    })
    .join("\n");
  try {
    const { ok, data } = await callOpenAI(key, {
      model: MODEL_HELPER,
      temperature: 0.3,
      max_completion_tokens: 400,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content:
          "Dostaneš přepis výukového rozhovoru mezi žákem (11–18 let) a botem. " +
          "Vytvoř JEDNU kvízovou otázku, která ověří, jestli žák POROZUMĚL tématu, o kterém si povídali.\n\n" +
          "Otázku píšeš PŘÍMO ŽÁKOVI (mluvíš na něj, ne o něm). Testuješ jeho porozumění konceptu — " +
          "třeba tím, že má poznat správný příklad mezi špatnými, použít myšlenku na novou situaci, " +
          "nebo posoudit, co je a co není pravda.\n\n" +
          "PŘÍSNĚ ZAKÁZÁNO:\n" +
          "- Ptát se, co žák sám v rozhovoru řekl, uvedl nebo zmínil (např. „Jaký příklad žák uvedl…“, " +
          "„Co jsi říkal o…“). To netestuje porozumění, ale paměť na rozhovor.\n" +
          "- Psát otázku ve 3. osobě o „žákovi“ nebo „studentovi“ — mluv na něj přímo.\n" +
          "- Udělat správnou odpověď z věty, kterou žák sám napsal (nesmí jen zopakovat svůj vlastní příklad).\n" +
          "- Suchá učebnicová definice tématu, pokud přesně tohle nebylo jádrem rozhovoru.\n\n" +
          "Otázka MÁ vycházet z tématu a úrovně rozhovoru (ne náhodná trivia), ale musí jít " +
          "zodpovědět jen díky POCHOPENÍ — ne díky tomu, že si žák pamatuje, co psal.\n\n" +
          "Postupuj takto: nejdřív do pole \"co_overuje\" napiš jednou větou, jaké porozumění " +
          "otázka testuje (např. „umí rozpoznat příklad datové gramotnosti v praxi“). Pak vymysli otázku.\n\n" +
          "Vrať POUZE JSON:\n" +
          '{"co_overuje":"…","typ":"single","otazka":"…",' +
          '"moznosti":[{"text":"…","spravne":true},{"text":"…","spravne":false}]}\n\n' +
          "Pravidla: \"typ\" je \"single\" (právě jedna správná) nebo \"multi\" (aspoň dvě správné). " +
          "2–4 možnosti, každá krátká. Nesprávné možnosti musí být věrohodné, ne zjevně hloupé. " +
          "Česky, jednoduchým jazykem." },
        { role: "user", content:
          "Téma Glitche (jen pro kontext, NEptej se na jeho definici): " +
          ((ctx && ctx.nazev) || "—") + "\n\nPřepis rozhovoru:\n" + prepis }
      ]
    });
    if (!ok) return null;
    const raw = (data.choices && data.choices[0] && data.choices[0].message.content) || "";
    const d = JSON.parse(raw);
    const moznosti = (d.moznosti || []).filter((o) => o && o.text).slice(0, 4)
      .map((o) => ({ text: String(o.text), spravne: !!o.spravne }));
    if (moznosti.length < 2 || !moznosti.some((o) => o.spravne) || !d.otazka) return null;
    // "co_overuje" jen nutí model nejdřív pojmenovat testované porozumění — žákovi se neposílá
    return { typ: d.typ === "multi" ? "multi" : "single", otazka: String(d.otazka), moznosti: moznosti };
  } catch (_) {
    return null;
  }
}

/* Kdy poslat kvíz — dvoustupňové rozhodnutí:
   1) levná pravidla v kódu (kolik zpráv, kdy byl kvíz naposledy) — bez volání AI,
   2) teprve když projdou, zeptáme se malého modelu („rozhodčí"), jestli už žák
      tématu rozumí. Model tak neřeší kvíz v každé zprávě uprostřed dlouhého promptu
      — dostane jednu jasnou otázku a odpoví ANO/NE. */
const QUIZ_ASK_RE = /\b(kv[ií]z|vyzkou[sš]|otestuj|test|zkou[sš]k|ov[eě][řr] m[eě])/i;

async function shouldQuiz(key, convo, ctx) {
  const userMsgs = convo.filter((m) => m.role === "user" && !/^\(/.test(m.content));
  const userTurns = userMsgs.length;

  // žák si o kvíz řekl sám → dostane ho hned
  const last = userMsgs[userMsgs.length - 1];
  if (last && QUIZ_ASK_RE.test(last.content)) return true;

  if (userTurns < QUIZ_MIN_TURNS) return false;

  // po kvízu chvíli pauza
  const sinceQuiz = convo.slice().reverse()
    .filter((m) => m.role === "assistant")
    .findIndex((m) => /```kviz/i.test(m.content));
  if (sinceQuiz !== -1 && sinceQuiz < QUIZ_COOLDOWN) return false;

  // pojistka: po dost dlouhém rozhovoru kvíz vynutíme i bez rozhodčího
  if (userTurns >= QUIZ_FORCE_TURNS && sinceQuiz === -1) return true;

  const prepis = convo.slice(-10)
    .map((m) => (m.role === "user" ? "ŽÁK: " : "BOT: ") + m.content.slice(0, 400))
    .join("\n");
  try {
    const { ok, data } = await callOpenAI(key, {
      model: MODEL_HELPER,
      temperature: 0,
      max_completion_tokens: 16,
      messages: [
        { role: "system", content:
          "Jsi hodnotitel výukového rozhovoru. Na základě přepisu rozhodni, jestli je vhodná chvíle " +
          "vyzkoušet žáka krátkým kvízem.\n\nOdpověz ANO, pokud žák už tématu v základu rozumí — " +
          "vlastními slovy něco správně popsal, odpovídal věcně nebo látku shrnul.\n" +
          "Odpověz NE, pokud se teprve seznamuje s tématem, tápe, ptá se na základní vysvětlení, " +
          "odpovídá jednoslovně, nebo bot právě něco vysvětlil a žák to ještě nepoužil.\n\n" +
          "Odpovídej jediným slovem: ANO nebo NE." },
        { role: "user", content: (ctx && ctx.nazev ? "Téma: " + ctx.nazev + "\n\n" : "") + "Přepis:\n" + prepis }
      ]
    });
    if (!ok) return false;
    const verdict = ((data.choices && data.choices[0] && data.choices[0].message.content) || "").trim().toUpperCase();
    return verdict.startsWith("ANO");
  } catch (_) {
    return false;                 // rozhodčí selhal → radši žádný kvíz
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Použij POST." });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "Server nemá nastavený OPENAI_API_KEY." });
  }

  // TODO (až bude hotové přihlášení): ověřit Supabase token + roli,
  // ať endpoint nemůže volat kdokoli anonymně.

  try {
    const body = req.body || {};
    const model = ALLOWED_MODELS.has(body.model) ? body.model : MODEL_MAIN;
    const temperature = typeof body.temperature === "number" ? body.temperature : 0.3;

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return res.status(400).json({ error: "Chybí pole 'messages'." });
    }

    // Z klienta bereme JEN konverzaci (user/assistant). Systémovou roli ignorujeme —
    // skládá se na serveru, aby nešla přepsat.
    const convo = body.messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

    if (!convo.length) {
      return res.status(400).json({ error: "Konverzace je prázdná." });
    }

    // Volný chat (mimo konkrétní Glitch) — bez kvízu a bez glitch-pravidel.
    const freechat = body.freechat === true;

    // Rozhodnutí o kvízu (levná pravidla + případně malý „rozhodčí" model).
    // body.quiz === true → žák si o kvíz řekl sám, ptát se rozhodčího netřeba.
    const quizNow = freechat ? false
      : body.quiz === false ? false
      : body.quiz === true ? true
      : await shouldQuiz(key, convo, body.context);

    // Obrázky (vision): povolíme http(s) i data:image URL, max 2. Když jsou,
    // napojíme je na poslední uživatelskou zprávu a použijeme model s viděním.
    const images = Array.isArray(body.images)
      ? body.images.filter((u) => typeof u === "string" && /^(https?:|data:image\/)/i.test(u)).slice(0, 2)
      : [];
    const useModel = images.length ? MODEL_VISION : model;

    let chat = convo;
    if (images.length) {
      chat = convo.slice();
      for (let i = chat.length - 1; i >= 0; i--) {
        if (chat[i].role === "user") {
          chat[i] = { role: "user", content: [
            { type: "text", text: chat[i].content },
            ...images.map((u) => ({ type: "image_url", image_url: { url: u } }))
          ] };
          break;
        }
      }
    }

    const messages = [
      { role: "system", content: buildSystemPrompt(body.persona, body.context, quizNow, body.zak, freechat, body.project) },
      ...chat
    ];

    // odpověď bota a kvíz se generují souběžně (kvíz zvlášť, viz generateQuiz)
    const [main, kviz] = await Promise.all([
      callOpenAI(key, { model: useModel, messages, temperature, max_completion_tokens: MAX_TOKENS }),
      quizNow ? generateQuiz(key, convo, body.context) : Promise.resolve(null)
    ]);

    if (!main.ok) {
      return res.status(main.status).json({
        error: (main.data.error && main.data.error.message) || "Chyba OpenAI API."
      });
    }

    let text = (main.data.choices && main.data.choices[0] && main.data.choices[0].message.content) || "";
    if (kviz) {
      // kdyby model kvíz přece jen vypsal sám, jeho blok zahodíme a použijeme náš
      text = text.replace(/```(?:kviz|json)?\s*\{[\s\S]*?\}\s*```/gi, "").trim();
      // před kvízem nesmí zůstat vlastní otázka bota — necháme jen potvrzení
      text = stripKoncovaOtazka(text);
      text += "\n\n```kviz\n" + JSON.stringify(kviz) + "\n```";
    }
    return res.status(200).json({ text, quiz: !!kviz });
  } catch (e) {
    return res.status(500).json({ error: "Neočekávaná chyba serveru." });
  }
};
