# Hero Islands visual plot and learning expansion · 11 September 2026

## What changed

My plot is now a direct visual garden editor. A closer camera shows six editable garden squares. Select a decoration, tap a square to preview it, then place it. Children can rotate, move, replace, or put decorations away. Unlocked decorations stay owned. The garden remains visible above the controls on phones; occupied markers no longer cover the item being placed. Existing saves keep their coins and decorations.

The Hero Shop sells six original wearable accessories: glasses, headphones, backpack, cape, crown, and wizard hat. Children can preview before buying, equip owned items without paying again, and take them off. The shop and actual 3D avatar use matching colours. Base avatar colours and existing free hats remain free.

## Coins and learning

- Every completed mini-game awards 15 Hero Coins, with a further 15 on its first completion for that school year.
- Each five-question quiz awards 4 coins for a first-try answer or 1 with help, plus 5 for finishing. Completed quizzes pay 10–25 coins. Unfinished runs do not pay out.
- There is no replay limit or daily cap. Completion callbacks are guarded against duplicate payouts within the same run.
- Maths, Science, BM and English quizzes are available for Darjah 1 and 3. Maths values are generated afresh. Science has 20 original English questions per grade. Existing language banks are curated to exclude unsupported visual questions and correct ambiguous wording/answers. Comprehension passages are both visible and included in narration.
- Practice journals preserve the distinction between three-round mini-games and five-question quizzes, with independent answers recorded separately.

## Verification

12 Node tests passed. These include independently calculated maths answers across seeded/boundary values, all Science questions, language-bank corrections, old-save compatibility, repeat rewards, purchases and ownership checks.

10 Playwright Chromium tests passed. Coverage includes all eight quiz subject/year combinations, first-try versus corrected answer rewards, earned-coin purchases, saved equipment, plot preview/place/rotate/move/put-away, phone sticky-world placement, legacy save isolation, blocked saving, offline revisits, and WebGL fallback.

An initial browser run hit long-test timeouts while two software-rendered worlds competed for graphics work; one old test also clicked the wardrobe navigation twice. The navigation test was corrected, the world now pauses behind modals, and the browser suite runs with one worker. The final full suite passed in 49.9 seconds.

Independent review verified replacement previews restore hidden items, wearable colours match the preview, and modal rendering resumes correctly. No remaining blockers were found in that review.

## Limits

Content still covers selected Darjah 1 and 3 skills, not the complete Darjah 1–6 curriculum. No real-money shop, multiplayer, account, or cloud sync was added. Physical-device child playtesting remains necessary. No push, merge, or deployment was performed; changes are available in the local preview.
