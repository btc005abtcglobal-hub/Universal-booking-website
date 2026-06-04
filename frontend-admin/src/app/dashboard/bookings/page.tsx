'use client';

import { useVendorStore, PersistedBooking, Prescription, DietPlan, WorkoutExercise } from '../../../lib/store';
import { getVerticalFromCategory } from '../../../lib/categoryUtils';
import { 
  Search, Filter, Clock, CheckCircle2, XCircle, ChevronRight, 
  User, Mail, Phone, FileText, ArrowLeft, Upload, Trash2, Plus, 
  Save, Activity, Dumbbell, Scissors, Utensils, AlertTriangle, ShieldCheck, Flame
} from 'lucide-react';
import { useState } from 'react';

const colors: Record<string, string> = {
  CONFIRMED: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  CHECKED_IN: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  COMPLETED: 'bg-green-500/10 text-green-400 border border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20'
};

export default function BookingsPage() {
  const { 
    currentMerchant, bookings, checkInBooking, completeBooking, cancelBooking,
    uploadReport, deleteReport, savePrescription, assignDiet, saveWorkout,
    saveStylingDetails, uploadBeforeAfterPhoto, assignTable, saveDietaryAlerts
  } = useVendorStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: ''
  });

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // File upload simulator state
  const [uploadingReport, setUploadingReport] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [reportFileName, setReportFileName] = useState<string>('');

  // Before/after photo simulator state
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [photoProgress, setPhotoProgress] = useState<number>(0);

  // Local Form state for Prescription
  const [diagInput, setDiagInput] = useState('');
  const [medsList, setMedsList] = useState<{ name: string; dosage: string; duration: string }[]>([
    { name: '', dosage: '', duration: '' }
  ]);

  // Local Form state for Diet Plan
  const [proteinInput, setProteinInput] = useState(120);
  const [carbsInput, setCarbsInput] = useState(150);
  const [fatsInput, setFatsInput] = useState(50);
  const [dietTypeInput, setDietTypeInput] = useState('High Protein Deficit');

  // Local Form state for Workout Exercises
  const [workoutList, setWorkoutList] = useState<WorkoutExercise[]>([
    { name: '', sets: 3, reps: 10, weightLbs: 20 }
  ]);

  // Local Form state for Salon Styling details
  const [stylistAssignedInput, setStylistAssignedInput] = useState('');
  const [hairTypeInput, setHairTypeInput] = useState('');
  const [skinTypeInput, setSkinTypeInput] = useState('');
  const [stylingNotesInput, setStylingNotesInput] = useState('');

  // Local Form state for Table Assignment & Dietary alerts
  const [tableInput, setTableInput] = useState('');
  const [dietaryInput, setDietaryInput] = useState<string[]>([]);
  const [newDietaryTag, setNewDietaryTag] = useState('');

  if (!currentMerchant) {
    return <div className="text-center text-slate-500">Loading bookings session...</div>;
  }

  // Filter bookings for this merchant
  const merchantBookings = bookings.filter(
    (b) => b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );

  const filteredBookings = merchantBookings.filter((b) => {
    const matchesSearch = 
      b.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);

  // Initialize form values when opening the drawer
  const handleOpenDrawer = (booking: PersistedBooking) => {
    setSelectedBookingId(booking.id);
    
    // Initialise prescription if exists
    if (booking.prescription) {
      setDiagInput(booking.prescription.diagnosis);
      setMedsList(booking.prescription.medications);
    } else {
      setDiagInput('');
      setMedsList([{ name: '', dosage: '', duration: '' }]);
    }

    // Initialise diet plan if exists
    if (booking.dietPlan) {
      setProteinInput(booking.dietPlan.protein);
      setCarbsInput(booking.dietPlan.carbs);
      setFatsInput(booking.dietPlan.fats);
      setDietTypeInput(booking.dietPlan.dietType);
    } else {
      setProteinInput(120);
      setCarbsInput(150);
      setFatsInput(50);
      setDietTypeInput('Balanced Nutrition');
    }

    // Initialise workout if exists
    if (booking.workoutPlan && booking.workoutPlan.length > 0) {
      setWorkoutList(booking.workoutPlan);
    } else {
      setWorkoutList([{ name: '', sets: 3, reps: 10, weightLbs: 20 }]);
    }

    // Initialise Salon inputs
    setStylistAssignedInput(booking.stylistAssigned || '');
    setHairTypeInput(booking.hairType || '');
    setSkinTypeInput(booking.skinType || '');
    setStylingNotesInput(booking.stylingNotes || '');

    // Initialise Dining inputs
    setTableInput(booking.tableNumber || '');
    setDietaryInput(booking.dietaryRestrictions || []);
    setNewDietaryTag('');
  };

  // Simulated Medical Report Upload Handler
  const triggerReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedBookingId) return;
    const file = e.target.files[0];
    setReportFileName(file.name);
    setUploadingReport(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          uploadReport(selectedBookingId, file.name);
          setUploadingReport(false);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Simulated Salon Photo Upload Handler
  const triggerPhotoUpload = () => {
    if (!selectedBookingId) return;
    setUploadingPhoto(true);
    setPhotoProgress(0);

    const interval = setInterval(() => {
      setPhotoProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const randomSeed = Math.floor(Math.random() * 1000);
          uploadBeforeAfterPhoto(selectedBookingId, String(randomSeed));
          setUploadingPhoto(false);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  // Save Prescription Handler
  const handleSavePrescription = () => {
    if (!selectedBookingId) return;
    const filteredMeds = medsList.filter(m => m.name.trim() !== '');
    const newPrescription: Prescription = {
      diagnosis: diagInput.trim() || 'General diagnosis checked.',
      medications: filteredMeds,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    savePrescription(selectedBookingId, newPrescription);
    showToast('Digital prescription saved and synced with patient log.');
  };

  // Save Diet Plan Handler
  const handleSaveDiet = () => {
    if (!selectedBookingId) return;
    const newDiet: DietPlan = {
      protein: proteinInput,
      carbs: carbsInput,
      fats: fatsInput,
      dietType: dietTypeInput,
      assignedAt: new Date().toISOString().substring(0, 10)
    };
    assignDiet(selectedBookingId, newDiet);
    showToast('Caloric macronutrient sheets assigned to athlete.');
  };

  // Save Workout Handler
  const handleSaveWorkout = () => {
    if (!selectedBookingId) return;
    const filteredWorkouts = workoutList.filter(w => w.name.trim() !== '');
    saveWorkout(selectedBookingId, filteredWorkouts);
    showToast('Active workout exercises saved to client profile.');
  };

  // Save Salon Styling Details Handler
  const handleSaveSalonDetails = () => {
    if (!selectedBookingId) return;
    saveStylingDetails(selectedBookingId, {
      stylist: stylistAssignedInput,
      hairType: hairTypeInput,
      skinType: skinTypeInput,
      stylingNotes: stylingNotesInput
    });
    showToast('Styling preference cards updated.');
  };

  // Save Dining Table & Dietary Restrictions
  const handleSaveDiningDetails = () => {
    if (!selectedBookingId) return;
    assignTable(selectedBookingId, tableInput);
    saveDietaryAlerts(selectedBookingId, dietaryInput);
    showToast('Dining seating and kitchen dietary alerts saved.');
  };

  // Helpers to append arrays in forms
  const addMedicationRow = () => {
    setMedsList([...medsList, { name: '', dosage: '', duration: '' }]);
  };

  const addWorkoutRow = () => {
    setWorkoutList([...workoutList, { name: '', sets: 3, reps: 10, weightLbs: 20 }]);
  };

  const addDietaryTag = () => {
    if (newDietaryTag.trim() && !dietaryInput.includes(newDietaryTag.trim())) {
      setDietaryInput([...dietaryInput, newDietaryTag.trim()]);
      setNewDietaryTag('');
    }
  };

  return (
    <div className="relative min-h-full">
      {/* Animated Success Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-[#0e1616] px-4 py-3 text-xs font-bold text-emerald-400 shadow-2xl animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Bookings Log Console
          </h1>
          <p className="text-xs text-slate-400">View real-time customer schedules, modify parameters, and manage reports.</p>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, ref code, or service..." 
              className="w-full rounded-xl border border-white/10 bg-[#090d16]/30 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors" 
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#090d16] px-4 py-2.5 text-xs font-bold text-slate-400 outline-none focus:border-indigo-500"
          >
            <option value="ALL">Status: All Bookings</option>
            <option value="CONFIRMED">Status: Confirmed</option>
            <option value="CHECKED_IN">Status: Checked In</option>
            <option value="COMPLETED">Status: Completed</option>
            <option value="CANCELLED">Status: Cancelled</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase font-bold tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Reference</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Requested Service</th>
                <th className="px-5 py-3.5">Date & Slot</th>
                <th className="px-5 py-3.5 text-right">Price</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredBookings.map((b) => (
                <tr 
                  key={b.id} 
                  className={`hover:bg-white/[0.01] transition-colors cursor-pointer ${selectedBookingId === b.id ? 'bg-indigo-500/5' : ''}`}
                  onClick={() => handleOpenDrawer(b)}
                >
                  <td className="px-5 py-4 font-mono font-bold text-white">{b.ref}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">{b.customerName[0]}</div>
                      <div>
                        <div className="font-bold text-white">{b.customerName}</div>
                        <div className="text-[10px] text-slate-500">{b.customerPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{b.serviceName}</td>
                  <td className="px-5 py-4 text-slate-400">
                    <div>{b.date}</div>
                    <div className="text-[10px] text-indigo-400 font-bold mt-0.5">{b.time}</div>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-white">₹{b.amount}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-black tracking-wide ${colors[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status === 'CONFIRMED' && (
                        <>
                          <button 
                            onClick={() => checkInBooking(b.id)}
                            className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 px-2 py-1 font-bold text-[9px] uppercase cursor-pointer"
                          >
                            Check In
                          </button>
                          <button 
                            onClick={() => cancelBooking(b.id)}
                            className="rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 px-2 py-1 font-bold text-[9px] uppercase cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {b.status === 'CHECKED_IN' && (
                        <button 
                          onClick={() => completeBooking(b.id)}
                          className="rounded-lg border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 px-2 py-1 font-bold text-[9px] uppercase cursor-pointer"
                        >
                          Complete
                        </button>
                      )}
                      <button 
                        onClick={() => handleOpenDrawer(b)}
                        className="rounded-lg p-1.5 hover:bg-white/5 text-slate-400 hover:text-white"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-500 italic">No reservation records match your parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Detail Side Drawer */}
      {selectedBooking && (
        <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[500px] bg-[#0b101e] border-l border-white/5 shadow-2xl flex flex-col justify-between animate-slide-in">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-white/5 px-6 shrink-0 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedBookingId(null)}
                className="p-1.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm text-white">Client File Log</h3>
                <span className="text-[10px] font-mono text-indigo-400">{selectedBooking.ref}</span>
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${colors[selectedBooking.status]}`}>
              {selectedBooking.status}
            </span>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Customer Basic Contact Card */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {selectedBooking.customerName[0]}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white leading-tight">{selectedBooking.customerName}</h4>
                  <span className="text-[10px] text-indigo-400 font-semibold">{selectedBooking.serviceName}</span>
                </div>
              </div>

              <div className="grid gap-2 border-t border-white/5 pt-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-slate-500 shrink-0" />
                  <span>{selectedBooking.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-slate-500 shrink-0" />
                  <span>{selectedBooking.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-slate-500 shrink-0" />
                  <span>Scheduled: {selectedBooking.date} at <strong>{selectedBooking.time}</strong></span>
                </div>
              </div>
            </div>

            {/* INDUSTRY SPECIFIC INTERACTIVE MODULES */}
            
            {/* 1. MEDICAL / DOCTOR CLINICAL MODULE */}
            {getVerticalFromCategory(currentMerchant.category) === 'Dental' && (
              <div className="space-y-6">
                
                {/* Vitals Summary Card */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block flex items-center gap-1.5">
                    <Activity size={12} className="text-sky-400" /> Patient Vitals Checked
                  </label>
                  {selectedBooking.vitals ? (
                    <div className="grid grid-cols-4 gap-2 text-center p-3.5 rounded-xl border border-white/5 bg-[#090d16]/30">
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase font-black">BP</div>
                        <div className="text-[11px] font-bold text-white mt-0.5">{selectedBooking.vitals.bp}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase font-black">Temp</div>
                        <div className="text-[11px] font-bold text-white mt-0.5">{selectedBooking.vitals.temp}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase font-black">Pulse</div>
                        <div className="text-[11px] font-bold text-white mt-0.5">{selectedBooking.vitals.pulse}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase font-black">O2</div>
                        <div className="text-[11px] font-bold text-emerald-400 mt-0.5">{selectedBooking.vitals.oxygen}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 italic p-3 border border-dashed border-white/5 rounded-xl text-center">No vital records logged for this session.</div>
                  )}
                </div>

                {/* Patient Symptoms and Notes */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Symptoms / Chief Complaints</label>
                  <div className="p-3.5 rounded-xl border border-white/5 bg-[#090d16]/20 text-slate-300 text-xs italic">
                    "{selectedBooking.symptoms || 'No critical symptoms logged yet.'}"
                  </div>
                </div>

                {/* Reports Upload Simulator */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block flex items-center justify-between">
                    <span>Clinical Reports & X-Rays ({selectedBooking.medicalReports?.length || 0})</span>
                    <span className="text-[9px] text-indigo-400 capitalize font-bold">Simulator active</span>
                  </label>

                  <div className="space-y-2">
                    {selectedBooking.medicalReports && selectedBooking.medicalReports.length > 0 ? (
                      selectedBooking.medicalReports.map((r) => (
                        <div key={r.id} className="flex justify-between items-center p-2.5 rounded-xl border border-white/5 bg-[#090d16]/30 text-xs">
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate">{r.name}</div>
                            <div className="text-[9px] text-slate-500 mt-0.5">Uploaded: {r.uploadedAt}</div>
                          </div>
                          <button 
                            onClick={() => deleteReport(selectedBooking.id, r.id)}
                            className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-slate-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-[10px] text-slate-500 italic p-4 border border-dashed border-white/5 rounded-xl text-center">No clinical reports uploaded.</div>
                    )}
                  </div>

                  {/* Upload Simulator Container */}
                  <div className="relative border-2 border-dashed border-white/5 hover:border-indigo-500/30 rounded-xl p-4 transition-colors">
                    <input 
                      type="file" 
                      id="report-file-input" 
                      onChange={triggerReportUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploadingReport}
                    />
                    {uploadingReport ? (
                      <div className="space-y-2 text-center">
                        <div className="text-[10px] text-indigo-400 font-bold animate-pulse">Uploading {reportFileName}...</div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-[10px] text-slate-500 flex flex-col items-center justify-center gap-1.5">
                        <Upload size={16} className="text-slate-400" />
                        <span>Drag & drop or <strong className="text-indigo-400">browse file</strong> to upload x-ray scans or reports</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Digital Prescription Writer */}
                <div className="space-y-4 border-t border-white/5 pt-5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block flex items-center gap-1.5">
                    <FileText size={12} className="text-indigo-400" /> Digital Prescription Writer
                  </label>

                  <div className="space-y-3 bg-[#090d16]/30 border border-white/5 p-4 rounded-xl">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Diagnosis Summary:</span>
                      <input 
                        type="text"
                        placeholder="e.g. Acute apical periodontitis (Tooth 36)"
                        value={diagInput}
                        onChange={(e) => setDiagInput(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white placeholder-slate-700 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 flex justify-between">
                        <span>Medications list:</span>
                        <button onClick={addMedicationRow} className="text-[9px] text-indigo-400 font-bold flex items-center gap-0.5 hover:underline">
                          <Plus size={10} /> Add medicine
                        </button>
                      </span>

                      <div className="space-y-2">
                        {medsList.map((m, idx) => (
                          <div key={idx} className="grid grid-cols-3 gap-2">
                            <input 
                              type="text"
                              placeholder="Medicine"
                              value={m.name}
                              onChange={(e) => {
                                const newMeds = [...medsList];
                                newMeds[idx].name = e.target.value;
                                setMedsList(newMeds);
                              }}
                              className="rounded-lg border border-white/10 bg-[#090d16] px-2 py-1.5 text-xs text-white placeholder-slate-700 outline-none"
                            />
                            <input 
                              type="text"
                              placeholder="Dosage (e.g. 1-0-1)"
                              value={m.dosage}
                              onChange={(e) => {
                                const newMeds = [...medsList];
                                newMeds[idx].dosage = e.target.value;
                                setMedsList(newMeds);
                              }}
                              className="rounded-lg border border-white/10 bg-[#090d16] px-2 py-1.5 text-xs text-white placeholder-slate-700 outline-none"
                            />
                            <input 
                              type="text"
                              placeholder="Duration"
                              value={m.duration}
                              onChange={(e) => {
                                const newMeds = [...medsList];
                                newMeds[idx].duration = e.target.value;
                                setMedsList(newMeds);
                              }}
                              className="rounded-lg border border-white/10 bg-[#090d16] px-2 py-1.5 text-xs text-white placeholder-slate-700 outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleSavePrescription}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
                    >
                      <Save size={13} /> Save Prescription & Send
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 2. FITNESS MODULE */}
            {getVerticalFromCategory(currentMerchant.category) === 'Fitness' && (
              <div className="space-y-6">
                
                {/* Fitness Goal */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Member Goal Statement</label>
                  <div className="p-3.5 rounded-xl border border-white/5 bg-[#090d16]/20 text-slate-300 text-xs italic">
                    "{selectedBooking.fitnessGoal || 'No goal statement registered yet.'}"
                  </div>
                </div>

                {/* Calorie Macro Configurer */}
                <div className="space-y-3 border-t border-white/5 pt-5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block flex items-center gap-1.5">
                    <Flame size={12} className="text-orange-400" /> Caloric & Macronutrient Split
                  </label>

                  <div className="space-y-3 bg-[#090d16]/30 border border-white/5 p-4 rounded-xl">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Dietary/Calorie Plan Type:</span>
                      <input 
                        type="text"
                        placeholder="e.g. Keto Plan, Caloric Deficit"
                        value={dietTypeInput}
                        onChange={(e) => setDietTypeInput(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-red-400">Protein (g):</span>
                        <input 
                          type="number" 
                          value={proteinInput} 
                          onChange={(e) => setProteinInput(parseInt(e.target.value) || 0)}
                          className="w-full rounded-lg border border-white/10 bg-[#090d16] px-2 py-1.5 text-xs text-white text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-yellow-400">Carbs (g):</span>
                        <input 
                          type="number" 
                          value={carbsInput} 
                          onChange={(e) => setCarbsInput(parseInt(e.target.value) || 0)}
                          className="w-full rounded-lg border border-white/10 bg-[#090d16] px-2 py-1.5 text-xs text-white text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-emerald-400">Fats (g):</span>
                        <input 
                          type="number" 
                          value={fatsInput} 
                          onChange={(e) => setFatsInput(parseInt(e.target.value) || 0)}
                          className="w-full rounded-lg border border-white/10 bg-[#090d16] px-2 py-1.5 text-xs text-white text-center"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveDiet}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                    >
                      <Save size={13} /> Update Nutrition Sheet
                    </button>
                  </div>
                </div>

                {/* Workout Planner */}
                <div className="space-y-4 border-t border-white/5 pt-5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Dumbbell size={12} className="text-indigo-400" /> Daily Workout Assignment</span>
                    <button onClick={addWorkoutRow} className="text-[9px] text-indigo-400 font-bold flex items-center gap-0.5 hover:underline">
                      <Plus size={10} /> Add exercise
                    </button>
                  </label>

                  <div className="space-y-3 bg-[#090d16]/30 border border-white/5 p-4 rounded-xl">
                    <div className="space-y-2">
                      {workoutList.map((w, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-2">
                          <input 
                            type="text"
                            placeholder="Exercise name"
                            value={w.name}
                            onChange={(e) => {
                              const newList = [...workoutList];
                              newList[idx].name = e.target.value;
                              setWorkoutList(newList);
                            }}
                            className="col-span-2 rounded-lg border border-white/10 bg-[#090d16] px-2 py-1.5 text-xs text-white outline-none"
                          />
                          <input 
                            type="number"
                            placeholder="Sets"
                            value={w.sets}
                            onChange={(e) => {
                              const newList = [...workoutList];
                              newList[idx].sets = parseInt(e.target.value) || 0;
                              setWorkoutList(newList);
                            }}
                            className="rounded-lg border border-white/10 bg-[#090d16] px-2 py-1.5 text-xs text-white text-center outline-none"
                          />
                          <input 
                            type="number"
                            placeholder="Reps"
                            value={w.reps}
                            onChange={(e) => {
                              const newList = [...workoutList];
                              newList[idx].reps = parseInt(e.target.value) || 0;
                              setWorkoutList(newList);
                            }}
                            className="rounded-lg border border-white/10 bg-[#090d16] px-2 py-1.5 text-xs text-white text-center outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleSaveWorkout}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                    >
                      <Save size={13} /> Update Daily Workout Card
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 3. BEAUTY SALON MODULE */}
            {getVerticalFromCategory(currentMerchant.category) === 'Salon' && (
              <div className="space-y-6">
                
                {/* Styling preferences and parameters */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block flex items-center gap-1.5">
                    <Scissors size={12} className="text-rose-400" /> Styling Preference Details
                  </label>

                  <div className="space-y-3 bg-[#090d16]/30 border border-white/5 p-4 rounded-xl">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500">Hair Profile:</span>
                        <input 
                          type="text"
                          placeholder="e.g. Curly, dry, fine"
                          value={hairTypeInput}
                          onChange={(e) => setHairTypeInput(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500">Skin/Scalp Profile:</span>
                        <input 
                          type="text"
                          placeholder="e.g. Sensitive scalp, oily"
                          value={skinTypeInput}
                          onChange={(e) => setSkinTypeInput(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Assigned Senior Stylist:</span>
                      <input 
                        type="text"
                        placeholder="e.g. Vikram Singh"
                        value={stylistAssignedInput}
                        onChange={(e) => setStylistAssignedInput(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Styling Instructions Notes:</span>
                      <textarea 
                        rows={3}
                        placeholder="Type preferences, product requests, etc."
                        value={stylingNotesInput}
                        onChange={(e) => setStylingNotesInput(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white outline-none resize-none"
                      />
                    </div>

                    <button 
                      onClick={handleSaveSalonDetails}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                    >
                      <Save size={13} /> Update Stylist Card
                    </button>
                  </div>
                </div>

                {/* Before/After gallery simulator */}
                <div className="space-y-3 border-t border-white/5 pt-5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Before/After Haircuts Work Gallery</label>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {selectedBooking.beforeAfterGallery && selectedBooking.beforeAfterGallery.length > 0 ? (
                      selectedBooking.beforeAfterGallery.map((url, idx) => (
                        <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden relative h-20">
                          <img src={url} alt="Before/After Cut" className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-6 border border-dashed border-white/5 rounded-xl text-slate-500 text-[10px]">No pictures added yet.</div>
                    )}
                  </div>

                  <button 
                    onClick={triggerPhotoUpload}
                    disabled={uploadingPhoto}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] py-2 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={13} />
                    {uploadingPhoto ? `Processing photo (${photoProgress}%)` : 'Add Before/After Photo (Simulator)'}
                  </button>
                </div>

              </div>
            )}

            {/* 4. FINE DINING MODULE */}
            {getVerticalFromCategory(currentMerchant.category) === 'Dining' && (
              <div className="space-y-6">
                
                {/* Table assignment and dietary restrictions */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block flex items-center gap-1.5">
                    <Utensils size={12} className="text-fuchsia-400" /> Table & Seating Management
                  </label>

                  <div className="space-y-3 bg-[#090d16]/30 border border-white/5 p-4 rounded-xl">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Seat Count (Covers):</span>
                      <div className="p-2.5 rounded-lg bg-[#090d16] border border-white/10 text-xs text-white font-bold">
                        {selectedBooking.seatCount || 2} covers
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Assign Dining Table:</span>
                      <select 
                        value={tableInput}
                        onChange={(e) => setTableInput(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white outline-none"
                      >
                        <option value="">Choose Available Table</option>
                        <option value="Table 1 (2 Seats)">Table 1 (2 Seats)</option>
                        <option value="Table 4 (Window Seat)">Table 4 (Window Seat - 4 Seats)</option>
                        <option value="Table 5 (4 Seats)">Table 5 (4 Seats)</option>
                        <option value="Table 8 (2 Seats)">Table 8 (2 Seats)</option>
                        <option value="Table 10 (4 Seats)">Table 10 (4 Seats)</option>
                        <option value="Table 12 (Corner Altar)">Table 12 (Corner Altar - 2 Seats)</option>
                      </select>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 flex justify-between">
                        <span>Kitchen Dietary Alert Tags:</span>
                        <button onClick={addDietaryTag} className="text-[9px] text-fuchsia-400 font-bold hover:underline flex items-center gap-0.5">
                          <Plus size={10} /> Add Alert
                        </button>
                      </span>

                      <div className="flex flex-wrap gap-1.5">
                        {dietaryInput.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 text-[10px] font-bold">
                            <span>{tag}</span>
                            <button 
                              onClick={() => setDietaryInput(dietaryInput.filter(t => t !== tag))}
                              className="hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="e.g. Gluten-Free"
                          value={newDietaryTag}
                          onChange={(e) => setNewDietaryTag(e.target.value)}
                          className="flex-1 rounded-lg border border-white/10 bg-[#090d16] px-2.5 py-1 text-xs text-white placeholder-slate-700 outline-none"
                        />
                        <button 
                          onClick={addDietaryTag}
                          className="rounded-lg bg-white/5 hover:bg-white/10 px-3 text-xs text-white font-bold"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveDiningDetails}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                    >
                      <Save size={13} /> Save Dining Allocations
                    </button>
                  </div>
                </div>

                {/* Pre-ordered degustation courses */}
                <div className="space-y-3 border-t border-white/5 pt-5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block flex items-center gap-1.5">
                    <FileText size={12} className="text-slate-400" /> Pre-ordered Degustation Courses
                  </label>
                  <div className="space-y-2 bg-[#090d16]/30 border border-white/5 p-4 rounded-xl text-xs">
                    {selectedBooking.preOrderedCourses && selectedBooking.preOrderedCourses.length > 0 ? (
                      selectedBooking.preOrderedCourses.map((c, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-slate-300">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-[10px] text-slate-500 italic">No courses were pre-ordered for this dining booking.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* General Administrative Overrides (Actions) */}
            <div className="space-y-2 border-t border-white/5 pt-5">
              <label className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">General Override Logs</label>
              <div className="flex gap-2">
                {selectedBooking.status === 'CONFIRMED' && (
                  <>
                    <button 
                      onClick={() => { checkInBooking(selectedBooking.id); setSelectedBookingId(null); }}
                      className="flex-1 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 py-2 text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Check In Customer
                    </button>
                    <button 
                      onClick={() => { cancelBooking(selectedBooking.id); setSelectedBookingId(null); }}
                      className="flex-1 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 py-2 text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
                {selectedBooking.status === 'CHECKED_IN' && (
                  <button 
                    onClick={() => { completeBooking(selectedBooking.id); setSelectedBookingId(null); }}
                    className="w-full rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-400 py-2.5 text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Complete Clinical Session
                  </button>
                )}
                {(selectedBooking.status === 'COMPLETED' || selectedBooking.status === 'CANCELLED') && (
                  <div className="w-full text-center p-3 bg-white/[0.01] border border-white/5 text-[10px] text-slate-500 rounded-xl italic">
                    Administrative Lock: Session completed or cancelled. No further actions allowed.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Drawer Overlay backdrop */}
      {selectedBooking && (
        <div 
          onClick={() => setSelectedBookingId(null)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        />
      )}
    </div>
  );
}
