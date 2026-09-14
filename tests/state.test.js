import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshState, normalizeState, rewardMission, buyDecoration, buyCosmetic, equipCosmetic, rewardQuiz, SAVE_KEY } from '../hero/state.js';
import { createProblems, checkAnswer } from '../hero/missions.js';

test('companions and outfits preserve purchases, separate siblings and reject unowned equipment', () => {
  const state = freshState(), p = state.profiles[0];
  assert.equal(buyCosmetic(p,'cat'),false);
  assert.equal(equipCosmetic(p,'cat'),false);
  p.coins=200;
  assert.equal(buyCosmetic(p,'cat'),true);
  assert.equal(equipCosmetic(p,'cat'),true);
  assert.equal(buyCosmetic(p,'cat'),true);
  assert.equal(p.coins,165);
  buyCosmetic(p,'raincoat'); equipCosmetic(p,'raincoat');
  buyCosmetic(p,'rabbit'); equipCosmetic(p,'rabbit');
  let restored=normalizeState(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.profiles[0].avatar.pet,'rabbit');
  assert.equal(restored.profiles[0].avatar.outfit,'raincoat');
  assert.equal(restored.profiles[0].coins,80);
  assert.equal(restored.profiles[1].avatar.pet,'none');
  p.avatar.pet='dragon';
  restored=normalizeState(state);
  assert.equal(restored.profiles[0].avatar.pet,'none');
  p.avatar.pet='none';
  assert.ok(normalizeState(state).profiles[0].ownedCosmetics.includes('cat'));
});

test('new explorers are independent and use a separate save namespace', () => {
  const s = freshState();
  assert.equal(s.profiles.length,2);
  assert.notEqual(SAVE_KEY,'math-hero-profile-index');
  rewardMission(s.profiles[0],{type:'bridge',grade:1,independent:2,hints:1});
  assert.equal(s.profiles[0].coins,30);
  assert.equal(s.profiles[1].coins,0);
  assert.equal(s.profiles[1].sessions.length,0);
});
test('replays earn coins; only the first-completion bonus is limited', () => {
  const p = freshState().profiles[0];
  const result = {type:'market',grade:1,independent:3,hints:0};
  assert.equal(rewardMission(p,result),30);
  assert.equal(rewardMission(p,result),15);
  assert.equal(p.sessions.length,2);
  assert.equal(rewardMission(p,{...result,grade:3}),30);
  assert.equal(p.coins,75);
});
test('decorations cannot overspend and unlocking is charged once', () => {
  const p = freshState().profiles[0];
  assert.equal(buyDecoration(p,'tree'),false);
  p.coins=30;
  assert.equal(buyDecoration(p,'tree'),true);
  assert.equal(p.coins,15);
  assert.equal(buyDecoration(p,'tree'),true);
  assert.equal(p.coins,15);
  assert.equal(buyDecoration(p,'bogus'),false);
});
test('corrupt storage is normalized and cannot inject style strings or negative coins', () => {
  const s = freshState();
  Object.assign(s.profiles[0],{coins:-1,avatar:{shirt:'url(evil)'},completed:['bogus'],decorations:[{type:'tree',slot:55}],name:' '});
  const next = normalizeState(s);
  assert.equal(next.profiles[0].coins,0);
  assert.match(next.profiles[0].avatar.shirt,/^#[a-f0-9]{6}$/);
  assert.equal(next.profiles[0].completed.length,0);
  assert.equal(next.profiles[0].decorations.length,0);
  assert.equal(normalizeState(null).profiles.length,2);
});
test('all mission variants have solvable, appropriate integer targets and reject invalid pieces', () => {
  for (const grade of [1,3]) for (const type of ['bridge','market']) for (const seed of [0,.3,.8,.99]) {
    const problems = createProblems(type,grade,()=>seed);
    assert.equal(problems.length,3);
    for (const p of problems) {
      assert.ok(Number.isInteger(p.target)&&p.target>0);
      if(grade===1) assert.ok(p.target<=20);
      const pieces=type==='bridge'&&grade===3?Array(p.groups).fill(p.length):Array(p.target).fill(1);
      assert.equal(checkAnswer(p,pieces),true);
      assert.equal(checkAnswer(p,[]),false);
      assert.equal(checkAnswer(p,[p.target+100]),false);
      assert.equal(checkAnswer(p,[...pieces,-1,1]),false);
      assert.equal(checkAnswer(p,['1']),false);
    }
  }
});


test('quiz rewards distinguish independent answers and reject incomplete or invalid results', () => {
  const p=freshState().profiles[0];
  assert.equal(rewardQuiz(p,{type:'quiz',subject:'math',grade:1,rounds:5,independent:5,hints:0}),25);
  assert.equal(rewardQuiz(p,{type:'quiz',subject:'sains',grade:1,rounds:5,independent:0,hints:5}),10);
  assert.equal(rewardQuiz(p,{type:'quiz',subject:'bm',grade:1,rounds:4,independent:4}),0);
  assert.equal(rewardQuiz(p,{type:'quiz',subject:'bi',grade:1,rounds:5,independent:6}),0);
  assert.equal(p.coins,35);
  const state=freshState();state.profiles[0]=p;
  assert.equal(normalizeState(state).profiles[0].sessions[0].rounds,5);
});

test('cosmetics require ownership, charge once and remain equipped after reload', () => {
  const state=freshState(), p=state.profiles[0];
  assert.equal(equipCosmetic(p,'crown'),false);
  assert.equal(buyCosmetic(p,'crown'),false);
  p.coins=50;
  assert.equal(buyCosmetic(p,'crown'),true);
  assert.equal(equipCosmetic(p,'crown'),true);
  assert.equal(p.coins,5);
  assert.equal(buyCosmetic(p,'crown'),true);
  assert.equal(p.coins,5);
  const loaded=normalizeState(state).profiles[0];
  assert.equal(loaded.avatar.hat,'crown');
  assert.deepEqual(loaded.ownedCosmetics,['crown']);
});

test('old profiles retain coins and free avatar choices and gain new fields safely', () => {
  const state=freshState();const p=state.profiles[0];
  p.coins=45;p.avatar.hat='explorer';delete p.ownedCosmetics;delete p.avatar.back;delete p.avatar.face;
  p.decorations=[{type:'tree',slot:2}];p.completed=['bridge-1'];
  const loaded=normalizeState(state).profiles[0];
  assert.equal(loaded.coins,45);assert.equal(loaded.avatar.hat,'explorer');
  assert.equal(loaded.avatar.back,'none');assert.deepEqual(loaded.ownedCosmetics,[]);
  assert.deepEqual(loaded.decorations,[{type:'tree',slot:2,rotation:0,level:1}]);
  assert.equal(rewardMission(loaded,{type:'bridge',grade:1,independent:3}),15);
});
