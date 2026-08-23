---
# 0 Identifikace
id: algoritmus-hra-zivota
type: basic-glitch
title: Hra života
chapter: Algoritmus
quest: Od návodu k emergenci
order: 5
version: "1.0"
trust: core            # core | edited | community | generated
lang: cs
author: redakce AI dětem
revised: 2026-07-07

# 2.1 Karta ve feedu
card:
  badge: Algoritmus
  heading: Hra života
  text: >-
    Hra života je ukázka algoritmu s pár jednoduchými pravidly. Ta určují,
    které buňky přežijí, které zaniknou a kde vznikne nová. Dokážeš pravidla popsat?
  media:
    kind: iframe
    src: assets/3Dvizualizations/game-of-life.html

# 2.4 Kvíz (rychlá kontrola porozumění)
quiz:
  - q: Co rozhoduje o tom, jestli buňka přežije?
    options:
      - { label: její barva, correct: false }
      - { label: její sousedé, correct: true }
      - { label: hráč, correct: false }
  - q: Kolik pravidel Hra života má?
    options:
      - { label: čtyři, correct: true }
      - { label: čtyřicet, correct: false }
      - { label: pokaždé jiná, correct: false }
  - q: Kdo naprogramoval klouzače — útvary putující po mřížce?
    options:
      - { label: "Conway", correct: false }
      - { label: "nikdo, vznikají z pravidel", correct: true }
      - { label: "počítač si je vymýšlí náhodně", correct: false }

# 5 Metadata pro doporučovací systém
facets:
  depth: intro
  visual: visual-first
  genre: pozorování+výklad
  length: standard
  world: generický
  formalism: none
prerequisites: [algoritmus-podminky, algoritmus-cykly]
next: [algoritmus-emergence-v-ai, algoritmus-vlastni-automat]
---

## Kontrakt

*Vlastní redakce. Beze změny kontraktu se nesmí změnit, co Glitch učí.*

### Výukový cíl

Žák chápe, že z několika jednoduchých, přesně daných pravidel typu „když–tak", opakovaných pořád dokola, může vzniknout složité chování, které nikdo přímo nenaprogramoval — a umí tento jev pojmenovat (emergence) a ukázat na příkladu.

### Povinné body

1. Hra života je mřížka buněk; buňka je živá, nebo mrtvá. Nic víc.
2. O osudu buňky rozhodují jen její sousedé, podle čtyř pevných pravidel (když–tak).
3. Pravidla se aplikují na všechny buňky najednou, v krocích (generacích) — je to cyklus.
4. Nikdo neřídí celek: vzory (klouzače, blikače, stabilní bloky) vznikají samy z lokálních pravidel.
5. Pojem **emergence**: složité chování celku z jednoduchých pravidel částí.
6. Most k předchozím úlohám: pravidla jsou „když–tak" (úloha 3) opakovaná v cyklu (úloha 4).

### Kanonická otázka

**Otázka:** Ve Hře života se objevují útvary, které putují po mřížce. Naprogramoval je někdo? Vysvětli.

**Jádro správné odpovědi:** Ne. Naprogramovaná jsou jen čtyři jednoduchá pravidla pro jednotlivé buňky. Putující útvary (např. klouzač) vznikají samy tím, že se pravidla opakovaně aplikují — je to emergence: chování celku, které z pravidel předem nevyčteš, ale které z nich plyne.

### Zakázaná tvrzení a časté miskoncepce

Podání ani chatbot nesmí tvrdit; chatbot na miskoncepce aktivně reaguje:

- ❌ „Buňky se rozhodují / chtějí přežít." — Buňky nic nechtějí, pravidla se prostě aplikují. (Antropomorfizace; dítě ji přinese skoro vždy.)
- ❌ „AI funguje jako Hra života." — Povolená je jen opatrná analogie: *i* v AI vzniká složité chování z mnoha jednoduchých částí. Ne rovnítko.
- ❌ „Hra života je hra, kterou hraje hráč." — Po nastavení počátečního stavu už nikdo nezasahuje; proto se jí říká hra s nulovým počtem hráčů.
- ❌ „Náhoda tvoří ty vzory." — V pravidlech žádná náhoda není; tentýž počáteční stav dá vždy tentýž průběh (determinismus).

---

## Podání

*Uživateli se zobrazuje karta (frontmatter `card`), tyto rozklikové vrstvy a zadání z úrovní.*

### Rozklik — vrstva 1: pozorování

Sleduj chvíli animaci. Něco „umírá", něco „se množí", něco bliká pořád stejně. Zkus slovně popsat aspoň dvě věci, které se v mřížce opakují. Zatím nehledej pravidla — jen si všímej.

### Rozklik — vrstva 2: odhalení pravidel

Celé je to mřížka buněk. Každá buňka je živá ⬛, nebo mrtvá ⬜, a v každém kroku se podívá na svých osm sousedů:

1. Živá buňka s méně než 2 živými sousedy umírá (osamění).
2. Živá buňka se 2 nebo 3 živými sousedy přežívá.
3. Živá buňka s více než 3 živými sousedy umírá (přelidnění).
4. Mrtvá buňka s přesně 3 živými sousedy ožívá.

Poznáváš to? Jsou to čtyři „když–tak" pravidla — a celé se to opakuje pořád dokola, jako cyklus. Nic víc v tom není. A přesto vznikají útvary, které putují, blikají a rostou, i když je nikdo nenaprogramoval. Tomuhle jevu se říká **emergence**: jednoduché části + jednoduchá pravidla = složité chování celku. Zapamatuj si to slovo — potká tě i u umělé inteligence.

---

## Úrovně vypracování

*Žák si úroveň volí sám při forku do svého boardu. Kritéria jsou formativní; posuzuje je LLM zkoušející — hodnotí podstatu, doptává se, nedává klíčoslovné skóre.*

### 🟢 Jednoduchá

**Zadání:** Projdi animaci a rozklik, vyplň kvíz a vlastními slovy (3–5 vět) vysvětli kamarádovi, který Glitch neviděl, jak Hra života funguje a co je na ní překvapivé.

**Kritéria splnění:**
- Vysvětlení zmiňuje, že pravidla jsou jednoduchá a rozhodují sousedé (ne hráč, ne náhoda).
- Zmiňuje, že se pravidla opakují v krocích.
- Pojmenuje překvapení: vznikají složité vzory, které nikdo nenaprogramoval.

**Typický neúspěch:** žák odvypráví „co viděl" (blikalo to, hýbalo se), ale ne „proč". Zkoušející se doptá: *„A kdo rozhodl, že se to bude hýbat?"*

### 🟡 Střední

**Zadání:** Vezmi si tři počáteční vzory (blok 2×2, řádek tří buněk, tvar L ze čtyř buněk). U každého nejdřív **tipni**, co se stane, pak to ověř v animaci a ručně dopočítej první generaci u jednoho z nich. Napiš krátké srovnání: který tip vyšel, který ne a proč.

**Kritéria splnění:**
- Ruční dopočet jedné generace je správně (aplikace pravidel na konkrétní buňky).
- Srovnání tip vs. skutečnost je poctivé — chybný tip je popsaný, ne zamlčený.
- Žák formuluje, co ho zpětně překvapilo, odkazem na konkrétní pravidlo (např. „řádek tří se překlopí, protože krajní buňky mají jen jednoho souseda").

**Poznámka pro zkoušejícího:** chybný tip není chyba, je to materiál. Hodnotí se kvalita ověření, ne úspěšnost odhadu.

### 🔴 Master

**Zadání (dvě varianty, žák volí):**
- **A — papírový automat:** Vymysli vlastní pravidlo (nebo sadu pravidel) pro buňky, dopočítej ručně 3 generace na mřížce a popiš, co tvoje pravidlo „dělá" — umírá všechno? roste všechno? něco se opakuje?
- **B — zásah do kódu:** V hotovém kódu animace změň jedno pravidlo nebo počáteční vzor, popiš předem hypotézu a pak skutečnou změnu chování.

**Kritéria splnění:**
- Existuje artefakt (mřížky na papíře / upravený kód) a je forknutelný — jiný žák na něm může stavět.
- Žák formuluje vztah pravidlo → chování: co změna pravidla udělala s celkem.
- Žák použije pojem emergence správně na vlastní případ (nebo správně řekne, že u jeho pravidla nic emergentního nevzniklo — i to je platný výsledek).

**Signál dokončení:** jednoduchá: kvíz + vysvětlení · střední: dopočet + srovnání · master: forknutelný artefakt.

---

## Kontext pro chatbota

*Nezobrazuje se uživateli. Nalévá se do systémového promptu chatbota v boardu, když je tento Glitch forknutý. Bot je omezen na téma tohoto Glitche.*

### Fakta a pozadí

- Autor: matematik John Horton Conway, 1970; popularizoval Martin Gardner ve Scientific American. Conway zemřel v roce 2020 na covid — zmínit jen, když se dítě samo ptá.
- Přesná pravidla: B3/S23 (birth při 3 sousedech, survival při 2–3). Sousedství: 8 okolních buněk (Moorovo).
- Základní útvary: **blok** (2×2, stabilní), **blikač** (řádek 3, perioda 2), **klouzač/glider** (putuje diagonálně, perioda 4), **klouzačové dělo** (Gosper 1970, střílí klouzače donekonečna).
- Hra života je deterministická: stejný start = stejný průběh, žádná náhoda.
- Je „hra s nulovým počtem hráčů": po nastavení počátku už nikdo nezasahuje.
- Pro zvídavé: Hra života je turingovsky úplná — dá se v ní postavit počítač. Zjednodušeně: „z těchhle čtyř pravidel jde postavit cokoli, co umí spočítat obyčejný počítač". Nerozvíjet formálně.
- Vazba na AI (opatrně, viz zakázaná tvrzení): neuronová síť je taky spousta jednoduchých částí, z jejichž souhry vzniká chování, které nikdo řádek po řádku nenaprogramoval. Je to analogie, ne totéž.

### Hranice tématu

- Bot se drží Hry života, pravidel, emergence a mostu k pojmům „když–tak" a cyklus.
- Když dítě odbočí k programování obecně → krátce odpovědět a vrátit se: „…a přesně tohle si můžeš vyzkoušet v master úrovni tohohle Glitche."
- Když se ptá na AI do hloubky → naznačit a odkázat: „na tohle máme celý Quest, tady se drž buněk."
- Mimo téma úplně (osobní věci, jiné předměty) → vlídně vrátit k tématu; bot v boardu není univerzální chatbot.

### Scaffolding — typické zádrhely a jak napovídat

*Zásada: nevysvětlovat líp, ale doptávat se tak, aby na to dítě přišlo samo. Nápověda má tři stupně; začínej vždy prvním.*

**Zádrhel: dítě antropomorfizuje („buňka chce přežít").**
1. „A jak buňka pozná, co ‚chce'? Podívej se na pravidla — je tam někde něco jako přání?"
2. „Zkus pravidlo 1 přečíst nahlas. Rozhoduje tam buňka, nebo něco jiného?"
3. Vysvětlit přímo: rozhodují sousedé a pravidlo, buňka nic neví a nechce.

**Zádrhel: dítě nechápe, že se pravidla aplikují na všechny buňky najednou.**
1. „Když počítáš novou generaci, smíš už používat buňky, které jsi právě změnil?"
2. Navrhnout trik: dvě mřížky vedle sebe — stará a nová generace.
3. Ukázat na konkrétním řádku tří buněk, proč postupná aplikace dá jiný (špatný) výsledek.

**Zádrhel: ruční dopočet nevychází (střední úroveň).**
1. „Vyber si jednu buňku, u které si nejsi jistý, a spočítej jí sousedy nahlas."
2. Zúžit: „Kolik živých sousedů má levá krajní buňka? A co říká pravidlo pro méně než dva?"
3. Projít jednu buňku společně krok za krokem — ale jen jednu, zbytek nechat dítěti.

**Zádrhel: „k čemu to je?"**
1. Otočit: „Napadá tě něco v přírodě, kde se z jednoduchého chování jednotlivců skládá složité chování davu?" (mravenci, hejna špačků, doprava)
2. Most k AI analogii z fakt.

### Co bot nesmí

- Neprozrazovat řešení kvízu ani správné výsledky dopočtů na střední/master úrovni; vždy jen navádět (max. stupeň 3 scaffoldingu, a to až po dvou pokusech dítěte).
- Nehodnotit dítě srovnáním s ostatními („ostatním to šlo rychleji" je zakázaná věta v jakékoli podobě).
- Nepoužívat zakázaná tvrzení z kontraktu ani je nepotvrzovat, když je vysloví dítě — vlídně korigovat.
- Při frustraci dítěte nabídnout přerušení a jednodušší krok, ne tlačit na dokončení.
- Časový tlak nikdy nevytvářet; tenhle Glitch žádný časovač nemá.

---

## Bezpečnost a věková přiměřenost

- Slovník „umírá / přežívá" je zavedená terminologie Hry života; pro cílovou skupinu v pořádku, ale bot ho rámuje věcně (metafora pro změnu stavu buňky), nedramatizuje.
- Žádný časový limit, žádné srovnávání mezi žáky, úroveň vypracování není veřejný odznak.
- Emoční data (frustrace v konverzaci s botem) se nikam nepropisují — bot na ně reaguje v konverzaci, neukládají se jako signál pro doporučování.
