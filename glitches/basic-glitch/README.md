# Basic Glitch

Výukové Glitche — jádro vzdělávacího obsahu (Algoritmus, Vibe Coding, …). Pokrytí informatiky pro 2. stupeň ZŠ.

## Organizace

- **Podsložka = téma = kapitola = Quest.** Např. `algoritmus/`, `vibe-coding/`.
- Glitche v jednom questu jsou **lineárně řazené** — pořadí určuje pole `order`.
- Nové téma = nová podsložka.

## Formát souboru

Každý Glitch = jeden MD soubor: **YAML frontmatter** (strojová data pro appku a editor) + **tělo v Markdownu** (text pro dítě, redakci a Tinybota, s pevnými nadpisy).

📄 **Vzor:** [`algoritmus/algoritmus-hra-zivota.md`](./algoritmus/algoritmus-hra-zivota.md) · plná šablona sekcí: [`../../docs/karta-basic-glitch.md`](../../docs/karta-basic-glitch.md)

### Frontmatter (YAML)

| pole | typ | popis |
|---|---|---|
| `id` | slug | shodný s názvem souboru, `{tema}-{nazev}` |
| `type` | `basic-glitch` | typ obsahu |
| `title` | text | název Glitche |
| `chapter` | text | téma / kapitola (čitelně) |
| `quest` | text | název questu |
| `order` | číslo | pořadí v questu |
| `version` | text | verze podání |
| `trust` | `core`\|`edited`\|`community`\|`generated` | stav důvěry |
| `lang` | kód | jazyk (`cs`) |
| `author`, `revised` | text / datum | redakční metadata |
| `card` | objekt | karta ve feedu: `badge`, `heading`, `text`, `media{kind,src}` |
| `quiz` | seznam | otázky: `q` + `options[]` s `label` a `correct` |
| `facets` | objekt | fasety podání (depth, visual, genre, length, world, formalism) |
| `prerequisites`, `next` | seznam id | vazby pro doporučování |

> ⚠️ **YAML pozor:** text s čárkou nebo dvojtečkou dej do uvozovek —
> `{ label: "nikdo, vznikají z pravidel", correct: true }`. Bez uvozovek čárka rozbije záznam.

### Tělo (Markdown, pevné nadpisy `##`)

| nadpis | zobrazit dítěti | pro koho |
|---|:---:|---|
| `## Kontrakt` (Výukový cíl, Povinné body, Kanonická otázka, Zakázaná tvrzení) | ❌ | redakce + kontrola bota |
| `## Podání` (Rozklik — vrstva 1, vrstva 2) | ✅ | dítě (rozklik) |
| `## Úrovně vypracování` (🟢 / 🟡 / 🔴 + kritéria) | ✅ zadání / ❌ kritéria | dítě + LLM zkoušející |
| `## Kontext pro Tinybota` (Fakta, Hranice tématu, Scaffolding, Co bot nesmí) | ❌ | chatbot |
| `## Bezpečnost a věková přiměřenost` | ❌ | redakce + bot |
