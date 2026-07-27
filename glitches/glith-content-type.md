# Glitch — Typy obsahových karet (zadání pro Claude Code)

Zdroj: Figma „Glitch" (BkGKbtWymuDbuIQ3cBIeLW), stránka „Glitch 2.0". Extrahováno 2026-07-08.
Design tokeny (barvy, typografie): viz `glitch-design-tokens.md`.

## Společné prvky všech karet

- Viewport: mobil 402 × 874 px, karta = celá obrazovka feedu (vertikální swipe mezi kartami).
- **Badge kategorie** vpravo nahoře: žlutý pill (`Yellow`, radius plný), černý text, styl `glitch_caps`/`glitch_category`. Text = název typu („Wellbeing", „Rychlá výzva"…).
- **Navigační šipka** vpravo dole: žlutý pixelový chevron dolů (`Yellow`) — přechod na další Glitch. Alternativa: swipe dolů.
- **Spodní lišta**: tmavý pruh (`BlackDark`), výška 56 px, přes celou šířku.
- **Číslo kapitoly** (jen u Quest karet): malý pill s číslem, styl `glitch_chapter-no` (30/600).
- Maskot: pixelová kočka (logo), používá se na Welcome a Shrnutí.

Každý typ má vlastní barvu pozadí. Ve variables jsou jen `Red` a `BlackDark`; ostatní jsou ve Figmě hardcoded (hex níže odečtený ze screenshotů — před implementací potvrdit):

| Typ | Pozadí |
|---|---|
| Welcome, Mood Selector, Shrnutí | `WhiteWhite` |
| Dechové cvičení, Hra na pozornost, Algoritmus | `BlackDark` |
| Rychlá výzva | `Red` (#FF7171) |
| Historická osobnost | modrá ~#6490FF |
| Najdi chybu | fialová ~#70558D |
| Fun fact | zelenomodrá ~#558D86 |
| Glitch Quest (intro) | fullscreen obrázek |

---

## 1. Welcome (onboarding)

Účel: první karta po otevření aplikace, uvítání a vysvětlení navigace.

- Pozadí bílé, uprostřed logo GLiTCh (pixelová kočka + logotyp).
- H1 (`glitch_H1`): „Vítej v Glitchi!"
- Odstavec (`glitch_p`): instrukce k navigaci (šipka / swipe dolů).
- Bez badge kategorie. Žlutá šipka vpravo dole.
- Interakce: pouze pokračování dál.

## 2. Mood Selector (Wellbeing)

Účel: denní check-in; vstup pro personalizaci feedu.

- Badge: „Wellbeing". Pozadí bílé.
- H1: „Jak se teď cítíš?" + instrukční odstavec.
- 2D diagram: osa Y = ENERGIE (0–100), osa X = SOUSTŘEDĚNÍ (0–100). Tenké černé osy, popisky `glitch_caps`.
- Interakce: uživatel potažením umístí černou tečku (⌀ ~45 px) do diagramu. Hodnota (x, y) se uloží a ovlivní výběr Glitchů pro daný den.
- Dole žlutý maskot-ikona (potvrzení/pokračování).
- Zdrojový soubor v html: https://github.com/aidetemcz/glitch/blob/claude/glitch-refactor-fgexm8/assets/3Dvizualizations/mood.html

## 3. Dechové cvičení (Wellbeing)

Účel: krátká mindfulness aktivita.

- Badge: „Wellbeing". Pozadí `BlackDark`, text bílý.
- H1: „Dechové cvičení" + odstavec s vysvětlením přínosu.
- Ovládání počtu cyklů: kroužek s hodnotou „0/7", tlačítka − / + po stranách.
- Střed: velký šedý kruh (`Grey15`, ⌀ ~178 px) s číslem — při cvičení animovaně roste/zmenšuje se v rytmu dechu a odpočítává.
- Instrukce (`glitch_p-s`): „Pohodlně se usaď a stiskni tlačítko začít."
- CTA: bílé tlačítko „Začít" (radius ~8, text černý).
- Zdrojový soubor v html: https://github.com/aidetemcz/glitch/blob/claude/glitch-refactor-fgexm8/assets/3Dvizualizations/breathing-excercise.html

## 4. Glitch Quest — intro karta

Účel: vstup do tematického celku (Quest), např. „Vibe Coding".

- Badge: název Questu. Pozadí: fullscreen atmosférický obrázek.
- Vlevo nad titulkem pill s číslem kapitoly (`glitch_chapter-no`).
- H1 bílý: název Questu. Odstavec bílý: anotace (co se žák dozví).
- Interakce: tap/šipka otevře obsah Questu (chat, viz typ 5).

## 5. Quest chat (obsah Glitche)

Účel: samotné mikro-učení — obsah servírovaný jako chat, napojení na platformu Tiny.

- Vlastní layout (ne karta feedu): světlé pozadí.
- Header: šipka zpět ‹, titulek „{Quest} · {Glitch}" (`glitch_category`), badge kapitoly vpravo.
- Zprávy: bublinky s krátkými odstavci učiva (`glitch_p`), postupné odkrývání.
- Poslední zpráva vyzývá k dotazu.
- Footer: input „Zeptej se na {téma}..." (pill, `Grey15` okraj, placeholder `Grey50`) + kulaté žluté odesílací tlačítko ›.
- Interakce: volné dotazy → odpovídá chatbot (Tiny).

## 6. Rychlá výzva (kvíz)

Účel: rychlá kognitivní rozcvička — počítání, logika, hádanka.

- Badge: „Rychlá výzva". Pozadí `Red`, text bílý.
- Volitelný časovač: bílé kolečko vlevo nahoře + text „Pokud chceš, můžeš si zapnout časovač. Stačí kliknout na kolečko." — časovač je OPT-IN, nikdy nespouštět automaticky.
- Zadání: velký text `glitch_H1` (např. „310×15=") nebo delší text `glitch_p`, podotázka `glitch_p-s`.
- Odpovědi: 2×2 nebo 1×N mřížka bílých tlačítek se zaoblenými rohy (radius ~12), text černý `glitch_H3`/`glitch_p`.
- Interakce: výběr odpovědi → okamžitá zpětná vazba správně/špatně. Varianty zadání: výpočet, slovní úloha, obrazec (SVG/obrázek + otázka „Kolik trojúhelníků…").

## 7. Hra na pozornost

Účel: krátká interaktivní hra (např. označování děr na 3D objektu).

- Badge: „Hra na pozornost". Pozadí `BlackDark`, text bílý.
- Opt-in časovač stejně jako u Rychlé výzvy (bílé kolečko + instrukce).
- H1/H3: zadání hry („Kolik zvládneš označit děr v časovém limitu?").
- Střed: interaktivní 3D objekt (koule s děrami) — tap označuje cíle.
- Dole žlutý maskot-ikona.
- Zdrojový soubor v html: https://github.com/aidetemcz/glitch/blob/claude/glitch-refactor-fgexm8/assets/3Dvizualizations/sphere-holes.html

## 8. Algoritmus (animace)

Účel: vizuální demonstrace konceptu, žák pozoruje a formuluje pravidla.

- Badge: název tématu (např. „Algoritmus"). Pozadí `BlackDark`, text bílý.
- Nahoře: velká animovaná plocha (např. Hra života — mřížka buněk, běžící simulace).
- Pill s číslem kapitoly + H1 (název, např. „Hra života") + odstavec s výzvou („Dokážeš pravidla popsat?").
- Interakce: sledování animace; otázka může vést do chatu.

## 9. Historická osobnost

Účel: seznámení s osobností oboru + konverzace s AI personou.

- Badge: „Historická osobnost". Pozadí modré (~#5b7fe8), text bílý.
- Nahoře: fotografie osobnosti (černobílá, zaoblené rohy).
- H1: jméno („Alan Turing"). Odstavec: kdo to byl + výzva k rozhovoru; může obsahovat easter egg (upravená fotka).
- Interakce: tap → chat s personou (stejná chat šablona jako typ 5).

## 10. Najdi chybu

Účel: kritické myšlení / prebunking — žák odhaluje nepravdivé tvrzení.

- Badge: „Najdi chybu". Pozadí fialové (~#7a5f96), text bílý.
- Nahoře: obrázek k tvrzení.
- Tvrzení s chybou: výrazný tučný text (`glitch_H3` tučně), např. „Šokující! Autorem první neuronové sítě byl český zpěvák Karel Gott!"
- Pod ním menší text (`glitch_p-s`) s pravdivými fakty/kontextem.
- Interakce: žák má chybu identifikovat (tap na chybnou část / odhalení opravy).

## 11. Fun fact

Účel: zajímavost pro zpestření feedu, bez úkolu.

- Badge: „Fun fact". Pozadí zelenomodré (~#4e8f7b), text bílý.
- Nahoře: ilustrace na kontrastním podkladu (růžová dlaždice se zaoblenými rohy).
- Titulek `glitch_H3` tučně: jádro faktu („První počítačový bug byla můra.")
- Odstavec `glitch_p-s`: rozvedení příběhu.
- Interakce: jen čtení a posun dál.

## 12. Shrnutí (konec dne)

Účel: uzavření denní session, rekapitulace pokroku, zdravý limit používání.

- Badge: „Shrnutí". Pozadí bílé, maskot nahoře.
- H2/H3: „Tvé shrnutí pro dnešek".
- Statistiky jako řádky oddělené linkami (`Grey15`): Vyřešených Glitchů / Splněných Questů / Zvládnutých výzev + hodnota vpravo (`glitch_p`).
- Odkaz „Zobrazit dlouhodobé statistiky" (`Grey50`).
- Závěrečný text: denní limit — **max 20 Glitchů denně**, „Sociální sítě by neměly brát příliš tvé pozornosti. Těšíme se na tebe třeba zítra!" Po této kartě feed končí, žádný infinite scroll.

---

## Datový model (návrh)

```ts
type GlitchType =
  | "welcome"
  | "mood_selector"
  | "breathing"
  | "quest_intro"
  | "quest_chat"
  | "quick_challenge"
  | "attention_game"
  | "algorithm_demo"
  | "historical_persona"
  | "spot_the_mistake"
  | "fun_fact"
  | "daily_summary";

interface Glitch {
  id: string;
  type: GlitchType;
  category: string;        // text badge, např. "Wellbeing"
  chapterNo?: number;      // jen quest karty
  questId?: string;        // vazba na Quest
  title: string;           // H1/H3
  body?: string;           // odstavec
  imageUrl?: string;
  // quick_challenge
  question?: string;
  answers?: { label: string; correct: boolean }[];
  timerSeconds?: number;   // opt-in, default vypnuto
  // chat
  chatMessages?: string[];
  chatbotContext?: string; // prompt pro Tiny
}
```

## Zásady (neporušovat)

1. Denní limit 20 Glitchů — po Shrnutí feed končí, žádný infinite scroll.
2. Časovače jsou vždy opt-in, nikdy automatické.
3. Žádné veřejné metriky srovnávání (lajky, žebříčky) — statistiky jsou jen osobní.
4. Wellbeing karty (mood, dýchání) jsou součástí feedu, ne přeskočitelný „nice to have".
