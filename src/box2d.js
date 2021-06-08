export class Box2d {
    constructor(w, h, p) {
        this.w = w
        this.h = h
        this.p = p
    } 

    renderBox(ctx) {
        ctx.beginPath()
        ctx.strokeStyle = 'red'
        ctx.rect(this.p.x, this.p.y, this.w, this.h);
        ctx.stroke();
    }
}