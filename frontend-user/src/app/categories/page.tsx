'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopNav } from '../../components/TopNav';
import { SideNav } from '../../components/SideNav';
import { BottomNav } from '../../components/BottomNav';

const SERVICE_GROUPS = [
  {
    title: 'Travel & Transport',
    description: 'Flight, Train, Bus, Cab/Taxi, Ferry, Shuttle, Helicopter, and Rental vehicle bookings',
    icon: 'directions_car',
    items: [
      'Flight Booking', 'Train Booking', 'Bus Booking', 'Ferry / Boat Booking',
      'Shuttle / Van Booking', 'Helicopter Booking (Premium)', 'Cab / Taxi Booking',
      'Bike Rental', 'Self-Drive Car Rental'
    ],
  },
  {
    title: 'Stay & Accommodation',
    description: 'Hotels, resorts, villas, hostels, homestays, and camping options',
    icon: 'hotel',
    items: [
      'Hotel Booking', 'Resort Booking', 'Homestay / Villa', 'Hostel Booking',
      'Camping Booking'
    ],
  },
  {
    title: 'Entertainment & Events',
    description: 'Cinema, theatre, concerts, festivals, gaming, and workshops',
    icon: 'movie',
    items: [
      'Cinema / Movie Tickets', 'Theatre Shows', 'Concert Tickets', 'Events & Festivals',
      'Exhibition Entry', 'Workshops / Classes', 'Gaming Arena Booking'
    ],
  },
  {
    title: 'Sports & Turf',
    description: 'Turfs, grounds, indoor courts, swimming pools, and play arenas',
    icon: 'sports_soccer',
    items: [
      'Football Turf', 'Cricket Ground', 'Badminton Court', 'Tennis Court',
      'Basketball Court', 'Swimming Pool Slots', 'Indoor Play Arena'
    ],
  },
  {
    title: 'Lifestyle & Local Services',
    description: 'Dining, wellness, beauty, medical, and home technician/creative services',
    icon: 'restaurant',
    items: [
      'Restaurant Table Reservation', 'Salon / Spa Appointment', 'Gym / Yoga Slot Booking',
      'Doctor Appointment', 'Electrician Booking', 'Plumber Booking',
      'Cleaning Service', 'Technician Service', 'Studio Booking'
    ],
  },
  {
    title: 'Business & Professional',
    description: 'Co-working spaces, meeting rooms, podcast studios, and conference halls',
    icon: 'business',
    items: [
      'Co-working Space', 'Meeting Room', 'Podcast Studio', 'Conference Hall',
      'Training Sessions'
    ],
  },
  {
    title: 'Religious & Government Services',
    description: 'Darshan, poojas, exam slots, passports, and official government visits',
    icon: 'account_balance',
    items: [
      'Temple Darshan Booking', 'Pooja Slot Booking', 'Pilgrimage Packages',
      'Exam Slot Booking', 'Passport Appointment', 'RTO Appointment',
      'Government Office Appointment'
    ],
  },
  {
    title: 'Rental & Equipment Booking',
    description: 'Rent cycles, sports bikes, cameras, sound systems, and event equipment',
    icon: 'shopping_bag',
    items: [
      'Cycle Rental', 'Sports Bike Rental', 'Camera Rental', 'Sound System Rental',
      'Event Equipment Rental'
    ],
  },
  {
    title: 'Personal & Miscellaneous Services',
    description: 'Pet grooming, babysitting, elder care, and event organizers',
    icon: 'pets',
    items: [
      'Pet Grooming Appointment', 'Babysitting Service', 'Elder Care Service',
      'Event Organizer Booking'
    ],
  },
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
  
  // Religious & Government Services
  else if (itemLower.includes('darshan')) slug = 'darshan';
  else if (itemLower.includes('pooja')) slug = 'pooja';
  else if (itemLower.includes('pilgrimage')) slug = 'pilgrimage';
  else if (itemLower.includes('exam')) slug = 'exams';
  else if (itemLower.includes('passport')) slug = 'passport';
  else if (itemLower.includes('rto')) slug = 'rto';
  else if (itemLower.includes('government') || itemLower.includes('gov')) slug = 'gov-office';
  
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

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <>
      <TopNav />
      <div className="hidden lg:block">
        <SideNav />
      </div>
      <main className="page-content-with-sidenav px-4 md:px-8 lg:pr-8">
        <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-outline)]">Categories</p>
          <h1 className="mt-2 text-[30px] md:text-[42px] font-black tracking-tight text-[color:var(--color-on-surface)]">
            Browse all services and categories
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] md:text-[16px] leading-7 text-[color:var(--color-on-surface-variant)]">
            Every service is grouped here so you can find travel, stay, lifestyle, entertainment, and account tools in one clean place.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SERVICE_GROUPS.map((group) => {
            const groupHref = getGroupHref(group.title);
            return (
              <div
                key={group.title}
                onClick={() => router.push(groupHref)}
                className="card-glass rounded-[28px] border border-[color:var(--color-outline-variant)]/30 bg-[color:var(--color-surface-container)] p-5 cursor-pointer hover:border-[color:var(--color-primary)]/30 active:scale-[0.99] transition-all duration-300 relative group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--color-primary)]/20 bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined">{group.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[18px] font-bold text-[color:var(--color-on-surface)] group-hover:text-[color:var(--color-primary)] transition-colors">{group.title}</h2>
                    <p className="mt-1 text-[13px] leading-6 text-[color:var(--color-on-surface-variant)]">{group.description}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 relative z-10">
                  {group.items.map((item) => (
                    <Link
                      key={item}
                      href={getHrefForCategoryItem(group.title, item)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-full border border-[color:var(--color-outline-variant)]/40 bg-[color:var(--color-surface-dim)]/50 px-3 py-1.5 text-[12px] font-semibold text-[color:var(--color-on-surface)] hover:border-[color:var(--color-primary)]/40 hover:bg-[color:var(--color-surface-container-high)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
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
