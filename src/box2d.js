
export class Box2d {
    constructor(b, p) {
        this.b = b
        this.p = p
    } 

    renderBox(ctx) {
        ctx.beginPath()
        ctx.strokeStyle = 'red'
        ctx.rect(this.p.x, this.p.y, this.b.w, this.b.h);
        ctx.stroke();
    }
}