/* =========================================
   RASAM UNIVERSE — THE CREATOR
   RICH STARFIELD ENGINE v2
   TWINKLE / FLOAT / CURSOR PARALLAX
========================================= */

(() => {
  const canvas = document.getElementById("creator-starfield");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let animationFrame = null;
  let lastFrame = 0;
  let elapsedTime = 0;

  const FRAME_INTERVAL = 1000 / 30;

  const pointer = {
    targetX: 0, targetY: 0,
    currentX: 0, currentY: 0
  };

  const CONFIG = {
    density: 0.00042,
    minStars: 280,
    maxStars: 850,
    driftSpeed: 3.5,
    cursorEase: 0.075,
    cursorStrength: 38,
    floatingStrength: 1.8
  };

  const LAYERS = {
    distant: {
      minRadius: 0.35, maxRadius: 0.8,
      minAlpha: 0.18, maxAlpha: 0.55,
      speed: 0.18, parallax: 0.45, float: 0.7, twinkle: 0.35
    },
    midground: {
      minRadius: 0.65, maxRadius: 1.35,
      minAlpha: 0.3, maxAlpha: 0.78,
      speed: 0.45, parallax: 0.85, float: 1.3, twinkle: 0.55
    },
    anchor: {
      minRadius: 1.15, maxRadius: 2.0,
      minAlpha: 0.55, maxAlpha: 0.95,
      speed: 0.75, parallax: 1.3, float: 2, twinkle: 0.75
    }
  };

  function createStar() {
    const depth = Math.random();
    const layer = depth < 0.58 ? "distant" : depth < 0.91 ? "midground" : "anchor";
    const config = LAYERS[layer];
    const alpha = config.minAlpha + Math.random() * (config.maxAlpha - config.minAlpha);

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: config.minRadius + Math.random() * (config.maxRadius - config.minRadius),
      alpha,
      baseAlpha: alpha,
      layer,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.55 + Math.random() * 1.25,
      twinkleDepth: 0.35 + Math.random() * config.twinkle,
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.22 + Math.random() * 0.42,
      floatAmplitude: (0.8 + Math.random() * 2.0) * config.float,
      speed: config.speed,
      parallax: config.parallax
    };
  }

  function generateStars() {
    const total = Math.floor(Math.min(
      CONFIG.maxStars,
      Math.max(CONFIG.minStars, width * height * CONFIG.density)
    ));
    stars = Array.from({ length: total }, createStar);
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    generateStars();
    drawStars(elapsedTime);

    if (!reducedMotion.matches) startAnimation();
  }

  function getStarAlpha(star, time) {
    const wave = Math.sin(time * star.twinkleSpeed + star.phase);
    const brightness = 1 - star.twinkleDepth * (0.5 - wave * 0.5);
    return Math.max(0, Math.min(1, star.baseAlpha * brightness));
  }

  function drawStar(star, time) {
    const alpha = getStarAlpha(star, time);
    const floatY = Math.sin(time * star.floatSpeed + star.floatPhase) *
      star.floatAmplitude * CONFIG.floatingStrength;
    const floatX = Math.cos(time * star.floatSpeed * 0.7 + star.floatPhase) *
      star.floatAmplitude * 0.35;

    const cursorX = pointer.currentX * CONFIG.cursorStrength * star.parallax;
    const cursorY = pointer.currentY * CONFIG.cursorStrength * star.parallax;
    const x = star.x + floatX + cursorX;
    const y = star.y + floatY + cursorY;

    ctx.beginPath();
    ctx.arc(x, y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(229, 217, 255, ${alpha})`;
    ctx.fill();

    if (star.layer === "anchor") {
      ctx.beginPath();
      ctx.arc(x, y, star.radius * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(174, 143, 230, ${alpha * 0.18})`;
      ctx.fill();
    }
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => drawStar(star, time));
  }

  function updateStars(deltaTime) {
    const dt = Math.min(deltaTime, 0.05);
    stars.forEach(star => {
      star.x -= CONFIG.driftSpeed * star.speed * dt;
      if (star.x < -5) {
        star.x = width + 5;
        star.y = Math.random() * height;
      }
    });
  }

  function updatePointer() {
    pointer.currentX += (pointer.targetX - pointer.currentX) * CONFIG.cursorEase;
    pointer.currentY += (pointer.targetY - pointer.currentY) * CONFIG.cursorEase;
  }

  function handlePointerMove(event) {
    if (reducedMotion.matches || !width || !height) return;
    pointer.targetX = (event.clientX / width) * 2 - 1;
    pointer.targetY = (event.clientY / height) * 2 - 1;
  }

  function handlePointerLeave() {
    pointer.targetX = 0;
    pointer.targetY = 0;
  }

  function animate(timestamp) {
    animationFrame = null;
    if (reducedMotion.matches) return;
    animationFrame = requestAnimationFrame(animate);

    if (!lastFrame) lastFrame = timestamp;
    const frameDelta = timestamp - lastFrame;
    if (frameDelta < FRAME_INTERVAL) return;

    const deltaTime = frameDelta / 1000;
    lastFrame = timestamp;
    elapsedTime += deltaTime;
    updatePointer();
    updateStars(deltaTime);
    drawStars(elapsedTime);
  }

  function startAnimation() {
    if (animationFrame !== null || reducedMotion.matches) return;
    lastFrame = 0;
    animationFrame = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    lastFrame = 0;
    drawStars(elapsedTime);
  }

  function handleMotionPreference() {
    if (reducedMotion.matches) {
      pointer.targetX = pointer.targetY = 0;
      pointer.currentX = pointer.currentY = 0;
      stopAnimation();
    } else {
      startAnimation();
    }
  }

  /* Content reveal */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
      items.forEach(item => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -35px 0px" });

    items.forEach(item => observer.observe(item));
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.addEventListener("pointerleave", handlePointerLeave, { passive: true });
  reducedMotion.addEventListener("change", handleMotionPreference);

  resizeCanvas();
  initReveal();
})();
