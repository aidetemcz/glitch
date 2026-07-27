// report-notify — upozornění při novém nahlášení nevhodného obsahu.
//
// Spouští ho Database Webhook na tabulce public.content_reports (event INSERT).
// Webhook pošle POST s tělem { type, table, schema, record, old_record },
// kde `record` je nově vložený řádek nahlášení.
//
// Univerzální: podle vyplněných tajných proměnných (Supabase → Edge Functions →
// Secrets) pošle upozornění do Slacku NEBO e-mailem (Slack má přednost):
//   SLACK_WEBHOOK_URL  – Slack Incoming Webhook URL (https://hooks.slack.com/…)
//   RESEND_API_KEY     – API klíč z Resend (re_…) pro e-mail
//   NOTIFY_TO          – kam poslat e-mail (výchozí aplikace@aidetem.cz)
//   NOTIFY_FROM        – odesílatel e-mailu (výchozí onboarding@resend.dev)

const SLACK_WEBHOOK_URL = Deno.env.get("SLACK_WEBHOOK_URL") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "aplikace@aidetem.cz";
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "Glitch <onboarding@resend.dev>";

function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendSlack(rows: Array<[string, unknown]>): Promise<Response> {
  const text = "⚠️ *Nové nahlášení nevhodného obsahu*\n" +
    rows.map(([k, v]) => `• *${k}:* ${v ?? "—"}`).join("\n");
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) return new Response(`Slack chyba: ${await res.text()}`, { status: 502 });
  return new Response("ok (slack)", { status: 200 });
}

async function sendEmail(rows: Array<[string, unknown]>, glitchId: unknown): Promise<Response> {
  const subject = `⚠️ Nové nahlášení obsahu — ${glitchId ?? "?"}`;
  const html = `<h2>Nové nahlášení nevhodného obsahu</h2><table cellpadding="6">` +
    rows.map(([k, v]) =>
      `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`
    ).join("") + `</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v ?? "—"}`).join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: NOTIFY_FROM, to: [NOTIFY_TO], subject, html, text }),
  });
  if (!res.ok) return new Response(`Resend chyba: ${await res.text()}`, { status: 502 });
  return new Response("ok (email)", { status: 200 });
}

Deno.serve(async (req) => {
  if (!SLACK_WEBHOOK_URL && !RESEND_API_KEY) {
    return new Response("Nastav SLACK_WEBHOOK_URL nebo RESEND_API_KEY", { status: 500 });
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

  // Slack má přednost; když není nastaven, pošli e-mailem.
  return SLACK_WEBHOOK_URL ? await sendSlack(rows) : await sendEmail(rows, record.glitch_id);
});
