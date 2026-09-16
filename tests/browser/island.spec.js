import { expect } from '@playwright/test';
import { test } from './fixtures.js';

async function seed(page,coins=0) {
  await page.addInitScript(coins=>{
    Math.random=()=>.25;
    if(!localStorage.getItem('hero-islands-v1'))localStorage.setItem('hero-islands-v1',JSON.stringify({version:1,active:'explorer-1',profiles:[{id:'explorer-1',name:'Island tester',grade:1,coins,avatar:{hat:'cap'},completed:[],sessions:[],decorations:[],owned:['flower']}]}));
  },coins);
}
async function selectGrade(page,grade) {
  if(grade===1)return;
  await page.locator('#profile-button').click();await page.locator('#school-year').selectOption(String(grade));
  await page.getByRole('button',{name:'Let’s explore',exact:false}).click();
}
async function solveDiscovery(page,type) {
  for(let round=0;round<3;round++) {
    const cards=await page.locator('.md-cards .md-card').evaluateAll(nodes=>nodes.map(node=>({action:node.dataset.action,label:node.querySelector('strong').textContent,date:node.querySelector('.md-date')?.textContent})));
    if(type==='history')cards.sort((a,b)=>Number(a.date.match(/\d+/)[0])-Number(b.date.match(/\d+/)[0]));
    // National dates sort by year, unlike the diary's same-month dates.
    if(type==='history'&&round===2)cards.sort((a,b)=>Number(a.date.match(/\d{4}/)[0])-Number(b.date.match(/\d{4}/)[0]));
    for(const [index,card] of cards.entries()) {
      await page.locator(`[data-action="${card.action}"]`).click();
      if(type==='science'&&round===0&&index===0)await page.locator('[data-action="hint"]').click();
      const target=type==='science'?(card.label.startsWith('Iron ')?'magnetic':'other'):index;
      await page.locator(`[data-action="target-${target}"]`).click();
    }
    await page.locator('[data-action="check"]').click();
    await expect(page.locator('.md-scene')).toHaveClass(/md-solved/);
    await page.locator('[data-action="check"]').click();
  }
}
function path(problem,start,target) {
  const queue=[[start,[]]],seen=new Set();
  while(queue.length) {
    const [at,route]=queue.shift(),key=at.join(',');if(seen.has(key))continue;seen.add(key);
    if(at.every((v,i)=>v===target[i]))return route;
    for(const [dir,dx,dy] of [['N',0,-1],['E',1,0],['S',0,1],['W',-1,0]]) {
      const next=[at[0]+dx,at[1]+dy];
      if(next.every(v=>v>=0&&v<problem.size)&&!problem.blocked.some(cell=>cell.every((v,i)=>v===next[i])))queue.push([next,[...route,dir]]);
    }
  }
  throw new Error('Map has no route');
}
async function solveNavigation(page) {
  for(let round=0;round<3;round++) {
    const problem=await page.locator('.mh-nav-map').evaluate(map=>{
      const result={size:Number(map.style.getPropertyValue('--map-size')),blocked:[]};
      for(const tile of map.children) {
        const [,x,y]=tile.getAttribute('aria-label').match(/Column (\d+), row (\d+)/),at=[Number(x)-1,Number(y)-1];
        for(const [cls,key] of [['jetty','start'],['school','target'],['market','waypoint']])if(tile.classList.contains(`mh-nav-${cls}`))result[key]=at;
        if(tile.classList.contains('mh-nav-forest'))result.blocked.push(at);
      }
      return result;
    });
    const route=problem.waypoint?[...path(problem,problem.start,problem.waypoint),...path(problem,problem.waypoint,problem.target)]:path(problem,problem.start,problem.target);
    for(const direction of route)await page.locator(`[data-action="${direction}"]`).click();
    await page.locator('[data-action="send"]').click();
    await page.locator('[data-action="next"]').click();
  }
}
for(const type of ['science','history','geography'])test(`${type} is playable at both grades, rewards completed runs and safely exits replays`,async({page})=>{
  test.setTimeout(90000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await seed(page);await page.goto('/');
  for(const grade of [1,3]) {
    await selectGrade(page,grade);await page.locator('#nav-play').click();await page.locator(`[data-mission="${type}"]`).click();
    if(type==='geography')await solveNavigation(page);else await solveDiscovery(page,type);
    await expect(page.locator('.success-content')).toBeVisible();
    await expect(page.locator('#coin-count')).toHaveText(String((type==='science'?27:30)*(grade===1?1:2)));
    await page.getByRole('button',{name:'Back to exploring',exact:true}).click();
  }
  await page.reload();const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0]);
  expect(p.sessions.map(s=>s.type)).toEqual([type,type]);expect(p.sessions.map(s=>s.independent)).toEqual(type==='science'?[2,2]:[3,3]);
  await page.locator('#nav-play').click();await page.locator(`[data-mission="${type}"]`).click();
  await page.getByRole('button',{name:'Back to island',exact:true}).click();await expect(page.locator('#coin-count')).toHaveText(type==='science'?'54':'60');
  expect(errors).toEqual([]);
});

test('island districts unlock, build and upgrade with saved progress and clear mobile layout',async({page})=>{
  await seed(page,400);await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.goto('/');
  await expect(page.locator('.island-label')).not.toBeVisible();await page.locator('#nav-home').click();
  await page.locator('[data-zone="beach"]').click();await page.locator('#unlock-zone').click();
  await expect(page.locator('#coin-count')).toHaveText('320');await expect(page.locator('.world-slot')).toHaveCount(6);
  await expect(page.locator('[data-slot="0"]')).toHaveCount(0);
  await page.locator('[data-decor="gazebo"]').click();await page.locator('[data-slot="8"]').click();await page.locator('#place-item').click();
  await expect(page.locator('#coin-count')).toHaveText('225');await page.locator('#upgrade-item').click();await expect(page.locator('#coin-count')).toHaveText('177');
  await page.locator('#rotate-item').click();await page.locator('#place-item').click();
  await page.reload();await page.locator('#nav-home').click();
  await expect(page.locator('[data-slot="8"]')).toHaveAttribute('aria-label',/gazebo/i);
  const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0]);
  expect(p.unlockedZones).toEqual(['home','beach']);expect(p.decorations).toEqual([{type:'gazebo',slot:8,rotation:1,level:2}]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('[data-slot="8"]').click();await page.locator('#move-item').click();await page.locator('[data-slot="9"]').click();await page.locator('#place-item').click();
  await expect(page.locator('#coin-count')).toHaveText('177');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0].decorations)).toEqual([{type:'gazebo',slot:9,rotation:1,level:2}]);
  await page.locator('[data-decor="flower"]').click();await page.locator('#place-item').click();
  await expect(page.locator('#coin-count')).toHaveText('225');
  await page.locator('#upgrade-item').click();await expect(page.locator('#coin-count')).toHaveText('205');
  await page.locator('#remove-item').click();await expect(page.locator('#coin-count')).toHaveText('225');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0].decorations)).toEqual([]);
});
