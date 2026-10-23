# Editor konceptů v Mapě — spec pro Claude Code (export do MD)

Zadání pro jiného Claude Code: postav **klientský (bez backendu) editor** do statické
aplikace „Mapa informatických konceptů" (Cytoscape.js). Funguje stejně jako náš
původní editor, jen **místo exportu jednoho YAML souboru exportuje Markdown soubory**
(jeden koncept = jeden `.md` s YAML frontmatterem).

## 1) Princip (žádný backend)

- Aplikace je statická: data se **fetchnou ze souboru/ů**, rozparsují a vykreslí do grafu.
- Editor je čistě **klientský**:
  1. přihlášení = jen **UI brána** (ne skutečná ochrana),
  2. úpravy se drží v **localStorage** jako „překryvy" nad načtenými daty,
  3. **export** vygeneruje upravená data jako **MD soubory**,
  4. editorka je pak **ručně commitne na GitHub** → GitHub je **zdroj pravdy** → deploy → vidí všichni.
- Odpovídá to na otázku „jde to bez Supabase?" → **ano**, tímhle způsobem.

## 2) Datový model — MD místo YAML

Každý koncept = 1 soubor `data/koncepty/{id}.md` s frontmatterem:

```markdown
---
id: sit-lan
nazev: Lokální síť (LAN)
stav: Draft            # Draft | Hotovo
rocnik: 7
kompetence: [algoritmizace, digitalni-technologie]
tagy: [sítě, hardware]
cile: ["Vysvětlí, k čemu slouží LAN", "Rozliší LAN a WAN"]
kriteria: ["Popíše 2 příklady využití", "Nakreslí schéma"]
navazuje_na: [internet-zaklady]
---

Volný markdown popis konceptu (může být víceřádkový).
```

- Frontmatter = metadata (to, co bylo dřív v YAML uzlu). Tělo = popis.
- **Pozor na načítání:** statický web neumí listovat adresář. Zvol jednu variantu:
  - **A (nejjednodušší, doporučeno):** jeden **manifest** `data/koncepty/index.json` se seznamem `id`/cest; app ho načte a pak dotáhne jednotlivé `.md`.
  - **B:** build krok (Python/Node), který MD soubory poskládá do jednoho JSON/MD, který app načítá (jako dřív jeden YAML).
  - Export do samostatných `.md` (bod 5) funguje u obou.

Parsování frontmatteru na klientu: odděl blok mezi prvními `---` a zbytek jako tělo;
hlavičku prožeň přes **js-yaml** (`jsyaml.load`).

```js
function parseMd(text){
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if(!m) return { meta:{}, body:text.trim() };
  return { meta: jsyaml.load(m[1]) || {}, body: (m[2]||"").trim() };
}
```

## 3) Přihlášení (klientská brána)

- Tlačítko **„Admin"** dole v panelu „O mapě".
- Modal: login `aidetem`, heslo.
- Ověření: **SHA-256(hesla)** přes Web Crypto, porovnat s konstantou `ADMIN_HASH`
  (hash vygeneruj předem a vlož do kódu — heslo v kódu nikdy).
- Po úspěchu `isAdmin = true` (ulož do `sessionStorage`), odemkni editační UI.

```js
const ADMIN_USER = "aidetem";
const ADMIN_HASH = "…64 hex znaků… (SHA-256 hesla)";

async function sha256hex(s){
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,"0")).join("");
}
async function tryLogin(user, pass){
  return user === ADMIN_USER && (await sha256hex(pass)) === ADMIN_HASH;
}
```

> **Bezpečnostní poznámka (napiš ji uživateli):** tohle je jen **UI brána** — hash je
> v klientovi, technicky obejitelný. Skutečnou ochranu dělá to, že trvalá změna
> vyžaduje **commit na GitHub**; anonym v prohlížeči nic trvale nezmění.

## 4) Editace konceptu

- V admin režimu **klik na uzel** → panel/modal s poli: `nazev`, `stav`, `rocnik`,
  `kompetence`, `tagy`, `cile`, `kriteria`, `popis`.
- **Uložit**:
  1. slouč změny do objektu konceptu,
  2. **stav `Draft` → `Hotovo`** (pokud byl Draft),
  3. zapiš do localStorage překryvů (klíč = `id` konceptu),
  4. překresli graf (uzel dostane štítek `Hotovo`).

## 5) Lokální překryvy (bez serveru)

- Klíč `km_overrides` v localStorage = `{ [id]: {změněná pole} }`.
- Při renderu **merge**: `koncept = { ...zData, ...override[id] }`. Úpravy tak přežijí reload.

## 6) Export do MD — **klíčová změna oproti originálu**

Původně: „Exportovat" → `jsyaml.dump(celáData)` → stáhne jeden `.yaml`.
Nově: „Exportovat" → pro **každý změněný** koncept vygeneruj `.md` (frontmatter + popis).

```js
function conceptToMd(c){
  const fm = jsyaml.dump({
    id:c.id, nazev:c.nazev, stav:c.stav, rocnik:c.rocnik,
    kompetence:c.kompetence, tagy:c.tagy, cile:c.cile,
    kriteria:c.kriteria, navazuje_na:c.navazuje_na
  }).trimEnd();
  return `---\n${fm}\n---\n\n${(c.popis||"").trim()}\n`;
}

function download(name, text){
  const url = URL.createObjectURL(new Blob([text], {type:"text/markdown"}));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
```

Stažení více souborů (vyber):
- **ZIP** přes JSZip (jeden `.md` na koncept) — nejčistší pro víc změn,
- jednotlivé `.md` (více download promptů) — OK pro pár změn,
- textarea s obsahem ke zkopírování — fallback.

Doporučení: exportuj **jen změněné** koncepty (podle klíčů v `km_overrides`) →
míň souborů. Cílová cesta pro commit: `data/koncepty/{id}.md`.
(Pokud používáš manifest z bodu 2A, přidej nové `id` i do `index.json`.)

## 7) Zahodit lokální úpravy

- Tlačítko **„Zahodit lokální úpravy"**: `localStorage.removeItem("km_overrides")` + reload
  → zpět na verzi z GitHubu (zdroj pravdy). Používá se po commitnutí exportu.

## 8) Celý tok (zdroj pravdy = GitHub)

1. Přihlásím se (admin) → upravím koncepty (drží se v localStorage).
2. **Exportuji MD** změněných konceptů.
3. Commitnu je do `data/koncepty/` na GitHub → deploy → vidí všichni.
4. Po commitnutí dám **„Zahodit lokální úpravy"** (data už jsou ve zdroji).

## 9) Úskalí

- **Listování adresáře** statický web neumí → potřebuješ manifest (`index.json`) nebo build krok (bod 2).
- **Frontmatter serializace**: hodnoty s dvojtečkou/uvozovkami nech na js-yaml `dump` (neskládej ručně).
- **Hash hesla** vygeneruj předem (`echo -n 'heslo' | shasum -a 256`) a vlož jako konstantu.
- **Klient-only bezpečnost**: nikdy do klienta nedávej nic citlivého kromě hashe; zápis = jen přes GitHub.
