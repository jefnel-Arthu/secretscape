import React, { useEffect, useRef, useState } from 'react';
import { X, Navigation, MapPin, Clock, Footprints, Car, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import L from 'leaflet';
import type { HiddenSpot } from '../../types';

interface NavigationModalProps {
  spot: HiddenSpot | null;
  onClose: () => void;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getBearing(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos((lat2 * Math.PI) / 180);
  const x = Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLng);
  let brng = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(brng / 45) % 8];
}

function formatTime(minutes: number): string {
  if (minutes < 1) return '<1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h${m > 0 ? ` ${m}min` : ''}`;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({ spot, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const destMarker = useRef<L.Marker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);

  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(true);

  const destPos: [number, number] = spot ? [spot.coordinates.lat, spot.coordinates.lng] : [0, 0];

  // Init map
  useEffect(() => {
    if (!spot || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: destPos,
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    leafletMap.current = map;

    // Destination marker
    const destIcon = L.divIcon({
      className: '',
      html: `<div style="width:36px;height:36px;border-radius:50%;background:#ef4444;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3);border:3px solid white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    destMarker.current = L.marker(destPos, { icon: destIcon }).addTo(map);
    destMarker.current.bindPopup(`<b style="font-size:13px">${spot.title}</b><br/><span style="color:#666;font-size:11px">${spot.address}</span>`).openPopup();

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, [spot]);

  // Get user position
  useEffect(() => {
    if (!spot) return;

    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée par votre navigateur');
      setLocating(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(newPos);
        setLocating(false);
        setError(null);

        const map = leafletMap.current;
        if (!map) return;

        // User marker
        if (userMarker.current) {
          userMarker.current.setLatLng(newPos);
        } else {
          const userIcon = L.divIcon({
            className: '',
            html: `<div style="width:20px;height:20px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,.3),0 2px 6px rgba(0,0,0,.2)">
              <div style="width:100%;height:100%;border-radius:50%;background:#3b82f6;animation:pulse 2s infinite"></div>
            </div>
            <style>@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.4)}50%{box-shadow:0 0 0 8px rgba(59,130,246,0)}}</style>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          userMarker.current = L.marker(newPos, { icon: userIcon }).addTo(map);
          userMarker.current.bindPopup('<b>Votre position</b>');
        }

        // Route line
        if (routeLine.current) {
          routeLine.current.setLatLngs([newPos, destPos]);
        } else {
          routeLine.current = L.polyline([newPos, destPos], {
            color: '#3b82f6',
            weight: 3,
            opacity: 0.7,
            dashArray: '8, 8',
          }).addTo(map);
        }

        // Fit bounds
        const bounds = L.latLngBounds([newPos, destPos]);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setError('Permission de localisation refusée');
        else if (err.code === 2) setError('Position inaccessible');
        else setError('Délai de localisation dépassé');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [spot]);

  if (!spot) return null;

  const distance = userPos ? haversineDistance(userPos[0], userPos[1], destPos[0], destPos[1]) : null;
  const bearing = userPos ? getBearing(userPos[0], userPos[1], destPos[0], destPos[1]) : null;
  const walkTime = distance ? (distance / 5) * 60 : null;
  const driveTime = distance ? (distance / 30) * 60 : null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userPos ? `${userPos[0]},${userPos[1]}` : ''}&destination=${destPos[0]},${destPos[1]}&travelmode=driving`;

  return (
    <div className="fixed inset-0 z-[850] flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0">
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-gray-900 truncate">{spot.title}</h2>
            <p className="text-[10px] text-gray-400 truncate">{spot.address}, {spot.city}</p>
          </div>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Google Maps
        </a>
      </div>

      {/* Map */}
      <div ref={mapRef} className="flex-1 relative" />

      {/* Info panel */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shrink-0">
        {locating && (
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Localisation en cours...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl px-4 py-3 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {distance !== null && !error && (
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
              <MapPin className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <p className="text-base font-bold text-gray-900">{distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}</p>
              <p className="text-[9px] text-gray-400 uppercase">Distance</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
              <Navigation className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-base font-bold text-gray-900">{bearing}</p>
              <p className="text-[9px] text-gray-400 uppercase">Direction</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
              <Footprints className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <p className="text-base font-bold text-gray-900">{formatTime(walkTime!)}</p>
              <p className="text-[9px] text-gray-400 uppercase">À pied</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
              <Car className="w-4 h-4 text-violet-500 mx-auto mb-1" />
              <p className="text-base font-bold text-gray-900">{formatTime(driveTime!)}</p>
              <p className="text-[9px] text-gray-400 uppercase">En voiture</p>
            </div>
          </div>
        )}

        {!userPos && !locating && !error && (
          <p className="text-xs text-gray-400 text-center">Activez la géolocalisation pour suivre votre itinéraire</p>
        )}
      </div>
    </div>
  );
};
