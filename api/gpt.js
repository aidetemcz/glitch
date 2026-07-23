// Serverová proxy k OpenAI. Klíč zůstává na serveru (Vercel env: OPENAI_API_KEY)
// a do prohlížeče se nikdy nepošle. Frontend volá POST /api/gpt.
//
// Tělo požadavku (JSON):
//   { "messages": [{ "role": "user", "content": "..." }], "model": "gpt-4o-mini", "temperature": 0.7 }
// Odpověď:
//   { "text": "..." }  nebo  { "error": "..." }

const ALLOWED_MODELS = new Set(["gpt-4o-mini", "gpt-4o"]);
const MAX_TOKENS = 800; // strop odpovědi, ať se nedá utéct s náklady

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
    const messages = body.messages;
    const model = ALLOWED_MODELS.has(body.model) ? body.model : "gpt-4o-mini";
    const temperature = typeof body.temperature === "number" ? body.temperature : 0.7;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Chybí pole 'messages'." });
    }

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
