# Slovníček pojmů Glitch

_Vysvětlení všech pojmů, které používáme kolem Glitche — od obsahu přes doporučování a mapu konceptů až po technické zázemí. Psáno tak, aby to pochopil i někdo, kdo přichází nový. Vytvořeno: 2026-07-23._

Pojmy jsou seřazené do témat. Když narazíš na odkaz „→ pojem", najdeš ho jinde ve slovníčku.

---

## 1. Základní pojmy

**Glitch**
Jedna celoobrazovková karta ve feedu — základní jednotka obsahu. Může to být výklad, kvíz, hra, zajímavost nebo rozhovor. Aplikace se jmenuje také Glitch a vypadá jako sociální síť, ale je vzdělávací.

**Feed**
Svisle „swipovaný" proud Glitchů (jako TikTok / Reels), ale s **denním stropem** — po 20 Glitchích feed končí kartou Shrnutí. Žádný nekonečný scroll.

**Karta**
Vizuální podoba jednoho Glitche na obrazovce (nadpis, obrázek, tlačítka…). V dokumentaci „návrh karty" = šablona, jak má daný typ Glitche vypadat a co obsahuje.

**Quest**
Série na sebe navazujících Glitchů k jednomu tématu (např. „Vibe Coding"). Uvnitř questu jsou Glitche řazené od jednodušších (znalostních) ke složitějším (tvůrčím) — → Bloomova taxonomie.

**Board / Glitchboard**
Osobní „nástěnka" uživatele, kam si ukládá Glitche, které si → forknul (vzal k rozpracování), a vlastní výtvory.

**Fork**
„Vezmi si a rozpracuj." Uživatel si Glitch zkopíruje do svého Boardu a dotvoří ho (vysvětlí, porovná, postaví artefakt). Ne každý typ Glitche jde forknout.

**Chatbot**
AI průvodce uvnitř Glitchů. Jeho styl (jak mluví) určuje → persona — podle typu Glitche vede rozhovor, napovídá, oponuje nebo hraje historickou postavu. Systémový prompt se skládá na serveru (`api/gpt.js`) z persony, kontextu karty a profilu žáka.

**Persona**
Předpis, **jak** chatbot mluví (role, metoda, tón, bezpečnostní pravidla) — nezávisle na tom, **o čem** (to drží karta Glitche). Katalog 12 person je v `Persony/`, výchozí je „Glitchee". Vybírá se polem `persona` v kartě, jinak podle typu Glitche.

**Tiny / tiny.school**
Sesterská vzdělávací platforma. Glitch s ní sdílí některé formáty (např. „Argumentuj") a posílá do ní **důkaz o učení** (→ důkaz o učení).

**p-book**
Odborný výzkumný demo-systém Pavla Kordíka (konference RecSys 2026) o tom, jak fungují → doporučovací systémy. Glitch z něj přebírá klíčové koncepty (→ kontrakt, → fasety, → elastický katalog, → serve-or-mint).

---

## 2. Stavba obsahu

**Koncept**
Jednotka porozumění — „co se má dítě naučit". Má lidsky schválený → kontrakt. Koncepty jsou popsané v → mapě konceptů (např. „doporučovací systémy").

**Kontrakt**
Neměnné jádro konceptu: **co** se musí naučit. Obsahuje výukový cíl, povinné body, → kanonickou otázku a → zakázaná tvrzení. Každé podání se proti kontraktu kontroluje. Změnit ho smí jen redakce.

**Podání (telling)**
Jedna konkrétní realizace konceptu — **jak** se to řekne. Tentýž koncept může mít víc podání (např. jednou komiksem, jednou příběhem z e-shopu). Podání se liší → fasetami, ale všechna musí splnit → kontrakt.

**Faseta**
Vlastnost podání, která popisuje jeho **formu** (ne obsah). Fasety jsou zároveň „přepínače" pro generování a signál pro → doporučovací systém, co komu sedí. Osy faset:
- **téma** — z jakého prostředí jsou příklady (generický, e-shop, sociální sítě, hry…),
- **hloubka** — pro koho (intro, standard, technická, výzkumná),
- **vizualita** — kolik nesou obrázky (text-first, vyvážená, visual-first),
- **formalismus** — kolik vzorců/zápisu (žádný, lehký, plný),
- **délka** — čtenářský závazek (tl;dr, standard, deep),
- **žánr** — forma (výklad, příběh, komiks, animace, kvíz…),
- **jazyk** (čeština, angličtina…),
- **nosiče** — z čeho je to složené (text, tabulka, diagram, obrázek, animace, kód).

**Fasetový vektor**
Konkrétní kombinace hodnot faset jednoho podání (např. „visual-first + tl;dr + svět sociálních sítí"). Slouží jako „adresa" podání pro vyhledávání i → cache.

**Kanonická otázka**
Jedna kontrolní otázka (s modelovou odpovědí), kterou by dítě mělo po zvládnutí konceptu umět zodpovědět. Součást → kontraktu.

**Zakázaná tvrzení**
Seznam nepravd/miskoncepcí, které podání ani → chatbot nesmí říct (a bot na ně aktivně reaguje, když je řekne dítě). Součást → kontraktu.

**Zdroj pravdy (source of truth)**
Ověřená fakta konceptu, ze kterých čerpá → chatbot i generování. Nic mimo zdroj pravdy se nesmí tvrdit. (Pozor: „zdroj pravdy" používáme i v technickém smyslu — → git jako zdroj pravdy.)

**Úrovně vypracování**
Jednoduchá / střední / master — náročnost, kterou si dítě volí při → forku. Hodnotí je formativně LLM „zkoušející", ne známkou.

**Metainfo**
Skrytá data karty pro systém, redakci a chatbota (kontrakt, kontext pro bota, metadata pro doporučování). Uživatel je nevidí.

---

## 3. Štítky důvěry (Trust state)

Informace o **původu** Glitche — kdo ho vytvořil a nakolik je prověřený. Řídí označení karty i to, jak se servíruje. Stupně (žebřík důvěry):

**Core**
Glitch vytvořený a ověřený námi (redakcí). Nejvyšší důvěra; „kanonický" obsah. Žije v → gitu.

**Fork**
Původně náš Glitch, který uživatel → forknul a upravil.

**Komunita**
Glitch vytvořený uživatelem nebo skupinou uživatelů a nasdílený.

**Generovaný**
Plně vygenerovaný Glitch (→ AI generování). Vždy viditelně označený.

**Draft** *(pracovní stav)*
Výtvor, který zatím vidí jen jeho autor (než ho nasdílí).

**Ghost** *(navržený, ještě nenapsaný)*
Návrh konceptu, který ještě nikdo nenapsal. Ukazuje se, aby se dala **změřit poptávka** (hlasy) dřív, než se to napíše.

> Žebřík: `private → community → edited → core` (+ `generated`, + `ghost`). Posun nahoru je kurátorský krok (lidská kontrola).

---

## 4. Doporučovací systém

**Doporučovací systém**
Mechanika, která rozhoduje, který Glitch uživateli ukázat. Glitch ho staví jinak než běžné sítě — transparentně, s denním stropem, s ohledem na → wellbeing.

**Hybridní doporučování**
Nejen podle parametrů (fasety, historie), ale i s **AI moderací** (kontrola proti → kontraktu) a → zdrojem pravdy.

**Elastický katalog**
Katalog, který není pevný — chybějící → podání se dá dogenerovat a projde → žebříkem důvěry. „Pružně" roste podle poptávky.

**Retrieve before generate („nejdřív hledej, pak generuj")**
Pravidlo: nejdřív nabídni existující prověřené podání; teprve u skutečné mezery generuj nové.

**Serve-or-mint („posluž, nebo vyrob")**
Rozhodnutí systému při požadavku: buď najde hotové podání (serve), nebo ho na místě vyrobí (mint = „razit", vygenerovat).

**Honest miss („poctivá absence")**
Když žádné podání nesedí, systém to **přizná** („takové podání zatím není") místo tichého podstrčení náhrady. Každá taková absence je zaznamenaná **poptávka** — signál, co dopsat.

**Open learner model (model preferencí)**
Přehled toho, co uživateli sedí (→ fasetové afinity) — a je **editovatelný**: uživatel může naučenou preferenci přepsat vlastní volbou. Transparentnost místo skryté černé skříňky.

**Fasetové afinity**
Naučené i zvolené preference uživatele na úrovni → faset (např. „má radši obrázky a kratší texty"). Explicitní volba přebíjí to, co se systém odhadl z chování.

**Signál (implicitní / explicitní)**
Vstup pro doporučování. **Explicitní** = uživatel si aktivně zvolí. **Implicitní** = odvozené z chování (doba čtení, co dokončil, → focus). Implicitní signály jsou slabé a přebíjí je explicitní volba. ⚠️ Nikdy se neodvozuje **emoce** (AI Act).

**Cache**
Dočasně uložený výsledek, aby se nemusel počítat/generovat znovu. U Glitche: vygenerované podání se uloží podle → fasetového vektoru a poslouží všem se stejnými preferencemi.

**Denní strop**
Pevný počet Glitchů na den (20). Chrání před nekonečným scrollem a přetížením.

---

## 5. Obtížnost a učení

**Obtížnost**
Jak je Glitch těžký pro cílovou skupinu (1 lehká · 2 střední · 3 těžká). Vlastnost **konkrétního Glitche**, ne jeho typu — i zajímavost může být náročná.

**Kognitivní náročnost**
Jakou myšlenkovou operaci Glitch vyžaduje — vyjádřeno v úrovních → revidované Bloomovy taxonomie.

**Revidovaná Bloomova taxonomie**
Žebříček myšlenkových operací od nejjednodušší po nejnáročnější: **zapamatovat → porozumět → aplikovat → analyzovat → hodnotit → tvořit**. Používáme ji u jednotlivého Glitche.

**Marzano-Kendall (Nová taxonomie vzdělávacích cílů)**
Jiný, novější žebříček úrovní zvládnutí, který používá → mapa konceptů pro gradaci cílů konceptu: **vybavení → porozumění → analýza → využití znalostí**. (Bloom u Glitche, Marzano u konceptu — obojí je „od jednoduššího ke složitějšímu".)

**Gradace**
Odstupňování cílů a kritérií podle úrovně (ne podle ročníku) — aby stejný koncept mohl posloužit slabšímu i pokročilejšímu žákovi.

---

## 6. Wellbeing a focus signál

**Wellbeing**
Karty pečující o vnitřní nastavení dítěte (pozornost, klid). U Glitche jsou **přímo součástí feedu**, ne bonus — a zároveň dávají → focus signál doporučování.

**Focus signál** *(dřív „mood")*
**Behaviorální** signál pro doporučování: fakt, že dítě **dokončilo** relaxační nebo pozornostní aktivitu (dýchání, hra na pozornost). ⚠️ **Není to rozpoznávání emocí** — AI Act (čl. 5) odvozování nálady zakazuje, takže se náladová hodnota **neměří**. Signál je čistě „splněno / nesplněno" a slouží k jemné úpravě tempa feedu (future-facing).

**Mood selector** *(odstraněno — AI Act)*
Původní denní „check-in" (tečka v diagramu energie × soustředění) je **trvale odstraněn**. Odvozování emocí ve vzdělávacím kontextu zakazuje AI Act; nahrazuje ho behaviorální → focus signál.

**Breathing (dechové cvičení)**
Krátká řízená dechová aktivita pro zklidnění (nádech / výdech).

**Attention game (aktivita)**
Interaktivní 3D hra pro „usazení" pozornosti; volitelný časovač.

**ASMR**
Krátká zklidňující zvuková / vizuální smyčka bez cíle a skóre.

**Relace (session)**
Časové okno, po které si systém drží citlivá data o uživateli. Základní relace = **24 hodin**, pak se behaviorální data o chování mažou.

**Efemérní data**
Data, která nejsou trvalá — žijí jen po dobu → relace (24 h) a pak se automaticky smažou. Týká se behaviorálních dat o chování (dokončené aktivity, focus signál). Nikdy netvoří trvalý štítek; emoce se nezaznamenávají vůbec.

**Důkaz o učení**
To, co se z Glitche ukládá trvale do profilu (a případně posílá do → Tiny): **zvládnuté koncepty, úroveň kompetence, dokončení** — tedy pokrok, ne nálada ani názor na citlivé téma.

**Časovač opt-in**
Časomíra se nikdy nespouští sama — dítě si ji musí aktivně zapnout. Žádný časový tlak zvenčí.

---

## 7. Mapa konceptů a RVP

**Mapa konceptů (mapa znalostí)**
Interaktivní mapa všech → konceptů informatiky pro 2. stupeň ZŠ, propojených vazbami. Je → zdrojem pravdy o tom, co učíme; Glitche se na koncepty napojují.

**Oblast (RVP okruh)**
Velký tematický okruh podle → RVP. Čtyři: Data/informace/modelování, Algoritmizace a programování, Informační systémy, Digitální technologie.

**Téma**
Obsahové seskupení konceptů napříč oblastmi (např. Umělá inteligence, Vibe Coding, Kyberbezpečnost). Jiný pohled na mapu než oblasti.

**Core koncept vs. navazující koncept**
**Core** = základní stavební kámen oblasti, prerekvizita pro další. **Navazující** = staví na core konceptech. (Pozor: „core" tady = vrstva v mapě; „Core" jako → štítek důvěry je něco jiného.)

**Prerekvizita**
Koncept, který musí předcházet jinému („nejdřív podmínky, pak Hra života"). Kreslí hierarchii mapy.

**Souvisí**
Příbuznost dvou konceptů napříč mapou (křížová vazba), bez pořadí.

**RVP (Rámcový vzdělávací program)**
Národní kurikulární dokument, který stanovuje, co se mají žáci v ČR učit. Každý koncept je napojený na konkrétní → očekávaný výstup RVP (kód + doslovné znění).

**Očekávaný výstup**
Konkrétní formulace v → RVP, co má žák umět (má kód, např. `INF-INF-002-ZV9-005`, a znění). Bereme je doslovně z revidovaného RVP.

**Digitální kompetence**
Jedna z klíčových kompetencí RVP — schopnost bezpečně, účelně a uvážlivě používat digitální technologie. Prolíná se koncepty napříč oblastmi.

**Cíle a kritéria (konceptu)**
**Cíle** = co má žák zvládnout (gradované podle úrovně). **Kritéria** = podle čeho se pozná, že to zvládl. Obojí odstupňované (→ gradace).

**Tagy**
Průřezová témata / podobnost u konceptu (pro filtrování v mapě).

**Pokrytí Glitchem**
Odkaz z konceptu na Glitche, které ho učí — propojení mapy s obsahem.

**Stav (draft / hotovo)**
Zpracovanost záznamu v mapě: rozpracovaný, nebo hotový.

---

## 8. Role uživatelů

**Žák**
Prochází feed, plní questy, ukládá si pokrok, může přidat komunitní Glitch.

**Učitel**
Vidí své žáky/třídu a jejich → důkaz o učení (ne emoční data), zadává questy, může přidat Glitch.

**Editor**
Může navíc upravovat obsah Glitchů přímo v aplikaci.

**Admin**
Správa uživatelů, rolí a obsahu (navíc).

---

## 9. Technické pojmy

**Supabase**
Cloudová databáze a přihlašování, které Glitch používá (postavené na PostgreSQL).

**PostgreSQL (Postgres)**
Databázový systém, ve kterém běží data Glitche.

**RLS (Row Level Security)**
Bezpečnostní pravidla databáze, která určují, kdo které řádky smí číst/měnit (např. „svoje ano, cizí ne"). Základ soukromí.

**jsonb**
Datový typ v Postgresu pro uložení strukturovaných dat (jako „složka s políčky") v jednom sloupci. Používáme ho třeba pro → fasety.

**Vercel**
Služba, kde je Glitch nasazený (hostovaný). Každý push na GitHub spustí nové nasazení.

**Serverless funkce**
Malý kousek serverového kódu, který běží až na vyžádání (nemá stále běžící server). U Glitche jí voláme OpenAI, aby → API klíč zůstal skrytý.

**GPT / OpenAI**
Jazykový model a firma, kterou používáme pro → AI generování a → chatbota.

**AI generování**
Vytvoření obsahu (podání Glitche) modelem na vyžádání. Musí projít kontrolní „bránou" (→ kontrakt, → zdroj pravdy), než se ukáže dítěti.

**Guardrails („mantinely")**
Pravidla a kontroly, které drží AI v mezích — aby neříkala zakázané věci a držela se → zdroje pravdy.

**git / GitHub**
Systém pro verzování kódu a obsahu. U Glitche je **git → zdrojem pravdy** pro `core` obsah — DB je jen „zrcadlo" pro rychlé dotazy.

**MD (Markdown) / YAML / frontmatter**
Formáty souborů. **Markdown** = jednoduchý text s formátováním (tenhle dokument). **YAML** = strukturovaná data. **Frontmatter** = blok YAML na začátku MD souboru (strojová data ke Glitchi).

**Recombee**
Produkční doporučovací systém (česká firma), který v Pavlově → p-book personalizuje obsah. Ukázka „opravdového" doporučovače.

---

## Související dokumenty

- [`typy-obsahu.md`](./typy-obsahu.md) — přehled 7 typů Glitchů
- [`doporucovaci-system.md`](./doporucovaci-system.md) — jak se vybírá feed
- [`databaze-navrh.md`](./databaze-navrh.md) — návrh uložení dat
- [`karta-basic-glitch.md`](./karta-basic-glitch.md) a `karta-*.md` — návrhy karet
- [mapa konceptů](../knowledge-map/) — koncepty, RVP, oblasti
