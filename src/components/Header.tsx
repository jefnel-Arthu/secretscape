import React from 'react';
import { Home, Compass, Calendar as CalendarIcon, PlusCircle, Bookmark, MapPin, Search, ConciergeBell, Phone, Lock } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'map' | 'calendar' | 'addSpot' | 'favorites' | 'services' | 'contact' | 'admin';
  setActiveTab: (tab: 'home' | 'map' | 'calendar' | 'addSpot' | 'favorites' | 'services' | 'contact' | 'admin') => void;
  calendarItemsCount: number;
  favoritesCount: number;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAddSpotModalOpen: boolean;
}

const NAV_ITEMS: {
  tab: 'home' | 'map' | 'calendar' | 'favorites' | 'services' | 'contact' | 'admin';
  icon: React.ElementType;
  label: string;
}[] = [
  { tab: 'home', icon: Home, label: 'Accueil' },
  { tab: 'map', icon: Compass, label: 'Lieux' },
  { tab: 'calendar', icon: CalendarIcon, label: 'Calendrier' },
  { tab: 'favorites', icon: Bookmark, label: 'Favoris' },
  { tab: 'services', icon: ConciergeBell, label: 'Services' },
  { tab: 'contact', icon: Phone, label: 'Contact' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  calendarItemsCount,
  favoritesCount,
  selectedCity,
  setSelectedCity,
  cities,
  searchQuery,
  setSearchQuery,
  isAddSpotModalOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800/80 shadow-lg shadow-stone-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
              <Compass className="w-5 h-5 text-stone-950 stroke-[2.5]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-black text-white block leading-none tracking-tight">
                Secret<span className="text-amber-400">Scape</span>
              </span>
              <span className="text-[9px] text-stone-500 font-semibold tracking-[2px] uppercase block mt-0.5">
                Bénin
              </span>
            </div>
          </button>

          {/* Search Bar — desktop */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Rechercher un lieu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-800/60 text-stone-200 placeholder-stone-500 text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-700/50 focus:outline-none focus:border-amber-500/50 focus:bg-stone-800 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div className="relative shrink-0">
              <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-500/70" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-stone-800/60 text-stone-300 text-xs pl-8 pr-5 py-2 rounded-xl border border-stone-700/50 focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none font-medium transition-all"
              >
                <option value="ALL">Toutes</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Nav Icons */}
          <nav className="flex items-center gap-0.5">
            {NAV_ITEMS.map(({ tab, icon: Icon, label }) => {
              const isActive = activeTab === tab;
              let badge = 0;
              if (tab === 'calendar') badge = calendarItemsCount;
              if (tab === 'favorites') badge = favoritesCount;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  title={label}
                  className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center bg-amber-500 text-stone-950 text-[9px] font-black rounded-full px-1 shadow-sm">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Divider */}
            <div className="w-px h-5 bg-stone-700/60 mx-1" />

            {/* Add Spot */}
            <button
              onClick={() => setActiveTab('addSpot')}
              title="Proposer un lieu"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isAddSpotModalOpen
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <PlusCircle className="w-[18px] h-[18px]" />
            </button>

            {/* Admin */}
            <button
              onClick={() => setActiveTab('admin')}
              title="Admin"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                  : 'text-stone-500 hover:bg-stone-800 hover:text-stone-300'
              }`}
            >
              <Lock className="w-4 h-4" />
            </button>
          </nav>

        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Chercher un lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-800/60 text-stone-200 placeholder-stone-500 text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-700/50 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-stone-800/60 text-stone-300 text-xs px-3 py-2 rounded-xl border border-stone-700/50 appearance-none"
          >
            <option value="ALL">Toutes</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

      </div>
    </header>
  );
};
