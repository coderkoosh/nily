// ===== Nilys Entreprenad =====

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

// Scroll-reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Bildkaruseller i tjänstekorten (crossfade var 3,5 s)
document.querySelectorAll('[data-carousel]').forEach(media => {
  const imgs = media.querySelectorAll('img');
  if (imgs.length < 2) return;

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  imgs.forEach((_, i) => {
    const dot = document.createElement('i');
    if (i === 0) dot.classList.add('on');
    dots.appendChild(dot);
  });
  media.appendChild(dots);

  let index = 0;
  setInterval(() => {
    imgs[index].classList.remove('is-active');
    dots.children[index].classList.remove('on');
    index = (index + 1) % imgs.length;
    imgs[index].classList.add('is-active');
    dots.children[index].classList.add('on');
  }, 3500);
});

// Lightbox för projektbilder
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.project-gallery .shot img').forEach(img => {
  img.parentElement.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

// Årtal i footern
document.getElementById('year').textContent = new Date().getFullYear();
