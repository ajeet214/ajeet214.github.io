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
    if (map[key] && map[key].includes(path)) a.classList.add('active');
  });
});

// -----------------------------
// Theme: initialize early
// -----------------------------
(function initTheme() {
  try {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

// -----------------------------
// Theme: switch control (+ keyboard)
// -----------------------------
// Theme: switch control (+ keyboard)
document.addEventListener('DOMContentLoaded', () => {
  const switchInput = document.getElementById('themeSwitch');
  if (!switchInput) return;

  const current = document.documentElement.getAttribute('data-theme') || 'light';
  switchInput.checked = (current === 'dark');
  switchInput.setAttribute('aria-checked', String(switchInput.checked));

  function setTheme(next) {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const isDark = (next === 'dark');
    switchInput.checked = isDark;
    switchInput.setAttribute('aria-checked', String(isDark));

    // NEW: announce to screen readers
    if (status) {
      status.textContent = isDark ? 'Dark mode enabled' : 'Light mode enabled';
    }
  }

  switchInput.addEventListener('change', () => {
    setTheme(switchInput.checked ? 'dark' : 'light');
  });

  switchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setTheme('dark'); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setTheme('light'); }
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
