import { QUIZ_QUESTIONS } from "../data/quiz-questions.js";
import { addXp } from "./xp.js";
import { getCurrentUser, updateCurrentUser } from "./state.js";
import { registerStudy } from "./streak.js";
import { showToast } from "./toast.js";
import { toNonNegativeNumber } from "./utils.js";
import { unlockAchievements } from "./achievements.js";

/**
 * Selects up to `count` unique questions and creates a fresh quiz round.
 *
 * @param {Array<object>} questions Available questions.
 * @param {{count?: number}} [options] Number of unique questions to choose.
 * @returns {{questions: Array<object>, index: number, answers: Array<object>, xpEarned: number, correctCount: number, finished: boolean}}
 */
export function startQuiz(questions = QUIZ_QUESTIONS, options = {}) {
  const requestedCount = Number.isFinite(options?.count) ? Math.max(0, Math.floor(options.count)) : 3;
  const validQuestions = (Array.isArray(questions) ? questions : []).filter(isValidQuestion);
  const selectedQuestions = shuffle(validQuestions)
    .slice(0, requestedCount)
    .map((question) => {
      const correctOptionId = question.options[question.correctIndex]?.id;
      const options = shuffle(question.options);

      return {
        ...question,
        options,
        correctIndex: options.findIndex((option) => option.id === correctOptionId),
      };
    });

  return {
    questions: selectedQuestions,
    index: 0,
    answers: [],
    xpEarned: 0,
    correctCount: 0,
    finished: false,
  };
}

/**
 * Adds one answer immutably; repeat or invalid answers are ignored.
 *
 * @param {object} quizState Current round state.
 * @param {number} optionIndex Zero-based option index.
 * @returns {{state: object, result: {isCorrect: boolean, correctIndex: number, explanation: string, xpGained: number, ignored?: boolean}}}
 */
export function answerQuestion(quizState, optionIndex) {
  const currentQuestion = quizState?.questions?.[quizState.index];
  const answers = Array.isArray(quizState?.answers) ? quizState.answers : [];
  const alreadyAnswered = answers.some((answer) => answer.questionId === currentQuestion?.id);

  if (
    !isValidQuestion(currentQuestion)
    || quizState.finished
    || alreadyAnswered
    || !Number.isInteger(optionIndex)
    || optionIndex < 0
    || optionIndex >= currentQuestion.options.length
  ) {
    return {
      state: quizState,
      result: {
        isCorrect: false,
        correctIndex: currentQuestion?.correctIndex ?? -1,
        explanation: currentQuestion?.explanation ?? "",
        xpGained: 0,
        ignored: true,
      },
    };
  }

  const isCorrect = optionIndex === currentQuestion.correctIndex;
  const xpGained = isCorrect ? toNonNegativeNumber(currentQuestion.xp) : 0;
  const answer = {
    questionId: currentQuestion.id,
    optionIndex,
    isCorrect,
    xpGained,
  };
  const state = {
    ...quizState,
    answers: [...answers, answer],
    xpEarned: quizState.xpEarned + xpGained,
    correctCount: quizState.correctCount + Number(isCorrect),
  };

  return {
    state,
    result: {
      isCorrect,
      correctIndex: currentQuestion.correctIndex,
      explanation: currentQuestion.explanation,
      xpGained,
    },
  };
}

/**
 * Advances to the next unanswered question without mutating the round.
 *
 * @param {object} quizState Current round state.
 * @returns {object} New state, or the same state when advancement is unavailable.
 */
export function nextQuestion(quizState) {
  if (!quizState || quizState.finished || isLastQuestion(quizState)) {
    return quizState;
  }

  const currentQuestion = quizState.questions[quizState.index];
  const answered = quizState.answers.some((answer) => answer.questionId === currentQuestion?.id);

  return answered ? { ...quizState, index: quizState.index + 1 } : quizState;
}

/**
 * Indicates whether the current question is the final question in the round.
 *
 * @param {object} quizState Current round state.
 * @returns {boolean} True when the current index is the final one.
 */
export function isLastQuestion(quizState) {
  return Boolean(quizState?.questions?.length && quizState.index === quizState.questions.length - 1);
}

/**
 * Persists a completed round's XP and statistics exactly once.
 *
 * @param {object} quizState Completed round state.
 * @returns {{ok: boolean, correctCount: number, total: number, xpEarned: number, accuracy: number, leveledUp: boolean, newLevel: number, unlockedAchievements: Array<object>, studyRecorded?: boolean, reason?: string}}
 */
export function finishQuiz(quizState) {
  const questions = Array.isArray(quizState?.questions)
    ? quizState.questions.filter(isValidQuestion)
    : [];
  const total = questions.length;
  const answers = Array.isArray(quizState?.answers) ? quizState.answers : [];
  const validAnswers = validateAnswers(questions, answers);
  const correctCount = validAnswers.filter((answer) => answer.isCorrect).length;
  const xpEarned = validAnswers.reduce((totalXp, answer) => totalXp + answer.xpGained, 0);
  const baseResult = {
    ok: false,
    correctCount,
    total,
    xpEarned,
    accuracy: total > 0 ? Math.round((correctCount / total) * 100) : 0,
    leveledUp: false,
    newLevel: 1,
    unlockedAchievements: [],
  };

  if (quizState?.finished || total === 0 || validAnswers.length !== total) {
    return { ...baseResult, reason: "incomplete" };
  }

  const user = getCurrentUser();

  if (!user) {
    return { ...baseResult, reason: "no-session" };
  }

  const progress = user.progress && typeof user.progress === "object" ? user.progress : {};
  const xpResult = addXp({ ...progress, instrumentId: user.instrument }, xpEarned);
  const correctStreak = getBestCorrectStreak(validAnswers);
  const existingQuizStats = progress.quizStats ?? {};
  const currentStreak = answers.reduce(
    (streak, answer) => (answer.isCorrect ? streak + 1 : 0),
    toNonNegativeNumber(existingQuizStats.currentStreak),
  );
  const nextProgress = {
    ...progress,
    xp: xpResult.progress.xp,
    level: xpResult.progress.level,
    gamesPlayed: toNonNegativeNumber(progress.gamesPlayed) + 1,
    studyMinutes: toNonNegativeNumber(progress.studyMinutes) + 2,
    quizStats: {
      answered: toNonNegativeNumber(existingQuizStats.answered) + validAnswers.length,
      correct: toNonNegativeNumber(existingQuizStats.correct) + correctCount,
      currentStreak,
      bestStreak: Math.max(toNonNegativeNumber(existingQuizStats.bestStreak), currentStreak, correctStreak),
      perfectQuizzes: toNonNegativeNumber(existingQuizStats.perfectQuizzes)
        + Number(correctCount === total && total === 3),
    },
  };

  const updatedUser = updateCurrentUser((currentUser) => {
    if (currentUser.email !== user.email || currentUser.instrument !== user.instrument) {
      return currentUser;
    }

    currentUser.progress = nextProgress;
  });

  if (!updatedUser || updatedUser.progress.gamesPlayed !== nextProgress.gamesPlayed) {
    return { ...baseResult, reason: "storage" };
  }

  quizState.finished = true;
  const studyRecorded = Boolean(registerStudy());
  const unlockedAchievements = unlockAchievements();

  if (xpResult.leveledUp) {
    showToast(`Você subiu para o Nível ${xpResult.level}! 🎉`, { type: "level" });
  }

  return {
    ...baseResult,
    ok: true,
    leveledUp: xpResult.leveledUp,
    newLevel: xpResult.level,
    unlockedAchievements: Array.isArray(unlockedAchievements) ? unlockedAchievements : [],
    studyRecorded,
  };
}

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function isValidQuestion(question) {
  return Boolean(
    question
    && typeof question.id === "string"
    && typeof question.question === "string"
    && Array.isArray(question.options)
    && question.options.length === 4
    && new Set(question.options.map((option) => option?.id)).size === question.options.length
    && question.options.every((option) => (
      option && typeof option.id === "string" && typeof option.text === "string"
    ))
    && Number.isInteger(question.correctIndex)
    && question.correctIndex >= 0
    && question.correctIndex < question.options.length
    && typeof question.explanation === "string"
    && Number.isFinite(question.xp)
    && question.xp >= 0
  );
}

function validateAnswers(questions, answers) {
  if (!Array.isArray(answers)) {
    return [];
  }

  const questionById = new Map(questions.map((question) => [question.id, question]));
  const seen = new Set();
  const valid = [];

  answers.forEach((answer) => {
    const question = questionById.get(answer?.questionId);

    if (
      !question
      || seen.has(question.id)
      || !Number.isInteger(answer.optionIndex)
      || answer.optionIndex < 0
      || answer.optionIndex >= question.options.length
    ) {
      return;
    }

    const isCorrect = answer.optionIndex === question.correctIndex;
    seen.add(question.id);
    valid.push({
      questionId: question.id,
      optionIndex: answer.optionIndex,
      isCorrect,
      xpGained: isCorrect ? toNonNegativeNumber(question.xp) : 0,
    });
  });

  return valid;
}

function getBestCorrectStreak(answers) {
  let bestStreak = 0;
  let currentStreak = 0;

  answers.forEach((answer) => {
    currentStreak = answer.isCorrect ? currentStreak + 1 : 0;
    bestStreak = Math.max(bestStreak, currentStreak);
  });

  return bestStreak;
}
