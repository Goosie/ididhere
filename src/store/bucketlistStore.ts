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
    id: 'mock-1', locationId: 'sxss4-alexander-nevsky',
    locationName: 'Alexander Nevsky Cathedral',
    category: 'culture', status: 'todo', privacy: 'public', trip: 'Sofia 2026',
  },
  {
    id: 'mock-2', locationId: 'sxss3-one-more-bar',
    locationName: 'One More Bar',
    category: 'nightlife', status: 'todo', privacy: 'private', trip: 'Sofia 2026',
  },
  {
    id: 'mock-3', locationId: 'sxss5-vitosha-blvd',
    locationName: 'Vitosha Boulevard — zuidkant',
    category: 'hidden', status: 'todo', privacy: 'public', trip: null,
  },
  {
    id: 'mock-4', locationId: 'sxss6-borisova-gradina',
    locationName: 'Borisova Gradina',
    category: 'nature', status: 'done', privacy: 'public', trip: 'Sofia 2026',
  },
  {
    id: 'mock-5', locationId: 'sxss0-zhenski-pazar',
    locationName: 'Zhenski Pazar',
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
    { name: 'ididhere-bucketlist' },
  ),
);
