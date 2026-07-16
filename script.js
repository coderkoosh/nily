// ===== Nilys Entreprenad =====

// Talar om för CSS:en att JS är igång (annars visas allt innehåll direkt)
document.documentElement.classList.add('js');

// Mobilmeny
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Skugga under headern när sidan är skrollad
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Markera aktiv sektion i menyn medan man skrollar
const navLinks = [...siteNav.querySelectorAll('a[href^="#"]')];
const spySections = navLinks
  .map(link => document.querySelector(link.hash))
  .filter(Boolean);

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link =>
        link.classList.toggle('active', link.hash === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

spySections.forEach(section => spy.observe(section));

// Scroll-reveal
let revealDelivered = false;
const observer = new IntersectionObserver(entries => {
  revealDelivered = true;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Skyddsnät: om observern inte svarat inom 1,5 s visas allt direkt
setTimeout(() => {
  if (!revealDelivered) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }
}, 1500);

// Bildkaruseller i tjänstekorten: crossfade var 3,5 s, pilar och
// klickbara prickar, pausar vid hovring och går att svepa på mobil
document.querySelectorAll('[data-carousel]').forEach(media => {
  const imgs = media.querySelectorAll('img');
  if (imgs.length < 2) return;

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  let index = 0;

  const show = i => {
    imgs[index].classList.remove('is-active');
    dots.children[index].classList.remove('on');
    index = (i + imgs.length) % imgs.length;
    imgs[index].classList.add('is-active');
    dots.children[index].classList.add('on');
  };

  const start = () => setInterval(() => show(index + 1), 3500);
  let timer = start();
  const restart = () => { clearInterval(timer); timer = start(); };

  imgs.forEach((_, i) => {
    const dot = document.createElement('i');
    if (i === 0) dot.classList.add('on');
    dot.addEventListener('click', () => { show(i); restart(); });
    dots.appendChild(dot);
  });
  media.appendChild(dots);

  const arrow = (cls, label, path) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-arrow ' + cls;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"/></svg>';
    media.appendChild(btn);
    return btn;
  };
  arrow('prev', 'Föregående bild', 'm15 18-6-6 6-6')
    .addEventListener('click', () => { show(index - 1); restart(); });
  arrow('next', 'Nästa bild', 'm9 18 6-6-6-6')
    .addEventListener('click', () => { show(index + 1); restart(); });

  media.addEventListener('mouseenter', () => clearInterval(timer));
  media.addEventListener('mouseleave', restart);

  // Svep åt vänster/höger för att byta bild (finger eller mus)
  let startX = null, startY = null;
  media.addEventListener('dragstart', e => e.preventDefault());
  media.addEventListener('pointerdown', e => { startX = e.clientX; startY = e.clientY; });
  media.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      show(dx < 0 ? index + 1 : index - 1);
      restart();
    }
    startX = null;
  });
});

// Lightbox med bläddring mellan alla projektbilder
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

const allShots = [...document.querySelectorAll('.project-gallery .shot img')];
let shotIndex = 0;

function openLightbox(i) {
  shotIndex = (i + allShots.length) % allShots.length;
  const img = allShots[shotIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  const badge = img.parentElement.querySelector('figcaption');
  lightboxCaption.textContent = (badge ? badge.textContent + ': ' : '') + img.alt
    + ' · ' + (shotIndex + 1) + '/' + allShots.length;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

allShots.forEach((img, i) => {
  img.parentElement.addEventListener('click', () => openLightbox(i));
});

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', e => { e.stopPropagation(); openLightbox(shotIndex - 1); });
lightboxNext.addEventListener('click', e => { e.stopPropagation(); openLightbox(shotIndex + 1); });

// Svep i lightboxen för att bläddra (utan att råka stänga den)
let lbStartX = null, lbStartY = null, lbSwiped = false;
lightbox.addEventListener('dragstart', e => e.preventDefault());
lightbox.addEventListener('pointerdown', e => { lbStartX = e.clientX; lbStartY = e.clientY; });
lightbox.addEventListener('pointerup', e => {
  if (lbStartX === null) return;
  const dx = e.clientX - lbStartX;
  const dy = e.clientY - lbStartY;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    openLightbox(dx < 0 ? shotIndex + 1 : shotIndex - 1);
    lbSwiped = true;
  }
  lbStartX = null;
});
lightbox.addEventListener('click', e => {
  if (lbSwiped) { lbSwiped = false; return; }
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') openLightbox(shotIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(shotIndex + 1);
});

// Tillbaka till toppen-knappen
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// E-postknappar: mailto kräver ett e-postprogram, så vi kopierar även
// adressen till urklipp och visar en bekräftelse. Då fungerar knappen alltid.
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', () => {
    const address = link.href.replace('mailto:', '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address)
        .then(() => showToast('E-postadressen är kopierad: ' + address))
        .catch(() => showToast('E-post: ' + address));
    } else {
      showToast('E-post: ' + address);
    }
  });
});

// Årtal i footern
document.getElementById('year').textContent = new Date().getFullYear();
