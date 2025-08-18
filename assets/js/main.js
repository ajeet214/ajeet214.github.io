// assets/js/main.js

// -----------------------------
// Mobile nav toggle + active link
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (btn && nav) {
    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Highlight active link based on pathname
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.site-nav [data-link]').forEach(a => {
    const key = a.getAttribute('data-link');
    const map = {
      home: ['/', '/index.html'],
      about: ['/about.html'],
      projects: ['/projects.html'],
      blog: ['/blog.html'],
      contact: ['/contact.html']
    };
    if (map[key] && map[key].includes(path)) {
      a.classList.add('active');
    }
  });
});

// -----------------------------
// Theme: initialize early
// -----------------------------
(function initTheme() {
  try {
    const saved = localStorage.getItem('theme');            // 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

// -----------------------------
// Theme: toggle + persist
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  // Reflect current state on load (aria-pressed for accessibility)
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  toggle.setAttribute('aria-pressed', String(current === 'dark'));

  toggle.addEventListener('click', () => {
    const now = document.documentElement.getAttribute('data-theme') || 'light';
    const next = now === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.setAttribute('aria-pressed', String(next === 'dark'));
  });
});
