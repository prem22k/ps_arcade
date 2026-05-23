// Stacker Reactor Matrix core initializing...
console.log('[SYS_INIT] Quantum stacker core standby.');

class StackerSynth {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playDrop() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.12);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }
    
    playSuccess(isPerfect, score) {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const baseFreq = isPerfect ? 587.33 : 440.00; // D5 arpeggio or A4
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq + score * 10, now);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }
    
    playFail() {
        this.init();
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.5);
        
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
    }
}

class QuantumStacker {
    constructor() {
        this.gameActive = false;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('block_high_score')) || 0;
        this.activeBlockWidth = 200;
        this.colors = ['#ff0055', '#00f0ff', '#f1c40f', '#39ff14', '#9b59b6', '#e67e22'];
        this.currentColor = this.colors[0];
        this.dropping = false;
        this.stack = [];
        this.dropTimeout = null;
        this.synth = new StackerSynth();
        
        this.craneBlock = document.getElementById('crane-block');
        this.craneLine = document.getElementById('crane-line');
        this.towerContainer = document.getElementById('tower-container');
        this.actionBtn = document.getElementById('action-btn');
        this.scoreEl = document.getElementById('score');
        this.highScoreEl = document.getElementById('high-score');
        
        this.init();
    }
    
    init() {
        this.highScoreEl.innerText = this.highScore;
        this.setupEvents();
        this.logMessage("STACK REACTOR ACTIVE // SECURED STANDBY MATRIX", "info");
    }
    
    setupEvents() {
        this.actionBtn.addEventListener('click', () => {
            if (!this.gameActive) {
                this.resetGame();
            } else {
                this.dropBlock();
            }
        });
        
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameActive) this.dropBlock();
            }
        });
    }
    
    resetGame() {
        if (this.dropTimeout) clearTimeout(this.dropTimeout);
        this.score = 0;
        this.activeBlockWidth = 200;
        this.dropping = false;
        this.stack = [{left: 40, width: 240}];
        this.gameActive = true;
        this.logMessage("QUANTUM STACK ENGINE REBOOTED // INITIATING DROP DECK", "warning");
        
        this.scoreEl.innerText = this.score;
        
        const oldBlocks = document.querySelectorAll('.stacked-block, .falling-block');
        oldBlocks.forEach(b => b.remove());
        
        this.towerContainer.style.transform = 'translateY(0px)';
        this.actionBtn.innerText = "DROP_BLOCK";
        this.spawnNewSwinger();
    }
    
    spawnNewSwinger() {
        if (!this.gameActive) return;
        this.currentColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        this.craneBlock.style.animation = 'none';
        void this.craneBlock.offsetWidth;
        
        this.craneBlock.style.width = this.activeBlockWidth + 'px';
        this.craneBlock.style.backgroundColor = this.currentColor;
        this.craneBlock.style.display = 'block';
        this.craneLine.style.display = 'block';
        
        const swingMax = 320 - this.activeBlockWidth;
        this.craneBlock.style.setProperty('--swing-max', swingMax + 'px');
        
        const duration = Math.max(0.6, 2.0 - this.score * 0.08);
        this.craneBlock.style.animation = `swing ${duration}s ease-in-out infinite alternate`;
        
        this.dropping = false;
    }
    
    getCurrentLeft() {
        const computed = window.getComputedStyle(this.craneBlock);
        return parseFloat(computed.left) || 0;
    }
    
    dropBlock() {
        if (!this.gameActive || this.dropping) return;
        this.dropping = true;
        this.synth.playDrop();
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

const game = new QuantumStacker();
window.game = game;
