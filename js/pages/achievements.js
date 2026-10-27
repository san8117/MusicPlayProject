import { ACHIEVEMENTS } from "../data/achievements.js";
import { getCurrentUser } from "../modules/state.js";

/**
 * Renders unlocked and locked achievements from the active learner's progress.
 *
 * @param {Document} root Achievements page document.
 * @returns {void}
 */
export function initializeAchievementsPage(root = document) {
  const unlockedList = root.querySelector("[data-achievements-unlocked]");
  const lockedList = root.querySelector("[data-achievements-locked]");
  const emptyState = root.querySelector("[data-achievements-empty]");

  if (!unlockedList || !lockedList) {
    return;
  }

  const user = getCurrentUser();
  const unlocked = user?.progress?.unlockedAchievements ?? {};
  const cards = new Map(
    [...root.querySelectorAll("[data-achievement-id]")]
      .map((card) => [card.dataset.achievementId, card]),
  );
  const unlockedAchievements = [];
  const lockedAchievements = [];

  ACHIEVEMENTS.forEach((achievement) => {
    const card = cards.get(achievement.id);

    if (!card) {
      return;
    }

    const unlockDate = unlocked[achievement.id];
    const isUnlocked = typeof unlockDate === "string" && isDateKey(unlockDate);
    const status = card.querySelector(".achievement-card__status");
    const lockIcon = card.querySelector(".achievement-card__lock");
    const dateElement = card.querySelector("[data-achievement-date]");

    card.dataset.state = isUnlocked ? "unlocked" : "locked";
    card.classList.toggle("achievement-card--unlocked", isUnlocked);
    card.classList.toggle("achievement-card--locked", !isUnlocked);

    if (status) {
      status.textContent = isUnlocked ? "Desbloqueada" : "Bloqueada";
    }

    if (lockIcon) {
      lockIcon.hidden = false;
      lockIcon.setAttribute("aria-label", isUnlocked ? "Desbloqueada" : "Bloqueada");
      lockIcon.textContent = isUnlocked ? "✓" : "🔒";
    }

    if (dateElement) {
      dateElement.hidden = !isUnlocked;

      if (isUnlocked) {
        dateElement.dateTime = unlockDate;
        dateElement.textContent = formatUnlockDate(unlockDate);
      } else {
        dateElement.removeAttribute("datetime");
        dateElement.textContent = "";
      }
    }

    (isUnlocked ? unlockedAchievements : lockedAchievements).push({ card, unlockDate });
  });

  unlockedAchievements
    .sort((left, right) => right.unlockDate.localeCompare(left.unlockDate))
    .forEach(({ card }) => unlockedList.append(card));
  lockedAchievements.forEach(({ card }) => lockedList.append(card));

  const unlockedCount = unlockedAchievements.length;
  const lockedCount = lockedAchievements.length;
  const unlockedCountElement = root.querySelector("[data-achievements-unlocked-count]");
  const lockedCountElement = root.querySelector("[data-achievements-locked-count]");
  const totalCountElement = root.querySelector('[data-user="achievements-count"]');
  const progressBar = root.querySelector("[data-achievements-progress]");

  if (unlockedCountElement) {
    unlockedCountElement.textContent = String(unlockedCount);
  }

  if (lockedCountElement) {
    lockedCountElement.textContent = String(lockedCount);
  }

  if (totalCountElement) {
    totalCountElement.textContent = String(unlockedCount);
  }

  if (progressBar) {
    progressBar.max = ACHIEVEMENTS.length;
    progressBar.value = unlockedCount;
    progressBar.setAttribute("aria-valuenow", String(unlockedCount));
    progressBar.setAttribute("aria-valuemax", String(ACHIEVEMENTS.length));
    progressBar.setAttribute(
      "aria-label",
      `Progresso das conquistas: ${unlockedCount} de ${ACHIEVEMENTS.length} desbloqueadas`,
    );
    progressBar.textContent = `${unlockedCount} de ${ACHIEVEMENTS.length} conquistas`;
  }

  if (emptyState) {
    emptyState.hidden = unlockedCount > 0;
  }
}

function formatUnlockDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const parts = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" })
    .formatToParts(date);
  const dayPart = parts.find((part) => part.type === "day")?.value;
  const monthPart = parts.find((part) => part.type === "month")?.value.replace(/\./gu, "");
  return `${dayPart}/${monthPart}`;
}

function isDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
