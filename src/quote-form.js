const form = document.querySelector("[data-quote-form]");
if (form) {
  const status = document.querySelector("[data-quote-status]");
  const submit = form.querySelector("[data-quote-submit]");
  const success = document.querySelector("[data-quote-success]");
  const fields = {
    name: form.querySelector("#quote-name"),
    email: form.querySelector("#quote-email"),
    phone: form.querySelector("#quote-phone"),
    service: form.querySelector("#quote-service"),
  };

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

  function validate() {
    let firstInvalid = null;

    const name = fields.name.value.trim();
    if (!name) {
      setError(fields.name, "Enter your full name.");
      firstInvalid ??= fields.name;
    } else {
      setError(fields.name, "");
    }

    const email = fields.email.value.trim();
    if (!email) {
      setError(fields.email, "Enter your email address.");
      firstInvalid ??= fields.email;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(fields.email, "Enter a valid email address.");
      firstInvalid ??= fields.email;
    } else {
      setError(fields.email, "");
    }

    const phone = fields.phone.value.trim();
    if (phone && !/^[0-9+().\s-]{7,}$/.test(phone)) {
      setError(fields.phone, "Enter a valid phone number, or leave this blank.");
      firstInvalid ??= fields.phone;
    } else {
      setError(fields.phone, "");
    }

    if (!fields.service.value) {
      setError(fields.service, "Select the service you need.");
      firstInvalid ??= fields.service;
    } else {
      setError(fields.service, "");
    }

    return firstInvalid;
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
