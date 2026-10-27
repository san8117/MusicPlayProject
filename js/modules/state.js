import { ACHIEVEMENTS } from "../data/achievements.js";
import { INSTRUMENTS, ONBOARDING_GOALS, ONBOARDING_LEVELS } from "../data/instruments.js";
import { getLessonsForInstrument } from "../data/lessons.js";
import { SONGS } from "../data/songs.js";
import { getLevelInfo } from "../data/levels.js";
import { formatName, normalizeEmail, toNonNegativeNumber } from "./utils.js";
import * as storage from "./storage.js";

const SCHEMA_VERSION = 2;
const MAX_XP = 1_000_000_000;
const INSTRUMENT_IDS = new Set(INSTRUMENTS.map(({ id }) => id));
const NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u;
const GOAL_IDS = new Set(ONBOARDING_GOALS.map(({ id }) => id));
const LEVEL_IDS = new Set(ONBOARDING_LEVELS.map(({ id }) => id));
const ACHIEVEMENT_IDS = new Set(ACHIEVEMENTS.map(({ id }) => id));
const SONG_IDS = new Set(SONGS.map(({ id }) => id));
const EMPTY_QUIZ_STATS = Object.freeze({
  answered: 0,
  correct: 0,
  currentStreak: 0,
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
    instrumentProgressById: {},
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
    const name = sanitizeName(data.name);

    if (!isValidEmail(email) || !name) {
      return null;
    }

    const users = getUsers();

    if (Object.hasOwn(users, email)) {
      return null;
    }

    const instrument = INSTRUMENT_IDS.has(data.instrument) ? data.instrument : null;
    const user = {
      schemaVersion: SCHEMA_VERSION,
      name,
      email,
      passwordHash: isPasswordHash(data.passwordHash) ? data.passwordHash : null,
      createdAt: new Date().toISOString(),
      onboardingDone: false,
      instrument,
      level: LEVEL_IDS.has(data.level) ? data.level : null,
      goals: normalizeStringArray(data.goals, GOAL_IDS),
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
 * Retrieves a normalized copy of a user by normalized email.
 *
 * @param {string} email Email address.
 * @returns {object | null} User copy, or null when not found.
 */
export function getUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const users = getUsers();
  return normalizedEmail && Object.hasOwn(users, normalizedEmail)
    ? cloneUser(users[normalizedEmail])
    : null;
}

/**
 * Migrates a user record to the current schema and repairs incomplete fields.
 *
 * @param {object} user Stored user record.
 * @param {string} emailKey Normalized user email key.
 * @returns {object | null} Normalized user record, or null for unusable records.
 */
export function migrateUser(user, emailKey) {
  return normalizeUser(user, emailKey);
}

/**
 * Normalizes user identity, onboarding choices, and progress into safe values.
 *
 * @param {object} user Stored user record.
 * @param {string} emailKey Normalized user email key.
 * @returns {object | null} Normalized user record, or null for unusable records.
 */
export function normalizeUser(user, emailKey) {
  if (!user || typeof user !== "object" || Array.isArray(user)) {
    return null;
  }

  const email = normalizeEmail(typeof user.email === "string" ? user.email : emailKey);
  const name = sanitizeName(user.name);

  if (!isValidEmail(email) || !name) {
    return null;
  }

  const rawInstrument = typeof user.instrument === "string" ? user.instrument : null;
  const instrument = INSTRUMENT_IDS.has(rawInstrument) ? rawInstrument : null;
  const recoveryNotice = user.recoveryNotice === true
    || (user.onboardingDone === true && (!instrument || !LEVEL_IDS.has(user.level)));
  const level = LEVEL_IDS.has(user.level) ? user.level : null;
  const onboardingDone = user.onboardingDone === true && Boolean(instrument && level);
  const progress = normalizeProgress(user.progress, instrument ?? "guitar");
  const rawDraft = user.onboardingDraft && typeof user.onboardingDraft === "object"
    ? user.onboardingDraft
    : {};
  const draftInstrument = INSTRUMENT_IDS.has(rawDraft.instrument) ? rawDraft.instrument : instrument;
  const draftLevel = LEVEL_IDS.has(rawDraft.level) ? rawDraft.level : level;
  const draftGoals = normalizeStringArray(rawDraft.goals, GOAL_IDS);
  const draftStep = Math.min(3, Math.max(1, toInteger(rawDraft.step, 1)));

  return {
    schemaVersion: SCHEMA_VERSION,
    name,
    email,
    passwordHash: isPasswordHash(user.passwordHash) ? user.passwordHash : null,
    createdAt: isValidDateTime(user.createdAt) ? user.createdAt : new Date(0).toISOString(),
    onboardingDone,
    recoveryNotice,
    instrument,
    level,
    goals: normalizeStringArray(user.goals, GOAL_IDS),
    onboardingDraft: onboardingDone
      ? null
      : { step: draftStep, instrument: draftInstrument, level: draftLevel, goals: draftGoals },
    progress,
  };
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

    if (!isValidEmail(email)) {
      return false;
    }

    const userCopy = normalizeUser(user, email);

    if (!userCopy) {
      return false;
    }

    const users = getUsers();
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
    const users = getUsers();

    if (!normalizedEmail || !Object.hasOwn(users, normalizedEmail)) {
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
  const email = storage.getItem("session", null);

  if (typeof email !== "string") {
    return null;
  }

  const normalizedEmail = normalizeEmail(email);
  const user = getUserByEmail(normalizedEmail);

  if (!user) {
    clearSession();
  } else if (normalizedEmail !== email) {
    storage.setItem("session", normalizedEmail);
  }

  return user;
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
 * Applies an updater to the latest detached storage copy of the current user.
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

    return getUserByEmail(currentUser.email);
  } catch {
    return null;
  }
}

function getUsers() {
  const storedUsers = storage.getItem("users", {});

  if (!storedUsers || typeof storedUsers !== "object" || Array.isArray(storedUsers)) {
    return {};
  }

  const users = {};
  let changed = false;

  Object.entries(storedUsers).forEach(([key, value]) => {
    const email = normalizeEmail(typeof value?.email === "string" ? value.email : key);

    if (hasInvalidProgressShape(value?.progress)) {
      storage.backupCorruptValue(`progress:${email || key}`, JSON.stringify(value.progress));
    }

    const normalized = normalizeUser(value, email);

    if (!normalized || Object.hasOwn(users, email)) {
      if (value && typeof value === "object") {
        storage.backupCorruptValue(`user:${email || key}`, JSON.stringify(value));
      }
      changed = true;
      return;
    }

    users[email] = normalized;
    if (key !== email || JSON.stringify(value) !== JSON.stringify(normalized)) {
      changed = true;
    }
  });

  if (changed) {
    storage.setItem("users", users);
  }

  return users;
}

function normalizeProgress(value, activeInstrument) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const xp = Math.min(MAX_XP, toInteger(source.xp, 0));
  const instrumentProgressById = {};
  const rawByInstrument = source.instrumentProgressById
    && typeof source.instrumentProgressById === "object"
    && !Array.isArray(source.instrumentProgressById)
    ? source.instrumentProgressById
    : {};

  INSTRUMENT_IDS.forEach((instrumentId) => {
    const path = getLessonsForInstrument(instrumentId);
    const lessonIds = path.flatMap((module) => module.lessons.map((lesson) => lesson.id));
    const rawInstrumentProgress = rawByInstrument[instrumentId];
    const usesLegacy = instrumentId === "guitar" && !isRecord(rawInstrumentProgress);
    const instrumentSource = usesLegacy ? source : isRecord(rawInstrumentProgress) ? rawInstrumentProgress : {};
    const completed = normalizeCompletedLessons(instrumentSource.completedLessons, lessonIds);
    const lessonProgress = normalizeLessonProgress(instrumentSource.lessonProgress, lessonIds);
    const nextLesson = lessonIds.find((id) => !completed.includes(id)) ?? null;

    if (completed.length || Object.keys(lessonProgress).length || instrumentSource.currentLessonId) {
      instrumentProgressById[instrumentId] = {
        completedLessons: completed,
        lessonProgress,
        currentLessonId: nextLesson,
        unlockedLessons: nextLesson ? [...completed, nextLesson] : [...completed],
      };
    }
  });
  Object.entries(rawByInstrument).forEach(([instrumentId, rawInstrumentProgress]) => {
    if (
      INSTRUMENT_IDS.has(instrumentId)
      || !/^[a-z\d-]{1,64}$/u.test(instrumentId)
      || !isRecord(rawInstrumentProgress)
    ) {
      return;
    }

    instrumentProgressById[instrumentId] = normalizeOrphanedInstrumentProgress(rawInstrumentProgress);
  });

  const activeProgress = instrumentProgressById[activeInstrument] ?? {
    completedLessons: [],
    lessonProgress: {},
    currentLessonId: getLessonsForInstrument(activeInstrument)[0]?.lessons[0]?.id ?? null,
    unlockedLessons: [getLessonsForInstrument(activeInstrument)[0]?.lessons[0]?.id].filter(Boolean),
  };
  const studyDays = normalizeStudyDays(source.studyDays);
  const lastStudyDate = studyDays[studyDays.length - 1] ?? null;
  const quizStatsSource = isRecord(source.quizStats) ? source.quizStats : {};
  const unlockedAchievements = normalizeAchievements(source.unlockedAchievements);
  const songProgress = normalizeSongProgress(source.songProgress);
  const level = getLevelInfo(xp, activeInstrument).level;

  return {
    ...source,
    schemaVersion: SCHEMA_VERSION,
    xp,
    level,
    streak: calculateStoredStreak(studyDays),
    lastStudyDate,
    studyDays,
    instrumentProgressById,
    completedLessons: activeProgress.completedLessons,
    lessonProgress: activeProgress.lessonProgress,
    currentLessonId: activeProgress.currentLessonId,
    unlockedLessons: activeProgress.unlockedLessons,
    gamesPlayed: toInteger(source.gamesPlayed, 0),
    quizStats: {
      answered: toInteger(quizStatsSource.answered, 0),
      correct: Math.min(toInteger(quizStatsSource.answered, 0), toInteger(quizStatsSource.correct, 0)),
      currentStreak: toInteger(quizStatsSource.currentStreak, 0),
      bestStreak: Math.max(
        toInteger(quizStatsSource.bestStreak, 0),
        toInteger(quizStatsSource.currentStreak, 0),
      ),
      perfectQuizzes: toInteger(quizStatsSource.perfectQuizzes, 0),
    },
    songProgress,
    unlockedAchievements,
    notesPlayed: toInteger(source.notesPlayed, 0),
    chordsLearned: toInteger(source.chordsLearned, 0),
    studyMinutes: toInteger(source.studyMinutes, 0),
    firstAccessSeen: source.firstAccessSeen === true,
  };
}

function normalizeCompletedLessons(value, lessonIds) {
  if (!Array.isArray(value)) {
    return [];
  }

  const completed = new Set(value.filter((id) => typeof id === "string" && lessonIds.includes(id)));
  const ordered = [];

  for (const id of lessonIds) {
    if (!completed.has(id)) {
      break;
    }
    ordered.push(id);
  }

  return ordered;
}

function normalizeLessonProgress(value, lessonIds) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(Object.entries(value)
    .filter(([id]) => lessonIds.includes(id))
    .map(([id, amount]) => [id, Math.min(100, toInteger(amount, 0))]));
}

function normalizeOrphanedInstrumentProgress(value) {
  const completedLessons = Array.isArray(value.completedLessons)
    ? [...new Set(value.completedLessons.filter((id) => typeof id === "string" && id.length <= 120))].slice(0, 100)
    : [];
  const lessonProgress = isRecord(value.lessonProgress)
    ? Object.fromEntries(Object.entries(value.lessonProgress)
      .filter(([id]) => id.length <= 120)
      .slice(0, 100)
      .map(([id, amount]) => [id, Math.min(100, toInteger(amount, 0))]))
    : {};

  return {
    completedLessons,
    lessonProgress,
    currentLessonId: typeof value.currentLessonId === "string" && value.currentLessonId.length <= 120
      ? value.currentLessonId
      : null,
    unlockedLessons: Array.isArray(value.unlockedLessons)
      ? [...new Set(value.unlockedLessons.filter((id) => typeof id === "string" && id.length <= 120))].slice(0, 100)
      : [],
  };
}

function normalizeStudyDays(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const today = localDateKey(new Date());
  return [...new Set(value.filter((date) => isDateKey(date) && date <= today))]
    .sort()
    .slice(-3660);
}

function normalizeAchievements(value) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(Object.entries(value).filter(([id, date]) => (
    ACHIEVEMENT_IDS.has(id) && isDateKey(date) && date <= localDateKey(new Date())
  )));
}

function normalizeSongProgress(value) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(Object.entries(value)
    .filter(([id]) => SONG_IDS.has(id))
    .map(([id, entry]) => {
      const progress = typeof entry === "number"
        ? entry
        : isRecord(entry) ? entry.progress : 0;
      return [id, Math.min(100, toInteger(progress, 0))];
    }));
}

function calculateStoredStreak(studyDays) {
  if (studyDays.length === 0) {
    return 0;
  }

  const today = localDateKey(new Date());
  const todayNumber = dateNumber(today);
  const days = studyDays.map(dateNumber).filter((number) => todayNumber - number <= 1).sort((a, b) => b - a);

  if (!days.length) {
    return 0;
  }

  let count = 1;
  for (let index = 1; index < days.length && days[index] === days[index - 1] - 1; index += 1) {
    count += 1;
  }
  return count;
}

function sanitizeName(value) {
  if (typeof value !== "string") {
    return "";
  }

  const formattedName = formatName(value
    .replace(/[^\p{L}\p{M} '-]/gu, "")
    .replace(/\s+/gu, " "));
  const name = Array.from(formattedName).slice(0, 81).join("").trim();
  return NAME_PATTERN.test(name) && Array.from(name).filter((character) => /\p{L}/u.test(character)).length >= 2
    ? name
    : "";
}

function normalizeStringArray(value, allowedValues) {
  return Array.isArray(value)
    ? [...new Set(value.filter((entry) => typeof entry === "string" && allowedValues.has(entry)))]
    : [];
}

function toInteger(value, fallback = 0) {
  const numeric = typeof value === "string" && value.trim() ? Number(value) : value;
  return Number.isFinite(numeric) ? Math.min(MAX_XP, Math.max(0, Math.trunc(numeric))) : fallback;
}

function isPasswordHash(value) {
  return typeof value === "string" && /^[a-f\d]{64}$/iu.test(value);
}

function isValidEmail(email) {
  const [localPart, domain, extraPart] = email.split("@");

  if (
    !localPart
    || !domain
    || extraPart !== undefined
    || email.length > 254
    || localPart.length > 64
    || localPart.startsWith(".")
    || localPart.endsWith(".")
    || localPart.includes("..")
    || !/^[\p{L}\p{N}!#$%&'*+/=?^_`{|}~.-]+$/u.test(localPart)
  ) {
    return false;
  }

  const labels = domain.split(".");
  const topLevelDomain = labels[labels.length - 1];
  return labels.length >= 2
    && topLevelDomain.length >= 2
    && topLevelDomain.length <= 63
    && /^[\p{L}]+$/u.test(topLevelDomain)
    && labels.every((label) => (
      label.length >= 1
      && label.length <= 63
      && /^[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?$/u.test(label)
    ));
}

function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function hasInvalidProgressShape(progress) {
  if (!isRecord(progress)) {
    return progress !== undefined && progress !== null;
  }

  return (progress.studyDays !== undefined && !Array.isArray(progress.studyDays))
    || (progress.completedLessons !== undefined && !Array.isArray(progress.completedLessons))
    || (progress.unlockedLessons !== undefined && !Array.isArray(progress.unlockedLessons))
    || (progress.lessonProgress !== undefined && !isRecord(progress.lessonProgress))
    || (progress.instrumentProgressById !== undefined && !isRecord(progress.instrumentProgressById))
    || (progress.unlockedAchievements !== undefined && !isRecord(progress.unlockedAchievements))
    || (progress.songProgress !== undefined && !isRecord(progress.songProgress))
    || (progress.quizStats !== undefined && !isRecord(progress.quizStats));
}

function isValidDateTime(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateNumber(value) {
  const [year, month, day] = value.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
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
