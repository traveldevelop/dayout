'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/PropertyCard';
import { Property } from '@/types/dayout';
import { 
  User as UserIcon, 
  CalendarCheck, 
  Heart, 
  Download, 
  MapPin, 
  Sun, 
  MoonStar, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface UserProfileProps {
  activeSection: 'WISHLIST' | 'MY_BOOKINGS';
  onSelectProperty?: (property: Property) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ activeSection, onSelectProperty }) => {
  const { currentUser, bookings, wishlist, properties } = useApp();
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  const myBookings = bookings.filter(b => b.userId === currentUser.id || b.userName === currentUser.name);
  const wishlistedProperties = properties.filter(p => wishlist.includes(p.id));

  const handleDownloadVoucher = (bookingId: string) => {
    setDownloadFeedback(`Voucher for #${bookingId} generated & downloaded successfully!`);
    setTimeout(() => setDownloadFeedback(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col sm:flex-row items-center gap-6 text-slate-900">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-lg"
        />

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black">{currentUser.name}</h1>
            <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase border border-emerald-200/60 shadow-2xs">
              {currentUser.role} Account
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-medium pt-1">
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-emerald-600" /> {currentUser.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-600" /> {currentUser.phone}</span>
          </div>
        </div>

        <div className="flex gap-3 text-center">
          <div className="p-3.5 bg-white/90 rounded-2xl border border-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            <span className="text-lg font-black text-emerald-700 block">{myBookings.length}</span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Bookings</span>
          </div>
          <div className="p-3.5 bg-white/90 rounded-2xl border border-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            <span className="text-lg font-black text-rose-500 block">{wishlist.length}</span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Wishlisted</span>
          </div>
        </div>
      </div>

      {downloadFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {downloadFeedback}
          </span>
          <button onClick={() => setDownloadFeedback(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* SECTION 1: MY BOOKINGS */}
      {activeSection === 'MY_BOOKINGS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-600" /> My Reserved Experiences ({myBookings.length})
            </h2>
          </div>

          {myBookings.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl border border-white/90 shadow-sm space-y-3">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No Reservations Yet</h3>
              <p className="text-xs text-slate-400">Explore pool daypasses, villas, and cottages to book your first staycation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map(bk => (
                <div key={bk.id} className="p-5 glass-card-3d rounded-3xl border border-white/90 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link href={`/property/${bk.propertyId}`} className="flex-shrink-0 group">
                      <img src={bk.propertyImage} alt={bk.propertyTitle} className="w-20 h-20 rounded-2xl object-cover group-hover:scale-105 transition-transform shadow-xs" />
                    </Link>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          #{bk.id} • {bk.bookingType}
                        </span>
                      </div>
                      <Link href={`/property/${bk.propertyId}`} className="font-extrabold text-base line-clamp-1 text-slate-900 hover:text-emerald-700 transition-colors flex items-center gap-1.5 group">
                        {bk.propertyTitle}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      </Link>
                      {bk.roomName && (
                        <p className="text-xs font-black text-amber-700">
                          Unit: {bk.roomName}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 font-medium">
                        {bk.city} • Dates: <strong>{bk.checkIn}</strong> to <strong>{bk.checkOut}</strong> ({bk.guests} Guests)
                      </p>
                      {bk.dayoutPackageTitle && (
                        <p className="text-[11px] text-amber-700 font-bold">
                          ☀️ Package: {bk.dayoutPackageTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount Paid</span>
                      <span className="text-lg font-black text-emerald-700">
                        LKR {bk.totalPriceLKR.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-slate-400">{bk.paymentMethod}</span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        bk.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        ✓ {bk.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDownloadVoucher(bk.id)}
                        className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Voucher Receipt
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: WISHLIST */}
      {activeSection === 'WISHLIST' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Saved Staycations ({wishlistedProperties.length})
            </h2>
          </div>

          {wishlistedProperties.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-400">Click the heart icon on any property to save it to your wishlist for quick booking later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProperties.map(prop => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={onSelectProperty}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
