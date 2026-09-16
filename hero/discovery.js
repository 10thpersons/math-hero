export const DISCOVERY_SOURCES = [
  { title: 'EIA Energy Kids: Science of electricity', url: 'https://www.eia.gov/kids/energy-sources/electricity/science-of-electricity.php' },
  { title: 'University of Maine: What is a circuit?', url: 'https://extension.umaine.edu/4h/stem-toolkits/skys-the-limit-solar-energy-project/activity-1-what-is-a-circuit/' },
  { title: 'Arkib Negara: Malaysian proclamations', url: 'https://www.arkib.gov.my/images/pameran-maya/megah-bangsa.pdf' },
  { title: 'Science Buddies: Magnet Mining', url: 'https://www.sciencebuddies.org/teacher-resources/lesson-plans/magnet-mining' },
  { title: 'Arkib Negara: Declaration of Independence', url: 'https://pustakailmu.arkib.gov.my/index.php/ms/pustaka-ilmu/imbasan-fakta/dokumen-perisytiharan-kemerdekaan?page=1' },
  { title: 'MyGovernment: Rukun Negara', url: 'https://www.malaysia.gov.my/my/government/kenali-malaysia/rukun-negara' },
];
const material = (id, label, shape, magnetic, conductive) => ({ id, label, shape, magnetic, conductive });
const materials = [
  material('nail', 'Iron nail', 'nail', true, true), material('clip', 'Iron wire loop', 'clip', true, true),
  material('wood', 'Dry wooden block', 'wood', false, false), material('plastic', 'Plastic button', 'button', false, false),
  material('paper', 'Dry paper sheet', 'paper', false, false), material('bolt', 'Iron bolt', 'bolt', true, true),
  material('foil', 'Aluminium foil', 'foil', false, true), material('copper', 'Copper wire', 'wire', false, true),
];
function shuffled(items, rng) {
  const copy = items.map(item => ({ ...item }));
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.max(0, Math.floor(rng() * (i + 1))));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
const randomIndex = (length, rng) => Math.min(length - 1, Math.max(0, Math.floor(rng() * length)));
export function createDiscoveryRounds(type, grade, rng = Math.random) {
  if (!['science', 'history'].includes(type) || ![1, 2, 3, 4, 5, 6].includes(Number(grade))) throw new Error('Unsupported discovery');
  if (type === 'science') {
    const year = Number(grade);
    return Array.from({ length: 3 }, (_, index) => {
      const property = year >= 4 && !(year === 6 && index === 1) ? 'conductive' : 'magnetic';
      const pool = year <= 2 ? materials.filter(item => !['foil', 'copper'].includes(item.id)) : materials;
      const yes = shuffled(pool.filter(item => item[property]), rng);
      const no = shuffled(pool.filter(item => !item[property]), rng);
      const count = [4, 5, 4, 4, 6, 7][year - 1];
      const minimum = Math.max(1, count - no.length);
      const yesCount = minimum + randomIndex(Math.min(yes.length, count - 1) - minimum + 1, rng);
      return { type, property, title: property === 'conductive' ? ['Light the workshop', 'Repair the circuit kit', 'Choose your circuit materials'][index] : ['Sort the workshop', 'Rescue the mixed supplies', 'Pack the science kit'][index], items: shuffled([...yes.slice(0, yesCount), ...no.slice(0, count - yesCount)], rng) };
    });
  }
  const family = [
    { id: 'born', label: 'Aina is born', date: '2018', order: 2018, shape: 'baby', evidence: 'Family album: birthday, 2018.' },
    { id: 'walk', label: 'Aina starts walking', date: '2019', order: 2019, shape: 'steps', evidence: 'Family album: first steps, 2019.' },
    { id: 'school', label: 'Aina starts school', date: '2025', order: 2025, shape: 'school', evidence: 'Family album: first school day, 2025.' },
  ];
  const garden = [
    { id: 'seed', label: 'Plant the seed', date: '1 June', order: 1, shape: 'seed', evidence: 'Garden diary: planted on 1 June.' },
    { id: 'sprout', label: 'A sprout appears', date: '5 June', order: 5, shape: 'sprout', evidence: 'Garden diary: sprout spotted on 5 June.' },
    { id: 'flower', label: 'A flower opens', date: '28 June', order: 28, shape: 'flower', evidence: 'Garden diary: first flower on 28 June.' },
  ];
  if (Number(grade) >= 3) garden.push({ id: 'leaves', label: 'More leaves grow', date: '12 June', order: 12, shape: 'leaves', evidence: 'Garden diary: more leaves on 12 June.' });
  if (Number(grade) === 2 || Number(grade) >= 4) family.push({ id: 'preschool', label: 'Aina starts preschool', date: '2023', order: 2023, shape: 'book', evidence: 'Family album: preschool photo, 2023.' });
  if (Number(grade) >= 4) {
    const archive = [
      { id: 'plan', label: 'Plan the island museum', date: '20 December 2023', order: 20231220, shape: 'paper', evidence: 'Planning notebook dated 20 December 2023.' },
      { id: 'collect', label: 'Collect family photographs', date: '8 January 2024', order: 20240108, shape: 'book', evidence: 'Collection register dated 8 January 2024.' },
      { id: 'build', label: 'Build the display room', date: '22 February 2024', order: 20240222, shape: 'building', evidence: 'Builder’s diary dated 22 February 2024.' },
      { id: 'open', label: 'Open the museum', date: '3 March 2024', order: 20240303, shape: 'flag', evidence: 'Opening invitation dated 3 March 2024.' },
    ];
    if (Number(grade) >= 5) archive.push({ id: 'labels', label: 'Write the exhibit labels', date: '1 March 2024', order: 20240301, shape: 'paper', evidence: 'Exhibit checklist dated 1 March 2024.' });
    if (Number(grade) === 6) archive.push({ id: 'interview', label: 'Record an elder’s interview', date: '25 January 2024', order: 20240125, shape: 'book', evidence: 'Oral-history recording log dated 25 January 2024.' });
    family.splice(0, family.length, ...archive);
  }
  const name = ['Aina', 'Ravi', 'Mei', 'Adam', 'Sara', 'Amir'][randomIndex(6, rng)];
  const yearOffset = randomIndex(12, rng) - 6;
  for (const item of family) {
    item.label = item.label.replaceAll('Aina', name);
    item.date = item.date.replace(/20\d{2}/g, value => String(Number(value) + yearOffset));
    item.evidence = item.evidence.replace(/20\d{2}/g, value => String(Number(value) + yearOffset));
    item.order += yearOffset * (Number(grade) >= 4 ? 10000 : 1);
  }
  // Interview evidence can fall before or after the collection entry: read the date.
  const interview = family.find(item => item.id === 'interview');
  if (interview) {
    const day = [2, 5, 12, 18, 25][randomIndex(5, rng)];
    interview.date = `${day} January ${2024 + yearOffset}`;
    interview.order = (2024 + yearOffset) * 10000 + 100 + day;
    interview.evidence = `Oral-history recording log dated ${interview.date}.`;
  }
  // These are fictional diary observations, with a fresh month and observation dates.
  const month = ['January', 'March', 'May', 'June', 'July', 'August', 'October'][randomIndex(7, rng)];
  const days = { seed: 1 + randomIndex(3, rng), sprout: 5 + randomIndex(4, rng), leaves: 12 + randomIndex(6, rng), flower: 24 + randomIndex(5, rng) };
  for (const item of garden) {
    const oldDate = item.date;
    item.date = `${days[item.id]} ${month}`; item.order = days[item.id];
    item.evidence = item.evidence.replace(oldDate, item.date);
  }
  const nation = [
    { id: 'merdeka', label: 'Malaya becomes independent', date: '31 August 1957', order: 1957, shape: 'flag', evidence: 'Arkib Negara records the Federation of Malaya independence declaration on 31 August 1957.' },
    { id: 'malaysia', label: 'Malaysia is formed', date: '16 September 1963', order: 1963, shape: 'building', evidence: 'Arkib Negara records the Malaysia proclamation on 16 September 1963.' },
    { id: 'rukun', label: 'Rukun Negara is proclaimed', date: '31 August 1970', order: 1970, shape: 'book', evidence: 'The Malaysian government dates the Rukun Negara proclamation to 31 August 1970.' },
  ];
  return [
    { type, title: Number(grade) >= 4 ? 'Rebuild the museum archive' : 'Restore the family album', note: Number(grade) >= 4 ? 'An invented museum story. Compare year, then month, then day. The source dates are your evidence.' : 'An invented family story. Use the dates as clues.', items: shuffled(family, rng) },
    { type, title: 'Repair the garden diary', note: 'An invented garden diary. These dates tell this story, not every plant’s growing time.', items: shuffled(garden, rng) },
    { type, title: 'Build a Malaysian timeline', note: 'Real historical events. History enrichment for young explorers.', items: shuffled(nation, rng) },
  ];
}
export function checkDiscoveryAnswer(problem, placements) {
  if (!problem || !placements || Object.keys(placements).length !== problem.items.length) return false;
  if (problem.type === 'science') return problem.items.every(item => placements[item.id] === (item[problem.property || 'magnetic'] ? (problem.property || 'magnetic') : 'other'));
  const sorted = [...problem.items].sort((a, b) => a.order - b.order);
  return sorted.every((item, index) => placements[item.id] === index);
}
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};
export function startDiscovery(container, { type, grade, onComplete, onExit, speak }) {
  const rounds = createDiscoveryRounds(type, grade);
  let round = 0, placements = {}, selected = null, tested = null, attempts = 0, roundHints = 0;
  let hints = 0, independent = 0, solved = false, completed = false, disposed = false, needsReview = false;
  let message = 'Choose an object, then choose where it belongs.';
  const root = el('section', 'mh-discovery');
  root.setAttribute('aria-label', type === 'science' ? 'Science Lab' : 'Time Detectives');
  container.replaceChildren(root);
  const say = text => { if (typeof speak === 'function') speak(text); };
  function button(label, action, key, cls = '') {
    const node = el('button', `md-button ${cls}`, label);
    node.type = 'button'; node.dataset.action = key;
    node.addEventListener('click', () => { if (!disposed && !completed) action(); });
    return node;
  }
  function render() {
    const focus = root.contains(document.activeElement) ? document.activeElement.dataset.action : null;
    const problem = rounds[round];
    const circuit = problem.property === 'conductive';
    root.replaceChildren();
    const top = el('div', 'md-top');
    top.append(el('span', 'md-eyebrow', `${type === 'science' ? 'SCIENCE LAB' : 'TIME DETECTIVES'} · ${round + 1} / 3`), button('Back to island', () => onExit?.(), 'back'));
    const prompt = circuit ? 'Predict which dry materials will complete this battery circuit and light its bulb. Tap an object, then a tray. Test an object if you need help.' : type === 'science' ? 'Tap an object, then a tray to sort it. Predict which objects a magnet will pick up. Test an object if you need help.' : 'Tap a clue card, then a timeline space. Put the story in order from earliest to latest.';
    root.append(top, el('h2', '', problem.title), el('p', 'md-prompt', prompt));
    const aids = el('div', 'md-tools');
    aids.append(button('Hear instructions', () => say(prompt), 'hear'), el('span', 'md-note', circuit ? 'conductor = konduktor · insulator = penebat' : type === 'science' ? 'attract = menarik · predict = ramal' : 'earliest = paling awal · evidence = bukti'));
    root.append(aids);
    if (problem.note) root.append(el('p', 'md-note', problem.note));
    const scene = el('div', `md-scene md-${type}${solved ? ' md-solved' : ''}`);
    if (type === 'science') {
      const lab = el('div', 'md-lab');
      const magnet = el('div', circuit ? 'md-circuit' : 'md-magnet', circuit ? undefined : 'N   S');
      if (circuit) magnet.append(el('span', 'md-battery', '−  +'), el('span', 'md-circuit-wire'), el('span', 'md-bulb'));
      if (circuit && tested && problem.items.find(item => item.id === tested).conductive) magnet.classList.add('md-powered');
      magnet.setAttribute('aria-hidden', 'true');
      lab.append(magnet);
      if (tested) {
        const object = problem.items.find(item => item.id === tested);
        const specimen = el('div', `md-specimen ${!circuit && object.magnetic ? 'md-attracted' : 'md-dropped'}`);
        specimen.append(el('span', `md-object md-object-${object.shape}`)); specimen.setAttribute('aria-label', object.label);
        lab.append(specimen, el('p', 'md-result', `${object.label}: ${circuit ? (object.conductive ? 'the bulb lights. It conducts electricity!' : 'the bulb stays off. It is an insulator in this model.') : object.magnetic ? 'the magnet picks it up!' : 'the magnet does not pick it up.'}`));
      } else lab.append(el('p', 'md-result', circuit ? 'A virtual battery circuit with dry, bare materials' : 'Your magnet testing station'));
      scene.append(lab);
    }
    const pool = el('div', 'md-cards');
    problem.items.filter(item => placements[item.id] === undefined).forEach(item => pool.append(card(item)));
    if (!pool.childElementCount) pool.append(el('p', 'md-note', 'All placed. Check your work or tap a placed object to move it.'));
    scene.append(pool);
    const destinations = el('div', type === 'science' ? 'md-trays' : 'md-timeline');
    const targets = type === 'science' ? [circuit ? 'conductive' : 'magnetic', 'other'] : problem.items.map((_, i) => i);
    targets.forEach(target => {
      const destination = el('div', 'md-destination');
      const label = type === 'science' ? (circuit ? (target === 'conductive' ? 'Conductor · bulb lights' : 'Insulator · bulb stays off') : target === 'magnetic' ? 'Magnet picks up' : 'Magnet does not pick up') : `${target + 1}. ${target === 0 ? 'Earliest' : target === targets.length - 1 ? 'Latest' : 'Then'}`;
      const place = button(label + (selected ? ' · Place here' : ''), () => {
        if (solved || !selected) return;
        if (type === 'history') {
          const occupied = Object.keys(placements).find(id => placements[id] === target);
          if (occupied) delete placements[occupied];
        }
        placements[selected] = target; selected = null; tested = null;
        message = 'Placed! Choose another object or check your work.'; render();
      }, `target-${target}`, 'md-place');
      place.disabled = solved || !selected;
      destination.append(place);
      problem.items.filter(item => placements[item.id] === target).forEach(item => destination.append(card(item)));
      if (!Object.values(placements).includes(target)) destination.append(el('span', 'md-empty', type === 'science' ? 'Sort objects here' : 'A clue goes here'));
      destinations.append(destination);
    });
    scene.append(destinations); root.append(scene);
    const feedback = el('p', 'md-feedback', message); feedback.setAttribute('role', 'status'); feedback.setAttribute('aria-live', 'polite'); root.append(feedback);
    const actions = el('div', 'md-tools');
    const reset = button('Start again', () => { placements = {}; selected = null; tested = null; message = 'Choose an object and place it again.'; render(); }, 'reset'); reset.disabled = solved;
    const hint = button(type === 'science' ? 'Test selected object' : 'Read a clue', () => {
      if (solved) return;
      if (!selected) { message = 'Tap an object first, then use this help button.'; render(); return; }
      hints++; roundHints++;
      needsReview = false;
      const item = problem.items.find(item => item.id === selected);
      tested = selected;
      message = circuit ? `${item.label}: ${item.conductive ? 'electricity passes through this material, lighting the bulb.' : 'this dry material does not complete our battery circuit.'}` : type === 'science' ? `${item.label} ${item.magnetic ? 'is attracted to the magnet. Put it in the picks-up tray.' : 'is not picked up by this magnet. Put it in the other tray.'}` : `${item.evidence} Compare its date with the other cards.`;
      say(message); render();
    }, 'hint'); hint.disabled = solved;
    const check = button(solved ? (round === 2 ? 'Finish discovery' : 'Next discovery') : (type === 'science' ? 'Check my sorting' : 'Restore this timeline'), () => {
      if (solved) {
        if (round === 2) { completed = true; onComplete?.({ type, grade: Number(grade), rounds: 3, independent, hints }); return; }
        round++; placements = {}; selected = null; tested = null; attempts = 0; roundHints = 0; solved = false; needsReview = false; message = 'Choose an object, then choose where it belongs.'; render(); return;
      }
      if (Object.keys(placements).length !== problem.items.length) { message = 'Place every object first. You can move any object by tapping it.'; render(); return; }
      attempts++;
      if (checkDiscoveryAnswer(problem, placements)) {
        if (attempts === 1 && roundHints === 0) independent++;
        solved = true; selected = null;
        message = circuit ? 'Circuit kit sorted! Iron, copper and aluminium conduct electricity. Dry wood, plastic and dry paper are insulators in our model. Copper and aluminium conduct electricity even though a magnet does not pick them up.' : type === 'science' ? 'Sorted! Iron is picked up by this magnet. Wood, plastic, paper, copper and aluminium are not. Not every metal is magnetic.' : 'Timeline restored! Dates are evidence that help us put events in order.';
      } else {
        needsReview = true;
        message = circuit ? 'Before checking again, select an object and tap Test selected object. Observe the bulb, then adjust your trays. Conducting electricity and magnet attraction are different properties.' : type === 'science' ? 'Before checking again, select an object and tap Test selected object. Observe the magnet, then adjust your trays.' : 'Before checking again, select a card and tap Read a clue. Compare its date with the neighbouring cards, then adjust your timeline.';
      }
      render(); say(message);
    }, 'check', 'md-primary');
    check.disabled = needsReview;
    actions.append(reset, hint, check); root.append(actions);
    if (focus) root.querySelectorAll('[data-action]').forEach(node => { if (node.dataset.action === focus && !node.disabled) node.focus({ preventScroll: true }); });
  }
  function card(item) {
    const node = button('', () => { if (solved) return; selected = item.id; tested = null; message = `${item.label} selected. Tap ${type === 'science' ? 'a tray' : 'a timeline space'} to place it.`; render(); }, `item-${item.id}`, `md-card${selected === item.id ? ' md-selected' : ''}`);
    node.disabled = solved; node.setAttribute('aria-pressed', String(selected === item.id));
    const icon = el('span', `md-object md-object-${item.shape}`); icon.setAttribute('aria-hidden', 'true');
    node.append(icon, el('strong', '', item.label));
    if (item.date) node.append(el('span', 'md-date', item.date));
    return node;
  }
  render();
  return () => { disposed = true; root.remove(); };
}
