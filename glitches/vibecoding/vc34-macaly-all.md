---
id: vc34-macaly-all
topic: nastrojePro
title: Macaly -- kompletní průvodce českou platformou
teaser: Česká platforma pro vibecoding od A do Z. Všechno na jednom místě.
hook: Co všechno Macaly umí?
---

Macaly (macaly.com) je česká vibecoding platforma z Prahy. Oproti zahraniční konkurenci má tři výhody: vestavěnou databázi (nepotřebuješ Supabase), lepší SEO díky Next.js a českou podporu. Nevýhody: omezenější free plán než Lovable a potřebuješ si zařídit vlastní API klíče pro AI modely.

Verze 3.0 přinesla klíčové funkce: **Edit Mode** (klikneš na prvek a změníš ho bez promptu), **Global Styles** (nastavíš barvy a fonty pro celou aplikaci najednou), **Agent Memory** (AI si pamatuje tvoje preference mezi konverzacemi) a **Diff Mode** (vidíš přesně, co AI změnila). Plus vestavěná databáze a publikování jedním kliknutím.

? Co je hlavní technická výhoda Macaly oproti Lovable?
- Je rychlejší
- Má víc šablon
* Používá Next.js, což znamená lepší SEO a vestavěnou databázi
- Má více AI modelů
! Správně! Next.js umožňuje server-side rendering, díky čemuž Google lépe indexuje stránky vytvořené v Macaly.

+++

**Edit Mode:**

Klikneš přímo na tlačítko nebo text v náhledu aplikace a řekneš, co chceš změnit. Nemusíš psát prompt typu "změň barvu třetího tlačítka na modrou" -- prostě na něj klikneš. Pro vizuální úpravy (barvy, velikosti, texty) je to rychlejší než chat. Pro logiku (co se stane po kliknutí) ale stále potřebuješ chat.

**Global Styles:**

Nastavíš barvy, fonty a styl celé aplikace na jednom místě. Nemusíš měnit každou stránku zvlášť. Řekneš: "Hlavní barva je tmavě modrá, font je Inter, zaoblené rohy na tlačítkách" -- a celá aplikace se přizpůsobí. Pokud později změníš názor, stačí upravit Global Styles a změní se to všude.

**Agent Memory:**

AI si pamatuje tvoje preference z předchozích konverzací. Pokud jsi řekl, že preferuješ tmavý design a české texty, nemusíš to opakovat v každém novém projektu. Tohle žádný zahraniční konkurent zatím nemá.

**Vestavěná databáze:**

Popíšeš, co chceš ukládat ("uživatelé s jménem, e-mailem a datem registrace"), a Macaly vytvoří databázovou strukturu automaticky. Navíc dostaneš vizuální CMS -- tabulku, kde vidíš všechna data a můžeš je editovat ručně. Nemusíš řešit Supabase, Firebase ani žádnou externí službu.

**Diff Mode:**

Po každé změně vidíš přesně, co AI upravila -- jaký kód přidala, co smazala, co změnila. Pro začátečníky je to vzdělávací: vidíš, co AI udělala, a postupně začneš kódu rozumět. Pro pokročilejší je to kontrola: můžeš zachytit, když AI udělá něco nežádoucího.

**Publikování:**

Hotovou aplikaci publikuješ jedním kliknutím. Macaly ji hostuje za tebe. Dostaneš URL, kterou můžeš sdílet s kýmkoli.

**Tipy pro práci s Macaly:**

1. **Postupuj po malých krocích.** Neříkej "Udělej mi celý e-shop." Řekni: "Vytvoř stránku se seznamem produktů. Každý produkt má název, cenu a obrázek."
2. **Buď konkrétní.** "Přidej modré tlačítko vpravo nahoře s textem Přihlásit se" je lepší než "přidej přihlášení."
3. **Používej funkci Restore.** Pokud AI něco rozbije, vrať se k předchozí verzi místo opravování.
4. **Kombinuj Edit Mode a chat.** Vizuální změny přes Edit Mode, logiku přes chat.
5. **API klíče:** Macaly vyžaduje vlastní API klíče (např. pro OpenAI). To znamená, že si musíš vytvořit účet u poskytovatele AI a vložit klíč do Macaly. Výhoda: platíš jen za to, co skutečně spotřebuješ. Nevýhoda: je to krok navíc oproti nástrojům, kde je AI zabudovaná.
