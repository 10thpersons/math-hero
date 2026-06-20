# assets/items-pants/

**Status:** Placeholder — Phase 2 will populate this directory.

## What goes here

PNG sprite files for the **Pants** slot (Z-order layer 5, over body legs).

## Naming convention

`pants-{style}.png` where `style` is one of:
`jeans`, `shorts`, `cargo`, `skirt-pink`, `skirt-blue`, `skirt-yellow`,
`leggings`, `sweatpants`, `uniform`, `dress-pants`, `overalls`, `tutu`,
`ninja`, `pajamas`

Example: `pants-jeans.png`

## Required count

**12 PNGs** (lower-body only, ~120×60px in the 200×200 canvas)

## Canvas placement

`renderAvatar()` draws this layer at `x=40, y=130, w=120, h=60`.

## How to add items

1. Generate the PNG
2. Drop the file into this directory
3. Add an entry in `data/items.js` under `ITEMS.pants`
4. Editor's Seluar tab picks it up automatically.