# Argumentuj

Rozklikávací Glitch pro **argumentaci, kritické myšlení a hodnotové uvažování**. Přenáší do Glitche osvědčený formát **Tinybota „Argumentuj"** z [tiny.school](https://tiny.school/): dítě dostane názorové tvrzení, zaujme postoj a chatbot ho pak vede krátkými otázkami k tomu, aby svůj postoj **promyslelo, podepřelo a obhájilo** — a zvážilo i druhou stranu.

**Interakce:** Rozklik ✅ · Chatbot ✅ · Fork ❌
**Složka:** `glitches/argument/`

---

## Řídící princip (nejdůležitější)

**Argumentuj neučí „správný názor" — učí dobře argumentovat.** U hodnotových témat žádná jediná správná odpověď není a bot ji nesmí protlačovat. Cíl není, aby dítě došlo k „našemu" závěru, ale aby:

1. **zaujalo postoj** a řeklo ho jasně,
2. **podepřelo ho důvodem** (proč si to myslím),
3. **opřelo se o důkaz / příklad** (z čeho to plyne),
4. **zvážilo protiargument** (co by řekl někdo, kdo si myslí opak),
5. a případně postoj **upřesnilo nebo posílilo** poté, co protiargument slyšelo.

Bot je **neutrální průvodce**, ne oponent s vlastní agendou. Vede dítě k lepšímu myšlení bez ohledu na to, kterou stranu si vybralo. Kvalita se posuzuje na **kvalitě argumentace**, ne na tom, „jestli má dítě pravdu".

---

## Tok interakce

1. **Karta ve feedu** — názorové tvrzení (tučně) + dvě tlačítka **Souhlasím / Nesouhlasím**. Bez rozkliku se nescrolluje dál jako u pasivní karty; postoj je vstupní brána.
2. **Volba postoje** — kliknutí na Souhlasím/Nesouhlasím dá Tinybotovi **úvodní informaci o postoji dítěte** k tématu.
3. **Otevře se chat** — Tinybot vede dítě **krátkými větami, jednou otázkou po druhé** (sokratovsky):
   - nejdřív se zeptá **proč** (důvod),
   - pak si řekne o **konkrétní příklad / důkaz**,
   - pak nabídne **nejsilnější protiargument** druhé strany („a co by na to řekl někdo, kdo si myslí opak?") a nechá dítě reagovat,
   - nakonec vyzve k **shrnutí postoje** — ať už zůstal stejný, nebo se posunul.
4. **Uzavření** — bot pojmenuje, co se dítěti povedlo (dal jsi důvod, zvážil jsi druhou stranu…). Žádné skóre, žádné srovnávání.
5. **Uložení** — signály o kvalitě argumentace jdou do **profilu dítěte** a posílají se do **Tiny jako důkaz o učení** (viz sekce 6).

> Argumentuj **nemá fork** — nevzniká z něj artefakt do boardu. Výstupem je samotná konverzace a stopa o rozvoji argumentační dovednosti.

---

## Struktura souboru

Sekce vychází z obecné karty (`glitch-card-general.md`), přizpůsobené argumentaci. Soubory: `{tema}-{nazev}.md`, např. `soukromi-nemam-co-skryvat.md`.

### 0 Identifikace
`id`, `nazev`, `typ: argument`, `tema`, `verze`, `stav důvěry` (`core → edited → community → generated`), `jazyk`, `autor kontraktu`.

### 1 Kontrakt *(vlastní redakce, skrytý)*
- **1.1 Výukový cíl** — dvojí: **(a) dovednostní** (dítě formuluje postoj, podepře ho důvodem a příkladem, zváží protiargument) a **(b) tematický** (o čem se přemýšlí — např. soukromí a hodnota osobních dat).
- **1.2 Klíčové argumenty PRO i PROTI** — pro každou stranu 2–4 nejsilnější, poctivě formulované argumenty (bot je zná a umí je nabídnout jako protiváhu, ať dítě zvolí cokoli). **Obě strany musí být zpracované férově** (steelman, ne slaměný panák).
- **1.3 Co má dítě na konci umět** — místo „kanonické otázky": mít **jasný postoj + aspoň jeden důvod + reakci na jeden protiargument**.
- **1.4 Zakázané** — bot ani karta nesmí: protlačovat jediný „správný" názor; zesměšňovat postoj dítěte; manipulovat emocemi; vydávat hodnotový soud za fakt (a naopak). U tvrzení, kde **existuje faktická opora** (ne jen názor), bot fakta nezamlčuje, ale odděluje „co je doloženo" od „co je hodnocení".

### 2 Karta ve feedu *(viditelné)*
- **Štítek:** `Argumentuj` (žlutý).
- **Tvrzení** (tučně, výrazné) — názorové, provokativní, věku přiměřené.
- **Tlačítka:** `Souhlasím` · `Nesouhlasím`.
- *(Vizuál dle návrhu: světle růžové pozadí, tvrzení nahoře, dvě tlačítka dole.)*

### 3 Vedení konverzace + kritéria kvality
- **Fáze vedení:** postoj → důvod → důkaz/příklad → protiargument → shrnutí. Bot drží **krátké tahy**, jednu otázku naráz, navazuje na to, co dítě řeklo.
- **Formativní kritéria** (posuzuje LLM zkoušející, ne skóre): dítě *zaujalo jasný postoj* · *dalo aspoň jeden vlastní důvod* (ne „protože jo") · *uvedlo konkrétní příklad* · *zareagovalo na protiargument* (nemusí názor změnit, stačí ho vzít vážně) · *na konci postoj srozumitelně shrnulo*.

### 4 Kontext pro Tinybota *(skrytý)*
- **4.1 Fakta a pozadí** k tématu (co je doloženo, případné mýty).
- **4.2 Hranice tématu** — bot se drží tématu tvrzení; mimo téma vlídně vrací.
- **4.3 Scaffolding** — jak doptávat, když dítě „nevím / protože jo": nabídnout dvě konkrétní situace na výběr, otočit otázku, požádat o příklad ze života. **Nikdy nedodat argument za dítě dřív, než se samo pokusí.**
- **4.4 Co bot nesmí** — vnucovat názor; chválit „správnou" stranu; srovnávat s ostatními; ukládat emoční data jako signál; tlačit na „správný" závěr.

### 5 Metadata pro doporučovací systém
`fasety` (svět příkladu, délka, jazyk…), `signál dokončení` = **absolvovaná argumentační smyčka** (postoj → důvod → reakce na protiargument), `fork: false`, vazby na související koncepty (např. z Mapy: soukromí, digitální stopa).

### 6 Bezpečnost, soukromí a co se posílá do Tiny
- **Citlivá témata:** názory nezletilých na hodnotová témata jsou citlivé. Bot zůstává neutrální, nediagnostikuje osobnost, nezaznamenává „jaký má dítě názor" jako hodnocení.
- **Co se ukládá do profilu / posílá do Tiny = důkaz o učení, ne názor dítěte:** signály o **kvalitě argumentace** (dal důvod ✓, uvedl příklad ✓, zvážil protiargument ✓, shrnul postoj ✓) a dokončení. **Ne** samotný postoj na citlivé téma jako trvalý štítek.
- **Emoční data** z konverzace jsou efemérní (relace), nikam se nepropisují.
- Žádný časovač, žádné srovnávání, žádné veřejné sdílení postoje.

---

## Příklad (ilustrace)

**Tvrzení:** „Nemám co skrývat, tak je mi jedno, kolik dat o mně aplikace sbírají."

- **Souhlasím / Nesouhlasím** → bot podle volby vede:
  - *Souhlasím:* „Co všechno by o tobě appka poznala jen z toho, co si pouštíš a kdy?" → „Vadilo by ti, kdyby to viděl někdo cizí?" → protiargument: „Někdo říká, že jde o moc, ne o skrývání — data se dají použít, aby tě někdo přesvědčil nebo zmanipuloval. Co ty na to?"
  - *Nesouhlasím:* „Řekni jeden konkrétní důvod, proč ti na tom záleží." → „Kdy je naopak sdílení dat fér a užitečné?" → protiargument: „A co lidi, co říkají ‚mně je to jedno, nic neskrývám'? Co bys jim odpověděl?"
- **Klíčové argumenty** (sekce 1.2) obě strany: *soukromí = kontrola, ne tajení* · *data ≠ jen fakta, ale moc a peníze* · *pohodlí a personalizace mají cenu* · *souhlas a možnost volby*.

---

## Vztah k Tiny

Formát „Argumentuj" je **portace osvědčeného Tinybota z tiny.school** do prostředí Glitche (feed + krátká karta). Sdílí s Tiny logiku vedené argumentace a napojení na **profil dítěte jako důkaz o učení** — Glitch signály posílá do Tiny (viz sekce 6), takže argumentační dovednost roste napříč oběma platformami.
