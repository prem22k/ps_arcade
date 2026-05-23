// Serpentine Cyber Grid core initializing...
console.log('[SYS_INIT] Serpentine grid online.');

class CyberGridSerpentine {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = document.getElementById('score-display');
        this.recordDisplay = document.getElementById('record-display');
        
        this.gridSize = 20;
        this.snake = [
            {x: 160, y: 200},
            {x: 140, y: 200},
            {x: 120, y: 200}
        ];
        
        this.dx = this.gridSize;
        this.dy = 0;
        this.foodX = 240;
        this.foodY = 200;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snake_high_score')) || 0;
        this.gameActive = false;
        
        this.init();
    }
    
    init() {
        this.recordDisplay.innerText = this.highScore;
        this.setupEvents();
    }
    
    setupEvents() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if ((key === 'arrowup' || key === 'w') && this.dy === 0) { this.dx = 0; this.dy = -this.gridSize; }
            else if ((key === 'arrowdown' || key === 's') && this.dy === 0) { this.dx = 0; this.dy = this.gridSize; }
            else if ((key === 'arrowleft' || key === 'a') && this.dx === 0) { this.dx = -this.gridSize; this.dy = 0; }
            else if ((key === 'arrowright' || key === 'd') && this.dx === 0) { this.dx = this.gridSize; this.dy = 0; }
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => this.startSerpentine());
    }
    
    startSerpentine() {
        this.score = 0;
        this.dx = this.gridSize;
        this.dy = 0;
        this.snake = [
            {x: 160, y: 200},
            {x: 140, y: 200},
            {x: 120, y: 200}
        ];
        this.gameActive = true;
        this.scoreDisplay.innerText = this.score;
        this.randomFood();
    }
    
    randomFood() {
        this.foodX = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
        this.foodY = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
    }
}

const game = new CyberGridSerpentine();
window.game = game;
