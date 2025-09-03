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
    const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();


// -----------------------------
// Theme toggle: state + a11y + ripple
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const switchInput = document.getElementById('themeSwitch');
  if (!switchInput) return;

  const status = document.getElementById('themeStatus'); // SR live region (optional)
  const thumb = switchInput.nextElementSibling
    ? switchInput.nextElementSibling.querySelector('.theme-toggle__thumb')
    : null;

  // Reflect current theme on load
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

  // Toggle via click/tap
  switchInput.addEventListener('change', () => {
    setTheme(switchInput.checked ? 'dark' : 'light');
  });

  // Keyboard arrows (enter/space already handled by checkbox)
  switchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setTheme('dark'); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setTheme('light'); }
  });

  // Ripple micro-interaction
  function triggerRipple() {
    if (!thumb) return;
    thumb.classList.remove('ripple');
    void thumb.offsetWidth; // reflow to restart animation
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
// Contact form: inline submit handler (Formspree)
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

    // basic client validation
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
// Projects: search + tag filter + tag-click + clear
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
    // update chip aria-state
    chips.forEach(b => b.setAttribute('aria-pressed', 'false'));
    const match = chips.find(b => (b.dataset.filter || b.textContent).toLowerCase() === activeTag.toLowerCase());
    if (match) match.setAttribute('aria-pressed', 'true');
    apply();
  }

  // search input
  if (search){
    search.addEventListener('input', () => {
      term = search.value.trim().toLowerCase();
      apply();
    });
  }

  // chips
  chips.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter || btn.textContent);
    });
  });

  // make tags inside cards clickable
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

  // clear button
  if (clearBtn){
    clearBtn.addEventListener('click', () => {
      // reset chips
      chips.forEach(b => b.setAttribute('aria-pressed','false'));
      const all = chips.find(b => (b.dataset.filter || '').toLowerCase() === 'all') || chips[0];
      if (all) all.setAttribute('aria-pressed','true');

      // reset state
      activeTag = 'all';
      term = '';
      if (search) search.value = '';

      apply();
    });
  }

  // initial state
  const pressed = chips.find(b => b.getAttribute('aria-pressed') === 'true');
  activeTag = (pressed?.dataset.filter || 'all');
  term = (search?.value || '').trim().toLowerCase();
  apply();
});

// About
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
// Auto language detection (runs only on root `/`)
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // Only redirect if user is on the homepage root (not already in /vn/ or /kr/)
  if (path === '/' || path === '/index.html') {
    const saved = localStorage.getItem('preferredLang');
    const browserLang = navigator.language || navigator.userLanguage;

    // If user already selected a language before, respect that
    if (saved && saved !== 'en') {
      window.location.href = `/${saved}/`;
      return;
    }

    // Otherwise, detect and redirect
    if (browserLang.startsWith('vi')) {
      localStorage.setItem('preferredLang', 'vn');
      window.location.href = '/vn/';
    } else if (browserLang.startsWith('ko')) {
      localStorage.setItem('preferredLang', 'kr');
      window.location.href = '/kr/';
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-switch a[data-lang]').forEach(link => {
    link.addEventListener('click', () => {
      const lang = link.getAttribute('data-lang');
      localStorage.setItem('preferredLang', lang);
    });
  });
});

// Language dropdown toggle
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('langDropdown');
  const menu = document.getElementById('langMenu');
  const current = document.getElementById('currentLang');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    menu.hidden = expanded;
  });

  // Save selected language
  menu.querySelectorAll('a[data-lang]').forEach(link => {
    link.addEventListener('click', () => {
      const lang = link.dataset.lang;
      localStorage.setItem('preferredLang', lang);
      current.textContent = link.textContent.split(' ')[0]; // set flag + short name
    });
  });

  // Close menu if clicked outside
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});
