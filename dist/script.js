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
const artGallery = document.querySelector("[data-art-gallery]");
const spaceMotifs = document.querySelector("[data-space-motifs]");
let heroIntroComplete = false;

const playHeroTitle = () => {
  if (!heroTitle) return;
  heroTitle.classList.remove("is-ready");
  void heroTitle.offsetWidth;
  heroTitle.classList.add("is-ready");
};

const resetHeroTitle = () => {
  heroTitle?.classList.remove("is-ready");
};

window.addEventListener("pageshow", (event) => {
  if (event.persisted && heroIntroComplete) {
    window.setTimeout(playHeroTitle, 160);
  }
});

if (hero && heroTitle) {
  const heroTitleObserver = new IntersectionObserver(
    ([entry]) => {
      if (!heroIntroComplete) return;
      if (entry.isIntersecting) {
        playHeroTitle();
      } else {
        resetHeroTitle();
      }
    },
    { threshold: 0.42 }
  );
  heroTitleObserver.observe(hero);
}

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

if (artGallery) {
  const slides = Array.from(artGallery.querySelectorAll(".gallery-slide"));
  const previousButton = artGallery.querySelector("[data-gallery-prev]");
  const nextButton = artGallery.querySelector("[data-gallery-next]");
  let activeSlide = 0;
  let galleryTimer;

  const showSlide = (index) => {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeSlide);
    });
  };

  const queueGallery = () => {
    window.clearInterval(galleryTimer);
    galleryTimer = window.setInterval(() => showSlide(activeSlide + 1), 4200);
  };

  previousButton?.addEventListener("click", () => {
    showSlide(activeSlide - 1);
    queueGallery();
  });
  nextButton?.addEventListener("click", () => {
    showSlide(activeSlide + 1);
    queueGallery();
  });
  showSlide(0);
  if (slides.length > 1) queueGallery();
}

if (spaceMotifs) {
  const replaySpaceMotifs = () => {
    spaceMotifs.classList.remove("is-active");
    void spaceMotifs.offsetWidth;
    spaceMotifs.classList.add("is-active");
  };

  const spaceMotifObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        replaySpaceMotifs();
      } else {
        spaceMotifs.classList.remove("is-active");
      }
    },
    { threshold: 0.38 }
  );

  spaceMotifObserver.observe(spaceMotifs);
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  intro?.classList.add("is-hidden");
  heroIntroComplete = true;
  playHeroTitle();
} else {
  window.setTimeout(() => intro?.classList.add("is-hidden"), 2750);
  window.setTimeout(() => {
    heroIntroComplete = true;
    playHeroTitle();
  }, 3350);
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
