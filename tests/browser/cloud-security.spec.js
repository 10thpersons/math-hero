import { expect } from '@playwright/test';
import { test } from './fixtures.js';

const token = `e30.${Buffer.from(JSON.stringify({ exp: 4102444800 })).toString('base64url')}.test-signature`;
const parent = { id: '11111111-1111-4111-8111-111111111111', email: 'mock-parent@example.test' };

test('signing out during token refresh cannot restore the signed-out session', async ({ page }) => {
  let releaseRefresh, started = false;
  const pendingRefresh = new Promise(resolve => { releaseRefresh = resolve; });
  const expired = `e30.${Buffer.from(JSON.stringify({ exp: 1 })).toString('base64url')}.test`;
  await page.addInitScript(({ expired, parent }) => localStorage.setItem('hero-islands-parent-session-v1', JSON.stringify({ access_token: expired, refresh_token: 'mock-refresh', user: parent })), { expired, parent });
  await page.route('https://fdcwhspwiadxkfcvoocm.supabase.co/**', async route => {
    if (route.request().url().includes('grant_type=refresh_token')) { started = true; await pendingRefresh; return route.fulfill({ json: { access_token: token, refresh_token: 'new-refresh', user: parent } }); }
    return route.fulfill({ json: {} });
  });
  await page.goto('/');
  await expect.poll(() => started).toBe(true);
  await page.evaluate(async () => { const cloud = await import('/hero/cloud.js'); await cloud.signOut(); });
  releaseRefresh();
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => localStorage.getItem('hero-islands-parent-session-v1'))).toBeNull();
  expect(await page.evaluate(async () => (await import('/hero/cloud.js')).account())).toBeNull();
});

test('choosing device progress locks both choices while the upload is pending', async ({ page }) => {
  let releaseWrite;
  const pendingWrite = new Promise(resolve => { releaseWrite = resolve; });
  await page.addInitScript(({ token, parent }) => {
    localStorage.setItem('hero-islands-parent-session-v1', JSON.stringify({ access_token: token, refresh_token: 'mock-refresh', user: parent }));
    localStorage.setItem('hero-islands-cloud-pending-v1', '{}');
  }, { token, parent });
  await page.route('https://fdcwhspwiadxkfcvoocm.supabase.co/**', async route => {
    const request = route.request();
    if (request.url().includes('/auth/v1/user')) return route.fulfill({ json: parent });
    if (request.method() === 'GET') return route.fulfill({ json: [{ state: { profiles: [] }, updated_at: '2026-09-22T01:00:00Z' }] });
    await pendingWrite;
    return route.fulfill({ json: [{ updated_at: '2026-09-23T01:00:00Z' }] });
  });
  await page.goto('/');
  await page.locator('#keep-device').click();
  await expect(page.locator('#keep-device')).toBeDisabled();
  await expect(page.locator('#keep-cloud')).toBeDisabled();
  releaseWrite();
  await expect(page.locator('#panel')).not.toBeVisible();
});

test('a failed cloud read leaves device progress pending without writing', async ({ page }) => {
  const writes = [];
  await page.addInitScript(({ token, parent }) => localStorage.setItem('hero-islands-parent-session-v1', JSON.stringify({ access_token: token, refresh_token: 'mock-refresh', user: parent })), { token, parent });
  await page.route('https://fdcwhspwiadxkfcvoocm.supabase.co/**', async route => {
    if (route.request().url().includes('/auth/v1/user')) return route.fulfill({ json: parent });
    if (route.request().method() !== 'GET') writes.push(route.request().method());
    return route.fulfill({ status: 503, json: {} });
  });
  await page.goto('/');
  await expect(page.locator('#cloud-button')).toHaveText('Cloud needs attention');
  await page.locator('#sound-button').click();
  await page.waitForTimeout(1100);
  expect(writes).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('hero-islands-cloud-pending-v1'))).not.toBeNull();
});

test('another family cannot import device progress into their existing cloud save', async ({ page }) => {
  await page.addInitScript(({ token, parent }) => {
    localStorage.setItem('hero-islands-parent-session-v1', JSON.stringify({ access_token: token, refresh_token: 'mock-refresh', user: parent }));
    localStorage.setItem('hero-islands-save-owner-v1', 'other-family');
    localStorage.setItem('hero-islands-cloud-pending-v1', '{}');
  }, { token, parent });
  await page.route('https://fdcwhspwiadxkfcvoocm.supabase.co/**', route => route.fulfill({ json: route.request().url().includes('/auth/v1/user') ? parent : [{ state: { profiles: [] }, updated_at: '2026-09-22T01:00:00Z' }] }));
  await page.goto('/');
  await expect(page.locator('#keep-device')).toBeDisabled();
  await expect(page.locator('#cloud-status')).toContainText('another family');
});

test('a locally initiated PKCE callback creates a first cloud save after user validation', async ({ page }) => {
  let exchange, write;
  await page.addInitScript(() => localStorage.setItem('hero-islands-parent-pkce-v1', JSON.stringify({ verifier: 'local-test-verifier', created: Date.now() })));
  await page.route('https://fdcwhspwiadxkfcvoocm.supabase.co/**', async route => {
    const request = route.request();
    if (request.url().includes('grant_type=pkce')) { exchange = request.postDataJSON(); return route.fulfill({ json: { access_token: token, refresh_token: 'mock-refresh' } }); }
    if (request.url().includes('/auth/v1/user')) return route.fulfill({ json: parent });
    if (request.method() === 'GET') return route.fulfill({ json: [] });
    write = request.postDataJSON();
    return route.fulfill({ json: [{ updated_at: '2026-09-22T01:00:00Z' }] });
  });
  await page.goto('/?code=local-auth-code');
  await expect(page.locator('#cloud-button')).toHaveText('Cloud saved');
  expect(exchange).toEqual({ auth_code: 'local-auth-code', code_verifier: 'local-test-verifier' });
  expect(write.owner_id).toBe(parent.id);
  expect(write.state.profiles).toHaveLength(2);
});

test('a code callback without a locally initiated PKCE request is rejected', async ({ page }) => {
  const calls = [];
  await page.route('**/auth/v1/**', route => { calls.push(route.request().url()); return route.fulfill({ status: 400, body: '{}' }); });
  await page.goto('/?code=unsolicited-code');
  await expect(page.locator('#cloud-button')).toHaveText('Cloud needs attention');
  expect(calls).toEqual([]);
  expect(new URL(page.url()).searchParams.has('code')).toBe(false);
});

test('offline authentication preserves the cached session and unsynced device progress', async ({ page }) => {
  await page.addInitScript(({ token, parent }) => {
    localStorage.setItem('hero-islands-parent-session-v1', JSON.stringify({ access_token: token, refresh_token: 'mock-refresh', user: parent }));
  }, { token, parent });
  await page.route('https://fdcwhspwiadxkfcvoocm.supabase.co/**', route => route.abort('internetdisconnected'));
  await page.goto('/');
  await page.locator('#sound-button').click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('hero-islands-parent-session-v1')).user.id)).toBe(parent.id);
  expect(await page.evaluate(() => localStorage.getItem('hero-islands-cloud-pending-v1'))).not.toBeNull();
});

test('unsynced changes require a choice and a stale cloud revision cannot be overwritten', async ({ page }) => {
  const writes = [];
  await page.addInitScript(({ token, parent }) => {
    localStorage.setItem('hero-islands-parent-session-v1', JSON.stringify({ access_token: token, refresh_token: 'mock-refresh', user: parent }));
    localStorage.setItem('hero-islands-cloud-pending-v1', JSON.stringify({ owner: parent.id, revision: 'old' }));
  }, { token, parent });
  await page.route('https://fdcwhspwiadxkfcvoocm.supabase.co/**', async route => {
    const request = route.request();
    if (request.url().includes('/auth/v1/user')) return route.fulfill({ json: parent });
    if (request.method() === 'GET') return route.fulfill({ json: [{ state: { profiles: [] }, updated_at: '2026-09-22T01:00:00Z' }] });
    writes.push({ url: request.url(), method: request.method() });
    return route.fulfill({ json: [] });
  });
  await page.goto('/');
  await expect(page.locator('#keep-device')).toBeVisible();
  expect(writes).toEqual([]);
  await page.locator('#keep-device').click();
  await expect(page.locator('#cloud-status')).toContainText('changed on another device');
  expect(writes).toHaveLength(1);
  expect(writes[0].method).toBe('PATCH');
  expect(new URL(writes[0].url).searchParams.get('updated_at')).toBe('eq.2026-09-22T01:00:00Z');
  expect(await page.evaluate(() => localStorage.getItem('hero-islands-cloud-pending-v1'))).not.toBeNull();
});

test('an unsolicited token link cannot import device progress into another account', async ({ page }) => {
  const writes = [];
  await page.route('https://fdcwhspwiadxkfcvoocm.supabase.co/**', async route => {
    const request = route.request();
    if (request.url().includes('/rest/v1/') && request.method() === 'POST') writes.push(request.postDataJSON());
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(request.url().includes('/auth/v1/user') ? parent : request.method() === 'GET' ? [] : {}) });
  });
  await page.goto(`/#access_token=${token}&refresh_token=mock-attacker-refresh`);
  // Allow the asynchronous auth lookup and initial save to settle.
  await page.waitForTimeout(1200);
  expect(writes, 'A link without a locally initiated sign-in must not upload child progress').toEqual([]);
});

test('local actions do not write over cloud progress while its initial read is pending', async ({ page }) => {
  const writes = [];
  let releaseRead;
  const pendingRead = new Promise(resolve => { releaseRead = resolve; });
  let readStarted = false;
  await page.addInitScript(({ token, parent }) => {
    localStorage.setItem('hero-islands-parent-session-v1', JSON.stringify({ access_token: token, refresh_token: 'mock-refresh', user: parent }));
  }, { token, parent });
  await page.route('https://fdcwhspwiadxkfcvoocm.supabase.co/**', async route => {
    const request = route.request();
    if (request.url().includes('/auth/v1/user')) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(parent) });
    if (request.url().includes('/rest/v1/') && request.method() === 'GET') {
      readStarted = true;
      await pendingRead;
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
    if (request.method() === 'POST') writes.push(request.postDataJSON());
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/');
  await expect.poll(() => readStarted).toBe(true);
  await page.locator('#sound-button').click();
  await page.waitForTimeout(1200);
  const writesBeforeRead = [...writes];
  releaseRead();
  expect(writesBeforeRead, 'The device must finish reading the parent save before autosaving').toEqual([]);
});
