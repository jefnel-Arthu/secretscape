export interface ScheduleItem {
  id: string;
  timeString: string;
  slotLabel?: string;
  title: string;
  subtitle?: string;
  location: string;
  accessHint?: string;
  durationMinutes?: number;
  isCompleted?: boolean;
}

export interface DayCalendar {
  dayNumber: number;
  title: string;
  dateString?: string;
  items: ScheduleItem[];
}

export interface FlightTicketData {
  airlineName: string;
  flightNumber: string;
  passengerName: string;
  originCode: string;
  originName: string;
  destCode: string;
  destName: string;
  seat: string;
  gate: string;
  boardingZone: string;
  flightClass: 'FIRST' | 'BUSINESS' | 'ECONOMY';
  days: DayCalendar[];
}
