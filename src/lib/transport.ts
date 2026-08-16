import { TransportMode } from '../types';

export interface TransportOption {
  id: TransportMode;
  label: string;
  speedKmH: number;
  costHint: string;
  icon: string;
}

export const TRANSPORT_OPTIONS: TransportOption[] = [
  { id: 'a-pied', label: 'À pied', speedKmH: 5, costHint: 'Gratuit', icon: 'footprints' },
  { id: 'zemidjan', label: 'Zémidjan (taxi-moto)', speedKmH: 30, costHint: '200–300 FCFA / course', icon: 'bike' },
  { id: 'taxi', label: 'Taxi-voiture', speedKmH: 25, costHint: '300–500 FCFA / place', icon: 'car' },
  { id: 'gozem', label: 'Gozem (moto VTC)', speedKmH: 28, costHint: 'Tarif affiché sur l’app', icon: 'bike' },
  { id: 'yango', label: 'Yango (voiture VTC)', speedKmH: 30, costHint: 'Tarif affiché sur l’app', icon: 'car' },
  { id: 'pirogue', label: 'Pirogue-taxi', speedKmH: 8, costHint: '300–500 FCFA / traversée', icon: 'ship' },
  { id: 'voiture', label: 'Voiture privée', speedKmH: 40, costHint: 'Location / carburant', icon: 'car' },
  { id: 'bus', label: 'Bus / taxi interurbain', speedKmH: 55, costHint: 'Selon la distance', icon: 'bus' },
];

export const getTransportOption = (mode?: TransportMode | ''): TransportOption =>
  TRANSPORT_OPTIONS.find((o) => o.id === mode) || TRANSPORT_OPTIONS[0];

export const getTransportLabel = (mode?: TransportMode | ''): string =>
  getTransportOption(mode).label;

export const estimateTravelMinutes = (distKm: number, mode?: TransportMode | ''): number => {
  const speed = getTransportOption(mode).speedKmH;
  if (distKm <= 0) return 0;
  return Math.max(1, Math.round((distKm * 60) / speed));
};
