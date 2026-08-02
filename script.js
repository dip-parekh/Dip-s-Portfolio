(function () {
  const form = document.getElementById('contact-form');
  const statusMessage = document.getElementById('form-status');

  if (statusMessage && window.location.search.includes('sent=1')) {
    statusMessage.classList.add('is-success');
    statusMessage.textContent = 'Thanks! Your message has been sent.';
  }

  if (form) {
    form.addEventListener('submit', () => {
      const submitButton = form.querySelector('button');
      if (submitButton) {
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
      }
      if (statusMessage) {
        statusMessage.classList.remove('is-success');
        statusMessage.textContent = 'Please wait while your message is sent.';
      }
    });
  }
})();

(function () {
  const trigger = document.querySelector('.gallery-trigger');
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const counter = document.getElementById('image-counter');
  const closeButtons = modal ? modal.querySelectorAll('[data-close-modal], .image-modal-close') : [];
  const navButtons = modal ? modal.querySelectorAll('.image-nav') : [];

  if (!trigger || !modal || !modalImage || !counter) return;

  const images = [
    'assets/Froyo 1.png',
    'assets/Froyo 2.png',
    'assets/Froyo 3.png',
    'assets/Froyo 4.png',
    'assets/Froyo 5.png',
  ];

  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    modalImage.src = images[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function openModal() {
    showImage(0);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openModal);
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal();
    }
  });

  closeButtons.forEach((button) => button.addEventListener('click', closeModal));
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.direction === 'next' ? 1 : -1;
      showImage(currentIndex + direction);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
  });
})();

(function () {
  const landingCard = document.querySelector('.landing-card');
  if (!landingCard) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  landingCard.addEventListener('pointermove', (event) => {
    const rect = landingCard.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

    landingCard.style.transform = `perspective(1200px) rotateY(${offsetX}deg) rotateX(${-offsetY}deg)`;
  });

  landingCard.addEventListener('pointerleave', () => {
    landingCard.style.transform = '';
  });
})();

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles;

  const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#e3a63e';

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const count = Math.min(60, Math.floor((width * height) / 28000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0a0d12';
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(227, 166, 62, ${p.alpha * 0.6})`;
      ctx.fill();
    });

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  resize();
  makeParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    makeParticles();
    if (prefersReducedMotion) draw();
  });
})();

(function () {
  const target = document.querySelector('.hero-text[data-animated-text]');
  if (!target) return;

  const text = target.dataset.animatedText || '';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  target.textContent = prefersReducedMotion ? text : '';

  if (prefersReducedMotion) return;

  let index = 0;
  const type = () => {
    target.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      window.setTimeout(type, 45);
    }
  };

  window.setTimeout(type, 400);
})();

(function () {
  const counters = document.querySelectorAll('.stat-value');
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = prefersReducedMotion ? 0 : 2500;

  const animateCounter = (element) => {
    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || '';
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      element.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };

    if (duration === 0) {
      element.textContent = `${target}${suffix}`;
      return;
    }

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, observation) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observation.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
})();

(function () {
  const targets = document.querySelectorAll('.animate-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
})();

(function () {
  const bars = document.querySelectorAll('.bar i');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.target || 0;
          entry.target.style.width = target + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
})();
