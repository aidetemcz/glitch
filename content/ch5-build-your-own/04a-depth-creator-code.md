---
id: ch5-code-d-create
type: spine
title: "Nakóduj to!"
readingTime: 4
standalone: false
teaser: "Jednoduchý Python skript, který dělá vše, co ses naučil – ve 20 řádcích."
voice: creator
parent: null
diagram: null
recallQ: "Kolik řádků Pythonu stačí na základní kolaborativní filtrování?"
recallA: "Asi 20! Načítání dat, výpočet podobnosti a předpověď – stejná logika, jakou používá Netflix, jen v menším měřítku."
status: accepted
---

Připravený/á převést svůj doporučovací systém do skutečného kódu? Tady je Python skript, který dělá vše z kroků 1–3. Každý řádek má komentář, který vysvětluje, co dělá.

**Budeš potřebovat:**
- Python nainstalovaný na počítači (zdarma na python.org)
- Svá hodnocení uložená jako CSV soubor

**Nejprve ulož svá data jako `ratings.csv`:**

```text
Name,Frozen,Spider-Verse,Moana,Mario,Encanto
Alex,5,4,5,3,4
Sam,5,3,5,,5
Jordan,2,5,3,5,
Maya,4,,4,4,3
Leo,,5,,5,2
```

(Prázdné buňky = filmy, které neviděli)

**Kód (ulož jako `recommend.py`):**

```python
import csv                           # čte CSV soubory

ratings = {}                         # prázdný slovník pro všechna hodnocení
with open('ratings.csv') as f:       # otevři datový soubor
    reader = csv.DictReader(f)       # přečti ho jako tabulku se záhlavími
    for row in reader:               # projdi každou osobu
        name = row['Name']           # získej její jméno
        ratings[name] = {}           # začni seznam hodnocení
        for movie, score in row.items():  # projdi každý film
            if movie != 'Name' and score: # přeskoč sloupec jména a prázdné buňky
                ratings[name][movie] = int(score)  # ulož jako číslo

def similarity(person1, person2):
    shared = []                      # filmy, které oba hodnotili
    for movie in ratings[person1]:   # zkontroluj filmy person1
        if movie in ratings[person2]:  # hodnotil person2 také?
            diff = abs(ratings[person1][movie] - ratings[person2][movie])
            shared.append(diff)      # ulož rozdíl
    if not shared:                   # žádné společné filmy?
        return 99                    # vůbec nepodobní
    return sum(shared) / len(shared) # průměrný rozdíl (nižší = podobnější)

def predict(person, movie):
    scores = []                      # sbírej hodnocení od podobných lidí
    for other in ratings:            # zkontroluj každou jinou osobu
        if other == person:          # přeskoč sebe sama
            continue
        if movie in ratings[other]:  # hodnotili tento film?
            sim = similarity(person, other)  # jak jsou podobní?
            if sim < 2:              # použij jen podobné lidi
                scores.append(ratings[other][movie])
    if scores:                       # pokud jsme našli podobné lidi
        return round(sum(scores) / len(scores), 1)  # vrať průměr
    return None                      # nedostatek dat pro předpověď

person = 'Sam'                       # pro koho doporučovat
print(f'Doporučení pro {person}:')
all_movies = set()                   # najdi každý film v datech
for p in ratings:
    all_movies.update(ratings[p].keys())
for movie in sorted(all_movies):     # zkontroluj každý film
    if movie not in ratings[person]: # předpovídej jen neviděné filmy
        pred = predict(person, movie)
        if pred and pred >= 4:       # doporuč jen 4+ hvězdičky
            print(f'  {movie}: předpovězeno {pred} hvězdiček')
```

**Spusť:** Otevři terminál a napiš `python recommend.py`

Měl bys vidět výstup jako:
```text
Doporučení pro Sam:
  Encanto: předpovězeno 4.0 hvězdiček
```

**Zkus změnit věci:**
- Změň `person = 'Sam'` na jiné jméno ze svých dat
- Změň `if sim < 2` na `if sim < 1` (přísnější podobnost)
- Změň `if pred and pred >= 4` na `>= 3` (více doporučení)

**Ještě na Python nemáš?** Podívej se na Scratch (scratch.mit.edu)! Jednodušší verzi postavíš pomocí seznamů a smyček. Logika je stejná — porovnáváš čísla a hledáš průměry. Scratch to dělá vizuální a zábavné.

**Výzva:** Přidej do CSV víc lidí a filmů. Zlepšuje se systém s víc daty? (Spoiler: jo, většinou ano!)
