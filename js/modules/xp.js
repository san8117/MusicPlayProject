import { getLevelInfo } from "../data/levels.js";
import { toNonNegativeNumber } from "./utils.js";

/**
 * Adds XP immutably and reports whether the numeric level increased.
 *
 * @param {object} progress Existing progress state.
 * @param {number} amount XP amount to add; negative values are treated as zero.
 * @returns {{progress: object, leveledUp: boolean, previousLevel: number, level: number}}
 */
export function addXp(progress, amount) {
  const safeProgress = progress && typeof progress === "object" ? progress : {};
  const previousXp = toNonNegativeNumber(safeProgress.xp);
  const nextXp = previousXp + toNonNegativeNumber(amount);
  const previousLevel = getLevelInfo(previousXp, safeProgress.instrumentId).level;
  const level = getLevelInfo(nextXp, safeProgress.instrumentId).level;

  return {
    progress: { ...safeProgress, xp: nextXp, level },
    leveledUp: level > previousLevel,
    previousLevel,
    level,
  };
}

export { getLevelInfo };
