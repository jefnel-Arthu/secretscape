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
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUiL0VT6_9AyVeoWMGBHOOJd4e_YXUHiVm7B0teNKG55wvkLg2h9X9Qii9&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZDtuVNM24IhrCgkSIvNjtKntH_4CpEp16gH21Bg1K6g&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIhc0FSDjS1sdhUhKHuhiZOiJu2k6DeeOP5UrQ62eEag&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0spb_mvq7qANIc4ua-hwV3EfeDSkQeqNQhtF_EP7BoQ&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgygKquIcSiAJGbxLouqmmScEFN7GFKe8oXVzuuo2VbQ&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSujBtT9ft5xXAjNSIZLXIVF85H6hmaHevcgQ8ywe0a1w&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3OzWLRvS1xpgWAwUQjy_lk2rpuoO7nt0KQOdtHcF6Yw&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkeZVXVzS6GDXoY6luQsy9KhOv3WaynnyVy4Yn-jVUVw&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ2kA8hb45POp9fgJ88alLTCZQJ9il_OHPtoSEAtkxFw&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUMFifQOrpiYSC5QGqGi8fjrE5cXlRcnfzJJ4bYH2rJg&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY5Dyq2mWS5fXIFItyhdN8rnXOnM3fyjOUOgS06KlfCg&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqhbdyHV7U2fq7gym13l1GH17h2p8M-lmbfoa5XVLAA&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6SH1Oy1MqxgrDb9SAfxehJHM0U7l8UFWYZdFbIYBGQg&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Fj-JvKrNpGV9NRbIcve7gpchhwkf1c8P3__boXXLtg&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScXC_olFhO2ykDFDtnHN_H96WW1SYyzZzkEUaBcWi8Ww&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlp7Ri6QDBTQSfHCoTaCzOdCR_XVpbkVqXYU-Q-DzqMGfbln6nUKoJIFc&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9aRWVHUH1tUnFMSX3AzgnbEel6YRFy2LQqjiOcs2WFg&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMgiObMnh8ExGdrfWodcXYR1ROEqeqIDRp0H9yzoq44A&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcLtDVtTn7Oj-cVHIj6WDMxmzUHZf1bcLhmB6_dhzk6A&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZQfSgef5nqAg4xkd6nLkozXSQVvWQb2mVQPxX-1eUUQ&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgB3by-YXGunyLjdJ1C8t9YDgxcWe3bhgJIbOCseGbHg&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6pxA2pt_HoSoFrpLUdw5DCCkg8arlVgZrLCmBYz93vw&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTKdjj318nhzom_fcQz9f0ECfutWcC2iNBqa6VSVoXuA&s=10',
      'https://i.la-croix.com/x/smart/2017/01/12/1200816708/festival-Vaudou-Ouidah-10-janvier-2016-AFP-PHOTO-STEFAN-HEUNIS_0.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxbFzsCujCN5uxDlfyPC5NXkHGfU7lwvtMZct_SuZhFw&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT37KEbKzqlXcHT660Otpe9c_WaHdAIw-mAF4fduCh9aw&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxYPc4PweXTfEmNh1smY-0AjhGkBV5B4eLzHD2pAzc8A&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTPnl4aNqu7wDiZ6h8KR2Pg4C6rBH68OoRCqn6vI9sKb9zuvXGuijLi5Q&s=10',
      'https://gdb.voanews.com/01000000-0aff-0242-15fd-08dc008ed3e2_w1080_h608_s.jpeg',
      'https://cdn.synaps.media/yeclo/content/images/size/w1000/format/webp/www-yeclo-com/wp-content/uploads/2022/01/benin-mami-wata.jpg',
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
  {
    id: 'event-finnab',
    name: 'FInAB',
    category: 'musique',
    date: 'Février - Mars',
    period: 'Annuel',
    location: 'Cotonou — Palais des Congrès',
    description: 'Le Festival International des Arts du Bénin, créé en 2023 par Groupe Empire. Multidisciplinaire : musique, cinéma, mode, arts plastiques, danse et théâtre. Le Tokp\'Art rassemble 500+ exposants dans une ambiance festive panafricaine.',
    highlights: ['500+ exposants au Tokp\'Art', 'Masterclasses & concerts live', 'Artistes de 10+ pays', 'Cinéma & défilés de mode'],
    image: 'https://matinlibre.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-23-at-23.22.40.jpeg',
    images: ['https://matinlibre.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-23-at-23.22.40.jpeg'],
    emoji: '🎨',
  },
  {
    id: 'event-chill-groove',
    name: 'Chill & Groove',
    category: 'musique',
    date: 'Décembre',
    period: 'Annuel',
    location: 'Cotonou — Palais des Congrès',
    description: 'Festival lifestyle créé par Vitalor célébrant la culture béninoise à travers musique, street food et divertissement. 72h de shows non-stop, 50+ restaurants et bars, DJ sets locaux et internationaux.',
    highlights: ['50+ restaurants & bars', 'DJ sets internationaux', 'Zones VR & dance battles', 'Good Vibes Only'],
    image: 'https://critikmag.com/wp-content/uploads/2024/12/chill-and-groove-un-festival-de-plus-dans-le-divertissement-a-cotonou-critikmag-e1734088860893.jpg',
    images: [
      'https://critikmag.com/wp-content/uploads/2024/12/chill-and-groove-un-festival-de-plus-dans-le-divertissement-a-cotonou-critikmag-e1734088860893.jpg',
      'https://chillandgroovefestival.com/wp-content/uploads/2026/07/Image-de-reference-1024x538.png',
    ],
    emoji: '🎧',
  },
  {
    id: 'event-1er-aout',
    name: '1er Août',
    category: 'traditions',
    date: '1er août',
    period: 'Annuel',
    location: 'Cotonou — Boulevard de la Marina',
    description: 'La Fête Nationale du Bénin commémorant l\'indépendance du 1er août 1960. Cérémonie officielle avec dépôt de gerbe au Monument aux Dévoués, défilé militaire et paramilitaire de 30+ pelotons, performances culturelles et participation de la communauté internationale.',
    highlights: ['Défilé militaire & paramilitaire', 'Dépôt de gerbe au Monument', 'Performances culturelles', 'Cérémonie présidentielle'],
    image: 'https://www.afrik.com/wp-content/uploads/2026/08/depot-de-gerbe-a-la-place-du-monument-aux-devoues-de-la-nation-696x522.webp',
    images: [
      'https://www.afrik.com/wp-content/uploads/2026/08/depot-de-gerbe-a-la-place-du-monument-aux-devoues-de-la-nation-696x522.webp',
      'https://www.afrik.com/wp-content/uploads/2026/08/romuald-wadagni-president-de-la-republique-du-benin-696x392.webp',
    ],
    emoji: '🇧🇯',
  },
];

interface EventPhoto {
  id: string;
  eventId: string;
  src: string;
  eventName: string;
  emoji: string;
  category: EventCategory;
  date: string;
  location: string;
}

const ALL_PHOTOS: EventPhoto[] = BENIN_EVENTS.flatMap((ev) => {
  const photos = ev.images.length > 0 ? ev.images : (ev.image ? [ev.image] : []);
  return photos.map((src, i) => ({
    id: `${ev.id}-${i}`,
    eventId: ev.id,
    src,
    eventName: ev.name,
    emoji: ev.emoji,
    category: ev.category,
    date: ev.date,
    location: ev.location,
  }));
});

export const GalleryView: React.FC<GalleryViewProps> = () => {
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (activeEventId === null ? ALL_PHOTOS : ALL_PHOTOS.filter((p) => p.eventId === activeEventId)),
    [activeEventId]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex === null, filtered.length]);

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;
  const activeEv = current ? BENIN_EVENTS.find((e) => e.id === current.eventId) : null;

  return (
    <div className="bg-stone-950 min-h-full">
      {/* Header */}
      <div className="relative py-14 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 via-transparent to-stone-950" />
        <Flame className="w-10 h-10 text-amber-400 mx-auto mb-4" />
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
          Galerie <span className="text-amber-400">du Bénin</span>
        </h1>
        <p className="text-stone-400 text-sm max-w-lg mx-auto">
          Vodun Days, WeLovEya, FestiChill, festivals, fêtes traditionnelles… Toutes les photos des événements qui font vibrer le Bénin.
        </p>

        {/* Event filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => { setActiveEventId(null); setLightboxIndex(null); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeEventId === null
                ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Tout
            {activeEventId === null && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">{filtered.length}</span>
            )}
          </button>
          {BENIN_EVENTS.map((ev) => {
            const count = ALL_PHOTOS.filter((p) => p.eventId === ev.id).length;
            return (
              <button
                key={ev.id}
                onClick={() => { setActiveEventId(ev.id); setLightboxIndex(null); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeEventId === ev.id
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {ev.emoji}
                {ev.name}
                <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo grid — all photos visible at once */}
      {filtered.length === 0 ? (
        <div className="pb-24 text-center">
          <Images className="w-12 h-12 text-stone-700 mx-auto mb-3" />
          <p className="text-stone-500 text-sm">Aucune photo dans cette catégorie.</p>
        </div>
      ) : (
        <div className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            {filtered.map((p, i) => {
              const meta = CATEGORY_META[p.category];
              return (
                <button
                  key={p.id}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative w-full mb-4 break-inside-avoid rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 text-left hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5"
                >
                  <img
                    src={p.src}
                    alt={p.eventName}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                  <span className={`absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-white/95 ${meta.color}`}>
                    <meta.icon className="w-3 h-3" />
                    {meta.label}
                  </span>

                  <div className="absolute bottom-0 inset-x-0 p-3 text-left pointer-events-none">
                    <p className="font-display text-white font-bold text-sm leading-tight">
                      {p.emoji} {p.eventName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-stone-300 text-[10px]">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-amber-400" />
                        {p.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {p.location}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox — single photo view with navigation */}
      {current && (() => {
        const SelMeta = CATEGORY_META[current.category];
        const goPrev = () => setLightboxIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
        const goNext = () => setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length));
        return (
        <div className="fixed inset-0 z-[900] flex flex-col bg-black/95" onClick={() => setLightboxIndex(null)}>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 ${SelMeta.color}`}>
                <SelMeta.icon className="w-3 h-3" />
                {SelMeta.label}
              </span>
              <p className="text-white font-bold text-sm truncate">{current.emoji} {current.eventName}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-stone-400 text-xs font-bold">
                {lightboxIndex! + 1} / {filtered.length}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 sm:px-16 min-h-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={goPrev}
              className="absolute left-3 sm:left-5 p-2.5 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-stone-950 transition-colors"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={current.src}
              alt={current.eventName}
              className="max-h-[70vh] max-w-full object-contain rounded-2xl"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />

            <button
              onClick={goNext}
              className="absolute right-3 sm:right-5 p-2.5 rounded-full bg-black/50 hover:bg-amber-500 text-white hover:text-stone-950 transition-colors"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-5" onClick={(e) => e.stopPropagation()}>
            <span className="flex items-center gap-2 text-sm text-stone-300">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              {activeEv ? activeEv.date : current.date}
            </span>
            <span className="flex items-center gap-2 text-sm text-stone-300">
              <MapPin className="w-4 h-4 text-amber-400" />
              {current.location}
            </span>
            {activeEv && (
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(activeEv.name + ' Bénin ' + activeEv.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold py-2 px-5 rounded-full transition-colors"
              >
                <Eye className="w-4 h-4" />
                En savoir plus
              </a>
            )}
          </div>
        </div>
        );
      })()}
    </div>
  );
};