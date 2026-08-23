# Historická osobnost

Rozklikávací Glitch. Po rozkliku **chat s AI personou** historické osobnosti oboru.

## Navrhovaná struktura souboru *(k doladění)*

- **0 Identifikace** — id, jméno osobnosti, obor, verze, jazyk, stav důvěry.
- **1 Karta ve feedu** — štítek „Historická osobnost", fotografie (Č/B, zaoblené rohy), jméno (titulek), krátký úvod + výzva k rozhovoru. Možný easter egg (upravená fotka).
- **2 Persona (kontext pro chatbota)** — nezobrazuje se; nalévá se do system promptu:
  - kdo osobnost byla, klíčová fakta, jazyk/tón persony;
  - co osobnost ví / neví (časové ohraničení);
  - hranice tématu, co persona nesmí tvrdit;
  - jak reagovat na miskoncepce.
- **6 Bezpečnost a věková přiměřenost** — vlídný tón, žádné citlivé odbočky.

Soubory: `{jmeno}.md`, např. `alan-turing.md`.
