#!/usr/bin/env node
/**
 * Math Hero avatar inventory + render smoke QA.
 * Usage (repo root): node scripts/avatar-qa.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ITEMS_PATH = path.join(ROOT, 'data', 'items.js');
const BODIES_PATH = path.join(ROOT, 'data', 'bodies.js');
const REPORT_MD = path.join(ROOT, 'docs', 'plans', 'avatar-qa-report.md');

function loadScripts() {
  const context = { console, window: {} };
  vm.createContext(context);
  const itemsSrc = fs.readFileSync(ITEMS_PATH, 'utf8');
  const bodiesSrc = fs.readFileSync(BODIES_PATH, 'utf8');
  vm.runInContext(
    itemsSrc +
      '\nthis.ITEMS = typeof ITEMS !== "undefined" ? ITEMS : this.ITEMS;' +
      '\nthis.getItem = typeof getItem === "function" ? getItem : null;' +
      '\nthis.itemImg = typeof itemImg === "function" ? itemImg : null;',
    context,
  );
  vm.runInContext(
    bodiesSrc +
      '\nthis.BODIES_DATA = typeof BODIES_DATA !== "undefined" ? BODIES_DATA : this.BODIES_DATA;' +
      '\nthis.renderAvatar = typeof renderAvatar === "function" ? renderAvatar : null;' +
      '\nthis.AVATAR_LAYER_RECTS = typeof AVATAR_LAYER_RECTS !== "undefined" ? AVATAR_LAYER_RECTS : null;' +
      '\nthis.getBody = typeof getBody === "function" ? getBody : null;',
    context,
  );
  return context;
}

function inventory(context) {
  const ITEMS = context.ITEMS;
  const slots = (ITEMS.meta && ITEMS.meta.slots) || [];
  const counts = {};
  const missing = [];
  const noImg = [];
  let total = 0;

  for (const slot of slots) {
    const arr = ITEMS[slot] || [];
    counts[slot] = arr.length;
    total += arr.length;
    for (const it of arr) {
      if (!it.img) {
        noImg.push({ slot, id: it.id });
        continue;
      }
      const abs = path.join(ROOT, it.img);
      if (!fs.existsSync(abs)) missing.push({ slot, id: it.id, img: it.img });
    }
  }

  const rectKeys = Object.keys(context.AVATAR_LAYER_RECTS || {});
  const slotsWithoutRects = slots.filter((s) => !rectKeys.includes(s));
  const rectsWithoutSlots = rectKeys.filter((s) => !slots.includes(s));

  return {
    total,
    counts,
    missing,
    noImg,
    slots,
    rectKeys,
    slotsWithoutRects,
    rectsWithoutSlots,
  };
}

function sampleLoadout(ITEMS) {
  const pick = (slot) => {
    const arr = ITEMS[slot] || [];
    return arr.length ? arr[0].id : null;
  };
  return {
    background: pick('background'),
    cape: pick('cape'),
    pet: pick('pet'),
    pants: pick('pants'),
    top: pick('top'),
    shoes: pick('shoes'),
    hand: pick('hand'),
    face: pick('face'),
    hair: pick('hair'),
    headgear: pick('headgear'),
    glasses: pick('glasses'),
    accessory: pick('accessory'),
  };
}

function renderSmoke(context) {
  const bodies = Object.keys(context.BODIES_DATA || {}).filter(
    (k) => k !== 'meta',
  );
  const loadout = sampleLoadout(context.ITEMS);
  const results = [];
  for (const bodyId of bodies) {
    const svg = context.renderAvatar(bodyId, loadout);
    const images = (svg.match(/<image /g) || []).length;
    const hasBody = /<(path|ellipse|circle|rect|g)\b/.test(svg);
    const ok = Boolean(
      svg && images > 0 && hasBody && svg.includes('avatar-svg'),
    );
    results.push({
      bodyId,
      ok,
      images,
      hasBody,
      svgBytes: svg ? svg.length : 0,
    });
  }
  return { loadout, results };
}

function main() {
  const context = loadScripts();
  if (!context.ITEMS || !context.renderAvatar) {
    console.error('Failed to load ITEMS/renderAvatar');
    process.exit(1);
  }

  const inv = inventory(context);
  const smoke = renderSmoke(context);
  const smokeFail = smoke.results.filter((r) => !r.ok);

  const summary = {
    ok:
      inv.missing.length === 0 &&
      inv.slotsWithoutRects.length === 0 &&
      smokeFail.length === 0,
    totalItems: inv.total,
    slotCounts: inv.counts,
    missingAssets: inv.missing,
    slotsWithoutRects: inv.slotsWithoutRects,
    smoke: smoke.results,
    loadout: smoke.loadout,
  };

  const md = [
    '# Avatar QA Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `**Overall OK:** ${summary.ok}`,
    `**Total items:** ${inv.total}`,
    '',
    '## Slot counts',
    '',
    ...Object.entries(inv.counts).map(([k, v]) => `- ${k}: ${v}`),
    '',
    '## Coverage',
    '',
    `- meta.slots: ${inv.slots.join(', ')}`,
    `- AVATAR_LAYER_RECTS: ${inv.rectKeys.join(', ')}`,
    `- slots without rects: ${inv.slotsWithoutRects.length ? inv.slotsWithoutRects.join(', ') : '(none)'}`,
    `- missing assets: ${inv.missing.length}`,
    '',
    '## Render smoke (first-item full loadout)',
    '',
    ...smoke.results.map(
      (r) =>
        `- ${r.bodyId}: ${r.ok ? 'OK' : 'FAIL'} images=${r.images} body=${r.hasBody} bytes=${r.svgBytes}`,
    ),
    '',
    '## Sample loadout',
    '',
    '```json',
    JSON.stringify(smoke.loadout, null, 2),
    '```',
    '',
    '## Issues still open (manual)',
    '',
    '1. No body silhouette clipPath for top/pants',
    '2. Shared anchors across 6 bodies (dragon/unicorn headgear collisions)',
    '3. No hair-front layer',
    '4. Browser visual QA still required',
    '5. Per-item rect overrides may be incomplete for tall hats/hair',
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(REPORT_MD), { recursive: true });
  fs.writeFileSync(REPORT_MD, md);
  console.log(JSON.stringify(summary, null, 2));
  console.log('Wrote', REPORT_MD);
  process.exit(summary.ok ? 0 : 2);
}

main();
