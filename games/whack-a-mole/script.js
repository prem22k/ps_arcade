// Cyber Mole Disruptor matrix core initializing...
console.log('[SYS_INIT] Cyber Mole matrix online.');

class CyberMoleSynth {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    
    playPop() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    }
    
    playZap() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }
    
    playWarning() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    }
}

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
        this.synth = new CyberMoleSynth();
        
        this.gameInterval = null;
        this.countdownInterval = null;
        this.moleClicked = false;
        this.speedCoeff = 1000;
        
        this.init();
    }
    
    init() {
        this.recordDisplay.innerText = this.highScore;
        this.setupEvents();
        this.logMessage("CYBER_DISRUPTER SYS_INIT ACTIVE // RADAR STANDBY", "info");
        
        // Sync mute status from global localStorage if available
        const globalSound = localStorage.getItem('arcade_sound_enabled');
        if (globalSound === 'false') {
            this.synth.muted = true;
        }
    }
    
    setupEvents() {
        this.holes.forEach(hole => {
            hole.addEventListener('click', () => {
                if (!this.gameActive) return;
                if (hole.classList.contains('active')) {
                    if (this.moleClicked) return;
                    this.registerHit(hole);
                }
            });
        });
        
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('stop-btn').addEventListener('click', () => this.stopGame());
    }
    
    randomHole() {
        let index = Math.floor(Math.random() * this.holes.length);
        while (index === this.lastHoleIndex) {
            index = Math.floor(Math.random() * this.holes.length);
        }
        this.lastHoleIndex = index;
        return this.holes[index];
    }
    
    showMole() {
        this.holes.forEach(hole => hole.classList.remove('active'));
        this.moleClicked = false;
        
        const activeHole = this.randomHole();
        activeHole.classList.add('active');
        this.synth.playPop();
        
        // Speed scaling based on score
        clearInterval(this.gameInterval);
        this.speedCoeff = Math.max(500, 1000 - (this.score * 5));
        this.gameInterval = setInterval(() => this.showMole(), this.speedCoeff);
    }
    
    startGame() {
        clearInterval(this.gameInterval);
        clearInterval(this.countdownInterval);
        this.holes.forEach(hole => hole.classList.remove('active'));
        
        this.score = 0;
        this.timeLeft = 30;
        this.gameActive = true;
        this.scoreDisplay.innerText = this.score;
        this.updateTimeDisplay();
        this.synth.init();
        
        this.showMole();
        this.gameInterval = setInterval(() => this.showMole(), this.speedCoeff);
        
        this.countdownInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimeDisplay();
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        this.logMessage("GRID DISRUPTION INITIATED // ENGAGE VECTORS", "warning");
    }
    
    registerHit(hole) {
        this.score += 10;
        this.scoreDisplay.innerText = this.score;
        this.synth.playZap();
        this.moleClicked = true;
        this.logMessage(`VECTOR SECTOR DISRUPTED (+10)`, "success");
        hole.classList.remove('active');
    }
    
    updateTimeDisplay() {
        const timeEl = document.getElementById('time-display');
        if (timeEl) timeEl.innerText = `${this.timeLeft}s`;
    }
    
    endGame() {
        clearInterval(this.gameInterval);
        clearInterval(this.countdownInterval);
        this.gameActive = false;
        this.holes.forEach(hole => hole.classList.remove('active'));
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('whack_high_score', this.highScore);
            this.recordDisplay.innerText = this.highScore;
            this.logMessage(`NEW HIGH RECORD ESTABLISHED: ${this.highScore} POINTS`, "success");
        }
        
        this.synth.playWarning();
        this.logMessage(`GRID TERMINATED // FINAL SCORE: ${this.score}`, "error");
    }
    
    stopGame() {
        if (!this.gameActive) return;
        this.endGame();
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

const game = new CyberMoleDisruptor();
window.game = game;
