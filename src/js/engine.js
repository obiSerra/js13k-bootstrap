const loopSpeed = Math.round(1000 / 30);

function renderFps(val, ctx, canvas) {
  const fontSize = 10;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = "black";
  ctx.fillText(`${val} FPS`, canvas.width - 4 * fontSize, fontSize * 1.5);
}
export default function gameLoop(gameState) {
  const tick = gameState.getState("tick", 0);
  const lastTime = gameState.getState("lastTime", +new Date());
  const now = +new Date();
  const deltaTime = now - lastTime;
  const actualFps = Math.round(1000 / deltaTime);

  gameState.setState("tick", tick + 1);

  const entities = gameState.getState("entities", []);

  const ctx = gameState.getState("ctx");
  const canvas = gameState.getState("canvas");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderFps(actualFps, ctx, canvas);

  const fontSize = 50;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = "black";

  const menus = gameState.getState("menu");

  for (const menu in menus) {
    if (menus.hasOwnProperty(menu)) {
      if (typeof menus[menu].render === "function") {
        menus[menu].render(gameState);
      }
    }
  }

  entities.forEach((element) => {
    if (typeof element.render === "function") {
      //element.render(gameState);
    }
  });
  //console.log(gameState.status());
  gameState.setState("lastTime", now);
  setTimeout(() => gameLoop(gameState), loopSpeed);
}
