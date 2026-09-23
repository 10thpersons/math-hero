import { expect } from '@playwright/test';
import { test } from './fixtures.js';

test('parent cloud-save screen sends only the parent email to Supabase magic-link auth', async ({ page }) => {
  let payload;
  await page.route('**/auth/v1/otp?*', async route => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/');
  await page.locator('#cloud-button').click();
  await expect(page.getByRole('heading', { name: 'Save your family’s island' })).toBeVisible();
  await page.locator('#cloud-email').fill('parent@example.com');
  await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
  await expect(page.locator('#cloud-status')).toContainText('Check your email');
  expect(payload).toMatchObject({ email: 'parent@example.com', create_user: true, code_challenge_method: 's256' });
  expect(JSON.stringify(payload)).not.toContain('child');
});
