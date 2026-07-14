# Gap Analysis — Math Hero Seamless Roblox Avatar

**Branch:** `feature/avatar-customizer-v2`  
**Date:** 2026-07-13  
**Baseline HEAD at analysis:** after PNG pass 2 + layer rects

## Goal

Avatar clothing sits on the chibi body like Roblox/catalog dress-up: transparent assets, correct Z-order, hat/hair/shirt/pants/shoes anchored to anatomy, no floating cards, no checker backgrounds.

## Current stack (what works)

| Layer | Slot       | Rect (x,y,w,h)    | Notes                        |
| ----- | ---------- | ----------------- | ---------------------------- |
| 1     | background | 0,0,200,200 slice | Opaque `bg-*` restored       |
| 2     | cape       | 25,55,150,125     | Behind body                  |
| 3     | pet        | 2,128,58,58       | Bottom-left                  |
| 4     | body       | SVG creature      | 6 bodies in `data/bodies.js` |
| 5     | pants      | 58,132,84,52      | Under shirt                  |
| 6     | top        | 48,88,104,78      | Tighter torso                |
| 7     | shoes      | 62,168,76,32      | Feet                         |
| 8     | hand       | 132,98,52,58      | Right hand                   |
| 9     | face       | 70,68,60,42       | Expression sticker           |
| 10    | hair       | 36,18,128,100     | Under hat                    |
| 11    | headgear   | 48,8,104,72       | Crown/hat                    |
| 12    | glasses    | 72,74,56,22       | Over eyes                    |
| 13    | accessory  | 0,0,200,200       | Full-canvas flair            |

- Catalog: 12 slots in `ITEMS.meta.slots` (`data/items.js` v5)
- Render: `renderAvatar()` + `AVATAR_LAYER_RECTS` + optional `it.rect` override
- Assets: `assets/items/*.png` (~8.1 MB after strip/compress; was 27 MB)
- Editor UI: equip/preview/loadouts/share-PNG in `index.html`

## Gaps vs seamless Roblox goal

### P0 — Fixed this pass

- [x] Opaque checker/card backgrounds on most clothing PNGs (flood-fill strip)
- [x] Oversized hair/shoes/acc (compress to ≤256px)
- [x] Loose shirt/hat rects (centralized tighter anchors)
- [x] `bg-*` incorrectly stripped (restored opaque)
- [x] Second-pass hard items (56 → 0 opaque-corner clothing)

### P1 — Still open

1. **No body mask** — clothing is rectangular overlay, not clipped to torso/head silhouette. Tall shirts can cover arms/legs wrong; skinny items float.
2. **No per-item rect overrides in catalog** — `it.rect` supported in code but unused in `items.js`. Worst offenders (viking hat, long hair, boots, wings) need hand anchors.
3. **No hair-front layer** — only hair-back. Bangs/ponytail over face not split.
4. **Same anchors for all 6 bodies** — fox/cat/panda/tiger/dragon/unicorn share one rect map; dragon horns and unicorn horn collide with headgear.
5. **Visual QA not browser-proven** — node smoke only. Need live editor screenshots on all bodies.

### P2 — Roblox-parity polish

6. Skin/fur recolor under translucent clothes
7. Outfit sets / rarity bundles
8. Idle bob / equip animation
9. Thumbnail crop consistency for shop grid
10. Offline service worker cache for 170 PNGs

### P3 — Content

11. More hair colors / gender-neutral packs
12. Seasonal backgrounds
13. Pet follow offset per body

## File map

```
index.html              editor + equip + share
data/items.js           catalog + getItem + migration
data/bodies.js          SVG bodies + renderAvatar + AVATAR_LAYER_RECTS
assets/items/*.png      wearable art
scripts/fix-item-pngs.py strip/compress (skips bg-*)
docs/plans/             enhance plan, png report, this gap doc
```

## Recommended next milestones

1. **M1 Visual QA** — browser pass: 6 bodies × full loadout; note float/overlap
2. **M2 Per-item rects** — add `rect` on ~15 worst items in `items.js`
3. **M3 Body-aware anchors** — `AVATAR_LAYER_RECTS_BY_BODY[bodyId]` overrides for dragon/unicorn
4. **M4 Optional mask** — SVG clipPath from body torso for `top`/`pants`
5. **M5 PR + preview deploy**

## Verification already run

- `renderAvatar('tiger', 8-slot loadout)` → 8 `<image>` + body SVG
- Clothing corner transparency: 0 remaining opaque-corner non-bg items
- Total item PNG size: ~8.14 MB
- Branch pushed through PNG pass 1; pass 2 pending commit at write time
