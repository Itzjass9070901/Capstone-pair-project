export class InputHandler {
    constructor() {
      this.keys = new Set();

      window.addEventListener("keydown", (e) => {
        if (e.key === " ") e.preventDefault();
        this.keys.add(e.key);
      });

      window.addEventListener("keyup", (e) => {
        this.keys.delete(e.key);
      });
    }

    isDown(key) {
      return this.keys.has(key);
    }
  }
