import { QUIZ_QUESTIONS } from "../data/quiz-questions.js";
import { getCurrentUser } from "../modules/state.js";
import {
  answerQuestion,
  finishQuiz,
  isLastQuestion,
  nextQuestion,
  startQuiz,
} from "../modules/quiz.js";
import { showToast } from "../modules/toast.js";

const OPTION_LETTERS = ["A", "B", "C", "D"];

/**
 * Initializes the interactive quiz page.
 *
 * @param {ParentNode} root Page root used to find the quiz controls.
 * @returns {void}
 */
export function initializeQuizPage(root = document) {
  const page = root.querySelector(".quiz-page");
  const questionElement = root.querySelector('[data-quiz="question"]');
  const options = [...root.querySelectorAll("[data-quiz-option]")];
  const xpBadge = root.querySelector('[data-quiz="xp"]');
  const counter = root.querySelector('[data-quiz="counter"]');
  const progress = root.querySelector(".quiz-progress");
  const segments = [...root.querySelectorAll("[data-quiz-segment]")];
  const feedback = root.querySelector("[data-quiz-feedback]");
  const nextButton = root.querySelector('[data-action="next-question"]');
  const questionPanel = root.querySelector("[data-quiz-question-panel]");
  const resultPanel = root.querySelector("[data-quiz-result]");
  const exitDialog = root.querySelector("[data-quiz-exit-dialog]");

  if (
    !page || !questionElement || options.length === 0 || !xpBadge || !counter
    || !progress || !feedback || !nextButton || !questionPanel || !resultPanel || !exitDialog
  ) {
    return;
  }

  xpBadge.setAttribute("aria-live", "polite");
  xpBadge.setAttribute("aria-atomic", "true");

  const user = getCurrentUser();
  const availableQuestions = QUIZ_QUESTIONS.filter((question) => (
    !question.instrumentId || question.instrumentId === user?.instrument
  ));
  let quizState = startQuiz(availableQuestions, { count: 3 });
  let pendingNavigation = null;
  const exitDescription = exitDialog.querySelector("#quiz-exit-description");

  if (exitDescription) {
    exitDescription.textContent = "As respostas desta rodada ainda não foram salvas. Se sair, o quiz recomeça do zero.";
  }

  page.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const optionButton = event.target.closest("[data-quiz-option]");

    if (optionButton && page.contains(optionButton)) {
      handleAnswer(optionButton);
      return;
    }

    const action = event.target.closest("[data-action]")?.dataset.action;

    if (action === "next-question") {
      handleNextQuestion();
    } else if (action === "restart-quiz") {
      quizState = startQuiz(availableQuestions, { count: 3 });
      renderQuestion();
    }
  });

  page.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest("a[href]");

    if (!link || link.getAttribute("href")?.startsWith("#") || !hasUnfinishedAnswers()) {
      return;
    }

    const destination = new URL(link.href, globalThis.location.href);

    if (destination.origin !== globalThis.location.origin) {
      return;
    }

    event.preventDefault();
    pendingNavigation = destination.href;
    exitDialog.showModal();
  });

  exitDialog.addEventListener("submit", (event) => {
    event.preventDefault();
    const action = event.submitter?.value;

    if (action === "exit" && pendingNavigation) {
      const destination = pendingNavigation;
      pendingNavigation = null;
      quizState.finished = true;
      exitDialog.close();
      globalThis.location.assign(destination);
      return;
    }

    pendingNavigation = null;
    exitDialog.close();
  });

  exitDialog.addEventListener("close", () => {
    pendingNavigation = null;
  });

  globalThis.addEventListener("beforeunload", (event) => {
    if (!hasUnfinishedAnswers()) {
      return;
    }

    event.preventDefault();
    event.returnValue = "";
  });

  if (quizState.questions.length === 0) {
    questionElement.textContent = "Ainda estamos preparando perguntas para este instrumento.";
    options.forEach((button) => {
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
    });
    counter.textContent = "0 / 0";
    progress.setAttribute("aria-valuenow", "0");
    progress.setAttribute("aria-valuemax", "0");
    showToast("Ainda estamos preparando perguntas para este instrumento. 🎵", {
      type: "info",
    });
    return;
  }

  renderQuestion();

  function handleAnswer(button) {
    const optionIndex = OPTION_LETTERS.indexOf(button.dataset.quizOption);
    const { state, result } = answerQuestion(quizState, optionIndex);

    if (result.ignored) {
      return;
    }

    quizState = state;
    options.forEach((option) => {
      option.disabled = true;
      option.setAttribute("aria-disabled", "true");
      option.removeAttribute("data-state");
    });

    const correctButton = options.find((option) => (
      OPTION_LETTERS.indexOf(option.dataset.quizOption) === result.correctIndex
    ));

    if (correctButton) {
      correctButton.dataset.state = "correct";
    }

    if (!result.isCorrect) {
      button.dataset.state = "incorrect";
    }

    feedback.hidden = false;
    const feedbackVariant = feedback.querySelector(
      `[data-quiz-feedback-state="${result.isCorrect ? "correct" : "incorrect"}"]`,
    );
    feedback.querySelectorAll("[data-quiz-feedback-state]").forEach((variant) => {
      variant.hidden = variant !== feedbackVariant;
    });
    const explanation = feedback.querySelector(
      `[data-quiz-explanation="${result.isCorrect ? "correct" : "incorrect"}"]`,
    );

    if (explanation) {
      explanation.textContent = result.explanation;
    }

    if (result.isCorrect) {
      const xpMessage = feedback.querySelector(".quiz-feedback__xp");

      if (xpMessage) {
        xpMessage.textContent = `+${result.xpGained} XP ganhos! 🎉`;
      }

      xpBadge.textContent = `⭐ ${quizState.xpEarned} XP`;
      xpBadge.dataset.state = "updated";
      globalThis.setTimeout(() => xpBadge.removeAttribute("data-state"), 600);
    }

    nextButton.textContent = isLastQuestion(quizState) ? "Ver resultado" : "Próxima pergunta →";
    nextButton.hidden = false;
    updateProgress();
    feedback.tabIndex = -1;
    feedback.focus();
    globalThis.setTimeout(() => nextButton.focus(), 200);
  }

  function handleNextQuestion() {
    if (isLastQuestion(quizState)) {
      const result = finishQuiz(quizState);

      if (!result.ok) {
        showToast("Não foi possível salvar o resultado agora. Tente novamente.", { type: "info" });
        return;
      }

      showResult(result);

      if (!result.studyRecorded) {
        showToast("Seu resultado foi salvo, mas não foi possível registrar o dia de estudo.", {
          type: "info",
        });
      }

      return;
    }

    quizState = nextQuestion(quizState);
    renderQuestion();
  }

  function renderQuestion() {
    const currentQuestion = quizState.questions[quizState.index];

    if (!currentQuestion) {
      return;
    }

    questionElement.textContent = currentQuestion.question;
    options.forEach((button) => {
      const optionIndex = OPTION_LETTERS.indexOf(button.dataset.quizOption);
      const textElement = button.querySelector(".quiz-option__text");
      const option = currentQuestion.options[optionIndex];

      button.disabled = !option;
      button.removeAttribute("aria-disabled");
      button.removeAttribute("data-state");

      if (textElement) {
        textElement.textContent = option?.text ?? "";
      }
    });

    feedback.hidden = true;
    feedback.querySelectorAll("[data-quiz-feedback-state]").forEach((variant) => {
      variant.hidden = true;
    });
    nextButton.hidden = true;
    nextButton.textContent = "Próxima pergunta →";
    updateProgress();
    questionElement.tabIndex = -1;
    questionElement.focus();
  }

  function updateProgress() {
    const total = quizState.questions.length;
    const current = quizState.index + 1;
    counter.textContent = `${current} / ${total}`;
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", String(total));
    progress.setAttribute("aria-valuenow", String(current));
    progress.setAttribute("aria-label", `Pergunta ${current} de ${total}`);

    segments.forEach((segment, index) => {
      const segmentNumber = Number(segment.dataset.quizSegment);
      segment.hidden = segmentNumber > total;
      segment.dataset.state = segmentNumber < current
        ? "completed"
        : segmentNumber === current
          ? "current"
          : "upcoming";
    });
  }

  function showResult(result) {
    questionPanel.hidden = true;
    progress.hidden = true;
    feedback.hidden = true;
    nextButton.hidden = true;
    resultPanel.hidden = false;

    const resultTitle = resultPanel.querySelector(".quiz-result__title");
    const correctElement = resultPanel.querySelector('[data-quiz-result="correct"]');
    const xpElement = resultPanel.querySelector('[data-quiz-result="xp"]');
    const accuracyElement = resultPanel.querySelector('[data-quiz-result="accuracy"]');

    if (resultTitle) {
      resultTitle.textContent = result.correctCount === result.total
        ? "Parabéns, você acertou tudo! 🎉"
        : result.correctCount === 0
          ? "Todo mundo começa assim, tente de novo!"
          : "Muito bem, continue praticando!";
      resultTitle.tabIndex = -1;
      resultTitle.focus();
    }

    if (correctElement) {
      correctElement.textContent = `${result.correctCount} de ${result.total}`;
    }

    if (xpElement) {
      xpElement.textContent = `${result.xpEarned} XP`;
    }

    if (accuracyElement) {
      accuracyElement.textContent = `${result.accuracy}%`;
    }
  }

  function hasUnfinishedAnswers() {
    return quizState.answers.length > 0 && !quizState.finished;
  }
}
