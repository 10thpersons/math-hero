import * as THREE from './vendor/three.module.js';

// A small, original toy world. Shared geometries keep the island inexpensive to draw.
export function createWorld(container, { onSelect, onPlotSlot, onPlotUpdate, reducedMotion = false } = {}) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-12, 12, 9, -9, 0.1, 100);
  camera.position.set(17, 19, 24);
  camera.lookAt(0, 0.7, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-label', 'Hero Island: a tropical village with a bridge, pasar and your home');
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y;';
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xe6ffff, 0x658c6e, 2.4));
  const sun = new THREE.DirectionalLight(0xfff0ce, 3.1);
  sun.position.set(-7, 18, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 0.5, far: 45 });
  sun.shadow.normalBias = 0.035;
  scene.add(sun);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const leafGeometry = new THREE.IcosahedronGeometry(1, 0);
  const materials = new Map();
  const geometries = new Set([boxGeometry, leafGeometry]);
  const material = (color) => {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }));
    return materials.get(color);
  };
  function block(parent, x, y, z, w, h, d, color) {
    const mesh = new THREE.Mesh(boxGeometry, material(color));
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function puff(parent, x, y, z, radius, color, scale = [1, 1, 1]) {
    const mesh = new THREE.Mesh(leafGeometry, material(color));
    mesh.position.set(x, y, z);
    mesh.scale.set(radius * scale[0], radius * scale[1], radius * scale[2]);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function group(x = 0, y = 0, z = 0, parent = scene) {
    const result = new THREE.Group();
    result.position.set(x, y, z);
    parent.add(result);
    return result;
  }
  const land = group();
  block(land, 0, -0.65, 0, 14.1, 1.1, 10.7, '#b68451');
  block(land, 0, -0.04, 0, 14.5, 0.36, 11.1, '#efd18d');
  block(land, 0, 0.2, 0, 13.8, 0.26, 10.4, '#8fca69');
  block(land, 0.4, 0.36, -2.8, 12.6, 0.2, 4.3, '#9ed875');
  // Squared sandy shelves soften the silhouette without expensive terrain meshes.
  block(land, -0.5, -0.1, 5.45, 10.8, 0.3, 0.8, '#f2d99f');
  block(land, 7.1, -0.2, 0.2, 0.8, 0.25, 7.6, '#f2d99f');
  block(land, -7.05, -0.2, -0.3, 0.7, 0.25, 7.6, '#f2d99f');
  for (let i = 0; i < 11; i++) block(land, -6 + i * 1.2, -0.5, 5.38, 0.72, 0.28, 0.1, i % 2 ? '#c79961' : '#a67549');

  // The river flows between the learning areas and under the wooden bridge.
  block(scene, -1.95, 0.345, 0, 2.1, 0.035, 10.5, '#42bbcf');
  block(scene, -1.95, 0.37, -1.8, 1.5, 0.015, 6.8, '#6fd6dd');
  for (let i = 0; i < 9; i++) block(scene, -3.03, 0.4, -4.65 + i * 1.14, 0.17, 0.18, 0.7, '#d1d5a3');
  block(scene, 2.6, 0.36, 1.5, 7.7, 0.04, 1.12, '#f0dcaa');
  block(scene, 2.15, 0.37, -0.15, 1.08, 0.04, 3.5, '#f0dcaa');
  block(scene, -4.2, 0.36, 1.5, 2.6, 0.04, 1.12, '#f0dcaa');
  for (let i = 0; i < 9; i++) block(scene, -0.1 + i * 0.68, 0.4, 1.48, 0.31, 0.012, 0.36, '#e5cc95');

  const clickable = [];
  function landmark(object, id) {
    object.userData.location = id;
    clickable.push(object);
  }
  const bridge = group(-1.95, 0.45, 1.5);
  for (let i = 0; i < 10; i++) block(bridge, -1.35 + i * 0.3, 0, 0, 0.27, 0.14, 1.45, i % 2 ? '#c68f50' : '#d9a766');
  for (const z of [-0.78, 0.78]) {
    for (const x of [-1.45, 0, 1.45]) block(bridge, x, 0.36, z, 0.14, 0.92, 0.14, '#905f39');
    block(bridge, 0, 0.65, z, 3.1, 0.11, 0.11, '#f1c080');
  }
  landmark(bridge, 'bridge');

  const market = group(-4.8, 0.4, -1.3);
  block(market, 0, 0.2, 0, 2.55, 0.4, 1.75, '#ba7852');
  block(market, 0, 0.8, 0.48, 2.45, 0.7, 0.62, '#e6ae67');
  block(market, 0, 1.19, 0.45, 2.65, 0.14, 0.87, '#f8dfaa');
  for (const x of [-1.1, 1.1]) for (const z of [-0.62, 0.7]) block(market, x, 1.3, z, 0.12, 2.4, 0.12, '#835e43');
  for (let i = 0; i < 8; i++) {
    const awning = block(market, -1.4 + i * 0.4, 2.45, 0, 0.4, 0.14, 2.05, i % 2 ? '#ffe3a1' : '#f36e54');
    awning.rotation.x = -0.1;
    block(market, -1.4 + i * 0.4, 2.3, 1.02, 0.4, 0.35, 0.08, i % 2 ? '#ffe3a1' : '#f36e54');
  }
  for (let i = 0; i < 9; i++) puff(market, -0.83 + (i % 3) * 0.27, 1.33 + Math.floor(i / 3) * 0.03, 0.24 + Math.floor(i / 3) * 0.22, 0.16, '#ed8251');
  for (let i = 0; i < 6; i++) puff(market, 0.35 + (i % 3) * 0.26, 1.37, 0.32 + Math.floor(i / 3) * 0.25, 0.18, '#a2bb45');
  block(market, -1.72, 0.28, 0.55, 0.5, 0.5, 0.65, '#aa7b50');
  puff(market, -1.72, 0.6, 0.55, 0.32, '#efb34d');
  landmark(market, 'market');

  const home = group(3.7, 0.46, -2.2);
  block(home, 0, 0.03, 0.25, 4.35, 0.12, 3.5, '#bad97d');
  block(home, 0, 0.3, 0, 2.5, 0.6, 2, '#bc9766');
  block(home, 0, 1.18, 0, 2.45, 1.5, 2, '#fff0c4');
  block(home, 0, 1.9, 0, 2.6, 0.15, 2.1, '#f5d397');
  for (const side of [-1, 1]) {
    const roof = block(home, side * 0.69, 2.38, 0, 1.8, 0.19, 2.65, '#278f92');
    roof.rotation.z = side * -0.48;
    for (let i = 0; i < 7; i++) {
      const rib = block(home, side * 0.69, 2.48, -1.14 + i * 0.38, 1.8, 0.035, 0.04, '#40a5a3');
      rib.rotation.z = side * -0.48;
    }
  }
  block(home, 0, 1.01, 1.015, 0.58, 1.35, 0.05, '#a57148');
  block(home, 0.18, 1.0, 1.06, 0.07, 0.07, 0.07, '#ffd16e');
  for (const x of [-0.84, 0.84]) {
    block(home, x, 1.34, 1.025, 0.55, 0.62, 0.07, '#d5a976');
    block(home, x, 1.34, 1.072, 0.41, 0.46, 0.035, '#8cdce1');
    block(home, x, 1.34, 1.096, 0.035, 0.48, 0.025, '#fff3d5');
    block(home, x, 1.34, 1.096, 0.44, 0.035, 0.025, '#fff3d5');
  }
  block(home, 0, 0.16, 1.35, 1.05, 0.24, 0.6, '#e4c594');
  for (let i = 0; i < 7; i++) block(home, -1.95 + i * 0.65, 0.42, -1.65, 0.12, 0.85, 0.12, '#fff0cb');
  block(home, 0, 0.55, -1.65, 4.1, 0.11, 0.1, '#fff0cb');
  landmark(home, 'home');

  function tree(parent, x, z, scale = 1) {
    const t = group(x, 0, z, parent);
    t.scale.setScalar(scale);
    block(t, 0, 0.67, 0, 0.29, 1.35, 0.3, '#9a7145');
    puff(t, 0, 1.75, 0, 0.95, '#4ba764', [1, 1.2, 1]);
    puff(t, -0.46, 1.5, 0.2, 0.62, '#64b65d');
    puff(t, 0.35, 2.2, 0.05, 0.59, '#80c76a');
    return t;
  }
  [[-5.9, -4, 1.1], [-3.75, -4, 0.9], [0, -4.3, 1.15], [6.1, -3.8, 0.8], [-0.1, -2.7, 0.75]].forEach(([x,z,s]) => tree(group(0, 0.45, 0), x,z,s));
  function palm(x, z, scale = 1) {
    const p = group(x, 0.32, z);
    p.scale.setScalar(scale);
    const trunk = block(p, 0, 1.25, 0, 0.24, 2.5, 0.25, '#ba9768');
    trunk.rotation.z = -0.12;
    for (let i = 0; i < 5; i++) {
      const frond = group(0.15, 2.43, 0, p);
      frond.rotation.y = i * Math.PI * 0.4;
      const leaf = block(frond, 0, 0, 0.65, 0.48, 0.13, 1.6, i % 2 ? '#49a665' : '#6cb858');
      leaf.rotation.x = 0.25;
      const tip = block(frond, 0, -0.26, 1.38, 0.29, 0.1, 0.55, '#49a665');
      tip.rotation.x = 0.6;
    }
    puff(p, 0.13, 2.2, 0.18, 0.21, '#977d43');
    puff(p, 0.35, 2.24, -0.13, 0.19, '#a08a48');
  }
  palm(-5.7, 3.8, 1.1); palm(6.3, -1.5, 0.95);
  function flower(parent, x, z, color = '#f994b4') {
    block(parent, x, 0.18, z, 0.035, 0.35, 0.035, '#488f54');
    block(parent, x, 0.36, z, 0.24, 0.08, 0.1, color);
    block(parent, x, 0.36, z, 0.1, 0.08, 0.24, color);
    block(parent, x, 0.41, z, 0.09, 0.04, 0.09, '#ffe099');
  }
  const flowers = group(0, 0.4, 0);
  for (let i = 0; i < 22; i++) {
    const x = i < 10 ? -6.2 + (i % 5) * 0.42 : 2.6 + (i % 6) * 0.45;
    const z = i < 10 ? 2.65 + Math.floor(i / 5) * 0.36 : 4.35 + (i % 2) * 0.35;
    flower(flowers, x, z, ['#fbba53', '#fff1c6', '#f78eab'][i % 3]);
  }
  for (const [x,z] of [[-3.6,3.8],[0.2,3.8],[6.5,2.4],[-6.2,-2.8]]) puff(scene,x,0.57,z,0.37,'#b7c2ae',[1.3,0.7,1]);
  const sign = group(0.4, 0.4, 1.95);
  block(sign, 0, 0.6, 0, 0.12, 1.2, 0.12, '#967147');
  block(sign, 0, 1.05, 0, 0.8, 0.28, 0.1, '#f8d56d').rotation.z = 0.08;
  block(sign, 0, 0.72, 0, 0.65, 0.22, 0.1, '#75c8bd').rotation.z = -0.1;
  // Village bunting.
  for (let i = 0; i < 7; i++) {
    const pennant = block(scene, -6.3 + i * 0.47, 3.22 - Math.sin(i / 6 * Math.PI) * 0.24, -0.2, 0.26, 0.32, 0.035, ['#ffbd5f','#f78c89','#70c5c0'][i % 3]);
    pennant.rotation.z = 0.1;
  }
  for (const x of [-6.65, -3.2]) block(scene, x, 1.79, -0.2, 0.075, 2.9, 0.075, '#9b754b');
  block(scene, 3, 0.03, 6.0, 1.25, 0.16, 2.35, '#a97c4e');
  for (let i = 0; i < 8; i++) block(scene, 3, 0.14, 5.1 + i * 0.27, 1.32, 0.08, 0.23, '#d8ac75');
  for (const z of [5.3, 6.8]) for (const x of [2.35, 3.65]) block(scene, x, 0.25, z, 0.12, 0.75, 0.12, '#926342');
  const boat = group(4.6, -0.07, 6.1);
  boat.rotation.y = 0.3;
  block(boat, 0, 0.14, 0, 0.9, 0.22, 1.9, '#ed805c');
  block(boat, 0, 0.29, 0, 0.62, 0.12, 1.55, '#ffcf88');
  for (const x of [-0.44, 0.44]) block(boat, x, 0.36, 0, 0.12, 0.24, 1.9, '#f09866');
  block(boat, 0, 0.4, 0, 0.85, 0.1, 0.3, '#b57850');
  block(boat, 0, 1.17, -0.3, 0.075, 1.65, 0.075, '#9c7554');
  const sailGeometry = new THREE.BufferGeometry();
  sailGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0, 0,1.15,0, 0.85,0,0],3));
  sailGeometry.computeVertexNormals(); geometries.add(sailGeometry);
  const sailMaterial = new THREE.MeshStandardMaterial({ color:'#fff0cb', side:THREE.DoubleSide, roughness:1 });
  materials.set('sail',sailMaterial);
  const sail = new THREE.Mesh(sailGeometry,sailMaterial); sail.position.set(0,0.9,-0.3); boat.add(sail);

  const ripples = [];
  for (let i = 0; i < 18; i++) {
    const x = i < 8 ? -1.95 + Math.sin(i * 3) * 0.5 : -8 + (i - 8) * 1.8;
    const z = i < 8 ? -4.5 + i * 1.25 : 6.1 + (i % 3) * 0.8;
    const r = block(scene, x, i < 8 ? 0.399 : -0.18, z, 0.38 + (i % 3)*0.12, 0.012, 0.04, '#b0edef');
    r.castShadow = false; ripples.push(r);
  }
  const clouds = [];
  for (const [x,y,z,s] of [[-6,5,-5,0.65],[3,6,-6,0.8],[8,4,-1,0.5]]) {
    const cloud = group(x,y,z); cloud.scale.setScalar(s);
    puff(cloud,0,0,0,1,'#fff9e8',[1.7,0.48,0.65]);
    puff(cloud,-0.4,0.3,0,0.66,'#ffffff'); puff(cloud,0.5,0.2,0,0.5,'#ffffff');
    cloud.traverse(o => { o.castShadow = false; }); clouds.push(cloud);
  }
  const birds = [];
  for (let i = 0; i < 3; i++) {
    const b = group(-2+i*1.1,5+i*0.24,-4+i*0.4);
    for (const side of [-1,1]) block(b,side*0.16,0,0,0.34,0.035,0.09,'#517d7d').rotation.z=side*0.3;
    birds.push(b);
  }

  const avatar = group(0.8, 0.42, 1.6);
  avatar.rotation.y = 0.35;
  const shirt = new THREE.MeshStandardMaterial({ color:'#f5ba4a', roughness:1 });
  const skin = new THREE.MeshStandardMaterial({ color:'#c98e62', roughness:1 });
  const hair = new THREE.MeshStandardMaterial({ color:'#39302f', roughness:1 });
  materials.set('avatar-shirt',shirt); materials.set('avatar-skin',skin); materials.set('avatar-hair',hair);
  function body(x,y,z,w,h,d,mat) { const mesh=block(avatar,x,y,z,w,h,d,'#fff'); mesh.material=mat; return mesh; }
  body(0,0.79,0,0.52,0.59,0.31,shirt);
  body(0,1.32,0,0.49,0.48,0.44,skin);
  body(0,1.56,-0.02,0.53,0.15,0.48,hair);
  body(-0.21,1.4,-0.04,0.09,0.23,0.42,hair);
  for (const x of [-0.1,0.1]) block(avatar,x,1.34,0.23,0.05,0.065,0.018,'#353237');
  block(avatar,0,1.2,0.23,0.105,0.026,0.02,'#7f4e3c');
  const limbs=[];
  for (const side of [-1,1]) {
    const leg=group(side*0.145,0.49,0,avatar);
    block(leg,0,-0.2,0,0.22,0.4,0.26,'#3e727f');
    block(leg,0,-0.43,0.045,0.24,0.13,0.36,'#fff2d2'); limbs.push(leg);
    const arm=group(side*0.37,1.04,0,avatar);
    const sleeve=block(arm,0,-0.11,0,0.2,0.27,0.28,'#fff'); sleeve.material=shirt;
    const hand=block(arm,0,-0.33,0,0.18,0.2,0.23,'#fff'); hand.material=skin; limbs.push(arm);
  }
  const hat = group(0,1.67,0,avatar);
  block(hat,0,0,0,0.65,0.1,0.6,'#eabc64');
  block(hat,0,0.12,0,0.45,0.2,0.43,'#f6d689');
  block(hat,0,0.055,0,0.46,0.06,0.44,'#8a6845');
  hat.visible=false;
  const cap = group(0,1.64,0,avatar);
  block(cap,0,0.06,-0.01,0.53,0.2,0.46,'#428ca1');
  block(cap,0,-0.025,0.24,0.49,0.07,0.29,'#317c91');
  block(cap,0,0.055,0.227,0.1,0.09,0.02,'#ffe19c');
  cap.visible=false;
  const crown=group(0,1.66,0,avatar);
  block(crown,0,0,0,0.57,0.15,0.5,'#f8cb55');
  for(const x of [-0.22,0,0.22]) block(crown,x,0.15,0.19,0.1,0.23,0.1,'#ffdc72');
  block(crown,0,0.015,0.26,0.12,0.11,0.035,'#5ed2cb');
  const wizard=group(0,1.64,0,avatar);
  block(wizard,0,0,0,0.71,0.08,0.65,'#52739e');
  for(let i=0;i<4;i++) block(wizard,-i*0.035,0.12+i*0.14,0,0.46-i*0.095,0.16,0.43-i*0.085,'#6486b4');
  block(wizard,0,0.18,0.23,0.1,0.12,0.02,'#ffe298');
  const headphones=group(0,1.37,0,avatar);
  block(headphones,0,0.27,0,0.66,0.08,0.13,'#488b82');
  for(const side of [-1,1]) { block(headphones,side*0.29,0.12,0,0.07,0.31,0.13,'#488b82'); block(headphones,side*0.3,-0.015,0,0.15,0.24,0.26,'#34736c'); }
  const cape=group(0,0.89,-0.22,avatar);
  block(cape,0,-0.06,-0.07,0.55,0.63,0.07,'#e46e74').rotation.x=-0.2;
  block(cape,0,-0.34,-0.14,0.63,0.1,0.07,'#f1848b');
  const backpack=group(0,0.81,-0.25,avatar);
  block(backpack,0,0,0,0.4,0.47,0.19,'#cf9a5e'); block(backpack,0,-0.1,-0.12,0.3,0.18,0.1,'#e1b77c');
  block(backpack,0,0.18,-0.105,0.28,0.055,0.04,'#f4d490');
  const glasses=group(0,1.34,0.25,avatar);
  for(const side of [-1,1]) {
    for(const y of [-0.065,0.065]) block(glasses,side*0.115,y,0,0.185,0.025,0.027,'#3d535d');
    for(const x of [side*0.115-0.08,side*0.115+0.08]) block(glasses,x,0,0,0.025,0.14,0.027,'#3d535d');
  }
  block(glasses,0,0.015,0,0.055,0.025,0.03,'#3d535d');
  [crown,wizard,headphones,cape,backpack,glasses].forEach(o=>o.visible=false);

  const wardrobe = {hat:{},back:{},face:{},outfit:{}};
  const frog = wardrobe.hat.frog = group(0,1.68,0,avatar);
  block(frog,0,0,0,.7,.09,.62,'#78b765');
  block(frog,0,.12,0,.5,.23,.46,'#92cf79');
  for(const side of [-1,1]) {
    block(frog,side*.17,.26,.12,.15,.16,.15,'#92cf79');
    block(frog,side*.17,.27,.205,.065,.07,.025,'#244b3b');
  }
  const helmet = wardrobe.hat.astronaut = group(0,1.43,0,avatar);
  block(helmet,0,.08,-.12,.68,.61,.44,'#eef4ed');
  block(helmet,0,.08,.24,.54,.36,.08,'#e8bb5d');
  block(helmet,-.15,.16,.289,.12,.13,.02,'#fff2bf');
  for(const side of [-1,1]) block(helmet,side*.34,.02,.04,.12,.29,.28,'#75aab3');
  const wings = wardrobe.back.wings = group(0,.95,-.27,avatar);
  for(const side of [-1,1]) {
    puff(wings,side*.43,.13,0,.43,'#b098db',[1,1.2,.18]);
    puff(wings,side*.32,-.28,0,.28,'#e6b0d2',[1,1,.2]);
  }
  const jetpack = wardrobe.back.jetpack = group(0,.9,-.3,avatar);
  block(jetpack,0,0,0,.43,.4,.2,'#678793');
  for(const side of [-1,1]) {
    block(jetpack,side*.22,0,-.07,.18,.56,.23,'#d8e5e5');
    block(jetpack,side*.22,-.31,-.07,.13,.1,.16,'#eeaf50');
  }
  const shades = wardrobe.face.sunglasses = group(0,1.34,.26,avatar);
  block(shades,0,0,0,.45,.035,.045,'#439e99');
  for(const side of [-1,1]) {
    block(shades,side*.115,0,0,.21,.17,.035,'#439e99');
    block(shades,side*.115,0,.025,.15,.11,.025,'#283e55');
  }
  for(const [id,color] of [['raincoat','#efbf4f'],['ranger','#56896d'],['spacesuit','#e7eded']]) {
    const outfit = wardrobe.outfit[id] = group(0,.86,0,avatar);
    block(outfit,0,0,.01,.57,.58,.42,color);
    block(outfit,0,0,.23,.025,.5,.02,id==='spacesuit'?'#719ea7':'#e6dcba');
    if(id==='spacesuit') {
      block(outfit,0,.1,.24,.28,.2,.04,'#567d93');
      for(const side of [-1,1]) block(outfit,side*.07,.1,.269,.045,.055,.02,side<0?'#f3b65c':'#8cd8bc');
    } else {
      for(const side of [-1,1]) block(outfit,side*.15,-.15,.235,.14,.13,.03,id==='ranger'?'#c6ba82':'#ffdb7d');
      if(id==='ranger') block(outfit,-.16,.15,.24,.09,.1,.025,'#f3cf71');
    }
  }
  const companion = group(1.7,.45,1.8);
  companion.name='hero-companion';
  const pets = {};
  for(const [id,color] of [['cat','#edb16c'],['rabbit','#eee4db'],['turtle','#86b889'],['robot','#79bbc0'],['hornbill','#374d5e'],['dragon','#b39aca']]) {
    const pet=pets[id]=group(0,0,0,companion);
    block(pet,0,.28,0,.4,.32,.5,color);
    block(pet,0,.55,.16,.43,.35,.35,color);
    for(const side of [-1,1]) {
      block(pet,side*.115,.59,.342,.055,.065,.022,'#273d3b');
      for(const z of [-.15,.2]) block(pet,side*.15,.07,z,.12,.14,.13,color);
    }
    block(pet,0,.48,.35,.065,.04,.025,'#b9766c');
    if(id==='cat'||id==='rabbit'||id==='dragon') {
      for(const side of [-1,1]) block(pet,side*.15,id==='rabbit'?.92:.79,.14,.11,id==='rabbit'?.45:.19,.13,color).rotation.z=side*-.13;
      block(pet,0,.29,-.34,.11,.12,.31,color).rotation.x=-.3;
    }
    if(id==='turtle') {
      puff(pet,0,.4,-.08,.35,'#447c61',[1.2,.8,1.3]);
      block(pet,0,.66,-.1,.18,.035,.23,'#d7d797');
    }
    if(id==='robot') {
      block(pet,0,.82,.15,.035,.19,.035,'#52757d');
      block(pet,0,.93,.15,.11,.09,.11,'#edbd65');
      block(pet,0,.3,.26,.14,.13,.025,'#f6d376');
    }
    if(id==='hornbill') {
      block(pet,0,.52,.43,.18,.14,.28,'#e7a443');
      block(pet,0,.75,.28,.2,.16,.25,'#f2bb58');
      block(pet,0,.29,.25,.3,.26,.03,'#ede8d5');
      for(const side of [-1,1]) block(pet,side*.24,.36,-.04,.09,.29,.35,'#253a48');
    }
    if(id==='dragon') for(const side of [-1,1]) puff(pet,side*.32,.44,-.11,.25,'#d5a4c6',[1,.7,.2]);
    pet.visible=false;
  }
  Object.values(wardrobe).forEach(slot=>Object.values(slot).forEach(item=>item.visible=false));

  const zones={home:{x:3.6,z:2.4,start:0},beach:{x:0,z:10,start:6},forest:{x:-11,z:-1,start:12},village:{x:0,z:-11,start:18}};
  let plotZone='home';
  const decorations = group(0,0.48,0);
  const slots=Object.entries(zones).flatMap(([id,zone])=>Array.from({length:6},(_,i)=>[zone.x+(i%3-1)*(id==='home'?1.45:1.7),zone.z+(i<3?-1:1)*(id==='home'?0.75:0.85)]));
  function boardwalk(x1,z1,x2,z2) {
    const length=Math.hypot(x2-x1,z2-z1), path=group((x1+x2)/2,0.38,(z1+z2)/2);
    path.rotation.y=Math.atan2(x2-x1,z2-z1);
    for(let i=0;i<Math.ceil(length/0.32);i++) block(path,0,0,-length/2+i*0.32,1.05,0.12,0.28,i%2?'#d5aa74':'#e3bc88');
    for(const side of [-1,1]) {
      block(path,side*0.55,0.49,0,0.07,0.08,length,'#f0d1a0');
      for(let i=0;i<=Math.floor(length/1.3);i++) block(path,side*0.55,0.22,-length/2+i*1.3,0.09,0.7,0.09,'#9e7952');
    }
  }
  boardwalk(0,5.1,0,7.9); boardwalk(-6.7,-1,-8,-1); boardwalk(0,-5.1,0,-8.7);
  for(const [id,zone] of Object.entries(zones)) {
    if(id==='home') continue;
    const terrain=group(zone.x,0,zone.z);
    block(terrain,0,-0.55,0,6.8,1,5.1,'#b88f61');
    block(terrain,0,-0.02,0,7.15,0.3,5.45,'#efd59a');
    block(terrain,0,0.21,0,6.7,0.23,5,id==='beach'?'#f7df9f':id==='forest'?'#83ba69':'#b4d488');
    block(terrain,0,0.4,0,5.65,0.1,3.6,id==='beach'?'#f4d48b':id==='forest'?'#99c779':'#c9df99');
    if(id==='beach') { palm(zone.x-2.8,zone.z-1.9,0.67); palm(zone.x+2.9,zone.z+1.7,0.6); }
    if(id==='forest') { tree(group(zone.x,0.4,zone.z),-2.8,-1.95,0.72); tree(group(zone.x,0.4,zone.z),2.75,-1.95,0.62); }
    if(id==='village') {
      for(const side of [-1,1]) {
        const hut=group(zone.x+side*2.85,0.35,zone.z-1.9);
        block(hut,0,0.42,0,0.8,0.84,0.75,'#f5e5b2');
        block(hut,0,0.92,0,1,0.2,0.95,'#df9370');
        block(hut,0,0.28,0.39,0.25,0.55,0.04,'#98784f');
      }
    }
  }
  block(scene,3.6,0.41,2.4,4.65,0.1,3.4,'#a9d782');
  const plotGrid=group(0,0.47,0);
  const plotSquares=slots.map(([x,z],slot)=> {
    const tile=group(0,0,0,plotGrid); tile.visible=slot<6;
    const square=block(tile,x,0,z,1.34,0.035,1.36,'#d4e9a5'); square.userData.slot=slot;
    const edge=group(x,0.035,z,tile);
    for(const side of [-1,1]) {
      block(edge,side*0.67,0,0,0.035,0.025,1.36,'#ffffd5');
      block(edge,0,0,side*0.68,1.34,0.025,0.035,'#ffffd5');
    }
    return square;
  });
  plotGrid.visible=false;
  let plotMode=false;
  const ghost=group(0,0.48,0);
  const ghostMaterials=new Set();
  function clearPreview() {
    ghost.clear(); ghostMaterials.forEach(m=>m.dispose()); ghostMaterials.clear();
    decorations.children.forEach(item=>{ item.visible=true; });
  }
  const decorationTypes=new Set(['flower','tree','lamp','bench','flag','gazebo','pond','fountain','picnic','beachchair','windmill','arch','statue']);
  function makeDecoration(item,parent) {
      if(!decorationTypes.has(item.type)) return null;
      const [x,z]=slots[item.slot]; const d=group(x,0,z,parent);
      d.userData.slot=item.slot;
      d.rotation.y=(Number.isInteger(item.rotation)?item.rotation%4:0)*Math.PI/2;
      d.scale.setScalar(['flower','tree','lamp','bench','flag'].includes(item.type)?1.3:1);
      if(item.type==='flower') {
        block(d,0,0.12,0,0.62,0.24,0.48,'#d78864');
        const bed=group(0,0.23,0,d); for(let i=0;i<3;i++) flower(bed,-0.2+i*0.2,0,['#ffadbd','#ffdc71','#fff0c6'][i]);
      } else if(item.type==='tree') tree(d,0,0,0.48);
      else if(item.type==='lamp') {
        block(d,0,0.58,0,0.08,1.16,0.08,'#527373');
        block(d,0,1.18,0,0.28,0.3,0.28,'#ffe9a0'); block(d,0,1.36,0,0.38,0.08,0.38,'#527373');
      } else if(item.type==='bench') {
        block(d,0,0.3,0,0.72,0.12,0.3,'#d99860'); block(d,0,0.52,-0.13,0.72,0.26,0.08,'#d99860');
        for(const dx of [-0.26,0.26]) block(d,dx,0.15,0,0.09,0.3,0.23,'#826648');
      } else if(item.type==='flag') {
        block(d,0,0.75,0,0.055,1.5,0.055,'#fff2cd'); block(d,0.2,1.3,0,0.4,0.3,0.025,'#f2846d');
        block(d,0.12,1.32,0.02,0.12,0.12,0.02,'#ffe389');
      } else if(item.type==='gazebo') {
        block(d,0,0.07,0,1.15,0.14,1.15,'#e9cf9d');
        for(const x of [-0.43,0.43]) for(const z of [-0.43,0.43]) block(d,x,0.7,z,0.08,1.3,0.08,'#fff0c5');
        block(d,0,1.36,0,1.22,0.16,1.22,'#489c99'); block(d,0,1.51,0,0.9,0.15,0.9,'#67b7aa');
        block(d,0,1.66,0,0.55,0.15,0.55,'#8bcabd');
      } else if(item.type==='pond') {
        block(d,0,0.1,0,1.2,0.2,1.05,'#99aaa1'); block(d,0,0.205,0,1.02,0.025,0.87,'#63c9da');
        puff(d,-0.25,0.25,0.13,0.17,'#88bc65',[1,0.15,1]); flower(group(0,0.2,0,d),0.4,-0.32,'#ffb1c9');
      } else if(item.type==='fountain') {
        block(d,0,0.12,0,1.2,0.24,1.2,'#d5dccc'); block(d,0,0.25,0,1,0.025,1,'#6ac8dc');
        block(d,0,0.58,0,0.21,0.8,0.21,'#eef0dc'); block(d,0,0.9,0,0.67,0.14,0.67,'#d5dccc');
        block(d,0,1.13,0,0.08,0.38,0.08,'#8cdeed'); puff(d,0,1.36,0,0.11,'#b3eff2');
      } else if(item.type==='picnic') {
        block(d,0,0.63,0,1.15,0.1,0.55,'#dba870');
        for(const x of [-0.4,0.4]) block(d,x,0.31,0,0.1,0.62,0.4,'#9b7551');
        for(const z of [-0.44,0.44]) { block(d,0,0.35,z,1.15,0.1,0.21,'#dda86c'); for(const x of [-0.4,0.4])block(d,x,0.15,z,0.08,0.3,0.16,'#9b7551'); }
        block(d,0.15,0.73,0,0.35,0.1,0.3,'#fff0c6'); puff(d,-0.15,0.78,0,0.12,'#ef9471');
      } else if(item.type==='beachchair') {
        block(d,0,0.26,0.15,0.62,0.1,0.7,'#72c7c1');
        const back=block(d,0,0.53,-0.29,0.62,0.7,0.08,'#72c7c1'); back.rotation.x=-0.35;
        for(const x of [-0.29,0.29]) { block(d,x,0.19,0.05,0.07,0.38,0.8,'#efe4c5'); block(d,x,0.5,0.06,0.07,0.07,0.66,'#efe4c5'); }
        block(d,0,0.27,0.2,0.2,0.03,0.65,'#fff0cf');
      } else if(item.type==='windmill') {
        block(d,0,0.62,0,0.55,1.24,0.55,'#ffe2b3'); block(d,0,1.31,0,0.7,0.16,0.7,'#de8669');
        const blades=group(0,1.16,0.34,d); blades.rotation.z=Math.PI/4;
        block(blades,0,0,0,0.12,1.3,0.07,'#fcf5de'); block(blades,0,0,0,1.3,0.12,0.07,'#fcf5de'); puff(blades,0,0,0.07,0.1,'#d0a76c');
        block(d,0,0.25,0.29,0.23,0.5,0.025,'#a87d55');
      } else if(item.type==='arch') {
        for(const x of [-0.48,0.48]) { block(d,x,0.75,0,0.16,1.5,0.18,'#eee8c4'); flower(group(x,0,0,d),0,0.15,'#f6a4b5'); }
        block(d,0,1.48,0,1.17,0.2,0.25,'#72af75');
        for(const x of [-0.4,0,0.4]) puff(d,x,1.58,0,0.16,'#f5aac0');
      } else if(item.type==='statue') {
        block(d,0,0.14,0,0.87,0.28,0.8,'#aac2bd'); block(d,0,0.4,0,0.59,0.24,0.54,'#d7e6d9');
        block(d,0,0.91,0,0.44,0.79,0.37,'#e9c675'); puff(d,0,1.47,0,0.29,'#f1d38a');
        for(const side of [-1,1])block(d,side*0.29,1.07,0,0.14,0.46,0.2,'#e9c675').rotation.z=side*0.45;
      }
      const level=Number.isInteger(item.level)?Math.max(1,Math.min(3,item.level)):1;
      if(level>1) {
        const trim=group(0,0,0,d);
        const size=d.scale.x>1?0.96:1.25;
        block(trim,0,0.035,0,size,0.055,size,'#ebc15f');
        for(let i=0;i<level-1;i++) puff(trim,(i-(level-2)/2)*0.22,0.12,size/2,0.09,'#fff0a1');
      }
      return d;
  }
  function setDecorations(items = []) {
    decorations.clear();
    const used = new Set();
    for (const item of Array.isArray(items) ? items : []) {
      if (!item || !Number.isInteger(item.slot) || !slots[item.slot] || used.has(item.slot)) continue;
      used.add(item.slot);
      makeDecoration(item,decorations);
    }
  }
  const targets = { bridge:new THREE.Vector3(-1.95,0.58,1.5), market:new THREE.Vector3(-4.8,0.42,0.7), home:new THREE.Vector3(3.7,0.5,-0.5) };
  let target=avatar.position.clone();
  let celebrationUntil=0;
  const confetti=group(); confetti.visible=false;
  for(let i=0;i<24;i++) block(confetti,0,0,0,0.08,0.14,0.025,['#f4bf50','#f78391','#69c4c1','#ffffff'][i%4]);
  const raycaster=new THREE.Raycaster(); const pointer=new THREE.Vector2();
  let pointerStart=null;
  function pointerDown(event) { pointerStart=[event.clientX,event.clientY]; }
  function pointerUp(event) {
    if(!pointerStart || Math.hypot(event.clientX-pointerStart[0],event.clientY-pointerStart[1])>12) return;
    pointerStart=null;
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    if(plotMode) {
      const activeStart=zones[plotZone].start;
      const hit=raycaster.intersectObjects([...plotSquares.slice(activeStart,activeStart+6),...decorations.children.filter(item=>item.userData.slot>=activeStart && item.userData.slot<activeStart+6)],true)[0];
      if(hit) { let object=hit.object; while(object && !Number.isInteger(object.userData.slot)) object=object.parent; if(object) onPlotSlot?.(object.userData.slot); }
      return;
    }
    const hit=raycaster.intersectObjects(clickable,true)[0];
    if(hit) { let object=hit.object; while(object && !object.userData.location) object=object.parent; if(object) onSelect?.(object.userData.location); }
  }
  renderer.domElement.addEventListener('pointerdown',pointerDown);
  renderer.domElement.addEventListener('pointerup',pointerUp);
  const cameraAim=new THREE.Vector3(0,0.7,0);
  const desiredAim=cameraAim.clone();
  const desiredCamera=camera.position.clone();
  let view='overview', viewScale=0, desiredScale=0;
  function getPlotPositions() {
    camera.updateMatrixWorld();
    return slots.slice(zones[plotZone].start,zones[plotZone].start+6).map(([x,z],index)=> {
      const slot=zones[plotZone].start+index;
      const point=new THREE.Vector3(x,0.55,z).project(camera);
      return {slot,x:(point.x+1)/2,y:(1-point.y)/2};
    });
  }
  function updateProjection() {
    const aspect=Math.max(container.clientWidth,1)/Math.max(container.clientHeight,1);
    const overviewHeight=Math.max(16,18/aspect);
    const closeHeight=view==='avatar'?Math.max(2,1.7/aspect):Math.max(4.1,4.1/aspect);
    const halfHeight=overviewHeight+(closeHeight-overviewHeight)*viewScale;
    camera.left=-halfHeight*aspect; camera.right=halfHeight*aspect;
    camera.top=halfHeight; camera.bottom=-halfHeight; camera.updateProjectionMatrix();
  }
  function resize() {
    const width=Math.max(container.clientWidth,1), height=Math.max(container.clientHeight,1);
    updateProjection(); renderer.setSize(width,height,false);
    renderer.render(scene,camera);
    onPlotUpdate?.(getPlotPositions());
  }
  const observer=new ResizeObserver(resize); observer.observe(container); resize();
  let frame=0,previous=0,destroyed=false,paused=false;
  function animate(now) {
    if(destroyed) return;
    frame=requestAnimationFrame(animate);
    if(document.hidden || paused) { previous=now; return; }
    // Thirty frames per second is enough for the calm world and spares mobile batteries.
    if(now-previous<32) return;
    const delta=Math.min((now-previous)/1000,0.08); previous=now;
    const time=now/1000;
    if(camera.position.distanceToSquared(desiredCamera)>0.000001 || cameraAim.distanceToSquared(desiredAim)>0.000001 || Math.abs(viewScale-desiredScale)>0.00001) {
      const step=reducedMotion?1:Math.min(1,delta*5);
      camera.position.lerp(desiredCamera,step); cameraAim.lerp(desiredAim,step);
      viewScale+=(desiredScale-viewScale)*step;
      camera.lookAt(cameraAim); updateProjection();
      onPlotUpdate?.(getPlotPositions());
    }
    const distance=avatar.position.distanceTo(target);
    if(distance>0.025) {
      const direction=target.clone().sub(avatar.position);
      avatar.rotation.y=Math.atan2(direction.x,direction.z);
      avatar.position.lerp(target,Math.min(1,delta*3));
      limbs.forEach((limb,i)=>limb.rotation.x=reducedMotion?0:Math.sin(time*12)*(i%2?1:-1)*0.35);
    } else limbs.forEach(limb=>limb.rotation.x=0);
    companion.position.set(avatar.position.x+.85,avatar.position.y+(reducedMotion?0:Math.sin(time*4)*.035),avatar.position.z+.35);
    companion.rotation.y=avatar.rotation.y;
    if(!reducedMotion) {
      boat.position.y=-0.07+Math.sin(time*1.8)*0.045; boat.rotation.z=Math.sin(time*1.2)*0.025;
      ripples.forEach((r,i)=>r.scale.x=(0.38+i%3*0.12)*(1+Math.sin(time*1.3+i)*0.18));
      clouds.forEach((c,i)=>c.position.x=[-6,3,8][i]+Math.sin(time*0.16+i)*0.22);
      birds.forEach((b,i)=>{ b.position.y=5+i*0.24+Math.sin(time*1.5+i)*0.1; b.children.forEach((w,j)=>w.rotation.z=(j?1:-1)*(0.3+Math.sin(time*4+i)*0.18)); });
    }
    confetti.visible=!reducedMotion && now<celebrationUntil;
    if(confetti.visible) confetti.children.forEach((piece,i)=> {
      const age=(2200-celebrationUntil+now)/1000;
      piece.position.set(avatar.position.x+Math.cos(i*2.4)*age*1.3,avatar.position.y+1.2+Math.sin(i)*0.3+age*3-age*age*1.8,avatar.position.z+Math.sin(i*2.4)*age*1.3);
      piece.rotation.set(time+i,time*2+i,time*3);
    });
    renderer.render(scene,camera);
  }
  frame=requestAnimationFrame(animate);
  return {
    setPaused(value) { paused=Boolean(value); },
    setAvatar(style = {}) {
      Object.entries(wardrobe).forEach(([slot,items])=>Object.entries(items).forEach(([id,item])=>item.visible=style[slot]===id));
      Object.entries(pets).forEach(([id,pet])=>pet.visible=style.pet===id);
      renderer.domElement.dataset.companion=Object.hasOwn(pets,style.pet)?style.pet:'none';
      for(const [key,mat] of [['shirt',shirt],['skin',skin],['hair',hair]]) if(typeof style[key]==='string' && /^#[0-9a-f]{6}$/i.test(style[key])) mat.color.set(style[key]);
      if(style.hat!==undefined) {
        hat.visible=style.hat===true || style.hat==='explorer' || style.hat==='sunhat';
        cap.visible=style.hat==='cap';
        crown.visible=style.hat==='crown'; wizard.visible=style.hat==='wizard'; headphones.visible=style.hat==='headphones';
      }
      if(style.back!==undefined) { cape.visible=style.back==='cape'; backpack.visible=style.back==='backpack'; }
      if(style.face!==undefined) glasses.visible=style.face==='glasses';
    },
    setDecorations,
    setPlotMode(enabled) { plotMode=Boolean(enabled); plotGrid.visible=plotMode; if(!plotMode) clearPreview(); onPlotUpdate?.(getPlotPositions()); },
    setPlotZone(zone) {
      if(!zones[zone]) return;
      plotZone=zone; clearPreview();
      const selected=zones[zone];
      plotSquares.forEach((square,i)=>{ square.parent.visible=i>=selected.start && i<selected.start+6; });
      if(view==='plot') { desiredAim.set(selected.x,0.5,selected.z); desiredCamera.set(selected.x+5,12,selected.z+8); }
      onPlotUpdate?.(getPlotPositions());
    },
    getPlotPositions,
    setSelectedSlot(slot) { plotSquares.forEach((square,i)=>square.material=material(i===slot?'#ffe195':'#d4e9a5')); },
    previewDecoration(type,slot,rotation=0,level=1) {
      clearPreview();
      if(!Number.isInteger(slot) || !slots[slot] || slot<zones[plotZone].start || slot>=zones[plotZone].start+6) return;
      const preview=makeDecoration({type,slot,rotation,level},ghost);
      if(preview) decorations.children.forEach(item=>{ if(item.userData.slot===slot)item.visible=false; });
      preview?.traverse(mesh=> { if(mesh.isMesh) { const mat=mesh.material.clone(); mat.transparent=true; mat.opacity=0.5; mat.depthWrite=false; mesh.material=mat; mesh.castShadow=false; ghostMaterials.add(mat); } });
    },
    clearPreview,
    focus(location) {
      view=location==='plot'||location==='avatar'?location:'overview';
      desiredScale=view==='overview'?0:1;
      if(view==='plot') { const zone=zones[plotZone]; desiredAim.set(zone.x,0.5,zone.z); desiredCamera.set(zone.x+5,12,zone.z+8); }
      else if(view==='avatar') { desiredAim.set(0.8,1.2,1.6); desiredCamera.set(3.8,3.7,7.6); }
      else { desiredAim.set(0,0.7,0); desiredCamera.set(17,19,24); }
      const destination=location==='overview' ? new THREE.Vector3(0.8,0.42,1.6) : targets[location];
      if(destination) { target=destination.clone(); if(reducedMotion) avatar.position.copy(target); }
      if(location==='avatar') { target.set(0.8,0.42,1.6); avatar.position.copy(target); avatar.rotation.y=0.35; }
    },
    celebrate() { celebrationUntil=performance.now()+2200; },
    getLandmarkPositions() {
      return Object.fromEntries(Object.entries(targets).map(([id,p])=>{const v=p.clone().add(new THREE.Vector3(0,2,0)).project(camera); return [id,{x:(v.x+1)/2,y:(1-v.y)/2}];}));
    },
    destroy() {
      destroyed=true; cancelAnimationFrame(frame); observer.disconnect();
      clearPreview();
      renderer.domElement.removeEventListener('pointerdown',pointerDown); renderer.domElement.removeEventListener('pointerup',pointerUp);
      geometries.forEach(g=>g.dispose()); materials.forEach(m=>m.dispose()); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
