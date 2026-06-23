// Math Hero — Items Database v4 (PNG art from NanoBanana, 2026-06-20)
// All 100 items match their artwork. Slot order: background, headgear, top, cape, hand, pet.
// Migration map at bottom converts old v3 SVG IDs → new v4 PNG IDs on profile load.

const ITEMS = {
  meta: {
    version: 5,
    slots: ["background", "headgear", "top", "cape", "hand", "pet",
            "hair", "face", "pants", "shoes", "glasses", "accessory"],
    generatedAt: "2026-06-20",
    artSource: "NanoBanana v4 items + customizer v2 packs (hair/face/pants/shoes/glasses/accessory)"
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
  ],

  // ============================================================
  // CUSTOMIZER v2 PACKS — 6 new slots (70 PNGs total)
  // Generated via NanoBanana sprite sheets, extracted & alpha-cleaned.
  // Anchors + Z-order live in data/bodies.js renderAvatar().
  // ============================================================

  // HAIR (30) — renders behind head as hair-back layer.
  hair: [
    { id: "hair-bowl-cut-brown",   name: "Bowl Cut Coklat",      rarity: "common",    priceCoins: 30,  img: "assets/items/hair-bowl-cut-brown.png" },
    { id: "hair-bowl-cut-black",   name: "Bowl Cut Hitam",       rarity: "common",    priceCoins: 30,  img: "assets/items/hair-bowl-cut-black.png" },
    { id: "hair-bowl-cut-blonde",  name: "Bowl Cut Perang",      rarity: "common",    priceCoins: 30,  img: "assets/items/hair-bowl-cut-blonde.png" },
    { id: "hair-long-straight-brown", name: "Lurus Panjang Coklat", rarity: "common",  priceCoins: 30,  img: "assets/items/hair-long-straight-brown.png" },
    { id: "hair-long-straight-black", name: "Lurus Panjang Hitam",  rarity: "common",  priceCoins: 30,  img: "assets/items/hair-long-straight-black.png" },
    { id: "hair-long-straight-blonde", name: "Lurus Panjang Perang", rarity: "common", priceCoins: 30,  img: "assets/items/hair-long-straight-blonde.png" },
    { id: "hair-braids-red",       name: "Kepang Merah",         rarity: "rare",      priceCoins: 100, img: "assets/items/hair-braids-red.png" },
    { id: "hair-braids-black",     name: "Kepang Hitam",         rarity: "rare",      priceCoins: 100, img: "assets/items/hair-braids-black.png" },
    { id: "hair-ponytail-brown",   name: "Kuncir Coklat",        rarity: "common",    priceCoins: 30,  img: "assets/items/hair-ponytail-brown.png" },
    { id: "hair-ponytail-blonde",  name: "Kuncir Perang",        rarity: "common",    priceCoins: 30,  img: "assets/items/hair-ponytail-blonde.png" },
    { id: "hair-pigtails-ginger",  name: "Tokok Jinjang",        rarity: "rare",      priceCoins: 100, img: "assets/items/hair-pigtails-ginger.png" },
    { id: "hair-afro-black",       name: "Afro Hitam",           rarity: "common",    priceCoins: 30,  img: "assets/items/hair-afro-black.png" },
    { id: "hair-afro-brown",       name: "Afro Coklat",          rarity: "common",    priceCoins: 30,  img: "assets/items/hair-afro-brown.png" },
    { id: "hair-mohawk-black-red", name: "Mohawk Hitam-Merah",   rarity: "rare",      priceCoins: 100, img: "assets/items/hair-mohawk-black-red.png" },
    { id: "hair-spiky-blue",       name: "Berduri Biru",         rarity: "rare",      priceCoins: 100, img: "assets/items/hair-spiky-blue.png" },
    { id: "hair-spiky-green",      name: "Berduri Hijau",        rarity: "rare",      priceCoins: 100, img: "assets/items/hair-spiky-green.png" },
    { id: "hair-buzz-black",       name: "Cepak Hitam",          rarity: "common",    priceCoins: 30,  img: "assets/items/hair-buzz-black.png" },
    { id: "hair-bun-black",        name: "Sanggul Hitam",        rarity: "common",    priceCoins: 30,  img: "assets/items/hair-bun-black.png" },
    { id: "hair-space-buns-purple",name: "Sanggul Angkasa",      rarity: "rare",      priceCoins: 100, img: "assets/items/hair-space-buns-purple.png" },
    { id: "hair-beach-blonde",     name: "Gaya Pantai Perang",   rarity: "common",    priceCoins: 30,  img: "assets/items/hair-beach-blonde.png" },
    { id: "hair-beach-brown",      name: "Gaya Pantai Coklat",   rarity: "common",    priceCoins: 30,  img: "assets/items/hair-beach-brown.png" },
    { id: "hair-pixie-silver",     name: "Pixie Perak",          rarity: "rare",      priceCoins: 100, img: "assets/items/hair-pixie-silver.png" },
    { id: "hair-bangs-brown",      name: "Poni Coklat",          rarity: "common",    priceCoins: 30,  img: "assets/items/hair-bangs-brown.png" },
    { id: "hair-bangs-black",      name: "Poni Hitam",           rarity: "common",    priceCoins: 30,  img: "assets/items/hair-bangs-black.png" },
    { id: "hair-viking-blonde",    name: "Viking Perang",        rarity: "legendary", priceGems:  25, img: "assets/items/hair-viking-blonde.png" },
    { id: "hair-regal-white",      name: "Diraja Putih",         rarity: "legendary", priceGems:  25, img: "assets/items/hair-regal-white.png" },
    { id: "hair-rainbow",          name: "Pelangi",              rarity: "legendary", priceGems:  25, img: "assets/items/hair-rainbow.png" },
    { id: "hair-mermaid-teal",     name: "Puteri Duyung",        rarity: "legendary", priceGems:  25, img: "assets/items/hair-mermaid-teal.png" },
    { id: "hair-fire-orange",      name: "Api Bergaya",          rarity: "legendary", priceGems:  25, img: "assets/items/hair-fire-orange.png" },
    { id: "hair-messy-brown",      name: "Bergelak Coklat",      rarity: "common",    priceCoins: 30,  img: "assets/items/hair-messy-brown.png" },
  ],

  // FACE (8) — expression overlay on the muzzle.
  face: [
    { id: "face-smile",      name: "Senyum",        rarity: "common",    priceCoins: 20,  img: "assets/items/face-smile.png" },
    { id: "face-grin",       name: "Ketawa Lebar",  rarity: "common",    priceCoins: 20,  img: "assets/items/face-grin.png" },
    { id: "face-wink",       name: "Kenyit",        rarity: "common",    priceCoins: 20,  img: "assets/items/face-wink.png" },
    { id: "face-surprised",  name: "Terkejut",      rarity: "common",    priceCoins: 20,  img: "assets/items/face-surprised.png" },
    { id: "face-angry",      name: "Marah",         rarity: "common",    priceCoins: 20,  img: "assets/items/face-angry.png" },
    { id: "face-tongue",     name: "Julur Lidah",   rarity: "common",    priceCoins: 20,  img: "assets/items/face-tongue.png" },
    { id: "face-cute",       name: "Comel",         rarity: "common",    priceCoins: 20,  img: "assets/items/face-cute.png" },
    { id: "face-cool",       name: "Gaya",          rarity: "rare",      priceCoins: 100, img: "assets/items/face-cool.png" },
  ],

  // PANTS (8) — hips + upper legs, under shirt hem.
  pants: [
    { id: "pants-jeans-blue",      name: "Seluar Jeans Biru",   rarity: "common",    priceCoins: 40,  img: "assets/items/pants-jeans-blue.png" },
    { id: "pants-jeans-black",     name: "Seluar Jeans Hitam",  rarity: "common",    priceCoins: 40,  img: "assets/items/pants-jeans-black.png" },
    { id: "pants-cargo-brown",     name: "Seluar Cargo Coklat", rarity: "common",    priceCoins: 40,  img: "assets/items/pants-cargo-brown.png" },
    { id: "pants-chino-khaki",     name: "Seluar Chino",        rarity: "common",    priceCoins: 40,  img: "assets/items/pants-chino-khaki.png" },
    { id: "pants-denim-shorts",    name: "Seluar Pendek Jeans", rarity: "common",    priceCoins: 40,  img: "assets/items/pants-denim-shorts.png" },
    { id: "pants-sweatpants-grey", name: "Seluar Tracksuit",    rarity: "common",    priceCoins: 40,  img: "assets/items/pants-sweatpants-grey.png" },
    { id: "pants-sport-shorts-red",name: "Seluar Sukan",        rarity: "common",    priceCoins: 40,  img: "assets/items/pants-sport-shorts-red.png" },
    { id: "pants-camo",            name: "Seluar Camo",         rarity: "rare",      priceCoins: 100, img: "assets/items/pants-camo.png" },
  ],

  // SHOES (8) — both feet in one image, over pants bottom.
  shoes: [
    { id: "shoes-sneakers-red",   name: "Kasut Sukan Merah", rarity: "common",    priceCoins: 40,  img: "assets/items/shoes-sneakers-red.png" },
    { id: "shoes-sneakers-blue",  name: "Kasut Sukan Biru",  rarity: "common",    priceCoins: 40,  img: "assets/items/shoes-sneakers-blue.png" },
    { id: "shoes-boots-black",    name: "But Hitam",         rarity: "common",    priceCoins: 40,  img: "assets/items/shoes-boots-black.png" },
    { id: "shoes-hiking-brown",   name: "But Hiking",        rarity: "common",    priceCoins: 40,  img: "assets/items/shoes-hiking-brown.png" },
    { id: "shoes-rainboots-yellow",name:"But Hujan Kuning",  rarity: "common",    priceCoins: 40,  img: "assets/items/shoes-rainboots-yellow.png" },
    { id: "shoes-sandals-brown",  name: "Sandal Coklat",     rarity: "common",    priceCoins: 40,  img: "assets/items/shoes-sandals-brown.png" },
    { id: "shoes-hightops-white", name: "Kasut Tinggi",      rarity: "rare",      priceCoins: 100, img: "assets/items/shoes-hightops-white.png" },
    { id: "shoes-flipflops-blue", name: "Selipar Biru",      rarity: "common",    priceCoins: 40,  img: "assets/items/shoes-flipflops-blue.png" },
  ],

  // GLASSES (8) — over the eyes.
  glasses: [
    { id: "glasses-round",          name: "Cermin Bulat",    rarity: "rare",      priceCoins: 100, img: "assets/items/glasses-round.png" },
    { id: "glasses-square-black",   name: "Cermin Petak",    rarity: "rare",      priceCoins: 100, img: "assets/items/glasses-square-black.png" },
    { id: "glasses-aviator-gold",   name: "Aviator Emas",    rarity: "rare",      priceCoins: 100, img: "assets/items/glasses-aviator-gold.png" },
    { id: "glasses-wayfarer-black", name: "Wayfarer Hitam",  rarity: "rare",      priceCoins: 100, img: "assets/items/glasses-wayfarer-black.png" },
    { id: "glasses-cateye-red",     name: "Mata Kucing",     rarity: "rare",      priceCoins: 100, img: "assets/items/glasses-cateye-red.png" },
    { id: "glasses-3d-redblue",     name: "Cermin 3D",       rarity: "legendary", priceGems:  25, img: "assets/items/glasses-3d-redblue.png" },
    { id: "glasses-heart-pink",     name: "Hati Merah Jambu",rarity: "legendary", priceGems:  25, img: "assets/items/glasses-heart-pink.png" },
    { id: "glasses-star-purple",    name: "Bintang Ungu",    rarity: "legendary", priceGems:  25, img: "assets/items/glasses-star-purple.png" },
  ],

  // ACCESSORY (8) — small foreground flair over everything except bangs.
  accessory: [
    { id: "acc-earrings-hoop-gold", name: "Anting Emas",     rarity: "rare",      priceCoins: 100, img: "assets/items/acc-earrings-hoop-gold.png" },
    { id: "acc-scarf-red",          name: "Syal Merah",      rarity: "common",    priceCoins: 40,  img: "assets/items/acc-scarf-red.png" },
    { id: "acc-necklace-chain-gold",name: "Kalung Emas",     rarity: "rare",      priceCoins: 100, img: "assets/items/acc-necklace-chain-gold.png" },
    { id: "acc-badge-star-gold",    name: "Lencana Bintang", rarity: "rare",      priceCoins: 100, img: "assets/items/acc-badge-star-gold.png" },
    { id: "acc-bowtie-red",         name: "Papita Merah",    rarity: "common",    priceCoins: 40,  img: "assets/items/acc-bowtie-red.png" },
    { id: "acc-crowns-flower",      name: "Mahkota Bunga",   rarity: "legendary", priceGems:  25, img: "assets/items/acc-crowns-flower.png" },
    { id: "acc-medal-gold",         name: "Pingat Emas",     rarity: "legendary", priceGems:  25, img: "assets/items/acc-medal-gold.png" },
    { id: "acc-halo-angel",         name: "Cahaya Malaikat", rarity: "legendary", priceGems:  25, img: "assets/items/acc-halo-angel.png" },
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
