// Réécrit les références externes vers les copies locales.
import fs from 'node:fs';
import path from 'node:path';

const WORK = path.resolve('scripts/images');
const manifest = JSON.parse(fs.readFileSync(path.join(WORK, 'manifest.json'), 'utf8'));

const usable = manifest.filter((entry) => entry.local);
const missing = manifest.filter((entry) => !entry.local);

// URL les plus longues d'abord : une URL peut être le préfixe d'une autre.
const replacements = [];
for (const entry of usable) {
  for (const url of entry.urls ?? [entry.url]) replacements.push([url, entry.local]);
}
replacements.sort((a, b) => b[0].length - a[0].length);

const files = new Set();
for (const entry of usable) for (const rel of entry.files ?? []) files.add(rel);

let replaced = 0;
for (const rel of files) {
  const file = path.resolve(rel);
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  let hits = 0;
  for (const [url, local] of replacements) {
    if (!text.includes(url)) continue;
    const parts = text.split(url);
    hits += parts.length - 1;
    text = parts.join(local);
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    replaced += hits;
    console.log(`✓ ${rel} (${hits} références)`);
  }
}

console.log(`\n${replaced} références remplacées sur ${files.size} fichiers.`);
if (missing.length) {
  console.log(`Restantes non converties : ${missing.length} URL`);
  for (const entry of missing.slice(0, 10)) console.log(`  · ${entry.url.slice(-80)}`);
}
