// PS General Construction — shared site behavior

document.addEventListener('DOMContentLoaded', () => {
  // Sticky nav background on scroll
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Desktop dropdown (click to toggle, for touch/trackpad users; CSS handles hover)
  document.querySelectorAll('.nav-links > li.has-dropdown > button, .nav-links > li.has-dropdown > a.dd-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.parentElement;
      const isOpen = parent.classList.contains('open');
      document.querySelectorAll('.nav-links > li.open').forEach(li => li.classList.remove('open'));
      if (!isOpen) parent.classList.add('open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links > li.has-dropdown')) {
      document.querySelectorAll('.nav-links > li.open').forEach(li => li.classList.remove('open'));
    }
  });

  // Mobile menu
  const toggle = document.getElementById('mobileToggle');
  const panel = document.getElementById('mobilePanel');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const opening = !panel.classList.contains('open');
      panel.classList.toggle('open');
      document.body.style.overflow = opening ? 'hidden' : '';
      // Force legible nav text while the panel covers the page, regardless of scroll position
      if (opening) nav.classList.add('scrolled');
      else onScroll();
    });
    panel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        panel.classList.remove('open');
        document.body.style.overflow = '';
        onScroll();
      });
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal, .reveal-stag');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  // Stat count-up
  const statEls = document.querySelectorAll('.stat-num[data-count]');
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statEls.forEach(el => statIo.observe(el));
});
