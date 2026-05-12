import { CANVAS_WIDTH, CANVAS_HEIGHT, CELL_SIZE } from "./Constants";
import { Player } from "./Player";
import { InputHandler } from "./InputHandler";
import { Bullet } from "./Bullet";
import { Mushroom } from "./Mushroom";
import { Centipede } from "./Centipede";

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.lastTime = 0;
    this.animationId = null;

    this.input = new InputHandler();
    this.player = new Player(this);

    this.bullets = [];
    this.mushrooms = [];
    this.centipedes = [new Centipede(this, 12)];

    this.score = 0;
    this.level = 1;
    this.gameOver = false;

    this.showStartMenu = true;

    this.generateMushrooms();

    // Listen for Enter to start game
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && this.showStartMenu) {
        this.showStartMenu = false;
      }
    });
  }

  start() {
    this.lastTime = performance.now();
    const loop = (time) => {
      const delta = time - this.lastTime;
      this.lastTime = time;

      this.update(delta);
      this.draw();

      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  shoot(x, y) {
    this.bullets.push(new Bullet(this, x, y));
  }

  generateMushrooms() {
    const cols = CANVAS_WIDTH / CELL_SIZE;
    const rows = CANVAS_HEIGHT / CELL_SIZE;

    for (let y = 2; y < rows - 4; y++) {
      for (let x = 0; x < cols; x++) {
        if (Math.random() < 0.05) {
          this.mushrooms.push(new Mushroom(this, x, y));
        }
      }
    }
  }

  nextLevel() {
    this.level++;
    const newSpeed = 3 + this.level;
    const newLength = 10 + this.level * 2;

    const newCenti = new Centipede(this, newLength);
    newCenti.segments.forEach((seg) => (seg.speed = newSpeed));
    this.centipedes.push(newCenti);
  }

  checkCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  update(delta) {
    // Stop everything until Enter is pressed
    if (this.showStartMenu) return;

    if (this.gameOver) return;

    this.player.update(delta);

    this.bullets.forEach((b) => b.update(delta));
    this.bullets = this.bullets.filter((b) => !b.markedForDeletion);

    this.bullets.forEach((bullet) => {
      this.mushrooms.forEach((mushroom) => {
        if (this.checkCollision(bullet, mushroom)) {
          mushroom.hit();
          bullet.markedForDeletion = true;
          this.score += 1;
        }
      });
    });

    this.mushrooms = this.mushrooms.filter((m) => !m.markedForDeletion);

    this.centipedes.forEach((c) => c.update(delta));
    this.centipedes = this.centipedes.filter((c) => c.segments.length > 0);

    this.centipedes.forEach((c) => {
      c.segments.forEach((seg) => {
        if (this.checkCollision(seg, this.player)) {
          this.gameOver = true;
        }
      });
    });

    if (this.centipedes.length === 0 && !this.gameOver) {
      this.nextLevel();
    }
  }

  drawStartMenu() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title
    this.ctx.fillStyle = "#00FFAA";
    this.ctx.font = "60px ArcadeClassic";
    this.ctx.textAlign = "center";
    this.ctx.fillText("CENTIPEDE", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

    // Flashing "Press Enter"
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      this.ctx.fillStyle = "white";
      this.ctx.font = "28px ArcadeClassic";
      this.ctx.fillText(
        "PRESS ENTER TO START",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 20,
      );
    }
  }

  draw() {
    // Start menu screen
    if (this.showStartMenu) {
      this.drawStartMenu();
      return;
    }

    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.mushrooms.forEach((m) => m.draw(this.ctx));
    this.centipedes.forEach((c) => c.draw(this.ctx));
    this.player.draw(this.ctx);
    this.bullets.forEach((b) => b.draw(this.ctx));

    this.ctx.fillStyle = "white";
    this.ctx.font = "20px ArcadeClassic";
    this.ctx.fillText("Score: " + this.score, 10, 20);
    this.ctx.fillText("Level: " + this.level, 10, 40);

    if (this.gameOver) {
      this.ctx.fillStyle = "white";
      this.ctx.font = "48px ArcadeClassic";
      this.ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  }
}
