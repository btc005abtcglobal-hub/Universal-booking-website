'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, BookOpen, Settings, QrCode, 
  Package, Menu, X, Bell, LogOut, Stethoscope, Dumbbell, 
  Scissors, Utensils, ShieldAlert, Check, Trash2, Info,
  ChevronDown, Building, Film, Sparkles, LogOut as LogOutIcon, Laptop, User,
  Sun, Moon, Users, Mail, Search
} from 'lucide-react';
import { UtilityDrawer } from '../../components/UtilityDrawer';
import { useState, useEffect, useRef } from 'react';
import { useVendorStore, PRESET_MERCHANTS } from '../../lib/store';
import { getVerticalFromCategory } from '../../lib/categoryUtils';

const staticNavItems = [
  { href: '/dashboard/checkin', icon: QrCode, label: 'Verify Code' },
  { href: '/dashboard/staff', icon: Users, label: 'Staff Management' },
  { href: '/dashboard/customers', icon: User, label: 'Customer Directory' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  { href: '/dashboard/contact', icon: Mail, label: 'Contact Us' },
];

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentMerchant, logoutMerchant, switchStore, loginRole, theme, setTheme, supervisorId, bookings, services } = useVendorStore();
  const [utilityDrawerOpen, setUtilityDrawerOpen] = useState(false);
  const [activeUtilityTab, setActiveUtilityTab] = useState<'calendar' | 'calc' | 'tasks' | 'contacts' | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Spotlight Search State
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  


  // Profile Menu state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Stateful Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    if (useVendorStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    const unsub = useVendorStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return () => unsub();
  }, []);

  // Pre-populate notifications based on merchant category
  useEffect(() => {
    if (currentMerchant) {
      const getMockNotifications = (): NotificationItem[] => {
        switch (getVerticalFromCategory(currentMerchant.category)) {
          case 'Dental':
            return [
              { id: '1', text: 'Aditya Sen checked in at clinic waiting room.', time: '10 mins ago', read: false, type: 'success' },
              { id: '2', text: 'New orthodontic braces scan request received from Meera Deshmukh.', time: '1 hour ago', read: false, type: 'info' },
              { id: '3', text: 'Dr. Apollo updated orthodontic scan files for Varun Nair.', time: '1 day ago', read: true, type: 'info' }
            ];
          case 'Fitness':
            return [
              { id: '1', text: 'Karan Mehra completed Kettlebell Romanian Deadlifts set logs.', time: '15 mins ago', read: false, type: 'success' },
              { id: '2', text: 'Sanjana Roy submitted macro constraints update request.', time: '2 hours ago', read: false, type: 'info' },
              { id: '3', text: 'ZenFit daily class grid updated for Yoga Vinyasa.', time: '1 day ago', read: true, type: 'info' }
            ];
          case 'Salon':
            return [
              { id: '1', text: 'Vikram Singh assigned as stylist to Rohan Sharma.', time: '5 mins ago', read: false, type: 'info' },
              { id: '2', text: 'Deepika Iyer haircut & wash invoice completed successfully.', time: '3 hours ago', read: false, type: 'success' },
              { id: '3', text: 'Weekly aesthetic treatment products stock restocked.', time: '2 days ago', read: true, type: 'info' }
            ];
          case 'Dining':
            return [
              { id: '1', text: 'Peanut allergy warning flagged for guest Anil Vasudevan (Table 4).', time: '12 mins ago', read: false, type: 'warning' },
              { id: '2', text: 'Pre-ordered risotto courses verified by Kitchen Head.', time: '40 mins ago', read: false, type: 'success' },
              { id: '3', text: 'Candlelight package booking confirmed for Prakash Raj (Table 12).', time: '5 hours ago', read: true, type: 'info' }
            ];
          default:
            return [];
        }
      };
      setNotifications(getMockNotifications());
    }
  }, [currentMerchant]);

  // Click outside to close notifications, store switcher, and profile popovers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Poll NestJS backend to retrieve synchronized customer bookings in real-time
  useEffect(() => {
    if (!currentMerchant) return;

    const fetchSyncBookings = async () => {
      try {
        const res = await fetch('/api/v1/bookings/sync');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          const currentBookings = useVendorStore.getState().bookings;
          let changed = false;
          const merged = [...currentBookings];

          data.forEach((syncB: any) => {
            const exists = merged.some((b) => b.ref === syncB.ref || b.id === syncB.id);
            if (!exists) {
              merged.unshift({
                ...syncB,
                status: syncB.status === 'CONFIRMED' ? 'CONFIRMED' : syncB.status,
              });
              changed = true;
            }
          });

          if (changed) {
            useVendorStore.setState({ bookings: merged });
          }
        }
      } catch (err) {
        console.error('Error fetching sync bookings:', err);
      }
    };

    fetchSyncBookings();
    const interval = setInterval(fetchSyncBookings, 3000);
    return () => clearInterval(interval);
  }, [currentMerchant]);

  useEffect(() => {
    if (isMounted && hasHydrated && !currentMerchant) {
      window.location.href = '/';
    }
  }, [currentMerchant, isMounted, hasHydrated]);

  // Keypress listener for spotlight search toggling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(prev => !prev);
        setSearchQuery('');
        setSpotlightIndex(0);
      }
      if (e.key === 'Escape') {
        setSpotlightOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isMounted || !hasHydrated || !currentMerchant) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center">
        <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] animate-pulse">Checking credentials...</div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (getVerticalFromCategory(category)) {
      case 'Dental':
        return Stethoscope;
      case 'Fitness':
        return Dumbbell;
      case 'Salon':
        return Scissors;
      case 'Dining':
        return Utensils;
      default:
        return ShieldAlert;
    }
  };
  
  const allStores = currentMerchant 
    ? loginRole === 'supervisor'
      ? [currentMerchant]
      : [
          ...PRESET_MERCHANTS,
          ...Array.from(new Set(useVendorStore.getState().bookings
            .map(b => b.merchantName)))
            .map((name) => {
              const matchedPreset = PRESET_MERCHANTS.find(pm => pm.merchantName === name);
              if (matchedPreset) return matchedPreset;
              const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              // Find the category for this booking
              const bookingCat = useVendorStore.getState().bookings.find(b => b.merchantName === name)?.category || currentMerchant.category;
              return {
                id: `mer-${slug}`,
                username: currentMerchant.username,
                merchantName: name,
                category: bookingCat,
                logoLetter: name.charAt(0),
                aboutText: `Welcome to ${name}. We provide professional bookings and top-tier services.`
              };
            })
            .filter(m => !PRESET_MERCHANTS.some(pm => pm.merchantName === m.merchantName))
        ]
    : [];

  const CategoryIcon = getCategoryIcon(currentMerchant.category);

  const handleLogout = () => {
    logoutMerchant();
    window.location.href = '/';
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter(n => n.id !== id)
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(n => ({ ...n, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getBnxMailId = () => {
    if (!currentMerchant) return '';
    const originalEmail = currentMerchant.email || '';
    if (loginRole === 'supervisor') {
      const supName = supervisorId || 'SUPERVISOR';
      return `${supName}/${originalEmail}`;
    }
    return originalEmail;
  };

  const searchPages = [
    { label: 'Dashboard Home', href: '/dashboard', description: 'Main overview & logs', type: 'page', icon: LayoutDashboard },
    { label: 'Verify Code', href: '/dashboard/checkin', description: 'Check-in ticket codes', type: 'page', icon: QrCode },
    { label: 'Staff Management', href: '/dashboard/staff', description: 'Manage employee assignments', type: 'page', icon: Users },
    { label: 'Customer Directory', href: '/dashboard/customers', description: 'Diner database', type: 'page', icon: User },
    { label: 'Business Settings', href: '/dashboard/settings', description: 'Working hours & profile details', type: 'page', icon: Settings },
    { label: 'Contact Us', href: '/dashboard/contact', description: 'Support helpdesk & tickets', type: 'page', icon: Mail },
  ];

  const searchResults = searchQuery.trim() === '' ? [] : [
    ...searchPages.filter(p => p.label.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())),
    ...services
      .filter(s => s.merchant.toLowerCase() === currentMerchant?.merchantName.toLowerCase() && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(s => ({
        label: s.name,
        href: '/dashboard/services',
        description: `Listing · ₹${s.price} · ${s.duration} mins`,
        type: 'service',
        icon: Package
      })),
    ...bookings
      .filter(b => b.merchantName.toLowerCase() === currentMerchant?.merchantName.toLowerCase() && (
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      ))
      .map(b => ({
        label: `${b.customerName} (${b.ref})`,
        href: '/dashboard/bookings',
        description: `Booking · ${b.serviceName} · ${b.date} ${b.time}`,
        type: 'booking',
        icon: BookOpen
      }))
  ];

  const getDynamicNavItems = () => {
    if (pathname === '/dashboard') {
      return [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Home' },
        { href: '/dashboard/checkin', icon: QrCode, label: 'Verify Code' },
        { href: '/dashboard/customers', icon: User, label: 'Customer Directory' },
        { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
      ];
    } else if (pathname.startsWith('/dashboard/bookings')) {
      return [
        { href: '/dashboard/bookings', icon: BookOpen, label: 'Bookings Log' },
        { href: '/dashboard/customers', icon: User, label: 'Customer Directory' },
        { href: '/dashboard/checkin', icon: QrCode, label: 'Verify Code' },
        { href: '/dashboard/contact', icon: Mail, label: 'Helpdesk' },
      ];
    } else {
      return [
        { href: '/dashboard/services', icon: Package, label: 'Manage Listings' },
        { href: '/dashboard/staff', icon: Users, label: 'Staff Management' },
        { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
        { href: '/dashboard/contact', icon: Mail, label: 'Support Ticket' },
      ];
    }
  };

  const navItems = getDynamicNavItems();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-primary text-text-primary">
      {/* Top Header (100% width across the top) */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between vendor-navbar backdrop-blur-md px-6 shadow-md border-b border-border-brand/40 shrink-0">
        {/* Left Column: Logo & Menu Toggle */}
        <div className="flex-1 flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="lg:hidden rounded-xl p-2 bg-[#5a4409] hover:bg-[#72560c] text-white transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>
          
          <Link href="/dashboard" className="hidden lg:flex items-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0">
            <img src="/logo.png?v=3" alt="BokSpot Logo" className="h-10 lg:h-12 object-contain" />
          </Link>
        </div>

        {/* Center Column: Floating Navigation Menu */}
        <div className="hidden lg:flex flex-none justify-center">
          <nav className="custom-nav-capsule shadow-lg relative">
            <Link
              href="/dashboard"
              className={`w-20 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link ${
                pathname === '/dashboard'
                  ? 'custom-nav-link-active'
                  : 'custom-nav-link-inactive'
              }`}
            >
              {pathname === '/dashboard' && (
                <motion.div
                  layoutId="activeNavIndicatorAdmin"
                  className="absolute inset-0 rounded-full bg-[#8b6508]/20 border border-[#8b6508]/45 shadow-[0_0_12px_rgba(255,215,0,0.15)] backdrop-blur-md -z-10 custom-nav-active-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Home
            </Link>
            <Link
              href="/dashboard/services"
              className={`w-28 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link ${
                (pathname.startsWith('/dashboard/') && pathname !== '/dashboard' && !pathname.startsWith('/dashboard/bookings'))
                  ? 'custom-nav-link-active'
                  : 'custom-nav-link-inactive'
              }`}
            >
              {(pathname.startsWith('/dashboard/') && pathname !== '/dashboard' && !pathname.startsWith('/dashboard/bookings')) && (
                <motion.div
                  layoutId="activeNavIndicatorAdmin"
                  className="absolute inset-0 rounded-full bg-[#8b6508]/20 border border-[#8b6508]/45 shadow-[0_0_12px_rgba(255,215,0,0.15)] backdrop-blur-md -z-10 custom-nav-active-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Workspace
            </Link>
            <Link
              href="/dashboard/bookings"
              className={`w-24 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link ${
                pathname.startsWith('/dashboard/bookings')
                  ? 'custom-nav-link-active'
                  : 'custom-nav-link-inactive'
              }`}
            >
              {pathname.startsWith('/dashboard/bookings') && (
                <motion.div
                  layoutId="activeNavIndicatorAdmin"
                  className="absolute inset-0 rounded-full bg-[#8b6508]/20 border border-[#8b6508]/45 shadow-[0_0_12px_rgba(255,215,0,0.15)] backdrop-blur-md -z-10 custom-nav-active-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Tracks
            </Link>
          </nav>
        </div>

        {/* Right Column: Actions (Search, Notification, Profile, Utility) */}
        <div className="flex-1 flex items-center justify-end gap-3.5 pl-4 lg:pl-6">
          {/* Spotlight Search Toggle Button */}
          <button
            onClick={() => setSpotlightOpen(true)}
            className="rounded-xl p-2 border border-white/25 hover:border-white/40 bg-black/25 hover:bg-white/15 text-white transition-colors cursor-pointer flex items-center gap-1.5 pr-3 shadow-md"
            title="Search Console (⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-white" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-white select-none hidden md:inline">Spotlight</span>
          </button>

          {/* Stateful Notifications Popover */}
          <div className="relative" ref={popoverRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-xl p-2 border border-white/25 hover:border-white/40 bg-black/25 hover:bg-white/15 text-white transition-colors cursor-pointer shadow-md"
            >
              <Bell className="h-3.5 w-3.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#8b6508]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-border-brand bg-bg-tertiary p-4 shadow-2xl z-50 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded bg-[#8b6508]/10 text-[#fceea7] text-[9px] font-black px-1.5 py-0.5">{unreadCount} new</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] text-[#fceea7] hover:text-[#8b6508] font-bold transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`group flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${
                          n.read 
                            ? 'border-transparent bg-transparent opacity-60' 
                            : 'border-white/5 bg-white/[0.01]'
                        }`}
                      >
                        <div className={`mt-0.5 p-1 rounded bg-white/5 ${
                          n.type === 'warning' ? 'text-amber-400' : n.type === 'success' ? 'text-emerald-400' : 'text-[#fceea7]'
                        }`}>
                          <Info size={11} />
                        </div>
                        
                        <div className="flex-1 space-y-0.5">
                          <p className="text-[10.5px] text-slate-200 leading-snug font-medium">{n.text}</p>
                          <span className="text-[9px] text-slate-500 block font-semibold">{n.time}</span>
                        </div>

                        <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <button 
                              onClick={() => markAsRead(n.id)}
                              className="text-slate-500 hover:text-[#8b6508] transition-colors cursor-pointer"
                              title="Mark read"
                            >
                              <Check size={11} />
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(n.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete notification"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs font-semibold">
                      No notifications found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative border-l border-white/10 pl-4 animate-fade-in" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full border border-white/25 hover:border-white/40 bg-black/25 hover:bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white hover:text-white transition-all cursor-pointer select-none shadow-md"
              aria-label="Toggle profile menu"
              title="Partner Profile Settings"
            >
              <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <User size={12} strokeWidth={2.5} className="text-[#0a3161]" />
              </div>
              <span>{loginRole === 'supervisor' ? (supervisorId || 'Supervisor') : (currentMerchant.username || 'Partner')}</span>
              <ChevronDown className={`h-3 w-3 text-white transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-bg-secondary rounded-2xl shadow-2xl border border-border-brand z-50 overflow-hidden animate-fade-in text-left profile-dropdown-card">
                {/* User Profile Header */}
                <div className="px-5 py-4 bg-bg-tertiary border-b border-border-brand flex flex-col min-w-0 text-left">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Console User</span>
                  <span className="font-extrabold text-[12.5px] mt-1 truncate max-w-full font-mono text-black dark:text-white" title={getBnxMailId()}>
                    {getBnxMailId()}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-1 font-medium capitalize">
                    🔑 Role: {loginRole || 'Partner'}
                  </span>
                </div>
                
                {/* Dropdown Options */}
                <ul className="py-2 divide-y divide-white/[0.03]">
                  <li>
                    <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold text-black dark:text-white">
                      <Settings className="h-4 w-4 text-slate-500" />
                      <span>Business Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/services" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold text-black dark:text-white">
                      <Package className="h-4 w-4 text-slate-500" />
                      <span>Manage Services</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/bookings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-bold text-black dark:text-white">
                      <BookOpen className="h-4 w-4 text-slate-500" />
                      <span>Bookings Log</span>
                    </Link>
                  </li>

                  {/* Theme Switcher Segment */}
                  <li className="px-5 py-3.5 bg-bg-tertiary/20">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 text-left">Display Theme</span>
                      <div className="grid grid-cols-3 gap-1 bg-bg-secondary p-1 rounded-xl border border-border-brand/40">
                        {(['light', 'dark', 'system'] as const).map((t) => {
                          const isThemeActive = theme === t;
                          return (
                            <button
                              key={t}
                              onClick={() => setTheme(t)}
                              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider capitalize cursor-pointer flex items-center justify-center gap-1 ${
                                isThemeActive
                                  ? 'bg-[#8b6508] text-white shadow-sm'
                                  : 'text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                            >
                              {t === 'light' ? <Sun className="h-3 w-3" /> : t === 'dark' ? <Moon className="h-3 w-3" /> : <Laptop className="h-3 w-3" />}
                              <span>{t}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                </ul>
                
                {/* Bottom Divider & Sign Out */}
                <div className="border-t border-border-brand px-2.5 py-2.5 bg-bg-tertiary">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span>Sign out console</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Utility Drawer Button Box (50px wide column to align with right sidebar) */}
          <div className="w-[50px] shrink-0 h-full flex items-center justify-center border-l border-white/10">
            <button
              onClick={() => setUtilityDrawerOpen(!utilityDrawerOpen)}
              className={`relative transition-all cursor-pointer w-8 h-8 flex items-center justify-center ${
                utilityDrawerOpen
                  ? 'opacity-100 scale-105'
                  : 'opacity-85 hover:opacity-100'
              }`}
              title="Bokspot Utilities"
            >
              <img src="/utility-icon.png?v=3" alt="Utilities" className="w-[22px] h-[22px] object-contain" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Section (Sidebar + Content Side-by-side) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-bg-secondary border-r border-border-brand/40 transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} h-full flex flex-col justify-between pt-4`}>
          <div>
            {loginRole === 'supervisor' && (
              <div className="px-4.5 mb-4">
                <span className="px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-wider sidebar-badge shrink-0 select-none">
                  SUPERVISOR SECURE MODE
                </span>
              </div>
            )}
            
            <nav className="px-4 space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs uppercase tracking-wide font-bold transition-all ${
                      active 
                        ? 'sidebar-link-active' 
                        : 'sidebar-link-inactive'
                    }`}
                  >
                    <item.icon className="h-4 w-4 transition-colors duration-200" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
    
          {/* Sidebar Footer Info */}
          <div className="p-4 rounded-xl sidebar-footer-container space-y-1.5 m-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">Console Secured</span>
            </div>
            <p className="text-[9px] text-text-secondary">Vendor ID: <span className="font-mono sidebar-footer-val">{currentMerchant.vendorId || 'N/A'}</span></p>
            <p className="text-[9px] text-text-secondary">Merchant key: <span className="font-mono sidebar-footer-val">{currentMerchant.username}</span></p>
            <p className="text-[9px] text-text-secondary truncate" title={getBnxMailId()}>BNX Mail: <span className="font-mono sidebar-footer-val">{getBnxMailId()}</span></p>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}

        {/* Main Content Workspace */}
        <main className={`flex-1 overflow-y-auto bg-bg-primary p-6 lg:p-8 custom-scrollbar transition-all duration-300 flex flex-col justify-between ${
          utilityDrawerOpen ? (activeUtilityTab ? 'lg:pr-[370px]' : 'lg:pr-[50px]') : ''
        }`}>
          <div className="flex-1 pb-8">
            {children}
          </div>
          {/* Footer containing About Us */}
          <footer className="mt-auto pt-6 border-t border-border-brand/40 text-text-secondary select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-text-primary">About BokSpot Platform</span>
                <p className="text-[11px] text-text-secondary/70 leading-relaxed max-w-xl">
                  BokSpot Console provides next-generation merchant management systems designed to simplify booking experiences, optimize staff shifts, manage user calendars, and build robust customer CRM pipelines with absolute ease and performance. Developed by Beta Softnet.
                </p>
              </div>
              <div className="flex flex-col md:items-end justify-end space-y-1 text-[10px] text-text-secondary/50 font-mono">
                <p>Platform Version 2.4.0 • Secured Console</p>
                <p>© 2026 BokSpot. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <UtilityDrawer isOpen={utilityDrawerOpen} onClose={() => setUtilityDrawerOpen(false)} isVendor={true} activeTab={activeUtilityTab} setActiveTab={setActiveUtilityTab} />

      {/* Apple Spotlight Search Overlay Modal */}
      {spotlightOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-start pt-[10vh]">
          {/* Backdrop Click Dismiss */}
          <div className="fixed inset-0 -z-10" onClick={() => setSpotlightOpen(false)} />
          
          <div className="max-w-2xl w-full mx-4 bg-bg-secondary border border-border-brand rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in">
            {/* Search Input Box */}
            <div className="flex items-center gap-3.5 px-5 py-4 border-b border-border-brand/50 bg-bg-tertiary">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools, bookings, services, staff..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSpotlightIndex(0);
                }}
                className="bg-transparent border-none outline-none text-sm text-text-primary placeholder-slate-500 w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSpotlightIndex(prev => Math.min(prev + 1, (searchQuery.trim() === '' ? searchPages.length : searchResults.length) - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSpotlightIndex(prev => Math.max(prev - 1, 0));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const list = searchQuery.trim() === '' ? searchPages : searchResults;
                    const selected = list[spotlightIndex];
                    if (selected) {
                      setSpotlightOpen(false);
                      window.location.href = selected.href;
                    }
                  } else if (e.key === 'Escape') {
                    setSpotlightOpen(false);
                  }
                }}
              />
              <button 
                onClick={() => setSpotlightOpen(false)}
                className="rounded-lg p-1 hover:bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results / Suggestions list */}
            <div className="max-h-[380px] overflow-y-auto p-2 custom-scrollbar">
              {searchQuery.trim() === '' ? (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2">Quick suggestions</div>
                  <div className="space-y-0.5">
                    {searchPages.map((item, idx) => {
                      const active = idx === spotlightIndex;
                      return (
                        <div
                          key={item.href}
                          onClick={() => {
                            setSpotlightOpen(false);
                            window.location.href = item.href;
                          }}
                          onMouseEnter={() => setSpotlightIndex(idx)}
                          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-colors ${
                            active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <item.icon className={`h-4.5 w-4.5 ${active ? 'text-primary' : 'text-slate-400'}`} />
                          <div className="flex-1 text-left">
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span className="text-[10px] text-slate-500 block">{item.description}</span>
                          </div>
                          <span className="text-[9px] uppercase font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded">Menu Option</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2">Search results ({searchResults.length})</div>
                  <div className="space-y-0.5">
                    {searchResults.map((item, idx) => {
                      const active = idx === spotlightIndex;
                      return (
                        <div
                          key={item.label + idx}
                          onClick={() => {
                            setSpotlightOpen(false);
                            window.location.href = item.href;
                          }}
                          onMouseEnter={() => setSpotlightIndex(idx)}
                          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-colors ${
                            active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <item.icon className={`h-4.5 w-4.5 ${active ? 'text-primary' : 'text-slate-400'}`} />
                          <div className="flex-1 text-left">
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span className="text-[10px] text-slate-500 block">{item.description}</span>
                          </div>
                          <span className="text-[9px] uppercase font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded capitalize">{item.type}</span>
                        </div>
                      );
                    })}
                    {searchResults.length === 0 && (
                      <div className="text-center py-10 text-slate-500 text-xs">
                        No results found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Help Footer */}
            <div className="bg-bg-tertiary border-t border-border-brand/40 px-4.5 py-2.5 flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <div className="flex gap-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span>Spotlight Console Search</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
