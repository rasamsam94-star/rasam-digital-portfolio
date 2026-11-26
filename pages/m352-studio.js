
/* =========================================
   M352 STUDIO — NATURAL DRIFTING STARFIELD
   Adapted from RASAM Aries Star System
========================================= */

(() => {
    const canvas = document.getElementById("m352-starfield");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;
    let stars = [];
    let animationFrame = null;
    let isAnimating = false;

    const DESKTOP_STAR_COUNT = 620;
    const MOBILE_STAR_COUNT = 100;

    const getStarCount = () =>
        window.matchMedia("(max-width: 600px)").matches
            ? MOBILE_STAR_COUNT
            : DESKTOP_STAR_COUNT;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const clamp = (v, min = 0, max = 1) =>
        Math.max(min, Math.min(max, v));

    // =====================================
    // CANVAS RESIZE
    // =====================================

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createStars();
        drawStars();
    }

    // =====================================
    // NATURAL DRIFTING STARS
    // =====================================

    function createStars() {
        stars = [];

        const starCount = getStarCount();

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,

                size: Math.random() * 1.5 + 0.3,

                targetAlpha: Math.random() * 0.8 + 0.2,

                speedX: (Math.random() - 0.5) * 0.16,
                speedY: (Math.random() - 0.5) * 0.16,

                twinkleSpeed: Math.random() * 0.018 + 0.006,

                phase: Math.random() * Math.PI * 2,

                emergenceSpeed: Math.random() * 0.008 + 0.002,

                emergencePhase: Math.random() * Math.PI * 2,

                color: Math.random() > 0.65
                    ? "255, 218, 170"
                    : "255, 245, 225"
            });
        }
    }

    // =====================================
    // DRAW STARS
    // =====================================

    function drawStars() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            const twinkle = prefersReducedMotion
                ? 0
                : 0.25 + Math.sin(
                    time * star.twinkleSpeed + star.phase
                ) * 0.35;

            const emergence = prefersReducedMotion
                ? 0.82
                : 0.65 + (
                    Math.sin(
                        time * star.emergenceSpeed +
                        star.emergencePhase
                    ) + 1
                ) * 0.17;

            const alpha = clamp(
                (star.targetAlpha + twinkle) * emergence,
                0.01,
                0.9
            );

            ctx.beginPath();

            ctx.arc(
                star.x,
                star.y,
                star.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(${star.color}, ${alpha})`;

            // Restrained glow is reserved for the largest anchor stars.
            ctx.shadowBlur = star.size > 1.45 ? 7 : 0;

            if (star.size > 1.45) {
                ctx.shadowColor = `rgba(${star.color}, ${alpha * 0.65})`;
            }

            ctx.fill();

            if (star.size > 1.45) ctx.shadowBlur = 0;

            // Natural drifting movement
            if (!prefersReducedMotion) {
                star.x += star.speedX;
                star.y += star.speedY;

                if (star.x < 0) star.x = width;
                if (star.x > width) star.x = 0;

                if (star.y < 0) star.y = height;
                if (star.y > height) star.y = 0;
            }
        });
    }

    // =====================================
    // ANIMATION LOOP
    // =====================================

    function animate() {
        if (document.hidden || prefersReducedMotion || isAnimating) return;

        isAnimating = true;

        const frame = () => {
            if (document.hidden || prefersReducedMotion) {
                isAnimating = false;
                animationFrame = null;
                return;
            }

            time++;
            drawStars();
            animationFrame = requestAnimationFrame(frame);
        };

        animationFrame = requestAnimationFrame(frame);
    }

    function stopAnimation() {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        isAnimating = false;
    }

    // =====================================
    // INITIALIZE
    // =====================================

    resizeCanvas();

    if (!prefersReducedMotion) {
        animate();
    }

    // Responsive canvas
    window.addEventListener("resize", resizeCanvas);

    // Pause animation when browser tab is inactive
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAnimation();
            return;
        }

        if (prefersReducedMotion) {
            drawStars();
        } else {
            animate();
        }
    });

})();

/* =========================================
   M352 STUDIO — MOTION LAYER 01
   GLOBAL SCROLL REVEAL
========================================= */

(() => {
    const page = document.body;

    if (!page || !page.classList.contains("m352-page")) return;

    // Keep all content visible for users who prefer reduced motion.
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Progressive enhancement: without IntersectionObserver,
    // the page remains fully visible and usable.
    if (!("IntersectionObserver" in window)) return;

    const revealTargets = [
        ".m352-hero-copy > *",
        ".m352-hero-visual",
        ".m352-snapshot-intro",
        ".m352-snapshot-item",
        ".m352-story-block",
        ".m352-story-closing",
        ".m352-ch02-section-heading",
        ".m352-ch02-gallery-item",
        ".m352-ch03-section-heading",
        ".m352-ch03-product",
        ".m352-ch04-product-heading",
        ".m352-ch04-product",
        ".m352-ch05-section-heading",
        ".m352-ch05-card",
        ".m352-ch05-wide-card",
        ".m352-ch06-section-heading",
        ".m352-ch06-platform",
        ".m352-ch06-analytics",
        ".m352-ch07-heading",
        ".m352-ch07-section",
        ".m352-ch07-results-block",
        ".m352-ch07-final"
    ].join(",");

    const elements = Array.from(
        document.querySelectorAll(revealTargets)
    );

    if (!elements.length) return;

    // Apply reveal attributes before enabling the CSS hiding state.
    // This prevents content from being hidden if setup fails midway.
    const siblingCounters = new Map();

    elements.forEach(element => {
        element.setAttribute("data-m352-reveal", "");

        const parent = element.parentElement;
        const index = siblingCounters.get(parent) || 0;
        siblingCounters.set(parent, index + 1);

        // Small stagger, capped to keep long groups responsive.
        const delay = Math.min(index * 90, 270);
        element.style.setProperty("--m352-reveal-delay", `${delay}ms`);
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -48px 0px"
    });

    elements.forEach(element => observer.observe(element));

    // Enable the hidden/reveal state only after all targets are observed.
    page.classList.add("m352-motion-ready");
})();

/* =========================================
   M352 STUDIO — MOTION LAYER 03
   CHAPTER ARRIVAL ACCENT
========================================= */

(() => {
    const page = document.body;
    if (!page || !page.classList.contains("m352-page")) return;

    const intros = document.querySelectorAll(
        ".m352-ch02-intro, .m352-ch03-intro, .m352-ch04-intro, .m352-ch05-intro, .m352-ch06-intro, .m352-ch07-intro"
    );
    if (!intros.length) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        intros.forEach(intro => intro.classList.add("m352-chapter-entered"));
        return;
    }

    const chapterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("m352-chapter-entered");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
    });

    intros.forEach(intro => chapterObserver.observe(intro));
})();


/* =========================================
   M352 STUDIO — STABLE DIRECT CHAPTER ARRIVAL
   Supports direct navigation to Chapter 04
   and Klaviyo Email Marketing.
========================================= */

(() => {
    const rawHash = window.location.hash;
    if (!rawHash) return;

    let targetId;

    try {
        targetId = decodeURIComponent(rawHash.slice(1));
    } catch {
        targetId = rawHash.slice(1);
    }

    const supportedTargets = [
        "m352-ch04",
        "klaviyo-email-marketing"
    ];

    if (!supportedTargets.includes(targetId)) return;

    let arrivalStarted = false;
    let userInterrupted = false;

    const markUserInteraction = () => {
        userInterrupted = true;
    };

    window.addEventListener("wheel", markUserInteraction, {
        passive: true,
        once: true
    });

    window.addEventListener("touchstart", markUserInteraction, {
        passive: true,
        once: true
    });

    window.addEventListener("pointerdown", markUserInteraction, {
        passive: true,
        once: true
    });

    window.addEventListener("keydown", markUserInteraction, {
        once: true
    });

    const waitForImage = (img) => {
        if (!img || !img.getAttribute("src")) {
            return Promise.resolve();
        }

        img.loading = "eager";

        if (img.complete) {
            return typeof img.decode === "function"
                ? img.decode().catch(() => {})
                : Promise.resolve();
        }

        return new Promise((resolve) => {
            let settled = false;

            const finish = () => {
                if (settled) return;
                settled = true;

                clearTimeout(timeout);
                img.removeEventListener("load", finish);
                img.removeEventListener("error", finish);

                if (typeof img.decode === "function") {
                    img.decode().catch(() => {}).finally(resolve);
                } else {
                    resolve();
                }
            };

            const timeout = window.setTimeout(finish, 15000);

            img.addEventListener("load", finish, { once: true });
            img.addEventListener("error", finish, { once: true });
        });
    };

    const nextFrame = () =>
        new Promise(resolve =>
            requestAnimationFrame(() => resolve())
        );

    const alignToChapter = () => {
        if (userInterrupted) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        const targetTop =
            target.getBoundingClientRect().top +
            window.scrollY - 24;

        window.scrollTo(0, Math.max(0, targetTop));
    };

    const startArrival = async () => {
        if (arrivalStarted) return;
        arrivalStarted = true;

        const target = document.getElementById(targetId);
        if (!target) return;

        // Wait for images positioned before the destination.
        const imagesAboveTarget = Array.from(document.images).filter(
            img =>
                Boolean(
                    img.compareDocumentPosition(target) &
                    Node.DOCUMENT_POSITION_FOLLOWING
                )
        );

        await Promise.allSettled(
            imagesAboveTarget.map(waitForImage)
        );

        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready.catch(() => {});
        }

        // Allow layout and paint to settle.
        await nextFrame();
        await nextFrame();

        alignToChapter();

        // Final alignment check for late layout changes.
        window.setTimeout(() => {
            if (userInterrupted) return;

            requestAnimationFrame(alignToChapter);
        }, 180);
    };

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            startArrival,
            { once: true }
        );
    } else {
        startArrival();
    }

    // Handle back-forward cache restoration.
    window.addEventListener("pageshow", (event) => {
        if (!event.persisted) return;

        arrivalStarted = false;
        userInterrupted = false;

        startArrival();
    });
})();


/* =========================================
   M352 STUDIO — EVIDENCE IMAGE PREVIEW
   Click an existing evidence image to enlarge it.
   No existing content or page behavior is changed.
========================================= */

(() => {
    const page = document.querySelector("body.m352-page");
    const evidenceImages = page
        ? Array.from(page.querySelectorAll("main img"))
        : [];

    if (!evidenceImages.length) return;

    evidenceImages.forEach((img, index) => {
        img.classList.add("m352-evidence-image");
        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");

        const description = img.getAttribute("alt") || `Evidence image ${index + 1}`;
        img.setAttribute("aria-label", `Preview image: ${description}`);
    });

    const lightbox = document.createElement("div");
    lightbox.className = "m352-evidence-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Evidence image preview");
    lightbox.setAttribute("aria-hidden", "true");

    lightbox.innerHTML = `
        <div class="m352-evidence-lightbox__content">
            <button
                class="m352-evidence-lightbox__close"
                type="button"
                aria-label="Close image preview"
            >&times;</button>
            <img class="m352-evidence-lightbox__image" alt="">
            <p class="m352-evidence-lightbox__caption"></p>
        </div>
    `;

    document.body.appendChild(lightbox);

    const previewImage = lightbox.querySelector(".m352-evidence-lightbox__image");
    const caption = lightbox.querySelector(".m352-evidence-lightbox__caption");
    const closeButton = lightbox.querySelector(".m352-evidence-lightbox__close");

    let activeTrigger = null;
    let previousBodyOverflow = "";

    const openPreview = (img) => {
        activeTrigger = img;
        previewImage.src = img.currentSrc || img.src;
        previewImage.alt = img.alt || "M352 Studio evidence";
        caption.textContent = img.alt || "";

        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        closeButton.focus();
    };

    const closePreview = () => {
        if (!lightbox.classList.contains("is-open")) return;

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = previousBodyOverflow;

        previewImage.removeAttribute("src");

        if (activeTrigger) {
            activeTrigger.focus();
            activeTrigger = null;
        }
    };

    page.addEventListener("click", (event) => {
        const img = event.target.closest("main img.m352-evidence-image");
        if (!img) return;

        openPreview(img);
    });

    page.addEventListener("keydown", (event) => {
        const img = event.target.closest("main img.m352-evidence-image");
        if (!img || (event.key !== "Enter" && event.key !== " ")) return;

        event.preventDefault();
        openPreview(img);
    });

    closeButton.addEventListener("click", closePreview);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closePreview();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closePreview();
    });
})();
