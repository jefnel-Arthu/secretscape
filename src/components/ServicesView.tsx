import React, { useState } from 'react';
import {
  ConciergeBell, Car, BedDouble, Ship, Utensils, CalendarDays, Phone, MapPin, ArrowRight, CheckCircle, X
} from 'lucide-react';

interface ServiceDetail {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  includes: string[];
  cities: string;
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
  },
  {
    icon: <Car className="w-6 h-6" />,
    title: 'Transport & Transferts',
    subtitle: 'Déplacements en toute sécurité',
    description: 'Zémidjan, taxi partagé, voiture avec chauffeur ou minibus de groupe : nous organisons tous vos déplacements au Bénin. Transferts aéroport, longues distances ou simplement des courses en ville.',
    includes: [
      'Transfert aéroport de Cotonou (B逃逃逃)',
      'Location de voiture avec chauffeur',
      'Course en zémidjan encadrée',
      'Minibus pour groupes',
      'Déplacements inter-villes : Cotonou ↔ Ouidah, Abomey, Grand-Popo…',
    ],
    cities: 'Partout au Bénin',
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
  },
];

interface ServicesViewProps {
  onNavigateToContact: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigateToContact }) => {
  const [selected, setSelected] = useState<ServiceDetail | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-display font-bold text-2xl text-stone-900 flex items-center gap-2">
          <ConciergeBell className="w-6 h-6 text-amber-600" />
          <span>Espace Services</span>
        </h1>
        <p className="text-stone-500 text-xs mt-1">
          Tous les services que nous proposons pour rendre votre séjour au Bénin inoubliable.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <button
            key={service.title}
            onClick={() => setSelected(service)}
            className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              {service.icon}
            </div>
            <h3 className="font-display font-bold text-base text-stone-900 mb-1.5">{service.title}</h3>
            <p className="text-xs text-stone-500 leading-relaxed">{service.subtitle}</p>
            <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold mt-3">
              En savoir plus <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[600] bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-stone-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  {selected.icon}
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-stone-900">{selected.title}</h2>
                  <p className="text-xs text-stone-500">{selected.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <p className="text-sm text-stone-600 leading-relaxed">{selected.description}</p>

              <div>
                <h3 className="font-display font-bold text-sm text-stone-900 mb-2">Ce qui est inclus :</h3>
                <ul className="space-y-2">
                  {selected.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-stone-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
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
                  href={`tel:+2290191722907`}
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

      <div className="bg-stone-900 rounded-2xl text-stone-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
  );
};
