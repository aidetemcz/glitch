// Jednotné volání GPT z frontendu přes vlastní backend (/api/gpt).
// Klíč je jen na serveru — tady se s ním nikdy nepracuje.
//
// Systémový prompt (persona + bezpečnostní pravidla) se skládá na SERVERU.
// Odtud posíláme jen: konverzaci, id persony a kontext Glitche.
//
// Použití:
//   const text = await gptChat(
//     [{ role: "user", content: "a k čemu mi to je?" }],
//     { persona: "glitchee", context: { tema: "Data", nazev: "Co je datová gramotnost" } }
//   );
async function gptChat(messages, opts) {
  opts = opts || {};
  const res = await fetch("/api/gpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      persona: opts.persona,         // id z Persony/personas.json (jinak výchozí)
      context: opts.context,         // kontext Glitche (téma, název, text karty…)
      model: opts.model,             // volitelně "gpt-4o" (jinak gpt-4o-mini)
      temperature: opts.temperature, // volitelně
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "GPT se nepodařilo zavolat.");
  return data.text;
}

window.gptChat = gptChat;
