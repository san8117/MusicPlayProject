import { clamp, toNonNegativeNumber } from "../modules/utils.js";

export const LEVELS = Object.freeze([
  Object.freeze({ level: 1, xpRequired: 0 }),
  Object.freeze({ level: 2, xpRequired: 100 }),
  Object.freeze({ level: 3, xpRequired: 250 }),
  Object.freeze({ level: 4, xpRequired: 450 }),
  Object.freeze({ level: 5, xpRequired: 700 }),
  Object.freeze({ level: 6, xpRequired: 1000 }),
]);

const INSTRUMENT_TITLES = Object.freeze({
  accordion: "Sanfoneiro",
  "cavaquinho": "Cavaquinista",
  drums: "Baterista",
  "electric-guitar": "Guitarrista",
  flute: "Flautista",
  guitar: "Violonista",
  keyboard: "Tecladista",
  piano: "Pianista",
  ukulele: "Ukulelista",
  violin: "Violinista",
});

/**
 * Returns the XP threshold for a level, extending the table by 300 XP per level.
 *
 * @param {number} level Target level, starting at 1.
 * @returns {number} Cumulative XP threshold.
 */
export function getXpThreshold(level) {
  const safeLevel = Math.max(1, Math.floor(toNonNegativeNumber(level)));
  const knownLevel = LEVELS.find((entry) => entry.level === safeLevel);

  if (knownLevel) {
    return knownLevel.xpRequired;
  }

  const lastEntry = LEVELS[LEVELS.length - 1];
  return lastEntry.xpRequired + (safeLevel - lastEntry.level) * 300;
}

/**
 * Returns a localized musician title for an instrument and numeric level.
 *
 * @param {string} instrumentId Instrument identifier.
 * @param {number} level Numeric XP level.
 * @returns {string} Instrument title with a proficiency tier.
 */
export function getLevelTitle(instrumentId, level) {
  const instrumentTitle = INSTRUMENT_TITLES[instrumentId] ?? "Músico";
  const safeLevel = Math.max(1, Math.floor(toNonNegativeNumber(level)));
  const proficiency = safeLevel <= 3 ? "Iniciante" : safeLevel <= 6 ? "Intermediário" : "Avançado";
  return `${instrumentTitle} ${proficiency}`;
}

/**
 * Resolves the numeric level and progress for cumulative XP.
 *
 * @param {number} totalXp Total earned XP.
 * @param {string} instrumentId Instrument identifier.
 * @returns {{level: number, title: string, totalXp: number, xpInLevel: number, xpForNextLevel: number, xpRemaining: number, percentage: number}}
 */
export function getLevelInfo(totalXp, instrumentId) {
  const safeXp = toNonNegativeNumber(totalXp);
  let level;

  if (safeXp >= LEVELS[LEVELS.length - 1].xpRequired) {
    const finalTableLevel = LEVELS[LEVELS.length - 1];
    level = finalTableLevel.level
      + Math.floor((safeXp - finalTableLevel.xpRequired) / 300);
  } else {
    level = 1;

    while (safeXp >= getXpThreshold(level + 1)) {
      level += 1;
    }
  }

  const xpAtLevel = getXpThreshold(level);
  const xpForNextLevel = getXpThreshold(level + 1);
  const levelRange = xpForNextLevel - xpAtLevel;
  const xpInLevel = safeXp - xpAtLevel;

  return {
    level,
    title: getLevelTitle(instrumentId, level),
    totalXp: safeXp,
    xpInLevel,
    xpForNextLevel,
    xpRemaining: xpForNextLevel - safeXp,
    percentage: clamp((xpInLevel / levelRange) * 100, 0, 100),
  };
}
