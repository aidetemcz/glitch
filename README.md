# Glitch

**Vzdělávací sociální síť pro děti a mládež.** Navenek vypadá a ovládá se jako sociální síť — vertikálně swipovaný feed celoobrazovkových karet — ale je postavená **proti** logice mainstreamových sítí. Smyčku zapojení napojujeme na **pokrok v učení**, ne na sociální srovnávání. Kde mainstream udrží pozornost za cenu wellbeingu, my hledáme návyk v souladu se skutečným učením.

Glitch je produkt **[Tiny](https://tiny.school)** · web: **[glitch.tiny.school](https://glitch.tiny.school)**

---

## Co je v tomhle repu

Z jednoho repozitáře se nasazují **tři samostatné statické aplikace** (každá vlastní Vercel projekt):

| Aplikace | Složka | Co to je |
|---|---|---|
| **Glitch feed** | `/` (kořen) | Hlavní appka — swipe feed Glitch karet. |
| **Mapa informatických konceptů** | `knowledge-map/app/` | Interaktivní graf 134 konceptů informatiky (Cytoscape). Obsahový framework, na kterém stavíme obsah. |
| **Web (splash)** | `web/` | Landing na `glitch.tiny.school`. |

---

## Základní pojmy

- **Glitch** = jedna celoobrazovková karta ve feedu. Technicky **jeden Markdown soubor**: frontmatter (YAML) = strojová data, tělo = text pro dítě / redakci / chatbota.
- **GlitchFeed** = hlavní feed. Nepřekročitelné zásady: **denní limit 20 Glitchů** (žádný nekonečný scroll), **časovače vždy opt-in**, **žádné veřejné srovnávání** (lajky, žebříčky), **wellbeing karty jsou součást feedu**.
- **Obsahový model** (převzatý z p-book): **kontrakt** (co se má naučit — vlastní redakce) je oddělený od **podání** (jak se to podává — otagované na řízených fasetách). Doporučovací systém vybírá jen z podání, která splňují kontrakt.
- **Stav důvěry** každé karty: `core → edited → community → generated`. Určuje označení karty a režim servírování; po žebříčku posouvá obsah jen lidská redakce.
- **Struktura obsahu:** Glitch → **Quest** (kapitola, lineárně řazený podle Bloomovy taxonomie) → **Téma**.
- **Glitchboardy** (plánováno): portfolio + pracovna inspirovaná Are.na, kam si dítě **forkne** Glitche a staví na nich vlastní práci.
- **Tinybot** (plánováno): chatbot, který vede dítě scaffoldingem (doptává se, aby na věc přišlo samo), čerpá z ověřených faktů.

Kanonický popis fungování a obsahový model: **`glitches/typy-obsahu.md`** a **`glitches/glitch-card-general.md`**.

---

## Typy obsahu (7)

Každý typ = složka v `glitches/`. Detail: **`glitches/typy-obsahu.md`**.

| # | Typ | Rozklik | Chatbot | Fork |
|---|---|:---:|:---:|:---:|
| 1 | **Basic Glitch** — jádro vzdělávacího obsahu (výklad i tvorba) | ✅ | ✅ | ✅ |
| 2 | **Rychlá výzva** — kognitivní rozcvička na kartě | ❌ | ❌ | ❌ |
| 3 | **Wellbeing** — mood check-in, dýchání, hra na pozornost | ⚙️ | ❌ | ❌ |
| 4 | **Fun fact** — zajímavost bez úkolu | ✅ | ✅ | ✅ |
| 5 | **Najdi chybu** — kritické myšlení / prebunking | ✅ | ✅ | ✅ |
| 6 | **Historická osobnost** — konverzace s AI personou | ✅ | ✅ | ✅ |
| 7 | **Argumentuj** — argumentace a hodnotové uvažování (portace Tinybota z Tiny) | ✅ | ✅ | ❌ |

Systémové karty (Welcome, Shrnutí) nejsou obsah — jsou součást aplikace.

---

## Tvorba komunitou (plánováno)

Tlačítko **„+"** ve spodním menu umožní dětem **vytvořit vlastní Glitch a učit ostatní**. Celým procesem provází Tinybot (kvůli kvalitě): „Co chceš dnes ostatní naučit?" → výběr typu → chatbot doptáváním získá kontext → navrhne kartu → dítě schválí → post. Ve feedu se objeví s tagem **Komunita** (= stav důvěry `community`). Základní jednotka sdílení = **třída** (garant učitel), data napojená na Tiny.

---

## Identita a přihlášení

**Cíl: Tiny je vlastník identity (SSO).** Přihlášení fyzicky proběhne v **Tiny** (Google / Microsoft / e-mail); Glitch dostane **stabilní Tiny ID** (token) a uloží ho k profilu. Dítě žádné ID nepíše. Výhoda: sdílený účet znamená, že **každý uživatel Glitche roste i v Tiny**, a napojení umožní posílat do Tiny **důkazy o učení** (pokrok, kvalita argumentace…). Tlačítko „Přihlásit se" je v Glitchi pod **profilem (kočka)** ve spodním menu.

**Aktuální stav:** mezikrok na **Supabase Auth + Google** (`js/supabase.js`, `js/auth.js`) — funkční přihlášení v novém feedu. Napojení na Tiny SSO je další krok.

---

## Spodní menu (návrh)

Pět sekcí: **Feed** (domeček) · **Boardy** (Glitchboardy) · **Tvořit** (+) · **Hledat** (lupa) · **Profil** (kočka — účet, přihlášení).

---

## Tech stack

- **Frontend:** Vanilla JS, žádný framework. Mobile-first, design z tokenů (`assets/glitch-design-tokens.md`) — Inter, paleta ČB + žlutá `#ffff00`.
- **Přihlášení / data:** Supabase (auth + pokrok) jako mezikrok; cíl Tiny SSO.
- **Mapa konceptů:** Cytoscape.js + js-yaml (vendorované lokálně, bez CDN), data v jednom YAML.
- **Hosting:** Vercel — tři projekty z jednoho repa přes **Root Directory**. Produkce jednotlivých projektů může sledovat pracovní větev (branch tracking) nebo `main`.

---

## Struktura repa

```
index.html            – Glitch feed (nový shell)
css/glitch.css        – design systém feedu
js/feed.js            – feed engine + renderery karet
js/auth.js            – přihlášení (UI nad Supabase)
js/supabase.js        – Supabase klient + auth + ukládání pokroku
assets/               – logo, UI ikony, videa, 3D vizualizace, design tokeny
glitches/             – obsah: typy-obsahu.md + složka na každý typ (MD karty)

knowledge-map/        – Mapa informatických konceptů
  app/                – appka (index.html, js/map.js, css/map.css, data/*.yaml)
  build_map.py        – generátor dat mapy
  *.md                – schéma a dokumentace dat

web/                  – splash glitch.tiny.school (soběstačná statická stránka)

vercel.json           – konfigurace Vercelu (routes, headers, cache)

# Legacy (stará chat-lekční verze, mimo nový feed):
js/app.js, js/data.js, css/style.css, admin.html, setup-community.sql
```

---

## Lokální vývoj

Jakýkoli statický server z kořene repa:

```bash
python3 -m http.server 8000
# Glitch feed:  http://localhost:8000/
# Mapa:         http://localhost:8000/knowledge-map/app/
# Web splash:   http://localhost:8000/web/
```

---

## Stav

- ✅ **Feed** — nový vizuál, 7 vizuálních rodin karet, úvodní žlutý splash, přihlášení přes Google (prototyp obsahu).
- ✅ **Mapa konceptů** — 3 pohledy (Témata / RVP / Digitální kompetence), detail s cíli, kritérii, RVP a KDI, **admin editor** (přihlášení → úprava → Draft/Hotovo → export YAML).
- ✅ **Web splash** — glitch.tiny.school.
- ✅ **Specifikace** všech 7 typů obsahu (vč. Argumentuj).
- 📋 **Návrh / další kroky:** spodní menu, Glitchboardy + fork, tvorba komunitou (+), Tinybot, doporučovací systém, Tiny SSO, řazení Questů podle Bloomovy taxonomie, opakování s rozestupy.

---

## Licence

MIT (kód) / CC BY-NC-SA 4.0 (obsah)
