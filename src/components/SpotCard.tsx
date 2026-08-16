import React from 'react';
import { HiddenSpot } from '../types';
import { CATEGORY_LABELS, SECRET_LEVEL_LABELS } from '../data/hiddenSpots';
import { CalendarPlus, Bookmark, MapPin, Clock, Eye, Sparkles } from 'lucide-react';

interface SpotCardProps {
  spot: HiddenSpot;
  onSelectSpot: (spot: HiddenSpot) => void;
  onAddToCalendar: (spot: HiddenSpot) => void;
  onToggleFavorite: (spot: HiddenSpot) => void;
  isFavorite: boolean;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  onSelectSpot,
  onAddToCalendar,
  onToggleFavorite,
  isFavorite,
}) => {
  const categoryInfo = CATEGORY_LABELS[spot.category] || {
    name: 'Lieu secret',
    color: 'text-stone-700',
    bg: 'bg-stone-100',
  };

  const secretInfo = SECRET_LEVEL_LABELS[spot.secretLevel] || {
    label: 'Caché',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  return (
    <div 
      className="group bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
      onClick={() => onSelectSpot(spot)}
    >
      {/* Card Image */}
      <div className="relative h-48 bg-stone-100 overflow-hidden shrink-0">
        <img
          src={spot.imageUrl}
          alt={spot.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${secretInfo.badgeClass}`}>
            {secretInfo.label}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(spot);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-stone-900/40 text-stone-200 hover:bg-stone-900/70'
            }`}
            title="Favoris"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom City & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-medium text-stone-200 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{spot.city}</span>
          </div>
          <div className="flex items-center gap-1 bg-stone-900/60 px-2 py-0.5 rounded-full backdrop-blur-sm text-[11px] font-semibold">
            <span className="text-amber-400">★</span>
            <span>{spot.rating}</span>
            <span className="text-stone-400 text-[10px]">({spot.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${categoryInfo.bg} ${categoryInfo.color}`}>
              {categoryInfo.name}
            </span>
          </div>

          <h3 className="font-display font-bold text-stone-900 text-base group-hover:text-amber-700 transition-colors leading-snug">
            {spot.title}
          </h3>

          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
            {spot.subtitle || spot.description}
          </p>
        </div>

        {/* Secret Hint Preview */}
        <div className="bg-amber-50/60 rounded-xl p-2.5 border border-amber-200/50 text-[11px] text-amber-900 line-clamp-2">
          <span className="font-bold text-amber-950">Secret: </span>
          {spot.secretAccessHint}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{spot.estimatedDurationMinutes} min</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCalendar(spot);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            title="Ajouter au calendrier de voyage"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>+ Calendrier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
