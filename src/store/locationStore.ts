import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Location } from '../types/location';
import { MOCK_LOCATIONS } from '../data/mockLocations';

interface LocationState {
  locations: Location[];
  addLocations: (locs: Location[]) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      locations: MOCK_LOCATIONS,
      addLocations: (locs) =>
        set((state) => ({
          locations: [
            ...state.locations,
            ...locs.filter((n) => !state.locations.some((e) => e.id === n.id)),
          ],
        })),
    }),
    { name: 'ididhere-locations-v2' },
  ),
);
