export type SecretCategory =
  | 'plages'
  | 'restaurants'
  | 'boites'
  | 'transports'
  | 'sites'
  | 'hotels';

export type SecretLevel = 'facile' | 'moyen' | 'insider'; // Facile à trouver, Bien caché, Secret d'initié

export interface HiddenSpot {
  id: string;
  title: string;
  subtitle: string;
  category: SecretCategory;
  city: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  secretLevel: SecretLevel;
  description: string;
  secretAccessHint: string; // Conseil secret d'accès
  bestTimeToVisit: string;   // ex: "Au lever du soleil à 07h00"
  estimatedDurationMinutes: number; // ex: 45
  imageUrl: string;
  galleryImages?: string[];
  tags: string[];
  rating: number; // ex: 4.9
  reviewCount: number;
  crowdLevel: 'faible' | 'modéré' | 'élevé';
  isUserSubmitted?: boolean;
}

export type TimeSlot = 'morning' | 'noon' | 'afternoon' | 'sunset' | 'evening';

export type TransportMode =
  | 'a-pied'
  | 'zemidjan'
  | 'taxi'
  | 'gozem'
  | 'yango'
  | 'pirogue'
  | 'voiture'
  | 'bus';

export interface ItinerarySlotItem {
  id: string; // unique item id in calendar
  spotId: string;
  spot: HiddenSpot;
  timeSlot: TimeSlot;
  timeString: string; // e.g. "09:30"
  arrivalTime?: string; // heure d'arrivée / début de visite, e.g. "09:00"
  departureTime?: string; // heure de départ / fin de visite, e.g. "11:00"
  transportMode?: TransportMode; // moyen de déplacement pour venir à ce lieu
  notes?: string;
}

export interface CalendarDayPlan {
  dayNumber: number;
  dateString?: string; // e.g. "2026-08-15"
  title?: string;      // e.g. "Jour 1: Passages Mystérieux & Roofs Secrets"
  items: ItinerarySlotItem[];
}

export interface UserTripCalendar {
  title: string;
  destinationCity: string;
  startDate: string;
  days: CalendarDayPlan[];
}

export interface AITripRequest {
  destination: string;
  durationDays: number;
  pace: 'tranquille' | 'equilibre' | 'intense';
  vibes: SecretCategory[];
  extraNotes?: string;
}
