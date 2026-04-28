/* ===== BUBBLE CANVAS ===== */
const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');

let bubbles = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function createBubble() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 20,
    r: Math.random() * 14 + 4,
    speed: Math.random() * 1.2 + 0.4,
    opacity: Math.random() * 0.4 + 0.1,
    drift: (Math.random() - 0.5) * 0.6,
    hue: Math.random() * 40 + 15   // orange-yellow range
  };
}

for (let i = 0; i < 60; i++) {
  const b = createBubble();
  b.y = Math.random() * canvas.height;
  bubbles.push(b);
}

function animateBubbles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bubbles.forEach((b, i) => {
    b.y     -= b.speed;
    b.x     += b.drift;
    b.opacity -= 0.0008;

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${b.hue}, 100%, 60%, ${b.opacity})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // inner highlight
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${b.hue}, 100%, 90%, ${b.opacity * 0.8})`;
    ctx.fill();

    if (b.y < -20 || b.opacity <= 0) {
      bubbles[i] = createBubble();
    }
  });

  requestAnimationFrame(animateBubbles);
}
animateBubbles();

/* ===== SCROLL REVEAL ===== */
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), parseInt(delay));
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));

/* ===== COUNTER ANIMATION ===== */
const counters = document.querySelectorAll('.count');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

/* ===== NAVBAR SCROLL EFFECT ===== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 60
    ? 'rgba(0,0,0,0.85)'
    : 'rgba(0,0,0,0.4)';
});

/* ===== FLAVOR CARD GLOW COLOR ===== */
document.querySelectorAll('.flavor-card').forEach(card => {
  const color = card.dataset.color;
  const glow  = card.querySelector('.card-glow');
  card.addEventListener('mouseenter', () => {
    glow.style.background = `radial-gradient(circle at 50% 0%, ${color}33, transparent 70%)`;
    card.style.borderColor = color + '66';
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = '';
  });
});

/* ===== FLAVOR BTN RIPPLE ===== */
document.querySelectorAll('.flavor-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:80px; height:80px;
      background:rgba(255,255,255,0.3);
      top:${e.clientY - rect.top - 40}px;
      left:${e.clientX - rect.left - 40}px;
      transform:scale(0); animation:rippleAnim 0.5s ease-out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim {
  to { transform: scale(3); opacity: 0; }
}`;
document.head.appendChild(style);

/* ===== NEWSLETTER FORM ===== */
const nlForm = document.getElementById('nlForm');
const nlSuccess = document.getElementById('nlSuccess');
if (nlForm) {
  nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    nlForm.style.display = 'none';
    nlSuccess.style.display = 'block';
  });
}

/* ===== PARALLAX HERO BOTTLE ===== */
const bottleWrap = document.querySelector('.bottle-wrap');
window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  if (bottleWrap) {
    bottleWrap.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
  }
});
