import { writeFileSync } from 'node:fs';
import { INITIAL_HIDDEN_SPOTS } from '../../src/data/hiddenSpots.ts';
import { AGENDA_EVENTS } from '../../src/data/agendaEvents.ts';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

type Sel = { key: string; chapter: number; kind: 'site' | 'resto' | 'hotel' };

const sel: Sel[] = [
  // Ch01 — Cotonou & littoral
  { key: 'Fondation Zinsou', chapter: 1, kind: 'site' },
  { key: 'Marché Ganhi', chapter: 1, kind: 'site' },
  { key: "Place de l'Amazone", chapter: 1, kind: 'site' },
  { key: 'Plage de Fidjrossè', chapter: 1, kind: 'site' },
  // Ch02 — Ouidah, Ganvié & Atlantique
  { key: 'Village Lacustre de Ganvié', chapter: 2, kind: 'site' },
  { key: 'Porte du Non-Retour', chapter: 2, kind: 'site' },
  { key: 'Temple des Pythons', chapter: 2, kind: 'site' },
  { key: 'Musée International du Vodun', chapter: 2, kind: 'site' },
  { key: 'Plage de Djégbadji', chapter: 2, kind: 'site' },
  { key: "Plage d'Avlékété", chapter: 2, kind: 'site' },
  // Ch03 — Grand-Popo & Mono
  { key: 'La Bouche du Roi', chapter: 3, kind: 'site' },
  { key: 'Lac Toho', chapter: 3, kind: 'site' },
  { key: 'Grande Plage de Grand-Popo', chapter: 3, kind: 'site' },
  { key: "Presqu'île d'Avlo", chapter: 3, kind: 'site' },
  // Ch04 — Abomey & Zou
  { key: "Palais Royaux d'Abomey", chapter: 4, kind: 'site' },
  { key: "Ateliers de bas-reliefs", chapter: 4, kind: 'site' },
  { key: "Village souterrain d'Agongointo", chapter: 4, kind: 'site' },
  // Ch05 — Porto-Novo & Ouémé
  { key: 'Musée Honmè', chapter: 5, kind: 'site' },
  { key: 'Grande Mosquée de Porto-Novo', chapter: 5, kind: 'site' },
  { key: "Poterie d'Adjarra", chapter: 5, kind: 'site' },
  { key: 'Plage de Sèmè-Kpodji', chapter: 5, kind: 'site' },
  // Ch06 — Dassa & Collines
  { key: "Basilique Notre-Dame d'Arigbo", chapter: 6, kind: 'site' },
  { key: 'Collines sacrées de Dassa', chapter: 6, kind: 'site' },
  // Ch07 — Atacora
  { key: 'Tata Somba de Boukoumbé', chapter: 7, kind: 'site' },
  { key: 'Cascades de Tanougou', chapter: 7, kind: 'site' },
  { key: 'Piste des Grands Espaces de la Pendjari', chapter: 7, kind: 'site' },
  // Ch08 — Alibori, Borgou & Donga
  { key: 'Parc national W', chapter: 8, kind: 'site' },
  { key: 'Arène de la Gaani', chapter: 8, kind: 'site' },
  { key: 'Palais Royal de Nikki', chapter: 8, kind: 'site' },
  { key: 'Banque Culturelle Tanéka', chapter: 8, kind: 'site' },
  // Ch09 — Couffo & Plateau
  { key: 'Palais royal et musée de Kinkinhoué', chapter: 9, kind: 'site' },
  { key: 'Forêt sacrée de Pobè', chapter: 9, kind: 'site' },

  // Restaurants (12)
  { key: 'Villa Kaya', chapter: 1, kind: 'resto' },
  { key: 'Jaaba', chapter: 1, kind: 'resto' },
  { key: 'Face à la Mer', chapter: 1, kind: 'resto' },
  { key: 'Cali Cali', chapter: 1, kind: 'resto' },
  { key: 'Rousski Dom', chapter: 1, kind: 'resto' },
  { key: 'Le Petit Four', chapter: 1, kind: 'resto' },
  { key: 'Musée du Soleil', chapter: 2, kind: 'resto' },
  { key: 'Hakuna Matata', chapter: 2, kind: 'resto' },
  { key: 'Kolè', chapter: 2, kind: 'resto' },
  { key: 'Alozo', chapter: 2, kind: 'resto' },
  { key: 'La Boca del Rio', chapter: 3, kind: 'resto' },
  { key: 'Chez Raphaël', chapter: 2, kind: 'resto' },

  // Hotels (6)
  { key: 'Maison Rouge', chapter: 1, kind: 'hotel' },
  { key: 'Sofitel Cotonou Marina', chapter: 1, kind: 'hotel' },
  { key: 'Au cœur de Ouidah', chapter: 2, kind: 'hotel' },
  { key: 'Bambou Beach', chapter: 3, kind: 'hotel' },
  { key: 'Résidences Ouadada', chapter: 5, kind: 'hotel' },
  { key: 'Baobab de Tanguiéta', chapter: 7, kind: 'hotel' },
];

const all = INITIAL_HIDDEN_SPOTS;
const byNorm = new Map<string, typeof all>();
for (const s of all) {
  const n = norm(s.title);
  if (!byNorm.has(n)) byNorm.set(n, []);
  byNorm.get(n)!.push(s);
}

const results: any[] = [];
const problems: string[] = [];
for (const s of sel) {
  const n = norm(s.key);
  let hits = byNorm.get(n) || [];
  if (!hits.length) {
    hits = all.filter((p) => norm(p.title).includes(n) || n.includes(norm(p.title)));
  }
  if (!hits.length) {
    problems.push('NO MATCH: ' + s.key);
    continue;
  }
  // prefer the expected category family
  const want = s.kind === 'site' ? ['sites', 'plages'] : s.kind === 'resto' ? ['restaurants'] : ['hotels'];
  const sorted = [...hits].sort((a, b) => {
    const sa = want.includes(a.category) ? 0 : 1;
    const sb = want.includes(b.category) ? 0 : 1;
    return sa - sb;
  });
  const hit = sorted[0];
  if (!want.includes(hit.category)) problems.push('WRONG CATEGORY: ' + s.key + ' -> ' + hit.title + ' [' + hit.category + ']');
  results.push({
    ...hit,
    chapter: s.chapter,
    ficheKind: s.kind,
  });
}

const chapters = [
  { n: 1, title: 'Cotonou & le littoral', short: 'Cotonou', region: 'Littoral' },
  { n: 2, title: 'Ouidah, Ganvié & la côte atlantique', short: 'Ouidah', region: 'Atlantique' },
  { n: 3, title: 'Grand-Popo & la vallée du Mono', short: 'Grand-Popo', region: 'Mono' },
  { n: 4, title: 'Abomey & le pays du Zou', short: 'Abomey', region: 'Zou' },
  { n: 5, title: 'Porto-Novo & l’Ouémé', short: 'Porto-Novo', region: 'Ouémé' },
  { n: 6, title: 'Dassa & les collines sacrées', short: 'Dassa', region: 'Collines' },
  { n: 7, title: 'L’Atacora, terre de pierre', short: 'Atacora', region: 'Atacora' },
  { n: 8, title: 'Alibori, Borgou & le Donga', short: 'Borgou', region: 'Borgou' },
  { n: 9, title: 'Le Couffo & le plateau', short: 'Couffo', region: 'Couffo' },
];

const out = {
  generatedAt: new Date().toISOString(),
  chapters,
  selection: results,
  directory: all.map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    city: s.city,
    region: s.region,
    address: s.address,
  })),
  agenda: AGENDA_EVENTS,
  problems,
};

writeFileSync(new URL('./data.json', import.meta.url), JSON.stringify(out, null, 2), 'utf8');
console.log('selected', results.length, 'of', sel.length);
console.log('problems', problems);
const counts: Record<number, any> = {};
for (const r of results) {
  counts[r.chapter] ??= { site: 0, resto: 0, hotel: 0 };
  counts[r.chapter][r.ficheKind]++;
}
console.log(counts);
console.log(results.map((r) => `Ch${r.chapter} ${r.ficheKind} | ${r.title} | ${r.city}`).join('\n'));
