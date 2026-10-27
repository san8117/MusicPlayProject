import { showToast } from "./modules/toast.js";

const page = document.body.dataset.page;

initializeGlobalHandlers();
initializePage(page).catch(reportGlobalError);

function initializeGlobalHandlers() {
  globalThis.addEventListener("error", (event) => {
    console.error("Erro não tratado no MUSICPLAY:", event.error ?? event.message);
    showGenericError();
  });
  globalThis.addEventListener("unhandledrejection", (event) => {
    console.error("Rejeição não tratada no MUSICPLAY:", event.reason);
    showGenericError();
  });
  globalThis.addEventListener("musicplay:storage-error", () => {
    const now = Date.now();

    if (now - lastStorageErrorAt >= 5000) {
      lastStorageErrorAt = now;
      showToast("Não conseguimos salvar seu progresso neste navegador.", { type: "info" });
    }
  });
  globalThis.addEventListener("musicplay:local-day-changed", () => {
    import("./modules/user-ui.js")
      .then(({ populateUserUI }) => populateUserUI(document))
      .catch(reportGlobalError);
  });
}

function reportGlobalError(error) {
  console.error("Falha ao inicializar o MUSICPLAY:", error);
  showGenericError();
}

let lastGenericErrorAt = 0;
let lastStorageErrorAt = 0;

function showGenericError() {
  const now = Date.now();

  if (now - lastGenericErrorAt < 5000) {
    return;
  }

  lastGenericErrorAt = now;
  showToast("Algo deu errado. Tente recarregar a página.", { type: "info" });
}

async function initializePage(currentPage) {
  if (currentPage === "signup" || currentPage === "login") {
    const [{ login, redirectAuthenticatedUser, signup }, { initializeAuthForm }] = await Promise.all([
      import("./modules/auth.js"),
      import("./modules/form-ui.js"),
    ]);

    if (!redirectAuthenticatedUser()) {
      const form = document.querySelector(`[data-form="${currentPage}"]`);

      if (form) {
        initializeAuthForm(form, currentPage === "signup" ? signup : login);
      }
    }

    return;
  }

  if (currentPage === "onboarding") {
    const { initializeOnboarding } = await import("./modules/onboarding.js");
    initializeOnboarding(document);
    return;
  }

  const pageInitializers = {
    dashboard: () => import("./pages/dashboard.js"),
    learn: () => import("./pages/learn.js"),
    lesson: () => import("./pages/lesson.js"),
    profile: () => import("./pages/profile.js"),
    games: () => import("./pages/games.js"),
    quiz: () => import("./pages/quiz.js"),
    achievements: () => import("./pages/achievements.js"),
    songs: () => import("./pages/songs.js"),
  };
  const loadPage = pageInitializers[currentPage];

  if (!loadPage) {
    return;
  }

  const { initializeNavigation } = await import("./modules/navigation.js");

  if (!initializeNavigation(currentPage)) {
    return;
  }

  const [{ populateUserUI }, pageModule] = await Promise.all([
    import("./modules/user-ui.js"),
    loadPage(),
  ]);

  populateUserUI(document);
  const initializerName = {
    dashboard: "initializeDashboard",
    learn: "initializeLearnPage",
    lesson: "initializeLessonPage",
    profile: "initializeProfile",
    games: "initializeGamesPage",
    quiz: "initializeQuizPage",
    achievements: "initializeAchievementsPage",
    songs: "initializeSongsPage",
  }[currentPage];

  if (typeof pageModule[initializerName] !== "function") {
    throw new Error(`Inicializador ausente para a página: ${currentPage}`);
  }

  pageModule[initializerName](document);

  if (currentPage === "profile") {
    const [{ logout, getPageRoute }, { initializeLogout }] = await Promise.all([
      import("./modules/auth.js"),
      import("./modules/form-ui.js"),
    ]);
    initializeLogout(document, logout, getPageRoute);
  }
}
