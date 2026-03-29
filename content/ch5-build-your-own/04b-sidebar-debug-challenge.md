---
id: ch5-debug
type: spine
title: "Výzva: Hledej chybu!"
readingTime: 1
standalone: true
teaser: "Tvoje předpověď byla špatná. Dokážeš přijít na to, proč? Vítej v ladění doporučovače."
voice: creator
parent: null
diagram: null
recallQ: "I algoritmus Netflixu se mýlí jak často?"
recallA: "20–30 % případů! Dokonalost není cíl – být správně VE VĚTŠINĚ případů je to, na čem záleží."
status: accepted
---

Tvůj doporučovací systém právě udělal předpověď: tvůj kamarád **Sam** ohodnotí film *Frozen* 4 z 5 hvězdiček. Zdá se to rozumné — Samův dvojník vkusu ho miloval a Samovi se líbí animované filmy.

Ale pak Sam film skutečně zhlédl. Skutečné hodnocení? **2 hvězdičky.** Sakra.

Tvůj systém se mýlil. Ale PROČ? Tady začíná ladění (debugging) být zábavné. Pojďme to prozkoumat.

## Podezřelí

**Podezřelý A: Dvojník vkusu si ve skutečnosti nebyl tak podobný.**
Možná Sam a dvojník vkusu souhlasili u 3 filmů, ale to byly všechno akční filmy. V animovaných filmech mají úplně různé názory. Podobný v jedné oblasti neznamená podobný ve všech oblastech.

**Podezřelý B: Sam to už viděl.**
Možná Sam viděl Frozen před lety a nudilo ho to zhlédnout znovu. Systém o tom starším shlédnutí nevěděl. Opakované shlédnutí je velmi odlišné od prvního.

**Podezřelý C: Špatný film, správná série.**
Co když tvoje data říkala „Frozen", ale Sam ve skutečnosti sledoval *Frozen 2*? Pokračování jsou záludná — milovat jedničku nezaručuje, že tě baví dvojka. A doporučovací systém, který míchá filmy v sérii, má problém s kvalitou dat.

**Podezřelý D: Špatné načasování.**
Možná Sam ten den byl v hrozné náladě. Pohádal se s kamarádem. Nebyl v náladě na veselý animovaný film. Doporučení nemůžou předvídat, jak se PRÁVĚ TEĎ cítíš.

## Verdikt

Tady je pravda: **VŠECHNY tyto problémy jsou skutečné problémy doporučovacích systémů.** Inženýři nazývají mezeru mezi předpovědí a realitou **chybou předpovědi** (prediction error). A každý systém ji má.

Cílem není být dokonalý. Cílem je mít pravdu VE VĚTŠINĚ případů. I nejlepší algoritmus Netflixu se mýlí v 20–30 % případů. To je naprosto normální.

## Tvůj tah

Přemýšlej o posledním doporučení aplikace, které se ti nelíbilo. Který podezřelý si myslíš, že byl zodpovědný? Byl to špatný vkusový match, stará data, záměna, nebo prostě špatné načasování?

Dobrý debugger se ptá „proč jsem se mýlil?" místo aby jen řekl „to bylo špatně." Takhle skuteční inženýři zlepšují systémy — chybu po chybě.
