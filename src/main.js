import { qSel } from "./lib/dom_utils.js";
import { GAnimation, GImage } from "./lib/img_render.js";
import { Game } from "./lib/engine.js";
import { KeyControl, baseMovCtrl } from "./lib/controls.js";
import { Entity } from "./lib/entity.js";

const canvas = qSel("canvas");
canvas.width = 800;
canvas.height = 600;

const ctx = canvas.getContext("2d");

const anim = new GAnimation([new GImage("robot"), new GImage("robot-2")]);

const imgEnemy = new GImage("robot");
imgEnemy.changeColor("#fc0", "red", "fill");
imgEnemy.changeColor("#0cf", "purple", "fill");

const enemy = new Entity([400, 200], [60, 60]);
enemy.setBox2D(true);
enemy.setImage(imgEnemy);


const rocket = new Entity([0, 0], [60, 60]);
rocket.setBox2D(true);
rocket.setImage(anim);
rocket.setBaseSpeed(20);
const up = new KeyControl(38);
const down = new KeyControl(40);
const left = new KeyControl(37);
const right = new KeyControl(39);

rocket.bindOnCollide(true);

rocket.bindUpdate(baseMovCtrl(up, down, left, right));

rocket.bindUpdate((e, dt) => {
  e.p.x = e.p.x < -e.b.w ? 800 : e.p.x % 800;
  e.p.y = e.p.y < -e.b.h ? 600 : e.p.y % 600;

  return e;
});
const game = new Game({}, canvas, ctx);
game.appendEntity(rocket);
game.appendEntity(enemy);

game.run();
