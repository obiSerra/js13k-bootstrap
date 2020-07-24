/**
 * Application entry-point
 */

import gameLoop, { renderLoop } from "./engine.js";
import gameState from "./_demo.js";

// Starting the game loop
gameLoop(gameState);
renderLoop(gameState);
