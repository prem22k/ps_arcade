// Serpentine Cyber Grid core initializing...
console.log('[SYS_INIT] Serpentine grid online.');

class SerpentSynth {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playFeed() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }
    
    playExplosion() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Synth crash sound using triangle oscillator and fast decay
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.4);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    }
    
    playCharge() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }
}

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
        this.synth = new SerpentSynth();
        
        this.init();
    }
    
    init() {
        this.recordDisplay.innerText = this.highScore;
        this.setupEvents();
        this.logMessage("CYBER_SERPENT GRID SECURED // STEER CORE ENGINES", "info");
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
        this.synth.playCharge();
        this.logMessage("VECTOR SERPENT ENGAGED // COMMENCING GRID RUN", "warning");
        this.randomFood();
    }
    
    randomFood() {
        this.foodX = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
        this.foodY = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
    }
    
    logMessage(message, type = 'info') {
        const logsEl = document.getElementById('terminal-logs');
        if (!logsEl) return;
        
        const time = new Date().toLocaleTimeString().split(' ')[0];
        const line = document.createElement('div');
        line.className = `log-line log-${type}`;
        
        let prefix = '[SYS_INFO]';
        if (type === 'success') prefix = '[SEC_OK]  ';
        if (type === 'error')   prefix = '[ALERT]   ';
        if (type === 'warning') prefix = '[WARN]    ';
        
        line.innerText = `${time} - ${prefix} > ${message}`;
        logsEl.appendChild(line);
        logsEl.scrollTop = logsEl.scrollHeight;
    }
}

const game = new CyberGridSerpentine();
window.game = game;
