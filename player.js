export class Player {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = 250;
        this.y = 400;
    }
    update(){

    }
    draw(context) {
        context.fillStyle = "red"
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}