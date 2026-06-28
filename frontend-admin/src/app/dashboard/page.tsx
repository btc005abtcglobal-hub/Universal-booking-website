'use client';

import { useVendorStore } from '../../lib/store';
import { getVerticalFromCategory } from '../../lib/categoryUtils';
import { 
  TrendingUp, Users, Calendar, IndianRupee, Clock, CheckCircle2, 
  Stethoscope, Scissors, Dumbbell, Utensils, AlertTriangle, 
  Activity, Flame, User, Eye, ShieldAlert, Sparkles, MapPin, Award, Film
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const { currentMerchant, bookings, services, updateService } = useVendorStore();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Cinema states
  const [editMovieId, setEditMovieId] = useState<string>('');
  const [moviePosterInput, setMoviePosterInput] = useState<string>('');
  const [movieShowtimesInput, setMovieShowtimesInput] = useState<string>('');
  const [movieRatingInput, setMovieRatingInput] = useState<string>('UA');
  const [movieLanguageInput, setMovieLanguageInput] = useState<string>('English');
  const [movieHallInput, setMovieHallInput] = useState<string>('Screen 1');
  
  // Clinic states
  const [prescriptionPatientId, setPrescriptionPatientId] = useState<string>('');
  const [prescriptionSymptom, setPrescriptionSymptom] = useState<string>('');
  const [medicationName, setMedicationName] = useState<string>('');
  const [medicationDosage, setMedicationDosage] = useState<string>('');
  const [medicationInterval, setMedicationInterval] = useState<string>('Once Daily');
  const [localPrescriptions, setLocalPrescriptions] = useState<Array<{
    id: string;
    patientName: string;
    symptoms: string;
    meds: string;
    dosage: string;
    interval: string;
    timestamp: string;
  }>>([
    { id: 'rx-1', patientName: 'Sanjay Kumar', symptoms: 'Severe tooth decay & inflammation', meds: 'Amoxicillin + Ibuprofen', dosage: '500mg + 400mg', interval: 'Thrice Daily', timestamp: '10:15 AM' }
  ]);

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
    switch (getVerticalFromCategory(currentMerchant.category)) {
      case 'Dental':
        return [
          { label: 'Platform Revenue', value: `₹${totalEarnings.toLocaleString()}`, change: 'Consultations', icon: IndianRupee, color: 'from-[#8b6508] to-[#d4af37]' },
          { label: 'Patient Bookings', value: String(merchantBookings.length), change: 'Total Registered', icon: Users, color: 'from-[#0a3161] to-[#1a4b8c]' },
          { label: 'Checked-in Today', value: String(checkedInBookings.length), change: 'In Waiting Room', icon: Activity, color: 'from-[#664a05] to-[#8b6508]' },
          { label: 'Pending Consults', value: String(activeBookings.length), change: 'Scheduled Slots', icon: Clock, color: 'from-[#0a3161] to-[#8b6508]' }
        ];
      case 'Fitness':
        return [
          { label: 'Monthly Earnings', value: `₹${totalEarnings.toLocaleString()}`, change: 'Coaching fees', icon: IndianRupee, color: 'from-[#8b6508] to-[#d4af37]' },
          { label: 'Gym Members', value: String(merchantBookings.length), change: 'Active Schedules', icon: Users, color: 'from-[#0a3161] to-[#1a4b8c]' },
          { label: 'Diet Plans Assigned', value: String(merchantBookings.filter(b => b.dietPlan).length), change: 'Macros Configured', icon: Flame, color: 'from-[#664a05] to-[#8b6508]' },
          { label: 'Completed Workouts', value: String(completedBookings.length), change: 'Sessions Finished', icon: CheckCircle2, color: 'from-[#0a3161] to-[#8b6508]' }
        ];
      case 'Salon':
        return [
          { label: 'Total Sales', value: `₹${totalEarnings.toLocaleString()}`, change: 'Styling services', icon: IndianRupee, color: 'from-[#8b6508] to-[#d4af37]' },
          { label: 'VIP Clients', value: String(merchantBookings.length), change: 'Salon Bookings', icon: Users, color: 'from-[#0a3161] to-[#1a4b8c]' },
          { label: 'Stylist Slots Filled', value: '85%', change: 'Vikram & Maria', icon: Sparkles, color: 'from-[#664a05] to-[#8b6508]' },
          { label: 'Completed Cuts', value: String(completedBookings.length), change: 'Work finished', icon: CheckCircle2, color: 'from-[#0a3161] to-[#8b6508]' }
        ];
      case 'Dining':
        return [
          { label: 'F&B Gross Sales', value: `₹${totalEarnings.toLocaleString()}`, change: 'Pre-ordered tables', icon: IndianRupee, color: 'from-[#8b6508] to-[#d4af37]' },
          { label: 'Covers Served', value: String(merchantBookings.reduce((acc, curr) => acc + (curr.seatCount || 2), 0)), change: 'Total Diners', icon: Users, color: 'from-[#0a3161] to-[#1a4b8c]' },
          { label: 'Active Reservations', value: String(activeBookings.length), change: 'Tonight\'s lists', icon: Calendar, color: 'from-[#664a05] to-[#8b6508]' },
          { label: 'Table Occupancy', value: '58%', change: 'Tables 1, 5, 7, 10', icon: Utensils, color: 'from-[#0a3161] to-[#8b6508]' }
        ];
      case 'Cinema':
        return [
          { label: 'Box Office Sales', value: `₹${totalEarnings.toLocaleString()}`, change: 'Ticket sales', icon: IndianRupee, color: 'from-[#8b6508] to-[#d4af37]' },
          { label: 'Tickets Booked', value: String(merchantBookings.reduce((sum, b) => sum + (b.seatCount || 1), 0)), change: 'Seats Reserved', icon: Users, color: 'from-[#0a3161] to-[#1a4b8c]' },
          { label: 'Upcoming Movies', value: String(merchantServices.length), change: 'Active Schedule', icon: Film, color: 'from-[#664a05] to-[#8b6508]' },
          { label: 'Avg Hall Occupancy', value: '68%', change: 'Screenings Live', icon: Clock, color: 'from-[#0a3161] to-[#8b6508]' }
        ];
      case 'Wellness':
        return [
          { label: 'Spa Revenue', value: `₹${totalEarnings.toLocaleString()}`, change: 'Spa Sessions', icon: IndianRupee, color: 'from-[#8b6508] to-[#d4af37]' },
          { label: 'Rejuvenated Clients', value: String(merchantBookings.length), change: 'Total Booked', icon: Users, color: 'from-[#0a3161] to-[#1a4b8c]' },
          { label: 'Rooms Booked', value: String(merchantBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN').length), change: 'Lotus, Orchid Suite', icon: Sparkles, color: 'from-[#664a05] to-[#8b6508]' },
          { label: 'Completed Therapies', value: String(completedBookings.length), change: 'Sessions Finished', icon: CheckCircle2, color: 'from-[#0a3161] to-[#8b6508]' }
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
            Console Dashboard <span className="text-[10px] bg-[#8b6508]/10 text-[#fceea7] border border-[#8b6508]/20 px-2 py-0.5 rounded-full font-bold uppercase">{currentMerchant.category}</span>
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
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#8b6508]/5 to-[#0a3161]/5 blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
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
      {getVerticalFromCategory(currentMerchant.category) === 'Dental' && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left: Vitals & Prescriptions Journal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Waiting Room Patient Vitals Monitor */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
              <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Stethoscope size={16} className="text-[#d4af37] animate-pulse" /> Clinic Patient Vitals Monitor
              </h2>
              <p className="text-[11px] text-slate-400">Vitals checked in by clinic staff upon patient arrival. Confirm records before clinic consult.</p>
              
              <div className="space-y-3 pt-2">
                {checkedInBookings.length > 0 ? (
                  checkedInBookings.map((b) => (
                    <div key={b.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-bold text-white text-xs">{b.customerName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                          <span>Ref: {b.ref}</span> · <span className="text-[#fceea7]">{b.serviceName}</span>
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

            {/* Daily Prescriptions Journal */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
              <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#d4af37]" /> Daily Prescriptions Journal
              </h2>
              <p className="text-[11px] text-slate-400">Prescriptions logged by doctor during consult sessions today. Syncs to pharmacy and patient records.</p>
              
              <div className="space-y-3 pt-2">
                {localPrescriptions.map((rx) => (
                  <div key={rx.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white">{rx.patientName}</span>
                      <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">{rx.timestamp}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-1">
                      <div>Diagnosis: <span className="text-slate-300 italic">"{rx.symptoms}"</span></div>
                      <div>Medication: <strong className="text-white">{rx.meds}</strong> ({rx.dosage})</div>
                      <div>Dosage Schedule: <span className="text-[#fceea7] font-semibold">{rx.interval}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right: Symptoms Queue & Logger */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Symptoms Log */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
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

            {/* Prescription Logger */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
              <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Award size={16} className="text-[#d4af37]" /> Prescription Quick-Log
              </h2>
              <p className="text-[11px] text-slate-400">Write prescription instructions and update symptoms logs directly for scheduled patients.</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!prescriptionPatientId) return;
                const patientBooking = merchantBookings.find(b => b.id === prescriptionPatientId);
                if (patientBooking) {
                  // Update booking symptoms locally
                  patientBooking.symptoms = prescriptionSymptom;
                  
                  // Add prescription to local journal
                  const newRx = {
                    id: `rx-${Date.now()}`,
                    patientName: patientBooking.customerName,
                    symptoms: prescriptionSymptom,
                    meds: medicationName,
                    dosage: medicationDosage,
                    interval: medicationInterval,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  };
                  setLocalPrescriptions([newRx, ...localPrescriptions]);
                  
                  // Clear fields
                  setPrescriptionSymptom('');
                  setMedicationName('');
                  setMedicationDosage('');
                  alert('Prescription successfully logged to patient journal!');
                }
              }} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Select Patient</label>
                  <select
                    value={prescriptionPatientId}
                    onChange={(e) => {
                      setPrescriptionPatientId(e.target.value);
                      const booking = bookings.find(b => b.id === e.target.value);
                      if (booking) {
                        setPrescriptionSymptom(booking.symptoms || '');
                      }
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                    required
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-400">-- Choose Patient --</option>
                    {merchantBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN').map(b => (
                      <option key={b.id} value={b.id} className="bg-slate-900 text-white">{b.customerName} ({b.time})</option>
                    ))}
                  </select>
                </div>

                {prescriptionPatientId && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Patient Symptoms</label>
                      <input
                        type="text"
                        value={prescriptionSymptom}
                        onChange={(e) => setPrescriptionSymptom(e.target.value)}
                        placeholder="e.g. Sharp pain in lower molar"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Medication Prescribed</label>
                      <input
                        type="text"
                        value={medicationName}
                        onChange={(e) => setMedicationName(e.target.value)}
                        placeholder="e.g. Paracetamol + Amoxicillin"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Dosage Strength</label>
                        <input
                          type="text"
                          value={medicationDosage}
                          onChange={(e) => setMedicationDosage(e.target.value)}
                          placeholder="e.g. 500mg / 10ml"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Dosage Interval</label>
                        <select
                          value={medicationInterval}
                          onChange={(e) => setMedicationInterval(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37] bg-slate-900"
                        >
                          <option value="Once Daily">Once Daily</option>
                          <option value="Twice Daily">Twice Daily</option>
                          <option value="Thrice Daily">Thrice Daily</option>
                          <option value="Before Sleep">Before Sleep</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#8b6508] to-[#d4af37] hover:brightness-105 transition-all shadow-md cursor-pointer mt-2"
                    >
                      Log Diagnosis & RX
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {getVerticalFromCategory(currentMerchant.category) === 'Fitness' && (
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
                        <span className="text-[9px] font-bold text-[#fceea7] uppercase ml-2 bg-[#8b6508]/15 border border-[#8b6508]/20 px-2 py-0.5 rounded-full">{diet.dietType}</span>
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

      {getVerticalFromCategory(currentMerchant.category) === 'Salon' && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* VIP Client preference files */}
          <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Scissors size={16} className="text-[#d4af37]" /> Styling Preference Records
            </h2>
            <p className="text-[11px] text-slate-400">Styling parameters tracked by senior stylists. Review before beginning treatments.</p>
            
            <div className="space-y-3">
              {merchantBookings.map((b) => (
                <div key={b.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-white">{b.customerName}</span>
                    <span className="text-[9px] uppercase font-bold text-[#fceea7] bg-[#8b6508]/15 border border-[#8b6508]/20 px-2.5 py-0.5 rounded-full">{b.serviceName}</span>
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
              <Sparkles size={16} className="text-[#d4af37]" /> Before/After Gallery
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

      {getVerticalFromCategory(currentMerchant.category) === 'Dining' && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Restaurant Live Table Status Map */}
          <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Utensils size={16} className="text-[#d4af37] animate-pulse" /> Live Table Status Map
            </h2>
            <p className="text-[11px] text-slate-400">Click a reserved or occupied table to view reservations, seating capacities, and allergen warnings.</p>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
              {TABLES.map((table) => {
                const color = table.status === 'OCCUPIED' 
                  ? 'border-[#0a3161]/40 bg-[#0a3161]/15 text-[#9cc3f5]' 
                  : table.status === 'RESERVED' 
                  ? 'border-[#8b6508]/40 bg-[#8b6508]/15 text-[#fceea7]' 
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
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black ${details.status === 'OCCUPIED' ? 'bg-[#0a3161]/20 text-[#9cc3f5] border border-[#0a3161]/30' : 'bg-[#8b6508]/20 text-[#fceea7] border border-[#8b6508]/30'}`}>
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
                                Pre-order: <span className="text-[#d4af37] font-medium">{booking.preOrderedCourses.join(' · ')}</span>
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

      {getVerticalFromCategory(currentMerchant.category) === 'Cinema' && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Movie Catalog & Showtimes list */}
          <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Film size={16} className="text-[#d4af37]" /> Active Screenings & Showtimes
            </h2>
            <p className="text-[11px] text-slate-400">Current movie listings and showtimes managed by theatre admin. Updates sync directly to user booking page.</p>

            <div className="space-y-4 pt-2">
              {merchantServices.map((movie) => (
                <div key={movie.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex gap-4">
                  {movie.moviePoster ? (
                    <img src={movie.moviePoster} alt={movie.name} className="w-16 h-24 object-cover rounded-lg border border-white/10 shrink-0 shadow-md" />
                  ) : (
                    <div className="w-16 h-24 rounded-lg bg-white/5 border border-dashed border-white/10 flex items-center justify-center shrink-0">
                      <Film size={20} className="text-slate-600" />
                    </div>
                  )}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-xs text-white truncate">{movie.name}</h3>
                      <span className="text-[9px] uppercase font-black text-[#fceea7] bg-[#8b6508]/15 border border-[#8b6508]/20 px-2 py-0.5 rounded-full shrink-0">
                        {movie.movieRating || 'UA'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-1">
                      <div>Language: <span className="text-white font-medium">{movie.movieLanguage || 'English'}</span></div>
                      <div>Hall / Audi: <span className="text-[#d4af37] font-medium">{movie.hallNumber || 'Screen 1'}</span></div>
                      <div>Runtime: <span className="text-white font-medium">{movie.duration} mins</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(movie.movieShowtimes || '10:00 AM, 02:00 PM').split(',').map((st: string) => (
                        <span key={st} className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">{st.trim()}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {merchantServices.length === 0 && (
                <div className="text-center py-10 rounded-xl border border-dashed border-white/5 text-slate-500 text-xs">
                  No movies in schedule. Use Catalog Manager to add movies.
                </div>
              )}
            </div>
          </div>

          {/* Quick Movie Updater */}
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#d4af37]" /> Update Movie Posters & Details
            </h2>
            <p className="text-[11px] text-slate-400">Quickly select a movie to update its poster URL, showtimes, and hall assignments.</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editMovieId) return;
              const target = services.find(s => s.id === editMovieId);
              if (target) {
                updateService({
                  ...target,
                  moviePoster: moviePosterInput || target.moviePoster,
                  movieShowtimes: movieShowtimesInput || target.movieShowtimes,
                  movieRating: movieRatingInput || target.movieRating,
                  movieLanguage: movieLanguageInput || target.movieLanguage,
                  hallNumber: movieHallInput || target.hallNumber
                });
                alert('Movie details updated successfully!');
              }
            }} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Select Movie</label>
                <select
                  value={editMovieId}
                  onChange={(e) => {
                    setEditMovieId(e.target.value);
                    const sel = services.find(s => s.id === e.target.value);
                    if (sel) {
                      setMoviePosterInput(sel.moviePoster || '');
                      setMovieShowtimesInput(sel.movieShowtimes || '');
                      setMovieRatingInput(sel.movieRating || 'UA');
                      setMovieLanguageInput(sel.movieLanguage || 'English');
                      setMovieHallInput(sel.hallNumber || 'Screen 1');
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
                  required
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">-- Choose Movie --</option>
                  {merchantServices.map(m => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">{m.name}</option>
                  ))}
                </select>
              </div>

              {editMovieId && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Poster Image URL</label>
                    <input
                      type="url"
                      value={moviePosterInput}
                      onChange={(e) => setMoviePosterInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Showtimes (comma-separated)</label>
                    <input
                      type="text"
                      value={movieShowtimesInput}
                      onChange={(e) => setMovieShowtimesInput(e.target.value)}
                      placeholder="e.g. 10:00 AM, 02:00 PM"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Rating</label>
                      <select
                        value={movieRatingInput}
                        onChange={(e) => setMovieRatingInput(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#d4af37] bg-slate-900"
                      >
                        <option value="U">U</option>
                        <option value="UA">UA</option>
                        <option value="A">A</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Hall Assignment</label>
                      <input
                        type="text"
                        value={movieHallInput}
                        onChange={(e) => setMovieHallInput(e.target.value)}
                        placeholder="e.g. Screen 1"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#8b6508] to-[#d4af37] hover:brightness-105 transition-all shadow-md cursor-pointer mt-2"
                  >
                    Save Movie Parameters
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {getVerticalFromCategory(currentMerchant.category) === 'Wellness' && (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Room & Treatment Schedule */}
          <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#d4af37]" /> Spa Therapy Suite Status
            </h2>
            <p className="text-[11px] text-slate-400">Live room occupancy and assigned therapist details. Cross-check room ventilation and oils setup before clients check-in.</p>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { id: 'Room A (Lotus)', status: 'Occupied', therapist: 'Ananya Sen', client: 'Karan Johar' },
                { id: 'Room B (Orchid)', status: 'Occupied', therapist: 'Michael Chang', client: 'Mira Rajput' },
                { id: 'Room C (Zen)', status: 'Available', therapist: 'None', client: 'None' },
                { id: 'Sauna Suite', status: 'Completed', therapist: 'David Raj', client: 'Arjun Kapoor' }
              ].map((room) => {
                const isOccupied = room.status === 'Occupied';
                const isCompleted = room.status === 'Completed';
                const bgClass = isOccupied 
                  ? 'border-[#8b6508]/30 bg-[#8b6508]/5 text-white' 
                  : isCompleted 
                  ? 'border-emerald-500/10 bg-emerald-500/5 text-slate-300' 
                  : 'border-white/5 bg-white/[0.02] text-slate-500';
                return (
                  <div key={room.id} className={`p-4 rounded-xl border space-y-2 ${bgClass}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xs">{room.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${isOccupied ? 'bg-[#8b6508]/20 text-[#fceea7]' : isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                        {room.status}
                      </span>
                    </div>
                    {room.client !== 'None' && (
                      <div className="text-[10px] space-y-0.5 text-slate-400">
                        <div>Client: <strong className="text-white">{room.client}</strong></div>
                        <div>Therapist: <strong className="text-[#d4af37]">{room.therapist}</strong></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Client Aroma Oils & Preferences */}
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.01] p-6 space-y-4">
            <h2 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-[#d4af37]" /> Aromatherapy preferences
            </h2>
            <p className="text-[11px] text-slate-400">Essential aromatic oils and massage therapy options requested by booked clients.</p>
            
            <div className="space-y-3 pt-2 divide-y divide-white/5">
              {merchantBookings.map((b) => (
                <div key={b.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-white">{b.customerName}</span>
                    <span className="text-[9px] font-mono text-[#fceea7] bg-[#8b6508]/15 px-2 py-0.5 rounded border border-[#8b6508]/25">{b.time}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    <div>Oil: <strong className="text-white">{b.aromaOil || 'Lavender'}</strong></div>
                    <div>Therapy: <strong className="text-slate-300">{b.massageType || 'Swedish Relaxation'}</strong></div>
                  </div>
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
            <Calendar size={16} className="text-[#d4af37]" /> Recent Reservation Logs
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
                    <div className="h-6 w-6 rounded-full bg-[#8b6508]/10 border border-[#8b6508]/20 text-[#fceea7] flex items-center justify-center font-bold text-[10px]">{b.customerName[0]}</div>
                    {b.customerName}
                  </td>
                  <td className="p-3.5">{b.serviceName}</td>
                  <td className="p-3.5 text-slate-400">{b.date} · <span className="text-[#d4af37] font-medium">{b.time}</span></td>
                  <td className="p-3.5 text-right font-bold text-white">₹{b.amount}</td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                      b.status === 'CONFIRMED'
                        ? 'bg-[#8b6508]/15 text-[#fceea7] border border-[#8b6508]/30'
                        : b.status === 'CHECKED_IN'
                        ? 'bg-[#0a3161]/20 text-[#9cc3f5] border border-[#0a3161]/30'
                        : b.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
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
