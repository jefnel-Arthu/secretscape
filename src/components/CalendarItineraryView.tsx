import React, { useState } from 'react';
import { UserTripCalendar, CalendarDayPlan, ItinerarySlotItem, TimeSlot, HiddenSpot, TransportMode } from '../types';
import { CATEGORY_LABELS, INITIAL_HIDDEN_SPOTS } from '../data/hiddenSpots';
import { calculateDistanceKm } from '../lib/geo';
import { TRANSPORT_OPTIONS, getTransportOption, estimateTravelMinutes } from '../lib/transport';
import { TripTicket } from './TripTicket';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Printer, 
  Share2, 
  Compass, 
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
}

const editFieldClass =
  'w-full rounded-lg border-[1.5px] border-[#E7E2D8] bg-white px-2 py-1.5 text-xs text-[#0b1b2b] transition-colors focus:border-[#D97706] focus:outline-none';

const editLabelClass =
  'mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#8A8578]';

const TIME_SLOT_LABELS: Record<TimeSlot, { label: string; time: string; bg: string; border: string; text: string }> = {
  morning: { label: 'Matinée', time: '09h00', bg: 'bg-[#FDF3E3]', border: 'border-[#F0D9AE]', text: 'text-[#B45309]' },
  noon: { label: 'Midi & Déjeuner', time: '12h30', bg: 'bg-[#FBF0DC]', border: 'border-[#EDD9B0]', text: 'text-[#9A6212]' },
  afternoon: { label: 'Après-midi', time: '15h00', bg: 'bg-[#EDF3EC]', border: 'border-[#D5E2D3]', text: 'text-[#3F6B4A]' },
  sunset: { label: 'Coucher de Soleil (Golden Hour)', time: '18h30', bg: 'bg-[#FBEEEA]', border: 'border-[#EFD8D0]', text: 'text-[#A2543F]' },
  evening: { label: 'Soirée & Nuit', time: '21h00', bg: 'bg-[#ECEEF5]', border: 'border-[#D6DBE8]', text: 'text-[#4A5578]' },
};

export const CalendarItineraryView: React.FC<CalendarItineraryViewProps> = ({
  calendar,
  setCalendar,
  onOpenSpotModal,
  onNavigateToMap,
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
      const removedItem = prev.days[dayIndex]?.items.find(i => i.id === itemId);
      if (removedItem) {
        fetch('/api/track/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'calendar_remove', detail: `Retiré du planning: ${removedItem.spot.title}`, spotId: removedItem.spotId }),
        }).catch(() => {});
      }
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

  const totalDistanceKm = calendar.days.reduce(
    (acc, day) =>
      acc +
      day.items.reduce((sum, item, idx) => {
        const next = day.items[idx + 1];
        if (!next) return sum;
        return (
          sum +
          calculateDistanceKm(
            item.spot.coordinates.lat,
            item.spot.coordinates.lng,
            next.spot.coordinates.lat,
            next.spot.coordinates.lng
          )
        );
      }, 0),
    0
  );

  // All spots grouped by category for the "endroit" selector
  const groupedSpots = INITIAL_HIDDEN_SPOTS.reduce<Record<string, HiddenSpot[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Calendar Header Card */}
      <div className="relative overflow-hidden rounded-[28px] border-t-[3px] border-[#D97706] bg-[#0b1b2b] text-white shadow-[0_18px_44px_rgba(11,27,43,0.18)]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#D97706]/15 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F59E0B]">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendrier & Carnet d'Escapade</span>
                <span className="text-white/25">•</span>
                <span className="text-[#9FB0C0]">{calendar.destinationCity}</span>
              </div>

              {/* Editable Title */}
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="font-editorial rounded-xl border border-[#D97706]/50 bg-white/10 px-3 py-1.5 text-2xl font-medium text-[#F59E0B] focus:border-[#D97706] focus:outline-none"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="rounded-xl bg-[#D97706] p-2 text-white transition-colors hover:bg-[#B45309]"
                    title="Enregistrer le titre"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="group flex cursor-pointer items-center gap-2" onClick={() => setIsEditingTitle(true)}>
                  <h1 className="font-editorial text-[26px] font-medium leading-tight tracking-tight text-white sm:text-[32px]">
                    {calendar.title}
                  </h1>
                  <Edit2 className="w-4 h-4 shrink-0 text-[#9FB0C0] opacity-0 transition-all group-hover:text-[#F59E0B] group-hover:opacity-100" />
                </div>
              )}

              <p className="max-w-2xl text-xs leading-relaxed text-[#9FB0C0] sm:text-[13px]">
                Organisez vos étapes par créneau horaire, optimisez vos déplacements secrets et exportez votre planning sur votre agenda personnel.
              </p>
            </div>

            {/* Export & Action Buttons */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                onClick={() => setShowTicket(true)}
                disabled={totalSpotsScheduled === 0}
                className="flex items-center gap-2 rounded-full bg-[#D97706] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(217,119,6,0.3)] transition-all hover:bg-[#B45309] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                title="Télécharger mon billet de voyage"
              >
                <Ticket className="w-4 h-4" />
                <span>Mon billet</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-[#E8E4DA] transition-colors hover:border-white/30 hover:bg-white/10"
                title="Imprimer ou enregistrer en PDF"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Imprimer</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-[#E8E4DA] transition-colors hover:border-white/30 hover:bg-white/10"
                title="Copier le lien"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? 'Copié !' : 'Partager'}</span>
              </button>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-4">
            <div>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9FB0C0]">Lieux au programme</span>
              <span className="font-editorial text-[19px] font-medium text-[#F59E0B]">{totalSpotsScheduled} pépites</span>
            </div>
            <div className="hidden h-7 w-px bg-white/10 sm:block" />
            <div>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9FB0C0]">Nombre de jours</span>
              <span className="font-editorial text-[19px] font-medium text-white">{calendar.days.length} jour(s)</span>
            </div>
            {totalSpotsScheduled > 1 && (
              <>
                <div className="hidden h-7 w-px bg-white/10 sm:block" />
                <div>
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9FB0C0]">Distance estimée</span>
                  <span className="font-editorial text-[19px] font-medium text-white">~{Math.round(totalDistanceKm)} km</span>
                </div>
              </>
            )}
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
                aria-current={isActive ? 'true' : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl border-[1.5px] px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'border-[#0b1b2b] bg-[#0b1b2b] text-white shadow-[0_8px_20px_rgba(11,27,43,0.18)]'
                    : 'border-[#E7E2D8] bg-white text-[#8A8578] hover:border-[#D9C7A6] hover:text-[#0b1b2b]'
                }`}
              >
                <span
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10.5px] font-bold ${
                    isActive ? 'bg-[#D97706] text-white' : 'bg-[#F6F4EF] text-[#8A8578]'
                  }`}
                >
                  {day.dayNumber}
                </span>
                <span>Jour {day.dayNumber}</span>
                {day.items.length > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    isActive ? 'bg-[#FDF3E3] text-[#B45309]' : 'bg-[#F6F4EF] text-[#8A8578]'
                  }`}>
                    {day.items.length}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={handleAddDay}
            className="flex items-center gap-1 whitespace-nowrap rounded-xl border-[1.5px] border-dashed border-[#D9C7A6] px-3 py-2 text-xs font-semibold text-[#8A8578] transition-colors hover:border-[#D97706] hover:text-[#B45309]"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un jour</span>
          </button>
        </div>

        {calendar.days.length > 1 && (
          <button
            onClick={() => handleRemoveDay(selectedDayIndex)}
            className="flex shrink-0 items-center gap-1 px-2 py-1 text-xs font-medium text-[#B4AEA1] transition-colors hover:text-rose-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer le jour {currentDay.dayNumber}</span>
          </button>
        )}
      </div>

      {/* Main Day Timeline Schedule */}
      <div className="space-y-6 rounded-[28px] border border-[#E7E2D8] bg-white p-5 shadow-[0_18px_44px_rgba(11,27,43,0.06)] sm:p-7">
        <div className="flex flex-col gap-4 border-b border-[#E7E2D8] pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-editorial text-[22px] font-medium leading-tight text-[#0b1b2b] sm:text-[26px]">
              {currentDay.title || `Jour ${currentDay.dayNumber}`}
            </h2>
            <p className="mt-1 text-xs text-[#8A8578]">
              Glissez et planifiez vos visites aux meilleurs moments d'affluence.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-[#D97706]" />
              <input
                type="date"
                value={currentDay.dateString || ''}
                onChange={(e) => handleDayDateChange(e.target.value)}
                className="rounded-lg border-[1.5px] border-[#E7E2D8] bg-[#FAF8F3] px-2 py-1 text-xs text-[#0b1b2b] focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/15"
                title="Modifier la date de cette journée"
              />
              <span className="text-[11px] text-[#B4AEA1]">Date de la journée</span>
            </div>
          </div>

          <button
            onClick={onNavigateToMap}
            className="flex shrink-0 items-center gap-1.5 self-start rounded-full border-[1.5px] border-[#F0D9AE] bg-[#FDF3E3] px-4 py-2 text-xs font-semibold text-[#B45309] transition-colors hover:border-[#D97706] hover:bg-[#FAE8CC]"
          >
            <Compass className="w-4 h-4" />
            <span>Explorer la carte pour ajouter</span>
          </button>
        </div>

        {/* Empty State */}
        {currentDay.items.length === 0 ? (
          <div className="space-y-4 rounded-2xl border-[1.5px] border-dashed border-[#D9C7A6] bg-[#FAF8F3] px-4 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDF3E3] text-[#D97706] shadow-[0_0_0_5px_#ffffff]">
              <CalendarIcon className="w-8 h-8 stroke-[1.8]" />
            </div>
            <div className="mx-auto max-w-md space-y-1">
              <h3 className="font-editorial text-xl font-medium text-[#0b1b2b]">
                Votre journée est libre !
              </h3>
              <p className="text-xs leading-relaxed text-[#8A8578]">
                Naviguez sur la carte des lieux secrets ou laissez l'IA créer automatiquement un itinéraire équilibré pour ce jour.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onNavigateToMap}
                className="flex items-center gap-1.5 rounded-full bg-[#D97706] px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(217,119,6,0.25)] transition-colors hover:bg-[#B45309]"
              >
                <Compass className="w-4 h-4" />
                <span>Découvrir la carte</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="escapade-timeline relative">
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
                  <div className="relative pb-3 pl-10">
                    <span className="escapade-node" aria-hidden="true" />
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
                      className={`group relative cursor-grab space-y-3.5 rounded-2xl border bg-white p-3.5 transition-all active:cursor-grabbing sm:p-4 ${
                        dragIndex === itemIdx
                          ? 'border-[#D97706] bg-[#FDF3E3] opacity-60'
                          : dragOverIndex === itemIdx && dragIndex !== null
                            ? 'border-[#D97706] ring-2 ring-[#FDF3E3]'
                            : 'border-[#E7E2D8] hover:border-[#D9C7A6] hover:shadow-[0_10px_28px_rgba(11,27,43,0.08)]'
                      }`}
                    >
                      {/* Item Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1EDE4] pb-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[#D9C7A6] transition-colors hover:text-[#D97706]" title="Glisser pour réordonner">
                            <GripVertical className="w-4 h-4" />
                          </span>
                          <span className={`rounded-md border px-2 py-0.5 text-[10.5px] font-semibold ${slotInfo.bg} ${slotInfo.border} ${slotInfo.text}`}>
                            {slotInfo.label} • {item.arrivalTime || item.timeString || slotInfo.time}
                            {item.departureTime ? ` → ${item.departureTime}` : ''}
                          </span>
                          <span className="flex items-center gap-1 rounded-md border border-[#E7E2D8] bg-[#F6F4EF] px-2 py-0.5 text-[10.5px] font-medium text-[#8A8578]">
                            <MapPin className="w-3 h-3 text-[#D97706]" />
                            {item.spot.city}
                          </span>
                          {item.transportMode && (
                            <span
                              className="flex items-center gap-1 rounded-md border border-[#E7E2D8] bg-[#F6F4EF] px-2 py-0.5 text-[10.5px] font-semibold text-[#0b1b2b]"
                              title={`Déplacement: ${itemTransport.label} — ${itemTransport.costHint}`}
                            >
                              <TransportIcon className="w-3 h-3 text-[#D97706]" />
                              {itemTransport.label}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {editingItemId !== item.id && (
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="rounded-lg p-1 text-[#B4AEA1] transition-colors hover:bg-[#FDF3E3] hover:text-[#D97706]"
                              title="Modifier l'étape (lieu, heure, arrivée, départ)"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveItem(selectedDayIndex, item.id)}
                            className="rounded-lg p-1 text-[#B4AEA1] transition-colors hover:bg-rose-50 hover:text-rose-600"
                            title="Retirer du calendrier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Edit Panel */}
                      {editingItemId === item.id && draft && (
                        <div className="grid grid-cols-1 gap-3 rounded-xl border-[1.5px] border-[#F0D9AE] bg-[#FAF8F3] p-3 sm:grid-cols-2 lg:grid-cols-5">
                          <label className="block sm:col-span-2 lg:col-span-1">
                            <span className={editLabelClass}>Endroit</span>
                            <select
                              value={draft.spotId}
                              onChange={(e) => setDraft({ ...draft, spotId: e.target.value })}
                              className={editFieldClass}
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
                            <span className={editLabelClass}>Créneau</span>
                            <select
                              value={draft.timeSlot}
                              onChange={(e) => setDraft({ ...draft, timeSlot: e.target.value as TimeSlot })}
                              className={editFieldClass}
                            >
                              {(Object.keys(TIME_SLOT_LABELS) as TimeSlot[]).map((slot) => (
                                <option key={slot} value={slot}>
                                  {TIME_SLOT_LABELS[slot].label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="block">
                            <span className={editLabelClass}>Heure</span>
                            <input
                              type="time"
                              value={draft.timeString}
                              onChange={(e) => setDraft({ ...draft, timeString: e.target.value })}
                              className={editFieldClass}
                            />
                          </label>

                          <label className="block">
                            <span className={editLabelClass}>Arrivée (début)</span>
                            <input
                              type="time"
                              value={draft.arrivalTime}
                              onChange={(e) => setDraft({ ...draft, arrivalTime: e.target.value })}
                              className={editFieldClass}
                            />
                          </label>

                          <label className="block">
                            <span className={editLabelClass}>Départ (fin)</span>
                            <input
                              type="time"
                              value={draft.departureTime}
                              onChange={(e) => setDraft({ ...draft, departureTime: e.target.value })}
                              className={editFieldClass}
                            />
                          </label>

                          <label className="block sm:col-span-2 lg:col-span-1">
                            <span className={editLabelClass}>
                              Déplacement (pour y aller)
                            </span>
                            <select
                              value={draft.transportMode}
                              onChange={(e) => setDraft({ ...draft, transportMode: e.target.value as TransportMode | '' })}
                              className={editFieldClass}
                            >
                              <option value="">À définir (défaut: à pied)</option>
                              {TRANSPORT_OPTIONS.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.label} — {t.costHint}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="flex items-center justify-end gap-2 pt-1 sm:col-span-2 lg:col-span-5">
                            <button
                              onClick={handleCancelEdit}
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#8A8578] transition-colors hover:text-[#0b1b2b]"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleSaveItem(selectedDayIndex, item.id)}
                              className="flex items-center gap-1.5 rounded-full bg-[#D97706] px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#B45309]"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Main Item Content Grid */}
                      <div
                        className="grid cursor-pointer grid-cols-1 gap-3.5 sm:grid-cols-[140px_minmax(0,1fr)]"
                        onClick={() => onOpenSpotModal(item.spot)}
                      >
                        <div className="relative h-32 overflow-hidden rounded-xl bg-[#E7E2D8] sm:h-[104px]">
                          <img
                            src={item.spot.imageUrl}
                            alt={item.spot.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-2 left-2 rounded-md bg-[#0b1b2b]/85 px-2 py-0.5 text-[10px] font-bold text-[#F59E0B] backdrop-blur-sm">
                            ★ {item.spot.rating}
                          </span>
                        </div>

                        <div className="flex flex-col justify-between space-y-2">
                          <div>
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-[#FDF3E3] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#B45309]">
                                {CATEGORY_LABELS[item.spot.category]?.name || 'Lieu secret'}
                              </span>
                              <span className="text-[11px] text-[#B4AEA1]">
                                Durée: ~{item.spot.estimatedDurationMinutes} min
                              </span>
                            </div>

                            <h3 className="font-editorial text-[18px] font-medium leading-snug text-[#0b1b2b] transition-colors group-hover:text-[#B45309]">
                              {item.spot.title}
                            </h3>

                            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#8A8578]">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 shrink-0 text-[#D97706]" />
                                {item.spot.address}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 shrink-0 text-[#D97706]" />
                                {item.spot.bestTimeToVisit}
                              </span>
                              {!item.transportMode && (
                                <span className="flex items-center gap-1 text-[#B4AEA1]">
                                  Déplacement à définir
                                </span>
                              )}
                            </div>

                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6E685C]">
                              {item.spot.description}
                            </p>
                          </div>

                          {/* Secret Access Hint */}
                          <div className="flex items-start gap-2 rounded-r-lg border-l-[3px] border-[#F59E0B] bg-[#FDF3E3] py-2 pl-2.5 pr-3 text-[11px] leading-relaxed text-[#7A4A08]">
                            <Compass className="mt-0.5 w-3.5 h-3.5 shrink-0 text-[#D97706]" />
                            <div>
                              <span className="font-bold">Astuce Secrète: </span>
                              {item.spot.secretAccessHint}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Transition route line between consecutive spots */}
                  {nextItem && distKm !== null && travelMin !== null && (
                    <div className="mb-3 ml-10 flex items-center gap-2 text-[11px] font-medium text-[#8A8578]">
                      <span className="h-px w-5 bg-[#E7E2D8]" aria-hidden="true" />
                      <ArrowRight className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Trajet estimé: ~{distKm} km — ~{travelMin} min</span>
                      <span
                        className="flex items-center gap-1 font-semibold text-[#0b1b2b]"
                        title={`Coût: ${travelTransport.costHint}`}
                      >
                        {(() => {
                          const TI = TRANSPORT_ICONS[travelTransport.icon] || Navigation;
                          return <TI className="w-3 h-3 text-[#D97706]" />;
                        })()}
                        {travelTransport.label}
                      </span>
                      <span className="hidden h-px flex-1 bg-[#E7E2D8] sm:block" aria-hidden="true" />
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
