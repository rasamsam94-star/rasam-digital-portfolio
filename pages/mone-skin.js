
/* =========================================================
   MONÉ SKIN — CINEMATIC EDITORIAL MOTION
   RASAM DIGITAL PORTFOLIO
   Light Celestial Luxury
========================================================= */

(() => {
  "use strict";

  /* 01. PAGE GUARD
  ========================================================= */

  const page = document.querySelector(".mone-page");

  if (!page) return;

  /* 02. ACCESSIBILITY
  ========================================================= */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* 03. MOTION STYLES
  ========================================================= */

  const style = document.createElement("style");

  style.id = "mone-cinematic-motion";

  style.textContent = `
    .mone-reveal {
      opacity: 0;
      filter: blur(8px);
      transition:
        opacity 1.25s cubic-bezier(.22, 1, .36, 1),
        filter 1.45s cubic-bezier(.22, 1, .36, 1);
      transition-delay: var(--mone-reveal-delay, 0ms);
      will-change: opacity, filter;
    }

    .mone-reveal.is-visible {
      opacity: 1;
      filter: blur(0);
    }

    .mone-screen.mone-reveal {
      transition-duration: 1.5s;
      filter: blur(3px);
    }

    .mone-screen.mone-reveal.is-visible {
      filter: blur(0);
    }

    @media (prefers-reduced-motion: reduce) {
      .mone-reveal,
      .mone-reveal.is-visible {
        opacity: 1 !important;
        filter: none !important;
        transition: none !important;
        will-change: auto !important;
      }
    }
  `;

  document.head.appendChild(style);

  if (prefersReducedMotion) return;

  /* 04. REVEAL TARGETS
  ========================================================= */

  const revealSelectors = [
    ".mone-hero-content > *",
    ".mone-chapter-intro > *",
    ".mone-values-heading > *",
    ".mone-value-card",
    ".mone-design-notes article",
    ".mone-closing-content > *"
  ];

  const textElements = [
    ...new Set(
      revealSelectors.flatMap(selector =>
        Array.from(page.querySelectorAll(selector))
      )
    )
  ];

  /* 05. SCREENSHOT TARGETS
  ========================================================= */

  const screenElements = [
    ...page.querySelectorAll(".mone-screen")
  ];

  /* 06. PREPARE REVEAL ELEMENTS
  ========================================================= */

  const prepareElements = (elements, type = "text") => {
    elements.forEach((element, index) => {
      if (element.classList.contains("mone-reveal")) return;

      element.classList.add("mone-reveal");

      const parent = element.parentElement;

      let delay = 0;

      if (
        parent &&
        (
          parent.matches(".mone-values-grid") ||
          parent.matches(".mone-design-notes")
        )
      ) {
        delay = Math.min(index * 160, 480);
      } else if (type === "text") {
        delay = Math.min(index * 90, 270);
      }

      element.style.setProperty(
        "--mone-reveal-delay",
        `${delay}ms`
      );
    });
  };

  prepareElements(textElements, "text");
  prepareElements(screenElements, "screen");

  /* 07. FALLBACK
  ========================================================= */

  if (!("IntersectionObserver" in window)) {
    page.querySelectorAll(".mone-reveal").forEach(element => {
      element.classList.add("is-visible");
    });

    return;
  }

  /* 08. CINEMATIC SCROLL OBSERVER
  ========================================================= */

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const element = entry.target;

        element.classList.add("is-visible");

        observer.unobserve(element);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  /* 09. INITIALIZE
  ========================================================= */

  page.querySelectorAll(".mone-reveal").forEach(element => {
    observer.observe(element);
  });

})();
