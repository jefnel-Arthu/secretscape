import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AGENDA_EVENTS } from '../data/agendaEvents';
import { formatPeriodRange, getRevealEvents } from '../lib/agenda';
import { EventRevealModal } from './EventRevealModal';
import { FireworksOverlay } from './FireworksOverlay';

interface GiftWidgetProps {
  onNavigateToAgenda: () => void;
  onOpen?: () => void;
  hidden?: boolean;
}

/**
 * Cadeau premium 3D : cube doré vu de 3/4, couvercle séparé,
 * rubans rouges et grand nœud. Fond transparent, aucun contour.
 */
const GiftIllustration: React.FC = () => (
  <svg
    viewBox="0 0 128 128"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    className="gift-svg block h-[70px] w-[70px] sm:h-20 sm:w-20"
    shapeRendering="geometricPrecision"
  >
    <defs>
      <linearGradient id="gGoldTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFF8D4" />
        <stop offset="0.5" stopColor="#FBE28E" />
        <stop offset="1" stopColor="#F3C86A" />
      </linearGradient>
      <linearGradient id="gGoldLidFront" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#FFF0AE" />
        <stop offset="0.5" stopColor="#F9CE68" />
        <stop offset="1" stopColor="#E7A83E" />
      </linearGradient>
      <linearGradient id="gGoldLidSide" x1="0" y1="0" x2="1" y2="0.7">
        <stop offset="0" stopColor="#F3C06A" />
        <stop offset="0.55" stopColor="#E29B35" />
        <stop offset="1" stopColor="#C0721A" />
      </linearGradient>
      <linearGradient id="gGoldFront" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor="#FFEFA8" />
        <stop offset="0.45" stopColor="#F8CB63" />
        <stop offset="0.8" stopColor="#E4A03A" />
        <stop offset="1" stopColor="#D8892B" />
      </linearGradient>
      <linearGradient id="gGoldSide" x1="0" y1="0" x2="1" y2="0.6">
        <stop offset="0" stopColor="#F6C25E" />
        <stop offset="0.55" stopColor="#E9A946" />
        <stop offset="1" stopColor="#C77C22" />
      </linearGradient>
      <linearGradient id="gSheenTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="gShadeTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7A4A10" stopOpacity="0.22" />
        <stop offset="1" stopColor="#7A4A10" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="gRibbonVert" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8F0000" />
        <stop offset="0.22" stopColor="#FF5757" />
        <stop offset="0.55" stopColor="#D41218" />
        <stop offset="0.8" stopColor="#FF4141" />
        <stop offset="1" stopColor="#990000" />
      </linearGradient>
      <linearGradient id="gRibbonTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FF6B6B" />
        <stop offset="0.5" stopColor="#D41218" />
        <stop offset="1" stopColor="#8F0000" />
      </linearGradient>
      <linearGradient id="gRibbonBand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF6B6B" />
        <stop offset="0.55" stopColor="#D41218" />
        <stop offset="1" stopColor="#9A0000" />
      </linearGradient>
      <linearGradient id="gRibbonBandSide" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E23A3A" />
        <stop offset="0.55" stopColor="#BC0F14" />
        <stop offset="1" stopColor="#7E0000" />
      </linearGradient>
      <linearGradient id="gBow" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#FF5F5F" />
        <stop offset="0.45" stopColor="#E00000" />
        <stop offset="1" stopColor="#A30000" />
      </linearGradient>
      <linearGradient id="gBowBack" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#D40000" />
        <stop offset="1" stopColor="#8A0000" />
      </linearGradient>
      <radialGradient id="gKnot" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#FF7A7A" />
        <stop offset="0.55" stopColor="#E40000" />
        <stop offset="1" stopColor="#9E0000" />
      </radialGradient>
      <radialGradient id="gGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#FFC85A" stopOpacity="0.5" />
        <stop offset="0.55" stopColor="#FFB300" stopOpacity="0.16" />
        <stop offset="1" stopColor="#FFB300" stopOpacity="0" />
      </radialGradient>
      <filter id="gBlur" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
    </defs>

    {/* Halo chaud */}
    <ellipse cx="65" cy="58" rx="48" ry="46" fill="url(#gGlow)" />

    {/* Ombre portée au sol */}
    <ellipse cx="66" cy="112" rx="30" ry="6.5" fill="#000000" opacity="0.22" filter="url(#gBlur)" />

    {/* Corps : face droite */}
    <path d="M80 60 L102 52 L102 98 L80 106 Z" fill="url(#gGoldSide)" />

    {/* Corps : face avant */}
    <rect x="30" y="60" width="50" height="46" fill="url(#gGoldFront)" />
    <rect x="30" y="60" width="50" height="12" fill="url(#gSheenTop)" />
    <rect x="30" y="60" width="50" height="9" fill="url(#gShadeTop)" />

    {/* Couvercle : face droite */}
    <path d="M82 46 L104 38 L104 52 L82 60 Z" fill="url(#gGoldLidSide)" />

    {/* Couvercle : face avant */}
    <rect x="26" y="46" width="56" height="14" fill="url(#gGoldLidFront)" />
    <rect x="26" y="46" width="56" height="4" fill="#FFFFFF" opacity="0.3" />

    {/* Couvercle : dessus */}
    <path d="M26 46 L48 38 L104 38 L82 46 Z" fill="url(#gGoldTop)" />
    <path d="M31 45 L49 39 L64 39 L45 45 Z" fill="#FFFFFF" opacity="0.22" />

    {/* Arêtes lumineuses */}
    <path d="M48 38.6 L104 38.6" stroke="#FFF6CE" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
    <path d="M26 46.6 L82 46.6" stroke="#FFF3C0" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
    <path d="M26 59.4 L82 59.4" stroke="#B9761F" strokeWidth="1" opacity="0.5" />

    {/* Ruban horizontal autour du couvercle */}
    <rect x="26" y="50" width="56" height="5.6" fill="url(#gRibbonBand)" />
    <path d="M82 50 L104 42 L104 47.6 L82 55.6 Z" fill="url(#gRibbonBandSide)" />
    <rect x="26" y="50.4" width="56" height="1.2" fill="#FF9090" opacity="0.55" />

    {/* Ruban vertical : couvercle */}
    <rect x="51" y="46" width="7" height="14" fill="url(#gRibbonVert)" />
    <rect x="51" y="46" width="1.6" height="14" fill="#FFFFFF" opacity="0.28" />
    <rect x="56.4" y="46" width="1.6" height="14" fill="#7A0000" opacity="0.4" />

    {/* Ruban vertical : dessus */}
    <path d="M51 46 L58 46 L80 38 L73 38 Z" fill="url(#gRibbonTop)" />
    <path d="M52.4 45.6 L53.8 45.6 L75.8 37.9 L74.2 37.9 Z" fill="#FFFFFF" opacity="0.28" />

    {/* Ruban vertical : corps */}
    <rect x="51" y="60" width="7" height="46" fill="url(#gRibbonVert)" />
    <rect x="51" y="60" width="1.6" height="46" fill="#FFFFFF" opacity="0.26" />
    <rect x="56.4" y="60" width="1.6" height="46" fill="#7A0000" opacity="0.4" />

    {/* Ombre du nœud sur le couvercle */}
    <ellipse cx="65" cy="41" rx="16" ry="4" fill="#7A3A00" opacity="0.22" filter="url(#gBlur)" />

    {/* Nœud : boucles arrière */}
    <path d="M65 37 C51 15 25 16 28 28 C30 39 51 42 65 37 Z" fill="url(#gBowBack)" />
    <path d="M65 37 C79 15 105 16 102 28 C100 39 79 42 65 37 Z" fill="url(#gBowBack)" />

    {/* Nœud : boucles avant */}
    <path d="M64 37 C57 22 43 12 39 21 C36 29 51 36 64 37 Z" fill="url(#gBow)" />
    <path d="M66 37 C73 22 87 12 91 21 C94 29 79 36 66 37 Z" fill="url(#gBow)" />
    <path d="M64 38 C52 32 39 35 44 42 C48 47 59 43 64 38 Z" fill="url(#gBow)" />
    <path d="M66 38 C78 32 91 35 86 42 C82 47 71 43 66 38 Z" fill="url(#gBow)" />

    {/* Pliures du nœud */}
    <path d="M65 37 C57 27 47 25 43 30" fill="none" stroke="#8E0000" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
    <path d="M65 37 C73 27 83 25 87 30" fill="none" stroke="#8E0000" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
    <path d="M65 38 C56 36 48 38 46 41" fill="none" stroke="#8E0000" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />
    <path d="M65 38 C74 36 82 38 84 41" fill="none" stroke="#8E0000" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />

    {/* Reflets sur les boucles */}
    <path d="M36 23.5 C41 19 49 20 54 26" fill="none" stroke="#FF9C9C" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
    <path d="M94 23.5 C89 19 81 20 76 26" fill="none" stroke="#FF9C9C" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />

    {/* Cœur du nœud */}
    <ellipse cx="65" cy="37" rx="7" ry="5.6" fill="url(#gKnot)" />
    <ellipse cx="63.2" cy="34.8" rx="2.6" ry="1.6" fill="#FFFFFF" opacity="0.55" />
    <ellipse cx="65" cy="39.4" rx="4.6" ry="1.4" fill="#7D0000" opacity="0.3" />

    {/* Éclats lumineux */}
    <path
      d="M101 14 c0.8 4 1.9 5.1 5.9 5.9 c-4 0.8 -5.1 1.9 -5.9 5.9 c-0.8 -4 -1.9 -5.1 -5.9 -5.9 c4 -0.8 5.1 -1.9 5.9 -5.9 Z"
      fill="#FFF7D6"
      opacity="0.85"
    />
    <path
      d="M27 54 c0.5 2.4 1.1 3 3.5 3.5 c-2.4 0.5 -3 1.1 -3.5 3.5 c-0.5 -2.4 -1.1 -3 -3.5 -3.5 c2.4 -0.5 3 -1.1 3.5 -3.5 Z"
      fill="#FFF7D6"
      opacity="0.55"
    />
  </svg>
);

export const GiftWidget: React.FC<GiftWidgetProps> = ({
  onNavigateToAgenda,
  onOpen,
  hidden = false,
}) => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const now = useMemo(() => new Date(), []);
  const { events, isFallback } = useMemo(() => getRevealEvents(AGENDA_EVENTS, now), [now]);
  const periodLabel = isFallback ? 'Les prochains rendez-vous à venir' : formatPeriodRange(now);

  if (hidden) return null;

  const handleOpen = () => {
    if (showFireworks || modalOpen) return;

    onOpen?.();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setModalOpen(true);
      return;
    }

    setShowFireworks(true);
    timers.current.push(window.setTimeout(() => setModalOpen(true), 700));
    timers.current.push(window.setTimeout(() => setShowFireworks(false), 3600));
  };

  return (
    <>
      <div className="fixed bottom-5 right-4 z-[650] sm:bottom-6 sm:right-6">
        <div className="group relative">
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Découvrir les événements de la période"
            aria-haspopup="dialog"
            className="gift-button block cursor-pointer bg-transparent p-0 leading-none transition-transform duration-300 ease-out hover:rotate-[-2deg] hover:scale-[1.08] focus:outline-none active:scale-[1.02]"
          >
            <span className="gift-float block">
              <GiftIllustration />
            </span>
          </button>

          {/* Infobulle */}
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-xl bg-stone-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 sm:block">
            Découvre les événements de la période
          </span>
        </div>
      </div>

      {showFireworks && <FireworksOverlay duration={3400} />}

      <EventRevealModal
        open={modalOpen}
        events={events}
        periodLabel={periodLabel}
        isFallback={isFallback}
        onClose={() => setModalOpen(false)}
        onNavigateToAgenda={() => {
          setModalOpen(false);
          onNavigateToAgenda();
        }}
      />
    </>
  );
};
