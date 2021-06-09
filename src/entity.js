import { GAnimation, GImage } from "./img_render";

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
export class Box {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
}

export class Entity {
  constructor(p, b, image = null, box2d = null) {
    this.p = p;
    this.b = b
    this.box2d = box2d;
    this.actions = []
    if (image && image instanceof GImage) {
      this.image = image;
    } else if (image && image instanceof GAnimation) {
      this.animation = image;
    }
  }

  update(dt) {
    if (typeof this.updateFn === "function") return this.updateFn(dt);
    else return this;
  }

  bindUpdate(updateFn) {
    this.updateFn = dt => updateFn(this, dt);
  }

  bindOnCollide(onCollideFn) {
    this.onCollide = c => onCollideFn(this, c)
  }


  render(ctx, tick) {
    if (this.box2d) {
      this.box2d.renderBox(ctx);
    }
    if (this.image){
      ctx.drawImage(this.image.getImg(), this.p.x, this.p.y, this.image.w, this.image.h);
    } 
    else if (this.animation) {
      const img = this.animation.getFrame(tick);
      ctx.drawImage(img.getImg(), this.p.x, this.p.y, img.w, img.h);
    }
  }
}
