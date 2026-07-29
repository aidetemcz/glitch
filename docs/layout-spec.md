# Glitch feed — layout spec

Zdroj pravdy: Figma **„Glitch 2.0"** (`BkGKbtWymuDbuIQ3cBIeLW`). Hodnoty čteny přes Figma konektor (Dev Mode). Poslední sync: 2026-07-24.

## Rám a plochy

- **Karta = 402×874** (mobil). V kódu je feed `max-width: 480px`, ale všechny poměry drží z 402.
- **Obsah karty:** 0–826 px. **Spodní menu:** 826–874 (výška **48 px**).
- **Levý okraj obsahu: 40 px** (texty začínají na `x≈39–41`). *(Dřív jsme měli 28 px — to rozhazovalo vše.)*

## Štítky (téma · typ · autor)

**Vlevo nahoře**, zarovnané zleva (novější rámce Figmy; starý right-aligned vzor už neplatí).

- **Pozice:** `top: 26`, `left: ~23` (Figma kolísá 20–33), **výška: 26**, **radius: 5**, **mezera 12** (Figma kolísá 11–15), vnitřní odsazení ~11.
- Pořadí zleva: **téma** (žlutá) · **typ Glitche** (žlutá) · **autor/trust** (bílá).
- **Trust** (Glitch / Generováno / …): pozadí **bílé**, text **grey50 `#747474`**, styl `glitch_category`.
- **Kategorie** (Argumentuj, Wellbeing…): pozadí **žluté `#ffff00`**, text **`#1a1a1a`**, styl `glitch_category`.
- Karty *About Glitch* a *Welcome* badge nemají.

## Typo styly (Figma — zdroj pravdy)

Přesně dle exportu textových stylů z Figmy „Glitch 2.0" (ověřeno i z výšek textových boxů přes konektor). Font **Inter**, řezy Regular 400 / Semi Bold 600. **Řádkování je `normal` (≈ 1.2× velikosti)** u všech stylů — jediná výjimka je `glitch_p` s pevnými **22 px**. Tracking je vždy **−4 %** (v CSS `-0.04em`), kromě `caps` (0).

| styl | řez | velikost | řádkování | tracking | použití |
|---|---|---|---|---|---|
| `glitch_H1` | 600 | 40 | normal | −0.04em (−1.6 px) | krátké titulky (Vítej, Jak se cítíš, Vibe Coding, Hra života, „310×15=") |
| `glitch_H2` | 600 | 30 | normal | −0.04em (−1.2 px) | velký text / delší tvrzení — Argumentuj, About Glitch, Time to let go |
| `glitch_H3` | 600 | 25 | normal | −0.04em (−1 px) | sekční nadpisy (Najdi chybu, Fun fact, Shrnutí, Aktivita, otázka u trojúhelníků) |
| `glitch_H4` | 600 | 20 | normal | −0.04em (−0.8 px) | menší nadpisy |
| `glitch_chapter-no` | 600 | 30 | normal | −0.04em (−1.2 px) | číslo kapitoly / velké číslo |
| `glitch_category` | 600 | 16 | normal | −0.04em (−0.64 px) | badge |
| `glitch_p` | 400 | 16 | **22 px** | −0.04em (−0.64 px) | běžný text / podtext |
| `glitch_p-s` | 400 | 15 | normal | −0.04em (−0.6 px) | malý / sekundární text |
| `glitch_caps` | 400 | 15 | normal | 0 | popisky os / verzálky |

> Pozn.: „delší tvrzení" ≠ automaticky H2. Ve Figmě je H2 (30 px) použité **jen** u Argumentuj; ostatní tvrzení a titulky (Najdi chybu, Fun fact, Shrnutí, Aktivita) jsou H3 (25 px). „310×15=" je krátké → H1 (40 px), ale delší otázky (trojúhelníky) jsou H3.

## Spodní menu

- Výška **48** (menu 826–874), pozadí **`#1a1a1a`**, horní obrys **2 px bílý**.
- 5 položek: Feed · Boardy · **+** (žluté kolečko 29) · Hledat · Profil.
- Avatar **29 px** kruh (žluté pozadí, bez obrysu). Ikony **20–21 px**, přebarvení: aktivní žlutá, neaktivní bílá.

## Tlačítka

**Jednotný styl — inverzní outline.** Všechna tlačítka vypadají stejně: průhledné
pozadí, barva textu i rámečku = `--fg` dané karty → **bílá na tmavém, černá na
bílém/žlutém**. Rámeček **1 px `--fg`**, radius **5**, text ve **velikosti
`glitch_p` (16/400, řádkování 22)**, na střed. Aktivní/vybraný stav = **plná inverze** (`background: --fg; color: --bg`).
Pouze geometrie (šířka/výška/padding) se u jednotlivých typů liší; barvy a rámeček
jsou společné (CSS: skupinový selektor `.welcome-login, .mood-cta, .breath-cta,
.arg-opt`).

> **Výjimky:** odpovědi u **Rychlé výzvy** (`.quiz-opt`) mají **vlastní styl** —
> tenký bílý obrys 1 px, text `glitch_H4` (20/600). Tlačítko **Začít** u dechového
> cvičení je **plná bílá** (`#fff`, text `#1a1a1a`, 134×47) — dle Figmy.

**Argumentuj:** **134×47**. Dvojice vedle sebe od `left: 40`, mezera 27, `top: 665` (spodní hrana 114 px nad menu). Vybraná odpověď = plná inverze.

**Rychlá výzva (odpovědi):** vlastní styl (ne jednotný). Kompaktní, pevná šířka, zarovnané **vlevo** (ne roztažené), bílý obrys 1 px, radius 5, text `glitch_H4` (20/600) **na střed**, mezera řádků 16. Správná odpověď = žlutá výplň, špatná = ztlumená (opacity .4).
- 2 sloupce (např. „310×15="): **108×47**, `left: 40`, mezera sloupců 21, řádky `top: 609 / 672`.
- 3 sloupce (trojúhelníky): **55×47**, `left: 40`, mezera 19–20, `top: 665`.
- 1 sloupec (topinky): **125×47**, řádky od `top: 547`, mezera 15–16.

## Přesné Y-souřadnice karet (z Figmy)

Referenční pozice hlavních prvků (px od horního okraje karty). Slouží pro srovnání jednotlivých karet.

- **About Glitch:** logo skupina `y=159` (v=227), nadpis „Vítej…" `y=586`, text `y=646`, chevron `y=732`.
- **Argumentuj:** tvrzení `y=216` (30/600, š=330), podtext `y=350` (16/400, š=295), tlačítka `y=643`.
- ~~**Mood Selector:** nadpis `y=118`, text `y=176`, diagram střed ~`y=452`.~~ *(odstraněno — AI Act zakazuje rozpoznávání emocí; karta se ve feedu nezobrazuje)*
- **Vibe Coding (Quest):** kapitola `y=532`, nadpis `y=585`, text `y=646`, chevron `y=732`.
- **Fun fact:** nadpis `y=436`, text `y=516`, obrázek `y=95` (320×293).
- **Najdi chybu:** tvrzení `y=526`, kontext `y=636`, obrázek `y=95` (318×381).
- **Historická osobnost:** jméno `y=467`, text `y=527`, obrázek `y=95` (321×337).
- **Aktivita:** nadpis `y=236`, 3D `y=277`.
- **Algoritmus (Hra života):** kapitola `y=532`, nadpis `y=585`, text `y=647`, 3D `y=96` (321×322).
- **Shrnutí:** nadpis `y=363`, řádky statistik `y=415/456/498`, odkaz `y=544`, text `y=624`, chevron `y=732`.
- **Rychlá výzva:** dotaz `y=417`, podtext `y=477`, tlačítka od `y=577` (2 sloupce 111×55). Kolečko časovače `y=127`.

> Postup: nejdřív systémové tokeny (okraj 40, badge, typo, menu), pak karta po kartě dorovnat Y-pozice podle tabulky výše.

## Responzivita (zmenšování na užších displejích)

Design je laděný na **referenční šířku 402 px**. Na užších displejích se prvky
**plynule zmenšují**, nad 402 už nerostou (aby nevypadaly nafouklé).

- Škálovací jednotka v CSS: `--u: min(1px, 100vw / 402)`.
  - Na 402 px a víc → `--u = 1px` (referenční velikosti).
  - Na 360 px → `--u ≈ 0.896px` (vše ~90 %). Např. H1 40 → 35.8 px.
- **Velikosti se násobí** touto jednotkou: `font-size: calc(40 * var(--u))`.
  Platí pro: typografii (`g-h1…g-caps`), badge, číslo kapitoly, šipku (chevron),
  tlačítka kvízu/Argumentuj, dechové kolečko, časovač, řádky shrnutí.
- **Svislé pozice** zůstávají v `%` (drží napříč výškami) a **vodorovný okraj 40 px**
  je pevný (kotví „červenou čáru", ke které se zarovnává text i vložené HTML).
- **Text u karet se šipkou** má třídu `reserve-chevron` (`right: calc(78 * var(--u))`),
  aby nezajížděl pod šipku vpravo dole.
- **Vložené HTML (hry/vizualizace)** vyplní svůj rám a při změně velikosti se
  přepočítají přes `ResizeObserver` (viz `glitches/aktivita/README.md`).

> Pravidlo pro nové prvky: nikdy nepiš pevné `px` u velikostí — vždy `calc(N * var(--u))`,
> kde `N` je hodnota z Figmy (v referenčních 402 px). Okraj 40 px a `%`-pozice nech pevné.

## Patička karty (nápověda + akční tlačítko dole)

Obecné pravidlo pro **interaktivní Glitche s pokynem a CTA** (dechové cvičení a
další podobné typy): pokyn („Pohodlně se usaď…") a tlačítko („Začít") **nepatří
doprostřed k obsahu, ale dolů** — do patičky ukotvené u spodní hrany karty.

- Třída **`.card-footer`**: `position:absolute; left:40; right:40; bottom: calc(40*var(--u));`
  `display:flex; flex-direction:column; align-items:center; gap: calc(16*var(--u));`
- Interaktivní prvek (kolečko, diagram) drží nad patičkou (jeho kontejner má
  `bottom` s rezervou, aby se nepřekrýval s patičkou).
