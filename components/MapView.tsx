'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/types/dayout';
import { MapPin, Star, Eye, Calendar, Sparkles, ArrowRight } from 'lucide-react';

interface MapViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  bookingType: 'DAYOUT' | 'NIGHT_STAY' | 'ALL';
}

export const MapView: React.FC<MapViewProps> = ({ properties, onSelectProperty, bookingType }) => {
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // defer map client mount asynchronously
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Sri Lanka center coordinates
  const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-amber-50/50 dark:bg-slate-900/50 rounded-2xl animate-pulse flex items-center justify-center text-slate-400">
        Loading Interactive Sri Lanka Map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[650px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 text-white">
      {/* Dynamic Leaflet Map Container */}
      <LeafletContainer 
        properties={properties} 
        onSelectProperty={(p) => {
          setSelectedProp(p);
        }} 
        bookingType={bookingType}
      />

      {/* Floating Selected Property Preview Card (3D Glass) */}
      {selectedProp && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[1000] glass-panel rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/90 text-slate-900 transition-all animate-in fade-in slide-in-from-bottom-4">
          <Link href={`/property/${selectedProp.id}`} className="block group cursor-pointer no-underline">
            <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3 bg-slate-100">
              <img 
                src={selectedProp.featuredImage} 
                alt={selectedProp.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-black px-2.5 py-1 rounded-full border border-white/90 shadow-sm">
                {selectedProp.category}
              </span>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedProp(null);
                }}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer z-10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {selectedProp.city}
                </span>
                <span className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {selectedProp.rating} ({selectedProp.reviewCount})
                </span>
              </div>

              <h4 className="font-black text-base text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                {selectedProp.title}
              </h4>
              
              {selectedProp.dayoutPackage && (
                <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                  ☀️ Dayout: {selectedProp.dayoutPackage.timeSlot}
                </p>
              )}

              <div className="pt-3 flex items-center justify-between border-t border-slate-200/60 mt-2">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block">From</span>
                  <span className="text-lg font-black text-slate-900">
                    LKR {selectedProp.pricePerDayoutLKR.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium"> / dayout</span>
                </div>

                <span className="btn-3d-emerald text-white font-black text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform">
                  View Page <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

// Internal client component loading Leaflet dynamically
const LeafletContainer: React.FC<{
  properties: Property[];
  onSelectProperty: (p: Property) => void;
  bookingType: 'DAYOUT' | 'NIGHT_STAY' | 'ALL';
}> = ({ properties, onSelectProperty, bookingType }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const onSelectPropertyRef = React.useRef(onSelectProperty);
  useEffect(() => {
    onSelectPropertyRef.current = onSelectProperty;
  }, [onSelectProperty]);

  useEffect(() => {
    let mapInstance: any = null;
    let isCancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      if (isCancelled) return;

      const container = document.getElementById('sri-lanka-map-leaflet');
      if (!container) return;

      // Clear container if previously initialized
      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
        container.innerHTML = '';
      }

      // Initialize map centered at Kandy / Central Sri Lanka
      mapInstance = L.map('sri-lanka-map-leaflet', {
        center: [7.8731, 80.7718],
        zoom: 8,
        scrollWheelZoom: false,
      });

      // Dark styled tile layer or standard OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Ceylon DayOuts Sri Lanka Map',
        maxZoom: 18,
      }).addTo(mapInstance);

      // Add Price Badge Custom Markers for each property
      properties.forEach(prop => {
        const price = bookingType === 'NIGHT_STAY' ? prop.pricePerNightLKR : prop.pricePerDayoutLKR;
        const priceLabel = `LKR ${(price / 1000).toFixed(0)}k`;

        const priceIcon = L.divIcon({
          className: 'custom-price-pin',
          html: `
            <div style="
              background: #059669; 
              color: white; 
              font-weight: 800; 
              font-size: 11px; 
              padding: 4px 8px; 
              border-radius: 20px; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
              border: 2px solid white;
              white-space: nowrap;
              cursor: pointer;
              transition: transform 0.2s ease;
            " class="hover:scale-110">
              ${priceLabel}
            </div>
          `,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const marker = L.marker([prop.lat, prop.lng], { icon: priceIcon }).addTo(mapInstance);

        marker.on('click', () => {
          onSelectPropertyRef.current(prop);
        });
      });

      if (!isCancelled) {
        setMapLoaded(true);
      }
    };

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [properties, bookingType]);

  return (
    <div id="sri-lanka-map-leaflet" className="w-full h-full z-1">
      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center text-slate-300 font-medium">
          Rendering Sri Lanka Interactive Map Pins...
        </div>
      )}
    </div>
  );
};
