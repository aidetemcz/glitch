# Tiny Glitch

Interaktivni vzdelavaci platforma o vibecoding pro deti 8-15 let. Vypadá jako sociální síť, učí jako hra.

## Co to je

Tiny Glitch je "vzdělávací sociální síť" kde se děti učí o vibecoding (tvorba aplikací pomocí AI) formou chat-like lekcí s kvízy, flashcardami a komunitou.

## Stack

- **Frontend:** Vanilla JS SPA (žádný framework)
- **Auth:** Supabase Auth (Google OAuth + email/password)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel (static + serverless)
- **Obsah:** Markdown soubory s YAML frontmatter

## Struktura

```
index.html          - Hlavní SPA
admin.html          - Admin konzole
js/app.js           - Aplikační logika (views, chat engine, komunita)
js/data.js          - Content loader (parsuje markdown glitche)
js/supabase.js      - Supabase client, auth, sync, tracking
css/style.css       - Styly (dark theme, mobile-first)
glitches/
  index.json        - Definice kategorií, topicov, misí a glitchů
  community.json    - Seed data pro komunitu (bot příspěvky + týmy)
  vibecoding/       - Markdown lekce (21 aktivních)
assets/             - SVG blob ilustrace, ikony, diagramy
setup-community.sql - SQL pro Supabase tabulky
vercel.json         - Vercel konfigurace (routes, headers, cache)
```

## Obsah (21 lekcí ve 4 misích)

1. **Základy** — Co je vibecoding, jak funguje, limity, pravidla, bezpečnost, nápady
2. **Nástroje** — Honest srovnání: Lovable, Bolt, Macaly, Cursor + rozhodovací strom
3. **Praxe** — Prompting, debugging, databáze, publikování, tech slovníček
4. **Pod kapotou** — Jak AI funguje (transformery), Claude Code, budoucnost, zdroje

## Komunita

- Příspěvky a odpovědi (Quora-like)
- Mentorské tipy (učitelé, senior devs)
- FAQ
- Týmy (zakládání, konverzace, správa členů)
- Upvotes
- Seed data od bot uživatelů (_bot suffix)

## Setup

### 1. Supabase

Vytvoř projekt na [supabase.com](https://supabase.com). V SQL editoru spusť `setup-community.sql`.

V Authentication:
- Zapni Google provider (potřebuješ OAuth credentials z Google Cloud Console)
- Nastav Site URL + Redirect URLs na produkční URL

Uprav `js/supabase.js` — nastav `SUPABASE_URL` a `SUPABASE_ANON_KEY`.

### 2. Vercel

```bash
npm i -g vercel
vercel login
vercel deploy --prod
```

### 3. Lokální vývoj

```bash
# Jakýkoli static server, např:
npx serve .
# nebo
python3 -m http.server 8000
```

## Admin

`/admin` — přístup pouze pro emaily v `ADMIN_EMAILS` (v admin.html).

Funkce: přehled statistik, správa příspěvků/komentářů/týmů, zprávy od uživatelů, analytika.

## Formát lekcí (glitchů)

```markdown
---
id: unique-id
topic: topicKey
title: Název lekce
teaser: Krátký popis
hook: Otázka
flashQ: Otázka pro flashcard
flashA: Odpověď
---

Text bubliny (každý odstavec = jedna chat bublina)

Další bublina

? Kvízová otázka
- Špatná odpověď | Formativní feedback
* Správná odpověď | Formativní feedback
- Špatná odpověď | Formativní feedback
- Špatná odpověď | Formativní feedback
! Obecné vysvětlení (fallback)

+++

Deepdive text (zobrazí se po kliknutí na "Přečti si více")
```

## Licence

MIT (kód) / CC BY-NC-SA 4.0 (obsah)
