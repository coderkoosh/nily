// Mobilmeny
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll-animering
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Kontaktformulär – öppnar användarens e-postklient med ifyllt meddelande
const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const subject = encodeURIComponent('Offertförfrågan från ' + data.get('name'));
  const body = encodeURIComponent(
    'Namn: ' + data.get('name') + '\n' +
    'E-post: ' + data.get('email') + '\n' +
    'Telefon: ' + (data.get('phone') || '-') + '\n\n' +
    (data.get('message') || '')
  );
  window.location.href = 'mailto:info@nilysentreprenad.com?subject=' + subject + '&body=' + body;
  document.getElementById('formStatus').textContent =
    'Din e-postklient öppnas – skicka mejlet för att slutföra förfrågan.';
});

// Årtal i footern
document.getElementById('year').textContent = new Date().getFullYear();
