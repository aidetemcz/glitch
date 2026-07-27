// report-notify — pošle e-mail při novém nahlášení nevhodného obsahu.
//
// Spouští ho Database Webhook na tabulce public.content_reports (event INSERT).
// Webhook pošle POST s tělem { type, table, schema, record, old_record },
// kde `record` je nově vložený řádek nahlášení.
//
// Odeslání e-mailu řeší Resend (https://resend.com) přes jeho REST API.
// Klíč a adresy se berou z tajných proměnných (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY  (povinné)  – API klíč z Resend (re_...)
//   NOTIFY_TO       (volitelné) – kam poslat e-mail (výchozí aplikace@aidetem.cz)
//   NOTIFY_FROM     (volitelné) – odesílatel (výchozí onboarding@resend.dev)

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "aplikace@aidetem.cz";
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "Glitch <onboarding@resend.dev>";

function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

Deno.serve(async (req) => {
  if (!RESEND_API_KEY) {
    return new Response("Chybí RESEND_API_KEY", { status: 500 });
  }
  let record: Record<string, unknown> = {};
  try {
    const payload = await req.json();
    record = (payload && payload.record) || {};
  } catch (_) {
    return new Response("Neplatné tělo requestu", { status: 400 });
  }

  const rows: Array<[string, unknown]> = [
    ["Glitch", record.glitch_id],
    ["Typ", record.glitch_type],
    ["Téma", record.topic],
    ["Důvod", record.reason ?? "(neuveden)"],
    ["Uživatel", record.user_id],
    ["Čas", record.created_at],
  ];

  const subject = `⚠️ Nové nahlášení obsahu — ${record.glitch_id ?? "?"}`;
  const html =
    `<h2>Nové nahlášení nevhodného obsahu</h2><table cellpadding="6">` +
    rows.map(([k, v]) =>
      `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`
    ).join("") +
    `</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v ?? "—"}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: NOTIFY_FROM, to: [NOTIFY_TO], subject, html, text }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return new Response(`Resend chyba: ${detail}`, { status: 502 });
  }
  return new Response("ok", { status: 200 });
});
