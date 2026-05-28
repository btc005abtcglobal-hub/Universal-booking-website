'use client';

import { useVendorStore } from '../../../lib/store';
import { Building2, Mail, Phone, Globe, MapPin, Camera, Save, Info, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { currentMerchant } = useVendorStore();
  const [name, setName] = useState(currentMerchant?.merchantName || '');
  const [email, setEmail] = useState(currentMerchant?.username + '@merchant.com');
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

      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Merchant Settings</h1>
          <p className="text-xs text-slate-400">Configure profile, business hours, and operational details for your customer listings.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={16} className="text-indigo-400" /> Business Information
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Business/Trading Name</label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#070a13]/30 px-3.5 py-2">
                  <Building2 className="h-4 w-4 text-slate-500 shrink-0" />
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-xs text-white" 
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Public Contact Email</label>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#070a13]/30 px-3.5 py-2">
                    <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                    <input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-xs text-white" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Telephone / Support Line</label>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#070a13]/30 px-3.5 py-2">
                    <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-xs text-white" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Website Address</label>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#070a13]/30 px-3.5 py-2">
                    <Globe className="h-4 w-4 text-slate-500 shrink-0" />
                    <input 
                      value={website} 
                      onChange={(e) => setWebsite(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-xs text-white" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Physical Address</label>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#070a13]/30 px-3.5 py-2">
                    <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                    <input 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-xs text-white" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Business Tagline / Description</label>
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#070a13]/30 px-3.5 py-2">
                  <Info className="h-4 w-4 text-slate-500 shrink-0 mt-1" />
                  <textarea 
                    rows={4}
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-xs text-white resize-none" 
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 py-3 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
              >
                <Save size={14} /> Save Profile Settings
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          {/* Logo Card */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 text-center space-y-4">
            <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/15">
              {currentMerchant.logoLetter}
            </div>
            <h3 className="font-extrabold text-xs text-slate-300">Console Branding</h3>
            <button className="flex items-center gap-1.5 mx-auto rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer">
              <Camera className="h-4.5 w-4.5" /> Upload Custom Logo
            </button>
          </div>

          {/* Business Hours */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-3">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">Business Operating Hours</h3>
            <div className="space-y-2 pt-1 text-xs">
              {[
                { day: 'Mon - Fri', hours: '09:00 AM - 08:00 PM' },
                { day: 'Saturday', hours: '10:00 AM - 06:00 PM' },
                { day: 'Sunday', hours: 'Closed' }
              ].map(h => (
                <div key={h.day} className="flex justify-between text-slate-400">
                  <span className="font-semibold text-slate-500">{h.day}</span>
                  <span className="text-white font-medium">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
