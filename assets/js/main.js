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

// ---- Contact form: inline submit handler (Formspree) ----
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

    // basic client validation (optional but nice)
    if (!form.checkValidity && !form.reportValidity) {
      // older browsers: do nothing
    } else if (form.reportValidity && !form.reportValidity()) {
      return;
    }

    try {
      // UI state
      submitBtn?.setAttribute('disabled', 'true');
      setStatus('loading', 'Sending…');

      const formData = new FormData(form);
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        setStatus('ok', '✅ Thanks! Your message was sent successfully.');
      } else {
        // Try to show server-provided errors
        let message = '❌ Sorry, something went wrong. Please try again.';
        try {
          const data = await res.json();
          if (data && data.errors && data.errors.length) {
            message = '❌ ' + data.errors.map(e => e.message).join(' ');
          }
        } catch (_) { /* ignore JSON parse errors */ }
        setStatus('err', message);
      }
    } catch (err) {
      setStatus('err', '❌ Network error. Please check your connection and try again.');
    } finally {
      submitBtn?.removeAttribute('disabled');
      // Clear the status after a while (optional)
      setTimeout(() => { if (status) status.textContent = ''; }, 6000);
    }
  });
});
