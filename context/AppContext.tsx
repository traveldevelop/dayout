'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  Booking, 
  Review, 
  ExternalSync, 
  User, 
  NotificationItem, 
  FilterState, 
  UserRole,
  BookingStatus,
  PaymentStatus
} from '@/types/dayout';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_BOOKINGS, 
  INITIAL_EXTERNAL_SYNCS, 
  INITIAL_REVIEWS, 
  INITIAL_USERS, 
  INITIAL_NOTIFICATIONS 
} from '@/lib/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  properties: Property[];
  bookings: Booking[];
  syncs: ExternalSync[];
  reviews: Review[];
  notifications: NotificationItem[];
  wishlist: string[];
  toggleWishlist: (propertyId: string) => void;
  
  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredProperties: Property[];

  // Property Actions
  addProperty: (propertyData: Partial<Property>) => Property;
  updateProperty: (propertyId: string, updates: Partial<Property>) => void;
  updatePropertyStatus: (propertyId: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => void;
  blockPropertyDates: (propertyId: string, dates: string[]) => void;
  
  // Booking Actions
  createBooking: (bookingData: Partial<Booking>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, paymentStatus?: PaymentStatus) => void;
  
  // External Channel Sync (Booking.com)
  triggerBookingComSync: (syncId: string) => Promise<{ success: boolean; blockedCount: number; message: string }>;
  addExternalSync: (syncData: Partial<ExternalSync>) => void;
  
  // Review Actions
  addReview: (reviewData: Partial<Review>) => void;

  // Notifications & Push
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // UI States
  isHydrated: boolean;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  commissionRatePercent: number;
  setCommissionRatePercent: (rate: number) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  city: 'All Cities',
  category: 'ALL',
  bookingType: 'ALL',
  minPrice: 0,
  maxPrice: 150000,
  minRating: 0,
  selectedAmenities: [],
  guests: 1,
  checkInDate: '',
  checkOutDate: '',
  sortBy: 'POPULAR',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ceylon_dayouts_app_state_v6';
const LEGACY_STORAGE_KEY = 'ceylon_dayouts_app_state_v2';

// Helper functions for dynamic IDs
function getSavedState() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentRole, setCurrentRole] = useState<UserRole>('GUEST');
  
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [syncs, setSyncs] = useState<ExternalSync[]>(INITIAL_EXTERNAL_SYNCS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [commissionRatePercent, setCommissionRatePercent] = useState<number>(12);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved state from LocalStorage after initial client mount to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.properties) && parsed.properties.length > 0) {
            // Merge with fresh INITIAL_PROPERTIES so latest contacts, floorPackages and White Lotus details are always present
            const freshMap = new Map(INITIAL_PROPERTIES.map(p => [p.id, p]));
            const mergedProperties: Property[] = parsed.properties.map((savedProp: Property) => {
              const fresh = freshMap.get(savedProp.id);
              if (fresh) {
                return {
                  ...savedProp,
                  ...fresh,
                  contactWhatsApp: fresh.contactWhatsApp || savedProp.contactWhatsApp || '+94718805858',
                  contactPhone: fresh.contactPhone || savedProp.contactPhone || '0252226094',
                  contactPhone2: fresh.contactPhone2 || savedProp.contactPhone2 || '0718805858',
                };
              }
              return savedProp;
            });

            // Add any INITIAL_PROPERTIES not present in saved
            INITIAL_PROPERTIES.forEach(ip => {
              if (!mergedProperties.some(p => p.id === ip.id)) {
                mergedProperties.unshift(ip);
              }
            });

            setProperties(mergedProperties);
          } else {
            setProperties(INITIAL_PROPERTIES);
          }
          if (Array.isArray(parsed.bookings)) setBookings(parsed.bookings);
          if (Array.isArray(parsed.syncs)) setSyncs(parsed.syncs);
          if (Array.isArray(parsed.reviews)) setReviews(parsed.reviews);
          if (Array.isArray(parsed.notifications)) setNotifications(parsed.notifications);
          if (parsed.darkMode !== undefined) setDarkModeState(Boolean(parsed.darkMode));
          if (typeof parsed.commissionRatePercent === 'number') setCommissionRatePercent(parsed.commissionRatePercent);
        } else {
          setProperties(INITIAL_PROPERTIES);
        }
      } catch (e) {
        console.warn('Could not load from localStorage', e);
        setProperties(INITIAL_PROPERTIES);
      } finally {
        setIsHydrated(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save to LocalStorage on state update (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave = {
        properties,
        bookings,
        syncs,
        reviews,
        notifications,
        darkMode,
        commissionRatePercent
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [isHydrated, properties, bookings, syncs, reviews, notifications, darkMode, commissionRatePercent]);

  // Sync dark class on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkModeState(prev => !prev);
  const setDarkMode = (val: boolean) => setDarkModeState(val);

  // Get active current user based on role
  const currentUser = users.find(u => u.role === currentRole) || users[0];

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const wishlist = currentUser.wishlist || [];

  const toggleWishlist = (propertyId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const exists = u.wishlist.includes(propertyId);
        const updated = exists 
          ? u.wishlist.filter(id => id !== propertyId)
          : [...u.wishlist, propertyId];
        return { ...u, wishlist: updated };
      }
      return u;
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // Filtered Properties Logic
  const filteredProperties = properties.filter(prop => {
    // Only show approved properties to GUEST role
    if (currentRole === 'GUEST' && prop.status !== 'APPROVED') return false;

    // Search text query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchCity = prop.city.toLowerCase().includes(q);
      const matchCategory = prop.category.toLowerCase().includes(q);
      const matchDesc = prop.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchCategory && !matchDesc) return false;
    }

    // City filter
    if (filters.city !== 'All Cities' && prop.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }

    // Category filter
    if (filters.category !== 'ALL' && prop.category !== filters.category) {
      return false;
    }

    // Booking Type filter (Dayout vs Night Stay)
    if (filters.bookingType === 'DAYOUT' && !prop.stayTypes.includes('BOTH') && prop.pricePerDayoutLKR <= 0) {
      return false;
    }
    if (filters.bookingType === 'NIGHT_STAY' && !prop.stayTypes.includes('BOTH') && prop.pricePerNightLKR <= 0) {
      return false;
    }

    // Rating filter
    if (filters.minRating > 0 && prop.rating < filters.minRating) {
      return false;
    }

    // Price range
    const effectivePrice = filters.bookingType === 'DAYOUT' ? prop.pricePerDayoutLKR : prop.pricePerNightLKR;
    if (effectivePrice < filters.minPrice || (filters.maxPrice > 0 && effectivePrice > filters.maxPrice)) {
      return false;
    }

    // Amenities match
    if (filters.selectedAmenities.length > 0) {
      const hasAll = filters.selectedAmenities.every(a => prop.amenities.includes(a));
      if (!hasAll) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'PRICE_LOW') {
      const pA = filters.bookingType === 'DAYOUT' ? a.pricePerDayoutLKR : a.pricePerNightLKR;
      const pB = filters.bookingType === 'DAYOUT' ? b.pricePerDayoutLKR : b.pricePerNightLKR;
      return pA - pB;
    }
    if (filters.sortBy === 'PRICE_HIGH') {
      const pA = filters.bookingType === 'DAYOUT' ? a.pricePerDayoutLKR : a.pricePerNightLKR;
      const pB = filters.bookingType === 'DAYOUT' ? b.pricePerDayoutLKR : b.pricePerNightLKR;
      return pB - pA;
    }
    if (filters.sortBy === 'RATING') {
      return b.rating - a.rating;
    }
    // Default POPULAR
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviewCount - a.reviewCount;
  });

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      read: false,
      timestamp: 'Just now',
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  // Action implementations
  const addProperty = (propertyData: Partial<Property>): Property => {
    const id = `prop-${Date.now()}`;
    const newProp: Property = {
      id,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      title: propertyData.title || 'New Staycation Property',
      tagline: propertyData.tagline || 'Experience luxury dayouts and stays in Sri Lanka',
      description: propertyData.description || 'Welcome to our premium staycation destination.',
      category: propertyData.category || 'VILLA',
      stayTypes: propertyData.stayTypes || ['BOTH'],
      address: propertyData.address || 'Colombo, Sri Lanka',
      city: propertyData.city || 'Colombo',
      district: propertyData.district || 'Colombo',
      lat: propertyData.lat || 6.9271,
      lng: propertyData.lng || 79.8612,
      rating: 5.0,
      reviewCount: 1,
      featuredImage: propertyData.featuredImage || 'https://picsum.photos/seed/newstay/1200/800',
      images: propertyData.images?.length ? propertyData.images : ['https://picsum.photos/seed/newstay/1200/800'],
      amenities: propertyData.amenities || ['Swimming Pool', 'Wi-Fi', 'Air Conditioning'],
      featured: false,
      status: currentRole === 'ADMIN' ? 'APPROVED' : 'PENDING',
      pricePerNightLKR: propertyData.pricePerNightLKR || 35000,
      pricePerDayoutLKR: propertyData.pricePerDayoutLKR || 8000,
      dayoutPackage: propertyData.dayoutPackage,
      bookingComSyncEnabled: propertyData.bookingComSyncEnabled || false,
      rooms: propertyData.rooms || [],
      blockedDates: [],
    };

    setProperties(prev => [newProp, ...prev]);

    // Send Admin Notification
    addNotification({
      userId: 'user-admin-1',
      roleTarget: 'ADMIN',
      title: 'New Property Listing Submitted',
      message: `${newProp.title} in ${newProp.city} submitted by ${currentUser.name} for review.`,
      type: 'APPROVAL',
    });

    return newProp;
  };

  const updateProperty = (propertyId: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));
  };

  const updatePropertyStatus = (propertyId: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        addNotification({
          userId: p.ownerId,
          roleTarget: 'HOST',
          title: `Property ${status === 'APPROVED' ? 'Approved' : 'Updated'}`,
          message: `Your listing "${p.title}" status has been updated to ${status}.`,
          type: 'APPROVAL',
        });
        return { ...p, status };
      }
      return p;
    }));
  };

  const blockPropertyDates = (propertyId: string, datesToBlock: string[]) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const current = p.blockedDates || [];
        const merged = Array.from(new Set([...current, ...datesToBlock]));
        return { ...p, blockedDates: merged };
      }
      return p;
    }));
  };

  const createBooking = (bookingData: Partial<Booking>): Booking => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `BK-${new Date().getFullYear()}-${randomNum}`;
    const newBooking: Booking = {
      id,
      userId: currentUser.id,
      userName: bookingData.userName || currentUser.name,
      userEmail: bookingData.userEmail || currentUser.email,
      userPhone: bookingData.userPhone || currentUser.phone,
      propertyId: bookingData.propertyId!,
      propertyTitle: bookingData.propertyTitle || 'Staycation Spot',
      propertyImage: bookingData.propertyImage || 'https://picsum.photos/seed/stay/600/400',
      propertyCategory: bookingData.propertyCategory || 'HOTEL',
      city: bookingData.city || 'Bentota',
      bookingType: bookingData.bookingType || 'DAYOUT',
      checkIn: bookingData.checkIn || new Date().toISOString().split('T')[0],
      checkOut: bookingData.checkOut || new Date().toISOString().split('T')[0],
      guests: bookingData.guests || 2,
      dayoutPackageTitle: bookingData.dayoutPackageTitle,
      basePriceLKR: bookingData.basePriceLKR || 10000,
      taxesLKR: bookingData.taxesLKR || 1000,
      platformFeeLKR: bookingData.platformFeeLKR || 500,
      discountLKR: bookingData.discountLKR || 0,
      totalPriceLKR: bookingData.totalPriceLKR || 11500,
      status: bookingData.status || 'CONFIRMED',
      paymentStatus: bookingData.paymentStatus || 'PAID',
      paymentMethod: bookingData.paymentMethod || 'Online Payment',
      createdAt: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
      specialRequests: bookingData.specialRequests,
    };

    setBookings(prev => [newBooking, ...prev]);

    // Auto block dates on property calendar
    blockPropertyDates(newBooking.propertyId, [newBooking.checkIn]);

    // Send Notifications to Guest & Host
    const prop = properties.find(p => p.id === newBooking.propertyId);
    
    addNotification({
      userId: currentUser.id,
      roleTarget: 'GUEST',
      title: 'Booking Receipt Confirmed',
      message: `Your booking #${id} at ${newBooking.propertyTitle} is confirmed! Check details in My Bookings.`,
      type: 'BOOKING',
      bookingId: id,
    });

    if (prop) {
      addNotification({
        userId: prop.ownerId,
        roleTarget: 'HOST',
        title: 'New Reservation Received!',
        message: `${newBooking.userName} reserved ${newBooking.propertyTitle} for ${newBooking.checkIn}.`,
        type: 'BOOKING',
        bookingId: id,
      });
    }

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, paymentStatus?: PaymentStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const updated = { 
          ...b, 
          status, 
          ...(paymentStatus ? { paymentStatus } : {}) 
        };
        addNotification({
          userId: b.userId,
          roleTarget: 'GUEST',
          title: `Booking #${b.id} ${status}`,
          message: `Your reservation status at ${b.propertyTitle} is now ${status}.`,
          type: 'BOOKING',
          bookingId: b.id,
        });
        return updated;
      }
      return b;
    }));
  };

  // Booking.com Channel Sync Handler
  const triggerBookingComSync = async (syncId: string) => {
    const syncItem = syncs.find(s => s.id === syncId);
    if (!syncItem) return { success: false, blockedCount: 0, message: 'Sync target not found' };

    await new Promise(r => setTimeout(r, 1000));

    const today = new Date();
    const d1 = new Date(today.getTime() + 5 * 86400000).toISOString().split('T')[0];
    const d2 = new Date(today.getTime() + 12 * 86400000).toISOString().split('T')[0];
    const newBlocked = [d1, d2];

    blockPropertyDates(syncItem.propertyId, newBlocked);

    const nowFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    setSyncs(prev => prev.map(s => {
      if (s.id === syncId) {
        return {
          ...s,
          lastSyncedAt: nowFormatted,
          syncStatus: 'ACTIVE',
          totalBlockedDatesCount: s.totalBlockedDatesCount + 2,
        };
      }
      return s;
    }));

    updateProperty(syncItem.propertyId, {
      lastSyncedAt: nowFormatted,
      bookingComSyncEnabled: true,
    });

    addNotification({
      userId: currentUser.id,
      roleTarget: 'HOST',
      title: 'Booking.com Channel Sync Successful',
      message: `Fetched latest availability feed from Booking.com API. Calendar updated.`,
      type: 'SYNC',
    });

    return {
      success: true,
      blockedCount: 2,
      message: `Successfully synced with Booking.com. Auto-blocked 2 external reservation dates (${d1}, ${d2}).`,
    };
  };

  const addExternalSync = (syncData: Partial<ExternalSync>) => {
    const id = `sync-${Date.now()}`;
    const newSync: ExternalSync = {
      id,
      propertyId: syncData.propertyId!,
      propertyTitle: syncData.propertyTitle || 'Property',
      platformName: syncData.platformName || 'BOOKING_COM',
      syncUrl: syncData.syncUrl || 'https://admin.booking.com/ical/feed.ics',
      syncType: syncData.syncType || 'TWO_WAY',
      autoBlockCalendar: true,
      lastSyncedAt: 'Just now',
      syncStatus: 'ACTIVE',
      totalBlockedDatesCount: 0,
      webhookSecret: `whsec_bkcom_${Date.now().toString(36)}`,
    };
    setSyncs(prev => [newSync, ...prev]);
    updateProperty(newSync.propertyId, { bookingComSyncEnabled: true });
  };

  const addReview = (reviewData: Partial<Review>) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      propertyId: reviewData.propertyId!,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: reviewData.rating || 5,
      cleanlinessRating: reviewData.cleanlinessRating || 5,
      locationRating: reviewData.locationRating || 5,
      valueRating: reviewData.valueRating || 5,
      serviceRating: reviewData.serviceRating || 5,
      comment: reviewData.comment || 'Amazing staycation experience!',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReviews(prev => [newReview, ...prev]);

    const propReviews = [...reviews.filter(r => r.propertyId === reviewData.propertyId), newReview];
    const avg = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
    updateProperty(reviewData.propertyId!, {
      rating: Number(avg.toFixed(2)),
      reviewCount: propReviews.length,
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        properties,
        bookings,
        syncs,
        reviews,
        notifications,
        wishlist,
        toggleWishlist,
        filters,
        setFilters,
        resetFilters,
        filteredProperties,
        addProperty,
        updateProperty,
        updatePropertyStatus,
        blockPropertyDates,
        createBooking,
        updateBookingStatus,
        triggerBookingComSync,
        addExternalSync,
        addReview,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        isHydrated,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        commissionRatePercent,
        setCommissionRatePercent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
