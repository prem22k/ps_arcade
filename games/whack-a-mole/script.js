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
        
        this.init();
    }
    
    init() {
        this.recordDisplay.innerText = this.highScore;
        this.setupEvents();
        this.logMessage("CYBER_DISRUPTER SYS_INIT ACTIVE // RADAR STANDBY", "info");
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
        this.logMessage("GRID DISRUPTION INITIATED // ENGAGE VECTORS", "warning");
    }
    
    registerHit(hole) {
        this.score += 10;
        this.scoreDisplay.innerText = this.score;
        this.synth.playZap();
        this.logMessage(`VECTOR TARGET SECTOR DISRUPTED (+10)`, "success");
        hole.classList.remove('active');
    }
    
    stopGame() {
        this.gameActive = false;
        this.synth.playWarning();
        this.logMessage("SECURITY SEQUENCE HALTED // DISRUPTER CORE SAFE", "error");
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
