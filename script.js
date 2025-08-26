// Mobile nav toggle
const toggleButton = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggleButton && nav) {
  toggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when clicking a link (mobile)
  nav.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.matches('a')) {
      nav.classList.remove('open');
      toggleButton.setAttribute('aria-expanded', 'false');
    }
  });
}

// Current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Interactive background particles
(() => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  let width = 0;
  let height = 0;
  let particles = [];
  const maxParticles = 90; // balanced for perf
  const linkDistance = 140;
  const mouseInfluence = 120;

  const mouse = { x: null, y: null };

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor(maxParticles * (width * height) / (1400 * 900));
    const target = Math.min(maxParticles, Math.max(40, count));
    for (let i = 0; i < target; i++) {
      particles.push({
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.3, 0.3),
        vy: random(-0.3, 0.3),
        r: random(1, 2.2),
        hue: 215 + random(-10, 10),
        alpha: random(0.5, 1),
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections first (under particles)
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDistance) {
          const t = 1 - dist / linkDistance;
          ctx.strokeStyle = `rgba(138, 180, 255, ${t * 0.15})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    for (const p of particles) {
      // Mouse interaction: gentle repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < mouseInfluence && mDist > 0.001) {
          const force = (mouseInfluence - mDist) / mouseInfluence;
          p.vx += (mdx / mDist) * force * 0.06;
          p.vy += (mdy / mDist) * force * 0.06;
        }
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Soft bounds with wrap
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Slight velocity dampening
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Draw particle
      ctx.fillStyle = `hsla(${p.hue}, 100%, 78%, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  // Events
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Init
  resize();
  createParticles();
  step();
})();


