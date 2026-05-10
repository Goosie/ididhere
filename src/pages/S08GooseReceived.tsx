import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { generateGoose } from '../lib/goose/generator';

interface GooseState {
  locationName: string;
  verificationLevel: 1 | 2 | 3 | 4;
  geohash: string;
  gooseId: string;
}

const STARS = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'];
const RARITY = ['', 'Gewoon', 'Ongewoon', 'Zeldzaam', 'Legendarisch'];

export default function S08GooseReceived() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: GooseState | null };
  const [visible, setVisible] = useState(false);

  // Fallback voor directe URL-navigatie
  const level = state?.verificationLevel ?? 2;
  const geohash = state?.geohash ?? (id ?? 'default');
  const locationName = state?.locationName ?? 'Onbekende locatie';

  const gooseSvg = generateGoose(geohash, level);

  // Animatie: kleine vertraging zodat de transition zichtbaar is
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `Mijn gans bij ${locationName}`,
        text: `Ik was echt bij ${locationName} en heb een ${RARITY[level]} gans verdiend! ${STARS[level]}`,
        url: window.location.href,
      }).catch(() => {/* gebruiker annuleerde */});
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5 py-10">
      <div className="mx-auto w-full max-w-sm">
        {/* Titel */}
        <div
          className="mb-6 text-center transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-12px)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-white/30">Nieuwe gans</p>
          <h1 className="mt-1 text-2xl font-bold">
            {locationName.split(' ')[0]}gans
          </h1>
        </div>

        {/* SVG gans met pop-in animatie */}
        <div
          className="mx-auto mb-6 transition-all duration-700"
          style={{
            width: 200, height: 200,
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.5)',
          }}
          dangerouslySetInnerHTML={{ __html: gooseSvg }}
        />

        {/* Gans details */}
        <div
          className="mb-6 rounded-xl border border-border bg-surface px-5 py-4 text-center transition-all duration-700 delay-200"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
        >
          <p className="font-semibold text-white">{STARS[level]} {RARITY[level]}</p>
          <p className="mt-1 text-xs text-white/40">
            Uniek · Alleen van jou · Nostr NIP-58 badge
          </p>
          <p className="mt-2 font-mono text-[10px] text-white/20">{geohash}</p>
        </div>

        {/* Acties */}
        <div
          className="flex gap-3 transition-all duration-700 delay-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {typeof navigator.share === 'function' && (
            <button
              onClick={handleShare}
              className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm text-white/60 hover:border-white/20 hover:text-white/80 transition"
            >
              Delen
            </button>
          )}
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm text-white/60 hover:border-white/20 hover:text-white/80 transition"
          >
            Collectie
          </button>
          <button
            onClick={() => navigate('/home')}
            className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand/90 active:scale-95"
          >
            Verder →
          </button>
        </div>
      </div>
    </div>
  );
}
