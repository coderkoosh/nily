// ============================================
// Nilys Entreprenad — script.js
// ============================================

// Aktuellt år i footern
document.getElementById("year").textContent = new Date().getFullYear();

// Nav: bakgrund när man scrollat
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobilmeny (fullskärmsoverlay)
const navToggle = document.getElementById("navToggle");
const menuOverlay = document.getElementById("menuOverlay");

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", open);
  menuOverlay.setAttribute("aria-hidden", !open);
  navToggle.querySelector(".nav-toggle-label").textContent = open ? "Stäng" : "Meny";
}

navToggle.addEventListener("click", () => {
  setMenu(!document.body.classList.contains("menu-open"));
});

menuOverlay.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

// Scroll-reveal
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 5) * 70, 280)}ms`;
    observer.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}
