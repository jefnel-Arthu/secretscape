import { HiddenSpot } from '../types';

export type TravelMode = 'driving' | 'walking' | 'bicycling' | 'transit';

/**
 * Construit l'URL Google Maps vers un lieu secret.
 * Priorite aux coordonnees GPS, sinon repli sur l'adresse textuelle.
 */
export const getGoogleMapsUrl = (spot: HiddenSpot, travelMode: TravelMode = 'driving'): string => {
  const { lat, lng } = spot.coordinates;
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
  const destination = hasCoordinates
    ? `${lat},${lng}`
    : `${spot.title}, ${spot.address}, ${spot.city}, Bénin`;

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;
};

/**
 * Redirige le client vers Google Maps (itineraire) dans un nouvel onglet.
 */
export const openInGoogleMaps = (spot: HiddenSpot, travelMode: TravelMode = 'driving'): void => {
  window.open(getGoogleMapsUrl(spot, travelMode), '_blank', 'noopener,noreferrer');
};
