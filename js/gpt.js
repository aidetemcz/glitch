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
      zak: opts.zak,                 // profil žáka (co už zvládl); názvy dohledá server
      model: opts.model,             // volitelně "gpt-4o" (jinak gpt-4o-mini)
      temperature: opts.temperature, // volitelně
      quiz: opts.quiz,               // false = nikdy neposílat kvíz (např. Inspirace)
      freechat: opts.freechat,       // true = volný chat mimo Glitch (bez pravidel/kvízu)
      images: opts.images,           // vision: pole URL / data:image (napojí se na poslední zprávu)
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "GPT se nepodařilo zavolat.");
  return data.text;
}

// Vyhodnocení Glitche — posoudí konverzaci proti kritériím z mapy konceptů.
// Vrací { splneno, uroven, shrnuti, kriteria }. Při chybě { splneno: false }.
async function gptEvaluate(messages, opts) {
  opts = opts || {};
  try {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        conceptId: opts.conceptId,
        context: opts.context,
        kviz: opts.kviz
      }),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok ? data : { splneno: false };
  } catch (_) {
    return { splneno: false };
  }
}

window.gptChat = gptChat;
window.gptEvaluate = gptEvaluate;
