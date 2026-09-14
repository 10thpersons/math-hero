import { GRADES, freshState, normalizeState, SAVE_KEY, COLORS, DECORATIONS, rewardMission, rewardQuiz, buyDecoration, COSMETICS, SUBJECTS, buyCosmetic, equipCosmetic, ZONES, ACTIVITIES, unlockZone, upgradeCost, upgradeDecoration } from './state.js';
import { startMission } from './missions.js';
import { startQuiz } from './quiz.js';
import { startDiscovery } from './discovery.js';
import { startNavigation } from './navigation.js';
import { account, loadSave, onCloudStatus, queueSave, requestMagicLink, restoreSession, saveNow, signOut } from './cloud.js';

const $ = (selector) => document.querySelector(selector);
const icon = (name, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state = freshState();
let world, cleanupMission, toastTimer, returnFocus;
let selectedMission = 'bridge';
let selectedDecoration = 'flower';
let buildMode = false, selectedSlot = null, moveSource = null, placementRotation = 0;
let plotPositions = [], activeZone = 'home';
const gradeTopics = { 1:'Build numbers and count real objects.', 2:'Join bigger numbers and follow directions.', 3:'Explore equal groups and multiplication.', 4:'Convert measurements and work out change.', 5:'Build with fractions and decimal money.', 6:'Solve ratios, discounts and multi-step problems.' };
const activityIcons = { bridge:'bridge', market:'shop', science:'leaf', history:'book', geography:'compass' };
let canSave = true;
let cloudStatus = 'local';
const GUIDE_KEY = 'hero-islands-how-to-play-v1';
const panel = $('#panel');
const content = $('#panel-content');
const profile = () => state.profiles.find(p => p.id === state.active);

function renderCloudButton() {
  const button = $('#cloud-button');
  const dot = $('#cloud-account .cloud-dot');
  if (!button || !dot) return;
  const parent = account();
  dot.className = `cloud-dot ${cloudStatus}`;
  button.textContent = parent ? (cloudStatus === 'syncing' ? 'Saving…' : 'Cloud saved') : 'Cloud save';
  button.setAttribute('aria-label', parent ? `Cloud account ${parent.email}. ${cloudStatus === 'syncing' ? 'Saving progress.' : 'Progress saved.'}` : 'Set up cloud save');
}
onCloudStatus(status => { cloudStatus = status; renderCloudButton(); });

function storageWarning() {
  canSave = false;
  $('#save-warning').hidden = false;
  $('#save-warning').textContent = 'You can keep playing, but this browser cannot save your progress. Keep this tab open.';
  $('#panel-save-status').hidden = false;
  $('#panel-save-status').textContent = 'Playing without saving. Keep this tab open to keep your progress for this session.';
  content.querySelectorAll('.offline-label').forEach(node => { node.textContent = 'Changes last for this session only.'; });
}
try {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) state = normalizeState(JSON.parse(saved));
} catch { storageWarning(); }
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
  catch { storageWarning(); }
  queueSave(state);
  updateHeader();
}
function toast(message) {
  clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 3200);
}
function speak(text, language = 'en-MY') {
  if (!state.sound || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language; utterance.rate = .87;
  speechSynthesis.speak(utterance);
}
function chime() {
  if (!state.sound) return;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  try {
    const context = new Audio();
    [523.25,659.25,783.99].forEach((frequency,i) => {
      const oscillator = context.createOscillator(), gain = context.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0,context.currentTime + i*.11);
      gain.gain.linearRampToValueAtTime(.09,context.currentTime + i*.11 + .02);
      gain.gain.exponentialRampToValueAtTime(.001,context.currentTime + i*.11 + .5);
      oscillator.connect(gain); gain.connect(context.destination);
      oscillator.start(context.currentTime+i*.11); oscillator.stop(context.currentTime+i*.11+.5);
    });
    setTimeout(() => context.close(),1100);
  } catch { /* Sound is optional when the browser blocks audio. */ }
}
function updateHeader() {
  const p = profile();
  $('#profile-name').textContent = p.name;
  $('#profile-grade').textContent = `Darjah ${p.grade} · DLP`;
  $('#profile-button').setAttribute('aria-label',`Switch explorer. Current: ${p.name}, Darjah ${p.grade}`);
  $('#coin-count').textContent = p.coins;
  $('#sound-button').setAttribute('aria-pressed',String(state.sound));
  $('#sound-button').setAttribute('aria-label',state.sound ? 'Turn sound off' : 'Turn sound on');
  $('#progress-label').textContent = p.completed.length ? `${p.completed.length} adventures completed · Keep your curiosity growing.` : 'Five adventures. So much to discover.';
  updateQuest();
}
function updateQuest() {
  const market = selectedMission === 'market';
  $('#quest-title').textContent = market ? 'A little market magic' : 'A bridge to somewhere';
  $('#quest-description').textContent = market ? 'The pasar is open! Pack your maths skills and help with the shopping.' : 'The other side is waiting. Can you build a way across?';
  $('#quest-icon use').setAttribute('href',market ? '#i-shop' : '#i-bridge');
  $('#quest-number').textContent = market ? '02 / 02' : '01 / 02';
  $('#start-quest').innerHTML = `${market ? 'Let’s visit the pasar' : 'Let’s build'} ${icon('arrow')}`;
  $('#quest-reward').textContent = profile().completed.includes(`${selectedMission}-${profile().grade}`) ? '+15 coins every replay' : '+30 first adventure';
}
function syncWorld() { world?.setAvatar(profile().avatar); world?.setDecorations(profile().decorations); }
function closePanel() {
  cleanupMission?.(); cleanupMission = undefined;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  panel.close();
  world?.setPaused(false);
  returnFocus?.focus?.();
}
panel.addEventListener('cancel', () => { cleanupMission?.(); cleanupMission = undefined; world?.setPaused(false); if ('speechSynthesis' in window) speechSynthesis.cancel(); });
panel.addEventListener('click', e => { if (e.target === panel) { const r = panel.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closePanel(); } });
function openPanel(html) {
  if (buildMode) exitBuildMode();
  cleanupMission?.(); cleanupMission = undefined;
  if (!panel.open) returnFocus = document.activeElement;
  content.innerHTML = html;
  panel.scrollTop = 0;
  if (!canSave) content.querySelectorAll('.offline-label').forEach(node => { node.textContent = 'Changes last for this session only.'; });
  if (!panel.open) panel.showModal();
  world?.setPaused(true);
  content.querySelectorAll('[data-close]').forEach(button => { button.onclick = closePanel; });
}
function heading(kicker,title,description='') {
  return `<div class="panel-header"><div><div class="eyebrow">${kicker}</div><h2>${title}</h2>${description ? `<p>${description}</p>` : ''}</div><button class="icon-button" data-close aria-label="Close">${icon('close')}</button></div>`;
}
function showHowToPlay() {
  openPanel(`<section class="panel-content how-to-play">${heading('WELCOME TO HERO ISLANDS','A little guide before you begin.','Kids can explore straight away. Grown-ups can help set the adventure up in a minute.')}<div class="guide-columns"><section class="guide-card kid-guide"><div class="guide-icon">${icon('star')}</div><div><span class="guide-label">FOR KIDS</span><h3>Play, learn, make it yours.</h3><ol><li><b>Play & earn</b><span>Choose a game or quick quiz. There is no timer, so take your time.</span></li><li><b>Try your best</b><span>Use a hint whenever you need one. Every try is practice.</span></li><li><b>Spend Hero Coins</b><span>Give your hero new looks and build up your island.</span></li></ol></div></section><section class="guide-card parent-guide"><div class="guide-icon">${icon('book')}</div><div><span class="guide-label">FOR GROWN-UPS</span><h3>Set up, then let them lead.</h3><ol><li><b>Choose their explorer</b><span>Tap the face at the top to switch child profiles and select Darjah 1 to 6.</span></li><li><b>Follow their curiosity</b><span>Games cover maths, science, history and geography. Hints and retries are part of learning.</span></li><li><b>Keep progress safe</b><span>Use Cloud save with a parent email if you want the same island on another device.</span></li></ol></div></section></div><p class="guide-note">You can reopen this guide any time with <b>How to play</b> at the bottom of the island.</p><div class="panel-actions guide-actions"><button class="secondary-button" id="guide-parents">More for grown-ups</button><button class="primary-button" id="guide-start">Let’s explore ${icon('arrow')}</button></div></section>`);
  const remember = () => { try { localStorage.setItem(GUIDE_KEY, 'seen'); } catch {} };
  $('#guide-start').onclick = () => { remember(); closePanel(); };
  $('#guide-parents').onclick = () => { remember(); showParents(); };
}
function hasSeenGuide() { try { return localStorage.getItem(GUIDE_KEY) === 'seen'; } catch { return false; } }
function chooseMission() {
  openPanel(`<section class="panel-content activity-center">${heading('A LITTLE PRACTICE. A LITTLE MORE YOU.','Play & earn Hero Coins',`Darjah ${profile().grade} · Play as often as you like. Spend your coins on your hero or island.`)}<section class="learning-trail" aria-label="Choose practice year"><span class="field-label">Your learning adventure</span><div class="year-picker">${GRADES.map(grade=>`<button data-practice-grade="${grade}" aria-pressed="${profile().grade===grade}"><small>Darjah</small><b>${grade}</b></button>`).join('')}</div><p>${gradeTopics[profile().grade]}</p><div class="adventure-stamps" aria-label="First adventures completed this year">${Object.entries(ACTIVITIES).map(([type,name])=>`<span class="${profile().completed.includes(`${type}-${profile().grade}`)?'earned':''}" title="${name}">${icon(profile().completed.includes(`${type}-${profile().grade}`)?'check':activityIcons[type])}<small>${name}</small></span>`).join('')}</div><small>First visits fill your adventure stamps. Replay any game for more coins.</small></section><h3 class="section-title">Hands-on adventures <small>15 coins per finish · +15 on your first visit</small></h3><div class="mission-list"><button class="mission-choice" data-mission="bridge">${icon('bridge')}<span><b>Build & Rescue</b><small>Join lengths. Build a way across.</small></span>${icon('arrow','arrow')}</button><button class="mission-choice" data-mission="market">${icon('shop')}<span><b>Pasar Hero</b><small>Pack your number skills for the market.</small></span>${icon('arrow','arrow')}</button></div><div class="discovery-menu">${[['science','Science Lab','Test materials. Discover their properties.'],['history','Time Detectives','Read clues. Restore a timeline.'],['geography','Island Navigator','Plan a route. Deliver across the map.']].map(([type,name,description])=>`<button class="mission-choice discovery-choice ${type}" data-mission="${type}">${icon(activityIcons[type])}<span><b>${name}</b><small>${description}</small></span>${icon('arrow','arrow')}</button>`).join('')} </div><p class="copy">Science experiments, history discovery and map skills for curious explorers. History and geography are enrichment activities.</p><h3 class="section-title">Quick quiz club <small>5 questions · 10–25 coins per finish</small></h3><div class="quiz-menu">${Object.entries(SUBJECTS).map(([key,name])=>`<button class="quiz-choice quiz-${key}" data-quiz="${key}">${icon(key==='sains'?'leaf':key==='math'?'bridge':'book')}<b>${name}</b><small>${key==='math'?'Fresh number puzzles':key==='sains'?'Discover how things work':key==='bm'?'Jom bermain dengan bahasa':'Words, stories & discovery'}</small><span>Let’s play ${icon('arrow')}</span></button>`).join('')}</div><p class="copy">No time limit. First-try answers earn 4 coins; answers with help earn 1. Finish all five for 5 extra coins.</p><button class="secondary-button" id="games-shop">See what I’m saving for ${icon('avatar')}</button></section>`);
  content.querySelectorAll('[data-mission]').forEach(button => { button.onclick = () => launchActivity(button.dataset.mission); });
  content.querySelectorAll('[data-quiz]').forEach(button => { button.onclick = () => launchQuiz(button.dataset.quiz); });
  content.querySelectorAll('[data-practice-grade]').forEach(button=>{button.onclick=()=>{profile().grade=Number(button.dataset.practiceGrade);save();chooseMission();content.querySelector(`[data-practice-grade="${profile().grade}"]`).focus({preventScroll:true});};});
  $('#games-shop').onclick = showShop;
}
function finishActivity(player,result,title) {
  const earned = result.type === 'quiz' ? rewardQuiz(player,result) : rewardMission(player,result);
  save(); chime(); world?.celebrate();
  const rounds = result.type === 'quiz' ? 5 : 3;
  openPanel(`<section class="success-content"><div class="success-emblem">${icon('star')}</div><div class="eyebrow" style="justify-content:center">LOOK WHAT YOU MADE HAPPEN</div><h2>${title}</h2><p>${result.independent} of ${rounds} challenges on your own.<br>Every practice helps you grow.</p><div class="reward-badge"><span class="coin-icon">H</span><b>+${earned} Hero Coins</b></div><p>Your wallet now has ${player.coins} coins. What will you make yours?</p><button class="primary-button" id="reward-shop">Visit the hero shop ${icon('arrow')}</button><div class="success-links"><button class="secondary-button" id="reward-decorate">Build my island</button><button class="secondary-button" id="reward-replay">Play again · earn again</button></div><button class="text-button" data-close>Back to exploring</button></section>`);
  $('#reward-decorate').onclick = showHome;
  $('#reward-shop').onclick = showShop;
  $('#reward-replay').onclick = () => result.type === 'quiz' ? launchQuiz(result.subject) : launchActivity(result.type);
}
function launchActivity(type) {
  if (type === 'bridge' || type === 'market') return launchMission(type);
  const player = profile();
  openPanel('<div id="discovery-mount"></div>');
  let rewarded = false;
  const options = { type, grade:player.grade, speak, onExit:closePanel, onComplete:result=> {
    if(rewarded)return;
    rewarded=true;
    finishActivity(player,result,type==='science'?'A brilliant discovery!':type==='history'?'The timeline is restored!':'Special delivery, made!');
  } };
  cleanupMission = type==='geography' ? startNavigation($('#discovery-mount'),options) : startDiscovery($('#discovery-mount'),options);
  panel.scrollTop = 0;
}
function launchMission(type) {
  if (buildMode) exitBuildMode();
  selectedMission = type; updateQuest(); world?.focus(type);
  const player = profile();
  openPanel('<div id="mission-mount"></div>');
  let rewarded = false;
  cleanupMission = startMission($('#mission-mount'), { type, grade: player.grade, speak, onExit: closePanel,
    onComplete: result => {
      if (rewarded) return;
      rewarded = true;
      finishActivity(player,result,type === 'bridge' ? 'A way forward!' : 'Market day, made!');
    }
  });
}
function launchQuiz(subject) {
  const player = profile();
  openPanel('<div id="quiz-mount"></div>');
  let rewarded = false;
  cleanupMission = startQuiz($('#quiz-mount'), { subject, grade:player.grade, speak:text=>speak(text,subject==='bm'?'ms-MY':'en-MY'), onExit:closePanel,
    onComplete:result=> { if(rewarded)return; rewarded=true; finishActivity(player,result,'A pocketful of discoveries!'); }
  });
}
function avatarMarkup(a = profile().avatar) {
  return `<div class="block-avatar" style="--shirt:${a.shirt};--skin:${a.skin};--hair:${a.hair}"><div class="block-accessory-back ${a.back || 'none'}"></div><div class="block-head"></div><div class="block-hat ${a.hat}"></div><div class="block-accessory-face ${a.face || 'none'}"></div><div class="block-body"></div><div class="block-arm left"></div><div class="block-arm right"></div><div class="block-leg left"></div><div class="block-leg right"></div></div>`;
}
function showAvatar() {
  openPanel(`<section class="panel-content">${heading('ONE OF A KIND','Hello, hero.','Your colours are always free. Find more accessories in the hero shop.')}<button class="shop-banner" id="open-shop">${icon('star')}<span><b>The Hero Shop</b><small>Hats, capes, headphones & more</small></span><span class="coin-icon">H</span><b>${profile().coins}</b>${icon('arrow')}</button><div class="avatar-editor"><div class="avatar-display" id="avatar-preview">${avatarMarkup()}</div><div>${[['shirt','Shirt colour',COLORS.shirts],['skin','Skin tone',COLORS.skins],['hair','Hair colour',COLORS.hairs]].map(([key,label,values])=>`<div class="field-group"><span class="field-label">${label}</span><div class="swatches">${values.map((value,i)=>`<button class="swatch ${profile().avatar[key] === value ? 'selected' : ''}" style="background:${value}" data-style="${key}" data-value="${value}" aria-label="${label} ${i+1}" aria-pressed="${profile().avatar[key] === value}"></button>`).join('')}</div></div>`).join('')}<div class="field-group"><span class="field-label">Finishing touch</span><div class="hat-options">${[['none','Just my hair'],['cap','Everyday cap'],['explorer','Explorer hat']].map(([value,label])=>`<button data-style="hat" data-value="${value}" class="${profile().avatar.hat === value ? 'selected' : ''}" aria-pressed="${profile().avatar.hat === value}">${label}</button>`).join('')}</div></div></div></div><div class="panel-actions"><button class="primary-button" data-close>Ready for adventure ${icon('arrow')}</button><span class="offline-label">Your look saves automatically.</span></div></section>`);
  $('#open-shop').onclick = showShop;
  content.querySelectorAll('[data-style]').forEach(button => { button.onclick = () => {
    profile().avatar[button.dataset.style] = button.dataset.value;
    save(); syncWorld(); $('#avatar-preview').innerHTML = avatarMarkup();
    content.querySelectorAll(`[data-style="${button.dataset.style}"]`).forEach(b => { const chosen = b === button; b.classList.toggle('selected',chosen); b.setAttribute('aria-pressed',String(chosen)); });
  }; });
}
function showShop(selectedId = 'headphones') {
  if (typeof selectedId !== 'string') selectedId = 'headphones';
  const p = profile();
  const item = COSMETICS.find(c=>c.id===selectedId) || COSMETICS[0];
  const owned = p.ownedCosmetics.includes(item.id);
  const equipped = p.avatar[item.slot] === item.value;
  const draft = { ...p.avatar, [item.slot]:item.value };
  openPanel(`<section class="panel-content hero-shop">${heading('EARN IT. WEAR IT. MAKE IT YOU.','The Hero Shop',`You have ${p.coins} Hero Coins. Everything here is bought with coins earned by playing.`)}<div class="shop-showcase"><div class="shop-preview"><span class="preview-label">TRYING IT ON</span>${avatarMarkup(draft)}<span class="preview-floor"></span></div><div class="shop-detail"><span class="subject-tag">${item.slot==='hat'?'HEADWEAR':item.slot==='back'?'ADVENTURE GEAR':'ACCESSORIES'}</span><h3>${item.name}</h3><p>${item.description}</p><span class="shop-price">${owned?`${icon('check')} In your wardrobe`:`<span class="coin-icon">H</span> ${item.cost} coins`}</span><button class="primary-button" id="buy-cosmetic" ${equipped?'disabled':''}>${equipped?'Wearing it':owned?'Wear this':`Buy & wear · ${item.cost}`}</button><p id="shop-feedback" class="shop-feedback" role="status">${!owned&&p.coins<item.cost?`${item.cost-p.coins} more coins to go. You’re getting there!`:'Tap an accessory below to try it on.'}</p></div></div><div class="cosmetic-grid">${COSMETICS.map(c=>`<button class="cosmetic-card ${c.id===item.id?'selected':''}" data-cosmetic="${c.id}" aria-pressed="${c.id===item.id}"><span class="merch-art merch-${c.id}" aria-hidden="true"><i></i></span><b>${c.name}</b><small>${p.ownedCosmetics.includes(c.id)?p.avatar[c.slot]===c.value?'Wearing':'Owned':`${c.cost} coins`}</small></button>`).join('')}</div><div class="shop-footer"><button class="secondary-button" id="shop-play">Play & earn more ${icon('star')}</button><button class="text-button" id="shop-wardrobe">My colours & basic outfits</button></div><div class="wearing-tools"><span>Take off:</span><button class="text-button" data-unequip="hat">Hat</button><button class="text-button" data-unequip="back">Back accessory</button><button class="text-button" data-unequip="face">Glasses</button></div></section>`);
  content.querySelectorAll('[data-cosmetic]').forEach(button=>{button.onclick=()=>showShop(button.dataset.cosmetic);});
  $('#buy-cosmetic').onclick=()=>{
    if(!buyCosmetic(p,item.id)) { $('#shop-feedback').textContent=`You need ${item.cost-p.coins} more coins. Try a quiz or mini-game, then come back.`;return; }
    equipCosmetic(p,item.id);save();syncWorld();chime();showShop(item.id);
    $('#shop-feedback').textContent=`Looking good! Your ${item.name.toLowerCase()} is on your hero.`;
  };
  $('#shop-play').onclick=chooseMission;$('#shop-wardrobe').onclick=showAvatar;
  content.querySelectorAll('[data-unequip]').forEach(button=>{button.onclick=()=>{p.avatar[button.dataset.unequip]='none';save();syncWorld();showShop(item.id);$('#shop-feedback').textContent='Taken off. It is still in your wardrobe.';};});
}
function showProfiles() {
  const parent = account();
  openPanel(`<section class="panel-content">${heading('YOUR OWN ADVENTURE','Who’s exploring?','Each explorer has their own home, coins, and discoveries.')}<button class="shop-banner" id="profiles-cloud">${icon('leaf')}<span><b>${parent ? 'Family cloud save is on' : 'Set up family cloud save'}</b><small>${parent ? escape(parent.email) : 'Keep the island safe across your devices.'}</small></span><span class="cloud-dot ${cloudStatus}"></span>${icon('arrow')}</button><div class="profile-grid">${state.profiles.map(p=>`<button class="profile-choice ${p.id === state.active ? 'selected' : ''}" data-profile="${p.id}" aria-pressed="${p.id === state.active}"><span class="mini-face" aria-hidden="true"><i></i></span><span><b>${escape(p.name)}</b><small>Darjah ${p.grade} · ${p.coins} coins</small></span></button>`).join('')}</div><form id="profile-form"><div class="edit-profile"><label><span class="field-label">Explorer’s nickname</span><input id="nickname" maxlength="24" value="${escape(profile().name)}" required autocomplete="off"></label><label><span class="field-label">School year</span><select id="school-year">${GRADES.map(grade=>`<option value="${grade}" ${profile().grade===grade?'selected':''}>Darjah ${grade}</option>`).join('')}</select></label></div><div class="panel-actions"><button class="primary-button" type="submit">Let’s explore ${icon('arrow')}</button></div></form><p class="copy">Maths instructions are in English, with Malay word help inside each adventure.</p></section>`);
  $('#profiles-cloud').onclick = showCloudAccount;
  content.querySelectorAll('[data-profile]').forEach(button => { button.onclick = () => { state.active = button.dataset.profile; save(); syncWorld(); showProfiles(); }; });
  $('#profile-form').onsubmit = e => { e.preventDefault(); const name = $('#nickname').value.trim(); if (!name) { $('#nickname').setCustomValidity('Give your explorer a nickname.'); $('#nickname').reportValidity(); return; } profile().name = name; profile().grade = Number($('#school-year').value); save(); closePanel(); };
  $('#nickname').oninput = () => $('#nickname').setCustomValidity('');
}
function showCloudAccount() {
  const parent = account();
  if (parent) {
    openPanel(`<section class="panel-content">${heading('FAMILY CLOUD SAVE','Your family account',`Signed in as ${escape(parent.email)}.`)}<div class="account-card"><b>Your children’s island progress is protected</b><small>Coins, avatars, islands and discoveries sync to this parent account. Children do not need an email address or password.</small><p class="cloud-status" id="cloud-status">${cloudStatus === 'syncing' ? 'Saving your latest changes…' : 'Cloud save is up to date.'}</p></div><div class="account-actions"><button class="primary-button" id="cloud-sync">Sync now</button><button class="secondary-button" id="cloud-signout">Sign out on this device</button></div><p class="cloud-note">When this family account is opened on another device, its saved progress replaces that device’s local Hero Islands progress.</p></section>`);
    $('#cloud-sync').onclick = async () => { try { await saveNow(state); $('#cloud-status').textContent = 'Saved to your family cloud.'; toast('Family cloud save is up to date.'); } catch (error) { $('#cloud-status').textContent = error.message; } };
    $('#cloud-signout').onclick = async () => { await signOut(); renderCloudButton(); toast('Signed out. This device keeps its local copy.'); showProfiles(); };
    return;
  }
  openPanel(`<section class="panel-content">${heading('FAMILY CLOUD SAVE','Save your family’s island','One parent email. Separate explorer profiles for your children.')}<div class="account-card"><b>No child account is needed</b><small>We only save the parent email, child nicknames, Darjah, avatars and game progress. We do not ask for a child’s email, real name, photo or location.</small><form id="cloud-login"><label>Parent email<input id="cloud-email" type="email" inputmode="email" autocomplete="email" required placeholder="you@example.com"></label><div class="account-actions"><button class="primary-button" type="submit">Email me a sign-in link</button></div><p class="cloud-status" id="cloud-status" role="status"></p></form></div><p class="cloud-note">The first successful sign-in copies this device’s existing explorer progress into the family cloud. Add your Vercel address to Supabase’s redirect URLs before using this in production.</p></section>`);
  $('#cloud-login').onsubmit = async event => { event.preventDefault(); const status = $('#cloud-status'); const button = event.currentTarget.querySelector('button'); button.disabled = true; status.textContent = 'Sending your secure sign-in link…'; try { await requestMagicLink($('#cloud-email').value.trim()); status.textContent = 'Check your email, then open the sign-in link on this device.'; } catch (error) { status.textContent = error.message; button.disabled = false; } };
}
function showHome() {
  if(panel.open)closePanel();
  activeZone = profile().islandZone || 'home';
  buildMode = true; selectedSlot = null; moveSource = null; placementRotation = 0;
  if (!profile().owned.includes(selectedDecoration)) selectedDecoration = 'flower';
  $('#adventure').classList.add('building');
  $('#build-panel').hidden = false; $('#build-title').hidden = false;
  world?.setPlotZone(activeZone); world?.setPlotMode(true); world?.focus('plot');
  renderHome();
  if(matchMedia('(max-width: 700px)').matches) $('#adventure').scrollIntoView({block:'start',behavior:'instant'});
  else $('#build-panel').scrollIntoView({block:'nearest',behavior:'instant'});
}
function exitBuildMode() {
  if (!buildMode)return;
  buildMode = false; selectedSlot = null; moveSource = null;
  world?.clearPreview(); world?.setSelectedSlot(null); world?.setPlotMode(false); world?.focus('overview');
  $('#adventure').classList.remove('building');
  $('#build-panel').hidden = true; $('#build-title').hidden = true;
  $('#plot-markers')?.remove();
}
function updatePlotMarkers(positions) {
  plotPositions = positions;
  if(!buildMode)return;
  let markers = $('#plot-markers');
  if(markers && (markers.dataset.zone !== activeZone || markers.children.length !== positions.length || positions.some(point=>!markers.querySelector(`[data-slot="${point.slot}"]`)))) { markers.remove(); markers=null; }
  if(!markers) {
    markers = document.createElement('div'); markers.id='plot-markers'; markers.dataset.zone=activeZone;
    $('#world').append(markers);
    for(const {slot} of positions) {
      const button=document.createElement('button'); button.className='world-slot'; button.dataset.slot=slot;
      button.onclick=()=>selectPlotSlot(slot); markers.append(button);
    }
  }
  for(const point of positions) {
    const button=markers.querySelector(`[data-slot="${point.slot}"]`);
    if(!button)continue;
    const item=profile().decorations.find(d=>d.slot===point.slot);
    button.style.left=`${point.x*100}%`; button.style.top=`${point.y*100}%`;
    button.classList.toggle('selected',point.slot===selectedSlot);
    button.classList.toggle('occupied',!!item);
    button.setAttribute('aria-label',`Island spot ${point.slot%6+1}${item?`, ${item.type}`:', empty'}`);
    button.setAttribute('aria-pressed',String(point.slot===selectedSlot));
    button.textContent=point.slot===selectedSlot?'✓':String(point.slot%6+1);
  }
}
function selectPlotSlot(slot) {
  if(!buildMode || slot < ZONES.find(z=>z.id===activeZone).start || slot >= ZONES.find(z=>z.id===activeZone).start+6)return;
  selectedSlot=slot;
  world?.setSelectedSlot(slot); world?.previewDecoration(selectedDecoration,slot,placementRotation,previewLevel());
  renderHome();
}
function tierRefund(item) {
  if(!item)return 0;
  let refund=0;
  for(let level=1;level<(item.level||1);level++)refund+=upgradeCost({type:item.type,level});
  return refund;
}
function previewLevel() {
  const item=profile().decorations.find(d=>d.slot===(moveSource ?? selectedSlot));
  return item?.type===selectedDecoration ? item.level || 1 : 1;
}
function activateZone(id) {
  activeZone=id; profile().islandZone=id;
  selectedSlot=null;moveSource=null;placementRotation=0;plotPositions=[];
  world?.clearPreview();world?.setSelectedSlot(null);world?.setPlotZone(id);world?.focus('plot');
  save();renderHome();
}
function showZoneUnlock(id) {
  const zone=ZONES.find(z=>z.id===id), p=profile();
  openPanel(`<section class="panel-content zone-unlock">${heading('MORE ROOM FOR BIG IDEAS',zone.name,zone.description)}<div class="zone-art zone-unlock-art zone-${id}">${icon(id==='beach'?'sun':id==='forest'?'leaf':'home')}</div><h3>Six more places to make yours</h3><p>Unlock this district once, then build with everything in your collection.</p><div class="reward-badge"><span class="coin-icon">H</span><b>${zone.cost} coins</b></div><p>You have ${p.coins} coins.${p.coins<zone.cost?` Just ${zone.cost-p.coins} more to go.`:''}</p><button class="primary-button" id="unlock-zone" ${p.coins<zone.cost?'disabled':''}>Unlock ${zone.name}</button><div class="success-links"><button class="secondary-button" id="zone-earn">Play & earn</button><button class="secondary-button" id="zone-back">Back to building</button></div></section>`);
  $('#unlock-zone').onclick=()=>{if(!unlockZone(p,id))return;p.islandZone=id;save();chime();showHome();};
  $('#zone-back').onclick=showHome;$('#zone-earn').onclick=chooseMission;
}
function renderHome() {
  const p=profile(), zone=ZONES.find(z=>z.id===activeZone);
  const occupied=p.decorations.find(d=>d.slot===selectedSlot);
  const selected=DECORATIONS.find(d=>d.type===selectedDecoration);
  $('#build-panel').innerHTML=`<div class="build-panel-heading"><div><div class="eyebrow">BUILD MODE</div><h2>Your island studio</h2></div><button id="exit-build" class="icon-button" aria-label="Finish decorating">${icon('close')}</button></div><p class="build-guide">1. Pick an item. 2. Choose a district, then tap a square.<br>3. Preview it, then press <b>Place here</b>.</p><div class="build-wallet"><span class="coin-icon">H</span><b>${p.coins} Hero Coins</b><button id="plot-earn" class="text-button">Earn more</button></div><div class="zone-picker" aria-label="Island districts">${ZONES.map(z=>`<button class="zone-choice ${z.id===activeZone?'selected':''} ${p.unlockedZones.includes(z.id)?'':'locked'}" data-zone="${z.id}" aria-pressed="${z.id===activeZone}">${icon(z.id==='beach'?'sun':z.id==='forest'?'leaf':z.id==='village'?'flag':'home')}<b>${z.name}</b><small>${p.unlockedZones.includes(z.id)?`${p.decorations.filter(d=>d.slot>=z.start&&d.slot<z.start+6).length}/6 spots built`:`Unlock · ${z.cost} coins`}</small></button>`).join('')}</div><h3 class="district-title">${zone.name}</h3><div class="home-grid">${DECORATIONS.map(d=>`<button class="decor-card ${selectedDecoration===d.type?'selected':''}" data-decor="${d.type}" aria-pressed="${selectedDecoration===d.type}"><span class="decor-mini decor-${d.type}" aria-hidden="true"></span><b>${d.name}</b><small>${p.owned.includes(d.type)?'Unlocked':`${d.cost} coins to unlock`}</small></button>`).join('')}</div><div class="placement-info" role="status"><b>${selectedSlot===null?'Tap a numbered island square':`Previewing spot ${selectedSlot%6+1}`}</b><span>${moveSource!==null?`Moving your ${selected.name.toLowerCase()} from spot ${moveSource%6+1}.`:selected.description}</span></div><div class="build-actions"><button class="primary-button" id="place-item" ${selectedSlot===null?'disabled':''}>${p.owned.includes(selectedDecoration)?'Place here':`Unlock & place · ${selected.cost}`} ${icon('check')}</button><button class="secondary-button" id="rotate-item" ${selectedSlot===null?'disabled':''} aria-label="Rotate item 90 degrees">Rotate</button></div>${occupied?`<div class="upgrade-item"><span>${DECORATIONS.find(d=>d.type===occupied.type).name} · Tier ${occupied.level||1}/3</span><button class="secondary-button" id="upgrade-item" ${(occupied.level||1)>=3?'disabled':''}>${(occupied.level||1)>=3?'Fully upgraded':`Upgrade · ${upgradeCost(occupied)} coins`}</button><small>Higher tiers add a golden base and stars. Putting away or replacing an item refunds its upgrade coins.</small></div>`:''}<div class="plot-management"><button class="text-button" id="move-item" ${!occupied?'disabled':''}>Move existing item</button><button class="text-button" id="remove-item" ${!occupied?'disabled':''}>Put existing item away</button></div>${!world?'<p class="copy">3D is unavailable here. Choose an island square below.</p><div class="fallback-slots">'+Array.from({length:6},(_,i)=>`<button class="secondary-button" data-fallback-slot="${zone.start+i}">Spot ${i+1}</button>`).join('')+'</div>':''}<button class="text-button" id="build-done">Done · see my island</button>`;
  $('#exit-build').onclick=exitBuildMode; $('#build-done').onclick=exitBuildMode; $('#plot-earn').onclick=chooseMission;
  $('#build-panel').querySelectorAll('[data-zone]').forEach(button=>{button.onclick=()=>p.unlockedZones.includes(button.dataset.zone)?activateZone(button.dataset.zone):showZoneUnlock(button.dataset.zone);});
  if(occupied)$('#upgrade-item').onclick=()=>{if(!upgradeDecoration(p,selectedSlot)){toast(`You need ${upgradeCost(occupied)-p.coins} more coins to upgrade.`);return;}save();syncWorld();world?.clearPreview();chime();renderHome();};
  $('#build-panel').querySelectorAll('[data-decor]').forEach(button=>{button.onclick=()=>{
    selectedDecoration=button.dataset.decor; moveSource=null; placementRotation=0;
    if(selectedSlot!==null)world?.previewDecoration(selectedDecoration,selectedSlot,placementRotation,previewLevel());
    renderHome();
  };});
  $('#build-panel').querySelectorAll('[data-fallback-slot]').forEach(button=>{button.onclick=()=>selectPlotSlot(Number(button.dataset.fallbackSlot));});
  $('#place-item').onclick=()=>{
    if(selectedSlot===null)return;
    if(!buyDecoration(p,selectedDecoration)) { toast(`You need ${selected.cost-p.coins} more coins. Play a game to earn them.`);return; }
    const level=previewLevel();
    const replaced=occupied && (moveSource!==null ? moveSource!==selectedSlot : occupied.type!==selectedDecoration);
    const refund=replaced ? tierRefund(occupied) : 0;
    p.coins+=refund;
    p.decorations=p.decorations.filter(d=>d.slot!==selectedSlot && d.slot!==moveSource);
    p.decorations.push({type:selectedDecoration,slot:selectedSlot,rotation:placementRotation,level});
    moveSource=null; save(); syncWorld(); world?.clearPreview(); renderHome();
    if(refund)toast(`${refund} upgrade coins returned from the replaced item.`);
    $('#build-panel .placement-info').innerHTML=`<b>Placed in spot ${selectedSlot%6+1}!</b><span>There it is, right on your island. You can move it anytime.</span>`;
  };
  $('#rotate-item').onclick=()=>{placementRotation=(placementRotation+1)%4;world?.previewDecoration(selectedDecoration,selectedSlot,placementRotation,previewLevel());};
  $('#move-item').onclick=()=>{ if(!occupied)return; moveSource=occupied.slot;selectedDecoration=occupied.type;placementRotation=occupied.rotation||0;selectedSlot=null;world?.clearPreview();world?.setSelectedSlot(null);renderHome();};
  $('#remove-item').onclick=()=>{const refund=tierRefund(occupied);p.coins+=refund;p.decorations=p.decorations.filter(d=>d.slot!==selectedSlot);moveSource=null;save();syncWorld();world?.clearPreview();renderHome();if(refund)toast(`${refund} upgrade coins returned. Your item stays unlocked.`);};
  updatePlotMarkers(world?.getPlotPositions() || plotPositions);
}
function showJournal() {
  const p = profile(); const current = p.sessions.filter(s=>s.grade===p.grade);
  openPanel(`<section class="panel-content">${heading('SMALL STEPS, BIG DISCOVERIES','Look how far you’ve come.',`Your Darjah ${p.grade} practice journal. Every try teaches you something.`)}<div class="journal-stats"><div class="journal-stat"><b>${current.length}</b><small>Practice sessions</small></div><div class="journal-stat"><b>${current.reduce((a,s)=>a+s.independent,0)}</b><small>Independent rounds</small></div><div class="journal-stat"><b>${p.decorations.length}</b><small>Island creations</small></div></div>${current.length ? current.slice(-6).reverse().map(s=>`<div class="journal-row">${icon(s.type==='quiz'?'book':activityIcons[s.type])}<span><b>${s.type==='quiz'?`${SUBJECTS[s.subject]} quiz`:ACTIVITIES[s.type]}</b><small>${s.independent} of ${s.rounds || 3} rounds without hints or retries · Darjah ${s.grade}</small></span></div>`).join('') : `<p class="copy">Your first discovery is waiting. Build a bridge or help at the pasar, and your practice will appear here.</p>`}<p class="copy">This is a record of practice, not a school grade. Try a new problem together away from the screen to see what stuck.</p><button class="primary-button" id="journal-play">Find an adventure ${icon('arrow')}</button></section>`);
  $('#journal-play').onclick = chooseMission;
}
function showParents(e) {
  e?.preventDefault();
  openPanel(`<section class="panel-content">${heading('FOR GROWN-UPS','Made for curious minds.','A first playable chapter, built around learning by doing.')}<div class="parent-details"><p>Maths adventures and quizzes are available for Darjah 1–6, with English instructions for DLP learners. Selected skills progress from composing numbers to measurements, fractions, decimal money, ratios and discounts.</p><ul><li>Three rounds per adventure. No time limit, lost lives, or daily streak pressure.</li><li>Hints and retries help children learn. The journal distinguishes independent rounds.</li><li>Completed mini-games earn 15 Hero Coins, plus 15 on the first completion. Five-question quizzes earn 10–25 coins. Replays always earn coins; unfinished runs do not.</li><li>A parent may turn on cloud save with an email magic link. Children use explorer profiles and do not need email accounts.</li><li>This chapter covers selected skills. It is not a complete or formally certified KSSR curriculum.</li></ul><p>After a mission, ask: “Can you show me another way?” Later, try a fresh example with real objects.</p><p>Maths and Science quizzes are in English. BM and English quizzes also join the club. Science Lab adds material investigations. Time Detectives practises chronology with labelled fictional stories and Malaysian milestones. Island Navigator develops directions and map planning on fictional islands. History and geography are enrichment, not complete school subject coverage. All six years have selected practice activities. A school-year label is a starting difficulty, not a complete syllabus or mastery assessment. Your existing Maths, Science, BM, and English quizzes remain in <a href="./classic.html">Math Hero Classic</a>.</p><p id="offline-status">The island can be revisited offline after its files have been saved.</p></div><div class="panel-actions"><button class="secondary-button" id="export-save">Back up progress</button><button class="primary-button" data-close>Back to the island</button></div></section>`);
  $('#export-save').onclick = () => { const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href=url; link.download=`hero-islands-progress-${new Date().toISOString().slice(0,10)}.json`; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); toast('Progress backup downloaded.'); };
}
$('#profile-button').onclick = showProfiles;
$('#cloud-button').onclick = showCloudAccount;
$('#start-quest').onclick = () => launchMission(selectedMission);
$('#choose-mission').onclick = chooseMission;
$('#choose-mission').textContent = 'All games & quizzes · earn more coins';
$('#nav-island').onclick = () => { closePanel(); exitBuildMode(); world?.focus('overview'); };
$('#nav-play').onclick = chooseMission;
$('#earn-coins').onclick = chooseMission;
$('#nav-avatar').onclick = showShop;
$('#nav-home').onclick = showHome;
$('#nav-journal').onclick = showJournal;
$('#parent-button').onclick = showParents;
$('#how-to-play').onclick = showHowToPlay;
$('#sound-button').onclick = () => { state.sound = !state.sound; if (!state.sound && 'speechSynthesis' in window) speechSynthesis.cancel(); save(); toast(state.sound ? 'Sound on. Tap “Listen” inside an adventure.' : 'Sound off. A little quiet time.'); };
document.querySelectorAll('[data-location]').forEach(button=>{ button.onclick=()=>{ const location=button.dataset.location; if(location==='home') return showHome(); if(location==='bridge'||location==='market'){selectedMission=location;updateQuest();world?.focus(location);return launchMission(location);} launchActivity(location); }; });
updateHeader();
renderCloudButton();
async function bootCloud() {
  const parent = await restoreSession();
  renderCloudButton();
  if (!parent) return;
  try {
    const remote = await loadSave();
    if (remote?.state) {
      state = normalizeState(remote.state);
      save(); syncWorld();
      toast('Your family cloud progress is ready on this device.');
    } else {
      await saveNow(state);
      toast('This device’s explorer progress is now saved to your family cloud.');
    }
  } catch (error) {
    cloudStatus = 'error'; renderCloudButton();
    console.warn('Cloud save unavailable:', error);
  }
}
bootCloud();
async function bootWorld() {
  try {
    const { createWorld } = await import('./world.js');
    world = createWorld($('#world'),{ reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      onPlotSlot: selectPlotSlot, onPlotUpdate: updatePlotMarkers,
      onSelect: location => { if(panel.open || buildMode)return; if(location==='home')showHome(); else launchMission(location); } });
    $('.world-loading')?.remove(); syncWorld(); world.setPaused(panel.open);
    if(buildMode){world.setPlotZone(activeZone);world.setPlotMode(true);world.focus('plot');renderHome();}
    if (!hasSeenGuide()) showHowToPlay();
  } catch (error) {
    console.warn('3D island unavailable:',error);
    $('#world').innerHTML = `<div class="fallback-world">${icon('map')}<h2>Your adventures are ready.</h2><p>This browser cannot show the 3D island. You can still play both Maths adventures using the buttons below.</p></div>`;
    if (!hasSeenGuide()) showHowToPlay();
  }
}
bootWorld();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(()=>{ /* Online play still works without offline storage. */ });
}

