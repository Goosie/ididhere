import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';

export default function S01Landing() {
  const navigate = useNavigate();
  const onboarded = useSessionStore((s) => s.onboarded);

  useEffect(() => {
    if (onboarded) {
      navigate('/home', { replace: true });
    }
  }, [onboarded, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-5">
      <div className="mb-8 text-6xl">🪿</div>
      <h1 className="mb-3 text-center text-3xl font-bold">IDidHere</h1>
      <p className="mb-10 text-center text-sm text-white/50">
        Ontdek plekken. Bezoek ze echt. Bewijs het voor altijd.
      </p>
      <button
        onClick={() => navigate('/onboarding/keys')}
        className="w-full max-w-xs rounded-xl bg-brand py-3.5 font-semibold text-white transition hover:bg-brand/90 active:scale-95"
      >
        Beginnen
      </button>
    </div>
  );
}
