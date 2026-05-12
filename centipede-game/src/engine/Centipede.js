import { CELL_SIZE } from "./Constants";
import { Mushroom } from "./Mushroom";

export class Centipede {
  constructor(game, length = 12, startX = 0, startY = 0, direction = 1) {
    this.game = game;
    this.segments = [];

    for (let i = 0; i < length; i++) {
      this.segments.push({
        x: startX + i * CELL_SIZE,
        y: startY,
        width: CELL_SIZE,
        height: CELL_SIZE,
        direction: direction,
        speed: 5 // already fast
      });
    }
  }

  update(delta) {
    for (let seg of this.segments) {
      seg.x += seg.direction * seg.speed;

      if (seg.x <= 0 || seg.x >= this.game.canvas.width - seg.width) {
        seg.direction *= -1;
        seg.y += CELL_SIZE;
      }

      for (let m of this.game.mushrooms) {
        if (this.game.checkCollision(seg, m)) {
          if (m.poison) {
            seg.y += CELL_SIZE * 2;
          } else {
            seg.direction *= -1;
            seg.y += CELL_SIZE;
          }
          break;
        }
      }
    }

    this.game.bullets.forEach((bullet) => {
      this.segments.forEach((seg, index) => {
        if (this.game.checkCollision(bullet, seg)) {
          bullet.markedForDeletion = true;

          const gridX = Math.floor(seg.x / CELL_SIZE);
          const gridY = Math.floor(seg.y / CELL_SIZE);
          this.game.mushrooms.push(new Mushroom(this.game, gridX, gridY));

          this.game.score += 10;

          this.split(index);
        }
      });
    });

    this.segments = this.segments.filter((s) => !s.markedForDeletion);
  }

  split(hitIndex) {
    const newSegments = this.segments.slice(hitIndex + 1);

    if (newSegments.length > 0) {
      const newCenti = new Centipede(this.game, 0);
      newCenti.segments = newSegments;
      this.game.centipedes.push(newCenti);
    }

    this.segments = this.segments.slice(0, hitIndex);
  }

  draw(ctx) {
    ctx.fillStyle = "#00FFFF";
    for (let seg of this.segments) {
      ctx.fillRect(seg.x, seg.y, seg.width, seg.height);
    }
  }
}
