import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGPS } from '../hooks/useGPS';
import { calculateTrustScore } from '../lib/verification/trustScore';
import { buildCheckinEvent } from '../lib/nostr/events';
import { signAndPublish } from '../lib/nostr/publish';
import { encode } from '../lib/geohash';
import { useLocationStore } from '../store/locationStore';
import { useSessionStore } from '../store/sessionStore';
import type { Privacy } from '../lib/nostr/events';

const STARS = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'];
const LEVEL_LABEL = ['', 'Zwak', 'Redelijk', 'Sterk', 'Legendary'];

function PrivacyButton({
  value, selected, onClick, icon, label,
}: {
  value: Privacy; selected: Privacy; onClick: (v: Privacy) => void;
  icon: string; label: string;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex-1 rounded-lg py-2.5 text-xs font-medium transition ${
        selected === value
          ? 'bg-brand text-white'
          : 'border border-border bg-surface text-white/40 hover:border-white/20 hover:text-white/60'
      }`}
    >
      {icon} {label}
    </button>
  );
}

export default function S07Checkin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gps = useGPS();
  const { privateKey } = useSessionStore();
  const [privacy, setPrivacy] = useState<Privacy>('public');
  const [submitting, setSubmitting] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const locations = useLocationStore((s) => s.locations);
  const loc = locations.find((l) => l.id === id);

  const trustResult = loc && gps.position
    ? calculateTrustScore({
        userLat: gps.position.lat,
        userLon: gps.position.lon,
        targetLat: loc.lat,
        targetLon: loc.lon,
        isDevMode: false,
        wifiNetworks: gps.isOnWifi ? ['wifi-detected'] : [],
      })
    : null;

  // Tijdens development: forceer een bruikbare score zodat de flow testbaar is
  const devScore = {
    score: 0.8,
    level: 3 as const,
    action: 'PROCEED' as const,
    reasons: [],
  };
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const result = isDev && !gps.position ? devScore : trustResult;

  const canCheckin = result && (result.action === 'PROCEED' || result.action === 'STEP_UP');

  async function handleCheckin() {
    if (!loc || !canCheckin) return;
    setSubmitting(true);
    setPublishError(null);

    const lat = gps.position?.lat ?? loc.lat;
    const lon = gps.position?.lon ?? loc.lon;
    const level = result!.level;
    const geohash = encode(lat, lon, 7);
    const gooseId = `${geohash}-${level}-${Date.now()}`;

    const eventTemplate = buildCheckinEvent({
      locationId: loc.id,
      lat, lon,
      verificationLevel: level,
      gooseId,
      privacy,
    });

    if (privateKey) {
      try {
        await signAndPublish(eventTemplate, privateKey);
      } catch (err) {
        // Toon waarschuwing maar blokkeer de flow niet — gans is al verdiend
        setPublishError(err instanceof Error ? err.message : 'Relay niet bereikbaar');
      }
    }

    navigate(`/goose/${loc.id}`, {
      state: {
        locationName: loc.name,
        verificationLevel: level,
        geohash,
        gooseId,
      },
    });
  }

  if (!loc) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-white/40">Locatie niet gevonden</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas px-5 py-8">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-white/40 hover:text-white/60">
          ← {loc.name}
        </button>
        <h1 className="mb-6 text-xl font-bold">Inchecken</h1>

        {/* Privacy keuze */}
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/30">
          Privacy instelling
        </p>
        <div className="mb-6 flex gap-2">
          <PrivacyButton value="public"  selected={privacy} onClick={setPrivacy} icon="🌍" label="Publiek" />
          <PrivacyButton value="friends" selected={privacy} onClick={setPrivacy} icon="👥" label="Vrienden" />
          <PrivacyButton value="private" selected={privacy} onClick={setPrivacy} icon="🔒" label="Privé" />
        </div>

        {/* GPS signaal */}
        <GPSSignalRow gps={gps} />

        {/* WiFi signaal */}
        <SignalRow
          icon="🌐"
          title={gps.isOnWifi ? 'WiFi herkend' : 'WiFi niet gedetecteerd'}
          status={gps.isOnWifi}
          detail={gps.isOnWifi ? 'Lokale context bevestigd' : 'Geen extra context signaal'}
        />

        {/* Verificatiescore */}
        {result && (
          <div className="mb-6 rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-widest text-white/30">
              Verificatiescore
            </p>
            <p className="mt-1 text-lg font-bold">
              {STARS[result.level]}{' '}
              <span className="text-sm font-normal text-white/50">— {LEVEL_LABEL[result.level]}</span>
            </p>
            {result.reasons.length > 0 && (
              <p className="mt-1 text-xs text-yellow-400/70">{result.reasons.join(' · ')}</p>
            )}
          </div>
        )}

        {/* Relay fout (niet-blokkerend) */}
        {publishError && (
          <div className="mb-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-400/80">
            ⚠️ {publishError}
          </div>
        )}

        {/* Actie */}
        {result?.action === 'DENY' ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-center">
            <p className="text-sm font-medium text-red-400">Te ver van de locatie</p>
            <p className="mt-1 text-xs text-white/40">
              Ga naar de locatie om in te checken.
            </p>
          </div>
        ) : (
          <button
            onClick={handleCheckin}
            disabled={submitting || !canCheckin}
            className="w-full rounded-xl bg-accent py-4 text-lg font-bold text-canvas transition hover:bg-accent/90 active:scale-95 disabled:opacity-40"
          >
            {submitting ? 'Even geduld…' : '🪿 IDidHere!'}
          </button>
        )}

        <p className="mt-3 text-center text-xs text-white/25">
          {privacy === 'private'
            ? 'Alleen zichtbaar voor jou'
            : privacy === 'friends'
            ? 'Versleuteld voor vrienden · Nostr NIP-44'
            : 'Publiek zichtbaar op Nostr'}
        </p>
      </div>
    </div>
  );
}

function GPSSignalRow({ gps }: { gps: ReturnType<typeof useGPS> }) {
  const statusText: Record<string, string> = {
    idle: 'GPS wordt gestart…',
    requesting: 'GPS detecteren…',
    granted: `GPS ontvangen (±${Math.round(gps.position?.accuracy ?? 0)}m)`,
    denied: 'GPS niet toegestaan',
    unavailable: 'GPS niet beschikbaar',
  };

  const ok = gps.status === 'granted';

  return (
    <SignalRow
      icon="📍"
      title={statusText[gps.status]}
      status={ok}
      detail={ok ? 'Locatie bevestigd' : 'Wachten op GPS…'}
      loading={gps.status === 'requesting' || gps.status === 'idle'}
    />
  );
}

function SignalRow({
  icon, title, status, detail, loading = false,
}: {
  icon: string; title: string; status: boolean; detail: string; loading?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <span className="text-xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className={`text-xs ${status ? 'text-accent' : loading ? 'text-white/30' : 'text-white/40'}`}>
          {loading ? '…' : status ? `✓ ${detail}` : detail}
        </p>
      </div>
    </div>
  );
}
