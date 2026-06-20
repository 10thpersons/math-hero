# assets/items-face/

**Status:** Placeholder — Phase 2 will populate this directory.

## What goes here

PNG sprite files for the **Face** slot (Z-order layer 10).

## Naming convention

`face-{expression}.png` where `expression` is one of:
`happy`, `cool`, `surprised`, `sleepy`, `wink`, `smile-big`, `serious`,
`laugh`, `neutral`, `blink`

Example: `face-happy.png`

## Required count

**10 PNGs** (face-only crops, ~70×40px in the 200×200 canvas)

## Canvas placement

`renderAvatar()` draws this layer at `x=65, y=50, w=70, h=40`
(over the body's head, before glasses).

## How to add items

1. Generate the PNG (face-only — eyes, mouth, eyebrows)
2. Drop the file into this directory
3. Add an entry in `data/items.js` under `ITEMS.face`
4. Editor's Muka tab picks it up automatically.