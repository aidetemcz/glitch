# Karta — Wellbeing

_Šablona sekcí Glitchů typu **Wellbeing** (mood / dýchání / pozornost) na příkladu „Jak se teď cítíš?". Návrh k připomínkám. Vytvořeno: 2026-07-23._

**Jak číst tenhle soubor.** Wellbeing nejsou znalostní Glitche — jsou to **interaktivní denní selectory a krátké hry**, které jsou pevnou součástí feedu (ne přeskočitelný bonus). Nemají chatbota ani fork. Mají tři podtypy: **mood_selector**, **breathing** a **attention_game**. Odpadají proto sekce o výukovém kontraktu a kontextu pro bota; klíčové je, co se měří, kam se to ukládá a jak dlouho.

**Interakce:** Rozklik ⭘ někdy · Chatbot ❌ · Fork ❌
**Datový soubor:** [`../glitches/wellbeing/`](../glitches/wellbeing)

---

## 0 Identifikace

| pole | hodnota |
| ----- | ----- |
| id | `mood-selector` |
| název | Jak se teď cítíš? |
| typ | `wellbeing` |
| podtyp | `mood_selector` *(mood_selector · breathing · attention_game)* |
| verze | 1.0 |
| stav důvěry | `core` |
| jazyk | cs |

---

## 1 Účel a zásady *(redakční)*

*Wellbeing karty pečují o vnitřní nastavení dítěte — ne o znalosti. Nemají „správný výsledek". Řídí se přísnějšími pravidly na data.*

- **Účel:** krátký check-in nebo zklidnění mezi znalostními Glitchi; u mood navíc **personalizace** dnešního výběru.
- **Nepřekročitelné zásady:**
  - **Časovače vždy opt-in** (týká se attention_game) — nikdy automaticky.
  - **Žádné srovnávání** — hodnota je jen osobní, nikdy se nezobrazuje vůči ostatním.
  - **Emoční data jen po dobu 24hodinové relace**, pak se mažou. Neukládají se jako trvalý signál pro doporučování.

---

## 2 Podtypy a jejich karta

### 2.1 `mood_selector` — denní check-in *(příklad)*

- **Štítek:** `Wellbeing`. **Titulek:** „Jak se teď cítíš?"
- **Text:** „Umísti potažením černou tečku na správné místo v diagramu. My podle toho upravíme Glitche, které se ti dnes zobrazí."
- **Interakce:** dítě potažením umístí tečku do diagramu s osami **SOUSTŘEDĚNÍ** (x, 0–100) × **ENERGIE** (y, 0–100), potvrdí tlačítkem.
- **Kam se ukládá:** dvojice `(x, y)` → `mood`; hodnota personalizuje výběr Glitchů pro daný den (efemérní, 24 h).

### 2.2 `breathing` — dechové cvičení

- **Štítek:** `Wellbeing`. **Titulek:** „Dechové cvičení."
- **Text:** krátké vysvětlení, proč vědomé dýchání pomáhá soustředění.
- **Interakce:** nastavitelný počet cyklů; animované fáze **nádech / výdech** (bez zádrže), počítadlo uvnitř kolečka, fáze pojmenovaná v patičce. Tlačítko Začít → Pozastavit.
- **Kam se ukládá:** nic citlivého; případně jen „dokončeno" jako neutrální signál.

### 2.3 `attention_game` — hra na pozornost

- **Štítek:** `Hra na pozornost`. **Titulek + pokyn.**
- **Interakce:** interaktivní 3D objekt (drátěná koule s dírami); dítě otáčí tažením a ťuká na díry vpředu. **Opt-in časovač** jako „ukrajující" kolečko.
- **Kam se ukládá:** počet zásahů jen jako osobní zpětná vazba v relaci; žádné srovnávání.

---

## 5 Metadata pro doporučovací systém

| pole | hodnota |
| ----- | ----- |
| fasety | podtyp: mood_selector · délka: mikro · umístění: kdekoli ve feedu |
| signál dokončení | mood: umístění a potvrzení tečky · breathing: dokončení cyklů · attention: ukončení hry |
| vliv na doporučování | **jen mood** ovlivňuje výběr Glitchů pro daný den; ostatní podtypy neovlivňují |
| fork | `false` |

---

## 6 Bezpečnost, soukromí a relace

- **Emoční data (mood, frustrace, pozornost) jsou citlivá** → žijí jen v 24hodinové relaci, pak se mažou. Nepropisují se do trvalého profilu ani se neposílají jako hodnocení.
- **Žádné srovnávání, žádné žebříčky, žádné veřejné sdílení** nálady ani výsledku hry.
- **Časovač u hry na pozornost je opt-in** — časový tlak se nikdy nevytváří sám.
- Wellbeing karta se **nedá „propadnout"** — neexistuje špatný výsledek, jen check-in.
