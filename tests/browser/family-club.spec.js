import { expect } from '@playwright/test';
import { test } from './fixtures.js';

test('completed playground round persists its record without awarding learning coins', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/');
  await page.clock.install();
  await page.locator('#nav-club').click();
  await page.locator('[data-arcade="boat"]').click();
  await page.locator('[data-start]').click();
  await page.clock.runFor(47000);
  await expect(page.locator('#arcade-club')).toBeVisible();
  await page.reload();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')));
  expect(saved.familyClub.play).toBe(1);
  expect(saved.profiles[0].arcade.boat.plays).toBe(1);
  expect(saved.profiles[1].arcade.boat.plays).toBe(0);
  expect(saved.profiles[0].coins).toBe(0);
  expect(saved.profiles[0].sessions).toEqual([]);
});

test('family club preserves old saves, shows both personal bests and fits a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#nav-club').click();
  await expect(page.getByRole('heading', { name: 'The Family Club', exact: true })).toBeVisible();
  await expect(page.locator('.club-records section')).toHaveCount(2);
  await expect(page.locator('.club-progress progress').first()).toHaveAttribute('value','0');
  expect(await page.locator('.family-club').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.locator('[data-arcade="pet"]').click();
  await expect(page.locator('.arcade-game')).toBeVisible();
  await page.getByRole('button', {name:'Exit game',exact:true}).click();
  await expect(page.locator('.club-progress progress').last()).toHaveAttribute('value','0');
  await page.locator('#club-learn').click();
  await page.locator('#games-club').click();
  await expect(page.getByRole('heading', {name:'The Family Club',exact:true})).toBeVisible();
});

test('a completed learning session restores the shared lighthouse and survives reload', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    const {freshState,SAVE_KEY}=await import('/hero/state.js');
    const state=freshState(); state.familyClub={learning:5,play:4};
    state.profiles[1].arcade.boat={best:240,plays:2};
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
  });
  await page.reload();
  await expect(page.locator('canvas')).toHaveAttribute('data-lighthouse','waiting');
  await page.addInitScript(() => { Math.random=()=>0.25; });
  await page.reload();
  const questions=await page.evaluate(async () => (await import('/hero/quiz.js')).createQuizQuestions(1,()=>0.25));
  await page.locator('#nav-play').click();
  await page.locator('[data-quiz="math"]').click();
  for (const [i,q] of questions.entries()) {
    await page.locator('.mh-quiz-choices').getByRole('button',{name:String(q.answer),exact:true}).click();
    await page.getByRole('button',{name:i===4?'Finish and collect coins':'Next question →',exact:true}).click();
  }
  await page.reload();
  await expect(page.locator('canvas')).toHaveAttribute('data-lighthouse','restored');
  await page.locator('#nav-club').click();
  await expect(page.getByRole('heading',{name:'The lighthouse shines again!',exact:true})).toBeVisible();
  await expect(page.locator('.club-records')).toContainText('240 points');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')));
  expect(saved.profiles[0].coins).toBe(25);
  expect(saved.familyClub).toEqual({learning:6,play:4});
});
