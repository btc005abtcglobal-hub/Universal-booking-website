'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Calendar, BookOpen, Settings, QrCode, 
  Package, Menu, X, Bell, LogOut, Stethoscope, Dumbbell, 
  Scissors, Utensils, ShieldAlert, Check, Trash2, Info,
  ChevronDown, Building
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useVendorStore, PRESET_MERCHANTS } from '../../lib/store';
import { getVerticalFromCategory } from '../../lib/categoryUtils';
import { LiveClock } from './LiveClock';


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
  const { currentMerchant, logoutMerchant, switchStore } = useVendorStore();
  const [isMounted, setIsMounted] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  
  // Store Switcher state
  const [showStoreSwitcher, setShowStoreSwitcher] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  
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

  // Click outside to close notifications and store switcher popovers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setShowStoreSwitcher(false);
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
    ? [
        ...PRESET_MERCHANTS.filter(m => m.username === currentMerchant.username),
        ...Array.from(new Set(useVendorStore.getState().bookings
          .filter(b => b.category === currentMerchant.category)
          .map(b => b.merchantName)))
          .map((name) => {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return {
              id: `mer-${slug}`,
              username: currentMerchant.username,
              merchantName: name,
              category: currentMerchant.category,
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#070a13]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#0a0d18] border-r border-white/5 transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-3 border-b border-white/5 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/10">
            {currentMerchant.logoLetter}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate leading-tight">{currentMerchant.merchantName}</span>
            <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-extrabold mt-0.5">{currentMerchant.category}</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
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
                    ? 'bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/5 border border-indigo-500/10 text-indigo-300 shadow-md shadow-indigo-500/5' 
                    : 'text-slate-400 border border-transparent hover:bg-white/[0.01] hover:text-white'
                }`}
              >
                <item.icon className={`h-4 w-4 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Console Secured</span>
          </div>
          <p className="text-[9px] text-slate-500">Vendor ID: <span className="font-mono text-indigo-400">{currentMerchant.vendorId || 'N/A'}</span></p>
          <p className="text-[9px] text-slate-500">Merchant key: <span className="font-mono text-indigo-400">{currentMerchant.username}</span></p>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-[#0a0d18]/40 backdrop-blur-md px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-lg p-2 hover:bg-white/5 text-slate-300"><Menu className="h-5 w-5" /></button>
            
            {/* Store Switcher */}
            {allStores.length > 1 ? (
              <div className="relative" ref={switcherRef}>
                <button 
                  onClick={() => setShowStoreSwitcher(!showStoreSwitcher)}
                  className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer select-none"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Building className="h-3 w-3" />
                  </div>
                  <span className="max-w-[150px] truncate">{currentMerchant.merchantName}</span>
                  <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${showStoreSwitcher ? 'rotate-180' : ''}`} />
                </button>

                {showStoreSwitcher && (
                  <div className="absolute left-0 mt-3 w-56 rounded-xl border border-white/10 bg-[#0d1120] p-2 shadow-2xl z-50 space-y-1 animate-fade-in">
                    <div className="px-2.5 py-1.5 border-b border-white/5 mb-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Switch Business Store</span>
                      <span className="text-[10px] text-indigo-400 font-semibold truncate block">Vendor ID: {currentMerchant.vendorId || 'N/A'}</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
                      {allStores.map((store) => {
                        const isActive = store.id === currentMerchant.id;
                        const StoreIcon = getCategoryIcon(store.category);
                        return (
                          <button
                            key={store.id}
                            onClick={() => {
                              switchStore(store.id);
                              setShowStoreSwitcher(false);
                            }}
                            className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/5 text-indigo-300 font-extrabold'
                                : 'text-slate-400 hover:bg-white/[0.02] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <StoreIcon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                              <span className="truncate">{store.merchantName}</span>
                            </div>
                            {isActive && <Check className="h-3 w-3 text-indigo-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Static display or single store fallback
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/5 bg-white/[0.005] select-none">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/50 animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">{currentMerchant.merchantName}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Live Clock */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/5 bg-white/[0.01]">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">SYS TIME:</span>
              <LiveClock />
            </div>

            {/* Stateful Notifications Popover */}
            <div className="relative" ref={popoverRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl p-2.5 border border-white/5 bg-white/[0.01] hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-[#0d1120] p-4 shadow-2xl z-50 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-1.5 py-0.5">{unreadCount} new</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
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
                            n.type === 'warning' ? 'text-amber-400' : n.type === 'success' ? 'text-emerald-400' : 'text-indigo-400'
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
                                className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
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
            
            {/* Quick user badge */}
            <div className="flex items-center gap-3 border-l border-white/5 pl-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-red-500/10 hover:border-red-500/20 px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                title="Switch Merchant Console"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Switch Console</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#070a13] p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
