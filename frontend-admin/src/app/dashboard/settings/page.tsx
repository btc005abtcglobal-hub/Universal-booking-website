'use client';

import { useVendorStore } from '../../../lib/store';
import { 
  Building2, Mail, Phone, Globe, MapPin, Camera, Save, Info, CheckCircle2, User,
  Calculator, Calendar, Contact, Keyboard, Languages, Scan, CloudSun, Newspaper,
  Settings, Edit, Delete, ChevronRight, X, ArrowLeft, ArrowRight, Play, Eye, Copy, 
  Search, Heart, Bell, Trash2, Check, Thermometer, Wind, Droplets, Sun, Moon, Laptop,
  HelpCircle, Volume2, Plus
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock news data
const NEWS_ITEMS = [
  {
    id: 1,
    title: 'Marketplace Integration Boosts Retail Merchant Sales by 45%',
    category: 'business',
    summary: 'A new statistical report shows local businesses leveraging integrated reservation channels experienced rapid transaction growth this quarter.',
    content: 'The report highlights that scheduling tools and booking portals have lowered friction for customers, leading to a significant increase in reservation completions. Merchants who added personalized booking details like seat layout, cabins, and trainer biographies saw the highest gains.',
    date: 'June 12, 2026',
    likes: 124,
    bookmarked: false
  },
  {
    id: 2,
    title: 'Next-Generation AI Booking Engines Launched in Chennai',
    category: 'tech',
    summary: 'Local startups are testing predictive scheduling assistants that auto-block slot capacities based on weather and city traffic parameters.',
    content: 'By integrating municipal transit metrics and regional weather feeds directly into vendor slot engines, reservation platforms can automatically shift slot availability. Early tests in Chennai showed a 20% reduction in customer no-shows.',
    date: 'June 10, 2026',
    likes: 85,
    bookmarked: true
  },
  {
    id: 3,
    title: 'Wellness Tourism Surges: Luxury Spas See Weekend Booking Spike',
    category: 'lifestyle',
    summary: 'A growing trend in weekend wellness retreats has led to unprecedented spa and resort reservations across southern hill stations.',
    content: 'Hill town destinations like Theni and Coimbatore have seen a surge in reservations for hot stone therapies, mud baths, and wellness coaching. Local homestays and retreats are adding custom wellness packages to capture this premium customer segment.',
    date: 'June 08, 2026',
    likes: 210,
    bookmarked: false
  }
];

export default function SettingsPage() {
  const { currentMerchant, loginRole, supervisorId, theme, setTheme } = useVendorStore();

  // Active Widget Tab State
  const [activeTab, setActiveTab] = useState<string>('settings');
  
  // Search bar input state
  const [searchVal, setSearchVal] = useState('');

  // Widget visibility state (Edit widget panel)
  const [enabledWidgets, setEnabledWidgets] = useState<Record<string, boolean>>({
    calc: true,
    calendar: true,
    contact: true,
    keyboard: true,
    translator: true,
    lens: true,
    weather: true,
    news: true
  });

  // original settings form states
  const getBnxMailId = () => {
    if (!currentMerchant) return '';
    const originalEmail = currentMerchant.email || '';
    if (loginRole === 'supervisor') {
      const supName = supervisorId || 'SUPERVISOR';
      return `${supName}/${originalEmail}`;
    }
    return originalEmail;
  };

  const [name, setName] = useState(currentMerchant?.merchantName || '');
  const [email, setEmail] = useState(getBnxMailId() || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [website, setWebsite] = useState('www.beta-booking.com');
  const [address, setAddress] = useState('42 Anna Nagar, Chennai');
  const [about, setAbout] = useState(currentMerchant?.aboutText || '');

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: ''
  });

  const triggerToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Business profile settings updated successfully.');
  };

  // 1. CALCULATOR STATE & LOGIC
  interface TapeItem {
    id: string;
    operator: string;
    value: number;
    runningTotal: number;
    label: string;
  }

  const [tape, setTape] = useState<TapeItem[]>([
    { id: '1', operator: '=', value: 5, runningTotal: 5, label: '' },
    { id: '2', operator: '+', value: 9, runningTotal: 14, label: '' }
  ]);
  const [calcInput, setCalcInput] = useState('');
  const [calcOperator, setCalcOperator] = useState('+');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [showSci, setShowSci] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  interface CompareRow {
    id: string;
    desc: string;
    valA: number;
    valB: number;
  }
  const [compareRows, setCompareRows] = useState<CompareRow[]>([]);
  const [compDesc, setCompDesc] = useState('');
  const [compValA, setCompValA] = useState('');
  const [compValB, setCompValB] = useState('');

  const handleAddCompareRow = () => {
    if (!compDesc.trim()) {
      triggerToast('Please enter a description.');
      return;
    }
    const valA = parseFloat(compValA) || 0;
    const valB = parseFloat(compValB) || 0;
    const newRow: CompareRow = {
      id: String(Date.now()),
      desc: compDesc.trim(),
      valA,
      valB
    };
    setCompareRows(prev => [...prev, newRow]);
    setCompDesc('');
    setCompValA('');
    setCompValB('');
    triggerToast('Added row to comparison.');
  };

  const handleDeleteCompareRow = (id: string) => {
    setCompareRows(prev => prev.filter(r => r.id !== id));
    triggerToast('Removed row from comparison.');
  };

  const handleClearCompare = () => {
    setCompareRows([]);
    triggerToast('Comparison data cleared.');
  };


  const getTapeTotal = () => {
    if (tape.length === 0) return 0;
    return tape[tape.length - 1].runningTotal;
  };

  const handleCalcBtn = (val: string) => {
    if (val === '↺') {
      setCalcInput('');
    } else if (val === '⌫') {
      setCalcInput(prev => prev.slice(0, -1));
    } else if (val === '=') {
      if (!calcInput) return;
      const inputValue = Number(calcInput);
      if (isNaN(inputValue)) return;
      
      const lastTotal = tape.length > 0 ? tape[tape.length - 1].runningTotal : 0;
      let newTotal = lastTotal;
      
      if (tape.length === 0) {
        newTotal = inputValue;
      } else {
        if (calcOperator === '+') newTotal = lastTotal + inputValue;
        else if (calcOperator === '-') newTotal = lastTotal - inputValue;
        else if (calcOperator === '×' || calcOperator === 'x') newTotal = lastTotal * inputValue;
        else if (calcOperator === '÷' || calcOperator === '/') newTotal = inputValue !== 0 ? lastTotal / inputValue : 0;
      }
      
      const newItem: TapeItem = {
        id: String(Date.now()),
        operator: tape.length === 0 ? '=' : calcOperator,
        value: inputValue,
        runningTotal: newTotal,
        label: ''
      };
      
      setTape(prev => [...prev, newItem]);
      setCalcInput('');
      setCalcOperator('+');
    } else if (['+', '-', '×', '÷', '/', 'x'].includes(val)) {
      const visualOp = val === '/' ? '÷' : val === 'x' ? '×' : val;
      
      if (calcInput) {
        const inputValue = Number(calcInput);
        if (isNaN(inputValue)) return;
        const lastTotal = tape.length > 0 ? tape[tape.length - 1].runningTotal : 0;
        let newTotal = lastTotal;
        
        if (tape.length === 0) {
          newTotal = inputValue;
        } else {
          if (calcOperator === '+') newTotal = lastTotal + inputValue;
          else if (calcOperator === '-') newTotal = lastTotal - inputValue;
          else if (calcOperator === '×' || calcOperator === 'x') newTotal = lastTotal * inputValue;
          else if (calcOperator === '÷' || calcOperator === '/') newTotal = inputValue !== 0 ? lastTotal / inputValue : 0;
        }
        
        const newItem: TapeItem = {
          id: String(Date.now()),
          operator: tape.length === 0 ? '=' : calcOperator,
          value: inputValue,
          runningTotal: newTotal,
          label: ''
        };
        
        setTape(prev => [...prev, newItem]);
        setCalcInput('');
        setCalcOperator(visualOp);
      } else {
        setCalcOperator(visualOp);
      }
    } else if (val === '.') {
      if (!calcInput.includes('.')) {
        setCalcInput(prev => (prev || '0') + '.');
      }
    } else if (['x²', '√x', '1/x', '%'].includes(val)) {
      const num = Number(calcInput || '0');
      if (isNaN(num)) return;
      let res = 0;
      if (val === 'x²') res = num ** 2;
      else if (val === '√x') res = Math.sqrt(num);
      else if (val === '1/x') res = num !== 0 ? 1 / num : 0;
      else if (val === '%') res = num / 100;
      setCalcInput(String(Number(res.toFixed(6))));
    } else {
      setCalcInput(prev => (prev === '0' ? val : prev + val));
    }
  };

  const handleAddGst = () => {
    if (tape.length === 0) {
      triggerToast('Add values to calculator tape first.');
      return;
    }
    const lastTotal = tape[tape.length - 1].runningTotal;
    const gstVal = lastTotal * 0.18;
    const newTotal = lastTotal + gstVal;
    
    const newItem: TapeItem = {
      id: String(Date.now()),
      operator: '+ GST',
      value: gstVal,
      runningTotal: newTotal,
      label: 'GST (18%)'
    };
    setTape(prev => [...prev, newItem]);
    triggerToast('Applied GST (18%) to running total.');
  };

  const handleAddDiscount = () => {
    if (tape.length === 0) {
      triggerToast('Add values to calculator tape first.');
      return;
    }
    const lastTotal = tape[tape.length - 1].runningTotal;
    const discVal = lastTotal * 0.10;
    const newTotal = lastTotal - discVal;
    
    const newItem: TapeItem = {
      id: String(Date.now()),
      operator: '- DSC',
      value: discVal,
      runningTotal: newTotal,
      label: 'Discount (10%)'
    };
    setTape(prev => [...prev, newItem]);
    triggerToast('Applied 10% Discount to running total.');
  };

  const handleToggleCurrency = () => {
    setCurrencySymbol(prev => (prev === '₹' ? '$' : '₹'));
    triggerToast(`Currency display switched.`);
  };

  const handleUpdateTapeLabel = (id: string, text: string) => {
    setTape(prev => prev.map(item => item.id === id ? { ...item, label: text } : item));
  };

  const handleClearTape = () => {
    setTape([]);
    triggerToast('Tape ledger cleared.');
  };

  const handleLoadMockTape = () => {
    setTape([
      { id: '1', operator: '=', value: 100, runningTotal: 100, label: 'Initial Deposit' },
      { id: '2', operator: '+', value: 45, runningTotal: 145, label: 'Service Fee' },
      { id: '3', operator: '- DSC', value: 14.5, runningTotal: 130.5, label: 'Promo Code' },
      { id: '4', operator: '+ GST', value: 23.49, runningTotal: 153.99, label: 'GST (18%)' }
    ]);
    triggerToast('Mock history tape loaded.');
  };

  const handleShareTape = () => {
    const transcript = tape.map(t => `${t.operator || '='} ${currencySymbol}${t.value} [${t.label || 'no label'}] (Total: ${currencySymbol}${t.runningTotal})`).join('\n');
    navigator.clipboard.writeText(transcript);
    triggerToast('Calculation link & history copied to clipboard!');
  };

  // 2. CALENDAR STATE & LOGIC
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed: 5)
  const [selectedCalDate, setSelectedCalDate] = useState<number | null>(13);
  const [calNotes, setCalNotes] = useState<Record<string, string[]>>({
    '2026-06-13': ['Client Reservation Check-in (10:00 AM)', 'Staff Shift Handover meeting'],
    '2026-06-15': ['Rooftop Dining Table inspection', 'Promotional Discount review'],
    '2026-06-20': ['Avengers Movie premiere setup']
  });
  const [newNoteText, setNewNoteText] = useState('');

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayIndex = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedCalDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedCalDate(null);
  };

  const handleAddCalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCalDate || !newNoteText.trim()) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedCalDate).padStart(2, '0')}`;
    setCalNotes(prev => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), newNoteText.trim()]
    }));
    setNewNoteText('');
    triggerToast('Reminder note added successfully.');
  };

  // 3. CONTACT STATE & LOGIC
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Sandeep Anand', email: 'sandy@gmail.com', phone: '+91 98765 11223', notes: 'Frequent customer for Table Dining.' },
    { id: 2, name: 'Aravind Swamy', email: 'aravind@bnxmail.com', phone: '+91 94432 88990', notes: 'Vendor Partner coordinator.' },
    { id: 3, name: 'Dr. John Watson', email: 'watson@health.org', phone: '+91 80556 12345', notes: 'Clinic referral client.' }
  ]);
  const [contactSearch, setContactSearch] = useState('');
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', notes: '' });

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    setContacts(prev => [
      ...prev,
      { id: Date.now(), ...newContact }
    ]);
    setNewContact({ name: '', email: '', phone: '', notes: '' });
    triggerToast('Contact saved successfully.');
  };

  const handleDeleteContact = (id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    triggerToast('Contact removed.');
  };

  // 4. VIRTUAL KEYBOARD STATE & LOGIC
  const [kbdText, setKbdText] = useState('');
  const [isShift, setIsShift] = useState(false);

  const kbdRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '⌫'],
    ['Space', 'Clear', 'Copy']
  ];

  const handleKbdPress = (key: string) => {
    if (key === 'Space') {
      setKbdText(prev => prev + ' ');
    } else if (key === 'Clear') {
      setKbdText('');
    } else if (key === '⌫') {
      setKbdText(prev => prev.slice(0, -1));
    } else if (key === 'Shift') {
      setIsShift(prev => !prev);
    } else if (key === 'Copy') {
      navigator.clipboard.writeText(kbdText);
      triggerToast('Text copied to clipboard!');
    } else {
      const char = isShift ? key.toUpperCase() : key.toLowerCase();
      setKbdText(prev => prev + char);
      if (isShift) setIsShift(false); // Reset shift after one input
    }
  };

  // 5. TRANSLATOR STATE & LOGIC
  const [translateText, setTranslateText] = useState('');
  const [targetLang, setTargetLang] = useState('spanish');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = () => {
    if (!translateText.trim()) return;
    setIsTranslating(true);
    setTimeout(() => {
      const dictionary: Record<string, Record<string, string>> = {
        spanish: { hello: 'Hola', goodbye: 'Adiós', thanks: 'Gracias', welcome: 'Bienvenido', business: 'Negocio', settings: 'Ajustes', time: 'Tiempo' },
        french: { hello: 'Bonjour', goodbye: 'Au revoir', thanks: 'Merci', welcome: 'Bienvenue', business: 'Entreprise', settings: 'Paramètres', time: 'Temps' },
        german: { hello: 'Hallo', goodbye: 'Auf Wiedersehen', thanks: 'Danke', welcome: 'Willkommen', business: 'Geschäft', settings: 'Einstellungen', time: 'Zeit' },
        japanese: { hello: 'こんにちは (Konnichiwa)', goodbye: 'さようなら (Sayounara)', thanks: 'ありがとう (Arigatou)', welcome: '歓迎 (Kangei)', business: 'ビジネス (Bijinesu)', settings: '設定 (Settei)', time: '時間 (Jikan)' },
        tamil: { hello: 'வணக்கம் (Vanakkam)', goodbye: 'சென்று வருகிறேன் (Sendru Varugiren)', thanks: 'நன்றி (Nandri)', welcome: 'வரவேற்பு (Varavaerpu)', business: 'வணிகம் (Vanigam)', settings: 'அமைப்புகள் (Amaippugal)', time: 'நேரம் (Naeram)' }
      };
      
      const words = translateText.toLowerCase().split(/\s+/);
      const transResult = words.map(w => {
        const cleanWord = w.replace(/[^a-z]/g, '');
        const dict = dictionary[targetLang];
        if (dict && dict[cleanWord]) {
          return dict[cleanWord] + (w.endsWith('.') ? '.' : w.endsWith(',') ? ',' : '');
        }
        // Pseudo-translation suffix
        const suffix = targetLang === 'spanish' ? 'o' : targetLang === 'french' ? 'e' : targetLang === 'german' ? 'en' : '';
        return cleanWord ? cleanWord + suffix : w;
      });

      setTranslatedText(transResult.join(' '));
      setIsTranslating(false);
      triggerToast('Translation completed.');
    }, 600);
  };

  // 6. LENS STATE & LOGIC
  const [selectedLensImg, setSelectedLensImg] = useState<number>(1);
  const [lensZoom, setLensZoom] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const lensGallery = [
    { id: 1, title: 'Rooftop Table Layout', category: 'Dining', desc: 'Main Dining Hall with 4-Guest seating setup.', detail: 'Detected Category: DINING. Seating Area: Rooftop Pavilion. Table Capacity: 4 guests. Status: Available.' },
    { id: 2, title: 'Medical Cabin interior', category: 'Medical', desc: 'Sanitized patient dental care suite.', detail: 'Detected Category: MEDICAL/DOCTOR. Specialization: Orthodontics. Room Cabin: Cabinet #2. Equipment: Sanitized.' },
    { id: 3, title: 'Cinema Projection Room', category: 'Entertainment', desc: 'Screen 1 projector room.', detail: 'Detected Category: CINEMA. Screen: Screen #1. Poster Identified: Avengers: Secret Wars.' }
  ];

  const handleScanLens = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      const matched = lensGallery.find(item => item.id === selectedLensImg);
      setScanResult(matched ? matched.detail : 'No recognizable environment detected.');
      triggerToast('Lens scan completed.');
    }, 1500);
  };

  // 7. WEATHER STATE & LOGIC
  const [selectedWeatherCity, setSelectedWeatherCity] = useState('Chennai');
  const weatherData: Record<string, { temp: number; desc: string; humidity: number; wind: number; icon: string; forecast: { day: string; temp: number; desc: string }[] }> = {
    Chennai: {
      temp: 32,
      desc: 'Humid and Mostly Sunny',
      humidity: 82,
      wind: 14,
      icon: '☀️',
      forecast: [
        { day: 'Sun', temp: 33, desc: 'Sunny' },
        { day: 'Mon', temp: 31, desc: 'Partly Cloudy' },
        { day: 'Tue', temp: 32, desc: 'Isolated Showers' }
      ]
    },
    Bangalore: {
      temp: 24,
      desc: 'Pleasant and Cloudy',
      humidity: 62,
      wind: 16,
      icon: '☁️',
      forecast: [
        { day: 'Sun', temp: 25, desc: 'Passing Clouds' },
        { day: 'Mon', temp: 24, desc: 'Light Rain' },
        { day: 'Tue', temp: 26, desc: 'Partly Sunny' }
      ]
    },
    Mumbai: {
      temp: 29,
      desc: 'Tropical Coastal Breeze',
      humidity: 76,
      wind: 18,
      icon: '🌦️',
      forecast: [
        { day: 'Sun', temp: 29, desc: 'Showers' },
        { day: 'Mon', temp: 30, desc: 'Humid' },
        { day: 'Tue', temp: 28, desc: 'Heavy Rain' }
      ]
    },
    Delhi: {
      temp: 37,
      desc: 'Hot and Dry Winds',
      humidity: 38,
      wind: 9,
      icon: '☀️',
      forecast: [
        { day: 'Sun', temp: 39, desc: 'Extreme Heat' },
        { day: 'Mon', temp: 38, desc: 'Dry Gale' },
        { day: 'Tue', temp: 36, desc: 'Dust Storm' }
      ]
    }
  };

  // 8. NEWS STATE & LOGIC
  const [newsFilter, setNewsFilter] = useState('all');
  const [newsList, setNewsList] = useState(NEWS_ITEMS);
  const [activeArticleModal, setActiveArticleModal] = useState<any | null>(null);

  const handleLikeNews = (id: number) => {
    setNewsList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    }));
  };

  const handleBookmarkNews = (id: number) => {
    setNewsList(prev => prev.map(item => {
      if (item.id === id) {
        const newBookmarkState = !item.bookmarked;
        triggerToast(newBookmarkState ? 'News bookmarked.' : 'Bookmark removed.');
        return { ...item, bookmarked: newBookmarkState };
      }
      return item;
    }));
  };

  if (!currentMerchant) {
    return <div className="text-center text-slate-500 py-10">Loading settings console...</div>;
  }

  // Filter widgets by enabling preference
  const visibleTabs = [
    { id: 'settings', label: 'Business Profile', icon: Settings },
    ...(enabledWidgets.calc ? [{ id: 'calc', label: 'Beta Calculator', icon: Calculator }] : []),
    ...(enabledWidgets.calendar ? [{ id: 'calendar', label: 'Beta Calendar', icon: Calendar }] : []),
    ...(enabledWidgets.contact ? [{ id: 'contact', label: 'Beta Contact', icon: Contact }] : []),
    ...(enabledWidgets.keyboard ? [{ id: 'keyboard', label: 'Beta Keyboard', icon: Keyboard }] : []),
    ...(enabledWidgets.translator ? [{ id: 'translator', label: 'Beta Translator', icon: Languages }] : []),
    ...(enabledWidgets.lens ? [{ id: 'lens', label: 'Beta Lens', icon: Scan }] : []),
    ...(enabledWidgets.weather ? [{ id: 'weather', label: 'Beta Weather', icon: CloudSun }] : []),
    ...(enabledWidgets.news ? [{ id: 'news', label: 'Beta News', icon: Newspaper }] : []),
    { id: 'edit', label: 'Launcher Panel Edit', icon: Edit }
  ];

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      {/* SUCCESS TOAST ALERT */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-[#0c1613] px-4 py-3 text-xs font-bold text-emerald-400 shadow-2xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER ROW - MATCHING DIAGRAM */}
      <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 border-b border-border-brand pb-4">
        {/* Left: Cliks Business Style Pills */}
        <div className="flex items-center gap-1.5 self-center">
          <div className="flex items-center gap-1 bg-bg-secondary p-1 rounded-xl border border-border-brand shadow-sm">
            <button className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase bg-[#8b6508] text-white tracking-wider cursor-pointer">B</button>
            <button className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase text-text-secondary hover:text-text-primary hover:bg-bg-tertiary tracking-wider cursor-pointer">Pay</button>
            <button className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase text-text-secondary hover:text-text-primary hover:bg-bg-tertiary tracking-wider cursor-pointer">Soc</button>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-sm self-center">
          <div className="flex items-center gap-2.5 rounded-xl border border-border-brand bg-bg-secondary px-3 py-2">
            <Search className="h-4 w-4 text-text-secondary shrink-0" />
            <input 
              type="text" 
              placeholder="SEARCH..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="flex-1 bg-transparent outline-none text-xs text-text-primary uppercase placeholder-text-muted"
            />
          </div>
        </div>

        {/* Right: Points, Profile Dropdown, and Logo in top right corner */}
        <div className="flex items-center gap-3 self-center ml-auto">
          {/* Points badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8b6508]/15 border border-[#8b6508]/25 text-[#fceea7] text-[10px] font-black tracking-wide">
            🏆 PTS
          </div>
          {/* Profile Name Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-secondary border border-border-brand text-xs font-bold text-text-primary">
            👤 Profile
          </div>

          {/* Logo container placed in top-right block with vertical separating divider */}
          <div className="border-l border-border-brand pl-4 flex items-center shrink-0">
            <div className="h-10 w-10 rounded-lg bg-bg-secondary border border-border-brand overflow-hidden flex items-center justify-center shadow-md p-1">
              <img src="/logo.png" alt="Merchant Logo" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD SPLIT GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
        {/* LEFT / CENTER PANEL: MAIN ACTIVE COMPONENT */}
        <div className="lg:col-span-3 min-h-[500px] rounded-2xl border border-border-brand bg-bg-secondary p-6 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              
              {/* COMPONENT: ORIGINAL SETTINGS FORM */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="border-b border-border-brand pb-3">
                    <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="text-[#d4af37] h-4.5 w-4.5" /> Merchant Business Settings
                    </h2>
                    <p className="text-[11px] text-text-secondary">Edit your business coordinates and details published on user listings.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Business Name</label>
                      <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                        <Building2 className="h-4 w-4 text-text-secondary shrink-0" />
                        <input 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          className="flex-1 bg-transparent outline-none text-xs text-text-primary font-medium" 
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Company Email</label>
                          <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded border border-indigo-500/20">BNX INTEGRATED</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                          <Mail className="h-4 w-4 text-text-secondary shrink-0" />
                          <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-xs text-text-primary font-medium" 
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Telephone / Support Line</label>
                        <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                          <Phone className="h-4 w-4 text-text-secondary shrink-0" />
                          <input 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-xs text-text-primary font-medium" 
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Website URL</label>
                        <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                          <Globe className="h-4 w-4 text-text-secondary shrink-0" />
                          <input 
                            value={website} 
                            onChange={(e) => setWebsite(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-xs text-text-primary font-medium" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Address Coordinates</label>
                        <div className="flex items-center gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                          <MapPin className="h-4 w-4 text-text-secondary shrink-0" />
                          <input 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-xs text-text-primary font-medium" 
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">About Description</label>
                      <div className="flex items-start gap-3 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                        <Info className="h-4 w-4 text-text-secondary shrink-0 mt-1" />
                        <textarea 
                          rows={3}
                          value={about} 
                          onChange={(e) => setAbout(e.target.value)}
                          className="flex-1 bg-transparent outline-none text-xs text-text-primary resize-none font-medium" 
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#8b6508] hover:bg-[#664a05] py-3 text-xs font-bold text-white transition-all shadow-md shadow-[#8b6508]/10 cursor-pointer"
                    >
                      <Save size={14} /> Save Profile Settings
                    </button>
                  </div>

                  {/* Supervisor details card */}
                  {(loginRole === 'supervisor' || currentMerchant.assignSupervisor) && (
                    <div className="rounded-xl border border-border-brand bg-bg-primary/10 p-5 space-y-3 mt-4">
                      <h3 className="font-extrabold text-xs text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-brand pb-2">
                        <User size={14} className="text-[#d4af37]" /> Supervisor Assignment coordinates
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-text-secondary block">Supervisor Name</span>
                          <span className="text-text-primary font-semibold block">{currentMerchant.supervisorName || supervisorId || 'Supervisor Agent'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-text-secondary block">Supervisor Contact</span>
                          <span className="text-text-primary font-semibold block">{currentMerchant.supervisorPhone || '+91 98765 43210'}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[9px] uppercase font-bold text-[#d4af37] block">Integrated BNX Mail ID</span>
                          <span className="text-[#fceea7] font-mono block mt-0.5">{getBnxMailId()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Static Hours */}
                  <div className="rounded-xl border border-border-brand bg-bg-primary/10 p-5 space-y-2">
                    <h3 className="font-extrabold text-xs text-text-primary uppercase tracking-wider block">Default Business Hours</h3>
                    <div className="flex justify-between text-xs text-text-secondary font-medium">
                      <span>Mon - Fri</span>
                      <span className="text-text-primary">09:00 AM - 08:00 PM</span>
                    </div>
                    <div className="flex justify-between text-xs text-text-secondary font-medium">
                      <span>Saturday</span>
                      <span className="text-text-primary">10:00 AM - 06:00 PM</span>
                    </div>
                  </div>
                </form>
              )}

              {/* COMPONENT: CALCULATOR */}
              {activeTab === 'calc' && (
                <div className="space-y-6">
                  {/* Top Header of Calc */}
                  <div className="flex items-center justify-between border-b border-border-brand pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-[#d4af37]">#</span>
                      <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider">
                        Beta Calculator
                      </h2>
                    </div>
                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleLoadMockTape}
                        className="p-1.5 rounded-lg border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all cursor-pointer flex items-center justify-center"
                        title="Load Tape History"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                      </button>
                      <button 
                        onClick={handleShareTape}
                        className="p-1.5 rounded-lg border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all cursor-pointer flex items-center justify-center"
                        title="Share / Copy Tape Transcript"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                      </button>
                      <button 
                        onClick={compareMode ? handleClearCompare : handleClearTape}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer flex items-center justify-center"
                        title={compareMode ? "Clear Comparison Table" : "Clear Tape History"}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="p-1.5 rounded-lg border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all cursor-pointer flex items-center justify-center"
                        title="Close"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Calculator Body Container */}
                    <div className="md:col-span-2 border border-border-brand rounded-2xl bg-bg-primary/30 shadow-lg overflow-hidden flex flex-col justify-between max-w-sm mx-auto w-full">
                      
                      {/* 1. Calculator History / Tape View or Price Comparison */}
                      {compareMode ? (
                        <div className="p-4 flex flex-col justify-between h-[280px] border-b border-border-brand bg-bg-primary/10 overflow-hidden">
                          {/* Price Comparison Header */}
                          <div className="flex items-center gap-1.5 mb-2 shrink-0">
                            <span className="text-xs">⚖️</span>
                            <span className="text-[10px] uppercase font-black tracking-wider text-[#6366f1]">
                              Price Comparison
                            </span>
                          </div>

                          {/* Table Container */}
                          <div className="flex-1 border border-border-brand bg-bg-secondary/50 rounded-xl overflow-hidden flex flex-col justify-between">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-1 px-3 py-1.5 border-b border-border-brand bg-bg-tertiary/50 text-[9px] uppercase font-black text-text-secondary shrink-0">
                              <div className="col-span-5 text-left text-text-muted">Description</div>
                              <div className="col-span-3 text-right text-blue-400">Side A</div>
                              <div className="col-span-3 text-right text-purple-400">Side B</div>
                              <div className="col-span-1"></div>
                            </div>

                            {/* Table Body (Scrollable) */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                              {compareRows.length > 0 ? (
                                <>
                                  {compareRows.map((row) => (
                                    <div key={row.id} className="grid grid-cols-12 gap-1 items-center px-2 py-1 rounded bg-bg-primary/20 text-[10px] font-semibold text-text-primary">
                                      <div className="col-span-5 truncate text-left">{row.desc}</div>
                                      <div className="col-span-3 text-right font-mono text-blue-300">{currencySymbol}{row.valA.toFixed(2)}</div>
                                      <div className="col-span-3 text-right font-mono text-purple-300">{currencySymbol}{row.valB.toFixed(2)}</div>
                                      <div className="col-span-1 text-center">
                                        <button 
                                          type="button"
                                          onClick={() => handleDeleteCompareRow(row.id)}
                                          className="text-red-400 hover:text-red-300 font-extrabold text-[11px] p-0.5"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Totals Row */}
                                  <div className="grid grid-cols-12 gap-1 items-center px-2 py-1 border-t border-border-brand/40 mt-1.5 font-bold text-[9px] uppercase text-text-secondary bg-bg-tertiary/20">
                                    <div className="col-span-5 text-left text-text-muted">Total</div>
                                    <div className="col-span-3 text-right font-mono text-blue-400">{currencySymbol}{compareRows.reduce((s, r) => s + r.valA, 0).toFixed(2)}</div>
                                    <div className="col-span-3 text-right font-mono text-purple-400">{currencySymbol}{compareRows.reduce((s, r) => s + r.valB, 0).toFixed(2)}</div>
                                    <div className="col-span-1"></div>
                                  </div>

                                  {/* Comparison summary line */}
                                  {(() => {
                                    const sumA = compareRows.reduce((s, r) => s + r.valA, 0);
                                    const sumB = compareRows.reduce((s, r) => s + r.valB, 0);
                                    const diff = Math.abs(sumA - sumB);
                                    let statusMsg = "Side A = Side B";
                                    if (sumA > sumB) {
                                      statusMsg = `Side B is cheaper by ${currencySymbol}${diff.toFixed(2)}`;
                                    } else if (sumB > sumA) {
                                      statusMsg = `Side A is cheaper by ${currencySymbol}${diff.toFixed(2)}`;
                                    }
                                    return (
                                      <div className="text-[9px] font-bold text-center text-[#d4af37] pt-1 border-t border-dashed border-border-brand/30">
                                        ⚖️ {statusMsg}
                                      </div>
                                    );
                                  })()}
                                </>
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-6 text-text-muted select-none">
                                  <span className="text-[10px] font-semibold italic block">No comparison items yet.</span>
                                  <span className="text-[9px] font-semibold italic block mt-0.5 text-text-muted/65">Add description and values below.</span>
                                </div>
                              )}
                            </div>

                            {/* Table Input Row (Sticky at bottom of table container) */}
                            <div className="grid grid-cols-12 gap-1 p-2 bg-bg-tertiary/60 border-t border-border-brand shrink-0">
                              <input 
                                type="text"
                                placeholder="Description"
                                value={compDesc}
                                onChange={(e) => setCompDesc(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCompareRow()}
                                className="col-span-5 bg-bg-primary border border-border-brand rounded px-1.5 py-1 text-[10px] text-text-primary placeholder-text-muted focus:outline-none focus:border-[#d4af37]"
                              />
                              <input 
                                type="text"
                                placeholder="Val A"
                                value={compValA}
                                onChange={(e) => setCompValA(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCompareRow()}
                                className="col-span-3 bg-bg-primary border border-border-brand rounded px-1.5 py-1 text-[10px] text-text-primary text-right placeholder-text-muted focus:outline-none focus:border-blue-400 font-mono"
                              />
                              <input 
                                type="text"
                                placeholder="Val B"
                                value={compValB}
                                onChange={(e) => setCompValB(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCompareRow()}
                                className="col-span-3 bg-bg-primary border border-border-brand rounded px-1.5 py-1 text-[10px] text-text-primary text-right placeholder-text-muted focus:outline-none focus:border-purple-400 font-mono"
                              />
                              <div className="col-span-1 flex items-center justify-center">
                                <button 
                                  type="button"
                                  onClick={handleAddCompareRow}
                                  className="h-5.5 w-5.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white flex items-center justify-center text-xs font-black shadow-md cursor-pointer transition-colors active:scale-90"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* 1. Calculator History / Tape View */}
                          <div className="p-4 space-y-3 max-h-56 overflow-y-auto custom-scrollbar border-b border-border-brand bg-bg-primary/10">
                            {tape.length > 0 ? (
                              tape.map((item) => (
                                <div key={item.id} className="flex flex-col gap-1 border-b border-white/[0.03] pb-2 last:border-0 last:pb-0">
                                  {/* Label input row */}
                                  <div className="flex items-center gap-1 pl-6">
                                    <Plus size={10} className="text-text-muted shrink-0" />
                                    <input
                                      type="text"
                                      value={item.label}
                                      onChange={(e) => handleUpdateTapeLabel(item.id, e.target.value)}
                                      placeholder="Add label..."
                                      className="bg-transparent border-none outline-none text-[10px] text-text-secondary placeholder-text-muted w-full font-semibold focus:ring-0"
                                    />
                                    {item.label && (
                                      <button 
                                        onClick={() => handleUpdateTapeLabel(item.id, '')}
                                        className="text-text-muted hover:text-white px-1 text-[9px]"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                  {/* Numbers row */}
                                  <div className="flex justify-between items-center text-xs font-mono">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                      <span className="text-text-muted font-bold w-4 text-center">{item.operator || '='}</span>
                                      <span className="font-extrabold text-white">{item.value}</span>
                                    </div>
                                    <span className="font-black text-[#10b981]">{currencySymbol}{item.runningTotal}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-12 text-[10px] text-text-muted font-semibold italic">Tape is empty. Start typing calculations...</div>
                            )}
                          </div>

                          {/* 2. Current Work Area / CONTINUE */}
                          <div className="p-4 bg-bg-secondary/40 border-b border-border-brand">
                            <span className="text-[9px] uppercase font-black tracking-widest text-text-secondary block">Continue</span>
                            <div className="flex justify-between items-end mt-1 font-mono">
                              <span className="text-sm font-black text-[#d4af37]">{calcOperator}</span>
                              <span className="text-2xl font-black text-white">{calcInput || '0'}</span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* 3. Extra Tabs Row */}
                      <div className="p-3 bg-bg-primary/20 border-b border-border-brand flex items-center justify-between gap-1.5 overflow-x-auto custom-scrollbar">
                        <button 
                          onClick={handleAddGst}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#d4af37]/35 bg-[#d4af37]/5 hover:bg-[#d4af37]/15 text-[10px] font-black text-[#fceea7] tracking-wider transition-all cursor-pointer whitespace-nowrap"
                        >
                          <span className="text-emerald-400 font-extrabold">%</span> GST
                        </button>
                        <button 
                          onClick={handleAddDiscount}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#d4af37]/35 bg-[#d4af37]/5 hover:bg-[#d4af37]/15 text-[10px] font-black text-[#fceea7] tracking-wider transition-all cursor-pointer whitespace-nowrap"
                        >
                          <span>🏷️</span> Discount
                        </button>
                        <button 
                          onClick={handleToggleCurrency}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#d4af37]/35 bg-[#d4af37]/5 hover:bg-[#d4af37]/15 text-[10px] font-black text-[#fceea7] tracking-wider transition-all cursor-pointer whitespace-nowrap"
                        >
                          <span>🌐</span> {currencySymbol === '₹' ? 'INR' : 'USD'}
                        </button>
                        <button 
                          onClick={() => setCompareMode(!compareMode)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap text-[10px] font-black tracking-wider ${
                            compareMode
                              ? 'bg-[#8b6508] border-[#8b6508]/20 text-white'
                              : 'border-[#d4af37]/35 bg-[#d4af37]/5 hover:bg-[#d4af37]/15 text-[#fceea7]'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg> Compare
                        </button>
                      </div>

                      {/* 4. Calculator Keypad */}
                      <div className="p-4 bg-bg-secondary/20">
                        {/* Scientific Keys Row (Shown only if SCI mode active) */}
                        {showSci && (
                          <div className="grid grid-cols-4 gap-2 mb-2.5">
                            {['x²', '√x', '1/x', '%'].map((k) => (
                              <button 
                                key={k} 
                                onClick={() => handleCalcBtn(k)} 
                                className="h-9 rounded-lg border border-border-brand bg-bg-tertiary/40 hover:bg-bg-tertiary text-[10px] font-bold text-text-primary transition-all active:scale-95 cursor-pointer font-mono"
                              >
                                {k}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Main Grid */}
                        <div className="grid grid-cols-4 gap-2">
                          {/* Row 1 */}
                          <button onClick={() => handleCalcBtn('↺')} className="h-11 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/15 text-xs font-black text-red-400 transition-all active:scale-95 cursor-pointer">↺</button>
                          <button onClick={() => handleCalcBtn('⌫')} className="h-11 rounded-xl border border-border-brand bg-bg-tertiary hover:bg-bg-tertiary/80 text-xs font-bold text-[#d4af37] transition-all active:scale-95 cursor-pointer">⌫</button>
                          <button onClick={() => handleCalcBtn('/')} className="h-11 rounded-xl border border-[#8b6508]/10 bg-[#8b6508]/5 hover:bg-[#8b6508]/15 text-xs font-black text-[#d4af37] transition-all active:scale-95 cursor-pointer">÷</button>
                          <button onClick={() => handleCalcBtn('x')} className="h-11 rounded-xl border border-[#8b6508]/10 bg-[#8b6508]/5 hover:bg-[#8b6508]/15 text-xs font-black text-[#d4af37] transition-all active:scale-95 cursor-pointer">×</button>

                          {/* Row 2 */}
                          <button onClick={() => handleCalcBtn('7')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">7</button>
                          <button onClick={() => handleCalcBtn('8')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">8</button>
                          <button onClick={() => handleCalcBtn('9')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">9</button>
                          <button onClick={() => handleCalcBtn('-')} className="h-11 rounded-xl border border-[#8b6508]/10 bg-[#8b6508]/5 hover:bg-[#8b6508]/15 text-xs font-black text-[#d4af37] transition-all active:scale-95 cursor-pointer">-</button>

                          {/* Row 3 */}
                          <button onClick={() => handleCalcBtn('4')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">4</button>
                          <button onClick={() => handleCalcBtn('5')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">5</button>
                          <button onClick={() => handleCalcBtn('6')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">6</button>
                          <button onClick={() => handleCalcBtn('+')} className="h-11 rounded-xl border border-[#8b6508]/10 bg-[#8b6508]/5 hover:bg-[#8b6508]/15 text-xs font-black text-[#d4af37] transition-all active:scale-95 cursor-pointer">+</button>

                          {/* Row 4 & 5 (spanned layout) */}
                          <div className="col-span-3 grid grid-cols-3 gap-2">
                            <button onClick={() => handleCalcBtn('1')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">1</button>
                            <button onClick={() => handleCalcBtn('2')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">2</button>
                            <button onClick={() => handleCalcBtn('3')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">3</button>
                            
                            <button 
                              onClick={() => {
                                setShowSci(!showSci);
                                triggerToast(showSci ? 'Scientific keys hidden' : 'Scientific keys enabled');
                              }} 
                              className={`h-11 rounded-xl border text-xs font-black transition-all active:scale-95 cursor-pointer ${
                                showSci 
                                  ? 'bg-[#8b6508] border-[#8b6508]/20 text-white' 
                                  : 'border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-text-secondary'
                              }`}
                            >
                              SCI
                            </button>
                            <button onClick={() => handleCalcBtn('0')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">0</button>
                            <button onClick={() => handleCalcBtn('.')} className="h-11 rounded-xl border border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-xs font-bold text-text-primary transition-all active:scale-95 cursor-pointer">.</button>
                          </div>

                          {/* Equals Key spanning vertically */}
                          <button 
                            onClick={() => handleCalcBtn('=')} 
                            className="h-24 rounded-xl border border-[#8b6508]/20 bg-[#8b6508] hover:bg-[#664a05] text-white text-lg font-black transition-all active:scale-95 cursor-pointer flex items-center justify-center row-span-2"
                          >
                            =
                          </button>
                        </div>
                      </div>

                      {/* 5. Bottom Running Total Bar */}
                      <div className="bg-bg-tertiary border-t border-border-brand p-3.5 flex justify-between items-center">
                        <span className="text-[9px] uppercase font-black tracking-widest text-text-secondary">Tape Running Total</span>
                        <span className="text-base font-black text-[#10b981] font-mono">{currencySymbol}{getTapeTotal().toFixed(2)}</span>
                      </div>

                    </div>

                    {/* Side Panel: Compare panel or standard calculator info */}
                    <div className="rounded-xl border border-border-brand bg-bg-primary/20 p-4 space-y-3">
                      <h3 className="text-xs uppercase font-extrabold text-[#d4af37] tracking-wider border-b border-border-brand pb-2">
                        {compareMode ? 'Compare Ledger' : 'Utility Help'}
                      </h3>
                      {compareMode ? (
                        <div className="space-y-3 text-xs">
                          <span className="text-[10px] text-text-secondary block font-semibold leading-normal">Compare your current running total against standard business thresholds:</span>
                          <div className="space-y-2 font-semibold">
                            <div className="p-2.5 rounded-lg bg-bg-secondary border border-border-brand flex justify-between">
                              <span className="text-text-muted">GST Threshold:</span>
                              <span className={getTapeTotal() >= 2000000 ? 'text-red-400' : 'text-emerald-400'}>
                                {currencySymbol}{getTapeTotal().toFixed(0)} / 20L
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-bg-secondary border border-border-brand flex justify-between">
                              <span className="text-text-muted">Daily Shift Avg:</span>
                              <span className="text-white">
                                {currencySymbol}12,500
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-bg-secondary border border-border-brand flex justify-between font-mono text-[11px] text-[#d4af37]">
                              <span>Status:</span>
                              <span>{getTapeTotal() > 15000 ? '⭐ High Ticket' : '⚖️ Normal'}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5 text-[11px] text-text-secondary leading-relaxed font-medium">
                          <p>📟 **Tape Ledger**: Every calculation creates a row. Add details directly by clicking the `+ Add label...` fields.</p>
                          <p>➕ **GST / Disc**: Tap the quick-buttons to dynamically append standard 18% GST or 10% discount line items.</p>
                          <p>🌐 **Currency**: Instantly toggle the active tape formatter between ₹ (INR) and $ (USD).</p>
                          <p>🗑️ **History**: Click the history clock icon at the header to load a preset invoice structure.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* COMPONENT: CALENDAR */}
              {activeTab === 'calendar' && (
                <div className="space-y-6">
                  <div className="border-b border-border-brand pb-3">
                    <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="text-[#d4af37] h-4.5 w-4.5" /> Beta Calander
                    </h2>
                    <p className="text-[11px] text-text-secondary">Visual month scheduler to log shift notes and vendor task alerts.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Month Grid */}
                    <div className="md:col-span-2 space-y-4">
                      {/* Controls */}
                      <div className="flex items-center justify-between bg-bg-primary/40 border border-border-brand px-4 py-2.5 rounded-xl">
                        <button onClick={handlePrevMonth} className="p-1 rounded bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary cursor-pointer"><ArrowLeft size={14} /></button>
                        <span className="text-xs font-black text-white uppercase tracking-wider">{monthsList[currentMonth]} {currentYear}</span>
                        <button onClick={handleNextMonth} className="p-1 rounded bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary cursor-pointer"><ArrowRight size={14} /></button>
                      </div>

                      {/* Day Grid */}
                      <div className="bg-bg-primary/20 border border-border-brand rounded-2xl p-4 space-y-2">
                        {/* Days header */}
                        <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase text-text-secondary tracking-widest pb-1 border-b border-border-brand">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d}>{d}</span>)}
                        </div>
                        {/* Days numbers */}
                        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold pt-1">
                          {/* Blank cells for offset */}
                          {Array.from({ length: getFirstDayIndex(currentYear, currentMonth) }).map((_, idx) => (
                            <span key={`blank-${idx}`} className="h-9" />
                          ))}
                          {/* Month Days */}
                          {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }).map((_, idx) => {
                            const dayNum = idx + 1;
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                            const isSelected = selectedCalDate === dayNum;
                            const hasNote = calNotes[dateStr] && calNotes[dateStr].length > 0;

                            return (
                              <button
                                key={`day-${dayNum}`}
                                onClick={() => setSelectedCalDate(dayNum)}
                                className={`h-9 rounded-xl border transition-all active:scale-90 flex flex-col items-center justify-center relative cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#8b6508] border-[#8b6508]/20 text-white font-black scale-102' 
                                    : 'border-border-brand bg-bg-secondary hover:bg-bg-tertiary text-text-primary'
                                }`}
                              >
                                <span>{dayNum}</span>
                                {hasNote && (
                                  <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#d4af37]'}`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Reminders list & Add note */}
                    <div className="space-y-4">
                      <div className="rounded-xl border border-border-brand bg-bg-primary/20 p-4 space-y-3">
                        <h3 className="text-xs uppercase font-extrabold text-[#d4af37] tracking-wider border-b border-border-brand pb-2">
                          Notes: {selectedCalDate ? `${selectedCalDate} ${monthsList[currentMonth]}` : 'Select a date'}
                        </h3>

                        {selectedCalDate ? (
                          <div className="space-y-3">
                            {/* List notes */}
                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                              {(() => {
                                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedCalDate).padStart(2, '0')}`;
                                const notes = calNotes[dateStr] || [];
                                if (notes.length > 0) {
                                  return notes.map((note, index) => (
                                    <div key={index} className="p-2 rounded-lg bg-bg-secondary border border-border-brand text-[10.5px] text-text-primary leading-normal font-semibold">
                                      📌 {note}
                                    </div>
                                  ));
                                }
                                return <div className="text-[10px] text-slate-500 font-semibold italic text-center py-4">No notes for this date.</div>;
                              })()}
                            </div>

                            {/* Add note form */}
                            <form onSubmit={handleAddCalNote} className="space-y-2 pt-2 border-t border-border-brand">
                              <input 
                                type="text"
                                placeholder="Add reminder..."
                                value={newNoteText}
                                onChange={(e) => setNewNoteText(e.target.value)}
                                className="w-full bg-bg-secondary border border-border-brand rounded-lg px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-[#d4af37]/40 placeholder-text-muted"
                                required
                              />
                              <button 
                                type="submit" 
                                className="w-full bg-[#8b6508] hover:bg-[#664a05] text-[10px] font-black uppercase text-white py-1.5 rounded-lg tracking-wider transition-colors cursor-pointer"
                              >
                                Save Note
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div className="text-center py-10 text-[10px] text-text-muted font-semibold">Click on any date to manage schedule notes.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPONENT: CONTACTS */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="border-b border-border-brand pb-3">
                    <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <Contact className="text-[#d4af37] h-4.5 w-4.5" /> Beta Contact
                    </h2>
                    <p className="text-[11px] text-text-secondary">Interactive business address book to log guest list coordinates.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contacts list */}
                    <div className="md:col-span-2 space-y-4">
                      {/* Search bar inside contact */}
                      <div className="flex items-center gap-2.5 rounded-xl border border-border-brand bg-bg-primary/30 px-3.5 py-2">
                        <Search className="h-4 w-4 text-text-secondary" />
                        <input 
                          type="text" 
                          placeholder="Search contacts by name..."
                          value={contactSearch}
                          onChange={(e) => setContactSearch(e.target.value)}
                          className="bg-transparent outline-none text-xs text-text-primary flex-1 placeholder-text-muted"
                        />
                      </div>

                      {/* List Cards */}
                      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                        {contacts.filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase())).length > 0 ? (
                          contacts.filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase())).map((c) => (
                            <div key={c.id} className="p-4 rounded-xl border border-border-brand bg-bg-primary/20 flex justify-between items-start gap-4 shadow-sm hover:border-[#d4af37]/35 transition-all">
                              <div className="space-y-1 min-w-0">
                                <span className="font-extrabold text-xs text-white block">{c.name}</span>
                                <span className="text-[10px] text-text-secondary block font-semibold">📞 {c.phone}</span>
                                {c.email && <span className="text-[10px] text-text-secondary block font-semibold">✉️ {c.email}</span>}
                                {c.notes && <p className="text-[9.5px] text-text-muted mt-1 leading-normal italic font-medium">{c.notes}</p>}
                              </div>
                              <button 
                                onClick={() => handleDeleteContact(c.id)}
                                className="p-1.5 rounded-lg border border-border-brand hover:border-red-500/20 bg-bg-secondary hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors shrink-0 cursor-pointer"
                                title="Remove Contact"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-[11px] text-text-muted font-bold">No contacts found matching your search.</div>
                        )}
                      </div>
                    </div>

                    {/* Add Contact Form */}
                    <div className="rounded-xl border border-border-brand bg-bg-primary/20 p-4 space-y-4">
                      <h3 className="text-xs uppercase font-extrabold text-[#d4af37] tracking-wider border-b border-border-brand pb-2">Add New Contact</h3>
                      <form onSubmit={handleAddContact} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-text-secondary">Full Name *</label>
                          <input 
                            type="text" 
                            value={newContact.name}
                            onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-bg-secondary border border-border-brand rounded-lg px-2.5 py-1.5 text-text-primary outline-none focus:border-[#d4af37]/40 placeholder-text-muted"
                            placeholder="e.g. Rahul Kumar"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-text-secondary">Telephone *</label>
                          <input 
                            type="text" 
                            value={newContact.phone}
                            onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-bg-secondary border border-border-brand rounded-lg px-2.5 py-1.5 text-text-primary outline-none focus:border-[#d4af37]/40 placeholder-text-muted"
                            placeholder="+91 99887 76655"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-text-secondary">Email Address</label>
                          <input 
                            type="email" 
                            value={newContact.email}
                            onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-bg-secondary border border-border-brand rounded-lg px-2.5 py-1.5 text-text-primary outline-none focus:border-[#d4af37]/40 placeholder-text-muted"
                            placeholder="rahul@example.com"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-text-secondary">Notes / Business Category</label>
                          <textarea 
                            rows={2}
                            value={newContact.notes}
                            onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full bg-bg-secondary border border-border-brand rounded-lg px-2.5 py-1.5 text-text-primary outline-none focus:border-[#d4af37]/40 resize-none placeholder-text-muted"
                            placeholder="VIP Guest, supplies coordinator..."
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-[#8b6508] hover:bg-[#664a05] text-[10px] font-black uppercase text-white py-2 rounded-lg tracking-wider transition-colors cursor-pointer"
                        >
                          Save Contact Card
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPONENT: VIRTUAL KEYBOARD */}
              {activeTab === 'keyboard' && (
                <div className="space-y-6">
                  <div className="border-b border-border-brand pb-3">
                    <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <Keyboard className="text-[#d4af37] h-4.5 w-4.5" /> Beta Keyboard
                    </h2>
                    <p className="text-[11px] text-text-secondary">Interactive virtual QWERTY keys to type and copy text dynamically.</p>
                  </div>

                  <div className="space-y-4 max-w-xl mx-auto">
                    {/* Text display panel */}
                    <div className="relative">
                      <textarea
                        value={kbdText}
                        onChange={(e) => setKbdText(e.target.value)}
                        placeholder="Click the keys below to type something..."
                        className="w-full h-32 bg-bg-primary/40 border border-border-brand rounded-xl p-3 text-xs text-white font-mono outline-none resize-none"
                      />
                      {kbdText && (
                        <button
                          onClick={() => handleKbdPress('Copy')}
                          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-bg-secondary border border-border-brand hover:border-[#d4af37]/30 px-3 py-1.5 rounded-lg text-[10px] font-bold text-text-primary transition-all cursor-pointer"
                          title="Copy text"
                        >
                          <Copy size={11} /> Copy
                        </button>
                      )}
                    </div>

                    {/* Keys Board */}
                    <div className="bg-bg-primary/20 border border-border-brand p-4 rounded-2xl space-y-2">
                      {kbdRows.map((row, rIdx) => (
                        <div key={rIdx} className="flex justify-center gap-1.5">
                          {row.map((k) => {
                            const isActionKey = ['Shift', '⌫', 'Space', 'Clear', 'Copy'].includes(k);
                            let widthClass = 'w-9';
                            if (k === 'Space') widthClass = 'w-48';
                            else if (k === 'Shift' || k === '⌫') widthClass = 'w-14';
                            else if (k === 'Clear' || k === 'Copy') widthClass = 'w-16';

                            return (
                              <button
                                key={k}
                                onClick={() => handleKbdPress(k)}
                                className={`h-10 rounded-lg border text-center transition-all active:scale-90 flex items-center justify-center font-mono text-xs select-none cursor-pointer ${widthClass} ${
                                  isActionKey 
                                    ? k === 'Shift' && isShift
                                      ? 'bg-[#8b6508] border-[#8b6508]/20 text-white font-black'
                                      : 'bg-bg-tertiary border-border-brand text-[#d4af37] font-extrabold text-[10px]'
                                    : 'bg-bg-secondary border-border-brand text-text-primary hover:bg-bg-tertiary font-bold'
                                }`}
                              >
                                {k === 'Shift' ? '⇧ Shift' : k === 'Space' ? 'Space' : k === '⌫' ? '⌫' : isShift && !isActionKey ? k.toUpperCase() : k}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* COMPONENT: TRANSLATOR */}
              {activeTab === 'translator' && (
                <div className="space-y-6">
                  <div className="border-b border-border-brand pb-3">
                    <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <Languages className="text-[#d4af37] h-4.5 w-4.5" /> Beta Translator
                    </h2>
                    <p className="text-[11px] text-text-secondary">Simulated language converter for basic support keywords translations.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Source English */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Source Text (English)</span>
                        <select 
                          value={targetLang}
                          onChange={(e) => setTargetLang(e.target.value)}
                          className="bg-bg-primary/40 border border-border-brand rounded-lg text-[10px] uppercase tracking-wide font-black px-2 py-1 outline-none text-[#d4af37] cursor-pointer"
                        >
                          <option value="spanish" className="bg-bg-tertiary">🇪🇸 Spanish</option>
                          <option value="french" className="bg-bg-tertiary">🇫🇷 French</option>
                          <option value="german" className="bg-bg-tertiary">🇩🇪 German</option>
                          <option value="japanese" className="bg-bg-tertiary">🇯🇵 Japanese</option>
                          <option value="tamil" className="bg-bg-tertiary">🇮🇳 Tamil</option>
                        </select>
                      </div>
                      <textarea
                        value={translateText}
                        onChange={(e) => setTranslateText(e.target.value)}
                        placeholder="Type English words here (e.g. Hello, goodbye, thanks, settings, welcome, business)..."
                        className="w-full h-36 bg-bg-primary/40 border border-border-brand rounded-xl p-3 text-xs text-white outline-none resize-none focus:border-[#d4af37]/30 placeholder-text-muted"
                      />
                      <button
                        onClick={handleTranslate}
                        disabled={isTranslating || !translateText.trim()}
                        className="w-full bg-[#8b6508] hover:bg-[#664a05] text-xs font-black uppercase text-white py-2.5 rounded-lg tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isTranslating ? 'Translating...' : 'Translate text'}
                      </button>
                    </div>

                    {/* Result Translation */}
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider block">Translated Result</span>
                      <div className="w-full h-36 bg-bg-primary/10 border border-border-brand rounded-xl p-3 text-xs text-white font-mono relative overflow-y-auto">
                        {translatedText ? (
                          <div className="space-y-2">
                            <p className="leading-relaxed font-semibold">{translatedText}</p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(translatedText);
                                triggerToast('Translation copied!');
                              }}
                              className="absolute bottom-3 right-3 flex items-center gap-1 bg-bg-secondary border border-border-brand hover:border-[#d4af37]/30 px-2.5 py-1.5 rounded-lg text-[9px] font-bold text-text-primary transition-all cursor-pointer"
                            >
                              <Copy size={10} /> Copy
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-text-muted text-[10px] font-semibold italic">Output translation will display here.</div>
                        )}
                      </div>
                      <div className="p-3 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-xl">
                        <span className="text-[9px] uppercase font-extrabold text-[#d4af37] block">💡 Translation Tips</span>
                        <p className="text-[9.5px] text-text-secondary leading-snug mt-1 font-medium">Supported keywords for exact translations: Hello, goodbye, thanks, settings, welcome, business. Other text uses auto-generated language suffixes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPONENT: LENS VISUAL SCANNER */}
              {activeTab === 'lens' && (
                <div className="space-y-6">
                  <div className="border-b border-border-brand pb-3">
                    <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <Scan className="text-[#d4af37] h-4.5 w-4.5" /> Beta Lens
                    </h2>
                    <p className="text-[11px] text-text-secondary">Simulated image scanner to identify merchant layout categories.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Gallery Picker */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider block mb-1">Select Environment</span>
                      {lensGallery.map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedLensImg(item.id);
                            setScanResult(null);
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all active:scale-98 cursor-pointer flex items-center justify-between ${
                            selectedLensImg === item.id 
                              ? 'bg-[#8b6508]/15 border-[#8b6508]/40 text-[#fceea7] font-extrabold shadow-sm'
                              : 'border-border-brand bg-bg-secondary text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold block truncate">{item.title}</span>
                            <span className="text-[9px] text-text-muted block mt-0.5 font-semibold uppercase">{item.category}</span>
                          </div>
                          <ChevronRight size={13} className="shrink-0 text-text-muted" />
                        </button>
                      ))}

                      {/* Zoom control slider */}
                      <div className="bg-bg-primary/20 border border-border-brand p-4 rounded-xl space-y-2 mt-4">
                        <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary uppercase">
                          <span>Lens Zoom</span>
                          <span className="text-[#d4af37] font-black">{lensZoom}x</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="1"
                          value={lensZoom}
                          onChange={(e) => setLensZoom(Number(e.target.value))}
                          className="w-full h-1 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                        />
                      </div>
                    </div>

                    {/* Lens Preview screen */}
                    <div className="md:col-span-2 space-y-4">
                      {/* Image viewport */}
                      <div className="relative h-60 bg-bg-primary border border-border-brand rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
                        {/* Dynamic Mock Visual Grid / gradient for selected image */}
                        <div 
                          className="absolute inset-0 transition-transform duration-300 ease-out flex items-center justify-center p-6 text-center"
                          style={{ 
                            transform: `scale(${1 + (lensZoom - 1) * 0.15})`,
                            background: selectedLensImg === 1 
                              ? 'radial-gradient(circle, rgba(139, 101, 8, 0.2) 0%, rgba(3, 12, 23, 0.8) 100%)' 
                              : selectedLensImg === 2
                              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(3, 12, 23, 0.8) 100%)'
                              : 'radial-gradient(circle, rgba(10, 49, 97, 0.25) 0%, rgba(3, 12, 23, 0.8) 100%)'
                          }}
                        >
                          <div className="space-y-2.5 max-w-xs relative z-10">
                            <span className="text-3xl">
                              {selectedLensImg === 1 ? '🍽️' : selectedLensImg === 2 ? '🥼' : '🎬'}
                            </span>
                            <h4 className="text-xs font-black text-white">{lensGallery.find(item => item.id === selectedLensImg)?.title}</h4>
                            <p className="text-[10px] text-text-secondary font-medium leading-relaxed">{lensGallery.find(item => item.id === selectedLensImg)?.desc}</p>
                          </div>

                          {/* Grid alignment overlay */}
                          <div className="absolute inset-0 pointer-events-none border border-[#d4af37]/15 m-8 rounded-lg flex items-center justify-center">
                            <div className="w-full h-[0.5px] bg-[#d4af37]/20 absolute" />
                            <div className="h-full w-[0.5px] bg-[#d4af37]/20 absolute" />
                            <span className="absolute top-2 left-2 text-[9px] font-mono text-[#d4af37]/45">FOCUS</span>
                          </div>
                        </div>

                        {/* Scanner sweep line */}
                        {isScanning && (
                          <motion.div
                            initial={{ top: '0%' }}
                            animate={{ top: '100%' }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent z-20 shadow-[0_0_8px_#d4af37]"
                          />
                        )}
                      </div>

                      {/* Controls and Scan Output */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleScanLens}
                          disabled={isScanning}
                          className="sm:w-1/3 bg-[#8b6508] hover:bg-[#664a05] text-xs font-black uppercase text-white py-2.5 rounded-xl tracking-wider transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {isScanning ? 'Scanning...' : 'Scan Details'}
                        </button>

                        <div className="flex-1 bg-bg-primary/20 border border-border-brand rounded-xl p-3 text-[10.5px] leading-relaxed text-text-secondary flex items-center justify-center min-h-[44px]">
                          {scanResult ? (
                            <span className="text-white font-semibold">{scanResult}</span>
                          ) : isScanning ? (
                            <span className="text-[#d4af37] animate-pulse font-bold">Sweeping layout dimensions...</span>
                          ) : (
                            <span className="italic font-medium">Click "Scan Details" to parse visual coordinates.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPONENT: WEATHER PANEL */}
              {activeTab === 'weather' && (
                <div className="space-y-6">
                  <div className="border-b border-border-brand pb-3">
                    <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <CloudSun className="text-[#d4af37] h-4.5 w-4.5" /> Beta Weather
                    </h2>
                    <p className="text-[11px] text-text-secondary">Simulated weather parameters monitoring booking-centric cities.</p>
                  </div>

                  {/* Weather view */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cities selector list */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider block mb-1">Select City</span>
                      {Object.keys(weatherData).map(city => (
                        <button
                          key={city}
                          onClick={() => setSelectedWeatherCity(city)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all active:scale-98 cursor-pointer flex items-center justify-between ${
                            selectedWeatherCity === city 
                              ? 'bg-[#8b6508]/15 border-[#8b6508]/40 text-[#fceea7] font-extrabold'
                              : 'border-border-brand bg-bg-secondary text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <span>📍 {city}</span>
                          <span className="text-sm font-black">{weatherData[city].temp}°C</span>
                        </button>
                      ))}
                    </div>

                    {/* Detailed info panel */}
                    <div className="md:col-span-2 bg-bg-primary/20 border border-border-brand rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-sm">
                      {/* Left: Current Stats */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{weatherData[selectedWeatherCity].icon}</span>
                          <div>
                            <h3 className="text-lg font-black text-white">{selectedWeatherCity}</h3>
                            <span className="text-[10.5px] text-[#d4af37] font-bold uppercase tracking-wide">{weatherData[selectedWeatherCity].desc}</span>
                          </div>
                        </div>

                        <div className="text-3xl font-black text-white">{weatherData[selectedWeatherCity].temp}°C</div>

                        <div className="space-y-2 pt-2 text-xs border-t border-border-brand/40">
                          <div className="flex items-center justify-between text-text-secondary">
                            <span className="flex items-center gap-1.5 font-semibold"><Droplets size={12} className="text-[#d4af37]" /> Humidity</span>
                            <span className="text-white font-bold">{weatherData[selectedWeatherCity].humidity}%</span>
                          </div>
                          <div className="flex items-center justify-between text-text-secondary">
                            <span className="flex items-center gap-1.5 font-semibold"><Wind size={12} className="text-[#d4af37]" /> Wind speed</span>
                            <span className="text-white font-bold">{weatherData[selectedWeatherCity].wind} km/h</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: 3-Day Forecast */}
                      <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-border-brand/45 sm:pl-6 pt-4 sm:pt-0">
                        <h4 className="text-[10px] uppercase font-extrabold text-[#d4af37] tracking-wider border-b border-border-brand/30 pb-1.5">3-Day Forecast</h4>
                        <div className="space-y-2.5">
                          {weatherData[selectedWeatherCity].forecast.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                              <span className="text-text-secondary w-10">{item.day}</span>
                              <span className="text-white text-center font-bold flex-1">{item.temp}°C</span>
                              <span className="text-text-muted text-[10px] text-right truncate max-w-[80px]" title={item.desc}>{item.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPONENT: NEWS TICKER GRID */}
              {activeTab === 'news' && (
                <div className="space-y-6">
                  <div className="border-b border-border-brand pb-3">
                    <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <Newspaper className="text-[#d4af37] h-4.5 w-4.5" /> Beta News
                    </h2>
                    <p className="text-[11px] text-text-secondary">Latest commerce guidelines, booking spikes statistics, and tech releases.</p>
                  </div>

                  {/* Filter category tabs */}
                  <div className="flex items-center gap-1.5 bg-bg-primary/40 p-1 rounded-xl border border-border-brand w-fit">
                    {['all', 'business', 'tech', 'lifestyle'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewsFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                          newsFilter === cat 
                            ? 'bg-[#8b6508] text-white' 
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Grid News Feed */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {newsList
                      .filter(item => newsFilter === 'all' || item.category === newsFilter)
                      .map((item) => (
                        <div key={item.id} className="rounded-xl border border-border-brand bg-bg-primary/10 p-4.5 space-y-3 hover:border-[#d4af37]/30 transition-all flex flex-col justify-between shadow-sm">
                          <div className="space-y-2">
                            {/* Tags */}
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] uppercase font-black bg-[#8b6508]/15 text-[#fceea7] px-1.5 py-0.5 rounded border border-[#8b6508]/20">{item.category}</span>
                              <span className="text-[9px] text-text-muted font-bold">{item.date}</span>
                            </div>
                            <h3 className="font-extrabold text-xs text-white leading-snug group-hover:text-[#d4af37] transition-colors">{item.title}</h3>
                            <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">{item.summary}</p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-border-brand/40 mt-3">
                            <button
                              onClick={() => setActiveArticleModal(item)}
                              className="text-[10.5px] font-black uppercase text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              Read More <ChevronRight size={12} />
                            </button>
                            <div className="flex items-center gap-2">
                              {/* Likes */}
                              <button 
                                onClick={() => handleLikeNews(item.id)}
                                className="flex items-center gap-1 text-[10px] font-bold text-text-secondary hover:text-red-400 cursor-pointer"
                              >
                                ❤️ {item.likes}
                              </button>
                              {/* Bookmark */}
                              <button 
                                onClick={() => handleBookmarkNews(item.id)}
                                className={`text-[10px] cursor-pointer ${item.bookmarked ? 'text-amber-400' : 'text-text-secondary hover:text-amber-400'}`}
                              >
                                {item.bookmarked ? '⭐' : '☆'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* READ MORE ARTICLE MODAL */}
                  <AnimatePresence>
                    {activeArticleModal && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-bg-secondary border border-border-brand rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4"
                        >
                          <div className="flex justify-between items-start border-b border-border-brand pb-3">
                            <div>
                              <span className="text-[8px] uppercase font-black bg-[#8b6508]/15 text-[#fceea7] px-2 py-0.5 rounded border border-[#8b6508]/20">{activeArticleModal.category}</span>
                              <span className="text-[9px] text-text-muted font-bold block mt-1.5">{activeArticleModal.date}</span>
                            </div>
                            <button 
                              onClick={() => setActiveArticleModal(null)}
                              className="p-1 rounded-full hover:bg-white/5 text-text-secondary hover:text-white transition-colors cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          
                          <h3 className="font-extrabold text-sm text-white leading-normal">{activeArticleModal.title}</h3>
                          <p className="text-xs text-text-secondary leading-relaxed font-semibold">{activeArticleModal.content}</p>

                          <div className="flex justify-end pt-2">
                            <button 
                              onClick={() => setActiveArticleModal(null)}
                              className="px-4 py-2 text-[10px] font-black uppercase rounded-lg border border-border-brand text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
                            >
                              Close Article
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* COMPONENT: EDIT SWITCHER (VISIBLE WIDGETS MANAGER) */}
              {activeTab === 'edit' && (
                <div className="space-y-6">
                  <div className="border-b border-border-brand pb-3">
                    <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                      <Edit className="text-[#d4af37] h-4.5 w-4.5" /> Launcher Panel Edit
                    </h2>
                    <p className="text-[11px] text-text-secondary">Toggle utility widgets active states in the right side app switcher panel.</p>
                  </div>

                  <div className="bg-bg-primary/20 border border-border-brand rounded-2xl p-5 space-y-4 max-w-md mx-auto">
                    <span className="text-[10px] uppercase font-extrabold text-[#d4af37] tracking-wider block border-b border-border-brand pb-2">Toggle Active Utilities</span>
                    
                    <div className="space-y-3.5 pt-1.5 text-xs font-semibold">
                      {[
                        { id: 'calc', label: 'Beta Calculator', desc: 'Functioning math pad.' },
                        { id: 'calendar', label: 'Beta Calendar (Calander)', desc: 'Month task reminders log.' },
                        { id: 'contact', label: 'Beta Contact (Address Book)', desc: 'Client coordinates registry.' },
                        { id: 'keyboard', label: 'Beta Keyboard (Virtual Keys)', desc: 'On-screen typing simulator.' },
                        { id: 'translator', label: 'Beta Translator (Convertor)', desc: 'Simulated vocabulary switcher.' },
                        { id: 'lens', label: 'Beta Lens (Visual Scanner)', desc: 'Category image scanner.' },
                        { id: 'weather', label: 'Beta Weather (Forecast Board)', desc: 'Metropolitan temperatures feed.' },
                        { id: 'news', label: 'Beta News (Commerce Ticker)', desc: 'Curated articles feed.' }
                      ].map((w) => (
                        <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary border border-border-brand">
                          <div>
                            <span className="text-xs font-bold text-white block">{w.label}</span>
                            <span className="text-[9px] text-text-muted block font-semibold mt-0.5">{w.desc}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEnabledWidgets(prev => {
                                const nextVal = !prev[w.id];
                                triggerToast(`${w.label} is now ${nextVal ? 'enabled' : 'disabled'} in launcher.`);
                                return { ...prev, [w.id]: nextVal };
                              });
                            }}
                            className={`px-3 py-1 rounded-lg text-[9px] uppercase font-black tracking-wider transition-colors cursor-pointer border ${
                              enabledWidgets[w.id]
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-bg-tertiary border-border-brand text-text-muted'
                            }`}
                          >
                            {enabledWidgets[w.id] ? 'Active' : 'Disabled'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR PANEL: APP LAUNCHER COLUMN */}
        <div className="lg:col-span-1 rounded-2xl border border-border-brand bg-bg-secondary p-5 shadow-sm space-y-4">
          <div className="border-b border-border-brand pb-3">
            <span className="text-[10px] uppercase font-black text-[#d4af37] tracking-widest block">Beta Switchboard</span>
            <span className="text-[9px] text-text-secondary font-bold block mt-0.5">Quick Utilities Launcher</span>
          </div>

          <div className="flex flex-col gap-2">
            {visibleTabs.map((item) => {
              const TabIcon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-black tracking-wide transition-all active:scale-[0.98] text-left cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#8b6508] to-[#664a05] border-[#8b6508]/10 text-white shadow-md' 
                      : 'border-border-brand bg-bg-primary/20 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TabIcon size={14} className={isActive ? 'text-[#fceea7]' : 'text-[#d4af37]'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#fceea7] animate-pulse" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
