# assets/items-shoes/

**Status:** Placeholder — Phase 2 will populate this directory.

## What goes here

PNG sprite files for the **Shoes** slot (Z-order layer 8, bottom).

## Naming convention

`shoes-{style}.png` where `style` is one of:
`sneaker-blue`, `sneaker-red`, `sneaker-white`, `boots`, `sandals`,
`school`, `rain-boots`, `slippers`, `high-tops`, `ballet-flats`,
`roller-skates`, `cleats`, `fairy`, `bunny-slippers`

Example: `shoes-sneaker-blue.png`

## Required count

**12 PNGs** (feet-only, ~100×35px in the 200×200 canvas)

## Canvas placement

`renderAvatar()` draws this layer at `x=50, y=165, w=100, h=35`.

## How to add items

1. Generate the PNG
2. Drop the file into this directory
3. Add an entry in `data/items.js` under `ITEMS.shoes`
4. Editor's Kasut tab picks it up automatically.