import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { icon: '🗺️', label: 'Kaart',   path: '/home' },
  { icon: '🎒', label: 'Bucket',  path: '/bucket' },
  { icon: '✈️',  label: 'Reis',   path: '/trip/new' },
  { icon: '👤', label: 'Profiel', path: '/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 flex border-t border-border bg-canvas">
      {TABS.map((tab) => {
        const active = pathname === tab.path || (tab.path === '/home' && pathname === '/map');
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs transition ${
              active ? 'text-brand' : 'text-white/30 hover:text-white/60'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
