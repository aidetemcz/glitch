# Glitch — typy obsahu (přehled)

_Samostatný přehled typů obsahu pro tvorbu Glitchů. Dřív Google Docs, teď zdroj pravdy tady. Poslední převod: 2026-07-15._

## Co je Glitch

Glitch = jedna celoobrazovková karta ve vertikálně swipovaném feedu. Každý Glitch je jeden Markdown soubor. Aplikace je „vzdělávací sociální síť" pro děti i dospělé — vypadá jako sociální síť.

## Nepřekročitelné zásady

- **Denní limit 20 Glitchů** — po kartě Shrnutí feed končí, žádný nekonečný scroll.
- **Časovače jsou vždy opt-in**, nikdy automatické.
- **Žádné veřejné srovnávání** (lajky, žebříčky) — statistiky jsou jen osobní.
- **Wellbeing karty** (mood, dýchání) jsou součást feedu, ne přeskočitelný bonus.

## Stav důvěry (Trust State)

Stav důvěry je informace pro uživatele o autorství konkrétního Glitche. Jsou 4 stavy:

- **Core** → Glitch vytvořený námi.
- **Edited** → Glitch, který byl původně vytvořený námi, ale uživatel ho forknul a dotvořil.
- **Community** → Glitch vytvořený uživatelem nebo skupinou uživatelů.
- **Generated** → Plně generovaný Glitch (chceme takový? spíš otázka do budoucna).

## Meta informace

1. Výukový cíl
2. Kritéria hodnocení (ve třech úrovních)
3. Kanonická otázka
4. Source of Truth

## Source of Truth

Každá karta Glitche obsahuje v metainfo **source of truth** — texty s ověřenými fakty, ze kterých chatbot čerpá, když se baví s uživatelem. Metainfo není třeba u Glitchů, které nejsou rozklikávací nebo neobsahují chatbota.

## Relace

Základní relace je **24 hodin**. To je doba, kdy má Glitch uložená citlivá data (o náladě, soustředění, pozornosti) o uživatelském chování — a pak je maže. Data s výsledky žáků nejsou považována za citlivá; slouží k formativnímu hodnocení posunu uživatele a jdou do uživatelského profilu jak v Glitch, tak v Tiny (pokud je uživatel na obou platformách).

## Typy obsahu

Obsah se dělí do **7 typů** (= složky v `glitches/`). Legenda: **Rozklik** = karta se dá otevřít do hloubky · **Chatbot** = navazuje konverzace s Tinybotem.

| # | Typ | Složka | Návrh karty | Rozklik | Chatbot | Fork |
|---|---|---|---|:---:|:---:|:---:|
| 1 | Basic Glitch | [`basic-glitch/`](../glitches/basic-glitch) | [karta](./karta-basic-glitch.md) | ano | ano | ano |
| 2 | Rychlá výzva | [`rychla-vyzva/`](../glitches/rychla-vyzva) | [karta](./karta-rychla-vyzva.md) | ne | ne | ne |
| 3 | Wellbeing | [`wellbeing/`](../glitches/wellbeing) | [karta](./karta-wellbeing.md) | někdy | ne | ne |
| 4 | Fun fact | [`funfact/`](../glitches/funfact) | [karta](./karta-funfact.md) | ano | ano | ano |
| 5 | Najdi chybu | [`najdi-chybu/`](../glitches/najdi-chybu) | [karta](./karta-najdi-chybu.md) | ano | ano | ano |
| 6 | Historická osobnost | [`historicka-osobnost/`](../glitches/historicka-osobnost) | [karta](./karta-historicka-osobnost.md) | ano | ano | ano |
| 7 | Argumentuj | [`argument/`](../glitches/argument) | [karta](./karta-argument.md) | ano | ano | ne |

> **Návrh karty** = šablona sekcí + konkrétní příklad daného typu (podklad pro redakci i AI asistenta při tvorbě Glitchů).
> **Systémové karty** (Welcome, Shrnutí) nejsou obsah — jsou součást aplikace, nemají složku.

---

### 1. Basic Glitch

Jádro vzdělávacího obsahu (Algoritmus, Vibe Coding, …). Pokrytí informatiky pro 2. stupeň ZŠ. Basic Glitch je záměrně **nejuniverzálnější typ** — unese jakýkoliv obsah, od čistě znalostního výkladu po aplikační tvorbu. Právě proto na něm stojí celý Quest.

**Organizace:** Téma (např. Vibe Coding) → kapitola = **Quest** → jednotlivé Glitche. Glitche v questu jsou **lineárně řazené** a řazení není náhodné — sleduje **Bloomovu taxonomii**.

**Řazení Questu podle Bloomovy taxonomie.** Quest vede dítě od „vím, co to je" k „umím to použít a postavit". Začíná znalostními Glitchi a postupně přechází k aplikačním:

- **Znalostní Glitche** (zapamatovat, porozumět) — na začátku Questu. Dítě si osvojí pojmy, fakta a princip (krátké čtení, kvíz, možnost doptat se bota). Cíl: „vím, co to je, a umím to vysvětlit vlastními slovy."
- **Aplikační Glitche** (aplikovat, analyzovat, hodnotit, tvořit) — v druhé polovině Questu. Dítě znalost použije: napíše, porovná, posoudí, nakonec postaví vlastní artefakt („postav to"). Cíl: „umím to použít na něčem vlastním."

**Aplikační tier Questu — doporučené slotování typů.** Aplikační polovina není jeden krok, ale sekvence: nejdřív **konsolidační / artikulační slot** (typ *Nauč Tinyho* — dítě koncept vysvětlí Tinymu a ubrání ho proti miskoncepcím, otestuje si vlastní porozumění), teprve pak **tvůrčí slot** (Basic Glitch „postav to"). Platí: **učit ≠ aplikovat** — vysvětlení Tinymu nenahrazuje tvorbu artefaktu, předchází jí („když to neumíš vysvětlit Tinymu, nejsi ještě připravený s tím stavět"). Skeleton je doporučený, ne povinný — Bloom je gradient, ne checklist. Pozici Glitche v oblouku (znalostní / konsolidační / aplikační) nese pole v metainfo, aby ji znalo řazení Questu i doporučovací systém.

**Dvě osy Bloomovy progrese (nezaměňovat):**

- **Napříč Questem** — řazení Glitchů od znalostních k aplikačním (viz výše).
- **Uvnitř jednoho Glitche** — úrovně vypracování při forku (jednoduchá / střední / master), které si dítě volí samo. Jednoduchá = použij/porozuměj, střední = analyzuj/porovnej, master = vytvoř forknutelný artefakt.

Struktura je vnořená: Quest dává hrubý oblouk znalost → aplikace, fork úrovně dávají uvnitř každého Glitche ještě jemný oblouk. Autonomii a flow obsluhuje osa forku; systematické pokrytí oboru obsluhuje osa Questu.

**Příklad — Quest „Vibe Coding":**
1. Co je vibe coding — znalostní (zapamatovat): kdo pojem zavedl (Karpathy, 2025), co znamená.
2. Čím se liší od klasického programování — znalostní (porozumět): dítě vysvětlí rozdíl vlastními slovy.
3. Napiš první prompt — aplikační (aplikovat): dítě vytvoří jeden funkční prompt.
4. Proč jeden prompt funguje líp než druhý — aplikační (analyzovat): dítě porovná dva přístupy.
5. Je tenhle výstup AI dobrý? — aplikační (hodnotit): dítě posoudí výsledek podle kritérií.
6. Postav si vlastní mini-knihovnu promptů — aplikační (tvořit): dítě vytvoří vlastní projekt.

**Rozklik:** dítě rozklikne Glitch → krátké čtení s výkladem (max 2–3 odstavce), dole chatbox na doptání. Když se doptá, úvodní text zůstává a pod ním vznikne messenger-like prostředí; chatbot odpovídá v krátkých bublinách. Je-li možný fork, je tam button **STUDOVAT DÁL**.

**Chatbot:** v Glitchi (mluví o tématu) a v Glitchboardu po forku (omezený na kontext Glitche).

**Úrovně vypracování:** jednoduchá / střední / master — dítě si volí; hodnotí LLM zkoušející formativně (ne skóre).

**Struktura souboru:** viz [`karta-basic-glitch.md`](./karta-basic-glitch.md) — kontrakt (skrytý), podání (viditelné), úrovně vypracování + kritéria, kontext pro chatbota (skrytý), bezpečnost. Do metainfo patří i pozice Glitche v Bloomově oblouku Questu.

### 2. Rychlá výzva

Nerozklikávací kognitivní rozcvička. Dítě splní výzvu přímo na kartě, dostane okamžitou zpětnou vazbu a scrolluje dál. Žádný rozklik, žádný chatbot.

- Varianty zadání: `vypocet` („310×15="), `slovni-uloha`, `obrazec` (SVG + otázka).
- Odpovědi: tlačítka (2×2 / 1×N / řada), právě jedna správná.
- Časovač: opt-in, nikdy automaticky.

### 3. Wellbeing

Interaktivní karty — denní selectory a krátké hry. Součást feedu. Bez chatbota.

- **Mood_selector** — denní check-in: dítě potažením umístí tečku do diagramu (osy ENERGIE × SOUSTŘEDĚNÍ). Hodnota personalizuje výběr Glitchů pro daný den.
- **Breathing** — dechové cvičení: nastavitelný počet cyklů, animované fáze nádech / zadrž / výdech.
- **Attention_game** — hra na pozornost: interaktivní 3D objekt, opt-in časovač.

Zásady: časovače opt-in, žádné srovnávání, emoční data jen po dobu 24hodinové relace.

### 4. Fun fact

Rozklikávací zajímavost pro zpestření feedu, bez úkolu. Karta (tučný titulek + ilustrace) → rozklik (hlubší kontext) → chat.

### 5. Najdi chybu

Rozklikávací Glitch pro kritické myšlení / prebunking. Výrazné (nepravdivé) tvrzení → multichoice kvíz (co je chyba) → vyhodnocení → vysvětlení → chat.

### 6. Historická osobnost

Rozklikávací Glitch — seznámení s osobností oboru + konverzace s AI personou. Karta (fotka, jméno, úvod) → rozklik → chat s personou.

### 7. Argumentuj

Rozklikávací Glitch pro argumentaci a hodnotové uvažování (portace Tinybota z tiny.school). Tvrzení + Souhlasím/Nesouhlasím → chat, kde bot vede krátkými větami. **Bez forku.** Plné schéma: [`../glitches/argument/README.md`](../glitches/argument/README.md).

---

## Společná pole každé karty

Každý návrh karty (bez ohledu na typ) obsahuje kromě `verze` také:

- **autor** a **datum vytvoření**,
- **Mapa konceptů** (sekce 0.1) — provázání na konkrétní koncept v [mapě konceptů](../knowledge-map/); z něj se dědí **RVP, digitální kompetence, oblast a téma** (zdroj pravdy je mapa),
- **metadata pro doporučování** (sekce 5) — **složitost**, kognitivní a energetická náročnost, typ zátěže, fasety, trust state.

Jak se z těchto polí (a z wellbeing signálů) vybírá feed, popisuje **[`doporucovaci-system.md`](./doporucovaci-system.md)**.

## Formát souborů (společné)

- Každý Glitch = **jeden MD soubor**: frontmatter (YAML) = strojová data + tělo (Markdown) = text pro dítě / redakci / chatbota.
- **Pojmenování:** kebab-case slug bez diakritiky, `{tema}-{nazev}.md`; slug = pole `id`.
- ⚠️ **YAML:** text s čárkou nebo dvojtečkou dávej do uvozovek, jinak se hodnota rozbije.
- **Cíl do budoucna:** editor, kde autor zvolí typ Glitche a vyplní obsah přes formulář. Až bude editor fungovat, zřejmě budeme ukládat do DB.
