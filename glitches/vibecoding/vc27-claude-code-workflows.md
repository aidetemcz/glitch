---
id: vc27-claude-code-workflows
topic: claudeCode
title: Jak s Claude Code pracovat
teaser: Průzkum kódu, debugging, refaktoring, testy, pull requesty — vše v jednom nástroji.
hook: Co s ním vlastně dělat?
---

**Průzkum kódu:** Přišel jsi k novému projektu? Zeptej se: „Dej mi přehled architektury." Pak se ptej konkrétněji: „Jak funguje autentizace?" Claude prohledá soubory a vysvětlí.

**Debugging:** Máš chybu? Řekni: „Vidím tuto chybu když spustím npm test." Claude najde příčinu, navrhne opravu a aplikuje ji. Přidej screenshot nebo chybovou hlášku pro lepší kontext.

**Refaktoring:** „Přepiš utils.js na moderní ES2024." Claude změní kód, zachová chování a spustí testy.

**Testy:** „Najdi funkce bez testů v auth modulu a napiš pro ně testy." Claude napíše testy podle existujících konvencí v projektu.

**Pull requesty:** „Vytvoř PR pro moje změny." Claude commitne, vytvoří branch a otevře PR s popisem.

? Jaký je nejlepší způsob, jak popsat chybu Claude Code?
- „Je to rozbité, oprav to"
- Jen zkopírovat název souboru kde je chyba
* Popsat co se děje, kdy se chyba objevuje, a přiložit chybovou hlášku
- Přepsat celý kód a požádat o kontrolu
! Přesně! Konkrétní popis + chybová hláška = nejrychlejší oprava. Čím víc kontextu, tím lepší výsledek.

+++

Příklady promptů pro Claude Code:

**Průzkum:**
- `give me an overview of this codebase`
- `how is authentication handled?`
- `trace the login process from front-end to database`

**Debugging:**
- `I'm seeing an error when I run npm test`
- `suggest a few ways to fix the @ts-ignore in user.ts`

**Refaktoring:**
- `find deprecated API usage in our codebase`
- `refactor utils.js to use ES2024 features while maintaining the same behavior`

**Testy:**
- `find functions in NotificationsService.swift that are not covered by tests`
- `add test cases for edge conditions in the notification service`

**PR:**
- `summarize the changes I've made to the authentication module`
- `create a pr`
