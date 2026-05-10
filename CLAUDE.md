# IDidHere — Developer Briefing voor Claude Code
**Versie 1.0 · Goosie Labs · Perry Smit**

> Lees dit document volledig voor je één regel code schrijft. Alles wat je nodig hebt staat hier.

---

## 0. Context — Wat is IDidHere?

IDidHere is een open source web applicatie gebouwd op het Nostr protocol en het Bitcoin Lightning Network. Gebruikers ontdekken locaties, bezoeken ze fysiek, en ontvangen een unieke digitale badge (een "gans") als bewijs van aanwezigheid — opgeslagen op Nostr, voor altijd van henzelf.

**Kernprincipes die nooit worden geschonden:**
- Perry (de eigenaar) beheert nooit andermans sats of sleutels
- Alles wat kan gedecentraliseerd zijn, IS gedecentraliseerd
- Gebruiker verlaat de app nooit tijdens onboarding
- Geen technisch jargon zichtbaar voor eindgebruikers
- Open source — MIT licentie met aanvullende clausules

---

## 1. Tech Stack

### Frontend
```
Framework:    React 18 + TypeScript
Styling:      Tailwind CSS
Routing:      React Router v6
State:        Zustand (lichtgewicht, geen Redux overhead)
Maps:         Leaflet.js + OpenStreetMap tiles (gratis, open source)
Build:        Vite
```

### Backend — Minimaal
```
Runtime:      Bun
Framework:    Hono
Doel:         Alleen voor GansjeTippy AI calls (Anthropic API)
              Alle andere data loopt via Nostr relays
Hosting:      Eigen Linux VPS (Ubuntu 24)
```

### Nostr
```
Library:      nostr-tools (TypeScript, meest gebruikt in ecosysteem)
Relays:       wss://relay.goosielabs.com (primair)
              wss://relay.idid.here (secundair)
              wss://relay.damus.io (fallback)
```

### Bitcoin Lightning
```
Wallet:       NWC — Nostr Wallet Connect (NIP-47)
Onboarding:   Alby OAuth (popup binnen app)
Library:      @getalby/sdk
```

### Cryptografie
```
BIP39:        bip39 npm package
BIP44:        @scure/bip32
NIP-06:       nostr-tools/nip06
NIP-44:       nostr-tools/nip44
```

### Database
```
Geen centrale database.
Alle user data leeft op Nostr relays.
Lokale state via Zustand + localStorage voor sessie.
```

---

## 2. Repository Structuur

```
ididhere/
├── frontend/
│   ├── src/
│   │   ├── components/       # Herbruikbare UI componenten
│   │   ├── pages/            # Route-level componenten (S-01 t/m S-20)
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useNostr.ts   # Nostr verbinding en event publishing
│   │   │   ├── useWallet.ts  # NWC wallet connectie
│   │   │   ├── useGPS.ts     # GPS detectie + verificatiescore
│   │   │   └── useGoose.ts   # Gans generatie en NIP-58 badges
│   │   ├── lib/
│   │   │   ├── nostr/        # Nostr event builders per kind
│   │   │   ├── crypto/       # BIP39, NIP-06, NIP-44 helpers
│   │   │   ├── geohash/      # GPS → geohash conversie
│   │   │   └── verification/ # GPS trust score berekening
│   │   ├── store/            # Zustand stores
│   │   └── types/            # TypeScript types en interfaces
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── gansjeTippy.ts  # Anthropic API endpoint
│   │   └── index.ts
│   └── package.json
│
├── relay/                    # strfry configuratie
│   └── strfry.conf
│
├── LICENSE.md
├── README.md
└── CLAUDE.md                 # Dit bestand — instructies voor Claude Code
```

---

## 3. Nostr Event Kinds — Definieer Dit Eerst

Dit is de absolute eerste taak. Zonder deze kinds werkt niets.

```typescript
// src/lib/nostr/kinds.ts

export const IDIDHERE_KINDS = {
  LOCATION_TIP: 37515,    // Tippy plaatst een locatie
  CHECKIN: 37516,          // Travy checkt in
  BUCKETLIST_ITEM: 37517, // Bucketlist item (NIP-51 compatible)
  IWANT_THIS_TO: 37518,   // IWantThisTo event
  HORECA_CLAIM: 37519,    // Horeca claimt slapend account
} as const;
```

### Event Schema's

```typescript
// Kind 37515 — Locatie Tip
interface LocationTipEvent {
  kind: 37515;
  content: string;           // Beschrijving van de locatie
  tags: [
    ['d', string],           // Unieke identifier (geohash + naam)
    ['g', string],           // Geohash (NIP-52 compatible)
    ['lat', string],         // Latitude
    ['lon', string],         // Longitude
    ['name', string],        // Naam van de locatie
    ['t', string],           // Category tag (food/nature/culture/etc)
    ['p', string]?,          // Optioneel: pubkey van eigenaar (Horeca)
    ['L', 'quality']?,       // NIP-32 label namespace
    ['l', string, 'quality']? // NIP-32 kwaliteitslabel
  ];
}

// Kind 37516 — Check-in
interface CheckinEvent {
  kind: 37516;
  content: string;           // Optionele notitie (NIP-44 encrypted indien privé)
  tags: [
    ['d', string],           // Locatie identifier (ref naar kind 37515)
    ['g', string],           // Geohash
    ['lat', string],
    ['lon', string],
    ['verification', '1'|'2'|'3'|'4'], // Verificatiescore ⭐ t/m ⭐⭐⭐⭐
    ['goose', string],       // Gegenereerde gans identifier
    ['badge', string]?,      // NIP-58 badge event id
    ['privacy', 'public'|'friends'|'private']
  ];
}

// Kind 37517 — Bucketlist Item
interface BucketlistItemEvent {
  kind: 37517;
  content: string;
  tags: [
    ['d', string],
    ['e', string],           // Ref naar kind 37515 locatie event
    ['privacy', 'public'|'friends'|'private'],
    ['status', 'todo'|'done'],
    ['trip', string]?        // Optioneel: reis identifier (NIP-52)
  ];
}
```

---

## 4. Versie 1 Scope — Wat Bouwen We WEL

### Must Have (MVP)
```
✅ S-01  Landing pagina met invite URL support
✅ S-02  Seed phrase generatie + backup bevestiging (BIP39 + NIP-06)
✅ S-03  Wallet koppelen via Alby OAuth (popup, geen redirect)
✅ S-04  Welkomstscherm met eerste gans
✅ S-05  Kaart met locaties (Leaflet + OpenStreetMap)
✅ S-06  Locatie detail pagina
✅ S-07  Check-in flow — GPS verificatie + privacy keuze
✅ S-08  Gans ontvangen animatie + NIP-58 badge opslaan
✅ S-09  Reis aanmaken (NIP-52 + GansjeTippy activeren)
✅ S-10  Bucketlist beheren (NIP-51)
✅ S-14  Profiel met ganzencollectie
✅ S-17  Nieuwe locatie aanmaken + Founding Gans + deelbaar kaartje
✅ S-19  Horeca claim flow
```

### GansjeTippy (Backend)
```
✅ POST /api/gansjeTippy
   Input:  { destination, userProfile, existingTips }
   Output: LocationTipEvent[]
   Model:  claude-sonnet-4-20250514
   Prompt: Genereer 10-15 locatie tips voor [bestemming] passend bij
           het profiel van de gebruiker. Antwoord alleen in JSON.
```

### Gans Generatie
```
✅ Deterministische gans op basis van geohash + verificatiescore
   Geen externe API — gegenereerd als SVG in de browser
   Zeldzaamheid: ⭐ = common, ⭐⭐⭐⭐ = legendary
```

---

## 5. Wat Bouwen We NIET in Versie 1

```
❌ S-11  IWantThisTo matching (versie 2)
❌ S-12  Social feed (versie 2)
❌ S-13  Uitdaging plaatsen UI (NIP-75 — versie 2)
❌ S-15  Uitnodigingen dashboard (versie 2)
❌ S-16  Tippy dashboard (versie 2)
❌ S-18  Stamper dashboard (versie 2)
❌ S-20  Horeca advertentie dashboard (versie 2)
❌       QR code verificatie (versie 2)
❌       GansjeCura moderatie (versie 2)
❌       Jury systeem (versie 2)
❌       WeDidThis (versie 2)
❌       Mobile app (versie 2)
```

---

## 6. Kritieke Implementatiedetails

### 6.1 Seed Phrase Onboarding

```typescript
// src/lib/crypto/onboarding.ts
import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import { getPublicKey, nip06 } from 'nostr-tools';

export async function generateUserKeys() {
  // 1. Genereer BIP39 mnemonic
  const mnemonic = bip39.generateMnemonic(128); // 12 woorden

  // 2. Leid Nostr sleutel af via NIP-06
  const privateKey = nip06.privateKeyFromSeedWords(mnemonic);
  const publicKey = getPublicKey(privateKey);

  // 3. Leid Bitcoin adres af via BIP44
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hdKey = HDKey.fromMasterSeed(seed);
  const btcKey = hdKey.derive("m/44'/0'/0'/0/0");

  return { mnemonic, privateKey, publicKey, btcKey };
}

// KRITIEK: Seed phrase NOOIT opslaan in localStorage of server
// Gebruiker is zelf verantwoordelijk na bevestiging
```

### 6.2 GPS Verificatiescore

```typescript
// src/lib/verification/trustScore.ts

interface VerificationInput {
  userLat: number;
  userLon: number;
  targetLat: number;
  targetLon: number;
  isDevMode: boolean;        // Developer modus detectie
  wifiNetworks?: string[];   // Omliggende WiFi netwerken
  previousCheckin?: {        // Vorige check-in voor teleportatie check
    lat: number;
    lon: number;
    timestamp: number;
  };
}

export function calculateTrustScore(input: VerificationInput): {
  score: number;             // 0.0 — 1.0
  level: 1 | 2 | 3 | 4;    // ⭐ t/m ⭐⭐⭐⭐
  action: 'PROCEED' | 'STEP_UP' | 'DENY';
  reasons: string[];
} {
  let score = 0;

  // Developer modus = direct DENY voor uitdagingen
  if (input.isDevMode) {
    return { score: 0, level: 1, action: 'DENY', reasons: ['Developer mode detected'] };
  }

  // GPS binnen 50m = basis score
  const distance = haversineDistance(
    input.userLat, input.userLon,
    input.targetLat, input.targetLon
  );
  if (distance <= 50) score += 0.5;
  else if (distance <= 100) score += 0.2;
  else return { score: 0, level: 1, action: 'DENY', reasons: ['Too far from location'] };

  // Teleportatie check
  if (input.previousCheckin) {
    const timeDiff = (Date.now() - input.previousCheckin.timestamp) / 1000 / 60; // minuten
    const prevDistance = haversineDistance(
      input.previousCheckin.lat, input.previousCheckin.lon,
      input.userLat, input.userLon
    );
    const maxRealisticSpeed = 200; // km/h
    const maxRealisticDistance = (maxRealisticSpeed * timeDiff) / 60;
    if (prevDistance > maxRealisticDistance * 1000) {
      return { score: 0, level: 1, action: 'DENY', reasons: ['Impossible travel speed'] };
    }
    score += 0.3;
  }

  // WiFi bonus
  if (input.wifiNetworks && input.wifiNetworks.length > 0) score += 0.2;

  // Score → level mapping
  const level = score >= 0.9 ? 4 : score >= 0.7 ? 3 : score >= 0.5 ? 2 : 1;
  const action = score >= 0.7 ? 'PROCEED' : score >= 0.4 ? 'STEP_UP' : 'DENY';

  return { score, level, action, reasons: [] };
}
```

### 6.3 Gans Generatie — Deterministisch SVG

```typescript
// src/lib/goose/generator.ts

export function generateGoose(geohash: string, verificationLevel: 1|2|3|4): string {
  // Deterministische seed op basis van geohash
  const seed = hashCode(geohash);

  // Eigenschappen op basis van seed
  const colors = ['#f5a623', '#7b61ff', '#00d4aa', '#ff6b6b', '#4ecdc4'];
  const accessories = ['none', 'hat', 'scarf', 'crown', 'halo'];
  const backgrounds = ['#0a0a0f', '#1a1a2e', '#16213e', '#0f3460'];

  const color = colors[seed % colors.length];
  const accessory = accessories[Math.min(verificationLevel - 1, accessories.length - 1)];
  const bg = backgrounds[(seed >> 2) % backgrounds.length];
  const eyeColor = verificationLevel >= 4 ? '#ffd700' : '#ffffff';

  // SVG gans — uniek per locatie, zeldzamer naarmate verificatie hoger
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <!-- Gans body -->
    <ellipse cx="50" cy="65" rx="25" ry="20" fill="${color}"/>
    <!-- Gans hoofd -->
    <circle cx="65" cy="40" r="15" fill="${color}"/>
    <!-- Snavel -->
    <ellipse cx="78" cy="40" rx="8" ry="4" fill="#ff9500"/>
    <!-- Oog -->
    <circle cx="70" cy="37" r="3" fill="${eyeColor}"/>
    <!-- Verificatie sterren -->
    ${'⭐'.repeat(verificationLevel).split('').map((_, i) =>
      `<text x="${30 + i * 12}" y="95" font-size="10">${verificationLevel >= i+1 ? '★' : '☆'}</text>`
    ).join('')}
    ${accessory === 'crown' ? '<path d="M55 20 L60 30 L65 20 L70 30 L75 20" stroke="gold" fill="gold"/>' : ''}
  </svg>`;
}
```

### 6.4 Slapende Horeca Accounts — Cryptografische Sleutelafleiding

```typescript
// src/lib/nostr/dormantAccount.ts
// JURIDISCH KRITIEK: Perry beheert deze sleutels NOOIT

import { HDKey } from '@scure/bip32';
import { sha256 } from '@noble/hashes/sha256';

export function deriveDormantKey(lat: number, lon: number): {
  privateKey: string;
  publicKey: string;
  // NOOIT opslaan — alleen genereren voor claim verificatie
} {
  // Deterministische seed op basis van GPS coördinaten (6 decimalen = ~10cm nauwkeurig)
  const coordString = `${lat.toFixed(6)},${lon.toFixed(6)}`;
  const seed = sha256(new TextEncoder().encode(coordString));

  const hdKey = HDKey.fromMasterSeed(seed);
  const derived = hdKey.derive("m/44'/1237'/0'/0/0"); // NIP-06 pad

  return {
    privateKey: Buffer.from(derived.privateKey!).toString('hex'),
    publicKey: Buffer.from(derived.publicKey!).toString('hex')
  };
}

// Horeca claimt account door GPS coördinaten van zijn locatie te bewijzen
// Perry heeft nooit toegang tot de private key
```

### 6.5 Relay Beheer — Gebruiker Kiest Zelf (NIP-65)

```typescript
// src/lib/nostr/relays.ts
import { nip65 } from 'nostr-tools';

// Standaard relays — altijd actief
export const DEFAULT_RELAYS = [
  'wss://relay.goosielabs.com',  // Primair — Goosie Labs
  'wss://relay.idid.here',       // Secundair — IDidHere
  'wss://relay.damus.io',        // Fallback — publiek
];

// Gebruiker relays ophalen uit NIP-65 profiel event
export async function getUserRelays(pubkey: string): Promise<string[]> {
  const relayListEvent = await fetchEvent({ kinds: [10002], authors: [pubkey] });
  if (!relayListEvent) return [];
  return nip65.parseRelayList(relayListEvent).map(r => r.url);
}

// Gebruiker relay toevoegen — opgeslagen als NIP-65 event
export async function addUserRelay(
  privateKey: string,
  relayUrl: string,
  mode: 'read' | 'write' | 'both' = 'both'
): Promise<void> {
  const existing = await getUserRelays(getPublicKey(privateKey));
  const updated = [...new Set([...existing, relayUrl])];

  const event = nip65.makeRelayListEvent(
    updated.map(url => ({ url, mode: url === relayUrl ? mode : 'both' }))
  );

  await publishEvent(event, privateKey, DEFAULT_RELAYS);
}

// Gecombineerde relay lijst — standaard + gebruiker eigen relays
export async function getActiveRelays(pubkey?: string): Promise<string[]> {
  if (!pubkey) return DEFAULT_RELAYS;
  const userRelays = await getUserRelays(pubkey);
  return [...new Set([...DEFAULT_RELAYS, ...userRelays])];
}
```

**UI voor relay beheer — Instellingen pagina:**
```
Standaard relays (altijd actief):
  ✅ wss://relay.goosielabs.com
  ✅ wss://relay.idid.here
  ✅ wss://relay.damus.io

Jouw eigen relays:
  [+ Relay toevoegen]  ← invoerveld voor wss:// URL
  Opgeslagen als NIP-65 event op je Nostr profiel
```

---

### 6.6 Alby OAuth — Wallet Koppelen Zonder Redirect

```typescript
// src/hooks/useWallet.ts
import { webln } from '@getalby/sdk';

export function useWallet() {
  const connectAlby = async () => {
    // Opent als popup BINNEN de app — gebruiker verlaat nooit IDidHere
    const nwc = await webln.requestProvider();
    await nwc.enable();

    // Sla NWC connection string op in localStorage
    // NOOIT de private key opslaan
    const info = await nwc.getInfo();
    return info;
  };

  const zapLocation = async (recipientLnAddress: string, amountSats: number) => {
    const provider = await webln.requestProvider();
    await provider.sendPayment(recipientLnAddress, amountSats * 1000); // msat
  };

  return { connectAlby, zapLocation };
}
```

---

## 7. GansjeTippy Backend

```typescript
// backend/src/routes/gansjeTippy.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function gansjeTippyHandler(c: Context) {
  const { destination, userProfile, existingTips } = await c.req.json();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: `Je bent GansjeTippy 🪿 — een lokale ontdekkingsagent voor IDidHere.
Je genereert locatietips die VERRASSEND zijn — niet wat iedereen al weet.
Geen toeristische clichés. Denk aan: verborgen plekken, lokale markten,
onbekende uitkijkpunten, authentieke eetgelegenheden die locals gebruiken.

ANTWOORD ALLEEN IN GELDIG JSON. Geen preamble, geen markdown.

Schema:
{
  "tips": [
    {
      "name": "string",
      "description": "string (max 150 tekens)",
      "lat": number,
      "lon": number,
      "category": "food|nature|culture|nightlife|market|viewpoint|hidden",
      "bestTime": "morning|afternoon|evening|anytime",
      "confidence": "human|ai_generated",
      "tags": ["string"]
    }
  ]
}`,
    messages: [{
      role: 'user',
      content: `Genereer 10-15 verrassende locatietips voor: ${destination}
Gebruikersprofiel: ${JSON.stringify(userProfile)}
Al bekende tips om te vermijden: ${existingTips.map((t: any) => t.name).join(', ')}`
    }]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const parsed = JSON.parse(text);
    return c.json(parsed);
  } catch {
    return c.json({ error: 'Parse error', raw: text }, 500);
  }
}
```

---

## 8. Relay Setup op Linux

```bash
# Op Ubuntu 24 VPS

# 1. strfry installeren
git clone https://github.com/hoytech/strfry
cd strfry
apt install -y git build-essential libyaml-perl wget
make setup-dev
make -j4

# 2. Configuratie aanpassen
# strfry.conf — filter alleen IDidHere kinds
# allowedKinds: [37515, 37516, 37517, 37518, 37519, 0, 3, 10002]

# 3. Als service draaien
cp strfry /usr/local/bin/
systemctl enable strfry
systemctl start strfry

# 4. Nginx proxy voor wss://
# relay.idid.here → localhost:7777
```

---

## 9. Omgevingsvariabelen

```bash
# frontend/.env
VITE_RELAY_PRIMARY=wss://relay.goosielabs.com
VITE_RELAY_SECONDARY=wss://relay.idid.here
VITE_RELAY_FALLBACK=wss://relay.damus.io
# Gebruiker eigen relays worden opgeslagen via NIP-65 in hun Nostr profiel
# en worden automatisch geladen naast de standaard relays
VITE_BACKEND_URL=https://api.idid.here
VITE_ALBY_CLIENT_ID=<van Alby developer portal>

# backend/.env
ANTHROPIC_API_KEY=<van Anthropic console>
PORT=3000
ALLOWED_ORIGINS=https://idid.here
```

---

## 10. Testcriteria — Wanneer is Versie 1 Klaar?

### Kritieke paden die 100% moeten werken:

```
✅ Onboarding flow
   - Invite URL openen → seed phrase genereren → bevestigen → app gebruiken
   - Seed phrase wordt NOOIT opgeslagen op server
   - Alby OAuth opent als popup — geen redirect

✅ Check-in flow
   - GPS detecteren → verificatiescore berekenen → gans genereren
   - Gans opgeslagen als NIP-58 event op relay
   - Privacy instelling respecteerd (NIP-44 voor vrienden/privé)

✅ GansjeTippy
   - Reis aanmaken → Anthropic API aanroepen → tips tonen op kaart
   - Tips duidelijk gemarkeerd als AI-gegenereerd

✅ Horeca claim
   - Slapend account zichtbaar met bezoekersaantal
   - Claim flow werkt zonder Bitcoin kennis van Horeca eigenaar

✅ Relay
   - Events publiceren naar eigen relay
   - Events ophalen en tonen op kaart via geohash filter
```

### Niet-functionele eisen:
```
- Eerste load < 3 seconden
- GPS detectie < 2 seconden
- Check-in flow < 5 seconden van knop tot gans
- Werkt op Chrome, Firefox, Safari (desktop)
- Geen externe trackers of analytics
```

---

## 11. Wat Claude Code Nooit Mag Doen

```
🚫 Seed phrases opslaan in database, localStorage, of server logs
🚫 Private keys doorsturen naar backend
🚫 Fondsen van gebruikers bewaren of doorsturen
🚫 Gebruikers redirecten buiten de app voor wallet koppeling
🚫 GPS coördinaten opslaan zonder expliciete gebruikerstoestemming
🚫 Technisch jargon (Nostr, Lightning, sats, NIP) tonen aan eindgebruikers
   tenzij in een expliciete "geavanceerde instellingen" sectie
🚫 Externe analytics of tracking toevoegen
```

---

## 12. Startcommando voor Claude Code

Geef Claude Code dit als eerste prompt:

```
Lees CLAUDE.md volledig.

Begin met het bouwen van IDidHere versie 1 in de volgorde:

1. Repository structuur aanmaken
2. src/lib/nostr/kinds.ts definiëren
3. src/lib/crypto/onboarding.ts implementeren
4. src/lib/verification/trustScore.ts implementeren
5. src/lib/goose/generator.ts implementeren
6. Pagina S-02 (Seed Phrase) bouwen en testen
7. Pagina S-05 (Kaart) bouwen met Leaflet
8. Check-in flow (S-07 → S-08) bouwen
9. GansjeTippy backend bouwen
10. Alle overige V1 pagina's bouwen

Vraag bij twijfel over scope: staat het in de Must Have lijst van sectie 6?
Als nee: bouw het niet voor versie 1.
```

---

## 13. Referentie Documenten

Alle aanvullende documentatie staat in de `/docs` map:

| Bestand | Inhoud |
|---|---|
| `IDidHere.md` | Volledig productdocument — personas, user stories, NIPs |
| `IDidHere_Journey_Sofia.md` | User journey Travy & Bro in Sofia |
| `IDidHere_Journey_Stamper.md` | User journey Dimitar als Stamper |
| `IDidHere_Juridische_Briefing.md` | Juridische analyse + gesimuleerd advies |
| `IDidHere_Screenflow.html` | Interactieve screenflow met wireframes |
| `IDidHere_LICENSE.md` | MIT licentie met aanvullende clausules |

---

*IDidHere — Open Source · Goosie Labs · https://goosielabs.com*
*Developer Briefing v1.0 · Perry Smit · 2026*
