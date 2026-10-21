import { HiddenSpot } from '../types';

export type TravelMode = 'driving' | 'walking' | 'bicycling' | 'transit';

const hasCoordinates = (spot: HiddenSpot): boolean => {
  const { lat, lng } = spot.coordinates;
  return Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
};

const hasStreetAddress = (spot: HiddenSpot): boolean => {
  const address = (spot.address || '').trim();
  if (!address) return false;
  return !/^disponible|dans les grandes villes|toute la ville/i.test(address);
};

/**
 * Construit la destination la plus precise possible pour Google Maps.
 * On privilegie le nom + l'adresse : Google resolut alors la fiche exacte
 * de l'etablissement (musee, restaurant, hotel...). Les coordonnees GPS ne
 * servent que de secours quand aucune adresse exploitable n'est disponible.
 */
export const getGoogleMapsDestination = (spot: HiddenSpot): string => {
  if (hasStreetAddress(spot)) {
    const parts = [spot.title, spot.address];
    const city = (spot.city || '').trim();
    if (city && !parts.some((p) => p.toLowerCase().includes(city.toLowerCase()))) {
      parts.push(city);
    }
    parts.push('Bénin');
    return parts.join(', ');
  }

  if (hasCoordinates(spot)) {
    return `${spot.coordinates.lat},${spot.coordinates.lng}`;
  }

  return `${spot.title}, Bénin`;
};

export const getGoogleMapsUrl = (spot: HiddenSpot, travelMode: TravelMode = 'driving'): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getGoogleMapsDestination(spot))}&travelmode=${travelMode}`;

/**
 * Redirige le client vers Google Maps (itineraire) dans un nouvel onglet.
 */
export const openInGoogleMaps = (spot: HiddenSpot, travelMode: TravelMode = 'driving'): void => {
  window.open(getGoogleMapsUrl(spot, travelMode), '_blank', 'noopener,noreferrer');
};
