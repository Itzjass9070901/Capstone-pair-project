import { CELL_SIZE } from "./Constants";

export class Mushroom {
  constructor(game, gridX, gridY) {
    this.game = game;
    this.gridX = gridX;
    this.gridY = gridY;

    this.x = gridX * CELL_SIZE;
    this.y = gridY * CELL_SIZE;

    this.width = CELL_SIZE;
    this.height = CELL_SIZE;

    this.health = 4;
    this.markedForDeletion = false;

    this.poison = Math.random() < 0.1; // 
  }

  hit() {
    this.health--;
    if (this.health <= 0) {
      this.markedForDeletion = true;
    }
  }

  draw(ctx) {
    const colors = [
      "#FF0000", // 1 HP
      "#FF6600", // 2 HP
      "#FF00AA", // 3 HP
      "#8000FF", // 4 HP
    ];

    if (this.poison) {
      ctx.fillStyle = "#00FFAA";
    } else {
      ctx.fillStyle = colors[this.health - 1] || "#FFFFFF";
    }

    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
