'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MapPin, Star, Compass, ArrowRight } from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { BottomNav } from '../components/BottomNav';
import { ShortcutManagerModal } from '../components/shortcuts/ShortcutManagerModal';
import { ActionModalManager } from '../components/shortcuts/ActionModalManager';
import { useBookingFlowStore, useLocationStore } from '../lib/store';
import { useShortcutStore, AVAILABLE_SHORTCUTS } from '../store/useShortcutStore';
import { calculateDistance, getProvidersByCategory } from '../lib/mockData';
import { api } from '../lib/api';

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-[color:var(--color-surface-dim)]/50 rounded-2xl border border-[color:var(--color-outline-variant)]/20">
      <div className="text-center">
        <div className="h-6 w-6 border-2 border-[color:var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-[10px] text-[color:var(--color-outline)] font-bold uppercase tracking-wider animate-pulse">Syncing Satellite Feeds...</p>
      </div>
    </div>
  ),
});

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  chennai: { lat: 13.0827, lng: 80.2707 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  theni: { lat: 10.0104, lng: 77.4702 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.2090 }
};

const EXPLORE_SECTIONS = [
  {
    id: 'trending',
    title: 'Trending Now',
    description: 'Most popular bookings near you',
    emoji: '🔥',
    from: '#F87171',
    to: '#EF4444',
    glow: 'rgba(248,113,113,0.30)',
    href: '/search?q=trending',
    items: [
      { id: 't1', title: 'Delhi to Goa Flight', subtitle: 'IndiGo Indigo-603', tag: '₹5,499', rating: '4.9', emoji: '✈️', link: '/travel-transport/flights' },
      { id: 't2', title: 'Taj Palace Luxury Suite', subtitle: 'Mumbai stay reservation', tag: '₹14,500', rating: '4.9', emoji: '🏨', link: '/stay-accommodation/hotels' },
      { id: 't3', title: 'Style Studio Styling', subtitle: 'Haircut & Styling in T Nagar', tag: '₹599', rating: '4.8', emoji: '💇', link: '/service/3' },
      { id: 't4', title: 'Apollo Dental Care', subtitle: 'Oral scaling & checkup', tag: '₹899', rating: '4.8', emoji: '🦷', link: '/service/1' },
      { id: 't5', title: 'Zen Sports Turf', subtitle: '9-a-side football turf slot', tag: '₹1,500/hr', rating: '4.9', emoji: '⚽', link: '/sports-turf/football-turf' }
    ]
  },
  {
    id: 'news',
    title: 'News & Updates',
    description: 'Latest updates in your area',
    emoji: '📰',
    from: '#60A5FA',
    to: '#3B82F6',
    glow: 'rgba(96,165,250,0.30)',
    href: '/search?q=news',
    items: [
      { id: 'n1', title: 'Metro High-Speed Rail', subtitle: 'New Chennai routes opened today', tag: '10m ago', rating: 'New', emoji: '🚆', link: '/travel-transport/trains' },
      { id: 'n2', title: 'ZenFit Yoga Sessions', subtitle: 'New morning batches starting Monday', tag: '2h ago', rating: 'Yoga', emoji: '🧘', link: '/service/2' },
      { id: 'n3', title: 'Monsoon Safety Guidelines', subtitle: 'Travel advisories for hill stations', tag: '1d ago', rating: 'Alert', emoji: '🌧️', link: '/travel-transport/cabs' },
      { id: 'n4', title: 'Govt RTO Online slots', subtitle: 'Instant booking available for DL test', tag: '2d ago', rating: 'Govt', emoji: '🚗', link: '/religious-government/rto' }
    ]
  },
  {
    id: 'offers',
    title: 'Offers & Discounts',
    description: 'Handpicked deals for savings',
    emoji: '🏷️',
    from: '#FBBF24',
    to: '#F59E0B',
    glow: 'rgba(251,191,36,0.30)',
    href: '/search?q=offers',
    items: [
      { id: 'o1', title: 'Apollo Dental: 30% Off', subtitle: 'Promo code: SMILE30', tag: 'Save ₹300', rating: 'Promo', emoji: '🦷', link: '/service/1' },
      { id: 'o2', title: 'ZenFit: 1 Week Free Pass', subtitle: 'Promo code: ZENFITPASS', tag: 'Free Trial', rating: 'Fitness', emoji: '💪', link: '/service/2' },
      { id: 'o3', title: 'Style Studio: ₹200 Cash', subtitle: 'Flat cashback on styling slots', tag: 'Cashback', rating: 'Salon', emoji: 'service/3', link: '/service/3' },
      { id: 'o4', title: 'Grand Palace: 2+1 Offer', subtitle: 'Book 2 nights, get 1 night free', tag: 'Get 1 Free', rating: 'Hotel', emoji: '🏡', link: '/stay-accommodation/hotels' }
    ]
  },
  {
    id: 'events',
    title: 'Local Events',
    description: 'Tournaments and classes near you',
    emoji: '📅',
    from: '#34D399',
    to: '#10B981',
    glow: 'rgba(52,211,153,0.30)',
    href: '/search?q=events',
    items: [
      { id: 'e1', title: 'Clay Pottery Class', subtitle: 'Weekend workshop in Chennai', tag: 'Sat 4 PM', rating: 'Class', emoji: '🎨', link: '/entertainment-events/workshops' },
      { id: 'e2', title: 'IPL Live Turf Screening', subtitle: 'Match screening at Zen Arena', tag: 'Sun 7 PM', rating: 'Screening', emoji: '⚽', link: '/entertainment-events/events' },
      { id: 'e3', title: 'Corporate Badminton League', subtitle: 'Trophies and cash prizes', tag: 'June 15', rating: 'League', emoji: '🏸', link: '/sports-turf/badminton' },
      { id: 'e4', title: 'Sunburn Arena EDM concert', subtitle: 'Early bird tickets live now', tag: 'June 20', rating: 'Concert', emoji: '🎵', link: '/entertainment-events/concerts' }
    ]
  },
  {
    id: 'featured',
    title: 'Featured Partners',
    description: 'Elite verified businesses',
    emoji: '⭐',
    from: '#A78BFA',
    to: '#8B5CF6',
    glow: 'rgba(167,139,250,0.30)',
    href: '/search?q=featured',
    items: [
      { id: 'f1', title: 'Elite Spa & Wellness', subtitle: 'Luxury relaxation in T Nagar', tag: 'Verified', rating: '4.9', emoji: '💆', link: '/service/3' },
      { id: 'f2', title: 'Apollo Dental Metro', subtitle: 'Premium dental hospital network', tag: 'Verified', rating: '4.8', emoji: '🏥', link: '/service/1' },
      { id: 'f3', title: 'Zen Sports Turf Arena', subtitle: 'World class turf surface in Chennai', tag: 'Top Rated', rating: '4.9', emoji: '⚽', link: '/sports-turf/football-turf' },
      { id: 'f4', title: 'The Grand Palace Stay', subtitle: 'Super luxury suites & boarding', tag: 'Top Rated', rating: '4.8', emoji: '🏨', link: '/stay-accommodation/hotels' }
    ]
  }
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
  const { city, latitude, longitude } = useLocationStore();
  const { activeShortcuts, setShortcutModalOpen, openActionModal } = useShortcutStore();
  const [mounted, setMounted] = useState(false);
  const [selectedNearbyService, setSelectedNearbyService] = useState<any | null>(null);
  const [userPannedCenter, setUserPannedCenter] = useState<[number, number] | null>(null);
  const [realServices, setRealServices] = useState<any[]>([]);

  const cityCenter = useMemo(() => {
    return CITY_COORDINATES[(city || 'Chennai').toLowerCase()] || { lat: 13.0827, lng: 80.2707 };
  }, [city]);

  const mapCenter = useMemo((): [number, number] => {
    if (latitude !== null && longitude !== null) return [latitude, longitude];
    return [cityCenter.lat, cityCenter.lng];
  }, [cityCenter, latitude, longitude]);

  // Reset panned center when city or manual location changes (re-centers the map)
  useEffect(() => {
    setUserPannedCenter(null);
  }, [city, latitude, longitude]);

  const activeMapCenter = useMemo((): [number, number] => {
    return userPannedCenter || mapCenter;
  }, [userPannedCenter, mapCenter]);

  // Fetch real services from NestJS backend near activeMapCenter for homepage radar
  useEffect(() => {
    let active = true;
    const fetchRealServices = async () => {
      try {
        const [lat, lng] = activeMapCenter;
        const response = await api.services.list({
          latitude: String(lat),
          longitude: String(lng),
          radius: '25',
          limit: '20',
        });
        if (active && response && (response as any).data) {
          setRealServices((response as any).data);
        }
      } catch (err) {
        console.warn('Failed to fetch real homepage services:', err);
      }
    };
    fetchRealServices();
    return () => {
      active = false;
    };
  }, [activeMapCenter]);

  // Generate popular nearby merchants dynamically for the homepage map
  const homepageNearbyServices = useMemo(() => {
    const list: any[] = [];

    // 1. First, map and include real services from the database
    const mappedReal = realServices
      .filter((s: any) => s && s.merchant && s.category)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        merchant: s.merchant.name,
        price: `₹${s.basePrice}`,
        rating: s.rating,
        reviews: s.reviewCount,
        category: s.category.name,
        emoji: '🏢',
        lat: s.merchant.latitude,
        lng: s.merchant.longitude,
        address: s.merchant.address || 'Premium verified venue',
        distance: calculateDistance(activeMapCenter[0], activeMapCenter[1], s.merchant.latitude, s.merchant.longitude),
      }));
    
    list.push(...mappedReal);

    // 2. Next, generate dynamic mock providers (avoiding duplicates)
    const categoriesToMap = [
      { slug: 'doctor', name: 'Hospitals', emoji: '🏥' },
      { slug: 'dining', name: 'Restaurants', emoji: '🍴' },
      { slug: 'salons', name: 'Salons', emoji: '💇' },
      { slug: 'hotels', name: 'Hotels', emoji: '🏨' },
      { slug: 'football-turf', name: 'Sports turfs', emoji: '⚽' }
    ];

    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    categoriesToMap.forEach((cat, idx) => {
      const providers = getProvidersByCategory(cat.slug, cat.name, city);
      if (providers) {
        providers.forEach((p, pIdx) => {
          const seedLat = idx * 17 + pIdx;
          const seedLng = idx * 31 + pIdx * 3;
          // Generate realistic offsets within a local radius (~2 km) around cityCenter
          const lat = cityCenter.lat + (pseudoRandom(seedLat) - 0.5) * 0.022;
          const lng = cityCenter.lng + (pseudoRandom(seedLng) - 0.5) * 0.022;

          const itemVal = {
            id: p.id,
            name: p.name,
            merchant: p.name,
            price: p.price,
            rating: p.rating,
            reviews: p.reviewCount,
            category: cat.name,
            emoji: cat.emoji,
            lat: lat,
            lng: lng,
            address: p.address,
            distance: calculateDistance(activeMapCenter[0], activeMapCenter[1], lat, lng)
          };

          if (!list.some(existing => existing.id === itemVal.id || existing.name === itemVal.name)) {
            list.push(itemVal);
          }
        });
      }
    });

    return list.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [city, cityCenter, activeMapCenter, realServices]);

  // Default select first item
  useEffect(() => {
    if (homepageNearbyServices.length > 0) {
      // Keep selected item within the list if still matching, otherwise pick first
      const exists = homepageNearbyServices.some(s => s.id === selectedNearbyService?.id);
      if (!exists) {
        setSelectedNearbyService(homepageNearbyServices[0]);
      }
    }
  }, [homepageNearbyServices, selectedNearbyService]);

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

  const activeCount = Array.isArray(bookings) ? bookings.filter(b => b.status === 'CONFIRMED').length : 0;
  const activeNote = activeCount === 1 ? '1 active reservation' : `${activeCount} active reservations`;

  return (
    <>
      <ShortcutManagerModal />
      <ActionModalManager />
      <TopNav />

      <main className="page-content px-4 md:px-8 lg:pr-8">
        <div className="mx-auto max-w-7xl">
          {/* Ad Banner at the top of the dashboard overview */}
          <section
            id="ad-banner-hero"
            data-ad-slot=""
            aria-label="Advertisement"
            className="ad-block mb-6"
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

          {/* Dashboard Overview - Compact Single Line */}
          <section className="mb-6 md:mb-8">
            <div className="card-glass rounded-[20px] px-4 py-3 md:px-6 md:py-4 overflow-hidden relative">
              <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'radial-gradient(circle at top right, rgba(255,215,0,0.55), transparent 42%)' }} />
              <div className="relative flex flex-col xl:flex-row items-center justify-between gap-4">
                
                {/* Stats Container (Essentials on the Left) */}
                <div className="flex items-center gap-4 lg:gap-6 shrink-0 border-r border-[color:var(--color-outline-variant)]/20 pr-4 lg:pr-6">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] md:text-[16px] font-black text-[color:var(--color-on-surface)]">{String(activeCount)}</span>
                    <span className="text-[10px] md:text-[11px] text-[color:var(--color-on-surface-variant)] uppercase tracking-wider">Active</span>
                  </div>
                  <div className="h-3.5 w-[1px] bg-[color:var(--color-outline-variant)]/30" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] md:text-[16px] font-black text-[color:var(--color-on-surface)]">28</span>
                    <span className="text-[10px] md:text-[11px] text-[color:var(--color-on-surface-variant)] uppercase tracking-wider">Saved</span>
                  </div>
                  <div className="h-3.5 w-[1px] bg-[color:var(--color-outline-variant)]/30" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] md:text-[16px] font-black text-[color:var(--color-on-surface)]">98%</span>
                    <span className="text-[10px] md:text-[11px] text-[color:var(--color-on-surface-variant)] uppercase tracking-wider">Score</span>
                  </div>
                </div>

                {/* Shortcuts & Scroller Layout */}
                <div className="flex-1 flex flex-col md:flex-row items-center gap-3.5 min-w-0 w-full xl:w-auto">
                  {/* Shortcut Button adjacent to overview */}
                  <button
                    onClick={() => setShortcutModalOpen(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-primary-fixed-dim)] text-[color:var(--color-on-primary)] px-3.5 py-2 rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-[color:var(--color-primary)]/15 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Shortcut</span>
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>

                  {/* Active Shortcuts (Max 6) */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 border-r border-[color:var(--color-outline-variant)]/20 pr-3.5">
                    {Array.isArray(activeShortcuts) &&
                      activeShortcuts.slice(0, 6).map(id => AVAILABLE_SHORTCUTS.find(s => s.id === id)).filter(Boolean).map(shortcut => {
                        if (!shortcut) return null;
                        const handleAction = () => {
                          if (shortcut.actionType === 'modal') {
                            openActionModal(shortcut.actionTarget);
                          } else {
                            window.location.href = shortcut.actionTarget;
                          }
                        };
                        return (
                          <button
                            key={shortcut.id}
                            onClick={handleAction}
                            title={shortcut.label}
                            className="h-8 px-3 rounded-lg border border-[color:var(--color-outline-variant)]/20 bg-[color:var(--color-surface-container)] hover:border-[color:var(--color-primary)]/30 hover:bg-[color:var(--color-surface-container-high)] transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)]"
                          >
                            <span className="material-symbols-outlined text-[16px] text-[color:var(--color-primary)]">{shortcut.icon}</span>
                            <span className="max-w-[70px] truncate">{shortcut.label}</span>
                          </button>
                        );
                      })}
                  </div>

                  {/* Other Shortcuts (Scrollable Row) */}
                  <div className="flex-1 overflow-x-auto custom-scrollbar flex items-center gap-2 py-0.5 min-w-0 scroll-smooth w-full md:w-auto">
                    {AVAILABLE_SHORTCUTS.filter(s => !activeShortcuts.includes(s.id)).map(shortcut => {
                      const handleAction = () => {
                        if (shortcut.actionType === 'modal') {
                          openActionModal(shortcut.actionTarget);
                        } else {
                          window.location.href = shortcut.actionTarget;
                        }
                      };
                      return (
                        <button
                          key={shortcut.id}
                          onClick={handleAction}
                          title={`${shortcut.label} (Access directly)`}
                          className="h-8 px-3 rounded-lg border border-dashed border-[color:var(--color-outline-variant)]/30 bg-[color:var(--color-surface-container-low)]/40 hover:border-[color:var(--color-outline)]/40 hover:bg-[color:var(--color-surface-container)] transition-all flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[color:var(--color-outline)] hover:text-[color:var(--color-on-surface)] shrink-0"
                        >
                          <span className="material-symbols-outlined text-[15px]">{shortcut.icon}</span>
                          <span className="max-w-[80px] truncate">{shortcut.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Explore More - High Fidelity Vertical Stack of Blocks */}
          <section className="mb-10">
            <SectionHeader title="Explore More" sub="Trending updates, news topics, and special offerings" href="/categories" />
            
            <div className="space-y-8">
              {EXPLORE_SECTIONS.map((sec) => (
                <div key={sec.id} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                  {/* Decorative Gradient Box (Left) */}
                  <div className="lg:col-span-1 h-[210px]">
                    <div 
                      className="card-glass rounded-3xl p-5 overflow-hidden relative h-full flex flex-col items-center justify-center border border-[color:var(--color-outline-variant)]/30 text-center"
                      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}
                    >
                      <div 
                        className="absolute inset-0 opacity-[0.08]" 
                        style={{ background: `linear-gradient(135deg, ${sec.from}, ${sec.to})` }}
                      />
                      <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at top right, ${sec.from}, transparent 45%)` }} />
                      <div className="relative z-10">
                        <div className="text-5xl mb-2.5 transition-transform duration-300 hover:scale-110 select-none">{sec.emoji}</div>
                        <h3 className="text-[17px] font-black text-[color:var(--color-on-surface)] mb-1.5">{sec.title}</h3>
                        <p className="text-[11px] text-[color:var(--color-on-surface-variant)] leading-normal mb-3.5 max-w-[170px] mx-auto">{sec.description}</p>
                        <Link href={sec.href} className="inline-flex items-center gap-1.5 bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] px-3.5 py-1.5 rounded-lg font-bold text-[11px] hover:scale-105 active:scale-95 transition-all shadow-md shadow-[color:var(--color-primary)]/10">
                          Explore
                          <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable List Feed (Right - 3 Columns) */}
                  <div className="lg:col-span-3 h-[210px]">
                    <div className="rounded-3xl border border-[color:var(--color-outline-variant)]/30 bg-[color:var(--color-surface-container)]/50 backdrop-blur p-4 h-full flex flex-col justify-between card-glass">
                      <div className="overflow-y-auto custom-scrollbar flex-1 pr-1 space-y-2">
                        {sec.items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.link}
                            className="p-2.5 rounded-xl cursor-pointer border border-[color:var(--color-outline-variant)]/15 bg-[color:var(--color-surface-dim)]/20 hover:bg-[color:var(--color-surface-dim)]/50 transition-all flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 shrink-0 rounded-lg bg-[color:var(--color-surface-container-high)] border border-[color:var(--color-outline-variant)]/30 flex items-center justify-center text-lg select-none group-hover:scale-105 transition-transform">
                                {item.emoji}
                              </div>
                              <div className="min-w-0 text-left">
                                <h4 className="font-bold text-xs text-[color:var(--color-on-surface)] group-hover:text-[color:var(--color-primary)] transition-colors truncate leading-tight">{item.title}</h4>
                                <p className="text-[10px] text-[color:var(--color-on-surface-variant)] truncate mt-0.5">{item.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[10px] text-[color:var(--color-primary)] font-extrabold bg-[color:var(--color-primary)]/10 px-2 py-0.5 rounded-md border border-[color:var(--color-primary)]/20">{item.tag}</span>
                              <div className="flex items-center gap-0.5 text-[10px] font-bold text-[color:var(--color-on-surface-variant)] bg-[color:var(--color-surface-container-highest)] px-2 py-0.5 rounded-md border border-[color:var(--color-outline-variant)]/20">
                                <Star className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" />
                                <span>{item.rating}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Nearby Services Google Maps Live Radar */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[18px] font-bold text-[color:var(--color-on-surface)] tracking-tight">Nearby Services Live Radar</h2>
                <p className="text-[12px] mt-0.5 text-[color:var(--color-outline)]">Real-time local tracking and instant slot bookings in {city}</p>
              </div>
              <Link
                href="/maps"
                className="flex items-center gap-1 text-[12px] font-semibold text-[color:var(--color-primary)] hover:gap-2 transition-all duration-300"
              >
                Expand Maps Hub
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 items-stretch">
              {/* Map Canvas (Left 2 columns on desktop) */}
              <div className="lg:col-span-2 h-[380px] rounded-3xl overflow-hidden border border-[color:var(--color-outline-variant)]/30 shadow-2xl relative bg-slate-900/50">
                <MapComponent
                  center={mapCenter}
                  zoom={13}
                  selectedMarkerId={selectedNearbyService?.id}
                  onCenterChange={(lat, lng) => setUserPannedCenter([lat, lng])}
                  onMarkerClick={(marker) => {
                    if (selectedNearbyService && selectedNearbyService.id === marker.id) {
                      setSelectedNearbyService(null);
                    } else {
                      const match = homepageNearbyServices.find(s => s.id === marker.id);
                      if (match) setSelectedNearbyService(match);
                    }
                  }}
                  markers={homepageNearbyServices.map(svc => ({
                    id: svc.id,
                    name: svc.name,
                    merchant: svc.merchant,
                    lat: svc.lat,
                    lng: svc.lng,
                    emoji: svc.emoji,
                    category: svc.category,
                    price: svc.price,
                    rating: svc.rating,
                    linkUrl: `/service/${svc.id}`
                  }))}
                />
              </div>

              {/* Scrollable list card (Right 1 column on desktop) */}
              <div className="lg:col-span-1 rounded-3xl border border-[color:var(--color-outline-variant)]/30 bg-[color:var(--color-surface-container)]/80 backdrop-blur p-4 flex flex-col justify-between h-[380px] card-glass">
                <div className="overflow-y-auto custom-scrollbar flex-1 pr-1 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[color:var(--color-primary)] block mb-1">📡 Real-Time Sensing Feed</span>
                  {homepageNearbyServices.map((svc) => {
                    const isSelected = selectedNearbyService?.id === svc.id;
                    return (
                      <div
                        key={svc.id}
                        onClick={() => setSelectedNearbyService(svc)}
                        className={`p-3 rounded-2xl cursor-pointer border transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[color:var(--color-primary)]/10 border-[color:var(--color-primary)]'
                            : 'bg-[color:var(--color-surface-dim)]/30 border-[color:var(--color-outline-variant)]/20 hover:bg-[color:var(--color-surface-dim)]/50'
                        }`}
                      >
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-[color:var(--color-surface-container-high)] border border-[color:var(--color-outline-variant)]/30 flex items-center justify-center text-xl">
                          {svc.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-xs text-[color:var(--color-on-surface)] truncate leading-tight">{svc.name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-[color:var(--color-on-surface-variant)]">
                            <span className="font-bold flex items-center gap-0.5"><Star className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" /> {svc.rating}</span>
                            <span>•</span>
                            <span className="font-medium">📍 {svc.distance ? `${svc.distance.toFixed(1)} km` : '1.2 km'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom preview detail card */}
                {selectedNearbyService && (
                  <div className="mt-3 border-t border-[color:var(--color-outline-variant)]/20 pt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-black text-xs text-[color:var(--color-on-surface)] truncate">{selectedNearbyService.name}</h4>
                      <p className="text-[10px] text-[color:var(--color-primary)] font-bold mt-0.5">{selectedNearbyService.price}</p>
                    </div>
                    <Link
                      href={`/service/${selectedNearbyService.id}`}
                      className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3.5 py-2 text-[10px] uppercase font-bold text-white shadow hover:from-indigo-600 hover:to-purple-700 active:scale-[0.98] transition-all flex items-center gap-1 shrink-0"
                    >
                      Book <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
