import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createQuizQuestions, createScienceQuestions, normalizeBank, validateQuestion, questionNarration } from '../hero/quiz.js';

function seeded(seed) {
  let state = seed;
  return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
}
function checkRun(questions) {
  assert.equal(questions.length, 5);
  assert.equal(new Set(questions.map(q => q.text)).size, 5);
  for (const q of questions) {
    assert.ok(validateQuestion(q), q.text);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(String)).size, 4);
    assert.equal(q.options.filter(v => String(v) === String(q.answer)).length, 1);
  }
}
function expectedMath(text) {
  let m = text.match(/^(\d+) ([+−×÷]) (\d+) = \?$/);
  if (m) {
    const a = Number(m[1]), b = Number(m[3]);
    return { '+': () => a + b, '−': () => a - b, '×': () => a * b, '÷': () => a / b }[m[2]]();
  }
  if ((m = text.match(/^What is the value of the tens digit in (\d+)\?$/))) return Math.floor(Number(m[1]) / 10) * 10;
  if ((m = text.match(/^What number comes just after (\d+)\?$/))) return Number(m[1]) + 1;
  if ((m = text.match(/^A book costs RM(\d+) and a pen costs RM(\d+)/))) return Number(m[1]) + Number(m[2]);
  if ((m = text.match(/^A lesson starts at (\d+):00 a\.m\. and lasts (\d+) /))) {
    const end = Number(m[1]) + Number(m[2]);
    assert.ok(end < 12, 'The a.m. label must remain correct');
    return end;
  }
  assert.fail(`Unverified mathematics question: ${text}`);
}

test('generated maths answers are independently calculated across seeds and boundary values', () => {
  const seen = new Set();
  let repeatedDigit = false;
  for (const grade of [1, 3]) {
    const generators = [() => 0, () => 0.999999, ...Array.from({ length: 150 }, (_, i) => seeded(i + 1))];
    for (const rng of generators) {
      const questions = createQuizQuestions(grade, rng);
      checkRun(questions);
      for (const q of questions) {
        const expected = q.text === 'Which number is greatest?' ? Math.max(...q.options.map(Number)) : expectedMath(q.text);
        assert.equal(Number(q.answer), expected, q.text);
        seen.add(q.text.startsWith('A lesson') ? 'time' : q.text.includes('tens digit') ? 'place' : q.text);
        const m = q.text.match(/tens digit in (\d)(\d)/);
        if (m && m[1] === m[2]) repeatedDigit = true;
      }
    }
  }
  assert.ok(seen.has('time'));
  assert.ok(seen.has('place'));
  assert.ok(repeatedDigit, 'Repeated digits must be tested with an explicit tens-place prompt');
});

test('science runs contain five distinct valid questions with explanations', () => {
  for (const grade of [1, 3]) {
    const seen = new Map();
    for (let seed = 1; seed <= 150; seed++) {
      const questions = createScienceQuestions(grade, seeded(seed));
      checkRun(questions);
      questions.forEach(q => { assert.ok(q.explanation?.trim()); seen.set(q.text, q.answer); });
    }
    assert.equal(seen.size, 20);
    if (grade === 1) assert.equal(seen.get('Which part of a plant usually takes in water from soil?'), 'Roots');
    else {
      assert.equal(seen.get('Where does digestion begin?'), 'Mouth');
      assert.equal(seen.get('What happens when two north poles of magnets are brought close?'), 'They repel');
      assert.equal(seen.get('What happens when a north pole meets a south pole?'), 'They attract');
    }
  }
});

test('language banks retain reading context and reject known ambiguous or incorrect prompts', () => {
  const forbidden = ["Apakah imbuhan bagi perkataan 'makanan'?", "Apakah perkataan yang sama maksud dengan 'besar'?", "Which is the present tense of 'went'?"];
  for (const grade of [1, 3]) for (const subject of ['bm', 'bi']) {
    const raw = JSON.parse(readFileSync(new URL(`../data/d${grade}-${subject}.json`, import.meta.url)));
    const before = JSON.stringify(raw);
    const bank = normalizeBank(raw);
    assert.equal(JSON.stringify(raw), before, 'Normalizing must not mutate legacy content');
    assert.ok(bank.length >= 5);
    for (const q of bank) {
      assert.ok(validateQuestion(q), q.text);
      assert.ok(!q.visual);
      assert.ok(!forbidden.includes(q.text));
      assert.ok(!q.text.startsWith('Choose the correct article:'));
      if (q.text.includes('makanan')) assert.equal(q.answer, 'makan + -an');
      if (q.text.includes("base form of the verb 'went'")) assert.equal(q.answer, 'go');
    }
    for (const source of raw.questions.filter(q => q.passage)) {
      const retained = bank.find(q => q.text === source.text);
      assert.ok(retained, 'Reading comprehension remains available');
      assert.equal(retained.passage, source.passage);
      assert.ok(questionNarration(retained).includes(source.passage));
      assert.ok(questionNarration(retained).includes(source.text));
    }
  }
});

test('question validation excludes missing answers, repeated options and unsupported banks', () => {
  assert.equal(validateQuestion({ text: 'Choose', options: ['1', 1, 2, 3], answer: 1 }), false);
  assert.equal(validateQuestion({ text: 'Choose', options: [1, 2, 3, 4], answer: 5 }), false);
  assert.equal(validateQuestion({ text: ' ', options: [1, 2, 3, 4], answer: 1 }), false);
  assert.throws(() => normalizeBank({ questions: [] }));
  assert.throws(() => createQuizQuestions(7));
  assert.throws(() => createScienceQuestions(7));
});
