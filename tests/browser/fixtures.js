import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => localStorage.setItem('hero-islands-how-to-play-v1', 'seen'));
    await use(page);
  },
});
