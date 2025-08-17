
// Mobile nav toggle + active link highlighting
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  }
  // Active link based on pathname
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.site-nav [data-link]').forEach(a => {
    const key = a.getAttribute('data-link');
    const mapping = {
      home: ['/','/index.html'],
      about: ['/about.html'],
      projects: ['/projects.html'],
      blog: ['/blog.html'],
      contact: ['/contact.html']
    };
    if (mapping[key] && mapping[key].includes(path)) a.classList.add('active');
  });
});

// ---- Theme persistence & toggle ----
(function(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      toggle.setAttribute('aria-pressed', String(next==='dark'));
    });
  }
});
