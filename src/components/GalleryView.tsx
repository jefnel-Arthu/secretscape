import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AGENDA_EVENTS } from '../data/agendaEvents';

const overlayStyle: React.CSSProperties = {
  background:
    'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.25) 45%, rgba(0,0,0,0) 100%)',
};

/** Photo Vodun Days (celle de la carte événement), voilée en bleu nuit. */
const AGENDA_BACKGROUND = '/images/vodun-days-2026.jpg';

export const GalleryView: React.FC = () => {
  const featured = AGENDA_EVENTS[0];
  const rest = AGENDA_EVENTS.slice(1);

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#0b1b2b]">
      {/* Fond photo pleine page + voile bleu nuit */}
      <div className="agenda-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,20,32,.90) 0%, rgba(8,20,32,.74) 42%, rgba(8,20,32,.92) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(120% 75% at 50% 0%, rgba(217,164,65,.12) 0%, rgba(217,164,65,0) 62%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        {/* Header */}
        <div className="mb-8 grid grid-cols-1 items-end gap-6 lg:mb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
          <div className="ag-head">
            <p className="ag-kicker">
              <span className="ag-flag" aria-hidden="true">
                <i className="ag-fg" />
                <i className="ag-fy" />
                <i className="ag-fr" />
              </span>
              Saison culturelle · Bénin
            </p>
            <h2 className="ag-title font-extrabold">
              <span className="ag-line">
                <span className="ag-w ag-w1">Quand</span>{' '}
                <span className="ag-w ag-w2">le</span>{' '}
                <span className="ag-w ag-green">Bénin</span>
              </span>{' '}
              <span className="ag-line">
                <span className="ag-w ag-yellow">célèbre</span>{' '}
                <span className="ag-w ag-red">l&apos;instant</span>
              </span>
            </h2>
            <span className="ag-rule" aria-hidden="true">
              <i className="ag-rg" />
              <i className="ag-ry" />
              <i className="ag-rr" />
            </span>
          </div>
          <p
            className="max-w-[520px] lg:justify-self-end lg:text-right"
            style={{
              color: 'rgba(255,255,255,.75)',
              fontSize: 'clamp(1rem, 1.4vw, 18px)',
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            Fêtes traditionnelles, grands rendez-vous :<br className="hidden sm:block" />
            la saison culturelle du Bénin ne s&apos;arrête jamais.
          </p>
        </div>

        {/* Grid */}
        <div className="agenda-grid grid gap-5">
          {/* Featured */}
          {(() => {
            const FeaturedTag = (featured.url ? 'a' : 'article') as 'a' | 'article';
            return (
              <FeaturedTag
                {...(featured.url
                  ? { href: featured.url, target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className={`group relative block min-h-[420px] overflow-hidden sm:min-h-[520px] lg:min-h-0 ${featured.url ? 'cursor-pointer' : ''}`}
                style={{
                  borderRadius: 32,
                  gridArea: 'featured',
                }}
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={overlayStyle} />
                <div className="relative flex h-full flex-col justify-end p-6 sm:p-8 lg:p-9">
                  <div className="mb-2 flex flex-wrap items-end gap-x-4 gap-y-1">
                    <span
                      className="font-extrabold leading-none"
                      style={{ color: '#FFD600', fontSize: 'clamp(2.5rem, 4.5vw, 56px)' }}
                    >
                      {featured.dayRange}
                    </span>
                    <span
                      className="pb-1 uppercase"
                      style={{
                        color: '#FFFFFF',
                        fontSize: 'clamp(0.95rem, 1.6vw, 22px)',
                        letterSpacing: '0.14em',
                        fontWeight: 500,
                      }}
                    >
                      {featured.monthYear}
                    </span>
                  </div>
                  <h3
                    className="font-bold"
                    style={{
                      color: '#FFFFFF',
                      fontSize: 'clamp(2.4rem, 4.8vw, 60px)',
                      lineHeight: 1.02,
                    }}
                  >
                    {featured.title}
                  </h3>
                </div>
              </FeaturedTag>
            );
          })()}

          {rest.map((event) => {
            const CardTag = (event.url ? 'a' : 'article') as 'a' | 'article';
            return (
              <CardTag
                key={event.id}
                {...(event.url ? { href: event.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`group relative block min-h-[240px] overflow-hidden sm:min-h-[260px] lg:min-h-0 ${event.url ? 'cursor-pointer' : ''}`}
                style={{ borderRadius: 32 }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ ...overlayStyle, background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.28) 50%, rgba(0,0,0,.05) 100%)' }} />
                <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
                  <div className="mb-1 flex flex-wrap items-end gap-x-3 gap-y-0.5">
                    {event.dayRange && (
                      <span
                        className="font-extrabold leading-none"
                        style={{ color: '#FFD600', fontSize: 'clamp(1.8rem, 2.4vw, 34px)' }}
                      >
                        {event.dayRange}
                      </span>
                    )}
                    <span
                      className="pb-0.5 uppercase"
                      style={{
                        color: '#FFFFFF',
                        fontSize: event.dayRange ? 'clamp(0.72rem, 1vw, 13px)' : 'clamp(0.82rem, 1.1vw, 15px)',
                        letterSpacing: '0.12em',
                        fontWeight: 500,
                      }}
                    >
                      {event.monthYear}
                    </span>
                  </div>
                  <h3
                    className="font-medium"
                    style={{
                      color: '#FFFFFF',
                      fontSize: event.id === 'gaani' ? 'clamp(1.3rem, 1.8vw, 22px)' : 'clamp(1.35rem, 1.9vw, 24px)',
                      lineHeight: 1.15,
                      fontWeight: 500,
                    }}
                  >
                    {event.title}
                  </h3>
                </div>
              </CardTag>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-[#FFD600]"
          >
            Voir tous les événements
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <style>{`
        /* ---- Titre aux couleurs du drapeau du Bénin ---- */
        .ag-head { min-width: 0; }
        .ag-kicker {
          display: flex;
          align-items: center;
          gap: 11px;
          margin: 0 0 16px;
          color: rgba(243,238,232,.82);
          font-size: clamp(.68rem, 1.05vw, 12px);
          font-weight: 600;
          letter-spacing: .26em;
          text-transform: uppercase;
          text-shadow: 0 1px 3px rgba(0,0,0,.9), 0 0 10px rgba(0,0,0,.6);
          animation: agFade .6s cubic-bezier(.22,.9,.28,1) both;
        }
        .ag-flag {
          position: relative;
          display: block;
          flex: 0 0 auto;
          width: 34px;
          height: 23px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255,255,255,.22), 0 7px 20px -7px rgba(0,0,0,.9);
        }
        .ag-flag i { position: absolute; display: block; }
        .ag-fg { left: 0; top: 0; bottom: 0; width: 33.333%; background: #008751; }
        .ag-fy { left: 33.333%; right: 0; top: 0; height: 50%; background: #FCD116; }
        .ag-fr { left: 33.333%; right: 0; bottom: 0; height: 50%; background: #E8112D; }
        .ag-flag::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 34%, rgba(255,255,255,.55) 50%, transparent 66%);
          transform: translateX(-120%);
          animation: agSheen 5.5s ease-in-out 1.1s infinite;
        }
        .ag-title {
          margin: 0;
          color: #F3EEE8;
          font-size: clamp(2.75rem, 6vw, 86px);
          line-height: .95;
          letter-spacing: -.035em;
          overflow-wrap: break-word;
        }
        .ag-line { display: block; }
        .ag-w {
          display: inline-block;
          color: #F3EEE8;
          text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 2px 22px rgba(0,0,0,.6);
        }
        .ag-w1 { animation: agWord .78s cubic-bezier(.16,.84,.28,1) .10s both; }
        .ag-w2 { animation: agWord .78s cubic-bezier(.16,.84,.28,1) .16s both; }
        .ag-green {
          color: #00A65C;
          text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 0 30px rgba(0,135,81,.5);
          animation: agWord .78s cubic-bezier(.16,.84,.28,1) .22s both,
                     agGlowG 6.5s ease-in-out 1.4s infinite;
        }
        .ag-yellow {
          color: #FCD116;
          text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 0 32px rgba(252,209,22,.42);
          animation: agWord .78s cubic-bezier(.16,.84,.28,1) .30s both,
                     agGlowY 6.5s ease-in-out 2.1s infinite;
        }
        .ag-red {
          color: #F52D42;
          text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 0 30px rgba(232,17,45,.48);
          animation: agWord .78s cubic-bezier(.16,.84,.28,1) .38s both,
                     agGlowR 6.5s ease-in-out 2.8s infinite;
        }
        .ag-rule {
          display: flex;
          gap: 4px;
          width: clamp(168px, 30vw, 306px);
          height: 5px;
          margin-top: 22px;
        }
        .ag-rule i {
          display: block;
          height: 100%;
          border-radius: 99px;
          transform-origin: left center;
          animation: agDraw .7s cubic-bezier(.22,.9,.28,1) both;
        }
        .ag-rule i.ag-rg { flex: 1 1 33.33%; background: linear-gradient(90deg,#008751,#00C46E); box-shadow: 0 0 16px -2px rgba(0,135,81,.85); animation-delay: .52s; }
        .ag-rule i.ag-ry { flex: 1 1 33.33%; background: linear-gradient(90deg,#FCD116,#FFE873); box-shadow: 0 0 16px -2px rgba(252,209,22,.8); animation-delay: .62s; }
        .ag-rule i.ag-rr { flex: 1 1 33.34%; background: linear-gradient(90deg,#E8112D,#FF6A5A); box-shadow: 0 0 16px -2px rgba(232,17,45,.8); animation-delay: .72s; }

        @keyframes agFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes agWord {
          from { opacity: 0; transform: translateY(26px) scale(.965); filter: blur(7px); }
          to   { opacity: 1; transform: none; filter: blur(0); }
        }
        @keyframes agDraw { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }
        @keyframes agSheen { 0%,72% { transform: translateX(-120%); } 88%,100% { transform: translateX(120%); } }
        @keyframes agGlowG { 0%,100% { text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 0 26px rgba(0,135,81,.40); } 50% { text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 0 44px rgba(0,196,110,.72); } }
        @keyframes agGlowY { 0%,100% { text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 0 26px rgba(252,209,22,.34); } 50% { text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 0 46px rgba(252,209,22,.66); } }
        @keyframes agGlowR { 0%,100% { text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 0 26px rgba(232,17,45,.38); } 50% { text-shadow: 0 1px 3px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.72), 0 0 44px rgba(245,45,66,.70); } }

        @media (max-width: 639px) {
          .ag-kicker { gap: 9px; margin-bottom: 13px; letter-spacing: .2em; }
          .ag-flag { width: 28px; height: 19px; }
          .ag-title { font-size: clamp(2.25rem, 10.8vw, 2.75rem); }
          .ag-rule { margin-top: 17px; height: 4px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ag-kicker, .ag-w, .ag-green, .ag-yellow, .ag-red, .ag-rule i, .ag-flag::after {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }

        .agenda-bg {
          background-image: url("${AGENDA_BACKGROUND}");
          background-size: cover;
          background-position: center 35%;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }
        @media (max-width: 767px) {
          .agenda-bg { display: none; }
        }
        .agenda-grid {
          grid-template-areas:
            "featured"
            "a"
            "b"
            "c"
            "d"
            "e"
            "f"
            "g";
        }
        .agenda-grid > :nth-child(1) { grid-area: featured; }
        .agenda-grid > :nth-child(2) { grid-area: a; }
        .agenda-grid > :nth-child(3) { grid-area: b; }
        .agenda-grid > :nth-child(4) { grid-area: c; }
        .agenda-grid > :nth-child(5) { grid-area: d; }
        .agenda-grid > :nth-child(6) { grid-area: e; }
        .agenda-grid > :nth-child(7) { grid-area: f; }
        .agenda-grid > :nth-child(8) { grid-area: g; }
        @media (min-width: 640px) {
          .agenda-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-areas:
              "featured featured"
              "a b"
              "c d"
              "e f"
              "g g";
          }
        }
        @media (min-width: 1024px) {
          .agenda-grid {
            grid-template-columns: 2fr 1fr 1fr;
            grid-template-rows: 300px 240px 240px;
            grid-template-areas:
              "featured a b"
              "featured c d"
              "e f g";
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
};
