type Direction = 'up' | 'down' | 'left' | 'right';
type Pos = [number, number];

class SnakeGame {
    private body: Pos[];
    private food?: Pos;
    private direction: Direction = 'right';
    private isPaused: boolean = true;

    constructor(
        private canvas: HTMLCanvasElement, 
        private arenaSize: number, 
        private snakeSpeed: number, 
        private wall?: Pos[]
    ) {
        this.arenaSize = arenaSize;

        this.body = this.getSnakeInitialPos();
        this.food = this.getFoodRandomPos();

        this.draw();

        window.addEventListener('keydown', (e) => this.switchSnakeDirection(e));
    }

    draw() {
        const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        const canvasSize = this.canvas.width;
        const pixelSize = canvasSize / this.arenaSize;

        ctx.fillStyle = '#87D973';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        for (let x = 0; x < this.arenaSize; x++) {
            for (let y = 0; y < this.arenaSize; y++) {
                const bodyIndex = this.body.findIndex(pos => this.isArraysEqual(pos, [x, y]));
                const wallIndex = this.wall?.findIndex(pos => this.isArraysEqual(pos, [x, y]));
                
                const hasFood = this.food && this.isArraysEqual(this.food, [x, y]);

                if (bodyIndex !== -1) ctx.fillStyle = this.isEven(bodyIndex) ? '#3A29A8' : '#4430BE';
                else if (wallIndex !== undefined && wallIndex !== -1) ctx.fillStyle = this.isEven(wallIndex) ? '#373737' : '#3C3C3C';
                else if (hasFood) ctx.fillStyle = '#BE3049';
                else if ((this.isEven(x) && this.isOdd(y)) || (this.isOdd(x) && this.isEven(y))) ctx.fillStyle = '#7ECE6A';  
                else continue;

                const food = this.food as number[];

                const xPos = hasFood ? food[0] : x;
                const yPos = hasFood ? food[1] : y;

                ctx.fillRect(xPos * pixelSize, yPos * pixelSize, pixelSize, pixelSize);  
            }   
        }

        if (!this.isPaused) return;

        ctx.fillStyle = '#0008';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        ctx.fillStyle = '#fff';
        ctx.font = '50px Minecraft';   
        ctx.textAlign = "center";

        const isSnakeStarting = this.isArraysEqual(this.getSnakeInitialPos().flat(), this.body.flat());

        if (isSnakeStarting) {
            ctx.fillText("Jogar Snake", canvasSize / 2, canvasSize / 2); 
        } else if (this.body.length === this.arenaSize ** 2) {
            ctx.fillText("Parabens", canvasSize / 2, canvasSize / 2);
        } else {
            ctx.fillText("Jogar Novamente", canvasSize / 2, canvasSize / 2); 
            ctx.fillText(`Pontos: ${this.getSnakePonctuation()}`, canvasSize / 2, (canvasSize / 2) - 100);
        }
    }

    move() {
        if (this.isPaused) return;
        const currentHead = this.body[this.body.length - 1];

        switch (this.direction) {
            case 'up':
                this.body.push([currentHead[0], currentHead[1] - 1]);
                break;
            case 'down':
                this.body.push([currentHead[0], currentHead[1] + 1]);
                break;
            case 'left':
                this.body.push([currentHead[0] - 1, currentHead[1]]);
                break;
            case 'right':
                this.body.push([currentHead[0] + 1, currentHead[1]]);
                break;
        }

        const head = this.body[this.body.length - 1];
        const body = this.body.slice(0, -1);

        const isBodyColiding = body.some(pos => this.isArraysEqual(pos, head));
        const isWallColiding = this.wall?.some(pos => this.isArraysEqual(pos, head));
        const isArenaColiding = head.some(pos => pos < 0 || pos >= this.arenaSize);

        if (this.food && this.isArraysEqual(head, this.food)) {
            this.food = this.getFoodRandomPos();
        } else if (isBodyColiding || isWallColiding || isArenaColiding || this.body.length === this.arenaSize ** 2) {
            this.isPaused = true;
            this.body.pop();
        } else {
            this.body.shift();
        }

        this.draw();

        if (this.isPaused) return;

        setTimeout(() => {
            this.move();
        }, 1000 / this.snakeSpeed);
    }

    switchSnakeDirection(event: KeyboardEvent) {
        if (event.key === 'ArrowUp' || event.key === 'w') {
            if (this.direction === 'down' && !this.isPaused) return;
            this.direction = 'up';
        } else if (event.key === 'ArrowDown' || event.key === 's') {
            if (this.direction === 'up' && !this.isPaused) return;
            this.direction = 'down';
        } else if(event.key === 'ArrowLeft' || event.key === 'a') {
            if (this.direction === 'right' && !this.isPaused) return;
            this.direction = 'left';
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            if (this.direction === 'left' && !this.isPaused) return;
            this.direction = 'right';
        }

        if (this.isPaused) {
            this.body = this.getSnakeInitialPos();
            if (!this.food) this.food = this.getFoodRandomPos();
            this.isPaused = false;
            this.move();
        }
    }

    getAvailableSpots() {
        const availableSpots: Pos[] = [];

        for (let x = 0; x < this.arenaSize; x++) {
            for (let y = 0; y < this.arenaSize; y++) {
                const currentPos: Pos = [x, y];
                const isInBody = this.body.some(pos => this.isArraysEqual(pos, currentPos));
                const isInColiders = this.wall?.some(pos => this.isArraysEqual(pos, currentPos));

                if (isInBody || isInColiders) continue;
                availableSpots.push(currentPos);
            }   
        }

        return availableSpots;
    }

    getFoodRandomPos(): Pos | undefined {
        const availableSpots = this.getAvailableSpots();
        if (availableSpots.length === 0) return undefined;

        const random = Math.floor(Math.random() * availableSpots.length);
        return availableSpots[random];
    }

    getSnakeInitialPos(): Pos[] {
        const y = Math.floor(this.arenaSize / 2);
        const x = Math.floor(this.arenaSize / 4);

        return [[x, y], [x + 1, y], [x + 2, y]];
    }

    getSnakePonctuation() {
        const initialPos = this.getSnakeInitialPos();

        return this.body.length - initialPos.length;
    }

    isArraysEqual(...arrays: unknown[][]) {
        const firstArray = arrays[0];

        for (const array of arrays) {
            if (array.length !== firstArray.length) return false;

            for (var i = 0; i < array.length; ++i) {
              if (array[i] !== firstArray[i]) return false;
            }
        }

        return true;
    }

    isEven(value: number) {
        return value % 2 === 0;
    }

    isOdd(value: number) {
        return value % 2 === 1;
    }
 }

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

const snake = new SnakeGame(canvas, 20, 10, []);