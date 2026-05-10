import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Map — groot, alleen nodig op de kaartpagina
          'vendor-map': ['leaflet', 'react-leaflet'],
          // Crypto — alleen nodig tijdens onboarding en signing
          'vendor-crypto': ['bip39', '@scure/bip32', '@noble/hashes'],
          // Nostr protocol
          'vendor-nostr': ['nostr-tools'],
          // React core — altijd nodig, maar los van de rest
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // State
          'vendor-zustand': ['zustand'],
        },
      },
    },
  },
});
