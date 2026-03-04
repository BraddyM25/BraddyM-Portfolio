const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ══════════════════════════════════════════
   SCROLL ANIMATIONS (Intersection Observer)
══════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('in-view'), Number(delay));
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el));

/* ══════════════════════════════════════════
   MODAL HELPERS
══════════════════════════════════════════ */
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}
function overlayClose(e, el) {
  if (e.target === el) { el.classList.remove('active'); document.body.style.overflow = ''; }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

function openGallery(src, title, desc) {
  document.getElementById('g-img').src              = src;
  document.getElementById('g-title').textContent    = title;
  document.getElementById('g-desc').textContent     = desc;
  openModal('modal-gallery');
}

/* ══════════════════════════════════════════
   EMAILJS CONFIG
   Fill in your three IDs from emailjs.com
══════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = 'Wtfpl2SQY5ZF5Lmwr';   // Account -> API Keys -> Public Key
const EMAILJS_SERVICE_ID  = 'service_opoo4dd';   // Email Services -> your service ID
const EMAILJS_TEMPLATE_ID = 'template_cyrd6hv';  // Email Templates -> your template ID

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

function showStatus(type, msg) {
  const el = document.getElementById('form-status');
  el.className = 'form-status ' + type;
  el.textContent = msg;
}

function saveLocal(entry) {
  const all = getLocal();
  all.push(entry);
  try { localStorage.setItem('portfolio_contacts', JSON.stringify(all)); } catch(_) {}
}
function getLocal() {
  try { return JSON.parse(localStorage.getItem('portfolio_contacts') || '[]'); } catch(_) { return []; }
}

async function submitContact() {
  const name   = document.getElementById('c-name').value.trim();
  const email  = document.getElementById('c-email').value.trim();
  const msg    = document.getElementById('c-msg').value.trim();
  const btn    = document.getElementById('send-btn');

  if (!name || !email || !msg) {
    showStatus('error', 'Please fill out all three fields before sending.');
    return;
  }
  if (!email.includes('@')) {
    showStatus('error', 'Please enter a valid email address.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name:    name,
        from_email:   email,
        message:      msg,
        reply_to:     email,
      },
      EMAILJS_PUBLIC_KEY
    );

    saveLocal({ name, email, message: msg, timestamp: new Date().toISOString() });

    document.getElementById('c-name').value  = '';
    document.getElementById('c-email').value = '';
    document.getElementById('c-msg').value   = '';

    showStatus('success', '✓ Message sent! I\'ll get back to you soon, ' + name + '.');
    renderSubmissions();

  } catch (err) {
    console.error('EmailJS error:', err);
    showStatus('error', 'Something went wrong. Please try again or email me directly.');
  }

  btn.disabled = false;
  btn.textContent = 'Send Message';
}

function renderSubmissions() {
  const list = document.getElementById('submissions-list');
  const data = getLocal();
  if (!data.length) {
    list.innerHTML = '<p class="no-msg">No messages yet — be the first!</p>';
    return;
  }
  list.innerHTML = data.slice().reverse().map(s => `
    <div class="submission-card">
      <div class="s-name">${escHtml(s.name)}</div>
      <div class="s-email">${escHtml(s.email)}</div>
      <div class="s-msg">${escHtml(s.message)}</div>
      <div class="s-time">${new Date(s.timestamp).toLocaleString()}</div>
    </div>
  `).join('');
}

renderSubmissions();




