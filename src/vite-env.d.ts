/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_RELAY_PRIMARY?: string;
  readonly VITE_RELAY_SECONDARY?: string;
  readonly VITE_RELAY_FALLBACK?: string;
  readonly VITE_ALBY_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
