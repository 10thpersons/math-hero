import { test, expect } from '@playwright/test';

test('first visit shows a clear kid and parent guide that can be reopened', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A little guide before you begin.' })).toBeVisible();
  await expect(page.getByText('FOR KIDS')).toBeVisible();
  await expect(page.getByText('FOR GROWN-UPS', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Let’s explore' }).click();
  await expect(page.locator('#panel')).not.toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'How to play' }).click();
  await expect(page.getByRole('heading', { name: 'A little guide before you begin.' })).toBeVisible();
});
