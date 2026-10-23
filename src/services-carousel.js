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
    card.draggable = false;
    card.querySelectorAll("img").forEach((img) => {
      img.draggable = false;
    });
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
  let suppressClick = false;
  let dragPointer = -1;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragDx = 0;
  let dragAxis = "";
  let wheelLock = false;

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

  const SWIPE_PX = 48;

  function dragTransform(dx) {
    track.classList.add("is-instant");
    track.style.transform = `translateX(${-index * stepPx + dx}px)`;
  }

  function beginDrag(event) {
    if (dragPointer !== -1) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (animating) {
      moveId += 1;
      animating = false;
      if (index === count) index = 0;
      paint(false);
    }
    dragPointer = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragDx = 0;
    dragAxis = "";
    window.clearTimeout(timer);
    timer = 0;
  }

  function moveDrag(event) {
    if (event.pointerId !== dragPointer) return;
    const dx = event.clientX - dragStartX;
    const dy = event.clientY - dragStartY;
    if (!dragAxis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      dragAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (dragAxis === "x") suppressClick = true;
    }
    if (dragAxis !== "x") return;
    if (index === 0 && dx > 0) index = count;
    else if (index === count && dx <= 0) index = 0;
    dragDx = dx;
    if (event.cancelable) event.preventDefault();
    try {
      if (!viewport.hasPointerCapture(event.pointerId)) viewport.setPointerCapture(event.pointerId);
    } catch {
      // The pointer can already be gone. Document listeners still track the gesture.
    }
    dragTransform(dx);
  }

  function endDrag(event) {
    if (event.pointerId !== dragPointer) return;
    const dx = dragDx;
    const axis = dragAxis;
    dragPointer = -1;
    dragAxis = "";
    dragDx = 0;
    try {
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    } catch {
      // Capture was not set for this pointer.
    }
    if (axis !== "x" || event.type === "pointercancel") {
      if (axis === "x") move();
      else schedule();
      return;
    }
    if (Math.abs(dx) < SWIPE_PX) {
      move();
      return;
    }
    go(dx < 0 ? 1 : -1);
  }

  viewport.addEventListener("pointerdown", beginDrag);
  document.addEventListener("pointermove", moveDrag, { passive: false });
  document.addEventListener("pointerup", endDrag);
  document.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 8) return;
    if (event.cancelable) event.preventDefault();
    if (wheelLock || animating) return;
    wheelLock = true;
    window.setTimeout(() => {
      wheelLock = false;
    }, SLIDE_MS);
    go(event.deltaX > 0 ? 1 : -1);
  }, { passive: false });
  document.addEventListener("click", (event) => {
    if (!suppressClick) return;
    suppressClick = false;
    if (!viewport.contains(event.target)) return;
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
