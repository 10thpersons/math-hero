# Icon Pack v2 — Real-World Object Icons

100 cartoon-style icons generated via Gemini Pro (validated 100/100 cell match).
Source sprite sheet: 1024×1024, 10×10 grid, 102px cells, white background.

## Categories (100 total)

| Prefix | Count | Examples |
|---|---|---|
| `food-` | 20 | apple, banana, hamburger, cupcake, donut |
| `wear-` | 20 | baseball cap, hoodie, sneakers, backpack |
| `tool-` | 10 | wooden sword, pickaxe, butterfly net |
| `mat-` | 10 | stone block, wood block, rope, gold coin |
| `toy-` | 10 | robot, T-rex, dice, magic wand |
| `misc-` | 10 | orb, treasure chest, telescope, map |
| `animal-` | 10 | fish, turtle, rabbit, butterfly |
| `nature-` | 10 | sunflower, clover, firefly, rainbow |

## Schema

See `data/items-v2-schema.json` for the full slug → rarity mapping.

Rarity distribution (visual-cue based):

| Rarity | Count | Examples |
|---|---|---|
| common (grey) | 71 | food-apple, wear-baseball-cap, animal-fish |
| rare (blue) | 19 | tool-pickaxe, toy-robot, animal-butterfly |
| legendary (gold) | 10 | toy-magic-wand, mat-gold-coin, misc-treasure-chest |

## Use cases for Math Hero

This pack is **not** for avatar items (those live in `assets/items/` with `bg-/cape-/hand-/hat-/pet-/shirt-` prefixes).
Use this pack for **math problems with real-world objects**:

- "I have 3 apples, eat 1, how many left?" → `food-apple`
- "How many butterflies?" → `animal-butterfly`
- "Shoot 2 arrows, then 3 more, total?" → `tool-arrow`
- Reward catalog screen — coins/gems/legendary items as prizes
- "Tap all the legendary items" mini-game

## Loading in app

```js
const ICON_V2 = {};
const ICON_V2_RARITY = {};

// Eager load all 100 (simple approach: ~1.1 MB total)
for (const item of ITEMS_V2_SCHEMA.items) {
  const img = new Image();
  img.src = `assets/items-v2/${item.slug}.png`;
  ICON_V2[item.slug] = img;
  ICON_V2_RARITY[item.slug] = item.rarity;
}
```

For lazy-load, fetch schema first then preload on demand.

## Rarity overrides

To override rarity, edit `data/items-v2-schema.json` — the schema is the source of truth, not the visual cues in the source PNG.

## Style notes for future generations

- Canvas: ask for **2048×2048** so 10×10 cells are clean 204px (no rounding)
- White background only (Gemini doesn't do transparency)
- Style consistency holds across all 10 rows — verified by vision
- Style drift risk: if regenerated, vision-validate every cell again

## Source prompt

See the v4 sprite-sheet prompt template. Categories above, all 100 items enumerated in the schema.