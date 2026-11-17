import React from 'react';
import { ArrowRight, CalendarDays, Check, MoveRight } from 'lucide-react';
import { CIRCUITS } from '../../data/editorial';
import { OptimizedImage } from '../OptimizedImage';
import { SectionHeading } from './SectionHeading';

interface CircuitsSectionProps {
  onNavigate: (tab: string) => void;
}

export const CircuitsSection: React.FC<CircuitsSectionProps> = ({ onNavigate }) => {
  return (
    <section className="bg-[#11382E] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 sm:mb-16">
          <SectionHeading
            eyebrow="Circuits sur mesure"
            title={
              <>
                Des itinéraires qui
                <br />
                <span className="italic text-[#D9A441]">vous ressemblent.</span>
              </>
            }
            description="Quatre trames éprouvées, toutes modulables : on ajuste les étapes, le rythme et le budget avec vous. Départ garanti à partir de deux voyageurs."
            tone="dark"
          />
          <button
            onClick={() => onNavigate('calendar')}
            className="group inline-flex items-center gap-2 self-start lg:self-auto text-sm font-semibold text-white/80 hover:text-[#D9A441] transition-colors shrink-0"
          >
            Composer mon carnet
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CIRCUITS.map((circuit) => (
            <article
              key={circuit.id}
              className="group flex flex-col sm:flex-row overflow-hidden rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#D9A441]/40 transition-colors"
            >
              <div className="relative sm:w-2/5 shrink-0 h-52 sm:h-auto overflow-hidden">
                <OptimizedImage
                  src={circuit.image}
                  alt={circuit.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11382E]/70 via-transparent to-transparent sm:bg-gradient-to-r" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white border border-white/20">
                  <CalendarDays className="w-3 h-3 text-[#D9A441]" />
                  {circuit.days} jours
                </span>
                {circuit.badge && (
                  <span className="absolute bottom-4 left-4 rounded-full bg-[#D9A441] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-950">
                    {circuit.badge}
                  </span>
                )}
              </div>

              <div className="flex-1 p-5 sm:p-6 flex flex-col gap-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-white leading-tight">{circuit.title}</h3>
                  <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#D9A441]">
                    {circuit.route.map((step, index) => (
                      <span key={step} className="inline-flex items-center gap-1.5">
                        {step}
                        {index < circuit.route.length - 1 && <MoveRight className="w-3 h-3 text-white/30" />}
                      </span>
                    ))}
                  </p>
                </div>

                <p className="text-[13px] leading-relaxed text-white/65">{circuit.description}</p>

                <ul className="space-y-1.5 mt-auto">
                  {circuit.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-[12px] text-white/70">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#D9A441]" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onNavigate('calendar')}
                  className="inline-flex items-center gap-2 self-start text-[12px] font-semibold text-[#D9A441] hover:text-white transition-colors"
                >
                  Personnaliser ce circuit
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
