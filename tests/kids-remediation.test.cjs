// Kids-math remediation regression harness.
// Loads index.html, extracts the app script, and evaluates only the pure
// helpers in a stubbed VM context (no DOM, no network, no localStorage disk).
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = process.argv[2];
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// --- static assertions on the diff -------------------------------------
const mustContain = [
  'function isBodyOccupied(bodyId)',
  'function saveNewProfile(p)',
  'function profilePinMatches(p, pinHash)',
  'function requestProfileAccess(bodyId, action)',
  'function completeProfileAccess(p, action)',
  'function activateProfile(p)',
  'if (isBodyOccupied(p.body)) return false;',
  "loginState.pinBusy = true;",
  'loginState.profileAction = null;',
];
for (const s of mustContain) {
  assert(html.includes(s), 'missing remediation marker: ' + s);
}
console.log('PASS static remediation markers present');

// --- dynamic harness ---------------------------------------------------
// Extract the last <script> block (the app logic) and run the small set of
// functions we care about with stubs for everything else.
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
const appSrc = scripts[scripts.length - 1][1];

// localStorage stub with a Map so occupancy is testable.
function makeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    _map: m,
  };
}

// Build a minimal sandbox with the globals the extracted functions close over.
const storage = makeStorage();
const loginState = {
  step: 'name', name: '', pendingBodyId: null,
  candidates: [], candidateIndex: 0, profileAction: null, pinBusy: false,
};
const state = { profile: null };
let toastMsg = null, screenShown = null, resetProfile = null;
const ctx = {
  console,
  localStorage: storage,
  loginState, state,
  PROFILE_KEY: (id) => 'mh_profile_' + id,
  loadProfile: (bodyId) => {
    const raw = storage.getItem('mh_profile_' + bodyId);
    if (raw === null) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  indexAddProfile: () => {},
  saveProfile: (p) => {
    storage.setItem('mh_profile_' + p.body, JSON.stringify(p));
  },
  showToast: (m) => { toastMsg = m; },
  showScreen: (s) => { screenShown = s; },
  showVerifiedResetConfirm: (p) => { resetProfile = p; },
  finishLogin: () => {},
  goToLoadPin: () => { loginState.step = 'pin-load'; },
  Sound: { correct() {}, click() {} },
  checkDailyBonus: (p) => p,
};
vm.createContext(ctx);

// Pull out the exact function bodies from the app source and evaluate them.
function extractFn(name) {
  const re = new RegExp('function ' + name + '\\s*\\([^)]*\\)\\s*\\{');
  const m = appSrc.match(re);
  assert(m, 'function not found in app source: ' + name);
  let i = m.index + m[0].length - 1, depth = 0;
  for (let j = i; j < appSrc.length; j++) {
    if (appSrc[j] === '{') depth++;
    else if (appSrc[j] === '}') { depth--; if (!depth) return appSrc.slice(m.index, j + 1); }
  }
  throw new Error('unbalanced function ' + name);
}
for (const fn of ['isBodyOccupied', 'saveNewProfile', 'profilePinMatches',
                  'requestProfileAccess', 'completeProfileAccess', 'activateProfile']) {
  vm.runInContext(extractFn(fn), ctx);
}

// 1. isBodyOccupied: empty slot false, raw slot (even corrupt) true.
assert.strictEqual(vm.runInContext("isBodyOccupied('b1')", ctx), false);
storage.setItem('mh_profile_b1', '{corrupt-json');
assert.strictEqual(vm.runInContext("isBodyOccupied('b1')", ctx), true,
  'occupied check must use raw slot, not parseable record');
console.log('PASS isBodyOccupied guards raw slot including corrupt record');

// 2. saveNewProfile refuses to overwrite an occupied slot.
storage.removeItem('mh_profile_b2');
const ok1 = vm.runInContext("saveNewProfile({body:'b2',name:'Ali',pinHash:'h1'})", ctx);
assert.strictEqual(ok1, true);
const ok2 = vm.runInContext("saveNewProfile({body:'b2',name:'Siti',pinHash:'h2'})", ctx);
assert.strictEqual(ok2, false, 'saveNewProfile must not overwrite occupied body');
assert.strictEqual(JSON.parse(storage.getItem('mh_profile_b2')).name, 'Ali');
console.log('PASS saveNewProfile refuses overwrite of occupied body');

// 3. saveNewProfile still writes when the slot is free and updates index.
storage.removeItem('mh_profile_b3');
assert.strictEqual(vm.runInContext("saveNewProfile({body:'b3',name:'Aina',pinHash:'h3'})", ctx), true);
assert(storage.getItem('mh_profile_b3').includes('Aina'));
console.log('PASS saveNewProfile writes free slot');

// 4. profilePinMatches: no pinHash -> open; matching hash -> true; wrong -> false.
assert.strictEqual(vm.runInContext("profilePinMatches({pinHash:null},'anything')", ctx), true);
assert.strictEqual(vm.runInContext("profilePinMatches({pinHash:'abc'},'abc')", ctx), true);
assert.strictEqual(vm.runInContext("profilePinMatches({pinHash:'abc'},'zzz')", ctx), false);
console.log('PASS profilePinMatches gate logic');

// 5. requestProfileAccess on a PIN-protected profile routes to the PIN pad,
//    not directly to activation.
storage.setItem('mh_profile_b4', JSON.stringify({ body: 'b4', name: 'Mei', pinHash: 'h4' }));
loginState.profileAction = null; loginState.step = 'name';
vm.runInContext("requestProfileAccess('b4','select')", ctx);
assert.strictEqual(loginState.step, 'pin-load');
assert.strictEqual(loginState.profileAction, 'select');
assert.strictEqual(state.profile, null, 'must not activate before PIN');
assert.strictEqual(loginState.candidates[0].name, 'Mei');
console.log('PASS requestProfileAccess gates PIN-protected profile');

// 6. requestProfileAccess on a pin-less profile activates immediately.
storage.setItem('mh_profile_b5', JSON.stringify({ body: 'b5', name: 'Open', pinHash: null }));
loginState.profileAction = null; loginState.step = 'name'; state.profile = null;
vm.runInContext("requestProfileAccess('b5','select')", ctx);
assert.strictEqual(state.profile && state.profile.name, 'Open');
console.log('PASS requestProfileAccess passes pin-less profile through');

// 7. completeProfileAccess with action 'reset' must NOT activate the profile,
//    it shows the reset confirmation instead.
state.profile = null; resetProfile = null;
vm.runInContext("completeProfileAccess({body:'b6',name:'R'},'reset')", ctx);
assert.strictEqual(state.profile, null);
assert.strictEqual(resetProfile && resetProfile.name, 'R');
assert.strictEqual(screenShown, 'start');
console.log('PASS completeProfileAccess reset path does not activate');

// 8. Race guard: the busy flag is set synchronously before the first await in
//    the PIN completion handler (static check on the handler body).
const handlerMatch = appSrc.match(/loginState\.pinBusy = true;[\s\S]{0,200}await hashPin/);
assert(handlerMatch, 'pinBusy must be set before await hashPin');
console.log('PASS pinBusy set before await (double-submit race guard)');

console.log('ALL KIDS-MATH REMEDIATION TESTS PASS');
