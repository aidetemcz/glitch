# Wellbeing

Interaktivní karty ve feedu — selectory a hry. Součást feedu, ne přeskočitelné „nice to have".

Typy: **mood selector**, **dechové cvičení**, **hra na pozornost**.

## Navrhovaná struktura souboru *(k doladění)*

- **0 Identifikace** — id, název, typ (`mood_selector` | `breathing` | `attention_game`), verze, jazyk.
- **1 Karta ve feedu** — štítek („Wellbeing" / „Hra na pozornost"), titulek, text/instrukce.
- **2 Interakce** — parametry aktivity:
  - mood selector: osy (energie × soustředění), uložení hodnoty pro personalizaci feedu;
  - dechové cvičení: počet cyklů, délky fází (nádech/zadrž/výdech);
  - hra na pozornost: zdroj vizualizace (`assets/3Dvizualizations/…`), pravidla, **opt-in** časovač.
- **6 Bezpečnost** — časovače vždy opt-in; žádné srovnávání; emoční data se neukládají jako signál.

Soubory: `{typ}-{nazev}.md`, např. `mood-selector.md`, `dechove-cviceni.md`.
