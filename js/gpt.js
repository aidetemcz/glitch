// Jednotné volání GPT z frontendu přes vlastní backend (/api/gpt).
// Klíč je jen na serveru — tady se s ním nikdy nepracuje.
//
// Použití:
//   const text = await gptChat([
//     { role: "system", content: "Jsi průvodce tvorbou Glitche." },
//     { role: "user", content: "Chci naučit děti, co je algoritmus." }
//   ]);
async function gptChat(messages, opts) {
  opts = opts || {};
  const res = await fetch("/api/gpt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      model: opts.model,             // volitelně "gpt-4o" (jinak gpt-4o-mini)
      temperature: opts.temperature, // volitelně
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "GPT se nepodařilo zavolat.");
  return data.text;
}

window.gptChat = gptChat;
