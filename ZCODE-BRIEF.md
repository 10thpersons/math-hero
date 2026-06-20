# Math Hero — Icon Pack v2 Integration Brief

**For:** Zcode (continuing development)
**Repo:** `10thpersons/math-hero`
**Branch:** `feature/icon-pack-v2` (NOT merged to main)

---

## 1. What we just shipped (Phase 1, done)

- Generated 100-icon sprite sheet via Gemini Pro
- Cut into 102×102 PNGs, white background, chunky cartoon style
- Built schema with rarity tiers (71 common / 19 rare / 10 legendary)
- Pushed to `feature/icon-pack-v2`
- Vision-validated 100/100 cell match (no off-by-one, no dropped cells)

**On disk:**
- `assets/items-v2/*.png` — 100 PNGs (1.12 MB total)
- `data/items-v2-schema.json` — slug, rarity, row, col
- `assets/items-v2/README.md` — usage notes

---

## 2. What this is for

100 real-world object icons across 8 categories:

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

**NOT** for avatar items — those stay in `assets/items/` with `bg-/cape-/hand-/hat-/pet-/shirt-` prefixes.

---

## 3. What Zcode does (Phase 2)

### Tier 1 — Must do first

**Step 1. Wire icons in**
- Add `IconV2` registry: preload all 100 PNGs into `Image` objects on app start
- Add `getIcon(slug)` helper with emoji fallback if slug not found
- Confirm zero 404s

**Step 2. Reward Catalog screen**
- New screen accessible from home menu
- Shows all 100 icons in a grid (10×10 desktop, 5×4 mobile)
- Each icon labeled (Malay translations from existing `d1-bm.json` style)
- Rarity color glow: gold aura (legendary), blue tint (rare), grey (common)
- Tap icon → detail view (large icon, name, rarity, "Owned: X")
- Filter bar at top: All / Common / Rare / Legendary

**Step 3. Math problem visuals** (replace emoji where possible)
- "I have 3 apples, eat 1, how many left?" → render `food-apple` × 3
- "How many fish do you see?" → render N × `animal-fish`
- "Buy 2 swords at 5 gold each" → render `tool-metal-sword` × 2
- Extend `data/d1-math.json` / `d3-math.json` with new `icon` field per question

D1 (easier): `food-` and `animal-` only
D3 (harder): add `tool-`, `nature-`, `toy-`, `misc-`

### Tier 2 — Wishlist (do after Tier 1 works)

**Step 4. Legendary mini-game "Find the Gold"**
- Show 6-8 random icons, 3 legendary hidden among common/rare
- Kid taps the gold ones; sound on correct tap
- +1 gem per legendary found; 3 lives

**Step 5. Daily bonus chest**
- Daily login: open chest, get 3 random items
- Rarity biased 70/25/5 (common/rare/legendary)
- "New!" tag for first-time unlocks

### Tier 3 — Stretch (only if time)

- Rarity filter on catalog (already in Tier 1 actually)
- "My collection" — show which items kid has unlocked across sessions
- Trade items with NPC merchant for gems

---

## 4. How it should look finally

**Art style consistency:** matches v4 chunky cartoon avatar items (bold black outlines, flat fills, white backgrounds)

**Sizing:**
- Catalog grid: 60×60 px
- Math problem visual: 48×48 px
- Detail view: 200×200 px
- Mini-game: 100×100 px

**Rarity color cues:**
- Common: grey border, no glow
- Rare: blue border + soft blue glow
- Legendary: gold border + sparkle particles + 1.0→1.1 scale pulse on appear

**Animations:**
- Icon tap → 1.0→1.2→1.0 scale bounce (200ms)
- Legendary appear → scale pulse + sparkle fade-in
- Catalog grid → staggered fade-in (30ms per cell)

**Technical:**
- Mobile-first, portrait, single column
- Single-file HTML — no new dependencies, no build
- Works offline — all assets local, no CDN
- Backwards-compatible profiles (add `migrated: true` flag if schema changes)

---

## 5. Hard rules — DO NOT BREAK

1. **Don't merge to main.** Izham reviews before merge.
2. **Don't touch `assets/items/`.** That's the v4 avatar items system.
3. **Don't add dependencies.** Keep `index.html` single-file.
4. **Don't change KSSR question bank format.** Extend, don't replace.
5. **Don't use emoji** in new code if a v2 icon exists for it.
6. **If schema changes needed:** propose in PR description, don't apply unilaterally.

---

## 6. Test plan (what Izham does after Zcode finishes)

1. Open `index.html` on phone (Izham's primary device)
2. D1 mode: 3 counting problems with icons
3. D3 mode: 1 word problem with tools
4. Open Reward Catalog → all 100 icons render
5. Open Find the Gold → gold glow works
6. No 404s in console
7. No broken layouts on mobile portrait

---

## 7. Deliverable from Zcode

- Push commits to `feature/icon-pack-v2`
- Send Izham: summary of files touched, lines added
- Wait for test feedback before any merge
- Schema changes → propose in PR description, get approval first

---

## 8. Quick start — what to do right now

```
git fetch origin
git checkout feature/icon-pack-v2
ls assets/items-v2/ | wc -l    # should be 101 (100 PNGs + README)
cat data/items-v2-schema.json | head -20
```

Then start with Tier 1, Step 1 (wire icons in).