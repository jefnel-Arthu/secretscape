// Récupère auteur + licence de chaque photo Wikimedia localisée.
import fs from 'node:fs';
import path from 'node:path';
import { wikimediaFileName } from './keys.mjs';

const WORK = path.resolve('scripts/images');
const manifest = JSON.parse(fs.readFileSync(path.join(WORK, 'manifest.json'), 'utf8'));
const UA = 'SecretScapeImageLocalizer/1.0 (https://secretscape.onrender.com; ajefnel@gmail.com)';

const titleOf = (url) => {
  const u = new URL(url);
  return u.host.includes('wikimedia') ? `File:${wikimediaFileName(url)}` : null;
};

const stripHtml = (s) => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const entries = manifest
  .filter((e) => e.local && titleOf(e.url))
  .map((e) => ({ ...e, title: titleOf(e.url) }));

const credits = {};
for (let i = 0; i < entries.length; i += 50) {
  const batch = entries.slice(i, i + 50);
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'imageinfo',
    iiprop: 'extmetadata|url',
    titles: batch.map((e) => e.title).join('|'),
  });

  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(60_000),
  });
  const json = await res.json();
  const pages = json.query?.pages ?? {};
  const byTitle = new Map();
  for (const page of Object.values(pages)) {
    const meta = page.imageinfo?.[0]?.extmetadata ?? {};
    byTitle.set(page.title, {
      author: stripHtml(meta.Artist?.value) || 'Auteur inconnu',
      licence: stripHtml(meta.LicenseShortName?.value) || 'Licence inconnue',
      licenceUrl: meta.LicenseUrl?.value ?? '',
      source: page.imageinfo?.[0]?.descriptionurl ?? '',
    });
  }

  for (const entry of batch) {
    const meta =
      byTitle.get(entry.title) ??
      byTitle.get(entry.title.replace(/^File:/, '')) ?? {
        author: 'Auteur inconnu',
        licence: 'Licence inconnue',
        licenceUrl: '',
        source: '',
      };
    credits[entry.local] = meta;
  }
  console.log(`lot ${i / 50 + 1} : ${batch.length} fichiers`);
  await new Promise((r) => setTimeout(r, 500));
}

fs.writeFileSync(path.join('src', 'data', 'imageCredits.json'), JSON.stringify(credits, null, 2) + '\n');

const byLicence = {};
for (const c of Object.values(credits)) byLicence[c.licence] = (byLicence[c.licence] || 0) + 1;
console.log(`\nCrédits : ${Object.keys(credits).length} images`);
console.log('Licences :', byLicence);
