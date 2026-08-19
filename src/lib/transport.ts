import { TransportMode } from '../types';

export interface TransportOption {
  id: TransportMode;
  label: string;
  speedKmH: number;
  costHint: string;
  icon: string;
}

export const TRANSPORT_OPTIONS: TransportOption[] = [
  { id: 'gozem', label: 'Gozem (moto VTC)', speedKmH: 28, costHint: 'Tarif affiché sur l\'app', icon: 'bike' },
  { id: 'yango', label: 'Yango (voiture VTC)', speedKmH: 30, costHint: 'Tarif affiché sur l\'app', icon: 'car' },
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
