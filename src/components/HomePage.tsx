import React from 'react';
import { HiddenSpot } from '../types';
import { INITIAL_HIDDEN_SPOTS } from '../data/hiddenSpots';
import {
  Compass,
  MapPin,
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  Star,
  Footprints,
  Phone,
  ShieldCheck,
  Users,
  Globe,
  ChevronRight,
  Ticket,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onOpenSpot: (spot: HiddenSpot) => void;
}

const HERO_IMAGES = [
  '/images/new-land-beach.jpg',
  '/images/bambou-beach.jpg',
  '/images/atlantic-beach.jpg',
  '/images/babs-dock.jpg',
];

const FEATURED_SPOT_IDS = [
  'spot-ganvie-1',
  'spot-pendjari-1',
  'spot-ouidah-pythons',
  'spot-ouidah-porte',
];

const STATS = [
  { icon: MapPin, value: '100+', label: 'Lieux secrets' },
  { icon: Globe, value: '15+', label: 'Villes couvertes' },
  { icon: Users, value: '1000+', label: 'Explorateurs' },
  { icon: Star, value: '4.8', label: 'Note moyenne' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSpot }) => {
  const [heroIdx, setHeroIdx] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredSpots = FEATURED_SPOT_IDS.map((id) =>
    INITIAL_HIDDEN_SPOTS.find((s) => s.id === id)
  ).filter(Boolean) as HiddenSpot[];

  const categories = [
    {
      name: 'Plages & Littoral',
      emoji: '🏖️',
      desc: 'Eaux cristallines et criques secrètes le long de la côte atlantique.',
      tab: 'map',
    },
    {
      name: 'Patrimoine & Culture',
      emoji: '🏛️',
      desc: 'Temples vodoun, mémoires historiques et trésors architecturaux.',
      tab: 'map',
    },
    {
      name: 'Nature & Safari',
      emoji: '🦁',
      desc: 'Parcs nationaux, forêts sacrées et faune sauvage exceptionnelle.',
      tab: 'map',
    },
    {
      name: 'Gastronomie & Vie Nocturne',
      emoji: '🌙',
      desc: 'Restaurants cachés, clubs exclusifs et saveurs authentiques.',
      tab: 'map',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[2000ms]"
            style={{ opacity: heroIdx === i ? 1 : 0 }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/50 to-stone-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-[4px] uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Votre Guide Secret au Bénin</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Découvrez les{' '}
              <span className="text-amber-400">Lieux Cachés</span>{' '}
              du Bénin
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Plages secrètes, temples vodoun, villages sur pilotis, forêts sacrées… 
              Explorez le Bénin autrement avec des itinéraires uniques 
              générés par intelligence artificielle.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('map')}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm py-3.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Compass className="w-5 h-5" />
                Explorer les lieux secrets
              </button>
              <button
                onClick={() => onNavigate('ai')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-sm py-3.5 px-6 rounded-xl flex items-center gap-2 border border-white/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                Générer mon itinéraire IA
              </button>
            </div>
          </div>
        </div>

        {/* Slides dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                heroIdx === i ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-stone-900 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-800">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="py-6 px-4 text-center">
                <Icon className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-[11px] text-stone-400 font-medium uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold text-amber-600 tracking-[3px] uppercase">Explorez par thème</span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900">
              Quelle aventure vous appelle ?
            </h2>
            <p className="text-stone-500 text-sm max-w-lg mx-auto">
              Du littoral aux terres intérieures, chaque catégorie recèle des trésors méconnus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onNavigate(cat.tab)}
                className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 transition-all text-left space-y-3"
              >
                <span className="text-4xl block">{cat.emoji}</span>
                <h3 className="font-display font-bold text-stone-900 text-lg group-hover:text-amber-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed">{cat.desc}</p>
                <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold group-hover:gap-2 transition-all">
                  Découvrir <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SPOTS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-600 tracking-[3px] uppercase">Les incontournables</span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900">
                Pépites que vous ne ratez pas
              </h2>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="hidden sm:flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-bold text-xs transition-colors"
            >
              Voir tous les lieux <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSpots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => onOpenSpot(spot)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-200 text-left"
              >
                <img
                  src={spot.imageUrl}
                  alt={spot.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-amber-400 text-xs font-bold">{spot.rating}</span>
                    <span className="text-white/50 text-[10px] ml-auto flex items-center gap-0.5">
                      <Footprints className="w-3 h-3" />~{spot.estimatedDurationMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-white text-lg leading-tight group-hover:text-amber-300 transition-colors">
                    {spot.title}
                  </h3>
                  <p className="flex items-center gap-1 text-stone-300 text-[11px]">
                    <MapPin className="w-3 h-3 text-amber-500" /> {spot.city}
                  </p>
                  <p className="text-stone-400 text-[11px] line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <button
              onClick={() => onNavigate('map')}
              className="text-amber-700 font-bold text-xs flex items-center gap-1 mx-auto"
            >
              Voir tous les lieux <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-stone-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-bold text-amber-400 tracking-[3px] uppercase">Comment ça marche</span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
              Votre voyage en 3 étapes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: 'Explorez',
                desc: 'Parcourez notre carte interactive des lieux cachés ou laissez-vous surprendre par la grille de pépites.',
              },
              {
                icon: Sparkles,
                title: 'Planifiez',
                desc: 'Laissez notre IA générer un itinéraire personnalisé ou créez votre propre calendrier jour par jour.',
              },
              {
                icon: Ticket,
                title: 'Voyagez',
                desc: 'Recevez votre billet de voyage unique, imprimez-le et partez à la découverte du Bénin secret.',
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={title} className="relative text-center space-y-4 px-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <Icon className="w-8 h-8 text-amber-400" />
                </div>
                <div className="absolute top-0 right-1/2 translate-x-[calc(50%+40px)] -translate-y-2 text-6xl font-black text-stone-800 select-none pointer-events-none">
                  {idx + 1}
                </div>
                <h3 className="font-display font-bold text-xl text-white">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-950 leading-tight">
            Prêt à vivre l'aventure ?
          </h2>
          <p className="text-stone-900/70 text-sm max-w-lg mx-auto leading-relaxed">
            Contactez-nous pour un voyage sur-mesure, ou commencez dès maintenant à planifier votre escapade secrète.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm py-3.5 px-6 rounded-xl flex items-center gap-2 shadow-xl transition-all hover:scale-[1.02]"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              Nous contacter
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="bg-white/20 hover:bg-white/30 text-stone-950 font-bold text-sm py-3.5 px-6 rounded-xl flex items-center gap-2 backdrop-blur-sm border border-stone-950/10 transition-all hover:scale-[1.02]"
            >
              <ShieldCheck className="w-4 h-4" />
              Nos services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
