import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BucketItem {
  id: string;
  locationId: string;
  locationName: string;
  category: string;
  status: 'todo' | 'done';
  privacy: 'public' | 'friends' | 'private';
  trip: string | null;
}

interface BucketlistState {
  items: BucketItem[];
  addItems: (items: BucketItem[]) => void;
  markDone: (id: string) => void;
  remove: (id: string) => void;
}

const MOCK_ITEMS: BucketItem[] = [
  {
    id: 'mock-1', locationId: 'u173z-begijnhof',
    locationName: 'Begijnhof',
    category: 'hidden', status: 'todo', privacy: 'public', trip: 'Amsterdam 2026',
  },
  {
    id: 'mock-2', locationId: 'u173z-cafe-t-smalle',
    locationName: "Café 't Smalle",
    category: 'nightlife', status: 'todo', privacy: 'private', trip: 'Amsterdam 2026',
  },
  {
    id: 'mock-3', locationId: 'u17pw-ndsm-werf',
    locationName: 'NDSM-werf',
    category: 'culture', status: 'todo', privacy: 'public', trip: null,
  },
  {
    id: 'mock-4', locationId: 'u173m-vondelpark',
    locationName: 'Vondelpark — openluchttheater',
    category: 'nature', status: 'done', privacy: 'public', trip: 'Amsterdam 2026',
  },
  {
    id: 'mock-5', locationId: 'u173y-albert-cuypmarkt',
    locationName: 'Albert Cuypmarkt',
    category: 'market', status: 'done', privacy: 'friends', trip: null,
  },
];

export const useBucketlistStore = create<BucketlistState>()(
  persist(
    (set) => ({
      items: MOCK_ITEMS,

      addItems: (newItems) =>
        set((state) => ({
          // Dedupliceer op locationId + trip zodat dubbel opslaan niets doet
          items: [
            ...state.items,
            ...newItems.filter(
              (n) => !state.items.some(
                (e) => e.locationId === n.locationId && e.trip === n.trip,
              ),
            ),
          ],
        })),

      markDone: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, status: 'done' } : item,
          ),
        })),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    }),
    { name: 'ididhere-bucketlist-v2' },
  ),
);
