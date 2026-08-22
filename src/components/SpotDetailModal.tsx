import React, { useState } from 'react';
import { HiddenSpot } from '../types';
import { CATEGORY_LABELS, SECRET_LEVEL_LABELS } from '../data/hiddenSpots';
import {
  X,
  MapPin,
  Clock,
  CalendarPlus,
  Bookmark,
  Compass,
  Volume2,
  VolumeX,
  Navigation,
  Users,
  Star,
  Sun,
  ExternalLink,
} from 'lucide-react';

interface SpotDetailModalProps {
  spot: HiddenSpot | null;
  onClose: () => void;
  onAddToCalendar: (spot: HiddenSpot) => void;
  onToggleFavorite: (spot: HiddenSpot) => void;
  isFavorite: boolean;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  onClose,
  onAddToCalendar,
  onToggleFavorite,
  isFavorite,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedGps, setCopiedGps] = useState<boolean>(false);

  if (!spot) return null;

  const categoryInfo = CATEGORY_LABELS[spot.category] || {
    name: 'Lieu secret',
    color: 'text-stone-700',
    bg: 'bg-stone-100',
  };

  const secretInfo = SECRET_LEVEL_LABELS[spot.secretLevel] || {
    label: 'Cache',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(`${spot.coordinates.lat}, ${spot.coordinates.lng}`);
    setCopiedGps(true);
    setTimeout(() => setCopiedGps(false), 2000);
  };

  const toggleAudioGuide = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(
        `${spot.title}. ${spot.subtitle}. ${spot.description}. Astuce d'acces: ${spot.secretAccessHint}`
      );
      utterance.lang = 'fr-FR';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">

        {/* Top Hero Image Banner */}
        <div className="relative h-72 sm:h-80 bg-stone-900 overflow-hidden">
          <img
            src={spot.imageUrl}
            alt={spot.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />

          {/* Close & Favorite Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${secretInfo.badgeClass}`}>
              {secretInfo.label}
            </span>

            <div className="flex items-center gap-2">
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
                className="p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md transition-all duration-200 hover:shadow-lg"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
              <span className={`px-2 py-0.5 rounded-md ${categoryInfo.bg} ${categoryInfo.color} font-bold text-[10px]`}>
                {categoryInfo.name}
              </span>
              <span className="text-stone-400">/</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {spot.city}, {spot.region}
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white drop-shadow-lg">
              {spot.title}
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm drop-shadow">
              {spot.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Duration - Amber */}
            <div className="relative bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 overflow-hidden group hover:shadow-md transition-shadow duration-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-[3rem] opacity-60" />
              <span className="relative text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Duree estimee</span>
              <span className="relative text-stone-900 font-bold text-sm flex items-center gap-1.5 mt-1">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                </span>
                {spot.estimatedDurationMinutes} min
              </span>
            </div>

            {/* Rating - Yellow */}
            <div className="relative bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 overflow-hidden group hover:shadow-md transition-shadow duration-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-100 rounded-bl-[3rem] opacity-60" />
              <span className="relative text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Note explorateurs</span>
              <span className="relative text-stone-900 font-bold text-sm flex items-center gap-1.5 mt-1">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-yellow-100">
                  <Star className="w-3.5 h-3.5 text-yellow-600" />
                </span>
                {spot.rating}/5 <span className="text-stone-400 font-normal text-xs">({spot.reviewCount})</span>
              </span>
            </div>

            {/* Crowd - Emerald */}
            <div className="relative bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 overflow-hidden group hover:shadow-md transition-shadow duration-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100 rounded-bl-[3rem] opacity-60" />
              <span className="relative text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Frequentation</span>
              <span className="relative text-stone-900 font-bold text-sm flex items-center gap-1.5 mt-1">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-100">
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                </span>
                {spot.crowdLevel === 'faible' ? 'Tres calme' : spot.crowdLevel === 'modere' ? 'Moderee' : 'Frequentee'}
              </span>
            </div>

            {/* Best Time - Blue */}
            <div className="relative bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 overflow-hidden group hover:shadow-md transition-shadow duration-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-[3rem] opacity-60" />
              <span className="relative text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Meilleure heure</span>
              <span className="relative text-stone-900 font-bold text-xs flex items-center gap-1.5 mt-1 truncate" title={spot.bestTimeToVisit}>
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 shrink-0">
                  <Sun className="w-3.5 h-3.5 text-blue-600" />
                </span>
                <span className="truncate">{spot.bestTimeToVisit}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-stone-900 text-base flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded-full" />
              Histoire & Recit du lieu
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              {spot.description}
            </p>
          </div>

          {/* Secret Access Hint Highlight Box */}
          <div className="bg-gradient-to-br from-amber-50 via-amber-50/80 to-amber-100/50 border border-amber-200/80 rounded-2xl p-4 space-y-2.5 text-amber-950 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-200/60">
                  <Compass className="w-4.5 h-4.5 text-amber-700" />
                </span>
                <span>Guide & Instructions Secretes d'Acces</span>
              </div>

              {/* Audio Guide button */}
              <button
                onClick={toggleAudioGuide}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 shadow-sm'
                    : 'bg-amber-200/70 hover:bg-amber-200 text-amber-900 hover:shadow-sm'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Arreter la voix</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ecouter le guide</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-amber-900/80 text-xs sm:text-sm leading-relaxed pl-10">
              {spot.secretAccessHint}
            </p>
          </div>

          {/* Address & GPS */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-stone-400 font-bold uppercase block text-[10px] tracking-wider">Adresse exacte</span>
              <span className="text-stone-800 font-semibold text-xs">{spot.address}</span>
            </div>

            <button
              onClick={handleCopyCoordinates}
              className={`text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-all duration-200 border ${
                copiedGps
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 hover:shadow-sm'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600" />
              <span>{copiedGps ? 'GPS Copie !' : 'Copier Coordonnees GPS'}</span>
            </button>
          </div>

          {/* Website Link */}
          {spot.websiteUrl && (
            <a
              href={spot.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                fetch('/api/track/action', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ type: 'external_link', detail: `Clic site externe: ${spot.title} → ${spot.websiteUrl}`, spotId: spot.id }),
                }).catch(() => {});
              }}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-5 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visiter le site</span>
            </a>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {spot.tags.map((tag) => {
              const tagColors: Record<string, string> = {
                nature: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
                culture: 'bg-violet-50 text-violet-700 border-violet-200/60',
                histoire: 'bg-amber-50 text-amber-700 border-amber-200/60',
                art: 'bg-rose-50 text-rose-700 border-rose-200/60',
                gastronomie: 'bg-orange-50 text-orange-700 border-orange-200/60',
                architecture: 'bg-blue-50 text-blue-700 border-blue-200/60',
                sport: 'bg-red-50 text-red-700 border-red-200/60',
                marche: 'bg-teal-50 text-teal-700 border-teal-200/60',
              };
              const defaultTag = 'bg-stone-100 text-stone-600 border-stone-200/60';
              const tagLower = tag.toLowerCase();
              const matchedKey = Object.keys(tagColors).find((k) => tagLower.includes(k));
              const colorClass = matchedKey ? tagColors[matchedKey] : defaultTag;

              return (
                <span
                  key={tag}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${colorClass}`}
                >
                  #{tag}
                </span>
              );
            })}
          </div>

        </div>

        {/* Modal Footer Fixed Actions */}
        <div className="bg-stone-50/80 backdrop-blur-sm border-t border-stone-200 p-4 sm:p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-stone-500 font-semibold text-xs hover:text-stone-700 hover:bg-stone-200/70 rounded-xl transition-all duration-200"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              onAddToCalendar(spot);
              onClose();
            }}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-stone-950 font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-200 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Ajouter a mon calendrier</span>
          </button>
        </div>

      </div>
    </div>
  );
};
