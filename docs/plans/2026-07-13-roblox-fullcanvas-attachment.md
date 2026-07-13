# Roblox full-canvas attachment model (2026-07-13)

## Problem
Hats looked "tampal muka" (stuck on face). Cause: clothing PNGs were tight 102x102 icon crops stretched into loose SVG boxes. Not attachment layers.

## Fix (shipped)
1. Convert every wearable to **200x200 full-canvas** with art pre-positioned on body anchors.
2. `renderAvatar` draws every clothing layer at `x=0 y=0 w=200 h=200` (Roblox attachment style).
3. Strip per-item `rect` overrides (they double-offset full-canvas assets).
4. Script: `scripts/bake-fullcanvas-items.py` (source: `assets/items-legacy-crop/`).

## Body anchors
- Head center ~ (100, 80) r~32 — crown top y~48, eyes y~80
- Hat box: (36,0,128,72) top-weighted
- Shirt box: (44,92,112,82)
- Torso ~ (100, 140)

## Not yet (blocked on image gen)
True AI re-draw of wearables as 3D-ish Roblox chibi attachments needs FAL_KEY / image_gen. Current bake repositions existing art; style is still flat 2D icon art, not new 3D-like mesh clothing.

## Cache-bust
`data/items.js?cb=20260713c` + `data/bodies.js?cb=20260713c`
