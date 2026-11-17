/**
 * Contenus éditoriaux de la page d'accueil.
 *
 * Tout est en français et ancré dans le Bénin réel : villes, sites, savoir-faire
 * et itinéraires. Les visuels pointent vers des photos locales (Wikimedia
 * Commons ou fichiers du projet) plutôt que vers des banques d'images génériques.
 */

export type SignatureExperience = {
  id: string;
  city: string;
  /** Verbe d'action : ce que le voyageur fait vraiment. */
  title: string;
  description: string;
  image: string;
  duration: string;
  /** Lieu du catalogue à ouvrir, si l'expérience y correspond. */
  spotId?: string;
};

export type SignatureDestination = {
  city: string;
  /** Signature poétique, à la manière d'un chapitre. */
  signature: string;
  tagline: string;
  image: string;
};

export type Circuit = {
  id: string;
  title: string;
  days: number;
  route: string[];
  description: string;
  image: string;
  highlights: string[];
  badge?: string;
};

export type Excursion = {
  id: string;
  city: string;
  title: string;
  description: string;
  duration: string;
  image: string;
};

export type PressMention = {
  outlet: string;
  date: string;
  title: string;
  url: string;
};

export type Engagement = {
  number: string;
  title: string;
  description: string;
};

/** Expériences signature — le lieu, le geste, la rencontre. */
export const SIGNATURE_EXPERIENCES: SignatureExperience[] = [
  {
    id: 'mur-graffe',
    city: 'Cotonou',
    title: 'Le plus grand mur graffé d’Afrique',
    description:
      'Du quartier Sainte-Rita au boulevard de la Marina, une galerie à ciel ouvert où les artistes béninois racontent leur ville, bombe en main.',
    image: '/images/localized/spot-le-mur-cotonou-af9c59.jpg',
    duration: '2 h',
    spotId: 'spot-le-mur-cotonou',
  },
  {
    id: 'peche-ganvie',
    city: 'Ganvié',
    title: 'Pêcher au lever du jour sur le lac Nokoué',
    description:
      'Une pirogue, un pêcheur de la cité lacustre et la lumière du matin sur les pilotis. On apprend le filet autant que la patience.',
    image: '/images/localized/ganvie-6b0090.jpg',
    duration: '3 h',
    spotId: 'spot-ganvie-1',
  },
  {
    id: 'route-esclaves',
    city: 'Ouidah',
    title: 'Marcher la Route des Esclaves',
    description:
      'Quatre kilomètres de mémoire, de la place aux enchères à la Porte du Non-Retour, accompagnés par un guide qui transmet l’histoire de sa ville.',
    image: '/images/localized/ouidah-porte-non-retour.jpg',
    duration: '2 h 30',
    spotId: 'spot-ouidah-porte',
  },
  {
    id: 'riviere-noire',
    city: 'Adjarra',
    title: 'La Rivière Noire en pirogue',
    description:
      'Une forêt-galerie, des villages de potiers et le silence de l’eau. À quinze minutes de Cotonou, un autre monde.',
    image: '/images/localized/spot-riviere-noire-cotonou-13f64a.jpg',
    duration: '3 h',
    spotId: 'spot-riviere-noire-cotonou',
  },
  {
    id: 'guelede',
    city: 'Covè',
    title: 'Entrer dans la danse des Guèlèdè',
    description:
      'Masques inscrits à l’UNESCO, tambours et familles de sculpteurs : un art vivant, pas une vitrine pour touristes.',
    image: '/images/localized/guelede-danse.jpg',
    duration: '1 jour',
  },
  {
    id: 'bouche-du-roy',
    city: 'Grand-Popo',
    title: 'Remonter la Bouche du Roy',
    description:
      'La mangrove à l’embouchure du Mono, les oiseaux, puis une halte chez les artisans. Le Bénin côté océan, lent et généreux.',
    image: '/images/localized/spot-grandpopo-bouche-3f6adc.jpg',
    duration: '2 h 30',
    spotId: 'spot-grandpopo-bouche',
  },
  {
    id: 'bains-argile',
    city: 'Possotomé',
    title: 'Les bains d’argile noire de Gogotinkpon',
    description:
      'Sur l’île, l’argile se pose sur la peau, la lagune vous attend et le grand prêtre Vodun raconte les lieux. Une parenthèse hors du temps.',
    image: '/images/localized/spot-gogotinkpon-854571.jpg',
    duration: '1 jour',
    spotId: 'spot-gogotinkpon',
  },
  {
    id: 'marche-ganhi',
    city: 'Cotonou',
    title: 'Le marché de Ganhi à l’heure des couleurs',
    description:
      'Fruits, épices, tissus et pirogues chargées : le récit d’une ville se lit à même les étals. On repart les mains pleines.',
    image: '/images/localized/spot-marche-ganhi-cotonou-46dcc3.jpg',
    duration: '1 h 30',
    spotId: 'spot-marche-ganhi-cotonou',
  },
];

/** Destinations — chaque ville avec sa signature. */
export const SIGNATURE_DESTINATIONS: SignatureDestination[] = [
  {
    city: 'Cotonou',
    signature: 'La vibrante',
    tagline:
      'Le mur graffé de Sainte-Rita, les étals de Ganhi et les maquis du bord de mer : Cotonou se traverse au rythme de ses klaxons.',
    image: '/images/benin-marina.jpg',
  },
  {
    city: 'Ouidah',
    signature: 'La mémoire',
    tagline:
      'La Route des Esclaves, le Temple des Pythons et l’ombre des forêts sacrées : ici, le Bénin regarde son histoire en face.',
    image: '/images/localized/spot-ouidah-porte-7b413a.jpg',
  },
  {
    city: 'Abomey',
    signature: 'La royale',
    tagline:
      'Les palais royaux du Dahomey, inscrits à l’UNESCO, et les récits des Amazones qui ont marqué le royaume.',
    image: '/images/localized/abomey-palais.jpg',
  },
  {
    city: 'Grand-Popo',
    signature: 'La balnéaire',
    tagline:
      'L’embouchure du Mono, les cocotiers et les pirogues : le Bénin côté océan, sans hâte et sans filtre.',
    image: '/images/localized/grand-popo-3a6ca6.jpg',
  },
  {
    city: 'Porto-Novo',
    signature: 'La capitale',
    tagline:
      'Les façades afro-brésiliennes, le Grand Marché et les musées : une capitale discrète qui garde ses secrets.',
    image: '/images/localized/porto-novo-mosquee.jpg',
  },
  {
    city: 'Dassa-Zoumé',
    signature: 'La spirituelle',
    tagline:
      'Quarante et une collines, une grotte mariale et des points de vue qui coupent le souffle. On monte pour voir, on reste pour respirer.',
    image: '/images/localized/dassa-collines.jpg',
  },
];

/** Circuits — des itinéraires réels, adaptables. */
export const CIRCUITS: Circuit[] = [
  {
    id: 'classique',
    title: 'Classique du Bénin',
    days: 7,
    route: ['Cotonou', 'Porto-Novo', 'Abomey', 'Ouidah'],
    description:
      'Ganvié, la Rivière Noire, les palais royaux d’Abomey et la route des captifs : la trame la plus complète en une semaine.',
    image: '/images/localized/ganvie-6b0090.jpg',
    highlights: ['Cité lacustre de Ganvié', 'Palais royaux d’Abomey', 'Porte du Non-Retour'],
  },
  {
    id: 'vodun-culture',
    title: 'Vodun & Culture',
    days: 10,
    route: ['Cotonou', 'Porto-Novo', 'Covè', 'Abomey', 'Grand-Popo', 'Ouidah'],
    description:
      'Danses Guèlèdè, ateliers de masques, lac Ahémé et bains d’argile : un voyage au cœur des savoir-faire vivants.',
    image: '/images/localized/guelede-danse.jpg',
    highlights: ['Masques Guèlèdè de Covè', 'Lac Ahémé en barque', 'Bains d’argile de Gogotinkpon'],
    badge: 'Dates Vodun Days',
  },
  {
    id: 'nature',
    title: 'Nature & Évasion',
    days: 12,
    route: ['Cotonou', 'Dassa-Zoumé', 'Natitingou', 'Pendjari', 'Grand-Popo'],
    description:
      'Collines de Dassa, Tata Somba, safari dans la Pendjari et Bouche du Roy : le Bénin des grands espaces.',
    image: '/images/localized/savane-du-parc-national-de-la-pendjari-390588.jpg',
    highlights: ['Collines de Dassa', 'Parc national de la Pendjari', 'Mangrove du Mono'],
  },
  {
    id: 'famille',
    title: 'Famille au Bénin',
    days: 14,
    route: ['Cotonou', 'Ganvié', 'Ouidah', 'Grand-Popo'],
    description:
      'Deux nuits par étape, ateliers, pirogues et océan : un rythme d’enfant pour découvrir le pays sans courir.',
    image: '/images/localized/ganvie-5096cd.jpg',
    highlights: ['Pirogue sur le lac Nokoué', 'Ateliers artisanat', 'Plages de Grand-Popo'],
  },
];

/** Excursions — escapades courtes, faciles à intégrer. */
export const EXCURSIONS: Excursion[] = [
  {
    id: 'ganvie',
    city: 'Ganvié',
    title: 'La cité lacustre',
    description:
      'Barque motorisée jusqu’aux maisons sur pilotis, pêche artisanale aux côtés des pêcheurs, puis déjeuner partagé sur l’eau.',
    duration: '1 jour',
    image: '/images/localized/ganvie-6b0090.jpg',
  },
  {
    id: 'adjarra',
    city: 'Adjarra',
    title: 'La Rivière Noire',
    description:
      'Navigation en pirogue dans une forêt-galerie préservée, village de potiers de Sè, puis percussions et dégustation.',
    duration: '1 jour',
    image: '/images/localized/spot-riviere-noire-cotonou-13f64a.jpg',
  },
  {
    id: 'cotonou',
    city: 'Cotonou',
    title: 'La ville en tuk-tuk',
    description:
      'Le mur graffé de Sainte-Rita, la statue de l’Amazone et le marché de Ganhi, ponctués d’une pause beignets.',
    duration: '1 jour',
    image: '/images/localized/spot-le-mur-cotonou-af9c59.jpg',
  },
  {
    id: 'ouidah-route',
    city: 'Ouidah',
    title: 'La route des captifs',
    description:
      'Une demi-journée de mémoire, de la place aux enchères à la Porte du Non-Retour, sur les quatre kilomètres du chemin des captifs.',
    duration: 'Demi-journée',
    image: '/images/localized/ouidah-porte-non-retour.jpg',
  },
  {
    id: 'porto-novo',
    city: 'Porto-Novo',
    title: 'La capitale afro-brésilienne',
    description:
      'Mosquée afro-brésilienne, Grand Marché, musée Honmè et Jardin des plantes, jusqu’à la berge lagunaire et ses maraîchers.',
    duration: '1 jour',
    image: '/images/localized/porto-novo-mosquee.jpg',
  },
  {
    id: 'abomey',
    city: 'Abomey',
    title: 'La capitale du Dahomey',
    description:
      'Les palais royaux inscrits à l’UNESCO, le centre de tissage du roi Agonglo, puis la forêt inondée de Lokoli en pirogue.',
    duration: '2 jours',
    image: '/images/localized/abomey-palais.jpg',
  },
];

/**
 * La presse parle de la destination Bénin — pas de SecretScape.
 * Les liens renvoient vers les articles d'origine.
 */
export const PRESS_MENTIONS: PressMention[] = [
  {
    outlet: 'Gala',
    date: 'Juin 2026',
    title: 'Le Bénin : de Cotonou à Ouidah, l’inattendu réveil d’une destination africaine',
    url: 'https://www.gala.fr/lifestyle/reportage-le-benin-de-cotonou-a-ouidah-l-inattendu-reveil-d-une-destination-africaine-20260601',
  },
  {
    outlet: 'Paris Match',
    date: 'Janvier 2024',
    title: 'Vodun Days : le Bénin veut « révéler le vodun au monde »',
    url: 'https://www.parismatch.com/actu/international/vodun-days-le-benin-veut-reveler-le-vaudou-au-monde-234078',
  },
  {
    outlet: 'AFAR',
    date: 'Sélection 2025',
    title: 'Le Bénin parmi les 25 meilleures destinations à découvrir en 2025',
    url: 'https://www.afar.com/magazine/where-to-go-in-2025',
  },
  {
    outlet: 'Lonely Planet',
    date: '2024',
    title: 'Le Bénin dans le Top 10 des destinations à visiter en 2024',
    url: 'https://benin.bj/a-la-une/le-benin-dans-le-top-10-des-destinations-a-visiter-en-2024-selon-lonely-planet',
  },
];

/** Nos engagements — concrets, pas de promesses creuses. */
export const ENGAGEMENTS: Engagement[] = [
  {
    number: '01',
    title: 'Des lieux vérifiés sur le terrain',
    description:
      'Chaque adresse est visitée, datée et mise à jour par des habitants. Pas de liste recopiée : des carnets de terrain.',
  },
  {
    number: '02',
    title: 'Guides et artisans rémunérés',
    description:
      'Nous travaillons avec des guides locaux, des ateliers et des familles. Le voyage profite d’abord à ceux qui le racontent.',
  },
  {
    number: '03',
    title: 'Petits groupes, vrais échanges',
    description:
      'Pas de bus de cinquante personnes : des formats intimes qui laissent la place aux rencontres et au hasard.',
  },
  {
    number: '04',
    title: 'Un carnet modulable',
    description:
      'Vos envies, votre rythme, votre budget. On assemble, vous ajustez, on recommence jusqu’à ce que ce soit le vôtre.',
  },
];
