type Direction = 'up' | 'down' | 'left' | 'right';

class Snake {
    private body: number[][];
    private food: number[];
    private direction: Direction = 'right';
    private isPaused: boolean = true;

    constructor(public canvas: HTMLCanvasElement, public arenaSize: number) {
        this.arenaSize = arenaSize;
        this.body = this.getCenterPosition();

        this.food = this.getFoodPosition();
        this.draw();

        window.addEventListener('keydown', (e) => this.switchDirection(e))
    }

    draw() {
        const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        const canvasSize = this.canvas.width;
        const snakeSize = canvasSize / this.arenaSize;

        ctx.fillStyle = '#87D973';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        ctx.lineWidth = 3;

        for (let x = 0; x < this.arenaSize; x++) {
            for (let y = 0; y < this.arenaSize; y++) {
                if ((x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0)) {
                    ctx.fillStyle = '#7ECE6A';  
                    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);  
                }
            }   
        }
        
        this.body.forEach(([x, y], idx) => {
            if (idx % 2 === 0) {
                ctx.fillStyle = '#3A29A8';
            } else {
                ctx.fillStyle = '#4430BE';
            }
            ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
        });

        if (this.food) {
            ctx.fillStyle = '#BE3049';
            ctx.fillRect(this.food[0] * snakeSize, this.food[1] * snakeSize, snakeSize, snakeSize);
        }   

        if (this.isPaused) {
            ctx.fillStyle = '#0006';
            ctx.fillRect(0, 0, canvasSize, canvasSize);

            ctx.fillStyle = '#fff';
            ctx.font = '50px Minecraft';   
            ctx.textAlign = "center";

            const centerPosition = this.getCenterPosition();
            const isEqualToStart = centerPosition.flat().every((pos, idx) => this.body.flat()[idx] === pos);

            if (isEqualToStart && this.body.length === centerPosition.length) {
                ctx.fillText("Jogar Snake", canvasSize / 2, canvasSize / 2); 
            } else if (this.body.length === this.arenaSize ** 2) {
                ctx.fillText("Parabens", canvasSize / 2, canvasSize / 2);
            } else {
                ctx.fillText("Jogar Novamente", canvasSize / 2, canvasSize / 2); 

                ctx.fillText(`Pontos: ${this.body.length - centerPosition.length}`, canvasSize / 2, (canvasSize / 2) - 100);
            }
        }
    }

    move() {
        if (this.isPaused) return;
        
        const head = this.body[this.body.length - 1];
        const prevBody = [...this.body];

        switch (this.direction) {
            case 'up':
                this.body.push([head[0], head[1] - 1]);
                break;
            case 'down':
                this.body.push([head[0], head[1] + 1]);
                break;
            case 'left':
                this.body.push([head[0] - 1, head[1]]);
                break;
            case 'right':
                this.body.push([head[0] + 1, head[1]]);
                break;
        }

        const currentPos = this.body[this.body.length - 1];
        const isBodyColiding = prevBody.some(pos => pos[0] === currentPos[0] && currentPos[1] === pos[1]);
        const isArenaColiding = currentPos.some(pos => pos < 0 || pos >= this.arenaSize);

        if (this.food && currentPos[0] === this.food[0] && currentPos[1] === this.food[1]) {
            this.food = this.getFoodPosition();
        } else if (isBodyColiding || isArenaColiding || this.body.length === this.arenaSize ** 2) {
            this.isPaused = true;
            this.body.pop();
        } else {
            this.body.shift();
        }

        this.draw();

        if (this.isPaused) return;

        setTimeout(() => {
            this.move();
        }, 100);
    }

    switchDirection(event: KeyboardEvent) {
        const wasPaused = this.isPaused;

        if (this.isPaused) {
            this.body = this.getCenterPosition();
            if (!this.food) this.food = this.getFoodPosition();
            this.isPaused = false;
            this.move();
        }

        if (event.key === 'ArrowUp' || event.key === 'w') {
            if (this.direction === 'down' && !wasPaused) return;
            this.direction = 'up';
        } else if (event.key === 'ArrowDown' || event.key === 's') {
            if (this.direction === 'up' && !wasPaused) return;
            this.direction = 'down';
        } else if(event.key === 'ArrowLeft' || event.key === 'a') {
            if (this.direction === 'right' && !wasPaused) return;
            this.direction = 'left';
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            if (this.direction === 'left' && !wasPaused) return;
            this.direction = 'right';
        }
    }

    getAvailableSpots() {
        const availableSpots = [];

        for (let x = 0; x < this.arenaSize; x++) {
            for (let y = 0; y < this.arenaSize; y++) {
                const isInBody = this.body.some(pos => pos[0] === x && pos[1] === y);

                if (isInBody) continue;

                availableSpots.push([x, y]);
            }   
        }

        return availableSpots;
    }

    getFoodPosition() {
        const availableSpots = this.getAvailableSpots();

        const random = Math.floor(Math.random() * availableSpots.length);

        return availableSpots[random];
    }

    getCenterPosition() {
        const y = parseInt(String(this.arenaSize / 2), 10);
        const x = parseInt(String(this.arenaSize / 4), 10);

        return [[x, y], [x + 1, y], [x + 2, y]];
    }
}

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

const snake = new Snake(canvas, 25);