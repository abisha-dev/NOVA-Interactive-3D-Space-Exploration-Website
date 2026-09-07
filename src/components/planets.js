/**
 * planets.js — Three.js 3D Planets System for NOVA
 *
 * Implements 3D procedural planets using only Three.js native geometries:
 *  - Earth (Ocean, continents, cloud layers, atmosphere)
 *  - Mars (Rusty terrain, dark maria, ice cap, dust atmosphere)
 *  - Jupiter (Giant gas bands, Great Red Spot storm)
 *  - Saturn (Golden body, equatorial bands, multi-layer rings)
 *  - Neptune (Deep azure blue, methane storm bands)
 *  - Milky Way Spiral Galaxy (8,000 particle simulation)
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── Helper: create WebGL renderer ──
export function makeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  return renderer;
}

// ── Helper: responsive canvas resize ──
export function handleResize(renderer, camera, canvas) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}

// ═════════════════════════════════════════════════════════════════════
// PROCEDURAL PLANET BUILDERS
// ═════════════════════════════════════════════════════════════════════

/** Earth Builder */
export function buildEarth(group) {
  // Ocean Base
  const ocean = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0x1665a0,
      roughness: 0.65,
      metalness: 0.05,
    })
  );
  ocean.castShadow = true;
  group.add(ocean);

  // Continents / Landmasses
  const landMat = new THREE.MeshStandardMaterial({ color: 0x2d6a2d, roughness: 0.85 });
  const landCoords = [
    [0.6, 0.3, 0.8],
    [-0.5, 0.5, 0.7],
    [0.0, -0.4, 0.9],
    [0.8, -0.1, 0.6],
    [-0.7, 0.0, 0.7],
    [0.3, 0.7, 0.65],
  ];
  landCoords.forEach(pos => {
    const v = new THREE.Vector3(pos[0], pos[1], pos[2]).normalize();
    const blob = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), landMat);
    blob.position.copy(v.multiplyScalar(1.004));
    blob.scale.z = 0.18;
    blob.lookAt(0, 0, 0);
    group.add(blob);
  });

  // Clouds
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    roughness: 1,
  });
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const lat = (Math.random() - 0.5) * Math.PI * 0.6;
    const cm = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), cloudMat);
    cm.position.set(
      1.02 * Math.cos(lat) * Math.cos(angle),
      1.02 * Math.sin(lat),
      1.02 * Math.cos(lat) * Math.sin(angle)
    );
    cm.scale.set(1.4, 0.6, 0.6);
    group.add(cm);
  }

  // Atmosphere Glow
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.06, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    })
  ));
}

/** Mars Builder */
export function buildMars(group) {
  // Red Rust Surface
  const mars = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0xb5451b, roughness: 0.88, metalness: 0 })
  );
  group.add(mars);

  // Dark Maria Basins
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x73280c, roughness: 1.0 });
  const darkCoords = [[0.5, 0.2, 0.85], [-0.5, -0.3, 0.8], [0.0, 0.6, 0.8]];
  darkCoords.forEach(pos => {
    const v = new THREE.Vector3(pos[0], pos[1], pos[2]).normalize();
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), darkMat);
    b.position.copy(v.multiplyScalar(1.003));
    b.scale.z = 0.15;
    b.lookAt(0, 0, 0);
    group.add(b);
  });

  // Polar Ice Cap
  const iceCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfffafa, roughness: 0.4 })
  );
  iceCap.position.set(0, 1.002, 0);
  iceCap.scale.set(1, 0.22, 1);
  group.add(iceCap);

  // Dust Atmosphere
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.04, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0xf97316, transparent: true, opacity: 0.08, depthWrite: false })
  ));
}

/** Jupiter Builder */
export function buildJupiter(group) {
  // Base Sandy Tone
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.7 })
  ));

  // Colorful Atmospheric Bands
  const jupColors = [0x99582a, 0xdda15e, 0x6f1d1b, 0xbc6c25, 0xbb9457];
  const jupLats = [-0.6, -0.3, 0.0, 0.35, 0.65];
  jupColors.forEach((col, i) => {
    const band = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 32, 16),
      new THREE.MeshStandardMaterial({ color: col, roughness: 1, transparent: true, opacity: 0.5, depthWrite: false })
    );
    band.scale.set(1, 0.14, 1);
    band.position.y = jupLats[i];
    group.add(band);
  });

  // The Great Red Spot Storm
  const redSpot = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x9e2a2b, roughness: 0.9 })
  );
  redSpot.position.set(0.7, -0.3, 0.7);
  redSpot.scale.set(1.4, 0.7, 0.2);
  group.add(redSpot);
}

/** Saturn Builder */
export function buildSaturn(group) {
  // Body
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0xc8a96e, roughness: 0.75, metalness: 0.05 })
  ));

  // Bands
  const bandColors = [0xb8946a, 0xd4b87a, 0xa07848, 0xcc9e5e];
  const bandLats = [-0.55, -0.2, 0.15, 0.5];
  bandColors.forEach((col, i) => {
    const band = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 32, 16),
      new THREE.MeshStandardMaterial({ color: col, roughness: 1, transparent: true, opacity: 0.4, depthWrite: false })
    );
    band.scale.set(1, 0.08, 1);
    band.position.y = bandLats[i];
    group.add(band);
  });

  // Ring System
  const ringData = [
    { inner: 1.3, outer: 1.6, color: 0xd4b896, opacity: 0.65 },
    { inner: 1.65, outer: 1.95, color: 0xc8a87c, opacity: 0.5 },
    { inner: 2.0, outer: 2.25, color: 0xb89060, opacity: 0.3 },
  ];
  ringData.forEach(rd => {
    const mid = (rd.inner + rd.outer) / 2;
    const tube = (rd.outer - rd.inner) / 2;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(mid, tube, 4, 80),
      new THREE.MeshStandardMaterial({
        color: rd.color,
        transparent: true,
        opacity: rd.opacity,
        roughness: 1,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    ring.rotation.x = Math.PI / 2 - 0.45;
    group.add(ring);
  });
}

/** Neptune Builder */
export function buildNeptune(group) {
  // Deep Azure Body
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.55, metalness: 0.1 })
  ));

  // Methane Storm Bands
  const nepColors = [0x38bdf8, 0x1e40af, 0x60a5fa];
  const nepLats = [-0.35, 0.1, 0.45];
  nepColors.forEach((col, i) => {
    const band = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 32, 16),
      new THREE.MeshStandardMaterial({ color: col, roughness: 1, transparent: true, opacity: 0.45, depthWrite: false })
    );
    band.scale.set(1, 0.09, 1);
    band.position.y = nepLats[i];
    group.add(band);
  });

  // Glowing Cyan Atmosphere
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.05, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.18, depthWrite: false })
  ));
}

// ═════════════════════════════════════════════════════════════════════
// 1. HERO PLANET WITH SWITCHING CAPABILITY
// ═════════════════════════════════════════════════════════════════════

let heroScene, heroGroup;

export function initHeroPlanet(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  heroScene = new THREE.Scene();
  const renderer = makeRenderer(canvas);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 3.4);

  // Lights
  heroScene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const sun = new THREE.DirectionalLight(0xffeedd, 2.2);
  sun.position.set(5, 3, 5);
  heroScene.add(sun);

  const fill = new THREE.PointLight(0x38bdf8, 1.2, 12);
  fill.position.set(-4, 0, 2);
  heroScene.add(fill);

  // Default to Earth
  heroGroup = new THREE.Group();
  buildEarth(heroGroup);
  heroScene.add(heroGroup);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    handleResize(renderer, camera, canvas);
    heroGroup.rotation.y = clock.getElapsedTime() * 0.14;
    renderer.render(heroScene, camera);
  }
  animate();
}

/** Switch Hero 3D Planet */
export function setHeroPlanet(planetKey) {
  if (!heroScene || !heroGroup) return;

  // Remove existing planet
  while (heroGroup.children.length > 0) {
    const obj = heroGroup.children[0];
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
      else obj.material.dispose();
    }
    heroGroup.remove(obj);
  }

  // Build selected planet
  switch (planetKey) {
    case 'mars':
      buildMars(heroGroup);
      break;
    case 'jupiter':
      buildJupiter(heroGroup);
      break;
    case 'saturn':
      buildSaturn(heroGroup);
      break;
    case 'neptune':
      buildNeptune(heroGroup);
      break;
    case 'earth':
    default:
      buildEarth(heroGroup);
      break;
  }
}

// ═════════════════════════════════════════════════════════════════════
// 2. GENERIC PLANET CARD INITIALIZER WITH ORBITCONTROLS
// ═════════════════════════════════════════════════════════════════════

export function initPlanetCard(canvasId, builderFn, cameraZ = 3.0) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const w = canvas.clientWidth || 300;
  const h = canvas.clientHeight || 240;

  const scene = new THREE.Scene();
  const renderer = makeRenderer(canvas);
  renderer.setSize(w, h, false);

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0, cameraZ);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.0);
  keyLight.position.set(4, 3, 4);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0x38bdf8, 0.4, 12);
  fillLight.position.set(-4, 0, -2);
  scene.add(fillLight);

  const group = new THREE.Group();
  builderFn(group);
  scene.add(group);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enableZoom = false; // Prevents accidental pinch zoom trapping while scrolling through cards on mobile
  controls.minDistance = 2.0;
  controls.maxDistance = 7.5;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.6;

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    handleResize(renderer, camera, canvas);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// ═════════════════════════════════════════════════════════════════════
// 3. MILKY WAY SPIRAL GALAXY
// ═════════════════════════════════════════════════════════════════════

export function initMilkyWay(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const scene = new THREE.Scene();
  const renderer = makeRenderer(canvas);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 4.2, 4.2);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 1));

  const particleCount = 8000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const color = new THREE.Color();

  for (let i = 0; i < particleCount - 500; i++) {
    const arm = Math.floor(Math.random() * 3);
    const angle = arm * ((Math.PI * 2) / 3) + Math.random() * 0.6;
    const r = Math.pow(Math.random(), 0.6) * 2.5;
    const spiral = r * 1.8 + angle;
    const spread = (Math.random() - 0.5) * (r * 0.25 + 0.05);
    const ySpread = (Math.random() - 0.5) * 0.15;

    positions[i * 3] = Math.cos(spiral) * r + spread;
    positions[i * 3 + 1] = ySpread;
    positions[i * 3 + 2] = Math.sin(spiral) * r + spread;

    const t = r / 2.5;
    color.setHSL(0.6 + t * 0.2, 0.8 + t * 0.2, 0.9 - t * 0.3);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  // Bright core
  for (let i = particleCount - 500; i < particleCount; i++) {
    const r = Math.random() * 0.4;
    const a = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
    positions[i * 3 + 2] = Math.sin(a) * r;
    color.setHSL(0.12, 0.9, 0.95);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });

  const galaxy = new THREE.Points(geo, mat);
  scene.add(galaxy);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    handleResize(renderer, camera, canvas);
    galaxy.rotation.y = clock.getElapsedTime() * 0.06;
    renderer.render(scene, camera);
  }
  animate();
}
