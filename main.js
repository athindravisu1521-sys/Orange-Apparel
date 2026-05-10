/* ============================================================
   ORANGE APPAREL — main.js
   ============================================================ */

'use strict';

/* ---- Loader ---- */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const minDelay = 1800;
  const start = Date.now();

  function hideLoader() {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, minDelay - elapsed);
    setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
      triggerHeroAnimations();
    }, wait);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }
})();

/* ---- Hero Animations ---- */
function triggerHeroAnimations() {
  const els = document.querySelectorAll('.hero .fade-up');
  els.forEach((el) => {
    el.classList.add('in');
  });
}

/* ---- Scroll Progress Bar ---- */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---- Navbar Scroll Effect ---- */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 48);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Mobile Menu ---- */
(function initMobileMenu() {
  const btn   = document.getElementById('mobileMenuBtn');
  const menu  = document.getElementById('mobileMenu');
  const close = document.getElementById('mobileMenuClose');
  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
  if (close) close.addEventListener('click', closeMenu);

  menu.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();

/* ---- Smooth Scroll for # Links ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
      const annH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ann-h')) || 38;
      const offset = navH + annH;

      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
})();

/* ---- Intersection Observer — Reveal Animations ---- */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -56px 0px' }
  );

  revealEls.forEach((el) => {
    // Skip hero elements — they're handled by triggerHeroAnimations
    if (!el.closest('.hero')) io.observe(el);
  });
})();

/* ---- Counter Animation ---- */
(function initCounters() {
  const counters = document.querySelectorAll('.count[data-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => io.observe(el));

  function animateCount(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }
})();

/* ---- Parallax Orbs ---- */
(function initParallax() {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  if (!orb1 && !orb2) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (orb1) orb1.style.transform = `translateY(${y * 0.28}px)`;
        if (orb2) orb2.style.transform = `translateY(${y * 0.18}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ---- Scroll To Top ---- */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 420);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---- Product Card 3D Tilt ---- */
(function initCardTilt() {
  const cards = document.querySelectorAll('.pcard');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x  = e.clientX - rect.left;
      const y  = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rX = ((y - cy) / cy) * 5;
      const rY = ((cx - x) / cx) * 5;

      card.style.transition = 'none';
      card.style.transform  = `translateY(-10px) perspective(600px) rotateX(${rX}deg) rotateY(${rY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = '';
      card.style.transform  = '';
    });
  });
})();

/* ---- Active Nav Link on Scroll ---- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.style.color = matches ? 'var(--orange)' : '';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((s) => io.observe(s));
})();

/* ---- Newsletter Form ---- */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const btn   = form.querySelector('.newsletter-btn');
    if (!input.value.trim()) return;

    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#10B981';
    input.value = '';
    input.blur();

    setTimeout(() => {
      btn.textContent    = 'Subscribe';
      btn.style.background = '';
    }, 3500);
  });
})();

/* ---- Collection card hover depth ---- */
(function initCollHover() {
  document.querySelectorAll('.coll-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.coll-ghost-text')?.classList.add('hovered');
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.coll-ghost-text')?.classList.remove('hovered');
    });
  });
})();
