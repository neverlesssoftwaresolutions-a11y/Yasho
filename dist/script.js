if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);
window.addEventListener("pageshow", () => window.scrollTo(0, 0));

const header = document.querySelector("[data-header]");
const hero = document.querySelector(".hero");
const heroTitle = document.querySelector("[data-hero-title]");
const menuButton = document.querySelector("[data-menu-button]");
const mobilePanel = document.querySelector("[data-mobile-panel]");
const intro = document.querySelector(".brand-intro");

const playHeroTitle = () => {
  if (!heroTitle) return;
  heroTitle.classList.remove("is-ready");
  void heroTitle.offsetWidth;
  heroTitle.classList.add("is-ready");
};

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.setTimeout(playHeroTitle, 160);
  }
});

const setHeader = () => {
  const notchPoint = hero ? hero.offsetHeight - 96 : 12;
  header?.classList.toggle("is-scrolled", window.scrollY > notchPoint);
};
setHeader();
window.addEventListener("scroll", setHeader, { passive: true });
window.addEventListener("resize", setHeader);

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  mobilePanel?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  mobilePanel?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobilePanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  intro?.classList.add("is-hidden");
  playHeroTitle();
} else {
  window.setTimeout(() => intro?.classList.add("is-hidden"), 2750);
  window.setTimeout(playHeroTitle, 3350);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(item);
});
