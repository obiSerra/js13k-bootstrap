import createState from "./state.js";
import { pxXSec2PxXFrame } from "./engine.js";
import { hide, show, setStageDim, domElement } from "./domUtils.js";
import createMenu from "./menus.js";
import createEntity from "./entities.js";
import createController, { addEventListener } from "./controller.js";
import { renderText } from "./rendering.js";

/**
 *  This file contains all the demo game logic
 *
 * Everithing interacts with the gameState that is than exported
 */

const gameState = createState({
  showFps: true,
});

function demoControllers(gameState) {
  const onKeyDown = (event, ctrl, gameState) => {
    const keyName = event.key;
    switch (keyName) {
      case "ArrowUp":
        gameState.setState("moveV", "up");
        break;
      case "ArrowDown":
        gameState.setState("moveV", "down");
        break;
      case "ArrowLeft":
        gameState.setState("moveH", "left");
        break;
      case "ArrowRight":
        gameState.setState("moveH", "right");
        break;
      default:
        break;
    }
  };

  const onKeyUp = (event, ctrl, gameState) => {
    const keyName = event.key;

    switch (keyName) {
      case "ArrowUp":
      case "ArrowDown":
        gameState.setState("moveV", null);
      case "ArrowLeft":
      case "ArrowRight":
        gameState.setState("moveH", null);
      default:
        break;
    }
  };

  const initCtrl = {};

  const keyboardCtrl = createController(initCtrl);

  keyboardCtrl.render = (gameState) => {
    const renderCtrl = (msg, pos) => renderText(gameState, msg, pos, "black", "60px sans-serif");
    const mv = gameState.getState("moveV");
    const mh = gameState.getState("moveH");
    if (mv === "up") {
      renderCtrl("\u21E7", { x: 100, y: 100 });
    } else if (mv === "down") {
      renderCtrl("\u21E9", { x: 100, y: 100 });
    }
    if (mh === "left") {
      renderCtrl("\u21E6", { x: 100, y: 100 });
    } else if (mh === "right") {
      renderCtrl("\u21E8", { x: 100, y: 100 });
    }
  };

  const addKeyboardListener = (eventName, evtFunction) => addEventListener(gameState, keyboardCtrl, eventName, evtFunction);

  addKeyboardListener("keydown", onKeyDown);
  addKeyboardListener("keyup", onKeyUp);
  gameState.addCtrl("main", keyboardCtrl);
}

gameState.updateGameStatus("init");
const canvas = document.getElementById("stage");
setStageDim(canvas);
gameState.setState("canvas", canvas);
gameState.setState("ctx", canvas.getContext("2d"));

function startDemo1(gameState) {
  // Add the game Elements

  gameState.removeAllCtrls();

  const greenSq = createEntity({
    position: { x: 0, y: 200 },
    box: { w: 50, h: 50 },
    pxXSec: 120,
    moving: true,
    run: (gameState, entity) => {
      if (gameState.gameStatus() === "play") {
        let x = entity.position.x;
        let y = entity.position.y;

        const mv = gameState.getState("moveV");
        const mh = gameState.getState("moveH");
        if (mv === "up") {
          y -= pxXSec2PxXFrame(entity.pxXSec, gameState);
        } else if (mv === "down") {
          y += pxXSec2PxXFrame(entity.pxXSec, gameState);
        }
        if (mh === "left") {
          x -= pxXSec2PxXFrame(entity.pxXSec, gameState);
        } else if (mh === "right") {
          x += pxXSec2PxXFrame(entity.pxXSec, gameState);
        }

        entity.position.x = x;

        entity.position.y = y;
      }
      return entity;
    },
    render: (gameState, entity) => {
      const ctx = gameState.getState("ctx");

      ctx.fillStyle = "green";
      ctx.fillRect(Math.floor(entity.position.x), entity.position.y, entity.box.w, entity.box.h);
    },
    onCollide: (self, other) => self,
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
          ctx.fillRect(Math.floor(entity.position.x), entity.position.y, entity.box.w, entity.box.h);
        },
        onCollide: (obstacle, other, gameState) => {
          obstacle.color = "pink";
          gameState.updateState((gameData) => ({
            ...gameData,
            entities: gameData.entities.filter((e) => e.id !== obstacle.id),
          }));
        },
      })
    );
  }

  gameState.updateGameStatus("play").updateState((gameState) => ({
    ...gameState,
    demo: "1",
    entities: [greenSq, ...obstacles],
  }));

  demoControllers(gameState);
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
    render: (gameState) => {
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
    },
  };

  button.addEventListener("click", (evt) => {
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
  startBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    startDemo1(gameState);
  });

  continueBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    gameState.updateGameStatus("play");
  });

  const m = {
    render: (gameState) => {
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
    },
  };
  return { ...menu, ...m };
});

// Add the menus to the game state
gameState.updateState((state) => {
  return { ...state, menus: { pause: pauseMenu, main: mainMenu } };
});

export default gameState;
