import { getPageRoute } from "./auth.js";
import { getCurrentUser } from "./state.js";
import { registerVisit } from "./streak.js";

const PROTECTED_PAGES = new Set([
  "dashboard",
  "learn",
  "lesson",
  "games",
  "quiz",
  "songs",
  "achievements",
  "profile",
]);

const NAV_TARGETS = Object.freeze({
  achievements: "achievements.html",
  dashboard: "dashboard.html",
  games: "games.html",
  learn: "learn.html",
  lesson: "learn.html",
  profile: "profile.html",
  quiz: "games.html",
  songs: "songs.html",
});

/**
 * Protects logged-in pages and marks the matching app navigation destination.
 *
 * @param {string} page Current page identifier from the body data-page.
 * @returns {boolean} Whether the page can continue initializing.
 */
export function initializeNavigation(page) {
  if (!PROTECTED_PAGES.has(page)) {
    return true;
  }

  const user = getCurrentUser();

  if (!user) {
    globalThis.location.assign(getPageRoute("login.html"));
    return false;
  }

  if (!user.onboardingDone) {
    globalThis.location.assign(getPageRoute("onboarding.html"));
    return false;
  }

  setActiveNavigation(page);
  registerVisit();
  return true;
}

function setActiveNavigation(page) {
  const destination = NAV_TARGETS[page];

  if (!destination) {
    return;
  }

  document.querySelectorAll(".app-nav .app-nav__link").forEach((link) => {
    const matches = link.getAttribute("href")?.endsWith(destination) ?? false;

    if (matches) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}
