import { qSel, on } from "./dom_utils.js";
import { GImage } from "./img_render.js";
import { Game } from "./engine.js";
import { Entity, Point } from "./entity.js";

const canvas = qSel("canvas");
canvas.width = 800;
canvas.height = 600;

const ctx = canvas.getContext("2d");


class KeyControl {
  constructor(code) {
    this.active = false;
    this.code = code;
    on("keydown", (e) => this.setActive(e))
    on("keyup", (e) => this.setInactive(e))
    
  }

  setActive(e) {
    if (e.keyCode === this.code) {
      this.active = true;
    }
    
  }
  setInactive(e) {
    if (e.keyCode === this.code) {
      this.active = false;
    }
  }
}

const p = new Point(0, 0);
const img = new GImage("rocket");
img.w = 60;
img.rotate(90);
const rocket = new Entity(p, img);
const up = new KeyControl(38)
const down = new KeyControl(40)
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
