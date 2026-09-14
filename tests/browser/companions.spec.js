import { expect } from '@playwright/test';
import { test } from './fixtures.js';

test('companions preview without spending, adopt once, persist and stay separate for siblings', async ({page}) => {
  await page.addInitScript(()=>{
    if(!localStorage.getItem('hero-islands-v1')) localStorage.setItem('hero-islands-v1',JSON.stringify({version:1,active:'explorer-1',profiles:[{id:'explorer-1',grade:1,coins:200,avatar:{hat:'cap'}}]}));
  });
  await page.goto('/');
  await page.locator('#world canvas').waitFor();
  await page.locator('#nav-avatar').click();
  await page.locator('[data-shop-category="pet"]').click();
  await expect(page.locator('[data-cosmetic]')).toHaveCount(6);
  await page.locator('[data-cosmetic="cat"]').click();
  await expect(page.locator('.shop-preview .pet-cat')).toBeVisible();
  await expect(page.locator('#coin-count')).toHaveText('200');
  await expect(page.locator('#world canvas')).toHaveAttribute('data-companion','none');
  await page.locator('#buy-cosmetic').click();
  await expect(page.locator('#coin-count')).toHaveText('165');
  await expect(page.locator('#world canvas')).toHaveAttribute('data-companion','cat');
  await page.locator('[data-unequip="pet"]').click();
  await expect(page.locator('#world canvas')).toHaveAttribute('data-companion','none');
  await page.locator('#buy-cosmetic').click();
  await expect(page.locator('#coin-count')).toHaveText('165');
  await page.locator('[data-shop-category="outfit"]').click();
  await page.locator('[data-cosmetic="raincoat"]').click();
  await page.locator('#buy-cosmetic').click();
  await page.reload();
  await expect(page.locator('#world canvas')).toHaveAttribute('data-companion','cat');
  await page.screenshot({path:'test-results/companion-island.png',fullPage:true});
  await page.locator('#nav-avatar').click();
  await expect(page.locator('.shop-preview .outfit-raincoat')).toBeVisible();
  await page.locator('[data-shop-category="pet"]').click();
  await page.screenshot({path:'test-results/companion-shop-desktop.png',fullPage:true});
  await page.keyboard.press('Escape');
  await page.locator('#profile-button').click();
  await page.locator('[data-profile="explorer-2"]').click();
  await expect(page.locator('#world canvas')).toHaveAttribute('data-companion','none');
  await expect(page.locator('#coin-count')).toHaveText('0');
});

test('companion shop fits a small phone and shows each distinct preview', async ({page}) => {
  await page.setViewportSize({width:320,height:740});
  await page.goto('/');
  await page.locator('#nav-avatar').click();
  await page.locator('[data-shop-category="pet"]').click();
  for(const pet of ['cat','rabbit','turtle','robot','hornbill','dragon']) {
    await page.locator(`[data-cosmetic="${pet}"]`).click();
    await expect(page.locator(`.shop-preview .pet-${pet}`)).toBeVisible();
    expect(await page.locator('#panel').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  }
  await page.screenshot({path:'test-results/companion-shop-phone.png',fullPage:true});
});
