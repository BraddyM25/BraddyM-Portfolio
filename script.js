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

// Animation Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('in-view'), Number(delay));
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el));

// Modal functions
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
  document.getElementById('g-img').src           = src;
  document.getElementById('g-title').textContent = title;
  document.getElementById('g-desc').textContent  = desc;
  openModal('modal-gallery');
}

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

async function submitContact() {
  const name  = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const msg   = document.getElementById('c-msg').value.trim();
  const btn   = document.getElementById('send-btn');

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
      const response = await fetch('https://backend-setup-dscf.onrender.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message: msg })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    document.getElementById('c-name').value  = '';
    document.getElementById('c-email').value = '';
    document.getElementById('c-msg').value   = '';

    showStatus('success', '✓ Message sent! I\'ll get back to you soon, ' + name + '.');

  } catch (err) {
    console.error('Error:', err);
    showStatus('error', 'Something went wrong. Please try again.');
  }

  btn.disabled = false;
  btn.textContent = 'Send Message';
}