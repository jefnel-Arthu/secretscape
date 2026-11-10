import { HiddenSpot, SecretCategory, SecretLevel } from '../types';

export interface SpotFilters {
  city: string;
  category: SecretCategory | 'ALL';
  secretLevel: SecretLevel | 'ALL';
  searchQuery: string;
}

// Les libellés du jeu de données mélangeaient « Sèmè » / « Sèmé » et « Sô-Ava » / « So-Ava » :
// la comparaison est insensible aux accents, aux ligatures, aux tirets et aux espaces multiples.
export const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[œ]/g, 'oe')
    .replace(/[æ]/g, 'ae')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const filterSpots = (spots: HiddenSpot[], filters: SpotFilters): HiddenSpot[] => {
  const city = filters.city === 'ALL' ? null : normalizeText(filters.city);
  const category = filters.category === 'ALL' ? null : filters.category;
  const secretLevel = filters.secretLevel === 'ALL' ? null : filters.secretLevel;
  const query = filters.searchQuery.trim() ? normalizeText(filters.searchQuery) : '';

  return spots.filter((s) => {
    if (city && normalizeText(s.city) !== city) return false;
    if (category && s.category !== category) return false;
    if (secretLevel && s.secretLevel !== secretLevel) return false;
    if (query) {
      const matchTitle = normalizeText(s.title).includes(query);
      const matchCity = normalizeText(s.city).includes(query);
      const matchDesc = normalizeText(s.description).includes(query);
      const matchTag = s.tags.some((t) => normalizeText(t).includes(query));
      if (!matchTitle && !matchCity && !matchDesc && !matchTag) return false;
    }
    return true;
  });
};
