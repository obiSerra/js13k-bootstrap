import svg_images from "./svg_map.js";

const imgMap = svg_images();

export class GImage {
  constructor(imgName) {
    const parser = new DOMParser();
    const img = imgMap[imgName];
    const doc = parser.parseFromString(img, "image/svg+xml");
    this.svg = doc.querySelector("svg");
    this.t = {};
    this.w = this.svg.width.baseVal.value;
    this.h = this.svg.height.baseVal.value;
  }

  _setAtt(name, val) {
    this.svg.setAttribute(name, val);
  }

  _setAllAtt() {
    if (this.h) this._setAtt("height", this.h);
    if (this.w) this._setAtt("width", this.w);

    const trs = Object.keys(this.t).reduce((acc, k) => {
      acc += `${k}(${this.t[k]}) `;
      return acc;
    }, "");
   
    this._setAtt("transform", trs)
  }

  setT(name, vals) {
    this.t[name] = vals;
  }
  getT(name) {
    return this.t[name] ?? null;
  }

  rotate(angle) {
    this.setT("rotate", angle);
  }
  getRotate() {
    return this.getT("rotate");
  }

  getImg() {
    this._setAllAtt();
    const s = new XMLSerializer();
    const svg64 = btoa(s.serializeToString(this.svg));
    const b64Start = "data:image/svg+xml;base64,";

    const image64 = b64Start + svg64;

    const img = new Image();
    img.src = image64;
    return img;
  }
}

export function renderImage(imgName, width = null, height = null) {
  const parser = new DOMParser();
  const img = imgMap[imgName];
  const doc = parser.parseFromString(img, "image/svg+xml");
  const svg = doc.querySelector("svg");

  const angle = 20;
  svg.setAttribute("height", 70);
  svg.setAttribute("transform", `rotate(${angle})`);
  const s = new XMLSerializer();

  var svg64 = btoa(s.serializeToString(svg));
  var b64Start = "data:image/svg+xml;base64,";

  var image64 = b64Start + svg64;
  const img2 = new Image();

  img2.src = image64;
  return img2;
}
