'use client';

import React, { useState } from 'react';
import { Property, Review } from '@/types/dayout';
import { useApp } from '@/context/AppContext';
import { 
  X, 
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
  Send,
  Lock,
  Clock,
  Utensils,
  Waves,
  MessageSquare
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onProceedToCheckout: (bookingConfig: {
    property: Property;
    bookingType: 'DAYOUT' | 'NIGHT_STAY';
    checkIn: string;
    checkOut: string;
    guests: number;
    roomName?: string;
    basePriceLKR: number;
    taxesLKR: number;
    platformFeeLKR: number;
    discountLKR: number;
    totalPriceLKR: number;
    couponCode?: string;
  }) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onProceedToCheckout,
}) => {
  const { wishlist, toggleWishlist, reviews, addReview, currentUser } = useApp();

  const [bookingType, setBookingType] = useState<'DAYOUT' | 'NIGHT_STAY'>('DAYOUT');
  const [checkInDate, setCheckInDate] = useState<string>('2026-08-12');
  const [checkOutDate, setCheckOutDate] = useState<string>('2026-08-12');
  const [guests, setGuests] = useState<number>(2);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    property.rooms && property.rooms.length > 0 ? property.rooms[0].id : 'WHOLE_PROPERTY'
  );
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Review submission state
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');

  const propertyReviews = reviews.filter(r => r.propertyId === property.id);

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
    if (couponCode.toUpperCase() === 'DAYOUT15' || couponCode.toUpperCase() === 'DAYOUTLK15') {
      const disc = Math.round(baseTotal * 0.15);
      setDiscountApplied(disc);
      setCouponError('');
    } else if (couponCode.toUpperCase() === 'FIRSTBOOKING') {
      setDiscountApplied(2500);
      setCouponError('');
    } else {
      setCouponError('Invalid promo code. Try "DAYOUT15" or "FIRSTBOOKING"');
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

  const isWishlisted = wishlist.includes(property.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative bg-white/95 backdrop-blur-2xl w-full max-w-5xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-white/90 overflow-hidden my-8 text-slate-900">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl px-6 py-4 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 bg-white/90 text-emerald-800 font-black text-xs rounded-full border border-white/90 shadow-xs">
              {property.category}
            </span>
            {property.bookingComSyncEnabled && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                <RefreshCw className="w-3.5 h-3.5" /> Booking.com Synced
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(property.id)}
              className={`p-2.5 rounded-full border border-slate-200 dark:border-slate-800 transition-colors ${
                isWishlisted ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
          
          {/* Main Title & Rating */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <MapPin className="w-4 h-4" />
              {property.address}, {property.city} ({property.district} District)
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {property.title}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-sm">
              <span className="flex items-center gap-1 font-extrabold text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                {property.rating} ({property.reviewCount} verified reviews)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">Hosted by {property.ownerName}</span>
            </div>
          </div>

          {/* Lightbox Gallery Grid */}
          <div className="space-y-3">
            <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-lg relative bg-slate-100 dark:bg-slate-800">
              <img 
                src={property.images[activeImageIndex] || property.featuredImage} 
                alt={property.title} 
                className="w-full h-full object-cover transition-all"
              />
            </div>

            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-emerald-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Gallery thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Layout: Left Info & Right Booking Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Description, Package Inclusions, Amenities, Reviews */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Dayout Package Inclusions Highlight Box */}
              {property.dayoutPackage && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2">
                      <Sun className="w-5 h-5 fill-amber-500 text-amber-500" />
                      {property.dayoutPackage.title}
                    </span>
                    <span className="text-xs font-bold bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full">
                      {property.dayoutPackage.timeSlot}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Min Guests: {property.dayoutPackage.minGuests} | LKR {property.dayoutPackage.pricePerPersonLKR.toLocaleString()} per guest
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-amber-200/60 dark:border-amber-800/50">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Package Inclusions:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {property.dayoutPackage.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Cabana Units Inventory Section (Single Business Entity with Multiple Cabanas) */}
              {property.rooms && property.rooms.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Business Unit Inventory • Managed by {property.ownerName}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Cabana Units & Pods ({property.rooms.length} Units Available)
                      </h3>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold px-2.5 py-1 rounded-full">
                      Single Business Listing
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {property.rooms.map(unit => {
                      const isSelected = selectedRoomId === unit.id;
                      return (
                        <div
                          key={unit.id}
                          onClick={() => setSelectedRoomId(unit.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-600/30'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-400'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white">{unit.name}</span>
                              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-bold">
                                Max {unit.maxGuests} Guests
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{unit.description}</p>
                            {unit.bookingComUnitId && (
                              <span className="text-[10px] text-sky-600 font-bold flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" /> Booking.com ID: {unit.bookingComUnitId}
                              </span>
                            )}
                          </div>

                          <div className="text-left sm:text-right flex-shrink-0 space-y-1">
                            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              LKR {(bookingType === 'DAYOUT' ? unit.pricePerDayoutLKR : unit.pricePerNightLKR).toLocaleString()}
                              <span className="text-[10px] text-slate-400 font-normal"> / {bookingType === 'DAYOUT' ? 'day' : 'night'}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoomId(unit.id);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {isSelected ? '✓ Selected Unit' : 'Select Cabana'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Property Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  About This Experience
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-3">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Amenities & Facilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Guest Reviews */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    Verified Guest Reviews ({propertyReviews.length})
                  </h3>
                  <span className="text-xs font-extrabold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                    ★ {property.rating} Score
                  </span>
                </div>

                {/* Review List */}
                <div className="space-y-3">
                  {propertyReviews.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No reviews yet. Be the first guest to leave a review!</p>
                  ) : (
                    propertyReviews.map(rev => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="text-xs font-bold">{rev.userName}</p>
                              <p className="text-[10px] text-slate-400">{rev.createdAt}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            {rev.rating}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Write Review Form */}
                <form onSubmit={handleReviewSubmit} className="pt-3 p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/80 border border-emerald-200/60 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-emerald-800 dark:text-emerald-300">
                    Write a Verified Review as {currentUser.name}
                  </h4>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className={`text-lg transition-transform ${star <= newReviewRating ? 'text-amber-400 scale-110' : 'text-slate-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Share your experience about the pool, buffet lunch, staff, and cleanliness..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
                    rows={2}
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Review
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Interactive Booking Widget (3D Glass Panel) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 glass-card-3d rounded-3xl p-6 border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] space-y-5">
                
                {/* Price Display */}
                <div className="pb-4 border-b border-slate-200/60">
                  <span className="text-xs text-slate-400 uppercase font-extrabold tracking-wider block">Total Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-emerald-700">
                      LKR {finalTotal.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">all inc.</span>
                  </div>
                </div>

                {/* Selected Cabana Unit Indicator */}
                <div className="p-3.5 rounded-2xl bg-white/90 border border-white/90 shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Selected Booking Unit</span>
                  <p className="text-xs font-black text-slate-900 line-clamp-1">{roomName}</p>
                </div>

                {/* Cabana Unit Dropdown (Single Business with Multiple Cabanas) */}
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

                {/* Date Range Selector: Check-In & Check-Out (Supports 1 Day or Multi-Day Consecutive Stay) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      Booking Date Range
                    </label>
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      {durationDays} {durationDays === 1 ? (bookingType === 'DAYOUT' ? 'Whole Day' : 'Night') : (bookingType === 'DAYOUT' ? 'Consecutive Days' : 'Nights')}
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
                          if (e.target.value > checkOutDate) {
                            setCheckOutDate(e.target.value);
                          }
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Check-Out</span>
                      <input
                        type="date"
                        min={checkInDate}
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                      />
                    </div>
                  </div>

                  {(property.blockedDates?.includes(checkInDate) || property.blockedDates?.includes(checkOutDate)) && (
                    <p className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1">
                      ⚠️ Selected date range contains blocked dates from Booking.com / Host calendar.
                    </p>
                  )}
                </div>

                {/* Guest Count Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" /> Guest Count
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 15].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Promo Code Input */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-bold text-slate-500">Apply Promo Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. DAYOUT15"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
                    >
                      Apply
                    </button>
                  </div>
                  {discountApplied > 0 && (
                    <p className="text-[10px] text-emerald-600 font-bold">
                      ✓ Promo discount of LKR {discountApplied.toLocaleString()} applied!
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[10px] text-rose-500 font-medium">{couponError}</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Rate ({durationDays} {durationDays === 1 ? 'day/night' : 'days/nights'})</span>
                    <span>LKR {baseTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Government Taxes (10%)</span>
                    <span>LKR {taxes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Platform Service Fee</span>
                    <span>LKR {platformFee.toLocaleString()}</span>
                  </div>
                  {discountApplied > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount Coupon</span>
                      <span>- LKR {discountApplied.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                    <span>Total Amount Due</span>
                    <span>LKR {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  disabled={property.blockedDates?.includes(checkInDate) || property.blockedDates?.includes(checkOutDate)}
                  onClick={() => onProceedToCheckout({
                    property,
                    bookingType,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    guests,
                    roomName,
                    basePriceLKR: baseTotal,
                    taxesLKR: taxes,
                    platformFeeLKR: platformFee,
                    discountLKR: discountApplied,
                    totalPriceLKR: finalTotal,
                    couponCode: discountApplied > 0 ? couponCode : undefined,
                  })}
                  className="w-full py-4 btn-3d-emerald text-white font-black text-sm rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Proceed to Secure Checkout
                </button>

                <p className="text-[10px] text-center text-slate-400 font-medium">
                  🔒 Instant confirmation • Pay via PayHere, Card or Bank Transfer
                </p>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
