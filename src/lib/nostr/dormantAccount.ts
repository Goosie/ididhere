import { sha256 } from '@noble/hashes/sha256';
import { HDKey } from '@scure/bip32';
import { bytesToHex } from '@noble/hashes/utils';

// JURIDISCH KRITIEK: Perry beheert deze sleutels NOOIT.
// De privésleutel wordt uitsluitend lokaal afgeleid en nooit opgeslagen of verzonden.
// Horeca bewijst eigenaarschap door fysiek aanwezig te zijn op de locatie.

export interface DormantAccountInfo {
  publicKey: string;  // x-only 32-byte pubkey (Nostr formaat), hex
}

export interface DormantKeyPair {
  privateKey: string; // 32 bytes, hex — NOOIT opslaan
  publicKey: string;  // x-only 32 bytes, hex
}

// Berekent de publieke sleutel voor een slapend account op basis van GPS coördinaten.
// Veilig om te tonen — bevat geen gevoelige informatie.
export function getDormantAccountInfo(lat: number, lon: number): DormantAccountInfo {
  const { publicKey } = deriveDormantKeyPair(lat, lon);
  return { publicKey };
}

// Leidt het volledige sleutelpaar af — alleen aanroepen vlak voor claim verificatie.
// NOOIT opslaan of loggen. Resultaat direct gebruiken voor signing en dan weggooien.
export function deriveDormantKeyPair(lat: number, lon: number): DormantKeyPair {
  const coordString = `${lat.toFixed(6)},${lon.toFixed(6)}`;
  const seed = sha256(new TextEncoder().encode(coordString));

  const hdKey = HDKey.fromMasterSeed(seed);
  const derived = hdKey.derive("m/44'/1237'/0'/0/0"); // NIP-06 pad

  const privateKey = bytesToHex(derived.privateKey!);
  // Nostr gebruikt x-only pubkeys: verwijder de 02/03 prefix (1 byte)
  const publicKey = bytesToHex(derived.publicKey!.slice(1));

  return { privateKey, publicKey };
}

// Verkorte weergave van een pubkey voor de UI (eerste 8 + … + laatste 4 hex tekens)
export function shortPubkey(pubkey: string): string {
  if (pubkey.length < 16) return pubkey;
  return `${pubkey.slice(0, 8)}…${pubkey.slice(-4)}`;
}
