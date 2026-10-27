import { SONG_PRACTICE_REWARD } from "../data/songs.js";
import { getCurrentUser, updateCurrentUser } from "../modules/state.js";
import { registerStudy } from "../modules/streak.js";
import { showToast } from "../modules/toast.js";
import { addXp } from "../modules/xp.js";
import { toNonNegativeNumber } from "../modules/utils.js";
import { unlockAchievements } from "../modules/achievements.js";

const SONG_FILTERS = new Set(["all", "beginner", "intermediate", "advanced"]);

/**
 * Initializes song filters, practice actions, and progress indicators.
 *
 * @param {Document} root Songs page document.
 * @returns {void}
 */
export function initializeSongsPage(root = document) {
  const page = root.querySelector(".songs-page");
  const cards = [...(page?.querySelectorAll(".song-card") ?? [])];
  const emptyState = page?.querySelector("[data-songs-empty]");
  const liveRegion = root.querySelector("[data-app-feedback]");

  if (!page || cards.length === 0) {
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    return;
  }

  liveRegion?.classList.add("visually-hidden");
  cards.forEach((card) => updateSongCard(card, user.progress?.songProgress));
  applyFilter("all", false);

  page.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const filterButton = event.target.closest("[data-filter]");

    if (filterButton && page.contains(filterButton)) {
      const filter = filterButton.dataset.filter;

      if (SONG_FILTERS.has(filter)) {
        applyFilter(filter, true);
      }
      return;
    }

    const practiceButton = event.target.closest('[data-action="practice-song"][data-song-action]');

    if (practiceButton && page.contains(practiceButton)) {
      recordPractice(practiceButton.dataset.songAction);
    }
  });

  function applyFilter(filter, announce) {
    let visibleCount = 0;

    root.querySelectorAll("[data-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });

    cards.forEach((card) => {
      const visible = filter === "all" || card.dataset.level === filter;
      card.hidden = !visible;
      visibleCount += Number(visible);
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }

    if (announce && liveRegion) {
      liveRegion.textContent = `Mostrando ${visibleCount} ${visibleCount === 1 ? "música" : "músicas"}`;
    }
  }

  function recordPractice(songId) {
    const card = cards.find((item) => [...item.querySelectorAll("[data-song-id]")]
      .some((element) => element.dataset.songId === songId));

    if (!card) {
      showToast("Não encontramos essa música para registrar a sessão de prática.", { type: "info" });
      return;
    }

    let sessionResult = null;
    const updatedUser = updateCurrentUser((currentUser) => {
      const progress = currentUser.progress && typeof currentUser.progress === "object"
        ? currentUser.progress
        : {};
      const songs = progress.songProgress && typeof progress.songProgress === "object"
        && !Array.isArray(progress.songProgress)
        ? progress.songProgress
        : {};
      const previousPercent = getSongPercentage(songs[songId]);
      const nextPercent = Math.min(100, previousPercent + SONG_PRACTICE_REWARD.progress);
      const xpResult = addXp({ ...progress, instrumentId: currentUser.instrument }, SONG_PRACTICE_REWARD.xp);

      currentUser.progress = {
        ...progress,
        xp: xpResult.progress.xp,
        level: xpResult.level,
        studyMinutes: toNonNegativeNumber(progress.studyMinutes) + SONG_PRACTICE_REWARD.minutes,
        notesPlayed: toNonNegativeNumber(progress.notesPlayed) + 1,
        songProgress: { ...songs, [songId]: nextPercent },
      };
      sessionResult = {
        xpResult,
      };
    });

    if (!updatedUser || !sessionResult) {
      showToast("Não foi possível salvar esta sessão de prática. Tente novamente.", { type: "info" });
      return;
    }

    const studyRecorded = Boolean(registerStudy());
    updateSongCard(card, updatedUser.progress.songProgress);
    showToast(`Boa prática! +${SONG_PRACTICE_REWARD.xp} XP 🎵`, { type: "xp" });

    if (sessionResult.xpResult.leveledUp) {
      globalThis.setTimeout(() => {
        showToast(`Você subiu para o Nível ${sessionResult.xpResult.level}! 🎉`, { type: "level" });
      }, 250);
    }

    if (!studyRecorded) {
      globalThis.setTimeout(() => {
        showToast("Sua prática foi salva, mas não conseguimos registrar o dia de estudo.", { type: "info" });
      }, 300);
    }

    unlockAchievements();
  }
}

function updateSongCard(card, songProgress = {}) {
  const progressElement = card.querySelector("[data-song-id]");
  const songId = progressElement?.dataset.songId;
  const percentage = getSongPercentage(songProgress?.[songId]);

  if (progressElement) {
    progressElement.value = percentage;
    progressElement.setAttribute("value", String(percentage));
    progressElement.setAttribute(
      "aria-label",
      `Progresso em ${card.querySelector(".song-card__title")?.textContent ?? "música"}: ${percentage}%`,
    );
    progressElement.setAttribute("aria-valuenow", String(percentage));
    progressElement.textContent = `${percentage}%`;
  }

  const progressLabel = [...card.querySelectorAll("[data-song-progress-label]")]
    .find((element) => element.dataset.songProgressLabel === songId);

  if (progressLabel) {
    progressLabel.textContent = `${percentage}%`;
  }

  const actionButton = card.querySelector('[data-action="practice-song"]');

  if (actionButton) {
    actionButton.textContent = percentage === 0
      ? "Praticar"
      : percentage === 100
        ? "Revisar"
        : "Continuar";
    actionButton.setAttribute(
      "aria-label",
      `${actionButton.textContent} ${card.querySelector(".song-card__title")?.textContent ?? "música"}`,
    );
  }

  if (percentage === 100) {
    card.dataset.state = "completed";
  } else {
    card.removeAttribute("data-state");
  }
}

function getSongPercentage(value) {
  if (typeof value === "number") {
    return Math.max(0, Math.min(100, value));
  }

  if (value && typeof value === "object") {
    return Math.max(0, Math.min(100, toNonNegativeNumber(value.progress)));
  }

  return value === true ? 100 : 0;
}
