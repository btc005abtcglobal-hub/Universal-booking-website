'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopNav } from '../../components/TopNav';
import { BottomNav } from '../../components/BottomNav';

const SERVICE_GROUPS = [
  {
    title: 'Travel',
    description: 'Flight, Train, Bus, Cab/Taxi, Ferry, Shuttle, Helicopter, and Rental vehicle bookings',
    icon: 'directions_car',
    subcategories: [
      {
        name: 'Public Transport',
        items: [
          { name: 'Bus Booking', emoji: '🚌' },
          { name: 'Train Booking', emoji: '🚆' },
          { name: 'Flight Booking', emoji: '✈️' },
          { name: 'Ferry / Boat Booking', emoji: '⛴️' },
          { name: 'Shuttle / Van Booking', emoji: '🚐' },
          { name: 'Helicopter Booking (Premium)', emoji: '🚁' }
        ]
      },
      {
        name: 'Personal Transport',
        items: [
          { name: 'Cab / Taxi Booking', emoji: '🚖' },
          { name: 'Bike Rental', emoji: '🛵' },
          { name: 'Self-Drive Car Rental', emoji: '🚗' }
        ]
      }
    ]
  },
  {
    title: 'Stay & Accomodation',
    description: 'Hotels, resorts, villas, hostels, homestays, and camping options',
    icon: 'hotel',
    subcategories: [
      {
        name: 'Hotels & Rooms',
        items: [
          { name: 'Hotel Booking', emoji: '🏨' },
          { name: 'Resort Booking', emoji: '🏖️' },
          { name: 'Homestay / Villa', emoji: '🏡' },
          { name: 'Hostel Booking', emoji: '🛌' },
          { name: 'Camping Booking', emoji: '🏕️' }
        ]
      }
    ]
  },
  {
    title: 'Entertainment',
    description: 'Cinema, theatre, concerts, festivals, gaming, and workshops',
    icon: 'movie',
    subcategories: [
      {
        name: 'Movies & Shows',
        items: [
          { name: 'Cinema / Movie Tickets', emoji: '🎥' },
          { name: 'Theatre Shows', emoji: '🎭' }
        ]
      },
      {
        name: 'Events',
        items: [
          { name: 'Concert Tickets', emoji: '🎤' },
          { name: 'Events & Festivals', emoji: '🎪' },
          { name: 'Exhibition Entry', emoji: '🎟️' }
        ]
      },
      {
        name: 'Learning & Fun',
        items: [
          { name: 'Workshops / Classes', emoji: '🎨' },
          { name: 'Gaming Arena Booking', emoji: '🎮' }
        ]
      }
    ]
  },
  {
    title: 'Sports&Turf',
    description: 'Turfs, grounds, indoor courts, swimming pools, and play arenas',
    icon: 'sports_soccer',
    subcategories: [
      {
        name: 'Outdoor Sports',
        items: [
          { name: 'Football Turf', emoji: '⚽' },
          { name: 'Cricket Ground', emoji: '🏏' }
        ]
      },
      {
        name: 'Indoor Sports',
        items: [
          { name: 'Badminton Court', emoji: '🏸' },
          { name: 'Tennis Court', emoji: '🎾' },
          { name: 'Basketball Court', emoji: '🏀' }
        ]
      },
      {
        name: 'Fitness & Activity',
        items: [
          { name: 'Swimming Pool Slots', emoji: '🏊' },
          { name: 'Indoor Play Arena', emoji: '🧗' }
        ]
      }
    ]
  },
  {
    title: 'Lifestyle Services',
    description: 'Dining, wellness, beauty, medical, and home technician/creative services',
    icon: 'restaurant',
    subcategories: [
      {
        name: 'Food & Dining',
        items: [
          { name: 'Restaurant Table Reservation', emoji: '🍴' }
        ]
      },
      {
        name: 'Beauty & Wellness',
        items: [
          { name: 'Salon / Spa Appointment', emoji: '💇' },
          { name: 'Gym / Yoga Slot Booking', emoji: '🧘' }
        ]
      },
      {
        name: 'Healthcare',
        items: [
          { name: 'Doctor Appointment', emoji: '🏥' }
        ]
      },
      {
        name: 'Home Services',
        items: [
          { name: 'Electrician Booking', emoji: '🧾' },
          { name: 'Plumber Booking', emoji: '🔧' },
          { name: 'Cleaning Service', emoji: '🧹' },
          { name: 'Technician Service', emoji: '🛠️' }
        ]
      },
      {
        name: 'Creative Services',
        items: [
          { name: 'Studio Booking', emoji: '📸' }
        ]
      }
    ]
  },
  {
    title: 'Business',
    description: 'Co-working spaces, meeting rooms, podcast studios, and conference halls',
    icon: 'business',
    subcategories: [
      {
        name: 'Workspace',
        items: [
          { name: 'Co-working Space', emoji: '🧑‍💻' },
          { name: 'Meeting Room', emoji: '🏛️' }
        ]
      },
      {
        name: 'Media & Production',
        items: [
          { name: 'Podcast Studio', emoji: '🎙️' },
          { name: 'Conference Hall', emoji: '📽️' }
        ]
      },
      {
        name: 'Education & Training',
        items: [
          { name: 'Training Sessions', emoji: '🏫' }
        ]
      }
    ]
  },
  {
    title: 'Religious Services',
    description: 'Temple darshan passes, pooja slot bookings, and pilgrimage tour packages',
    icon: 'account_balance',
    subcategories: [
      {
        name: 'Temple & Religious',
        items: [
          { name: 'Temple Darshan Booking', emoji: '🛕' },
          { name: 'Pooja Slot Booking', emoji: '🪔' },
          { name: 'Pilgrimage Packages', emoji: '🚕' }
        ]
      }
    ]
  },
  {
    title: 'Equipment Rentals',
    description: 'Rent cycles, sports bikes, cameras, sound systems, and event equipment',
    icon: 'shopping_bag',
    subcategories: [
      {
        name: 'Rental Items',
        items: [
          { name: 'Cycle Rental', emoji: '🚲' },
          { name: 'Sports Bike Rental', emoji: '🏍️' },
          { name: 'Camera Rental', emoji: '🎥' },
          { name: 'Sound System Rental', emoji: '🔊' },
          { name: 'Event Equipment Rental', emoji: '🪑' }
        ]
      }
    ]
  },
  {
    title: 'Personal Services',
    description: 'Pet grooming, babysitting, elder care, and event organizers',
    icon: 'pets',
    subcategories: [
      {
        name: 'Personal Services',
        items: [
          { name: 'Pet Grooming Appointment', emoji: '🐶' },
          { name: 'Babysitting Service', emoji: '🍼' },
          { name: 'Elder Care Service', emoji: '👴' },
          { name: 'Event Organizer Booking', emoji: '🎂' }
        ]
      }
    ]
  }
];

function getHrefForCategoryItem(groupTitle: string, item: string): string {
  const titleLower = groupTitle.toLowerCase();
  let groupKey = '';
  if (titleLower.includes('travel') || titleLower.includes('transport')) groupKey = 'travel-transport';
  else if (titleLower.includes('stay') || titleLower.includes('accommodation') || titleLower.includes('accomodation')) groupKey = 'stay-accommodation';
  else if (titleLower.includes('entertainment') || titleLower.includes('events')) groupKey = 'entertainment-events';
  else if (titleLower.includes('sports') || titleLower.includes('turf')) groupKey = 'sports-turf';
  else if (titleLower.includes('lifestyle') || titleLower.includes('local')) groupKey = 'lifestyle-local';
  else if (titleLower.includes('business') || titleLower.includes('professional')) groupKey = 'business-professional';
  else if (titleLower.includes('religious') || titleLower.includes('government')) groupKey = 'religious-government';
  else if (titleLower.includes('rental') || titleLower.includes('equipment')) groupKey = 'rental-equipment';
  else if (titleLower.includes('personal') || titleLower.includes('misc') || titleLower.includes('miscellaneous')) groupKey = 'personal-misc';
  else groupKey = titleLower.replace(/\s+/g, '-');

  const itemLower = item.toLowerCase();
  let slug = '';
  
  // Travel & Transport
  if (itemLower.includes('flight')) slug = 'flights';
  else if (itemLower.includes('train')) slug = 'trains';
  else if (itemLower.includes('bus')) slug = 'buses';
  else if (itemLower.includes('ferry') || itemLower.includes('boat')) slug = 'ferry';
  else if (itemLower.includes('shuttle') || itemLower.includes('van')) slug = 'shuttle';
  else if (itemLower.includes('helicopter')) slug = 'helicopter';
  else if (itemLower.includes('cab') || itemLower.includes('taxi')) slug = 'cabs';
  else if (itemLower.includes('bike rental')) slug = 'bike-rental';
  else if (itemLower.includes('self-drive') || itemLower.includes('car rental')) slug = 'car-rental';
  
  // Stay & Accommodation
  else if (itemLower.includes('hotel') && !itemLower.includes('hostel')) slug = 'hotels';
  else if (itemLower.includes('resort')) slug = 'resorts';
  else if (itemLower.includes('villa') || itemLower.includes('homestay')) slug = 'villas';
  else if (itemLower.includes('hostel')) slug = 'hostels';
  else if (itemLower.includes('camping')) slug = 'camping';
  
  // Entertainment & Events
  else if (itemLower.includes('cinema') || itemLower.includes('movie')) slug = 'movies';
  else if (itemLower.includes('theatre')) slug = 'theatre';
  else if (itemLower.includes('concert')) slug = 'concerts';
  else if (itemLower.includes('event') || itemLower.includes('festival')) slug = 'events';
  else if (itemLower.includes('exhibition')) slug = 'exhibitions';
  else if (itemLower.includes('workshop') || itemLower.includes('class')) slug = 'workshops';
  else if (itemLower.includes('gaming')) slug = 'gaming';
  
  // Sports & Turf
  else if (itemLower.includes('football') || itemLower.includes('turf')) slug = 'football-turf';
  else if (itemLower.includes('cricket')) slug = 'cricket-ground';
  else if (itemLower.includes('badminton')) slug = 'badminton';
  else if (itemLower.includes('tennis')) slug = 'tennis';
  else if (itemLower.includes('basketball')) slug = 'basketball';
  else if (itemLower.includes('swimming') || itemLower.includes('pool')) slug = 'swimming';
  else if (itemLower.includes('indoor play') || itemLower.includes('arena')) slug = 'play-arena';
  
  // Lifestyle & Local Services
  else if (itemLower.includes('restaurant') || itemLower.includes('dining')) slug = 'dining';
  else if (itemLower.includes('salon') || itemLower.includes('spa')) slug = 'salons';
  else if (itemLower.includes('gym') || itemLower.includes('yoga')) slug = 'gym-yoga';
  else if (itemLower.includes('doctor')) slug = 'doctor';
  else if (itemLower.includes('electrician')) slug = 'electrician';
  else if (itemLower.includes('plumber')) slug = 'plumber';
  else if (itemLower.includes('cleaning')) slug = 'cleaning';
  else if (itemLower.includes('technician')) slug = 'technician';
  else if (itemLower.includes('studio') && !itemLower.includes('podcast')) slug = 'studio';
  
  // Business & Professional
  else if (itemLower.includes('co-working') || itemLower.includes('coworking')) slug = 'coworking';
  else if (itemLower.includes('meeting')) slug = 'meeting-room';
  else if (itemLower.includes('podcast')) slug = 'podcast';
  else if (itemLower.includes('conference')) slug = 'conference';
  else if (itemLower.includes('training')) slug = 'training';
  
  // Religious Services
  else if (itemLower.includes('darshan')) slug = 'darshan';
  else if (itemLower.includes('pooja')) slug = 'pooja';
  else if (itemLower.includes('pilgrimage')) slug = 'pilgrimage';
  
  // Rental & Equipment Booking
  else if (itemLower.includes('cycle')) slug = 'cycle-rental';
  else if (itemLower.includes('sports bike')) slug = 'sports-bike';
  else if (itemLower.includes('camera')) slug = 'camera';
  else if (itemLower.includes('sound')) slug = 'sound-system';
  else if (itemLower.includes('equipment') || itemLower.includes('event equip')) slug = 'event-equip';
  
  // Personal & Miscellaneous Services
  else if (itemLower.includes('pet')) slug = 'pet-grooming';
  else if (itemLower.includes('babysitting')) slug = 'babysitting';
  else if (itemLower.includes('elder')) slug = 'elder-care';
  else if (itemLower.includes('organizer')) slug = 'event-organizer';
  
  else slug = itemLower.replace(/\s+/g, '-');

  return `/${groupKey}/${slug}`;
}

function getGroupHref(title: string): string {
  const cleanTitle = title.toLowerCase();
  if (cleanTitle.includes('travel') || cleanTitle.includes('transport')) return '/travel-transport';
  if (cleanTitle.includes('stay') || cleanTitle.includes('accommodation') || cleanTitle.includes('accomodation')) return '/stay-accommodation';
  if (cleanTitle.includes('entertainment') || cleanTitle.includes('events')) return '/entertainment-events';
  if (cleanTitle.includes('sports') || cleanTitle.includes('turf')) return '/sports-turf';
  if (cleanTitle.includes('lifestyle') || cleanTitle.includes('local')) return '/lifestyle-local';
  if (cleanTitle.includes('business') || cleanTitle.includes('professional')) return '/business-professional';
  if (cleanTitle.includes('religious') || cleanTitle.includes('government')) return '/religious-government';
  if (cleanTitle.includes('rental') || cleanTitle.includes('equipment')) return '/rental-equipment';
  if (cleanTitle.includes('personal') || cleanTitle.includes('misc') || cleanTitle.includes('miscellaneous')) return '/personal-misc';
  return '/travel-transport';
}

interface SearchableService {
  name: string;
  emoji: string;
  groupTitle: string;
  href: string;
}

// Flat list of all categories for autocomplete search
const ALL_SEARCHABLE_SERVICES: SearchableService[] = SERVICE_GROUPS.flatMap((group) =>
  group.subcategories.flatMap((subcat) =>
    subcat.items.map((item) => ({
      name: item.name,
      emoji: item.emoji,
      groupTitle: group.title,
      href: getHrefForCategoryItem(group.title, item.name),
    }))
  )
);

const GROUP_EMOJIS: Record<string, string> = {
  'Travel': '✈️',
  'Stay & Accomodation': '🏨',
  'Entertainment': '🎬',
  'Sports&Turf': '⚽',
  'Lifestyle Services': '💇',
  'Business': '🧑‍💻',
  'Religious Services': '🛕',
  'Equipment Rentals': '🚲',
  'Personal Services': '🐶'
};

function getServiceSubtitle(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('bus')) return 'State & private bus routes';
  if (n.includes('train')) return 'Express & passenger schedules';
  if (n.includes('flight')) return 'Domestic & international routes';
  if (n.includes('ferry') || n.includes('boat')) return 'Scenic waterways & cruises';
  if (n.includes('shuttle')) return 'Convenient local route shuttles';
  if (n.includes('helicopter')) return 'Fast luxury charter travel';
  if (n.includes('cab') || n.includes('taxi')) return 'On-demand cabs & drivers';
  if (n.includes('bike')) return 'Hourly & daily rentals';
  if (n.includes('car rental') || n.includes('self-drive')) return 'Premium self-drive fleets';
  if (n.includes('hotel')) return 'Boutique & premium rooms';
  if (n.includes('resort')) return 'Beachfront & hill getaways';
  if (n.includes('villa') || n.includes('homestay')) return 'Private luxury villas';
  if (n.includes('hostel')) return 'Backpacker & social stays';
  if (n.includes('camping')) return 'Outdoor luxury glamping';
  if (n.includes('cinema') || n.includes('movie')) return 'Blockbuster movie tickets';
  if (n.includes('theatre')) return 'Live drama & music plays';
  if (n.includes('concert')) return 'Major local & global bands';
  if (n.includes('events & festival') || n.includes('festival')) return 'Art exhibitions & carnivals';
  if (n.includes('exhibition')) return 'Museum & gallery shows';
  if (n.includes('workshop') || n.includes('class')) return 'Skill & creative learning';
  if (n.includes('gaming')) return 'Console & PC slots';
  if (n.includes('football') || n.includes('turf')) return 'Fifa-grade synthetic turfs';
  if (n.includes('cricket')) return 'Nets & pitch bookings';
  if (n.includes('badminton')) return 'Indoor synthetic courts';
  if (n.includes('tennis')) return 'Clay & hard court slots';
  if (n.includes('basketball')) return 'Standard indoor courts';
  if (n.includes('swimming')) return 'Olympic-sized public pools';
  if (n.includes('play arena') || n.includes('indoor play')) return 'Climbing & adventure park';
  if (n.includes('restaurant') || n.includes('dining')) return 'Table reservation & menus';
  if (n.includes('salon') || n.includes('spa')) return 'Styling, massage & therapies';
  if (n.includes('gym') || n.includes('yoga')) return 'Fitness trainers & studio';
  if (n.includes('doctor')) return 'Consult general & specialists';
  if (n.includes('electrician')) return 'House wiring & repairs';
  if (n.includes('plumber')) return 'Leak fixes & installations';
  if (n.includes('cleaning')) return 'Deep home cleaning services';
  if (n.includes('technician')) return 'AC & appliance maintenance';
  if (n.includes('studio') && !n.includes('podcast')) return 'Photoshoot & video spaces';
  if (n.includes('co-working') || n.includes('coworking')) return 'Hot desks & dedicated cabins';
  if (n.includes('meeting')) return 'Smart screens & whiteboard';
  if (n.includes('podcast')) return 'Pro microphones & soundboard';
  if (n.includes('conference')) return 'Seminars & business events';
  if (n.includes('training')) return 'Classrooms & workshops';
  if (n.includes('darshan')) return 'Fast-track temple entry';
  if (n.includes('pooja')) return 'Traditional archana rituals';
  if (n.includes('pilgrimage')) return 'Guided religious journeys';
  if (n.includes('cycle')) return 'Eco gear & cycles';
  if (n.includes('camera')) return 'DSL & mirrorless gear';
  if (n.includes('sound')) return 'DJ speakers & mics';
  if (n.includes('equipment')) return 'Catering & seating rental';
  if (n.includes('pet')) return 'Baths, clips & nail trims';
  if (n.includes('babysitting')) return 'Trusted child care services';
  if (n.includes('elder')) return 'Assisted care & companions';
  if (n.includes('organizer')) return 'Parties, birthdays & weddings';
  return 'Reserve slots instantly';
}

export default function CategoriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchableService[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const filtered = ALL_SEARCHABLE_SERVICES.filter((service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filtered);
    setActiveIndex(-1);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetIndex = activeIndex >= 0 ? activeIndex : 0;
      const selected = suggestions[targetIndex];
      if (selected) {
        router.push(selected.href);
        setShowSuggestions(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <>
      <TopNav />
      <main className="page-content px-4 md:px-8 lg:pr-8">
        <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-outline)]">Categories</p>
          <h1 className="mt-2 text-[30px] md:text-[42px] font-black tracking-tight text-[color:var(--color-on-surface)]">
            Browse all services and categories
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] md:text-[16px] leading-7 text-[color:var(--color-on-surface-variant)]">
            Every service is grouped here so you can find travel, stay, lifestyle, entertainment, and account tools in one clean place.
          </p>
          
          <div ref={dropdownRef} className="relative mt-6 max-w-xl z-20">
            <div className="relative flex items-center rounded-2xl border border-[color:var(--color-outline-variant)]/40 bg-[color:var(--color-surface-container)]/70 px-4 py-3 shadow-lg focus-within:border-[color:var(--color-primary)]/50 focus-within:ring-1 focus-within:ring-[color:var(--color-primary)]/50 transition-all duration-300 card-glass">
              <span className="material-symbols-outlined text-[color:var(--color-outline)] mr-3">search</span>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search services (e.g. Flight, Football, Salon)..."
                className="w-full bg-transparent text-sm text-[color:var(--color-on-surface)] placeholder-[color:var(--color-outline)] outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                    inputRef.current?.focus();
                  }}
                  className="material-symbols-outlined text-[color:var(--color-outline)] hover:text-[color:var(--color-on-surface)] transition-colors p-0.5 rounded-full flex items-center justify-center"
                >
                  close
                </button>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-[color:var(--color-outline-variant)]/40 bg-[color:var(--color-surface-container-high)]/95 backdrop-blur-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto z-50 divide-y divide-[color:var(--color-outline-variant)]/10">
                {suggestions.map((service, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <div
                      key={`${service.name}-${index}`}
                      onClick={() => {
                        router.push(service.href);
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-200 ${
                        isActive
                          ? 'bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] font-bold'
                          : 'text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-container-highest)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{service.emoji}</span>
                        <div className="text-left">
                          <span className="text-sm">{service.name}</span>
                          <span className="text-[10px] text-[color:var(--color-outline)] block mt-0.5">
                            in {service.groupTitle}
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-xs opacity-50">
                        arrow_forward
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs Switcher (Sticky Row) */}
        <div className="sticky top-[80px] md:top-[104px] z-30 bg-[color:var(--color-background)]/80 backdrop-blur-lg border-b border-[color:var(--color-outline-variant)]/20 py-3 mb-8 -mx-4 px-4 md:-mx-8 md:px-8 overflow-x-auto flex gap-2.5 scrollbar-none scroll-smooth">
          {SERVICE_GROUPS.map((group) => {
            const id = group.title.toLowerCase().replace(/\s+/g, '-');
            return (
              <button
                key={group.title}
                onClick={() => scrollToSection(id)}
                className="px-4 py-2.5 rounded-full text-[11.5px] font-bold bg-[color:var(--color-surface-container)]/40 border border-[color:var(--color-outline-variant)]/20 text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-on-surface)] hover:border-[color:var(--color-primary)]/30 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-sm backdrop-blur-md"
              >
                <span className="text-sm">{GROUP_EMOJIS[group.title] || '📍'}</span>
                <span>{group.title}</span>
              </button>
            );
          })}
        </div>

        {/* Categories Section Feed */}
        <div className="space-y-12">
          {SERVICE_GROUPS.map((group) => {
            const id = group.title.toLowerCase().replace(/\s+/g, '-');
            return (
              <section
                key={group.title}
                id={id}
                className="scroll-mt-36 text-left animate-fade-up"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4.5 mb-6 border-b border-[color:var(--color-outline-variant)]/15 pb-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--color-primary)]/20 bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] shadow-md">
                    <span className="material-symbols-outlined text-[26px]">{group.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-[20px] md:text-[22px] font-black text-[color:var(--color-on-surface)] tracking-tight">
                      {group.title}
                    </h2>
                    <p className="mt-1 text-xs md:text-sm text-[color:var(--color-on-surface-variant)]">
                      {group.description}
                    </p>
                  </div>
                </div>

                {/* Subcategories & Service Cards */}
                <div className="space-y-8">
                  {group.subcategories.map((subcat) => (
                    <div key={subcat.name} className="space-y-4">
                      {group.subcategories.length > 1 && (
                        <h3 className="text-[10px] uppercase tracking-widest font-black text-[color:var(--color-outline)] border-l-2 border-[color:var(--color-primary)]/50 pl-2">
                          {subcat.name}
                        </h3>
                      )}
                      
                      {/* Grid of Service Cards */}
                      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {subcat.items.map((item) => {
                          const serviceHref = getHrefForCategoryItem(group.title, item.name);
                          return (
                            <Link
                              key={item.name}
                              href={serviceHref}
                              className="card-glass relative flex flex-col justify-between p-5 rounded-[24px] border border-[color:var(--color-outline-variant)]/30 bg-[color:var(--color-surface-container)]/50 hover:bg-[color:var(--color-surface-container-high)]/80 hover:border-[color:var(--color-primary)]/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-md group text-left overflow-hidden min-h-[140px]"
                            >
                              {/* Ambient gradient background glow on card hover */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                              <div className="flex items-start justify-between gap-3 relative z-10">
                                <div className="text-3xl p-3 rounded-2xl bg-[color:var(--color-surface-container-highest)]/80 border border-[color:var(--color-outline-variant)]/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                  {item.emoji}
                                </div>
                                <div className="h-7 w-7 rounded-full bg-[color:var(--color-surface-container-highest)]/50 flex items-center justify-center text-[color:var(--color-on-surface-variant)] group-hover:text-[color:var(--color-primary)] group-hover:bg-[color:var(--color-primary)]/10 transition-colors duration-300">
                                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                </div>
                              </div>

                              <div className="mt-4 relative z-10">
                                <h3 className="text-[14px] font-extrabold text-[color:var(--color-on-surface)] group-hover:text-[color:var(--color-primary)] transition-colors leading-snug">
                                  {item.name}
                                </h3>
                                <p className="text-[11px] text-[color:var(--color-on-surface-variant)] mt-1.5 font-medium line-clamp-1">
                                  {getServiceSubtitle(item.name)}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[color:var(--color-primary)] px-4 py-3 text-sm font-bold text-[color:var(--color-on-primary)]"
          >
            Back to Home
          </Link>
          <Link
            href="/tracks"
            className="rounded-xl border border-[color:var(--color-outline-variant)]/40 bg-[color:var(--color-surface-container)] px-4 py-3 text-sm font-semibold text-[color:var(--color-on-surface)]"
          >
            Open Track
          </Link>
        </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
