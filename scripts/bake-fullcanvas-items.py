#!/usr/bin/env python3
"""Bake tight-crop item PNGs into Roblox-style full-canvas 200x200 layers.

Source of truth for crops: assets/items-legacy-crop/
Output: assets/items/ (live game assets)

Each wearable is pre-positioned on the body silhouette so renderAvatar can
draw every layer at x=0 y=0 w=200 h=200 (attachment model).

Body anchors (200x200 SVG creatures):
  head center ~ (100, 80) r~32  → crown top y≈48, eyes y≈80
  torso       ~ (100, 140)
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image

CANVAS = 200
ROOT = Path(__file__).resolve().parents[1]
LEGACY = ROOT / "assets" / "items-legacy-crop"
OUT = ROOT / "assets" / "items"

# Destination box on canvas (x, y, w, h)
SLOT = {
    "hat": (36, 0, 128, 72),
    "hair": (26, 6, 148, 130),
    "shirt": (44, 92, 112, 82),
    "pants": (54, 130, 92, 54),
    "shoes": (56, 166, 88, 34),
    "glasses": (68, 72, 64, 26),
    "face": (66, 66, 68, 46),
    "cape": (12, 44, 176, 146),
    "hand": (124, 90, 68, 74),
    "pet": (0, 122, 68, 72),
    "acc": (0, 0, 200, 200),
}


def paste_item(im: Image.Image, box: tuple[int, int, int, int], prefix: str) -> Image.Image:
    x, y, w, h = box
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    pad = 0.94
    tw, th = int(w * pad), int(h * pad)
    scale = min(tw / im.width, th / im.height)
    nw, nh = max(1, int(im.width * scale)), max(1, int(im.height * scale))
    r = im.resize((nw, nh), Image.LANCZOS)
    ox = x + (w - nw) // 2
    if prefix == "hat":
        oy = y + max(0, (h - nh) // 5)
    elif prefix == "hair":
        oy = y + max(0, (h - nh) // 5)
    elif prefix == "shoes":
        oy = y + (h - nh)
    elif prefix == "shirt":
        oy = y + max(0, (h - nh) // 4)
    else:
        oy = y + (h - nh) // 2
    canvas.paste(r, (ox, oy), r)
    return canvas


def bake_bg(im: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 255))
    scale = max(CANVAS / im.width, CANVAS / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    r = im.convert("RGBA").resize((nw, nh), Image.LANCZOS)
    canvas.paste(r, ((CANVAS - nw) // 2, (CANVAS - nh) // 2))
    return canvas


def main() -> None:
    if not LEGACY.exists() or not any(LEGACY.glob("*.png")):
        raise SystemExit(f"Missing legacy crops: {LEGACY}")
    OUT.mkdir(parents=True, exist_ok=True)
    n = 0
    for p in sorted(LEGACY.glob("*.png")):
        prefix = p.name.split("-")[0]
        im = Image.open(p).convert("RGBA")
        if prefix == "bg":
            bake_bg(im).save(OUT / p.name, "PNG", optimize=True)
        else:
            box = SLOT.get(prefix, (20, 20, 160, 160))
            paste_item(im, box, prefix).save(OUT / p.name, "PNG", optimize=True)
        n += 1
    print(f"rebaked {n} → {OUT}")


if __name__ == "__main__":
    main()
