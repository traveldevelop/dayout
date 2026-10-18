'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SRI_LANKA_CITIES } from '@/lib/mockData';
import { Category } from '@/types/dayout';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Sun, 
  MoonStar, 
  Filter, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface HeroSearchProps {
  onSearchSubmit?: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearchSubmit }) => {
  const { filters, setFilters, resetFilters } = useApp();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const CATEGORY_OPTIONS: { id: Category | 'ALL'; name: string }[] = [
    { id: 'ALL', name: 'All Categories' },
    { id: 'HOTEL', name: 'Hotels & Resorts' },
    { id: 'VILLA', name: 'Private Villas' },
    { id: 'CABANA', name: 'Eco Cabanas' },
    { id: 'COTTAGE', name: 'Heritage Cottages' },
    { id: 'ROOM', name: 'Boutique Rooms' },
    { id: 'UNIQUE', name: 'Unique (Glamping/Treehouses)' },
  ];

  const handleApplyFilter = () => {
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100/70 via-teal-50/80 to-sky-100/60 text-slate-900 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.14)] mb-8 border border-white/90">
      {/* 3D Soft Light Gradient Glow Orbs */}
      <div className="absolute -top-16 -right-16 w-96 h-96 bg-gradient-to-br from-emerald-300/35 to-teal-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-sky-300/30 via-teal-200/25 to-amber-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Headline & Tagline */}
      <div className="relative z-10 max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-white/90 text-emerald-800 text-xs font-bold backdrop-blur-md shadow-[0_2px_8px_rgba(16,185,129,0.1),inset_0_1px_0_rgba(255,255,255,1)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Sri Lanka&apos;s #1 Dayout & Staycation Booking Platform
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900">
          Discover Pool Dayouts, Villas &{' '}
          <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
            Unique Staycations
          </span>
        </h1>
        
        <p className="text-slate-600 text-sm sm:text-base font-medium">
          Instant day passes, luxury resort packages, treehouses, and beachfront villas across Sri Lanka.
        </p>
      </div>

      {/* Main Search Bar Card (3D Frosted Glass Panel) */}
      <div className="relative z-10 glass-panel p-5 sm:p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/90 text-slate-900">
        
        {/* Top Stay Type Pills */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/60 overflow-x-auto">
          <button
            onClick={() => setFilters(prev => ({ ...prev, bookingType: 'ALL' }))}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filters.bookingType === 'ALL'
                ? 'bg-white text-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,1)] border border-emerald-100 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            All Experiences
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, bookingType: 'DAYOUT' }))}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filters.bookingType === 'DAYOUT'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold shadow-[0_4px_12px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            Day Passes & Dayouts
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, bookingType: 'NIGHT_STAY' }))}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filters.bookingType === 'NIGHT_STAY'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold shadow-[0_4px_12px_rgba(13,148,136,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <MoonStar className="w-3.5 h-3.5" />
            Overnight Stays
          </button>
        </div>

        {/* Inputs Grid with 3D Embossed Glass Surfaces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          
          {/* Location Selector */}
          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] hover:border-emerald-300 hover:shadow-[0_4px_12px_rgba(16,185,129,0.08)] transition-all">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" /> Destination / City
            </label>
            <select
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {SRI_LANKA_CITIES.map(city => (
                <option key={city} value={city} className="bg-white text-slate-900">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] hover:border-emerald-300 hover:shadow-[0_4px_12px_rgba(16,185,129,0.08)] transition-all">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3 text-emerald-600" /> Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-white text-slate-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Guests Count */}
          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] hover:border-emerald-300 hover:shadow-[0_4px_12px_rgba(16,185,129,0.08)] transition-all">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-600" /> Guests
            </label>
            <select
              value={filters.guests}
              onChange={(e) => setFilters(prev => ({ ...prev, guests: Number(e.target.value) }))}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map(num => (
                <option key={num} value={num} className="bg-white text-slate-900">
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button & Advanced Filter Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyFilter}
              className="flex-1 btn-3d-emerald text-white font-extrabold text-sm rounded-2xl py-3.5 px-5 flex items-center justify-center gap-2 shadow-lg"
            >
              <Search className="w-4 h-4" />
              Search Dayouts
            </button>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-3.5 bg-white/90 hover:bg-white border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] rounded-2xl text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-0"
              title="More Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Advanced Filters Panel Toggle */}
        {showAdvanced && (
          <div className="mt-5 pt-5 border-t border-slate-200/70 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Refine Search Results</span>
              <button onClick={resetFilters} className="text-xs text-rose-500 font-bold hover:underline cursor-pointer">
                Reset All Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Max Price Slider */}
              <div className="p-3 rounded-2xl bg-white/80 border border-white/90 shadow-xs">
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Max Budget: <span className="font-extrabold text-emerald-700">LKR {filters.maxPrice.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Minimum Rating */}
              <div className="p-3 rounded-2xl bg-white/80 border border-white/90 shadow-xs">
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Minimum Guest Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200/80 bg-white font-bold text-slate-800"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4.5}>4.5+ Star Rated</option>
                  <option value={4.8}>4.8+ Exceptional</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="p-3 rounded-2xl bg-white/80 border border-white/90 shadow-xs">
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Sort Results By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200/80 bg-white font-bold text-slate-800"
                >
                  <option value="POPULAR">Most Popular & Featured</option>
                  <option value="PRICE_LOW">Price: Low to High</option>
                  <option value="PRICE_HIGH">Price: High to Low</option>
                  <option value="RATING">Highest Guest Rating</option>
                </select>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
