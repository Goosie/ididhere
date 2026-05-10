// Declareer Buffer als global zodat bip39 en @scure/bip32 werken in de browser
declare global {
  // eslint-disable-next-line no-var
  var Buffer: typeof import('buffer').Buffer;
}

export {};
