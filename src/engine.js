export class Game {
  constructor(config, canvas, ctx) {
    this.config = config;
    this.ctx = ctx;
    this.canvas = canvas;
    this.start = null;
    this.entities = [];
    this.tick = 0;
    this.uFps = 1000 / 60;
    this.dt = 0;
    this.pauseTrashold = 200;
  }

  appendEntity(e) {
    this.entities.push(e);
  }

  run() {
    window.requestAnimationFrame(t => this.stepRender(t));
  }

  collisions() {
    const boxed = this.entities.filter(e => !!e.box2d);
    for (let i in boxed) {
      const a = boxed[i];
      const bxA = a.box2d;
      for (let j in boxed) {
        if (j !== i) {
          const b = boxed[j];
          const bxB = b.box2d;

          const ov = !(
            bxA.p.x + bxA.b.w < bxB.p.x ||
            bxA.p.x > bxB.p.x + bxB.b.w ||
            bxA.p.y + bxA.b.h < bxB.p.y ||
            bxA.p.y > bxB.p.y + bxB.b.h
          );

          if (ov && a.onCollide) {
            console.log(a);

            a.onCollide(a);
          }
        }
      }
    }
  }

  stepRender(timestamp) {
    if (!this.start) this.start = timestamp;
    const dt = timestamp - this.start;

    if (dt > this.pauseTrashold) {
      console.log("pause");
    }
    this.dt += dt;
    if (this.dt >= this.uFps) {
      this.tick++;
      this.dt = this.uFps % this.dt;
      this.entities = this.entities.map(e => e.update(this.dt));
    }
    this.collisions();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.entities.forEach(e => e.render(this.ctx, this.tick));

    this.start = timestamp;
    window.requestAnimationFrame(this.stepRender.bind(this));
  }
}
