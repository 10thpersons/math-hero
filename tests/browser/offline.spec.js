import { expect } from '@playwright/test';
import { test } from './fixtures.js';

async function prepareOffline(page, context) {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve =>
      navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('canvas')).toBeVisible();
}

test('all five adventures and four quiz subjects open offline in every school year', async ({ page, context }) => {
  test.setTimeout(180000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await prepareOffline(page, context);
  await page.locator('#nav-play').click();
  for (const grade of [1, 2, 3, 4, 5, 6]) {
    await page.locator(`[data-practice-grade="${grade}"]`).click();
    for (const type of ['bridge', 'market', 'science', 'history', 'geography']) {
      await page.locator(`[data-mission="${type}"]`).click();
      const selector = type === 'geography' ? '.mh-navigation' :
        ['science', 'history'].includes(type) ? '.mh-discovery' : '.mh-mission-pieces';
      await expect(page.locator(selector)).toBeVisible();
      await page.getByRole('button', { name: 'Back to island', exact: true }).click();
      await page.locator('#nav-play').click();
    }
    for (const subject of ['math', 'sains', 'bm', 'bi']) {
      await page.locator(`[data-quiz="${subject}"]`).click();
      await expect(page.locator('.mh-quiz-question')).toBeVisible();
      await expect(page.locator('.mh-quiz-choices button')).toHaveCount(4);
      await page.getByRole('button', { name: 'Back to island', exact: true }).click();
      await page.locator('#nav-play').click();
    }
  }
  await expect(page.locator('#coin-count')).toHaveText('0');
  expect(errors).toEqual([]);
});

test('offline earned coins and purchased avatar survive an offline reload', async ({ page, context }) => {
  await page.addInitScript(() => { Math.random = () => 0.25; });
  await prepareOffline(page, context);
  const questions = await page.evaluate(async () =>
    (await import('/hero/quiz.js')).createQuizQuestions(1, () => 0.25));
  await page.locator('#nav-play').click();
  await page.locator('[data-quiz="math"]').click();
  for (const [index, question] of questions.entries()) {
    await expect(page.locator('.mh-quiz-question')).toHaveText(question.text);
    await page.locator('.mh-quiz-choices').getByRole('button', { name: String(question.answer), exact: true }).click();
    await page.getByRole('button', { name: index === 4 ? 'Finish and collect coins' : 'Next question →', exact: true }).click();
  }
  await expect(page.locator('#coin-count')).toHaveText('25');
  await page.locator('#reward-shop').click();
  await page.locator('#buy-cosmetic').click();
  await expect(page.locator('#coin-count')).toHaveText('0');
  await page.reload();
  const profile = await page.evaluate(() => JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0]);
  expect(profile.sessions).toHaveLength(1);
  expect(profile.sessions[0].earned).toBe(25);
  expect(profile.ownedCosmetics).toContain('headphones');
  expect(profile.avatar.hat).toBe('headphones');
  await page.locator('#nav-avatar').click();
  await expect(page.locator('.shop-preview .block-hat.headphones')).toBeVisible();
});

test('offline navigation tolerates query strings without caching callback URLs or arbitrary endpoints', async ({ page, context }) => {
  await prepareOffline(page, context);
  await context.setOffline(false);
  await page.evaluate(async () => {
    await fetch('/?code=offline-cache-regression');
    await fetch('/package.json');
  });
  const urls = await page.evaluate(async () => {
    const cache = await caches.open('hero-islands-v13');
    return (await cache.keys()).map(request => request.url);
  });
  expect(urls.some(url => url.includes('?') || url.endsWith('/package.json'))).toBe(false);
  await context.setOffline(true);
  await page.goto('/?source=offline-test');
  await expect(page.locator('#nav-play')).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
});
