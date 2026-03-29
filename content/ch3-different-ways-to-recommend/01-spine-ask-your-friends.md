---
id: ch3-friends
type: spine
title: "Zeptej se přátel"
readingTime: 3
standalone: true
core: true
teaser: "Co kdybys mohl dostat tipy od milionu lidí, kteří mají úplně stejný vkus jako ty?"
voice: universal
parent: null
diagram: kids-collaborative-filtering
recallQ: "Jak funguje kolaborativní filtrování?"
recallA: "Najdi lidi s podobným vkusem → doporuč jim to, co tito lidé měli rádi, a co ty ještě neznáš."
status: accepted
---

Otázka: jak obvykle přicházíš na nové věci ke sledování?

Většina lidí se prostě zeptá kamarádů. „Hej, viděl jsi poslední dobou něco dobrého?" A když má ten kamarád skvělý vkus — pokud ti vždy doporučuje věci, které pak miluješ — věříš mu příště ještě víc.

![Příběh kolaborativního filtrování](/images/comic-cf.svg)

Teď si představ, že se můžeš zeptat MILIONU lidí najednou. Ne jenom pěti nejlepších kamarádů, ale milion cizích lidí, kteří mají naprosto stejný vkus jako ty.

To je **kolaborativní filtrování**. Je to jeden z nejstarších a nejsilnějších triků v doporučovacím světě.

## Jak to funguje

Tady je základní myšlenka. Řekněme, že ty a tvůj spolužák Maya jste zhlédli spoustu filmů:

- Oba jste milovali *Spider-Man: Paralelní světy*
- Oba jste milovali *Encanto*
- Oba jste milovali *Mitchellovi vs. stroje*
- Oba jste si mysleli, že *Červená* je úžasná
- Oba jste palec nahoru dali *Luce*

Pět filmů, na kterých se shodujete. Pět z pěti. Ty a Maya máte skoro totožný vkus!

Teď Maya sleduje něco nového — *Nimona* — a absolutně ho to nadchne. Ty jsi to ještě neviděl.

Co udělá systém? Řekne: „Hej, ty a Maya jste se shodli na VŠEM dosud. Maya miloval *Nimonu*. Pravděpodobně ji budeš milovat taky."

A doporučí ti *Nimonu*.

## To je kolaborativní filtrování

Slovo „kolaborativní" znamená spolupracující. Systém nepotřebuje chápat, PROČ se ti ty filmy líbí. Nepotřebuje vědět, že jsou animované, zábavné, nebo mají skvělou hudbu. Stačí mu vědět, že **lidé, kteří se shodli v minulosti, se pravděpodobně shodnou i v budoucnosti**.

Je to jako být součástí obrovského klubu lidí se skvělým vkusem, kteří si navzájem doporučují věci — aniž by o tom věděli.

## Skutečné měřítko

Na YouTube to není jen ty a Maya. Jsou to **miliardy** uživatelů. Systém hledá vzory přes všechny z nich:

- 50 000 lidí, kteří sledovali stejná Minecraft videa jako ty, také sledovalo toto parkour video
- 200 000 posluchačů Spotify, kteří milují stejných 10 písniček jako ty, miluje i tohoto nového umělce
- 10 milionů diváků Netflixu s podobným vkusem dalo tomuto seriálu 5 hvězd

Čím více lidí systém používá, tím lepší se stává. Proto mají velké platformy jako YouTube a TikTok tak dobré doporučování — mají k dispozici TOLIK dat.

**Zamysli se!** Doporučil jsi někdy kamarádovi film nebo písničku, protože jsi věděl, že se mu bude líbit? Jak jsi to věděl? Dělal jsi kolaborativní filtrování ve své hlavě!

> **Věděl/a jsi?** Netflix Prize (2009) nabídl 1 milion dolarů tomu, kdo vylepší jejich doporučovací algoritmus o 10 %. Soutěžilo přes 40 000 týmů ze 186 zemí!
