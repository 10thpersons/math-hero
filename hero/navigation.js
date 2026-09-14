const STEPS = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
const DIRECTIONS = { N: 'North', E: 'East', S: 'South', W: 'West' };
const same = (a, b) => a[0] === b[0] && a[1] === b[1];

export function createNavigationProblems(grade, rng = Math.random) {
  if (![1, 2, 3, 4, 5, 6].includes(Number(grade))) throw new Error('Unsupported navigation grade');
  const pool = Number(grade) <= 2 ? [
    { size: 4, start: [0, 3], target: [3, 0], blocked: [[1, 2], [2, 2]], title: 'Books for the school' },
    { size: 4, start: [3, 3], target: [0, 0], blocked: [[2, 1], [1, 1]], title: 'Deliver to the hill school' },
    { size: 4, start: [0, 0], target: [3, 3], blocked: [[1, 1], [1, 2]], title: 'A parcel across the island' },
    { size: 4, start: [3, 0], target: [0, 3], blocked: [[2, 2], [2, 1]], title: 'Supplies for the south school' }
  ] : [
    { size: 5, start: [0, 4], waypoint: [0, 0], target: [4, 0], blocked: [[1, 2], [2, 2], [3, 2]], title: 'Collect fruit, then deliver' },
    { size: 5, start: [4, 4], waypoint: [4, 0], target: [0, 0], blocked: [[1, 2], [2, 2], [3, 2]], title: 'Visit the market on the way' },
    { size: 5, start: [0, 0], waypoint: [4, 0], target: [4, 4], blocked: [[2, 1], [2, 2], [2, 3]], title: 'A delivery around the forest' },
    { size: 5, start: [4, 0], waypoint: [0, 0], target: [0, 4], blocked: [[2, 1], [2, 2], [2, 3]], title: 'Market to village school' }
  ];
  const year = Number(grade);
  if (![1, 3].includes(year)) {
    const size = year === 2 ? 5 : year === 6 ? 7 : 6;
    const oldSize = pool[0].size;
    const stretch = cell => cell.map(value => value === oldSize - 1 ? size - 1 : value);
    for (const problem of pool) {
      problem.size = size;
      problem.start = stretch(problem.start); problem.target = stretch(problem.target);
      if (problem.waypoint) problem.waypoint = stretch(problem.waypoint);
      if (year >= 4) {
        problem.blocked = [];
        for (let i = 1; i < size - 1; i++) problem.blocked.push(problem.start[0] === problem.waypoint[0] ? [i, Math.floor(size / 2)] : [Math.floor(size / 2), i]);
      }
      if (year >= 5) problem.maxSteps = (size - 1) * 2;
    }
  }
  const selected = [];
  while (selected.length < 3) selected.push(pool.splice(Math.min(pool.length - 1, Math.max(0, Math.floor(rng() * pool.length))), 1)[0]);
  return selected;
}

function trace(problem, route) {
  if (!Array.isArray(route)) return null;
  let position = [...problem.start];
  const positions = [position];
  for (const direction of route) {
    if (!Object.hasOwn(STEPS, direction)) return null;
    const [dx, dy] = STEPS[direction];
    position = [position[0] + dx, position[1] + dy];
    if (position.some(value => value < 0 || value >= problem.size) || problem.blocked.some(cell => same(cell, position))) return null;
    positions.push(position);
  }
  return positions;
}

export function validateRoute(problem, route) {
  const positions = trace(problem, route);
  if (!positions || !route.length || (problem.maxSteps && route.length > problem.maxSteps) || !same(positions.at(-1), problem.target)) return false;
  const stop = problem.waypoint ? positions.findIndex(position => same(position, problem.waypoint)) : 0;
  const arrival = positions.findIndex(position => same(position, problem.target));
  return stop >= 0 && arrival > stop;
}

function node(tag, className, text) {
  const result = document.createElement(tag);
  result.className = className;
  if (text !== undefined) result.textContent = text;
  return result;
}

export function startNavigation(container, { grade, onComplete, onExit, speak }) {
  const problems = createNavigationProblems(Number(grade));
  let round = 0, route = [], independent = 0, hints = 0, helped = false, solved = false, running = false, disposed = false, completed = false;
  let animation = null, vehicleStep = 0;
  const root = node('section', 'mh-navigation');
  root.setAttribute('aria-label', 'Island Navigator geography game');
  container.replaceChildren(root);
  function button(label, key, action, disabled = false, extra = '') {
    const result = node('button', `mh-nav-button ${extra}`, label);
    result.type = 'button'; result.dataset.action = key; result.disabled = disabled;
    result.addEventListener('click', () => { if (!disposed && !completed) action(); });
    return result;
  }
  function move(direction) {
    if (running || solved || disposed || completed) return;
    const candidate = [...route, direction];
    if (route.length >= 40) { render('Try a shorter route. Undo a step or start again.'); return; }
    if (!trace(problems[round], candidate)) {
      helped = true; render('That step reaches the forest or the edge. Choose another direction.'); return;
    }
    route = candidate; render();
  }
  function send() {
    if (running || solved) return;
    if (!validateRoute(problems[round], route)) {
      helped = true;
      render(problems[round].maxSteps && route.length > problems[round].maxSteps ? `This delivery has a ${problems[round].maxSteps}-step fuel budget. Find a shorter route with no detours.` : problems[round].waypoint ? 'Visit the market first, then finish at the school. You can undo or add steps.' : 'Your route must finish at the school. Add steps or try again.');
      return;
    }
    running = true; vehicleStep = 0; render('Delivery on its way!');
    animation = setInterval(() => {
      if (disposed) return;
      vehicleStep++;
      if (vehicleStep >= route.length) {
        clearInterval(animation); animation = null; running = false; solved = true;
        if (!helped) independent++;
        render('Delivered! North is up, east is right, south is down and west is left on this map.');
      } else render('Delivery on its way!');
    }, 240);
  }
  function render(message = '') {
    const focus = root.contains(document.activeElement) ? document.activeElement.dataset.action : null;
    const problem = problems[round];
    const positions = trace(problem, route);
    const endpoint = positions.at(-1);
    root.replaceChildren();
    const top = node('div', 'mh-nav-top');
    top.append(node('span', 'mh-nav-eyebrow', `GEOGRAPHY · DELIVERY ${round + 1} / 3`), button('Back to island', 'exit', () => onExit?.()));
    root.append(top, node('h2', '', 'Island Navigator'), node('p', 'mh-nav-subtitle', 'An imaginary island · Geography enrichment'));
    const instruction = (problem.waypoint ? `${problem.title}. Plan from the jetty to the market, then the school. Avoid the forest.` : `${problem.title}. Plan from the jetty to the school. Avoid the forest.`) + (problem.maxSteps ? ` Your fuel budget is ${problem.maxSteps} steps. Plan an efficient route.` : '');
    root.append(node('p', 'mh-nav-prompt', instruction));
    const layout = node('div', 'mh-nav-layout');
    const mapWrap = node('div', 'mh-nav-mapwrap');
    const compass = node('div', 'mh-nav-compass', 'N ↑ · E → · S ↓ · W ←');
    compass.setAttribute('aria-label', 'North up. East right. South down. West left.');
    const map = node('div', 'mh-nav-map');
    map.style.setProperty('--map-size', problem.size);
    map.dataset.size = problem.size;
    map.setAttribute('role', 'group'); map.setAttribute('aria-label', 'Route map. Use the arrow keys to plan a route.');
    map.tabIndex = 0; map.dataset.action = 'map';
    map.addEventListener('keydown', event => {
      const direction = { ArrowUp: 'N', ArrowRight: 'E', ArrowDown: 'S', ArrowLeft: 'W' }[event.key];
      if (direction) { event.preventDefault(); move(direction); }
    });
    for (let y = 0; y < problem.size; y++) for (let x = 0; x < problem.size; x++) {
      const cell = [x, y];
      const kind = problem.blocked.some(block => same(block, cell)) ? 'forest' : same(problem.start, cell) ? 'jetty' : same(problem.target, cell) ? 'school' : problem.waypoint && same(problem.waypoint, cell) ? 'market' : '';
      const visited = positions.some(position => same(position, cell));
      const tile = node('div', `mh-nav-tile ${kind ? `mh-nav-${kind}` : ''} ${visited ? 'mh-nav-visited' : ''} ${same(endpoint, cell) ? 'mh-nav-endpoint' : ''}`);
      tile.setAttribute('aria-label', `Column ${x + 1}, row ${y + 1}${kind ? `, ${kind}` : ''}${visited ? ', on route' : ''}`);
      if (kind) {
        const icon = node('span', 'mh-nav-icon'); icon.setAttribute('aria-hidden', 'true');
        tile.append(icon, node('span', 'mh-nav-label', kind === 'forest' ? 'Forest' : kind[0].toUpperCase() + kind.slice(1)));
      } else if (visited) tile.append(node('span', 'mh-nav-pathdot'));
      const vehiclePosition = running ? positions[vehicleStep] : solved ? endpoint : problem.start;
      if (same(vehiclePosition, cell)) {
        const car = node('span', 'mh-nav-vehicle'); car.setAttribute('aria-label', 'Delivery van'); tile.append(car);
      }
      map.append(tile);
    }
    mapWrap.append(compass, map, node('p', 'mh-nav-mapnote', 'Gold trail = your route · ring = planned finish'));
    const controls = node('div', 'mh-nav-controls');
    controls.append(node('h3', '', 'Plan your route'));
    if (problem.maxSteps) controls.append(node('p', 'mh-nav-budget', `${route.length} / ${problem.maxSteps} steps used`));
    const arrows = node('div', 'mh-nav-directions');
    for (const [key, arrow] of [['N', '↑'], ['W', '←'], ['E', '→'], ['S', '↓']]) {
      const control = button(`${arrow} ${DIRECTIONS[key]}`, key, () => move(key), running || solved, `mh-nav-dir-${key}`);
      control.setAttribute('aria-label', DIRECTIONS[key]); arrows.append(control);
    }
    controls.append(arrows);
    const tools = node('div', 'mh-nav-tools');
    tools.append(button('Undo', 'undo', () => { route.pop(); render(); }, running || solved || !route.length), button('Start again', 'reset', () => { route = []; render(); }, running || solved || !route.length));
    controls.append(tools);
    controls.append(node('p', 'mh-nav-route', route.length ? route.join(' → ') : 'Tap a direction to add a step.'));
    controls.append(button('Send delivery', 'send', send, running || solved || !route.length, 'mh-nav-primary'));
    layout.append(mapWrap, controls); root.append(layout);
    const feedback = node('p', 'mh-nav-feedback', message || 'Take your time. There can be more than one good route.');
    feedback.setAttribute('role', 'status'); root.append(feedback);
    const aids = node('div', 'mh-nav-tools');
    aids.append(button('Hear instructions', 'hear', () => speak?.(instruction)), button('Give me a hint', 'hint', () => {
      hints++; helped = true;
      const hint = 'Find your next stop. Is it above, below, left or right? Move one square at a time and go around forest squares.';
      render(hint); speak?.(hint);
    }, running || solved)); root.append(aids);
    if (solved) root.append(button(round === 2 ? 'Finish and collect coins' : 'Next delivery', 'next', () => {
      if (round === 2) { completed = true; onComplete?.({ type: 'geography', grade: Number(grade), rounds: 3, independent, hints }); }
      else { round++; route = []; helped = false; solved = false; render(); }
    }, false, 'mh-nav-primary mh-nav-next'));
    if (focus) {
      const candidates = [...root.querySelectorAll('[data-action]')];
      (candidates.find(item => item.dataset.action === focus && !item.disabled) || candidates.find(item => item.dataset.action === 'next') || candidates.find(item => item.dataset.action === 'map'))?.focus({ preventScroll: true });
    }
  }
  render();
  return () => { disposed = true; clearInterval(animation); root.remove(); };
}
