// =============================================
// BROKEN IMAGE FALLBACK
// =============================================
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    const isThumb = this.classList.contains('product-thumb-img');
    const ph = document.createElement('div');
    ph.className = 'photo-placeholder' + (isThumb ? ' thumb' : ' large');
    ph.innerHTML = '<span class="photo-icon">&#128247;</span><span>Photo coming soon</span>';
    this.replaceWith(ph);
  });
});

// =============================================
// NAVBAR — scroll effect + mobile toggle
// =============================================
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity  = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
}

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// =============================================
// ACTIVE NAV LINK based on current page
// =============================================
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (
    href === page ||
    (page === '' && href === 'index.html') ||
    (page === 'index.html' && href === 'index.html')
  ) {
    a.classList.add('active');
  }
});

// =============================================
// COUNTER ANIMATION (stats bar)
// =============================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = Math.ceil(duration / target);
  let current = 0;
  const timer = setInterval(() => {
    current += Math.ceil(target / 60);
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString() + suffix;
  }, step);
}

const counters = document.querySelectorAll('[data-target]');
if (counters.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// =============================================
// PRODUCT FILTER (products page)
// =============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    productCards.forEach(card => {
      if (cat === 'all' || card.dataset.category === cat) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.3s ease';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// =============================================
// QUOTE FORM — validation + submission
// =============================================
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = quoteForm.querySelector('[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const data = new FormData(quoteForm);
      const res = await fetch('https://formspree.io/f/myklyyvz', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        quoteForm.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        const json = await res.json();
        const msg = json.errors ? json.errors.map(e => e.message).join(', ') : 'Something went wrong. Please try again.';
        btn.disabled = false;
        btn.textContent = '✉ Send Quote Request';
        alert(msg);
      }
    } catch (err) {
      btn.disabled = false;
      btn.textContent = '✉ Send Quote Request';
      alert('Network error. Please check your connection and try again.');
    }
  });
}

// =============================================
// FADE-IN ON SCROLL
// =============================================
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: none; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
`;
document.head.appendChild(style);

document.querySelectorAll('.product-card, .why-card, .industry-card, .hero-card').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 0.06}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
