'use client';

import { useVendorStore, PersistedBooking } from '../../../lib/store';
import { ChevronLeft, ChevronRight, Calendar, User, Clock, CheckCircle2, ShieldAlert, IndianRupee } from 'lucide-react';
import { useState } from 'react';

export default function CalendarPage() {
  const { currentMerchant, bookings } = useVendorStore();
  const [selectedSlotBooking, setSelectedSlotBooking] = useState<PersistedBooking | null>(null);

  if (!currentMerchant) {
    return <div className="text-center text-slate-500">Loading calendar session...</div>;
  }

  // Filter bookings for this merchant
  const merchantBookings = bookings.filter(
    (b) => b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = ['2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30', '2026-05-31'];
  const hours = [
    { label: '08:00 AM', query: '08:00 AM' },
    { label: '10:00 AM', query: '10:00 AM' },
    { label: '11:00 AM', query: '11:00 AM' },
    { label: '11:30 AM', query: '11:30 AM' },
    { label: '01:00 PM', query: '01:00 PM' },
    { label: '02:30 PM', query: '02:30 PM' },
    { label: '04:00 PM', query: '04:00 PM' },
    { label: '06:00 PM', query: '06:00 PM' },
    { label: '08:00 PM', query: '08:00 PM' },
    { label: '09:00 PM', query: '09:00 PM' }
  ];

  // Colors mapping for status
  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-[#8b6508]/15 text-[#fceea7] border border-[#8b6508]/30',
    CHECKED_IN: 'bg-[#0a3161]/20 text-[#9cc3f5] border border-[#0a3161]/30',
    COMPLETED: 'bg-green-500/10 text-green-400 border border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Calendar Slots</h1>
          <p className="text-xs text-slate-400">Weekly scheduling planner. Syncs in real-time with customer check-ins.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.01] px-4 py-2 text-xs text-slate-400 font-bold">
          <Calendar size={14} className="text-[#d4af37]" /> May 25 – May 31, 2026
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Weekly grid container */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden">
              {/* Header corner */}
              <div className="bg-[#0b101e] p-3 text-center text-[10px] font-black uppercase tracking-wider text-slate-500 border-r border-white/5">Time Slot</div>
              {/* Day headers */}
              {days.map((day, idx) => (
                <div key={day} className="bg-[#0b101e] p-3 text-center border-r border-white/5 last:border-r-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{day}</div>
                  <div className="text-xs font-black text-white mt-0.5">{dates[idx].split('-')[2]}</div>
                </div>
              ))}

              {/* Rows */}
              {hours.map((hour) => (
                <div key={hour.label} className="contents">
                  {/* Hour labels */}
                  <div className="bg-[#0b101e]/60 p-3 text-right pr-4 text-[10px] text-slate-500 font-bold border-r border-white/5 flex items-center justify-end h-16">
                    {hour.label}
                  </div>
                  {/* Slots per day */}
                  {dates.map((date) => {
                    // Find booking for this date and time
                    const slotBooking = merchantBookings.find(
                      (b) => b.date === date && b.time.toLowerCase() === hour.query.toLowerCase()
                    );
                    
                    return (
                      <div 
                        key={`${date}-${hour.label}`} 
                        className={`bg-white/[0.005] p-1.5 h-16 border-r border-white/5 last:border-r-0 flex flex-col justify-center transition-colors relative ${
                          slotBooking ? 'hover:bg-white/[0.02]' : ''
                        }`}
                      >
                        {slotBooking ? (
                          <button
                            onClick={() => setSelectedSlotBooking(slotBooking)}
                            className={`w-full h-full rounded-lg p-1.5 text-left border text-[9px] leading-tight truncate font-bold flex flex-col justify-between ${
                              statusColors[slotBooking.status] || 'bg-white/5 border-white/10 text-white'
                            } cursor-pointer`}
                          >
                            <span className="truncate block font-black">{slotBooking.customerName}</span>
                            <span className="opacity-70 truncate block mt-0.5">{slotBooking.serviceName}</span>
                          </button>
                        ) : (
                          <div className="h-full w-full rounded-lg border border-dashed border-white/[0.02] flex items-center justify-center opacity-20">
                            <span className="text-[8px] uppercase tracking-wider text-slate-600 font-bold">Free</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Slot Information Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 space-y-4 min-h-[300px] flex flex-col justify-between">
            {selectedSlotBooking ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-sm text-white">Slot Booking Details</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-black tracking-wide ${statusColors[selectedSlotBooking.status]}`}>
                      {selectedSlotBooking.status}
                    </span>
                  </div>

                  <div className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-[#8b6508]/10 border border-[#8b6508]/20 text-[#fceea7] flex items-center justify-center font-bold text-xs">{selectedSlotBooking.customerName[0]}</div>
                      <div>
                        <div className="font-bold text-xs text-white">{selectedSlotBooking.customerName}</div>
                        <div className="text-[10px] text-slate-500">{selectedSlotBooking.ref}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-white/5 pt-2.5 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} className="text-slate-500" />
                        <span>Scheduled: {selectedSlotBooking.date} at <strong>{selectedSlotBooking.time}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={11} className="text-slate-500" />
                        <span>Service: <strong className="text-white">{selectedSlotBooking.serviceName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IndianRupee size={11} className="text-slate-500" />
                        <span>Fee Charged: <strong className="text-white">₹{selectedSlotBooking.amount}</strong></span>
                      </div>
                    </div>
                  </div>

                  {selectedSlotBooking.notes && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">User Notes</span>
                      <p className="text-[10px] text-slate-400 italic bg-white/[0.01] border border-white/5 p-2 rounded">
                        "{selectedSlotBooking.notes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <a
                    href="/dashboard/bookings"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 py-2.5 text-xs font-bold text-white transition-all text-center cursor-pointer"
                  >
                    Open Complete Client File
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2">
                <ShieldAlert size={24} className="text-slate-600 animate-pulse" />
                <h4 className="font-extrabold text-xs text-white">No Slot Selected</h4>
                <p className="text-[10px] text-slate-500 leading-normal max-w-[200px]">Click any booked slot grid container on the weekly overview schedule to review client files.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
