'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, Hotel, Plane, Bus, Film, CalendarDays, TrainFront,
  Car, FileCheck, Package, MapPin, Shield, Settings, Award
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { href: '/', label: 'For You', icon: Sparkles },
  { href: '/appointments', label: 'Hotels', icon: Hotel },
  { href: '/entertainment', label: 'Flights', icon: Plane },
  { href: '/automotive', label: 'Bus', icon: Bus },
  { href: '/entertainment/movies', label: 'Movie', icon: Film },
  { href: '/entertainment/events', label: 'Event', icon: CalendarDays },
  { href: '/rentals', label: 'Train', icon: TrainFront },
  { href: '/services', label: 'Cab', icon: Car },
  { href: '/professional', label: 'Visa', icon: FileCheck },
  { href: '/home-services', label: 'Packages', icon: Package },
  { href: '/beauty', label: 'Local Booking', icon: MapPin },
  { href: '/sports', label: 'Insurance', icon: Shield },
  { href: '/education', label: 'Services', icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-desktop h-screen w-72 fixed left-0 top-0 pt-24 glass border-r border-[var(--outline-variant)]/10 flex flex-col gap-2 p-6 z-40 overflow-y-auto">
      {/* Section label */}
      <div className="mb-4 px-2">
        <h3 className="label-upper text-[var(--on-surface-variant)]">Categories</h3>
      </div>

      {/* Nav links */}
      <nav className="space-y-1 flex-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer: Elite badge */}
      <div className="pt-6 border-t border-[var(--outline-variant)]/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
            <Award size={20} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[var(--on-surface)]">Travel Elite</p>
            <p className="text-[10px] text-[var(--primary)] uppercase tracking-[0.2em] font-bold">Gold Status</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
