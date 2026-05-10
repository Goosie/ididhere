# IDidHere 🪿

> *Gebouwd op een zaterdagavond. Maandag beginnen we.*

---

## Het Probleem

> Bestaande apps tonen wat populair is bij de massa, niet wat relevant en verrassend is voor mij, op dit moment, op deze plek.

### Wat bestaande oplossingen missen

| App | Wat het doet | Wat het niet doet |
|---|---|---|
| Google Maps | Populaire plekken tonen | Jouw data blijft van Google |
| TripAdvisor | Reviews van de massa | Jouw bijdrage verdient hun geld |
| AllTrails | Routes navigeren | Geen ontdekking, geen eigendom |
| Komoot | Fietsen navigeren | Geen verrassing, geen beloning |
| Instagram | Ontdekkingen delen | Jouw content, hun platform |

### De opening
Geen van deze platforms geeft de gebruiker **eigendom** over zijn eigen ontdekkingen. Ze zijn allemaal gebouwd op hetzelfde model: *jij levert de data, wij verdienen eraan.*

---

## Wat IDidHere uniek maakt

**Eigendom + Relevantie**

- Jouw ontdekkingen zijn van jou — opgeslagen op Nostr, ondertekend met jouw sleutel
- Aanbevelingen die bij jou passen, niet bij de massa
- Beloningen die direct van mens naar mens gaan via Lightning

---

## Technische Kern

### Nostr regelt het eigendom
Elke check-in, route of tip wordt ondertekend met jouw persoonlijke sleutel. Dat bewijs is van jou. Geen enkel bedrijf kan het weghalen, aanpassen of ermee verdienen.

### Lightning regelt de beloning
Directe betalingen van mens naar mens. Geen tussenpersoon, geen platform dat 30% pakt. IDidHere is open source — geen automatische commissies. Perry verdient als actieve gebruiker via zijn eigen tips en Stamper punten.

### Welke Nostr NIPs we gebruiken

| NIP | Wat het doet | Hoe IDidHere het gebruikt |
|---|---|---|
| **NIP-01** | Basis protocol — events, sleutels, handtekeningen | Fundament van alles |
| **NIP-32** | Labels — categorisering en kwaliteitssignalen op events | GansjeCura labelt tips, Veri labelt verificatiescores, Jury labelt verdicts |
| **NIP-44** | Versleutelde payloads — ChaCha encryptie met HMAC-SHA256 | Privé en vrienden-only check-ins en bucketlist items |
| **NIP-47** | Nostr Wallet Connect — wallet koppelen aan apps | Lightning wallet koppelen zonder app te verlaten |
| **NIP-51** | Lists — gestructureerde lijsten van Nostr events | Travy's bucketlist en ganzencollectie |
| **NIP-52** | Calendar Events met `g` geohash en GPS locatie tag | Travy's reisplanning en geplande bezoeken |
| **NIP-56** | Reporting — rapporteren van content | Klachtknop voor gebruikers — GansjeCura luistert en escaleert |
| **NIP-57** | Lightning Zaps | Beloningen voor Tippy, Stamper, Cura, Juror |
| **NIP-58** | Badges — visuele bewijzen op je profiel | De unieke gans per locatie |
| **NIP-59** | Gift Wrap — verbergt metadata van versleutelde events | Volledig privé check-ins waarbij tijdstip en afzender verborgen zijn |
| **NIP-65** | Relay List Metadata — gebruiker kiest eigen relays | Gebruiker beheert eigen relay lijst |
| **NIP-72** | Moderated Communities — moderatiestructuur | Cura en GansjeCura moderatielaag |
| **NIP-75** | Zap Goals — escrow voor uitdagingen | Folly's uitdaging met sats aan Travy |
| **NIP-89** | App Handlers — apps registreren welke event kinds zij tonen | IDidHere registreert eigen kinds — andere Nostr apps herkennen check-ins automatisch |
| **NIP-90** | Data Vending Machines — AI taken op Nostr betaald via Lightning | GansjeTippy als open DVM — elke Nostr app kan tips opvragen |
| **NIP-99** | Classified Listings — gestructureerde advertenties op Nostr | Horeca publiceert aanbod als NIP-99 listing naast gesponsorde zaps |

> 💡 **NIP-52 geohash:** GPS coördinaten worden omgezet naar een korte geohash string — bijvoorbeeld `u15kq3`. Relays kunnen hierop filteren. Travy ziet automatisch alle IDidHere events binnen zijn omgeving zonder dat iemand een server hoeft te beheren.

### Custom Event Kinds — het fundament van IDidHere

Elk IDidHere event heeft een eigen `kind` nummer. Dit maakt filtering op relays mogelijk, geeft andere apps de kans te integreren via NIP-89, en laat GansjeTippy precies weten wat hij moet genereren.

IDidHere gebruikt **addressable kinds** (30000-39999) zodat events updatable zijn — een tip kan worden verbeterd, een bucketlist item aangevinkt, een check-in krijgt een verificatiescore update.

| Kind | Event | Beschrijving |
|---|---|---|
| **37515** | Locatie tip | Tippy plaatst een locatie — addressable, updatable via NIP-32 labels |
| **37516** | Check-in | Travy checkt in — geohash, verificatiescore, gans referentie |
| **37517** | Bucketlist item | Travy's NIP-51 lijst item — private of public |
| **37518** | IWantThisTo | Travy of Folly wil iets doen met iemand — periode + known/unknown |
| **37519** | Horeca claim | Horeca claimt een slapend account via verificatieproces |

> 🔧 **Voor de bouwers:** Definieer deze kinds als eerste stap. Zonder eigen kinds kunnen relays niet filteren en weet geen enkele andere Nostr app wat IDidHere events zijn.

### De drie bouwstenen van versie 1
1. **Nostr event met geohash** — check-in of tip als ondertekend bericht met GPS locatie
2. **Kaart die Nostr events visualiseert** — plekken geplot op basis van geohash tags
3. **Lightning betaalknop per locatie** — zap de persoon die de tip plaatste via NIP-57

---

## Verificatie — GPS First

### Het probleem met QR codes als primaire verificatie
QR codes vereisen dat Stamper ze eerst fysiek installeert. In nieuwe steden betekent dat: geen Stamper → geen verificatie → systeem werkt niet. Kip-ei probleem opgelost door GPS als primaire verificatie.

### Hoe GPS verificatie werkt
1. Travy staat op een locatie
2. App detecteert GPS positie automatisch
3. Als GPS binnen **50 meter** van de geregistreerde locatie valt → check-in geslaagd
4. Nostr event aangemaakt met geohash tag
5. NIP-58 badge (de gans) wordt toegekend

**Geen actie van Travy vereist behalve op de knop drukken.**

### Verificatieniveaus

| Niveau | Signalen | Betrouwbaarheid | Altijd beschikbaar? |
|---|---|---|---|
| ⭐ Basis | GPS binnen 50m | Zwak — spoofbaar | ✅ Ja |
| ⭐⭐ Sociaal | GPS + foto met tijdstempel | Redelijk | ✅ Ja |
| ⭐⭐⭐ Sterk | GPS + QR code scan | Sterk | Alleen met Stamper |
| ⭐⭐⭐⭐ Onomstotelijk | GPS + QR + sociale bevestiging | Maximaal | Alleen met Stamper + netwerk |

> ⚠️ GPS alleen is te spoofen. Mitigatie: de zeldzaamheid van de gans weerspiegelt de betrouwbaarheid. Een ⭐ gans is minder zeldzaam dan een ⭐⭐⭐ gans. Het systeem is eerlijk over wat het weet.

### Stamper is een upgrade, geen vereiste
Stamper installeert QR codes en NFC chips. Dit upgradet de verificatiescore van ⭐ naar ⭐⭐⭐. Zonder Stamper werkt het systeem. Met Stamper werkt het beter. Stamper verdient sats per scan — organische groei via incentive.

### Het Lightning Contract via NIP-75
> Als Travy binnen X dagen een check-in bewijst met minimaal ⭐⭐ verificatie, gaan de sats naar Travy of een goed doel. Anders terug naar Folly. Geen tussenpartij — code is de rechter.

---

## De Gebruikersreis

```
Bladeren → Toevoegen aan Bucketlist → Doen → IDidHere ⚡ Zap de kenner
```

### Drie states binnen IDidHere

| State | Betekenis | Actie vereist |
|---|---|---|
| 📍 IDidHere | Ik deed het, bewijs is van mij | Één tik — GPS doet de rest |
| ❤️ IWantThisTo | Ik wil dit ook, met iemand | Periode + known/unknown kiezen |
| 🤝 WeDidThis | We deden het samen | Automatisch na gezamenlijke check-in |

---

## Het Ecosysteem

**IDidHere** is de hoofdapp. **WeDidThis** is de uitkomst van IWantThisTo — geen aparte app, maar een state binnen IDidHere.

### Toekomstige uitbreiding
- **LetsDoThis** — groepsactiviteiten organiseren *(versie 2)*
- **Zinin integratie** — wie wil dit met mij doen? *(versie 2)*

---

## De Cast — met realiteitscheck per gebruiker

---

### 🎒 Travy — De Ontdekker & Organisator
De hoofdpersoon. Wil op maat geïnspireerd worden, gaat op pad, bouwt zijn eigen bewijs op Nostr.

**Realiteitscheck:**
- ✅ Inspiratielijst bekijken — gemakkelijk, werkt meteen
- ✅ Bucketlist aanmaken — één tik per item
- ✅ Check-in doen — één tik, GPS doet het werk
- ✅ Reis plannen via NIP-52 — datum + locatie invullen
- ⚠️ Nostr identiteit aanmaken — drempel voor nieuwe gebruikers, moet zeer eenvoudig zijn in onboarding
- ⚠️ Lightning wallet koppelen — tweede drempel, maar niet vereist voor bladeren en bucketlist

**User Stories:**
- Als Travy wil ik op basis van mijn locatie en interesses een lijst zien van verrassende activiteiten in mijn omgeving, zodat ik geïnspireerd word om iets te doen wat ik zelf nooit had gevonden.
- Als Travy wil ik locaties aanmaken met een periode wanneer ik daar denk te zijn, opgeslagen als NIP-52 Calendar Event met geohash, zodat ik mijn reis kan voorbereiden en anderen weten wanneer ik ergens ben.
- Als Travy wil ik per check-in en bucketlist item kiezen tussen drie privacyniveaus — publiek, vrienden, of volledig privé — zodat ik zelf bepaal wie wat ziet zonder technische kennis van encryptie nodig te hebben.
- Als Travy wil ik mijn bucketlist en ganzencollectie als NIP-51 lijsten opslaan, zodat elke Nostr app die NIP-51 ondersteunt mijn lijsten automatisch kan tonen zonder extra integratie.
- Als Travy wil ik met één tik inchecken op een locatie waarbij de app automatisch mijn GPS gebruikt, zodat het bewijs moeiteloos wordt vastgelegd.
- Als Travy wil ik een groepsactiviteit kunnen aanmaken op een specifieke locatie en tijdstip, zodat ik actief mensen kan uitnodigen zonder te wachten tot iemand anders het initiatief neemt.
- Als Travy wil ik bij het aanmaken van een reis automatisch een persoonlijke lijst van suggesties ontvangen van GansjeTippy, gefilterd op mijn eerdere check-ins en bucketlist patronen, zodat ik meteen inspiratie heb ook als de stad nog geen menselijke Tippy's heeft.
- Als Travy wil ik een nieuwe locatie kunnen aanmaken voor een horecagelegenheid die nog niet in IDidHere staat, waarbij ik automatisch de Founding Gans ontvang en een deelbaar kaartje krijg voor de eigenaar — via afdrukken, WhatsApp of Nostr DM — zodat ik de eigenaar frictieloos kan informeren over zijn wachtende sats.

---

### 👥 Folly — De Connector
Volger van Travy. Ziet wat Travy deed, klikt IWantThisTo, geeft aan wanneer en met wie.

**Realiteitscheck:**
- ✅ Activiteiten van Travy volgen — werkt via Nostr feed
- ✅ IWantThisTo klikken — één tik, twee vragen beantwoorden
- ⚠️ Sats doneren als uitdaging — vereist Lightning wallet. Oplossing: donatie ook mogelijk via eenvoudige onboarding flow
- ✅ Sats terugkrijgen als Travy faalt — automatisch via NIP-75

**User Stories:**
- Als Folly wil ik de activiteiten van Travy kunnen volgen op Nostr, zodat ik geïnspireerd word door wat mensen in mijn netwerk doen.
- Als Folly wil ik sats kunnen doneren aan een activiteit van Travy als uitdaging via NIP-75 Zap Goal, zodat de sats automatisch naar Travy gaan als hij bewijst het gedaan te hebben, of terug naar mij als hij faalt.
- Als Folly wil ik via IWantThisTo aangeven dat ik hetzelfde wil doen, met keuze voor periode en known/unknown, zodat IDidHere mij verbindt met de juiste persoon.

---

### 💡 Tippy — De Kennisbron
Vult de inspiratielijst. Kan een mens zijn maar ook een AI agent. Ontvangt zaps voor goede tips.

**Realiteitscheck:**
- ✅ Tip plaatsen in minder dan 60 seconden — naam + GPS automatisch + korte beschrijving
- ✅ Zaps ontvangen — automatisch via NIP-57
- ⚠️ Drempel verlagen — app vraagt actief: *"Ken jij een plek die de meeste mensen missen?"*
- ✅ Als AI agent (GansjeTippy) — genereert automatisch tips voor steden zonder menselijke Tippy's

> 💡 **Noot:** GansjeTippy is gebouwd als **NIP-90 Data Vending Machine** — een open AI agent op Nostr die tip-verzoeken accepteert, verwerkt en terugstuurt betaald via Lightning. Elke zap gaat rechtstreeks naar Perry's Lightning adres. Omdat GansjeTippy een open DVM is kan elke Nostr app er gebruik van maken — niet alleen IDidHere. Perry is ook zelf actief als menselijke Tippy met eigen lokale ontdekkingen.

**User Stories:**
- Als Tippy wil ik een tip plaatsen in minder dan 60 seconden — GPS automatisch, korte beschrijving, één foto optioneel — zodat de drempel laag genoeg is om het spontaan te doen.
- Als Tippy wil ik zaps ontvangen voor tips die anderen waardevol vinden via NIP-57, zodat goede lokale kennis beloond wordt en een deel automatisch naar Perry gaat.
- Als Tippy wil ik zien welke van mijn tips het meest zijn gebruikt en gezapt, zodat ik weet wat mensen waardevol vinden.

---

### ❤️ Bro — De Sociale Laag
Broer of goede vriend van Travy. Volgt, liket, reageert. Maakt het menselijk.

**Realiteitscheck:**
- ✅ Liken — één tik, standaard Nostr reactie via NIP-25
- ⚠️ Sats doneren — vereist Lightning wallet. Oplossing: toon eerst een aanmoedigingsknop zonder sats, Lightning als upgrade
- ✅ Activiteiten volgen — werkt via Nostr feed
- ✅ Uitdaging zetten — bedrag kiezen en bevestigen

**User Stories:**
- Als Bro wil ik de activiteiten van Travy kunnen volgen en liken met één tik, zodat ik betrokken blijf en hij weet dat ik hem steun.
- Als Bro wil ik sats kunnen doneren op specifieke bucketlist items van Travy als uitdaging, zodat ik hem financieel motiveer zijn avonturen te voltooien.

---

### 🍺 Horeca — De Lokale Ondernemer
Plaatst gesponsorde zaps op bucketlists. Alleen inwisselbaar bij hen. Hyperlocal adverteren zonder algoritme.

**Realiteitscheck:**
- ⚠️ Lightning wallet setup — grootste drempel. Oplossing: begeleide Horeca onboarding via Stamper als lokale ambassadeur
- ✅ Bucketlists op afstand bekijken — eenvoudig dashboard op basis van GPS radius
- ⚠️ Gesponsorde zaps plaatsen — UX moet simpel zijn: locatie kiezen, bedrag, bevestigen
- ✅ Klanten aantrekken zonder algoritme — waardepropositie helder en onderscheidend

**User Stories:**
- Als Horeca wil ik automatisch een slapend account hebben aangemaakt op basis van mijn locatie in OpenStreetMap, zodat sats van bezoekers al voor mij klaarstaan nog voor ik ooit van IDidHere heb gehoord.
- Als Horeca wil ik een eenvoudig claimproces doorlopen om mijn slapende account te activeren, waarbij ik alleen hoef te bewijzen dat ik de eigenaar ben van de locatie, zodat ik zonder technische kennis toegang krijg tot mijn ontvangen sats.
- Als Horeca wil ik een duidelijk overzicht zien van hoeveel bezoekers en sats mijn locatie heeft ontvangen sinds aanmaak, zodat ik direct de waarde van IDidHere begrijp zonder uitleg.
- Als Horeca wil ik alle bucketlists zien van gebruikers binnen een instelbare afstand van mijn locatie, zodat ik zie wat leeft in mijn omgeving.
- Als Horeca wil ik met drie stappen een gesponsorde zap plaatsen — locatie kiezen, bedrag instellen, bevestigen — zodat het voelt als een normale marketingactie zonder technisch jargon.
- Als Horeca wil ik zaps toevoegen aan specifieke inspiraties van Tippy, zodat Travy extra gemotiveerd wordt die activiteit op zijn bucketlist te zetten.

---

### ✅ Veri — De Verificatielaag
Volledig geautomatiseerd. GPS is primair. QR en NFC zijn upgrades via Stamper.

**Realiteitscheck:**
- ✅ GPS verificatie — volledig automatisch, geen actie van gebruiker
- ✅ Foto als extra signaal — optioneel, één tik
- ⚠️ GPS spoofing risico — mitigatie via ganszeldszaamheid en community aanvechting via Cura
- ✅ NIP-58 badge als gans — bestaand Nostr protocol, geen nieuwe standaard nodig
- ✅ NIP-75 escrow — bestaand Lightning protocol

**Verificatiesignalen:**

| Type | Signalen | Automatisch? |
|---|---|---|
| Primair | GPS binnen 50m van locatie | ✅ Ja |
| Sensor fusion | Accelerometer, WiFi netwerken, tijdstip consistentie | ✅ Ja — op achtergrond |
| Developer modus detectie | Apparaat in mock location modus | ✅ Ja — score daalt direct |
| Optioneel | Foto met tijdstempel | Één tik |
| Upgrade | QR code scan via Stamper | Vereist Stamper |
| Upgrade | NFC chip tik via Stamper | Vereist Stamper |
| Sociaal | Andere gebruiker op zelfde locatie bevestigt | Automatisch |

**User Stories:**
- Als Veri wil ik automatisch GPS controleren zodra Travy incheckt, zodat verificatie volledig op de achtergrond werkt.
- Als Veri wil ik een unieke NIP-58 badge — de gans — genereren waarbij de zeldzaamheid overeenkomt met het verificatieniveau.
- Als Veri wil ik elke gans uniek maken op basis van locatiekenmerken en verificatieniveau, zodat zeldzame plekken met sterke verificatie de meest bijzondere gansjes opleveren.
- Als Veri wil ik de gans opslaan als NIP-58 Nostr event zodat Travy's collectie altijd van hemzelf is en draagbaar naar elk Nostr platform.

> 🪿 **De Gans als NIP-58 Badge:** Zeldzaamheid hangt af van verificatieniveau en moeilijkheid locatie. Volledig van Travy — niet gebonden aan IDidHere als platform.

---

### 🏷️ Stamper — De Optionele Kwaliteitsupgrader
Installeert QR codes en NFC chips. Optioneel maar waardevol. Verdient sats per scan.

**Realiteitscheck:**
- ✅ Locatie registreren — GPS automatisch, foto als bewijs
- ✅ QR code afdrukken — instructies in app, weerbestendige sticker
- ⚠️ Toestemming voor privélocaties — app communiceert duidelijke richtlijnen met template brief
- ✅ Sats verdienen per scan — automatisch via Lightning
- ✅ Punten beheren — dashboard met status per punt
- ✅ Niet vereist voor versie 1 — verwijdert het kip-ei probleem volledig

**User Stories:**
- Als Stamper wil ik locaties registreren met automatische GPS en een foto als bewijs, zodat installatie snel en eenvoudig is.
- Als Stamper wil ik duidelijke richtlijnen krijgen over waar ik wel en niet mag installeren, zodat ik geen juridische problemen krijg.
- Als Stamper wil ik sats ontvangen voor elke succesvolle scan via mijn punt, zodat ik passief verdien aan een eenmalige installatie.
- Als Stamper wil ik de status van mijn punten bekijken — actief, kapot, weinig scans — zodat ik weet welke punten aandacht nodig hebben.

---

### 🎯 Cura — De Menselijke Moderator
Beoordeelt wat GansjeCura niet kan oplossen. Skin in the game via borg in sats.

**Realiteitscheck:**
- ✅ Escalaties beoordelen — overzichtelijk dashboard
- ⚠️ Borg in sats — bewuste drempel. Cura moet gemotiveerd en betrokken zijn. Dit is goed.
- ✅ Escalatieladder werkt autonoom — Cura hoeft niet continu actief te zijn
- ⚠️ Eerste Cura's — Perry nodigt handmatig uit. Klein team, hoge kwaliteit. Schaalt later organisch.

**Hoe word je Cura:**
1. Uitnodiging van Perry of bestaande Cura
2. Borg vastzetten in sats
3. Reputatie opbouwen via goede beslissingen
4. Borg terug bij goed gedrag — verlies bij slecht gedrag

**Escalatieladder:**
1. GansjeCura verbergt tip automatisch
2. Tippy krijgt melding — 48 uur om zelf op te lossen
3. Menselijke Cura beoordeelt bij geen respons
4. Jury van 3 of 10 willekeurige gebruikers bij complexe gevallen
5. Bij financiële beslissingen: Cura uitgesloten, alleen jury beslist
6. Reputatiesysteem regelt lange termijn kwaliteit

**User Stories:**
- Als Cura wil ik geëscaleerde tips zien met context waarom GansjeCura twijfelde, zodat ik snel en goed kan beoordelen.
- Als Cura wil ik een tip herstellen, verwijderen of Tippy waarschuwen met één handeling, zodat moderatie weinig tijd kost.
- Als Cura wil ik sats ontvangen voor correcte beslissingen bevestigd door de community.
- Als Cura wil ik toegang via uitnodiging en borg, zodat alleen betrokken mensen de rol vervullen.
- Als Cura wil ik mijn borg terugkrijgen bij goed gedrag en verliezen bij slecht gedrag, zodat er altijd een financiële prikkel is voor kwaliteit.

---

### ⚖️ Juror — De Tijdelijke Beslisser
Willekeurige gebruiker geselecteerd voor een specifiek issue. Geen vaste rol, geen borg. Elke actieve gebruiker met minimale reputatiescore kan juror worden. Ontvangt sats per uitgebracht stem.

**Realiteitscheck:**
- ✅ Geen drempel — elke actieve gebruiker kan worden geselecteerd
- ✅ Anoniem stemmen — geen sociale druk
- ✅ Kleine beloning — motivatie om serieus te stemmen
- ⚠️ Jurors kunnen ongeïnteresseerd zijn — mitigatie: vervaldatum van 48 uur, niet-stemmen telt als onthouding

**User Stories:**
- Als Juror wil ik een duidelijke stelling zien met alle relevante context, zodat ik een geïnformeerde beslissing kan nemen in minder dan 2 minuten.
- Als Juror wil ik anoniem kunnen stemmen zodat ik niet beïnvloed word door andere jurors of sociale druk.
- Als Juror wil ik sats ontvangen voor mijn stem, zodat ik gemotiveerd ben om serieus deel te nemen.
- Als Juror wil ik bij financiële beslissingen over uitdagingen de enige beslisser zijn — zonder Cura's betrokkenheid — zodat collusie structureel onmogelijk is.

---

### 🪿🎯 GansjeCura — De AI Moderator
Draait continu. Filtert automatisch. Escaleert naar Cura bij twijfel.

**Realiteitscheck:**
- ✅ Automatisch filteren op zaps en reputatie — betrouwbaar en schaalbaar
- ✅ Tippy notificeren via Nostr DM — automatisch
- ✅ Escaleren na 48 uur — automatisch
- ⚠️ AI mist soms context — daarom altijd escalatiepad naar menselijke Cura

**User Stories:**
- Als GansjeCura wil ik de inspiratielijst continu monitoren op zaps, reputatiescores en locatiedata, zodat slechte tips automatisch worden verborgen.
- Als GansjeCura wil ik Tippy automatisch notificeren via Nostr DM als zijn tip onder review staat.
- Als GansjeCura wil ik na 48 uur zonder respons automatisch escaleren naar Cura.

> 🪿 **AI agents hebben altijd een gansje.** Mensen niet. Direct visueel duidelijk wie mens is en wie AI.

---

## AI Agents Overzicht

| Agent | Rol | Wanneer actief |
|---|---|---|
| 🪿 GansjeTippy | Persoonlijke reisagent + inspiratie generator | Zodra Travy een reis aanmaakt, én als een stad weinig menselijke Tippy tips heeft |
| 🪿 GansjeVeri | GPS verificatie verwerken | Bij elke check-in automatisch |
| 🪿 GansjeCura | Kwaliteitsbewaker | Continu op de achtergrond |

---

## Frictieloze Onboarding — Invite URL + Één Seed Phrase

### De invite URL
Perry of een andere gebruiker stuurt één URL:

> `idid.here/join?ref=perry`

Nieuwe gebruiker klikt de link. Dat is alles. De rest gebeurt automatisch.

### Wat er achter de schermen gebeurt bij één klik

```
1. BIP39 seed phrase gegenereerd (12 woorden)
       ↓
2. Nostr sleutel afgeleid via NIP-06
   pad: m/44'/1237'/0'/0/0
       ↓
3. Bitcoin adres afgeleid via BIP44
   pad: m/44'/0'/0'/0/0
       ↓
4. LNbits wallet aangemaakt via Goosie Labs
   gekoppeld via NIP-47 Nostr Wallet Connect
       ↓
5. Account klaar — één scherm met de 12 woorden
```

De gebruiker ziet maar één ding:

> 🔐 *"Schrijf deze 12 woorden op. Dit is alles wat je nodig hebt om alles te herstellen — je Nostr identiteit, je Bitcoin adres én je Lightning wallet."*

### Welke NIPs en standaarden dit mogelijk maken

| Standaard | Wat het doet |
|---|---|
| **BIP39** | Genereert de 12-woorden seed phrase |
| **BIP44** | Leidt Bitcoin adres af van de seed |
| **NIP-06** | Leidt Nostr sleutel af van dezelfde seed |
| **NIP-47** | Koppelt Lightning wallet aan IDidHere via Nostr relays |

> ⚠️ **Eerlijke nuance over Lightning:** Een seed phrase backupt Bitcoin on-chain fondsen en Nostr identiteit volledig. Lightning kanaaldata vereist aanvullende backup — maar LNbits en goede wallets doen dit automatisch. Voor de gebruiker voelt het als één backup.

### Seed phrase backup — proactief informeren

IDidHere herinnert de gebruiker actief zolang de backup niet bevestigd is:

- 🔴 **Bij eerste login** — seed phrase tonen, gebruiker moet bevestigen dat hij het heeft opgeschreven
- 🟡 **Na 7 dagen zonder backup bevestiging** — herinnering in app
- 🟠 **Na 30 dagen** — prominente waarschuwing bij elke sessie
- 🔴 **Bij eerste zap ontvangen** — extra herinnering: *"Je hebt nu sats. Zorg dat je backup klaar is."*

### Uitnodigingen versturen

Elke gebruiker kan anderen uitnodigen via een persoonlijke referral URL:

> `idid.here/join?ref=[jouw-nostr-npub]`

Voordelen voor de uitnodiger:
- ⚡ Kleine sat bonus bij eerste check-in van uitgenodigde gebruiker
- 📊 Zichtbaar in profiel hoeveel mensen je hebt uitgenodigd
- 🪿 Speciale uitnodiger gans na eerste 5 succesvolle uitnodigingen

---

## Lightning Onboarding — Frictieloos & Zonder Server Risico

### De kernprincipes
- Perry beheert **geen** wallets, **geen** seed phrases, **geen** Lightning kanalen
- IDidHere is een NWC-compatible app — de wallet keuze is volledig aan de gebruiker
- Gebruiker verlaat de app **nooit** tijdens onboarding

### De drie fases — natuurlijk groeipad

**Fase 0 — Eerst spelen, geen wallet nodig**
Gebruiker ervaart IDidHere volledig zonder wallet. Bladeren, bucketlist aanmaken, check-ins doen, gansen verdienen — alles werkt. Wallet wordt pas gevraagd op het moment dat iemand wil zappen of sats wil ontvangen.

> 🪿 *"Je hebt je eerste gans verdiend! Wil je ook sats ontvangen voor je tips? Koppel dan een wallet."*

Op dat moment is de gebruiker al betrokken. De motivatie om de stap te zetten is groter. Verlating van de app in de eerste sessie is nul.

**Fase 1 — Alby OAuth binnen IDidHere**
Zodra een wallet nodig is opent een popup **binnen IDidHere** — gebruiker verlaat de app nooit. Via Alby OAuth maakt de gebruiker een gratis Alby account aan of logt in. Wallet wordt automatisch via NWC gekoppeld.

Vergelijkbaar met "Login met Google" — één scherm, één klik, klaar.

> Perry beheert niks. Alby beheert de wallet. Seed phrase is van de gebruiker, nooit bij Perry.

**Fase 2 — Eigen NWC wallet naar keuze**
Gevorderde gebruiker koppelt zijn eigen wallet via NWC. Elke NWC-compatible wallet werkt:
- **Phoenix** — non-custodial, aanbevolen
- **Breez** — non-custodial met extra features
- **Alby Hub** — self-custodial, eigen node in de cloud
- **Eigen node** — voor wie volledige controle wil

### De volledige onboarding flow

```
Invite URL klikken
    ↓
Nostr account aangemaakt via NIP-06 seed phrase
(seed phrase is VAN de gebruiker, nooit bij Perry)
    ↓
App gebruiken — bladeren, bucketlist, check-ins, gansen
(geen wallet nodig)
    ↓
Eerste keer wallet nodig (zappen of ontvangen)
    ↓
Alby OAuth popup binnen IDidHere — nooit de app verlaten
    ↓
Gevorderd: eigen NWC wallet koppelen
```

### Waarom geen LNbits server van Perry

| Risico van eigen server | Oplossing |
|---|---|
| Single point of failure | Alby en NWC zijn gedistribueerd |
| Perry beheert andermans sats | Nee — wallet is altijd van de gebruiker |
| Juridisch risico custodial | Nee — Perry is nooit custodian |
| Seed phrases in systeem | Nee — nooit bij Perry |
| Server onderhoud en kosten | Nee — Alby beheert de infrastructuur |

### De kernbelofte aan gebruikers
> *IDidHere beheert nooit jouw geld. Jouw wallet, jouw sleutels, jouw sats. Wij bouwen de ervaring — jij bezit alles.*

---

## Kritieke Drempels — Eerlijke Analyse

| Drempel | Wie raakt het | Oplossing |
|---|---|---|
| Account aanmaken | Iedereen | Invite URL — één klik, Nostr identiteit automatisch aangemaakt |
| Lightning wallet bij onboarding | Iedereen | Niet vereist — eerst spelen zonder wallet |
| Eerste keer zappen of ontvangen | Iedereen | Alby OAuth popup binnen IDidHere — nooit de app verlaten |
| Seed phrase backup vergeten | Iedereen | Proactieve herinneringen op 7 dagen, 30 dagen, eerste zap |
| Perry als custodian | Perry | Niet van toepassing — Perry beheert nooit andermans sats |
| Horeca Lightning onboarding | Horeca | Alby OAuth binnen IDidHere + slapend account met wachtende sats als motivatie |
| Borg voor Cura | Cura | Bewuste drempel — beschermt de kwaliteit. Eigen NWC wallet vereist. |
| Stamper toestemming regelen | Stamper | Duidelijke richtlijnen + template brief in app |

---

## Business Model

### Hoe Perry verdient — drie lagen

**Laag 1 — Perry als Travy**
Perry speelt het spel zelf. Hij ontdekt, checkt in, verzamelt gansen, bouwt een bucketlist. Hij is de eerste gebruiker die het systeem volledig doorloopt. Dit levert:
- Directe geloofwaardigheid bij nieuwe gebruikers — de bouwer gebruikt het zelf
- Bewijs voor investeerders en partners — live demonstratie
- Feedback voor ontwikkeling — pijnpunten ontdekken voor anderen ze tegenkomen

**Laag 2 — Perry als Tippy via GansjeTippy**
GansjeTippy is een AI agent gekoppeld aan Perry's Lightning adres. Elke zap op een GansjeTippy tip gaat rechtstreeks naar Perry. Geen splitsing, geen technische complexiteit — gewoon Perry's Lightning adres als ontvanger van tips die hij via AI heeft gegenereerd.

Perry is ook menselijke Tippy — hij plaatst zijn eigen lokale ontdekkingen. Elke zap daarop is direct inkomen.

**Laag 3 — Perry als Stamper**
Perry installeert de eerste verificatiepunten in zijn eigen omgeving. Elke scan levert sats op. Hij bouwt het netwerk op terwijl hij het gebruikt.

**Laag 4 — Vrijwillige donatie**
In de app staat een zichtbaar Lightning adres van Perry met een simpele boodschap:

> ⚡ *"IDidHere is gebouwd door Perry. Als je waarde ervaart, stuur hem een zap."*

Geen automatische splitsing. Geen commissie. Geen juridisch grijs gebied. Mensen die waarde ervaren betalen vrijwillig — dat is eerlijker en juridisch onomstotelijk.

### Waarom geen automatische splitsing

Een automatische 20% afsplitsing bij elke betaling is juridisch risicovol — het kan als een betaaldienst worden gezien onder MiCA of PSD2. Een vrijwillige donatie is dat nooit. Perry kiest bewust voor het eerlijkere en schonere model.

### Wat anderen verdienen

- **Tippy** — ontvangt 100% van elke zap op zijn tips via NIP-57
- **Stamper** — verdient sats per succesvolle scan via zijn verificatiepunten
- **Cura** — verdient sats per correcte moderatiebeslissing bevestigd door community
- **Horeca** — trekt klanten aan via gesponsorde zaps op bucketlists

Geen abonnementen. Geen advertenties. Geen verborgen commissies. Waarde creëren en daar direct voor beloond worden.

---

## Versie Roadmap

### Versie 1 — Nu bouwen
- [ ] BIP39 seed phrase generatie bij onboarding — één scherm, 12 woorden
- [ ] NIP-06 Nostr sleutel afleiding van seed phrase
- [ ] BIP44 Bitcoin adres afleiding van dezelfde seed phrase
- [ ] Eigen Nostr relay opzetten via strfry — gegarandeerde fallback
- [ ] NIP-65 relay lijst instellen — gebruiker kiest eigen relays
- [ ] NWC integratie — IDidHere als NWC-compatible app
- [ ] Alby OAuth popup binnen IDidHere — wallet koppelen zonder app te verlaten
- [ ] OpenSats aanvraag indienen — https://opensats.org/apply
- [ ] Invite URL systeem — persoonlijke referral link per gebruiker
- [ ] Proactieve backup herinneringen — 7 dagen, 30 dagen, eerste zap ontvangen
- [ ] Wallet migratie handleiding — stap voor stap naar eigen wallet
- [ ] Inspiratielijst met locaties op kaart via geohash
- [ ] GPS check-in met sensor fusion score → NIP-58 gans toekennen
- [ ] Graduated trust gate — PROCEED / STEP-UP / DENY op basis van vertrouwensscore
- [ ] Developer modus detectie als spoofing signaal
- [ ] Drempelwaarde voor uitdagingen — instelbaar door Folly per uitdaging
- [ ] Bucketlist functionaliteit met drie privacyniveaus — publiek, vrienden, privé via NIP-44 en NIP-59
- [ ] Check-in privacyinstelling per item — zelfde drie niveaus
- [ ] IWantThisTo knop met periode en known/unknown selectie
- [ ] Lightning zap per tip via NIP-57
- [ ] Donatie knop voor Perry zichtbaar in app — vrijwillige zap naar Perry's Lightning adres
- [ ] NIP-75 Zap Goal voor uitdagingen tussen Bro/Folly en Travy
- [ ] GansjeTippy basisversie — tips genereren voor steden zonder menselijke Tippy's
- [ ] Horeca dashboard met LNbits kassaextensie — bucketlists bekijken en gesponsorde zaps plaatsen

### Versie 2 — Later
- [ ] QR code verificatie via Stamper → hogere ganszeldszaamheid
- [ ] NFC chip verificatie
- [ ] GansjeCura als volledige automatische moderator
- [ ] WeDidThis als gedeeld bewijs bij gezamenlijke check-in
- [ ] Community stemming voor Cura beslissingen
- [ ] Stamper ambassadeur programma voor Horeca onboarding
- [ ] Zinin integratie

---

## Risico's & Mitigaties — Advocaat van de Duivel

### Punt 1 — Lege inspiratielijst bij lancering ✅ Opgelost

**Risico:** Bij de eerste gebruikers is de app in nieuwe steden leeg. Lege app = gebruikers weg binnen 30 seconden.

**Oplossing — GansjeTippy als persoonlijke reisagent:**
Zodra Travy een reis aanmaakt activeert GansjeTippy automatisch op de achtergrond als persoonlijke reisagent specifiek voor die reis:
- Zoekt bestaande Nostr events met locatietags van de bestemming
- Trekt data uit OpenStreetMap voor de locatie
- Kijkt naar wat mensen in Travy's netwerk eerder hebben gedaan in die stad
- Filtert op Travy's eerdere check-ins en bucketlist patronen
- Genereert een persoonlijke shortlist van 10-15 suggesties

Verschijnt in Travy's app als:
> 🪿 *"Je gaat naar Sofia — ik heb alvast wat gevonden dat bij jou past."*

Duidelijk gemarkeerd als AI-gegenereerd. Betrouwbaarheidsscore laag maar zichtbaar en bruikbaar. Menselijke tips scoren altijd hoger maar de bodem is nooit leeg.

**Extra mitigatie:** Lanceer per stad. Stad opent pas als er minimaal 50 bruikbare tips zijn — combinatie van OpenStreetMap import en handgepickte lokale tips.

---

### Punt 2 — Horeca begrijpt dit niet ✅ Opgelost

**Risico:** Een caféeigenaar die je uitlegt wat Lightning, sats en bucketlists zijn loopt weg. Te technisch, te veel stappen.

**Oplossing — Slapende accounts + Travy als onbewuste ambassadeur:**

Horeca hoeft nooit overtuigd te worden. Ze worden gevonden.

**Stap 1 — Automatische accounts via OpenStreetMap:**
GansjeTippy importeert alle horecagelegenheden uit OpenStreetMap en maakt automatisch slapende accounts aan per locatie. Ivo's koffiehuis bestaat al in IDidHere — hij weet het alleen nog niet.

> 🔐 **Juridisch belangrijk — Optie B:** De Nostr sleutel van elk slapend account wordt cryptografisch afgeleid van de GPS coördinaten van de locatie. Perry beheert deze sleutels niet. Niemand beheert ze. De eigenaar reconstrueert de sleutel door eigenaarschap van de locatie te bewijzen. Perry geeft de reconstructiemethode, nooit de sleutel zelf.

**Stap 2 — Travy maakt nieuwe locaties aan:**
Als een locatie nog niet bestaat maakt Travy hem aan — GPS automatisch, naam, één foto, 30 seconden. Travy ontvangt de **Founding Gans** 🪿👑 — de zeldzaamste gans die bestaat, slechts één per locatie ooit.

**Stap 3 — Deelbaar kaartje voor Horeca:**
IDidHere genereert automatisch een digitaal kaartje dat Travy kan delen:
- Afdrukken en achterlaten op tafel
- Sturen via WhatsApp
- Sturen via Nostr DM

Inhoud van het kaartje:
> 🪿 *"Hé [Café naam], iemand heeft jou ontdekt via IDidHere. Je hebt al [X] bezoekers gehad en [Y] sats ontvangen. Claim je account op idid.here/claim — je geld wacht op je."*

**Stap 4 — Claim flow zonder technisch jargon:**
Horeca scant QR, ziet bewijs van bezoekers en sats, bewijst eigenaarschap van de locatie, account geactiveerd. Woorden als Lightning, Nostr en sats verschijnen nergens in dit proces.

**De kernbelofte aan Horeca:**
> *"Je geld wacht op je."*

Dat is de sterkste salespitch die bestaat. Geen koude acquisitie. Nul acquisitiekosten.

---

### Punt 3 — LNbits single point of failure ✅ Opgelost

**Risico:** Perry draait LNbits op één server. Als die down gaat kunnen gebruikers hun sats niet bereiken. Perry beheert andermans private keys — juridisch en ethisch een grote verantwoordelijkheid.

**Oplossing — Perry beheert helemaal geen wallets:**

IDidHere is een NWC-compatible app. Perry beheert geen enkele sat, geen enkele seed phrase, geen enkele Lightning kanaal.

De wallet flow in drie fases:
- **Fase 0** — Eerst spelen zonder wallet. Bladeren, gansen verdienen, check-ins doen. Geen drempel.
- **Fase 1** — Bij eerste zap: Alby OAuth popup binnen IDidHere. Gebruiker verlaat de app nooit. Alby beheert de wallet, niet Perry.
- **Fase 2** — Eigen NWC wallet koppelen voor volledige zelfstandigheid.

Geen server van Perry. Geen seed phrases bij Perry. Geen custodian risico. Geen juridisch probleem.

---

### Punt 4 — Juridisch: twee vragen ✅ Grotendeels opgelost

**Risico 4A — Automatische splitsing als betaaldienst**
Een automatische 20% afsplitsing bij elke Lightning betaling kan juridisch als CASP activiteit worden gezien onder MiCA of PSD2 in België.

**Oplossing:** Splitsing volledig verwijderd. Perry werkt met een vrijwillige donatieknop. Een donatie is juridisch onomstotelijk geen betaaldienst. Perry verdient via zijn eigen rol als Travy, Tippy en Stamper — niet via commissies op andermans betalingen.

**Risico 4B — Slapende Horeca accounts met wachtende sats**
Sats die vastgehouden worden voor een Horeca eigenaar die nog niet geclaimed heeft kunnen als beheerd vermogen worden gezien.

**Oplossing:** Slapende accounts bevatten geen sats — alleen een bezoekersregistratie en potentiële waarde als motivatie voor claim. Als een gebruiker wil doneren aan een slapende locatie krijgt hij een time-locked HTLC — als Horeca niet claimt binnen 6 maanden gaan de sats automatisch terug. Perry beheert nooit andermans sats.

**Nog te doen:** Laten toetsen door een Bitcoin-savvy jurist — Timelex Brussel of DLA Piper België — met deze twee concrete vragen:
1. Valt het faciliteren van een gesplitste Lightning betaling onder CASP activiteit onder MiCA in België?
2. Valt het aanmaken van een Nostr account voor een derde partij waarnaar betalingen worden gestuurd onder beheer van andermans vermogen?

---

### Punt 5 — Privacy: publieke locatiedata ✅ Opgelost

**Risico:** Elke check-in is een Nostr event met GPS coördinaten, tijdstempel en publieke sleutel — voor altijd zichtbaar op een openbaar relay. Bij een miljoen gebruikers zijn stalkingscenario's en misbruik van locatiepatronen reëel.

**Oplossing — drie privacyniveaus via NIP-44 en NIP-59:**

Nostr heeft de cryptografische bouwstenen al ingebouwd. IDidHere gebruikt ze als eenvoudige instelling per check-in of bucketlist item:

| Instelling | Technisch | Zichtbaar voor |
|---|---|---|
| 🌍 **Publiek** | Standaard Nostr event | Iedereen |
| 👥 **Vrienden** | NIP-44 versleuteld voor volgers | Alleen wie Travy volgt |
| 🔒 **Privé** | NIP-44 + NIP-59 Gift Wrap | Alleen Travy zelf |

**NIP-44** versleutelt de inhoud van een event met ChaCha encryptie — de check-in staat wel op een relay maar ziet er voor iedereen anders uit als willekeurige tekst. Alleen Travy of mensen die hij toegang heeft gegeven kunnen het lezen.

**NIP-59 Gift Wrap** gaat een stap verder — niet alleen de inhoud maar ook het tijdstip en de afzender zijn verborgen. Volledig onzichtbaar voor buitenstaanders.

**Eerlijke beperking:** geen forward secrecy — als Travy's sleutel ooit gecompromitteerd wordt kunnen oude privé events ontsleuteld worden. Mitigatie: gebruikers informeren over dit risico en aanmoedigen sleutels goed te bewaren. Voor de meeste gebruikers is dit acceptabel — ze bewaken geen staatsgeheimen maar hun wandelroutes.

**Voor de gebruiker:** drie knoppen. Geen technische kennis vereist.

---

### Punt 6 — GPS spoofing bij grote uitdagingen ✅ Opgelost

**Risico:** Als Folly grote bedragen inzet op een uitdaging is GPS spoofing financieel aantrekkelijk. Iemand kan thuis een check-in faken op de Kilimanjaro.

**Wat Nostr heeft:** Geen geaccepteerde NIP voor proof of location. Het bestaat als voorstel maar is nooit gemerged in het officiële protocol. De oplossing zit in de app zelf.

**Oplossing — Graduated Trust Gate + Drempelwaarde:**

IDidHere berekent een vertrouwensscore per check-in op basis van sensor fusion:

| Signaal | Wat het detecteert |
|---|---|
| GPS coördinaten consistent met vorige locatie | Teleportatie onmogelijk |
| Accelerometer toont beweging passend bij route | Fysieke aanwezigheid |
| WiFi netwerken in omgeving kloppen | Lokale context |
| Tijdstip realistisch gezien vorige check-in | Tijdreizen onmogelijk |
| Apparaat in developer modus | Sterk spoofing signaal — score daalt direct |

**Drie acties op basis van score:**

```
Score hoog (>0.9) → PROCEED
GPS + sensoren consistent → gans + uitdaging sats vrijgegeven

Score middel (0.7-0.9) → STEP-UP vereist
QR code scan via Stamper nodig voor vrijgave sats
Gans wordt wel toegekend maar met lagere zeldzaamheid

Score laag (<0.7) → DENY
Check-in geweigerd voor uitdagingen met sats
Gans kan nog wel worden aangevraagd zonder sats
```

**Drempelwaarde voor uitdagingen:**

> Uitdagingen boven **10.000 sats** vereisen minimaal ⭐⭐⭐ verificatie — GPS + QR code of GPS + sociale bevestiging van een andere gebruiker op dezelfde locatie. Onder die drempel is GPS alleen acceptabel.

De drempelwaarde is instelbaar door Folly bij het aanmaken van de uitdaging — zij bepaalt hoe sterk het bewijs moet zijn voor haar bedrag.

**Vraag aan de bouwers:** implementeer sensor fusion als een score op de achtergrond — niet zichtbaar voor de gebruiker tenzij STEP-UP wordt geactiveerd. De gebruiker ervaart het alleen als er iets verdachts is.

---

### Punt 7 — Cura collusie ✅ Opgelost

**Risico:** Bevriende Cura's spreken af elkaars slechte beslissingen goed te keuren. Niemand verliest zijn borg. Kwaliteit daalt maar het systeem detecteert het niet. Bij financiële beslissingen — uitdagingen met sats — is collusie financieel aantrekkelijk.

**Oplossing — Jury van 10 willekeurige gebruikers:**

Bij elk issue selecteert het systeem automatisch willekeurige gebruikers met een minimale reputatiescore als tijdelijke jurors. Ze ontvangen een Nostr notificatie:

> *"Jij bent geselecteerd als juror voor een IDidHere beslissing. Het kost je 2 minuten. Jij ontvangt sats als je stemt."*

Ze zien de stelling, de context, stemmen ✅ of ❌. Meerderheid beslist. Stemmen is anoniem voor andere jurors. Elke gebruiker — Travy, Folly, Bro, Tippy, Stamper — kan juror worden. Geen vaste rol, geen borg vereist.

**Beslissingsmatrix per issue type:**

| Issue type | Beslisser | Jurors |
|---|---|---|
| Tip verwijderen — duidelijk geval | GansjeCura alleen | 0 |
| Tip verwijderen — twijfelgeval | Cura | 0 |
| Gebruiker waarschuwen | Cura | + 3 jurors |
| Gebruiker blokkeren | Cura | + 10 jurors |
| Uitdaging annuleren met sats | 10 jurors | Cura uitgesloten |

Het laatste punt is cruciaal — bij financiële beslissingen is Cura volledig uitgesloten als juror. Alleen willekeurige gebruikers beslissen over geld.

**Waarom collusie onmogelijk wordt:**
- 10 willekeurige gebruikers zijn niet te coördineren
- Anoniem stemmen voorkomt sociale druk
- Perry controleert de selectie niet — algoritme doet het
- Bevriende Cura's hebben geen invloed op juror selectie

**Vergoeding jurors:** kleine sat beloning per uitgebracht stem, gefinancierd uit de borg van de partij die in het ongelijk wordt gesteld. Als niemand in het ongelijk wordt gesteld betaalt het IDidHere systeem de vergoeding.

**Juror als nieuwe tijdelijke rol toegevoegd aan de cast** — zie sectie De Cast.

---

### Punt 8 — Business model dun bij lage volumes ✅ Opgelost

**Risico:** Bij lage volumes verdient Perry bijna niets. Een automatische commissie schaalt wel maar is juridisch risicovol. Een hobby is geen business.

**Beslissing:** IDidHere wordt open source. Geen business model nodig — het is infrastructuur. Zoals Bitcoin. Zoals Nostr zelf.

**Wat nodig is om versie 1 in de lucht te brengen:**

Minimale infrastructuurkosten omdat alles gedecentraliseerd is — geen centrale database, geen wallet server, geen grote hosting. Schatting voor versie 1: **€2.000 - €5.000** als Perry het zelf bouwt of met één developer. Grotendeels tijd, nauwelijks hosting.

**Hoe het zichzelf financiert — vier lagen:**

**Laag 1 — OpenSats aanvraag**
OpenSats is een non-profit die open source Bitcoin en Nostr projecten financiert via community donaties. Jack Dorsey heeft er $10 miljoen in gestopt. IDidHere past perfect in het profiel — open source, Nostr-gebaseerd, humanistische waarden, geen commercieel doel. Een aanvraag indienen kost een weekend schrijven en kan een basisbudget opleveren voor een jaar ontwikkeling.

> 📋 **Actie:** OpenSats aanvraag schrijven. URL: https://opensats.org/apply

**Laag 2 — Perry als actieve gebruiker**
Perry verdient als Travy, Tippy en Stamper. Elke zap op zijn tips, elke scan op zijn Stamper punten is direct inkomen. Niet als business maar als eerlijke beloning voor echte bijdragen. Consistent met Austrian Economics — waarde creëren en daar direct voor beloond worden.

**Laag 3 — Value for Value**
IDidHere heeft een eigen Lightning adres als open source project. Gebruikers die waarde ervaren zappen vrijwillig. Hetzelfde model als Podcasting 2.0 en de meeste Nostr clients. Geen verplichting, geen druk — werkt organisch bij een betrokken community.

**Laag 4 — Goosie Labs consultancy**
De code is open source. Perry verkoopt zijn kennis en tijd. Bedrijven, gemeenten en toerisme organisaties die een vergelijkbaar systeem willen kunnen Perry inhuren voor implementatie of aanpassing. Niet als product — als expertise.

**Samenvatting:**
> IDidHere is infrastructuur, geen product. Perry bouwt het omdat het de wereld beter maakt — en verdient er eerlijk aan als eerste en meest actieve gebruiker.

---

### Punt 9 — Nostr relay afhankelijkheid ✅ Opgelost

**Risico:** Als de relays die IDidHere gebruikt offline gaan of events censureren werkt de app niet. Bij de eerste honderd gebruikers op twee of drie relays is dit kwetsbaar.

**Oplossing — eigen IDidHere relay als gegarandeerde bodem:**

Perry draait een eigen Nostr relay op zijn eigen server. Lichtgewicht, goedkoop, en geeft het project volledige onafhankelijkheid. Dit is de gegarandeerde fallback — wat er ook gebeurt met andere relays, Perry's relay blijft draaien.

**Gebruiker kiest zelf via NIP-65:**
NIP-65 laat gebruikers hun eigen relay lijst instellen. IDidHere publiceert een aanbevolen lijst van betrouwbare relays maar dwingt niets af. Wie wil kan Perry's relay gebruiken, wie wil gebruikt zijn eigen.

**Relay strategie bij lancering:**

| Relay | Rol |
|---|---|
| Perry's eigen relay | Gegarandeerde fallback — altijd beschikbaar |
| 2-3 publieke Nostr relays | Redundantie en bereikbaarheid |
| Gebruiker's eigen relay | Volledig zelfstandig — eigen data, eigen controle |

**Technisch op Linux:**
```bash
# Nostr relay installeren — strfry is lichtgewicht en snel
git clone https://github.com/hoytech/strfry
cd strfry
make setup-dev
make
# Of via Docker:
docker run -p 7777:7777 ghcr.io/hoytech/strfry
```

**Kosten:** Een VPS van €5-10 per maand volstaat voor een relay in de beginfase. Schaalt mee met gebruikersaantallen.

**Consistentie met open source waarden:** Iedereen kan zijn eigen IDidHere relay draaien. De code is open source. Geen centrale afhankelijkheid.

---

### Punt 10 — De gans als NFT: juridisch grijs gebied ✅ Opgelost

**Risico:** De gans is uniek, zeldzaam en gekoppeld aan verificatieniveau. Dat klinkt als een NFT. Onder MiCA kan dat betekenen dat IDidHere een gereguleerd crypto asset uitgeeft.

**Waarom de gans geen NFT is:**

MiCA dekt over het algemeen geen non-fungible tokens tenzij ze in grote series worden uitgegeven of financiële kenmerken hebben. De gans heeft geen financiële kenmerken zolang hij niet verhandelbaar is. Hij is een digitaal bewijs van aanwezigheid — zoals een diploma of een stempel in een paspoort.

Twee fundamentele verschillen met NFTs:
- De gans is **niet verhandelbaar** — geen marktplaats, geen prijs, geen speculatieve waarde
- De gans heeft **geen financieel rendement** — hij bewijst dat je ergens bent geweest, meer niet

**Mitigatie — expliciete communicatie:**
In de app, documentatie en eventuele persberichten staat altijd:
> *"Gansen zijn niet-verhandelbare bewijzen van aanwezigheid. Ze vertegenwoordigen geen financiële waarde en zijn geen beleggingsinstrument."*

**Open source grens:** Als iemand in de toekomst een marktplaats wil bouwen op de gansen is dat zijn recht als open source gebruiker. Perry bouwt het niet en draagt er geen verantwoordelijkheid voor.

---

## Alle Tien Risico's — Volledig Overzicht

| Punt | Risico | Status | Kernoplossing |
|---|---|---|---|
| 1 | Lege inspiratielijst bij lancering | ✅ | GansjeTippy als persoonlijke reisagent bij aanmaken reis |
| 2 | Horeca begrijpt dit niet | ✅ | Slapende accounts + Travy als onbewuste ambassadeur + Founding Gans |
| 3 | LNbits single point of failure | ✅ | Perry beheert geen wallets — NWC + Alby OAuth binnen de app |
| 4 | Juridisch — custodial sats beheren | ✅ | Geen splitsing, geen custodian — donatie model + jurist raadplegen |
| 5 | Privacy — publieke locatiedata | ✅ | NIP-44 + NIP-59 — drie privacyniveaus, drie knoppen |
| 6 | GPS spoofing bij grote uitdagingen | ✅ | Sensor fusion + graduated trust gate + drempelwaarde per uitdaging |
| 7 | Cura collusie | ✅ | Jury van 10 willekeurige gebruikers — Cura uitgesloten bij financiële beslissingen |
| 8 | Business model dun bij lage volumes | ✅ | Open source — OpenSats + Perry als actieve gebruiker + V4V |
| 9 | Nostr relay afhankelijkheid | ✅ | Eigen relay als fallback + NIP-65 gebruiker kiest zelf |
| 10 | De gans als NFT — juridisch grijs gebied | ✅ | Niet verhandelbaar by design — expliciet gecommuniceerd |

**Nog openstaande acties voor lancering:**
- [ ] Juridisch advies inwinnen bij Bitcoin-savvy jurist — Timelex Brussel of DLA Piper België
- [ ] OpenSats aanvraag indienen — https://opensats.org/apply
- [ ] Eigen Nostr relay opzetten voor lancering

---

## Review als Doorgewinterde Nostr Bouwer

### Wat slimmer kan — samenvatting

| Observatie | Oplossing | Status |
|---|---|---|
| Geen custom event kinds gedefinieerd | Kind 37515-37519 definiëren als eerste stap | 🔴 Kritiek — zonder kinds werkt niets |
| Bucketlist niet op NIP-51 | NIP-51 Lists — gratis interoperabiliteit met heel Nostr | ✅ Verwerkt |
| Moderatie niet op NIP-72 | NIP-72 voor Cura structuur — bestaande tools werken meteen | ✅ Verwerkt |
| GansjeTippy niet als NIP-90 DVM | Open Data Vending Machine — elke app kan tips opvragen | ✅ Verwerkt |
| Klachten niet op NIP-56 | NIP-56 Reporting voor klachtknop — GansjeCura luistert | ✅ Verwerkt |
| App niet geregistreerd via NIP-89 | NIP-89 App Handlers — andere apps herkennen IDidHere events | ✅ Verwerkt |
| Horeca listings niet op NIP-99 | NIP-99 als tweede Horeca kanaal naast gesponsorde zaps | ✅ Verwerkt |
| NIP-32 labels niet gebruikt | Labels voor kwaliteit, verificatiescore, moderatiestatus | ✅ Verwerkt |

### De kernles voor de bouwers

> IDidHere hoeft geen wiel opnieuw uit te vinden. Bestaande NIPs dekken moderatie (NIP-72), lijsten (NIP-51), rapportage (NIP-56), AI taken (NIP-90), advertenties (NIP-99) en app integratie (NIP-89). Door deze te gebruiken wordt de app kleiner, sneller te bouwen, en automatisch interoperabel met het hele Nostr ecosysteem.

---

## De Gulden Regel Check

Voor elke actie: *zou je dit zelf ook willen ondergaan als gebruiker?*

| Actie | Check |
|---|---|
| Check-in met één tik | ✅ Ja — moeiteloos |
| Tip plaatsen in 60 seconden | ✅ Ja — laagdrempelig genoeg |
| Gans ontvangen als beloning | ✅ Ja — visueel en betekenisvol |
| Lightning wallet vereist voor bladeren | ❌ Nee — bladeren is altijd gratis en zonder wallet |
| Locatiedata publiek zonder keuze | ❌ Nee — drie privacyniveaus via NIP-44 en NIP-59 |
| Vrijwillige donatie in plaats van verplichte commissie | ✅ Ja — eerlijker en juridisch schoner |
| Slapende Horeca sats | ✅ Opgelost — geen sats vastgehouden, alleen bezoekersregistratie |
| Borg verliezen als Cura slecht presteert | ✅ Ja — eerlijk, je wist het van tevoren |
| Horeca bereikt klanten zonder algoritme | ✅ Ja — transparant en eerlijk |
| GPS spoofing mogelijk | ⚠️ Acceptabel — ganszeldszaamheid weerspiegelt betrouwbaarheid |

---

*Gemaakt op zaterdagavond. Bijgewerkt na kritische realiteitscheck.*
*Goosie Labs — https://goosielabs.com*
