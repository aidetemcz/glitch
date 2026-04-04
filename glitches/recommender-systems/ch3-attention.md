---
id: ch3-attention
topic: zpusoby
title: Self-attention — ne každý klik je stejně důležitý
teaser: Proč film, co jsi sledoval včera, je důležitější než ten z před 3 měsíců.
hook: Jenže jak to možné?
---

Za poslední rok jsi zhlédl 500 videí. Má YouTube zacházet se všemi stejně? Kuchařská show z před tří měsíců je mnohem méně relevantní než sci-fi film, co jsi sledoval včera.

Self-attention — stejná technologie jako za ChatGPT — přiřadí každé položce v historii váhu. Nedávné a podobné dostávají velkou váhu, staré a náhodné skoro žádnou. Proto doporučení reaguje na tvoji aktuální náladu.

? Proč doporučovač nezachází se všemi tvými minulými interakcemi stejně?
* Nedávné a kontextově relevantní interakce jsou cennější — self-attention se naučí, na které se zaměřit
- Starší data jsou méně přesná kvůli změnám v katalogu obsahu
- Každý uživatel má jiný limit počtu interakcí, které systém uloží
- Platforma maže starší data kvůli ochraně soukromí
! Přesně! Self-attention přiřazuje různé váhy různým historickým interakcím podle kontextu.

+++
Self-attention je klíčová technologie za GPT-4, Claude a dalšími jazykovými modely — ale původně vznikla pro jiné účely. Transformer architektura, která self-attention využívá, byla publikována v roce 2017 v práci „Attention Is All You Need" od týmu z Googlu. Tehdy ji vynalezli pro překlady textu — a ukázalo se, že funguje skvěle i pro doporučovací systémy, hudební generování, obrazové rozpoznávání a desítky dalších oblastí.

Kontextová váha je fascinující, protože tě systém dokáže „číst" v reálném čase. Pokud otevřeš Spotify v pátek večer a začneš poslouchat energické písničky, algoritmus pochopí, že jsi v „party módu" a váhu tomu přizpůsobí. Pokud v pondělí ráno začneš klidnou lo-fi hudbou, algoritmus pochopí „study session" a nabídne ti podobné. Přitom tvoje celková hudební historie je stejná — mění se jen kontext interpretace.

Nejsilnější dopad self-attention na doporučovací systémy je v sékvenciálním doporučování — tedy situacích, kde záleží na pořadí. Pokud zákazník na Amazonu koupí nejdřív batoh, pak stan, pak karimatku — algoritmus s self-attention rozpozná vzorec „příprava na kempování" a doporučí spacák, i když by jednoduchý systém viděl jen tři nesouvisející produkty.
