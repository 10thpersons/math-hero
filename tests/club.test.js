import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeClub, normalizeArcade, recordArcade, recordLearning, clubProgress } from '../hero/club.js';

const makeState = () => ({ profiles: [{ id: 'one', coins: 25, sessions: [] }, { id: 'two', coins: 40, sessions: [] }] });

test('club and arcade normalize missing, invalid and oversized saved values', () => {
  for (const raw of [undefined, null, {}, { learning: -1, play: '4' }, { learning: 1.5, play: Infinity }]) {
    assert.deepEqual(normalizeClub(raw), { learning: 0, play: 0 });
  }
  assert.deepEqual(normalizeClub({ learning: 90, play: 99 }), { learning: 6, play: 4 });
  assert.deepEqual(normalizeArcade({ boat: { best: -1, plays: NaN }, pet: { best: '9', plays: 1.5 } }), {
    boat: { best: 0, plays: 0 }, pet: { best: 0, plays: 0 },
  });
  assert.deepEqual(normalizeArcade({ boat: { best: 2000, plays: 9 } }).boat, { best: 1000, plays: 9 });
  assert.deepEqual(normalizeArcade(null), normalizeArcade());
});

test('arcade personal bests never decrease and siblings have separate records', () => {
  const state = makeState();
  assert.equal(recordArcade(state, 'one', { type: 'boat', score: 500 }), true);
  recordArcade(state, 'one', { type: 'boat', score: 100 });
  recordArcade(state, 'one', { type: 'pet', score: 800 });
  recordArcade(state, 'two', { type: 'boat', score: 0 });
  assert.deepEqual(state.profiles[0].arcade, { boat: { best: 500, plays: 2 }, pet: { best: 800, plays: 1 } });
  assert.deepEqual(state.profiles[1].arcade.boat, { best: 0, plays: 1 });
  assert.equal(state.familyClub.play, 4);
  assert.deepEqual(state.profiles.map(p => [p.coins, p.sessions]), [[25, []], [40, []]]);
});

test('invalid arcade results and unknown profiles do not mutate saves', () => {
  const state = makeState(), before = structuredClone(state);
  for (const result of [undefined, null, {}, { type: '__proto__', score: 4 }, { type: 'boat', score: -1 }, { type: 'pet', score: 1001 }, { type: 'pet', score: 2.5 }, { type: 'pet', score: '2' }, { type: 'pet', score: NaN }]) {
    assert.equal(recordArcade(state, 'one', result), false);
  }
  assert.equal(recordArcade(state, 'missing', { type: 'boat', score: 1 }), false);
  assert.equal(recordLearning(state, 'missing'), false);
  assert.deepEqual(state, before);
});

test('one explorer can restore the lighthouse, both contribution targets are required and stay capped', () => {
  const state = makeState();
  assert.deepEqual(clubProgress(state), { learning: 0, play: 0, restored: false });
  for (let i = 0; i < 10; i++) assert.equal(recordLearning(state, 'one'), true);
  assert.deepEqual(clubProgress(state), { learning: 6, play: 0, restored: false });
  for (let i = 0; i < 3; i++) recordArcade(state, 'one', { type: 'boat', score: 10 });
  assert.equal(clubProgress(state).restored, false);
  for (let i = 0; i < 10; i++) recordArcade(state, 'one', { type: 'pet', score: 1000 });
  assert.deepEqual(clubProgress(state), { learning: 6, play: 4, restored: true });
  const reloaded = JSON.parse(JSON.stringify(state));
  assert.deepEqual(clubProgress(reloaded), clubProgress(state));
  assert.deepEqual(state.profiles.map(p => [p.coins, p.sessions]), [[25, []], [40, []]]);
});
