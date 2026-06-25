'use client';

import { useState } from 'react';
import { useVendorStore } from '../../../lib/store';
import { 
  Users, UserPlus, Search, Star, Phone, Mail, Clock, 
  CheckCircle2, X, Plus, Trash2
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  rating: number;
  phone: string;
  email: string;
  schedule: string;
  status: 'active' | 'break' | 'offline';
  joinedDate: string;
}

export default function StaffPage() {
  const { currentMerchant } = useVendorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Local staff list state initialized with merchant-specific templates
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: 'staff-1',
      name: 'Aditi Sharma',
      role: currentMerchant?.category === 'dining' ? 'Maitre D\'' : currentMerchant?.category === 'dental' ? 'Senior Dentist' : 'Senior Stylist',
      rating: 4.9,
      phone: '+91 98765 43210',
      email: 'aditi.sharma@bokspot.com',
      schedule: '09:00 AM - 05:00 PM',
      status: 'active',
      joinedDate: 'Jan 15, 2025'
    },
    {
      id: 'staff-2',
      name: 'Rahul Verma',
      role: currentMerchant?.category === 'dining' ? 'Head Chef' : currentMerchant?.category === 'dental' ? 'Dental Hygienist' : 'Lead Stylist',
      rating: 4.8,
      phone: '+91 98765 43211',
      email: 'rahul.verma@bokspot.com',
      schedule: '11:00 AM - 07:00 PM',
      status: 'active',
      joinedDate: 'Mar 10, 2025'
    },
    {
      id: 'staff-3',
      name: 'Priya Patel',
      role: currentMerchant?.category === 'dining' ? 'Sous Chef' : currentMerchant?.category === 'dental' ? 'Orthodontist' : 'Nail Technician',
      rating: 4.7,
      phone: '+91 98765 43212',
      email: 'priya.patel@bokspot.com',
      schedule: '09:00 AM - 05:00 PM',
      status: 'break',
      joinedDate: 'Jul 22, 2025'
    },
    {
      id: 'staff-4',
      name: 'Vikram Singh',
      role: currentMerchant?.category === 'dining' ? 'Lead Sommelier' : currentMerchant?.category === 'dental' ? 'Pediatric Dentist' : 'Skin Therapist',
      rating: 4.9,
      phone: '+91 98765 43213',
      email: 'vikram.singh@bokspot.com',
      schedule: '01:00 PM - 09:00 PM',
      status: 'offline',
      joinedDate: 'Nov 02, 2025'
    }
  ]);

  // Form states
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSchedule, setNewSchedule] = useState('09:00 AM - 05:00 PM');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newName,
      role: newRole,
      rating: 5.0,
      phone: newPhone || '+91 99999 88888',
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@bokspot.com`,
      schedule: newSchedule,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setStaffList([...staffList, newMember]);
    setShowAddModal(false);
    setNewName('');
    setNewRole('');
    setNewPhone('');
    setNewEmail('');
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList(staffList.filter(s => s.id !== id));
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = staffList.filter(s => s.status === 'active').length;
  const breakCount = staffList.filter(s => s.status === 'break').length;

  if (!currentMerchant) {
    return <div className="text-center text-text-secondary py-12">Loading staff dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-text-primary">Staff Management</h1>
          <p className="text-xs text-text-secondary">View and coordinate your team members, schedules, and performance ratings.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#8b6508] hover:bg-[#a67c1e] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <UserPlus size={15} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Total Staff</span>
            <h3 className="text-xl font-black text-text-primary">{staffList.length}</h3>
          </div>
        </div>

        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Active Now</span>
            <h3 className="text-xl font-black text-emerald-400">{activeCount}</h3>
          </div>
        </div>

        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">On Break</span>
            <h3 className="text-xl font-black text-amber-400">{breakCount}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-border-brand bg-bg-secondary p-4">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 pl-10 pr-4 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508] transition-all"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      {/* Staff list card */}
      <div className="rounded-xl border border-border-brand bg-bg-secondary overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-tertiary/40 border-b border-border-brand text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                <th className="py-3 px-5">Staff Member</th>
                <th className="py-3 px-5">Contact Details</th>
                <th className="py-3 px-5">Weekly Shift</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Rating</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-white/[0.01] transition-colors text-xs">
                  {/* Name & Role */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#8b6508]/15 border border-[#8b6508]/30 flex items-center justify-center font-bold text-text-primary text-sm uppercase">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-text-primary">{staff.name}</div>
                        <div className="text-[10px] text-text-secondary font-medium">{staff.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Phone size={11} />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[10.5px]">
                      <Mail size={11} />
                      <span>{staff.email}</span>
                    </div>
                  </td>

                  {/* Shift */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Clock size={12} />
                      <span>{staff.schedule}</span>
                    </div>
                    <div className="text-[9px] text-text-muted mt-0.5 font-medium">Joined {staff.joinedDate}</div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5">
                    {staff.status === 'active' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        Active
                      </span>
                    )}
                    {staff.status === 'break' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                        On Break
                      </span>
                    )}
                    {staff.status === 'offline' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 uppercase tracking-wider">
                        Offline
                      </span>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="font-extrabold text-text-primary">{staff.rating.toFixed(1)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <button 
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove Staff"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4">
          <div className="w-full max-w-md bg-bg-secondary border border-border-brand rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Add Team Member</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sameer Sen"
                  className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Role Title</label>
                <input 
                  type="text" 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Lead Assistant"
                  className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Phone</label>
                  <input 
                    type="text" 
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 99999 99999"
                    className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Schedule</label>
                  <input 
                    type="text" 
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Email Address</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. sameer.sen@bokspot.com"
                  className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 px-3.5 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508]"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-text-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#8b6508] hover:bg-[#a67c1e] text-white cursor-pointer"
                >
                  Confirm Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
