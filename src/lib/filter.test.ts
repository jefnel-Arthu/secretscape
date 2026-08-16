import { describe, expect, it } from 'vitest';
import { filterSpots, SpotFilters } from './filter';
import { HiddenSpot } from '../types';

const spot = (overrides: Partial<HiddenSpot>): HiddenSpot => ({
  id: 'spot-1',
  title: 'Belvédère Secret',
  subtitle: 'Vue panoramique',
  category: 'sites',
  city: 'Paris',
  region: 'Île-de-France',
  coordinates: { lat: 48.87, lng: 2.38 },
  address: '1 Rue Test',
  secretLevel: 'moyen',
  description: 'Une terrasse cachée',
  secretAccessHint: 'Montez les escaliers',
  bestTimeToVisit: 'Golden hour',
  estimatedDurationMinutes: 50,
  imageUrl: 'https://example.com/p.jpg',
  tags: ['Coucher de soleil', 'Panorama'],
  rating: 4.9,
  reviewCount: 20,
  crowdLevel: 'faible',
  ...overrides,
});

const spots: HiddenSpot[] = [
  spot({ id: 's1', title: 'Belvédère Secret', city: 'Paris', category: 'sites', secretLevel: 'moyen', description: 'Une terrasse panoramique cachée' }),
  spot({ id: 's2', title: 'Quartier des Canuts', city: 'Lyon', category: 'boites', secretLevel: 'insider', tags: ['Traboule'], description: 'Un passage historique des canuts' }),
  spot({ id: 's3', title: 'Jardin Caché', city: 'Paris', category: 'plages', secretLevel: 'facile', tags: ['Jardin'], description: 'Un jardin paisible au cœur de la ville' }),
];

const base: SpotFilters = { city: 'ALL', category: 'ALL', secretLevel: 'ALL', searchQuery: '' };

describe('filterSpots', () => {
  it('returns all spots with no filters', () => {
    expect(filterSpots(spots, base)).toHaveLength(3);
  });

  it('filters by city', () => {
    expect(filterSpots(spots, { ...base, city: 'Paris' }).map(s => s.id)).toEqual(['s1', 's3']);
    expect(filterSpots(spots, { ...base, city: 'Lyon' }).map(s => s.id)).toEqual(['s2']);
  });

  it('filters by category', () => {
    expect(filterSpots(spots, { ...base, category: 'boites' }).map(s => s.id)).toEqual(['s2']);
  });

  it('filters by secret level', () => {
    expect(filterSpots(spots, { ...base, secretLevel: 'insider' }).map(s => s.id)).toEqual(['s2']);
  });

  it('combines city and category filters', () => {
    expect(filterSpots(spots, { ...base, city: 'Paris', category: 'plages' }).map(s => s.id)).toEqual(['s3']);
  });

  it('searches by title, city, description and tags (case-insensitive)', () => {
    expect(filterSpots(spots, { ...base, searchQuery: 'secret' }).map(s => s.id)).toEqual(['s1']);
    expect(filterSpots(spots, { ...base, searchQuery: 'LYON' }).map(s => s.id)).toEqual(['s2']);
    expect(filterSpots(spots, { ...base, searchQuery: 'terrasse' }).map(s => s.id)).toEqual(['s1']);
    expect(filterSpots(spots, { ...base, searchQuery: 'traboule' }).map(s => s.id)).toEqual(['s2']);
  });

  it('ignores blank search queries', () => {
    expect(filterSpots(spots, { ...base, searchQuery: '   ' })).toHaveLength(3);
  });
});
