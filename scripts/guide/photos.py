"""Prépare les 50 photos du guide : normalise, redimensionne, trace les crédits."""

import json
import os
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
GUIDE = ROOT / "scripts" / "guide"
SCRATCH = GUIDE / "_scratch" / "guide-img.tmp"
OUT = GUIDE / "assets" / "photos"
OUT.mkdir(parents=True, exist_ok=True)

data = json.loads((GUIDE / "data.json").read_text(encoding="utf-8"))
plan = {p["id"]: p for p in json.loads((SCRATCH / "plan.json").read_text(encoding="utf-8"))}
overrides = json.loads((GUIDE / "assets" / "photo-overrides.json").read_text(encoding="utf-8"))

UA = "SecretScapeGuide/1.0 (contact@secretscape.com)"


def download(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=45) as r:
            dest.write_bytes(r.read())
        return True
    except Exception as e:  # noqa: BLE001
        print("  ! download failed", url, e)
        return False


credits = []
failures = []

for spot in data["selection"]:
    sid = spot["id"]
    image_url = spot.get("imageUrl") or ""
    strings = []

    scratch_file = SCRATCH / f"{sid}.src"
    if sid in overrides:
        src = SCRATCH / f"{sid}.override"
        if not src.exists():
            download(overrides[sid]["url"], src)
        kind = "override"
        rights = overrides[sid]["rights"]
    elif scratch_file.exists():
        src = scratch_file
        kind = "scratch"
        rights = plan.get(sid, {}).get("rights", "cc")
    elif image_url.startswith("/images/"):
        src = ROOT / "public" / image_url.lstrip("/")
        kind = "local"
        rights = plan.get(sid, {}).get("rights", "tiers")
    elif image_url.startswith("http"):
        src = SCRATCH / f"{sid}.remote"
        if not src.exists():
            download(image_url, src)
        kind = "remote"
        rights = "cc" if "wikimedia" in image_url else "libre"
    else:
        src = None
        kind = "none"
        rights = "?"

    if src is None or not src.exists():
        failures.append((sid, spot["title"], "missing source"))
        continue

    try:
        im = Image.open(src)
        im = ImageOps.exif_transpose(im)
        w, h = im.size
        if w < 500 or h < 300:
            print(f"  ~ basse résolution {w}x{h} pour {sid}")
        im = im.convert("RGB")
        if im.width > 1500:
            nh = round(im.height * 1500 / im.width)
            im = im.resize((1500, nh), Image.LANCZOS)
        dest = OUT / f"{sid}.jpg"
        im.save(dest, "JPEG", quality=84, optimize=True, progressive=True)
        credits.append(
            {
                "id": sid,
                "title": spot["title"],
                "source": kind,
                "url": image_url,
                "rights": rights,
                "width": im.width,
                "height": im.height,
                "bytes": dest.stat().st_size,
            }
        )
        print(f"ok   {sid:34s} {im.width}x{im.height}  {kind}/{rights}")
    except Exception as e:  # noqa: BLE001
        failures.append((sid, spot["title"], f"read error {e}"))
        print("  ! read failed", sid, e)

(GUIDE / "assets" / "photo-credits.json").write_text(
    json.dumps(credits, ensure_ascii=False, indent=2), encoding="utf-8"
)

print(f"\n{len(credits)} photos prêtes sur {len(data['selection'])}")
for f in failures:
    print("FAIL", f)
if failures:
    sys.exit(1)
