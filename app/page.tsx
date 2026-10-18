'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { HeroSearch } from '@/components/HeroSearch';
import { CategorySelector } from '@/components/CategorySelector';
import { PropertyCard } from '@/components/PropertyCard';
import { MapView } from '@/components/MapView';
import { CheckoutModal } from '@/components/CheckoutModal';
import { HostDashboard } from '@/components/HostDashboard';
import { AdminPanel } from '@/components/AdminPanel';
import { UserProfile } from '@/components/UserProfile';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { Property, Booking } from '@/types/dayout';
import { useRouter } from 'next/navigation';
import { 
  LayoutGrid, 
  MapPin, 
  Palmtree, 
  Sparkles, 
  Sun, 
  ShieldCheck, 
  Heart, 
  RefreshCw, 
  SearchX 
} from 'lucide-react';

function CeylonDayOutsAppContent() {
  const router = useRouter();
  const { filteredProperties, filters, resetFilters, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'WISHLIST' | 'MY_BOOKINGS' | 'HOST_DASHBOARD' | 'ADMIN_PANEL'>('EXPLORE');
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP'>('GRID');
  
  // Navigation handler to dedicated property page
  const handleSelectProperty = (property: Property) => {
    router.push(`/property/${property.id}`);
  };
  
  // Checkout modal state (for quick checkout)
  const [checkoutData, setCheckoutData] = useState<{
    property: Property;
    bookingType: 'DAYOUT' | 'NIGHT_STAY';
    checkIn: string;
    checkOut: string;
    guests: number;
    basePriceLKR: number;
    taxesLKR: number;
    platformFeeLKR: number;
    discountLKR: number;
    totalPriceLKR: number;
    couponCode?: string;
  } | null>(null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white relative">
      
      {/* 3D Atmospheric Background Luminous Spheres */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-amber-100/30 blur-3xl" />
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-8">
        
        {/* VIEW 1: EXPLORE PAGE */}
        {activeTab === 'EXPLORE' && (
          <div className="space-y-8 animate-in fade-in">
            
            {/* Hero Search */}
            <HeroSearch />

            {/* Core Categories Selector */}
            <CategorySelector />

            {/* Results Control Header (Grid vs Map View Toggle) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  Featured Dayout & Staycation Spots
                  <span className="text-xs font-black bg-white/90 text-emerald-800 px-3 py-1 rounded-full border border-white/90 shadow-[0_2px_8px_rgba(16,185,129,0.1),inset_0_1px_0_rgba(255,255,255,1)]">
                    {filteredProperties.length} Properties Found
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  {filters.city !== 'All Cities' ? `Showing available stays in ${filters.city}` : 'Top rated resorts, beach villas, and treehouses across Sri Lanka'}
                </p>
              </div>

              {/* Grid vs Map Toggle Pills (3D Glass Segmented Control) */}
              <div className="flex items-center gap-1.5 bg-slate-200/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] self-start sm:self-auto">
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'GRID'
                      ? 'bg-white text-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,1)] border border-emerald-100/60 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Grid View
                </button>

                <button
                  onClick={() => setViewMode('MAP')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'MAP'
                      ? 'bg-white text-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,1)] border border-emerald-100/60 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" /> Interactive Map
                </button>
              </div>
            </div>

            {/* Grid View vs Map View Rendering */}
            {viewMode === 'MAP' ? (
              <MapView
                properties={filteredProperties}
                onSelectProperty={handleSelectProperty}
                bookingType={filters.bookingType === 'ALL' ? 'DAYOUT' : filters.bookingType}
              />
            ) : filteredProperties.length === 0 ? (
              <div className="p-16 text-center glass-panel rounded-3xl border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
                <SearchX className="w-12 h-12 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800">No properties match your filter criteria</h3>
                  <p className="text-xs text-slate-400">Try adjusting your price range, selected city, or category.</p>
                </div>
                <button
                  onClick={resetFilters}
                  className="btn-3d-emerald text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={handleSelectProperty}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: WISHLIST */}
        {activeTab === 'WISHLIST' && (
          <UserProfile
            activeSection="WISHLIST"
            onSelectProperty={handleSelectProperty}
          />
        )}

        {/* VIEW 3: MY BOOKINGS */}
        {activeTab === 'MY_BOOKINGS' && (
          <UserProfile
            activeSection="MY_BOOKINGS"
            onSelectProperty={handleSelectProperty}
          />
        )}

        {/* VIEW 4: HOST DASHBOARD */}
        {activeTab === 'HOST_DASHBOARD' && (
          <HostDashboard />
        )}

        {/* VIEW 5: ADMIN PANEL */}
        {activeTab === 'ADMIN_PANEL' && (
          <AdminPanel />
        )}

      </main>

      {/* Checkout & Payment Gateway Modal */}
      {checkoutData && (
        <CheckoutModal
          bookingData={checkoutData}
          onClose={() => setCheckoutData(null)}
          onSuccess={() => {
            setActiveTab('MY_BOOKINGS');
          }}
        />
      )}

      {/* Web Push Notifications Drawer */}
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
                Sri Lanka&apos;s leading dayuse, resort pass, and staycation booking engine with Booking.com Channel Manager synchronization.
              </p>
            </div>

            {/* Standard Categories Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-600 font-medium">
              <div>
                <p className="font-extrabold uppercase text-slate-900 mb-2">Categories</p>
                <ul className="space-y-1.5">
                  <li className="hover:text-emerald-700 transition-colors cursor-pointer">Hotels & Resorts</li>
                  <li className="hover:text-emerald-700 transition-colors cursor-pointer">Private Villas</li>
                  <li className="hover:text-emerald-700 transition-colors cursor-pointer">Eco Cabanas</li>
                </ul>
              </div>

              <div>
                <p className="font-extrabold uppercase text-slate-900 mb-2">Unique Stays</p>
                <ul className="space-y-1.5">
                  <li className="hover:text-emerald-700 transition-colors cursor-pointer">Heritage Cottages</li>
                  <li className="hover:text-emerald-700 transition-colors cursor-pointer">Glamping Tents</li>
                  <li className="hover:text-emerald-700 transition-colors cursor-pointer">Negombo Houseboats</li>
                </ul>
              </div>

              <div>
                <p className="font-extrabold uppercase text-slate-900 mb-2">Integrations</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-1.5 text-sky-700 font-bold"><RefreshCw className="w-3.5 h-3.5" /> Booking.com iCal API</li>
                  <li className="flex items-center gap-1.5 text-emerald-700 font-bold"><ShieldCheck className="w-3.5 h-3.5" /> PayHere Webhooks</li>
                </ul>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <p>© 2026 Ceylon DayOuts Sri Lanka. All Rights Reserved.</p>
            <p className="flex items-center gap-2">
              <span>PayHere Gateway</span> • <span>Stripe</span> • <span>Visa / Mastercard</span> • <span>2-Way iCal Webhooks</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function Home() {
  return <CeylonDayOutsAppContent />;
}
