import { login, logout, redirectAuthenticatedUser, signup, getPageRoute } from "./modules/auth.js";
import { initializeAuthForm, initializeLogout } from "./modules/form-ui.js";
import { initializeNavigation } from "./modules/navigation.js";
import { initializeOnboarding } from "./modules/onboarding.js";
import { populateUserUI } from "./modules/user-ui.js";
import { initializeDashboard } from "./pages/dashboard.js";
import { initializeProfile } from "./pages/profile.js";

const page = document.body.dataset.page;

if (page === "signup" || page === "login") {
  if (!redirectAuthenticatedUser()) {
    const formName = page;
    const form = document.querySelector(`[data-form="${formName}"]`);

    if (form) {
      initializeAuthForm(form, formName === "signup" ? signup : login);
    }
  }
} else if (page === "onboarding") {
  initializeOnboarding(document);
} else if (initializeNavigation(page)) {
  if (["dashboard", "learn", "lesson", "games", "quiz", "songs", "achievements", "profile"].includes(page)) {
    populateUserUI(document);
  }

  if (page === "dashboard") {
    initializeDashboard(document);
  } else if (page === "profile") {
    initializeProfile(document);
  }
}

initializeLogout(document, logout, getPageRoute);
