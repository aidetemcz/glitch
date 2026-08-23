// Vyhodnocení Glitche — rozhoduje, jestli žák splnil výukový cíl.
//
// Glitch NENÍ hotový tím, že žák odpoví na kvíz. Je hotový, když tenhle
// hodnotitel na základě konverzace + kritérií z mapy konceptů usoudí, že žák
// kritéria prokazatelně splnil. Teprve pak feed Glitch skryje a nabídne další krok.
//
// Tělo požadavku (JSON):
//   {
//     "conceptId": "tvorba-aplikaci-vibecoding",   // volitelné (kritéria z mapy)
//     "context":   { "nazev": "...", "tema": "..." },
//     "messages":  [{ "role": "user"|"assistant", "content": "..." }],
//     "kviz":      { "spravne": true }             // výsledek posledního kvízu
//   }
// Odpověď:
//   { "splneno": bool, "uroven": "porozumeni"|…, "shrnuti": "…", "kriteria": {…} }

const CONCEPTS = require("../knowledge-map/concepts.json");

const MAX_CHARS = 600;
const MIN_TURNS = 2;          // pod tolik zpráv žáka se nehodnotí vůbec

async function callOpenAI(key, payload) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  return { ok: r.ok, data };
}

function kriteriaText(conceptId) {
  const c = CONCEPTS[conceptId];
  if (!c) return null;
  const cile = (c.cile || []).map((x) => `- [${x.uroven}] ${x.text}`).join("\n");
  const krit = (c.kriteria || []).map((x, i) => `K${i + 1} [${x.uroven}] ${x.text}`).join("\n");
  return { nazev: c.nazev, cile: cile, kriteria: krit, pocet: (c.kriteria || []).length };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Použij POST." });
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "Server nemá nastavený OPENAI_API_KEY." });

  try {
    const body = req.body || {};
    const convo = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .filter((m) => !/^\(/.test(m.content));          // interní pobídky pryč

    const userTurns = convo.filter((m) => m.role === "user").length;
    if (userTurns < MIN_TURNS) {
      return res.status(200).json({ splneno: false, duvod: "krátká konverzace" });
    }

    const k = kriteriaText(body.conceptId);
    const prepis = convo.slice(-16)
      .map((m) => (m.role === "user" ? "ŽÁK: " : "BOT: ") + m.content.slice(0, MAX_CHARS))
      .join("\n");

    const kvizRadek = body.kviz
      ? `Poslední kvíz: ${body.kviz.spravne ? "žák odpověděl správně" : "žák odpověděl špatně"}.`
      : "Kvíz zatím neproběhl.";

    const { ok, data } = await callOpenAI(key, {
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 350,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content:
          "Jsi hodnotitel výukového rozhovoru. Posuď, jestli žák prokázal porozumění tématu.\n\n" +
          "HODNOŤ POUZE TO, CO ŽÁK PROKAZATELNĚ ŘEKL. Nedomýšlej si a nehodnoť podle toho, " +
          "co mu vysvětlil bot — důkazem je jen žákova vlastní formulace nebo správná odpověď v kvízu.\n\n" +
          (k
            ? "Výukové cíle konceptu:\n" + k.cile + "\n\nKritéria hodnocení:\n" + k.kriteria + "\n\n"
            : "Kritéria z mapy nejsou k dispozici — posuď, jestli žák tématu v základu rozumí: " +
              "dokáže ho vlastními slovy popsat a použít na příkladu.\n\n") +
          "Vrať POUZE JSON:\n" +
          '{"kriteria":{"K1":true,"K2":false},"uroven":"porozumeni","splneno":true,' +
          '"shrnuti":"Stručně, co žák zvládl (max 1 věta, oslovuj ho ty)."}\n\n' +
          "\"splneno\" dej true jen tehdy, když žák splnil aspoň jedno kritérium NAPLNO a zároveň " +
          "v rozhovoru sám (ne bot) srozumitelně vysvětlil podstatu tématu. Když jen souhlasil, " +
          "odpovídal jednoslovně nebo mu vše vysvětlil bot, dej false.\n" +
          "\"uroven\" = nejvyšší úroveň, kterou žák prokázal (např. porozumeni, aplikace, hodnoceni)." },
        { role: "user", content:
          "Téma Glitche: " + ((body.context && body.context.nazev) || (k && k.nazev) || "—") + "\n" +
          kvizRadek + "\n\nPřepis rozhovoru:\n" + prepis }
      ]
    });

    if (!ok) return res.status(200).json({ splneno: false, duvod: "hodnotitel nedostupný" });

    const raw = (data.choices && data.choices[0] && data.choices[0].message.content) || "{}";
    const v = JSON.parse(raw);
    return res.status(200).json({
      splneno: !!v.splneno,
      uroven: v.uroven || null,
      shrnuti: typeof v.shrnuti === "string" ? v.shrnuti.slice(0, 300) : "",
      kriteria: v.kriteria && typeof v.kriteria === "object" ? v.kriteria : {}
    });
  } catch (e) {
    return res.status(200).json({ splneno: false, duvod: "chyba hodnocení" });
  }
};
