import { HiddenSpot, SecretCategory, SecretLevel } from '../types';

export interface SpotFilters {
  city: string;
  category: SecretCategory | 'ALL';
  secretLevel: SecretLevel | 'ALL';
  searchQuery: string;
}

export const filterSpots = (spots: HiddenSpot[], filters: SpotFilters): HiddenSpot[] =>
  spots.filter((s) => {
    if (filters.city !== 'ALL' && s.city !== filters.city) return false;
    if (filters.category !== 'ALL' && s.category !== filters.category) return false;
    if (filters.secretLevel !== 'ALL' && s.secretLevel !== filters.secretLevel) return false;
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchCity = s.city.toLowerCase().includes(q);
      const matchDesc = s.description.toLowerCase().includes(q);
      const matchTag = s.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCity && !matchDesc && !matchTag) return false;
    }
    return true;
  });
