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
  tileSize: 10,
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

  demoControllers(gameState);

  gameState.updateGameStatus("play").updateState((gameData) => ({
    ...gameData,
    map: setCamera(
      generateMap(80, 60, gameData.tileSize),
      gameData.canvas.width,
      gameData.canvas.height
    ),
    demo: "1",
    minFpsRender: Infinity,
    minFps: Infinity,
    showGrid: false,

    entities: [
      createEntity({
        box: { w: 10, h: 10 },
        player: true,
        render: (gameState, player) => {
          if (!player.tiledPos) return false;
          const map = gameState.getState("map");
          const ctx = gameState.getState("ctx");
          ctx.beginPath();
          ctx.fillStyle = "green";

          ctx.arc(
            player.tiledPos.x * map.tsize,
            player.tiledPos.y * map.tsize,
            10,
            0,
            2 * Math.PI
          );
          ctx.fill();
        },
        collideBox: (element) => ({
          a: element.position.x - element.box.w,
          b: element.position.x + element.box.w,
          c: element.position.y - element.box.h,
          d: element.position.y + element.box.h,
        }),

        run: (gameState, element) => {
          const mv = gameState.getState("moveV");
          const mh = gameState.getState("moveH");
          if (element.borderCollide) {
            gameState.updateState((gameData) => {
              let cameraPos = gameData.map.cameraPos;
              const tsize = gameData.map.tsize;

              switch (element.borderCollide) {
                case "left":
                  cameraPos.x--;
                  element.position.x += tsize;
                  break;
                case "right":
                  cameraPos.x++;
                  element.position.x -= tsize;
                  break;
                case "top":
                  cameraPos.y--;
                  element.position.y += tsize;
                  break;
                case "bottom":
                  cameraPos.y++;
                  element.position.y -= tsize;
                  break;
              }
              const newData = {
                ...gameData,
                map: { ...gameData.map, cameraPos },
              };
              return newData;
            });
          }

          const adj = element.adj || [];

          const blocked = { t: false, r: false, b: false, l: false };

          adj.forEach((element, idx) => {
            if (!!element) {
              if (idx === 1) {
                blocked.t = true;
              }
              if (idx === 7) {
                blocked.b = true;
              }

              if (idx === 3) {
                blocked.l = true;
              }
              if (idx === 5) {
                blocked.r = true;
              }
            }
          });

          if (mv === "up" && element.borderCollide !== "top" && !blocked.t) {
            element.position.y -= 1;
          } else if (
            mv === "down" &&
            element.borderCollide !== "bottom" &&
            !blocked.b
          ) {
            element.position.y += 1;
          }
          if (mh === "left" && element.borderCollide !== "left" && !blocked.l) {
            element.position.x -= 1;
          } else if (
            mh === "right" &&
            element.borderCollide !== "right" &&
            !blocked.r
          ) {
            element.position.x += 1;
          }

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
