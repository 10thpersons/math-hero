import test from 'node:test';
import assert from 'node:assert/strict';
import { freshState, normalizeState, rewardMission, rewardQuiz, GRADES } from '../hero/state.js';

test('all six school years preserve separate completion bonuses and practice history',()=>{
  const state=freshState(),p=state.profiles[0];
  for(const grade of GRADES){
    p.grade=grade;
    assert.equal(rewardMission(p,{type:'bridge',grade,independent:3,hints:0}),30);
    assert.equal(rewardMission(p,{type:'bridge',grade,independent:3,hints:0}),15);
    assert.equal(rewardQuiz(p,{subject:'math',grade,rounds:5,independent:5,hints:0}),25);
    const loaded=normalizeState(state).profiles[0];
    assert.equal(loaded.grade,grade);
    assert.ok(loaded.completed.includes(`bridge-${grade}`));
    assert.equal(loaded.sessions.at(-1).grade,grade);
  }
  assert.equal(p.coins,420);
  assert.equal(state.profiles[1].coins,0);
  for(const grade of [0,7,2.5,'4',null]){
    assert.equal(rewardMission(p,{type:'bridge',grade,independent:3}),0);
    assert.equal(rewardQuiz(p,{subject:'math',grade,rounds:5,independent:5}),0);
    p.grade=grade;assert.equal(normalizeState(state).profiles[0].grade,1);
  }
});
