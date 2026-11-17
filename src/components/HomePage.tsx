import React from 'react';
import { INITIAL_HIDDEN_SPOTS } from '../data/hiddenSpots';
import { OptimizedImage } from './OptimizedImage';
import { SignatureExperiences } from './home/SignatureExperiences';
import { DestinationsSignature } from './home/DestinationsSignature';
import { CircuitsSection } from './home/CircuitsSection';
import { ExcursionsSection } from './home/ExcursionsSection';
import { PressSection } from './home/PressSection';
import { WhyUsSection } from './home/WhyUsSection';
import {
  Compass,
  ArrowRight,
  Star,
  Play,
  Leaf,
  Users,
  Crown,
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
  onNavigateToCity: (city: string) => void;
  /** Ouvre la fiche d'un lieu du catalogue à partir de son identifiant. */
  onOpenSpot: (spotId: string) => void;
}

// Grande Mosquée de Porto-Novo — photo GBETONGNINOUGBO Joseph Hervé Ahissou, CC BY-SA 4.0
const PORTO_NOVO_IMAGE = '/images/localized/porto-novo-mosquee.jpg';

/**
 * Plan drone de la plage Amazone à Cotonou, tourné par mataki klimtetou.
 * Vidéo libre Pexels (https://www.pexels.com/video/plage-amazone-17634881/).
 */
const HERO_VIDEO = '/videos/plage-amazone-cotonou.mp4';
const HERO_VIDEO_POSTER = '/videos/plage-amazone-cotonou-poster.jpg';

const CATEGORY_CARDS = [
  {
    key: 'plages',
    name: 'Plages & Littoral',
    desc: 'Eaux cristallines et criques secrètes',
    image: '/images/atlantic-beach.jpg',
  },
  {
    key: 'sites',
    name: 'Patrimoine & Culture',
    desc: 'Temples, forêts sacrées et mémoire',
    image: '/images/au-coeur-ouidah.jpg',
  },
  {
    key: 'restaurants',
    name: 'Gastronomie',
    desc: 'Saveurs authentiques et adresses cachées',
    image: '/images/petit-four.jpg',
  },
  {
    key: 'boites',
    name: 'Virée Nocturne',
    desc: 'Clubs et soirées exclusives',
    image: '/images/club-vip.jpg',
  },
  {
    key: 'hotels',
    name: 'Hébergements',
    desc: 'Du lodge en nature au luxe urbain',
    image: '/images/sofitel-marina.jpg',
  },
  {
    key: 'transports',
    name: 'Transport & Accès',
    desc: 'Gozem, Yango et transferts',
    image: '/images/benin-taxi.jpg',
  },
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
    text: 'Ganvié était le coup de cœur absolu. Merci pour ces pépites méconnues, on reviendra sans hésiter.',
    rating: 5,
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onNavigateToCategory,
  onNavigateToCity,
  onOpenSpot,
}) => {
  const [heroReady, setHeroReady] = React.useState(false);
  const heroVideoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // La vidéo reste immobile pour les visiteurs qui préfèrent réduire les animations.
  React.useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
    } else {
      void video.play().catch(() => {
        // Lecture automatique refusée par le navigateur : le poster reste affiché.
      });
    }
  }, []);

  /** Nombre de lieux référencés par ville, pour les cartes de destination. */
  const countsByCity = React.useMemo(() => {
    const counts: Record<string, number> = {};
    INITIAL_HIDDEN_SPOTS.forEach((spot) => {
      counts[spot.city] = (counts[spot.city] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen">

      {/* ═══════════════════════════════════════════════ HERO ═══ */}
      <section className="relative h-[100vh] min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={heroVideoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_VIDEO_POSTER}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
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
              Les lieux secrets du Bénin, racontés par ceux qui y vivent.
              <br className="hidden sm:block" />
              Des palais d'Abomey aux mangroves du Mono, on vous emmène
              <br className="hidden sm:block" />
              là où les guides ne s'arrêtent pas.
            </p>

            <div className={`flex flex-wrap items-center gap-4 pt-4 transition-all duration-1000 delay-[900ms] ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <button
                onClick={() => onNavigate('calendar')}
                className="group bg-[#D9A441] hover:bg-[#c89433] text-stone-950 font-semibold text-sm py-4 px-8 rounded-full flex items-center gap-3 transition-all hover:gap-4"
              >
                Concevoir mon voyage
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('map')}
                className="group flex items-center gap-3 text-white font-medium text-sm py-4 px-6 rounded-full hover:bg-white/5 transition-all"
              >
                <span className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center group-hover:border-white/70 transition-all">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </span>
                Explorer les lieux
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
        <a
          href="https://www.pexels.com/video/plage-amazone-17634881/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 z-10 hidden text-[9px] text-white/45 transition-colors hover:text-white/80 sm:block"
        >
          Vidéo drone : Plage Amazone, Cotonou · mataki klimtetou / Pexels
        </a>
      </section>

      {/* ═══════════════════════════════════════════════ MANIFESTE ═══ */}
      <section className="bg-[#F6F3EE] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl h-[420px] sm:h-[560px]">
                <OptimizedImage src="/images/localized/ambiance-beninoise-1f72ae.jpg" alt="Ambiance béninoise" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-4 sm:right-6 rounded-2xl bg-white shadow-xl shadow-stone-900/10 px-6 py-4 max-w-[220px]">
                <span className="block font-serif text-3xl text-[#11382E] leading-none">40</span>
                <span className="mt-1 block text-[11px] leading-snug text-stone-500">
                  villes et villages couverts par nos carnets de terrain
                </span>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">
                <span className="block text-[#11382E]">Un petit pays,</span>
                <span className="block text-[#D9A441] italic">de grandes histoires.</span>
              </h2>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                Du tumulte coloré de Cotonou aux silences de la Pendjari, le Bénin ne se visite pas :
                il se vit. Entre héritages royaux, spiritualité vivante et hospitalité sans détour,
                chaque rencontre laisse une empreinte.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Nous ne recopions pas de listes : chaque adresse est visitée, datée et corrigée par
                des habitants. C'est ce qui nous permet de vous envoyer ailleurs, vraiment.
              </p>
              <button onClick={() => onNavigate('services')} className="group flex items-center gap-2 text-[#11382E] font-medium hover:text-[#D9A441] transition-colors">
                Notre façon de voyager
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ EXPÉRIENCES ═══ */}
      <SignatureExperiences
        onOpenSpot={onOpenSpot}
        onExploreCity={onNavigateToCity}
        onNavigate={onNavigate}
      />

      {/* ═══════════════════════════════════════════════ DESTINATIONS ═══ */}
      <DestinationsSignature countsByCity={countsByCity} onExploreCity={onNavigateToCity} />

      {/* ═══════════════════════════════════════════════ CATÉGORIES ═══ */}
      <section className="bg-white py-16 sm:py-20 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#11382E]">Explorer par envie</h2>
            <p className="text-sm text-stone-500">296 lieux référencés, du maquis de quartier au lodge en brousse.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORY_CARDS.map((category) => (
              <button
                key={category.key}
                onClick={() => onNavigateToCategory(category.key)}
                className="group relative h-36 sm:h-40 overflow-hidden rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2"
              >
                <OptimizedImage
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <h3 className="text-[13px] font-semibold leading-tight text-white">{category.name}</h3>
                  <p className="mt-1 text-[10px] leading-snug text-white/60 line-clamp-2">{category.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ CIRCUITS ═══ */}
      <CircuitsSection onNavigate={onNavigate} />

      {/* ═══════════════════════════════════════════════ EXCURSIONS ═══ */}
      <ExcursionsSection onNavigate={onNavigate} />

      {/* ═══════════════════════════════════════════════ PRESSE ═══ */}
      <PressSection />

      {/* ═══════════════════════════════════════════════ RENCONTRE ═══ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="space-y-4">
                <span className="block text-[11px] font-semibold tracking-[0.35em] uppercase text-[#B07A1E]">
                  Sur le terrain
                </span>
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
            <div className="order-1 lg:order-2 relative">
              <div className="relative overflow-hidden rounded-3xl h-[460px] sm:h-[620px]">
                <OptimizedImage src="/images/localized/ambiance-et-rencontres-au-benin-8597ad.jpg" alt="Ambiance et rencontres au Bénin" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ ENGAGEMENTS ═══ */}
      <WhyUsSection onNavigate={onNavigate} />

      {/* ═══════════════════════════════════════════════ COMMENT ÇA MARCHE ═══ */}
      <section className="py-24 bg-stone-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/3 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-amber-400 tracking-[3px] uppercase">Comment ça marche</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white">
              Votre voyage en 3 étapes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            {[
              {
                icon: Compass,
                title: 'Explorez',
                desc: 'Parcourez notre catalogue de lieux secrets ou laissez-vous surprendre par les pépites cachées du Bénin.',
              },
              {
                icon: CalendarIcon,
                title: 'Planifiez',
                desc: 'Construisez votre séjour en quelques étapes, avec des circuits que l’on ajuste à votre rythme.',
              },
              {
                icon: Ticket,
                title: 'Voyagez',
                desc: 'Recevez votre carnet de voyage, imprimez-le et partez à la découverte du Bénin secret.',
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
                <h3 className="font-serif font-medium text-xl text-white">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ TÉMOIGNAGES ═══ */}
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
          <OptimizedImage src={PORTO_NOVO_IMAGE} alt="Le Bénin autrement" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b2b]/90 via-[#0b1b2b]/70 to-[#0b1b2b]/50" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-4 py-2 rounded-full border border-white/20">
            <Heart className="w-3.5 h-3.5 fill-[#D9A441] text-[#D9A441]" />
            <span className="tracking-[0.3em] uppercase">Explorer avec passion</span>
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
