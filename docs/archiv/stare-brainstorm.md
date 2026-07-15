# Staré

_ARCHIV — staré poznámky a brainstorm. Ponecháno pro historii. Dřív Google Docs, teď zdroj pravdy tady. Poslední převod: 2026-07-15._

## Co nám vlastně říká Dorsey a Unsee

Dorseyho projekt, na který narážíš, je nejspíš Bitchat (2025) — mesh messaging přes Bluetooth, bez serverů, bez účtů. Princip, který tě zajímá, ale není „Bluetooth". Je to úmyslně vložená fyzická friction, která mění ekonomiku sdílení. Když musíš být fyzicky u někoho, aby k výměně došlo, stane se několik věcí najednou: sdílení se zpomalí, naváže se na reálný vztah, znemožní se anonymní masová distribuce a obsah dostane lokální kontext. Tohle je design přes omezení — hodnotu vytváří to, co síť neumí, ne to, co umí.

Unsee (a celá rodina ephemeral appek — Snapchat, dřív Yik Yak) ukazuje druhou stranu téže mince: pomíjivost + anonymita = beztrestnost. Mizící obsah znamená, že po pachateli nezbude stopa, takže se odpovědnost rozpustí. Tvůj příklad se závadným obsahem je extrémní projev obecnějšího zákona: každá vlastnost, která snižuje dohledatelnost a odpovědnost, je zneúměrně atraktivní pro toho, kdo má co skrývat. Pro síť pro nezletilé je tohle přímo varovný majáček — ephemeralita a anonymita jsou u dětí skoro vždy špatný nápad, byť lákavě „cool".

Takže než vyjmenuju modely, dám ti dva úhly pohledu, kterými je budu hodnotit, protože bez nich je seznam jen katalog:

Jakou ekonomiku sdílení daná mechanika vytváří? Co se stává levným a co drahým? (Dorsey udělal sdílení drahým a tím vzácným.) Kam přesouvá odpovědnost a viditelnost? (Unsee ji smazal)

Teď k samotné rešerši. Rozdělím ji do několika rodin, protože „model fungování sítě" je víc os najednou.

### Rodina 1: Design přes omezení (scarcity & friction jako feature)

Tohle je přímo Dorseyho linie a podle mě nejpodceňovanější zdroj nápadů pro Glitch.

Be Real je nejčistší současný příklad. Jednou denně, v náhodný čas, dostanou všichni notifikaci „⚠️ Time to BeReal" a mají dvě minuty na nefiltrovanou fotku z přední i zadní kamery. Genialita je v tom, že omezení produkuje autenticitu — nemáš čas si nic naaranžovat. Co to obětuje: tvořivost a kvalitu. Co získává: nízký tlak, žádné soutěžení o nejlepší obsah. Pro Glitch zajímavá lekce: synchronizovaná, časově omezená výzva pro všechny najednou vytváří pocit sounáležitosti — všichni řešíte totéž ve stejnou chvíli. Představ si „Glitch dne" v 16:00, jeden mikrotéma, celá komunita ho luští naráz.

Wordle dotáhl scarcity do dokonalosti: jedna hádanka denně, pro všechny stejná, žádná appka, žádný účet, výsledek se sdílí jako spoiler-free mřížka emoji. Co Wordle naučil celý obor: umělý strop spotřeby ("už dnes nic dalšího nemáš") je opak nekonečného scrollu a paradoxně zvyšuje hodnotu i konverzaci. Když nemůžeš hrát víc, mluvíš o tom místo abys hrál dál. Pro Glitch: limit „3 Glitche denně" zní jako produktové sebevražda, ale ve skutečnosti chrání proti vyhoření a dělá z dokončení událost. Stojí za vážné zvážení, aspoň jako varianta.

Dorsey/Bitchat — proximity sharing. Pro Glitch by fyzická friction mohla fungovat ve školní třídě: některé Glitche nebo výtvory se „odemknou" jen když jsi fyzicky u spolužáka (přes QR, ne nutně Bluetooth). Vytváří to peer learning přes reálný kontakt. Riziko: vylučuje to děti, co nemají s kým — a to je u nezletilých citlivé. Spíš jako bonusová vrstva než páteř.

### Rodina 2: Strukturovaná reputace a komunitní samospráva

Tady jsou nejlepší ne-mainstreamové modely a zároveň nejlepší obrana proti tomu, aby se síť zvrhla.

Discourse trust levels jsou podle mě nejlepší existující šablona pro Glitch. Uživatel postupuje přes pět úrovní (0–4) čistě podle chování: kolik toho přečetl, jak dlouho je aktivní, jestli ho komunita flaguje. S každou úrovní se odemykají schopnosti — víc odkazů, možnost editovat, nakonec kvazi-moderátorská práva. Krása je, že důvěra se zaslouží průchodem systému, ne lajky. Pro síť pro děti je to ideální, protože nový uživatel má z principu omezené možnosti (nemůže hned posílat odkazy, zprávy cizím lidem) a práva si odemyká prokázanou slušností. Bezpečnostní mantinel a engagement mechanika v jednom.

Stack Overflow reputace ukazuje opačnou lekci — varovnou. Reputace tam vznikla jako geniální nápad (body za užitečné odpovědi, ne za aktivitu), ale degenerovala do statusové hry, gatekeepingu a odrazování nováčků. Reputace navázaná na body skoro vždy zplodí soutěž a strach z chyby — což je u dětí přímo jed, protože strach z chyby zabíjí učení. Lekce pro Glitch: pokud reputace, tak ať odemyká schopnosti a důvěru (jako Discourse), ne ať produkuje žebříček a skóre (jako SO).

Reddit — komunitní moderace přes dobrovolníky. Funguje díky tomu, že každý subreddit má vlastní normy a vlastní moderátory. Lekce: malá komunita s vlastními pravidly se reguluje líp než globální dav. Ale u nezletilých nemůžeš spoléhat na to, že moderování utáhnou děti samy — potřebuješ dospělého garanta (učitele) jako „super-moderátora". To míří k modelu malých skupin, ke kterému se dostanu.

Wikipedia — gift economy + radikální transparentnost. Nikdo nedostává body ani lajky, motivací je příspěvek ke společnému dílu a uznání v komunitě. Každá editace je navždy dohledatelná (opak Unsee!). Tahle dohledatelnost je ten moderační mechanismus. Pro Glitch: „tržiště výtvorů", kde se ceníš tím, co jsi přispěl ostatním, ne kolik máš sledujících — k tomu se ještě vrátím, je to podle mě pro Glitch jeden z nejnosnějších směrů.

### Rodina 3: Malé skupiny místo globálního feedu

Tohle je možná nejdůležitější strukturální rozhodnutí, které před vámi stojí, tak ho vypíchnu.

Mainstream (TikTok, Instagram) staví na globálním feedu s jedním vítězem — všichni soutěží o pozornost stejného publika, vzniká hvězdná ekonomika a srovnávání. To je přesně to, čemu se podle tvého zadání chcete vyhnout.

Discord / model malých serverů dělá opak: identita a status jsou lokální. V serveru o 30 lidech jsi „někdo", kdo umí vysvětlit smyčky v kódu, a tvoje hodnota není měřena globálně. Sounáležitost přes malou skupinu škáluje líp než status přes velkou. Pro Glitch by „skupina" mohla být přirozeně školní třída nebo kroužek — a to řeší i bezpečnost (uzavřená, dospělým garantovaná skupina je řádově bezpečnější než otevřená síť).

Co to obětuje: virální dosah a „náhodné nalezení skvělého obsahu". Co získává: bezpečí, nižší srovnávání, hustší vztahy, snazší moderaci. Pro síť pro děti mi tahle výměna přijde skoro vždy správná. Doporučovací systém pak neslouží k tomu „najít nejlepší obsah na světě", ale „najít další krok pro tebe" a „spojit tě se spolužákem, který řeší totéž" — což je mimochodem mnohem snazší cold-start problém.

### Rodina 4: Spolupráce a tvorba místo konzumace

Tady je největší prostor pro „out of the box" a zároveň nejlepší soulad s pedagogikou (Papertův konstrukcionismus — učíme se tvorbou veřejně sdílených artefaktů).

Scratch je tvůj nejdůležitější referenční bod, protože je to už třicet let fungující vzdělávací síť pro děti. Děti tvoří hry a animace, sdílejí je a — klíčové — „remixují" cizí projekty. Remix je geniální mechanika, protože sdílení neznamená „lajkni mi to" ale „postav na tom dál". Atribuce je vidět (vidíš strom remixů), takže vzniká gift economy bez statusové soutěže. Yik Yak měl mizení, Scratch má opak — trvalou viditelnou linii toho, kdo na čem stavěl. Pro Glitch: nech děti vytvořit vlastní Glitch a nech ostatní na něm stavět. To je podle mě nejsilnější jediný nápad v celé téhle rešerši.

GitHub — fork, pull request, contribution graph. Dospělá verze téhož. Zajímavý prvek je, že status (zelené čtverečky) měří kontinuitu vlastní práce, ne popularitu. Srovnáváš se hlavně se sebou. To je přesně ta metrika napojená na pokrok, ne na marnivost.

Duolingo musím zmínit, protože je to nejúspěšnější vzdělávací návyková smyčka — a zároveň varování. Streaky, ligy, žebříčky fungují brutálně dobře na retenci. Ale liga a žebříček jsou čisté sociální srovnávání a Duolingo dnedávno čelilo kritice za to, že některé prvky tlačí spíš úzkost než učení (agresivní notifikace, strach ze ztráty streaku). Lekce: streak má smysl jen pokud měří návyk, ne výkon, a pokud jeho ztráta nebolí. Existují „streak freeze" právě proto. Pro Glitch bych streak zvažoval, ale očištěný od ligy a od trestání.

### Rodina 5: Kurátorství a pomalé sítě

Are.na je antiteze TikToku — síť pro sbírání a propojování obsahu do „kanálů", bez metrik, bez lajků, bez algoritmu, záměrně pomalá a estetická. Lidé tam kurátorují, ne performují. Ukazuje, že síť může být přitažlivá bez jediné vanity metriky — hodnotou je smysluplné propojení nápadů. Pro Glitch inspirativní: co kdyby děti kurátorovaly vlastní cesty učení a sdílely je jako „kanály"/playlisty Glitchů? Sdílíš cestu, ne sebe.

Letterboxd / Goodreads — sítě postavené na sdílení toho, co jsi zkonzumoval/dokázal, ne tebe samotného. Identita přes „co mě baví a co jsem prošel" je zdravější než přes „jak vypadám". Pro Glitch: profil = mapa toho, co ses naučil a vytvořil, ne sbírka selfie.

### Co bych z toho destiloval pro Glitch

Když to projedu oběma čočkami (ekonomika sdílení + odpovědnost/viditelnost), sbíhá se mi to do několika principů:

Dělej sdílení vzácným a navázaným na tvorbu, ne levným a navázaným na status. Místo „lajkni" → „postav na tom dál" (Scratch remix). Místo nekonečného feedu → omezený denní Glitch (Wordle scarcity). Tím řešíš zábavu i wellbeing najednou.

Status ať je lokální a založený na důvěře, ne globální a na bodech. Discourse trust levels jako páteř (bezpečnost + progrese v jednom), malé skupiny à la Discord/třída místo globálního feedu. Vyhneš se srovnávání a zároveň zjednodušíš moderaci i cold start.

Viditelnost a dohledatelnost ber jako bezpečnostní funkci, ne bug. Pravý opak Unsee. U dětí žádná ephemeralita, žádná anonymita vůči garantovi. Wikipedia/Scratch ukazují, že trvalá atribuce je ten moderační nástroj.

Měř pokrok, ne popularitu. GitHub contribution graph, Letterboxd-styl profil = „co jsem prošel a vytvořil". Srovnání hlavně se sebou.
