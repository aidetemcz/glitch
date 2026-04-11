---
id: vc30-databaze
topic: praxe
title: Co je databáze a proč ji potřebuješ
teaser: Aplikace bez databáze je jako zápisník z písku — zavřeš a je pryč.
hook: Kam se ukládají data?
---

Když zavřeš prohlížeč, tvoje aplikace zapomene všechno. Proč? Protože data žila jen v **paměti prohlížeče** — dočasně, jako v RAM počítače. Databáze je trvalé úložiště — jako pevný disk, ale na internetu.

**Představ si databázi jako tabulku v Excelu.** Sloupce jsou vlastnosti (jméno, email, skóre). Řádky jsou záznamy (každý uživatel). Databáze umí tuto tabulku uložit, prohledávat a měnit — a je dostupná odkudkoli na internetu.

**Kdy ji potřebuješ?** Jakmile tvoje aplikace ukládá cokoli — uživatelské účty, příspěvky, skóre, nastavení. Bez databáze data zmizí po zavření stránky.

**Jak ji přidat ve vibecoding?** Nástroje jako Macaly mají databázi vestavěnou — popíšeš co chceš ukládat a je to. V jiných nástrojích řekni AI: „Použij Supabase jako databázi" — Supabase je bezplatná databáze v cloudu, kterou zvládne nastavit i začátečník.

? Proč potřebuješ databázi?
- Aby aplikace běžela rychleji
- Aby vypadala profesionálněji
* Aby si data pamatovala i po zavření prohlížeče
- Aby fungovala na telefonu
! Správně! Bez databáze všechna data zmizí po zavření prohlížeče. Databáze je trvalé úložiště.

+++

**Typy databází zjednodušeně:**

- **Relační (SQL)** — jako tabulky v Excelu, propojené mezi sebou. Příklad: Supabase, PostgreSQL. Nejlepší pro strukturovaná data (uživatelé, objednávky, produkty).
- **Dokumentové (NoSQL)** — jako složky s JSON soubory. Příklad: Firebase, MongoDB. Dobré pro flexibilní data, kde každý záznam může vypadat jinak.

**Pro vibecoding doporučujeme:**

- **Macaly** — databáze je vestavěná, nemusíš nic nastavovat
- **Supabase** — bezplatný plán, snadné napojení, funguje s Lovable i Bolt
- **Firebase** — od Googlu, bezplatný plán, dobré pro real-time data

**Co říct AI:** „Potřebuju databázi pro ukládání úkolů. Každý úkol má název, popis, stav (hotovo/nehotovo) a datum vytvoření. Použij Supabase." — takhle konkrétní zadání dá AI přesně to, co potřebuje.

**API — jak aplikace mluví s databází:**

API (Application Programming Interface) je „poštovní schránka" mezi tvou aplikací a databází. Aplikace pošle požadavek („dej mi všechny úkoly"), API ho předá databázi a vrátí odpověď. Nemusíš rozumět detailům — AI to napíše za tebe. Ale je dobré vědět, že existuje.
