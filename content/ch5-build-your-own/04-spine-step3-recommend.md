---
id: ch5-recommend
type: spine
title: "Krok 3: Vytvoř předpovědi"
readingTime: 3
standalone: true
core: true
teaser: "Použij podobné uživatele k předpovídání hodnocení a vytvoř skutečná doporučení."
voice: universal
parent: null
diagram: null
recallQ: "Jak předpovíš hodnocení neviděné položky?"
recallA: "Najdi 2–3 nejpodobnější uživatele, kteří ji hodnotili → zprůměruj jejich hodnocení. Nad 4 hvězdičky = doporuč ji."
status: accepted
---

Máš svou hodnotící matici. Víš, kdo je komu podobný. Teď přichází ten velký okamžik: **předpovídáme hodnocení a vytváříme doporučení.**

**Metoda:**

Pro každou prázdnou buňku v matici (film, který někdo neviděl) udělej toto:

1. Najdi 2–3 nejpodobnější lidi, kteří ten film HODNOTILI
2. Podívej se na jejich hodnocení
3. Vypočítej průměr
4. Tento průměr je tvé **předpovězené hodnocení**

**Příklad:**

Sam neviděl Film Super Mario Bros. Kdo jsou Samovi nejpodobnější uživatelé?

Z kroku 2 víme:
- Alex je Samovi velmi podobný (skóre podobnosti: vysoké)
- Maya je Samovi poněkud podobná (skóre podobnosti: střední)

Alex ohodnotil Maria: **3 hvězdičky**
Maya ohodnotila Maria: **4 hvězdičky**

Předpovězené hodnocení pro Sama = (3 + 4) / 2 = **3,5 hvězdičky**

Není špatné! Předpověď říká: „bude to pro něj asi ujde, ale ne žhavý hit."

**Vytvoření doporučení:**

Teď to udělej pro KAŽDÝ film, který Sam neviděl. Možná dostaneš:

| Film, který Sam neviděl | Předpovězené hodnocení |
|---|---|
| Film Super Mario Bros. | 3,5 |
| Naruby 2 | 4,5 |
| Duna | 2,0 |
| Kung Fu Panda 4 | 4,0 |

**Tvoje pravidlo doporučení:** Cokoli s předpovězením **4 hvězdičky nebo výše** dostane doporučení!

Takže Samovi doporučíš:
1. Naruby 2 (předpovězeno: 4,5)
2. Kung Fu Panda 4 (předpovězeno: 4,0)

A přeskočíš Dunu (předpovězeno: 2,0) a Maria (předpovězeno: 3,5).

**Teď to otestuj!**

To je nejdůležitější část. Jdi zpátky k Samovi (nebo komukoli, pro koho jsi předpovídal) a zeptej se: „Viděl jsi Naruby 2? Co sis o tom myslel?"

Pokud Sam řekne „Miloval jsem to!" – tvůj systém fungoval!
Pokud Sam řekne „Ehm, bylo to nudné" – tvůj systém potřebuje zlepšení.

**Veď skóre:**

| Osoba | Předpovězený film | Předpovězené hodnocení | Skutečné hodnocení | Blízko? |
|---|---|---|---|---|
| Sam | Naruby 2 | 4,5 | ? | |
| Sam | Kung Fu Panda 4 | 4,0 | ? | |

Pokud jsou tvé předpovězené hodnocení většinou do 1 hvězdičky od těch skutečných, postavil/a jsi opravdu užitečný doporučovací systém. Gratulujeme — jsi oficiálně inženýr/inženýrka doporučení!

**Zamysli se!** Jak přesné byly tvoje předpovědi? Pokud byly některé hodně mimo, co si myslíš, že se pokazilo? Možná jsi potřeboval/a víc dat, nebo jsou tito lidé prostě nepředvídatelní. To je naprosto normální — ani Netflix to nedostane vždy správně.
