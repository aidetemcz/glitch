# Mapa znalostí — aplikace

Interaktivní graf konceptů informatiky (2. stupeň ZŠ). Statická webová appka, nasazuje se samostatně na Vercel.

## Spuštění lokálně

Jakýkoli statický server z kořene repa, např.:

```bash
python3 -m http.server 8000
# → http://localhost:8000/knowledge-map/app/
```

## Struktura

```
app/
├── index.html
├── css/map.css
├── js/
│   ├── map.js            # graf, filtry, detail panel
│   └── vendor/           # Cytoscape.js + js-yaml (lokálně, bez CDN)
└── data/
    └── knowledge-map.yaml  # zdroj pravdy (oblasti + koncepty)
```

Datové schéma a framework: [`../structure.md`](../structure.md).

## Nasazení na Vercel

Samostatný Vercel projekt nad repem `aidetemcz/glitch`:

- **Root Directory:** `knowledge-map/app`
- **Framework Preset:** Other (statické, bez buildu)
- Zdroje `../main-sources/` jsou mimo root, nedeployují se.
