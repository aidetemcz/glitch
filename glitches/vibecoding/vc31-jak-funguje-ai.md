---
id: vc31-jak-funguje-ai
topic: podKapotou
title: Jak AI vlastně generuje kód?
teaser: Transformery, tokeny a kontextové okno — co se děje pod kapotou.
hook: Co se děje pod kapotou?
---

AI, která píše kód za tebe, se jmenuje **velký jazykový model** (LLM — Large Language Model). Funguje jednoduše: přečte tvůj text a předpovídá, jaké slovo (token) má přijít dál. Dělá to tisíckrát za sekundu — a výsledek vypadá jako inteligentní odpověď.

**Jak se to naučila?** Přečetla miliardy stránek textu — knihy, weby, kód na GitHubu, dokumentace. Nikdo ji neprogramoval pravidlo po pravidlu. Místo toho se naučila vzory: „po tomto kódu obvykle následuje toto." Je to jako když se učíš jazyk poslechem — neučíš se gramatická pravidla, ale slyšíš tolik vět, že intuitivně víš, co zní správně.

**Transformer** je architektura (návrh), na které běží všechny moderní LLM — ChatGPT, Claude, Gemini. Klíčový vynález je **attention** (pozornost): model se umí „podívat zpět" na celý vstupní text a rozhodnout, která slova jsou pro aktuální odpověď nejdůležitější.

? Jak AI generuje kód?
- Má databázi hotových programů a vybírá ten nejpodobnější
- Postupuje podle pevně naprogramovaných pravidel
* Předpovídá další token (slovo) na základě vzorů naučených z miliard textů
- Kopíruje kód z internetu v reálném čase
! Přesně! LLM předpovídá token po tokenu — každé další slovo na základě všeho předchozího.

+++

**Transformer — trochu víc do hloubky:**

Transformer vynalezli výzkumníci z Googlu v roce 2017 (slavný paper „Attention Is All You Need"). Před ním AI zpracovávala text postupně zleva doprava — jako čtení knihy. Transformer umí „vidět" celý text najednou a rozhodnout, na co se zaměřit.

**Příklad attention mechanismu:** Ve větě „Kočka seděla na rohožce a olizovala si *tlapky*" — model potřebuje vědět, že „tlapky" patří ke „kočce", ne k „rohožce". Attention tohle řeší — vytvoří vazby mezi slovy podle jejich významu.

**Co je token?** Token není přesně slovo. „Programování" může být 2-3 tokeny. Čísla, interpunkce, kód — vše se rozseká na tokeny. Jeden token je zhruba 4 znaky nebo 3/4 slova.

**Proč AI dělá chyby?** Protože nepřemýšlí — předpovídá. Někdy je nejpravděpodobnější pokračování špatné. Proto je důležité výsledky kontrolovat a testovat. AI je nástroj, ne neomylný expert.

**Kontextové okno** — jak moc si AI „pamatuje":**

Představ si AI jako člověka, který čte tvůj dopis. Kontextové okno je délka dopisu, který se vejde na stůl. Claude má okno ~200 000 tokenů, GPT-4 ~128 000. Když je tvůj projekt větší, AI vidí jen jeho část — proto je modulární přístup tak důležitý.

**Teplota (temperature):** Nastavení, jak „kreativní" má AI být. Nízká teplota = předvídatelné, konzistentní odpovědi. Vysoká teplota = kreativnější, ale méně spolehlivé. Pro kód chceš nízkou teplotu.

**Hallucinations (halucinace):** AI někdy vymýšlí věci, které neexistují — funkce, knihovny, API. Proto vždy testuj výsledek. Pokud AI říká „použij funkci xyz", ověř že existuje.
