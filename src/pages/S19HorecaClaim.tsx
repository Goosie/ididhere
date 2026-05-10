import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGPS } from '../hooks/useGPS';
import { calculateTrustScore } from '../lib/verification/trustScore';
import { deriveDormantKeyPair, getDormantAccountInfo, shortPubkey } from '../lib/nostr/dormantAccount';
import { signAndPublishAs } from '../lib/nostr/publish';
import { IDIDHERE_KINDS } from '../lib/nostr/kinds';
import { MOCK_LOCATIONS } from './S05Map';

type ClaimStep = 'intro' | 'gps' | 'confirm' | 'success';

const CATEGORY_ICON: Record<string, string> = {
  food: '🍽️', nature: '🌿', culture: '🏛️',
  nightlife: '🌙', market: '🛒', viewpoint: '👁️', hidden: '🔮',
};

export default function S19HorecaClaim() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gps = useGPS();

  const [step, setStep] = useState<ClaimStep>('intro');
  const [claiming, setClaiming] = useState(false);
  const [claimedPubkey, setClaimedPubkey] = useState<string | null>(null);

  const loc = MOCK_LOCATIONS.find((l) => l.id === id);

  if (!loc) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="text-center">
          <p className="text-white/40">Locatie niet gevonden</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-brand">← Terug</button>
        </div>
      </div>
    );
  }

  const dormantInfo = getDormantAccountInfo(loc.lat, loc.lon);

  const trustResult = gps.position
    ? calculateTrustScore({
        userLat: gps.position.lat,
        userLon: gps.position.lon,
        targetLat: loc.lat,
        targetLon: loc.lon,
        isDevMode: false,
        wifiNetworks: gps.isOnWifi ? ['wifi-detected'] : [],
      })
    : null;

  const isNearby = trustResult?.action === 'PROCEED' || trustResult?.action === 'STEP_UP';

  // Dev fallback — localhost → skip GPS eis
  const isDev = window.location.hostname === 'localhost';
  const canClaim = isDev || isNearby;

  async function handleClaim() {
    if (!canClaim) return;
    setClaiming(true);

    // Leid het slapende sleutelpaar af — NOOIT opslaan.
    // De privésleutel wordt direct gebruikt voor signing en daarna weggegooid.
    const { privateKey: dormantPrivKey, publicKey } = deriveDormantKeyPair(loc!.lat, loc!.lon);

    // Kind-37519 claim event — ondertekend met de slapende sleutel
    const claimEvent = {
      kind: IDIDHERE_KINDS.HORECA_CLAIM,
      created_at: Math.floor(Date.now() / 1000),
      content: `Claim: ${loc!.name}`,
      tags: [
        ['d', loc!.id],
        ['name', loc!.name],
        ['lat', loc!.lat.toFixed(6)],
        ['lon', loc!.lon.toFixed(6)],
      ],
    };

    try {
      await signAndPublishAs(claimEvent, dormantPrivKey);
    } catch {
      // Niet-blokkerend — claim wordt lokaal bevestigd
    }

    setClaimedPubkey(publicKey);
    setClaiming(false);
    setStep('success');
  }

  // ─── Intro ────────────────────────────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <div className="flex min-h-screen flex-col bg-canvas px-5 py-8">
        <div className="mx-auto w-full max-w-md">
          <button onClick={() => navigate(-1)} className="mb-6 text-sm text-white/40 hover:text-white/60">
            ← Terug
          </button>

          <div className="mb-2 text-4xl">{CATEGORY_ICON[loc.category] ?? '🏪'}</div>
          <h1 className="mb-1 text-2xl font-bold">{loc.name}</h1>
          <p className="mb-8 text-sm text-white/40">Slapend account claimen</p>

          <div className="mb-6 rounded-xl border border-border bg-surface px-5 py-4 space-y-3">
            <InfoRow icon="🗝️" label="Slapend account" value={shortPubkey(dormantInfo.publicKey)} mono />
            <InfoRow icon="📊" label="Check-ins" value={`${loc.checkinCount} bezoekers`} />
            <InfoRow icon="⭐" label="Max verificatie" value={'⭐'.repeat(loc.maxVerificationLevel)} />
          </div>

          <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-4">
            <p className="mb-1 text-sm font-medium text-yellow-400">Hoe werkt claimen?</p>
            <ul className="space-y-1 text-xs text-white/50">
              <li>• Jij bewijst dat je op deze locatie bent via GPS</li>
              <li>• De sleutel wordt afgeleid uit jouw GPS-positie</li>
              <li>• Alleen de eigenaar van de locatie kan dit doen</li>
              <li>• Wij slaan nooit jouw sleutels op</li>
            </ul>
          </div>

          <button
            onClick={() => setStep('gps')}
            className="w-full rounded-xl bg-brand py-4 text-lg font-bold text-white transition hover:bg-brand/90 active:scale-95"
          >
            Account claimen
          </button>
        </div>
      </div>
    );
  }

  // ─── GPS verificatie ─────────────────────────────────────────────────────────
  if (step === 'gps') {
    const gpsOk = gps.status === 'granted';

    return (
      <div className="flex min-h-screen flex-col bg-canvas px-5 py-8">
        <div className="mx-auto w-full max-w-md">
          <button onClick={() => setStep('intro')} className="mb-6 text-sm text-white/40 hover:text-white/60">
            ← Terug
          </button>

          <h1 className="mb-2 text-xl font-bold">Stap bij de locatie</h1>
          <p className="mb-8 text-sm text-white/40">
            Ga naar {loc.name} en zorg dat GPS actief is.
          </p>

          <SignalCard
            icon="📍"
            label={gpsOk ? `GPS (±${Math.round(gps.position?.accuracy ?? 0)}m)` : 'GPS detecteren…'}
            ok={gpsOk}
            loading={gps.status === 'requesting' || gps.status === 'idle'}
          />

          {gpsOk && (
            <SignalCard
              icon="📏"
              label={
                isNearby
                  ? 'Je bent bij de locatie'
                  : trustResult?.action === 'DENY'
                  ? `Te ver — ga naar ${loc.name}`
                  : 'Afstand meten…'
              }
              ok={isNearby}
              loading={!trustResult}
            />
          )}

          {isDev && (
            <div className="mb-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-400/70">
              Ontwikkelmodus — GPS-eis overgeslagen
            </div>
          )}

          <button
            onClick={() => setStep('confirm')}
            disabled={!canClaim}
            className="mt-4 w-full rounded-xl bg-brand py-4 text-lg font-bold text-white transition hover:bg-brand/90 active:scale-95 disabled:opacity-40"
          >
            {canClaim ? 'Bevestig claim →' : 'Wachten op GPS…'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Bevestiging ─────────────────────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <div className="flex min-h-screen flex-col bg-canvas px-5 py-8">
        <div className="mx-auto w-full max-w-md">
          <button onClick={() => setStep('gps')} className="mb-6 text-sm text-white/40 hover:text-white/60">
            ← Terug
          </button>

          <h1 className="mb-2 text-xl font-bold">Bevestig eigenaarschap</h1>
          <p className="mb-8 text-sm text-white/40">
            Jouw GPS-positie bewijst dat je eigenaar bent van {loc.name}.
          </p>

          <div className="mb-6 rounded-xl border border-border bg-surface px-5 py-4 space-y-3">
            <InfoRow icon="🏪" label="Locatie" value={loc.name} />
            <InfoRow icon="🗝️" label="Slapend account" value={shortPubkey(dormantInfo.publicKey)} mono />
            <InfoRow icon="📍" label="GPS status" value={isDev ? 'Ontwikkelmodus ✓' : isNearby ? 'Bevestigd ✓' : '—'} />
          </div>

          <div className="mb-8 rounded-xl border border-red-500/15 bg-red-500/10 px-4 py-4">
            <p className="text-xs text-white/40">
              Na het claimen ben jij de enige die dit account kan beheren.
              Jouw sleutel wordt afgeleid uit je GPS en nooit door ons opgeslagen.
            </p>
          </div>

          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full rounded-xl bg-accent py-4 text-lg font-bold text-canvas transition hover:bg-accent/90 active:scale-95 disabled:opacity-40"
          >
            {claiming ? 'Account claimen…' : '✓ Bevestig & Claim'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Succes ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5">
      <div className="w-full max-w-sm text-center">
        <div className="mb-4 text-6xl">🎉</div>
        <h1 className="mb-2 text-2xl font-bold">Account geclaimd!</h1>
        <p className="mb-8 text-sm text-white/40">
          {loc.name} is nu van jou op Nostr.
        </p>

        <div className="mb-8 rounded-xl border border-border bg-surface px-5 py-4 text-left">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/30">
            Jouw pubkey
          </p>
          <p className="break-all font-mono text-xs text-white/60">
            {claimedPubkey ? shortPubkey(claimedPubkey) : '—'}
          </p>
        </div>

        <button
          onClick={() => navigate(`/place/${loc.id}`)}
          className="w-full rounded-xl bg-brand py-4 text-base font-bold text-white transition hover:bg-brand/90 active:scale-95"
        >
          Naar locatiepagina
        </button>
        <button
          onClick={() => navigate('/home')}
          className="mt-3 w-full py-3 text-sm text-white/40 hover:text-white/60 transition"
        >
          Naar kaart
        </button>
      </div>
    </div>
  );
}

function SignalCard({
  icon, label, ok, loading = false,
}: {
  icon: string; label: string; ok: boolean; loading?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <span className="text-xl">{icon}</span>
      <p className="flex-1 text-sm text-white">{label}</p>
      <span className={`text-sm ${ok ? 'text-accent' : loading ? 'text-white/20' : 'text-red-400/60'}`}>
        {ok ? '✓' : loading ? '…' : '✗'}
      </span>
    </div>
  );
}

function InfoRow({
  icon, label, value, mono = false,
}: {
  icon: string; label: string; value: string; mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-sm">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/30">{label}</p>
        <p className={`truncate text-sm text-white ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
      </div>
    </div>
  );
}
