# Obsah Glitche — struktura

Každý **Glitch = jeden Markdown soubor**. Struktura sekcí uvnitř souboru vychází ze šablony [`karta-basic-glitch.md`](../docs/karta-basic-glitch.md).

## Organizace podle předmětu → tématu

Obsahové Glitche jsou tříděné podle **školního předmětu** a v něm podle **tématu**:

```
glitches/
  Informatika/
    VibeCoding/        # Glitche o vibe codingu
    Algoritmus/        # Glitche o algoritmech
    UmelaInteligence/  # Glitche o AI (Argumentuj, Najdi chybu…)
    …                  # další témata přibývají jako podsložky
  (Cesky-jazyk/, Matematika/ … časem další předměty)
```

> Nový předmět = nová složka pod `glitches/` (např. `Cesky-jazyk/`), v ní témata.
> Nové téma = nová podsložka pod předmětem (např. `Informatika/Data/`).

Jeden Glitch má **typ** (Basic Glitch, Argumentuj, Fun fact…) v poli `type` ve frontmatteru — typ **není složka**, ale metadata. Specifikace jednotlivých typů (co obsahují, jak se chovají) jsou v type-složkách a v docs (viz níže).

## Runtime katalog

- **`feed.json`** — katalog karet, který appka načítá do feedu za běhu (zdroj pro doporučovač). Odvozenina z MD obsahu; zatím udržovaný ručně.

## Specifikace typů obsahu (referenční)

Popis jednotlivých typů (interakce, sekce, příklady) — **nejsou to složky s obsahem**, ale dokumentace typu:

| Typ | Specifikace |
|---|---|
| Basic Glitch | [`basic-glitch/README.md`](./basic-glitch/) + [`docs/karta-basic-glitch.md`](../docs/karta-basic-glitch.md) |
| Argumentuj | [`argument/README.md`](./argument/) + [`docs/karta-argument.md`](../docs/karta-argument.md) |
| Wellbeing | [`wellbeing/`](./wellbeing/) + [`docs/karta-wellbeing.md`](../docs/karta-wellbeing.md) |
| Rychlá výzva | [`rychla-vyzva/`](./rychla-vyzva/) + [`docs/karta-rychla-vyzva.md`](../docs/karta-rychla-vyzva.md) |
| Fun fact | [`funfact/`](./funfact/) + [`docs/karta-funfact.md`](../docs/karta-funfact.md) |
| Najdi chybu | [`najdi-chybu/`](./najdi-chybu/) + [`docs/karta-najdi-chybu.md`](../docs/karta-najdi-chybu.md) |
| Historická osobnost | [`historicka-osobnost/`](./historicka-osobnost/) + [`docs/karta-historicka-osobnost.md`](../docs/karta-historicka-osobnost.md) |

> **Systémové karty** (Welcome, Shrnutí) nejsou obsah — jsou součást aplikace.

## Pojmenování a metadata

- Kebab-case slug bez diakritiky: **`{tema}-{nazev}.md`**; slug = pole `id` ve frontmatteru.
- **Stav důvěry** (`trust`): `core → edited → community → generated`. Zobrazované štítky: **Glitch / Fork / Komunita / Generováno**.
- **Napojení na koncept** (`koncept`) → dědí RVP, digitální kompetenci, oblast a téma z [mapy konceptů](../knowledge-map/).

## `_archiv/`

Staré / osiřelé soubory (např. původní `index.json` misí a `community.json` z první verze). Ponecháno pro historii, není to zdroj pravdy.
