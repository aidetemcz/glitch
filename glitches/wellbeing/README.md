# Wellbeing

Interaktivní karty ve feedu — selectory a hry. Součást feedu, ne přeskočitelné „nice to have". **Bez chatbota.**

📄 **Vzory:** [`dechove-cviceni.md`](./dechove-cviceni.md) · [`mood-selector.md`](./mood-selector.md)

## Frontmatter (YAML)

Společná pole: `id`, `type: wellbeing`, `subtype`, `title`, `version`, `trust`, `lang`, `card { badge, heading, text }`.

`subtype` určuje obsah `config`:

| `subtype` | `config` pole |
|---|---|
| `breathing` | `cycles` (výchozí počet), `phases { inhale, hold, exhale }` (s), `hint`, `cta` |
| `mood_selector` | `axisX`, `axisY` (popisky os 0–100), `savesTo` (kam se ukládá hodnota pro personalizaci) |
| `attention_game` | `media { kind: iframe, src }` (vizualizace, např. `assets/3Dvizualizations/sphere-holes.html`), `timer { optIn: true }` |

> ⚠️ Text s čárkou/dvojtečkou v YAML do uvozovek.

## Zásady (neporušovat)

- Časovače/odpočty vždy **opt-in**, nikdy automatické.
- Žádné srovnávání mezi žáky.
- Emoční data se **neukládají** jako signál pro doporučování.

## Tělo (volitelné)

Uživateli se nezobrazuje — jen redakční poznámky.
