'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Property, Booking, Category } from '@/types/dayout';
import { SRI_LANKA_CITIES } from '@/lib/mockData';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Percent, 
  Building2, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  RefreshCw,
  Sliders,
  Sparkles,
  Layers,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Phone,
  PhoneCall,
  MessageCircle,
  MapPin,
  X,
  Save,
  Check,
  Search,
  ChevronRight,
  Flame,
  Sun,
  Utensils
} from 'lucide-react';

const COMMON_AMENITIES = [
  'Kitchen (Cook Your Own Meals)',
  'Free Arrangements for Kiri Ahara',
  'Hot Water',
  'Attached Bathrooms',
  'Meals Delivered from Vedda Sappayama (Free)',
  'Relaxing Garden Space',
  'Balcony View of Garden',
  'PEO TV',
  'Secure Parking Space',
  '5 Mins to Sacred City (පූජා නගරය)',
  'Swimming Pool',
  'Buffet Lunch',
  'Wi-Fi',
  'Air Conditioning',
  'Beach Access',
  'BBQ Facilities',
  'Chef on Demand'
];

export const AdminPanel: React.FC = () => {
  const { 
    properties, 
    bookings, 
    syncs, 
    addProperty,
    updateProperty,
    deleteProperty,
    updatePropertyStatus, 
    commissionRatePercent, 
    setCommissionRatePercent 
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'MANAGE_LISTINGS' | 'LISTINGS_APPROVAL' | 'GLOBAL_BOOKINGS' | 'COMMISSION' | 'WEBHOOK_LOGS'>('MANAGE_LISTINGS');

  // Search and filter for properties
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All Cities');

  // Modal / Form state for Add / Edit
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editorSubTab, setEditorSubTab] = useState<'BASIC' | 'CONTACTS' | 'DAYOUT_PKG' | 'FLOOR_SECTIONS' | 'AMENITIES'>('BASIC');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('HOTEL');
  const [formCity, setFormCity] = useState('Anuradhapura');
  const [formDistrict, setFormDistrict] = useState('Anuradhapura');
  const [formAddress, setFormAddress] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeaturedImage, setFormFeaturedImage] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80');
  const [formImagesText, setFormImagesText] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80\nhttps://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80');
  const [formPriceNight, setFormPriceNight] = useState<number>(4000);
  const [formPriceDayout, setFormPriceDayout] = useState<number>(1100);
  const [formExtraGuestFee, setFormExtraGuestFee] = useState<number>(500);
  const [formStatus, setFormStatus] = useState<'APPROVED' | 'PENDING' | 'REJECTED'>('APPROVED');

  // Contacts & Deals
  const [formContactPhone, setFormContactPhone] = useState('0252226094');
  const [formContactPhone2, setFormContactPhone2] = useState('0718805858');
  const [formContactWhatsApp, setFormContactWhatsApp] = useState('+94718805858');
  const [formSpecialPromoBanner, setFormSpecialPromoBanner] = useState('𝟭𝟬දෙනාටම 𝟭𝟭,𝟬𝟬𝟬 යි😮😱 අනුරාධපුරෙන් බජට් Resort එකක්! පූජා නගරයට විනාඩි 5යි 💕');

  // Dayout Package
  const [formHasDayoutPkg, setFormHasDayoutPkg] = useState(true);
  const [formDayoutPkgTitle, setFormDayoutPkgTitle] = useState('White Lotus 10-Pax Pilgrim & Dayout Budget Package');
  const [formDayoutPkgSlot, setFormDayoutPkgSlot] = useState('07:30 AM - 06:30 PM');
  const [formDayoutPkgPricePerPerson, setFormDayoutPkgPricePerPerson] = useState<number>(1100);
  const [formDayoutPkgMinGuests, setFormDayoutPkgMinGuests] = useState<number>(10);
  const [formDayoutPkgInclusionsText, setFormDayoutPkgInclusionsText] = useState(
    '10 දෙනාටම රු. 11,000 යි (Just Rs. 1,100 per person)\nFree Arrangements for Kiri Ahara (කිරි ආහාර සැකසීමේ පහසුකම් නොමිලේ)\nAttached Bathrooms & Hot Water Facilities\nRelaxing lush garden space for pilgrims & groups\nBalcony view & changing rooms\nMeals delivered from Vedda Sappayama Restaurant (Free Delivery)\nSpacious parking space for vans / buses / cars\n5 Mins distance to Anuradhapura Pooja Nagaraya'
  );

  // Floor Sections JSON or visual
  const [formFloorSections, setFormFloorSections] = useState<Property['floorSections']>([
    {
      floorName: '🔴 Upper Floor: Newer Group Rooms',
      subtitle: 'Spacious rooms ideal for groups, with options to cook your own meals!',
      badge: 'Newer Group Rooms + Kitchen',
      facilities: ['Kitchen & Cooking Facilities', 'Hot Water', 'Attached Bathrooms', 'Meals Delivered from Vedda Sappayama (Free)', 'Relaxing Garden Space', 'Balcony View of Garden', 'Parking Space'],
      packages: [
        {
          groupTitle: 'For 3 Guests',
          guestCount: 3,
          options: [
            { name: 'AC + Kitchen', priceLKR: 6500 },
            { name: 'Non-AC + Kitchen', priceLKR: 5500 },
            { name: 'AC (No Kitchen)', priceLKR: 5000 },
            { name: 'Non-AC (No Kitchen)', priceLKR: 4000 }
          ]
        },
        {
          groupTitle: 'For 10 Guests (Special Pilgrim Rate)',
          guestCount: 10,
          options: [
            { name: 'AC + Kitchen', priceLKR: 16000 },
            { name: 'Non-AC + Kitchen', priceLKR: 14000 },
            { name: 'AC (No Kitchen)', priceLKR: 13000 },
            { name: 'Non-AC (No Kitchen)', priceLKR: 11000 }
          ]
        },
        {
          groupTitle: 'Book The Entire Property (For 21 Guests)',
          guestCount: 21,
          options: [
            { name: 'AC + Kitchen (Full Villa 21 Guests)', priceLKR: 30000 },
            { name: 'Non-AC + Kitchen (Full Villa 21 Guests)', priceLKR: 25000 }
          ]
        }
      ]
    },
    {
      floorName: '🔴 Ground Floor: Standard Rooms',
      subtitle: 'Perfect for 4 guests. No kitchen facilities provided',
      badge: 'Ground Floor Standard',
      facilities: ['Hot Water', 'PEO TV', 'Attached Bathrooms', 'Meals Delivered from Vedda Sappayama (Free)', 'Free Arrangements for Kiri Ahara', 'Relaxing Garden Space', 'Parking Space'],
      packages: [
        {
          groupTitle: 'For 4 Guests Standard',
          guestCount: 4,
          options: [
            { name: 'AC Room', priceLKR: 5000 },
            { name: 'Non-AC Room', priceLKR: 4000 }
          ]
        }
      ]
    }
  ]);

  // Amenities
  const [formSelectedAmenities, setFormSelectedAmenities] = useState<string[]>([
    'Kitchen (Cook Your Own Meals)',
    'Free Arrangements for Kiri Ahara',
    'Hot Water',
    'Attached Bathrooms',
    'Meals Delivered from Vedda Sappayama (Free)',
    'Relaxing Garden Space',
    'Balcony View of Garden',
    'PEO TV',
    'Secure Parking Space',
    '5 Mins to Sacred City (පූජා නගරය)'
  ]);

  const pendingProperties = properties.filter(p => p.status === 'PENDING');
  const approvedProperties = properties.filter(p => p.status === 'APPROVED');
  const totalGlobalRevenue = bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.totalPriceLKR, 0);
  const platformEarnings = Math.round(totalGlobalRevenue * (commissionRatePercent / 100));

  // Filtered properties for manager
  const displayedProperties = properties.filter(p => {
    if (selectedCityFilter !== 'All Cities' && p.city !== selectedCityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        (p.contactPhone && p.contactPhone.includes(q)) ||
        (p.contactPhone2 && p.contactPhone2.includes(q))
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingPropertyId(null);
    setFormTitle('New Resort / Staycation');
    setFormTagline('Special accommodation and group packages');
    setFormCategory('HOTEL');
    setFormCity('Anuradhapura');
    setFormDistrict('Anuradhapura');
    setFormAddress('Near Sacred City, Anuradhapura');
    setFormDescription('Family and group accommodation with spacious rooms, hot water, garden, and direct sacred city access.');
    setFormPriceNight(4000);
    setFormPriceDayout(1100);
    setFormExtraGuestFee(500);
    setFormStatus('APPROVED');
    setFormContactPhone('0252226094');
    setFormContactPhone2('0718805858');
    setFormContactWhatsApp('+94718805858');
    setFormSpecialPromoBanner('10දෙනාටම 11,000 යි! අනුරාධපුර පූජා නගරයට විනාඩි 5යි');
    setFormHasDayoutPkg(true);
    setFormDayoutPkgTitle('Pilgrim & Dayout Group Package');
    setFormDayoutPkgSlot('07:30 AM - 06:30 PM');
    setFormDayoutPkgPricePerPerson(1100);
    setFormDayoutPkgMinGuests(10);
    setFormDayoutPkgInclusionsText('Attached Bathrooms & Hot Water\nKiri Ahara Arrangements Free\nFree Meals Delivery from Vedda Sappayama\nSpacious Parking & Garden');
    setEditorSubTab('BASIC');
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setFormTitle(prop.title);
    setFormTagline(prop.tagline);
    setFormCategory(prop.category);
    setFormCity(prop.city);
    setFormDistrict(prop.district);
    setFormAddress(prop.address);
    setFormDescription(prop.description);
    setFormFeaturedImage(prop.featuredImage);
    setFormImagesText(prop.images?.join('\n') || prop.featuredImage);
    setFormPriceNight(prop.pricePerNightLKR);
    setFormPriceDayout(prop.pricePerDayoutLKR);
    setFormExtraGuestFee(prop.extraGuestFeeLKR || 500);
    setFormStatus(prop.status);
    setFormContactPhone(prop.contactPhone || '0252226094');
    setFormContactPhone2(prop.contactPhone2 || '0718805858');
    setFormContactWhatsApp(prop.contactWhatsApp || '+94718805858');
    setFormSpecialPromoBanner(prop.specialPromoBanner || '');
    
    if (prop.dayoutPackage) {
      setFormHasDayoutPkg(true);
      setFormDayoutPkgTitle(prop.dayoutPackage.title);
      setFormDayoutPkgSlot(prop.dayoutPackage.timeSlot);
      setFormDayoutPkgPricePerPerson(prop.dayoutPackage.pricePerPersonLKR);
      setFormDayoutPkgMinGuests(prop.dayoutPackage.minGuests);
      setFormDayoutPkgInclusionsText(prop.dayoutPackage.inclusions.join('\n'));
    } else {
      setFormHasDayoutPkg(false);
    }

    if (prop.floorSections && prop.floorSections.length > 0) {
      setFormFloorSections(prop.floorSections);
    }

    setFormSelectedAmenities(prop.amenities || []);
    setEditorSubTab('BASIC');
    setIsEditorOpen(true);
  };

  const handleLoadWhiteLotusPreset = () => {
    setFormTitle('“White Lotus” Holiday Resort Anuradhapura');
    setFormTagline('10දෙනාටම 11,000 යි! අනුරාධපුර පූජා නගරයට විනාඩි 5න් ළඟා විය හැකි සුපිරි බජට් Resort එකක්');
    setFormCategory('HOTEL');
    setFormCity('Anuradhapura');
    setFormDistrict('Anuradhapura');
    setFormAddress('Near Sacred City Access, Anuradhapura');
    setFormDescription('අනුරාධපුර වන්දනාවේ යන්නද හිතන් ඉන්නේ? එහෙනම් මෙන්න කිරි ආහාර එහෙම හදාගෙන, ඔයාලට ගෙදර වගේ නිදහසේ නවාතැන් ගන්න පුලුවන්, පූජා නගරයට විනාඩි 5කින් ළගා වෙන්න පුලුවන් තැනක්. මෙතන Upper floor සහ Ground Floor වල වෙන වෙනම Rooms තියෙනවා. උපරිම 21 දෙනෙක්ට ඉන්න පුලුවන්, ඔයාලගේ එන පිරිස අනුව කැමති විදිහට Arrange කරගන්නත් පුලුවන්.');
    setFormFeaturedImage('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80');
    setFormImagesText('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80\nhttps://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80\nhttps://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80');
    setFormPriceNight(4000);
    setFormPriceDayout(1100);
    setFormExtraGuestFee(500);
    setFormContactPhone('0252226094');
    setFormContactPhone2('0718805858');
    setFormContactWhatsApp('+94718805858');
    setFormSpecialPromoBanner('𝟭𝟬දෙනාටම 𝟭𝟭,𝟬𝟬𝟬 යි😮😱 අනුරාධපුරෙන් බජට් Resort එකක්! පූජා නගරයට විනාඩි 5යි 💕');
    setFormHasDayoutPkg(true);
    setFormDayoutPkgTitle('White Lotus 10-Pax Pilgrim & Dayout Budget Package');
    setFormDayoutPkgSlot('07:30 AM - 06:30 PM');
    setFormDayoutPkgPricePerPerson(1100);
    setFormDayoutPkgMinGuests(10);
    setFormDayoutPkgInclusionsText('10 දෙනාටම රු. 11,000 යි (Just Rs. 1,100 per person)\nFree Arrangements for Kiri Ahara (කිරි ආහාර සැකසීමේ පහසුකම් නොමිලේ)\nAttached Bathrooms & Hot Water Facilities\nRelaxing lush garden space for pilgrims & groups\nBalcony view & changing rooms\nMeals delivered from Vedda Sappayama Restaurant (Free Delivery)\nSpacious parking space for vans / buses / cars\n5 Mins distance to Anuradhapura Pooja Nagaraya');
    setFormSelectedAmenities([
      'Kitchen (Cook Your Own Meals)',
      'Free Arrangements for Kiri Ahara',
      'Hot Water',
      'Attached Bathrooms',
      'Meals Delivered from Vedda Sappayama (Free)',
      'Relaxing Garden Space',
      'Balcony View of Garden',
      'PEO TV',
      'Secure Parking Space',
      '5 Mins to Sacred City (පූජා නගරය)'
    ]);
  };

  const handleSavePropertyForm = (e: React.FormEvent) => {
    e.preventDefault();

    const imagesArray = formImagesText.split('\n').map(s => s.trim()).filter(Boolean);
    const inclusionsArray = formDayoutPkgInclusionsText.split('\n').map(s => s.trim()).filter(Boolean);

    const propertyPayload: Partial<Property> = {
      title: formTitle.trim(),
      tagline: formTagline.trim(),
      category: formCategory,
      city: formCity,
      district: formDistrict,
      address: formAddress.trim(),
      description: formDescription.trim(),
      featuredImage: formFeaturedImage.trim() || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      images: imagesArray.length > 0 ? imagesArray : [formFeaturedImage.trim()],
      pricePerNightLKR: Number(formPriceNight) || 4000,
      pricePerDayoutLKR: Number(formPriceDayout) || 1100,
      extraGuestFeeLKR: Number(formExtraGuestFee) || 500,
      status: formStatus,
      contactPhone: formContactPhone.trim(),
      contactPhone2: formContactPhone2.trim(),
      contactWhatsApp: formContactWhatsApp.trim(),
      specialPromoBanner: formSpecialPromoBanner.trim() || undefined,
      amenities: formSelectedAmenities,
      dayoutPackage: formHasDayoutPkg ? {
        title: formDayoutPkgTitle.trim(),
        timeSlot: formDayoutPkgSlot.trim(),
        pricePerPersonLKR: Number(formDayoutPkgPricePerPerson) || 1100,
        minGuests: Number(formDayoutPkgMinGuests) || 10,
        inclusions: inclusionsArray
      } : undefined,
      floorSections: formFloorSections,
    };

    if (editingPropertyId) {
      updateProperty(editingPropertyId, propertyPayload);
      setSaveSuccessMsg(`✓ Successfully updated "${formTitle}"! All details and hotlines updated in real time.`);
    } else {
      const created = addProperty({
        ...propertyPayload,
        ownerId: 'user-admin-1',
        ownerName: 'Platform Super Admin',
      });
      setSaveSuccessMsg(`✓ Added new property "${created.title}" successfully!`);
    }

    setTimeout(() => {
      setSaveSuccessMsg(null);
      setIsEditorOpen(false);
    }, 1800);
  };

  const toggleAmenity = (name: string) => {
    setFormSelectedAmenities(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Admin Panel Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-bold text-xs rounded-full border border-purple-500/30">
              Platform Admin Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">Ceylon DayOuts Super Admin Dashboard</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Add & edit accommodation listings, configure WhatsApp & direct hotlines, manage multi-floor packages, rates, and platform earnings.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 self-start md:self-auto cursor-pointer transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Accommodation / Resort</span>
        </button>
      </div>

      {/* Admin Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Properties</span>
          <p className="text-2xl font-black text-slate-900">{properties.length} Listings</p>
          <p className="text-[10px] text-emerald-600 font-bold">{approvedProperties.length} Active & Bookable</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Review</span>
          <p className="text-2xl font-black text-amber-600">{pendingProperties.length} Listings</p>
          <p className="text-[10px] text-slate-400">Host applications awaiting review</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Platform Commission</span>
          <p className="text-2xl font-black text-purple-600">{commissionRatePercent}% Rate</p>
          <p className="text-[10px] text-slate-400">Yield: LKR {platformEarnings.toLocaleString()}</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Global Reservations</span>
          <p className="text-2xl font-black text-slate-900">{bookings.length} Total</p>
          <p className="text-[10px] text-slate-400">Volume: LKR {totalGlobalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'MANAGE_LISTINGS', label: `Property & Details Manager (${properties.length})`, icon: Building2 },
          { id: 'LISTINGS_APPROVAL', label: `Pending Approvals (${pendingProperties.length})`, icon: ShieldAlert },
          { id: 'GLOBAL_BOOKINGS', label: 'Global Reservations', icon: Calendar },
          { id: 'COMMISSION', label: 'Commission Rate Setting', icon: Percent },
          { id: 'WEBHOOK_LOGS', label: 'Booking.com Webhook Log', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 flex-shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROPERTY & DETAILS MANAGER (THE CENTRAL COMPREHENSIVE MANAGER) */}
      {activeAdminTab === 'MANAGE_LISTINGS' && (
        <div className="space-y-6">
          
          {/* Controls Bar: Search, City Filter, Add Button, Preset Helper */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, city, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:outline-purple-500"
                />
              </div>

              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="w-full sm:w-auto p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
              >
                {SRI_LANKA_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Property</span>
              </button>
            </div>
          </div>

          {/* Properties Management Cards / Table */}
          <div className="space-y-4">
            {displayedProperties.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                <p className="text-slate-400 font-bold text-sm">No properties found matching your search.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCityFilter('All Cities'); }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              displayedProperties.map(prop => (
                <div 
                  key={prop.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  {/* Left: Thumbnail & Core Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <img 
                      src={prop.featuredImage} 
                      alt={prop.title} 
                      className="w-24 sm:w-32 h-24 sm:h-28 rounded-2xl object-cover flex-shrink-0 bg-slate-100 border border-slate-100 shadow-2xs" 
                    />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                          {prop.category}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {prop.city} ({prop.district})
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          prop.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {prop.status}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                        {prop.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                        {prop.tagline}
                      </p>

                      {/* Hotlines & WhatsApp info tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        {prop.contactPhone && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                            <PhoneCall className="w-3 h-3 text-emerald-600" />
                            {prop.contactPhone}
                          </span>
                        )}
                        {prop.contactPhone2 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                            <Phone className="w-3 h-3 text-slate-600" />
                            {prop.contactPhone2}
                          </span>
                        )}
                        {prop.contactWhatsApp && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200/60">
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                            {prop.contactWhatsApp}
                          </span>
                        )}
                        {prop.specialPromoBanner && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 font-bold text-[11px] border border-amber-200/60 truncate max-w-xs">
                            <Flame className="w-3 h-3 text-amber-600" />
                            Promo Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Pricing Breakdown Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 text-xs border-y sm:border-y-0 lg:border-x border-slate-100 py-3 lg:py-0 lg:px-5 flex-shrink-0">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Dayout Rate</span>
                      <span className="font-black text-emerald-700">Rs. {prop.pricePerDayoutLKR.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Night Stay</span>
                      <span className="font-black text-slate-900">Rs. {prop.pricePerNightLKR.toLocaleString()}</span>
                    </div>
                    {prop.floorSections && prop.floorSections.length > 0 && (
                      <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 col-span-2">
                        <span className="text-[10px] text-emerald-800 font-bold block">Multi-Floor Packages</span>
                        <span className="font-black text-emerald-950">{prop.floorSections.length} Floors Configured</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap lg:flex-col items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(prop)}
                      className="flex-1 lg:flex-none px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer w-full"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Full Details</span>
                    </button>

                    <Link
                      href={`/property/${prop.id}`}
                      target="_blank"
                      className="flex-1 lg:flex-none px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all w-full"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                      <span>Live Preview</span>
                    </Link>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete listing "${prop.title}"?`)) {
                          deleteProperty(prop.id);
                        }
                      }}
                      className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* FULL-FEATURED PROPERTY EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70 rounded-t-3xl">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                  {editingPropertyId ? 'Admin Property Editor' : 'Create New Accommodation'}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {editingPropertyId ? `Edit Details: ${formTitle}` : 'Add New Resort / Staycation Listing'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadWhiteLotusPreset}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold border border-amber-300 shadow-2xs transition-all cursor-pointer"
                  title="Auto-fill with White Lotus Resort Anuradhapura pilgrim details"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Load White Lotus Preset</span>
                </button>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Subtabs */}
            <div className="flex items-center gap-1.5 px-5 sm:px-6 pt-3 pb-1 border-b border-slate-100 overflow-x-auto scrollbar-none">
              {[
                { id: 'BASIC', label: '1. Basic Info & Pricing' },
                { id: 'CONTACTS', label: '2. Hotlines & WhatsApp' },
                { id: 'DAYOUT_PKG', label: '3. Dayout Package' },
                { id: 'FLOOR_SECTIONS', label: '4. Multi-Floor Breakdown' },
                { id: 'AMENITIES', label: '5. Amenities & Highlights' },
              ].map(sub => (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => setEditorSubTab(sub.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex-shrink-0 cursor-pointer ${
                    editorSubTab === sub.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSavePropertyForm} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              
              {saveSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* SUBTAB 1: BASIC INFO */}
              {editorSubTab === 'BASIC' && (
                <div className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold">Property Title (නම):</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. “White Lotus” Holiday Resort Anuradhapura"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:outline-purple-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold">Category:</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as Category)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      >
                        <option value="HOTEL">Hotels & Resorts</option>
                        <option value="VILLA">Private Villas</option>
                        <option value="CABANA">Eco Cabanas</option>
                        <option value="COTTAGE">Heritage Cottages</option>
                        <option value="ROOM">Holiday Rooms</option>
                        <option value="UNIQUE">Unique Stays</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-extrabold">Tagline / Catchphrase (විශේෂ විස්තරය):</label>
                    <input
                      type="text"
                      value={formTagline}
                      onChange={(e) => setFormTagline(e.target.value)}
                      placeholder="e.g. 10දෙනාටම 11,000 යි! අනුරාධපුර පූජා නගරයට විනාඩි 5න් ළඟා විය හැකි සුපිරි බජට් Resort එකක්"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:outline-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold">City (නගරය):</label>
                      <select
                        value={formCity}
                        onChange={(e) => {
                          setFormCity(e.target.value);
                          setFormDistrict(e.target.value);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      >
                        {SRI_LANKA_CITIES.filter(c => c !== 'All Cities').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold">District (දිස්ත්‍රික්කය):</label>
                      <input
                        type="text"
                        value={formDistrict}
                        onChange={(e) => setFormDistrict(e.target.value)}
                        placeholder="e.g. Anuradhapura"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold">Address / Location:</label>
                      <input
                        type="text"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        placeholder="e.g. Near Sacred City Access, Anuradhapura"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold">Base Night Stay (LKR):</label>
                      <input
                        type="number"
                        value={formPriceNight}
                        onChange={(e) => setFormPriceNight(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold">Base Dayout Rate (LKR):</label>
                      <input
                        type="number"
                        value={formPriceDayout}
                        onChange={(e) => setFormPriceDayout(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold">Extra Guest Fee (LKR):</label>
                      <input
                        type="number"
                        value={formExtraGuestFee}
                        onChange={(e) => setFormExtraGuestFee(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-extrabold">Full Description (සම්පූර්ණ විස්තරය):</label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Enter detailed description of rooms, temple access, garden, etc..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-extrabold">Featured Image URL:</label>
                    <input
                      type="url"
                      value={formFeaturedImage}
                      onChange={(e) => setFormFeaturedImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-extrabold">Gallery Image URLs (one URL per line):</label>
                    <textarea
                      rows={2}
                      value={formImagesText}
                      onChange={(e) => setFormImagesText(e.target.value)}
                      placeholder="https://image1.jpg&#10;https://image2.jpg"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* SUBTAB 2: CONTACTS, HOTLINES & SPECIAL PROMOS */}
              {editorSubTab === 'CONTACTS' && (
                <div className="space-y-5 text-xs font-semibold">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-1">
                    <p className="font-extrabold text-sm flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-purple-600" />
                      Hotlines & WhatsApp Management
                    </p>
                    <p className="text-xs text-purple-800">
                      Configure the official direct phone numbers and WhatsApp number for this resort. These will automatically appear in the dedicated <strong>Contacts & Inquiries Tab</strong> and the main Contacts page.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        Direct Hotline 1 (Landline / ලෑන්ඩ්ලයින්):
                      </label>
                      <input
                        type="text"
                        value={formContactPhone}
                        onChange={(e) => setFormContactPhone(e.target.value)}
                        placeholder="e.g. 0252226094"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:outline-purple-500"
                      />
                      <span className="text-[10px] text-slate-400">Primary front-desk landline for inquiries</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 font-extrabold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-600" />
                        Mobile Hotline 2 (Reservations / ජංගම දුරකථන):
                      </label>
                      <input
                        type="text"
                        value={formContactPhone2}
                        onChange={(e) => setFormContactPhone2(e.target.value)}
                        placeholder="e.g. 0718805858"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:outline-purple-500"
                      />
                      <span className="text-[10px] text-slate-400">Host reservation mobile number</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-extrabold flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Official WhatsApp Number:
                    </label>
                    <input
                      type="text"
                      value={formContactWhatsApp}
                      onChange={(e) => setFormContactWhatsApp(e.target.value)}
                      placeholder="e.g. +94718805858 or 0718805858"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:outline-purple-500"
                    />
                    <span className="text-[10px] text-slate-400">WhatsApp quick links will automatically route to this number with custom guest message</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-1.5">
                    <label className="text-slate-700 font-extrabold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      Special Promo / Deals Banner Text:
                    </label>
                    <input
                      type="text"
                      value={formSpecialPromoBanner}
                      onChange={(e) => setFormSpecialPromoBanner(e.target.value)}
                      placeholder="e.g. 𝟭𝟬දෙනාටම 𝟭𝟭,𝟬𝟬𝟬 යි😮😱 අනුරාධපුරෙන් බජට් Resort එකක්! පූජා නගරයට විනාඩි 5යි 💕"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:outline-purple-500"
                    />
                    <span className="text-[10px] text-slate-400">Displayed at top of listing page to highlight verified deals (leave blank to hide)</span>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: FEATURED DAYOUT PACKAGE */}
              {editorSubTab === 'DAYOUT_PKG' && (
                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                    <input
                      type="checkbox"
                      id="hasDayoutCheck"
                      checked={formHasDayoutPkg}
                      onChange={(e) => setFormHasDayoutPkg(e.target.checked)}
                      className="w-4 h-4 accent-amber-600 cursor-pointer"
                    />
                    <label htmlFor="hasDayoutCheck" className="text-amber-950 font-black cursor-pointer">
                      Enable Featured Dayout Package on Listing Page
                    </label>
                  </div>

                  {formHasDayoutPkg && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-700 font-extrabold">Package Title:</label>
                          <input
                            type="text"
                            value={formDayoutPkgTitle}
                            onChange={(e) => setFormDayoutPkgTitle(e.target.value)}
                            placeholder="e.g. White Lotus 10-Pax Pilgrim & Dayout Budget Package"
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-700 font-extrabold">Time Slot (වේලාව):</label>
                          <input
                            type="text"
                            value={formDayoutPkgSlot}
                            onChange={(e) => setFormDayoutPkgSlot(e.target.value)}
                            placeholder="e.g. 07:30 AM - 06:30 PM"
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-700 font-extrabold">Rate Per Person (LKR):</label>
                          <input
                            type="number"
                            value={formDayoutPkgPricePerPerson}
                            onChange={(e) => setFormDayoutPkgPricePerPerson(Number(e.target.value))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-700 font-extrabold">Min Guests Required:</label>
                          <input
                            type="number"
                            value={formDayoutPkgMinGuests}
                            onChange={(e) => setFormDayoutPkgMinGuests(Number(e.target.value))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-700 font-extrabold">Package Inclusions & Benefits (one per line):</label>
                        <textarea
                          rows={5}
                          value={formDayoutPkgInclusionsText}
                          onChange={(e) => setFormDayoutPkgInclusionsText(e.target.value)}
                          placeholder="e.g. 10 දෙනාටම රු. 11,000 යි&#10;Free Arrangements for Kiri Ahara&#10;Meals delivered from Vedda Sappayama (Free)"
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 4: MULTI-FLOOR BREAKDOWN */}
              {editorSubTab === 'FLOOR_SECTIONS' && (
                <div className="space-y-5 text-xs font-semibold">
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 space-y-1">
                    <p className="font-extrabold text-sm flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      Multi-Floor & Room Pricing Breakdown
                    </p>
                    <p className="text-xs text-slate-600">
                      Configure separate pricing for Upper Floor (with kitchen) and Ground Floor (standard rooms). Guests can select their desired guest count and options (AC / Non-AC / Kitchen).
                    </p>
                  </div>

                  <div className="space-y-4">
                    {formFloorSections?.map((floor, fIdx) => (
                      <div key={fIdx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-black text-sm text-slate-900">{floor.floorName}</span>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {floor.badge || 'Configured'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium">{floor.subtitle}</p>

                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase">Facilities Included:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {floor.facilities.map((fac, fi) => (
                              <span key={fi} className="text-[11px] font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                                ✓ {fac}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase">Pricing Tier Groups:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {floor.packages.map((pkg, pi) => (
                              <div key={pi} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px]">
                                <span className="font-black text-slate-900 block mb-1">{pkg.groupTitle}</span>
                                <div className="space-y-0.5 text-slate-600">
                                  {pkg.options.map((opt, oi) => (
                                    <div key={oi} className="flex justify-between">
                                      <span>{opt.name}:</span>
                                      <span className="font-black text-emerald-700">Rs. {opt.priceLKR.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBTAB 5: AMENITIES */}
              {editorSubTab === 'AMENITIES' && (
                <div className="space-y-4 text-xs font-semibold">
                  <p className="text-slate-600">
                    Select all facilities and features available at this accommodation:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {COMMON_AMENITIES.map(amenity => {
                      const isSelected = formSelectedAmenities.includes(amenity);
                      return (
                        <button
                          type="button"
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-50 border-purple-300 text-purple-950 font-black shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span>{amenity}</span>
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-purple-600 text-white' : 'border border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  {editingPropertyId ? 'Changes will be saved immediately to app state.' : 'New property will be immediately added to directory.'}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingPropertyId ? 'Save & Update Details' : 'Add Property to Directory'}</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* TAB 2: LISTINGS APPROVAL */}
      {activeAdminTab === 'LISTINGS_APPROVAL' && (
        <div className="space-y-6">
          <h2 className="text-xl font-black">Property & Host Application Approvals</h2>

          {pendingProperties.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm">All pending properties have been reviewed!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingProperties.map(prop => (
                <div key={prop.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-4">
                  <div className="flex gap-4">
                    <img src={prop.featuredImage} alt={prop.title} className="w-24 h-24 rounded-2xl object-cover" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                        {prop.category}
                      </span>
                      <h3 className="font-extrabold text-sm line-clamp-1">{prop.title}</h3>
                      <p className="text-xs text-slate-400">{prop.city} • Host: {prop.ownerName}</p>
                      <p className="text-xs font-extrabold text-emerald-600">
                        Dayout: LKR {prop.pricePerDayoutLKR.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => updatePropertyStatus(prop.id, 'APPROVED')}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl"
                    >
                      ✓ Approve Listing
                    </button>
                    <button
                      onClick={() => updatePropertyStatus(prop.id, 'REJECTED')}
                      className="py-2.5 px-4 bg-rose-500 text-white text-xs font-extrabold rounded-xl"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GLOBAL BOOKINGS */}
      {activeAdminTab === 'GLOBAL_BOOKINGS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
          <h2 className="text-xl font-black">All Platform Reservations</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Admin Fee ({commissionRatePercent}%)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="p-3 font-bold text-purple-600">{b.id}</td>
                    <td className="p-3">{b.userName}</td>
                    <td className="p-3 font-bold">{b.propertyTitle}</td>
                    <td className="p-3 font-extrabold">LKR {b.totalPriceLKR.toLocaleString()}</td>
                    <td className="p-3 text-purple-600 font-bold">
                      LKR {Math.round(b.totalPriceLKR * (commissionRatePercent / 100)).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSION SETTINGS */}
      {activeAdminTab === 'COMMISSION' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl max-w-xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-black">Platform Commission Fee Control</h2>
            <p className="text-xs text-slate-400">Set the percentage fee Ceylon DayOuts deducts on host bookings.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Commission Rate:</span>
              <span className="text-2xl font-black text-purple-600">{commissionRatePercent}%</span>
            </div>

            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={commissionRatePercent}
              onChange={(e) => setCommissionRatePercent(Number(e.target.value))}
              className="w-full accent-purple-600"
            />

            <div className="p-4 rounded-2xl bg-purple-50 text-purple-900 text-xs font-semibold space-y-1">
              <p>💡 Calculated Platform Earnings on LKR 100,000 booking:</p>
              <p className="font-extrabold text-sm">
                LKR {(100000 * (commissionRatePercent / 100)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WEBHOOK LOGS */}
      {activeAdminTab === 'WEBHOOK_LOGS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
          <h2 className="text-xl font-black">Booking.com Webhook Listener Inspector</h2>

          <div className="space-y-3 font-mono text-xs">
            {syncs.map(sync => (
              <div key={sync.id} className="p-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>POST /api/webhooks/bookingcom/availability</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">200 OK</span>
                </div>
                <p className="text-[10px] text-slate-400">Secret: {sync.webhookSecret}</p>
                <p className="text-slate-300">Property: {sync.propertyTitle} | Last event: {sync.lastSyncedAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
