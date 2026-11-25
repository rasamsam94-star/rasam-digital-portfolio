/* ======================================================
   RASAM — THE RECOGNITION / PAGE INTERACTIONS
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Reveal chapters as they enter the viewport.
  const revealItems = document.querySelectorAll(".archive-reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Lightweight starfield that does not depend on the main-page script.
  const canvas = document.getElementById("recognition-starfield");
  const context = canvas ? canvas.getContext("2d") : null;

  if (canvas && context && !reduceMotion) {
    let width = 0;
    let height = 0;
    let stars = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(105, Math.max(48, Math.round((width * height) / 15000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.9 + 0.18,
        alpha: Math.random() * 0.32 + 0.10,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.012 + 0.003
      }));
    };

    let animationFrame;
    const draw = () => {
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.phase += star.speed;
        const opacity = star.alpha * (0.72 + Math.sin(star.phase) * 0.28);
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(190, 218, 255, ${opacity})`;
        context.fill();
      });
      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pagehide", () => window.cancelAnimationFrame(animationFrame), { once: true });
  }

  // Accessible certificate / testimonial image viewer.
  const dialog = document.getElementById("recognitionLightbox");
  if (!dialog) return;

  const dialogImage = dialog.querySelector(".lightbox-image");
  const dialogCaption = dialog.querySelector(".lightbox-caption");
  const closeButton = dialog.querySelector(".lightbox-close");

  document.querySelectorAll("[data-lightbox='true']").forEach((button) => {
    button.addEventListener("click", () => {
      const imagePath = button.dataset.src;
      const imageAlt = button.dataset.alt || "Recognition archive image";
      if (!imagePath) return;

      dialogImage.src = imagePath;
      dialogImage.alt = imageAlt;
      dialogCaption.textContent = imageAlt;

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    });
  });

  const closeDialog = () => {
    if (dialog.open) dialog.close();
    dialogImage.removeAttribute("src");
  };

  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => dialogImage.removeAttribute("src"));
});
