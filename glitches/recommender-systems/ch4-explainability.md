---
id: ch4-explainability
topic: lepsi
title: Proč mi to TOHLE doporučilo?
teaser: Vidíš náhodný film na vrcholu feedu. Proč? Odpověď je složitější, než si myslíš.
hook: Proč zrovna tohle?
---

Otevřeš Netflix a na první pozici vidíš dokumentář o chobotnicích. Nikdy jsi nic o chobotnicích nesledoval. Proč tam je?

Jedno doporučení může zahrnovat: kolaborativní filtrování, analýzu obsahu, průzkumný algoritmus, obchodní pravidla i filtr rozmanitosti. Který z těchto důvodů byl „skutečný"? Všechny dohromady. Proto „Protože jsi sledoval X" je jen zjednodušená aproximace.

? Proč platformy nemohou plně vysvětlit svá doporučení?
- Ochrana obchodního tajemství — zveřejnění by umožnilo konkurenci kopírovat jejich přístup
* Neuronové sítě kombinují stovky signálů najednou — ani inženýři nedokážou vysledovat, proč padla volba na konkrétní položku
- Vysvětlení by bylo příliš složité a uživatelé by mu stejně nerozuměli
- Algoritmy se mění tak rychle, že každé vysvětlení by bylo zastaralé ještě dříve, než by ho přečetl
! Přesně! Moderní doporučovací systémy jsou příliš složité, aby šlo doporučení plně vysvětlit.

+++
Problém nevysvětlitelnosti AI systémů se nazývá „black box" problém — z vnějšku vidíš vstupy a výstupy, ale ne co se děje uvnitř. Je to celospolečenský problém: soudní systémy v USA používají AI pro předpověď recidivizmu trestanců, ale soudci nedokážou vysvětlit, proč algoritmus konkrétního člověka označil jako rizikového. Banky odmítají půjčky na základě algoritmů, jejichž logiku neumí zákazníkovi vysvětlit. EU proto v AI Actu z roku 2024 zavedla povinnost vysvětlitelnosti pro „high-risk" AI systémy.

Existuje celé výzkumné odvětví věnované vysvětlitelné AI (XAI — Explainable AI). Vědci vyvíjejí techniky, jak zpětně reconstituovat, proč neuronová síť udělala konkrétní rozhodnutí. Jedna z technik se jmenuje LIME — vytvoří zjednodušený model, který chování neuronové sítě lokálně napodobuje a dá se vysvětlit. Není to dokonalé, ale pomáhá. Spotify tyto techniky používá, aby zjistil, která vlastnost písničky nejvíce ovlivnila její doporučení.

Chobotnicový dokumentár na prvním místě feedu je krásný příklad toho, jak doporučovací systém může být „správný" z datového pohledu, ale „záhadný" z uživatelského pohledu. Studie z Colorada ukázala, že uživatelé, kteří chápali (i nepřesně) důvod doporučení, ho sledovali o 27 % víc než ti, kteří nevěděli proč ho algoritmus ukázal. Vysvětlení zvyšuje důvěru a přijetí — i když není technicky přesné.
