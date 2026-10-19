'use client';

import React from 'react';
import Link from 'next/link';
import { Property } from '@/types/dayout';
import { useApp } from '@/context/AppContext';
import { 
  Heart, 
  Star, 
  MapPin, 
  Sun, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { wishlist, toggleWishlist, filters } = useApp();
  const isWishlisted = wishlist.includes(property.id);

  const displayPrice = filters.bookingType === 'NIGHT_STAY' 
    ? property.pricePerNightLKR 
    : property.pricePerDayoutLKR;

  const priceLabel = filters.bookingType === 'NIGHT_STAY' ? '/ night' : '/ dayout pass';

  return (
    <Link 
      href={`/property/${property.id}`}
      onClick={() => onSelect?.(property)}
      className="group block glass-card-3d rounded-3xl overflow-hidden flex flex-col h-full cursor-pointer select-none text-left no-underline"
    >
      
      {/* Property Image & Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img 
          src={property.featuredImage} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20 pointer-events-none" />

        {/* Category Pill (Frosted 3D Glass) */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-black px-3 py-1 rounded-full border border-white/90 shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
          {property.category}
        </span>

        {/* Booking.com Sync Badge */}
        {property.bookingComSyncEnabled && (
          <span className="absolute top-3 left-28 bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-[0_4px_10px_rgba(14,165,233,0.2)] border border-white/40 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin-slow" /> Booking.com Synced
          </span>
        )}

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(property.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/80 z-10 cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-500 text-white' 
              : 'bg-white/85 text-slate-700 hover:text-rose-500 hover:bg-white'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Dayout Package Inclusions Pill */}
        {property.dayoutPackage && (
          <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-r from-amber-400/95 to-amber-500/95 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center justify-between shadow-[0_4px_12px_rgba(245,158,11,0.25)] backdrop-blur-md border border-white/40">
            <span className="flex items-center gap-1.5 truncate">
              <Sun className="w-3.5 h-3.5 fill-slate-950" />
              {property.dayoutPackage.timeSlot}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-black bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md shadow-xs">
              Buffet + Pool
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* City & Rating Header */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {property.city}, {property.district}
            </span>

            <div className="flex items-center gap-1 bg-amber-50/80 px-2 py-0.5 rounded-lg border border-amber-200/60 shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-amber-800">{property.rating}</span>
              <span className="text-slate-400 text-[10px]">({property.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-black text-base text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {property.title}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {property.tagline}
          </p>

          {/* Key Amenities */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {property.amenities.slice(0, 3).map(amenity => (
              <span key={amenity} className="text-[10px] font-bold bg-slate-100/80 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200/50">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[10px] font-bold text-slate-400 self-center">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing Footer */}
        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">
                LKR {displayPrice.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {priceLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="btn-3d-emerald text-white text-xs font-black rounded-xl px-3.5 py-2.5 shadow-md flex items-center gap-1.5 group/btn cursor-pointer">
              View & Book 
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

      </div>

    </Link>
  );
};

