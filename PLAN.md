# Adeen's Kids Math Game — Implementation Plan

**Goal:** Single-file HTML game that helps Izham's two kids (Darjah 1, Darjah 3) learn Matematik KSSR through gamified quizzes matching real exam format.

**Architecture:** One self-contained HTML file with embedded CSS + JS. No build, no dependencies, no backend. Opens directly in any browser, works offline, shareable via Telegram/WhatsApp.

**Tech Stack:** HTML5 + CSS3 + Vanilla JS + Web Audio API (procedural sounds, no asset files).

## Design

### Question Bank (real KSSR format observed from tcer.my past papers)

**Darjah 1 (15 questions, easier):**
1. Counting objects (visual emoji count) — 3 Q
2. Number comparison (which is bigger) — 3 Q
3. Number → word (BM spelling: "Dua puluh enam") — 2 Q
4. Simple addition (under 20) — 3 Q
5. Simple subtraction (under 20) — 2 Q
6. Word problem (story math) — 2 Q

**Darjah 3 (15 questions, harder):**
1. Counting (3-digit, group of 10s) — 2 Q
2. Multiplication tables (2, 3, 4, 5, 10) — 3 Q
3. Place value (ratus, puluh, sa) — 2 Q
4. Add/subtract (2-digit, regrouping) — 3 Q
5. Word problem (2-step) — 3 Q
6. Time/money (ringgit & sen) — 2 Q

### Gamification Mechanics

- **Stars:** 1 = correct, 2 = correct first try, 3 = correct AND under 10s
- **Streak bonus:** every 5-correct streak = +1 bonus star + sparkle animation
- **Lives:** 3 hearts, lose one per wrong answer
- **Mascot:** CSS-animated animal that reacts (happy/sad)
- **Sound:** Web Audio API for correct (chime), wrong (buzz), level-up (fanfare)
- **Progress bar:** fills as questions answered
- **End screen:** total stars, letter grade (A+/A/B/C), replay button
- **Confetti on perfect score**

### UI/UX

- Bahasa Malaysia primary (matches KSSR)
- Big touch-friendly buttons (60px+ height)
- Bright kid-friendly colors (no eye strain)
- Comic Sans-like font (Baloo from Google Fonts)
- Avatar picker (4 animal emojis: 🐱🐶🐰🐼)
- Grade picker (D1 vs D3) on start screen

## Tasks

1. Create single HTML file with start screen (avatar + grade picker) — 5 min
2. Add Darjah 1 question bank (15 Q, 4 types) — 10 min
3. Add Darjah 3 question bank (15 Q, 4 types) — 10 min
4. Build question renderer with 4-option MCQ UI — 10 min
5. Add scoring, stars, lives, streak — 10 min
6. Add Web Audio sound effects — 5 min
7. Add end screen with grade letter + replay — 5 min
8. Test in browser via Playwright screenshot — 5 min
9. Verify on phone viewport size — 5 min

**Estimated total: ~70 min of work, delivered as one file: `index.html`**

## Files

- `/root/projects/adeen-kids-math/index.html` — the game

## Verification

- Open `file:///root/projects/adeen-kids-math/index.html` in browser
- Pick avatar, pick Darjah 1, answer all 15 questions
- Verify: stars animate, sounds play, end screen shows grade
- Repeat for Darjah 3
- Test on phone-sized viewport (375x667) — buttons still tappable

## Future (YAGNI — not in v1)

- Bilingual EN/MS toggle
- Multiplayer race mode
- Parent dashboard with progress tracking
- More subjects (BM, BI, Sains)
- Cloud sync / accounts
