---
id: ch3-bandits
type: spine
title: "Dilema průzkum vs. využití"
readingTime: 3
standalone: true
core: true
teaser: "Má algoritmus ukázat něco, o čem VÍ, že se ti líbí, nebo zkusit něco nového? To je jeden z nejtěžších problémů v doporučování."
voice: universal
parent: null
diagram: null
recallQ: "Co je dilema průzkumu a využití?"
recallA: "Má systém ukázat bezpečné tipy, které se ti líbí (využití), nebo zkusit nové věci, které bys mohl/a objevit (průzkum)? Oboje je důležité."
status: accepted
---

Představ si, že jsi na food courtu s 20 restauracemi. Vyzkoušel jsi 3 a jednu z nich miluješ. Vrátíš se do své oblíbené (bezpečná sázka), nebo zkusíš nové místo (může být skvělé, nebo hrozné)?

![Restaurace průzkumu a využití](/images/comic-bandits.svg)

Tomu se říká **dilema průzkumu a využití** a každý doporučovací systém se s ním potýká neustále.

## Využití: hraj na jistotu

**Využití** znamená doporučovat věci, o kterých algoritmus už ví, že se ti líbí. Sledoval jsi 10 kuchařských videí? Tady je 10 dalších kuchařských videí.

Problém: uvízneš na místě. Možná bys MILOVAL vědecká videa, ale algoritmus ti žádné neukáže, protože je příliš zaneprázdněn využíváním toho, co už zná.

## Průzkum: riskni to

**Průzkum** znamená ukázat ti něco, čím si algoritmus není jistý. Třeba cestovatelský vlog, hudební dokument nebo programovací tutoriál. Většina z nich tě nezaujme — ale jeden může otevřít úplně nový zájem.

## Banditové algoritmy: chytrá rovnováha

Počítačoví vědci to vyřešili pomocí **banditových algoritmů** (pojmenovaných podle výherních automatů — „jednoruký bandita" — v kasinech).

Myšlenka: začni s hodně průzkumem. Jak se dozvídáš, co funguje, postupně přecházej k využití. Ale nikdy průzkum úplně nezastav.

**Thompsonovo vzorkování** — jeden oblíbený přístup — funguje takto:
1. Pro každou položku sleduj, jak často uspěla vs. selhala
2. Náhodně vyber ze statistik úspěšnosti
3. Zobraz položku, která dostala nejvyšší náhodný výběr
4. Tím přirozeně vyvažuješ: položky s málo daty se prozkoumávají, osvědčené položky se využívají

## Kontextuální bandité: ještě chytřejší

Skutečná doporučení závisí na **kontextu**. Možná chceš kuchařská videa v neděli ráno, ale herní videa v pátek večer.

**Kontextuální bandité** berou situaci v úvahu:
- Kolik je hodin?
- Jaké zařízení používáš?
- Co jsi právě sledoval?
- Co je teď trending?

Učí se: „Pro TOHOTO uživatele, v TOMTO kontextu, TYTO položky fungují." Je to jako mít kamaráda, který ví, že chceš pohodlné jídlo, když jsi unavený, a dobrodružné jídlo, když jsi nadšený.

![Dilema průzkumu a využití](/images/diagram-bandit-exploration.svg)

**Proč na tom záleží**: Bez průzkumu jsou doporučení nudná a předvídatelná. Bez využití působí náhodně a neužitečně. Nejlepší systémy nacházejí zlatou střední cestu — a banditové algoritmy jsou přesně ten nástroj, kterým to dělají.
