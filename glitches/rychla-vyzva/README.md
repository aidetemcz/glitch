# Rychlá výzva

Nerozklikávací Glitch. Dítě splní výzvu přímo na úvodní obrazovce (vybere odpověď) a scrolluje dál. Žádný rozklik, žádný chatbot.

## Navrhovaná struktura souboru *(k doladění)*

- **0 Identifikace** — id, název, verze, jazyk, stav důvěry.
- **1 Karta ve feedu**
  - varianta zadání: `vypocet` | `slovni-uloha` | `obrazec`;
  - text zadání (velký) + volitelná podotázka;
  - u obrazce: odkaz na SVG / obrázek;
  - **odpovědi** — seznam možností, právě jedna správná (`correct: true`);
  - rozložení tlačítek: `2x2` | `1xN` | řada;
  - **opt-in** časovač (nikdy automatický).
- **Zpětná vazba** — okamžité správně/špatně po výběru.

Soubory: `{tema-nebo-typ}-{nazev}.md`, např. `matematika-nasobeni-310x15.md`.
