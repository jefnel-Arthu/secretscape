// Identité canonique d'une image externe : deux URL pointant vers le même
// fichier (largeur, paramètres de cache…) partagent la même clé.
import crypto from 'node:crypto';
import path from 'node:path';

export const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 50);

/** Nom de fichier Commons, extension comprise, quelle que soit la forme de l'URL. */
export function wikimediaFileName(url) {
  const parts = decodeURIComponent(new URL(url).pathname).split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  // .../thumb/2/27/NAME.jpg/1280px-NAME.jpg  →  NAME.jpg
  if (parts.includes('thumb') && /^\d+px-/.test(last)) return last.replace(/^\d+px-/, '');
  return last;
}

export function imageKey(url) {
  const u = new URL(url);
  if (u.host.includes('wikimedia')) return `wm:${wikimediaFileName(url).toLowerCase()}`;
  if (u.host === 'images.unsplash.com') {
    const id = u.pathname.replace(/^\//, '').replace(/\.(jpe?g|png|webp)$/i, '');
    return `us:${id.toLowerCase()}`;
  }
  return `raw:${url}`;
}

/** Base lisible pour nommer le fichier local. */
export function imageBase(url) {
  const u = new URL(url);
  if (u.host.includes('wikimedia')) {
    return wikimediaFileName(url).replace(/\.[a-z0-9]+$/i, '');
  }
  if (u.host === 'images.unsplash.com') {
    return u.pathname.replace(/^\//, '').replace(/\.[a-z0-9]+$/i, '');
  }
  return path.basename(u.pathname).replace(/\.[a-z0-9]+$/i, '');
}

/** Slug stable dérivé de la clé (indépendant des paramètres d'URL). */
export function imageSlug(url) {
  const base = slugify(imageBase(url)) || 'image';
  const hash = crypto.createHash('sha1').update(imageKey(url)).digest('hex').slice(0, 6);
  return `${base}-${hash}`;
}
