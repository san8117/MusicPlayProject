import { INSTRUMENTS } from "../data/instruments.js";
import { getCurrentUser } from "../modules/state.js";
import { getLessonStates, getLockedLessonMessage } from "../modules/lessons.js";
import { showToast } from "../modules/toast.js";
import { getPageRoute } from "../modules/auth.js";

/**
 * Renders lesson and module availability into the existing learning path.
 *
 * @param {Document} root Learning page document.
 * @returns {void}
 */
export function initializeLearnPage(root = document) {
  const user = getCurrentUser();

  if (!user) {
    return;
  }

  const { modules, lessons } = getLessonStates(user.progress, user.instrument);
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((lesson) => lesson.state === "completed").length;
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

  updatePageHeading(root, user.instrument);
  renderModules(root, modules);
  root.querySelectorAll("[data-lesson-id]").forEach((item) => {
    const lesson = lessonById.get(item.dataset.lessonId);

    if (lesson) {
      renderLessonItem(root, item, lesson, user.progress);
    }
  });
  renderOverallProgress(root, completedLessons, totalLessons);
  renderEmptyPathState(root, totalLessons);
  initializeLockedLessonFeedback(root);
  showRedirectNotice();
}

function updatePageHeading(root, instrumentId) {
  const heading = root.querySelector(".learn-page__title");
  const instrument = INSTRUMENTS.find((entry) => entry.id === instrumentId);

  if (heading && instrument) {
    heading.textContent = `Trilha de Aprendizado ${instrument.emoji}`;
  }
}

function renderEmptyPathState(root, totalLessons) {
  const main = root.querySelector(".learn-page");

  if (!main) {
    return;
  }

  const existing = main.querySelector("[data-learning-empty-state]");

  if (totalLessons > 0) {
    existing?.remove();
    return;
  }

  const message = existing ?? root.createElement("p");
  message.className = "learning-module__lock-message";
  message.dataset.learningEmptyState = "";
  message.setAttribute("role", "status");
  message.textContent = "As aulas para este instrumento chegam em breve.";
  root.querySelector(".learning-progress")?.after(message);
}

function renderModules(root, modules) {
  root.querySelectorAll("[data-module-id]").forEach((section) => {
    const module = modules.find((entry) => entry.id === section.dataset.moduleId);

    if (!module) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    const state = module.unlocked ? "unlocked" : "locked";
    section.dataset.state = state;
    section.classList.toggle("learning-module--locked", !module.unlocked);

    const title = section.querySelector(".learning-module__title");
    const count = section.querySelector("[data-module-progress]");
    const lockMessage = section.querySelector(".learning-module__lock-message");

    if (title) {
      title.textContent = module.title;
    }

    if (count) {
      count.textContent = `${module.completedCount} / ${module.totalLessons} aulas`;
    }

    if (lockMessage) {
      lockMessage.hidden = module.unlocked;
      lockMessage.textContent = "Complete o módulo anterior para desbloquear.";
    }

    const lessonList = section.querySelector(".lesson-list");
    if (lessonList) {
      lessonList.setAttribute("aria-label", `Aulas do módulo ${module.title}`);
    }

    if (module.unlocked) {
      section.removeAttribute("aria-describedby");
    } else if (lockMessage?.id) {
      section.setAttribute("aria-describedby", lockMessage.id);
    }
  });
}

function renderLessonItem(root, item, lesson, progress) {
  item.dataset.state = lesson.state;
  const currentProgress = getProgressValue(progress.lessonProgress?.[lesson.id]);
  const label = lesson.state === "completed"
    ? "Concluída"
    : lesson.state === "current"
      ? `Em andamento • ${currentProgress}% concluído`
      : "Bloqueada";
  let link = item.querySelector(".lesson-item");

  if (lesson.state === "locked") {
    if (link?.tagName === "A") {
      link = replaceElement(link, "span");
    }

    if (!link) {
      return;
    }

    link.removeAttribute("href");
    link.removeAttribute("aria-current");
    link.setAttribute("role", "button");
    link.setAttribute("tabindex", "0");
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("aria-label", `${lesson.title}. Bloqueada. ${getLockedLessonMessage()}`);
  } else {
    if (link?.tagName !== "A") {
      link = replaceElement(link, "a");
    }

    if (!link) {
      return;
    }

    link.href = `./lesson.html?lesson=${encodeURIComponent(lesson.id)}`;
    link.removeAttribute("role");
    link.removeAttribute("tabindex");
    link.removeAttribute("aria-disabled");
    link.removeAttribute("aria-label");

    if (lesson.state === "current") {
      link.setAttribute("aria-current", "step");
    } else {
      link.removeAttribute("aria-current");
    }
  }

  link.classList.remove("lesson-item--current", "lesson-item--completed", "lesson-item--locked");
  link.classList.add(`lesson-item--${lesson.state}`);
  const number = link.querySelector(".lesson-item__number");
  const title = link.querySelector(".lesson-item__title");
  const status = link.querySelector(".lesson-item__status");
  const xp = link.querySelector(".lesson-item__xp");

  if (number) {
    number.textContent = String(lesson.number);
  }

  if (title) {
    title.textContent = lesson.title;
  }

  if (status) {
    status.textContent = label;
    status.classList.toggle("visually-hidden", lesson.state !== "current");
  }

  if (xp) {
    xp.textContent = `+${lesson.xp} XP`;
  }
}

function renderOverallProgress(root, completedLessons, totalLessons) {
  const progress = root.querySelector("[data-lessons-progress]");

  root.querySelectorAll('[data-user="lessons-progress"]').forEach((element) => {
    element.textContent = `${completedLessons} / ${totalLessons} aulas`;
  });

  if (progress) {
    progress.hidden = totalLessons === 0;
    progress.max = Math.max(totalLessons, 1);
    progress.value = completedLessons;
    progress.setAttribute("aria-valuenow", String(completedLessons));
    progress.setAttribute("aria-valuemax", String(Math.max(totalLessons, 1)));
    progress.setAttribute("aria-valuetext", `${completedLessons} de ${totalLessons} aulas concluídas`);
    progress.textContent = `${completedLessons} de ${totalLessons} aulas`;
  }
}

function initializeLockedLessonFeedback(root) {
  const main = root.querySelector(".learn-page");

  if (!main || main.dataset.lockedLessonFeedback === "true") {
    return;
  }

  main.dataset.lockedLessonFeedback = "true";
  main.addEventListener("click", (event) => {
    const item = event.target.closest('.lesson-list__item[data-state="locked"]');

    if (item && main.contains(item)) {
      showToast(getLockedLessonMessage(), { type: "info" });
    }
  });

  main.addEventListener("keydown", (event) => {
    const item = event.target.closest('.lesson-list__item[data-state="locked"]');

    if (item && main.contains(item) && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      showToast(getLockedLessonMessage(), { type: "info" });
    }
  });
}

function showRedirectNotice() {
  const params = new URLSearchParams(globalThis.location.search);

  if (params.get("notice") === "locked") {
    showToast(getLockedLessonMessage(), { type: "info" });
    globalThis.history.replaceState(null, "", getPageRoute("learn.html"));
  }
}

function getProgressValue(value) {
  if (typeof value === "number") {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  if (value && typeof value === "object") {
    return getProgressValue(value.percentage ?? value.progress ?? value.percent ?? 0);
  }

  return 0;
}

function replaceElement(element, tagName) {
  if (!element) {
    return null;
  }

  const replacement = document.createElement(tagName);

  for (const className of element.classList) {
    replacement.classList.add(className);
  }

  while (element.firstChild) {
    replacement.append(element.firstChild);
  }

  element.replaceWith(replacement);
  return replacement;
}
