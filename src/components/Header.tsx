import React from 'react';
import { Home, Compass, Calendar as CalendarIcon, Bookmark, Images, MapPin, Search, Lock } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'map' | 'gallery' | 'calendar' | 'addSpot' | 'favorites' | 'services' | 'contact' | 'admin';
  setActiveTab: (tab: 'home' | 'map' | 'gallery' | 'calendar' | 'addSpot' | 'favorites' | 'services' | 'contact' | 'admin') => void;
  calendarItemsCount: number;
  favoritesCount: number;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const NAV_ITEMS: {
  tab: 'home' | 'map' | 'gallery' | 'calendar' | 'favorites' | 'services' | 'contact' | 'admin';
  icon: React.ElementType;
  label: string;
}[] = [
  { tab: 'home', icon: Home, label: 'Accueil' },
  { tab: 'map', icon: Compass, label: 'Lieux' },
  { tab: 'gallery', icon: Images, label: 'Galerie' },
  { tab: 'calendar', icon: CalendarIcon, label: 'Calendrier' },
  { tab: 'favorites', icon: Bookmark, label: 'Favoris' },
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
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800/60 shadow-lg shadow-stone-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-2 gap-6">

          {/* Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all group-hover:scale-105 group-hover:-rotate-3">
              <Compass className="w-5 h-5 text-stone-950 stroke-[2.5]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-black text-white block leading-none tracking-tight">
                Secret<span className="text-amber-400">Scape</span>
              </span>
              <span className="text-[10px] text-stone-500 font-semibold tracking-[3px] uppercase block mt-1">
                Bénin
              </span>
            </div>
          </button>

          {/* Search Bar — desktop */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md justify-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Rechercher un lieu secret..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-800/80 text-stone-200 placeholder-stone-500 text-sm pl-11 pr-12 py-3 rounded-2xl border border-stone-700/40 focus:outline-none focus:border-amber-500/60 focus:bg-stone-800 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
              />
            </div>
            <div className="relative shrink-0">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/80" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-stone-800/80 text-stone-300 text-sm pl-9 pr-8 py-3 rounded-2xl border border-stone-700/40 focus:outline-none focus:border-amber-500/60 cursor-pointer appearance-none font-medium transition-all hover:bg-stone-800"
              >
                <option value="ALL">Toutes</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1.5">
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
                  aria-label={label}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-amber-500 text-stone-950 text-[10px] font-black rounded-full px-1 shadow-sm">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Divider */}
            <div className="w-px h-7 bg-stone-700/50 mx-1.5" />

            {/* Admin */}
            <button
              onClick={() => setActiveTab('admin')}
              title="Admin"
              aria-label="Admin"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                  : 'text-stone-500 hover:bg-stone-800 hover:text-stone-300 hover:scale-105'
              }`}
            >
              <Lock className="w-4 h-4" />
            </button>
          </nav>

        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Chercher un lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-800/80 text-stone-200 placeholder-stone-500 text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-stone-700/40 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-stone-800/80 text-stone-300 text-sm px-4 py-2.5 rounded-2xl border border-stone-700/40 appearance-none"
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