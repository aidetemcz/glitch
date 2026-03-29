---
id: ch3-speed
type: spine
title: "Čísla, která ti vezmou dech!"
readingTime: 1
standalone: true
teaser: "800 milionů videí. 0,2 sekundy. Čísla za YouTube doporučeními jsou naprosto šílená."
voice: thinker
parent: null
diagram: null
recallQ: "Jak dlouho by trvalo člověku udělat to, co YouTube zvládne za 1 sekundu?"
recallA: "25 LET! Proto potřebujeme algoritmy — takové měřítko je pro lidi nemyslitelné."
status: accepted
---

Pojďme si říct, jak ŠÍLENĚ velká čísla stojí za skutečným doporučovacím systémem. Jako příklad použijeme YouTube.

## Výchozí situace

YouTube má přibližně **800 milionů videí**. Když otevřeš aplikaci, doporučovací systém musí:

1. Projít VŠECH 800 milionů videí
2. Vybrat nejlepších ~500 kandidátů PŘÍMO PRO TEBE
3. Seřadit těch 500 podle toho, jak pravděpodobné je, že každé z nich budeš sledovat
4. Odebrat videa, která jsi už viděl
5. Přimíchat trochu rozmanitosti, aby ses nenudil
6. Seřadit vše do přehledného feedu

**Celková povolená doba:** méně než **200 milisekund**. To je 0,2 sekundy. Rychleji, než mrkneš. (Mrknutí trvá přibližně 300–400 milisekund. Vážně.)

## Dáme to do perspektivy

Za dobu, kterou ti trvalo přečíst tuto větu, YouTube mohl vygenerovat personalizovaná doporučení pro přibližně **10 000 různých lidí**. Všechna jedinečná. Všechna přizpůsobená.

Kdyby lidský knihovník dělal to, co YouTube dělá pro JEDNOHO člověka — listoval 800 miliony videí a vybíral nejlepších 20 — a mohl by zkontrolovat jedno video za sekundu bez přestávky, trvalo by mu to **25 LET**.

YouTube to zvládne dřív, než stihneš mrknout.

## Jak je to možné?

Pipeline! Pamatuješ na tři fáze? Systém se ve skutečnosti pečlivě nedívá na všech 800 milionů videí. Nejprve používá rychlé, hrubé filtry (Fáze 1: vyhledávání), které seznam zúží z milionů na tisíce. Pak chytřejší, pomalejší metody (Fáze 2: skórování) prozkoumají ty tisíce. A nakonec nejchytřejší — a nejpomalejší — logika (Fáze 3: přeřazení) musí zpracovat jen pár stovek.

Je to jako hledat jehlu v kupce sena tím, že se nejdřív zbavíš 99 % sena.

## Ještě jedno číslo

YouTube denně poskytne přes **1 miliardu hodin** doporučeného videa. Miliarda hodin. To je více než 100 000 let videa — servírováno čerstvé každých 24 hodin. Většinu z toho vybral algoritmus, ne lidé při vyhledávání.

Příště, až ti aplikace chvíli trvá načíst doporučení, nezlob se. Divuj se, že to vůbec funguje.
