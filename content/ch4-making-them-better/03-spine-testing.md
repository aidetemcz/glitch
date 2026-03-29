---
id: ch4-testing
type: spine
title: "Testování, testování, 1-2-3"
readingTime: 3
standalone: true
core: true
teaser: "Jak zjistíš, jestli doporučovací systém skutečně funguje? Vědou!"
voice: universal
parent: null
diagram: diagram-eval-stack
recallQ: "Co je A/B test?"
recallA: "Ukáž verzi A polovině uživatelů, verzi B druhé polovině, porovnej jejich skutečné chování. Rozhodují data, ne hádání."
status: accepted
---

Postavil/a jsi doporučovací systém. MYSLÍŠ, že je dobrý. Ale jak to vlastně VÍŠ?

Nemůžeš se jen zeptat mámy. „Jó, zlatíčko, tvůj algoritmus je parádní." Díky, mami. Ale to nepomůže.

Potřebuješ **vědu**. Konkrétně potřebuješ **A/B test**.

**Takhle to funguje:**

Představ si, že pracuješ pro Spotify a máš dva nápady na doporučování písniček:
- **Verze A:** Doporučuj nejpopulárnější písničky v každém žánru
- **Verze B:** Doporučuj písničky na základě jedinečné poslechové historie každého člověka

Která je lepší? MOHL bys hádat. Ale hádáním skončíš tak, že doporučuješ country metalistům.

Místo toho rozdělíš uživatele do dvou skupin — náhodně, jako bys hodil/a mincí za každého člověka:
- **Skupina A** (50 % uživatelů) vidí verzi A
- **Skupina B** (50 % uživatelů) vidí verzi B

Nikdo neví, ve které skupině je. Používají Spotify normálně. Ale za kulisami měříš VŠECHNO:

- Kolik písniček poslouchají?
- Přeskakují písničky, nebo je poslouchají do konce?
- Přidávají si písničky do playlistů?
- Vrátí se do aplikace zítra?
- Objevují nové umělce?

Po týdnu nebo dvou srovnáš čísla. Možná zjistíš:
- Skupina B poslouchala **o 40 % více písniček**
- Skupina B objevila **3× více nových umělců**
- Skupina B se vracela do aplikace **každý den**, zatímco skupina A některé dny vynechala

Vítěz je verze B! Teď ji nasadíš pro všechny.

**Takhle každá velká aplikace zlepšuje svůj systém.** Netflix, YouTube, TikTok, Amazon — všichni NEUSTÁLE provádějí A/B testy. V každém okamžiku Netflix provádí stovky experimentů. Barva tlačítka, velikost náhledu, doporučovací algoritmus — vše se testuje.

**Proč jsou A/B testy tak mocné:**

Vyhazují hádání z rozhodování. Místo hádání, co je „lepší", necháš miliony skutečných uživatelů, aby ti svým chováním ukázali. Je to jako vědecký experiment s největším vzorkem, jaký kdy existoval.

**Záludná část:** Někdy verze A získá víc kliků, ale verze B dělá lidi šťastnějšími dlouhodobě. Krátkodobá čísla nevyprávějí vždy celý příběh. Nejlepší týmy měří to, na čem opravdu záleží — ne jen to, co se snadno spočítá.

**Zamysli se!** Kdybys mohl provést A/B test ve své škole, co bys testoval? Dva různé způsoby výuky matematiky? Dva různé obědy? Co bys měřil, abys zjistil, kdo vyhrál?
