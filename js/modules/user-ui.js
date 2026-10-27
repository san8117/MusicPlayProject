import { INSTRUMENTS } from "../data/instruments.js";
import { getLevelInfo } from "../data/levels.js";
import { getLessonsForInstrument } from "../data/lessons.js";
import { getCurrentUser, updateCurrentUser } from "./state.js";
import { getCurrentStreak } from "./streak.js";
import { getFirstName, getInitial, toNonNegativeNumber } from "./utils.js";

const INSTRUMENT_JOURNEYS = Object.freeze({
  accordion: "da sanfona / acordeão",
  cavaquinho: "do cavaquinho",
  drums: "da bateria",
  "electric-guitar": "da guitarra",
  flute: "da flauta",
  guitar: "do violão",
  keyboard: "do teclado",
  piano: "do piano",
  ukulele: "do ukulele",
  violin: "do violino",
});

/**
 * Populates the current page's user markers with the active learner's data.
 *
 * @param {Document} root Page document.
 * @returns {object | null} The current user copy, or null when no session exists.
 */
export function populateUserUI(root = document) {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  const progress = user.progress ?? {};
  const xp = toNonNegativeNumber(progress.xp);
  const levelInfo = getLevelInfo(xp, user.instrument);
  const firstName = getFirstName(user.name);
  const instrument = INSTRUMENTS.find((entry) => entry.id === user.instrument);
  const modules = getLessonsForInstrument(user.instrument);
  const availableLessons = instrument?.availableLessons ?? countLessons(modules);
  const completedLessons = Array.isArray(progress.completedLessons) ? progress.completedLessons.length : 0;
  const streak = getCurrentStreak(progress);
  const achievementCount = Object.keys(progress.unlockedAchievements ?? {}).length;
  const values = {
    "achievements-count": String(achievementCount),
    email: user.email ?? "",
    "first-name": firstName,
    "full-name": user.name ?? "",
    initial: getInitial(user.name),
    "instrument-journey": instrument
      ? `Siga a jornada progressiva ${INSTRUMENT_JOURNEYS[instrument.id] ?? `do ${instrument.name.toLocaleLowerCase("pt-BR")}`}`
      : "Siga sua jornada musical progressiva",
    "lessons-progress": availableLessons
      ? `${completedLessons} / ${availableLessons} aulas`
      : `${completedLessons} aulas concluídas`,
    level: `Nível ${levelInfo.level}`,
    "level-title": `${levelInfo.title} — Nível ${levelInfo.level}`,
    xp: String(xp),
    streak: String(streak),
  };

  root.querySelectorAll("[data-user]").forEach((element) => {
    const value = values[element.dataset.user];

    if (value !== undefined) {
      element.textContent = value;
    }
  });

  renderLevelProgress(root, levelInfo);

  if (root.body?.dataset.page === "dashboard") {
    renderGreeting(root, user, firstName);
  }

  return user;
}

function renderLevelProgress(root, levelInfo) {
  const xpRequired = getXpRequiredForLevel(levelInfo);
  root.querySelectorAll("[data-user-level-xp]").forEach((element) => {
    element.textContent = `${levelInfo.xpInLevel} / ${xpRequired} XP`;
  });

  const nextLevelLabel = `${levelInfo.xpRemaining} XP para o Nível ${levelInfo.level + 1}`;
  root.querySelectorAll("[data-user-xp-to-next-level]").forEach((element) => {
    element.textContent = String(levelInfo.xpRemaining);
  });
  root.querySelectorAll(".profile-level-card__next-level").forEach((element) => {
    element.textContent = nextLevelLabel;
  });

  root.querySelectorAll("[data-level-progress]").forEach((progress) => {
    progress.max = xpRequired;
    progress.value = levelInfo.xpInLevel;
    progress.setAttribute("aria-valuenow", String(levelInfo.xpInLevel));
    progress.setAttribute("aria-valuemax", String(xpRequired));
    progress.setAttribute("aria-valuetext", `${levelInfo.xpInLevel} de ${xpRequired} XP`);
    progress.setAttribute("aria-label", `Progresso até o Nível ${levelInfo.level + 1}`);
    progress.textContent = `${levelInfo.xpInLevel} de ${xpRequired} XP`;
  });

  root.querySelectorAll(".level-card__progress-labels > span").forEach((element, index) => {
    if (index === 1) {
      element.textContent = nextLevelLabel;
    }
  });
}

function getXpRequiredForLevel(levelInfo) {
  return Math.max(1, Math.round(levelInfo.xpInLevel + levelInfo.xpRemaining));
}

function renderGreeting(root, user, firstName) {
  const greeting = root.querySelector("[data-user-greeting]");

  if (!greeting) {
    return;
  }

  const firstAccessSeen = user.progress?.firstAccessSeen ?? user.firstAccessSeen ?? false;
  greeting.textContent = firstAccessSeen ? "Bem-vindo de volta" : `Bem-vindo, ${firstName}!`;

  if (!firstAccessSeen) {
    updateCurrentUser((currentUser) => {
      currentUser.progress.firstAccessSeen = true;
      delete currentUser.firstAccessSeen;
    });
  }

  if (firstName) {
    root.title = `${firstName} | MUSICPLAY`;
  }
}

function countLessons(modules) {
  return modules.reduce((total, module) => total + module.lessons.length, 0);
}
