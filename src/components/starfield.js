/**
 * starfield.js
 * Creates an animated star-field background canvas for the hero section.
 * Uses plain Canvas 2D API — no Three.js needed for this lightweight effect.
 */

export function initStarfield(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  const STAR_COUNT = 260;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((s) => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.twinkleOffset);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${s.alpha * twinkle})`;
      ctx.fill();
    });

    // A few larger star bursts
    if (!stars._bursts) {
      stars._bursts = Array.from({ length: 6 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1.5,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    stars._bursts.forEach((b) => {
      const glow = 0.4 + 0.6 * Math.sin(t * 0.8 + b.phase);
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 5);
      grad.addColorStop(0, `rgba(180,220,255,${0.9 * glow})`);
      grad.addColorStop(1, 'rgba(180,220,255,0)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }

  let rafId;
  function loop(time) {
    draw(time / 1000);
    rafId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  rafId = requestAnimationFrame(loop);
}
