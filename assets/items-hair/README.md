# assets/items-hair/

**Status:** Placeholder — Phase 2 will populate this directory.

## What goes here

PNG sprite files for the **Hair** slot (Z-order layer 11/14 in
`ZCODE-BRIEF-AVATAR-CUSTOMIZER.md` §5).

## Naming convention

`hair-{style}-{color}.png` where:
- `style` is one of: `long`, `short`, `bob`, `ponytail`, `braids`, `bun`,
  `curly`, `afro`, `pixie`, `side-swept`, `twin-tails`, `spiky`
- `color` is one of: `black`, `brown`, `blonde`, `red`

Example: `hair-long-blonde.png`

## Required count

12 styles × 4 colors = **48 PNGs** (100×100 px transparent BG recommended)

## Canvas placement

`renderAvatar()` in `data/bodies.js` draws this layer at:
- Back layer: `x=50, y=20, w=100, h=60` (behind hat)
- Front layer: `x=55, y=75, w=90, h=35` (bangs over forehead)

## How to add items

1. Generate the PNG with the sprite-sheet prompt template
   (`~/.hermes/skills/software-development/ai-art-sprite-pipeline/references/nanobanana-prompt-template.md`)
2. Drop the file into this directory
3. Add an entry in `data/items.js` under `ITEMS.hair`:
   ```js
   { id: 'hair-long-blonde', name: 'Rambut Panjang Emas', rarity: 'common', priceCoins: 30, img: 'assets/items-hair/hair-long-blonde.png' }
   ```
4. The editor's Rambut tab will pick it up automatically — no UI code changes needed.