import { formatName, normalizeEmail } from "./utils.js";
import * as storage from "./storage.js";

const EMPTY_QUIZ_STATS = Object.freeze({
  answered: 0,
  correct: 0,
  bestStreak: 0,
  perfectQuizzes: 0,
});

/**
 * Creates a fresh, isolated progress record with only the first lesson unlocked.
 *
 * @returns {object} New progress state.
 */
export function emptyProgress() {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    studyDays: [],
    unlockedLessons: ["lesson-1"],
    completedLessons: [],
    currentLessonId: "lesson-1",
    lessonProgress: {},
    gamesPlayed: 0,
    quizStats: { ...EMPTY_QUIZ_STATS },
    songProgress: {},
    unlockedAchievements: {},
    studyMinutes: 0,
    firstAccessSeen: false,
  };
}

/**
 * Creates and persists a new local user without overwriting an existing email.
 *
 * @param {{name: string, email: string, passwordHash?: string, instrument?: string, level?: string, goals?: string[]}} data User profile input.
 * @returns {object | null} The created user copy, or null when invalid or unavailable.
 */
export function createUser(data) {
  try {
    if (!data || typeof data !== "object") {
      return null;
    }

    const email = normalizeEmail(data.email);
    const name = formatName(data.name);

    if (!email.includes("@") || !name) {
      return null;
    }

    const users = storage.getItem("users", {});

    if (!users || typeof users !== "object" || Array.isArray(users) || Object.hasOwn(users, email)) {
      return null;
    }

    const user = {
      name,
      email,
      passwordHash: typeof data.passwordHash === "string" ? data.passwordHash : null,
      createdAt: new Date().toISOString(),
      onboardingDone: false,
      instrument: typeof data.instrument === "string" ? data.instrument : null,
      level: typeof data.level === "string" ? data.level : null,
      goals: Array.isArray(data.goals) ? data.goals.filter((goal) => typeof goal === "string") : [],
      onboardingDraft: { step: 1, instrument: null, level: null, goals: [] },
      progress: emptyProgress(),
    };

    users[email] = user;

    if (!storage.setItem("users", users)) {
      return null;
    }

    return cloneUser(user);
  } catch {
    return null;
  }
}

/**
 * Retrieves a copy of a user by normalized email.
 *
 * @param {string} email Email address.
 * @returns {object | null} User copy, or null when not found.
 */
export function getUserByEmail(email) {
  try {
    const normalizedEmail = normalizeEmail(email);
    const users = storage.getItem("users", {});

    if (!normalizedEmail || !users || typeof users !== "object" || Array.isArray(users)) {
      return null;
    }

    return Object.hasOwn(users, normalizedEmail) ? cloneUser(users[normalizedEmail]) : null;
  } catch {
    return null;
  }
}

/**
 * Persists the given user under its normalized email.
 *
 * @param {object} user User record.
 * @returns {boolean} Whether the user was persisted.
 */
export function saveUser(user) {
  try {
    if (!user || typeof user !== "object") {
      return false;
    }

    const email = normalizeEmail(user.email);

    if (!email.includes("@") || email !== user.email) {
      return false;
    }

    const users = storage.getItem("users", {});

    if (!users || typeof users !== "object" || Array.isArray(users)) {
      return false;
    }

    const userCopy = cloneUser(user);

    if (!userCopy) {
      return false;
    }

    users[email] = userCopy;
    return storage.setItem("users", users);
  } catch {
    return false;
  }
}

/**
 * Removes a user record without changing the current session.
 *
 * @param {string} email User email.
 * @returns {boolean} Whether the user record was removed.
 */
export function removeUser(email) {
  try {
    const normalizedEmail = normalizeEmail(email);
    const users = storage.getItem("users", {});

    if (!normalizedEmail || !users || typeof users !== "object" || Array.isArray(users)) {
      return false;
    }

    if (!Object.hasOwn(users, normalizedEmail)) {
      return true;
    }

    delete users[normalizedEmail];
    return storage.setItem("users", users);
  } catch {
    return false;
  }
}

/**
 * Returns a copy of the active session user, if the session is valid.
 *
 * @returns {object | null} Current user copy, or null.
 */
export function getCurrentUser() {
  try {
    const email = storage.getItem("session", null);

    if (typeof email !== "string") {
      return null;
    }

    const user = getUserByEmail(email);

    if (!user) {
      clearSession();
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Stores the active session only when the corresponding user exists.
 *
 * @param {string} email User email.
 * @returns {boolean} Whether the session was established.
 */
export function setSession(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !getUserByEmail(normalizedEmail)) {
    return false;
  }

  return storage.setItem("session", normalizedEmail);
}

/**
 * Clears the active session while preserving all user records.
 *
 * @returns {boolean} Whether the session key was removed.
 */
export function clearSession() {
  return storage.removeItem("session");
}

/**
 * Indicates whether a valid current user exists.
 *
 * @returns {boolean} True when logged in.
 */
export function isLoggedIn() {
  return getCurrentUser() !== null;
}

/**
 * Applies an updater to a detached copy of the current user and persists it.
 *
 * @param {(user: object) => object | void} updaterFn Mutates the copy or returns a replacement.
 * @returns {object | null} Updated user copy, or null when update failed.
 */
export function updateCurrentUser(updaterFn) {
  try {
    const currentUser = getCurrentUser();

    if (!currentUser || typeof updaterFn !== "function") {
      return null;
    }

    const draft = cloneUser(currentUser);

    if (!draft) {
      return null;
    }

    const updatedUser = updaterFn(draft) ?? draft;
    updatedUser.email = currentUser.email;

    if (!saveUser(updatedUser)) {
      return null;
    }

    return cloneUser(updatedUser);
  } catch {
    return null;
  }
}

/**
 * Deep-clones a JSON-compatible user record.
 *
 * @param {object} user User record.
 * @returns {object | null} Detached clone, or null when cloning fails.
 */
function cloneUser(user) {
  try {
    return JSON.parse(JSON.stringify(user));
  } catch {
    return null;
  }
}
