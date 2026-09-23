import { readFileSync } from 'node:fs';
import { expect } from '@playwright/test';
import { test } from './fixtures.js';

const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
const headers = Object.fromEntries(config.headers[0].headers.map(({key,value}) => [key.toLowerCase(),value]));

for (const path of ['/', '/classic.html']) test(`security headers permit normal scripts on ${path}`, async ({ page }) => {
  await page.route(`http://127.0.0.1:4173${path}`, async route => {
    const response = await route.fetch();
    await route.fulfill({response, headers: {...response.headers(), ...headers}});
  });
  const violations = [];
  page.on('console', message => { if (/Content Security Policy|violates.*directive/i.test(message.text())) violations.push(message.text()); });
  await page.goto(path);
  if (path === '/') {
    await expect(page.locator('#world canvas')).toBeVisible();
    await page.locator('#start-quest').click();
    await expect(page.locator('.mh-mission')).toBeVisible();
  } else {
    await expect(page.locator('body')).toContainText('Math');
    await expect.poll(() => page.evaluate(() => typeof window.ITEMS)).not.toBe('undefined');
  }
  expect(violations).toEqual([]);
});
