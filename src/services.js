const accordion = document.querySelector("[data-prep-accordion]");
const timeline = document.querySelector("[data-prep-timeline]");
const steps = [...document.querySelectorAll("[data-prep-step]")];
const AUTO_MS = 7000;
const openButtonClass = "flex w-full items-center gap-4 rounded-t-xl bg-neutral-800 p-6 text-left";
const closedButtonClass = "flex w-full items-center gap-4 px-6 py-5 text-left";
const openPanelClass = "rounded-b-xl bg-neutral-800 px-6 pb-6";
const closedPanelClass = "px-6 pb-6";
let autoTimer = 0;
let rafId = 0;
let autoIndex = 0;
let lastBeat = 0;

function updateTimeline(index) {
  if (!timeline || !steps[index]) return;
  const railBox = timeline.getBoundingClientRect();
  const stepBox = steps[index].getBoundingClientRect();
  if (!railBox.height) return;
  const top = Math.max(0, stepBox.top - railBox.top);
  const height = Math.min(railBox.height - top, Math.max(0, stepBox.height));
  timeline.style.setProperty("--prep-fill-top", `${top}px`);
  timeline.style.setProperty("--prep-fill-height", `${height}px`);
}

function setOpen(index) {
  steps.forEach((step, i) => {
    const button = step.querySelector("[data-prep-trigger]");
    const panel = step.querySelector("[data-prep-panel]");
    const title = step.querySelector("[data-prep-title]");
    const icon = step.querySelector("[data-prep-icon]");
    const isOpen = i === index;
    button?.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (button) button.className = isOpen ? openButtonClass : closedButtonClass;
    if (title) {
      title.classList.toggle("text-white", isOpen);
      title.classList.toggle("text-neutral-300", !isOpen);
    }
    if (icon) {
      icon.classList.toggle("text-lime", isOpen);
      icon.classList.toggle("text-neutral-300", !isOpen);
    }
    if (panel) {
      panel.hidden = !isOpen;
      panel.className = isOpen ? openPanelClass : closedPanelClass;
    }
  });
  autoIndex = index;
  lastBeat = performance.now();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => updateTimeline(index));
  });
}

function nextStep() {
  if (!steps.length) return;
  setOpen((autoIndex + 1) % steps.length);
}

function stopAuto() {
  if (autoTimer) {
    window.clearTimeout(autoTimer);
    autoTimer = 0;
  }
  if (rafId) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

function queueTimeout() {
  if (autoTimer) window.clearTimeout(autoTimer);
  autoTimer = window.setTimeout(() => {
    if (performance.now() - lastBeat < AUTO_MS - 30) {
      queueTimeout();
      return;
    }
    nextStep();
    queueTimeout();
  }, AUTO_MS);
}

function watchFrame(now) {
  rafId = window.requestAnimationFrame(watchFrame);
  if (now - lastBeat < AUTO_MS) return;
  nextStep();
  queueTimeout();
}

function startAuto() {
  if (!steps.length) return;
  lastBeat = performance.now();
  queueTimeout();
  if (!rafId) rafId = window.requestAnimationFrame(watchFrame);
}

steps.forEach((step, index) => {
  const button = step.querySelector("[data-prep-trigger]");
  button?.addEventListener("click", () => {
    setOpen(index);
    startAuto();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  if (accordion?.contains(event.target) || accordion?.contains(document.activeElement)) {
    stopAuto();
  }
});
accordion?.addEventListener("focusout", (event) => {
  const next = event.relatedTarget;
  if (next && accordion.contains(next)) return;
  window.setTimeout(() => {
    if (accordion.contains(document.activeElement)) return;
    startAuto();
  }, 0);
});

window.addEventListener("pageshow", () => startAuto());
window.addEventListener("resize", () => updateTimeline(autoIndex));
window.addEventListener("orientationchange", () => updateTimeline(autoIndex));
if (accordion && typeof ResizeObserver !== "undefined") {
  new ResizeObserver(() => updateTimeline(autoIndex)).observe(accordion);
}

if (steps.length) {
  setOpen(0);
  startAuto();
}
