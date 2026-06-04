// ============================================================
// Seed: BETA Universal Service Marketplace
// Populates BookingTypes, ServiceCategories
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bookingTypes = [
  {
    name: 'Travel & Transport',
    slug: 'travel-transport',
    description: 'All movement/travel-related bookings, including public transit and personal rentals',
    iconName: 'directions-car',
    color: '#60A5FA',
    gradient: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
    sortOrder: 1,
    isFeatured: true,
    categories: [
      { name: 'Bus Booking', slug: 'buses', iconName: 'bus', color: '#60A5FA' },
      { name: 'Train Booking', slug: 'trains', iconName: 'train', color: '#60A5FA' },
      { name: 'Flight Booking', slug: 'flights', iconName: 'plane', color: '#60A5FA' },
      { name: 'Ferry / Boat Booking', slug: 'ferry', iconName: 'ship', color: '#60A5FA' },
      { name: 'Shuttle / Van Booking', slug: 'shuttle', iconName: 'shuttle-van', color: '#60A5FA' },
      { name: 'Helicopter Booking (Premium)', slug: 'helicopter', iconName: 'helicopter', color: '#60A5FA' },
      { name: 'Cab / Taxi Booking', slug: 'cabs', iconName: 'car', color: '#60A5FA' },
      { name: 'Bike Rental', slug: 'bike-rental', iconName: 'bike', color: '#60A5FA' },
      { name: 'Self-Drive Car Rental', slug: 'car-rental', iconName: 'car', color: '#60A5FA' },
    ],
  },
  {
    name: 'Stay & Accommodation',
    slug: 'stay-accommodation',
    description: 'Hotels, resorts, luxury villas, hostels, homestays, and camping options',
    iconName: 'hotel',
    color: '#FBBF24',
    gradient: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
    sortOrder: 2,
    isFeatured: true,
    categories: [
      { name: 'Hotel Booking', slug: 'hotels', iconName: 'hotel', color: '#FBBF24' },
      { name: 'Resort Booking', slug: 'resorts', iconName: 'palmtree', color: '#FBBF24' },
      { name: 'Homestay / Villa', slug: 'villas', iconName: 'home', color: '#FBBF24' },
      { name: 'Hostel Booking', slug: 'hostels', iconName: 'bed', color: '#FBBF24' },
      { name: 'Camping Booking', slug: 'camping', iconName: 'tent', color: '#FBBF24' },
    ],
  },
  {
    name: 'Entertainment & Events',
    slug: 'entertainment-events',
    description: 'Movies, concerts, live plays, festivals, workshops, and gaming slots',
    iconName: 'movie',
    color: '#F472B6',
    gradient: 'linear-gradient(135deg, #F472B6, #EC4899)',
    sortOrder: 3,
    isFeatured: true,
    categories: [
      { name: 'Cinema / Movie Tickets', slug: 'movies', iconName: 'film', color: '#F472B6' },
      { name: 'Theatre Shows', slug: 'theatre', iconName: 'masks-theater', color: '#F472B6' },
      { name: 'Concert Tickets', slug: 'concerts', iconName: 'music', color: '#F472B6' },
      { name: 'Events & Festivals', slug: 'events', iconName: 'party-popper', color: '#F472B6' },
      { name: 'Exhibition Entry', slug: 'exhibitions', iconName: 'ticket', color: '#F472B6' },
      { name: 'Workshops / Classes', slug: 'workshops', iconName: 'palette', color: '#F472B6' },
      { name: 'Gaming Arena Booking', slug: 'gaming', iconName: 'gamepad-2', color: '#F472B6' },
    ],
  },
  {
    name: 'Sports & Turf',
    slug: 'sports-turf',
    description: 'Sports turfs, courts, grounds, swimming, and indoor recreation zones',
    iconName: 'sports_soccer',
    color: '#34D399',
    gradient: 'linear-gradient(135deg, #34D399, #10B981)',
    sortOrder: 4,
    isFeatured: true,
    categories: [
      { name: 'Football Turf', slug: 'football-turf', iconName: 'circle', color: '#34D399' },
      { name: 'Cricket Ground', slug: 'cricket-ground', iconName: 'circle-dot', color: '#34D399' },
      { name: 'Badminton Court', slug: 'badminton', iconName: 'wind', color: '#34D399' },
      { name: 'Tennis Court', slug: 'tennis', iconName: 'tennis-ball', color: '#34D399' },
      { name: 'Basketball Court', slug: 'basketball', iconName: 'dribbble', color: '#34D399' },
      { name: 'Swimming Pool Slots', slug: 'swimming', iconName: 'waves', color: '#34D399' },
      { name: 'Indoor Play Arena', slug: 'play-arena', iconName: 'activity', color: '#34D399' },
    ],
  },
  {
    name: 'Lifestyle & Local Services',
    slug: 'lifestyle-local',
    description: 'Dining, wellness, beauty, medical, and home technician/creative services',
    iconName: 'restaurant',
    color: '#A78BFA',
    gradient: 'linear-gradient(135deg, #A78BFA, #8B5CF6)',
    sortOrder: 5,
    isFeatured: true,
    categories: [
      { name: 'Restaurant Table Reservation', slug: 'dining', iconName: 'utensils', color: '#A78BFA' },
      { name: 'Salon / Spa Appointment', slug: 'salons', iconName: 'scissors', color: '#A78BFA' },
      { name: 'Gym / Yoga Slot Booking', slug: 'gym-yoga', iconName: 'dumbbell', color: '#A78BFA' },
      { name: 'Doctor Appointment', slug: 'doctor', iconName: 'stethoscope', color: '#A78BFA' },
      { name: 'Electrician Booking', slug: 'electrician', iconName: 'zap', color: '#A78BFA' },
      { name: 'Plumber Booking', slug: 'plumber', iconName: 'wrench', color: '#A78BFA' },
      { name: 'Cleaning Service', slug: 'cleaning', iconName: 'sparkles', color: '#A78BFA' },
      { name: 'Technician Service', slug: 'technician', iconName: 'cog', color: '#A78BFA' },
      { name: 'Studio Booking', slug: 'studio', iconName: 'camera', color: '#A78BFA' },
    ],
  },
  {
    name: 'Business & Professional',
    slug: 'business-professional',
    description: 'Workspaces, professional podcast studios, conference halls, and training sessions',
    iconName: 'business',
    color: '#818CF8',
    gradient: 'linear-gradient(135deg, #818CF8, #4F46E5)',
    sortOrder: 6,
    isFeatured: true,
    categories: [
      { name: 'Co-working Space', slug: 'coworking', iconName: 'laptop', color: '#818CF8' },
      { name: 'Meeting Room', slug: 'meeting-room', iconName: 'presentation', color: '#818CF8' },
      { name: 'Podcast Studio', slug: 'podcast', iconName: 'mic', color: '#818CF8' },
      { name: 'Conference Hall', slug: 'conference', iconName: 'users', color: '#818CF8' },
      { name: 'Training Sessions', slug: 'training', iconName: 'graduation-cap', color: '#818CF8' },
    ],
  },
  {
    name: 'Religious & Government Services',
    slug: 'religious-government',
    description: 'Temple darshan passes, pooja bookings, passport, RTO, and official appointments',
    iconName: 'account_balance',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316, #EA580C)',
    sortOrder: 7,
    isFeatured: true,
    categories: [
      { name: 'Temple Darshan Booking', slug: 'darshan', iconName: 'landmark', color: '#F97316' },
      { name: 'Pooja Slot Booking', slug: 'pooja', iconName: 'flame', color: '#F97316' },
      { name: 'Pilgrimage Packages', slug: 'pilgrimage', iconName: 'map', color: '#F97316' },
      { name: 'Exam Slot Booking', slug: 'exams', iconName: 'file-text', color: '#F97316' },
      { name: 'Passport Appointment', slug: 'passport', iconName: 'book-open', color: '#F97316' },
      { name: 'RTO Appointment', slug: 'rto', iconName: 'car-front', color: '#F97316' },
      { name: 'Government Office Appointment', slug: 'gov-office', iconName: 'building-2', color: '#F97316' },
    ],
  },
  {
    name: 'Rental & Equipment Booking',
    slug: 'rental-equipment',
    description: 'Rent cycles, sports bikes, cameras, sound systems, and event items',
    iconName: 'shopping_bag',
    color: '#2DD4BF',
    gradient: 'linear-gradient(135deg, #2DD4BF, #0D9488)',
    sortOrder: 8,
    isFeatured: true,
    categories: [
      { name: 'Cycle Rental', slug: 'cycle-rental', iconName: 'bike', color: '#2DD4BF' },
      { name: 'Sports Bike Rental', slug: 'sports-bike', iconName: 'motorcycle', color: '#2DD4BF' },
      { name: 'Camera Rental', slug: 'camera', iconName: 'camera', color: '#2DD4BF' },
      { name: 'Sound System Rental', slug: 'sound-system', iconName: 'speaker', color: '#2DD4BF' },
      { name: 'Event Equipment Rental', slug: 'event-equip', iconName: 'armchair', color: '#2DD4BF' },
    ],
  },
  {
    name: 'Personal & Miscellaneous Services',
    slug: 'personal-misc',
    description: 'Grooming, elder care, babysitting, and event planning specialists',
    iconName: 'pets',
    color: '#F87171',
    gradient: 'linear-gradient(135deg, #F87171, #EF4444)',
    sortOrder: 9,
    isFeatured: true,
    categories: [
      { name: 'Pet Grooming Appointment', slug: 'pet-grooming', iconName: 'paw-print', color: '#F87171' },
      { name: 'Babysitting Service', slug: 'babysitting', iconName: 'baby', color: '#F87171' },
      { name: 'Elder Care Service', slug: 'elder-care', iconName: 'heart-pulse', color: '#F87171' },
      { name: 'Event Organizer Booking', slug: 'event-organizer', iconName: 'calendar-days', color: '#F87171' },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding BETA Universal Service Marketplace...');

  // Clean existing seed data in correct order to avoid FK conflicts
  await prisma.payment.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.bookingSlot.deleteMany({});
  await prisma.availabilityRule.deleteMany({});
  await prisma.merchantStaff.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.merchant.deleteMany({});
  await prisma.serviceCategory.deleteMany({});
  await prisma.bookingType.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create a default owner user
  const defaultOwner = await prisma.user.create({
    data: {
      email: 'owner@beta-booking.com',
      name: 'Owner Agent',
      externalAuthId: 'default-owner-auth-id-123',
    },
  });
  console.log('✅ Created default owner user');

  // 2. Seed BookingTypes + their ServiceCategories
  const bookingTypeInstances: Record<string, any> = {};
  for (const bt of bookingTypes) {
    const { categories, ...btData } = bt;
    const bookingType = await prisma.bookingType.create({ data: btData });
    bookingTypeInstances[bookingType.slug] = bookingType;
    console.log(`✅ Created BookingType: ${bookingType.name}`);

    for (let i = 0; i < categories.length; i++) {
      await prisma.serviceCategory.create({
        data: {
          ...categories[i],
          bookingTypeId: bookingType.id,
          sortOrder: i,
        },
      });
    }
    console.log(`   ↳ Created ${categories.length} categories`);
  }

  // Fetch created categories to resolve IDs by slug
  const allCategories = await prisma.serviceCategory.findMany({});
  const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));

  // 3. Seed Merchants
  const merchantsData = [
    {
      name: 'Apollo Dental Care',
      slug: 'apollo-dental-care',
      email: 'info@apollodental.com',
      phone: '+91 98765 43210',
      city: 'Chennai',
      address: '42 Anna Nagar Main Road',
      description: 'Apollo Dental Care is a state-of-the-art dental clinic providing top-tier oral care services.',
      latitude: 13.085,
      longitude: 80.275,
      rating: 4.8,
      reviewCount: 234,
      bookingTypeSlug: 'lifestyle-local',
      state: 'Tamil Nadu',
      postalCode: '600040',
    },
    {
      name: 'ZenFit',
      slug: 'zenfit',
      email: 'zenfit@fitness.com',
      phone: '+91 98765 54321',
      city: 'Chennai',
      address: '15 T Nagar High Road',
      description: 'ZenFit is a wellness and fitness club offering personal training and group yoga sessions.',
      latitude: 13.078,
      longitude: 80.268,
      rating: 4.9,
      reviewCount: 189,
      bookingTypeSlug: 'lifestyle-local',
      state: 'Tamil Nadu',
      postalCode: '600017',
    },
    {
      name: 'Style Studio',
      slug: 'style-studio',
      email: 'style@studio.com',
      phone: '+91 98765 12345',
      city: 'Chennai',
      address: '15 T Nagar High Road',
      description: 'Style Studio is a premium beauty salon for haircuts, styling, and bridal makeups.',
      latitude: 13.0827,
      longitude: 80.2707,
      rating: 4.8,
      reviewCount: 234,
      bookingTypeSlug: 'lifestyle-local',
      state: 'Tamil Nadu',
      postalCode: '600017',
    },
    {
      name: 'The Grand temple Dine',
      slug: 'the-grand-temple-dine',
      email: 'dine@grandtemple.com',
      phone: '+91 98450 12345',
      city: 'Madurai',
      address: 'Madurai High Road',
      description: 'The Grand Temple Dine is an elegant family fine-dining restaurant.',
      latitude: 9.925,
      longitude: 78.118,
      rating: 4.7,
      reviewCount: 156,
      bookingTypeSlug: 'lifestyle-local',
      state: 'Tamil Nadu',
      postalCode: '625001',
    },
    {
      name: 'Valley Serenity Spa',
      slug: 'valley-serenity-spa',
      email: 'spa@valleyserenity.com',
      phone: '+91 98765 22334',
      city: 'Theni',
      address: 'Valley Road, Theni',
      description: 'Valley Serenity Spa offers relaxing wellness massages and organic skin therapies.',
      latitude: 10.012,
      longitude: 77.478,
      rating: 4.9,
      reviewCount: 312,
      bookingTypeSlug: 'lifestyle-local',
      state: 'Tamil Nadu',
      postalCode: '625531',
    },
  ];

  const merchantInstances: Record<string, any> = {};
  for (const m of merchantsData) {
    const { bookingTypeSlug, ...mData } = m;
    const btId = bookingTypeInstances[bookingTypeSlug]?.id || null;
    const merchant = await prisma.merchant.create({
      data: {
        ...mData,
        bookingTypeId: btId,
        ownerId: defaultOwner.id,
      },
    });
    merchantInstances[merchant.slug] = merchant;
    console.log(`✅ Created Merchant: ${merchant.name} (${merchant.city})`);
  }

  // 4. Seed Services
  const servicesData = [
    {
      name: 'Premium Haircut',
      merchantSlug: 'style-studio',
      categorySlug: 'salons',
      price: 599,
      duration: 45,
      image: 'https://picsum.photos/seed/10/400/250',
      description: 'Expert haircut, wash, and blow dry by senior stylists.',
      serviceType: 'APPOINTMENT' as const,
    },
    {
      name: 'Yoga Class',
      merchantSlug: 'zenfit',
      categorySlug: 'gym-yoga',
      price: 499,
      duration: 60,
      image: 'https://picsum.photos/seed/11/400/250',
      description: 'Group Hatha Yoga session focusing on strength, breath, and flexibility.',
      serviceType: 'CLASS' as const,
    },
    {
      name: 'Table Reservation',
      merchantSlug: 'the-grand-temple-dine',
      categorySlug: 'dining',
      price: 1200,
      duration: 120,
      image: 'https://picsum.photos/seed/12/400/250',
      description: 'Pre-book table dining experience for up to 4 guests.',
      serviceType: 'RESERVATION' as const,
    },
    {
      name: 'Spa Treatment',
      merchantSlug: 'valley-serenity-spa',
      categorySlug: 'salons',
      price: 1800,
      duration: 90,
      image: 'https://picsum.photos/seed/14/400/250',
      description: 'Signature therapeutic body massage and steam session.',
      serviceType: 'APPOINTMENT' as const,
    },
  ];

  for (const s of servicesData) {
    const mId = merchantInstances[s.merchantSlug]?.id;
    const catId = categoryMap.get(s.categorySlug);
    if (!mId || !catId) {
      console.warn(`⚠️ Skipped seeding service ${s.name}: Merchant/Category not found.`);
      continue;
    }
    const service = await prisma.service.create({
      data: {
        name: s.name,
        slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        description: s.description,
        shortDescription: s.description.substring(0, 200),
        durationMinutes: s.duration,
        basePrice: s.price,
        merchantId: mId,
        categoryId: catId,
        serviceType: s.serviceType,
        images: [s.image],
        rating: 4.8,
        reviewCount: 15,
      },
    });
    console.log(`   ↳ Seeded Service: ${service.name} under ${s.merchantSlug}`);
  }

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
