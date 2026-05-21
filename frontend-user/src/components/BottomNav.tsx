'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Sparkles, Route, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/ai', label: 'AI', icon: Sparkles },
  { href: '/user/bookings', label: 'Tracks', icon: Route },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-[var(--surface)]/95 backdrop-blur-lg border-t border-[var(--outline-variant)]/30 fixed bottom-0 w-full z-50 h-[72px] transition-all duration-300"
      style={{ boxShadow: 'var(--shadow-bottom-nav)' }}
    >
      <div className="flex justify-around items-center px-6 lg:px-10 h-full max-w-xl mx-auto">
        {NAV_ITEMS.map((item) => {
          const isHome = item.href === '/';
          const active = isHome ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all duration-200 ${
                active
                  ? 'text-[var(--primary)] scale-105'
                  : 'text-[var(--on-surface-variant)] opacity-60 hover:opacity-100'
              }`}
            >
              <item.icon
                size={22}
                strokeWidth={active ? 2 : 1.5}
                fill={active ? 'currentColor' : 'none'}
              />
              <span className="text-[11px] font-semibold tracking-[0.08em] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
