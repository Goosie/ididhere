import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGPS } from '../hooks/useGPS';
import { encode } from '../lib/geohash';
import { generateGoose } from '../lib/goose/generator';
import { IDIDHERE_KINDS } from '../lib/nostr/kinds';
import { signAndPublish } from '../lib/nostr/publish';
import { useSessionStore } from '../store/sessionStore';

type Step = 'form' | 'founding';
type Category = 'food' | 'nature' | 'culture' | 'nightlife' | 'market' | 'viewpoint' | 'hidden';

const CATEGORIES: { value: Category; icon: string; label: string }[] = [
  { value: 'food',      icon: '🍽️', label: 'Eten & drinken' },
  { value: 'nature',    icon: '🌿', label: 'Natuur' },
  { value: 'culture',   icon: '🏛️', label: 'Cultuur' },
  { value: 'nightlife', icon: '🌙', label: 'Uitgaan' },
  { value: 'market',    icon: '🛒', label: 'Markt' },
  { value: 'viewpoint', icon: '👁️', label: 'Uitzicht' },
  { value: 'hidden',    icon: '🔮', label: 'Verborgen' },
];

interface NewLocation {
  id: string;
  name: string;
  description: string;
  category: Category;
  lat: number;
  lon: number;
  geohash: string;
}

export default function S17CreateLocation() {
  const navigate = useNavigate();
  const gps = useGPS();

  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [created, setCreated] = useState<NewLocation | null>(null);
  const [copied, setCopied] = useState(false);
  const { privateKey } = useSessionStore();

  const lat = gps.position?.lat ?? 0;
  const lon = gps.position?.lon ?? 0;
  const hasGps = gps.status === 'granted';

  function handleCreate() {
    if (!name.trim() || !category) return;

    const geohash = encode(lat, lon, 7);
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const locationId = `${geohash}-${slug}`;

    const loc: NewLocation = {
      id: locationId, name: name.trim(),
      description: description.trim(), category,
      lat, lon, geohash,
    };

    // Bouw unsigned kind-37515 event (signing + relay publishing volgt)
    const event = {
      kind: IDIDHERE_KINDS.LOCATION_TIP,
      created_at: Math.floor(Date.now() / 1000),
      content: loc.description,
      tags: [
        ['d', loc.id],
        ['g', geohash],
        ['lat', lat.toFixed(6)],
        ['lon', lon.toFixed(6)],
        ['name', loc.name],
        ['t', loc.category],
      ],
    };

    if (privateKey) {
      signAndPublish(event, privateKey).catch(() => undefined); // best-effort
    }

    setCreated(loc);
    setStep('founding');
  }

  async function shareLocation() {
    if (!created) return;
    const url = `https://idid.here/place/${created.id}`;
    const text = `Ik heb ${created.name} toegevoegd aan IDidHere 🪿 ${url}`;

    if (navigator.share) {
      await navigator.share({ title: created.name, text, url }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // ─── Formulier ───────────────────────────────────────────────────────────────
  if (step === 'form') {
    const canSubmit = name.trim().length > 0 && category !== null && hasGps;

    return (
      <div className="flex min-h-screen flex-col bg-canvas px-5 py-8">
        <div className="mx-auto w-full max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm text-white/40 hover:text-white/60"
          >
            ← Terug
          </button>

          <h1 className="mb-1 text-2xl font-bold">Locatie aanmaken</h1>
          <p className="mb-8 text-sm text-white/40">
            Jij wordt de Founding Stamper van deze locatie.
          </p>

          {/* GPS status */}
          <div className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 ${
            hasGps ? 'border-accent/40 bg-accent/10' : 'border-border bg-surface'
          }`}>
            <span className="text-xl">📍</span>
            <div>
              <p className="text-sm font-medium text-white">
                {hasGps
                  ? `GPS ontvangen (±${Math.round(gps.position?.accuracy ?? 0)}m)`
                  : gps.status === 'requesting' ? 'GPS detecteren…'
                  : gps.status === 'denied' ? 'GPS niet toegestaan'
                  : 'GPS niet beschikbaar'}
              </p>
              {hasGps && (
                <p className="text-xs text-accent/80">
                  {lat.toFixed(5)}, {lon.toFixed(5)}
                </p>
              )}
            </div>
          </div>

          {/* Naam */}
          <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-white/30">
            Naam van de locatie
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bijv. Geheime binnenplaats"
            maxLength={60}
            className="mb-5 w-full rounded-xl border border-border bg-surface px-4 py-3 text-white placeholder-white/20 outline-none focus:border-brand"
          />

          {/* Beschrijving */}
          <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-white/30">
            Beschrijving
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Wat maakt dit bijzonder? Insider tip die anderen niet kennen."
            rows={3}
            maxLength={200}
            className="mb-5 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-white placeholder-white/20 outline-none focus:border-brand"
          />

          {/* Categorie */}
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-white/30">
            Categorie
          </label>
          <div className="mb-8 grid grid-cols-2 gap-2">
            {CATEGORIES.map(({ value, icon, label }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                  category === value
                    ? 'border-brand bg-brand/20 text-white font-medium'
                    : 'border-border bg-surface text-white/50 hover:border-white/20 hover:text-white/70'
                }`}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreate}
            disabled={!canSubmit}
            className="w-full rounded-xl bg-brand py-4 text-lg font-bold text-white transition hover:bg-brand/90 active:scale-95 disabled:opacity-40"
          >
            📍 Locatie aanmaken
          </button>

          {!hasGps && (
            <p className="mt-3 text-center text-xs text-white/25">
              GPS is vereist om de exacte locatie vast te leggen
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── Founding Gans ───────────────────────────────────────────────────────────
  if (!created) return null;

  const foundingSvg = generateGoose(created.geohash, 4); // Level 4 = legendary founding gans

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-canvas px-5 py-10">
      <div className="w-full max-w-sm text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-accent/80">
          Founding Gans
        </p>
        <h1 className="mb-1 text-2xl font-bold">{created.name}</h1>
        <p className="mb-8 text-sm text-white/40">
          Jij bent de eerste hier. Deze gans is van jou.
        </p>

        {/* Legendary gans animatie */}
        <div
          className="mx-auto mb-4 h-44 w-44 animate-[pop-in_0.5s_ease-out]"
          dangerouslySetInnerHTML={{ __html: foundingSvg }}
          style={{ animation: 'pulse 3s ease-in-out infinite' }}
        />

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/15 px-4 py-1.5">
          <span className="text-sm font-bold text-yellow-400">⭐⭐⭐⭐ Legendary</span>
        </div>

        {/* Deelbaar kaartje */}
        <div className="rounded-xl border border-border bg-surface px-5 py-4 text-left">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/30">
            Deel je locatie
          </p>
          <p className="mb-3 break-all font-mono text-xs text-white/50">
            idid.here/place/{created.id}
          </p>
          <button
            onClick={shareLocation}
            className="w-full rounded-xl border border-border py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white/80"
          >
            {copied ? '✓ Gekopieerd!' : '🔗 Deel locatie'}
          </button>
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm space-y-3">
        <button
          onClick={() => navigate(`/checkin/${created.id}`)}
          className="w-full rounded-xl bg-accent py-4 text-base font-bold text-canvas transition hover:bg-accent/90 active:scale-95"
        >
          🪿 IDidHere!
        </button>
        <button
          onClick={() => navigate('/home')}
          className="w-full py-3 text-sm text-white/40 hover:text-white/60 transition"
        >
          Naar kaart
        </button>
      </div>
    </div>
  );
}
