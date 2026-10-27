import { ACHIEVEMENTS } from "../data/achievements.js";
import { getInstrumentLessonProgress, getLessonsForInstrument } from "../data/lessons.js";
import { getCurrentUser, updateCurrentUser } from "./state.js";
import { calculateStreak } from "./streak.js";
import { showToast } from "./toast.js";
import { todayKey, toNonNegativeNumber } from "./utils.js";

/**
 * Returns achievement definitions whose rules are met and which are not unlocked.
 *
 * @param {object} user Learner record to evaluate.
 * @param {{completedLessonId?: string, lessonDurationMinutes?: number}} [context] Optional activity details for event-based rules.
 * @returns {Array<object>} Newly eligible achievement definitions.
 */
export function checkAchievements(user, context = {}) {
  const unlocked = user?.progress?.unlockedAchievements ?? {};
  const evaluationContext = { ...context, today: context.today ?? todayKey() };

  return ACHIEVEMENTS.filter((achievement) => (
    !Object.hasOwn(unlocked, achievement.id)
    && evaluateAchievementRule(achievement.rule, user, evaluationContext)
  ));
}

/**
 * Evaluates one achievement rule without changing the learner record.
 *
 * @param {object} rule Achievement rule from the achievement data.
 * @param {object} user Learner record to evaluate.
 * @param {{completedLessonId?: string, lessonDurationMinutes?: number}} [context] Optional activity details for event-based rules.
 * @returns {boolean} Whether the rule is satisfied.
 */
export function evaluateAchievementRule(rule, user, context = {}) {
  if (!rule || typeof rule.type !== "string" || !user || typeof user !== "object") {
    return false;
  }

  const progress = user.progress && typeof user.progress === "object" ? user.progress : {};
  const completedLessons = getInstrumentLessonProgress(progress, user.instrument).completedLessons;
  const quizStats = progress.quizStats && typeof progress.quizStats === "object" ? progress.quizStats : {};
  const required = toNonNegativeNumber(rule.value);

  switch (rule.type) {
    case "lessonsCompleted":
      return completedLessons.length >= required;
    case "streakDays":
      return calculateStreak(progress.studyDays, context.today) >= required;
    case "totalXp":
      return toNonNegativeNumber(progress.xp) >= required;
    case "quizPerfect":
      return toNonNegativeNumber(quizStats.perfectQuizzes) >= 1;
    case "correctStreak":
      return Math.max(
        toNonNegativeNumber(quizStats.bestStreak),
        toNonNegativeNumber(quizStats.currentStreak),
      ) >= required;
    case "questionsAnswered":
      return toNonNegativeNumber(quizStats.answered) >= required;
    case "songsCompleted":
      return countCompletedSongs(progress.songProgress) >= required;
    case "moduleCompleted":
      return isModuleCompleted(user.instrument, completedLessons, required);
    case "notesPlayed":
      return toNonNegativeNumber(progress.notesPlayed) >= required
        || (required <= 1 && hasCompletedMilestone(user.instrument, completedLessons, "first-note"));
    case "chordsLearned":
      return toNonNegativeNumber(progress.chordsLearned) >= required
        || (required <= 1 && hasCompletedMilestone(user.instrument, completedLessons, "first-chord"));
    case "lessonCompletedUnderMinutes":
      return context.completedLessonId !== undefined
        && completedLessons.includes(context.completedLessonId)
        && Number.isFinite(context.lessonDurationMinutes)
        && context.lessonDurationMinutes >= 0
        && context.lessonDurationMinutes <= required;
    default:
      return false;
  }
}

/**
 * Persists newly eligible achievements once and queues accessible toasts.
 *
 * @param {{completedLessonId?: string, lessonDurationMinutes?: number}} [context] Optional activity details for event-based rules.
 * @returns {Array<object>} Newly unlocked achievement definitions with local unlock dates.
 */
export function unlockAchievements(context = {}) {
  if (!getCurrentUser()) {
    return [];
  }

  let newlyUnlocked = [];
  const unlockDate = todayKey();
  const updatedUser = updateCurrentUser((user) => {
    const progress = user.progress && typeof user.progress === "object" ? user.progress : {};
    const unlocked = progress.unlockedAchievements
      && typeof progress.unlockedAchievements === "object"
      && !Array.isArray(progress.unlockedAchievements)
      ? progress.unlockedAchievements
      : {};

    newlyUnlocked = checkAchievements(
      { ...user, progress: { ...progress, unlockedAchievements: unlocked } },
      { ...context, today: unlockDate },
    );

    if (newlyUnlocked.length > 0) {
      user.progress = {
        ...progress,
        unlockedAchievements: {
          ...unlocked,
          ...Object.fromEntries(newlyUnlocked.map((achievement) => [achievement.id, unlockDate])),
        },
      };
    }
  });

  if (!updatedUser) {
    showToast("Não conseguimos salvar suas conquistas agora. Tente novamente.", { type: "info" });
    return [];
  }

  newlyUnlocked = newlyUnlocked.map((achievement) => ({ ...achievement, unlockedAt: unlockDate }));
  newlyUnlocked.forEach((achievement, index) => {
    globalThis.setTimeout(() => {
      showToast(`Nova conquista: ${achievement.title} 🏆`, { type: "achievement" });
    }, 350 + index * 450);
  });

  return newlyUnlocked;
}

function countCompletedSongs(songProgress) {
  if (!songProgress || typeof songProgress !== "object" || Array.isArray(songProgress)) {
    return 0;
  }

  return Object.values(songProgress).filter((value) => {
    if (typeof value === "number") {
      return value >= 100;
    }

    return Boolean(
      value
      && typeof value === "object"
      && (value.completed === true || toNonNegativeNumber(value.progress) >= 100),
    );
  }).length;
}

function isModuleCompleted(instrumentId, completedLessons, moduleNumber) {
  const module = getLessonsForInstrument(instrumentId)
    .find((entry) => entry.number === moduleNumber);

  return Boolean(module?.lessons.length)
    && module.lessons.every((lesson) => completedLessons.includes(lesson.id));
}

function hasCompletedMilestone(instrumentId, completedLessons, milestone) {
  const completedIds = new Set(completedLessons);
  return getLessonsForInstrument(instrumentId)
    .flatMap((module) => module.lessons)
    .some((lesson) => completedIds.has(lesson.id) && lesson.milestones.includes(milestone));
}
