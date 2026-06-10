'use client';

import { useVendorStore } from '../../../lib/store';
import { QrCode, CheckCircle2, XCircle, Search, Clock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';

export default function CheckinPage() {
  const { currentMerchant, bookings, checkInBooking } = useVendorStore();
  const [tokenInput, setTokenInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'success' | 'error';
    message: string;
    bookingRef?: string;
    customerName?: string;
    serviceName?: string;
    time?: string;
  } | null>(null);

  if (!currentMerchant) {
    return <div className="text-center text-slate-500">Loading check-in console...</div>;
  }

  // Filter bookings for this merchant
  const merchantBookings = bookings.filter(
    (b) => b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationResult(null);

    if (!tokenInput.trim()) return;

    const matched = merchantBookings.find(
      (b) => b.ref.toLowerCase() === tokenInput.trim().toLowerCase()
    );

    if (matched) {
      if (matched.status === 'CANCELLED') {
        setVerificationResult({
          status: 'error',
          message: 'This booking has been cancelled and cannot be checked-in.'
        });
      } else if (matched.status === 'COMPLETED') {
        setVerificationResult({
          status: 'error',
          message: 'This session has already been completed.'
        });
      } else if (matched.status === 'CHECKED_IN') {
        setVerificationResult({
          status: 'success',
          message: 'Client is already checked-in. Proceed to consultation room.',
          bookingRef: matched.ref,
          customerName: matched.customerName,
          serviceName: matched.serviceName,
          time: matched.time
        });
      } else {
        // CONFIRMED or PENDING -> Perform Check In
        checkInBooking(matched.id);
        setVerificationResult({
          status: 'success',
          message: 'Booking reference verified! Status updated to Checked In.',
          bookingRef: matched.ref,
          customerName: matched.customerName,
          serviceName: matched.serviceName,
          time: matched.time
        });
      }
    } else {
      setVerificationResult({
        status: 'error',
        message: 'Invalid code. This reference does not exist or belongs to another merchant catalog.'
      });
    }
  };

  // Recent check-ins list (Checked In or Completed bookings)
  const checkedInList = merchantBookings.filter(
    (b) => b.status === 'CHECKED_IN' || b.status === 'COMPLETED'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">QR Check-in Console</h1>
          <p className="text-xs text-slate-400">Verify customer references manually or scan QR check-in tokens.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Verification Portal */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-6">
          <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <QrCode className="h-5 w-5 text-[#d4af37] animate-pulse" /> Verify Customer Token
          </h2>

          <div className="aspect-video rounded-2xl bg-white/[0.01] border-2 border-dashed border-white/5 flex items-center justify-center p-6 text-center">
            <div className="space-y-2">
              <QrCode className="h-12 w-12 text-slate-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-white">Simulated Camera Scanner</div>
              <p className="text-[10px] text-slate-500 leading-normal max-w-[240px] mx-auto">Camera API requires HTTPS environment. Please enter reference codes below to simulate verification logs.</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Manual Reference Verification</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g. BK-DT8841" 
                  className="w-full rounded-xl border border-white/10 bg-[#090d16]/30 py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-[#8b6508] transition-colors" 
                />
              </div>
              <button 
                type="submit"
                className="rounded-xl bg-[#8b6508] hover:bg-[#664a05] px-5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Verify Code
              </button>
            </div>
          </form>

          {/* Verification Result Banner */}
          {verificationResult && (
            <div className={`p-4 rounded-xl border animate-fade-in ${
              verificationResult.status === 'success' 
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                : 'border-red-500/20 bg-red-500/5 text-red-400'
            }`}>
              <div className="flex items-start gap-3">
                {verificationResult.status === 'success' ? (
                  <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={18} className="shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <div className="text-xs font-bold leading-snug">{verificationResult.message}</div>
                  
                  {verificationResult.status === 'success' && verificationResult.bookingRef && (
                    <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1.5 text-[11px] text-slate-300">
                      <div>Ref: <strong className="font-mono text-white">{verificationResult.bookingRef}</strong></div>
                      <div className="flex items-center gap-1.5"><User size={12} /> Client: <strong className="text-white">{verificationResult.customerName}</strong></div>
                      <div>Service: <strong className="text-[#fceea7]">{verificationResult.serviceName}</strong></div>
                      <div className="flex items-center gap-1.5"><Clock size={12} /> Slot: {verificationResult.time}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checked-in List */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
          <h2 className="font-extrabold text-sm text-white uppercase tracking-wider">Recent Check-in Logs</h2>
          <p className="text-[11px] text-slate-400">Audit trail of clients validated today. Checked-in clients are queued in the platform console.</p>
          
          <div className="space-y-3 pt-2">
            {checkedInList.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 text-xs">
                {c.status === 'COMPLETED' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-cyan-400 shrink-0 animate-pulse" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white truncate">{c.customerName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{c.serviceName} · {c.ref}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    c.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : 'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {c.status}
                  </span>
                  <div className="text-[9px] text-slate-500 mt-1 font-medium">{c.time}</div>
                </div>
              </div>
            ))}
            {checkedInList.length === 0 && (
              <div className="text-center py-10 rounded-xl border border-dashed border-white/5 text-slate-500 text-xs">No client codes validated yet today.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
