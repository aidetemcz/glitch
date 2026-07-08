# Basic Glitch

Výukové Glitche — jádro vzdělávacího obsahu (Algoritmus, Vibe Coding, …). Pokrytí informatiky pro 2. stupeň ZŠ.

## Organizace

- **Podsložka = téma = kapitola = Quest.** Např. `algoritmus/`, `vibe-coding/`.
- Glitche v jednom questu jsou **lineárně řazené** — pořadí určuje pole `pořadí v questu` ve frontmatteru.
- Nové téma = nová podsložka.

## Struktura souboru

Plná šablona: [`../glitch-card-general.md`](../glitch-card-general.md). Každý výukový Glitch obsahuje:

- **0 Identifikace** — id, název, kapitola, quest, pořadí, verze, stav důvěry, jazyk, autor, revize.
- **1 Kontrakt** — výukový cíl, povinné body, kanonická otázka + odpověď, zakázaná tvrzení / miskoncepce.
- **2 Obsah — kanonické podání** — karta ve feedu (štítek, titulek, text, interakce) + rozklikové vrstvy + kvíz.
- **3 Úrovně vypracování** — 🟢 jednoduchá / 🟡 střední / 🔴 master + kritéria hodnocení.
- **4 Kontext pro Tinybota** — fakta, hranice tématu, scaffolding, co bot nesmí.
- **5 Metadata pro doporučování** — fasety, prerekvizity, návaznosti, signály.
- **6 Bezpečnost a věková přiměřenost.**

## Soubory

`{tema}-{nazev}.md`, např. `algoritmus/algoritmus-hra-zivota.md`.
