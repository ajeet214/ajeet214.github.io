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
// --- Projects: search + tag filter
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.project'));
  const search = document.getElementById('projectSearch');
  const chips = Array.from(document.querySelectorAll('.proj-filters .chip'));
  const empty = document.getElementById('projectsEmpty');

  let activeTag = 'all';
  let term = '';

  function matches(card){
    const title = (card.dataset.title || '').toLowerCase();
    const desc  = (card.dataset.desc || '').toLowerCase();
    const techs = (card.dataset.tech || '').split(',').map(s=>s.trim().toLowerCase());

    const byText = !term || title.includes(term) || desc.includes(term) || techs.some(t=>t.includes(term));
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
    empty.style.display = visible ? 'none' : '';
  }

  // search
  if (search){
    search.addEventListener('input', () => {
      term = search.value.trim().toLowerCase();
      apply();
    });
  }

  // tag chips
  chips.forEach(btn => {
    btn.addEventListener('click', () => {
      chips.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      activeTag = btn.dataset.filter || 'all';
      apply();
    });
  });

  apply(); // initial
});