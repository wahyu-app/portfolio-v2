/**
 * Update the Work section here.
 * - Add, remove, or reorder objects to update the project cards.
 * - Leave `url` empty to keep the project link as a placeholder.
 * - Use a four-digit number for `year` so the summary stays automatic.
 */
const WORK_PROJECTS = Object.freeze([
  {
    title: "Indramayu City Website",
    description: "A responsive civic information website for Indramayu, West Java.",
    technologies: ["HTML", "CSS"],
    image: "assets/projects-1.png",
    imageAlt: "Preview of the Indramayu City Website",
    imageWidth: 1872,
    imageHeight: 1053,
    url: "",
    year: 2024,
  },
  {
    title: "Dicoding Landing Page",
    description: "A responsive course landing page built with semantic HTML and CSS.",
    technologies: ["HTML", "CSS"],
    image: "assets/projects-2.png",
    imageAlt: "Preview of the Dicoding Landing Page",
    imageWidth: 1904,
    imageHeight: 1071,
    url: "",
    year: 2024,
  },
  {
    title: "CodePolitan Landing Page",
    description: "An education landing page implemented with JavaScript and Bootstrap 4.",
    technologies: ["JS", "BOOTSTRAP"],
    image: "assets/projects-3.png",
    imageAlt: "Preview of the CodePolitan Landing Page",
    imageWidth: 1888,
    imageHeight: 1062,
    url: "",
    year: 2025,
  },
  {
    title: "Museum of Art",
    description: "A responsive museum website built with jQuery and Bootstrap.",
    technologies: ["JQUERY", "BOOTSTRAP"],
    image: "assets/projects-4.png",
    imageAlt: "Preview of the Museum of Art website",
    imageWidth: 1888,
    imageHeight: 1062,
    url: "",
    year: 2025,
  },
]);

/**
 * Replace the empty strings below with real destinations.
 * Examples:
 * email: "mailto:hello@example.com"
 * whatsapp: "https://wa.me/6281234567890"
 */
const SITE_LINKS = Object.freeze({
  email: "",
  whatsapp: "",
  github: "",
  linkedin: "",
});

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuLinks = [...mobileMenu.querySelectorAll("a")];
const navLinks = [...document.querySelectorAll(".desktop-nav a, .mobile-menu a")];
const trackedSections = [...document.querySelectorAll("main section[id]")];
const heroVisual = document.querySelector(".hero-visual");
const scrollProgress = document.querySelector(".scroll-progress span");
const linkNotice = document.querySelector(".link-notice");
const projectsGrid = document.querySelector("[data-projects]");
const projectSummary = document.querySelector("[data-project-summary]");
const projectCardTemplate = document.querySelector("#project-card-template");
const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");
const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let noticeTimer;
let scrollFrame;

function applyTheme(theme, persist = true) {
  const nextTheme = theme === "light" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme === "dark" ? "light" : "dark"} theme`);
  themeColor.setAttribute("content", themeColor.dataset[`${nextTheme}Color`]);

  if (persist) {
    localStorage.setItem("wahyu-theme", nextTheme);
  }
}

function closeMenu({ returnFocus = false } = {}) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  mobileMenu.hidden = true;
  document.body.classList.remove("menu-open");

  if (returnFocus) {
    menuToggle.focus();
  }
}

function openMenu() {
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
  mobileMenu.hidden = false;
  document.body.classList.add("menu-open");
  mobileMenuLinks[0]?.focus();
}

function showPlaceholderNotice() {
  clearTimeout(noticeTimer);
  linkNotice.hidden = false;
  noticeTimer = window.setTimeout(() => {
    linkNotice.hidden = true;
  }, 2600);
}

function configureLink(link, destination, placeholderTitle) {
  if (!destination) {
    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("title", placeholderTitle);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showPlaceholderNotice();
    });
    return;
  }

  link.href = destination;
  link.removeAttribute("aria-disabled");
  link.removeAttribute("title");

  if (/^https?:\/\//.test(destination)) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
}

function hydrateConfiguredLinks() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    const destination = SITE_LINKS[link.dataset.link];
    configureLink(link, destination, "Placeholder link — update SITE_LINKS in app.js");
  });
}

function formatProjectSummary(projects) {
  const count = String(projects.length).padStart(2, "0");
  const label = projects.length === 1 ? "PROJECT" : "PROJECTS";
  const years = projects
    .map(({ year }) => Number(year))
    .filter((year) => Number.isInteger(year) && year >= 1000 && year <= 9999);

  if (!years.length) {
    return `${count} ${label}`;
  }

  const firstYear = Math.min(...years);
  const lastYear = Math.max(...years);
  const yearLabel = firstYear === lastYear ? `${firstYear}` : `${firstYear}–${lastYear}`;

  return `${count} ${label} / ${yearLabel}`;
}

function renderWorkProjects() {
  if (!projectsGrid || !projectSummary || !projectCardTemplate) {
    return;
  }

  const projectCards = document.createDocumentFragment();

  WORK_PROJECTS.forEach((project) => {
    const card = projectCardTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");

    image.src = project.image;
    image.alt = project.imageAlt;
    image.width = project.imageWidth;
    image.height = project.imageHeight;
    card.querySelector("h3").textContent = project.title;
    card.querySelector(".project-content p").textContent = project.description;
    card.querySelector("[data-project-technologies]").textContent = project.technologies.join(" · ");

    configureLink(card, project.url, "Placeholder project link — update WORK_PROJECTS in app.js");
    projectCards.append(card);
  });

  projectsGrid.replaceChildren(projectCards);
  projectSummary.textContent = formatProjectSummary(WORK_PROJECTS);
}

function prepareRevealGroup(elements, stagger = 70) {
  const items = [...elements].filter(Boolean);

  items.forEach((item, index) => {
    item.classList.add("motion-reveal");
    item.style.setProperty("--reveal-delay", `${index * stagger}ms`);
  });

  return items;
}

function initializeHeroMotion() {
  const heroItems = prepareRevealGroup(
    [
      document.querySelector(".hero h1"),
      document.querySelector(".hero-description"),
      document.querySelector(".hero-actions"),
      heroVisual,
    ],
    80,
  );

  heroVisual?.classList.add("motion-reveal--scale");
  return heroItems;
}

function setActiveSection(sectionId) {
  navLinks.forEach((link) => {
    const isActive = sectionId && link.hash === `#${sectionId}`;

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updatePageScrollState() {
  const scrollTop = window.scrollY;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(Math.max(scrollTop / scrollableHeight, 0), 1) : 0;

  siteHeader.classList.toggle("is-scrolled", scrollTop > 12);
  scrollProgress.style.transform = `scaleX(${progress})`;

  if (scrollTop < Math.min(window.innerHeight * 0.35, 280)) {
    setActiveSection(null);
    scrollFrame = null;
    return;
  }

  const viewportMarker = scrollTop + Math.min(window.innerHeight * 0.42, 340);
  const isAtPageEnd = scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 2;
  let activeSection = null;

  trackedSections.forEach((section) => {
    if (section.offsetTop <= viewportMarker) {
      activeSection = section.id;
    }
  });

  if (isAtPageEnd) {
    activeSection = trackedSections.at(-1)?.id || activeSection;
  }

  setActiveSection(activeSection);
  scrollFrame = null;
}

function requestScrollUpdate() {
  if (scrollFrame) {
    return;
  }

  scrollFrame = requestAnimationFrame(updatePageScrollState);
}

function initializeInteractiveMotion() {
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);

  updatePageScrollState();
}

function initializeScrollMotion(heroItems = []) {
  if (!("IntersectionObserver" in window)) {
    heroItems.forEach((item) => item.classList.add("is-revealed"));
    return;
  }

  const revealGroups = [
    [document.querySelectorAll(".skills-section .section-heading"), 0],
    [document.querySelectorAll(".skill-card"), 70],
    [document.querySelectorAll(".about-copy, .metrics > div"), 80],
    [document.querySelectorAll(".work-section .section-heading"), 0],
    [document.querySelectorAll(".project-card"), 80],
    [document.querySelectorAll(".services-section .section-heading"), 0],
    [document.querySelectorAll(".service-card"), 90],
    [document.querySelectorAll(".contact-section > *"), 70],
    [document.querySelectorAll(".footer-brand, .footer-links nav, .footer-bottom"), 70],
  ];

  const revealItems = [
    ...heroItems,
    ...revealGroups.flatMap(([elements, stagger]) => prepareRevealGroup(elements, stagger)),
  ];
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          entry.target.classList.add("is-revealed");
          return;
        }

        if (!entry.isIntersecting) {
          entry.target.classList.remove("is-revealed");
        }
      });
    },
    {
      threshold: [0, 0.15],
      rootMargin: "0px",
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function initializeMotion() {
  if (reducedMotion.matches) {
    return;
  }

  const heroItems = initializeHeroMotion();
  initializeScrollMotion(heroItems);
}

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  isOpen ? closeMenu({ returnFocus: true }) : openMenu();
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileMenu.hidden) {
    closeMenu({ returnFocus: true });
  }
});

document.addEventListener("click", (event) => {
  if (!mobileMenu.hidden && !event.target.closest(".site-header")) {
    closeMenu();
  }
});

desktopBreakpoint.addEventListener("change", (event) => {
  if (event.matches) {
    closeMenu();
  }
});

systemTheme.addEventListener("change", (event) => {
  if (!localStorage.getItem("wahyu-theme")) {
    applyTheme(event.matches ? "light" : "dark", false);
  }
});

renderWorkProjects();
applyTheme(root.dataset.theme, false);
hydrateConfiguredLinks();
initializeMotion();
initializeInteractiveMotion();
