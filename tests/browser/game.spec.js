import { expect } from '@playwright/test';
import { test } from './fixtures.js';

async function solveMission(page, type, withHint=false) {
  for(let round=0;round<3;round++) {
    if(withHint && round===0) await page.getByRole('button',{name:'Show a hint',exact:true}).click();
    let target;
    if(type==='bridge') {
      const prompt=await page.locator('.mh-mission-prompt').textContent();
      const repair=prompt.match(/must be (\d+) units long; (\d+) units are already safe/);
      target=repair ? Number(repair[1])-Number(repair[2]) : Number((await page.locator('.mh-mission-scene-label').textContent()).match(/\d+/)[0]);
      const labels=await page.locator('.mh-mission-pieces button').allTextContents();
      const sizes=labels.map(s=>Number(s.match(/\d+/)[0])).sort((a,b)=>b-a);
      for(const size of sizes) while(target>=size) {
        await page.getByRole('button',{name:`+ ${size} ${size===1?'unit':'units'}`,exact:true}).click(); target-=size;
      }
      await page.getByRole('button',{name:'Test my bridge',exact:true}).click();
    } else {
      const text=await page.locator('.mh-mission-prompt').textContent();
      const quantity=text.match(/Buy (\d+)/);
      const price=Number(text.match(/RM(\d+)/)[1]);
      target=quantity?Number(quantity[1])*price:price;
      const alreadyPaid=text.match(/already paid RM(\d+)/);
      if(alreadyPaid)target-=Number(alreadyPaid[1]);
      const denominations=(await page.locator('.mh-mission-pieces button').allTextContents()).map(s=>Number(s.match(/\d+/)[0])).sort((a,b)=>b-a);
      for(const value of denominations) while(target>=value) {
        await page.getByRole('button',{name:`+ RM${value}`,exact:true}).click(); target-=value;
      }
      await page.getByRole('button',{name:'Pay for my order',exact:true}).click();
    }
    await expect(page.locator('.mh-mission-feedback')).toContainText('You did it');
    await page.getByRole('button',{name:round===2?/Finish mission/:/Next stop/}).click();
  }
  await expect(page.locator('.success-content')).toBeVisible();
}

test('island, both grade missions, rewards, avatar and home persist without altering Classic',async({page})=>{
  test.setTimeout(90000);
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{ if(!localStorage.getItem('math-hero-profile-test'))localStorage.setItem('math-hero-profile-test','legacy-kept'); });
  await page.goto('/');
  await expect(page.locator('#world canvas')).toBeVisible();
  await page.locator('#start-quest').click();
  await page.getByRole('button',{name:'Test my bridge',exact:true}).click();
  await expect(page.locator('.mh-mission-feedback')).toContainText('gap');
  await solveMission(page,'bridge',true);
  await expect(page.locator('#coin-count')).toHaveText('27');
  await page.getByRole('button',{name:'Back to exploring',exact:true}).click();
  await page.locator('#start-quest').click(); await solveMission(page,'bridge');
  await expect(page.locator('#coin-count')).toHaveText('42');
  await page.getByRole('button',{name:'Back to exploring',exact:true}).click();
  await page.locator('[data-location="market"]').click(); await solveMission(page,'market');
  await expect(page.locator('#coin-count')).toHaveText('72');
  await page.locator('#reward-decorate').click();
  await page.locator('[data-decor="tree"]').click(); await page.locator('[data-slot="2"]').click(); await page.locator('#place-item').click();
  await expect(page.locator('#coin-count')).toHaveText('57');
  await page.locator('#build-done').click();
  await page.locator('#nav-avatar').click(); await page.locator('#shop-wardrobe').click();
  await page.getByRole('button',{name:'Shirt colour 3',exact:true}).click();
  await page.getByRole('button',{name:'Explorer hat',exact:true}).click();
  await page.getByRole('button',{name:'Ready for adventure',exact:false}).click();
  await page.reload();
  await expect(page.locator('#coin-count')).toHaveText('57');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')));
  expect(saved.profiles[0].avatar.hat).toBe('explorer');
  expect(saved.profiles[0].decorations).toEqual([{type:'tree',slot:2,rotation:0,level:1}]);
  expect(saved.profiles[0].sessions[0].independent).toBe(2);
  expect(await page.evaluate(()=>localStorage.getItem('math-hero-profile-test'))).toBe('legacy-kept');
  await page.locator('#profile-button').click();
  await page.locator('[data-profile="explorer-2"]').click();
  await page.getByRole('button',{name:'Let’s explore',exact:false}).click();
  await expect(page.locator('#coin-count')).toHaveText('0');
  await page.locator('#start-quest').click(); await solveMission(page,'bridge');
  await page.getByRole('button',{name:'Back to exploring',exact:true}).click();
  await page.locator('[data-location="market"]').click(); await solveMission(page,'market');
  expect(errors).toEqual([]);
});

test('phone and tablet controls stay within viewport, keyboard focus survives manipulation',async({page})=>{
  for(const size of [{width:390,height:844},{width:768,height:1024},{width:320,height:700}]) {
    await page.setViewportSize(size); await page.goto('/');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.locator('#start-quest').click();
    const unit=page.getByRole('button',{name:'+ 1 unit',exact:true});
    await unit.focus(); await page.keyboard.press('Enter');
    await expect(unit).toBeFocused();
    const check=page.getByRole('button',{name:'Test my bridge',exact:true});
    await check.scrollIntoViewIfNeeded();
    const box=await check.boundingBox(); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x+box.width).toBeLessThanOrEqual(size.width);
    await page.getByRole('button',{name:'Back to island',exact:true}).click();
  }
});

test('blocked saves display an honest warning inside the modal',async({page})=>{
  await page.addInitScript(()=>{ Storage.prototype.setItem=function(){throw new DOMException('Blocked','QuotaExceededError');}; });
  await page.goto('/'); await page.locator('#nav-avatar').click(); await page.locator('#shop-wardrobe').click();
  await page.getByRole('button',{name:'Shirt colour 2',exact:true}).click();
  await expect(page.locator('#panel-save-status')).toBeVisible();
  await expect(page.locator('.offline-label')).toContainText('session only');
});

test('first revisit works offline after service worker activation',async({page,context})=>{
  await page.goto('/');
  await page.evaluate(async()=>{ await navigator.serviceWorker.ready; if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})); });
  await context.setOffline(true); await page.reload();
  await expect(page.locator('#world canvas')).toBeVisible();
  await page.locator('#start-quest').click();
  await expect(page.locator('.mh-mission')).toBeVisible();
});

test('unavailable WebGL keeps maths playable',async({page})=>{
  await page.addInitScript(()=>{ const original=HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args);}; });
  await page.goto('/'); await expect(page.locator('.fallback-world')).toBeVisible();
  await page.locator('#start-quest').click(); await expect(page.locator('.mh-mission')).toBeVisible();
});
