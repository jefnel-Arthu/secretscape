import React from 'react';
import { HiddenSpot } from '../types';
import { INITIAL_HIDDEN_SPOTS } from '../data/hiddenSpots';
import { OptimizedImage } from './OptimizedImage';
import {
  Compass,
  MapPin,
  ArrowRight,
  Star,
  Play,
  Leaf,
  Users,
  Crown,
  Route,
  ArrowDown,
  Ticket,
  Quote,
  Heart,
  Phone,
  ShieldCheck,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onNavigateToCategory: (category: string) => void;
  onOpenSpot: (spot: HiddenSpot) => void;
}

const GANVIE_IMAGE = '/images/localized/ganvie-6b0090.jpg';
const COTONOU_IMAGE = '/images/localized/cotonou-5951af.jpg';
const OUIDAH_IMAGE = '/images/localized/ouidah-7f9923.jpg';
const GRAND_POPO_IMAGE = '/images/localized/grand-popo-3a6ca6.jpg';
// Grande Mosquée de Porto-Novo — photo GBETONGNINOUGBO Joseph Hervé Ahissou, CC BY-SA 4.0
const PORTO_NOVO_IMAGE = '/images/localized/porto-novo-mosquee.jpg';
const SAFARI_IMAGE = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2000&q=80';

/** Culture béninoise en fond du hero — défilement automatique toutes les 10 s. */
type HeroSlide = { src: string; alt: string; width: number };

const HERO_SLIDES: HeroSlide[] = [
  { src: GANVIE_IMAGE, alt: 'Village lacustre de Ganvié', width: 1600 },
  { src: '/images/vodun-days-2026.jpg', alt: 'Vodun Days à Ouidah', width: 1600 },
  { src: '/images/localized/event-festival-masques-4623dc.jpg', alt: 'Festival des Masques de Porto-Novo', width: 1280 },
  { src: '/images/localized/event-1er-aout-file-degan-gabin-motorized-parade-jpg-4a8da6.jpg', alt: 'Fête du 1er Août au Bénin', width: 1600 },
  { src: '/images/hero-festival-sica.jpg', alt: 'Festival SICA, arts et culture du Bénin', width: 1600 },
];

const replaceExt = (src: string, ext: string) => src.replace(/\.(jpe?g|png)$/i, ext);
const heroWebpSet = (slide: HeroSlide) =>
  `${replaceExt(slide.src, '-800.webp')} 800w, ${replaceExt(slide.src, '.webp')} ${slide.width}w`;
const heroJpegSet = (slide: HeroSlide) =>
  `${replaceExt(slide.src, '-800.jpg')} 800w, ${slide.src} ${slide.width}w`;

const HERO_INTERVAL_MS = 10000;

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
  {
    name: 'Thomas R.',
    from: 'Lyon, France',
    text: "Ouidah nous a profondément marqué. L'histoire, l'ambiance et l'accueil ont dépassé toutes nos attentes.",
    rating: 5,
  },
  {
    name: 'Aminata B.',
    from: 'Lomé, Togo',
    text: "Un site qui met vraiment en valeur le Bénin authentique. J'ai redécouvert mon propre pays sous un autre angle.",
    rating: 5,
  },
  {
    name: 'Lucas F.',
    from: 'Bruxelles, Belgique',
    text: "Ganvié était le coup de cœur absolu. Merci pour ces pépites méconnues, on reviendra sans hésiter.",
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
  const [heroIndex, setHeroIndex] = React.useState(0);
  // Diapositives déjà montées : on ne télécharge au départ que l'image courante
  // et la suivante, les autres arrivent au fil du défilement.
  const [mountedSlides, setMountedSlides] = React.useState<number[]>([0]);

  React.useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Défilement automatique des images de la culture béninoise.
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  // Monte la diapositive suivante quelques secondes après l'affichage courant :
  // elle a ainsi le temps de se télécharger avant la transition, sans retarder
  // le premier rendu.
  React.useEffect(() => {
    const nextIndex = (heroIndex + 1) % HERO_SLIDES.length;
    const timer = window.setTimeout(() => {
      setMountedSlides((prev) => (prev.includes(nextIndex) ? prev : [...prev, nextIndex].sort((a, b) => a - b)));
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [heroIndex]);

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
      <section className="relative h-[100vh] min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, index) =>
            mountedSlides.includes(index) ? (
              <OptimizedImage
                key={slide.src}
                src={slide.src}
                srcSet={heroJpegSet(slide)}
                webpSrcSet={heroWebpSet(slide)}
                sizes="100vw"
                alt={slide.alt}
                aria-hidden={index !== heroIndex}
                decoding="async"
                fetchPriority={index === 0 ? 'high' : 'low'}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-out ${
                  index === heroIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : null
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b2b]/70 via-[#0b1b2b]/45 to-[#0b1b2b]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b2b]/80 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-8">
            <div className={`transition-all duration-1000 delay-300 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <span className="text-[#D9A441] text-xs sm:text-sm tracking-[0.4em] uppercase font-medium">TERRE D'ÉMOTIONS ET DE RENCONTRES</span>
            </div>

            <div className={`transition-all duration-1000 delay-500 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-[90px] xl:text-[100px] leading-[0.9] tracking-tight">
                <span className="block text-white">Le Bénin,</span>
                <span className="block text-[#D9A441] italic">autrement.</span>
              </h1>
            </div>

            <p className={`text-white/80 text-base sm:text-lg leading-relaxed max-w-xl transition-all duration-1000 delay-700 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Vibrez au rythme d'une terre authentique,
              <br className="hidden sm:block" />
              entre héritages royaux, nature indomptée
              <br className="hidden sm:block" />
              et hospitalité inoubliable.
            </p>

            <div className={`flex flex-wrap items-center gap-4 pt-4 transition-all duration-1000 delay-[900ms] ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <button
                onClick={() => onNavigate('map')}
                className="group bg-[#D9A441] hover:bg-[#c89433] text-stone-950 font-semibold text-sm py-4 px-8 rounded-full flex items-center gap-3 transition-all hover:gap-4"
              >
                Explorer le Bénin
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('gallery')}
                className="group flex items-center gap-3 text-white font-medium text-sm py-4 px-6 rounded-full hover:bg-white/5 transition-all"
              >
                <span className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center group-hover:border-white/70 transition-all">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </span>
                Voir les incontournables
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <div className="flex flex-col items-center gap-1 text-white/40 animate-bounce">
            <span className="text-[9px] font-bold tracking-widest uppercase">Scroll</span>
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      <section className="bg-[#F6F3EE] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl h-[420px] sm:h-[560px]">
                <OptimizedImage src="/images/localized/ambiance-beninoise-1f72ae.jpg" alt="Ambiance béninoise" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">
                <span className="block text-[#11382E]">Un petit pays,</span>
                <span className="block text-[#D9A441] italic">de grandes histoires.</span>
              </h2>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                Du tumulte coloré de Cotonou aux silences majestueux de la Pendjari,
                le Bénin ne se visite pas : il se vit. Entre héritages royaux, spiritualité
                vivante et hospitalité légendaire, chaque rencontre laisse une empreinte.
              </p>
              <button onClick={() => onNavigate('map')} className="group flex items-center gap-2 text-[#11382E] font-medium hover:text-[#D9A441] transition-colors">
                Pourquoi choisir le Bénin ?
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 sm:mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">
              <span className="block text-[#11382E]">Choisissez votre</span>
              <span className="block">prochaine <span className="text-[#D9A441] italic">émotion</span>.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <button onClick={() => onNavigate('gallery')} className="lg:col-span-6 group relative overflow-hidden rounded-3xl h-[380px] sm:h-[460px] text-left">
              <OptimizedImage src="/images/localized/ganvie-5096cd.jpg" alt="Ganvié" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 space-y-2">
                <span className="text-xs tracking-[0.3em] uppercase text-white/70">VILLAGE LACUSTRE</span>
                <h3 className="font-serif text-4xl sm:text-5xl text-white">Ganvié</h3>
              </div>
            </button>
            <button onClick={() => onNavigate('gallery')} className="lg:col-span-6 group relative overflow-hidden rounded-3xl h-[380px] sm:h-[460px] text-left">
              <OptimizedImage src="/images/localized/cotonou-15460d.jpg" alt="Cotonou" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 space-y-2">
                <span className="text-xs tracking-[0.3em] uppercase text-white/70">VILLE VIBRANTE</span>
                <h3 className="font-serif text-4xl sm:text-5xl text-white">Cotonou</h3>
              </div>
            </button>
            <button onClick={() => onNavigate('gallery')} className="lg:col-span-4 group relative overflow-hidden rounded-3xl h-[340px] sm:h-[400px] text-left">
              <OptimizedImage src="/images/localized/ouidah-7f9923.jpg" alt="Ouidah" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 space-y-2">
                <span className="text-xs tracking-[0.3em] uppercase text-white/70">MÉMOIRE & SPIRITUALITÉ</span>
                <h3 className="font-serif text-3xl sm:text-4xl text-white">Ouidah</h3>
              </div>
            </button>
            <button onClick={() => onNavigate('gallery')} className="lg:col-span-4 group relative overflow-hidden rounded-3xl h-[340px] sm:h-[400px] text-left">
              <OptimizedImage src="/images/localized/grand-popo-3a6ca6.jpg" alt="Grand-Popo" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 space-y-2">
                <span className="text-xs tracking-[0.3em] uppercase text-white/70">OCÉAN & DOUCEUR</span>
                <h3 className="font-serif text-3xl sm:text-4xl text-white">Grand-Popo</h3>
              </div>
            </button>
            <button onClick={() => onNavigate('gallery')} className="lg:col-span-4 group relative overflow-hidden rounded-3xl h-[340px] sm:h-[400px] text-left">
              <OptimizedImage src={PORTO_NOVO_IMAGE} alt="Porto-Novo" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 space-y-2">
                <span className="text-xs tracking-[0.3em] uppercase text-white/70">HISTOIRE & TRADITIONS</span>
                <h3 className="font-serif text-3xl sm:text-4xl text-white">Porto-Novo</h3>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#F6F3EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl h-[520px] sm:h-[640px]">
                <OptimizedImage src="/images/localized/ambiance-et-rencontres-au-benin-8597ad.jpg" alt="Ambiance et rencontres au Bénin" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">
                  <span className="block text-[#11382E]">Plus qu'un voyage,</span>
                  <span className="block text-[#D9A441] italic">une rencontre.</span>
                </h2>
              </div>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed max-w-xl">
                Nous imaginons des aventures qui ont du sens, loin des itinéraires tout tracés et au plus proche de l'âme béninoise. Le Bénin se découvre par les échanges, les sourires et le partage.
              </p>
              <div className="grid sm:grid-cols-3 gap-8 pt-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#11382E]/5 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#11382E]" />
                  </div>
                  <h3 className="font-semibold text-[#11382E]">Culture & Histoire</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">Palais royaux, Route des Esclaves, traditions vivantes.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#11382E]/5 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-[#11382E]" />
                  </div>
                  <h3 className="font-semibold text-[#11382E]">Nature sauvage</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">Safari, mangroves, parcs naturels, paysages protégés.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#11382E]/5 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#11382E]" />
                  </div>
                  <h3 className="font-semibold text-[#11382E]">Rencontres locales</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">Des expériences guidées par celles et ceux qui vivent ici.</p>
                </div>
              </div>
              <button onClick={() => onNavigate('map')} className="bg-[#11382E] hover:bg-[#0e2d25] text-white font-medium text-sm py-4 px-8 rounded-full transition-all">
                Découvrir nos expériences
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage src="/images/localized/savane-du-parc-national-de-la-pendjari-390588.jpg" alt="Savane du Parc National de la Pendjari" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Des palais d'Abomey
              <br />
              aux terres <span className="italic text-[#D9A441]">sauvages.</span>
            </h2>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
              Un voyage complet à travers les trésors du Bénin : mémoire des royaumes,
              spiritualité, villages lacustres et safari dans le parc national de la Pendjari.
            </p>
            <div className="flex flex-wrap items-center gap-6 mb-10 text-white/70 text-sm">
              <span>10 jours / 9 nuits</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>À partir de 1490 €</span>
            </div>
            <button onClick={() => onNavigate('calendar')} className="bg-[#D9A441] hover:bg-[#c89433] text-stone-950 font-semibold text-sm py-4 px-10 rounded-full transition-all">
              Personnaliser ce circuit
            </button>
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
                desc: 'Construisez votre séjour en quelques étapes ou retrouvez votre carnet d’escapade jour par jour.',
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
            <span className="text-xs tracking-[0.4em] uppercase text-[#D9A441]">Témoignages</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#11382E]">
              Ils ont exploré le Bénin avec nous
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80" alt="Bénin autrement" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b2b]/90 via-[#0b1b2b]/70 to-[#0b1b2b]/50" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-4 py-2 rounded-full border border-white/20">
            <Heart className="w-3.5 h-3.5 fill-[#D9A441] text-[#D9A441]" />
            <span className="tracking-[0.3em] uppercase">EXPLOREZ AVEC PASSION</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
            <span className="block text-white">Prêt à vivre l'aventure ?</span>
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Contactez-nous pour un voyage sur-mesure, ou commencez dès maintenant à planifier votre escapade secrète.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#D9A441] hover:bg-[#c89433] text-stone-950 font-semibold text-sm py-4 px-8 rounded-full flex items-center gap-2.5 shadow-2xl transition-all hover:scale-[1.03]"
            >
              <Phone className="w-4 h-4" />
              Nous contacter
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="group flex items-center gap-3 text-white font-medium text-sm py-4 px-6 rounded-full hover:bg-white/5 transition-all"
            >
              <span className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center group-hover:border-white/70 transition-all">
                <ShieldCheck className="w-4 h-4" />
              </span>
              Nos services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
