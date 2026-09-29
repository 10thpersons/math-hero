const PETS = ['cat','rabbit','turtle','robot','hornbill','dragon'];
const BOAT_ART = '<svg viewBox="0 0 70 90"><ellipse cx="35" cy="77" rx="26" ry="9" fill="#b6fff1"/><path d="M35 4Q69 35 51 75H19Q1 35 35 4" fill="#e3a356" stroke="#825837" stroke-width="3"/><path d="M35 13Q53 36 45 64H25Q17 36 35 13" fill="#fff1c3"/><circle cx="35" cy="40" r="10" fill="#f3c6a0"/><path d="M24 39Q25 23 36 28Q46 28 46 39" fill="#2e6e58"/><path d="M9 46L62 59" stroke="#855534" stroke-width="5"/></svg>';
const PALM_ART = '<svg viewBox="0 0 60 100"><path d="M30 100Q43 60 28 30" fill="none" stroke="#aa8152" stroke-width="9"/><path d="M28 32Q0 0 0 40Q16 22 28 32M28 32Q30 0 48 0Q39 16 28 32M28 32Q61 12 60 47Q43 26 28 32M28 32Q8 32 8 60Q20 43 28 32" fill="#4e845e"/></svg>';
const CLOUD_ART = '<svg viewBox="0 0 80 60"><path d="M18 48C-1 48 0 22 19 24C20 2 54 0 58 24C80 20 86 48 63 48Z" fill="#b9d9c3"/></svg>';
const FLAG_ART = '<svg viewBox="0 0 60 70"><path d="M13 63V8" stroke="#45765c" stroke-width="5"/><path d="M16 8H51L40 23L51 38H16Z" fill="#edbd65"/></svg>';

/** Mount a self-contained play break. Scores never award learning coins. */
export function startArcade(container, {type = 'pet', pet = 'cat', onComplete = () => {}, onExit = () => {}} = {}) {
  const boat = type === 'boat';
  type = boat ? 'boat' : 'pet';
  const requestedPet = typeof pet === 'string' ? pet : pet?.id;
  const petId = PETS.includes(requestedPet) ? requestedPet : 'cat';
  const companion = `<span class="pet-art pet-${petId}" aria-hidden="true"><i class="pet-tail"></i><i class="pet-body"></i><i class="pet-ears"></i><i class="pet-head"><i class="pet-eyes"></i><i class="pet-nose"></i></i><i class="pet-feet"></i></span>`;
  container.innerHTML = `<section class="arcade-game ${boat ? 'arcade-boat' : 'arcade-pet'}" aria-label="${boat ? 'Rimba Boat Dash' : 'Pet Playground'}">
    <div class="arcade-heading"><div><span class="arcade-kicker">PLAY A LITTLE · BREATHE A LITTLE</span><h3>${boat ? 'Rimba Boat Dash' : 'Pet Playground'}</h3></div><button class="arcade-leave" type="button">Exit game</button></div>
    <div class="arcade-hud"><span>★ <b data-score>0</b> points</span><span>◷ <b data-time>45</b>s</span><button type="button" data-pause disabled>Pause</button></div>
    <div class="arcade-stage" tabindex="0" aria-label="${boat ? 'Move left and right to collect stars and avoid rocks.' : 'Jump over logs and collect stars.'}">
      <div class="arcade-scenery" aria-hidden="true">${boat ? `<i></i><i></i><i></i><span class="arcade-shore shore-left">${PALM_ART}</span><span class="arcade-shore shore-right">${PALM_ART}</span>` : '<span class="arcade-sun"></span><span class="arcade-cloud cloud-one"></span><span class="arcade-cloud cloud-two"></span><span class="arcade-hill"></span><span class="arcade-ground"></span>'}</div>
      <div class="arcade-objects" aria-hidden="true"></div>
      <div class="arcade-player" aria-hidden="true">${boat ? BOAT_ART : `<span>${companion}</span>`}</div>
      <div class="arcade-overlay"><div class="arcade-intro-art" aria-hidden="true">${boat ? BOAT_ART : companion}</div><h3>${boat ? 'A little river adventure' : 'Ready, little buddy?'}</h3><p>${boat ? 'Collect golden stars. Steer around the rocks with ← → or the buttons below.' : 'Collect golden stars. Hop over logs with Space, ↑ or the jump button.'}</p><p class="arcade-gentle">45 seconds. Bumps cost 10 points, never coins.</p><button class="primary-button" type="button" data-start>Let’s play</button></div>
    </div>
    <p class="arcade-feedback" role="status" aria-live="polite">${boat ? 'Find your flow on the river.' : 'Your companion is ready for a play break.'}</p>
    <div class="arcade-controls">${boat ? '<button type="button" data-move="-1" aria-label="Steer left">← Left</button><button type="button" data-move="1" aria-label="Steer right">Right →</button>' : '<button type="button" data-jump>↑ Jump!</button>'}</div>
    <p class="arcade-footnote">Playground points are for personal bests. Learning coins stay with learning adventures.</p>
  </section>`;
  const root = container.querySelector('.arcade-game');
  const stage = root.querySelector('.arcade-stage');
  const overlay = root.querySelector('.arcade-overlay');
  const player = root.querySelector('.arcade-player');
  const objects = root.querySelector('.arcade-objects');
  const pauseButton = root.querySelector('[data-pause]');
  const feedback = root.querySelector('.arcade-feedback');
  const controller = new AbortController();
  const listen = (node, event, fn) => node.addEventListener(event, fn, {signal:controller.signal});
  let mode = 'ready', elapsed = 0, score = 0, lane = 1, jump = 0, velocity = 0;
  let lastTime = 0, nextSpawn = .5, spawnCount = 0, invulnerable = 0, frame = 0, completed = false;
  const items = [];
  const message = text => { feedback.textContent = text; };
  function cleanup() { mode = 'disposed'; cancelAnimationFrame(frame); controller.abort(); }
  function exit() { cleanup(); onExit(); }
  function draw() {
    player.style.left = `${boat ? 25 + lane * 25 : 20}%`;
    player.style.bottom = `${boat ? 12 : 17 + jump}%`;
    player.classList.toggle('arcade-bump', invulnerable > 0);
    for (const item of items) {
      item.node.style.left = `${item.x}%`;
      item.node.style.bottom = `${item.y}%`;
    }
  }
  function setPaused(paused) {
    if (!['playing','paused'].includes(mode)) return;
    mode = paused ? 'paused' : 'playing';
    pauseButton.textContent = paused ? 'Resume' : 'Pause';
    if (paused) {
      overlay.innerHTML = `<div class="arcade-intro-art" aria-hidden="true">${CLOUD_ART}</div><h3>A little breather</h3><p>Your timer is paused. Resume whenever you’re ready.</p><button type="button" class="primary-button" data-resume>Keep playing</button>`;
      overlay.hidden = false;
      listen(overlay.querySelector('[data-resume]'), 'click', () => setPaused(false));
    } else { overlay.hidden = true; stage.focus({preventScroll:true}); }
  }
  function finish() {
    if (completed || mode !== 'playing') return;
    completed = true; mode = 'finished'; pauseButton.disabled = true;
    overlay.hidden = false;
    overlay.innerHTML = `<div class="arcade-intro-art" aria-hidden="true">${FLAG_ART}</div><h3>Lovely adventure!</h3><p class="arcade-final-score">${score} points</p><p>Your play break is complete.</p><button type="button" class="primary-button" data-done>Back to playground</button>`;
    listen(overlay.querySelector('[data-done]'), 'click', exit);
    message('Round complete. Well played!');
    onComplete({type,score});
  }
  function move(direction) { if (mode === 'playing') lane = Math.max(0,Math.min(2,lane + direction)); }
  function hop() { if (mode === 'playing' && jump <= 0) velocity = 69; }
  function spawn() {
    // A fixed course makes personal bests comparable without random unfair traps.
    const n = spawnCount++;
    const star = n % 3 !== 2;
    const item = {star, x:boat ? 25 + ((n * 2 + Math.floor(n / 5)) % 3) * 25 : 108, y:boat ? 110 : star ? 35 : 17, node:document.createElement('span')};
    item.node.className = `arcade-object ${star ? 'arcade-star' : boat ? 'arcade-rock' : 'arcade-log'}`;
    item.node.innerHTML = star ? '★' : boat ? '<svg viewBox="0 0 48 42"><path d="M3 30L12 8L31 3L46 24L38 38H10Z" fill="#718681"/><path d="M12 8L31 3L25 25L3 30Z" fill="#9daaa0"/><path d="M25 25L46 24L38 38Z" fill="#526b65"/></svg>' : '<svg viewBox="0 0 58 36"><path d="M12 4H45Q58 18 45 32H12Z" fill="#a1744d"/><ellipse cx="12" cy="18" rx="10" ry="14" fill="#efc88c"/><ellipse cx="12" cy="18" rx="5" ry="8" fill="none" stroke="#bc905f" stroke-width="2"/><path d="M26 10H43M24 26H44" stroke="#805b3f" stroke-width="3"/></svg>';
    objects.append(item.node); items.push(item);
  }
  function tick(time) {
    if (mode === 'disposed') return;
    const dt = Math.min((time - (lastTime || time)) / 1000,.05); lastTime = time;
    if (mode === 'playing') {
      elapsed = Math.min(45,elapsed + dt);
      root.querySelector('[data-time]').textContent = String(Math.ceil(45 - elapsed));
      invulnerable = Math.max(0, invulnerable - dt);
      if (!boat) { velocity -= 170 * dt; jump = Math.max(0,jump + velocity * dt); if (!jump) velocity = 0; }
      if (elapsed >= nextSpawn) { spawn(); nextSpawn += 1.25; }
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (boat) item.y -= 39 * dt; else item.x -= 35 * dt;
        const hit = boat ? Math.abs(item.x - (25 + lane * 25)) < 10 && Math.abs(item.y - 12) < 7 : Math.abs(item.x - 20) < 7 && Math.abs(item.y - (17 + jump)) < (item.star ? 12 : 9);
        if (hit && (item.star || !invulnerable)) {
          if (item.star) { score = Math.min(1000,score + 40); root.querySelector('[data-score]').textContent = String(score); message('Star collected!'); }
          else { invulnerable = 1; score = Math.max(0,score - 10); root.querySelector('[data-score]').textContent = String(score); message(boat ? 'Bump! −10 points. Try another lane.' : 'A log! −10 points. Jump a little earlier.'); }
          item.node.remove(); items.splice(i,1);
        } else if (item.x < -12 || item.y < -12) { item.node.remove(); items.splice(i,1); }
      }
      draw();
      if (elapsed >= 45) finish();
    }
    if (mode !== 'disposed' && mode !== 'finished') frame = requestAnimationFrame(tick);
  }
  listen(root.querySelector('.arcade-leave'),'click',exit);
  listen(root.querySelector('[data-start]'),'click',() => { if(mode !== 'ready') return; mode = 'playing'; overlay.hidden = true; pauseButton.disabled = false; stage.focus({preventScroll:true}); message(boat ? 'Collect stars and dodge rocks!' : 'Jump for stars and hop over logs!'); });
  listen(pauseButton,'click',() => setPaused(mode === 'playing'));
  root.querySelectorAll('[data-move]').forEach(button => listen(button,'click',() => move(Number(button.dataset.move))));
  if (!boat) listen(root.querySelector('[data-jump]'),'click',hop);
  listen(root,'keydown',event => {
    if (!['ArrowLeft','ArrowRight','ArrowUp',' ','Escape'].includes(event.key)) return;
    if (event.target.tagName === 'BUTTON' && event.key === ' ') return;
    event.preventDefault();
    if (event.repeat) return;
    if (event.key === 'Escape') { event.stopPropagation(); setPaused(mode === 'playing'); }
    if (boat && event.key === 'ArrowLeft') move(-1);
    if (boat && event.key === 'ArrowRight') move(1);
    if (!boat && ['ArrowUp',' '].includes(event.key)) hop();
  });
  listen(document,'visibilitychange',() => { if (document.hidden && mode === 'playing') setPaused(true); });
  draw(); frame = requestAnimationFrame(tick);
  return cleanup;
}
