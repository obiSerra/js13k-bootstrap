/**
 * Application entry-point
 */

import createState from "./state.js";
import gameLoop from "./engine.js";
import { hide, show, setStageDim, domElement } from "./domUtils.js";
import createMenu from "./menus.js";

const gameState = createState({
  showFps: true,
});
gameState.updateStatus("init");
const canvas = document.getElementById("stage");
setStageDim(canvas);
gameState.setState("canvas", canvas);
gameState.setState("ctx", canvas.getContext("2d"));

const pauseMenu = createMenu(gameState, (menu, gameState) => {
  const button = domElement("#play-pause-btn");
  const element = domElement("#pause-menu-container");
  const menuInit = {
    show: () => show(element),
    hide: () => hide(element),
    element: element,
    button: button,
    render: (gameState) => {
      // Dynamic menu position
      const canvas = gameState.getState("canvas");
      element.style.position = "absolute";

      element.style.top = `${canvas.height - 50}px`;
      element.style.left = `${canvas.width - 100}px`;
      if (gameState.status() === "play") {
        show(element);
      } else {
        hide(element);
      }
    },
  };

  button.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (gameState.status() === "paused") {
      gameState.updateStatus("play");
    } else {
      gameState.updateStatus("paused");
    }
  });
  return { ...menu, ...menuInit };
});

const mainMenu = createMenu(gameState, (menu, gameState) => {
  const menuContainer = domElement("#main-menu-container");
  const startBtn = domElement("#main-manu-start");
  startBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    gameState.updateStatus("play");
  });

  const m = {
    render: (gameState) => {
      if (gameState.status() === "play") {
        hide(menuContainer);
      } else {
        show(menuContainer);
      }
    },
  };
  return { ...menu, ...m };
});

gameState.updateState((state) => {
  return { ...state, menu: { pause: pauseMenu, main: mainMenu } };
});

// const greenSq = {
//   render: (gameState) => {
//     const ctx = gameState.getState("ctx");

//     ctx.fillStyle = "green";
//     ctx.fillRect(10, 10, 150, 100);
//   },
// };

// const pinkSq = {
//   render: (gameState) => {
//     const ctx = gameState.getState("ctx");

//     ctx.fillStyle = "pink";
//     ctx.fillRect(100, 20, 150, 100);
//   },
// };
// gameState.updateState((state) => {
//   const entities = state["entities"] || [];
//   return { ...state, entities: [...entities, greenSq] };
// });

// gameState.updateState((state) => {
//   const entities = state["entities"] || [];
//   return { ...state, entities: [...entities, pinkSq] };
// });

// Starting the game loop
gameLoop(gameState);
