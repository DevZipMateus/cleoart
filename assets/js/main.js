/* ============================================================
   CLÉOART CAMISARIA — main.js
   ============================================================ */

// ---------- NAVBAR: scroll + menu mobile ----------
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveSection();
});

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.querySelector('i').className =
    navMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.querySelector('i').className = 'fas fa-bars';
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('open');
    navToggle.querySelector('i').className = 'fas fa-bars';
  }
});

// ---------- ACTIVE SECTION ----------
function highlightActiveSection() {
  const sections  = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
  });
}

// ---------- SMOOTH SCROLL ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---------- INTERSECTION OBSERVER GERAL ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

// ---------- REVEAL ANIMADO (substitui o opacity inline) ----------
function addReveal(selector, direction = '') {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (direction) el.classList.add(direction);
    el.style.transitionDelay = `${i * 0.07}s`;

    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealObs.observe(el);
  });
}

addReveal('.highlight-card');
addReveal('.mvv-card');
addReveal('.produto-card');
addReveal('.contact-item');
addReveal('.mercado-feat');
addReveal('.section__header');
addReveal('.historia-card');
addReveal('.mercado__text', 'from-left');
addReveal('.mercado__features', 'from-right');

// ---------- LINHA ANIMADA sob section__title ----------
const titleObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('line-visible');
      titleObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.section__title').forEach(el => titleObs.observe(el));

// ---------- CONTADOR animado nos highlights ----------
function animateCounter(el, target, suffix = '', duration = 1800) {
  const isText = isNaN(parseInt(target));
  if (isText) { el.textContent = target; return; }

  const start     = 0;
  const end       = parseInt(target.replace(/\D/g, ''));
  const prefix    = target.replace(/[0-9]/g, '').replace(suffix, '').trim();
  const startTime = performance.now();

  function update(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease     = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current  = Math.floor(ease * end);
    el.textContent = prefix + current + suffix;

    if (progress < 1) requestAnimationFrame(update);
    else {
      el.textContent = target;
      el.classList.add('pop');
      setTimeout(() => el.classList.remove('pop'), 400);
    }
  }
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el       = entry.target;
      const original = el.getAttribute('data-target');
      animateCounter(el, original);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.highlight-card__num').forEach(el => {
  el.setAttribute('data-target', el.textContent.trim());
  el.textContent = '0';
  counterObs.observe(el);
});

// ---------- PARALLAX SUTIL na logo do hero ----------
const heroLogo = document.querySelector('.hero__logo');
if (heroLogo) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroLogo.style.transform = `translateY(${scrolled * 0.06}px)`;
    }
  }, { passive: true });
}

// ---------- Ano dinâmico no footer ----------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer__bottom p').forEach(el => {
    el.innerHTML = el.innerHTML.replace('2024', new Date().getFullYear());
  });
});
