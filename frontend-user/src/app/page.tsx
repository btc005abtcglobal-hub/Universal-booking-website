'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ChevronRight, ChevronLeft, Star, Tag, Flame,
  Plane, Hotel, TrainFront, Palmtree, Film, CalendarDays,
  Ticket, Music, PartyPopper, Gamepad2,
  Stethoscope, Sparkles, CarFront, House, GraduationCap, Briefcase,
  Dumbbell, Key, Scissors, Wrench
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { BottomNav } from '../components/BottomNav';

/* ================================================================
   DATA
   ================================================================ */

const SEARCH_SUGGESTIONS = [
  'dental near me', 'car wash', 'movie tickets', 'yoga class',
  'salon appointment', 'bike rental', 'fitness trainer', 'home cleaning',
];

const BANNERS = [
  { id: 1, gradient: 'from-indigo-600 via-purple-600 to-pink-500', title: 'Flat 50% OFF', subtitle: 'on your first booking — any service', cta: 'Book Now' },
  { id: 2, gradient: 'from-emerald-500 via-teal-500 to-cyan-500', title: 'Home Services', subtitle: 'AC repair, plumbing & more starting ₹149', cta: 'Explore' },
  { id: 3, gradient: 'from-orange-500 via-red-500 to-pink-600', title: 'Weekend Special', subtitle: 'Movie + dinner combos from ₹599', cta: 'Grab Deal' },
];

const CATEGORIES = [
  { slug: 'appointments', name: 'Health', icon: Stethoscope, color: '#6366f1', gradient: 'from-indigo-500 to-purple-600' },
  { slug: 'beauty', name: 'Beauty', icon: Scissors, color: '#ec4899', gradient: 'from-pink-500 to-rose-500' },
  { slug: 'automotive', name: 'Auto', icon: CarFront, color: '#3b82f6', gradient: 'from-blue-500 to-cyan-400' },
  { slug: 'home-services', name: 'Home', icon: House, color: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
  { slug: 'entertainment', name: 'Shows', icon: Film, color: '#f59e0b', gradient: 'from-amber-500 to-orange-500' },
  { slug: 'sports', name: 'Fitness', icon: Dumbbell, color: '#ef4444', gradient: 'from-red-500 to-rose-500' },
  { slug: 'education', name: 'Learn', icon: GraduationCap, color: '#8b5cf6', gradient: 'from-violet-500 to-purple-500' },
  { slug: 'professional', name: 'Pro', icon: Briefcase, color: '#64748b', gradient: 'from-slate-500 to-slate-700' },
  { slug: 'rentals', name: 'Rentals', icon: Key, color: '#0ea5e9', gradient: 'from-sky-500 to-blue-500' },
  { slug: 'services', name: 'Repair', icon: Wrench, color: '#f97316', gradient: 'from-orange-500 to-amber-500' },
];

const OFFER_TABS = [
  { key: 'trending', label: 'Trending', icon: Flame },
  { key: 'flights', label: 'Flights', icon: Plane },
  { key: 'hotels', label: 'Hotels', icon: Hotel },
  { key: 'rails', label: 'Rails', icon: TrainFront },
  { key: 'holidays', label: 'Holidays', icon: Palmtree },
];

const OFFERS: Record<string, { id: string; title: string; subtitle: string; discount: string; gradient: string; validTill: string }[]> = {
  trending: [
    { id: 't1', title: 'Salon Day Out', subtitle: 'Flat 40% off haircuts', discount: '40% OFF', gradient: 'from-fuchsia-500 to-pink-500', validTill: 'Valid till May 31' },
    { id: 't2', title: 'Dental Checkup', subtitle: 'Free X-ray with consultation', discount: 'FREE X-RAY', gradient: 'from-blue-500 to-indigo-500', validTill: 'Valid till Jun 5' },
    { id: 't3', title: 'Car Detailing', subtitle: 'Premium wash from ₹299', discount: '₹299 Only', gradient: 'from-emerald-500 to-green-500', validTill: 'Valid till May 28' },
  ],
  flights: [
    { id: 'f1', title: 'Chennai → Delhi', subtitle: 'Non-stop flights from ₹2,999', discount: '₹2,999', gradient: 'from-sky-500 to-blue-600', validTill: 'Book by May 25' },
    { id: 'f2', title: 'Mumbai → Goa', subtitle: 'Weekend getaway specials', discount: '20% OFF', gradient: 'from-violet-500 to-purple-600', validTill: 'Limited seats' },
  ],
  hotels: [
    { id: 'h1', title: 'Luxury Stays', subtitle: '5-star hotels from ₹4,999/night', discount: 'From ₹4,999', gradient: 'from-amber-500 to-orange-500', validTill: 'Summer special' },
    { id: 'h2', title: 'Business Hotels', subtitle: 'Corporate rates + breakfast', discount: '30% OFF', gradient: 'from-teal-500 to-cyan-500', validTill: 'For corporates' },
  ],
  rails: [
    { id: 'r1', title: 'Tatkal Assist', subtitle: 'We book your tatkal tickets', discount: '₹49 Fee', gradient: 'from-red-500 to-orange-500', validTill: 'Any route' },
    { id: 'r2', title: 'Rajdhani Special', subtitle: 'Premium cabins available', discount: 'Book Now', gradient: 'from-indigo-500 to-blue-500', validTill: 'Selected routes' },
  ],
  holidays: [
    { id: 'p1', title: 'Manali Calling', subtitle: '3N/4D packages from ₹8,999', discount: '₹8,999', gradient: 'from-cyan-500 to-blue-500', validTill: 'Group deals' },
    { id: 'p2', title: 'Goa Beach Vibes', subtitle: 'All-inclusive resort packages', discount: '25% OFF', gradient: 'from-orange-500 to-red-500', validTill: 'Monsoon offer' },
  ],
};

const UPCOMING = [
  { id: 'u1', type: 'Movie', title: 'Mission Impossible 9', venue: 'PVR, Chennai', date: 'May 23', image: '🎬', color: '#ef4444' },
  { id: 'u2', type: 'Event', title: 'Sunburn Festival', venue: 'Marina Beach', date: 'Jun 1', image: '🎵', color: '#8b5cf6' },
  { id: 'u3', type: 'Comedy', title: 'Stand Up Night', venue: 'The Music Academy', date: 'May 26', image: '😂', color: '#f59e0b' },
  { id: 'u4', type: 'Sports', title: 'CSK vs MI', venue: 'Chepauk Stadium', date: 'May 30', image: '🏏', color: '#10b981' },
  { id: 'u5', type: 'Gaming', title: 'BGMI Tournament', venue: 'Online + Venue', date: 'Jun 5', image: '🎮', color: '#3b82f6' },
];

/* ================================================================
   COMPONENT
   ================================================================ */

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeOfferTab, setActiveOfferTab] = useState('trending');
  const inputRef = useRef<HTMLInputElement>(null);

  // Animated placeholder
  useEffect(() => {
    const suggestion = SEARCH_SUGGESTIONS[suggestionIndex];
    let charIndex = isTyping ? 0 : suggestion.length;
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (isTyping) {
        setPlaceholder(suggestion.slice(0, charIndex));
        charIndex++;
        if (charIndex > suggestion.length) {
          setTimeout(() => setIsTyping(false), 1500);
          return;
        }
      } else {
        setPlaceholder(suggestion.slice(0, charIndex));
        charIndex--;
        if (charIndex < 0) {
          setIsTyping(true);
          setSuggestionIndex((i) => (i + 1) % SEARCH_SUGGESTIONS.length);
          return;
        }
      }
      timer = setTimeout(tick, isTyping ? 80 : 40);
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, [suggestionIndex, isTyping]);

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 pb-20">

      {/* ═══════════════════════════════════════════════════════════
          TOP BAR — Search + Address
          ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">β</div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search "${placeholder}"...`}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 outline-none transition-all"
              />
            </div>
          </form>

          {/* Address */}
          <button className="shrink-0 flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5">
            <MapPin size={14} className="text-[var(--brand-primary)]" />
            <span className="hidden sm:inline max-w-[80px] truncate">Chennai</span>
          </button>

          {/* Theme */}
          <ThemeToggle />
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          BANNER / AD CAROUSEL
          ═══════════════════════════════════════════════════════════ */}
      <section className="px-4 pt-4">
        <div className="relative rounded-2xl overflow-hidden h-44 sm:h-52">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className={`absolute inset-0 bg-gradient-to-br ${BANNERS[activeBanner].gradient} p-6 flex flex-col justify-end`}
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30" />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{BANNERS[activeBanner].title}</h2>
                <p className="text-white/80 text-sm mt-1">{BANNERS[activeBanner].subtitle}</p>
                <button className="mt-3 bg-white text-gray-900 font-bold text-xs px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                  {BANNERS[activeBanner].cta} →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeBanner ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORY GRID (2 rows × 5 cols scrollable)
          ═══════════════════════════════════════════════════════════ */}
      <section className="px-4 pt-6 pb-2">
        <div className="grid grid-cols-5 gap-x-2 gap-y-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/${cat.slug}`} className="flex flex-col items-center gap-1.5 group">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                >
                  <cat.icon size={22} className="text-white" strokeWidth={2} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] text-center leading-tight group-hover:text-[var(--text-primary)] transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OFFERS SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="mt-4">
        {/* Header */}
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-[var(--brand-primary)]" />
            <h2 className="text-lg font-bold">Offers</h2>
          </div>
          <Link href="/offers" className="text-xs font-semibold text-[var(--brand-primary)] hover:underline">View All</Link>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 w-max">
            {OFFER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveOfferTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap border ${
                  activeOfferTab === tab.key
                    ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-lg shadow-indigo-500/20'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offer Cards */}
        <div className="px-4 overflow-x-auto hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOfferTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex gap-3 w-max pb-2"
            >
              {(OFFERS[activeOfferTab] || []).map((offer) => (
                <div
                  key={offer.id}
                  className={`relative w-64 sm:w-72 h-36 rounded-2xl bg-gradient-to-br ${offer.gradient} p-4 flex flex-col justify-between overflow-hidden shrink-0 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg`}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                      {offer.discount}
                    </span>
                    <h3 className="text-white font-bold text-base leading-tight">{offer.title}</h3>
                    <p className="text-white/70 text-xs mt-0.5">{offer.subtitle}</p>
                  </div>
                  <span className="relative z-10 text-white/50 text-[10px] font-medium">{offer.validTill}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          UPCOMING SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="mt-6 mb-4">
        {/* Header */}
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-[var(--brand-primary)]" />
            <h2 className="text-lg font-bold">Upcoming</h2>
          </div>
          <Link href="/entertainment" className="text-xs font-semibold text-[var(--brand-primary)] hover:underline">View All</Link>
        </div>

        {/* Category Pills */}
        <div className="px-4 mb-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 w-max">
            {[
              { label: 'Movies', icon: Film },
              { label: 'Events', icon: PartyPopper },
              { label: 'Concerts', icon: Music },
              { label: 'Sports', icon: Ticket },
              { label: 'Gaming', icon: Gamepad2 },
            ].map((pill, i) => (
              <button
                key={pill.label}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all border whitespace-nowrap ${
                  i === 0
                    ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                }`}
              >
                <pill.icon size={14} />
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Cards */}
        <div className="px-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 w-max pb-2">
            {UPCOMING.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="w-40 sm:w-48 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden cursor-pointer hover:border-[var(--border-strong)] hover:shadow-xl transition-all group shrink-0"
              >
                {/* Image Area */}
                <div
                  className="h-24 sm:h-28 flex items-center justify-center text-4xl relative"
                  style={{ background: `linear-gradient(135deg, ${item.color}22, ${item.color}44)` }}
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{item.image}</span>
                  <span
                    className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: item.color }}
                  >
                    {item.type}
                  </span>
                </div>
                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-tight truncate">{item.title}</h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">{item.venue}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-[var(--text-secondary)] font-medium">
                    <CalendarDays size={11} />
                    <span>{item.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          QUICK STATS / TRUST BAR
          ═══════════════════════════════════════════════════════════ */}
      <section className="px-4 py-6">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-[var(--border-subtle)] p-5">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { value: '500+', label: 'Categories' },
              { value: '10K+', label: 'Providers' },
              { value: '1M+', label: 'Bookings' },
              { value: '4.8★', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-base sm:text-lg font-black gradient-text">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-[var(--text-muted)] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER (minimal, since bottom nav exists)
          ═══════════════════════════════════════════════════════════ */}
      <footer className="px-4 pb-24 text-center">
        <p className="text-[11px] text-[var(--text-muted)]">© 2026 BETA Universal Service Marketplace</p>
      </footer>

      {/* ═══════════════════════════════════════════════════════════
          BOTTOM NAVIGATION BAR
          ═══════════════════════════════════════════════════════════ */}
      <BottomNav />
    </main>
  );
}
