---
id: ch3-attention
type: spine
title: "Self-attention: Ne každý klik je stejně důležitý"
readingTime: 3
standalone: false
teaser: "Proč film, co jsi sledoval včera, je důležitější než ten z před 3 měsíců — a jak se transformery učí, na co se zaměřit."
voice: thinker
parent: null
diagram: diagram-attention
core: false
recallQ: "Proč doporučovač nezachází se všemi tvými minulými interakcemi stejně?"
recallA: "Nedávné interakce a interakce odpovídající tvé aktuální náladě/kontextu jsou mnohem relevantnější. Self-attention umožňuje modelu naučit se, na které minulé položky se zaměřit a které ignorovat."
status: accepted
---

Za poslední rok jsi zhlédl 500 videí. Když YouTube vybírá, co ti ukáže dál, měl by se starat o všech 500 stejně? Jasně, že ne — kuchařská show z před 3 měsíců je mnohem méně důležitá než sci-fi film, co jsi sledoval včera.

## Problém s jednoduchým přístupem k historii

Základní doporučovače zacházejí s tvou historií jako se seznamem — všechno počítají stejně. Sledoval jsi jednou v říjnu horor? Budeš dostávat horory i v březnu. Binge-watchoval jsi kuchařské pořady, když jsi byl nemocný? Algoritmus si myslí, že ses rekvalifikoval na kuchaře.

## Attention: Naučit se, na co se soustředit

**Self-attention** (klíčová myšlenka za transformery — stejná technologie jako za ChatGPT!) tohle řeší otázkou: „Pro TENTO okamžik, které minulé interakce jsou skutečně důležité?"

Model přiřadí každé položce v tvé historii **váhu pozornosti**:

- 🟢 **Vysoká váha**: nedávné položky, položky podobné tomu, co teď prohlížíš, položky u kterých jsi strávil hodně času
- 🔴 **Nízká váha**: staré položky, náhodné jednorázové kliky, položky z jiného kontextu (jako ta kuchařská fáze)

## Jak to funguje (zjednodušeně)

1. Každá položka v tvé historii se stane vektorem (embedding — pamatuješ?)
2. Aktuální kontext (čas, zařízení, co jsi právě sledoval) se taky stane vektorem
3. Model spočítá **skóre podobnosti** mezi kontextem a každou historickou položkou
4. Položky s vysokou podobností dostanou vysoké váhy pozornosti
5. Finální doporučení vychází z **váženého průměru** — nedávné, relevantní položky mají největší vliv

## Proč je to revoluce

Před attention systémy používaly celou tvou historii stejně, nebo jen posledních 10 položek. Attention umožňuje modelu být chirurgicky přesný — zaměřit se na 5 položek z tvé historie, které skutečně předpovídají, co chceš PRÁVĚ TEĎ, a ignorovat zbylých 495.

Proto doporučení dnes působí chytřeji. Systém se nedívá jen na to, co jsi sledoval — učí se, KTERÉ věci z tvé historie jsou relevantní pro přesně tento okamžik.

## Dopady v praxi

- **YouTube**: Tvá historie sledování o víkendu (odpočinkový obsah) dostane jiné váhy než pracovní dny (vzdělávací)
- **Spotify**: Pondělní ranní hudební preference mají menší váhu v pátek večer
- **TikTok**: Appka se naučí, že tvé scrollovací vzory v 8 ráno jsou úplně jiné než ve 23:00
