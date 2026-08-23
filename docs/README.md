# Dokumentace Glitche

Kanonická dokumentace projektu — **zdroj pravdy je tady na GitHubu**. Dřív žila v Google Docs; teď se v Docs nechávají jen odkazy sem.

> 📖 **Nový v projektu?** Začni [`slovnicek.md`](./slovnicek.md) — vysvětluje všechny pojmy (fasety, elastický katalog, štítky důvěry, RVP, mapa konceptů…).

## Návrh a fungování

- [`popis-fungovani-glitche.md`](./popis-fungovani-glitche.md) — kanonický popis toho, jak Glitch funguje (obsahový model, feed, boardy, fork, chatbot, doporučovací systém, kurátorství, wellbeing a bezpečí, vztah k p-book).
- [`prototyp-funkce.md`](./prototyp-funkce.md) — **co je reálně postavené** v prototypu (tvorba Glitche, pracovna projektu, spolupráce + realtime zprávy, glitchposty ve feedu, sledování, focus místo mood, web landing, personas).
- [`vymezeni-zakaz-socialnich-siti.md`](./vymezeni-zakaz-socialnich-siti.md) — proč zakazovat sociální sítě nefunguje a jak Glitch stavíme jinak.
- [`modely-fungovani-socialnich-siti.md`](./modely-fungovani-socialnich-siti.md) — rešerše modelů fungování sociálních sítí (podklad pro návrh).
- [`projekt-pracovna-navrh.md`](./projekt-pracovna-navrh.md) — návrh pracovny projektu (workspace, záložky, spolupráce).
- [`layout-spec.md`](./layout-spec.md) — přesné rozměry a souřadnice prvků karet (z Figmy).
- [`tok-basic-glitch.md`](./tok-basic-glitch.md) — tok interakce Basic Glitche (rozklik → chatbot → fork).

## Obsah a karty

- [`typy-obsahu.md`](./typy-obsahu.md) — přehled typů obsahu (Basic Glitch, Rychlá výzva, Wellbeing, Fun fact, Najdi chybu, Historická osobnost, Argumentuj, Inspirace), stavy důvěry, relace, source of truth.
- **Návrhy karet** — šablona sekcí + konkrétní příklad pro každý typ: [`karta-basic-glitch.md`](./karta-basic-glitch.md), [`karta-rychla-vyzva.md`](./karta-rychla-vyzva.md), [`karta-wellbeing.md`](./karta-wellbeing.md), [`karta-funfact.md`](./karta-funfact.md), [`karta-najdi-chybu.md`](./karta-najdi-chybu.md), [`karta-historicka-osobnost.md`](./karta-historicka-osobnost.md), [`karta-argument.md`](./karta-argument.md), [`karta-inspirace.md`](./karta-inspirace.md).
- [`napady-argumentuj.md`](./napady-argumentuj.md) — zásobník tvrzení pro typ Argumentuj.

## Doporučování a data

- [`slovnicek.md`](./slovnicek.md) — slovníček všech pojmů (pro předání komukoliv).
- [`doporucovaci-system.md`](./doporucovaci-system.md) — jak Glitch vybírá feed (11 principů, p-book, focus signál → tempo, fasety a generování).
- [`doporucovani-implementace.md`](./doporucovani-implementace.md) — implementační plán v1 (klientský ranker: katalog → signály → skórování → feed).
- [`databaze-navrh.md`](./databaze-navrh.md) — návrh struktury databáze (obsah, signály, preference).

## Archiv

- [`archiv/`](./archiv/) — starší, nahrazené verze dokumentů. Ponecháno pro historii, není to zdroj pravdy.

---

**Související:** konkrétní obsah feedu žije v [`../glitches/feed.json`](../glitches/feed.json) (jednotný manifest karet, ne per-Glitch MD; fallback = pole `CARDS` v `js/feed.js`); interaktivní **Mapa informatických konceptů** v [`../knowledge-map/`](../knowledge-map/). Web landing v [`../web/`](../web/) (samostatný Vercel projekt na glitch.tiny.school). SQL migrace v [`../migrations/`](../migrations/).
