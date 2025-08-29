// Mobile nav toggle
const toggleButton = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggleButton && nav) {
  toggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when clicking a link (mobile)
  nav.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.matches('a')) {
      nav.classList.remove('open');
      toggleButton.setAttribute('aria-expanded', 'false');
    }
  });
}

// Current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Background animation removed in favor of a professional image background.


