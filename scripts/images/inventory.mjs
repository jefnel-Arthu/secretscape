// Inventaire des images externes référencées dans le code source.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src');
const URL_RE = /https?:\/\/[^\s"'`)<>\]]+/g;

const isImageUrl = (url) =>
  /\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(url) ||
  /^https:\/\/images\.unsplash\.com\/photo-/.test(url) ||
  /^https:\/\/blogger\.googleusercontent\.com\//.test(url);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|css|json)$/i.test(entry.name)) out.push(p);
  }
  return out;
}

const byUrl = new Map();
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(URL_RE)) {
    const url = m[0].replace(/[.,;]+$/, '');
    if (!isImageUrl(url)) continue;
    const rel = path.relative(process.cwd(), file);
    if (!byUrl.has(url)) byUrl.set(url, new Set());
    byUrl.get(url).add(rel);
  }
}

const hosts = {};
for (const url of byUrl.keys()) {
  const h = new URL(url).host;
  hosts[h] = (hosts[h] || 0) + 1;
}

console.log('URL externes uniques :', byUrl.size);
console.log('Par hôte :', hosts);
const perFile = {};
for (const [, files] of byUrl) for (const f of files) perFile[f] = (perFile[f] || 0) + 1;
console.log('Par fichier :');
for (const [f, n] of Object.entries(perFile).sort((a, b) => b[1] - a[1])) console.log(`  ${n.toString().padStart(4)}  ${f}`);

fs.mkdirSync('scripts/images', { recursive: true });
fs.writeFileSync(
  'scripts/images/external-urls.json',
  JSON.stringify([...byUrl.entries()].map(([url, files]) => ({ url, files: [...files] })), null, 2)
);
console.log('\n→ scripts/images/external-urls.json');
