import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  // Publieke sleutel — veilig op te slaan
  publicKey: string | null;
  // Privésleutel — alleen in geheugen, nooit naar localStorage
  privateKey: string | null;
  // Onboarding afgerond?
  onboarded: boolean;

  setKeys: (privateKey: string, publicKey: string) => void;
  setOnboarded: () => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      publicKey: null,
      privateKey: null,
      onboarded: false,

      setKeys: (privateKey, publicKey) => set({ privateKey, publicKey }),
      setOnboarded: () => set({ onboarded: true }),
      logout: () => set({ publicKey: null, privateKey: null, onboarded: false }),
    }),
    {
      name: 'ididhere-session',
      // Alleen publicKey persisteren — privateKey nooit naar localStorage
      partialize: (state) => ({
        publicKey: state.publicKey,
        onboarded: state.onboarded,
      }),
    },
  ),
);
