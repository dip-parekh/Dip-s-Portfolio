/* ============================================
   MOBILE NAVIGATION
   ============================================ */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');
  const links = document.querySelectorAll('.nav-link');
  if (!toggle) return;

  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (overlay) overlay.classList.toggle('is-active', open);
  };

  toggle.addEventListener('click', () => {
    setMenu(!document.body.classList.contains('menu-open'));
  });

  if (overlay) {
    overlay.addEventListener('click', () => setMenu(false));
  }

  links.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  // Reset menu state when resizing to desktop widths
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setMenu(false);
  });
})();

/* ============================================
   CONTACT FORM
   ============================================ */
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

/* ============================================
   IMAGE GALLERY MODAL
   ============================================ */
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

/* ============================================
   LANDING CARD TILT
   ============================================ */
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

/* ============================================
   THEME + ACCESSIBILITY SETTINGS
   ============================================ */
(function () {
  const STORAGE_KEY = 'a11y-settings';
  const html = document.documentElement;

  const DEFAULTS = {
    theme: '',
    textSize: 'normal',
    highContrast: false,
    underlineLinks: false,
    reduceMotion: false,
    grayscale: false,
    bigCursor: false,
    readingGuide: false,
  };

  function readSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULTS };
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch (e) {
      return { ...DEFAULTS };
    }
  }

  function writeSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      // Ignore storage errors (e.g. private mode)
    }
  }

  let settings = readSettings();

  // Resolve default theme from OS preference if not explicitly stored
  if (!settings.theme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    settings.theme = prefersDark ? 'dark' : 'light';
  }

  function applySettings() {
    // Theme
    if (settings.theme) {
      html.setAttribute('data-theme', settings.theme);
    } else {
      html.removeAttribute('data-theme');
    }

    // Text size
    if (settings.textSize && settings.textSize !== 'normal') {
      html.setAttribute('data-text-size', settings.textSize);
    } else {
      html.removeAttribute('data-text-size');
    }

    // Boolean toggles
    const toggles = [
      'highContrast',
      'underlineLinks',
      'reduceMotion',
      'grayscale',
      'bigCursor',
      'readingGuide',
    ];
    toggles.forEach((name) => {
      const attr = `data-${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      if (settings[name]) {
        html.setAttribute(attr, 'true');
      } else {
        html.removeAttribute(attr);
      }
    });

    // Update UI controls
    updateWidgetUI();
    updateSwitchStates();

    // Notify canvas + other systems
    document.dispatchEvent(new CustomEvent('a11y:changed', { detail: settings }));
  }

  function updateSwitchStates() {
    document.querySelectorAll('[data-switch]').forEach((control) => {
      const key = control.dataset.switch;
      if (typeof settings[key] === 'boolean') {
        control.setAttribute('aria-checked', String(settings[key]));
      }
    });
  }

  function updateWidgetUI() {
    // Theme options
    document.querySelectorAll('[data-option="theme"]').forEach((option) => {
      option.setAttribute('aria-pressed', String(option.dataset.value === settings.theme));
    });
    // Text size options
    document.querySelectorAll('[data-option="textSize"]').forEach((option) => {
      option.setAttribute('aria-pressed', String(option.dataset.value === settings.textSize));
    });
  }

  // Store resolved theme even if it came from OS default
  writeSettings(settings);
  applySettings();

  // Panel open/close
  const toggle = document.querySelector('.accessibility-toggle');
  const panel = document.querySelector('.accessibility-panel');
  const closeBtn = document.querySelector('.a11y-close');

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      panel.setAttribute('aria-hidden', String(!isOpen));
    });

    closeBtn && closeBtn.addEventListener('click', () => {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
    });

    document.addEventListener('click', (event) => {
      const widget = document.querySelector('.accessibility-widget');
      if (widget && !widget.contains(event.target)) {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Event delegation for options + switches
  const widget = document.querySelector('.accessibility-widget');
  if (widget) {
    widget.addEventListener('click', (event) => {
      const option = event.target.closest('[data-option]');
      if (option) {
        const { key, value } = option.dataset;
        settings[key] = value;
        writeSettings(settings);
        applySettings();
        return;
      }

      const switchControl = event.target.closest('[data-switch]');
      if (switchControl) {
        const key = switchControl.dataset.switch;
        settings[key] = !settings[key];
        writeSettings(settings);
        applySettings();
        return;
      }

      const reset = event.target.closest('[data-reset]');
      if (reset) {
        settings = { ...DEFAULTS, theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' };
        writeSettings(settings);
        applySettings();
      }
    });
  }
})();

/* ============================================
   READING GUIDE
   ============================================ */
(function () {
  const guide = document.querySelector('.reading-guide');
  if (!guide) return;

  document.addEventListener('mousemove', (event) => {
    guide.style.top = `${event.clientY}px`;
  });
})();

/* ============================================
   PARTICLE CANVAS (theme-aware)
   ============================================ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles;
  let animationId = null;
  let motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getCssVar(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

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
    const bg = getCssVar('--canvas-bg', '#0a0d12');
    const accent = getCssVar('--accent', '#e3a63e');

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bg;
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
      ctx.fillStyle = accent;
      ctx.globalAlpha = p.alpha * 0.6;
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (motionAllowed) {
      animationId = requestAnimationFrame(draw);
    }
  }

  function start() {
    cancelAnimationFrame(animationId);
    resize();
    makeParticles();
    draw();
  }

  function setMotion(allowed) {
    motionAllowed = allowed;
    cancelAnimationFrame(animationId);
    if (motionAllowed) {
      draw();
    } else {
      // Draw one static frame when motion is disabled
      ctx.clearRect(0, 0, width, height);
      const bg = getCssVar('--canvas-bg', '#0a0d12');
      const accent = getCssVar('--accent', '#e3a63e');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = p.alpha * 0.6;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
  }

  start();

  window.addEventListener('resize', start);

  // React to theme/a11y changes
  document.addEventListener('a11y:changed', (event) => {
    const { reduceMotion } = event.detail || {};
    setMotion(!reduceMotion);
  });

  // Also react to system-level reduced-motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleMotionChange = (event) => {
    motionAllowed = !event.matches;
    setMotion(motionAllowed);
  };
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleMotionChange);
  }
})();

/* ============================================
   ANIMATED HERO TEXT (landing)
   ============================================ */
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

/* ============================================
   STAT COUNTERS
   ============================================ */
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

/* ============================================
   ANIMATE ON SCROLL
   ============================================ */
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

/* ============================================
   SKILL BARS
   ============================================ */
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

