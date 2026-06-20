# assets/items-glasses/

**Status:** Placeholder — Phase 2 will populate this directory.

## What goes here

PNG sprite files for the **Glasses** slot (Z-order layer 13, over face).

## Naming convention

`glasses-{style}.png` where `style` is one of:
`round`, `square`, `aviator`, `cat-eye`, `sport`, `reading`, `sunglasses`, `monocle`

Example: `glasses-round.png`

## Required count

**8 PNGs** (eyewear only, ~60×25px in the 200×200 canvas)

## Canvas placement

`renderAvatar()` draws this layer at `x=70, y=60, w=60, h=25`.

## How to add items

1. Generate the PNG
2. Drop the file into this directory
3. Add an entry in `data/items.js` under `ITEMS.glasses`
4. Editor's Cermin Mata tab picks it up automatically.