import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshState, normalizeState, unlockZone, upgradeDecoration, upgradeCost, rewardMission } from '../hero/state.js';
import { createDiscoveryRounds, checkDiscoveryAnswer } from '../hero/discovery.js';
import { createNavigationProblems, validateRoute } from '../hero/navigation.js';

test('districts charge once, protect savings and preserve old six-slot gardens', () => {
  const state=freshState(), p=state.profiles[0];
  delete p.unlockedZones;delete p.islandZone;
  p.coins=79;p.decorations=[{type:'tree',slot:5,rotation:2}];
  const migrated=normalizeState(state).profiles[0];
  assert.deepEqual(migrated.unlockedZones,['home']);
  assert.deepEqual(migrated.decorations,[{type:'tree',slot:5,rotation:2,level:1}]);
  assert.equal(unlockZone(migrated,'beach'),false);assert.equal(migrated.coins,79);
  migrated.coins=100;
  assert.equal(unlockZone(migrated,'beach'),true);assert.equal(migrated.coins,20);
  assert.equal(unlockZone(migrated,'beach'),true);assert.equal(migrated.coins,20);
  assert.equal(unlockZone(migrated,'unknown'),false);
  assert.deepEqual(state.profiles[1].unlockedZones,['home']);
});

test('unlocked district placements and upgrades survive reload while invalid slots are removed', () => {
  const state=freshState(),p=state.profiles[0];p.coins=300;
  unlockZone(p,'beach');p.islandZone='beach';
  p.decorations=[{type:'gazebo',slot:8,rotation:3,level:1},{type:'tree',slot:18},{type:'flower',slot:24}];
  assert.equal(upgradeCost(p.decorations[0]),48);
  assert.equal(upgradeDecoration(p,8),true);assert.equal(p.coins,172);
  assert.equal(upgradeDecoration(p,8),true);assert.equal(p.coins,76);
  assert.equal(upgradeDecoration(p,8),false);assert.equal(upgradeCost(p.decorations[0]),0);
  assert.equal(upgradeDecoration(p,7),false);
  const loaded=normalizeState(state).profiles[0];
  assert.equal(loaded.islandZone,'beach');assert.deepEqual(loaded.unlockedZones,['home','beach']);
  assert.deepEqual(loaded.decorations,[{type:'gazebo',slot:8,rotation:3,level:3}]);
  loaded.coins=0;loaded.decorations[0].level=1;
  assert.equal(upgradeDecoration(loaded,8),false);assert.equal(loaded.decorations[0].level,1);
});

test('new discovery activities reward each first completion and retain replay records', () => {
  const state=freshState(),p=state.profiles[0];
  for(const type of ['science','history','geography']) {
    assert.equal(rewardMission(p,{type,grade:1,independent:3,hints:0}),30);
    assert.equal(rewardMission(p,{type,grade:1,independent:1,hints:2}),9);
  }
  const loaded=normalizeState(state).profiles[0];
  assert.equal(loaded.coins,117);assert.equal(loaded.sessions.length,6);
  assert.deepEqual(loaded.completed,['science-1','history-1','geography-1']);
});

test('science rejects the misconception that all metals are magnetic', () => {
  for(const grade of [1,3]) for(const seed of [0,.25,.9]) {
    const rounds=createDiscoveryRounds('science',grade,()=>seed);assert.equal(rounds.length,3);
    for(const problem of rounds) {
      const answer=Object.fromEntries(problem.items.map(item=>[item.id,item.label.startsWith('Iron ')?'magnetic':'other']));
      assert.equal(checkDiscoveryAnswer(problem,answer),true);
      assert.equal(checkDiscoveryAnswer(problem,{}),false);
      const wrong={...answer};wrong[problem.items[0].id]=answer[problem.items[0].id]==='magnetic'?'other':'magnetic';
      assert.equal(checkDiscoveryAnswer(problem,wrong),false);
    }
  }
});

test('history uses chronological dates and clearly distinguishes invented stories', () => {
  for(const grade of [1,3]) {
    const rounds=createDiscoveryRounds('history',grade,()=>.2);
    assert.match(rounds[0].note,/invented/);assert.match(rounds[1].note,/invented/);
    for(const problem of rounds) {
      const sorted=[...problem.items].sort((a,b)=>a.order-b.order);
      const answer=Object.fromEntries(sorted.map((item,index)=>[item.id,index]));
      assert.equal(checkDiscoveryAnswer(problem,answer),true);
      [answer[sorted[0].id],answer[sorted[1].id]]=[1,0];
      assert.equal(checkDiscoveryAnswer(problem,answer),false);
    }
    assert.deepEqual(rounds[2].items.sort((a,b)=>a.order-b.order).map(item=>item.date),['31 August 1957','16 September 1963','31 August 1970']);
  }
});

function routeBetween(problem,start,target) {
  const queue=[[start,[]]],seen=new Set();
  while(queue.length) {
    const [at,route]=queue.shift(),key=at.join(',');
    if(seen.has(key))continue;seen.add(key);
    if(at.every((v,i)=>v===target[i]))return route;
    for(const [dir,dx,dy] of [['N',0,-1],['E',1,0],['S',0,1],['W',-1,0]]) {
      const next=[at[0]+dx,at[1]+dy];
      if(next.every(v=>v>=0&&v<problem.size)&&!problem.blocked.some(cell=>cell.every((v,i)=>v===next[i])))queue.push([next,[...route,dir]]);
    }
  }
  throw new Error('Unreachable destination');
}
test('every navigation map is solvable; routes must avoid obstacles and visit the market first', () => {
  for(const grade of [1,3]) for(const seed of [0,.25,.6,.99]) {
    const problems=createNavigationProblems(grade,()=>seed);
    assert.equal(new Set(problems.map(p=>p.title)).size,3);
    for(const p of problems) {
      const route=p.waypoint?[...routeBetween(p,p.start,p.waypoint),...routeBetween(p,p.waypoint,p.target)]:routeBetween(p,p.start,p.target);
      assert.equal(validateRoute(p,route),true);
      assert.equal(validateRoute(p,[]),false);
      assert.equal(validateRoute(p,['invalid']),false);
      assert.equal(validateRoute(p,Array(10).fill('N')),false);
    }
  }
  const p={size:3,start:[0,2],target:[2,2],waypoint:[0,0],blocked:[[1,1]]};
  assert.equal(validateRoute(p,['E','E']),false);
  assert.equal(validateRoute(p,['N','E','N','E','S','S']),false);
  assert.equal(validateRoute(p,['N','N','E','E','S','S']),true);
  assert.equal(validateRoute(p,['E','E','N','N','W','W','E','E','S','S']),false);
});
