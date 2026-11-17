import React from 'react';

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
};

/** Titre de section éditorial, partagé par les blocs de la page d'accueil. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className = '',
}) => {
  const isCentered = align === 'center';
  const isDark = tone === 'dark';

  return (
    <div className={`${isCentered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'} ${className}`}>
      <span
        className={`block text-[11px] font-semibold tracking-[0.35em] uppercase ${
          isDark ? 'text-[#D9A441]' : 'text-[#B07A1E]'
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight ${
          isDark ? 'text-white' : 'text-[#11382E]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-white/70' : 'text-stone-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
