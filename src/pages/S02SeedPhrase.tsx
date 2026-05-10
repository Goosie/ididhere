import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateUserKeys } from '../lib/crypto/onboarding';
import { useSessionStore } from '../store/sessionStore';
import type { UserKeys } from '../lib/crypto/onboarding';

type Step = 'loading' | 'show' | 'verify' | 'done';

interface VerifyChallenge {
  wordIndex: number; // 0-based
  answer: string;
  input: string;
}

function pickVerifyWords(words: string[]): VerifyChallenge[] {
  // Kies 3 willekeurige, niet-opeenvolgende posities
  const positions = new Set<number>();
  while (positions.size < 3) {
    positions.add(Math.floor(Math.random() * 12));
  }
  return [...positions].sort((a, b) => a - b).map((i) => ({
    wordIndex: i,
    answer: words[i],
    input: '',
  }));
}

export default function S02SeedPhrase() {
  const navigate = useNavigate();
  const setKeys = useSessionStore((s) => s.setKeys);
  const setOnboarded = useSessionStore((s) => s.setOnboarded);

  const [step, setStep] = useState<Step>('loading');
  const [keys, setLocalKeys] = useState<UserKeys | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<VerifyChallenge[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Genereer sleutels éénmalig bij mount
  const generated = useRef(false);
  useEffect(() => {
    if (generated.current) return;
    generated.current = true;
    generateUserKeys().then((k) => {
      setLocalKeys(k);
      setWords(k.mnemonic.split(' '));
      setStep('show');
    });
  }, []);

  function handleCopy() {
    if (!keys) return;
    navigator.clipboard.writeText(keys.mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfirmSaved() {
    if (!words.length) return;
    setChallenges(pickVerifyWords(words));
    setStep('verify');
  }

  function handleVerifyInput(idx: number, value: string) {
    setChallenges((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, input: value.trim().toLowerCase() } : c)),
    );
    setError('');
  }

  function handleVerifySubmit() {
    const wrong = challenges.find((c) => c.input !== c.answer.toLowerCase());
    if (wrong) {
      setError(`Woord ${wrong.wordIndex + 1} klopt niet. Controleer je herstelzin.`);
      return;
    }
    // Verificatie geslaagd — sla sleutels op in sessie
    if (keys) {
      setKeys(keys.privateKey, keys.publicKey);
      setOnboarded();
    }
    setStep('done');
    setTimeout(() => navigate('/onboarding/wallet'), 1200);
  }

  if (step === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="mb-3 text-4xl">🪿</div>
          <p className="text-sm text-white/50">Jouw sleutels worden aangemaakt…</p>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="mb-3 text-4xl">✅</div>
          <p className="text-white/70">Gelukt! Even geduld…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas px-5 py-10">
      <div className="mx-auto w-full max-w-md">

        {/* Header */}
        <div className="mb-1 text-xs font-medium uppercase tracking-widest text-white/30">
          Stap 1 van 2
        </div>
        <h1 className="mb-2 text-2xl font-bold">Jouw herstelzin</h1>
        <p className="mb-8 text-sm leading-relaxed text-white/60">
          Dit zijn de 12 woorden die toegang geven tot jouw account. Schrijf ze op papier.
          Als je ze kwijtraakt, is er <strong className="text-white/90">geen manier</strong> om
          je account te herstellen.
        </p>

        {step === 'show' && (
          <>
            {/* 12-woorden grid */}
            <div className="mb-6 grid grid-cols-3 gap-2">
              {words.map((word, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
                >
                  <span className="w-5 text-right text-xs text-white/30">{i + 1}.</span>
                  <span className="font-mono text-sm font-medium text-white">{word}</span>
                </div>
              ))}
            </div>

            {/* Kopieerknop */}
            <button
              onClick={handleCopy}
              className="mb-4 w-full rounded-lg border border-border bg-surface py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white/80"
            >
              {copied ? '✓ Gekopieerd' : 'Kopiëren naar klembord'}
            </button>

            {/* Waarschuwing */}
            <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
              <p className="text-xs leading-relaxed text-yellow-300/90">
                ⚠️ Bewaar deze woorden offline. Sla ze nooit op in een app, foto of
                e-mail. IDidHere ziet jouw woorden nooit.
              </p>
            </div>

            <button
              onClick={handleConfirmSaved}
              className="w-full rounded-xl bg-brand py-3.5 font-semibold text-white transition hover:bg-brand/90 active:scale-95"
            >
              Ik heb ze veilig opgeslagen →
            </button>
          </>
        )}

        {step === 'verify' && (
          <>
            <p className="mb-6 text-sm text-white/60">
              Ter bevestiging: vul de gevraagde woorden in.
            </p>

            <div className="mb-6 space-y-4">
              {challenges.map((c, i) => (
                <div key={i}>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Woord <span className="text-white">#{c.wordIndex + 1}</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={c.input}
                    onChange={(e) => handleVerifyInput(i, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifySubmit()}
                    placeholder="Typ het woord…"
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none focus:border-brand"
                  />
                </div>
              ))}
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              onClick={handleVerifySubmit}
              className="w-full rounded-xl bg-brand py-3.5 font-semibold text-white transition hover:bg-brand/90 active:scale-95"
            >
              Bevestigen
            </button>

            <button
              onClick={() => { setError(''); setStep('show'); }}
              className="mt-3 w-full py-2 text-sm text-white/40 hover:text-white/60"
            >
              Herstelzin opnieuw bekijken
            </button>
          </>
        )}
      </div>
    </div>
  );
}
