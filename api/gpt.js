// Serverová proxy k OpenAI. Klíč zůstává na serveru (Vercel env: OPENAI_API_KEY)
// a do prohlížeče se nikdy nepošle. Frontend volá POST /api/gpt.
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

const ALLOWED_MODELS = new Set(["gpt-4o-mini", "gpt-4o"]);
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

1. **Nejdřív vysvětli.** První zpráva = krátké, srozumitelné uvedení do tématu
   (2–3 věty), které navazuje na úvodní text. Řekni podstatu vlastními slovy, ať
   žák hned něco ví. Na konci polož jednu otázku.
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

function buildSystemPrompt(personaId, ctx, quizNow) {
  const persona = PERSONAS.get(personaId) || PERSONAS.get(CATALOG.default);
  const parts = [];
  if (persona && persona.prompt) parts.push(persona.prompt);
  parts.push(PLATFORM_RULES);
  const block = contextBlock(ctx);
  if (block) {
    parts.push(
      "### ZADÁNÍ (kontext tohoto Glitche)\n\n" + block +
      "\n\nDrž se výhradně tohoto zadání. Nepřidávej látku mimo něj. " +
      "Když žák odbočí jinam, vlídně ho vrať k tématu Glitche."
    );
  }
  // Samotný kvíz negeneruje tenhle model (v proudu řeči to nespolehlivě vynechával) —
  // skládá ho zvlášť generateQuiz() a server ho připojí. Tady jen řekneme, jak zprávu
  // ukončit, aby na kvíz navazovala.
  parts.push(quizNow
    ? "### TEĎ PŘIJDE KVÍZ\n\nŽák už tématu rozumí natolik, že ho můžeme vyzkoušet. " +
      "Napiš JEN jednu krátkou větu, kterou kvíz uvedeš (např. „Zkusíme, jestli ti to sedí.\"). " +
      "Nepokládej v téhle zprávě žádnou vlastní otázku a sám kvíz nevypisuj — " +
      "otázka s možnostmi se doplní automaticky hned za tvou větu."
    : "### KVÍZ TEĎ NEPOSÍLEJ\n\nV téhle zprávě kvíz neposílej — pokračuj v rozhovoru " +
      "(vysvětluj a ptej se).");
  return parts.join("\n\n---\n\n");
}

async function callOpenAI(key, payload) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  return { ok: r.ok, status: r.status, data };
}

/* Vygeneruje kvíz samostatným voláním v JSON režimu.
   Dřív si kvíz měl vymyslet sám konverzační model uprostřed odpovědi — jenže jeho
   persona ho zároveň vede k „2–3 krátkým větám a jedné otázce", takže blok často
   vůbec nenapsal. Tady dostane model jediný úkol a formát si nemůže vymyslet
   (response_format: json_object). Vrací hotový objekt kvízu, nebo null. */
async function generateQuiz(key, convo, ctx) {
  const prepis = convo.slice(-12)
    .filter((m) => !/^\(/.test(m.content))
    .map((m) => (m.role === "user" ? "ŽÁK: " : "BOT: ") + m.content.slice(0, 400))
    .join("\n");
  try {
    const { ok, data } = await callOpenAI(key, {
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content:
          "Vytvoř jednu krátkou kvízovou otázku pro žáka (11–18 let) z toho, o čem byl rozhovor. " +
          "Otázka musí ověřit porozumění tématu, ne detail formulace. Česky, jednoduše.\n\n" +
          "Vrať POUZE JSON v tomhle tvaru:\n" +
          '{"typ":"single","otazka":"…","moznosti":[{"text":"…","spravne":true},{"text":"…","spravne":false}]}\n\n' +
          "Pravidla: \"typ\" je \"single\" (jedna správná) nebo \"multi\" (víc správných). " +
          "2–4 možnosti, každá krátká. U \"single\" je právě jedna spravne:true, u \"multi\" aspoň dvě. " +
          "Nesprávné možnosti musí být věrohodné, ne zjevně hloupé." },
        { role: "user", content: (ctx && ctx.nazev ? "Téma: " + ctx.nazev + "\n\n" : "") + "Rozhovor:\n" + prepis }
      ]
    });
    if (!ok) return null;
    const raw = (data.choices && data.choices[0] && data.choices[0].message.content) || "";
    const d = JSON.parse(raw);
    const moznosti = (d.moznosti || []).filter((o) => o && o.text).slice(0, 4)
      .map((o) => ({ text: String(o.text), spravne: !!o.spravne }));
    if (moznosti.length < 2 || !moznosti.some((o) => o.spravne) || !d.otazka) return null;
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
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 3,
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
    const model = ALLOWED_MODELS.has(body.model) ? body.model : "gpt-4o-mini";
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

    // Rozhodnutí o kvízu (levná pravidla + případně malý „rozhodčí" model).
    // body.quiz === true → žák si o kvíz řekl sám, ptát se rozhodčího netřeba.
    const quizNow = body.quiz === false ? false
      : body.quiz === true ? true
      : await shouldQuiz(key, convo, body.context);

    const messages = [
      { role: "system", content: buildSystemPrompt(body.persona, body.context, quizNow) },
      ...convo
    ];

    // odpověď bota a kvíz se generují souběžně (kvíz zvlášť, viz generateQuiz)
    const [main, kviz] = await Promise.all([
      callOpenAI(key, { model, messages, temperature, max_tokens: MAX_TOKENS }),
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
      text += "\n\n```kviz\n" + JSON.stringify(kviz) + "\n```";
    }
    return res.status(200).json({ text, quiz: !!kviz });
  } catch (e) {
    return res.status(500).json({ error: "Neočekávaná chyba serveru." });
  }
};
