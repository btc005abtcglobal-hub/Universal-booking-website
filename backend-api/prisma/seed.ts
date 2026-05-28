// ============================================================
// Seed: BETA Universal Service Marketplace
// Populates BookingTypes, ServiceCategories
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bookingTypes = [
  {
    name: 'Appointments',
    slug: 'appointments',
    description: 'Book appointments with doctors, specialists, and professionals',
    iconName: 'calendar-check',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    sortOrder: 1,
    isFeatured: true,
    categories: [
      { name: 'Dental Clinics', slug: 'dental', iconName: 'smile', color: '#818cf8' },
      { name: 'Hospitals', slug: 'hospitals', iconName: 'hospital', color: '#f43f5e' },
      { name: 'Eye Clinics', slug: 'eye-clinics', iconName: 'eye', color: '#06b6d4' },
      { name: 'Fitness Trainers', slug: 'fitness', iconName: 'dumbbell', color: '#f97316' },
      { name: 'Veterinary', slug: 'veterinary', iconName: 'paw-print', color: '#84cc16' },
      { name: 'Physiotherapy', slug: 'physiotherapy', iconName: 'activity', color: '#14b8a6' },
      { name: 'Mental Health', slug: 'mental-health', iconName: 'brain', color: '#a78bfa' },
      { name: 'Dermatology', slug: 'dermatology', iconName: 'scan-face', color: '#fb923c' },
    ],
  },
  {
    name: 'Beauty & Wellness',
    slug: 'beauty',
    description: 'Salons, spas, and wellness centers near you',
    iconName: 'sparkles',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f97316)',
    sortOrder: 2,
    isFeatured: true,
    categories: [
      { name: 'Hair Salons', slug: 'hair-salons', iconName: 'scissors', color: '#f472b6' },
      { name: 'Nail Art', slug: 'nail-art', iconName: 'brush', color: '#a855f7' },
      { name: 'Spas', slug: 'spas', iconName: 'leaf', color: '#34d399' },
      { name: 'Bridal', slug: 'bridal', iconName: 'heart', color: '#f43f5e' },
      { name: 'Makeup Artists', slug: 'makeup', iconName: 'wand-2', color: '#fb923c' },
      { name: 'Tattoo Studios', slug: 'tattoo', iconName: 'pen', color: '#64748b' },
    ],
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car wash, service centers, and vehicle maintenance',
    iconName: 'car',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    sortOrder: 3,
    isFeatured: true,
    categories: [
      { name: 'Car Wash', slug: 'car-wash', iconName: 'droplets', color: '#38bdf8' },
      { name: 'Bike Wash', slug: 'bike-wash', iconName: 'bike', color: '#818cf8' },
      { name: 'Service Centers', slug: 'service-centers', iconName: 'wrench', color: '#f97316' },
      { name: 'Tyres & Wheels', slug: 'tyres', iconName: 'circle', color: '#64748b' },
      { name: 'Detailing', slug: 'detailing', iconName: 'sparkles', color: '#34d399' },
      { name: 'EV Charging', slug: 'ev-charging', iconName: 'zap', color: '#facc15' },
    ],
  },
  {
    name: 'Home Services',
    slug: 'home-services',
    description: 'Plumbing, electrical, cleaning and more at your doorstep',
    iconName: 'home',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #3b82f6)',
    sortOrder: 4,
    isFeatured: true,
    categories: [
      { name: 'Cleaning', slug: 'cleaning', iconName: 'sparkles', color: '#34d399' },
      { name: 'Plumbing', slug: 'plumbing', iconName: 'wrench', color: '#38bdf8' },
      { name: 'Electrical', slug: 'electrical', iconName: 'zap', color: '#facc15' },
      { name: 'Pest Control', slug: 'pest-control', iconName: 'bug', color: '#f97316' },
      { name: 'AC Service', slug: 'ac-service', iconName: 'wind', color: '#818cf8' },
      { name: 'Painting', slug: 'painting', iconName: 'brush', color: '#f472b6' },
      { name: 'Carpentry', slug: 'carpentry', iconName: 'hammer', color: '#a16207' },
    ],
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Movies, events, concerts, and experiences',
    iconName: 'film',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    sortOrder: 5,
    isFeatured: true,
    categories: [
      { name: 'Movie Tickets', slug: 'movies', iconName: 'clapperboard', color: '#f59e0b' },
      { name: 'Concerts', slug: 'concerts', iconName: 'music', color: '#a855f7' },
      { name: 'Sports Events', slug: 'sports-events', iconName: 'trophy', color: '#facc15' },
      { name: 'Theme Parks', slug: 'theme-parks', iconName: 'ferris-wheel', color: '#f43f5e' },
      { name: 'Gaming Zones', slug: 'gaming', iconName: 'gamepad-2', color: '#818cf8' },
      { name: 'Comedy Shows', slug: 'comedy', iconName: 'smile', color: '#fb923c' },
    ],
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports',
    description: 'Gyms, sports courts, swimming pools, and fitness classes',
    iconName: 'dumbbell',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
    sortOrder: 6,
    isFeatured: true,
    categories: [
      { name: 'Gyms', slug: 'gyms', iconName: 'dumbbell', color: '#ef4444' },
      { name: 'Yoga Classes', slug: 'yoga', iconName: 'activity', color: '#a78bfa' },
      { name: 'Swimming Pools', slug: 'swimming', iconName: 'waves', color: '#38bdf8' },
      { name: 'Cricket Ground', slug: 'cricket', iconName: 'circle-dot', color: '#84cc16' },
      { name: 'Football Turf', slug: 'football', iconName: 'circle', color: '#22c55e' },
      { name: 'Badminton', slug: 'badminton', iconName: 'wind', color: '#f59e0b' },
    ],
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Tutors, coaching classes, workshops, and courses',
    iconName: 'graduation-cap',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    sortOrder: 7,
    isFeatured: false,
    categories: [
      { name: 'Tutors', slug: 'tutors', iconName: 'book-open', color: '#818cf8' },
      { name: 'Music Classes', slug: 'music', iconName: 'music', color: '#a855f7' },
      { name: 'Dance Classes', slug: 'dance', iconName: 'footprints', color: '#f472b6' },
      { name: 'Art & Craft', slug: 'art', iconName: 'palette', color: '#fb923c' },
      { name: 'Language', slug: 'language', iconName: 'globe', color: '#34d399' },
      { name: 'Coding', slug: 'coding', iconName: 'code', color: '#38bdf8' },
    ],
  },
  {
    name: 'Professional Services',
    slug: 'professional',
    description: 'Lawyers, accountants, consultants, and more',
    iconName: 'briefcase',
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b, #334155)',
    sortOrder: 8,
    isFeatured: false,
    categories: [
      { name: 'Legal Advice', slug: 'legal', iconName: 'scale', color: '#64748b' },
      { name: 'Tax & Accounting', slug: 'accounting', iconName: 'calculator', color: '#34d399' },
      { name: 'Photography', slug: 'photography', iconName: 'camera', color: '#f59e0b' },
      { name: 'Consulting', slug: 'consulting', iconName: 'briefcase', color: '#818cf8' },
      { name: 'Event Planning', slug: 'events', iconName: 'party-popper', color: '#f472b6' },
    ],
  },
  {
    name: 'Rentals',
    slug: 'rentals',
    description: 'Rent vehicles, equipment, spaces and more',
    iconName: 'key',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    sortOrder: 9,
    isFeatured: false,
    categories: [
      { name: 'Bike Rentals', slug: 'bike-rentals', iconName: 'bike', color: '#38bdf8' },
      { name: 'Car Rentals', slug: 'car-rentals', iconName: 'car', color: '#818cf8' },
      { name: 'Hall Booking', slug: 'halls', iconName: 'building', color: '#f59e0b' },
      { name: 'Equipment', slug: 'equipment', iconName: 'settings', color: '#64748b' },
      { name: 'Camping Gear', slug: 'camping', iconName: 'tent', color: '#84cc16' },
    ],
  },
  {
    name: 'Government',
    slug: 'government',
    description: 'Government services, document processing, and more',
    iconName: 'landmark',
    color: '#475569',
    gradient: 'linear-gradient(135deg, #475569, #1e3a5f)',
    sortOrder: 10,
    isFeatured: false,
    categories: [
      { name: 'Passport', slug: 'passport', iconName: 'book', color: '#334155' },
      { name: 'License Services', slug: 'license', iconName: 'id-card', color: '#475569' },
      { name: 'Municipality', slug: 'municipality', iconName: 'building-2', color: '#64748b' },
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
      bookingTypeSlug: 'appointments',
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
      bookingTypeSlug: 'sports',
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
      bookingTypeSlug: 'beauty',
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
      bookingTypeSlug: 'appointments',
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
      bookingTypeSlug: 'beauty',
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
      categorySlug: 'hair-salons',
      price: 599,
      duration: 45,
      image: 'https://picsum.photos/seed/10/400/250',
      description: 'Expert haircut, wash, and blow dry by senior stylists.',
      serviceType: 'APPOINTMENT' as const,
    },
    {
      name: 'Yoga Class',
      merchantSlug: 'zenfit',
      categorySlug: 'yoga',
      price: 499,
      duration: 60,
      image: 'https://picsum.photos/seed/11/400/250',
      description: 'Group Hatha Yoga session focusing on strength, breath, and flexibility.',
      serviceType: 'CLASS' as const,
    },
    {
      name: 'Table Reservation',
      merchantSlug: 'the-grand-temple-dine',
      categorySlug: 'halls',
      price: 1200,
      duration: 120,
      image: 'https://picsum.photos/seed/12/400/250',
      description: 'Pre-book table dining experience for up to 4 guests.',
      serviceType: 'RESERVATION' as const,
    },
    {
      name: 'Spa Treatment',
      merchantSlug: 'valley-serenity-spa',
      categorySlug: 'spas',
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
