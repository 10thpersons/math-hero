import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProblems, checkAnswer } from '../hero/missions.js';

function solve(problem) {
  if (problem.ratio) {
    const [short, long] = problem.ratio;
    const repeats = problem.target / (short + 2 * long);
    return [...Array(short * repeats).fill(1), ...Array(long * repeats).fill(2)];
  }
  let remaining = problem.target;
  const pieces = [];
  for (const value of [...(problem.lengths || problem.denominations || [1, 5, 10, 20])].sort((a,b) => b-a)) {
    while (remaining >= value) { pieces.push(value); remaining -= value; }
  }
  assert.equal(remaining, 0, 'The visual pieces can make the exact target');
  return pieces;
}

test('all six grades have three distinct, solvable missions needing at most 20 pieces', () => {
  for (let grade = 1; grade <= 6; grade++) for (const type of ['bridge', 'market']) {
    for (const seed of [0, .15, .3, .5, .7, .85, .99]) {
      const problems = createProblems(type, grade, () => seed);
      assert.equal(problems.length, 3);
      assert.equal(new Set(problems.map(problem => JSON.stringify(problem))).size, 3);
      for (const problem of problems) {
        assert.ok(Number.isSafeInteger(problem.target) && problem.target > 0);
        const pieces = solve(problem);
        assert.ok(pieces.length <= 20);
        assert.equal(checkAnswer(problem, pieces), true);
        assert.equal(checkAnswer(problem, pieces.slice(1)), false);
        assert.equal(checkAnswer(problem, [...pieces, -1, 1]), false);
        assert.equal(checkAnswer(problem, ['1']), false);
      }
    }
  }
});

test('D4 requires metric conversion and calculates change from the tender', () => {
  for (const problem of createProblems('bridge', 4, () => .2)) {
    const centimetres = Number(problem.prompt.match(/bridge (\d+) cm/)[1]);
    assert.equal(problem.target, centimetres * 10);
    assert.equal(problem.unit, 'mm');
  }
  for (const problem of createProblems('market', 4, () => .2)) {
    assert.equal(problem.target, problem.tender - problem.quantity * problem.price);
    assert.notEqual(problem.target, problem.quantity * problem.price);
  }
});

test('D5 represents fractions and decimal money with exact integer arithmetic', () => {
  for (const problem of createProblems('bridge', 5, () => 0)) {
    assert.equal(problem.scale, 4);
    assert.deepEqual(problem.lengths, [1, 2, 3, 4]);
    assert.match(problem.prompt, /[¼½¾]/);
  }
  for (const problem of createProblems('market', 5, () => .6)) {
    assert.equal(problem.moneyScale, 100);
    assert.equal(problem.target, problem.quantity * problem.price);
    assert.match(problem.prompt, /RM\d+\.\d{2}/);
    assert.equal(problem.denominations.every(n => Number.isInteger(n) && n >= 5), true);
  }
});

test('D6 requires the correct ratio even when the bridge length fits', () => {
  for (const problem of createProblems('bridge', 6, () => .5)) {
    assert.equal(checkAnswer(problem, Array(problem.target).fill(1)), false);
    assert.equal(checkAnswer(problem, solve(problem)), true);
  }
  for (const problem of createProblems('market', 6, () => .5)) {
    const original = problem.quantity * problem.price;
    assert.equal(problem.target, original - original * problem.discount / 100);
    assert.ok(problem.target < original);
  }
});

test('invalid grades and mission types are rejected instead of silently falling back', () => {
  for (const grade of [0, 7, 2.5, 'nonsense', NaN]) assert.throws(() => createProblems('bridge', grade));
  assert.throws(() => createProblems('bogus', 5));
});
