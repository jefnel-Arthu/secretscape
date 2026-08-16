import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HiddenSpot } from '../types';
import { CATEGORY_LABELS, SECRET_LEVEL_LABELS } from '../data/hiddenSpots';
import { Compass, CalendarPlus, Bookmark, Eye, MapPin, LocateFixed } from 'lucide-react';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const safeImageUrl = (url: string, fallback: string): string =>
  /^https?:\/\//i.test(url) ? url : fallback;

interface MapExplorerProps {
  spots: HiddenSpot[];
  selectedSpot: HiddenSpot | null;
  onSelectSpot: (spot: HiddenSpot) => void;
  onOpenSpotDetail: (spot: HiddenSpot) => void;
  onClosePanel: () => void;
  onAddToCalendar: (spot: HiddenSpot) => void;
  onToggleFavorite: (spot: HiddenSpot) => void;
  favorites: string[];
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  spots,
  selectedSpot,
  onSelectSpot,
  onOpenSpotDetail,
  onClosePanel,
  onAddToCalendar,
  onToggleFavorite,
  favorites,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocate = () => {
    if (!mapRef.current) return;
    if (!navigator.geolocation) {
      setLocationError('Géolocalisation non supportée par ce navigateur.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const map = mapRef.current;
        if (!map) return;
        map.flyTo([latitude, longitude], 14, { duration: 1.2 });
        if (userMarkerRef.current) userMarkerRef.current.remove();
        userMarkerRef.current = L.marker([latitude, longitude], {
          icon: L.divIcon({
            html: '<div class="w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white shadow-lg"></div>',
            className: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        })
          .addTo(map)
          .bindPopup('Votre position');
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocationError('Position inaccessible. Vérifiez les autorisations de localisation.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not existing
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [48.8566, 2.3522],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Fix gray map when container is laid out after mount
      setTimeout(() => map.invalidateSize(), 200);

      // CartoDB Positron elegant tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker: L.Marker) => marker.remove());
    markersRef.current = {};

    if (spots.length === 0) return;

    const bounds = L.latLngBounds([]);

    spots.forEach((spot) => {
      const isSelected = selectedSpot?.id === spot.id;
      const isFav = favorites.includes(spot.id);

      // Category color configuration
      const catBg = spot.category === 'plages' ? '#0284c7' :
                    spot.category === 'restaurants' ? '#ea580c' :
                    spot.category === 'boites' ? '#c026d3' :
                    spot.category === 'transports' ? '#0891b2' :
                    spot.category === 'hotels' ? '#7c3aed' : '#059669';

      // Custom marker icon HTML
      const markerHtml = `
        <div class="relative group cursor-pointer">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-transform duration-200 transform group-hover:scale-110 ${isSelected ? 'scale-125 ring-4 ring-amber-400 ring-offset-2' : ''}" style="background-color: ${catBg}; border: 2px solid white;">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          ${isFav ? '<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white"></span>' : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-map-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          onSelectSpot(spot);
        });

      // Attach popup HTML
      const safeImg = safeImageUrl(spot.imageUrl, 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Coucher_du_soleil_sur_la_plage_Fidjross%C3%A8-Cotonou_Benin.jpg');
      const popupContent = `
        <div class="w-64 p-3 font-sans">
          <div class="relative h-28 rounded-lg overflow-hidden mb-2 bg-stone-100">
            <img src="${escapeHtml(safeImg)}" alt="${escapeHtml(spot.title)}" class="w-full h-full object-cover" />
            <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-900/80 text-white backdrop-blur-sm">
              ${escapeHtml(spot.city)}
            </span>
          </div>
          <h4 class="font-display font-bold text-stone-900 text-sm leading-tight mb-1">${escapeHtml(spot.title)}</h4>
          <p class="text-stone-500 text-xs line-clamp-2 mb-2">${escapeHtml(spot.subtitle)}</p>
          <div class="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
            <span class="text-amber-700 font-semibold text-[11px]">${escapeHtml(CATEGORY_LABELS[spot.category]?.name || 'Lieu caché')}</span>
            <span class="text-stone-400 font-medium">★ ${escapeHtml(String(spot.rating))}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { offset: [0, -30] });
      markersRef.current[spot.id] = marker;
      bounds.extend([spot.coordinates.lat, spot.coordinates.lng]);
    });

    if (spots.length > 0 && !selectedSpot) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

  }, [spots, selectedSpot, favorites]);

  // Center map on selected spot
  useEffect(() => {
    if (selectedSpot && mapRef.current) {
      mapRef.current.flyTo([selectedSpot.coordinates.lat, selectedSpot.coordinates.lng], 15, {
        duration: 1.2
      });
      const marker = markersRef.current[selectedSpot.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedSpot]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-stone-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* Map Canvas Container */}
      <div className="flex-1 h-full relative" ref={mapContainerRef} id="leaflet-map-canvas">
        {/* Map Header Floating Overlay */}
        <div className="absolute top-4 left-4 z-[400] bg-stone-900/90 text-stone-100 px-3 py-2 rounded-xl backdrop-blur-md shadow-lg border border-stone-800 flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="text-xs font-semibold">
            {spots.length} lieux secrets découverts
          </span>
        </div>

        {/* Locate User Button */}
        <button
          onClick={handleLocate}
          disabled={isLocating}
          className="absolute bottom-6 left-4 z-[400] bg-stone-900/90 hover:bg-stone-800 text-stone-100 text-xs font-semibold px-3 py-2 rounded-xl backdrop-blur-md shadow-lg border border-stone-700/80 flex items-center gap-2 transition-all disabled:opacity-60"
          title="Centrer sur ma position"
        >
          <LocateFixed className={`w-4 h-4 text-blue-400 ${isLocating ? 'animate-pulse' : ''}`} />
          <span>{isLocating ? 'Localisation...' : 'Ma position'}</span>
        </button>

        {/* Location Error Toast */}
        {locationError && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
            {locationError}
          </div>
        )}
      </div>

      {/* Floating Side Panel for Spot Details / Grid overlay */}
      {selectedSpot && (
        <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-stone-200 shadow-2xl z-[500] flex flex-col overflow-y-auto max-h-[50vh] md:max-h-full animate-in slide-in-from-right duration-200">
          <div className="relative h-48 bg-stone-900 shrink-0 cursor-pointer" onClick={() => onOpenSpotDetail(selectedSpot)}>
            <img 
              src={selectedSpot.imageUrl} 
              alt={selectedSpot.title} 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
            
            <button 
              onClick={(e) => { e.stopPropagation(); onClosePanel(); }}
              className="absolute top-3 right-3 text-white/80 hover:text-white bg-stone-900/60 p-1.5 rounded-full backdrop-blur-sm"
              title="Fermer le panneau"
            >
              ✕
            </button>

            <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 shadow-sm">
              Fiche complète →
            </span>

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${SECRET_LEVEL_LABELS[selectedSpot.secretLevel].badgeClass}`}>
                  {SECRET_LEVEL_LABELS[selectedSpot.secretLevel].label}
                </span>
                <span className="text-[11px] font-medium text-stone-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {selectedSpot.city}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-white leading-tight">
                {selectedSpot.title}
              </h3>
            </div>
          </div>

          <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-stone-600 text-xs leading-relaxed">
                {selectedSpot.description}
              </p>

              {/* Secret Access Hint Box */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-amber-900 text-xs">
                <div className="font-semibold flex items-center gap-1.5 mb-1 text-amber-950">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>Accès secret & Conseils</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  {selectedSpot.secretAccessHint}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                  <span className="text-stone-400 text-[10px] block font-medium">Meilleur moment</span>
                  <span className="font-semibold text-stone-800 text-xs">{selectedSpot.bestTimeToVisit}</span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                  <span className="text-stone-400 text-[10px] block font-medium">Durée estimée</span>
                  <span className="font-semibold text-stone-800 text-xs">{selectedSpot.estimatedDurationMinutes} min</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
              <button
                onClick={() => onOpenSpotDetail(selectedSpot)}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                title="Ouvrir la fiche détaillée"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Fiche détaillée</span>
              </button>

              <button
                onClick={() => onAddToCalendar(selectedSpot)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                id="add-spot-to-calendar-btn"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Ajouter au Calendrier</span>
              </button>

              <button
                onClick={() => onToggleFavorite(selectedSpot)}
                className={`p-2.5 rounded-xl border transition-all ${
                  favorites.includes(selectedSpot.id)
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                }`}
                title="Favoris"
              >
                <Bookmark className={`w-4 h-4 ${favorites.includes(selectedSpot.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
