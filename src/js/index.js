/**
 * Application entry-point
 */

import { createStage, viewportDims, appendElement } from "./html.js";
import createState from "./state.js";
import gameLoop from "./engine.js";

//import "./styles/menu.scss";

const gameState = createState({
  showFps: true,
});

const canvas = createStage();
gameState.setState("canvas", canvas);
gameState.setState("ctx", canvas.getContext("2d"));
appendElement(canvas);

const mainMenu = { element: document.querySelector("#main-menu-container"), button: document.querySelector("#play-pause-btn") };

mainMenu.show = function () {
  mainMenu.element.style.display = "block";
};

mainMenu.hide = function () {
  mainMenu.element.style.display = "none";
};

mainMenu.button.addEventListener("click", (evt) => {
  console.log("CLICKKKK");
  evt.preventDefault();
  if (gameState.status() === "paused") {
    gameState.updateStatus("play");
  } else {
    gameState.updateStatus("paused");
  }
});

mainMenu.render = (gameState) => {
  const canvas = gameState.getState("canvas");
  mainMenu.element.style.position = "absolute";

  mainMenu.element.style.top = `${canvas.height - 50}px`;
  mainMenu.element.style.left = `${canvas.width - 130}px`;

  if (gameState.status() === "paused") {
    mainMenu.button.innerHTML = "resume";
  } else {
    mainMenu.button.innerHTML = "pause";
  }
};
gameState.updateState((state) => {
  return { ...state, menu: { main: mainMenu } };
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
console.log("FOOOo");
gameLoop(gameState);
