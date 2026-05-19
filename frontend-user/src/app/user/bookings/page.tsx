'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, MapPin, QrCode, CheckCircle2, XCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '../../../components/ThemeToggle';

const bookings = [
  { id: '1', ref: 'BK-A1B2C3', service: 'Premium Haircut', merchant: 'Style Studio', date: '2026-05-20', time: '10:00 AM', status: 'CONFIRMED', amount: 599 },
  { id: '2', ref: 'BK-D4E5F6', service: 'Yoga Class', merchant: 'ZenFit', date: '2026-05-22', time: '7:00 AM', status: 'CONFIRMED', amount: 499 },
  { id: '3', ref: 'BK-G7H8I9', service: 'Table Reservation', merchant: 'The Grand', date: '2026-05-15', time: '8:00 PM', status: 'COMPLETED', amount: 1200 },
];

export default function UserBookingsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Sticky header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-subtle)]">
        <div className="container-main flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="btn-ghost p-2">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-[var(--text-primary)]">My Bookings</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div style={{ paddingTop: '5.5rem' }}>
        <div className="container-main py-8 flex flex-col items-center">
          <div className="w-full max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
            <div className="space-y-4">
              {bookings.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{b.service}</h3>
                  <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5" /> {b.merchant}</p>
                </div>
                <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-success' : 'badge-primary'}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> {b.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {b.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {b.time}</span>
                <span className="font-semibold">₹{b.amount}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)] font-mono">{b.ref}</span>
                {b.status === 'CONFIRMED' && (
                  <Link href={`/booking/success?ref=${b.ref}`} className="flex items-center gap-1 rounded-lg bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
                    <QrCode className="h-3.5 w-3.5" /> View QR
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
      </div>
    </main>
  );
}
