import { on } from "./dom_utils.js";
export class KeyControl {
  constructor(code) {
    this.active = false;
    this.code = code;
    on("keydown", e => this.setActive(e));
    on("keyup", e => this.setInactive(e));
  }

  setActive(e) {
    if (e.keyCode === this.code) {
      this.active = true;
    }
  }
  setInactive(e) {
    if (e.keyCode === this.code) {
      this.active = false;
    }
  }
}

export function baseMovCtrl(up, down, left, right) {
  return (e, dt) => {
    e.move(dt, up.active, down.active, left.active, right.active);

    return e;
  };
}
