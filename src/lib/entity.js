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

export class Entity {
  constructor(position, sizes, speed = 0) {
    this.setBaseSpeed(speed);
    this.updateFns = [];
    this.vects = { x: 0, y: 0 };
    this.p = new Point(position[0] + sizes[0] / 2, position[1] + sizes[1] / 2);
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

  _onCollide(b) {
    const { x, y } = this.vects;

    
    const collDir = this.box2d.collideDir(b, this.vects)
    // Adjust overlapping pos
    while (this.box2d.isColliding(b)) {
      if (x) {
        this.p.x -= this.s * x;
      }

      if (y) {
        this.p.y -= this.s * y;
      }
    }

    const elast = 0.5;

    if (collDir.l || collDir.r) this.vects.x = -1 * elast * x;
    if (collDir.t || collDir.b) this.vects.y = -1 * elast * y;
  }

  bindOnCollide(onCollideFn) {
    this.onCollide = c => {
      this._onCollide(c);
      if (typeof onCollideFn === "function") return onCollideFn(this, c);
      return this;
    };
  }

  aVector() {
    const { x: vx, y: vy } = this.vects;
    return { a: Math.atan2(vy, vx), f: Math.sqrt(vy * vy + vx * vx) };
  }

  render(ctx, tick) {
    if (this.image) {
      ctx.drawImage(this.image.getImg(), this.p.x - this.b.w / 2, this.p.y - this.b.h / 2, this.image.w, this.image.h);
    } else if (this.animation) {
      const img = this.animation.getFrame(tick);
      ctx.drawImage(img.getImg(), this.p.x - this.b.w / 2, this.p.y - this.b.h / 2, img.w, img.h);
    }

    if (this.box2d) {
      this.box2d.renderBox(ctx);
      if (this.vects.x || this.vects.y) {
        const { a, f } = this.aVector();
        let { x, y } = this.p;

        const d = Math.min(f, Math.max(this.b.w, this.b.h)) * 2;
        ctx.beginPath(); // Start a new path
        ctx.moveTo(x, y); // Move the pen to (30, 50)
        const xx = x + d * Math.cos(a);
        const yy = y + d * Math.sin(a);
        ctx.lineTo(xx, yy); // Draw a line to (150, 100)
        ctx.stroke();
      }
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
    if (Math.abs(this.vects.x) < 0.1) this.vects.x = 0;
  }
}
