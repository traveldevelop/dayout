'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  PhoneCall, 
  MessageCircle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Utensils, 
  Send, 
  Building2, 
  ShieldCheck, 
  ExternalLink,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';

interface ContactsViewProps {
  onSelectProperty?: (propertyId: string) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = () => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryGuests, setInquiryGuests] = useState('4');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const whiteLotusWhatsApp = '94718805858';
  const whiteLotusPhone1 = '0252226094';
  const whiteLotusPhone2 = '0718805858';

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello White Lotus Resort,\nName: ${inquiryName || 'Guest'}\nPhone: ${inquiryPhone || 'Not provided'}\nDate: ${inquiryDate || 'Upcoming'}\nGuests: ${inquiryGuests}\nInquiry: ${inquiryMessage || 'I would like to inquire about room packages and booking.'}`;
    const url = `https://wa.me/${whiteLotusWhatsApp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-black tracking-widest uppercase bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full border border-emerald-200">
          Official Contacts & Inquiries
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          සම්බන්ධීකරණ සහ Booking තොරතුරු
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          White Lotus Holiday Resort සහ Ceylon DayOuts සඳහා සෘජු දුරකථන අංක, WhatsApp සහ විස්තර මෙතැනින් ලබා ගන්න.
        </p>
      </div>

      {/* Main Spotlight Card: White Lotus Holiday Resort */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-2xl border-2 border-emerald-500/40 space-y-8 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/15 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
                Verified Resort Hotline
              </span>
              <span className="text-xs font-bold text-slate-300">
                Anuradhapura
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              “White Lotus” Holiday Resort ❤️
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl font-medium">
              අනුරාධපුර වන්දනාවේ එන ඔබට ගෙදර වගේ නිදහසේ නවාතැන් ගන්න, පූජා නගරයට විනාඩි 5කින් ළගා වෙන්න පුලුවන් සුවපහසු Holiday Resort එක.
            </p>
          </div>

          <Link
            href="/property/dayout-prop-02"
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-emerald-50 font-black text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <span>View Full Packages & Rates</span>
            <ExternalLink className="w-4 h-4 text-emerald-700" />
          </Link>
        </div>

        {/* Contact Numbers & WhatsApp Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hotline 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">
                Direct Hotline (ලෑන්ඩ්ලයින්)
              </span>
              <p className="text-xl font-black text-white">{whiteLotusPhone1}</p>
              <p className="text-[11px] text-slate-300">Call for immediate room availability & rates</p>
            </div>
            <a
              href={`tel:${whiteLotusPhone1}`}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call: {whiteLotusPhone1}</span>
            </a>
          </div>

          {/* Hotline 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">
                Mobile / Reservations (ජංගම)
              </span>
              <p className="text-xl font-black text-white">{whiteLotusPhone2}</p>
              <p className="text-[11px] text-slate-300">Booking inquiries & group reservations</p>
            </div>
            <a
              href={`tel:${whiteLotusPhone2}`}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {whiteLotusPhone2}</span>
            </a>
          </div>

          {/* WhatsApp Direct */}
          <div className="bg-emerald-600/30 backdrop-blur-md rounded-2xl p-5 border border-emerald-400/40 flex flex-col justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-200 tracking-wider">
                Official WhatsApp
              </span>
              <p className="text-xl font-black text-white">wa.me/+94718805858</p>
              <p className="text-[11px] text-emerald-100">Instant Chat & Room Photos on WhatsApp</p>
            </div>
            <a
              href={`https://wa.me/${whiteLotusWhatsApp}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20booking%20White%20Lotus%20Holiday%20Resort.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Highlights & Specific Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-white">පූජා නගරයට විනාඩි 5 යි</p>
              <p className="text-slate-300 text-[11px]">Just 5 minutes to Anuradhapura sacred sites and temples.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <Utensils className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-white">Vedda Sappayama Delivery</p>
              <p className="text-slate-300 text-[11px]">නොමිලේ ආහාර delivery පහසුකම (Free meals delivery from Vedda Sappayama).</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-white">කිරි ආහාර සැකසීමේ පහසුකම්</p>
              <p className="text-slate-300 text-[11px]">Free arrangements and kitchen access for preparing Kiri Ahara.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: WhatsApp Inquiry Composer & General Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Quick Message Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Direct WhatsApp Messenger
            </span>
            <h4 className="text-xl font-black text-slate-900 mt-2">
              WhatsApp හරහා ක්ෂණික පණිවිඩයක් යවන්න
            </h4>
            <p className="text-xs text-slate-500">
              ඔබගේ නම සහ දිනය සටහන් කර කෙලින්ම WhatsApp හරහා Reservation අංශයට පණිවිඩය යවන්න.
            </p>
          </div>

          <form onSubmit={handleSendViaWhatsApp} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-slate-700">Your Name (නම):</label>
              <input
                type="text"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                placeholder="e.g. Kasun Silva"
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:outline-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700">Phone Number:</label>
                <input
                  type="tel"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="07x xxxxxxx"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:outline-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">Expected Date:</label>
                <input
                  type="date"
                  value={inquiryDate}
                  onChange={(e) => setInquiryDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700">Guests Count (පිරිස):</label>
              <select
                value={inquiryGuests}
                onChange={(e) => setInquiryGuests(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:outline-emerald-500"
              >
                <option value="3 Guests">3 Guests (Upper Floor)</option>
                <option value="4 Guests">4 Guests (Standard / Upper Floor)</option>
                <option value="6 Guests">6 Guests (Upper Floor Group Room)</option>
                <option value="10 Guests">10 Guests Group Special (Rs. 11,000 - 16,000)</option>
                <option value="21 Guests">Entire Property (21 Guests - Rs. 25,000 / 30,000)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700">Message / Special Requests (අමතර විස්තර):</label>
              <textarea
                rows={3}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="AC / Non-AC, Kitchen අවශ්‍යද, කිරි ආහාර සූදානම ආදිය..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:outline-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message to WhatsApp (0718805858)</span>
            </button>
            {submitted && (
              <p className="text-[11px] text-emerald-600 font-bold text-center">
                ✓ Opening WhatsApp chat with your inquiry details...
              </p>
            )}
          </form>
        </div>

        {/* General Ceylon DayOuts Concierge Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base">Booking & Guest Support Desk</h4>
                <p className="text-xs text-slate-500">Ceylon DayOuts Customer Concierge</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Service Hours</span>
                <span className="font-bold text-slate-800">24/7 Hotline & Online Inquiries</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Payment Options</span>
                <span className="font-bold text-slate-800">Card, Bank Transfer, PayHere</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-medium">Cancellation & Rescheduling</span>
                <span className="font-bold text-slate-800">Direct host approval & 24hr notice</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-slate-700 space-y-2">
            <h5 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Check-In & Stay Times
            </h5>
            <ul className="text-xs space-y-1 text-slate-600">
              <li>• <strong>Dayout Package Hours:</strong> 08:30 AM - 05:30 PM</li>
              <li>• <strong>Night Stay Check-in:</strong> 02:00 PM | <strong>Check-out:</strong> 11:00 AM</li>
              <li>• <strong>Kiri Ahara Early Morning Access:</strong> Available upon request</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
