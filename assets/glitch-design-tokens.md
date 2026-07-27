# Glitch — Design Tokens

Zdroj: Figma soubor „Glitch" (BkGKbtWymuDbuIQ3cBIeLW), stránka „Glitch 2.0". Extrahováno 2026-07-08.

## Barvy (Color Variables)

| Token | Hex | Použití (dle návrhu) |
|---|---|---|
| `BlackBlack` | `#000000` | Čistá černá |
| `BlackDark` | `#1a1a1a` | Hlavní tmavá — pozadí/text |
| `WhiteWhite` | `#ffffff` | Bílá |
| `Grey15` | `#d0d0d0` | Světle šedá — linky, sekundární prvky |
| `Grey50` | `#747474` | Střední šedá — sekundární text |
| `Yellow` | `#ffff00` | Akcent — primární brand barva |
| `Red` | `#ff7171` | Akcent červená (Rychlá výzva) |
| `Red15` | `#ffcfcf` | Světle červená — pozadí |

### CSS

```css
:root {
  --color-black: #000000;        /* BlackBlack */
  --color-black-dark: #1a1a1a;   /* BlackDark */
  --color-white: #ffffff;        /* WhiteWhite */
  --color-grey-15: #d0d0d0;      /* Grey15 */
  --color-grey-50: #747474;      /* Grey50 */
  --color-yellow: #ffff00;       /* Yellow */
  --color-red: #ff7171;          /* Red */
  --color-red-15: #ffcfcf;       /* Red15 */
}
```

## Font Styles (Typography)

Všechny styly používají font **Inter**. `letterSpacing: -4` ve Figmě = **-4 %** → v CSS `-0.04em`. `lineHeight: 100` = 100 %.

| Token | Řez | Velikost | Váha | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| `glitch_H1` | Semi Bold | 40 px | 600 | 100 % | -4 % |
| `glitch_chapter-no` | Semi Bold | 30 px | 600 | 100 % | -4 % |
| `glitch_H3` | Semi Bold | 25 px | 600 | 100 % | -4 % |
| `glitch_category` | Semi Bold | 16 px | 600 | 100 % | -4 % |
| `glitch_p` | Regular | 16 px | 400 | 22 px | -4 % |
| `glitch_p-s` | Regular | 15 px | 400 | 100 % | -4 % |
| `glitch_caps` | Regular | 15 px | 400 | 100 % | 0 |

### CSS

```css
/* Základ */
body {
  font-family: "Inter", sans-serif;
}

.glitch-h1 {
  font-size: 40px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.04em;
}

.glitch-chapter-no {
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.04em;
}

.glitch-h3 {
  font-size: 25px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.04em;
}

.glitch-category {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.04em;
}

.glitch-p {
  font-size: 16px;
  font-weight: 400;
  line-height: 22px; /* 1.375 */
  letter-spacing: -0.04em;
}

.glitch-p-s {
  font-size: 15px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.04em;
}

.glitch-caps {
  font-size: 15px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase; /* dle názvu stylu; ve Figmě řešeno velkými písmeny v textu */
}
```

## Poznámky

- `glitch_H2` se na stránce „Glitch 2.0" nikde nepoužívá — pokud ve Figmě existuje, není aplikovaný na žádnou vrstvu, takže ho nástroj nevrátil.
- Škála skáče 40 → 30 → 25 px; chybí mezistupeň H2 (~30 px se používá jako `chapter-no`).
- Doporučení pro Claude Code: vložit tento soubor do projektu (např. `docs/design-tokens.md`) a odkázat na něj z `CLAUDE.md`.
