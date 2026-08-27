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

function openMenu() {
  if (!menu || !menuButton) return;
  menu.hidden = false;
  menu.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  const first = menu.querySelector("a, button");
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

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  if (expanded) closeMenu();
  else openMenu();
});

menuClose?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
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
