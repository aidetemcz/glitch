const TOPICS = {
  ai: { label: 'AI', emoji: '🤖', color: '#00A3FF', bg: 'linear-gradient(135deg, #0a1628 0%, #0d2d5e 50%, #003d80 100%)' },
  priroda: { label: 'Příroda', emoji: '🌿', color: '#00E676', bg: 'linear-gradient(135deg, #0a1a0a 0%, #0d3d1a 50%, #005522 100%)' },
  matematika: { label: 'Matematika', emoji: '🔢', color: '#B44FFF', bg: 'linear-gradient(135deg, #150a28 0%, #2d0d5e 50%, #3d0080 100%)' },
  media: { label: 'Média', emoji: '📱', color: '#FF6B00', bg: 'linear-gradient(135deg, #1a0d00 0%, #3d1a00 50%, #6b2d00 100%)' },
};

const GLITCHES = [
  {
    id: 'ai-01',
    topic: 'ai',
    title: 'Jak tě sleduje algoritmus?',
    teaser: 'Každý klik, každé zastavení — algoritmus si to pamatuje.',
    chat: [
      { bot: 'Víš, proč ti TikTok vždycky doporučí přesně to, co chceš vidět?' },
      { bot: 'Algoritmus sleduje, u čeho se zastavíš, co přeskočíš, co sdílíš nebo lajkuješ.' },
      { bot: 'Čím víc ho používáš, tím lépe tě "zná" — a tím víc tě dokáže udržet na místě.' },
      { bot: 'A teď otázka pro tebe:' },
      {
        quiz: {
          question: 'Co sleduje doporučovací algoritmus nejdřív?',
          options: ['Kolik máš followerů', 'Jak dlouho se díváš na video', 'Jestli máš prémium účet', 'Kdy jsi naposled spustil appku'],
          correct: 1,
          explanation: 'Přesně tak! Délka zhlédnutí je nejsilnější signál — říká algoritmu, co tě opravdu baví.',
        },
      },
    ],
  },
  {
    id: 'ai-02',
    topic: 'ai',
    title: 'Učí se stroje opravdu samy?',
    teaser: 'Strojové učení neznamená, že si robot sám dělá domácí úkoly.',
    chat: [
      { bot: 'Když říkáme, že se "stroj učí", co to vlastně znamená?' },
      { bot: 'AI se neučí jako ty ve škole. Dostane miliony příkladů a hledá v nich vzory.' },
      { bot: 'Třeba: ukážeš jí tisíce fotek koček a psů s popisky. Ona se naučí, co dělá kočku kočkou.' },
      { bot: 'Otázka:' },
      {
        quiz: {
          question: 'Co je základem strojového učení?',
          options: ['Robot, který čte knihy', 'Spousta dat s příklady', 'Programátor, který napíše všechna pravidla', 'Rychlý procesor'],
          correct: 1,
          explanation: 'Správně! Bez dat to nejde. Data jsou "zkušenosti", ze kterých se AI učí.',
        },
      },
    ],
  },
  {
    id: 'priroda-01',
    topic: 'priroda',
    title: 'Proč jsou lesy plíce Země?',
    teaser: 'Lesy produkují kyslík. Ale to je jen začátek jejich superschopností.',
    chat: [
      { bot: 'Slyšel/a jsi, že lesy jsou "plíce planety"? Ale co to doopravdy znamená?' },
      { bot: 'Stromy při fotosyntéze pohlcují CO₂ a vypouštějí kyslík. Jeden velký strom zásobí kyslíkem 2 lidi na celý rok.' },
      { bot: 'Ale lesy taky regulují teplotu, zadržují vodu v krajině a jsou domovem pro 80 % suchozemských druhů.' },
      { bot: 'Takže:' },
      {
        quiz: {
          question: 'Co stromy při fotosyntéze pohlcují?',
          options: ['Kyslík', 'Dusík', 'Oxid uhličitý (CO₂)', 'Vodní páru'],
          correct: 2,
          explanation: 'Správně! CO₂ je hlavní skleníkový plyn — a stromy ho přeměňují na kyslík a biomasu.',
        },
      },
    ],
  },
  {
    id: 'priroda-02',
    topic: 'priroda',
    title: 'Jak včely zachraňují svět?',
    teaser: 'Bez včel by zmizela třetina jídla z tvého talíře.',
    chat: [
      { bot: 'Včely jsou malé, ale bez nich by planeta vypadala úplně jinak.' },
      { bot: 'Opylovávají rostliny — přenáší pyl z květu na květ. Bez toho nevzniknou plody ani semena.' },
      { bot: 'Asi 75 % všech potravinových plodin závisí na opylovačích. Jablka, mandle, borůvky, avokádo... všechno.' },
      { bot: 'Zkus to:' },
      {
        quiz: {
          question: 'Co by se stalo, kdybychom přišli o všechny opylovače?',
          options: ['Nic moc, rostliny se přizpůsobí', 'Zmizela by asi třetina naší potravy', 'Pouze by podražily banány', 'Příroda by si poradila sama do roka'],
          correct: 1,
          explanation: 'Přesně tak. Bez opylovačů bychom přišli o obrovskou část potravin — a s tím i o ekosystémy závislé na plodech.',
        },
      },
    ],
  },
  {
    id: 'math-01',
    topic: 'matematika',
    title: 'Fibonacciho spirála je všude',
    teaser: 'Slunečnice, mušle, galaxie — všude se schovává stejný vzor čísel.',
    chat: [
      { bot: 'Zkus tuhle řadu čísel: 1, 1, 2, 3, 5, 8, 13, 21... Vidíš vzor?' },
      { bot: 'Každé číslo je součet dvou předchozích. Tomu říkáme Fibonacciho posloupnost.' },
      { bot: 'A teď to skvělé: tento vzor najdeš v přírodě skoro všude. Ve spirálách slunečnice, v mušli nautila, dokonce ve spirálních ramenech galaxií.' },
      { bot: 'Otázka:' },
      {
        quiz: {
          question: 'Jaké je další číslo v řadě: 1, 1, 2, 3, 5, 8, ...?',
          options: ['11', '12', '13', '15'],
          correct: 2,
          explanation: 'Správně! 8 + 5 = 13. Fibonacciho posloupnost roste exponenciálně, ale vždy podle stejného pravidla.',
        },
      },
    ],
  },
  {
    id: 'math-02',
    topic: 'matematika',
    title: 'Proč nesmíš dělit nulou?',
    teaser: 'Tohle pravidlo ze školy má hlubší důvod, než si myslíš.',
    chat: [
      { bot: 'Učitel říká "nulou se nedělí" — ale proč? Co by se stalo, kdybychom to zkusili?' },
      { bot: 'Dělení znamená: kolikrát se vejde jedno číslo do druhého. 10 ÷ 2 = 5, protože 2 se do 10 vejde pětkrát.' },
      { bot: 'A 10 ÷ 0? Kolikrát se vejde nula do deseti? Nekonečněkrát? To by znamenalo, že 0 × ∞ = 10 — a to matematika nedovolí, rozbilo by to celý systém.' },
      { bot: 'Tak:' },
      {
        quiz: {
          question: 'Proč je výsledek 10 ÷ 0 "nedefinováno"?',
          options: ['Protože kalkulačka to neumí', 'Neexistuje číslo, které by splnilo podmínku', 'Je to příliš velké číslo na zapsání', 'Matematici se ještě neshodli'],
          correct: 1,
          explanation: 'Přesně tak! Neexistuje žádné číslo x takové, že 0 × x = 10. Proto výsledek prostě neexistuje.',
        },
      },
    ],
  },
  {
    id: 'media-01',
    topic: 'media',
    title: 'Co je deepfake a jak ho poznat?',
    teaser: 'Video, kde řekneš cokoli — ale ty jsi u toho nebyl. Je to možné?',
    chat: [
      { bot: 'Představ si video, kde tvůj oblíbený herec říká věci, které nikdy neřekl. A vypadá to dokonale.' },
      { bot: 'Deepfake je video nebo audio vytvořené umělou inteligencí, která "překryje" tvář nebo hlas skutečné osoby.' },
      { bot: 'Jak poznat deepfake? Sleduj: nepřirozené mrkání, rozmazané hrany kolem obličeje, divný rytmus hlasu nebo záškuby při pohybu.' },
      { bot: 'Test:' },
      {
        quiz: {
          question: 'Co je nejspolehlivější způsob, jak ověřit podezřelé video?',
          options: ['Podívat se na počet lajků', 'Ověřit informaci ve více důvěryhodných zdrojích', 'Zkontrolovat, kdo video sdílel', 'Hledat, jestli má video titulky'],
          correct: 1,
          explanation: 'Správně! Jedna věc platí vždy: ověřuj ve více zdrojích. Deepfake může vypadat přesvědčivě — ale to samé tvrdí i zdroj, který ho šíří.',
        },
      },
    ],
  },
  {
    id: 'media-02',
    topic: 'media',
    title: 'Uvízl/a jsi v informační bublině?',
    teaser: 'Sociální sítě ti ukazují svět — ale jen ten kousek, který "chceš" vidět.',
    chat: [
      { bot: 'Zkus si vzpomenout: kdy jsi naposledy na sociálních sítích narazil/a na názor, se kterým úplně nesouhlasíš?' },
      { bot: 'Algoritmy totiž mají tendenci ti ukazovat to, co tě baví a s čím souhlasíš. Říká se tomu "informační bublina" nebo "echo komora".' },
      { bot: 'Problém? Přestáváš vidět, co si myslí ostatní. A to může vést k tomu, že ti vlastní pohled přijde jako jediná pravda.' },
      { bot: 'Takže:' },
      {
        quiz: {
          question: 'Co způsobuje informační bublinu?',
          options: ['Špatné internetové připojení', 'Algoritmy, které preferují obsah, který tě baví', 'Příliš mnoho sledovaných účtů', 'Zastaralé aplikace'],
          correct: 1,
          explanation: 'Přesně tak! Algoritmy optimalizují zapojení — a to znamená, že ti ukáží to, s čím souhlasíš, i když to může zkreslovat pohled na svět.',
        },
      },
    ],
  },
];

const MISSIONS = [
  {
    id: 'mission-ai',
    title: 'AI Detektiv',
    description: 'Pronikni do světa umělé inteligence a zjisti, jak tě sledují algoritmy.',
    emoji: '🤖',
    topic: 'ai',
    glitches: ['ai-01', 'ai-02'],
  },
  {
    id: 'mission-priroda',
    title: 'Zelená planeta',
    description: 'Zjisti, proč příroda funguje jako dokonale propojený systém.',
    emoji: '🌿',
    topic: 'priroda',
    glitches: ['priroda-01', 'priroda-02'],
  },
  {
    id: 'mission-math',
    title: 'Čísla kolem nás',
    description: 'Matematika není jen škola — skrývá se v přírodě, vesmíru i každodenním životě.',
    emoji: '🔢',
    topic: 'matematika',
    glitches: ['math-01', 'math-02'],
  },
  {
    id: 'mission-media',
    title: 'Mediální šéf',
    description: 'Nauč se rozpoznat manipulaci, deepfaky a informační bubliny.',
    emoji: '📱',
    topic: 'media',
    glitches: ['media-01', 'media-02'],
  },
];
