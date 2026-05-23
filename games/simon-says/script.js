// Holographic Recall matrix core initializing...
console.log('[SYS_INIT] Simon sequence matrix initialized.');

class HolographicRecall {
    constructor() {
        this.statusIndicator = document.getElementById('status-indicator');
        this.recordDisplay = document.getElementById('record-display');
        
        this.sequence = [];
        this.userSequence = [];
        this.level = 0;
        this.highScore = parseInt(localStorage.getItem('simon_high_score')) || 0;
        this.gameActive = false;
        this.playingSequence = false;
        
        this.init();
    }
    
    init() {
        this.recordDisplay.innerText = this.highScore;
        this.setupEvents();
    }
    
    setupEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        
        document.querySelectorAll('.panel').forEach(panel => {
            panel.addEventListener('click', () => {
                if (!this.gameActive || this.playingSequence) return;
                const color = panel.getAttribute('data-color');
                this.lightUp(color);
                this.userSequence.push(color);
                this.checkUserSequence(this.userSequence.length - 1);
            });
        });
    }
    
    lightUp(color) {
        const panel = document.querySelector('.panel.' + color);
        panel.classList.add('active');
        setTimeout(() => panel.classList.remove('active'), 250);
    }
    
    startGame() {
        this.sequence = [];
        this.level = 0;
        this.gameActive = true;
        this.nextLevel();
    }
    
    nextLevel() {
        this.userSequence = [];
        this.level++;
        this.statusIndicator.innerText = this.level;
        
        const colors = ['green', 'red', 'yellow', 'blue'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.sequence.push(randomColor);
    }
    
    checkUserSequence(index) {
        if (this.userSequence[index] !== this.sequence[index]) {
            this.triggerGameOver();
            return;
        }
        
        if (this.userSequence.length === this.sequence.length) {
            setTimeout(() => this.nextLevel(), 1000);
        }
    }
    
    triggerGameOver() {
        this.gameActive = false;
        this.sequence = [];
        this.level = 0;
        this.statusIndicator.innerText = "0";
    }
}

const game = new HolographicRecall();
window.game = game;
