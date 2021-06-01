export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Entity {
    constructor(p, image = null) {
      this.p = p;
      if (image) {
        this.image = image.getImg();
      }
    }
  
    update() {}
  
    bindUpdate(updateFn) {
      this.update = dt => updateFn(this, dt);
    }
  
    render(ctx) {
      ctx.drawImage(this.image, this.p.x, this.p.y);
    }
  }