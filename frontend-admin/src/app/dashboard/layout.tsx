'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, BookOpen, Settings, QrCode, 
  Package, Menu, X, Bell, LogOut, Stethoscope, Dumbbell, 
  Scissors, Utensils, ShieldAlert, Check, Trash2, Info,
  ChevronDown, Building, Film, Sparkles, LogOut as LogOutIcon, Laptop, User,
  Sun, Moon
} from 'lucide-react';
import { UtilityDrawer } from '../../components/UtilityDrawer';
import { useState, useEffect, useRef } from 'react';
import { useVendorStore, PRESET_MERCHANTS } from '../../lib/store';
import { getVerticalFromCategory } from '../../lib/categoryUtils';



const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Console' },
  { href: '/dashboard/services', icon: Package, label: 'Services' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/dashboard/bookings', icon: BookOpen, label: 'Bookings Log' },
  { href: '/dashboard/checkin', icon: QrCode, label: 'Verify Code' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
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
  const { currentMerchant, logoutMerchant, switchStore, loginRole, theme, setTheme, supervisorId } = useVendorStore();
  const [utilityDrawerOpen, setUtilityDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  


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

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary text-text-primary">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-bg-secondary border-r border-border-brand transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2.5 px-4.5 vendor-navbar">
          <img src="/logo.png" alt="BokSpot Console" className="h-10 object-contain" />
          {loginRole === 'supervisor' && (
            <span className="px-1.5 py-0.5 rounded-md text-[7.5px] font-black uppercase tracking-wider sidebar-badge shrink-0 select-none">
              SUPERVISOR
            </span>
          )}
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
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
 
        {/* Sidebar Footer Info */}
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl sidebar-footer-container space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">Console Secured</span>
          </div>
          <p className="text-[9px] text-text-secondary">Vendor ID: <span className="font-mono sidebar-footer-val">{currentMerchant.vendorId || 'N/A'}</span></p>
          <p className="text-[9px] text-text-secondary">Merchant key: <span className="font-mono sidebar-footer-val">{currentMerchant.username}</span></p>
          <p className="text-[9px] text-text-secondary truncate" title={getBnxMailId()}>BNX Mail: <span className="font-mono sidebar-footer-val">{getBnxMailId()}</span></p>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between vendor-navbar backdrop-blur-md px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-lg p-2 hover:bg-white/5 text-slate-300"><Menu className="h-5 w-5" /></button>
          </div>

          {/* Center Column: Floating Navigation Menu */}
          <div className="hidden lg:flex flex-none justify-center">
            <nav className="custom-nav-capsule shadow-lg relative">
              <Link
                href="http://localhost:3500/"
                className={`w-20 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link ${
                  pathname === '/'
                    ? 'custom-nav-link-active'
                    : 'custom-nav-link-inactive'
                }`}
              >
                {pathname === '/' && (
                  <motion.div
                    layoutId="activeNavIndicatorAdmin"
                    className="absolute inset-0 rounded-full bg-[#8b6508]/20 border border-[#8b6508]/45 shadow-[0_0_12px_rgba(255,215,0,0.15)] backdrop-blur-md -z-10 custom-nav-active-bg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`w-28 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link ${
                  pathname.startsWith('/dashboard')
                    ? 'custom-nav-link-active'
                    : 'custom-nav-link-inactive'
                }`}
              >
                {pathname.startsWith('/dashboard') && (
                  <motion.div
                    layoutId="activeNavIndicatorAdmin"
                    className="absolute inset-0 rounded-full bg-[#8b6508]/20 border border-[#8b6508]/45 shadow-[0_0_12px_rgba(255,215,0,0.15)] backdrop-blur-md -z-10 custom-nav-active-bg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                Workspace
              </Link>
              <Link
                href="http://localhost:3500/tracks"
                className={`w-24 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link ${
                  pathname === '/tracks'
                    ? 'custom-nav-link-active'
                    : 'custom-nav-link-inactive'
                }`}
              >
                {pathname === '/tracks' && (
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

          
          <div className="flex items-center gap-4 ml-auto">
            {/* Stateful Notifications Popover */}
            <div className="relative" ref={popoverRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl p-2.5 border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#8b6508]" />
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
                className="flex items-center gap-2 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.04] px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer select-none"
                aria-label="Toggle profile menu"
                title="Partner Profile Settings"
              >
                <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <User size={12} strokeWidth={2.5} className="text-[#0a3161]" />
                </div>
                <span>{loginRole === 'supervisor' ? (supervisorId || 'Supervisor') : (currentMerchant.username || 'Partner')}</span>
                <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-bg-secondary rounded-2xl shadow-2xl border border-border-brand z-50 overflow-hidden animate-fade-in text-left">
                  {/* User Profile Header */}
                  <div className="px-5 py-4 bg-bg-tertiary border-b border-border-brand flex flex-col min-w-0 text-left">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Console User</span>
                    <span className="font-extrabold text-[12.5px] text-text-primary mt-1 truncate max-w-full font-mono" title={getBnxMailId()}>
                      {getBnxMailId()}
                    </span>
                    <span className="text-[10px] text-text-secondary flex items-center gap-1.5 mt-1 font-medium capitalize">
                      🔑 Role: {loginRole || 'Partner'}
                    </span>
                  </div>
                  
                  {/* Dropdown Options */}
                  <ul className="py-2 divide-y divide-white/[0.03]">
                    <li>
                      <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors text-xs font-bold">
                        <Settings className="h-4 w-4" />
                        <span>Business Settings</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/services" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors text-xs font-bold">
                        <Package className="h-4 w-4" />
                        <span>Manage Services</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/bookings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors text-xs font-bold">
                        <BookOpen className="h-4 w-4" />
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
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
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

                    {/* Switch Business segment */}
                    {allStores.length > 1 && (
                      <li className="px-5 py-3.5 bg-bg-tertiary/20">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 text-left">Switch Business</span>
                          <div className="max-h-32 overflow-y-auto space-y-0.5 custom-scrollbar bg-bg-secondary p-1 rounded-xl border border-border-brand/40">
                            {allStores.map((store) => {
                              const isActive = store.id === currentMerchant.id;
                              const StoreIcon = getCategoryIcon(store.category);
                              return (
                                <button
                                  key={store.id}
                                  onClick={() => {
                                    switchStore(store.id);
                                    setProfileOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                                    isActive
                                      ? 'bg-[#8b6508]/20 text-[#fceea7] font-extrabold border border-[#8b6508]/30'
                                      : 'text-slate-400 hover:bg-white/[0.02] hover:text-white border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <StoreIcon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#fceea7]' : 'text-slate-500'}`} />
                                    <span className="truncate text-[11px]">{store.merchantName}</span>
                                  </div>
                                  {isActive && <Check className="h-3 w-3 text-[#fceea7] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                  
                  {/* Bottom Divider & Sign Out */}
                  <div className="border-t border-border-brand px-2.5 py-2.5 bg-bg-tertiary">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors rounded-xl text-xs font-bold cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out console</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Utility Drawer Button */}
            <button
              onClick={() => setUtilityDrawerOpen(!utilityDrawerOpen)}
              className={`relative rounded-xl p-2.5 border transition-all cursor-pointer w-9 h-9 flex items-center justify-center overflow-hidden ${
                utilityDrawerOpen
                  ? 'border-[#8b6508] bg-[#8b6508]/10 text-white shadow-[0_0_8px_rgba(255,215,0,0.15)]'
                  : 'border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
              title="Bokspot Utilities"
            >
              <img src="/utility-icon.png" alt="Utilities" className="w-full h-full object-contain" />
            </button>
          </div>
        </header>
 
        <main className={`flex-1 overflow-y-auto bg-bg-primary p-6 lg:p-8 custom-scrollbar transition-all duration-300 ${
          utilityDrawerOpen ? 'lg:pr-[74px]' : ''
        }`}>
          {children}
        </main>
      </div>
      <UtilityDrawer isOpen={utilityDrawerOpen} onClose={() => setUtilityDrawerOpen(false)} isVendor={true} />
    </div>
  );
}
