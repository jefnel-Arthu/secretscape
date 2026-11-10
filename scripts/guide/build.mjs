/**
 * SecretScape — build des PDF du guide « Bénin, les lieux secrets »
 *
 * 1. Projette l’outline du Bénin et génère deux SVG (carte + silhouette).
 * 2. Génère le HTML du guide (content.mjs) ou imprime le spécimen.
 * 3. Ouvre le HTML dans Chrome headless et imprime le PDF.
 * 4. Vérifie le nombre de pages et signale les débordements / images manquantes.
 *
 * Usage :
 *   node scripts/guide/build.mjs guide      → guide complet (~79 pages)
 *   node scripts/guide/build.mjs specimen   → maquette de 10 pages
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const assets = join(here, 'assets');
const outDir = join(here, 'out');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const mode = (process.argv[2] || 'guide').toLowerCase();
if (!['guide', 'specimen'].includes(mode)) {
  console.error(`Mode inconnu : ${mode}. Utilisez « guide » ou « specimen ».`);
  process.exit(1);
}

/* ------------------------------------------------------------------ carte */

const geo = JSON.parse(readFileSync(join(assets, 'benin.geo.json'), 'utf8'));
const ring = geo.features[0].geometry.coordinates[0];

const LAT0 = 9.4;
const K = Math.cos((LAT0 * Math.PI) / 180);
const points = ring.map(([lng, lat]) => [lng * K, lat]);

const minX = Math.min(...points.map((p) => p[0]));
const maxX = Math.max(...points.map((p) => p[0]));
const minY = Math.min(...points.map((p) => p[1]));
const maxY = Math.max(...points.map((p) => p[1]));

const W = 310;
const H = 640;
const PAD = 16;
const scale = Math.min((W - PAD * 2) / (maxX - minX), (H - PAD * 2) / (maxY - minY));
const drawW = (maxX - minX) * scale;
const drawH = (maxY - minY) * scale;
const ox = (W - drawW) / 2;
const oy = (H - drawH) / 2;

const project = ([lng, lat]) => {
  const x = ox + (lng * K - minX) * scale;
  const y = oy + (maxY - lat) * scale;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
};

const outline =
  points
    .map((p, i) => {
      const [x, y] = project([p[0] / K, p[1]]);
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ') + ' Z';

const chapters = [
  { n: '01', anchor: [2.42, 6.36], pos: [2.42, 6.13] },
  { n: '02', anchor: [2.09, 6.37], pos: [2.02, 6.12] },
  { n: '03', anchor: [1.88, 6.28], pos: [1.58, 6.2] },
  { n: '04', anchor: [1.99, 7.18], pos: [1.99, 7.18] },
  { n: '05', anchor: [2.6, 6.49], pos: [2.8, 6.19] },
  { n: '06', anchor: [2.37, 7.78], pos: [2.37, 7.78] },
  { n: '07', anchor: [1.38, 10.3], pos: [1.61, 10.32] },
  { n: '08', anchor: [3.13, 11.13], pos: [3.01, 11.1] },
  { n: '09', anchor: [1.68, 6.93], pos: [1.93, 6.78] },
];

const markers = chapters
  .map(({ n, anchor, pos }) => {
    const [ax, ay] = project(anchor);
    const [x, y] = project(pos);
    const moved = Math.hypot(x - ax, y - ay) > 2;
    const leader = moved
      ? `<line x1="${ax}" y1="${ay}" x2="${x}" y2="${y}" stroke="#ac854b" stroke-width="0.9" opacity="0.55"/><circle cx="${ax}" cy="${ay}" r="2.2" fill="#ac854b"/>`
      : '';
    return `${leader}<circle cx="${x}" cy="${y}" r="14" fill="#faf6ee"/><circle cx="${x}" cy="${y}" r="11.5" fill="#11263a" stroke="#ac854b" stroke-width="1.4"/><text x="${x}" y="${y + 4.4}" text-anchor="middle" font-family="Poppins, Helvetica, Arial, sans-serif" font-size="12" font-weight="600" fill="#faf6ee">${n}</text>`;
  })
  .join('\n  ');

const mapSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <path d="${outline}" fill="#efe4cf" stroke="#11263a" stroke-width="1.2" stroke-linejoin="round"/>
  ${markers}
</svg>
`;

const outlineSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <path d="${outline}" fill="none" stroke="#cdb083" stroke-width="1.6" stroke-linejoin="round"/>
</svg>
`;

writeFileSync(join(assets, 'benin-map.svg'), mapSvg, 'utf8');
writeFileSync(join(assets, 'benin-outline.svg'), outlineSvg, 'utf8');
console.log('✓ SVG carte générés');

/* --------------------------------------------------------------- contenu */

if (mode === 'guide') {
  await import(pathToFileURL(join(here, 'content.mjs')).href);
}

const htmlPath = join(here, mode === 'guide' ? 'guide.html' : 'specimen.html');
const pdfPath = join(outDir, mode === 'guide' ? 'secret-scape-guide.pdf' : 'secret-scape-specimen.pdf');

if (!existsSync(htmlPath)) {
  console.error(`✗ ${htmlPath} introuvable`);
  process.exit(1);
}

const html = readFileSync(htmlPath, 'utf8');
const expectedPages = (html.match(/<section class="page/g) || []).length;

mkdirSync(outDir, { recursive: true });

/* -------------------------------------------------------------------- PDF */

const profileDir = join(tmpdir(), 'opencode', mode === 'guide' ? 'ss-guide-profile' : 'ss-specimen-profile');
const commonArgs = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--allow-file-access-from-files',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  `--user-data-dir=${profileDir}`,
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=20000',
];

console.log(`→ impression Chrome (${mode})…`);
execFileSync(
  chrome,
  [...commonArgs, '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href],
  { stdio: 'inherit' }
);

if (!existsSync(pdfPath)) {
  console.error('✗ PDF non généré');
  process.exit(1);
}

const pdf = readFileSync(pdfPath, 'latin1');
const pageCount = (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`✓ PDF généré : ${pdfPath}`);
console.log(`  pages PDF : ${pageCount} (HTML : ${expectedPages})`);
console.log(`  taille    : ${(readFileSync(pdfPath).length / 1024 / 1024).toFixed(2)} Mo`);

if (pageCount !== expectedPages) {
  console.warn(`⚠ écart de pagination : ${expectedPages} sections HTML, ${pageCount} pages PDF`);
}

/* ------------------------------------------------------------------ audit */

console.log('→ audit de mise en page…');
let auditText = '';
try {
  const dom = execFileSync(
    chrome,
    [...commonArgs, '--dump-dom', pathToFileURL(htmlPath).href],
    { encoding: 'utf8', maxBuffer: 96 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }
  );
  const match = dom.match(/<pre id="audit">([\s\S]*?)<\/pre>/);
  if (match) {
    auditText = match[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();
  }
} catch (error) {
  auditText = `AUDIT ERROR: ${error.message}`;
}

if (auditText) {
  writeFileSync(join(outDir, `${mode}-audit.txt`), auditText + '\n', 'utf8');
  const lines = auditText.split('\n');
  const problems = lines.filter((line) => line.includes('=>') && !line.includes('=> ok'));
  console.log(lines[0] || 'audit vide');
  if (problems.length) {
    console.log('⚠ pages à corriger :');
    for (const line of problems) console.log('  ' + line);
  } else {
    console.log('✓ aucune image manquante ni débordement de texte');
  }
} else {
  console.warn('⚠ audit indisponible');
}
