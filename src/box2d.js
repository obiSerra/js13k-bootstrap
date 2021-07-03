export class Box2d {
  constructor(box, point) {
    this.b = box;
    this.p = point;
    this.inertia = null;
  }

  updateSpeed(){
      
  }

  renderBox(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.rect(this.p.x, this.p.y, this.b.w, this.b.h);
    ctx.stroke();
  }
}
