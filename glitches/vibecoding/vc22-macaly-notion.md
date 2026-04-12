---
id: vc22-macaly-notion
topic: macaly
title: Propoj formulář s Notion databází
teaser: Kontaktní formulář, který automaticky ukládá data do Notionu. Za 5 minut.
hook: Formulář rovnou do Notionu?
---

Chceš na svém webu kontaktní formulář, jehož data se automaticky uloží do Notion databáze? V Macaly to zvládneš jedním promptem.

**Část 1 — Připrav Notion:** Vytvoř novou databázi v Notionu se sloupci „Name", „Email" a „Message". Pak jdi na notion.so/my-integrations, vytvoř novou interní integraci, povol „Read content" a „Insert content", zkopíruj API klíč. Nakonec v databázi přidej připojení k integraci a zkopíruj odkaz na databázi.

**Část 2 — Řekni to Macaly:** Do chatu napiš: „Vytvoř kontaktní formulář s poli jméno, email a zpráva. Propoj ho s mou Notion databází. Nejdřív přečti strukturu Notion stránky (použij API) tady: [vlož odkaz]. Použij tento API klíč: [vlož klíč]."

Otestuj — vyplň formulář, odešli a zkontroluj, jestli se data objevila v Notionu.

? Co potřebuješ z Notionu, abys propojil formulář v Macaly?
- Jen odkaz na Notion stránku
- Uživatelské jméno a heslo k Notionu
* API klíč z Notion integrace a odkaz na databázi
- Exportovaný CSV soubor z Notionu
! Správně! Potřebuješ dvě věci: API klíč z interní integrace a odkaz na databázi, ke které jsi integraci připojil.

+++

Podrobný postup krok za krokem:

1. **Vytvoř databázi v Notionu** — nová stránka, typ „Database – Full page", pojmenuj ji třeba „Kontakty z webu."
2. **Přidej sloupce** — výchozí „Name" nech, přidej „Email" (text) a „Message" (text).
3. **Vytvoř integraci** — na notion.so/my-integrations klikni „New integration", pojmenuj ji (třeba „Macaly Web"), vyber svůj workspace.
4. **Nastav oprávnění** — zaškrtni „Read content" a „Insert content."
5. **Zkopíruj API klíč** — v sekci Secrets klikni „Show" a zkopíruj token. Chovej se k němu jako k heslu!
6. **Propoj integraci s databází** — v Notionu otevři databázi, klikni na tři tečky → „Add connections" → vyber svou integraci.
7. **Zkopíruj odkaz** — klikni „Share" a zkopíruj link na databázi.
8. **Pošli prompt do Macaly** — vlož odkaz i API klíč do zprávy.
9. **Otestuj** — vyplň formulář a zkontroluj Notion.
