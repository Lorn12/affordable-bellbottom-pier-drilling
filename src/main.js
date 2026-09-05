import "./style.css";

const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-mobile-menu]");
const menuClose = document.querySelector("[data-menu-close]");
const status = document.querySelector("[data-status]");
const siteHeader = document.querySelector("[data-site-header]");
const headerSolidAt = document.querySelector("[data-header-solid-at]");

const headerSolidClasses = (siteHeader?.dataset.solidClass || "header-solid")
  .split(/\s+/)
  .filter(Boolean);

function updateHeaderSurface() {
  if (!siteHeader || !headerSolidAt) return;
  const headerBottom = siteHeader.getBoundingClientRect().bottom;
  const solidStart = headerSolidAt.getBoundingClientRect().top;
  const isSolid = solidStart <= headerBottom;
  headerSolidClasses.forEach((className) => {
    siteHeader.classList.toggle(className, isSolid);
  });
}

updateHeaderSurface();
window.addEventListener("scroll", updateHeaderSurface, { passive: true });
window.addEventListener("resize", updateHeaderSurface);

const logoMarqueeTrack = document.querySelector(".logo-marquee-track");
const logoMarquee = document.querySelector(".logo-marquee");
const logoMarqueeSet = logoMarquee?.querySelector("[data-marquee-set]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const MARQUEE_PX_PER_SECOND = 40;

let marqueeSetWidth = 0;
let marqueeOffset = 0;
let marqueeLastTime = 0;
let marqueeFrame = 0;
let marqueeInView = true;

function stopLogoMarquee() {
  if (marqueeFrame) {
    cancelAnimationFrame(marqueeFrame);
    marqueeFrame = 0;
  }
}

function tickLogoMarquee(now) {
  if (!logoMarquee || !marqueeSetWidth || prefersReducedMotion.matches || !marqueeInView || document.hidden) {
    marqueeFrame = 0;
    return;
  }

  if (!marqueeLastTime) marqueeLastTime = now;
  const delta = Math.min((now - marqueeLastTime) / 1000, 0.05);
  marqueeLastTime = now;
  marqueeOffset = (marqueeOffset + MARQUEE_PX_PER_SECOND * delta) % marqueeSetWidth;
  logoMarquee.style.transform = `translate3d(${-marqueeOffset}px, 0, 0)`;
  marqueeFrame = requestAnimationFrame(tickLogoMarquee);
}

function startLogoMarquee() {
  if (marqueeFrame || !marqueeSetWidth || prefersReducedMotion.matches || !marqueeInView || document.hidden) return;
  marqueeLastTime = 0;
  marqueeFrame = requestAnimationFrame(tickLogoMarquee);
}

function updateLogoMarquee() {
  if (!logoMarqueeTrack || !logoMarquee || !logoMarqueeSet) return;

  stopLogoMarquee();
  logoMarquee.querySelectorAll("[data-marquee-clone]").forEach((node) => node.remove());
  logoMarquee.style.transform = "translate3d(0, 0, 0)";
  marqueeOffset = 0;

  const setWidth = logoMarqueeSet.offsetWidth;
  const trackWidth = logoMarqueeTrack.clientWidth;
  if (!setWidth) return;

  marqueeSetWidth = setWidth;

  if (prefersReducedMotion.matches) return;

  const copies = Math.max(2, Math.ceil((trackWidth + setWidth) / setWidth));
  for (let i = 1; i < copies; i += 1) {
    const clone = logoMarqueeSet.cloneNode(true);
    clone.removeAttribute("data-marquee-set");
    clone.setAttribute("data-marquee-clone", "");
    clone.setAttribute("aria-hidden", "true");
    logoMarquee.appendChild(clone);
  }

  startLogoMarquee();
}

updateLogoMarquee();
window.addEventListener("resize", updateLogoMarquee);
prefersReducedMotion.addEventListener("change", updateLogoMarquee);
logoMarqueeSet?.querySelectorAll("img").forEach((img) => {
  if (!img.complete) img.addEventListener("load", updateLogoMarquee);
});
document.fonts?.ready.then(updateLogoMarquee);

if (logoMarqueeTrack) {
  const marqueeObserver = new IntersectionObserver(
    ([entry]) => {
      marqueeInView = entry.isIntersecting;
      if (marqueeInView) startLogoMarquee();
      else stopLogoMarquee();
    },
    { threshold: 0 }
  );
  marqueeObserver.observe(logoMarqueeTrack);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopLogoMarquee();
  else startLogoMarquee();
});

function getMenuFocusable() {
  if (!menu) return [];
  return [...menu.querySelectorAll("a[href], button:not([disabled])")];
}

function openMenu() {
  if (!menu || !menuButton) return;
  menu.hidden = false;
  menu.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  const first = getMenuFocusable()[0];
  first?.focus();
}

function closeMenu() {
  if (!menu || !menuButton) return;
  menu.hidden = true;
  menu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  menuButton.focus();
}

function trapMenuFocus(event) {
  if (!menu || menu.hidden || event.key !== "Tab") return;
  const focusable = getMenuFocusable();
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  if (expanded) closeMenu();
  else openMenu(); 
});

menuClose?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
  trapMenuFocus(event);
  if (event.key === "Escape" && menu && !menu.hidden) {
    closeMenu();
  }
});

menu?.addEventListener("click", (event) => {
  if (event.target === menu) closeMenu();
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (!link.classList.contains("coming-soon")) closeMenu();
  });
});

function announceComingSoon(event) {
  const link = event.currentTarget;
  if (link.getAttribute("aria-disabled") !== "true") return;
  event.preventDefault();
  if (status) {
    status.textContent = "";
    status.textContent = `${link.textContent.trim()} is coming soon.`;
  }
}

document.querySelectorAll(".coming-soon").forEach((link) => {
  link.addEventListener("click", announceComingSoon);
});

document.querySelectorAll("[data-project-card]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#") event.preventDefault();
  });
});
