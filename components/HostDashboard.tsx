'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Property, Booking, ExternalSync, Category } from '@/types/dayout';
import { SRI_LANKA_CITIES, AMENITIES_LIST } from '@/lib/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  Building2, 
  Plus, 
  Calendar, 
  DollarSign, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles, 
  Palmtree, 
  MapPin, 
  Layers, 
  TrendingUp, 
  KeyRound, 
  Link as LinkIcon,
  ChevronRight,
  Sliders,
  Check
} from 'lucide-react';

export const HostDashboard: React.FC = () => {
  const { 
    currentUser, 
    properties, 
    bookings, 
    syncs, 
    addProperty, 
    updateProperty, 
    updateBookingStatus, 
    triggerBookingComSync, 
    addExternalSync,
    blockPropertyDates 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'NEW_LISTING' | 'CABANA_UNITS' | 'CALENDAR' | 'BOOKINGS' | 'ANALYTICS' | 'CHANNEL_SYNC'>('LISTINGS');
  
  // Filtering host properties
  const hostProperties = properties.filter(p => p.ownerId === currentUser.id || currentUser.role === 'ADMIN' || p.ownerName.includes(currentUser.name));
  const hostPropertyIds = hostProperties.map(p => p.id);
  const hostBookings = bookings.filter(b => hostPropertyIds.includes(b.propertyId));

  // Multi-Cabana Unit Management State
  const [selectedUnitPropId, setSelectedUnitPropId] = useState<string>(hostProperties[0]?.id || 'prop-3');
  const [newUnitName, setNewUnitName] = useState<string>('');
  const [newUnitMaxGuests, setNewUnitMaxGuests] = useState<number>(2);
  const [newUnitDayoutPrice, setNewUnitDayoutPrice] = useState<number>(7500);
  const [newUnitNightPrice, setNewUnitNightPrice] = useState<number>(25000);
  const [newUnitDesc, setNewUnitDesc] = useState<string>('');
  const [newUnitBookingComId, setNewUnitBookingComId] = useState<string>('');
  const [unitSuccessMsg, setUnitSuccessMsg] = useState<string | null>(null);

  // Channel sync state
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [newSyncPropertyId, setNewSyncPropertyId] = useState<string>(hostProperties[0]?.id || '');
  const [newSyncUrl, setNewSyncUrl] = useState<string>('');

  // Listing Onboarding Wizard State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropTagline, setNewPropTagline] = useState('');
  const [newPropCategory, setNewPropCategory] = useState<Category>('VILLA');
  const [newPropCity, setNewPropCity] = useState('Bentota');
  const [newPropAddress, setNewPropAddress] = useState('');
  const [newPropPriceDayout, setNewPropPriceDayout] = useState<number>(8500);
  const [newPropPriceNight, setNewPropPriceNight] = useState<number>(32000);
  const [newPropDayoutTitle, setNewPropDayoutTitle] = useState('Dayout Pass Package');
  const [newPropDayoutSlot, setNewPropDayoutSlot] = useState('09:00 AM - 05:00 PM');
  const [newPropInclusions, setNewPropInclusions] = useState('Welcome Drink, Buffet Lunch, Pool Access, Changing Room, Evening Tea');
  const [newPropImage, setNewPropImage] = useState('https://picsum.photos/seed/newhost/1200/800');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Swimming Pool', 'Wi-Fi', 'Air Conditioning']);

  // Analytics calculation
  const totalEarningsLKR = hostBookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.totalPriceLKR, 0);
  const pendingEarningsLKR = hostBookings.filter(b => b.paymentStatus === 'UNPAID').reduce((sum, b) => sum + b.totalPriceLKR, 0);

  const revenueChartData = [
    { month: 'Mar', revenue: 120000 },
    { month: 'Apr', revenue: 210000 },
    { month: 'May', revenue: 180000 },
    { month: 'Jun', revenue: 290000 },
    { month: 'Jul', revenue: 410000 },
    { month: 'Aug', revenue: totalEarningsLKR || 350000 },
  ];

  const handleSyncNow = async (syncId: string) => {
    setSyncingId(syncId);
    setSyncMessage(null);
    const res = await triggerBookingComSync(syncId);
    setSyncingId(null);
    setSyncMessage(res.message);
  };

  const handleCreateNewSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSyncPropertyId || !newSyncUrl) return;

    const targetProp = hostProperties.find(p => p.id === newSyncPropertyId);
    addExternalSync({
      propertyId: newSyncPropertyId,
      propertyTitle: targetProp?.title || 'Property',
      platformName: 'BOOKING_COM',
      syncUrl: newSyncUrl,
      syncType: 'TWO_WAY',
    });

    setNewSyncUrl('');
    setSyncMessage('Successfully added 2-way Booking.com iCal sync feed!');
  };

  const handleCreateCabanaUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitPropId) return;

    const targetProp = hostProperties.find(p => p.id === selectedUnitPropId);
    if (!targetProp) return;

    const unitCount = (targetProp.rooms?.length || 0) + 1;
    const unitIdStr = `cabana-unit-${targetProp.id}-${unitCount}`;
    const defaultBookingComId = `BC-UNIT-${unitCount * 101}`;

    const newUnit = {
      id: unitIdStr,
      propertyId: targetProp.id,
      name: newUnitName.trim() || `Cabana 0${unitCount} Pod`,
      pricePerDayoutLKR: newUnitDayoutPrice || targetProp.pricePerDayoutLKR,
      pricePerNightLKR: newUnitNightPrice || targetProp.pricePerNightLKR,
      maxGuests: newUnitMaxGuests || 2,
      totalUnits: 1,
      bookingComUnitId: newUnitBookingComId.trim() || defaultBookingComId,
      description: newUnitDesc.trim() || 'Cozy wooden cabana unit with private scenic balcony.',
    };

    const updatedRooms = [...(targetProp.rooms || []), newUnit];
    updateProperty(targetProp.id, { rooms: updatedRooms });

    setNewUnitName('');
    setNewUnitDesc('');
    setNewUnitBookingComId('');
    setUnitSuccessMsg(`✓ Added ${newUnit.name} under business "${targetProp.title}"!`);
    setTimeout(() => setUnitSuccessMsg(null), 4000);
  };

  const handleToggleAmenity = (name: string) => {
    setSelectedAmenities(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const handleCompletePropertyWizard = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addProperty({
      title: newPropTitle || 'New Staycation Property',
      tagline: newPropTagline || 'Luxury dayout experience',
      category: newPropCategory,
      city: newPropCity,
      address: newPropAddress || 'Beach Road, Bentota',
      pricePerDayoutLKR: newPropPriceDayout,
      pricePerNightLKR: newPropPriceNight,
      featuredImage: newPropImage,
      amenities: selectedAmenities,
      dayoutPackage: {
        title: newPropDayoutTitle,
        timeSlot: newPropDayoutSlot,
        pricePerPersonLKR: newPropPriceDayout,
        minGuests: 2,
        inclusions: newPropInclusions.split(',').map(s => s.trim()),
      }
    });

    setActiveTab('LISTINGS');
    setWizardStep(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Host Dashboard Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/30">
              Host Portal
            </span>
            <span className="text-xs text-slate-400">Welcome back, {currentUser.name}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">Property Owner Dashboard</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Manage your listings, dayout packages, calendar availability, and Booking.com channel sync.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('NEW_LISTING')}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-2 self-start md:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Property Listing
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            LKR {totalEarningsLKR.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold">✓ Paid out directly</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Properties</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {hostProperties.length} Properties
          </p>
          <p className="text-[10px] text-slate-400 font-medium">All categories</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {hostBookings.length} Reservations
          </p>
          <p className="text-[10px] text-amber-600 font-bold">
            {hostBookings.filter(b => b.status === 'PENDING').length} Pending Requests
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Channel Manager</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            Booking.com
          </p>
          <p className="text-[10px] text-sky-600 font-bold">✓ 2-Way iCal Feed Active</p>
        </div>

      </div>

      {/* Host Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'LISTINGS', label: 'My Listings', icon: Building2 },
          { id: 'CABANA_UNITS', label: 'Cabana Unit & Inventory Manager', icon: Layers },
          { id: 'NEW_LISTING', label: 'Property Onboarding Wizard', icon: Plus },
          { id: 'CALENDAR', label: 'Availability Calendar Matrix', icon: Calendar },
          { id: 'BOOKINGS', label: 'Reservations & Requests', icon: Clock },
          { id: 'ANALYTICS', label: 'Earnings & Analytics', icon: TrendingUp },
          { id: 'CHANNEL_SYNC', label: 'Booking.com Channel Sync', icon: RefreshCw },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 flex-shrink-0 transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: MY LISTINGS */}
      {activeTab === 'LISTINGS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostProperties.map(prop => (
            <div key={prop.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
                <img src={prop.featuredImage} alt={prop.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {prop.category}
                </span>
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  prop.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {prop.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-600">{prop.city}</span>
                <h3 className="font-extrabold text-base line-clamp-1">{prop.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{prop.tagline}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Dayout Pass</span>
                  <span className="font-black text-emerald-600">LKR {prop.pricePerDayoutLKR.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Night Stay</span>
                  <span className="font-black text-teal-600">LKR {prop.pricePerNightLKR.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link
                  href={`/property/${prop.id}`}
                  className="flex-1 py-2 bg-emerald-50 text-emerald-800 font-extrabold text-xs rounded-xl hover:bg-emerald-100 flex items-center justify-center gap-1 border border-emerald-200/60 shadow-2xs transition-all"
                >
                  View Page
                </Link>
                <button
                  onClick={() => setActiveTab('CALENDAR')}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200"
                >
                  Dates
                </button>
                <button
                  onClick={() => setActiveTab('CHANNEL_SYNC')}
                  className="px-3 py-2 bg-sky-50 dark:bg-sky-950/60 text-sky-600 font-bold text-xs rounded-xl hover:bg-sky-100"
                  title="Channel Sync"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: CABANA UNITS & MULTI-UNIT INVENTORY MANAGER */}
      {activeTab === 'CABANA_UNITS' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Header Explanation Banner */}
          <div className="p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Single Business Entity • Multi-Cabana Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Manage Multiple Cabanas Under One Business Name
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-3xl leading-relaxed">
              If your business runs multiple cabanas or pods (e.g. <i>Ella Cliffside Eco Cabanas</i>), you register <b>one central property business listing</b> on Ceylon DayOuts. Then, add individual cabana units below with custom rates, guest limits, and separate Booking.com iCal sync IDs. Guests can book single cabana units or the entire complex!
            </p>
          </div>

          {/* Business Listing Selector & Add New Cabana Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Form to Add New Cabana Unit */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-600 uppercase">Unit Management</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Add Cabana / Room Unit
                </h3>
              </div>

              {unitSuccessMsg && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-2xl animate-in fade-in">
                  {unitSuccessMsg}
                </div>
              )}

              <form onSubmit={handleCreateCabanaUnit} className="space-y-4 text-xs font-bold">
                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-300">Select Parent Business Listing</label>
                  <select
                    value={selectedUnitPropId}
                    onChange={(e) => setSelectedUnitPropId(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {hostProperties.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-300">Cabana / Unit Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cabana 05 - Waterfall Vista Treehouse"
                    value={newUnitName}
                    onChange={(e) => setNewUnitName(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 dark:text-slate-300">Dayout Price (LKR)</label>
                    <input
                      type="number"
                      required
                      value={newUnitDayoutPrice}
                      onChange={(e) => setNewUnitDayoutPrice(Number(e.target.value))}
                      className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-600 dark:text-slate-300">Night Stay Price (LKR)</label>
                    <input
                      type="number"
                      required
                      value={newUnitNightPrice}
                      onChange={(e) => setNewUnitNightPrice(Number(e.target.value))}
                      className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 dark:text-slate-300">Max Guest Capacity</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={newUnitMaxGuests}
                      onChange={(e) => setNewUnitMaxGuests(Number(e.target.value))}
                      className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-600 dark:text-slate-300">Booking.com Unit ID</label>
                    <input
                      type="text"
                      placeholder="BC-CABANA-105"
                      value={newUnitBookingComId}
                      onChange={(e) => setNewUnitBookingComId(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-300">Cabana Description & Amenities</label>
                  <textarea
                    rows={3}
                    placeholder="Describe unique view, hammock, outdoor jacuzzi, or bamboo decor..."
                    value={newUnitDesc}
                    onChange={(e) => setNewUnitDesc(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Unit to Business Listing
                </button>
              </form>
            </div>

            {/* Right Column: List of Current Cabana Units */}
            <div className="lg:col-span-2 space-y-6">
              {hostProperties
                .filter(p => !selectedUnitPropId || p.id === selectedUnitPropId)
                .map(prop => (
                  <div key={prop.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                          Parent Business Entity • {prop.city}
                        </span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                          {prop.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {prop.rooms?.length || 0} Registered Cabana Units / Pods
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedUnitPropId(prop.id)}
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-extrabold text-xs rounded-xl self-start sm:self-center"
                      >
                        + Add Unit Here
                      </button>
                    </div>

                    {!prop.rooms || prop.rooms.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        No individual cabana units registered yet for this business entity. Use the form on the left to add Cabana 01, Cabana 02, etc.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prop.rooms.map(unit => (
                          <div key={unit.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                                  {unit.name}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">
                                  Max Guests: {unit.maxGuests} Person(s)
                                </span>
                              </div>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
                                Active Unit
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                              {unit.description}
                            </p>

                            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold">
                              <div>
                                <span className="text-[10px] text-slate-400 block">Dayout Rate</span>
                                <span className="text-emerald-600">LKR {unit.pricePerDayoutLKR.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block">Night Rate</span>
                                <span className="text-teal-600">LKR {unit.pricePerNightLKR.toLocaleString()}</span>
                              </div>
                            </div>

                            {unit.bookingComUnitId && (
                              <div className="text-[10px] text-sky-600 font-bold flex items-center gap-1 bg-sky-50 dark:bg-sky-950/40 p-2 rounded-xl">
                                <RefreshCw className="w-3 h-3" /> Booking.com Unit ID: {unit.bookingComUnitId}
                              </div>
                            )}

                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = prop.rooms.filter(r => r.id !== unit.id);
                                  updateProperty(prop.id, { rooms: filtered });
                                }}
                                className="text-[10px] text-rose-500 hover:text-rose-600 font-bold px-2 py-1 bg-rose-50 dark:bg-rose-950/40 rounded-lg"
                              >
                                Delete Unit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ONBOARDING WIZARD */}
      {activeTab === 'NEW_LISTING' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-600">Multi-Step Onboarding Wizard</span>
              <h2 className="text-2xl font-black">List Your Property on Ceylon DayOuts</h2>
            </div>
            <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Step {wizardStep} of 3
            </span>
          </div>

          <form onSubmit={handleCompletePropertyWizard} className="space-y-6">
            
            {wizardStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-black text-sm uppercase text-slate-400">Step 1: Property Identity & Category</h3>
                
                <div>
                  <label className="text-xs font-bold block mb-1">Property Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Beachfront Resort & Dayout Cabana"
                    value={newPropTitle}
                    onChange={(e) => setNewPropTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Property Category (Core Standard)</label>
                  <select
                    value={newPropCategory}
                    onChange={(e) => setNewPropCategory(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="HOTEL">1. Hotels & Resorts</option>
                    <option value="VILLA">2. Private Villas</option>
                    <option value="CABANA">3. Eco Cabanas</option>
                    <option value="COTTAGE">4. Cottages</option>
                    <option value="ROOM">5. Boutique Rooms</option>
                    <option value="UNIQUE">6. Unique (Glamping/Treehouses/Houseboats)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Destination City</label>
                    <select
                      value={newPropCity}
                      onChange={(e) => setNewPropCity(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                    >
                      {SRI_LANKA_CITIES.filter(c => c !== 'All Cities').map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">Full Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Beach Road, Bentota"
                      value={newPropAddress}
                      onChange={(e) => setNewPropAddress(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="w-full py-3 bg-emerald-600 text-white font-extrabold text-xs rounded-xl hover:bg-emerald-700"
                >
                  Continue to Pricing & Dayout Package
                </button>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-black text-sm uppercase text-slate-400">Step 2: Pricing & Dayout Inclusions</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Dayout Pass Rate (LKR)</label>
                    <input
                      type="number"
                      value={newPropPriceDayout}
                      onChange={(e) => setNewPropPriceDayout(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">Overnight Stay Rate (LKR)</label>
                    <input
                      type="number"
                      value={newPropPriceNight}
                      onChange={(e) => setNewPropPriceNight(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Dayout Package Title & Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Royal Dayout Package"
                      value={newPropDayoutTitle}
                      onChange={(e) => setNewPropDayoutTitle(e.target.value)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 09:00 AM - 05:00 PM"
                      value={newPropDayoutSlot}
                      onChange={(e) => setNewPropDayoutSlot(e.target.value)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Package Inclusions (Comma separated)</label>
                  <textarea
                    rows={2}
                    value={newPropInclusions}
                    onChange={(e) => setNewPropInclusions(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="flex-1 py-3 bg-emerald-600 text-white font-extrabold text-xs rounded-xl hover:bg-emerald-700"
                  >
                    Continue to Amenities & Photos
                  </button>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-black text-sm uppercase text-slate-400">Step 3: Amenities & Cover Photo</h3>

                <div>
                  <label className="text-xs font-bold block mb-2">Select Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AMENITIES_LIST.map(amenity => {
                      const isSelected = selectedAmenities.includes(amenity.name);
                      return (
                        <button
                          key={amenity.name}
                          type="button"
                          onClick={() => handleToggleAmenity(amenity.name)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors ${
                            isSelected 
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                              : 'border-slate-200 dark:border-slate-700 text-slate-600'
                          }`}
                        >
                          <span>{amenity.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Cover Photo Image URL</label>
                  <input
                    type="url"
                    value={newPropImage}
                    onChange={(e) => setNewPropImage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-xl hover:shadow-lg"
                  >
                    Submit Listing for Approval
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      )}

      {/* TAB CONTENT 3: CALENDAR MATRIX */}
      {activeTab === 'CALENDAR' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-black">Availability & Pricing Calendar Matrix</h2>
            <p className="text-xs text-slate-400">Click any date to block or unblock reservation availability across Ceylon DayOuts and Booking.com.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hostProperties.map(prop => (
              <div key={prop.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm line-clamp-1">{prop.title}</h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                    LKR {prop.pricePerDayoutLKR.toLocaleString()} / day
                  </span>
                </div>

                <p className="text-[10px] text-slate-400">Blocked dates count: {prop.blockedDates?.length || 0}</p>

                {/* Calendar Date Chips Grid */}
                <div className="grid grid-cols-7 gap-1.5 text-center pt-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                    <span key={idx} className="text-[10px] font-bold text-slate-400">{d}</span>
                  ))}
                  {[...Array(14)].map((_, i) => {
                    const dateObj = new Date();
                    dateObj.setDate(dateObj.getDate() + i);
                    const dateStr = dateObj.toISOString().split('T')[0];
                    const isBlocked = prop.blockedDates?.includes(dateStr);

                    return (
                      <button
                        key={dateStr}
                        onClick={() => {
                          if (isBlocked) {
                            updateProperty(prop.id, {
                              blockedDates: prop.blockedDates?.filter(d => d !== dateStr)
                            });
                          } else {
                            blockPropertyDates(prop.id, [dateStr]);
                          }
                        }}
                        className={`p-2 rounded-xl text-[10px] font-bold transition-all ${
                          isBlocked 
                            ? 'bg-rose-500 text-white shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                        title={isBlocked ? `Blocked on ${dateStr}` : `Available on ${dateStr}`}
                      >
                        {dateObj.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: RESERVATIONS */}
      {activeTab === 'BOOKINGS' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-black">Incoming Reservation Requests</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Guest Details</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Date & Type</th>
                  <th className="p-3">Payout</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {hostBookings.map(bk => (
                  <tr key={bk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-emerald-600">{bk.id}</td>
                    <td className="p-3">
                      <p className="font-extrabold">{bk.userName}</p>
                      <p className="text-[10px] text-slate-400">{bk.userPhone}</p>
                    </td>
                    <td className="p-3 font-bold line-clamp-1">{bk.propertyTitle}</td>
                    <td className="p-3">
                      <p className="font-bold">{bk.checkIn}</p>
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-extrabold">
                        {bk.bookingType} ({bk.guests} guests)
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                      LKR {bk.totalPriceLKR.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        bk.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {bk.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {bk.status === 'PENDING' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateBookingStatus(bk.id, 'CONFIRMED', 'PAID')}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateBookingStatus(bk.id, 'CANCELLED')}
                            className="px-2 py-1 bg-rose-500 text-white rounded text-[10px] font-bold"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ANALYTICS & EARNINGS */}
      {activeTab === 'ANALYTICS' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-black">Financial Revenue & Earnings Analytics</h2>
            <p className="text-xs text-slate-400">Monthly payout summary and reservation volume trends.</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  formatter={(val: any) => [`LKR ${Number(val).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="revenue" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: BOOKING.COM CHANNEL MANAGER SYNC */}
      {activeTab === 'CHANNEL_SYNC' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-sky-100 text-sky-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                2-Way iCal & REST Integration
              </span>
            </div>
            <h2 className="text-xl font-black">Booking.com Channel Manager Connectivity</h2>
            <p className="text-xs text-slate-400">Sync calendar availability in real-time to prevent double bookings between Booking.com and Ceylon DayOuts.</p>
          </div>

          {syncMessage && (
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 text-sky-900 dark:text-sky-200 text-xs font-bold">
              ✓ {syncMessage}
            </div>
          )}

          {/* Connected Sync Feeds List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm uppercase text-slate-400">Active Channel Feeds</h3>
            
            {syncs.map(sync => (
              <div key={sync.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm">{sync.propertyTitle}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                      {sync.platformName} ({sync.syncType})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-md">{sync.syncUrl}</p>
                  <p className="text-[10px] text-slate-400">
                    Last synced: <strong>{sync.lastSyncedAt}</strong> • Auto-blocked {sync.totalBlockedDatesCount} dates
                  </p>
                </div>

                <button
                  disabled={syncingId === sync.id}
                  onClick={() => handleSyncNow(sync.id)}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === sync.id ? 'animate-spin' : ''}`} />
                  {syncingId === sync.id ? 'Fetching Booking.com iCal...' : 'Sync Now'}
                </button>
              </div>
            ))}
          </div>

          {/* Add New Channel Feed Form */}
          <form onSubmit={handleCreateNewSync} className="p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm uppercase text-slate-700 dark:text-slate-300">
              Connect New Booking.com Property iCal Feed
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold block mb-1">Select Property</label>
                <select
                  value={newSyncPropertyId}
                  onChange={(e) => setNewSyncPropertyId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  {hostProperties.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Booking.com Exported iCal Feed URL (.ics)</label>
                <input
                  type="url"
                  required
                  placeholder="https://admin.booking.com/ical/v1/feed/yourprop.ics"
                  value={newSyncUrl}
                  onChange={(e) => setNewSyncUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow"
            >
              Connect & Start Auto-Syncing
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
