---
id: vc25-claude-code-intro
topic: podKapotou
title: Claude Code — AI agent v terminálu
teaser: Ne chatbot, ale agent. Claude Code čte tvůj kód, edituje soubory a pouští příkazy za tebe.
hook: AI co opravdu kóduje?
flashQ: Čím se Claude Code liší od běžných AI chatbotů?
flashA: Claude Code je agent, který pracuje přímo s tvým projektem — čte soubory, edituje kód, pouští příkazy a commituje. Nepotřebuješ kopírovat kód tam a zpět.
---

![Claude Code](assets/diagram-claude-code.svg)

Claude Code je AI nástroj od Anthropic. Není to chatbot — je to **agent**, který pracuje přímo s tvým projektem. Spustíš ho v terminálu příkazem `claude` a on čte soubory, edituje kód, pouští testy, commituje změny a vytváří pull requesty.

Popíšeš co chceš přirozeným jazykem: 'Napiš testy pro auth modul, spusť je a oprav chyby.' Claude Code to udělá sám — najde soubory, napíše kód, spustí testy, opraví co nefunguje. Funguje v terminálu, VS Code, JetBrains, desktopové aplikaci i na webu (claude.ai/code).

**Instalace:** Na Mac/Linux: `curl -fsSL https://claude.ai/install.sh | bash`. Na Windows: `irm https://claude.ai/install.ps1 | iex`. Pak spustíš `claude` v jakémkoli projektu. Potřebuješ placený Claude účet (Pro/Max/Team).

? Čím se Claude Code liší od běžných AI chatbotů?
- Generuje kód, který musíš ručně zkopírovat | To dělají běžné chatboty — Claude Code kód přímo zapisuje do souborů.
- Je to jen vylepšený autocomplete | Autocomplete doplňuje řádky — Claude Code autonomně řeší celé úkoly.
* Pracuje přímo s tvým projektem — čte soubory, edituje kód, pouští příkazy | Správně! Je to agent, ne chatbot. Pracuje sám, ty jen říkáš co chceš.
- Je to vizuální nástroj jako Lovable | Claude Code pracuje s kódem v terminálu — pro vizuální tvorbu slouží Lovable nebo Bolt.
! Claude Code je agent — pracuje přímo v tvém projektu. Není to chatbot, kterému kopíruješ kód.

+++

**Kde všude Claude Code funguje:**

- **Terminál** — plnohodnotné CLI, příkaz `claude`
- **VS Code / Cursor** — rozšíření s inline diffy a @-zmínkami souborů
- **JetBrains** — plugin pro IntelliJ, PyCharm, WebStorm
- **Desktopová app** — samostatná aplikace pro Mac a Windows
- **Web** — claude.ai/code, funguje i na telefonu
- **CI/CD** — GitHub Actions, GitLab CI pro automatické code review

**Klíčové příkazy:**

- `claude` — spustí interaktivní režim v aktuálním projektu
- `claude "vysvětli tento kód"` — jednorázový dotaz
- `claude -p "analyzuj bezpečnost"` — headless režim (pro skripty)
- `Shift+Tab` — přepínání režimů (normální → auto-accept → plan mode)
- `Esc Esc` — rewind na předchozí stav konverzace
- `Alt+T` — zapnout/vypnout extended thinking (hlubší promýšlení)
- `/help` — nápověda
