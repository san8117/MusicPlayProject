import { getCurrentUser, updateCurrentUser } from "./state.js";
import { todayKey } from "./utils.js";

/**
 * Calculates the active streak from a list of study dates without mutating it.
 *
 * @param {string[]} studyDays Dates in YYYY-MM-DD format.
 * @param {string} today Current local date in YYYY-MM-DD format.
 * @returns {number} Consecutive study days ending today or yesterday.
 */
export function calculateStreak(studyDays, today) {
  if (!Array.isArray(studyDays) || !isDateKey(today)) {
    return 0;
  }

  const todayNumber = toDayNumber(today);
  const dayNumbers = [...new Set(studyDays.filter(isDateKey).map(toDayNumber))]
    .filter((dayNumber) => dayNumber <= todayNumber)
    .sort((a, b) => b - a);
  const latestDay = dayNumbers[0];

  if (latestDay === undefined || todayNumber - latestDay > 1) {
    return 0;
  }

  let streak = 1;
  let expectedDay = latestDay - 1;

  for (const dayNumber of dayNumbers.slice(1)) {
    if (dayNumber !== expectedDay) {
      break;
    }

    streak += 1;
    expectedDay -= 1;
  }

  return streak;
}

/**
 * Returns the active streak for a progress object and a supplied local date.
 *
 * @param {object} progress User progress.
 * @param {string} today Current local date in YYYY-MM-DD format.
 * @returns {number} Current streak, or zero when it has expired.
 */
export function getCurrentStreak(progress, today = todayKey()) {
  return calculateStreak(progress?.studyDays, today);
}

/**
 * Reconciles the displayed streak on an app visit without recording a study day.
 *
 * @param {string} [today] Current local date for deterministic tests.
 * @returns {object | null} Updated user copy, or null when no user is active.
 */
export function registerVisit(today = todayKey()) {
  if (!getCurrentUser()) {
    return null;
  }

  return updateCurrentUser((user) => {
    user.progress.streak = getCurrentStreak(user.progress, today);
  });
}

/**
 * Records an explicit study action once per local date and updates the streak.
 *
 * @param {string} [studyDate] Local date for the study action.
 * @returns {object | null} Updated user copy, or null when no user is active.
 */
export function registerStudy(studyDate = todayKey()) {
  if (!isDateKey(studyDate) || !getCurrentUser()) {
    return null;
  }

  return updateCurrentUser((user) => {
    const studyDays = Array.isArray(user.progress.studyDays) ? user.progress.studyDays : [];

    if (!studyDays.includes(studyDate)) {
      studyDays.push(studyDate);
      studyDays.sort();
    }

    user.progress.studyDays = studyDays;
    user.progress.lastStudyDate = studyDays[studyDays.length - 1] ?? null;
    user.progress.streak = getCurrentStreak(user.progress, studyDate);
  });
}

function isDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function toDayNumber(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}
