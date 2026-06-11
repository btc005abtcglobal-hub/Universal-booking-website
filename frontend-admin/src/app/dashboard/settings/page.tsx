'use client';

import { useVendorStore } from '../../../lib/store';
import { Building2, Mail, Phone, Globe, MapPin, Camera, Save, Info, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { currentMerchant, loginRole, supervisorId, theme, setTheme } = useVendorStore();
  
  // Calculate dynamic integrated BNX Mail ID
  const getBnxMailId = () => {
    if (!currentMerchant) return '';
    const vendorUniqueId = currentMerchant.vendorId || '2026050000';
    if (loginRole === 'supervisor') {
      const supName = supervisorId || 'SUPERVISOR';
      return `${supName}/${vendorUniqueId}@bnxmail.com`;
    }
    return `${vendorUniqueId}@bnxmail.com`;
  };

  const [name, setName] = useState(currentMerchant?.merchantName || '');
  const [email, setEmail] = useState(getBnxMailId() || (currentMerchant?.username + '@merchant.com'));
  const [phone, setPhone] = useState('+91 98765 43210');
  const [website, setWebsite] = useState('www.beta-booking.com');
  const [address, setAddress] = useState('42 Anna Nagar, Chennai');
  const [about, setAbout] = useState(currentMerchant?.aboutText || '');

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: ''
  });

  if (!currentMerchant) {
    return <div className="text-center text-slate-500">Loading settings...</div>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({
      show: true,
      message: 'Business profile settings updated successfully.'
    });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <div className="space-y-6 relative">
      {/* Animated Success Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-[#0e1616] px-4 py-3 text-xs font-bold text-emerald-400 shadow-2xl animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-border-brand pb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Merchant Settings</h1>
          <p className="text-xs text-text-secondary">Configure profile, business hours, and operational details for your customer listings.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border-brand bg-bg-secondary p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={16} className="text-[#d4af37]" /> Business Information
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Business/Trading Name</label>
                <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                  <Building2 className="h-4 w-4 text-text-secondary shrink-0" />
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-xs text-text-primary" 
                    required
                  />
                </div>
              </div>
 
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Company Email ID</label>
                    <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded border border-indigo-500/20">BNX INTEGRATED</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                    <Mail className="h-4 w-4 text-text-secondary shrink-0" />
                    <input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-xs text-text-primary" 
                      required
                    />
                  </div>
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Telephone / Support Line</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                    <Phone className="h-4 w-4 text-text-secondary shrink-0" />
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-xs text-text-primary" 
                      required
                    />
                  </div>
                </div>
              </div>
 
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Website Address</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                    <Globe className="h-4 w-4 text-text-secondary shrink-0" />
                    <input 
                      value={website} 
                      onChange={(e) => setWebsite(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-xs text-text-primary" 
                    />
                  </div>
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Physical Address</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                    <MapPin className="h-4 w-4 text-text-secondary shrink-0" />
                    <input 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-xs text-text-primary" 
                      required
                    />
                  </div>
                </div>
              </div>
 
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Business Tagline / Description</label>
                <div className="flex items-start gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                  <Info className="h-4 w-4 text-text-secondary shrink-0 mt-1" />
                  <textarea 
                    rows={4}
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-xs text-text-primary resize-none" 
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#8b6508] hover:bg-[#664a05] py-3 text-xs font-bold text-white transition-all shadow-md shadow-[#8b6508]/10 cursor-pointer"
              >
                <Save size={14} /> Save Profile Settings
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          {/* Logo Card */}
          <div className="rounded-2xl border border-border-brand bg-bg-secondary p-6 text-center space-y-4">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-[#8b6508] to-[#0a3161] flex items-center justify-center text-[#fceea7] text-3xl font-black shadow-lg shadow-[#8b6508]/15">
              {currentMerchant.logoLetter}
            </div>
            <h3 className="font-extrabold text-xs text-text-secondary">Console Branding</h3>
            <button className="flex items-center gap-1.5 mx-auto rounded-xl border border-border-brand bg-bg-tertiary/20 hover:bg-bg-tertiary/50 px-4 py-2 text-xs font-bold text-text-primary transition-all cursor-pointer">
              <Camera className="h-4.5 w-4.5" /> Upload Custom Logo
            </button>
          </div>

          {/* Theme Settings Card */}
          <div className="rounded-2xl border border-border-brand bg-bg-secondary p-6 space-y-4">
            <h3 className="font-extrabold text-xs text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              🎨 Theme Settings
            </h3>
            <p className="text-[10px] text-text-secondary leading-relaxed">Customize the look and feel of your merchant console dashboard.</p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'light', label: '☀️ Light' },
                { id: 'dark', label: '🌙 Dark' },
                { id: 'system', label: '💻 System' }
              ].map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id as any)}
                    className={`py-2 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#8b6508]/15 border-[#8b6508]/40 text-[#fceea7] font-extrabold'
                        : 'border-border-brand bg-bg-tertiary/20 text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Hours */}
          <div className="rounded-2xl border border-border-brand bg-bg-secondary p-6 space-y-3">
            <h3 className="font-extrabold text-xs text-text-primary uppercase tracking-wider">Business Operating Hours</h3>
            <div className="space-y-2 pt-1 text-xs">
              {[
                { day: 'Mon - Fri', hours: '09:00 AM - 08:00 PM' },
                { day: 'Saturday', hours: '10:00 AM - 06:00 PM' },
                { day: 'Sunday', hours: 'Closed' }
              ].map(h => (
                <div key={h.day} className="flex justify-between text-text-secondary">
                  <span className="font-semibold text-text-muted">{h.day}</span>
                  <span className="text-text-primary font-medium">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
