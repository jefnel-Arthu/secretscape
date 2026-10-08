import React, { useEffect, useMemo, useState } from 'react';
import { Camera, X, MapPin, ChevronLeft, ChevronRight, User, MessageSquare, ImagePlus, Loader2 } from 'lucide-react';
import { HiddenSpot, VisitorPhoto } from '../types';

interface VisitorPhotosViewProps {
  spots: HiddenSpot[];
  initialSpotId?: string | null;
  onAddPhoto?: (spotId?: string | null) => void;
}

export const VisitorPhotosView: React.FC<VisitorPhotosViewProps> = ({
  spots,
  initialSpotId,
  onAddPhoto,
}) => {
  const [photos, setPhotos] = useState<VisitorPhoto[]>([]);
  const [filterSpotId, setFilterSpotId] = useState<string | null>(initialSpotId || null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFilterSpotId(initialSpotId || null);
  }, [initialSpotId]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/visitor-photos');
        const data = await res.json();
        if (!cancelled) setPhotos(data.photos || []);
      } catch {
        if (!cancelled) setPhotos([]);
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const spotName = (id: string) => spots.find(s => s.id === id)?.title || 'Lieu secret';
  const spotCity = (id: string) => spots.find(s => s.id === id)?.city || '';

  const filtered = useMemo(
    () => (filterSpotId ? photos.filter(p => p.spotId === filterSpotId) : photos),
    [photos, filterSpotId]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i === null ? i : (i + 1) % filtered.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex === null, filtered.length]);

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;
  const currentSpotId = current?.spotId || null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="bg-stone-950 min-h-full">
      {/* Header */}
      <div className="relative py-14 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 via-transparent to-stone-950" />
        <Camera className="w-10 h-10 text-amber-400 mx-auto mb-4" />
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
          Souvenirs <span className="text-amber-400">des Explorateurs</span>
        </h1>
        <p className="text-stone-400 text-sm max-w-lg mx-auto">
          Les photos des voyageurs après leur passage dans ces lieux cachés du Bénin. Partagez le vôtre !
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setFilterSpotId(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterSpotId === null
                ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Tout
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">{photos.length}</span>
          </button>

          <select
            value={filterSpotId || ''}
            onChange={(e) => setFilterSpotId(e.target.value || null)}
            className={`px-4 py-2 rounded-full text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700 cursor-pointer focus:outline-none ${
              filterSpotId !== null ? 'ring-2 ring-amber-500/60' : ''
            }`}
          >
            <option value="">Filtrer par lieu...</option>
            {spots
              .filter(s => photos.some(p => p.spotId === s.id))
              .map(s => (
                <option key={s.id} value={s.id}>{s.title} — {s.city}</option>
              ))}
          </select>

          <button
            onClick={() => onAddPhoto?.(filterSpotId)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white hover:bg-amber-500 hover:text-stone-950 transition-all"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            Ajouter ma photo
          </button>
        </div>
      </div>

      {/* Photo grid */}
      {loading ? (
        <div className="pb-24 text-center">
          <Loader2 className="w-10 h-10 text-stone-600 animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="pb-24 text-center max-w-md mx-auto px-6">
          <Camera className="w-12 h-12 text-stone-700 mx-auto mb-3" />
          <p className="text-stone-500 text-sm">
            Aucune photo pour le moment. Soyez le premier explorateur à partager son souvenir !
          </p>
          <button
            onClick={() => onAddPhoto?.(filterSpotId)}
            className="mt-5 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold py-2.5 px-5 rounded-full transition-colors"
          >
            <ImagePlus className="w-4 h-4" />
            Ajouter ma photo
          </button>
        </div>
      ) : (
        <div className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            {filtered.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setLightboxIndex(i)}
                className="group relative w-full mb-4 break-inside-avoid rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 text-left hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5"
              >
                <img
                  src={p.imageUrl}
                  alt={`Souvenir de ${p.visitorName}`}
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute bottom-0 inset-x-0 p-3 text-left pointer-events-none">
                  <p className="font-display text-white font-bold text-sm leading-tight">
                    {spotName(p.spotId)}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-stone-300 text-[10px]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-amber-400" />
                      {p.visitorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {spotCity(p.spotId) || formatDate(p.createdAt)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {current && (
        <div className="fixed inset-0 z-[900] flex flex-col bg-black/95" onClick={() => setLightboxIndex(null)}>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <p className="text-white font-bold text-sm truncate">{spotName(current.spotId)}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-stone-400 text-xs font-bold">
                {lightboxIndex! + 1} / {filtered.length}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 sm:px-16 min-h-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxIndex(i => (i === null ? i : (i - 1 + filtered.length) % filtered.length))}
              className="absolute left-3 sm:left-5 p-2.5 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-stone-950 transition-colors"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={current.imageUrl}
              alt={`Souvenir de ${current.visitorName}`}
              className="max-h-[65vh] max-w-full object-contain rounded-2xl"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />

            <button
              onClick={() => setLightboxIndex(i => (i === null ? i : (i + 1) % filtered.length))}
              className="absolute right-3 sm:right-5 p-2.5 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-stone-950 transition-colors"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-5" onClick={(e) => e.stopPropagation()}>
            <span className="flex items-center gap-2 text-sm text-stone-300">
              <User className="w-4 h-4 text-amber-400" />
              {current.visitorName}
            </span>
            <span className="flex items-center gap-2 text-sm text-stone-300">
              <MapPin className="w-4 h-4 text-amber-400" />
              {spotName(current.spotId)} · {spotCity(current.spotId) || 'Bénin'}
            </span>
            <span className="text-sm text-stone-500">{formatDate(current.createdAt)}</span>
            {currentSpotId && (
              <button
                onClick={() => { setLightboxIndex(null); onAddPhoto?.(currentSpotId); }}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold py-2 px-5 rounded-full transition-colors"
              >
                <ImagePlus className="w-4 h-4" />
                Partager le mien
              </button>
            )}
          </div>

          {current.message && (
            <p className="text-center text-stone-300 text-xs px-6 pb-4 flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
              <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {current.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
