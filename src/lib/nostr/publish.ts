import { finalizeEvent } from 'nostr-tools';
import { hexToBytes } from '@noble/hashes/utils';
import { pool } from './pool';

export const DEFAULT_RELAYS = [
  import.meta.env.VITE_RELAY_PRIMARY  ?? 'wss://relay.goosielabs.com',
  import.meta.env.VITE_RELAY_SECONDARY ?? 'wss://relay.idid.here',
  import.meta.env.VITE_RELAY_FALLBACK  ?? 'wss://relay.damus.io',
];

export interface EventTemplate {
  kind: number;
  created_at: number;
  tags: string[][];
  content: string;
}

export interface PublishResult {
  id: string;
  accepted: string[];   // relays die OK terug stuurden
  rejected: string[];   // relays die NOTICE/error terug stuurden
}

// Onderteken een event en publiceer naar relays.
// Gooit een error als geen enkele relay het event accepteert.
export async function signAndPublish(
  template: EventTemplate,
  privateKeyHex: string,
  relays = DEFAULT_RELAYS,
): Promise<PublishResult> {
  const secretKey = hexToBytes(privateKeyHex);
  const signed = finalizeEvent(template, secretKey);

  const results = await Promise.allSettled(pool.publish(relays, signed));

  const accepted: string[] = [];
  const rejected: string[] = [];

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      accepted.push(relays[i]);
    } else {
      rejected.push(relays[i]);
    }
  });

  if (accepted.length === 0) {
    throw new Error('Geen enkele relay accepteerde het event. Controleer je verbinding.');
  }

  return { id: signed.id, accepted, rejected };
}

// Onderteken met een specifieke privésleutel (bijv. slapend account bij Horeca claim).
// Wrapper om de bedoeling duidelijk te maken.
export const signAndPublishAs = signAndPublish;
