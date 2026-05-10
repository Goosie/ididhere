// Polyfill Buffer voor crypto-libraries die Node.js verwachten (bip39, @scure/bip32)
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
