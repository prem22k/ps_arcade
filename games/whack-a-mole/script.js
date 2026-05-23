// Cyber Mole Disruptor matrix core initializing...
console.log('[SYS_INIT] Cyber Mole matrix online.');

class CyberMoleDisruptor {
    constructor() {
        this.holes = document.querySelectorAll('.hole');
        this.scoreDisplay = document.getElementById('score-display');
        this.recordDisplay = document.getElementById('record-display');
        
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('whack_high_score')) || 0;
        this.timeLeft = 30;
        this.lastHoleIndex = -1;
        this.gameActive = false;
        
        this.init();
    }
    
    init() {
        this.recordDisplay.innerText = this.highScore;
        this.setupEvents();
    }
    
    setupEvents() {
        this.holes.forEach(hole => {
            hole.addEventListener('click', () => {
                if (!this.gameActive) return;
                if (hole.classList.contains('active')) {
                    this.registerHit(hole);
                }
            });
        });
        
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('stop-btn').addEventListener('click', () => this.stopGame());
    }
    
    startGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.gameActive = true;
        this.scoreDisplay.innerText = this.score;
        console.log('[SYS_GAME] Grid disruption sequence started.');
    }
    
    registerHit(hole) {
        this.score += 10;
        this.scoreDisplay.innerText = this.score;
        hole.classList.remove('active');
    }
    
    stopGame() {
        this.gameActive = false;
        console.log('[SYS_GAME] Disruption sequence aborted.');
    }
}

const game = new CyberMoleDisruptor();
window.game = game;
