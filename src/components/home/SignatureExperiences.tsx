import React from 'react';
import { ArrowRight, ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { SIGNATURE_EXPERIENCES } from '../../data/editorial';
import { OptimizedImage } from '../OptimizedImage';
import { SectionHeading } from './SectionHeading';

interface SignatureExperiencesProps {
  onOpenSpot: (spotId: string) => void;
  onExploreCity: (city: string) => void;
  onNavigate: (tab: string) => void;
}

export const SignatureExperiences: React.FC<SignatureExperiencesProps> = ({
  onOpenSpot,
  onExploreCity,
  onNavigate,
}) => {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 sm:mb-16">
          <SectionHeading
            eyebrow="Expériences signature"
            title={
              <>
                Ici, on ne visite pas.
                <br />
                <span className="italic text-[#D9A441]">On fait.</span>
              </>
            }
            description="Huit façons de toucher le Bénin du bout des doigts : un geste, un atelier, une rencontre. Choisissez celle qui vous ressemble, on s’occupe du reste."
          />
          <button
            onClick={() => onNavigate('map')}
            className="group inline-flex items-center gap-2 self-start lg:self-auto text-sm font-semibold text-[#11382E] hover:text-[#B07A1E] transition-colors shrink-0"
          >
            Toutes les expériences
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {SIGNATURE_EXPERIENCES.map((experience, index) => (
            <button
              key={experience.id}
              onClick={() =>
                experience.spotId
                  ? onOpenSpot(experience.spotId)
                  : onExploreCity(experience.city)
              }
              className="group relative overflow-hidden rounded-3xl text-left h-[360px] sm:h-[400px] bg-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2"
            >
              <OptimizedImage
                src={experience.image}
                alt={experience.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
              <div className="absolute inset-0 bg-[#11382E]/10 group-hover:bg-[#11382E]/25 transition-colors" />

              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white border border-white/20">
                <MapPin className="w-3 h-3 text-[#D9A441]" />
                {experience.city}
              </span>
              <span className="absolute top-4 right-4 text-[11px] font-semibold tracking-[0.2em] text-white/50">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl leading-snug text-white">
                  {experience.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-white/70 line-clamp-2">
                  {experience.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                    <Clock className="w-3.5 h-3.5 text-[#D9A441]" />
                    {experience.duration}
                  </span>
                  <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-[#D9A441] group-hover:border-[#D9A441] group-hover:text-stone-950 transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
