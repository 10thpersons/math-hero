import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createQuizQuestions, createScienceQuestions, createLanguageQuestions, validateQuestion } from '../hero/quiz.js';
import { additionalScience, languagePractice } from '../hero/grade-banks.js';

function expected(q) {
  let m;
  if ((m = q.text.match(/^([\d.]+) ([+−×÷]) ([\d.]+) = \?$/))) {
    const a = Number(m[1]), b = Number(m[3]);
    return { '+': a + b, '−': a - b, '×': a * b, '÷': a / b }[m[2]];
  }
  if ((m = q.text.match(/pay RM50 for a RM(\d+)/))) return 50 - Number(m[1]);
  if ((m = q.text.match(/^What is (\d+)\/(\d+) in simplest form/))) {
    const [a, b] = q.answer.split('/').map(Number);
    assert.equal(a * Number(m[2]), b * Number(m[1]));
    assert.equal(a, 1); assert.equal(b, 2);
    return q.answer;
  }
  if ((m = q.text.match(/^(\d+) m (\d+) cm/))) return Number(m[1]) * 100 + Number(m[2]);
  if ((m = q.text.match(/square has sides of (\d+)/))) return Number(m[1]) * 4;
  if ((m = q.text.match(/^What is (\d+)% of (\d+)/))) return Number(m[1]) * Number(m[2]) / 100;
  if ((m = q.text.match(/RM100 bag has a (\d+)%/))) return 100 * (1 - Number(m[1]) / 100);
  if ((m = q.text.match(/rectangle is (\d+) cm long and (\d+) cm/))) return Number(m[1]) * Number(m[2]);
  if ((m = q.text.match(/beads = (\d+) : (\d+)\. There are (\d+) red/))) return Number(m[3]) / Number(m[1]) * Number(m[2]);
  if ((m = q.text.match(/travels (\d+) km in (\d+) hours/))) return Number(m[1]) / Number(m[2]);
  assert.fail(`No independent calculation for ${q.text}`);
}

test('new grade maths answers remain correct across boundaries and seeded samples', () => {
  for (const grade of [2, 4, 5, 6]) {
    for (let seed = 0; seed < 150; seed++) {
      let state = seed;
      const rng = seed === 0 ? () => 0 : seed === 1 ? () => 0.999999 : () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
      const questions = createQuizQuestions(grade, rng);
      assert.equal(questions.length, 5);
      assert.equal(new Set(questions.map(q => q.text)).size, 5);
      for (const q of questions) {
        assert.ok(validateQuestion(q), q.text);
        const answer = expected(q);
        if (q.answer.includes('/')) assert.equal(q.answer, answer);
        else assert.ok(Math.abs(Number(q.answer) - answer) < 1e-9, q.text);
        assert.ok(q.explanation.length > 15);
      }
    }
  }
});

test('all added science and language content has unique choices and explanatory feedback', () => {
  for (const grade of [2, 4, 5, 6]) {
    assert.ok(additionalScience[grade].length >= 15);
    const banks = [additionalScience[grade], languagePractice[grade].bm, languagePractice[grade].bi];
    for (const bank of banks) {
      assert.equal(new Set(bank.map(q => q[0])).size, bank.length);
      for (const [text, answer, distractors, explanation] of bank) {
        assert.ok(validateQuestion({ text, answer, options: [answer, ...distractors.split('|')] }), text);
        assert.ok(explanation.length > 15, text);
      }
    }
    for (const questions of [createScienceQuestions(grade), createLanguageQuestions(grade, 'bm'), createLanguageQuestions(grade, 'bi')]) {
      assert.equal(questions.length, 5);
      assert.equal(new Set(questions.map(q => q.text)).size, 5);
    }
  }
  assert.throws(() => createLanguageQuestions(7, 'bm'));
});
