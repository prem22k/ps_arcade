// Holographic Recall matrix core initializing...
console.log('[SYS_INIT] Simon sequence matrix initialized.');

class SimonSynth {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.freqs = {
            green: 261.63, // C4
            red: 329.63,   // E4
            yellow: 392.00, // G4
            blue: 523.25   // C5
        };
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playBeep(color) {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(this.freqs[color], now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    }
    
    playFail() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.45);
        
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
    }
}

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
        this.synth = new SimonSynth();
        
        this.init();
    }
    
    init() {
        this.recordDisplay.innerText = this.highScore;
        this.setupEvents();
        this.logMessage("HARMONIC MATRIX ONLINE // CORE CALIBRATED", "info");
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
        this.synth.playBeep(color);
        setTimeout(() => panel.classList.remove('active'), 250);
    }
    
    startGame() {
        this.sequence = [];
        this.level = 0;
        this.gameActive = true;
        this.logMessage("RESONANCE CHANNELS ALIGNED // ENGAGING", "warning");
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
            this.logMessage(`MATRIX LEVEL_${this.level} DECIPHERED`, "success");
            setTimeout(() => this.nextLevel(), 1000);
        }
    }
    
    triggerGameOver() {
        this.gameActive = false;
        this.sequence = [];
        this.level = 0;
        this.statusIndicator.innerText = "0";
        this.synth.playFail();
        this.logMessage("FREQUENCY DISSONANCE DETECTED // DUMP", "error");
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

const game = new HolographicRecall();
window.game = game;
