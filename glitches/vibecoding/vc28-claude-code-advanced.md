---
id: vc28-claude-code-advanced
topic: claudeCode
title: Pokročilé funkce Claude Code
teaser: Worktrees, Plan Mode, pipy, vlastní příkazy a automatizace — pro ty, co chtějí víc.
hook: Chceš to na plný plyn?
---

**Plan Mode:** Zmáčkni `Shift+Tab` dvakrát. Claude analyzuje kód, ale nic nemění — perfektní pro plánování složitých změn. Zmáčkni `Ctrl+G` a uprav plán v editoru.

**Git Worktrees:** `claude --worktree feature-auth` — Claude pracuje v izolované kopii repozitáře. Můžeš mít více sessions paralelně, každou na jiném úkolu, bez kolizí.

**Pipy a automatizace:** `cat build-error.txt | claude -p 'vysvětli příčinu této chyby' > output.txt`. Claude Code funguje jako unixový nástroj — čte ze stdin, píše do stdout.

**CLAUDE.md:** Vytvoř soubor `CLAUDE.md` v kořeni projektu. Claude ho čte při startu každé session — nastav tam coding standardy, architekturu, preferované knihovny.

**Vlastní příkazy:** Vytvoř `.claude/commands/deploy.md` a pak spusť `/deploy`. Opakovatelné workflow sdílené s celým týmem.

**Plánované úlohy:** `/schedule` — Claude na pozadí pravidelně kontroluje PR, audituje závislosti nebo analyzuje CI selhání.

? K čemu slouží CLAUDE.md soubor?
- K dokumentaci pro uživatele projektu
- K nastavení CI/CD pipeline
* K instrukcím pro Claude Code — coding standardy, architektura, preferované knihovny
- K automatickému generování README
! Správně! CLAUDE.md je soubor s instrukcemi, které Claude Code čte na začátku každé session. Nastavíš tam jak má pracovat s tvým projektem.

+++

Další pokročilé funkce:

- **Extended Thinking:** Claude přemýšlí „nahlas" — vidíš jeho myšlenkový postup (zapni verbose mode přes `Ctrl+O`). Pro extra hluboké zamyšlení napiš „ultrathink" do promptu.
- **Subagenti:** Claude může spustit více agentů paralelně — jeden refaktoruje, druhý píše testy. Vytvořit vlastní subagenty jde přes `/agents`.
- **MCP (Model Context Protocol):** Propoj Claude s externími zdroji — Google Drive, Jira, Slack. Claude pak čte tikety, design docy nebo posílá zprávy.
- **Hooks:** Automatické akce při editaci — třeba auto-format po každé změně souboru nebo lint před commitem. Nastav v `settings.json`.
- **Remote Control:** Začni práci na počítači, pokračuj na telefonu. `claude --teleport` přenese session z webu do terminálu.
- **Výstupní formáty:** `--output-format json` pro strojově čitelný výstup, `--output-format stream-json` pro real-time streaming.
