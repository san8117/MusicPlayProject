import { getCurrentUser, updateCurrentUser } from "./state.js";
import { getPageRoute } from "./auth.js";
import { INSTRUMENTS } from "../data/instruments.js";

const HELP_TEXT = Object.freeze({
  1: "Escolha um instrumento para continuar.",
  2: "Escolha seu nível para continuar.",
  3: "Selecione pelo menos um objetivo para começar.",
});

/**
 * Initializes the onboarding wizard if its form is present.
 *
 * @param {Document} root Document containing the onboarding page.
 * @returns {void}
 */
export function initializeOnboarding(root = document) {
  const form = root.querySelector('[data-form="onboarding"]');

  if (!form) {
    return;
  }

  const user = getCurrentUser();

  if (!user) {
    globalThis.location.assign(getPageRoute("login.html"));
    return;
  }

  if (user.onboardingDone) {
    globalThis.location.assign(getPageRoute("dashboard.html"));
    return;
  }

  const draft = user.onboardingDraft ?? {
    step: user.instrument ? (user.level ? 3 : 2) : 1,
    instrument: user.instrument,
    level: user.level,
    goals: user.goals ?? [],
  };
  restoreChoices(form, draft);

  let currentStep = clampStep(draft.step);
  setStep(form, currentStep, root);
  updateStepAvailability(form, currentStep);

  form.addEventListener("change", (event) => {
    const option = event.target.closest("[data-option]");

    if (!option || !form.contains(option)) {
      return;
    }

    persistDraft(form, currentStep);
    updateStepAvailability(form, currentStep);
  });

  form.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");

    if (!action || !form.contains(action) || action.disabled) {
      return;
    }

    if (action.dataset.action === "next-step" && currentStep < 3) {
      currentStep += 1;
      persistDraft(form, currentStep);
      setStep(form, currentStep, root);
      updateStepAvailability(form, currentStep);
    }

    if (action.dataset.action === "prev-step" && currentStep > 1) {
      currentStep -= 1;
      persistDraft(form, currentStep);
      setStep(form, currentStep, root);
      updateStepAvailability(form, currentStep);
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (currentStep !== 3 || !isStepValid(form, 3)) {
      updateStepAvailability(form, currentStep);
      return;
    }

    const values = readChoices(form);
    const updatedUser = updateCurrentUser((currentUser) => {
      currentUser.instrument = values.instrument;
      currentUser.level = values.level;
      currentUser.goals = values.goals;
      currentUser.onboardingDone = true;
      currentUser.onboardingDraft = null;
    });

    if (!updatedUser) {
      showStepError(form, 3, "Não foi possível salvar suas escolhas. Tente novamente.");
      return;
    }

    globalThis.location.assign(getPageRoute("dashboard.html"));
  });
}

function restoreChoices(form, draft) {
  const values = {
    instrument: draft.instrument ?? null,
    level: draft.level ?? null,
    goals: Array.isArray(draft.goals) ? draft.goals : [],
  };

  form.querySelectorAll("[data-option]").forEach((option) => {
    const category = option.dataset.option;
    option.checked = category === "goal"
      ? values.goals.includes(option.value)
      : values[category] === option.value;
  });

  updateAvailableLessons(form, values.instrument);
}

function readChoices(form) {
  const instrument = form.querySelector('[data-option="instrument"]:checked')?.value ?? null;
  const level = form.querySelector('[data-option="level"]:checked')?.value ?? null;
  const goals = Array.from(form.querySelectorAll('[data-option="goal"]:checked'), (option) => option.value);
  return { instrument, level, goals };
}

function persistDraft(form, step) {
  const values = readChoices(form);
  const user = updateCurrentUser((currentUser) => {
    currentUser.instrument = values.instrument;
    currentUser.level = values.level;
    currentUser.goals = values.goals;
    currentUser.onboardingDraft = { ...values, step };
  });

  if (!user) {
    showStepError(form, step, "Não foi possível salvar suas escolhas. Tente novamente.");
  }

  updateAvailableLessons(form, values.instrument);
}

function setStep(form, step, root) {
  form.querySelectorAll("[data-step]").forEach((section) => {
    section.hidden = Number(section.dataset.step) !== step;
  });

  const counter = root.querySelector("[data-step-count]");
  const progress = root.querySelector("[data-progress]");

  if (counter) {
    counter.textContent = `${step} / 3`;
  }

  if (progress) {
    progress.value = step;
    progress.setAttribute("aria-valuenow", String(step));
    progress.setAttribute("aria-valuetext", `Passo ${step} de 3`);
  }

  const heading = form.querySelector(`[data-step="${step}"] .onboarding-step__title`);

  if (heading) {
    heading.tabIndex = -1;
    heading.focus();
  }
}

function updateStepAvailability(form, step) {
  const activeSection = form.querySelector(`[data-step="${step}"]`);
  const nextButton = activeSection?.querySelector('[data-action="next-step"], [data-action="finish"]');
  const help = activeSection?.querySelector("[data-step-help]");
  const valid = isStepValid(form, step);

  if (nextButton) {
    nextButton.disabled = !valid;
  }

  if (help) {
    help.textContent = valid ? "" : HELP_TEXT[step];
    help.hidden = valid;
  }

  clearStepError(form, step);
}

function isStepValid(form, step) {
  if (step === 1) {
    return Boolean(form.querySelector('[data-option="instrument"]:checked'));
  }

  if (step === 2) {
    return Boolean(form.querySelector('[data-option="level"]:checked'));
  }

  return form.querySelectorAll('[data-option="goal"]:checked').length > 0;
}

function updateAvailableLessons(form, instrumentId) {
  const selectedInstrument = INSTRUMENTS.find((instrument) => instrument.id === instrumentId);

  form.querySelectorAll('[data-option="instrument"]').forEach((input) => {
    const detail = input.closest(".choice-option")?.querySelector(".choice-option__detail");

    if (!detail) {
      return;
    }

    if (input.checked && selectedInstrument?.availableLessons) {
      detail.textContent = `${selectedInstrument.availableLessons} aulas disponíveis`;
      detail.hidden = false;
    } else {
      detail.hidden = true;
    }
  });
}

function showStepError(form, step, message) {
  const section = form.querySelector(`[data-step="${step}"]`);
  const error = section?.querySelector(".choice-group__error");

  if (error) {
    error.textContent = message;
  }
}

function clearStepError(form, step) {
  const section = form.querySelector(`[data-step="${step}"]`);
  const error = section?.querySelector(".choice-group__error");

  if (error) {
    error.textContent = "";
  }
}

function clampStep(step) {
  const numericStep = Number(step);
  return Number.isInteger(numericStep) ? Math.min(Math.max(numericStep, 1), 3) : 1;
}
