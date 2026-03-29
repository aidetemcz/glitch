# Přispívání do „Jak funguje doporučování online?"

Díky, že pomáháš vylepšit tuto knihu! Tento průvodce vysvětluje, jak přispívat obsahem.

## Typy obsahu

| Typ | Popis | Frontmatter `type` |
|-----|-------|-------------------|
| Sekce | Vzdělávací obsah (hlavní text knihy) | `spine` |
| Otázka | Interaktivní kvíz s výběrem odpovědí | `question` |
| Hra | Klikací minihra | `game` |

## Jak přispět

### 1. Nejdřív otevři issue
Popiš, co chceš přidat. To pomůže předejít duplicitní práci.

### 2. Vytvoř větev
```
git checkout -b content/ch2-moje-nova-sekce
```

### 3. Napiš obsah

Vytvoř markdown soubor v příslušném adresáři `content/chN-*/`.

**Pojmenování souborů**: `{pořadí}{písmeno}-{typ}-{slug}.md`
- Příklady: `03a-spine-filtracni-bubliny.md`, `01c-game-trideni-signalu.md`

**Šablona frontmatter**:
```yaml
---
id: ch2-moje-unikatni-id
type: spine
title: "Název mé sekce"
readingTime: 3
standalone: true
teaser: "Jednovětý náhled zobrazený na kartičce"
voice: universal           # universal | explorer | creator | thinker
parent: null
diagram: null              # název SVG diagramu bez přípony (volitelné)
core: false                # true = nutné pro certifikát
recallQ: "Otázka pro rozložené opakování"
recallA: "Odpověď na otázku"
status: draft
---

Tvůj markdown obsah zde...
```

### Povinná pole

| Pole | Popis | Příklad |
|------|-------|---------|
| `id` | Unikátní identifikátor bloku | `ch3-moje-sekce` |
| `type` | Typ obsahu | `spine`, `question`, `game` |
| `title` | Zobrazovaný název | `"Jak funguje filtrování"` |
| `status` | Vždy `draft` pro nový obsah | `draft` |
| `recallQ` | Otázka pro kartičku opakování | `"Co je kolaborativní filtrování?"` |
| `recallA` | Odpověď na otázku | `"Hledání lidí s podobným vkusem..."` |

### Volitelná pole

| Pole | Popis | Příklad |
|------|-------|---------|
| `readingTime` | Odhadovaný čas čtení v minutách | `3` |
| `standalone` | Lze číst samostatně? | `true` / `false` |
| `teaser` | Jednovětý náhled na kartičce | `"YouTube ví, co máš rád. Ale jak?"` |
| `voice` | Styl čtení | `universal`, `explorer`, `creator`, `thinker` |
| `core` | Nutné pro certifikát | `true` / `false` |
| `diagram` | SVG diagram z `images/` | `kids-pipeline` |
| `parent` | Rodičovský blok (pro hloubkové karty) | `ch3-friends` |

### O otázkách a odpovědích (recallQ / recallA)

Každá sekce by měla mít vlastní **otázku pro opakování** (`recallQ`) a **odpověď** (`recallA`). Tyto se zobrazují v kvízu (kartičky s rozloženým opakováním).

**Pravidla pro dobré otázky:**
- Ptej se na **klíčovou myšlenku** sekce, ne na detail
- Formuluj pro děti 8–15 let — krátce, jasně, bez žargonu
- Odpověď by měla být 1–2 věty, ne odstavec
- Vyhni se otázkám typu ano/ne — lepší je „Co/Jak/Proč"

**Příklady:**
```yaml
# Dobrá otázka:
recallQ: "Jak kolaborativní filtrování najde, co se ti bude líbit?"
recallA: "Najde lidi s podobným vkusem a doporučí ti, co se líbilo jim."

# Dobrá otázka:
recallQ: "Proč moderní systémy preferují implicitní zpětnou vazbu?"
recallA: "Protože uživatelé málokdy hodnotí, ale čas sledování se měří automaticky u každé interakce."

# Špatná otázka (příliš obecná):
recallQ: "Co je důležité v kapitole 3?"
recallA: "..." # Příliš vágní
```

### 4. Přidej do book.json
Přidej název svého souboru do pole `files` v příslušné kapitole v `content/book.json`.

### 5. Otevři Pull Request
CI automaticky zvaliduje tvůj obsah (frontmatter, unikátní ID, reference). Oprav případné chyby před žádostí o review.

## Přidání hry

1. Vytvoř JSON soubor v `games/moje-hra.json`:
```json
{
  "type": "sort",
  "title": "Moje hra",
  "instruction": "Co má hráč dělat",
  "buckets": ["Možnost A", "Možnost B"],
  "items": [
    { "text": "Text položky", "answer": 0 }
  ]
}
```

Typy her: `sort` (klasifikuj), `match` (najdi dvojníka), `pop` (klikej a sbírej), `order` (seřaď)

2. Vytvoř obsahový soubor, který na ni odkazuje:
```yaml
---
id: ch2-game-moje
type: game
game: moje-hra
title: "Název mé hry"
recallQ: "Co ses naučil z této hry?"
recallA: "..."
status: draft
---
```

## Přidání obrázku

Vlož SVG soubory do `images/`. Odkazuj z obsahu přes `diagram: muj-diagram` ve frontmatter.

Pro inline obrázky v textu použij markdown: `![Popis](/images/muj-obrazek.svg)`

## Stylový průvodce

- **Cílová skupina**: Děti 8–15 let
- **Tón**: Kamarádský, povzbuzující, nikdy povýšený
- **Délka čtení**: 2–5 minut na sekci
- **Příklady**: Používej YouTube, TikTok, Spotify, Netflix — appky, které děti skutečně používají. V české verzi přidej i lokální příklady (Seznam, Mall.cz, Rohlík)
- **Vyhni se**: Žargonu bez vysvětlení, dlouhým odstavcům, trpnému rodu
- **Zahrň**: Reálné příklady, analogie, „zkus to" výzvy, „Věděl/a jsi?" zajímavosti
- **Jazyk**: Tykej (ty-forma), krátké věty, přímé oslovení. Anglické termíny vysvětli v závorkách při prvním výskytu.

## Proces review

1. Odešli PR s `status: draft`
2. CI zvaliduje strukturu obsahu
3. Hlavní autor zkontroluje kvalitu a přesnost
4. Hlavní autor nastaví `status: accepted` a mergne
5. Obsah se zobrazí v knize při dalším deployi
