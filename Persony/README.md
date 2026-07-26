# Persony (prompty chatbota)

Katalog **person** — systémových promptů pro chatbota v Glitchi. Každá persona
určuje, **JAK** chatbot mluví (tón, role, metoda). **O ČEM** mluví se bere zvlášť
z konkrétní karty Glitche (kontext). Cílem je **12 typů person.**

V budoucím **editoru** si autor Glitche vybere personu ze seznamu → do karty se
uloží jen její `id`. Systém je na to připravený (persona = „jak", karta = „o čem").

## Persony v katalogu

| Soubor | Persona | Použití |
|---|---|---|
| `glitchee-basic-glitch.md` | **Glitchee** — sokratovský průvodce | výchozí pro Basic Glitch |
| _(další se doplní — směřujeme k 12)_ | | |

## Jak persona funguje

- **Fixní část** promptu (kdo bot je, metoda, tón, bezpečnost) je stejná pro
  všechny Glitche daného typu.
- **Blok `### KARTA GLITCHE`** se při nasazení naplní poli konkrétní karty
  (placeholdery `{{...}}`). Když karta nějaké pole nemá, placeholder se vynechá.
- **Karta Glitche je source of truth** — bot nepřidává látku mimo kartu.

## Stav napojení

- V appce zatím běží **zjednodušená** verze Glitchee (krátká persona v kódu).
- **Plné nasazení** téhle persony vyžaduje bohatší strukturu karty
  (Kontrakt, Sekce 4 apod. dle `docs/karta-basic-glitch.md`) — na to navážeme,
  až budou karty v tomhle formátu a dorazí zbylé persony.
