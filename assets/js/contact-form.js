(function () {
  "use strict";

  const RECEIVING_EMAIL = "leoo.rossetti@gmail.com";
  const FORM_SUBMIT_ENDPOINT = "https://formsubmit.co/ajax/" + encodeURIComponent(RECEIVING_EMAIL);
  const PHP_ENDPOINT = "forms/contact.php";

  function usesPhpBackend(form) {
    return form.dataset.backend === "php";
  }

  function displayError(form, error) {
    form.querySelector(".loading").classList.remove("d-block");
    const errorEl = form.querySelector(".error-message");
    errorEl.innerHTML = error;
    errorEl.classList.add("d-block");
  }

  function displaySuccess(form) {
    form.querySelector(".loading").classList.remove("d-block");
    form.querySelector(".sent-message").classList.add("d-block");
    form.reset();
  }

  async function submitViaFormSubmit(formData) {
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      _subject: "Portfolio contact: " + formData.get("subject"),
      _template: "table",
      _captcha: "false",
    };

    const response = await fetch(FORM_SUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok) {
      throw new Error(data.message || response.status + " " + response.statusText);
    }

    return data;
  }

  async function submitViaPhp(formData) {
    const response = await fetch(PHP_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || response.status + " " + response.statusText);
    }

    if (text.trim() !== "OK") {
      throw new Error(text || "Form submission failed.");
    }
  }

  document.querySelectorAll(".php-email-form").forEach(function (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      form.querySelector(".loading").classList.add("d-block");
      form.querySelector(".error-message").classList.remove("d-block");
      form.querySelector(".sent-message").classList.remove("d-block");

      const formData = new FormData(form);

      try {
        if (usesPhpBackend(form)) {
          await submitViaPhp(formData);
        } else {
          await submitViaFormSubmit(formData);
        }

        displaySuccess(form);
      } catch (error) {
        displayError(form, error.message || String(error));
      }
    });
  });
})();
