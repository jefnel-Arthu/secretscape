import React, { useState } from 'react';
import { ConciergeBell, Car, BedDouble, Ship, Utensils, CalendarDays, Phone, MapPin, ArrowRight, CheckCircle, X, ShieldCheck, Star, Sparkles } from 'lucide-react';

interface ServiceDetail {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  includes: string[];
  cities: string;
  gradient: {
    from: string;
    via: string;
    to: string;
    accent: string;
    bg: string;
    ring: string;
    bar: string;
    iconBg: string;
    iconText: string;
    hoverBorder: string;
    headerFrom: string;
    headerTo: string;
    badge: string;
  };
}

const SERVICES: ServiceDetail[] = [
  {
    icon: <ConciergeBell className="w-6 h-6" />,
    title: 'Guides touristiques',
    subtitle: 'Des locaux passionnés à votre service',
    description: 'Nos guides locaux connaissent chaque recoin du Bénin et vous font découvrir les pépites cachées, hors des sentiers battus. Circuits culturels, historiques, nature ou spiritualité : chacun est adapté à vos envies.',
    includes: [
      'Guide francophone et anglophone',
      'Circuits personnalisés selon vos intérêts',
      'Visites guidées : Ouidah, Ganvié, Abomey, Pendjari, Grand-Popo…',
      'Transfert inclus possible',
      'Disponible pour demi-journée ou journée complète',
    ],
    cities: 'Cotonou, Ouidah, Abomey, Ganvié, Grand-Popo, Natitingou, Parc Pendjari',
    gradient: {
      from: 'from-amber-400',
      via: 'via-orange-400',
      to: 'to-orange-500',
      accent: 'text-amber-600',
      bg: 'bg-amber-50',
      ring: 'ring-amber-200',
      bar: 'from-amber-400 to-orange-500',
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      iconText: 'text-white',
      hoverBorder: 'hover:border-amber-400',
      headerFrom: 'from-amber-500',
      headerTo: 'to-orange-600',
      badge: 'bg-amber-100 text-amber-700',
    },
  },
  {
    icon: <Car className="w-6 h-6" />,
    title: 'Transport & Transferts',
    subtitle: 'Déplacements en toute sécurité',
    description: 'Gozem et Yango pour tous vos déplacements au Bénin. Réservez directement depuis l\'application pour des trajets rapides et sûrs, en ville comme entre villes.',
    includes: [
      'Gozem (moto VTC) — course rapide en ville',
      'Yango (voiture VTC) — confort et sécurité',
      'Déplacements inter-villes : Cotonou ↔ Ouidah, Abomey, Grand-Popo…',
    ],
    cities: 'Partout au Bénin',
    gradient: {
      from: 'from-cyan-400',
      via: 'via-blue-400',
      to: 'to-blue-500',
      accent: 'text-cyan-600',
      bg: 'bg-cyan-50',
      ring: 'ring-cyan-200',
      bar: 'from-cyan-400 to-blue-500',
      iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
      iconText: 'text-white',
      hoverBorder: 'hover:border-cyan-400',
      headerFrom: 'from-cyan-500',
      headerTo: 'to-blue-600',
      badge: 'bg-cyan-100 text-cyan-700',
    },
  },
  {
    icon: <BedDouble className="w-6 h-6" />,
    title: 'Hébergements & Hôtels',
    subtitle: 'Le meilleur du confort selon votre budget',
    description: 'Réservation de chambres, hôtels de luxe, écolodges en pleine nature ou hébergement chez l\'habitant. Nous négocions les meilleurs tarifs pour vous, selon votre budget et vos préférences.',
    includes: [
      'Hôtels 3, 4 et 5 étoiles à Cotonou et en région',
      'Écolodges et lodges en pleine nature',
      'Hébergement chez l\'habitant authentique',
      'Petits-déjeuners inclus possibles',
      'Conseils personnalisés selon votre style de voyage',
    ],
    cities: 'Cotonou, Ouidah, Abomey, Grand-Popo, Natitingou, Sèmè-Podji',
    gradient: {
      from: 'from-violet-400',
      via: 'via-purple-400',
      to: 'to-purple-500',
      accent: 'text-violet-600',
      bg: 'bg-violet-50',
      ring: 'ring-violet-200',
      bar: 'from-violet-400 to-purple-500',
      iconBg: 'bg-gradient-to-br from-violet-400 to-purple-500',
      iconText: 'text-white',
      hoverBorder: 'hover:border-violet-400',
      headerFrom: 'from-violet-500',
      headerTo: 'to-purple-600',
      badge: 'bg-violet-100 text-violet-700',
    },
  },
  {
    icon: <Ship className="w-6 h-6" />,
    title: 'Excursions & Circuits',
    subtitle: 'Explorez chaque région du Bénin',
    description: 'Des circuits clés en main ou sur mesure pour explorer les merveilles du Bénin : villages lacustres de Ganvié, parcs animaliers de la Pendjari, Route des Esclaves à Ouidah, palais royaux d\'Abomey…',
    includes: [
      'Circuits de 1 jour à 2 semaines',
      'Excursion Ganvié en pirogue',
      'Safari dans le Parc de la Pendjari',
      'Circuit culturel Route des Esclaves',
      'Circuit complet Nord du Bénin (Tata Somba, Natitingou)',
    ],
    cities: 'Ganvié, Pendjari, Ouidah, Abomey, Grand-Popo, Natitingou, Boukoumbé',
    gradient: {
      from: 'from-emerald-400',
      via: 'via-teal-400',
      to: 'to-teal-500',
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-200',
      bar: 'from-emerald-400 to-teal-500',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      iconText: 'text-white',
      hoverBorder: 'hover:border-emerald-400',
      headerFrom: 'from-emerald-500',
      headerTo: 'to-teal-600',
      badge: 'bg-emerald-100 text-emerald-700',
    },
  },
  {
    icon: <Utensils className="w-6 h-6" />,
    title: 'Restaurants & Gastronomie',
    subtitle: 'Goûtez à la vraie cuisine béninoise',
    description: 'Tables typiques, restaurants de plage, adresses gourmandes cachées : nous vous guidons vers les meilleures expériences culinaires du Bénin. Poisson braisé, frites d\'algues, ablo, kuli-kuli et bien plus.',
    includes: [
      'Adresses testées et approuvées',
      'Restaurants de plage et terrasses',
      'Spécialités régionales',
      'Brasseries et bars à cocktails',
      'Restaurants internationaux et asiatiques à Cotonou',
    ],
    cities: 'Cotonou, Ouidah, Grand-Popo, Porto-Novo, Abomey',
    gradient: {
      from: 'from-rose-400',
      via: 'via-pink-400',
      to: 'to-pink-500',
      accent: 'text-rose-600',
      bg: 'bg-rose-50',
      ring: 'ring-rose-200',
      bar: 'from-rose-400 to-pink-500',
      iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500',
      iconText: 'text-white',
      hoverBorder: 'hover:border-rose-400',
      headerFrom: 'from-rose-500',
      headerTo: 'to-pink-600',
      badge: 'bg-rose-100 text-rose-700',
    },
  },
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: 'Événements & Groupes',
    subtitle: 'Organisation sur mesure',
    description: 'Organisation de sorties en groupe, séminaires d\'entreprise, anniversaires, voyages scolaires et visites privées entièrement personnalisées. Nous gérons tout de A à Z.',
    includes: [
      'Séminaires et team building',
      'Anniversaires et célébrations privées',
      'Voyages scolaires et universitaires',
      'Groupes touristiques et DMC',
      'Événements culturels et corporate',
    ],
    cities: 'Toutes les régions du Bénin',
    gradient: {
      from: 'from-amber-400',
      via: 'via-yellow-400',
      to: 'to-yellow-500',
      accent: 'text-amber-600',
      bg: 'bg-amber-50',
      ring: 'ring-amber-200',
      bar: 'from-amber-400 to-yellow-500',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
      iconText: 'text-white',
      hoverBorder: 'hover:border-amber-400',
      headerFrom: 'from-amber-500',
      headerTo: 'to-yellow-600',
      badge: 'bg-amber-100 text-amber-700',
    },
  },
];

const BADGES = [
  { icon: <ShieldCheck className="w-4 h-4" />, label: 'Service vérifié' },
  { icon: <Star className="w-4 h-4" />, label: 'Sur mesure' },
  { icon: <MapPin className="w-4 h-4" />, label: 'Partout au Bénin' },
];

interface ServicesViewProps {
  onNavigateToContact: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigateToContact }) => {
  const [selected, setSelected] = useState<ServiceDetail | null>(null);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-b-3xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 ring-1 ring-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tous nos services</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
            Votre voyage, notre expertise
          </h1>
          <p className="text-stone-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Du transfert aéroport à l'excursion sur mesure, nous couvrons chaque aspect de votre séjour au Bénin avec soin et professionnalisme.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BADGES.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 bg-white/5 text-stone-300 text-xs font-medium px-4 py-2 rounded-full ring-1 ring-white/10 backdrop-blur-sm"
              >
                <span className="text-amber-400">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <button
              key={service.title}
              onClick={() => setSelected(service)}
              className={`group relative bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left ${service.gradient.hoverBorder}`}
            >
              <div className={`h-1.5 bg-gradient-to-r ${service.gradient.bar}`} />

              <div className="p-6">
                <div className={`w-12 h-12 rounded-2xl ${service.gradient.iconBg} ${service.gradient.iconText} flex items-center justify-center mb-4 shadow-lg shadow-stone-200 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                <h3 className="font-display font-bold text-base text-stone-900 mb-1.5">
                  {service.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed mb-4">
                  {service.subtitle}
                </p>

                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${service.gradient.accent} group-hover:gap-2 transition-all duration-300`}>
                  En savoir plus <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 z-[600] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`relative bg-gradient-to-r ${selected.gradient.headerFrom} ${selected.gradient.headerTo} p-6 rounded-t-3xl`}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                </div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center ring-1 ring-white/30">
                      {selected.icon}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg text-white">{selected.title}</h2>
                      <p className="text-xs text-white/70">{selected.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <p className="text-sm text-stone-600 leading-relaxed">{selected.description}</p>

                <div>
                  <h3 className="font-display font-bold text-sm text-stone-900 mb-3">Ce qui est inclus :</h3>
                  <ul className="space-y-2.5">
                    {selected.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs text-stone-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`rounded-2xl p-4 flex items-start gap-3 ring-1 ${selected.gradient.ring} ${selected.gradient.bg}`}>
                  <MapPin className={`w-4 h-4 ${selected.gradient.accent} shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-xs font-semibold text-stone-700">Zones desservies</p>
                    <p className="text-xs text-stone-500 mt-0.5">{selected.cities}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => { setSelected(null); onNavigateToContact(); }}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-5 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors flex-1"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Nous contacter</span>
                  </button>
                  <a
                    href="tel:+2290191722907"
                    className="bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold px-5 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors flex-1"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Appeler maintenant</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div className="bg-stone-900 rounded-3xl text-stone-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg">Besoin d'un accompagnement sur mesure ?</h2>
            <p className="text-stone-400 text-xs mt-1">
              Renseignez-nous vos informations et nous vous recontactons au plus vite.
            </p>
          </div>
          <button
            onClick={onNavigateToContact}
            className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-5 py-3 rounded-xl text-sm flex items-center gap-2 transition-colors shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span>Nous contacter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-stone-400 text-xs">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span>Bénin — Cotonou, Ouidah, Abomey, Grand-Popo et plus encore.</span>
        </div>
      </div>
    </div>
  );
};
