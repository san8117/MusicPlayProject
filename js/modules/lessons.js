import { getLessonsForInstrument, LESSONS_BY_INSTRUMENT } from "../data/lessons.js";
import { addXp } from "./xp.js";
import { getCurrentUser, updateCurrentUser } from "./state.js";
import { registerStudy } from "./streak.js";
import { clamp, toNonNegativeNumber } from "./utils.js";
import { unlockAchievements } from "./achievements.js";

const LESSON_LOCKED_MESSAGE = "Conclua a aula anterior para liberar esta 🔒";
const DEFAULT_INSTRUMENT_ID = "guitar";
const lessonSessionStartTimes = new Map();

/**
 * Starts an in-memory timing session for the selected lesson.
 *
 * @param {string} lessonId Lesson identifier.
 * @returns {boolean} Whether the lesson exists and its timing started.
 */
export function startLessonSession(lessonId) {
  if (!getLessonById(lessonId)) {
    return false;
  }

  lessonSessionStartTimes.set(lessonId, Date.now());
  return true;
}

/**
 * Returns sequential lesson and module states for an instrument's authored path.
 *
 * @param {object} progress Learner progress data.
 * @param {string} [instrumentId] Instrument identifier; falls back to progress.instrumentId.
 * @returns {{modules: Array<object>, lessons: Array<object>}} Ordered module and lesson states.
 */
export function getLessonStates(progress = {}, instrumentId = progress?.instrumentId ?? DEFAULT_INSTRUMENT_ID) {
  const safeProgress = progress && typeof progress === "object" ? progress : {};
  const modules = getLessonsForInstrument(instrumentId);
  const completedIds = new Set(Array.isArray(safeProgress.completedLessons) ? safeProgress.completedLessons : []);
  const lessonStates = [];
  const moduleStates = [];
  let nextLessonAvailable = true;

  modules.forEach((module) => {
    const moduleUnlocked = nextLessonAvailable;
    const moduleLessons = [];

    module.lessons.forEach((lesson) => {
      let state = "locked";

      if (completedIds.has(lesson.id)) {
        state = "completed";
      } else if (nextLessonAvailable) {
        state = "current";
        nextLessonAvailable = false;
      }

      const lessonState = { ...lesson, moduleId: module.id, moduleNumber: module.number, state };
      moduleLessons.push(lessonState);
      lessonStates.push(lessonState);
    });

    const completedCount = moduleLessons.filter((lesson) => lesson.state === "completed").length;
    const isComplete = moduleLessons.length > 0 && completedCount === moduleLessons.length;
    moduleStates.push({
      ...module,
      unlocked: moduleUnlocked,
      state: moduleUnlocked ? "unlocked" : "locked",
      completed: isComplete,
      completedCount,
      totalLessons: moduleLessons.length,
      lessons: moduleLessons,
    });
  });

  return { modules: moduleStates, lessons: lessonStates };
}

/**
 * Returns the currently available next lesson.
 *
 * @param {object} progress Learner progress.
 * @param {string} [instrumentId] Instrument identifier.
 * @returns {object | null} Current lesson with module metadata, or null when the path is finished.
 */
export function getNextLesson(progress = {}, instrumentId = progress?.instrumentId ?? DEFAULT_INSTRUMENT_ID) {
  return getLessonStates(progress, instrumentId).lessons.find((lesson) => lesson.state === "current") ?? null;
}

/**
 * Finds a lesson by identifier across authored instrument paths.
 *
 * @param {string} id Lesson identifier.
 * @returns {(object & {moduleId: string, moduleNumber: number}) | null} Lesson and module metadata.
 */
export function getLessonById(id) {
  if (typeof id !== "string" || !id) {
    return null;
  }

  for (const [instrumentId, modules] of Object.entries(getLessonCatalog())) {
    for (const module of modules) {
      const lesson = module.lessons.find((entry) => entry.id === id);

      if (lesson) {
        return { ...lesson, moduleId: module.id, moduleNumber: module.number, instrumentId };
      }
    }
  }

  return null;
}

/**
 * Returns completion counts and percentages for every authored module.
 *
 * @param {object} progress Learner progress.
 * @param {string} [instrumentId] Instrument identifier.
 * @returns {Array<object>} Module state and completion statistics.
 */
export function getModuleProgress(progress = {}, instrumentId = progress?.instrumentId ?? DEFAULT_INSTRUMENT_ID) {
  return getLessonStates(progress, instrumentId).modules.map((module) => ({
    id: module.id,
    number: module.number,
    title: module.title,
    unlocked: module.unlocked,
    state: module.state,
    completed: module.completed,
    completedCount: module.completedCount,
    totalLessons: module.totalLessons,
    percentage: module.totalLessons
      ? Math.round((module.completedCount / module.totalLessons) * 100)
      : 0,
  }));
}

/**
 * Completes an unlocked lesson once, awards its XP, and records the study day.
 *
 * @param {string} lessonId Lesson identifier.
 * @returns {{ok: boolean, reason?: string, xpGained: number, leveledUp: boolean, newLevel: number, unlockedAchievements: Array, nextLessonId?: string | null, alreadyCompleted?: boolean}}
 */
export function completeLesson(lessonId) {
  const user = getCurrentUser();
  const lesson = getLessonById(lessonId);

  if (!user || !lesson || lesson.instrumentId !== user.instrument) {
    return failure("unavailable");
  }

  const currentProgress = user.progress && typeof user.progress === "object" ? user.progress : {};
  const state = getLessonStates(currentProgress, user.instrument).lessons
    .find((entry) => entry.id === lessonId)?.state;

  if (state === "completed") {
    return {
      ok: true,
      alreadyCompleted: true,
      xpGained: 0,
      leveledUp: false,
      newLevel: toNonNegativeNumber(currentProgress.level) || 1,
      unlockedAchievements: [],
      nextLessonId: getNextLesson(currentProgress, user.instrument)?.id ?? null,
    };
  }

  if (state !== "current") {
    return failure("locked");
  }

  const completedLessons = Array.isArray(currentProgress.completedLessons) ? currentProgress.completedLessons : [];
  const oldLessonProgress = currentProgress.lessonProgress
    && typeof currentProgress.lessonProgress === "object"
    && !Array.isArray(currentProgress.lessonProgress)
    ? currentProgress.lessonProgress
    : {};
  const xpResult = addXp({ ...currentProgress, instrumentId: user.instrument }, lesson.xp);
  const nextProgress = {
    ...currentProgress,
    xp: xpResult.progress.xp,
    level: xpResult.progress.level,
    completedLessons: [...new Set([...completedLessons, lessonId])],
  };
  const nextLesson = getNextLesson(nextProgress, user.instrument);
  nextProgress.currentLessonId = nextLesson?.id ?? null;
  nextProgress.lessonProgress = { ...oldLessonProgress, [lessonId]: 100 };
  nextProgress.studyMinutes = toNonNegativeNumber(nextProgress.studyMinutes) + lesson.minutes;
  nextProgress.unlockedLessons = [...new Set([
    ...(Array.isArray(nextProgress.unlockedLessons) ? nextProgress.unlockedLessons : []),
    ...(nextLesson ? [nextLesson.id] : []),
  ])];

  const updatedUser = updateCurrentUser((currentUser) => {
    if (currentUser.email !== user.email || currentUser.instrument !== user.instrument) {
      return currentUser;
    }

    currentUser.progress = nextProgress;
  });

  if (!updatedUser || !updatedUser.progress.completedLessons.includes(lessonId)) {
    return failure("storage");
  }

  const studyUpdate = registerStudy();
  const startedAt = lessonSessionStartTimes.get(lessonId);
  lessonSessionStartTimes.delete(lessonId);
  const lessonDurationMinutes = Number.isFinite(startedAt)
    ? Math.max(0, (Date.now() - startedAt) / 60_000)
    : null;
  const unlockedAchievements = unlockAchievements({
    completedLessonId: lessonId,
    lessonDurationMinutes,
  });

  return {
    ok: true,
    xpGained: lesson.xp,
    leveledUp: xpResult.leveledUp,
    newLevel: xpResult.level,
    unlockedAchievements,
    nextLessonId: nextLesson?.id ?? null,
    studyRecorded: Boolean(studyUpdate),
  };
}

/**
 * Saves lesson completion percentage without allowing progress to move backward.
 *
 * @param {string} lessonId Lesson identifier.
 * @param {number} percentage Progress from 0 to 100.
 * @returns {object | null} Updated user copy, or null when save failed or lesson is locked.
 */
export function saveLessonProgress(lessonId, percentage) {
  if (!Number.isFinite(percentage)) {
    return null;
  }

  const user = getCurrentUser();
  const lesson = getLessonById(lessonId);

  if (!user || !lesson || lesson.instrumentId !== user.instrument) {
    return null;
  }

  const currentProgress = user.progress && typeof user.progress === "object" ? user.progress : {};
  const state = getLessonStates(currentProgress, user.instrument).lessons
    .find((entry) => entry.id === lessonId)?.state;

  if (state !== "current" && state !== "completed") {
    return null;
  }

  const nextPercentage = clamp(percentage, 0, 100);
  return updateCurrentUser((currentUser) => {
    currentUser.progress ??= {};
    const lessonProgress = currentUser.progress.lessonProgress
      && typeof currentUser.progress.lessonProgress === "object"
      && !Array.isArray(currentUser.progress.lessonProgress)
      ? currentUser.progress.lessonProgress
      : {};
    const previous = toNonNegativeNumber(lessonProgress[lessonId]);
    currentUser.progress.lessonProgress = {
      ...lessonProgress,
      [lessonId]: Math.max(previous, nextPercentage),
    };
  });
}

/**
 * Returns the human-readable locked-lesson feedback.
 *
 * @returns {string} Locked lesson message.
 */
export function getLockedLessonMessage() {
  return LESSON_LOCKED_MESSAGE;
}

function getLessonCatalog() {
  return LESSONS_BY_INSTRUMENT;
}

function failure(reason) {
  return {
    ok: false,
    reason,
    xpGained: 0,
    leveledUp: false,
    newLevel: 1,
    unlockedAchievements: [],
  };
}
