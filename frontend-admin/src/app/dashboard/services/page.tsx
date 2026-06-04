'use client';

import { useVendorStore, CatalogService } from '../../../lib/store';
import { getVerticalFromCategory } from '../../../lib/categoryUtils';
import { 
  Plus, Search, Edit, Trash2, Clock, IndianRupee, Star, X, Save, 
  Stethoscope, Dumbbell, Scissors, Utensils, Award, CheckCircle2 
} from 'lucide-react';
import { useState } from 'react';

export default function ServicesPage() {
  const { currentMerchant, services, addService, updateService, deleteService } = useVendorStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogService | null>(null);

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

  if (!currentMerchant) {
    return <div className="text-center text-slate-500">Loading catalog...</div>;
  }

  // Filter services for the current merchant
  const merchantServices = services.filter(
    (s) => s.merchant.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );

  const filteredServices = merchantServices.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setName('');
    setPrice('');
    setDuration('60');
    setDescription('');
    setActive(true);
    setSpecialization('');
    setDifficulty('Intermediate');
    setProductsUsed('');
    setTableCapacity('4');
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

      // Custom attributes
      specializationRequired: getVerticalFromCategory(currentMerchant.category) === 'Dental' ? specialization.trim() : undefined,
      difficultyLevel: getVerticalFromCategory(currentMerchant.category) === 'Fitness' ? difficulty : undefined,
      productsUsed: getVerticalFromCategory(currentMerchant.category) === 'Salon' ? productsUsed.trim() : undefined,
      tableCapacity: getVerticalFromCategory(currentMerchant.category) === 'Dining' ? parseInt(tableCapacity) || 4 : undefined
    };

    addService(newSvc);
    setShowAddModal(false);
    showToast(`Service "${newSvc.name}" added to catalog successfully.`);
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

      // Custom attributes
      specializationRequired: getVerticalFromCategory(currentMerchant.category) === 'Dental' ? specialization.trim() : undefined,
      difficultyLevel: getVerticalFromCategory(currentMerchant.category) === 'Fitness' ? difficulty : undefined,
      productsUsed: getVerticalFromCategory(currentMerchant.category) === 'Salon' ? productsUsed.trim() : undefined,
      tableCapacity: getVerticalFromCategory(currentMerchant.category) === 'Dining' ? parseInt(tableCapacity) || 4 : undefined
    };

    updateService(updatedSvc);
    setShowEditModal(false);
    setEditingItem(null);
    showToast(`Service "${updatedSvc.name}" updated successfully.`);
  };

  const handleDelete = (id: string) => {
    const targetSvc = services.find(s => s.id === id);
    if (confirm('Are you sure you want to delete this service listing from your catalog?')) {
      deleteService(id);
      showToast(`Service "${targetSvc?.name || 'Listing'}" removed from catalog.`);
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Services Catalog</h1>
          <p className="text-xs text-slate-400">Configure prices, treatment/session durations, and industry-specific catalog tags.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/10 hover:from-indigo-600 hover:to-fuchsia-700 transition-all cursor-pointer"
        >
          <Plus size={14} /> Add Service Listing
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
              placeholder="Search catalog services..." 
              className="w-full rounded-xl border border-white/10 bg-[#090d16]/30 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors" 
            />
          </div>
        </div>

        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Service Listing</th>
              <th className="px-5 py-3.5">Industry details</th>
              <th className="px-5 py-3.5">Fee (₹)</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5 text-center">Audited Bookings</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredServices.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-5 py-4">
                  <div className="font-bold text-white">{s.name}</div>
                  {s.description && (
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-1 max-w-md">{s.description}</div>
                  )}
                </td>
                <td className="px-5 py-4">
                  {/* Category specific details */}
                  {getVerticalFromCategory(currentMerchant.category) === 'Dental' && s.specializationRequired && (
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                      <Stethoscope size={10} /> Specialist: {s.specializationRequired}
                    </span>
                  )}
                  {getVerticalFromCategory(currentMerchant.category) === 'Fitness' && s.difficultyLevel && (
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <Dumbbell size={10} /> Difficulty: {s.difficultyLevel}
                    </span>
                  )}
                  {getVerticalFromCategory(currentMerchant.category) === 'Salon' && s.productsUsed && (
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                      <Scissors size={10} /> Product: {s.productsUsed}
                    </span>
                  )}
                  {getVerticalFromCategory(currentMerchant.category) === 'Dining' && s.tableCapacity && (
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2.5 py-0.5 rounded-full border border-fuchsia-500/20">
                      <Utensils size={10} /> Capacity: {s.tableCapacity} seats
                    </span>
                  )}
                  {!s.specializationRequired && !s.difficultyLevel && !s.productsUsed && !s.tableCapacity && (
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
                    <button 
                      onClick={() => handleOpenEdit(s)}
                      className="rounded-lg p-1.5 hover:bg-white/5 text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="rounded-lg p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredServices.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500 italic">No services created yet. Click Add Service to populate your catalog.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================================
          ADD SERVICE MODAL
         ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0b101e] border border-white/5 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
              <h3 className="font-extrabold text-sm text-white">Create New Catalog Service</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleAddSubmit}>
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Service Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Scaling & Root Planing"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Base Price (₹)</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="e.g. 1500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Duration (mins)</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white"
                    >
                      <option value="15">15 mins</option>
                      <option value="30">30 mins</option>
                      <option value="45">45 mins</option>
                      <option value="60">60 mins</option>
                      <option value="90">90 mins</option>
                      <option value="120">120 mins</option>
                    </select>
                  </div>
                </div>

                {/* CATEGORY SPECIFIC FIELDS */}
                {getVerticalFromCategory(currentMerchant.category) === 'Dental' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Medical Specialization Tag</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Periodontics, Orthodontics"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                )}

                {getVerticalFromCategory(currentMerchant.category) === 'Fitness' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Workout Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    >
                      <option value="Beginner">Beginner Level</option>
                      <option value="Intermediate">Intermediate Level</option>
                      <option value="Advanced">Advanced Pro Level</option>
                    </select>
                  </div>
                )}

                {getVerticalFromCategory(currentMerchant.category) === 'Salon' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Styling Products Used</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sulfate-Free Argan Oil"
                      value={productsUsed}
                      onChange={(e) => setProductsUsed(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                )}

                {getVerticalFromCategory(currentMerchant.category) === 'Dining' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Table Capacity (Guests)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 4"
                      value={tableCapacity}
                      onChange={(e) => setTableCapacity(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Service Description</label>
                  <textarea 
                    rows={3} 
                    placeholder="Short summary of what is included..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="add-active"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded border-white/10 bg-[#090d16] h-4 w-4 text-indigo-500"
                  />
                  <label htmlFor="add-active" className="text-xs text-slate-300 font-bold">List as Active Service</label>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-white/5 bg-white/[0.01] flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="rounded-xl bg-indigo-500 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-600 cursor-pointer"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          EDIT SERVICE MODAL
         ============================================================ */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0b101e] border border-white/5 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
              <h3 className="font-extrabold text-sm text-white">Edit Catalog Service</h3>
              <button onClick={() => { setShowEditModal(false); setEditingItem(null); }} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Service Name</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Base Price (₹)</label>
                    <input 
                      required 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Duration (mins)</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3 py-2 text-xs text-white"
                    >
                      <option value="15">15 mins</option>
                      <option value="30">30 mins</option>
                      <option value="45">45 mins</option>
                      <option value="60">60 mins</option>
                      <option value="90">90 mins</option>
                      <option value="120">120 mins</option>
                    </select>
                  </div>
                </div>

                {/* CATEGORY SPECIFIC FIELDS */}
                {getVerticalFromCategory(currentMerchant.category) === 'Dental' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Medical Specialization Tag</label>
                    <input 
                      type="text" 
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                )}

                {getVerticalFromCategory(currentMerchant.category) === 'Fitness' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Workout Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    >
                      <option value="Beginner">Beginner Level</option>
                      <option value="Intermediate">Intermediate Level</option>
                      <option value="Advanced">Advanced Pro Level</option>
                    </select>
                  </div>
                )}

                {getVerticalFromCategory(currentMerchant.category) === 'Salon' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Styling Products Used</label>
                    <input 
                      type="text" 
                      value={productsUsed}
                      onChange={(e) => setProductsUsed(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                )}

                {getVerticalFromCategory(currentMerchant.category) === 'Dining' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Table Capacity (Guests)</label>
                    <input 
                      type="number" 
                      value={tableCapacity}
                      onChange={(e) => setTableCapacity(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Service Description</label>
                  <textarea 
                    rows={3} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="edit-active"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded border-white/10 bg-[#090d16] h-4 w-4 text-indigo-500"
                  />
                  <label htmlFor="edit-active" className="text-xs text-slate-300 font-bold">List as Active Service</label>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-white/5 bg-white/[0.01] flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="rounded-xl bg-indigo-500 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-600 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
