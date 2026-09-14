# Hero Islands

A playable learning and building adventure for Malaysian primary learners. Children explore a blocky tropical island, personalise an avatar, build bridges, make exact payments at the pasar, and build across four island districts.

## Play locally

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://127.0.0.1:4173. The development server is intentionally accessible only on this computer. There is no build step. For static hosting, serve this repository with `index.html` as its entry point, including the `hero/` directory and `sw.js`.

## This chapter

- Darjah 1: compose lengths and make exact whole-ringgit payments, with targets up to 20.
- Darjah 2: larger addition and whole-ringgit payments.
- Darjah 3: equal groups and multiplication through measured bridge sections and multi-basket orders.
- Darjah 4: convert centimetres to millimetres and give change at the pasar.
- Darjah 5: build with fractional metre planks and pay decimal prices using exact sen amounts.
- Darjah 6: meet both a bridge length and plank ratio; calculate percentage discounts.
- Choose any of the six years directly in Play & earn. Adventure stamps show first completions for that year.
- Three varying rounds per mission, English instructions, optional device narration, and a Malay vocabulary glossary.
- Hints, retries, and an independent-round practice record. No countdown, lost lives, streak penalties, or mastery claims.
- Two separate local explorer profiles, editable nicknames/year, avatar colours and hats.
- Mini-games award 15 Hero Coins on every completion, plus a 15-coin first-completion bonus. Repeat play is unlimited.
- Five-question Maths, Science, BM, and English quizzes award 4 coins for a first-try answer, 1 for a corrected answer, and 5 for finishing. Incomplete runs do not pay out.
- Six purchasable avatar accessories: glasses, headphones, backpack, cape, crown, and wizard hat. Buy once, then equip or take off freely. All use earned in-game coins.
- Visual island studio with four districts, 24 directly tappable world squares, translucent previews, rotation, moving, and putting items away. The world stays visible while editing, including on phones.
- 13 decoration designs including the free flower patch. Unlock beaches (80 coins), forest (150), and village (240). Items have three upgrade tiers; removing or replacing items refunds upgrade costs. Unlocked designs can be placed repeatedly.
- Science Lab: test a magnet and sort materials. Time Detectives: arrange evidence cards chronologically, with more complex dates and longer fictional archives at upper years. Island Navigator: plan deliveries using cardinal directions, with larger maps, waypoints and travel budgets at upper years. Science Lab adds electrical conductor tests and comparison with magnetic properties.
- Touch controls plus keyboard-operable mission controls; reduced-motion support and a playable non-3D fallback.

These are selected foundational skills, not a complete or formally certified KSSR curriculum. Science experiments and quizzes are included; history and geography are enrichment activities. All six years now offer selected practice skills; this is not a full syllabus or a mastery assessment. Maths questions are generated with varied values. Darjah 1 and 3 each have 20 original English Science questions; the other four years each have 15, while curated BM/English questions use the existing banks with corrected ambiguous items and visible reading passages.

## Existing game and saves

The previous application is preserved verbatim in `classic.html`. It still offers the original Maths, Science, BM, and English quizzes. Open it from the Grown-ups panel.

Hero Islands stores a device copy under `hero-islands-v1`; it does not modify the existing `math-hero-profile-*` or `math-hero-profile-index` saves. Optional parent cloud save can sync that progress across devices after setup. The Grown-ups panel can export a JSON backup. Existing explorer coins, first-completion markers, free avatar choices, and decorations are retained when loading earlier Hero Islands saves. Storage failures show a warning and allow session-only play.

## Family cloud save

The app includes an optional parent email magic-link flow. Children use the existing explorer profiles and do not need email accounts. The app stores the parent email through Supabase Auth and one JSON game save per parent, containing only child nicknames, Darjah, avatar choices and game progress. Do not put a Supabase `service_role` key in the app.

Before enabling cloud save in production, run [`supabase/migrations/20260914_parent_cloud_save.sql`](supabase/migrations/20260914_parent_cloud_save.sql) once in the Supabase SQL Editor. Its Row Level Security policies allow a signed-in parent to read and change only their own row. Add every production Vercel URL to Supabase Auth **URL Configuration** as an allowed redirect URL, and set the Vercel production URL as the Site URL. The first sign-in imports the device's current local progress if the parent has no cloud save; later sign-ins load the cloud copy for that family.

## Architecture

- `hero/app.js`: interface, profile switching, mission integration, avatar/home editors, narration and rewards.
- `hero/world.js`: original Three.js geometry, animation, avatar and decoration rendering.
- `hero/missions.js`: touch activities and pure problem/check helpers.
- `hero/state.js`: backward-compatible profile schema, input normalization, repeatable reward and purchase rules.
- `hero/discovery.js` and `hero/navigation.js`: interactive science, history, and map activities.
- `hero/grade-banks.js`: original additional Science and BM/English practice for years 2, 4, 5 and 6.
- `hero/quiz.js`: quiz generators, curated Science content, language-bank corrections, question flow and completion reports.
- `hero/styles.css` , `hero/expansion.css`, `hero/quiz.css`, and `hero/missions.css`: responsive interface and activity styling.
- `hero/vendor/`: pinned Three.js ESM runtime, bundled locally for static/offline hosting.
- `hero/fonts/`: bundled Fredoka and Nunito fonts. Licenses accompany the fonts and Three.js runtime.

The game requires no runtime CDN. The service worker precaches the complete new chapter; offline revisits work after installation finishes. When publishing changed application assets, update the service-worker cache version. Classic assets are cached as visited, not fully precached.

After deliberately upgrading Three.js, recopy `node_modules/three/build/three.module.js`, `three.core.js`, and its LICENSE into `hero/vendor/`, then verify the game again.

## Verification

```powershell
npm.cmd test
npx.cmd playwright install chromium
npm.cmd run test:browser
```

Logic tests cover profile isolation, first-completion bonuses and replay rewards, purchases, corrupt save normalization, and valid/invalid mission solutions. Browser tests exercise all four mission/year combinations, hints, wrong answers, repeat rewards, profile switching, persistence, 320/390/768px layouts, keyboard focus, storage failure, first offline revisit, and WebGL fallback. Island tests also cover both grades in all three discovery games, district unlocks, upgrades, refunds, route validity and old-save migration. Expansion tests also cover every quiz subject/year, earned-coin purchases, saved cosmetics, and visual plot preview/place/rotate/move/remove workflows.

Screenshots and the implementation report are under `docs/previews/` and the dated implementation reports under `docs/`. Automated checks do not replace playtesting with the children, physical phones/iPads, or a delayed learning-transfer check.
