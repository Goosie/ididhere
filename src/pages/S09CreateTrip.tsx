import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildTripEvent, buildBucketlistItemEvent } from '../lib/nostr/trip';
import { signAndPublish } from '../lib/nostr/publish';
import { encode } from '../lib/geohash';
import { useSessionStore } from '../store/sessionStore';

type Step = 'form' | 'loading' | 'results';

interface GansjeTip {
  name: string;
  description: string;
  lat: number;
  lon: number;
  category: string;
  bestTime: string;
  confidence: string;
  tags: string[];
}

const CATEGORY_ICON: Record<string, string> = {
  food: '🍽️', nature: '🌿', culture: '🏛️',
  nightlife: '🌙', market: '🛒', viewpoint: '👁️', hidden: '🔮',
};

const BEST_TIME_LABEL: Record<string, string> = {
  morning: '🌅 Ochtend',
  afternoon: '☀️ Middag',
  evening: '🌆 Avond',
  anytime: 'Altijd',
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000';

export default function S09CreateTrip() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('form');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tips, setTips] = useState<GansjeTip[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { privateKey } = useSessionStore();

  async function activateTippy() {
    if (!destination.trim()) return;
    setError(null);
    setStep('loading');

    try {
      const res = await fetch(`${BACKEND_URL}/api/gansjeTippy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destination.trim(),
          userProfile: {},
          existingTips: [],
        }),
        signal: AbortSignal.timeout(45_000),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Serverfout (${res.status})`);
      }

      const data: { tips: GansjeTip[] } = await res.json();
      const fetchedTips = data.tips ?? [];
      setTips(fetchedTips);
      // Standaard alles geselecteerd
      setSelected(new Set(fetchedTips.map((_, i) => i)));
      setStep('results');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Verbindingsfout — controleer of de backend actief is',
      );
      setStep('form');
    }
  }

  function toggleTip(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  async function saveTrip() {
    setSaving(true);
    const { event: tripEvent, tripId } = buildTripEvent({
      destination,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    if (privateKey) {
      try {
        await signAndPublish(tripEvent, privateKey);

        const selectedTips = tips.filter((_, i) => selected.has(i));
        await Promise.allSettled(
          selectedTips.map((tip) => {
            const geohash = encode(tip.lat, tip.lon, 7);
            const locationId = `${geohash}-${tip.name.toLowerCase().replace(/\s+/g, '-')}`;
            const bucketEvent = buildBucketlistItemEvent({ locationId, tripId });
            return signAndPublish(bucketEvent, privateKey!);
          }),
        );
      } catch {
        // Niet-blokkerend — reis is lokaal aangemaakt
      }
    }

    navigate('/home');
  }

  const categories = useMemo(() => {
    const cats = new Set(tips.map((t) => t.category));
    return ['all', ...cats];
  }, [tips]);

  const visibleTips = useMemo(() => {
    const indexed = tips.map((tip, i) => ({ tip, i }));
    return categoryFilter === 'all'
      ? indexed
      : indexed.filter(({ tip }) => tip.category === categoryFilter);
  }, [tips, categoryFilter]);

  // ─── Formulier ───────────────────────────────────────────────────────────────
  if (step === 'form') {
    return (
      <div className="flex min-h-screen flex-col bg-canvas px-5 py-8">
        <div className="mx-auto w-full max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm text-white/40 hover:text-white/60"
          >
            ← Terug
          </button>

          <h1 className="mb-1 text-2xl font-bold">Nieuwe reis</h1>
          <p className="mb-8 text-sm text-white/40">
            GansjeTippy zoekt verrassende plekken voor jou.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-white/30">
            Bestemming
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && activateTippy()}
            placeholder="Bijv. Sofia, Bulgarije"
            autoFocus
            className="mb-5 w-full rounded-xl border border-border bg-surface px-4 py-3 text-white placeholder-white/20 outline-none focus:border-brand"
          />

          <div className="mb-8 flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-white/30">
                Van
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-white outline-none focus:border-brand"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-white/30">
                Tot
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-white outline-none focus:border-brand"
              />
            </div>
          </div>

          <button
            onClick={activateTippy}
            disabled={!destination.trim()}
            className="w-full rounded-xl bg-brand py-4 text-lg font-bold text-white transition hover:bg-brand/90 active:scale-95 disabled:opacity-40"
          >
            🪿 GansjeTippy activeren
          </button>
          <p className="mt-3 text-center text-xs text-white/25">
            AI genereert 10–15 verrassende locatietips · Datums zijn optioneel
          </p>
        </div>
      </div>
    );
  }

  // ─── Laden ───────────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-5">
        <div className="animate-pulse text-8xl select-none">🪿</div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">GansjeTippy zoekt…</p>
          <p className="mt-1 text-sm text-white/40">Verborgen plekken in {destination}</p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-brand"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─── Resultaten ──────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Header */}
      <div className="border-b border-border bg-canvas px-5 py-4">
        <div className="mx-auto max-w-md">
          <button
            onClick={() => setStep('form')}
            className="mb-2 text-sm text-white/40 hover:text-white/60"
          >
            ← Bestemming wijzigen
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">{destination}</h1>
              <p className="text-xs text-white/40">{tips.length} locaties gevonden</p>
            </div>
            <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
              🪿 AI
            </span>
          </div>
        </div>
      </div>

      {/* Categorie filter */}
      <div className="overflow-x-auto border-b border-border">
        <div className="flex min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2.5 text-xs font-medium transition ${
                categoryFilter === cat
                  ? 'border-b-2 border-brand text-brand'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {cat === 'all' ? 'Alles' : `${CATEGORY_ICON[cat] ?? '📍'} ${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Tip-lijst */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 pt-3">
        <div className="mx-auto max-w-md space-y-2">
          <p className="mb-3 text-xs text-white/30">
            Tik een locatie aan om hem uit je reis te verwijderen.
          </p>

          {visibleTips.map(({ tip, i }) => {
            const isSelected = selected.has(i);
            return (
              <button
                key={i}
                onClick={() => toggleTip(i)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? 'border-brand/50 bg-brand/10'
                    : 'border-border bg-surface opacity-40'
                }`}
              >
                <span className="mt-0.5 shrink-0 text-xl">
                  {CATEGORY_ICON[tip.category] ?? '📍'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{tip.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-white/50">{tip.description}</p>
                  <p className="mt-1 text-xs text-white/30">
                    {BEST_TIME_LABEL[tip.bestTime] ?? tip.bestTime}
                  </p>
                </div>
                <span
                  className={`mt-0.5 shrink-0 text-lg leading-none transition ${
                    isSelected ? 'text-brand' : 'text-white/20'
                  }`}
                >
                  {isSelected ? '✓' : '+'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Onderste CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-canvas/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto max-w-md">
          <button
            onClick={saveTrip}
            disabled={selected.size === 0 || saving}
            className="w-full rounded-xl bg-accent py-4 text-base font-bold text-canvas transition hover:bg-accent/90 active:scale-95 disabled:opacity-40"
          >
            {saving ? 'Opslaan…' : `Reis bewaren · ${selected.size} locaties`}
          </button>
        </div>
      </div>
    </div>
  );
}
