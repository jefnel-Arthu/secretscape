"""Convertit les images téléchargées en JPEG + WebP optimisés (900 px max)."""
import json
import os
from PIL import Image

MANIFEST = os.path.join('scripts', 'images', 'manifest.json')
OUT_DIR = os.path.join('public', 'images', 'localized')
MAX_SIDE = 820
QUALITY = 74

with open(MANIFEST, encoding='utf-8') as f:
    manifest = json.load(f)

os.makedirs(OUT_DIR, exist_ok=True)
total_before = 0
total_after = 0
converted = 0
skipped = 0

for entry in manifest:
    src = entry.get('file')
    slug = entry['slug']
    if not src or not os.path.exists(src):
        skipped += 1
        continue
    before = os.path.getsize(src)
    try:
        im = Image.open(src)
        if im.mode in ('RGBA', 'LA', 'P'):
            im = im.convert('RGBA')
            bg = Image.new('RGB', im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        else:
            im = im.convert('RGB')
    except Exception as err:  # fichier corrompu ou format inconnu
        print(f"SKIP {slug}: {err}")
        entry['error'] = str(err)
        entry.pop('local', None)
        skipped += 1
        continue

    w, h = im.size
    if max(w, h) > MAX_SIDE:
        scale = MAX_SIDE / max(w, h)
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)

    jpg_path = os.path.join(OUT_DIR, slug + '.jpg')
    webp_path = os.path.join(OUT_DIR, slug + '.webp')
    im.save(jpg_path, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    im.save(webp_path, 'WEBP', quality=QUALITY, method=6)

    total_before += before
    total_after += os.path.getsize(webp_path)
    converted += 1
    entry['local'] = f"/images/localized/{slug}.jpg"
    entry['width'] = im.size[0]
    entry['height'] = im.size[1]
    entry.pop('error', None)

with open(MANIFEST, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f"\n{converted} images converties ({skipped} ignorées)")
if converted:
    print(f"Avant : {total_before / 1048576:.1f} Mo  →  WebP : {total_after / 1048576:.1f} Mo")
