# Web — glitch.tiny.school

Prezentační splash pro Glitch. Statická stránka, nasazuje se samostatně na Vercel.

## Spuštění lokálně

```bash
# z kořene repa
python3 -m http.server 8000
# → http://localhost:8000/web/
```

## Struktura

```
web/
├── index.html        # splash
└── glitch-logo.svg   # logo (lokální kopie, aby byl web soběstačný)
```

## Nasazení na Vercel

Samostatný Vercel projekt nad repem `aidetemcz/glitch`:

- **Root Directory:** `web`
- **Framework Preset:** Other (statické, bez buildu)
- **Doména:** `glitch.tiny.school` (CNAME → `cname.vercel-dns.com` v Route 53)
