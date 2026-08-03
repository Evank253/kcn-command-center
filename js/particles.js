/**
 * Subtle particle field behind the neural core
 */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0, h = 0, particles = [], rafId = null;

  function resize() {
    const stage = document.getElementById("core-stage");
    if (!stage) return;
    w = stage.clientWidth || 300;
    h = stage.clientHeight || 300;
    canvas.width = w;
    canvas.height = h;
  }

  function create() {
    particles = [];
    const count = Math.min(80, Math.max(20, Math.floor((w * h) / 12000)));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.4 + 0.1
      });
    }
  }

  function draw() {
    if (!ctx || !w) {
      rafId = requestAnimationFrame(draw);
      return;
    }
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 92, 255, ${p.a})`;
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124, 92, 255, ${0.08 * (1 - d / 90)})`;
          ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(draw);
  }

  resize();
  create();
  if (rafId) cancelAnimationFrame(rafId);
  draw();
  window.addEventListener("resize", () => {
    resize();
    create();
  });
}
