---
id: ch3-two-tower
type: spine
title: "Architektura dvou věží"
readingTime: 3
standalone: false
teaser: "Jak moderní systémy párují uživatele a položky bleskovou rychlostí pomocí dvou oddělených neuronových sítí."
voice: explorer
parent: null
diagram: diagram-two-tower
recallQ: "Co jsou dvě věže v architektuře dvou věží?"
recallA: "Jedna věž kóduje uživatele (historii, demografii, kontext) a druhá kóduje položky (název, kategorii, obrázek). Obě produkují embeddingy ve stejném prostoru — blízko = dobrý pár."
status: accepted
---

Víš, jak embeddingy mění položky na seznamy čísel a podobné položky skončí blízko sebe. Ale jak najdeš shody pro UŽIVATELE — nejen mezi položkami?

## Dvě oddělené sítě

**Architektura dvou věží** je jeden z nejpopulárnějších designů ve společnostech jako YouTube, Instagram a TikTok. Hlavní myšlenka:

- **Věž uživatelů**: Neuronová síť, která vezme vše o tobě — co jsi sledoval, kdy sleduješ, jaké zařízení používáš — a vytvoří jeden embedding (seznam čísel).
- **Věž položek**: Samostatná neuronová síť, která vezme vše o videu — název, popis, kategorii, náhled — a vytvoří embedding stejné velikosti.

Obě věže produkují vektory ve **stejném prostoru**. Pokud je tvůj uživatelský vektor blízko vektoru videa, systém předpovídá, že se ti bude líbit.

## Proč dvě věže?

Genialita je v oddělení:

1. **Rychlost**: Embeddingy položek se mohou předpočítat a uložit. Když otevřeš aplikaci, jen TVŮJ embedding se musí spočítat nově — pak je to jen hledání nejbližšího souseda v předpřipraveném indexu. Trvá to milisekundy, ne sekundy.

2. **Škálování**: YouTube má 800 milionů videí. Nemůžeš každé zvlášť ohodnotit. Ale MŮŽEŠ prohledat předpřipravený index embeddingů položek a najít nejbližší shody s tvým uživatelským embeddingem.

3. **Reálný čas**: Tvůj uživatelský embedding se mění s každým kliknutím. Embeddingy položek zůstávají stabilní. Takže systém potřebuje aktualizovat jen jednu stranu.

## Jak se to trénuje

Při trénování systém vidí miliony příkladů: „Uživatel A sledoval Video X." Upravuje obě věže tak, aby embedding uživatele a embedding položky skončily blízko sebe pro pozitivní příklady a daleko od sebe pro negativní.

Po natrénování mohou obě věže pracovat nezávisle — proto je to tak rychlé v produkci.

## Kompromis

Modely dvou věží jsou neuvěřitelně rychlé, ale o trochu méně přesné než modely, které se dívají na páry uživatel-položka společně. Proto skutečné systémy používají dvě věže pro počáteční **vyhledávání** (nalezení 500 kandidátů z milionů) a pak přesnější model pro **řazení** (seřazení těch 500).
