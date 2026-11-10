export const AGENCY_CONTACT = {
  phone: '+229 01 91 72 29 07',
  email: 'ajefnel@gmail.com',
  address: 'Cotonou, Benin',
  hours: 'Lundi - Dimanche : 8h a 22h',
} as const;

export const AGENCY_PHONE_HREF = `tel:${AGENCY_CONTACT.phone.replace(/\s+/g, '')}`;

// L'identifiant de formulaire Formspree est public par conception : il est appelé depuis le navigateur.
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xppaydyr';
