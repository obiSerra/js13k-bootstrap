import createState from "./state.js";
import { pxXSec2PxXFrame } from "./engine.js";
import { hide, show, domElement } from "./domUtils.js";
import createMenu from "./menus.js";
import createEntity from "./entities.js";
import createController, { addEventListener } from "./controller.js";
import { renderText } from "./rendering.js";

import { generateMap, setCamera } from "./map.js";

import { playSound } from "./audio.js";

/**
 *  This file contains all the demo game logic
 *
 * Everithing interacts with the gameState that is than exported
 */

const gameState = createState({
  showFps: true,
  tileSize: 20,
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
    const renderCtrl = (msg, pos) =>
      renderText(gameState, msg, pos, "black", "60px sans-serif");
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

  const addKeyboardListener = (eventName, evtFunction) =>
    addEventListener(gameState, keyboardCtrl, eventName, evtFunction);

  addKeyboardListener("keydown", onKeyDown);
  addKeyboardListener("keyup", onKeyUp);
  gameState.addCtrl("main", keyboardCtrl);
}

gameState.updateGameStatus("init");

function startDemo(gameState) {
  gameState.removeAllCtrls();

  const player = createEntity({
    //position: getPointTile({ x: 400, y: 500 }),
    render: (currentState, entity) => {
      const ctx = gameState.getState("ctx");
      ctx.fillStyle = entity.color;

      ctx.beginPath();
      ctx.arc(
        Math.floor(entity.position.x),
        Math.floor(entity.position.y),
        10,
        0,
        2 * Math.PI
      );
      ctx.fill();
    },
  });
  demoControllers(gameState);

  gameState.updateGameStatus("play").updateState((gameData) => ({
    ...gameData,
    map: setCamera(
      generateMap(100, 100, gameData.tileSize),
      { x: 0, y: 0 },
      gameData.canvas.width,
      gameData.canvas.height
    ),
    demo: "1",
    minFpsRender: Infinity,
    minFps: Infinity,
    showGrid: false,

    entities: [
      createEntity({
        run: (gameState, element) => {
          const mv = gameState.getState("moveV");
          const mh = gameState.getState("moveH");

          let cameraPos = gameState.getState("map").cameraPos;
          if (mv === "up") {
            cameraPos.y -= 1;
          } else if (mv === "down") {
            cameraPos.y += 1;
          }
          if (mh === "left") {
            cameraPos.x -= 1;
          } else if (mh === "right") {
            cameraPos.x += 1;
          }
          gameState.updateState((gameData) => ({
            ...gameData,
            map: { ...gameData.setCamera, cameraPos },
          }));

          return element;
        },
      }),
    ],
  }));
  console.log(gameState.getState("map"));
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
  const playButton = domElement("#main-manu-sound");
  startBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    startDemo(gameState);
  });

  continueBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    gameState.updateGameStatus("play");
  });

  playButton.addEventListener("click", (evt) => {
    evt.preventDefault();

    const waveNote = (note) => ({ ...note, oscillator: "triangle" });

    const sectOctave = (note) => `${note}3`;
    playSound(gameState, waveNote({ note: sectOctave("G"), duration: 0.3 }))
      .then(() => playSound(gameState, waveNote({ note: null, duration: 0.3 })))
      .then(() =>
        playSound(gameState, waveNote({ note: sectOctave("G"), duration: 0.3 }))
      )
      .then(() => playSound(gameState, waveNote({ note: null, duration: 0.3 })))
      .then(() =>
        playSound(gameState, waveNote({ note: sectOctave("G"), duration: 0.3 }))
      )
      .then(() => playSound(gameState, waveNote({ note: null, duration: 0.3 })))
      .then(() =>
        playSound(
          gameState,
          waveNote({ note: sectOctave("D#"), duration: 0.4 })
        )
      )
      .then(() =>
        playSound(gameState, waveNote({ note: null, duration: 0.05 }))
      )
      .then(() =>
        playSound(
          gameState,
          waveNote({ note: sectOctave("A#"), duration: 0.2 })
        )
      )
      .then(() =>
        playSound(gameState, waveNote({ note: null, duration: 0.05 }))
      )
      .then(() =>
        playSound(gameState, waveNote({ note: sectOctave("G"), duration: 0.2 }))
      )
      .then(() => playSound(gameState, waveNote({ note: null, duration: 0.3 })))
      .then(() =>
        playSound(
          gameState,
          waveNote({ note: sectOctave("D#"), duration: 0.4 })
        )
      )
      .then(() =>
        playSound(gameState, waveNote({ note: null, duration: 0.05 }))
      )
      .then(() =>
        playSound(
          gameState,
          waveNote({ note: sectOctave("A#"), duration: 0.2 })
        )
      )
      .then(() =>
        playSound(gameState, waveNote({ note: null, duration: 0.05 }))
      )
      .then(() =>
        playSound(gameState, waveNote({ note: sectOctave("G"), duration: 0.2 }))
      );
  });

  const m = {
    render: (gameState) => {
      if (!!gameState.getState("demo")) {
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
