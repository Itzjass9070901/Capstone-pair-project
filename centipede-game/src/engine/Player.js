import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SPEED } from "./Constants";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 20;
    this.height = 20;
    this.x = CANVAS_WIDTH / 2 - this.width / 2;
    this.y = CANVAS_HEIGHT - this.height * 2;

    this.shootCooldown = 0;
    this.shootDelay = 200;
  }

  update(delta) {
    const input = this.game.input;

    if (input.isDown("ArrowLeft")) {
      this.x -= PLAYER_SPEED;
    }
    if (input.isDown("ArrowRight")) {
      this.x += PLAYER_SPEED;
    }

    if (this.x < 0) this.x = 0;
    if (this.x > CANVAS_WIDTH - this.width) {
      this.x = CANVAS_WIDTH - this.width;
    }

    this.shootCooldown -= delta;
    if (input.isDown(" ") && this.shootCooldown <= 0 && !this.game.gameOver) {
      this.shoot();
      this.shootCooldown = this.shootDelay;
    }
  }

  shoot() {
    const bulletX = this.x + this.width / 2 - 2;
    const bulletY = this.y;
    this.game.shoot(bulletX, bulletY);
  }

  draw(ctx) {
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
