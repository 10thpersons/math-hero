// Math Hero — Body Catalog
// 6 chibi creatures for the RPG hero system
// Each body is a self-contained <svg viewBox="0 0 200 200">
// Layer order (back → front): tail → legs → body → arms → head → ears/horns → face
//
// Anchor points for items (designed in items.js):
//   - Background: full 200x200
//   - Cape:       y=110-180  (drapes from shoulders, behind body)
//   - Top:        y=100-170  (covers body torso)
//   - Hand:       (140, 110) (right hand)
//   - Pet:        (50, 170)  (bottom-left, beside feet)
//   - Headgear:   y=20-75    (on top of head)

const BODIES_DATA = {
  meta: {
    version: 1,
    count: 6,
    canvas: { w: 200, h: 200, centerX: 100, centerY: 100 }
  },

  // Each body has: id, emoji, name (BM), name_en, cls (BM), icon, primaryColor, svg
  fox: {
    id: 'fox', emoji: '🦊',
    name: 'Rubah Knight', cls: 'Kesatria', icon: '⚔️',
    primaryColor: '#f97316', secondaryColor: '#dc2626', accentColor: '#fff',
    svg: bodyFox()
  },

  cat: {
    id: 'cat', emoji: '🐱',
    name: 'Kucing Mage', cls: 'Ahli Sihir', icon: '🪄',
    primaryColor: '#fb923c', secondaryColor: '#c2410c', accentColor: '#fff',
    svg: bodyCat()
  },

  panda: {
    id: 'panda', emoji: '🐼',
    name: 'Panda Biksu', cls: 'Biksu', icon: '☯️',
    primaryColor: '#1f2937', secondaryColor: '#000', accentColor: '#fff',
    svg: bodyPanda()
  },

  tiger: {
    id: 'tiger', emoji: '🐯',
    name: 'Harimau Pejuang', cls: 'Pejuang', icon: '🗡️',
    primaryColor: '#fb923c', secondaryColor: '#1f2937', accentColor: '#fff',
    svg: bodyTiger()
  },

  dragon: {
    id: 'dragon', emoji: '🐉',
    name: 'Naga Kecil', cls: 'Mistik', icon: '🔥',
    primaryColor: '#10b981', secondaryColor: '#047857', accentColor: '#fef3c7',
    svg: bodyDragon()
  },

  unicorn: {
    id: 'unicorn', emoji: '🦄',
    name: 'Unicorn Penyembuh', cls: 'Penyembuh', icon: '💖',
    primaryColor: '#fff', secondaryColor: '#fce7f3', accentColor: '#ec4899',
    svg: bodyUnicorn()
  }
};

// Helper: get body by id (with full info)
function getBody(id) {
  return BODIES_DATA[id] || null;
}

// Helper: render an equipped avatar (body + items layered)
function renderAvatar(bodyId, equipped) {
  const body = getBody(bodyId);
  if (!body) return '';
  // Layer order: bg → cape → body → top → pet → headgear → hand
  const parts = [];
  if (equipped && equipped.background) {
    const it = getItem('background', equipped.background);
    if (it) parts.push(it.svg);
  }
  if (equipped && equipped.cape) {
    const it = getItem('cape', equipped.cape);
    if (it) parts.push(it.svg);
  }
  parts.push(body.svg);
  if (equipped && equipped.top) {
    const it = getItem('top', equipped.top);
    if (it) parts.push(it.svg);
  }
  if (equipped && equipped.pet) {
    const it = getItem('pet', equipped.pet);
    if (it) parts.push(it.svg);
  }
  if (equipped && equipped.headgear) {
    const it = getItem('headgear', equipped.headgear);
    if (it) parts.push(it.svg);
  }
  if (equipped && equipped.hand) {
    const it = getItem('hand', equipped.hand);
    if (it) parts.push(it.svg);
  }
  return `<svg viewBox="0 0 200 200" class="avatar-svg">${parts.join('')}</svg>`;
}

// ============================================================
// SVG FACTORY FUNCTIONS — one per creature
// ============================================================

function bodyFox() {
  return `
    <!-- tail -->
    <path d="M55,130 Q30,140 35,160 Q50,155 60,140 Z" fill="#f97316"/>
    <path d="M55,130 Q30,140 35,160 Q50,155 60,140 Z" fill="none" stroke="#dc2626" stroke-width="1"/>
    <ellipse cx="32" cy="158" rx="6" ry="5" fill="#fff"/>
    <!-- legs -->
    <ellipse cx="80" cy="180" rx="8" ry="6" fill="#f97316"/>
    <ellipse cx="120" cy="180" rx="8" ry="6" fill="#f97316"/>
    <!-- body -->
    <ellipse cx="100" cy="140" rx="32" ry="30" fill="#f97316"/>
    <ellipse cx="100" cy="148" rx="20" ry="18" fill="#fff"/>
    <!-- arms -->
    <ellipse cx="68" cy="135" rx="9" ry="18" fill="#f97316" transform="rotate(-15 68 135)"/>
    <ellipse cx="132" cy="135" rx="9" ry="18" fill="#f97316" transform="rotate(15 132 135)"/>
    <!-- head -->
    <circle cx="100" cy="80" r="32" fill="#f97316"/>
    <!-- face -->
    <path d="M82,75 Q88,72 92,75 L92,80 Q88,77 82,80 Z" fill="#fff"/>
    <path d="M118,75 Q112,72 108,75 L108,80 Q112,77 118,80 Z" fill="#fff"/>
    <circle cx="88" cy="83" r="3" fill="#1f2937"/>
    <circle cx="112" cy="83" r="3" fill="#1f2937"/>
    <circle cx="89" cy="82" r="1" fill="#fff"/>
    <circle cx="113" cy="82" r="1" fill="#fff"/>
    <ellipse cx="100" cy="92" rx="3" ry="2" fill="#1f2937"/>
    <path d="M97,97 Q100,100 103,97" stroke="#1f2937" stroke-width="1.2" fill="none"/>
    <!-- ears -->
    <polygon points="72,55 78,30 88,52" fill="#f97316"/>
    <polygon points="72,55 78,30 88,52" fill="none" stroke="#dc2626" stroke-width="1"/>
    <polygon points="128,55 122,30 112,52" fill="#f97316"/>
    <polygon points="128,55 122,30 112,52" fill="none" stroke="#dc2626" stroke-width="1"/>
    <polygon points="76,52 78,38 84,50" fill="#fff"/>
    <polygon points="124,52 122,38 116,50" fill="#fff"/>
  `;
}

function bodyCat() {
  return `
    <!-- tail -->
    <path d="M55,135 Q25,145 30,170 Q45,160 60,145" fill="none" stroke="#fb923c" stroke-width="9" stroke-linecap="round"/>
    <!-- legs -->
    <ellipse cx="80" cy="180" rx="8" ry="6" fill="#fb923c"/>
    <ellipse cx="120" cy="180" rx="8" ry="6" fill="#fb923c"/>
    <!-- body -->
    <ellipse cx="100" cy="140" rx="30" ry="28" fill="#fb923c"/>
    <!-- arms -->
    <ellipse cx="68" cy="135" rx="9" ry="17" fill="#fb923c" transform="rotate(-15 68 135)"/>
    <ellipse cx="132" cy="135" rx="9" ry="17" fill="#fb923c" transform="rotate(15 132 135)"/>
    <!-- head -->
    <circle cx="100" cy="80" r="30" fill="#fb923c"/>
    <!-- ears -->
    <polygon points="72,58 76,30 88,55" fill="#fb923c"/>
    <polygon points="74,55 78,38 85,52" fill="#fce7f3"/>
    <polygon points="128,58 124,30 112,55" fill="#fb923c"/>
    <polygon points="126,55 122,38 115,52" fill="#fce7f3"/>
    <!-- face -->
    <ellipse cx="88" cy="83" rx="2.5" ry="3" fill="#10b981"/>
    <ellipse cx="112" cy="83" rx="2.5" ry="3" fill="#10b981"/>
    <circle cx="89" cy="82" r="0.8" fill="#fff"/>
    <circle cx="113" cy="82" r="0.8" fill="#fff"/>
    <path d="M98,90 L100,93 L102,90" stroke="#1f2937" stroke-width="1.2" fill="none"/>
    <path d="M97,96 Q100,99 103,96" stroke="#1f2937" stroke-width="1.2" fill="none"/>
    <!-- whiskers -->
    <line x1="78" y1="88" x2="68" y2="86" stroke="#1f2937" stroke-width="0.8"/>
    <line x1="78" y1="92" x2="68" y2="94" stroke="#1f2937" stroke-width="0.8"/>
    <line x1="122" y1="88" x2="132" y2="86" stroke="#1f2937" stroke-width="0.8"/>
    <line x1="122" y1="92" x2="132" y2="94" stroke="#1f2937" stroke-width="0.8"/>
    <!-- stripes (subtle tabby marks) -->
    <path d="M85,68 L92,65" stroke="#c2410c" stroke-width="1.5"/>
    <path d="M115,68 L108,65" stroke="#c2410c" stroke-width="1.5"/>
    <path d="M75,75 L80,73" stroke="#c2410c" stroke-width="1"/>
    <path d="M125,75 L120,73" stroke="#c2410c" stroke-width="1"/>
  `;
}

function bodyPanda() {
  return `
    <!-- legs (black) -->
    <ellipse cx="80" cy="180" rx="10" ry="7" fill="#1f2937"/>
    <ellipse cx="120" cy="180" rx="10" ry="7" fill="#1f2937"/>
    <!-- body (white) -->
    <ellipse cx="100" cy="140" rx="32" ry="30" fill="#fff" stroke="#1f2937" stroke-width="0.5"/>
    <!-- arms (black, smaller) -->
    <ellipse cx="68" cy="140" rx="9" ry="16" fill="#1f2937" transform="rotate(-15 68 140)"/>
    <ellipse cx="132" cy="140" rx="9" ry="16" fill="#1f2937" transform="rotate(15 132 140)"/>
    <!-- head (white) — drawn BIG so the white dominates -->
    <circle cx="100" cy="80" r="36" fill="#fff" stroke="#1f2937" stroke-width="0.5"/>
    <!-- ears (black, on top of head) -->
    <ellipse cx="74" cy="50" rx="10" ry="13" fill="#1f2937"/>
    <ellipse cx="126" cy="50" rx="10" ry="13" fill="#1f2937"/>
    <!-- ear inner pink -->
    <ellipse cx="74" cy="52" rx="5" ry="7" fill="#f9a8d4"/>
    <ellipse cx="126" cy="52" rx="5" ry="7" fill="#f9a8d4"/>
    <!-- eye patches (signature panda look) -->
    <ellipse cx="86" cy="82" rx="8" ry="11" fill="#1f2937" transform="rotate(-20 86 82)"/>
    <ellipse cx="114" cy="82" rx="8" ry="11" fill="#1f2937" transform="rotate(20 114 82)"/>
    <!-- eyes (white sparkle + black pupil) -->
    <circle cx="86" cy="82" r="3" fill="#fff"/>
    <circle cx="114" cy="82" r="3" fill="#fff"/>
    <circle cx="86" cy="83" r="1.8" fill="#1f2937"/>
    <circle cx="114" cy="83" r="1.8" fill="#1f2937"/>
    <!-- nose -->
    <ellipse cx="100" cy="95" rx="3.5" ry="2.5" fill="#1f2937"/>
    <!-- mouth -->
    <path d="M97,100 Q100,103 103,100" stroke="#1f2937" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <!-- tiny tail -->
    <circle cx="58" cy="155" r="5" fill="#1f2937"/>
  `;
}

function bodyTiger() {
  return `
    <!-- tail (orange + bold black bands) -->
    <path d="M55,140 Q25,150 25,170 Q35,165 45,160 Q40,170 50,170" fill="none" stroke="#fb923c" stroke-width="12" stroke-linecap="round"/>
    <path d="M44,150 L56,144" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
    <path d="M32,160 L50,154" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
    <path d="M28,170 L48,164" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
    <!-- legs -->
    <ellipse cx="80" cy="180" rx="9" ry="7" fill="#fb923c"/>
    <ellipse cx="120" cy="180" rx="9" ry="7" fill="#fb923c"/>
    <!-- leg stripes -->
    <path d="M72,174 L84,178" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <path d="M116,174 L128,178" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <!-- body (orange) -->
    <ellipse cx="100" cy="140" rx="32" ry="30" fill="#fb923c"/>
    <!-- arms -->
    <ellipse cx="68" cy="138" rx="10" ry="18" fill="#fb923c" transform="rotate(-15 68 138)"/>
    <ellipse cx="132" cy="138" rx="10" ry="18" fill="#fb923c" transform="rotate(15 132 138)"/>
    <!-- arm stripes (3 thick bands per arm) -->
    <path d="M60,126 L72,130" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <path d="M58,138 L70,142" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <path d="M62,150 L74,154" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <path d="M140,126 L128,130" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <path d="M142,138 L130,142" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <path d="M138,150 L126,154" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <!-- belly (lighter) -->
    <ellipse cx="100" cy="148" rx="18" ry="16" fill="#fed7aa"/>
    <!-- body stripes (4 bold curving bands — very visible) -->
    <path d="M70,116 Q66,130 70,148" stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M85,114 Q82,128 86,146" stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M115,114 Q118,128 114,146" stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M130,116 Q134,130 130,148" stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- head (orange) -->
    <circle cx="100" cy="80" r="33" fill="#fb923c"/>
    <!-- ears -->
    <polygon points="72,55 78,28 90,52" fill="#fb923c"/>
    <polygon points="74,52 78,38 86,50" fill="#fce7f3"/>
    <polygon points="128,55 122,28 110,52" fill="#fb923c"/>
    <polygon points="126,52 122,38 114,50" fill="#fce7f3"/>
    <!-- forehead stripes — the classic tiger "王" mark -->
    <path d="M100,54 L100,74" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    <path d="M92,58 Q90,66 93,74" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M108,58 Q110,66 107,74" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <!-- cheek stripes (bold, sweeping) -->
    <path d="M68,76 Q78,82 86,88" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M132,76 Q122,82 114,88" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M70,92 L86,94" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    <path d="M130,92 L114,94" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    <!-- eyes (yellow with black slit pupils — tiger eyes) -->
    <ellipse cx="88" cy="84" rx="3.5" ry="4" fill="#fde047"/>
    <ellipse cx="112" cy="84" rx="3.5" ry="4" fill="#fde047"/>
    <ellipse cx="88" cy="84" rx="0.8" ry="3" fill="#0f172a"/>
    <ellipse cx="112" cy="84" rx="0.8" ry="3" fill="#0f172a"/>
    <!-- nose (pink) -->
    <ellipse cx="100" cy="94" rx="3" ry="2" fill="#1f2937"/>
    <path d="M97,99 Q100,102 103,99" stroke="#1f2937" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  `;
}

function bodyDragon() {
  return `
    <!-- wings (back layer) -->
    <path d="M68,110 Q40,90 35,75 Q50,90 70,105 Z" fill="#10b981"/>
    <path d="M68,110 Q45,95 40,85" stroke="#047857" stroke-width="1" fill="none"/>
    <path d="M68,115 Q50,110 42,100" stroke="#047857" stroke-width="1" fill="none"/>
    <path d="M132,110 Q160,90 165,75 Q150,90 130,105 Z" fill="#10b981"/>
    <path d="M132,110 Q155,95 160,85" stroke="#047857" stroke-width="1" fill="none"/>
    <path d="M132,115 Q150,110 158,100" stroke="#047857" stroke-width="1" fill="none"/>
    <!-- tail -->
    <path d="M60,150 Q35,165 30,180 Q42,170 55,165 Q55,180 65,180" fill="none" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>
    <polygon points="28,178 22,170 32,175" fill="#dc2626"/>
    <!-- legs -->
    <ellipse cx="80" cy="180" rx="9" ry="7" fill="#10b981"/>
    <ellipse cx="120" cy="180" rx="9" ry="7" fill="#10b981"/>
    <!-- body -->
    <ellipse cx="100" cy="140" rx="32" ry="30" fill="#10b981"/>
    <!-- belly -->
    <ellipse cx="100" cy="148" rx="18" ry="16" fill="#fef3c7"/>
    <!-- belly stripes -->
    <path d="M88,138 Q100,140 112,138" stroke="#fbbf24" stroke-width="1"/>
    <path d="M88,150 Q100,152 112,150" stroke="#fbbf24" stroke-width="1"/>
    <path d="M88,162 Q100,164 112,162" stroke="#fbbf24" stroke-width="1"/>
    <!-- arms -->
    <ellipse cx="68" cy="135" rx="10" ry="18" fill="#10b981" transform="rotate(-15 68 135)"/>
    <ellipse cx="132" cy="135" rx="10" ry="18" fill="#10b981" transform="rotate(15 132 135)"/>
    <!-- head -->
    <ellipse cx="100" cy="78" rx="30" ry="28" fill="#10b981"/>
    <!-- horns -->
    <polygon points="80,55 75,35 88,50" fill="#fef3c7"/>
    <polygon points="120,55 125,35 112,50" fill="#fef3c7"/>
    <!-- spines on head -->
    <polygon points="95,52 100,42 105,52" fill="#dc2626"/>
    <polygon points="100,42 L100,38" stroke="#fef3c7" stroke-width="1"/>
    <!-- snout -->
    <ellipse cx="100" cy="88" rx="12" ry="8" fill="#047857"/>
    <!-- nostrils -->
    <circle cx="95" cy="86" r="1" fill="#1f2937"/>
    <circle cx="105" cy="86" r="1" fill="#1f2937"/>
    <!-- eyes -->
    <ellipse cx="88" cy="75" rx="3" ry="3.5" fill="#fbbf24"/>
    <ellipse cx="112" cy="75" rx="3" ry="3.5" fill="#fbbf24"/>
    <ellipse cx="88" cy="75" rx="1" ry="2" fill="#1f2937"/>
    <ellipse cx="112" cy="75" rx="1" ry="2" fill="#1f2937"/>
    <!-- mouth -->
    <path d="M88,95 Q100,100 112,95" stroke="#1f2937" stroke-width="1.2" fill="none"/>
  `;
}

function bodyUnicorn() {
  return `
    <!-- tail -->
    <path d="M55,135 Q25,150 22,175 Q35,168 50,160 Q50,180 60,180" fill="none" stroke="#ec4899" stroke-width="9" stroke-linecap="round"/>
    <path d="M30,165 L42,162" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
    <path d="M28,175 L40,172" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
    <!-- legs -->
    <ellipse cx="80" cy="180" rx="8" ry="6" fill="#fff"/>
    <ellipse cx="120" cy="180" rx="8" ry="6" fill="#fff"/>
    <path d="M73,180 L73,184" stroke="#ec4899" stroke-width="1.5"/>
    <path d="M113,180 L113,184" stroke="#ec4899" stroke-width="1.5"/>
    <!-- body -->
    <ellipse cx="100" cy="140" rx="30" ry="28" fill="#fff"/>
    <ellipse cx="100" cy="148" rx="18" ry="16" fill="#fce7f3"/>
    <!-- arms -->
    <ellipse cx="68" cy="135" rx="9" ry="17" fill="#fff" transform="rotate(-15 68 135)"/>
    <ellipse cx="132" cy="135" rx="9" ry="17" fill="#fff" transform="rotate(15 132 135)"/>
    <!-- head -->
    <ellipse cx="100" cy="78" rx="28" ry="30" fill="#fff"/>
    <!-- ears -->
    <polygon points="75,55 78,32 88,52" fill="#fff"/>
    <polygon points="76,52 78,40 86,50" fill="#fce7f3"/>
    <polygon points="125,55 122,32 112,52" fill="#fff"/>
    <polygon points="124,52 122,40 114,50" fill="#fce7f3"/>
    <!-- horn (the magic touch) -->
    <polygon points="98,52 100,15 102,52" fill="#fbbf24"/>
    <polygon points="98,52 100,15 102,52" fill="none" stroke="#f59e0b" stroke-width="1"/>
    <path d="M100,20 L100,22" stroke="#fff" stroke-width="0.8"/>
    <path d="M100,28 L100,30" stroke="#fff" stroke-width="0.8"/>
    <path d="M100,36 L100,38" stroke="#fff" stroke-width="0.8"/>
    <path d="M100,44 L100,46" stroke="#fff" stroke-width="0.8"/>
    <!-- horn sparkles -->
    <circle cx="92" cy="25" r="1.5" fill="#fef3c7"/>
    <circle cx="108" cy="30" r="1.5" fill="#fef3c7"/>
    <!-- mane (rainbow) -->
    <path d="M72,50 Q60,65 65,80 Q70,68 75,60 Z" fill="#ec4899"/>
    <path d="M128,50 Q140,65 135,80 Q130,68 125,60 Z" fill="#ec4899"/>
    <path d="M72,75 Q65,90 70,100 Q72,85 78,80 Z" fill="#a78bfa"/>
    <path d="M128,75 Q135,90 130,100 Q128,85 122,80 Z" fill="#a78bfa"/>
    <!-- face -->
    <ellipse cx="88" cy="80" rx="2.5" ry="3" fill="#ec4899"/>
    <ellipse cx="112" cy="80" rx="2.5" ry="3" fill="#ec4899"/>
    <circle cx="89" cy="79" r="0.8" fill="#fff"/>
    <circle cx="113" cy="79" r="0.8" fill="#fff"/>
    <ellipse cx="100" cy="90" rx="2.5" ry="1.5" fill="#ec4899"/>
    <path d="M97,95 Q100,98 103,95" stroke="#1f2937" stroke-width="1" fill="none"/>
    <!-- blush -->
    <circle cx="80" cy="88" r="3" fill="#fda4af" opacity="0.6"/>
    <circle cx="120" cy="88" r="3" fill="#fda4af" opacity="0.6"/>
  `;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.BODIES_DATA = BODIES_DATA;
  window.getBody = getBody;
  window.renderAvatar = renderAvatar;
  window.bodyFox = bodyFox;
  window.bodyCat = bodyCat;
  window.bodyPanda = bodyPanda;
  window.bodyTiger = bodyTiger;
  window.bodyDragon = bodyDragon;
  window.bodyUnicorn = bodyUnicorn;
}
