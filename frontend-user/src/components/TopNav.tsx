'use client';

import Link from 'next/link';
import { Search, Heart, ShoppingBag } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function TopNav() {
  return (
    <header className="bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--outline-variant)]/20 shadow-sm fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-5 lg:px-20 py-4 lg:py-5">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6 lg:gap-12">
          <Link href="/" className="font-['Playfair_Display'] text-[22px] lg:text-[28px] tracking-[0.15em] text-[var(--primary)] uppercase font-semibold">
            BETA
          </Link>
          <nav className="hidden md:flex gap-6 lg:gap-8">
            <Link
              href="/"
              className="text-[14px] font-medium tracking-[0.05em] text-[var(--primary)] font-bold border-b-2 border-[var(--primary)] pb-1"
            >
              Discover
            </Link>
            <Link
              href="/ai"
              className="text-[14px] font-medium tracking-[0.05em] text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors"
            >
              Concierge
            </Link>
            <Link
              href="/explore"
              className="text-[14px] font-medium tracking-[0.05em] text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors"
            >
              Venture
            </Link>
          </nav>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" strokeWidth={1.5} />
            <input
              className="bg-[var(--surface-variant)]/20 border-none rounded-full py-2.5 pl-10 pr-4 text-[14px] tracking-[0.05em] focus:ring-1 focus:ring-[var(--primary)] w-56 lg:w-64 transition-all duration-300 text-[var(--on-surface)] placeholder-[var(--on-surface-variant)] outline-none"
              placeholder="Search experiences..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-1 lg:gap-2">
            <button className="p-2 hover:bg-[var(--surface-variant)]/10 transition-all text-[var(--on-surface-variant)] hover:text-[var(--primary)] rounded-lg">
              <Heart size={20} strokeWidth={1.5} />
            </button>
            <button className="p-2 hover:bg-[var(--surface-variant)]/10 transition-all text-[var(--on-surface-variant)] hover:text-[var(--primary)] rounded-lg relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full" />
            </button>
            <ThemeToggle />

            {/* Profile avatar */}
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] text-sm font-bold ml-1">
              R
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
