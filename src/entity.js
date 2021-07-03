import { GAnimation, GImage } from "./img_render";
import { Box2d } from "./box2d.js";

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

/**
 * class Entity
 *
 * Represent an entity in the game
 *
 */
export class Entity {
  constructor(position, sizes, speed = 0) {
    this.setBaseSpeed(speed);
    this.updateFns = [];
    this.vects = { x: 0, y: 0 };
    this.p = new Point(position[0], position[1]);
    this.b = new Box(...sizes);

    this.collision = {};
    this.actions = [];
  }

  setBox2D(inertia = null) {
    this.box2d = new Box2d(this.b, this.p);
    this.box2d.inertia = inertia;
  }

  setImage(image) {
    if (image && image instanceof GImage) {
      this.image = image;
      this.image.w = this.b.w;
      this.image.h = this.b.h;
    } else if (image && image instanceof GAnimation) {
      this.animation = image;
      const b = { w: this.b.w, h: this.b.h };
      this.animation.frames = this.animation.frames.map(f => {
        f.w = b.w;
        f.h = b.h;
        return f;
      });
    }
  }

  updatePosition(self) {
    self.p.x += self.vects.x;
    self.p.y += self.vects.y;
    return self;
  }

  setBaseSpeed(baseSpeed, maxSpeed = null) {
    this.s = baseSpeed / 1000;
    this.ms = maxSpeed || baseSpeed;
  }

  update(dt) {
    return [...this.updateFns, this.updatePosition].reduce((arg, fn) => fn(arg, dt), this);
  }

  bindUpdate(updateFn) {
    this.updateFns.push((self, dt) => updateFn(self, dt));
  }

  bindOnCollide(onCollideFn) {
    this.onCollide = c => onCollideFn(this, c);
  }

  render(ctx, tick) {
    if (this.box2d) {
      this.box2d.renderBox(ctx);
    }
    if (this.image) {
      ctx.drawImage(this.image.getImg(), this.p.x, this.p.y, this.image.w, this.image.h);
    } else if (this.animation) {
      const img = this.animation.getFrame(tick);
      ctx.drawImage(img.getImg(), this.p.x, this.p.y, img.w, img.h);
    }
  }

  move(dt, up, down, left, right) {
    const speedV = this.s * dt;

    // TO improve
    const applyInertia = vect => {
      const inertiaVal = 0.1;

      let iner = vect * inertiaVal;

      return iner;
    };

    if (up) {
      this.vects.y -= speedV;
    } else if (down) {
      this.vects.y += speedV;
    } else if (this.box2d.inertia) {
      this.vects.y -= applyInertia(this.vects.y);
    } else {
      this.vects.y = 0;
    }

    if (left) {
      this.vects.x -= speedV;
    } else if (right) {
      this.vects.x += speedV;
    } else if (this.box2d.inertia) {
      this.vects.x -= applyInertia(this.vects.x);
    } else {
      this.vects.x = 0;
    }

    if (Math.abs(this.vects.y) < 0.1) this.vects.y = 0;
  }
}
