# Juridische Briefing — IDidHere
**Ter attentie van:** Timelex / DLA Piper België
**Van:** Perry Smit — Goosie Labs (https://goosielabs.com)
**Datum:** Mei 2026

---

## Wat is IDidHere?

IDidHere is een open source applicatie gebouwd op het Nostr protocol en het Bitcoin Lightning Network. De app stelt gebruikers in staat om locaties te ontdekken, daar fysiek naartoe te gaan, en dat bewijs op te slaan als een ondertekend digitaal bericht op een gedecentraliseerd netwerk.

**Kernprincipes:**
- Perry (de bouwer) beheert op geen enkel moment andermans geld of sleutels
- Betalingen lopen rechtstreeks tussen gebruikers via het Lightning Network — peer to peer
- De app is open source — geen commercieel bedrijf, geen winstoogmerk
- Gebruikers beheren hun eigen cryptografische sleutels en wallets

---

## Technische context — vereist voor de juridische analyse

**Nostr** is een gedecentraliseerd communicatieprotocol waarbij elke gebruiker wordt geïdentificeerd door een cryptografische sleutel. Berichten worden ondertekend en opgeslagen op gedecentraliseerde servers (relays).

**Bitcoin Lightning Network** is een gedecentraliseerd betalingsnetwerk bovenop Bitcoin. Betalingen gaan direct van persoon naar persoon zonder tussenpersoon. Er is geen centrale partij die fondsen beheert.

**NIP-57 Zaps** zijn Lightning betalingen gekoppeld aan Nostr berichten. Als gebruiker A een tip van gebruiker B waardevol vindt, stuurt A direct sats naar B's Lightning adres. Perry faciliteert deze verbinding technisch maar beheert op geen enkel moment de fondsen.

**NIP-75 Zap Goals** zijn Lightning betalingen met een voorwaarde — vergelijkbaar met een escrow. Als Travy bewijst dat hij ergens is geweest gaan de sats naar hem. Zo niet, gaan ze terug naar de inzetter. Dit loopt via het Lightning Network zelf — niet via Perry.

---

## Juridische vraag 1 — Platformcommissie of betaaldienst?

### Situatie
Perry ontvangt donaties via een zichtbaar Lightning adres in de app. Gebruikers zappen vrijwillig naar Perry als waardering voor het bouwen van het systeem. Er is geen automatische splitsing of commissie — alleen een vrijwillige donatie knop.

Daarnaast ontvangt Perry zaps als actieve gebruiker van zijn eigen systeem — hij plaatst tips als Tippy en installeert verificatiepunten als Stamper. Die betalingen gaan rechtstreeks naar zijn eigen Lightning wallet.

### Vraag
Valt het ontvangen van vrijwillige Lightning donaties als open source bouwer, en het ontvangen van directe betalingen als actieve gebruiker van een gedecentraliseerd protocol, onder de definitie van een **betaaldienst of CASP activiteit** onder MiCA (Verordening EU 2023/1114) of PSD2/PSD3 in België?

### Relevante context
- Perry beheert op geen enkel moment andermans fondsen
- Er is geen escrow, geen bewaring, geen doorsturen van betalingen
- De betalingen lopen via het Lightning Network — volledig peer to peer
- Perry's rol is vergelijkbaar met een freelancer die betaald wordt via Bitcoin

---

## Juridische vraag 2 — Slapende accounts en onbeheerd vermogen

### Situatie
IDidHere maakt automatisch slapende Nostr accounts aan voor horecagelegenheden op basis van OpenStreetMap data. Als een gebruiker (Travy) incheckt bij zo'n locatie en een zap stuurt, gaat die betaling naar het Lightning adres van dat slapende account.

De eigenaar van de horecagelegenheid weet dit aanvankelijk niet. Hij kan het account claimen via een verificatieproces.

**Belangrijk technisch detail:** Er staan geen sats vast in een account dat Perry beheert. De zap gaat via een **time-locked Lightning HTLC** — als de horecaeigenaar niet claimt binnen 6 maanden gaan de sats automatisch terug naar de zapper. Perry heeft op geen enkel moment toegang tot die sats.

### Vraag
Valt het technisch faciliteren van een time-locked Lightning betaling naar een slapend Nostr account — waarbij Perry geen toegang heeft tot de fondsen en de sats automatisch terugkeren bij niet-claim — onder de definitie van **beheer van andermans vermogen** of **betaaldienstverlening** onder Belgisch recht of MiCA?

### Aanvullende vraag
Is er een juridisch verschil tussen:
a) Een slapend account waarbij Perry de Nostr sleutel beheert
b) Een slapend account waarbij de Nostr sleutel cryptografisch is afgeleid van de locatiecoördinaten (niemand beheert de sleutel)

---

## Vraag 3 — NIP-58 Badges als crypto asset

### Situatie
IDidHere kent unieke digitale badges toe aan gebruikers als bewijs van fysieke aanwezigheid op een locatie. Deze badges zijn:
- Niet verhandelbaar — geen marktplaats, geen prijs
- Niet inwisselbaar voor geld of andere assets
- Puur functioneel als bewijs van aanwezigheid — vergelijkbaar met een digitaal stempel

### Vraag
Vallen niet-verhandelbare digitale badges die worden toegekend als bewijs van aanwezigheid — zonder financiële waarde of speculatief karakter — onder de definitie van een **crypto asset** onder MiCA of andere relevante Belgische wetgeving?

---

## Wat Perry nodig heeft

Geen uitgebreid juridisch advies. Één gesprek van maximaal een uur met een jurist die bekend is met:
- Bitcoin Lightning Network (technische werking)
- MiCA Verordening EU 2023/1114
- Belgische implementatie via wet van 11 december 2025

Het doel is helderheid over of IDidHere in de huidige vorm kan opereren zonder vergunning als betaaldienstverlener of CASP.

---

## Contact

Perry Smit
Goosie Labs
https://goosielabs.com

*Dit document is opgesteld als technische en feitelijke beschrijving van het IDidHere systeem ten behoeve van juridisch advies. Het is geen juridisch document.*

---

## Bijlage — Gesimuleerd Juridisch Advies
*Opgesteld als voorbereiding op het gesprek met Timelex. Niet bindend.*

### Vraag 1 — Vrijwillige donaties en directe betalingen als betaaldienst?

**Waarschijnlijk geen CASP activiteit. Maar met één voorbehoud.**

MiCA definieert een CASP als een entiteit die crypto asset diensten verleent **voor derden**. De sleutelwoorden zijn *voor derden* en *als dienst*.

Perry ontvangt donaties als waardering voor open source werk. Dat is geen dienst voor derden — dat is een gift. Juridisch vergelijkbaar met een kunstenaar die een Bitcoin adres op zijn website zet. Geen vergunning vereist.

Perry ontvangt betalingen als actieve gebruiker — hij levert tips en verificatiepunten en wordt daarvoor direct betaald. Dat is een dienst die Perry zelf levert, niet een dienst die Perry voor anderen faciliteert. Ook hier: geen CASP activiteit.

**Het voorbehoud:** Als IDidHere groeit en Perry een significant deel van zijn inkomen haalt uit het *faciliteren* van betalingen tussen anderen — ook al is het technisch peer to peer — kan de NBB een andere interpretatie hanteren. De grens tussen *technische dienstverlener* en *betaaldienstverlener* is in de Belgische MiCA implementatie nog niet volledig uitgekristalliseerd.

**Aanbeveling:** Opereer nu zonder vergunning — de huidige structuur rechtvaardigt dat. Monitor de NBB guidance actief. Documenteer technisch dat Perry nooit fondsen aanraakt.

---

### Vraag 2 — Slapende accounts en time-locked HTLC

**Het HTLC model is juridisch het sterkste. Maar de sleutelkwestie is wie de Nostr sleutel beheert.**

Een time-locked HTLC waarbij Perry geen toegang heeft tot de fondsen is juridisch schoon. De sats zijn technisch niet van Perry en niet van het slapende account — ze zijn *in transit* met een voorwaarde. Geen bewaar van andermans vermogen.

**De aanvullende vraag is cruciaal:**

**Optie A — Perry beheert de Nostr sleutel van het slapende account:**
Dan is Perry de *de facto* beheerder van dat account. Een Belgische rechter kan dit interpreteren als bewaar van vermogen zodra er sats aan gekoppeld zijn. Dit is het **zwakste juridische model**.

**Optie B — De Nostr sleutel is cryptografisch afgeleid van de locatiecoördinaten:**
Dan beheert niemand de sleutel. Perry heeft er geen toegang toe. De sats zijn technisch niemands eigendom tot de eigenaar de sleutel reconstrueert via het claimproces. Dit is het **sterkste juridische model**.

Praktisch: bij optie B kan Horeca zijn account claimen door eigenaarschap van de GPS locatie te bewijzen. Perry geeft hem de reconstructiemethode, niet de sleutel zelf.

**Aanbeveling:** Gebruik uitsluitend optie B. Documenteer de cryptografische afleidingsmethode.

---

### Vraag 3 — NIP-58 Badges als crypto asset onder MiCA

**Geen crypto asset. Maar schrijf het expliciet in de gebruiksvoorwaarden.**

MiCA artikel 2 lid 3 sluit expliciet uit: digitale representaties die geen financiële instrumenten zijn en geen speculatief karakter hebben. Non-fungible tokens vallen grotendeels buiten MiCA tenzij ze in grote series worden uitgegeven of financiële kenmerken vertonen.

Een niet-verhandelbare badge die bewijs van aanwezigheid levert heeft geen financieel karakter. Vergelijkbaar met een digitaal diploma of een loyalty stempel.

**Twee risicofactoren om te vermijden:**
1. Geen secundaire markt faciliteren — zodra badges verhandelbaar worden verandert de juridische kwalificatie
2. Geen financiële waarde toekennen — geen prijsindicaties die financiële waarde impliceren

**Aanbeveling:** Voeg toe aan gebruiksvoorwaarden:
> *"Gansen zijn niet-verhandelbare bewijzen van aanwezigheid. Ze vertegenwoordigen geen financiële waarde en zijn geen beleggingsinstrument onder MiCA of enige andere financiële wetgeving."*

---

### Samenvatting

| Vraag | Oordeel | Risico | Actie |
|---|---|---|---|
| Donaties en directe betalingen | ✅ Geen CASP activiteit | 🟡 Monitor NBB guidance | Documenteer non-custodial karakter |
| Slapende accounts — optie A | ⚠️ Juridisch kwetsbaar | 🔴 Mogelijke bewaardienst | Niet doen |
| Slapende accounts — optie B | ✅ Juridisch schoon | 🟡 Laag | Gebruik cryptografische sleutelafleiding |
| NIP-58 badges | ✅ Geen crypto asset | 🟡 Laag als niet verhandelbaar | Expliciete clausule in gebruiksvoorwaarden |

**Eindoordeel:**
> IDidHere kan in de huidige vorm opereren zonder vergunning als betaaldienstverlener of CASP — mits optie B wordt gebruikt voor slapende accounts en badges expliciet als niet-verhandelbaar worden gecommuniceerd.

*Dit is een gesimuleerd juridisch advies voor planningsdoeleinden. Niet bindend. Raadpleeg Timelex voor bindend advies.*
