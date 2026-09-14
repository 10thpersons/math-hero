import { expect } from '@playwright/test';
import { test } from './fixtures.js';

test('main island shortcuts surface every adventure and launch science', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-location]')).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Science lab' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Time detectives' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Island navigator' })).toBeVisible();
  await page.getByRole('button', { name: 'Science lab' }).click();
  await expect(page.locator('#discovery-mount')).toBeVisible();
});
