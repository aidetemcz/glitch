---
# 0 Identifikace
id: matematika-nasobeni-310x15
type: rychla-vyzva
title: Násobení 310×15
subject: Matematika
variant: vypocet         # vypocet | slovni-uloha | obrazec
version: "1.0"
trust: core
lang: cs

# 1 Karta ve feedu
card:
  badge: Rychlá výzva
  prompt: "310×15="                                  # velké zadání (glitch_H1)
  question: "Zvládneš spočítat do časového limitu?"  # podotázka (volitelné)
  layout: 2x2                                          # 2x2 | 1xN | row
  timer:
    optIn: true          # vždy opt-in; nikdy se nespouští automaticky

# 1 Odpovědi (právě jedna správná)
answers:
  - { label: "4 650", correct: true }
  - { label: "4 350", correct: false }
  - { label: "4 750", correct: false }
  - { label: "3 950", correct: false }
---

<!--
Rychlá výzva nemá rozklik ani chatbota — dítě vybere odpověď, dostane
okamžitou zpětnou vazbu a scrolluje dál. Tělo je volitelné; slouží jen
redakci (postup řešení, zdroj), uživateli se nezobrazuje.
-->

## Poznámka (redakční, skrytá)

310 × 15 = 310 × 10 + 310 × 5 = 3 100 + 1 550 = **4 650**.
