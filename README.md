# Math Hero — Ujian Matematik KSSR

A gamified quiz app for Malaysian primary school students (Darjah 1 & Darjah 3) covering core KSSR subjects in a fun, friendly format.

**Live:** https://10thpersons.github.io/math-hero/

## Subjects covered

- 🔢 **Matematik** — counting, addition, subtraction, multiplication, place value, money, time
- 🇲🇾 **Bahasa Melayu** — vocabulary, spelling, grammar, peribahasa, comprehension
- 🇬🇧 **English** — vocabulary, grammar, tenses, comprehension
- 🔬 **Sains** — body parts, animals, plants, weather, ecosystems, energy

## How it works

1. Pick an avatar (8 animal emoji)
2. Pick a grade (Darjah 1 = age 7, Darjah 3 = age 9)
3. Pick a subject
4. Answer 15 multiple-choice questions
5. Earn stars (1-3 per question based on speed), lives (3 hearts), streaks
6. End screen with letter grade A+/A/B/C/D + confetti on perfect score

## Tech

- **Pure HTML/CSS/JS** — no build, no dependencies, runs anywhere
- **Static hosting** — GitHub Pages (free, permanent URL)
- **Questions in JSON** — easy to add/edit, 1 file per subject+grade in `/data/`
- **Web Audio API** — procedural sound effects (no asset files)
- **LocalStorage** — could be added later for high scores (privacy-friendly for kids)

## Adding new questions

Edit any file in `data/`. Each file has this structure:

```json
{
  "subject": "math",
  "subject_name": "Matematik",
  "grade": 1,
  "questions": [
    {
      "text": "Berapakah bilangan objek?",
      "visual": "🍎🍎🍎",
      "options": [3, 4, 5, 6],
      "answer": 4
    }
  ]
}
```

Supported fields per question:
- `text` (required) — the question
- `visual` (optional) — emoji visual
- `equation` (optional) — math equation display
- `passage` (optional) — comprehension passage shown above the question
- `options` (required) — array of 4 choices
- `answer` (required) — the correct choice (string or number)

## Adding a new subject

1. Create 2 JSON files: `data/d1-<slug>.json` and `data/d3-<slug>.json`
2. Add a button in `index.html`:
```html
<button class="subject-btn" data-subject="<slug>">
  <span class="subject-emoji">📚</span>
  <span class="subject-name">Subject Name</span>
</button>
```

## Sources for KSSR exam content

- [bumigemilang.com](https://www.bumigemilang.com) — comprehensive past-year papers, all subjects, free PDFs
- [tcer.my](https://www.tcer.my) — direct PDF downloads of KSSR exams
- [edu.sistemguruonline.my](https://edu.sistemguruonline.my) — bank soalan by topic
- [wislah.com](https://tanya.wislah.com) — latihan with jawapan

## Privacy

No accounts. No analytics. No tracking. No data leaves the device.

Built with ❤️ for Cikgu Adeen & anak-anak.
