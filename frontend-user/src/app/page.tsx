'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TopNav } from '../components/TopNav';
import { BottomNav } from '../components/BottomNav';
import { SideNav } from '../components/SideNav';
import { ShortcutDock } from '../components/shortcuts/ShortcutDock';
import { ShortcutManagerModal } from '../components/shortcuts/ShortcutManagerModal';
import { ActionModalManager } from '../components/shortcuts/ActionModalManager';
import { useBookingFlowStore } from '../lib/store';

const PRIMARY_CATEGORIES = [
  { id: 'travel-transport', label: 'Travel & Transport', icon: 'directions_car', from: '#60A5FA', to: '#3B82F6', glow: 'rgba(96,165,250,0.40)', href: '/travel-transport' },
  { id: 'stay-accommodation', label: 'Stay & Accommodation', icon: 'hotel', from: '#FBBF24', to: '#F59E0B', glow: 'rgba(251,191,36,0.40)', href: '/stay-accommodation' },
  { id: 'entertainment-events', label: 'Entertainment & Events', icon: 'movie', from: '#F472B6', to: '#EC4899', glow: 'rgba(244,114,182,0.40)', href: '/entertainment-events' },
  { id: 'sports-turf', label: 'Sports & Turf', icon: 'sports_soccer', from: '#34D399', to: '#10B981', glow: 'rgba(52,211,153,0.40)', href: '/sports-turf' },
  { id: 'lifestyle-local', label: 'Lifestyle & Local Services', icon: 'restaurant', from: '#A78BFA', to: '#8B5CF6', glow: 'rgba(167,139,250,0.40)', href: '/lifestyle-local' },
  { id: 'business-professional', label: 'Business & Professional', icon: 'business', from: '#818CF8', to: '#4F46E5', glow: 'rgba(129,140,248,0.40)', href: '/business-professional' },
  { id: 'religious-government', label: 'Religious & Gov Services', icon: 'account_balance', from: '#F97316', to: '#EA580C', glow: 'rgba(249,115,22,0.40)', href: '/religious-government' },
  { id: 'rental-equipment', label: 'Rental & Equipment', icon: 'shopping_bag', from: '#2DD4BF', to: '#0D9488', glow: 'rgba(45,212,191,0.40)', href: '/rental-equipment' },
  { id: 'personal-misc', label: 'Personal & Misc Services', icon: 'pets', from: '#F87171', to: '#EF4444', glow: 'rgba(248,113,113,0.40)', href: '/personal-misc' },
];

function CategoryCard({
  label,
  icon,
  from,
  to,
  glow,
  href,
}: {
  label: string;
  icon: string;
  from: string;
  to: string;
  glow: string;
  href: string;
}) {
  return (
    <Link href={href} className="w-full group">
      <div
        className="relative h-[108px] rounded-2xl flex flex-col items-center justify-center gap-2.5 overflow-hidden border border-[color:var(--color-outline-variant)]/30 bg-[color:var(--color-surface-container)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 card-glass"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500"
          style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
        />
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: `inset 0 0 0 1px ${glow}` }}
        />
        <div
          className="category-badge relative z-10"
          style={{
            background: `linear-gradient(135deg, ${from}, ${to})`,
            boxShadow: `0 4px 16px ${glow}, 0 2px 6px rgba(0,0,0,0.6)`,
          }}
        >
          <span className="material-symbols-outlined text-[#0C0C10] text-[21px]" style={{ fontVariationSettings: "'wght' 500" }}>
            {icon}
          </span>
        </div>
        <span className="relative z-10 text-[12px] font-semibold tracking-wide text-[color:var(--color-on-surface-variant)] group-hover:text-[color:var(--color-on-surface)] transition-colors duration-300">
          {label}
        </span>
      </div>
    </Link>
  );
}

function SectionHeader({ title, sub, href }: { title: string; sub: string; href: string }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <h2 className="text-[18px] font-bold text-[color:var(--color-on-surface)] tracking-tight">{title}</h2>
        <p className="text-[12px] mt-0.5 text-[color:var(--color-outline)]">{sub}</p>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-[12px] font-semibold text-[color:var(--color-primary)] hover:gap-2 transition-all duration-300 shrink-0"
      >
        View All
        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
      </Link>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: string;
}) {
  return (
    <div className="card-glass rounded-2xl p-4 md:p-5 bg-[color:var(--color-surface-container)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-[color:var(--color-outline)]">{label}</p>
          <p className="mt-2 text-[24px] md:text-[28px] font-black text-[color:var(--color-on-surface)] leading-none">{value}</p>
          <p className="mt-2 text-[12px] text-[color:var(--color-on-surface-variant)]">{note}</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-[color:var(--color-primary)]/10 flex items-center justify-center border border-[color:var(--color-primary)]/20">
          <span className="material-symbols-outlined text-[color:var(--color-primary)] text-[22px]" style={{ fontVariationSettings: "'wght' 500" }}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { bookings } = useBookingFlowStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[color:var(--color-background)]">
        <div className="h-8 w-8 border-4 border-[color:var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const activeNote = activeCount === 1 ? '1 active reservation' : `${activeCount} active reservations`;

  return (
    <>
      <ShortcutManagerModal />
      <ActionModalManager />
      <TopNav />
      <div className="hidden lg:block">
        <SideNav />
      </div>

      <main className="page-content-with-sidenav px-4 md:px-8 lg:pr-8">
        <div className="mx-auto max-w-7xl">
          <section className="mb-6 md:mb-8">
            <div className="card-glass rounded-[28px] p-5 md:p-8 overflow-hidden relative">
              <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'radial-gradient(circle at top right, rgba(255,215,0,0.55), transparent 42%)' }} />
              <div className="relative grid gap-6 items-start lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-outline)]">Dashboard Overview</p>
                  <h1 className="mt-3 text-[30px] md:text-[42px] font-black tracking-tight text-[color:var(--color-on-surface)] leading-tight">
                    Book smarter with a cleaner, elegant control center.
                  </h1>
                  <p className="mt-4 max-w-2xl text-[14px] md:text-[16px] leading-7 text-[color:var(--color-on-surface-variant)]">
                    Your homepage now includes a desktop dashboard sidebar for settings, bookings, services, analytics, and account controls while keeping the mobile experience light and fast.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/search" className="rounded-xl bg-[color:var(--color-primary)] px-4 py-3 text-sm font-bold text-[color:var(--color-on-primary)] shadow-lg shadow-[rgba(255,215,0,0.18)] transition-transform hover:scale-[1.02]">
                      Explore Services
                    </Link>
                    <Link href="/profile" className="rounded-xl border border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container-high)] px-4 py-3 text-sm font-semibold text-[color:var(--color-on-surface)] transition-colors hover:border-[color:var(--color-primary)]/40 hover:bg-[color:var(--color-surface-container-highest)]">
                      Open Settings
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <StatCard label="Active Bookings" value={String(activeCount)} note={activeNote} icon="calendar_month" />
                  <StatCard label="Saved Places" value="28" note="Across hotels, events, and services" icon="favorite" />
                  <StatCard label="Support Score" value="98%" note="Fast response and booking reliability" icon="verified" />
                </div>
              </div>
            </div>
          </section>

          <section
            id="ad-banner-hero"
            data-ad-slot=""
            aria-label="Advertisement"
            className="ad-block mt-5 mb-8"
          >
            <div
              className="w-full h-[172px] md:h-[212px] rounded-2xl overflow-hidden relative border border-[color:var(--color-outline-variant)]/30 bg-[color:var(--color-surface-container)] card-glass"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,215,0,0.06)' }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-1/3 animate-shimmer"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.04), transparent)' }}
                />
              </div>
              <div className="relative flex flex-col items-center justify-center h-full gap-3 opacity-35">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.10)' }}>
                  <span className="material-symbols-outlined text-[color:var(--color-primary)] text-[26px]">ad_group</span>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-outline)]">
                  Advertisement
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold tracking-wide text-[color:var(--color-on-surface)]">
                Quick Actions
              </h2>
              <span className="text-[12px] text-[color:var(--color-outline)]">Manage shortcuts and workflow</span>
            </div>
            <div className="card-glass rounded-2xl p-3 md:p-4">
              <ShortcutDock />
            </div>
          </section>

          <section className="mb-8">
            <SectionHeader title="Browse Categories" sub="Select a category to start booking services" href="/categories" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {PRIMARY_CATEGORIES.map((cat) => (
                <CategoryCard key={cat.id} {...cat} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
