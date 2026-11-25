/* RASAM — THE INTERFACE page interactions only */
(() => {
  const canvas = document.getElementById('ti-starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, stars = [], raf = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.7);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(150, Math.floor(width * height / 9500));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 1.25 + .25, a: Math.random() * .55 + .18,
        phase: Math.random() * Math.PI * 2, speed: Math.random() * .012 + .003
      }));
      draw(true);
    };
    const draw = (staticFrame = false) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const pulse = staticFrame || reduceMotion ? 1 : .72 + Math.sin(star.phase) * .28;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 202, 160, ${star.a * pulse})`; ctx.fill();
        if (!staticFrame && !reduceMotion) star.phase += star.speed;
      }
      if (!staticFrame && !reduceMotion) raf = requestAnimationFrame(() => draw(false));
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (!reduceMotion) draw(false);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduceMotion) draw(false);
    });
  }

  const revealItems = document.querySelectorAll('.ti-reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const lightbox = document.getElementById('evidence-lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const closeButton = lightbox?.querySelector('.ti-lightbox-close');
  let lastFocusedElement = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImage) lightboxImage.src = '';
    lastFocusedElement?.focus();
  };

  document.querySelectorAll('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      lastFocusedElement = button;
      lightboxImage.src = `../${button.dataset.lightbox}`;
      lightboxImage.alt = button.querySelector('img')?.alt || 'RASAM interface evidence';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeButton?.focus();
    });
  });

  closeButton?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) closeLightbox();
  });

})();
