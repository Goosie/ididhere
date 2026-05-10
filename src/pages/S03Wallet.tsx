import { useNavigate } from 'react-router-dom';

export default function S03Wallet() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-canvas px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-1 text-xs font-medium uppercase tracking-widest text-white/30">
          Stap 2 van 2 — optioneel
        </div>
        <h1 className="mb-2 text-2xl font-bold">Wallet koppelen</h1>
        <p className="mb-8 text-sm text-white/60">
          Een wallet is alleen nodig om sats te sturen of ontvangen. Je kunt de app volledig
          gebruiken zonder.
        </p>

        <div className="mb-4 rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium text-white/80">Alby wallet koppelen</p>
          <p className="mt-1 text-xs text-white/40">Opent als popup — je verlaat de app niet</p>
        </div>

        <div className="mb-8 rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium text-white/80">Eigen NWC wallet koppelen</p>
          <p className="mt-1 text-xs text-white/40">Voer je Nostr Wallet Connect URL in</p>
        </div>

        <button
          onClick={() => navigate('/onboarding/welcome')}
          className="w-full rounded-xl bg-brand py-3.5 font-semibold text-white transition hover:bg-brand/90 active:scale-95"
        >
          Doorgaan →
        </button>
        <button
          onClick={() => navigate('/onboarding/welcome')}
          className="mt-3 w-full py-2 text-sm text-white/40 hover:text-white/60"
        >
          Overslaan, wallet later instellen
        </button>
      </div>
    </div>
  );
}
