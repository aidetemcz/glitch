# report-notify — upozornění při nahlášení obsahu (Slack nebo e-mail)

Edge Function, kterou spouští **Database Webhook** na tabulce `content_reports`
(event **INSERT**). U každého nového nahlášení pošle upozornění — podle
vyplněných secretů buď do **Slacku**, nebo **e-mailem** (Slack má přednost).

## A) Slack (bez zakládání nového účtu)

1. **Slack Incoming Webhook URL**
   - https://api.slack.com/apps → *Create New App* → *From scratch* → vyber
     workspace → *Incoming Webhooks* → zapni → *Add New Webhook to Workspace* →
     vyber kanál → zkopíruj URL `https://hooks.slack.com/services/…`.
2. **Secret v Supabase** → **Edge Functions → Secrets** → `SLACK_WEBHOOK_URL` = ta URL.
3. Pokračuj krokem „Vytvoř funkci" níž.

## B) E-mail (Resend)

1. **Resend účet + klíč**
   - Zaregistruj se na resend.com (ideálně e-mailem `aplikace@aidetem.cz` —
     ve free/test režimu chodí e-maily jen na adresu, kterou účet vlastní).
   - *API Keys* → *Create API Key* → zkopíruj klíč `re_…`.
2. **Secrety v Supabase** → **Edge Functions → Secrets**
   - `RESEND_API_KEY` = klíč. Volitelně `NOTIFY_TO`, `NOTIFY_FROM`.
3. Pokračuj krokem „Vytvoř funkci" níž.

## Vytvoř funkci a napoj webhook

1. Supabase → **Edge Functions → Create a new function** → název `report-notify`.
2. Vlož obsah `index.ts` z téhle složky → **Deploy**.
3. V nastavení funkce **vypni „Verify JWT"** (spouští ji interní webhook, ne
   přihlášený uživatel — jinak vrací 401).
4. **Napoj webhook**: v *Create a new database webhook* přepni **Type of webhook**
   z „HTTP Request" na **Supabase Edge Functions** a vyber `report-notify`.
   Table `content_reports`, Events jen **Insert**. Ulož.
5. **Test** — nahlas v appce Glitch → do pár vteřin dorazí zpráva (do Slacku
   nebo e-mailem podle toho, který secret jsi vyplnila).

## Vlastní doména odesílatele

`onboarding@resend.dev` posílá jen na adresu vlastníka Resend účtu. Pro odesílání
z vlastní domény (a na libovolné adresáty) ověř doménu v Resend → *Domains* a
nastav `NOTIFY_FROM` na adresu z ověřené domény (např. `glitch@tiny.school`).
