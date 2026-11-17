/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { HiddenSpot, SecretCategory, SecretLevel, UserTripCalendar, TimeSlot } from './types';
import { INITIAL_HIDDEN_SPOTS } from './data/hiddenSpots';
import { filterSpots } from './lib/filter';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { FilterBar } from './components/FilterBar';
import { MapExplorer } from './components/MapExplorer';
import { SpotCard } from './components/SpotCard';
import { GalleryView } from './components/GalleryView';
import { VisitorPhotosView } from './components/VisitorPhotosView';
import { AddVisitorPhotoModal } from './components/AddVisitorPhotoModal';
import { CalendarItineraryView } from './components/CalendarItineraryView';
import { TravelPlannerView } from './components/TravelPlannerView';
import { SpotDetailModal } from './components/SpotDetailModal';
import { AddSpotModal } from './components/AddSpotModal';
import { ServicesView } from './components/ServicesView';
import { ContactView } from './components/ContactView';
import { AdminPanel } from './components/AdminPanel';
import { NavigationModal } from './components/NavigationModal';
import { PhotoCreditsModal } from './components/PhotoCreditsModal';
import { AGENCY_CONTACT, AGENCY_PHONE_HREF } from './data/contact';
import { FEATURED_DESTINATIONS } from './data/destinations';
import { Sparkles, Bookmark, Calendar, Compass, Search, Loader2, ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';

const APP_VERSION = '2.1';

function migrateStorage() {
  const stored = localStorage.getItem('secretscape_version');
  if (stored !== APP_VERSION) {
    localStorage.removeItem('secretscape_spots');
    localStorage.removeItem('secretscape_favorites');
    localStorage.removeItem('secretscape_calendar');
    localStorage.setItem('secretscape_version', APP_VERSION);
  }
}

export default function App() {
  migrateStorage();
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'gallery' | 'souvenirs' | 'calendar' | 'addSpot' | 'favorites' | 'services' | 'contact' | 'admin'>('home');
  const [calendarView, setCalendarView] = useState<'planner' | 'itinerary'>('planner');
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('grid');
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  // Spots dataset
  const [spots, setSpots] = useState<HiddenSpot[]>(() => {
    const saved = localStorage.getItem('secretscape_spots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_HIDDEN_SPOTS.filter(s => !parsed.some((p: any) => p.id === s.id))];
      } catch (e) {
        return INITIAL_HIDDEN_SPOTS;
      }
    }
    return INITIAL_HIDDEN_SPOTS;
  });

  // Filter state
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<SecretCategory | 'ALL'>('ALL');
  const [selectedSecretLevel, setSelectedSecretLevel] = useState<SecretLevel | 'ALL'>('ALL');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('secretscape_favorites');
    return saved ? JSON.parse(saved) : ['spot-ganvie-1', 'spot-ouidah-pythons'];
  });

  // Trip Calendar State
  const [calendar, setCalendar] = useState<UserTripCalendar>(() => {
    const saved = localStorage.getItem('secretscape_calendar');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      title: "Mon Escapade aux Secrets du Bénin",
      destinationCity: "Bénin (Cotonou & Ouidah)",
      startDate: new Date().toISOString().split('T')[0],
      days: [
        {
          dayNumber: 1,
          title: "Jour 1: Cotonou & Secrets Urbains",
          items: [
            {
              id: "item-init-1",
              spotId: "spot-cotonou-fetiches",
              spot: INITIAL_HIDDEN_SPOTS[9],
              timeSlot: "morning",
              timeString: "09:30"
            },
            {
              id: "item-init-2",
              spotId: "spot-cotonou-zinsou",
              spot: INITIAL_HIDDEN_SPOTS[11],
              timeSlot: "afternoon",
              timeString: "15:00"
            }
          ]
        },
        {
          dayNumber: 2,
          title: "Jour 2: Ouidah, Pythons & Mémoire",
          items: [
            {
              id: "item-init-3",
              spotId: "spot-ouidah-pythons",
              spot: INITIAL_HIDDEN_SPOTS[7],
              timeSlot: "morning",
              timeString: "09:30"
            }
          ]
        }
      ]
    };
  });

  // Selected spot modal & toast state
  const [selectedSpot, setSelectedSpot] = useState<HiddenSpot | null>(null);
  const [selectedSpotModal, setSelectedSpotModal] = useState<HiddenSpot | null>(null);
  const [isAddSpotModalOpen, setIsAddSpotModalOpen] = useState<boolean>(false);
  const [navigationSpot, setNavigationSpot] = useState<HiddenSpot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Visitor photos state
  const [visitorPhotoModalOpen, setVisitorPhotoModalOpen] = useState<boolean>(false);
  const [visitorPhotoInitialSpot, setVisitorPhotoInitialSpot] = useState<string | null>(null);
  const [souvenirsRefreshKey, setSouvenirsRefreshKey] = useState<number>(0);

  const openAddVisitorPhoto = useCallback((spotId?: string | null) => {
    setVisitorPhotoInitialSpot(spotId ?? null);
    setVisitorPhotoModalOpen(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('secretscape_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('secretscape_calendar', JSON.stringify(calendar));
  }, [calendar]);

  useEffect(() => {
    const initialIds = new Set(INITIAL_HIDDEN_SPOTS.map(s => s.id));
    const customSpots = spots.filter(s => !initialIds.has(s.id));
    localStorage.setItem('secretscape_spots', JSON.stringify(customSpots));
  }, [spots]);

  // Session ID — shared between heartbeat and trackAction
  const sessionIdRef = useRef(`sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  // Heartbeat: track active visitors on server
  useEffect(() => {
    const sessionId = sessionIdRef.current;
    const sendHeartbeat = async () => {
      try { await fetch('/api/track/heartbeat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) }); } catch {}
    };
    sendHeartbeat();
    const hb = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(hb);
  }, []);

  // Extract unique cities
  const cities = useMemo(() => {
    const set = new Set(spots.map(s => s.city));
    return Array.from(set).sort();
  }, [spots]);

  // Filtered spots list
  const filteredSpots = useMemo(() => {
    return filterSpots(spots, {
      city: selectedCity,
      category: selectedCategory,
      secretLevel: selectedSecretLevel,
      searchQuery,
    });
  }, [spots, selectedCity, selectedCategory, selectedSecretLevel, searchQuery]);

  // Nouvelle recherche / nouveau filtre → on repart des 24 premiers résultats
  useEffect(() => {
    setVisibleCount(24);
  }, [filteredSpots]);

  // Add spot to trip calendar
  const handleAddToCalendar = (spot: HiddenSpot, dayNumber = 1, timeSlot: TimeSlot = 'afternoon') => {
    setCalendar(prev => {
      const days = [...prev.days];
      let targetDayIndex = days.findIndex(d => d.dayNumber === dayNumber);
      if (targetDayIndex === -1) targetDayIndex = 0;

      const newItem = {
        id: `item-${spot.id}-${Date.now()}`,
        spotId: spot.id,
        spot,
        timeSlot,
        timeString: timeSlot === 'morning' ? '10:00' : timeSlot === 'noon' ? '12:30' : '15:00'
      };

      days[targetDayIndex] = {
        ...days[targetDayIndex],
        items: [...days[targetDayIndex].items, newItem]
      };

      return { ...prev, days };
    });

    showToast(`📍 ${spot.title} ajouté à votre calendrier !`);
    trackAction('calendar_add', `${spot.title} ajouté au planning`, spot.id);
  };

  // Handle new user spot submission
  const handleAddUserSpot = (newSpot: HiddenSpot) => {
    setSpots(prev => [newSpot, ...prev]);
    showToast(`✨ Nouveau lieu secret publié !`);
    trackAction('spot_proposal', `Nouveau lieu proposé: ${newSpot.title}`, newSpot.id);
  };

  // Toast notification trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generic action tracker — sends to dashboard live feed
  const trackAction = useCallback((type: string, detail: string, spotId?: string) => {
    fetch('/api/track/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, detail, spotId, sessionId: sessionIdRef.current }),
    }).catch(() => {});
  }, []);

  // Track page view on mount
  useEffect(() => {
    fetch('/api/track/pageview', { method: 'POST' }).catch(() => {});
    trackAction('visit', 'Nouveau visiteur sur le site');
  }, [trackAction]);

  // Track tab navigation
  const prevTab = useRef(activeTab);
  useEffect(() => {
    if (prevTab.current !== activeTab) {
      trackAction('navigate', `Navigation: ${activeTab}`);
      prevTab.current = activeTab;
    }
  }, [activeTab, trackAction]);

  // Track time spent on each tab when leaving
  const tabEntryTime = useRef(Date.now());
  useEffect(() => {
    tabEntryTime.current = Date.now();
    return () => {
      const spent = Math.round((Date.now() - tabEntryTime.current) / 1000);
      if (spent > 2) {
        trackAction('time_spent', `${prevTab.current}: ${spent}s`);
      }
    };
  }, [activeTab, trackAction]);

  // Track search queries (debounced)
  const searchDebounce = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (searchQuery.length >= 2) {
      clearTimeout(searchDebounce.current);
      searchDebounce.current = setTimeout(() => {
        trackAction('search', `Recherche: "${searchQuery}"`);
      }, 1500);
    }
    return () => clearTimeout(searchDebounce.current);
  }, [searchQuery, trackAction]);

  // Track filter changes
  const prevCity = useRef(selectedCity);
  useEffect(() => {
    if (prevCity.current !== selectedCity) {
      trackAction('filter_city', `Filtre ville: ${selectedCity === 'ALL' ? 'Toutes' : selectedCity}`);
      prevCity.current = selectedCity;
    }
  }, [selectedCity, trackAction]);

  const prevCategory = useRef(selectedCategory);
  useEffect(() => {
    if (prevCategory.current !== selectedCategory) {
      trackAction('filter_category', `Filtre catégorie: ${selectedCategory === 'ALL' ? 'Toutes' : selectedCategory}`);
      prevCategory.current = selectedCategory;
    }
  }, [selectedCategory, trackAction]);

  const prevSecretLevel = useRef(selectedSecretLevel);
  useEffect(() => {
    if (prevSecretLevel.current !== selectedSecretLevel) {
      trackAction('filter_secret', `Filtre secret: ${selectedSecretLevel === 'ALL' ? 'Tous' : selectedSecretLevel}`);
      prevSecretLevel.current = selectedSecretLevel;
    }
  }, [selectedSecretLevel, trackAction]);

  // Track view mode switch (map vs grid)
  const prevViewMode = useRef(viewMode);
  useEffect(() => {
    if (prevViewMode.current !== viewMode) {
      trackAction('view_mode', `Mode d'affichage: ${viewMode}`);
      prevViewMode.current = viewMode;
    }
  }, [viewMode, trackAction]);

  // Track spot views
  const trackSpotView = useCallback((spotId: string) => {
    fetch('/api/track/spot-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotId }),
    }).catch(() => {});
    const spot = spots.find(s => s.id === spotId);
    trackAction('spot_view', spot ? `Consultation: ${spot.title}` : `Consultation: ${spotId}`, spotId);
  }, [spots, trackAction]);

  // Track spot modal opens
  useEffect(() => {
    if (selectedSpotModal) {
      trackSpotView(selectedSpotModal.id);
    }
  }, [selectedSpotModal, trackSpotView]);

  // Track favorites
  const handleToggleFavorite = useCallback((spot: HiddenSpot) => {
    const wasFavorite = favorites.includes(spot.id);
    setFavorites(prev => {
      if (prev.includes(spot.id)) {
        showToast(`Retiré des favoris: ${spot.title}`);
        return prev.filter(id => id !== spot.id);
      } else {
        showToast(`Ajouté aux favoris: ${spot.title}`);
        return [...prev, spot.id];
      }
    });
    fetch('/api/track/favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotId: spot.id, action: wasFavorite ? 'remove' : 'add' }),
    }).catch(() => {});
    trackAction(wasFavorite ? 'favorite_remove' : 'favorite_add', `${wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'}: ${spot.title}`, spot.id);
  }, [favorites, trackAction]);

  const calendarItemsCount = calendar.days.reduce((acc, d) => acc + d.items.length, 0);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans overflow-x-hidden">
      
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[700] bg-stone-900 text-stone-100 px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'addSpot') {
            setIsAddSpotModalOpen(true);
          } else if (tab === 'admin') {
            setActiveTab('admin');
          } else {
            if (tab === 'souvenirs') setVisitorPhotoInitialSpot(null);
            if (tab === 'calendar') setCalendarView('planner');
            setActiveTab(tab);
          }
        }}
        calendarItemsCount={calendarItemsCount}
        favoritesCount={favorites.length}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cities={cities}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {/* Home / Landing Page */}
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab) => {
              trackAction('homepage_click', `Clic homepage: ${tab}`);
              if (tab === 'map') {
                setViewMode('map');
              }
              if (tab === 'calendar') {
                setCalendarView('planner');
              }
              setActiveTab(tab as any);
            }}
            onNavigateToCategory={(category) => {
              trackAction('category_click', `Clic catégorie homepage: ${category}`);
              setSelectedCategory(category as any);
              setActiveTab('map');
            }}
            onNavigateToCity={(city) => {
              trackAction('homepage_city', `Navigation ville: ${city}`);
              setSelectedCity(city);
              setActiveTab('map');
            }}
            onOpenSpot={(spotId) => {
              const spot = INITIAL_HIDDEN_SPOTS.find((s) => s.id === spotId);
              if (!spot) return;
              trackAction('spot_preview', `Aperçu lieu: ${spot.title}`, spot.id);
              setSelectedSpotModal(spot);
            }}
          />
        )}

        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col">
            <FilterBar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSecretLevel={selectedSecretLevel}
              setSelectedSecretLevel={setSelectedSecretLevel}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalSpotsCount={filteredSpots.length}
            />

            {viewMode === 'map' ? (
              <MapExplorer
                spots={filteredSpots}
                selectedSpot={selectedSpot}
                onSelectSpot={(spot) => setSelectedSpot(spot)}
                onOpenSpotDetail={(spot) => setSelectedSpotModal(spot)}
                onClosePanel={() => setSelectedSpot(null)}
                onAddToCalendar={(spot) => handleAddToCalendar(spot)}
                onToggleFavorite={handleToggleFavorite}
                onNavigate={(spot) => { setNavigationSpot(spot); trackAction('navigate_to', `Navigation vers: ${spot.title}`, spot.id); }}
                favorites={favorites}
              />
            ) : (
              /* Grid / Catalog View */
              <div className="relative flex-1 w-full min-h-[70vh]">
                <div className="absolute inset-0">
                  <img src="/images/localized/fond-catalogue-c4f213.jpg" alt="Fond catalogue" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0b1b2b]/15 via-transparent to-[#0b1b2b]/25" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                  {filteredSpots.length === 0 ? (
                    <div className="text-center py-20 bg-white/95 backdrop-blur-sm rounded-3xl border border-white/20 p-8 space-y-4 shadow-2xl">
                      <Compass className="w-12 h-12 text-stone-300 mx-auto" />
                      <h3 className="font-display font-bold text-lg text-stone-800">Aucun lieu secret ne correspond à vos filtres</h3>
                      <p className="text-stone-500 text-xs">Essayez d'élargir votre recherche.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSpots.slice(0, visibleCount).map(spot => (
                        <SpotCard
                          key={spot.id}
                          spot={spot}
                          onSelectSpot={(s) => setSelectedSpotModal(s)}
                          onAddToCalendar={(s) => handleAddToCalendar(s)}
                          onToggleFavorite={handleToggleFavorite}
                          isFavorite={favorites.includes(spot.id)}
                        />
                      ))}
                    </div>
                  )}
                  {filteredSpots.length > visibleCount && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => setVisibleCount((count) => count + 24)}
                        className="px-6 py-3 rounded-xl bg-white/95 hover:bg-white text-stone-800 text-sm font-semibold shadow-lg transition-colors"
                      >
                        Afficher {Math.min(24, filteredSpots.length - visibleCount)} lieux de plus
                        <span className="ml-2 text-stone-500 font-normal">
                          ({visibleCount}/{filteredSpots.length})
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gallery View */}
        {activeTab === 'gallery' && (
          <GalleryView />
        )}

        {/* Visitor Photos View */}
        {activeTab === 'souvenirs' && (
          <VisitorPhotosView
            key={`souvenirs-${souvenirsRefreshKey}`}
            spots={spots}
            initialSpotId={visitorPhotoInitialSpot}
            onAddPhoto={(spotId) => openAddVisitorPhoto(spotId)}
          />
        )}

        {/* Planner / itinerary */}
        {activeTab === 'calendar' && (
          <>
            {/* The planner stays mounted so a visit to the carnet keeps the form intact. */}
            <div className={calendarView === 'planner' ? 'w-full' : 'hidden'}>
              <TravelPlannerView
                itineraryCount={calendarItemsCount}
                onOpenItinerary={() => {
                  trackAction('open_itinerary', 'Ouverture du carnet d’escapade');
                  setCalendarView('itinerary');
                }}
              />
            </div>

            {calendarView === 'itinerary' && (
              <div className="w-full bg-[#F6F4EF] pb-6">
                <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                  <button
                    type="button"
                    onClick={() => setCalendarView('planner')}
                    className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#E7E2D8] bg-white px-4 py-2 text-[13px] font-semibold text-[#0b1b2b] shadow-sm transition-colors hover:border-[#D97706] hover:text-[#B45309]"
                  >
                    <ArrowLeft className="h-4 w-4 text-[#D97706]" />
                    Retour au planificateur
                  </button>
                </div>
                <CalendarItineraryView
                  calendar={calendar}
                  setCalendar={setCalendar}
                  onOpenSpotModal={(spot) => setSelectedSpotModal(spot)}
                  onNavigateToMap={() => setActiveTab('map')}
                />
              </div>
            )}
          </>
        )}

        {/* Favorites View */}
        {activeTab === 'favorites' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h1 className="font-display font-bold text-2xl text-stone-900 flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-rose-500 fill-current" />
                <span>Mes Lieux Secrets Favoris ({favorites.length})</span>
              </h1>
              <p className="text-stone-500 text-xs mt-1">Vos pépites sauvegardées à garder précieusement.</p>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
                <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-display font-bold text-base text-stone-800">Aucun favori pour le moment</h3>
                <p className="text-stone-500 text-xs">Cliquez sur l'icône marque-page sur un lieu secret pour le retrouver ici.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {spots.filter(s => favorites.includes(s.id)).map(spot => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    onSelectSpot={(s) => setSelectedSpotModal(s)}
                    onAddToCalendar={(s) => handleAddToCalendar(s)}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services View */}
        {activeTab === 'services' && (
          <ServicesView onNavigateToContact={() => {
            trackAction('services_to_contact', 'Navigation services → contact');
            setActiveTab('contact');
          }} />
        )}

        {/* Contact View */}
        {activeTab === 'contact' && (
          <ContactView />
        )}
      </main>

      {/* Spot Detail Modal */}
      <SpotDetailModal
        key={`spot-${selectedSpotModal?.id}-${souvenirsRefreshKey}`}
        spot={selectedSpotModal}
        onClose={() => setSelectedSpotModal(null)}
        onAddToCalendar={(spot) => handleAddToCalendar(spot)}
        onToggleFavorite={handleToggleFavorite}
        onAddPhoto={(spot) => openAddVisitorPhoto(spot.id)}
        onViewAllPhotos={(spot) => {
          setVisitorPhotoInitialSpot(spot.id);
          setActiveTab('souvenirs');
        }}
        isFavorite={selectedSpotModal ? favorites.includes(selectedSpotModal.id) : false}
      />

      {/* Navigation Modal */}
      <NavigationModal
        onClose={() => setNavigationSpot(null)}
        spot={navigationSpot}
      />

        {/* Add Spot Submission Modal */}
        <AddSpotModal
          isOpen={isAddSpotModalOpen}
          onClose={() => setIsAddSpotModalOpen(false)}
          onAddSpot={handleAddUserSpot}
        />

        {/* Add Visitor Photo Modal */}
        <AddVisitorPhotoModal
          isOpen={visitorPhotoModalOpen}
          onClose={() => { setVisitorPhotoModalOpen(false); setVisitorPhotoInitialSpot(null); setSouvenirsRefreshKey(k => k + 1); }}
          spots={spots}
          initialSpotId={visitorPhotoInitialSpot}
          onSubmitted={() => {
            setVisitorPhotoModalOpen(false);
            setVisitorPhotoInitialSpot(null);
            setSouvenirsRefreshKey(k => k + 1);
            showToast('Photo publiée dans la galerie des souvenirs !');
          }}
        />

        {/* Admin Panel */}
        {activeTab === 'admin' && (
          <AdminPanel onClose={() => setActiveTab('home')} />
        )}

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Marque */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-900">
                  <Compass className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="font-display text-lg font-bold text-stone-100 block leading-none">
                    Secret<span className="text-amber-400">Scape</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium tracking-wider uppercase block mt-0.5">
                    Lieux Cachés & Itinéraires
                  </span>
                </div>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed max-w-xs">
                Les lieux secrets du Bénin, racontés par ceux qui y vivent. Des adresses vérifiées,
                des itinéraires modulables et des guides locaux rémunérés.
              </p>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Cotonou, Bénin · Agence locale
              </p>
            </div>

            {/* Destinations */}
            <nav className="lg:col-span-3" aria-label="Destinations">
              <h3 className="text-[10px] font-bold tracking-[0.28em] uppercase text-amber-400/90 mb-4">
                Destinations
              </h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {FEATURED_DESTINATIONS.map((city) => (
                  <li key={city}>
                    <button
                      onClick={() => {
                        setSelectedCity(city);
                        setActiveTab('map');
                      }}
                      className="text-xs text-stone-400 hover:text-amber-400 transition-colors text-left"
                    >
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Préparer */}
            <nav className="lg:col-span-2" aria-label="Préparer son voyage">
              <h3 className="text-[10px] font-bold tracking-[0.28em] uppercase text-amber-400/90 mb-4">
                Préparer
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <button onClick={() => { setCalendarView('planner'); setActiveTab('calendar'); }} className="text-xs text-stone-400 hover:text-amber-400 transition-colors">
                    Circuits sur mesure
                  </button>
                </li>
                <li>
                  <button onClick={() => { setViewMode('grid'); setActiveTab('map'); }} className="text-xs text-stone-400 hover:text-amber-400 transition-colors">
                    Excursions
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('hotels'); setActiveTab('map'); }} className="text-xs text-stone-400 hover:text-amber-400 transition-colors">
                    Hébergements
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('gallery')} className="text-xs text-stone-400 hover:text-amber-400 transition-colors">
                    Agenda culturel
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('services')} className="text-xs text-stone-400 hover:text-amber-400 transition-colors">
                    Nos services
                  </button>
                </li>
              </ul>
            </nav>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h3 className="text-[10px] font-bold tracking-[0.28em] uppercase text-amber-400/90 mb-4">
                Nous joindre
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href={AGENCY_PHONE_HREF} className="group flex items-center gap-2.5 text-xs text-stone-400 hover:text-amber-400 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 transition-colors" />
                    {AGENCY_CONTACT.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${AGENCY_CONTACT.email}`} className="group flex items-center gap-2.5 text-xs text-stone-400 hover:text-amber-400 transition-colors break-all">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-stone-500 group-hover:text-amber-400 transition-colors" />
                    {AGENCY_CONTACT.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-stone-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                  {AGENCY_CONTACT.address}
                </li>
                <li className="text-[11px] text-stone-600 leading-relaxed pl-6">
                  {AGENCY_CONTACT.hours}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-600">
            <span>&copy; {new Date().getFullYear()} SecretScape. Tous droits réservés.</span>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition-colors font-medium">Contact</button>
              <span className="text-stone-800">•</span>
              <button onClick={() => setActiveTab('addSpot')} className="hover:text-amber-400 transition-colors font-medium">Proposer un lieu</button>
              <span className="text-stone-800">•</span>
              <button onClick={() => setCreditsOpen(true)} className="hover:text-amber-400 transition-colors font-medium">Crédits photos</button>
            </div>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Site opérationnel
            </span>
          </div>
        </div>
      </footer>

      <PhotoCreditsModal open={creditsOpen} onClose={() => setCreditsOpen(false)} />

    </div>
  );
}
