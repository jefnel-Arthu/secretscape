import { describe, expect, it } from 'vitest';
import { buildICS } from './ical';
import { HiddenSpot, UserTripCalendar } from '../types';

const spot: HiddenSpot = {
  id: 'spot-test',
  title: 'Lieu, Secret; de Test',
  subtitle: 'Sous-titre',
  category: 'sites',
  city: 'Paris',
  region: 'Île-de-France',
  coordinates: { lat: 48.8566, lng: 2.3522 },
  address: '12 Rue, Saint-Antoine',
  secretLevel: 'moyen',
  description: 'Description du lieu',
  secretAccessHint: 'Poussez la porte',
  bestTimeToVisit: 'Le matin',
  estimatedDurationMinutes: 45,
  imageUrl: 'https://example.com/photo.jpg',
  tags: ['Secret'],
  rating: 4.8,
  reviewCount: 10,
  crowdLevel: 'faible',
};

const calendar: UserTripCalendar = {
  title: 'Mon Escapade',
  destinationCity: 'Paris',
  startDate: '2026-08-12',
  days: [
    {
      dayNumber: 1,
      title: 'Jour 1',
      items: [
        {
          id: 'item-1',
          spotId: spot.id,
          spot,
          timeSlot: 'morning',
          timeString: '09:30',
        },
      ],
    },
    {
      dayNumber: 2,
      title: 'Jour 2',
      items: [
        {
          id: 'item-2',
          spotId: spot.id,
          spot,
          timeSlot: 'afternoon',
          timeString: '15:00',
        },
      ],
    },
  ],
};

describe('buildICS', () => {
  it('produces a valid VCALENDAR envelope', () => {
    const ics = buildICS(calendar);
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR')).toBe(true);
    expect(ics).toContain('VERSION:2.0');
  });

  it('generates one VEVENT per scheduled item with DTSTART/DTEND/UID', () => {
    const ics = buildICS(calendar);
    const events = ics.split('BEGIN:VEVENT').length - 1;
    expect(events).toBe(2);
    expect(ics).toContain('UID:item-1@secretscape.app');
    expect(ics).toContain('UID:item-2@secretscape.app');
    expect(ics).toContain('DTSTART:20260812T093000');
    expect(ics).toContain('DTEND:20260812T101500');
    expect(ics).toContain('DTSTART:20260813T150000');
  });

  it('escapes commas, semicolons and newlines in text values', () => {
    const ics = buildICS(calendar);
    expect(ics).toContain('Lieu\\, Secret\\; de Test (SecretScape)');
    expect(ics).toContain('12 Rue\\, Saint-Antoine');
  });

  it('uses default hour 9 and duration 45 when fields are missing', () => {
    const fallbackCalendar: UserTripCalendar = {
      ...calendar,
      startDate: '',
      days: [
        {
          dayNumber: 1,
          title: 'Jour 1',
          items: [
            {
              id: 'item-x',
              spotId: spot.id,
              spot: { ...spot, estimatedDurationMinutes: 0 },
              timeSlot: 'morning',
              timeString: '10:00',
            },
          ],
        },
      ],
    };
    const ics = buildICS(fallbackCalendar);
    expect(ics).toContain('DTSTART:');
    expect(ics).toContain('DTEND:');
  });

  it('uses the day date and the editable arrival/departure times when provided', () => {
    const editedCalendar: UserTripCalendar = {
      ...calendar,
      startDate: '2026-08-12',
      days: [
        {
          dayNumber: 1,
          dateString: '2026-08-20',
          title: 'Jour 1',
          items: [
            {
              id: 'item-edited',
              spotId: spot.id,
              spot,
              timeSlot: 'morning',
              timeString: '09:00',
              arrivalTime: '08:30',
              departureTime: '10:45',
            },
          ],
        },
      ],
    };
    const ics = buildICS(editedCalendar);
    expect(ics).toContain('DTSTART:20260820T083000');
    expect(ics).toContain('DTEND:20260820T104500');
  });

  it('includes the transport mode and address in the description', () => {
    const transportCalendar: UserTripCalendar = {
      ...calendar,
      days: [
        {
          dayNumber: 1,
          title: 'Jour 1',
          items: [
            {
              id: 'item-transport',
              spotId: spot.id,
              spot,
              timeSlot: 'morning',
              timeString: '09:30',
              transportMode: 'gozem',
            },
          ],
        },
      ],
    };
    const ics = buildICS(transportCalendar);
    expect(ics).toContain('Moyen de déplacement: Zémidjan (taxi-moto)');
    expect(ics).toContain('Adresse: 12 Rue\\, Saint-Antoine');
    expect(ics).toContain('Meilleur moment: Le matin');
  });
});
