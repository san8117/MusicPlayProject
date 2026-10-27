const page = document.body.dataset.page;

await initializePage(page);

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
  pageModule[initializerName](document);

  if (currentPage === "profile") {
    const [{ logout, getPageRoute }, { initializeLogout }] = await Promise.all([
      import("./modules/auth.js"),
      import("./modules/form-ui.js"),
    ]);
    initializeLogout(document, logout, getPageRoute);
  }
}
