import { qSel } from "./dom_utils.js";
import { GAnimation, GImage } from "./img_render.js";
import { Game } from "./engine.js";
import { KeyControl } from "./controls.js";
import { Entity, Point, Box } from "./entity.js";
import { Box2d } from "./box2d.js";

const canvas = qSel("canvas");
canvas.width = 800;
canvas.height = 600;

const ctx = canvas.getContext("2d");

const p = new Point(0, 0);
const d = new Box(60, 60);
const img = new GImage("robot");
img.w = d.w;
img.h = d.h;
const img2 = new GImage("robot-2");
img2.w = d.w;
img2.h = d.h;
const anim = new GAnimation([img, img2]);

const pEnemy = new Point(400, 200);
const imgEnemy = new GImage("robot");
imgEnemy.changeColor("#fc0", "red", "fill");
imgEnemy.changeColor("#0cf", "purple", "fill");

imgEnemy.w = 60;
imgEnemy.h = 60;
const enemy = new Entity(pEnemy, new Box(60, 60), imgEnemy, new Box2d(d, pEnemy));

const box = new Box2d(d, p);
const rocket = new Entity(p, d, anim, box);
const up = new KeyControl(38);
const down = new KeyControl(40);
const left = new KeyControl(37);
const right = new KeyControl(39);

rocket.bindOnCollide((self, c) => {
  console.log(c);

  return self;
});
rocket.bindUpdate((e, dt) => {
  const speed = (100 / 1000) * dt;
  const speedV = (200 / 1000) * dt;

  if (up.active) {
    e.p.y -= speedV;
  } else if (down.active) {
    e.p.y += speedV;
  } else if (left.active) {
    e.p.x -= speedV;
  } else if (right.active) {
    e.p.x += speedV;
  }
  
  e.p.x = e.p.x < -e.b.w ? 800 : e.p.x % 800;
  e.p.y = e.p.y < -e.b.h ? 600 : e.p.y % 600;

  return e;
});
const game = new Game({}, canvas, ctx);
game.appendEntity(rocket);
game.appendEntity(enemy);

game.run();
