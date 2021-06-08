import { qSel } from "./dom_utils.js";
import { GAnimation, GImage } from "./img_render.js";
import { Game } from "./engine.js";
import { KeyControl } from "./controls.js";
import { Entity, Point } from "./entity.js";
import { Box2d } from "./box2d.js";

const canvas = qSel("canvas");
canvas.width = 800;
canvas.height = 600;

const ctx = canvas.getContext("2d");

const p = new Point(0, 0);
const img = new GImage("robot");
img.w = 60;
img.h = 60;
const img2 = new GImage("robot-2");
img2.w = 60;
img2.h = 60;
const anim = new GAnimation([img, img2]);
const box = new Box2d(60, 60, p);
const rocket = new Entity(p, anim, box);
const up = new KeyControl(38);
const down = new KeyControl(40);
rocket.bindUpdate((e, dt) => {
  const speed = (100 / 1000) * dt;
  const speedV = (200 / 1000) * dt;

  if (up.active) {
    e.p.y -= speedV;
  } else if (down.active) {
    e.p.y += speedV;
  }
  if (e.p.x > 800) {
    e.p.x = 0;
  }
  e.p.x += speed;

  return e;
});
const game = new Game({}, canvas, ctx);
game.appendEntity(rocket);

game.run();
