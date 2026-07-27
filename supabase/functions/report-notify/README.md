# report-notify — e-mail při nahlášení obsahu

Edge Function, kterou spouští **Database Webhook** na tabulce `content_reports`
(event **INSERT**). U každého nového nahlášení pošle e-mail přes službu
[Resend](https://resend.com).

## Nastavení (přes Supabase dashboard, bez CLI)

1. **Resend účet + klíč**
   - Zaregistruj se na resend.com (ideálně e-mailem `aplikace@aidetem.cz` —
     ve free/test režimu chodí e-maily jen na adresu, kterou účet vlastní).
   - *API Keys* → *Create API Key* → zkopíruj klíč `re_…`.

2. **Tajné proměnné v Supabase**
   - Supabase → **Edge Functions → Secrets** (nebo *Project Settings → Edge Functions*).
   - Přidej `RESEND_API_KEY` = zkopírovaný klíč.
   - Volitelně `NOTIFY_TO` (kam poslat) a `NOTIFY_FROM` (odesílatel). Bez nich se
     použije `aplikace@aidetem.cz` a `onboarding@resend.dev`.

3. **Vytvoř funkci**
   - Supabase → **Edge Functions → Create a new function** → název `report-notify`.
   - Vlož obsah `index.ts` z téhle složky → **Deploy**.
   - V nastavení funkce **vypni „Verify JWT"** (spouští ji interní webhook, ne
     přihlášený uživatel).

4. **Napoj webhook na funkci**
   - V *Create a new database webhook* přepni **Type of webhook** z
     „HTTP Request" na **Supabase Edge Functions** a vyber `report-notify`.
   - Table `content_reports`, Events jen **Insert**. Ulož.

5. **Test** — nahlas v appce Glitch → do pár vteřin dorazí e-mail.

## Vlastní doména odesílatele

`onboarding@resend.dev` posílá jen na adresu vlastníka Resend účtu. Pro odesílání
z vlastní domény (a na libovolné adresáty) ověř doménu v Resend → *Domains* a
nastav `NOTIFY_FROM` na adresu z ověřené domény (např. `glitch@tiny.school`).
