# Math Hero — Enhance & Revise (Long Horizon)

**Date:** 2026-07-13  
**Repo:** `10thpersons/math-hero`  
**Working dir:** `/root/projects/adeen-kids-math`  
**Branch:** `feature/avatar-customizer-v2` @ `0b85202`  
**Live (main):** https://10thpersons.github.io/math-hero/  
**Audience:** Izham's 3 daughters, ages 7–9. Bahasa Malaysia UI + English.

---

## Last session log (where we left off)

| When | What |
|------|------|
| 2026-06-19 | Phase 1–6: RPG layer, shop, game integration |
| 2026-06-20 | Phase 7 polish, Phase 8 login+admin, Phase 9 PNG art swap |
| 2026-06-20 | User reported: **hat/shirt not seamless**, **checker backgrounds** on shirts |
| 2026-06-21 | `feature/avatar-customizer-v2` — 12 slots foundation + mobile polish |
| 2026-06-21 | Icon pack v2 (100 real-world objects) + avatar customizer v2 (hair/face/glasses/pants/shoes/acc) |
| **Now** | Resume enhance/revise toward **seamless Roblox-style** avatar |

### Open problem (user words)
> "The hat n the shirt not seamless. Plus the shirt got the checkers backgrounds some more. We need to make the design seamless mean when we give it hat it will wear hat seamlessly regardless what character etc. Also i think we need to revised it roblox character so everything look seamless?"

### Recommendation locked for this run
1. **Immediate (code):** strip checker/opaque backgrounds from PNGs; tight crop; fix layer anchors/Z-order.  
2. **Near-term (art):** re-prompt items ON a standardized chibi frame (Path A2).  
3. **Long-term (optional Path C):** full Roblox-body redesign — only after kids react to fixed layering.

---

## Goals for this enhance pass

### P0 — Must ship
1. No checker / white box under clothing PNGs  
2. Hat sits on head, shirt on torso, pants on legs, shoes on feet — across all 6 bodies  
3. Z-order correct: bg → shoes → pants → top → body → hair → face → glasses → hat → cape → hand → pet → acc  
4. Mobile editor usable (no clipped title/tabs; items grid scrolls)  
5. Asset sizes sane for Pages (flag / compress oversized PNGs >200KB)

### P1 — Should ship
6. Loadouts save/load still work after migration  
7. Share-as-PNG still works  
8. Starter pack equips cleanly for new profiles  
9. Icon pack v2 remains available as problem visuals (not mixed into avatar slots)

### P2 — Later
10. Reward catalog screen for items-v2  
11. Path A2 re-art sheet (items drawn on neutral template)  
12. Idle bob / happy reaction polish  
13. Merge strategy: avatar branch → main only after visual QA on phone

---

## Tasks

### Task 1 — Codebase map + gap analysis
- Inventory slots, renderAvatar, migration, loadouts, share  
- List every place items are rendered (editor, shop, mascot, end, admin)  
- Document current layer rects and body proportions  
- Output: `docs/plans/gap-analysis.md`

### Task 2 — PNG transparency + size audit
- Scan `assets/items/*.png` for non-transparent backgrounds (checker, white, gray)  
- Batch strip near-white / checker → alpha where safe  
- Report files still bad (need re-art)  
- Compress monsters (>200KB) with pngquant/optipng if available  
- Output: script + report; commit asset fixes on branch

### Task 3 — Seamless layering fix (code)
- Centralize SLOT_RECTS + Z_ORDER in `data/bodies.js`  
- Per-slot sensible defaults; optional per-item overrides in items.js  
- Ensure hair under hat, face under glasses, cape behind body or correct side  
- Verify naked body still looks good  
- Smoke: open editor, equip crown + shirt + pants + shoes on tiger/unicorn/dragon

### Task 4 — Mobile UX polish (editor/shop)
- No overflow clip on titles  
- Tabs scroll horizontally if needed  
- Preview stays fixed while grid scrolls  
- Touch targets ≥44px

### Task 5 — Verification
- `node --check` on extracted scripts  
- Local file open or simple HTTP serve  
- Document cache-bust URL for Pages after push  
- Do NOT merge to main without user OK

---

## Constraints
- Vanilla HTML/CSS/JS only  
- No Supabase  
- Bahasa Malaysia UI strings  
- Non-coder user: execute, don't ask him to run commands  
- Prefer cheap-first; re-art only after code path is solid  
- Keep work on `feature/avatar-customizer-v2` unless told to merge

## Acceptance (P0)
- [ ] Checker backgrounds gone on sample of 20 clothing items  
- [ ] Hat/shirt/pants/shoes look attached (not floating cards) on ≥3 bodies  
- [ ] Editor opens without JS errors  
- [ ] Profile save/load + equip persists  
- [ ] Branch pushed; summary with before/after notes for phone QA
