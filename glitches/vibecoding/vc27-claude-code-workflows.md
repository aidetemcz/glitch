---
id: vc27-claude-code-workflows
topic: podKapotou
title: Tipy a triky pro Claude Code
teaser: CLAUDE.md, Plan Mode, checkpointy, subagenti, hooks — vše co potřebuješ vědět.
hook: Jak z toho vytěžit maximum?
flashQ: K čemu slouží soubor CLAUDE.md?
flashA: CLAUDE.md je soubor s instrukcemi, který Claude Code čte na začátku každé session. Nastavíš tam coding standardy, architekturu a pravidla pro svůj projekt.
---

**CLAUDE.md — paměť projektu.** Vytvoř soubor `CLAUDE.md` v kořeni projektu. Claude Code ho čte při startu každé session. Nastav tam: coding standardy, architekturu, preferované knihovny, build příkazy. Funguje ve třech úrovních: osobní (`~/.claude/CLAUDE.md`), projektové (`./CLAUDE.md`) a adresářové (`src/api/CLAUDE.md`).

**Plan Mode** — zmáčkni `Shift+Tab` dvakrát. Claude analyzuje kód ale nic nemění. Perfektní před velkým refaktoringem. Zmáčkni `Ctrl+G` a uprav plán v editoru. Až budeš spokojený, přepni zpět a Claude ho provede.

**Checkpointy a Rewind** — Claude automaticky ukládá stav při každém tvém promptu. Zmáčkni `Esc Esc` nebo napiš `/rewind` a vrať se na předchozí stav. Můžeš bezpečně experimentovat — když to dopadne špatně, vrátíš se jedním příkazem.

**Praktické příklady promptů:** 'Prozkoumej tento projekt a dej mi přehled architektury.' 'Vidím tuto chybu při npm test: [vlož chybu]. Oprav to.' 'Přepiš utils.js na ES2024.' 'Najdi funkce bez testů a napiš pro ně testy.' 'Commitni změny s popisným commit message a vytvoř PR.'

? K čemu slouží soubor CLAUDE.md?
- K dokumentaci pro uživatele projektu | README je pro uživatele — CLAUDE.md je pro AI asistenta.
- K nastavení CI/CD pipeline | CI/CD se nastavuje v jiných konfiguracích — CLAUDE.md instruuje Claude Code.
* K instrukcím pro Claude Code — coding standardy, architektura, pravidla projektu | Správně! CLAUDE.md je paměť projektu, kterou Claude čte při každé session.
- K automatickému generování README | CLAUDE.md neslouží ke generování — je to zdroj instrukcí pro AI.
! CLAUDE.md je soubor s instrukcemi pro Claude Code. Nastavíš tam jak má pracovat s tvým projektem.

+++

**Pokročilé funkce:**

- **Extended Thinking** — `Alt+T` zapne hluboké promýšlení. Claude přemýšlí krok za krokem. Vidíš jeho myšlenky přes `Ctrl+O` (verbose mode). Napiš 'ultrathink' do promptu pro extra hluboké zamyšlení.

- **Subagenti** — Claude může spustit více agentů paralelně. Jeden refaktoruje, druhý píše testy, třetí kontroluje bezpečnost. Vytvoř vlastní v `.claude/agents/` nebo napiš `/agents`.

- **MCP (Model Context Protocol)** — propoj Claude s externími zdroji. GitHub: `claude mcp add github -- npx -y @modelcontextprotocol/server-github`. Pak Claude čte issues, vytváří PR, reaguje na komentáře.

- **Hooks** — automatické akce při editaci. Auto-format po každé změně, lint před commitem, security scan po modifikaci. Nastavení v `~/.claude/settings.json`.

- **Skills (vlastní příkazy)** — vytvoř `.claude/commands/deploy.md` a spusť `/deploy`. Opakovatelné workflow sdílené s celým týmem.

- **Worktrees** — `claude --worktree feature-auth` spustí Claude v izolované kopii repozitáře. Víc sessions paralelně, bez kolizí.

- **Pipy** — `cat error.log | claude -p 'analyzuj tuto chybu' > report.txt`. Claude funguje jako unixový nástroj.

- **Session management** — `claude -n auth-refactor` pojmenuje session. `claude --resume auth-refactor` se vrátí. `/resume` otevře picker se všemi sessions.

**Zdroj:** Kompletní průvodce na github.com/luongnv89/claude-howto
