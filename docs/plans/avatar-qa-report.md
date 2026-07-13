# Avatar QA Report

Generated: 2026-07-13T12:10:54.696Z

**Overall OK:** true
**Total items:** 170

## Slot counts

- background: 20
- headgear: 20
- top: 20
- cape: 10
- hand: 10
- pet: 20
- hair: 30
- face: 8
- pants: 8
- shoes: 8
- glasses: 8
- accessory: 8

## Coverage

- meta.slots: background, headgear, top, cape, hand, pet, hair, face, pants, shoes, glasses, accessory
- AVATAR_LAYER_RECTS: background, cape, pet, pants, top, shoes, hand, face, hair, headgear, glasses, accessory
- slots without rects: (none)
- missing assets: 0

## Render smoke (first-item full loadout)

- fox: OK images=12 body=true bytes=3333
- cat: OK images=12 body=true bytes=3548
- panda: OK images=12 body=true bytes=3318
- tiger: OK images=12 body=true bytes=5506
- dragon: OK images=12 body=true bytes=4036
- unicorn: OK images=12 body=true bytes=4286

## Sample loadout

```json
{
  "background": "bg-cloudy-sky",
  "cape": "cape-black",
  "pet": "pet-bunny",
  "pants": "pants-jeans-blue",
  "top": "shirt-tshirt",
  "shoes": "shoes-sneakers-red",
  "hand": "hand-spell-book",
  "face": "face-smile",
  "hair": "hair-bowl-cut-brown",
  "headgear": "hat-baseball-cap",
  "glasses": "glasses-round",
  "accessory": "acc-earrings-hoop-gold"
}
```

## Issues still open (manual)

1. No body silhouette clipPath for top/pants
2. Shared anchors across 6 bodies (dragon/unicorn headgear collisions)
3. No hair-front layer
4. Browser visual QA still required
5. Per-item rect overrides may be incomplete for tall hats/hair
