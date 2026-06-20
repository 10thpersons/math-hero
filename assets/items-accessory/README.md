# assets/items-accessory/

**Status:** Placeholder — Phase 2 will populate this directory.

## What goes here

PNG sprite files for the **Accessory** slot (Z-order layer 7, over shirt).

## Naming convention

`acc-{item}.png` where `item` is one of:
`watch`, `necklace`, `bracelet`, `earrings`, `scarf`, `bowtie`, `badge`, `wings`

Example: `acc-bowtie.png`

## Required count

**8 PNGs** (small wearable, ~80×35px in the 200×200 canvas)

## Canvas placement

`renderAvatar()` draws this layer at `x=60, y=105, w=80, h=35`
(adjust per-item if needed — e.g. wings would be larger).

## How to add items

1. Generate the PNG
2. Drop the file into this directory
3. Add an entry in `data/items.js` under `ITEMS.accessory`
4. Editor's Aksesori tab picks it up automatically.