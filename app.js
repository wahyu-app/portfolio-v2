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
  projectIndramayu: "",
  projectDicoding: "",
  projectCodePolitan: "",
  projectMuseum: "",
});

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuLinks = [...mobileMenu.querySelectorAll("a")];
const linkNotice = document.querySelector(".link-notice");
const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");
const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let noticeTimer;

function applyTheme(theme, persist = true) {
  const nextTheme = theme === "light" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme === "dark" ? "light" : "dark"} theme`);
  themeColor.setAttribute("content", nextTheme === "dark" ? "#0a0a0a" : "#f5f5f2");

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

function hydrateConfiguredLinks() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    const destination = SITE_LINKS[link.dataset.link];

    if (!destination) {
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "Placeholder link — update SITE_LINKS in app.js");
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
      link.rel = "noreferrer";
    }
  });
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
  const heroVisual = document.querySelector(".hero-visual");
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

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroItems.forEach((item) => item.classList.add("is-revealed"));
    });
  });
}

function initializeScrollMotion() {
  if (!("IntersectionObserver" in window)) {
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

  const revealItems = revealGroups.flatMap(([elements, stagger]) => prepareRevealGroup(elements, stagger));
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function initializeMotion() {
  if (reducedMotion.matches) {
    return;
  }

  initializeHeroMotion();
  initializeScrollMotion();
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

applyTheme(root.dataset.theme, false);
hydrateConfiguredLinks();
initializeMotion();
