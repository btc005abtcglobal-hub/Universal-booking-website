import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MedicalReport {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Prescription {
  diagnosis: string;
  medications: { name: string; dosage: string; duration: string }[];
  updatedAt: string;
}

export interface DietPlan {
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  dietType: string; // e.g. "Keto", "High Protein Lean Bulk"
  assignedAt: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weightLbs?: number;
}

export interface PersistedBooking {
  id: string;
  ref: string;
  serviceId: string;
  serviceName: string;
  merchantName: string;
  category: string;
  date: string;
  time: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'CHECKED_IN';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  
  // Doctor/Medical specific fields
  vitals?: {
    bp: string;
    temp: string;
    pulse: string;
    oxygen: string;
  };
  symptoms?: string;
  medicalReports?: MedicalReport[];
  prescription?: Prescription;

  // Fitness specific fields
  fitnessGoal?: string;
  dietPlan?: DietPlan;
  workoutPlan?: WorkoutExercise[];
  weightTracker?: { date: string; weightKg: number }[];

  // Salon specific fields
  stylingNotes?: string;
  stylistAssigned?: string;
  hairType?: string;
  skinType?: string;
  beforeAfterGallery?: string[]; // simulated base64 or picture seeds

  // Dining specific fields
  tableNumber?: string;
  seatCount?: number;
  dietaryRestrictions?: string[];
  occasion?: string;
  preOrderedCourses?: string[];
}

export interface CatalogService {
  id: string;
  name: string;
  merchant: string;
  price: number;
  duration: number; // in minutes
  category: string;
  active: boolean;
  rating: number;
  bookingsCount: number;
  description?: string;
  
  // Custom industry-specific details
  specializationRequired?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  productsUsed?: string;
  tableCapacity?: number;

  // Doctor/Medical specific
  doctorName?: string;
  roomNumber?: string;

  // Fitness specific
  trainerName?: string;
  classCapacity?: number;

  // Salon specific
  stylistName?: string;
  treatmentType?: string;

  // Dining specific
  cuisineType?: string;
  seatingSection?: string;

  // Cinema/Theatre specific
  moviePoster?: string;
  movieShowtimes?: string;
  movieLanguage?: string;
  movieRating?: string;
  hallNumber?: string;

  [key: string]: any;
}

export interface MerchantUser {
  id: string;
  username: string;
  merchantName: string;
  category: string;
  logoLetter: string;
  aboutText: string;
  vendorId?: string;
  email?: string;
  assignSupervisor?: boolean;
  supervisorName?: string;
  supervisorPhone?: string;
  supervisorEmail?: string;
  supervisorAddress?: string;
}

interface VendorStoreState {
  currentMerchant: MerchantUser | null;
  loginRole: 'vendor' | 'supervisor' | null;
  supervisorId: string | null;
  theme: 'system' | 'light' | 'dark';
  bookings: PersistedBooking[];
  services: CatalogService[];
  
  // Theme actions
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  
  // Auth actions
  loginMerchant: (username: string, passwordHash: string) => boolean;
  logoutMerchant: () => void;
  switchStore: (merchantId: string) => void;
  
  // Booking actions
  checkInBooking: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  updateBookingNotes: (bookingId: string, notes: string) => void;
  
  // Industry actions — Medical
  uploadReport: (bookingId: string, reportName: string) => void;
  deleteReport: (bookingId: string, reportId: string) => void;
  savePrescription: (bookingId: string, prescription: Prescription) => void;
  
  // Industry actions — Fitness
  assignDiet: (bookingId: string, diet: DietPlan) => void;
  saveWorkout: (bookingId: string, workout: WorkoutExercise[]) => void;
  
  // Industry actions — Salon
  saveStylingDetails: (bookingId: string, details: { stylist: string; hairType: string; skinType: string; stylingNotes: string }) => void;
  uploadBeforeAfterPhoto: (bookingId: string, photoSeed: string) => void;
  
  // Industry actions — Dining
  assignTable: (bookingId: string, tableNumber: string) => void;
  saveDietaryAlerts: (bookingId: string, alerts: string[]) => void;

  // Services actions
  addService: (service: CatalogService) => void;
  updateService: (updated: CatalogService) => void;
  deleteService: (serviceId: string) => void;
}

export const PRESET_MERCHANTS: MerchantUser[] = [
  { 
    id: 'mer-1', 
    username: 'doctor', 
    merchantName: 'Apollo Dental Care', 
    category: 'Doctor Appointment', 
    logoLetter: 'A',
    aboutText: 'Apollo Dental Care is a multi-specialty dental clinic network dedicated to providing high-quality oral health services. From preventive care to advanced orthodontics and restorative treatments, our certified specialists ensure comfort and clinical excellence for all patients.',
    vendorId: '2026050001',
    email: 'doctor@bnxmail.com'
  },
  { 
    id: 'mer-2', 
    username: 'fitness', 
    merchantName: 'ZenFit Clinic', 
    category: 'Gym / Yoga Slot Booking', 
    logoLetter: 'Z',
    aboutText: 'ZenFit is a holistic strength and wellness clinic combining personal functional training, vinyasa yoga, and evidence-based nutrition coaching. Our certified coaches provide structured training and diet plans to guide you toward sustainable health goals.',
    vendorId: '2026050002',
    email: 'fitness@bnxmail.com'
  },
  { 
    id: 'mer-3', 
    username: 'salon', 
    merchantName: 'Style Studio', 
    category: 'Salon / Spa Appointment', 
    logoLetter: 'S',
    aboutText: 'Style Studio is a premium beauty and wellness salon specializing in modern hair design, organic aesthetic therapies, and restorative body treatments. We combine advanced skin care with professional styling in an inviting, contemporary atmosphere.',
    vendorId: '2026050003',
    email: 'salon@bnxmail.com'
  },
  { 
    id: 'mer-4', 
    username: 'dining', 
    merchantName: 'The Grand Temple Dine', 
    category: 'Restaurant Table Reservation', 
    logoLetter: 'T',
    aboutText: 'The Grand Temple Dine delivers an exceptional culinary experience, combining contemporary fusion menus with custom chef\'s tasting events and table-side service in a refined architectural setting.',
    vendorId: '2026050004',
    email: 'dining@bnxmail.com'
  },
  { 
    id: 'mer-5', 
    username: 'salon', 
    merchantName: 'Glitz Parlour', 
    category: 'Salon / Spa Appointment', 
    logoLetter: 'G',
    aboutText: 'Glitz Parlour offers advanced bridal makeovers, nail art, and organic facial treatments designed to make you shine on every occasion.',
    vendorId: '2026050003',
    email: 'glitz@bnxmail.com'
  },
  { 
    id: 'mer-6', 
    username: 'salon', 
    merchantName: 'Urban Haircut Co', 
    category: 'Salon / Spa Appointment', 
    logoLetter: 'U',
    aboutText: 'Urban Haircut Co provides quick, premium grooming, haircuts, and beard stylings for the modern busy professional.',
    vendorId: '2026050003',
    email: 'urban@bnxmail.com'
  }
];

const INITIAL_SERVICES: CatalogService[] = [
  // Dental / Medical
  { id: 'svc-d1', name: 'Root Canal Treatment', merchant: 'Apollo Dental Care', price: 3500, duration: 60, category: 'Doctor Appointment', active: true, rating: 4.8, bookingsCount: 142, description: 'Expert root canal therapy with ceramic crown molding and painless local anesthesia.', specializationRequired: 'Endodontics' },
  { id: 'svc-d2', name: 'Orthodontic Braces Scan', merchant: 'Apollo Dental Care', price: 500, duration: 30, category: 'Doctor Appointment', active: true, rating: 4.6, bookingsCount: 98, description: '3D digital intraoral orthodontic scanning and complete custom aligners consultation.', specializationRequired: 'Orthodontics' },
  { id: 'svc-d3', name: 'Teeth Whitening Session', merchant: 'Apollo Dental Care', price: 2500, duration: 45, category: 'Doctor Appointment', active: true, rating: 4.9, bookingsCount: 64, description: 'Laser-activated clinical teeth whitening for immediate shade improvement.', specializationRequired: 'General Dentistry' },
  
  // Fitness
  { id: 'svc-f1', name: 'Yoga Vinyasa Session', merchant: 'ZenFit Clinic', price: 499, duration: 60, category: 'Gym / Yoga Slot Booking', active: true, rating: 4.9, bookingsCount: 220, description: 'Morning breathing practice and core flexibility yoga flow in solar studios.', difficultyLevel: 'Beginner' },
  { id: 'svc-f2', name: 'HIIT Boot Camp', merchant: 'ZenFit Clinic', price: 799, duration: 45, category: 'Gym / Yoga Slot Booking', active: true, rating: 4.7, bookingsCount: 167, description: 'High-intensity interval cardio training session designed to boost metabolic performance.', difficultyLevel: 'Advanced' },
  { id: 'svc-f3', name: '1-on-1 Fitness Consulting', merchant: 'ZenFit Clinic', price: 1200, duration: 60, category: 'Gym / Yoga Slot Booking', active: true, rating: 4.8, bookingsCount: 88, description: 'Personal assessment, body fat indexing, and tailored macro diet planning sessions.', difficultyLevel: 'Intermediate' },

  // Salon
  { id: 'svc-s1', name: 'Premium Haircut & Wash', merchant: 'Style Studio', price: 599, duration: 45, category: 'Salon / Spa Appointment', active: true, rating: 4.8, bookingsCount: 432, description: 'Bespoke fade cuts, deep tea-tree hair wash, and hot towel style massage.', productsUsed: 'Sulfate-Free Tea-Tree Oils' },
  { id: 'svc-s2', name: 'Full Body Massage', merchant: 'Style Studio', price: 1800, duration: 90, category: 'Salon / Spa Appointment', active: true, rating: 4.9, bookingsCount: 231, description: 'Swedish deep tissue massage with natural lavender essential aromatic oils.', productsUsed: 'Lavender Aromatic Oils' },
  { id: 'svc-s3', name: 'Hydrafacial Facial Skin Treatment', merchant: 'Style Studio', price: 2200, duration: 60, category: 'Salon / Spa Appointment', active: false, rating: 4.6, bookingsCount: 45, description: 'Clinical skin extraction, vortex exfoliation, and antioxidant hydration serum infusion.', productsUsed: 'Antioxidant Collagen Hydration Serum' },

  // Dining
  { id: 'svc-r1', name: 'Premium Dinner Table Booking', merchant: 'The Grand Temple Dine', price: 1200, duration: 120, category: 'Restaurant Table Reservation', active: true, rating: 4.7, bookingsCount: 512, description: 'Reserved table seating in the rooftop temple pavilion with access to full menu catalog.', tableCapacity: 4 },
  { id: 'svc-r2', name: 'Couples Candle Light Package', merchant: 'The Grand Temple Dine', price: 3500, duration: 150, category: 'Restaurant Table Reservation', active: true, rating: 4.9, bookingsCount: 104, description: 'Private corner table, personalized floral setups, 5-course degustation menu, and soft live music.', tableCapacity: 2 },

  // Salon Extra - Glitz Parlour
  { id: 'svc-gp1', name: 'Bridal Glow Makeover', merchant: 'Glitz Parlour', price: 4500, duration: 120, category: 'Salon / Spa Appointment', active: true, rating: 4.9, bookingsCount: 38, description: 'Complete HD bridal makeup session, premium lashes, and setting spray lock.', productsUsed: 'MAC & Estée Lauder HD Kits' },
  { id: 'svc-gp2', name: 'Gel Nail Art & Extensions', merchant: 'Glitz Parlour', price: 1500, duration: 60, category: 'Salon / Spa Appointment', active: true, rating: 4.7, bookingsCount: 89, description: 'Premium gel extensions with custom hand-drawn nail art and rhinestone styling.', productsUsed: 'OPI Gel Polishes' },

  // Salon Extra - Urban Haircut Co
  { id: 'svc-uh1', name: 'Modern Scissor Cut & Trim', merchant: 'Urban Haircut Co', price: 350, duration: 30, category: 'Salon / Spa Appointment', active: true, rating: 4.5, bookingsCount: 110, description: 'Classic grooming, shampoo, precise beard line styling with a hot towel finish.', productsUsed: 'Urban Beard Balm' }
];

const INITIAL_BOOKINGS: PersistedBooking[] = [
  // Dental Bookings
  {
    id: 'bk-d1',
    ref: 'BK-DT8841',
    serviceId: 'svc-d1',
    serviceName: 'Root Canal Treatment',
    merchantName: 'Apollo Dental Care',
    category: 'Doctor Appointment',
    date: '2026-05-26',
    time: '10:00 AM',
    amount: 3500,
    status: 'CONFIRMED',
    customerName: 'Aditya Sen',
    customerEmail: 'aditya.sen@gmail.com',
    customerPhone: '+91 99887 76655',
    notes: 'Patient notes: Extreme throbbing pain in lower-left jaw when drinking hot beverages.',
    vitals: { bp: '122/80 mmHg', temp: '98.6 °F', pulse: '76 bpm', oxygen: '99%' },
    symptoms: 'Patient reports sharp pain in the lower left molar (Tooth #36) for 4 days. Visible enamel decay.',
    medicalReports: [
      { id: 'rep-1', name: 'Panoramic_XRay_Aditya.jpg', url: 'https://picsum.photos/seed/xray/300/300', uploadedAt: '2026-05-25 14:22' }
    ]
  },
  {
    id: 'bk-d2',
    ref: 'BK-DT9102',
    serviceId: 'svc-d2',
    serviceName: 'Orthodontic Braces Scan',
    merchantName: 'Apollo Dental Care',
    category: 'Doctor Appointment',
    date: '2026-05-26',
    time: '02:30 PM',
    amount: 500,
    status: 'CHECKED_IN',
    customerName: 'Meera Deshmukh',
    customerEmail: 'meera.d@outlook.com',
    customerPhone: '+91 98112 23344',
    notes: 'Patient notes: Interested in invisible clear aligners rather than metal wire brackets.',
    vitals: { bp: '118/76 mmHg', temp: '98.2 °F', pulse: '72 bpm', oxygen: '98%' },
    symptoms: 'Mild dental overcrowding in the upper anterior segment. Needs clear aligner scanning.',
    medicalReports: []
  },
  {
    id: 'bk-d3',
    ref: 'BK-DT4589',
    serviceId: 'svc-d3',
    serviceName: 'Teeth Whitening Session',
    merchantName: 'Apollo Dental Care',
    category: 'Doctor Appointment',
    date: '2026-05-24',
    time: '11:00 AM',
    amount: 2500,
    status: 'COMPLETED',
    customerName: 'Varun Nair',
    customerEmail: 'varun.nair@yahoo.com',
    customerPhone: '+91 94445 55667',
    notes: 'Post-op instructions delivered. Avoid coffee for 48 hours.',
    vitals: { bp: '120/80 mmHg', temp: '98.6 °F', pulse: '74 bpm', oxygen: '99%' },
    symptoms: 'Extrinsic staining from coffee consumption. Demands laser teeth whitening.',
    medicalReports: [],
    prescription: {
      diagnosis: 'Enamel dental stains (secondary to tea/coffee).',
      medications: [
        { name: 'Sensodyne Whitening Paste', dosage: 'Brush twice daily', duration: 'Ongoing' }
      ],
      updatedAt: '2026-05-24 11:45'
    }
  },

  // Fitness Bookings
  {
    id: 'bk-f1',
    ref: 'BK-FT3321',
    serviceId: 'svc-f3',
    serviceName: '1-on-1 Fitness Consulting',
    merchantName: 'ZenFit Clinic',
    category: 'Gym / Yoga Slot Booking',
    date: '2026-05-26',
    time: '08:30 AM',
    amount: 1200,
    status: 'CONFIRMED',
    customerName: 'Karan Mehra',
    customerEmail: 'karan.mehra@gmail.com',
    customerPhone: '+91 90011 22334',
    notes: 'Member notes: Knee surgery 8 months ago, avoid heavy quad load.',
    fitnessGoal: 'Sustain weight loss, lean muscle definition, and active joint rehabilitation.',
    dietPlan: {
      protein: 160,
      carbs: 180,
      fats: 65,
      dietType: 'High Protein Caloric Deficit',
      assignedAt: '2026-05-20'
    },
    workoutPlan: [
      { name: 'Kettlebell Romanian Deadlifts', sets: 4, reps: 12, weightLbs: 35 },
      { name: 'Dumbbell Chest Press', sets: 4, reps: 10, weightLbs: 40 },
      { name: 'Hamstring Swiss-Ball Curls', sets: 3, reps: 15 }
    ],
    weightTracker: [
      { date: 'May 01', weightKg: 84.5 },
      { date: 'May 10', weightKg: 83.2 },
      { date: 'May 20', weightKg: 82.0 }
    ]
  },
  {
    id: 'bk-f2',
    ref: 'BK-FT4452',
    serviceId: 'svc-f1',
    serviceName: 'Yoga Vinyasa Session',
    merchantName: 'ZenFit Clinic',
    category: 'Gym / Yoga Slot Booking',
    date: '2026-05-26',
    time: '06:00 AM',
    amount: 499,
    status: 'CONFIRMED',
    customerName: 'Sanjana Roy',
    customerEmail: 'sanjana@gmail.com',
    customerPhone: '+91 91234 98765',
    notes: 'Prefers alignment corrections.',
    fitnessGoal: 'Improve core strength, pelvic balance, and mental clarity.',
    dietPlan: {
      protein: 70,
      carbs: 220,
      fats: 50,
      dietType: 'Plant-based Balanced Diet',
      assignedAt: '2026-05-25'
    }
  },

  // Salon Bookings
  {
    id: 'bk-s1',
    ref: 'BK-SL1090',
    serviceId: 'svc-s1',
    serviceName: 'Premium Haircut & Wash',
    merchantName: 'Style Studio',
    category: 'Salon / Spa Appointment',
    date: '2026-05-26',
    time: '11:30 AM',
    amount: 599,
    status: 'CONFIRMED',
    customerName: 'Rohan Sharma',
    customerEmail: 'rohan.sharma@outlook.com',
    customerPhone: '+91 97766 55443',
    notes: 'Client notes: Requires low skin fade on sides, scissor trim on top.',
    stylingNotes: 'Wants classic undercut with matte clay finish. Prefers organic shampoo due to dry scalp.',
    stylistAssigned: 'Vikram Singh',
    hairType: 'Thick, straight',
    skinType: 'Dry scalp',
    beforeAfterGallery: []
  },
  {
    id: 'bk-s2',
    ref: 'BK-SL8041',
    serviceId: 'svc-s2',
    serviceName: 'Full Body Massage',
    merchantName: 'Style Studio',
    category: 'Salon / Spa Appointment',
    date: '2026-05-25',
    time: '04:00 PM',
    amount: 1800,
    status: 'COMPLETED',
    customerName: 'Deepika Iyer',
    customerEmail: 'deepika.i@gmail.com',
    customerPhone: '+91 95551 23456',
    stylingNotes: 'Lower back stiffness. Swedish massage technique with extra focus on shoulders. Lavender oil used.',
    stylistAssigned: 'Maria Fernandes',
    skinType: 'Sensitive',
    beforeAfterGallery: [
      'https://picsum.photos/seed/salon1/200/200'
    ]
  },

  // Restaurant Bookings
  {
    id: 'bk-r1',
    ref: 'BK-DN5540',
    serviceId: 'svc-r1',
    serviceName: 'Premium Dinner Table Booking',
    merchantName: 'The Grand Temple Dine',
    category: 'Restaurant Table Reservation',
    date: '2026-05-26',
    time: '08:00 PM',
    amount: 1200,
    status: 'CONFIRMED',
    customerName: 'Anil Vasudevan',
    customerEmail: 'anil.v@gmail.com',
    customerPhone: '+91 98450 67890',
    notes: 'Guest notes: Severe peanut allergy in the group. Vegan dinner options needed.',
    tableNumber: 'Table 4 (Window Seat)',
    seatCount: 4,
    dietaryRestrictions: ['Vegan', 'Severe Peanut Allergy'],
    occasion: 'Marriage Anniversary',
    preOrderedCourses: ['Stuffed Mushroom Caps', 'Truffle Glazed Risotto', 'Vegan Chocolate Mousse']
  },
  {
    id: 'bk-r2',
    ref: 'BK-DN1120',
    serviceId: 'svc-r2',
    serviceName: 'Couples Candle Light Package',
    merchantName: 'The Grand Temple Dine',
    category: 'Restaurant Table Reservation',
    date: '2026-05-26',
    time: '09:00 PM',
    amount: 3500,
    status: 'CONFIRMED',
    customerName: 'Prakash Raj',
    customerEmail: 'prakash.r@yahoo.com',
    customerPhone: '+91 97771 22334',
    notes: 'No spicy food.',
    tableNumber: 'Table 12 (Corner Altar)',
    seatCount: 2,
    dietaryRestrictions: ['No Seafood'],
    occasion: 'Birthday Surprise',
    preOrderedCourses: ['Tomato Basil Soup', 'Herb Roasted Paneer', 'Lava Chocolate cake']
  },
  {
    id: 'bk-gp1',
    ref: 'BK-GP2281',
    serviceId: 'svc-gp1',
    serviceName: 'Bridal Glow Makeover',
    merchantName: 'Glitz Parlour',
    category: 'Salon / Spa Appointment',
    date: '2026-05-26',
    time: '01:00 PM',
    amount: 4500,
    status: 'CONFIRMED',
    customerName: 'Aishwarya Roy',
    customerEmail: 'aishwarya@gmail.com',
    customerPhone: '+91 99999 11111',
    notes: 'Client notes: Requires high-definition makeup for evening reception. Gold undertones.',
    stylingNotes: 'Wants classic red lip, gold shimmer eyes. Skin type: Normal to dry.',
    stylistAssigned: 'Maria Fernandes',
    skinType: 'Dry'
  },
  {
    id: 'bk-uh1',
    ref: 'BK-UH9920',
    serviceId: 'svc-uh1',
    serviceName: 'Modern Scissor Cut & Trim',
    merchantName: 'Urban Haircut Co',
    category: 'Salon / Spa Appointment',
    date: '2026-05-26',
    time: '11:00 AM',
    amount: 350,
    status: 'CONFIRMED',
    customerName: 'Rahul Dravid',
    customerEmail: 'rahul.d@wall.com',
    customerPhone: '+91 98888 77777',
    notes: 'Needs quick dry cut.'
  }
];

function formatSlug(slug: string): string {
  const mapping: Record<string, string> = {
    flights: 'Flight Booking',
    trains: 'Train Booking',
    buses: 'Bus Booking',
    ferry: 'Ferry / Boat Booking',
    shuttle: 'Shuttle / Van Booking',
    helicopter: 'Helicopter Booking',
    cabs: 'Cab / Taxi Booking',
    'bike-rental': 'Bike Rental',
    'car-rental': 'Self-Drive Car Rental',
    hotels: 'Hotel Booking',
    resorts: 'Resort Booking',
    villas: 'Homestay / Villa',
    hostels: 'Hostel Booking',
    camping: 'Camping Booking',
    movies: 'Cinema / Movie Tickets',
    theatre: 'Theatre Shows',
    concerts: 'Concert Tickets',
    events: 'Events & Festivals',
    exhibitions: 'Exhibition Entry',
    workshops: 'Workshops / Classes',
    gaming: 'Gaming Arena Booking',
    'football-turf': 'Football Turf',
    'cricket-ground': 'Cricket Ground',
    badminton: 'Badminton Court',
    tennis: 'Tennis Court',
    basketball: 'Basketball Court',
    swimming: 'Swimming Pool Slots',
    'play-arena': 'Indoor Play Arena',
    dining: 'Restaurant Table Reservation',
    salons: 'Salon / Spa Appointment',
    'gym-yoga': 'Gym / Yoga Slot Booking',
    doctor: 'Doctor Appointment',
    electrician: 'Electrician Booking',
    plumber: 'Plumber Booking',
    cleaning: 'Cleaning Service',
    technician: 'Technician Service',
    studio: 'Studio Booking',
    coworking: 'Co-working Space',
    'meeting-room': 'Meeting Room',
    podcast: 'Podcast Studio',
    conference: 'Conference Hall',
    training: 'Training Sessions',
    darshan: 'Temple Darshan Booking',
    pooja: 'Pooja Slot Booking',
    pilgrimage: 'Pilgrimage Packages',
    'cycle-rental': 'Cycle Rental',
    'sports-bike': 'Sports Bike Rental',
    camera: 'Camera Rental',
    'sound-system': 'Sound System Rental',
    'event-equip': 'Event Equipment Rental',
    'pet-grooming': 'Pet Grooming Appointment',
    babysitting: 'Babysitting Service',
    'elder-care': 'Elder Care Service',
    'event-organizer': 'Event Organizer Booking',
  };
  
  if (mapping[slug]) return mapping[slug];
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getMockServicesForAdminMerchant(merchant: MerchantUser): CatalogService[] {
  return [
    {
      id: `ds-${merchant.username}-1`,
      name: `Standard ${merchant.category} Service`,
      merchant: merchant.merchantName,
      price: 499,
      duration: 45,
      category: merchant.category,
      active: true,
      rating: 4.7,
      bookingsCount: 24,
      description: `Professional standard ${merchant.category} package.`
    },
    {
      id: `ds-${merchant.username}-2`,
      name: `Premium ${merchant.category} Package`,
      merchant: merchant.merchantName,
      price: 1499,
      duration: 90,
      category: merchant.category,
      active: true,
      rating: 4.9,
      bookingsCount: 12,
      description: `Complete luxury ${merchant.category} experience.`
    }
  ];
}

export interface SubAccount {
  subId: string;
  merchantId: string;
  passwordHash: string;
}

export const SUB_ACCOUNTS: SubAccount[] = [
  { subId: 'D101', merchantId: 'mer-1', passwordHash: 'pass101' },
  { subId: 'F202', merchantId: 'mer-2', passwordHash: 'pass202' },
  { subId: 'S303', merchantId: 'mer-3', passwordHash: 'pass303' },
  { subId: 'R404', merchantId: 'mer-4', passwordHash: 'pass404' },
  { subId: 'G505', merchantId: 'mer-5', passwordHash: 'pass505' },
  { subId: 'U606', merchantId: 'mer-6', passwordHash: 'pass606' }
];

export const VENDOR_ACCOUNTS = [
  { username: 'admin', passwordHash: 'admin123' },
  { username: 'vendor123', passwordHash: 'vendorpass123' }
];

export const useVendorStore = create<VendorStoreState>()(
  persist(
    (set, get) => ({
      currentMerchant: null,
      loginRole: null,
      supervisorId: null,
      theme: 'system',
      bookings: INITIAL_BOOKINGS,
      services: INITIAL_SERVICES,
      
      setTheme: (theme) => set({ theme }),
      
      loginMerchant: (username, passwordHash) => {
        const cleanUser = username.trim();
        const lowerUser = cleanUser.toLowerCase();

        // 1. Check Sub ID (Supervisor)
        const subAcc = SUB_ACCOUNTS.find(
          (s) => s.subId.toUpperCase() === cleanUser.toUpperCase() && s.passwordHash === passwordHash
        );
        if (subAcc) {
          const found = PRESET_MERCHANTS.find((m) => m.id === subAcc.merchantId);
          if (found) {
            set({ currentMerchant: found, loginRole: 'supervisor', supervisorId: subAcc.subId });
            // Seed services for this merchant if not present
            const hasServices = get().services.some(s => s.merchant === found.merchantName);
            if (!hasServices) {
              const newServices = getMockServicesForAdminMerchant(found);
              set({ services: [...get().services, ...newServices] });
            }
            return true;
          }
        }

        // 2. Check Main Vendor Account
        const isVendor = VENDOR_ACCOUNTS.some(
          (v) => v.username.toLowerCase() === lowerUser && v.passwordHash === passwordHash
        );
        // Fallback for old preset login for testing if passcode is '123'
        const isLegacyPreset = passwordHash === '123' && PRESET_MERCHANTS.some(m => m.username === lowerUser || lowerUser === 'admin');

        if (isVendor || isLegacyPreset) {
          const checkUsername = lowerUser === 'admin' || lowerUser === 'vendor123' ? 'doctor' : lowerUser;
          let found = PRESET_MERCHANTS.find((m) => m.username === checkUsername);
          if (!found) {
            found = PRESET_MERCHANTS[0];
          }
          set({ currentMerchant: found, loginRole: 'vendor', supervisorId: null });
          
          // Seed services for this merchant if not present
          const hasServices = get().services.some(s => s.merchant === found.merchantName);
          if (!hasServices) {
            const newServices = getMockServicesForAdminMerchant(found);
            set({ services: [...get().services, ...newServices] });
          }
          return true;
        }

        return false;
      },
      
      logoutMerchant: () => {
        set({ currentMerchant: null, loginRole: null, supervisorId: null });
      },
      
      switchStore: (merchantId) => {
        let found = PRESET_MERCHANTS.find((m) => m.id === merchantId);
        if (!found && merchantId.startsWith('mer-')) {
          const checkUsername = merchantId.replace('mer-', '');
          const categoryName = formatSlug(checkUsername);
          found = {
            id: merchantId,
            username: checkUsername,
            merchantName: `${categoryName} Care Hub`,
            category: categoryName,
            logoLetter: categoryName.charAt(0),
            aboutText: `Welcome to ${categoryName} Care Hub. We provide professional bookings and top-tier services.`
          };
        }
        if (found) {
          set({ currentMerchant: found });
          
          // Seed services for this merchant if not present
          const hasServices = get().services.some(s => s.merchant === found.merchantName);
          if (!hasServices) {
            const newServices = getMockServicesForAdminMerchant(found);
            set({ services: [...get().services, ...newServices] });
          }
        }
      },
      
      checkInBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'CHECKED_IN' as const } : b
          )
        }));
      },
      
      completeBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'COMPLETED' as const } : b
          )
        }));
      },
      
      cancelBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
          )
        }));
      },

      updateBookingNotes: (bookingId, notes) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, notes } : b
          )
        }));
      },
      
      // Medical actions
      uploadReport: (bookingId, reportName) => {
        const newReport = {
          id: `rep-${Date.now()}`,
          name: reportName,
          url: 'https://picsum.photos/seed/rep/300/300',
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id === bookingId) {
              const currentReports = b.medicalReports || [];
              return { ...b, medicalReports: [...currentReports, newReport] };
            }
            return b;
          })
        }));
      },
      
      deleteReport: (bookingId, reportId) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id === bookingId) {
              const currentReports = b.medicalReports || [];
              return {
                ...b,
                medicalReports: currentReports.filter((r) => r.id !== reportId)
              };
            }
            return b;
          })
        }));
      },
      
      savePrescription: (bookingId, prescription) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, prescription } : b
          )
        }));
      },
      
      // Fitness actions
      assignDiet: (bookingId, diet) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, dietPlan: diet } : b
          )
        }));
      },
      
      saveWorkout: (bookingId, workout) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, workoutPlan: workout } : b
          )
        }));
      },
      
      // Salon actions
      saveStylingDetails: (bookingId, details) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  stylistAssigned: details.stylist,
                  hairType: details.hairType,
                  skinType: details.skinType,
                  stylingNotes: details.stylingNotes
                }
              : b
          )
        }));
      },
      
      uploadBeforeAfterPhoto: (bookingId, photoSeed) => {
        const photoUrl = `https://picsum.photos/seed/${photoSeed}/200/200`;
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id === bookingId) {
              const currentGallery = b.beforeAfterGallery || [];
              return { ...b, beforeAfterGallery: [...currentGallery, photoUrl] };
            }
            return b;
          })
        }));
      },
      
      // Dining actions
      assignTable: (bookingId, tableNumber) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, tableNumber } : b
          )
        }));
      },
      
      saveDietaryAlerts: (bookingId, alerts) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, dietaryRestrictions: alerts } : b
          )
        }));
      },

      // Services actions
      addService: (service) => {
        set((state) => ({
          services: [service, ...state.services]
        }));
      },
      
      updateService: (updated) => {
        set((state) => ({
          services: state.services.map((s) => (s.id === updated.id ? updated : s))
        }));
      },
      
      deleteService: (serviceId) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== serviceId)
        }));
      }
    }),
    { name: 'vendor-portal-storage' }
  )
);
