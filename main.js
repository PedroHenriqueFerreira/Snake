"use strict";
class Snake {
    constructor(canvas, gameSize) {
        this.canvas = canvas;
        this.gameSize = gameSize;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameSize = gameSize;
        this.body = [];
        this.direction = 'right';
        this.x = 0;
        this.y = 0;
        this.draw();
    }
    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
const canvas = document.querySelector('canvas');
new Snake(canvas, 20);
