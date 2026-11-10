import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, CalendarDays, X } from 'lucide-react';
import { AgendaEvent } from '../data/agendaEvents';

interface EventRevealModalProps {
  open: boolean;
  events: AgendaEvent[];
  periodLabel: string;
  isFallback?: boolean;
  onClose: () => void;
  onNavigateToAgenda: () => void;
}

const overlayGradient =
  'linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,.35) 55%, rgba(0,0,0,.05) 100%)';

const EventDate: React.FC<{ event: AgendaEvent; compact?: boolean }> = ({ event, compact }) => (
  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
    {event.dayRange && (
      <span
        className="font-extrabold leading-none"
        style={{
          color: '#FFD600',
          fontSize: compact ? 'clamp(1.15rem, 2.2vw, 22px)' : 'clamp(1.7rem, 3vw, 34px)',
        }}
      >
        {event.dayRange}
      </span>
    )}
    <span
      className="uppercase"
      style={{
        color: '#FFFFFF',
        fontSize: compact ? 11 : 'clamp(0.75rem, 1.2vw, 13px)',
        letterSpacing: '0.12em',
        fontWeight: 500,
      }}
    >
      {event.monthYear}
    </span>
  </div>
);

export const EventRevealModal: React.FC<EventRevealModalProps> = ({
  open,
  events,
  periodLabel,
  isFallback,
  onClose,
  onNavigateToAgenda,
}) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  if (!open) return null;

  const featured = events[0];
  const others = events.slice(1);

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-reveal-title"
        className="animate-in zoom-in-95 relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#111111] text-white shadow-2xl shadow-black/60"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600]/70"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9">
          <div className="mb-5 flex items-start gap-3 pr-10">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFD600]/15 text-2xl">
              🎁
            </span>
            <div>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: '#FFD600' }}
              >
                Cadeau SecretScape
              </span>
              <h2
                id="gift-reveal-title"
                className="mt-1 text-xl font-bold leading-tight sm:text-3xl"
                style={{ color: '#F3EEE8' }}
              >
                {isFallback ? 'Les prochains rendez-vous' : 'Les événements de la période'}
              </h2>
              <p className="mt-1 text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,.6)' }}>
                {periodLabel}
              </p>
            </div>
          </div>

          {!featured ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-white/30" />
              <p className="mt-4 text-sm font-medium text-white/80">
                Aucun événement daté dans les prochaines semaines.
              </p>
              <p className="mt-1 text-xs text-white/50">
                Consultez l&apos;agenda pour découvrir toute la saison culturelle.
              </p>
            </div>
          ) : (
            <>
              {/* Événement principal */}
              {(() => {
                const FeaturedTag = (featured.url ? 'a' : 'div') as 'a' | 'div';
                return (
                  <FeaturedTag
                    {...(featured.url
                      ? { href: featured.url, target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className={`group relative block overflow-hidden rounded-3xl ${featured.url ? 'cursor-pointer' : ''}`}
                  >
                    <div className="relative h-64 sm:h-80">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0" style={{ background: overlayGradient }} />
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                        <EventDate event={featured} />
                        <h3 className="mt-1.5 text-2xl font-bold leading-tight text-white sm:text-4xl">
                          {featured.title}
                        </h3>
                        {featured.description && (
                          <p
                            className="mt-2 max-w-2xl text-sm leading-relaxed sm:text-base"
                            style={{ color: 'rgba(255,255,255,.9)' }}
                          >
                            {featured.description}
                          </p>
                        )}
                        {featured.url && (
                          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-[#FFD600] group-hover:text-stone-950">
                            En savoir plus
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </FeaturedTag>
                );
              })()}

              {/* Autres événements de la période */}
              {others.length > 0 && (
                <div className="mt-4 space-y-3">
                  {others.map((event) => {
                    const RowTag = (event.url ? 'a' : 'div') as 'a' | 'div';
                    return (
                      <RowTag
                        key={event.id}
                        {...(event.url
                          ? { href: event.url, target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition-colors sm:gap-4 ${event.url ? 'cursor-pointer hover:bg-white/[0.09]' : ''}`}
                      >
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <EventDate event={event} compact />
                          <h4 className="mt-0.5 truncate text-sm font-semibold text-white sm:text-base">
                            {event.title}
                          </h4>
                        </div>
                        {event.url && (
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
                        )}
                      </RowTag>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={onNavigateToAgenda}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-[#FFE14D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600]/70"
            >
              <CalendarDays className="h-4 w-4" />
              Voir tout l&apos;agenda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
