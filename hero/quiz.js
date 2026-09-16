import { additionalScience, languagePractice } from './grade-banks.js';

export function shuffle(values, rng = Math.random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.max(0, Math.floor(rng() * (i + 1))));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function validateQuestion(question) {
  return !!question && typeof question.text === 'string' && question.text.trim().length > 0 &&
    Array.isArray(question.options) && question.options.length === 4 &&
    question.options.every(value => ['string', 'number'].includes(typeof value)) &&
    new Set(question.options.map(String)).size === 4 && question.options.some(value => String(value) === String(question.answer));
}

export function normalizeBank(bank) {
  if (!bank || !Array.isArray(bank.questions)) throw new Error('Question bank is unavailable');
  const corrected = bank.questions.map(question => {
    if (question.text === "Apakah imbuhan bagi perkataan 'makanan'?") return {
      ...question, text: "Bagaimanakah perkataan 'makanan' dibentuk?", options: ['makan + -an', 'mem- + akan', 'ma- + kanan', 'mak + -kan'], answer: 'makan + -an',
      explanation: "Kata dasar 'makan' menerima akhiran '-an' untuk membentuk 'makanan'.",
    };
    if (question.text === "Apakah perkataan yang sama maksud dengan 'besar'?") return {
      ...question, text: "Apakah perkataan yang berlawanan maksud dengan 'besar'?", options: ['Kecil', 'Tinggi', 'Panjang', 'Luas'], answer: 'Kecil', explanation: "'Kecil' berlawanan maksud dengan 'besar'.",
    };
    if (question.text === "Which is the present tense of 'went'?") return {
      ...question, text: "What is the base form of the verb 'went'?", answer: 'go', explanation: "'Went' is the past tense of 'go'. The base form is 'go'.",
    };
    if (question.text?.startsWith('Choose the correct article:')) return {
      ...question, text: question.text.replace('Choose the correct article:', 'Choose the correct indefinite article (a or an):'),
      explanation: question.answer === 'an' ? "Use 'an' before a vowel sound: an apple." : "Use 'a' before a consonant sound: a book, a teacher.",
    };
    return question;
  });
  // Picture-dependent legacy questions need matching illustrations before reuse.
  const usable = corrected.filter(question => !question.visual && validateQuestion(question));
  const unique = [...new Map(usable.map(question => [question.text, question])).values()];
  if (unique.length < 5) throw new Error('Not enough supported questions');
  return unique.map(question => ({ ...question, options: question.options.map(String), answer: String(question.answer) }));
}

export function questionNarration(question) {
  return [typeof question.passage === 'string' ? question.passage : '', question.text].filter(Boolean).join('\n\n');
}

function numericQuestion(text, answer, explanation, rng, visual) {
  const candidates = [answer, answer + 1, answer + 2, answer > 1 ? answer - 1 : answer + 3];
  return { text, answer: String(answer), options: shuffle(candidates.map(String), rng), explanation, visual };
}

export function createQuizQuestions(grade, rng = Math.random) {
  if (![1, 2, 3, 4, 5, 6].includes(Number(grade))) throw new Error('Unsupported grade');
  const integer = (min, max) => min + Math.min(max - min, Math.max(0, Math.floor(rng() * (max - min + 1))));
  const questions = [];
  if (Number(grade) === 1) {
    const a = integer(2, 10), b = integer(1, 20 - a);
    questions.push(numericQuestion(`${a} + ${b} = ?`, a + b, `Start at ${a} and count on ${b}. ${a} + ${b} = ${a + b}.`, rng, { kind: 'dots', a, b }));
    const whole = integer(6, 20), take = integer(1, whole - 1);
    questions.push(numericQuestion(`${whole} − ${take} = ?`, whole - take, `Take ${take} away from ${whole}. There are ${whole - take} left.`, rng, { kind: 'subtract', a: whole, b: take }));
    const tens = integer(2, 8), units = integer(1, 9), number = tens * 10 + units;
    questions.push(numericQuestion(`What is the value of the tens digit in ${number}?`, tens * 10, `${number} has ${tens} tens and ${units} ones. ${tens} tens = ${tens * 10}.`, rng));
    const base = integer(10, 80), numbers = [base, base + 2, base + 5, base + 9];
    questions.push({ text: 'Which number is greatest?', answer: String(base + 9), options: shuffle(numbers.map(String), rng), explanation: `${base + 9} is greater than ${numbers.slice(0, 3).join(', ')}. Compare tens first, then ones.` });
    const start = integer(10, 95);
    questions.push(numericQuestion(`What number comes just after ${start}?`, start + 1, `Count forward one: ${start}, ${start + 1}.`, rng));
  } else if (Number(grade) === 2) {
    const a = integer(20, 59), b = integer(10, 40);
    questions.push(numericQuestion(`${a} + ${b} = ?`, a + b, `Add tens and ones: ${a} + ${b} = ${a + b}.`, rng));
    const whole = integer(50, 100), part = integer(10, 49);
    questions.push(numericQuestion(`${whole} − ${part} = ?`, whole - part, `Check by adding back: ${whole - part} + ${part} = ${whole}.`, rng));
    const groups = integer(2, 5), each = integer(2, 10);
    questions.push(numericQuestion(`${groups} × ${each} = ?`, groups * each, `${groups} equal groups of ${each} give ${groups * each}.`, rng, { kind: 'groups', a: groups, b: each }));
    questions.push(numericQuestion(`${groups * each} ÷ ${groups} = ?`, each, `Share ${groups * each} equally among ${groups} groups: ${each} in each.`, rng));
    const cost = integer(11, 39);
    questions.push(numericQuestion(`You pay RM50 for a RM${cost} toy. How many ringgit change?`, 50 - cost, `Change = amount paid minus price: 50 − ${cost} = ${50 - cost}.`, rng));
  } else if (Number(grade) >= 4) {
    const level = Number(grade);
    const fractions = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]];
    const [numerator, denominator] = fractions[integer(0, fractions.length - 1)];
    const factor = integer(2, 5), answer = `${numerator}/${denominator}`;
    const distractors = shuffle(fractions.map(([a, b]) => `${a}/${b}`).filter(value => value !== answer), rng).slice(0, 3);
    questions.push({ text: `What is ${numerator * factor}/${denominator * factor} in simplest form?`, answer, options: shuffle([answer, ...distractors], rng), explanation: `Divide numerator and denominator by ${factor}: ${numerator * factor}/${denominator * factor} = ${answer}.` });
    const tenths = integer(11, 59), add = integer(11, 39), result = ((tenths + add) / 10).toFixed(1);
    questions.push({ text: `${(tenths / 10).toFixed(1)} + ${(add / 10).toFixed(1)} = ?`, answer: result, options: shuffle([result, ((tenths + add + 1) / 10).toFixed(1), ((tenths + add - 1) / 10).toFixed(1), ((tenths + add + 10) / 10).toFixed(1)], rng), explanation: `Add ${tenths} tenths and ${add} tenths to get ${tenths + add} tenths, or ${result}.` });
    if (level === 4) {
      const amount = integer(2, 9), cm = integer(10, 90);
      questions.push(numericQuestion(`${amount} m ${cm} cm is how many centimetres?`, amount * 100 + cm, `1 m = 100 cm. ${amount} × 100 + ${cm} = ${amount * 100 + cm} cm.`, rng));
      const whole = integer(1000, 4999), part = integer(100, 999);
      questions.push(numericQuestion(`${whole} − ${part} = ?`, whole - part, `Check the subtraction: ${whole - part} + ${part} = ${whole}.`, rng));
      questions.push(numericQuestion(`A square has sides of ${amount} cm. What is its perimeter in cm?`, amount * 4, `A square has four equal sides. 4 × ${amount} = ${amount * 4} cm.`, rng));
    } else {
      const percent = integer(1, 9) * 10, amount = integer(2, 9) * 100;
      questions.push(numericQuestion(`What is ${percent}% of ${amount}?`, percent * amount / 100, `Percent means per hundred. ${percent}/100 × ${amount} = ${percent * amount / 100}.`, rng));
      if (level === 5) {
        const discount = integer(1, 5) * 10;
        questions.push(numericQuestion(`A RM100 bag has a ${discount}% discount. What is the sale price in ringgit?`, 100 - discount, `${discount}% of RM100 is RM${discount}. Subtract the discount: RM100 − RM${discount} = RM${100 - discount}.`, rng));
        const length = integer(3, 12), width = integer(2, 8);
        questions.push(numericQuestion(`A rectangle is ${length} cm long and ${width} cm wide. What is its area in square centimetres?`, length * width, `Area = length × width = ${length} × ${width} = ${length * width} square centimetres.`, rng));
      } else {
        const left = integer(2, 5), right = integer(2, 7), factor = integer(2, 9);
        questions.push(numericQuestion(`Red : blue beads = ${left} : ${right}. There are ${left * factor} red beads. How many blue beads?`, right * factor, `Each ratio part is worth ${left * factor} ÷ ${left} = ${factor}. Blue beads = ${right} × ${factor} = ${right * factor}.`, rng));
        const distance = integer(3, 10) * 20, hours = 2;
        questions.push(numericQuestion(`A van travels ${distance} km in ${hours} hours. What is its average speed in km/h?`, distance / hours, `Average speed = distance ÷ time = ${distance} ÷ ${hours} = ${distance / hours} km/h.`, rng));
      }
    }
  } else {
    const a = integer(2, 10), b = integer(2, 10);
    questions.push(numericQuestion(`${a} × ${b} = ?`, a * b, `${a} groups of ${b}: ${Array(a).fill(b).join(' + ')} = ${a * b}.`, rng, { kind: 'groups', a, b }));
    const divisor = integer(2, 10), quotient = integer(2, 10);
    questions.push(numericQuestion(`${divisor * quotient} ÷ ${divisor} = ?`, quotient, `${divisor * quotient} shared equally into ${divisor} groups gives ${quotient} in each group. ${divisor} × ${quotient} = ${divisor * quotient}.`, rng));
    const first = integer(120, 499), second = integer(100, 499);
    questions.push(numericQuestion(`${first} + ${second} = ?`, first + second, `Add hundreds, tens and ones, regrouping when needed. ${first} + ${second} = ${first + second}.`, rng));
    const whole = integer(400, 999), part = integer(100, 399);
    questions.push(numericQuestion(`${whole} − ${part} = ?`, whole - part, `Subtract ${part} from ${whole}. Check by adding back: ${whole - part} + ${part} = ${whole}.`, rng));
    const price = integer(3, 18), extra = integer(2, 12);
    questions.push(numericQuestion(`A book costs RM${price} and a pen costs RM${extra}. How many ringgit altogether?`, price + extra, `Add both prices: RM${price} + RM${extra} = RM${price + extra}.`, rng));
    const hour = integer(1, 9), duration = integer(1, 2);
    questions.push(numericQuestion(`A lesson starts at ${hour}:00 a.m. and lasts ${duration} ${duration === 1 ? 'hour' : 'hours'}. At what hour does it finish (a.m.)?`, hour + duration, `Move forward ${duration} ${duration === 1 ? 'hour' : 'hours'} from ${hour}:00. It finishes at ${hour + duration}:00 a.m.`, rng));
  }
  return shuffle(questions, rng).slice(0, 5);
}

// Original English practice content. These are not formal DSKP mastery assessments.
const science = {
  1: [
    ['Which body part helps you see?', 'Eyes', 'Ears|Nose|Tongue', 'We use our eyes to see shapes, colours and movement.'],
    ['Which body part helps you hear?', 'Ears', 'Eyes|Fingers|Teeth', 'Our ears help us hear sounds.'],
    ['Which body part helps you smell?', 'Nose', 'Eyes|Knees|Ears', 'Our nose detects smells.'],
    ['Which body part helps you taste?', 'Tongue', 'Elbow|Hair|Ears', 'The tongue helps us taste food.'],
    ['What covers your body and helps you feel touch?', 'Skin', 'Hair only|Teeth|Nails only', 'Skin contains receptors that help us sense touch.'],
    ['Which is a living thing?', 'A cat', 'A stone|A spoon|A chair', 'A cat grows and needs food, water and air.'],
    ['Which is a non-living thing?', 'A pencil', 'A tree|A bird|A butterfly', 'A pencil does not grow or need food, water and air.'],
    ['Which do humans need to breathe?', 'Air', 'Sand|Paper|Oil', 'Humans breathe air.'],
    ['What should you drink when thirsty?', 'Clean water', 'Paint|Sea water|Cooking oil', 'Clean drinking water helps replace water your body needs.'],
    ['Which part of a plant usually takes in water from soil?', 'Roots', 'Flowers|Fruits|Seeds', 'Roots take in water from the soil.'],
    ['Which plant part supports leaves and flowers?', 'Stem', 'Fruit|Seed|Petal', 'The stem supports the plant and carries water.'],
    ['Which plant part is often green?', 'Leaf', 'Stone|Flowerpot|Soil', 'Many leaves are green. Leaves help plants make food.'],
    ['Which animal has feathers?', 'A bird', 'A cat|A fish|A snail', 'Birds have feathers covering their bodies.'],
    ['Which animal has fins?', 'A fish', 'A rabbit|A chicken|A butterfly', 'Fish use fins to help them move and balance in water.'],
    ['Which animal has a hard shell?', 'A snail', 'A cat|A bird|A worm', 'A snail has a shell that protects its soft body.'],
    ['What should you do before eating?', 'Wash your hands', 'Touch rubbish|Skip washing|Put soil on your hands', 'Washing hands with soap and water removes dirt and germs.'],
    ['Which tool helps you see a small leaf more closely?', 'Magnifying glass', 'Spoon|Clock|Cup', 'A magnifying glass makes details look larger.'],
    ['Which tool measures length?', 'Ruler', 'Cup|Bell|Paintbrush', 'A ruler has marked units for measuring length.'],
    ['What should you do with an unknown liquid in a science activity?', 'Ask the teacher', 'Taste it|Drink it|Rub it on your eyes', 'Ask the teacher. Unknown liquids must not be tasted or touched without instructions.'],
    ['Which object can float on water?', 'A dry cork', 'A steel key|A stone|A glass marble', 'A dry cork floats on water; the other listed objects sink.'],
  ],
  3: [
    ['Which kind of teeth is used mainly for cutting food?', 'Incisors', 'Molars|Canines|Gums', 'Incisors are the front teeth used to cut food.'],
    ['Which kind of teeth is used mainly for grinding food?', 'Molars', 'Incisors|Canines|Lips', 'Molars have broad surfaces that grind food.'],
    ['Which kind of teeth helps tear food?', 'Canines', 'Molars|Incisors|Gums', 'Canines have pointed shapes that help tear food.'],
    ['Where does digestion begin?', 'Mouth', 'Lungs|Heart|Kidneys', 'Chewing breaks food into smaller pieces, and saliva begins digestion in the mouth.'],
    ['Which organ churns food during digestion?', 'Stomach', 'Heart|Lungs|Brain', 'The stomach mixes and churns food with digestive juices.'],
    ['Which habit helps protect your teeth?', 'Brush regularly', 'Never brush|Eat sweets all day|Use teeth to open bottles', 'Brushing removes food and plaque from teeth.'],
    ['Which animal eats mainly plants?', 'Cow', 'Tiger|Lion|Eagle', 'A cow is a herbivore: it eats plant material such as grass.'],
    ['Which animal eats other animals?', 'Tiger', 'Cow|Goat|Rabbit', 'A tiger is a carnivore: it eats other animals.'],
    ['Which animal eats both plants and animals?', 'Chicken', 'Cow|Tiger|Goat', 'Chickens eat plant foods such as seeds and animal foods such as insects.'],
    ['Which part of a plant carries water from its roots?', 'Stem', 'Petal|Fruit|Seed coat', 'Water moves from the roots through the stem to other parts of the plant.'],
    ['What do most green plants use as a source of energy to make food?', 'Sunlight', 'Plastic|Sand|Sound', 'Green plants use light energy to make food.'],
    ['Which material is attracted to a magnet?', 'Iron nail', 'Wooden stick|Plastic spoon|Rubber band', 'Iron is a magnetic material. Wood, plastic and rubber are not attracted like iron.'],
    ['What happens when two north poles of magnets are brought close?', 'They repel', 'They attract|They melt|They disappear', 'Like magnetic poles repel each other.'],
    ['What happens when a north pole meets a south pole?', 'They attract', 'They repel|They turn to wood|They lose their shape', 'Unlike magnetic poles attract each other.'],
    ['Where is a bar magnet strongest?', 'At its poles', 'Only in its centre|Everywhere except the poles|Only in the air far away', 'A bar magnet exerts its strongest attraction near its poles.'],
    ['Which material absorbs water well?', 'Cotton towel', 'Plastic sheet|Metal spoon|Glass cup', 'A cotton towel absorbs water into spaces between its fibres.'],
    ['Which material is suitable for a waterproof raincoat?', 'Waterproof plastic', 'Tissue paper|Cotton wool|Paper towel', 'Waterproof plastic does not readily let rain pass through.'],
    ['Which unit is suitable for the length of a pencil?', 'Centimetres', 'Litres|Kilograms|Hours', 'Centimetres measure length. A pencil is commonly measured in centimetres.'],
    ['Which tool measures the mass of an object?', 'Balance', 'Ruler|Clock|Measuring jug', 'A balance is used to measure mass.'],
    ['Which unit is suitable for water in a drinking bottle?', 'Millilitres', 'Centimetres|Grams per second|Hours', 'Millilitres measure volume, including the volume of water in a bottle.'],
  ],
};

export function createScienceQuestions(grade, rng = Math.random, count = 5) {
  const bank = science[grade] || additionalScience[grade];
  if (!bank) throw new Error('Unsupported grade');
  return shuffle(bank, rng).slice(0, count).map(([text, answer, distractors, explanation]) => ({ text, answer, options: shuffle([answer, ...distractors.split('|')], rng), explanation }));
}

export function createLanguageQuestions(grade, subject, rng = Math.random, count = 5) {
  const bank = languagePractice[grade]?.[subject];
  if (!bank) throw new Error('Unsupported original language bank');
  return shuffle(bank, rng).slice(0, count).map(([text, answer, distractors, explanation]) => ({ text, answer, options: shuffle([answer, ...distractors.split('|')], rng), explanation }));
}

export function questionKey(question) {
  return JSON.stringify([question.passage || '', question.text, String(question.answer)]);
}

// Unseen questions first; once a finite bank runs out, revisit the oldest ones.
export function selectFreshQuestions(pool, recent = [], count = 5) {
  const unique = [...new Map(pool.map(question => [questionKey(question), question])).values()];
  const age = new Map(recent.map((key, index) => [key, index]));
  return unique.sort((a, b) => (age.get(questionKey(a)) ?? -1) - (age.get(questionKey(b)) ?? -1)).slice(0, count);
}

const recentQuestions = new Map();
function readRecent(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) return saved.filter(value => typeof value === 'string').slice(-150);
  } catch { /* Private browsing can block storage. Keep this visit playable. */ }
  return recentQuestions.get(key) || [];
}

function rememberQuestions(key, recent, questions) {
  const added = questions.map(questionKey);
  const next = [...recent.filter(item => !added.includes(item)), ...added].slice(-150);
  recentQuestions.set(key, next);
  try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* The in-memory history still works. */ }
}

function node(tag, className, text) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (text !== undefined) result.textContent = text;
  return result;
}

export function startQuiz(container, { grade, subject, onComplete, onExit, speak }) {
  if (![1, 2, 3, 4, 5, 6].includes(Number(grade)) || !['math', 'sains', 'bm', 'bi'].includes(subject)) throw new Error('Unsupported quiz');
  const root = node('section', 'mh-quiz');
  container.replaceChildren(root);
  let questions = [], index = 0, independent = 0, hints = 0, tried = false, solved = false, disposed = false, completed = false;
  let rejected = new Set(), reviewingClue = false;
  const controller = new AbortController();
  const names = { math: 'Maths workshop', sains: 'Science explorer', bm: 'Bahasa Melayu', bi: 'English explorer' };
  function button(text, action, key = text, className = '') {
    const result = node('button', `mh-quiz-button ${className}`, text);
    result.type = 'button'; result.dataset.action = key;
    result.addEventListener('click', () => { if (!disposed && !completed) action(); });
    return result;
  }
  function render(message = '') {
    const focus = root.contains(document.activeElement) ? document.activeElement.dataset.action : null;
    const question = questions[index];
    root.replaceChildren();
    const top = node('div', 'mh-quiz-top');
    top.append(node('span', 'mh-quiz-eyebrow', `QUESTION ${index + 1} OF 5`), button('Back to island', () => onExit?.()));
    const progress = node('progress', 'mh-quiz-progress');
    progress.max = 5; progress.value = index + (solved ? 1 : 0); progress.setAttribute('aria-label', 'Questions completed');
    root.append(top, node('h2', '', names[subject]), node('p', 'mh-quiz-reward', '4 coins for each first-try answer · 1 with help · +5 for finishing'), progress);
    if (typeof question.passage === 'string' && question.passage.trim()) {
      const passage = node('aside', 'mh-quiz-feedback');
      passage.setAttribute('aria-label', subject === 'bm' ? 'Petikan bacaan' : 'Reading passage');
      passage.append(node('strong', '', subject === 'bm' ? 'Baca petikan ini' : 'Read this passage'), node('p', '', question.passage));
      root.append(passage);
    }
    const heading = node('h3', 'mh-quiz-question', question.text);
    root.append(heading);
    if (question.visual && ['dots', 'subtract', 'groups'].includes(question.visual.kind)) {
      const picture = node('div', 'mh-quiz-picture');
      picture.setAttribute('aria-hidden', 'true');
      const { kind, a, b } = question.visual;
      const groups = kind === 'groups' ? Array(a).fill(b) : kind === 'dots' ? [a, b] : [a];
      groups.forEach((count, groupIndex) => {
        const group = node('span', 'mh-quiz-dotgroup');
        for (let i = 0; i < count; i++) group.append(node('i', `mh-quiz-dot ${kind === 'subtract' && i >= a - b ? 'mh-quiz-crossed' : ''}`));
        picture.append(group);
        if (kind === 'dots' && groupIndex === 0) picture.append(node('span', 'mh-quiz-plus', '+'));
      });
      root.append(picture);
    }
    root.append(button(question.passage ? 'Hear passage and question' : 'Hear the question', () => speak?.(questionNarration(question)), 'hear'));
    const choices = node('div', 'mh-quiz-choices');
    question.options.forEach((option, i) => {
      const correct = String(option) === String(question.answer);
      const choice = button(String(option), () => {
        if (correct) { if (!tried) independent++; solved = true; render('Well done. You found the answer!'); }
        else { if (!tried) hints++; tried = true; reviewingClue = true; rejected.add(i); render(question.explanation || `Read it again: ${question.text} The correct answer is “${question.answer}”. Select it to practise.`); }
      }, `choice-${i}`, `${solved && correct ? 'mh-quiz-correct' : ''} ${rejected.has(i) ? 'mh-quiz-rejected' : ''}`);
      choice.disabled = solved || reviewingClue || rejected.has(i);
      choices.append(choice);
    });
    root.append(choices);
    const feedback = node('p', 'mh-quiz-feedback', message || 'Take your time. Choose the answer you think fits.');
    feedback.setAttribute('role', 'status'); root.append(feedback);
    if (reviewingClue) root.append(button('Try with this clue', () => {
      reviewingClue = false;
      render(question.explanation || `Read it again: ${question.text} The answer is “${question.answer}”. Choose it to practise.`);
    }, 'review-clue', 'mh-quiz-next'));
    if (solved) {
      if (question.explanation) root.append(node('p', 'mh-quiz-explanation', question.explanation));
      root.append(button(index === 4 ? 'Finish and collect coins' : 'Next question →', () => {
        if (index === 4) { completed = true; onComplete?.({ type: 'quiz', subject, grade: Number(grade), rounds: 5, independent, hints, correct: independent }); }
        else { index++; tried = false; solved = false; reviewingClue = false; rejected = new Set(); render(); }
      }, 'next', 'mh-quiz-next'));
    }
    if (focus) {
      const buttons = [...root.querySelectorAll('button')];
      const target = buttons.find(item => item.dataset.action === focus && !item.disabled) || buttons.find(item => item.dataset.action === 'review-clue') || buttons.find(item => item.dataset.action === 'next') || buttons.find(item => item.dataset.action.startsWith('choice-') && !item.disabled);
      target?.focus({ preventScroll: true });
    }
  }
  async function load() {
    root.replaceChildren(node('p', 'mh-quiz-feedback', 'Preparing your questions…'), button('Back to island', () => onExit?.()));
    try {
      const historyKey = `hero-islands-quiz-recent-${grade}-${subject}`;
      const recent = readRecent(historyKey);
      if (subject === 'math') {
        questions = createQuizQuestions(Number(grade));
        for (let attempt = 0; attempt < 8 && questions.some(question => recent.includes(questionKey(question))); attempt++) {
          questions = selectFreshQuestions([...questions, ...createQuizQuestions(Number(grade))], recent);
        }
      }
      else if (subject === 'sains') questions = selectFreshQuestions(createScienceQuestions(Number(grade), Math.random, Infinity), recent);
      else if (languagePractice[grade]?.[subject]) questions = selectFreshQuestions(createLanguageQuestions(Number(grade), subject, Math.random, Infinity), recent);
      else {
        const response = await fetch(`./data/d${Number(grade)}-${subject}.json`, { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to load questions');
        const bank = await response.json();
        if (Number(bank.grade) !== Number(grade) || bank.subject !== subject) throw new Error('Question bank does not match');
        questions = selectFreshQuestions(shuffle(normalizeBank(bank)), recent).map(question => ({ ...question, options: shuffle(question.options) }));
      }
      if (!disposed) { rememberQuestions(historyKey, recent, questions); render(); }
    } catch (error) {
      if (disposed || error.name === 'AbortError') return;
      root.replaceChildren(node('h2', '', 'Could not load this quiz'), node('p', '', 'Your coins are unchanged. Try again when your connection is ready.'), button('Try again', load), button('Back to island', () => onExit?.()));
    }
  }
  load();
  return () => { disposed = true; controller.abort(); root.remove(); };
}
