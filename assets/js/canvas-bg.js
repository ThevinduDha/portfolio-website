/**
 * Interactive Particle & Constellation Background
 * Lightweight, high-performance, responsive canvas effect.
 * Automatically respects prefers-reduced-motion and pauses when not visible.
 */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrameId = null;
  let mouse = { x: -1000, y: -1000, radius: 120 };
  let isVisible = true;

  // Particle count based on screen width
  function getParticleCount() {
    if (window.innerWidth < 768) return 35;
    if (window.innerWidth < 1200) return 60;
    return 90;
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function Particle(x, y) {
    this.x = x || Math.random() * width;
    this.y = y || Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 1.8 + 0.8;
    this.baseRadius = this.radius;
  }

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx = -this.vx;
    if (this.y < 0 || this.y > height) this.vy = -this.vy;

    // Mouse interaction (gentle repel with distance-squared for 0 lag)
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distSq = dx * dx + dy * dy;
    const radiusSq = mouse.radius * mouse.radius;

    if (distSq < radiusSq && distSq > 0) {
      const dist = Math.sqrt(distSq);
      const force = (mouse.radius - dist) / mouse.radius;
      const angle = Math.atan2(dy, dx);
      this.x -= Math.cos(angle) * force * 1.5;
      this.y -= Math.sin(angle) * force * 1.5;
    }
  };

  Particle.prototype.draw = function(theme) {
    const isDark = theme !== 'light';
    const dotColor = isDark ? 'rgba(0, 223, 216, 0.7)' : 'rgba(2, 132, 199, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();
  };

  function initParticles() {
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines(theme) {
    const isDark = theme !== 'light';
    const maxDist = 110;
    const maxDistSq = maxDist * maxDist;
    const particleLength = particles.length;

    for (let i = 0; i < particleLength; i++) {
      for (let j = i + 1; j < particleLength; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        // Fast distance-squared rejection avoids costly Math.sqrt on non-connected pairs
        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / maxDist) * (isDark ? 0.18 : 0.12);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark ? `rgba(121, 40, 202, ${alpha})` : `rgba(3, 105, 161, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!isVisible) return;
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(currentTheme);
    }
    drawLines(currentTheme);

    animationFrameId = requestAnimationFrame(animate);
  }

  // Event Listeners
  window.addEventListener('resize', debounce(resize, 150));

  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', function() {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Visibility handling
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      isVisible = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      isVisible = true;
      animate();
    }
  });

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!prefersReduced.matches) {
    resize();
    animate();
  }

  function debounce(fn, delay) {
    let timer = null;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), delay);
    };
  }
})();
