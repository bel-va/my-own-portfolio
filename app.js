// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity  = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Scroll-triggered animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item, .skill-card, .edu-card').forEach(el => {
  observer.observe(el);
});

// ── Active nav link highlight ──
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
}, { passive: true });

// ── Contact form — Formspree submission ──
// SETUP: Sign up free at formspree.io with belyn.vaservice@gmail.com
// Then replace YOUR_FORM_ID below with your actual form ID (e.g. "xwpkqvzb")
const FORMSPREE_ID = 'YOUR_FORM_ID';

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = document.getElementById('submit-btn');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const data = {
    name:    document.getElementById('name').value,
    email:   document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
  };

  // If Formspree is not yet configured, fall back to mailto
  if (FORMSPREE_ID === 'YOUR_FORM_ID') {
    const body = `Name: ${data.name}\nEmail: ${data.email}\nService Needed: ${data.subject}\n\nMessage:\n${data.message}`;
    window.location.href = `mailto:belyn.vaservice@gmail.com?subject=Portfolio Inquiry — ${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    showModal();
    form.reset();
    return;
  }

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ ...data, _replyto: data.email }),
    });

    if (res.ok) {
      form.reset();
      showModal();
    } else {
      alert('Something went wrong. Please email me directly at belyn.vaservice@gmail.com');
    }
  } catch {
    alert('Could not send message. Please email me directly at belyn.vaservice@gmail.com');
  }

  btn.textContent = 'Send Message →';
  btn.disabled = false;
}

// ── Booking modal ──
function showModal() {
  document.getElementById('booking-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('booking-modal').style.display = 'none';
  document.body.style.overflow = '';
}

// Close modal on backdrop click
document.getElementById('booking-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
