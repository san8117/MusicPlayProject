import { getPageRoute } from "./auth.js";
import { getCurrentUser } from "./state.js";

const ROOT_KEY = "musicplay:v1";
const SESSION_KEY = "musicplay:session";
let listenersInstalled = false;
let initialSession = null;

/**
 * Keeps a restored or cross-tab page aligned with the latest signed-in user.
 *
 * @param {string} page Current page identifier.
 * @param {object} user User copy that passed the initial route check.
 * @returns {void}
 */
export function initializeSessionSync(page, user) {
  if (!user || listenersInstalled) {
    return;
  }

  initialSession = {
    email: user.email,
    onboardingDone: user.onboardingDone,
    instrument: user.instrument,
  };
  listenersInstalled = true;

  globalThis.addEventListener("storage", (event) => {
    if (event.key === SESSION_KEY || event.key === ROOT_KEY) {
      verifyCurrentSession(page);
    }
  });
  globalThis.addEventListener("pageshow", () => verifyCurrentSession(page));
}

function verifyCurrentSession(page) {
  const user = getCurrentUser();

  if (!user) {
    globalThis.location.assign(getPageRoute("login.html"));
    return;
  }

  if (user.email !== initialSession.email) {
    globalThis.location.reload();
    return;
  }

  if (user.onboardingDone !== initialSession.onboardingDone || user.instrument !== initialSession.instrument) {
    globalThis.location.reload();
    return;
  }

  if (page === "onboarding" && user.onboardingDone) {
    globalThis.location.assign(getPageRoute("dashboard.html"));
  } else if (page !== "onboarding" && !user.onboardingDone) {
    globalThis.location.assign(getPageRoute("onboarding.html"));
  }
}
