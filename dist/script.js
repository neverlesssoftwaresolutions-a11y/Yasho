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
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let heroIntroComplete = false;
let heroScrollLocked = false;
let scrollAnimationFrame = 0;
let savedScrollBehavior = "";

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

const cancelSectionScroll = () => {
  if (!scrollAnimationFrame) return;
  window.cancelAnimationFrame(scrollAnimationFrame);
  scrollAnimationFrame = 0;
  document.documentElement.style.scrollBehavior = savedScrollBehavior;
  heroScrollLocked = false;
};

const moveToSection = (target, updateHash = true, duration = 1180, lockHero = false) => {
  if (!target) return;
  cancelSectionScroll();
  closeMenu();

  if (updateHash && target.id) {
    history.pushState(null, "", `#${target.id}`);
  }

  const startY = window.scrollY;
  const headerOffset = target.id === "top" ? 0 : 56;
  const targetY = Math.max(0, target.getBoundingClientRect().top + startY - headerOffset);
  const distance = targetY - startY;

  if (prefersReducedMotion.matches || Math.abs(distance) < 2) {
    window.scrollTo(0, targetY);
    heroScrollLocked = false;
    return;
  }

  heroScrollLocked = lockHero;
  savedScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  const startedAt = performance.now();

  const animateScroll = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = progress < .5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      scrollAnimationFrame = window.requestAnimationFrame(animateScroll);
      return;
    }

    scrollAnimationFrame = 0;
    document.documentElement.style.scrollBehavior = savedScrollBehavior;
    heroScrollLocked = false;
  };

  scrollAnimationFrame = window.requestAnimationFrame(animateScroll);
};

document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    moveToSection(target);
  });
});

window.addEventListener(
  "wheel",
  (event) => {
    if (!hero) return;
    const isOnHomeScreen = window.scrollY < hero.offsetHeight * 0.6;

    if (!isOnHomeScreen) {
      cancelSectionScroll();
      return;
    }

    if (event.deltaY <= 0) {
      cancelSectionScroll();
      return;
    }

    if (heroScrollLocked) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    if (!heroIntroComplete) return;
    moveToSection(document.querySelector("#space"), false, 1450, true);
  },
  { passive: false }
);

let heroTouchStartY = null;
hero?.addEventListener(
  "touchstart",
  (event) => {
    heroTouchStartY = event.touches[0]?.clientY ?? null;
  },
  { passive: true }
);
hero?.addEventListener(
  "touchend",
  (event) => {
    if (heroTouchStartY === null || heroScrollLocked || !heroIntroComplete) return;
    const touchEndY = event.changedTouches[0]?.clientY ?? heroTouchStartY;
    const swipedUp = heroTouchStartY - touchEndY > 52;
    heroTouchStartY = null;
    if (swipedUp && window.scrollY < hero.offsetHeight * 0.6) {
      moveToSection(document.querySelector("#space"), false, 1450, true);
    }
  },
  { passive: true }
);

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

if (prefersReducedMotion.matches) {
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
