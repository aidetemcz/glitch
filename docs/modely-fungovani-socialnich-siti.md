# Různé modely fungování, brainstorming

_Rešerše modelů fungování sociálních sítí — podklad pro návrh Glitche. Dřív Google Docs, teď zdroj pravdy tady. Poslední převod: 2026-07-15._

# Modely fungování sociálních sítí: mapa pro projekt Glitch
## TL;DR
  - Pro Glitch je nejsilnější syntéza kombinace **Are.na "connect" (sdílení bez kopírování) + GitHub fork-tree (viditelná linie autorství) + Scratch remix-kultura (atribuce + moderace nezletilých) + Khan Academy mastery (pokrok místo srovnávání) + Discourse trust levels (odemykání schopností místo bodů)** — všechny tyto modely posouvají ekonomiku sdílení od "lajkni mi to" k "postav na tom dál" a přesouvají viditelnost od osoby (vanity) k práci (artefakt).
  - Klíčové rozhodnutí: engagement napojit na **dokončené Questy, hloubku boardů a kvalitu forků**, nikoli na čas v aplikaci, lajky či sledující; vanity metriky u dětí prokazatelně produkují úzkost (Duolingo streak/ligy) a gatekeeping (Stack Overflow reputace).
  - Bezpečnost nezletilých řešit jako default, ne dodatek: trojí viditelnost boardů s učitelem jako garantem, vysoké soukromí by default (Age-Appropriate Design Code), žádné dark patterns, scaffolding nováčků přes mantinely (Scratch + Discourse).

## Key Findings
**1. Existují dvě protikladné "ekonomiky sdílení" a Glitch musí vědomě vybrat.** Mainstreamové sítě činí levným *konzumaci a srovnávání* (scroll, lajk, follow) a drahým *tvorbu*. Vzdělávací/tvůrčí sítě (Scratch, Are.na, GitHub) činí levným *navazování na cizí práci* (remix, connect, fork) a drahým — nebo nemožným — *pasivní status* (žádné lajky na Are.na). Glitchův "fork" patří do druhé rodiny.

**2. "Connect" (Are.na) a "fork" (GitHub) jsou dva různé mosty s různými následky.** Na Are.na jeden blok žije v mnoha kanálech zároveň (sdílení, ne kopie) — Are.na dev dokumentace to popisuje takto: *"any block can be reused in multiple channels (this is called a connection). The channels a block appears in across Arena are listed in the blocks' connections attribute."* Obsah tak "akumuluje kontext over time". Na GitHubu fork vytváří vlastní kopii s viditelnou linií k originálu. Glitch potřebuje OBA: "connect" pro kurátorský obsah (jeden Glitch ve více boardech) a "fork" pro žákovskou práci (navázání s atribucí).

**3. Vanity metriky u dětí mají doložené negativní dopady.** Duolingo streak/ligy fungují na retenci přes loss aversion, ale produkují "streak anxiety" a "performativní učení". Stack Overflow reputace degenerovala do gatekeepingu. Naopak mastery systémy (Khan Academy) a odemykání schopností (Discourse trust levels) podporují kompetenci bez sociálního srovnávání.

**4. Scarcity a friction jsou funkce, ne bug.** BeReal (1 post/den) a Wordle (1 hádanka/den) ukazují, že umělý strop spotřeby + synchronizace + sdílení výsledku místo scrollu vytváří sounáležitost bez závislosti.

**5. Malé komunity škálují sounáležitost líp než globální feed.** Discord servery, subreddity a Scratch studia ukazují, že status je lokální a normy jsou vlastní.

**6. Bezpečnost nezletilých má hotový právní rámec.** UK/Kalifornský Age-Appropriate Design Code + GDPR: vysoké soukromí by default, minimalizace dat, vypnutý profiling/geolokace, žádné dark patterns.

## Details
### A) Rodina 1: Vzdělávací a tvůrčí sítě pro děti — "ekonomika navazování"
**Scratch (MIT).** Model: remix s povinnou atribucí (vše pod Creative Commons Attribution-ShareAlike), remix tree zobrazující linii odvozenin. Podle Scratch Wiki (stav červen 2024) jsou *"around 25% of all recently shared projects ... remixes"* (akademická analýza University of Canterbury na \~1,5 mil. projektů naměřila zhruba 27–30 %).

  - *Ekonomika sdílení:* levné = stavět na cizím (remix jedním klikem), drahé = nic, sdílení je default a oslavované. Hodnota vzniká z toho, že tě ostatní remixují.
  - *Odpovědnost a viditelnost:* viditelná je linie tvorby (kdo na čem staví), ne popularita osoby. Moderace: kombinace automatického filtru + lidských moderátorů + krátké, "vstřebatelné" Community Guidelines (6 principů) + reportování komunitou. Studie z Berkman Klein Center popisuje Scratch jako úspěšný příklad hybridní governance (proaktivní + reaktivní moderace + kultivace norem). Slabina: moderace nestíhá vše, závislost na reportech dětí, občas toxické komentáře.
  - *Poučení pro Glitch:* remix tree = přímý vzor pro fork-tree boardů; CC licence jako default; krátké guidelines vstřebatelné dětmi.

**GitHub / GitHub Classroom.** Model: fork (kopie repozitáře s linií k originálu) + pull request (návrh na sloučení) + contribution graph. GitHub Classroom: učitel dává "starter code", žáci ho forknou, učitel dává zpětnou vazbu přes speciální "Feedback" pull request; existují skupinové repozitáře. Od června 2024 Classroom migroval z template na **fork**, aby učitel mohl aktualizovat zadání i po přijetí (žáci si "synchronizují" repozitář s upstream).

  - *Ekonomika sdílení:* levné = navázat na cizí práci a navrhnout změnu; drahé = nic se neztrácí (verzování).
  - *Odpovědnost a viditelnost:* každý commit je podepsaný a dohledatelný — radikální transparentnost autorství. Pozor: ve školním kontextu se ukázalo riziko — pull requesty/řešení viditelné všem studentům (úniky řešení), template repo viditelné.
  - *Poučení pro Glitch:* fork s atribucí + "navrhni vylepšení" jako pedagogický nástroj; ALE pozor na viditelnost řešení mezi spolužáky (default soukromí boardů).

**Are.na.** Model: bloky (obsah) v kanálech (sbírky). Klíčové: "connect" = jeden blok žije ve více kanálech zároveň (NE kopie), blok "akumuluje kontext" tím, jak putuje — Are.na help docs to nazývá "learning trail" bloku. Are.na cíleně nemá lajky ani favority: *"On Are.na, there is no such thing as a 'like' or a 'favorite', instead we have connections."* Žádný algoritmus, žádné reklamy, žádný venture kapitál; financování přes placené předplatné (dle oficiální About stránky platí Premium 18 791 lidí; v roce 2018 proběhl crowdfunding, do nějž investovalo \~850 lidí). Spoluzakladatel Charles Broskoski (rozhovor pro Upstatement): *"advertising as a business model was never on the table. Are.na is a tool for thinking and showing ads would very obviously degrade the experience"* a *"our world is rich in information and poor in attention."* Komunita popisuje Are.na jako "research as leisure activity" — hodnota vzniká z juxtapozice a kontextu, ne z popularity.

  - *Ekonomika sdílení:* levné = kontextualizovat a propojovat; status přes vkus/kurátorství je nemožný (žádné metriky).
  - *Odpovědnost a viditelnost:* viditelná je "learning trail" bloku (kde všude byl propojen), ne kdo má víc sledujících.
  - *Poučení pro Glitch:* dvouvrstvý model (kurátorovaný obsah + osobní boardy) je téměř doslova Are.na; "connect" jako alternativa k forku pro kurátorský obsah; absence vanity metrik jako designový princip.

**Khan Academy (mastery learning).** Model: skill → familiar → proficient → mastered; mastery points; měření "skills to proficient+" jako interní metrika učení. Khan Academy Blog uvádí: *"regardless of the number of skills learners worked on, the proportion of math skills completed at a proficient/mastered level correlated with MAP Growth mathematics scores."* Učitel nastaví mastery goal, žák jde vlastním tempem; reporty pro učitele.

  - *Poučení pro Glitch:* měřit úspěch dokončenými/zvládnutými mikrotématy, ne časem; učitelský dashboard pokroku.

**Roblox / Minecraft Education.** Roblox: UGC platforma (miliony "experiences"), kreativita + ekonomika (Robux), ale velké bezpečnostní problémy — výzkum (arXiv, "An Evaluation of Chat Safety Moderations in Roblox", 2026, korpus \~99,8 tis. zpráv) zjistil, že moderaci unikaly kategorie, kde *"grooming dominates harmful behaviors, followed by bullying and threats to violence"* (dále sexualizace nezletilých, násilí, sebepoškozování, sdílení citlivých údajů). Minecraft Education: verze pro školy, učitelem kontrolovaná, bez veřejných serverů; vzdělávací programy často multiplayer vypínají kvůli bezpečnosti.

  - *Poučení pro Glitch:* "teacher-controlled platform" model Minecraft Education = vzor pro třídní vrstvu; pozor na monetizaci a kontakt s cizími u nezletilých.

### B) Rodina 2: Moderace a komunitní samospráva
**Discourse trust levels.** Oficiální blog Discourse ("Understanding Discourse Trust Levels") popisuje pět úrovní — 0 New, 1 Basic, 2 Member, 3 Regular, 4 Leader. Cílem je *"Sandboxing new users ... so that they cannot accidentally hurt themselves, or other users while they are learning"* a *"Granting experienced users more rights over time."* Klíč: odemykají se SCHOPNOSTI, ne body. Komunita se sama policuje u jasných případů.

  - *Poučení pro Glitch:* progresivní odemykání (komentování, veřejné boardy, peer-feedback) podle chování, ne podle skóre — bezpečné pro nováčky.

**Stack Overflow reputace — varovný příběh.** Reputační/hlasovací systém původně povýšil kvalitu, ale degeneroval: zavírání otázek jako duplikát, gatekeeping, strach z chyby. Pokles otázek začal už \~2014 (zefektivnění moderátorů), AI to dorazila. Lekce: reputace se stala "klackem na nováčky".

  - *Poučení pro Glitch:* nikdy nedělat z reputace gatekeeping; chyba musí být levná a bezpečná (opak SO).

**Reddit / Discord (malé komunity).** Subreddity/servery jako malé komunity s vlastními normami a dobrovolnými moderátory. Discord rozlišuje "Friend servers" (malé, soukromé) vs "Community servers" (větší, nástroje: onboarding, raid protection). Status je lokální.

**Wikipedia (gift economy + transparentnost).** Dohledatelnost každé editace = moderační mechanismus; peer review jako gift economy (reciprocita místo platby).

  - *Poučení pro Glitch:* historie boardu/forků jako transparentní stopa; motivace přes přínos komunitě, ne body.

### C) Rodina 3: Out-of-the-box modely
**Scarcity & friction (BeReal, Wordle).** BeReal: 1 post/den, náhodný čas, nemůžeš vidět cizí, dokud nepostneš sám, žádné lajky. Wordle: 1 hádanka/den, sdílení výsledku (barevné čtverečky) místo scrollu, "process je důležitější než výsledek", nekompetitivní sdílení. Zakladatel Josh Wardle (TechCrunch, 12. 1. 2022) k tomu řekl: *"Wordle could be one a day, but if everybody was getting a different word ... it wouldn't have caught on the way it has ... It's something about the fact that it's one puzzle, and everybody is solving it."* (Wikipedia dodává, že jedna hádanka denně "creates a sense of scarcity" a hráč stráví \~3 minuty denně.)

  - *Poučení pro Glitch:* "Glitch dne" — synchronizovaná denní mikrovýzva pro celou třídu/komunitu; sdílení postupu, ne skóre.

**"Pomalé" sítě a anti-attention-economy.** Tristan Harris (Center for Humane Technology, "Time Well Spent"): metriky mají měřit prospěch uživatele, ne čas; default opt-out z manipulativních funkcí. James Williams: "freedom of attention".

  - *Poučení pro Glitch:* explicitně se přihlásit k "Time Well Spent" filozofii; měřit prospěch, ne čas.

**Letterboxd / Goodreads (identita přes "co jsem prošel").** Profil = mapa toho, co jsem viděl/přečetl/dokázal, ne selfie. "Tvoje poslední čtyři filmy říkají, kdo jsi."

  - *Poučení pro Glitch:* profil žáka = mapa zvládnutých Questů a postavených boardů; identita přes kompetenci, ne vzhled.

**Learning in public / cohort-based.** #100DaysOfCode: veřejný závazek + povzbuzování ostatních (pravidlo: každý den povzbudit 2 lidi). Cohort-based courses: sounáležitost a accountability zlepšují výsledky.

  - *Poučení pro Glitch:* skupinové boardy + "build in public" v rámci třídy; vzájemné povzbuzování jako norma.

### D) Pedagogický a behaviorální rámec (čím poměřovat)
  - **Teorie sebeurčení (Deci & Ryan):** autonomie, kompetence, sounáležitost. Meta-analýza Li, Hew & Du (2024, *Educational Technology Research and Development*) na 35 intervencích / 2500 účastnících našla *"an overall significant but small effect size favoring gamified learning ... (Hedges' g = 0.257, 95% CI [0.043, 0.471], p = .019)"* a *"minimal impact on competency"* — gamifikace tedy mírně posiluje autonomii a sounáležitost, ale skoro nezvyšuje pocit kompetence; body/odznaky jako kontrolní mechanismus mohou podkopat vnitřní motivaci (overjustification effect). Klíč: herní prvky mají dávat zpětnou vazbu o kompetenci, smysluplnou volbu a sociální propojení — ne nutit.
  - **Flow (Csikszentmihalyi):** výzva mírně nad schopností (Wordle \~4–6 % nad aktuální úrovní).
  - **Konstrukcionismus (Papert):** učení tvorbou veřejně sdílených artefaktů; "objects-to-think-with"; Scratch jako přímá realizace; Resnick: "distribuovaný konstrukcionismus".
  - **ZPD (Vygotskij):** scaffolding — chatbot v boardu jako scaffold.
  - **Měření úspěchu jinak než časem:** dokončené Questy, "skills to proficient+", kvalita sdílených artefaktů, hloubka fork-tree.

### E) Doporučovací systémy ve vzdělávacím kontextu
  - **Cold start:** pro nové žáky popularita/obsahové filtrování; multi-armed bandit pro rovnováhu explore/exploit.
  - **Filter bubble:** výzkum (DeepMind simulace) ukazuje, že více náhodné explorace snižuje degeneraci systému; serendipita.
  - **Fork/board graf jako signál:** místo engagement signálu používat vzdělávací cesty (kdo co forknul po čem) jako doporučení "dalšího kroku" a "spoj mě se spolužákem, který řeší totéž".

## Recommendations
### Fáze 1 (MVP — okamžitě): postavit ekonomiku navazování, ne lajkování
1.  **Dva mosty místo jednoho.** Pro kurátorský obsah použít **"connect" model Are.na** (jeden Glitch žije ve více boardech, neztrácí vazbu na originál); pro žákovskou práci **"fork" model GitHub/Scratch** (kopie s viditelnou linií autorství).

      - *Získává:* obsah teče bez duplikace; viditelná je linie "kdo na čem staví". *Obětuje:* složitější datový model. *Riziko pro nezletilé:* fork cizí práce musí respektovat viditelnost (viz bod 4). *Pedagogický princip:* konstrukcionismus (Papert) — artefakt jako objekt k myšlení.
2.  **Atribuce jako default (CC-BY-SA jako Scratch).** Každý fork automaticky vede linii k originálu; "postaveno na práci X". *Princip:* gift economy + sounáležitost (SDT).
3.  **Žádné vanity metriky.** Nezavádět lajky, počty sledujících ani veřejné žebříčky. Místo toho **mastery progres (Khan Academy)** — dokončené/zvládnuté Glitche a Questy. *Získává:* eliminuje sociální srovnávání a streak/league anxiety doloženou u Duolinga. *Obětuje:* slabší "okamžitý" dopaminový hook. *Princip:* kompetence bez kontroly (SDT).

### Fáze 2 (po MVP): bezpečnost a komunitní samospráva
1.  **Trojí viditelnost boardů s učitelem jako garantem** (soukromý / veřejný ve třídě / veřejný úplně), **default = soukromý** (Age-Appropriate Design Code). *Riziko:* veřejné boardy nezletilých — proto garance učitele jako podmínka třídní viditelnosti a moderace před plně veřejnou.
2.  **Discourse trust levels místo bodů.** Nováček je v "sandboxu" (omezené veřejné akce); peer-feedback, komentování cizích boardů a plná veřejnost se odemykají postupně podle bezpečného chování. *Princip:* scaffolding (Vygotskij) + bezpečnost nováčků.
3.  **Moderace jako Scratch + Minecraft Education:** automatický filtr + lidská moderace + krátké, dětmi vstřebatelné guidelines + reportování; třídní vrstva "teacher-controlled". Vyhnout se modelu Stack Overflow (reputace jako gatekeeping) — **chyba musí být levná**.

### Fáze 3 (rozšíření): out-of-the-box prvky
1.  **"Glitch dne" (BeReal/Wordle scarcity).** Synchronizovaná denní mikrovýzva pro třídu/komunitu; sdílí se postup, ne skóre. *Získává:* sounáležitost + návyk bez nekonečného scrollu. *Princip:* flow + relatedness.
2.  **Profil = mapa kompetence (Letterboxd).** Profil žáka ukazuje zvládnuté Questy a postavené boardy, ne avatar/popularitu.
3.  **Doporučování přes fork-graf, ne engagement.** "Další krok pro tebe" z mastery dat; "spoj mě se spolužákem, který řeší totéž" z board-grafu; zabudovat náhodnou exploraci proti filter bubble.
4.  **Skupinové boardy + skupinový chatbot** jako cohort-based / learning-in-public mikro-komunita; norma vzájemného povzbuzování (#100DaysOfCode).

### Prahy, které by změnily doporučení
  - Pokud testy ukážou, že MVP bez jakékoli okamžité odměny má nízkou retenci → přidat **mastery-based progres a "Glitch dne"** (ne lajky).
  - Pokud učitelé nestíhají garantovat veřejnost → defaultně držet boardy ve třídní vrstvě a plně veřejné odložit.

## Caveats
  - Mnoho zdrojů o gamifikaci a "streak anxiety" jsou rodičovské/produktové weby (screenwiseapp, ludaxis), ne recenzovaný výzkum; doložené dopady na úzkost u dětí jsou spíše kvalitativní (arXiv případová studie "When Gamification Spoils Your Learning") než velké RCT.
  - Meta-analýza Li, Hew & Du (2024) ukazuje malý celkový efekt na vnitřní motivaci a minimální na kompetenci — gamifikace není zázrak a špatně provedená škodí.
  - Are.na je síť pro dospělé profesionály; přenos na teenagery vyžaduje opatrnost (moderace, srozumitelnost). Číslo 18 791 Premium uživatelů je z vlastní About stránky a může se rychle měnit.
  - Roblox čísla a bezpečnostní data jsou z různě kvalitních zdrojů; Minecraft Education bezpečnostní praxe jsou z provozovatelů kempů, ne nezávislého auditu.
  - "Skills to proficient+" korelace s MAP testem je interní metrika Khan Academy (vlastní zdroj).
