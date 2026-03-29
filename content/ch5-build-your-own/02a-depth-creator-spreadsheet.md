---
id: ch5-spread-d-create
type: spine
title: "Postav to v tabulce"
readingTime: 3
standalone: false
teaser: "Instrukce pro Google Sheets – vytvoř svou vlastní hodnotící matici."
voice: creator
parent: null
diagram: null
recallQ: "Proč ti tabulkový procesor pomůže postavit doporučení?"
recallA: "Barevně označená hodnocení odhalují vzorce vkusu vizuálně – vidíš, kdo si odpovídá, ještě než uděláš jakoukoli matematiku."
status: accepted
---

Papír je skvělý pro začátek, ale pokud chceš jít dál — více lidí, více filmů — tabulkový procesor (spreadsheet) je tvůj nejlepší přítel. Tady je přesně, jak ho nastavit v Google Sheets (nebo Excelu, nebo jakékoli jiné tabulkové aplikaci).

**Krok 1: Vytvoř tabulku**

Otevři Google Sheets (sheets.google.com) a začni novou prázdnou tabulku. Pojmenuj ji „Můj doporučovací systém."

**Krok 2: Nastav sloupce**

- Buňka A1: napiš „Jméno"
- Buňka B1: napiš název prvního filmu (například „Frozen")
- Buňka C1: název druhého filmu
- Pokračuj přes první řádek pro všech 10 filmů

**Krok 3: Přidej lidi**

- Buňka A2: jméno první osoby (například „Alex")
- Buňka A3: jméno druhé osoby
- Pokračuj dolů pro všechny své průzkumové odpovědi

**Krok 4: Vyplň hodnocení**

Pro každou osobu zadej jejich hodnocení (1–5) do odpovídající buňky. Pokud film neviděli, **nech buňku prázdnou**. Nedávej tam 0 – to by znamenalo něco jiného. Prázdná buňka znamená „neznámé."

Tvá tabulka by měla vypadat nějak takto:

| Jméno | Frozen | Spider-Verse | Moana | Mario | Encanto |
|---|---|---|---|---|---|
| Alex | 5 | 4 | 5 | 3 | 4 |
| Sam | 5 | 3 | 5 | | 5 |
| Jordan | 2 | 5 | 3 | 5 | |
| Maya | 4 | | 4 | 4 | 3 |

**Krok 5: Udělej to vizuální**

Tady je zábavný trik: vyber všechny buňky s hodnoceními a použij **podmíněné formátování** (Formát > Podmíněné formátování) pro barevné označení:
- 5 hvězdiček: tmavě zelená
- 4 hvězdičky: světle zelená
- 3 hvězdičky: žlutá
- 2 hvězdičky: oranžová
- 1 hvězdička: červená

Teď doslova VIDÍŠ vzorce. Řádky s podobnými barvami = lidé s podobným vkusem!

**Profi tip:** Přidej na konec řádek, který vypočítá **průměrné hodnocení** pro každý film pomocí `=AVERAGE(B2:B11)`. Tím zjistíš, které filmy jsou obecně oblíbené a které polarizují.

Tato tabulka JE tvá hodnotící matice. Je to přesně to, co používají Netflix a Spotify — jen mnohem, mnohem větší. Matice Netflixu má přes 200 milionů řádků (uživatelů) a desítky tisíc sloupců (filmů). Tvoje je miniverze téhož.
