import { login, logout, redirectAuthenticatedUser, signup, getPageRoute } from "./modules/auth.js";
import { initializeAuthForm, initializeLogout } from "./modules/form-ui.js";
import { initializeOnboarding } from "./modules/onboarding.js";

const pathname = globalThis.location.pathname;
const pageName = pathname.split("/").filter(Boolean).at(-1) ?? "index.html";

if (pageName === "signup.html" || pageName === "login.html") {
  if (!redirectAuthenticatedUser()) {
    const formName = pageName === "signup.html" ? "signup" : "login";
    const form = document.querySelector(`[data-form="${formName}"]`);

    if (form) {
      initializeAuthForm(form, formName === "signup" ? signup : login);
    }
  }
} else if (pageName === "onboarding.html") {
  initializeOnboarding(document);
}

initializeLogout(document, logout, getPageRoute);
