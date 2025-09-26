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

  // Highlight active link
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  const map = {
    home: ['/', '/index.html'],
    about: ['/about/', '/about/index.html'],
    projects: ['/projects/', '/projects/index.html'],
    blog: ['/blog/', '/blog/index.html'],
    contact: ['/contact/', '/contact/index.html'],
  };
  document.querySelectorAll('.site-nav [data-link]').forEach(a => {
    const key = a.getAttribute('data-link');
    if (map[key] && map[key].includes(path)) a.classList.add('active');
  });
});


// -----------------------------
// Theme: initialize early
// -----------------------------
(function initTheme() {
  try {
    const saved = localStorage.getItem('theme'); // 'light' | 'dark'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();


// -----------------------------
// Theme toggle + ripple
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const switchInput = document.getElementById('themeSwitch');
  if (!switchInput) return;

  const status = document.getElementById('themeStatus');
  const thumb = switchInput.nextElementSibling
    ? switchInput.nextElementSibling.querySelector('.theme-toggle__thumb')
    : null;

  const current = document.documentElement.getAttribute('data-theme') || 'light';
  switchInput.checked = (current === 'dark');
  switchInput.setAttribute('aria-checked', String(switchInput.checked));

  function setTheme(next) {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const isDark = (next === 'dark');
    switchInput.checked = isDark;
    switchInput.setAttribute('aria-checked', String(isDark));
    if (status) status.textContent = isDark ? 'Dark mode enabled' : 'Light mode enabled';
  }

  switchInput.addEventListener('change', () => {
    setTheme(switchInput.checked ? 'dark' : 'light');
  });

  switchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setTheme('dark'); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setTheme('light'); }
  });

  function triggerRipple() {
    if (!thumb) return;
    thumb.classList.remove('ripple');
    void thumb.offsetWidth;
    thumb.classList.add('ripple');
  }
  switchInput.addEventListener('click', triggerRipple);
  switchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      requestAnimationFrame(triggerRipple);
    }
  });
});


// -----------------------------
// Contact form (Formspree)
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('contactStatus');
  const submitBtn = document.getElementById('contactSubmit');
  const endpoint = form.getAttribute('action');

  const setStatus = (type, msg) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove('ok', 'err', 'loading');
    status.classList.add(type);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.reportValidity && !form.reportValidity()) return;

    try {
      submitBtn?.setAttribute('disabled', 'true');
      setStatus('loading', 'Sending…');

      const formData = new FormData(form);
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        form.reset();
        setStatus('ok', '✅ Thanks! Your message was sent successfully.');
      } else {
        let message = '❌ Sorry, something went wrong. Please try again.';
        try {
          const data = await res.json();
          if (data?.errors?.length) {
            message = '❌ ' + data.errors.map(e => e.message).join(' ');
          }
        } catch {}
        setStatus('err', message);
      }
    } catch {
      setStatus('err', '❌ Network error. Please check your connection and try again.');
    } finally {
      submitBtn?.removeAttribute('disabled');
      setTimeout(() => { if (status) status.textContent = ''; }, 6000);
    }
  });
});


// -----------------------------
// Projects: filters + search
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const grid   = document.getElementById('projectsGrid');
  if (!grid) return;

  const cards  = Array.from(grid.querySelectorAll('.project'));
  const search = document.getElementById('projectSearch');
  const chips  = Array.from(document.querySelectorAll('.proj-filters .chip'));
  const empty  = document.getElementById('projectsEmpty');
  const clearBtn = document.getElementById('projectClear');

  let activeTag = 'all';
  let term = '';

  function matches(card){
    const title = (card.dataset.title || '').toLowerCase();
    const desc  = (card.dataset.desc  || '').toLowerCase();
    const techs = (card.dataset.tech  || '').split(',').map(s => s.trim().toLowerCase());
    const byText = !term || title.includes(term) || desc.includes(term) || techs.some(t => t.includes(term));
    const byTag  = activeTag === 'all' || techs.includes(activeTag.toLowerCase());
    return byText && byTag;
  }

  function apply(){
    let visible = 0;
    cards.forEach(c => {
      const show = matches(c);
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (empty) empty.style.display = visible ? 'none' : '';
  }

  function setFilter(tagLabel){
    const value = (tagLabel || 'all').trim();
    activeTag = value.toLowerCase() === 'all' ? 'all' : value;
    chips.forEach(b => b.setAttribute('aria-pressed', 'false'));
    const match = chips.find(b => (b.dataset.filter || b.textContent).toLowerCase() === activeTag.toLowerCase());
    if (match) match.setAttribute('aria-pressed', 'true');
    apply();
  }

  if (search){
    search.addEventListener('input', () => {
      term = search.value.trim().toLowerCase();
      apply();
    });
  }

  chips.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter || btn.textContent);
    });
  });

  grid.querySelectorAll('.tags span').forEach(tag => {
    tag.setAttribute('role','button');
    tag.setAttribute('aria-label', `Filter by ${tag.textContent.trim()}`);
    tag.tabIndex = 0;
    tag.addEventListener('click', () => setFilter(tag.textContent));
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setFilter(tag.textContent);
      }
    });
  });

  if (clearBtn){
    clearBtn.addEventListener('click', () => {
      chips.forEach(b => b.setAttribute('aria-pressed','false'));
      const all = chips.find(b => (b.dataset.filter || '').toLowerCase() === 'all') || chips[0];
      if (all) all.setAttribute('aria-pressed','true');
      activeTag = 'all';
      term = '';
      if (search) search.value = '';
      apply();
    });
  }

  apply();
});


// -----------------------------
// About: reveal animation
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transition = 'opacity .4s ease, transform .4s ease';
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => io.observe(el));
});


// -----------------------------
// Language: detection + switcher
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('langDropdown');
  const menu = document.getElementById('langMenu');
  const current = document.getElementById('currentLang');
  if (!btn || !menu) return;

  // Redirect helper
  function redirectToLang(lang) {
    const path = window.location.pathname.replace(/^\/(en|vn|kr)/, '').replace(/^\/+/, '');
    if (lang === 'en') {
      window.location.href = `/${path}`;
    } else {
      window.location.href = `/${lang}/${path}`;
    }
  }

  // Toggle dropdown
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    menu.hidden = expanded;
  });

  // Handle selection
  menu.querySelectorAll('a[data-lang]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = link.dataset.lang;
      localStorage.setItem('preferredLang', lang);
      current.textContent = lang.toUpperCase();
      menu.querySelectorAll('a[data-lang]').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      btn.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      redirectToLang(lang);
    });
  });

  // Close menu on outside click / escape
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Reflect saved language
  const saved = localStorage.getItem('preferredLang') || 'en';
  const activeLink = menu.querySelector(`a[data-lang="${saved}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
    current.textContent = saved.toUpperCase();
  }

  // Auto-detect only on homepage root
  const path = window.location.pathname;
  if ((path === '/' || path === '/index.html') && !localStorage.getItem('preferredLang')) {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('vi')) {
      localStorage.setItem('preferredLang', 'vn');
      redirectToLang('vn');
    } else if (browserLang.startsWith('ko')) {
      localStorage.setItem('preferredLang', 'kr');
      redirectToLang('kr');
    }
  }
});
