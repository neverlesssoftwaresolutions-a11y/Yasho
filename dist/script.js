const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobilePanel = document.querySelector("[data-mobile-panel]");
const intro = document.querySelector(".brand-intro");

const setHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};
setHeader();
window.addEventListener("scroll", setHeader, { passive: true });

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
} else if (sessionStorage.getItem("yashoIntroSeen")) {
  intro?.classList.add("is-hidden");
} else {
  sessionStorage.setItem("yashoIntroSeen", "true");
  window.setTimeout(() => intro?.classList.add("is-hidden"), 950);
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
