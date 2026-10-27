import { getCurrentUser } from "../modules/state.js";
import { getCurrentStreak } from "../modules/streak.js";
import { toNonNegativeNumber } from "../modules/utils.js";

/**
 * Populates profile statistics from the active learner's isolated progress.
 *
 * @param {Document} root Profile document.
 * @returns {void}
 */
export function initializeProfile(root = document) {
  const user = getCurrentUser();

  if (!user) {
    return;
  }

  const progress = user.progress ?? {};
  const quizStats = progress.quizStats ?? {};
  const answered = toNonNegativeNumber(quizStats.answered);
  const correct = toNonNegativeNumber(quizStats.correct);
  const stats = {
    lessons: countCompleted(progress.completedLessons),
    songs: countCompletedSongs(progress.songProgress),
    games: String(toNonNegativeNumber(progress.gamesPlayed)),
    accuracy: String(answered > 0 ? Math.min(100, Math.round((correct / answered) * 100)) : 0),
    streak: String(getCurrentStreak(progress)),
    xp: String(toNonNegativeNumber(progress.xp)),
    achievements: String(Object.keys(progress.unlockedAchievements ?? {}).length),
    "study-time": formatStudyTime(progress.studyMinutes),
  };

  root.querySelectorAll("[data-stat]").forEach((element) => {
    const value = stats[element.dataset.stat];

    if (value !== undefined) {
      element.textContent = value;
    }
  });

  const studyTimeUnit = root.querySelector('[data-stat="study-time"]')
    ?.parentElement.querySelector(".profile-stat-card__unit");

  if (studyTimeUnit) {
    studyTimeUnit.textContent = "min";
  }
}

function countCompleted(values) {
  return Array.isArray(values) ? String(values.length) : "0";
}

function countCompletedSongs(songProgress) {
  if (!songProgress || typeof songProgress !== "object") {
    return "0";
  }

  return String(Object.values(songProgress).filter((value) => {
    if (value === true) {
      return true;
    }

    if (typeof value === "number") {
      return value >= 100;
    }

    return Boolean(value && typeof value === "object" && (value.completed === true || value.progress >= 100));
  }).length);
}

function formatStudyTime(value) {
  const minutes = Math.floor(toNonNegativeNumber(value));

  if (minutes < 60) {
    return String(minutes);
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}`;
}
