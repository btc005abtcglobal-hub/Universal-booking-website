'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, Sparkles, MapPin, Map, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useLocationStore } from '../lib/store';

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

  useEffect(() => {
    setMounted(true);
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
      const activeNode = CITY_NODES.find(n => n.name.toLowerCase() === city.toLowerCase()) || CITY_NODES[0];
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
      <header className="bg-[color:var(--color-surface)]/80 border-b border-[color:var(--color-outline-variant)]/10 backdrop-blur-xl fixed top-0 left-0 w-full z-50 transition-all duration-300">
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

            {/* Desktop Location Selector (between Logo and Center Menu) */}
            <div className="hidden lg:flex items-center gap-2 bg-[color:var(--color-surface-container)]/70 border border-[color:var(--color-outline-variant)]/30 rounded-full px-5 py-2.5 shadow-md backdrop-blur-md shrink-0">
              <button
                onClick={() => setShowMapModal(true)}
                className="p-1 hover:bg-[color:var(--color-on-surface)]/[0.05] hover:text-[color:var(--color-primary)] text-[color:var(--color-on-surface-variant)] transition-all rounded-full cursor-pointer shrink-0"
                title="Choose on Interactive Map"
              >
                <Map size={18} />
              </button>
              <MapPin size={18} className={`text-[color:var(--color-primary)] shrink-0 ${status === 'detecting' ? 'animate-bounce' : ''}`} />
              <select
                value={mounted ? (status === 'detecting' ? 'Detect Location' : city) : 'Chennai'}
                onChange={(e) => handleCityChange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm lg:text-base font-extrabold text-[color:var(--color-on-surface)] cursor-pointer pr-6 appearance-none hover:text-[color:var(--color-primary)] transition-colors focus:ring-0 max-w-[140px] lg:max-w-[180px] truncate"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23A8A8C0\' stroke-width=\'2.5\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                  backgroundPosition: 'right center',
                  backgroundSize: '12px',
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
                <option value="Detect Location" className="bg-[color:var(--color-surface-container)] text-[color:var(--color-primary)] font-bold">📍 Detect GPS...</option>
              </select>
            </div>
          </div>

          {/* Center Column: Floating Navigation Menu */}
          <div className="hidden lg:flex flex-none justify-center">
            <nav className="flex items-center gap-1 bg-[color:var(--color-surface-container)]/60 border border-[color:var(--color-outline-variant)]/30 px-1.5 py-1.5 rounded-full backdrop-blur-md shadow-lg relative">
              <Link
                href="/"
                className={`rounded-full px-6 py-2 text-[14px] font-extrabold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  pathname === '/'
                    ? 'bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] shadow-sm'
                    : 'text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-on-surface)]/[0.04]'
                }`}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className={`rounded-full px-6 py-2 text-[14px] font-extrabold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  pathname === '/categories'
                    ? 'bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] shadow-sm'
                    : 'text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-on-surface)]/[0.04]'
                }`}
              >
                Categories
              </Link>

              <Link
                href="/tracks"
                className={`rounded-full px-6 py-2 text-[14px] font-extrabold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  pathname === '/tracks'
                    ? 'bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] shadow-sm'
                    : 'text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-on-surface)]/[0.04]'
                }`}
              >
                Tracks
              </Link>
            </nav>
          </div>

          {/* Right Column: Actions Capsule */}
          <div className="flex-1 flex justify-end">
            {/* Desktop Actions Capsule (>= lg) */}
            <div className="hidden lg:flex items-center bg-[color:var(--color-surface-container)]/60 border border-[color:var(--color-outline-variant)]/30 rounded-full pl-4 pr-1.5 py-1.5 gap-3.5 shadow-lg backdrop-blur-md">
              <div className="relative flex items-center group">
                <Search size={15} className="text-[color:var(--color-outline)] group-focus-within:text-[color:var(--color-primary)] transition-colors" strokeWidth={2.5} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-xs pl-2 text-[color:var(--color-on-surface)] placeholder-[color:var(--color-outline)] w-20 xl:w-28 focus:w-36 xl:focus:w-44 transition-all duration-300"
                  onKeyDown={handleSearchKeyDown}
                />
              </div>

              <span className="w-[1px] h-4 bg-[color:var(--color-outline-variant)]/40" />

              <button className="p-1 text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] hover:bg-[color:var(--color-on-surface)]/[0.04] transition-all rounded-full cursor-pointer" aria-label="Wishlist">
                <Heart size={16} strokeWidth={2} />
              </button>

              <button className="p-1 text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] hover:bg-[color:var(--color-on-surface)]/[0.04] transition-all rounded-full cursor-pointer relative" aria-label="Cart">
                <ShoppingBag size={16} strokeWidth={2} />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[color:var(--color-primary)] rounded-full shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
              </button>

              <ThemeToggle />

              <Link
                href="/profile"
                className="bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] hover:bg-[color:var(--color-primary-fixed-dim)] px-5 py-2 rounded-full font-extrabold text-[13px] tracking-wide hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer shadow-sm shadow-[color:var(--color-primary)]/10"
              >
                Profile
              </Link>
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
              
              <span className="w-[1px] h-3.5 bg-[color:var(--color-outline-variant)]/40" />

              <ThemeToggle />
              <Link
                href="/profile"
                className="w-7 h-7 rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] flex items-center justify-center font-extrabold text-[11px] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Open Profile"
              >
                R
              </Link>
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
                      className={`h-7 w-7 rounded-full absolute -translate-y-0.5 transition-all duration-300 ${
                        isSelected
                          ? 'bg-[color:var(--color-primary)]/20 animate-ping'
                          : 'bg-[color:var(--color-on-surface)]/[0.05] group-hover/node:bg-[color:var(--color-primary)]/10 scale-90'
                      }`}
                    />
                    
                    <div
                      className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 relative z-10 ${
                        isSelected
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
      {/* Floating GPS Widget */}
      {mounted && latitude !== null && longitude !== null && (
        <div className="fixed bottom-20 md:bottom-24 left-6 z-40 animate-fade-in">
          <div 
            className="flex items-center gap-3 bg-[color:var(--color-surface-container-high)]/90 border border-[color:var(--color-primary)]/20 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md group hover:border-[color:var(--color-primary)]/50 transition-all duration-300 select-none cursor-default"
            title={`GPS Status: ACTIVE\nAccuracy: Real-time\nCoordinates: ${latitude}°, ${longitude}°`}
          >
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--color-primary)]"></span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-widest text-[color:var(--color-outline)] font-bold">GPS Signals Locked</span>
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[11px] font-mono font-bold text-[color:var(--color-on-surface)] tracking-wide animate-pulse">
                {latitude.toFixed(6)}° N, {longitude.toFixed(6)}° E
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
