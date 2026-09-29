import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function mount(page, type) {
  const source = await readFile(new URL('../../hero/arcade.js', import.meta.url), 'utf8');
  await page.route('**/hero/arcade.js', route => route.fulfill({contentType:'text/javascript', body:source}));
  await page.route('**/arcade-module-test', route => route.fulfill({contentType:'text/html', body:'<main id="game"></main>'}));
  await page.goto('/arcade-module-test');
  await page.clock.install();
  await page.evaluate(async type => {
    localStorage.setItem('arcade-test-coins', '120');
    window.results = [];
    window.exits = 0;
    const { startArcade } = await import('/hero/arcade.js');
    window.cleanupArcade = startArcade(document.querySelector('#game'), {
      type, pet:'rabbit', onComplete:result => window.results.push(result), onExit:() => window.exits++,
    });
  }, type);
}

for (const type of ['pet', 'boat']) {
  test(`${type} arcade pauses and completes exactly once without touching storage`, async ({page}) => {
    test.setTimeout(90000);
    await mount(page,type);
    await page.getByRole('button',{name:'Let’s play'}).click();
    await page.clock.runFor(1000);
    await page.getByRole('button',{name:'Pause',exact:true}).click();
    const time = await page.locator('[data-time]').textContent();
    await page.clock.runFor(3000);
    await expect(page.locator('[data-time]')).toHaveText(time);
    await page.getByRole('button',{name:'Keep playing'}).click();
    if (type === 'pet') {
      await page.getByRole('button',{name:'↑ Jump!'}).click();
      await page.clock.runFor(100);
      expect(await page.locator('.arcade-player').evaluate(el=>parseFloat(el.style.bottom))).toBeGreaterThan(17);
    } else {
      await page.getByRole('button',{name:'Steer right'}).click();
      await page.clock.runFor(100);
      expect(await page.locator('.arcade-player').evaluate(el=>el.style.left)).toBe('75%');
    }
    await page.clock.runFor(46000);
    const results = await page.evaluate(()=>window.results);
    expect(results).toHaveLength(1);
    expect(results[0].type).toBe(type);
    expect(Number.isInteger(results[0].score)).toBe(true);
    expect(results[0].score).toBeGreaterThanOrEqual(0);
    expect(results[0].score).toBeLessThanOrEqual(1000);
    await page.clock.runFor(3000);
    expect(await page.evaluate(()=>window.results.length)).toBe(1);
    expect(await page.evaluate(()=>localStorage.getItem('arcade-test-coins'))).toBe('120');
  });
}

test('early exit stops a round without completion', async ({page}) => {
  await mount(page,'pet');
  await page.getByRole('button',{name:'Let’s play'}).click();
  await page.getByRole('button',{name:'Exit game'}).click();
  await page.clock.runFor(46000);
  expect(await page.evaluate(()=>window.results)).toEqual([]);
  expect(await page.evaluate(()=>window.exits)).toBe(1);
});


test('both playground games load after an offline reload', async ({page,context}) => {
  await page.addInitScript(()=>localStorage.setItem('hero-islands-how-to-play-v1','seen'));
  await page.goto('/');
  await page.evaluate(async()=>{
    await navigator.serviceWorker.ready;
    if(!navigator.serviceWorker.controller) await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
  });
  await context.setOffline(true);
  await page.reload();
  for (const type of ['pet','boat']) {
    await page.locator('#nav-play').click();
    await page.locator('#games-club').click();
    await page.locator(`[data-arcade="${type}"]`).click();
    await page.getByRole('button',{name:'Let’s play'}).click();
    await expect(page.locator('.arcade-stage')).toBeVisible();
    await page.getByRole('button',{name:'Exit game'}).click();
    await page.keyboard.press('Escape');
  }
  await expect(page.locator('#coin-count')).toHaveText('0');
});
