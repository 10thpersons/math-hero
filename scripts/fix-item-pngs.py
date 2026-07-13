#!/usr/bin/env python3
"""Strip opaque backgrounds + compress Math Hero avatar item PNGs.

Usage (from repo root):
  python3 scripts/fix-item-pngs.py

Only touches assets/items/*.png (not items-v2).
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ITEMS_DIR = ROOT / "assets" / "items"
REPORT = ROOT / "docs" / "plans" / "png-fix-report.md"


def corner_bg_colors(im: Image.Image):
    w, h = im.size
    px = im.load()
    pts = [
        (0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
        (1, 1), (w - 2, 1), (1, h - 2), (w - 2, h - 2),
        (w // 2, 0), (0, h // 2), (w - 1, h // 2), (w // 2, h - 1),
    ]
    cols = []
    for x, y in pts:
        r, g, b, a = px[max(0, min(w - 1, x)), max(0, min(h - 1, y))]
        cols.append((r, g, b, a))
    return cols


def color_dist(c1, c2):
    return abs(c1[0] - c2[0]) + abs(c1[1] - c2[1]) + abs(c1[2] - c2[2])


def needs_bg_strip(im: Image.Image) -> bool:
    w, h = im.size
    px = im.load()
    alphas = []
    for y in range(0, h, max(1, h // 25)):
        for x in range(0, w, max(1, w // 25)):
            alphas.append(px[x, y][3])
    transparent = sum(1 for a in alphas if a < 20)
    return transparent / max(1, len(alphas)) < 0.05


def strip_bg(im: Image.Image, tol: int = 32):
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    corners = corner_bg_colors(im)
    bg_refs = [(c[0], c[1], c[2]) for c in corners]
    ar = sum(c[0] for c in bg_refs) // len(bg_refs)
    ag = sum(c[1] for c in bg_refs) // len(bg_refs)
    ab = sum(c[2] for c in bg_refs) // len(bg_refs)
    bg_refs.append((ar, ag, ab))

    visited = set()
    stack = []
    for x in range(w):
        stack.append((x, 0))
        stack.append((x, h - 1))
    for y in range(h):
        stack.append((0, y))
        stack.append((w - 1, y))

    changed = 0
    while stack:
        x, y = stack.pop()
        if (x, y) in visited:
            continue
        if x < 0 or y < 0 or x >= w or y >= h:
            continue
        visited.add((x, y))
        r, g, b, a = px[x, y]
        if a < 10:
            continue
        if min(color_dist((r, g, b), ref) for ref in bg_refs) <= tol:
            px[x, y] = (r, g, b, 0)
            changed += 1
            stack.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    return im, changed


def main():
    SKIP_PREFIXES = ("bg-",)
    files = [p for p in sorted(ITEMS_DIR.glob("*.png")) if not p.name.startswith(SKIP_PREFIXES)]
    if not files:
        raise SystemExit(f"No PNGs in {ITEMS_DIR}")

    before_total = sum(p.stat().st_size for p in files)
    stripped = []
    compressed_only = []

    for p in files:
        before = p.stat().st_size
        im = Image.open(p).convert("RGBA")
        did_strip = False
        changed = 0
        if needs_bg_strip(im):
            im2, changed = strip_bg(im, tol=32)
            if changed < (im.width * im.height * 0.01):
                im2, changed = strip_bg(im, tol=48)
            im = im2
            did_strip = changed > 0

        out = im
        if max(im.size) > 256:
            scale = 256 / max(im.size)
            out = im.resize(
                (max(1, int(im.width * scale)), max(1, int(im.height * scale))),
                Image.Resampling.LANCZOS,
            )
        out.save(p, "PNG", optimize=True)
        after = p.stat().st_size
        if did_strip:
            stripped.append(
                {
                    "file": p.name,
                    "changed_px": changed,
                    "before": before,
                    "after": after,
                    "size": list(out.size),
                }
            )
        elif before > 150 * 1024 and after < before:
            compressed_only.append({"file": p.name, "before": before, "after": after})

    after_total = sum(p.stat().st_size for p in files)
    samples = [
        "shirt-jersey.png",
        "shirt-ninja.png",
        "hat-cowboy.png",
        "cape-ice.png",
        "hat-crown-gold.png",
        "shirt-tshirt.png",
    ]
    sample_stats = []
    for name in samples:
        p = ITEMS_DIR / name
        if not p.exists():
            continue
        im = Image.open(p).convert("RGBA")
        px = im.load()
        w, h = im.size
        alphas = [
            px[x, y][3]
            for y in range(0, h, max(1, h // 20))
            for x in range(0, w, max(1, w // 20))
        ]
        sample_stats.append(
            {
                "file": name,
                "transparent_frac": round(sum(1 for a in alphas if a < 10) / len(alphas), 2),
                "corners": [px[0, 0][3], px[w - 1, 0][3], px[0, h - 1][3], px[w - 1, h - 1][3]],
                "kb": p.stat().st_size // 1024,
            }
        )

    REPORT.parent.mkdir(parents=True, exist_ok=True)
    with REPORT.open("w") as f:
        f.write("# PNG Fix Report — Math Hero avatar items\n\n")
        f.write(f"**Before:** {before_total / 1024 / 1024:.2f} MB  \n")
        f.write(f"**After:** {after_total / 1024 / 1024:.2f} MB  \n")
        f.write(f"**Stripped backgrounds:** {len(stripped)}  \n")
        f.write(f"**Compressed only:** {len(compressed_only)}  \n\n")
        f.write("## Sample after\n```json\n")
        f.write(json.dumps(sample_stats, indent=2))
        f.write("\n```\n\n## Stripped files (first 40)\n")
        for row in stripped[:40]:
            f.write(
                f"- `{row['file']}` changed_px={row['changed_px']} "
                f"{row['before'] // 1024}KB→{row['after'] // 1024}KB\n"
            )
        f.write("\n## Compressed only (first 20)\n")
        for row in compressed_only[:20]:
            f.write(
                f"- `{row['file']}` {row['before'] // 1024}KB→{row['after'] // 1024}KB\n"
            )

    print(
        json.dumps(
            {
                "before_mb": round(before_total / 1024 / 1024, 2),
                "after_mb": round(after_total / 1024 / 1024, 2),
                "stripped": len(stripped),
                "compressed_only": len(compressed_only),
                "sample_after": sample_stats,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
