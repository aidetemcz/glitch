---
id: ch3-pipeline-d-exp
type: spine
title: "Sleduj skutečné doporučení na YouTube"
readingTime: 3
standalone: false
teaser: "Sleduj jedno doporučení od okamžiku, kdy otevřeš aplikaci, až po chvíli, kdy se zobrazí na obrazovce."
voice: explorer
parent: null
diagram: null
recallQ: "Jak YouTube najde 20 videí z 800 milionů za 0,2 sekundy?"
recallA: "Doporučovací pipeline! Rychlé hrubé filtry zúží 800 milionů na 500 kandidátů, pak pečlivé seřazení vybere nejlepších 20."
status: accepted
---

Pojďme přesně sledovat, co se děje od okamžiku, kdy klepneš na aplikaci YouTube, až do chvíle, kdy se doporučení zobrazí na domovské obrazovce. Celé to proběhne za méně než jednu sekundu.

## 0,0 sekundy: Otevřeš aplikaci

Klepneš na ikonu YouTube. Tvůj telefon pošle dotaz na servery YouTube: „Hej, tento uživatel právě otevřel aplikaci. Co mu máme ukázat?"

Servery vědí, kdo jsi. Okamžitě vytáhnou tvůj profil.

## 0,1 sekundy: Rychlý přehled tvého profilu

Systém rychle shrne, kdo jsi:

- **Posledních 10 sledovaných videí**: 6 bylo o Minecraftu, 2 o vtipných zvířatech, 1 byl vědecký pokus, 1 byl hudební videoklip
- **Čas**: Je 16:00 v sobotu (o víkendech obvykle sleduješ delší videa)
- **Nedávná vyhledávání**: „minecraft hrad návod", „nejlepší redstone stavby"
- **Odběry**: 3 Minecraft kanály, 2 herní kanály, 1 vědecký kanál

## 0,2 sekundy: NAJDI — Hoď síť

Systém spustí více vyhledávání najednou:

- **Kolaborativní**: „Uživatelé s podobnou historií sledovali tyto..." — přinese 200 kandidátů
- **Filtrování podle obsahu**: „Videa podobná tvým posledním 10..." — přinese 150 kandidátů
- **Odběry**: „Nové nahrávky kanálů, které sleduješ" — přinese 30 kandidátů
- **Trending**: „Populární videa ve tvém regionu" — přinese 50 kandidátů
- **Průzkum**: „Náhodně slibná videa, která bys mohl objevit" — přinese 70 kandidátů

Celkem: přibližně **500 kandidátů** sebraných za zlomek sekundy.

## 0,4 sekundy: SEŘAĎ — Ohodnoť vše

Teď každé z těch 500 videí dostane skóre. Systém předpoví:

| Video | Šance na kliknutí | Čas sledování | Šance na lajk | Celkové skóre |
|---|---|---|---|---|
| Minecraft mega stavba | 85 % | 12 min | 70 % | 0,94 |
| Kompilace vtipných koček | 60 % | 4 min | 50 % | 0,71 |
| Nový redstone návod | 75 % | 8 min | 65 % | 0,82 |
| Vědecký pokus s sopkou | 40 % | 6 min | 45 % | 0,55 |
| Trending pop videoklip | 30 % | 3 min | 20 % | 0,38 |
| ... | ... | ... | ... | ... |

Přesný vzorec je tajný, ale kombinuje pravděpodobnost kliknutí, očekávaný čas sledování a pravděpodobnost pozitivní reakce.

## 0,7 sekundy: ZKONTROLUJ — Závěrečné úpravy

Top 30 videí podle skóre projde závěrečnými kontrolami:

- 8 z top 10 je o Minecraftu? Vyměň některé za rozmanitost. Nech 4 Minecraft, přidej video s kočkou, vědecké video, nové herní video a překvapení.
- Ten redstone návod jsi sledoval včera? Odstraň ho.
- Jedno video má 45 minut? Možná ho ulož na jindy. Ukaž mix krátkých a středně dlouhých videí.
- Vše věkově vhodné? Zkontroluj.

## 0,9 sekundy: DORUČENÍ

Finálních 20 videí se zobrazí na tvoji domovskou obrazovku. Načtou se miniatury. Vidíš:

1. Minecraft mega hrad (nejlepší shoda)
2. Nové video z odebíraného kanálu
3. Kompilace vtipných koček
4. Redstone návod (jiný než včerejší)
5. Vědecký pokus
6. ...a 15 dalších pečlivě vybraných videí

Klepneš na první bez váhání. Systém to trefil.

## Ta úžasná část

Celý tento proces — od otevření aplikace po zobrazení doporučení — trval méně než jednu sekundu. A neproběhl jen pro tebe, ale pro **2 miliardy dalších lidí**, kteří YouTube používají ve stejnou chvíli.

To je inženýrství za tou „jednoduchou" domovskou obrazovkou, kterou vidíš každý den. Tak jednoduchá zase není.
