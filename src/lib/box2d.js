export class Box2d {
  constructor(box, point) {
    this.b = box;
    this.p = point;
    this.inertia = null;
  }


  rectangle(o) {
    const { x: l, y: t } = o.p;
    const { w, h } = o.b;
    return { l, t, r: l + w, b: t + h };
  }

  isColliding(oth) {
    const rect = this.rectangle(this);
    const oRect = this.rectangle(oth);

    return !(rect.r < oRect.l || rect.l > oRect.r || rect.b < oRect.t || rect.t > oRect.b);
  }
  collideDir(oth, vect) {
    const rect = this.rectangle(this);
    
    const oldRect = this.rectangle({ p: { x: this.p.x - vect.x, y: this.p.y - vect.y }, b: this.b });
    
    const oRect = this.rectangle(oth);
    
    return {
      r: oldRect.r < oRect.l && rect.r >= oRect.l,
      l: oldRect.l >= oRect.r && rect.l < oRect.r,
      t: oldRect.t >= oRect.b && rect.t < oRect.b,
      b: oldRect.b < oRect.t && rect.b >= oRect.t,
    };
  }

  renderBox(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.rect(this.p.x - this.b.w / 2, this.p.y - this.b.h / 2, this.b.w, this.b.h);
    ctx.stroke();
  }
}
