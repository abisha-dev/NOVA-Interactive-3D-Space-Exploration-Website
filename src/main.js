/**
 * main.js — NOVA Space Website Engine
 *
 * Coordinates:
 *  1. Dynamic 2D Canvas Starfield (twinkling star background)
 *  2. Hero 3D Planet with Real-Time Switcher Tabs (Earth, Mars, Jupiter, Saturn, Neptune)
 *  3. Interactive 3D Planet Showcase Cards with OrbitControls (5 Planets)
 *  4. 3D Milky Way Spiral Galaxy with 8,000 Particles
 *  5. Fullscreen Interactive 3D Telemetry Inspector Modal
 *  6. Web Audio API Ambient Celestial Sound Synthesizer
 *  7. Sticky Glassmorphic Navbar & Mobile Navigation Drawer
 *  8. Subspace Transmission Contact Form
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initStarfield } from './components/starfield.js';
import { toggleCosmicAudio } from './components/audio.js';
import {
  initHeroPlanet,
  setHeroPlanet,
  initPlanetCard,
  initMilkyWay,
  makeRenderer,
  handleResize,
  buildEarth,
  buildMars,
  buildJupiter,
  buildSaturn,
  buildNeptune,
} from './components/planets.js';

// ═════════════════════════════════════════════════════════════════════
// 1. SCIENTIFIC TELEMETRY DATA REPOSITORY
// ═════════════════════════════════════════════════════════════════════

const PLANET_DATA = {
  earth: {
    name: 'Earth',
    tag: 'Terrestrial Oasis • 3rd Planet',
    desc: 'Our vibrant home world is the only known planet in the cosmos confirmed to harbor life. It features vast liquid oceans covering 71% of its surface and an atmosphere shielded by a powerful magnetosphere.',
    builder: buildEarth,
    cameraZ: 3.2,
    stats: [
      { label: 'Distance from Sun', val: '149.6 Million km (1.0 AU)' },
      { label: 'Equatorial Diameter', val: '12,742 km' },
      { label: 'Orbital Period', val: '365.25 Days' },
      { label: 'Surface Gravity', val: '9.81 m/s² (1.0g)' },
      { label: 'Mean Temperature', val: '15°C (59°F)' },
      { label: 'Confirmed Moons', val: '1 (The Moon / Luna)' },
    ],
    atmosphere: [
      { gas: 'Nitrogen (N₂)', pct: 78 },
      { gas: 'Oxygen (O₂)', pct: 21 },
      { gas: 'Argon & CO₂', pct: 1 },
    ],
  },
  mars: {
    name: 'Mars',
    tag: 'Terrestrial Desert • 4th Planet',
    desc: 'The Red Planet owes its crimson hue to abundant iron oxide (rust) across its surface. It hosts Valles Marineris, a canyon system 4,000 km long, and Olympus Mons, the largest volcano in the solar system.',
    builder: buildMars,
    cameraZ: 3.2,
    stats: [
      { label: 'Distance from Sun', val: '227.9 Million km (1.52 AU)' },
      { label: 'Equatorial Diameter', val: '6,779 km' },
      { label: 'Orbital Period', val: '687 Earth Days' },
      { label: 'Surface Gravity', val: '3.72 m/s² (0.38g)' },
      { label: 'Mean Temperature', val: '-63°C (-81°F)' },
      { label: 'Confirmed Moons', val: '2 (Phobos & Deimos)' },
    ],
    atmosphere: [
      { gas: 'Carbon Dioxide', pct: 95 },
      { gas: 'Nitrogen (N₂)', pct: 3 },
      { gas: 'Argon (Ar)', pct: 2 },
    ],
  },
  jupiter: {
    name: 'Jupiter',
    tag: 'Gas Giant • 5th Planet',
    desc: 'The undisputed monarch of our solar system with more than twice the mass of all other planets combined. Its swirling clouds and the Great Red Spot represent an enormous storm raging for over 300 years.',
    builder: buildJupiter,
    cameraZ: 3.4,
    stats: [
      { label: 'Distance from Sun', val: '778.5 Million km (5.20 AU)' },
      { label: 'Equatorial Diameter', val: '139,820 km' },
      { label: 'Orbital Period', val: '11.86 Earth Years' },
      { label: 'Surface Gravity', val: '24.79 m/s² (2.53g)' },
      { label: 'Mean Temperature', val: '-110°C (-166°F)' },
      { label: 'Confirmed Moons', val: '95 (Io, Europa, Ganymede...)' },
    ],
    atmosphere: [
      { gas: 'Hydrogen (H₂)', pct: 90 },
      { gas: 'Helium (He)', pct: 9 },
      { gas: 'Methane / Ammonia', pct: 1 },
    ],
  },
  saturn: {
    name: 'Saturn',
    tag: 'Ringed Gas Giant • 6th Planet',
    desc: 'Famous for its magnificent ring system spanning 282,000 km across but only ~10 meters thick in most places. Saturn is predominantly hydrogen and helium and has an average density lower than water.',
    builder: buildSaturn,
    cameraZ: 4.0,
    stats: [
      { label: 'Distance from Sun', val: '1.43 Billion km (9.58 AU)' },
      { label: 'Equatorial Diameter', val: '116,460 km' },
      { label: 'Orbital Period', val: '29.45 Earth Years' },
      { label: 'Surface Gravity', val: '10.44 m/s² (1.06g)' },
      { label: 'Mean Temperature', val: '-140°C (-220°F)' },
      { label: 'Confirmed Moons', val: '146 (Titan, Enceladus...)' },
    ],
    atmosphere: [
      { gas: 'Hydrogen (H₂)', pct: 96 },
      { gas: 'Helium (He)', pct: 3 },
      { gas: 'Methane / Trace', pct: 1 },
    ],
  },
  neptune: {
    name: 'Neptune',
    tag: 'Ice Giant • 8th Planet',
    desc: 'The most distant major planet in our solar system. An ice giant enveloped in deep azure methane-rich clouds, where supersonic winds whip through the upper atmosphere at speeds exceeding 2,100 km/h.',
    builder: buildNeptune,
    cameraZ: 3.3,
    stats: [
      { label: 'Distance from Sun', val: '4.50 Billion km (30.05 AU)' },
      { label: 'Equatorial Diameter', val: '49,244 km' },
      { label: 'Orbital Period', val: '164.8 Earth Years' },
      { label: 'Surface Gravity', val: '11.15 m/s² (1.14g)' },
      { label: 'Mean Temperature', val: '-201°C (-330°F)' },
      { label: 'Confirmed Moons', val: '16 (Triton...)' },
    ],
    atmosphere: [
      { gas: 'Hydrogen (H₂)', pct: 80 },
      { gas: 'Helium (He)', pct: 19 },
      { gas: 'Methane (CH₄)', pct: 1 },
    ],
  },
};

// ═════════════════════════════════════════════════════════════════════
// 2. INITIALIZE BACKGROUND & HERO
// ═════════════════════════════════════════════════════════════════════

// Animated starfield background
initStarfield('star-canvas');

// Hero rotating 3D Earth
initHeroPlanet('hero-canvas');

// Hero Planet Switcher Tab Controls
const heroTabs = document.querySelectorAll('.hero-tab');
const heroBadge = document.getElementById('hero-badge');

heroTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    heroTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const planetKey = tab.getAttribute('data-planet');
    setHeroPlanet(planetKey);

    const labels = {
      earth: '🌍 Earth',
      mars: '🔴 Mars',
      jupiter: '🟠 Jupiter',
      saturn: '🪐 Saturn',
      neptune: '🔵 Neptune',
    };
    if (heroBadge) heroBadge.textContent = labels[planetKey] || '🪐 Planet';
  });
});

// ═════════════════════════════════════════════════════════════════════
// 3. LAZY-LOAD PLANET SHOWCASE CARDS & MILKY WAY
// ═════════════════════════════════════════════════════════════════════

function lazyLoadScene(elementId, initFn) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initFn();
        obs.disconnect();
      }
    });
  }, { threshold: 0.1 });
  observer.observe(el);
}

lazyLoadScene('canvas-earth',    () => initPlanetCard('canvas-earth', buildEarth, 3.0));
lazyLoadScene('canvas-mars',     () => initPlanetCard('canvas-mars', buildMars, 3.0));
lazyLoadScene('canvas-jupiter',  () => initPlanetCard('canvas-jupiter', buildJupiter, 3.3));
lazyLoadScene('canvas-saturn',   () => initPlanetCard('canvas-saturn', buildSaturn, 3.8));
lazyLoadScene('canvas-neptune',  () => initPlanetCard('canvas-neptune', buildNeptune, 3.0));
lazyLoadScene('canvas-milkyway', () => initMilkyWay('canvas-milkyway'));

// ═════════════════════════════════════════════════════════════════════
// 4. INTERACTIVE 3D PLANET TELEMETRY MODAL
// ═════════════════════════════════════════════════════════════════════

let modalScene = null;
let modalRenderer = null;
let modalCamera = null;
let modalControls = null;
let modalGroup = null;
let isWireframe = false;
let currentModalKey = 'earth';

function initModal3D() {
  const canvas = document.getElementById('modal-canvas');
  if (!canvas) return;

  modalScene = new THREE.Scene();
  modalRenderer = makeRenderer(canvas);
  modalCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  modalCamera.position.set(0, 0, 3.4);

  // Studio Lights
  modalScene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const sun = new THREE.DirectionalLight(0xfff5e6, 2.2);
  sun.position.set(5, 4, 5);
  modalScene.add(sun);

  const fill = new THREE.PointLight(0x38bdf8, 0.6, 15);
  fill.position.set(-5, -2, -3);
  modalScene.add(fill);

  modalGroup = new THREE.Group();
  modalScene.add(modalGroup);

  modalControls = new OrbitControls(modalCamera, canvas);
  modalControls.enableDamping = true;
  modalControls.dampingFactor = 0.08;
  modalControls.minDistance = 2.0;
  modalControls.maxDistance = 8.0;
  modalControls.autoRotate = true;
  modalControls.autoRotateSpeed = 1.4;

  const clock = new THREE.Clock();
  function animateModal() {
    requestAnimationFrame(animateModal);
    if (document.getElementById('planet-modal').classList.contains('open')) {
      handleResize(modalRenderer, modalCamera, canvas);
      modalControls.update();
      modalRenderer.render(modalScene, modalCamera);
    }
  }
  animateModal();
}

window.openPlanetModal = function (planetKey) {
  const data = PLANET_DATA[planetKey] || PLANET_DATA.earth;
  currentModalKey = planetKey;
  isWireframe = false;

  const modal = document.getElementById('planet-modal');
  modal.classList.add('open');
  document.body.classList.add('menu-open');

  // Telemetry details
  document.getElementById('m-tag').textContent = data.tag;
  document.getElementById('m-title').textContent = data.name;
  document.getElementById('m-desc').textContent = data.desc;

  // Stats Grid
  const telGrid = document.getElementById('m-telemetry');
  telGrid.innerHTML = data.stats.map(s => `
    <div class="tel-item">
      <span>${s.label}</span>
      <b>${s.val}</b>
    </div>
  `).join('');

  // Atmosphere Bars
  const atmoContainer = document.getElementById('m-atmosphere');
  atmoContainer.innerHTML = data.atmosphere.map(a => `
    <div class="atmo-row">
      <span class="atmo-name">${a.gas}</span>
      <div class="atmo-bar-bg">
        <div class="atmo-bar-fill" style="width: ${a.pct}%"></div>
      </div>
      <span class="atmo-pct">${a.pct}%</span>
    </div>
  `).join('');

  // Setup / Update 3D Model
  if (!modalScene) {
    initModal3D();
  }

  // Clear group
  while (modalGroup.children.length > 0) {
    const obj = modalGroup.children[0];
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
      else obj.material.dispose();
    }
    modalGroup.remove(obj);
  }

  // Build new planet
  data.builder(modalGroup);
  modalCamera.position.set(0, 0, data.cameraZ || 3.4);
  modalControls.target.set(0, 0, 0);
  modalControls.update();
};

window.closePlanetModal = function () {
  const modal = document.getElementById('planet-modal');
  if (modal) modal.classList.remove('open');
  // Only remove menu-open if mobile menu is not also open
  if (!document.getElementById('mobile-menu')?.classList.contains('open')) {
    document.body.classList.remove('menu-open');
  }
};

// Close on outside click
document.getElementById('planet-modal')?.addEventListener('click', e => {
  if (e.target.id === 'planet-modal') window.closePlanetModal();
});

// Modal Wireframe Toggle
window.toggleModalWireframe = function () {
  if (!modalGroup) return;
  isWireframe = !isWireframe;
  modalGroup.traverse(child => {
    if (child.isMesh && child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(m => (m.wireframe = isWireframe));
      } else {
        child.material.wireframe = isWireframe;
      }
    }
  });
  const btn = document.getElementById('modal-wireframe-btn');
  if (btn) btn.classList.toggle('active', isWireframe);
};

// Modal Reset Camera
window.resetModalCamera = function () {
  if (!modalCamera || !modalControls) return;
  const data = PLANET_DATA[currentModalKey] || PLANET_DATA.earth;
  modalCamera.position.set(0, 0, data.cameraZ || 3.4);
  modalControls.target.set(0, 0, 0);
  modalControls.update();
};

// ═════════════════════════════════════════════════════════════════════
// 5. WEB AUDIO API SYNTHESIZER
// ═════════════════════════════════════════════════════════════════════

const audioBtn = document.getElementById('btn-audio');
const audioBtnMobile = document.getElementById('btn-audio-mobile');

if (audioBtn) {
  audioBtn.addEventListener('click', () => {
    toggleCosmicAudio(audioBtn);
  });
}
if (audioBtnMobile) {
  audioBtnMobile.addEventListener('click', () => {
    toggleCosmicAudio(audioBtnMobile);
  });
}

// ═════════════════════════════════════════════════════════════════════
// 6. NAVBAR & NAVIGATION
// ═════════════════════════════════════════════════════════════════════

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// Smooth Anchor Scrolling
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      closeMobileMenu();
    }
  });
});

// Mobile Hamburger & Drawer
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  if (isOpen) {
    document.body.classList.add('menu-open');
  } else {
    document.body.classList.remove('menu-open');
  }
}

function closeMobileMenu() {
  if (!mobileMenu || !hamburger) return;
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  if (!document.getElementById('planet-modal')?.classList.contains('open')) {
    document.body.classList.remove('menu-open');
  }
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMobileMenu);
}

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close on Escape key
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('planet-modal')?.classList.contains('open')) {
      window.closePlanetModal();
    }
    if (mobileMenu?.classList.contains('open')) {
      closeMobileMenu();
    }
  }
});

// Close mobile drawer on desktop resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileMenu?.classList.contains('open')) {
    closeMobileMenu();
  }
}, { passive: true });

// ═════════════════════════════════════════════════════════════════════
// 7. SUBSPACE TRANSMISSION CONTACT FORM
// ═════════════════════════════════════════════════════════════════════

window.handleSubmit = function (e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const success = document.getElementById('form-success');

  btn.textContent = 'Transmitting to Deep Space... 🚀';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Transmit Signal 🚀';
    btn.disabled = false;
    success.classList.add('show');
    e.target.reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1200);
};
