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
  state.createUser({ name: "Aluno Teste Um", email: firstEmail });
  state.createUser({ name: "Aluno Teste Dois", email: secondEmail });
  state.setSession(firstEmail);
  state.updateCurrentUser((user) => { user.progress.xp = 40; });
  state.getUserByEmail(firstEmail).progress.xp; // 40
  state.getUserByEmail(secondEmail).progress.xp; // 0
  state.setSession(secondEmail);
  state.getCurrentUser().progress.xp; // 0
  state.clearSession();
  storage.update("users", (users) => {
    delete users[firstEmail];
    delete users[secondEmail];
    return users;
  });
}

3. Corrupted JSON recovery (temporarily replaces application data; run in a fresh block):
{
  const previousRoot = localStorage.getItem("musicplay:v1");
  localStorage.setItem("musicplay:v1", "{invalid json");
  const { getItem } = await import("/js/modules/storage.js");
  getItem("users", {}); // returns {}; the corrupted root is removed when possible
  if (previousRoot === null) {
    localStorage.removeItem("musicplay:v1");
  } else {
    localStorage.setItem("musicplay:v1", previousRoot);
  }
}
*/
