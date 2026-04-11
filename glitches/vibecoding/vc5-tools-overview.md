---
id: vc5-tools-overview
topic: nastrojePro
title: Přehled nástrojů pro vibecoding
teaser: Lovable, Bolt, Macaly, Cursor -- každý je jiný. Který sedí tobě?
hook: Který nástroj je nejlepší?
---

![Porovnání nástrojů](assets/diagram-tools-compare.svg)

Čtyři hlavní nástroje a každý má jinou sílu. **Lovable** (lovable.dev) -- nejrychlejší pro prototypování, nejštědřejší free tier, obrovská komunita. **Bolt** (bolt.new) -- běží celý v prohlížeči, zero instalace. **Macaly** (macaly.com) -- česká platforma, vestavěná databáze, lepší SEO díky Next.js. **Cursor** (cursor.com) -- pro ty, kdo chtějí vidět a rozumět kódu.

Upřímně: žádný z nich není "nejlepší." Lovable je nejrychlejší na prototyp, ale špatný pro SEO. Macaly má vestavěnou databázi, ale omezenější free plán a potřebuješ vlastní API klíče. Bolt funguje bez instalace, ale ztrácí kontext u složitých projektů. Cursor je nejmocnější, ale vyžaduje ochotu učit se kód.

? Který typ nástrojů je nejlepší pro úplné začátečníky?
- Cursor -- je nejpopulárnější mezi profesionály
- Žádný -- vibecoding se bez kódu nedá dělat
* Lovable, Bolt nebo Macaly -- generují celou aplikaci z textového popisu
- Všechny jsou stejně jednoduché
! Přesně! Pro začátečníky jsou nejlepší nástroje, kde nevidíš kód a jen popisuješ, co chceš. Lovable, Bolt a Macaly tohle umí nejlépe.

+++

**Lovable** je nejpopulárnější vibecoding nástroj na světě. Postavený na Reactu, má integraci se Supabase (databáze) a obrovskou komunitu. Free tier nabízí několik projektů a omezený počet zpráv měsíčně -- ale na vyzkoušení stačí bohatě. Slabina: aplikace generované v Lovable mají problém se SEO (optimalizace pro vyhledávače) -- Google je špatně indexuje. Pokud stavíš osobní nástroj, nevadí. Pokud stavíš web, který má lidi nacházet přes Google, je to problém.

**Macaly** je česká platforma s několika unikátními výhodami. Používá Next.js, což znamená lepší SEO než Lovable. Má vestavěnou databázi (nepotřebuješ Supabase). Má českou podporu. Nevýhody: omezenější free plán než Lovable, potřebuješ si zařídit vlastní API klíče pro AI modely, menší komunita. Pro české projekty (e-shop, portfolio, firemní web) je to ale silná volba.

**Bolt** od StackBlitz má unikátní technologii WebContainers -- Node.js běží přímo v prohlížeči. Výhoda: zero instalace, otevřeš prohlížeč a stavíš. Můžeš si stáhnout celý kód jako ZIP. Nevýhoda: u složitějších projektů ztrácí kontext a začne dělat chyby.

**Cursor** je fork VS Code s vestavěnou AI. Vidíš kód, ale AI ho píše za tebe. Označíš část, zmáčkneš Ctrl+K a řekneš co chceš změnit. Je to nejlepší cesta, pokud se chceš naučit opravdu programovat -- učíš se vedle AI "kolegy." Ale pro naprosté začátečníky, kteří chtějí jen rychle něco postavit, je to zbytečně komplikované.

Podrobné srovnání Lovable vs. Macaly najdeš na sbruch.com/lovable-vs-macaly -- nezávislá recenze s konkrétními testy obou nástrojů.
