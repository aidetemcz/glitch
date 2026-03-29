# Changelog

## v1.0.0-cs (2026-03-29)

Česká verze p-book standardu a knihy „Jak funguje doporučování online?"

### Obsah
- 86+ obsahových bloků v 6 kapitolách — kompletně v češtině
- 35 základních bloků (nutných pro certifikát), 51 hloubkových bloků
- 8 interaktivních miniher (třídění signálů, hledání dvojníka vkusu, praskni bublinu, sestav pipeline, studený start, poznej metodu, soudce A/B testu, hlídač soukromí)
- 5 interaktivních otázek s personalizovanou zpětnou vazbou
- 68 otázek pro rozložené opakování (kartičky) v češtině
- „Věděl/a jsi?" zajímavosti u klíčových článků

### Nové články (oproti EN v1.0)
- **Maticová faktorizace** — rozklad obří matice, ALS algoritmus, Netflix Prize
- **Self-attention** — proč včerejší klik je důležitější než ten z před 3 měsíců, transformery
- **Architektura dvou věží** — jak YouTube páruje uživatele a videa v milisekundách
- **Explicitní vs. implicitní zpětná vazba** — proč systémy věří víc tomu, co děláš, než co říkáš
- **Matematika za doporučováním** — kosinová podobnost, nDCG, ALS vzorec

### České reálie a příklady
- **Seznam.cz** — personalizace obsahu na homepage pro nepřihlášené uživatele ([blog](https://blog.seznam.cz/2022/08/personalizace-obsahu-jak-doporucujeme-clanky-neprihlasenym-uzivatelum/))
- **Glami** — nasazení AI doporučování v módním e-commerce, A/B testování za 15 minut místo týdnů ([CC.cz](https://cc.cz/co-predtim-zabralo-tydny-ted-testujeme-za-15-minut-rika-sef-glami-na-ai-vsadili-pred-peti-lety/))
- **FTV Prima** — personalizace video obsahu pomocí Recombee ([case study](https://www.recombee.com/case-studies/ftv-prima-content))
- **Rohlík** — doporučování potravin na základě nákupní historie
- **Mall.cz** — jako příklad českého e-commerce s doporučováním (místo Amazon)
- České firmy zmíněny v kariérní sekci (Recombee, Seznam, Rohlík)
- Lokalizované příklady: Prasátko Peppa, ČVUT, Déčko

### Režimy čtení
- **Mise** — 7 příběhových vzdělávacích cest s větvením, průvodcem a boss kvízem
- **Procházet** — Netflix-style domovská stránka s personalizovanými policemi
- **Číst** — nekonečný scroll s kapitolami
- **Mapa** — vizuální přehled + detailní seznam se značkami
- **Kvíz** — kartičky s chytrým opakováním (SM-2 algoritmus)
- **Tutor** — AI asistent (mock engine, připravený pro LLM)

### Funkce
- Gamifikace: XP, úrovně, 16 odznaků (české názvy), certifikát (SVG ke stažení)
- Rozložené opakování: kartičky ve stylu Anki s SM-2 algoritmem
  - Intervaly: Snadné → 3 dny, Dobře → 1 den, Těžké → 1 den, Zapomněl → 4 hodiny
  - Kartičky v kvíz záložce, Netflix pohledu i přímo u bloků (ikona 🧠)
- Personalizace: doporučení poháněná Recombee s 5 scénáři
- 3 hlasy čtení: Průzkumník, Tvůrce, Myslitel
- Oblak znalostí s českými termíny (32 konceptů)
- Uživatelské účty s přihlášením a synchronizací mezi zařízeními
- Offline podpora: Service Worker pre-cachuje celou knihu
- Aktivitní heatmap na profilu (styl GitHub)
- Hledání: lokální full-text + Recombee (funguje i offline)
- Výzkumná analytika: sledování interakcí po módech

### Ilustrace
- 28 SVG obrázků — přeložené texty do češtiny
- 3 komiksy (kolaborativní filtrování, banditi, maticová faktorizace)
- 13 technických diagramů (pipeline, embeddingy, attention, dvě věže, stakeholders...)
- 10 dětských ilustrací (digitální stopy, filtrační bublina, tři úkoly...)

### Infrastruktura
- Kolaborativní workflow přes GitHub (CI validace, status pole, issue šablony)
- Vercel + Netlify deployment se serverless proxy (Recombee, Supabase)
- Lokální dev server s proxy (serve-local.js)
- Bot/LLM rozhraní: .well-known/pbook.json, llms.txt, sitemap.xml
- Feature toggles: gamifikace, personalizace, opakování, mise, hry, AI shrnutí — vše volitelné
- SEO: Open Graph, Twitter Card, JSON-LD structured data, robots.txt pro AI crawlery

### Technické
- Nulové závislosti (vanilla JS, žádný framework)
- Funguje bez Recombee i Supabase (lokální fallbacky)
- Obsah jako markdown s YAML frontmatter
- Hry jako malé JSON datové soubory
- SVG diagramy s podporou matematiky (KaTeX)
- Sdílená Recombee DB s EN verzí — čeští a angličtí uživatelé se vzájemně obohacují
