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

Když už si chvíli povídáte a máš pocit, že žák tématu rozumí, můžeš ho vyzkoušet
krátkým kvízem. Otázku i možnosti vymýšlíš ty podle toho, o čem jste mluvili.

Kvíz pošli jako blok přesně v tomhle formátu:

\`\`\`kviz
{"typ":"single","otazka":"Otázka?","moznosti":[{"text":"možnost A","spravne":true},{"text":"možnost B","spravne":false}]}
\`\`\`

Pravidla kvízu:
- "typ": "single" = právě jedna správná možnost, "multi" = víc správných.
- 2–4 možnosti, krátké. Vždy aspoň jedna správná.
- Před blok napiš jednu krátkou uvozovací větu. Za blok už nepiš nic.
- Kvíz posílej nanejvýš jednou za několik výměn a nikdy hned v první zprávě.
- Až žák odpoví, dostaneš jeho výsledek — krátce zareaguj (co sedělo, co ne)
  a pokračujte v rozhovoru.`;

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

function buildSystemPrompt(personaId, ctx) {
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
  return parts.join("\n\n---\n\n");
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

    const messages = [
      { role: "system", content: buildSystemPrompt(body.persona, body.context) },
      ...convo
    ];

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens: MAX_TOKENS }),
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: (data.error && data.error.message) || "Chyba OpenAI API." });
    }

    const text = (data.choices && data.choices[0] && data.choices[0].message.content) || "";
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "Neočekávaná chyba serveru." });
  }
};
