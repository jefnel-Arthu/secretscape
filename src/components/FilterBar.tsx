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
    <div className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 shadow-sm py-3.5 px-4 sm:px-6 lg:px-8 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
              selectedCategory === 'ALL'
                ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/25'
                    : 'bg-stone-100 text-stone-500 hover:bg-amber-50 hover:text-amber-700 hover:border hover:border-amber-200'
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
            className="bg-stone-100 text-stone-600 text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 cursor-pointer font-semibold transition-colors"
          >
            <option value="ALL">Tous les niveaux</option>
            <option value="facile">🟢 Accessible</option>
            <option value="moyen">🟡 Bien caché</option>
            <option value="insider">🔴 Secret d'initié</option>
          </select>

          {/* Toggle Map / Grid */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                viewMode === 'map'
                  ? 'bg-white text-stone-900 shadow-md shadow-stone-200'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
              id="view-map-toggle"
            >
              <Map className="w-3.5 h-3.5 text-amber-600" />
              <span>Carte</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-md shadow-stone-200'
                  : 'text-stone-400 hover:text-stone-700'
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
