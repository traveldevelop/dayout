'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Category } from '@/types/dayout';
import { 
  Building2, 
  Home, 
  TreePine, 
  Sparkles, 
  DoorClosed, 
  Tent, 
  Layers
} from 'lucide-react';

export const CATEGORIES_CONFIG: {
  id: Category | 'ALL';
  label: string;
  sublabel: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'ALL',
    label: 'All Staycations',
    sublabel: 'Explore all options',
    icon: Layers,
  },
  {
    id: 'HOTEL',
    label: 'Hotels & Resorts',
    sublabel: 'Pool Passes & Buffets',
    icon: Building2,
  },
  {
    id: 'VILLA',
    label: 'Private Villas',
    sublabel: 'Exclusivity & Infinity Pools',
    icon: Home,
  },
  {
    id: 'CABANA',
    label: 'Eco Cabanas',
    sublabel: 'Jungle & Waterfall Views',
    icon: TreePine,
  },
  {
    id: 'COTTAGE',
    label: 'Cottages',
    sublabel: 'Tea Estates & Colonial Style',
    icon: Sparkles,
  },
  {
    id: 'ROOM',
    label: 'Rooms',
    sublabel: 'Boutique Transit & Day Use',
    icon: DoorClosed,
  },
  {
    id: 'UNIQUE',
    label: 'Unique Staycations',
    sublabel: 'Treehouses, Glamping & Houseboats',
    icon: Tent,
  },
];

export const CategorySelector: React.FC = () => {
  const { filters, setFilters } = useApp();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Explore by Category
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            System-wide standardized accommodation types
          </p>
        </div>
      </div>

      {/* Horizontal Carousel Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none">
        {CATEGORIES_CONFIG.map((cat) => {
          const Icon = cat.icon;
          const isSelected = filters.category === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left cursor-pointer ${
                isSelected
                  ? 'btn-3d-emerald text-white shadow-[0_10px_25px_rgba(16,185,129,0.3)] scale-[1.02]'
                  : 'bg-white/80 backdrop-blur-md border border-white/90 text-slate-700 shadow-[0_4px_14px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] hover:bg-white hover:border-emerald-300 hover:shadow-[0_10px_25px_rgba(16,185,129,0.12)] hover:-translate-y-1'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${
                isSelected 
                  ? 'bg-white/20 text-white shadow-inner' 
                  : 'bg-gradient-to-tr from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-100/80 shadow-xs'
              }`}>
                <Icon className="w-5 h-5 drop-shadow-xs" />
              </div>

              <div>
                <p className="text-xs font-black tracking-tight line-clamp-1">
                  {cat.label}
                </p>
                <p className={`text-[10px] font-medium line-clamp-1 ${
                  isSelected ? 'text-emerald-100 font-semibold' : 'text-slate-400'
                }`}>
                  {cat.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
