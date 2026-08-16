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
  Share2, 
  Volume2, 
  VolumeX, 
  Check, 
  Navigation,
  Eye,
  Users
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
    label: 'Caché',
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
        `${spot.title}. ${spot.subtitle}. ${spot.description}. Astuce d'accès: ${spot.secretAccessHint}`
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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close & Favorite Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${secretInfo.badgeClass}`}>
              {secretInfo.label}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(spot)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isFavorite
                    ? 'bg-rose-500 text-white shadow-lg'
                    : 'bg-stone-900/60 text-stone-200 hover:bg-stone-900/80'
                }`}
                title="Favoris"
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md transition-colors"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
              <span className={`px-2 py-0.5 rounded-md ${categoryInfo.bg} ${categoryInfo.color} font-bold text-[10px]`}>
                {categoryInfo.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {spot.city}, {spot.region}
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              {spot.title}
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm">
              {spot.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Durée estimée</span>
              <span className="text-stone-900 font-bold text-sm flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-amber-600" />
                {spot.estimatedDurationMinutes} minutes
              </span>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Note explorateurs</span>
              <span className="text-stone-900 font-bold text-sm flex items-center gap-1 mt-0.5">
                <span className="text-amber-500">★</span>
                {spot.rating} / 5 <span className="text-stone-400 text-xs">({spot.reviewCount})</span>
              </span>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Fréquentation</span>
              <span className="text-stone-900 font-bold text-sm flex items-center gap-1 mt-0.5">
                <Users className="w-4 h-4 text-emerald-600" />
                {spot.crowdLevel === 'faible' ? 'Très calme' : spot.crowdLevel === 'modéré' ? 'Modérée' : 'Fréquenté'}
              </span>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Meilleure heure</span>
              <span className="text-stone-900 font-bold text-xs truncate block mt-0.5" title={spot.bestTimeToVisit}>
                {spot.bestTimeToVisit}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-stone-900 text-base">
              Histoire & Récit du lieu
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed">
              {spot.description}
            </p>
          </div>

          {/* Secret Access Hint Highlight Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2 text-amber-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                <Compass className="w-5 h-5 text-amber-600" />
                <span>Guide & Instructions Secrètes d'Accès</span>
              </div>

              {/* Audio Guide Simulation button */}
              <button
                onClick={toggleAudioGuide}
                className="text-xs bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                    <span>Arrêter la voix</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Écouter le guide</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-amber-900 text-xs sm:text-sm leading-relaxed">
              {spot.secretAccessHint}
            </p>
          </div>

          {/* Address & GPS */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-stone-400 font-bold uppercase block text-[10px]">Adresse exacte</span>
              <span className="text-stone-800 font-semibold text-xs">{spot.address}</span>
            </div>

            <button
              onClick={handleCopyCoordinates}
              className="bg-white hover:bg-stone-100 text-stone-700 font-semibold px-3 py-2 rounded-xl border border-stone-200 flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600" />
              <span>{copiedGps ? 'GPS Copié !' : 'Copier Coordonnées GPS'}</span>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {spot.tags.map((tag) => (
              <span key={tag} className="text-[11px] bg-stone-100 text-stone-600 font-medium px-2.5 py-1 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Modal Footer Fixed Actions */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 sm:p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-stone-600 font-semibold text-xs hover:bg-stone-200 rounded-xl transition-colors"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              onAddToCalendar(spot);
              onClose();
            }}
            className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Ajouter à mon calendrier</span>
          </button>
        </div>

      </div>
    </div>
  );
};
