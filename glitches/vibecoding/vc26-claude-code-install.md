---
id: vc26-claude-code-install
topic: claudeCode
title: Instalace a první kroky
teaser: Jeden příkaz v terminálu a za minutu kóduješ s AI. Tady je jak.
hook: Jak ho nainstalovat?
---

Instalace je jeden příkaz. Na Macu a Linuxu: `curl -fsSL https://claude.ai/install.sh | bash`. Na Windows PowerShellu: `irm https://claude.ai/install.ps1 | iex`. Nebo přes Homebrew: `brew install --cask claude-code`.

Po instalaci jdi do složky s projektem a napiš `claude`. Při prvním spuštění se přihlásíš přes prohlížeč. A je to — můžeš psát příkazy přirozeným jazykem.

Základní příkazy: `claude "vysvětli tento kód"` — jednorázový dotaz. `claude` bez argumentu — interaktivní režim. `/help` — nápověda. `Shift+Tab` — přepínání režimů (normální, auto-accept, plan mode).

? Co potřebuješ pro spuštění Claude Code?
- Python 3.8 a Docker
- Jen webový prohlížeč, nic se neinstaluje
* Terminál, internetové připojení a placený Claude účet
- Speciální hardware s GPU
! Správně! Stačí terminál, internet a placený Claude účet (Pro, Max, Team nebo Enterprise).

+++

Tipy pro začátek:

- **Začni jednoduchým dotazem:** `claude "dej mi přehled tohoto projektu"` — Claude přečte strukturu a vysvětlí co projekt dělá.
- **Používej @-zmínky:** `Vysvětli logiku v @src/utils/auth.js` — přímo vloží obsah souboru do konverzace.
- **Pojmenuj si sessions:** `claude -n auth-refactor` — pak se můžeš vrátit pomocí `claude --resume auth-refactor`.
- **Plan Mode:** Zmáčkni `Shift+Tab` dvakrát pro read-only analýzu. Claude plánuje, ale nic nemění — bezpečné pro průzkum kódu.
- **Automatické aktualizace:** Nativní instalace se aktualizuje na pozadí. Nemusíš nic řešit.
