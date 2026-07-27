---
# 0 Identifikace
id: dechove-cviceni
type: wellbeing
subtype: breathing        # mood_selector | breathing | attention_game
title: Dechové cvičení
version: "1.0"
trust: core
lang: cs

# 1 Karta ve feedu
card:
  badge: Wellbeing
  heading: Dechové cvičení
  text: "Rovnoměrné vědomé dýchání ti může pomoci zlepšit soustředění."

# 2 Konfigurace aktivity (dle subtype)
config:
  cycles: 7                                # výchozí počet nádechů (dítě mění −/+)
  phases: { inhale: 4, hold: 2, exhale: 4 }  # délky fází v sekundách
  hint: "Pohodlně se usaď a stiskni tlačítko začít."
  cta: "Začít"
---

<!--
Wellbeing karta je interaktivní, bez chatbota. Zásady (neporušovat):
- časovače a odpočty jsou vždy opt-in, nikdy automatické;
- žádné srovnávání mezi žáky;
- emoční data se neukládají jako signál pro doporučování.
Tělo je volitelné (redakční poznámky).
-->
