---
id: ch3-matrix-factorization
type: spine
title: "Maticová faktorizace: Metoda Netflixu"
readingTime: 4
standalone: false
teaser: "Jak Netflix zkomprimoval miliony hodnocení do skrytých dimenzí vkusu — a proč tato technika vyhrála milionovou cenu."
voice: thinker
parent: null
diagram: diagram-mf-decomposition
recallQ: "Co dělá maticová faktorizace s obrovskou maticí hodnocení?"
recallA: "Rozloží ji na dvě menší matice — jednu pro uživatele a jednu pro položky — každá obsahuje skryté dimenze vkusu. Jejich vynásobením zpět vznikne přibližná rekonstrukce originálu, která vyplní prázdná místa."
status: accepted
---

![Příběh maticové faktorizace](/images/comic-mf.svg)

Představ si, že provozuješ filmovou streamovací službu se 100 miliony uživatelů a 500 000 filmy. Kdybys zapsal hodnocení každého uživatele pro každý film do obrovské tabulky, bylo by to **50 bilionů buněk**. A tady je ten háček: asi 99 % z nich je prázdných. Nikdo nemá čas ohodnotit půl milionu filmů.

Jak tedy předpovíš, jaké hodnocení by někdo dal filmu, který nikdy neviděl?

## Velká myšlenka: Skryté dimenze vkusu

**Maticová faktorizace** říká: zapomeň na tu obrovskou tabulku. Místo toho popiš každého uživatele a každou položku krátkým seznamem skrytých čísel — třeba 50 nebo 100. Těmto skrytým číslům se říká **latentní faktory** a zachycují věci jako:

- „Jak moc má tenhle člověk rád akční filmy?"
- „Jak temný nebo odlehčený obsah preferuje?"
- „Má tahle položka výrazný vizuální styl?"

Nikdo systému neříká, co tyto faktory znamenají. Objeví je sám tím, že se dívá na vzory v hodnoceních. Docela úžasné, ne?

## Jak to funguje

Matematicky vezmeme obrovskou matici hodnocení **R** (uživatelé na jedné straně, položky na druhé) a rozložíme ji na dvě menší matice:

$$R \approx U \times V^T$$

- **U** je matice uživatelů — každý uživatel se stane krátkým vektorem (seznamem čísel)
- **V** je matice položek — každá položka se stane krátkým vektorem stejné délky
- **Vynásob je zpět** a dostaneš přibližnou rekonstrukci R — ale teď jsou prázdné buňky vyplněné předpověďmi!

**Příklad se 2 skrytými faktory:**

Řekněme, že dva skryté faktory zachycují „milovník akce" a „milovník komedií" (systém na to přišel sám, nikdo mu to neřekl).

- Ty = [0,9 akce, 0,2 komedie]
- Film A (Smrtonosná past) = [0,8 akce, 0,1 komedie]
- Předpovězené hodnocení = 0,9 $\times$ 0,8 + 0,2 $\times$ 0,1 = 0,72 + 0,02 = **0,74** z 1 — asi se ti bude líbit!
- Film B (Pařba ve Vegas) = [0,1 akce, 0,9 komedie]
- Předpovězené hodnocení = 0,9 $\times$ 0,1 + 0,2 $\times$ 0,9 = 0,09 + 0,18 = **0,27** — to asi nebude tvůj šálek čaje.

## Učení čísel: ALS

Ale jak systém na ty skryté čísla přijde? Používá algoritmus zvaný **ALS** — Alternating Least Squares (střídavé nejmenší čtverce). Trik je tenhle:

1. **Začni s náhodnými čísly** pro všechny vektory uživatelů a položek
2. **Zafixuj vektory položek** a najdi nejlepší vektory uživatelů (to je přímočarý matematický problém, když je jedna strana fixní!)
3. **Zafixuj vektory uživatelů** a najdi nejlepší vektory položek
4. **Střídej** — překlápěj tam a zpět, dokud se předpovědi nepřestanou zlepšovat

Skutečný vzorec pro aktualizaci vektoru jednoho uživatele vypadá takto:

$$u_i = (V^T V + \lambda I)^{-1} V^T r_i$$

Nepanikař! Tady je, co jednotlivé části znamenají:

- $u_i$ = skrytý vektor vkusu, který hledáme pro uživatele i
- $V$ = všechny vektory položek (které právě držíme fixní)
- $r_i$ = skutečná hodnocení uživatele i
- $\lambda I$ = malý bezpečnostní polštář (za chvíli vysvětlím)

Vzorec v podstatě říká: „Na základě toho, co víme o položkách ($V$) a hodnoceních tohoto uživatele ($r_i$), jaká je nejlepší sada skrytých čísel vkusu pro tohoto uživatele?"

## Proč záleží na $\lambda$ (Regularizace)

To $\lambda$ (lambda) ve vzorci se nazývá **regularizace** a je nesmírně důležitá. Bez ní by se systém mohl zbláznit a snažit se dokonale trefit každé jednotlivé hodnocení — včetně těch podivných, kdy někdo omylem zmáčkl 1 hvězdičku místo 5.

Regularizace říká: „Drž čísla v rozumných mezích. Nepřetrénuj se." Je to jako když učitel řekne: „Řekni mi hlavní myšlenku, ne doslovný opis." Malé $\lambda$ dovolí modelu být přesnější; velké $\lambda$ ho drží opatrnějšího. Najít správnou rovnováhu je součástí umění tvorby doporučovacích systémů.

## Spojení s cenou Netflixu

V roce 2006 Netflix nabídl **1 000 000 dolarů** každému, kdo překoná jejich doporučovací algoritmus o 10 %. Tisíce týmů soutěžily tři roky. Vítězný přístup? Uhádls — sofistikovaná verze maticové faktorizace.

Tým BellKor ukázal, že kombinací maticové faktorizace s dalšími technikami lze dramaticky zlepšit přesnost předpovědí. Tato soutěž dostala maticovou faktorizaci do povědomí a změnila způsob, jakým celý průmysl přemýšlí o doporučování.

## Proč je to stále důležité

I když hluboké učení ovládlo mnoho oblastí umělé inteligence, maticová faktorizace se stále používá všude, protože:

- Je **rychlá** — zvládneš ji spustit na obrovských datasetech
- Je **interpretovatelná** — každý faktor zachycuje něco smysluplného
- Je **ověřená** — desítky let výzkumu a reálného nasazení
- Je **základem** — mnoho moderních přístupů jsou rozšíření této myšlenky

Když slyšíš o „embeddingech" v moderních doporučovacích systémech, jsou to v podstatě potomci maticové faktorizace. Myšlenka reprezentovat uživatele a položky jako krátké vektory ve sdíleném prostoru? To začalo právě tady.
