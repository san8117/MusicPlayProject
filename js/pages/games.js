import { showToast } from "../modules/toast.js";

const COMING_SOON_MESSAGE = "Esse jogo chega em breve! 🎮 Que tal o Quiz Musical por enquanto?";

/**
 * Initializes the games list, keeping the Quiz Musical as its only active game.
 *
 * @param {ParentNode} root Page root used to find game cards and links.
 * @returns {void}
 */
export function initializeGamesPage(root = document) {
  const main = root.querySelector(".games-page");

  if (!main) {
    return;
  }

  main.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest("a[href]");

    if (!link || !main.contains(link)) {
      return;
    }

    if (link.closest(".featured-game")) {
      event.preventDefault();
      showToast(COMING_SOON_MESSAGE, { type: "info" });
      return;
    }

    const game = link.closest("[data-game-id]");

    if (game && game.dataset.gameId !== "music-quiz") {
      event.preventDefault();
      showToast(COMING_SOON_MESSAGE, { type: "info" });
    }
  });
}
