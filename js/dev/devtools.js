/*
Run these snippets in the browser Console while the project is served locally.
This helper file is intentionally not imported by application pages.

1. Name formatting:
const { formatName } = await import("/js/modules/utils.js");
[
  formatName("  guilherme   DE oliveira "),
  formatName("maria das dores"),
  formatName("joão e silva"),
  formatName("  ANA   lúcia  ")
];

2. Isolated users (use test addresses):
{
  const suffix = Date.now();
  const firstEmail = `teste1-${suffix}@example.com`;
  const secondEmail = `teste2-${suffix}@example.com`;
  const state = await import("/js/modules/state.js");
  const storage = await import("/js/modules/storage.js");
  const originalEmail = state.getCurrentUser()?.email;
  state.createUser({ name: "Aluno Teste Um", email: firstEmail });
  state.createUser({ name: "Aluno Teste Dois", email: secondEmail });
  state.setSession(firstEmail);
  state.updateCurrentUser((user) => { user.progress.xp = 40; });
  state.getUserByEmail(firstEmail).progress.xp; // 40
  state.getUserByEmail(secondEmail).progress.xp; // 0
  state.setSession(secondEmail);
  state.getCurrentUser().progress.xp; // 0
  if (originalEmail) {
    state.setSession(originalEmail);
  } else {
    state.clearSession();
  }
  storage.update("users", (users) => {
    delete users[firstEmail];
    delete users[secondEmail];
    return users;
  });
}

3. Corrupted JSON recovery (temporarily replaces application data; run in a fresh block):
{
  let previousRoot;
  let didReadRoot = false;
  try {
    previousRoot = localStorage.getItem("musicplay:v1");
    didReadRoot = true;
    localStorage.setItem("musicplay:v1", "{invalid json");
    const { getItem } = await import("/js/modules/storage.js");
    getItem("users", {}); // returns {}; the corrupted root is removed when possible
  } catch (error) {
    console.error("Não foi possível testar a recuperação do storage:", error);
  } finally {
    if (didReadRoot) {
      try {
        if (previousRoot === null) {
          localStorage.removeItem("musicplay:v1");
        } else {
          localStorage.setItem("musicplay:v1", previousRoot);
        }
      } catch (error) {
        console.error("Não foi possível restaurar os dados de teste:", error);
      }
    }
  }
}
*/
