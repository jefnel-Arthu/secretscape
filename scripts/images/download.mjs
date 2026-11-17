// Télécharge les images externes référencées dans src/ vers un dossier de travail.
import fs from 'node:fs';
import path from 'node:path';
import { imageKey, imageSlug, wikimediaFileName } from './keys.mjs';

const WORK = path.resolve('scripts/images');
const DL = path.join(WORK, '_download');
const MANIFEST = path.join(WORK, 'manifest.json');
const UA = 'SecretScapeImageLocalizer/1.0 (https://secretscape.onrender.com; ajefnel@gmail.com)';

const SKIP_HOSTS = new Set(['example.com', 'www.example.com']);
const CONCURRENCY = Number(process.env.CONCURRENCY || 6);
const LIMIT = Number(process.env.LIMIT || 0);
const ATTEMPTS = 3;

/**
 * Wikimedia : on ne demande jamais l'original, un thumb de 1280 px suffit.
 * Unsplash : on fixe nous-mêmes la largeur et la qualité pour limiter le poids.
 */
function fetchUrl(url) {
  const u = new URL(url);
  if (u.host.includes('wikimedia')) {
    const title = encodeURIComponent(`File:${wikimediaFileName(url)}`);
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${title}?width=1000`;
  }
  if (u.host === 'images.unsplash.com') {
    u.searchParams.set('w', '1000');
    u.searchParams.set('q', '65');
    u.searchParams.set('fm', 'jpg');
    u.searchParams.set('fit', 'max');
    return u.toString();
  }
  return url;
}

const isImageBuffer = (buf) => {
  if (buf.length < 4) return false;
  const jpeg = buf[0] === 0xff && buf[1] === 0xd8;
  const png = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const webp = buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP';
  const gif = buf.toString('ascii', 0, 3) === 'GIF';
  return jpeg || png || webp || gif;
};

async function download(url, dest) {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(fetchUrl(url), {
        headers: { 'User-Agent': UA, Referer: 'https://secretscape.onrender.com/', Accept: 'image/*' },
        signal: AbortSignal.timeout(45_000),
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) throw new Error(`too small (${buf.length} o)`);
      if (!isImageBuffer(buf)) throw new Error('pas une image');
      fs.writeFileSync(dest, buf);
      return { bytes: buf.length, type: res.headers.get('content-type') || '' };
    } catch (err) {
      if (attempt === ATTEMPTS) throw err;
      await new Promise((r) => setTimeout(r, attempt * 2000));
    }
  }
}

// Regroupe les variantes d'URL d'une même image (largeurs, paramètres de cache…).
const groups = new Map();
for (const entry of JSON.parse(fs.readFileSync(path.join(WORK, 'external-urls.json'), 'utf8'))) {
  if (SKIP_HOSTS.has(new URL(entry.url).host)) continue;
  const key = imageKey(entry.url);
  if (!groups.has(key)) {
    groups.set(key, { key, url: entry.url, slug: imageSlug(entry.url), urls: new Set(), files: new Set() });
  }
  const group = groups.get(key);
  group.urls.add(entry.url);
  for (const file of entry.files) group.files.add(file);
}

const targets = [...groups.values()].slice(0, LIMIT || undefined);
fs.mkdirSync(DL, { recursive: true });

const manifest = [];
let index = 0;
let ok = 0;
let failed = 0;

async function worker() {
  while (index < targets.length) {
    const target = targets[index++];
    const dest = path.join(DL, `${target.slug}.src`);
    const label = `${String(index).padStart(3)}/${targets.length}`;
    try {
      if (!fs.existsSync(dest)) await download(target.url, dest);
      const bytes = fs.statSync(dest).size;
      manifest.push({
        key: target.key,
        url: target.url,
        urls: [...target.urls],
        slug: target.slug,
        file: dest,
        bytes,
        files: [...target.files],
      });
      ok++;
      console.log(`[${label}] ok   ${Math.round(bytes / 1024).toString().padStart(4)} Ko  ${target.slug}`);
    } catch (err) {
      failed++;
      console.log(`[${label}] FAIL ${target.url.slice(-70)} → ${err.message}`);
    }
    if ((ok + failed) % 20 === 0) {
      fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\nTerminé : ${ok} téléchargées, ${failed} échecs → ${path.relative(process.cwd(), MANIFEST)}`);
