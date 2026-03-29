---
id: ch5-math-d-think
type: spine
title: "Matematika za podobností"
readingTime: 3
standalone: false
teaser: "Jak počítače měří podobnost pomocí kosinové podobnosti."
voice: thinker
parent: null
diagram: null
recallQ: "Co měří kosinová podobnost?"
recallA: "Úhel mezi dvěma vektory preferencí – takže někdo, kdo hodnotí vše nízko, ale ve stejném VZORCI jako ty, je stále podobný."
status: accepted
---

Metoda „průměrného rozdílu" z hlavní kapitoly funguje dobře pro malý projekt. Ale skutečné doporučovací systémy potřebují něco přesnějšího. Nejoblíbenější metoda se nazývá **kosinová podobnost** (cosine similarity) — a je intuitivnější, než to zní.

**Představ si to jako kompas.**

Představ si, že hodnocení každé osoby jsou jako směr na kompasu. Pokud Alex hodnotí tři filmy [5, 4, 5], je to jako ukazovat jedním směrem. Pokud Sam hodnotí stejné filmy [5, 5, 4], ukazuje velmi podobným směrem. Pokud Jordan hodnotí [1, 2, 1], ukazuje téměř opačným směrem.

Kosinová podobnost měří **úhel** mezi „směry" dvou lidí. Pokud ukazují stejným směrem, úhel je malý a podobnost je blízko **1**. Pokud ukazují úplně různými směry, podobnost je blízko **0**. A pokud jsou přesně naproti sobě, je **-1**.

**Jednoduchý příklad:**

Alex hodnotí dva filmy: [5, 4]
Sam hodnotí stejné filmy: [5, 5]

Představ si to jako šipky na grafu. Alexova šipka jde 5 jednotek doprava a 4 jednotky nahoru. Samova šipka jde 5 doprava a 5 nahoru. Ukazují téměř stejným směrem!

Vzorec vypočítá úhel mezi těmito šipkami. Bez přesné rovnice – co je důležité:

- Alex [5, 4] vs. Sam [5, 5] = podobnost **0,98** (super podobní!)
- Alex [5, 4] vs. Jordan [1, 2] = podobnost **0,95** (hmm, také vysoká?)

Počkej — to nevypadá správně. Jordan dal nízká hodnocení, ale vzorec je podobný (oba dávají přednost prvnímu filmu). To je ve skutečnosti důležitý poznatek: kosinová podobnost měří **vzorec**, ne velikost čísel. Někdo, kdo hodnotí vše nízko, ale ve stejném vzorci jako ty, je považován za podobného.

**Proč na tom záleží:**

Někteří lidé jsou „přísní hodnotitelé", kteří nikdy nedají 5 hvězdiček. Jiní dají 5 hvězdiček skoro všemu. Kosinová podobnost se o tento rozdíl nestará — zajímá se o to, jestli SOUHLASÍTE v tom, které filmy jsou lepší nebo horší než jiné.

**Co počítače skutečně dělají:**

Skutečné systémy zkouší mnoho různých měr podobnosti a pomocí A/B testů (z předchozí kapitoly!) zjišťují, která funguje nejlépe pro jejich data. Kosinová podobnost je nejčastější výchozí bod, ale není jedinou možností.

![Maticová faktorizace](/images/comic-mf.svg)

![Rozklad matice](/images/diagram-mf-decomposition.svg)

**Klíčová myšlenka:** Podobnost spočívá v hledání lidí, jejichž názory se pohybují stejným směrem jako ty – ne lidí, kteří používají stejná hvězdičková hodnocení.
