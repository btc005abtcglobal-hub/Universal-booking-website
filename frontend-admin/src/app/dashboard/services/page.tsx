'use client';

import { useVendorStore, CatalogService } from '../../../lib/store';
import { getVerticalFromCategory } from '../../../lib/categoryUtils';
import { 
  Plus, Search, Edit, Trash2, Clock, IndianRupee, Star, X, Save, 
  Stethoscope, Dumbbell, Scissors, Utensils, Award, CheckCircle2,
  Film, Ticket, PlaySquare, AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export default function ServicesPage() {
  const { currentMerchant, services, addService, updateService, deleteService } = useVendorStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogService | null>(null);

  // Theatre seats modal state
  const [showSeatsModal, setShowSeatsModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<CatalogService | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [newSelectedSeats, setNewSelectedSeats] = useState<string[]>([]);
  const [bookedSeatsDb, setBookedSeatsDb] = useState<Record<string, string[]>>({
    'svc-m1_10:30 AM': ['A3', 'A4', 'B8', 'B9', 'C11', 'C12', 'E4', 'E5', 'F6', 'H1', 'H2'],
    'svc-m1_02:15 PM': ['C4', 'C5', 'D8', 'E12', 'F1', 'F2', 'F3', 'G10', 'H11'],
    'svc-m1_06:00 PM': ['A1', 'A2', 'B4', 'B5', 'B6', 'C7', 'C8', 'D4', 'D5', 'F12', 'G1', 'G2', 'H5'],
    'svc-m1_09:30 PM': ['B1', 'B2', 'C1', 'C2', 'E8', 'E9', 'H14'],
    'svc-m2_11:00 AM': ['A5', 'B5', 'C5', 'D5', 'E5', 'F5'],
    'svc-m2_04:30 PM': ['D8', 'D9', 'E8', 'E9'],
    'svc-m3_01:30 PM': ['A12', 'B12', 'C12', 'D12'],
  });

  const handleOpenSeats = (movie: CatalogService) => {
    setSelectedMovie(movie);
    const times = (movie.movieShowtimes || '10:30 AM, 02:15 PM, 06:00 PM, 09:30 PM').split(',');
    setSelectedShowtime(times[0].trim());
    setNewSelectedSeats([]);
    setShowSeatsModal(true);
  };

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

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('60');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  // Custom parameters form state
  const [specialization, setSpecialization] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [productsUsed, setProductsUsed] = useState('');
  const [tableCapacity, setTableCapacity] = useState('4');

  // Doctor/Medical specific
  const [doctorName, setDoctorName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  // Fitness specific
  const [trainerName, setTrainerName] = useState('');
  const [classCapacity, setClassCapacity] = useState('25');

  // Salon specific
  const [stylistName, setStylistName] = useState('');
  const [treatmentType, setTreatmentType] = useState('');

  // Dining specific
  const [cuisineType, setCuisineType] = useState('');
  const [seatingSection, setSeatingSection] = useState('Main Dining Hall');

  // Cinema specific
  const [moviePoster, setMoviePoster] = useState('');
  const [movieShowtimes, setMovieShowtimes] = useState('');
  const [movieLanguage, setMovieLanguage] = useState('English');
  const [movieRating, setMovieRating] = useState('UA');
  const [hallNumber, setHallNumber] = useState('Screen 1');

  if (!currentMerchant) {
    return <div className="text-center text-slate-500 py-12">Loading catalog...</div>;
  }

  // Filter services for the current merchant
  const merchantServices = services.filter(
    (s) => s.merchant.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );

  const filteredServices = merchantServices.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const vertical = getVerticalFromCategory(currentMerchant.category);

  const handleOpenAdd = () => {
    setName('');
    setPrice('');
    setDuration(vertical === 'Cinema' ? '120' : '60');
    setDescription('');
    setActive(true);
    setSpecialization('');
    setDifficulty('Intermediate');
    setProductsUsed('');
    setTableCapacity('4');
    
    setDoctorName('');
    setRoomNumber('');
    setTrainerName('');
    setClassCapacity('25');
    setStylistName('');
    setTreatmentType('');
    setCuisineType('');
    setSeatingSection('Main Dining Hall');
    setMoviePoster('');
    setMovieShowtimes('');
    setMovieLanguage('English');
    setMovieRating('UA');
    setHallNumber('Screen 1');

    setShowAddModal(true);
  };

  const handleOpenEdit = (svc: CatalogService) => {
    setEditingItem(svc);
    setName(svc.name);
    setPrice(String(svc.price));
    setDuration(String(svc.duration));
    setDescription(svc.description || '');
    setActive(svc.active);
    
    // Set custom inputs
    setSpecialization(svc.specializationRequired || '');
    setDifficulty(svc.difficultyLevel || 'Intermediate');
    setProductsUsed(svc.productsUsed || '');
    setTableCapacity(String(svc.tableCapacity || 4));
    
    setDoctorName(svc.doctorName || '');
    setRoomNumber(svc.roomNumber || '');
    setTrainerName(svc.trainerName || '');
    setClassCapacity(String(svc.classCapacity || 25));
    setStylistName(svc.stylistName || '');
    setTreatmentType(svc.treatmentType || '');
    setCuisineType(svc.cuisineType || '');
    setSeatingSection(svc.seatingSection || 'Main Dining Hall');
    setMoviePoster(svc.moviePoster || '');
    setMovieShowtimes(svc.movieShowtimes || '');
    setMovieLanguage(svc.movieLanguage || 'English');
    setMovieRating(svc.movieRating || 'UA');
    setHallNumber(svc.hallNumber || 'Screen 1');
    
    setShowEditModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;

    const newSvc: CatalogService = {
      id: `svc-${Date.now()}`,
      name: name.trim(),
      merchant: currentMerchant.merchantName,
      price: parseInt(price) || 0,
      duration: parseInt(duration) || 60,
      category: currentMerchant.category,
      active,
      rating: 5.0,
      bookingsCount: 0,
      description: description.trim() || undefined,

      // Custom attributes mapped by category vertical
      specializationRequired: vertical === 'Dental' ? specialization.trim() : undefined,
      doctorName: vertical === 'Dental' ? doctorName.trim() : undefined,
      roomNumber: vertical === 'Dental' ? roomNumber.trim() : undefined,

      difficultyLevel: vertical === 'Fitness' ? difficulty : undefined,
      trainerName: vertical === 'Fitness' ? trainerName.trim() : undefined,
      classCapacity: vertical === 'Fitness' ? parseInt(classCapacity) || 25 : undefined,

      productsUsed: vertical === 'Salon' ? productsUsed.trim() : undefined,
      stylistName: vertical === 'Salon' ? stylistName.trim() : undefined,
      treatmentType: vertical === 'Salon' ? treatmentType.trim() : undefined,

      tableCapacity: vertical === 'Dining' ? parseInt(tableCapacity) || 4 : undefined,
      cuisineType: vertical === 'Dining' ? cuisineType.trim() : undefined,
      seatingSection: vertical === 'Dining' ? seatingSection : undefined,

      moviePoster: vertical === 'Cinema' ? moviePoster.trim() : undefined,
      movieShowtimes: vertical === 'Cinema' ? movieShowtimes.trim() : undefined,
      movieLanguage: vertical === 'Cinema' ? movieLanguage : undefined,
      movieRating: vertical === 'Cinema' ? movieRating : undefined,
      hallNumber: vertical === 'Cinema' ? hallNumber.trim() : undefined,
    };

    addService(newSvc);
    setShowAddModal(false);
    showToast(`${vertical === 'Cinema' ? 'Movie' : 'Service'} "${newSvc.name}" added successfully.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !name.trim() || !price.trim()) return;

    const updatedSvc: CatalogService = {
      ...editingItem,
      name: name.trim(),
      price: parseInt(price) || 0,
      duration: parseInt(duration) || 60,
      active,
      description: description.trim() || undefined,

      // Custom attributes mapped by category vertical
      specializationRequired: vertical === 'Dental' ? specialization.trim() : undefined,
      doctorName: vertical === 'Dental' ? doctorName.trim() : undefined,
      roomNumber: vertical === 'Dental' ? roomNumber.trim() : undefined,

      difficultyLevel: vertical === 'Fitness' ? difficulty : undefined,
      trainerName: vertical === 'Fitness' ? trainerName.trim() : undefined,
      classCapacity: vertical === 'Fitness' ? parseInt(classCapacity) || 25 : undefined,

      productsUsed: vertical === 'Salon' ? productsUsed.trim() : undefined,
      stylistName: vertical === 'Salon' ? stylistName.trim() : undefined,
      treatmentType: vertical === 'Salon' ? treatmentType.trim() : undefined,

      tableCapacity: vertical === 'Dining' ? parseInt(tableCapacity) || 4 : undefined,
      cuisineType: vertical === 'Dining' ? cuisineType.trim() : undefined,
      seatingSection: vertical === 'Dining' ? seatingSection : undefined,

      moviePoster: vertical === 'Cinema' ? moviePoster.trim() : undefined,
      movieShowtimes: vertical === 'Cinema' ? movieShowtimes.trim() : undefined,
      movieLanguage: vertical === 'Cinema' ? movieLanguage : undefined,
      movieRating: vertical === 'Cinema' ? movieRating : undefined,
      hallNumber: vertical === 'Cinema' ? hallNumber.trim() : undefined,
    };

    updateService(updatedSvc);
    setShowEditModal(false);
    setEditingItem(null);
    showToast(`${vertical === 'Cinema' ? 'Movie' : 'Service'} "${updatedSvc.name}" updated successfully.`);
  };

  const handleDelete = (id: string) => {
    const targetSvc = services.find(s => s.id === id);
    const label = vertical === 'Cinema' ? 'movie' : 'service';
    if (confirm(`Are you sure you want to delete this ${label} listing from your catalog?`)) {
      deleteService(id);
      showToast(`${vertical === 'Cinema' ? 'Movie' : 'Service'} "${targetSvc?.name || 'Listing'}" removed.`);
    }
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
      
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {vertical === 'Cinema' ? 'Movies Catalog Manager' : 'Services Catalog'}
          </h1>
          <p className="text-xs text-slate-400">
            {vertical === 'Cinema' 
              ? 'Add active movies, assign screens, certify age limits, set ticket pricing, and configure runtime.'
              : 'Configure prices, treatment/session durations, and industry-specific catalog tags.'
            }
          </p>
        </div>
        
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b6508] to-[#d4af37] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:from-[#664a05] hover:to-[#8b6508] transition-all cursor-pointer"
        >
          <Plus size={14} /> 
          {vertical === 'Cinema' ? 'Add New Movie' : 'Add Service Listing'}
        </button>
      </div>

      {/* Filter and Table */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={vertical === 'Cinema' ? 'Search movies in schedule...' : 'Search catalog services...'} 
              className="w-full rounded-xl border border-white/10 bg-[#090d16]/30 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-[#8b6508] transition-colors" 
            />
          </div>
        </div>

        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <th className="px-5 py-3.5">{vertical === 'Cinema' ? 'Movie Poster & Title' : 'Service Listing'}</th>
              <th className="px-5 py-3.5">Industry Details / Specifics</th>
              <th className="px-5 py-3.5">{vertical === 'Cinema' ? 'Ticket Price (₹)' : 'Base Fee (₹)'}</th>
              <th className="px-5 py-3.5">{vertical === 'Cinema' ? 'Runtime' : 'Duration'}</th>
              <th className="px-5 py-3.5 text-center">{vertical === 'Cinema' ? 'Total Tickets Sold' : 'Audited Bookings'}</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredServices.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    {vertical === 'Cinema' && (
                      <div className="w-10 h-14 bg-slate-900 border border-white/10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {s.moviePoster ? (
                          <img 
                            src={s.moviePoster} 
                            alt={s.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Film size={16} className="text-slate-600" />
                        )}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white text-sm">{s.name}</div>
                      {s.description && (
                        <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 max-w-sm leading-relaxed">{s.description}</div>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-5 py-4">
                  {/* Category specific details */}
                  {vertical === 'Dental' && (
                    <div className="space-y-1">
                      {s.specializationRequired && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                          <Stethoscope size={10} /> Specialist: {s.specializationRequired}
                        </span>
                      )}
                      {s.doctorName && (
                        <div className="text-[10px] text-slate-400">Practitioner: <strong>Dr. {s.doctorName}</strong> {s.roomNumber ? `(${s.roomNumber})` : ''}</div>
                      )}
                    </div>
                  )}
                  {vertical === 'Fitness' && (
                    <div className="space-y-1">
                      {s.difficultyLevel && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <Dumbbell size={10} /> {s.difficultyLevel}
                        </span>
                      )}
                      {s.trainerName && (
                        <div className="text-[10px] text-slate-400">Coach: <strong>{s.trainerName}</strong> {s.classCapacity ? `(Max ${s.classCapacity} slots)` : ''}</div>
                      )}
                    </div>
                  )}
                  {vertical === 'Salon' && (
                    <div className="space-y-1">
                      {s.productsUsed && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                          <Scissors size={10} /> Product: {s.productsUsed}
                        </span>
                      )}
                      {s.stylistName && (
                        <div className="text-[10px] text-slate-400">Therapist: <strong>{s.stylistName}</strong> {s.treatmentType ? `[${s.treatmentType}]` : ''}</div>
                      )}
                    </div>
                  )}
                  {vertical === 'Dining' && (
                    <div className="space-y-1">
                      {s.tableCapacity && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2.5 py-0.5 rounded-full border border-fuchsia-500/20">
                          <Utensils size={10} /> Max Guests: {s.tableCapacity}
                        </span>
                      )}
                      {(s.cuisineType || s.seatingSection) && (
                        <div className="text-[10px] text-slate-400">Menu: <strong>{s.cuisineType || 'Standard'}</strong> | Sect: {s.seatingSection || 'Main Area'}</div>
                      )}
                    </div>
                  )}
                  {vertical === 'Cinema' && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {s.movieLanguage && (
                          <span className="inline-flex items-center text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wide">
                            {s.movieLanguage}
                          </span>
                        )}
                        {s.movieRating && (
                          <span className="inline-flex items-center text-[9px] font-black text-yellow-500 bg-yellow-500/10 px-2.5 py-0.5 rounded border border-yellow-500/20">
                            {s.movieRating} Certification
                          </span>
                        )}
                      </div>
                      {s.movieShowtimes && (
                        <div className="text-[10px] text-[#fceea7] font-extrabold truncate max-w-[200px]" title={s.movieShowtimes}>🎬 {s.movieShowtimes}</div>
                      )}
                      {s.hallNumber && (
                        <div className="text-[9.5px] text-slate-500 font-mono">Location: {s.hallNumber}</div>
                      )}
                    </div>
                  )}
                  {vertical === 'Default' && (
                    <span className="text-[10px] text-slate-600 italic">None logged</span>
                  )}
                </td>
                
                <td className="px-5 py-4 font-bold text-white">₹{s.price}</td>
                <td className="px-5 py-4 text-slate-400">{s.duration} mins</td>
                <td className="px-5 py-4 text-center font-bold">{s.bookingsCount}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                    s.active 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {s.active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                
                <td className="px-5 py-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {vertical === 'Cinema' && (
                      <button 
                        onClick={() => handleOpenSeats(s)}
                        className="rounded-lg p-1.5 hover:bg-[#8b6508]/20 text-[#fceea7] hover:text-[#8b6508] transition-all flex items-center justify-center cursor-pointer mr-1"
                        title="View Seating Layout"
                      >
                        <Ticket size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleOpenEdit(s)}
                      className="rounded-lg p-1.5 hover:bg-white/5 text-slate-400 hover:text-[#d4af37] transition-colors"
                      title={vertical === 'Cinema' ? 'Edit Movie Details' : 'Edit Service'}
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="rounded-lg p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                      title={vertical === 'Cinema' ? 'Delete Movie' : 'Delete Service'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredServices.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500 italic">
                  No listings found. Click "{vertical === 'Cinema' ? 'Add New Movie' : 'Add Service'}" to populate your catalog.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================================
          ADD MODAL
         ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0b101e] border border-white/5 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
              <h3 className="font-extrabold text-sm text-white">
                {vertical === 'Cinema' ? 'Create Movie Listing' : 'Create New Catalog Service'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit}>
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                
                {/* 1. Standard Fields (Adapted visually per vertical) */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    {vertical === 'Cinema' ? 'Movie Title' : 'Service Name'}
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder={vertical === 'Cinema' ? 'e.g. Avengers: Doomsday' : 'e.g. Scaling & Root Planing'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8b6508]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      {vertical === 'Cinema' ? 'Ticket Price (₹)' : 'Base Fee (₹)'}
                    </label>
                    <input 
                      required 
                      type="number" 
                      placeholder="e.g. 250"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8b6508]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      {vertical === 'Cinema' ? 'Runtime (mins)' : 'Duration (mins)'}
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                    >
                      <option value="15">15 mins</option>
                      <option value="30">30 mins</option>
                      <option value="45">45 mins</option>
                      <option value="60">60 mins</option>
                      <option value="90">90 mins</option>
                      <option value="120">120 mins</option>
                      <option value="150">150 mins</option>
                      <option value="180">180 mins</option>
                    </select>
                  </div>
                </div>

                {/* 2. Category Specific Personalized Fields */}
                {vertical === 'Dental' && (
                  <div className="space-y-4 border-l-2 border-sky-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-sky-400 tracking-wider block">Doctor / Clinic Coordinates</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Doctor / Dentist Name</label>
                      <input 
                        type="text" 
                        placeholder="Dr. Arun Kumar"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Specialization</label>
                        <input 
                          type="text" 
                          placeholder="Periodontics"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Cabin / Room Number</label>
                        <input 
                          type="text" 
                          placeholder="Room 302"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {vertical === 'Fitness' && (
                  <div className="space-y-4 border-l-2 border-emerald-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-emerald-400 tracking-wider block">Trainer & Class Settings</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Trainer Name</label>
                      <input 
                        type="text" 
                        placeholder="Coach Sarah Jenkins"
                        value={trainerName}
                        onChange={(e) => setTrainerName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Difficulty Level</label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value as any)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        >
                          <option value="Beginner">Beginner Level</option>
                          <option value="Intermediate">Intermediate Level</option>
                          <option value="Advanced">Advanced Pro Level</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Class Max Size</label>
                        <input 
                          type="number" 
                          placeholder="25"
                          value={classCapacity}
                          onChange={(e) => setClassCapacity(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {vertical === 'Salon' && (
                  <div className="space-y-4 border-l-2 border-rose-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-rose-400 tracking-wider block">Therapist & Stylist settings</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Assigned Specialist</label>
                      <input 
                        type="text" 
                        placeholder="Vikram Singh"
                        value={stylistName}
                        onChange={(e) => setStylistName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Products Used</label>
                        <input 
                          type="text" 
                          placeholder="Matte Hair Clay"
                          value={productsUsed}
                          onChange={(e) => setProductsUsed(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Treatment Type</label>
                        <input 
                          type="text" 
                          placeholder="Skincare Treatment"
                          value={treatmentType}
                          onChange={(e) => setTreatmentType(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {vertical === 'Dining' && (
                  <div className="space-y-4 border-l-2 border-fuchsia-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-fuchsia-400 tracking-wider block">Dining Layout Settings</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Table Capacity</label>
                        <input 
                          type="number" 
                          placeholder="4"
                          value={tableCapacity}
                          onChange={(e) => setTableCapacity(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Cuisine / Menu Category</label>
                        <input 
                          type="text" 
                          placeholder="Chettinad Buffet"
                          value={cuisineType}
                          onChange={(e) => setCuisineType(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Seating Area</label>
                      <select
                        value={seatingSection}
                        onChange={(e) => setSeatingSection(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                      >
                        <option value="Main Dining Hall">Main Dining Hall</option>
                        <option value="Rooftop Pavilion">Rooftop Pavilion</option>
                        <option value="Patio / Garden Area">Patio / Garden Area</option>
                        <option value="Private Dining Suite">Private Dining Suite</option>
                      </select>
                    </div>
                  </div>
                )}

                {vertical === 'Cinema' && (
                  <div className="space-y-4 border-l-2 border-indigo-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-indigo-400 tracking-wider block">Movie Production & Showtime Config</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Movie Poster Image URL</label>
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/photo-..."
                        value={moviePoster}
                        onChange={(e) => setMoviePoster(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Showtimes (comma-separated list)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 10:00 AM, 1:15 PM, 4:30 PM, 8:00 PM, 11:15 PM"
                        value={movieShowtimes}
                        onChange={(e) => setMovieShowtimes(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Language</label>
                        <select
                          value={movieLanguage}
                          onChange={(e) => setMovieLanguage(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-2 py-2 text-[10px] text-white focus:outline-none"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Multi-Audio">Multi-Audio</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Certification</label>
                        <select
                          value={movieRating}
                          onChange={(e) => setMovieRating(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-2 py-2 text-[10px] text-white focus:outline-none"
                        >
                          <option value="U">U (General)</option>
                          <option value="UA">U/A (12+)</option>
                          <option value="A">A (18+)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Hall / Screen</label>
                        <input 
                          type="text" 
                          placeholder="Screen 1"
                          value={hallNumber}
                          onChange={(e) => setHallNumber(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-2.5 py-2 text-[10px] text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    {vertical === 'Cinema' ? 'Synopsis / Summary' : 'Service Description'}
                  </label>
                  <textarea 
                    rows={3} 
                    placeholder={vertical === 'Cinema' ? 'Short synopsis of the movie plot...' : 'Short summary of what is included...'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white resize-none focus:outline-none focus:border-[#8b6508]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="add-active"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded border-white/10 bg-[#090d16] h-4 w-4 text-[#8b6508]"
                  />
                  <label htmlFor="add-active" className="text-xs text-slate-300 font-bold select-none cursor-pointer">
                    {vertical === 'Cinema' ? 'List as Available / Booking Open' : 'List as Active Service'}
                  </label>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-white/5 bg-white/[0.01] flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="rounded-xl bg-[#8b6508] px-5 py-2 text-xs font-bold text-white hover:bg-[#664a05] cursor-pointer"
                >
                  {vertical === 'Cinema' ? 'Publish Movie' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          EDIT MODAL
         ============================================================ */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0b101e] border border-white/5 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
              <h3 className="font-extrabold text-sm text-white">
                {vertical === 'Cinema' ? 'Edit Movie Details' : 'Edit Catalog Service'}
              </h3>
              <button onClick={() => { setShowEditModal(false); setEditingItem(null); }} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                
                {/* 1. Standard Fields */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    {vertical === 'Cinema' ? 'Movie Title' : 'Service Name'}
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      {vertical === 'Cinema' ? 'Ticket Price (₹)' : 'Base Fee (₹)'}
                    </label>
                    <input 
                      required 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      {vertical === 'Cinema' ? 'Runtime (mins)' : 'Duration (mins)'}
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                    >
                      <option value="15">15 mins</option>
                      <option value="30">30 mins</option>
                      <option value="45">45 mins</option>
                      <option value="60">60 mins</option>
                      <option value="90">90 mins</option>
                      <option value="120">120 mins</option>
                      <option value="150">150 mins</option>
                      <option value="180">180 mins</option>
                    </select>
                  </div>
                </div>

                {/* 2. Category Specific Personalized Fields */}
                {vertical === 'Dental' && (
                  <div className="space-y-4 border-l-2 border-sky-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-sky-400 tracking-wider block">Doctor / Clinic Coordinates</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Doctor / Dentist Name</label>
                      <input 
                        type="text" 
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Specialization</label>
                        <input 
                          type="text" 
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Cabin / Room Number</label>
                        <input 
                          type="text" 
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {vertical === 'Fitness' && (
                  <div className="space-y-4 border-l-2 border-emerald-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-emerald-400 tracking-wider block">Trainer & Class Settings</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Trainer Name</label>
                      <input 
                        type="text" 
                        value={trainerName}
                        onChange={(e) => setTrainerName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Difficulty Level</label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value as any)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        >
                          <option value="Beginner">Beginner Level</option>
                          <option value="Intermediate">Intermediate Level</option>
                          <option value="Advanced">Advanced Pro Level</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Class Max Size</label>
                        <input 
                          type="number" 
                          value={classCapacity}
                          onChange={(e) => setClassCapacity(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {vertical === 'Salon' && (
                  <div className="space-y-4 border-l-2 border-rose-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-rose-400 tracking-wider block">Therapist & Stylist settings</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Assigned Specialist</label>
                      <input 
                        type="text" 
                        value={stylistName}
                        onChange={(e) => setStylistName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Products Used</label>
                        <input 
                          type="text" 
                          value={productsUsed}
                          onChange={(e) => setProductsUsed(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Treatment Type</label>
                        <input 
                          type="text" 
                          value={treatmentType}
                          onChange={(e) => setTreatmentType(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {vertical === 'Dining' && (
                  <div className="space-y-4 border-l-2 border-fuchsia-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-fuchsia-400 tracking-wider block">Dining Layout Settings</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Table Capacity</label>
                        <input 
                          type="number" 
                          value={tableCapacity}
                          onChange={(e) => setTableCapacity(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Cuisine / Menu Category</label>
                        <input 
                          type="text" 
                          value={cuisineType}
                          onChange={(e) => setCuisineType(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Seating Area</label>
                      <select
                        value={seatingSection}
                        onChange={(e) => setSeatingSection(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]"
                      >
                        <option value="Main Dining Hall">Main Dining Hall</option>
                        <option value="Rooftop Pavilion">Rooftop Pavilion</option>
                        <option value="Patio / Garden Area">Patio / Garden Area</option>
                        <option value="Private Dining Suite">Private Dining Suite</option>
                      </select>
                    </div>
                  </div>
                )}

                {vertical === 'Cinema' && (
                  <div className="space-y-4 border-l-2 border-indigo-500 pl-3.5 my-3 text-left">
                    <span className="text-[9px] uppercase font-black text-indigo-400 tracking-wider block">Movie Production & Showtime Config</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Movie Poster Image URL</label>
                      <input 
                        type="text" 
                        value={moviePoster}
                        onChange={(e) => setMoviePoster(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Showtimes (comma-separated list)</label>
                      <input 
                        type="text" 
                        value={movieShowtimes}
                        onChange={(e) => setMovieShowtimes(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8b6508]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Language</label>
                        <select
                          value={movieLanguage}
                          onChange={(e) => setMovieLanguage(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-2 py-2 text-[10px] text-white focus:outline-none"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Multi-Audio">Multi-Audio</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Certification</label>
                        <select
                          value={movieRating}
                          onChange={(e) => setMovieRating(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-2 py-2 text-[10px] text-white focus:outline-none"
                        >
                          <option value="U">U (General)</option>
                          <option value="UA">U/A (12+)</option>
                          <option value="A">A (18+)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Hall / Screen</label>
                        <input 
                          type="text" 
                          value={hallNumber}
                          onChange={(e) => setHallNumber(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090d16] px-2.5 py-2 text-[10px] text-white focus:outline-none focus:border-[#8b6508]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    {vertical === 'Cinema' ? 'Synopsis / Summary' : 'Service Description'}
                  </label>
                  <textarea 
                    rows={3} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white resize-none focus:outline-none focus:border-[#8b6508]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="edit-active"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded border-white/10 bg-[#090d16] h-4 w-4 text-[#8b6508]"
                  />
                  <label htmlFor="edit-active" className="text-xs text-slate-300 font-bold select-none cursor-pointer">
                    {vertical === 'Cinema' ? 'List as Available / Booking Open' : 'List as Active Service'}
                  </label>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-white/5 bg-white/[0.01] flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="rounded-xl bg-[#8b6508] px-5 py-2 text-xs font-bold text-white hover:bg-[#664a05] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BookMyShow-style Seating Layout Modal */}
      {showSeatsModal && selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-[#0a0d16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="space-y-1 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black text-[#fceea7] bg-[#8b6508]/20 border border-[#8b6508]/30 px-2 py-0.5 rounded">
                    {selectedMovie.movieRating || 'UA'}
                  </span>
                  <h3 className="font-extrabold text-sm text-white">{selectedMovie.name}</h3>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Auditorium: {selectedMovie.hallNumber || 'Screen 1'} • Ticket Price: ₹350 (Gold Row A-C) / ₹180 (Silver Row D-H)</p>
              </div>
              <button 
                onClick={() => setShowSeatsModal(false)}
                className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Showtime Selection Row */}
            <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02] flex items-center gap-4.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">Select Showtime:</span>
              <div className="flex gap-2">
                {(selectedMovie.movieShowtimes || '10:30 AM, 02:15 PM, 06:00 PM, 09:30 PM').split(',').map((t) => {
                  const showtime = t.trim();
                  const isActive = selectedShowtime === showtime;
                  return (
                    <button
                      key={showtime}
                      onClick={() => {
                        setSelectedShowtime(showtime);
                        setNewSelectedSeats([]);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#8b6508] text-white border border-[#8b6508]/40 shadow-md' 
                          : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {showtime}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Map & Seat Selection */}
            <div className="p-8 flex flex-col items-center justify-center bg-[#070a10]">
              {/* Screen Arc Indicator */}
              <div className="w-full flex flex-col items-center mb-10">
                <div className="w-[75%] h-3 bg-gradient-to-b from-sky-500/20 to-transparent border-t-2 border-sky-400/50 rounded-b-[50%] flex items-center justify-center shadow-[0_-8px_24px_rgba(56,189,248,0.25)]">
                  <span className="text-[8px] uppercase tracking-[0.25em] font-extrabold text-sky-300/80 mt-1 animate-pulse">SCREEN THIS WAY</span>
                </div>
              </div>

              {/* Seating Grid (Rows A to H, Cols 1 to 14) */}
              <div className="space-y-2.5 w-full max-w-xl">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((row) => {
                  const isPremium = ['A', 'B', 'C'].includes(row);
                  const price = isPremium ? 350 : 180;
                  return (
                    <div key={row} className="flex items-center gap-3 justify-center">
                      {/* Left Row Indicator */}
                      <span className="w-4 text-center text-[10px] font-black text-slate-500 font-mono">{row}</span>

                      {/* Seats */}
                      <div className="flex gap-1.5">
                        {Array.from({ length: 14 }).map((_, colIdx) => {
                          const seatNum = colIdx + 1;
                          const seatId = `${row}${seatNum}`;
                          const dbKey = `${selectedMovie.id}_${selectedShowtime}`;
                          
                          const isFilled = bookedSeatsDb[dbKey]?.includes(seatId);
                          const isSelected = newSelectedSeats.includes(seatId);

                          // Central aisle gap after seat 7
                          const showAisle = colIdx === 7;

                          return (
                            <div key={seatId} className="flex items-center">
                              {showAisle && <div className="w-6 shrink-0" />}
                              <button
                                type="button"
                                disabled={isFilled}
                                onClick={() => {
                                  if (newSelectedSeats.includes(seatId)) {
                                    setNewSelectedSeats(prev => prev.filter(s => s !== seatId));
                                  } else {
                                    setNewSelectedSeats(prev => [...prev, seatId]);
                                  }
                                }}
                                className={`w-6 h-6 rounded text-[8px] font-bold font-mono transition-all flex items-center justify-center select-none ${
                                  isFilled
                                    ? 'bg-slate-800 text-slate-600 border border-white/5 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-green-500 text-white border border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)] cursor-pointer'
                                      : isPremium
                                        ? 'border border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/20 hover:border-amber-400 cursor-pointer'
                                        : 'border border-slate-600/40 text-slate-300 bg-slate-500/5 hover:bg-slate-500/20 hover:border-slate-400 cursor-pointer'
                                }`}
                                title={`${seatId} (${isPremium ? 'Premium Gold' : 'Regular Silver'} · ₹${price})`}
                              >
                                {seatNum}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right Row Indicator */}
                      <span className="w-4 text-center text-[10px] font-black text-slate-500 font-mono">{row}</span>
                    </div>
                  );
                })}
              </div>

              {/* Grid Legend Row */}
              <div className="flex gap-6 mt-8 text-[10px] font-bold text-slate-400 font-sans flex-wrap justify-center border-t border-white/5 pt-6 w-full max-w-xl">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-800 border border-white/5 flex items-center justify-center text-[7px] text-slate-600 font-mono">1</div>
                  <span>Sold / Filled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-green-500 border border-green-400 shadow-[0_0_6px_rgba(34,197,94,0.3)]" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-amber-500/40 bg-amber-500/5 text-amber-400 text-[7px] font-mono flex items-center justify-center">1</div>
                  <span>Premium (₹350)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-slate-600/40 bg-slate-500/5 text-slate-300 text-[7px] font-mono flex items-center justify-center">1</div>
                  <span>Regular (₹180)</span>
                </div>
              </div>
            </div>

            {/* Bottom Panel Summary & DB Actions */}
            <div className="px-6 py-4.5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between flex-wrap gap-4">
              {/* Seating database statistics */}
              <div className="text-left font-sans space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Showtime Occupancy Stats</div>
                <div className="text-xs text-slate-300 font-semibold text-left">
                  Filled: <span className="text-white font-extrabold">
                    {(() => {
                      const dbKey = `${selectedMovie.id}_${selectedShowtime}`;
                      const count = bookedSeatsDb[dbKey]?.length || 0;
                      const total = 112; // 8 rows * 14 columns
                      return `${count} / ${total} seats (${Math.round((count / total) * 100)}% Occupancy)`;
                    })()}
                  </span>
                </div>
              </div>

              {/* Selection Summary and database save action */}
              <div className="flex items-center gap-4">
                {newSelectedSeats.length > 0 && (
                  <div className="text-right font-sans">
                    <span className="text-[9px] uppercase font-bold text-green-400 block tracking-wide">Ready to Register</span>
                    <span className="text-xs text-white block mt-0.5">
                      Selected: <strong>{newSelectedSeats.sort().join(', ')}</strong> (₹
                      {newSelectedSeats.reduce((sum, s) => {
                        const isPremium = ['A', 'B', 'C'].includes(s.charAt(0));
                        return sum + (isPremium ? 350 : 180);
                      }, 0)}
                      )
                    </span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {/* Reset reservations */}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all seat reservations for this showtime in the theatre database?')) {
                        const dbKey = `${selectedMovie.id}_${selectedShowtime}`;
                        setBookedSeatsDb(prev => ({
                          ...prev,
                          [dbKey]: []
                        }));
                        setNewSelectedSeats([]);
                        showToast(`Seating database cleared for ${selectedMovie.name} (${selectedShowtime}).`);
                      }
                    }}
                    className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 cursor-pointer"
                  >
                    Reset Seats
                  </button>

                  <button
                    type="button"
                    disabled={newSelectedSeats.length === 0}
                    onClick={() => {
                      const dbKey = `${selectedMovie.id}_${selectedShowtime}`;
                      const current = bookedSeatsDb[dbKey] || [];
                      const updated = [...current, ...newSelectedSeats];
                      setBookedSeatsDb(prev => ({
                        ...prev,
                        [dbKey]: updated
                      }));
                      showToast(`Successfully booked ${newSelectedSeats.length} seats: ${newSelectedSeats.sort().join(', ')}`);
                      setNewSelectedSeats([]);
                    }}
                    className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                      newSelectedSeats.length === 0
                        ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/10'
                    }`}
                  >
                    Update Seat Database
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
