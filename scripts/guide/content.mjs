/**
 * SecretScape — génération du guide complet « Bénin, les lieux secrets »
 *
 * Le fichier produit (guide.html) est ensuite imprimé en PDF par build.mjs.
 * Structure : 7 pages d'ouverture, 9 chapitres (ouverture + 50 fiches),
 * carnet pratique (itinéraires, agenda, répertoire, index, crédits), dos.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(here, 'data.json'), 'utf8'));
const ed = JSON.parse(readFileSync(join(here, 'editorial.json'), 'utf8'));
const photos = JSON.parse(readFileSync(join(here, 'assets', 'photo-credits.json'), 'utf8'));

/* ------------------------------------------------------------------ utils */

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const dash = (s = '') => String(s).replace(/ - /g, ' — ');

const LEVEL = { facile: 'Accessible', moyen: 'Bien caché', insider: 'Secret d’initié' };
const CROWD = { faible: 'Peu fréquenté', modéré: 'Fréquentation moyenne', élevé: 'Très fréquenté' };
const KIND = { sites: 'Site', plages: 'Plage', restaurants: 'Table', hotels: 'Hôtel' };
const CAT_SHORT = { sites: 'Site', plages: 'Plage', restaurants: 'Table', hotels: 'Hôtel', boites: 'Bar', transports: 'Transport' };

const rating = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1)).replace('.', ',');

const duration = (min) => {
  if (!min) return '—';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
};

const shortMoment = (s = '') => {
  const clean = String(s).split(/[,(]/)[0].trim();
  return clean.length > 46 ? clean.slice(0, 44).replace(/\s+\S*$/, '') + '…' : clean;
};

const headline = (s) => ed.headlines[s.id] || s.title;

const paragraphs = (s) => {
  if (ed.overrides[s.id]?.p1) {
    return [ed.overrides[s.id].p1, ed.overrides[s.id].p2].filter(Boolean);
  }
  const ps = String(s.description || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (ps.length === 1) return [ps[0]];
  return [ps[0], ps.slice(1).join(' ')];
};

const secret = (s) => ed.overrides[s.id]?.secret || s.secretAccessHint;

const tip = (s) =>
  ed.overrides[s.id]?.tip ||
  ed.tips[s.id] ||
  'Prévoyez de l’eau et un peu de marge : les temps de route sont souvent plus longs qu’annoncé.';

const quote = (s) => {
  const ps = String(s.description || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  let q = ps[ps.length - 1] || s.subtitle || '';
  if (q.length > 210) {
    const sentences = q.match(/[^.!?]+[.!?]+/g) || [q];
    q = '';
    for (const sentence of sentences) {
      if ((q + sentence).length > 200) break;
      q += sentence;
    }
    if (!q) q = sentences[0].slice(0, 190).replace(/\s+\S*$/, '') + '…';
  }
  return q.trim();
};

const photo = (s) => `assets/photos/${s.id}.jpg`;

const creditClass = (s) => {
  const c = photos.find((p) => p.id === s.id);
  if (!c) return '';
  if (c.rights === 'cc') return 'Wikimedia Commons';
  if (c.rights === 'libre') return 'Unsplash';
  if (c.rights === 'projet') return 'SecretScape';
  return 'D.R.';
};

/* --------------------------------------------------------------- structure */

const chapters = data.chapters.map((c) => {
  const fiches = data.selection
    .filter((s) => s.chapter === c.n)
    .sort((a, b) => {
      const rank = { sites: 0, plages: 1, restaurants: 2, hotels: 3 };
      return rank[a.category] - rank[b.category];
    });
  return { ...c, fiches };
});

// numero global des fiches, dans l'ordre de lecture
let ficheNo = 0;
for (const ch of chapters) {
  for (const f of ch.fiches) {
    ficheNo += 1;
    f.ficheNo = String(ficheNo).padStart(2, '0');
  }
}

const chapterLeads = {
  1: {
    kicker: 'Cotonou, entre lagune et océan',
    lead:
      'Cotonou ne se visite pas comme une capitale : elle se traverse, au rythme des zems, des marchés et des couchers de soleil. Sous la ville moderne, une ville de quartiers, de cours ombragées et de plages où l’Atlantique vient chercher les pirogues.',
    text: 'Cotonou · Fidjrossè · Haie Vive · Ganhi',
  },
  2: {
    kicker: 'La mémoire et l’eau',
    lead:
      'Entre la porte du Non-Retour et les canaux de Ganvié, l’Atlantique raconte deux histoires : celle du départ et celle de la résistance. Ici, chaque village a gardé sa mémoire, chaque plage son secret.',
    text: 'Ouidah · Sô-Ava · Avlékété · Djégbadji',
  },
  3: {
    kicker: 'Là où le fleuve rencontre la mer',
    lead:
      'Le Mono descend du nord et vient mourir dans l’Atlantique, en dessinant un delta de sable et de lumière. Entre Grand-Popo et la presqu’île d’Avlo, le littoral ralentit, les villages s’étirent, les jours se ressemblent.',
    text: 'Grand-Popo · Avlo · Ahozon · Agoué',
  },
  4: {
    kicker: 'Le cœur du royaume',
    lead:
      'Abomey conserve la trace de l’un des royaumes les plus puissants d’Afrique de l’Ouest. Derrière les murs de terre des palais, les bas-reliefs racontent des guerres, des alliances et un art de gouverner qui a marqué tout le pays.',
    text: 'Abomey · Bohicon · Agongointo',
  },
  5: {
    kicker: 'La capitale discrète',
    lead:
      'Porto-Novo avance à son propre rythme, loin de l’agitation de Cotonou. Architecture afro-brésilienne, mosquée aux mille couleurs, ateliers de poterie : la capitale administrative garde une élégance de ville ancienne.',
    text: 'Porto-Novo · Adjarra · Sèmè-Kpodji',
  },
  6: {
    kicker: 'Les collines et le ciel',
    lead:
      'À Dassa, le relief change brusquement. Les collines de granit surgissent de la plaine, couvertes de végétation et de lieux de prière. On monte pour la vue, on redescend avec le silence des pèlerinages.',
    text: 'Dassa-Zoumé · Arigbo · Kamaté',
  },
  7: {
    kicker: 'La terre des Somba',
    lead:
      'L’Atacora est un pays de pierre, de falaises et de châteaux de terre. Les tatas somba veillent sur les vallées, les cascades tombent des plateaux, et la piste de la Pendjari ouvre sur les grands espaces.',
    text: 'Natitingou · Boukoumbé · Tanougou · Tanguiéta',
  },
  8: {
    kicker: 'Savanes et royaumes du nord',
    lead:
      'Au nord, le pays s’élargit. Les savanes du W abritent éléphants et antilopes, Nikki perpétue la mémoire des cavaliers wasangari, et les Tanéka conservent leurs objets et leurs récits dans une banque culturelle unique.',
    text: 'Nikki · Karimama · Copargo · Tanguiéta',
  },
  9: {
    kicker: 'Le plateau, loin des routes',
    lead:
      'Le Couffo et le plateau sont les terres discrètes du guide. Un palais de chefferie, une forêt sacrée, des villages qui n’attendent pas les visiteurs : c’est le Bénin de ceux qui prennent le temps de sortir de l’axe.',
    text: 'Djakotomey · Pobè · Kinkinhoué',
  },
};

const chapterPhotos = {
  1: 'spot-fidjrosse',
  2: 'spot-ganvie-1',
  3: 'spot-grandpopo-bouche',
  4: 'spot-abomey-1',
  5: 'spot-portonovo-honme',
  6: 'spot-dassa-1',
  7: 'spot-tanougou-cascade',
  8: 'spot-parc-w',
  9: 'spot-site-foret-pobe',
};

const byId = Object.fromEntries(data.selection.map((s) => [s.id, s]));

/* ------------------------------------------------------------ page numbers */

const PAGES = {};
let cursor = 1;
const take = (key) => {
  PAGES[key] = cursor;
  cursor += 1;
  return cursor - 1;
};

take('cover');
take('inside');
take('toc');
take('intro');
take('map');
take('howto');
take('practical');

for (const ch of chapters) {
  take(`ch${ch.n}`);
  for (const f of ch.fiches) {
    f.page = take(`fiche${f.ficheNo}`);
  }
}

take('itinIntro');
take('itin4');
take('itin7');
take('itin10');
take('agenda1');
take('agenda2');

/* répertoire : pagination estimée puis ajustée après construction */
const regionOrder = ['Littoral', 'Atlantique', 'Mono', 'Ouémé', 'Plateau', 'Zou', 'Collines', 'Couffo', 'Donga', 'Borgou', 'Alibori', 'Atacora'];
const regionLabel = {
  Littoral: 'Littoral — Cotonou',
  Atlantique: 'Atlantique — Ouidah, Ganvié, Abomey-Calavi',
  Mono: 'Mono — Grand-Popo, Athiémé',
  Ouémé: 'Ouémé — Porto-Novo, Adjarra',
  Plateau: 'Plateau — Pobè, Sakété',
  Zou: 'Zou — Abomey, Bohicon',
  Collines: 'Collines — Dassa, Savalou',
  Couffo: 'Couffo — Aplahoué, Djakotomey',
  Donga: 'Donga — Djougou, Copargo',
  Borgou: 'Borgou — Parakou, Nikki',
  Alibori: 'Alibori — Kandi, Karimama',
  Atacora: 'Atacora — Natitingou, Tanguiéta',
};

const directory = data.directory.filter((d) => regionOrder.includes(d.region));
const dirBlocks = [];
for (const region of regionOrder) {
  const items = directory
    .filter((d) => d.region === region)
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'));
  if (!items.length) continue;
  dirBlocks.push({ type: 'region', label: regionLabel[region], count: items.length });
  for (const item of items) dirBlocks.push({ type: 'item', item });
}

const unitsPerPage = 88;
const unitsFirstPage = 84;
const dirPages = [];
let current = [];
let used = 0;
let capacity = unitsFirstPage;
let currentRegion = null;
for (const block of dirBlocks) {
  const weight = block.type === 'region' ? 3 : 1;
  if (used + weight > capacity && current.length) {
    dirPages.push(current);
    current = [];
    used = 0;
    capacity = unitsPerPage;
    if (currentRegion && block.type === 'item') {
      current.push({ type: 'cont', label: currentRegion });
      used += 3;
    }
  }
  if (block.type === 'region') currentRegion = block.label;
  current.push(block);
  used += weight;
}
if (current.length) dirPages.push(current);
const DIR_FIRST = take('dirIntro');
for (let i = 1; i < dirPages.length; i++) take(`dir${i + 1}`);
const DIR_PAGES = dirPages.length;

take('index');
take('credits');
take('back');

const TOTAL = cursor - 1;

/* -------------------------------------------------------------- fragments */

const stars = (n) => {
  const full = Math.round(n);
  return Array.from({ length: 5 }, () => `<svg viewBox="0 0 24 24"${' '}><use href="#i-star"/></svg>`)
    .slice(0, full)
    .join('');
};

const folio = (left, page, dark = false) =>
  `<div class="folio${dark ? ' folio--light' : ''}"><span>${esc(left)}</span><span class="folio__line"></span><span>${String(page).padStart(3, '0')}</span></div>`;

const ph = (src, alt, credit, cls = '') =>
  `<div class="ph ${cls}"><img src="${src}" alt="${esc(alt)}">${credit ? `<span class="credit">${esc(credit)}</span>` : ''}</div>`;

/* ------------------------------------------------------------------- pages */

const pages = [];

/* 01 — couverture */
pages.push(`<section class="page cover" data-name="couverture">
  <div class="cover__photo">
    <img src="${photo(byId['spot-ganvie-1'])}" alt="Village lacustre de Ganvié au lever du jour">
    <div class="cover__veil"></div>
    <span class="credit">Ganvié · ${creditClass(byId['spot-ganvie-1'])}</span>
  </div>
  <div class="cover__top">
    <div class="wordmark">Secret<span>Scape</span></div>
    <div class="specimen-tag">Édition 2026</div>
  </div>
  <div class="cover__band">
    <img class="cover__map" src="assets/benin-outline.svg" alt="">
    <div class="cover__kicker"><span>Le guide des lieux secrets</span><i></i><span>Bénin</span></div>
    <h1 class="cover__title display">Bénin<em>les lieux secrets</em></h1>
    <p class="cover__sub">Cinquante adresses choisies, neuf territoires, trois itinéraires. Un carnet de route pour découvrir le Bénin autrement.</p>
  </div>
  <div class="cover__foot">
    <span>Guide numérique · Format A4</span>
    <span>secretscape.com</span>
  </div>
</section>`);

/* 02 — page de garde */
pages.push(`<section class="page inside" data-name="page-de-garde">
  <div class="inside__frame"></div>
  <div class="inside__content">
    <div class="monogram">SS</div>
    <p class="inside__epigraph">« Au Bénin, les plus beaux endroits ne sont pas toujours ceux que l’on montre. »</p>
    <div class="inside__rule"></div>
    <p class="inside__text">Ce carnet est né d’une conviction simple : le Bénin se découvre mieux en dehors des circuits balisés. Derrière une plage, un marché, une porte de pierre, il y a toujours une histoire que l’on ne raconte pas dans les guides classiques.</p>
    <p class="inside__text">Nous avons parcouru le pays, comparé les lumières, écouté les habitants, puis retenu cinquante lieux. Cinquante, pas un de plus : ceux qui méritent le détour, le lever de soleil et parfois la patience.</p>
    <p class="inside__text">Ce guide est un compagnon de route. Il se lit avant le départ, se consulte sur la piste, et se garde ensuite comme un carnet de souvenirs.</p>
    <p class="inside__note">Bonne route — et prenez le temps.</p>
  </div>
  <div class="colophon">
    <div><b>Édition</b>SecretScape — Édition 2026</div>
    <div><b>Conception éditoriale</b>SecretScape Studio</div>
    <div><b>Typographies</b>Playfair Display &amp; Poppins</div>
    <div><b>Format</b>210 × 297 mm — numérique</div>
    <div><b>Photographies</b>SecretScape · Wikimedia Commons · Unsplash</div>
    <div><b>Contact</b>secretscape.com</div>
  </div>
</section>`);

/* 03 — sommaire */
const tocChapters = chapters
  .map(
    (ch) => `<div class="toc-row">
      <span class="num">${String(ch.n).padStart(2, '0')}</span>
      <span class="label">${esc(ch.title)}</span>
      <span class="dots"></span>
      <span class="page">${String(PAGES[`ch${ch.n}`]).padStart(3, '0')}</span>
    </div>`
  )
  .join('');

pages.push(`<section class="page toc" data-name="sommaire">
  <div class="toc__head">
    <p class="eyebrow">Bénin, les lieux secrets</p>
    <h2 class="toc__title display">Sommaire</h2>
    <p class="toc__sub">Neuf chapitres, cinquante fiches et un carnet pratique pour composer votre propre route.</p>
  </div>
  <div class="toc__list">
    <div class="toc__group">
      <div class="toc__group-label">Ouvrir le guide</div>
      <div class="toc-row"><span class="num">—</span><span class="label">Avant-propos</span><span class="dots"></span><span class="page">${String(PAGES.intro).padStart(3, '0')}</span></div>
      <div class="toc-row"><span class="num">—</span><span class="label">Les neuf territoires</span><span class="dots"></span><span class="page">${String(PAGES.map).padStart(3, '0')}</span></div>
      <div class="toc-row"><span class="num">—</span><span class="label">Mode d’emploi</span><span class="dots"></span><span class="page">${String(PAGES.howto).padStart(3, '0')}</span></div>
      <div class="toc-row"><span class="num">—</span><span class="label">Le Bénin pratique</span><span class="dots"></span><span class="page">${String(PAGES.practical).padStart(3, '0')}</span></div>
    </div>
    <div class="toc__group">
      <div class="toc__group-label">Les neuf territoires</div>
      ${tocChapters}
    </div>
    <div class="toc__group">
      <div class="toc__group-label">Carnet pratique</div>
      <div class="toc-row"><span class="num">—</span><span class="label">Trois itinéraires, de 4 à 10 jours</span><span class="dots"></span><span class="page">${String(PAGES.itinIntro).padStart(3, '0')}</span></div>
      <div class="toc-row"><span class="num">—</span><span class="label">L’agenda des fêtes</span><span class="dots"></span><span class="page">${String(PAGES.agenda1).padStart(3, '0')}</span></div>
      <div class="toc-row"><span class="num">—</span><span class="label">Le répertoire des 296 adresses</span><span class="dots"></span><span class="page">${String(PAGES.dirIntro).padStart(3, '0')}</span></div>
      <div class="toc-row"><span class="num">—</span><span class="label">Index &amp; crédits</span><span class="dots"></span><span class="page">${String(PAGES.index).padStart(3, '0')}</span></div>
    </div>
  </div>
  <aside class="toc__aside">
    ${ph(photo(byId['spot-ouidah-porte']), 'La Porte du Non-Retour à Ouidah', '', 'toc__photo')}
    <p class="toc__caption">Ouidah, la Route des Esclaves.</p>
    <div class="toc__stats">
      <div class="toc__stat"><b>50</b><span>fiches choisies</span></div>
      <div class="toc__stat"><b>09</b><span>territoires</span></div>
      <div class="toc__stat"><b>03</b><span>itinéraires</span></div>
      <div class="toc__stat"><b>296</b><span>adresses répertoriées</span></div>
    </div>
  </aside>
  <div class="toc__note">
    <p>Chaque chapitre s’ouvre par une carte, se poursuit par les fiches et se referme sur un carnet d’adresses.</p>
    <span>Comment lire ce guide</span>
  </div>
  ${folio('SecretScape — Bénin, les lieux secrets', PAGES.toc)}
</section>`);

/* 04 — introduction */
pages.push(`<section class="page intro" data-name="introduction">
  <div class="intro__head">
    <p class="eyebrow">Avant-propos</p>
    <h2 class="intro__title display">Neuf territoires,<br><em>une même promesse.</em></h2>
  </div>
  <div class="intro__text">
    <p class="body-copy">Le Bénin tient dans un geste : une pirogue qui s’éloigne, une porte qui s’ouvre sur l’océan, un marché qui s’éveille. En apparence petit, le pays déploie une densité rare — lagunes, savanes, palais, forêts sacrées, plages sans fin.</p>
    <p class="body-copy">Ce guide n’est pas un inventaire. C’est une sélection. Cinquante lieux choisis pour leur beauté, leur histoire ou leur capacité à provoquer un souvenir. Autour d’eux, un répertoire de <strong>296 adresses</strong> pour composer votre propre route.</p>
    <p class="body-copy">Neuf chapitres, neuf territoires. Chacun s’ouvre sur une carte, des repères et nos conseils de terrain. À la fin, trois itinéraires — quatre, sept ou dix jours — et un agenda pour attraper les fêtes au bon moment.</p>
    <div class="rule" style="margin-top:9mm"></div>
    <p class="serif-italic" style="margin-top:5mm;font-size:11pt;line-height:1.55;color:#11263a;max-width:88mm">« Le Bénin ne se raconte pas. Il se traverse, lentement, du sud au nord. »</p>
  </div>
  <aside class="map-col">
    <div class="map-col__frame">
      <img src="assets/benin-map.svg" alt="Carte des neuf territoires du Bénin">
    </div>
    <div class="intro__legend">
      ${chapters
        .map(
          (ch) =>
            `<div class="intro__legend-item"><b>${String(ch.n).padStart(2, '0')}</b><span>${esc(ch.short)}</span></div>`
        )
        .join('')}
    </div>
    <p class="map-col__label">Les numéros renvoient aux chapitres</p>
  </aside>
  <div class="intro__stats">
    <div><b>50</b><span>fiches</span></div>
    <div><b>32</b><span>sites &amp; plages</span></div>
    <div><b>12</b><span>tables</span></div>
    <div><b>06</b><span>hôtels</span></div>
    <div><b>296</b><span>adresses</span></div>
  </div>
  ${folio('Avant-propos', PAGES.intro)}
</section>`);

/* 05 — carte pleine page */
pages.push(`<section class="page map-full" data-name="carte">
  <div class="map-full__head">
    <p class="eyebrow">Le Bénin en neuf territoires</p>
    <h2 class="display">Une carte,<br><em>neuf chapitres.</em></h2>
    <p>Du littoral aux savanes du nord, chaque numéro correspond à un chapitre et à une région du guide. Les distances restent raisonnables : le pays se traverse en une journée de route, du sud au nord.</p>
  </div>
  <div class="map-full__map">
    <img src="assets/benin-map.svg" alt="Carte des neuf territoires du Bénin">
  </div>
  <div class="map-full__legend">
    ${chapters
      .map(
        (ch) => `<div class="map-full__item">
          <b>${String(ch.n).padStart(2, '0')}</b>
          <div><span>${esc(ch.title)}</span><small>${ch.fiches.length} fiche${ch.fiches.length > 1 ? 's' : ''} · pages ${String(PAGES[`ch${ch.n}`]).padStart(3, '0')}—${String(
          Math.max(...ch.fiches.map((f) => f.page))
        ).padStart(3, '0')}</small></div>
        </div>`
      )
      .join('')}
  </div>
  ${folio('Les neuf territoires', PAGES.map)}
</section>`);

/* 06 — mode d'emploi */
pages.push(`<section class="page howto" data-name="mode-emploi">
  <div class="howto__head">
    <p class="eyebrow">Mode d’emploi</p>
    <h2 class="display">Comment lire<br><em>les fiches.</em></h2>
    <p>Chaque lieu occupe une page. Les repères sont toujours au même endroit : vous pouvez ouvrir le guide au hasard et retrouver immédiatement l’essentiel.</p>
  </div>

  <div class="howto__anatomy">
    <div class="howto__diagram">
      <div class="howto__ph">Photo</div>
      <div class="howto__line howto__line--title">Titre &amp; promesse</div>
      <div class="howto__line howto__line--meta">Lieu · Durée · Moment · Niveau</div>
      <div class="howto__line howto__line--body">Le récit du lieu</div>
      <div class="howto__line howto__line--secret">Le conseil SecretScape</div>
      <div class="howto__line howto__line--foot">Y aller · Bon à savoir</div>
    </div>
    <ol class="howto__keys">
      <li><b>La photo</b><span>Un cadrage large, choisi pour donner l’envie avant l’information.</span></li>
      <li><b>Les repères</b><span>Lieu, durée conseillée, meilleur moment et niveau de secret.</span></li>
      <li><b>Le récit</b><span>Deux paragraphes pour comprendre le lieu, pas pour tout dire.</span></li>
      <li><b>Le conseil</b><span>L’astuce de terrain : l’heure, l’accès, le geste qui change la visite.</span></li>
      <li><b>Pratique</b><span>Adresse, accès et ce qu’il faut savoir avant de partir.</span></li>
    </ol>
  </div>

  <div class="howto__levels">
    <div class="howto__levels-head"><span>Les niveaux de secret</span><i></i></div>
    <div class="howto__level"><b>Accessible</b><p>Se trouve facilement, se visite sans guide. Idéal pour une première découverte.</p></div>
    <div class="howto__level"><b>Bien caché</b><p>Demande un détour, une piste ou un bateau. Prévoyez du temps et de l’eau.</p></div>
    <div class="howto__level"><b>Secret d’initié</b><p>Peu fréquenté, parfois fragile. Venez accompagné et respectez les usages.</p></div>
  </div>

  <div class="howto__cats">
    <div><span class="cat-dot cat-dot--site"></span><b>Site</b><p>Patrimoine, village, musée, paysage.</p></div>
    <div><span class="cat-dot cat-dot--plage"></span><b>Plage</b><p>Littoral, embouchure, presqu’île.</p></div>
    <div><span class="cat-dot cat-dot--table"></span><b>Table</b><p>Restaurant, grill, terrasse, maquis.</p></div>
    <div><span class="cat-dot cat-dot--hotel"></span><b>Hôtel</b><p>Guesthouse, maison d’hôtes, hôtel.</p></div>
  </div>
  ${folio('Mode d’emploi', PAGES.howto)}
</section>`);

/* 07 — le Bénin pratique */
pages.push(`<section class="page practical" data-name="pratique">
  <div class="practical__head">
    <p class="eyebrow">Carnet pratique</p>
    <h2 class="display">Le Bénin,<br><em>mode d’emploi.</em></h2>
  </div>

  <div class="practical__grid">
    <div class="practical__block">
      <h4>Quand partir</h4>
      <p><b>Novembre — mars.</b> Saison sèche, ciel clair, températures plus douces. La meilleure période pour le nord et les parcs.</p>
      <p><b>Avril — juillet.</b> Chaleurs et premières pluies. Le littoral reste agréable, les cascades se remplissent.</p>
      <p><b>Août — septembre.</b> Petite saison sèche sur la côte, souvent venteuse. Bonne période pour le sud.</p>
      <p><b>Octobre — novembre.</b> Pluies courtes, paysages verts. Les routes du nord peuvent être lentes.</p>
    </div>

    <div class="practical__block">
      <h4>Se déplacer</h4>
      <p><b>Voiture avec chauffeur.</b> La solution la plus confortable pour un itinéraire complet. Comptez 35 000 à 55 000 FCFA par jour, carburant et chauffeur inclus selon la saison.</p>
      <p><b>Zem et taxi-moto.</b> Rapides en ville, à négocier avant de monter. Casque recommandé.</p>
      <p><b>Bus et taxis-brousse.</b> Économiques entre les grandes villes ; départs le matin, durée variable.</p>
      <p><b>Vols intérieurs.</b> Cotonou — Parakou ou Natitingou selon la saison ; vérifiez les fréquences.</p>
    </div>

    <div class="practical__block">
      <h4>Argent</h4>
      <p><b>Monnaie.</b> Franc CFA (XOF), arrimé à l’euro. Les cartes bancaires passent dans les hôtels et les restaurants urbains, rarement ailleurs.</p>
      <p><b>Espèces.</b> Retirez à Cotonou ou Porto-Novo ; les distributeurs se raréfient au nord. Prévoyez une réserve.</p>
      <p><b>Mobile money.</b> MTN MoMo et Moov Money sont largement utilisés. Une carte SIM locale facilite les paiements.</p>
      <p><b>Pourboire.</b> Non obligatoire ; 5 à 10 % au restaurant, un montant symbolique pour un guide ou un batelier.</p>
    </div>

    <div class="practical__block">
      <h4>Santé &amp; sécurité</h4>
      <p><b>Vaccins.</b> Fièvre jaune obligatoire, hépatite A et B, typhoïde recommandés. Vérifiez les recommandations avant le départ.</p>
      <p><b>Paludisme.</b> Protection antimoustique et traitement préventif selon votre médecin.</p>
      <p><b>Eau.</b> Buvez en bouteille ou filtrée, même en ville. Évitez les glaçons dans les petits maquis.</p>
      <p><b>Sécurité.</b> Pas de problème majeur sur les itinéraires du guide ; évitez les déplacements de nuit et les zones frontalières isolées.</p>
    </div>

    <div class="practical__block">
      <h4>Usages &amp; politesse</h4>
      <p><b>Saluez toujours.</b> Un bonjour, un sourire et le nom du lieu ouvrent plus de portes qu’un billet.</p>
      <p><b>Photographiez avec accord.</b> Les visages, les cérémonies et certains lieux sacrés ne se photographient pas sans autorisation.</p>
      <p><b>Tenue.</b> Épaules et genoux couverts dans les lieux de culte, les villages traditionnels et les administrations.</p>
      <p><b>Négociation.</b> Au marché, elle fait partie du jeu ; dans les commerces et les hôtels, les prix sont affichés.</p>
    </div>

    <div class="practical__block">
      <h4>Budget indicatif</h4>
      <table class="budget">
        <tr><th></th><th>Petit budget</th><th>Confort</th><th>Premium</th></tr>
        <tr><td>Nuit</td><td class="num">10–25 k</td><td class="num">35–70 k</td><td class="num">90 k +</td></tr>
        <tr><td>Repas</td><td class="num">2–5 k</td><td class="num">8–18 k</td><td class="num">25 k +</td></tr>
        <tr><td>Transport</td><td>zem · taxi-brousse</td><td>voiture partagée</td><td>voiture privée</td></tr>
        <tr><td>Guide</td><td>5 k / visite</td><td>10 k / jour</td><td>20 k + / jour</td></tr>
      </table>
      <p class="budget-note">Montants en milliers de FCFA, par personne et par jour. Les prix varient selon la saison et l’éloignement.</p>
    </div>
  </div>

  <div class="practical__check">
    <b>La check-list avant de partir</b>
    <span>Passeport &amp; visa</span><span>Vaccin fièvre jaune</span><span>Anti-moustique</span><span>Adaptateur</span><span>Espèces</span><span>Assurance voyage</span><span>Chapeau &amp; gourde</span><span>Chaussures fermées</span>
  </div>
  ${folio('Le Bénin pratique', PAGES.practical)}
</section>`);

/* ---------------------------------------------------------------- chapitres */

const metaItem = (icon, key, value) =>
  `<div class="item"><svg class="ic"><use href="#i-${icon}"/></svg><div class="txt"><div class="k">${key}</div><div class="v">${value}</div></div></div>`;

for (const ch of chapters) {
  const lead = chapterLeads[ch.n];
  const first = ch.fiches.find((f) => f.id === chapterPhotos[ch.n]) || ch.fiches[0];
  const last = ch.fiches[ch.fiches.length - 1];

  pages.push(`<section class="page chapter" data-name="chapitre-${ch.n}">
  <div class="chapter__photo">
    <img src="${photo(first)}" alt="${esc(ch.title)}">
    <div class="chapter__veil"></div>
    <span class="credit">${esc(first.city)} · ${creditClass(first)}</span>
  </div>
  <div class="chapter__body">
    <div class="chapter__num">${String(ch.n).padStart(2, '0')}</div>
    <div class="chapter__kicker">
      <span class="eyebrow eyebrow--light">Chapitre ${String(ch.n).padStart(2, '0')}</span>
      <i></i>
      <span class="eyebrow eyebrow--light" style="color:rgba(250,246,238,.55)">${esc(ch.region)}</span>
    </div>
    <h2 class="chapter__title display">${esc(ch.title)}</h2>
    <p class="chapter__lead">${esc(lead.lead)}</p>
    <div class="chapter__contents">
      ${ch.fiches
        .map(
          (f) =>
            `<div class="chapter__item"><span>${String(f.page).padStart(3, '0')}</span>${esc(headline(f))}<b>· ${KIND[f.category]}</b></div>`
        )
        .join('')}
    </div>
    <div class="chapter__meta">
      <div class="chapter__places"><b>Dans ce chapitre</b>${esc(lead.text)}</div>
      <div class="chapter__pages">Pages ${String(PAGES[`ch${ch.n}`]).padStart(3, '0')} — ${String(last.page).padStart(3, '0')}</div>
    </div>
  </div>
</section>`);

  ch.fiches.forEach((f, idx) => {
    const isTable = f.category === 'restaurants' || f.category === 'hotels';
    const variantB = !isTable && idx % 2 === 1;
    const [p1, p2] = paragraphs(f);
    const s = secret(f);
    const h = headline(f);
    const ratingBlock = `<div class="rating"><b>${rating(f.rating)}</b><div class="stars">${stars(f.rating)}</div><small>${f.reviewCount ? `${f.reviewCount} avis` : 'Sélection SecretScape'}</small></div>`;

    if (!isTable && !variantB) {
      /* fiche A — photo pleine largeur */
      pages.push(`<section class="page fiche-a" data-name="fiche-${f.ficheNo}">
  <div class="fiche__head"><span><b>${String(ch.n).padStart(2, '0')}</b> — ${esc(ch.title)}</span><span>Fiche ${f.ficheNo} — ${KIND[f.category]}</span></div>
  ${ph(photo(f), h, `${f.city} · ${creditClass(f)}`, 'fiche-a__photo')}
  <div class="fiche-a__titleblock">
    <div><p class="eyebrow">${esc(f.city)} · ${esc(f.region)}</p><h2 class="fiche-a__title display">${esc(h)}</h2><p class="fiche-a__sub">${esc(f.subtitle)}</p></div>
    ${ratingBlock}
  </div>
  <div class="meta-strip">
    ${metaItem('pin', 'Lieu', esc(f.city))}
    ${metaItem('clock', 'Durée', duration(f.estimatedDurationMinutes))}
    ${metaItem('sun', 'Meilleur moment', esc(shortMoment(f.bestTimeToVisit)))}
    ${metaItem('compass', 'Niveau', LEVEL[f.secretLevel])}
  </div>
  <div class="fiche-a__body">
    <p class="body-copy">${esc(p1)}</p>
    <p class="body-copy">${esc(p2 || f.subtitle)}</p>
  </div>
  <div class="secret">
    <p class="eyebrow">Le conseil SecretScape</p>
    <p>${esc(s)}</p>
  </div>
  <div class="fiche-a__cols">
    <div class="mini-col"><h4>Y aller</h4><p>${esc(f.address)}</p><p style="margin-top:1.6mm">${esc(shortMoment(f.bestTimeToVisit))} · ${duration(f.estimatedDurationMinutes)} sur place.</p></div>
    <div class="mini-col"><h4>Bon à savoir</h4><div class="tags" style="margin-bottom:2mm">${f.tags.slice(0, 4).map((t) => `<span>${esc(t)}</span>`).join('')}</div><p>${esc(tip(f))}</p></div>
    <div class="mini-col"><h4>Repères</h4><p>${LEVEL[f.secretLevel]}<br>${CROWD[f.crowdLevel]}</p><p style="margin-top:1.6mm">${esc(f.region)} · Bénin</p></div>
  </div>
  ${folio(ch.title, f.page)}
</section>`);
    } else if (!isTable) {
      /* fiche B — photo à gauche + citation */
      pages.push(`<section class="page fiche-b" data-name="fiche-${f.ficheNo}">
  <div class="fiche__head"><span><b>${String(ch.n).padStart(2, '0')}</b> — ${esc(ch.title)}</span><span>Fiche ${f.ficheNo} — ${KIND[f.category]}</span></div>
  <div class="fiche-b__grid">
    <div>
      ${ph(photo(f), h, `${f.city} · ${creditClass(f)}`, 'fiche-b__photo')}
      <p class="fiche-b__caption">${esc(f.city)}, ${esc(f.region)}.</p>
      <div class="fiche-b__meta">
        <div class="row"><svg class="ic"><use href="#i-pin"/></svg><div><div class="k">Lieu</div><div class="v">${esc(f.city)}</div></div></div>
        <div class="row"><svg class="ic"><use href="#i-clock"/></svg><div><div class="k">Durée</div><div class="v">${duration(f.estimatedDurationMinutes)} sur place</div></div></div>
        <div class="row"><svg class="ic"><use href="#i-sun"/></svg><div><div class="k">Meilleur moment</div><div class="v">${esc(shortMoment(f.bestTimeToVisit))}</div></div></div>
        <div class="row"><svg class="ic"><use href="#i-compass"/></svg><div><div class="k">Niveau de secret</div><div class="v">${LEVEL[f.secretLevel]} · ${CROWD[f.crowdLevel]}</div></div></div>
      </div>
    </div>
    <div class="fiche-b__text">
      <p class="eyebrow">${esc(f.city)} · ${esc(f.region)}</p>
      <h2 class="fiche-b__title display">${esc(h)}</h2>
      <p class="fiche-b__sub">${esc(f.subtitle)}</p>
      <p class="body-copy">${esc(p1)}</p>
      ${p2 ? `<p class="body-copy" style="margin-top:3.4mm">${esc(p2)}</p>` : ''}
      <div class="secret secret--b"><p class="eyebrow">Le conseil SecretScape</p><p>${esc(s)}</p></div>
      <div class="mini-col" style="margin-top:5mm"><h4>Y aller</h4><p>${esc(f.address)}</p></div>
      <div class="mini-col" style="margin-top:4mm"><h4>Bon à savoir</h4><div class="tags" style="margin-bottom:2mm">${f.tags.slice(0, 4).map((t) => `<span>${esc(t)}</span>`).join('')}</div><p>${esc(tip(f))}</p></div>
    </div>
  </div>
  <div class="fiche-b__quote">
    <span class="qmark">“</span>
    <p>${esc(quote(f))}</p>
  </div>
  ${folio(ch.title, f.page)}
</section>`);
    } else {
      /* fiche C — table ou hôtel */
      const isHotel = f.category === 'hotels';
      pages.push(`<section class="page fiche-c ${isHotel ? 'fiche-c--hotel' : ''}" data-name="fiche-${f.ficheNo}">
  <div class="fiche__head"><span><b>${String(ch.n).padStart(2, '0')}</b> — ${esc(ch.title)}</span><span>Fiche ${f.ficheNo} — ${KIND[f.category]}</span></div>
  ${ph(photo(f), h, `${f.city} · ${creditClass(f)}`, 'fc__photo')}
  <div class="fc__head">
    <p class="eyebrow">${isHotel ? 'Où dormir' : 'Tables &amp; saveurs'} · ${esc(f.city)}</p>
    <h2 class="display">${esc(h)}</h2>
    <p class="fc__sub">${esc(f.subtitle)}</p>
  </div>
  <div class="fc__text">
    <div class="fc__meta">
      <div><span>${isHotel ? 'Adresse' : 'Cuisine'}</span><b>${isHotel ? esc(f.city) : esc((f.tags[1] || 'Africaine'))}</b></div>
      <div><span>Ambiance</span><b>${esc(f.tags[2] || 'Locale')}</b></div>
      <div><span>Moment</span><b>${esc(shortMoment(f.bestTimeToVisit))}</b></div>
      <div><span>Note</span><b>${rating(f.rating)} / 5</b></div>
    </div>
    <div class="fc__cols">
      <p class="body-copy">${esc(p1)}</p>
      <p class="body-copy">${esc(p2 || f.subtitle)}</p>
    </div>
  </div>
  <div class="fc__tip"><p class="eyebrow">Le conseil SecretScape</p><p>${esc(tip(f))}</p></div>
  <div class="fc__facts">
    <div><span>Y aller</span><p>${esc(f.address)}</p></div>
    <div><span>${isHotel ? 'Niveau' : 'Le secret'}</span><p>${esc(s)}</p></div>
    <div class="fc__facts-badge"><span>${KIND[f.category]}</span><b>${f.ficheNo}</b></div>
  </div>
  ${folio(ch.title, f.page)}
</section>`);
    }
  });
}

/* ------------------------------------------------------------- itinéraires */

const itinNav = (active) =>
  `<div class="itin__tabs"><span class="itin__tab${active === 4 ? ' on' : ''}">4 jours</span><span class="itin__tab${active === 7 ? ' on' : ''}">7 jours</span><span class="itin__tab${active === 10 ? ' on' : ''}">10 jours</span></div>`;

pages.push(`<section class="page itin-intro" data-name="itineraires">
  <div class="itin__head">
    <p class="eyebrow">Carnet pratique · Itinéraires</p>
    <h2 class="itin__title display">Trois routes,<br><em>trois durées.</em></h2>
    <p class="itin__lead">Le Bénin se parcourt du sud au nord en une longue journée de route. Ces trois itinéraires sont des squelettes : ils indiquent les étapes, les nuits et les temps forts. À vous d’ajouter les détours, les siestes et les marchés.</p>
  </div>
  <div class="itin-intro__grid">
    <div class="itin-card">
      <div class="itin-card__n">04</div>
      <h3>L’essentiel du littoral</h3>
      <p class="itin-card__sub">Cotonou · Ganvié · Ouidah · Grand-Popo</p>
      <p>Quatre jours pour comprendre le pays par sa côte : la ville, la lagune, la mémoire et l’embouchure du Mono. Idéal pour un premier séjour ou un long week-end.</p>
      <div class="itin-card__meta"><span>3 nuits</span><span>Route : 220 km</span><span>Pages ${String(PAGES.itin4).padStart(3, '0')}</span></div>
    </div>
    <div class="itin-card itin-card--dark">
      <div class="itin-card__n">07</div>
      <h3>Du littoral aux savanes</h3>
      <p class="itin-card__sub">Cotonou · Ouidah · Abomey · Dassa · Atacora</p>
      <p>La traversée classique, celle qui fait passer du golfe de Guinée aux plateaux de l’Atacora. Deux jours de côte, deux jours d’histoire, trois jours de route du nord.</p>
      <div class="itin-card__meta"><span>6 nuits</span><span>Route : 900 km</span><span>Pages ${String(PAGES.itin7).padStart(3, '0')}</span></div>
    </div>
    <div class="itin-card">
      <div class="itin-card__n">10</div>
      <h3>Le grand tour</h3>
      <p class="itin-card__sub">Le littoral · le Zou · l’Ouémé · l’Atacora · le Borgou</p>
      <p>Dix jours pour ajouter Porto-Novo, les collines de Dassa, la Pendjari et le pays Tanéka. Un itinéraire plus lent, avec deux vraies journées de safari.</p>
      <div class="itin-card__meta"><span>9 nuits</span><span>Route : 1 500 km</span><span>Pages ${String(PAGES.itin10).padStart(3, '0')}</span></div>
    </div>
  </div>
  <div class="itin-intro__note">
    <b>Comment lire les itinéraires</b>
    <p>Les temps de route sont donnés à titre indicatif, en voiture privée. Ajoutez 20 à 30 % en saison des pluies. Les nuits sont proposées dans les villes-étapes ; le répertoire en fin d’ouvrage donne les adresses.</p>
  </div>
  ${folio('Trois itinéraires, de 4 à 10 jours', PAGES.itinIntro)}
</section>`);

const day = (n, title, place, text, night) =>
  `<div class="itin__day">
    <div class="itin__daynum">J${n}</div>
    <div class="itin__daytitle">${esc(title)}<small>${esc(place)}</small></div>
    <div class="itin__daytext">${text}${night ? ` <b>Nuit :</b> ${esc(night)}.` : ''}</div>
  </div>`;

const itin4 = [
  [1, 'Cotonou', 'Littoral', 'Fondation Zinsou le matin, déjeuner à Fidjrossè, coucher de soleil sur la plage. En soirée, dîner chez Jaaba.', 'Cotonou'],
  [2, 'Ganvié', 'Lac Nokoué', 'Pirogue à l’aube depuis Sô-Ava, déjeuner chez Raphaël, retour par le marché Ganhi. Fin de journée à la Place de l’Amazone.', 'Cotonou'],
  [3, 'Ouidah', 'Route des Esclaves', 'Porte du Non-Retour, Temple des Pythons, Musée du Vodun. Déjeuner au Musée du Soleil, puis plage de Djégbadji.', 'Ouidah'],
  [4, 'Grand-Popo', 'Embouchure du Mono', 'La Bouche du Roi à marée montante, déjeuner à La Boca del Rio, plage d’Avlékété avant le retour.', 'Grand-Popo ou Cotonou'],
];

const itin7 = [
  [1, 'Cotonou', 'Littoral', 'Fondation Zinsou, marché Ganhi, déjeuner à Fidjrossè. Coucher de soleil sur la plage, dîner chez Jaaba.', 'Cotonou'],
  [2, 'Ganvié', 'Lac Nokoué', 'Pirogue à l’aube, déjeuner chez Raphaël, retour par le marché. Fin d’après-midi à la Place de l’Amazone.', 'Cotonou'],
  [3, 'Ouidah', 'Route des Esclaves', 'Porte du Non-Retour, Temple des Pythons, Musée du Vodun, plage de Djégbadji. Déjeuner au Musée du Soleil.', 'Ouidah'],
  [4, 'Grand-Popo', 'Embouchure du Mono', 'La Bouche du Roi à marée montante, plage d’Avlékété, dîner à La Boca del Rio.', 'Grand-Popo'],
  [5, 'Abomey', 'Pays du Zou', 'Palais royaux, ateliers de bas-reliefs, village d’Agongointo. Route vers Dassa en fin de journée.', 'Dassa'],
  [6, 'Dassa', 'Collines sacrées', 'Montée aux collines et à la basilique au lever du jour. Route vers Natitingou, pause à Parakou.', 'Natitingou'],
  [7, 'Atacora', 'Pays Somba', 'Tata Somba de Boukoumbé, cascades de Tanougou, retour vers Cotonou ou nuit sur place.', 'Natitingou ou Cotonou'],
];

const itin10 = [
  [1, 'Cotonou', 'Littoral', 'Fondation Zinsou, marché Ganhi, plage de Fidjrossè au coucher du soleil.', 'Cotonou'],
  [2, 'Ganvié', 'Lac Nokoué', 'Pirogue à l’aube, déjeuner chez Raphaël, retour par le marché Ganhi.', 'Cotonou'],
  [3, 'Ouidah', 'Route des Esclaves', 'Porte du Non-Retour, Temple des Pythons, Musée du Vodun, plage de Djégbadji.', 'Ouidah'],
  [4, 'Grand-Popo', 'Embouchure du Mono', 'La Bouche du Roi, lac Toho, plage d’Avlékété, dîner à La Boca del Rio.', 'Grand-Popo'],
  [5, 'Abomey', 'Pays du Zou', 'Palais royaux, ateliers de bas-reliefs, village souterrain d’Agongointo.', 'Abomey ou Bohicon'],
  [6, 'Dassa', 'Collines sacrées', 'Collines et basilique au lever du jour, route vers Porto-Novo par la RNIE 2.', 'Porto-Novo'],
  [7, 'Porto-Novo', 'Ouémé', 'Musée Honmè, Grande Mosquée, poterie d’Adjarra, plage de Sèmè-Kpodji.', 'Porto-Novo'],
  [8, 'Atacora', 'Pays Somba', 'Longue route vers Natitingou, tata Somba de Boukoumbé en fin de journée.', 'Natitingou'],
  [9, 'Pendjari', 'Savanes du nord', 'Safari matinal dans la Pendjari, cascades de Tanougou au retour.', 'Tanguiéta'],
  [10, 'Nikki', 'Borgou', 'Palais de Nikki, arène de la Gaani, banque culturelle Tanéka. Retour vers Cotonou.', 'Cotonou'],
];

pages.push(`<section class="page itin" data-name="itineraire-4-jours">
  <div class="itin__head">
    <p class="eyebrow">Carnet pratique · Itinéraire</p>
    <h2 class="itin__title display">Quatre jours,<br><em>le long de l’eau.</em></h2>
    <p class="itin__lead">Le format court : Cotonou, la lagune, Ouidah et l’embouchure du Mono. Une boucle sans longue route, à faire en voiture privée ou en taxis-brousse pour les plus courageux.</p>
    ${itinNav(4)}
  </div>
  <div class="itin__days itin__days--short">${itin4.map((d) => day(...d)).join('')}</div>
  <div class="itin__variants">
    <div class="itin__variant"><div class="n">7</div><div><h4>La version longue</h4><p>Prolongez par Abomey, Dassa et l’Atacora : l’itinéraire de sept jours ajoute trois étapes et deux jours de route.</p></div></div>
    <div class="itin__variant"><div class="n">+</div><div><h4>Le détour</h4><p>Ajoutez une nuit à Grand-Popo pour prendre le bateau sur le lac Toho et voir les caïmans sacrés au coucher du soleil.</p></div></div>
  </div>
  ${folio('Quatre jours, le long de l’eau', PAGES.itin4)}
</section>`);

pages.push(`<section class="page itin" data-name="itineraire-7-jours">
  <div class="itin__head">
    <p class="eyebrow">Carnet pratique · Itinéraire</p>
    <h2 class="itin__title display">Sept jours,<br>du littoral aux <em>savanes.</em></h2>
    <p class="itin__lead">Le grand tour classique, pensé pour prendre le temps : deux jours sur la côte, un détour par l’histoire, puis la route du nord jusqu’aux savanes. Toutes les étapes sont reliées en voiture avec chauffeur.</p>
    ${itinNav(7)}
  </div>
  <div class="itin__days">${itin7.map((d) => day(...d)).join('')}</div>
  <div class="itin__variants">
    <div class="itin__variant"><div class="n">4</div><div><h4>La version courte</h4><p>Cotonou · Ganvié · Ouidah · Grand-Popo. L’essentiel du littoral, sans le nord.</p></div></div>
    <div class="itin__variant"><div class="n">10</div><div><h4>La version longue</h4><p>Ajoutez Porto-Novo, la Pendjari et le pays Tanéka. Le guide détaille les étapes et les temps de route.</p></div></div>
  </div>
  ${folio('Sept jours, du littoral aux savanes', PAGES.itin7)}
</section>`);

pages.push(`<section class="page itin itin--wide" data-name="itineraire-10-jours">
  <div class="itin__head">
    <p class="eyebrow">Carnet pratique · Itinéraire</p>
    <h2 class="itin__title display">Dix jours,<br><em>le grand tour.</em></h2>
    <p class="itin__lead">Le parcours complet : le littoral, le Zou, l’Ouémé, l’Atacora et le Borgou. Deux journées de safari, une nuit à Porto-Novo, et le temps de ralentir entre deux étapes.</p>
    ${itinNav(10)}
  </div>
  <div class="itin__days itin__days--double">${itin10.map((d) => day(...d)).join('')}</div>
  <div class="itin__variants">
    <div class="itin__variant"><div class="n">4</div><div><h4>Le raccourci</h4><p>Si le temps manque, gardez le littoral et le Zou, puis rentrez par la côte.</p></div></div>
    <div class="itin__variant"><div class="n">+</div><div><h4>Le supplément</h4><p>Une nuit de plus à Tanguiéta permet de faire le safari du matin et les cascades l’après-midi.</p></div></div>
  </div>
  ${folio('Dix jours, le grand tour', PAGES.itin10)}
</section>`);

/* ------------------------------------------------------------------ agenda */

const eventDate = (e) => {
  if (!e.startDate) return { month: e.monthYear, days: e.dayRange || '—' };
  const start = new Date(e.startDate + 'T12:00:00');
  const end = e.endDate ? new Date(e.endDate + 'T12:00:00') : null;
  const month = start.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase();
  const days = end && end.getMonth() === start.getMonth() ? `${start.getDate()}–${end.getDate()}` : String(start.getDate());
  return { month, days, year: start.getFullYear() };
};

const AGENDA_NOTES = {
  weloveya: 'Concerts et DJ sets pour finir l’année au rythme de Cotonou.',
  'festival-masques': 'Masques, danses et processions dans les rues de Porto-Novo.',
  jistna: 'Sports traditionnels et culture en fête, sur plusieurs jours.',
  gaani: 'La grande fête des chevaux et de la culture baatonu à Nikki.',
  finab: 'Les arts du Bénin réunis dans une biennale ouverte à toutes les disciplines.',
  festichill: 'Musique, plage et ambiance chill sur le littoral.',
  'chill-and-groove': 'Concerts et découvertes musicales dans une ambiance décontractée.',
};

const events = [...data.agenda].sort((a, b) => {
  if (!a.startDate && !b.startDate) return 0;
  if (!a.startDate) return 1;
  if (!b.startDate) return -1;
  return a.startDate.localeCompare(b.startDate);
});
const eventNote = (e) => e.description || AGENDA_NOTES[e.id] || '';

pages.push(`<section class="page agenda" data-name="agenda-1">
  <div class="agenda__head">
    <p class="eyebrow">Carnet pratique · Agenda</p>
    <h2 class="display">Les fêtes<br><em>à ne pas manquer.</em></h2>
    <p>Le Bénin vit au rythme de ses cérémonies. Voici les rendez-vous qui peuvent justifier à eux seuls un voyage — et qui demandent, parfois, de réserver plusieurs mois à l’avance.</p>
  </div>
  <div class="agenda__grid">
    ${events
      .slice(0, 4)
      .map((e) => {
        const d = eventDate(e);
        return `<article class="agenda-card">
          <div class="agenda-card__date"><b>${d.days}</b><span>${esc(d.month)}</span></div>
          <div class="agenda-card__body"><h3>${esc(e.title)}</h3><p>${esc(eventNote(e))}</p><small>${esc(e.monthYear)}${e.url ? ' · ' + esc(e.url.replace(/^https?:\/\//, '').replace(/\/$/, '')) : ''}</small></div>
        </article>`;
      })
      .join('')}
  </div>
  <div class="agenda__note"><b>Le bon réflexe</b><p>Les dates de certaines fêtes sont annoncées tardivement. Vérifiez auprès de l’office de tourisme ou des organisateurs avant de bloquer vos billets.</p></div>
  ${folio('L’agenda des fêtes', PAGES.agenda1)}
</section>`);

pages.push(`<section class="page agenda agenda--calendar" data-name="agenda-2">
  <div class="agenda__head agenda__head--small">
    <p class="eyebrow">Carnet pratique · Calendrier</p>
    <h2 class="display">L’année<br><em>en un regard.</em></h2>
    <p>Huit rendez-vous, classés dans l’ordre du calendrier. Les dates annoncées sont indicatives : elles peuvent varier selon les années et les décisions des organisateurs.</p>
  </div>
  <div class="agenda-list">
    ${events
      .map((e) => {
        const d = eventDate(e);
        return `<div class="agenda-row"><div class="agenda-row__date"><b>${d.days}</b><span>${esc(d.month)}</span></div><div class="agenda-row__title">${esc(e.title)}<small>${esc(eventNote(e))}</small></div><div class="agenda-row__year">${esc(e.startDate ? e.monthYear : '')}</div></div>`;
      })
      .join('')}
  </div>
  <div class="agenda__advice">
    <div><b>Janvier</b><p>Vodun Days à Cotonou et Ouidah : le pays se met à l’heure des cultures vodun. Réservez tôt.</p></div>
    <div><b>Août</b><p>Festival des Masques à Porto-Novo et pèlerinage d’Arigbo à Dassa. Chaleur et pluies courtes.</p></div>
    <div><b>Décembre</b><p>Weloveya ouvre la saison des festivals, entre plage et concerts. La saison sèche s’installe, les routes du nord rouvrent.</p></div>
  </div>
  ${folio('L’année en un regard', PAGES.agenda2)}
</section>`);

/* --------------------------------------------------------------- répertoire */

const dirItem = (d) =>
  `<div class="dir-item"><span class="dir-name">${esc(d.title)}</span><span class="dir-meta">${esc(d.city)} · ${CAT_SHORT[d.category] || d.category}</span></div>`;

const dirBlock = (b) =>
  b.type === 'region'
    ? `<div class="dir-region"><b>${esc(b.label)}</b><span>${b.count} adresses</span></div>`
    : b.type === 'cont'
      ? `<div class="dir-region dir-region--cont"><b>${esc(b.label)}</b><span>suite</span></div>`
      : dirItem(b.item);

pages.push(`<section class="page directory directory--intro" data-name="repertoire-1">
  <div class="directory__head">
    <p class="eyebrow">Carnet pratique · Répertoire</p>
    <h2 class="display">296 adresses,<br><em>classées par région.</em></h2>
    <p>Le guide ne retient que cinquante lieux, mais le répertoire rassemble toutes les adresses de la base SecretScape : sites, plages, tables, bars, hôtels et transports. Utilisez-le pour composer vos propres détours.</p>
  </div>
  <div class="directory__stats">
    <div><b>296</b><span>adresses</span></div>
    <div><b>12</b><span>régions</span></div>
    <div><b>42</b><span>villes</span></div>
    <div><b>06</b><span>catégories</span></div>
  </div>
  <div class="dir-flow dir-flow--first">
    ${dirPages[0].map(dirBlock).join('')}
  </div>
  ${folio('Le répertoire des 296 adresses', PAGES.dirIntro)}
</section>`);

for (let i = 1; i < dirPages.length; i++) {
  const pageNo = PAGES[`dir${i + 1}`];
  pages.push(`<section class="page directory" data-name="repertoire-${i + 1}">
  <div class="directory__running"><span>Répertoire</span><span>${String(pageNo).padStart(3, '0')}</span></div>
  <div class="dir-flow">
    ${dirPages[i].map(dirBlock).join('')}
  </div>
  ${folio('Le répertoire des 296 adresses', pageNo)}
</section>`);
}

/* -------------------------------------------------------------------- index */

const indexEntries = [...data.selection]
  .sort((a, b) => headline(a).localeCompare(headline(b), 'fr'))
  .map((s) => `<div class="index-row"><span class="index-name">${esc(headline(s))}</span><span class="dots"></span><span class="index-page">${String(s.page).padStart(3, '0')}</span></div>`)
  .join('');

pages.push(`<section class="page index" data-name="index">
  <div class="index__head">
    <p class="eyebrow">Index</p>
    <h2 class="display">Retrouver<br><em>un lieu.</em></h2>
    <p>Les cinquante fiches par ordre alphabétique. Les numéros renvoient aux pages imprimées.</p>
  </div>
  <div class="index__list">${indexEntries}</div>
  <div class="index__cats">
    <div><b>Par catégorie</b><p>Sites &amp; plages — 32<br>Tables — 12<br>Hôtels — 6</p></div>
    <div><b>Par région</b><p>${chapters.map((ch) => `${esc(ch.short)} — ${ch.fiches.length}`).join('<br>')}</p></div>
    <div><b>Par niveau</b><p>Accessible — ${data.selection.filter((s) => s.secretLevel === 'facile').length}<br>Bien caché — ${data.selection.filter((s) => s.secretLevel === 'moyen').length}<br>Secret d’initié — ${data.selection.filter((s) => s.secretLevel === 'insider').length}</p></div>
  </div>
  ${folio('Index', PAGES.index)}
</section>`);

/* ------------------------------------------------------------------ crédits */

const creditGroups = [
  { key: 'cc', label: 'Wikimedia Commons', note: 'Images sous licence Creative Commons — crédits complets sur secretscape.com/crédits.' },
  { key: 'libre', label: 'Unsplash', note: 'Images libres de droits, utilisées pour illustrer les lieux lorsque aucune photographie propre n’était disponible.' },
  { key: 'projet', label: 'SecretScape & partenaires', note: 'Images fournies par SecretScape ou ses partenaires. Tous droits réservés.' },
  { key: 'tiers', label: 'Photos de tiers', note: 'Images issues de la base SecretScape ; les droits doivent être confirmés avant toute réédition imprimée.' },
];

pages.push(`<section class="page credits" data-name="credits">
  <div class="credits__head">
    <p class="eyebrow">Crédits &amp; mentions</p>
    <h2 class="display">Le guide,<br><em>en coulisses.</em></h2>
  </div>
  <div class="credits__grid">
    <div class="credits__main">
      ${creditGroups
        .map(
          (g) => `<div class="credits__group"><h4>${g.label}</h4><p class="credits__note">${g.note}</p><p class="credits__names">${photos
            .filter((p) => p.rights === g.key)
            .map((p) => esc(p.title))
            .join(' · ')}</p></div>`
        )
        .join('')}
      <div class="credits__group"><h4>Édition</h4><p>SecretScape — Édition 2026. Guide numérique au format A4. Direction éditoriale : SecretScape Studio. Typographies : Playfair Display (SIL Open Font License) et Poppins (SIL Open Font License).</p></div>
    </div>
    <div class="credits__legal">
      <h4>Mentions légales</h4>
      <p>Ce guide est une œuvre originale protégée par le droit d’auteur. Toute reproduction, diffusion ou revente, même partielle, est interdite sans autorisation écrite de SecretScape.</p>
      <p>Les informations pratiques (horaires, tarifs, accès, coordonnées) ont été vérifiées au moment de la rédaction. Elles peuvent évoluer : confirmez toujours auprès des lieux avant de vous déplacer.</p>
      <p>Les lieux sacrés, les villages et les personnes photographiées ne sont pas des attractions. Demandez l’autorisation, respectez les usages et ne laissez rien derrière vous.</p>
      <h4>Contact</h4>
      <p>secretscape.com<br>contact@secretscape.com</p>
      <p class="credits__edition">Édition 2026 · Version 1.0<br>© SecretScape — Tous droits réservés</p>
    </div>
  </div>
  ${folio('Crédits & mentions', PAGES.credits)}
</section>`);

/* ---------------------------------------------------------------------- dos */

pages.push(`<section class="page back" data-name="quatrieme-de-couverture">
  <img class="back__map" src="assets/benin-outline.svg" alt="">
  <p class="back__specimen">Édition 2026 · 79 pages</p>
  <div class="back__inner">
    <div class="monogram back__mono">SS</div>
    <p class="back__title">Le Bénin ne se visite pas.<br>Il se découvre.</p>
    <div class="back__rule"></div>
    <div class="back__contents">
      <div><b>50</b>fiches</div><i></i>
      <div><b>09</b>chapitres</div><i></i>
      <div><b>03</b>itinéraires</div><i></i>
      <div><b>296</b>adresses</div>
    </div>
    <p class="back__text">Un guide pensé pour le voyageur curieux : à feuilleter avant de partir, à garder sous la main pendant la route, à transmettre à ceux qui prendront le même chemin.</p>
  </div>
  <div class="back__foot">
    <div class="wordmark">Secret<span>Scape</span></div>
    <p>Guide numérique · Format A4 · Édition 2026<br>© SecretScape — Tous droits réservés</p>
  </div>
</section>`);

/* ------------------------------------------------------------------- write */

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>SecretScape — Bénin, les lieux secrets</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3 2.7 5.7 6.3.8-4.6 4.4 1.2 6.2L12 17.2 6.4 20.1l1.2-6.2L3 9.5l6.3-.8L12 3Z"/></symbol>
  <symbol id="i-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></symbol>
</svg>

${pages.join('\n\n')}

<script>
(function () {
  function runAudit() {
    try {
      const PX_PER_MM = 96 / 25.4;
      const rows = [];
      document.querySelectorAll('section.page').forEach((page, i) => {
        const name = page.getAttribute('data-name') || ('page-' + (i + 1));
        const pr = page.getBoundingClientRect();
        const issues = [];
        page.querySelectorAll('img').forEach((img) => {
          if (!img.complete || img.naturalWidth === 0) issues.push('img:' + img.getAttribute('src'));
        });
        let maxBottom = 0;
        const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (!node.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          Array.from(range.getClientRects()).forEach((r) => {
            maxBottom = Math.max(maxBottom, r.bottom - pr.top);
          });
        }
        if (maxBottom > pr.height + 0.5) issues.push('text-below:' + ((maxBottom - pr.height) / PX_PER_MM).toFixed(1) + 'mm');
        if (page.scrollWidth > page.clientWidth + 1 && !page.classList.contains('back')) issues.push('h-overflow');

        const decorative =
          page.classList.contains('cover') ||
          page.classList.contains('chapter') ||
          page.classList.contains('back') ||
          page.classList.contains('inside');
        const kids = [];
        Array.from(page.children).forEach((el) => {
          if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
          if (el.classList.contains('credit')) return;
          const r = el.getBoundingClientRect();
          if (r.width < 1 || r.height < 1) return;
          const cls = (el.className || el.tagName).toString().split(' ')[0];
          kids.push({ cls: cls, r: r });
          if (!decorative && (r.bottom > pr.bottom + 0.5 || r.right > pr.right + 0.5)) {
            issues.push('out:' + cls);
          }
        });
        if (!decorative) {
          for (let a = 0; a < kids.length; a++) {
            for (let b = a + 1; b < kids.length; b++) {
              const A = kids[a].r;
              const B = kids[b].r;
              const w = Math.min(A.right, B.right) - Math.max(A.left, B.left);
              const h = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
              if (w > PX_PER_MM && h > PX_PER_MM) {
                issues.push('overlap:' + kids[a].cls + '/' + kids[b].cls + ' ' + ((w * h) / PX_PER_MM / PX_PER_MM).toFixed(0) + 'mm2');
              }
            }
          }
        }
        page.querySelectorAll('*').forEach((el) => {
          if (el === page) return;
          if (el.classList.contains('ph') || el.tagName === 'IMG') return;
          const cs = getComputedStyle(el);
          if (cs.overflow === 'hidden' && el.scrollHeight > el.clientHeight + 4) {
            const cls = (el.className || el.tagName).toString().split(' ')[0];
            issues.push('clip:' + cls);
          }
        });

        rows.push(name + ' => ' + (issues.length ? issues.join(', ') : 'ok') + ' | text ' + (maxBottom / PX_PER_MM).toFixed(1) + 'mm');
      });
      const pre = document.createElement('pre');
      pre.id = 'audit';
      pre.textContent = 'AUDIT ' + rows.length + ' pages\\n' + rows.join('\\n');
      document.body.appendChild(pre);
    } catch (e) {
      const pre = document.createElement('pre');
      pre.id = 'audit';
      pre.textContent = 'AUDIT ERROR: ' + e.message + '\\n' + e.stack;
      document.body.appendChild(pre);
    }
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(runAudit);
  else window.addEventListener('load', runAudit);
})();
</script>
</body>
</html>`;

writeFileSync(join(here, 'guide.html'), html, 'utf8');
console.log(`✓ guide.html — ${pages.length} pages, ${TOTAL} pages numérotées`);
console.log('  répertoire :', DIR_PAGES, 'pages');
