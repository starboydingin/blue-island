window.addEventListener('scroll', () => {
  const navbar = document.querySelector('header');

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  navOverlay.addEventListener('click', closeMenu);
}
