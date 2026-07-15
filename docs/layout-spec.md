# Glitch feed — layout spec

Zdroj pravdy: Figma **„Glitch 2.0"** (`BkGKbtWymuDbuIQ3cBIeLW`). Hodnoty čteny přes Figma konektor (Dev Mode). Poslední sync: 2026-07-15.

## Rám a plochy

- **Karta = 402×874** (mobil). V kódu je feed `max-width: 480px`, ale všechny poměry drží z 402.
- **Obsah karty:** 0–818 px. **Spodní menu:** 818–874 (výška **56 px**).
- **Levý okraj obsahu: 40 px** (texty začínají na `x≈39–41`). *(Dřív jsme měli 28 px — to rozhazovalo vše.)*

## Badge (dva: trust + kategorie)

Vpravo nahoře, zarovnané doprava.

- **Pozice:** `top: 26`, pravý okraj v `x=377` → **right: 25**, **výška: 26**, **radius: 5**, **mezera mezi nimi ~9**.
- **Trust** (Core / Generováno / …): pozadí **bílé**, text **grey50 `#747474`**, styl `glitch_category`.
- **Kategorie** (Argumentuj, Wellbeing…): pozadí **žluté `#ffff00`**, text **`#1a1a1a`**, styl `glitch_category`.
- Karty *About Glitch* a *Welcome* badge nemají.

## Typo styly (Figma)

| styl | font | velikost | řádkování | tracking | použití |
|---|---|---|---|---|---|
| `glitch_H1` | Inter 600 | 40 | 1.0 | -0.04em | krátké titulky (Vítej, Jak se cítíš, Vibe Coding) |
| `glitch_H2` | Inter 600 | 30 | 1.0 | -0.04em | delší tvrzení/titulky (Argumentuj, Najdi chybu, Fun fact) |
| `glitch_category` | Inter 600 | 16 | 1.0 | -0.04em | badge |
| `glitch_p` | Inter 400 | 16 | 22 px | -0.04em | běžný text / podtext |

## Spodní menu

- Výška **56**, pozadí **`#1a1a1a`**, horní obrys **2 px** (barvu drží pokyn: `#747474`).
- 5 položek: Feed · Boardy · **+** (žluté kolečko ~34) · Hledat · Profil.
- Avatar **34 px** kruh + 2 px bílá outline. Ikony ~24–25 px, přebarvení: aktivní žlutá, neaktivní bílá.

## Tlačítka (výběr — typ Argumentuj)

- **134×47**, border **1 px solid `#000`**, radius **5**, text `glitch_p` (16/400) na střed, barva `#1a1a1a`.
- Dvojice vedle sebe od `left: 40`, mezera 27, `top: 643`.

## Přesné Y-souřadnice karet (z Figmy)

Referenční pozice hlavních prvků (px od horního okraje karty). Slouží pro srovnání jednotlivých karet.

- **About Glitch:** logo skupina `y=159` (v=227), nadpis „Vítej…" `y=586`, text `y=646`, chevron `y=732`.
- **Argumentuj:** tvrzení `y=216` (30/600, š=330), podtext `y=350` (16/400, š=295), tlačítka `y=643`.
- **Mood Selector:** nadpis `y=118`, text `y=176`, diagram střed ~`y=452`.
- **Vibe Coding (Quest):** kapitola `y=532`, nadpis `y=585`, text `y=646`, chevron `y=732`.
- **Fun fact:** nadpis `y=436`, text `y=516`, obrázek `y=95` (320×293).
- **Najdi chybu:** tvrzení `y=526`, kontext `y=636`, obrázek `y=95` (318×381).
- **Historická osobnost:** jméno `y=467`, text `y=527`, obrázek `y=95` (321×337).
- **Hra na pozornost:** nadpis `y=236`, 3D `y=277`.
- **Algoritmus (Hra života):** kapitola `y=532`, nadpis `y=585`, text `y=647`, 3D `y=96` (321×322).
- **Shrnutí:** nadpis `y=363`, řádky statistik `y=415/456/498`, odkaz `y=544`, text `y=624`, chevron `y=732`.
- **Rychlá výzva:** dotaz `y=417`, podtext `y=477`, tlačítka od `y=577` (2 sloupce 111×55). Kolečko časovače `y=127`.

> Postup: nejdřív systémové tokeny (okraj 40, badge, typo, menu), pak karta po kartě dorovnat Y-pozice podle tabulky výše.
