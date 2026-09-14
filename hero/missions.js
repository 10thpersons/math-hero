export function createProblems(type, grade, rng = Math.random) {
  grade = Number(grade);
  if (!['bridge', 'market'].includes(type) || !Number.isInteger(grade) || grade < 1 || grade > 6) throw new Error('Unsupported mission');
  let pool;
  if (grade === 1) pool = Array.from({ length: 15 }, (_, i) => type === 'bridge'
    ? { type, target: i + 6, lengths: [1, 2, 3, 5] }
    : { type, target: i + 6, quantity: 1, price: i + 6 });
  if (grade === 2) pool = [24, 32, 45, 56, 63, 78, 85].map(target => type === 'bridge'
    ? { type, target, lengths: [1, 5, 10, 20], skill: 'Add tens and ones' }
    : { type, target, quantity: 1, price: target, denominations: [1, 5, 10, 20, 50], skill: 'Combine ringgit notes' });
  if (grade === 3) pool = [[2, 4], [3, 3], [3, 4], [4, 4], [4, 5], [5, 5], [5, 6]].map(([a, b]) => type === 'bridge'
    ? { type, target: a * b, lengths: [a], length: a, groups: b }
    : { type, target: a * b, quantity: a, price: b });
  if (grade === 4) pool = type === 'bridge'
    ? [12, 15, 18, 22, 25, 28, 32].map(cm => ({ type, target: cm * 10, targetCm: cm, lengths: [10, 20, 50, 100], unit: 'mm', gridStep: 10, skill: 'Convert centimetres to millimetres',
      prompt: `Build a model bridge ${cm} cm long. Your planks are marked in millimetres. Convert the length, then build it exactly.`,
      hint: `1 cm = 10 mm. Multiply ${cm} by 10 to find the crossing in millimetres.` }))
    : [[3, 7, 50], [4, 8, 50], [3, 12, 50], [4, 15, 100], [3, 18, 100], [5, 13, 100]].map(([quantity, price, tender]) => ({type, quantity, price, tender, target: tender - quantity * price, denominations: [1, 5, 10, 20, 50], skill: 'Calculate change',
      prompt: `You are the shopkeeper! ${quantity} baskets cost RM${price} each. Your customer gives RM${tender}. Put the exact change in the tray.`,
      hint: `First find ${quantity} × RM${price}. Subtract that cost from RM${tender} to find the change.` }));
  if (grade === 5) pool = type === 'bridge'
    ? [6, 7, 9, 10, 11, 13, 14].map(target => ({ type, target, lengths: [1, 2, 3, 4], unit: 'm', scale: 4, skill: 'Combine fractional lengths',
      prompt: `Build a bridge exactly ${fraction(target)} m long using quarter, half and whole metre planks.`,
      hint: 'Each grid space is ¼ metre. Two quarters make ½ metre; four quarters make 1 metre.' }))
    : [[2, 125], [3, 250], [4, 175], [3, 325], [2, 475], [4, 225]].map(([quantity, price]) => ({ type, quantity, price, target: quantity * price, moneyScale: 100, denominations: [5, 10, 20, 50, 100, 500, 1000], skill: 'Multiply decimal prices',
      prompt: `Buy ${quantity} baskets at RM${(price / 100).toFixed(2)} each. Work out the total, then use notes and coins to pay exactly.`,
      hint: `Multiply RM${(price / 100).toFixed(2)} by ${quantity}. Remember: 100 sen = RM1.00.` }));
  if (grade === 6) pool = type === 'bridge'
    ? [[1, 1, 3], [2, 1, 2], [1, 2, 2], [2, 3, 2], [3, 2, 2], [3, 1, 3]].map(([short, long, repeats]) => ({ type, target: (short + long * 2) * repeats, lengths: [1, 2], ratio: [short, long], skill: 'Build to a ratio',
      prompt: `Build a ${ (short + long * 2) * repeats } unit bridge. Use short (1 unit) and long (2 unit) planks in the ratio ${short}:${long}. Both the length AND the ratio must match.`,
      hint: `One ratio group uses ${short} short and ${long} long planks. That covers ${short + long * 2} units. Repeat the group until the bridge fits.` }))
    : [[2, 20, 10], [3, 20, 25], [4, 15, 20], [2, 40, 25], [3, 30, 10], [4, 25, 30]].map(([quantity, price, discount]) => ({ type, quantity, price, discount, target: quantity * price * (100 - discount) / 100, denominations: [1, 5, 10, 20, 50], skill: 'Calculate a percentage discount',
      prompt: `Sale day! Buy ${quantity} baskets at RM${price} each, with ${discount}% off the whole order. Calculate the discounted total and pay exactly.`,
      hint: `Find ${quantity} × RM${price}. The saving is ${discount}/100 of that amount. Subtract the saving from the original total.` }));
  const result = [];
  while (result.length < 3) result.push(pool.splice(Math.min(pool.length - 1, Math.max(0, Math.floor(rng() * pool.length))), 1)[0]);
  return result;
}

export function checkAnswer(problem, pieces) {
  const allowed = problem.type === 'bridge' ? problem.lengths : (problem.denominations || [1, 5, 10, 20]);
  if (!Array.isArray(pieces) || !pieces.every(value => allowed.includes(value)) || pieces.reduce((sum, value) => sum + value, 0) !== problem.target) return false;
  if (problem.ratio) return pieces.filter(value => value === 1).length * problem.ratio[1] === pieces.filter(value => value === 2).length * problem.ratio[0];
  return true;
}

function fraction(value) {
  const whole = Math.floor(value / 4), part = ['', '¼', '½', '¾'][value % 4];
  return `${whole || (!part ? '0' : '')}${whole && part ? ' ' : ''}${part}`;
}
const lengthLabel = (problem, value) => problem.scale === 4 ? fraction(value) : String(value);
const money = (problem, value) => `RM${problem.moneyScale ? (value / problem.moneyScale).toFixed(2) : value}`;

const sum = values => values.reduce((total, value) => total + value, 0);
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function startMission(container, { type, grade, onComplete, onExit, speak }) {
  const problems = createProblems(type, Number(grade));
  let round = 0, pieces = [], attempts = 0, roundHints = 0, hints = 0, independent = 0;
  let solved = false, completed = false, disposed = false;
  const root = element('section', 'mh-mission');
  root.setAttribute('aria-label', type === 'bridge' ? 'River bridge mission' : 'Village market mission');
  container.replaceChildren(root);

  function button(label, action, className = '', key = label) {
    const node = element('button', `mh-mission-button ${className}`, label);
    node.type = 'button';
    node.dataset.action = key;
    node.addEventListener('click', () => { if (!disposed && !completed) action(); });
    return node;
  }
  function narrate(text) { if (typeof speak === 'function') speak(text); }

  function render() {
    const focusKey = root.contains(document.activeElement) ? document.activeElement.dataset.action : null;
    const problem = problems[round];
    const total = sum(pieces);
    const heading = type === 'bridge' ? 'Build the river crossing' : 'Visit the village market';
    const prompt = problem.prompt || (type === 'bridge'
      ? (problem.groups ? `The river is ${problem.target} units wide. Each plank is ${problem.length} units. How many planks do you need?`
        : `Build a bridge exactly ${problem.target} units long. Tap planks to join them.`)
      : (problem.quantity > 1 ? `Buy ${problem.quantity} fruit baskets at RM${problem.price} each. Work out the total and make the exact payment.`
        : `Your fruit basket costs RM${problem.target}. Make the exact payment.`));
    root.replaceChildren();
    const top = element('div', 'mh-mission-top');
    top.append(element('span', 'mh-mission-eyebrow', `MISSION ${round + 1} OF 3`), button('Back to island', () => onExit?.(), 'mh-mission-quiet'));
    if (problem.skill) top.append(element('span', 'mh-mission-glossary', `DARJAH ${grade} · ${problem.skill}`));
    root.append(top, element('h2', '', heading), element('p', 'mh-mission-prompt', prompt));
    const aids = element('div', 'mh-mission-aids');
    aids.append(button('Hear instructions', () => narrate(prompt), 'mh-mission-quiet'),
      element('span', 'mh-mission-glossary', type === 'bridge' ? 'length = panjang · total = jumlah' : 'price = harga · payment = bayaran'));
    root.append(aids);

    const scene = element('div', `mh-mission-scene mh-mission-${type}`);
    if (solved) scene.classList.add('mh-mission-solved');
    if (type === 'bridge') {
      const targetLabel = problem.targetCm && !solved ? `${problem.targetCm} cm` : `${lengthLabel(problem, problem.target)} ${problem.unit || 'UNIT'}`;
      scene.append(element('div', 'mh-mission-scene-label', `${targetLabel} CROSSING`));
      const river = element('div', 'mh-mission-river');
      const track = element('div', 'mh-mission-track');
      track.style.setProperty('--units', String(problem.target / (problem.gridStep || 1)));
      track.setAttribute('role', 'img');
      track.setAttribute('aria-label', `Bridge: ${lengthLabel(problem, total)} ${problem.unit || 'units'} placed; target ${targetLabel}, ${pieces.length} planks`);
      for (const length of pieces) {
        const plank = element('span', 'mh-mission-plank', lengthLabel(problem, length));
        plank.style.width = `${length / problem.target * 100}%`;
        track.append(plank);
      }
      river.append(track);
      if (solved) {
        const traveller = element('span', 'mh-mission-traveller');
        traveller.setAttribute('aria-hidden', 'true');
        river.append(traveller);
      }
      scene.append(river, element('p', 'mh-mission-equation', pieces.length ? `${pieces.map(value => lengthLabel(problem, value)).join(' + ')} = ${lengthLabel(problem, total)} ${problem.unit || 'units'}` : 'Your first plank goes here'));
      if (problem.ratio) scene.append(element('p', 'mh-mission-grouping', `Short : long = ${pieces.filter(value => value === 1).length} : ${pieces.filter(value => value === 2).length} · Required ratio ${problem.ratio.join(':')}`));
      if (problem.groups) scene.append(element('p', 'mh-mission-grouping', `${pieces.length} planks × ${problem.length} units = ${total} units`));
    } else {
      const order = element('div', 'mh-mission-order');
      for (let i = 0; i < problem.quantity; i++) {
        const basket = element('div', 'mh-mission-basket');
        const fruit = element('span', 'mh-mission-fruit');
        fruit.setAttribute('aria-hidden', 'true');
        for (let orange = 0; orange < 3; orange++) fruit.append(element('span', 'mh-mission-orange'));
        basket.append(fruit, element('span', '', money(problem, problem.price)));
        order.append(basket);
      }
      scene.append(order);
      if (problem.discount) scene.append(element('p', 'mh-mission-grouping', `${problem.discount}% OFF · Pay ${100 - problem.discount}% of the original price`));
      if (problem.tender) scene.append(element('p', 'mh-mission-grouping', `Customer pays ${money(problem, problem.tender)} · Give back the change`));
      scene.append(element('p', 'mh-mission-scene-label', problem.tender ? 'YOUR CHANGE TRAY' : 'YOUR PAYMENT TRAY'));
      const tray = element('div', 'mh-mission-tray');
      tray.setAttribute('aria-label', `Tray contains ${pieces.length} pieces of money, total ${money(problem, total)}`);
      for (const value of pieces) tray.append(element('span', `mh-mission-note mh-mission-note-${value}`, money(problem, value)));
      if (!pieces.length) tray.append(element('span', 'mh-mission-empty', 'Tap money below to fill the tray'));
      scene.append(tray, element('p', 'mh-mission-equation', pieces.length ? `${pieces.map(value => money(problem, value)).join(' + ')} = ${money(problem, total)}` : `${problem.tender ? 'Change' : 'Paid'} so far: ${money(problem, 0)}`));
      if (solved) scene.append(element('p', 'mh-mission-receipt', `${problem.tender ? 'CHANGE' : 'PAYMENT'} ACCEPTED · ${money(problem, total)} · Thank you!`));
    }
    root.append(scene);
    const controls = element('div', 'mh-mission-pieces');
    for (const value of type === 'bridge' ? problem.lengths : (problem.denominations || [1, 5, 10, 20]).filter(value => Number(grade) === 3 || value <= problem.target)) {
      const control = button(type === 'bridge' ? `+ ${lengthLabel(problem, value)} ${problem.unit || (value === 1 ? 'unit' : 'units')}` : `+ ${money(problem, value)}`, () => {
        if (pieces.length >= 20 || sum(pieces) + value > problem.target + Math.max(...(problem.lengths || problem.denominations || [20]))) {
          feedback.textContent = pieces.length >= 20 ? 'You have 20 pieces. Undo some and try larger pieces.' : 'There is no room for that piece. Undo a piece before adding another.';
          return;
        }
        pieces.push(value); render();
      }, type === 'bridge' ? 'mh-mission-wood' : `mh-mission-note-${value}`);
      control.dataset.value = String(value);
      control.disabled = solved;
      controls.append(control);
    }
    root.append(controls);
    const feedback = element('p', 'mh-mission-feedback', solved ? 'You did it! Ready for the next stop.' : 'Take your time. You can change your answer.');
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    root.append(feedback);
    const actions = element('div', 'mh-mission-actions');
    const undo = button('Undo', () => { pieces.pop(); render(); }, 'mh-mission-quiet');
    undo.disabled = !pieces.length || solved;
    const reset = button('Start again', () => { pieces = []; render(); }, 'mh-mission-quiet');
    reset.disabled = !pieces.length || solved;
    const hint = button('Show a hint', () => {
      roundHints++; hints++;
      const text = problem.hint || (type === 'bridge'
        ? `Count each small grid space as 1 unit. You have ${total} units. The river is ${problem.target} units wide.${problem.groups ? ` Add equal groups of ${problem.length}.` : ''}`
        : problem.quantity > 1 ? `Add RM${problem.price} for each of the ${problem.quantity} baskets: ${Array(problem.quantity).fill(problem.price).join(' + ')}. Then make that amount with notes.`
          : `Start with the larger notes. Your target is RM${problem.target}; you have RM${total}. Add or remove notes until they match.`);
      feedback.textContent = text; narrate(text);
    }, 'mh-mission-quiet');
    hint.disabled = solved;
    const check = button(solved ? (round === 2 ? 'Finish mission ✓' : 'Next stop →') : (type === 'bridge' ? 'Test my bridge' : (problem.tender ? 'Give my change' : 'Pay for my order')), () => {
      if (solved) {
        if (round === 2) {
          completed = true;
          onComplete?.({ type, grade: Number(grade), rounds: 3, independent, hints });
        } else { round++; pieces = []; attempts = 0; roundHints = 0; solved = false; render(); }
        return;
      }
      attempts++;
      if (checkAnswer(problem, pieces)) {
        if (attempts === 1 && roundHints === 0) independent++;
        solved = true; render();
        narrate(type === 'bridge' ? 'Your bridge fits exactly. Great building!' : (problem.tender ? 'That is the exact change. Thank you!' : 'That is the exact payment. Thank you!'));
      } else {
        const difference = Math.abs(problem.target - total);
        if (total === problem.target && problem.ratio) {
          feedback.textContent = `The length fits! Now check the ratio: you need ${problem.ratio[0]} short for every ${problem.ratio[1]} long planks. Undo and swap planks.`;
          return;
        }
        feedback.textContent = total < problem.target
          ? (type === 'bridge' ? `There is still a gap of ${lengthLabel(problem, difference)} ${problem.unit || 'units'}. Add another plank.` : `You need ${money(problem, difference)} more. Add money to your tray.`)
          : (type === 'bridge' ? `Your bridge is ${lengthLabel(problem, difference)} ${problem.unit || 'units'} too long. Undo a plank and try a different length.` : `There is ${money(problem, difference)} too much in the tray. Undo some money and try again.`);
      }
    }, 'mh-mission-primary', 'check');
    actions.append(undo, reset, hint, check);
    root.append(actions);
    if (focusKey) {
      const replacement = [...root.querySelectorAll('button')].find(node => node.dataset.action === focusKey && !node.disabled);
      (replacement || check).focus({ preventScroll: true });
    }
  }
  render();
  return () => { disposed = true; root.remove(); };
}
