---
id: ch3-pipeline
type: spine
title: "Doporučovací pipeline"
readingTime: 3
standalone: true
core: true
teaser: "Skutečné systémy nepoužívají jen jednu metodu. Používají VŠECHNY, ve třech chytrých krocích."
voice: universal
parent: null
diagram: kids-pipeline
recallQ: "Jaké jsou 3 fáze doporučovacího pipeline?"
recallA: "NAJDI kandidáty (rychle + hrubě), SEŘAĎ je (přesné skórování), ZKONTROLUJ rozmanitost."
status: accepted
---

Tady je něco důležitého: skutečné doporučovací systémy si nevyberou jednu metodu. Neříkají „jsme firma na kolaborativní filtrování" nebo „děláme jen filtrování podle obsahu."

Používají **všechno**. Všechny metody. Dohromady. Ve specifickém pořadí.

Tomu se říká **doporučovací pipeline** a každá velká platforma jej využívá. Představ si ho jako kuchaře, který připravuje jídlo ve třech krocích.

## Krok 1: NAJDI (Sežeň ingredience)

Nejprve systém hodí širokou síť. Z milionů možných položek rychle popadne pár stovek těch, které by pro tebe MOHLY být relevantní.

Používá k tomu rychlé, jednoduché metody:
- Kolaborativní filtrování: „Uživatelé jako ty sledovali tyto"
- Filtrování podle obsahu: „Toto je podobné tomu, co jsi právě sledoval"
- Popularita: „Toto je teď trending"
- Sociální: „Toto se líbilo tvým přátelům"

Cílem není dokonalost. Jde o rychlost. Systém potřebuje zúžit miliony položek na přibližně 500 kandidátů za milisekundy.

Je to jako kuchař, který sbírá ingredience ze spíže. Ber vše, co by mohlo fungovat. O receptu zatím nepřemýšlej.

## Krok 2: SEŘAĎ (Uvař jídlo)

Teď systém vezme těch 500 kandidátů a pečlivě každého ohodnotí. Tady se odehrává ta náročná matematika.

Pro každého kandidáta se ptá:
- Jak pravděpodobné je, že na to klikneš? (60 %? 20 %? 2 %?)
- Jak pravděpodobné je, že to dokoukáš/dočteš do konce?
- Jak pravděpodobné je, že to budeš mít rád nebo to nasdílíš?
- Jak moc to odpovídá tvé aktuální náladě?

Každá položka dostane skóre. Systém je seřadí od nejvyššího po nejnižší.

To je samotné vaření. Kuchař vezme ingredience a z nich udělá něco lahodného, pečlivě upravuje recept.

## Krok 3: ZKONTROLUJ (Pěkně to naservíruj)

Nejlépe ohodnocené položky se na tvoji obrazovku jen tak nevysypou. Systém ještě provede závěrečné kontroly:

- **Rozmanitost**: Neukazuj 10 Minecraft videí za sebou. Promíchej to! Třeba 3 Minecraft, 2 hudební, 2 vědecké, 2 komediální, 1 překvapení.
- **Čerstvost**: Zahrň nový obsah, nejen staré oblíbené.
- **Vhodnost**: Ujisti se, že vše odpovídá tvému věku a pravidlům platformy.
- **Žádné opakování**: Neukazuj něco, co jsi už sledoval.

To je servírování — ujistit se, že výsledné jídlo vypadá dobře a má pěknou vyváženost chutí.

## Výsledek

Po všech třech krocích vidíš na obrazovce asi 10–20 položek. Každá přežila tvrdou soutěž:

- Začínala jako jedna z milionů možností
- Dostala se do top 500 kandidátů
- Byla ohodnocena a seřazena
- Prošla závěrečnými kontrolami kvality

To vše se odehraje za **méně než jednu sekundu**. Pokaždé, když otevřeš aplikaci.

**Zamysli se!** Příště, až si obnovíš domovskou stránku na YouTube, vzpomeň si: v čase, který stránce trvalo načíst, systém vyhodnotil tisíce videí, ohodnotil je všechna, zkontroloval rozmanitost a vybral ty nejlepší přímo pro tebe. Za méně než sekundu. To je neuvěřitelné inženýrství.

> **Věděl/a jsi?** Amazon jednou odhadl, že 35 % jejich tržeb pochází z doporučení. To jsou stovky miliard dolarů — všechno z „Mohlo by se vám líbit..."
