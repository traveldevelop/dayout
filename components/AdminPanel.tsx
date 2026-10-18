'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Property, Booking, Category } from '@/types/dayout';
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
  Layers
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    properties, 
    bookings, 
    syncs, 
    updatePropertyStatus, 
    updateBookingStatus, 
    commissionRatePercent, 
    setCommissionRatePercent 
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'LISTINGS_APPROVAL' | 'GLOBAL_BOOKINGS' | 'COMMISSION' | 'WEBHOOK_LOGS'>('LISTINGS_APPROVAL');

  const pendingProperties = properties.filter(p => p.status === 'PENDING');
  const approvedProperties = properties.filter(p => p.status === 'APPROVED');
  const totalGlobalRevenue = bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.totalPriceLKR, 0);
  const platformEarnings = Math.round(totalGlobalRevenue * (commissionRatePercent / 100));

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
            Approve host listings, control platform commission rates, oversee global bookings, and monitor Channel Manager webhooks.
          </p>
        </div>
      </div>

      {/* Admin Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Review</span>
          <p className="text-2xl font-black text-amber-600">{pendingProperties.length} Listings</p>
          <p className="text-[10px] text-slate-400">Requires admin approval</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Live Listings</span>
          <p className="text-2xl font-black text-emerald-600">{approvedProperties.length} Active</p>
          <p className="text-[10px] text-slate-400">Across 6 core categories</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Platform Commission</span>
          <p className="text-2xl font-black text-purple-600">{commissionRatePercent}% Rate</p>
          <p className="text-[10px] text-slate-400">Yield: LKR {platformEarnings.toLocaleString()}</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Global Bookings</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{bookings.length} Total</p>
          <p className="text-[10px] text-slate-400">Volume: LKR {totalGlobalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'LISTINGS_APPROVAL', label: `Pending Approvals (${pendingProperties.length})`, icon: Building2 },
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
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 flex-shrink-0 transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-purple-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LISTINGS APPROVAL */}
      {activeAdminTab === 'LISTINGS_APPROVAL' && (
        <div className="space-y-6">
          <h2 className="text-xl font-black">Property & Host Application Approvals</h2>

          {pendingProperties.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm">All pending properties have been reviewed!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingProperties.map(prop => (
                <div key={prop.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
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

                  <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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

      {/* TAB 2: GLOBAL BOOKINGS */}
      {activeAdminTab === 'GLOBAL_BOOKINGS' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-black">All Platform Reservations</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Admin Fee ({commissionRatePercent}%)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
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

      {/* TAB 3: COMMISSION SETTINGS */}
      {activeAdminTab === 'COMMISSION' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl mx-auto space-y-6">
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

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 text-xs font-semibold space-y-1">
              <p>💡 Calculated Platform Earnings on LKR 100,000 booking:</p>
              <p className="font-extrabold text-sm">
                LKR {(100000 * (commissionRatePercent / 100)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WEBHOOK LOGS */}
      {activeAdminTab === 'WEBHOOK_LOGS' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
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
