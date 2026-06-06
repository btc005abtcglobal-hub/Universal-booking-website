'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, Sparkles, MapPin, Map, X } from 'lucide-react';
import { useLocationStore, useUIStore } from '../lib/store';
import { LiveClock } from './LiveClock';

const CITY_NODES = [
  { name: 'Chennai', x: 80, y: 35, display: 'Chennai (Metro)', lat: 13.0827, lng: 80.2707 },
  { name: 'Bangalore', x: 58, y: 45, display: 'Bangalore (IT)', lat: 12.9716, lng: 77.5946 },
  { name: 'Coimbatore', x: 32, y: 62, display: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Theni', x: 30, y: 80, display: 'Theni (Hill Town)', lat: 10.0104, lng: 77.4768 },
  { name: 'Madurai', x: 50, y: 76, display: 'Madurai (Temple City)', lat: 9.9252, lng: 78.1198 },
  { name: 'Mumbai', x: 18, y: 22, display: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', x: 52, y: 10, display: 'Delhi', lat: 28.7041, lng: 77.1025 },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { city, setCity, setLocation, setStatus, status, latitude, longitude } = useLocationStore();
  const [showMapModal, setShowMapModal] = useState(false);
  const [tempSelectedCity, setTempSelectedCity] = useState<string | null>(null);
  const [markerPos, setMarkerPos] = useState<{ x: string; y: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState('Alex');
  const [userEmoji, setUserEmoji] = useState('🧑');
  // UI toggle states
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileOpenMobile, setProfileOpenMobile] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  // Refs for dropdown positioning / click‑outside handling
  const profileRef = useRef<HTMLDivElement>(null);
  const profileRefMobile = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const { toggleTheme } = useUIStore();

  const navItems = [
    { name: 'Home', path: '/', widthPx: 80 },
    { name: 'Categories', path: '/categories', widthPx: 112 },
    { name: 'Tracks', path: '/tracks', widthPx: 96 },
  ];

  const activeIndex = navItems.findIndex(item => item.path === pathname);

  const getSliderStyle = () => {
    if (activeIndex === -1) return { opacity: 0 };
    let left = 6;
    for (let i = 0; i < activeIndex; i++) {
      left += navItems[i].widthPx + 4;
    }
    return {
      left: `${left}px`,
      width: `${navItems[activeIndex].widthPx}px`,
      opacity: 1,
    };
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setLocationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
    }
  };

  const detectGPSLocation = () => {
    setStatus('detecting');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const fallbackCoords = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
          setLocation(lat, lng, fallbackCoords);

          // Attempt to reverse geocode exact coordinate to area name via open street map
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`, {
            headers: {
              'User-Agent': 'BetaBookingApp/1.0'
            }
          })
            .then(res => res.json())
            .then(data => {
              if (data && data.address) {
                const address = data.address;
                const localArea = address.suburb || address.neighbourhood || address.residential || address.city_district || address.village;
                const cityOrTown = address.city || address.town || address.municipality;

                const parts = [];
                if (localArea) parts.push(localArea);
                if (cityOrTown) parts.push(cityOrTown);

                if (parts.length > 0) {
                  setLocation(lat, lng, parts.join(', '));
                  return;
                }
              }
              setLocation(lat, lng, fallbackCoords);
            })
            .catch(err => {
              console.warn('Reverse geocode failed:', err);
              setLocation(lat, lng, fallbackCoords);
            });
        },
        (error) => {
          console.error('GPS Geolocation error:', error);
          setStatus('error');
          setLocation(13.0827, 80.2707, 'Chennai');
        }
      );
    } else {
      setStatus('error');
      setLocation(13.0827, 80.2707, 'Chennai');
    }
  };

  // Run location detection on page mount if already granted in previous session
  useEffect(() => {
    const saved = localStorage.getItem('location-storage');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.state?.status === 'detected') {
          detectGPSLocation();
        }
      } catch (e) {
        console.error('Failed to parse location storage', e);
      }
    }
  }, []);

  useEffect(() => {
    if (showMapModal) {
      const activeNode = CITY_NODES.find(n => n.name.toLowerCase() === (city || 'Chennai').toLowerCase()) || CITY_NODES[0];
      setTempSelectedCity(activeNode.name);
      setMarkerPos({ x: `${activeNode.x}%`, y: `${activeNode.y}%` });
    }
  }, [showMapModal, city]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let nearestCity = CITY_NODES[0];
    let minDistance = Infinity;

    CITY_NODES.forEach((node) => {
      const dist = Math.sqrt((node.x - clickX) ** 2 + (node.y - clickY) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        nearestCity = node;
      }
    });

    setTempSelectedCity(nearestCity.name);
    setMarkerPos({ x: `${nearestCity.x}%`, y: `${nearestCity.y}%` });
  };

  const handleConfirmLocation = () => {
    if (tempSelectedCity) {
      const node = CITY_NODES.find(n => n.name === tempSelectedCity);
      if (node) {
        setLocation(node.lat, node.lng, node.name);
      } else {
        setCity(tempSelectedCity);
      }
    }
    setShowMapModal(false);
  };

  const handleCityChange = (val: string) => {
    if (val === 'Detect Location') {
      detectGPSLocation();
    } else {
      const node = CITY_NODES.find(n => n.name === val);
      if (node) {
        setLocation(node.lat, node.lng, node.name);
      } else {
        setCity(val);
      }
    }
  };

  return (
    <>
      <header className="bg-[color:var(--color-surface)]/65 border-b border-[color:var(--color-outline-variant)]/15 backdrop-blur-2xl fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-sm shadow-black/5">
        <div className="flex justify-between items-center w-full px-6 lg:px-12 py-3 lg:py-4 max-w-7xl mx-auto">
          {/* Left Column: Logo & Brand + Location Selector (Desktop) */}
          <div className="flex-1 flex justify-start items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-['Playfair_Display'] text-[20px] lg:text-[24px] tracking-[0.15em] text-[color:var(--color-primary)] uppercase font-semibold hover:scale-102 active:scale-98 transition-all duration-300 shrink-0"
            >
              <Sparkles className="w-5 h-5 text-[color:var(--color-primary)] animate-pulse" />
              <span>BETA</span>
            </Link>

            <div className="relative hidden lg:inline-block" ref={locationRef}>
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="rounded-full px-5 py-2.5 text-[13px] font-extrabold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-[color:var(--color-surface-container)]/30 border border-[color:var(--color-outline-variant)]/20 text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-container-high)]/40 flex items-center gap-2 cursor-pointer backdrop-blur-md shrink-0 shadow-md"
              >
                <MapPin size={14} className={`text-[color:var(--color-primary)] ${status === 'detecting' ? 'animate-bounce' : ''}`} />
                <span>{mounted ? city : 'Chennai'}</span>
                <span className="material-symbols-outlined text-[16px] transition-transform duration-200" style={{ transform: locationDropdownOpen ? 'rotate(180deg)' : 'none' }}>keyboard_arrow_down</span>
              </button>
              {locationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-[color:var(--color-surface-container)] rounded-2xl shadow-2xl border border-[color:var(--color-outline-variant)]/30 z-50 overflow-hidden backdrop-blur-md animate-fade-up">
                  <div className="py-2 divide-y divide-[color:var(--color-outline-variant)]/10">
                    <button
                      onClick={() => {
                        detectGPSLocation();
                        setLocationDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 transition-colors text-left text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px] animate-pulse">my_location</span>
                      🎯 Detect GPS
                    </button>
                    <div className="py-1">
                      {['Chennai', 'Madurai', 'Theni', 'Coimbatore', 'Bangalore', 'Mumbai', 'Delhi'].map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            handleCityChange(c);
                            setLocationDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2 text-left text-xs font-semibold hover:bg-[color:var(--color-surface-container-highest)] transition-colors text-[color:var(--color-on-surface)] ${city === c ? 'text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5' : ''}`}
                        >
                          <span>📍 {c}</span>
                          {city === c && <span className="material-symbols-outlined text-[16px]">check</span>}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setShowMapModal(true);
                        setLocationDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-container-highest)] transition-colors text-left text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">map</span>
                      🗺️ Interactive Map
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Center Column: Floating Navigation Menu */}
          <div className="hidden lg:flex flex-none justify-center">
            <nav className="flex items-center gap-1 bg-[color:var(--color-surface-container)]/30 border border-[color:var(--color-outline-variant)]/20 px-1.5 py-1.5 rounded-full backdrop-blur-md shadow-lg relative">
              {/* Apple Sliding background indicator */}
              <div 
                className="absolute top-1.5 bottom-1.5 rounded-full bg-[color:var(--color-primary)]/15 border border-[color:var(--color-primary)]/45 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_0_12px_rgba(255,215,0,0.12)] backdrop-blur-md pointer-events-none"
                style={getSliderStyle()}
              />
              
              <Link
                href="/"
                className={`w-20 text-center py-2 text-[14px] font-extrabold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative z-10 ${
                  pathname === '/'
                    ? 'text-[color:var(--color-primary)]'
                    : 'text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)]'
                }`}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className={`w-28 text-center py-2 text-[14px] font-extrabold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative z-10 ${
                  pathname === '/categories'
                    ? 'text-[color:var(--color-primary)]'
                    : 'text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)]'
                }`}
              >
                Categories
              </Link>
              <Link
                href="/tracks"
                className={`w-24 text-center py-2 text-[14px] font-extrabold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative z-10 ${
                  pathname === '/tracks'
                    ? 'text-[color:var(--color-primary)]'
                    : 'text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)]'
                }`}
              >
                Tracks
              </Link>
            </nav>
          </div>

          {/* Right Column: Actions Capsule */}
          <div className="flex-1 flex justify-end items-center gap-3">
            {/* Desktop Actions Capsule (>= lg) */}
            {/* Desktop Actions (Separated Glass Circles) */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Search Icon Container */}
              <div 
                className={`relative rounded-full border border-[color:var(--color-outline-variant)]/20 bg-[color:var(--color-surface-container)]/30 backdrop-blur-md flex items-center shadow-md transition-all duration-300 ${
                  searchOpen ? 'w-48 px-3.5 py-1.5' : 'w-10 h-10 justify-center'
                }`}
              >
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-1 hover:bg-[color:var(--color-on-surface)]/[0.05] rounded-full text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-all cursor-pointer flex items-center justify-center shrink-0"
                  aria-label="Search"
                >
                  <Search size={15} strokeWidth={2.5} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 flex items-center ${
                    searchOpen ? 'w-32 xl:w-40 opacity-100 ml-2' : 'w-0 opacity-0'
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-xs text-[color:var(--color-on-surface)] placeholder-[color:var(--color-outline)] w-full"
                    onKeyDown={handleSearchKeyDown}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) {
                        setSearchOpen(false);
                      }
                    }}
                    autoFocus={searchOpen}
                  />
                </div>
              </div>

              {/* Wishlist Icon Container */}
              <button 
                className="w-10 h-10 rounded-full bg-[color:var(--color-surface-container)]/30 border border-[color:var(--color-outline-variant)]/20 backdrop-blur-md flex items-center justify-center shadow-md text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] hover:bg-[color:var(--color-surface-container-high)]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer" 
                aria-label="Wishlist"
              >
                <Heart size={16} strokeWidth={2} />
              </button>

              {/* Cart Icon Container */}
              <button 
                className="w-10 h-10 rounded-full bg-[color:var(--color-surface-container)]/30 border border-[color:var(--color-outline-variant)]/20 backdrop-blur-md flex items-center justify-center shadow-md text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] hover:bg-[color:var(--color-surface-container-high)]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer relative" 
                aria-label="Cart"
              >
                <ShoppingBag size={16} strokeWidth={2} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[color:var(--color-primary)] rounded-full shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
              </button>
            </div>

            {/* Desktop Profile Dropdown */}
            <div className="hidden lg:flex relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-[color:var(--color-surface-container)]/30 border border-[color:var(--color-outline-variant)]/20 text-[color:var(--color-on-surface)] px-4 py-2 rounded-full font-extrabold text-[13px] tracking-wide hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer shadow-md backdrop-blur-md hover:bg-[color:var(--color-surface-container-high)]/40"
                aria-label="Profile menu"
              >
                {userName} <span role="img" aria-label="profile">{userEmoji}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[color:var(--color-surface-container)] rounded-2xl shadow-2xl border border-[color:var(--color-outline-variant)]/30 z-20 overflow-hidden backdrop-blur-md">
                  <ul className="py-2 divide-y divide-[color:var(--color-outline-variant)]/20">
                    <li>
                      <Link href="/profile#settings" className="flex items-center gap-3 px-4 py-3 text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-container-highest)] transition-colors text-sm">
                        <span className="material-symbols-outlined text-[18px]">settings</span>Profile Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          toggleTheme();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-container-highest)] transition-colors text-sm font-semibold text-left cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">palette</span>Theme
                      </button>
                    </li>
                    <li>
                      <Link href="/profile#currency" className="flex items-center gap-3 px-4 py-3 text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-container-highest)] transition-colors text-sm">
                        <span className="material-symbols-outlined text-[18px]">attach_money</span>Currency
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile#wallet" className="flex items-center gap-3 px-4 py-3 text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-container-highest)] transition-colors text-sm">
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>Wallet
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile#notifications" className="flex items-center gap-3 px-4 py-3 text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-container-highest)] transition-colors text-sm">
                        <span className="material-symbols-outlined text-[18px]">notifications</span>Notifications
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile#saved" className="flex items-center gap-3 px-4 py-3 text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-container-highest)] transition-colors text-sm">
                        <span className="material-symbols-outlined text-[18px]">bookmark</span>Saved Places
                      </Link>
                    </li>
                  </ul>
                  <div className="border-t border-[color:var(--color-outline-variant)]/20 px-2 py-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        // Handle logout
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[#ff4d4f] hover:bg-[#ff4d4f]/10 transition-colors rounded-lg text-sm font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Actions Capsule (< lg) */}
            <div className="lg:hidden flex items-center bg-[color:var(--color-surface-container)]/60 border border-[color:var(--color-outline-variant)]/30 rounded-full pl-4 pr-1.5 py-1.5 shadow-md backdrop-blur-md gap-2.5">
              {/* Mobile Location Selector & Map Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowMapModal(true)}
                  className="p-0.5 hover:bg-[color:var(--color-on-surface)]/[0.05] hover:text-[color:var(--color-primary)] text-[color:var(--color-on-surface-variant)] transition-all rounded-full cursor-pointer shrink-0"
                  title="Choose on Interactive Map"
                >
                  <Map size={14} />
                </button>
                <MapPin size={14} className={`text-[color:var(--color-primary)] shrink-0 ${status === 'detecting' ? 'animate-bounce' : ''}`} />
                <select
                  value={mounted ? (status === 'detecting' ? 'Detect Location' : city) : 'Chennai'}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-bold text-[color:var(--color-on-surface)] cursor-pointer pr-4 appearance-none focus:ring-0 max-w-[110px] truncate"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23A8A8C0\' stroke-width=\'2.5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                    backgroundPosition: 'right center',
                    backgroundSize: '9px',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {mounted && city && !['Chennai', 'Madurai', 'Theni', 'Coimbatore', 'Bangalore', 'Mumbai', 'Delhi', 'Detect Location'].includes(city) && (
                    <option value={city} className="bg-[color:var(--color-surface-container)] text-[color:var(--color-on-surface)]">
                      📍 {city}
                    </option>
                  )}
                  <option value="Chennai" className="bg-[color:var(--color-surface-container)] text-[color:var(--color-on-surface)]">Chennai</option>
                  <option value="Madurai" className="bg-[color:var(--color-surface-container)] text-[color:var(--color-on-surface)]">Madurai</option>
                  <option value="Theni" className="bg-[color:var(--color-surface-container)] text-[color:var(--color-on-surface)]">Theni</option>
                  <option value="Coimbatore" className="bg-[color:var(--color-surface-container)] text-[color:var(--color-on-surface)]">Coimbatore</option>
                  <option value="Bangalore" className="bg-[color:var(--color-surface-container)] text-[color:var(--color-on-surface)]">Bangalore</option>
                  <option value="Mumbai" className="bg-[color:var(--color-surface-container)] text-[color:var(--color-on-surface)]">Mumbai</option>
                  <option value="Delhi" className="bg-[color:var(--color-surface-container)] text-[color:var(--color-on-surface)]">Delhi</option>
                  <option value="Detect Location" className="bg-[color:var(--color-surface-container)] text-[color:var(--color-primary)] font-bold">📍 GPS...</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Map Picker Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[color:var(--color-surface-container)] border border-[color:var(--color-outline-variant)]/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-[color:var(--color-outline-variant)]/20">
              <div>
                <h3 className="font-extrabold text-base text-[color:var(--color-on-surface)]">Choose Location on Map</h3>
                <p className="text-xs text-[color:var(--color-outline)] mt-0.5">Click near any city node to pin your location</p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-1.5 hover:bg-[color:var(--color-on-surface)]/[0.05] rounded-full text-[color:var(--color-outline)] hover:text-[color:var(--color-primary)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mock Map Area */}
            <div
              onClick={handleMapClick}
              className="relative h-80 bg-[color:var(--color-surface-dim)] m-5 rounded-2xl overflow-hidden cursor-crosshair border border-[color:var(--color-outline-variant)]/30 shadow-inner"
              style={{
                backgroundImage: 'radial-gradient(color-mix(in srgb, var(--color-primary) 8%, transparent) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            >
              {/* Regional Grid/Boundary Mock Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,200 Q 150,150 300,280 T 600,100" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" />
                <path d="M 100,0 Q 250,220 380,180 T 500,400" fill="none" stroke="var(--color-primary)" strokeWidth="1" />
              </svg>

              {/* City Hotspot Nodes */}
              {CITY_NODES.map((node) => {
                const isSelected = tempSelectedCity === node.name;
                return (
                  <div
                    key={node.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/node"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTempSelectedCity(node.name);
                      setMarkerPos({ x: `${node.x}%`, y: `${node.y}%` });
                    }}
                  >
                    <div
                      className={`h-7 w-7 rounded-full absolute -translate-y-0.5 transition-all duration-300 ${isSelected
                          ? 'bg-[color:var(--color-primary)]/20 animate-ping'
                          : 'bg-[color:var(--color-on-surface)]/[0.05] group-hover/node:bg-[color:var(--color-primary)]/10 scale-90'
                        }`}
                    />

                    <div
                      className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 relative z-10 ${isSelected
                          ? 'bg-[color:var(--color-primary)] border-[color:var(--color-surface)] scale-110 shadow-[0_0_10px_rgba(255,215,0,0.8)]'
                          : 'bg-[color:var(--color-surface-container)] border-[color:var(--color-outline)] group-hover/node:border-[color:var(--color-primary)]'
                        }`}
                    />

                    <span className="mt-1.5 px-2 py-0.5 rounded bg-[color:var(--color-surface-container-highest)] border border-[color:var(--color-outline-variant)]/30 text-[9px] font-bold text-[color:var(--color-on-surface-variant)] group-hover/node:text-[color:var(--color-on-surface)] transition-colors pointer-events-none whitespace-nowrap shadow">
                      {node.display}
                    </span>
                  </div>
                );
              })}

              {/* Bouncing Map Pin Drop Indicator */}
              {markerPos && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-[85%] z-20 pointer-events-none transition-all duration-300 ease-out"
                  style={{ left: markerPos.x, top: markerPos.y }}
                >
                  <div className="flex flex-col items-center">
                    <div className="h-9 w-9 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)] flex items-center justify-center shadow-lg shadow-[color:var(--color-primary)]/25 animate-bounce">
                      <MapPin className="h-4.5 w-4.5 text-[color:var(--color-primary)] fill-[color:var(--color-primary)]/20" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4.5 bg-[color:var(--color-surface-dim)]/50 border-t border-[color:var(--color-outline-variant)]/20 flex items-center justify-between">
              <div className="text-xs text-[color:var(--color-on-surface-variant)] flex flex-col gap-0.5">
                <div>
                  Selected: <span className="font-extrabold text-[color:var(--color-primary)] text-sm">{tempSelectedCity || 'None'}</span>
                </div>
                {tempSelectedCity && (
                  <div className="text-[10px] text-[color:var(--color-outline)] font-mono">
                    GPS Coordinates: {CITY_NODES.find(c => c.name === tempSelectedCity)?.lat.toFixed(4)}° N, {CITY_NODES.find(c => c.name === tempSelectedCity)?.lng.toFixed(4)}° E
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMapModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[color:var(--color-outline-variant)]/30 text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-on-surface)]/[0.05] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLocation}
                  disabled={!tempSelectedCity}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] hover:bg-[color:var(--color-primary-fixed-dim)] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Location Permission Request Banner */}
      {mounted && status === 'idle' && !dismissed && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-[100] animate-fade-up">
          <div className="card-glass rounded-2xl p-5 bg-[color:var(--color-surface-container-high)] shadow-2xl border border-[color:var(--color-primary)]/20 relative overflow-hidden">
            {/* Ambient background light */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at top right, var(--color-primary), transparent 65%)' }} />

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/20 flex items-center justify-center text-[color:var(--color-primary)]">
                    <MapPin size={16} className="animate-bounce" />
                  </div>
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[color:var(--color-on-surface)]">Enable Location</h4>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="p-1 hover:bg-[color:var(--color-on-surface)]/[0.05] rounded-full text-[color:var(--color-outline)] hover:text-[color:var(--color-primary)] transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-[11px] text-[color:var(--color-on-surface-variant)] leading-relaxed">
                Discover medical clinics, fitness coaches, and styling salons nearest to you. We request access to your device's GPS location.
              </p>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={detectGPSLocation}
                  className="flex-1 bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] hover:bg-[color:var(--color-primary-fixed-dim)] py-2 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-[color:var(--color-primary)]/15 cursor-pointer text-center"
                >
                  Allow Access
                </button>
                <button
                  onClick={() => { setShowMapModal(true); setDismissed(true); }}
                  className="flex-1 border border-[color:var(--color-outline-variant)]/30 hover:bg-[color:var(--color-on-surface)]/[0.05] text-[color:var(--color-on-surface)] py-2 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Choose Manually
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
