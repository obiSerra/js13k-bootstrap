import { on } from "./dom_utils.js";
export class KeyControl {
    constructor(code) {
      this.active = false;
      this.code = code;
      on("keydown", (e) => this.setActive(e))
      on("keyup", (e) => this.setInactive(e))
      
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