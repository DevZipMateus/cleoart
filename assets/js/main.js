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

// Fecha menu ao clicar num link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.querySelector('i').className = 'fas fa-bars';
  });
});

// Fecha menu ao clicar fora (menu é irmão do navbar no DOM)
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('open');
    navToggle.querySelector('i').className = 'fas fa-bars';
  }
});

// ---------- ACTIVE SECTION na navbar ----------
function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
    }
  });
}

// ---------- ANIMATE ON SCROLL ----------
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const animatables = [
  '.highlight-card',
  '.historia-card',
  '.mvv-card',
  '.produto-card',
  '.mercado-feat',
  '.contact-item',
  '.section__header',
  '.mercado__text',
  '.mercado__features'
];

document.querySelectorAll(animatables.join(', ')).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
  observer.observe(el);
});

document.head.insertAdjacentHTML('beforeend', `
  <style>
    .visible { opacity: 1 !important; transform: translateY(0) !important; }
  </style>
`);

// ---------- SMOOTH SCROLL ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---------- Ano dinâmico no footer ----------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer__bottom p').forEach(el => {
    el.innerHTML = el.innerHTML.replace('2024', new Date().getFullYear());
  });
});
