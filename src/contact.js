const items = [...document.querySelectorAll("[data-faq-item]")];

function setOpen(index) {
  items.forEach((item, i) => {
    const button = item.querySelector("[data-faq-trigger]");
    const panel = item.querySelector("[data-faq-panel]");
    const icon = item.querySelector("[data-faq-icon]");
    const open = i === index;
    button?.setAttribute("aria-expanded", open ? "true" : "false");
    if (panel) panel.hidden = !open;
    if (icon) {
      icon.textContent = open ? "−" : "+";
      icon.classList.toggle("text-lime", open);
      icon.classList.toggle("text-neutral-200", !open);
    }
  });
}

items.forEach((item, index) => {
  const button = item.querySelector("[data-faq-trigger]");
  button?.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    setOpen(isOpen ? -1 : index);
  });
});

if (items.length) setOpen(0);
