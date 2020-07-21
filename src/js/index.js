/**
 * Application entry-point
 */

import createState from "./state.js";
import gameLoop, { renderLoop, pxXSec2PxXFrame } from "./engine.js";
import { hide, show, setStageDim, domElement } from "./domUtils.js";
import createMenu from "./menus.js";
import createEntity from "./entities.js";

const gameState = createState({
  showFps: true
});
gameState.updateGameStatus("init");
const canvas = document.getElementById("stage");
setStageDim(canvas);
gameState.setState("canvas", canvas);
gameState.setState("ctx", canvas.getContext("2d"));

function startDemo1(gameState) {
  // Add the game Elements
  const greenSq = createEntity({
    position: { x: 0, y: 200 },
    box: { w: 50, h: 50 },
    pxXSec: 70,
    moving: true,
    run: (gameState, entity) => {
      if (gameState.gameStatus() === "play") {
        entity.position.x += pxXSec2PxXFrame(entity.pxXSec, gameState);
      }
      return entity;
    },
    render: (gameState, entity) => {
      const ctx = gameState.getState("ctx");

      ctx.fillStyle = "green";
      ctx.fillRect(
        Math.floor(entity.position.x),
        entity.position.y,
        entity.box.w,
        entity.box.h
      );
    },
    onCollide: (self, other) => self
  });

  const obstacles = [];

  for (let i = 0; i < 200; i++) {
    obstacles.push(
      createEntity({
        position: { x: Math.random() * 800, y: Math.random() * 600 },

        box: { w: 10, h: 10 },
        color: "blue",
        run: (currentState, entity) => {
          entity.color = "blue";
          return entity;
        },
        render: (currentState, entity) => {
          const ctx = gameState.getState("ctx");
          ctx.fillStyle = entity.color;
          ctx.fillRect(
            Math.floor(entity.position.x),
            entity.position.y,
            entity.box.w,
            entity.box.h
          );
        },
        onCollide: (obstacle, other, gameState) => {
          obstacle.color = "pink";
          gameState.updateState(gameData => ({
            ...gameData,
            entities: gameData.entities.filter(e => e.id !== obstacle.id)
          }));
        }
      })
    );
  }

  gameState.updateGameStatus("play").updateState(gameState => ({
    ...gameState,
    demo: "1",
    entities: [greenSq, ...obstacles]
  }));
}
/**
 * Create the game elements
 */
// Menus
const pauseMenu = createMenu(gameState, (menu, gameState) => {
  const button = domElement("#play-pause-btn");
  const element = domElement("#pause-menu-container");
  const menuInit = {
    show: () => show(element),
    hide: () => hide(element),
    element: element,
    button: button,
    render: gameState => {
      // Dynamic menu position
      const canvas = gameState.getState("canvas");
      element.style.position = "absolute";

      element.style.top = `${canvas.height - 50}px`;
      element.style.left = `${canvas.width - 100}px`;
      if (gameState.gameStatus() === "play") {
        show(element);
      } else {
        hide(element);
      }
    }
  };

  button.addEventListener("click", evt => {
    evt.preventDefault();
    if (gameState.gameStatus() === "paused") {
      gameState.updateGameStatus("play");
    } else {
      gameState.updateGameStatus("paused");
    }
  });
  return { ...menu, ...menuInit };
});

const mainMenu = createMenu(gameState, (menu, gameState) => {
  const menuContainer = domElement("#main-menu-container");
  const startBtn = domElement("#main-manu-start");
  const continueBtn = domElement("#main-manu-continue");
  startBtn.addEventListener("click", evt => {
    evt.preventDefault();
    startDemo1(gameState);
  });

  continueBtn.addEventListener("click", evt => {
    evt.preventDefault();
    gameState.updateGameStatus("play");
  });

  const m = {
    render: gameState => {
      if (gameState.getState("demo") === "1") {
        show(continueBtn);
      } else {
        hide(continueBtn);
      }
      if (gameState.gameStatus() === "play") {
        hide(menuContainer);
      } else {
        show(menuContainer);
      }
    }
  };
  return { ...menu, ...m };
});

// Add the menus to the game state
gameState.updateState(state => {
  return { ...state, menu: { pause: pauseMenu, main: mainMenu } };
});

// Starting the game loop
gameLoop(gameState);
renderLoop(gameState);
