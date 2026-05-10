import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { generateGoose } from '../lib/goose/generator';
import BottomNav from '../components/BottomNav';

const STARS = ['', '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'];
const RARITY = ['', 'Gewoon', 'Zeldzaam', 'Epic', 'Legendary'];

// Mock ganzencollectie — wordt vervangen door Nostr relay fetch (kind-37516)
const MOCK_GEESE = [
  {
    id: 'g1', locationName: 'Dorpstraat 35',
    geohash: 'u172sbx', level: 4 as const, date: '10 mei 2026',
  },
  {
    id: 'g2', locationName: 'Buurtcafé De Molen',
    geohash: 'u172sqp', level: 2 as const, date: '10 mei 2026',
  },
  {
    id: 'g3', locationName: 'Groenteboer Vennep',
    geohash: 'u172smn', level: 1 as const, date: '10 mei 2026',
  },
];

function shortKey(key: string): string {
  if (key.length < 16) return key;
  return `${key.slice(0, 8)}…${key.slice(-6)}`;
}

export default function S14Profile() {
  const navigate = useNavigate();
  const { publicKey } = useSessionStore();

  // Gebruik pubkey als seed voor de profielgans (level 2 = vaste profielstijl)
  const avatarSvg = publicKey
    ? generateGoose(publicKey.slice(0, 7), 2)
    : generateGoose('profile', 2);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Header */}
      <div className="border-b border-border bg-canvas px-5 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Profiel</h1>
          <button className="text-sm text-white/30 hover:text-white/60 transition">
            Instellingen
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profielkaart */}
        <div className="mx-4 mt-4 rounded-xl border border-border bg-surface px-5 py-5">
          <div className="flex items-center gap-4">
            {/* Gans-avatar */}
            <div
              className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-brand/40"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-widest text-white/30">
                Jouw sleutel
              </p>
              <p className="mt-0.5 break-all font-mono text-xs text-white/70">
                {publicKey ? shortKey(publicKey) : 'Niet ingelogd'}
              </p>
              {!publicKey && (
                <button
                  onClick={() => navigate('/onboarding/keys')}
                  className="mt-2 text-xs text-brand hover:text-brand/80"
                >
                  Sleutels aanmaken →
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
            {[
              { label: 'Check-ins', value: MOCK_GEESE.length },
              { label: 'Locaties', value: MOCK_GEESE.length },
              { label: 'Max level', value: `⭐⭐⭐` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-white/30">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ganzencollectie */}
        <div className="px-4 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-white/30">
              Ganzencollectie
            </p>
            <span className="text-xs text-white/25">{MOCK_GEESE.length} ganzen</span>
          </div>

          {MOCK_GEESE.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-4xl">🥚</p>
              <p className="mt-3 text-sm text-white/40">
                Nog geen ganzen — doe je eerste check-in!
              </p>
              <button
                onClick={() => navigate('/home')}
                className="mt-4 rounded-xl bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand/90"
              >
                Naar kaart
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {MOCK_GEESE.map((goose) => {
                const svg = generateGoose(goose.geohash, goose.level);
                return (
                  <div
                    key={goose.id}
                    className="rounded-xl border border-border bg-surface p-3"
                  >
                    <div
                      className="mx-auto mb-2 h-20 w-20"
                      dangerouslySetInnerHTML={{ __html: svg }}
                    />
                    <p className="truncate text-center text-xs font-medium text-white">
                      {goose.locationName}
                    </p>
                    <p className="mt-0.5 text-center text-xs text-white/30">
                      {STARS[goose.level]} {RARITY[goose.level]}
                    </p>
                    <p className="mt-0.5 text-center text-[10px] text-white/20">
                      {goose.date}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Acties */}
        <div className="mx-4 mt-5 space-y-2">
          <button
            onClick={() => navigate('/location/new')}
            className="w-full rounded-xl border border-border bg-surface py-3 text-sm text-white/60 transition hover:border-white/20 hover:text-white/80"
          >
            + Nieuwe locatie aanmaken
          </button>
          <button
            onClick={() => {
              useSessionStore.getState().logout();
              navigate('/');
            }}
            className="w-full rounded-xl border border-red-500/20 py-3 text-sm text-red-400/60 transition hover:border-red-500/40 hover:text-red-400"
          >
            Uitloggen
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
