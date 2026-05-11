import { Player } from "./scripts/player";
window.addEventListener('load', function () {
    const canvas = document.getElementById("canvas1")
    const ctx = canvas.getContext("2d");
    ctx.fillRect(50, 50, 150, 100);

    class Game{
        constructor(width, height) {
        this.width = width,
        this.height = height,
        this.player = new Player();
        }
        update(){

        }
        draw(){

        }
    }
});