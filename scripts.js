/* =================================================
   MUGA REMODELING — Site Scripts v2
   ================================================= */

// ── Hero Slider ──
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dot');
let currentSlide = 0, heroTimer = null;

function goToSlide(n) {
  if (!slides.length) return;
  slides[currentSlide]?.classList.remove('active');
  dots[currentSlide]?.classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide]?.classList.add('active');
  dots[currentSlide]?.classList.add('active');
}
function startHeroSlider() { if (slides.length) heroTimer = setInterval(() => goToSlide(currentSlide + 1), 5500); }
function stopHeroSlider()  { clearInterval(heroTimer); heroTimer = null; }

// ── Floating quote stubs ──
function toggleQuote() {}
function openQuote()   {}
function closeQuote()  {}

// ── mailto handler ──
function submitEstimate(event, form) {
  event.preventDefault();
  const d = new FormData(form);
  const name    = d.get('name')?.toString().trim();
  const phone   = d.get('phone')?.toString().trim();
  const project = d.get('project')?.toString().trim();
  if (!name || !phone || !project) { alert('Please fill in your name, phone, and project type.'); return; }
  const address = d.get('address')?.toString().trim() || 'N/A';
  const message = d.get('message')?.toString().trim() || '';
  const sub  = encodeURIComponent(`Free Estimate: ${project}`);
  const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nAddress: ${address}\nProject: ${project}${message ? '\nMessage: ' + message : ''}\n\nPlease contact me to schedule.`);
  window.location.href = `mailto:mugaremodeling@gmail.com?subject=${sub}&body=${body}`;
}

// ── Mobile Nav ──
function setMobileNavState(open) {
  const nav     = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  const btn     = document.querySelector('.mobile-toggle');
  if (!nav) return;

  nav.classList.toggle('open', open);
  nav.setAttribute('aria-hidden', String(!open));
  btn?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';

  if (overlay) {
    if (open) {
      overlay.style.display = 'block';
      requestAnimationFrame(() => { overlay.style.opacity = '1'; });
    } else {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 350);
    }
  }
}
function openMobileNav()  { setMobileNavState(true); }
function closeMobileNav() { setMobileNavState(false); }

// ── Service cards: keyboard accessibility ──
function initServiceCards() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    const title = card.querySelector('.sc-title');
    if (title) card.setAttribute('aria-label', title.textContent.trim());
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
}

// ── Scroll Reveal ──
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

// ── Header scroll + dynamic topbar height ──
function initHeaderScroll() {
  const topbar = document.querySelector('.top-bar');
  const header = document.querySelector('.site-header');
  const snav   = document.querySelector('.service-nav');
  if (!header) return;

  function updateTopbarHeight() {
    const topH    = topbar ? topbar.offsetHeight : 0;
    const headerH = header.offsetHeight;
    document.documentElement.style.setProperty('--topbar-h', topH + 'px');
    if (snav) snav.style.top = (topH + headerH) + 'px';
  }

  updateTopbarHeight();

  const ro = new ResizeObserver(updateTopbarHeight);
  if (topbar) ro.observe(topbar);
  ro.observe(header);

  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 40
      ? '0 2px 32px rgba(0,0,0,0.11)'
      : '0 1px 24px rgba(0,0,0,0.06)';
  }, { passive: true });
}

// ── Service Nav — active highlight on services.html ──
function initServiceNav() {
  const staticNav = document.querySelector('.service-nav.snav-static');
  if (!staticNav) return;

  const items = Array.from(staticNav.querySelectorAll('a.snav-item'));
  if (!items.length) return;

  function setActive() {
    const hash = location.hash || '#top';
    items.forEach(item => {
      const match = (item.getAttribute('href') || '') === hash;
      item.classList.toggle('active', match);
    });
  }
  setActive();

  const sections = items
    .map(item => document.querySelector(item.getAttribute('href') || ''))
    .filter(Boolean);

  const sio = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        items.forEach(item => item.classList.toggle('active', (item.getAttribute('href') || '') === id));
        const activeItem = staticNav.querySelector('.snav-item.active');
        if (activeItem) activeItem.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => sio.observe(s));
}

// ── Smooth scroll ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const topBarH  = document.querySelector('.top-bar')?.offsetHeight || 0;
      const headerH  = document.querySelector('.site-header')?.offsetHeight || 0;
      const snavH    = document.querySelector('.service-nav')?.offsetHeight || 0;
      const offset   = topBarH + headerH + snavH + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ── Init ──
window.addEventListener('DOMContentLoaded', () => {
  startHeroSlider();
  initServiceCards();
  initReveal();
  initHeaderScroll();
  initServiceNav();
  initSmoothScroll();

  document.querySelectorAll('.hero-dot').forEach((d, i) => d.addEventListener('click', () => goToSlide(i)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });
  const overlay = document.getElementById('mobileNavOverlay');
  if (overlay) overlay.addEventListener('click', closeMobileNav);
});

window.addEventListener('beforeunload', () => stopHeroSlider());
