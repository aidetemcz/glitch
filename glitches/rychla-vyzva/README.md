# Rychlá výzva

Nerozklikávací Glitch. Dítě splní výzvu přímo na úvodní obrazovce (vybere odpověď), dostane okamžitou zpětnou vazbu a scrolluje dál. **Žádný rozklik, žádný chatbot.**

📄 **Vzor:** [`matematika-nasobeni-310x15.md`](./matematika-nasobeni-310x15.md)

## Frontmatter (YAML)

| pole | typ | popis |
|---|---|---|
| `id` | slug | `{predmet-nebo-tema}-{nazev}` |
| `type` | `rychla-vyzva` | typ obsahu |
| `title` | text | interní název |
| `subject` | text | předmět / téma (Matematika, Logika…) |
| `variant` | `vypocet`\|`slovni-uloha`\|`obrazec` | druh zadání |
| `version`, `trust`, `lang` | | metadata |
| `card.badge` | text | „Rychlá výzva" |
| `card.prompt` | text | velké zadání (u `vypocet` např. `310×15=`, u `slovni-uloha`/`obrazec` delší text) |
| `card.question` | text | podotázka (volitelné) |
| `card.figure` | objekt | jen u `obrazec`: `{ kind: svg, src: … }` — obrazec k otázce |
| `card.layout` | `2x2`\|`1xN`\|`row` | rozložení tlačítek |
| `card.timer.optIn` | bool | vždy `true` — **časovač nikdy automaticky** |
| `answers` | seznam | `{ label, correct }`; **právě jedna** `correct: true` |

> ⚠️ Text s čárkou/dvojtečkou v YAML do uvozovek.

## Tělo (volitelné)

Uživateli se nezobrazuje. Slouží jen redakci (postup řešení, zdroj) — např. `## Poznámka`.
