/**
 * Destinations mises en avant sur le site.
 *
 * Source unique partagée par le footer (filtre de la carte) et le formulaire
 * « Planifier » : les deux listes restent ainsi rigoureusement identiques.
 * Chaque entrée doit correspondre à un `city` présent dans le catalogue,
 * sinon le filtre du footer renverrait une liste vide.
 */
export const FEATURED_DESTINATIONS = [
  'Cotonou',
  'Ouidah',
  'Abomey',
  'Grand-Popo',
  'Porto-Novo',
  'Dassa-Zoumé',
  'Ganvié',
  'Natitingou',
] as const;
