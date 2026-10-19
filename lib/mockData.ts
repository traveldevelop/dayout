import { Property, Booking, Review, ExternalSync, User, NotificationItem } from '@/types/dayout';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-guest-1',
    name: 'Dilshan Silva',
    email: 'dilshan@example.lk',
    phone: '+94 77 123 4567',
    role: 'GUEST',
    avatar: 'https://picsum.photos/seed/dilshan/150/150',
    wishlist: ['prop-1', 'prop-3'],
    createdAt: '2026-01-15',
    hostStatus: 'NOT_APPLIED',
  },
  {
    id: 'user-host-1',
    name: 'Kavinda Perera (Villa Host)',
    email: 'kavinda@ceylondayouts.lk',
    phone: '+94 71 987 6543',
    role: 'HOST',
    avatar: 'https://picsum.photos/seed/kavinda/150/150',
    wishlist: ['prop-2'],
    createdAt: '2025-11-20',
    hostStatus: 'APPROVED',
  },
  {
    id: 'user-admin-1',
    name: 'Ceylon DayOuts Admin',
    email: 'admin@ceylondayouts.lk',
    phone: '+94 11 234 5678',
    role: 'ADMIN',
    avatar: 'https://picsum.photos/seed/adminlk/150/150',
    wishlist: [],
    createdAt: '2025-01-01',
    hostStatus: 'APPROVED',
  },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-white-lotus',
    ownerId: 'user-host-1',
    ownerName: 'White Lotus Holiday Resort Management',
    title: '“White Lotus” Holiday Resort Anuradhapura',
    tagline: '10දෙනාටම 11,000 යි! අනුරාධපුර පූජා නගරයට විනාඩි 5න් ළඟා විය හැකි සුපිරි බජට් Resort එකක්',
    description: 'අනුරාධපුර වන්දනාවේ යන්නද හිතන් ඉන්නේ? එහෙනම් මෙන්න කිරි ආහාර එහෙම හදාගෙන, ඔයාලට ගෙදර වගේ නිදහසේ නවාතැන් ගන්න පුලුවන්, පූජා නගරයට විනාඩි 5කින් ළගා වෙන්න පුලුවන් තැනක්. මෙතන Upper floor සහ Ground Floor වල වෙන වෙනම Rooms තියෙනවා. උපරිම 21 දෙනෙක්ට ඉන්න පුලුවන්, ඔයාලගේ එන පිරිස අනුව කැමති විදිහට Arrange කරගන්නත් පුලුවන්.',
    category: 'HOTEL',
    stayTypes: ['BOTH'],
    address: 'Near Sacred City Access, Anuradhapura',
    city: 'Anuradhapura',
    district: 'Anuradhapura',
    lat: 8.3114,
    lng: 80.4037,
    rating: 4.95,
    reviewCount: 94,
    featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&auto=format&fit=crop&q=80',
    ],
    amenities: [
      'Kitchen (Cook Your Own Meals)',
      'Free Arrangements for Kiri Ahara',
      'Hot Water',
      'Attached Bathrooms',
      'Meals Delivered from Vedda Sappayama (Free)',
      'Relaxing Garden Space',
      'Balcony View of Garden',
      'PEO TV',
      'Secure Parking Space',
      '5 Mins to Sacred City (පූජා නගරය)'
    ],
    featured: true,
    status: 'APPROVED',
    pricePerNightLKR: 4000,
    pricePerDayoutLKR: 1100,
    contactPhone: '0252226094',
    contactPhone2: '0718805858',
    contactWhatsApp: '+94718805858',
    extraGuestFeeLKR: 500,
    specialPromoBanner: '𝟭𝟬දෙනාටම 𝟭𝟭,𝟬𝟬𝟬 යි😮😱 අනුරාධපුරෙන් බජට් Resort එකක්! පූජා නගරයට විනාඩි 5යි 💕',
    dayoutPackage: {
      title: 'White Lotus 10-Pax Pilgrim & Dayout Budget Package',
      timeSlot: '07:30 AM - 06:30 PM',
      pricePerPersonLKR: 1100,
      minGuests: 10,
      inclusions: [
        '10 දෙනාටම රු. 11,000 යි (Just Rs. 1,100 per person)',
        'Free Arrangements for Kiri Ahara (කිරි ආහාර සැකසීමේ පහසුකම් නොමිලේ)',
        'Attached Bathrooms & Hot Water Facilities',
        'Relaxing lush garden space for pilgrims & groups',
        'Balcony view & changing rooms',
        'Meals delivered from Vedda Sappayama Restaurant (Free Delivery)',
        'Spacious parking space for vans / buses / cars',
        '5 Mins distance to Anuradhapura Pooja Nagaraya'
      ]
    },
    bookingComSyncEnabled: false,
    floorSections: [
      {
        floorName: '🔴 Upper Floor: Newer Group Rooms',
        subtitle: 'Spacious rooms ideal for groups, with options to cook your own meals!',
        badge: 'Newer Group Rooms + Kitchen',
        facilities: [
          'Kitchen & Cooking Facilities',
          'Hot Water',
          'Attached Bathrooms',
          'Meals Delivered from Vedda Sappayama Restaurant (Free Delivery)',
          'Relaxing Garden Space',
          'Balcony View of the Garden',
          'Parking Space'
        ],
        packages: [
          {
            groupTitle: 'For 3 Guests',
            guestCount: 3,
            options: [
              { name: 'AC + Kitchen', priceLKR: 6500 },
              { name: 'Non-AC + Kitchen', priceLKR: 5500 },
              { name: 'AC (No Kitchen)', priceLKR: 5000 },
              { name: 'Non-AC (No Kitchen)', priceLKR: 4000 }
            ]
          },
          {
            groupTitle: 'For 4 Guests',
            guestCount: 4,
            options: [
              { name: 'AC + Kitchen', priceLKR: 7500 },
              { name: 'Non-AC + Kitchen', priceLKR: 6500 },
              { name: 'AC (No Kitchen)', priceLKR: 6000 },
              { name: 'Non-AC (No Kitchen)', priceLKR: 5000 }
            ]
          },
          {
            groupTitle: 'For 6 Guests',
            guestCount: 6,
            options: [
              { name: 'AC + Kitchen', priceLKR: 8500 },
              { name: 'Non-AC + Kitchen', priceLKR: 7500 },
              { name: 'AC (No Kitchen)', priceLKR: 7000 },
              { name: 'Non-AC (No Kitchen)', priceLKR: 6000 }
            ]
          },
          {
            groupTitle: 'For 10 Guests (Special Pilgrim Rate)',
            guestCount: 10,
            options: [
              { name: 'AC + Kitchen', priceLKR: 16000 },
              { name: 'Non-AC + Kitchen', priceLKR: 14000 },
              { name: 'AC (No Kitchen)', priceLKR: 13000 },
              { name: 'Non-AC (No Kitchen)', priceLKR: 11000 }
            ]
          },
          {
            groupTitle: 'Book The Entire Property (For 21 Guests)',
            guestCount: 21,
            options: [
              { name: 'AC + Kitchen (Full Villa 21 Guests)', priceLKR: 30000 },
              { name: 'Non-AC + Kitchen (Full Villa 21 Guests)', priceLKR: 25000 }
            ]
          }
        ]
      },
      {
        floorName: '🔴 Ground Floor: Standard Rooms',
        subtitle: 'Perfect for 4 guests. No kitchen facilities provided',
        badge: 'Ground Floor Standard',
        facilities: [
          'Hot Water',
          'PEO TV',
          'Attached Bathrooms',
          'Meals Delivered from Vedda Sappayama Restaurant (Free Delivery)',
          'Free Arrangements for Kiri Ahara',
          'Relaxing Garden Space',
          'Parking Space'
        ],
        packages: [
          {
            groupTitle: 'For 4 Guests Standard',
            guestCount: 4,
            options: [
              { name: 'AC Room', priceLKR: 5000 },
              { name: 'Non-AC Room', priceLKR: 4000 }
            ]
          }
        ]
      }
    ],
    rooms: [
      {
        id: 'room-wl-1',
        propertyId: 'prop-white-lotus',
        name: 'Upper Floor: 10-Guest Budget Pilgrim Hall',
        pricePerNightLKR: 11000,
        pricePerDayoutLKR: 11000,
        maxGuests: 10,
        totalUnits: 2,
        description: 'Spacious group room for up to 10 guests. Non-AC, attached bath, hot water, garden view balcony.'
      },
      {
        id: 'room-wl-2',
        propertyId: 'prop-white-lotus',
        name: 'Upper Floor: 6-Guest Group Room with Kitchen',
        pricePerNightLKR: 7500,
        pricePerDayoutLKR: 6000,
        maxGuests: 6,
        totalUnits: 2,
        description: 'Ideal family/group room with kitchen access to cook meals and Kiri Ahara.'
      },
      {
        id: 'room-wl-3',
        propertyId: 'prop-white-lotus',
        name: 'Upper Floor: 4-Guest AC Group Room',
        pricePerNightLKR: 6000,
        pricePerDayoutLKR: 5000,
        maxGuests: 4,
        totalUnits: 3,
        description: 'Comfortable air-conditioned group room with attached bathroom and hot water.'
      },
      {
        id: 'room-wl-4',
        propertyId: 'prop-white-lotus',
        name: 'Ground Floor: Standard 4-Guest AC Room',
        pricePerNightLKR: 5000,
        pricePerDayoutLKR: 4000,
        maxGuests: 4,
        totalUnits: 3,
        description: 'Ground floor room with AC, PEO TV, hot water, garden access and free Kiri Ahara arrangements.'
      },
      {
        id: 'room-wl-5',
        propertyId: 'prop-white-lotus',
        name: 'Ground Floor: Standard 4-Guest Non-AC Room',
        pricePerNightLKR: 4000,
        pricePerDayoutLKR: 3500,
        maxGuests: 4,
        totalUnits: 3,
        description: 'Budget-friendly room for 4 guests with attached bathroom and PEO TV.'
      },
      {
        id: 'room-wl-entire',
        propertyId: 'prop-white-lotus',
        name: 'Entire White Lotus Resort (Up to 21 Guests)',
        pricePerNightLKR: 25000,
        pricePerDayoutLKR: 20000,
        maxGuests: 21,
        totalUnits: 1,
        description: 'Exclusive booking of entire property for your full group (21 guests) with full kitchen access.'
      }
    ]
  },
  {
    id: 'prop-1',
    ownerId: 'user-host-1',
    ownerName: 'Kavinda Perera',
    title: 'The Palms Beach Resort & Dayout Oasis',
    tagline: 'Luxury seafront dayout package with infinity pool & buffet in Bentota',
    description: 'Experience an unforgettable dayout or beachfront stay at Bentota Beach. Our oceanfront resort features an Olympic-sized infinity pool, tropical garden lounges, water sports center, and world-class seafood buffet.',
    category: 'HOTEL',
    stayTypes: ['BOTH'],
    address: 'No. 45 Beach Road, Bentota',
    city: 'Bentota',
    district: 'Galle',
    lat: 6.4251,
    lng: 79.9984,
    rating: 4.9,
    reviewCount: 128,
    featuredImage: 'https://picsum.photos/seed/bentotapalms/1200/800',
    images: [
      'https://picsum.photos/seed/bentotapalms/1200/800',
      'https://picsum.photos/seed/bentotapool/1200/800',
      'https://picsum.photos/seed/bentotabuffet/1200/800',
      'https://picsum.photos/seed/bentotaspas/1200/800',
    ],
    amenities: ['Swimming Pool', 'Buffet Lunch', 'Wi-Fi', 'Air Conditioning', 'Free Parking', 'Beach Access', 'Spa', 'Changing Room', 'Bar'],
    featured: true,
    status: 'APPROVED',
    pricePerNightLKR: 38000,
    pricePerDayoutLKR: 8500,
    contactPhone: '0771234567',
    contactWhatsApp: '+94771234567',
    dayoutPackage: {
      title: 'Bentota Royal Dayout Package',
      timeSlot: '09:00 AM - 05:00 PM',
      pricePerPersonLKR: 8500,
      minGuests: 2,
      inclusions: [
        'Welcome Fresh King Coconut / Tropical Juice',
        'Full International & Sri Lankan Buffet Lunch',
        'Unlimited Infinity Pool & Private Beach Access',
        'Air-conditioned Changing Room with Lockers',
        'Evening Ceylon Tea / Coffee & Cake Spread',
        '10% Discount on Jet Ski & Water Sports'
      ]
    },
    bookingComSyncEnabled: true,
    bookingComRef: 'BC-BNT-8892',
    lastSyncedAt: '2026-08-01 07:15 AM',
    blockedDates: ['2026-08-10', '2026-08-11', '2026-08-20'],
    weekendSurgePercent: 20,
    seasonalDiscountPercent: 10,
    rooms: [
      {
        id: 'room-1-1',
        propertyId: 'prop-1',
        name: 'Deluxe Ocean View Room',
        pricePerNightLKR: 38000,
        pricePerDayoutLKR: 12000,
        maxGuests: 3,
        totalUnits: 5,
        bookingComUnitId: 'BC-ROOM-101',
        description: 'King bed room overlooking the Indian Ocean with private balcony.'
      },
      {
        id: 'room-1-2',
        propertyId: 'prop-1',
        name: 'Poolside Day Cabana Suite',
        pricePerNightLKR: 45000,
        pricePerDayoutLKR: 15000,
        maxGuests: 4,
        totalUnits: 3,
        bookingComUnitId: 'BC-ROOM-102',
        description: 'Direct step-out access to infinity pool with private sunbeds.'
      }
    ]
  },
  {
    id: 'prop-2',
    ownerId: 'user-host-1',
    ownerName: 'Kavinda Perera',
    title: 'Kandy Cloud Crest Private Villa & Sky Pool',
    tagline: 'Panoramic mist-covered mountain views with private heated pool in Kandy',
    description: 'Perched high in the Hanthana mountain range, Cloud Crest Villa offers absolute privacy, butler service, and an infinity pool floating above the Kandy clouds.',
    category: 'VILLA',
    stayTypes: ['BOTH'],
    address: 'Hanthana Estate, Kandy',
    city: 'Kandy',
    district: 'Kandy',
    lat: 7.2906,
    lng: 80.6337,
    rating: 4.95,
    reviewCount: 94,
    featuredImage: 'https://picsum.photos/seed/kandyvilla/1200/800',
    images: [
      'https://picsum.photos/seed/kandyvilla/1200/800',
      'https://picsum.photos/seed/kandypool/1200/800',
      'https://picsum.photos/seed/kandyview/1200/800',
      'https://picsum.photos/seed/kandybbq/1200/800',
    ],
    amenities: ['Private Pool', 'Chef on Demand', 'Wi-Fi', 'Mountain View', 'BBQ Facilities', 'Free Parking', 'Kitchen', 'Hot Water'],
    featured: true,
    status: 'APPROVED',
    pricePerNightLKR: 65000,
    pricePerDayoutLKR: 14000,
    contactPhone: '0719876543',
    contactWhatsApp: '+94719876543',
    dayoutPackage: {
      title: 'Kandy Mountain Day Escape',
      timeSlot: '09:30 AM - 05:30 PM',
      pricePerPersonLKR: 14000,
      minGuests: 4,
      inclusions: [
        'Welcome Spiced Passionfruit Cooler',
        'Private Villa Access & Heated Sky Pool',
        'Gourmet 3-Course Sri Lankan Rice & Curry or Grill Lunch',
        'Evening High Tea with Fresh Kandy Scones',
        'Bose Sound System & Lawn Games'
      ]
    },
    bookingComSyncEnabled: true,
    bookingComRef: 'BC-KDY-4401',
    lastSyncedAt: '2026-08-01 06:40 AM',
    blockedDates: ['2026-08-15', '2026-08-16'],
    rooms: [
      {
        id: 'room-2-1',
        propertyId: 'prop-2',
        name: 'Entire 4-Bedroom Luxury Villa',
        pricePerNightLKR: 65000,
        pricePerDayoutLKR: 35000,
        maxGuests: 10,
        totalUnits: 1,
        bookingComUnitId: 'BC-VILLA-01',
        description: 'Complete exclusivity of the 4-bedroom villa with private pool.'
      }
    ]
  },
  {
    id: 'prop-3',
    ownerId: 'host-2',
    ownerName: 'Niroshan Wickramasinghe',
    title: 'Ella Cliffside Eco Cabana Retreat & Waterfall View',
    tagline: 'Multi-cabana eco sanctuary facing Nine Arches Bridge and Ella Gap',
    description: 'Nestled amidst lush tea bushes and rainforest flora, Ella Cliffside Retreat features 4 distinct handcrafted bamboo & wooden cabana units managed under one business name. Ideal for couple dayouts, group staycations, or multi-day retreats.',
    category: 'CABANA',
    stayTypes: ['BOTH'],
    address: 'Nine Arch Bridge Trail, Ella',
    city: 'Ella',
    district: 'Badulla',
    lat: 6.8667,
    lng: 81.0466,
    rating: 4.88,
    reviewCount: 76,
    featuredImage: 'https://picsum.photos/seed/ellacabana/1200/800',
    images: [
      'https://picsum.photos/seed/ellacabana/1200/800',
      'https://picsum.photos/seed/ellaview/1200/800',
      'https://picsum.photos/seed/ellatea/1200/800',
    ],
    amenities: ['Waterfall View', 'Wi-Fi', 'Breakfast Included', 'Balcony Net', 'Tea Garden Walk', 'Hot Water', 'Private Jacuzzi', 'Yoga Deck'],
    featured: true,
    status: 'APPROVED',
    pricePerNightLKR: 22000,
    pricePerDayoutLKR: 6000,
    contactPhone: '0772345678',
    contactWhatsApp: '+94772345678',
    dayoutPackage: {
      title: 'Ella Tea & Waterfall Whole-Day Out',
      timeSlot: '08:30 AM - 04:30 PM',
      pricePerPersonLKR: 6000,
      minGuests: 2,
      inclusions: [
        'Welcome Herbal Tea & Jaggery',
        'Traditional Organic Rice & Curry Lunch',
        'Guided Hike to Secret Waterfall & Viewpoint',
        'Cabana Relaxation Net with Overhanging Gorge',
        'Evening Fresh Ceylon High Tea'
      ]
    },
    bookingComSyncEnabled: true,
    bookingComRef: 'BC-ELLA-8820',
    lastSyncedAt: '2026-08-01 06:15 AM',
    rooms: [
      {
        id: 'cabana-unit-1',
        propertyId: 'prop-3',
        name: 'Cabana 01 - Panorama Cliff Bamboo Pod',
        pricePerNightLKR: 22000,
        pricePerDayoutLKR: 6000,
        maxGuests: 2,
        totalUnits: 1,
        bookingComUnitId: 'BC-CABANA-101',
        description: 'Single couple bamboo cabana suspended over Ella gap with private hammock net.'
      },
      {
        id: 'cabana-unit-2',
        propertyId: 'prop-3',
        name: 'Cabana 02 - Sunset Canopy Treehouse Pod',
        pricePerNightLKR: 28000,
        pricePerDayoutLKR: 8500,
        maxGuests: 3,
        totalUnits: 1,
        bookingComUnitId: 'BC-CABANA-102',
        description: 'Elevated wooden treehouse pod with panoramic sunset deck & outdoor soaking tub.'
      },
      {
        id: 'cabana-unit-3',
        propertyId: 'prop-3',
        name: 'Cabana 03 - Deluxe Waterfall Glass Dome',
        pricePerNightLKR: 34000,
        pricePerDayoutLKR: 11000,
        maxGuests: 2,
        totalUnits: 1,
        bookingComUnitId: 'BC-CABANA-103',
        description: 'Glass-walled luxury honeymon cabana with direct waterfall plunge view.'
      },
      {
        id: 'cabana-unit-4',
        propertyId: 'prop-3',
        name: 'Cabana 04 - Family Riverfront Duplex Suite',
        pricePerNightLKR: 45000,
        pricePerDayoutLKR: 15000,
        maxGuests: 6,
        totalUnits: 1,
        bookingComUnitId: 'BC-CABANA-104',
        description: 'Spacious 2-story wooden cabana unit for large family dayouts or group stays.'
      }
    ]
  },
  {
    id: 'prop-4',
    ownerId: 'host-3',
    ownerName: 'Chathura Fernando',
    title: 'Colonial Tea Estate Heritage Cottage',
    tagline: '1920s British colonial bungalow surrounded by Nuwara Eliya tea estates',
    description: 'Step into vintage elegance at Little England. Cosy fireplaces, manicured rose gardens, traditional high tea service, and cool mountain breezes in Nuwara Eliya.',
    category: 'COTTAGE',
    stayTypes: ['BOTH'],
    address: 'Pedro Estate Road, Nuwara Eliya',
    city: 'Nuwara Eliya',
    district: 'Nuwara Eliya',
    lat: 6.9497,
    lng: 80.7891,
    rating: 4.85,
    reviewCount: 52,
    featuredImage: 'https://picsum.photos/seed/nuwaracottage/1200/800',
    images: [
      'https://picsum.photos/seed/nuwaracottage/1200/800',
      'https://picsum.photos/seed/nuwarafireplace/1200/800',
      'https://picsum.photos/seed/nuwaragarden/1200/800',
    ],
    amenities: ['Fireplace', 'High Tea', 'Wi-Fi', 'Garden', 'Free Parking', 'Heater', 'Butler Service'],
    featured: false,
    status: 'APPROVED',
    pricePerNightLKR: 42000,
    pricePerDayoutLKR: 9500,
    contactPhone: '0763456789',
    contactWhatsApp: '+94763456789',
    dayoutPackage: {
      title: 'Little England High Tea & Garden Day',
      timeSlot: '10:00 AM - 05:00 PM',
      pricePerPersonLKR: 9500,
      minGuests: 2,
      inclusions: [
        'Welcome Hot Ceylon Mulled Tea',
        'Colonial English High Tea & Pastry Tower',
        'Bungalow Garden Picnic Setup',
        'Fireplace Lounge Access'
      ]
    },
    bookingComSyncEnabled: true,
    bookingComRef: 'BC-NWE-1092',
    lastSyncedAt: '2026-08-01 05:30 AM',
    rooms: [
      {
        id: 'room-4-1',
        propertyId: 'prop-4',
        name: 'Master Colonial Suite',
        pricePerNightLKR: 42000,
        pricePerDayoutLKR: 18000,
        maxGuests: 4,
        totalUnits: 1,
        description: 'Spacious suite with stone fireplace and garden porch.'
      }
    ]
  },
  {
    id: 'prop-5',
    ownerId: 'host-4',
    ownerName: 'Rashmi Senanayake',
    title: 'Colombo Cinnamon Garden Boutique Suite',
    tagline: 'Modern executive dayuse & overnight stay room in prime Colombo 07',
    description: 'Located in prestigious Cinnamon Gardens, close to Viharamahadevi Park and Odel. Ideal for business travelers, transit day-use, and luxury city staycations.',
    category: 'ROOM',
    stayTypes: ['BOTH'],
    address: 'Guilford Crescent, Colombo 07',
    city: 'Colombo',
    district: 'Colombo',
    lat: 6.9147,
    lng: 79.8653,
    rating: 4.78,
    reviewCount: 88,
    featuredImage: 'https://picsum.photos/seed/colomboroom/1200/800',
    images: [
      'https://picsum.photos/seed/colomboroom/1200/800',
      'https://picsum.photos/seed/colombobath/1200/800',
      'https://picsum.photos/seed/colombocafe/1200/800',
    ],
    amenities: ['Air Conditioning', 'High Speed Wi-Fi', 'Smart TV', 'Work Desk', 'Mini Bar', 'Coffee Machine', 'Gym Access'],
    featured: false,
    status: 'APPROVED',
    pricePerNightLKR: 28000,
    pricePerDayoutLKR: 7000,
    contactPhone: '0754567890',
    contactWhatsApp: '+94754567890',
    dayoutPackage: {
      title: 'Colombo Transit & Executive Day Pass',
      timeSlot: '08:00 AM - 06:00 PM',
      pricePerPersonLKR: 7000,
      minGuests: 1,
      inclusions: [
        'Air-conditioned Executive Room Access',
        'Complimentary Espresso & Snacks',
        'High Speed 5G Fiber Wi-Fi',
        'Access to Rooftop Plunge Pool & Gym'
      ]
    },
    bookingComSyncEnabled: true,
    bookingComRef: 'BC-CMB-7721',
    lastSyncedAt: '2026-08-01 07:00 AM',
    rooms: [
      {
        id: 'room-5-1',
        propertyId: 'prop-5',
        name: 'Executive Studio Room',
        pricePerNightLKR: 28000,
        pricePerDayoutLKR: 7000,
        maxGuests: 2,
        totalUnits: 4,
        description: 'Contemporary room with king size bed and rain shower.'
      }
    ]
  },
  {
    id: 'prop-6',
    ownerId: 'host-5',
    ownerName: 'Thilak Samarasinghe',
    title: 'Sigiriya Rockview Glamping & Treehouse Sanctuary',
    tagline: 'Luxury air-conditioned treehouse & glamping dome facing Sigiriya Rock Fortress',
    description: 'Immerse yourself in wild nature with 5-star comforts. Elevated treehouses overlooking Sigiriya Lion Rock, complete with outdoor wooden hot tubs and night fire pit.',
    category: 'UNIQUE',
    stayTypes: ['BOTH'],
    address: 'Kimbissa Road, Sigiriya',
    city: 'Sigiriya',
    district: 'Matale',
    lat: 7.957,
    lng: 80.7603,
    rating: 4.98,
    reviewCount: 110,
    featuredImage: 'https://picsum.photos/seed/sigiriyatreehouse/1200/800',
    images: [
      'https://picsum.photos/seed/sigiriyatreehouse/1200/800',
      'https://picsum.photos/seed/sigiriyaglamping/1200/800',
      'https://picsum.photos/seed/sigiriyanight/1200/800',
    ],
    amenities: ['Rock View', 'Wooden Hot Tub', 'Air Conditioning', 'Safari Tour', 'Wi-Fi', 'Bonfire', 'Organic Dining'],
    featured: true,
    status: 'APPROVED',
    pricePerNightLKR: 48000,
    pricePerDayoutLKR: 11000,
    contactPhone: '0725678901',
    contactWhatsApp: '+94725678901',
    dayoutPackage: {
      title: 'Sigiriya Wild Treehouse Day Sanctuary',
      timeSlot: '09:00 AM - 05:00 PM',
      pricePerPersonLKR: 11000,
      minGuests: 2,
      inclusions: [
        'Welcome Fresh Woodapple Juice',
        'Treehouse Lounge Access with Direct Sigiriya Rock View',
        'Traditional Village Buffet Lunch cooked in Clay Pots',
        'Open Air Hot Tub Session',
        'Sunset Cocktails on Tree Deck'
      ]
    },
    bookingComSyncEnabled: true,
    bookingComRef: 'BC-SGY-9912',
    lastSyncedAt: '2026-08-01 06:10 AM',
    rooms: [
      {
        id: 'room-6-1',
        propertyId: 'prop-6',
        name: 'Royal Lion Rock Treehouse',
        pricePerNightLKR: 48000,
        pricePerDayoutLKR: 18000,
        maxGuests: 3,
        totalUnits: 2,
        description: 'Elevated wooden canopy treehouse with private deck.'
      },
      {
        id: 'room-6-2',
        propertyId: 'prop-6',
        name: 'Starlight Dome Glamping Tent',
        pricePerNightLKR: 38000,
        pricePerDayoutLKR: 14000,
        maxGuests: 2,
        totalUnits: 3,
        description: 'Geodesic dome with sky window for stargazing.'
      }
    ]
  },
  {
    id: 'prop-7',
    ownerId: 'user-host-1',
    ownerName: 'Kavinda Perera',
    title: 'Mirissa Wavefront Beach Villa & Surf Deck',
    tagline: 'Private infinity pool villa right on Coconut Tree Hill beach Mirissa',
    description: 'Listen to the waves crash from your private lawn. Featuring direct access to famous surf breaks, sunset cocktail deck, and private chef preparing fresh tuna and lobster.',
    category: 'VILLA',
    stayTypes: ['BOTH'],
    address: 'Coconut Tree Hill Road, Mirissa',
    city: 'Mirissa',
    district: 'Matara',
    lat: 5.9483,
    lng: 80.4716,
    rating: 4.92,
    reviewCount: 81,
    featuredImage: 'https://picsum.photos/seed/mirissavilla/1200/800',
    images: [
      'https://picsum.photos/seed/mirissavilla/1200/800',
      'https://picsum.photos/seed/mirissasurf/1200/800',
      'https://picsum.photos/seed/mirissaparty/1200/800',
    ],
    amenities: ['Beachfront', 'Private Pool', 'Surfboards Included', 'Seafood Grill', 'Wi-Fi', 'Air Conditioning'],
    featured: true,
    status: 'APPROVED',
    pricePerNightLKR: 58000,
    pricePerDayoutLKR: 13500,
    dayoutPackage: {
      title: 'Mirissa Beachfront Dayout & Surf Pass',
      timeSlot: '09:00 AM - 06:00 PM',
      pricePerPersonLKR: 13500,
      minGuests: 2,
      inclusions: [
        'Welcome Coconut Water & Fresh Fruit Platter',
        'Beachfront Infinity Pool & Sunbed Access',
        'Seafood Platter Lunch (Jumbo Prawns, Calamari, Fish)',
        'Complimentary Surfboard & SUP Board Rentals',
        'Sunset Mocktail / Beer at Deck'
      ]
    },
    bookingComSyncEnabled: false,
    rooms: [
      {
        id: 'room-7-1',
        propertyId: 'prop-7',
        name: 'Entire 3-Bedroom Ocean Villa',
        pricePerNightLKR: 58000,
        pricePerDayoutLKR: 28000,
        maxGuests: 8,
        totalUnits: 1,
        description: 'Exclusively yours with direct beach steps.'
      }
    ]
  },
  {
    id: 'prop-8',
    ownerId: 'host-6',
    ownerName: 'Sanjeewa Alwis',
    title: 'Negombo Lagoon Luxury Houseboat Staycation',
    tagline: 'Floating luxury houseboat staycation & day cruise along Negombo Lagoon',
    description: 'A unique waterborne staycation in Sri Lanka! Cruise down tranquil mangroves during the day, enjoy fresh lagoon crab lunch, and relax on the upper sun deck.',
    category: 'UNIQUE',
    stayTypes: ['BOTH'],
    address: 'Lagoon Drive, Negombo',
    city: 'Negombo',
    district: 'Gampaha',
    lat: 7.2083,
    lng: 79.8358,
    rating: 4.89,
    reviewCount: 43,
    featuredImage: 'https://picsum.photos/seed/negombohouseboat/1200/800',
    images: [
      'https://picsum.photos/seed/negombohouseboat/1200/800',
      'https://picsum.photos/seed/negombolagoon/1200/800',
      'https://picsum.photos/seed/negombocrab/1200/800',
    ],
    amenities: ['Lagoon Cruise', 'Air Conditioning', 'Lagoon Crab Buffet', 'Sun Deck', 'Kayaks', 'Wi-Fi'],
    featured: false,
    status: 'APPROVED',
    pricePerNightLKR: 39000,
    pricePerDayoutLKR: 9800,
    dayoutPackage: {
      title: 'Negombo Lagoon Day Cruise & Crab Feast',
      timeSlot: '10:00 AM - 04:00 PM',
      pricePerPersonLKR: 9800,
      minGuests: 2,
      inclusions: [
        '2-Hour Guided Mangrove Boat Cruise',
        'Famous Negombo Spicy Lagoon Crab Lunch',
        'Air-conditioned Cabin Rest Lounge',
        'Free Kayaking & Fishing Equipment'
      ]
    },
    bookingComSyncEnabled: true,
    bookingComRef: 'BC-NGB-3321',
    lastSyncedAt: '2026-08-01 04:15 AM',
    rooms: [
      {
        id: 'room-8-1',
        propertyId: 'prop-8',
        name: 'Master Air-conditioned Cabin',
        pricePerNightLKR: 39000,
        pricePerDayoutLKR: 16000,
        maxGuests: 4,
        totalUnits: 1,
        description: 'Floating suite with glass windows and king bed.'
      }
    ]
  },
  {
    id: 'prop-9',
    ownerId: 'host-7',
    ownerName: 'Manjula Herath',
    title: 'Galle Fort Heritage Boutique Villa',
    tagline: 'Restored Dutch colonial villa inside 17th Century UNESCO Galle Fort',
    description: 'Immerse in living history inside Galle Fort walls. Soaring ceilings, courtyards with plunge pools, antique teak furniture, and footsteps away from ramparts and lighthouse.',
    category: 'VILLA',
    stayTypes: ['BOTH'],
    address: 'Pedlar Street, Galle Fort',
    city: 'Galle',
    district: 'Galle',
    lat: 6.03,
    lng: 80.217,
    rating: 4.91,
    reviewCount: 67,
    featuredImage: 'https://picsum.photos/seed/gallefortvilla/1200/800',
    images: [
      'https://picsum.photos/seed/gallefortvilla/1200/800',
      'https://picsum.photos/seed/gallepool/1200/800',
      'https://picsum.photos/seed/gallelighthouse/1200/800',
    ],
    amenities: ['Plunge Pool', 'Courtyard', 'Air Conditioning', 'Free Wi-Fi', 'Breakfast Included', 'Bicycle Rental'],
    featured: true,
    status: 'APPROVED',
    pricePerNightLKR: 52000,
    pricePerDayoutLKR: 11500,
    dayoutPackage: {
      title: 'Galle Fort Heritage Day Escape',
      timeSlot: '09:30 AM - 05:30 PM',
      pricePerPersonLKR: 11500,
      minGuests: 2,
      inclusions: [
        'Welcome Ceylon Cardamom Iced Tea',
        'Galle Fort Dutch Courtyard Plunge Pool Access',
        'Artisanal 3-Course Fusion Lunch',
        'Bicycle for Fort Rampart Exploration'
      ]
    },
    bookingComSyncEnabled: true,
    bookingComRef: 'BC-GAL-5510',
    lastSyncedAt: '2026-08-01 07:10 AM',
    rooms: [
      {
        id: 'room-9-1',
        propertyId: 'prop-9',
        name: 'Dutch Governor Suite',
        pricePerNightLKR: 52000,
        pricePerDayoutLKR: 19000,
        maxGuests: 3,
        totalUnits: 1,
        description: 'Four-poster poster teak bed with private courtyard pool.'
      }
    ]
  },
  {
    id: 'prop-10',
    ownerId: 'host-8',
    ownerName: 'Dinuka Mendis',
    title: 'Pasikudah Azure Bay Beach Resort & Dayout',
    tagline: 'Crystal clear calm shallow bay dayout experience in Pasikudah',
    description: 'Famous for its kilometer-long shallow turquoise bay. Enjoy day passes with giant swimming pools, beach volley, seafood BBQ, and water sports.',
    category: 'HOTEL',
    stayTypes: ['BOTH'],
    address: 'Coconut Board Road, Pasikudah',
    city: 'Pasikudah',
    district: 'Batticaloa',
    lat: 7.9231,
    lng: 81.5621,
    rating: 4.84,
    reviewCount: 39,
    featuredImage: 'https://picsum.photos/seed/pasikudahresort/1200/800',
    images: [
      'https://picsum.photos/seed/pasikudahresort/1200/800',
      'https://picsum.photos/seed/pasikudahbay/1200/800',
    ],
    amenities: ['Calm Sea Access', 'Swimming Pool', 'Buffet Lunch', 'Beach Volley', 'Wi-Fi', 'Air Conditioning'],
    featured: false,
    status: 'PENDING',
    pricePerNightLKR: 34000,
    pricePerDayoutLKR: 7800,
    dayoutPackage: {
      title: 'Pasikudah Azure Sea Day Pass',
      timeSlot: '09:00 AM - 05:00 PM',
      pricePerPersonLKR: 7800,
      minGuests: 2,
      inclusions: [
        'Welcome Watermelon & Lime Cooler',
        'Buffet Lunch with Eastern Seafood Specialities',
        'Pool & Shallow Beach Access',
        'Changing Room & Shower'
      ]
    },
    bookingComSyncEnabled: false,
    rooms: [
      {
        id: 'room-10-1',
        propertyId: 'prop-10',
        name: 'Deluxe Bayview Room',
        pricePerNightLKR: 34000,
        pricePerDayoutLKR: 11000,
        maxGuests: 3,
        totalUnits: 6,
        description: 'Room facing Pasikudah bay with pool access.'
      }
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-2026-0801',
    userId: 'user-guest-1',
    userName: 'Dilshan Silva',
    userEmail: 'dilshan@example.lk',
    userPhone: '+94 77 123 4567',
    propertyId: 'prop-1',
    propertyTitle: 'The Palms Beach Resort & Dayout Oasis',
    propertyImage: 'https://picsum.photos/seed/bentotapalms/600/400',
    propertyCategory: 'HOTEL',
    city: 'Bentota',
    bookingType: 'DAYOUT',
    checkIn: '2026-08-08',
    checkOut: '2026-08-08',
    guests: 4,
    dayoutPackageTitle: 'Bentota Royal Dayout Package',
    basePriceLKR: 34000,
    taxesLKR: 3400,
    platformFeeLKR: 1500,
    discountLKR: 3000,
    totalPriceLKR: 35900,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod: 'PayHere Visa / Mastercard',
    createdAt: '2026-08-01 06:20 AM',
    specialRequests: 'Celebrating a birthday, please arrange a small cake at lunch table.'
  },
  {
    id: 'BK-2026-0802',
    userId: 'user-guest-1',
    userName: 'Dilshan Silva',
    userEmail: 'dilshan@example.lk',
    userPhone: '+94 77 123 4567',
    propertyId: 'prop-2',
    propertyTitle: 'Kandy Cloud Crest Private Villa & Sky Pool',
    propertyImage: 'https://picsum.photos/seed/kandyvilla/600/400',
    propertyCategory: 'VILLA',
    city: 'Kandy',
    bookingType: 'NIGHT_STAY',
    checkIn: '2026-08-18',
    checkOut: '2026-08-20',
    guests: 6,
    basePriceLKR: 130000,
    taxesLKR: 13000,
    platformFeeLKR: 4500,
    discountLKR: 0,
    totalPriceLKR: 147500,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod: 'Stripe Card Payment',
    bookingComRef: 'BC-KDY-4401-SYNC',
    createdAt: '2026-07-28 09:12 PM',
  },
  {
    id: 'BK-2026-0803',
    userId: 'user-guest-1',
    userName: 'Dilshan Silva',
    userEmail: 'dilshan@example.lk',
    userPhone: '+94 77 123 4567',
    propertyId: 'prop-6',
    propertyTitle: 'Sigiriya Rockview Glamping & Treehouse Sanctuary',
    propertyImage: 'https://picsum.photos/seed/sigiriyatreehouse/600/400',
    propertyCategory: 'UNIQUE',
    city: 'Sigiriya',
    bookingType: 'DAYOUT',
    checkIn: '2026-08-25',
    checkOut: '2026-08-25',
    guests: 2,
    dayoutPackageTitle: 'Sigiriya Wild Treehouse Day Sanctuary',
    basePriceLKR: 22000,
    taxesLKR: 2200,
    platformFeeLKR: 1000,
    discountLKR: 2000,
    totalPriceLKR: 23200,
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    paymentMethod: 'Bank Transfer / Pay at Venue',
    createdAt: '2026-08-01 07:10 AM',
  }
];

export const INITIAL_EXTERNAL_SYNCS: ExternalSync[] = [
  {
    id: 'sync-1',
    propertyId: 'prop-1',
    propertyTitle: 'The Palms Beach Resort & Dayout Oasis',
    platformName: 'BOOKING_COM',
    syncUrl: 'https://admin.booking.com/ical/v1/feed/BentotaPalms.ics',
    syncType: 'TWO_WAY',
    autoBlockCalendar: true,
    lastSyncedAt: '2026-08-01 07:15 AM',
    syncStatus: 'ACTIVE',
    totalBlockedDatesCount: 3,
    webhookSecret: 'whsec_bkcom_9821384792183'
  },
  {
    id: 'sync-2',
    propertyId: 'prop-2',
    propertyTitle: 'Kandy Cloud Crest Private Villa & Sky Pool',
    platformName: 'BOOKING_COM',
    syncUrl: 'https://admin.booking.com/ical/v1/feed/KandyCloudCrest.ics',
    syncType: 'TWO_WAY',
    autoBlockCalendar: true,
    lastSyncedAt: '2026-08-01 06:40 AM',
    syncStatus: 'ACTIVE',
    totalBlockedDatesCount: 2,
    webhookSecret: 'whsec_bkcom_1120938472911'
  },
  {
    id: 'sync-3',
    propertyId: 'prop-4',
    propertyTitle: 'Colonial Tea Estate Heritage Cottage',
    platformName: 'BOOKING_COM',
    syncUrl: 'https://admin.booking.com/ical/v1/feed/NuwaraCottage.ics',
    syncType: 'ONE_WAY_IMPORT',
    autoBlockCalendar: true,
    lastSyncedAt: '2026-08-01 05:30 AM',
    syncStatus: 'ACTIVE',
    totalBlockedDatesCount: 1,
    webhookSecret: 'whsec_bkcom_7736481923182'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    propertyId: 'prop-1',
    userId: 'u-101',
    userName: 'Anushka Jayasinghe',
    userAvatar: 'https://picsum.photos/seed/anushka/100/100',
    rating: 5,
    cleanlinessRating: 5,
    locationRating: 5,
    valueRating: 5,
    serviceRating: 5,
    comment: 'Best dayout experience in Bentota! The seafood buffet was incredible, changing rooms were super clean, and the pool access was endless. Highly recommend Ceylon DayOuts!',
    createdAt: '2026-07-20'
  },
  {
    id: 'rev-2',
    propertyId: 'prop-1',
    userId: 'u-102',
    userName: 'Samantha Perera',
    userAvatar: 'https://picsum.photos/seed/samantha/100/100',
    rating: 4.8,
    cleanlinessRating: 5,
    locationRating: 5,
    valueRating: 4.5,
    serviceRating: 5,
    comment: 'Great family dayout spot. Jet ski discount worked seamlessly and staff was extremely courteous.',
    createdAt: '2026-07-15'
  },
  {
    id: 'rev-3',
    propertyId: 'prop-2',
    userId: 'u-103',
    userName: 'Ruwan Kumara',
    userAvatar: 'https://picsum.photos/seed/ruwan/100/100',
    rating: 5,
    cleanlinessRating: 5,
    locationRating: 5,
    valueRating: 5,
    serviceRating: 5,
    comment: 'The sky infinity pool in Kandy is out of this world! Pure luxury and peaceful mountain vibes.',
    createdAt: '2026-07-24'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-guest-1',
    roleTarget: 'GUEST',
    title: 'Booking Confirmed!',
    message: 'Your dayout reservation at The Palms Beach Resort Bentota for 4 guests has been confirmed.',
    type: 'BOOKING',
    read: false,
    timestamp: '2026-08-01 06:21 AM',
    bookingId: 'BK-2026-0801'
  },
  {
    id: 'notif-2',
    userId: 'user-host-1',
    roleTarget: 'HOST',
    title: 'New Reservation Request',
    message: 'Dilshan Silva booked Kandy Cloud Crest Private Villa for 2 nights starting Aug 18.',
    type: 'BOOKING',
    read: false,
    timestamp: '2026-07-28 09:12 PM',
    bookingId: 'BK-2026-0802'
  },
  {
    id: 'notif-3',
    userId: 'user-host-1',
    roleTarget: 'HOST',
    title: 'Booking.com Channel Sync Complete',
    message: '2-way iCal sync with Booking.com updated 3 dates automatically.',
    type: 'SYNC',
    read: true,
    timestamp: '2026-08-01 07:15 AM'
  }
];

export const AMENITIES_LIST = [
  { name: 'Swimming Pool', icon: 'Waves' },
  { name: 'Buffet Lunch', icon: 'Utensils' },
  { name: 'Wi-Fi', icon: 'Wifi' },
  { name: 'Air Conditioning', icon: 'Snowflake' },
  { name: 'Free Parking', icon: 'Car' },
  { name: 'Beach Access', icon: 'Sun' },
  { name: 'Spa', icon: 'Sparkles' },
  { name: 'Changing Room', icon: 'DoorClosed' },
  { name: 'Bar', icon: 'Wine' },
  { name: 'Private Pool', icon: 'Waves' },
  { name: 'Chef on Demand', icon: 'ChefHat' },
  { name: 'Mountain View', icon: 'Mountain' },
  { name: 'BBQ Facilities', icon: 'Flame' },
  { name: 'Kitchen', icon: 'CookingPot' },
  { name: 'Hot Water', icon: 'ShowerHead' },
  { name: 'Fireplace', icon: 'Flame' },
  { name: 'High Tea', icon: 'Coffee' },
  { name: 'Rock View', icon: 'Eye' },
  { name: 'Lagoon Cruise', icon: 'Ship' }
];

export const SRI_LANKA_CITIES = [
  'All Cities',
  'Anuradhapura',
  'Bentota',
  'Colombo',
  'Kandy',
  'Galle',
  'Ella',
  'Nuwara Eliya',
  'Sigiriya',
  'Mirissa',
  'Negombo',
  'Pasikudah',
  'Arugam Bay',
  'Trincomalee',
  'Dambulla',
  'Hikkaduwa',
  'Tangalle',
  'Kitulgala'
];
