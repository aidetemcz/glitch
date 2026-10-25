# Digitální základy — návrh rozdělení výstupů garanta do konceptů

Garantův dokument obsahuje 65 výstupů ve 4 kapitolách, bez konceptů, učiva a vazeb. Tahle tabulka je návrh redakce, jak výstupy rozdělit do bublin mapy — **ke schválení garantem**. Každý výstup je právě v jednom konceptu jako kritérium (doslovně). Názvy bublin, učivo, cíle i prerekvizity jsou návrh; v mapě mají stav *draft*.

Číslování: O = Ovládání počítače, Z = Principy zařízení (Z0 = nečíslovaný výstup o úložištích), I = Principy internetu, B = Bezpečnost.

## Soubory a ovládání počítače

*Jak poznat typ souboru, ovládat aplikace a udržet si v datech pořádek i zálohu.*

| Koncept | Vrstva | Výstupy garanta | Prerekvizity (návrh) | Stávající bublina |
|---|---|---|---|---|
| **Soubory a jejich typy** | core | O1, O2, O6 | — | nová |
| **Ovládání aplikací** | core | O3, O4, O5 | Soubory a jejich typy | nová |
| **Organizace a zálohování dat** | core | O7, O8, O9 | Soubory a jejich typy | nová |

## Zařízení a úložiště

*Co je uvnitř počítače a mobilu, kam se ukládají data a proč se zařízení někdy zasekne.*

| Koncept | Vrstva | Výstupy garanta | Prerekvizity (návrh) | Stávající bublina |
|---|---|---|---|---|
| **Hardware a software** | core | Z11 | — | ano |
| **Úložiště dat: lokálně a v cloudu** | core | Z0, Z1, Z2 | Hardware a software | nová |
| **Reprezentace a velikost dat** | navazujici | Z4, Z5 | Data a informace | ano |
| **Operační systém a aplikace** | core | Z3, Z8, Z9 | Hardware a software | ano |
| **Propojení zařízení a periferie** | navazujici | Z6, Z7 | Hardware a software | nová |
| **Zaseknutý počítač a operační paměť** | navazujici | O10, Z10, Z12, Z13, Z14 | Hardware a software | nová |
| **Vrstvy počítače** | navazujici | — | Hardware a software | ano |

## Internet a sítě

*Jak putují data internetem, co je server, cloud a adresa a jak spolu zařízení mluví.*

| Koncept | Vrstva | Výstupy garanta | Prerekvizity (návrh) | Stávající bublina |
|---|---|---|---|---|
| **Internet, web a wifi** | core | I2, I3, I18 | — | ano |
| **Cesta dat internetem** | core | I4, I7, I8, I9, I10 | Internet, web a wifi | nová |
| **Cloud a server** | core | I1, I22 | Internet, web a wifi | ano |
| **Adresy a protokoly** | navazujici | I5 | Internet, web a wifi | ano |
| **Prohlížeč a vyhledávač** | navazujici | I6, I11 | Adresy a protokoly | nová |
| **Cloudové dokumenty a sdílení** | navazujici | I19, I20, I21 | Cloud a server | nová |
| **Kde jsou data fyzicky** | navazujici | I17, I26 | Cloud a server | ano |
| **API** | core | — | Cloud a server | ano |

## Zabezpečení zařízení

*Jak chránit vlastní zařízení před malwarem a jak si na něm pohlídat soukromí.*

| Koncept | Vrstva | Výstupy garanta | Prerekvizity (návrh) | Stávající bublina |
|---|---|---|---|---|
| **Malware, antivirus a aktualizace** | core | B3, B4, B5, B6, B7 | Operační systém a aplikace | nová |
| **Soukromí na zařízení** | core | B10, B11, B12 | Operační systém a aplikace | nová |
| **Chytrá zařízení a jejich rizika** | navazujici | I23, I24, I25, B13 | Internet, web a wifi, Hardware a software | nová |

## Bez podoblasti

| Koncept | Poznámka |
|---|---|
| **Data a informace** | V garantově dokumentu není; zůstává, protože na něj navazuje téma Data. Garant rozhodne, kam patří. |

## Výstupy zařazené do jiných témat

Tyhle výstupy už mají bublinu v Kyberbezpečnosti, Digitálním občanství nebo Umělé inteligenci. Jsou tam doplněné jako kritéria, aby v mapě nevznikly dvě bubliny „hesla“ nebo „malware“.

| Výstup | Text (zkráceně) | Bublina |
|---|---|---|
| I12 | Popíše výhody a nevýhody cookies. | Digitální stopa a soukromí (digitalni-obcanstvi) |
| I13 | Uvede alespoň tři příklady personalizovaného obsahu webu (např. reklamy, videa, novinové z… | Jak fungují algoritmy sítí (digitalni-obcanstvi) |
| I14 | Popíše rozdíl mezi digitální stopou a digitální identitou. Diskutuje, čím vším svou digitá… | Soukromí a digitální stopa (kyberbezpecnost) |
| I15 | Popíše princip financování sociálních sítí pomocí reklamy. | Obchodní modely platforem (digitalni-obcanstvi) |
| I16 | Popíše, jaká osobní data uživatelů internetu mohou třetí osoby nebo instituce získat; a ja… | Soukromí a digitální stopa (kyberbezpecnost) |
| B1 | Rozpozná více a méně bezpečná hesla; sám si vytvoří bezpečné heslo. | Hesla a 2FA (kyberbezpecnost) |
| B2 | Vysvětlí rozdíl mezi účtem, heslem, autentifikací, šifrováním a kódováním. | Hesla a 2FA (kyberbezpecnost) |
| B8 | Diskutuje o různých módech bezpečného chování na internetu; sepíše pravidla pro bezpečné c… | Bezpečné chování na sítích (kyberbezpecnost) |
| B9 | Vytvoří myšlenkovou mapu prvků zabezpečení počítače a internetové komunikace (použije konc… | Základní hygiena (kyberbezpecnost) |
| B14 | Uvede alespoň tři příklady použití umělé inteligence a popíše možná rizika těchto použití. | AI a společnost (umela-inteligence) |

## Otázky pro garanta

1. Sedí rozdělení výstupů do bublin a názvy bublin? Které bubliny sloučit / rozdělit?
2. Prerekvizity a vazby „souvisí“ jsou návrh — dokument je neuvádí.
3. Výstupy I12–I17 (cookies, personalizace, digitální stopa, reklama, GDPR) a B1, B2, B8, B9, B14 jsou v jiných tématech — souhlas?
4. Kapitoly cituje RVP 2021 (I-9-4-01…05). V RVP 2024 odpovídají INF-INF-004-ZV9-011 a 012; I-9-4-02 (správa dat) a I-9-4-04 (závady) samostatný výstup nemají. Jaké je aktuální znění?
5. Bubliny API, Vrstvy počítače a Data a informace v dokumentu nejsou — nechat?
6. Které bubliny jsou jádrové (core)? Návrh: 12 core, 9 navazujících.
