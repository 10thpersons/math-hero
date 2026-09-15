import {expect} from '@playwright/test';
import {test} from './fixtures.js';

test('free character presets and hair persist with owned accessories and companions',async({page})=>{
  await page.addInitScript(()=>{
    if(!localStorage.getItem('hero-islands-v1'))localStorage.setItem('hero-islands-v1',JSON.stringify({version:1,active:'explorer-1',profiles:[{id:'explorer-1',grade:1,coins:200,avatar:{hat:'cap',pet:'cat'},ownedCosmetics:['cat']}]}));
  });
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.locator('#nav-avatar').click();
  await page.getByRole('button',{name:'Choose my character',exact:true}).click();
  await page.locator('[data-character="girl"]').click();
  await expect(page.locator('#coin-count')).toHaveText('200');
  await expect(page.locator('#world canvas')).toHaveAttribute('data-character','girl');
  await expect(page.locator('#world canvas')).toHaveAttribute('data-hairstyle','ponytail');
  await page.locator('[data-style="hairstyle"][data-value="pigtails"]').click();
  await expect(page.locator('#world canvas')).toHaveAttribute('data-hairstyle','pigtails');
  expect(await page.locator('#panel').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  await page.screenshot({path:'test-results/character-picker-phone.png',fullPage:true});
  await page.locator('#open-shop').click();
  await page.locator('[data-cosmetic="dress"]').click();
  await page.locator('#buy-cosmetic').click();
  await page.locator('[data-cosmetic="bow"]').click();
  await page.locator('#buy-cosmetic').click();
  await expect(page.locator('#coin-count')).toHaveText('130');
  await page.screenshot({path:'test-results/girl-outfit-phone.png',fullPage:true});
  await page.reload();
  await expect(page.locator('#world canvas')).toHaveAttribute('data-character','girl');
  await expect(page.locator('#world canvas')).toHaveAttribute('data-hairstyle','pigtails');
  await expect(page.locator('#world canvas')).toHaveAttribute('data-companion','cat');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0]);
  expect(saved.avatar.outfit).toBe('dress');expect(saved.avatar.hat).toBe('bow');
});

test('cloud sign-in explains parent steps without developer setup instructions',async({page})=>{
  await page.goto('/');
  await page.locator('#cloud-button').click();
  await expect(page.locator('#panel-content')).not.toContainText('Supabase');
  await expect(page.locator('#panel-content')).not.toContainText('Vercel');
  await expect(page.locator('#panel-content')).toContainText('email');
});
