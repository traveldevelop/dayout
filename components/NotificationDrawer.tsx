'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  RefreshCw, 
  Calendar, 
  ShieldCheck, 
  CheckCheck
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/35 backdrop-blur-md flex justify-end animate-in fade-in">
      <div className="bg-white/90 backdrop-blur-2xl w-full max-w-md h-full shadow-[0_0_50px_rgba(0,0,0,0.15)] border-l border-white/80 flex flex-col text-slate-900">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md border-t border-white/40">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Push Notifications</h3>
              <p className="text-[10px] text-slate-400 font-medium">Live booking alerts & channel sync events</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-emerald-700 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Read All
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  notif.read 
                    ? 'bg-white/60 border-slate-200/60 text-slate-600 hover:bg-white shadow-2xs' 
                    : 'bg-emerald-50/80 border-emerald-300 text-slate-900 font-medium shadow-[0_4px_12px_rgba(16,185,129,0.1)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    {notif.type === 'BOOKING' && <Calendar className="w-3.5 h-3.5" />}
                    {notif.type === 'SYNC' && <RefreshCw className="w-3.5 h-3.5" />}
                    {notif.type === 'APPROVAL' && <ShieldCheck className="w-3.5 h-3.5" />}
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                </div>

                <p className="text-xs leading-relaxed">
                  {notif.message}
                </p>

                {!notif.read && (
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
