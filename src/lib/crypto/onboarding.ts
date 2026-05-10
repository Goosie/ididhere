import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import { getPublicKey } from 'nostr-tools';
import { privateKeyFromSeedWords } from 'nostr-tools/nip06';
import { bytesToHex } from '@noble/hashes/utils';

export interface UserKeys {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  btcKey: HDKey;
}

export async function generateUserKeys(): Promise<UserKeys> {
  const mnemonic = bip39.generateMnemonic(128); // 12 woorden
  return buildKeys(mnemonic);
}

export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

// Herstel sleutels uit bestaande seed phrase (voor returning users)
export async function restoreUserKeys(mnemonic: string): Promise<UserKeys> {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Ongeldige herstelzin');
  }
  return buildKeys(mnemonic);
}

async function buildKeys(mnemonic: string): Promise<UserKeys> {
  const privateKeyBytes = privateKeyFromSeedWords(mnemonic);
  const privateKey = bytesToHex(privateKeyBytes);
  const publicKey = getPublicKey(privateKeyBytes);

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hdKey = HDKey.fromMasterSeed(seed);
  const btcKey = hdKey.derive("m/44'/0'/0'/0/0");

  return { mnemonic, privateKey, publicKey, btcKey };
}
