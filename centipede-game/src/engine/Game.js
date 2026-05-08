export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.lastTime = 0;

    this.running = false;

    this.gameLoop = this.gameLoop.bind(this);
  }

  start() {
    this.running = true;
    requestAnimationFrame(this.gameLoop);
  }

  stop() {
    this.running = false;
  }

  gameLoop(timestamp) {
    if (!this.running) return;

    const deltaTime = (timestamp - this.lastTime) / 1000;

    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame(this.gameLoop);
  }

  update(dt) {}

  draw() {
    this.ctx.fillStyle = "#111";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "red";

    this.ctx.fillRect(100, 100, 50, 50);
  }
}
