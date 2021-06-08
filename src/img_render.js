// svg <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

import svg_images from "./svg_map.js";

const imgMap = svg_images();

export class GImage {
  constructor(imgName) {
    const parser = new DOMParser();
    const img = imgMap[imgName];
    this.fmt = "image/svg+xml";
    this.b64Fmt = `data:${this.fmt};base64,`;

    const doc = parser.parseFromString(img, this.fmt);
    this.svg = doc.querySelector("svg");
    this.t = {};
    this.origin_w = this.w = this.svg.width.baseVal.value;
    this.origin_h = this.h = this.svg.height.baseVal.value;

    console.log(this.svg, this.w, this.h);
  }

  _setAtt(name, val) {
    this.svg.setAttribute(name, val);
  }

  _setAllAtt() {
    const trs = Object.keys(this.t).reduce((acc, k) => {
      acc += `${k}(${this.t[k]}) `;
      return acc;
    }, "");
    this._setAtt("transform", trs);
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

  getImg(cached = true) {
    if (cached && this.img) return this.img;
    this._setAllAtt();
    const s = new XMLSerializer();
    const svg64 = btoa(s.serializeToString(this.svg));
    const image64 = this.b64Fmt + svg64;

    const img = new Image();
    img.src = image64;
    this.img = img;
    return img;
  }
}

export class GAnimation {
  constructor(frames) {
    this.frames = frames;
    this.frameRate = 10;
  }
  _currentFrame(tick) {
    return Math.round(tick / this.frameRate) % this.frames.length;
  }

  getFrame(tick) {
    return this.frames[this._currentFrame(tick)];
  }
}
