# Najdi chybu

Rozklikávací Glitch pro kritické myšlení / prebunking. Má dítě upoutat výrazným (nepravdivým) tvrzením.

## Tok interakce

1. **Karta ve feedu** — výrazné tvrzení s chybou + obrázek (upoutání).
2. **Rozklik → multichoice kvíz** — dítě zaklikne, které informace jsou chyba (více možností).
3. **Vyhodnocení** — co bylo správně/špatně označeno.
4. **Vysvětlení** — jak to je doopravdy.
5. **Chat** — možnost popovídat si o tom s chatbotem.

## Navrhovaná struktura souboru *(k doladění)*

- **0 Identifikace** — id, název, verze, jazyk, stav důvěry.
- **1 Karta ve feedu** — štítek „Najdi chybu", obrázek, chybné tvrzení (tučně), kontext (menší text).
- **2 Kvíz** — seznam tvrzení/částí, u každé `chyba: true|false`; vyhodnocení.
- **3 Vysvětlení** — pravdivá verze + proč je omyl lákavý.
- **4 Kontext pro chatbota** — fakta, hranice tématu, co bot nesmí.
- **6 Bezpečnost.**

Soubory: `{tema}-{nazev}.md`, např. `ai-perceptron-karel-gott.md`.
