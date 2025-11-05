// Fade-in on scroll
const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
  threshold: 0.3,
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

console.log("Hello, Zara website!");

// Page-load magic: an eye-catching, lightweight particle/canvas animation
// that spawns colorful drifting particles for a short time and then cleans up.
function launchPageMagic({ duration = 10000, maxParticles = 120 } = {}) {
  // Create canvas overlay
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none"; // allow page interactions
  canvas.style.zIndex = 9999;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  
  // Initialize canvas size with device pixel ratio
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  
  // Set initial size
  resize();
  
  addEventListener("resize", resize);

  const particles = [];
  const colors = ["#ff4d6d", "#ffd166", "#6ee7b7", "#6ea8fe", "#c084fc"];

  function spawnParticle(x, y) {
    const size = 6 + Math.random() * 18;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3; // mostly upward
    const speed = 0.6 + Math.random() * 2.4;
    const life = 80 + Math.random() * 80;
    const hue = colors[Math.floor(Math.random() * colors.length)];
    particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size, life, age: 0, color: hue });
    if (particles.length > maxParticles) particles.shift();
  }

  // initial burst from center-top area
  const cx = innerWidth / 2;
  const cy = innerHeight * 0.25;
  for (let i = 0; i < Math.floor(maxParticles * 0.6); i++) {
    spawnParticle(cx + (Math.random() - 0.5) * 200, cy + (Math.random() - 0.5) * 40);
  }

  // gentle ambient spawns across the top
  let frame = 0;
  function step() {
    frame++;
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // spawn a few ambient particles
    if (Math.random() < 0.25) {
      spawnParticle(Math.random() * innerWidth, 0.98 * innerHeight * Math.random() * 0.25);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      // physics
      p.vy += 0.02 * (0.6 + Math.random() * 0.8); // slight gravity
      p.vx *= 0.999;
      p.vy *= 0.999;
      p.x += p.vx;
      p.y += p.vy;
      p.age++;

      const t = p.age / p.life;
      const alpha = Math.max(0, 1 - t);

      // draw glowing circle
      ctx.beginPath();
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grd.addColorStop(0, hexToRgba(p.color, alpha));
      grd.addColorStop(0.6, hexToRgba(p.color, alpha * 0.5));
      grd.addColorStop(1, hexToRgba("#ffffff", 0));
      ctx.fillStyle = grd;
      ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);

      if (p.age > p.life) {
        particles.splice(i, 1);
      }
    }

    // subtle vignette overlay for drama
    if (frame % 5 === 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      ctx.restore();
    }

    animId = requestAnimationFrame(step);
  }

  // helper to convert #rrggbb to rgba
  function hexToRgba(hex, a = 1) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  let animId = requestAnimationFrame(step);

  // mouse / touch spawns for interactivity while active
  function pointerHandler(e) {
    const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || innerWidth / 2;
    const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || innerHeight / 2;
    for (let i = 0; i < 6; i++) spawnParticle(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30);
  }

  addEventListener("pointermove", pointerHandler);
  addEventListener("touchstart", pointerHandler, { passive: true });

  // stop after duration and remove canvas
  const stopTimeout = setTimeout(() => {
    cancelAnimationFrame(animId);
    removeEventListener("resize", resize);
    removeEventListener("pointermove", pointerHandler);
    removeEventListener("touchstart", pointerHandler);
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    clearTimeout(stopTimeout);
  }, duration);
}

// Launch the effect once the page has fully loaded
window.addEventListener("load", () => {
  try {
    // small delay to let content settle and avoid jank on very slow loads
    setTimeout(() => launchPageMagic({ duration: 12000, maxParticles: 160 }), 250);
  } catch (err) {
    // don't block page if anything goes wrong
    console.error("Page magic failed:", err);
  }
});
