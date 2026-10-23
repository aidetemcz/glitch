<!-- Přepis dokumentu garanta „Informatické myšlení a algoritmizace" (Google Doc,
     složka garantů, 2026-10-23). Text karet je doslovný; formát je sjednocený pro
     parse v apply_hnizdo_algoritmizace.py:
       # NÁZEV KARTY / ## SEKCE / ### ÚROVEŇ CÍLE / - kritérium
       RVP:  „KÓD :: znění"  = kód a pod ním znění výstupu (jak je v dokumentu)
             „KÓD – text"    = kód s pomlčkou (znění nebo poznámka garanta)
             jiný řádek      = poznámka bez kódu
     Tučné / kurzíva z dokumentu jsou vynechané (mapa je nevykresluje). -->

# ALGORITMUS

## UČIVO

Přesně popsaný postup řešení problému. Algoritmus tvoří kroky, které lze podle daných pravidel provést. Pro jeden problém mohou existovat různé algoritmy.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák vysvětlí, co je algoritmus, a z popsaného algoritmu určí, jaký problém řeší.

### ANALYZOVAT

Žák porovná různé algoritmy řešící stejný problém.

### TVOŘIT

Žák navrhne algoritmus pro řešení konkrétního zadaného problému.

## KRITÉRIA ZVLÁDNUTÍ

- Žák přesně vykoná zadaný algoritmus a dodrží jeho kroky bez vlastních úprav.
- Žák rozpozná různé algoritmy řešící tentýž problém a popíše jejich rozdíly.
- Žák sestaví postup vedoucí k řešení konkrétního zadaného problému.

## RVP

INF-INF-002-ZV5-004 :: Navrhne posloupnost kroků řešení jednoduchého problému.
INF-INF-002-ZV9-005 :: Po přečtení jednotlivých kroků algoritmu vysvětlí celý postup a určí problém, který je daným algoritmem řešení.
INF-INF-002-ZV9-006 :: Rozdělí problém na jednotlivě řešitelné části a navrhne postupy a algoritmy pro jeho řešení.

## DIGITÁLNÍ KOMPETENCE

— bez přímé vazby —

# VLASTNOSTI ALGORITMU

## UČIVO

Aby byl postup algoritmem, musí splňovat určité vlastnosti.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, proč musí algoritmus splňovat určité vlastnosti a jaký mají tyto vlastnosti význam.

### ANALYZOVAT

Žák u konkrétního postupu posoudí, zda splňuje požadované vlastnosti algoritmu, a rozpozná důsledky jejich nesplnění.

## KRITÉRIA ZVLÁDNUTÍ

- Žák rozpozná postup, který nesplňuje některou z požadovaných vlastností algoritmu.
- Své rozhodnutí zdůvodní odkazem na konkrétní nesplněnou vlastnost.

## DŮRAZ

Žák nemusí umět jednotlivé vlastnosti algoritmu vyjmenovat. Důležité je porozumět jejich podstatě a významu.

## RVP

Bez samostatné vazby – konkrétní očekávané výsledky učení budou přiřazeny ke kartám jednotlivých vlastností.

# JEDNOZNAČNOST

## UČIVO

Každý krok algoritmu musí být pro jeho vykonavatele srozumitelný a jednoznačně proveditelný. Stejný postup proto může být pro různé vykonavatele popsán různě podrobně.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že jednoznačnost algoritmu závisí na tom, kdo jej vykonává a jakým pokynům rozumí.

### ANALYZOVAT

Žák posoudí, zda je popis algoritmu pro daného vykonavatele dostatečně jednoznačný.

## KRITÉRIA ZVLÁDNUTÍ

- Žák rozpozná pokyn, který daný vykonavatel nedokáže jednoznačně provést.
- Žák posoudí vhodnou míru podrobnosti algoritmu vzhledem k jeho vykonavateli.
- Žák upraví popis postupu pro vykonavatele s jinými znalostmi nebo schopnostmi.

## RVP

INF-INF-002-ZV9-005 :: Po přečtení jednotlivých kroků algoritmu vysvětlí celý postup a určí problém, který je daným algoritmem řešen.
Charakteristika tematického okruhu: RVP explicitně uvádí práci s omezenou sadou instrukcí, jejich doslovnou interpretací a požadavek na jednoznačný popis postupů.

# KONEČNOST

## UČIVO

Algoritmus řešící úlohu musí po konečném počtu kroků dospět k výsledku. Proces, který má běžet stále, musí mít definovaný způsob, jak jej ukončit.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe význam konečnosti a rozlišuje mezi algoritmem, který má dospět k výsledku, a procesem, který má záměrně běžet stále.

### ANALYZOVAT

Žák u konkrétního postupu posoudí, zda a jak skončí, případně jak lze ukončit trvale běžící proces.

## KRITÉRIA ZVLÁDNUTÍ

- Žák určí, zda a za jakých podmínek postup skončí.
- Rozpozná nežádoucí nekonečné opakování.
- U záměrně trvale běžícího procesu určí způsob jeho ukončení.

## RVP

Bez samostatné přímé vazby

# SPRÁVNOST

## UČIVO

Správný algoritmus při správném provedení řeší zadaný problém. Správnost je potřeba ověřovat.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe rozdíl mezi správným provedením algoritmu a správností samotného algoritmu.

### ANALYZOVAT

Žák ověřuje správnost algoritmu na vhodně zvolených příkladech a hledá případy, pro které algoritmus nefunguje.

## KRITÉRIA ZVLÁDNUTÍ

- Žák ověří výsledek algoritmu na konkrétním příkladu.
- Žák hledá i vstupy, na kterých by se mohla projevit chyba algoritmu.
- Žák rozliší chybu algoritmu od chyby při jeho vykonávání.

## RVP

INF-INF-002-ZV9-008 :: Průběžně ověřuje správnost vytvářeného postupu, zkouší program, opravuje chyby, posoudí efektivitu postupu, programu.

# OBECNOST

## UČIVO

Algoritmus není určen pouze pro jeden konkrétní případ. Je určen pro určitou množinu přípustných vstupů, pro které poskytuje odpovídající výstupy.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že algoritmus nemusí fungovat pro libovolná data, ale pro určitou množinu přípustných vstupů.

### ANALYZOVAT

Žák rozpozná, pro která vstupní data algoritmus funguje a pro která ne, a na základě toho určí množinu přípustných vstupů.

### TVOŘIT

Žák zobecní postup vytvořený pro konkrétní případ tak, aby pracoval s různými přípustnými vstupy.

## KRITÉRIA ZVLÁDNUTÍ

- Žák použije stejný algoritmus pro různé přípustné vstupy.
- Žák na základě testování na vhodně zvolených vstupech zobecní, pro jaké vstupy algoritmus funguje a pro jaké ne.
- Žák upraví konkrétní postup tak, aby jej bylo možné použít pro širší množinu vstupů.

## RVP

Obecnost je obsažena v závazné charakteristice tematického okruhu Algoritmizace a programování

# POSLOUPNOST KROKŮ

## UČIVO

Algoritmus se vykonává krok po kroku v určeném pořadí. Další krok začíná až po dokončení předchozího; vykonavatel pořadí kroků nevolí ani nemění.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že algoritmus se vykonává postupně, krok za krokem, v předepsaném pořadí.

### APLIKOVAT

Žák vykoná zadaný algoritmus přesně v určeném pořadí a každý krok dokončí před zahájením dalšího.

### ANALYZOVAT

Žák posoudí, jak změna pořadí kroků ovlivní průběh nebo výsledek algoritmu.

## KRITÉRIA ZVLÁDNUTÍ

- Žák při vykonávání algoritmu dodržuje pořadí kroků.
- Žák nepřeskakuje kroky ani jejich pořadí svévolně nemění.
- Žák dokončí aktuální krok před přechodem k následujícímu.
- Žák rozpozná situaci, kdy změna pořadí kroků změní výsledek.

## RVP

INF-INF-002-ZV5-004 – Navrhne posloupnost kroků řešení jednoduchého problému.

# ELEMENTÁRNOST KROKU

## UČIVO

Krok algoritmu musí být dostatečně jednoduchý pro jeho vykonavatele, nikoli pro autora algoritmu. Co je elementární krok, závisí na schopnostech a znalostech vykonavatele.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že různí vykonavatelé mohou potřebovat tentýž postup rozdělit na různě podrobné kroky.

### ANALYZOVAT

Žák posoudí, zda je daný krok pro konkrétního vykonavatele elementární.

### TVOŘIT

Žák rozloží příliš složitý krok na jednodušší kroky, které daný vykonavatel dokáže provést.

## KRITÉRIA ZVLÁDNUTÍ

- Žák rozpozná krok, který daný vykonavatel nedokáže přímo provést.
- Žák jej rozloží na jednodušší kroky odpovídající schopnostem vykonavatele.
- Žák při změně vykonavatele přizpůsobí podrobnost postupu.

## RVP

Bez samostatné přímé vazby.

# ROZHODOVÁNÍ

## UČIVO

V posloupnosti kroků může být podmínka, jejíž splnění určuje další postup. Algoritmus musí určovat, co se má dít při splnění i nesplnění podmínky.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že další postup může záviset na tom, zda je podmínka splněna, nebo není.

### APLIKOVAT

Žák správně vykoná algoritmus obsahující podmínku a pokračuje podle jejího výsledku.

### ANALYZOVAT

Žák pro oba možné výsledky podmínky určí, jak bude vykonávání algoritmu pokračovat.

### TVOŘIT

Žák navrhne postup s podmínkou tak, aby bylo určeno pokračování při jejím splnění i nesplnění.

## KRITÉRIA ZVLÁDNUTÍ

- Žák při vykonávání vyhodnotí, zda je podmínka splněna.
- Podle výsledku podmínky pokračuje odpovídajícím způsobem.
- Nesplnění podmínky nepovažuje automaticky za konec algoritmu.
- Při tvorbě algoritmu určí, co následuje při splnění i nesplnění podmínky.

## RVP

Přímá návaznost na práci s větvením programu na 2. stupni (INF-INF-002-ZV9-007).

# OPAKOVÁNÍ

## UČIVO

Některé kroky nebo jejich posloupnost lze vykonávat opakovaně. Počet opakování může být předem určen nebo může záviset na splnění podmínky.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe opakování jako způsob opakovaného vykonávání stejné části algoritmu.

### APLIKOVAT

Žák správně vykoná algoritmus obsahující opakování.

### ANALYZOVAT

Žák určí, která část algoritmu se opakuje a co určuje počet nebo ukončení opakování.

### TVOŘIT

Žák při návrhu algoritmu použije opakování místo opakovaného zápisu stejných kroků.

## KRITÉRIA ZVLÁDNUTÍ

- Žák správně vykoná opakovanou část algoritmu.
- Žák rozpozná část postupu vhodnou k vyjádření opakováním.
- Žák určí, co řídí počet nebo ukončení opakování.
- Žák nahradí opakující se zápis kroků vhodným opakováním.

## RVP

Přímá návaznost na používání opakování v blokově orientovaném programovacím jazyce (INF-INF-002-ZV5-005, INF-INF-002-ZV9-007).

# PROBLÉMOVÁ SITUACE

## UČIVO

Problémová situace je stav, který potřebujeme změnit nebo vyřešit. Nemusí být na první pohled zřejmé, co přesně je třeba řešit ani jakého výsledku chceme dosáhnout.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe rozdíl mezi problémovou situací a již přesně formulovanou úlohou.

### ANALYZOVAT

Žák v problémové situaci rozpozná, co je potřeba vyjasnit, než začne hledat řešení.

## KRITÉRIA ZVLÁDNUTÍ

- Žák rozpozná, že problémová situace nemusí obsahovat hotové zadání.
- Žák pojmenuje, co je potřeba o situaci zjistit nebo vyjasnit před hledáním řešení.

## RVP

Bez samostatného OVU. Řešení problémů je součástí obecného pojetí Informatiky.

# ANALÝZA PROBLÉMU

## UČIVO

Z problémové situace vytváříme jasné zadání úlohy: určujeme, co máme řešit, čeho chceme dosáhnout, co máme k dispozici a jaké podmínky a omezení musí řešení splňovat.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že před hledáním řešení je potřeba problémovou situaci analyzovat a vyjasnit zadání úlohy.

### ANALYZOVAT

Žák z problémové situace vymezí úlohu, kterou je třeba řešit, a určí její cíl, známé skutečnosti, podmínky a omezení.

### TVOŘIT

Žák zformuluje z problémové situace srozumitelné zadání úlohy.

## KRITÉRIA ZVLÁDNUTÍ

- Žák určí, co je třeba vyřešit a jakého výsledku má být dosaženo.
- Žák určí dostupné informace, podmínky a omezení.
- Žák vytvoří zadání, podle kterého lze začít hledat řešení.

## RVP

Přímá obsahová vazba na charakteristiku Informatiky – popis a analýza problému před hledáním jeho řešení.

# ABSTRAKCE

## UČIVO

Při řešení problému se soustředíme na podstatné informace a vlastnosti. Podrobnosti, které řešení neovlivňují, můžeme zanedbat.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že pro řešení problému není nutné pracovat se všemi informacemi o problémové situaci.

### ANALYZOVAT

Žák rozliší informace a vlastnosti podstatné pro řešení od těch, které lze zanedbat.

## KRITÉRIA ZVLÁDNUTÍ

- Žák vybere informace potřebné pro řešení.
- Žák rozpozná informace, které řešení neovlivňují.
- Žák zdůvodní, proč lze určitou informaci při řešení zanedbat.

## RVP

Přímá obsahová vazba – RVP při analýze problému pracuje s rozlišováním podstatných a zanedbatelných aspektů.

# DEKOMPOZICE PROBLÉMU

## UČIVO

Složitější problém lze rozdělit na menší dílčí úlohy. Dílčí úlohy mohou být vzájemně závislé a vyžadovat určité pořadí řešení, nebo mohou být nezávislé a řešitelné současně.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že rozdělení problému na dílčí úlohy usnadňuje jeho řešení a že mezi dílčími úlohami mohou existovat závislosti.

### ANALYZOVAT

Žák rozpozná dílčí úlohy a jejich vzájemné závislosti.

### TVOŘIT

Žák rozdělí problém na menší řešitelné části a navrhne vhodné pořadí jejich řešení; rozpozná části, které lze řešit nezávisle nebo současně.

## KRITÉRIA ZVLÁDNUTÍ

- Žák rozdělí problém na smysluplné dílčí úlohy.
- Žák rozpozná, které dílčí úlohy závisejí na výsledku jiných.
- Žák určí pořadí tam, kde je pořadí řešení nutné.
- Žák rozpozná dílčí úlohy, které lze řešit nezávisle nebo současně.
- Žák propojí výsledky dílčích úloh do řešení původního problému.

## RVP

INF-INF-002-ZV9-006 – Rozdělí problém na jednotlivě řešitelné části a navrhne postupy a algoritmy pro jeho řešení.

# NÁVRH ŘEŠENÍ

## UČIVO

Na základě zadání a analýzy problému hledáme způsob, jak dosáhnout požadovaného výsledku. Jeden problém může mít více možných řešení.

## VZDĚLÁVACÍ CÍLE

### APLIKOVAT

Žák při hledání řešení využívá známé postupy a předchozí zkušenosti.

### TVOŘIT

Žák navrhne řešení, které odpovídá zadání a respektuje stanovené podmínky a omezení.

### ANALYZOVAT

Žák porovná různé návrhy řešení téhož problému.

## KRITÉRIA ZVLÁDNUTÍ

- Žák navrhne alespoň jeden způsob řešení.
- Navržené řešení odpovídá zadání, podmínkám a omezením.
- Žák dokáže hledat a porovnat více možných řešení.

## RVP

INF-INF-002-ZV5-004 – Navrhne posloupnost kroků řešení jednoduchého problému.
INF-INF-002-ZV9-006 – Rozdělí problém na jednotlivě řešitelné části a navrhne postupy a algoritmy pro jeho řešení.

# EFEKTIVITA

## UČIVO

Efektivitu lze posuzovat na různých úrovních. Při návrhu řešení porovnáváme různé způsoby řešení problému. U algoritmu porovnáváme různé algoritmy řešící stejnou úlohu podle času, počtu kroků nebo dalších potřebných zdrojů.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že problém může mít více správných řešení a stejné řešení může být realizováno různě efektivními algoritmy.

### ANALYZOVAT

Žák porovná různá řešení nebo algoritmy podle vhodně zvoleného kritéria efektivity.

### HODNOTIT

Žák podle stanoveného kritéria vybere efektivnější řešení nebo algoritmus a svou volbu zdůvodní.

## KRITÉRIA ZVLÁDNUTÍ

- Žák rozlišuje efektivitu návrhu řešení a efektivitu algoritmu.
- Žák stanoví nebo použije vhodné kritérium pro porovnání.
- Žák porovná dvě řešení nebo dva algoritmy podle stejného kritéria.
- Žák svou volbu efektivnější varianty zdůvodní.

## RVP

INF-INF-002-ZV9-008 – přímá vazba na posuzování efektivity postupu a programu.

# OVĚŘOVÁNÍ ŘEŠENÍ

## UČIVO

Řešení ověřujeme na různých vhodně zvolených vstupech a porovnáváme získané výstupy s očekávanými. Nestačí ověřovat pouze běžné případy – důležité jsou i méně obvyklé a hraniční vstupy. Po úpravě je potřeba znovu ověřit celé řešení, protože změna může ovlivnit i jeho další části.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že úspěšné ověření několika běžných případů ještě nezaručuje správnost řešení.

### APLIKOVAT

Žák ověří řešení na různých vstupech a porovná skutečný výstup s očekávaným.

### ANALYZOVAT

Žák cíleně volí vstupy, které mohou odhalit chybu nebo omezení řešení, a podle výsledků rozliší, zda je potřeba řešení opravit, nebo zpřesnit množinu přípustných vstupů.

## KRITÉRIA ZVLÁDNUTÍ

- Žák neověřuje řešení pouze na typických případech.
- Žák volí také méně obvyklé a hraniční vstupy.
- Pro zvolený vstup určí očekávaný výstup a porovná jej se skutečným.
- Při neúspěšném ověření rozlišuje mezi chybou řešení a vstupem, pro který řešení není určeno.
- Po úpravě znovu ověří nejen upravenou část, ale také řešení jako celek.

## DŮRAZ

Autor řešení nemusí odhalit všechny problémy. Je-li řešení určeno dalším uživatelům, je vhodné ověřit je také na cílové skupině.

## RVP

INF-INF-002-ZV9-008 – Průběžně ověřuje správnost vytvářeného postupu, zkouší program, opravuje chyby, posoudí efektivitu postupu, programu.

# HLEDÁNÍ A OPRAVA CHYB

## UČIVO

Pokud řešení nefunguje podle očekávání, hledáme místo a příčinu chyby, chybu opravíme a řešení znovu ověříme. Při hledání chyby nám může pomoci sledování průběhu řešení i vhodná volba vstupních dat.

## VZDĚLÁVACÍ CÍLE

### POROZUMĚT

Žák chápe, že nalezení chyby znamená zjistit nejen kde se chyba projevila, ale také její příčinu.

### APLIKOVAT

Žák u jednoduchého chybného řešení vyhledá chybu, opraví ji a řešení znovu ověří.

### ANALYZOVAT

Žák hledá místo a příčinu chyby pomocí sledování průběhu řešení a vhodně zvolených vstupních dat.

## KRITÉRIA ZVLÁDNUTÍ

- Žák hledá místo, kde se průběh řešení začne lišit od očekávaného.
- Žák volí vstupní data tak, aby mu pomohla chybu lokalizovat.
- Žák hledá příčinu chyby, ne pouze její projev.
- Žák provede opravu a následně ověří, zda chyba skutečně zmizela.

## DŮRAZ

Oprava chyby není dokončena samotnou změnou řešení. Po opravě je nutné řešení znovu ověřit.

## RVP

INF-INF-002-ZV5-005 – Sestaví v blokově orientovaném jazyce program, ve kterém používá opakování a podprogramy, opraví případné chyby.
INF-INF-002-ZV9-008 – Průběžně ověřuje správnost vytvářeného postupu, zkouší program, opravuje chyby, posoudí efektivitu postupu, programu.
