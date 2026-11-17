import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { SIGNATURE_DESTINATIONS } from '../../data/editorial';
import { OptimizedImage } from '../OptimizedImage';
import { SectionHeading } from './SectionHeading';

interface DestinationsSignatureProps {
  countsByCity: Record<string, number>;
  onExploreCity: (city: string) => void;
}

export const DestinationsSignature: React.FC<DestinationsSignatureProps> = ({
  countsByCity,
  onExploreCity,
}) => {
  return (
    <section className="bg-[#F6F3EE] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Où aller ?"
          title={
            <>
              Un petit pays,
              <br />
              <span className="italic text-[#D9A441]">sept visages.</span>
            </>
          }
          description="Chaque ville a sa manière de raconter le Bénin. Suivez la mémoire à Ouidah, la royauté à Abomey, l’océan à Grand-Popo. Le reste, c’est vous qui l’écrivez."
          className="mb-12 sm:mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIGNATURE_DESTINATIONS.map((destination) => {
            const count = countsByCity[destination.city];
            return (
              <button
                key={destination.city}
                onClick={() => onExploreCity(destination.city)}
                className="group relative h-[420px] overflow-hidden rounded-3xl text-left bg-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2"
              >
                <OptimizedImage
                  src={destination.image}
                  alt={`${destination.city} — ${destination.signature}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

                <span className="absolute top-5 left-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D9A441]">
                  {destination.signature}
                </span>
                <span className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-[#D9A441] group-hover:border-[#D9A441] group-hover:text-stone-950 transition-all">
                  <ArrowRight className="w-4 h-4 -rotate-45" />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 space-y-2">
                  <h3 className="font-serif text-3xl sm:text-4xl text-white leading-none">
                    {destination.city}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white/70">
                    {destination.tagline}
                  </p>
                  {count ? (
                    <span className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-medium text-white/50">
                      <MapPin className="w-3 h-3 text-[#D9A441]" />
                      {count} lieux secrets référencés
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
