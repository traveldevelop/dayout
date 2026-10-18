'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types/dayout';
import { 
  Palmtree, 
  Search, 
  Heart, 
  Bell, 
  Sun, 
  Moon, 
  User as UserIcon, 
  ShieldAlert, 
  Building2, 
  CalendarCheck, 
  ChevronDown,
  Sparkles,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'EXPLORE' | 'WISHLIST' | 'MY_BOOKINGS' | 'HOST_DASHBOARD' | 'ADMIN_PANEL';
  setActiveTab: (tab: 'EXPLORE' | 'WISHLIST' | 'MY_BOOKINGS' | 'HOST_DASHBOARD' | 'ADMIN_PANEL') => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenNotifications }) => {
  const { 
    currentUser, 
    setCurrentUserRole, 
    darkMode, 
    toggleDarkMode, 
    wishlist, 
    notifications,
    bookings,
    isHydrated
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = isHydrated ? notifications.filter(n => !n.read).length : 0;
  const myBookingsCount = isHydrated ? bookings.filter(b => b.userId === currentUser.id).length : 0;
  const wishlistCount = isHydrated ? wishlist.length : 0;

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    setRoleDropdownOpen(false);
    if (role === 'HOST') {
      setActiveTab('HOST_DASHBOARD');
    } else if (role === 'ADMIN') {
      setActiveTab('ADMIN_PANEL');
    } else {
      setActiveTab('EXPLORE');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-white/80 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.04)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo with 3D Gradient Elevation */}
          <div 
            onClick={() => setActiveTab('EXPLORE')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(16,185,129,0.28),inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover:scale-105 group-hover:shadow-[0_12px_24px_rgba(16,185,129,0.35)] transition-all duration-300 border-t border-white/40">
              <Palmtree className="w-6 h-6 drop-shadow-sm" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                Ceylon<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">DayOuts</span>
                <span className="text-[10px] uppercase font-black bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-200/80 shadow-xs ml-1">
                  Sri Lanka
                </span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Day passes & unique staycations
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Frosted 3D Segmented Bar) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-200/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
            <button
              onClick={() => setActiveTab('EXPLORE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'EXPLORE'
                  ? 'bg-white text-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,1)] border border-emerald-100/60 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Explore Stays
            </button>

            <button
              onClick={() => setActiveTab('WISHLIST')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                activeTab === 'WISHLIST'
                  ? 'bg-white text-rose-600 shadow-[0_4px_12px_rgba(244,63,94,0.15),inset_0_1px_0_rgba(255,255,255,1)] border border-rose-100/60 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('MY_BOOKINGS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                activeTab === 'MY_BOOKINGS'
                  ? 'bg-white text-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,1)] border border-emerald-100/60 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              My Bookings
              {myBookingsCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                  {myBookingsCount}
                </span>
              )}
            </button>

            {currentUser.role === 'HOST' && (
              <button
                onClick={() => setActiveTab('HOST_DASHBOARD')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'HOST_DASHBOARD'
                    ? 'btn-3d-emerald text-white shadow-md'
                    : 'text-emerald-700 hover:bg-white/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Host Portal
              </button>
            )}

            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('ADMIN_PANEL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'ADMIN_PANEL'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-purple-700 hover:bg-white/50'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Controls: Role Selector, Notifications, Dark Mode */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Switch Role Dropdown (3D Glass Button) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="px-3.5 py-2 rounded-2xl border border-white/90 bg-white/80 backdrop-blur-xl text-xs font-bold text-slate-800 flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                title="Quick Switch Persona"
              >
                <span className={`w-2 h-2 rounded-full ring-2 ring-white ${
                  currentUser.role === 'ADMIN' ? 'bg-purple-500' : currentUser.role === 'HOST' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span className="capitalize">{currentUser.role.toLowerCase()} View</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/80 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Switch Persona Role</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{currentUser.name}</p>
                  </div>

                  <button
                    onClick={() => handleRoleChange('GUEST')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between hover:bg-slate-100 ${
                      currentUser.role === 'GUEST' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Guest / Customer</span>
                    {currentUser.role === 'GUEST' && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => handleRoleChange('HOST')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between hover:bg-slate-100 ${
                      currentUser.role === 'HOST' ? 'text-amber-700 font-bold bg-amber-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Property Host</span>
                    {currentUser.role === 'HOST' && <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => handleRoleChange('ADMIN')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between hover:bg-slate-100 ${
                      currentUser.role === 'ADMIN' ? 'text-purple-700 font-bold bg-purple-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Platform Admin</span>
                    {currentUser.role === 'ADMIN' && <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* WhatsApp Quick Link Direct Button */}
            <a
              href="https://wa.me/94718805858?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20booking%20White%20Lotus%20Resort%20/%20DayOuts."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
              title="Direct WhatsApp Quick Link (wa.me/+94718805858)"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">WhatsApp Quick Link</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            {/* Notification Bell (3D Glass Button) */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-2xl border border-white/90 bg-white/80 backdrop-blur-xl hover:bg-white text-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
              title="Push Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-2xl border border-white/90 bg-white/80 backdrop-blur-xl hover:bg-white text-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Frosted 3D Glass) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-2xl border-t border-white/80 px-4 py-2.5 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => setActiveTab('EXPLORE')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'EXPLORE' ? 'text-emerald-700 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </button>

        <button
          onClick={() => setActiveTab('WISHLIST')}
          className={`flex flex-col items-center gap-1 relative ${
            activeTab === 'WISHLIST' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px]">Saved</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('MY_BOOKINGS')}
          className={`flex flex-col items-center gap-1 relative ${
            activeTab === 'MY_BOOKINGS' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[10px]">Bookings</span>
        </button>

        {currentUser.role === 'HOST' ? (
          <button
            onClick={() => setActiveTab('HOST_DASHBOARD')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'HOST_DASHBOARD' ? 'text-amber-600 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px]">Host</span>
          </button>
        ) : currentUser.role === 'ADMIN' ? (
          <button
            onClick={() => setActiveTab('ADMIN_PANEL')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'ADMIN_PANEL' ? 'text-purple-600 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px]">Admin</span>
          </button>
        ) : (
          <button
            onClick={() => handleRoleChange('HOST')}
            className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
          >
            <Building2 className="w-5 h-5 text-amber-500" />
            <span className="text-[10px]">Become Host</span>
          </button>
        )}
      </div>
    </>
  );
};
