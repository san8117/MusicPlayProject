const TOAST_DURATION = 3500;
const TOAST_TYPES = new Set(["xp", "level", "achievement", "info"]);
const toastTimers = new WeakMap();

/**
 * Shows a dismissible live-region toast that expires automatically.
 *
 * @param {string} message Accessible toast message.
 * @param {{type?: "xp" | "level" | "achievement" | "info"}} [options] Toast presentation.
 * @returns {HTMLElement | null} The created toast, or null if no document is available.
 */
export function showToast(message, options = {}) {
  if (typeof document === "undefined" || typeof message !== "string" || !message.trim()) {
    return null;
  }

  const requestedType = options && typeof options === "object" ? options.type : "info";
  const container = getToastContainer();
  const toast = document.createElement("div");
  const content = document.createElement("p");
  const closeButton = document.createElement("button");
  const safeType = TOAST_TYPES.has(requestedType) ? requestedType : "info";
  const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  toast.className = `toast toast--${safeType}`;
  if (reducedMotion) {
    toast.style.animation = "none";
  }
  content.className = "toast__message";
  content.textContent = message;
  closeButton.className = "toast__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Fechar aviso");
  closeButton.textContent = "×";
  closeButton.dataset.action = "dismiss-toast";

  toast.append(content, closeButton);
  container.append(toast);
  scheduleToastDismissal(toast);
  toast.addEventListener("pointerenter", pauseToastDismissal);
  toast.addEventListener("pointerleave", resumeToastDismissal);
  toast.addEventListener("focusin", pauseToastDismissal);
  toast.addEventListener("focusout", resumeToastDismissal);
  return toast;
}

function getToastContainer() {
  let container = document.querySelector("[data-toast-container]");

  if (!container) {
    container = document.createElement("div");
    container.className = "toast-region";
    container.dataset.toastContainer = "";
    document.body.append(container);
  }

  container.setAttribute("role", "status");
  container.setAttribute("aria-live", "polite");
  container.setAttribute("aria-relevant", "additions text");

  if (container.dataset.dismissDelegation !== "ready") {
    container.dataset.dismissDelegation = "ready";
    container.addEventListener("click", (event) => {
      const closeButton = event.target.closest('[data-action="dismiss-toast"]');

      if (closeButton && container.contains(closeButton)) {
        const toast = closeButton.closest(".toast");

        if (toast) {
          dismissToast(toast);
        }
      }
    });
  }

  return container;
}

function dismissToast(toast) {
  if (!toast.isConnected) {
    return;
  }

  globalThis.clearTimeout(toastTimers.get(toast));
  toastTimers.delete(toast);
  const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  if (reducedMotion) {
    toast.remove();
    return;
  }

  toast.classList.add("toast--leaving");
  globalThis.setTimeout(() => toast.remove(), 300);
}

function scheduleToastDismissal(toast) {
  globalThis.clearTimeout(toastTimers.get(toast));
  toastTimers.set(toast, globalThis.setTimeout(() => dismissToast(toast), TOAST_DURATION));
}

function pauseToastDismissal(event) {
  globalThis.clearTimeout(toastTimers.get(event.currentTarget));
  toastTimers.delete(event.currentTarget);
}

function resumeToastDismissal(event) {
  const toast = event.currentTarget;
  const nextTarget = event.relatedTarget;

  if (
    toast.matches(":hover, :focus-within")
    || (nextTarget instanceof Node && toast.contains(nextTarget))
  ) {
    return;
  }

  scheduleToastDismissal(toast);
}
