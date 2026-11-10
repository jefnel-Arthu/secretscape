import { AgendaEvent } from '../data/agendaEvents';

/** Fenêtre par défaut : événements en cours ou à venir dans les 60 prochains jours. */
export const DEFAULT_PERIOD_WINDOW_DAYS = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

function endOfDay(iso: string): Date {
  return new Date(`${iso}T23:59:59.999`);
}

function sortByStart(a: AgendaEvent, b: AgendaEvent): number {
  return startOfDay(a.startDate as string).getTime() - startOfDay(b.startDate as string).getTime();
}

/**
 * Événements en cours ou à venir dans la fenêtre donnée.
 * Les événements sans date exacte sont ignorés.
 */
export function getEventsForPeriod(
  events: AgendaEvent[],
  now: Date = new Date(),
  windowDays: number = DEFAULT_PERIOD_WINDOW_DAYS
): AgendaEvent[] {
  const windowEnd = new Date(now.getTime() + windowDays * DAY_MS);

  return events
    .filter((event) => {
      if (!event.startDate) return false;
      const start = startOfDay(event.startDate);
      const end = event.endDate ? endOfDay(event.endDate) : endOfDay(event.startDate);
      return end >= now && start <= windowEnd;
    })
    .sort(sortByStart);
}

/** Prochains événements datés (en cours ou futurs), triés chronologiquement. */
export function getUpcomingEvents(
  events: AgendaEvent[],
  now: Date = new Date(),
  limit = 3
): AgendaEvent[] {
  return events
    .filter((event) => {
      if (!event.startDate) return false;
      const end = event.endDate ? endOfDay(event.endDate) : endOfDay(event.startDate);
      return end >= now;
    })
    .sort(sortByStart)
    .slice(0, limit);
}

/**
 * Sélection affichée par le cadeau :
 * - les événements de la période s'il y en a,
 * - sinon les prochains événements à venir (fallback).
 */
export function getRevealEvents(
  events: AgendaEvent[],
  now: Date = new Date(),
  windowDays: number = DEFAULT_PERIOD_WINDOW_DAYS
): { events: AgendaEvent[]; isFallback: boolean } {
  const periodEvents = getEventsForPeriod(events, now, windowDays);
  if (periodEvents.length > 0) {
    return { events: periodEvents, isFallback: false };
  }
  return { events: getUpcomingEvents(events, now, 3), isFallback: true };
}

/** Ex. « 6 novembre 2026 ». */
export function formatFrDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Ex. « Du 6 novembre 2026 au 5 janvier 2027 ». */
export function formatPeriodRange(now: Date, windowDays: number = DEFAULT_PERIOD_WINDOW_DAYS): string {
  const end = new Date(now.getTime() + windowDays * DAY_MS);
  return `Du ${formatFrDate(now)} au ${formatFrDate(end)}`;
}
