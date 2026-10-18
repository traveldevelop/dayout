'use client';

import React, { useState } from 'react';
import { Property, Booking } from '@/types/dayout';
import { useApp } from '@/context/AppContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Sun, 
  MoonStar, 
  Download, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  bookingData: {
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
  };
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  bookingData,
  onClose,
  onSuccess,
}) => {
  const { createBooking, currentUser } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'PAYHERE' | 'STRIPE' | 'BANK_TRANSFER'>('PAYHERE');
  const [guestName, setGuestName] = useState(currentUser.name);
  const [guestEmail, setGuestEmail] = useState(currentUser.email);
  const [guestPhone, setGuestPhone] = useState(currentUser.phone);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const handlePayAndConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate PayHere/Stripe Payment Webhook handshake & processing delay
    await new Promise(r => setTimeout(r, 1800));

    const methodNames = {
      PAYHERE: 'PayHere Gateway (Visa/Mastercard/mCash)',
      STRIPE: 'Stripe Global Card Payment',
      BANK_TRANSFER: 'Bank Transfer / Pay at Venue'
    };

    const newBooking = createBooking({
      propertyId: bookingData.property.id,
      propertyTitle: bookingData.property.title,
      propertyImage: bookingData.property.featuredImage,
      propertyCategory: bookingData.property.category,
      city: bookingData.property.city,
      roomId: bookingData.roomId,
      roomName: bookingData.roomName,
      bookingType: bookingData.bookingType,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      dayoutPackageTitle: bookingData.property.dayoutPackage?.title,
      basePriceLKR: bookingData.basePriceLKR,
      taxesLKR: bookingData.taxesLKR,
      platformFeeLKR: bookingData.platformFeeLKR,
      discountLKR: bookingData.discountLKR,
      totalPriceLKR: bookingData.totalPriceLKR,
      userName: guestName,
      userEmail: guestEmail,
      userPhone: guestPhone,
      status: 'CONFIRMED',
      paymentStatus: paymentMethod === 'BANK_TRANSFER' ? 'UNPAID' : 'PAID',
      paymentMethod: methodNames[paymentMethod],
      specialRequests,
    });

    setIsProcessing(false);
    setCreatedBooking(newBooking);

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti error', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative bg-white/95 backdrop-blur-2xl w-full max-w-2xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-white/90 overflow-hidden text-slate-900">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-[0_4px_10px_rgba(16,185,129,0.25)] border-t border-white/40">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Secure Checkout</h3>
              <p className="text-[10px] text-slate-400 font-medium">256-bit encrypted SSL checkout</p>
            </div>
          </div>

          {!createdBooking && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Success Confirmation View */}
        {createdBooking ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-widest bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                Booking Confirmed #{createdBooking.id}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                You&apos;re All Set for Ceylon DayOuts!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                A instant booking confirmation and receipt voucher have been emailed to <strong>{createdBooking.userEmail}</strong> and pushed to your notifications.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
                <span>Property:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{createdBooking.propertyTitle}</span>
              </div>
              {createdBooking.roomName && (
                <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400">
                  <span>Booked Unit:</span>
                  <span>{createdBooking.roomName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Date & Package:</span>
                <span>{createdBooking.checkIn} to {createdBooking.checkOut} ({createdBooking.bookingType})</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span>{createdBooking.guests} Guests</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Amount Paid:</span>
                <span>LKR {createdBooking.totalPriceLKR.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSuccess(createdBooking);
                onClose();
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
            >
              View My Bookings Dashboard
            </button>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handlePayAndConfirm} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Booking Summary Header Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={bookingData.property.featuredImage} 
                  alt={bookingData.property.title} 
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-extrabold text-sm line-clamp-1">{bookingData.property.title}</h4>
                  {bookingData.roomName && (
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      Unit: {bookingData.roomName}
                    </span>
                  )}
                  <p className="text-xs text-slate-500 font-medium">{bookingData.property.city} • {bookingData.checkIn} to {bookingData.checkOut}</p>
                  <span className="text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                    {bookingData.bookingType} ({bookingData.guests} Guests)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Total Due</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  LKR {bookingData.totalPriceLKR.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Guest Contact Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                1. Guest Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Phone Number (+94)</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Special Requests (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Birthday cake, poolside table"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options Selection */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                2. Select Payment Method
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PAYHERE')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'PAYHERE'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold shadow-[0_4px_16px_rgba(16,185,129,0.2)] ring-2 ring-emerald-500/30 scale-[1.02]'
                      : 'border-slate-200/80 bg-white/90 text-slate-700 shadow-2xs hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-[9px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Sri Lanka</span>
                  </div>
                  <p className="text-xs font-black">PayHere Gateway</p>
                  <p className="text-[10px] text-slate-400">Visa / Mastercard / eZ Cash</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('STRIPE')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'STRIPE'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold shadow-[0_4px_16px_rgba(16,185,129,0.2)] ring-2 ring-emerald-500/30 scale-[1.02]'
                      : 'border-slate-200/80 bg-white/90 text-slate-700 shadow-2xs hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span className="text-[9px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Global</span>
                  </div>
                  <p className="text-xs font-black">Stripe Card</p>
                  <p className="text-[10px] text-slate-400">International Credit Cards</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('BANK_TRANSFER')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'BANK_TRANSFER'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold shadow-[0_4px_16px_rgba(16,185,129,0.2)] ring-2 ring-emerald-500/30 scale-[1.02]'
                      : 'border-slate-200/80 bg-white/90 text-slate-700 shadow-2xs hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Offline</span>
                  </div>
                  <p className="text-xs font-black">Pay at Venue</p>
                  <p className="text-[10px] text-slate-400">Bank Transfer / Cash at Resort</p>
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 btn-3d-emerald text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing PayHere Webhook Handshake...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay LKR {bookingData.totalPriceLKR.toLocaleString()} & Confirm Booking</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
