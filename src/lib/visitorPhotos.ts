import { VisitorPhoto } from '../types';

const LOCAL_KEY = 'secretscape_my_photos';

export function loadLocalPhotos(): VisitorPhoto[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveLocalPhoto(photo: VisitorPhoto) {
  const list = loadLocalPhotos();
  list.unshift(photo);
  const deduped = Array.from(new Map(list.map((p) => [p.id, p])).values());
  const capped = deduped.slice(0, 50);
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(capped));
  } catch {
    // localStorage plein : on ignore, la photo reste visible côté serveur après validation
  }
}

export function mergedVisitorPhotos(server: VisitorPhoto[]): VisitorPhoto[] {
  const local = loadLocalPhotos();
  const serverIds = new Set(server.map((p) => p.id));
  const localPending = local.filter((p) => !serverIds.has(p.id));
  return [...localPending, ...server].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}