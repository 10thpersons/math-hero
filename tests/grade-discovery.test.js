import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDiscoveryRounds,checkDiscoveryAnswer} from '../hero/discovery.js';
import {createNavigationProblems,validateRoute} from '../hero/navigation.js';

test('all six grades provide complete sorting sessions with distinct magnetic and conductive properties',()=>{
  for(let grade=1;grade<=6;grade++) for(const seed of [0,.25,.99]) {
    const rounds=createDiscoveryRounds('science',grade,()=>seed);assert.equal(rounds.length,3);
    for(const problem of rounds) {
      const answer={};
      for(const item of problem.items) {
        const magnetic=item.label.startsWith('Iron');
        const conductive=/^(Iron|Copper|Aluminium)/.test(item.label);
        assert.equal(item.magnetic,magnetic);assert.equal(item.conductive,conductive);
        answer[item.id]=(problem.property==='conductive'?conductive:magnetic)?problem.property:'other';
      }
      assert.equal(checkDiscoveryAnswer(problem,answer),true);
      assert.equal(checkDiscoveryAnswer(problem,{...answer,[problem.items[0].id]:'invalid'}),false);
    }
    if(grade>=4)assert.ok(rounds.some(p=>p.property==='conductive'));
    if(grade===6)assert.deepEqual(rounds.map(p=>p.property),['conductive','magnetic','conductive']);
  }
});

test('upper history chronology requires comparing year, month, day with explicit invented sources',()=>{
  for(let grade=1;grade<=6;grade++) {
    const rounds=createDiscoveryRounds('history',grade,()=>.4);assert.equal(rounds.length,3);
    for(const problem of rounds) {
      const sorted=[...problem.items].sort((a,b)=>a.order-b.order);
      const answer=Object.fromEntries(sorted.map((item,index)=>[item.id,index]));
      assert.equal(checkDiscoveryAnswer(problem,answer),true);
      assert.equal(new Set(problem.items.map(item=>item.order)).size,problem.items.length);
      for(const item of problem.items)assert.ok(item.evidence.includes(item.date));
    }
    if(grade>=4) {
      const problem=rounds[0];assert.equal(problem.items.length,grade);assert.match(problem.note,/invented/);
      const chronologically=[...problem.items].sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
      assert.deepEqual(chronologically.map(i=>i.order),[...problem.items].sort((a,b)=>a.order-b.order).map(i=>i.order));
      const byDay=[...problem.items].sort((a,b)=>parseInt(a.date)-parseInt(b.date));
      assert.equal(checkDiscoveryAnswer(problem,Object.fromEntries(byDay.map((item,i)=>[item.id,i]))),false);
    }
  }
});

function path(p,start,target) {
  const queue=[[start,[]]],seen=new Set();
  while(queue.length) {
    const [at,route]=queue.shift(),key=at.join(',');if(seen.has(key))continue;seen.add(key);
    if(at.every((v,i)=>v===target[i]))return route;
    for(const [dir,dx,dy] of [['N',0,-1],['E',1,0],['S',0,1],['W',-1,0]]) {
      const next=[at[0]+dx,at[1]+dy];
      if(next.every(v=>v>=0&&v<p.size)&&!p.blocked.some(c=>c.every((v,i)=>v===next[i])))queue.push([next,[...route,dir]]);
    }
  }
  throw new Error('Unreachable map');
}
test('all six grades have solvable distinct maps and upper routes respect fuel budgets',()=>{
  const sizes=[4,5,5,6,6,7];
  for(let grade=1;grade<=6;grade++) for(const seed of [0,.25,.6,.99]) {
    const problems=createNavigationProblems(grade,()=>seed);assert.equal(problems.length,3);
    assert.equal(new Set(problems.map(p=>p.title)).size,3);
    for(const p of problems) {
      assert.equal(p.size,sizes[grade-1]);
      const route=p.waypoint?[...path(p,p.start,p.waypoint),...path(p,p.waypoint,p.target)]:path(p,p.start,p.target);
      assert.equal(validateRoute(p,route),true);
      if(grade>=5) {
        assert.equal(route.length,p.maxSteps);
        const back={N:'S',S:'N',E:'W',W:'E'}[route[0]];
        assert.equal(validateRoute(p,[route[0],back,...route]),false);
      }
    }
  }
});

function seeded(seed) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}

test('replays vary material membership and fictional evidence while real dates remain fixed',()=>{
  for(let grade=1;grade<=6;grade++) {
    const sets=new Set(),diaries=new Set();
    for(let seed=1;seed<=30;seed++) {
      const science=createDiscoveryRounds('science',grade,seeded(seed));
      for(const p of science) {
        assert.ok(p.items.some(item=>item[p.property]));
        assert.ok(p.items.some(item=>!item[p.property]));
        assert.equal(new Set(p.items.map(item=>item.id)).size,p.items.length);
        sets.add(p.items.map(item=>item.id).sort().join(','));
      }
      const history=createDiscoveryRounds('history',grade,seeded(seed));
      diaries.add(history[1].items.map(item=>`${item.id}:${item.date}`).sort().join(','));
      assert.deepEqual(history[2].items.map(item=>item.date).sort(),['16 September 1963','31 August 1957','31 August 1970']);
    }
    assert.ok(sets.size>5,`grade ${grade}: actual materials must vary`);
    assert.ok(diaries.size>10,`grade ${grade}: diary evidence must vary`);
  }
});

test('generated forests and market locations vary with every map remaining solvable',()=>{
  for(let grade=1;grade<=6;grade++) {
    const forests=new Set(),markets=new Set();
    for(let seed=1;seed<=60;seed++) for(const p of createNavigationProblems(grade,seeded(seed))) {
      forests.add(JSON.stringify([...p.blocked].sort()));
      if(p.waypoint) markets.add(p.waypoint.join(','));
      const firstLeg=p.waypoint?{...p,blocked:[...p.blocked,p.target]}:p;
      const route=p.waypoint?[...path(firstLeg,p.start,p.waypoint),...path(p,p.waypoint,p.target)]:path(p,p.start,p.target);
      assert.equal(validateRoute(p,route),true);
      assert.ok(route.length<=30);
      if(grade>=5)assert.equal(route.length,p.maxSteps);
    }
    assert.ok(forests.size>30);
    if(grade>=3)assert.ok(markets.size>4);
  }
});
