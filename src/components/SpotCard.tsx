import React from 'react';
import { HiddenSpot } from '../types';
import { CATEGORY_LABELS, SECRET_LEVEL_LABELS } from '../data/hiddenSpots';
import { CalendarPlus, Bookmark, MapPin, Clock, Eye, Sparkles, Star, Footprints, ExternalLink } from 'lucide-react';

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
      className="group bg-white rounded-3xl border border-stone-200/60 shadow-sm hover:shadow-2xl hover:shadow-amber-500/8 hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden cursor-pointer"
      onClick={() => onSelectSpot(spot)}
    >
      {/* Card Image */}
      <div className="relative h-52 bg-stone-100 overflow-hidden shrink-0">
        <img
          src={spot.imageUrl}
          alt={spot.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-600/10 group-hover:from-amber-500/10 transition-all duration-500" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-lg ${secretInfo.badgeClass}`}>
            {secretInfo.label}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(spot);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110'
                : 'bg-stone-900/40 text-stone-200 hover:bg-rose-500/80 hover:text-white hover:scale-110'
            }`}
            title="Favoris"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom City & Rating */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium text-white text-[11px] bg-stone-900/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{spot.city}</span>
          </div>
          <div className="flex items-center gap-1 bg-stone-900/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-white">{spot.rating}</span>
            <span className="text-stone-400 text-[10px]">({spot.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${categoryInfo.bg} ${categoryInfo.color}`}>
              {categoryInfo.name}
            </span>
            <span className="text-[10px] text-stone-400 flex items-center gap-1">
              <Footprints className="w-3 h-3" />
              ~{spot.estimatedDurationMinutes} min
            </span>
          </div>

          <h3 className="font-display font-bold text-stone-900 text-lg group-hover:text-amber-700 transition-colors leading-snug">
            {spot.title}
          </h3>

          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
            {spot.subtitle || spot.description}
          </p>
        </div>

        {/* Secret Hint Preview */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-3 border border-amber-200/60 text-[11px] text-amber-900 line-clamp-2">
          <span className="font-bold text-amber-950 flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Secret
          </span>
          {spot.secretAccessHint}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCalendar(spot);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm shadow-amber-500/20 transition-all active:scale-95 hover:shadow-md hover:shadow-amber-500/25"
              title="Ajouter au calendrier de voyage"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>+ Calendrier</span>
            </button>
            {spot.websiteUrl && (
              <a
                href={spot.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 hover:shadow-md"
                title="Visiter le site"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Site web</span>
              </a>
            )}
          </div>

          <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Voir détails
          </span>
        </div>
      </div>
    </div>
  );
};
