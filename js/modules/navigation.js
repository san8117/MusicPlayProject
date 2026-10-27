import { getPageRoute } from "./auth.js";
import { getCurrentUser } from "./state.js";
import { registerVisit } from "./streak.js";
import { initializeSessionSync } from "./session-sync.js";
import { todayKey } from "./utils.js";

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
let lastObservedDay = todayKey();
let dayCheckTimer = null;
let dayListenersInstalled = false;

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

  initializeSessionSync(page, user);
  initializeDayRollover();
  setActiveNavigation(page);
  registerVisit();
  return true;
}

function initializeDayRollover() {
  if (!dayListenersInstalled) {
    dayListenersInstalled = true;
    globalThis.addEventListener("pagehide", stopDayRollover);
    globalThis.addEventListener("pageshow", startDayRollover);
    document.addEventListener("visibilitychange", checkLocalDay);
  }

  startDayRollover();
}

function startDayRollover() {
  if (dayCheckTimer !== null) {
    return;
  }

  dayCheckTimer = globalThis.setInterval(checkLocalDay, 60_000);
  checkLocalDay();
}

function stopDayRollover() {
  globalThis.clearInterval(dayCheckTimer);
  dayCheckTimer = null;
}

function checkLocalDay() {
  if (document.visibilityState === "hidden") {
    return;
  }

  const currentDay = todayKey();

  if (currentDay === lastObservedDay) {
    return;
  }

  lastObservedDay = currentDay;
  registerVisit(currentDay);
  globalThis.dispatchEvent(new globalThis.CustomEvent("musicplay:local-day-changed"));
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
