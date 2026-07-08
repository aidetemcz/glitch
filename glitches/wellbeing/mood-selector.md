---
# 0 Identifikace
id: mood-selector
type: wellbeing
subtype: mood_selector
title: Jak se teď cítíš?
version: "1.0"
trust: core
lang: cs

# 1 Karta ve feedu
card:
  badge: Wellbeing
  heading: Jak se teď cítíš?
  text: >-
    Umísti potažením černou tečku na správné místo v diagramu. My podle toho
    upravíme Glitche, které se ti dnes zobrazí.

# 2 Konfigurace aktivity
config:
  axisX: SOUSTŘEDĚNÍ       # 0–100
  axisY: ENERGIE           # 0–100
  savesTo: mood            # uložená hodnota (x, y) personalizuje výběr Glitchů pro daný den
---

<!--
Mood selector je denní check-in. Uložená hodnota ovlivní výběr Glitchů.
Zásady: žádné srovnávání; emoční data se neukládají jako veřejný signál.
-->
