---
id: vc33-lovable-bolt
topic: nastrojePro
title: Lovable a Bolt -- detailní srovnání
teaser: Dva nejpopulárnější vibecoding nástroje pod lupou. Co umí a kde selhávají?
hook: Který z nich vybrat?
---

**Lovable** (lovable.dev): napíšeš "Vytvoř aplikaci pro sledování tréninků s historií a grafy" -- a za minutu máš funkční prototyp s moderním designem. Obrovská výhoda: nejštědřejší free tier, velká komunita, skvělé výsledky na první pokus. Nevýhoda: slabé SEO, a pokud použiješ API klíče, pozor -- můžou být viditelné ve frontendovém kódu.

**Bolt** (bolt.new): otevřeš prohlížeč, napíšeš "Kalkulačka BMI s historií měření" -- a máš hotovo. Žádná instalace, žádný účet na začátek. Výhoda: můžeš si stáhnout celý kód jako ZIP. Nevýhoda: u projektů s víc než 5-6 obrazovkami začne ztrácet kontext a dělá chyby.

Oba nástroje jsou zdarma na vyzkoušení, ale mají limity na počet zpráv. Začni s jedním, zkus druhý -- zjistíš, co ti sedí víc.

? Jaká je hlavní výhoda Boltu oproti Lovable?
- Generuje hezčí design
- Má lepší AI model
* Funguje kompletně v prohlížeči bez jakékoli instalace
- Je úplně zdarma bez omezení
! Přesně! Bolt běží celý v prohlížeči díky technologii WebContainers -- žádná instalace, žádné nastavení.

+++

**Lovable -- hlubší pohled:**

Lovable (původně GPT Engineer, Stockholm) používá React a Tailwind CSS. Design výsledných aplikací vypadá moderně a profesionálně hned od začátku. Integrace se Supabase umožňuje přidat databázi, přihlašování uživatelů a real-time funkce.

Příklad promptu pro Lovable: "Vytvoř webovou aplikaci pro správu receptů. Uživatel může přidávat recepty s názvem, ingrediencemi a postupem. Recepty se zobrazují jako karty s možností filtrování podle kategorie (snídaně, oběd, večeře)."

Reálné limity Lovable: aplikace generované v Lovable jsou SPA (Single Page Application) -- celá stránka se načte najednou jako JavaScript. Pro Google vyhledávač je to problém, protože ten preferuje HTML obsah. Pokud stavíš nástroj jen pro sebe, je to jedno. Pokud stavíš firemní web nebo blog, který má lidi nacházet přes Google, potřebuješ jiný nástroj (Macaly s Next.js, nebo klasický web).

Bezpečnostní upozornění: když v Lovable připojíš API klíč (třeba pro OpenAI), tento klíč může být viditelný v kódu, který prohlížeč stáhne. To znamená, že kdokoli si může tvůj klíč přečíst a použít na tvůj účet. U osobních projektů menší riziko, u veřejných aplikací velký problém.

**Bolt -- hlubší pohled:**

Bolt od firmy StackBlitz je technicky unikátní. Používá WebContainers -- technologii, která spouští Node.js přímo v prohlížeči. To dřív nebylo možné. Díky tomu zvládá i backend (serverovou logiku), nejen frontend (to, co vidíš).

Příklad promptu pro Bolt: "Vytvoř aplikaci pro poznámky s možností řazení podle data a kategorie. Přidej tmavý režim a export poznámek jako textový soubor."

Reálný limit Boltu: kontextové okno. Bolt si "pamatuje" určité množství kódu a konverzace. U jednoduchého projektu (3-4 obrazovky) funguje skvěle. U složitějšího projektu (10+ obrazovek, databáze, přihlašování) začne zapomínat předchozí rozhodnutí a může přepsat kód, který už fungoval. Řešení: začni novou konverzaci pro každý větší modul a na začátku shrň, co už máš.

Velká výhoda Boltu: export jako ZIP. Celý kód si stáhneš a máš ho u sebe. Pokud Bolt zítra zdraží nebo zmizí, tvůj projekt přežije. Doporučení: po každém velkém milníku si kód stáhni.
