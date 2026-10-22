const HOLD_MS = 6000;
const SLIDE_MS = 600;

const carousel = document.querySelector("[data-services-carousel]");
const viewport = carousel?.querySelector("[data-services-viewport]");
const track = carousel?.querySelector("[data-services-track]");
const previous = carousel?.querySelector("[data-services-prev]");
const next = carousel?.querySelector("[data-services-next]");

if (carousel && viewport && track && previous && next) {
  const originals = [...track.children];
  const count = originals.length;
  originals.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.removeAttribute("id");
    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    track.appendChild(clone);
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let stepPx = 0;
  let animating = false;
  let moveId = 0;
  let timer = 0;
  let inView = false;
  let pointerInside = false;
  let focusInside = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let pointerTracking = false;
  let suppressClick = false;

  function prefersReduced() {
    return reducedMotion.matches;
  }

  function measure() {
    const card = track.querySelector(".service-card");
    if (!card) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    stepPx = card.getBoundingClientRect().width + gap;
    paint(false);
  }

  function paint(animate) {
    const motion = animate && !prefersReduced();
    track.classList.toggle("is-instant", !motion);
    track.style.transform = `translateX(${-index * stepPx}px)`;
    return motion;
  }

  function canAutoplay() {
    return !prefersReduced() && inView && !pointerInside && !focusInside && document.visibilityState === "visible";
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = 0;
    if (!canAutoplay() || animating) return;
    timer = window.setTimeout(() => {
      timer = 0;
      if (!canAutoplay()) return;
      go(1);
    }, HOLD_MS);
  }

  function finishMove(id) {
    if (id !== moveId) return;
    moveId += 1;
    animating = false;
    if (index === count) {
      index = 0;
      paint(false);
    }
    schedule();
  }

  function move() {
    const id = ++moveId;
    const motion = paint(true);
    if (!motion) {
      if (index === count) {
        index = 0;
        paint(false);
      }
      schedule();
      return;
    }
    animating = true;
    const onEnd = (event) => {
      if (event.target !== track || event.propertyName !== "transform") return;
      track.removeEventListener("transitionend", onEnd);
      finishMove(id);
    };
    track.addEventListener("transitionend", onEnd);
    window.setTimeout(() => finishMove(id), SLIDE_MS + 80);
  }

  function go(direction) {
    if (animating || !count) return;
    window.clearTimeout(timer);
    timer = 0;
    if (direction < 0 && index === 0) {
      index = count;
      paint(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          index = count - 1;
          move();
        });
      });
      return;
    }
    index += direction;
    move();
  }

  previous.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    go(event.key === "ArrowRight" ? 1 : -1);
  });

  carousel.addEventListener("mouseenter", () => {
    pointerInside = true;
    window.clearTimeout(timer);
  });
  carousel.addEventListener("mouseleave", () => {
    pointerInside = false;
    schedule();
  });
  carousel.addEventListener("focusin", (event) => {
    focusInside = Boolean(event.target.closest(".service-card"));
    if (focusInside) window.clearTimeout(timer);
    else schedule();
  });
  carousel.addEventListener("focusout", (event) => {
    if (carousel.contains(event.relatedTarget)) return;
    focusInside = false;
    schedule();
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerTracking = true;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
  });
  viewport.addEventListener("pointerup", (event) => {
    if (!pointerTracking) return;
    pointerTracking = false;
    const dx = event.clientX - pointerStartX;
    const dy = event.clientY - pointerStartY;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    suppressClick = true;
    go(dx < 0 ? 1 : -1);
  });
  viewport.addEventListener("pointercancel", () => {
    pointerTracking = false;
  });
  viewport.addEventListener("click", (event) => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") window.clearTimeout(timer);
    else schedule();
  });
  reducedMotion.addEventListener("change", () => {
    window.clearTimeout(timer);
    paint(false);
    schedule();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      if (inView) schedule();
      else window.clearTimeout(timer);
    },
    { threshold: 0.4 },
  );
  observer.observe(viewport);

  const resizeObserver = new ResizeObserver(() => {
    animating = false;
    moveId += 1;
    measure();
    schedule();
  });
  resizeObserver.observe(viewport);
  measure();
}
