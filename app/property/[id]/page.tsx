'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { CheckoutModal } from '@/components/CheckoutModal';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { Property, Review } from '@/types/dayout';
import { INITIAL_PROPERTIES } from '@/lib/mockData';
import { 
  ArrowLeft,
  Star, 
  MapPin, 
  Sun, 
  MoonStar, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Heart, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Lock,
  Clock,
  Utensils,
  Waves,
  MessageSquare,
  Share2,
  Check,
  Building2,
  DoorClosed,
  ChevronRight,
  Palmtree,
  Wifi,
  Coffee,
  Tv,
  Car,
  Phone,
  PhoneCall,
  MessageCircle,
  Layers,
  Flame,
  CookingPot,
  Tag
} from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const { 
    properties, 
    wishlist, 
    toggleWishlist, 
    reviews, 
    addReview, 
    currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'WISHLIST' | 'MY_BOOKINGS' | 'HOST_DASHBOARD' | 'ADMIN_PANEL'>('EXPLORE');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find property by ID (checking active state, with fallback to INITIAL_PROPERTIES)
  const property = properties.find(p => p.id === propertyId) || INITIAL_PROPERTIES.find(p => p.id === propertyId);

  // Direct Host Inquiries & WhatsApp Helpers
  const whatsappNumber = property?.contactWhatsApp || '+94718805858';
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappChatUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello, I would like to inquire about booking "${property?.title || 'White Lotus Holiday Resort'}".`)}`;
  const mainPhone = property?.contactPhone || '0252226094';
  const secondPhone = property?.contactPhone2 || '0718805858';

  // Booking widget state
  const [bookingType, setBookingType] = useState<'DAYOUT' | 'NIGHT_STAY'>('DAYOUT');
  const [checkInDate, setCheckInDate] = useState<string>('2026-08-12');
  const [checkOutDate, setCheckOutDate] = useState<string>('2026-08-12');
  const [guests, setGuests] = useState<number>(2);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
    const found = properties.find(p => p.id === propertyId) || INITIAL_PROPERTIES.find(p => p.id === propertyId);
    return found?.rooms?.[0]?.id || 'WHOLE_PROPERTY';
  });
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Review submission state
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');

  // Checkout modal state
  const [checkoutData, setCheckoutData] = useState<{
    property: Property;
    bookingType: 'DAYOUT' | 'NIGHT_STAY';
    checkIn: string;
    checkOut: string;
    guests: number;
    roomName?: string;
    roomId?: string;
    basePriceLKR: number;
    taxesLKR: number;
    platformFeeLKR: number;
    discountLKR: number;
    totalPriceLKR: number;
    couponCode?: string;
  } | null>(null);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col">
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            router.push('/');
          }}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="glass-panel max-w-md w-full rounded-3xl p-8 text-center space-y-5 border border-white/90 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Property Not Found</h2>
              <p className="text-xs text-slate-500 mt-1">The accommodation or dayout listing you requested could not be located.</p>
            </div>
            <Link
              href="/"
              className="btn-3d-emerald text-white font-extrabold text-sm px-6 py-3 rounded-2xl inline-flex items-center gap-2 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Explore Stays
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const propertyReviews = reviews.filter(r => r.propertyId === property.id);
  const isWishlisted = wishlist.includes(property.id);

  // Find active selected cabana unit
  const selectedRoom = property.rooms?.find(r => r.id === selectedRoomId);
  const roomName = selectedRoom ? selectedRoom.name : 'Entire Business Complex';

  // Duration math in days/nights
  const calculateDurationDays = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate).getTime();
    const end = new Date(checkOutDate).getTime();
    if (isNaN(start) || isNaN(end) || end < start) return 1;
    const diff = Math.round((end - start) / (1000 * 3600 * 24));
    return diff === 0 ? 1 : diff;
  };

  const durationDays = calculateDurationDays();

  // Pricing math per selected cabana unit and duration
  const unitRate = selectedRoom
    ? (bookingType === 'DAYOUT' ? selectedRoom.pricePerDayoutLKR : selectedRoom.pricePerNightLKR)
    : (bookingType === 'DAYOUT' ? property.pricePerDayoutLKR : property.pricePerNightLKR);

  const baseTotal = unitRate * durationDays;
  const taxes = Math.round(baseTotal * 0.10);
  const platformFee = 1200;
  const subtotal = baseTotal + taxes + platformFee;
  const finalTotal = Math.max(0, subtotal - discountApplied);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'DAYOUT15' || code === 'CEYLON15') {
      const disc = Math.round(baseTotal * 0.15);
      setDiscountApplied(disc);
      setCouponSuccess('15% discount applied successfully!');
      setCouponError('');
    } else if (code === 'FIRSTBOOKING') {
      setDiscountApplied(2500);
      setCouponSuccess('LKR 2,500 welcome discount applied!');
      setCouponError('');
    } else {
      setCouponError('Invalid promo code. Try "DAYOUT15" or "FIRSTBOOKING"');
      setCouponSuccess('');
      setDiscountApplied(0);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    addReview({
      propertyId: property.id,
      rating: newReviewRating,
      cleanlinessRating: 5,
      locationRating: 5,
      valueRating: 5,
      serviceRating: 5,
      comment: newReviewComment,
    });

    setNewReviewComment('');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col relative selection:bg-emerald-500 selection:text-white">
      
      {/* 3D Atmospheric Background Luminous Spheres */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-amber-100/30 blur-3xl" />
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          router.push('/');
        }}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-6">
        
        {/* Navigation Breadcrumb Bar & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link 
              href="/" 
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs text-slate-700 hover:text-emerald-700 hover:shadow-xs transition-all font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600" /> Back to Explore Stays
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-bold text-slate-700">{property.city}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-emerald-700 font-extrabold truncate max-w-[200px]">{property.title}</span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Booking.com Sync Status Pill */}
            {property.bookingComSyncEnabled && (
              <span className="flex items-center gap-1.5 text-xs text-sky-700 font-bold bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/90 shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-sky-600" /> Booking.com Synced
              </span>
            )}

            {/* Share Link Button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs text-slate-700 hover:text-emerald-700 hover:bg-white transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Share Page Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(property.id)}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isWishlisted 
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm' 
                  : 'bg-white/80 backdrop-blur-md border-white/90 text-slate-700 hover:text-rose-500 shadow-2xs hover:bg-white'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated WhatsApp Quick Link Banner (Direct 1-Click Chat) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-[0_12px_30px_rgba(16,185,129,0.28)] border-2 border-emerald-400/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner">
              <MessageCircle className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/25 px-2.5 py-0.5 rounded-full inline-block">
                  WhatsApp Direct Quick Link
                </span>
                <span className="text-xs font-bold text-emerald-100">
                  ක්ලික් කර කෙලින්ම Chat කරන්න
                </span>
              </div>
              <p className="font-black text-sm sm:text-base leading-snug mt-1">
                📲 WhatsApp Quick Link : <span className="underline decoration-white/50">{whatsappNumber}</span>
              </p>
              <p className="text-xs text-emerald-100 font-medium">
                වැඩි විස්තර සහ Booking සඳහා Call හෝ WhatsApp කරන්න: ☎️ {mainPhone} {secondPhone ? `/ ☎️ ${secondPhone}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-center sm:justify-end">
            <a
              href={whatsappChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-200"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              <span>Click to Chat on WhatsApp (Quick Link)</span>
            </a>
            <a
              href={`tel:${mainPhone}`}
              className="px-4 py-3 bg-emerald-900/60 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-2xl border border-white/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call: {mainPhone}</span>
            </a>
          </div>
        </div>

        {/* Special Promo Banner if available */}
        {property.specialPromoBanner && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 text-white shadow-[0_12px_30px_rgba(16,185,129,0.25)] border border-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 text-xl shadow-xs">
                🔥
              </span>
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/25 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Special Verified Deal
                </span>
                <p className="font-black text-sm sm:text-base leading-snug">
                  {property.specialPromoBanner}
                </p>
              </div>
            </div>

            <a
              href={whatsappChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-white text-emerald-900 font-extrabold text-xs rounded-2xl hover:bg-emerald-50 shadow-md flex items-center justify-center gap-2 transition-all flex-shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        )}

        {/* Hero Title & Location Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs rounded-full shadow-xs">
                {property.category}
              </span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {property.address}, {property.city} ({property.district} District)
              </span>
            </div>

            {/* Direct Contact Numbers & Fast Inquiries */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${mainPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black hover:bg-emerald-100 transition-all shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call: {mainPhone}</span>
              </a>
              {secondPhone && (
                <a
                  href={`tel:${secondPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold hover:bg-slate-100 transition-all shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>{secondPhone}</span>
                </a>
              )}
              <a
                href={whatsappChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-500 transition-all shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp Quick Link</span>
              </a>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-emerald-800/90 leading-relaxed bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
            {property.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1 border-t border-slate-200/60">
            <span className="flex items-center gap-1.5 font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {property.rating} ({property.reviewCount} verified reviews)
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">Hosted by <strong className="text-slate-900">{property.ownerName}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Verified Ceylon DayOuts Listing
            </span>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.04)] space-y-3">
          <div className="h-80 sm:h-[460px] w-full rounded-2xl overflow-hidden shadow-md relative bg-slate-100">
            <img 
              src={property.images[activeImageIndex] || property.featuredImage} 
              alt={property.title} 
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute bottom-4 right-4 bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              Photo {activeImageIndex + 1} of {property.images.length || 1}
            </div>
          </div>

          {property.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-24 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx 
                      ? 'border-emerald-600 scale-105 shadow-md ring-2 ring-emerald-500/20' 
                      : 'border-white/80 opacity-70 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main 2-Column Grid: Details & Sticky 3D Booking Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left 2 Columns: Description, Package Inclusions, Cabana Units, Amenities, Rules, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SEPARATE Dayout Package Inclusions Highlight Box */}
            {property.dayoutPackage && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/40 border border-amber-300/80 shadow-[0_15px_35px_rgba(245,158,11,0.12)] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-black bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full tracking-wider">
                        🌞 Featured Dayout Package
                      </span>
                      <span className="text-xs font-bold text-amber-800">
                        {property.dayoutPackage.timeSlot}
                      </span>
                    </div>
                    <h3 className="font-black text-amber-950 text-xl flex items-center gap-2">
                      <Sun className="w-6 h-6 fill-amber-500 text-amber-500" />
                      {property.dayoutPackage.title}
                    </h3>
                  </div>

                  {/* Highlighted Per-Person Price Display */}
                  <div className="sm:text-right bg-white/80 p-3 rounded-2xl border border-amber-200 shadow-2xs self-start sm:self-auto">
                    <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                      Per Person Rate
                    </span>
                    <div className="text-2xl font-black text-amber-950">
                      LKR {property.dayoutPackage.pricePerPersonLKR.toLocaleString()}
                      <span className="text-xs font-bold text-amber-700"> / person</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Min {property.dayoutPackage.minGuests} Guests (Total: LKR {(property.dayoutPackage.pricePerPersonLKR * property.dayoutPackage.minGuests).toLocaleString()})
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Package Inclusions & Benefits (පැකේජයට ඇතුලත් දේවල්):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.dayoutPackage.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-amber-950 font-bold bg-white/85 p-2.5 rounded-xl border border-amber-200/60 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-500/10 p-4 rounded-2xl border border-amber-200">
                  <p className="text-xs text-amber-900 font-semibold">
                    Want to book this Dayout package? Click below to instantly calculate your group total:
                  </p>
                  <button
                    onClick={() => {
                      setBookingType('DAYOUT');
                      setGuests(property.dayoutPackage?.minGuests || 10);
                      const el = document.getElementById('booking-widget-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    <Sun className="w-4 h-4 fill-slate-950" />
                    <span>Select Dayout Package</span>
                  </button>
                </div>
              </div>
            )}

            {/* Multi-Floor & Room Package Breakdown (For Upper Floor / Ground Floor Properties) */}
            {property.floorSections && property.floorSections.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.04)] space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">
                      Floor-by-Floor Packages & Rates
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      (මහල් අනුව වෙන වෙනම කාමර සහ පැකේජ විස්තර)
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Floor Accommodation & Pricing Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose from spacious group rooms on the Upper Floor with kitchen facilities, or standard ground floor rooms.
                  </p>
                </div>

                <div className="space-y-6">
                  {property.floorSections.map((floor, fIdx) => (
                    <div key={fIdx} className="bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        <div>
                          <h4 className="font-black text-base text-slate-900">{floor.floorName}</h4>
                          <p className="text-xs text-slate-500 font-medium">{floor.subtitle}</p>
                        </div>
                        {floor.badge && (
                          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                            {floor.badge}
                          </span>
                        )}
                      </div>

                      {/* Floor Facilities */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                          Floor Facilities:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {floor.facilities.map((fac, facIdx) => (
                            <span key={facIdx} className="text-xs font-semibold bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {fac}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Packages for different guest numbers */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                          Package Pricing Options:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {floor.packages.map((pkg, pIdx) => (
                            <div key={pIdx} className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                                  {pkg.groupTitle}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-1">
                                {pkg.options.map((opt, optIdx) => (
                                  <div key={optIdx} className="p-2 bg-white rounded-lg border border-slate-200/70 text-xs">
                                    <div className="text-[10px] font-bold text-slate-500 leading-tight">
                                      {opt.name}
                                    </div>
                                    <div className="font-black text-emerald-700 pt-0.5">
                                      Rs. {opt.priceLKR.toLocaleString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Extra Guests Notice */}
                  {property.extraGuestFeeLKR && (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
                      <span className="text-xl">💡</span>
                      <p className="text-xs text-emerald-950 font-bold">
                        <strong>Extra Guests Notice:</strong> Add an extra person to any group for just <span className="text-emerald-700 font-black">Rs. {property.extraGuestFeeLKR.toLocaleString()}</span> per guest!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Booking & Direct WhatsApp Contact Showcase Card */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/30 shadow-[0_12px_30px_rgba(16,185,129,0.12)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
                <div>
                  <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100/90 px-3 py-0.5 rounded-full inline-block mb-1">
                    Direct Contact & WhatsApp Quick Link
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    වැඩි විස්තර සහ Booking සඳහා අමතන්න:
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    ගොඩක්ම සාධාරණ මිල ගණන් සමගින් ඔයාලගේ නිවාඩුවත් නිදහසේ ගත කරන්න දැන්ම ඔයාලගේ දවසත් වෙන් කරගන්න.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* WhatsApp Quick Link */}
                <a
                  href={whatsappChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-7 h-7 fill-white" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-100 uppercase tracking-widest block font-bold">
                        WhatsApp Quick Link
                      </span>
                      <span className="text-sm sm:text-base font-black text-white block">
                        📲 WhatsApp : {whatsappNumber}
                      </span>
                      <span className="text-xs text-emerald-100 block">
                        ක්ලික් කර කෙලින්ම WhatsApp Chat කරන්න
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Phone Call Hotlines */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Direct Calling Numbers (Call Now)
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={`tel:${mainPhone}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 font-black text-xs border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-2xs"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-600" />
                      <span>☎️ {mainPhone}</span>
                    </a>
                    {secondPhone && (
                      <a
                        href={`tel:${secondPhone}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 font-black text-xs border border-slate-200 flex items-center justify-center gap-2 transition-all shadow-2xs"
                      >
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>☎️ {secondPhone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cabana Units & Pods Architecture (Single Business Listing with Multi-Units) */}
            {property.rooms && property.rooms.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.04)] space-y-4">
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Independent Units & Cabanas</span>
                  <h3 className="text-lg font-black text-slate-900">
                    Cabana Units & Pods ({property.rooms.length} Units Available)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Book individual pods/cabanas or reserve the whole property complex together.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.rooms.map(unit => {
                    const isSelected = selectedRoomId === unit.id;
                    return (
                      <div
                        key={unit.id}
                        onClick={() => setSelectedRoomId(unit.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'bg-white/80 border-slate-200/80 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm text-slate-900">{unit.name}</h4>
                          {isSelected && (
                            <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                              Selected
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2">{unit.description}</p>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-400">Max {unit.maxGuests} Guests</span>
                          <span className="text-emerald-700 font-extrabold">
                            LKR {(bookingType === 'DAYOUT' ? unit.pricePerDayoutLKR : unit.pricePerNightLKR).toLocaleString()}
                            <span className="text-[10px] text-slate-400 font-normal">/{bookingType === 'DAYOUT' ? 'day' : 'night'}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description & Overview */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.04)] space-y-3">
              <h3 className="text-lg font-black text-slate-900">About this Experience</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.04)] space-y-4">
              <h3 className="text-lg font-black text-slate-900">Featured Amenities & Facilities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-white/90 shadow-2xs text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies & Rules */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.04)] space-y-4">
              <h3 className="text-lg font-black text-slate-900">Stay & Dayout Policies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 shadow-2xs space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase text-[10px]">Dayout Hours</span>
                  <p className="font-bold text-slate-800">09:00 AM - 05:30 PM (Evening Departure)</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 shadow-2xs space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase text-[10px]">Overnight Check-In / Check-Out</span>
                  <p className="font-bold text-slate-800">Check-in: 02:00 PM • Check-out: 11:00 AM</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 shadow-2xs space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase text-[10px]">Cancellation Terms</span>
                  <p className="font-bold text-slate-800">Free cancellation up to 48 hours prior to check-in.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 shadow-2xs space-y-1">
                  <span className="font-extrabold text-slate-400 uppercase text-[10px]">Channel Manager Sync</span>
                  <p className="font-bold text-sky-700">Real-time calendar updates with Booking.com iCal.</p>
                </div>
              </div>
            </div>

            {/* Verified Reviews Section */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.04)] space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Guest Reviews</h3>
                  <p className="text-xs text-slate-500">Verified travelers who booked on Ceylon DayOuts</p>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 font-black text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {property.rating} ({propertyReviews.length} reviews)
                </div>
              </div>

              {/* Review Feed */}
              <div className="space-y-4">
                {propertyReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet for this listing. Be the first to share your experience!</p>
                ) : (
                  propertyReviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-white/80 border border-white/90 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-black text-slate-900">{rev.userName}</p>
                            <p className="text-[10px] text-slate-400">{rev.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Leave a Review Form */}
              <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-slate-200/60 space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Leave a Review</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share details of your experience, food quality, changing rooms, and pool cleanliness..."
                  className="w-full p-3 rounded-2xl border border-slate-200/80 bg-white/90 text-xs font-medium focus:outline-emerald-500"
                />
                <button
                  type="submit"
                  className="btn-3d-emerald text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  Submit Verified Review
                </button>
              </form>

            </div>

          </div>

          {/* Right Column: Sticky 3D Booking & Checkout Widget */}
          <div className="lg:col-span-1">
            <div id="booking-widget-section" className="sticky top-24 glass-card-3d rounded-3xl p-6 border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] space-y-5">
              
              {/* Price Header */}
              <div className="pb-4 border-b border-slate-200/60">
                <span className="text-xs text-slate-400 uppercase font-extrabold tracking-wider block">Total Reservation Rate</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-emerald-700">
                    LKR {finalTotal.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">all inclusive</span>
                </div>
              </div>

              {/* Selected Cabana Unit Indicator */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-white/90 shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Selected Booking Unit</span>
                <p className="text-xs font-black text-slate-900 line-clamp-1">{roomName}</p>
              </div>

              {/* Cabana Unit Dropdown */}
              {property.rooms && property.rooms.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Select Specific Cabana Unit
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200/80 bg-white/90 text-xs font-bold text-slate-800"
                  >
                    {property.rooms.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} (LKR {(bookingType === 'DAYOUT' ? unit.pricePerDayoutLKR : unit.pricePerNightLKR).toLocaleString()}/{bookingType === 'DAYOUT' ? 'day' : 'night'})
                      </option>
                    ))}
                    <option value="WHOLE_PROPERTY">
                      Entire Business Complex / All Cabanas Combined (LKR {(bookingType === 'DAYOUT' ? property.pricePerDayoutLKR : property.pricePerNightLKR).toLocaleString()})
                    </option>
                  </select>
                </div>
              )}

              {/* Booking Type Switcher */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl border border-white/80">
                <button
                  onClick={() => setBookingType('DAYOUT')}
                  className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    bookingType === 'DAYOUT'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_2px_8px_rgba(245,158,11,0.25)]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Day Pass
                </button>
                <button
                  onClick={() => setBookingType('NIGHT_STAY')}
                  className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    bookingType === 'NIGHT_STAY'
                      ? 'btn-3d-emerald text-white shadow-[0_2px_8px_rgba(16,185,129,0.25)]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MoonStar className="w-3.5 h-3.5" /> Night Stay
                </button>
              </div>

              {/* Date Range Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Booking Date Range
                  </label>
                  <span className="text-[10px] font-black bg-white/90 text-emerald-800 px-2 py-0.5 rounded-full border border-white/90 shadow-2xs">
                    {durationDays} {durationDays === 1 ? (bookingType === 'DAYOUT' ? 'Day Pass' : 'Night') : (bookingType === 'DAYOUT' ? 'Days' : 'Nights')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Check-In</span>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => {
                        setCheckInDate(e.target.value);
                        if (bookingType === 'DAYOUT') setCheckOutDate(e.target.value);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200/80 bg-white/90 text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Check-Out</span>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200/80 bg-white/90 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Guests Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" /> Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 bg-white/90 text-xs font-bold text-slate-800"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Coupon Code Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. DAYOUT15 or FIRSTBOOKING"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-200/80 bg-white/90 text-xs font-bold uppercase placeholder:normal-case placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-extrabold hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                  >
                    Apply
                  </button>
                </div>
                {couponSuccess && <p className="text-[10px] text-emerald-600 font-bold">{couponSuccess}</p>}
                {couponError && <p className="text-[10px] text-rose-500 font-bold">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-3 border-t border-slate-200/60 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Unit Rate ({durationDays} {bookingType === 'DAYOUT' ? 'Day' : 'Night'})</span>
                  <span>LKR {baseTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes & Tourism Levy (10%)</span>
                  <span>LKR {taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Service Fee</span>
                  <span>LKR {platformFee.toLocaleString()}</span>
                </div>
                {discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Coupon</span>
                    <span>- LKR {discountApplied.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200/60 text-slate-900">
                  <span>Total Amount Due</span>
                  <span>LKR {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => setCheckoutData({
                  property,
                  bookingType,
                  checkIn: checkInDate,
                  checkOut: checkOutDate,
                  guests,
                  roomName,
                  roomId: selectedRoomId,
                  basePriceLKR: baseTotal,
                  taxesLKR: taxes,
                  platformFeeLKR: platformFee,
                  discountLKR: discountApplied,
                  totalPriceLKR: finalTotal,
                  couponCode: discountApplied > 0 ? couponCode : undefined,
                })}
                className="w-full py-4 btn-3d-emerald text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Proceed to Secure Checkout
              </button>

              <p className="text-[10px] text-center text-slate-400 font-medium">
                🔒 Instant confirmation • Pay via PayHere, Card or Bank Transfer
              </p>

              {/* Direct WhatsApp & Host Phone Quick Contact Card */}
              <div className="pt-3 border-t border-slate-200/60 space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider block">
                  Direct Host Inquiries & WhatsApp
                </span>
                <a
                  href={whatsappChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp ({whatsappNumber})</span>
                </a>
                <div className="flex gap-2">
                  <a
                    href={`tel:${mainPhone}`}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200/80 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{mainPhone}</span>
                  </a>
                  {secondPhone && (
                    <a
                      href={`tel:${secondPhone}`}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200/80 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>{secondPhone}</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* Mobile Sticky Booking Footer Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-white/90 backdrop-blur-xl border-t border-white/80 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] z-40 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
            Total Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-emerald-700">
              LKR {finalTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              /{bookingType === 'DAYOUT' ? 'day' : 'night'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md flex items-center justify-center gap-1.5 text-xs font-black"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp</span>
          </a>
          <button
            onClick={() => {
              const widget = document.getElementById('booking-widget-section');
              if (widget) {
                widget.scrollIntoView({ behavior: 'smooth' });
              } else {
                setCheckoutData({
                  property,
                  bookingType,
                  checkIn: checkInDate,
                  checkOut: checkOutDate,
                  guests,
                  roomName,
                  roomId: selectedRoomId,
                  basePriceLKR: baseTotal,
                  taxesLKR: taxes,
                  platformFeeLKR: platformFee,
                  discountLKR: discountApplied,
                  totalPriceLKR: finalTotal,
                  couponCode: discountApplied > 0 ? couponCode : undefined,
                });
              }
            }}
            className="btn-3d-emerald text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" /> Book Now
          </button>
        </div>
      </div>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={whatsappChatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-8 right-6 z-50 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_8px_25px_rgba(16,185,129,0.45)] border-2 border-white/60 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer"
        title="Direct WhatsApp Quick Link"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lime-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lime-400 rounded-full" />
        </div>
        <span className="font-black text-xs tracking-tight shadow-xs pr-1">
          WhatsApp Chat
        </span>
      </a>

      {/* Checkout & Payment Gateway Modal */}
      {checkoutData && (
        <CheckoutModal
          bookingData={checkoutData}
          onClose={() => setCheckoutData(null)}
          onSuccess={() => {
            setCheckoutData(null);
            router.push('/');
          }}
        />
      )}

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Footer (Light Frosted 3D Glass) */}
      <footer className="mt-auto border-t border-white/80 bg-white/70 backdrop-blur-xl py-12 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-[0_4px_12px_rgba(16,185,129,0.3)] border-t border-white/40">
                  <Palmtree className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Ceylon<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">DayOuts</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Sri Lanka&apos;s premier dayuse, resort pass, and staycation booking platform.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
              <Link href="/" className="hover:text-emerald-700 transition-colors">Explore Stays</Link>
              <span>•</span>
              <span className="text-sky-700 font-bold flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Booking.com iCal Connected</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> PayHere Webhooks</span>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <p>© 2026 Ceylon DayOuts Sri Lanka. All Rights Reserved.</p>
            <p>PayHere Gateway • Stripe • Visa / Mastercard • 2-Way iCal Webhooks</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
