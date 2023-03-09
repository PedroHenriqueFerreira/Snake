class Snake {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly body: number[][];
    private direction: 'up' | 'down' | 'left' | 'right';
    private x: number;
    private y: number;

    constructor(public canvas: HTMLCanvasElement, public gameSize: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
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

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

new Snake(canvas, 20);