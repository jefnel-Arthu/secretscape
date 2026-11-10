import React, { useEffect, useState } from 'react';
import { HiddenSpot, VisitorPhoto } from '../types';
import { CATEGORY_LABELS } from '../data/hiddenSpots';
import {
  X,
  MapPin,
  CalendarPlus,
  Bookmark,
  Navigation,
  Camera,
  ImagePlus,
} from 'lucide-react';
import { openInGoogleMaps } from '../lib/googleMaps';
import { loadLocalPhotos } from '../lib/visitorPhotos';

interface SpotDetailModalProps {
  spot: HiddenSpot | null;
  onClose: () => void;
  onAddToCalendar: (spot: HiddenSpot) => void;
  onToggleFavorite: (spot: HiddenSpot) => void;
  onAddPhoto?: (spot: HiddenSpot) => void;
  onViewAllPhotos?: (spot: HiddenSpot) => void;
  isFavorite: boolean;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  onClose,
  onAddToCalendar,
  onToggleFavorite,
  onAddPhoto,
  onViewAllPhotos,
  isFavorite,
}) => {
  const [visitorPhotos, setVisitorPhotos] = useState<VisitorPhoto[]>([]);

  useEffect(() => {
    if (!spot) {
      setVisitorPhotos([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/visitor-photos?spotId=${encodeURIComponent(spot.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          const local = loadLocalPhotos().filter((p) => p.spotId === spot.id);
          const serverIds = new Set((data.photos || []).map((p: VisitorPhoto) => p.id));
          setVisitorPhotos([...local.filter((p) => !serverIds.has(p.id)), ...(data.photos || [])]);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [spot?.id]);

  if (!spot) return null;

  const categoryInfo = CATEGORY_LABELS[spot.category] || {
    name: 'Lieu secret',
    color: 'text-stone-700',
    bg: 'bg-stone-100',
  };

  const fullText = spot.description || spot.subtitle || '';

  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden m-auto animate-in zoom-in-95 duration-200">

        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 bg-stone-900 overflow-hidden">
          <img
            src={spot.imageUrl}
            alt={spot.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

          {/* Top actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(spot)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-stone-900/60 text-stone-200 hover:bg-stone-900/80 hover:text-white'
              }`}
              title="Favoris"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md transition-all duration-200"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
              <span className={`px-2 py-0.5 rounded-md ${categoryInfo.bg} ${categoryInfo.color} font-bold text-[10px]`}>
                {categoryInfo.name}
              </span>
              <span className="flex items-center gap-1 text-stone-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {spot.city}
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white drop-shadow-lg">
              {spot.title}
            </h2>
            {spot.subtitle && (
              <p className="text-stone-200 text-xs sm:text-sm">{spot.subtitle}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[55vh] overflow-y-auto">
          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-stone-900 text-lg flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded-full" />
              À propos de ce lieu
            </h3>
            {spot.subtitle && spot.subtitle !== spot.description && (
              <p className="text-stone-800 text-sm sm:text-base font-medium leading-relaxed">
                {spot.subtitle}
              </p>
            )}
            <p className="text-stone-700 text-sm sm:text-base leading-7 whitespace-pre-line">
              {fullText}
            </p>
          </div>

          {/* Visitor Photos */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-display font-bold text-stone-900 text-base flex items-center gap-2">
                <span className="w-1 h-5 bg-amber-500 rounded-full" />
                <Camera className="w-4 h-4 text-amber-500" />
                Souvenirs des visiteurs
                {visitorPhotos.length > 0 && (
                  <span className="text-xs text-stone-400 font-normal">({visitorPhotos.length})</span>
                )}
              </h4>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddPhoto?.(spot); }}
                className="flex items-center gap-1.5 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors shrink-0"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                Ajouter ma photo
              </button>
            </div>

            {visitorPhotos.length === 0 ? (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center">
                <p className="text-xs text-stone-500">
                  Soyez le premier explorateur à partager sa photo ici !
                </p>
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {visitorPhotos.slice(0, 10).map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => onViewAllPhotos?.(spot)}
                    className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border border-stone-200 group hover:border-amber-500/60 transition-colors"
                    title={`${photo.visitorName} — ${new Date(photo.createdAt).toLocaleDateString('fr-FR')}`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={`Souvenir de ${photo.visitorName}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </button>
                ))}
                {visitorPhotos.length > 10 && (
                  <button
                    onClick={() => onViewAllPhotos?.(spot)}
                    className="shrink-0 w-20 h-20 rounded-2xl bg-stone-900 text-white flex flex-col items-center justify-center gap-0.5 hover:bg-stone-800 transition-colors"
                  >
                    <span className="text-base font-black">+{visitorPhotos.length - 10}</span>
                    <span className="text-[9px] font-semibold text-stone-400">Voir tout</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-stone-50/80 backdrop-blur-sm border-t border-stone-200 p-4 sm:p-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (spot) openInGoogleMaps(spot); onClose(); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Y aller</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCalendar(spot);
              onClose();
            }}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/25 transition-all"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Ajouter au calendrier</span>
          </button>
        </div>

      </div>
    </div>
  );
};
