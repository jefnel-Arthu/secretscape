import React from 'react';
import { UserTripCalendar } from '../types';
import { FlightTicketData, DayCalendar, ScheduleItem } from './FlightTicketTypes';
import { FlightTicketCalendar } from './FlightTicketCalendar';
import { CATEGORY_LABELS } from '../data/hiddenSpots';
import { X } from 'lucide-react';

interface TripTicketProps {
  calendar: UserTripCalendar;
  onClose: () => void;
}

const TIME_SLOT_LABELS: Record<string, string> = {
  morning: 'Matinée',
  noon: 'Midi',
  afternoon: 'Après-midi',
  sunset: 'Coucher de soleil',
  evening: 'Soirée',
};

function mapCalendarToTicketData(calendar: UserTripCalendar): FlightTicketData {
  const firstDate = calendar.days[0]?.dateString;
  const lastDate = calendar.days[calendar.days.length - 1]?.dateString;

  const ticketCode = firstDate
    ? `BST${new Date(firstDate).getTime().toString(36).slice(-5).toUpperCase()}`
    : 'BST00001';

  const days: DayCalendar[] = calendar.days.map((day) => ({
    dayNumber: day.dayNumber,
    title: day.title || `Jour ${day.dayNumber}`,
    dateString: day.dateString
      ? new Date(day.dateString).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
      : undefined,
    items: day.items.map(
      (item): ScheduleItem => ({
        id: item.id,
        timeString: item.arrivalTime || item.timeString || '09:00',
        slotLabel: TIME_SLOT_LABELS[item.timeSlot] || item.timeSlot,
        title: item.spot.title,
        subtitle: CATEGORY_LABELS[item.spot.category]?.name || item.spot.category,
        location: item.spot.city,
        accessHint: item.spot.secretAccessHint,
        durationMinutes: item.spot.estimatedDurationMinutes,
        isCompleted: false,
      })
    ),
  }));

  return {
    airlineName: 'SECRETSCAPE',
    flightNumber: ticketCode,
    passengerName: 'VOYAGEUR',
    originCode: 'BJI',
    originName: 'Bénin International',
    destCode: calendar.destinationCity.slice(0, 3).toUpperCase(),
    destName: calendar.destinationCity,
    seat: 'A1',
    gate: '1',
    boardingZone: '1',
    flightClass: 'BUSINESS',
    days,
  };
}

export const TripTicket: React.FC<TripTicketProps> = ({ calendar, onClose }) => {
  const ticketData = React.useMemo(() => mapCalendarToTicketData(calendar), [calendar]);

  return (
    <div className="fixed inset-0 z-[700] bg-black/70 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
      <div className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end mb-2">
          <button
            onClick={onClose}
            className="bg-stone-800 hover:bg-stone-700 text-stone-300 p-2 rounded-xl transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <FlightTicketCalendar initialData={ticketData} />
      </div>
    </div>
  );
};
