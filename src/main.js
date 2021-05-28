import { qSel } from "./dom_utils.js";
import { renderImage, GImage } from "./img_render.js";

const canvas = qSel("canvas");
canvas.width = 800;
canvas.height = 600;

const ctx = canvas.getContext("2d");

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const p = new Point(0, 0);
const mSyp  = new GImage("maple-syrup")
mSyp.rotate(10)
let start;
function step(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  p.x++;
  p.y++;
  
  if (start === undefined) start = timestamp;
  const elapsed = timestamp - start;
  const img = renderImage("maple-syrup")
  
  
  ctx.drawImage(mSyp.getImg(), p.x, p.y);

  //ctx.drawImage(img, p.x, p.y);

  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
