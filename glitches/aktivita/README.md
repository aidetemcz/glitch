# Aktivita

Interaktivní Glitch, kde dítě v **časovém limitu** označuje díry na 3D kouli.
Cvičí pozornost, prostorovou orientaci a soustředění.

## Tok interakce

1. **Nahoře kolečko časovače** + návod (jen poprvé): *„Až budeš připravený*á, zapni si časovač. Stačí kliknout na kolečko."*
2. **Nadpis** — *„Kolik zvládneš označit děr v časovém limitu?"* (styl `glitch_H3`).
3. **Návod k ovládání** (bílý text): *„Tažením otáčíš kouli. Díry označíš ťuknutím. Ale pozor: označit lze jen díry, které jsou vpředu."*
4. **Počítadlo** vlevo pod návodem: *„Označených děr: X/X"* (živě z hry).
5. **3D koule** — táhnutím se otáčí, ťuknutím se označí díra otočená k divákovi.

## Časovač (kolečko)

- Plné bílé kolečko **bez číselného údaje**. Dokud neběží, jemně **pulzuje a občas glitchne** (RGB rozklad) — signál, že je interaktivní.
- **Klik = start**: kolečko se po směru hodinových ručiček „ukrajuje" (conic sweep) po dobu limitu (aktuálně **30 s**). Zároveň se **vynuluje** počet a **odemkne** označování.
- **Klik během běhu = stop** kdykoliv. Po vypršení limitu se označování **zamkne**.
- Návod (bod 1) se ukáže jen do prvního spuštění (pamatuje si `localStorage: glitch_attn_used`).

## Pravidla pro vkládání HTML obsahu (her / vizualizací) do karet

Platí pro **každou** kartu, která vkládá interaktivní HTML přes `<iframe>` (koule,
Game of Life a budoucí hry vkládané v editoru). Cíl: obsah **vždy hezky sedí a
nepřetéká okraje**.

**Umístění a rám (řeší karta, ne hra):**
1. Rám hry sedí do **textového sloupce** — levý i pravý okraj **40 px**. Nikdy ne na celou šířku karty.
2. Výchozí tvar je **čtverec** (`aspect-ratio: 1/1`) v rámci okrajů. Rám má `overflow: hidden`.
3. Rám se pozicuje na svislou souřadnici karty (viz `docs/layout-spec.md`), typicky pod texty.

**Obsah hry (řeší vkládané HTML):**
4. `html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; }` — **žádné posuvníky**, žádné vlastní okraje/rámečky/max-width.
5. Plátno/scéna = **100 % rámu** (`width:100%; height:100%`), nikdy větší. Reaguje na skutečnou velikost rámu (`resize` / `ResizeObserver`) a obsah **vycentruje**.
6. **Obsah vyplní celý rám a je zarovnaný s okrajem textu (40 px).** Nesmí uvnitř „plavat" s vlastním odsazením — vizuál má sahat až k hraně sloupce (viz Game of Life: mřížka jde k okraji). U 3D (three.js) tomu odpovídá vzdálenost kamery — objekt nastav tak, aby jeho silueta **vyplnila rám** (u čtverce se dotkla všech stran). Perspektivní FOV je svislý — objekt škáluj podle kratší strany.
7. Pozadí transparentní nebo shodné s kartou.
8. Ovládání dotykem: `touch-action: none`; rozliš **tažení vs. ťuknutí** (práh ~6 px).

**Komunikace s kartou (volitelné):**
9. Skóre/stav posílej přes `postMessage` se jmenným prostorem (`ns`) daného glitche.
10. Karta smí hře posílat příkazy (`reset` / `lock` / `unlock` / `sync`); hra na `sync` odpoví aktuálním stavem.

**Pozn.:** three.js se u koule načítá z CDN — na produkci OK, v izolovaném sandboxu je blokované (koule se nevykreslí, logika ale funguje).

## Soubory

- Vizualizace: `assets/3Dvizualizations/sphere-holes.html` (koule), `game-of-life.html` (algoritmus).
- Renderer karty + časovač: `js/feed.js` (`attention_game`, `initAttention`).
- Styly: `css/glitch.css` (sekce „Aktivita").
