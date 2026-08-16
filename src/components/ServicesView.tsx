import React from 'react';
import {
  ConciergeBell, Car, BedDouble, Ship, Utensils, CalendarDays, Phone, MapPin, ArrowRight
} from 'lucide-react';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    icon: <ConciergeBell className="w-6 h-6" />,
    title: 'Guides touristiques',
    description: 'Des guides locaux passionnés qui vous font découvrir les pépites cachées du Bénin, hors des sentiers battus.',
  },
  {
    icon: <Car className="w-6 h-6" />,
    title: 'Transport & Transferts',
    description: 'Zémidjan, taxi, voiture avec chauffeur ou minibus : nous organisons vos déplacements en toute sécurité.',
  },
  {
    icon: <BedDouble className="w-6 h-6" />,
    title: 'Hébergements & Hôtels',
    description: 'Réservation de chambres, hôtels et écolodges au meilleur tarif, selon votre budget et vos envies.',
  },
  {
    icon: <Ship className="w-6 h-6" />,
    title: 'Excursions & Circuits',
    description: 'Ganvié, Pendjari, Ouidah, Abomey : des circuits clés en main ou sur mesure pour explorer chaque région.',
  },
  {
    icon: <Utensils className="w-6 h-6" />,
    title: 'Restaurants & Gastronomie',
    description: 'Tables typiques et adresses gourmandes pour goûter à la vraie cuisine béninoise, en toute confiance.',
  },
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: 'Événements & Groupes',
    description: 'Organisation de sorties en groupe, séminaires, anniversaires et visites privées entièrement personnalisées.',
  },
];

interface ServicesViewProps {
  onNavigateToContact: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigateToContact }) => {
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
          <div
            key={service.title}
            className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              {service.icon}
            </div>
            <h3 className="font-display font-bold text-base text-stone-900 mb-1.5">{service.title}</h3>
            <p className="text-xs text-stone-500 leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>

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
