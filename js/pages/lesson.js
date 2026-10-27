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
import { INSTRUMENTS } from "../data/instruments.js";
import { VIDEOS_BY_INSTRUMENT } from "../data/videos.js";
import { parseYouTubeId } from "../modules/youtube.js";

const VIDEO_LOAD_TIMEOUT_MS = 12000;

/**
 * Initializes instrument-specific lesson content, video facade, and completion.
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
  const instrument = INSTRUMENTS.find((entry) => entry.id === user.instrument);
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

  root.title = `${lesson.title} | MUSICPLAY`;
  renderObjectives(root, lesson.objectives);
  renderTheory(root, lesson.theory);
  updateInstrumentCopy(root, instrument?.name ?? "instrumento");

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

function updateInstrumentCopy(root, instrumentName) {
  const practiceTitle = root.querySelector(".lesson-practice .lesson-card__title");
  const practiceDescription = root.querySelector(".lesson-practice__description");
  const metaDescription = root.querySelector('meta[name="description"]');

  if (practiceTitle) {
    practiceTitle.textContent = "Agora é sua vez!";
  }

  if (practiceDescription) {
    practiceDescription.textContent = `Pratique ${instrumentName} e o conteúdo aprendido. Vá no seu ritmo e observe cada movimento.`;
  }

  if (metaDescription) {
    metaDescription.content = `Acompanhe a aula ${root.querySelector('[data-lesson="title"]')?.textContent ?? ""} para ${instrumentName} no MUSICPLAY.`;
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
  grid.dataset.count = String(theory.length);
  section.hidden = theory.length === 0;

  theory.forEach((block) => {
    const card = root.createElement("article");
    const name = root.createElement("h3");
    const details = root.createElement("ul");

    card.className = `chord-card chord-card--${block.color}`;
    name.className = "chord-card__name";
    name.textContent = block.title;
    details.className = "chord-card__fingers";
    details.setAttribute("aria-label", `Detalhes de ${block.title}`);

    block.details.forEach((detail) => {
      const item = root.createElement("li");
      item.textContent = detail;
      details.append(item);
    });

    card.append(name, details);
    grid.append(card);
  });
}

function initializePlayer(root, lesson, user) {
  const button = root.querySelector('[data-action="play-lesson"]');
  const player = root.querySelector("[data-lesson-player]");
  const screen = root.querySelector(".lesson-player__screen");
  const placeholder = root.querySelector(".lesson-player__placeholder");
  const controls = root.querySelector(".lesson-player__controls");

  if (!button || !player || !screen || !placeholder) {
    return;
  }

  const video = VIDEOS_BY_INSTRUMENT[user.instrument]?.[lesson.id];
  const videoId = parseYouTubeId(video?.videoId ?? "");
  const quality = root.querySelector(".lesson-player__quality");

  if (!videoId) {
    button.hidden = true;
    button.disabled = true;
    placeholder.textContent = "O vídeo desta aula chega em breve 🎬";
    if (controls) {
      controls.hidden = true;
    }

    return null;
  }

  placeholder.textContent = "Clique para carregar o vídeo desta aula.";
  button.hidden = false;
  button.disabled = false;
  button.setAttribute("aria-label", `Carregar vídeo: ${video?.title ?? lesson.title}`);
  button.setAttribute("aria-pressed", "false");
  player.setAttribute("aria-label", `Vídeo da aula ${lesson.title}`);

  let activeIframe = null;
  let activeErrorMessage = null;
  let fallbackTimer = null;
  const stopVideo = () => {
    globalThis.clearTimeout(fallbackTimer);
    activeIframe?.remove();
    activeErrorMessage?.remove();
    activeIframe = null;
    activeErrorMessage = null;
    button.dataset.videoLoaded = "false";
    button.disabled = false;
    button.setAttribute("aria-pressed", "false");
    placeholder.hidden = false;
    placeholder.textContent = "Clique para carregar o vídeo desta aula.";
    if (quality) {
      quality.hidden = false;
    }
    if (controls) {
      controls.hidden = false;
    }
  };
  globalThis.addEventListener("pagehide", stopVideo);

  return () => {
    if (button.dataset.videoLoaded === "true") {
      return;
    }

    button.dataset.videoLoaded = "true";
    button.disabled = true;
    if (quality) {
      quality.hidden = true;
    }
    placeholder.hidden = true;
    if (controls) {
      controls.hidden = true;
    }

    const instrument = INSTRUMENTS.find((entry) => entry.id === user.instrument);
    const iframe = root.createElement("iframe");
    activeIframe = iframe;
    iframe.className = "lesson-player__iframe";
    iframe.setAttribute("src", `https://www.youtube-nocookie.com/embed/${videoId}`);
    iframe.setAttribute("title", `${video?.title ?? lesson.title} — ${instrument?.name ?? "instrumento"} | MUSICPLAY`);
    iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("loading", "lazy");
    screen.replaceChildren(iframe);

    const errorMessage = root.createElement("p");
    activeErrorMessage = errorMessage;
    const link = root.createElement("a");
    errorMessage.className = "lesson-player__error";
    errorMessage.hidden = true;
    errorMessage.append("Não conseguimos carregar o vídeo. ");
    link.href = `https://www.youtube.com/watch?v=${videoId}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Abrir no YouTube ↗";
    errorMessage.append(link);
    player.insertBefore(errorMessage, controls ?? null);

    let loaded = false;
    fallbackTimer = globalThis.setTimeout(() => {
      if (!loaded) {
        errorMessage.hidden = false;
      }
    }, VIDEO_LOAD_TIMEOUT_MS);
    iframe.addEventListener("load", () => {
      loaded = true;
      globalThis.clearTimeout(fallbackTimer);
    }, { once: true });
    iframe.addEventListener("error", () => {
      loaded = true;
      globalThis.clearTimeout(fallbackTimer);
      errorMessage.hidden = false;
    }, { once: true });
  };
}

function initializeExercise(lessonId) {
  return () => {
    persistLessonProgress(lessonId, 50);
    showToast("Exercício prático registrado. Continue no seu ritmo! 🎵", { type: "info" });
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
    "play-lesson": initializePlayer(root, lesson, getCurrentUser()),
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
