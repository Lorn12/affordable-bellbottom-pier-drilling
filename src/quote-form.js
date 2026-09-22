const MAIL_TO = "bids@affordablebellbottomdrill.com";

const form = document.querySelector("[data-quote-form]");
if (form) {
  const status = document.querySelector("[data-quote-status]");
  const submit = form.querySelector("[data-quote-submit]");
  const success = document.querySelector("[data-quote-success]");

  function errorEl(input) {
    return form.querySelector(`[data-quote-error="${input.id}"]`);
  }

  function setError(input, message) {
    const err = errorEl(input);
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (err) {
      err.textContent = message || "";
      if (message) input.setAttribute("aria-describedby", err.id);
      else input.removeAttribute("aria-describedby");
    }
  }

  function labelText(input) {
    const label = form.querySelector(`label[for="${input.id}"]`);
    return label ? label.textContent.trim() : "this field";
  }

  function emptyMessage(input) {
    const label = labelText(input).toLowerCase();
    if (input.tagName === "SELECT") {
      if (label === "service needed") return "Select the service you need.";
      return `Select ${label}.`;
    }
    if (label === "full name") return "Enter your full name.";
    if (label === "email address") return "Enter your email address.";
    if (label === "kind of work") return "Tell us what you do.";
    return `Enter your ${label}.`;
  }

  function validate() {
    let firstInvalid = null;
    const fields = [...form.querySelectorAll("input, select, textarea")].filter(
      (input) => !input.matches("[data-quote-hp]"),
    );

    for (const input of fields) {
      const value = input.value.trim();
      if (input.required && !value) {
        setError(input, emptyMessage(input));
        firstInvalid ??= input;
        continue;
      }
      if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError(input, "Enter a valid email address.");
        firstInvalid ??= input;
        continue;
      }
      if (input.type === "tel" && value && !/^[0-9+().\s-]{7,}$/.test(value)) {
        setError(input, "Enter a valid phone number, or leave this blank.");
        firstInvalid ??= input;
        continue;
      }
      setError(input, "");
    }

    return firstInvalid;
  }

  function mailBody() {
    return [...form.querySelectorAll("input, select, textarea")]
      .filter((input) => !input.matches("[data-quote-hp]") && input.name && input.value.trim())
      .map((input) => `${labelText(input)}: ${input.value.trim()}`)
      .join("\n");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.dataset.busy === "true") return;

    const honeypot = form.querySelector("[data-quote-hp]");
    if (honeypot?.value) {
      form.hidden = true;
      if (success) success.hidden = false;
      return;
    }

    const firstInvalid = validate();
    if (firstInvalid) {
      firstInvalid.focus();
      if (status) status.textContent = "Fix the highlighted fields and try again.";
      return;
    }

    form.dataset.busy = "true";
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    if (status) status.textContent = "";

    const subject = form.dataset.mailSubject || "Website form";
    const href = `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody())}`;
    const mail = document.createElement("a");
    mail.href = href;
    mail.hidden = true;
    document.body.append(mail);
    mail.click();
    mail.remove();

    window.setTimeout(() => {
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
      const nextStep = success?.querySelector("p, h2, h3");
      if (status && nextStep) status.textContent = nextStep.textContent.trim();
      else if (status) status.textContent = "";
    }, 400);
  });
}
