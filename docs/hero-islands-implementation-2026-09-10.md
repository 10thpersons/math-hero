# Hero Islands implementation · 10 September 2026

## Delivered

The first approved chapter is implemented locally on `codex/hero-islands`: a stylised 3D Malaysian island, customisable block avatar, two independent explorer profiles, a six-spot home garden, and Build & Rescue / Pasar Hero activities for Darjah 1 and 3 in English.

The original game is preserved as `classic.html`. Legacy profile keys are untouched. The new app has a dedicated local-storage schema and locally bundled renderer/fonts. Browser static hosting remains possible without a build pipeline.

## Learning behaviour

Bridge lengths correspond to the visual unit grid. Children compose lengths in Darjah 1 and work with equal groups in Darjah 3. Market orders use integer ringgit prices and exact payment; this chapter does not teach change. Problems vary between sessions, with three distinct rounds. Hints and incorrect checks disqualify a round from the independent count, while allowing unlimited practice.

Mission completion grants 30 coins once per mission/year combination. Replays do not farm coins. Creative decorations are recorded separately from learning practice. The journal explicitly avoids claiming mastery from these short activities.

## Verification

- Five Node tests passed: state isolation, repeat-reward prevention, spending rules, malformed-save normalization, mathematical solution validity.
- Five Playwright Chromium tests passed: complete missions for both years; persistence/legacy isolation; phone/tablet layout and keyboard operation; in-dialog storage warnings; first offline revisit; WebGL fallback.
- Desktop 1440×950 and phone 390×844 screenshots visually inspected; mission controls inspected on phone. Responsive checks also cover 320px and 768px widths.
- Independent code review found and then verified fixes for lost mission keyboard focus, hidden persistence warnings, overstated change coverage, and incomplete offline precaching. Final review found no remaining blockers in the reviewed changes.

## Boundaries

This is a first playable Maths chapter, not complete Darjah 1–6 coverage or certified curriculum alignment. Science/History/geography expansion, multiplayer, cloud sync, and freeform voxel terrain remain future work. Speech playback depends on voices available in the browser/device. Physical iPad/phone performance and child engagement/learning transfer have not yet been tested.

No remote push, merge, or deployment was performed. The previous GitHub Pages site is unchanged.
