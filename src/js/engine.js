import { renderText } from "./rendering.js";

const loopSpeed = Math.round(1000 / 60);
const cols = 100;
const row = 100;

function rowIndexToLetter(num, rows, height) {
  return String.fromCharCode(Math.floor(num / (height / rows)) + 97);
}

function generateSpacialHash(gameState) {
  const cols = 10;
  const row = 10;
  const entities = gameState.getState("entities", []);

  const canvas = gameState.getState("canvas");
  const cW = canvas.width / cols;
  const rW = canvas.height / row;

  const hash = entities.reduce(
    (acc, val) => {
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
  const canvas = gameState.getState("canvas");

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
          element = element.run(gameState, element);
        }
        return element;
      })
      .map((element) => {
        if (element && typeof element.onBorderCollide === "function") {
          if (element.position.x <= 0) {
            element.onBorderCollide(gameState, element, "left");
          } else if (element.position.x >= canvas.width) {
            element.onBorderCollide(gameState, element, "right");
          } else if (element.position.y <= 0) {
            element.onBorderCollide(gameState, element, "top");
          } else if (element.position.y >= canvas.height) {
            element.onBorderCollide(gameState, element, "bottom");
          }
        }
        return element;
      })
      .filter((element) => !!element),
  }));

  const startDebug = +new Date();

  // const spacialHash = generateSpacialHash(gameState, cols, row);

  // gameState
  //   .getState("entities", [])
  //   .map((el) => {
  //     el.isColliding = false;
  //     return el;
  //   })
  //   .forEach((element) => {
  //     for (let k in spacialHash) {
  //       if (k !== "config" && spacialHash.hasOwnProperty(k)) {
  //         if (spacialHash[k].some((v) => v.id === element.id)) {
  //           const ks = k.split("-");
  //           const c = parseInt(ks[0], 10);
  //           const r = ks[1].charCodeAt(0);
  //           let adj = [...spacialHash[k]];
  //           for (let i = 0; i < adj.length; i++) {
  //             if (
  //               (element.moving || adj[i].moving) &&
  //               adj[i].id !== element.id &&
  //               element.canCollide &&
  //               collide(element, adj[i])
  //             ) {
  //               element.isColliding = true;
  //             }
  //           }
  //         }
  //       }
  //     }
  //     return element;
  //   });
  //console.log("end", +new Date() - startDebug);

  gameState.setState("lastTime", now);
  setTimeout(() => gameLoop(gameState), loopSpeed);
}

function renderGrid(gameState, cols, row) {
  const canvas = gameState.getState("canvas");
  const ctx = gameState.getState("ctx");

  const cW = canvas.width / cols;
  const rW = canvas.height / row;

  for (let i = 0; i <= cols; i++) {
    ctx.beginPath(); // Start a new path
    ctx.strokeStyle = "red";
    ctx.moveTo(cW * i, 0);
    ctx.lineTo(cW * i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i <= row; i++) {
    ctx.beginPath(); // Start a new path
    ctx.strokeStyle = "blue";
    ctx.moveTo(0, rW * i);
    ctx.lineTo(canvas.width, rW * i);
    ctx.stroke();
  }
}

function drawBox(gameState, entity) {
  if (typeof entity.collideBox !== "function") return false;
  const ctx = gameState.getState("ctx");
  ctx.beginPath(); // Start a new path
  ctx.strokeStyle = "red";
  const cb = entity.collideBox(entity);
  ctx.moveTo(cb.a, cb.c);
  ctx.lineTo(cb.a, cb.d);
  ctx.lineTo(cb.b, cb.d);
  ctx.lineTo(cb.b, cb.c);
  ctx.lineTo(cb.a, cb.c);

  ctx.stroke();
}

export function renderLoop(gameState) {
  const renderFps = (msg, pos) =>
    renderText(gameState, msg, pos, "green", "10px sans-serif");
  const ctx = gameState.getState("ctx");
  const canvas = gameState.getState("canvas");
  const lastTime = gameState.getState("lastTimeRender", +new Date());
  const now = +new Date();
  const deltaTime = now - lastTime;

  const actualFps = Math.round(1000 / deltaTime);
  gameState.setState("actualFpsRender", actualFps);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const map = gameState.getState("map");
  ctx.fillStyle = "black";

  // TODO calculate and render only tiles in view
  if (map) {
    const pov = {
      x: canvas.width / 2 - map.cameraPos.x * map.tsize,
      y: canvas.height / 2 - map.cameraPos.y * map.tsize,
    };
    const startCol = Math.max(0, map.cameraPos.x - map.viewWidth / 2);
    const endCol = Math.min(map.cols, map.cameraPos.x + map.viewWidth / 2);
    const startRow = Math.max(0, map.cameraPos.y - map.viewHeight / 2);
    const endRow = Math.min(map.rows, map.cameraPos.y + map.viewHeight / 2);

    ctx.beginPath();
    ctx.fillStyle = "black";

    for (var c = startCol; c < endCol; c++) {
      for (var r = startRow; r < endRow; r++) {
        var tile = map.getTile(c, r);

        if (tile) {
          // 0 => empty tile
          ctx.rect(
            c * map.tsize + pov.x,
            r * map.tsize + pov.y,
            map.tsize,
            map.tsize
          );
        }
      }
    }
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "red";

    ctx.arc(
      Math.floor(map.cameraPos.x * map.tsize) + pov.x,
      Math.floor(map.cameraPos.y * map.tsize) + pov.y,
      10,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  renderFps(`${gameState.getState("actualFps")} FPS`, { x: 755, y: 580 });
  renderFps(`${gameState.getState("actualFpsRender")} FPSR`, {
    x: 755,
    y: 590,
  });

  if (gameState.getState("showGrid")) {
    renderGrid(gameState, cols, row);
  }

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
      drawBox(gameState, element);
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

  if (
    typeof el1.collideBox === "function" &&
    typeof el2.collideBox === "function"
  ) {
    const cb1 = el1.collideBox(el1);
    const cb2 = el2.collideBox(el2);
    return cb1.a < cb2.b && cb1.b > cb2.a && cb1.c < cb2.d && cb1.d > cb2.c;
  } else {
    return false;
  }
}
