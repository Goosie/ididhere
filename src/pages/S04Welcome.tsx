import { useNavigate } from 'react-router-dom';

export default function S04Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5">
      <div className="mb-4 text-6xl">🪿</div>
      <h1 className="mb-2 text-2xl font-bold">Welkom bij IDidHere</h1>
      <p className="mb-2 text-center text-sm text-white/50">
        Welkomstgans — alleen voor nieuwe ontdekkers
      </p>
      <p className="mb-10 text-center text-xs text-white/30">
        Jouw eerste gans is opgeslagen op Nostr. Van jou, voor altijd.
      </p>
      <button
        onClick={() => navigate('/home')}
        className="w-full max-w-xs rounded-xl bg-accent py-3.5 font-semibold text-canvas transition hover:bg-accent/90 active:scale-95"
      >
        Ontdekken →
      </button>
    </div>
  );
}
