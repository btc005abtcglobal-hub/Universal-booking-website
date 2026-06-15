'use client';

import { useState, useEffect } from 'react';
import { X, Calculator, Calendar as CalendarIcon, Sparkles, Plus, Trash2, ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UtilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isVendor?: boolean;
}

interface CompareItem {
  id: string;
  description: string;
  valA: number;
  valB: number;
}

export function UtilityDrawer({ isOpen, onClose, isVendor = false }: UtilityDrawerProps) {
  const [activeTab, setActiveTab] = useState<'calc' | 'calendar' | null>(null);

  // Calculator states
  const [calcInput, setCalcInput] = useState('');
  const [calcOperator, setCalcOperator] = useState('');
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [calcHistory, setCalcHistory] = useState<string[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState<'₹' | '$'>('₹');
  const [compareMode, setCompareMode] = useState(false);

  // Compare states
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [compDesc, setCompDesc] = useState('');
  const [compValA, setCompValA] = useState('');
  const [compValB, setCompValB] = useState('');

  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Handle calculator key press
  const handleCalcBtn = (val: string) => {
    if (val === 'C' || val === '↺') {
      setCalcInput('');
      setCalcOperator('');
      setCalcResult(null);
      setCalcHistory([]);
    } else if (val === '⌫') {
      setCalcInput((prev) => prev.slice(0, -1));
    } else if (['+', '-', '*', '/'].includes(val)) {
      if (!calcInput && calcResult !== null) {
        setCalcOperator(val);
      } else if (calcInput) {
        const num = parseFloat(calcInput);
        if (calcResult === null) {
          setCalcResult(num);
        } else {
          const res = evaluate(calcResult, num, calcOperator);
          setCalcResult(res);
        }
        setCalcOperator(val);
        setCalcInput('');
      }
    } else if (val === '=') {
      if (calcInput && calcOperator && calcResult !== null) {
        const num = parseFloat(calcInput);
        const res = evaluate(calcResult, num, calcOperator);
        const formula = `${calcResult} ${calcOperator} ${num} = ${res}`;
        setCalcHistory((prev) => [formula, ...prev].slice(0, 8));
        setCalcInput(String(res));
        setCalcResult(null);
        setCalcOperator('');
      }
    } else if (val === '.') {
      if (!calcInput.includes('.')) {
        setCalcInput((prev) => (prev || '0') + '.');
      }
    } else {
      // Numbers
      setCalcInput((prev) => (prev === '0' ? val : prev + val));
    }
  };

  const evaluate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleAddGst = () => {
    if (!calcInput) return;
    const num = parseFloat(calcInput);
    const withGst = Number((num * 1.18).toFixed(2));
    setCalcHistory((prev) => [`${num} + 18% GST = ${withGst}`, ...prev]);
    setCalcInput(String(withGst));
  };

  const handleAddDiscount = () => {
    if (!calcInput) return;
    const num = parseFloat(calcInput);
    const withDisc = Number((num * 0.9).toFixed(2));
    setCalcHistory((prev) => [`${num} - 10% Disc = ${withDisc}`, ...prev]);
    setCalcInput(String(withDisc));
  };

  // Compare functions
  const handleAddCompareItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compDesc.trim() || !compValA || !compValB) return;
    const newItem: CompareItem = {
      id: Math.random().toString(),
      description: compDesc.trim(),
      valA: parseFloat(compValA) || 0,
      valB: parseFloat(compValB) || 0,
    };
    setCompareItems((prev) => [...prev, newItem]);
    setCompDesc('');
    setCompValA('');
    setCompValB('');
  };

  const handleClearCompare = () => {
    setCompareItems([]);
  };

  const totalA = compareItems.reduce((sum, item) => sum + item.valA, 0);
  const totalB = compareItems.reduce((sum, item) => sum + item.valB, 0);
  const cheaperSide = totalA === totalB ? 'Equal' : totalA < totalB ? 'Side A' : 'Side B';
  const diffCheaper = Math.abs(totalA - totalB);

  // Calendar calculations
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const offset = direction === 'prev' ? -1 : 1;
      return new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDay }, (_, i) => null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Mock schedule data for calendar display
  const mockSchedules = isVendor ? [
    { time: '10:00 AM', label: 'Premium Haircut', client: 'Rohan Dev' },
    { time: '12:30 PM', label: 'Table Booking', client: 'Maya Sen' },
    { time: '03:00 PM', label: 'Yoga Fitness Session', client: 'Kiran Lal' },
  ] : [
    { time: '10:15 AM', label: 'Flight Booking (MAA ➜ BLR)', ref: 'PNR FL-209' },
    { time: '04:00 PM', label: 'Doctor Appointment (General)', ref: 'DOC-9081' },
    { time: '08:00 PM', label: 'Avengers: Secret Wars', ref: 'TKT-8291' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-x-0 bottom-0 top-16 z-[120] bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Panel - dynamically resizes based on active tab */}
          <motion.div
            initial={{ x: '100%', width: 90 }}
            animate={{ x: 0, width: activeTab ? 390 : 90 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-16 bottom-0 z-[130] bg-slate-950/95 backdrop-blur-xl border-l border-white/10 text-white shadow-2xl flex flex-row overflow-hidden"
          >
            {/* Left Content Panel (300px) - slides out to the left of the sidebar */}
            <AnimatePresence mode="wait">
              {activeTab && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 300 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                  className="h-full border-r border-white/10 flex flex-col overflow-hidden select-none shrink-0"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[color:var(--color-primary)] animate-pulse" />
                      <h4 className="font-extrabold text-[11px] uppercase tracking-widest text-[#fceea7] font-sans">
                        {activeTab === 'calc' ? 'Beta Calculator' : 'Beta Calendar'}
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveTab(null)}
                      className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Collapse Panel"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-left font-sans">
                    {activeTab === 'calc' ? (
                      <div className="space-y-4">
                        {/* Calculator Ledger / Compare mode */}
                        {compareMode ? (
                          <div className="rounded-xl border border-white/10 bg-white/[0.01] p-3 text-[11px] space-y-3">
                            <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                              <span className="font-black uppercase text-[9px] tracking-wider text-slate-400">Price Compare Ledger</span>
                              <button
                                type="button"
                                onClick={handleClearCompare}
                                className="text-red-400 hover:text-red-300 font-bold cursor-pointer"
                                title="Clear compare table"
                              >
                                Clear
                              </button>
                            </div>

                            <div className="max-h-28 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                              {compareItems.length === 0 ? (
                                <p className="text-slate-500 italic text-[10px] text-center py-2">
                                  No comparison items yet. Add description and values below.
                                </p>
                              ) : (
                                compareItems.map((item) => (
                                  <div key={item.id} className="flex justify-between border-b border-white/5 py-1 text-slate-300 font-mono">
                                    <span className="truncate max-w-[140px] font-sans">{item.description}</span>
                                    <span>
                                      {currencySymbol}{item.valA} vs {currencySymbol}{item.valB}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Totals */}
                            {compareItems.length > 0 && (
                              <div className="border-t border-white/10 pt-2 space-y-1.5 font-mono">
                                <div className="flex justify-between text-slate-400 font-bold">
                                  <span>Total Side A:</span>
                                  <span>{currencySymbol}{totalA.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 font-bold">
                                  <span>Total Side B:</span>
                                  <span>{currencySymbol}{totalB.toFixed(2)}</span>
                                </div>
                                <div className="pt-1 text-[10.5px] font-sans text-emerald-400 flex items-center justify-between border-t border-dashed border-white/10">
                                  <span>Cheaper Option:</span>
                                  <span className="font-black uppercase">
                                    {cheaperSide === 'Equal' ? 'Equal' : `${cheaperSide} (Saved ${currencySymbol}${diffCheaper.toFixed(2)})`}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Add Form */}
                            <form onSubmit={handleAddCompareItem} className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5">
                              <input
                                type="text"
                                required
                                value={compDesc}
                                onChange={(e) => setCompDesc(e.target.value)}
                                placeholder="Item Description"
                                className="col-span-3 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10.5px] outline-none text-white focus:border-indigo-500"
                              />
                              <input
                                type="number"
                                required
                                step="any"
                                value={compValA}
                                onChange={(e) => setCompValA(e.target.value)}
                                placeholder="Side A (₹)"
                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10.5px] outline-none text-white focus:border-indigo-500 font-mono"
                              />
                              <input
                                type="number"
                                required
                                step="any"
                                value={compValB}
                                onChange={(e) => setCompValB(e.target.value)}
                                placeholder="Side B (₹)"
                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10.5px] outline-none text-white focus:border-indigo-500 font-mono"
                              />
                              <button
                                type="submit"
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg flex items-center justify-center cursor-pointer font-bold"
                              >
                                <Plus size={14} />
                              </button>
                            </form>
                          </div>
                        ) : (
                          <>
                            {/* Formula History */}
                            <div className="rounded-xl border border-white/10 bg-white/[0.01] p-3 text-[10.5px] text-slate-400 font-mono space-y-1 min-h-[96px] flex flex-col justify-end">
                              <span className="font-sans font-black uppercase text-[8px] tracking-wider text-slate-500 mb-auto">Tape History</span>
                              {calcHistory.length === 0 ? (
                                <div className="text-center py-4 italic text-slate-600">No calculations recorded</div>
                              ) : (
                                calcHistory.map((h, i) => (
                                  <div key={i} className="text-right truncate">{h}</div>
                                ))
                              )}
                            </div>

                            {/* Display Screen */}
                            <div className="p-3 bg-slate-900 rounded-xl border border-white/10 text-right font-mono">
                              <div className="text-slate-500 text-[10px] h-4 leading-none">
                                {calcResult !== null ? `${calcResult} ${calcOperator}` : ''}
                              </div>
                              <div className="text-2xl font-black text-white mt-1 leading-none truncate">
                                {calcInput || '0'}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Calculator modifiers */}
                        <div className="grid grid-cols-4 gap-1.5 bg-white/[0.02] border border-white/10 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={handleAddGst}
                            className="py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider text-slate-300 cursor-pointer"
                          >
                            +18% GST
                          </button>
                          <button
                            type="button"
                            onClick={handleAddDiscount}
                            className="py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider text-slate-300 cursor-pointer"
                          >
                            -10% Disc
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrencySymbol((prev) => (prev === '₹' ? '$' : '₹'))}
                            className="py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider text-slate-300 cursor-pointer"
                          >
                            {currencySymbol === '₹' ? 'INR (₹)' : 'USD ($)'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCompareMode(!compareMode)}
                            className={`py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-0.5 transition-all ${
                              compareMode
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-none text-white shadow animate-pulse'
                                : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                          >
                            <ArrowLeftRight size={9} />
                            <span>Compare</span>
                          </button>
                        </div>

                        {/* Keypad */}
                        <div className="grid grid-cols-4 gap-2">
                          {['↺', '⌫', '/', '*'].map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => handleCalcBtn(k)}
                              className={`h-10 rounded-xl font-mono text-sm font-black border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                                k === '↺'
                                  ? 'border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-950/35'
                                  : 'border-white/15 bg-white/5 hover:bg-white/10 text-[#fceea7]'
                              }`}
                            >
                              {k === '/' ? '÷' : k === '*' ? '×' : k}
                            </button>
                          ))}

                          {['7', '8', '9', '-'].map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => handleCalcBtn(k)}
                              className="h-10 rounded-xl font-mono text-sm font-bold border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 text-white transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                            >
                              {k}
                            </button>
                          ))}

                          {['4', '5', '6', '+'].map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => handleCalcBtn(k)}
                              className="h-10 rounded-xl font-mono text-sm font-bold border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 text-white transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                            >
                              {k}
                            </button>
                          ))}

                          <div className="col-span-3 grid grid-cols-3 gap-2">
                            {['1', '2', '3'].map((k) => (
                              <button
                                key={k}
                                type="button"
                                onClick={() => handleCalcBtn(k)}
                                className="h-10 rounded-xl font-mono text-sm font-bold border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 text-white transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                              >
                                {k}
                              </button>
                            ))}

                            {['C', '0', '.'].map((k) => (
                              <button
                                key={k}
                                type="button"
                                onClick={() => handleCalcBtn(k)}
                                className="h-10 rounded-xl font-mono text-sm font-bold border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                              >
                                {k}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCalcBtn('=')}
                            className="col-span-1 h-22 rounded-xl bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-mono text-lg font-black transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                          >
                            =
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Calendar Widget */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.01] p-3">
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-xs font-black text-white tracking-wide">
                              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => navigateMonth('prev')}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                <ChevronLeft size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => navigateMonth('next')}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Days header */}
                          <div className="grid grid-cols-7 gap-1 text-center text-[9px] uppercase tracking-wider text-slate-500 font-extrabold mb-1">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                              <div key={d}>{d}</div>
                            ))}
                          </div>

                          {/* Days Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] font-mono">
                            {emptyCells.map((_, i) => (
                              <div key={`empty-${i}`} className="py-1" />
                            ))}
                            {daysArray.map((day) => {
                              const isToday =
                                new Date().getDate() === day &&
                                new Date().getMonth() === currentDate.getMonth() &&
                                new Date().getFullYear() === currentDate.getFullYear();
                              const isSelected =
                                selectedDate.getDate() === day &&
                                selectedDate.getMonth() === currentDate.getMonth() &&
                                selectedDate.getFullYear() === currentDate.getFullYear();

                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                  className={`py-1 rounded-lg transition-all cursor-pointer font-bold relative ${
                                    isSelected
                                      ? 'bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] shadow'
                                      : isToday
                                      ? 'bg-white/15 text-white'
                                      : 'text-slate-300 hover:bg-white/5'
                                  }`}
                                >
                                  <span>{day}</span>
                                  {/* Dot for mock events on some days */}
                                  {[5, 12, 15, 20, 25].includes(day) && (
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* List of Schedules / Active bookings */}
                        <div className="space-y-2.5">
                          <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 block">
                            {isVendor ? 'Daily Slots Schedule' : 'Your Booked Services'}
                          </span>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                            {mockSchedules.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between text-left transition-all hover:bg-white/[0.03]"
                              >
                                <div>
                                  <p className="text-xs font-bold text-slate-200 leading-tight">
                                    {item.label}
                                  </p>
                                  <p className="text-[10px] text-slate-500 mt-1">
                                    {isVendor ? `Client: ${(item as any).client}` : `Reference: ${(item as any).ref}`}
                                  </p>
                                </div>
                                <span className="shrink-0 text-[10px] font-mono font-bold text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10 px-2 py-0.5 rounded border border-[color:var(--color-primary)]/20">
                                  {item.time}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Sidebar (90px) - always visible, displays icons aligned downside */}
            <div className="w-[90px] h-full flex flex-col items-center py-5 bg-white/[0.01] shrink-0 select-none border-l border-white/5">
              {/* Top Sparkles Icon */}
              <div className="h-9 w-9 rounded-xl bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/30 flex items-center justify-center mb-6">
                <Sparkles size={16} className="text-[color:var(--color-primary)] animate-pulse" />
              </div>

              {/* Stack of Icons arranged vertically downside */}
              <div className="flex flex-col gap-4 w-full items-center">
                {/* Calculator Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'calc' ? null : 'calc')}
                  className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'calc'
                      ? 'bg-gradient-to-br from-[#8b6508] to-[#d4af37] border-none text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-white/10'
                  }`}
                  title="Beta Calculator"
                >
                  <Calculator size={16} />
                  <span className="text-[7.5px] font-black uppercase tracking-wider">Calci</span>
                </button>

                {/* Calendar Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'calendar' ? null : 'calendar')}
                  className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'calendar'
                      ? 'bg-gradient-to-br from-[#8b6508] to-[#d4af37] border-none text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-white/10'
                  }`}
                  title="Beta Calendar"
                >
                  <CalendarIcon size={16} />
                  <span className="text-[7.5px] font-black uppercase tracking-wider">Calender</span>
                </button>
              </div>

              {/* Close Button at the bottom */}
              <button
                type="button"
                onClick={onClose}
                className="w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 cursor-pointer mt-auto"
                title="Close Drawer"
              >
                <X size={16} />
                <span className="text-[7.5px] font-black uppercase tracking-wider">Close</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
