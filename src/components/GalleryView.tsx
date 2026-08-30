import React, { useEffect, useMemo, useState } from 'react';
import { Images, X, CalendarDays, MapPin, Sparkles, Music, Flame, Theater, Crown, Utensils, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

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
  images: string[];
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
    image: 'https://cdn1.img.sputniknews.africa/img/07e9/01/0a/1070110509_0:0:3072:2048_1440x900_80_0_1_24b5b6404e2fe8a3e081700735f8ed53.jpg',
    images: [
      'https://cdn1.img.sputniknews.africa/img/07e9/01/0a/1070110509_0:0:3072:2048_1440x900_80_0_1_24b5b6404e2fe8a3e081700735f8ed53.jpg',
      'https://cdn1.img.sputniknews.africa/img/07e9/01/0a/1070110704_0:0:3072:2048_1440x900_80_0_1_f56c02eb0367a1d0b20baff7b28b0bb7.jpg',
      'https://cdn1.img.sputniknews.africa/img/07e9/01/0a/1070110897_0:0:3072:2048_1440x900_80_0_1_299915f53269174d73160fde4ae4edff.jpg',
      'https://cdn1.img.sputniknews.africa/img/07e9/01/0a/1070111090_0:0:3072:2048_1440x900_80_0_1_443e3eb3e57ef4d1851d3d33e3e70626.jpg',
      'https://cdn1.img.sputniknews.africa/img/07e9/01/0a/1070111283_0:0:3072:2048_1440x900_80_0_1_4b21c541e42e71d7c8d5f45809496922.jpg',
      'https://cdn1.img.sputniknews.africa/img/07e9/01/0a/1070111476_0:0:3072:2048_1440x900_80_0_1_44de18b50f692a734f99c85a792e85be.jpg',
      'https://cdn1.img.sputniknews.africa/img/07e9/01/0a/1070111669_0:0:3072:2048_1440x900_80_0_1_7ab99b4899dd5667c240d3a823402ed6.jpg',
      'https://cdn1.img.sputniknews.africa/img/07e9/01/0a/1070111862_0:0:3072:2048_1440x900_80_0_1_540581c85e0981a4680baf6e0bec1989.jpg',
      'https://myafricanmagazine.com/wp-content/uploads/2026/01/A-voodoo-worshipper-in-trance-1536x1024.jpg',
      'https://myafricanmagazine.com/wp-content/uploads/2026/01/One-of-the-hundreds-of-dances-perforned-during-the-2026-Vodun-Days-1536x937.jpg',
      'https://myafricanmagazine.com/wp-content/uploads/2026/01/Zangbeto.-Image-by-Thiani-Capo-chichi-for-The-African-1-2048x1089.jpg',
      'https://myafricanmagazine.com/wp-content/uploads/2026/01/Ouidah.-Image-by-Thiani-Capo-chichi-for-The-African-1536x1024.jpg',
      'https://www.afrik.com/wp-content/uploads/2026/01/patrice-talon-a-bord-dun-tricycle-aux-vodun-days-1200x675.jpg',
    ],
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
    image: 'https://blackmusics.com/wp-content/uploads/2025/01/IMG-20250103-WA0344.jpg',
    images: ['https://blackmusics.com/wp-content/uploads/2025/01/IMG-20250103-WA0344.jpg'],
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
    image: 'https://www.festichill.com/_next/image?url=%2Fhf_20260624_153758_5503e980-398a-44e5-8255-7cd29f4d6700.avif&w=1200&q=75',
    images: [
      'https://www.festichill.com/_next/image?url=%2Fhf_20260624_153758_5503e980-398a-44e5-8255-7cd29f4d6700.avif&w=1200&q=75',
      'https://www.festichill.com/_next/image?url=%2Fhf_20260624_161056_b83cf922-5e4c-4dc3-840c-70a6f99f9884.avif&w=1200&q=75',
      'https://www.festichill.com/affiche_festichill_las_favelas.jpeg',
    ],
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
    image: 'https://www.lameteo.info/wp-content/uploads/2025/08/IMG-20250804-WA0129.jpg',
    images: [
      'https://www.lameteo.info/wp-content/uploads/2025/08/IMG-20250804-WA0129.jpg',
      'https://www.lameteo.info/wp-content/uploads/2025/08/IMG-20250804-WA0131.jpg',
      'https://www.lameteo.info/wp-content/uploads/2025/08/IMG-20250804-WA0123.jpg',
      'https://www.lameteo.info/wp-content/uploads/2025/08/IMG-20250804-WA0119.jpg',
    ],
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
    image: 'https://festivalsica.com/assets/images/gala-laureats-groupe-2025.jpg',
    images: [
      'https://festivalsica.com/assets/images/gala-laureats-groupe-2025.jpg',
      'https://festivalsica.com/assets/images/sica-2025/_X8A9678.jpg',
      'https://festivalsica.com/assets/images/remise-trophee-scene.jpg',
      'https://festivalsica.com/assets/images/portrait-couple-gala.jpg',
      'https://festivalsica.com/assets/images/laureate-marie-louise-ouamono.jpg',
    ],
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
    image: 'https://www.afrik.com/wp-content/uploads/2025/08/un-magasin-dignames-1200x675.jpg',
    images: [
      'https://www.afrik.com/wp-content/uploads/2025/08/un-magasin-dignames-1200x675.jpg',
      'https://www.afrik.com/wp-content/uploads/2025/08/un-magasin-dignames.jpg',
    ],
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
    image: 'https://www.afrik.com/wp-content/uploads/2026/08/le-palais-royal-et-larene-de-la-gaani-a-nikki-alors-en-construction-1200x675.jpg',
    images: [
      'https://www.afrik.com/wp-content/uploads/2026/08/le-palais-royal-et-larene-de-la-gaani-a-nikki-alors-en-construction-1200x675.jpg',
      'https://www.afrik.com/wp-content/uploads/2026/08/un-cavalier-a-la-gaani-wwwgouvbj.jpeg',
    ],
    emoji: '🐎',
  },
];

export const GalleryView: React.FC<GalleryViewProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selected, setSelected] = useState<BeninEvent | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    setPhotoIndex(0);
  }, [selected]);

  const filtered = useMemo(() => {
    const all = activeCategory === 'ALL' ? BENIN_EVENTS : BENIN_EVENTS.filter(e => e.category === activeCategory);
    return all.map((ev) => {
      const photos = ev.images.length > 0 ? ev.images : (ev.image ? [ev.image] : []);
      return { ...ev, image: ev.image || (photos[0] || ''), images: photos };
    });
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

                  {ev.images.length > 1 && (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-black/60 text-white">
                      <Images className="w-3 h-3 text-amber-400" />
                      {ev.images.length} photos
                    </span>
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
        const photos = selected.images.length > 0 ? selected.images : (selected.image ? [selected.image] : []);
        const goPrev = () => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
        const goNext = () => setPhotoIndex((i) => (i + 1) % photos.length);
        return (
        <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 sm:p-8 bg-black/90 overflow-y-auto">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden">
            {photos.length > 0 ? (
              <div className="relative bg-black">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${Math.min(photoIndex, photos.length - 1) * 100}%)` }}
                >
                  {photos.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`${selected.name} ${idx + 1}`}
                      loading="lazy"
                      className="w-full shrink-0 h-72 sm:h-80 object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ))}
                </div>

                {photos.length > 1 && (
                  <>
                    <div className="absolute inset-x-0 bottom-16 flex justify-center">
                      <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-bold backdrop-blur-md">
                        {Math.min(photoIndex, photos.length - 1) + 1} / {photos.length}
                      </span>
                    </div>

                    <button
                      onClick={goPrev}
                      className="absolute top-1/2 left-3 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-stone-950 transition-colors"
                      aria-label="Photo précédente"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-stone-950 transition-colors"
                      aria-label="Photo suivante"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-0 inset-x-0 flex gap-2 px-4 py-3 overflow-x-auto bg-gradient-to-t from-black/80 to-transparent justify-center">
                      {photos.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPhotoIndex(idx)}
                          className={`w-14 h-10 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === Math.min(photoIndex, photos.length - 1)
                              ? 'border-amber-400 scale-105'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                          aria-label={`Voir la photo ${idx + 1}`}
                        >
                          <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
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