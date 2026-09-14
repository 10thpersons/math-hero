import {test,expect} from '@playwright/test';

async function prepare(page,grade) {
  await page.addInitScript(grade=>{
    Math.random=()=>.25;
    if(!localStorage.getItem('hero-islands-v1'))localStorage.setItem('hero-islands-v1',JSON.stringify({version:1,active:'explorer-1',profiles:[{id:'explorer-1',name:'Grade explorer',grade,coins:0,avatar:{hat:'cap'},owned:['flower'],decorations:[],sessions:[],completed:[]}]}));
  },grade);
  await page.goto('/');
}
async function open(page,type) {await page.locator('#nav-play').click();await page.locator(`[data-mission="${type}"]`).click();}
async function discovery(page,type) {
  for(let round=0;round<3;round++) {
    const cards=await page.locator('.md-cards .md-card').evaluateAll(nodes=>nodes.map(n=>({key:n.dataset.action,label:n.querySelector('strong').textContent,date:n.querySelector('.md-date')?.textContent})));
    const circuit=await page.locator('[data-action="target-conductive"]').count();
    if(type==='history')cards.sort((a,b)=>round===1?parseInt(a.date)-parseInt(b.date):Date.parse(a.date)-Date.parse(b.date));
    for(const [index,card] of cards.entries()) {
      await page.locator(`[data-action="${card.key}"]`).click();
      if(circuit&&card.label==='Copper wire') {
        await page.locator('[data-action="hint"]').click();await expect(page.locator('.md-circuit')).toHaveClass(/md-powered/);
      }
      const target=type==='history'?index:circuit?(/^(Iron|Copper|Aluminium)/.test(card.label)?'conductive':'other'):(card.label.startsWith('Iron')?'magnetic':'other');
      await page.locator(`[data-action="target-${target}"]`).click();
    }
    await page.locator('[data-action="check"]').click();await expect(page.locator('.md-scene')).toHaveClass(/md-solved/);await page.locator('[data-action="check"]').click();
  }
}
function route(p,from,to) {
  const queue=[[from,[]]],seen=new Set();
  while(queue.length) {
    const [at,moves]=queue.shift(),key=at.join(',');if(seen.has(key))continue;seen.add(key);
    if(at.every((v,i)=>v===to[i]))return moves;
    for(const [dir,dx,dy] of [['N',0,-1],['E',1,0],['S',0,1],['W',-1,0]]) {
      const next=[at[0]+dx,at[1]+dy];
      if(next.every(v=>v>=0&&v<p.size)&&!p.blocked.some(c=>c.every((v,i)=>v===next[i])))queue.push([next,[...moves,dir]]);
    }
  }
  throw new Error('No route');
}
async function navigation(page) {
  for(let round=0;round<3;round++) {
    const p=await page.locator('.mh-nav-map').evaluate(map=>{
      const data={size:Number(map.dataset.size),blocked:[]};
      for(const tile of map.children) {
        const [,x,y]=tile.getAttribute('aria-label').match(/Column (\d+), row (\d+)/),pos=[Number(x)-1,Number(y)-1];
        for(const [cls,key] of [['jetty','start'],['market','waypoint'],['school','target']])if(tile.classList.contains(`mh-nav-${cls}`))data[key]=pos;
        if(tile.classList.contains('mh-nav-forest'))data.blocked.push(pos);
      }
      return data;
    });
    for(const step of [...route(p,p.start,p.waypoint),...route(p,p.waypoint,p.target)])await page.locator(`[data-action="${step}"]`).click();
    await expect(page.locator('.mh-nav-budget')).toHaveText('12 / 12 steps used');
    await page.locator('[data-action="send"]').click();await page.locator('[data-action="next"]').click();
  }
}
test('Darjah6 completes circuits, dated evidence and fuel-budget navigation with earned saved rewards',async({page})=>{
  test.setTimeout(90000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await prepare(page,6);
  for(const [index,type] of ['science','history','geography'].entries()) {
    await open(page,type);if(type==='geography')await navigation(page);else await discovery(page,type);
    await expect(page.locator('.success-content')).toBeVisible();await expect(page.locator('#coin-count')).toHaveText(String((index+1)*30));await page.getByRole('button',{name:'Back to exploring',exact:true}).click();
  }
  await page.reload();const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0]);
  expect(p.sessions.map(s=>s.grade)).toEqual([6,6,6]);expect(p.sessions.map(s=>s.independent)).toEqual([1,3,3]);expect(p.coins).toBe(90);expect(errors).toEqual([]);
});
for(const grade of [2,4,5])test(`Darjah${grade} discovery and navigation launch on a phone without overflow`,async({page})=>{
  await page.setViewportSize({width:390,height:844});await prepare(page,grade);
  for(const type of ['science','history','geography']) {
    await open(page,type);
    if(type==='science')await expect(page.locator(grade>=4?'.md-circuit':'.md-magnet')).toBeVisible();
    if(type==='history')await expect(page.locator('.md-cards .md-card')).toHaveCount(grade===2?4:grade);
    if(type==='geography')await expect(page.locator('.mh-nav-map')).toHaveAttribute('data-size',grade===2?'5':'6');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.getByRole('button',{name:'Back to island',exact:true}).click();
  }
  await expect(page.locator('#coin-count')).toHaveText('0');
});
