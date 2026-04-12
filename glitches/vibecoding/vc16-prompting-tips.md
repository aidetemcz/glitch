---
id: vc16-prompting-tips
topic: praxe
title: Jak psát dobré prompty
teaser: Špatný prompt = frustrující výsledek. Dobrý prompt = magie.
hook: Jak psát správně?
flashQ: Jaký je rozdíl mezi dobrým a špatným promptem pro vibecoding?
flashA: Dobrý prompt je konkrétní a popisuje přesné funkce a datová pole (např. „sledovač knih: název, autor, hodnocení 1-5"). Špatný prompt je vágní (např. „udělej cool aplikaci").
---

Buď konkrétní a popisuj výsledek, ne proces: „Aplikace kde zadám cvičení — název, počet opakování, váha — uložím do databáze a vidím historii posledních 7 dní" je dobrý prompt. „Udělej fitness aplikaci" je špatný.

Přidávej jednu věc najednou a chyby popisuj přesně: „Když kliknu na Uložit, nic se nestane a v konzoli vidím chybu XYZ" je perfektní. „Nefunguje to" je k ničemu.

? Jaký prompt bude mít nejlepší výsledek?
- „Udělej cool aplikaci" | Příliš vágní — AI neví, co „cool" znamená, a výsledek bude náhodný.
- „Potřebuju pomoc s projektem" | Chybí jakékoli detaily — AI nemá z čeho vycházet.
* „Aplikace pro sledování knih: název, autor, hodnocení 1–5, přečteno ano/ne. Seznam seřazený podle hodnocení." | Výborně! Konkrétní popis s přesnými datovými poli dá AI jasné zadání.
- „Zkopíruj něco podobného jako Goodreads" | Kopírování velké aplikace je příliš složité a neurčité — AI neví, které části chceš.
! Správně! Konkrétní popis s přesnými funkcemi a datovými poli dá AI přesně to, co potřebuje k dobrému výsledku.

+++
Promptování je nová dovednost, která vznikla s LLM, a začíná být seriózně vyučována. Stanford, MIT a desítky dalších univerzit nabízejí kurzy „prompt engineering." Výzkumy ukázaly, že způsob formulace promptu může změnit výsledek o 30–40 % — stejná otázka položená jinak dostane jiné a mnohdy lepší odpovědi. Je to méně o magii a více o tom, jak AI modely fungují a co jim pomáhá.

Pravidlo „jeden krok najednou" je důležité i pro správu kontextového okna. Pokud pošleš dlouhý prompt s 10 požadavky najednou, AI přirozeně upřednostní některé a jiné přehlédne. Je to jako zadávat úkoly zahlcenému kolegovi — lepší je jeden jasný úkol, potvrzení výsledku, pak další. Tato disciplína ti ušetří spoustu frustrací z neúplných nebo smíšených výsledků.

Chain-of-thought prompting (řetězové myšlení) je pokročilá technika — místo abys AI řekl „dej mi výsledek," řekneš „přemýšlej krok za krokem a pak mi dej výsledek." Výzkumy ukázaly, že tento přístup zvyšuje přesnost AI u složitých problémů o 20–40 %. Pro vibecoding to znamená: místo „přidej funkci pro export do PDF" zkus „přemysli, jak by fungoval export do PDF v mé aplikaci, a pak ho implementuj krok za krokem." Výsledky bývají výrazně lepší.
