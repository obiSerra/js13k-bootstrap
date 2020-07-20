const loopSpeed = Math.round(1000 / 75);

function renderFps(pos, val, ctx) {
  const fontSize = 10;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = "black";
  ctx.fillText(val, pos.x, pos.y);
}
export default function gameLoop(gameState) {
  const tick = gameState.getState("tick", 0);
  const now = +new Date();
  const lastTime = gameState.getState("lastTime", +new Date());
  const deltaTime = now - lastTime;
  const actualFps = Math.round(1000 / deltaTime);

  gameState.setState("actualFps", actualFps);
  gameState.setState("tick", tick + 1);
  const entities = gameState.getState("entities", []);

  // Handle entities
  gameState.updateState((gameData) => ({
    ...gameData,
    entities: entities
      .map((element) => {
        if (typeof element.run === "function") {
          return element.run(gameState, element);
        } else {
          return element;
        }
      })
      .filter((element) => !!element),
  }));

  gameState.setState("lastTime", now);
  setTimeout(() => gameLoop(gameState), loopSpeed);
}

export function renderLoop(gameState) {
  const ctx = gameState.getState("ctx");
  const canvas = gameState.getState("canvas");
  const lastTime = gameState.getState("lastTimeRender", +new Date());
  const now = +new Date();
  const deltaTime = now - lastTime;

  const actualFps = Math.round(1000 / deltaTime);
  gameState.setState("actualFpsRender", actualFps);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderFps({x: 755, y: 580}, `${gameState.getState("actualFps")} FPS`, ctx);
  renderFps({x: 755, y: 590}, `${gameState.getState("actualFpsRender")} FPSR`, ctx);

  const entities = gameState.getState("entities", []);

  const menus = gameState.getState("menu");

  // Render menus
  for (const menu in menus) {
    if (menus.hasOwnProperty(menu)) {
      if (typeof menus[menu].render === "function") {
        menus[menu].render(gameState);
      }
    }
  }
  entities.forEach((element) => {
    if (typeof element.render === "function") {
      element.render(gameState, element);
    }
  });
  gameState.setState("lastTimeRender", now);

  window.requestAnimationFrame(() => renderLoop(gameState));
}
export function pxXSec2PxXFrame(px, gameState) {
  const fps = gameState.getState("actualFps");
  return px / fps;
}
