import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BottomNav from '../components/BottomNav';
import { distanceMeters, encode, formatDistance } from '../lib/geohash';
import type { MapTab } from '../types/location';
import { useLocationStore } from '../store/locationStore';

// Emoji-gebaseerde markers — geen externe icon URLs nodig
function emojiIcon(emoji: string, size = 32) {
  return L.divIcon({
    html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    className: '',
  });
}

const CATEGORY_ICON: Record<string, string> = {
  food: '🍽️', nature: '🌿', culture: '🏛️',
  nightlife: '🌙', market: '🛒', viewpoint: '👁️', hidden: '🔮',
};


function MapAutoCenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  const centered = useRef(false);
  useEffect(() => {
    if (!centered.current) {
      map.setView([lat, lon], 15);
      centered.current = true;
    }
  }, [map, lat, lon]);
  return null;
}

const STARS = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'];

export default function S05Map() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<MapTab>('nearby');
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null);
  const [posError, setPosError] = useState(false);
  const allLocations = useLocationStore((s) => s.locations);

  // Amsterdam centrum als fallback startpositie
  const center = userPos ?? { lat: 52.3760, lon: 4.9041 };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setPosError(true),
      { timeout: 6000, maximumAge: 30000 },
    );
  }, []);

  const locationsWithDistance = useMemo(() =>
    allLocations.map((loc) => ({
      ...loc,
      distance: distanceMeters(center.lat, center.lon, loc.lat, loc.lon),
      geohash: encode(loc.lat, loc.lon, 5),
    })),
    [center.lat, center.lon],
  );

  const visibleLocations = useMemo(() => {
    if (tab === 'trending') {
      return [...locationsWithDistance].sort((a, b) => b.checkinCount - a.checkinCount);
    }
    if (tab === 'tippy') {
      return locationsWithDistance.filter((l) => l.isAiGenerated)
        .sort((a, b) => a.distance - b.distance);
    }
    return [...locationsWithDistance].sort((a, b) => a.distance - b.distance);
  }, [locationsWithDistance, tab]);

  return (
    <div className="flex h-screen flex-col bg-canvas">
      {/* Top nav */}
      <div className="flex items-center justify-between border-b border-border bg-canvas px-4 py-3">
        <span className="text-2xl">🪿</span>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-sm text-white/70 hover:text-white">
            Amsterdam <span className="text-white/30">▾</span>
          </button>
          <button
            onClick={() => navigate('/trip/new')}
            className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-medium text-brand hover:bg-brand/20 transition"
          >
            + Reis
          </button>
        </div>
      </div>

      {/* Leaflet kaart */}
      <div className="relative" style={{ height: '45vh', flexShrink: 0 }}>
        <MapContainer
          center={[center.lat, center.lon]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapAutoCenter lat={center.lat} lon={center.lon} />

          {/* Gebruikerspositie */}
          {userPos && (
            <Marker position={[userPos.lat, userPos.lon]} icon={emojiIcon('📍', 28)}>
              <Popup>Jij bent hier</Popup>
            </Marker>
          )}

          {/* Locatie-markers */}
          {locationsWithDistance.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lon]}
              icon={emojiIcon(loc.isAiGenerated ? '🪿' : CATEGORY_ICON[loc.category] ?? '📍', 28)}
            >
              <Popup>
                <div style={{ minWidth: 140 }}>
                  <strong>{loc.name}</strong>
                  <br />
                  <span style={{ fontSize: 11, color: '#666' }}>
                    {STARS[loc.maxVerificationLevel]} · {loc.checkinCount} check-ins
                  </span>
                  <br />
                  <button
                    onClick={() => navigate(`/place/${loc.id}`)}
                    style={{ marginTop: 6, fontSize: 11, color: '#7b61ff', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                  >
                    Bekijken →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {posError && (
          <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/70 px-3 py-2 text-xs text-white/60">
            GPS niet beschikbaar — kaart gecentreerd op Amsterdam
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {([
          ['nearby', 'In de buurt'],
          ['trending', 'Trending'],
          ['tippy', '🪿 GansjeTippy'],
        ] as [MapTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 text-xs font-medium transition ${
              tab === key
                ? 'border-b-2 border-brand text-brand'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Locatielijst */}
      <div className="flex-1 overflow-y-auto pb-20">
        {tab === 'tippy' && (
          <div className="mx-4 mt-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300/80">
            🪿 GansjeTippy-suggesties zijn AI-gegenereerd en nog niet door mensen bevestigd.
          </div>
        )}

        {visibleLocations.length === 0 && (
          <p className="mt-8 text-center text-sm text-white/30">Geen locaties gevonden</p>
        )}

        <div className="px-4 pt-3 space-y-2">
          {visibleLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => navigate(`/place/${loc.id}`)}
              className={`flex w-full items-center gap-3 rounded-xl border bg-surface px-4 py-3 text-left transition hover:border-white/10 ${
                loc.isAiGenerated ? 'border-yellow-500/25' : 'border-border'
              }`}
            >
              <span className="text-2xl">{CATEGORY_ICON[loc.category] ?? '📍'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-white">{loc.name}</p>
                  {loc.isAiGenerated && (
                    <span className="shrink-0 rounded px-1 py-0.5 text-[10px] font-medium text-yellow-400/80 bg-yellow-400/10">
                      AI
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/40">
                  {STARS[loc.maxVerificationLevel]} · {formatDistance(loc.distance)} · {loc.checkinCount} check-ins
                </p>
              </div>
              <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-border text-white/30 text-sm hover:border-brand hover:text-brand transition">
                +
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* FAB — nieuwe locatie aanmaken */}
      <button
        onClick={() => navigate('/location/new')}
        className="fixed bottom-20 right-4 z-[1000] flex h-12 w-12 items-center justify-center rounded-full bg-brand text-xl shadow-lg transition hover:bg-brand/90 active:scale-95"
        title="Locatie aanmaken"
      >
        +
      </button>

      <BottomNav />
    </div>
  );
}
