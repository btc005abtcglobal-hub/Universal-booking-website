'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useVendorStore } from '../lib/store';
import { 
  Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound, AlertCircle,
  Stethoscope, Dumbbell, Scissors, Utensils, Sparkles
} from 'lucide-react';

export default function AdminGatePage() {
  const { loginMerchant, currentMerchant } = useVendorStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (useVendorStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    const unsub = useVendorStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (mounted && hasHydrated && currentMerchant) {
      window.location.href = '/dashboard';
    }
  }, [currentMerchant, mounted, hasHydrated]);

  if (!mounted || !hasHydrated) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center">
        <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] animate-pulse">Initializing Gate...</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    const successLogin = loginMerchant(username.trim(), password);
    if (successLogin) {
      setSuccess('Sign in successful. Redirecting to console...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      setError('Invalid username or passcode.');
    }
  };

  const handleQuickLogin = (role: string) => {
    setError(null);
    setSuccess(null);
    setUsername(role);
    setPassword('123');

    const successLogin = loginMerchant(role, '123');
    if (successLogin) {
      setSuccess(`Authenticated as ${role}! Redirecting...`);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    } else {
      setError('Quick login configuration error.');
    }
  };

  const DEMO_PROFILES = [
    { role: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'hover:border-sky-500/30 hover:text-sky-400' },
    { role: 'fitness', label: 'Trainer', icon: Dumbbell, color: 'hover:border-emerald-500/30 hover:text-emerald-400' },
    { role: 'salon', label: 'Stylist', icon: Scissors, color: 'hover:border-rose-500/30 hover:text-rose-400' },
    { role: 'dining', label: 'Maitre D\'', icon: Utensils, color: 'hover:border-purple-500/30 hover:text-purple-400' }
  ];

  return (
    <main className="min-h-screen bg-[#030c17] text-slate-200 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Background Gradients */}
      <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0a3161]/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#8b6508]/6 blur-[120px] pointer-events-none" />
      
      {/* Clean Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
 
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Logo / Title Area */}
        <div className="text-center space-y-3">
          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div className="flex items-center gap-2 bg-white/95 px-4.5 py-1.5 rounded-full border border-white/20 shadow-lg select-none shrink-0 scale-105">
              <Sparkles className="w-4.5 h-4.5 text-[#ff6325] fill-[#ff6325] animate-pulse" />
              <span className="font-['Playfair_Display'] text-[17px] tracking-[0.15em] uppercase font-bold text-slate-800">
                <span className="text-[#0a3161] font-black">BOK</span>
                <span className="text-[#ff6325] font-black">SPOT</span>
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-[#8b6508]/15 border border-[#8b6508]/30 text-[#fceea7] shadow-sm select-none">
              MERCHANT CONSOLE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Sign in to manage bookings, services, and schedules.</p>
        </div>
 
        {/* Login Card */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
 
          {success && (
            <div className="mb-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck size={15} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}
 
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Console Key */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Username / Account ID</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. doctor, fitness, salon, dining"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all"
                  required
                />
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
 
            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Passcode</label>
                <a href="#" className="text-[10px] text-[#fceea7] hover:text-[#8b6508] font-semibold transition-colors">Forgot key?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.04] pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all"
                  required
                />
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
 
            {/* Keep Signed In */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="h-3.5 w-3.5 rounded border-white/10 bg-white/[0.02] text-[#8b6508] focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-[10px] font-semibold text-slate-400 select-none">Keep me signed in on this device</label>
            </div>
 
            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8b6508] to-[#d4af37] text-white hover:brightness-105 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#8b6508]/10 mt-6 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Sign In <ArrowRight size={13} />
            </button>
          </form>
 
          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative bg-[#030c17] px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Demo Quick Access</span>
          </div>
 
          {/* Demo Login Pills */}
          <div className="space-y-2.5">
            <p className="text-[10px] text-slate-500 font-semibold text-center">Select a demo profile to login instantly (passcode: 123):</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PROFILES.map((p) => (
                <button
                  key={p.role}
                  onClick={() => handleQuickLogin(p.role)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-white/5 bg-white/[0.01] text-[10.5px] font-bold text-slate-400 transition-all ${p.color} cursor-pointer`}
                >
                  <p.icon size={13} className="shrink-0" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
