import React from 'react';
import { HiddenSpot } from '../types';
import { INITIAL_HIDDEN_SPOTS, CATEGORY_LABELS } from '../data/hiddenSpots';
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
  Heart,
  Quote,
  ArrowDown,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onNavigateToCategory: (category: string) => void;
  onOpenSpot: (spot: HiddenSpot) => void;
}

const HERO_IMAGE = 'https://circuit-voyage.com/wp-content/uploads/2025/08/Decouvrir-les-plus-belles-plages-du-Benin-pour-vos-vacances-en-2025.jpg';

const CATEGORY_CARDS = [
  {
    key: 'plages',
    name: 'Plages & Littoral',
    desc: 'Eaux cristallines et criques secrètes',
    image: '/images/atlantic-beach.jpg',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    key: 'sites',
    name: 'Patrimoine & Culture',
    desc: 'Temples, forêts sacrées et mémoire',
    image: '/images/au-coeur-ouidah.jpg',
    color: 'from-amber-500 to-orange-600',
  },
  {
    key: 'restaurants',
    name: 'Gastronomie',
    desc: 'Saveurs authentiques et adresses cachées',
    image: '/images/petit-four.jpg',
    color: 'from-rose-500 to-pink-600',
  },
  {
    key: 'boites',
    name: 'Virée Nocturne',
    desc: 'Clubs et soirées exclusives',
    image: '/images/club-vip.jpg',
    color: 'from-violet-500 to-purple-600',
  },
  {
    key: 'hotels',
    name: 'Hébergements',
    desc: 'Du lodge en nature au luxe urbain',
    image: '/images/sofitel-marina.jpg',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    key: 'transports',
    name: 'Transport & Access',
    desc: 'Gozem & Yango, transferts',
    image: '/images/benin-taxi.jpg',
    color: 'from-yellow-500 to-amber-600',
  },
];

const DESTINATIONS = [
  { city: 'Cotonou', count: 45, image: '/images/benin-marina.jpg' },
  { city: 'Ouidah', count: 18, image: '/images/au-coeur-ouidah.jpg' },
  { city: 'Ganvié', count: 5, image: '/images/chez-raphael-ganvie.jpg' },
  { city: 'Grand-Popo', count: 8, image: '/images/babs-dock.jpg' },
  { city: 'Abomey', count: 6, image: '/images/village-kirikou.jpg' },
  { city: 'Porto-Novo', count: 10, image: '/images/majestic-cinema.jpg' },
];

const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    from: 'Paris, France',
    text: 'Un voyage magique. Les lieux proposés sont incroyables, on ne les trouverait jamais tout seul. Le guide local était parfait.',
    rating: 5,
  },
  {
    name: 'Kofi A.',
    from: 'Abuja, Nigeria',
    text: "The secret spots were unbelievable. From Ganvié to the Pendjari, every day was a new adventure. Highly recommended!",
    rating: 5,
  },
  {
    name: 'Marie-Claire D.',
    from: 'Montréal, Canada',
    text: "Le billet de voyage est une super idée. On l'a imprimé, c'était notre compagnon de route. Le Bénin est un trésor caché.",
    rating: 5,
  },
];

const FEATURED_SPOT_IDS = [
  'spot-ganvie-1',
  'spot-pendjari-1',
  'spot-ouidah-pythons',
  'spot-ouidah-porte',
  'spot-tanougou-cascade',
  'spot-abomey-1',
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onNavigateToCategory, onOpenSpot }) => {
  const [heroReady, setHeroReady] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const featuredSpots = FEATURED_SPOT_IDS.map((id) =>
    INITIAL_HIDDEN_SPOTS.find((s) => s.id === id)
  ).filter(Boolean) as HiddenSpot[];

  const spotCountsByCategory = React.useMemo(() => {
    const counts: Record<string, number> = {};
    INITIAL_HIDDEN_SPOTS.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen">

      {/* ═══════════════════════════════════════════════ HERO ═══ */}
      <section className="relative h-[85vh] min-h-[650px] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
          <div className="max-w-3xl space-y-8">
            {/* Tag */}
            <div
              className={`transition-all duration-1000 delay-300 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <span className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold tracking-[4px] uppercase bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                SecretScape — Bénin
              </span>
            </div>

            {/* Title */}
            <div className={`space-y-1 transition-all duration-1000 delay-500 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                Voyagez Au Cœur
              </h1>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black text-amber-400 leading-[1.05] tracking-tight">
                des Secrets
              </h1>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                du Bénin
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className={`text-stone-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl transition-all duration-1000 delay-700 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              Partez à la découverte des merveilles méconnues du Bénin, avec des itinéraires pensés pour vous.
            </p>

            {/* CTA */}
            <div className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-1000 delay-[900ms] ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <button
                onClick={() => onNavigate('map')}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm py-4 px-8 rounded-2xl flex items-center gap-2.5 shadow-2xl shadow-amber-500/30 transition-all hover:scale-[1.03] active:scale-95"
              >
                <Compass className="w-5 h-5" />
                Explorer maintenant
              </button>
              <button
                onClick={() => onNavigate('calendar')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm py-4 px-8 rounded-2xl flex items-center gap-2.5 border border-white/20 transition-all hover:scale-[1.03] active:scale-95"
              >
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                Planifier mon voyage
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <div className="flex flex-col items-center gap-1 text-white/30 animate-bounce">
            <span className="text-[9px] font-bold tracking-widest uppercase">Scroll</span>
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ STATS ═══ */}
      <section className="relative -mt-16 z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900/95 backdrop-blur-xl rounded-3xl border border-stone-800 shadow-2xl shadow-stone-900/50 p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: MapPin, value: `${INITIAL_HIDDEN_SPOTS.length}+`, label: 'Lieux secrets', gradient: 'from-amber-500 to-orange-500' },
              { icon: Globe, value: '15+', label: 'Villes couvertes', gradient: 'from-cyan-500 to-blue-500' },
              { icon: Users, value: '1000+', label: 'Explorateurs', gradient: 'from-emerald-500 to-teal-500' },
              { icon: Star, value: '4.8', label: 'Note moyenne', gradient: 'from-yellow-500 to-amber-500' },
            ].map(({ icon: Icon, value, label, gradient }) => (
              <div key={label} className="text-center space-y-2">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ CATEGORIES ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-4">
            <span className="text-xs font-bold text-amber-600 tracking-[3px] uppercase">Explorez par thème</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 leading-tight">
              Quelle aventure vous appelle ?
            </h2>
            <p className="text-stone-500 text-sm max-w-lg mx-auto leading-relaxed">
              Du littoral aux terres intérieures, chaque catégorie recèle des trésors méconnus.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORY_CARDS.map((cat) => (
              <button
                key={cat.key}
                onClick={() => onNavigateToCategory(cat.key)}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-stone-200 text-left"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
                  <h3 className="font-display font-bold text-white text-sm leading-tight">{cat.name}</h3>
                  <p className="text-white/70 text-[10px] leading-snug">{cat.desc}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-white/60 text-[10px] font-semibold">
                      {spotCountsByCategory[cat.key] || 0} lieux
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ FEATURED SPOTS ═══ */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-600 tracking-[3px] uppercase">Les incontournables</span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900">
                Pepites que vous ne ratez pas
              </h2>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="hidden sm:flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-bold text-xs bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors"
            >
              Voir tous les lieux <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => onOpenSpot(spot)}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-stone-200 text-left shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={spot.imageUrl}
                  alt={spot.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-600/10 group-hover:from-amber-500/10 transition-all duration-500" />

                {/* Rating badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-stone-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-bold">{spot.rating}</span>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/10">
                    {CATEGORY_LABELS[spot.category]?.name || spot.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  <div className="flex items-center gap-3 text-white/60 text-[11px]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" /> {spot.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Footprints className="w-3 h-3" /> ~{spot.estimatedDurationMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-white text-xl leading-tight group-hover:text-amber-300 transition-colors">
                    {spot.title}
                  </h3>
                  <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <button
              onClick={() => onNavigate('map')}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm py-3 px-6 rounded-xl inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/25"
            >
              Voir tous les lieux <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ DESTINATIONS ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-bold text-amber-600 tracking-[3px] uppercase">Destinations</span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900">
              Explorez par ville
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.city}
                onClick={() => onNavigate('map')}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-stone-200 text-left"
              >
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent group-hover:from-stone-950/60 transition-colors" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display font-bold text-white text-base">{dest.city}</h3>
                  <span className="text-white/60 text-[11px] font-medium">{dest.count} lieux</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ HOW IT WORKS ═══ */}
      <section className="py-24 bg-stone-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/3 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-amber-400 tracking-[3px] uppercase">Comment ca marche</span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
              Votre voyage en 3 etapes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            {[
              {
                icon: Compass,
                title: 'Explorez',
                desc: 'Parcourez notre catalogue de lieux secrets ou laissez-vous surprendre par les pepites cachees du Benin.',
              },
              {
                icon: CalendarIcon,
                title: 'Planifiez',
                desc: 'Organisez votre propre calendrier jour par jour ou partagez vos envies avec notre equipe.',
              },
              {
                icon: Ticket,
                title: 'Voyagez',
                desc: 'Recevez votre billet de voyage unique, imprimez-le et partez a la decouverte du Benin secret.',
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={title} className="relative text-center space-y-5 px-4">
                {/* Step number */}
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl rotate-6 opacity-20" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 border border-amber-500/30 flex items-center justify-center shadow-xl shadow-amber-500/10">
                    <Icon className="w-9 h-9 text-amber-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shadow-lg shadow-amber-500/30">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-white">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ TESTIMONIALS ═══ */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-bold text-amber-600 tracking-[3px] uppercase">Temoignages</span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900">
              Ils ont explore le Benin avec nous
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-lg transition-shadow space-y-4"
              >
                <Quote className="w-8 h-8 text-amber-200" />
                <p className="text-stone-600 text-sm leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-100">
                  <span className="font-bold text-stone-900 text-sm block">{t.name}</span>
                  <span className="text-stone-400 text-xs">{t.from}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ CTA ═══ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500" />
        <div className="absolute inset-0 bg-[url('https://circuit-voyage.com/wp-content/uploads/2025/08/Decouvrir-les-plus-belles-plages-du-Benin-pour-vos-vacances-en-2025.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-stone-950 text-xs font-bold px-4 py-2 rounded-full border border-white/20">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Explorez avec passion</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 leading-tight">
            Pret a vivre l'aventure ?
          </h2>
          <p className="text-stone-900/70 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Contactez-nous pour un voyage sur-mesure, ou commencez des maintenant a planifier votre escapade secrete.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm py-4 px-8 rounded-2xl flex items-center gap-2.5 shadow-2xl transition-all hover:scale-[1.03]"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              Nous contacter
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="bg-white/20 hover:bg-white/30 text-stone-950 font-bold text-sm py-4 px-8 rounded-2xl flex items-center gap-2.5 backdrop-blur-sm border border-stone-950/10 transition-all hover:scale-[1.03]"
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
