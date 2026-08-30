import React, { useMemo, useState } from 'react';
import { HiddenSpot } from '../types';
import { CATEGORY_LABELS } from '../data/hiddenSpots';
import { Images, X, Camera, Star, MapPin } from 'lucide-react';

interface GalleryViewProps {
  spots: HiddenSpot[];
  onOpenSpot: (spot: HiddenSpot) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ spots, onOpenSpot }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [lightbox, setLightbox] = useState<{ spot: HiddenSpot; index: number } | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(spots.map(s => s.category)));
    return cats.filter(c => c !== 'transports').sort();
  }, [spots]);

  const filtered = useMemo(() => {
    const list = activeCategory === 'ALL'
      ? spots.filter(s => s.category !== 'transports')
      : spots.filter(s => s.category === activeCategory);
    return [...list].sort((a, b) => b.rating - a.rating);
  }, [spots, activeCategory]);

  const lightboxImages = useMemo(() => {
    if (!lightbox) return [];
    const imgs: string[] = [lightbox.spot.imageUrl];
    if (lightbox.spot.galleryImages?.length) imgs.push(...lightbox.spot.galleryImages);
    return imgs;
  }, [lightbox]);

  return (
    <div className="bg-stone-950 min-h-full">
      {/* Header */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 via-transparent to-stone-950" />
        <Camera className="w-10 h-10 text-amber-400 mx-auto mb-4" />
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
          Galerie <span className="text-amber-400">Photos</span>
        </h1>
        <p className="text-stone-400 text-sm max-w-lg mx-auto">
          Un regard sur les merveilles cachées du Bénin — cliquez sur une photo pour en savoir plus.
        </p>

        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'ALL'
                ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Tout
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {CATEGORY_LABELS[cat]?.name || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <div className="pb-24 text-center">
          <Images className="w-12 h-12 text-stone-700 mx-auto mb-3" />
          <p className="text-stone-500 text-sm">Aucune photo dans cette catégorie.</p>
        </div>
      ) : (
        <div className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((spot) => {
              const accent = CATEGORY_LABELS[spot.category]?.color || 'text-stone-400';
              return (
                <button
                  key={spot.id}
                  onClick={() => setLightbox({ spot, index: 0 })}
                  className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 text-left"
                  style={{ aspectRatio: `${3} / ${4}` }}
                >
                  <img
                    src={spot.imageUrl}
                    alt={spot.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Category badge */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-white/90 ${accent}`}>
                    {CATEGORY_LABELS[spot.category]?.name || spot.category}
                  </span>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-white font-bold text-base leading-tight group-hover:text-amber-300 transition-colors">
                      {spot.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="flex items-center gap-1 text-white/70 text-[11px]">
                        <MapPin className="w-3 h-3" />
                        {spot.city}
                      </span>
                      <span className="flex items-center gap-1 text-amber-300 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        {spot.rating}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 sm:p-8 bg-black/95">
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full">
            <img
              src={lightboxImages[lightbox.index] || lightbox.spot.imageUrl}
              alt={lightbox.spot.title}
              className="w-full max-h-[70vh] object-contain rounded-2xl"
            />
            <div className="text-center mt-6">
              <h3 className="text-white font-display font-bold text-xl">{lightbox.spot.title}</h3>
              <p className="text-stone-400 text-sm mt-1">{lightbox.spot.city} — <span className="text-amber-300">{lightbox.spot.rating} ★</span></p>
              <div className="flex justify-center gap-3 mt-4">
                {lightboxImages.length > 1 && lightbox.index > 0 && (
                  <button
                    onClick={() => setLightbox({ ...lightbox, index: lightbox.index - 1 })}
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    ← Précédent
                  </button>
                )}
                <button
                  onClick={() => { setLightbox(null); onOpenSpot(lightbox.spot); }}
                  className="text-xs font-bold px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors"
                >
                  Voir le lieu
                </button>
                {lightboxImages.length > 1 && lightbox.index < lightboxImages.length - 1 && (
                  <button
                    onClick={() => setLightbox({ ...lightbox, index: lightbox.index + 1 })}
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Suivant →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};