import React, { useState } from 'react';
import { UserTripCalendar, CalendarDayPlan, ItinerarySlotItem, TimeSlot, HiddenSpot, TransportMode } from '../types';
import { CATEGORY_LABELS, INITIAL_HIDDEN_SPOTS } from '../data/hiddenSpots';
import { calculateDistanceKm } from '../lib/geo';
import { buildICS } from '../lib/ical';
import { TRANSPORT_OPTIONS, getTransportOption, estimateTravelMinutes } from '../lib/transport';
import { TripTicket } from './TripTicket';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Share2, 
  Compass, 
  Sparkles, 
  ArrowRight,
  Edit2,
  Check,
  GripVertical,
  Footprints,
  Bike,
  Car,
  Ship,
  Bus,
  Navigation,
  Ticket
} from 'lucide-react';

const TRANSPORT_ICONS: Record<string, React.ElementType> = {
  footprints: Footprints,
  bike: Bike,
  car: Car,
  ship: Ship,
  bus: Bus,
};

interface EditableItemDraft {
  spotId: string;
  timeSlot: TimeSlot;
  timeString: string;
  arrivalTime: string;
  departureTime: string;
  transportMode: TransportMode | '';
}

interface CalendarItineraryViewProps {
  calendar: UserTripCalendar;
  setCalendar: React.Dispatch<React.SetStateAction<UserTripCalendar>>;
  onOpenSpotModal: (spot: HiddenSpot) => void;
  onNavigateToMap: () => void;
  onOpenAiGenerator: () => void;
}

const TIME_SLOT_LABELS: Record<TimeSlot, { label: string; time: string; bg: string; border: string }> = {
  morning: { label: 'Matinée', time: '09h00', bg: 'bg-amber-50/70', border: 'border-amber-200' },
  noon: { label: 'Midi & Déjeuner', time: '12h30', bg: 'bg-orange-50/70', border: 'border-orange-200' },
  afternoon: { label: 'Après-midi', time: '15h00', bg: 'bg-emerald-50/70', border: 'border-emerald-200' },
  sunset: { label: 'Coucher de Soleil (Golden Hour)', time: '18h30', bg: 'bg-rose-50/70', border: 'border-rose-200' },
  evening: { label: 'Soirée & Nuit', time: '21h00', bg: 'bg-indigo-50/70', border: 'border-indigo-200' },
};

export const CalendarItineraryView: React.FC<CalendarItineraryViewProps> = ({
  calendar,
  setCalendar,
  onOpenSpotModal,
  onNavigateToMap,
  onOpenAiGenerator,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>(calendar.title);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableItemDraft | null>(null);
  const [showTicket, setShowTicket] = useState<boolean>(false);

  const currentDay = calendar.days[selectedDayIndex] || calendar.days[0];

  // Add a new day to trip
  const handleAddDay = () => {
    const newDayNum = calendar.days.length + 1;
    const newDay: CalendarDayPlan = {
      dayNumber: newDayNum,
      title: `Jour ${newDayNum}: Nouvelles Découvertes`,
      items: [],
    };
    setCalendar((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
    }));
    setSelectedDayIndex(calendar.days.length);
  };

  // Remove current day
  const handleRemoveDay = (dayIndex: number) => {
    if (calendar.days.length <= 1) return;
    setCalendar((prev) => ({
      ...prev,
      days: prev.days.filter((_, idx) => idx !== dayIndex),
    }));
    setSelectedDayIndex(Math.max(0, dayIndex - 1));
  };

  // Remove item from day
  const handleRemoveItem = (dayIndex: number, itemId: string) => {
    setCalendar((prev) => {
      const newDays = [...prev.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        items: newDays[dayIndex].items.filter((item) => item.id !== itemId),
      };
      return { ...prev, days: newDays };
    });
  };

  // Reorder item within the current day (drag & drop)
  const handleDropItem = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    setCalendar((prev) => {
      const day = prev.days[selectedDayIndex];
      if (!day) return prev;
      const items = [...day.items];
      const [moved] = items.splice(dragIndex, 1);
      items.splice(targetIndex, 0, moved);
      const newDays = [...prev.days];
      newDays[selectedDayIndex] = { ...day, items };
      return { ...prev, days: newDays };
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // Update the editable date of the current day
  const handleDayDateChange = (value: string) => {
    setCalendar((prev) => {
      const newDays = [...prev.days];
      newDays[selectedDayIndex] = {
        ...newDays[selectedDayIndex],
        dateString: value || undefined,
      };
      return { ...prev, days: newDays };
    });
  };

  // Start editing an item
  const handleStartEdit = (item: ItinerarySlotItem) => {
    setEditingItemId(item.id);
    setDraft({
      spotId: item.spotId,
      timeSlot: item.timeSlot,
      timeString: item.timeString,
      arrivalTime: item.arrivalTime || '',
      departureTime: item.departureTime || '',
      transportMode: item.transportMode || '',
    });
  };

  // Save the edited item
  const handleSaveItem = (dayIndex: number, itemId: string) => {
    if (!draft) return;
    setCalendar((prev) => {
      const newDays = [...prev.days];
      const day = newDays[dayIndex];
      if (!day) return prev;
      const items = day.items.map((item) => {
        if (item.id !== itemId) return item;
        const spot = INITIAL_HIDDEN_SPOTS.find((s) => s.id === draft.spotId) || item.spot;
        return {
          ...item,
          spotId: draft.spotId,
          spot,
          timeSlot: draft.timeSlot,
          timeString: draft.timeString,
          arrivalTime: draft.arrivalTime || undefined,
          departureTime: draft.departureTime || undefined,
          transportMode: draft.transportMode || undefined,
        };
      });
      newDays[dayIndex] = { ...day, items };
      return { ...prev, days: newDays };
    });
    setEditingItemId(null);
    setDraft(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setDraft(null);
  };

  // Save edited title
  const handleSaveTitle = () => {
    setCalendar((prev) => ({ ...prev, title: titleInput }));
    setIsEditingTitle(false);
  };

  // Export as ICS iCal file for Google Calendar / Apple Calendar
  const handleExportICS = () => {
    const ics = buildICS(calendar);

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${calendar.title.toLowerCase().replace(/\s+/g, '-')}-secretscape.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  // Share link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Total count of items across all days
  const totalSpotsScheduled = calendar.days.reduce((acc, d) => acc + d.items.length, 0);

  // All spots grouped by category for the "endroit" selector
  const groupedSpots = INITIAL_HIDDEN_SPOTS.reduce<Record<string, HiddenSpot[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Calendar Header Card */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider uppercase">
              <CalendarIcon className="w-4 h-4" />
              <span>Calendrier & Carnet d'Escapade</span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-300">{calendar.destinationCity}</span>
            </div>

            {/* Editable Title */}
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="bg-stone-800 text-amber-300 font-display text-2xl font-bold px-3 py-1 rounded-xl border border-amber-500/50 focus:outline-none"
                />
                <button
                  onClick={handleSaveTitle}
                  className="bg-amber-500 text-stone-950 p-2 rounded-xl text-xs font-bold"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {calendar.title}
                </h1>
                <Edit2 className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100" />
              </div>
            )}

            <p className="text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Organisez vos étapes par créneau horaire, optimisez vos déplacements secrets et exportez votre planning sur votre agenda personnel.
            </p>
          </div>

          {/* Export & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleExportICS}
              disabled={totalSpotsScheduled === 0}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              title="Exporter vers Google Calendar / Apple iCal"
            >
              <Download className="w-4 h-4" />
              <span>Exporter iCal (.ics)</span>
            </button>

            <button
              onClick={() => setShowTicket(true)}
              disabled={totalSpotsScheduled === 0}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-40 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              title="Télécharger mon billet de voyage"
            >
              <Ticket className="w-4 h-4" />
              <span>Mon billet</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-stone-700/80 flex items-center gap-1.5 transition-all"
              title="Imprimer ou enregistrer en PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-stone-700/80 flex items-center gap-1.5 transition-all"
              title="Copier le lien"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Copié !' : 'Partager'}</span>
            </button>

            <button
              onClick={onOpenAiGenerator}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Générer par IA</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center gap-6 text-xs text-stone-400">
          <div>
            <span className="text-stone-500 block text-[10px]">Lieux au programme</span>
            <span className="text-amber-400 font-bold text-base">{totalSpotsScheduled} pépites</span>
          </div>
          <div className="h-6 w-px bg-stone-800" />
          <div>
            <span className="text-stone-500 block text-[10px]">Nombre de jours</span>
            <span className="text-stone-200 font-bold text-base">{calendar.days.length} jour(s)</span>
          </div>
        </div>
      </div>

      {/* Days Tabs Selector */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {calendar.days.map((day, idx) => {
            const isActive = selectedDayIndex === idx;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md scale-105'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>Jour {day.dayNumber}</span>
                {day.items.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-amber-950 text-amber-200' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {day.items.length}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={handleAddDay}
            className="px-3 py-2.5 rounded-2xl border border-dashed border-stone-300 text-stone-500 hover:text-stone-800 hover:border-stone-400 text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un jour</span>
          </button>
        </div>

        {calendar.days.length > 1 && (
          <button
            onClick={() => handleRemoveDay(selectedDayIndex)}
            className="text-stone-400 hover:text-rose-600 text-xs font-medium flex items-center gap-1 px-2 py-1 transition-colors shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer le jour {currentDay.dayNumber}</span>
          </button>
        )}
      </div>

      {/* Main Day Timeline Schedule */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-stone-900">
              {currentDay.title || `Jour ${currentDay.dayNumber}`}
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">
              Glissez et planifiez vos visites aux meilleurs moments d'affluence.
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
              <input
                type="date"
                value={currentDay.dateString || ''}
                onChange={(e) => handleDayDateChange(e.target.value)}
                className="text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                title="Modifier la date de cette journée"
              />
              <span className="text-stone-400 text-[11px]">Date de la journée</span>
            </div>
          </div>

          <button
            onClick={onNavigateToMap}
            className="text-amber-700 hover:text-amber-800 font-semibold text-xs flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Explorer la carte pour ajouter</span>
          </button>
        </div>

        {/* Empty State */}
        {currentDay.items.length === 0 ? (
          <div className="text-center py-16 px-4 bg-stone-50/60 rounded-2xl border border-dashed border-stone-200 space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CalendarIcon className="w-8 h-8 stroke-[1.8]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-display text-lg font-bold text-stone-800">
                Votre journée est libre !
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed">
                Naviguez sur la carte des lieux secrets ou laissez l'IA créer automatiquement un itinéraire équilibré pour ce jour.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onNavigateToMap}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Découvrir la carte</span>
              </button>
              <button
                onClick={onOpenAiGenerator}
                className="bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Générer par IA</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative">
            {currentDay.items.map((item, itemIdx) => {
              const slotInfo = TIME_SLOT_LABELS[item.timeSlot] || TIME_SLOT_LABELS.morning;
              const nextItem = currentDay.items[itemIdx + 1];
              const itemTransport = getTransportOption(item.transportMode);
              const TransportIcon = TRANSPORT_ICONS[itemTransport.icon] || Navigation;

              let distKm: number | null = null;
              let travelMin: number | null = null;
              let travelTransport = itemTransport;
              if (nextItem) {
                distKm = calculateDistanceKm(
                  item.spot.coordinates.lat,
                  item.spot.coordinates.lng,
                  nextItem.spot.coordinates.lat,
                  nextItem.spot.coordinates.lng
                );
                travelTransport = getTransportOption(nextItem.transportMode);
                travelMin = estimateTravelMinutes(distKm, nextItem.transportMode);
              }

              return (
                <React.Fragment key={item.id}>
                  <div
                    draggable
                    onDragStart={(e) => {
                      setDragIndex(itemIdx);
                      setDragOverIndex(null);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      setDragOverIndex(itemIdx);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropItem(itemIdx);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    className={`group relative rounded-2xl p-5 border shadow-sm transition-all space-y-4 cursor-grab active:cursor-grabbing ${
                      dragIndex === itemIdx
                        ? 'bg-amber-50 border-amber-300 opacity-60'
                        : dragOverIndex === itemIdx && dragIndex !== null
                          ? 'bg-white border-amber-400 ring-2 ring-amber-200'
                          : 'bg-stone-50/80 hover:bg-white border-stone-200 hover:shadow-md'
                    }`}
                  >
                    {/* Item Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-stone-300 hover:text-amber-600 transition-colors" title="Glisser pour réordonner">
                          <GripVertical className="w-4 h-4" />
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${slotInfo.bg} ${slotInfo.border} text-stone-800`}>
                          {slotInfo.label} • {item.arrivalTime || item.timeString || slotInfo.time}
                          {item.departureTime ? ` → ${item.departureTime}` : ''}
                        </span>
                        <span className="text-stone-400 text-xs">•</span>
                        <span className="text-stone-500 text-xs font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          {item.spot.city}
                        </span>
                        {item.transportMode && (
                          <span
                            className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 rounded-lg px-2 py-0.5 flex items-center gap-1"
                            title={`Déplacement: ${itemTransport.label} — ${itemTransport.costHint}`}
                          >
                            <TransportIcon className="w-3 h-3 text-cyan-600" />
                            {itemTransport.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {editingItemId !== item.id && (
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="text-stone-400 hover:text-amber-600 p-1 rounded-lg transition-colors"
                            title="Modifier l'étape (lieu, heure, arrivée, départ)"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveItem(selectedDayIndex, item.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                          title="Retirer du calendrier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Edit Panel */}
                    {editingItemId === item.id && draft && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-white border border-amber-300 rounded-xl p-3 shadow-inner">
                        <label className="sm:col-span-2 lg:col-span-1 block">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Endroit</span>
                          <select
                            value={draft.spotId}
                            onChange={(e) => setDraft({ ...draft, spotId: e.target.value })}
                            className="w-full text-xs text-stone-800 bg-white border border-stone-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400"
                          >
                            {Object.entries(groupedSpots).map(([cat, spots]) => (
                              <optgroup key={cat} label={CATEGORY_LABELS[cat]?.name || cat}>
                                {spots.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.title} — {s.city}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Créneau</span>
                          <select
                            value={draft.timeSlot}
                            onChange={(e) => setDraft({ ...draft, timeSlot: e.target.value as TimeSlot })}
                            className="w-full text-xs text-stone-800 bg-white border border-stone-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400"
                          >
                            {(Object.keys(TIME_SLOT_LABELS) as TimeSlot[]).map((slot) => (
                              <option key={slot} value={slot}>
                                {TIME_SLOT_LABELS[slot].label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Heure</span>
                          <input
                            type="time"
                            value={draft.timeString}
                            onChange={(e) => setDraft({ ...draft, timeString: e.target.value })}
                            className="w-full text-xs text-stone-800 bg-white border border-stone-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400"
                          />
                        </label>

                        <label className="block">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Arrivée (début)</span>
                          <input
                            type="time"
                            value={draft.arrivalTime}
                            onChange={(e) => setDraft({ ...draft, arrivalTime: e.target.value })}
                            className="w-full text-xs text-stone-800 bg-white border border-stone-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400"
                          />
                        </label>

                        <label className="block">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Départ (fin)</span>
                          <input
                            type="time"
                            value={draft.departureTime}
                            onChange={(e) => setDraft({ ...draft, departureTime: e.target.value })}
                            className="w-full text-xs text-stone-800 bg-white border border-stone-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400"
                          />
                        </label>

                        <label className="block sm:col-span-2 lg:col-span-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                            Déplacement (pour y aller)
                          </span>
                          <select
                            value={draft.transportMode}
                            onChange={(e) => setDraft({ ...draft, transportMode: e.target.value as TransportMode | '' })}
                            className="w-full text-xs text-stone-800 bg-white border border-stone-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400"
                          >
                            <option value="">À définir (défaut: à pied)</option>
                            {TRANSPORT_OPTIONS.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.label} — {t.costHint}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className="sm:col-span-2 lg:col-span-5 flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={handleCancelEdit}
                            className="text-xs font-semibold text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleSaveItem(selectedDayIndex, item.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Main Item Content Grid */}
                    <div 
                      className="grid grid-cols-1 sm:grid-cols-4 gap-4 cursor-pointer"
                      onClick={() => onOpenSpotModal(item.spot)}
                    >
                      <div className="sm:col-span-1 h-32 rounded-xl overflow-hidden bg-stone-200 relative">
                        <img
                          src={item.spot.imageUrl}
                          alt={item.spot.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-900/80 text-amber-300 backdrop-blur-sm">
                          ★ {item.spot.rating}
                        </span>
                      </div>

                      <div className="sm:col-span-3 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                              {CATEGORY_LABELS[item.spot.category]?.name || 'Lieu secret'}
                            </span>
                            <span className="text-stone-400 text-[11px]">
                              Durée: ~{item.spot.estimatedDurationMinutes} min
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-stone-900 text-lg group-hover:text-amber-700 transition-colors">
                            {item.spot.title}
                          </h3>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[11px] text-stone-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                              {item.spot.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                              {item.spot.bestTimeToVisit}
                            </span>
                            {!item.transportMode && (
                              <span className="flex items-center gap-1 text-stone-400">
                                Déplacement à définir
                              </span>
                            )}
                          </div>

                          <p className="text-stone-600 text-xs line-clamp-2 mt-1">
                            {item.spot.description}
                          </p>
                        </div>

                        {/* Secret Access Hint */}
                        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                          <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Astuce Secrète: </span>
                            {item.spot.secretAccessHint}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Transition route line between consecutive spots */}
                  {nextItem && distKm !== null && travelMin !== null && (
                    <div className="flex items-center justify-center my-2 text-xs text-stone-400 font-medium">
                      <div className="flex items-center gap-2 bg-stone-100 px-4 py-1.5 rounded-full border border-stone-200">
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                        <span>Trajet estimé: ~{distKm} km — ~{travelMin} min</span>
                        <span
                          className="flex items-center gap-1 text-cyan-700 font-semibold"
                          title={`Coût: ${travelTransport.costHint}`}
                        >
                          {(() => {
                            const TI = TRANSPORT_ICONS[travelTransport.icon] || Navigation;
                            return <TI className="w-3 h-3" />;
                          })()}
                          {travelTransport.label}
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

      </div>

      {/* Ticket Modal */}
      {showTicket && (
        <TripTicket calendar={calendar} onClose={() => setShowTicket(false)} />
      )}
    </div>
  );
};
