/* RASAM — WEB DESIGN / restrained motion and reveal behavior */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealItems = document.querySelectorAll(".wd-reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  }


  const motionTabs = document.querySelectorAll(".wd-motion-tab");
  const motionDetail = document.querySelector(".wd-motion-detail");
  const motionContent = {
    navigation: {
      index: "01 / NAVIGATION",
      title: "Explore with intention.",
      copy: "Clear chapter destinations help visitors move through the universe without losing their place."
    },
    reveal: {
      index: "02 / SCROLL REVEAL",
      title: "Discover as you move.",
      copy: "Content enters the experience progressively, creating a measured rhythm as visitors scroll."
    },
    motion: {
      index: "03 / AMBIENT MOTION",
      title: "Motion with restraint.",
      copy: "Slow orbital movement and subtle star pulses add atmosphere without competing with the message."
    }
  };

  motionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = motionContent[tab.dataset.motion];
      if (!selected || !motionDetail) return;

      motionTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      motionDetail.innerHTML = `
        <span class="wd-motion-detail-index">${selected.index}</span>
        <h3>${selected.title}</h3>
        <p>${selected.copy}</p>
      `;
    });
  });

  const canvas = document.getElementById("wd-starfield");
  const ctx = canvas ? canvas.getContext("2d") : null;
  if (!canvas || !ctx || reduceMotion) return;

  let width = 0;
  let height = 0;
  let stars = [];
  let frame = 0;
  let running = true;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(145, Math.max(55, Math.round((width * height) / 12500)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.05 + 0.18,
      alpha: Math.random() * 0.38 + 0.12,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.009 + 0.002
    }));
  };

  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    stars.forEach((star) => {
      star.phase += star.speed;
      const opacity = star.alpha * (0.72 + Math.sin(star.phase) * 0.28);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 207, 178, ${opacity})`;
      ctx.fill();
    });
    frame = window.requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      window.cancelAnimationFrame(frame);
    } else if (!running) {
      running = true;
      draw();
    }
  });
});
