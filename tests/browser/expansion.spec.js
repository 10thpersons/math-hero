import { expect } from '@playwright/test';
import { test } from './fixtures.js';

async function seed(page, coins=0) {
  await page.addInitScript(({coins})=>{
    Math.random=()=>0.25;
    if(!localStorage.getItem('hero-islands-v1'))localStorage.setItem('hero-islands-v1',JSON.stringify({version:1,active:'explorer-1',profiles:[{id:'explorer-1',grade:1,coins,name:'Test explorer',avatar:{hat:'cap'},completed:[],sessions:[],owned:['flower'],decorations:[]}]}));
  },{coins});
}
async function expectedQuestions(page,subject,grade) {
  return page.evaluate(async({subject,grade})=>{
    const q=await import('/hero/quiz.js');
    if(subject==='math')return q.createQuizQuestions(grade,()=>0.25);
    if(subject==='sains')return q.createScienceQuestions(grade,()=>0.25);
    const bank=await (await fetch(`/data/d${grade}-${subject}.json`)).json();
    return q.shuffle(q.normalizeBank(bank),()=>0.25).slice(0,5);
  },{subject,grade});
}
async function completeQuiz(page,subject,grade,wrongFirst=false) {
  const questions=await expectedQuestions(page,subject,grade);
  for(let i=0;i<5;i++) {
    const q=questions[i];
    await expect(page.locator('.mh-quiz-question')).toHaveText(q.text);
    if(q.passage)await expect(page.locator('.mh-quiz aside')).toContainText(q.passage);
    if(i===0&&wrongFirst) {
      const wrong=q.options.find(o=>String(o)!==String(q.answer));
      await page.locator('.mh-quiz-choices').getByRole('button',{name:String(wrong),exact:true}).click();
      await expect(page.locator('.mh-quiz-rejected')).toBeDisabled();
    }
    await page.locator('.mh-quiz-choices').getByRole('button',{name:String(q.answer),exact:true}).click();
    await expect(page.locator('.mh-quiz-correct')).toBeDisabled();
    await page.getByRole('button',{name:i===4?'Finish and collect coins':'Next question →',exact:true}).click();
  }
  await expect(page.locator('.success-content')).toBeVisible();
}

test('all quiz subjects earn repeatable coins, retain grade-specific journal entries',async({page})=>{
  test.setTimeout(90000);
  await seed(page);await page.goto('/');
  let wallet=0;
  for(const grade of [1,3]) {
    if(grade===3) {
      await page.locator('#profile-button').click();await page.locator('#school-year').selectOption('3');
      await page.getByRole('button',{name:'Let’s explore',exact:false}).click();
    }
    for(const subject of ['math','sains','bm','bi']) {
      await page.locator('#nav-play').click();await page.locator(`[data-quiz="${subject}"]`).click();
      await completeQuiz(page,subject,grade,subject==='math');wallet+=subject==='math'?22:25;
      await expect(page.locator('#coin-count')).toHaveText(String(wallet));
      await page.getByRole('button',{name:'Back to exploring',exact:true}).click();
    }
  }
  await page.reload();await expect(page.locator('#coin-count')).toHaveText(String(wallet));
  const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')));
  expect(data.profiles[0].sessions).toHaveLength(8);
  expect(data.profiles[0].sessions.every(s=>s.type==='quiz'&&s.rounds===5)).toBe(true);
  await page.locator('#nav-play').click();await page.locator('[data-quiz="math"]').click();
  await page.getByRole('button',{name:'Back to island',exact:true}).click();
  await expect(page.locator('#coin-count')).toHaveText(String(wallet));
});

test('earned quiz coins buy visible cosmetic, repeat wear is free and persists',async({page})=>{
  await seed(page);await page.goto('/');await page.locator('#nav-avatar').click();
  await page.locator('#buy-cosmetic').click();await expect(page.locator('#shop-feedback')).toContainText('25 more');
  await page.locator('#shop-play').click();await page.locator('[data-quiz="math"]').click();
  await completeQuiz(page,'math',1);await page.locator('#reward-shop').click();
  await page.locator('#buy-cosmetic').click();await expect(page.locator('#coin-count')).toHaveText('0');
  await expect(page.locator('#buy-cosmetic')).toHaveText('Wearing it');
  await expect(page.locator('.shop-preview .block-hat.headphones')).toBeVisible();
  await page.locator('[data-unequip="hat"]').click();await page.locator('#buy-cosmetic').click();
  await expect(page.locator('#coin-count')).toHaveText('0');
  await page.reload();const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0]);
  expect(p.ownedCosmetics).toEqual(['headphones']);expect(p.avatar.hat).toBe('headphones');
});

test('visual plot previews before purchase, places, rotates, moves and puts away',async({page})=>{
  await seed(page,60);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();await page.locator('#nav-home').click();
  await expect(page.locator('#panel')).not.toBeVisible();await expect(page.locator('.world-slot')).toHaveCount(6);
  await page.locator('[data-decor="tree"]').click();await page.locator('[data-slot="2"]').click();
  await expect(page.locator('#coin-count')).toHaveText('60');
  await page.locator('#place-item').click();await expect(page.locator('#coin-count')).toHaveText('45');
  await page.locator('#rotate-item').click();await page.locator('#place-item').click();
  await expect(page.locator('#coin-count')).toHaveText('45');
  await page.locator('#move-item').click();await page.locator('[data-slot="0"]').click();await page.locator('#place-item').click();
  let p=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0]);
  expect(p.decorations).toEqual([{type:'tree',slot:0,rotation:1,level:1}]);
  await page.reload();await page.locator('#nav-home').click();
  await expect(page.locator('[data-slot="0"]')).toHaveAttribute('aria-label',/tree/);
  await page.locator('[data-slot="0"]').click();await page.locator('#remove-item').click();
  p=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0]);expect(p.decorations).toEqual([]);
  expect(p.owned).toContain('tree');await expect(page.locator('#coin-count')).toHaveText('45');
  await page.locator('#nav-play').click();await expect(page.locator('#adventure')).not.toHaveClass(/building/);
});

test('phone garden markers and sticky world stay visible during placement',async({page})=>{
  await seed(page,60);await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');await page.waitForSelector('canvas');await page.locator('#nav-home').click();
  await page.locator('[data-decor="bench"]').click();await page.locator('[data-slot="4"]').click();
  await page.locator('#place-item').scrollIntoViewIfNeeded();
  const rect=await page.locator('#world').boundingBox();expect(rect.y).toBeGreaterThanOrEqual(0);expect(rect.y+rect.height).toBeLessThan(844);
  await page.locator('#place-item').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('#coin-count')).toHaveText('40');
});

test('language quiz works offline without awarding coins for an unfinished run',async({page,context})=>{
  await seed(page);await page.goto('/');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});
  await context.setOffline(true);await page.reload();await page.locator('#nav-play').click();await page.locator('[data-quiz="bm"]').click();
  await expect(page.locator('.mh-quiz-question')).toBeVisible();await page.getByRole('button',{name:'Back to island',exact:true}).click();
  await expect(page.locator('#coin-count')).toHaveText('0');
});
