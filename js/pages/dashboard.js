import { ACHIEVEMENTS } from "../data/achievements.js";
import { getLessonsForInstrument } from "../data/lessons.js";
import { SONGS } from "../data/songs.js";
import { getCurrentUser } from "../modules/state.js";

/**
 * Renders personalized dashboard learning content and recent achievements.
 *
 * @param {Document} root Dashboard document.
 * @returns {void}
 */
export function initializeDashboard(root = document) {
  const user = getCurrentUser();

  if (!user) {
    return;
  }

  updateCurrentLesson(root, user);
  updateRecommendations(root, user);
  updatePersonalTip(root, user);
  renderRecentAchievements(root, user);
}

function updateCurrentLesson(root, user) {
  const lessons = flattenLessons(getLessonsForInstrument(user.instrument));
  const progress = user.progress ?? {};
  const completedLessons = Array.isArray(progress.completedLessons) ? progress.completedLessons : [];
  const currentLesson = lessons.find(({ lesson }) => lesson.id === progress.currentLessonId
    && !completedLessons.includes(lesson.id))
    ?? lessons.find(({ lesson }) => !completedLessons.includes(lesson.id));
  const currentProgress = currentLesson
    ? getLessonPercentage(progress.lessonProgress?.[currentLesson.lesson.id])
    : 0;
  const isNewLearner = completedLessons.length === 0
    && currentProgress === 0
    && (!progress.currentLessonId || progress.currentLessonId === "lesson-1");
  const title = root.querySelector("[data-current-lesson-title]");
  const description = root.querySelector("[data-current-lesson-description]");
  const moduleLabel = root.querySelector("[data-current-module]");
  const timeLabel = root.querySelector("[data-current-lesson-time]");
  const completionLabel = root.querySelector("[data-current-lesson-completion]");
  const progressBar = root.querySelector("[data-current-lesson-progress]");
  const action = root.querySelector('[data-action="continue-lesson"]');

  if (!currentLesson) {
    if (title) {
      title.textContent = "Novas aulas em breve";
    }

    if (description) {
      description.textContent = "Estamos preparando conteúdo para este instrumento.";
    }

    if (moduleLabel) {
      moduleLabel.textContent = "Conteúdo em preparação";
    }

    if (timeLabel) {
      timeLabel.textContent = "Acompanhe as novidades";
    }

    if (completionLabel) {
      completionLabel.textContent = "0% concluído";
    }

    if (progressBar) {
      progressBar.value = 0;
      progressBar.setAttribute("aria-valuenow", "0");
    }

    if (action) {
      action.textContent = "Ver trilha";
      action.href = "./learn.html";
    }

    return;
  }

  const { lesson, module } = currentLesson;

  if (title) {
    title.textContent = isNewLearner ? "Comece sua primeira aula" : lesson.title;
  }

  if (description) {
    description.textContent = lesson.description;
  }

  if (moduleLabel) {
    moduleLabel.textContent = `Módulo ${module.number} · Aula ${lesson.number}`;
  }

  if (timeLabel) {
    timeLabel.textContent = `Tempo estimado: ${lesson.minutes} min`;
  }

  if (completionLabel) {
    completionLabel.textContent = `${currentProgress}% concluído`;
  }

  if (progressBar) {
    progressBar.value = currentProgress;
    progressBar.setAttribute("aria-valuenow", String(currentProgress));
    progressBar.textContent = `${currentProgress}% concluído`;
  }

  if (action) {
    action.textContent = isNewLearner ? "Começar aula" : "Continuar aula";
    action.href = `./lesson.html?lesson=${encodeURIComponent(lesson.id)}`;
  }
}

function updateRecommendations(root, user) {
  const cards = root.querySelectorAll(".recommendation-card");
  const modules = getLessonsForInstrument(user.instrument);
  const completedLessons = Array.isArray(user.progress?.completedLessons) ? user.progress.completedLessons : [];
  const nextLesson = flattenLessons(modules).find(({ lesson }) => !completedLessons.includes(lesson.id));
  const lessonCard = cards[0];

  if (lessonCard) {
    const title = lessonCard.querySelector(".recommendation-card__title");
    const description = lessonCard.querySelector(".recommendation-card__description");
    const xp = lessonCard.querySelector(".recommendation-card__xp");
    const link = lessonCard.querySelector(".recommendation-card__link");

    if (title) {
      title.textContent = nextLesson?.lesson.title ?? "Novas aulas em breve";
    }

    if (description) {
      description.textContent = nextLesson?.lesson.description ?? "Estamos preparando conteúdo para este instrumento.";
    }

    if (xp) {
      xp.textContent = nextLesson ? `+${nextLesson.lesson.xp} XP` : "";
    }

    if (link) {
      link.textContent = nextLesson ? "Ver aula" : "Ver trilha";
      link.href = nextLesson
        ? `./lesson.html?lesson=${encodeURIComponent(nextLesson.lesson.id)}`
        : "./learn.html";
    }
  }

  const songLevel = user.level === "some-experience" ? "intermediate" : "beginner";
  const song = SONGS.find((entry) => entry.level === songLevel);
  const songCard = cards[2];

  if (songCard) {
    const title = songCard.querySelector(".recommendation-card__title");
    const description = songCard.querySelector(".recommendation-card__description");

    if (title) {
      title.textContent = song?.title ?? "Explore músicas";
    }

    if (description) {
      description.textContent = song
        ? `${song.artist} · ${song.chords.join(", ")}`
        : "Descubra músicas para acompanhar seus estudos.";
    }
  }
}

function updatePersonalTip(root, user) {
  const tip = root.querySelector("[data-personal-tip]");

  if (!tip) {
    return;
  }

  const completedLessons = Array.isArray(user.progress?.completedLessons) ? user.progress.completedLessons : [];
  const currentProgress = user.progress?.lessonProgress ?? {};
  const hasStartedLesson = Object.values(currentProgress).some((entry) => getLessonPercentage(entry) > 0);
  const isNewLearner = completedLessons.length === 0
    && !hasStartedLesson
    && (!user.progress?.currentLessonId || user.progress.currentLessonId === "lesson-1");

  tip.textContent = isNewLearner
    ? "Comece pela Aula 1 e ganhe seus primeiros XP."
    : "Continue de onde parou ou revise uma aula para fortalecer o que já aprendeu.";
}

function renderRecentAchievements(root, user) {
  const list = root.querySelector("[data-achievements-list]");
  const emptyState = root.querySelector("[data-achievements-empty]");

  if (!list || !emptyState) {
    return;
  }

  const unlocked = user.progress?.unlockedAchievements ?? {};
  const items = Object.entries(unlocked)
    .map(([id, details]) => ({
      achievement: ACHIEVEMENTS.find((entry) => entry.id === id),
      date: getAchievementDate(details),
    }))
    .filter((entry) => entry.achievement)
    .sort((first, second) => (second.date ?? "").localeCompare(first.date ?? ""))
    .slice(0, 4);

  list.replaceChildren();
  emptyState.hidden = items.length > 0;
  list.hidden = items.length === 0;

  items.forEach(({ achievement, date }) => {
    const item = root.createElement("li");
    const icon = root.createElement("span");
    const title = root.createElement("span");

    icon.setAttribute("aria-hidden", "true");
    icon.textContent = achievement.icon;
    title.textContent = achievement.title;
    item.append(icon, title);

    if (date) {
      const time = root.createElement("time");
      time.dateTime = date;
      time.textContent = formatAchievementDate(date);
      item.append(time);
    }

    list.append(item);
  });
}

function flattenLessons(modules) {
  return modules.flatMap((module) => module.lessons.map((lesson) => ({ lesson, module })));
}

function getLessonPercentage(value) {
  if (typeof value === "number") {
    return clampPercentage(value);
  }

  if (value && typeof value === "object") {
    return clampPercentage(value.percentage ?? value.progress ?? value.percent ?? 0);
  }

  return 0;
}

function clampPercentage(value) {
  const percentage = toNonNegativeNumber(value);
  return Math.min(100, Math.round(percentage));
}

function getAchievementDate(value) {
  if (typeof value === "string") {
    return isDateKey(value.slice(0, 10)) ? value.slice(0, 10) : "";
  }

  if (value && typeof value === "object") {
    const date = value.unlockedAt ?? value.date ?? value.createdAt;
    return typeof date === "string" && isDateKey(date.slice(0, 10)) ? date.slice(0, 10) : "";
  }

  return "";
}

function isDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function formatAchievementDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}
