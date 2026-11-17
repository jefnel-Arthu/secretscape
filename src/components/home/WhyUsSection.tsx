import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ENGAGEMENTS } from '../../data/editorial';
import { AGENCY_PHONE_HREF, AGENCY_CONTACT } from '../../data/contact';
import { SectionHeading } from './SectionHeading';

interface WhyUsSectionProps {
  onNavigate: (tab: string) => void;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ onNavigate }) => {
  return (
    <section className="bg-[#11382E] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Pourquoi nous"
              title={
                <>
                  Des promesses
                  <br />
                  <span className="italic text-[#D9A441]">tenues.</span>
                </>
              }
              description="SecretScape est né au Bénin, avec des guides qui y vivent. Quatre engagements simples, vérifiables à chaque étape de votre voyage."
              tone="dark"
            />
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="group bg-[#D9A441] hover:bg-[#c89433] text-stone-950 font-semibold text-sm py-4 px-7 rounded-full inline-flex items-center gap-2.5 transition-all"
              >
                Parlons de votre voyage
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href={AGENCY_PHONE_HREF}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {AGENCY_CONTACT.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {ENGAGEMENTS.map((engagement) => (
              <div key={engagement.number} className="border-t border-white/15 pt-5 space-y-3">
                <span className="block font-serif text-3xl text-[#D9A441] leading-none">{engagement.number}</span>
                <h3 className="text-base font-semibold text-white leading-snug">{engagement.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/60">{engagement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
