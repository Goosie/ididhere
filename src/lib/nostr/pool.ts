import { SimplePool } from 'nostr-tools';

// Singleton pool — wordt gedeeld door alle publish/subscribe calls
export const pool = new SimplePool();
