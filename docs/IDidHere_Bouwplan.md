# IDidHere — Bouwplan Dag 1
**Voor Perry · Maandag · Linux terminal**

> Lees dit van boven naar beneden. Volg de volgorde. Sla geen stappen over.

---

## Voorbereiding — Voor je begint

### Wat je nodig hebt
```bash
# Check of dit allemaal aanwezig is
node --version          # Moet 20+ zijn
git --version           # Moet aanwezig zijn
bun --version           # Installeer als niet aanwezig:
curl -fsSL https://bun.sh/install | bash
```

### GitHub account + repository aanmaken
1. Ga naar github.com
2. Maak een nieuwe repository aan: `ididhere`
3. Zet op Public (open source)
4. Voeg `MIT License` toe
5. Kopieer de repository URL

---

## Stap 1 — Repository opzetten
```bash
# Maak lokale map aan
mkdir ~/projects/ididhere
cd ~/projects/ididhere

# Git initialiseren
git init
git remote add origin https://github.com/[jouw-username]/ididhere.git

# Mapstructuur aanmaken
mkdir -p frontend/src/{components,pages,hooks,lib/{nostr,crypto,geohash,verification,goose},store,types}
mkdir -p backend/src/routes
mkdir -p docs
mkdir -p relay

# Alle documentatie in docs zetten
cp ~/Downloads/IDidHere.md docs/
cp ~/Downloads/IDidHere_CLAUDE.md ./CLAUDE.md
cp ~/Downloads/IDidHere_LICENSE.md ./LICENSE.md
cp ~/Downloads/IDidHere_Screenflow.html docs/
cp ~/Downloads/IDidHere_Journey_Sofia.md docs/
cp ~/Downloads/IDidHere_Journey_Stamper.md docs/
cp ~/Downloads/IDidHere_Juridische_Briefing.md docs/
```

### 📦 COMMIT 1 — Repository fundament
```bash
git add .
git commit -m "chore: initial repository setup with documentation"
git push -u origin main
```

---

## Stap 2 — Frontend opzetten met Vite + React

```bash
cd ~/projects/ididhere
bun create vite frontend --template react-ts
cd frontend
bun install

# Dependencies installeren
bun add nostr-tools @getalby/sdk leaflet react-leaflet
bun add bip39 @scure/bip32 @noble/hashes
bun add zustand react-router-dom
bun add -d @types/leaflet tailwindcss autoprefixer postcss

# Tailwind initialiseren
bunx tailwindcss init -p
```

### Tailwind configureren
```bash
# tailwind.config.js aanpassen
cat > frontend/tailwind.config.js << 'EOF'
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        goose: {
          orange: '#f5a623',
          purple: '#7b61ff',
          green: '#00d4aa',
          bg: '#0a0a0f',
          surface: '#13131a',
        }
      }
    }
  },
  plugins: []
}
EOF
```

### 📦 COMMIT 2 — Frontend setup
```bash
cd ~/projects/ididhere
git add .
git commit -m "feat: frontend setup with React, TypeScript, Tailwind, Nostr tools"
git push
```

---

## Stap 3 — Nostr Kinds definiëren
**Dit is de eerste echte code. Zonder dit werkt niets.**

```bash
cat > frontend/src/lib/nostr/kinds.ts << 'EOF'
export const IDIDHERE_KINDS = {
  LOCATION_TIP: 37515,
  CHECKIN: 37516,
  BUCKETLIST_ITEM: 37517,
  IWANT_THIS_TO: 37518,
  HORECA_CLAIM: 37519,
} as const;

export const DEFAULT_RELAYS = [
  'wss://relay.goosielabs.com',
  'wss://relay.idid.here',
  'wss://relay.damus.io',
];
EOF
```

### 📦 COMMIT 3 — Nostr kinds
```bash
git add .
git commit -m "feat: define IDidHere custom Nostr event kinds 37515-37519"
git push
```

---

## Stap 4 — Shakespeare.diy voor de UI

### Account aanmaken op Shakespeare.diy
1. Ga naar **shakespeare.diy**
2. Login met je Nostr sleutel — of genereer een nieuwe
3. Maak een nieuw project aan: `IDidHere Frontend`

### Hoe je Shakespeare gebruikt voor IDidHere

**Geef Shakespeare dit als context aan het begin van elk gesprek:**
```
Ik bouw IDidHere — een open source Nostr + Lightning app.
Tech stack: React 18 + TypeScript + Tailwind + nostr-tools + Leaflet.

Kleurenpalet:
- Achtergrond: #0a0a0f
- Surface: #13131a
- Oranje accent: #f5a623
- Paars accent: #7b61ff
- Groen accent: #00d4aa
- Tekst: #e8e8f0

Font: Space Mono voor titels/code, DM Sans voor body tekst.

Bouw elk scherm als een standalone React component.
Gebruik Tailwind voor styling.
Geen externe component libraries.
```

### Volgorde voor Shakespeare — screen voor screen

**Sessie 1 — Onboarding (S-01 t/m S-04)**
```
Prompt 1:
"Bouw de Landing pagina (S-01) voor IDidHere.
URL: idid.here/join?ref=perry
Inhoud:
- Navbar met logo 🪿 IDidHere en Login knop
- Hero sectie met grote gans emoji, titel 'Ontdek. Doe. Bewijs.',
  subtitel en twee knoppen: 'Begin met ontdekken' (oranje) en 'Meer info' (grijs)
- Drie feature items met iconen: verrassende plekken, gans bewijs, sats verdienen
Gebruik het donkere kleurenpalet."

Prompt 2:
"Bouw de Seed Phrase pagina (S-02).
URL: idid.here/onboarding/keys
Inhoud:
- Stap 1 van 2 label
- Gele waarschuwingsbanner: 'Schrijf deze 12 woorden op'
- Grid van 12 woorden in donkere capsules (gebruik placeholder woorden)
- Checkbox bevestiging: 'Ik heb mijn 12 woorden opgeschreven'
- Oranje doorgaan knop
KRITIEK: geen skip knop op dit scherm."

Prompt 3:
"Bouw de Wallet Koppelen pagina (S-03).
URL: idid.here/onboarding/wallet
Inhoud:
- Stap 2 van 2 label
- Twee opties als klikbare kaarten: Alby wallet (oranje rand) en eigen NWC wallet
- Overslaan link onderaan in grijs
- Blauwe info banner: wallet is optioneel"

Prompt 4:
"Bouw het Welkomstscherm (S-04).
URL: idid.here/welcome
Inhoud:
- Grote gans animatie in gouden gradient box
- Titel: 'Je eerste gans!'
- Drie statistieken: Gansen / Check-ins / Sats
- Grote oranje knop: 'Beginnen met ontdekken'"
```

**Sessie 2 — Kaart en Ontdekken (S-05 t/m S-08)**
```
Prompt 5:
"Bouw de Kaart pagina (S-05) met Leaflet.
URL: idid.here/map
Inhoud:
- Navbar met locatie dropdown en filter knop
- Leaflet kaart met OpenStreetMap tiles, donker thema
- Drie tabs onder kaart: 'In de buurt' / 'Trending' / '🪿 GansjeTippy'
- Lijst van locaties met icoon, naam, verificatiescore sterren, afstand, + knop
- Bottom navigation: Kaart / Lijst / Bucket / Profiel"

Prompt 6:
"Bouw de Locatie Detail pagina (S-06).
Inhoud:
- Kleine kaart bovenaan
- Naam, categorie, geplaatst door wie, verificatiescore
- Beschrijving tekst
- Horeca aanbod in groene box (als aanwezig)
- Vier knoppen: Bucketlist toevoegen / IWantThisTo (paars) / Zap tip-gever / IDidHere (groen)"

Prompt 7:
"Bouw de Check-in pagina (S-07).
Inhoud:
- Privacy keuze: drie knoppen Publiek / Vrienden / Privé
- GPS status indicator met groen vinkje als binnen 50m
- WiFi netwerk bevestiging
- Verificatiescore tonen: ⭐⭐ REDELIJK
- Grote oranje 'IDidHere!' knop
- Klein grijs tekstje over Nostr opslag"

Prompt 8:
"Bouw de Gans Ontvangen pagina (S-08).
Inhoud:
- Grote gans in gouden gradient box met animatie (CSS pulse of bounce)
- Naam van de gans: 'Marktgans van Sofia'
- Zeldzaamheid en badge nummer
- Groene uitdaging box als uitdaging was gekoppeld
- Twee knoppen: Delen / Collectie bekijken"
```

**Sessie 3 — Reis en Profiel (S-09, S-10, S-14, S-17, S-19)**
```
Prompt 9:  Reis Aanmaken (S-09)
Prompt 10: Bucketlist (S-10)
Prompt 11: Profiel met ganzencollectie (S-14)
Prompt 12: Nieuwe Locatie Aanmaken + Founding Gans (S-17)
Prompt 13: Horeca Claim (S-19)
```

### Code van Shakespeare naar je repository
Na elke voltooide pagina:
1. Download de code als ZIP in Shakespeare
2. Kopieer het component naar `frontend/src/pages/`
3. Commit direct

```bash
# Na elke pagina van Shakespeare
git add frontend/src/pages/[nieuwe-pagina].tsx
git commit -m "feat: add [S-0X] [naam pagina] screen"
git push
```

---

## Stap 5 — Cryptografie implementeren met Claude Code

**Start Claude Code na de frontend screens klaar zijn.**

```bash
cd ~/projects/ididhere
claude  # Start Claude Code — leest CLAUDE.md automatisch
```

**Geef Claude Code dit startcommando:**
```
Lees CLAUDE.md sectie 6 volledig.
Implementeer in deze volgorde:
1. frontend/src/lib/crypto/onboarding.ts (sectie 6.1)
2. frontend/src/lib/verification/trustScore.ts (sectie 6.2)
3. frontend/src/lib/goose/generator.ts (sectie 6.3)
4. frontend/src/lib/nostr/dormantAccount.ts (sectie 6.4)
5. frontend/src/lib/nostr/relays.ts (sectie 6.5)
6. frontend/src/hooks/useWallet.ts (sectie 6.6)

Na elke implementatie: schrijf een simpele test die bewijst dat het werkt.
Vraag bij twijfel altijd: "staat dit in de Must Have lijst van sectie 6?"
```

### 📦 COMMIT na elke lib implementatie
```bash
# Na onboarding.ts
git add frontend/src/lib/crypto/
git commit -m "feat: BIP39 seed phrase + NIP-06 Nostr key derivation"
git push

# Na trustScore.ts
git add frontend/src/lib/verification/
git commit -m "feat: GPS trust score calculation with sensor fusion"
git push

# Na generator.ts
git add frontend/src/lib/goose/
git commit -m "feat: deterministic SVG goose generator per location"
git push

# Na dormantAccount.ts
git add frontend/src/lib/nostr/dormantAccount.ts
git commit -m "feat: cryptographic dormant account key derivation from GPS coords"
git push

# Na relays.ts
git add frontend/src/lib/nostr/relays.ts
git commit -m "feat: NIP-65 relay management with user custom relays"
git push

# Na useWallet.ts
git add frontend/src/hooks/
git commit -m "feat: Alby OAuth wallet connection via NWC"
git push
```

---

## Stap 6 — Backend opzetten

```bash
cd ~/projects/ididhere/backend
bun init
bun add hono @anthropic-ai/sdk
bun add -d @types/bun
```

**Geef Claude Code dit commando:**
```
Implementeer de GansjeTippy backend uit CLAUDE.md sectie 7.
Bestand: backend/src/routes/gansjeTippy.ts
Zorg voor:
- CORS headers voor frontend domein
- Input validatie
- Error handling
- Anthropic API claude-sonnet-4-20250514
Test met: bun run backend/src/index.ts
```

### 📦 COMMIT backend
```bash
git add backend/
git commit -m "feat: GansjeTippy backend with Anthropic API integration"
git push
```

---

## Stap 7 — Alles samenvoegen

```bash
# Frontend bouwen
cd frontend
bun run build

# Testen
bun run dev
# Open browser: http://localhost:5173

# Backend testen
cd ../backend
bun run src/index.ts
# Open tweede terminal, test met:
curl -X POST http://localhost:3000/api/gansjeTippy \
  -H "Content-Type: application/json" \
  -d '{"destination":"Sofia, Bulgaria","userProfile":{},"existingTips":[]}'
```

### 📦 COMMIT — Versie 1 alpha
```bash
cd ~/projects/ididhere
git add .
git commit -m "feat: IDidHere v1.0.0-alpha — complete frontend + backend"
git tag v1.0.0-alpha
git push
git push --tags
```

---

## Git Commandos Spiekbriefje

```bash
# Status checken — doe dit altijd voor een commit
git status

# Specifiek bestand toevoegen
git add pad/naar/bestand.ts

# Alles toevoegen
git add .

# Commit met boodschap
git commit -m "feat: [wat je hebt gebouwd]"

# Push naar GitHub
git push

# Nieuwe branch voor experimenteel werk
git checkout -b experiment/gans-animatie

# Terug naar main
git checkout main

# Branch samenvoegen
git merge experiment/gans-animatie

# Ongedaan maken (voor commit)
git restore bestand.ts

# Geschiedenis bekijken
git log --oneline
```

### Commit boodschap conventie
```
feat:     nieuwe functionaliteit
fix:      bug opgelost
chore:    setup, dependencies, configuratie
docs:     documentatie
refactor: code verbetering zonder nieuwe functionaliteit
test:     tests toevoegen
```

---

## Wanneer Commiten?

**Altijd commiten na:**
- ✅ Elke nieuwe pagina van Shakespeare
- ✅ Elke lib implementatie van Claude Code
- ✅ Werkende feature — ook als niet perfect
- ✅ Einde van de werkdag
- ✅ Voor je iets groots gaat veranderen
- ✅ Als tests slagen

**Nooit commiten als:**
- ❌ App crasht bij opstarten
- ❌ Seed phrase zichtbaar in console logs
- ❌ API keys hardcoded in code

---

## Stoïcijnse reminder voor als het vastloopt

> Een foutmelding is geen mislukking. Het is informatie.
> Kopieer de error, geef hem aan Claude Code, ga verder.
> Commit wat werkt. Bouw wat niet werkt morgen.

---

## Einde van Dag 1 — Checklist

```
□ Repository aangemaakt op GitHub
□ Alle documentatie in /docs
□ Nostr kinds gedefinieerd (kinds.ts)
□ Minimaal S-01 t/m S-04 gebouwd in Shakespeare
□ Minimaal één commit gepusht
□ App draait lokaal zonder crashes
```

Dag 2 gaat verder met S-05 t/m S-08 en de cryptografie.

---

*IDidHere — Open Source · Goosie Labs · https://goosielabs.com*
*Bouwplan v1.0 · Perry Smit · 2026*
