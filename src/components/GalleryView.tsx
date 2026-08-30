import React, { useMemo, useState } from 'react';
import { Images, X, CalendarDays, MapPin, Sparkles, Music, Flame, Theater, Crown, Utensils, Eye } from 'lucide-react';

type EventCategory = 'spiritualite' | 'musique' | 'traditions' | 'mode' | 'gastronomie';

interface BeninEvent {
  id: string;
  name: string;
  category: EventCategory;
  date: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  image: string;
  emoji: string;
}

interface GalleryViewProps {
  onOpenSpot?: (spot: any) => void;
}

const CATEGORY_META: Record<EventCategory, { label: string; icon: React.ElementType; color: string }> = {
  spiritualite: { label: 'Spiritualité', icon: Sparkles, color: 'text-violet-400' },
  musique: { label: 'Musique & Concerts', icon: Music, color: 'text-pink-400' },
  traditions: { label: 'Traditions', icon: Theater, color: 'text-emerald-400' },
  mode: { label: 'Mode & Culture', icon: Crown, color: 'text-amber-400' },
  gastronomie: { label: 'Gastronomie', icon: Utensils, color: 'text-orange-400' },
};

const BENIN_EVENTS: BeninEvent[] = [
  {
    id: 'event-vodun-days',
    name: 'Vodun Days',
    category: 'spiritualite',
    date: '8 - 10 janvier',
    period: 'Annuel',
    location: 'Ouidah',
    description: 'Le plus grand rendez-vous mondial de la spiritualité Vodun. Cérémonies traditionnelles, sorties des couvents, processions de masques Egungun, parades de Zangbéto et grands concerts sur la plage pendant trois jours d\'immersion culturelle.',
    highlights: ['Procession des masques Egungun', 'Parades Zangbéto', 'Concerts géants sur la plage', 'Village artisanal & gastronomique'],
    image: '',
    emoji: '🫧',
  },
  {
    id: 'event-weloveya',
    name: 'WeLovEya',
    category: 'musique',
    date: 'Fin décembre',
    period: 'Annuel',
    location: 'Cotonou — Place de l\'Amazone',
    description: 'Le festival des musiques urbaines et de l\'afrobeat, créé en 2022. Une plateforme pour la jeunesse et les communautés du Bénin, avec les plus grands artistes de la scène afro.',
    highlights: ['Afrobeat & musiques urbaines', 'Artistes de la scène africaine', 'Atmosphère festive en plein air'],
    image: '',
    emoji: '🎤',
  },
  {
    id: 'event-festichill',
    name: 'FestiChill',
    category: 'musique',
    date: 'Juillet',
    period: 'Annuel',
    location: 'Cotonou',
    description: 'Le plus grand festival lifestyle du Bénin. Une expérience inoubliable mêlant concerts, mode, jeux et frissons dans une ambiance unique, avec des artistes nationaux et internationaux.',
    highlights: ['Concerts & performances live', 'Expérience lifestyle immersive', 'Artistes invités internationaux'],
    image: '',
    emoji: '⛱️',
  },
  {
    id: 'event-festival-masques',
    name: 'Festival des Masques',
    category: 'traditions',
    date: '25 - 26 juillet',
    period: 'Annuel',
    location: 'Porto-Novo',
    description: 'Immersion dans l\'univers des masques sacrés et profanes : Gèlèdè, Zangbéto, Egungun, Kaléta. Colloque scientifique, démonstrations d\'artisans et grande procession de masques venus de toute l\'Afrique.',
    highlights: ['Grande procession des masques', 'Masques Gèlèdè & Zangbéto', 'Concerts tradi-modernes', 'Ateliers pour enfants'],
    image: '',
    emoji: '🎭',
  },
  {
    id: 'event-festival-sica',
    name: 'Festival SICA',
    category: 'mode',
    date: '9 - 15 novembre',
    period: 'Annuel',
    location: 'Cotonou — CNOA',
    description: 'Le festival panafricain de référence célébrant la musique africaine, la mode et la culture depuis 25 ans. Concerts live, défilés de mode, conférences et soirée de Gala avec remise de trophées.',
    highlights: ['Afro Musique & Musique Urbaine', 'SICA Fashion Show', 'Conférences & Master Class', 'Soirée de Gala'],
    image: '',
    emoji: '👑',
  },
  {
    id: 'event-fete-igname',
    name: 'Fête de l\'Igname',
    category: 'gastronomie',
    date: 'Autour du 15 août',
    period: 'Annuel',
    location: 'Savalou',
    description: 'Célébration traditionnelle de la nouvelle igname, marquant la fin des récoltes. Rites ancestraux, danses, repas communautaires et dégustation des premières ignames de la saison.',
    highlights: ['Rites de la nouvelle récolte', 'Danses traditionnelles', 'Dégustations communautaires'],
    image: '',
    emoji: '🍠',
  },
  {
    id: 'event-gaani',
    name: 'Gaani de Nikki',
    category: 'traditions',
    date: 'Mai - juin',
    period: 'Annuel',
    location: 'Nikki — Département du Borgou',
    description: 'La grande fête annuelle des Bariba du Nord-Bénin au Palais royal de Nikki. Cavalcades équestres, danses, rites royaux et rassemblement des chefferies traditionnelles dans une ambiance grandiose.',
    highlights: ['Cavalcades équestres', 'Rites royaux Bariba', 'Danses et traditions du Nord'],
    image: '',
    emoji: '🐎',
  },
];

export const GalleryView: React.FC<GalleryViewProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selected, setSelected] = useState<BeninEvent | null>(null);

  const filtered = useMemo(() => {
    const list = activeCategory === 'ALL' ? BENIN_EVENTS : BENIN_EVENTS.filter(e => e.category === activeCategory);
    return list;
  }, [activeCategory]);

  const categories = Object.keys(CATEGORY_META) as EventCategory[];

  return (
    <div className="bg-stone-950 min-h-full">
      {/* Header */}
      <div className="relative py-14 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 via-transparent to-stone-950" />
        <Flame className="w-10 h-10 text-amber-400 mx-auto mb-4" />
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
          Événements <span className="text-amber-400">du Bénin</span>
        </h1>
        <p className="text-stone-400 text-sm max-w-lg mx-auto">
          Vodun Days, WeLovEya, FestiChill, festivals, fêtes traditionnelles… Restez au courant de tout ce qui fait vibrer le Bénin.
        </p>

        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'ALL'
                ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Tout
          </button>
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <meta.icon className="w-3.5 h-3.5" />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events grid */}
      {filtered.length === 0 ? (
        <div className="pb-24 text-center">
          <Images className="w-12 h-12 text-stone-700 mx-auto mb-3" />
          <p className="text-stone-500 text-sm">Aucun événement dans cette catégorie.</p>
        </div>
      ) : (
        <div className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ev) => {
              const meta = CATEGORY_META[ev.category];
              return (
                <button
                  key={ev.id}
                  onClick={() => setSelected(ev)}
                  className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 text-left hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5"
                >
                  {ev.image ? (
                    <img
                      src={ev.image}
                      alt={ev.name}
                      loading="lazy"
                      className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-52 flex items-center justify-center bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950">
                      <span className="text-6xl transition-transform duration-700 group-hover:scale-125">{ev.emoji}</span>
                    </div>
                  )}

                  {ev.image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  )}

                  {/* Category badge */}
                  <span className={`absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-white/95 ${meta.color}`}>
                    <meta.icon className="w-3 h-3" />
                    {meta.label}
                  </span>

                  <div className="p-4">
                    <h3 className="font-display text-white font-bold text-lg leading-tight group-hover:text-amber-300 transition-colors">
                      {ev.emoji}{' '}{ev.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-stone-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
                        {ev.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {ev.location}
                      </span>
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed mt-3 line-clamp-2">{ev.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Event detail modal */}
      {selected && (() => {
        const SelMeta = CATEGORY_META[selected.category];
        return (
        <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 sm:p-8 bg-black/90 overflow-y-auto">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden">
            {selected.image ? (
              <img src={selected.image} alt={selected.name} className="w-full h-64 object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div className="w-full h-56 flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-950">
                <span className="text-8xl">{selected.emoji}</span>
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2 text-[11px] font-bold">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white">
                  <SelMeta.icon className="w-3 h-3 text-amber-400" />
                  {SelMeta.label}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-stone-300">{selected.period}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">{selected.emoji} {selected.name}</h2>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-stone-300">
                <span className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-amber-400" />
                  {selected.date}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  {selected.location}
                </span>
              </div>

              <p className="text-stone-400 text-sm leading-relaxed mt-5">{selected.description}</p>

              <div className="mt-6">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Au programme</p>
                <div className="space-y-2">
                  {selected.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-stone-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(selected.name + ' Bénin ' + selected.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold py-3 px-6 rounded-2xl transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  En savoir plus
                </a>
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-3 px-6 rounded-2xl transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
};