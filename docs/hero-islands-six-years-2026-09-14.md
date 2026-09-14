# Hero Islands: six-year practice expansion

## Delivered

Play & earn now has a Darjah 1–6 selector, a short skill description and five adventure stamps per year. Stamps record first completions, not mastery. Changing practice year preserves the explorer's island, wallet and previous records. Both explorer profiles remain independent.

| Year | Bridge and pasar practice |
| --- | --- |
| 1 | Compose small lengths; make whole-ringgit payments |
| 2 | Add tens and ones; combine larger ringgit notes |
| 3 | Equal groups; multiply basket quantities and prices |
| 4 | Convert centimetres to millimetres; give customer change |
| 5 | Use fractional metre planks; combine ringgit and sen |
| 6 | Satisfy both a length and plank ratio; calculate discounts |

The conversion challenge keeps the target in centimetres until solved. It no longer displays the converted answer before children attempt the calculation. Decimal money uses integer sen internally. Ratio bridges require both the correct total and the correct mix of plank sizes.

Science Lab introduces electrical conductor sorting for upper years. Its battery and bulb illustration responds to material tests. Darjah 6 compares electrical conductivity with magnetism, using separate properties for each material. History adds longer, explicitly invented museum archives with dates spanning years and months. Navigation adds larger maps, a collection stop and travel budgets.

Additional quiz content includes 15 Science questions and 12 questions in each of BM and English for each of years 2, 4, 5 and 6: 156 additional fixed questions in total. Maths questions generate varying values. Earlier year 1/3 banks remain available.

## Scope and sources

These are selected practice skills for all six years, not full syllabus coverage, certification or a mastery assessment. History and geography remain enrichment. The maps are fictional. A physical teacher/parent content review and child playtesting remain useful before classroom use.

Topic research used KPM-authored curriculum documents, including school-hosted copies referenced in `hero/grade-banks.js`. The [KPM curriculum portal](https://www.moe.gov.my/kurikulum) is the official starting point. The maths implementation consulted a [KPM Year 6 DSKP copy](https://id.scribd.com/document/638160033/DSKP-MATEMATIK-TAHUN-6-isbn) for ratio and discount topics. Some year 4/5 PDF sources were accessible only through search extracts; this work does not claim a complete standards-by-standards mapping.

Electrical material facts were checked against [EIA Energy Kids](https://www.eia.gov/kids/energy-sources/electricity/science-of-electricity.php) and the [University of Maine circuit activity](https://extension.umaine.edu/4h/stem-toolkits/skys-the-limit-solar-energy-project/activity-1-what-is-a-circuit/). Existing magnetic and Malaysian history references remain in `hero/discovery.js`.

## Verification

29 logic tests passed, including independently calculated maths answers, solvable maps, valid question options, all six saved years and separate first-completion bonuses. Independent review found no blocking issues after the conversion-answer fix and clearer language wording.

Browser coverage includes completing both maths missions and all four quiz subjects in each newly added year, grade 6 discovery game completions, phone smoke checks, stamps, profile isolation, saved rewards and all earlier island regressions. All 23 Chromium browser tests passed. A targeted Darjah 4 rerun also checks that the converted target is hidden before solving.

The local server needs no build step. Service-worker cache version is now `hero-islands-v5` and includes the additional question bank and year-selector styling. Work remains local on `codex/hero-islands`; nothing was pushed or deployed.
