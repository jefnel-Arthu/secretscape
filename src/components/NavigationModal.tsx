import React, { useEffect, useRef, useState } from 'react';
import { X, Navigation, MapPin, Clock, Footprints, Car, ExternalLink, Loader2, AlertTriangle, ChevronRight, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import L from 'leaflet';
import type { HiddenSpot } from '../types';

interface NavigationModalProps {
  spot: HiddenSpot | null;
  onClose: () => void;
}

interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  modifier?: string;
  type: string;
}

interface RouteData {
  geometry: [number, number][];
  distance: number;
  duration: number;
  steps: RouteStep[];
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

function formatTime(minutes: number): string {
  if (minutes < 1) return '<1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h${m > 0 ? ` ${m}min` : ''}`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

const STEP_ICONS: Record<string, string> = {
  depart: '🏁',
  arrive: '🎯',
  turn: '↗️',
  new_name: '➡️',
  merge: '↗️',
  on_ramp: '↗️',
  off_ramp: '↘️',
  fork: '↗️',
  end_of_road: '↘️',
  continue: '⬆️',
  roundabout: '🔄',
  rotary: '🔄',
  roundabout_turn: '🔄',
  notification: 'ℹ️',
  depart_roundabout: '🔄',
};

function getStepIcon(type: string, modifier?: string): string {
  if (type === 'depart') return '🏁';
  if (type === 'arrive') return '🎯';
  if (type === 'roundabout' || type === 'rotary' || type === 'roundabout_turn' || type === 'depart_roundabout') return '🔄';
  if (modifier === 'left' || modifier === 'slight left' || modifier === 'sharp left') return '⬅️';
  if (modifier === 'right' || modifier === 'slight right' || modifier === 'sharp right') return '➡️';
  return STEP_ICONS[type] || '⬆️';
}

async function fetchOSRMRoute(
  from: [number, number],
  to: [number, number]
): Promise<RouteData | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/foot/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes || data.routes.length === 0) return null;

    const route = data.routes[0];
    const coords: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]]
    );

    const steps: RouteStep[] = [];
    for (const leg of route.legs) {
      for (const step of leg.steps) {
        steps.push({
          instruction: step.maneuver?.type === 'arrive'
            ? 'Arrivez a destination'
            : step.name
              ? `${step.maneuver?.modifier ? traduireModifier(step.maneuver.modifier) : ''} sur ${step.name}`
              : traduireType(step.maneuver?.type || 'continue'),
          distance: step.distance,
          duration: step.duration,
          modifier: step.maneuver?.modifier,
          type: step.maneuver?.type || 'continue',
        });
      }
    }

    return {
      geometry: coords,
      distance: route.distance,
      duration: route.duration / 60,
      steps,
    };
  } catch {
    return null;
  }
}

async function fetchOSRMRouteDriving(
  from: [number, number],
  to: [number, number]
): Promise<{ distance: number; duration: number } | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/car/${from[1]},${from[0]};${to[1]},${to[0]}?overview=false`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes || data.routes.length === 0) return null;
    const route = data.routes[0];
    return { distance: route.distance, duration: route.duration / 60 };
  } catch {
    return null;
  }
}

function traduireType(type: string): string {
  const map: Record<string, string> = {
    depart: 'Partez',
    arrive: 'Arrivez',
    turn: 'Tournez',
    new_name: 'Continuez sur',
    merge: 'Suivez',
    on_ramp: 'Prenez la bretelle',
    off_ramp: 'Sortez',
    fork: 'Gardez a',
    end_of_road: 'Au bout de la route',
    continue: 'Continuez tout droit',
    roundabout: 'Dans le rond-point',
    rotary: 'Dans le giratoire',
    roundabout_turn: 'Prenez la sortie du rond-point',
    notification: 'Info',
  };
  return map[type] || type;
}

function traduireModifier(modifier: string): string {
  const map: Record<string, string> = {
    left: 'a gauche',
    right: 'a droite',
    slight_left: 'legèrement a gauche',
    slight_right: 'legèrement a droite',
    sharp_left: 'fortement a gauche',
    sharp_right: 'fortement a droite',
    straight: 'tout droit',
    uturn: 'faites demi-tour',
  };
  return map[modifier] || modifier;
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
  const [route, setRoute] = useState<RouteData | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [walkingRoute, setWalkingRoute] = useState(true);
  const [drivingRoute, setDrivingRoute] = useState<{ distance: number; duration: number } | null>(null);
  const [stepsExpanded, setStepsExpanded] = useState(true);
  const lastRouteFetch = useRef<string>('');

  const destPos: [number, number] = spot ? [spot.coordinates.lat, spot.coordinates.lng] : [0, 0];

  // Init map
  useEffect(() => {
    if (!spot || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: destPos,
      zoom: 15,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    leafletMap.current = map;

    const destIcon = L.divIcon({
      className: '',
      html: `<div style="width:40px;height:40px;border-radius:50%;background:#ef4444;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,.35);border:3px solid white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    destMarker.current = L.marker(destPos, { icon: destIcon }).addTo(map);
    destMarker.current.bindPopup(`<b style="font-size:13px">${spot.title}</b><br/><span style="color:#666;font-size:11px">${spot.address}</span>`).openPopup();

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, [spot]);

  // Get user position + fetch route
  useEffect(() => {
    if (!spot) return;

    if (!navigator.geolocation) {
      setError('Geolocalisation non supportee par votre navigateur');
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
            html: `<div style="width:22px;height:22px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,.3),0 2px 6px rgba(0,0,0,.2)">
              <div style="width:100%;height:100%;border-radius:50%;background:#3b82f6;animation:pulse 2s infinite"></div>
            </div>
            <style>@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.4)}50%{box-shadow:0 0 0 8px rgba(59,130,246,0)}}</style>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });
          userMarker.current = L.marker(newPos, { icon: userIcon }).addTo(map);
          userMarker.current.bindPopup('<b>Votre position</b>');
        }

        // Fetch real route if position changed significantly
        const key = `${newPos[0].toFixed(4)},${newPos[1].toFixed(4)}->${destPos[0].toFixed(4)},${destPos[1].toFixed(4)}`;
        if (key !== lastRouteFetch.current && !routeLoading) {
          lastRouteFetch.current = key;
          setRouteLoading(true);

          fetchOSRMRoute(newPos, destPos).then((data) => {
            setRoute(data);
            setRouteLoading(false);

            if (data && routeLine.current) {
              routeLine.current.setLatLngs(data.geometry);
            } else if (data) {
              routeLine.current = L.polyline(data.geometry, {
                color: '#3b82f6',
                weight: 5,
                opacity: 0.85,
              }).addTo(map);
            }

            if (data) {
              const bounds = L.latLngBounds(data.geometry);
              map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
            }
          });

          fetchOSRMRouteDriving(newPos, destPos).then(setDrivingRoute);
        }

        // Fit bounds if no route yet
        if (!route && !routeLoading) {
          const bounds = L.latLngBounds([newPos, destPos]);
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setError('Permission de localisation refusee');
        else if (err.code === 2) setError('Position inaccessible');
        else setError('Delai de localisation depasse');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [spot]);

  if (!spot) return null;

  const distance = userPos ? haversineDistance(userPos[0], userPos[1], destPos[0], destPos[1]) : null;

  const walkDist = route?.distance ?? (distance ? distance * 1000 : null);
  const walkDur = route?.duration ?? (distance ? (distance / 5) * 60 : null);
  const driveDist = drivingRoute?.distance ?? (distance ? distance * 1000 : null);
  const driveDur = drivingRoute?.duration ?? (distance ? (distance / 30) * 60 : null);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userPos ? `${userPos[0]},${userPos[1]}` : ''}&destination=${destPos[0]},${destPos[1]}&travelmode=walking`;

  const steps = route?.steps ?? [];

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

      {/* Route loading indicator */}
      {routeLoading && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
          <span className="text-xs text-gray-600 font-medium">Calcul de l'itineraire...</span>
        </div>
      )}

      {/* Info panel */}
      <div className="bg-white border-t border-gray-200 shrink-0 max-h-[45vh] flex flex-col">
        {locating && (
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Localisation en cours...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl px-4 py-3 text-xs mx-4 mt-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {userPos && (
          <div className="px-4 pt-3 pb-2">
            {/* Mode selector + summary */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setWalkingRoute(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  walkingRoute
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Footprints className="w-4 h-4" />
                <div className="text-left">
                  <div>{walkDist !== null ? formatDistance(walkDist) : '...'}</div>
                  <div className="text-[9px] font-normal opacity-80">{walkDur !== null ? formatTime(walkDur) : '...'}</div>
                </div>
              </button>
              <button
                onClick={() => setWalkingRoute(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  !walkingRoute
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Car className="w-4 h-4" />
                <div className="text-left">
                  <div>{driveDist !== null ? formatDistance(driveDist) : '...'}</div>
                  <div className="text-[9px] font-normal opacity-80">{driveDur !== null ? formatTime(driveDur) : '...'}</div>
                </div>
              </button>
            </div>

            {/* Steps */}
            {steps.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setStepsExpanded(!stepsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 text-xs font-bold text-gray-700"
                >
                  <span>Directions ({steps.length} etapes)</span>
                  {stepsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
                {stepsExpanded && (
                  <div className="max-h-[22vh] overflow-y-auto">
                    {steps.map((step, i) => (
                      <div key={i} className={`flex items-start gap-3 px-3 py-2.5 text-xs ${i < steps.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <span className="text-base mt-0.5 shrink-0 w-6 text-center">{getStepIcon(step.type, step.modifier)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium leading-tight">{step.instruction}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {step.distance > 0 && (
                              <span className="text-gray-400 text-[10px]">{formatDistance(step.distance)}</span>
                            )}
                            {step.duration > 0 && (
                              <span className="text-gray-400 text-[10px]">{formatTime(step.duration)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!route && !routeLoading && !error && (
              <p className="text-xs text-gray-400 text-center py-2">Activez la geolocalisation pour calculer l'itineraire</p>
            )}
          </div>
        )}

        {!userPos && !locating && !error && (
          <p className="text-xs text-gray-400 text-center py-4">Activez la geolocalisation pour suivre votre itineraire</p>
        )}
      </div>
    </div>
  );
};
