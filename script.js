// ===================================
// RASAM — STARFIELD ANIMATION
// ===================================

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let prefersReducedMotion = motionPreference.matches;
let starAnimationFrame = null;

let stars = [];
let width;
let height;
let leoAnimationProgress = 0;
// RASAM — DYNAMIC COSMIC COLORS
const cosmicPalettes = {
    aries: {
        star: [250, 225, 170],
        line: [198, 166, 107]
    },
    taurus: {
        star: [250, 225, 170],
        line: [198, 166, 107]
    },
    gemini: {
        star: [210, 200, 255],
        line: [190, 180, 245]
    },
    cancer: {
    star: [130, 220, 245],
    line: [75, 190, 220]
    },
    leo: {
    star: [217, 243, 255],
    line: [131, 217, 245]
    },
    virgo: {
    star: [232, 216, 255],
    line: [178, 138, 218]
    },
    libra: {
    star: [250, 225, 170],
    line: [198, 166, 107]
    },
    scorpio: {
    star: [255, 145, 165],
    line: [205, 95, 125]
    },
    sagittarius: {
    star: [255, 195, 125],
    line: [220, 150, 85]
    },
    capricorn: {
    star: [235, 92, 82],
    line: [175, 55, 52]
    },
    aquarius: {
    star: [135, 235, 245],
    line: [80, 190, 215]
    },
    pisces: {
    star: [180, 205, 255],
    line: [135, 155, 225]
    },
    blackhole: {
    star: [105, 150, 125],
    line: [65, 95, 78]
    }
};


let currentPalette = cosmicPalettes.aries;
let targetPalette = cosmicPalettes.aries;
// RASAM — ACTIVE SECTION COLOR DETECTION
const paletteSections = [
    {
        selector: ".hero",
        palette: cosmicPalettes.aries
    },
    {
        selector: ".universe",
        palette: cosmicPalettes.taurus
    },
    {
        selector: ".creator",
        palette: cosmicPalettes.gemini
    },
    {
        selector: ".arsenal",
        palette: cosmicPalettes.cancer
},
{
        selector: ".connection",
        palette: cosmicPalettes.leo
    },
    {
        selector: ".commerce",
        palette: cosmicPalettes.virgo
    },
    {
        selector: ".identity",
        palette: cosmicPalettes.libra
    },
    {
        selector: ".interface",
        palette: cosmicPalettes.scorpio
    },
    {
        selector: ".intelligence",
        palette: cosmicPalettes.sagittarius
    },
    {
        selector: ".support",
        palette: cosmicPalettes.capricorn
    },
    {
        selector: ".recognition",
        palette: cosmicPalettes.aquarius
    },
    {
        selector: ".beyond",
        palette: cosmicPalettes.pisces
    },
    {
        selector: ".black-hole",
        palette: cosmicPalettes.blackhole
    }
];

const paletteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const activeSection = paletteSections.find(section =>
            entry.target.matches(section.selector)
        );

        if (activeSection) {
            targetPalette = activeSection.palette;

            if (prefersReducedMotion) {
                currentPalette = targetPalette;
                drawStarsFrame(false);
            }
        }
    });
}, {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0
});

paletteSections.forEach(section => {
    const element = document.querySelector(section.selector);

    if (element) {
        paletteObserver.observe(element);
    }
});

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    createStars();

    if (prefersReducedMotion) {
        currentPalette = targetPalette;
        drawStarsFrame(false);
    }
}

function createStars() {
    stars = [];

    const totalStars = Math.min(
        420,
        Math.max(100, Math.round((width * height) / 5200))
    );

    for (let i = 0; i < totalStars; i++) {
        const starType = Math.random();
        let type = "calm";
        let radius;
        let speed;
        let opacity;
        let twinkleSpeed;
        let twinkleDepth;
        let glow = 0;

        if (starType > 0.95) {
            type = "bright";
            radius = Math.random() * 1.8 + 1.8;
            speed = Math.random() * 0.16 + 0.1;
            opacity = Math.random() * 0.22 + 0.76;
            twinkleSpeed = Math.random() * 0.025 + 0.02;
            twinkleDepth = Math.random() * 0.22 + 0.28;
            glow = Math.random() * 0.35 + 0.65;
        } else if (starType > 0.68) {
            type = "active";
            radius = Math.random() * 0.85 + 0.8;
            speed = Math.random() * 0.17 + 0.08;
            opacity = Math.random() * 0.32 + 0.58;
            twinkleSpeed = Math.random() * 0.02 + 0.012;
            twinkleDepth = Math.random() * 0.16 + 0.18;
        } else {
            radius = Math.random() * 0.45 + 0.15;
            speed = Math.random() * 0.1 + 0.03;
            opacity = Math.random() * 0.32 + 0.18;
            twinkleSpeed = Math.random() * 0.01 + 0.003;
            twinkleDepth = Math.random() * 0.08 + 0.04;
        }

        stars.push({
            type,
            x: Math.random() * width,
            y: Math.random() * height,
            radius,
            speed,
            opacity,
            twinkleSpeed,
            twinkleDepth,
            glow,
            linkSeed: Math.random(),
            twinklePhase: Math.random() * Math.PI * 2
        });
    }
}
// ===================================
// CONSTELLATION CONNECTIONS
// ===================================

function drawConstellationsLegacy() {

    const maxDistance = 120;
    const leoLineIntensity = leoAnimationProgress;

    for (let i = 0; i < stars.length; i++) {

        for (let j = i + 1; j < stars.length; j++) {

            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {

                const opacity = 1 - distance / maxDistance;

                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);

            ctx.strokeStyle = `rgba(${currentPalette.line.join(", ")}, ${opacity * 0.20})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
      
   
}   
            }
        }
    }

function drawConstellations() {
    const cellSize = 160;
    const cells = new Map();
    const connections = new Uint8Array(stars.length);

    stars.forEach((star, index) => {
        const column = Math.floor(star.x / cellSize);
        const row = Math.floor(star.y / cellSize);
        const key = `${column}:${row}`;
        const cell = cells.get(key) || [];

        cell.push(index);
        cells.set(key, cell);
    });

    stars.forEach((star, index) => {
        const column = Math.floor(star.x / cellSize);
        const row = Math.floor(star.y / cellSize);

        for (let x = column - 1; x <= column + 1; x++) {
            for (let y = row - 1; y <= row + 1; y++) {
                const neighbours = cells.get(`${x}:${y}`) || [];

                neighbours.forEach((neighbourIndex) => {
                    if (neighbourIndex <= index) return;
                    if (connections[index] >= 3 || connections[neighbourIndex] >= 3) {
                        return;
                    }

                    const neighbour = stars[neighbourIndex];
                    const hasProminentStar =
                        star.type !== "calm" || neighbour.type !== "calm";

                    if (!hasProminentStar && star.linkSeed + neighbour.linkSeed < 1.18) {
                        return;
                    }

                    const dx = star.x - neighbour.x;
                    const dy = star.y - neighbour.y;
                    const distance = Math.hypot(dx, dy);
                    const maxDistance =
                        star.type === "bright" || neighbour.type === "bright" ? 138 :
                        star.type === "active" || neighbour.type === "active" ? 112 : 84;

                    if (distance >= maxDistance) return;

                    const proximity = Math.pow(1 - distance / maxDistance, 0.72);
                    const lineStrength =
                        star.type === "bright" || neighbour.type === "bright" ? 0.24 :
                        star.type === "active" || neighbour.type === "active" ? 0.15 : 0.075;

                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(neighbour.x, neighbour.y);
                    ctx.strokeStyle = `rgba(${currentPalette.line.join(", ")}, ${proximity * lineStrength})`;
                    ctx.lineWidth = star.type === "bright" || neighbour.type === "bright" ? 0.65 : 0.4;
                    ctx.stroke();
                    connections[index]++;
                    connections[neighbourIndex]++;
                });
            }
        }
    });
}

function updateCosmicPalette() {
    const blend = 0.025;

    currentPalette = {
        star: currentPalette.star.map((color, index) =>
            color + (targetPalette.star[index] - color) * blend
        ),
        line: currentPalette.line.map((color, index) =>
            color + (targetPalette.line[index] - color) * blend
        )
    };
}

function drawStarsFrame(animate = true) {
    ctx.clearRect(0, 0, width, height);

    if (animate) {
        updateCosmicPalette();
    } else {
        currentPalette = targetPalette;
    }
    drawConstellations();
    stars.forEach(star => {
        if (animate) {
            star.twinklePhase += star.twinkleSpeed;
        }

    const leoTwinkleBoost =
    star.type === "bright" ? 0.25 :
    star.type === "active" ? 0.12 :
    0.03;

const twinkle = animate
    ? 1 + Math.sin(star.twinklePhase) * (star.twinkleDepth + leoAnimationProgress * leoTwinkleBoost)
    : 1;
    const leoGlowBoost =
    star.type === "bright" ? 0.35 :
    star.type === "active" ? 0.18 :
    0.05;

const currentOpacity = Math.min(
    1,
    Math.max(0, star.opacity * twinkle) +
    leoAnimationProgress * leoGlowBoost
);
const leoSpeedBoost =
    star.type === "bright" ? 1.2 :
    star.type === "active" ? 0.8 :
    0.1;

if (animate) {
            star.y -= star.speed * (1 + leoAnimationProgress * leoSpeedBoost);

            if (star.y < 0) {
                star.y = height;
                star.x = Math.random() * width;
            }
        }
if (star.glow) {
    const glowRadius = star.radius * (animate ? 4 + Math.sin(star.twinklePhase) * 0.5 : 4);
    const glow = ctx.createRadialGradient(
        star.x,
        star.y,
        0,
        star.x,
        star.y,
        glowRadius
    );

    glow.addColorStop(
        0,
        `rgba(${currentPalette.star.join(", ")}, ${currentOpacity * star.glow * 0.28})`
    );
    glow.addColorStop(
        0.4,
        `rgba(${currentPalette.star.join(", ")}, ${currentOpacity * star.glow * 0.1})`
    );
    glow.addColorStop(1, `rgba(${currentPalette.star.join(", ")}, 0)`);

    ctx.beginPath();
    ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
}

ctx.beginPath();
ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
ctx.fillStyle = `rgba(${currentPalette.star.join(", ")}, ${currentOpacity})`;
ctx.fill();
});

    if (animate && !prefersReducedMotion) {
        starAnimationFrame = requestAnimationFrame(() => drawStarsFrame(true));
    } else {
        starAnimationFrame = null;
    }
}

function startStarfield() {
    if (starAnimationFrame !== null) return;
    drawStarsFrame(true);
}

function stopStarfield() {
    if (starAnimationFrame !== null) {
        cancelAnimationFrame(starAnimationFrame);
        starAnimationFrame = null;
    }
    currentPalette = targetPalette;
    drawStarsFrame(false);
}

motionPreference.addEventListener("change", (event) => {
    prefersReducedMotion = event.matches;

    if (prefersReducedMotion) {
        stopStarfield();
    } else {
        startStarfield();
    }
});

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

if (prefersReducedMotion) {
    drawStarsFrame(false);
} else {
    startStarfield();
}
// ===================================
// RASAM — INTRO SEQUENCE
// ===================================

const introScreen = document.getElementById("introScreen");
const skipIntro = document.getElementById("skipIntro");
const heroSection = document.querySelector(".hero");

function finishIntro() {
    introScreen.classList.add("intro-finished");
    heroSection.classList.add("hero-revealed");
}

let introTimer = null;

if (prefersReducedMotion) {
    finishIntro();
} else {
    introTimer = setTimeout(finishIntro, 4000);
}

skipIntro.addEventListener("click", () => {
    if (introTimer !== null) clearTimeout(introTimer);
    finishIntro();
});

/* =====================================
   RASAM — COSMIC NAVIGATION
===================================== */

const openUniverse = document.getElementById("openUniverse");
const closeUniverse = document.getElementById("closeUniverse");
const universePanel = document.getElementById("universePanel");

const universeLinks = document.querySelectorAll(".universe-item");

function showUniverse() {
  universePanel.classList.add("is-open");
  universePanel.setAttribute("aria-hidden", "false");
  openUniverse.setAttribute("aria-expanded", "true");

  document.body.style.overflow = "hidden";
}

function hideUniverse() {
  universePanel.classList.remove("is-open");
  universePanel.setAttribute("aria-hidden", "true");
  openUniverse.setAttribute("aria-expanded", "false");

  document.body.style.overflow = "";
}

openUniverse.addEventListener("click", showUniverse);

closeUniverse.addEventListener("click", hideUniverse);

// Close panel after selecting a destination
universeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));

    hideUniverse();

    if (target) {
      history.pushState(null, "", link.getAttribute("href"));

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    }
  });
});

// Close when clicking outside the panel content
universePanel.addEventListener("click", (event) => {
  if (event.target === universePanel) {
    hideUniverse();
  }
});

// Close with Escape key
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    universePanel.classList.contains("is-open")
  ) {
    hideUniverse();
  }
});

// =================================
// ARIES → TAURUS SCROLL TRANSITION
// =================================

const taurusSection = document.querySelector(".universe");
const geminiSection = document.querySelector(".creator");
const cancerSection = document.querySelector(".arsenal");
const leoSection = document.querySelector(".connection");
const virgoSection = document.querySelector(".commerce");
const libraSection = document.querySelector(".identity");
const scorpioSection = document.querySelector(".interface");
const sagittariusSection = document.querySelector(".intelligence");
const capricornSection = document.querySelector(".support");
const aquariusSection = document.querySelector(".recognition");
const piscesSection = document.querySelector(".beyond");
const blackholeSection = document.querySelector(".black-hole");
function updateGalaxyTransition() {
    if (!taurusSection || !geminiSection || !cancerSection || !leoSection || !virgoSection || !libraSection || !scorpioSection || !sagittariusSection || !capricornSection || !aquariusSection || !piscesSection || !blackholeSection) 
        return;
    const start = window.innerHeight * 0.85;
    const end = window.innerHeight * 0.30;

    // Aries → Taurus
    const taurusRect = taurusSection.getBoundingClientRect();

    let taurusProgress = (start - taurusRect.top) / (start - end);
    taurusProgress = Math.max(0, Math.min(1, taurusProgress));
    taurusProgress = taurusProgress * taurusProgress *
        (3 - 2 * taurusProgress);

    // Taurus → Gemini
    const geminiRect = geminiSection.getBoundingClientRect();

    let geminiProgress = (start - geminiRect.top) / (start - end);
    geminiProgress = Math.max(0, Math.min(1, geminiProgress));
    geminiProgress = geminiProgress * geminiProgress *
        (3 - 2 * geminiProgress);
// Gemini → Cancer
const cancerRect = cancerSection.getBoundingClientRect();

let cancerProgress = (start - cancerRect.top) / (start - end);
cancerProgress = Math.max(0, Math.min(1, cancerProgress));
cancerProgress = cancerProgress * cancerProgress *
    (3 - 2 * cancerProgress);
    document.documentElement.style.setProperty(
        "--section-transition",
        taurusProgress.toFixed(3)
    );
// Cancer → Leo
const leoRect = leoSection.getBoundingClientRect();

let leoProgress = (start - leoRect.top) / (start - end);
leoProgress = Math.max(0, Math.min(1, leoProgress));
leoProgress = leoProgress * leoProgress *
    (3 - 2 * leoProgress);
    leoAnimationProgress = leoProgress;

    document.documentElement.style.setProperty(
        "--gemini-transition",
        geminiProgress.toFixed(3)
    );
  document.documentElement.style.setProperty(
    "--cancer-transition",
    cancerProgress.toFixed(3)
);  
document.documentElement.style.setProperty(
    "--leo-transition",
    leoProgress.toFixed(3)
);
// Leo → Virgo
const virgoRect = virgoSection.getBoundingClientRect();

let virgoProgress = (start - virgoRect.top) / (start - end);
virgoProgress = Math.max(0, Math.min(1, virgoProgress));
virgoProgress = virgoProgress * virgoProgress *
    (3 - 2 * virgoProgress);

document.documentElement.style.setProperty(
    "--virgo-transition",
    virgoProgress.toFixed(3)
);
// Virgo → Libra
const libraRect = libraSection.getBoundingClientRect();

let libraProgress = (start - libraRect.top) / (start - end);
libraProgress = Math.max(0, Math.min(1, libraProgress));
libraProgress = libraProgress * libraProgress *
    (3 - 2 * libraProgress);

document.documentElement.style.setProperty(
    "--libra-transition",
    libraProgress.toFixed(3)
);
// Libra → Scorpio
const scorpioRect = scorpioSection.getBoundingClientRect();

let scorpioProgress = (start - scorpioRect.top) / (start - end);
scorpioProgress = Math.max(0, Math.min(1, scorpioProgress));
scorpioProgress = scorpioProgress * scorpioProgress *
    (3 - 2 * scorpioProgress);

document.documentElement.style.setProperty(
    "--scorpio-transition",
    scorpioProgress.toFixed(3)
);
// Scorpio → Sagittarius
const sagittariusRect = sagittariusSection.getBoundingClientRect();

let sagittariusProgress = (start - sagittariusRect.top) / (start - end);
sagittariusProgress = Math.max(0, Math.min(1, sagittariusProgress));
sagittariusProgress = sagittariusProgress * sagittariusProgress *
    (3 - 2 * sagittariusProgress);

document.documentElement.style.setProperty(
    "--sagittarius-transition",
    sagittariusProgress.toFixed(3)
);
// Sagittarius → Capricorn
const capricornRect = capricornSection.getBoundingClientRect();

let capricornProgress = (start - capricornRect.top) / (start - end);
capricornProgress = Math.max(0, Math.min(1, capricornProgress));
capricornProgress = capricornProgress * capricornProgress *
    (3 - 2 * capricornProgress);

document.documentElement.style.setProperty(
    "--capricorn-transition",
    capricornProgress.toFixed(3)
);
// Capricorn → Aquarius
const aquariusRect = aquariusSection.getBoundingClientRect();

let aquariusProgress = (start - aquariusRect.top) / (start - end);
aquariusProgress = Math.max(0, Math.min(1, aquariusProgress));
aquariusProgress = aquariusProgress * aquariusProgress *
    (3 - 2 * aquariusProgress);

document.documentElement.style.setProperty(
    "--aquarius-transition",
    aquariusProgress.toFixed(3)
);
// Aquarius → Pisces
const piscesRect = piscesSection.getBoundingClientRect();

let piscesProgress = (start - piscesRect.top) / (start - end);
piscesProgress = Math.max(0, Math.min(1, piscesProgress));
piscesProgress = piscesProgress * piscesProgress *
    (3 - 2 * piscesProgress);

document.documentElement.style.setProperty(
    "--pisces-transition",
    piscesProgress.toFixed(3)
);
// Pisces → Black Hole
const blackholeRect = blackholeSection.getBoundingClientRect();

let blackholeProgress = (start - blackholeRect.top) / (start - end);
blackholeProgress = Math.max(0, Math.min(1, blackholeProgress));
blackholeProgress = blackholeProgress * blackholeProgress *
    (3 - 2 * blackholeProgress);

document.documentElement.style.setProperty(
    "--blackhole-transition",
    blackholeProgress.toFixed(3)
);

}
let transitionFrame = null;

function requestGalaxyTransition() {
    if (transitionFrame) return;

    transitionFrame = requestAnimationFrame(() => {
        updateGalaxyTransition();
        transitionFrame = null;
    });

}

window.addEventListener("scroll", requestGalaxyTransition, {
    passive: true
});

window.addEventListener("resize", requestGalaxyTransition);

updateGalaxyTransition();


/* =========================================
   CANCER — THE ARSENAL
   Interactive Capability Explorer
========================================= */

(() => {
  const explorer = document.querySelector("[data-arsenal-explorer]");
  if (!explorer) return;

  const tabs = Array.from(explorer.querySelectorAll(".arsenal-domain"));
  const panel = explorer.querySelector("#arsenal-detail");
  const panelBody = explorer.querySelector("#arsenal-detail-body");
  const category = explorer.querySelector("#arsenal-category");
  const number = explorer.querySelector("#arsenal-number");
  const overline = explorer.querySelector("#arsenal-overline");
  const title = explorer.querySelector("#arsenal-detail-title");
  const description = explorer.querySelector("#arsenal-description");
  const tools = explorer.querySelector("#arsenal-tools");
  const practice = explorer.querySelector("#arsenal-practice");
  const relatedLink = explorer.querySelector("#arsenal-related-link");
  const footerLabel = explorer.querySelector("#arsenal-footer-label");

  const capabilities = {
    email: {
      category: "CORE CAPABILITY",
      overline: "BUILDING CONNECTIONS",
      title: "Email Marketing",
      description: "Creating and managing email experiences that help brands communicate clearly with their audiences — from signup forms and campaign content to subscriber management, scheduled campaigns, and automated flows.",
      tools: ["MailerLite", "Klaviyo", "Email Campaigns", "Signup Forms"],
      practice: [
        "Campaign planning and scheduling",
        "Signup forms and subscriber management",
        "Welcome flows and email automation"
      ],
      link: "#connection",
      linkLabel: "EXPLORE EMAIL WORK"
    },
    commerce: {
      category: "STORE OPERATIONS",
      overline: "TURNING IDEAS INTO STOREFRONTS",
      title: "eCommerce & Shopify",
      description: "Building and managing a digital storefront — organizing products, shaping product presentation, refining storefront content, and supporting the customer journey.",
      tools: ["Shopify", "Product Setup", "Storefront Management"],
      practice: [
        "Digital product setup and presentation",
        "Storefront structure and content",
        "Localization and customer experience"
      ],
      link: "#commerce",
      linkLabel: "EXPLORE M352 STUDIO"
    },
    visual: {
      category: "CREATIVE PRACTICE",
      overline: "SHAPING VISUAL COMMUNICATION",
      title: "Visual Design",
      description: "Creating clear and consistent visual materials for digital products, storefronts, brand concepts, and portfolio presentations.",
      tools: ["Canva", "Adobe Express", "Visual Mockups"],
      practice: [
        "Brand and visual direction exploration",
        "Digital product and storefront visuals",
        "Email and portfolio presentation"
      ],
      link: "#identity",
      linkLabel: "EXPLORE VISUAL DESIGN"
    },
    web: {
      category: "DEVELOPMENT IN PRACTICE",
      overline: "BUILDING THROUGH CODE",
      title: "Web Development",
      description: "Learning and applying front-end fundamentals by building RASAM Universe — using code to shape layouts, interactions, responsive behavior, and visual experiences.",
      tools: ["HTML", "CSS", "JavaScript"],
      practice: [
        "Semantic page structure and styling",
        "Responsive layouts and interactions",
        "Motion, transitions, and interface refinement"
      ],
      link: "#interface",
      linkLabel: "EXPLORE WEB DESIGN"
    },
    research: {
      category: "RESEARCH & STRATEGY",
      overline: "TURNING INFORMATION INTO INSIGHT",
      title: "Research & Strategy",
      description: "Gathering relevant information, reviewing competitors, connecting findings, and organizing insights into clear, actionable direction for projects and decisions.",
      tools: ["Market Research", "Competitor Analysis", "Research Documentation"],
      practice: [
        "Information gathering and source review",
        "Market and competitor analysis",
        "Insight synthesis and strategic direction"
      ],
      link: "#intelligence",
      linkLabel: "EXPLORE THE INTELLIGENCE"
    },
    support: {
      category: "OPERATIONAL SUPPORT",
      overline: "MAKING SPACE FOR BETTER WORK",
      title: "Administrative Support",
      description: "Supporting daily operations through organized workflows, reliable administration, and thoughtful coordination — helping keep information, tasks, and communication moving.",
      tools: ["Google Workspace", "Microsoft Office", "Trello"],
      practice: [
        "Files and documentation organization",
        "Scheduling and communication coordination",
        "Task management and daily operations"
      ],
      link: "#support",
      linkLabel: "EXPLORE THE SUPPORT SYSTEM"
    }
  };

  function selectCapability(tab, moveFocus = false) {
    const item = capabilities[tab.dataset.domain];
    if (!item) return;

    tabs.forEach((button) => {
      const selected = button === tab;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });

    panel.setAttribute("aria-labelledby", tab.id);

    const updatePanel = () => {
      category.textContent = item.category;
      number.textContent = `${String(tabs.indexOf(tab) + 1).padStart(2, "0")} / ${String(tabs.length).padStart(2, "0")}`;
      overline.textContent = item.overline;
      title.textContent = item.title;
      description.textContent = item.description;
      footerLabel.textContent = item.title.toUpperCase();
      relatedLink.href = item.link;
      relatedLink.innerHTML = `${item.linkLabel} <span aria-hidden="true">↗</span>`;

      tools.replaceChildren(...item.tools.map((label) => {
        const tag = document.createElement("span");
        tag.textContent = label;
        return tag;
      }));

      practice.replaceChildren(...item.practice.map((label) => {
        const li = document.createElement("li");
        li.textContent = label;
        return li;
      }));

      panelBody.classList.remove("is-changing");

      if (!prefersReducedMotion) {
        panelBody.style.animation = "none";
        void panelBody.offsetWidth;
        panelBody.style.animation = "";
      }
      if (moveFocus) panel.focus();
    };

    if (prefersReducedMotion) {
      updatePanel();
    } else {
      panelBody.classList.add("is-changing");
      window.setTimeout(updatePanel, 140);
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectCapability(tab));

    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;

      event.preventDefault();
      tabs[nextIndex].focus();
      selectCapability(tabs[nextIndex]);
    });
  });
})();
