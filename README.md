## Authors
- [Roman Machala](https://github.com/RomanMachala), xmacha86
## Osobní hodnocení předmětu
Za mě je předmět určitě zajímavý. Dozvíte se poměrně hodně informací jednak o skutečném postupu vývoje UI, ale taky si je i vyzkoušíte. Přednášky jsem navštěvoval pouze do doby, dokud byla cvičení, potom už mi přišla poměrně k ničemu. Cvičení byla za mě super a taky skvěle ohodnocena (za každé cvičení je 5 bodů). Je zde týmový projekt, který si sami musíte navrhnout a zrealizovat. Hodně uslyšíte špatnou zpětnou vazbu na garanta předmětu, že hodnotí podle toho jak se vyspal atd. Z osobní zkušenosti vím, že může být trošku přísnější a semtam mi přišlo, že někomu něco vytkl a druhým to stejné pochválil, nicméně všechno záleží na okolnostech a v jakém kontextu dané věci jsou. Nicméně dle mého to není pravda. Možná semtam někdo dostane trošku horší zpětnou vazbu, ale ve výsledku se docent Beran snaží dělat první poslední pro to, aby všichni prošli, o tom vypovídá i úspěšnost tohoto předmětu, která je poměrně vysoká. Pokud se vyloženě na projekt nevyserete, tak není možnost tento předmět nedat. Docent Beran a všichni cvičící jsou ochotni s Vámi prodiskutovat cokoli a jsou ochotni Vám poradit, stačí si jen říci. V rámci projektu se ještě zúčastníte pitch prezentace, kde odprezentujete svůj návrh před implementací, dostanete zpětnou vazbu (jestli je počet interakcí uživatele dostačující, nebo jestli máte ještě něco přidat), což je fajn, protože potom do implementace jdete s tím, že víte, pokud uděláte alespoň trošku funkční aplikaci, tak máte předmět v kapse. Finálem je potom obhajoba, kde jen přednesete své řešení, popřípadě se Vás na něco doptají, aby věděli, že tomu rozumíte. Projekt jste mohli odevzdat i po termínu odevzdání s bodovou srážkou 5-ti bodů za každý den. Na obhajobě se objevili jedinci, kteří potřebovali získat ***30b/33b*** a ještě k tomu pozdě odevzdali projekt, tedy potřebovali dostat ***30b/28b***. I v tomto případě si docent Beran zavolal tento tým po obhajobách, aby s nimi prodiskutoval možnosti. Nedostatečná realizace aplikací dostala ještě možnost dodělání aplikace po obhajobách a následné znovu obhajoby upravené verze. Ve výsledku hodnotím předmět velmi pozitivně, především středně velký projekt a možnost si projekt vymyslet do posledního detailu. 
## Slovo úvodem
- na základě zpětné vazby pitch prezentace jsme se jako tým dohodli na tvorbě 2 verzí aplikace
- z tohoto důvodu je tato verze pouze mým dílem
## Postup instalace aplikace
- na https://github.com/RomanMachala/ITU se nachází instalační soubor pro android zařízení
- tento soubor stačí stáhnout do Vašeho zařízení a poté spustit instalaci
## Použité Knihovny a jejich Licence

- **@react-navigation/native**
  - **Účel**: Poskytuje navigační funkce pro React Native aplikace.
  - **Licence**: MIT

- **@react-navigation/bottom-tabs**
  - **Účel**: Umožňuje vytvoření navigace pomocí záložek na spodní části obrazovky pro React Native aplikace.
  - **Licence**: MIT

- **react-native-vector-icons/Ionicons**
  - **Účel**: Nabízí širokou škálu ikon pro použití v React Native aplikacích.
  - **Licence**: MIT

- **react-native**
  - **Účel**: Hlavní knihovna pro vytváření nativních mobilních aplikací pomocí JavaScriptu a Reactu.
  - **Licence**: MIT

- **@react-native-async-storage/async-storage**
  - **Účel**: Asynchronní, trvalé, klíč-hodnota úložiště systému pro React Native.
  - **Licence**: MIT
## Hodnocení projektu 

 ### Návrh aplikace ***22b/22b***
 Zpráva přidělena k hodnocení:
- ***Technická zpráva: 6b/6b***
  Technická správa má veľmi kvalitnú prezentačnú úroveň, je v rozumnom rozsahu a je kvalitná ako po gramatickej tak po         typografickej stránke. Obrázky majú dobrú kvalitu, výstižné popisky a sú i referované v texte. Práca na návrhu aplikácie     je podporená informatívnymi diagramami.

- ***Návrh uživatelského rozhraní a architektury aplikace: 10b/10b***
  Autori prezentujú návrh aplikácie spájajúcej to-do list s rozvrhom/kalendárom, s primárnou (no nie nutne jedinou) cieľovou   skupinou vo forme študentov. Primárna cieľová skupina aplikácie je rozumne odzrkadlená i pri prieskume užívateľských         potrieb, kde sa teamu podarilo získať odpovede od pomerne veľkého počtu respondentov (100). Prieskum pozostáva z             rozsiahleho dotazníku, ktorý využíval každý člen teamu. Rozdelenie práce teda spočívalo v analýze odpovedí od disjunkných    podčastí respondentov a v tech. správe je jasne vymedzený rozsah práce každého člena teamu. Z užívateľského prieskumu sú     vyvodené konkrétne nápady pre návrh aplikácie. Analýza existujúcich riešení (TimeTune, Google Calendar a Simple Calendar)    je kvalitne spracovaná pri každom členovi teamu. Prednosti i nedostatky sú zhodnotené jednak v rovine funkčnosti i           užívateľského rozhrania. Samotný návrh je na veľmi vysokej úrovni. Využíva systém Person, prezentuje kvalitne spracované     makety, jasne vymedzuje rámec práce jednotlivých členov, jasne prezentuje výsledný návrh a obecne je pripravený naozaj       kvalitne. Jediná výhrada je to, že sa zbytočne v správe vyskytuje obecný popis MVC. Ešte jedna poznámka: zvážil by som       rozšírenie funkcionality o nejaký ďalší interaktívny prvok s GUI, kde by sa nejak manipulovalo s datami a rozšírila sa tak   funkcionalita aplikácie.

- ***Testování: 6b/6b***
  Aplikácia vo forme makiet bola testovaná ako celok a nie po jednotlivých častiach odpovedajúcim práci jednotlivých členov    teamu, pričom každý člen teamu evaluoval kroky vrámci jeho podčasti. Testovanie je na dobrej úrovni, s jasne definovaným     počtom respondentov a ich charakteristikou. Vyhodnotenie bolo vykonané na rozumných testovacích metrikách, sú prezentované   súhrnné výsledky i konrétne návrhy na zlepšenie aplikácie študentov.
 ### Implementace aplikace ***29b/33b***
   Zpráva přidělena k hodnocení:
- ***Implementace: 29b/33b***
  Implementace správy ToDo pomocí technologie React. Implementace technicky správná, rozsahem standardní. Implementace         samostatná od zbytku týmu. GUI stručné, ale jasné a efektivní.
  Student implementoval vlastní mobilní aplikaci pro ToDo list a kalendář. Rozsah implementace je standardní. Kód není         příliš členěný - vše je prakticky ve dvou souborech, které odpovídají dvěma obrazovkám. V těchto souborech jsou dohromady    jak View tak i Controller. Kaskádové styly by také měly být odděleny od definice prvků na stránce.

 
