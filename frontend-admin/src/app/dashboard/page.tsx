'use client';

import { useVendorStore } from '../../lib/store';
import { 
  TrendingUp, Users, Calendar, IndianRupee, Clock, CheckCircle2, 
  Stethoscope, Scissors, Dumbbell, Utensils, AlertTriangle, 
  Activity, Flame, User, Eye, ShieldAlert, Sparkles, MapPin, Award
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const { currentMerchant, bookings, services } = useVendorStore();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  if (!currentMerchant) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Loading console session...
      </div>
    );
  }

  // Filter bookings and services for the current merchant
  const merchantBookings = bookings.filter(
    (b) => b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );
  
  const merchantServices = services.filter(
    (s) => s.merchant.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );

  const activeBookings = merchantBookings.filter(b => b.status === 'CONFIRMED');
  const completedBookings = merchantBookings.filter(b => b.status === 'COMPLETED');
  const checkedInBookings = merchantBookings.filter(b => b.status === 'CHECKED_IN');
  const cancelledBookings = merchantBookings.filter(b => b.status === 'CANCELLED');

  const totalEarnings = merchantBookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED' || b.status === 'CHECKED_IN')
    .reduce((sum, b) => sum + b.amount, 0);

  // Table map status for Dining
  const TABLES = [
    { id: 'Table 1', status: 'OCCUPIED', guests: 2, name: 'Vikram & Partner' },
    { id: 'Table 2', status: 'AVAILABLE', guests: 0, name: '' },
    { id: 'Table 3', status: 'AVAILABLE', guests: 0, name: '' },
    { id: 'Table 4 (Window Seat)', status: 'RESERVED', guests: 4, name: 'Anil Vasudevan' },
    { id: 'Table 5', status: 'OCCUPIED', guests: 3, name: 'Sen Group' },
    { id: 'Table 6', status: 'AVAILABLE', guests: 0, name: '' },
    { id: 'Table 7', status: 'OCCUPIED', guests: 2, name: 'Mehta Couple' },
    { id: 'Table 8', status: 'RESERVED', guests: 2, name: 'Sharma Dinner' },
    { id: 'Table 9', status: 'AVAILABLE', guests: 0, name: '' },
    { id: 'Table 10', status: 'OCCUPIED', guests: 4, name: 'Rao Family' },
    { id: 'Table 11', status: 'AVAILABLE', guests: 0, name: '' },
    { id: 'Table 12 (Corner Altar)', status: 'RESERVED', guests: 2, name: 'Prakash Raj' },
  ];

  // Render Industry Specific KPI widgets
  const renderKPIs = () => {
    switch (currentMerchant.category) {
      case 'Dental':
        return [
          { label: 'Platform Revenue', value: `₹${totalEarnings.toLocaleString()}`, change: 'Consultations', icon: IndianRupee, color: 'from-sky-500 to-indigo-600' },
          { label: 'Patient Bookings', value: String(merchantBookings.length), change: 'Total Registered', icon: Users, color: 'from-blue-500 to-cyan-600' },
          { label: 'Checked-in Today', value: String(checkedInBookings.length), change: 'In Waiting Room', icon: Activity, color: 'from-emerald-500 to-teal-600' },
          { label: 'Pending Consults', value: String(activeBookings.length), change: 'Scheduled Slots', icon: Clock, color: 'from-amber-500 to-orange-600' }
        ];
      case 'Fitness':
        return [
          { label: 'Monthly Earnings', value: `₹${totalEarnings.toLocaleString()}`, change: 'Coaching fees', icon: IndianRupee, color: 'from-emerald-500 to-teal-600' },
          { label: 'Gym Members', value: String(merchantBookings.length), change: 'Active Schedules', icon: Users, color: 'from-teal-500 to-sky-600' },
          { label: 'Diet Plans Assigned', value: String(merchantBookings.filter(b => b.dietPlan).length), change: 'Macros Configured', icon: Flame, color: 'from-orange-500 to-red-600' },
          { label: 'Completed Workouts', value: String(completedBookings.length), change: 'Sessions Finished', icon: CheckCircle2, color: 'from-indigo-500 to-purple-600' }
        ];
      case 'Salon':
        return [
          { label: 'Total Sales', value: `₹${totalEarnings.toLocaleString()}`, change: 'Styling services', icon: IndianRupee, color: 'from-rose-500 to-pink-600' },
          { label: 'VIP Clients', value: String(merchantBookings.length), change: 'Salon Bookings', icon: Users, color: 'from-amber-500 to-rose-600' },
          { label: 'Stylist Slots Filled', value: '85%', change: 'Vikram & Maria', icon: Sparkles, color: 'from-purple-500 to-indigo-600' },
          { label: 'Completed Cuts', value: String(completedBookings.length), change: 'Work finished', icon: CheckCircle2, color: 'from-emerald-500 to-green-600' }
        ];
      case 'Dining':
        return [
          { label: 'F&B Gross Sales', value: `₹${totalEarnings.toLocaleString()}`, change: 'Pre-ordered tables', icon: IndianRupee, color: 'from-purple-500 to-fuchsia-600' },
          { label: 'Covers Served', value: String(merchantBookings.reduce((acc, curr) => acc + (curr.seatCount || 2), 0)), change: 'Total Diners', icon: Users, color: 'from-fuchsia-500 to-rose-600' },
          { label: 'Active Reservations', value: String(activeBookings.length), change: 'Tonight\'s lists', icon: Calendar, color: 'from-amber-500 to-orange-600' },
          { label: 'Table Occupancy', value: '58%', change: 'Tables 1, 5, 7, 10', icon: Utensils, color: 'from-sky-500 to-indigo-600' }
        ];
      default:
        return [];
    }
  };

  const kpis = renderKPIs();

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Info */}
      <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Console Dashboard <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase">{currentMerchant.category}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{currentMerchant.aboutText}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-xs text-emerald-400 font-bold uppercase">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Operational
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/5 to-fuchsia-500/5 blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.color} text-white shadow-lg`}>
                <kpi.icon size={16} />
              </div>
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 px-2 py-0.5 rounded bg-white/5">
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{kpi.value}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Industry Custom Dashboard Sections */}
      {currentMerchant.category === 'Dental' && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Waiting Room Patient Vitals Monitor */}
          <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Stethoscope size={16} className="text-sky-400 animate-pulse" /> Waiting Room Vitals Monitor
            </h2>
            <p className="text-[11px] text-slate-400">Vitals checked in by clinic staff upon patient arrival. Confirm records before clinic consult.</p>
            
            <div className="space-y-3 pt-2">
              {checkedInBookings.length > 0 ? (
                checkedInBookings.map((b) => (
                  <div key={b.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-xs">{b.customerName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span>Ref: {b.ref}</span> · <span className="text-sky-400">{b.serviceName}</span>
                      </div>
                    </div>
                    {b.vitals && (
                      <div className="grid grid-cols-4 gap-4 text-center sm:text-right">
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-black">BP</div>
                          <div className="text-[11px] font-bold text-white mt-0.5">{b.vitals.bp}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-black">Temp</div>
                          <div className="text-[11px] font-bold text-white mt-0.5">{b.vitals.temp}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-black">Pulse</div>
                          <div className="text-[11px] font-bold text-white mt-0.5">{b.vitals.pulse}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-black">O2</div>
                          <div className="text-[11px] font-bold text-emerald-400 mt-0.5">{b.vitals.oxygen}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 rounded-xl border border-dashed border-white/5 text-slate-500 text-xs">
                  No patients are currently checked-in at the waiting room.
                </div>
              )}
            </div>
          </div>

          {/* Quick Symptoms Log */}
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" /> Patient Symptoms Queue
            </h2>
            <div className="divide-y divide-white/5">
              {merchantBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN').map((b) => (
                <div key={b.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-white">{b.customerName}</span>
                    <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">{b.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">"{b.symptoms || 'No custom symptom details logged yet.'}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentMerchant.category === 'Fitness' && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Caloric & Macronutrient Distribution Panel */}
          <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-6">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Flame size={16} className="text-orange-400" /> Active Member Macros Assignments
            </h2>
            <p className="text-[11px] text-slate-400">Nutritional distribution assigned to clients for body recomp. Updates auto-sync to member dashboard.</p>
            
            <div className="space-y-4">
              {merchantBookings.filter(b => b.dietPlan).map((b) => {
                const diet = b.dietPlan!;
                const total = diet.protein * 4 + diet.carbs * 4 + diet.fats * 9;
                return (
                  <div key={b.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-xs text-white">{b.customerName}</span>
                        <span className="text-[9px] font-bold text-indigo-400 uppercase ml-2 bg-indigo-500/10 px-2 py-0.5 rounded-full">{diet.dietType}</span>
                      </div>
                      <span className="text-[11px] font-bold text-white">{total} kCal</span>
                    </div>
                    {/* Progress Bar showing Macro Split */}
                    <div className="h-3 rounded-full overflow-hidden bg-white/5 flex text-[9px] font-bold text-center text-white leading-none">
                      <div 
                        className="bg-red-500 flex items-center justify-center transition-all" 
                        style={{ width: `${(diet.protein * 4 / total) * 100}%` }}
                        title={`Protein: ${diet.protein}g`}
                      >
                        P
                      </div>
                      <div 
                        className="bg-yellow-500 flex items-center justify-center transition-all" 
                        style={{ width: `${(diet.carbs * 4 / total) * 100}%` }}
                        title={`Carbs: ${diet.carbs}g`}
                      >
                        C
                      </div>
                      <div 
                        className="bg-emerald-500 flex items-center justify-center transition-all" 
                        style={{ width: `${(diet.fats * 9 / total) * 100}%` }}
                        title={`Fats: ${diet.fats}g`}
                      >
                        F
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Protein: <strong className="text-red-400">{diet.protein}g</strong> ({Math.round((diet.protein * 4 / total) * 100)}%)</span>
                      <span>Carbs: <strong className="text-yellow-400">{diet.carbs}g</strong> ({Math.round((diet.carbs * 4 / total) * 100)}%)</span>
                      <span>Fats: <strong className="text-emerald-400">{diet.fats}g</strong> ({Math.round((diet.fats * 9 / total) * 100)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Training Target logs */}
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-emerald-400" /> Active Member Goals
            </h2>
            <div className="divide-y divide-white/5">
              {merchantBookings.filter(b => b.fitnessGoal).map((b) => (
                <div key={b.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="font-bold text-xs text-white">{b.customerName}</div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">"{b.fitnessGoal}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentMerchant.category === 'Salon' && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* VIP Client preference files */}
          <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Scissors size={16} className="text-rose-400" /> Styling Preference Records
            </h2>
            <p className="text-[11px] text-slate-400">Styling parameters tracked by senior stylists. Review before beginning treatments.</p>
            
            <div className="space-y-3">
              {merchantBookings.map((b) => (
                <div key={b.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-white">{b.customerName}</span>
                    <span className="text-[9px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full">{b.serviceName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div><span className="text-slate-500">Hair Type:</span> <strong className="text-white">{b.hairType || 'N/A'}</strong></div>
                    <div><span className="text-slate-500">Skin/Scalp Type:</span> <strong className="text-white">{b.skinType || 'N/A'}</strong></div>
                  </div>
                  {b.stylingNotes && (
                    <div className="text-[10px] text-slate-400 bg-white/[0.01] border border-white/5 p-2 rounded italic">
                      "{b.stylingNotes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transformation Gallery */}
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" /> Before/After Gallery
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {merchantBookings.filter(b => b.beforeAfterGallery && b.beforeAfterGallery.length > 0).map((b) => (
                <div key={b.id} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden relative group">
                  <img src={b.beforeAfterGallery![0]} alt={b.customerName} className="w-full h-28 object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2.5">
                    <div className="font-bold text-[10px] text-white truncate">{b.customerName}</div>
                    <div className="text-[8px] text-slate-400 truncate">Transformation Cut</div>
                  </div>
                </div>
              ))}
              {merchantBookings.filter(b => b.beforeAfterGallery && b.beforeAfterGallery.length > 0).length === 0 && (
                <div className="col-span-2 text-center py-10 rounded-xl border border-dashed border-white/5 text-slate-500 text-xs">
                  No transformations uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentMerchant.category === 'Dining' && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Restaurant Live Table Status Map */}
          <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Utensils size={16} className="text-fuchsia-400 animate-pulse" /> Live Table Status Map
            </h2>
            <p className="text-[11px] text-slate-400">Click a reserved or occupied table to view reservations, seating capacities, and allergen warnings.</p>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
              {TABLES.map((table) => {
                const color = table.status === 'OCCUPIED' 
                  ? 'border-fuchsia-500/30 bg-fuchsia-500/5 text-fuchsia-400' 
                  : table.status === 'RESERVED' 
                  ? 'border-amber-500/30 bg-amber-500/5 text-amber-400' 
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] text-slate-400';
                return (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${color} cursor-pointer flex flex-col justify-center items-center h-20 relative`}
                  >
                    <span className="font-black text-xs block">{table.id.split(' ')[1] || 'Table'}</span>
                    <span className="text-[8px] uppercase tracking-widest font-black opacity-60 mt-1 block">{table.status}</span>
                    {table.guests > 0 && (
                      <span className="absolute top-1.5 right-1.5 text-[8px] bg-white/5 px-1 rounded-sm font-bold">{table.guests}P</span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedTable && (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-2 animate-fade-in text-xs">
                {(() => {
                  const details = TABLES.find(t => t.id === selectedTable);
                  if (details && details.status !== 'AVAILABLE') {
                    const booking = merchantBookings.find(b => b.customerName === details.name || b.tableNumber?.includes(selectedTable.split(' ')[1]));
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <strong className="text-white">{selectedTable}</strong>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black ${details.status === 'OCCUPIED' ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {details.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                          <div><span className="text-slate-500">Guest:</span> <strong className="text-white">{details.name || 'Walk-in'}</strong></div>
                          <div><span className="text-slate-500">Seating:</span> <strong className="text-white">{details.guests || booking?.seatCount || 2} covers</strong></div>
                        </div>
                        {booking && (
                          <div className="space-y-1.5 pt-2 border-t border-white/5">
                            {booking.dietaryRestrictions && booking.dietaryRestrictions.length > 0 && (
                              <div className="flex items-center gap-1.5 text-[10px] text-red-400 bg-red-500/5 border border-red-500/10 px-2.5 py-1 rounded">
                                <AlertTriangle size={12} className="shrink-0 animate-pulse" />
                                <span>Allergies: <strong>{booking.dietaryRestrictions.join(', ')}</strong></span>
                              </div>
                            )}
                            {booking.preOrderedCourses && booking.preOrderedCourses.length > 0 && (
                              <div className="text-[10px] text-slate-400">
                                Pre-order: <span className="text-indigo-400 font-medium">{booking.preOrderedCourses.join(' · ')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    );
                  }
                      return (
                        <div className="text-slate-500 italic">Table is currently available. Can be assigned to new walk-in arrivals or upcoming reservation tickets.</div>
                      );
                    })()}
                  </div>
            )}
          </div>

          {/* Kitchen special requests alerts */}
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400 animate-pulse" /> Kitchen Dietary Log
            </h2>
            <div className="space-y-3">
              {merchantBookings.filter(b => b.dietaryRestrictions && b.dietaryRestrictions.length > 0).map((b) => (
                <div key={b.id} className="rounded-xl border border-red-500/10 bg-red-500/5 p-3.5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-white">{b.customerName}</span>
                    <span className="text-[10px] text-red-400 font-black">{b.tableNumber?.split(' ')[0] || 'Table'}</span>
                  </div>
                  <div className="text-[10px] text-red-300 font-semibold leading-relaxed">
                    CRITICAL ALERT: <strong>{b.dietaryRestrictions?.join(', ')}</strong>
                  </div>
                  {b.notes && (
                    <p className="text-[9px] text-slate-400 leading-normal italic">
                      Notes: "{b.notes.replace('Guest notes: ', '')}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Queue */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar size={16} className="text-indigo-400" /> Recent Reservation Logs
          </h2>
          <span className="text-xs text-slate-400 font-bold">Showing {merchantBookings.length} total entries</span>
        </div>
        
        <div className="overflow-x-auto border border-white/5 rounded-xl bg-white/[0.01]">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase font-bold tracking-wider text-slate-500">
                <th className="p-3.5 pl-5">Reference</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Service Requested</th>
                <th className="p-3.5">Scheduled Slot</th>
                <th className="p-3.5 text-right">Price</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {merchantBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-3.5 pl-5 font-mono font-bold text-white">{b.ref}</td>
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">{b.customerName[0]}</div>
                    {b.customerName}
                  </td>
                  <td className="p-3.5">{b.serviceName}</td>
                  <td className="p-3.5 text-slate-400">{b.date} · <span className="text-indigo-400 font-medium">{b.time}</span></td>
                  <td className="p-3.5 text-right font-bold text-white">₹{b.amount}</td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                      b.status === 'CONFIRMED'
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : b.status === 'CHECKED_IN'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : b.status === 'COMPLETED'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {merchantBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 italic">No bookings logged for this merchant catalog yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
