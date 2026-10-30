# Prototyp — co je reálně postavené

_Přehled funkcí, které vznikly během prototypové fáze (červenec 2026). Doplňuje koncepční dokumenty (`popis-fungovani-glitche.md`, `doporucovaci-system.md`, `databaze-navrh.md`) o stav **skutečné implementace** v aplikaci. Vytvořeno: 2026-07-29._

> Zdroj pravdy pro obsah zůstává [`glitches/feed.json`](../glitches/feed.json) (feed) + fallback pole `CARDS` v `js/feed.js`. Uživatelské Glitche a projekty žijí v Supabase (viz [`databaze-navrh.md`](./databaze-navrh.md), sekce „Stav v prototypu").

---

## 1. Feed a katalog

- **Data-driven feed** — karty se čtou z `glitches/feed.json` (cache-busting `?v=N`), doporučovač `js/recommender.js` (`serazFeed`) aplikuje tvrdé filtry + řazení dle obtížnosti.
- **Aktivní štítky** — badge nahoře v Glitchi je klikací; kliknutí filtruje feed dle **tématu / typu / autora** (`openFacetFeed`).
- **Uživatelské Glitche přímo ve feedu** — schválené glitchposty se míchají do feedu, pokud má uživatel zapnuté veřejné sdílení (`soukromi_glitchfeed`). Kliknutí na glitchpost z profilu ho otevře přímo ve feedu (`glitchOpenUserGlitch`).

## 2. Tvorba Glitche uživatelem („+")

Pětikrokový flow (`js/create.js`):

1. **Typ** — Basic / Inspirace / Výzva.
2. **Popis** — co má Glitch učit / ukázat.
3. **Zdroje** — obrázky + URL. *(Obrázek jen u Basic a Inspirace — Výzva nemá vizuál.)* Obrázky jdou přes vision (`/api/gpt`, gpt-4o).
4. **Chat** — s personou **Stavitel Glitche** (`stavitel-glitche`), která pomáhá Glitch dotvořit.
5. **Náhled** — Upravit / Schválit. Schválený Glitch → **glitchpost** (Supabase `glitchposts` + lokálně) a rovnou do feedu.

Mazání: glitchposty i uložené Glitche mají v profilu **⋮ menu** s volbou „Smazat Glitch" / „Odebrat z uložených".

## 3. Pracovna projektu

Workspace projektu (`js/project.js`) se 4 záložkami:

1. **Projektový plán** — pole Název, Co chci vytvořit, Proč, Komu to bude sloužit, Čím začnu, kroky, deadline.
2. **Chat s Glitcheem** — persona **glitchee-projekt**, dostává kontext z profilu + Glitche + plánu + zdrojů.
3. **Zdroje** — odkazy a materiály projektu.
4. **Sdílení a spolupráce** — přepínač soukromý/veřejný, přizvání spolupracovníků (search), seznam členů.

Karta projektu v profilu: **status pill na prvním místě** — „Splněno X/Y" (šedá outline) / „Dokončeno" (žlutě s černou outline).

## 4. Spolupráce a zprávy

- **Přizvání spolupracovníků** — owner hledá uživatele a přidává je (`project_collaborators`).
- **Sdílený editovatelný projekt** — člen edituje projekt, zápisy jdou do vlastníkovy řádky (`sbUpdateSharedProject`).
- **1:1 realtime zprávy** — overlay chatu (`js/messages.js`, `glitchOpenDM`) přes Supabase Realtime (`messages` + publication).

## 5. Sociální vrstva

- **Sledování** — followers / following (`follows`), render **uvnitř profilu** (ne overlay); default: uživatel ↔ Glitchee se sledují.
- **Veřejný profil** — Glitchee je chatovatelný (persona **glitchee-chat**, viz níže); u reálných uživatelů se zobrazují jejich glitchposty („Glitchposty uživatele @handle"), bez tlačítka „Poslat zprávu".

## 6. Freechat s Glitcheem

Persona **glitchee-chat** (`freechat:true`):

- **Nedrží glitch-kontext** — pomáhá s čímkoli, přeskakuje platformní pravidla a kvíz.
- **Vede, nedává rovnou výsledek** — vysvětluje a navádí.
- **Dostává profil uživatele** (rod, věk, úroveň zvládnutí) → mluví ve správném rodě.
- **Empatická reakce** na citlivá témata (sebepoškozování apod.).
- Disclaimer je pod chatovacím boxem.

## 7. Focus místo mood (AI Act)

> ⚠️ **Rozpoznávání emocí je zakázané (AI Act, čl. 5).** Původní karta „Jak se teď cítíš?" (`mood_selector`, diagram energie × soustředění) je **trvale odstraněna** — na třech místech: karta pryč z `feed.json`, tvrdý filtr v `js/recommender.js` (`type === "mood_selector"` → nezobrazit), a mood_selector odstraněn z `CARDS`.

Signál pro doporučování je nově **behaviorální focus** — jen fakt, že dítě **dokončilo** relaxační / pozornostní aktivitu (dýchání, hra na pozornost, ASMR). Žádný odhad nálady. Detail viz [`karta-wellbeing.md`](./karta-wellbeing.md), [`doporucovaci-system.md`](./doporucovaci-system.md).

Mrtvý kód k pozdějšímu úklidu: `sbSaveMood`, tabulka `mood_entries`.

## 8. Statistiky a události

- **`glitch_events`** — append-only log událostí (view / open / complete / kvíz) jako zdroj implicitních, **ne-emočních** signálů.
- **`chat_logs`** — konverzace se ukládají **jen pro testování**, s automatickým mazáním po 7 dnech (pg_cron).

## 9. Personas

Katalog `Persony/personas.json` (build: `python3 Persony/build-catalog.py`). Klíčové persony prototypu:

| id | role |
| --- | --- |
| `glitchee` | základní Glitchee u karet |
| `glitchee-chat` | volný chat (freechat) — pomáhá s čímkoli, vede, nedrží glitch-kontext |
| `stavitel-glitche` | průvodce tvorbou uživatelského Glitche |
| `glitchee-projekt` | průvodce v pracovně projektu (kontext profil + Glitch + plán + zdroje) |
| `detektiv-chyb` | typ Najdi chybu |
| `argumentacni-partner` | typ Argumentuj |
| `historicka-postava` | typ Historická osobnost |

## 10. Web landing

`web/` = **samostatný Vercel projekt** (Root Directory `web`) na **glitch.tiny.school**. Černá/bílá/žlutá, header „Tiny Glitch / Vzdělávací sociální síť pro děti", interaktivní widget Mapy konceptů (self-contained, data z `knowledge-map.yaml`), placeholder videa, odkaz na Pavlův paper. Kopie mapy v `web/mapa/`.

## 11. Migrace (Supabase)

Všechny v `migrations/` (potvrzeno spuštěné):

- follows + čtení profilů
- chat_logs + pg_cron 7denní mazání
- glitchposty
- glitch_events
- projekty (plan / resources / msg_count / done)
- spolupráce + zprávy (project_collaborators + messages + realtime)
- sdílené projekty (RLS pro spolupracovníky)

---

**Výhled (zapamatováno, zatím neřešeno):** server prochází uživatelem zadané URL, extrahuje text a doplní do source-of-truth karty, aby z něj Glitchee při konverzaci čerpal; zobrazování veřejných glitchpostů **jiných** uživatelů ve feedu; potvrzení mazání glitchpostu; admin dashboard statistik (fáze 2); úklid mrtvého `sbSaveMood` / `mood_entries`.
