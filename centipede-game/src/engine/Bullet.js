import { BULLET_SPEED } from "./Constants";

export class Bullet {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 10;
    this.markedForDeletion = false;
  }

  update(delta) {
    this.y -= BULLET_SPEED;

    if (this.y < -this.height) {
      this.markedForDeletion = true;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
