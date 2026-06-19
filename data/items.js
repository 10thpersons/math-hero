// Math Hero — Item Catalog
// 92 items across 6 cosmetic slots (Body = chosen creature, not in this list)
// Pricing: Common 25-60 🪙 · Rare 100-200 🪙 or 3-6 💎 · Legendary 10-30 💎
// Canvas: 200x200 viewBox · Body center at (100, 100)

const ITEMS = {
  meta: {
    version: 1,
    slots: ["background", "headgear", "top", "cape", "hand", "pet"],
    generatedAt: "2026-06-19"
  },

  // ============================================================
  // 1. BACKGROUND (10 items)
  // Full-canvas scene behind the character
  // ============================================================
  background: [
    // ---- Common (5) ----
    { id: "bg-sky",       name: "Langit Cerah",      rarity: "common",    priceCoins: 25,  svg: bgSky() },
    { id: "bg-sunset",    name: "Matahari Terbenam", rarity: "common",    priceCoins: 30,  svg: bgSunset() },
    { id: "bg-meadow",    name: "Padang Rumput",     rarity: "common",    priceCoins: 30,  svg: bgMeadow() },
    { id: "bg-night",     name: "Malam Berbintang",  rarity: "common",    priceCoins: 40,  svg: bgNight() },
    { id: "bg-clouds",    name: "Awan Comel",        rarity: "common",    priceCoins: 35,  svg: bgClouds() },
    // ---- Rare (3) ----
    { id: "bg-galaxy",    name: "Galaksi",           rarity: "rare",      priceCoins: 120, svg: bgGalaxy() },
    { id: "bg-aurora",    name: "Aurora",            rarity: "rare",      priceCoins: 150, svg: bgAurora() },
    { id: "bg-ocean",     name: "Laut Dalam",        rarity: "rare",      priceCoins: 180, svg: bgOcean() },
    // ---- Legendary (2) ----
    { id: "bg-cosmic",    name: "Kosmik",            rarity: "legendary", priceGems:  12, svg: bgCosmic() },
    { id: "bg-heaven",    name: "Syurga",            rarity: "legendary", priceGems:  25, svg: bgHeaven() }
  ],

  // ============================================================
  // 2. HEADGEAR (18 items)
  // Anchored around y=30-70, sits on top of head
  // ============================================================
  headgear: [
    // ---- Common (6) ----
    { id: "hat-cap",          name: "Topi Bisbol",     rarity: "common", priceCoins: 30, svg: hatCap() },
    { id: "hat-beanie",       name: "Topi Beanie",     rarity: "common", priceCoins: 35, svg: hatBeanie() },
    { id: "hat-bow",          name: "Busur Rambut",    rarity: "common", priceCoins: 40, svg: hatBow() },
    { id: "hat-headband",     name: "Ikat Kepala",     rarity: "common", priceCoins: 25, svg: hatHeadband() },
    { id: "hat-glasses",      name: "Cermin Mata",     rarity: "common", priceCoins: 45, svg: hatGlasses() },
    { id: "hat-bandana",      name: "Bandana",         rarity: "common", priceCoins: 40, svg: hatBandana() },
    // ---- Rare (8) ----
    { id: "hat-crown-prince", name: "Mahkota Putera",  rarity: "rare",   priceCoins: 150, svg: hatCrownPrince() },
    { id: "hat-helmet-knight",name: "Helmet Kesatria", rarity: "rare",   priceCoins: 180, svg: hatHelmetKnight() },
    { id: "hat-wizard",       name: "Topi Wizard",     rarity: "rare",   priceCoins: 160, svg: hatWizard() },
    { id: "hat-halo",         name: "Halo",            rarity: "rare",   priceCoins: 140, svg: hatHalo() },
    { id: "hat-viking",       name: "Helmet Viking",   rarity: "rare",   priceCoins: 170, svg: hatViking() },
    { id: "hat-samurai",      name: "Topi Samurai",    rarity: "rare",   priceCoins: 165, svg: hatSamurai() },
    { id: "hat-jester",       name: "Topi Badut",      rarity: "rare",   priceCoins: 120, svg: hatJester() },
    { id: "hat-cowboy",       name: "Topi Koboi",      rarity: "rare",   priceCoins: 130, svg: hatCowboy() },
    // ---- Legendary (4) ----
    { id: "hat-crown-king",   name: "Mahkota Raja",    rarity: "legendary", priceGems: 15, svg: hatCrownKing() },
    { id: "hat-dragonhorn",   name: "Tanduk Naga",     rarity: "legendary", priceGems: 20, svg: hatDragonHorn() },
    { id: "hat-angelwing",    name: "Halo Bersayap",   rarity: "legendary", priceGems: 25, svg: hatAngelWings() },
    { id: "hat-phoenix",      name: "Mahkota Phoenix", rarity: "legendary", priceGems: 30, svg: hatPhoenixCrown() }
  ],

  // ============================================================
  // 3. TOP (16 items) — shirts, robes, armor
  // Anchored around y=100-150, torso area
  // ============================================================
  top: [
    // ---- Common (6) ----
    { id: "shirt-tshirt",   name: "Baju T-Shirt",    rarity: "common", priceCoins: 30, svg: topTShirt() },
    { id: "shirt-tank",     name: "Baju Tanpa Lengan", rarity: "common", priceCoins: 25, svg: topTank() },
    { id: "shirt-hoodie",   name: "Hoodie",          rarity: "common", priceCoins: 50, svg: topHoodie() },
    { id: "shirt-jersey",   name: "Jersey",          rarity: "common", priceCoins: 45, svg: topJersey() },
    { id: "shirt-dress",    name: "Gaun Comel",      rarity: "common", priceCoins: 40, svg: topDress() },
    { id: "shirt-overalls", name: "Baju Seluar",     rarity: "common", priceCoins: 45, svg: topOveralls() },
    // ---- Rare (6) ----
    { id: "shirt-armor",      name: "Baju Zirah",    rarity: "rare", priceCoins: 160, svg: topArmor() },
    { id: "shirt-robe-wizard",name: "Jubah Wizard",  rarity: "rare", priceCoins: 180, svg: topRobeWizard() },
    { id: "shirt-robe-mage",  name: "Jubah Mage",    rarity: "rare", priceCoins: 170, svg: topRobeMage() },
    { id: "shirt-kimono",     name: "Kimono",        rarity: "rare", priceCoins: 150, svg: topKimono() },
    { id: "shirt-vest",       name: "Vest Koboi",    rarity: "rare", priceCoins: 130, svg: topVest() },
    { id: "shirt-armor-gold", name: "Baju Emas",     rarity: "rare", priceCoins: 190, svg: topArmorGold() },
    // ---- Legendary (4) ----
    { id: "shirt-dragon",  name: "Zirah Naga",  rarity: "legendary", priceGems: 18, svg: topArmorDragon() },
    { id: "shirt-phoenix", name: "Jubah Phoenix", rarity: "legendary", priceGems: 22, svg: topRobePhoenix() },
    { id: "shirt-cosmic",  name: "Baju Kosmik", rarity: "legendary", priceGems: 25, svg: topArmorCosmic() },
    { id: "shirt-angel",   name: "Jubah Malaikat", rarity: "legendary", priceGems: 28, svg: topRobeAngel() }
  ],

  // ============================================================
  // 4. CAPE (14 items)
  // Anchored y=130-180, drapes from shoulders
  // ============================================================
  cape: [
    // ---- Common (4) ----
    { id: "cape-cloak",   name: "Cloak Biasa",   rarity: "common", priceCoins: 50, svg: capeCloak() },
    { id: "cape-fabric",  name: "Kain Hujan",    rarity: "common", priceCoins: 40, svg: capeFabric() },
    { id: "cape-flag",    name: "Bendera",       rarity: "common", priceCoins: 45, svg: capeFlag() },
    { id: "cape-fur",     name: "Bulu",          rarity: "common", priceCoins: 55, svg: capeFur() },
    // ---- Rare (6) ----
    { id: "cape-hero-red",   name: "Cape Wira Merah", rarity: "rare", priceCoins: 150, svg: capeHeroRed() },
    { id: "cape-hero-blue",  name: "Cape Wira Biru",  rarity: "rare", priceCoins: 150, svg: capeHeroBlue() },
    { id: "cape-shadow",     name: "Cape Bayang",     rarity: "rare", priceCoins: 180, svg: capeShadow() },
    { id: "cape-ice",        name: "Cape Ais",        rarity: "rare", priceCoins: 170, svg: capeIce() },
    { id: "cape-fire",       name: "Cape Api",        rarity: "rare", priceCoins: 170, svg: capeFire() },
    { id: "cape-royal",      name: "Cape Diraja",     rarity: "rare", priceCoins: 200, svg: capeRoyal() },
    // ---- Legendary (4) ----
    { id: "cape-galaxy",   name: "Cape Galaksi",  rarity: "legendary", priceGems: 20, svg: capeGalaxy() },
    { id: "cape-angel",    name: "Sayap Malaikat", rarity: "legendary", priceGems: 28, svg: capeAngelWings() },
    { id: "cape-demon",    name: "Sayap Iblis",   rarity: "legendary", priceGems: 28, svg: capeDemonWings() },
    { id: "cape-phoenix",  name: "Sayap Phoenix", rarity: "legendary", priceGems: 30, svg: capePhoenixWings() }
  ],

  // ============================================================
  // 5. HAND (16 items) — weapons, wands, tools
  // Anchored at (140, 110) — right hand position
  // ============================================================
  hand: [
    // ---- Common (4) ----
    { id: "hand-book",     name: "Buku",          rarity: "common", priceCoins: 40, svg: handBook() },
    { id: "hand-flower",   name: "Bunga",         rarity: "common", priceCoins: 35, svg: handFlower() },
    { id: "hand-flag",     name: "Bendera Mini",  rarity: "common", priceCoins: 30, svg: handFlag() },
    { id: "hand-lollipop", name: "Gula-gula",     rarity: "common", priceCoins: 45, svg: handLollipop() },
    // ---- Rare (6) ----
    { id: "hand-sword",    name: "Pedang",         rarity: "rare", priceCoins: 160, svg: handSword() },
    { id: "hand-wand",     name: "Tongkat Sihir",  rarity: "rare", priceCoins: 150, svg: handWand() },
    { id: "hand-bow",      name: "Busur & Panah",  rarity: "rare", priceCoins: 170, svg: handBow() },
    { id: "hand-shield",   name: "Perisai",        rarity: "rare", priceCoins: 180, svg: handShield() },
    { id: "hand-trident",  name: "Tombak",         rarity: "rare", priceCoins: 190, svg: handTrident() },
    { id: "hand-staff",    name: "Tongkat Kuasa",  rarity: "rare", priceCoins: 200, svg: handStaff() },
    // ---- Legendary (6) ----
    { id: "hand-fireball",    name: "Bola Api",       rarity: "legendary", priceGems: 20, svg: handFireball() },
    { id: "hand-lightning",   name: "Kilat",          rarity: "legendary", priceGems: 22, svg: handLightning() },
    { id: "hand-stars",       name: "Bintang Sihir",  rarity: "legendary", priceGems: 25, svg: handStars() },
    { id: "hand-dragon",      name: "Naga Kecil",     rarity: "legendary", priceGems: 30, svg: handDragon() },
    { id: "hand-unicorn",     name: "Unicorn Mini",   rarity: "legendary", priceGems: 28, svg: handUnicorn() },
    { id: "hand-cosmic",      name: "Tenaga Kosmik",  rarity: "legendary", priceGems: 35, svg: handCosmic() }
  ],

  // ============================================================
  // 6. PET (18 items) — companions
  // Anchored at (60, 160) — bottom-left of character
  // ============================================================
  pet: [
    // ---- Common (4) ----
    { id: "pet-bunny",   name: "Arnab",      rarity: "common", priceCoins: 50, svg: petBunny() },
    { id: "pet-cat",     name: "Kucing",     rarity: "common", priceCoins: 50, svg: petCat() },
    { id: "pet-dog",     name: "Anjing",     rarity: "common", priceCoins: 55, svg: petDog() },
    { id: "pet-fish",    name: "Ikan",       rarity: "common", priceCoins: 40, svg: petFish() },
    // ---- Rare (6) ----
    { id: "pet-fox",     name: "Rubah",      rarity: "rare", priceCoins: 140, svg: petFox() },
    { id: "pet-owl",     name: "Burung Hantu", rarity: "rare", priceCoins: 150, svg: petOwl() },
    { id: "pet-panda",   name: "Panda",      rarity: "rare", priceCoins: 180, svg: petPanda() },
    { id: "pet-dragon",  name: "Naga Baby",  rarity: "rare", priceCoins: 200, svg: petDragon() },
    { id: "pet-wolf",    name: "Serigala",   rarity: "rare", priceCoins: 170, svg: petWolf() },
    { id: "pet-unicorn", name: "Baby Unicorn", rarity: "rare", priceCoins: 190, svg: petUnicorn() },
    // ---- Legendary (8) ----
    { id: "pet-phoenix", name: "Phoenix",      rarity: "legendary", priceGems: 28, svg: petPhoenix() },
    { id: "pet-griffin", name: "Griffin",      rarity: "legendary", priceGems: 30, svg: petGriffin() },
    { id: "pet-kraken",  name: "Kraken Baby",  rarity: "legendary", priceGems: 25, svg: petKraken() },
    { id: "pet-star",    name: "Bintang",      rarity: "legendary", priceGems: 22, svg: petStar() },
    { id: "pet-cloud",   name: "Awan",         rarity: "legendary", priceGems: 24, svg: petCloud() },
    { id: "pet-rainbow", name: "Pelangi",      rarity: "legendary", priceGems: 35, svg: petRainbow() },
    { id: "pet-shadow",  name: "Bayang",       rarity: "legendary", priceGems: 30, svg: petShadow() },
    { id: "pet-cosmic",  name: "Bayi Kosmik",  rarity: "legendary", priceGems: 40, svg: petCosmic() }
  ]
};

// ============================================================
// SVG FACTORY FUNCTIONS
// Each returns a string of <svg> children to be inlined inside
// the parent's <svg viewBox="0 0 200 200">
// ============================================================

// ---- BACKGROUNDS ----
function bgSky() {
  return `
    <defs><linearGradient id="bgSkyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#bae6fd"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#bgSkyG)"/>
    <circle cx="160" cy="40" r="15" fill="#fef3c7"/>
    <circle cx="40" cy="30" r="12" fill="#fff" opacity="0.7"/>
    <circle cx="180" cy="170" r="10" fill="#fff" opacity="0.6"/>
  `;
}

function bgSunset() {
  return `
    <defs><linearGradient id="bgSunsetG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fb7185"/><stop offset="60%" stop-color="#fdba74"/><stop offset="100%" stop-color="#fde68a"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#bgSunsetG)"/>
    <circle cx="100" cy="160" r="30" fill="#fef3c7"/>
    <circle cx="100" cy="160" r="22" fill="#fbbf24"/>
  `;
}

function bgMeadow() {
  return `
    <defs><linearGradient id="bgMeadowG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7dd3fc"/><stop offset="50%" stop-color="#86efac"/><stop offset="100%" stop-color="#4ade80"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#bgMeadowG)"/>
    <ellipse cx="40" cy="175" rx="15" ry="8" fill="#16a34a"/>
    <ellipse cx="160" cy="180" rx="20" ry="10" fill="#16a34a"/>
    <circle cx="50" cy="40" r="12" fill="#fef3c7"/>
  `;
}

function bgNight() {
  return `
    <defs><linearGradient id="bgNightG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#312e81"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#bgNightG)"/>
    <circle cx="40" cy="40" r="2" fill="#fff"/>
    <circle cx="80" cy="60" r="1.5" fill="#fff"/>
    <circle cx="130" cy="30" r="2" fill="#fff"/>
    <circle cx="170" cy="50" r="1.5" fill="#fff"/>
    <circle cx="60" cy="90" r="1" fill="#fff"/>
    <circle cx="160" cy="100" r="2" fill="#fff"/>
    <path d="M30,30 A20,20 0 1,0 50,30 A15,15 0 1,1 30,30" fill="#fde68a"/>
    <circle cx="40" cy="30" r="3" fill="#fef3c7"/>
  `;
}

function bgClouds() {
  return `
    <defs><linearGradient id="bgCloudsG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#ddd6fe"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#bgCloudsG)"/>
    <ellipse cx="50" cy="50" rx="25" ry="12" fill="#fff" opacity="0.9"/>
    <ellipse cx="65" cy="55" rx="20" ry="10" fill="#fff" opacity="0.9"/>
    <ellipse cx="150" cy="90" rx="30" ry="14" fill="#fff" opacity="0.85"/>
    <ellipse cx="100" cy="150" rx="35" ry="15" fill="#fff" opacity="0.8"/>
  `;
}

function bgGalaxy() {
  return `
    <defs><radialGradient id="bgGalaxyG" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#ec4899"/><stop offset="40%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#1e1b4b"/>
    </radialGradient></defs>
    <rect width="200" height="200" fill="#1e1b4b"/>
    <circle cx="100" cy="100" r="80" fill="url(#bgGalaxyG)" opacity="0.8"/>
    <path d="M30,100 Q70,50 100,100 T170,100" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.5"/>
    <path d="M30,100 Q70,150 100,100 T170,100" stroke="#a78bfa" stroke-width="1" fill="none" opacity="0.5"/>
    ${[20,50,80,110,140,170,30,60,90,120,150,180].map((x,i)=>
      `<circle cx="${x}" cy="${[30,50,70,90,110,130,150,170,40,80,120,160][i]}" r="${1+Math.random()*1.5}" fill="#fff"/>`
    ).join('')}
  `;
}

function bgAurora() {
  return `
    <defs><linearGradient id="bgAuroraG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#064e3b"/><stop offset="50%" stop-color="#10b981"/><stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="#064e3b"/>
    <path d="M0,80 Q50,40 100,80 T200,80 L200,0 L0,0 Z" fill="#10b981" opacity="0.6"/>
    <path d="M0,100 Q50,60 100,100 T200,100 L200,0 L0,0 Z" fill="#34d399" opacity="0.5"/>
    <path d="M0,120 Q50,80 100,120 T200,120 L200,0 L0,0 Z" fill="#a78bfa" opacity="0.5"/>
    <path d="M0,140 Q50,100 100,140 T200,140 L200,0 L0,0 Z" fill="#c4b5fd" opacity="0.4"/>
    <circle cx="40" cy="40" r="2" fill="#fff"/>
    <circle cx="160" cy="60" r="1.5" fill="#fff"/>
  `;
}

function bgOcean() {
  return `
    <defs><linearGradient id="bgOceanG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c4a6e"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#67e8f9"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#bgOceanG)"/>
    <path d="M0,140 Q50,130 100,140 T200,140 L200,200 L0,200 Z" fill="#0c4a6e" opacity="0.5"/>
    <ellipse cx="60" cy="80" rx="8" ry="3" fill="#fff" opacity="0.4"/>
    <ellipse cx="140" cy="100" rx="6" ry="2" fill="#fff" opacity="0.4"/>
    <circle cx="160" cy="40" r="3" fill="#fff" opacity="0.6"/>
  `;
}

function bgCosmic() {
  return `
    <defs><radialGradient id="bgCosmicG" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#fbbf24"/><stop offset="30%" stop-color="#f97316"/><stop offset="60%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#000"/>
    </radialGradient></defs>
    <rect width="200" height="200" fill="#000"/>
    <circle cx="100" cy="100" r="90" fill="url(#bgCosmicG)"/>
    <g opacity="0.9">
      <circle cx="100" cy="100" r="50" fill="none" stroke="#fbbf24" stroke-width="0.5"/>
      <circle cx="100" cy="100" r="65" fill="none" stroke="#fbbf24" stroke-width="0.5" opacity="0.7"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="#fbbf24" stroke-width="0.5" opacity="0.4"/>
    </g>
    <circle cx="100" cy="100" r="15" fill="#fef3c7"/>
  `;
}

function bgHeaven() {
  return `
    <defs><linearGradient id="bgHeavenG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef3c7"/><stop offset="50%" stop-color="#fde68a"/><stop offset="100%" stop-color="#fff"/>
    </linearGradient></defs>
    <rect width="200" height="200" fill="url(#bgHeavenG)"/>
    <ellipse cx="50" cy="80" rx="35" ry="15" fill="#fff" opacity="0.9"/>
    <ellipse cx="150" cy="120" rx="40" ry="18" fill="#fff" opacity="0.9"/>
    <ellipse cx="80" cy="160" rx="30" ry="14" fill="#fff" opacity="0.8"/>
    <ellipse cx="170" cy="50" rx="25" ry="10" fill="#fff" opacity="0.85"/>
    <g opacity="0.6">
      <circle cx="40" cy="40" r="2" fill="#fbbf24"/>
      <circle cx="160" cy="30" r="2" fill="#fbbf24"/>
      <circle cx="180" cy="180" r="2" fill="#fbbf24"/>
    </g>
  `;
}

// ---- HEADGEARS ----
function hatCap() {
  return `
    <ellipse cx="100" cy="65" rx="38" ry="14" fill="#3b82f6"/>
    <path d="M62,65 Q100,25 138,65 Z" fill="#3b82f6"/>
    <ellipse cx="100" cy="65" rx="38" ry="14" fill="none" stroke="#1e40af" stroke-width="1.5"/>
    <rect x="80" y="65" width="40" height="8" fill="#1e40af" rx="2"/>
    <circle cx="100" cy="68" r="3" fill="#fff"/>
  `;
}

function hatBeanie() {
  return `
    <path d="M60,70 Q100,20 140,70 Z" fill="#ef4444"/>
    <ellipse cx="100" cy="70" rx="42" ry="6" fill="#dc2626"/>
    <circle cx="100" cy="25" r="8" fill="#fff"/>
  `;
}

function hatBow() {
  return `
    <path d="M75,55 Q60,40 75,30 L95,45 Z" fill="#ec4899"/>
    <path d="M125,55 Q140,40 125,30 L105,45 Z" fill="#ec4899"/>
    <ellipse cx="100" cy="48" rx="8" ry="10" fill="#ec4899"/>
    <circle cx="100" cy="48" r="4" fill="#be185d"/>
  `;
}

function hatHeadband() {
  return `
    <rect x="62" y="62" width="76" height="10" fill="#f59e0b" rx="3"/>
    <path d="M62,62 L62,55 L72,62 Z" fill="#fff"/>
    <path d="M138,62 L138,55 L128,62 Z" fill="#fff"/>
  `;
}

function hatGlasses() {
  return `
    <circle cx="82" cy="68" r="10" fill="none" stroke="#1f2937" stroke-width="3"/>
    <circle cx="118" cy="68" r="10" fill="none" stroke="#1f2937" stroke-width="3"/>
    <line x1="92" y1="68" x2="108" y2="68" stroke="#1f2937" stroke-width="3"/>
    <line x1="62" y1="65" x2="72" y2="68" stroke="#1f2937" stroke-width="3"/>
    <line x1="128" y1="68" x2="138" y2="65" stroke="#1f2937" stroke-width="3"/>
  `;
}

function hatBandana() {
  return `
    <path d="M62,70 Q100,35 138,70 Z" fill="#dc2626"/>
    <ellipse cx="100" cy="70" rx="40" ry="5" fill="#dc2626"/>
    <circle cx="80" cy="55" r="2" fill="#fff"/>
    <circle cx="100" cy="50" r="2" fill="#fff"/>
    <circle cx="120" cy="55" r="2" fill="#fff"/>
    <path d="M138,70 L155,72 L155,82 L138,78 Z" fill="#dc2626"/>
  `;
}

function hatCrownPrince() {
  return `
    <path d="M70,72 L75,42 L85,62 L100,32 L115,62 L125,42 L130,72 Z" fill="#fbbf24"/>
    <rect x="70" y="70" width="60" height="10" fill="#fbbf24"/>
    <circle cx="100" cy="32" r="4" fill="#dc2626"/>
    <circle cx="80" cy="62" r="3" fill="#3b82f6"/>
    <circle cx="120" cy="62" r="3" fill="#10b981"/>
  `;
}

function hatHelmetKnight() {
  return `
    <path d="M62,72 Q62,30 100,28 Q138,30 138,72 Z" fill="#6b7280"/>
    <rect x="68" y="62" width="64" height="12" fill="#374151" rx="2"/>
    <rect x="78" y="58" width="44" height="6" fill="#1f2937"/>
    <line x1="100" y1="58" x2="100" y2="50" stroke="#fbbf24" stroke-width="2"/>
    <circle cx="100" cy="46" r="3" fill="#fbbf24"/>
  `;
}

function hatWizard() {
  return `
    <path d="M65,70 L100,15 L135,70 Z" fill="#7c3aed"/>
    <ellipse cx="100" cy="70" rx="38" ry="6" fill="#5b21b6"/>
    <circle cx="100" cy="25" r="3" fill="#fbbf24"/>
    <path d="M75,55 L85,50 L80,60 Z" fill="#fbbf24"/>
    <path d="M120,55 L130,45 L125,58 Z" fill="#fbbf24"/>
    <circle cx="85" cy="40" r="2" fill="#fff"/>
    <circle cx="115" cy="35" r="2" fill="#fff"/>
  `;
}

function hatHalo() {
  return `
    <ellipse cx="100" cy="30" rx="35" ry="6" fill="none" stroke="#fde047" stroke-width="4"/>
    <ellipse cx="100" cy="30" rx="35" ry="6" fill="none" stroke="#fbbf24" stroke-width="2"/>
    <circle cx="80" cy="28" r="2" fill="#fde047"/>
    <circle cx="120" cy="28" r="2" fill="#fde047"/>
  `;
}

function hatViking() {
  return `
    <path d="M62,72 Q62,40 100,38 Q138,40 138,72 Z" fill="#92400e"/>
    <rect x="65" y="55" width="70" height="20" fill="#78350f"/>
    <circle cx="100" cy="65" r="3" fill="#fbbf24"/>
    <path d="M100,38 L90,20 L100,28 L110,20 Z" fill="#fbbf24"/>
    <ellipse cx="65" cy="55" rx="5" ry="12" fill="#92400e"/>
    <ellipse cx="135" cy="55" rx="5" ry="12" fill="#92400e"/>
  `;
}

function hatSamurai() {
  return `
    <path d="M60,72 Q60,38 100,32 Q140,38 140,72 Z" fill="#dc2626"/>
    <path d="M62,50 L100,28 L138,50 L138,55 L62,55 Z" fill="#991b1b"/>
    <path d="M100,28 L100,18" stroke="#fbbf24" stroke-width="3"/>
    <circle cx="100" cy="15" r="3" fill="#fbbf24"/>
    <path d="M50,70 L60,65 L60,72 Z" fill="#dc2626"/>
    <path d="M150,70 L140,65 L140,72 Z" fill="#dc2626"/>
  `;
}

function hatJester() {
  return `
    <path d="M60,72 L75,25 L90,55 L100,15 L110,55 L125,25 L140,72 Z" fill="#ec4899"/>
    <circle cx="75" cy="25" r="5" fill="#fbbf24"/>
    <circle cx="100" cy="15" r="5" fill="#3b82f6"/>
    <circle cx="125" cy="25" r="5" fill="#10b981"/>
    <ellipse cx="100" cy="72" rx="42" ry="6" fill="#be185d"/>
  `;
}

function hatCowboy() {
  return `
    <path d="M55,75 Q55,68 65,68 L135,68 Q145,68 145,75 Q145,82 135,82 L65,82 Q55,82 55,75 Z" fill="#92400e"/>
    <path d="M70,68 Q70,30 100,28 Q130,30 130,68 Z" fill="#92400e"/>
    <path d="M65,72 L135,72" stroke="#78350f" stroke-width="2"/>
    <ellipse cx="100" cy="40" rx="15" ry="4" fill="#78350f"/>
  `;
}

function hatCrownKing() {
  return `
    <path d="M65,75 L70,35 L82,55 L100,20 L118,55 L130,35 L135,75 Z" fill="#fbbf24"/>
    <rect x="65" y="73" width="70" height="10" fill="#fbbf24"/>
    <path d="M65,75 L70,35 L82,55 L100,20 L118,55 L130,35 L135,75 Z" fill="none" stroke="#92400e" stroke-width="2"/>
    <circle cx="100" cy="20" r="5" fill="#dc2626"/>
    <circle cx="80" cy="50" r="3" fill="#3b82f6"/>
    <circle cx="120" cy="50" r="3" fill="#10b981"/>
    <circle cx="100" cy="78" r="3" fill="#ec4899"/>
    <circle cx="75" cy="78" r="2" fill="#7c3aed"/>
    <circle cx="125" cy="78" r="2" fill="#7c3aed"/>
  `;
}

function hatDragonHorn() {
  return `
    <path d="M70,68 Q60,40 55,25 Q70,35 80,55 Z" fill="#dc2626"/>
    <path d="M130,68 Q140,40 145,25 Q130,35 120,55 Z" fill="#dc2626"/>
    <path d="M55,25 L60,28 L57,32 Z" fill="#fbbf24"/>
    <path d="M145,25 L140,28 L143,32 Z" fill="#fbbf24"/>
    <path d="M75,68 L125,68 L120,75 L80,75 Z" fill="#1f2937"/>
    <circle cx="78" cy="72" r="2" fill="#fbbf24"/>
    <circle cx="122" cy="72" r="2" fill="#fbbf24"/>
  `;
}

function hatAngelWings() {
  return `
    <ellipse cx="100" cy="30" rx="35" ry="6" fill="none" stroke="#fbbf24" stroke-width="3"/>
    <path d="M65,40 Q40,30 30,50 Q45,55 65,55 Z" fill="#fef3c7" opacity="0.95"/>
    <path d="M135,40 Q160,30 170,50 Q155,55 135,55 Z" fill="#fef3c7" opacity="0.95"/>
    <path d="M65,40 Q45,42 35,52" stroke="#fbbf24" stroke-width="1" fill="none"/>
    <path d="M135,40 Q155,42 165,52" stroke="#fbbf24" stroke-width="1" fill="none"/>
    <circle cx="100" cy="30" r="4" fill="#fef3c7"/>
  `;
}

function hatPhoenixCrown() {
  return `
    <path d="M70,70 L80,40 L100,55 L120,40 L130,70 Z" fill="#f97316"/>
    <path d="M80,40 L100,20 L120,40" fill="#fbbf24"/>
    <path d="M80,40 L75,15 L85,35 Z" fill="#dc2626"/>
    <path d="M120,40 L125,15 L115,35 Z" fill="#dc2626"/>
    <path d="M100,20 L100,5" stroke="#fbbf24" stroke-width="2"/>
    <circle cx="100" cy="5" r="3" fill="#fbbf24"/>
    <ellipse cx="100" cy="70" rx="32" ry="5" fill="#c2410c"/>
  `;
}

// ---- TOPS (16) ----
function topTShirt() {
  return `
    <path d="M70,110 L75,105 L125,105 L130,110 L150,115 L145,135 L130,130 L130,165 L70,165 L70,130 L55,135 L50,115 Z" fill="#3b82f6"/>
    <path d="M85,105 Q100,120 115,105" fill="none" stroke="#1e40af" stroke-width="2"/>
  `;
}

function topTank() {
  return `
    <path d="M75,110 L80,105 L120,105 L125,110 L125,165 L75,165 Z" fill="#10b981"/>
    <line x1="85" y1="105" x2="90" y2="115" stroke="#047857" stroke-width="2"/>
    <line x1="115" y1="105" x2="110" y2="115" stroke="#047857" stroke-width="2"/>
  `;
}

function topHoodie() {
  return `
    <path d="M65,110 L75,100 L90,105 L110,105 L125,100 L135,110 L150,120 L145,140 L130,135 L130,170 L70,170 L70,135 L55,140 L50,120 Z" fill="#8b5cf6"/>
    <path d="M85,100 Q100,90 115,100" fill="#7c3aed"/>
    <ellipse cx="100" cy="110" rx="6" ry="3" fill="#7c3aed"/>
    <circle cx="92" cy="135" r="2" fill="#fff"/>
    <path d="M80,140 L120,140" stroke="#fbbf24" stroke-width="2"/>
  `;
}

function topJersey() {
  return `
    <path d="M70,110 L80,105 L120,105 L130,110 L148,118 L143,135 L130,130 L130,168 L70,168 L70,130 L57,135 L52,118 Z" fill="#ef4444"/>
    <text x="100" y="155" font-size="24" font-weight="900" fill="#fff" text-anchor="middle" font-family="Arial">7</text>
  `;
}

function topDress() {
  return `
    <path d="M75,110 L80,105 L120,105 L125,110 L140,170 L60,170 Z" fill="#ec4899"/>
    <circle cx="100" cy="120" r="3" fill="#fbbf24"/>
    <circle cx="85" cy="140" r="2" fill="#fff"/>
    <circle cx="115" cy="140" r="2" fill="#fff"/>
    <circle cx="100" cy="155" r="2" fill="#fff"/>
  `;
}

function topOveralls() {
  return `
    <rect x="75" y="110" width="50" height="20" fill="#3b82f6"/>
    <rect x="80" y="130" width="15" height="40" fill="#3b82f6"/>
    <rect x="105" y="130" width="15" height="40" fill="#3b82f6"/>
    <rect x="80" y="130" width="40" height="8" fill="#1e40af"/>
    <line x1="82" y1="110" x2="82" y2="130" stroke="#1e40af" stroke-width="2"/>
    <line x1="118" y1="110" x2="118" y2="130" stroke="#1e40af" stroke-width="2"/>
    <circle cx="100" cy="115" r="2" fill="#fbbf24"/>
  `;
}

function topArmor() {
  return `
    <path d="M65,110 L75,105 L125,105 L135,110 L148,120 L143,140 L130,135 L130,170 L70,170 L70,135 L57,140 L52,120 Z" fill="#6b7280"/>
    <rect x="80" y="115" width="40" height="8" fill="#9ca3af"/>
    <rect x="85" y="130" width="30" height="6" fill="#374151"/>
    <rect x="85" y="145" width="30" height="6" fill="#374151"/>
    <circle cx="100" cy="125" r="4" fill="#fbbf24"/>
  `;
}

function topRobeWizard() {
  return `
    <path d="M65,105 L100,100 L135,105 L155,170 L45,170 Z" fill="#7c3aed"/>
    <path d="M85,105 Q100,115 115,105" fill="#5b21b6"/>
    <path d="M55,140 L100,150 L145,140" stroke="#fbbf24" stroke-width="2" fill="none"/>
    <circle cx="80" cy="155" r="3" fill="#fbbf24"/>
    <circle cx="120" cy="155" r="3" fill="#fbbf24"/>
    <circle cx="100" cy="165" r="2" fill="#fef3c7"/>
  `;
}

function topRobeMage() {
  return `
    <path d="M65,105 L100,100 L135,105 L155,170 L45,170 Z" fill="#fff"/>
    <path d="M85,105 Q100,115 115,105" fill="#e5e7eb"/>
    <path d="M65,110 L135,110" stroke="#fbbf24" stroke-width="2"/>
    <circle cx="100" cy="125" r="6" fill="#fbbf24"/>
    <path d="M50,170 L100,150 L150,170 Z" fill="#fef3c7"/>
  `;
}

function topKimono() {
  return `
    <path d="M70,105 L100,100 L130,105 L150,170 L50,170 Z" fill="#ec4899"/>
    <path d="M70,105 L100,135 L130,105" stroke="#831843" stroke-width="2" fill="none"/>
    <path d="M85,125 Q95,120 105,125 Q115,130 125,125" stroke="#fff" stroke-width="1" fill="none"/>
    <circle cx="100" cy="115" r="3" fill="#fbbf24"/>
    <rect x="60" y="140" width="80" height="3" fill="#831843"/>
  `;
}

function topVest() {
  return `
    <path d="M75,108 L80,105 L120,105 L125,108 L125,170 L75,170 Z" fill="#92400e"/>
    <path d="M85,108 L100,140 L115,108" fill="#78350f"/>
    <rect x="85" y="125" width="30" height="4" fill="#fbbf24"/>
    <circle cx="92" cy="135" r="1.5" fill="#fbbf24"/>
    <circle cx="108" cy="135" r="1.5" fill="#fbbf24"/>
    <circle cx="100" cy="155" r="2" fill="#fbbf24"/>
  `;
}

function topArmorGold() {
  return `
    <path d="M65,110 L75,105 L125,105 L135,110 L148,120 L143,140 L130,135 L130,170 L70,170 L70,135 L57,140 L52,120 Z" fill="#fbbf24"/>
    <rect x="80" y="115" width="40" height="8" fill="#fde68a"/>
    <path d="M85,130 L100,140 L115,130" stroke="#92400e" stroke-width="2" fill="none"/>
    <circle cx="100" cy="125" r="4" fill="#dc2626"/>
    <circle cx="80" cy="155" r="2" fill="#92400e"/>
    <circle cx="120" cy="155" r="2" fill="#92400e"/>
  `;
}

function topArmorDragon() {
  return `
    <path d="M65,110 L75,105 L125,105 L135,110 L148,120 L143,140 L130,135 L130,170 L70,170 L70,135 L57,140 L52,120 Z" fill="#dc2626"/>
    <path d="M70,120 L75,115 L80,125 L85,115 L90,125 L95,115 L100,125 L105,115 L110,125 L115,115 L120,125 L125,115 L130,120" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
    <path d="M75,140 L100,150 L125,140" stroke="#fbbf24" stroke-width="2" fill="none"/>
    <circle cx="100" cy="125" r="4" fill="#fbbf24"/>
    <circle cx="100" cy="125" r="2" fill="#dc2626"/>
  `;
}

function topRobePhoenix() {
  return `
    <path d="M65,105 L100,100 L135,105 L155,170 L45,170 Z" fill="#f97316"/>
    <path d="M70,120 Q100,130 130,120" stroke="#fbbf24" stroke-width="2" fill="none"/>
    <path d="M75,140 Q100,150 125,140" stroke="#fbbf24" stroke-width="2" fill="none"/>
    <path d="M70,160 Q100,165 130,160" stroke="#fef3c7" stroke-width="1.5" fill="none"/>
    <circle cx="100" cy="125" r="5" fill="#fbbf24"/>
    <path d="M100,120 L95,115 L100,118 L100,112 L105,118 L100,115 Z" fill="#fbbf24"/>
  `;
}

function topArmorCosmic() {
  return `
    <path d="M65,110 L75,105 L125,105 L135,110 L148,120 L143,140 L130,135 L130,170 L70,170 L70,135 L57,140 L52,120 Z" fill="#7c3aed"/>
    <circle cx="85" cy="125" r="3" fill="#fbbf24"/>
    <circle cx="115" cy="125" r="3" fill="#fbbf24"/>
    <circle cx="100" cy="145" r="4" fill="#fbbf24"/>
    <path d="M75,155 L100,160 L125,155" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
    <circle cx="90" cy="160" r="1.5" fill="#fff"/>
    <circle cx="110" cy="160" r="1.5" fill="#fff"/>
  `;
}

function topRobeAngel() {
  return `
    <path d="M65,105 L100,100 L135,105 L155,170 L45,170 Z" fill="#fef3c7"/>
    <path d="M85,105 Q100,115 115,105" fill="#fde68a"/>
    <path d="M50,140 L100,150 L150,140" stroke="#fbbf24" stroke-width="2" fill="none"/>
    <circle cx="100" cy="130" r="5" fill="#fff"/>
    <circle cx="100" cy="130" r="2" fill="#fbbf24"/>
    <path d="M75,160 L100,170 L125,160" stroke="#fbbf24" stroke-width="1" fill="none"/>
  `;
}

// ---- CAPES (14) ----
function capeCloak() {
  return `
    <path d="M75,110 Q50,140 55,180 L65,185 L75,130 Z" fill="#1f2937"/>
    <path d="M125,110 Q150,140 145,180 L135,185 L125,130 Z" fill="#1f2937"/>
    <path d="M70,110 L130,110" stroke="#374151" stroke-width="2"/>
  `;
}

function capeFabric() {
  return `
    <path d="M70,110 Q45,140 50,180 L75,180 L75,120 Z" fill="#3b82f6"/>
    <path d="M130,110 Q155,140 150,180 L125,180 L125,120 Z" fill="#3b82f6"/>
    <path d="M65,110 L135,110" stroke="#1e40af" stroke-width="2"/>
    <circle cx="60" cy="160" r="2" fill="#fff" opacity="0.6"/>
    <circle cx="140" cy="170" r="2" fill="#fff" opacity="0.6"/>
  `;
}

function capeFlag() {
  return `
    <rect x="50" y="115" width="100" height="70" fill="#dc2626"/>
    <rect x="50" y="115" width="100" height="23" fill="#dc2626"/>
    <rect x="50" y="138" width="100" height="24" fill="#fff"/>
    <rect x="50" y="162" width="100" height="23" fill="#dc2626"/>
    <circle cx="68" cy="128" r="6" fill="#fbbf24"/>
    <circle cx="68" cy="128" r="3" fill="#1e40af"/>
  `;
}

function capeFur() {
  return `
    <path d="M70,110 Q45,135 50,175 L75,180 L80,125 Z" fill="#92400e"/>
    <path d="M130,110 Q155,135 150,175 L125,180 L120,125 Z" fill="#92400e"/>
    <path d="M65,115 L135,115" stroke="#78350f" stroke-width="3"/>
    <path d="M50,170 L55,175 L50,180 L60,175 L55,185 L65,180 L60,180" stroke="#78350f" stroke-width="1.5" fill="none"/>
  `;
}

function capeHeroRed() {
  return `
    <path d="M70,105 Q40,130 40,180 Q60,170 70,140 Z" fill="#dc2626"/>
    <path d="M130,105 Q160,130 160,180 Q140,170 130,140 Z" fill="#dc2626"/>
    <path d="M65,105 L135,105" stroke="#991b1b" stroke-width="2"/>
    <path d="M50,180 L60,170" stroke="#fbbf24" stroke-width="1.5"/>
  `;
}

function capeHeroBlue() {
  return `
    <path d="M70,105 Q40,130 40,180 Q60,170 70,140 Z" fill="#2563eb"/>
    <path d="M130,105 Q160,130 160,180 Q140,170 130,140 Z" fill="#2563eb"/>
    <path d="M65,105 L135,105" stroke="#1e40af" stroke-width="2"/>
    <path d="M50,180 L60,170" stroke="#fbbf24" stroke-width="1.5"/>
  `;
}

function capeShadow() {
  return `
    <path d="M70,105 Q35,135 35,185 Q60,175 70,140 Z" fill="#1f2937" opacity="0.9"/>
    <path d="M130,105 Q165,135 165,185 Q140,175 130,140 Z" fill="#1f2937" opacity="0.9"/>
    <path d="M65,105 L135,105" stroke="#000" stroke-width="2"/>
    <circle cx="40" cy="160" r="3" fill="#000" opacity="0.5"/>
    <circle cx="160" cy="170" r="2" fill="#000" opacity="0.5"/>
  `;
}

function capeIce() {
  return `
    <path d="M70,105 Q40,130 40,185 Q60,175 70,140 Z" fill="#67e8f9"/>
    <path d="M130,105 Q160,130 160,185 Q140,175 130,140 Z" fill="#67e8f9"/>
    <path d="M65,105 L135,105" stroke="#0284c7" stroke-width="2"/>
    <path d="M50,150 L55,145 L50,140" stroke="#fff" stroke-width="1" fill="none"/>
    <path d="M145,160 L150,155 L145,150" stroke="#fff" stroke-width="1" fill="none"/>
    <circle cx="60" cy="170" r="2" fill="#fff"/>
  `;
}

function capeFire() {
  return `
    <path d="M70,105 Q40,130 40,185 Q60,175 70,140 Z" fill="#f97316"/>
    <path d="M130,105 Q160,130 160,185 Q140,175 130,140 Z" fill="#f97316"/>
    <path d="M65,105 L135,105" stroke="#c2410c" stroke-width="2"/>
    <path d="M50,160 Q55,150 50,145 Q45,155 50,160" fill="#fbbf24"/>
    <path d="M150,170 Q155,160 150,155 Q145,165 150,170" fill="#fbbf24"/>
  `;
}

function capeRoyal() {
  return `
    <path d="M70,105 Q35,135 35,185 Q60,175 70,140 Z" fill="#7c3aed"/>
    <path d="M130,105 Q165,135 165,185 Q140,175 130,140 Z" fill="#7c3aed"/>
    <path d="M65,105 L135,105" stroke="#fbbf24" stroke-width="3"/>
    <path d="M65,105 L135,105 L130,110 L70,110 Z" fill="#fbbf24"/>
    <circle cx="100" cy="107" r="3" fill="#dc2626"/>
    <path d="M40,170 L60,160 L80,170" stroke="#fbbf24" stroke-width="1" fill="none"/>
  `;
}

function capeGalaxy() {
  return `
    <path d="M70,105 Q35,135 35,185 Q60,175 70,140 Z" fill="#1e1b4b"/>
    <path d="M130,105 Q165,135 165,185 Q140,175 130,140 Z" fill="#1e1b4b"/>
    <path d="M65,105 L135,105" stroke="#7c3aed" stroke-width="2"/>
    <circle cx="50" cy="155" r="2" fill="#fbbf24"/>
    <circle cx="150" cy="160" r="2" fill="#fbbf24"/>
    <circle cx="100" cy="170" r="2" fill="#a78bfa"/>
    <path d="M40,170 Q50,165 60,170" stroke="#a78bfa" stroke-width="1" fill="none"/>
  `;
}

function capeAngelWings() {
  return `
    <path d="M70,105 Q30,120 20,160 Q40,155 55,140 Q45,170 70,150 Z" fill="#fef3c7" opacity="0.95"/>
    <path d="M130,105 Q170,120 180,160 Q160,155 145,140 Q155,170 130,150 Z" fill="#fef3c7" opacity="0.95"/>
    <path d="M70,105 Q35,130 25,160" stroke="#fbbf24" stroke-width="1" fill="none"/>
    <path d="M130,105 Q165,130 175,160" stroke="#fbbf24" stroke-width="1" fill="none"/>
    <path d="M70,105 Q45,150 70,150" stroke="#fbbf24" stroke-width="1" fill="none"/>
    <path d="M130,105 Q155,150 130,150" stroke="#fbbf24" stroke-width="1" fill="none"/>
  `;
}

function capeDemonWings() {
  return `
    <path d="M70,105 Q30,120 20,160 Q40,155 55,140 Q45,170 70,150 Z" fill="#1f2937"/>
    <path d="M130,105 Q170,120 180,160 Q160,155 145,140 Q155,170 130,150 Z" fill="#1f2937"/>
    <path d="M70,105 L60,140 L80,140 Z" fill="#dc2626"/>
    <path d="M130,105 L140,140 L120,140 Z" fill="#dc2626"/>
    <path d="M70,105 Q45,130 35,160" stroke="#dc2626" stroke-width="1" fill="none"/>
    <path d="M130,105 Q155,130 165,160" stroke="#dc2626" stroke-width="1" fill="none"/>
  `;
}

function capePhoenixWings() {
  return `
    <path d="M70,105 Q30,120 20,160 Q40,155 55,140 Q45,170 70,150 Z" fill="#f97316"/>
    <path d="M130,105 Q170,120 180,160 Q160,155 145,140 Q155,170 130,150 Z" fill="#f97316"/>
    <path d="M70,105 Q35,130 25,160" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
    <path d="M130,105 Q165,130 175,160" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
    <path d="M40,170 Q50,165 60,170 Q65,175 60,180" stroke="#fef3c7" stroke-width="1" fill="none"/>
    <path d="M160,170 Q150,165 140,170 Q135,175 140,180" stroke="#fef3c7" stroke-width="1" fill="none"/>
    <circle cx="50" cy="160" r="2" fill="#fef3c7"/>
    <circle cx="150" cy="160" r="2" fill="#fef3c7"/>
  `;
}

// ---- HANDS (16) ----
function handBook() {
  return `
    <rect x="125" y="110" width="22" height="28" fill="#3b82f6" rx="2"/>
    <rect x="125" y="110" width="22" height="6" fill="#1e40af" rx="2"/>
    <line x1="135" y1="118" x2="135" y2="135" stroke="#1e40af" stroke-width="1"/>
    <text x="135" y="130" font-size="10" fill="#fff" text-anchor="middle">A</text>
  `;
}

function handFlower() {
  return `
    <circle cx="145" cy="115" r="4" fill="#ec4899"/>
    <circle cx="140" cy="120" r="4" fill="#ec4899"/>
    <circle cx="150" cy="120" r="4" fill="#ec4899"/>
    <circle cx="145" cy="125" r="4" fill="#ec4899"/>
    <circle cx="145" cy="120" r="3" fill="#fbbf24"/>
    <line x1="145" y1="125" x2="145" y2="145" stroke="#10b981" stroke-width="2"/>
  `;
}

function handFlag() {
  return `
    <line x1="135" y1="105" x2="135" y2="145" stroke="#92400e" stroke-width="2"/>
    <path d="M135,105 L155,108 L150,115 L155,122 L135,120 Z" fill="#ef4444"/>
  `;
}

function handLollipop() {
  return `
    <circle cx="145" cy="115" r="10" fill="#fbbf24"/>
    <circle cx="145" cy="115" r="6" fill="#ec4899"/>
    <line x1="145" y1="125" x2="145" y2="145" stroke="#fef3c7" stroke-width="2"/>
  `;
}

function handSword() {
  return `
    <line x1="140" y1="105" x2="140" y2="145" stroke="#cbd5e1" stroke-width="3"/>
    <rect x="132" y="100" width="16" height="6" fill="#92400e"/>
    <line x1="140" y1="100" x2="140" y2="108" stroke="#fbbf24" stroke-width="3"/>
    <polygon points="135,108 140,100 145,108" fill="#cbd5e1"/>
  `;
}

function handWand() {
  return `
    <line x1="140" y1="115" x2="140" y2="148" stroke="#92400e" stroke-width="3"/>
    <polygon points="140,100 135,110 140,108 145,110" fill="#8b5cf6"/>
    <polygon points="140,95 137,105 140,103 143,105" fill="#fbbf24"/>
    <circle cx="140" cy="98" r="3" fill="#fef3c7"/>
  `;
}

function handBow() {
  return `
    <path d="M125,110 Q140,90 155,110 Q140,130 125,110 Z" fill="none" stroke="#92400e" stroke-width="2"/>
    <line x1="125" y1="110" x2="155" y2="110" stroke="#fff" stroke-width="0.5"/>
    <polygon points="155,110 162,107 162,113" fill="#94a3b8"/>
  `;
}

function handShield() {
  return `
    <path d="M125,105 L155,105 L155,125 Q155,140 140,148 Q125,140 125,125 Z" fill="#3b82f6"/>
    <path d="M125,105 L155,105 L155,125 Q155,140 140,148 Q125,140 125,125 Z" fill="none" stroke="#1e40af" stroke-width="2"/>
    <path d="M140,115 L145,122 L140,135 L135,122 Z" fill="#fbbf24"/>
  `;
}

function handTrident() {
  return `
    <line x1="140" y1="110" x2="140" y2="148" stroke="#64748b" stroke-width="3"/>
    <line x1="135" y1="105" x2="135" y2="115" stroke="#64748b" stroke-width="2"/>
    <line x1="145" y1="105" x2="145" y2="115" stroke="#64748b" stroke-width="2"/>
    <line x1="140" y1="100" x2="140" y2="115" stroke="#64748b" stroke-width="2"/>
    <polygon points="140,98 137,108 143,108" fill="#cbd5e1"/>
  `;
}

function handStaff() {
  return `
    <line x1="140" y1="115" x2="140" y2="150" stroke="#92400e" stroke-width="4"/>
    <circle cx="140" cy="105" r="8" fill="#fbbf24"/>
    <circle cx="140" cy="105" r="4" fill="#fef3c7"/>
    <path d="M132,105 L138,108 L132,111 Z" fill="#fbbf24"/>
    <path d="M148,105 L142,108 L148,111 Z" fill="#fbbf24"/>
  `;
}

function handFireball() {
  return `
    <circle cx="142" cy="115" r="14" fill="#f97316"/>
    <circle cx="142" cy="115" r="9" fill="#fbbf24"/>
    <circle cx="142" cy="115" r="4" fill="#fef3c7"/>
    <path d="M135,108 Q138,103 142,105 Q146,103 149,108" stroke="#dc2626" stroke-width="1.5" fill="none"/>
    <path d="M128,115 Q132,120 138,118" stroke="#dc2626" stroke-width="1" fill="none"/>
  `;
}

function handLightning() {
  return `
    <polygon points="140,95 132,115 140,115 132,140 148,118 140,118 148,95" fill="#fde047"/>
    <polygon points="140,95 132,115 140,115 132,140 148,118 140,118 148,95" fill="none" stroke="#f59e0b" stroke-width="1"/>
    <circle cx="140" cy="115" r="3" fill="#fef3c7"/>
  `;
}

function handStars() {
  return `
    <g>
      <polygon points="140,100 144,112 156,112 146,118 150,130 140,122 130,130 134,118 124,112 136,112" fill="#a78bfa" transform="scale(0.7) translate(60, 30)"/>
    </g>
    <circle cx="135" cy="115" r="3" fill="#fbbf24"/>
    <circle cx="150" cy="120" r="2" fill="#fbbf24"/>
    <circle cx="145" cy="130" r="2" fill="#ec4899"/>
    <line x1="140" y1="125" x2="140" y2="145" stroke="#92400e" stroke-width="2"/>
  `;
}

function handDragon() {
  return `
    <path d="M125,115 Q120,105 130,100 L135,108 L132,118 Z" fill="#dc2626"/>
    <ellipse cx="125" cy="115" rx="5" ry="4" fill="#dc2626"/>
    <path d="M122,118 L120,125 L125,122 Z" fill="#dc2626"/>
    <circle cx="123" cy="113" r="1" fill="#fbbf24"/>
    <line x1="125" y1="118" x2="125" y2="135" stroke="#dc2626" stroke-width="2"/>
  `;
}

function handUnicorn() {
  return `
    <ellipse cx="140" cy="118" rx="6" ry="5" fill="#fff"/>
    <ellipse cx="140" cy="120" rx="6" ry="4" fill="#fce7f3"/>
    <path d="M140,113 L142,108 L138,108 Z" fill="#fbbf24"/>
    <circle cx="141" cy="118" r="1" fill="#1f2937"/>
    <path d="M134,118 Q130,120 134,125" stroke="#fff" stroke-width="2" fill="none"/>
  `;
}

function handCosmic() {
  return `
    <defs><radialGradient id="hcosmicG"><stop offset="0%" stop-color="#fff"/><stop offset="40%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#7c3aed"/></radialGradient></defs>
    <circle cx="142" cy="118" r="16" fill="url(#hcosmicG)"/>
    <circle cx="142" cy="118" r="16" fill="none" stroke="#fbbf24" stroke-width="0.5" opacity="0.7"/>
    <circle cx="142" cy="118" r="11" fill="none" stroke="#fbbf24" stroke-width="0.5" opacity="0.5"/>
    <circle cx="138" cy="115" r="1.5" fill="#fff"/>
    <circle cx="146" cy="120" r="1" fill="#fff"/>
  `;
}

// ---- PETS (18) — positioned at (60, 165) ----
function petBunny() {
  return `
    <ellipse cx="50" cy="170" rx="12" ry="10" fill="#f5f5f4"/>
    <ellipse cx="47" cy="155" rx="3" ry="8" fill="#f5f5f4"/>
    <ellipse cx="53" cy="155" rx="3" ry="8" fill="#f5f5f4"/>
    <ellipse cx="47" cy="155" rx="1.5" ry="5" fill="#fda4af"/>
    <ellipse cx="53" cy="155" rx="1.5" ry="5" fill="#fda4af"/>
    <circle cx="46" cy="167" r="1.5" fill="#1f2937"/>
    <circle cx="54" cy="167" r="1.5" fill="#1f2937"/>
    <circle cx="50" cy="172" r="1" fill="#ec4899"/>
  `;
}

function petCat() {
  return `
    <ellipse cx="50" cy="170" rx="12" ry="10" fill="#fb923c"/>
    <polygon points="42,160 40,150 47,158" fill="#fb923c"/>
    <polygon points="58,160 60,150 53,158" fill="#fb923c"/>
    <circle cx="46" cy="167" r="1.5" fill="#1f2937"/>
    <circle cx="54" cy="167" r="1.5" fill="#1f2937"/>
    <path d="M48,172 Q50,174 52,172" stroke="#1f2937" stroke-width="1" fill="none"/>
    <line x1="50" y1="170" x2="50" y2="173" stroke="#1f2937" stroke-width="0.5"/>
  `;
}

function petDog() {
  return `
    <ellipse cx="50" cy="170" rx="12" ry="10" fill="#92400e"/>
    <ellipse cx="40" cy="162" rx="4" ry="6" fill="#78350f"/>
    <ellipse cx="60" cy="162" rx="4" ry="6" fill="#78350f"/>
    <circle cx="46" cy="167" r="1.5" fill="#1f2937"/>
    <circle cx="54" cy="167" r="1.5" fill="#1f2937"/>
    <ellipse cx="50" cy="172" rx="2" ry="1.5" fill="#1f2937"/>
  `;
}

function petFish() {
  return `
    <ellipse cx="50" cy="170" rx="10" ry="6" fill="#fbbf24"/>
    <polygon points="40,170 32,164 32,176" fill="#f59e0b"/>
    <circle cx="54" cy="168" r="1.5" fill="#1f2937"/>
    <path d="M45,165 L48,168 L45,170 Z" fill="#f59e0b"/>
    <path d="M50,165 L53,168 L50,170 Z" fill="#f59e0b"/>
  `;
}

function petFox() {
  return `
    <ellipse cx="50" cy="170" rx="12" ry="10" fill="#f97316"/>
    <polygon points="42,160 38,148 47,158" fill="#f97316"/>
    <polygon points="58,160 62,148 53,158" fill="#f97316"/>
    <polygon points="42,160 41,153 45,158" fill="#fff"/>
    <polygon points="58,160 59,153 55,158" fill="#fff"/>
    <circle cx="46" cy="167" r="1.5" fill="#1f2937"/>
    <circle cx="54" cy="167" r="1.5" fill="#1f2937"/>
    <ellipse cx="50" cy="173" rx="2" ry="1.5" fill="#1f2937"/>
  `;
}

function petOwl() {
  return `
    <ellipse cx="50" cy="170" rx="11" ry="12" fill="#92400e"/>
    <circle cx="45" cy="166" r="4" fill="#fff"/>
    <circle cx="55" cy="166" r="4" fill="#fff"/>
    <circle cx="45" cy="166" r="2" fill="#1f2937"/>
    <circle cx="55" cy="166" r="2" fill="#1f2937"/>
    <polygon points="50,170 48,173 52,173" fill="#fbbf24"/>
    <path d="M50,158 L48,153 L52,153 Z" fill="#92400e"/>
  `;
}

function petPanda() {
  return `
    <ellipse cx="50" cy="170" rx="12" ry="11" fill="#fff"/>
    <ellipse cx="42" cy="158" rx="4" ry="5" fill="#1f2937"/>
    <ellipse cx="58" cy="158" rx="4" ry="5" fill="#1f2937"/>
    <circle cx="46" cy="166" r="1.5" fill="#1f2937"/>
    <circle cx="54" cy="166" r="1.5" fill="#1f2937"/>
    <circle cx="50" cy="172" r="1.5" fill="#1f2937"/>
  `;
}

function petDragon() {
  return `
    <ellipse cx="50" cy="170" rx="13" ry="10" fill="#10b981"/>
    <polygon points="42,162 40,152 47,160" fill="#10b981"/>
    <polygon points="58,162 60,152 53,160" fill="#10b981"/>
    <circle cx="46" cy="167" r="1.5" fill="#fbbf24"/>
    <circle cx="54" cy="167" r="1.5" fill="#fbbf24"/>
    <path d="M48,173 L50,176 L52,173" stroke="#dc2626" stroke-width="1.5" fill="none"/>
  `;
}

function petWolf() {
  return `
    <ellipse cx="50" cy="170" rx="12" ry="10" fill="#6b7280"/>
    <polygon points="42,158 38,148 47,156" fill="#6b7280"/>
    <polygon points="58,158 62,148 53,156" fill="#6b7280"/>
    <circle cx="46" cy="167" r="1.5" fill="#fbbf24"/>
    <circle cx="54" cy="167" r="1.5" fill="#fbbf24"/>
    <ellipse cx="50" cy="173" rx="2" ry="1.5" fill="#1f2937"/>
  `;
}

function petUnicorn() {
  return `
    <ellipse cx="50" cy="170" rx="12" ry="10" fill="#fff"/>
    <ellipse cx="50" cy="170" rx="12" ry="10" fill="#fce7f3" opacity="0.5"/>
    <polygon points="42,158 38,148 47,156" fill="#fff"/>
    <polygon points="58,158 62,148 53,156" fill="#fff"/>
    <path d="M50,153 L52,148 L48,148 Z" fill="#fbbf24"/>
    <circle cx="46" cy="167" r="1.5" fill="#1f2937"/>
    <circle cx="54" cy="167" r="1.5" fill="#1f2937"/>
    <path d="M48,172 Q50,175 52,172" stroke="#ec4899" stroke-width="1" fill="none"/>
  `;
}

function petPhoenix() {
  return `
    <ellipse cx="50" cy="172" rx="11" ry="9" fill="#f97316"/>
    <path d="M40,165 Q30,155 35,168 Q42,170 45,165 Z" fill="#fbbf24"/>
    <path d="M60,165 Q70,155 65,168 Q58,170 55,165 Z" fill="#fbbf24"/>
    <circle cx="46" cy="168" r="1.5" fill="#1f2937"/>
    <circle cx="54" cy="168" r="1.5" fill="#1f2937"/>
    <path d="M50,158 L48,150 L52,150 Z" fill="#fbbf24"/>
  `;
}

function petGriffin() {
  return `
    <ellipse cx="50" cy="170" rx="12" ry="10" fill="#fbbf24"/>
    <path d="M35,168 Q28,158 33,170 Q40,172 42,168 Z" fill="#92400e"/>
    <path d="M65,168 Q72,158 67,170 Q60,172 58,168 Z" fill="#92400e"/>
    <circle cx="46" cy="167" r="1.5" fill="#1f2937"/>
    <circle cx="54" cy="167" r="1.5" fill="#1f2937"/>
    <path d="M48,172 L50,175 L52,172" fill="#dc2626"/>
  `;
}

function petKraken() {
  return `
    <circle cx="50" cy="160" r="10" fill="#7c3aed"/>
    <path d="M42,168 Q40,178 45,175" stroke="#7c3aed" stroke-width="3" fill="none"/>
    <path d="M46,170 Q44,180 49,177" stroke="#7c3aed" stroke-width="3" fill="none"/>
    <path d="M50,170 Q48,182 53,178" stroke="#7c3aed" stroke-width="3" fill="none"/>
    <path d="M54,170 Q56,180 51,177" stroke="#7c3aed" stroke-width="3" fill="none"/>
    <path d="M58,168 Q60,178 55,175" stroke="#7c3aed" stroke-width="3" fill="none"/>
    <circle cx="47" cy="160" r="1.5" fill="#fff"/>
    <circle cx="53" cy="160" r="1.5" fill="#fff"/>
  `;
}

function petStar() {
  return `
    <polygon points="50,150 55,165 70,165 58,173 62,188 50,178 38,188 42,173 30,165 45,165" fill="#fde047"/>
    <polygon points="50,155 53,165 63,165 55,170 58,180 50,174 42,180 45,170 37,165 47,165" fill="#fef3c7"/>
    <circle cx="50" cy="168" r="1.5" fill="#1f2937"/>
    <circle cx="46" cy="172" r="1" fill="#ec4899"/>
    <circle cx="54" cy="172" r="1" fill="#ec4899"/>
  `;
}

function petCloud() {
  return `
    <ellipse cx="45" cy="170" rx="12" ry="8" fill="#fff"/>
    <ellipse cx="55" cy="168" rx="10" ry="7" fill="#fff"/>
    <ellipse cx="50" cy="172" rx="14" ry="6" fill="#fff"/>
    <circle cx="46" cy="168" r="1.5" fill="#1f2937"/>
    <circle cx="54" cy="168" r="1.5" fill="#1f2937"/>
    <path d="M48,172 Q50,174 52,172" stroke="#1f2937" stroke-width="1" fill="none"/>
  `;
}

function petRainbow() {
  return `
    <path d="M30,180 Q50,140 70,180" stroke="#dc2626" stroke-width="3" fill="none"/>
    <path d="M32,180 Q50,144 68,180" stroke="#f97316" stroke-width="3" fill="none"/>
    <path d="M34,180 Q50,148 66,180" stroke="#fbbf24" stroke-width="3" fill="none"/>
    <path d="M36,180 Q50,152 64,180" stroke="#10b981" stroke-width="3" fill="none"/>
    <path d="M38,180 Q50,156 62,180" stroke="#3b82f6" stroke-width="3" fill="none"/>
    <path d="M40,180 Q50,160 60,180" stroke="#7c3aed" stroke-width="3" fill="none"/>
    <circle cx="50" cy="170" r="3" fill="#fff"/>
  `;
}

function petShadow() {
  return `
    <ellipse cx="50" cy="170" rx="12" ry="10" fill="#1f2937"/>
    <path d="M40,168 Q35,160 40,162" stroke="#1f2937" stroke-width="2" fill="none"/>
    <path d="M60,168 Q65,160 60,162" stroke="#1f2937" stroke-width="2" fill="none"/>
    <circle cx="46" cy="167" r="1.5" fill="#dc2626"/>
    <circle cx="54" cy="167" r="1.5" fill="#dc2626"/>
    <path d="M46,173 L54,173" stroke="#dc2626" stroke-width="1"/>
  `;
}

function petCosmic() {
  return `
    <defs><radialGradient id="petcosmicG"><stop offset="0%" stop-color="#fff"/><stop offset="50%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#1e1b4b"/></radialGradient></defs>
    <circle cx="50" cy="168" r="14" fill="url(#petcosmicG)"/>
    <circle cx="50" cy="168" r="14" fill="none" stroke="#fbbf24" stroke-width="0.5" opacity="0.7"/>
    <circle cx="46" cy="165" r="1.5" fill="#fff"/>
    <circle cx="54" cy="165" r="1.5" fill="#fff"/>
    <path d="M46,172 Q50,175 54,172" stroke="#fbbf24" stroke-width="1" fill="none"/>
    <circle cx="40" cy="160" r="0.8" fill="#fff"/>
    <circle cx="60" cy="160" r="0.8" fill="#fff"/>
  `;
}

// ============================================================
// ITEM LOOKUP HELPERS
// ============================================================
function getItem(slot, id) {
  if (!id) return null;
  const list = ITEMS[slot];
  if (!list) return null;
  return list.find(i => i.id === id) || null;
}

function getAllItems() {
  const out = [];
  for (const slot of ITEMS.meta.slots) {
    for (const item of (ITEMS[slot] || [])) {
      out.push({ ...item, slot });
    }
  }
  return out;
}

function priceLabel(item) {
  if (item.priceGems) return `${item.priceGems} 💎`;
  if (item.priceCoins) return `${item.priceCoins} 🪙`;
  return 'PERCUMA';
}

function rarityClass(r) {
  return `rarity-${r}`;
}

// Export for browser global
if (typeof window !== 'undefined') {
  window.ITEMS = ITEMS;
  window.getItem = getItem;
  window.getAllItems = getAllItems;
  window.priceLabel = priceLabel;
  window.rarityClass = rarityClass;
}
