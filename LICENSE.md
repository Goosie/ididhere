# IDidHere — Open Source Licentie
**MIT License met Aanvullende Clausules**
**Copyright (c) 2026 Perry Smit — Goosie Labs**

---

## Deel 1 — MIT Kernlicentie

Hierbij wordt toestemming verleend, kosteloos, aan elke persoon die een kopie van deze software en bijbehorende documentatiebestanden (de "Software") verkrijgt, om zonder beperking in de Software te handelen, inclusief maar niet beperkt tot de rechten om te gebruiken, kopiëren, wijzigen, samenvoegen, publiceren, distribueren, in sublicentie te geven en/of kopieën van de Software te verkopen, en om personen aan wie de Software wordt verstrekt toe te staan dit te doen, onder de volgende voorwaarden:

De bovenstaande copyrightkennisgeving en deze toestemmingskennisgeving dienen te worden opgenomen in alle kopieën of substantiële delen van de Software.

**DE SOFTWARE WORDT GELEVERD "AS IS", ZONDER GARANTIE VAN WELKE AARD DAN OOK, EXPLICIET OF IMPLICIET, INCLUSIEF MAAR NIET BEPERKT TOT DE GARANTIES VAN VERKOOPBAARHEID, GESCHIKTHEID VOOR EEN BEPAALD DOEL EN NIET-INBREUK. IN GEEN GEVAL ZIJN DE AUTEURS OF COPYRIGHTHOUDERS AANSPRAKELIJK VOOR ENIGE CLAIM, SCHADE OF ANDERE AANSPRAKELIJKHEID, HETZIJ IN EEN CONTRACTUELE ACTIE, ONRECHTMATIGE DAAD OF ANDERSZINS, VOORTKOMEND UIT, BUITEN OF IN VERBAND MET DE SOFTWARE OF HET GEBRUIK OF ANDERE HANDELINGEN IN DE SOFTWARE.**

---

## Deel 2 — Aanvullende Clausules

Deze aanvullende clausules zijn van toepassing naast de MIT kernlicentie en beschermen makers, exploitanten en gebruikers van IDidHere tegen specifieke risico's die voortvloeien uit de aard van het systeem.

---

### Clausule A — Financiële Disclaimers

**A.1 Geen financieel advies**
IDidHere en alle afgeleiden werken van deze Software vormen geen financieel advies, beleggingsdienst of betaaldienst in de zin van PSD2, PSD3, MiCA of enige andere financiële wetgeving. De Software faciliteert technisch de uitwisseling van berichten op het Nostr protocol. Betalingen via het Bitcoin Lightning Network vinden plaats tussen gebruikers onderling. De makers en exploitanten zijn op geen enkel moment bewaarders (custodians) van andermans vermogen.

**A.2 Geen garantie op betalingen**
De makers en exploitanten geven geen garanties over de beschikbaarheid, betrouwbaarheid of correctheid van Lightning Network betalingen, Nostr Wallet Connect verbindingen, of NIP-75 Zap Goal escrow mechanismen. Gebruikers zijn zelf verantwoordelijk voor het beheer van hun Lightning wallets en cryptografische sleutels.

**A.3 Exploitanten zijn geen betaaldienstverleners**
Partijen die de Software draaien als eigen instantie zijn geen betaaldienstverleners in de zin van PSD2/PSD3 zolang zij op geen enkel moment fondsen van gebruikers bewaren of doorsturen. Exploitanten die wél fondsen bewaren of doorsturen zijn zelf verantwoordelijk voor het verkrijgen van de benodigde vergunningen.

---

### Clausule B — GPS en Locatiedata

**B.1 Nauwkeurigheid van GPS verificatie**
De GPS-gebaseerde verificatiefunctionaliteit biedt geen absolute zekerheid over fysieke aanwezigheid van gebruikers. Verificatiescores zijn indicatief. De makers en exploitanten zijn niet aansprakelijk voor frauduleuze check-ins, GPS spoofing, of onjuiste verificatieresultaten.

**B.2 Privacy van locatiedata**
Exploitanten zijn zelf verantwoordelijk voor naleving van de AVG (GDPR) en andere toepasselijke privacywetgeving met betrekking tot de verwerking van locatiegegevens. De Software biedt technische mogelijkheden voor versleuteling via NIP-44 en NIP-59 — exploitanten zijn verantwoordelijk voor correcte implementatie en communicatie hiervan aan gebruikers.

**B.3 Geen aansprakelijkheid voor locatie-gerelateerde schade**
De makers en exploitanten zijn niet aansprakelijk voor schade voortkomend uit onjuiste locatie-informatie, bereikbaarheid van locaties, veiligheid van bezochte plekken, of handelingen van gebruikers op basis van locatiegegevens in de Software.

---

### Clausule C — Digitale Badges (Gansen)

**C.1 Geen financiële waarde**
NIP-58 badges uitgegeven door IDidHere of afgeleiden van de Software zijn niet-verhandelbare bewijzen van aanwezigheid. Ze vertegenwoordigen geen financiële waarde, zijn geen beleggingsinstrument, en vallen niet onder de definitie van een crypto asset in de zin van MiCA of enige andere financiële wetgeving.

**C.2 Geen garantie op beschikbaarheid**
De makers en exploitanten geven geen garantie dat uitgegeven badges permanent beschikbaar blijven op specifieke Nostr relays. Gebruikers zijn zelf verantwoordelijk voor het bewaren van hun Nostr sleutels en het publiceren van hun events op meerdere relays.

**C.3 Geen marktplaats**
De kernimplementatie faciliteert geen handel in badges. Partijen die op basis van de Software een marktplaats voor badges bouwen zijn zelf verantwoordelijk voor de juridische kwalificatie en regulering daarvan.

---

### Clausule D — Moderatie en Gebruikersinhoud

**D.1 Geen aansprakelijkheid voor gebruikersinhoud**
De makers en exploitanten zijn niet aansprakelijk voor inhoud geplaatst door gebruikers, inclusief maar niet beperkt tot locatietips, beschrijvingen, foto's en check-ins.

**D.2 Cura en Juror zijn geen werknemers**
Personen die de rol van Cura of Juror vervullen zijn onafhankelijke deelnemers aan het gedecentraliseerde moderatieproces. Zij zijn geen werknemers, vertegenwoordigers of agenten van de makers of exploitanten. De makers en exploitanten zijn niet aansprakelijk voor beslissingen genomen door Cura's of Jurors.

**D.3 Moderatie is niet gegarandeerd**
Het moderatiesysteem biedt geen garantie dat alle ongewenste, illegale of schadelijke inhoud wordt verwijderd. Exploitanten zijn zelf verantwoordelijk voor aanvullende moderatiemaatregelen waar wettelijk vereist.

---

### Clausule E — Slapende Accounts en OpenStreetMap Data

**E.1 OpenStreetMap data**
IDidHere maakt gebruik van data van OpenStreetMap onder de Open Database License (ODbL). Exploitanten die OpenStreetMap data gebruiken zijn verplicht de ODbL voorwaarden na te leven, inclusief attributie aan OpenStreetMap bijdragers.

**E.2 Slapende accounts**
Nostr sleutels van slapende Horeca accounts worden cryptografisch afgeleid van GPS coördinaten. De makers en exploitanten bewaren deze sleutels niet en hebben er geen toegang toe. Exploitanten zijn zelf verantwoordelijk voor het claimproces en de communicatie daarover aan betrokken partijen.

**E.3 Vervallen sats**
De makers en exploitanten zijn niet aansprakelijk voor sats die vervallen door het verstrijken van time-locked Lightning contracten (HTLC). De verantwoordelijkheid voor tijdig claimen ligt bij de ontvanger.

---

### Clausule F — Naamsvermelding en Merk

**F.1 Naamsvermelding**
Afgeleiden werken mogen de naam "IDidHere" en het gans-logo gebruiken mits duidelijk gecommuniceerd wordt dat het een afgeleide versie betreft en niet de originele IDidHere instantie van Goosie Labs.

**F.2 Geen impliciete endorsement**
Het gebruik van de Software impliceert geen endorsement door Perry Smit of Goosie Labs van het product, de dienst of de exploitant die de Software inzet.

---

### Clausule G — Toepasselijk Recht

**G.1 Belgisch recht**
Deze licentie wordt beheerst door en geïnterpreteerd in overeenstemming met Belgisch recht, zonder toepassing van conflictenrechtelijke bepalingen.

**G.2 Bevoegde rechter**
Geschillen voortvloeiend uit deze licentie worden voorgelegd aan de bevoegde rechtbank in Gent, België.

**G.3 Gedeeltelijke ongeldigheid**
Indien een clausule van deze licentie ongeldig of niet-afdwingbaar blijkt, blijven de overige clausules volledig van kracht.

---

## Deel 3 — Samenvatting voor mensen

*Juridisch niet bindend — de tekst hierboven is leidend.*

**Wat je mag:**
- Gebruik, aanpassen en distribueren
- Je eigen IDidHere instantie draaien
- Commerciële producten bouwen op basis van de code
- De code integreren in andere projecten
- Bijdragen aan het project

**Wat je niet mag:**
- Beweren dat je de originele IDidHere van Goosie Labs bent
- Fondsen van gebruikers bewaren zonder de juiste vergunningen
- Een marktplaats voor gansen bouwen zonder eigen juridische analyse
- De makers of exploitanten aansprakelijk stellen voor GPS fouten, betalingsfouten of moderatiebeslissingen

**Wat de makers nooit doen:**
- Andermans sats bewaren
- Andermans sleutels bewaren
- Garanties geven op betalingen of verificatie
- Verantwoordelijkheid nemen voor gebruikersinhoud

---

## Deel 4 — Derde partij licenties

| Component | Licentie | URL |
|---|---|---|
| Nostr Protocol (NIPs) | Public Domain | https://github.com/nostr-protocol/nostr |
| OpenStreetMap | ODbL 1.0 | https://www.openstreetmap.org/copyright |
| strfry relay | MIT | https://github.com/hoytech/strfry |
| BIP39 / BIP44 | MIT | https://github.com/bitcoin/bips |

---

*IDidHere — Open Source · Goosie Labs · https://goosielabs.com*
*Perry Smit · 2026*
