import React from 'react';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { EXCURSIONS } from '../../data/editorial';
import { OptimizedImage } from '../OptimizedImage';
import { SectionHeading } from './SectionHeading';

interface ExcursionsSectionProps {
  onNavigate: (tab: string) => void;
}

export const ExcursionsSection: React.FC<ExcursionsSectionProps> = ({ onNavigate }) => {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Excursions"
          title={
            <>
              Une journée,
              <br />
              <span className="italic text-[#D9A441]">un autre monde.</span>
            </>
          }
          description="Six escapades courtes, au départ de Cotonou. Idéales pour un week-end prolongé ou pour goûter au Bénin entre deux rendez-vous."
          className="mb-12 sm:mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXCURSIONS.map((excursion) => (
            <button
              key={excursion.id}
              onClick={() => onNavigate('map')}
              className="group flex flex-col text-left overflow-hidden rounded-3xl bg-[#F6F3EE] border border-stone-200/80 hover:border-[#D9A441]/60 hover:shadow-xl hover:shadow-stone-900/5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2"
            >
              <div className="relative h-52 overflow-hidden">
                <OptimizedImage
                  src={excursion.image}
                  alt={`${excursion.title} — ${excursion.city}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#11382E]">
                  <MapPin className="w-3 h-3" />
                  {excursion.city}
                </span>
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-stone-950/60 backdrop-blur px-3 py-1 text-[11px] font-medium text-white">
                  <Clock className="w-3 h-3 text-[#D9A441]" />
                  {excursion.duration}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-3 p-5 sm:p-6">
                <h3 className="font-serif text-2xl text-[#11382E] leading-tight">{excursion.title}</h3>
                <p className="text-[13px] leading-relaxed text-stone-600">{excursion.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[12px] font-semibold text-[#B07A1E]">
                  Voir les lieux de cette étape
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
