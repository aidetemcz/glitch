# Tok Basic Glitche — co se spouští kdy

Co se děje od chvíle, kdy žák rozklikne Basic Glitch, až po jeho splnění.
Kde jsou **zdroje**, kdy běží **která AI funkce** a co se **kam zapisuje**.

> Doplňkové dokumenty: `Persony/README.md` (persony a kvíz),
> `docs/doporucovani-implementace.md` (řazení feedu).

---

## 1. Celkový tok

```mermaid
flowchart TD
    A(["Žák rozklikne Glitch — žlutá šipka ve feedu"]) --> B["Pre-test: Co už o tématu víš?"]
    B -->|zvolí úroveň| C["Bot zahájí — krátce uvede do tématu a položí otázku"]
    C --> D{Konverzace}
    D -->|žák píše| E["Odpověď bota — vysvětluje nebo se ptá"]
    E --> D

    D -.->|před každou odpovědí| F["Rozhodčí — je čas na kvíz?"]
    F -->|ANO| G["Generátor kvízu — JSON režim"]
    G --> H["Kvíz v chatu — single nebo multi"]
    H -->|žák odpoví| I["Hodnotitel — splnil kritéria?"]
    I -->|ne| D
    I -->|ano| J(["Splněno — nabídka dalšího Glitche nebo feedu"])

    style F fill:#ffff00,stroke:#000,color:#000
    style G fill:#ffff00,stroke:#000,color:#000
    style I fill:#ffff00,stroke:#000,color:#000
    style J fill:#ffff00,stroke:#000,color:#000
```

Žlutě jsou **AI funkce**. Každá má jediný úkol — proto je spolehlivá.

---

## 2. AI funkce (kdy běží a proč zvlášť)

| Funkce | Kde | Kdy běží | Co vrací |
|---|---|---|---|
| **Konverzační bot** | `api/gpt.js` | při každé zprávě | text odpovědi |
| **Rozhodčí kvízu** | `api/gpt.js` → `shouldQuiz()` | jen když projdou levná pravidla | `ANO` / `NE` |
| **Generátor kvízu** | `api/gpt.js` → `generateQuiz()` | když rozhodčí řekne ANO | JSON kvízu |
| **Hodnotitel** | `api/evaluate.js` | po odpovědi na kvíz | `splneno`, `uroven`, `shrnuti` |

**Proč zvlášť:** konverzační bot má v personě „piš krátce, jednu otázku". Když
se po něm chtělo, aby uprostřed řeči vyrobil ještě JSON kvízu, většinou to
neudělal. Rozdělením na samostatná volání dostane každý model jeden jasný úkol.

### Kdy přijde kvíz (dvoustupňové rozhodnutí)

```mermaid
flowchart LR
    A["žák pošle zprávu"] --> B{"levná pravidla — bez AI"}
    B -->|méně než 2 zprávy| N["bez kvízu"]
    B -->|krátce po kvízu| N
    B -->|žák si o kvíz řekl| Y["kvíz"]
    B -->|5 a více zpráv bez kvízu| Y
    B -->|jinak| C{"Rozhodčí AI"}
    C -->|NE| N
    C -->|ANO| Y
```

Levná pravidla šetří volání: rozhodčí se ptá jen tehdy, když má smysl.

---

## 3. Odkud se berou zdroje

```mermaid
flowchart LR
    subgraph zdroje ["Zdroje pravdy"]
        P["Persony — 12 MD souborů"]
        M["knowledge-map.yaml — mapa konceptů"]
        F["glitches/feed.json — karty Glitchů"]
    end

    P -->|build-catalog.py| PJ["Persony/personas.json"]
    M -->|build-concepts.py| MJ["knowledge-map/concepts.json"]

    PJ -->|prompt persony| S["api/gpt.js"]
    F -->|kontext karty| S
    MJ -->|cíle a kritéria| E["api/evaluate.js"]
    F -->|concept_id| E

    style zdroje fill:#f6f6f6,stroke:#999
```

- **Persony** = *jak* bot mluví. Vybírá se polem `persona` v kartě
  (jinak dle typu karty, jinak `glitchee`).
- **Karta Glitche** = *o čem* mluví (téma, název, úvodní text).
- **Mapa konceptů** = podle čeho se **hodnotí** (výukové cíle + kritéria),
  napojená přes `concept_id` karty.

⚠️ Po úpravě zdrojů je potřeba přegenerovat:
```bash
python3 Persony/build-catalog.py
python3 knowledge-map/build-concepts.py
```

---

## 4. Co se kam zapisuje

```mermaid
flowchart TD
    K["žák odpoví na kvíz"] --> H["Hodnotitel — api/evaluate.js"]
    H -->|nesplněno| P["pokračuje konverzace"]
    H -->|splněno| D["markGlitchDone — js/progress.js"]

    D --> L[("localStorage — tg_progress")]
    D --> S[("Supabase — progress")]
    D --> U["nabídka dalšího Glitche nebo feedu"]

    L --> R["Doporučovač — js/recommender.js"]
    R --> V["hotové Glitche se ve feedu neukazují"]

    style H fill:#ffff00,stroke:#000,color:#000
```

| Kam | Co | Kdy |
|---|---|---|
| `localStorage.tg_progress` | `{hotovo, kdy, uroven, shrnuti, concept_id}` | při splnění |
| `localStorage.tg_retry` | `{kdy, pokusy}` | při špatné odpovědi |
| Supabase `progress` | totéž, jen pro přihlášené | při splnění |

### Druhá šance

Špatná odpověď Glitch **neuzavírá**. Zapíše se do `tg_retry` a:
- v běžící relaci se karta **posune o ~8 karet níž**,
- při dalším načtení ji doporučovač zařadí dál od začátku.

---

## 5. Kdy je Glitch „hotový"

| Typ Glitche | Podmínka splnění |
|---|---|
| **Basic Glitch** (s chatem) | hodnotitel potvrdí, že žák splnil kritéria konceptu |
| **Rychlá výzva** (bez chatu) | správná odpověď (špatná → druhá šance) |

Hodnotitel má jedno tvrdé pravidlo: **počítá jen to, co žák prokazatelně řekl
sám.** Když všechno vysvětlil bot a žák jen přikyvoval, splněno není.

---

## 6. Co ještě není hotové

- [x] Zobrazit **vyhodnocení** při znovuotevření splněného Glitche
- [x] Zápis do `concept_mastery` (úroveň zvládnutí konceptu) — `tg_mastery` + Supabase
- [x] **Profil žáka do promptu** — co už žák zvládl (z `tg_mastery`) jde do
  systémového promptu chatbota jako blok „PROFIL ŽÁKA", ať může navázat na známé
  (`js/feed.js` → `buildZakProfil()`, `api/gpt.js` → `zakBlock()`)
- [x] **Mapa znalostí žáka** — heatmapa konceptů obarvená dosaženými úrovněmi
  v profilu (záložka Moje questy). Kostra: `knowledge-map/map-index.json`
  (`build-map-index.py`), obarvení z `tg_mastery` (`js/profile.js`)
