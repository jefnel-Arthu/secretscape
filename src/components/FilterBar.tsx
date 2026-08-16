import React from 'react';
import { SecretCategory, SecretLevel } from '../types';
import { CATEGORY_LABELS } from '../data/hiddenSpots';
import { Map, Grid, Filter, Sparkles, Compass } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: SecretCategory | 'ALL';
  setSelectedCategory: (cat: SecretCategory | 'ALL') => void;
  selectedSecretLevel: SecretLevel | 'ALL';
  setSelectedSecretLevel: (lvl: SecretLevel | 'ALL') => void;
  viewMode: 'map' | 'grid';
  setViewMode: (mode: 'map' | 'grid') => void;
  totalSpotsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedSecretLevel,
  setSelectedSecretLevel,
  viewMode,
  setViewMode,
  totalSpotsCount,
}) => {
  return (
    <div className="bg-white border-b border-stone-200 shadow-sm py-3 px-4 sm:px-6 lg:px-8 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tous ({totalSpotsCount})
          </button>

          {Object.entries(CATEGORY_LABELS).map(([key, item]) => {
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as SecretCategory)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode & Secret Level */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <select
            value={selectedSecretLevel}
            onChange={(e) => setSelectedSecretLevel(e.target.value as any)}
            className="bg-stone-100 text-stone-700 text-xs px-3 py-1.5 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer font-medium"
          >
            <option value="ALL">Tous les niveaux</option>
            <option value="facile">Accessible</option>
            <option value="moyen">Bien caché</option>
            <option value="insider">Secret d'initié</option>
          </select>

          {/* Toggle Map / Grid */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200">
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              id="view-map-toggle"
            >
              <Map className="w-3.5 h-3.5 text-amber-600" />
              <span>Carte</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              id="view-grid-toggle"
            >
              <Grid className="w-3.5 h-3.5 text-amber-600" />
              <span>Catalogue</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
