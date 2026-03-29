---
id: ch5-formulas
type: spine
title: "Matematika za doporučováním"
readingTime: 4
standalone: false
teaser: "Kosinová podobnost, maticová faktorizace a nDCG — vzorce, které pohánějí každý doporučovač, vysvětlené tak, aby je pochopil i dvanáctiletý."
voice: thinker
parent: null
diagram: null
core: false
recallQ: "Co vlastně měří kosinová podobnost?"
recallA: "Úhel mezi dvěma vektory preferencí. Pokud dva lidé hodnotí věci ve stejném vzoru (i v různém měřítku), úhel je malý a podobnost vysoká."
status: accepted
---

Neboj se — tyto vzorce si nemusíš pamatovat nazpaměť. Cílem je **rozpoznat** je, když je uvidíš, pochopit, co měří, a vědět, proč jsou důležité. Představ si to jako čtení receptu: nemusíš hned vařit, ale měl/a bys rozumět, o jaké jídlo jde.

## 1. Kosinová podobnost — „Ukazujeme stejným směrem?"

$$\text{sim}(A, B) = \frac{A \cdot B}{\|A\| \times \|B\|}$$

**Co to znamená lidsky:**

- **A** a **B** jsou hodnocení dvou lidí, zapsaná jako seznamy čísel (vektory)
- **A · B** (skalární součin) = vynásob každý pár hodnocení a sečti je
- **||A||** = „délka" vektoru A (jak daleko šipka sahá)
- Výsledek je číslo mezi **-1** a **1**

**Příklad:** Alex hodnotí [5, 4, 5] a Sam hodnotí [4, 3, 4].

- A · B = 5×4 + 4×3 + 5×4 = 20 + 12 + 20 = **52**
- ||A|| = √(25 + 16 + 25) = √66 ≈ **8,12**
- ||B|| = √(16 + 9 + 16) = √41 ≈ **6,40**
- sim = 52 / (8,12 × 6,40) = 52 / 51,97 ≈ **1,00** (skoro dokonalá shoda!)

**Proč na tom záleží:** Sam hodnotí vše o trochu níž, ale ve STEJNÉM vzoru. Kosinová podobnost to zachytí — měří směr, ne výšku čísel.

## 2. Maticová faktorizace a ALS — „Najdi skryté důvody"

Celý příběh o maticové faktorizaci — jak rozkládá obrovskou matici hodnocení na skryté dimenze vkusu, jak se algoritmus ALS tyto dimenze učí a proč vyhrál cenu Netflixu — najdeš v samostatné sekci ve 3. kapitole.

## 3. nDCG — „Jak dobré je tohle seřazení?"

$$\text{DCG} = \sum_{i=1}^{k} \frac{\text{relevance}_i}{\log_2(i + 1)}$$

$$\text{nDCG} = \frac{\text{DCG}}{\text{ideální DCG}}$$

**Co to znamená:**

- Máš seznam doporučených položek, seřazených od #1 do #k
- Každá položka má **skóre relevance** (jak dobrá je pro uživatele — např. 0, 1, 2 nebo 3)
- Položky výše v seznamu dostávají **bonus** (dělení logaritmem dělá pozici 1 mnohem cennější než pozici 10)
- **nDCG** normalizuje skóre na rozmezí 0 až 1 porovnáním s **dokonalým** seřazením

**Příklad:** Systém doporučí [Skvělé, OK, Špatné, Skvělé] v tomto pořadí.

- DCG = 3/log₂(2) + 1/log₂(3) + 0/log₂(4) + 3/log₂(5) = 3 + 0,63 + 0 + 1,29 = **4,92**
- Dokonalé pořadí by bylo [Skvělé, Skvělé, OK, Špatné] = 3 + 1,89 + 0,5 + 0 = **5,39**
- nDCG = 4,92 / 5,39 = **0,91** (docela dobré!)

**Proč na tom záleží:** nDCG odpovídá na otázku, kterou si klade každý doporučovací tým: „Jak blízko je naše pořadí k dokonalému?" Skóre 1,0 znamená dokonalé. Většina skutečných systémů dosahuje 0,3–0,7, protože problém je fakt těžký.

## Shrnutí

| Vzorec | Co dělá | Kde se používá |
|--------|---------|----------------|
| Kosinová podobnost | Najde podobné uživatele/položky | Kolaborativní filtrování |
| Maticová faktorizace | Objeví skryté preference | Trénování doporučovacích modelů (viz kap. 3) |
| nDCG | Měří kvalitu seřazení | Vyhodnocování, jestli systém funguje |

Tyto tři vzorce tvoří základ. Skutečné systémy přidávají mnoho dalších — ale kdo rozumí těmto třem, rozumí jádru matematiky doporučovacích systémů.
