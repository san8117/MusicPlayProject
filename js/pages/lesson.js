import { getPageRoute } from "../modules/auth.js";
import { getCurrentUser } from "../modules/state.js";
import {
  completeLesson,
  getLessonById,
  getLessonStates,
  getNextLesson,
  saveLessonProgress,
  startLessonSession,
} from "../modules/lessons.js";
import { showToast } from "../modules/toast.js";

const PLAYER_STEP_SECONDS = 60;
const CHORD_CLASSES = Object.freeze({ am: "chord-card--am", c: "chord-card--c", em: "chord-card--em" });

/**
 * Initializes lesson content, player simulation, progress actions, and completion.
 *
 * @param {Document} root Lesson document.
 * @returns {void}
 */
export function initializeLessonPage(root = document) {
  const user = getCurrentUser();

  if (!user) {
    return;
  }

  const requestedId = new URLSearchParams(globalThis.location.search).get("lesson");
  const lessonId = requestedId || getNextLesson(user.progress, user.instrument)?.id;
  const lesson = getLessonById(lessonId);

  if (!lesson || lesson.instrumentId !== user.instrument) {
    showUnavailableLesson(root);
    return;
  }

  const state = getLessonStates(user.progress, user.instrument).lessons
    .find((entry) => entry.id === lesson.id)?.state;

  if (state === "locked") {
    globalThis.location.assign(getPageRoute("learn.html?notice=locked"));
    return;
  }

  startLessonSession(lesson.id);
  const currentLesson = { ...lesson, state };
  populateLesson(root, currentLesson, user);
  initializeLessonInteractions(root, currentLesson);
}

function populateLesson(root, lesson, user) {
  const levelLabel = user.level === "some-experience" ? "Intermediário" : "Iniciante";
  const values = {
    module: `Módulo ${lesson.moduleNumber}`,
    number: `Aula ${lesson.number}`,
    title: lesson.title,
    description: lesson.description,
    xp: `+${lesson.xp} XP`,
    duration: `${lesson.minutes} min`,
    "objectives-count": `${lesson.objectives.length} ${lesson.objectives.length === 1 ? "objetivo" : "objetivos"}`,
    level: levelLabel,
  };

  root.querySelectorAll("[data-lesson]").forEach((element) => {
    const key = element.dataset.lesson;

    if (values[key] !== undefined) {
      element.textContent = values[key];
    }
  });

  renderObjectives(root, lesson.objectives);
  renderTheory(root, lesson.theory);

  const heading = root.querySelector('[data-lesson="title"]');

  if (heading) {
    root.title = `${lesson.title} | MUSICPLAY`;
  }

  const durationSeconds = Math.max(1, lesson.minutes * 60);
  const duration = root.querySelector("[data-lesson-media-duration]");

  if (duration) {
    duration.textContent = formatTime(durationSeconds);
  }

  const mediaProgress = root.querySelector("[data-lesson-media-progress]");

  if (mediaProgress) {
    mediaProgress.max = durationSeconds;
    mediaProgress.value = 0;
    mediaProgress.setAttribute("aria-valuenow", "0");
  }
}

function renderObjectives(root, objectives) {
  const list = root.querySelector('[data-lesson="objectives"]');

  if (!list) {
    return;
  }

  list.replaceChildren();
  objectives.forEach((objective) => {
    const item = root.createElement("li");
    item.textContent = objective;
    list.append(item);
  });
}

function renderTheory(root, theory) {
  const grid = root.querySelector('[data-lesson="chords"]');
  const section = grid?.closest(".lesson-theory");

  if (!grid || !section) {
    return;
  }

  grid.replaceChildren();
  section.hidden = theory.length === 0;

  theory.forEach((chord) => {
    const card = root.createElement("article");
    const name = root.createElement("h3");
    const description = root.createElement("p");
    const fingers = root.createElement("ul");
    const modifier = CHORD_CLASSES[chord.id] ?? `chord-card--${chord.id}`;

    card.className = `chord-card ${modifier}`;
    name.className = "chord-card__name";
    name.textContent = chord.name;
    description.className = "chord-card__description";
    description.textContent = chord.description;
    fingers.className = "chord-card__fingers";
    fingers.setAttribute("aria-label", `Posições dos dedos para o acorde ${chord.description}`);

    chord.fingers.forEach((finger) => {
      const item = root.createElement("li");
      item.textContent = finger;
      fingers.append(item);
    });

    card.append(name, description, fingers);
    grid.append(card);
  });
}

function initializePlayer(root, lesson) {
  const button = root.querySelector('[data-action="play-lesson"]');
  const progress = root.querySelector("[data-lesson-media-progress]");
  const currentTime = root.querySelector("[data-lesson-current-time]");
  const icon = button?.querySelector(".lesson-player__play-icon path");

  if (!button || !progress || !currentTime) {
    return;
  }

  const durationSeconds = Math.max(1, lesson.minutes * 60);
  const savedProgress = getCurrentUser()?.progress?.lessonProgress?.[lesson.id] ?? 0;
  const savedPercentage = typeof savedProgress === "number"
    ? savedProgress
    : savedProgress && typeof savedProgress === "object"
      ? savedProgress.percentage ?? savedProgress.progress ?? savedProgress.percent ?? 0
      : 0;
  let savedMilestone = Math.max(0, Math.min(100, Math.floor((Number(savedPercentage) || 0) / 25) * 25));
  let elapsedSeconds = Math.floor((savedMilestone / 100) * durationSeconds);
  let timer = null;
  const milestones = new Set([25, 50, 75, 100]);

  progress.value = elapsedSeconds;
  progress.setAttribute("aria-valuenow", String(elapsedSeconds));
  progress.setAttribute("aria-valuetext", `${formatTime(elapsedSeconds)} de ${formatTime(durationSeconds)}`);
  currentTime.textContent = formatTime(elapsedSeconds);
  setPlayerState(button, icon, false);

  root.defaultView?.addEventListener("pagehide", () => {
    if (timer !== null) {
      globalThis.clearInterval(timer);
    }
  }, { once: true });

  return () => {
    if (timer !== null) {
      globalThis.clearInterval(timer);
      timer = null;
      setPlayerState(button, icon, false);
      return;
    }

    setPlayerState(button, icon, true);
    timer = globalThis.setInterval(() => {
      elapsedSeconds = Math.min(durationSeconds, elapsedSeconds + PLAYER_STEP_SECONDS);
      progress.value = elapsedSeconds;
      progress.setAttribute("aria-valuenow", String(elapsedSeconds));
      progress.setAttribute("aria-valuetext", `${formatTime(elapsedSeconds)} de ${formatTime(durationSeconds)}`);
      currentTime.textContent = formatTime(elapsedSeconds);

      const percentage = Math.floor((elapsedSeconds / durationSeconds) * 100);
      for (const milestone of milestones) {
        if (percentage >= milestone && milestone > savedMilestone) {
          persistLessonProgress(lesson.id, milestone);
          savedMilestone = milestone;
        }
      }

      if (elapsedSeconds >= durationSeconds) {
        globalThis.clearInterval(timer);
        timer = null;
        setPlayerState(button, icon, false);
      }
    }, 1000);
  };
}

function setPlayerState(button, icon, isPlaying) {
  button.dataset.state = isPlaying ? "playing" : "paused";
  button.setAttribute("aria-pressed", String(isPlaying));
  button.setAttribute("aria-label", isPlaying ? "Pausar demonstração visual da aula" : "Reproduzir demonstração visual da aula");

  if (icon) {
    icon.setAttribute("d", isPlaying ? "M7 5h4v14H7zM14 5h4v14h-4z" : "M8 5.5v13l10-6.5-10-6.5Z");
  }
}

function initializeExercise(lessonId) {
  return () => {
    persistLessonProgress(lessonId, 50);
    showToast("Exercícios práticos chegam em breve 🎸", { type: "info" });
  };
}

function persistLessonProgress(lessonId, percentage) {
  const updatedUser = saveLessonProgress(lessonId, percentage);

  if (!updatedUser) {
    showToast("Não conseguimos salvar o progresso desta aula. Tente novamente.", { type: "info" });
    return false;
  }

  return true;
}

function initializeCompletion(root, lesson) {
  const completeButton = root.querySelector('[data-action="complete-lesson"]');
  const nextButton = root.querySelector('[data-action="next-lesson"]');
  const alreadyCompleted = lesson.state === "completed";

  setCompletedButton(completeButton, alreadyCompleted);
  updateNextLessonButton(nextButton, alreadyCompleted);

  return () => {
    if (!completeButton || completeButton.disabled) {
      return;
    }

    const result = completeLesson(lesson.id);

    if (!result.ok) {
      showToast("Não foi possível concluir esta aula agora. Tente novamente.", { type: "info" });
      return;
    }

    if (!result.alreadyCompleted) {
      showToast(`+${result.xpGained} XP`, { type: "xp" });

      if (result.leveledUp) {
        showToast(`Você subiu para o Nível ${result.newLevel}! 🎉`, { type: "level" });
      }

      if (!result.studyRecorded) {
        showToast("A aula foi concluída, mas não conseguimos registrar seu dia de estudo.", { type: "info" });
      }
    }

    setCompletedButton(completeButton, true);
    updateNextLessonButton(nextButton, true);
  };
}

function initializeLessonInteractions(root, lesson) {
  const page = root.querySelector(".lesson-page");

  if (!page || page.dataset.lessonEventsInitialized === "true") {
    return;
  }

  const handlers = {
    "play-lesson": initializePlayer(root, lesson),
    "start-exercise": initializeExercise(lesson.id),
    "complete-lesson": initializeCompletion(root, lesson),
  };
  page.dataset.lessonEventsInitialized = "true";
  page.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const control = event.target.closest("[data-action]");

    if (!control || !page.contains(control)) {
      return;
    }

    if (control.dataset.action === "next-lesson" && control.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      return;
    }

    handlers[control.dataset.action]?.();
  });
}

function setCompletedButton(button, isCompleted) {
  if (!button) {
    return;
  }

  if (isCompleted) {
    button.textContent = "Concluída ✓";
    button.disabled = true;
    button.dataset.state = "completed";
    button.classList.add("lesson-actions__complete--completed");
  } else {
    button.textContent = "✓ Marcar como concluída";
    button.disabled = false;
    button.removeAttribute("data-state");
    button.classList.remove("lesson-actions__complete--completed");
  }
}

function updateNextLessonButton(button, isCompleted) {
  if (!button) {
    return;
  }

  const user = getCurrentUser();
  const nextLesson = user ? getNextLesson(user.progress, user.instrument) : null;

  if (!isCompleted) {
    button.textContent = "Próxima aula →";
    button.href = "#";
    button.setAttribute("aria-disabled", "true");
    button.removeAttribute("tabindex");
    button.setAttribute("aria-label", "Próxima aula. Conclua esta aula para liberar a próxima.");
    return;
  }

  button.removeAttribute("aria-disabled");
  button.removeAttribute("aria-label");
  button.removeAttribute("tabindex");

  if (nextLesson) {
    button.textContent = "Próxima aula →";
    button.href = `./lesson.html?lesson=${encodeURIComponent(nextLesson.id)}`;
  } else {
    button.textContent = "Voltar para a trilha";
    button.href = "./learn.html";
  }
}

function showUnavailableLesson(root) {
  const title = root.querySelector(".lesson-header__title");
  const description = root.querySelector(".lesson-header__description");
  const backLink = root.querySelector(".lesson-page__back-link");

  if (title) {
    title.textContent = "Aula não encontrada";
  }

  if (description) {
    description.textContent = "Não encontramos essa aula. Volte à trilha para escolher uma aula disponível.";
  }

  if (backLink) {
    backLink.href = "./learn.html";
    backLink.textContent = "← Voltar para a trilha";
  }

  root.querySelectorAll(
    ".lesson-header__badges, .lesson-meta, [data-lesson-player], .lesson-objectives, .lesson-theory, .lesson-practice, .lesson-actions",
  )
    .forEach((element) => {
      element.hidden = true;
    });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
