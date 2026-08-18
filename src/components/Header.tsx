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
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-900 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-stone-100 block leading-none">
                Secret<span className="text-amber-400">Scape</span>
              </span>
              <span className="text-[10px] text-stone-400 font-medium tracking-wider uppercase block mt-1">
                Lieux Cachés & Itinéraires
              </span>
            </div>
          </div>

          {/* Quick Search & City Select */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Rechercher une pépite, un passage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-800/80 text-stone-200 placeholder-stone-400 text-sm pl-9 pr-3 py-1.5 rounded-lg border border-stone-700/60 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div className="relative shrink-0">
              <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-stone-800 text-stone-200 text-xs pl-8 pr-6 py-1.5 rounded-lg border border-stone-700/60 focus:outline-none focus:border-amber-500 cursor-pointer appearance-none font-medium"
              >
                <option value="ALL">Toutes les destinations</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'home'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Accueil</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'map'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
              id="nav-map-btn"
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Lieux</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                activeTab === 'calendar'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
              id="nav-calendar-btn"
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Mon Calendrier</span>
              {calendarItemsCount > 0 && (
                <span className="ml-0.5 bg-amber-900 text-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-500/40">
                  {calendarItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all relative ${
                activeTab === 'favorites'
                  ? 'bg-stone-800 text-amber-400 border border-amber-500/30'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
              title="Mes Favoris"
            >
              <Bookmark className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('addSpot')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                activeTab === 'addSpot' || isAddSpotModalOpen
                  ? 'bg-stone-800 text-stone-100 border border-amber-500/40'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
              title="Proposer un lieu secret"
            >
              <PlusCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'services'
                  ? 'bg-stone-800 text-stone-100 border border-amber-500/40'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
              title="Espace Services"
            >
              <ConciergeBell className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'contact'
                  ? 'bg-stone-800 text-stone-100 border border-amber-500/40'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
              title="Contact"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-stone-800 text-stone-100 border border-amber-500/40'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
              title="Admin"
            >
              <Lock className="w-4 h-4" />
            </button>
          </nav>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Chercher un lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-800 text-stone-200 placeholder-stone-400 text-xs pl-9 pr-3 py-1.5 rounded-lg border border-stone-700"
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-stone-800 text-stone-200 text-xs px-2 py-1.5 rounded-lg border border-stone-700"
          >
            <option value="ALL">Toutes villes</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

      </div>
    </header>
  );
};
