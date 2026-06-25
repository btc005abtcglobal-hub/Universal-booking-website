'use client';

import { useState } from 'react';
import { useVendorStore } from '../../../lib/store';
import { 
  Users, Search, Mail, Phone, Calendar, ArrowUpRight, 
  DollarSign, BookOpen, Star, RefreshCw
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpend: number;
  lastBookingDate: string;
  rating: number;
  status: 'Loyal' | 'Frequent' | 'New' | 'Inactive';
}

export default function CustomersPage() {
  const { currentMerchant } = useVendorStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [customers, setCustomers] = useState<CustomerRecord[]>([
    {
      id: 'cust-1',
      name: 'Amit Patel',
      email: 'amit.patel@gmail.com',
      phone: '+91 91234 56780',
      totalBookings: 18,
      totalSpend: 15400,
      lastBookingDate: 'Jun 22, 2026',
      rating: 4.9,
      status: 'Loyal'
    },
    {
      id: 'cust-2',
      name: 'Neha Deshmukh',
      email: 'neha.desh@yahoo.com',
      phone: '+91 91234 56781',
      totalBookings: 12,
      totalSpend: 9800,
      lastBookingDate: 'Jun 19, 2026',
      rating: 4.8,
      status: 'Frequent'
    },
    {
      id: 'cust-3',
      name: 'Rohan Malhotra',
      email: 'rohan.malhotra@outlook.com',
      phone: '+91 91234 56782',
      totalBookings: 4,
      totalSpend: 3600,
      lastBookingDate: 'Jun 24, 2026',
      rating: 4.6,
      status: 'New'
    },
    {
      id: 'cust-4',
      name: 'Siddharth Rao',
      email: 'sid.rao@gmail.com',
      phone: '+91 91234 56783',
      totalBookings: 1,
      totalSpend: 1200,
      lastBookingDate: 'Apr 02, 2026',
      rating: 4.2,
      status: 'Inactive'
    },
    {
      id: 'cust-5',
      name: 'Anjali Nair',
      email: 'anjali.nair@hotmail.com',
      phone: '+91 91234 56784',
      totalBookings: 9,
      totalSpend: 7500,
      lastBookingDate: 'Jun 14, 2026',
      rating: 4.7,
      status: 'Frequent'
    }
  ]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClients = customers.length;
  const totalSpendVal = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  const totalBookingsVal = customers.reduce((sum, c) => sum + c.totalBookings, 0);

  if (!currentMerchant) {
    return <div className="text-center text-text-secondary py-12">Loading customer database...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-text-primary">Customer Directory</h1>
        <p className="text-xs text-text-secondary">Track lifetime values, contact directories, and visit history of your customer base.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-[#8b6508]/10 text-[#fceea7]">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Total Clients</span>
            <h3 className="text-xl font-black text-text-primary">{totalClients}</h3>
          </div>
        </div>

        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Total Bookings</span>
            <h3 className="text-xl font-black text-text-primary">{totalBookingsVal} sessions</h3>
          </div>
        </div>

        <div className="rounded-xl border border-border-brand bg-bg-secondary p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Lifetime Volume</span>
            <h3 className="text-xl font-black text-text-primary">₹{totalSpendVal.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="rounded-xl border border-border-brand bg-bg-secondary p-4">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search by client name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 pl-10 pr-4 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508] transition-all"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      {/* CRM list card */}
      <div className="rounded-xl border border-border-brand bg-bg-secondary overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-tertiary/40 border-b border-border-brand text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                <th className="py-3 px-5">Client Name</th>
                <th className="py-3 px-5">Contact Info</th>
                <th className="py-3 px-5">Tier / Status</th>
                <th className="py-3 px-5">Sessions</th>
                <th className="py-3 px-5">Lifetime Value</th>
                <th className="py-3 px-5">Recent Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-white/[0.01] transition-colors text-xs">
                  {/* Name */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-sm uppercase">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-text-primary">{cust.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span className="text-[10px] text-text-secondary font-bold">{cust.rating.toFixed(1)} rating</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Phone size={11} />
                      <span>{cust.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[10.5px]">
                      <Mail size={11} />
                      <span>{cust.email}</span>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="py-4 px-5">
                    {cust.status === 'Loyal' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                        👑 Loyal
                      </span>
                    )}
                    {cust.status === 'Frequent' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                        ✨ Frequent
                      </span>
                    )}
                    {cust.status === 'New' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        🌱 New
                      </span>
                    )}
                    {cust.status === 'Inactive' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-slate-500/10 text-slate-400 border border-slate-500/20 uppercase tracking-wider">
                        💤 Inactive
                      </span>
                    )}
                  </td>

                  {/* Sessions */}
                  <td className="py-4 px-5">
                    <span className="font-extrabold text-text-primary">{cust.totalBookings}</span>
                  </td>

                  {/* Spend */}
                  <td className="py-4 px-5">
                    <span className="font-extrabold text-text-primary">₹{cust.totalSpend.toLocaleString()}</span>
                  </td>

                  {/* Recent Visit */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Calendar size={12} />
                      <span>{cust.lastBookingDate}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
