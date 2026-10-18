export type Category = 'HOTEL' | 'VILLA' | 'CABANA' | 'COTTAGE' | 'ROOM' | 'UNIQUE';

export type UserRole = 'GUEST' | 'HOST' | 'ADMIN';

export type StayType = 'DAYOUT' | 'NIGHT_STAY' | 'BOTH';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  wishlist: string[];
  createdAt: string;
  hostStatus?: 'APPROVED' | 'PENDING' | 'NOT_APPLIED';
}

export interface RoomUnit {
  id: string;
  propertyId: string;
  name: string;
  pricePerNightLKR: number;
  pricePerDayoutLKR: number;
  maxGuests: number;
  totalUnits: number;
  bookingComUnitId?: string;
  description: string;
}

export interface DayoutPackageInfo {
  title: string;
  timeSlot: string; // e.g. "09:00 AM - 05:00 PM"
  pricePerPersonLKR: number;
  minGuests: number;
  inclusions: string[]; // e.g. ["Welcome Drink", "Buffet Lunch", "Pool Access", "Changing Room", "Evening Tea & Snacks"]
}

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  tagline: string;
  description: string;
  category: Category;
  stayTypes: StayType[];
  address: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  featuredImage: string;
  images: string[];
  amenities: string[];
  featured: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  dayoutPackage?: DayoutPackageInfo;
  pricePerNightLKR: number;
  pricePerDayoutLKR: number;
  bookingComSyncEnabled: boolean;
  bookingComRef?: string;
  lastSyncedAt?: string;
  rooms: RoomUnit[];
  contactPhone?: string;
  contactPhone2?: string;
  contactWhatsApp?: string;
  extraGuestFeeLKR?: number;
  specialPromoBanner?: string;
  floorSections?: {
    floorName: string;
    subtitle: string;
    badge?: string;
    facilities: string[];
    packages: {
      groupTitle: string;
      guestCount?: number;
      options: {
        name: string;
        priceLKR: number;
        features?: string[];
      }[];
    }[];
  }[];
  blockedDates?: string[];
  weekendSurgePercent?: number;
  seasonalDiscountPercent?: number;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'REJECTED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export type BookingType = 'DAYOUT' | 'NIGHT_STAY';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyCategory: Category;
  city: string;
  roomId?: string;
  roomName?: string;
  bookingType: BookingType;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  dayoutPackageTitle?: string;
  basePriceLKR: number;
  taxesLKR: number;
  platformFeeLKR: number;
  discountLKR: number;
  totalPriceLKR: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  bookingComRef?: string;
  createdAt: string;
  specialRequests?: string;
}

export interface ExternalSync {
  id: string;
  propertyId: string;
  propertyTitle: string;
  platformName: 'BOOKING_COM' | 'AIRBNB' | 'EXPEDIA';
  syncUrl: string;
  syncType: 'TWO_WAY' | 'ONE_WAY_IMPORT' | 'ONE_WAY_EXPORT';
  autoBlockCalendar: boolean;
  lastSyncedAt: string;
  syncStatus: 'ACTIVE' | 'WARNING' | 'ERROR';
  totalBlockedDatesCount: number;
  webhookSecret?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  cleanlinessRating: number;
  locationRating: number;
  valueRating: number;
  serviceRating: number;
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  roleTarget: UserRole;
  title: string;
  message: string;
  type: 'BOOKING' | 'PAYMENT' | 'SYNC' | 'APPROVAL';
  read: boolean;
  timestamp: string;
  bookingId?: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  category: Category | 'ALL';
  bookingType: 'ALL' | 'DAYOUT' | 'NIGHT_STAY';
  minPrice: number;
  maxPrice: number;
  minRating: number;
  selectedAmenities: string[];
  guests: number;
  checkInDate: string;
  checkOutDate: string;
  sortBy: 'POPULAR' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING';
}
