'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star, Heart, ChevronLeft, ChevronRight, Filter, ArrowUpDown,
  Search
} from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { SideNav } from '../components/SideNav';
import { BottomNav } from '../components/BottomNav';

/* ================================================================
   DATA
   ================================================================ */

const HERO_IMAGES = {
  main: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzj3FdlEXTd8TYM-qQAn3qdNGfdN4KBf8460UjDH8VavT7yqT75dGiqu8Y9QSj8Xf3q1lm4bPszlKgCcnLsEY8bTNWnBPllDEM92OPn9ihe_pUDi21ErkJkE_bbem9UNWM3c_69YeG_2GBkpv28QMaIDI_7jmelAzkEXJn6UKts3XvFJ1YyItECTg_QsJzB91TyL_s2EKSl7ag4tEQU_ot2ELTYFKrxYmO0PUAt0UWIoEpu1dzi1HlS_mK_ilC_lu9vYWsaerfXvk',
  secondary1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu9BHplED_9aVDZT5pG8BQTmNA9pqKnp7RC99dfFguYd2NKorWnCM_PZ04pZ0HpayA1QCI8J8PE2PLx91ZSNIjDRqr0jwx0bnd9ZT5vOQ9x5_5DEKmeDrfbjaGAA_28fn8yf-j9yuD9KJCMbcyhgsISoiafbpsoPsXj1jCYb1oinll1pkoVOBkVSffbUqcruoa0wsrHAXRrEaKe62qQIcLPvEIAgWyblnx-442uHuVFSWiYYdjnhsg8W7xhbqioD88kPfLU-HerD0',
  secondary2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASevivWfTGfzMb8jeTxMxBipfhml7-8Outcir0j-8GhSzDqUspmZEGZfC7iMsCknrP0ENB9yyHGox-PpdnyMdfF7Jin4RLD1-2wyKbd_dW1nCYEse98rY7rwl-K1z46GfK7pCCQf8SKvvve4Liehkgu2QI44qle5Tkt19TET7Nw-wb7Lsu9DI0ftSy1EcbmTjhVlr7X8YZsi8LiT3QB77lRBluKCS9jDLBKtxtH2hc8nW3M8y16rzuzt1S89-FAAKXfpVZu1PSsIE',
};

const LISTINGS = [
  {
    id: '1', name: 'Azure Sanctuary', location: 'Santorini, Greece',
    price: '$1,250', rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFVs1E6r8_3jyBhZAnDV3aECQgng8jt7wpw_n1cpwds0YethHabxze7B-nt7egrp-vBajWrGYz7SaGwVDiA36ByTH9Xbk7DfA1GaKAhh-TaDJZHI1j2vEEN967LjP5ZrWC3vvmfQOpvtwuUsm7fkfyEFgV9a1WAr05yso5swDnqRIRPW4ZqL13Aq8dEHmVhUj0auLLVhOq5iROh2K7B6w7Lsh_4xfMYD699LXB0oLuX_AsBiuFNat-qTnBNpFK3nvV9cjVka-SnNk',
  },
  {
    id: '2', name: 'Zenith Peak Lodge', location: 'Swiss Alps, Switzerland',
    price: '$2,800', rating: 5.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0D2x2yxpAAzCSyC-V8GSTGVI2PlUgZbAfTVDNvsz21OlwpSG_Y1F0Zu693LJZqka9ZEs3skugVNoWcVzYcFsutfIKRjKrvryfpr7xVh52h9BKWm8-0CZwB_zMOcdDhhCQdlhg8Mg5FWyiX2c22UAgF6fst1zOMEQa4jtrEh6ynhiH4SF0bmck8kTUJGIIDAH6E_CUyCps3m5RfogUrzYUE303iujNgzS1ViPh2wh31OH_IpcE8T8Drk0p0hZUqgODrJC_oTp6tYY',
  },
  {
    id: '3', name: 'Lumière Terrace', location: 'Paris, France',
    price: '$950', rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPmeuuCCJGO3Vh7_AYNoCDDesp4KL3vRoMvzMCsEKB9YPECFS-ya7T1Zq3uZNWqJnbp5IEEj0bZnkAnqExRJ2pM71TXbzjSvJ_jMY0LOC3fCzWxfeFcfols8DMRsflwTfvSu128n-OvCbDxcMUn538dKtingNtv-NToqRVjcTnFI5y54EBFBVyxeh0aqMRxEcGy5fPkCBv4wokT4DhzEwRHxyoeXbzdAgq2ELcshm3n90Gep1rYeLb87hOjh68j4ZG2AqSNg_Kesk',
  },
  {
    id: '4', name: 'Verdant Retreat', location: 'Ubud, Bali',
    price: '$1,500', rating: 4.7,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUWEJnVL91w6tS_1r6RDr9Hp9oXwxuUhBagGDM58kkmb23iw7OpEY87rsRNT1luVe47U_T3aZqdfSODQ2_Fn1N06IwBkWV_vJ6SQXTbsLTokMkv4yqSlj1dNbxnxGQ-oSAhndUBd3SdnxnHBskabDDhA6A47QXJr15d_QDqjQyVLIz88gUQTjPs3MEJVbpEv-rwIfOfIhwKRHd5DEe7lvzzAHt4tZV7OzQvSw9nkhLaubhGrMrfvVw7h2vXJrJUPl3qI_c3nWL9ik',
  },
];

/* ================================================================
   COMPONENT
   ================================================================ */

export default function HomePage() {
  return (
    <>
      <TopNav />
      <div className="flex min-h-screen pt-[72px] lg:pt-[84px]">
        <SideNav />

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 px-5 lg:px-16 xl:px-20 pb-28">

          {/* ═══════════ HERO SECTION ═══════════ */}
          <section className="mt-6 lg:mt-8 mb-12 lg:mb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-[32px] lg:text-[48px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--on-surface)] mb-2">
                  Curated For You
                </h2>
                <p className="text-[var(--on-surface-variant)] text-[16px] lg:text-[18px] leading-[28px] max-w-xl">
                  Exquisite journeys and premier stays, hand-selected for the discerning voyager.
                </p>
              </motion.div>
              <div className="flex gap-3">
                <button className="btn-outline text-[13px] py-2 px-5">
                  <Filter size={14} /> Filter
                </button>
                <button className="btn-primary text-[13px] py-2 px-5">
                  <ArrowUpDown size={14} /> Sort By
                </button>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
              {/* Primary Feature — large */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-8 lg:row-span-2 relative overflow-hidden rounded-xl group cursor-pointer h-[280px] lg:h-[560px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_IMAGES.main}
                  alt="Luxury hotel lobby with golden lighting"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="card-overlay" />
                <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 max-w-lg z-10">
                  <span className="badge-gold mb-4 inline-block">Exclusive Partner</span>
                  <h3 className="font-['Playfair_Display'] text-[24px] lg:text-[32px] font-semibold leading-[1.2] text-white mb-2">
                    The Gilded Pavilion, Maldives
                  </h3>
                  <p className="text-[var(--on-surface-variant)] text-[14px] lg:text-[16px] leading-relaxed line-clamp-2">
                    Private overwater villas with 24-hour concierge service and underwater dining experiences.
                  </p>
                </div>
              </motion.div>

              {/* Secondary Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-4 relative overflow-hidden rounded-xl group cursor-pointer h-[200px] lg:h-[268px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_IMAGES.secondary1}
                  alt="Private luxury jet cabin"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="card-overlay-dark" />
                <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end z-10">
                  <h4 className="font-['Playfair_Display'] text-[20px] lg:text-[24px] font-medium text-white">
                    Private Charters
                  </h4>
                  <p className="text-[var(--on-surface-variant)] text-[12px] font-semibold tracking-[0.08em]">
                    Bespoke flight experiences
                  </p>
                </div>
              </motion.div>

              {/* Secondary Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-4 relative overflow-hidden rounded-xl group cursor-pointer h-[200px] lg:h-[268px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_IMAGES.secondary2}
                  alt="Elegant champagne in high-end bar"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="card-overlay-dark" />
                <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end z-10">
                  <h4 className="font-['Playfair_Display'] text-[20px] lg:text-[24px] font-medium text-white">
                    Elite Events
                  </h4>
                  <p className="text-[var(--on-surface-variant)] text-[12px] font-semibold tracking-[0.08em]">
                    Invitation-only access
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ═══════════ DISCOVER MORE — Listing Cards ═══════════ */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8 lg:mb-10">
              <h3 className="font-['Playfair_Display'] text-[28px] lg:text-[32px] font-semibold text-[var(--on-surface)]">
                Discover More
              </h3>
              <div className="flex gap-3">
                <button className="p-2.5 border border-[var(--outline-variant)]/20 rounded-full hover:border-[var(--primary)] transition-colors text-[var(--on-surface-variant)] hover:text-[var(--primary)]">
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <button className="p-2.5 border border-[var(--outline-variant)]/20 rounded-full hover:border-[var(--primary)] transition-colors text-[var(--on-surface-variant)] hover:text-[var(--primary)]">
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {LISTINGS.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="glass-card-hover rounded-xl overflow-hidden cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative h-56 lg:h-64 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:text-[var(--primary)] transition-colors z-10">
                      <Heart size={18} strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-5 lg:p-6">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-['Playfair_Display'] text-[17px] font-medium text-[var(--on-surface)]">
                        {listing.name}
                      </h5>
                      <span className="flex items-center gap-1 text-[var(--primary)] text-[14px] shrink-0">
                        <Star size={14} fill="currentColor" strokeWidth={0} />
                        {listing.rating}
                      </span>
                    </div>
                    <p className="text-[var(--on-surface-variant)] text-[14px] tracking-[0.05em] mb-5">
                      {listing.location}
                    </p>
                    <p className="text-[var(--on-surface)] text-[14px] tracking-[0.05em]">
                      From{' '}
                      <span className="text-[var(--primary)] font-bold text-[18px]">{listing.price}</span>
                      {' '}/ night
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ═══════════ MOBILE SEARCH (lg:hidden) ═══════════ */}
          <div className="lg:hidden fixed bottom-[76px] right-4 z-40">
            <button className="w-14 h-14 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl transition-all active:scale-95">
              <Search size={22} />
            </button>
          </div>
        </main>
      </div>

      <BottomNav />
    </>
  );
}
