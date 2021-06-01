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
    this.pauseTrashold = 200
  }

  appendEntity(e) {
    this.entities.push(e);
  }

  run() {
    window.requestAnimationFrame(t => this.stepRender(t));
  }

  stepRender(timestamp) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.start) this.start = timestamp;
    const dt = timestamp - this.start;

    if (dt > this.pauseTrashold) {
        console.log("pause")
    }
    //this.entities = this.entities.map(e => e.update(dt));
    this.dt += dt;
    if (this.dt >= this.uFps) {
      this.dt = this.uFps % this.dt;
      this.entities = this.entities.map(e => e.update(this.dt));
    }
    this.tick++;
    this.entities.forEach(e => e.render(this.ctx));

    this.start = timestamp;
    window.requestAnimationFrame(this.stepRender.bind(this));
  }
}
