export default class InputHandler {
  constructor() {
    this.pressed = [];
    this.keyset = { W: 87, A: 65, S: 83, D: 68 };
  }

  isPressed(keyCode) {
    return !!this.pressed[keyCode];
  }

  onKeydown(e) {
    this.pressed[e.keyCode] = true;
  }

  onKeyup(e) {
    delete this.pressed[e.keyCode];
  }

  startKeyMonitoring() {
    document.addEventListener("keyup", (e) => this.onKeyup(e), false);
    document.addEventListener("keydown", (e) => this.onKeydown(e), false);
  }
}
