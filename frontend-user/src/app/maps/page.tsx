'use client';

import { MapPin, Star, Navigation, Compass, Loader, ArrowRight } from 'lucide-react';
import { TopNav } from '../../components/TopNav';
import { SideNav } from '../../components/SideNav';
import { BottomNav } from '../../components/BottomNav';
import { useState, useEffect } from 'react';
import { useLocationStore, useBookingFlowStore } from '../../lib/store';
import { MockService, calculateDistance } from '../../lib/mockData';
import Link from 'next/link';

export default function MapsPage() {
  const { city, latitude, longitude, setLocation } = useLocationStore();
  const { services } = useBookingFlowStore();
  const cityServices = services.filter(s => s.city.toLowerCase() === city.toLowerCase());
  
  const [selectedService, setSelectedService] = useState<MockService | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [located, setLocated] = useState(false);
  const [distances, setDistances] = useState<Record<string, number>>({});

  // Reset selected service when city changes
  useEffect(() => {
    if (cityServices.length > 0) {
      setSelectedService(cityServices[0]);
    } else {
      setSelectedService(null);
    }
  }, [city]);

  // Compute distances dynamically using Haversine formula if coordinates exist
  useEffect(() => {
    const initialDistances = cityServices.reduce((acc, svc, i) => {
      if (latitude !== null && longitude !== null && svc.lat && svc.lng) {
        acc[svc.id] = calculateDistance(latitude, longitude, svc.lat, svc.lng);
      } else {
        // Fallback default distance
        acc[svc.id] = parseFloat((1.2 + i * 0.4).toFixed(1));
      }
      return acc;
    }, {} as Record<string, number>);
    setDistances(initialDistances);
    setLocated(latitude !== null);
  }, [city, latitude, longitude]);

  const handleUseLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setLocated(true);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const fallbackCoords = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
          setLocation(lat, lng, fallbackCoords);

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
              console.warn(err);
              setLocation(lat, lng, fallbackCoords);
            });
        },
        (error) => {
          console.error(error);
          setIsLocating(false);
          // Fallback to random simulated coordinate shift
          setTimeout(() => {
            const shiftLat = 13.0827 + (Math.random() - 0.5) * 0.05;
            const shiftLng = 80.2707 + (Math.random() - 0.5) * 0.05;
            const coordCity = `${shiftLat.toFixed(4)}° N, ${shiftLng.toFixed(4)}° E`;
            setLocation(shiftLat, shiftLng, coordCity);
          }, 500);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <>
      <TopNav />
      <div className="hidden lg:block">
        <SideNav />
      </div>
      <main className="page-content-with-sidenav h-screen flex flex-col bg-[color:var(--color-background)]">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-full sm:w-96 overflow-y-auto border-r border-[color:var(--color-outline-variant)]/30 bg-[color:var(--color-surface-container)] flex flex-col custom-scrollbar">
            <div className="p-4 border-b border-[color:var(--color-outline-variant)]/20">
              <h1 className="text-lg font-bold flex items-center gap-2 text-[color:var(--color-on-surface)]">
                <MapPin className="h-5 w-5 text-[color:var(--color-primary)]" /> Nearby Services in {city}
              </h1>
              <button
                onClick={handleUseLocation}
                disabled={isLocating}
                className="mt-3 flex items-center gap-2 rounded-xl bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/20 px-4 py-3 text-sm font-semibold text-[color:var(--color-primary)] w-full justify-center hover:bg-[color:var(--color-primary)]/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" /> Locating...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4" /> Use My Location
                  </>
                )}
              </button>
              {located && latitude !== null && longitude !== null && (
                <div className="mt-2 text-center bg-green-500/5 rounded-xl border border-green-500/10 py-2">
                  <p className="text-[10px] text-green-400 font-bold flex items-center justify-center gap-1">
                    ✓ Location pinned! Proximity calculated.
                  </p>
                  <p className="text-[10px] font-mono text-[color:var(--color-primary)] mt-1 font-extrabold">
                    GPS: {latitude.toFixed(6)}° N, {longitude.toFixed(6)}° E
                  </p>
                </div>
              )}
            </div>

            <div className="divide-y divide-[color:var(--color-outline-variant)]/20 flex-1 overflow-y-auto custom-scrollbar">
              {cityServices.length > 0 ? (
                cityServices.map((svc) => {
                  const isSelected = selectedService?.id === svc.id;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-4 hover:bg-[color:var(--color-surface-dim)]/45 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[color:var(--color-surface-dim)]/70 border-l-4 border-[color:var(--color-primary)]' 
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-[color:var(--color-on-surface)]">{svc.name}</h3>
                          <p className="text-xs text-[color:var(--color-on-surface-variant)] mt-0.5">{svc.merchant}</p>
                        </div>
                        <span className="shrink-0 text-[11px] font-bold bg-[color:var(--color-surface-container-highest)] border border-[color:var(--color-outline-variant)]/30 px-2 py-0.5 rounded text-[color:var(--color-on-surface)]">
                          {distances[svc.id] || 0} km
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2.5 text-xs text-[color:var(--color-on-surface-variant)]">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-[color:var(--color-on-surface)]">{svc.rating}</span>
                        </div>
                        <span className="font-bold text-[color:var(--color-primary)]">₹{svc.price}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 px-4 text-xs text-[color:var(--color-outline)]">
                  No services found near {city}. Select another location from top.
                </div>
              )}
            </div>
          </div>

          {/* Map & Detail placeholder */}
          <div className="hidden sm:flex flex-1 flex-col bg-[color:var(--color-surface-dim)]/40 relative">
            <div className="absolute inset-0 bg-[linear-gradient(var(--color-outline-variant)_1px,transparent_1px),linear-gradient(90deg,var(--color-outline-variant)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.04]" />
            
            {selectedService && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-bounce">
                <div className="bg-[color:var(--color-surface-container-highest)] border border-[color:var(--color-primary)]/40 shadow-xl px-3 py-1.5 rounded-xl text-xs font-bold text-[color:var(--color-on-surface)] whitespace-nowrap mb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--color-primary)]" />
                  {selectedService.merchant}
                </div>
                <div className="h-10 w-10 rounded-full bg-[color:var(--color-primary)]/10 border-2 border-[color:var(--color-primary)] flex items-center justify-center shadow-lg shadow-[color:var(--color-primary)]/20">
                  <MapPin className="h-5 w-5 text-[color:var(--color-primary)] fill-[color:var(--color-primary)]/20" />
                </div>
              </div>
            )}

            <div className="flex-1 flex items-center justify-center">
              {!selectedService ? (
                <div className="text-center z-10">
                  <Compass className="h-16 w-16 text-[color:var(--color-outline)]/40 mx-auto mb-4 animate-spin" />
                  <p className="text-[color:var(--color-on-surface-variant)] text-sm font-semibold">Select a merchant from the list</p>
                  <p className="text-xs text-[color:var(--color-outline)] mt-1">Pins and routes will display dynamically</p>
                </div>
              ) : null}
            </div>

            {/* Selected Service Detail Panel */}
            {selectedService && (
              <div className="p-6 bg-[color:var(--color-surface-container)]/95 border-t border-[color:var(--color-outline-variant)]/30 backdrop-blur z-20 flex gap-5 items-center justify-between shadow-2xl relative">
                <div className="flex gap-4 items-center">
                  <img src={selectedService.image} alt={selectedService.name} className="h-20 w-28 rounded-xl object-cover border border-[color:var(--color-outline-variant)]/30 shadow-md shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/8 border border-[color:var(--color-primary)]/20 px-2 py-0.5 rounded-md">
                      {selectedService.category}
                    </span>
                    <h2 className="text-lg font-black text-[color:var(--color-on-surface)] mt-1.5">{selectedService.name}</h2>
                    <p className="text-xs text-[color:var(--color-on-surface-variant)] mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[color:var(--color-primary)]" /> {selectedService.merchant} · {distances[selectedService.id] || 0} km away
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2.5 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-[color:var(--color-on-surface-variant)] block">Starting at</span>
                    <span className="text-2xl font-black text-[color:var(--color-primary)]">₹{selectedService.price}</span>
                  </div>
                  <Link
                    href={`/service/${selectedService.id}`}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:from-indigo-600 hover:to-purple-700 active:scale-[0.97] transition-all"
                  >
                    View & Book <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
