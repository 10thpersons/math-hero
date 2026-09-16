import { test, expect } from '@playwright/test';

test('a wrong answer requires reading a clue and science replay avoids recent questions after reload', async ({ page }) => {
  await page.goto('/');
  const first = await page.evaluate(async () => {
    const quiz = await import('/hero/quiz.js');
    const host = document.createElement('div');
    document.body.replaceChildren(host);
    quiz.startQuiz(host, { grade: 1, subject: 'sains' });
    const text = host.querySelector('.mh-quiz-question').textContent;
    const question = quiz.createScienceQuestions(1, Math.random, Infinity).find(item => item.text === text);
    return question;
  });
  const wrong = first.options.find(option => option !== first.answer);
  await page.locator('.mh-quiz-choices').getByRole('button', { name: wrong, exact: true }).click();
  await expect(page.locator('.mh-quiz-feedback')).toHaveText(first.explanation);
  await expect(page.locator('.mh-quiz-choices button:enabled')).toHaveCount(0);
  await page.getByRole('button', { name: 'Try with this clue', exact: true }).click();
  await expect(page.locator('.mh-quiz-rejected')).toBeDisabled();
  await expect(page.locator('.mh-quiz-feedback')).toHaveText(first.explanation);
  await page.locator('.mh-quiz-choices').getByRole('button', { name: first.answer, exact: true }).click();
  await expect(page.locator('.mh-quiz-correct')).toBeDisabled();
  const recent = await page.evaluate(() => JSON.parse(localStorage.getItem('hero-islands-quiz-recent-1-sains')));
  await page.reload();
  const next = await page.evaluate(async () => {
    const quiz = await import('/hero/quiz.js');
    const host = document.createElement('div');
    document.body.replaceChildren(host);
    quiz.startQuiz(host, { grade: 1, subject: 'sains' });
    return JSON.parse(localStorage.getItem('hero-islands-quiz-recent-1-sains')).slice(-5);
  });
  expect(next.every(key => !recent.includes(key))).toBe(true);
});
