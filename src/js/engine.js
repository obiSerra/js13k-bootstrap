import { renderText } from "./rendering.js";

const loopSpeed = Math.round(1000 / 75);

function rowIndexToLetter(num, rows, height) {
  return String.fromCharCode(Math.floor(num / (height / rows)) + 97);
}
function generateSpacialHash(gameState) {
  const entities = gameState.getState("entities", []);
  const cols = 10;
  const row = 10;
  const hash = entities.reduce(
    (acc, val) => {
      const canvas = gameState.getState("canvas");
      const pos = val.position;
      const c = Math.floor(pos.x / (canvas.width / cols));
      const r = rowIndexToLetter(pos.y, row, canvas.height);

      const idx = c + "-" + r;
      acc[idx] = acc[idx] || [];
      acc[idx].push(val);
      return acc;
    },
    { config: { cols: cols, row: row } }
  );

  return hash;
}

export default function gameLoop(gameState) {
  const tick = gameState.getState("tick", 0);
  const now = +new Date();
  const lastTime = gameState.getState("lastTime", +new Date());
  const deltaTime = now - lastTime;
  const actualFps = Math.round(1000 / deltaTime);

  gameState.setState("actualFps", actualFps);
  gameState.setState("tick", tick + 1);

  // Handle entities

  // Improve collision detection
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection

  gameState.updateState((gameData) => ({
    ...gameData,
    entities: gameState
      .getState("entities", [])
      .map((element) => {
        if (typeof element.run === "function") {
          element.run(gameState, element);
        }
        return element;
      })
      .filter((element) => !!element),
  }));

  const spacialHash = generateSpacialHash(gameState);
  gameState.getState("entities", []).forEach((element) => {
    for (let k in spacialHash) {
      if (k !== "config" && spacialHash.hasOwnProperty(k)) {
        if (spacialHash[k].some((v) => v.id === element.id)) {
          const ks = k.split("-");
          const c = parseInt(ks[0], 10);
          const r = ks[1].charCodeAt(0);
          let adj = [];
          for (let j = c - 1; j <= c + 1; j++) {
            for (let y = r - 1; y <= r + 1; y++) {
              if (spacialHash[j + "-" + String.fromCharCode(y)]) {
                adj = [...adj, ...spacialHash[j + "-" + String.fromCharCode(y)]];
              }
            }
          }

          for (let i = 0; i < adj.length; i++) {
            if ((element.moving || adj[i].moving) && adj[i].id !== element.id && typeof element.onCollide === "function" && collide(element, adj[i])) {
              element.onCollide(element, adj[i], gameState);
            }
          }
        }
      }
    }
    return element;
  });

  gameState.setState("lastTime", now);
  setTimeout(() => gameLoop(gameState), loopSpeed);
}

export function renderLoop(gameState) {
  const renderFps = (msg, pos) => renderText(gameState, msg, pos, "black", "10px sans-serif");
  const ctx = gameState.getState("ctx");
  const canvas = gameState.getState("canvas");
  const lastTime = gameState.getState("lastTimeRender", +new Date());
  const now = +new Date();
  const deltaTime = now - lastTime;

  const actualFps = Math.round(1000 / deltaTime);
  gameState.setState("actualFpsRender", actualFps);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderFps(`${gameState.getState("actualFps")} FPS`, { x: 755, y: 580 });
  renderFps(`${gameState.getState("actualFpsRender")} FPSR`, { x: 755, y: 590 });

  const entities = gameState.getState("entities", []);

  const menus = gameState.getState("menus");
  const ctrls = gameState.getState("ctrls");

  // Render menus
  for (const menuName in menus) {
    if (menus.hasOwnProperty(menuName)) {
      const menu = menus[menuName];
      if (typeof menu.render === "function") {
        menu.render(gameState);
      }
    }
  }
  for (const ctrlName in ctrls) {
    if (ctrls.hasOwnProperty(ctrlName)) {
      const ctrl = ctrls[ctrlName];
      if (typeof ctrl.render === "function") {
        ctrl.render(gameState);
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

export function collide(el1, el2) {
  const rect1 = { ...el1.position, ...el1.box };
  const rect2 = { ...el2.position, ...el2.box };

  return rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x && rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y;
}
