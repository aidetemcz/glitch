---
id: vc36-bezpecnost
topic: coJeVibecoding
title: Bezpečnost a limity vibecoding
teaser: AI generuje kód rychle, ale ne vždy bezpečně. Na co si dát pozor?
hook: Je vibecoding bezpečný?
---

AI-generovaný kód může obsahovat bezpečnostní díry, které neodhalíš, pokud kódu nerozumíš. To je největší riziko vibecoding: stavíš něco, co neumíš zkontrolovat. Pro osobní projekt (sledovač filmů, hra pro kamarády) to nevadí. Pro cokoli, kde jsou v hře peníze nebo osobní data jiných lidí, je to problém.

Nejčastější chyba: **API klíče ve frontendovém kódu.** Když v Lovable nebo Boltu připojíš API klíč (třeba pro OpenAI), může být viditelný v kódu, který prohlížeč stahuje. Kdokoli si ho přečte a použije na tvůj účet. Pravidlo: nikdy nedávej tajné klíče do frontendu.

Co s vibecoding **nikdy nedělej:** nezpracovávej skutečné platby bez bezpečnostního auditu, neukládej citlivá osobní data (rodná čísla, zdravotní záznamy) a nepouštěj takovou aplikaci pro veřejnost bez kontroly někým, kdo kódu rozumí.

? Jaké je největší bezpečnostní riziko vibecoding?
- AI generuje pomalý kód
- Aplikace nefungují na mobilech
* Kód může obsahovat zranitelnosti, které laik neodhalí
- Vibecoding nástroje kradou tvoje nápady
! Správně! Když nerozumíš kódu, nemůžeš ověřit, jestli je bezpečný. Pro osobní projekty to nevadí, pro veřejné aplikace s daty uživatelů je to riziko.

+++

**API klíče -- detailně:**

API klíč je jako heslo k placené službě. Když ho dáš do frontendového kódu (kód, který běží v prohlížeči návštěvníka), je to jako napsat heslo na tabuli ve třídě. V prohlížeči si kdokoli může zobrazit zdrojový kód (pravé tlačítko myši, "Zobrazit zdrojový kód") a klíč najít. Pak ho může použít na tvůj účet -- a ty platíš. Řešení: API klíče patří na backend (server), ne do frontendu. V Macaly to řeší vestavěný backend. V Lovable a Boltu musíš být opatrný.

**Technický dluh:**

Technický dluh je koncept z profesionálního vývoje. Znamená: "udělal jsem to rychle, ale ne dobře, a jednou to budu muset předělat." Vibecoding generuje hodně technického dluhu -- AI píše kód, který funguje, ale nemusí být optimální, čistý nebo dobře strukturovaný. U prototypu to nevadí. Pokud se ale z prototypu stane produkt pro tisíce lidí, budeš muset většinu kódu přepsat od nuly. To je normální -- ale je dobré to vědět předem.

**Co AI-generovaný kód typicky dělá špatně:**

- **SQL injection:** AI může generovat databázové dotazy, které útočník zneužije k přečtení nebo smazání dat. Profesionální vývojáři proti tomu používají parametrizované dotazy -- AI to někdy udělá, někdy ne.
- **XSS (Cross-Site Scripting):** Útočník vloží škodlivý kód do formuláře na tvém webu, a ten se spustí u jiných návštěvníků. AI nemusí vstupy správně ošetřit.
- **Chybějící autentizace:** AI může vytvořit stránku pro administraci bez hesla -- kdokoli, kdo zná URL, ji otevře.

**Pravidla pro bezpečnější vibecoding:**

1. Osobní projekty jen pro sebe -- vibecoding v pohodě, žádné extra riziko.
2. Projekty pro kamarády/třídu -- vibecoding OK, ale neukládej citlivá data.
3. Veřejné projekty -- před spuštěním nech kód zkontrolovat někým, kdo rozumí bezpečnosti.
4. Projekty s penězi nebo osobními daty -- nepouštěj bez profesionálního auditu.
5. API klíče nikdy do frontendu. Pokud nevíš, jestli je to frontend nebo backend, zeptej se AI: "Je tento klíč viditelný v prohlížeči uživatele?"
