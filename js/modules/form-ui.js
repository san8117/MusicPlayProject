import { validateLogin, validateSignup } from "./auth.js";

const SUBMIT_LABELS = Object.freeze({
  signup: "Criando sua conta...",
  login: "Entrando...",
});

/**
 * Displays or clears a field error using its existing accessible error element.
 *
 * @param {HTMLInputElement} field Form field.
 * @param {string} message Error message; an empty string clears the error.
 * @returns {void}
 */
export function setFieldError(field, message) {
  const errorMessage = message ?? "";
  const error = field.form?.querySelector(`[data-field-error="${CSS.escape(field.dataset.field)}"]`);
  const wrapper = field.closest(".form-field");

  if (error) {
    error.textContent = errorMessage;
  }

  if (errorMessage) {
    field.setAttribute("aria-invalid", "true");
    wrapper?.classList.add("form-field--error");
  } else {
    field.removeAttribute("aria-invalid");
    wrapper?.classList.remove("form-field--error");
  }
}

/**
 * Initializes delegated signup/login interactions for a form.
 *
 * @param {HTMLFormElement} form Signup or login form.
 * @param {(fields: object) => Promise<object>} submitAction Auth operation.
 * @returns {void}
 */
export function initializeAuthForm(form, submitAction) {
  const formType = form.dataset.form;
  const validator = formType === "signup" ? validateSignup : validateLogin;
  const feedback = form.querySelector("[data-form-feedback]");
  const submitButton = form.querySelector('[type="submit"]');

  form.addEventListener("focusout", (event) => {
    const field = event.target.closest("[data-field]");

    if (!field || !form.contains(field)) {
      return;
    }

    const fieldValues = readFormValues(form);
    const errors = validator(fieldValues);
    setFieldError(field, errors[field.name] ?? "");
  });

  form.addEventListener("input", (event) => {
    const field = event.target.closest("[data-field]");

    if (!field || !field.hasAttribute("aria-invalid")) {
      return;
    }

    const errors = validator(readFormValues(form));
    setFieldError(field, errors[field.name] ?? "");
  });

  form.addEventListener("click", (event) => {
    const toggle = event.target.closest('[data-action="toggle-password"]');

    if (!toggle || !form.contains(toggle)) {
      return;
    }

    const password = form.querySelector(`#${CSS.escape(toggle.getAttribute("aria-controls"))}`);

    if (!password) {
      return;
    }

    const isVisible = password.type === "text";
    password.type = isVisible ? "password" : "text";
    toggle.setAttribute("aria-label", isVisible ? "Mostrar senha" : "Ocultar senha");
    toggle.setAttribute("aria-pressed", String(!isVisible));
    toggle.textContent = isVisible ? "Mostrar" : "Ocultar";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFeedback(feedback);

    const values = readFormValues(form);
    const errors = validator(values);
    const fields = Array.from(form.querySelectorAll("[data-field]"));

    fields.forEach((field) => setFieldError(field, errors[field.name] ?? ""));

    const firstInvalidField = fields.find((field) => errors[field.name]);

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    if (!submitButton || submitButton.disabled) {
      return;
    }

    const originalLabel = submitButton.textContent.trim();
    submitButton.disabled = true;
    submitButton.textContent = SUBMIT_LABELS[formType] ?? originalLabel;

    try {
      const result = await submitAction(values);

      if (result?.ok && result.redirect) {
        globalThis.location.assign(resolveRoute(result.redirect));
        return;
      }

      if (feedback) {
        feedback.textContent = result?.message ?? "Não foi possível concluir agora. Tente novamente.";
      }
    } catch {
      if (feedback) {
        feedback.textContent = "Não foi possível concluir agora. Confira sua conexão e tente novamente.";
      }
    } finally {
      if (submitButton.isConnected) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });
}

/**
 * Initializes delegated logout behavior only when the page contains a logout action.
 *
 * @param {Document} root Document receiving the delegated click listener.
 * @param {() => object} logoutAction Auth logout function.
 * @param {(page: string) => string} routeResolver Relative route resolver.
 * @returns {void}
 */
export function initializeLogout(root, logoutAction, routeResolver) {
  if (!root.querySelector('[data-action="logout"]')) {
    return;
  }

  root.addEventListener("click", (event) => {
    const logoutButton = event.target.closest('[data-action="logout"]');

    if (!logoutButton || !root.contains(logoutButton)) {
      return;
    }

    const result = logoutAction();

    if (result.ok) {
      globalThis.location.assign(routeResolver(result.redirect));
    }
  });
}

function readFormValues(form) {
  const values = {};

  form.querySelectorAll("[data-field]").forEach((field) => {
    values[field.name] = field.type === "checkbox" ? field.checked : field.value;
  });

  return values;
}

function clearFeedback(feedback) {
  if (feedback) {
    feedback.textContent = "";
  }
}

function resolveRoute(page) {
  const inPagesDirectory = /\/pages\/[^/]*$/u.test(globalThis.location.pathname);
  return `${inPagesDirectory ? "./" : "./pages/"}${page}`;
}
