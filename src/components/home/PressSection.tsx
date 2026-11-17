import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PRESS_MENTIONS } from '../../data/editorial';
import { SectionHeading } from './SectionHeading';

export const PressSection: React.FC = () => {
  return (
    <section className="bg-[#F6F3EE] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Le Bénin dans la presse"
          title={
            <>
              La destination fait
              <br />
              <span className="italic text-[#D9A441]">parler d’elle.</span>
            </>
          }
          description="Les médias internationaux s’y intéressent de plus en plus. Voici ce qu’ils en disent — et ce que vous pourrez vérifier sur place."
          className="mb-12 sm:mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRESS_MENTIONS.map((mention) => (
            <a
              key={mention.outlet}
              href={mention.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 rounded-3xl bg-white p-6 border border-stone-200/80 hover:border-[#11382E]/30 hover:shadow-lg hover:shadow-stone-900/5 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-serif text-2xl text-[#11382E] leading-none">{mention.outlet}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-[#D9A441] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[13px] leading-relaxed text-stone-700 flex-1">{mention.title}</p>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                {mention.date}
              </span>
            </a>
          ))}
        </div>

        <p className="mt-8 text-[11px] leading-relaxed text-stone-500 max-w-2xl">
          Ces articles portent sur la destination Bénin, pas sur SecretScape. Les liens renvoient vers les
          publications d’origine.
        </p>
      </div>
    </section>
  );
};
