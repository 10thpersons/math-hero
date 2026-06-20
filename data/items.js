// Math Hero — Items Database v4 (PNG art from NanoBanana, 2026-06-20)
// All 100 items match their artwork. Slot order: background, headgear, top, cape, hand, pet.
// Migration map at bottom converts old v3 SVG IDs → new v4 PNG IDs on profile load.

const ITEMS = {
  meta: {
    version: 4,
    slots: ["background", "headgear", "top", "cape", "hand", "pet"],
    generatedAt: "2026-06-20",
    artSource: "NanoBanana 10x10 sprite sheet (1024x1024)"
  },

  background: [
    { id: "bg-cloudy-sky",   name: "Langit Berawan",     rarity: "common",    priceCoins: 30,  img: "assets/items/bg-cloudy-sky.png" },
    { id: "bg-sunset",        name: "Matahari Terbenam",  rarity: "common",    priceCoins: 30,  img: "assets/items/bg-sunset.png" },
    { id: "bg-pine-forest",   name: "Hutan Pine",         rarity: "common",    priceCoins: 30,  img: "assets/items/bg-pine-forest.png" },
    { id: "bg-ocean",         name: "Lautan",             rarity: "rare",      priceCoins: 150, img: "assets/items/bg-ocean.png" },
    { id: "bg-starry-space",  name: "Angkasa Berbintang", rarity: "rare",      priceCoins: 150, img: "assets/items/bg-starry-space.png" },
    { id: "bg-snowy-mountain",name: "Gunung Bersalji",    rarity: "common",    priceCoins: 30,  img: "assets/items/bg-snowy-mountain.png" },
    { id: "bg-tropical-beach",name: "Pantai Tropika",     rarity: "rare",      priceCoins: 150, img: "assets/items/bg-tropical-beach.png" },
    { id: "bg-jungle",        name: "Hutan",              rarity: "common",    priceCoins: 30,  img: "assets/items/bg-jungle.png" },
    { id: "bg-meadow",        name: "Padang",             rarity: "common",    priceCoins: 30,  img: "assets/items/bg-meadow.png" },
    { id: "bg-waterfall",     name: "Air Terjun",         rarity: "common",    priceCoins: 30,  img: "assets/items/bg-waterfall.png" },
    { id: "bg-desert",        name: "Padang Pasir",       rarity: "common",    priceCoins: 30,  img: "assets/items/bg-desert.png" },
    { id: "bg-snowy-forest",  name: "Hutan Bersalji",     rarity: "common",    priceCoins: 30,  img: "assets/items/bg-snowy-forest.png" },
    { id: "bg-castle",        name: "Istana Dongeng",     rarity: "legendary", priceGems:  25, img: "assets/items/bg-castle.png" },
    { id: "bg-brick-wall",    name: "Dinding Batu",       rarity: "common",    priceCoins: 30,  img: "assets/items/bg-brick-wall.png" },
    { id: "bg-candy-land",    name: "Dunia Gula-Gula",    rarity: "legendary", priceGems:  25, img: "assets/items/bg-candy-land.png" },
    { id: "bg-rainbow",       name: "Pelangi",            rarity: "legendary", priceGems:  25, img: "assets/items/bg-rainbow.png" },
    { id: "bg-starry-night",  name: "Malam Berbintang",   rarity: "rare",      priceCoins: 150, img: "assets/items/bg-starry-night.png" },
    { id: "bg-coral-reef",    name: "Terumbu Karang",     rarity: "rare",      priceCoins: 150, img: "assets/items/bg-coral-reef.png" },
    { id: "bg-volcano",       name: "Gunung Berapi",      rarity: "legendary", priceGems:  25, img: "assets/items/bg-volcano.png" },
    { id: "bg-city-night",    name: "Bandar Malam",       rarity: "rare",      priceCoins: 150, img: "assets/items/bg-city-night.png" },
  ],

  headgear: [
    { id: "hat-baseball-cap",   name: "Topi Besbol",       rarity: "common",    priceCoins: 30,  img: "assets/items/hat-baseball-cap.png" },
    { id: "hat-beanie",         name: "Topi Beanie",       rarity: "common",    priceCoins: 30,  img: "assets/items/hat-beanie.png" },
    { id: "hat-wizard",         name: "Topi Wizard",       rarity: "rare",      priceCoins: 150, img: "assets/items/hat-wizard.png" },
    { id: "hat-crown-gold",     name: "Mahkota Emas",      rarity: "legendary", priceGems:  25, img: "assets/items/hat-crown-gold.png" },
    { id: "hat-viking-helmet",  name: "Helmet Viking",     rarity: "rare",      priceCoins: 150, img: "assets/items/hat-viking-helmet.png" },
    { id: "hat-propeller",      name: "Topi Kipas",        rarity: "common",    priceCoins: 30,  img: "assets/items/hat-propeller.png" },
    { id: "hat-headphones",     name: "Fon Kepala",        rarity: "common",    priceCoins: 30,  img: "assets/items/hat-headphones.png" },
    { id: "hat-chef",           name: "Topi Chef",         rarity: "common",    priceCoins: 30,  img: "assets/items/hat-chef.png" },
    { id: "hat-pirate",         name: "Topi Lanun",        rarity: "common",    priceCoins: 30,  img: "assets/items/hat-pirate.png" },
    { id: "hat-graduation",     name: "Topi Konvokesyen",  rarity: "common",    priceCoins: 30,  img: "assets/items/hat-graduation.png" },
    { id: "hat-jester",         name: "Topi Badut",        rarity: "common",    priceCoins: 30,  img: "assets/items/hat-jester.png" },
    { id: "hat-top",            name: "Topi Tinggi",       rarity: "common",    priceCoins: 30,  img: "assets/items/hat-top.png" },
    { id: "hat-cowboy",         name: "Topi Koboi",        rarity: "common",    priceCoins: 30,  img: "assets/items/hat-cowboy.png" },
    { id: "hat-fedora",         name: "Topi Fedora",       rarity: "common",    priceCoins: 30,  img: "assets/items/hat-fedora.png" },
    { id: "hat-beret",          name: "Topi Beret",        rarity: "common",    priceCoins: 30,  img: "assets/items/hat-beret.png" },
    { id: "hat-tiara",          name: "Mahkota Kecil",     rarity: "rare",      priceCoins: 150, img: "assets/items/hat-tiara.png" },
    { id: "hat-hard-hat",       name: "Topi Keselamatan",  rarity: "common",    priceCoins: 30,  img: "assets/items/hat-hard-hat.png" },
    { id: "hat-knight-helmet",  name: "Helmet Kesatria",   rarity: "legendary", priceGems:  25, img: "assets/items/hat-knight-helmet.png" },
    { id: "hat-unicorn-horn",   name: "Tanduk Unicorn",    rarity: "legendary", priceGems:  25, img: "assets/items/hat-unicorn-horn.png" },
    { id: "hat-bunny-ears",     name: "Telinga Arnab",     rarity: "common",    priceCoins: 30,  img: "assets/items/hat-bunny-ears.png" },
  ],

  top: [
    { id: "shirt-tshirt",       name: "Baju T-Shirt",        rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-tshirt.png" },
    { id: "shirt-tank",         name: "Baju Tanpa Lengan",   rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-tank.png" },
    { id: "shirt-hoodie",       name: "Hoodie",              rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-hoodie.png" },
    { id: "shirt-jersey",       name: "Jersey",              rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-jersey.png" },
    { id: "shirt-sweater",      name: "Sweater",             rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-sweater.png" },
    { id: "shirt-plate-armor",  name: "Baju Zirah",          rarity: "rare",      priceCoins: 150, img: "assets/items/shirt-plate-armor.png" },
    { id: "shirt-leather-vest", name: "Vest Kulit",          rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-leather-vest.png" },
    { id: "shirt-tie",          name: "Baju+Tali Leher",     rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-tie.png" },
    { id: "shirt-lab-coat",     name: "Jas Makmal",          rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-lab-coat.png" },
    { id: "shirt-police",       name: "Uniform Polis",       rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-police.png" },
    { id: "shirt-ninja",        name: "Baju Ninja",          rarity: "rare",      priceCoins: 150, img: "assets/items/shirt-ninja.png" },
    { id: "shirt-pirate",       name: "Jas Lanun",           rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-pirate.png" },
    { id: "shirt-wizard-robe",  name: "Jubah Wizard",        rarity: "rare",      priceCoins: 150, img: "assets/items/shirt-wizard-robe.png" },
    { id: "shirt-knight-armor", name: "Zirah Kesatria",      rarity: "legendary", priceGems:  25, img: "assets/items/shirt-knight-armor.png" },
    { id: "shirt-firefighter",  name: "Jas Bomba",           rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-firefighter.png" },
    { id: "shirt-astronaut",    name: "Baju Angkasawan",     rarity: "rare",      priceCoins: 150, img: "assets/items/shirt-astronaut.png" },
    { id: "shirt-dinosaur",     name: "Baju Dinosaur",       rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-dinosaur.png" },
    { id: "shirt-superhero",    name: "Baju Adiwira",        rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-superhero.png" },
    { id: "shirt-royal",        name: "Baju Diraja",         rarity: "legendary", priceGems:  25, img: "assets/items/shirt-royal.png" },
    { id: "shirt-detective",    name: "Jas Detektif",        rarity: "common",    priceCoins: 30,  img: "assets/items/shirt-detective.png" },
  ],

  cape: [
    { id: "cape-black",         name: "Cloak Hitam",      rarity: "common",    priceCoins: 30,  img: "assets/items/cape-black.png" },
    { id: "cape-royal-ermine",  name: "Cloak Diraja",     rarity: "legendary", priceGems:  25, img: "assets/items/cape-royal-ermine.png" },
    { id: "cape-fire",          name: "Cape Api",         rarity: "rare",      priceCoins: 150, img: "assets/items/cape-fire.png" },
    { id: "cape-ice",           name: "Cape Ais",         rarity: "rare",      priceCoins: 150, img: "assets/items/cape-ice.png" },
    { id: "cape-dark",          name: "Cloak Gelap",      rarity: "common",    priceCoins: 30,  img: "assets/items/cape-dark.png" },
    { id: "cape-rainbow",       name: "Cape Pelangi",     rarity: "legendary", priceGems:  25, img: "assets/items/cape-rainbow.png" },
    { id: "cape-starry",        name: "Cape Berbintang",  rarity: "rare",      priceCoins: 150, img: "assets/items/cape-starry.png" },
    { id: "cape-ghost",         name: "Cloak Hantu",      rarity: "common",    priceCoins: 30,  img: "assets/items/cape-ghost.png" },
    { id: "cape-green",         name: "Cloak Hijau",      rarity: "common",    priceCoins: 30,  img: "assets/items/cape-green.png" },
    { id: "cape-angel-wings",   name: "Sayap Malaikat",   rarity: "legendary", priceGems:  25, img: "assets/items/cape-angel-wings.png" },
  ],

  hand: [
    { id: "hand-spell-book",    name: "Buku Sihir",       rarity: "rare",      priceCoins: 150, img: "assets/items/hand-spell-book.png" },
    { id: "hand-sword",         name: "Pedang",           rarity: "legendary", priceGems:  25, img: "assets/items/hand-sword.png" },
    { id: "hand-shield",        name: "Perisai",          rarity: "rare",      priceCoins: 150, img: "assets/items/hand-shield.png" },
    { id: "hand-magic-wand",    name: "Tongkat Sihir",    rarity: "legendary", priceGems:  25, img: "assets/items/hand-magic-wand.png" },
    { id: "hand-fishing-rod",   name: "Joran Pancing",    rarity: "common",    priceCoins: 30,  img: "assets/items/hand-fishing-rod.png" },
    { id: "hand-umbrella",      name: "Payung",           rarity: "common",    priceCoins: 30,  img: "assets/items/hand-umbrella.png" },
    { id: "hand-lantern",       name: "Tanglung",         rarity: "common",    priceCoins: 30,  img: "assets/items/hand-lantern.png" },
    { id: "hand-balloon",       name: "Belon",            rarity: "common",    priceCoins: 30,  img: "assets/items/hand-balloon.png" },
    { id: "hand-flag",          name: "Bendera",          rarity: "common",    priceCoins: 30,  img: "assets/items/hand-flag.png" },
    { id: "hand-telescope",     name: "Teleskop",         rarity: "common",    priceCoins: 30,  img: "assets/items/hand-telescope.png" },
  ],

  pet: [
    { id: "pet-bunny",     name: "Arnab",              rarity: "common",    priceCoins: 30,  img: "assets/items/pet-bunny.png" },
    { id: "pet-cat",       name: "Kucing",             rarity: "common",    priceCoins: 30,  img: "assets/items/pet-cat.png" },
    { id: "pet-puppy",     name: "Anjing",             rarity: "common",    priceCoins: 30,  img: "assets/items/pet-puppy.png" },
    { id: "pet-dragon",    name: "Naga",               rarity: "legendary", priceGems:  25, img: "assets/items/pet-dragon.png" },
    { id: "pet-phoenix",   name: "Phoenix",            rarity: "legendary", priceGems:  25, img: "assets/items/pet-phoenix.png" },
    { id: "pet-slime",     name: "Slime",              rarity: "rare",      priceCoins: 150, img: "assets/items/pet-slime.png" },
    { id: "pet-puppy-blue",name: "Anjing Biru",        rarity: "common",    priceCoins: 30,  img: "assets/items/pet-puppy-blue.png" },
    { id: "pet-owl",       name: "Burung Hantu",       rarity: "common",    priceCoins: 30,  img: "assets/items/pet-owl.png" },
    { id: "pet-fox",       name: "Musang",             rarity: "common",    priceCoins: 30,  img: "assets/items/pet-fox.png" },
    { id: "pet-wolf",      name: "Serigala",           rarity: "rare",      priceCoins: 150, img: "assets/items/pet-wolf.png" },
    { id: "pet-turtle",    name: "Penyu",              rarity: "common",    priceCoins: 30,  img: "assets/items/pet-turtle.png" },
    { id: "pet-frog",      name: "Katak",              rarity: "common",    priceCoins: 30,  img: "assets/items/pet-frog.png" },
    { id: "pet-hamster",   name: "Hamster",            rarity: "common",    priceCoins: 30,  img: "assets/items/pet-hamster.png" },
    { id: "pet-parrot",    name: "Burung Kakak Tua",   rarity: "rare",      priceCoins: 150, img: "assets/items/pet-parrot.png" },
    { id: "pet-unicorn",   name: "Unicorn",            rarity: "legendary", priceGems:  25, img: "assets/items/pet-unicorn.png" },
    { id: "pet-panda",     name: "Panda",              rarity: "rare",      priceCoins: 150, img: "assets/items/pet-panda.png" },
    { id: "pet-koala",     name: "Koala",              rarity: "common",    priceCoins: 30,  img: "assets/items/pet-koala.png" },
    { id: "pet-monkey",    name: "Monyet",             rarity: "common",    priceCoins: 30,  img: "assets/items/pet-monkey.png" },
    { id: "pet-mouse",     name: "Tikus",              rarity: "common",    priceCoins: 30,  img: "assets/items/pet-mouse.png" },
    { id: "pet-trex",      name: "T-Rex",              rarity: "rare",      priceCoins: 150, img: "assets/items/pet-trex.png" },
  ]
};

// ============================================================
// LOOKUP HELPERS
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
      out.push(Object.assign({ slot }, item));
    }
  }
  return out;
}

function findItemById(id) {
  for (const slot of ITEMS.meta.slots) {
    const it = getItem(slot, id);
    if (it) return Object.assign({ slot }, it);
  }
  return null;
}

// ============================================================
// MIGRATION: v3 SVG IDs → v4 PNG IDs (used by loadProfile)
// ============================================================
const ITEM_ID_MIGRATION = {
  // Headgear renames (5)
  'hat-cap': 'hat-baseball-cap',
  'hat-crown-king': 'hat-crown-gold',
  'hat-helmet-knight': 'hat-knight-helmet',
  'hat-viking': 'hat-viking-helmet',
  // Same → same (kept IDs)
  'hat-beanie': 'hat-beanie',
  'hat-wizard': 'hat-wizard',
  'hat-jester': 'hat-jester',
  'hat-cowboy': 'hat-cowboy',
  'hat-bandana': 'hat-propeller',
  'hat-bow': 'hat-graduation',          // closest match
  'hat-headband': 'hat-pirate',         // closest match
  'hat-glasses': 'hat-chef',            // placeholder
  'hat-crown-prince': 'hat-tiara',      // closer
  'hat-samurai': 'hat-beret',           // placeholder
  'hat-dragonhorn': 'hat-knight-helmet',// placeholder
  'hat-phoenix': 'hat-unicorn-horn',    // closer
  'hat-angelwing': 'hat-hard-hat',      // placeholder
  'hat-halo': 'hat-bunny-ears',         // placeholder
  // Top (16)
  'shirt-tshirt': 'shirt-tshirt',
  'shirt-tank': 'shirt-tank',
  'shirt-hoodie': 'shirt-hoodie',
  'shirt-jersey': 'shirt-jersey',
  'shirt-dress': 'shirt-sweater',       // closest
  'shirt-overalls': 'shirt-plate-armor',// placeholder
  'shirt-vest': 'shirt-leather-vest',
  'shirt-robe-wizard': 'shirt-wizard-robe',
  'shirt-robe-mage': 'shirt-lab-coat',  // closest
  'shirt-kimono': 'shirt-police',       // placeholder
  'shirt-armor': 'shirt-plate-armor',
  'shirt-armor-gold': 'shirt-ninja',    // placeholder
  'shirt-phoenix': 'shirt-knight-armor',
  'shirt-dragon': 'shirt-royal',        // closer
  'shirt-cosmic': 'shirt-astronaut',    // placeholder
  'shirt-angel': 'shirt-astronaut',     // placeholder
  // Cape (14)
  'cape-cloak': 'cape-black',
  'cape-fabric': 'cape-royal-ermine',
  'cape-fur': 'cape-ice',
  'cape-flag': 'cape-fire',
  'cape-fire': 'cape-green',
  'cape-ice': 'cape-ghost',
  'cape-shadow': 'cape-starry',
  'cape-galaxy': 'cape-rainbow',
  'cape-royal': 'cape-angel-wings',
  'cape-hero-red': 'cape-fire',
  'cape-hero-blue': 'cape-rainbow',
  'cape-phoenix': 'cape-rainbow',
  'cape-demon': 'cape-dark',
  'cape-angel': 'cape-angel-wings',
  // Hand (16)
  'hand-book': 'hand-spell-book',
  'hand-flower': 'hand-sword',          // placeholder
  'hand-wand': 'hand-magic-wand',
  'hand-staff': 'hand-telescope',       // placeholder
  'hand-sword': 'hand-fishing-rod',     // placeholder
  'hand-shield': 'hand-shield',
  'hand-bow': 'hand-lantern',           // placeholder
  'hand-lollipop': 'hand-magic-wand',
  'hand-stars': 'hand-magic-wand',      // placeholder
  'hand-flag': 'hand-flag',
  'hand-fireball': 'hand-magic-wand',
  'hand-lightning': 'hand-magic-wand',
  'hand-trident': 'hand-flag',
  'hand-dragon': 'hand-magic-wand',
  'hand-cosmic': 'hand-magic-wand',
  'hand-unicorn': 'hand-magic-wand',
  // Pet (18)
  'pet-bunny': 'pet-bunny',
  'pet-cat': 'pet-cat',
  'pet-dog': 'pet-puppy',
  'pet-fox': 'pet-fox',
  'pet-owl': 'pet-owl',
  'pet-panda': 'pet-panda',
  'pet-fish': 'pet-dragon',             // placeholder
  'pet-wolf': 'pet-wolf',
  'pet-dragon': 'pet-dragon',
  'pet-phoenix': 'pet-phoenix',
  'pet-unicorn': 'pet-unicorn',
  'pet-cloud': 'pet-unicorn',           // placeholder
  'pet-star': 'pet-parrot',
  'pet-rainbow': 'pet-panda',
  'pet-shadow': 'pet-wolf',
  'pet-cosmic': 'pet-monkey',
  'pet-griffin': 'pet-dragon',          // placeholder
  'pet-kraken': 'pet-slime',            // placeholder
  // Background (10)
  'bg-sky': 'bg-cloudy-sky',
  'bg-sunset': 'bg-sunset',
  'bg-meadow': 'bg-meadow',
  'bg-night': 'bg-starry-night',
  'bg-clouds': 'bg-cloudy-sky',
  'bg-galaxy': 'bg-starry-space',
  'bg-aurora': 'bg-starry-night',
  'bg-ocean': 'bg-ocean',
  'bg-cosmic': 'bg-volcano',
  'bg-heaven': 'bg-rainbow',
};

function migrateItemId(oldId) {
  if (!oldId) return null;
  if (ITEM_ID_MIGRATION[oldId]) return ITEM_ID_MIGRATION[oldId];
  // If already a v4 ID, return as-is
  if (findItemById(oldId)) return oldId;
  // Unknown — drop it
  return null;
}

// ============================================================
// PRICE LABEL HELPER (used by editor/shop)
// ============================================================
function priceLabel(item) {
  if (!item) return '';
  if (item.priceGems) return `${item.priceGems} 💎`;
  if (item.priceCoins != null) return `${item.priceCoins} 🪙`;
  return '';
}

// ============================================================
// RENDER HELPERS
// ============================================================
// Item art: returns <img> tag for PNG items, or empty string if no art
function itemImg(item) {
  if (!item) return '';
  if (item.img) {
    return `<img class="item-img" src="${item.img}" alt="${item.name || item.id}" loading="lazy" decoding="async">`;
  }
  if (item.svg) return item.svg;  // legacy fallback
  return '';
}

function itemArtHtml(item) {
  return itemImg(item);
}

// Expose globals (old code expected window.ITEMS etc.)
window.ITEMS = ITEMS;
window.getItem = getItem;
window.getAllItems = getAllItems;
window.findItemById = findItemById;
window.migrateItemId = migrateItemId;
window.itemImg = itemImg;
window.itemArtHtml = itemArtHtml;
window.priceLabel = priceLabel;
window.ITEM_ID_MIGRATION = ITEM_ID_MIGRATION;
