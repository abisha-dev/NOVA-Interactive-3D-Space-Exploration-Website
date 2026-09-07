# 🌌 NOVA — Explore the Universe

A full-featured, modern **Interactive 3D Space Website** built using **Vanilla JavaScript**, **Three.js**, and **Vite** — no frontend frameworks required.

---

## 🌟 Sections & Features

1. **Navigation Bar (`#navbar`)**:
   - Brand logo with cosmic glow
   - Smooth-scrolling links: **Home**, **Planets**, **About**, **Contact**
   - Glassmorphism background on scroll
   - Fully responsive mobile drawer navigation

2. **Hero Section (`#home`)**:
   - Dynamic 2D canvas animated starfield with twinkling stars & starburst glows
   - High-impact typography with glowing gradient text
   - Real-time rotating **3D Earth** with custom oceans, continents, atmosphere glow, and wispy clouds
   - Interactive orbit rings and quick-action buttons

3. **Planets Section (`#planets`)**:
   - Interactive 3D cards for **Earth 🌍**, **Mars 🔴**, and **Saturn 🪐**
   - Built entirely with Three.js native geometries (Spheres, Rings, Toruses)
   - Integrated `OrbitControls` on each card: Click and drag to rotate in 360°, scroll to zoom
   - Comprehensive planetary facts: Distance from Sun, Diameter, and Moon count

4. **About the Universe (`#about`)**:
   - Mind-bending facts about the observable universe, speed of light, and black holes
   - Real-time procedural **3D Milky Way Spiral Galaxy** made of 8,000 glowing particles

5. **Contact Section (`#contact`)**:
   - Interactive message launch form with simulated transmission feedback
   - Deep space signal and observatory communication cards

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```
*(or the port indicated in your terminal, e.g., `http://localhost:3002/`)*

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
3js/
├── index.html                  # Main webpage with all sections (Home, Planets, About, Contact)
├── package.json                # Project dependencies (Three.js + Vite)
├── vite.config.js              # Vite server configuration
├── README.md                   # Project documentation
└── src/
    ├── components/
    │   ├── planets.js          # Three.js 3D scenes (Earth, Mars, Saturn, Milky Way)
    │   └── starfield.js        # 2D Canvas dynamic twinkling starfield
    ├── main.js                 # App entry point, IntersectionObservers, navbar & form logic
    └── style.css               # Cosmic dark theme, responsive grid layouts, and glassmorphism
```

---

## 🛠️ Built With

- **Three.js** (`^0.160.0`) — 3D WebGL scenes, cameras, lighting, materials, and particle systems
- **Vite** (`^5.2.11`) — Ultra-fast development server and production bundler
- **Vanilla HTML5, CSS3, & ES6 JavaScript**
