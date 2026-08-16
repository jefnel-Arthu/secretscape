import { UserTripCalendar } from '../types';
import { getTransportLabel } from './transport';

const icsSafe = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

const pad = (n: number) => String(n).padStart(2, '0');
const fmtICSDate = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const fmtICSDateTime = (d: Date) => `${fmtICSDate(d)}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

export const buildICS = (calendar: UserTripCalendar): string => {
  const parsedStart = new Date(`${calendar.startDate}T12:00:00`);
  const baseDate = Number.isNaN(parsedStart.getTime()) ? new Date() : parsedStart;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SecretScape//Itinéraire Lieux Cachés//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `DTSTAMP:${fmtICSDateTime(new Date())}`,
  ];

  calendar.days.forEach((day) => {
    let dayDate: Date;
    if (day.dateString) {
      const parsed = new Date(`${day.dateString}T12:00:00`);
      dayDate = Number.isNaN(parsed.getTime()) ? new Date(baseDate) : parsed;
    } else {
      dayDate = new Date(baseDate);
      dayDate.setDate(baseDate.getDate() + (day.dayNumber - 1));
    }
    dayDate.setHours(0, 0, 0, 0);

    day.items.forEach((item, i) => {
      const [rawH, rawM] = (item.arrivalTime || item.timeString || '10:00').split(':').map(Number);
      const start = new Date(dayDate);
      start.setHours(Number.isNaN(rawH) ? 9 : rawH, Number.isNaN(rawM) ? 0 : rawM, 0, 0);

      let end: Date;
      if (item.departureTime) {
        const [endH, endM] = item.departureTime.split(':').map(Number);
        end = new Date(start);
        end.setHours(Number.isNaN(endH) ? 9 : endH, Number.isNaN(endM) ? 0 : endM, 0, 0);
        if (end.getTime() <= start.getTime()) {
          end = new Date(start.getTime() + 60 * 60000);
        }
      } else {
        const duration = item.spot.estimatedDurationMinutes || 45;
        end = new Date(start.getTime() + duration * 60000);
      }

      const title = `${item.spot.title} (SecretScape)`;
      const description =
        `${item.spot.subtitle}\n\nAstuce Secrète: ${item.spot.secretAccessHint}\n\n` +
        `Adresse: ${item.spot.address}\n` +
        `Meilleur moment: ${item.spot.bestTimeToVisit}\n` +
        `Durée sur place: ~${item.spot.estimatedDurationMinutes} min\n` +
        `Moyen de déplacement: ${getTransportLabel(item.transportMode)}`;
      const location = item.spot.address;
      const uid = `${item.id || `item-${day.dayNumber}-${i}`}@secretscape.app`;

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${icsSafe(uid)}`);
      lines.push(`DTSTAMP:${fmtICSDateTime(new Date())}`);
      lines.push(`DTSTART:${fmtICSDateTime(start)}`);
      lines.push(`DTEND:${fmtICSDateTime(end)}`);
      lines.push(`SUMMARY:${icsSafe(title)}`);
      lines.push(`DESCRIPTION:${icsSafe(description)}`);
      lines.push(`LOCATION:${icsSafe(location)}`);
      lines.push('END:VEVENT');
    });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
};
