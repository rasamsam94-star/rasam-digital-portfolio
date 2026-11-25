
/* ==========================================================
   RASAM DIGITAL PORTFOLIO
   KLAVIYO EMAIL DESIGN

   CREATIVE DIRECTION:
   IMMERSIVE CINEMATIC CREATIVE STUDIO

   JavaScript only.
   Original HTML and CSS remain untouched.
========================================================== */

(() => {
  "use strict";

  const PAGE = document.querySelector("body.klaviyo-page");

  if (!PAGE || PAGE.dataset.rasamExperience === "active") return;

  PAGE.dataset.rasamExperience = "active";

  const REDUCED_MOTION = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const SELECTORS = {
    intro: ".email-intro",
    campaign: ".email-case-study",
    header: ".case-study-header",
    information: ".project-information",
    strategy: ".campaign-strategy",
    direction: ".design-direction",
    gallery: ".preview-gallery",
    preview: ".email-preview",
    conclusion: ".case-study-conclusion",
    closing: ".email-closing"
  };

  /* ========================================================
     01. CINEMATIC MOTION SYSTEM
  ======================================================== */

  function injectMotionStyles() {
    const style = document.createElement("style");
    style.id = "rasam-cinematic-motion";

    style.textContent = `
      .rasam-reveal {
        opacity: 0;
        transform: translate3d(0, 34px, 0);
        transition:
          opacity 1.05s cubic-bezier(.2,.7,.2,1),
          transform 1.15s cubic-bezier(.2,.7,.2,1);
        will-change: opacity, transform;
      }

      .rasam-reveal.rasam-visible {
        opacity: 1;
        transform: translate3d(0,0,0);
      }

      .rasam-reveal-left {
        opacity: 0;
        transform: translate3d(-38px,0,0);
        transition:
          opacity 1s cubic-bezier(.2,.7,.2,1),
          transform 1.15s cubic-bezier(.2,.7,.2,1);
      }

      .rasam-reveal-left.rasam-visible {
        opacity: 1;
        transform: translate3d(0,0,0);
      }

      .rasam-title-reveal {
        overflow: hidden;
      }

      .rasam-title-reveal > span {
        display: inline-block;
        opacity: 0;
        transform: translate3d(0,105%,0);
        transition:
          opacity 1s ease,
          transform 1.2s cubic-bezier(.16,1,.3,1);
      }

      .rasam-title-reveal.rasam-visible > span {
        opacity: 1;
        transform: translate3d(0,0,0);
      }

      .email-preview {
        overflow: hidden;
      }

      .email-preview img {
        transition:
          clip-path 1.35s cubic-bezier(.2,.7,.2,1),
          filter .8s ease,
          transform 1s cubic-bezier(.2,.7,.2,1);
        clip-path: inset(0 0 100% 0);
      }

      .email-preview.rasam-visible img {
        clip-path: inset(0 0 0 0);
      }

      .email-preview.rasam-viewing img {
        filter: brightness(.92);
      }

      .rasam-viewer {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 34px;
        background: rgba(5, 5, 6, .97);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity .55s ease,
          visibility .55s ease;
      }

      .rasam-viewer.is-open {
        opacity: 1;
        visibility: visible;
      }

      .rasam-viewer-image {
        display: block;
        max-width: min(100%, 1250px);
        max-height: 88vh;
        width: auto;
        height: auto;
        object-fit: contain;
        opacity: 0;
        transform: scale(.96);
        transition:
          opacity .65s ease,
          transform .8s cubic-bezier(.16,1,.3,1);
      }

      .rasam-viewer.is-open .rasam-viewer-image {
        opacity: 1;
        transform: scale(1);
      }

      .rasam-viewer-close {
        position: absolute;
        top: 26px;
        right: 32px;
        border: 0;
        background: transparent;
        color: #fff;
        font-size: 30px;
        font-weight: 200;
        cursor: pointer;
        opacity: .75;
      }

      .rasam-viewer-close:hover {
        opacity: 1;
      }

      .rasam-viewer-caption {
        position: absolute;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255,255,255,.7);
        font-size: 10px;
        letter-spacing: .18em;
        text-align: center;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .rasam-cinematic-progress {
        position: fixed;
        z-index: 99998;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        pointer-events: none;
        background: rgba(255,255,255,.08);
      }

      .rasam-cinematic-progress span {
        display: block;
        width: 0;
        height: 100%;
        background: rgba(212,168,90,.9);
      }

      @media (max-width: 700px) {
        .rasam-viewer {
          padding: 14px;
        }

        .rasam-viewer-close {
          top: 14px;
          right: 18px;
        }

        .rasam-viewer-caption {
          bottom: 16px;
          max-width: 90%;
          white-space: normal;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .rasam-reveal,
        .rasam-reveal-left,
        .rasam-title-reveal > span,
        .email-preview img,
        .rasam-viewer,
        .rasam-viewer-image {
          opacity: 1 !important;
          transform: none !important;
          clip-path: none !important;
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ========================================================
     02. OPENING SEQUENCE
  ======================================================== */

  function playOpening() {
    const intro = document.querySelector(SELECTORS.intro);
    if (!intro) return;

    if (REDUCED_MOTION) {
      intro.classList.add("rasam-visible");
      return;
    }

    const eyebrow = intro.querySelector(".eyebrow");
    const title = intro.querySelector("h1");
    const description = intro.querySelector(".intro-description");
    const meta = intro.querySelector(".intro-meta");

    const elements = [
      { element: eyebrow, delay: 150 },
      { element: title, delay: 420 },
      { element: description, delay: 850 },
      { element: meta, delay: 1150 }
    ];

    elements.forEach(({ element, delay }) => {
      if (!element) return;

      element.animate(
        [
          {
            opacity: 0,
            transform: "translateY(28px)"
          },
          {
            opacity: 1,
            transform: "translateY(0)"
          }
        ],
        {
          duration: 1100,
          delay,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both"
        }
      );
    });
  }

  /* ========================================================
     03. CINEMATIC TITLE REVEAL
  ======================================================== */

  function prepareTitles() {
    const titles = document.querySelectorAll(
      `${SELECTORS.campaign} h2, ${SELECTORS.closing} h2`
    );

    titles.forEach(title => {
      if (title.dataset.rasamPrepared) return;

      title.dataset.rasamPrepared = "true";
      title.classList.add("rasam-title-reveal");

      const originalHTML = title.innerHTML;

      // Preserve the original line breaks and text structure.
      const parts = originalHTML.split(/<br\s*\/?>/i);

      title.innerHTML = parts.map((part, index) => {
        return `<span style="transition-delay:${index * 120}ms">${part}</span>`;
      }).join("<br>");
    });
  }

  /* ========================================================
     04. SCROLL STORYTELLING
  ======================================================== */

  function prepareReveals() {
    const revealSelectors = [
      SELECTORS.header,
      SELECTORS.information,
      SELECTORS.strategy,
      SELECTORS.direction,
      SELECTORS.gallery,
      SELECTORS.conclusion
    ];

    const elements = document.querySelectorAll(
      revealSelectors.join(",")
    );

    elements.forEach((element, index) => {
      if (element.closest(SELECTORS.intro)) return;
      if (element.dataset.rasamPrepared) return;

      element.dataset.rasamPrepared = "true";

      if (
        element.matches(SELECTORS.information) ||
        element.matches(SELECTORS.conclusion)
      ) {
        element.classList.add("rasam-reveal-left");
      } else {
        element.classList.add("rasam-reveal");
      }

      // Slight stagger without creating repetitive movement.
      element.style.transitionDelay =
        `${Math.min(index % 3, 2) * 100}ms`;
    });

    document.querySelectorAll(
      `${SELECTORS.campaign} h2, ${SELECTORS.closing} h2`
    ).forEach(title => {
      title.classList.add("rasam-reveal");
    });
  }

  function initializeScrollObserver() {
    const observed = document.querySelectorAll(
      ".rasam-reveal, .rasam-reveal-left, .rasam-title-reveal, .email-preview"
    );

    if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
      observed.forEach(element => {
        element.classList.add("rasam-visible");
      });
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("rasam-visible");
        currentObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -55px 0px"
    });

    observed.forEach(element => observer.observe(element));
  }

  /* ========================================================
     05. IMAGE REVEAL TIMING
  ======================================================== */

  function prepareImageSequence() {
    document.querySelectorAll(SELECTORS.gallery).forEach(gallery => {
      const previews = gallery.querySelectorAll(SELECTORS.preview);

      previews.forEach((preview, index) => {
        preview.style.transitionDelay = `${index * 130}ms`;
      });
    });
  }

  /* ========================================================
     06. IMMERSIVE IMAGE VIEWER
  ======================================================== */

  const viewerState = {
    viewer: null,
    image: null,
    caption: null,
    activeImages: [],
    index: 0,
    previousOverflow: ""
  };

  function createViewer() {
    const viewer = document.createElement("div");
    viewer.className = "rasam-viewer";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "Campaign image preview");
    viewer.setAttribute("aria-hidden", "true");

    const close = document.createElement("button");
    close.className = "rasam-viewer-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close image preview");
    close.textContent = "×";

    const image = document.createElement("img");
    image.className = "rasam-viewer-image";
    image.alt = "";

    const caption = document.createElement("div");
    caption.className = "rasam-viewer-caption";

    viewer.append(close, image, caption);
    document.body.appendChild(viewer);

    viewerState.viewer = viewer;
    viewerState.image = image;
    viewerState.caption = caption;

    close.addEventListener("click", closeViewer);

    viewer.addEventListener("click", event => {
      if (event.target === viewer) closeViewer();
    });

    document.addEventListener("keydown", handleViewerKeyboard);
  }

  function prepareImageViewer() {
    createViewer();

    document.querySelectorAll(SELECTORS.preview).forEach(preview => {
      const image = preview.querySelector("img");
      if (!image) return;

      image.addEventListener("click", () => {
        openViewer(preview);
      });
    });
  }

  function openViewer(preview) {
    const gallery = preview.closest(SELECTORS.gallery);
    if (!gallery) return;

    const previews = [...gallery.querySelectorAll(SELECTORS.preview)];

    viewerState.activeImages = previews.map(item => {
      const image = item.querySelector("img");
      const caption = item.querySelector("figcaption");

      return {
        src: image?.currentSrc || image?.src || "",
        alt: image?.alt || "",
        caption: caption?.textContent?.trim() || ""
      };
    }).filter(item => item.src);

    viewerState.index = previews.indexOf(preview);

    if (viewerState.index < 0) viewerState.index = 0;

    viewerState.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    renderViewerImage();

    viewerState.viewer.classList.add("is-open");
    viewerState.viewer.setAttribute("aria-hidden", "false");

    viewerState.viewer.querySelector(".rasam-viewer-close").focus();
    preview.classList.add("rasam-viewing");
  }

  function renderViewerImage() {
    const item = viewerState.activeImages[viewerState.index];
    if (!item) return;

    viewerState.image.style.opacity = "0";

    window.setTimeout(() => {
      viewerState.image.src = item.src;
      viewerState.image.alt = item.alt;
      viewerState.caption.textContent = item.caption;

      viewerState.image.style.opacity = "";
    }, REDUCED_MOTION ? 0 : 160);
  }

  function moveViewer(direction) {
    const images = viewerState.activeImages;
    if (!images.length) return;

    viewerState.index =
      (viewerState.index + direction + images.length) % images.length;

    renderViewerImage();
  }

  function closeViewer() {
    const viewer = viewerState.viewer;
    if (!viewer) return;

    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");

    document.body.style.overflow = viewerState.previousOverflow;

    viewerState.image.removeAttribute("src");

    document.querySelectorAll(".rasam-viewing").forEach(element => {
      element.classList.remove("rasam-viewing");
    });
  }

  function handleViewerKeyboard(event) {
    if (!viewerState.viewer?.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeViewer();
    }

    if (event.key === "ArrowRight") {
      moveViewer(1);
    }

    if (event.key === "ArrowLeft") {
      moveViewer(-1);
    }
  }

  /* ========================================================
     07. CINEMATIC READING PROGRESS
  ======================================================== */

  function createProgressLine() {
    const progress = document.createElement("div");
    progress.className = "rasam-cinematic-progress";

    const fill = document.createElement("span");
    progress.appendChild(fill);

    document.body.appendChild(progress);

    let scheduled = false;

    function update() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const percentage = maxScroll > 0
        ? (window.scrollY / maxScroll) * 100
        : 0;

      fill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
      scheduled = false;
    }

    window.addEventListener("scroll", () => {
      if (scheduled) return;

      scheduled = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ========================================================
     08. SUBTLE CAMPAIGN DEPTH
  ======================================================== */

  function initializeDepth() {
    if (REDUCED_MOTION) return;

    const sections = document.querySelectorAll(SELECTORS.campaign);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const heading = entry.target.querySelector(".case-study-header");

        if (!heading) return;

        if (entry.isIntersecting) {
          heading.classList.add("rasam-visible");
        } else {
          heading.classList.remove("rasam-visible");
        }
      });
    }, {
      threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));
  }

  /* ========================================================
     09. START EXPERIENCE
  ======================================================== */

  function init() {
    injectMotionStyles();

    prepareTitles();
    prepareReveals();
    prepareImageSequence();

    prepareImageViewer();

    createProgressLine();

    initializeScrollObserver();
    initializeDepth();

    playOpening();

    console.info(
      "RASAM | Immersive Cinematic Creative Studio Experience ready."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
