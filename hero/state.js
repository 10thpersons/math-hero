export const GRADES = [1, 2, 3, 4, 5, 6];
export const SAVE_KEY = 'hero-islands-v1';
export const COLORS = { shirts: ['#f4ab3d', '#43a99b', '#ed795a', '#6e8ac9', '#b583b6'], skins: ['#f2c79f', '#cd9464', '#885b40'], hairs: ['#342b28', '#7d5034', '#d8a94c'] };
export const DECORATIONS = [
  { type: 'flower', name: 'Flower patch', cost: 0, icon: 'flower', description: 'A little colour for your corner.' },
  { type: 'tree', name: 'Mango tree', cost: 15, icon: 'tree', description: 'A shady spot for big ideas.' },
  { type: 'bench', name: 'Garden bench', cost: 20, icon: 'home', description: 'Take a well-earned island break.' },
  { type: 'lamp', name: 'Firefly lantern', cost: 25, icon: 'sun', description: 'A warm glow for your garden.' },
  { type: 'flag', name: 'Hero flag', cost: 30, icon: 'flag', description: 'Make this place your own.' },
  { type: 'beachchair', name: 'Beach lounger', cost: 35, icon: 'sun', description: 'A sunny seat beside the sea.' },
  { type: 'picnic', name: 'Picnic table', cost: 50, icon: 'home', description: 'Make room for a picnic with friends.' },
  { type: 'pond', name: 'Lily pond', cost: 65, icon: 'leaf', description: 'A little water garden with floating lilies.' },
  { type: 'arch', name: 'Welcome arch', cost: 75, icon: 'flag', description: 'Give your favourite district an entrance.' },
  { type: 'gazebo', name: 'Garden gazebo', cost: 95, icon: 'home', description: 'A roof, a breeze, a place to gather.' },
  { type: 'fountain', name: 'Splash fountain', cost: 110, icon: 'sun', description: 'Bring a bright little plaza to life.' },
  { type: 'windmill', name: 'Breezy windmill', cost: 140, icon: 'compass', description: 'A tall landmark for your growing island.' },
  { type: 'statue', name: 'Discovery monument', cost: 180, icon: 'star', description: 'Celebrate all the things you have discovered.' },
];
export const ZONES = [
  { id: 'home', name: 'Home garden', cost: 0, start: 0, description: 'Your first little corner.' },
  { id: 'beach', name: 'Sunshine beach', cost: 80, start: 6, description: 'Six new seaside building spots.' },
  { id: 'forest', name: 'Rimba grove', cost: 150, start: 12, description: 'Create a peaceful forest retreat.' },
  { id: 'village', name: 'Discovery village', cost: 240, start: 18, description: 'Build a gathering place for your island.' },
];
export const ACTIVITIES = { bridge: 'Build & Rescue', market: 'Pasar Hero', science: 'Science Lab', history: 'Time Detectives', geography: 'Island Navigator' };
export const COSMETICS = [
  ...[
    ['bow','Coral ribbon bow',25,'hat','A cheerful coral bow for any hairstyle.'],
    ['flowercrown','Meadow flower crown',45,'hat','Pink flowers and fresh green leaves.'],
    ['dress','Lavender adventure dress',45,'outfit','A lavender dress with a sunshine sash.'],
    ['baju_kurung','Turquoise baju kurung',60,'outfit','A turquoise tunic and long skirt with golden trim.'],
  ].map(([id,name,cost,slot,description])=>({id,name,cost,slot,value:id,description,icon:slot==='hat'?'flower':'avatar'})),
  ...[
    ['cat', 'Mango kitten', 35, 'pet', 'A sunny little friend to explore beside you.'],
    ['rabbit', 'Cloud bunny', 45, 'pet', 'Long ears, tiny paws, a big sense of adventure.'],
    ['turtle', 'Lumut turtle', 55, 'pet', 'Take your time together. Discovery is not a race.'],
    ['robot', 'Bolt buddy', 75, 'pet', 'Your very own pocket-sized invention.'],
    ['hornbill', 'Rimba hornbill', 90, 'pet', 'A bright-beaked island companion.'],
    ['dragon', 'Sprout dragon', 120, 'pet', 'A friendly make-believe dragon with little wings.'],
    ['frog', 'Frog bucket hat', 35, 'hat', 'Two curious eyes perched on a leafy green hat.'],
    ['astronaut', 'Moon helmet', 80, 'hat', 'A golden visor for imaginary space adventures.'],
    ['wings', 'Butterfly wings', 65, 'back', 'A pair of lavender wings for your explorer.'],
    ['jetpack', 'Rocket pack', 90, 'back', 'Twin rockets for a space-inspired look.'],
    ['sunglasses', 'Sunshine shades', 30, 'face', 'Teal frames and cool midnight lenses.'],
    ['raincoat', 'Sunshine raincoat', 40, 'outfit', 'A bright yellow coat with big pockets.'],
    ['ranger', 'Rimba ranger', 55, 'outfit', 'Forest-green gear with a discovery badge.'],
    ['spacesuit', 'Star explorer suit', 85, 'outfit', 'A white space suit with a colourful control panel.'],
  ].map(([id,name,cost,slot,description]) => ({id,name,cost,slot,value:id,description,icon:slot==='pet'?'leaf':'star'})),
  { id: 'glasses', name: 'Explorer specs', cost: 20, slot: 'face', value: 'glasses', icon: 'avatar', description: 'A bright new way to see your island.' },
  { id: 'headphones', name: 'Jam headphones', cost: 25, slot: 'hat', value: 'headphones', icon: 'sound', description: 'Big teal headphones, big adventures.' },
  { id: 'backpack', name: 'Trail backpack', cost: 35, slot: 'back', value: 'backpack', icon: 'book', description: 'Packed and ready for discovery.' },
  { id: 'cape', name: 'Hero cape', cost: 40, slot: 'back', value: 'cape', icon: 'flag', description: 'A red cape for your next big moment.' },
  { id: 'crown', name: 'Golden crown', cost: 45, slot: 'hat', value: 'crown', icon: 'star', description: 'A little royal sparkle.' },
  { id: 'wizard', name: 'Wonder wizard hat', cost: 55, slot: 'hat', value: 'wizard', icon: 'sun', description: 'For a head full of brilliant ideas.' },
];
export const SUBJECTS = { math: 'Maths', sains: 'Science', bm: 'Bahasa Melayu', bi: 'English' };
export function makeProfile(id, grade) {
  return { id, name: grade === 1 ? 'Little explorer' : 'Brave builder', grade, coins: 0,
    avatar: { shirt: COLORS.shirts[grade === 1 ? 0 : 1], skin: COLORS.skins[0], hair: COLORS.hairs[0], hat: 'cap', back: 'none', face: 'none' },
    completed: [], sessions: [], decorations: [], owned: ['flower'], ownedCosmetics: [], unlockedZones: ['home'], islandZone: 'home' };
}
export function freshState() { return { version: 1, active: 'explorer-1', sound: true, profiles: [makeProfile('explorer-1', 1), makeProfile('explorer-2', 3)] }; }
export function normalizeState(raw) {
  const base = freshState();
  if (!raw || raw.version !== 1 || !Array.isArray(raw.profiles)) return base;
  base.sound = raw.sound !== false;
  base.profiles = base.profiles.map((fallback) => {
    const p = raw.profiles.find(p => p?.id === fallback.id);
    if (!p) return fallback;
    const avatar = p.avatar || {};
    const unlockedZones = ['home', ...new Set((Array.isArray(p.unlockedZones) ? p.unlockedZones : []).filter(id => id !== 'home' && ZONES.some(z=>z.id===id)))];
    const ownedCosmetics = [...new Set((Array.isArray(p.ownedCosmetics) ? p.ownedCosmetics : []).filter(id => COSMETICS.some(c => c.id === id)))];
    const allowedStyle = (slot,value) => COSMETICS.some(c => c.slot === slot && c.value === value && ownedCosmetics.includes(c.id));
    return { ...fallback, name: typeof p.name === 'string' && p.name.trim() ? p.name.trim().slice(0, 24) : fallback.name,
      grade: GRADES.includes(p.grade) ? p.grade : 1, coins: Number.isSafeInteger(p.coins) && p.coins >= 0 ? p.coins : 0,
      avatar: { character: avatar.character==='girl'?'girl':'boy',
        hairstyle: ['short','bob','ponytail','pigtails'].includes(avatar.hairstyle) ? avatar.hairstyle : 'short',
        shirt: COLORS.shirts.includes(avatar.shirt) ? avatar.shirt : fallback.avatar.shirt,
        skin: COLORS.skins.includes(avatar.skin) ? avatar.skin : fallback.avatar.skin,
        hair: COLORS.hairs.includes(avatar.hair) ? avatar.hair : fallback.avatar.hair,
        hat: ['cap', 'none', 'explorer'].includes(avatar.hat) || allowedStyle('hat',avatar.hat) ? avatar.hat : 'cap',
        back: allowedStyle('back',avatar.back) ? avatar.back : 'none',
        face: allowedStyle('face',avatar.face) ? avatar.face : 'none',
        outfit: allowedStyle('outfit',avatar.outfit) ? avatar.outfit : 'none',
        pet: allowedStyle('pet',avatar.pet) ? avatar.pet : 'none' },
      ownedCosmetics,
      unlockedZones, islandZone: unlockedZones.includes(p.islandZone) ? p.islandZone : 'home',
      completed: Array.isArray(p.completed) ? [...new Set(p.completed.filter(v => /^(bridge|market|science|history|geography)-([1-6])$/.test(v)))] : [],
      sessions: Array.isArray(p.sessions) ? p.sessions.filter(s => (Object.hasOwn(ACTIVITIES,s?.type) || s?.type === 'quiz') && (s.type !== 'quiz' || Object.hasOwn(SUBJECTS,s.subject)) && GRADES.includes(s.grade) && Number.isInteger(s.independent) && s.independent >= 0 && s.independent <= (s.type === 'quiz' ? 5 : 3)).map(s => ({ ...s, rounds: s.type === 'quiz' ? 5 : 3 })).slice(-50) : [],
      owned: ['flower', ...new Set((Array.isArray(p.owned) ? p.owned : []).filter(t => DECORATIONS.some(d => d.type === t)))],
      decorations: Array.isArray(p.decorations) ? p.decorations.filter(d => DECORATIONS.some(c => c.type === d?.type) && Number.isInteger(d.slot) && d.slot >= 0 && d.slot < 24 && unlockedZones.includes(ZONES[Math.floor(d.slot/6)].id)).filter((d,i,a) => a.findIndex(x => x.slot === d.slot) === i).map(d => ({ type: d.type, slot: d.slot, rotation: Number.isInteger(d.rotation) ? ((d.rotation % 4) + 4) % 4 : 0, level: [1,2,3].includes(d.level) ? d.level : 1 })).slice(0,24) : [],
    };
  });
  base.active = base.profiles.some(p => p.id === raw.active) ? raw.active : base.active;
  return base;
}
export function rewardMission(profile, result) {
  if (!Object.hasOwn(ACTIVITIES,result.type) || !GRADES.includes(result.grade) || !Number.isInteger(result.independent) || result.independent < 0 || result.independent > 3) return 0;
  const key = `${result.type}-${result.grade}`;
  const first = !profile.completed.includes(key);
  const earned = first ? 30 : 15;
  if (first) profile.completed.push(key);
  profile.coins += earned;
  profile.sessions.push({ type: result.type, grade: result.grade, rounds: 3, independent: result.independent, hints: result.hints, earned, date: new Date().toISOString() });
  profile.sessions = profile.sessions.slice(-50);
  return earned;
}
export function rewardQuiz(profile, result) {
  if (result.rounds !== 5 || !Object.hasOwn(SUBJECTS,result.subject) || !GRADES.includes(result.grade) || !Number.isInteger(result.independent) || result.independent < 0 || result.independent > 5) return 0;
  const earned = 10 + result.independent * 3;
  profile.coins += earned;
  profile.sessions.push({ type: 'quiz', subject: result.subject, grade: result.grade, rounds: 5, independent: result.independent, hints: result.hints, earned, date: new Date().toISOString() });
  profile.sessions = profile.sessions.slice(-50);
  return earned;
}
export function buyCosmetic(profile, id) {
  const item = COSMETICS.find(c => c.id === id);
  if (!item) return false;
  if (profile.ownedCosmetics.includes(id)) return true;
  if (profile.coins < item.cost) return false;
  profile.coins -= item.cost; profile.ownedCosmetics.push(id); return true;
}
export function equipCosmetic(profile, id) {
  const item = COSMETICS.find(c => c.id === id);
  if (!item || !profile.ownedCosmetics.includes(id)) return false;
  profile.avatar[item.slot] = item.value; return true;
}
export function buyDecoration(profile, type) {
  const item = DECORATIONS.find(d => d.type === type);
  if (!item) return false;
  if (profile.owned.includes(type)) return true;
  if (profile.coins < item.cost) return false;
  profile.coins -= item.cost; profile.owned.push(type); return true;
}
export function unlockZone(profile, id) {
  const zone=ZONES.find(z=>z.id===id);
  if(!zone)return false;
  if(profile.unlockedZones.includes(id))return true;
  if(profile.coins<zone.cost)return false;
  profile.coins-=zone.cost;profile.unlockedZones.push(id);return true;
}
export function upgradeCost(item) {
  const level=item?.level || 1;
  return level>=3 ? 0 : Math.max(20,Math.ceil((DECORATIONS.find(d=>d.type===item?.type)?.cost || 0)/2)) * level;
}
export function upgradeDecoration(profile, slot) {
  const item=profile.decorations.find(d=>d.slot===slot);
  if(!item || (item.level||1)>=3)return false;
  const cost=upgradeCost(item);
  if(profile.coins<cost)return false;
  profile.coins-=cost;item.level=(item.level||1)+1;return true;
}
