import { Link, useLocation } from '@tanstack/react-router';
import { Home, PlusCircle, Images, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const BASE_ITEMS = [
  { to: '/' as const, label: 'Home', icon: Home },
  { to: '/create' as const, label: 'Create', icon: PlusCircle },
  { to: '/gallery' as const, label: 'Gallery', icon: Images },
];

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const NAV_ITEMS = [
    ...BASE_ITEMS,
    { to: (user ? '/account' : '/auth') as '/auth' | '/account', label: user ? 'Me' : 'Sign In', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors"
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-neon-purple' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-[10px] font-display tracking-wider uppercase transition-colors ${
                  isActive ? 'text-neon-purple' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <div className="h-0.5 w-4 rounded-full bg-neon-purple mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
