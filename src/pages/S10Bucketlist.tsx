import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

type Status = 'todo' | 'done';
type BucketTab = 'todo' | 'done';

interface BucketItem {
  id: string;
  locationId: string;
  locationName: string;
  category: string;
  status: Status;
  privacy: 'public' | 'friends' | 'private';
  trip: string | null;
}

const CATEGORY_ICON: Record<string, string> = {
  food: '🍽️', nature: '🌿', culture: '🏛️',
  nightlife: '🌙', market: '🛒', viewpoint: '👁️', hidden: '🔮',
};

const PRIVACY_ICON: Record<string, string> = {
  public: '🌍', friends: '👥', private: '🔒',
};

// Mock bucketlist items — worden vervangen door Nostr relay fetch (kind-37517)
const INITIAL_ITEMS: BucketItem[] = [
  {
    id: '1', locationId: 'sxss4-alexander-nevsky',
    locationName: 'Alexander Nevsky Cathedral',
    category: 'culture', status: 'todo', privacy: 'public', trip: 'Sofia 2026',
  },
  {
    id: '2', locationId: 'sxss3-one-more-bar',
    locationName: 'One More Bar',
    category: 'nightlife', status: 'todo', privacy: 'private', trip: 'Sofia 2026',
  },
  {
    id: '3', locationId: 'sxss5-vitosha-blvd',
    locationName: 'Vitosha Boulevard — zuidkant',
    category: 'hidden', status: 'todo', privacy: 'public', trip: null,
  },
  {
    id: '4', locationId: 'sxss6-borisova-gradina',
    locationName: 'Borisova Gradina',
    category: 'nature', status: 'done', privacy: 'public', trip: 'Sofia 2026',
  },
  {
    id: '5', locationId: 'sxss0-zhenski-pazar',
    locationName: 'Zhenski Pazar',
    category: 'market', status: 'done', privacy: 'friends', trip: null,
  },
];

export default function S10Bucketlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState<BucketItem[]>(INITIAL_ITEMS);
  const [tab, setTab] = useState<BucketTab>('todo');

  function markDone(id: string) {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, status: 'done' } : item)
    );
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const visible = items.filter((item) => item.status === tab);
  const todoCount = items.filter((i) => i.status === 'todo').length;
  const doneCount = items.filter((i) => i.status === 'done').length;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Header */}
      <div className="border-b border-border bg-canvas px-5 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Bucketlist</h1>
          <button
            onClick={() => navigate('/trip/new')}
            className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/20 transition"
          >
            + Reis
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {([
          ['todo', `Te doen · ${todoCount}`],
          ['done', `Gedaan · ${doneCount}`],
        ] as [BucketTab, string][]).map(([key, label]) => (
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

      {/* Lijst */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-3">
        {visible.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-4xl">🪿</p>
            <p className="mt-3 text-sm text-white/40">
              {tab === 'todo'
                ? 'Voeg locaties toe via de kaart of via een reis.'
                : 'Nog geen check-ins gedaan.'}
            </p>
            {tab === 'todo' && (
              <button
                onClick={() => navigate('/home')}
                className="mt-4 rounded-xl bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand/90"
              >
                Naar kaart
              </button>
            )}
          </div>
        )}

        <div className="space-y-2">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <span className="shrink-0 text-2xl">{CATEGORY_ICON[item.category] ?? '📍'}</span>

              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate(`/place/${item.locationId}`)}
                  className="truncate text-sm font-medium text-white hover:text-brand transition text-left"
                >
                  {item.locationName}
                </button>
                <div className="mt-0.5 flex items-center gap-2">
                  {item.trip && (
                    <span className="text-xs text-white/30">🎒 {item.trip}</span>
                  )}
                  <span className="text-xs text-white/25">{PRIVACY_ICON[item.privacy]}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {item.status === 'todo' ? (
                  <>
                    <button
                      onClick={() => navigate(`/checkin/${item.locationId}`)}
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-canvas transition hover:bg-accent/90"
                    >
                      IDidHere
                    </button>
                    <button
                      onClick={() => markDone(item.id)}
                      className="rounded-lg border border-border px-2 py-1.5 text-xs text-white/30 hover:text-white/60 transition"
                      title="Markeer als gedaan"
                    >
                      ✓
                    </button>
                  </>
                ) : (
                  <span className="text-lg">🪿</span>
                )}
                <button
                  onClick={() => remove(item.id)}
                  className="text-xs text-white/20 hover:text-red-400 transition"
                  title="Verwijderen"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
