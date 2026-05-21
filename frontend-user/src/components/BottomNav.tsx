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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const isHome = item.href === '/';
          const active = isHome ? pathname === '/' : isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 group relative"
            >
              {active && (
                <span className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-[var(--brand-primary)]" />
              )}
              <item.icon
                size={22}
                className={`transition-colors duration-200 ${
                  active
                    ? 'text-[var(--brand-primary)]'
                    : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                }`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                  active
                    ? 'text-[var(--brand-primary)]'
                    : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
