# Glitch — typy obsahu (přehled)

Samostatný přehled typů obsahu pro tvorbu Glitchů. Kompletní dokument — dá se číst i mimo repozitář.

## Co je Glitch

**Glitch = jedna celoobrazovková karta ve vertikálně swipovaném feedu** (jako TikTok, ale učí). Každý Glitch je jeden Markdown soubor. Aplikace je „vzdělávací sociální síť" pro děti — vypadá jako sociální síť, učí jako hra.

**Nepřekročitelné zásady:**
- **Denní limit 20 Glitchů** — po kartě Shrnutí feed končí, žádný nekonečný scroll.
- **Časovače jsou vždy opt-in**, nikdy automatické.
- **Žádné veřejné srovnávání** (lajky, žebříčky) — statistiky jsou jen osobní.
- **Wellbeing karty** (mood, dýchání) jsou součást feedu, ne přeskočitelný bonus.

**Stav důvěry každé karty:** `core → edited → community → generated` (určuje označení karty a režim servírování).

---

## Typy obsahu

Obsah se dělí do 7 typů (= složky v `glitches/`). Legenda: **Rozklik** = karta se dá otevřít do hloubky · **Chatbot** = navazuje konverzace s Tinybotem.

| # | Typ | Složka | Rozklik | Chatbot | Stav schématu |
|---|---|---|:---:|:---:|---|
| 1 | Basic Glitch | `basic-glitch/` | ✅ | ✅ | ✅ hotovo |
| 2 | Rychlá výzva | `rychla-vyzva/` | ❌ | ❌ | ✅ hotovo |
| 3 | Wellbeing | `wellbeing/` | ⚙️ interakce | ❌ | ✅ hotovo |
| 4 | Fun fact | `funfact/` | ✅ | ✅ | ⬜ k dopracování |
| 5 | Najdi chybu | `najdi-chybu/` | ✅ | ✅ | ⬜ k dopracování |
| 6 | Historická osobnost | `historicka-osobnost/` | ✅ | ✅ | ⬜ k dopracování |
| 7 | Argumentuj | `argument/` | ✅ | ✅ | ✅ hotovo |

> **Systémové karty** (Welcome, Shrnutí) nejsou obsah — jsou součást aplikace, nemají složku.

---

### 1. Basic Glitch

**Jádro vzdělávacího obsahu** (Algoritmus, Vibe Coding, …). Pokrytí informatiky pro 2. stupeň ZŠ.

- **Organizace:** podsložka = **téma = kapitola = Quest**. Glitche v questu jsou **lineárně řazené** (děti procházejí Quest za Questem).
- **Rozklik:** dítě otevře kartu do vrstev (pozorování → výklad → kvíz).
- **Chatbot:** Tinybot v „boardu" po forku Glitche, omezený na téma.
- **Úrovně vypracování:** 🟢 jednoduchá / 🟡 střední / 🔴 master — dítě si volí; hodnotí LLM zkoušející formativně (ne skóre).

**Struktura souboru:**
- *Kontrakt* (skrytý, redakční): výukový cíl, povinné body, kanonická otázka + odpověď, zakázaná tvrzení / miskoncepce.
- *Podání* (viditelné): karta ve feedu + rozklikové vrstvy + kvíz.
- *Úrovně vypracování* + kritéria hodnocení.
- *Kontext pro Tinybota* (skrytý): fakta, hranice tématu, scaffolding (jak napovídat), co bot nesmí.
- *Bezpečnost a věková přiměřenost.*

---

### 2. Rychlá výzva

**Nerozklikávací** kognitivní rozcvička. Dítě splní výzvu přímo na kartě (vybere odpověď), dostane okamžitou zpětnou vazbu a scrolluje dál. Žádný rozklik, žádný chatbot.

- **Varianty zadání:** `vypocet` (např. „310×15="), `slovni-uloha` (delší text), `obrazec` (SVG/obrázek + otázka, např. „Kolik trojúhelníků…").
- **Odpovědi:** tlačítka (rozložení 2×2 / 1×N / řada), právě jedna správná.
- **Časovač:** opt-in (dítě si ho může zapnout kliknutím na kolečko), nikdy automaticky.

---

### 3. Wellbeing

**Interaktivní karty** — denní selectory a krátké hry. Součást feedu. Bez chatbota.

- **`mood_selector`** — denní check-in: dítě potažením umístí tečku do diagramu (osy ENERGIE × SOUSTŘEDĚNÍ). Hodnota personalizuje výběr Glitchů pro daný den.
- **`breathing`** — dechové cvičení: nastavitelný počet cyklů, animované fáze nádech / zadrž / výdech.
- **`attention_game`** — hra na pozornost: interaktivní 3D objekt (např. označování děr na kouli), opt-in časovač.

**Zásady:** časovače opt-in, žádné srovnávání, emoční data se neukládají jako signál.

---

### 4. Fun fact

**Rozklikávací** zajímavost pro zpestření feedu, bez úkolu.

**Tok interakce:**
1. **Karta ve feedu** — jádro faktu (tučný titulek) + ilustrace, krátké rozvedení. *(Např. „První počítačový bug byla můra.")*
2. **Rozklik → vysvětlení konceptu** — hlubší kontext, souvislosti.
3. **Chat** — možnost popovídat si o tom s chatbotem.

*(Schéma souboru: k dopracování — identifikace, karta, vysvětlení konceptu, kontext pro chatbota, bezpečnost.)*

---

### 5. Najdi chybu

**Rozklikávací** Glitch pro kritické myšlení / prebunking. Má dítě upoutat výrazným (nepravdivým) tvrzením.

**Tok interakce:**
1. **Karta ve feedu** — výrazné tvrzení s chybou + obrázek. *(Např. „Šokující! Autorem první neuronové sítě byl český zpěvák Karel Gott!")*
2. **Rozklik → multichoice kvíz** — dítě zaklikne, které informace jsou chyba (více možností).
3. **Vyhodnocení** — co bylo správně/špatně označeno.
4. **Vysvětlení** — jak to je doopravdy a proč je omyl lákavý.
5. **Chat** — možnost popovídat si s chatbotem.

*(Schéma souboru: k dopracování — identifikace, karta, kvíz s označením chyb, vyhodnocení, vysvětlení, kontext pro chatbota, bezpečnost.)*

---

### 6. Historická osobnost

**Rozklikávací** Glitch — seznámení s osobností oboru + konverzace s AI personou.

**Tok interakce:**
1. **Karta ve feedu** — fotografie osobnosti (Č/B, zaoblené rohy), jméno, krátký úvod + výzva k rozhovoru. Možný easter egg (upravená fotka).
2. **Rozklik → chat s personou** — dítě si povídá s AI, která vystupuje jako daná osobnost.

*(Schéma souboru: k dopracování — identifikace, karta, persona/kontext pro chatbota (kdo osobnost byla, tón, co ví/neví, hranice), bezpečnost.)*

---

### 7. Argumentuj

**Rozklikávací** Glitch pro **argumentaci a kritické myšlení** — portace Tinybota „Argumentuj" z tiny.school. Neučí „správný názor", ale **dobře argumentovat**. Bez forku.

**Tok interakce:**
1. **Karta ve feedu** — názorové tvrzení (tučně) + tlačítka **Souhlasím / Nesouhlasím**.
2. **Volba postoje** dá botovi úvodní info o postoji dítěte.
3. **Rozklik → chat** — Tinybot vede krátkými větami: proč → příklad → protiargument druhé strany → shrnutí postoje.
4. **Uložení** — signály o kvalitě argumentace jdou do profilu a do Tiny jako důkaz o učení (ne samotný názor).

Kompletní schéma: **`argument/README.md`**.

---

## Formát souborů (společné)

- Každý Glitch = **jeden MD soubor**: **frontmatter (YAML)** = strojová data (identifikace, karta, kvíz, konfigurace, metadata) + **tělo (Markdown)** = delší text pro dítě / redakci / chatbota.
- **Pojmenování:** kebab-case slug bez diakritiky, `{tema}-{nazev}.md`; slug = pole `id`.
- ⚠️ **YAML:** text s čárkou nebo dvojtečkou dávej do uvozovek (`"nikdo, vznikají z pravidel"`), jinak se hodnota rozbije.

**Cíl do budoucna:** editor, kde autor zvolí typ Glitche a vyplní obsah přes formulář — výstupem je právě takový MD soubor v příslušné složce.
