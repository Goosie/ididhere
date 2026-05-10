import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_LOCATIONS } from './S05Map';

const CATEGORY_ICON: Record<string, string> = {
  food: '🍽️', nature: '🌿', culture: '🏛️',
  nightlife: '🌙', market: '🛒', viewpoint: '👁️', hidden: '🔮',
};

const STARS = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'];

export default function S06LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Mini-kaart header (placeholder kleur) */}
      <div
        className="relative flex items-center justify-center border-b border-border"
        style={{ height: 120, background: '#1a1a2e' }}
      >
        <span className="text-5xl">{CATEGORY_ICON[loc.category] ?? '📍'}</span>
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 text-white/50 hover:text-white"
        >
          ← Terug
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-6">
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-xl font-bold">{loc.name}</h1>
          {loc.isAiGenerated && (
            <span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-yellow-400/80 bg-yellow-400/10">
              AI tip
            </span>
          )}
        </div>

        <p className="mb-4 text-xs text-white/40">
          {STARS[loc.maxVerificationLevel]} · {loc.checkinCount} check-ins ·{' '}
          {loc.tags.map((t) => `#${t}`).join(' ')}
        </p>

        <p className="mb-6 text-sm leading-relaxed text-white/75">{loc.description}</p>

        {/* Vier acties conform wireframe */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/bucket')}
            className="rounded-xl border border-border bg-surface py-3 text-sm text-white/60 hover:border-white/20 hover:text-white/80 transition"
          >
            + Bucketlist
          </button>
          <button className="rounded-xl border border-border bg-surface py-3 text-sm text-white/40 transition">
            IWantThisTo
          </button>
          <button
            onClick={() => navigate(`/claim/${loc.id}`)}
            className="rounded-xl border border-border bg-surface py-3 text-sm text-white/60 hover:border-white/20 hover:text-white/80 transition"
          >
            🏪 Claim locatie
          </button>
          <button
            onClick={() => navigate(`/checkin/${loc.id}`)}
            className="rounded-xl bg-accent py-3 text-sm font-bold text-canvas transition hover:bg-accent/90 active:scale-95"
          >
            IDidHere ✓
          </button>
        </div>
      </div>
    </div>
  );
}
